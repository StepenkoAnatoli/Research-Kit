// Each rule, run on its own against a corpus fixture. A rule that can only be tested by
// building a whole project and fishing one finding out of an array is a rule nobody
// tests (ADR-0004).

import { test, describe, assert, makePassingProject, corrupt, fs } from './harness.mjs';
import { PATHS, resolve, writeText } from '../lib/core.mjs';
import { readCorpus } from '../lib/corpus.mjs';
import { CHECKS, CHECK_NAMES, runCheck, runChecks } from '../lib/checks.mjs';
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
