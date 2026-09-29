// ADR-0088: a fetch-only transport that renders pages with a local Chromium from the command
// line. Research: docs/decisions/2026-09-28-browser-transport. Offline: spawn is a stub.

import { test, describe, assert } from './harness.mjs';
import browser, { browserArgs, chromeErrorOf, findBrowser } from '../lib/browser-transport.mjs';
import { TRANSPORTS, satisfies, FETCH_SHAPE, selectTransport } from '../lib/transport.mjs';

describe('browser-transport');

const PAGE = `<html><head><title>File system | Node.js</title></head><body><main><h1>File system</h1>
${'<p>The fs.rename() method renames a file asynchronously and calls back when it is done.</p>'.repeat(40)}</main></body></html>`;
// What --dump-dom printed on 2026-09-28 behind a proxy whose CA Chromium did not trust: its own
// interstitial, exit 0 (the brief's contradiction section).
const PRIVACY = '<html><head><title>Privacy error</title></head><body><div id="main-frame-error">Your connection is not private '
  + '<span class="error-code">NET::ERR_CERT_AUTHORITY_INVALID</span></div></body></html>';

const spawnWith = (result) => {
  const calls = [];
  const spawn = (file, args, opts) => { calls.push({ file, args, opts }); return { status: 0, stdout: '', stderr: '', ...result }; };
  return { spawn, calls };
};

test('a rendered page becomes a graded capture through the keyless extractor', () => {
  const { spawn, calls } = spawnWith({ stdout: PAGE });
  const r = browser.scrape('https://nodejs.org/api/fs.html', { spawn, browserPath: '/opt/chrome', env: {} });
  assert.equal(r.ok, true, JSON.stringify(r));
  assert.equal(r.transport, 'browser');
  assert.equal(r.title, 'File system | Node.js');
  assert.match(r.markdown, /fs\.rename\(\) method renames a file/);
  assert.equal(r.completeness, 'full');
  assert.equal(calls[0].file, '/opt/chrome');
  assert.ok(calls[0].args.includes('--dump-dom') && calls[0].args.includes('--headless'));
  assert.equal(calls[0].args.at(-1), 'https://nodejs.org/api/fs.html', 'the URL is an argv element, last, never a shell word');
});

test('Chromium\'s own error page is a failure that names its code, though it exits 0', () => {
  assert.equal(chromeErrorOf(PRIVACY), 'ERR_CERT_AUTHORITY_INVALID');
  assert.equal(chromeErrorOf(PAGE), '');
  const { spawn } = spawnWith({ stdout: PRIVACY });
  const r = browser.scrape('https://x.invalid/a', { spawn, browserPath: '/opt/chrome', env: {} });
  assert.equal(r.ok, false);
  assert.match(r.error, /ERR_CERT_AUTHORITY_INVALID/);
});

test('a timeout, a non-zero exit and a missing browser are failures that say which', () => {
  const late = browser.scrape('https://x.invalid/a', { spawn: () => ({ status: null, signal: 'SIGTERM', error: Object.assign(new Error('spawnSync ETIMEDOUT'), { code: 'ETIMEDOUT' }), stdout: '' }), browserPath: '/opt/chrome', env: {} });
  assert.match(late.error, /did not finish/);
  const crashed = browser.scrape('https://x.invalid/a', { spawn: () => ({ status: 1, stdout: '', stderr: 'boom' }), browserPath: '/opt/chrome', env: {} });
  assert.match(crashed.error, /exited 1.*boom/);
  const none = browser.scrape('https://x.invalid/a', { browserPath: '', env: {}, exists: () => false });
  assert.equal(none.ok, false);
  assert.match(none.error, /no Chromium or Chrome found.*RESEARCH_KIT_BROWSER/);
});

test('the proxy is passed as --proxy-server, and the sandbox is off only for root', () => {
  const withProxy = browserArgs('https://x.invalid/a', { env: { HTTPS_PROXY: 'http://127.0.0.1:41103' }, uid: 1000 });
  assert.ok(withProxy.includes('--proxy-server=http://127.0.0.1:41103'));
  assert.ok(!withProxy.includes('--no-sandbox'));
  assert.ok(browserArgs('https://x.invalid/a', { env: {}, uid: 0 }).includes('--no-sandbox'));
  assert.ok(!browserArgs('https://x.invalid/a', { env: {}, uid: 0 }).some((a) => a.startsWith('--proxy-server')));
  assert.ok(!browserArgs('https://x.invalid/a', { env: {}, uid: 0 }).includes('--ignore-certificate-errors'), 'TLS is never weakened');
});

test('the browser is found by config, then environment, then the usual install paths', () => {
  const has = (p) => ['/cfg/chrome', '/env/chrome', '/usr/bin/chromium'].includes(p);
  assert.equal(findBrowser({ config: { browserPath: '/cfg/chrome' }, env: { RESEARCH_KIT_BROWSER: '/env/chrome' }, exists: has }), '/cfg/chrome');
  assert.equal(findBrowser({ config: {}, env: { RESEARCH_KIT_BROWSER: '/env/chrome' }, exists: has }), '/env/chrome');
  assert.equal(findBrowser({ config: {}, env: {}, exists: has, platform: 'linux' }), '/usr/bin/chromium');
  assert.equal(findBrowser({ config: {}, env: {}, exists: () => false, platform: 'linux' }), '');
});

test('it is a named transport with the fetch shape, chosen only when asked for', () => {
  assert.equal(TRANSPORTS.browser, browser);
  assert.ok(satisfies(browser, FETCH_SHAPE));
  const chosen = selectTransport({ explicit: 'browser', env: {}, config: {} });
  assert.equal(chosen.name, 'browser');
  assert.equal(chosen.search.name, 'http-keyless', 'the browser does not search; the keyless search does');
  const auto = selectTransport({ env: {}, config: {}, probe: () => ({ installed: false }) });
  assert.equal(auto.name, 'http-keyless', 'auto-detection is unchanged');
});

test('with a SerpAPI key, the browser is never asked to search: keyless searches beside SerpAPI', () => {
  // Found 2026-09-29 by the first live run of the browser transport: a SerpAPI key merged the
  // search side as "serpapi AND browser", and research.mjs died with "provider.search is not
  // a function" before collecting anything. The no-key route already swapped in keyless; the
  // merged route did not, and no offline test combined a key with a fetch-only transport.
  const chosen = selectTransport({ explicit: 'browser', env: { SERPAPI_API_KEY: 'test-key-not-real' }, config: {} });
  assert.equal(chosen.search.merged, true);
  for (const one of chosen.search.adapters) {
    assert.equal(typeof one.search, 'function', `${one.name} was put on the search side and cannot search`);
  }
  assert.deepEqual(chosen.search.adapters.map((one) => one.name), ['serpapi', 'http-keyless']);
  assert.match(chosen.search.why, /AND with http-keyless/);
});
