// machine.mjs - everything outside the project (ADR-0002, ADR-0010, ADR-0012, ADR-0020).
//
// The machine config, the install state, git's core.hooksPath, the runtime anchors, and
// the machine role. The ONLY module that reaches past the project root.
//
// The config is read in THREE states - absent / readable / unreadable - because the old
// `try { parse } catch {}` collapsed "never configured" into "configured, and now
// corrupt", so a hardened machine silently reverted to the fail-open defaults.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { exists, readText, writeText, ensureDir, readJson, nowIso } from './core.mjs';

// ---------------------------------------------------------------- anchors (ADR-0012)

/**
 * The single place the kit states a runtime's paths. Every value is a DEFAULT the
 * machine config may override - a hardcoded skill root on a machine whose agent reads
 * another root installs a skill nothing discovers.
 */
export const RUNTIME_ANCHORS = Object.freeze({
  settingsPath: path.join(os.homedir(), '.claude', 'settings.json'),
  skillRoots: Object.freeze([path.join(os.homedir(), '.claude', 'skills')]),
  projectSkillDir: '.claude/skills',
});

/**
 * The machine's `.agents` root. `RESEARCH_KIT_HOME` outranks the OS-derived profile
 * result, whichever profile variables produced it — the githooks wrapper has always
 * honoured it, and a module that disagreed with the hook about where the kit lives was
 * a split answer to one question. The kit never monkey-patches `os.homedir()`.
 */
export function agentsHome(env = process.env) {
  return env.RESEARCH_KIT_HOME
    ? path.dirname(path.resolve(env.RESEARCH_KIT_HOME))
    : path.join(os.homedir(), '.agents');
}

export function kitHome(env = process.env) {
  return env.RESEARCH_KIT_HOME ? path.resolve(env.RESEARCH_KIT_HOME) : path.join(os.homedir(), '.agents', 'research-kit');
}

export const KIT_HOME = kitHome();
export const CONFIG_PATH = path.join(os.homedir(), '.agents', 'research-kit.config.json');
export const INSTALL_STATE_PATH = path.join(os.homedir(), '.agents', 'research-kit.install.json');
export const SKILL_NAME = 'research-first';
export const EDIT_GATE_HOOK = 'hooks/edit-gate.mjs';

/** Names the kit used to ship. Recognising an old install requires naming it. */
export const RETIRED_EDIT_GATE_HOOKS = Object.freeze(['hooks/claude-pretooluse.mjs', 'hooks/claude-gate.mjs']);
export const RETIRED_FLAGS = Object.freeze({ '--claude-only': '--edit-only', '--no-claude': '--no-edit-gate' });
export const RETIRED_PROJECT_SKILL_DIRS = Object.freeze(['.agents/skills']);
export const RETIRED_KIT_FILES = Object.freeze(['hooks/claude-pretooluse.mjs', 'hooks/claude-gate.mjs', 'lib/cli.mjs']);
export const RETIRED_CONFIG_KEYS = Object.freeze({ claudeGate: 'editGate.mode' });
export const RETIRED_ENV_VARS = Object.freeze({ CLAUDE_SETTINGS_PATH: 'RESEARCH_KIT_EDIT_GATE_SETTINGS' });

/**
 * Does this registered command name that hook file?
 *
 * The kit spells its hook paths with forward slashes and the installer writes a NATIVE
 * path, so on Windows the registration reads `...\hooks\edit-gate.mjs` while every
 * detector looks for `hooks/edit-gate.mjs`. Matching literally made the installer write
 * a second registration beside its own and doctor report `none` for a gate that was
 * installed - so separators are normalised in the one place that knows these names.
 */
export function namesHook(command, hookPath) {
  const normalize = (text) => String(text ?? '').split('\\').join('/');
  return normalize(command).includes(normalize(hookPath));
}

