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
