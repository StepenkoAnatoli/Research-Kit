// doctor.mjs - read-only diagnostics: machine + project + gate + chain in one report.
//
// ROLE-AWARE (ADR-0010): on a builder the Firecrawl findings are informational and the
// handoff findings are blockers; on a collector it is the other way round. The
// collection entrypoints' refusal is what makes that split honest.
//
// One deliberate write: the repository-local hooksPath override log. The third override
// is silent by nature - the bypassed hook cannot report itself.

import fs from 'node:fs';
import path from 'node:path';
import { PATHS, resolve, exists, isDirectory, readText } from './core.mjs';
import { verdictContext, runPreflight } from './preflight.mjs';
import { isGated } from './gate.mjs';
import { verifyHandoff, handoffRemedy } from './handoff.mjs';
import { validateProject, hookExecutability, GATE_MARKERS, KIT_ROOT } from './scaffold.mjs';
import { settingsState } from './installer.mjs';
import { recordOverride } from './provenance.mjs';
import { probeFirecrawl, selectTransport } from './transport.mjs';
import {
  posture, machineRole, collectionPolicy, readMachineConfig, retiredEnvNotes,
  hooksPath, hooksPathEffective, runtimePaths, skillLocations,
  readInstallState, gitVersion, isGitRepo, RETIRED_CONFIG_KEYS, RETIRED_EDIT_GATE_HOOKS,
  EDIT_GATE_HOOK, KIT_HOME, namesHook,
} from './machine.mjs';

function f(severity, name, detail, fix = '') {
  return { severity, name, detail, ...(fix ? { fix } : {}) };
}

// ---------------------------------------------------------------- machine

export function machineHealth({ env = process.env, gitPaths = {}, probe = probeFirecrawl } = {}) {
  const out = [];
  const read = readMachineConfig(env);
  const post = posture(env);

  if (read.state === 'unreadable') {
    out.push(f('critical', 'machine-config',
      `${read.source} exists and does not parse (${read.error}). Resolved posture: ${post.failOpen ? 'fail-open from the last config that parsed' : 'fail-CLOSED, because there was nothing to hold'}.`,
      'repair or delete the config file; the kit keeps a <config>.last-good snapshot beside it'));
  } else {
    out.push(f('pass', 'machine-config', `${read.state} (${read.source}); posture: ${post.failOpen ? 'fail-open' : 'fail-closed'}`));
  }

  for (const key of read.retiredKeys) {
    out.push(f('warn', 'config-retired-key',
      `"${key}" is a retired config key, read into ${RETIRED_CONFIG_KEYS[key] ?? 'the current shape'}; the next kit write drops it`));
  }
  for (const note of retiredEnvNotes(env)) {
    out.push(f('warn', 'env-retired',
      `${note.name} is set and is NOT honoured - rename it to ${note.replacement}`));
  }

  const role = machineRole(env);
  const policy = collectionPolicy(env);
  if (role === 'unknown') {
    out.push(f('fail', 'machine-role',
      `unknown - ${policy.reason}. Metered collection is refused until this is resolved.`, policy.remedy));
  } else {
    out.push(f('pass', 'machine-role', `${role}${policy.mayCollect ? ' - this machine may collect' : ' - this machine must NOT collect'}`));
  }

  const version = gitVersion(gitPaths);
  out.push(version
    ? f('pass', 'git', version)
    : f('fail', 'git', 'git is not on PATH - the commit gate cannot install', 'install git 2.9 or newer'));

  const state = probe();
  const firecrawlSeverity = role === 'builder' ? 'pass' : 'fail';
  if (!state.installed) {
    out.push(f(firecrawlSeverity, 'firecrawl-cli',
      role === 'builder'
        ? 'the Firecrawl CLI is absent, which is expected on a builder - this machine does not collect'
        : 'the Firecrawl CLI is not on PATH',
      role === 'builder' ? '' : 'install the Firecrawl CLI, or run with --transport http-keyless'));
  } else {
    out.push(f('pass', 'firecrawl-cli', `${state.version}`));
    if (!state.authenticated) {
      out.push(f(firecrawlSeverity, 'firecrawl-auth',
        role === 'builder'
          ? 'not authenticated, which is expected on a builder - this machine does not collect'
          : 'not authenticated - a collector that cannot collect is broken',
        role === 'builder' ? '' : 'firecrawl login'));
    } else {
      out.push(f('pass', 'firecrawl-auth', `authenticated${state.credits === null ? '' : `, ${state.credits} credits`}`));
    }
  }

  try {
    const chosen = selectTransport({ env, probe });
    out.push(f('pass', 'transport', `${chosen.name} (${chosen.why})`));
  } catch (err) {
    out.push(f('fail', 'transport', err.message));
  }

  return out;
}

