// audit.mjs - the audit family (ADR-0019).
//
// Immutable single-file snapshots under `research/audits/`: one full-corpus file plus
// one per COVERED/GAP subtopic, their versioning (fingerprint-driven, never
// overwritten), the manifest reader, and the bundle.
//
// A DERIVED artifact: it reads the corpus and never writes back to it, and it renders
// only when the gate passes.

import fs from 'node:fs';
import path from 'node:path';
import {
  PATHS, resolve, relative, isInside, exists, readJson, writeJson, writeText, readText, today,
  makeSlug, sha256, canonicalJson,
} from './core.mjs';
import { readCorpus, claimOf, captureOf, traceOf } from './corpus.mjs';
import { runPreflight } from './preflight.mjs';
import { briefSection, judgedSection, BRIEF_SECTIONS } from './brief.mjs';
import { writeZip } from './archive.mjs';

/**
 * Filename budget, in characters, for the two variable segments of an audit path.
 *
 * Windows MAX_PATH is 260 for tools without long-path support, and the project root
 * counts against it. A relative path this kit generates should leave room for a deep
 * one: 60 + 28 plus the fixed parts keeps an audit under ~110 characters, which fits a
 * ~145-character root. Beyond that an operator needs `core.longpaths`, and the kit
 * should say so rather than letting them discover it when `git add` refuses - which is
 * how this repository found out, at a 272-character absolute path.
 */
export const TOPIC_SLUG = 60;
export const SUBTOPIC_SLUG = 28;

const MANIFEST = 'index.json';

function manifestPath(root) {
  return resolve(root, `${PATHS.audits}/${MANIFEST}`);
}

/**
 * A FUNCTION, not a constant. A shared `{ topics: {} }` spread into every read hands
 * every caller the same inner object, so the first project to record a version mutates
 * the template and every later project inherits its topics.
 */
const emptyManifest = () => ({ version: 1, topics: {} });

/**
 * ABSENT and CORRUPT are different answers.
 *
 * Collapsing them made a corrupt `index.json` read as "no audits yet": the next render
 * restarted at v0.1 and overwrote an existing v0.1 file, which is the immutability the
 * whole family promises. A corrupt manifest is refused; recovery is a deliberate act.
 */
export function readManifestState(root) {
  const file = manifestPath(root);
  if (!exists(file)) return { state: 'absent', manifest: emptyManifest(), file };
  const text = readText(file, '');
  try {
    const parsed = JSON.parse(text || '{}');
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('not an object');
    return { state: 'readable', manifest: { ...emptyManifest(), ...parsed }, file };
  } catch (err) {
    return { state: 'corrupt', manifest: null, file, error: err.message };
  }
}

export function readManifest(root) {
  const read = readManifestState(root);
  return read.manifest ?? emptyManifest();
}

/**
 * `listVersions(root)` -> `{ known, topics }` with THE one ordering. `bin/audit.mjs`
 * prints what this returns; it used to walk the raw index itself with a second sort,
 * which made this reader dead code and the ordering unsettleable.
 */
export function listVersions(root) {
  const manifest = readManifest(root);
  const topics = Object.entries(manifest.topics ?? {})
    .map(([slug, record]) => ({
      slug,
      topic: record.topic ?? slug,
      latest: record.latest ?? null,
      versions: Object.keys(record.versions ?? {}).sort(compareVersions),
    }))
    .sort((a, b) => a.slug.localeCompare(b.slug));
  return { known: topics.map((t) => t.slug), topics };
}

function compareVersions(a, b) {
  const pa = String(a).split('.').map(Number);
  const pb = String(b).split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i += 1) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d) return d;
  }
  return 0;
}

/** One version's paths, or null. Never a directory listing. */
export function resolveVersion(root, slug, version = null) {
  const manifest = readManifest(root);
  const record = manifest.topics?.[slug];
  if (!record) return null;
  const want = version ?? record.latest;
  const held = record.versions?.[want];
  if (!held) return null;
  return { slug, topic: record.topic ?? slug, version: want, date: held.date, main: held.main, subtopics: held.subtopics ?? [] };
}

/** The version a fingerprint earns: unchanged corpus, unchanged version. */
export function nextVersion(root, slug, fingerprint) {
  const manifest = readManifest(root);
  const record = manifest.topics?.[slug];
  if (!record) return { version: '0.1', fresh: true };
  const match = Object.entries(record.versions ?? {}).find(([, held]) => held.fingerprint === fingerprint);
  if (match) return { version: match[0], fresh: false };
  const highest = Object.keys(record.versions ?? {}).sort(compareVersions).pop() ?? '0.0';
  const parts = String(highest).split('.').map(Number);
  return { version: `${parts[0] ?? 0}.${(parts[1] ?? 0) + 1}`, fresh: true };
}

