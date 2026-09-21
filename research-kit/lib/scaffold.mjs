// scaffold.mjs - the canonical project shape has one owner (ADR-0001).
//
// LAYOUT is the structure; `template/` is the content. Every consumer derives from
// LAYOUT: the gate predicate reads GATE_MARKERS, the scaffolder writes it, the test
// fixture calls the same function, and doctor judges shape against it.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PATHS, resolve, exists, isDirectory, readText, writeText, ensureDir, listFiles, today } from './core.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const KIT_ROOT = path.resolve(here, '..');
export const TEMPLATE_DIR = path.join(KIT_ROOT, 'template');

/**
 * The canonical project shape: 12 entries. `gating: true` marks the four artifacts whose
 * presence makes a project gated; `dir: true` marks a directory.
 */
export const LAYOUT = Object.freeze([
  { path: PATHS.agents, required: true, gating: false },
  { path: PATHS.architecture, required: false, gating: false },
  { path: PATHS.gitattributes, required: false, gating: false },
  { path: PATHS.kit, required: false, gating: false },
  { path: PATHS.discovery, required: true, gating: true },
  { path: PATHS.map, required: false, gating: false },
  { path: PATHS.evidence, required: true, gating: true },
  { path: PATHS.sources, required: false, gating: false },
  { path: PATHS.timeline, required: false, gating: false },
  { path: PATHS.brief, required: false, gating: false },
  { path: PATHS.plan, required: true, gating: true },
  { path: PATHS.raw, required: true, gating: true, dir: true },
]);

/** Exactly four. Adding one changes which projects are gated - that needs a new ADR. */
export const GATE_MARKERS = Object.freeze(LAYOUT.filter((e) => e.gating).map((e) => e.path));

/** A hook git cannot execute is a hook git skips, silently, reporting the commit clean. */
export const HOOK_MODE = 0o755;

export function hookExecutability(file) {
  if (!exists(file)) return { ok: false, reason: 'missing', file };
  if (process.platform === 'win32') return { ok: true, reason: 'no-executable-bit-on-this-platform', file };
  const mode = fs.statSync(file).mode & 0o777;
  if (mode & 0o111) return { ok: true, reason: 'executable', file, mode };
  return { ok: false, reason: 'not-executable', file, mode, fix: `chmod +x ${file}` };
}

// ---------------------------------------------------------------- template rendering

export function renderTemplate(text, tokens) {
  return String(text).replace(/\{\{([A-Z_]+)\}\}/g, (all, name) => (
    Object.prototype.hasOwnProperty.call(tokens, name) ? String(tokens[name]) : all
  ));
}

/**
 * An unresolved `{{TOKEN}}` in a written file is a scaffold defect, not a placeholder.
 *
 * An occurrence inside an inline code span is a document QUOTING the token - which is
 * what `docs/ARCHITECTURE.md` does when it explains that the two `START_HERE.md` copies
 * "differ only in how the kit path is spelled (`~/.agents/research-kit` vs `{{KIT}}`)".
 * Flagging that made doctor permanently red on a correct project, and a diagnostic that
 * is always red is one nobody reads (ADR-0010's own argument).
 *
 * The narrow cost: a genuinely unrendered token inside a code span is missed here. That
 * is covered where it belongs - `scaffoldProject` renders every token in every template
 * file unconditionally, and a test asserts a fresh scaffold holds none anywhere. This
 * check is the downstream net, not the guarantee.
 */