export const DEFAULTS = Object.freeze({
  failOpen: true,
  editGate: Object.freeze({ mode: 'ask', settingsPath: '' }),
  evidencePolicy: 'pluralist',
  role: 'collector',
  transport: '',
  searchTransport: '',
  serpapiKey: '',
  skillRoots: Object.freeze([]),
  projectSkillDir: '',
  maxAgeDays: 180,
});

export const ROLES = Object.freeze(['collector', 'builder']);
/** `unknown` is a STATE the kit resolves to, never a role an operator may declare. */
export const ROLE_STATES = Object.freeze([...ROLES, 'unknown']);
export const EVIDENCE_POLICIES = Object.freeze(['pluralist', 'strict']);
export const EDIT_GATE_MODES = Object.freeze(['ask', 'hard-block', 'off']);

// ---------------------------------------------------------------- config, in three states

/**
 * Precedence, highest first (the path-precedence contract):
 *   1. an explicit argument   2. `RESEARCH_KIT_CONFIG`
 *   3. `RESEARCH_KIT_HOME`'s `.agents` root   4. the OS profile's `.agents`
 * A higher authority is never silently replaced by a lower one.
 */
export function configPath(env = process.env, explicit = '') {
  if (explicit) return path.resolve(explicit);
  if (env.RESEARCH_KIT_CONFIG) return env.RESEARCH_KIT_CONFIG;
  return path.join(agentsHome(env), 'research-kit.config.json');
}

function lastGoodPath(file) {
  return `${file}.last-good`;
}

function shape(raw) {
  const settings = {
    failOpen: typeof raw.failOpen === 'boolean' ? raw.failOpen : DEFAULTS.failOpen,
    editGate: {
      mode: DEFAULTS.editGate.mode,
      settingsPath: raw.editGate?.settingsPath ?? DEFAULTS.editGate.settingsPath,
    },
    evidencePolicy: EVIDENCE_POLICIES.includes(raw.evidencePolicy) ? raw.evidencePolicy : DEFAULTS.evidencePolicy,
    // A field that is PRESENT and not a known role reads as `unknown`, not as the
    // default: a misspelling ("collecter", "Builder") is a machine whose operator meant
    // something, and guessing which is how a builder silently becomes a role that may
    // spend credits. Absent stays `collector` (ADR-0010); unknown blocks (ADR-0023).
    role: raw.role === undefined ? DEFAULTS.role : (ROLES.includes(raw.role) ? raw.role : 'unknown'),
    transport: typeof raw.transport === 'string' ? raw.transport : DEFAULTS.transport,
    // The SEARCH side is chosen separately from the fetch side (ADR-0027). Absent means
    // "the fetch provider", which is what every machine did before the split.
    searchTransport: typeof raw.searchTransport === 'string' ? raw.searchTransport : DEFAULTS.searchTransport,
    // A credential, and the only one this config holds. It lives here or in the
    // environment and never in a repository (SR-1). Read but never rendered: every
    // display path goes through `serpapi.redact()`.
    serpapiKey: typeof raw.serpapiKey === 'string' ? raw.serpapiKey : DEFAULTS.serpapiKey,
    skillRoots: Array.isArray(raw.skillRoots) ? raw.skillRoots.slice() : [],
    projectSkillDir: typeof raw.projectSkillDir === 'string' ? raw.projectSkillDir : '',
    maxAgeDays: Number.isFinite(raw.maxAgeDays) ? raw.maxAgeDays : DEFAULTS.maxAgeDays,
  };
  // A retired key is READ before it is dropped: a rename that silently relaxes a gate is
  // the same defect as a rename that silently stops firing one.
  const retired = [];
  if (EDIT_GATE_MODES.includes(raw.editGate?.mode)) settings.editGate.mode = raw.editGate.mode;
  else if (EDIT_GATE_MODES.includes(raw.claudeGate)) { settings.editGate.mode = raw.claudeGate; retired.push('claudeGate'); }
  else if (raw.claudeGate !== undefined) retired.push('claudeGate');
  return { settings, retired };
}

