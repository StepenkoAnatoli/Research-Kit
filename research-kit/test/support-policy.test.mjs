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

import { spawnSync } from 'node:child_process';
import { test, describe, assert, assertEqual, fs, path, KIT_ROOT } from './harness.mjs';

describe('support-policy');

const REPO = path.resolve(KIT_ROOT, '..');
const WORKFLOW = path.join(REPO, '.github', 'workflows', 'offline-suite.yml');
const ROOT_README = path.join(REPO, 'README.md');
const KIT_README = path.join(KIT_ROOT, 'README.md');

/**
 * The platforms the workflow actually runs the suite on.
 *
 * This repository has no YAML parser and no dependencies, so this reads the `os:` key by
 * hand. It accepts BOTH shapes YAML allows, because the first version accepted only flow
 * style and would have failed on a semantically identical workflow:
 *
 *     os: [ubuntu-latest, windows-latest]      flow
 *     os:                                      block
 *       - ubuntu-latest
 *       - windows-latest
 *
 * Quotes are stripped either way. It is still a structural reader rather than a parser -
 * an anchor or a matrix built by `fromJSON` would defeat it - so it fails LOUDLY when it
 * cannot find the key, rather than returning an empty list that would make every
 * assertion below vacuously true.
 */
function matrixPlatforms() {
  const yaml = fs.readFileSync(WORKFLOW, 'utf8');
  const unquote = (name) => name.trim().replace(/^['"]|['"]$/g, '');

  const flow = yaml.match(/^\s*os:\s*\[([^\]]+)\]/m);
  if (flow) return flow[1].split(',').map(unquote).filter(Boolean);

  const block = yaml.match(/^(\s*)os:\s*$\n((?:\1\s+-\s*\S+\s*$\n?)+)/m);
  if (block) return [...block[2].matchAll(/-\s*(\S+)/g)].map((m) => unquote(m[1])).filter(Boolean);

  assert(false, 'could not read the `os:` matrix from offline-suite.yml in either flow or '
    + 'block style. This is a structural reader, not a YAML parser - if the matrix now '
    + 'comes from an anchor or fromJSON, this test needs rewriting rather than deleting.');
  return [];
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

test('macOS is excluded on purpose, and only ever mentioned in a comment', () => {
  // The first version of this test asserted `/macos/i.test(yaml)` - that the workflow
  // "still mentions macOS" - to prove the exclusion was deliberate. It passed, and it was
  // passing BECAUSE OF A BUG: the aggregating job printed "ubuntu, windows and macos all
  // passed" on a matrix that had not run macOS since the leg was dropped. A green run
  // reported a platform result that did not exist, and this test was satisfied by the
  // very line that was lying.
  //
  // So the assertion is now specific about WHERE macOS may appear. In a comment it is a
  // recorded decision; in an executable line it is a claim, and there is nothing running
  // that could make such a claim true.
  const yaml = fs.readFileSync(WORKFLOW, 'utf8');
  const lines = yaml.split('\n');
  const comments = lines.filter((line) => line.trim().startsWith('#'));
  const executable = lines.filter((line) => !line.trim().startsWith('#'));

  assert(comments.some((line) => /macos/i.test(line)),
    'no comment mentions macOS, so a reader cannot tell whether its absence from the '
    + 'matrix is a decision or an accident');

  const claims = executable.filter((line) => /macos/i.test(line));
  assertEqual(claims.length, 0,
    'macOS appears in an EXECUTABLE line of the workflow while the matrix does not run '
    + `it, so the workflow states something no job checks:\n  ${claims.join('\n  ')}`);
});

test('the matrix is the ONLY place that says which platforms run', () => {
  // The earlier version of this test checked that a hardcoded list in the success message
  // matched the matrix. That guarded the drift without removing it: there were still two
  // places stating which platforms run, and a future edit had to update both.
  //
  // The message no longer names any platform, so there is one source of truth and nothing
  // to keep in step. This asserts that property rather than the agreement of two lists -
  // a guard you can delete by fixing the design is better than a guard you must maintain.
  const yaml = fs.readFileSync(WORKFLOW, 'utf8');
  const platforms = matrixPlatforms();
  assert(platforms.length > 0, 'the matrix reader returned nothing, so nothing below is meaningful');

  const executable = yaml.split('\n').filter((line) => !line.trim().startsWith('#'));
  for (const platform of platforms) {
    // Two mentions are legitimate and are not claims about coverage:
    //   os:       the matrix itself, which is the source of truth
    //   runs-on:  WHERE a job executes. The aggregating `suite` job runs on
    //             ubuntu-latest because it needs some host for a three-second check;
    //             that says nothing about which platforms the suite was run on.
    //
    // The first version of this test flagged that `runs-on` and was wrong to. What is
    // actually being guarded is a platform named in OUTPUT - an echo, a summary, a
    // message a reader would take as evidence that the platform ran.
    const mentions = executable.filter((line) => line.includes(platform)
      && !/^\s*os:/.test(line) && !/^\s*runs-on:/.test(line));
    assertEqual(mentions.length, 0,
      `${platform} is named outside the matrix and outside a runs-on, which makes a second `
      + `source of truth that can drift from it:\n  ${mentions.join('\n  ')}`);
  }

  const summary = executable.find((line) => /every platform in the matrix passed/.test(line));
  assert(summary, 'the aggregating job no longer reports that the matrix passed');
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

test('every subcommand reports a usage error the same way', () => {
  // `fi-validate` returned 4 for a missing flag while `validate` and `conform` returned 2,
  // so the same mistake reported a different code depending on which subcommand you
  // typed. Worse, 4 is this CLI's "unrecognised status" fallback - a caller branching on
  // it was told the validator produced something unknown, when it had never run.
  //
  // Asserted by RUNNING the CLI rather than reading it, because the question is what a
  // caller observes.
  const cli = path.join(KIT_ROOT, 'bin', 'researcher-release.mjs');
  const cases = [
    ['validate', ['validate']],
    ['conform', ['conform']],
    ['fi-validate', ['fi-validate']],
    ['unknown subcommand', ['not-a-subcommand']],
  ];
  for (const [name, argv] of cases) {
    const run = spawnSync(process.execPath, [cli, ...argv], { encoding: 'utf8', timeout: 30_000, windowsHide: true });
    assertEqual(run.status, 2, `${name} exits ${run.status} on a usage error; every subcommand must use 2`);
    assert(/Usage:/.test(run.stderr), `${name} did not print usage on a usage error`);
  }
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
