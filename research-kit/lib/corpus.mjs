// corpus.mjs - the research corpus has one owner (ADR-0003).
//
// One reader (readCorpus / readCaptures / parseTable / parseCapture / readOverrides),
// one writer family (appendRow / upsertRow / appendJsonLine), the cache decision over
// the capture index, and the format's joins (traceOf / captureOf / claimOf, ADR-0015).
//
// Malformation is reported, never absorbed: a row whose arity does not match its header
// becomes a corpus problem, and the corpus never decides whether a problem blocks.

import fs from 'node:fs';
import path from 'node:path';
import {
  PATHS, HEADERS, resolve, relative, exists, isDirectory, readText, readJson,
  writeText, appendLine, listFiles, sha256File, ageInDays, hostOf,
} from './core.mjs';
import { sketch } from './similarity.mjs';

// ---------------------------------------------------------------- table machinery

/** Split one markdown table row into cells, honouring `\|` escapes. */
export function splitRow(line) {
  const body = String(line).trim().replace(/^\|/, '').replace(/\|$/, '');
  const cells = [];
  let current = '';
  for (let i = 0; i < body.length; i += 1) {
    const ch = body[i];
    if (ch === '\\' && body[i + 1] === '|') {
      current += '|';
      i += 1;
      continue;
    }
    if (ch === '|') {
      cells.push(current.trim());
      current = '';
      continue;
    }
    current += ch;
  }
  cells.push(current.trim());
  return cells;
}

export function escapeCell(value) {
  return String(value ?? '').replace(/\r?\n/g, ' ').replace(/\|/g, '\\|').trim();
}

export function tableRow(cells) {
  return `| ${cells.map(escapeCell).join(' | ')} |`;
}

function isSeparator(line) {
  return /^\|?[\s:|-]+\|[\s:|-]*$/.test(line.trim()) && line.includes('-');
}

/**
 * A row with too few cells is padded and a row with too many is folded into its last
 * cell - both are reported. Repairing silently would hide the defect; refusing outright
 * would lose the rest of a corpus over one bad line.
 */
export function repairRowArity(cells, width) {
  if (cells.length === width) return { cells, repaired: false };
  if (cells.length < width) {
    return { cells: [...cells, ...Array(width - cells.length).fill('')], repaired: true };
  }
  const head = cells.slice(0, width - 1);
  const tail = cells.slice(width - 1).join(' | ');
  return { cells: [...head, tail], repaired: true };
}

/**
 * Parse the first markdown table whose header starts with `header[0]`.
 * Returns `{ header, rows, problems }`; every row carries its 1-based `line`.
 */
export function parseTable(text, header) {
  const out = { header: [...header], rows: [], problems: [], found: false };
  if (!text) return out;
  const lines = String(text).split(/\r?\n/);
  const want = new Set(header.map((name) => name.trim().toLowerCase()));
  let start = -1;
  for (let i = 0; i < lines.length; i += 1) {
    if (!lines[i].trim().startsWith('|')) continue;
    if (!isSeparator(lines[i + 1] ?? '')) continue;
    const cells = splitRow(lines[i]);
    // A header is recognised by its COLUMN SET, not by its first cell alone. Matching on
    // the first cell missed any table whose columns had been reordered - the reader then
    // silently found no table at all, and the writer, asking the same question, inserted
    // its row above the document's title.
    const names = cells.map((name) => name.trim().toLowerCase());
    const sameLead = names[0] === header[0].trim().toLowerCase();
    const sameSet = names.length === want.size && names.every((name) => want.has(name)) && new Set(names).size === names.length;
    if (!sameLead && !sameSet) continue;
    start = i;
    out.header = cells;
    out.found = true;
    break;
  }
  if (start < 0) return out;

  for (let i = start + 2; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.trim().startsWith('|')) break;
    if (isSeparator(line)) continue;
    const raw = splitRow(line);
    const { cells, repaired } = repairRowArity(raw, out.header.length);
    if (repaired) {
      out.problems.push({
        kind: 'table-arity',
        line: i + 1,
        detail: `row has ${raw.length} cells, header has ${out.header.length}`,
        text: line.trim(),
      });
    }
    const row = { line: i + 1, cells };
    out.header.forEach((name, idx) => { row[name] = cells[idx] ?? ''; });
    out.rows.push(row);
  }
  return out;
}