/**
 * The fingerprint covers EVERY input the audit renders.
 *
 * It used to cover only IDs, dates, paths and statuses, so editing a claim - or
 * answering the brief's Decision, which the audit prints verbatim - left the version
 * saying "unchanged". A derived artifact whose dependency set is narrower than its
 * output is one that quietly goes stale.
 */
export function fingerprintOf(corpus) {
  return sha256(canonicalJson({
    topic: corpus.map.topic,
    intent: corpus.intent,
    unknowns: corpus.unknowns.map((u) => [u.id, u.text, u.why, u.status, u.evidence]),
    evidence: corpus.evidence.map((e) => [e.id, e.retrieved, e.type, e.url, e.finding, e.raw]),
    subtopics: corpus.subtopics.map((s) => [s.id, s.text, s.why, s.status, s.coveredBy]),
    sources: corpus.sources.map((s) => [s.url, s.type, s.title, s.retrieved, s.usedFor]),
    // The audit renders these, so they are inputs like any other.
    judged: BRIEF_SECTIONS.filter((s) => s.judged).map((s) => [s.key, briefSection(corpus.brief.text, s.key)]),
    captures: corpus.captures.entries.map((c) => [c.file, c.transport, c.completeness, c.omitted]),
    chain: corpus.ledger.entries.length,
  })).slice(0, 16);
}

/**
 * An audit file is immutable. Writing one that already exists is allowed only when the
 * bytes are identical (a re-render of the same version is idempotent); different bytes
 * under the same name is refused, because that is the promise being broken.
 */
function writeImmutable(root, rel, body) {
  const abs = resolve(root, rel);
  if (exists(abs)) {
    if (readText(abs) === body) return { written: false, reason: 'identical' };
    const err = new Error(`refusing to overwrite ${rel}: an audit is immutable, and these bytes differ from the ones already there`);
    err.code = 'IMMUTABLE_AUDIT';
    throw err;
  }
  writeText(abs, body);
  return { written: true };
}

// ---------------------------------------------------------------- rendering

function mainAudit(corpus, { version, date, verdict }) {
  const lines = [];
  lines.push(`# Audit - ${corpus.map.topic || 'this project'} (v${version}, ${date})`);
  lines.push('');
  lines.push('A self-contained snapshot of one research pass: everything a reader needs to');
  lines.push('judge it without opening the repository. Immutable - a later pass writes a new version.');
  lines.push('');
  lines.push(`**Gate:** ${verdict.pass ? 'PASS' : 'FAIL'} - ${verdict.counts.fail} blocking, ${verdict.counts.warn} warning(s).`);
  lines.push('');
  lines.push('## Build intent');
  lines.push('');
  lines.push(corpus.intent || '_not stated_');
  lines.push('');
  lines.push('## Blocking unknowns');
  lines.push('');
  lines.push('| ID | Unknown | Status | Claim it rests on |');
  lines.push('|---|---|---|---|');
  for (const unknown of corpus.unknowns) {
    lines.push(`| ${unknown.id} | ${unknown.text} | ${unknown.status} | ${claimOf(corpus, unknown).replace(/\|/g, '\\|')} |`);
  }
  lines.push('');
  lines.push('## Evidence');
  lines.push('');
  lines.push('| ID | Retrieved | Type | URL | Finding | Transport | Completeness |');
  lines.push('|---|---|---|---|---|---|---|');
  for (const row of corpus.evidence) {
    const trace = traceOf(corpus, row);
    const capture = trace.capture;
    lines.push(`| ${row.id} | ${row.retrieved} | ${row.type} | ${row.url} | ${row.finding.replace(/\|/g, '\\|')} | ${trace.fetch?.transport ?? capture?.transport ?? '-'} | ${capture?.completeness ?? '-'} |`);
  }
  lines.push('');
  lines.push('## Subtopic coverage');
  lines.push('');
  lines.push('| ID | Subtopic | Status | Covered by |');
  lines.push('|---|---|---|---|');
  for (const row of corpus.subtopics) {
    lines.push(`| ${row.id} | ${row.text} | ${row.status} | ${row.coveredBy.replace(/\|/g, '\\|')} |`);
  }
  lines.push('');
  lines.push('## The brief\'s judged sections');
  lines.push('');
  for (const section of BRIEF_SECTIONS.filter((s) => s.judged)) {
    const judged = judgedSection(corpus.brief.text, section.key);
    lines.push(`### ${section.heading}`);
    lines.push('');
    lines.push(judged?.answered ? judged.body : '_not yet answered_');
    lines.push('');
  }
  lines.push('## Provenance');
  lines.push('');
  lines.push(`- ledger entries: ${corpus.ledger.entries.length}`);
  lines.push(`- captures on disk: ${corpus.captures.entries.length}`);
  lines.push(`- chain: ${corpus.chain?.ok ? 'verifies' : `${corpus.chain?.problems.length ?? '?'} problem(s)`}`);
  lines.push('');
  return `${lines.join('\n')}\n`;
}

