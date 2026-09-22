// Diagnostics and install/repair. Both run against disposable fixtures: explicit
// config and settings paths, an injected probe, and no host state consulted.

import { test, describe, assert, makePassingProject, makeProject, corrupt, tempDir, fs, path, KIT_ROOT } from './harness.mjs';
import { PATHS, resolve, readText, writeText, readJson } from '../lib/core.mjs';
import { runDoctor, machineHealth, gateHealth, editGateState } from '../lib/doctor.mjs';
import { installEditGate, removeEditGate, settingsState, retiredRepairNote, MATCHER } from '../lib/installer.mjs';
import { EDIT_GATE_HOOK, RETIRED_EDIT_GATE_HOOKS } from '../lib/machine.mjs';

describe('doctor');

const ABSENT = () => ({ installed: false, authenticated: false, version: null, credits: null });
const READY = () => ({ installed: true, authenticated: true, version: '1.4.0', credits: 940 });
const KEYLESS = () => ({ installed: true, authenticated: false, version: '1.4.0', credits: null });

function machine({ config = {}, settings = undefined } = {}) {
  const dir = tempDir('research-kit-machine-');
  const configFile = path.join(dir, 'research-kit.config.json');
  const settingsFile = path.join(dir, 'settings.json');
  if (settings !== undefined) writeText(settingsFile, typeof settings === 'string' ? settings : JSON.stringify(settings, null, 2));
  writeText(configFile, JSON.stringify({ ...config, editGate: { settingsPath: settingsFile, ...(config.editGate ?? {}) } }));
  return { dir, configFile, settingsFile, env: { ...process.env, RESEARCH_KIT_CONFIG: configFile, RESEARCH_KIT_INSTALL_STATE: path.join(dir, 'install.json') } };
}

const find = (findings, name) => findings.find((f) => f.name === name);

test('a healthy collector reports its credential state as a pass', () => {
  const { env } = machine({ config: { role: 'collector' } });
  const findings = machineHealth({ env, probe: READY });
  assert.equal(find(findings, 'firecrawl-cli').severity, 'pass');
  assert.equal(find(findings, 'firecrawl-auth').severity, 'pass');
  assert.match(find(findings, 'firecrawl-auth').detail, /940 credits/);
});

test('a collector without a key is a FAIL - a collector that cannot collect is broken', () => {
  const { env } = machine({ config: { role: 'collector' } });
  const findings = machineHealth({ env, probe: KEYLESS });
  assert.equal(find(findings, 'firecrawl-auth').severity, 'fail');
  assert.match(find(findings, 'firecrawl-auth').fix, /firecrawl login/);
});

test('on a BUILDER the same state is informational - a gate that is always red is one nobody reads', () => {
  const { env } = machine({ config: { role: 'builder' } });
  const findings = machineHealth({ env, probe: ABSENT });
  assert.equal(find(findings, 'firecrawl-cli').severity, 'pass');
  assert.match(find(findings, 'firecrawl-cli').detail, /expected on a builder/);
  assert.match(find(findings, 'machine-role').detail, /must NOT collect/);
});

test('the role and its consequence are reported on every run', () => {
  const { env } = machine({ config: { role: 'collector' } });
  assert.match(find(machineHealth({ env, probe: READY }), 'machine-role').detail, /collector - this machine may collect/);
});

test('an unreadable machine config is a blocking CRITICAL that names the resolved posture', () => {
  const { env, configFile } = machine({});
  writeText(configFile, '{"failOpen": fal');
  const findings = machineHealth({ env, probe: READY });
  const finding = find(findings, 'machine-config');
  assert.equal(finding.severity, 'critical');
  assert.match(finding.detail, /does not parse/);
  assert.match(finding.detail, /fail-CLOSED/);
});

test('a retired config key and a retired env var are both reported', () => {
  const { env, configFile } = machine({});
  writeText(configFile, JSON.stringify({ claudeGate: 'hard-block' }));
  const findings = machineHealth({ env: { ...env, CLAUDE_SETTINGS_PATH: '/old.json' }, probe: READY });
  assert.match(find(findings, 'config-retired-key').detail, /claudeGate/);
  assert.match(find(findings, 'env-retired').detail, /NOT honoured/);
});

