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
  assert.equal(settingsState({ env }), 'current');
});

test('a registration at a RETIRED name is REPLACED, not doubled, and the repair is reported', () => {
  const { env, settingsFile } = machine({
    settings: {
      hooks: { PreToolUse: [{ matcher: MATCHER, hooks: [{ type: 'command', command: `node "/old/kit/${RETIRED_EDIT_GATE_HOOKS[0]}"` }] }] },
    },
  });
  assert.equal(settingsState({ env }), 'retired', 'an un-upgraded machine reads as repairable, not healthy or broken');

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
