// The support policy is a claim about CI. This checks it against CI.
//
// "Supported" is defined in README.md as one specific thing: the full offline suite runs
// on that platform on every commit. That makes the policy falsifiable - and therefore
// worth testing, because a policy that drifts from the workflow is worse than none. A
// reader trusts it, and it quietly stops being true the moment someone edits the matrix.
//
// This repository has shipped documentation drift twice already: a README claiming 326
// tests when there were 565, and an architecture map describing two modules that did not
// exist. Both were prose nobody could check. This one can be.

import { test, describe, assert, assertEqual, fs, path, KIT_ROOT } from './harness.mjs';

describe('support-policy');

const REPO = path.resolve(KIT_ROOT, '..');
const WORKFLOW = path.join(REPO, '.github', 'workflows', 'offline-suite.yml');
const ROOT_README = path.join(REPO, 'README.md');
const KIT_README = path.join(KIT_ROOT, 'README.md');

/** The platforms the workflow actually runs the suite on. */
function matrixPlatforms() {
  const yaml = fs.readFileSync(WORKFLOW, 'utf8');
  const match = yaml.match(/^\s*os:\s*\[([^\]]+)\]/m);
  assert(match, 'could not find the `os:` matrix in offline-suite.yml; this test needs updating');
  return match[1].split(',').map((name) => name.trim()).filter(Boolean);
}

test('the CI matrix is exactly the platforms the README calls supported', () => {
  const platforms = matrixPlatforms();
  assertEqual(JSON.stringify(platforms), JSON.stringify(['ubuntu-latest', 'windows-latest']),
    'the CI matrix changed. That may be correct - but README.md states a support policy in '
    + 'terms of what CI runs, so update the policy in the same commit and then update this '
    + `test deliberately. Matrix is now: ${platforms.join(', ')}`);

  const readme = fs.readFileSync(ROOT_README, 'utf8');
  assert(/Linux and Windows are supported/.test(readme),
    'README.md no longer states the support policy the CI matrix implements');
  assert(/macOS is best-effort and untested/i.test(readme),
    'README.md no longer says macOS is unsupported, but the matrix still does not run it');
});

test('macOS is excluded on purpose, and the workflow says so where someone would look', () => {
  // The difference between "deliberately excluded" and "somebody deleted a line" is a
  // comment at the place the next person will edit. Without it, the honest reading of a
  // two-platform matrix is that macOS was forgotten.
  const yaml = fs.readFileSync(WORKFLOW, 'utf8');
  assert(/macos/i.test(yaml),
    'the workflow no longer mentions macOS at all, so a reader cannot tell whether its '
    + 'absence is a decision or an accident');
});

test('both READMEs agree about what is supported', () => {
  // The kit README is what someone reads after cloning; the root README is what they read
  // on GitHub. Two support policies is worse than one, because the reader cannot tell
  // which is stale.
  const kit = fs.readFileSync(KIT_README, 'utf8');
  assert(/Supported on Linux and Windows/i.test(kit),
    'research-kit/README.md does not carry the support policy, so a reader who starts there never sees it');
  assert(/macOS is best-effort/i.test(kit), 'research-kit/README.md omits the macOS caveat the root README makes');
});

test('the prerequisites named in the policy are the ones the suite actually needs', () => {
  // Python is listed as a requirement because its absence BLOCKS - that is the whole point
  // of the UNSUP mechanism, and a reader who skips installing it should know before the
  // suite tells them.
  const readme = fs.readFileSync(ROOT_README, 'utf8');
  assert(/Python 3\.12\+/.test(readme), 'the README no longer names the Python requirement');
  assert(/Node 22\+/.test(readme), 'the README no longer names the Node requirement');

  const yaml = fs.readFileSync(WORKFLOW, 'utf8');
  const node = yaml.match(/node-version:\s*'?([\d.]+)'?/);
  const python = yaml.match(/python-version:\s*'?([\d.]+)'?/);
  assert(node && Number(node[1].split('.')[0]) >= 22,
    `CI pins Node ${node?.[1]} but the README promises 22+`);
  assert(python && python[1].startsWith('3.1'),
    `CI pins Python ${python?.[1]} but the README promises 3.12+`);
});

test('the onboarding path names commands that exist', () => {
  // A quickstart that names a binary nobody shipped is the most expensive kind of wrong:
  // it fails on the reader's first command, before they have any reason to trust the rest.
  const readme = fs.readFileSync(ROOT_README, 'utf8');
  const section = readme.slice(readme.indexOf('## Your first 30 minutes'), readme.indexOf('## When something fails'));
  assert(section.length > 200, 'the onboarding section is missing or empty');

  const referenced = [...section.matchAll(/research-kit\/(bin|examples)\/[\w/-]+\.mjs/g)].map((m) => m[0]);
  assert(referenced.length >= 5, `expected the onboarding path to name several commands, found ${referenced.length}`);
  const missing = [...new Set(referenced)].filter((rel) => !fs.existsSync(path.join(REPO, rel)));
  assertEqual(missing.length, 0, `the onboarding path names commands that do not exist: ${missing.join(', ')}`);
});

test('the documented exit codes are the ones the release CLI returns', () => {
  // The verdict table tells readers to branch on these. If the CLI's mapping changes and
  // the table does not, every script written from this README misreads a result.
  const readme = fs.readFileSync(ROOT_README, 'utf8');
  const cli = fs.readFileSync(path.join(KIT_ROOT, 'bin', 'researcher-release.mjs'), 'utf8');
  // Matched per LINE rather than per condition, because FAIL and REOPEN deliberately
  // share one: `if (status === 'FAIL' || status === 'REOPEN') return 1;`. An earlier
  // version of this test assumed one status per branch and failed on that line - the
  // test was wrong, not the CLI.
  const lines = cli.split('\n');
  for (const [status, code] of [['PASS', '0'], ['FAIL', '1'], ['REOPEN', '1'], ['INCOMPLETE', '2'], ['BLOCKED', '3']]) {
    const line = lines.find((text) => text.includes(`'${status}'`) && /return\s+\d/.test(text));
    assert(line, `researcher-release.mjs no longer maps ${status} to an exit code at all`);
    assertEqual(line.match(/return\s+(\d)/)[1], code,
      `researcher-release.mjs maps ${status} to a different exit code than the README documents`);
    assert(new RegExp(`\`${status}\``).test(readme), `the README's verdict table no longer lists ${status}`);
  }
});
