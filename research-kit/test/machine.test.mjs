// Everything outside the project: the three config states, the role, and the retired
// names (ADR-0002, ADR-0010, ADR-0012, ADR-0020).

import { test, describe, assert, tempDir, fs, path } from './harness.mjs';
import { writeText, readText } from '../lib/core.mjs';
import {
  readMachineConfig, loadConfig, saveConfig, posture, machineRole, collectionPolicy,
  collectionRefusal, evidencePolicy, runtimePaths, skillLocations, retiredEnvNotes,
  RUNTIME_ANCHORS, RETIRED_ENV_VARS, RETIRED_CONFIG_KEYS, DEFAULTS, ROLES,
} from '../lib/machine.mjs';

describe('machine');

function envWith(contents, { snapshot = null, extra = {} } = {}) {
  const dir = tempDir('research-kit-config-');
  const file = path.join(dir, 'research-kit.config.json');
  if (contents !== null) writeText(file, contents);
  if (snapshot !== null) writeText(`${file}.last-good`, snapshot);
  return { env: { ...process.env, RESEARCH_KIT_CONFIG: file, ...extra }, file };
}

test('absent: the fail-open default IS the answer, and the state says so', () => {
  const { env } = envWith(null);
  const read = readMachineConfig(env);
  assert.equal(read.state, 'absent');
  assert.equal(read.settings.failOpen, true);
  assert.equal(posture(env).exitCode, 0);
});

test('readable: the config decides, and a read snapshots it', () => {
  const { env, file } = envWith(JSON.stringify({ failOpen: false, role: 'builder', evidencePolicy: 'strict' }));
  const read = readMachineConfig(env);
  assert.equal(read.state, 'readable');
  assert.equal(read.settings.failOpen, false);
  assert.equal(read.settings.role, 'builder');
  assert.equal(read.settings.evidencePolicy, 'strict');
  assert.ok(fs.existsSync(`${file}.last-good`), 'every successful read snapshots the config');
});

test('unreadable with nothing to hold makes the ROLE unknown, and unknown does not collect', () => {
  const { env } = envWith('{"role": "buil');
  const read = readMachineConfig(env);
  assert.equal(read.settings.role, 'unknown',
    'the default collector is the role that may spend credits - it must not be adopted by a machine whose config could not be read');

  const policy = collectionPolicy(env);
  assert.equal(policy.mayCollect, false);
  assert.match(policy.reason, /cannot be established/);
  assert.match(policy.remedy, /--role collector\|builder/);
});

test('a role the kit does not know is unknown too - a misspelling is not a default', () => {
  const { env } = envWith(JSON.stringify({ role: 'collecter' }));
  assert.equal(machineRole(env), 'unknown');
  assert.equal(collectionPolicy(env).mayCollect, false);
});

test('an ABSENT config still reads as collector - ADR-0010\'s default is untouched', () => {
  const { env } = envWith(null);
  assert.equal(machineRole(env), 'collector');
  assert.equal(collectionPolicy(env).mayCollect, true);
});

test('unreadable: a truncated config holds the last one that parsed - every knob, not just failOpen', () => {
  const { env } = envWith('{"failOpen": fal', {
    snapshot: JSON.stringify({ failOpen: false, role: 'builder', evidencePolicy: 'strict', editGate: { mode: 'hard-block' } }),
  });
  const read = readMachineConfig(env);
  assert.equal(read.state, 'unreadable');
  assert.equal(read.settings.failOpen, false, 'a hardened machine must not silently revert to fail-open');
  assert.equal(read.settings.role, 'builder', 'a builder must not silently become a collector - that role may spend credits');
  assert.equal(read.settings.evidencePolicy, 'strict');
  assert.equal(read.settings.editGate.mode, 'hard-block');
  assert.ok(read.error, 'the parse error is carried, not swallowed');
});

test('unreadable with nothing to hold fails CLOSED, and tightens exactly two knobs', () => {
  const { env } = envWith('{"failOpen": fal');
  const read = readMachineConfig(env);
  assert.equal(read.state, 'unreadable');
  assert.equal(read.settings.failOpen, false);
  assert.equal(read.settings.role, 'unknown', 'the role is the second knob with a safe restrictive answer');
  assert.equal(read.settings.evidencePolicy, DEFAULTS.evidencePolicy, 'the rest have none and are left alone');
  assert.equal(posture(env).exitCode, 2, 'unreadable and resolved to blocking is its own code');
});

test('posture carries where its answer came from, so no consumer has to guess', () => {
  assert.equal(posture(envWith(null).env).resolvedFrom, 'defaults');
  assert.equal(posture(envWith('{"failOpen": true}').env).resolvedFrom, 'config');
  assert.equal(posture(envWith('{bad', { snapshot: '{"failOpen": true}' }).env).resolvedFrom, 'snapshot');
  assert.equal(posture(envWith('{bad').env).resolvedFrom, 'fallback-closed');
});