/**
 * Returns `{ settings, state, source, error, retiredKeys }`. The settings alone cannot
 * say whether fail-closed was configured or is the fallback this machine adopted.
 */
export function readMachineConfig(env = process.env) {
  const file = configPath(env);
  if (!exists(file)) {
    return { settings: shape({}).settings, state: 'absent', source: file, error: null, retiredKeys: [] };
  }
  const text = readText(file);
  try {
    const raw = JSON.parse(text ?? '');
    const { settings, retired } = shape(raw && typeof raw === 'object' ? raw : {});
    try { writeText(lastGoodPath(file), text); } catch { /* snapshot is best-effort */ }
    return { settings, state: 'readable', source: file, error: null, retiredKeys: retired };
  } catch (err) {
    const snapshot = readJson(lastGoodPath(file), null);
    if (snapshot) {
      const { settings, retired } = shape(snapshot);
      return { settings, state: 'unreadable', resolvedFrom: 'snapshot', source: lastGoodPath(file), error: err.message, retiredKeys: retired };
    }
    // Nothing to hold: fail CLOSED, and the ROLE becomes `unknown` rather than the
    // default. The old "every config was previously snapshotted" rationale does not
    // cover a hand-written config, a copied machine, a denied snapshot write, or a
    // missing backup - and on every one of those the default `collector` is the role
    // that may spend credits. An unknown role refuses metered collection until it is
    // resolved (ADR-0023). `failOpen` is still the only knob tightened: the others have
    // no safe restrictive default.
    const { settings } = shape({});
    return {
      settings: { ...settings, failOpen: false, role: 'unknown' },
      state: 'unreadable',
      resolvedFrom: 'fallback-closed',
      source: file,
      error: err.message,
      retiredKeys: [],
    };
  }
}

export function loadConfig(env = process.env) {
  return readMachineConfig(env).settings;
}

/** Writing drops retired keys, so the migration happens through normal use. */
export function saveConfig(patch, env = process.env) {
  const file = configPath(env);
  const current = readMachineConfig(env).settings;
  const next = {
    ...current,
    ...patch,
    editGate: { ...current.editGate, ...(patch.editGate ?? {}) },
  };
  ensureDir(path.dirname(file));
  writeText(file, `${JSON.stringify(next, null, 2)}\n`);
  writeText(lastGoodPath(file), `${JSON.stringify(next, null, 2)}\n`);
  return next;
}

/** The fail-open / fail-closed answer, carrying where it came from. */
export function posture(env = process.env) {
  const read = readMachineConfig(env);
  return {
    failOpen: read.settings.failOpen,
    configState: read.state,
    configSource: read.source,
    configError: read.error,
    retiredKeys: read.retiredKeys,
    resolvedFrom: read.resolvedFrom ?? (read.state === 'absent' ? 'defaults' : 'config'),
    // The code carries the RESOLVED posture, not the state:
    //   0 allow
    //   1 a config that parses says fail-closed (including a held last-good snapshot)
    //   2 unreadable, nothing to hold, and therefore resolved to blocking
    // Two readers of one posture that disagree about what a code means is the drift the
    // pin exists to catch.
    exitCode: read.settings.failOpen ? 0 : (read.resolvedFrom === 'fallback-closed' ? 2 : 1),
  };
}

// ---------------------------------------------------------------- runtime paths

export function runtimePaths(env = process.env) {
  const cfg = loadConfig(env);
  return {
    settingsPath: env.RESEARCH_KIT_EDIT_GATE_SETTINGS || cfg.editGate.settingsPath || RUNTIME_ANCHORS.settingsPath,
    projectSkillDir: cfg.projectSkillDir || RUNTIME_ANCHORS.projectSkillDir,
  };
}

export function skillLocations(env = process.env) {
  const cfg = loadConfig(env);
  const roots = cfg.skillRoots.length ? cfg.skillRoots : [...RUNTIME_ANCHORS.skillRoots];
  return roots.map((root) => path.join(root, SKILL_NAME));
}