// ---------------------------------------------------------------- captures

/** Parse a raw capture: `---` front-matter followed by the page body. */
export function parseCapture(text) {
  const front = {};
  let body = String(text ?? '');
  const match = body.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (match) {
    for (const line of match[1].split(/\r?\n/)) {
      const at = line.indexOf(':');
      if (at < 0) continue;
      front[line.slice(0, at).trim()] = line.slice(at + 1).trim();
    }
    body = body.slice(match[0].length);
  }
  return { front, body };
}

/**
 * The one constructor for a capture-index entry. The reader builds through it and so
 * does the collector when it has just written a page, so an entry held in memory and
 * an entry read back from disk are the same shape, field for field.
 */
export function captureEntry({ file, url, retrieved, command, statusCode, transport, completeness, omitted, bytes }) {
  return {
    file: file ?? '',
    url: url ?? '',
    retrieved: retrieved ?? '',
    command: command ?? '',
    statusCode: statusCode ?? '',
    transport: transport ?? '',
    completeness: completeness || 'unspecified',
    omitted: omitted ?? '',
    bytes: bytes ?? 0,
  };
}

/**
 * The capture index: every file under `research/raw/`, plus `byUrl` where the newest
 * retrieval wins. Dotfiles are the kit's own logs and are not captures.
 */
export function readCaptures(root) {
  const dir = resolve(root, PATHS.raw);
  const entries = [];
  const problems = [];
  const sketches = new Map();
  for (const name of listFiles(dir).sort()) {
    if (name.startsWith('.')) continue;
    const abs = path.join(dir, name);
    if (isDirectory(abs)) continue;
    const text = readText(abs);
    if (text === null) continue;
    const { front, body } = parseCapture(text);
    const rel = `${PATHS.raw}/${name}`;
    if (!front.url) {
      problems.push({ kind: 'capture-no-url', file: rel, detail: 'capture has no url in its front-matter' });
    }
    sketches.set(rel, sketch(body));
    entries.push(captureEntry({
      file: rel,
      url: front.url,
      retrieved: front.retrieved,
      command: front.command,
      statusCode: front.statusCode,
      transport: front.transport,
      completeness: front.completeness,
      omitted: front.omitted,
      bytes: Buffer.byteLength(body, 'utf8'),
    }));
  }

  const byUrl = new Map();
  const byFile = new Map();
  for (const entry of entries) {
    byFile.set(entry.file, entry);
    if (!entry.url) continue;
    const held = byUrl.get(entry.url);
    if (!held || String(entry.retrieved) >= String(held.retrieved)) byUrl.set(entry.url, entry);
  }
  // Sketches ride alongside the index rather than inside `captureEntry`, because an entry
  // is serialised into artifact manifests and a 128-value fingerprint per capture would
  // bloat every package to answer a question only one check asks (ADR-0036 amendment).
  return { entries, byUrl, byFile, sketches, problems };
}

/** The one writer of the in-memory index, for a URL collected mid-run. */
export function rememberCapture(captures, entry) {
  if (!captures || !entry) return entry;
  captures.entries.push(entry);
  captures.byFile.set(entry.file, entry);
  if (entry.url) captures.byUrl.set(entry.url, entry);
  return entry;
}

/**
 * The one freshness predicate. A cache hit never spends scrape budget, so the collector,
 * the run coordinator, and phase 0 all ask here rather than each keeping a rule.
 */
export function cacheDecision(captures, url, { refreshDays = 30, force = false, now = new Date() } = {}) {
  const entry = captures?.byUrl?.get(url) ?? null;
  if (!entry) return { hit: false, reason: 'not-collected', entry: null, age: null };
  if (force) return { hit: false, reason: 'forced', entry, age: ageInDays(entry.retrieved, now) };
  const age = ageInDays(entry.retrieved, now);
  if (age === null) return { hit: false, reason: 'undated', entry, age: null };
  if (refreshDays >= 0 && age > refreshDays) return { hit: false, reason: 'stale', entry, age };
  return { hit: true, reason: 'fresh', entry, age };
}

