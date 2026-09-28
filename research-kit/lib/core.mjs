// core.mjs - generic primitives and the artifact constants. Knows no semantics.
//
// Everything here is either a filesystem/path/date/string helper or a name: where an
// artifact lives and what its table header is. No module below this one decides
// anything about research, gates, or evidence.

import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';

// ---------------------------------------------------------------- paths

/** Every artifact the kit knows, project-relative and POSIX-spelled. */
export const PATHS = Object.freeze({
  agents: 'AGENTS.md',
  architecture: 'docs/ARCHITECTURE.md',
  gitattributes: '.gitattributes',
  kit: 'research/kit.json',

  discovery: 'research/DISCOVERY.md',
  map: 'research/MAP.md',
  evidence: 'research/EVIDENCE.md',
  sources: 'research/SOURCES.md',
  timeline: 'research/TIMELINE.md',
  brief: 'research/BRIEF.md',
  plan: 'research/plan.json',

  raw: 'research/raw',
  audits: 'research/audits',

  ledger: 'research/raw/.fetches.jsonl',
  lock: 'research/raw/.fetches.lock',
  usage: 'research/raw/.usage.jsonl',
  failures: 'research/raw/.failures.jsonl',
  diagnostics: 'research/raw/.diagnostics.jsonl',

  overrides: 'research/overrides.log',
  gateOff: 'research/GATE_OFF',
});

/** The table headers the corpus reader and every writer agree on. */
export const HEADERS = Object.freeze({
  unknowns: ['ID', 'Unknown', 'Why it blocks the build', 'Status', 'Evidence'],
  evidence: ['ID', 'Retrieved', 'Type', 'URL', 'Finding', 'Raw'],
  sources: ['URL', 'Type', 'Title', 'Retrieved', 'Used for'],
  subtopics: ['ID', 'Subtopic', 'Why it matters', 'Status', 'Covered by'],
});

export const GENESIS = '0'.repeat(64);

/** Join project-relative POSIX names onto an absolute root. */
export function resolve(root, rel) {
  return path.join(root, ...String(rel).split('/'));
}

/** The inverse: an absolute path back to its POSIX project-relative name. */
export function relative(root, abs) {
  return path.relative(root, abs).split(path.sep).join('/');
}

/** A name is inside the project when it does not climb out of it. */
/**
 * The user's home directory, absolute. HOME wins when it is set to an absolute path - tests
 * and operators redirect it that way - and otherwise the account's passwd entry is used.
 * os.homedir() returns HOME even when it is EMPTY, which made every machine path relative
 * to whatever folder a command ran in (found 2026-09-28). On Windows, with USERPROFILE
 * empty, it THROWS instead (uv_os_homedir ENOENT, seen on windows-latest CI) - and it was
 * called at import, so every kit command crashed there. Both fall back to the account.
 */
export function homeDir() {
  let home = '';
  try { home = os.homedir(); } catch { /* Windows, empty USERPROFILE: fall back below */ }
  if (home && path.isAbsolute(home)) return home;
  try {
    const passwd = os.userInfo().homedir;
    if (passwd && path.isAbsolute(passwd)) return passwd;
  } catch { /* no passwd entry: nothing better to offer */ }
  return home;
}

export function isInside(root, abs) {
  const rel = path.relative(root, abs);
  return rel !== '' && !rel.startsWith('..') && !path.isAbsolute(rel);
}

/**
 * Does `abs` REALLY land inside `root`, with every symlink on both sides resolved?
 * (ADR-0076.) `isInside` compares spellings; git stores symlinks, so a cloned corpus can
 * spell research/raw/x.md and land on ~/.ssh/id_rsa. Anything that cannot be resolved -
 * a dangling link, a vanished file - is not inside.
 */
