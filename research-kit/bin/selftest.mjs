#!/usr/bin/env node
// bin/selftest.mjs - the whole suite.
//
// The harness AWAITS every test (ADR-0021), so `ok` means the assertions settled and
// the failure count includes async failures. A red suite exits non-zero: a failing test
// is a stop-the-line event, and the cwd is printed with it because some tests are
// cwd-sensitive and a red without a cwd is a failure that cannot be localised.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseFlags, listFiles, refuseUnknownFlags, exists, kitCommand, tolerateClosedStdout } from '../lib/core.mjs';
import { runPending, TEST_TIMEOUT, importTestFiles, describe, test, dominantFailureCause } from '../test/harness.mjs';
import { KIT_ROOT } from '../lib/scaffold.mjs';

// Before the first write: a reader that quits early (`| head -1`) must not turn this run
// into an EPIPE crash, because that reads exactly like a red suite (2026-09-28).
tolerateClosedStdout();

const { flags, positional } = parseFlags(process.argv.slice(2));
refuseUnknownFlags(flags, ['help']);
const dir = path.join(KIT_ROOT, 'test');

if (flags.help) {
  process.stdout.write(`selftest - run the kit's suite.

  node research-kit/bin/selftest.mjs [name...]

  name   run only the test files whose name contains this text

Every test runs offline: no key, no credits, no network.
`);
  process.exit(0);
}

const files = listFiles(dir)
  .filter((name) => name.endsWith('.test.mjs'))
  .filter((name) => !positional.length || positional.some((needle) => name.includes(needle)))
  .sort();

if (!files.length) {
  process.stderr.write(`no test files in ${dir}\n`);
  process.exit(2);
}

// Tests name kit files as `research-kit/...`, relative to the repository root, so the suite
// runs from there whatever folder it was started in - otherwise one import-time read from
// another cwd crashed the run before any test ran. A relative result file is the caller's,
// so it is resolved against the folder they started in, before the move.
const invokedFrom = process.cwd();
if (process.env.RESEARCH_KIT_RESULT_FILE) {
  process.env.RESEARCH_KIT_RESULT_FILE = path.resolve(invokedFrom, process.env.RESEARCH_KIT_RESULT_FILE);
}
process.chdir(path.resolve(KIT_ROOT, '..'));

// The suite is not portable away from its checkout: its tests judge repository fixtures
// the deploy mirror does not ship - the CI workflows, the ADRs and decision documents, the
// front README and AGENTS.md, this repository's collected corpus. From an INSTALLED kit
// (install.mjs -> ~/.agents/research-kit) every one of those tests failed ENOENT - 100+
// red on a healthy deployment, indistinguishable from a genuinely broken kit, with doctor
// the only check that verifies an install (found 2026-09-28, break-test). Refuse there,
// naming what is missing and the check to run instead. Exit 2: misuse, not a red suite.
const missingAnchors = ['.github/workflows', 'docs/adr', 'AGENTS.md']
  .filter((rel) => !exists(path.join(KIT_ROOT, '..', rel)));
if (missingAnchors.length) {
  process.stderr.write(`selftest runs in the repository checkout; ${missingAnchors.join(', ')} ${missingAnchors.length === 1 ? 'is' : 'are'} not beside research-kit/, so the tests that read repository fixtures would fail on a healthy deployment.\n`);
  process.stderr.write(`run it in a clone of the repository. To verify a DEPLOYED kit: ${kitCommand('doctor.mjs')}\n`);
  process.exit(2);
}

// Almost every test needs a scratch folder. When the temp folder cannot be used (a
// read-only TMPDIR, a TMPDIR naming a file) the run used to report hundreds of failures
// with one cause and never say it (found 2026-09-28: 541 x EACCES). Try it once, first,
// and name it at the top and again under a red summary. The run still happens, so the
// count and the result file stay honest.
const tempProblem = (() => {
  const base = os.tmpdir();
  try {
    fs.mkdirSync(base, { recursive: true });
    fs.rmSync(fs.mkdtempSync(path.join(base, 'rk-selftest-')), { recursive: true, force: true });
    return null;
  } catch (err) {
    return `the temp folder ${base} cannot be used (${err.code ?? err.message}), so every test that needs a scratch folder fails. `
      + 'Point TMPDIR (TEMP and TMP on Windows) at a folder this user can write, and run again.';
  }
})();
if (tempProblem) process.stderr.write(`\n${tempProblem}\n\n`);

/**
 * How much room the temp folder actually has, in words.
 *
 * The probe above answers "can this folder be used at all". A volume that is writable and
 * full answers YES and then fails every test that writes anything - so when a red suite
 * is dominated by ENOSPC this is the number the reader needs, and `statfsSync` is the only
 * way to get it without writing until the disk says stop.
 */
function tempFreeSpace() {
  const base = os.tmpdir();
  const measured = 'a green run of this suite peaked at 52 MiB of scratch, measured 2026-09-29';
  try {
    const stat = fs.statfsSync(base);
    const mib = (stat.bavail * stat.bsize) / 1048576;
    return `the temp folder ${base} has ${mib < 10 ? mib.toFixed(1) : Math.round(mib)} MiB free, and ${measured}. `
      + 'Point TMPDIR (TEMP and TMP on Windows) at a folder with room, and run again.';
  } catch {
    return `check the free space on the volume holding ${base}; ${measured}.`;
  }
}

