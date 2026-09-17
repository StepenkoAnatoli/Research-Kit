// The corpus has one owner (ADR-0003), and the format's joins live with it (ADR-0015).

import { test, describe, assert, makePassingProject, makeProject, corrupt, fs } from './harness.mjs';
import { PATHS, HEADERS, resolve, writeText, readText } from '../lib/core.mjs';
import {
  readCorpus, readCaptures, parseTable, parseCapture, splitRow, escapeCell, tableRow,
  repairRowArity, captureEntry, rememberCapture, cacheDecision, traceOf, captureOf,
  claimOf, sectionOf, appendRow, upsertRow, nextId, citedIds,
} from '../lib/corpus.mjs';

describe('corpus');

test('splitRow honours escaped pipes; escapeCell round-trips through them', () => {
  assert.deepEqual(splitRow('| a | b\\|c | d |'), ['a', 'b|c', 'd']);
  assert.equal(escapeCell('b|c'), 'b\\|c');
  assert.deepEqual(splitRow(tableRow(['a', 'b|c', 'd'])), ['a', 'b|c', 'd']);
  assert.equal(escapeCell('two\nlines'), 'two lines', 'a cell is one line by construction');
});

test('repairRowArity pads a short row and folds a long one into its last cell', () => {
  assert.deepEqual(repairRowArity(['a'], 3), { cells: ['a', '', ''], repaired: true });
  assert.deepEqual(repairRowArity(['a', 'b', 'c', 'd'], 3), { cells: ['a', 'b', 'c | d'], repaired: true });
  assert.deepEqual(repairRowArity(['a', 'b', 'c'], 3), { cells: ['a', 'b', 'c'], repaired: false });
});

test('parseTable finds the table by its first header cell and reports arity problems', () => {
  const text = `# Heading\n\nprose\n\n${tableRow(HEADERS.evidence)}\n|---|---|---|---|---|---|\n| E-01 | 2026-01-01 | P | https://x.invalid | a claim | research/raw/a.md |\n| E-02 | short |\n`;
  const table = parseTable(text, HEADERS.evidence);
  assert.equal(table.rows.length, 2);
  assert.equal(table.rows[0].URL, 'https://x.invalid');
  assert.equal(table.problems.length, 1);
  assert.equal(table.problems[0].kind, 'table-arity');
});

test('parseTable stops at the end of the table, not the end of the file', () => {
  const text = `${tableRow(HEADERS.sources)}\n|---|---|---|---|---|\n| https://x.invalid | P | T | 2026-01-01 | U-1 |\n\n## Another section\n\n| not | a | row |\n`;
  assert.equal(parseTable(text, HEADERS.sources).rows.length, 1);
});

