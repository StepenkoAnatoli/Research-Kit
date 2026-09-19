// firecrawl.mjs - ALL vendor knowledge lives here (ADR-0005, ADR-0020).
//
// The CLI transport. Its `exec` seam carries an ARGV ARRAY and spawns with
// `shell: false`: no URL and no query is ever concatenated into a shell string, because
// in this kit's threat model a plan.json travels through git and a query is pasted back
// from a web result - both are attacker-controlled data reaching the one module that
// leaves the process, on the one machine holding the API key.
//
// `command(args)` survives as a DISPLAY-ONLY rendering (dry-run output, the ledger's
// `cmd` annotation). Nothing executes it.

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

export const name = 'firecrawl-cli';
/**
 * The same CLI, run without a key. A distinct transport because it is a distinct
 * guarantee: capped per IP rather than metered, and not reproducible from a credential.
 */
export const ANONYMOUS_NAME = 'firecrawl-cli-anonymous';
export const PROGRAM = 'firecrawl';

/** The seven-function shape both adapters hold. Pinned by test. */
export const ADAPTER_SHAPE = Object.freeze(['name', 'scrape', 'search', 'map', 'command', 'status', 'runScrape']);

/**
 * Windows cannot spawn a `.cmd` shim shell-less, so that one route still has an
 * interpreter in it. Every argument is validated against this set and REFUSED rather
 * than re-quoted - re-quoting is how injection bugs come back.
 */
export const CMD_SAFE_ARG = /^[A-Za-z0-9_.:/\\@=+-]*$/;

// ---------------------------------------------------------------- program resolution

/** Full path off PATH + PATHEXT. Returns null when the program is not installed. */
export function resolveProgramPath(program = PROGRAM, env = process.env, platform = process.platform) {
  const dirs = String(env.PATH || env.Path || '').split(platform === 'win32' ? ';' : ':').filter(Boolean);
  const exts = platform === 'win32'
    ? String(env.PATHEXT || '.COM;.EXE;.BAT;.CMD').split(';').filter(Boolean)
    : [''];
  for (const dir of dirs) {
    for (const ext of exts) {
      const candidate = path.join(dir, program + ext.toLowerCase());
      try {
        if (fs.statSync(candidate).isFile()) return candidate;
      } catch { /* keep looking */ }
      const upper = path.join(dir, program + ext);
      try {
        if (fs.statSync(upper).isFile()) return upper;
      } catch { /* keep looking */ }
    }
  }
  return null;
}

/**
 * How to invoke it: a real `.exe` is spawned directly; a `.cmd`/`.bat` goes through
 * cmd.exe as argv, and only after every argument passes CMD_SAFE_ARG.
 */
export function resolveInvocation(argv, { env = process.env, platform = process.platform, program = PROGRAM } = {}) {
  const resolved = resolveProgramPath(program, env, platform);
  if (!resolved) return { ok: false, reason: 'not-installed', detail: `${program} is not on PATH` };

  const ext = path.extname(resolved).toLowerCase();
  if (platform !== 'win32' || ext === '.exe' || ext === '') {
    return { ok: true, file: resolved, args: argv, shell: false, route: 'direct' };
  }
  const unsafe = argv.filter((a) => !CMD_SAFE_ARG.test(String(a)));
  if (unsafe.length) {
    return {
      ok: false,
      reason: 'unsafe-for-cmd-shim',
      detail: `refused ${unsafe.length} argument(s) that cannot cross a Windows .cmd shim safely: ${unsafe.join(' ')}`,
      remedy: 'use --transport http-keyless, which has no interpreter in the route',
    };
  }
  const comspec = env.ComSpec || env.COMSPEC || 'cmd.exe';
  return { ok: true, file: comspec, args: ['/d', '/s', '/c', resolved, ...argv], shell: false, route: 'cmd-shim' };
}

// ---------------------------------------------------------------- the exec seam

/** The narrow seam: an argv array, never a command string. Injectable for tests. */
export function exec(argv, { env = process.env, platform = process.platform, spawn = spawnSync, timeout = 120_000, program = PROGRAM } = {}) {
  const invocation = resolveInvocation(argv, { env, platform, program });
  if (!invocation.ok) return { ok: false, status: null, stdout: '', stderr: invocation.detail, invocation };
  const result = spawn(invocation.file, invocation.args, {
    env, timeout, encoding: 'utf8', shell: false, windowsHide: true,
  });
  return {
    ok: result.status === 0,
    status: result.status,
    stdout: stripAnsi(result.stdout ?? ''),
    stderr: stripAnsi(result.stderr ?? ''),
    invocation,
  };
}

/**
 * The ESC character is PART of the sequence. Omitting it stripped "[38;5;208m" and left
 * the escape itself sitting in the text, so every parser downstream saw a control
 * character where it expected a word boundary. Verified against real CLI output.
 */
