// lib/browser-transport.mjs - render a page with a local Chromium, from the command line
// (ADR-0088). Research: docs/decisions/2026-09-28-browser-transport.
//
// Free, keyless and dependency-free: `--headless --dump-dom <url>` prints the rendered DOM
// (E-01, E-02), and the keyless transport's own extractor turns it into a graded capture, so
// both transports grade pages by one rule. It reads what the keyless transport cannot: on
// 2026-09-28 a GitHub Discussion answered the keyless client HTTP 403 and rendered here in full.
//
// Fetch only. It does not search; a run on it searches with the keyless route (transport.mjs).

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { mainContent, htmlToMarkdown, titleOf, gradeCompleteness, redirectTarget } from './http-transport.mjs';
import httpKeyless from './http-transport.mjs';
import { CHILD_OUTPUT_LIMIT } from './runtime.mjs';

export const name = 'browser';
export const CONTRACTS = Object.freeze(['fetch']);
export const TIMEOUT_MS = 60_000;
/** Time given to a page's scripts to settle before the DOM is dumped. */
export const VIRTUAL_TIME_MS = 8_000;

/** Where a browser usually lives, per platform. The first that exists is used. */
const USUAL = {
  // Chrome stable first: Ubuntu 23.10+ lets only binaries with an AppArmor userns profile
  // start Chromium's sandbox, and it ships one for /opt/google/chrome/chrome - the path the
  // google-chrome launchers exec (ADR-0092). Other builds come after.
  linux: ['/opt/google/chrome/chrome', '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium', '/usr/bin/chromium-browser', '/opt/pw-browsers/chromium'],
  darwin: ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Chromium.app/Contents/MacOS/Chromium'],
  win32: [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  ],
};

const isFile = (p) => { try { return fs.statSync(p).isFile(); } catch { return false; } };

/** The browser to run: machine config `browserPath`, then RESEARCH_KIT_BROWSER, then the usual paths. '' when none. */
export function findBrowser({ config = {}, env = process.env, exists = isFile, platform = process.platform } = {}) {
  for (const candidate of [config?.browserPath, env.RESEARCH_KIT_BROWSER]) {
    if (typeof candidate === 'string' && candidate.trim() && exists(candidate.trim())) return candidate.trim();
  }
  return (USUAL[platform] ?? []).find((p) => exists(p)) ?? '';
}

/**
 * The argv, URL last. `--proxy-server` from the configured proxy (E-03); `--no-sandbox` only
 * as root, where Chromium refuses to start with its sandbox (U-03, a known unknown). There is
 * no flag that weakens TLS: a TLS-intercepting proxy is trusted by adding its CA to the
 * browser's store, never by `--ignore-certificate-errors`.
 */
export function browserArgs(url, { env = process.env, uid = typeof process.getuid === 'function' ? process.getuid() : -1 } = {}) {
  const args = ['--headless', '--disable-gpu', '--no-first-run', `--virtual-time-budget=${VIRTUAL_TIME_MS}`];
  const proxy = env.HTTPS_PROXY || env.https_proxy || env.HTTP_PROXY || env.http_proxy || '';
  if (proxy) args.push(`--proxy-server=${proxy}`);
  if (uid === 0) args.push('--no-sandbox');
  args.push('--dump-dom', String(url));
  return args;
}

/**
 * Chromium's own error page, by the code it prints - '' for a real page.
 *
 * `--dump-dom` exits 0 when the page failed: behind a proxy whose CA it did not trust it
 * printed a "Privacy error" interstitial carrying ERR_CERT_AUTHORITY_INVALID, the same
 * 131,208 bytes for two different URLs. Trusting the exit code would file that as evidence.
 */
export function chromeErrorOf(html) {
  const text = String(html ?? '');
  if (!/id="main-frame-error"|<title>\s*Privacy error\s*<\/title>/i.test(text)) return '';
  return text.match(/\b(?:NET::)?(ERR_[A-Z_]+)\b/)?.[1] ?? 'ERR_UNKNOWN';
}

/**
 * What the ledger records as this fetch's command: `browser <url>`, quoted like the keyless
 * transport's. It had used that transport's formatter whole, so every browser capture read
 * `http-keyless browser <url>` - the wrong tool's name in a committed file (2026-09-30).
 */
export function command(argv) {
  return ['browser', ...argv.slice(-1)].map((p) => (/\s/.test(p) ? JSON.stringify(p) : p)).join(' ');
}

