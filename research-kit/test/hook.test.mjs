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

// ADR-0120: in the kit's own checkout the gate may run the suite, which takes minutes, and the
// hook's watchdog would have killed it at 120 s - "the gate exceeded 120s" is an internal error,
// decided by posture, which on a fail-open machine ALLOWS the commit the suite would have refused.
// So the watchdog allows for the suite there, and only there, unless the operator set it.
test('the hook widens its watchdog only in the kit\'s own checkout, and only when the operator did not set one', () => {
  const text = readText(HOOK);
  assert.match(text, /research-kit\/bin\/selftest\.mjs/, 'the hook does not know the kit\'s checkout');
  assert.match(text, /RESEARCH_KIT_GATE_TIMEOUT:-/, 'an operator\'s own timeout must win');
  const widened = /GATE_TIMEOUT=(\d+)\s*$/m.exec(text.split('selftest.mjs')[1] ?? '');
  assert.ok(widened && Number(widened[1]) >= 1500, `the watchdog in the kit\'s checkout must outlast a 20-minute suite: ${widened?.[0]}`);
});

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

// Found 2026-09-30 (break-test, PR #176): the hook listed the staged set with rename
// detection on (git's default), so `git mv src/app.js research/app.js` listed only
// research/app.js. While the verdict failed, `git rm src/app.js` was blocked - a change
// outside research/ - and the same removal spelled as a move was allowed; the verdict also
// depended on the operator's diff.renames. The staged set is every path the commit touches.
test('moving product code into research/ is BLOCKED while the verdict fails, exactly as deleting it is', () => {
  requireCapability(SH, 'SHELL-NOT-FOUND', `no POSIX sh on this host (tried: ${SH_TRIED.join(', ')})`);
  const dir = makeRepo();
  writeText(resolve(dir, 'src/app.js'), 'export const app = 1;\n');
  writeText(resolve(dir, 'src/other.js'), 'export const other = 2;\n');
  git(dir, ['add', 'src/app.js', 'src/other.js']);
  git(dir, fixtureCommitArgs('product code'));
  // The most eager rename detection git has, so the host's config cannot decide the verdict.
  git(dir, ['config', 'diff.renames', 'copies']);
  corrupt(dir, PATHS.discovery, (text) => text.replace('CLOSED', 'OPEN'));
  git(dir, ['add', PATHS.discovery]);

  // The control: the same removal, spelled as a removal, is blocked.
  git(dir, ['rm', '-q', 'src/other.js']);
  const removed = runHook(dir);
  assert.notEqual(removed.status, 0, `deleting product code while the verdict fails was allowed: ${removed.stdout}${removed.stderr}`);
  git(dir, ['reset', '-q', '--', 'src/other.js']);
  git(dir, ['checkout', '-q', '--', 'src/other.js']);

  git(dir, ['mv', 'src/app.js', 'research/app.js']);
  assert.match(git(dir, ['diff', '--cached', '--name-status']), /^R\d*\tsrc\/app\.js\tresearch\/app\.js/m,
    'the fixture did not stage a rename, so this test proves nothing');
  const moved = runHook(dir);
  assert.notEqual(moved.status, 0, `moving product code into research/ got past the gate: ${moved.stdout}${moved.stderr}`);
});

