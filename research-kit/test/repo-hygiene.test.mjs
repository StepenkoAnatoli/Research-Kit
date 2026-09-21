// Properties of the REPOSITORY, not of the kit's code.
//
// The defect these exist for: `research/raw/.diagnostics.jsonl` was tracked from this
// repository's first commit until 2026-09-20 — added in the very same commit as the
// `.gitignore` rule that excludes it. `.gitignore` only governs UNTRACKED files, so a
// path that reaches the index once is tracked forever, silently, no matter what the
// ignore file says.
//
// The consequence was small per occurrence and endless in aggregate: `bin/gate.mjs`
// appends a line to that file on every invocation, so every commit-gate run, every
// edit-gate run, and every verification left the working tree dirty. A read-only check
// that modifies the repository it is checking is a contradiction, and under branch
// protection it becomes an obstruction as well.
//
// Neither the kit's tests nor its own gate could see it: both judge the corpus, and this
// is a fact about git's index.

import { spawnSync } from 'node:child_process';
import { test, describe, assert, fs, path, KIT_ROOT } from './harness.mjs';

describe('repo-hygiene');

const REPO = path.resolve(KIT_ROOT, '..');

/** git, run in this repository. Returns null when git cannot answer. */
function git(args) {
  const result = spawnSync('git', ['-c', 'core.longpaths=true', ...args], {
    cwd: REPO, encoding: 'utf8', timeout: 30_000, windowsHide: true,
  });
  if (result.error || result.status !== 0) return null;
  return String(result.stdout ?? '');
}

const inGitRepo = git(['rev-parse', '--is-inside-work-tree'])?.trim() === 'true';

test('no ignored file is tracked', () => {
  if (!inGitRepo) return;          // a scaffolded copy is not a git repository; nothing to check

  // `git ls-files -i -c --exclude-standard` lists exactly the contradiction: paths that
  // are in the index AND matched by an ignore rule.
  const tracked = (git(['ls-files', '-i', '-c', '--exclude-standard']) ?? '')
    .split('\n').map((l) => l.trim()).filter(Boolean);

  assert.deepEqual(tracked, [],
    'these files are ignored by .gitignore and tracked anyway, so the ignore rule does '
    + 'nothing and they will keep appearing in every diff:\n  ' + tracked.join('\n  '));
});

test('the fetch ledger is tracked, and is NOT ignored', () => {
  if (!inGitRepo) return;

  // The mirror of the test above. The ledger is the one dotfile under research/raw/ that
  // must travel — a corpus that arrives without it cannot pass its own gate. If a future
  // ignore rule swept it up with its neighbours, nothing else here would notice.
  const ledger = 'research/raw/.fetches.jsonl';
  const listed = (git(['ls-files', '--', ledger]) ?? '').trim();
  assert.equal(listed, ledger, `${ledger} is not tracked - the provenance chain would not travel`);

  const ignored = git(['check-ignore', '-q', ledger]);
  assert.equal(ignored, null, `${ledger} is matched by an ignore rule; it is evidence and must travel`);
});

test('the gate writes only to paths git is told to ignore', () => {
  // bin/gate.mjs appends to the diagnostics log on every run. That is acceptable ONLY
  // because the path is ignored; if the log ever moves somewhere tracked, every
  // verification starts dirtying the tree again and this test is the thing that says so.
  const source = fs.readFileSync(path.join(KIT_ROOT, 'bin', 'gate.mjs'), 'utf8');
  assert.ok(source.includes('recordDiagnostic'), 'the gate no longer records diagnostics; this test needs rewriting');

  if (!inGitRepo) return;
  const ignored = git(['check-ignore', '-q', 'research/raw/.diagnostics.jsonl']);
  assert.notEqual(ignored, null,
    'the gate appends to research/raw/.diagnostics.jsonl on every invocation, and that '
    + 'path is no longer ignored - so every verification will dirty the working tree');
});

test('the kit README has no parent-relative link, because it ships standalone', () => {
  // `install.mjs` deploys research-kit/ to ~/.agents/research-kit with its README. There
  // is no ~/.agents/README.md, so a `](../README.md)` link is broken for everybody using
  // the installed kit - which is everybody not reading the repository. Absolute URLs
  // resolve from both places; a relative one resolves from exactly one.
  const readme = path.join(KIT_ROOT, 'README.md');
  if (!fs.existsSync(readme)) return;
  const text = fs.readFileSync(readme, 'utf8');
  const broken = text.split('\n')
    .map((line, i) => ({ line, at: i + 1 }))
    .filter(({ line }) => /\]\(\.\.\//.test(line))
    .map(({ line, at }) => `README.md:${at}  ${line.trim()}`);

  assert.deepEqual(broken, [],
    'these links assume a parent directory that does not exist in a deployed kit:\n  ' + broken.join('\n  '));
});

test('no collector byproduct is tracked at any depth', () => {
  // `.gitignore` rules with a slash in them are anchored to the file that declares them,
  // so the root rules cover `research/raw/` and nothing else. A NESTED decision project
  // (ADR-0030) is covered by its own `.gitignore` - which protects it only once that
  // project is committed.
  //
  // The window between is real and it caught me: a byproduct written into a nested
  // project on one branch survives the switch away as an untracked orphan, because it was
  // ignored there and so was never removed. `git add -A` on a branch that has not got
  // the nested ignore file yet then commits it.
  //
  // This asserts the invariant rather than the rules: these four are machine-local state,
  // they are never evidence, and they must not be in the index anywhere.
  if (!inGitRepo) return;

  const byproducts = /(^|\/)\.(usage|diagnostics|failures)\.jsonl$|(^|\/)\.fetches\.lock$|(^|\/)overrides\.log$/;
  const tracked = (git(['ls-files']) ?? '').split('\n').map((l) => l.trim()).filter(Boolean);
  const offenders = tracked.filter((f) => byproducts.test(f));

  assert.deepEqual(offenders, [],
    'these are machine-local byproducts and must never be tracked:\n  ' + offenders.join('\n  '));
});

test('the ledger is still not swept up by the broader rules', () => {
  // The mirror of the test above, and the reason it is worded as a denylist of four names
  // rather than "ignore everything hidden under research/raw". The chain is evidence and
  // must travel - including in a nested project.
  if (!inGitRepo) return;
  const ledgers = (git(['ls-files']) ?? '').split('\n').map((l) => l.trim())
    .filter((f) => f.endsWith('research/raw/.fetches.jsonl'));

  assert.ok(ledgers.length >= 1, 'no fetch ledger is tracked anywhere; the corpus cannot prove itself');
  for (const ledger of ledgers) {
    assert.equal(git(['check-ignore', '-q', ledger]), null, `${ledger} is matched by an ignore rule; it is evidence and must travel`);
  }
});
