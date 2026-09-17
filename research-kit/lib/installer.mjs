// installer.mjs - installs the two gates, records and restores prior state (ADR-0012).
//
// The commit gate is one machine-wide `core.hooksPath`. The edit-time gate is one
// registration in the runtime's settings file - and the installer recognises a
// registration left at a RETIRED hook name, replaces it rather than adding a second,
// and reports the repair. A stale entry beside a new one, or a registration pointing at
// a hook file that no longer exists, is a gate that silently gates nothing.

import fs from 'node:fs';
import path from 'node:path';
import {
  exists, readText, writeText, ensureDir, readJson, today,
} from './core.mjs';
import {
  KIT_HOME, EDIT_GATE_HOOK, RETIRED_EDIT_GATE_HOOKS, RETIRED_KIT_FILES,
  hooksPath, setHooksPath, runtimePaths, skillLocations, readInstallState, writeInstallState,
  saveConfig, loadConfig, ROLES, namesHook,
} from './machine.mjs';
import { KIT_ROOT, HOOK_MODE, hookExecutability } from './scaffold.mjs';

export const MATCHER = 'Edit|Write|MultiEdit|NotebookEdit';

// ---------------------------------------------------------------- the commit gate

export function installCommitGate({ kitHome = KIT_HOME, env = process.env, dryRun = false, gitPaths = {} } = {}) {
  const dir = path.join(kitHome, 'githooks');
  const previous = hooksPath('global', gitPaths);
  if (dryRun) return { dryRun: true, would: dir, previous };

  const hook = path.join(dir, 'pre-commit');
  if (!exists(hook)) return { ok: false, reason: `${hook} is not deployed - run bin/install.mjs first` };
  if (process.platform !== 'win32') { try { fs.chmodSync(hook, HOOK_MODE); } catch { /* best effort */ } }

  setHooksPath(dir, { scope: 'global', ...gitPaths });
  const state = readInstallState(env) ?? {};
  writeInstallState({ ...state, kitHome, hooksPath: dir, previousHooksPath: state.previousHooksPath ?? previous ?? null }, env);
  return { ok: true, hooksPath: dir, previous, executable: hookExecutability(hook) };
}

export function removeCommitGate({ env = process.env, gitPaths = {} } = {}) {
  const state = readInstallState(env) ?? {};
  const previous = state.previousHooksPath ?? null;
  setHooksPath(previous ?? null, { scope: 'global', ...gitPaths });
  writeInstallState({ ...state, hooksPath: null }, env);
  return { ok: true, restored: previous };
}

// ---------------------------------------------------------------- the edit-time gate

