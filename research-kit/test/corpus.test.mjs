// The corpus has one owner (ADR-0003), and the format's joins live with it (ADR-0015).

import { spawnSync } from 'node:child_process';
import { test, describe, assert, makePassingProject, makeProject, corrupt, fs, requireSymlink } from './harness.mjs';
import { PATHS, HEADERS, resolve, writeText, readText, sha256File, isRegularFile } from '../lib/core.mjs';
import {
  readCorpus, readCaptures, parseTable, parseCapture, splitRow, escapeCell, tableRow,
  repairRowArity, captureEntry, rememberCapture, cacheDecision, traceOf, captureOf,
  claimOf, sectionOf, appendRow, upsertRow, nextId, citedIds, stripReviewNotes, requestedUrl,
} from '../lib/corpus.mjs';
import { runPreflight } from '../lib/preflight.mjs';

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

// Found 2026-09-27: a Finding quoting code with an unescaped | (`a || b`) split its row. The
// extra cells were folded into the LAST column, Raw, so the capture path became half a sentence
// and preflight reported "no cached page behind it" - the real cause was a warning further down.
test('a long evidence row folds its extra cells into Finding, and says why the row split', () => {
  const text = `${tableRow(HEADERS.evidence)}\n|---|---|---|---|---|---|\n| E-01 | 2026-01-01 | P | https://x.invalid | runs \`a || b\` first | research/raw/a.md |\n`;
  const table = parseTable(text, HEADERS.evidence);
  assert.equal(table.rows[0].Raw, 'research/raw/a.md', 'the capture path was corrupted');
  assert.match(table.rows[0].Finding, /runs `a \| {2}\| b` first|runs `a \|\s*\|\s*b` first/);
  assert.match(table.problems[0].detail, /a \| inside a cell.*\\\|/, table.problems[0].detail);
});

// The same day, in DISCOVERY: an unknown reading "Node 22 | 24" moved its prose into Status, and
// preflight reported 'U-1 has status "THE MATRIX MUST DROP..."'. Every table folds a long row into
// its prose column, so the structured columns to its right stay where they are.
test('a long row in any table keeps its structured columns in place', () => {
  const unknowns = parseTable(`${tableRow(HEADERS.unknowns)}\n|---|---|---|---|---|\n| U-1 | Node 22 | 24 end dates | the matrix drops them | CLOSED | E-01 |\n`, HEADERS.unknowns);
  assert.equal(unknowns.rows[0].Status, 'CLOSED');
  assert.equal(unknowns.rows[0].Evidence, 'E-01');
  const map = parseTable(`${tableRow(HEADERS.subtopics)}\n|---|---|---|---|---|\n| D-1 | Access | public | or not | COVERED | U-1 |\n`, HEADERS.subtopics);
  assert.equal(map.rows[0].Status, 'COVERED');
  assert.equal(map.rows[0]['Covered by'], 'U-1');
  const sources = parseTable(`${tableRow(HEADERS.sources)}\n|---|---|---|---|---|\n| https://x.invalid | P | A | B title | 2026-01-01 | U-1 |\n`, HEADERS.sources);
  assert.equal(sources.rows[0].Retrieved, '2026-01-01');
  assert.equal(sources.rows[0]['Used for'], 'U-1');
});

