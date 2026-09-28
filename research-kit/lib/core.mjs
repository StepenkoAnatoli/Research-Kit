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

/**
 * A file this kit is willing to READ: a regular file, or a symlink pointing at one.
 *
 * Anything else has no end. `readFileSync` on a **fifo** blocks in `open()` until some
 * other process writes to it - forever, silently; on a character device such as
 * `dev/zero` or `dev/urandom` it allocates until the process is killed. Measured, not
 * supposed (found 2026-09-28,
 * break-test): with one fifo sitting in `research/raw/`, every entrypoint - `handoff`,
 * `preflight`, `audit`, `doctor`, `brief` and the commit `gate` - hung until killed, and
 * with the ledger symlinked to `/dev/zero` all of them died inside libstdc++ with
 * `std::bad_alloc` / SIGABRT. No diagnostic in either case: a hang prints nothing, and
 * SIGABRT prints a C++ exception rather than anything a person can act on.
 *
 * `statSync` follows symlinks on purpose. A symlink to a regular file outside the
 * project is still a file with an end, and refusing it here would be a behaviour change
 * for every caller that resolves a link today; what this rejects is only the kinds that
 * cannot be read to completion.
 */
export function isRegularFile(p) {
  try {
    return fs.statSync(p).isFile();
  } catch {
    return false;
  }
}

