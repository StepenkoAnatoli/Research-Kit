// The arrival question, and one remedy per cause (ADR-0011, ADR-0020).

import { spawnSync } from 'node:child_process';
import os from 'node:os';
import { test, describe, assert, makePassingProject, corrupt, tempDir, fs, path, requireCapability } from './harness.mjs';
import { PATHS, resolve, writeText } from '../lib/core.mjs';
import { verifyHandoff, handoffRemedy, HANDOFF_REMEDY, lineEndingRemedy, PIN_LINES } from '../lib/handoff.mjs';
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

// Arena, 2026-09-28: a one-line ledger with a torn tail, repaired by doctor --fix-arity, is
// EMPTY while every capture is still on disk. The advice was to push from the collector -
// which, on the collector, pushes the same empty ledger. Nothing failed to travel: the
// entries were lost where the captures are, so the remedy is to restore or re-collect.
test('an empty ledger beside captures on disk lost its entries: restore or re-collect, not push', () => {
  const dir = makePassingProject();
  assert.ok(readCorpus(dir).captures.entries.length > 0, 'the fixture holds captures');
  writeText(resolve(dir, PATHS.ledger), '');
  const report = verifyHandoff(dir);
  assert.ok(names(report).includes('handoff-ledger-empty'));
  assert.equal(report.ledgerLost, true);
  assert.equal(report.didNotTravel, false, 'nothing is missing from this checkout');
  assert.doesNotMatch(report.remedy, /git add -f/);
  assert.match(report.remedy, /git checkout HEAD -- research\/raw\/\.fetches\.jsonl/);
  assert.match(report.remedy, /research\.mjs --plan research\/plan\.json --force/);
});

// The same loss, one line shorter: a torn LAST line of a longer ledger, dropped by
// doctor --fix-arity, leaves one cited capture on disk that no entry records. Handoff said
// OK and exited 0 while preflight failed it (fetch-entry-exists) - the builder's first
// command disagreed with its second.
test('a cited capture no ledger entry records is named, with the restore remedy', () => {
  const dir = makePassingProject();
  const capture = readCorpus(dir).captures.entries[0];
  const second = capture.file.replace(/\.md$/, '-two.md');
  fs.copyFileSync(resolve(dir, capture.file), resolve(dir, second));
  const evidence = resolve(dir, PATHS.evidence);
  const row = fs.readFileSync(evidence, 'utf8').split('\n').find((l) => l.startsWith('| E-01 '));
  fs.appendFileSync(evidence, `${row.replace('E-01', 'E-02').replace(capture.file, second)}\n`);
  const report = verifyHandoff(dir);
  assert.equal(report.ok, false, 'handoff passed a capture preflight fails');
  const finding = report.findings.find((f) => f.name === 'handoff-capture-unledgered');
  assert.ok(finding, names(report).join(', '));
  assert.match(finding.detail, /E-02/);
  assert.equal(report.ledgerLost, true);
  assert.equal(report.didNotTravel, false);
  assert.match(report.remedy, /git checkout HEAD -- research\/raw\/\.fetches\.jsonl/);
});

test('an empty ledger with a cited capture also missing gets both remedies', () => {
  const dir = makePassingProject();
  const capture = readCorpus(dir).captures.entries[0];
  writeText(resolve(dir, PATHS.ledger), '');
  fs.rmSync(resolve(dir, capture.file));
  const report = verifyHandoff(dir);
  assert.equal(report.didNotTravel, true);
  assert.match(report.remedy, /git add -f/);
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
  assert.match(inRepo, /git checkout HEAD -- research\/raw\//, 'the capture is rewritten here, from the committed copy');
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

// Found 2026-09-27: the printed line-ending remedy, run verbatim after a real
// core.autocrlf=true checkout, left every capture CRLF and handoff still failed.
// `git add --renormalize` fixes the INDEX, and git will not rewrite a working file it
// believes is unchanged, so the bytes handoff reads never changed. The remedy is judged
// here by running it.
test('the line-ending remedy, run as printed, makes a CRLF checkout pass', () => {
  const git = (cwd, ...args) => spawnSync('git', args, { cwd, encoding: 'utf8' });
  requireCapability(git(os.tmpdir(), '--version').status === 0, 'no-git', 'git is not installed');
  const dir = makePassingProject();
  fs.rmSync(path.join(dir, '.gitattributes'), { force: true });
  for (const args of [['init', '-q'], ['config', 'user.email', 't@t'], ['config', 'user.name', 't'],
    ['add', '-A'], ['commit', '-q', '--no-verify', '-m', 'corpus']]) {
    assert.equal(git(dir, ...args).status, 0, `git ${args.join(' ')}`);
  }
  git(dir, 'config', 'core.autocrlf', 'true');
  fs.rmSync(path.join(dir, 'research', 'raw'), { recursive: true });
  git(dir, 'checkout', '-q', '--', 'research/raw');
  const before = verifyHandoff(dir);
  assert.ok(before.lineEndings.length, 'the checkout did not produce CRLF captures');

  const remedy = handoffRemedy(before);
  // The pin is given as lines to add to .gitattributes, in any editor; the test adds them.
  const pins = remedy.split('\n').map((l) => l.trim()).filter((l) => PIN_LINES.includes(l));
  if (pins.length) fs.appendFileSync(path.join(dir, '.gitattributes'), `${pins.join('\n')}\n`);
  for (const line of remedy.split('\n').map((l) => l.trim())) {
    if (line.startsWith('git ') && !line.startsWith('git status')) {
      const args = line.split(/\s+/).slice(1);
      const r = git(dir, ...args);
      assert.equal(r.status, 0, `${line}\n${r.stderr}`);
    }
  }
  const after = verifyHandoff(dir);
  assert.equal(after.ok, true, `the remedy did not fix it:\n${remedy}\n${JSON.stringify(after.findings.map((f) => f.detail))}`);
});

test('the line-ending remedy does not append a pin that is already there', () => {
  const pinLine = /^\s+research\/raw\/\* text eol=lf$/m;
  assert.doesNotMatch(lineEndingRemedy(['research/raw/a.md'], { pinned: true }), pinLine);
  assert.match(lineEndingRemedy(['research/raw/a.md'], { pinned: false }), pinLine);
});

// Found 2026-09-27: the remedy is for a Windows checkout, and it used printf (in neither cmd
// nor PowerShell) and trailing "# ..." comments (file names to git, in cmd).
test('every command the line-ending remedy prints is a plain git command a Windows shell runs', () => {
  const files = ['research/raw/a.md', 'research/raw/b.md', 'research/raw/c.md', 'research/raw/d.md', 'research/raw/e.md', 'research/raw/f.md'];
  const remedy = lineEndingRemedy(files, { pinned: false });
  const commands = remedy.split('\n').filter((l) => /^ {4}\S/.test(l)).map((l) => l.trim());
  assert.ok(commands.length >= 4, remedy);
  for (const line of commands) {
    assert.match(line, /^git /, `not a git command: ${line}`);
    assert.doesNotMatch(line, /#/, `a trailing comment is a file name in cmd: ${line}`);
  }
  assert.doesNotMatch(remedy, /printf/);
});
