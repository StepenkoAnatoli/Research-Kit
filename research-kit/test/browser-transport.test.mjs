// ADR-0088: a fetch-only transport that renders pages with a local Chromium from the command
// line. Research: docs/decisions/2026-09-28-browser-transport. Offline: spawn is a stub.

import { test, describe, assert, fs, path, KIT_ROOT } from './harness.mjs';
import browser, { browserArgs, chromeErrorOf, findBrowser } from '../lib/browser-transport.mjs';
import { TRANSPORTS, satisfies, FETCH_SHAPE, selectTransport } from '../lib/transport.mjs';

describe('browser-transport');

// The server-side redirect check runs before Chromium (ADR-0115); these tests stub Chromium, so
// they stub that check too, and the suite stays offline.
const NO_REDIRECT = () => ({});

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
  const r = browser.scrape('https://nodejs.org/api/fs.html', { spawn, browserPath: '/opt/chrome', env: {}, redirects: NO_REDIRECT });
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
  const { spawn } = spawnWith({ stdout: PAGE });
  const r = browser.scrape('https://nodejs.org/api/fs.html', { spawn, browserPath: '/opt/chrome', env: {}, redirects: NO_REDIRECT });
  assert.equal(r.cmd, 'browser https://nodejs.org/api/fs.html');
  assert.equal(browser.command(['https://x.invalid/a b']), 'browser "https://x.invalid/a b"', 'a URL with a space is quoted');
  const none = browser.scrape('https://x.invalid/a', { spawn, browserPath: null, env: {}, exists: () => false, config: {} });
  assert.doesNotMatch(none.cmd, /http-keyless/, 'the refusal carries the same command');
});

test('Chromium\'s own error page is a failure that names its code, though it exits 0', () => {
  assert.equal(chromeErrorOf(PRIVACY), 'ERR_CERT_AUTHORITY_INVALID');
  assert.equal(chromeErrorOf(PAGE), '');
  const { spawn } = spawnWith({ stdout: PRIVACY });
  const r = browser.scrape('https://x.invalid/a', { spawn, browserPath: '/opt/chrome', env: {}, redirects: NO_REDIRECT });
  assert.equal(r.ok, false);
  assert.match(r.error, /ERR_CERT_AUTHORITY_INVALID/);
});

