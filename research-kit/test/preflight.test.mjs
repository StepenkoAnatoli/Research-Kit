// The verdict: which findings block, which warn, and whether the answer is PASS.
// Severity policy is the OPERATOR's machine config, not the agent's pick.

import { test, describe, assert, makePassingProject, corrupt, tempDir, fs, path } from './harness.mjs';
import { PATHS, resolve, writeText } from '../lib/core.mjs';
import { runPreflight, verdictContext, readGateState, fixCommand } from '../lib/preflight.mjs';
import { readCorpus } from '../lib/corpus.mjs';
import { CHECK_NAMES } from '../lib/checks.mjs';
import { rebuildLedger } from '../lib/provenance.mjs';

describe('preflight');

function envWith(config) {
  const dir = tempDir('research-kit-policy-');
  const file = path.join(dir, 'research-kit.config.json');
  writeText(file, JSON.stringify(config));
  return { ...process.env, RESEARCH_KIT_CONFIG: file };
}

test('a corpus that deserves it passes, with every check reporting', () => {
  const verdict = runPreflight(makePassingProject());
  assert.equal(verdict.pass, true);
  assert.equal(verdict.counts.fail, 0);
  assert.equal(verdict.counts.pass, CHECK_NAMES.length, 'each check reports once when it has nothing to say');
});

test('the verdict names what blocks, and prints one fix', () => {
  const dir = makePassingProject();
  corrupt(dir, PATHS.discovery, (text) => text.replace('CLOSED', 'OPEN'));
  const verdict = runPreflight(dir);
  assert.equal(verdict.pass, false);
  assert.ok(verdict.failures.length);
  assert.match(fixCommand(), /preflight\.mjs/);
});

test('--strict promotes every warning to a failure', () => {
  const dir = makePassingProject();
  writeText(resolve(dir, `${PATHS.raw}/2026-01-01-orphan-x-00000000.md`), '---\nurl: https://x.invalid/orphan\nretrieved: 2026-01-01\n---\n\nbody\n');

  const relaxed = runPreflight(dir);
  assert.equal(relaxed.pass, true);
  assert.ok(relaxed.counts.warn > 0);

  const strict = runPreflight(dir, { strict: true });
  assert.equal(strict.pass, false);
  assert.ok(strict.failures.every((f) => f.promoted === 'strict' || f.severity === 'fail'));
});

test('evidencePolicy=strict fails transport and completeness findings; pluralist warns', () => {
  const dir = makePassingProject();
  // Re-chain through the sanctioned migration path: editing the JSON by hand would
  // break the entry hash, and then the failure under test would be the wrong one.
  rebuildLedger(dir, () => ({ transport: 'agent page fetch' }), { note: 'restate the transport' });

  const pluralist = runPreflight(dir, { env: envWith({ evidencePolicy: 'pluralist' }) });
  assert.equal(pluralist.pass, true, 'the pluralist operator gets a warning');
  assert.ok(pluralist.warnings.some((f) => f.check === 'transport-provenance'));

  const strict = runPreflight(dir, { env: envWith({ evidencePolicy: 'strict' }) });
  assert.equal(strict.pass, false, 'the strict operator gets a failure');
  assert.ok(strict.failures.some((f) => f.check === 'transport-provenance' && f.promoted === 'evidencePolicy=strict'));
});

test('the policy applies to exactly the two checks it names, not to hygiene', () => {
  const dir = makePassingProject();
  writeText(resolve(dir, `${PATHS.raw}/2026-01-01-orphan-x-00000000.md`), '---\nurl: https://x.invalid/orphan\nretrieved: 2026-01-01\n---\n\nbody\n');
  const strict = runPreflight(dir, { env: envWith({ evidencePolicy: 'strict' }) });
  assert.equal(strict.pass, true, 'an uncited capture is untidy, not unproven');
});

test('--check runs a subset, and an unknown name is an error naming the registry', () => {
  const dir = makePassingProject();
  const one = runPreflight(dir, { only: ['citations'] });
  assert.deepEqual([...new Set(one.findings.map((f) => f.check))], ['citations']);
  assert.throws(() => runPreflight(dir, { only: ['nope'] }), /Known checks/);
});

test('verdictContext reads the corpus, the gate state and the policy TOGETHER', () => {
  const dir = makePassingProject();
  const context = verdictContext(dir);
  assert.equal(context.root, dir);
  assert.ok(context.corpus.chain, 'the chain is verified as part of the context');
  assert.equal(context.gate.gateOff, false);
  assert.equal(context.evidencePolicy, 'pluralist');
});

test("an injected corpus takes its gate state from the SNAPSHOT'S root, never the cwd", () => {
  const dir = makePassingProject();
  writeText(resolve(dir, PATHS.gateOff), 'off\n');
  const corpus = readCorpus(dir);

  const context = verdictContext(dir, { corpus });
  assert.equal(context.gate.gateOff, true);
  assert.equal(context.root, dir);
  assert.notEqual(context.root, process.cwd(), 'the same snapshot cannot yield a different verdict elsewhere');
});

test('readGateState sees GATE_OFF', () => {
  const dir = makePassingProject();
  assert.equal(readGateState(dir).gateOff, false);
  writeText(resolve(dir, PATHS.gateOff), '');
  assert.equal(readGateState(dir).gateOff, true);
});

test('runPreflight accepts a pre-read corpus, so a caller does not pay twice', () => {
  const dir = makePassingProject();
  const corpus = readCorpus(dir);
  const first = runPreflight(dir, { corpus });
  const second = runPreflight(dir, { corpus });
  assert.deepEqual(
    first.findings.map((f) => `${f.check}/${f.rule}/${f.severity}`),
    second.findings.map((f) => `${f.check}/${f.rule}/${f.severity}`),
  );
});

test('the maxAgeDays that judges staleness is the operator\'s, not a constant', () => {
  const dir = makePassingProject(undefined, { date: '2026-01-01' });
  const generous = runPreflight(dir, { env: envWith({ maxAgeDays: 3650 }) });
  assert.equal(generous.warnings.some((f) => f.rule === 'stale-evidence'), false);

  const tight = runPreflight(dir, { env: envWith({ maxAgeDays: 7 }) });
  assert.ok(tight.warnings.some((f) => f.rule === 'stale-evidence'));
});

test('a gated project with no contract fails harder than an ungated one', () => {
  const dir = makePassingProject();
  fs.rmSync(resolve(dir, PATHS.discovery));
  const verdict = runPreflight(dir);
  assert.equal(verdict.pass, false);
  assert.ok(verdict.failures.some((f) => f.rule === 'contract-missing'));
});