// ---------------------------------------------------------------- gate health

export function gateHealth(root, { env = process.env, gitPaths = {}, record = true } = {}) {
  const out = [];
  const global = hooksPath('global', gitPaths);
  const effective = hooksPathEffective({ ...gitPaths, cwd: root });

  if (!global) {
    out.push(f('warn', 'gate-commit', 'no machine-wide core.hooksPath is set - the commit gate is not installed',
      'node research-kit/bin/install-hooks.mjs'));
  } else {
    const hook = path.join(global, 'pre-commit');
    const mode = hookExecutability(hook);
    out.push(mode.ok
      ? f('pass', 'gate-commit', `${global} (pre-commit ${mode.reason})`)
      : f('fail', 'gate-commit', `${hook} is ${mode.reason} - git skips a hook it cannot execute, silently, and reports the commit clean`, mode.fix));
  }

  if (isGitRepo(root)) {
    const local = hooksPath('local', { ...gitPaths, cwd: root });
    if (local) {
      out.push(f('warn', 'gate-local-override',
        `this repository sets core.hooksPath=${local}, which displaces the machine-wide gate (husky, lefthook, simple-git-hooks and pre-commit all do this)`,
        'git config --local --unset core.hooksPath'));
      if (record) { try { recordOverride(root, 'local-hooks-path', local); } catch { /* read-only checkout */ } }
    }
  }
  if (effective && global && path.resolve(effective) !== path.resolve(global)) {
    out.push(f('warn', 'gate-hooks-path', `effective core.hooksPath here is ${effective}, not the machine-wide ${global}`));
  }

  const runtime = runtimePaths(env);
  let registered = 'none';
  try {
    registered = settingsState({ env });
  } catch {
    registered = 'unparseable';
  }
  const repair = 'node research-kit/bin/install-hooks.mjs --edit-only';
  if (registered === 'current') out.push(f('pass', 'gate-edit', `registered in ${runtime.settingsPath}, pointing at the deployed kit`));
  else if (registered === 'foreign') {
    out.push(f('fail', 'gate-edit',
      `registered in ${runtime.settingsPath}, but pointing at a hook OUTSIDE the deployed kit - the gate that runs is not the kit that is installed`,
      repair));
  } else if (registered === 'dangling') {
    out.push(f('fail', 'gate-edit',
      `registered in ${runtime.settingsPath}, and the hook file it names is not on disk - a gate that silently gates nothing`,
      repair));
  } else if (registered === 'retired') {
    out.push(f('warn', 'gate-edit',
      `registered at a RETIRED hook name in ${runtime.settingsPath}`, repair));
  } else if (registered === 'unfamiliar' || registered === 'unparseable') {
    out.push(f('fail', 'gate-edit', `${runtime.settingsPath} does not parse - the edit-time gate cannot load`));
  } else {
    out.push(f('warn', 'gate-edit', `not registered in ${runtime.settingsPath}`, repair));
  }

  return out;
}

function safeRead(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return '';
  }
}

