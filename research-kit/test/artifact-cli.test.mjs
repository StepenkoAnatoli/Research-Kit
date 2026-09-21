// The CLI, run as a process, because the exit code IS the interface.
//
// Every other test in this area imports a function and reads a return value. A caller in
// a workflow reads `$?` and stdout, and those are produced by argument parsing, flag
// handling and `process.exit` - none of which the library tests exercise. A validator
// that returns FAIL and a CLI that exits 0 anyway is a green suite and a broken gate.

import { spawnSync } from 'node:child_process';
import { test, describe, assert, fs, path, os, cleanup, KIT_ROOT } from './harness.mjs';
import { sha256 } from '../lib/core.mjs';
import { createArtifact } from '../lib/artifact.mjs';
import { collectedProject, approvedProject, seal, basePackage, IDENTITY } from './artifact-fixtures.mjs';

describe('artifact-cli');

const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'rk-cli-'));
const CLI = path.join(KIT_ROOT, 'bin', 'artifact.mjs');

function run(args, options = {}) {
  const result = spawnSync(process.execPath, [CLI, ...args], {
    encoding: 'utf8', timeout: 60_000, windowsHide: true, ...options,
  });
  return { code: result.status, out: String(result.stdout ?? ''), err: String(result.stderr ?? '') };
}

function packageTo(name, root, overrides = {}) {
  const built = createArtifact({ root, ...IDENTITY, ...overrides });
  const file = path.join(scratch, `${name}.zip`);
  fs.writeFileSync(file, built.bytes);
  return { file, built };
}

// ---------------------------------------------------------------- exit codes

test('a valid collected package exits 0 and says building is NOT authorized', () => {
  const { file } = packageTo('collected', collectedProject(), { clientRef: 'job-a' });
  const r = run(['validate', '--file', file]);
  assert.equal(r.code, 0, `expected exit 0, got ${r.code}\n${r.out}${r.err}`);
  assert.ok(/PASS/.test(r.out), r.out);
  assert.ok(/NOT authorized/.test(r.out), 'the verdict line must say building is not authorized');
  assert.ok(/does NOT authorize building/.test(r.out),
    'exit 0 on a collected corpus is the most misreadable result this tool produces, so it says so in words');
});

test('a valid approved package exits 0 and says building IS authorized', () => {
  const { file } = packageTo('approved', approvedProject(), { clientRef: 'job-b' });
  const r = run(['validate', '--file', file]);
  assert.equal(r.code, 0, `${r.out}${r.err}`);
  assert.ok(/build AUTHORIZED/.test(r.out), r.out);
});

test('an invalid package exits 1', () => {
  const { payload, manifest } = basePackage(collectedProject());
  const broken = seal(payload, manifest, { breakDigest: true });
  const file = path.join(scratch, 'broken.zip');
  fs.writeFileSync(file, broken);
  const r = run(['validate', '--file', file]);
  assert.equal(r.code, 1, `expected exit 1, got ${r.code}\n${r.out}`);
  assert.ok(/MANIFEST-HASH-MISMATCH/.test(r.out), r.out);
});

test('an unsupported format major exits 2, not 1', () => {
  const { payload, manifest } = basePackage(collectedProject());
  const future = seal(payload, { ...manifest, formatVersion: '2.0.0' });
  const file = path.join(scratch, 'future.zip');
  fs.writeFileSync(file, future);
  const r = run(['validate', '--file', file]);
  assert.equal(r.code, 2, `a newer package is incomplete here, not invalid: got ${r.code}\n${r.out}`);
});

test('a missing file exits 3 - blocked, because no verdict was reached', () => {
  const r = run(['validate', '--file', path.join(scratch, 'nope.zip')]);
  assert.equal(r.code, 3, `${r.out}${r.err}`);
});

// ---------------------------------------------------------------- arguments

test('no command, and a command missing its arguments, print help', () => {
  const bare = run([]);
  assert.ok(/artifact - the portable Research-Kit package/.test(bare.out), bare.out);
  assert.equal(bare.code, 2);

  const noFile = run(['validate']);
  assert.equal(noFile.code, 3);
  assert.ok(/needs --file/.test(noFile.err), noFile.err);

  const noIdentity = run(['create', '--root', '.']);
  assert.equal(noIdentity.code, 3);
  assert.ok(/--repository/.test(noIdentity.err), noIdentity.err);
});

test('--expect-client-ref accepts the matching job and refuses another', () => {
  const { file } = packageTo('correlated', collectedProject(), { clientRef: 'job-c' });
  assert.equal(run(['validate', '--file', file, '--expect-client-ref', 'job-c']).code, 0);

  const wrong = run(['validate', '--file', file, '--expect-client-ref', 'job-d']);
  assert.equal(wrong.code, 1);
  assert.ok(/CLIENT-REF-MISMATCH/.test(wrong.out), wrong.out);
});

test('--build-authorized is REFUSED, not ignored, and says why', () => {
  // Ignoring it was safe and misleading: exit 0 plus a package back is every reason for
  // an integrator to believe the option was understood and honoured. It was not. The
  // refusal removes the wrong belief at the moment it forms.
  const out = path.join(scratch, 'forged.zip');
  const r = run(['create', '--root', collectedProject(), '--output', out,
    '--repository', 'o/r', '--ref', 'main', '--commit', '0'.repeat(40),
    '--workflow', 'w.yml', '--run-id', '7', '--build-authorized', 'true']);

  assert.equal(r.code, 3, `expected a refusal, got exit ${r.code}\n${r.out}${r.err}`);
  assert.ok(/unknown option --build-authorized/.test(r.err), r.err);
  assert.ok(/Authorization is derived from the project and cannot be supplied/.test(r.err),
    'the message must say WHY, not only that the spelling is unknown - there is no correct spelling to hunt for');
  assert.ok(!fs.existsSync(out), 'nothing should be written when the arguments are refused');
});