test('doctor reports the gate, the chain, the shape and the verdict from ONE snapshot', () => {
  const dir = makePassingProject();
  const { env } = machine({});
  const report = runDoctor(dir, { env, probe: READY, record: false });

  assert.equal(find(report.findings, 'project-gated').severity, 'pass');
  assert.equal(find(report.findings, 'preflight').severity, 'pass');
  assert.match(find(report.findings, 'ledger-chain').detail, /chain verifies/);
  assert.equal(find(report.findings, 'overrides').detail, 'none recorded');
});

test('a failing verdict and a broken chain are both blockers, each named', () => {
  const dir = makePassingProject();
  corrupt(dir, PATHS.discovery, (text) => text.replace('CLOSED', 'OPEN'));
  corrupt(dir, PATHS.ledger, (text) => text.replace('"seq":1', '"seq":5'));

  const { env } = machine({});
  const report = runDoctor(dir, { env, probe: READY, record: false });
  assert.equal(report.ok, false);
  assert.equal(find(report.findings, 'preflight').severity, 'fail');
  assert.equal(find(report.findings, 'ledger-chain').severity, 'fail');
});

test('doctor counts each override by kind', () => {
  const dir = makePassingProject();
  writeText(resolve(dir, PATHS.overrides), [
    '2026-09-17T00:00:00.000Z\tGATE_OFF\tcommit gate',
    '2026-09-17T00:01:00.000Z\tGATE_OFF\tedit gate',
    '2026-09-17T00:02:00.000Z\tlocal-hooks-path\t.husky',
  ].join('\n'));

  const { env } = machine({});
  const finding = find(runDoctor(dir, { env, probe: READY, record: false }).findings, 'overrides');
  assert.match(finding.detail, /GATE_OFF x2/);
  assert.match(finding.detail, /local-hooks-path x1/);
});

test('an ungated project is reported as such rather than judged', () => {
  const dir = tempDir('research-kit-plain-');
  const { env } = machine({});
  const report = runDoctor(dir, { env, probe: READY, record: false });
  assert.equal(find(report.findings, 'project-gated').severity, 'warn');
  assert.equal(find(report.findings, 'preflight'), undefined, 'there is nothing to judge');
});

test('doctor is read-only about the corpus', () => {
  const dir = makePassingProject();
  const before = readText(resolve(dir, PATHS.ledger));
  const { env } = machine({});
  runDoctor(dir, { env, probe: READY, record: false });
  assert.equal(readText(resolve(dir, PATHS.ledger)), before);
});

// --- the edit-time gate ------------------------------------------------------------

test('installEditGate writes exactly one registration, pointing at the current hook', () => {
  const { env, settingsFile } = machine({ settings: {} });
  const result = installEditGate({ kitHome: KIT_ROOT, env });
  assert.equal(result.ok, true, result.reason);

  const settings = readJson(settingsFile);
  const hooks = settings.hooks.PreToolUse;
  assert.equal(hooks.length, 1);
  assert.equal(hooks[0].matcher, MATCHER);
  assert.match(hooks[0].hooks[0].command, new RegExp(EDIT_GATE_HOOK.replace('/', '[\\\\/]')));
  // Asked with the kitHome it was installed against - the state is about WHICH kit the
  // registration points at, so the question has to name one.
  assert.equal(settingsState({ env, kitHome: KIT_ROOT }), 'current');
});

test('a registration at a RETIRED name is REPLACED, not doubled, and the repair is reported', () => {
  const { env, settingsFile } = machine({
    settings: {
      hooks: { PreToolUse: [{ matcher: MATCHER, hooks: [{ type: 'command', command: `node "/old/kit/${RETIRED_EDIT_GATE_HOOKS[0]}"` }] }] },
    },
  });
  assert.equal(settingsState({ env, kitHome: KIT_ROOT }), 'retired', 'an un-upgraded machine reads as repairable, not healthy or broken');

  const result = installEditGate({ kitHome: KIT_ROOT, env });
  const hooks = readJson(settingsFile).hooks.PreToolUse;
  assert.equal(hooks.length, 1, 'a stale entry must never be left beside a new one');
  assert.doesNotMatch(hooks[0].hooks[0].command, new RegExp(RETIRED_EDIT_GATE_HOOKS[0].replace('/', '[\\\\/]')));
  assert.match(result.note, /replaced 1 registration/);
  assert.match(retiredRepairNote(['a', 'b']), /replaced 2 registration/);
});