export function scrape(url, { spawn = spawnSync, browserPath = null, env = process.env, config = {}, exists, timeout = TIMEOUT_MS, uid,
  redirects = redirectTarget } = {}) {
  const target = String(url);
  const binary = browserPath ?? findBrowser({ config, env, exists });
  const cmd = command([target]);
  if (!binary) {
    return { ok: false, url: target, transport: name, cmd,
      error: 'no Chromium or Chrome found - set browserPath in the machine config or RESEARCH_KIT_BROWSER to the browser executable' };
  }
  // Chromium follows redirects inside itself and --dump-dom reports no final URL, so a page
  // redirecting into this machine's network was rendered and captured (left open by ADR-0110).
  // The URL's server redirects are followed first, with the keyless fetch and its guards, and a
  // hop inward is refused before Chromium starts (ADR-0115).
  const hop = redirects(target, { env });
  if (hop?.refused) return { ok: false, url: target, transport: name, cmd, error: hop.refused };
  const result = spawn(binary, browserArgs(target, { env, ...(uid === undefined ? {} : { uid }) }), {
    encoding: 'utf8', timeout, maxBuffer: CHILD_OUTPUT_LIMIT, windowsHide: true,
  });
  // Why the browser stopped, in its own words: the last FATAL line, else the last ERROR line,
  // else the last line. Learned from live runs on 2026-09-29: a crash ends its stderr with a
  // stack dump ("[end of stack trace]"), and the crash handler then logs ERROR noise of its
  // own (a missing cpufreq file) - neither is the cause.
  const lines = String(result.stderr ?? '').trim().split('\n').filter(Boolean);
  const last = (pattern) => [...lines].reverse().find((line) => pattern.test(line));
  const cause = last(/FATAL/) ?? last(/ERROR:/) ?? lines.slice(-1)[0];
  const said = cause ? `: ${cause.trim().slice(0, 200)}` : '';
  if (result.error?.code === 'ETIMEDOUT') {
    return { ok: false, url: target, transport: name, cmd, error: `the browser did not finish rendering ${target} within ${Math.round(timeout / 1000)}s` };
  }
  // A signal that is not the timeout's is a crash, and says so (found 2026-09-29: a SIGTRAP
  // 21 seconds in was reported as the 60-second timeout).
  if (result.signal) {
    // The sandbox denied, as on Ubuntu 23.10+: the remedies that KEEP it, in the order
    // Chromium ranks them (ADR-0092). Never --no-sandbox - Chromium says it must never be
    // used on the open web, which is all this transport renders.
    const denied = /No usable sandbox/.test(cause ?? '')
      ? ' - Chromium\'s sandbox was denied (Ubuntu 23.10+ restricts user namespaces by AppArmor profile).'
        + ' Use Chrome stable at /opt/google/chrome/chrome, which Ubuntu allows (set browserPath to it),'
        + ' or, for another build, set CHROME_DEVEL_SANDBOX=/opt/google/chrome/chrome-sandbox'
      : '';
    return { ok: false, url: target, transport: name, cmd, error: `the browser was killed by ${result.signal}${said}${denied}` };
  }
  if (result.error) return { ok: false, url: target, transport: name, cmd, error: `the browser could not start: ${result.error.message}` };
  if (result.status !== 0) {
    return { ok: false, url: target, transport: name, cmd, error: `the browser exited ${result.status}${said}` };
  }
  const html = String(result.stdout ?? '');
  const chromeError = chromeErrorOf(html);
  if (chromeError) {
    return { ok: false, url: target, transport: name, cmd, error: `the browser showed its own error page (${chromeError}) instead of ${target}` };
  }
  const extraction = mainContent(html);
  const markdown = htmlToMarkdown(extraction.html);
  return {
    ok: true,
    url: target,
    title: titleOf(html),
    markdown,
    // --dump-dom reports no HTTP status; an error page of the site's own is still graded thin.
    statusCode: '',
    transport: name,
    cmd,
    ...gradeCompleteness(markdown, extraction),
  };
}

export function runScrape(url, opts = {}) {
  return scrape(url, opts);
}

/** Link discovery records nothing, so the keyless route's own map serves. */
export function map(url, opts = {}) {
  return httpKeyless.map(url, opts);
}

export function status({ config = {}, env = process.env, exists } = {}) {
  const path = findBrowser({ config, env, exists });
  return { ok: Boolean(path), transport: name, path, error: path ? '' : 'no Chromium or Chrome found' };
}

export default { name, CONTRACTS, scrape, runScrape, map, status, command };
