// The canonical project shape has one owner (ADR-0001). These are the tests that would
// have caught the drift: 76 of 112 tests failing on a fresh checkout because the fixture
// invented a directory the template never carried.

import { test, describe, assert, makeProject, tempDir, fs, path, KIT_ROOT } from './harness.mjs';
import { PATHS, resolve, readText, writeText } from '../lib/core.mjs';
import {
  LAYOUT, GATE_MARKERS, HOOK_MODE, hookExecutability, scaffoldProject, createEmptyProject,
  validateProject, renderTemplate, unresolvedPlaceholders, templateFiles, TEMPLATE_DIR,
} from '../lib/scaffold.mjs';
import { isGated } from '../lib/gate.mjs';

describe('scaffold');

test('LAYOUT holds twelve entries and is the one definition of shape', () => {
  assert.equal(LAYOUT.length, 12);
  assert.equal(new Set(LAYOUT.map((e) => e.path)).size, 12, 'no entry is declared twice');
});

test('the gate markers DERIVE from LAYOUT rather than keeping their own list', () => {
  assert.deepEqual([...GATE_MARKERS], LAYOUT.filter((e) => e.gating).map((e) => e.path));
  assert.equal(GATE_MARKERS.length, 4);
});

test('.gitattributes is a LAYOUT entry but NOT a gate marker', () => {
  assert.ok(LAYOUT.some((e) => e.path === PATHS.gitattributes));
  assert.equal(GATE_MARKERS.includes(PATHS.gitattributes), false,
    'a project without it still gates - it just breaks on a Windows builder');
});

test('kit.json and the architecture map travel with the scaffold, and neither gates', () => {
  for (const entry of [PATHS.kit, PATHS.architecture]) {
    assert.ok(LAYOUT.some((e) => e.path === entry), `${entry} is missing from LAYOUT`);
    assert.equal(GATE_MARKERS.includes(entry), false);
  }
});

test('the fixture and the scaffolder are the same call', () => {
  const empty = createEmptyProject(tempDir());
  for (const entry of LAYOUT) {
    const abs = resolve(empty, entry.path);
    assert.ok(fs.existsSync(abs), `createEmptyProject did not produce ${entry.path}`);
  }
  assert.ok(fs.existsSync(path.join(empty, 'research', 'raw')), 'research/raw/ is real, not invented by a fixture');
});

test('scaffoldProject renders every template file with no placeholder left behind', () => {
  const dir = scaffoldProject(tempDir(), { topic: 'Widget pricing', kit: '~/.agents/research-kit' }).dir;
  for (const rel of templateFiles()) {
    const text = readText(resolve(dir, rel));
    assert.notEqual(text, null, `${rel} was not written`);
    assert.deepEqual(unresolvedPlaceholders(text), [], `${rel} still holds a placeholder`);
  }
  assert.match(readText(resolve(dir, PATHS.discovery)), /Widget pricing/);
});

test('structure is always repaired; content is never clobbered without --force', () => {
  const dir = scaffoldProject(tempDir(), { topic: 'First' }).dir;
  writeText(resolve(dir, PATHS.evidence), '# my own evidence, irreplaceable\n');
  fs.rmSync(resolve(dir, PATHS.raw), { recursive: true });

  const again = scaffoldProject(dir, { topic: 'Second' });
  assert.match(readText(resolve(dir, PATHS.evidence)), /irreplaceable/, 'evidence is never overwritten by default');
  assert.ok(again.repaired.includes(PATHS.raw), 'a missing research/raw/ comes back on every run');
  assert.ok(fs.existsSync(resolve(dir, PATHS.raw)));

  scaffoldProject(dir, { topic: 'Third', force: true });
  assert.doesNotMatch(readText(resolve(dir, PATHS.evidence)), /irreplaceable/, '--force is the deliberate act');
});

test('a scaffolded project is gated, and shaped', () => {
  const dir = scaffoldProject(tempDir(), { topic: 'Anything' }).dir;
  assert.equal(isGated(dir), true);
  const shape = validateProject(dir);
  assert.equal(shape.ok, true, shape.findings.map((f) => f.detail).join('; '));
});