// Found 2026-09-27: a Raw cell written with Windows separators (research\\raw\\x.md) was
// normalised by splitting on path.sep - which is \\ only on Windows. The same corpus passed there
// and failed on a Linux builder with "no cached page behind it". A capture path never holds a
// literal backslash, so every platform reads one as a separator.
test('a Raw cell with backslashes reads the same on every platform', () => {
  const dir = makePassingProject();
  corrupt(dir, PATHS.evidence, (text) => text.replace(/research\/raw\/([^ |]+)/, (m, name) => `research\\raw\\${name}`));
  assert.match(readText(resolve(dir, PATHS.evidence)), /research\\raw\\/, 'the fixture did not write a backslash path');
  const corpus = readCorpus(dir);
  assert.match(corpus.evidence[0].raw, /^research\/raw\/[^\\]+$/, corpus.evidence[0].raw);
  assert.equal(corpus.problems.some((p) => p.kind === 'raw-dangling'), false, 'the capture was reported missing');
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


test('readCaptures can skip the files a caller already holds, and can leave sketching to the gate', () => {
  const dir = makePassingProject();
  const all = readCaptures(dir);
  assert.ok(all.entries.length >= 1, 'the fixture holds a capture');
  assert.equal(all.sketches.size, all.entries.length, 'by default every capture is sketched');
  const known = new Set(all.entries.map((e) => e.file));
  const nothingNew = readCaptures(dir, { known });
  assert.deepEqual(nothingNew.entries, [], 'a file the caller holds is not read again');
  assert.equal(nothingNew.sketches.size, 0);
  const unsketched = readCaptures(dir, { sketches: false });
  assert.equal(unsketched.entries.length, all.entries.length, 'everything is still indexed');
  assert.equal(unsketched.sketches.size, 0, 'nothing was sketched');
  assert.ok(unsketched.byFile.has(all.entries[0].file));
});
test('the capture index also answers to the URL a redirected fetch was asked for', () => {
  const dir = makeProject();
  // Landed on the new path; the command line keeps the URL the plan named.
  writeText(resolve(dir, `${PATHS.raw}/2026-01-01-a-x-1.md`), '---\nurl: https://x.invalid/new\nretrieved: 2026-01-01\ncommand: http-keyless scrape https://x.invalid/old\n---\n\nmoved\n');
  // A capture of the asked-for URL itself outranks an alias, whatever their dates.
  writeText(resolve(dir, `${PATHS.raw}/2026-02-01-a-x-2.md`), '---\nurl: https://x.invalid/direct\nretrieved: 2026-02-01\ncommand: http-keyless scrape https://x.invalid/direct\n---\n\ndirect\n');
  writeText(resolve(dir, `${PATHS.raw}/2026-03-01-a-x-3.md`), '---\nurl: https://x.invalid/elsewhere\nretrieved: 2026-03-01\ncommand: browser https://x.invalid/direct\n---\n\nalias\n');
  const captures = readCaptures(dir);
  assert.equal(captures.byUrl.get('https://x.invalid/old')?.url, 'https://x.invalid/new', 'the asked-for URL finds the landed capture');
  assert.equal(captures.byUrl.get('https://x.invalid/direct')?.url, 'https://x.invalid/direct', 'a direct capture outranks an alias');
  assert.equal(captures.entries.length, 3, 'an alias adds no entry');
  const remembered = captureEntry({ file: 'research/raw/n.md', url: 'https://x.invalid/landed', retrieved: '2026-04-01',
    command: 'firecrawl scrape https://x.invalid/asked --only-main-content --json' });
  rememberCapture(captures, remembered);
  assert.equal(captures.byUrl.get('https://x.invalid/asked'), remembered, 'a mid-run capture is remembered under both');
});

test('requestedUrl reads the asked-for URL out of each transport\'s command line', () => {
  assert.equal(requestedUrl('http-keyless scrape https://x.invalid/a'), 'https://x.invalid/a');
  assert.equal(requestedUrl('firecrawl scrape https://x.invalid/b --only-main-content --json'), 'https://x.invalid/b');
  assert.equal(requestedUrl('firecrawl scrape https://x.invalid/c --only-main-content --json # transport: firecrawl-cli 1.2.3'), 'https://x.invalid/c');
  assert.equal(requestedUrl('browser https://x.invalid/d'), 'https://x.invalid/d');
  assert.equal(requestedUrl('agent page fetch'), '', 'a command naming no URL aliases nothing');
  assert.equal(requestedUrl(''), '');
  assert.equal(requestedUrl(undefined), '');
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

// Found 2026-09-27: a research/kit.json that did not parse raised nothing. The gate read it as
// absent and fell back to the default code paths, so the paths the operator declared stopped
// being guarded, silently.
test('a kit.json that will not parse is reported, and blocks like a broken plan', async () => {
  const dir = makePassingProject();
  writeText(resolve(dir, PATHS.kit), '{ "architecture": { "codePaths": ["engine"] }, }');
  assert.ok(readCorpus(dir).problems.some((p) => p.kind === 'kit-unparsed'), 'no problem recorded');
  const { runPreflight } = await import('../lib/preflight.mjs');
  const verdict = runPreflight(dir);
  assert.equal(verdict.pass, false, 'preflight passed with the gate configuration unreadable');
  assert.ok(verdict.failures.some((f) => f.rule === 'kit-unparsed'), JSON.stringify(verdict.failures.map((f) => f.rule)));
});

// Found 2026-09-27: a plan or kit.json saved by Windows Notepad starts with a byte-order mark,
// and was reported as not parsing - with the mark, invisible, quoted as the bad token.
test('a plan and a kit.json saved with a byte-order mark parse', () => {
  const dir = makePassingProject();
  writeText(resolve(dir, PATHS.plan), `\uFEFF${JSON.stringify({ topic: 'bom', queries: [{ q: 'a query' }] })}`);
  writeText(resolve(dir, PATHS.kit), `\uFEFF${JSON.stringify({ architecture: { codePaths: ['engine'] } })}`);
  const corpus = readCorpus(dir);
  assert.deepEqual(corpus.problems.filter((p) => /unparsed/.test(p.kind)), []);
  assert.equal(corpus.plan?.topic, 'bom');
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

test('stripReviewNotes removes the note and nothing else', () => {
  assert.equal(stripReviewNotes('E-01 [single-witness: see E-02]').includes('E-02'), false);
  assert.equal(citedIds(stripReviewNotes('E-01 [single-witness: see E-02]')).join(), 'E-01');
  assert.equal(citedIds(stripReviewNotes('E-01 and E-02')).join(), 'E-01,E-02');
  assert.equal(stripReviewNotes('a [markdown](http://x) link'), 'a [markdown](http://x) link');
});

// Found 2026-09-28 (checking an outside break-test, F-07): a large file in research/raw/
// crashed every corpus reader with a raw "RangeError: Set maximum size exceeded" from the
// similarity sketch after a minute (100 MB), or was skipped in silence because it could not
// be read as a string at all (600 MB) - and the gate passed. A capture over the limit is now
// named, blocking, and never read.
test('a capture over the size limit is named and blocks, without being read', () => {
  const root = makePassingProject();
  const big = resolve(root, `${PATHS.raw}/huge.md`);
  fs.writeFileSync(big, Buffer.alloc(11 * 1024 * 1024, 'a'));
  const started = Date.now();
  const corpus = readCorpus(root);
  assert.ok(Date.now() - started < 5000, 'the oversized capture was read');
  const problem = corpus.problems.find((p) => p.kind === 'capture-too-large');
  assert.ok(problem, `no capture-too-large problem: ${JSON.stringify(corpus.problems)}`);
  assert.equal(problem.file, `${PATHS.raw}/huge.md`);
  assert.equal(corpus.captures.entries.some((e) => e.file.endsWith('huge.md')), false);
  const verdict = runPreflight(root);
  assert.ok(verdict.findings.some((f) => f.severity === 'fail' && f.rule === 'capture-too-large'), 'the gate did not block on it');
});

// Found 2026-09-28 while verifying the capture-unreadable case as uid nobody: a capture the
// ledger names but that cannot be read (permissions; here a directory in its place, which
// fails the same way for root) crashed preflight with a raw stack trace in verifyLedger.
test('a ledger-named capture that cannot be read is a named failure, not a crash', () => {
  const root = makePassingProject();
  const capture = fs.readdirSync(resolve(root, PATHS.raw)).find((n) => n.endsWith('.md'));
  const abs = resolve(root, `${PATHS.raw}/${capture}`);
  fs.rmSync(abs);
  fs.mkdirSync(abs);
  let verdict;
  assert.doesNotThrow(() => { verdict = runPreflight(root); }, 'preflight crashed on an unreadable capture');
  assert.equal(verdict.pass, false);
  assert.ok(verdict.findings.some((f) => f.severity === 'fail' && /could not be read/.test(f.detail ?? '')),
    `no finding names the unreadable capture:\n${verdict.findings.filter((f) => f.severity === 'fail').map((f) => `${f.rule}: ${f.detail}`).join('\n')}`);
});

// Found 2026-09-28 (Arena break test 12). A file with NO END - a fifo, a socket, a
// character device such as dev/zero - is refused by name instead of being opened.
//
// Before this, `readFileSync` was called on whatever sat at the path the ledger names.
// On a fifo that blocks in `open()` until another process writes to the other end, so
// every entrypoint that verifies a corpus - handoff, preflight, audit, doctor, brief and
// the commit gate - HUNG, printing nothing at all; the git commit it gates hung with it.
// With the ledger symlinked to dev/zero the same call allocated until libstdc++ killed
// the process with `std::bad_alloc` / SIGABRT, which is a crash disguised as a verdict.
//
// A fifo can only be made on POSIX, so where it cannot the test falls back to a
// directory: also not a regular file, so it exercises the same guard. It does NOT skip -
// a test that returns early on a missing prerequisite is a green that asserted nothing.
test('a capture that is not a regular file is refused by name, and is never opened', () => {
  const root = makePassingProject();
  const capture = fs.readdirSync(resolve(root, PATHS.raw)).find((n) => n.endsWith('.md'));
  const abs = resolve(root, `${PATHS.raw}/${capture}`);
  fs.rmSync(abs);
  const fifo = process.platform !== 'win32'
    && spawnSync('mkfifo', [abs], { windowsHide: true }).status === 0;
  if (!fifo) fs.mkdirSync(abs);

  // Watchdog-guarded by the harness: with the guard gone this call blocks until the
  // watchdog fires, which is a FAIL named for this test rather than a silent hang.
  const verdict = runPreflight(root);
  assert.equal(verdict.pass, false);
  assert.ok(verdict.findings.some((f) => f.severity === 'fail' && f.rule === 'raw-unreadable'
    && /could not be read/.test(f.detail ?? '')),
  `no finding names the capture that has no end (${fifo ? 'fifo' : 'directory'}):\n${verdict.findings.filter((f) => f.severity === 'fail').map((f) => `${f.rule}: ${f.detail}`).join('\n')}`);
});

// The same guard, at the two functions every other read in the kit goes through. A
// directory is the cross-platform case: it is not a regular file, so it is refused
// WITHOUT being opened - which is the whole point, because the open is what blocked.
test('readText and sha256File refuse what is not a regular file, without opening it', () => {
  const root = makePassingProject();
  const dir = resolve(root, 'research/raw/a-directory');
  fs.mkdirSync(dir);
  assert.equal(isRegularFile(dir), false, 'a directory is not a regular file');
  assert.equal(isRegularFile(resolve(root, 'research/raw/') + 'no-such-file'), false);
  assert.equal(readText(dir, 'FALLBACK'), 'FALLBACK', 'readText opened a directory');
  assert.equal(sha256File(dir), null, 'sha256File opened a directory');

  const capture = fs.readdirSync(resolve(root, PATHS.raw)).find((n) => n.endsWith('.md'));
  const abs = resolve(root, `${PATHS.raw}/${capture}`);
  assert.equal(isRegularFile(abs), true, 'a capture is a regular file');
  assert.equal(typeof readText(abs), 'string', 'readText must still read a real capture');
  assert.match(sha256File(abs) ?? '', /^[0-9a-f]{64}$/, 'sha256File must still hash a real capture');

  // A symlink to a regular file is still a regular file: following links is deliberate,
  // so refusing them here would be a behaviour change for every caller that resolves one.
  const link = resolve(root, 'research/raw/linked.md');
  requireSymlink(abs, link, 'a symlink to a regular file');
  assert.equal(isRegularFile(link), true, 'a symlink to a regular file is a regular file');
  assert.equal(readText(link), readText(abs));
});

// Found 2026-09-28 (checking an outside break-test, F-08): JSON.parse keeps the LAST of two
// equal keys, so `{"topic":"a", ..., "topic":"b"}` in plan.json - a merge, a paste - lost the
// first value in silence. A duplicate key in plan.json or kit.json now blocks, naming the key.
test('a duplicate key in plan.json or kit.json is named and blocks', () => {
  for (const [file, kind] of [[PATHS.plan, 'plan-unparsed'], [PATHS.kit, 'kit-unparsed']]) {
    const root = makePassingProject();
    const abs = resolve(root, file);
    const text = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8').trim() : '{}';
    fs.writeFileSync(abs, text.replace(/^\{/, '{"topic": "the first one", ').replace(/\}$/, ', "topic": "the second one"}'));
    const problem = readCorpus(root).problems.find((p) => p.kind === kind);
    assert.ok(problem, `${file}: no ${kind} problem for a duplicate key`);
    assert.match(problem.detail, /duplicate.*"topic"/, `${file}: ${problem.detail}`);
    assert.equal(runPreflight(root).pass, false, `${file}: the gate passed with a duplicate key`);
  }
});
