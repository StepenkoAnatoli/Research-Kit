// The arrival question, and one remedy per cause (ADR-0011, ADR-0020).

import { test, describe, assert, makePassingProject, corrupt, tempDir, fs, path } from './harness.mjs';
import { PATHS, resolve, writeText } from '../lib/core.mjs';
import { verifyHandoff, handoffRemedy, HANDOFF_REMEDY, lineEndingRemedy } from '../lib/handoff.mjs';
import { readCorpus } from '../lib/corpus.mjs';
import { runDoctor } from '../lib/doctor.mjs';

describe('handoff');

const names = (report) => report.findings.map((f) => f.name);

test('a corpus that arrived whole passes', () => {
  const report = verifyHandoff(makePassingProject());
  assert.equal(report.ok, true, report.findings.map((f) => f.detail).join('; '));
  assert.equal(report.remedy, '');
});

test('a missing ledger is named handoff-ledger-missing', () => {
  const dir = makePassingProject();
  fs.rmSync(resolve(dir, PATHS.ledger));
  const report = verifyHandoff(dir);
  assert.ok(names(report).includes('handoff-ledger-missing'));
  assert.match(report.remedy, /git add -f research\/raw\//);
});

test('an empty ledger is named handoff-ledger-empty - present is not the same as whole', () => {
  const dir = makePassingProject();
  writeText(resolve(dir, PATHS.ledger), '');
  assert.ok(names(verifyHandoff(dir)).includes('handoff-ledger-empty'));
});

test('a capture an evidence row names but that is not on disk is named, per row', () => {
  const dir = makePassingProject();
  const capture = readCorpus(dir).captures.entries[0];
  fs.rmSync(resolve(dir, capture.file));
  const report = verifyHandoff(dir);
  assert.ok(names(report).includes('handoff-capture-missing'));
  assert.equal(report.missingCaptures[0].row, 'E-01');
});

test('a broken chain is named handoff-chain-broken, one line per capture', () => {
  const dir = makePassingProject();
  corrupt(dir, PATHS.ledger, (text) => text.replace(/"seq":1/, '"seq":7'));
  const report = verifyHandoff(dir);
  const broken = report.findings.filter((f) => f.name === 'handoff-chain-broken');
  assert.ok(broken.length);
  for (const finding of broken) {
    assert.equal(finding.detail.includes('\n'), false, 'a paragraph per capture buries the capture names');
  }
});

test('a line-ending rewrite gets the LOCAL remedy, and no push remedy', () => {
  const dir = makePassingProject();
  const capture = readCorpus(dir).captures.entries[0];
  corrupt(dir, capture.file, (text) => text.replace(/\n/g, '\r\n'));

  const report = verifyHandoff(dir);
  assert.equal(report.ok, false);
  assert.equal(report.lineEndings.length, 1);
  assert.equal(report.didNotTravel, false, 'everything travelled; this machine rewrote it');

  const remedy = handoffRemedy(report);
  assert.doesNotMatch(remedy, /git add -f research\/raw\//,
    'sending an operator to the collector for a corpus already on disk is the defect this fixes');
  // The fixture has no git metadata, so the remedy refuses to print a command that
  // cannot work here rather than one that would destroy what it cannot restore.
  assert.match(remedy, /no git metadata/);
  assert.doesNotMatch(remedy, /git add/);

  // In a real repository the same cause gets the runnable, non-destructive remedy.
  const inRepo = lineEndingRemedy(report.lineEndings.map((e) => e.file), { isRepo: true });
  assert.match(inRepo, /\.gitattributes/);
  assert.match(inRepo, /--renormalize/);
  assert.match(inRepo, /re-collecting spends paid credits/);
});

test('a genuinely tampered capture still gets the PUSH remedy', () => {
  const dir = makePassingProject();
  const capture = readCorpus(dir).captures.entries[0];
  corrupt(dir, capture.file, (text) => `${text}\nrewritten by hand\n`);

  const report = verifyHandoff(dir);
  assert.equal(report.lineEndings.length, 0);
  assert.equal(report.didNotTravel, true);
  assert.match(handoffRemedy(report), /git add -f research\/raw\//);
});

test('a report holding both causes prints both remedies', () => {
  const dir = makePassingProject();
  const capture = readCorpus(dir).captures.entries[0];
  corrupt(dir, capture.file, (text) => text.replace(/\n/g, '\r\n'));
  corrupt(dir, PATHS.evidence, (text) => `${text}| E-02 | 2026-01-01 | P | https://x.invalid/gone | a claim | research/raw/gone.md |\n`);

  const remedy = handoffRemedy(verifyHandoff(dir));
  assert.match(remedy, /git add -f research\/raw\//, 'the push remedy, for what did not travel');
  assert.match(remedy, /rewrote it on checkout/, 'and the line-ending remedy, for what this machine changed');
});

test('the remedy texts are the module\'s, so neither consumer can drift', () => {
  assert.match(HANDOFF_REMEDY, /COLLECTOR machine/);
  assert.match(lineEndingRemedy(['research/raw/a.md']), /research\/raw\/a\.md/);
});

test('verifyHandoff is read-only: it never repairs, and never writes the corpus', () => {
  const dir = makePassingProject();
  fs.rmSync(resolve(dir, PATHS.ledger));
  const before = fs.readdirSync(resolve(dir, PATHS.raw)).sort();
  verifyHandoff(dir);
  assert.equal(fs.existsSync(resolve(dir, PATHS.ledger)), false, 'the machine that asks cannot collect the missing bytes');
  assert.deepEqual(fs.readdirSync(resolve(dir, PATHS.raw)).sort(), before);
});

test('one composition, two consumers: doctor passes the corpus it already read', () => {
  const dir = makePassingProject();
  fs.rmSync(resolve(dir, PATHS.ledger));
  const corpus = readCorpus(dir);
  const direct = verifyHandoff(dir, { corpus });
  const second = verifyHandoff(dir, { corpus });
  assert.deepEqual(names(direct), names(second), 'the question has one implementation and one answer');
});

test('doctor makes handoff a BLOCKER on a builder and silent on a collector', () => {
  const dir = makePassingProject();
  fs.rmSync(resolve(dir, PATHS.ledger));

  const configDir = tempDir('research-kit-role-');
  const builderConfig = path.join(configDir, 'builder.json');
  writeText(builderConfig, JSON.stringify({ role: 'builder' }));
  const collectorConfig = path.join(configDir, 'collector.json');
  writeText(collectorConfig, JSON.stringify({ role: 'collector' }));

  const probe = () => ({ installed: false, authenticated: false, version: null, credits: null });

  const builder = runDoctor(dir, { env: { ...process.env, RESEARCH_KIT_CONFIG: builderConfig }, probe, record: false });
  assert.ok(builder.blocking.some((f) => f.name.startsWith('handoff-')), 'a builder is held to the arrival question');
  assert.ok(builder.findings.some((f) => f.name === 'handoff-remedy'));

  const collector = runDoctor(dir, { env: { ...process.env, RESEARCH_KIT_CONFIG: collectorConfig }, probe, record: false });
  assert.equal(collector.blocking.some((f) => f.name.startsWith('handoff-')), false,
    "a collector's existing reporters already own the same states");
});
