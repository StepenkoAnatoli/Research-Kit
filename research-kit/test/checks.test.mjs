// Each rule, run on its own against a corpus fixture. A rule that can only be tested by
// building a whole project and fishing one finding out of an array is a rule nobody
// tests (ADR-0004).

import { test, describe, assert, makePassingProject, corrupt, fs } from './harness.mjs';
import { PATHS, resolve, writeText, readText } from '../lib/core.mjs';
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

test('the registry holds twelve checks in a pinned order', () => {
  assert.equal(CHECKS.length, 12);
  assert.deepEqual(CHECK_NAMES, [
    'discovery-contract', 'citations', 'provenance', 'transport-provenance',
    'gate-integrity', 'unknown-closure', 'subtopic-coverage', 'capture-completeness',
    'evidence-supersession', 'collection-attempts', 'hygiene', 'corpus-shape',
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
  const oldRaw = 'research/raw/2026-09-20-limits-example-a4e22bcd.md';
  const newRaw = 'research/raw/2026-09-21-limits-example-refreshed.md';
  const url = 'https://example.invalid/docs/limits';

  // The fresher capture, and a ledger entry for it.
  fs.copyFileSync(resolve(dir, oldRaw), resolve(dir, newRaw));
  const ledger = readText(resolve(dir, PATHS.ledger), '').trim().split('\n');
  const first = JSON.parse(ledger[0]);
  ledger[0] = JSON.stringify({ ...first, transport: transportOfOld });
  ledger.push(JSON.stringify({
    ...first, seq: 2, at: '2026-09-21T00:00:00.000Z', raw: newRaw, transport: 'firecrawl-cli', prev: first.entrySha256,
  }));
  writeText(resolve(dir, PATHS.ledger), `${ledger.join('\n')}\n`);

  // The fresher row.
  const evidence = readText(resolve(dir, PATHS.evidence), '');
  writeText(resolve(dir, PATHS.evidence),
    `${evidence.trimEnd()}\n| E-02 | 2026-09-21 | P | ${url} | A re-read of the same page. | ${newRaw} |\n`);

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
  const evidence = readText(resolve(dir, PATHS.evidence), '');
  writeText(resolve(dir, PATHS.evidence),
    `${evidence.trimEnd()}\n| E-02 | 2026-09-20 | P | https://example.invalid/docs/limits | Same day, second row. | research/raw/2026-09-20-limits-example-a4e22bcd.md |\n`);

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