export function editGateState(settings) {
  if (settings === null) return 'none';
  const hooks = settings?.hooks?.PreToolUse;
  if (!Array.isArray(hooks)) return 'none';
  const commands = hooks.flatMap((entry) => (entry.hooks ?? []).map((h) => String(h.command ?? '')));
  if (commands.some((c) => namesHook(c, EDIT_GATE_HOOK))) return 'current';
  if (commands.some((c) => RETIRED_EDIT_GATE_HOOKS.some((retired) => namesHook(c, retired)))) return 'retired';
  return 'none';
}

// ---------------------------------------------------------------- secrets

/**
 * Rule 6 says the key never enters the repository. This is what checks.
 *
 * It states its coverage rather than implying completeness: a clean result here means
 * "these patterns were not found in these files", not "this repository holds no
 * secrets". Dotfiles are INCLUDED - `.env.local` and the kit's own hidden logs are
 * exactly where a credential hides, and a scanner that skips every dotfile but `.env`
 * reports clean on the files most likely to carry one.
 */
export const SECRET_PATTERNS = Object.freeze([
  { name: 'firecrawl-key', re: /\bfc-[A-Za-z0-9]{16,}\b/ },
  { name: 'openai-style-key', re: /\bsk-[A-Za-z0-9_-]{16,}\b/ },
  { name: 'github-token', re: /\bgh[pousr]_[A-Za-z0-9]{16,}\b/ },
  { name: 'aws-access-key-id', re: /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/ },
  { name: 'google-api-key', re: /\bAIza[A-Za-z0-9_-]{20,}\b/ },
  { name: 'slack-token', re: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/ },
  { name: 'private-key-block', re: /-----BEGIN (?:RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/ },
  { name: 'bearer-in-url', re: /[?&](?:api[_-]?key|access[_-]?token|token)=[A-Za-z0-9._-]{12,}/i },
]);

const SECRET_SKIP_DIRS = new Set(['node_modules', '.git', 'research/raw']);
const SECRET_MAX_BYTES = 512 * 1024;

export function scanForSecrets(root, { maxFiles = 2000 } = {}) {
  const hits = [];
  let scanned = 0;
  let skippedLarge = 0;

  const walk = (dir, rel) => {
    if (scanned >= maxFiles) return;
    for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
      const childRel = rel ? `${rel}/${name.name}` : name.name;
      if (SECRET_SKIP_DIRS.has(name.name) || SECRET_SKIP_DIRS.has(childRel)) continue;
      const abs = path.join(dir, name.name);
      if (name.isDirectory()) { walk(abs, childRel); continue; }
      if (scanned >= maxFiles) return;
      let size = 0;
      try { size = fs.statSync(abs).size; } catch { continue; }
      if (size > SECRET_MAX_BYTES) { skippedLarge += 1; continue; }
      const text = readText(abs);
      if (text === null) continue;
      scanned += 1;
      for (const pattern of SECRET_PATTERNS) {
        const match = text.match(pattern.re);
        if (!match) continue;
        const line = text.slice(0, match.index).split('\n').length;
        hits.push({ file: childRel, line, pattern: pattern.name });
      }
    }
  };
  try { walk(root, ''); } catch { /* an unreadable tree is reported as what was scanned */ }

  return {
    hits,
    scanned,
    skippedLarge,
    coverage: `${SECRET_PATTERNS.length} credential patterns over ${scanned} text file(s) under ${maxFiles / 1000}k, dotfiles included, excluding ${[...SECRET_SKIP_DIRS].join(', ')}`,
  };
}

// ---------------------------------------------------------------- the report

/**
 * `runDoctor(root, opts)` -> `{ findings, ok, blocking }`.
 * Explicit Git/config/settings paths and a child environment let diagnostics run
 * against disposable fixtures without consulting host state.
 */