test('installing twice leaves one registration, not two', () => {
  const { env, settingsFile } = machine({ settings: {} });
  installEditGate({ kitHome: KIT_ROOT, env });
  installEditGate({ kitHome: KIT_ROOT, env });
  assert.equal(readJson(settingsFile).hooks.PreToolUse.length, 1);
});

test("the operator's OTHER hooks and unknown keys survive the write", () => {
  const { env, settingsFile } = machine({
    settings: {
      model: '<unknown-model>',
      env: { PROVIDER_API_KEY: 'x', PROVIDER_BASE_URL: 'y' },
      hooks: { PreToolUse: [{ matcher: 'Bash', hooks: [{ type: 'command', command: 'node /theirs.mjs' }] }] },
    },
  });
  installEditGate({ kitHome: KIT_ROOT, env });

  const settings = readJson(settingsFile);
  assert.equal(settings.model, '<unknown-model>');
  assert.deepEqual(settings.env, { PROVIDER_API_KEY: 'x', PROVIDER_BASE_URL: 'y' });
  assert.equal(settings.hooks.PreToolUse.length, 2, "the operator's own hook is not ours to remove");
  assert.ok(settings.hooks.PreToolUse.some((e) => e.matcher === 'Bash'));
});

test('a settings file the installer does not recognise is REFUSED, never rewritten', () => {
  const { env, settingsFile } = machine({ settings: '[[[ not settings at all' });
  const result = installEditGate({ kitHome: KIT_ROOT, env });
  assert.equal(result.ok, false);
  assert.match(result.reason, /does not recognise/);
  assert.equal(readText(settingsFile), '[[[ not settings at all', 'the file is untouched');
});

test('a backup is written before the settings file is changed', () => {
  const { env, settingsFile } = machine({ settings: { model: 'keep-me' } });
  installEditGate({ kitHome: KIT_ROOT, env });
  const backups = fs.readdirSync(path.dirname(settingsFile)).filter((n) => n.includes('settings.json.bak-'));
  assert.equal(backups.length, 1);
  assert.match(readText(path.join(path.dirname(settingsFile), backups[0])), /keep-me/);
});

test('--dry-run writes nothing and says what it would do', () => {
  const { env, settingsFile } = machine({ settings: {} });
  const before = readText(settingsFile);
  const result = installEditGate({ kitHome: KIT_ROOT, env, dryRun: true });
  assert.equal(result.dryRun, true);
  assert.match(result.would, /edit-gate\.mjs/);
  assert.equal(readText(settingsFile), before);
});

test('removeEditGate takes out a retired entry too', () => {
  const { env, settingsFile } = machine({
    settings: { hooks: { PreToolUse: [
      { matcher: MATCHER, hooks: [{ type: 'command', command: `node "/old/${RETIRED_EDIT_GATE_HOOKS[0]}"` }] },
      { matcher: 'Bash', hooks: [{ type: 'command', command: 'node /theirs.mjs' }] },
    ] } },
  });
  const result = removeEditGate({ env });
  assert.equal(result.removed, 1);
  const hooks = readJson(settingsFile).hooks.PreToolUse;
  assert.equal(hooks.length, 1);
  assert.equal(hooks[0].matcher, 'Bash');
});

test('gateHealth reports the edit gate in three states', () => {
  assert.equal(editGateState(null), 'none');
  assert.equal(editGateState({}), 'none');
  assert.equal(editGateState({ hooks: { PreToolUse: [{ hooks: [{ command: `node ${EDIT_GATE_HOOK}` }] }] } }), 'current');
  assert.equal(editGateState({ hooks: { PreToolUse: [{ hooks: [{ command: `node ${RETIRED_EDIT_GATE_HOOKS[0]}` }] }] } }), 'retired');
});

