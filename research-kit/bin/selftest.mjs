#!/usr/bin/env node
// bin/selftest.mjs - the whole suite.
//
// The harness AWAITS every test (ADR-0021), so `ok` means the assertions settled and
// the failure count includes async failures. A red suite exits non-zero: a failing test
// is a stop-the-line event, and the cwd is printed with it because some tests are
// cwd-sensitive and a red without a cwd is a failure that cannot be localised.

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseFlags, listFiles } from '../lib/core.mjs';
import { runPending, TEST_TIMEOUT } from '../test/harness.mjs';
import { KIT_ROOT } from '../lib/scaffold.mjs';

const { flags, positional } = parseFlags(process.argv.slice(2));
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

const started = Date.now();
for (const file of files) {
  await import(pathToFileURL(path.join(dir, file)).href);
}

const { failures, passed, unsupported, blocking } = await runPending();

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
  } catch { /* a report that cannot be written must not fail the run it reports on */ }
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
  process.stdout.write(`\nA red suite stops work. cwd: ${process.cwd()}\n`);
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