test('a timeout, a non-zero exit and a missing browser are failures that say which', () => {
  const late = browser.scrape('https://x.invalid/a', { spawn: () => ({ status: null, signal: 'SIGTERM', error: Object.assign(new Error('spawnSync ETIMEDOUT'), { code: 'ETIMEDOUT' }), stdout: '' }), browserPath: '/opt/chrome', env: {}, redirects: NO_REDIRECT });
  assert.match(late.error, /did not finish/);
  const crashed = browser.scrape('https://x.invalid/a', { spawn: () => ({ status: 1, stdout: '', stderr: 'boom' }), browserPath: '/opt/chrome', env: {}, redirects: NO_REDIRECT });
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

test('a browser killed by a signal is not reported as a timeout', () => {
  // Found 2026-09-29 by the live run: Chrome died 21 seconds into a 60-second budget and the
  // failure read "did not finish rendering within 60s" - any signal was taken for the
  // timeout, so the one line that could name the cause named the wrong one.
  const trapped = browser.scrape('https://x.invalid/a', {
    spawn: () => ({ status: null, signal: 'SIGTRAP', stdout: '', stderr: 'noise\n[FATAL:zygote_host_impl_linux.cc] No usable sandbox!\n' }),
    browserPath: '/opt/chrome', env: {}, redirects: NO_REDIRECT,
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
    spawn: () => ({ status: null, signal: 'SIGABRT', stdout: '',
      stderr: '[123:123:FATAL:zygote_host_impl_linux.cc(127)] No usable sandbox! See https://x/y\n#0 0x55 base::debug::StackTrace\n#1 0x56 logging::LogMessage\n[end of stack trace]\n' }),
    browserPath: '/opt/chrome', env: {}, redirects: NO_REDIRECT,
  });
  assert.match(r.error, /killed by SIGABRT: .*FATAL.*No usable sandbox/);
  assert.doesNotMatch(r.error, /end of stack trace/);
});

test('a FATAL line outranks the ERROR noise the crash handler prints after it', () => {
  // Live run 36519057831: after the FATAL, crashpad logged "ERROR: ... open /sys/devices/
  // system/cpu/cpu0/cpufreq/scaling_max_freq: No such file", and that noise was reported as
  // the cause. A FATAL is the cause when there is one; ERROR only stands in when there is not.
  const r = browser.scrape('https://x.invalid/a', {
    spawn: () => ({ status: null, signal: 'SIGABRT', stdout: '',
      stderr: '[1:1:FATAL:some_file.cc(9)] Check failed: the real cause\n#0 0x1 frame\n[end of stack trace]\n[2:2:ERROR:crashpad/file_io_posix.cc:145] open /sys/devices/system/cpu/cpu0/cpufreq/scaling_max_freq: No such file or directory (2)\n' }),
    browserPath: '/opt/chrome', env: {}, redirects: NO_REDIRECT,
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
    spawn: () => ({ status: null, signal: 'SIGTRAP', stdout: '',
      stderr: '[1:1:0929/035552.424135:FATAL:content/browser/zygote_host/zygote_host_impl_linux.cc:129] No usable sandbox! If you are running on Ubuntu 23.10+ or another Linux distro that has disabled unprivileged user namespaces with AppArmor, see https://chromium.googlesource.com/chromium/src/+/main/docs/security/apparmor-userns-restrictions.md\n' }),
    browserPath: '/usr/bin/chromium', env: {}, uid: 1001, redirects: NO_REDIRECT,
  });
  assert.equal(r.ok, false);
  assert.match(r.error, /No usable sandbox/);
  assert.match(r.error, /\/opt\/google\/chrome\/chrome/);
  assert.match(r.error, /CHROME_DEVEL_SANDBOX=\/opt\/google\/chrome\/chrome-sandbox/);
  assert.doesNotMatch(r.error, /--no-sandbox/);
});

// ADR-0115. ADR-0110 left the browser transport open: Chromium follows redirects inside itself and
// --dump-dom reports no final URL, so a public page redirecting to 127.0.0.1 or the metadata
// endpoint was rendered and captured. The URL's server redirects are now followed first, with
// the keyless fetch and its guards, and a redirect inward is refused before Chromium starts.
test('a URL that redirects into this machine\'s network is refused before the browser starts', () => {
  let started = 0;
  const spawn = () => { started += 1; return { status: 0, stdout: '<html><body><main><p>x</p></main></body></html>', stderr: '' }; };
  const refused = 'refused to follow a redirect from evil.example to 169.254.169.254 - 169.254.169.254 is an internal address';
  const r = browser.scrape('https://evil.example/a', { spawn, browserPath: '/opt/chrome', env: {}, redirects: () => ({ refused }) });
  assert.equal(r.ok, false, 'the browser rendered a page that redirects inward');
  assert.equal(r.error, refused);
  assert.equal(started, 0, 'the browser was started for a URL already refused');
  assert.equal(browser.scrape('https://ok.example/a', { spawn, browserPath: '/opt/chrome', env: {}, redirects: NO_REDIRECT }).ok, true);
  assert.equal(started, 1, 'the control: a URL with no redirect inward is rendered');
});

test('by default the browser transport asks the keyless fetch where the URL redirects', () => {
  const src = fs.readFileSync(path.join(KIT_ROOT, 'lib', 'browser-transport.mjs'), 'utf8');
  assert.match(src, /redirects = redirectTarget\b/, 'the default is not the keyless redirect check');
});
