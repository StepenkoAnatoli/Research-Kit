// ADR-0088: a fetch-only transport that renders pages with a local Chromium from the command
// line. Research: docs/decisions/2026-09-28-browser-transport. Offline: the renderer is a stub.

import { test, describe, assert, fs, path, KIT_ROOT } from './harness.mjs';
import browser, { browserArgs, chromeErrorOf, findBrowser, renderGuarded } from '../lib/browser-transport.mjs';
import { REFUSAL_MARKER } from '../lib/browser-guard.mjs';
import { TRANSPORTS, satisfies, FETCH_SHAPE, selectTransport } from '../lib/transport.mjs';

describe('browser-transport');

const PAGE = `<html><head><title>File system | Node.js</title></head><body><main><h1>File system</h1>
${'<p>The fs.rename() method renames a file asynchronously and calls back when it is done.</p>'.repeat(40)}</main></body></html>`;
// What --dump-dom printed on 2026-09-28 behind a proxy whose CA Chromium did not trust: its own
// interstitial, exit 0 (the brief's contradiction section).
const PRIVACY = '<html><head><title>Privacy error</title></head><body><div id="main-frame-error">Your connection is not private '
  + '<span class="error-code">NET::ERR_CERT_AUTHORITY_INVALID</span></div></body></html>';

// Chromium is stubbed: `render` plays the guard child, answering as it would (ADR-0118).
const renderWith = (result) => {
  const calls = [];
  const render = (file, args, opts) => { calls.push({ file, args, opts }); return { status: 0, stdout: '', stderr: '', refused: [], ...result }; };
  return { render, calls };
};

test('a rendered page becomes a graded capture through the keyless extractor', () => {
  const { render, calls } = renderWith({ stdout: PAGE });
  const r = browser.scrape('https://nodejs.org/api/fs.html', { render, browserPath: '/opt/chrome', env: {} });
  assert.equal(r.ok, true, JSON.stringify(r));
  assert.equal(r.transport, 'browser');
  assert.equal(r.title, 'File system | Node.js');
  assert.match(r.markdown, /fs\.rename\(\) method renames a file/);
  assert.equal(r.completeness, 'full');
  assert.equal(calls[0].file, '/opt/chrome');
  assert.ok(calls[0].args.includes('--dump-dom') && calls[0].args.includes('--headless'));
  assert.equal(calls[0].args.at(-1), 'https://nodejs.org/api/fs.html', 'the URL is an argv element, last, never a shell word');
});

// Found 2026-09-30: every browser capture recorded `command: http-keyless browser <url>` - the
// keyless transport's name on a page no keyless request fetched. The command is an annotation,
// but it is written into a committed ledger, so it names the tool that ran.
test('the recorded command names the browser, not the keyless transport', () => {
  const { render } = renderWith({ stdout: PAGE });
  const r = browser.scrape('https://nodejs.org/api/fs.html', { render, browserPath: '/opt/chrome', env: {} });
  assert.equal(r.cmd, 'browser https://nodejs.org/api/fs.html');
  assert.equal(browser.command(['https://x.invalid/a b']), 'browser "https://x.invalid/a b"', 'a URL with a space is quoted');
  const none = browser.scrape('https://x.invalid/a', { render, browserPath: null, env: {}, exists: () => false, config: {} });
  assert.doesNotMatch(none.cmd, /http-keyless/, 'the refusal carries the same command');
});

test('Chromium\'s own error page is a failure that names its code, though it exits 0', () => {
  assert.equal(chromeErrorOf(PRIVACY), 'ERR_CERT_AUTHORITY_INVALID');
  assert.equal(chromeErrorOf(PAGE), '');
  const { render } = renderWith({ stdout: PRIVACY });
  const r = browser.scrape('https://x.invalid/a', { render, browserPath: '/opt/chrome', env: {} });
  assert.equal(r.ok, false);
  assert.match(r.error, /ERR_CERT_AUTHORITY_INVALID/);
});

test('a timeout, a non-zero exit and a missing browser are failures that say which', () => {
  const late = browser.scrape('https://x.invalid/a', { render: () => ({ status: null, signal: 'SIGTERM', error: Object.assign(new Error('spawnSync ETIMEDOUT'), { code: 'ETIMEDOUT' }), stdout: '' }), browserPath: '/opt/chrome', env: {} });
  assert.match(late.error, /did not finish/);
  const crashed = browser.scrape('https://x.invalid/a', { render: () => ({ status: 1, stdout: '', stderr: 'boom' }), browserPath: '/opt/chrome', env: {} });
  assert.match(crashed.error, /exited 1.*boom/);
  const none = browser.scrape('https://x.invalid/a', { browserPath: '', env: {}, exists: () => false });
  assert.equal(none.ok, false);
  assert.match(none.error, /no Chromium or Chrome found.*RESEARCH_KIT_BROWSER/);
});