function subtopicAudit(corpus, row, { version, date }) {
  const cited = row.cites
    .map((id) => corpus.unknowns.find((u) => u.id.toUpperCase() === id.toUpperCase()))
    .filter(Boolean);
  const lines = [
    `# Audit - ${row.id} ${row.text} (v${version}, ${date})`,
    '',
    `**Status:** ${row.status}`,
    '',
    `**Why it matters:** ${row.why || '_not stated_'}`,
    '',
    `**Covered by:** ${row.coveredBy || '_nothing cited_'}`,
    '',
    '## The unknowns behind it',
    '',
  ];
  if (!cited.length) lines.push('_None cited._');
  for (const unknown of cited) {
    lines.push(`### ${unknown.id} - ${unknown.text}`);
    lines.push('');
    lines.push(`- status: ${unknown.status}`);
    lines.push(`- claim: ${claimOf(corpus, unknown)}`);
    for (const id of unknown.cites.filter((x) => /^E-\d+$/i.test(x))) {
      const evidenceRow = corpus.evidence.find((e) => e.id.toUpperCase() === id.toUpperCase());
      if (!evidenceRow) continue;
      const capture = captureOf(corpus, evidenceRow);
      lines.push(`- ${id}: ${evidenceRow.url} (${evidenceRow.type}, retrieved ${evidenceRow.retrieved}, ${capture?.completeness ?? 'unspecified'})`);
    }
    lines.push('');
  }
  return `${lines.join('\n')}\n`;
}

// ---------------------------------------------------------------- writing

/**
 * Render a pass. Refuses while the gate fails - an audit of an unproven corpus is a
 * snapshot of a claim nobody checked.
 */
export function writeAudit(root, { date = today(), force = false, env = process.env } = {}) {
  const held = readManifestState(root);
  if (held.state === 'corrupt') {
    return {
      written: false,
      reason: `${held.file} does not parse (${held.error}). Refusing to render: treating a corrupt manifest as an empty one restarts the version count and overwrites an immutable audit.`,
      fix: `repair or move ${held.file}, then re-run`,
    };
  }

  const corpus = readCorpus(root);
  const verdict = runPreflight(root, { corpus, env });
  if (!verdict.pass && !force) {
    return { written: false, reason: `the gate fails (${verdict.counts.fail} blocking finding(s)) - an audit renders only when it passes`, verdict };
  }

  const topic = corpus.map.topic || corpus.plan?.topic || 'untitled';
  const slug = makeSlug(topic);
  const fingerprint = fingerprintOf(corpus);
  const { version, fresh } = nextVersion(root, slug, fingerprint);
  if (!fresh && !force) {
    const held = resolveVersion(root, slug, version);
    return { written: false, reason: `the corpus is unchanged since v${version} - nothing to snapshot`, version, held };
  }

  const dir = `${PATHS.audits}`;
  const mainFile = `${dir}/${slug}-v${version}-${date}.md`;
  writeImmutable(root, mainFile, mainAudit(corpus, { version, date, verdict }));

  const subtopics = [];
  for (const row of corpus.subtopics) {
    if (row.status !== 'COVERED' && row.status !== 'GAP') continue;
    // The subtopic segment is capped for the same reason the slug is (SUBTOPIC_SLUG).
    // Uncapped, the two together produced 114-character relative paths in this
    // repository - which, under a 157-character project root, is 272 and past Windows'
    // 260-character MAX_PATH. `git add` refused until `core.longpaths` was set. The
    // files already written are left alone: they read fine, and renaming them would
    // break both the manifest that names them and the history that contains them.
    const file = `${dir}/${slug}-${makeSlug(row.id, 'row', SUBTOPIC_SLUG)}-v${version}-${date}.md`;
    writeImmutable(root, file, subtopicAudit(corpus, row, { version, date }));
    subtopics.push(file);
  }

  const manifest = readManifest(root);
  manifest.topics = manifest.topics ?? {};
  const record = manifest.topics[slug] ?? { topic, versions: {} };
  record.topic = topic;
  record.versions[version] = { date, fingerprint, main: mainFile, subtopics };
  record.latest = version;
  manifest.topics[slug] = record;
  writeJson(manifestPath(root), manifest);

  return { written: true, slug, topic, version, date, main: mainFile, subtopics, verdict };
}

