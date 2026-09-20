// core.mjs - generic primitives and the artifact constants. Knows no semantics.
//
// Everything here is either a filesystem/path/date/string helper or a name: where an
// artifact lives and what its table header is. No module below this one decides
// anything about research, gates, or evidence.

import fs from 'node:fs';
import path from 'node:path';
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
export function isInside(root, abs) {
  const rel = path.relative(root, abs);
  return rel !== '' && !rel.startsWith('..') && !path.isAbsolute(rel);
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

export function readJson(p, fallback = null) {
  const text = readText(p);
  if (text === null) return fallback;
  try {
    return JSON.parse(text);
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