export function unresolvedPlaceholders(text) {
  const prose = String(text).replace(/`[^`\n]*`/g, ' ');
  return [...new Set([...prose.matchAll(/\{\{([A-Z_]+)\}\}/g)].map((m) => m[1]))];
}

function walk(dir, base = dir, out = []) {
  for (const name of listFiles(dir).sort()) {
    const abs = path.join(dir, name);
    if (isDirectory(abs)) walk(abs, base, out);
    else out.push(path.relative(base, abs).split(path.sep).join('/'));
  }
  return out;
}

export function templateFiles(templateDir = TEMPLATE_DIR) {
  return walk(templateDir);
}

// ---------------------------------------------------------------- writing the shape

/** Structure is always repaired; content is never clobbered without `force`. */
export function scaffoldProject(dir, { topic = 'Untitled topic', kit = '~/.agents/research-kit', force = false, templateDir = TEMPLATE_DIR, date = today() } = {}) {
  const written = [];
  const skipped = [];
  const repaired = [];

  for (const entry of LAYOUT) {
    const abs = resolve(dir, entry.path);
    if (entry.dir) {
      if (!isDirectory(abs)) { ensureDir(abs); repaired.push(entry.path); }
      const keep = path.join(abs, '.gitkeep');
      if (!exists(keep)) writeText(keep, '');
      continue;
    }
    ensureDir(path.dirname(abs));
  }

  const tokens = { TOPIC: topic, DATE: date, KIT: kit, SLUG: topic.toLowerCase().replace(/[^a-z0-9]+/g, '-') };

  // A token substituted into JSON must be escaped FOR JSON.
  //
  // `template/research/plan.json` holds `"topic": "{{TOPIC}}"`, and the substitution is
  // textual. A topic containing a double quote - `Why "agentic" search costs more` - ends
  // the string early and writes a plan.json that does not parse, so `research.mjs` reads
  // an empty plan and collects nothing, reporting a corpus problem about a file the
  // operator never edited. A backslash or a newline does the same.
  //
  // Escaped per FILE rather than per token: the markdown templates want the topic
  // verbatim, and escaping it there would put `\"` into prose. `JSON.stringify` minus its
  // surrounding quotes is exactly the string-interior encoding these templates need.
  const jsonTokens = Object.fromEntries(
    Object.entries(tokens).map(([name, value]) => [name, JSON.stringify(String(value)).slice(1, -1)]),
  );

  for (const rel of templateFiles(templateDir)) {
    const target = resolve(dir, rel);
    if (exists(target) && !force) { skipped.push(rel); continue; }
    const source = readText(path.join(templateDir, ...rel.split('/')), '');
    const body = renderTemplate(source, rel.endsWith('.json') ? jsonTokens : tokens);
    writeText(target, body);
    written.push(rel);
  }

  return { dir, written, skipped, repaired };
}

/** Shape with no content - the test fixture and the scaffolder are the same call. */
export function createEmptyProject(dir) {
  for (const entry of LAYOUT) {
    const abs = resolve(dir, entry.path);
    if (entry.dir) { ensureDir(abs); writeText(path.join(abs, '.gitkeep'), ''); continue; }
    ensureDir(path.dirname(abs));
    if (!exists(abs)) writeText(abs, '');
  }
  return dir;
}

// ---------------------------------------------------------------- judging the shape

/**
 * Shape problems only. It never judges contract CONTENT - that stays preflight's job.
 */
export function validateProject(root) {
  const findings = [];
  for (const entry of LAYOUT) {
    const abs = resolve(root, entry.path);
    const there = entry.dir ? isDirectory(abs) : exists(abs);
    if (there) continue;
    findings.push({
      severity: entry.gating || entry.required ? 'fail' : 'warn',
      rule: 'shape-missing',
      path: entry.path,
      detail: `${entry.path} is missing from the project shape`,
    });
  }
  for (const entry of LAYOUT) {
    if (entry.dir) continue;
    const text = readText(resolve(root, entry.path));
    if (text === null) continue;
    const tokens = unresolvedPlaceholders(text);
    if (!tokens.length) continue;
    findings.push({
      severity: 'fail',
      rule: 'unresolved-placeholder',
      path: entry.path,
      detail: `${entry.path} still holds ${tokens.map((t) => `{{${t}}}`).join(', ')}`,
    });
  }
  return { ok: !findings.some((f) => f.severity === 'fail'), findings };
}