test('gateHealth names an absent commit gate and the command that installs it', () => {
  const dir = makeProject();
  const { env } = machine({ settings: {} });
  const findings = gateHealth(dir, { env, gitPaths: { cwd: dir }, record: false });
  const commit = find(findings, 'gate-commit');
  assert.ok(['warn', 'pass', 'fail'].includes(commit.severity));
  if (commit.severity === 'warn') assert.match(commit.fix, /install-hooks\.mjs/);
});

// --- deploy mirrors, it does not merge --------------------------------------------

test('deploy MIRRORS: a file the source no longer ships is removed from the deployed tree', async () => {
  const { deploy } = await import('../lib/installer.mjs');
  const source = tempDir('research-kit-src-');
  const target = tempDir('research-kit-dst-');

  writeText(path.join(source, 'lib', 'core.mjs'), 'export const a = 1;\n');
  writeText(path.join(source, 'recipes', 'kept.md'), '# kept\n');

  // The deployed tree still holds a previous version's files.
  writeText(path.join(target, 'lib', 'core.mjs'), 'export const a = 0;\n');
  writeText(path.join(target, 'lib', 'release-validator.mjs'), 'export const old = true;\n');
  writeText(path.join(target, 'recipes', 'retired-recipe.md'), '# from a kit that was replaced\n');
  writeText(path.join(target, 'schemas', 'old.schema.json'), '{}\n');

  const { env } = { env: { ...process.env, RESEARCH_KIT_INSTALL_STATE: path.join(target, 'install.json') } };
  const result = deploy({ from: source, kitHome: target, env });

  assert.equal(fs.existsSync(path.join(target, 'lib', 'release-validator.mjs')), false,
    'a module from the previous implementation must not survive an update');
  assert.equal(fs.existsSync(path.join(target, 'recipes', 'retired-recipe.md')), false,
    'decompose --recipes listed ten recipes, half from a kit that no longer existed');
  assert.equal(fs.existsSync(path.join(target, 'schemas')), false, 'and an emptied directory goes too');
  assert.equal(readText(path.join(target, 'lib', 'core.mjs')), 'export const a = 1;\n', 'what IS shipped is updated');
  assert.ok(fs.existsSync(path.join(target, 'recipes', 'kept.md')));

  assert.ok(result.pruned.includes('lib/release-validator.mjs'), 'and the pruning is reported, not silent');
  assert.ok(result.pruned.includes('recipes/retired-recipe.md'));
});

test('deploy does NOT mirror a skill root - it holds other people\'s skills too', async () => {
  const { deploy } = await import('../lib/installer.mjs');
  const source = tempDir('research-kit-src2-');
  writeText(path.join(source, 'skill', 'SKILL.md'), '# research-first\n');
  const skillRoot = tempDir('research-kit-skills-');
  writeText(path.join(skillRoot, 'someone-elses-skill', 'SKILL.md'), '# not ours\n');

  const env = {
    ...process.env,
    RESEARCH_KIT_CONFIG: (() => {
      const f = path.join(tempDir('research-kit-cfg-'), 'c.json');
      writeText(f, JSON.stringify({ skillRoots: [skillRoot] }));
      return f;
    })(),
    RESEARCH_KIT_INSTALL_STATE: path.join(tempDir('research-kit-state-'), 'install.json'),
  };
  deploy({ from: source, kitHome: tempDir('research-kit-dst2-'), env });

  assert.ok(fs.existsSync(path.join(skillRoot, 'someone-elses-skill', 'SKILL.md')),
    'mirroring a shared skill root would delete skills the kit never owned');
});

// --- recorded is not current -------------------------------------------------------