test('every authorization-shaped flag is refused by name', () => {
  for (const flag of ['--build-authorized', '--authorize', '--approved', '--state', '--gate-verdict', '--force-approve']) {
    const r = run(['create', '--root', collectedProject(), '--output', path.join(scratch, 'never.zip'),
      '--repository', 'o/r', '--ref', 'main', '--commit', '0'.repeat(40),
      '--workflow', 'w.yml', '--run-id', '7', flag, 'x']);
    assert.equal(r.code, 3, `${flag} should be refused, got exit ${r.code}`);
    assert.ok(/Authorization is derived/.test(r.err), `${flag} should be refused with the reason: ${r.err}`);
  }
});

test('an ordinary typo is refused too, without the authorization sentence', () => {
  const r = run(['validate', '--file', 'x.zip', '--jsonn']);
  assert.equal(r.code, 3);
  assert.ok(/unknown option --jsonn/.test(r.err), r.err);
  assert.ok(!/Authorization is derived/.test(r.err),
    'a misspelled --json is not an authorization attempt and should not be told about one');
});

test('a package still cannot claim authorization it did not earn', () => {
  // The property the refused flag used to prove, asserted where it belongs: through the
  // supported path, on a corpus that has not been reviewed.
  const out = path.join(scratch, 'unforged.zip');
  const r = run(['create', '--root', collectedProject(), '--output', out,
    '--repository', 'o/r', '--ref', 'main', '--commit', '0'.repeat(40),
    '--workflow', 'w.yml', '--run-id', '7']);
  assert.equal(r.code, 0, `${r.out}${r.err}`);
  assert.ok(/NOT authorized/.test(r.out), r.out);
  assert.equal(JSON.parse(run(['validate', '--file', out, '--json']).out).buildAuthorized, false);
});

test('an invalid --client-ref is refused before anything is written', () => {
  const out = path.join(scratch, 'never-written.zip');
  const r = run(['create', '--root', collectedProject(), '--output', out,
    '--repository', 'o/r', '--ref', 'main', '--commit', '0'.repeat(40),
    '--workflow', 'w.yml', '--run-id', '7', '--client-ref', 'has space']);
  assert.equal(r.code, 3);
  assert.ok(/refusing rather than rewriting/.test(r.err), r.err);
  assert.ok(!fs.existsSync(out), 'nothing should be written when the arguments are refused');
});

// ---------------------------------------------------------------- output shape

test('--json is deterministic, parseable, and carries the fields a consumer reads', () => {
  const { file } = packageTo('json-shape', approvedProject(), { clientRef: 'job-e' });
  const a = run(['validate', '--file', file, '--json']);
  const b = run(['validate', '--file', file, '--json']);
  assert.equal(a.out, b.out, 'two runs over the same package must produce identical JSON');

  const parsed = JSON.parse(a.out);
  for (const key of ['status', 'buildAuthorized', 'packageId', 'clientRef', 'state', 'errors', 'warnings', 'workflowRunId']) {
    assert.ok(key in parsed, `--json is missing ${key}`);
  }
  assert.equal(parsed.status, 'PASS');
  assert.equal(parsed.buildAuthorized, true);
  assert.equal(parsed.workflowRunId, IDENTITY.workflowRunId);
});

test('--quiet prints the verdict line and nothing else', () => {
  const { file } = packageTo('quiet', collectedProject());
  const r = run(['validate', '--file', file, '--quiet']);
  assert.equal(r.code, 0);
  const lines = r.out.split('\n').filter((l) => l.trim());
  assert.equal(lines.length, 1, `--quiet printed ${lines.length} lines:\n${r.out}`);
  assert.ok(/^PASS\s+build NOT authorized/.test(lines[0]), lines[0]);
});

// ---------------------------------------------------------------- create

test('create writes a package, re-validates it, and says so', () => {
  const out = path.join(scratch, 'created.zip');
  const r = run(['create', '--root', approvedProject(), '--output', out, '--client-ref', 'job-f',
    '--repository', 'example-org/example-project', '--ref', 'main',
    '--commit', '0123456789abcdef0123456789abcdef01234567',
    '--workflow', 'start-research.yml', '--run-id', '35548135379']);
  assert.equal(r.code, 0, `${r.out}${r.err}`);
  assert.ok(fs.existsSync(out));
  assert.ok(/re-validated after writing: PASS/.test(r.out),
    'a producer that reports success from its own intentions has tested nothing');
  assert.ok(/state APPROVED_BRIEF/.test(r.out), r.out);

  assert.equal(run(['validate', '--file', out]).code, 0);
});

test('create leaves the source artifact of a previous run untouched', () => {
  const { file } = packageTo('untouched', approvedProject());
  const before = sha256(fs.readFileSync(file));
  run(['validate', '--file', file]);
  run(['validate', '--file', file, '--json']);
  assert.equal(sha256(fs.readFileSync(file)), before);
});

test('an unknown command exits 3 and prints help', () => {
  const r = run(['frobnicate']);
  assert.equal(r.code, 3);
  assert.ok(/unknown command/.test(r.err), r.err);
  assert.ok(/artifact - the portable/.test(r.out), r.out);
});

test('the scratch directory is removed', () => {
  cleanup(scratch);
  assert.ok(!fs.existsSync(scratch));
});
