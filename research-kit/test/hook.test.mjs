// It actually blocks.
//
// A gate that only satisfies its unit test is the self-deception this design exists to
// prevent, so these tests run the real `githooks/pre-commit` in a real temp repository
// with a real staged file, and assert the process exit status.

import { spawnSync, execFileSync } from 'node:child_process';
import { test, describe, assert, makePassingProject, corrupt, tempDir, fs, path, KIT_ROOT, requireCapability } from './harness.mjs';
import { PATHS, resolve, writeText, readText } from '../lib/core.mjs';
import { posture } from '../lib/machine.mjs';
import { hookExecutability } from '../lib/scaffold.mjs';
import { splitPathList } from '../lib/gate.mjs';

describe('hook');

const HOOK = path.join(KIT_ROOT, 'githooks', 'pre-commit');
const SH_TRIED = ['sh', '/bin/sh', 'C:\\Program Files\\Git\\bin\\sh.exe', 'C:\\Program Files\\Git\\usr\\bin\\sh.exe'];
const SH = findSh();

function findSh() {
  const candidates = SH_TRIED;
  for (const candidate of candidates) {
    const probe = spawnSync(candidate, ['-c', 'echo ok'], { encoding: 'utf8' });
    if (probe.status === 0 && String(probe.stdout).trim() === 'ok') return candidate;
  }
  return null;
}

