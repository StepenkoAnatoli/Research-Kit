// The skill set (ADR-0146): the kit ships one directory per skill under skills/, beside the
// research-first skill, and a router that says which of them may run on which machine.
//
// What these pin, each a property the evidence or the protocol requires:
// - every shipped skill is a VALID skill directory - SKILL.md at its root, a `name` equal to
//   its directory, a description within the specification's 1024 characters (the builder-
//   skills project, E-02) - because a runtime skips or misnames anything else;
// - every skill reaches every skill root, as a sibling of research-first, and --into the
//   project skill directory (E-03: discovery scans subdirectories of a root);
// - the router's table names every skill exactly once, and never routes a builder to a
//   skill that collects (ADR-0010: a builder does not collect).

import { test, describe, assert, fs, path, KIT_ROOT, tempDir } from './harness.mjs';
import { writeText } from '../lib/core.mjs';

describe('skill-set');

const SET = path.join(KIT_ROOT, 'skills');
const names = () => fs.readdirSync(SET).filter((n) => fs.statSync(path.join(SET, n)).isDirectory()).sort();

/** The frontmatter's top-level scalar fields; enough for `name` and `description`. */
function frontmatter(file) {
  const text = fs.readFileSync(file, 'utf8');
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  assert.ok(m, `${file} has no YAML frontmatter`);
  const fields = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([a-z-]+):\s*(.*)$/);
    if (kv) fields[kv[1]] = kv[2].replace(/^"(.*)"$/, '$1');
  }
  return fields;
}

/** A markdown table under `## <heading>`, as arrays of trimmed cells, header row dropped. */
function table(text, heading) {
  const at = text.indexOf(`## ${heading}`);
  assert.ok(at >= 0, `no "## ${heading}" section`);
  const rows = [];
  for (const line of text.slice(at).split('\n').slice(1)) {
    if (line.startsWith('## ')) break;
    if (!line.startsWith('|') || /^\|[-| ]+\|$/.test(line)) continue;
    rows.push(line.slice(1, -1).split('|').map((c) => c.trim()));
  }
  return rows.slice(1);
}

const router = () => fs.readFileSync(path.join(SET, 'skill-router', 'SKILL.md'), 'utf8');
const ticked = (cell) => [...cell.matchAll(/`([a-z0-9-]+)`/g)].map((m) => m[1]);

test('every shipped skill is a valid skill directory: SKILL.md, name = directory, description within 1024', () => {
  const found = names();
  assert.ok(found.length > 0, 'the skill set is empty');
  for (const name of found) {
    const file = path.join(SET, name, 'SKILL.md');
    assert.ok(fs.existsSync(file), `${name}/ has no SKILL.md - a runtime would not discover it`);
    const fm = frontmatter(file);
    assert.equal(fm.name, name, `${name}/SKILL.md says name: ${fm.name}`);
    assert.match(fm.name, /^[a-z0-9]+(-[a-z0-9]+)*$/, `${name}: not a valid skill name`);
    assert.ok(fm.name.length <= 64, `${name}: name over 64 characters`);
    assert.ok(fm.description && fm.description.length <= 1024,
      `${name}: description is ${fm.description ? fm.description.length : 0} characters (1-1024)`);
  }
});

test('no shipped skill shares a name with research-first', () => {
  assert.equal(names().includes('research-first'), false);
});

test('the router names every skill the kit ships exactly once, research-first included', () => {
  const listed = table(router(), 'Skill table').map((r) => r[0]);
  const expected = ['research-first', ...names()].sort();
  assert.deepEqual([...listed].sort(), expected, 'the router table and skills/ disagree');
  assert.equal(new Set(listed).size, listed.length, 'a skill is listed twice');
});

test('the router never sends a builder to a skill that collects', () => {
  const rows = table(router(), 'Skill table');
  const collects = new Map(rows.map(([skill, c]) => [skill, c]));
  for (const [skill, c, , builder] of rows) {
    assert.ok(['yes', 'stage', 'no'].includes(c), `${skill}: Collects is "${c}"`);
    if (c === 'yes') assert.match(builder, /^never/, `${skill} collects but is routed on a builder: "${builder}"`);
    if (c === 'stage' && !/^never/.test(builder)) {
      assert.match(builder, /fact-request/, `${skill} collects in one stage; on a builder that stage must become fact-request`);
    }
  }
  // The routes by state: every skill a builder row names must not be a collecting one.
  for (const [role, state, use] of table(router(), 'Step 2: route by state')) {
    if (role !== 'builder') continue;
    for (const skill of ticked(use)) {
      assert.ok(collects.has(skill), `builder route "${state}" names ${skill}, which the skill table does not list`);
      assert.notEqual(collects.get(skill), 'yes', `builder route "${state}" sends a builder to ${skill}, which collects`);
    }
  }
  // The task table applies on both machines once building is allowed: no collecting skill there.
  for (const [task, use] of table(router(), 'Step 3: route by task (once building is allowed)')) {
    for (const skill of ticked(use)) {
      assert.ok(collects.has(skill), `task "${task}" names ${skill}, which the skill table does not list`);
      assert.notEqual(collects.get(skill), 'yes', `task "${task}" routes to ${skill}, which collects`);
    }
  }
});