const started = Date.now();
// A file that throws while loading is a named FAIL, not the end of the run.
for (const { file, error } of await importTestFiles(dir, files)) {
  describe(file.replace(/\.test\.mjs$/, ''));
  test('the test file loads', () => {
    throw new Error(`${file} threw while it was imported, so none of its tests ran: ${error?.message ?? error}`);
  });
}

const { failures, passed, unsupported, blocking, errorCodes } = await runPending();

/**
 * Write the result as DATA, when asked.
 *
 * CI used to scrape this program's stdout for `N passed, M failed`, which cannot tell a
 * failing suite from a suite that died before printing anything - a startup error, an
 * import-time throw, an OOM kill and a truncated log all render as "suite produced no
 * count". A reviewer then sees a generic message and has to go hunting for the real
 * diagnostic.
 *
 * Absence of this file is itself the signal: if the runner crashed before emission there
 * is nothing to read, which is distinguishable from a suite that ran and failed.
 */
function writeResultFile(code) {
  const target = process.env.RESEARCH_KIT_RESULT_FILE;
  if (!target) return;
  try {
    fs.writeFileSync(target, `${JSON.stringify({
      passed, failures, unsupported: unsupported.length, blocking, exit: code,
      seconds: Number(((Date.now() - started) / 1000).toFixed(1)),
      files: files.length, node: process.versions.node, platform: process.platform,
    }, null, 2)}
`, 'utf8');
  } catch (err) {
    // A report that cannot be written must not fail the run it reports on - but it must
    // not be silent either.
    //
    // CI reads the ABSENCE of this file as "the runner crashed before reporting". If an
    // unwritable path (bad permissions, a full disk, a typo in the variable) produced the
    // same absence, CI would report a crash that did not happen, and the real cause -
    // which is right here - would be invisible. Saying so on stderr costs nothing and
    // makes the two indistinguishable cases distinguishable again.
    process.stderr.write(
      `RESEARCH_KIT_RESULT_FILE was set to ${JSON.stringify(target)} and could not be written: ${err.message}\n`
      + 'The suite result below is still authoritative; only the machine-readable copy is missing.\n');
  }
}

const seconds = ((Date.now() - started) / 1000).toFixed(1);

process.stdout.write(`\n${passed} passed, ${failures} failed${unsupported.length ? `, ${unsupported.length} unsupported` : ''} in ${seconds}s (watchdog ${TEST_TIMEOUT}ms/test)\n`);

if (unsupported.length) {
  // A host that cannot provide a required capability is not falsely green: the report
  // says exactly which capability, and why, and it blocks.
  process.stdout.write('\nThis host could not run:\n');
  for (const entry of unsupported) process.stdout.write(`  ${entry.code}  ${entry.label}\n    ${entry.reason}\n`);
}
if (blocking) {
  writeResultFile(1);
  process.stdout.write(`\nA red suite stops work. cwd: ${process.cwd()} (started in ${invokedFrom})\n`);
  if (tempProblem) process.stdout.write(`Likely cause: ${tempProblem}\n`);
  // 653 failures with one cause behind them is one broken machine, not 653 broken tests,
  // and a reader told only the count goes looking in 653 places (found 2026-09-29:
  // a 1 MiB TMPDIR, 646 of 653 failures ENOSPC, no cause named anywhere).
  const cause = dominantFailureCause({ failures, errorCodes });
  if (cause) {
    const percent = Math.round(cause.share * 100);
    process.stdout.write(`Likely single cause: ${cause.count} of ${failures} failures (${percent}%) open with ${cause.code}.\n`);
    process.stdout.write(`  ${cause.code === 'ENOSPC' || cause.code === 'EDQUOT' ? tempFreeSpace() : `one code behind most of a red suite points at one broken thing, not ${failures} broken tests.`}\n`);
  }
  process.exit(1);
}

// The README states a test count in the present tense, and it has now gone stale TWICE:
// it said 326 when there were 565, and 565 when there were 582. No test could catch it,
// because the true number only exists here - after the run - and a test cannot count a
// suite it is part of without importing every file a second time.
//
// So the check lives where the number is. Only on a FULL run: a filtered run
// (`selftest.mjs gate hook`) legitimately produces a smaller count and must not rewrite
// the claim or fail against it.
if (!positional.length) {
  const readme = path.join(KIT_ROOT, 'README.md');
  try {
    const text = fs.readFileSync(readme, 'utf8');
    const claim = text.match(/^(\d[\d,]*) tests, offline/m);
    const actual = passed + unsupported.length;
    if (claim && Number(claim[1].replace(/,/g, '')) !== actual) {
      process.stdout.write(
        `\nresearch-kit/README.md claims ${claim[1]} tests; this run has ${actual}.\n`
        + `A stale count is the first claim a reader checks, and the cheapest one to lose trust over.\n`
        + `Fix: change "${claim[1]} tests, offline" to "${actual} tests, offline" in research-kit/README.md\n`);
      writeResultFile(1);
      process.exit(1);
    }
  } catch { /* no README (a scaffolded or partial copy) - nothing to keep honest */ }
}

writeResultFile(0);
process.stdout.write('all tests passed\n');
process.exit(0);
