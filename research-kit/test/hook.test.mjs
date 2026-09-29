// It actually blocks.
//
// A gate that only satisfies its unit test is the self-deception this design exists to
// prevent, so these tests run the real `githooks/pre-commit` in a real temp repository
// with a real staged file, and assert the process exit status.

import { spawnSync, execFileSync } from 'node:child_process';
import { test, describe, assert, makePassingProject, corrupt, tempDir, fs, path, KIT_ROOT, requireCapability, requireGit, fixtureCommitArgs } from './harness.mjs';
import { PATHS, resolve, writeText, readText } from '../lib/core.mjs';
import { posture } from '../lib/machine.mjs';
import { hookExecutability, scaffoldProject } from '../lib/scaffold.mjs';
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
  requireGit('the commit gate over a staged index');
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
  git(dir, fixtureCommitArgs('the corpus'));
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

test('a tampered capture is BLOCKED by the real hook even when nothing outside research/ is staged', () => {
  // The break-test repro (PR #140 item 1, 2026-09-29), through the real hook and a real index:
  // appending a typed line to a tracked capture was allowed alone and blocked only beside code.
  requireCapability(SH, 'SHELL-NOT-FOUND', `no POSIX sh on this host (tried: ${SH_TRIED.join(', ')})`);
  const dir = makeRepo();
  const capture = fs.readdirSync(resolve(dir, PATHS.raw)).find((f) => f.endsWith('.md'));
  const rel = `${PATHS.raw}/${capture}`;
  corrupt(dir, rel, (t) => `${t}\nA line typed after the fetch.\n`);
  git(dir, ['add', rel]);

  const result = runHook(dir);
  assert.notEqual(result.status, 0, `a tampered capture was committed: ${result.stdout}${result.stderr}`);
  assert.match(`${result.stdout}${result.stderr}`, /body-unmodified/);
});