test('the router names no model and no runtime (ADR-0012)', () => {
  assert.doesNotMatch(router(), /\b(claude|gpt|gemini|opus|sonnet|haiku|copilot|codex|cursor)\b/i);
});

test('deploy puts every skill in every skill root, beside research-first, and --into the project', async () => {
  const { deploy, shippedSkills, deployedDrift } = await import('../lib/installer.mjs');
  const rootA = tempDir('research-kit-skillset-a-');
  const rootB = tempDir('research-kit-skillset-b-');
  const project = tempDir('research-kit-skillset-project-');
  writeText(path.join(project, 'AGENTS.md'), '# a project\n');
  const cfg = path.join(tempDir('research-kit-skillset-cfg-'), 'c.json');
  writeText(cfg, JSON.stringify({ skillRoots: [rootA, rootB] }));
  const env = {
    ...process.env,
    RESEARCH_KIT_CONFIG: cfg,
    RESEARCH_KIT_INSTALL_STATE: path.join(tempDir('research-kit-skillset-state-'), 'install.json'),
  };
  const kitHome = path.join(tempDir('research-kit-skillset-home-'), 'research-kit');

  const result = deploy({ from: KIT_ROOT, kitHome, env, into: project });
  assert.equal(result.ok, true);
  const set = shippedSkills(KIT_ROOT);
  assert.deepEqual(set, names());
  for (const root of [rootA, rootB, path.join(project, '.claude', 'skills')]) {
    assert.ok(fs.existsSync(path.join(root, 'research-first', 'SKILL.md')), `${root}: research-first missing`);
    for (const name of set) {
      assert.ok(fs.existsSync(path.join(root, name, 'SKILL.md')), `${root}: ${name} was not deployed`);
      assert.equal(fs.existsSync(path.join(root, 'research-first', name)), false,
        `${name} was nested inside research-first, where no runtime discovers it`);
    }
  }
  assert.equal(deployedDrift({ from: KIT_ROOT, kitHome, env }).drifted, 0, 'a fresh deploy drifted');

  // A root deployed before the set existed is a stale deployment, and is reported as one.
  fs.rmSync(path.join(rootB, set[0]), { recursive: true, force: true });
  const drift = deployedDrift({ from: KIT_ROOT, kitHome, env });
  const gone = drift.skills.find((s) => s.location === path.join(rootB, set[0]));
  assert.ok(gone && gone.missing.includes('SKILL.md'), 'a set skill absent from a deployed root was not reported');
});

test('auto-build carries the kit note that governs it, and the router points at it', () => {
  const note = path.join(SET, 'auto-build', 'references', 'research-kit.md');
  assert.ok(fs.existsSync(note), 'auto-build/references/research-kit.md is missing');
  const text = fs.readFileSync(note, 'utf8');
  for (const must of ['handoff.mjs', 'preflight.mjs', 'fact-request', 'awaiting collector',
    'awaiting owner', 'ends its turn', 'never pre-approves', '--no-verify',
    'head commit', 'approval lapses', 'match-head-commit', 'fresh approval', 'Unattended runs stop at the Mandate',
    'volatile automatically', 'refreshDays', 'Stale, not relied on', 'stale acknowledged', 'resume-from-disk', 'commit-report', 'cite-in-code']) {
    assert.ok(text.includes(must), `the auto-build note no longer says ${must}`);
  }
  assert.doesNotMatch(text, /\b(claude|gpt|gemini|opus|sonnet|haiku|copilot|codex|cursor)\b/i);
  const route = table(router(), 'Step 3: route by task (once building is allowed)')
    .find(([, use]) => use.includes('`auto-build`'));
  assert.ok(route && route[1].includes('references/research-kit.md'), 'the router does not point auto-build at its note');
});