// Found 2026-10-01 (break-test, PR #182): the staged list is the first stage of a pipeline, and
// sh reports only the last stage's status. A `git diff` that failed reached the gate as an EMPTY
// list - "nothing outside research/ is staged" - so product code was allowed while the verdict
// failed, on a fail-closed machine too. A diff.orderFile naming a missing file makes `git diff`
// exit 128 while everything else the gate asks of git keeps working.
test('a git that cannot list the staged paths does not let product code through a failing verdict', () => {
  requireCapability(SH, 'SHELL-NOT-FOUND', `no POSIX sh on this host (tried: ${SH_TRIED.join(', ')})`);
  const dir = makeRepo();
  corrupt(dir, PATHS.discovery, (text) => text.replace('CLOSED', 'OPEN'));
  writeText(resolve(dir, 'src/app.js'), 'export const app = 1;\n');
  git(dir, ['add', PATHS.discovery, 'src/app.js']);
  git(dir, ['config', 'diff.orderFile', path.join(dir, 'no-such-order-file')]);
  const probe = spawnSync('git', ['diff', '--cached', '--name-only'], { cwd: dir, encoding: 'utf8' });
  assert.notEqual(probe.status, 0, 'the fixture did not break `git diff`, so this test proves nothing');

  const result = runHook(dir, { env: { RESEARCH_KIT_CONFIG: isolatedConfig({ failOpen: false }) } });
  assert.notEqual(result.status, 0, `staged product code got past a failing verdict: ${result.stdout}${result.stderr}`);
  assert.doesNotMatch(result.stdout, /confined to research/, 'the gate was told nothing outside research/ was staged');
  assert.match(result.stderr, /could not list the staged paths/, 'the hook must say why it judged without a list');
});