test('a fresh project\'s first commit - scaffold and corpus together - is ALLOWED while the verdict fails', () => {
  requireCapability(SH, 'SHELL-NOT-FOUND', `no POSIX sh on this host (tried: ${SH_TRIED.join(', ')})`);
  const dir = tempDir('rk-fresh-');
  git(dir, ['init', '-q']);
  git(dir, ['config', 'user.email', 'fixture@example.invalid']);
  git(dir, ['config', 'user.name', 'Fixture']);
  scaffoldProject(dir, { topic: 'Anything', kit: KIT_ROOT });
  git(dir, ['add', '-A', '-f']);
  const first = runHook(dir);
  assert.equal(first.status, 0, `the first commit of a new project was refused: ${first.stdout}${first.stderr}`);

  // A design written into the map is phase 2, and stays blocked.
  const map = resolve(dir, PATHS.architecture);
  writeText(map, readText(map).replace('| _module_ | _the one concept it is responsible for_ | _ADR or decision_ |', '| src/app.js | the app | ADR-0001 |'));
  git(dir, ['add', PATHS.architecture]);
  const designed = runHook(dir);
  assert.notEqual(designed.status, 0, `a design committed before the gate passes: ${designed.stdout}`);
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
  // Windows Notepad saves UTF-8 with a byte-order mark. Both readers take it as the config it
  // is, rather than as an unreadable one that fails closed (found 2026-09-27).
  { name: 'BOM, fail-open', config: '\uFEFF{"failOpen": true}', snapshot: null, exit: 0 },
  { name: 'BOM, fail-closed', config: '\uFEFF{"failOpen": false}', snapshot: null, exit: 1 },
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

// Found 2026-09-27 (break-test): with HOME unset - a cron job, a systemd unit, some CI
// agents - the hook's `set -u` stopped on `$HOME/.agents/...` with "HOME: parameter not
// set" and exit 2, so EVERY commit was refused by a shell error instead of judged or let
// through loudly. The hook now takes the home directory from node, as lib/machine.mjs does.
test('a commit with HOME unset is judged, not refused by a shell error', () => {
  requireCapability(SH, 'SHELL-NOT-FOUND', `no POSIX sh on this host (tried: ${SH_TRIED.join(', ')})`);
  const dir = tempDir('rk-nohome-');
  git(dir, ['init', '-q']);
  const env = { ...process.env, RESEARCH_KIT_CONFIG: isolatedConfig(),
    RESEARCH_KIT_INSTALL_STATE: path.join(tempDir('research-kit-hookstate-'), 'install.json') };
  delete env.HOME;
  delete env.RESEARCH_KIT_HOME;
  const result = spawnSync(SH, [HOOK], { cwd: dir, encoding: 'utf8', timeout: 60_000, env });
  assert.doesNotMatch(result.stderr, /parameter not set/, result.stderr);
  assert.equal(result.status, 0, `an ungated repository was refused with HOME unset:\n${result.stdout}${result.stderr}`);
});

// The same, for the hook (2026-09-28): with HOME="" its node call returned "" as well, so it
// looked for the kit at "/.agents/research-kit". It now asks for the passwd entry too.
test('a commit with HOME empty looks for the kit in the real home, not /.agents', () => {
  requireCapability(SH, 'SHELL-NOT-FOUND', `no POSIX sh on this host (tried: ${SH_TRIED.join(', ')})`);
  const dir = tempDir('rk-emptyhome-');
  git(dir, ['init', '-q']);
  const env = { ...process.env, HOME: '', RESEARCH_KIT_CONFIG: isolatedConfig(),
    RESEARCH_KIT_INSTALL_STATE: path.join(tempDir('research-kit-hookstate-'), 'install.json') };
  delete env.RESEARCH_KIT_HOME;
  const result = spawnSync(SH, [HOOK], { cwd: dir, encoding: 'utf8', timeout: 60_000, env });
  assert.doesNotMatch(result.stderr, /(^|\s)\/\.agents\//m, `the hook looked in /.agents:\n${result.stderr}`);
  assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
});

// Found 2026-09-28 (break-test): a host machine's GLOBAL git config runs on every commit
// a scratch fixture makes, and two settings there are common enough to have names:
// `core.hooksPath` (what husky and corporate hook frameworks install) and `commit.gpgsign`
// (mandated signing, with no key reachable from a test). The corpus fixtures died on
// either - 12 and 13 red tests on a healthy checkout - reporting kit defects that did not
// exist. The fixture commit is now isolated (fixtureCommitArgs); this test reproduces the
// hostile machine so the isolation cannot silently regress.
test('a fixture commit is immune to the host machine\'s global git config', () => {
  requireGit('a fixture commit under a hostile global config');
  const hooks = tempDir('rk-hosthooks-');
  fs.writeFileSync(path.join(hooks, 'pre-commit'), '#!/bin/sh\necho "host hook ran" >&2\nexit 1\n');
  fs.chmodSync(path.join(hooks, 'pre-commit'), 0o755);
  const cfgDir = tempDir('rk-hostcfg-');
  const cfg = path.join(cfgDir, 'gitconfig');
  // Forward slashes: a git config file reads a backslash as an escape, so a Windows path
  // written as-is is "bad config line 2"; git on Windows takes C:/... as written.
  fs.writeFileSync(cfg, `[core]\n\thooksPath = ${hooks.replace(/\\/g, '/')}\n[commit]\n\tgpgsign = true\n`);
  const dir = tempDir('rk-hostrepo-');
  git(dir, ['init', '-q']);
  git(dir, ['config', 'user.email', 'fixture@example.invalid']);
  git(dir, ['config', 'user.name', 'Fixture']);
  fs.writeFileSync(path.join(dir, 'file.txt'), 'fixture\n');
  git(dir, ['add', 'file.txt']);

  // GIT_CONFIG_GLOBAL redirects one command's global config, so the hostile settings
  // never touch the operator's real one - the probe is hermetic either way it ends.
  const hostile = (args) => spawnSync('git', args, {
    cwd: dir, encoding: 'utf8', timeout: 20_000,
    env: { ...process.env, GIT_CONFIG_GLOBAL: cfg },
  });
  const bare = hostile(['commit', '-q', '-m', 'unisolated']);
  assert.notEqual(bare.status, 0, 'the hostile config stopped biting - this test now asserts nothing');
  const isolated = hostile(fixtureCommitArgs('the corpus'));
  assert.equal(isolated.status, 0,
    `a fixture commit died on the host's global config (core.hooksPath, commit.gpgsign):\n${isolated.stderr}`);
  assert.doesNotMatch(isolated.stderr, /host hook ran/, 'the host hook ran on a fixture commit');
});
