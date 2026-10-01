// lib/browser-transport.mjs - render a page with a local Chromium, from the command line
// (ADR-0088). Research: docs/decisions/2026-09-28-browser-transport.
//
// Free, keyless and dependency-free: `--headless --dump-dom <url>` prints the rendered DOM
// (E-01, E-02), and the keyless transport's own extractor turns it into a graded capture, so
// both transports grade pages by one rule. It reads what the keyless transport cannot: on
// 2026-09-28 a GitHub Discussion answered the keyless client HTTP 403 and rendered here in full.
//
// Fetch only. It does not search; a run on it searches with the keyless route (transport.mjs).
//
// Every request Chromium makes goes through a guard proxy the kit runs (ADR-0118), in a child
// process (`browser-guard.mjs`): a page on the web cannot send the browser into this machine's
// network, whether by a redirect, a script, a meta refresh or an image.

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { mainContent, htmlToMarkdown, titleOf, gradeCompleteness } from './http-transport.mjs';
import httpKeyless from './http-transport.mjs';
import { REFUSAL_MARKER } from './browser-guard.mjs';
import { CHILD_OUTPUT_LIMIT, MAX_PAGE_BYTES, outputOverflow } from './runtime.mjs';

const GUARD_CHILD = fileURLToPath(new URL('./browser-guard.mjs', import.meta.url));

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
 * The argv, URL last. The guard child adds `--proxy-server` for its own proxy (ADR-0118); a
 * configured proxy (E-03) is the guard's upstream, never Chromium's directly. The background
 * traffic Chromium makes on its own - update checks, time sync - is switched off: each such
 * request would otherwise go through the guard too. `--no-sandbox` only as root, where
 * Chromium refuses to start with its sandbox (U-03, a known unknown). There is no flag that
 * weakens TLS: a TLS-intercepting proxy is trusted by adding its CA to the browser's store,
 * never by `--ignore-certificate-errors`.
 */
export function browserArgs(url, { uid = typeof process.getuid === 'function' ? process.getuid() : -1, timeout = TIMEOUT_MS } = {}) {
  // Chromium's own deadline, under the transport's kill timeout. With --virtual-time-budget
  // alone, headless waits on a pending load for ever - virtual time advances only when the
  // page is idle - so one resource that never answers meant no dump, no stderr, and a kill
  // with nothing to show (CI, 2026-10-01, four times in an afternoon on Windows and Ubuntu;
  // reproduced with a page whose image never arrives). At the deadline Chromium stops
  // loading, dumps the DOM it has and exits: the page is captured as it stands. The kill is
  // for a browser that is not answering at all, ten seconds later.
  const deadline = deadlineFor(timeout);
  const args = ['--headless', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--disable-background-networking',
    '--disable-component-update', '--disable-sync', `--virtual-time-budget=${VIRTUAL_TIME_MS}`, `--timeout=${deadline}`];
  if (uid === 0) args.push('--no-sandbox');
  args.push('--dump-dom', String(url));
  return args;
}

/**
 * Run the browser through the guard child, and report its exit as spawnSync would: `status`,
 * `signal`, `stdout`, `stderr`, `error`, plus `refused` (the requests the guard turned away)
 * and `truncated` (a DOM past MAX_PAGE_BYTES, dropped rather than kept in part, ADR-0082).
 */