test('a git that cannot list the staged paths still lets a passing project commit', () => {
  requireCapability(SH, 'SHELL-NOT-FOUND', `no POSIX sh on this host (tried: ${SH_TRIED.join(', ')})`);
  const dir = makeRepo();
  writeText(resolve(dir, 'README.md'), '# fixture\n');
  git(dir, ['add', 'README.md']);
  git(dir, ['config', 'diff.orderFile', path.join(dir, 'no-such-order-file')]);
  const result = runHook(dir);
  assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
  assert.match(result.stderr, /could not list the staged paths/);
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
  assert.match(text, /git diff --cached --name-only --no-renames -z \|/, 'the list must travel on a pipe, and name both paths of a rename');
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

// Found 2026-10-01 (break-test, PR #182): git runs hooks from ONE directory. The kit's commit
// gate is installed as the machine-wide core.hooksPath, so every repository's own .git/hooks
// stopped running - its pre-commit, its commit-msg, Git LFS's pre-push upload - and nothing said
// so. Every hook git knows now has a file in githooks/ that hands the call to the repository's
// own hook (ADR-0112). The names are git 2.43's, read from the git binary.
const GIT_HOOK_NAMES = [
  'applypatch-msg', 'pre-applypatch', 'post-applypatch', 'pre-commit', 'pre-merge-commit', 'prepare-commit-msg',
  'commit-msg', 'post-commit', 'pre-rebase', 'post-checkout', 'post-merge', 'pre-push', 'pre-receive', 'update',
  'proc-receive', 'post-receive', 'post-update', 'reference-transaction', 'push-to-checkout', 'pre-auto-gc',
  'post-rewrite', 'sendemail-validate', 'fsmonitor-watchman', 'p4-changelist', 'p4-prepare-changelist',
  'p4-post-changelist', 'p4-pre-submit', 'post-index-change',
];

/** A hook in the repository's own .git/hooks that records that it ran, with its stdin. */
function ownHook(dir, name, log, { exit = 0 } = {}) {
  const file = path.join(dir, '.git', 'hooks', name);
  const to = log.split('\\').join('/');
  const stdin = name === 'pre-push' ? `cat >> "${to}"\n` : '';   // only pre-push is handed anything on stdin
  fs.writeFileSync(file, `#!/bin/sh\necho "${name} $*" >> "${to}"\n${stdin}exit ${exit}\n`);
  fs.chmodSync(file, 0o755);
}

function gitWithKitHooks(dir, args, env = {}) {
  return spawnSync('git', ['-c', `core.hooksPath=${path.join(KIT_ROOT, 'githooks')}`, '-c', 'commit.gpgsign=false', ...args], {
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

test('under the kit\'s hooksPath, the repository\'s own pre-commit, commit-msg and pre-push still run', () => {
  requireCapability(SH, 'SHELL-NOT-FOUND', `no POSIX sh on this host (tried: ${SH_TRIED.join(', ')})`);
  const dir = makeRepo();
  const log = path.join(tempDir('rk-own-hooks-'), 'ran.log');
  for (const name of ['pre-commit', 'commit-msg', 'pre-push']) ownHook(dir, name, log);

  writeText(resolve(dir, 'README.md'), '# fixture\n');
  git(dir, ['add', 'README.md']);
  const commit = gitWithKitHooks(dir, ['commit', '-q', '-m', 'docs']);
  assert.equal(commit.status, 0, commit.stdout + commit.stderr);

  const remote = tempDir('rk-remote-');
  git(remote, ['init', '-q', '--bare']);
  const push = gitWithKitHooks(dir, ['push', '-q', remote, 'HEAD:refs/heads/main']);
  assert.equal(push.status, 0, push.stdout + push.stderr);

  const ran = fs.existsSync(log) ? readText(log) : '';
  assert.match(ran, /^pre-commit/m, `the repository's own pre-commit did not run:\n${ran}`);
  assert.match(ran, /^commit-msg .*COMMIT_EDITMSG/m, 'commit-msg did not run, or lost its argument');
  assert.match(ran, /^pre-push /m, 'pre-push did not run - Git LFS uploads from this hook');
  assert.match(ran, /refs\/heads\/main/, 'pre-push did not receive the refs on stdin');
});

test('the repository\'s own pre-commit can still refuse a commit, and is not asked while the gate blocks', () => {
  requireCapability(SH, 'SHELL-NOT-FOUND', `no POSIX sh on this host (tried: ${SH_TRIED.join(', ')})`);
  const dir = makeRepo();
  const log = path.join(tempDir('rk-own-hooks-'), 'ran.log');
  ownHook(dir, 'pre-commit', log, { exit: 1 });
  writeText(resolve(dir, 'README.md'), '# fixture\n');
  git(dir, ['add', 'README.md']);
  const refused = gitWithKitHooks(dir, ['commit', '-q', '-m', 'docs']);
  assert.notEqual(refused.status, 0, 'the repository\'s own pre-commit refused, and the commit went through');

  // A blocking gate answers first; the repository's hook is not run for a commit already refused.
  fs.rmSync(log, { force: true });
  corrupt(dir, PATHS.discovery, (text) => text.replace('CLOSED', 'OPEN'));
  writeText(resolve(dir, 'src/app.js'), 'export const app = 1;\n');
  git(dir, ['add', PATHS.discovery, 'src/app.js']);
  const blocked = gitWithKitHooks(dir, ['commit', '-q', '-m', 'code']);
  assert.notEqual(blocked.status, 0);
  assert.equal(fs.existsSync(log), false, 'the repository\'s pre-commit ran for a commit the gate had refused');
});

test('every hook git knows has a file in githooks/, tracked executable, that hands on to the repository\'s own', () => {
  const dir = path.join(KIT_ROOT, 'githooks');
  assert.deepEqual(fs.readdirSync(dir).sort(), [...GIT_HOOK_NAMES, 'hand-on.sh'].sort(), 'githooks/ and the hooks git knows disagree');
  const passOn = GIT_HOOK_NAMES.filter((name) => name !== 'pre-commit').map((name) => readText(path.join(dir, name)));
  assert.equal(new Set(passOn).size, 1, 'the pass-on files have drifted apart');
  assert.match(passOn[0], /^#!\/bin\/sh/);
  assert.match(passOn[0], /hand-on\.sh/);
  assert.match(readText(path.join(dir, 'pre-commit')), /hand-on\.sh/, 'pre-commit hands on through the same file');
  assert.match(readText(path.join(dir, 'hand-on.sh')), /--git-common-dir/, 'the repository\'s hooks must be found past core.hooksPath, not through it');
  const tracked = spawnSync('git', ['ls-files', '-s', '--', 'githooks'], { cwd: KIT_ROOT, encoding: 'utf8' });
  if (tracked.status === 0 && tracked.stdout.trim()) {
    for (const line of tracked.stdout.trim().split('\n')) assert.match(line, /^100755 /, `not executable in the index: ${line}`);
  }
});

// Found 2026-10-01: the hand-on above ran the repository's own hooks, but a machine that had a
// global core.hooksPath BEFORE the kit's install ran that folder's hooks instead - git reads one
// folder - and the install replaced it, so its hooks stopped running, with nothing said. The
// install records it as research-kit.previousHooksPath, and the hand-on runs what git would
// have run without the kit: that folder when there was one, else the repository's own.
test('the global hooks folder the install replaced still runs, as it did before the kit', () => {
  requireCapability(SH, 'SHELL-NOT-FOUND', `no POSIX sh on this host (tried: ${SH_TRIED.join(', ')})`);
  const dir = makeRepo();
  const log = path.join(tempDir('rk-prev-hooks-'), 'ran.log');
  const previous = tempDir('rk-prev-hooks-dir-');
  for (const name of ['commit-msg', 'pre-commit']) {
    const file = path.join(previous, name);
    fs.writeFileSync(file, `#!/bin/sh\necho "previous ${name}" >> "${log.split('\\').join('/')}"\nexit 0\n`);
    fs.chmodSync(file, 0o755);
  }
  ownHook(dir, 'commit-msg', log);
  const globalConfig = path.join(tempDir('rk-prev-hooks-cfg-'), 'gitconfig');
  spawnSync('git', ['config', '--file', globalConfig, 'research-kit.previousHooksPath', previous]);

  writeText(resolve(dir, 'README.md'), '# fixture\n');
  git(dir, ['add', 'README.md']);
  const commit = gitWithKitHooks(dir, ['commit', '-q', '-m', 'docs'], { GIT_CONFIG_GLOBAL: globalConfig });
  assert.equal(commit.status, 0, commit.stdout + commit.stderr);
  const ran = fs.existsSync(log) ? readText(log) : '';
  assert.match(ran, /^previous pre-commit/m, `the replaced folder's pre-commit did not run:\n${ran}`);
  assert.match(ran, /^previous commit-msg/m, 'the replaced folder\'s commit-msg did not run');
  assert.doesNotMatch(ran, /^commit-msg /m, 'the repository\'s own hook ran, which git never did while a global folder was set');

  // A refusal from that folder still refuses.
  fs.writeFileSync(path.join(previous, 'pre-commit'), '#!/bin/sh\nexit 1\n');
  fs.chmodSync(path.join(previous, 'pre-commit'), 0o755);
  writeText(resolve(dir, 'README.md'), '# fixture 2\n');
  git(dir, ['add', 'README.md']);
  const refused = gitWithKitHooks(dir, ['commit', '-q', '-m', 'docs 2'], { GIT_CONFIG_GLOBAL: globalConfig });
  assert.notEqual(refused.status, 0, 'the replaced folder\'s pre-commit refused, and the commit went through');
});

// Break-test PR #185 (2026-10-01): started from a terminal with nothing piped in, the edit gate
// waited forever - `fs.readFileSync(0)` on a TTY waits for an end of file that never comes;
// held on a real pty it was alive with no output ten seconds later. `bin/gate.mjs` already
// asked `stdinIsReadable()` before reading; the hook asks the same question now, and allows
// with a named reason, since a terminal carries no payload to judge.
test('the edit gate does not read a terminal stdin: it allows, with the reason, and never waits', async () => {
  const { stdinIsReadable } = await import('../lib/gate.mjs');
  assert.equal(stdinIsReadable({ isTTY: true }), false);
  assert.equal(stdinIsReadable({ isTTY: false }), true);
  assert.equal(stdinIsReadable({}), true, 'a pipe or a file has no isTTY');
  const hook = readText(path.join(KIT_ROOT, 'hooks', 'edit-gate.mjs'));
  const asks = hook.indexOf('stdinIsReadable()');
  const reads = hook.indexOf('fs.readFileSync(0');
  assert.ok(asks > 0 && asks < reads, 'the hook reads stdin before asking whether it is a terminal');
  assert.match(hook.slice(asks, reads), /emit\('allow'/, 'a terminal stdin is allowed with a reason, not refused');
});