export function runDoctor(root, { env = process.env, gitPaths = {}, probe = probeFirecrawl, record = true } = {}) {
  const findings = [...machineHealth({ env, gitPaths, probe })];
  const role = machineRole(env);

  // project shape
  const gated = isGated(root);
  findings.push(f(gated ? 'pass' : 'warn', 'project-gated',
    gated ? `gated by ${GATE_MARKERS.filter((m) => exists(resolve(root, m)) || isDirectory(resolve(root, m))).join(', ')}` : 'no gate marker here - this project is not gated'));

  if (gated) {
    for (const finding of validateProject(root).findings) {
      findings.push(f(finding.severity, `shape-${finding.rule}`, finding.detail));
    }
  }

  // the verdict and the chain, from one snapshot
  const context = verdictContext(root, { env });
  const corpus = context.corpus;

  if (gated) {
    const verdict = runPreflight(root, { context, env });
    findings.push(verdict.pass
      ? f('pass', 'preflight', `PASS (${verdict.counts.warn} warning(s))`)
      : f('fail', 'preflight', `${verdict.counts.fail} blocking finding(s): ${verdict.failures.slice(0, 3).map((x) => `${x.check}/${x.rule}`).join(', ')}`,
        'node research-kit/bin/preflight.mjs'));

    const chain = corpus.chain;
    if (!chain.present) {
      findings.push(f('fail', 'ledger-missing', `${PATHS.ledger} is absent`));
    } else if (!chain.ok) {
      findings.push(f('fail', 'ledger-chain', `${chain.problems.length} chain problem(s): ${chain.problems.slice(0, 3).map((p) => p.rule).join(', ')}`));
    } else {
      findings.push(f('pass', 'ledger-chain', `${chain.entries.length} entries, chain verifies`));
    }

    for (const problem of corpus.problems.filter((p) => p.kind === 'raw-dangling')) {
      findings.push(f('fail', 'raw-dangling', `${problem.row} cites ${problem.file}, which is not on disk`));
    }
  }

  // overrides, counted
  const counts = new Map();
  for (const entry of corpus.overrides) counts.set(entry.kind, (counts.get(entry.kind) ?? 0) + 1);
  if (counts.size) {
    findings.push(f('warn', 'overrides',
      [...counts].map(([kind, n]) => `${kind} x${n}`).join(', ')));
  } else {
    findings.push(f('pass', 'overrides', 'none recorded'));
  }

  const secrets = scanForSecrets(root);
  if (secrets.hits.length) {
    for (const hit of secrets.hits) {
      findings.push(f('critical', 'secret',
        `${hit.file}:${hit.line} matches ${hit.pattern} - the key never belongs in this repository (Rule 6)`,
        'move it to the CLI config or the environment, then rotate it: a committed key is a leaked key'));
    }
  } else {
    findings.push(f('pass', 'secret-scan', `no match: ${secrets.coverage}`));
  }

  findings.push(...gateHealth(root, { env, gitPaths, record }));

  // the arrival question - composed ONCE, from the corpus already read
  const handoff = verifyHandoff(root, { corpus });
  if (!handoff.ok) {
    const severity = role === 'builder' ? 'fail' : 'pass';
    for (const finding of handoff.findings.filter((x) => x.name !== 'handoff-remedy')) {
      findings.push(f(severity, finding.name, finding.detail));
    }
    if (role === 'builder') {
      findings.push(f('info', 'handoff-remedy', handoffRemedy(handoff)));
    }
  } else if (gated) {
    findings.push(f('pass', 'handoff', `${handoff.entries} ledger entries, every cited capture on disk`));
  }

  // deployment
  const installed = readInstallState(env);
  findings.push(installed
    ? f('pass', 'deploy', `kit deployed ${installed.at ?? ''} to ${installed.kitHome ?? KIT_HOME}`)
    : f('warn', 'deploy', `no install state recorded - run: node ${path.join(KIT_ROOT, 'bin', 'install.mjs')}`));
  for (const location of skillLocations(env)) {
    findings.push(exists(location)
      ? f('pass', 'skill', `${location}`)
      : f('warn', 'skill', `${location} is absent - the protocol binds through AGENTS.md alone here`));
  }

  const blocking = findings.filter((x) => x.severity === 'fail' || x.severity === 'critical');
  return { root, role, findings, blocking, ok: blocking.length === 0 };
}