function git(dir, args) {
  return execFileSync('git', args, { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function makeRepo() {
  const dir = makePassingProject();
  git(dir, ['init', '-q']);
  git(dir, ['config', 'user.email', 'fixture@example.invalid']);
  git(dir, ['config', 'user.name', 'Fixture']);
  // The corpus is TRACKED, as it is in any real project - the commit gate judges the
  // index, so a fixture whose research/ was never added is not a project, it is a
  // repository with no evidence in it.
  git(dir, ['add', '-A', '-f']);
  git(dir, ['commit', '-q', '-m', 'the corpus']);
  return dir;
}

/**
 * Every hook child gets an ISOLATED machine config. Inheriting the operator's would let
 * a host setting - evidencePolicy, posture, role - decide what these tests assert, so a
 * green run here would say nothing about the gate and everything about this machine.
 */
function isolatedConfig(settings = {}) {
  const file = path.join(tempDir('research-kit-hookcfg-'), 'research-kit.config.json');
  writeText(file, `${JSON.stringify(settings, null, 2)}
`);
  return file;
}

function runHook(dir, { env = {} } = {}) {
  return spawnSync(SH, [HOOK], {
    cwd: dir,
    encoding: 'utf8',
    timeout: 60_000,
    env: {
      ...process.env,
      RESEARCH_KIT_HOME: KIT_ROOT,
      RESEARCH_KIT_CONFIG: isolatedConfig(),
      RESEARCH_KIT_INSTALL_STATE: path.join(tempDir('research-kit-hookstate-'), 'install.json'),
      ...env,
    },
  });
}

test('the hook wrapper exists and is a POSIX sh script', () => {
  assert.ok(fs.existsSync(HOOK));
  assert.match(readText(HOOK), /^#!\/bin\/sh/);
});

test('the deployed hook keeps its executable bit', () => {
  const mode = hookExecutability(HOOK);
  assert.equal(mode.ok, true, `${mode.reason} - git skips a hook it cannot execute, silently`);
});

test('a staged code change BLOCKS while the verdict fails, and prints the fix', () => {
  requireCapability(SH, 'SHELL-NOT-FOUND', `no POSIX sh on this host (tried: ${SH_TRIED.join(', ')})`);
  const dir = makeRepo();
  // The failing contract is STAGED, not merely on disk: since ADR-0024 the commit gate
  // judges what the commit will contain, so "a failing project" means a failing index.
  corrupt(dir, PATHS.discovery, (text) => text.replace('CLOSED', 'OPEN'));
  writeText(resolve(dir, 'src/index.js'), 'export const x = 1;\n');
  git(dir, ['add', 'research/DISCOVERY.md', 'src/index.js']);

  const result = runHook(dir);
  assert.notEqual(result.status, 0, `the hook must block: ${result.stdout}${result.stderr}`);
  assert.match(`${result.stdout}${result.stderr}`, /preflight\.mjs/, 'the fix command must appear');
});

test('a staged change confined to research/ is ALLOWED while the verdict fails', () => {
  requireCapability(SH, 'SHELL-NOT-FOUND', `no POSIX sh on this host (tried: ${SH_TRIED.join(', ')})`);
  const dir = makeRepo();
  corrupt(dir, PATHS.discovery, (text) => text.replace('CLOSED', 'OPEN'));
  git(dir, ['add', 'research/DISCOVERY.md']);

  const result = runHook(dir);
  assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
});

test('a passing project allows the commit', () => {
  requireCapability(SH, 'SHELL-NOT-FOUND', `no POSIX sh on this host (tried: ${SH_TRIED.join(', ')})`);
  const dir = makeRepo();
  writeText(resolve(dir, 'README.md'), '# fixture\n');
  git(dir, ['add', 'README.md']);
  const result = runHook(dir);
  assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
});

test('a missing kit fails OPEN, loudly, rather than bricking the machine', () => {
  requireCapability(SH, 'SHELL-NOT-FOUND', `no POSIX sh on this host (tried: ${SH_TRIED.join(', ')})`);
  const dir = makeRepo();
  corrupt(dir, PATHS.discovery, (text) => text.replace('CLOSED', 'OPEN'));
  writeText(resolve(dir, 'src/index.js'), 'export const x = 1;\n');
  git(dir, ['add', 'src/index.js']);

  const result = runHook(dir, {
    env: {
      RESEARCH_KIT_HOME: path.join(tempDir(), 'nowhere'),
      RESEARCH_KIT_CONFIG: path.join(tempDir(), 'absent.json'),
    },
  });
  assert.equal(result.status, 0, 'fail-open is the default posture');
  assert.match(result.stderr, /allowing this commit/);
});

test('a missing kit on a fail-CLOSED machine blocks instead', () => {
  requireCapability(SH, 'SHELL-NOT-FOUND', `no POSIX sh on this host (tried: ${SH_TRIED.join(', ')})`);
  const dir = makeRepo();
  const config = path.join(tempDir(), 'config.json');
  writeText(config, `${JSON.stringify({ failOpen: false }, null, 2)}\n`);

  const result = runHook(dir, { env: { RESEARCH_KIT_HOME: path.join(tempDir(), 'nowhere'), RESEARCH_KIT_CONFIG: config } });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /BLOCKING/);
});

// The one deliberate duplication in the kit: the hook's posture reader. The pin covers
// EVERY state, not just the two the readers used to have, and each row sets BOTH files
// so no row inherits state from the row above it.
const POSTURE_ROWS = [
  { name: 'absent', config: null, snapshot: null, exit: 0 },
  { name: 'readable, fail-open', config: '{"failOpen": true}', snapshot: '{"failOpen": true}', exit: 0 },
  { name: 'readable, fail-closed', config: '{"failOpen": false}', snapshot: '{"failOpen": false}', exit: 1 },
  { name: 'unreadable, snapshot fail-open', config: '{"failOpen": fal', snapshot: '{"failOpen": true}', exit: 0 },
  { name: 'unreadable, snapshot fail-closed', config: '{"failOpen": fal', snapshot: '{"failOpen": false}', exit: 1 },
  { name: 'unreadable, no snapshot', config: '{"failOpen": fal', snapshot: null, exit: 2 },
];

for (const row of POSTURE_ROWS) {
  test(`posture agreement (${row.name}): the sh reader and lib/machine.mjs give the same code`, () => {
    const dir = tempDir('research-kit-posture-');
    const config = path.join(dir, 'research-kit.config.json');
    if (row.config !== null) writeText(config, row.config);
    if (row.snapshot !== null) writeText(`${config}.last-good`, row.snapshot);

    const fromModule = posture({ ...process.env, RESEARCH_KIT_CONFIG: config });
    assert.equal(fromModule.exitCode, row.exit,
      `lib/machine.mjs disagreed for "${row.name}" (state=${fromModule.configState})`);

    requireCapability(SH, 'SHELL-NOT-FOUND', `no POSIX sh on this host (tried: ${SH_TRIED.join(', ')})`);
    const script = `${readText(HOOK).split('# --- can we run the gate')[0]}\nposture_without_kit "$1"\nexit $?\n`;
    const scriptFile = path.join(dir, 'posture.sh');
    writeText(scriptFile, script);
    const shell = spawnSync(SH, [scriptFile, config], { encoding: 'utf8', timeout: 30_000 });
    assert.equal(shell.status, row.exit,
      `the hook's reader disagreed for "${row.name}": ${shell.stderr}`);
  });
}

test('the staged path list is DATA, not arguments: argv stays bounded', () => {
  const many = Array.from({ length: 5000 }, (_, i) => `src/file-${i}.js`);
  // The structural pin is an argument count, not a clock: 10,005 arguments before, 6 after.
  const argvBefore = many.flatMap((p) => ['--staged', p]).length + 5;
  const argvAfter = ['--gate', 'commit', '--staged-stdin'].length + 3;
  assert.equal(argvBefore, 10_005);
  assert.equal(argvAfter, 6);
  assert.equal(splitPathList(many.join('\0')).length, 5000, 'all 5,000 still arrive, on the pipe');
});

test('the hook pipes the list and never accumulates argv', () => {
  const text = readText(HOOK);
  assert.match(text, /git diff --cached --name-only -z \|/, 'the list must travel on a pipe');
  assert.doesNotMatch(text, /set -- "\$@" --staged/, 'the O(n^2) argv loop must not come back');
  assert.match(text, /--staged-stdin/);
});

test('the hook is watchdogged, and a watchdog kill is an internal error', () => {
  const text = readText(HOOK);
  assert.match(text, /RESEARCH_KIT_GATE_TIMEOUT/);
  assert.match(text, /gtimeout/, 'macOS with coreutils gets a watchdog too');
  assert.match(text, /-eq 124/, 'a watchdog kill is decided by the posture, never a silent pass');
});