test('a retired config key is READ into the current shape, then reported', () => {
  const { env } = envWith(JSON.stringify({ claudeGate: 'hard-block' }));
  const read = readMachineConfig(env);
  assert.equal(read.settings.editGate.mode, 'hard-block',
    'a rename that silently relaxes a gate is the same defect as one that stops it firing');
  assert.deepEqual(read.retiredKeys, ['claudeGate']);
  assert.equal(RETIRED_CONFIG_KEYS.claudeGate, 'editGate.mode');
});

test('saveConfig drops the retired key, so the migration happens through normal use', () => {
  const { env, file } = envWith(JSON.stringify({ claudeGate: 'hard-block' }));
  saveConfig({ role: 'builder' }, env);
  const written = JSON.parse(readText(file));
  assert.equal('claudeGate' in written, false);
  assert.equal(written.editGate.mode, 'hard-block', 'the value it carried survives the rename');
  assert.equal(written.role, 'builder');
});

test('a retired ENVIRONMENT variable is reported and never honoured', () => {
  const { env } = envWith(null, { extra: { CLAUDE_SETTINGS_PATH: '/somewhere/settings.json' } });
  const notes = retiredEnvNotes(env);
  assert.equal(notes[0].name, 'CLAUDE_SETTINGS_PATH');
  assert.equal(notes[0].replacement, RETIRED_ENV_VARS.CLAUDE_SETTINGS_PATH);
  assert.notEqual(runtimePaths(env).settingsPath, '/somewhere/settings.json', 'an export must not decide where the gate installs');
});

test('the retired variable goes quiet once its replacement is set', () => {
  const { env } = envWith(null, { extra: { CLAUDE_SETTINGS_PATH: '/old.json', RESEARCH_KIT_EDIT_GATE_SETTINGS: '/new.json' } });
  assert.equal(retiredEnvNotes(env).length, 0, 'an operator who set the new variable has answered the question');
  assert.equal(runtimePaths(env).settingsPath, '/new.json');
});

test('the anchors are DEFAULTS the machine config overrides', () => {
  const plain = envWith(null).env;
  assert.equal(runtimePaths(plain).settingsPath, RUNTIME_ANCHORS.settingsPath);
  assert.deepEqual(skillLocations(plain), RUNTIME_ANCHORS.skillRoots.map((root) => path.join(root, 'research-first')));

  const { env } = envWith(JSON.stringify({
    editGate: { settingsPath: '/custom/settings.json' },
    skillRoots: ['/custom/skills'],
    projectSkillDir: '.agent/skills',
  }));
  assert.equal(runtimePaths(env).settingsPath, '/custom/settings.json');
  assert.equal(runtimePaths(env).projectSkillDir, '.agent/skills');
  assert.deepEqual(skillLocations(env), [path.join('/custom/skills', 'research-first')]);
});

test('an unset role defaults to collector; a declared one is taken; ROLES stays the two', () => {
  assert.equal(machineRole(envWith(null).env), 'collector');
  assert.equal(machineRole(envWith(JSON.stringify({ role: 'builder' })).env), 'builder');
  assert.deepEqual([...ROLES], ['collector', 'builder'], 'unknown is a state, never something to declare');
});

test('collectionPolicy is the one answer to "may this machine collect?"', () => {
  const collector = collectionPolicy(envWith(JSON.stringify({ role: 'collector' })).env);
  assert.equal(collector.mayCollect, true);

  const builder = collectionPolicy(envWith(JSON.stringify({ role: 'builder' })).env);
  assert.equal(builder.mayCollect, false);
  assert.match(builder.remedy, /--role collector/, 'the remedy is a deliberate, recorded act');
  assert.match(collectionRefusal(builder), /forges a corpus/);
});

test('evidencePolicy is the operator\'s call, not the agent\'s', () => {
  assert.equal(evidencePolicy(envWith(null).env), 'pluralist');
  assert.equal(evidencePolicy(envWith(JSON.stringify({ evidencePolicy: 'strict' })).env), 'strict');
  assert.equal(evidencePolicy(envWith(JSON.stringify({ evidencePolicy: 'whatever' })).env), 'pluralist');
});

test('loadConfig never throws on a hostile file - it resolves a posture instead', () => {
  for (const body of ['', 'null', '[]', '"a string"', '{', 'undefined']) {
    const { env } = envWith(body);
    assert.doesNotThrow(() => loadConfig(env), `body: ${JSON.stringify(body)}`);
  }
});