// ---------------------------------------------------------------- ledger and logs

export function readLedger(root) {
  const file = resolve(root, PATHS.ledger);
  const text = readText(file);
  if (text === null) return { present: false, entries: [], problems: [], lines: [] };
  const lines = text.split(/\r?\n/);
  const entries = [];
  const problems = [];
  lines.forEach((line, idx) => {
    if (!line.trim()) return;
    try {
      entries.push({ ...JSON.parse(line), line: idx + 1 });
    } catch (err) {
      problems.push({ kind: 'ledger-unparsed', line: idx + 1, detail: err.message });
    }
  });
  return { present: true, entries, problems, lines };
}

export function readOverrides(root) {
  const text = readText(resolve(root, PATHS.overrides));
  if (text === null) return [];
  return text.split(/\r?\n/).filter((l) => l.trim()).map((line) => {
    const [at, kind, ...rest] = line.split('\t');
    return { at, kind, detail: rest.join('\t'), text: line };
  });
}

export function appendJsonLine(root, rel, value) {
  return appendLine(resolve(root, rel), JSON.stringify(value));
}

// ---------------------------------------------------------------- the snapshot

/** Read the whole corpus as one value. Pure of judgement: it reports, never decides. */
export function readCorpus(root) {
  const at = (rel) => resolve(root, rel);
  const problems = [];

  const discoveryText = readText(at(PATHS.discovery));
  const evidenceText = readText(at(PATHS.evidence));
  const sourcesText = readText(at(PATHS.sources));
  const mapText = readText(at(PATHS.map));
  const briefText = readText(at(PATHS.brief));

  const unknownsTable = parseTable(discoveryText, HEADERS.unknowns);
  const evidenceTable = parseTable(evidenceText, HEADERS.evidence);
  const sourcesTable = parseTable(sourcesText, HEADERS.sources);
  const subtopicTable = parseTable(mapText, HEADERS.subtopics);

  for (const [artifact, table] of [
    [PATHS.discovery, unknownsTable], [PATHS.evidence, evidenceTable],
    [PATHS.sources, sourcesTable], [PATHS.map, subtopicTable],
  ]) {
    for (const p of table.problems) problems.push({ ...p, artifact });
  }

  const planText = readText(at(PATHS.plan));
  let plan = null;
  if (planText !== null) {
    try {
      plan = JSON.parse(planText);
    } catch (err) {
      problems.push({ kind: 'plan-unparsed', artifact: PATHS.plan, detail: err.message });
    }
  }

  const captures = readCaptures(root);
  for (const p of captures.problems) problems.push({ ...p, artifact: PATHS.raw });

  const ledger = readLedger(root);
  for (const p of ledger.problems) problems.push({ ...p, artifact: PATHS.ledger });

  const unknowns = unknownsTable.rows
    .filter((r) => /^U-\d+$/i.test(r.ID ?? ''))
    .map((r) => ({
      id: r.ID, text: r.Unknown ?? '', why: r[HEADERS.unknowns[2]] ?? '',
      status: (r.Status ?? '').trim().toUpperCase(), evidence: r.Evidence ?? '', line: r.line,
      cites: citedIds(r.Evidence ?? ''),
    }));

  const evidence = evidenceTable.rows
    .filter((r) => /^E-\d+$/i.test(r.ID ?? ''))
    .map((r) => ({
      id: r.ID, retrieved: r.Retrieved ?? '', type: (r.Type ?? '').trim().toUpperCase(),
      url: r.URL ?? '', finding: r.Finding ?? '', raw: normalizeRawCell(r.Raw ?? ''), line: r.line,
    }));

  const subtopics = subtopicTable.rows
    .filter((r) => /^[A-Z]+-\d+$/i.test(r.ID ?? ''))
    .map((r) => ({
      id: r.ID, text: r.Subtopic ?? '', why: r[HEADERS.subtopics[2]] ?? '',
      status: (r.Status ?? '').trim().toUpperCase(), coveredBy: r['Covered by'] ?? '', line: r.line,
      cites: citedIds(r['Covered by'] ?? ''),
    }));

  const sources = sourcesTable.rows.map((r) => ({
    url: r.URL ?? '', type: (r.Type ?? '').trim().toUpperCase(), title: r.Title ?? '',
    retrieved: r.Retrieved ?? '', usedFor: r['Used for'] ?? '', line: r.line,
  }));

  // A cited capture that is not on disk is a corpus problem, not a check's discovery.
  for (const row of evidence) {
    if (!row.raw) continue;
    if (!exists(at(row.raw))) {
      problems.push({ kind: 'raw-dangling', artifact: PATHS.evidence, row: row.id, file: row.raw, line: row.line });
    }
  }

  return {
    root,
    intent: sectionOf(discoveryText, 'Build intent'),
    discovery: { present: discoveryText !== null, text: discoveryText ?? '', table: unknownsTable },
    map: {
      present: mapText !== null, text: mapText ?? '', table: subtopicTable,
      topic: sectionOf(mapText, 'Topic').split(/\r?\n/).filter(Boolean).join(' ').trim(),
    },
    brief: { present: briefText !== null, text: briefText ?? '' },
    plan, planPresent: planText !== null,
    unknowns, evidence, sources, subtopics,
    captures, ledger,
    overrides: readOverrides(root),
    gateOff: exists(at(PATHS.gateOff)),
    rawPresent: isDirectory(at(PATHS.raw)),
    problems,
  };
}