export function readText(p, fallback = null) {
  // The guard is here rather than at each corpus call site because this is the one
  // funnel every text read in the kit goes through - captures, the ledger, the
  // contract, the config - and a fifo in ANY of those hangs the run just the same.
  if (!isRegularFile(p)) return fallback;
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

/**
 * Write a file whole, or not at all.
 *
 * `fs.writeFileSync` opens with 'w', which EMPTIES the target before a byte is written, so a
 * write cut short - a full disk, a quota, EFBIG, a killed process - left a partial new file
 * where the old one had been (found 2026-09-28: a 6,300-byte file under a 4 KB limit became
 * 4,096 bytes of the new text). EVIDENCE.md and MAP.md are rewritten through here and hold
 * human review work. So the text goes to a scratch dotfile beside the target - a dotfile, so
 * a leftover is never read as a capture - and is renamed over it, which replaces the file
 * in one step within a filesystem. The replaced file's mode is kept (a 0600 config stays
 * 0600); a symlinked target is written through to the file it names; a dangling link is
 * written directly, as before. The scratch file never outlives a failure.
 */
export function writeText(p, text) {
  return writeBytes(p, text, 'utf8');
}

/**
 * The same promise for BYTES, because the two files that matter most are not text.
 *
 * `writeText` is used for the corpus, the map and the config. The audit bundle and the
 * artifact package - the two things this kit hands to somebody else - are written as
 * Buffers by `lib/archive.mjs` and `lib/artifact.mjs`, and they went on calling
 * `fs.writeFileSync` directly until 2026-09-28. The same failure the text path was fixed
 * for therefore still applied to them: a full disk, a quota, EFBIG or a killed CI job
 * emptied the target before writing a byte, so a package that already existed was
 * destroyed and replaced by a truncated one. Measured, not supposed: a 2,679,013-byte
 * package re-created under a 512 KB file-size limit was left as 524,288 bytes of the new
 * one, with the package it replaced gone.
 *
 * Bytes and text share one implementation so the promise cannot drift between them.
 */
export function writeBytes(p, data, encoding = null) {
  ensureDir(path.dirname(p));
  let target = p;
  let mode = null;
  try {
    target = fs.realpathSync(p);
    mode = fs.statSync(target).mode & 0o7777;
  } catch {
    try {
      if (fs.lstatSync(p).isSymbolicLink()) {                       // dangling link
        if (encoding === null) fs.writeFileSync(p, data);
        else fs.writeFileSync(p, data, encoding);
        return p;
      }
    } catch { /* p does not exist yet: a new file */ }
    target = p;
  }
  const scratch = path.join(path.dirname(target), `.${path.basename(target)}.tmp-${process.pid}-${crypto.randomBytes(4).toString('hex')}`);
  try {
    if (encoding === null) fs.writeFileSync(scratch, data);
    else fs.writeFileSync(scratch, data, encoding);
    if (mode !== null) fs.chmodSync(scratch, mode);
    fs.renameSync(scratch, target);
  } catch (err) {
    try { fs.rmSync(scratch, { force: true }); } catch { /* already gone */ }
    err.target = p;   // the file the caller asked for, not the scratch name a rename reports
    throw err;
  }
  return p;
}

/**
 * A stdout whose reader has gone away is not a failure of the command.
 *
 * `node bin/selftest.mjs | head -1` - or `| grep -m1`, or a pager somebody quits - closes
 * the pipe, and Node turns the next write into an unhandled 'error' event: the process
 * died with a raw stack and exit 1 while the suite was still running, so a healthy run
 * reported itself as broken and the result file was never written (found 2026-09-28,
 * break-test; the suite is the only entrypoint measured large enough to hit it - 99 KB of
 * output against a 64 KB pipe buffer). Dropping the writes lets the run finish with its
 * own verdict, which is the only exit code that means anything here.
 */
export function tolerateClosedStdout(stream = process.stdout) {
  stream.on('error', (err) => {
    if (err?.code !== 'EPIPE') throw err;
    stream.write = () => true;
  });
}

/** Why a write was refused, in words, by error code (2026-09-28). */
const WRITE_REFUSALS = Object.freeze({
  EACCES: 'permission denied - the folder or the file is not writable by this user',
  EPERM: 'not permitted - the folder or the file is read-only or locked',
  EROFS: 'the filesystem is read-only',
  ENOSPC: 'no space is left on the disk',
  EDQUOT: 'the disk quota is used up',
  EFBIG: 'the file would exceed the size this process may write',
  EISDIR: 'a folder is where the file should be',
  ENOTDIR: 'a file is where a folder should be',
  EEXIST: 'something already exists where a folder should be',
  EBUSY: 'the file is in use by another process',
});

/**
 * One line naming a write the environment refused - `could not write <file>: <CODE>
 * (<why>).` - or null when `err` is not such a refusal. Entrypoints that write catch with
 * this and exit 2: an environment fact ("your folder is read-only") reached the top as a
 * Node stack trace, exit 1, which reads as a bug in the kit (found 2026-09-28). Anything
 * else is re-thrown by the caller, so a genuine bug keeps its stack.
 */
export function writeFailure(err, cwd = process.cwd()) {
  const why = WRITE_REFUSALS[err?.code];
  if (!why) return null;
  const where = err.target ?? err.dest ?? err.path;
  const shown = where ? (isInside(cwd, path.resolve(cwd, where)) ? path.relative(cwd, path.resolve(cwd, where)) : where) : 'a file';
  return `could not write ${shown}: ${err.code} (${why}).`;
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
  // Same guard as readText, for the same measured reason: hashing a fifo hangs here and
  // hashing /dev/zero exhausts memory. A null is "could not hash it", which every caller
  // already handles, rather than a run that never returns.
  if (!isRegularFile(p)) return null;
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
 *
 * NOT RECURSIVE, and that is a correctness property rather than an optimisation.
 *
 * The recursive form - `[${value.map(canonicalJson).join(',')}]` - overflowed the
 * JavaScript stack at a few thousand levels of nesting. Measured, not supposed: a
 * 3,000-deep object threw `RangeError: Maximum call stack size exceeded`, and the depth
 * at which it did moved with whatever else was on the stack, so it was not even a stable
 * limit to document. This function hashes the fetch ledger, a file that travels between
 * machines through git and that a person may hand-edit, so ONE deeply nested line ended
 * the process - `handoff.mjs`, the first command a builder runs, printed a bare V8 stack
 * trace and exited 1, the code that means "the corpus did not arrive" (found 2026-09-28,
 * break-test). Depth is a property of the input; it must not be able to end the run.
 *
 * The rendering is byte-for-byte what the recursive form produced, corners included,
 * because every hash in the ledger and in the conformance vectors depends on that
 * staying true. The corners are: keys sorted at every depth; an object key whose value is
 * `undefined` dropped; and a member `JSON.stringify` cannot encode rendered as an empty
 * string inside an ARRAY but as the four letters "undefined" inside an OBJECT - which is
 * what `join(',')` and a template literal respectively did, and which a rewrite has to
 * reproduce rather than tidy. Verified differentially against the recursive form over
 * 20,000 generated structures before this replaced it.
 */
export function canonicalJson(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);

  /** One frame per open container: its members in canonical order, and how far through them. */
  const frameOf = (node) => (Array.isArray(node)
    ? { keys: null, node, at: 0 }
    : { keys: Object.keys(node).filter((k) => node[k] !== undefined).sort(), node, at: 0 });

  const parts = [];
  const stack = [];
  // The containers open on the way down. The recursive form failed fast on a cycle (a
  // stack overflow); a loop would walk one forever, so a cycle is refused by name. Only
  // ANCESTORS count: a value shared by two siblings is not a cycle and still renders.
  const open = new Set([value]);
  let frame = frameOf(value);
  parts.push(frame.keys === null ? '[' : '{');
  for (;;) {
    const isArray = frame.keys === null;
    const count = isArray ? frame.node.length : frame.keys.length;
    if (frame.at >= count) {
      parts.push(isArray ? ']' : '}');
      open.delete(frame.node);
      frame = stack.pop();
      if (!frame) return parts.join('');
      continue;
    }
    if (frame.at > 0) parts.push(',');
    const key = isArray ? frame.at : frame.keys[frame.at];
    frame.at += 1;
    if (!isArray) parts.push(`${JSON.stringify(key)}:`);
    const child = frame.node[key];
    if (child !== null && typeof child === 'object') {
      if (open.has(child)) throw new TypeError('canonicalJson: the value is cyclic - it contains itself, so it has no JSON rendering');
      open.add(child);
      stack.push(frame);
      frame = frameOf(child);
      parts.push(frame.keys === null ? '[' : '{');
      continue;
    }
    const encoded = JSON.stringify(child);
    // The two container kinds rendered a member JSON cannot encode (a hole in a sparse
    // array, a present `undefined`, a symbol, a function) DIFFERENTLY in the recursive
    // form, and both spellings are load-bearing for byte-equality, so both are kept:
    // an array went through `Array.prototype.join`, which renders `undefined` as an empty
    // string, while an object went through a template literal, which renders it as the
    // four letters "undefined".
    parts.push(encoded === undefined ? (isArray ? '' : 'undefined') : encoded);
  }
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
 * Repeated flags collect into an array. A bare `--` ends the options, as POSIX has it:
 * everything after it is positional, even an argument that starts with `--`.
 */
export function parseFlags(argv) {
  const flags = Object.create(null);
  const positional = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--') { positional.push(...argv.slice(i + 1)); break; }
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
export function documentCommand(script, args = '', { kit = fileURLToPath(new URL('..', import.meta.url)), home = homeDir(), root = null } = {}) {
  // The project's own spelling wins (ADR-0084): new-project records the --kit it wrote into
  // every scaffolded file, and a brief that named this machine's checkout instead sat in a
  // project whose AGENTS.md said $HOME (found 2026-09-28 on MoonAliza).
  const recorded = root ? projectKitPath(root) : null;
  if (recorded) return `node "${recorded}/bin/${script}"${args ? ` ${args}` : ''}`;
  const real = (p) => { try { return fs.realpathSync(p); } catch { return path.resolve(p); } };
  if (real(kit) === real(path.join(home, '.agents', 'research-kit'))) return homeCommand(script, args);
  return spellCommand(path.join(kit, 'bin', script), args);
}

/**
 * How this project spells the kit: `kitPath` in research/kit.json, written by new-project
 * from --kit. Null for a project scaffolded before it was recorded, or an unreadable file -
 * the caller then falls back to the running kit's spelling.
 */
export function projectKitPath(root) {
  try {
    const value = parseJson(readText(path.join(root, ...PATHS.kit.split('/'))) ?? 'null')?.kitPath;
    return typeof value === 'string' && value.trim() && !/[\r\n"]/.test(value) ? value.trim() : null;
  } catch { return null; }
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