export function renderGuarded(binary, args, { url, env = process.env, timeout = TIMEOUT_MS, allowInternalRedirects, nodePath = process.execPath, spawn = spawnSync } = {}) {
  // ADR-0110: undefined lets the child decide from the URL asked for; the operator's opt-out,
  // or a caller's explicit choice, overrides it.
  const allow = allowInternalRedirects ?? (env.RESEARCH_KIT_ALLOW_INTERNAL_REDIRECTS === '1' ? true : undefined);
  const job = { binary, args, url: String(url), timeout, ...(allow === undefined ? {} : { allowInternalRedirects: allow }) };
  const result = spawn(nodePath, [GUARD_CHILD], {
    input: JSON.stringify(job), encoding: 'utf8', timeout: timeout + 10_000, windowsHide: true, maxBuffer: CHILD_OUTPUT_LIMIT, env,
  });
  const failed = (code, message) => ({ status: null, signal: null, stdout: '', stderr: '', error: Object.assign(new Error(message), { code }), refused: [] });
  if (result.error?.code === 'ETIMEDOUT') return failed('ETIMEDOUT', 'the guard child did not finish');
  const overflow = outputOverflow(result, 'the browser');
  if (overflow) return failed('ENOBUFS', overflow);
  if (result.error) return failed(result.error.code ?? 'SPAWN', result.error.message);
  let report;
  try { report = JSON.parse(String(result.stdout ?? '').trim() || '{}'); } catch (err) {
    return failed('GUARD', `the guard child emitted unparseable output: ${err.message}${result.stderr ? ` (${String(result.stderr).trim().slice(0, 200)})` : ''}`);
  }
  return {
    status: report.status ?? null, signal: report.signal ?? null, stdout: report.stdout ?? '', stderr: report.stderr ?? '',
    error: report.errorCode ? Object.assign(new Error(report.errorMessage ?? report.errorCode), { code: report.errorCode }) : undefined,
    refused: report.refused ?? [], truncated: Boolean(report.truncated),
    requests: Number(report.requests) || 0, pending: Array.isArray(report.pending) ? report.pending : [], elapsedMs: Number(report.elapsedMs) || 0,
    seen: Array.isArray(report.seen) ? report.seen : [], startedAt: typeof report.startedAt === 'string' ? report.startedAt : '',
    startupMs: Number.isFinite(report.startupMs) ? report.startupMs : null,
  };
}

/** Chromium's own deadline for a render: ten seconds under the kill timeout, never below five. */
export function deadlineFor(timeout = TIMEOUT_MS) {
  return Math.max(5_000, timeout - 10_000);
}

/**
 * When Chromium printed the page before every load was answered - at its deadline, or
 * with a request still open at the guard - what it was waiting for, from the guard's
 * record; or, when the guard had answered everything and the render still ran to the
 * deadline, that the wait was inside the browser. Null for a render that settled on its
 * own. The guard's record is the signal, not Chromium's stderr: it logs "Page load timed
 * out" only when the navigation itself never committed, not for a stalled resource.
 */
