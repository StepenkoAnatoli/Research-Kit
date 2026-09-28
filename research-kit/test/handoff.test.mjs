// The arrival question, and one remedy per cause (ADR-0011, ADR-0020).

import { spawnSync } from 'node:child_process';
import { test, describe, assert, makePassingProject, corrupt, tempDir, fs, path, requireGit, fixtureCommitArgs } from './harness.mjs';
import { evaluate } from '../lib/gate.mjs';
import { TEMPLATE_DIR } from '../lib/scaffold.mjs';
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
  // The command is printed quoted (kitCommand), and a checkout under a path with a space
  // in it - routine on macOS and Windows - closes that quote between the script and its
  // first flag. Without the optional quote this suite cannot pass from such a checkout
  // (found 2026-09-28, break-test: one red test from a clone under "deep dir/").
  assert.match(report.remedy, /research\.mjs"? --plan research\/plan\.json --force/);
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
  // requireGit, not a local probe. The probe ran with `cwd: os.tmpdir()`, so on a host
  // whose TMPDIR cannot be used the SPAWN failed and the run reported
  // "no-git: git is not installed" - a false claim about the machine, printed in the
  // one place somebody reads to find out why the suite is red (found 2026-09-28).
  requireGit('the line-ending remedy');
  const dir = makePassingProject();
  fs.rmSync(path.join(dir, '.gitattributes'), { force: true });
  for (const args of [['init', '-q'], ['config', 'user.email', 't@t'], ['config', 'user.name', 't'],
    ['add', '-A'], fixtureCommitArgs('corpus')]) {
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

// Found 2026-09-28, end-to-end run: the push remedy said `git add -f research/raw/`, and the
// commit gate's fix said `git add -f research/`. -f forces EVERY ignored file in, so run as
// printed they committed the machine-local byproducts the repository ignores on purpose
// (.usage.jsonl, .failures.jsonl, .diagnostics.jsonl, .fetches.lock) - the run's own corpus
// commit did, and repo-hygiene went red. Only the ledger needs forcing, where an ignore rule
// (a global one hiding dotfiles, say) would otherwise drop it. research/overrides.log is
// machine-local too (ADR-0081): the template's .gitignore un-ignored it until 2026-09-28.
function runPrinted(dir, text) {
  for (const raw of String(text).split('\n')) {
    const line = raw.replace(/#.*$/, '').trim();
    for (const command of line.split('&&').map((c) => c.trim()).filter((c) => c.startsWith('git add'))) {
      const r = spawnSync('git', command.split(/\s+/).slice(1), { cwd: dir, encoding: 'utf8' });
      assert.equal(r.status, 0, `${command}: ${r.stderr}`);
    }
  }
}

function collectorCheckout() {
  requireGit('running the printed corpus commands');
  const dir = makePassingProject();
  fs.copyFileSync(path.join(TEMPLATE_DIR, '.gitignore'), path.join(dir, '.gitignore'));
  spawnSync('git', ['init', '-q'], { cwd: dir });
  // A global-style rule that hides every dotfile: the case the ledger must survive.
  fs.appendFileSync(path.join(dir, '.git', 'info', 'exclude'), '.*\n!.gitignore\n');
  for (const byproduct of ['.usage.jsonl', '.failures.jsonl', '.diagnostics.jsonl', '.fetches.lock']) {
    fs.writeFileSync(resolve(dir, `research/raw/${byproduct}`), '{}\n');
  }
  fs.writeFileSync(resolve(dir, PATHS.overrides), 'override\n');
  return dir;
}

function tracked(dir) {
  return spawnSync('git', ['ls-files'], { cwd: dir, encoding: 'utf8' }).stdout.split('\n').filter(Boolean);
}

for (const [label, printed] of [
  ['the handoff push remedy', () => HANDOFF_REMEDY],
  ['the commit gate\'s fix for an untracked corpus', (dir) => evaluate(dir, { gate: 'commit', stagedPaths: ['README.md'], record: false }).fix],
]) {
  test(`${label}, run as printed, tracks the ledger and no machine-local byproduct`, () => {
    const dir = collectorCheckout();
    runPrinted(dir, printed(dir));
    const files = tracked(dir);
    assert.ok(files.includes(PATHS.ledger), `the ledger was not added:\n${files.join('\n')}`);
    const leaked = files.filter((f) => /(^|\/)\.(usage|diagnostics|failures)\.jsonl$|\.fetches\.lock$|overrides\.log$/.test(f));
    assert.deepEqual(leaked, [], 'machine-local byproducts were committed');
  });
}