// ---------------------------------------------------------------- the bundle

/**
 * One topic's latest main audit plus every subtopic audit of that version, in one zip.
 * The file list comes from the MANIFEST, never a directory listing: a listing would
 * sweep in v0.1 sitting beside v0.9, which is precisely what an operator cannot check
 * by eye once the files are inside an archive.
 */
export function zipAudit(root, { topic = '', date = today() } = {}) {
  const { known, topics } = listVersions(root);
  if (!known.length) {
    return { ok: false, exit: 1, reason: 'no audits exist yet', fix: 'node research-kit/bin/audit.mjs' };
  }

  let slug = '';
  if (topic) {
    const exact = known.find((k) => k === topic);
    if (exact) slug = exact;
    else {
      const prefixed = known.filter((k) => k.startsWith(topic));
      if (prefixed.length === 1) [slug] = prefixed;
      else if (prefixed.length > 1) {
        return { ok: false, exit: 2, reason: `"${topic}" matches ${prefixed.length} topics`, known: prefixed };
      } else {
        return { ok: false, exit: 1, reason: `no audits for topic "${topic}"`, known };
      }
    }
  } else if (known.length === 1) {
    [slug] = known;
  } else {
    return { ok: false, exit: 2, reason: 'several topics hold audits and none was named', known, fix: 'pass --topic <slug>' };
  }

  const record = topics.find((t) => t.slug === slug);
  const resolved = resolveVersion(root, slug, record.latest);
  if (!resolved) return { ok: false, exit: 1, reason: `the manifest holds no latest version for "${slug}"` };

  const files = [resolved.main, ...resolved.subtopics];
  const auditsDir = resolve(root, PATHS.audits);
  // The BOUNDARY must be resolved the same way the file is, or the comparison is between
  // two different namings of the same place.
  //
  // It was not. `real` was realpath'd and `auditsDir` was not, so any project reached
  // through a symlink refused to bundle its own files: on macOS /var is a symlink to
  // /private/var, so a file at /var/.../audits/x.md realpaths to /private/var/... and
  // "resolves outside" an audits directory it is literally inside. Real users hit this
  // wherever a project lives under a symlink - a macOS temp dir, a symlinked ~/projects,
  // a Linux /home -> /mnt/home. Found by the macOS CI leg on its first run.
  //
  // Both comparisons are kept: plain against plain still catches a manifest naming ../..
  // when the target does not exist and realpath cannot say anything.
  let auditsReal = auditsDir;
  try { auditsReal = fs.realpathSync(auditsDir); } catch { /* not created yet; plain check still applies */ }
  const entries = [];
  for (const file of files) {
    // A manifest can arrive from another machine with the corpus. Containment is checked
    // on the SOURCE PATH, before the read: sanitising the archive entry name afterwards
    // does nothing about a file that was already read from outside the project.
    const abs = resolve(root, file);
    let real = abs;
    try { real = fs.realpathSync(abs); } catch { /* checked as a plain path below */ }
    if (!isInside(auditsDir, abs) || (exists(abs) && !isInside(auditsReal, real))) {
      return {
        ok: false,
        exit: 1,
        reason: `the manifest names ${file}, which resolves outside ${PATHS.audits}/ - refusing to package it`,
        fix: `repair ${PATHS.audits}/index.json`,
      };
    }
    const text = readText(abs);
    if (text === null) {
      // A partial bundle looks like a complete one until somebody reads it.
      return { ok: false, exit: 1, reason: `the manifest names ${file}, which is not on disk - refusing to bundle short`, fix: 'node research-kit/bin/audit.mjs' };
    }
    entries.push({ name: path.basename(file), data: text });
  }

  // The archive's name is deterministic from the manifest - topic, version and date -
  // so it is self-describing before anyone opens it, and nothing needs recording.
  const name = `${PATHS.audits}/${slug}-v${resolved.version}-${resolved.date ?? date}.zip`;
  const written = writeZip(resolve(root, name), entries);
  return {
    ok: true,
    exit: 0,
    file: name,
    absolute: written.file,
    bytes: written.bytes,
    slug,
    version: resolved.version,
    count: entries.length,
  };
}

export { briefSection, exists };