export function realInside(root, abs) {
  try {
    return isInside(fs.realpathSync(root), fs.realpathSync(abs));
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------- filesystem

export function exists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

export function isDirectory(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

export function readText(p, fallback = null) {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch {
    return fallback;
  }
}

export function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
  return p;
}

export function writeText(p, text) {
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, text, 'utf8');
  return p;
}

/** Append one line, creating the file and its directory when absent. */
export function appendLine(p, line) {
  ensureDir(path.dirname(p));
  fs.appendFileSync(p, line.endsWith('\n') ? line : `${line}\n`, 'utf8');
  return p;
}

/**
 * JSON.parse for a file a person may have saved: a leading byte-order mark is dropped.
 * Windows Notepad writes UTF-8 with one, and JSON.parse refuses it - so a plan, kit.json,
 * machine config or settings file saved there was reported as not parsing, with the
 * invisible mark quoted as the bad token (found 2026-09-27).
 */
export function parseJson(text) {
  const t = String(text ?? '');
  return JSON.parse(t.charCodeAt(0) === 0xFEFF ? t.slice(1) : t);
}

export function readJson(p, fallback = null) {
  const text = readText(p);
  if (text === null) return fallback;
  try {
    return parseJson(text);
  } catch {
    return fallback;
  }
}

export function writeJson(p, value) {
  return writeText(p, `${JSON.stringify(value, null, 2)}\n`);
}

export function listFiles(dir) {
  try {
    return fs.readdirSync(dir);
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------- hashing

export function sha256(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

/** Hash a file's exact bytes; null when it is not readable. */
export function sha256File(p) {
  try {
    return sha256(fs.readFileSync(p));
  } catch {
    return null;
  }
}

/**
 * Canonical JSON: keys sorted at every depth, no insignificant whitespace.
 * The ledger's entry hash is taken over this rendering, so two writers on two
 * machines produce the same bytes for the same entry.
 */
export function canonicalJson(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  const keys = Object.keys(value).filter((k) => value[k] !== undefined).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalJson(value[k])}`).join(',')}}`;
}

// ---------------------------------------------------------------- dates and strings

/** YYYY-MM-DD in UTC. */
export function today(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

export function nowIso(now = new Date()) {
  return now.toISOString();
}

/** Whole days between an ISO-ish date string and now; null when unparseable. */
export function ageInDays(value, now = new Date()) {
  if (!value) return null;
  const then = Date.parse(String(value).trim());
  if (Number.isNaN(then)) return null;
  return Math.floor((now.getTime() - then) / 86400000);
}

/**
 * A filename-safe slug, capped and never ending in a separator.
 *
 * The trim used to run BEFORE the truncation, so a cut that landed on a hyphen left one
 * dangling - which is why every audit file in this repository is named
 * `…-metered-primary--d-1-access-model-…`, with a double hyphen nobody chose. Order
 * matters: slice, then trim.
 */
export function makeSlug(text, fallback = 'topic', limit = 60) {
  const slug = String(text ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, limit)
    .replace(/-+$/g, '');
  return slug || fallback;
}

/** A short, stable id for a URL - used in capture filenames. */
export function urlDigest(url, length = 8) {
  return sha256(String(url)).slice(0, length);
}

export function hostOf(url) {
  try {
    return new URL(String(url)).host.replace(/^www\./, '');
  } catch {
    return '';
  }
}

export function titleFromUrl(url) {
  try {
    const u = new URL(String(url));
    const last = u.pathname.split('/').filter(Boolean).pop();
    return makeSlug(last || u.host, 'page');
  } catch {
    return 'page';
  }
}

export function truncate(text, max) {
  const one = String(text ?? '').replace(/\s+/g, ' ').trim();
  if (one.length <= max) return one;
  return `${one.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
}

export function uniq(items) {
  return [...new Set(items)];
}

// ---------------------------------------------------------------- argv

/**
 * Generic `--flag value` / `--flag` / positional splitting. It knows no flag names and
 * no semantics: an entrypoint reads meaning out of what this hands back.
 * Repeated flags collect into an array.
 */
export function parseFlags(argv) {
  const flags = Object.create(null);
  const positional = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) { positional.push(arg); continue; }
    const eq = arg.indexOf('=');
    const name = eq > 0 ? arg.slice(2, eq) : arg.slice(2);
    let value;
    if (eq > 0) value = arg.slice(eq + 1);
    else if (argv[i + 1] !== undefined && !argv[i + 1].startsWith('--')) { value = argv[i + 1]; i += 1; }
    else value = true;
    if (name in flags) flags[name] = [].concat(flags[name], value);
    else flags[name] = value;
  }
  return { flags, positional };
}

/** Every value a flag was given, as an array - for repeatable flags like `--check`. */
export function flagList(value) {
  if (value === undefined || value === true) return [];
  return [].concat(value).filter((v) => typeof v === 'string');
}

/**
 * Refuse a flag this entrypoint does not know, instead of ignoring it.
 *
 * WHY THIS EXISTS, and it is not hypothetical. `parseFlags` deliberately knows no flag
 * names, so an entrypoint that does not check gets silence: the flag is parsed, stored,
 * never read, and the command proceeds to do whatever it does by default.
 *
 * On 2026-09-22 that cost 26 Firecrawl credits. `research.mjs --totally-made-up-flag` was
 * run to find out whether unknown flags were refused. They were not - it ignored the flag,
 * fell through to its default behaviour, and started a real collection against this
 * repository's own corpus. `audit.mjs` did the same and wrote twelve files. Both were
 * discovered by accident, while testing something else.
 *
 * The same survey found a DEAD FLAG this would have caught years earlier: `collect.yml`
 * passed `--max-scrapes` to `research.mjs`, which has no such flag. The page budget it
 * appeared to set was really coming from `plan.maxScrapes`, written by an earlier step. The
 * bound was real; the flag asserting it was decoration, and nothing said so.
 *
 * Three entrypoints already did this by hand (`artifact.mjs`, `collect-remote.mjs`,
 * `disclosure.mjs`). Eight did not. This is that check, in one place.
 */
export function refuseUnknownFlags(flags, known, { help = '', exit = 2, note = null } = {}) {
  const allowed = new Set(known);
  const unknown = Object.keys(flags).filter((flag) => !allowed.has(flag));
  if (!unknown.length) return;

  for (const flag of unknown) {
    process.stderr.write(`unknown option --${flag}\n`);
    const why = note ? note(flag) : '';
    if (why) process.stderr.write(`${why}\n`);
  }
  process.stderr.write(`known options: ${[...allowed].map((f) => `--${f}`).join(' ')}\n`);
  if (help) process.stdout.write(help);
  process.exit(exit);
}

/**
 * Refuse a flag given a bad value, or none, instead of replacing it with a default.
 *
 * `specs` maps a flag name to `'value'` (it must carry one), `{ choices: [...] }` or
 * `{ int: true, min }`. parseFlags reads a flag with no value as `true`, and each CLI
 * then fell back to its default in silence: `research --depth thorough` ran on quick's
 * budget, `install-hooks --mode block` saved a mode the edit gate reads as "ask", and
 * `new-project --topic` scaffolded "Untitled topic" (found 2026-09-27).
 */
export function checkFlagValues(flags, specs, { exit = 2 } = {}) {
  const problems = [];
  for (const [name, spec] of Object.entries(specs)) {
    if (!(name in flags)) continue;
    for (const value of [].concat(flags[name])) {
      if (value === true || value === '') { problems.push(`--${name} needs a value`); continue; }
      if (spec?.choices && !spec.choices.includes(value)) {
        problems.push(`--${name} must be one of ${spec.choices.join(', ')}, not "${value}"`);
      } else if (spec?.int && !(/^-?\d+$/.test(String(value)) && Number(value) >= (spec.min ?? -Infinity))) {
        problems.push(`--${name} must be a whole number${spec.min !== undefined ? ` of at least ${spec.min}` : ''}, not "${value}"`);
      }
    }
  }
  if (!problems.length) return;
  for (const problem of problems) process.stderr.write(`${problem}\n`);
  process.exit(exit);
}

/**
 * Block for `ms`. The fetch adapters are synchronous by contract - they reach the vendor
 * through `spawnSync` - so a rate-limit wait cannot be awaited without changing that
 * contract everywhere. `Atomics.wait` on a private buffer is the sanctioned way to do
 * this; a spin loop would burn a core for the length of the wait.
 */
export function sleepSync(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return;
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

/**
 * A command that runs one of this kit's entrypoints, spelled so it works from any folder:
 * `node <full path of the running kit>/bin/<script>`.
 *
 * Every hint and remedy the kit prints to a terminal is built here. They used to say
 * "node research-kit/bin/...", which exists only at the repository root - so from a project
 * folder, the very place the kit is used, copying a fix produced MODULE_NOT_FOUND (found
 * 2026-09-27 following the README on a fresh machine). Text written INTO a project's files
 * (the brief, the timeline) is spelled by `documentCommand` instead: those files travel.
 */
export function kitCommand(script, args = '') {
  return spellCommand(fileURLToPath(new URL(`../bin/${script}`, import.meta.url)), args);
}

/**
 * A command written INTO a project file that travels - the brief, the timeline.
 *
 * Those files said "node research-kit/bin/...", which runs only at the kit repository's root,
 * and an absolute path runs only on the machine that wrote it. When the running kit is the
 * standard install it is spelled `"$HOME/.agents/research-kit/..."`, which ADR-0050 showed
 * reaches node whole in PowerShell, bash and zsh on any machine with that install. A kit
 * anywhere else - a repository checkout - has only its real path. Compared by real path,
 * because node runs a symlinked kit from its target.
 */
export function documentCommand(script, args = '', { kit = fileURLToPath(new URL('..', import.meta.url)), home = homeDir() } = {}) {
  const real = (p) => { try { return fs.realpathSync(p); } catch { return path.resolve(p); } };
  if (real(kit) === real(path.join(home, '.agents', 'research-kit'))) return homeCommand(script, args);
  return spellCommand(path.join(kit, 'bin', script), args);
}

/** `node "$HOME/.agents/research-kit/bin/<script>"`: the standard install, spelled for any reader's shell (ADR-0050). */
export function homeCommand(script, args = '') {
  return `node "$HOME/.agents/research-kit/bin/${script}"${args ? ` ${args}` : ''}`;
}

/**
 * `node <file> [args]`, the file double-quoted as it is when it holds a space (ADR-0050).
 * It was JSON.stringify, which doubled every backslash of a Windows path.
 */
export function spellCommand(file, args = '') {
  const spelled = /\s/.test(file) ? `"${file}"` : file;
  return `node ${spelled}${args ? ` ${args}` : ''}`;
}

/**
 * One page's identity across its spellings: host without www., path without a trailing
 * slash, query kept. Lives here so the checks can compare a row's URL with its capture's
 * without loading the collector (research-run re-exports it).
 */
export function urlKey(url) {
  try {
    const parsed = new URL(String(url));
    const host = parsed.host.toLowerCase().replace(/^www\./, '');
    const path = parsed.pathname.replace(/\/+$/, '');
    return `//${host}${path}${parsed.search}`;
  } catch {
    return String(url ?? '');
  }
}
