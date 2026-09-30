// A report bigger than a pipe must arrive whole.
//
// Found 2026-09-30 (break-test). On POSIX, Node writes to a pipe asynchronously: the kernel
// takes the first 64 KiB, the rest waits in the process until the reader makes room, and
// `process.exit()` discards whatever is still waiting. Every report this kit prints ends in an
// exit whose CODE carries the verdict, so a reader slower than the writer - a pager, a CI log
// shipper, an agent's tool runner, `| jq` - received the first 65,536 bytes of a larger report,
// no error, and the exit status of a command that had succeeded:
//
//   - `evidence-context --all --json` (88 KB on this repository's own corpus) was truncated
//     4 times in 10 for a FAST reader, and every time for a slow one: unparseable JSON, exit 0.
//   - `preflight`'s text report prints its verdict block LAST, so over a damaged corpus the
//     line that says FAIL / "Do not start building" was the part that went missing.
//   - `audit --show`, the "pasteable snapshot", pasted the first 64 KiB of a larger audit.
//   - `selftest` lost its `N passed, M failed` line the same way.
//
// Windows makes stdout pipes blocking, so the Windows leg of CI could never have seen it, and
// every test here that spawns a command reads it with `spawnSync`, which reads as fast as the
// child writes. A slow reader is the thing nothing was: these tests put a process on the far
// end of the pipe that does not look at its stdin for 700 ms - longer than any of these
// commands needs to finish - and only then reads.