/** `readCorpus` plus the chain verdict, for callers that need the whole answer. */
export async function loadCorpus(root) {
  const corpus = readCorpus(root);
  const { verifyLedger } = await import('./provenance.mjs');
  corpus.chain = verifyLedger(root, { corpus });
  return corpus;
}

// ---------------------------------------------------------------- joins (ADR-0015)

function normalizeRawCell(cell) {
  const text = String(cell ?? '').trim();
  if (!text || text === '-') return '';
  const link = text.match(/\]\(([^)]+)\)/);
  const value = (link ? link[1] : text).trim().replace(/^`|`$/g, '');
  return value.split(path.sep).join('/');
}

/** Every `E-##` / `U-##` / `D-##` id mentioned in a free-text cell. */
export function citedIds(text) {
  return [...String(text ?? '').matchAll(/\b([A-Z]+-\d+)\b/g)].map((m) => m[1]);
}

export function sectionOf(text, heading) {
  if (!text) return '';
  const lines = String(text).split(/\r?\n/);
  const want = heading.trim().toLowerCase();
  let depth = 0;
  const out = [];
  for (const line of lines) {
    const head = line.match(/^(#{1,6})\s+(.*)$/);
    if (head) {
      const title = head[2].replace(/[*_`]/g, '').trim().toLowerCase();
      if (!depth && title === want) { depth = head[1].length; continue; }
      if (depth && head[1].length <= depth) break;
    }
    if (depth) out.push(line);
  }
  return out.join('\n').trim();
}

/** The capture behind an evidence row. An empty Raw cell matches on the URL alone. */
export function captureOf(corpus, row) {
  if (!row) return null;
  if (row.raw) return corpus.captures.byFile.get(row.raw) ?? null;
  if (row.url) return corpus.captures.byUrl.get(row.url) ?? null;
  return null;
}

/** The fetch that produced an evidence row: its ledger entry plus its capture. */
export function traceOf(corpus, row) {
  const capture = captureOf(corpus, row);
  const wanted = row?.raw || capture?.file || '';
  const entries = corpus.ledger.entries.filter((e) => {
    if (e.op === 'fail') return false;
    if (wanted && e.raw === wanted) return true;
    if (!wanted && row?.url && e.url === row.url) return true;
    return false;
  });
  const fetch = entries.length ? entries[entries.length - 1] : null;
  return { row, capture, fetch, attempts: corpus.ledger.entries.filter((e) => e.url && e.url === row?.url) };
}

/** The claim an unknown rests on: the first cited row's finding, else its own text. */
export function claimOf(corpus, unknown) {
  for (const id of unknown?.cites ?? []) {
    const row = corpus.evidence.find((e) => e.id.toUpperCase() === id.toUpperCase());
    if (row?.finding) return row.finding;
  }
  return unknown?.text ?? '';
}

// ---------------------------------------------------------------- writers

/**
 * Map values given in the CANONICAL header's order onto the header actually on disk.
 *
 * The reader accepts a reordered header, so a writer that inserted values positionally
 * wrote them into whatever columns happened to be there: with `URL` and `Retrieved`
 * swapped, a collected row put the date in the URL cell and `P` in the retrieval cell,
 * and nothing complained. A header the canonical set does not cover is refused rather
 * than guessed at - the alternative is silent evidence corruption.
 */
export function alignToHeader(canonical, cells, actual) {
  if (!actual || actual.length === 0) return cells;
  const byName = new Map(canonical.map((name, i) => [name.trim().toLowerCase(), cells[i] ?? '']));
  const unknown = actual.filter((name) => !byName.has(name.trim().toLowerCase()));
  if (unknown.length) {
    const err = new Error(
      `refusing to write: the table's header holds ${unknown.map((n) => `"${n}"`).join(', ')}, `
      + `which is not in the expected set (${canonical.join(', ')}). `
      + 'Restore the header or migrate the table; a positional write here corrupts evidence silently.',
    );
    err.code = 'UNSUPPORTED_HEADER';
    throw err;
  }
  return actual.map((name) => byName.get(name.trim().toLowerCase()) ?? '');
}

/** The header a table actually carries on disk, or null when it has none yet. */
export function headerOf(text, canonical) {
  const table = parseTable(text, canonical);
  return table.found ? table.header : null;
}

/** Append one row to an artifact's table, creating the table when it is absent. */
export function appendRow(root, rel, header, cells) {
  const file = resolve(root, rel);
  const text = readText(file, '');
  const onDisk = headerOf(text, header);
  const line = tableRow(alignToHeader(header, cells, onDisk));
  if (!onDisk) {
    const head = `${tableRow(header)}\n|${header.map(() => '---').join('|')}|\n`;
    writeText(file, `${text.trimEnd()}\n\n${head}${line}\n`.replace(/^\n+/, ''));
    return line;
  }
  const lines = text.split(/\r?\n/);
  let last = -1;
  const table = parseTable(text, header);
  if (table.rows.length) last = table.rows[table.rows.length - 1].line - 1;
  else {
    // Find the header by the column the TABLE ACTUALLY LEADS WITH, not by the canonical
    // first column: on a reordered table those differ, the lookup failed, and the row was
    // spliced in at line 0 - above the document's own title.
    const leading = (onDisk?.[0] ?? header[0]).trim().toLowerCase();
    for (let i = 0; i < lines.length; i += 1) {
      if (splitRow(lines[i])[0]?.trim().toLowerCase() === leading) { last = i + 1; break; }
    }
  }
  lines.splice(last + 1, 0, line);
  writeText(file, lines.join('\n'));
  return line;
}

/** Replace the row whose first cell matches, or append it when there is none. */
export function upsertRow(root, rel, header, cells) {
  const file = resolve(root, rel);
  const text = readText(file, '');
  const table = parseTable(text, header);
  const onDisk = headerOf(text, header);
  const aligned = alignToHeader(header, cells, onDisk);
  // The key is the canonical first column's value, matched in whichever position that
  // column occupies on disk.
  const keyAt = onDisk ? onDisk.findIndex((name) => name.trim().toLowerCase() === header[0].trim().toLowerCase()) : 0;
  const key = String(cells[0]).trim().toLowerCase();
  const found = table.rows.find((r) => String(r.cells[keyAt < 0 ? 0 : keyAt]).trim().toLowerCase() === key);
  if (!found) return appendRow(root, rel, header, cells);
  const lines = text.split(/\r?\n/);
  lines[found.line - 1] = tableRow(aligned);
  writeText(file, lines.join('\n'));
  return lines[found.line - 1];
}

/** The next free `E-##` / `U-##` / `D-##` style id for a list of rows. */
export function nextId(prefix, rows) {
  let max = 0;
  for (const row of rows) {
    const m = String(row.id ?? row.ID ?? '').match(new RegExp(`^${prefix}-(\\d+)$`, 'i'));
    if (m) max = Math.max(max, Number(m[1]));
  }
  return `${prefix}-${String(max + 1).padStart(2, '0')}`;
}

export { relative, sha256File, hostOf, fs };