test('Chromium is never pointed at the configured proxy itself: the guard is its proxy, and the sandbox is off only for root', () => {
  // The guard child adds --proxy-server for its own port (ADR-0118); a configured proxy is the
  // guard's upstream. Pointing Chromium at it directly would carry every request around the guard.
  const asUser = browserArgs('https://x.invalid/a', { uid: 1000 });
  assert.ok(!asUser.includes('--no-sandbox'));
  assert.ok(!asUser.some((a) => a.startsWith('--proxy-server')), 'the args name a proxy before the guard exists');
  assert.ok(browserArgs('https://x.invalid/a', { uid: 0 }).includes('--no-sandbox'));
  assert.ok(!browserArgs('https://x.invalid/a', { uid: 0 }).includes('--ignore-certificate-errors'), 'TLS is never weakened');
  assert.ok(asUser.includes('--disable-background-networking'), 'Chromium\'s own update and time traffic would go through the guard too');
  assert.deepEqual(asUser.slice(-2), ['--dump-dom', 'https://x.invalid/a'], 'the guard child inserts its flags before these two');
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

test('a browser killed by a signal is not reported as a timeout', () => {
  // Found 2026-09-29 by the live run: Chrome died 21 seconds into a 60-second budget and the
  // failure read "did not finish rendering within 60s" - any signal was taken for the
  // timeout, so the one line that could name the cause named the wrong one.
  const trapped = browser.scrape('https://x.invalid/a', {
    render: () => ({ status: null, signal: 'SIGTRAP', stdout: '', stderr: 'noise\n[FATAL:zygote_host_impl_linux.cc] No usable sandbox!\n' }),
    browserPath: '/opt/chrome', env: {},
  });
  assert.equal(trapped.ok, false);
  assert.doesNotMatch(trapped.error, /did not finish/);
  assert.match(trapped.error, /killed by SIGTRAP/);
  assert.match(trapped.error, /No usable sandbox/);
});

test('a crash names Chromium\'s FATAL line, not the stack trace\'s last line', () => {
  // Found 2026-09-29, live run 36518843676: "killed by SIGABRT: [end of stack trace]" - the
  // last stderr line of a Chromium crash is the dump's footer; the cause is the FATAL line.
  const r = browser.scrape('https://x.invalid/a', {
    render: () => ({ status: null, signal: 'SIGABRT', stdout: '',
      stderr: '[123:123:FATAL:zygote_host_impl_linux.cc(127)] No usable sandbox! See https://x/y\n#0 0x55 base::debug::StackTrace\n#1 0x56 logging::LogMessage\n[end of stack trace]\n' }),
    browserPath: '/opt/chrome', env: {},
  });
  assert.match(r.error, /killed by SIGABRT: .*FATAL.*No usable sandbox/);
  assert.doesNotMatch(r.error, /end of stack trace/);
});

test('a FATAL line outranks the ERROR noise the crash handler prints after it', () => {
  // Live run 36519057831: after the FATAL, crashpad logged "ERROR: ... open /sys/devices/
  // system/cpu/cpu0/cpufreq/scaling_max_freq: No such file", and that noise was reported as
  // the cause. A FATAL is the cause when there is one; ERROR only stands in when there is not.
  const r = browser.scrape('https://x.invalid/a', {
    render: () => ({ status: null, signal: 'SIGABRT', stdout: '',
      stderr: '[1:1:FATAL:some_file.cc(9)] Check failed: the real cause\n#0 0x1 frame\n[end of stack trace]\n[2:2:ERROR:crashpad/file_io_posix.cc:145] open /sys/devices/system/cpu/cpu0/cpufreq/scaling_max_freq: No such file or directory (2)\n' }),
    browserPath: '/opt/chrome', env: {},
  });
  assert.match(r.error, /FATAL.*the real cause/);
  assert.doesNotMatch(r.error, /cpufreq/);
});

// ADR-0092. Research: docs/decisions/2026-09-29-chromium-sandbox-userns.
test('on Linux, Chrome stable - the binary Ubuntu lets sandbox itself - is preferred', () => {
  // Found by live run 36519301132: on ubuntu-latest the kit picked a Chromium build that
  // AppArmor denies user namespaces, while Ubuntu's own profile allows Chrome stable (E-02).
  const all = () => true;
  assert.equal(findBrowser({ config: {}, env: {}, exists: all, platform: 'linux' }), '/opt/google/chrome/chrome');
  const onlyChromium = (p) => p === '/usr/bin/chromium';
  assert.equal(findBrowser({ config: {}, env: {}, exists: onlyChromium, platform: 'linux' }), '/usr/bin/chromium');
});

test('a denied sandbox names the remedies that keep it, never --no-sandbox', () => {
  const r = browser.scrape('https://x.invalid/a', {
    render: () => ({ status: null, signal: 'SIGTRAP', stdout: '',
      stderr: '[1:1:0929/035552.424135:FATAL:content/browser/zygote_host/zygote_host_impl_linux.cc:129] No usable sandbox! If you are running on Ubuntu 23.10+ or another Linux distro that has disabled unprivileged user namespaces with AppArmor, see https://chromium.googlesource.com/chromium/src/+/main/docs/security/apparmor-userns-restrictions.md\n' }),
    browserPath: '/usr/bin/chromium', env: {}, uid: 1001,
  });
  assert.equal(r.ok, false);
  assert.match(r.error, /No usable sandbox/);
  assert.match(r.error, /\/opt\/google\/chrome\/chrome/);
  assert.match(r.error, /CHROME_DEVEL_SANDBOX=\/opt\/google\/chrome\/chrome-sandbox/);
  assert.doesNotMatch(r.error, /--no-sandbox/);
});

// ADR-0118. ADR-0110 left the browser transport open, and ADR-0115 judged only the URL asked for:
// Chromium follows redirects, runs scripts that navigate, and loads frames and images inside
// itself. Every request now goes through the kit's guard proxy, run by the child the transport
// renders through; what the guard turned away comes back as `refused`, and a page that landed
// on a refusal is not a capture.
test('a page that led the browser into this machine\'s network is refused, by name, and not captured', () => {
  const refusal = `${REFUSAL_MARKER}: 169.254.169.254:80 - 169.254.169.254 is an internal address`;
  const { render } = renderWith({ stdout: `<html><body><pre>${refusal}</pre></body></html>`, refused: [{ host: '169.254.169.254:80', why: '169.254.169.254 is an internal address' }] });
  const r = browser.scrape('https://evil.example/a', { render, browserPath: '/opt/chrome', env: {} });
  assert.equal(r.ok, false, 'a refusal page was captured as the page');
  assert.match(r.error, /169\.254\.169\.254.*internal address/);
  assert.match(r.error, /RESEARCH_KIT_ALLOW_INTERNAL_REDIRECTS/);
  assert.equal(r.markdown, undefined);

  // A CONNECT the guard refused leaves Chromium on its own error page: named as the refusal, not as the code.
  const tunnel = renderWith({ stdout: PRIVACY.replace('ERR_CERT_AUTHORITY_INVALID', 'ERR_TUNNEL_CONNECTION_FAILED'), refused: [{ host: '10.0.0.8:443', why: '10.0.0.8 is an internal address' }] });
  const t = browser.scrape('https://evil.example/a', { render: tunnel.render, browserPath: '/opt/chrome', env: {} });
  assert.equal(t.ok, false);
  assert.match(t.error, /10\.0\.0\.8/);

  // A refused image on a page that still rendered is not a failure of the capture.
  const { render: partial } = renderWith({ stdout: PAGE, refused: [{ host: '10.0.0.9:80', why: '10.0.0.9 is an internal address' }] });
  assert.equal(browser.scrape('https://ok.example/a', { render: partial, browserPath: '/opt/chrome', env: {} }).ok, true);
});

test('by default the browser renders through the guard child, which is handed the URL and the operator\'s decision', () => {
  const src = fs.readFileSync(path.join(KIT_ROOT, 'lib', 'browser-transport.mjs'), 'utf8');
  assert.match(src, /render = renderGuarded/, 'the default renderer is not the guard');
  const jobs = [];
  const spawn = (file, args, opts) => { jobs.push({ file, args, job: JSON.parse(opts.input) }); return { status: 0, stdout: JSON.stringify({ status: 0, stdout: PAGE, stderr: '', refused: [] }), stderr: '' }; };
  const r = renderGuarded('/opt/chrome', browserArgs('https://x.invalid/a', { uid: 1000 }), { url: 'https://x.invalid/a', env: { RESEARCH_KIT_ALLOW_INTERNAL_REDIRECTS: '1' }, spawn, nodePath: '/opt/node' });
  assert.equal(r.stdout, PAGE);
  assert.equal(jobs[0].file, '/opt/node');
  assert.match(jobs[0].args[0], /browser-guard\.mjs$/);
  assert.equal(jobs[0].job.url, 'https://x.invalid/a');
  assert.equal(jobs[0].job.allowInternalRedirects, true, 'the opt-out did not reach the child');
  assert.equal(jobs[0].job.binary, '/opt/chrome');
  const plain = renderGuarded('/opt/chrome', [], { url: 'https://x.invalid/a', env: {}, spawn, nodePath: '/opt/node' });
  assert.equal(jobs[1].job.allowInternalRedirects, undefined, 'with nothing decided, the child decides from the URL');
  assert.equal(plain.stdout, PAGE);
});