test('validateProject fails a missing gating artifact and an unresolved placeholder', () => {
  const dir = scaffoldProject(tempDir(), { topic: 'Anything' }).dir;
  fs.rmSync(resolve(dir, PATHS.plan));
  writeText(resolve(dir, PATHS.sources), '# Sources for {{TOPIC}}\n');

  const shape = validateProject(dir);
  assert.equal(shape.ok, false);
  assert.ok(shape.findings.some((f) => f.rule === 'shape-missing' && f.path === PATHS.plan));
  assert.ok(shape.findings.some((f) => f.rule === 'unresolved-placeholder' && f.detail.includes('{{TOPIC}}')));
});

test('validateProject never judges contract CONTENT - that stays preflight\'s job', () => {
  const dir = scaffoldProject(tempDir(), { topic: 'Anything' }).dir;
  assert.equal(validateProject(dir).ok, true, 'an empty contract is a shape that is fine and a verdict that is not');
});

test('renderTemplate leaves an unknown token alone rather than emptying it', () => {
  assert.equal(renderTemplate('a {{TOPIC}} b {{UNKNOWN}}', { TOPIC: 'x' }), 'a x b {{UNKNOWN}}');
});

test('the template ships .gitattributes, so a scaffolded project cannot be born without it', () => {
  assert.ok(templateFiles().includes('.gitattributes'));
  const text = readText(path.join(TEMPLATE_DIR, '.gitattributes'));
  assert.match(text, /research\/raw\/\* text eol=lf/);
  assert.match(text, /\*\.jsonl text eol=lf/);
});

test('the template .gitignore keeps the chain committed with an explicit negation', () => {
  const text = readText(path.join(TEMPLATE_DIR, '.gitignore'));
  assert.match(text, /!research\/raw\/\.fetches\.jsonl/, 'a broader dotfile rule must not silently exclude the chain');
  assert.match(text, /research\/raw\/\.usage\.jsonl/);
});

test('START_HERE.md is deployed and scaffolded, and is NOT a LAYOUT entry', () => {
  assert.ok(templateFiles().includes('START_HERE.md'));
  assert.ok(fs.existsSync(path.join(KIT_ROOT, 'START_HERE.md')), 'the kit root carries the operator\'s twin');
  assert.equal(LAYOUT.some((e) => e.path === 'START_HERE.md'), false, 'no rule needs it, so a project without it reports nothing');
});

test('the two START_HERE copies differ only in how the kit path is spelled', () => {
  const kitCopy = readText(path.join(KIT_ROOT, 'START_HERE.md'));
  const templateCopy = readText(path.join(TEMPLATE_DIR, 'START_HERE.md'));
  assert.equal(kitCopy, templateCopy.replace(/\{\{KIT\}\}/g, '~/.agents/research-kit'));
});

test('the deployed hook\'s mode is part of its contract', () => {
  assert.equal(HOOK_MODE, 0o755);
  const state = hookExecutability(path.join(KIT_ROOT, 'githooks', 'pre-commit'));
  assert.equal(state.ok, true, state.fix ?? state.reason);
  assert.equal(hookExecutability(path.join(tempDir(), 'absent')).reason, 'missing');
});

test('a placeholder in PROSE is a defect; one quoted in a code span is documentation', () => {
  assert.deepEqual(unresolvedPlaceholders('the kit lives at {{KIT}} and is installed once'), ['KIT']);
  assert.deepEqual(
    unresolvedPlaceholders('the two copies differ only in how the path is spelled (`~/.agents/research-kit` vs `{{KIT}}`)'),
    [],
    'a document explaining the token is not a document that failed to render it',
  );
  assert.deepEqual(unresolvedPlaceholders('`{{KIT}}` is the token, and {{TOPIC}} was never rendered'), ['TOPIC']);
});

test('THE guarantee: a freshly scaffolded project holds no token anywhere, code spans included', () => {
  const dir = scaffoldProject(tempDir(), { topic: 'Anything', kit: '~/.agents/research-kit' }).dir;
  for (const rel of templateFiles()) {
    const text = readText(resolve(dir, rel), '');
    assert.doesNotMatch(text, /\{\{[A-Z_]+\}\}/, `${rel} shipped with an unrendered token`);
  }
});