test('deploy leaves a same-named skill that is not the kit\'s as it is, and drift ignores it', async () => {
  const { deploy, deployedDrift } = await import('../lib/installer.mjs');
  const root = tempDir('research-kit-skillset-own-');
  const project = tempDir('research-kit-skillset-own-project-');
  writeText(path.join(project, 'AGENTS.md'), '# a project\n');
  const own = '---\nname: brainstorming\ndescription: MY OWN\n---\n';
  writeText(path.join(root, 'brainstorming', 'SKILL.md'), own);
  writeText(path.join(root, 'brainstorming', 'notes.md'), 'mine\n');
  writeText(path.join(project, '.claude', 'skills', 'brainstorming', 'SKILL.md'), own);
  const cfg = path.join(tempDir('research-kit-skillset-own-cfg-'), 'c.json');
  writeText(cfg, JSON.stringify({ skillRoots: [root] }));
  const env = {
    ...process.env,
    RESEARCH_KIT_CONFIG: cfg,
    RESEARCH_KIT_INSTALL_STATE: path.join(tempDir('research-kit-skillset-own-state-'), 'install.json'),
  };
  const kitHome = path.join(tempDir('research-kit-skillset-own-home-'), 'research-kit');

  const preview = deploy({ from: KIT_ROOT, kitHome, env, into: project, dryRun: true });
  assert.ok(preview.skillConflicts.includes(path.join(root, 'brainstorming')), 'the dry run did not name the conflict');
  assert.equal(fs.readFileSync(path.join(root, 'brainstorming', 'SKILL.md'), 'utf8'), own);

  for (let run = 0; run < 2; run++) {
    const result = deploy({ from: KIT_ROOT, kitHome, env, into: project });
    assert.equal(result.ok, true);
    assert.deepEqual(result.skillConflicts.sort(),
      [path.join(project, '.claude', 'skills', 'brainstorming'), path.join(root, 'brainstorming')].sort());
    assert.equal(fs.readFileSync(path.join(root, 'brainstorming', 'SKILL.md'), 'utf8'), own, 'the user\'s skill was overwritten');
    assert.equal(fs.readFileSync(path.join(project, '.claude', 'skills', 'brainstorming', 'SKILL.md'), 'utf8'), own);
    assert.ok(fs.existsSync(path.join(root, 'careful-coding', 'SKILL.md')), 'the other set skills were not deployed');
  }
  const drift = deployedDrift({ from: KIT_ROOT, kitHome, env });
  assert.equal(drift.skills.some((s) => s.location === path.join(root, 'brainstorming')), false, 'somebody else\'s skill was reported as drift');
  assert.equal(drift.drifted, 0);
});

/** A disposable kit source, skill root, project and install state, for deploys that change the source. */
function sandbox(prefix) {
  const from = path.join(tempDir(`${prefix}-from-`), 'research-kit');
  fs.cpSync(KIT_ROOT, from, { recursive: true, filter: (src) => !/[\\/](node_modules|__pycache__)$/.test(src) });
  const root = tempDir(`${prefix}-root-`);
  const project = tempDir(`${prefix}-project-`);
  writeText(path.join(project, 'AGENTS.md'), '# a project\n');
  const cfg = path.join(tempDir(`${prefix}-cfg-`), 'c.json');
  writeText(cfg, JSON.stringify({ skillRoots: [root] }));
  const env = {
    ...process.env,
    RESEARCH_KIT_CONFIG: cfg,
    RESEARCH_KIT_INSTALL_STATE: path.join(tempDir(`${prefix}-state-`), 'install.json'),
  };
  const kitHome = path.join(tempDir(`${prefix}-home-`), 'research-kit');
  return { from, root, project, env, kitHome };
}

test('a recorded path is not ownership: a user skill put where the kit\'s was is left as it is', async () => {
  const { deploy } = await import('../lib/installer.mjs');
  const { from, root, env, kitHome } = sandbox('research-kit-skillset-replaced');
  assert.equal(deploy({ from, kitHome, env }).ok, true);
  fs.rmSync(path.join(root, 'brainstorming'), { recursive: true, force: true });
  const own = '---\nname: brainstorming\ndescription: MINE\n---\n';
  writeText(path.join(root, 'brainstorming', 'SKILL.md'), own);
  assert.ok(deploy({ from, kitHome, env, dryRun: true }).skillConflicts.includes(path.join(root, 'brainstorming')));
  const result = deploy({ from, kitHome, env });
  assert.ok(result.skillConflicts.includes(path.join(root, 'brainstorming')));
  assert.equal(fs.readFileSync(path.join(root, 'brainstorming', 'SKILL.md'), 'utf8'), own, 'the user\'s skill was overwritten through the record');
});

test('the kit\'s own copy in a project bound earlier is still updated after the source changed', async () => {
  const { deploy, deployedDrift } = await import('../lib/installer.mjs');
  const { from, root, project, env, kitHome } = sandbox('research-kit-skillset-update');
  assert.equal(deploy({ from, kitHome, env, into: project }).ok, true);
  assert.equal(deploy({ from, kitHome, env }).ok, true);
  fs.appendFileSync(path.join(from, 'skills', 'brainstorming', 'SKILL.md'), '\nan update\n');
  assert.ok(deployedDrift({ from, kitHome, env }).skills.some((s) => s.location === path.join(root, 'brainstorming') && s.changed.includes('SKILL.md')),
    'the kit\'s stale copy was not reported as drift');
  const result = deploy({ from, kitHome, env, into: project });
  assert.deepEqual(result.skillConflicts, [], 'the kit\'s own stale copies were taken for somebody else\'s');
  for (const dir of [path.join(root, 'brainstorming'), path.join(project, '.claude', 'skills', 'brainstorming')]) {
    assert.ok(fs.readFileSync(path.join(dir, 'SKILL.md'), 'utf8').includes('an update'), `${dir} was not updated`);
  }
});