import { spawn, spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { test, describe, assert, tempDir, fs, path, KIT_ROOT, makeProject } from './harness.mjs';
import { writeRaw } from '../lib/collect.mjs';
import { appendFetch } from '../lib/provenance.mjs';
import { PATHS, resolve, writeText, today, sha256File } from '../lib/core.mjs';
import { writeAudit } from '../lib/audit.mjs';

describe('stdout-flush');

/** One pipe's capacity on Linux. A report over this is what the defect cut short. */
const PIPE = 65_536;
const STALL_MS = 700;

/** A corpus big enough that every report below is well over a pipe. Built once, read-only. */
let built;
function bigProjects() {
  if (built) return built;
  const N = 400;
  const date = today();
  const valid = tempDir('rk-flush-valid-');
  makeProject(valid, { content: true });
  const unknowns = [];
  const evidence = [];
  const sources = [];
  for (let i = 1; i <= N; i += 1) {
    const finding = `Service ${i} allows ${i * 7} requests per minute under plan ${i % 5}. ${'The plan also covers burst traffic, regional failover and a support window stated in full. '.repeat(4)}`;
    const entry = writeRaw(valid, {
      url: `https://example${i % 40}.invalid/docs/page-${i}`,
      title: `Page ${i}`,
      markdown: `# Page ${i}\n\n${finding} ${'Filler sentence about limits and quotas. '.repeat(40)}\n`,
      cmd: `firecrawl scrape https://example${i % 40}.invalid/docs/page-${i} --only-main-content --json`,
      statusCode: 200, transport: 'firecrawl-cli', completeness: 'full',
    }, { date });
    appendFetch(valid, {
      op: 'scrape', url: entry.url, type: 'P', raw: entry.file,
      bodySha256: sha256File(path.join(valid, ...entry.file.split('/'))),
      transport: 'firecrawl-cli', completeness: 'full', cmd: entry.command, at: `${date}T00:00:00.000Z`,
    });
    const id = String(i).padStart(3, '0');
    unknowns.push(`| U-${i} | What does service ${i} allow? | Sets budget ${i} | CLOSED | E-${id}: ${finding} |`);
    evidence.push(`| E-${id} | ${date} | P | ${entry.url} | ${finding} | ${entry.file} |`);
    sources.push(`| ${entry.url} | P | Page ${i} | ${date} | U-${i} |`);
  }
  writeText(resolve(valid, PATHS.discovery), `# Discovery Contract - Big fixture\n\n## Build intent\n\nA large fixture.\n\n## Unknowns\n\n| ID | Unknown | Why it blocks the build | Status | Evidence |\n|---|---|---|---|---|\n${unknowns.join('\n')}\n`);
  writeText(resolve(valid, PATHS.evidence), `# Evidence\n\n| ID | Retrieved | Type | URL | Finding | Raw |\n|---|---|---|---|---|---|\n${evidence.join('\n')}\n`);
  writeText(resolve(valid, PATHS.sources), `# Sources\n\n| URL | Type | Title | Retrieved | Used for |\n|---|---|---|---|---|\n${sources.join('\n')}\n`);
  writeText(resolve(valid, PATHS.map), `# MAP - topic decomposition\n\n## Topic\n\nBig fixture topic\n\n## Subtopics\n\n| ID | Subtopic | Why it matters | Status | Covered by |\n|---|---|---|---|---|\n| D-1 | Access model | Decides the design | COVERED | U-1 |\n| D-2 | Auth and credentials | Who holds the key | COVERED | U-2 |\n| D-3 | Rate limits and quotas | Caps every cadence | COVERED | U-3 |\n| D-4 | ToS, licensing, legality of the intended use | A prohibition ends the design | DISMISSED | public docs, personal research, no redistribution |\n| D-5 | Data schema and its stability | Shape drift | DISMISSED | captures are frozen point-in-time; there is no extraction layer |\n| D-6 | Freshness and staleness | What staleness costs | DISMISSED | handled structurally by retrieval dates and --refresh-days |\n| D-7 | Cost at expected volume | Decides viability | COVERED | U-4 |\n| D-8 | Runtime and platform limits | Where this executes | DISMISSED | one runtime, one machine, fixed by the fixture |\n| D-9 | Output obtainability | Load-bearing | COVERED | U-5 |\n`);

  // The audit is written by the kit, so its bytes are the kit's; it needs the gate to pass.
  const written = writeAudit(valid);
  assert.ok(written.written, `the fixture could not render its audit, so the audit case proves nothing: ${written.reason}`);

  // The same corpus as it looks when it did not arrive whole: the ledger is there, the
  // captures are not. Every row then reports its own finding.
  const damaged = tempDir('rk-flush-damaged-');
  fs.cpSync(valid, damaged, { recursive: true });
  for (const name of fs.readdirSync(path.join(damaged, 'research', 'raw'))) {
    if (name.endsWith('.md')) fs.rmSync(path.join(damaged, 'research', 'raw', name));
  }
  built = { valid, damaged, slug: written.slug };
  return built;
}

/** What the command prints when its stdout is a FILE: always complete, the reference. */
function toFile(dir, script, args) {
  const out = path.join(tempDir('rk-flush-ref-'), 'stdout.txt');
  const fd = fs.openSync(out, 'w');
  let status;
  try {
    status = spawnSync(process.execPath, [path.join(KIT_ROOT, 'bin', script), ...args], {
      cwd: dir, stdio: ['ignore', fd, 'ignore'], timeout: 120_000, windowsHide: true,
    }).status;
  } finally { fs.closeSync(fd); }
  return { status, stdout: fs.readFileSync(out) };
}

/**
 * What a slow reader gets: a pipe whose far end is a process that does not look at its stdin
 * until `stallMs` has gone by.
 *
 * A real reader process, because the parent's own `child.stdout` is not slow: Node reads a
 * child's stdout eagerly into its own 64 KiB buffer, so a report of 70-180 KB fits in the
 * kernel pipe plus that buffer, the child exits cleanly, and a test built on it detects nothing.
 */
function throughSlowPipe(argv, cwd, { stallMs = STALL_MS } = {}) {
  return new Promise((resolvePromise, reject) => {
    const reader = spawn(process.execPath, ['-e', `setTimeout(() => process.stdin.pipe(process.stdout), ${stallMs})`],
      { stdio: ['pipe', 'pipe', 'ignore'], windowsHide: true });
    const out = [];
    reader.stdout.on('data', (chunk) => out.push(chunk));
    const writer = spawn(process.execPath, argv, { cwd, stdio: ['ignore', reader.stdin, 'pipe'], windowsHide: true });
    // The writer holds its own copy of the pipe now. Letting go of ours is what lets the
    // reader see the end of the stream when the WRITER exits, and not before. `destroy`, not
    // `end`: on POSIX this is a socketpair, and `end` shuts the socket down for every holder -
    // the writer's first byte would be an EPIPE.
    reader.stdin.destroy();
    const err = [];
    writer.stderr.on('data', (chunk) => err.push(chunk));
    const killer = setTimeout(() => { writer.kill('SIGKILL'); reader.kill('SIGKILL'); }, 60_000);
    let status;
    let waiting = 2;
    const finish = () => {
      if (--waiting) return;
      clearTimeout(killer);
      resolvePromise({ status, stdout: Buffer.concat(out), stderr: Buffer.concat(err).toString('utf8') });
    };
    writer.on('error', (e) => { clearTimeout(killer); reject(e); });
    reader.on('error', (e) => { clearTimeout(killer); reject(e); });
    writer.on('close', (code) => { status = code; finish(); });
    reader.on('close', finish);
  });
}

const CASES = [
  // [where, script, args, what a reader loses without the fix]
  ['valid', 'evidence-context.mjs', ['--all', '--json'], 'the JSON stops mid-string'],
  ['valid', 'evidence-context.mjs', ['--all'], 'the later unknowns are missing'],
  ['valid', 'audit.mjs', ['--show', null], 'the pasted snapshot is cut'],
  ['damaged', 'preflight.mjs', [], 'the verdict block, printed last, is the part that goes'],
  ['damaged', 'preflight.mjs', ['--json'], 'the JSON stops mid-string'],
  ['damaged', 'doctor.mjs', [], 'the READY / blocker line, printed last, goes'],
  ['damaged', 'handoff.mjs', ['--json'], 'the JSON stops mid-string'],
  ['damaged', 'handoff.mjs', [], 'the remedy, printed last, goes'],
];

/**
 * How much this host's pipe lets through when a command writes far more than it holds and
 * exits at once - the defect, reproduced on purpose. A socketpair holds ~146 KB on the Linux
 * this was written on and a FIFO 64 KiB, so the size a report must exceed to prove anything
 * is measured here, not assumed.
 */
async function pipeCapacity() {
  const { stdout } = await throughSlowPipe(['-e', "process.stdout.write('x'.repeat(4e6)); process.exit(0)"], tempDir('rk-flush-cap-'));
  return stdout.length;
}

test('a report larger than a pipe arrives whole at a slow reader, with the command\'s own exit status', async () => {
  const { valid, damaged, slug } = bigProjects();
  const capacity = await pipeCapacity();
  const argsOf = (args) => args.map((a) => (a === null ? slug : a));
  const slow = await Promise.all(CASES.map(([where, script, args]) =>
    throughSlowPipe([path.join(KIT_ROOT, 'bin', script), ...argsOf(args)], where === 'valid' ? valid : damaged)));

  const problems = [];
  let proven = 0;
  CASES.forEach(([where, script, args, loses], i) => {
    const resolved = argsOf(args);
    const label = `${script} ${resolved.join(' ')}`.trim();
    const reference = toFile(where === 'valid' ? valid : damaged, script, resolved);
    // A report this pipe can hold whole proves nothing on this host; it is not a failure.
    if (reference.stdout.length <= capacity + 1024) return;
    proven += 1;
    if (slow[i].status !== reference.status) {
      problems.push(`${label}: exited ${slow[i].status} through a pipe and ${reference.status} to a file`);
    }
    if (!slow[i].stdout.equals(reference.stdout)) {
      problems.push(`${label}: a slow reader got ${slow[i].stdout.length} of ${reference.stdout.length} bytes (${loses})`);
    }
  });
  assert.deepEqual(problems, [], `output was cut by process.exit() while it was still queued for a pipe:\n  ${problems.join('\n  ')}`);
  assert.ok(capacity > 16_384, `the pipe-capacity canary let ${capacity} bytes through - the slow reader is not reading slowly, it is not reading`);
  assert.ok(proven >= 4, `only ${proven} of ${CASES.length} reports exceed this host's pipe (${capacity} bytes), so the test proves too little - make the fixture corpus bigger`);
});

// -------------------------------------------------------------- the helper, on its own

/**
 * A throwaway command that prints 300 KB and ends with `exitAfterFlush`: as 3,000 small writes
 * (what a suite prints) or as one (what a report printed at the end is). Its mode and exit
 * code are arguments, so the script itself is plain source.
 */
function fixture() {
  const file = path.join(tempDir('rk-flush-fixture-'), 'report.mjs');
  fs.writeFileSync(file, `import { exitAfterFlush } from ${JSON.stringify(pathToFileURL(path.join(KIT_ROOT, 'lib', 'core.mjs')).href)};
const [, , mode, code] = process.argv;
const line = (i) => 'line ' + String(i).padStart(5, '0') + ' ' + 'x'.repeat(90) + '\\n';
if (mode === 'single') process.stdout.write(Array.from({ length: 3000 }, (_, i) => line(i)).join(''));
else for (let i = 0; i < 3000; i += 1) process.stdout.write(line(i));
process.stderr.write('diagnostic on stderr\\n');
await exitAfterFlush(Number(code));
process.stdout.write('UNREACHABLE: the process should have exited\\n');
`);
  return file;
}

test('exitAfterFlush delivers every line to a slow reader, then exits with the code it was given', async () => {
  const file = fixture();
  const runs = ['many', 'single'].flatMap((mode) => [0, 1, 3].map((code) => ({ mode, code })));
  const results = await Promise.all(runs.map(({ mode, code }) => throughSlowPipe([file, mode, String(code)], tempDir('rk-flush-cwd-'))));
  runs.forEach(({ mode, code }, i) => {
    const result = results[i];
    const lines = result.stdout.toString('utf8').split('\n').filter(Boolean);
    const what = `${mode} writes, exit ${code}`;
    assert.equal(lines.length, 3000, `${what}: the reader got ${lines.length} of 3000 lines`);
    assert.match(lines.at(-1), /^line 02999 /, `${what}: the last line the reader got was "${lines.at(-1)?.slice(0, 20)}"`);
    assert.equal(result.status, code, `${what}: the process exited ${result.status}`);
    assert.ok(!lines.some((l) => l.startsWith('UNREACHABLE')), `${what}: code after exitAfterFlush ran`);
    assert.match(result.stderr, /diagnostic on stderr/, `${what}: stderr was not flushed either`);
  });
});

test('exitAfterFlush does not turn a reader that leaves into a crash or a hang', async () => {
  const child = spawn(process.execPath, [fixture(), 'single', '0'], { cwd: tempDir('rk-flush-cwd-'), stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
  const err = [];
  child.stderr.on('data', (chunk) => err.push(chunk));
  const closed = new Promise((done, reject) => {
    const timer = setTimeout(() => { child.kill('SIGKILL'); reject(new Error('the command hung after its reader left')); }, 30_000);
    child.on('close', (s) => { clearTimeout(timer); done(s); });
  });
  // Take the first chunk, then go away: the reader of `| head -c 100`. A command that dies
  // before printing anything ends the wait as well, so a broken fixture fails here by name.
  await Promise.race([new Promise((done) => child.stdout.once('data', () => { child.stdout.destroy(); done(); })), closed]);
  const status = await closed;
  const said = Buffer.concat(err).toString('utf8');
  assert.doesNotMatch(said, /EPIPE|Unhandled|node:events|node:internal/, `a reader leaving reached the command as a crash:\n${said.slice(0, 600)}`);
  assert.equal(status, 0, `a report whose reader left must still exit with its own status, got ${status}`);
});

// selftest prints 116 KB and ends in process.exit: its verdict was the first thing a slow
// reader lost. It cannot be run inside itself (it would run this file again, and again), so
// what is checked is where its exits go.
test('selftest leaves through exitAfterFlush, so its verdict is not the part a slow reader loses', () => {
  const source = fs.readFileSync(path.join(KIT_ROOT, 'bin', 'selftest.mjs'), 'utf8');
  const summary = source.indexOf('passed, ${failures} failed');
  assert.ok(summary !== -1, 'selftest.mjs no longer prints its summary line where this test looks for it');
  const after = source.slice(summary);
  assert.doesNotMatch(after, /\bprocess\.exit\((?:0|1)\)/, 'selftest exits with process.exit() after its summary - a slow reader loses the verdict');
  assert.ok((after.match(/await exitAfterFlush\(/g) ?? []).length >= 2, "selftest's red and green exits should both be `await exitAfterFlush(...)`");
});
