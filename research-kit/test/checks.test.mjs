// Each rule, run on its own against a corpus fixture. A rule that can only be tested by
// building a whole project and fishing one finding out of an array is a rule nobody
// tests (ADR-0004).

import path from 'node:path';
import { test, describe, assert, makePassingProject, corrupt, fs } from './harness.mjs';
import { PATHS, resolve, writeText, readText } from '../lib/core.mjs';
import { KIT_ROOT } from '../lib/scaffold.mjs';
import { writeRaw } from '../lib/collect.mjs';
import { readCorpus } from '../lib/corpus.mjs';
import { CHECKS, CHECK_NAMES, runCheck, runChecks, supersededRows } from '../lib/checks.mjs';
import { verifyLedger, rebuildLedger } from '../lib/provenance.mjs';
import { UNIVERSAL_DIMENSIONS, coverageOfUniversals } from '../lib/dimensions.mjs';

describe('checks');

function snapshot(dir) {
  const corpus = readCorpus(dir);
  corpus.chain = verifyLedger(dir, { corpus });
  return corpus;
}

const failures = (findings) => findings.filter((f) => f.severity === 'fail');

test('the registry holds thirteen checks in a pinned order', () => {
  assert.equal(CHECKS.length, 13);
  assert.deepEqual(CHECK_NAMES, [
    'discovery-contract', 'citations', 'provenance', 'transport-provenance',
    'gate-integrity', 'unknown-closure', 'subtopic-coverage', 'capture-completeness',
    'evidence-supersession', 'collection-attempts', 'hygiene', 'corpus-shape',
    'corroboration',
  ]);
});

test('an unknown check name is an error naming the known checks, never a silent pass', () => {
  assert.throws(() => runCheck('no-such-check', snapshot(makePassingProject())), /Known checks/);
  assert.throws(() => runChecks(snapshot(makePassingProject()), { only: ['nope'] }), /Known checks/);
});

test('every check passes on a corpus that deserves it', () => {
  const corpus = snapshot(makePassingProject());
  for (const name of CHECK_NAMES) {
    const findings = runCheck(name, corpus, { localHooksPath: null });
    assert.equal(failures(findings).length, 0, `${name}: ${findings.map((f) => f.detail).join('; ')}`);
  }
});

test('discovery-contract: a status that is not CLOSED or KNOWN-UNKNOWN fails', () => {
  const dir = makePassingProject();
  corrupt(dir, PATHS.discovery, (text) => text.replace('CLOSED', 'in progress'));
  const findings = runCheck('discovery-contract', snapshot(dir));
  assert.ok(failures(findings).some((f) => f.rule === 'status'));
});