/** A source tree and a deployment of it, with the drift the caller asks for. */
async function deployed({ stale = false, missing = false, orphan = false, skillStale = false } = {}) {
  const { deploy, deployedDrift } = await import('../lib/installer.mjs');
  const source = tempDir('research-kit-drift-src-');
  const target = tempDir('research-kit-drift-dst-');
  const skillRoot = tempDir('research-kit-drift-skills-');
  writeText(path.join(source, 'lib', 'core.mjs'), 'export const a = 1;\n');
  writeText(path.join(source, 'bin', 'prior.mjs'), '// the step shipped this morning\n');
  writeText(path.join(source, 'skill', 'SKILL.md'), '# research-first\n\n3. Register your prior.\n');

  const cfg = path.join(tempDir('research-kit-drift-cfg-'), 'c.json');
  writeText(cfg, JSON.stringify({ skillRoots: [skillRoot] }));
  const env = {
    ...process.env,
    RESEARCH_KIT_CONFIG: cfg,
    // Beside the deployment, never inside it - INSTALL_STATE_PATH is a SIBLING of
    // kitHome, and a fixture that put it within would report it as an orphan forever.
    RESEARCH_KIT_INSTALL_STATE: path.join(tempDir('research-kit-drift-state-'), 'install.json'),
  };
  deploy({ from: source, kitHome: target, env });

  // Now the source moves on, or the deployment is damaged, which is the same thing.
  if (stale) writeText(path.join(source, 'lib', 'core.mjs'), 'export const a = 2;\n');
  if (missing) writeText(path.join(source, 'lib', 'brand-new.mjs'), 'export const b = 1;\n');
  if (orphan) writeText(path.join(target, 'lib', 'left-behind.mjs'), 'export const old = 1;\n');
  if (skillStale) writeText(path.join(source, 'skill', 'SKILL.md'), '# research-first\n\n3. Register your prior.\n4. Collect.\n');

  return { source, target, env, drift: () => deployedDrift({ from: source, kitHome: target, env }) };
}

test('a deployment that matches its source reports no drift', async () => {
  const { drift } = await deployed();
  assert.equal(drift().drifted, 0);
});

test('doctor sees a deployment that is merely RECORDED, not current', async () => {
  // The defect this replaces, measured on the real machine on 2026-09-22: the check read
  // the install STATE and stopped - "kit deployed <date>", pass, READY - while the deployed
  // kit was missing 119 files and carrying 38 stale ones, including a skill that described
  // a protocol without the step shipped that morning.
  //
  // An agent invoking the skill runs the DEPLOYED copy. So a health check that confirms an
  // install happened, and never that it matches, reports a machine as ready while every fix
  // since that install exists only in the repository.
  const { drift } = await deployed({ stale: true, missing: true });
  const d = drift();
  assert.ok(d.kit.changed.includes('lib/core.mjs'), 'a file whose bytes moved on is stale');
  assert.ok(d.kit.missing.includes('lib/brand-new.mjs'), 'a file added since the install is missing');
  assert.equal(d.drifted, 2);
});

test('a file the deployment kept and the source no longer ships is reported as orphaned', async () => {
  const { drift } = await deployed({ orphan: true });
  const d = drift();
  assert.deepEqual(d.kit.extra, ['lib/left-behind.mjs']);
  assert.ok(d.drifted > 0);
});

test('a stale SKILL is reported on its own, because that is what an agent reads', async () => {
  // The skill drifts independently of the kit: it is copied to a different root, and it is
  // the file that tells an agent what the protocol IS. A current kit under a stale skill is
  // a machine that has the fix and will not use it.
  const { drift } = await deployed({ skillStale: true });
  const d = drift();
  // The kit deployment CONTAINS skill/, so a moved SKILL.md legitimately shows in both.
  // What matters is that the skill root is reported on its own, by location.
  assert.deepEqual(d.kit.changed, ['skill/SKILL.md']);
  assert.equal(d.skills.length, 1);
  assert.deepEqual(d.skills[0].changed, ['SKILL.md']);
  assert.ok(d.drifted > 0, 'a stale skill alone is still drift');
});

test('the drift note names what moved and what to run', async () => {
  const { driftNote } = await import('../lib/installer.mjs');
  const { drift } = await deployed({ stale: true, missing: true });
  const note = driftNote(drift());
  assert.match(note, /1 missing/);
  assert.match(note, /1 stale/);
  assert.match(note, /lib\/(brand-new|core)\.mjs/, 'a count without an example is not actionable');
  assert.equal(driftNote({ drifted: 0 }), '', 'silence when it matches');
});