export function stripAnsi(text) {
  // eslint-disable-next-line no-control-regex
  return String(text).replace(/\u001B\[[0-9;]*[A-Za-z]/g, '');
}

/** Display-only. Nothing executes this. */
export function command(argv) {
  return [PROGRAM, ...argv].map((part) => (/\s/.test(part) ? JSON.stringify(part) : part)).join(' ');
}

// ---------------------------------------------------------------- payload normalisation

function parsePayload(stdout) {
  const text = String(stdout).trim();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch { /* the CLI sometimes prints a banner first */ }
  const start = text.search(/[[{]/);
  if (start < 0) return null;
  try {
    return JSON.parse(text.slice(start));
  } catch {
    return null;
  }
}

/**
 * The completeness grade is EARNED, not stamped.
 *
 * This adapter used to write `completeness: 'full'` on every successful scrape. A
 * 167-character page came back graded full, and so would a page the extractor had
 * reduced to a nav bar. "The vendor returned main content" is not evidence that the
 * section a claim rests on arrived - and `capture-completeness`, the check that decides
 * whether a CLOSED unknown may rest on this capture alone, believed the stamp.
 *
 * The same bar as the keyless adapter, for the same reason and with the same words, so
 * the two transports cannot disagree about what `full` means.
 */
export const FULL_THRESHOLD = 1500;

export function gradeCompleteness(markdown) {
  const length = String(markdown ?? '').length;
  if (length >= FULL_THRESHOLD) return { completeness: 'full', omitted: '' };
  return {
    completeness: 'partial',
    omitted: `only ${length} characters of main content were returned (below the ${FULL_THRESHOLD}-character bar)`,
  };
}

export function normalizeScrape(stdout, url, label = name) {
  const payload = parsePayload(stdout);
  const data = payload?.data ?? payload ?? {};
  const markdown = String(data.markdown ?? data.content ?? data.text ?? (typeof payload === 'string' ? payload : '') ?? '');
  return {
    url: data.metadata?.sourceURL ?? data.url ?? url,
    title: data.metadata?.title ?? data.title ?? '',
    markdown,
    statusCode: data.metadata?.statusCode ?? data.statusCode ?? '',
    transport: label,
    ...gradeCompleteness(markdown),
  };
}

export function normalizeSearch(stdout) {
  const payload = parsePayload(stdout);
  const rows = payload?.data ?? payload?.results ?? payload ?? [];
  if (!Array.isArray(rows)) return [];
  return rows.map((row) => ({
    url: row.url ?? row.link ?? '',
    title: row.title ?? '',
    description: row.description ?? row.snippet ?? '',
  })).filter((row) => row.url);
}

export function normalizeMap(stdout) {
  const payload = parsePayload(stdout);
  const links = payload?.links ?? payload?.data ?? payload ?? [];
  if (!Array.isArray(links)) return [];
  return links.map((link) => (typeof link === 'string' ? link : link.url)).filter(Boolean);
}

/**
 * Written against REAL v1.23.3 output, pinned as a fixture in the transport tests:
 *
 *   firecrawl cli v1.23.3
 *   ● Authenticated via stored credentials
 *   Concurrency: 0/2 jobs (parallel scrape limit)
 *   Credits: 949 / 1,000 (95% left this cycle)
 *
 * The old regex looked for a number BEFORE the word "credits". This CLI puts the word
 * first, so it matched nothing and every run reported credits: null. That is the defect
 * O-4 of the hardening design predicted - "the collector's parsers remain unvalidated
 * against real payloads" - and it survived until a key existed to produce one.
 */
export function parseStatus(stdout) {
  const text = stripAnsi(String(stdout));
  const credits = text.match(/Credits:\s*([\d,]+)\s*\/\s*([\d,]+)/i);
  const concurrency = text.match(/Concurrency:\s*(\d+)\s*\/\s*(\d+)/i);
  const version = text.match(/cli\s+v([\d.]+)/i);
  const num = (s) => Number(String(s).replace(/,/g, ''));

  return {
    authenticated: /\bauthenticated\b/i.test(text) && !/\bnot authenticated\b/i.test(text),
    credits: credits ? num(credits[1]) : null,
    creditLimit: credits ? num(credits[2]) : null,
    concurrencyInUse: concurrency ? Number(concurrency[1]) : null,
    concurrencyLimit: concurrency ? Number(concurrency[2]) : null,
    version: version ? version[1] : null,
    raw: text.trim(),
  };
}

// ---------------------------------------------------------------- the adapter

export function scrape(url, { execFn = exec, ...opts } = {}) {
  const argv = ['scrape', String(url), '--only-main-content', '--json'];
  const result = execFn(argv, opts);
  if (!result.ok) {
    return { ok: false, url, error: result.stderr || `firecrawl exited ${result.status}`, cmd: command(argv), transport: name };
  }
  return { ok: true, cmd: command(argv), ...normalizeScrape(result.stdout, url) };
}

export function search(query, { limit = 8, execFn = exec, ...opts } = {}) {
  const argv = ['search', String(query), '--limit', String(limit), '--json'];
  const result = execFn(argv, opts);
  if (!result.ok) return { ok: false, query, error: result.stderr || `firecrawl exited ${result.status}`, cmd: command(argv), results: [] };
  return { ok: true, query, cmd: command(argv), results: normalizeSearch(result.stdout) };
}

export function map(url, { limit = 50, execFn = exec, ...opts } = {}) {
  const argv = ['map', String(url), '--limit', String(limit), '--json'];
  const result = execFn(argv, opts);
  if (!result.ok) return { ok: false, url, error: result.stderr || `firecrawl exited ${result.status}`, cmd: command(argv), links: [] };
  return { ok: true, url, cmd: command(argv), links: normalizeMap(result.stdout) };
}

export function status({ execFn = exec, ...opts } = {}) {
  // `firecrawl status` does not exist: the CLI exposes `--status` on the root command.
  // Guessed rather than verified, so it exited non-zero on every call and the probe
  // could never report an authenticated machine.
  const argv = ['--status'];
  const result = execFn(argv, opts);
  if (!result.ok) {
    return { ok: false, authenticated: false, credits: null, transport: name, error: result.stderr || 'firecrawl status failed' };
  }
  return { ok: true, transport: name, ...parseStatus(result.stdout) };
}

/** The seam the collector consumes: one URL in, one capture-shaped result out. */
export function runScrape(url, opts = {}) {
  return scrape(url, opts);
}

export function cliVersion({ execFn = exec, ...opts } = {}) {
  const result = execFn(['--version'], opts);
  return result.ok ? result.stdout.trim() : null;
}

export default { name, scrape, search, map, command, status, runScrape };