/** A retired ENVIRONMENT variable is reported, never honoured - no kit write reaches a shell. */
export function retiredEnvNotes(env = process.env) {
  return Object.entries(RETIRED_ENV_VARS)
    .filter(([name, replacement]) => env[name] && !env[replacement])
    .map(([name, replacement]) => ({ name, replacement, value: env[name] }));
}

// ---------------------------------------------------------------- role and collection policy

export function machineRole(env = process.env) {
  return loadConfig(env).role;
}

/** The single answer to "may this machine collect?". */
export function collectionPolicy(env = process.env) {
  const read = readMachineConfig(env);
  const role = read.settings.role;
  if (role === 'builder') {
    return {
      role,
      mayCollect: false,
      reason: 'this machine is declared role=builder, which does not collect',
      remedy: 'collect on the collector machine, or declare this one: node research-kit/bin/install-hooks.mjs --role collector',
    };
  }
  if (role === 'unknown') {
    // Not a default and not a guess: the machine's role could not be established, so the
    // metered, credit-spending half of the kit stays shut until somebody says which it is.
    return {
      role,
      mayCollect: false,
      reason: read.state === 'unreadable'
        ? `this machine's role cannot be established: ${read.source} does not parse (${read.error}) and there is no last-good snapshot`
        : `this machine's config names a role the kit does not know ("${readJson(read.source, {})?.role ?? 'unreadable value'}")`,
      remedy: 'repair the config, or declare the role: node research-kit/bin/install-hooks.mjs --role collector|builder',
    };
  }
  return { role, mayCollect: true, reason: '', remedy: '' };
}

export function collectionRefusal(policy) {
  return [
    `refused: ${policy.reason}.`,
    'A page fetched by hand is not evidence in this kit, and re-collecting forges a corpus',
    'instead of reporting a gap. Name the missing fact and let it be collected.',
    `remedy: ${policy.remedy}`,
  ].join('\n');
}

export function evidencePolicy(env = process.env) {
  return loadConfig(env).evidencePolicy;
}

// ---------------------------------------------------------------- git

function git(args, { cwd = process.cwd(), env = process.env } = {}) {
  try {
    return execFileSync('git', args, { cwd, env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

export function gitVersion(opts = {}) {
  return git(['--version'], opts);
}

/** Scope-aware readers: which hooksPath is set where. */
export function hooksPath(scope = 'global', opts = {}) {
  const flag = { global: '--global', local: '--local', system: '--system' }[scope] ?? '--global';
  return git(['config', flag, '--get', 'core.hooksPath'], opts);
}

export function hooksPathEffective(opts = {}) {
  return git(['config', '--get', 'core.hooksPath'], opts);
}

export function setHooksPath(value, { scope = 'global', ...opts } = {}) {
  const flag = { global: '--global', local: '--local', system: '--system' }[scope] ?? '--global';
  if (value === null) return git(['config', flag, '--unset', 'core.hooksPath'], opts);
  return git(['config', flag, 'core.hooksPath', value], opts);
}

export function isGitRepo(dir) {
  return exists(path.join(dir, '.git'));
}

/** The third override is silent by nature: it disables the hook that would report it. */
export function localHooksPathOverride(cwd = process.cwd(), opts = {}) {
  if (!isGitRepo(cwd)) return null;
  const local = hooksPath('local', { ...opts, cwd });
  return local || null;
}

// ---------------------------------------------------------------- install state

export function readInstallState(env = process.env) {
  return readJson(env.RESEARCH_KIT_INSTALL_STATE || INSTALL_STATE_PATH, null);
}

export function writeInstallState(state, env = process.env) {
  const file = env.RESEARCH_KIT_INSTALL_STATE || INSTALL_STATE_PATH;
  ensureDir(path.dirname(file));
  writeText(file, `${JSON.stringify({ ...state, at: nowIso() }, null, 2)}\n`);
  return file;
}

export { os, path as nodePath, fs };