test('the drift check reports and never repairs', async () => {
  // A health check that quietly rewrote what it was measuring would erase the evidence of
  // the problem it just found, and `doctor` is documented read-only apart from one override
  // log. Pinned structurally rather than by phrasing.
  const { drift, target } = await deployed({ stale: true, missing: true });
  drift();
  assert.equal(fs.existsSync(path.join(target, 'lib', 'brand-new.mjs')), false,
    'deployedDrift installed the missing file instead of reporting it');
  assert.equal(readText(path.join(target, 'lib', 'core.mjs')), 'export const a = 1;\n',
    'deployedDrift overwrote the stale file instead of reporting it');
});

// --- a registration must point at the DEPLOYED kit, not merely name the hook ------

test('a registration naming our hook in SOMEBODY ELSE\'S tree is foreign, not current', () => {
  const foreignKit = tempDir('research-kit-foreign-');
  writeText(path.join(foreignKit, 'hooks', 'edit-gate.mjs'), '// another checkout entirely\n');
  const { env } = machine({
    settings: { hooks: { PreToolUse: [{ matcher: MATCHER, hooks: [{ type: 'command', command: `node "${path.join(foreignKit, 'hooks', 'edit-gate.mjs')}"` }] }] } },
  });

  assert.equal(settingsState({ env, kitHome: tempDir('research-kit-deployed-') }), 'foreign',
    'this machine had exactly this: the gate that ran belonged to a different implementation');
});

test('a registration pointing at a hook that is not on disk is dangling', () => {
  const { env } = machine({
    settings: { hooks: { PreToolUse: [{ matcher: MATCHER, hooks: [{ type: 'command', command: 'node "/gone/research-kit/hooks/edit-gate.mjs"' }] }] } },
  });
  assert.equal(settingsState({ env, kitHome: tempDir('research-kit-deployed2-') }), 'dangling',
    'ADR-0012: no registration may point at a hook file that no longer exists');
});

test('a registration pointing at the deployed kit is current', () => {
  const kitHome = tempDir('research-kit-deployed3-');
  writeText(path.join(kitHome, 'hooks', 'edit-gate.mjs'), '// the deployed kit\n');
  const { env } = machine({
    settings: { hooks: { PreToolUse: [{ matcher: MATCHER, hooks: [{ type: 'command', command: `node "${path.join(kitHome, 'hooks', 'edit-gate.mjs')}"` }] }] } },
  });
  assert.equal(settingsState({ env, kitHome }), 'current');
});

test('doctor reports foreign and dangling as BLOCKERS, with the repair', async () => {
  const { runDoctor } = await import('../lib/doctor.mjs');
  const foreignKit = tempDir('research-kit-foreign2-');
  writeText(path.join(foreignKit, 'hooks', 'edit-gate.mjs'), '// elsewhere\n');
  const { env } = machine({
    settings: { hooks: { PreToolUse: [{ matcher: MATCHER, hooks: [{ type: 'command', command: `node "${path.join(foreignKit, 'hooks', 'edit-gate.mjs')}"` }] }] } },
  });

  const report = runDoctor(makePassingProject(), { env, probe: READY, record: false });
  const finding = find(report.findings, 'gate-edit');
  assert.equal(finding.severity, 'fail', 'green here means the operator believes a gate is installed that is not this one');
  assert.match(finding.detail, /OUTSIDE the deployed kit/);
  assert.match(finding.fix, /--edit-only/);
});

test('registeredPath reads the path out of a command, quoted or bare', async () => {
  const { registeredPath } = await import('../lib/installer.mjs');
  assert.equal(registeredPath('node "C:/a b/research-kit/hooks/edit-gate.mjs"'), 'C:/a b/research-kit/hooks/edit-gate.mjs');
  assert.equal(registeredPath('node /opt/kit/hooks/edit-gate.mjs'), '/opt/kit/hooks/edit-gate.mjs');
  assert.equal(registeredPath('node /opt/kit/hooks/other.mjs'), '');
});