test('parseCapture splits front-matter from the body', () => {
  const { front, body } = parseCapture('---\nurl: https://x.invalid\nretrieved: 2026-01-01\ncompleteness: partial\nomitted: chunk 0 of 3\n---\n\n# Page\n');
  assert.equal(front.url, 'https://x.invalid');
  assert.equal(front.completeness, 'partial');
  assert.equal(front.omitted, 'chunk 0 of 3');
  assert.match(body, /# Page/);
});

test('the capture index is keyed by URL, newest retrieval winning', () => {
  const dir = makeProject();
  writeText(resolve(dir, `${PATHS.raw}/2026-01-01-a-x-1.md`), '---\nurl: https://x.invalid/p\nretrieved: 2026-01-01\n---\n\nold\n');
  writeText(resolve(dir, `${PATHS.raw}/2026-06-01-a-x-2.md`), '---\nurl: https://x.invalid/p\nretrieved: 2026-06-01\n---\n\nnew\n');
  const captures = readCaptures(dir);
  assert.equal(captures.entries.length, 2);
  assert.equal(captures.byUrl.get('https://x.invalid/p').retrieved, '2026-06-01');
});

test('dotfiles under research/raw are the kit\'s logs, not captures', () => {
  const dir = makePassingProject();
  assert.equal(readCaptures(dir).entries.some((e) => e.file.includes('.fetches')), false);
});

test('captureEntry is the ONE constructor: the reader and the collector agree field for field', () => {
  const dir = makePassingProject();
  const fromDisk = readCaptures(dir).entries[0];
  const rebuilt = captureEntry({ ...fromDisk });
  assert.deepEqual(Object.keys(rebuilt).sort(), Object.keys(fromDisk).sort());
  assert.deepEqual(rebuilt, fromDisk);
});

test('rememberCapture puts a mid-run capture into every index the reader builds', () => {
  const dir = makePassingProject();
  const captures = readCaptures(dir);
  const entry = captureEntry({ file: 'research/raw/new.md', url: 'https://x.invalid/new', retrieved: '2026-09-17' });
  rememberCapture(captures, entry);
  assert.equal(captures.byUrl.get('https://x.invalid/new'), entry);
  assert.equal(captures.byFile.get('research/raw/new.md'), entry);
});

test('cacheDecision: fresh hits, stale misses, force always misses, undated never hits', () => {
  const captures = { byUrl: new Map([['u', captureEntry({ file: 'f', url: 'u', retrieved: '2026-09-01' })]]) };
  const now = new Date('2026-09-17T00:00:00Z');
  assert.equal(cacheDecision(captures, 'u', { refreshDays: 30, now }).hit, true);
  assert.equal(cacheDecision(captures, 'u', { refreshDays: 5, now }).reason, 'stale');
  assert.equal(cacheDecision(captures, 'u', { refreshDays: 30, force: true, now }).reason, 'forced');
  assert.equal(cacheDecision(captures, 'missing', { now }).reason, 'not-collected');

  const undated = { byUrl: new Map([['u', captureEntry({ file: 'f', url: 'u', retrieved: '' })]]) };
  assert.equal(cacheDecision(undated, 'u', { now }).reason, 'undated');
});

test('traceOf joins a row to its fetch and its capture', () => {
  const dir = makePassingProject();
  const corpus = readCorpus(dir);
  const trace = traceOf(corpus, corpus.evidence[0]);
  assert.ok(trace.capture, 'the capture half');
  assert.ok(trace.fetch, 'the ledger half');
  assert.equal(trace.fetch.raw, trace.capture.file);
});

test('an empty Raw cell matches on the URL alone - the subtle clause, in one place', () => {
  const dir = makePassingProject();
  corrupt(dir, PATHS.evidence, (text) => text.replace(/\| research\/raw\/[^|]*\|/, '|  |'));
  const corpus = readCorpus(dir);
  const row = corpus.evidence[0];
  assert.equal(row.raw, '');
  assert.ok(captureOf(corpus, row), 'the capture is still found, by URL');
  assert.ok(traceOf(corpus, row).fetch, 'and so is the fetch');
});

test('claimOf returns the first cited row\'s finding, falling back to the unknown\'s own text', () => {
  const dir = makePassingProject();
  const corpus = readCorpus(dir);
  assert.match(claimOf(corpus, corpus.unknowns[0]), /10 requests per minute/);
  assert.equal(claimOf(corpus, { cites: [], text: 'nothing cited' }), 'nothing cited');
});

test('a cited capture that is not on disk is a corpus problem', () => {
  const dir = makePassingProject();
  const capture = readCorpus(dir).captures.entries[0];
  fs.rmSync(resolve(dir, capture.file));
  assert.ok(readCorpus(dir).problems.some((p) => p.kind === 'raw-dangling'));
});

test('a plan that will not parse is reported, never absorbed', () => {
  const dir = makePassingProject();
  writeText(resolve(dir, PATHS.plan), '{ not json');
  const corpus = readCorpus(dir);
  assert.equal(corpus.plan, null);
  assert.ok(corpus.problems.some((p) => p.kind === 'plan-unparsed'));
});

test('sectionOf reads one heading\'s body and stops at the next heading of its level', () => {
  const text = '# Title\n\n## Build intent\n\nthe intent\n\n### deeper\n\nstill inside\n\n## Unknowns\n\nnot this\n';
  assert.match(sectionOf(text, 'Build intent'), /the intent/);
  assert.match(sectionOf(text, 'Build intent'), /still inside/);
  assert.doesNotMatch(sectionOf(text, 'Build intent'), /not this/);
});

test('citedIds finds every id in a free-text cell', () => {
  assert.deepEqual(citedIds('E-01: proven, see also U-2 and D-9'), ['E-01', 'U-2', 'D-9']);
});

test('appendRow creates the table when it is absent, and appends to it when it is not', () => {
  const dir = makeProject();
  appendRow(dir, PATHS.evidence, HEADERS.evidence, ['E-01', '2026-01-01', 'P', 'https://x.invalid', 'a claim', 'research/raw/a.md']);
  appendRow(dir, PATHS.evidence, HEADERS.evidence, ['E-02', '2026-01-02', 'P', 'https://y.invalid', 'another', 'research/raw/b.md']);
  const rows = parseTable(readText(resolve(dir, PATHS.evidence)), HEADERS.evidence).rows;
  assert.deepEqual(rows.map((r) => r.ID), ['E-01', 'E-02']);
});

test('upsertRow replaces by first cell rather than growing a duplicate', () => {
  const dir = makeProject();
  upsertRow(dir, PATHS.sources, HEADERS.sources, ['https://x.invalid', 'P', 'Title', '2026-01-01', 'U-1']);
  upsertRow(dir, PATHS.sources, HEADERS.sources, ['https://x.invalid', 'P', 'Better title', '2026-02-01', 'U-1, U-2']);
  const rows = parseTable(readText(resolve(dir, PATHS.sources)), HEADERS.sources).rows;
  assert.equal(rows.length, 1);
  assert.equal(rows[0].Title, 'Better title');
});

test('nextId continues the sequence it is shown', () => {
  assert.equal(nextId('E', []), 'E-01');
  assert.equal(nextId('E', [{ id: 'E-01' }, { id: 'E-09' }]), 'E-10');
  assert.equal(nextId('U', [{ id: 'U-3' }]), 'U-04');
});
