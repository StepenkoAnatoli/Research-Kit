#!/usr/bin/env node
// bin/selftest.mjs - the whole suite.
//
// The harness AWAITS every test (ADR-0021), so `ok` means the assertions settled and
// the failure count includes async failures. A red suite exits non-zero: a failing test
// is a stop-the-line event, and the cwd is printed with it because some tests are
// cwd-sensitive and a red without a cwd is a failure that cannot be localised.

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
const seconds = ((Date.now() - started) / 1000).toFixed(1);

process.stdout.write(`\n${passed} passed, ${failures} failed${unsupported.length ? `, ${unsupported.length} unsupported` : ''} in ${seconds}s (watchdog ${TEST_TIMEOUT}ms/test)\n`);

if (unsupported.length) {
  // A host that cannot provide a required capability is not falsely green: the report
  // says exactly which capability, and why, and it blocks.
  process.stdout.write('\nThis host could not run:\n');
  for (const entry of unsupported) process.stdout.write(`  ${entry.code}  ${entry.label}\n    ${entry.reason}\n`);
}
if (blocking) {
  process.stdout.write(`\nA red suite stops work. cwd: ${process.cwd()}\n`);
  process.exit(1);
}
process.stdout.write('all tests passed\n');
process.exit(0);