function readSettings(file) {
  if (!exists(file)) return { state: 'absent', settings: {}, text: '' };
  const text = readText(file, '');
  try {
    const parsed = JSON.parse(text || '{}');
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return { state: 'readable', settings: parsed, text };
    return { state: 'unfamiliar', settings: {}, text };
  } catch (err) {
    // One known corruption is repairable: a stray line of prose. Anything else is refused.
    const repaired = text.split(/\r?\n/).filter((line) => !/^[A-Za-z][^"{}[\]:,]*;?-?\s*$/.test(line.trim()) || !line.trim()).join('\n');
    try {
      const parsed = JSON.parse(repaired || '{}');
      return { state: 'repairable', settings: parsed, text, repaired, error: err.message };
    } catch {
      return { state: 'unfamiliar', settings: {}, text, error: err.message };
    }
  }
}

function hookCommand(kitHome) {
  return `node "${path.join(kitHome, ...EDIT_GATE_HOOK.split('/'))}"`;
}

function entriesOf(settings) {
  const pre = settings?.hooks?.PreToolUse;
  return Array.isArray(pre) ? pre : [];
}

/** What the installer replaced, so a rename that changes nothing does not stay silent. */
export function retiredRepairNote(removed) {
  if (!removed.length) return '';
  return `replaced ${removed.length} registration(s) left at a retired hook name: ${removed.join(', ')}`;
}

export function installEditGate({ kitHome = KIT_HOME, env = process.env, dryRun = false, mode = '' } = {}) {
  const file = runtimePaths(env).settingsPath;
  const read = readSettings(file);
  if (read.state === 'unfamiliar') {
    return { ok: false, reason: `${file} is in a state the installer does not recognise - refusing to rewrite it`, error: read.error };
  }

  const command = hookCommand(kitHome);
  const removed = [];
  const kept = [];
  for (const entry of entriesOf(read.settings)) {
    const hooks = (entry.hooks ?? []).filter((hook) => {
      const text = String(hook.command ?? '');
      if (namesHook(text, EDIT_GATE_HOOK)) { removed.push(EDIT_GATE_HOOK); return false; }
      const retired = RETIRED_EDIT_GATE_HOOKS.find((name) => namesHook(text, name));
      if (retired) { removed.push(retired); return false; }
      return true;
    });
    if (hooks.length) kept.push({ ...entry, hooks });
  }
  kept.push({ matcher: MATCHER, hooks: [{ type: 'command', command }] });

  const next = { ...read.settings, hooks: { ...(read.settings.hooks ?? {}), PreToolUse: kept } };
  if (dryRun) return { dryRun: true, file, would: command, removed, repaired: read.state === 'repairable' };

  if (exists(file)) {
    const backup = `${file}.bak-${today()}`;
    if (!exists(backup)) writeText(backup, read.text);
  }
  ensureDir(path.dirname(file));
  writeText(file, `${JSON.stringify(next, null, 2)}\n`);
  if (mode) saveConfig({ editGate: { ...loadConfig(env).editGate, mode } }, env);

  return {
    ok: true,
    file,
    command,
    removed: [...new Set(removed.filter((name) => name !== EDIT_GATE_HOOK))],
    note: retiredRepairNote([...new Set(removed.filter((name) => name !== EDIT_GATE_HOOK))]),
    repairedSettings: read.state === 'repairable',
  };
}

export function removeEditGate({ env = process.env } = {}) {
  const file = runtimePaths(env).settingsPath;
  const read = readSettings(file);
  if (read.state === 'absent') return { ok: true, file, removed: 0 };
  if (read.state === 'unfamiliar') return { ok: false, reason: `${file} does not parse - refusing to rewrite it` };

  let removed = 0;
  const kept = [];
  for (const entry of entriesOf(read.settings)) {
    const hooks = (entry.hooks ?? []).filter((hook) => {
      const text = String(hook.command ?? '');
      const ours = namesHook(text, EDIT_GATE_HOOK) || RETIRED_EDIT_GATE_HOOKS.some((name) => namesHook(text, name));
      if (ours) removed += 1;
      return !ours;
    });
    if (hooks.length) kept.push({ ...entry, hooks });
  }
  const next = { ...read.settings, hooks: { ...(read.settings.hooks ?? {}), PreToolUse: kept } };
  writeText(file, `${JSON.stringify(next, null, 2)}\n`);
  return { ok: true, file, removed };
}

/**
 * `current` / `foreign` / `dangling` / `retired` / `unfamiliar` / `none`.
 *
 * Matching the hook's NAME is not enough. This machine had a registration reading
 *
 *     node "C:/Users/PC/Desktop/FreeBuff/Deep-Research-Agent-main/research-kit/hooks/edit-gate.mjs"
 *
 * which names `hooks/edit-gate.mjs` and so read as `current` - while the gate that
 * actually ran belonged to a different checkout of a different implementation, one whose
 * commit gate crashed. ADR-0012 sec 4 says no registration may point at a hook file that
 * no longer exists, "a gate that silently gates nothing"; pointing at a hook that exists
 * but is not the deployed kit's is the same failure wearing a working file.
 *
 *   foreign  - our hook name, somebody else's tree
 *   dangling - our hook name, and nothing on disk there
 */
export function settingsState({ env = process.env, kitHome = KIT_HOME } = {}) {
  const file = runtimePaths(env).settingsPath;
  const read = readSettings(file);
  if (read.state === 'absent') return 'none';
  if (read.state === 'unfamiliar') return 'unfamiliar';

  const commands = entriesOf(read.settings).flatMap((e) => (e.hooks ?? []).map((h) => String(h.command ?? '')));
  const ours = commands.filter((c) => namesHook(c, EDIT_GATE_HOOK));

  if (ours.length) {
    const expected = path.join(kitHome, ...EDIT_GATE_HOOK.split('/'));
    if (ours.some((c) => namesHook(c, expected))) return 'current';
    const target = ours.map(registeredPath).find(Boolean);
    return target && exists(target) ? 'foreign' : 'dangling';
  }
  if (commands.some((c) => RETIRED_EDIT_GATE_HOOKS.some((name) => namesHook(c, name)))) return 'retired';
  return 'none';
}

/** The path inside a registered command, whether or not it is quoted. */
export function registeredPath(command) {
  const quoted = String(command).match(/"([^"]+)"/);
  if (quoted) return quoted[1];
  const bare = String(command).match(/(\S*edit-gate\.mjs)/);
  return bare ? bare[1] : '';
}

// ---------------------------------------------------------------- deploy

function listTree(root) {
  const out = [];
  const walk = (dir) => {
    for (const name of fs.readdirSync(dir)) {
      if (name === 'node_modules' || name === '.git') continue;
      const abs = path.join(dir, name);
      if (fs.statSync(abs).isDirectory()) { walk(abs); continue; }
      out.push(path.relative(root, abs).split(path.sep).join('/'));
    }
  };
  if (exists(root)) walk(root);
  return out;
}

/**
 * A deploy MIRRORS; it does not merge.
 *
 * `RETIRED_KIT_FILES` was a hand-maintained list of paths the kit used to ship, and it
 * only ever names what somebody remembered to add. Deploying a 26-module kit over a
 * 34-module one left 27 files from the previous implementation sitting in the deployed
 * tree - old modules, an old entrypoint, twelve old test files and five recipes that no
 * longer exist in any source. `decompose --recipes` listed ten recipes, half of them
 * from a kit that was replaced.
 *
 * The deployed tree is meant to BE the kit. So anything the source does not ship is
 * removed, and the list is reported rather than silent - a stale deployed copy silently
 * defeats an update, which is the whole reason ADR-0012 asked for pruning at all.
 */
function copyTree(from, to, { prune = [], mirror = false } = {}) {
  const written = [];
  const before = mirror ? new Set(listTree(to)) : new Set();

  const walk = (dir) => {
    for (const name of fs.readdirSync(dir)) {
      const abs = path.join(dir, name);
      const rel = path.relative(from, abs);
      if (rel.split(path.sep)[0] === 'node_modules' || name === '.git') continue;
      if (fs.statSync(abs).isDirectory()) { walk(abs); continue; }
      const target = path.join(to, rel);
      ensureDir(path.dirname(target));
      fs.copyFileSync(abs, target);
      if (process.platform !== 'win32' && rel.split(path.sep)[0] === 'githooks') fs.chmodSync(target, HOOK_MODE);
      written.push(rel.split(path.sep).join('/'));
    }
  };
  walk(from);

  const pruned = [];
  for (const rel of prune) {
    const target = path.join(to, ...rel.split('/'));
    if (!exists(target)) continue;
    fs.rmSync(target, { force: true });
    pruned.push(rel);
  }

  if (mirror) {
    const shipped = new Set(written);
    for (const rel of before) {
      if (shipped.has(rel) || pruned.includes(rel)) continue;
      fs.rmSync(path.join(to, ...rel.split('/')), { force: true });
      pruned.push(rel);
    }
    // Directories the pruning emptied are removed too, deepest first.
    for (const dir of [...new Set(pruned.map((rel) => path.dirname(rel)))].filter((d) => d !== '.').sort((a, b) => b.length - a.length)) {
      const abs = path.join(to, ...dir.split('/'));
      try { if (fs.readdirSync(abs).length === 0) fs.rmdirSync(abs); } catch { /* not empty, or gone */ }
    }
  }

  return { written, pruned };
}

/**
 * Copy the kit to `~/.agents/research-kit` and the skill to the personal root(s).
 * Overwrites by default - a stale deployed copy silently defeats an update - and prunes
 * kit files a past version shipped, because a copy-over deploy never removes anything.
 */
export function deploy({ from = KIT_ROOT, kitHome = KIT_HOME, env = process.env, dryRun = false, into = '' } = {}) {
  if (dryRun) return { dryRun: true, from, to: kitHome, prune: [...RETIRED_KIT_FILES] };

  const copied = copyTree(from, kitHome, { prune: RETIRED_KIT_FILES, mirror: true });
  const skills = [];
  const skillSource = path.join(from, 'skill');
  if (exists(skillSource)) {
    for (const target of skillLocations(env)) {
      copyTree(skillSource, target);
      skills.push(target);
    }
  }

  let bound = '';
  if (into) {
    const dir = path.join(into, ...runtimePaths(env).projectSkillDir.split('/'), 'research-first');
    copyTree(skillSource, dir);
    bound = dir;
  }

  const state = readInstallState(env) ?? {};
  writeInstallState({ ...state, kitHome, deployedFrom: from, skills, bound }, env);
  return { ok: true, from, to: kitHome, files: copied.written.length, pruned: copied.pruned, skills, bound };
}

export function uninstall({ env = process.env, gitPaths = {} } = {}) {
  const commit = removeCommitGate({ env, gitPaths });
  const edit = removeEditGate({ env });
  return { commit, edit };
}

export { ROLES, readJson };
