// The runner's own test, in child processes: the false green must not come back
// unnoticed (ADR-0021).
//
// The old runner was synchronous. A fixture holding one FAILING async test printed `ok`,
// then `all tests passed`, then exited 0. That is the defect these tests pin, with the
// old runner standing beside the new one so the difference is demonstrated, not asserted
// from memory.

import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { test, describe, assert, tempDir, fs, path, KIT_ROOT } from './harness.mjs';

describe('harness');

const HARNESS = pathToFileURL(path.join(KIT_ROOT, 'test', 'harness.mjs')).href;

function runChild(source) {
  const dir = tempDir('research-kit-harness-');
  const file = path.join(dir, 'child.mjs');
  fs.writeFileSync(file, source, 'utf8');
  const result = spawnSync(process.execPath, [file], { encoding: 'utf8', timeout: 30_000 });
  return { status: result.status, stdout: result.stdout ?? '', stderr: result.stderr ?? '' };
}

/** The runner as it used to be: synchronous, catching only a synchronous throw. */
const OLD_RUNNER = `
function runPendingSync(pending, log) {
  let failures = 0;
  for (const entry of pending) {
    try { entry.fn(); log('ok    ' + entry.name); }
    catch (err) { failures += 1; log('FAIL  ' + entry.name); }
  }
  return failures;
}
`;

test('the OLD runner prints ok for a failing async test and exits 0 - the defect', () => {
  const child = runChild(`${OLD_RUNNER}
const pending = [{ name: 'an async test that fails', fn: async () => { throw new Error('boom'); } }];
const failures = runPendingSync(pending, (l) => console.log(l));
console.log(failures ? 'red' : 'all tests passed');
process.exit(0);
`);
  assert.equal(child.status, 0);
  assert.match(child.stdout, /ok {4}an async test that fails/);
  assert.match(child.stdout, /all tests passed/);
});

test('the CURRENT runner awaits it, reports FAIL, and returns a non-zero count', () => {
  const child = runChild(`
import { test, runPending } from ${JSON.stringify(HARNESS)};
test('an async test that fails', async () => { throw new Error('boom'); });
const { failures } = await runPending({ log: (l) => console.log(l) });
console.log('failures=' + failures);
process.exit(failures ? 1 : 0);
`);
  assert.match(child.stdout, /FAIL {2}an async test that fails/);
  assert.match(child.stdout, /failures=1/);
  assert.equal(child.status, 1, 'a red suite must exit non-zero');
});

test('an async assertion that fails after a tick is still caught', () => {
  const child = runChild(`
import { test, runPending, assert } from ${JSON.stringify(HARNESS)};
test('settles late, then fails', async () => {
  await new Promise((r) => setTimeout(r, 25));
  assert.equal(1, 2);
});
const { failures } = await runPending({ log: (l) => console.log(l) });
process.exit(failures ? 1 : 0);
`);
  assert.equal(child.status, 1);
  assert.match(child.stdout, /FAIL {2}settles late, then fails/);
});

test('a test that never settles is killed by the watchdog and attributed', () => {
  const child = runChild(`
process.env.RESEARCH_KIT_TEST_TIMEOUT = '300';
const { test, runPending } = await import(${JSON.stringify(HARNESS)});
test('never settles', () => new Promise(() => {}));
const { failures } = await runPending({ log: (l) => console.log(l) });
console.log('failures=' + failures);
process.exit(failures ? 1 : 0);
`);
  assert.equal(child.status, 1, 'a hung test must not hang the suite printing nothing');
  assert.match(child.stdout, /FAIL {2}never settles/);
  assert.match(child.stdout, /timed out/);
});

test("a timed-out test's late rejection cannot crash the runner afterwards", () => {
  const child = runChild(`
process.env.RESEARCH_KIT_TEST_TIMEOUT = '150';
const { test, runPending } = await import(${JSON.stringify(HARNESS)});
test('rejects long after it was judged', () => new Promise((_, reject) => setTimeout(() => reject(new Error('late')), 400)));
test('a healthy test after it', () => {});
const { failures, passed } = await runPending({ log: (l) => console.log(l) });
await new Promise((r) => setTimeout(r, 500));
console.log('survived failures=' + failures + ' passed=' + passed);
process.exit(0);
`);
  assert.match(child.stdout, /survived failures=1 passed=1/);
  assert.equal(child.status, 0);
});

test('a passing suite still passes, and the count is earned', () => {
  const child = runChild(`
import { test, runPending, assert } from ${JSON.stringify(HARNESS)};
test('sync', () => assert.equal(1, 1));
test('async', async () => { await new Promise((r) => setTimeout(r, 10)); assert.equal(2, 2); });
const { failures, passed } = await runPending({ log: () => {} });
console.log('passed=' + passed + ' failures=' + failures);
process.exit(failures ? 1 : 0);
`);
  assert.equal(child.status, 0);
  assert.match(child.stdout, /passed=2 failures=0/);
});