test('discovery-contract: an empty build intent fails', () => {
  const dir = makePassingProject();
  corrupt(dir, PATHS.discovery, (text) => text.replace(/## Build intent[\s\S]*?## Unknowns/, '## Build intent\n\n## Unknowns'));
  assert.ok(failures(runCheck('discovery-contract', snapshot(dir))).some((f) => f.rule === 'build-intent'));
});

test('citations: a row whose capture is not on disk fails', () => {
  const dir = makePassingProject();
  const capture = readCorpus(dir).captures.entries[0];
  fs.rmSync(resolve(dir, capture.file));
  assert.ok(failures(runCheck('citations', snapshot(dir))).some((f) => f.rule === 'raw-missing'));
});

test('unknown-closure: a CLOSED unknown citing nothing fails', () => {
  const dir = makePassingProject();
  corrupt(dir, PATHS.discovery, (text) => text.replace(/E-01:[^|]*/, 'it is obviously true '));
  assert.ok(failures(runCheck('unknown-closure', snapshot(dir))).some((f) => f.rule === 'no-evidence'));
});

test('unknown-closure: a citation that names no row fails', () => {
  const dir = makePassingProject();
  corrupt(dir, PATHS.discovery, (text) => text.replace('E-01', 'E-99'));
  assert.ok(failures(runCheck('unknown-closure', snapshot(dir))).some((f) => f.rule === 'dangling-citation'));
});

test('unknown-closure: stale evidence warns against the operator\'s maxAgeDays', () => {
  const dir = makePassingProject(undefined, { date: '2020-01-01' });
  const findings = runCheck('unknown-closure', snapshot(dir), { maxAgeDays: 180 });
  assert.ok(findings.some((f) => f.rule === 'stale-evidence'));
});

test('unknown-closure: a KNOWN-UNKNOWN with no verification step fails', () => {
  const dir = makePassingProject();
  corrupt(dir, PATHS.discovery, (text) => text.replace(/\| CLOSED \|[^|]*\|/, '| KNOWN-UNKNOWN |  |'));
  assert.ok(failures(runCheck('unknown-closure', snapshot(dir))).some((f) => f.rule === 'verification-step'));
});

test('subtopic-coverage: a GAP row fails by name', () => {
  const dir = makePassingProject();
  corrupt(dir, PATHS.map, (text) => text.replace('| D-1 | Access model | Decides the collection design | COVERED | U-1 |', '| D-1 | Access model | Decides the collection design | GAP |  |'));
  const findings = failures(runCheck('subtopic-coverage', snapshot(dir)));
  assert.ok(findings.some((f) => f.rule === 'gap' && f.detail.includes('D-1')));
});

test('subtopic-coverage: a reasonless DISMISSED is a silent gap wearing a label', () => {
  const dir = makePassingProject();
  corrupt(dir, PATHS.map, (text) => text.replace('| DISMISSED | public docs, personal research, no redistribution |', '| DISMISSED |  |'));
  assert.ok(failures(runCheck('subtopic-coverage', snapshot(dir))).some((f) => f.rule === 'dismissed-without-reason'));
});

test('subtopic-coverage: a COVERED row citing an unknown that does not exist fails', () => {
  const dir = makePassingProject();
  corrupt(dir, PATHS.map, (text) => text.replace('| COVERED | U-1 |', '| COVERED | U-42 |'));
  assert.ok(failures(runCheck('subtopic-coverage', snapshot(dir))).some((f) => f.rule === 'covered-by-unknown-that-does-not-exist'));
});

test('subtopic-coverage: omitting a universal dimension fails; dismissing it does not', () => {
  const dir = makePassingProject();
  corrupt(dir, PATHS.map, (text) => text.split('\n').filter((line) => !line.startsWith('| D-4 ')).join('\n'));
  const findings = failures(runCheck('subtopic-coverage', snapshot(dir)));
  assert.ok(findings.some((f) => f.rule === 'dimension-omitted' && f.detail.includes('ToS')));
});

test('subtopic-coverage: a contract with no map warns "no coverage claim" and does not fail', () => {
  const dir = makePassingProject();
  fs.rmSync(resolve(dir, PATHS.map));
  const findings = runCheck('subtopic-coverage', snapshot(dir));
  assert.equal(failures(findings).length, 0);
  assert.ok(findings.some((f) => f.rule === 'no-coverage-claim'));
});

test('coverageOfUniversals matches on id or on the dimension\'s own words', () => {
  const { missing } = coverageOfUniversals([{ id: 'D-1', text: 'anything' }, { id: 'X-9', text: 'Terms of service and licensing' }]);
  assert.equal(missing.length, UNIVERSAL_DIMENSIONS.length - 2);
});

test('transport-provenance: a non-Firecrawl transport is named, per row', () => {
  const dir = makePassingProject();
  rebuildLedger(dir, () => ({ transport: 'agent page fetch' }), { note: 'restate the transport' });
  const findings = runCheck('transport-provenance', snapshot(dir));
  assert.ok(findings.some((f) => f.rule === 'transport-not-metered' && f.transport === 'agent page fetch'));
});

test('capture-completeness: a CLOSED unknown resting only on partial captures is flagged', () => {
  const dir = makePassingProject();
  const capture = readCorpus(dir).captures.entries[0];
  corrupt(dir, capture.file, (text) => text.replace('completeness: full', 'completeness: partial\nomitted: chunk 0 of 3'));
  const findings = runCheck('capture-completeness', snapshot(dir));
  assert.ok(findings.some((f) => f.rule === 'partial-only'));
});

test('capture-completeness: partial without a reason is flagged too', () => {
  const dir = makePassingProject();
  const capture = readCorpus(dir).captures.entries[0];
  corrupt(dir, capture.file, (text) => text.replace('completeness: full', 'completeness: partial'));
  assert.ok(runCheck('capture-completeness', snapshot(dir)).some((f) => f.rule === 'partial-unnamed'));
});

test('capture-completeness: a page that SAYS it failed to render is flagged, though it arrived whole', () => {
  // The gap `completeness` cannot see. It grades the TRANSPORT - how much of the response
  // arrived - and a page whose body is built by script arrives complete and empty. Found
  // when a GitHub Discussion graded `full` while carrying page furniture and no discussion.
  const dir = makePassingProject();
  const capture = readCorpus(dir).captures.entries[0];
  corrupt(dir, capture.file, (text) => `${text}\n\nThere was an error while loading. Please reload this page.\n`);

  const findings = runCheck('capture-completeness', snapshot(dir));
  const hit = findings.find((f) => f.rule === 'partial-render');
  assert.ok(hit, 'a page reporting its own load failure must be reported');
  assert.equal(hit.severity, 'warn', 'three of four real matches were usable captures, so this cannot block');
  assert.match(hit.detail, /Confirm the text cited from it is present/);

  // The grade is untouched: the bytes really did all arrive. Saying otherwise would make
  // `completeness` lie about the transport in order to describe the content.
  assert.equal(readCorpus(dir).captures.entries[0].completeness, 'full');
});

test('capture-completeness: an ordinary capture is not accused of failing to render', () => {
  // The false-positive guard. This rule matches sentences a page PRINTS, so a corpus of
  // normal pages must stay silent - otherwise the warning becomes noise and gets ignored,
  // which is worse than not having it.
  const findings = runCheck('capture-completeness', snapshot(makePassingProject()));
  assert.ok(!findings.some((f) => f.rule === 'partial-render'));
});

test('hygiene: a capture nobody cites is a warning, never a failure', () => {
  const dir = makePassingProject();
  writeText(resolve(dir, `${PATHS.raw}/2026-01-01-orphan-example-00000000.md`), '---\nurl: https://example.invalid/orphan\nretrieved: 2026-01-01\n---\n\nbody\n');
  const findings = runCheck('hygiene', snapshot(dir));
  assert.equal(failures(findings).length, 0);
  assert.ok(findings.some((f) => f.rule === 'uncited-capture'));
});

test('corpus-shape: a row whose arity does not match its header is reported, not absorbed', () => {
  const dir = makePassingProject();
  corrupt(dir, PATHS.evidence, (text) => `${text}| E-02 | 2026-01-01 |\n`);
  const corpus = snapshot(dir);
  assert.ok(corpus.problems.some((p) => p.kind === 'table-arity'));
  assert.ok(runCheck('corpus-shape', corpus).some((f) => f.rule === 'table-arity'));
});

test('order is part of the interface: findings arrive in registry order', () => {
  const dir = makePassingProject();
  corrupt(dir, PATHS.discovery, (text) => text.replace('CLOSED', 'OPEN'));
  const names = runChecks(snapshot(dir)).map((f) => f.check);
  const seen = [...new Set(names)];
  const expected = CHECK_NAMES.filter((name) => seen.includes(name));
  assert.deepEqual(seen, expected);
});

// ---------------------------------------------------------------- supersession-aware checks
//
// ADR-0026 requires a re-collection to add a row and leave the old one standing. Two
// checks predated that ADR and warned about the very state it requires. Nobody noticed
// for four days, because nobody had performed a refresh - the first real one, on
// 2026-09-20, produced twelve warnings where the corpus had just been cleaned to nine.

/**
 * Take the passing fixture and REFRESH its one page: a second capture of the same URL,
 * collected later, with the unknown moved onto it. This is exactly the shape ADR-0026
 * prescribes, built through the real files so the real parser sees it.
 */
function withRefresh(dir, { transportOfOld = 'agent page fetch (no Firecrawl egress)', citeOld = false } = {}) {
  // The existing capture is DISCOVERED, not named.
  //
  // These two lines were literals - `2026-09-20-limits-example-a4e22bcd.md` and a
  // `2026-09-21-...` successor - and `makePassingProject` names its capture with
  // `today()`. So the fixture agreed with the test on exactly one calendar day. On
  // 2026-09-21 the copy failed with ENOENT and four tests went red, having passed all
  // through the day before.
  //
  // A test that only works on the date it was written is a test with an expiry nobody
  // wrote down. The refreshed name is derived from the real one so the pair cannot
  // disagree again, whatever the clock says.
  const rawDir = resolve(dir, PATHS.raw);
  const existing = fs.readdirSync(rawDir).filter((name) => name.endsWith('.md'));
  if (existing.length !== 1) {
    throw new Error(`withRefresh expects the fixture's single capture, found ${existing.length}: ${existing.join(', ')}`);
  }
  const oldRaw = `${PATHS.raw}/${existing[0]}`;

  // The refresh is a LATER day, derived from the capture's own date rather than written
  // down. `duplicate-url` exists to catch two rows for one URL on the SAME day, so a
  // refresh dated today - which is what the fixture produces - is correctly a duplicate.
  const oldDate = existing[0].slice(0, 10);
  const newDate = new Date(`${oldDate}T00:00:00Z`);
  newDate.setUTCDate(newDate.getUTCDate() + 1);
  const nextDay = newDate.toISOString().slice(0, 10);
  const newRaw = `${PATHS.raw}/${nextDay}-limits-example-refreshed.md`;
  const url = 'https://example.invalid/docs/limits';

  // The fresher capture, and a ledger entry for it.
  fs.copyFileSync(resolve(dir, oldRaw), resolve(dir, newRaw));
  const ledger = readText(resolve(dir, PATHS.ledger), '').trim().split('\n');
  const first = JSON.parse(ledger[0]);
  ledger[0] = JSON.stringify({ ...first, transport: transportOfOld });
  ledger.push(JSON.stringify({
    ...first, seq: 2, at: `${nextDay}T00:00:00.000Z`, raw: newRaw, transport: 'firecrawl-cli', prev: first.entrySha256,
  }));
  writeText(resolve(dir, PATHS.ledger), `${ledger.join('\n')}\n`);

  // The fresher row.
  const evidence = readText(resolve(dir, PATHS.evidence), '');
  writeText(resolve(dir, PATHS.evidence),
    `${evidence.trimEnd()}\n| E-02 | ${nextDay} | P | ${url} | A re-read of the same page. | ${newRaw} |\n`);

  // The unknown moves to it, unless a test wants the stale citation left in place.
  if (!citeOld) {
    writeText(resolve(dir, PATHS.discovery),
      readText(resolve(dir, PATHS.discovery), '').split('| CLOSED | E-01').join('| CLOSED | E-02'));
  }
  return dir;
}

test('a refresh does not trip duplicate-url - two rows for one URL is the DESIGN', () => {
  const corpus = snapshot(withRefresh(makePassingProject()));
  const dupes = runCheck('hygiene', corpus).filter((f) => f.rule === 'duplicate-url');
  assert.deepEqual(dupes.map((f) => f.detail), [], 'a refresh was reported as a hygiene problem');
});

test('two rows for one URL fetched the SAME DAY is still a duplicate', () => {
  // The real thing the check was written for; it has to survive the fix above.
  const dir = makePassingProject();
  // Same-day means the FIXTURE's day, read from the capture it wrote - not a literal.
  // This line carried `2026-09-20` twice and so agreed with the fixture on exactly one
  // calendar day, which is the defect the helper above was just fixed for.
  const existing = fs.readdirSync(resolve(dir, PATHS.raw)).find((name) => name.endsWith('.md'));
  const sameDay = existing.slice(0, 10);
  const evidence = readText(resolve(dir, PATHS.evidence), '');
  writeText(resolve(dir, PATHS.evidence),
    `${evidence.trimEnd()}\n| E-02 | ${sameDay} | P | https://example.invalid/docs/limits | Same day, second row. | ${PATHS.raw}/${existing} |\n`);

  const dupes = runCheck('hygiene', snapshot(dir)).filter((f) => f.rule === 'duplicate-url');
  assert.equal(dupes.length, 1, 'a same-day duplicate stopped being reported');
  assert.match(dupes[0].detail, /same day/);
});

test('transport-provenance goes quiet about a superseded row nothing relies on', () => {
  // Six such warnings stood in this project's own corpus after its refresh. Reporting
  // the provenance of a capture no claim rests on buries the rows that carry one.
  const corpus = snapshot(withRefresh(makePassingProject()));
  const warned = runCheck('transport-provenance', corpus).filter((f) => f.severity === 'warn');
  assert.deepEqual(warned.map((f) => f.detail), [],
    'a released historical row was still reported');
});

test('transport-provenance still speaks up when the superseded row IS still cited', () => {
  // The safety property. Going quiet must depend on nothing relying on the row - not on
  // the row merely being old. A claim resting on an unmetered capture is still that.
  const corpus = snapshot(withRefresh(makePassingProject(), { citeOld: true }));
  const warned = runCheck('transport-provenance', corpus).filter((f) => f.severity === 'warn');
  assert.equal(warned.length, 1, 'a cited unmetered capture stopped being reported');
  assert.match(warned[0].detail, /E-01/);
});

test('supersededRows maps each replaced row to the row that replaced it', () => {
  const map = supersededRows(snapshot(withRefresh(makePassingProject())));
  assert.equal(map.get('E-01').id, 'E-02');
  assert.equal(map.has('E-02'), false, 'the newest row was marked superseded');
});

test('an unrefreshed corpus has nothing superseded, and no check changes behaviour', () => {
  const corpus = snapshot(makePassingProject());
  assert.equal(supersededRows(corpus).size, 0);
  for (const name of CHECK_NAMES) {
    assert.equal(failures(runCheck(name, corpus, { localHooksPath: null })).length, 0, name);
  }
});

// ---------------------------------------------------------------- corroboration

/** Rewrite the fixture's evidence table and the unknown that cites it. */
function withEvidence(dir, rows, cites) {
  const header = readText(resolve(dir, PATHS.evidence)).split('\n').slice(0, 4).join('\n');
  writeText(resolve(dir, PATHS.evidence), `${header}
| ID | Retrieved | Type | URL | Finding | Raw |
|---|---|---|---|---|---|
${rows.join('\n')}
`);
  corrupt(dir, PATHS.discovery, (text) => text.replace(/\| CLOSED \|[^|]*\|/, `| CLOSED | ${cites} |`));
  return dir;
}

test('corroboration: one row is reported, because one reading proves one reading', () => {
  // The hole this check was added for. Before it, a corpus in which every unknown rested
  // on a single page passed preflight AND --strict with nothing to say - and from inside
  // such a corpus a single correct source and a single lucky one are the same thing.
  const findings = runCheck('corroboration', snapshot(makePassingProject()));
  assert.equal(findings.length, 1);
  assert.equal(findings[0].severity, 'warn');
  assert.equal(findings[0].rule, 'single-source');
  assert.match(findings[0].detail, /rests on E-01 alone/);
});

test('corroboration: two rows from ONE host is a second reading, not a second witness', () => {
  // The distinction that matters and that the count alone cannot make. Two pages from one
  // vendor catch a misreading; they cannot catch the vendor being wrong about itself.
  const dir = withEvidence(makePassingProject(), [
    '| E-01 | 2026-09-14 | P | https://example.invalid/docs/limits | ten a minute | research/raw/x.md |',
    '| E-02 | 2026-09-14 | P | https://example.invalid/docs/pricing | ten a minute | research/raw/x.md |',
  ], 'E-01 and E-02 agree');
  const findings = runCheck('corroboration', snapshot(dir));
  assert.equal(findings[0].rule, 'one-voice');
  assert.equal(findings[0].severity, 'warn');
  assert.match(findings[0].detail, /all are example\.invalid/);
});

test('corroboration: two hosts is independent support, and passes', () => {
  const dir = withEvidence(makePassingProject(), [
    '| E-01 | 2026-09-14 | P | https://example.invalid/docs/limits | ten a minute | research/raw/x.md |',
    '| E-02 | 2026-09-14 | P | https://other.invalid/reference | ten a minute | research/raw/x.md |',
  ], 'E-01 and E-02 agree');
  const findings = runCheck('corroboration', snapshot(dir));
  assert.equal(findings[0].severity, 'pass');
  assert.equal(findings[0].rule, 'independent');
  // Both rows name a raw file the fixture does not have, so neither has a sketch. An
  // unjudgeable pair must stay two documents: "I cannot fingerprint these" is not
  // "these are the same page", and the wrong choice here would invent a mirror.
  assert.match(findings[0].detail, /2 distinct documents across 2 hosts/);
});

// The mirror regression. `lira.epac.to` republishes Node's single-executable
// documentation six major versions behind `nodejs.org`, and the host heuristic graded
// that pair `independent` - its BEST grade - for one witness plus a staleness the
// freshness check cannot see, because freshness grades when a page was FETCHED.
//
// These use the real two captures rather than synthetic near-duplicates: the whole
// question is whether the threshold survives contact with a genuinely stale mirror,
// which two copies of lorem ipsum would not test.

const seaRawDir = path.join(KIT_ROOT, '..', 'docs', 'decisions', '2026-09-21-sea-assets', 'research', 'raw');

function realCapture(needle) {
  const name = fs.readdirSync(seaRawDir).find((f) => f.includes(needle) && f.endsWith('.md'));
  assert.ok(name, `no capture matching ${needle}`);
  const text = fs.readFileSync(path.join(seaRawDir, name), 'utf8');
  return text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
}

/** Put real page bodies into the fixture under chosen URLs, and cite them all. */
function withRealPages(pages) {
  const dir = makePassingProject();
  const rows = [];
  pages.forEach((page, i) => {
    const entry = writeRaw(dir, {
      url: page.url,
      title: `page ${i + 1}`,
      markdown: page.markdown,
      cmd: `firecrawl scrape ${page.url}`,
      statusCode: 200,
      transport: 'firecrawl-cli',
      completeness: 'full',
    }, { date: '2026-09-21' });
    rows.push(`| E-0${i + 1} | 2026-09-21 | P | ${page.url} | finding ${i + 1} | ${entry.file} |`);
  });
  return withEvidence(dir, rows, pages.map((_, i) => `E-0${i + 1}`).join(' and '));
}

test('corroboration: a row named twice in the prose is one source, not a mirror of itself', () => {
  // Found by running the document grouping over a real corpus. `citedIds` returns every
  // E-## mention in the Evidence cell, so prose that names E-01 twice yielded the SAME row
  // twice; grouping then folded the duplicate and reported a "republished copy" about a row
  // that was only ever mentioned twice. Host-counting hid it - duplicates inflated the row
  // count but collapsed in the host Set, so the old finding was right by accident.
  const dir = withEvidence(makePassingProject(), [
    '| E-01 | 2026-09-14 | P | https://example.invalid/docs/limits | ten a minute | research/raw/x.md |',
  ], 'E-01 says ten a minute, and E-01 also gives the credit total');

  const findings = runCheck('corroboration', snapshot(dir));
  assert.equal(findings[0].rule, 'single-source', 'one row mentioned twice is still one row');
  assert.match(findings[0].detail, /rests on E-01 alone/);
  assert.doesNotMatch(findings[0].detail, /republished/);
});

test('corroboration: a stale mirror on a second host is one document, not two witnesses', () => {
  const dir = withRealPages([
    { url: 'https://nodejs.org/api/single-executable-applications.html', markdown: realCapture('-nodejs-') },
    { url: 'https://lira.epac.to/DOCS/nodejs/api/single-executable-applications.html', markdown: realCapture('epac') },
  ]);
  const findings = runCheck('corroboration', snapshot(dir));

  // The precondition that made the old behaviour wrong: these ARE two different hosts,
  // so host-counting alone had every reason to call this independent. It still must not.
  assert.equal(findings[0].rule, 'mirror');
  assert.equal(findings[0].severity, 'warn');
  assert.match(findings[0].detail, /across 2 hosts but they are the same document/);
});

test('corroboration: a mirror does not outrank two genuinely different pages', () => {
  // The inversion stated as an ordering. A mirror must never grade better than the
  // honest `one-voice` that two real pages from one vendor earn.
  const mirrored = runCheck('corroboration', snapshot(withRealPages([
    { url: 'https://nodejs.org/api/single-executable-applications.html', markdown: realCapture('-nodejs-') },
    { url: 'https://lira.epac.to/DOCS/nodejs/api/single-executable-applications.html', markdown: realCapture('epac') },
  ])))[0];
  assert.notEqual(mirrored.severity, 'pass', 'a mirror must not pass while one-voice warns');
});

test('corroboration: a third, genuinely different page rescues a mirrored pair', () => {
  const dir = withRealPages([
    { url: 'https://nodejs.org/api/single-executable-applications.html', markdown: realCapture('-nodejs-') },
    { url: 'https://lira.epac.to/DOCS/nodejs/api/single-executable-applications.html', markdown: realCapture('epac') },
    { url: 'https://github.com/nodejs/single-executable/discussions/17', markdown: realCapture('bundling') },
  ]);
  const findings = runCheck('corroboration', snapshot(dir));
  assert.equal(findings[0].severity, 'pass');
  assert.equal(findings[0].rule, 'independent');
  // Two documents, not three rows - and the count of folded copies is stated rather
  // than silently absorbed, so a reader can see why three rows bought two witnesses.
  assert.match(findings[0].detail, /2 distinct documents across 2 hosts/);
  assert.match(findings[0].detail, /1 of 3 rows are republished copies/);
});

test('corroboration: a KNOWN-UNKNOWN is not asked for sources it was never going to have', () => {
  const dir = makePassingProject();
  corrupt(dir, PATHS.discovery, (text) => text.replace('| CLOSED |', '| KNOWN-UNKNOWN |'));
  const findings = runCheck('corroboration', snapshot(dir));
  assert.equal(findings.length, 1);
  assert.equal(findings[0].severity, 'pass');
  assert.match(findings[0].detail, /no closed unknown to weigh/);
});

test('corroboration: it never fails on its own, whatever it finds', () => {
  // Deliberately incapable of blocking a build by itself. Single-sourcing is often the
  // right answer - a vendor's own reference is the authority on that vendor - so this
  // check reports the SHAPE of the support and leaves the judgement to a reviewer, or to
  // an operator who has chosen `evidencePolicy=strict`.
  for (const dir of [makePassingProject(), withEvidence(makePassingProject(), [
    '| E-01 | 2026-09-14 | P | https://example.invalid/a | x | research/raw/x.md |',
    '| E-02 | 2026-09-14 | P | https://example.invalid/b | x | research/raw/x.md |',
  ], 'E-01 and E-02')]) {
    for (const f of runCheck('corroboration', snapshot(dir))) {
      assert.notEqual(f.severity, 'fail', 'corroboration must never fail a corpus on its own');
    }
  }
});

// ---------------------------------------------------------------- accepted judgements

test('corroboration: a reasoned single-witness note is accepted, and shows its reason', () => {
  // The mechanism `corroboration` was missing. It reports the shape of support and leaves
  // the judgement to a reviewer (ADR-0036) - and gave the reviewer nowhere to put it, so a
  // claim correctly left single-sourced looked like one nobody checked, forever, and
  // `strict` was unsatisfiable by any corpus containing an honest one.
  const dir = withEvidence(makePassingProject(), [
    '| E-01 | 2026-09-14 | P | https://example.invalid/docs/limits | ten a minute | research/raw/x.md |',
  ], 'E-01 [single-witness: the vendor stating its own tier limits, and no second party can testify to what it includes]');

  const findings = runCheck('corroboration', snapshot(dir));
  assert.equal(findings[0].severity, 'pass');
  assert.equal(findings[0].rule, 'single-witness');
  assert.match(findings[0].detail, /accepted on the record: the vendor stating its own tier/);
});

test('corroboration: a note without a real reason is NOT a mute button', () => {
  // Otherwise the weakest possible acknowledgement and no acknowledgement at all would be
  // indistinguishable, and the mechanism would be a way to turn the check off quietly.
  for (const note of ['[single-witness: n/a]', '[single-witness:]', '[single-witness: vendor]']) {
    const dir = withEvidence(makePassingProject(), [
      '| E-01 | 2026-09-14 | P | https://example.invalid/docs/limits | ten a minute | research/raw/x.md |',
    ], `E-01 ${note}`);
    const findings = runCheck('corroboration', snapshot(dir));
    assert.equal(findings[0].severity, 'warn', `${note} must not pass`);
    assert.equal(findings[0].rule, 'single-witness-unreasoned');
  }
});

test('corroboration: a note left on an unknown that HAS been corroborated is reported', () => {
  // The annotation must not rot. Once a second document arrives, a note claiming none can
  // exist is a false statement sitting in the contract, and this is the only moment
  // anything can notice.
  const dir = withEvidence(makePassingProject(), [
    '| E-01 | 2026-09-14 | P | https://example.invalid/a | x | research/raw/x.md |',
    '| E-02 | 2026-09-14 | P | https://other.invalid/b | x | research/raw/y.md |',
  ], 'E-01 and E-02 [single-witness: this reason is long enough to clear the floor but is now false]');

  const findings = runCheck('corroboration', snapshot(dir));
  assert.equal(findings[0].severity, 'warn');
  assert.equal(findings[0].rule, 'single-witness-stale');
  assert.match(findings[0].detail, /remove the note or the claim is false/);
});

test('capture-completeness: a recorded render review closes partial-render', () => {
  const dir = makePassingProject();
  const capture = readCorpus(dir).captures.entries[0];
  corrupt(dir, capture.file, (text) => `${text}\n\nThere was an error while loading. Please reload this page.\n`);
  corrupt(dir, PATHS.evidence, (text) => text.replace(
    'The free plan allows 10 requests per minute and includes 1,000 credits.',
    'The free plan allows 10 requests per minute. [render-reviewed: searched the capture and confirmed the quoted rate limit is present; the failed widget is page furniture]',
  ));

  const findings = runCheck('capture-completeness', snapshot(dir));
  const hit = findings.find((f) => f.rule.startsWith('partial-render'));
  assert.equal(hit.rule, 'partial-render-reviewed');
  assert.equal(hit.severity, 'pass');
});

test('capture-completeness: the render review is read from the ROW, never the capture', () => {
  // `verifyLedger` hashes the whole capture file, front-matter included, so annotating a
  // capture would break `body-unmodified`. A capture is evidence and stays byte-immutable;
  // the judgement about it is corpus prose. The first design put it in front-matter and the
  // ledger refused it - this pins the constraint so it cannot be undone by tidying.
  const dir = makePassingProject();
  const capture = readCorpus(dir).captures.entries[0];
  corrupt(dir, capture.file, (text) => text.replace(
    '---\n\n',
    'renderReview: searched the capture and confirmed the quoted rate limit is present\n---\n\n',
  ));
  corrupt(dir, capture.file, (text) => `${text}\n\nThere was an error while loading.\n`);

  const findings = runCheck('capture-completeness', snapshot(dir));
  assert.ok(findings.some((f) => f.rule === 'partial-render'),
    'a note in the capture front-matter must NOT satisfy the review - the ledger hashes it');
});

test('a row named INSIDE a single-witness note is not thereby cited', () => {
  // The footgun this removes. `citedIds` returns every E-## mention in the cell, and the
  // reason a reviewer writes lives in that same cell - so explaining why no second witness
  // exists, by pointing at a row that demonstrates it, turned that row into a citation.
  // The unknown read as corroborated while its own note denied it, and
  // `single-witness-stale` fired on a corpus that was correct. It caught its author three
  // times in two days before the mechanism was changed rather than the prose.
  const dir = withEvidence(makePassingProject(), [
    '| E-01 | 2026-09-14 | P | https://example.invalid/docs/limits | ten a minute | research/raw/x.md |',
    '| E-02 | 2026-09-14 | P | https://other.invalid/blog | a blog agreeing | research/raw/y.md |',
  ], 'E-01 [single-witness: the vendor is the authority on its own limits, and E-02 shows what a third party repeating it is worth]');

  const findings = runCheck('corroboration', snapshot(dir));
  assert.equal(findings[0].severity, 'pass');
  assert.equal(findings[0].rule, 'single-witness',
    'the note mentioned E-02; mentioning is not citing');
  assert.doesNotMatch(findings[0].detail, /stale/);
});

test('a row cited OUTSIDE the note still counts', () => {
  // The other half: stripping must not swallow real citations that happen to sit near one.
  const dir = withEvidence(makePassingProject(), [
    '| E-01 | 2026-09-14 | P | https://example.invalid/a | x | research/raw/x.md |',
    '| E-02 | 2026-09-14 | P | https://other.invalid/b | x | research/raw/y.md |',
  ], 'E-01 and E-02 both say so');

  const findings = runCheck('corroboration', snapshot(dir));
  assert.equal(findings[0].severity, 'pass');
  assert.equal(findings[0].rule, 'independent', 'two genuine citations are still two');
});