export function cutAtDeadline(result, timeout) {
  const pending = Array.isArray(result.pending) ? result.pending : [];
  const deadline = deadlineFor(timeout);
  // The render's own time: from the browser's first request, not from the launch (ADR-0119).
  const ranToDeadline = ((Number(result.elapsedMs) || 0) - (Number(result.startupMs) || 0)) >= deadline - 500;
  if (!pending.length && !ranToDeadline) return null;
  if (pending.length) {
    const head = ranToDeadline ? `the browser stopped loading at its ${Math.round(deadline / 1000)} s deadline` : 'the browser printed the page before every load was answered';
    return `${head}; still unanswered through the guard: ${pending.map((p) => `${p.target} (${Math.round(p.ms / 1000)} s)`).join(', ')}`;
  }
  return `the browser stopped loading at its ${Math.round(deadline / 1000)} s deadline; every one of the ${Number(result.requests) || 0} requests through the guard had been answered, so the wait was inside the browser`;
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

export function scrape(url, { render = renderGuarded, browserPath = null, env = process.env, config = {}, exists, timeout = TIMEOUT_MS, uid,
  allowInternalRedirects } = {}) {
  const target = String(url);
  const binary = browserPath ?? findBrowser({ config, env, exists });
  const cmd = command([target]);
  if (!binary) {
    return { ok: false, url: target, transport: name, cmd,
      error: 'no Chromium or Chrome found - set browserPath in the machine config or RESEARCH_KIT_BROWSER to the browser executable' };
  }
  const result = render(binary, browserArgs(target, { ...(uid === undefined ? {} : { uid }), timeout }), { url: target, env, timeout, allowInternalRedirects });
  // Why the browser stopped, in its own words: the last FATAL line, else the last ERROR line,
  // else the last line. Learned from live runs on 2026-09-29: a crash ends its stderr with a
  // stack dump ("[end of stack trace]"), and the crash handler then logs ERROR noise of its
  // own (a missing cpufreq file) - neither is the cause.
  const lines = String(result.stderr ?? '').trim().split('\n').filter(Boolean);
  const last = (pattern) => [...lines].reverse().find((line) => pattern.test(line));
  const cause = last(/FATAL/) ?? last(/ERROR:/) ?? lines.slice(-1)[0];
  const said = cause ? `: ${cause.trim().slice(0, 200)}` : '';
  // A timeout is judged by what Chromium printed first, not by its exit (found 2026-10-01 on
  // CI: the suite's first launch ran its 45 s out three times in one afternoon, on Windows
  // and on Ubuntu, with the refusal the guard had recorded and the dump thrown away). Chromium
  // prints the DOM once, when its own budget says the page is done, so a WHOLE dump after a
  // timeout is the render - Chromium then failed to exit, which does not unrender the page -
  // and a dump holding the guard's refusal is the refusal. No dump at all is the timeout, and
  // the last thing Chromium said on stderr is the only diagnostic there is, so it is kept.
  const timedOut = result.error?.code === 'ETIMEDOUT';
  const refused = Array.isArray(result.refused) ? result.refused : [];
  const html = String(result.stdout ?? '');
  const dumpedWhole = /<\/html>\s*$/i.test(html);
  // The guard turned a request away, and the page that rendered is the refusal, or Chromium's
  // own error page for a tunnel it could not open: the page led the browser into this
  // machine's network, and nothing from there was read (ADR-0118). A refused image or frame on
  // a page that still rendered is not a failure of the capture.
  const landedOnRefusal = refused.length && (html.includes(REFUSAL_MARKER) || (chromeErrorOf(html) && !timedOut && !result.signal && result.status === 0));
  if (landedOnRefusal) {
    const last = refused[refused.length - 1];
    const waited = cutAtDeadline(result, timeout);
    return { ok: false, url: target, transport: name, cmd,
      error: `refused to let the page reach ${last.host} - ${last.why}. A page on the web may not send the browser into this machine's network; `
        + `if you meant that address, fetch it directly, or set RESEARCH_KIT_ALLOW_INTERNAL_REDIRECTS=1.${waited ? ` (${waited})` : ''}` };
  }
  if (result.truncated) {
    return { ok: false, url: target, transport: name, cmd, error: `the rendered page is larger than ${MAX_PAGE_BYTES / (1024 * 1024)} MiB - not kept (ADR-0082)` };
  }
  if (timedOut && !dumpedWhole) {
    // Where the time went: a browser that never asked for anything is a launch that did not
    // finish, which is not the page's doing (ADR-0119).
    const startup = Number.isFinite(result.startupMs) && result.startupMs !== null
      ? `: the browser took ${Math.round(result.startupMs / 1000)} s to make its first request`
      : `: the browser never made a request in ${Math.round((Number(result.elapsedMs) || 0) / 1000)} s`;
    return { ok: false, url: target, transport: name, cmd, error: `the browser did not finish rendering ${target} within ${Math.round(timeout / 1000)}s${startup}${said}` };
  }
  // A signal that is not the timeout's is a crash, and says so (found 2026-09-29: a SIGTRAP
  // 21 seconds in was reported as the 60-second timeout). The timeout's own kill, after a
  // whole dump, is not one.
  if (result.signal && !timedOut) {
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
  if (result.error && !timedOut) return { ok: false, url: target, transport: name, cmd, error: `the browser could not start: ${result.error.message}` };
  if (result.status !== 0 && !timedOut) {
    return { ok: false, url: target, transport: name, cmd, error: `the browser exited ${result.status}${said}` };
  }
  const chromeError = chromeErrorOf(html);
  if (chromeError) {
    return { ok: false, url: target, transport: name, cmd, error: `the browser showed its own error page (${chromeError}) instead of ${target}` };
  }
  const extraction = mainContent(html);
  const markdown = htmlToMarkdown(extraction.html);
  const graded = gradeCompleteness(markdown, extraction);
  // A page Chromium gave up on at its deadline is what it was when the wait ended, not what
  // it would have been: partial, and the grade says what was still outstanding.
  const waited = cutAtDeadline(result, timeout);
  if (waited) { graded.completeness = 'partial'; graded.omitted = [graded.omitted, waited].filter(Boolean).join('; '); }
  return {
    ok: true,
    url: target,
    title: titleOf(html),
    markdown,
    // --dump-dom reports no HTTP status; an error page of the site's own is still graded thin.
    statusCode: '',
    transport: name,
    cmd,
    ...graded,
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
