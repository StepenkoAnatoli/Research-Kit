// What this host must provide before a command can do its job.
//
// The README promises Node 22+, Git, and Python 3.12+. A promise in a README is not a
// check: entrypoints began executing and the missing prerequisite surfaced as a syntax
// error, a missing built-in, or a subprocess failure three layers down - none of which
// says "your Node is too old".
//
// Deliberately NOT a single gate that demands everything. Python is needed by the
// cross-language conformance runners and by nothing else, and a command that only reads
// the corpus has no business refusing to run because a language it never calls is absent.
// Each entrypoint asks for what it actually uses.

import { spawnSync } from 'node:child_process';

/** Node 22 is the floor: the kit uses `structuredClone` on arrays and modern ESM only. */
export const REQUIRED_NODE_MAJOR = 22;
export const REQUIRED_PYTHON = { major: 3, minor: 12 };

/** `{ ok, detail }` - ok when this Node is new enough to run the kit at all. */
export function checkNode(version = process.versions.node) {
  const major = Number(String(version).split('.')[0]);
  if (!Number.isFinite(major)) return { ok: false, detail: `could not read a Node version from ${JSON.stringify(version)}` };
  return major >= REQUIRED_NODE_MAJOR
    ? { ok: true, detail: `node ${version}` }
    : { ok: false, detail: `node ${version}; this kit needs ${REQUIRED_NODE_MAJOR} or newer`, fix: 'install Node 22+ from nodejs.org, then reopen the terminal' };
}

function nodeParts(version) {
  const [major, minor] = String(version).split('.').map(Number);
  return { major, minor: Number.isFinite(minor) ? minor : 0 };
}

/**
 * Whether this Node's built-in fetch can route through HTTPS_PROXY via NODE_USE_ENV_PROXY,
 * which the keyless transport sets (fetchEnv). The flag exists from 22.21.0 on the 22 line
 * and from 24.0.0 on the 24 line, and 23 never had it (docs/decisions/2026-09-27-node-support,
 * E-02, E-04). Below that the flag is ignored and the fetch goes around the proxy: measured
 * on 22.20.0, an HTTP 403 that named no proxy.
 */
export function nodeHonoursEnvProxy(version = process.versions.node) {
  const { major, minor } = nodeParts(version);
  if (major === 22) return minor >= 21;
  return major >= 24;
}

/**
 * The Node line as doctor reports it: `pass`, `warn` or `fail`, with the reason.
 * Below the floor the kit does not run. An odd line below 27 is never LTS and ends six
 * months after it starts (E-01) - 23 and 25 are already end-of-life. From 27 every line
 * goes LTS, so the rule stops there.
 */
export function nodeLine(version = process.versions.node) {
  const { major } = nodeParts(version);
  if (!Number.isFinite(major)) return { level: 'fail', detail: `could not read a Node version from ${JSON.stringify(version)}`, fix: '' };
  if (major < REQUIRED_NODE_MAJOR) {
    return { level: 'fail', detail: `node ${version}; this kit needs ${REQUIRED_NODE_MAJOR} or newer`, fix: 'install Node 24 (Active LTS) from nodejs.org' };
  }
  if (major % 2 === 1 && major < 27) {
    return {
      level: 'warn',
      detail: `node ${version} is an odd-numbered line: never LTS, and end-of-life six months after release`,
      fix: 'move to Node 24 (Active LTS) or 26',
    };
  }
  return { level: 'pass', detail: `node ${version}`, fix: '' };
}

/** `{ ok, detail }` - ok when git is on PATH and answers. Only for commands that use it. */
export function checkGit({ run = spawnSync } = {}) {
  const probe = run('git', ['--version'], { encoding: 'utf8', timeout: 20_000, windowsHide: true });
  if (probe.error || probe.status !== 0) {
    return { ok: false, detail: 'git is not on PATH, or did not answer --version', fix: 'install Git from git-scm.com, then reopen the terminal' };
  }
  return { ok: true, detail: String(probe.stdout).trim() };
}

/** `{ ok, detail }` - ok when a python new enough for the conformance runners answers. */
export function checkPython({ run = spawnSync } = {}) {
  // Keeps looking after an old interpreter. `python` is an ALIAS on most hosts, and on a
  // great many it still points at 2.7 or an old 3.x while `python3` is the real one - the
  // single most common layout on Linux and older macOS.
  //
  // The first version of this returned failure the moment it found an old `python`, so a
  // host with python 2.7 AND python3 3.12 was rejected for having no usable Python while
  // a usable Python sat one name away. The old interpreter is remembered only so the
  // message can say what was actually found, rather than the less useful "no python".
  let rejected = null;
  for (const exe of ['python3', 'python']) {
    const probe = run(exe, ['--version'], { encoding: 'utf8', timeout: 20_000, windowsHide: true });
    if (probe.error || probe.status !== 0) continue;
    const text = `${probe.stdout ?? ''}${probe.stderr ?? ''}`.trim();   // 3.x prints to stdout, 2.x to stderr
    const match = text.match(/(\d+)\.(\d+)\.(\d+)/);
    if (!match) return { ok: true, detail: `${exe}: ${text} (version not parsed; proceeding)` };
    const [major, minor] = [Number(match[1]), Number(match[2])];
    if (major > REQUIRED_PYTHON.major || (major === REQUIRED_PYTHON.major && minor >= REQUIRED_PYTHON.minor)) {
      return { ok: true, detail: `${exe} ${match[0]}` };
    }
    rejected ??= {
      ok: false,
      detail: `${exe} ${match[0]}; the conformance runners need ${REQUIRED_PYTHON.major}.${REQUIRED_PYTHON.minor}+`,
      fix: 'install Python 3.12+ from python.org, then reopen the terminal',
    };
  }
  return rejected ?? {
    ok: false,
    detail: 'no python on PATH',
    fix: 'install Python 3.12+ from python.org; only the cross-language conformance runners need it',
  };
}

/**
 * Ask for what this command uses, and stop with a named error if the host cannot provide
 * it. Returns the resolved report so a caller can print it.
 *
 * Exit code 3 is distinct on purpose: a prerequisite failure is not a product failure and
 * a script should be able to tell them apart without reading prose.
 */
export function requireRuntime({ node = true, git = false, python = false,
  exit = (code) => process.exit(code), write = (text) => process.stderr.write(text) } = {}) {
  const checks = [];
  if (node) checks.push(['node', checkNode()]);
  if (git) checks.push(['git', checkGit()]);
  if (python) checks.push(['python', checkPython()]);

  const failed = checks.filter(([, result]) => !result.ok);
  if (failed.length) {
    write(`this host cannot run that command:\n${failed.map(([name, r]) => `  ${name}: ${r.detail}\n    ${r.fix ?? ''}`).join('\n')}\n`);
    exit(3);
  }
  return Object.fromEntries(checks.map(([name, result]) => [name, result.detail]));
}
