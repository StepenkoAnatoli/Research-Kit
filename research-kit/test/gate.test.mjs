// The gate verdict, the diff-scope rule, the architecture-map rule, and the three
// overrides. Plus the one that matters: it actually blocks.

import { spawnSync } from 'node:child_process';
import { test, describe, assert, makePassingProject, makeProject, corrupt, tempDir, fs, path, KIT_ROOT, requireGit } from './harness.mjs';
import { PATHS, resolve, writeText, readText, writeJson } from '../lib/core.mjs';
import { evaluate, isGated, splitPathList, architectureMapBreach, loadGateConfig, DEFAULT_CODE_PATHS } from '../lib/gate.mjs';
import { GATE_MARKERS, TEMPLATE_DIR } from '../lib/scaffold.mjs';

describe('gate');

test('the gate markers stay exactly four', () => {
  assert.equal(GATE_MARKERS.length, 4);
  assert.deepEqual([...GATE_MARKERS].sort(), [PATHS.discovery, PATHS.evidence, PATHS.plan, PATHS.raw].sort());
});

test('a project with none of the markers is not gated', () => {
  const dir = tempDir();
  fs.mkdirSync(path.join(dir, 'research'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'research', 'notes.md'), 'unrelated notes\n');
  assert.equal(isGated(dir), false, 'a research/ folder with no marker must not gate an unrelated repo');
  assert.equal(evaluate(dir, { gate: 'commit', stagedPaths: ['src/a.js'] }).verdict, 'not-gated');
});

test('gated and passing allows; gated and failing blocks', () => {
  const dir = makePassingProject();
  assert.equal(evaluate(dir, { gate: 'commit', stagedPaths: ['src/a.js', PATHS.architecture] }).allow, true);

  corrupt(dir, PATHS.discovery, (text) => text.replace('CLOSED', 'OPEN'));
  const blocked = evaluate(dir, { gate: 'commit', stagedPaths: ['src/a.js'] });
  assert.equal(blocked.allow, false);
  assert.equal(blocked.verdict, 'block');
  assert.ok(blocked.fix, 'a block must print the exact fix');
});

test('a missing DISCOVERY.md inside a gated project fails HARDER, it does not opt out', () => {
  const dir = makePassingProject();
  fs.rmSync(resolve(dir, PATHS.discovery));
  assert.equal(isGated(dir), true, 'the other three markers still gate it');
  const verdict = evaluate(dir, { gate: 'commit', stagedPaths: ['src/a.js'] });
  assert.equal(verdict.allow, false);
  assert.ok(verdict.findings.some((f) => f.rule === 'contract-missing'));
});

test('diff-scope: a commit confined to research/ is allowed while the verdict fails', () => {
  const dir = makePassingProject();
  corrupt(dir, PATHS.discovery, (text) => text.replace('CLOSED', 'OPEN'));

  const research = evaluate(dir, { gate: 'commit', stagedPaths: ['research/EVIDENCE.md', 'research/raw/x.md'] });
  assert.equal(research.allow, true, 'committing collected evidence is the workflow');

  const code = evaluate(dir, { gate: 'commit', stagedPaths: ['src/a.js'] });
  assert.equal(code.allow, false);

  const both = evaluate(dir, { gate: 'commit', stagedPaths: ['research/EVIDENCE.md', 'src/a.js'] });
  assert.equal(both.allow, false, 'code and research together still blocks');
});

// ADR-0093. Found 2026-09-29 (break-test, PR #140 item 1): a line typed into a tracked capture
// was committable on its own - "confined to research/ ... committing evidence is the workflow" -
// and blocked only when the same commit also touched a file elsewhere. Whether altered evidence
// enters history cannot depend on what else is staged.
test('diff-scope: altered evidence blocks even when the commit is confined to research/', () => {
  const dir = makePassingProject();
  const capture = fs.readdirSync(resolve(dir, PATHS.raw)).find((f) => f.endsWith('.md'));
  const rel = `${PATHS.raw}/${capture}`;
  corrupt(dir, rel, (t) => `${t}\nA line typed after the fetch.\n`);

  const verdict = evaluate(dir, { gate: 'commit', stagedPaths: [rel] });
  assert.equal(verdict.allow, false, 'a tampered capture was committed because nothing outside research/ was staged');
  assert.ok(verdict.findings.some((f) => f.rule === 'body-unmodified'));
  assert.match(verdict.reason, /altered|integrity/i);
  assert.match(verdict.fix, /restore|git checkout|git restore/i);
});

test('diff-scope: a hand-written capture cited by a row blocks even when confined to research/', () => {
  const dir = makePassingProject();
  writeText(resolve(dir, `${PATHS.raw}/typed.md`), '---\nurl: https://example.invalid/typed\nretrieved: 2026-09-29\n---\nI typed this.\n');
  corrupt(dir, PATHS.evidence, (t) => `${t.trimEnd()}\n| E-99 | 2026-09-29 | P | https://example.invalid/typed | typed | research/raw/typed.md |\n`);
  const verdict = evaluate(dir, { gate: 'commit', stagedPaths: [PATHS.evidence, `${PATHS.raw}/typed.md`] });
  assert.equal(verdict.allow, false);
  assert.ok(verdict.findings.some((f) => f.rule === 'fetch-entry-exists'));
});

test('diff-scope: unfinished evidence is still committable - only integrity findings are held', () => {
  // The workflow ADR-0048 protects: an open unknown, a missing brief, a gap - all normal
  // mid-research, all committable while confined to research/.
  const dir = makePassingProject();
  corrupt(dir, PATHS.discovery, (text) => text.replace('CLOSED', 'OPEN'));
  const verdict = evaluate(dir, { gate: 'commit', stagedPaths: [PATHS.discovery] });
  assert.equal(verdict.allow, true, verdict.reason);
});

// Found 2026-09-27, on a fresh collector and on a builder that unpacked a remote package: after
// new-project, `git add -A && git commit` was refused. The scaffold's own .gitattributes,
// .gitignore, AGENTS.md, START_HERE.md and docs/ARCHITECTURE.md sit outside research/. So for
// the whole of phase 1 the corpus travelled without the .gitattributes that keeps its hashes
// valid on a Windows checkout (ADR-0020), and without the rules that bind whoever opens it.
test('diff-scope: the project\'s own scaffolding is committed with its corpus while the verdict fails', () => {
  const dir = makePassingProject();
  corrupt(dir, PATHS.discovery, (text) => text.replace('CLOSED', 'OPEN'));
  const template = readText(path.join(TEMPLATE_DIR, 'docs', 'ARCHITECTURE.md'));
  const staged = (text) => ({ stagedText: (rel) => (rel === PATHS.architecture ? text : null) });
  const scaffolding = ['.gitattributes', '.gitignore', 'AGENTS.md', 'START_HERE.md', 'research/EVIDENCE.md'];

  assert.equal(evaluate(dir, { gate: 'commit', stagedPaths: scaffolding }).allow, true, 'the corpus\'s own files were refused');
  assert.equal(evaluate(dir, { gate: 'commit', stagedPaths: [...scaffolding, PATHS.architecture], ...staged(template) }).allow, true,
    'the empty map of code that does not exist yet was refused');
  assert.equal(evaluate(dir, { gate: 'commit', stagedPaths: [PATHS.architecture], ...staged(template.replace(/\n/g, '\r\n')) }).allow, true,
    'a Windows checkout of the same empty map is the same map');

  // What stays phase 2.
  const designed = template.replace('| _module_ | _the one concept it is responsible for_ | _ADR or decision_ |', '| src/app.js | the app | ADR-0001 |');
  assert.notEqual(designed, template, 'the fixture did not change the map');
  assert.equal(evaluate(dir, { gate: 'commit', stagedPaths: [PATHS.architecture], ...staged(designed) }).allow, false, 'a map with a design in it is phase 2');
  assert.equal(evaluate(dir, { gate: 'commit', stagedPaths: [PATHS.architecture], ...staged(null) }).allow, false, 'an unreadable map is not an empty one');
  assert.equal(evaluate(dir, { gate: 'commit', stagedPaths: ['src/AGENTS.md'] }).allow, false, 'only the root files are the project\'s own');
  assert.equal(evaluate(dir, { gate: 'commit', stagedPaths: ['AGENTS.md', 'src/a.js'] }).allow, false, 'scaffolding does not carry code with it');
});

test('GATE_OFF is a no-op, reported, and recorded in the overrides log', () => {
  const dir = makePassingProject();
  corrupt(dir, PATHS.discovery, (text) => text.replace('CLOSED', 'OPEN'));
  writeText(resolve(dir, PATHS.gateOff), 'deliberately off\n');

  const verdict = evaluate(dir, { gate: 'commit', stagedPaths: ['src/a.js'] });
  assert.equal(verdict.verdict, 'override');
  assert.equal(verdict.allow, true);
  assert.ok(readText(resolve(dir, PATHS.overrides)).includes('GATE_OFF'));
});

test('the architecture-map rule: a declared code path stages the map with it', () => {
  const dir = makePassingProject();
  writeJson(resolve(dir, PATHS.kit), { architecture: { codePaths: ['research-kit/lib'] } });

  assert.deepEqual(loadGateConfig(dir).codePaths, ['research-kit/lib']);
  assert.ok(architectureMapBreach(dir, ['research-kit/lib/gate.mjs']), 'a code change without the map is a breach');
  assert.equal(architectureMapBreach(dir, ['research-kit/lib/gate.mjs', PATHS.architecture]), null);
  assert.equal(architectureMapBreach(dir, ['README.md']), null, 'an undeclared path owes nothing');

  const verdict = evaluate(dir, { gate: 'commit', stagedPaths: ['research-kit/lib/gate.mjs'] });
  assert.equal(verdict.allow, false);
  assert.equal(verdict.breach.rule, 'architecture-map-same-commit');
});

// Found 2026-09-27 committing product code in a project whose preflight PASSes: the block said
// "Phase 1 is not done until preflight prints PASS" - false, it passed - and its fix,
// "git add docs/ARCHITECTURE.md", stages nothing while the map is unchanged, so following it
// exactly left the commit blocked.
test('a map-rule block on a passing gate says what is owed, and its fix works as written', () => {
  const dir = makePassingProject();
  const r = spawnSync(process.execPath, [path.join(KIT_ROOT, 'bin', 'gate.mjs'), '--staged', 'src/app.js'], { cwd: dir, encoding: 'utf8', env: { ...process.env, RESEARCH_KIT_GATE: '' } });
  assert.equal(r.status, 1, r.stdout + r.stderr);
  assert.doesNotMatch(r.stderr, /Phase 1 is not done/, `the gate passes, and the block says it does not:\n${r.stderr}`);
  assert.match(r.stderr, /research gate passes/i, r.stderr);
  const [, fix] = r.stderr.match(/Fix: ([^\n]+)/) ?? [];
  assert.match(fix ?? '', /update docs\/ARCHITECTURE\.md/i, `"git add" alone stages nothing while the map is unchanged: ${fix}`);
});

// The edit-time hook, fed the payload the runtime sends. Found 2026-09-27: while phase 1 was open
// it asked "the build is not ready" before EVERY edit - research/MAP.md and DISCOVERY.md
// included, which are the phase-1 work AGENTS.md tells the agent to do. The commit gate lets
// research/ and the project's scaffolding through (ADR-0048); the edit gate did not look at the
// path at all.
function editGate(dir, toolInput, cwd = dir, config = path.join(tempDir(), 'absent.json'), extraEnv = {}) {
  const r = spawnSync(process.execPath, [path.join(KIT_ROOT, 'hooks', 'edit-gate.mjs')], {
    input: JSON.stringify({ hook_event_name: 'PreToolUse', tool_name: 'Write', cwd, tool_input: toolInput }),
    encoding: 'utf8', env: { ...process.env, RESEARCH_KIT_CONFIG: config, ...extraEnv },
  });
  return JSON.parse(r.stdout).hookSpecificOutput;
}

// Found 2026-09-29 (Arena break test): a payload that is valid JSON but not an object (`null`,
// a number, an array), or one whose cwd is not a string, crashed the hook with a raw stack and
// exit 1 - on every Edit - where an unparsable payload is allowed with a note.
test('the edit gate answers a non-object payload or a non-string cwd instead of crashing', () => {
  const dir = makeProject();
  const payloads = ['null', '5', '[]', '"x"',
    JSON.stringify({ tool_name: 'Write', cwd: 5, tool_input: { file_path: 'src/app.js' } }),
    JSON.stringify({ tool_name: 'Write', cwd: { a: 1 }, project_dir: 7, tool_input: { file_path: 'src/app.js' } })];
  for (const input of payloads) {
    const r = spawnSync(process.execPath, [path.join(KIT_ROOT, 'hooks', 'edit-gate.mjs')], {
      input, cwd: dir, encoding: 'utf8', env: { ...process.env, RESEARCH_KIT_CONFIG: path.join(tempDir(), 'absent.json') },
    });
    assert.equal(r.status, 0, `payload ${input} exited ${r.status}:\n${r.stderr.slice(0, 300)}`);
    const out = JSON.parse(r.stdout).hookSpecificOutput;
    assert.ok(['allow', 'ask', 'deny'].includes(out.permissionDecision), `payload ${input}: ${r.stdout}`);
  }
});

test('the edit gate lets phase-1 work through and still stops code', () => {
  const dir = makeProject();
  for (const rel of ['research/MAP.md', 'research/DISCOVERY.md', 'research/EVIDENCE.md', 'AGENTS.md']) {
    const out = editGate(dir, { file_path: path.join(dir, rel), content: 'x' });
    assert.equal(out.permissionDecision, 'allow', `${rel} is phase-1 work and the edit gate said ${out.permissionDecision}: ${out.permissionDecisionReason}`);
  }
  assert.equal(editGate(dir, { file_path: 'research/BRIEF.md' }).permissionDecision, 'allow', 'a path relative to cwd');
  assert.equal(editGate(dir, { file_path: path.join(dir, 'src', 'app.js'), content: 'x' }).permissionDecision, 'ask', 'code is phase 2');
  assert.equal(editGate(dir, { file_path: path.join(dir, 'research', '..', 'src', 'app.js') }).permissionDecision, 'ask', 'a path that only passes through research/');
  assert.equal(editGate(dir, { notebook_path: path.join(dir, 'analysis.ipynb') }).permissionDecision, 'ask', 'a notebook outside research/');
  assert.equal(editGate(dir, {}).permissionDecision, 'ask', 'a call naming no file is judged as before');
});

// Found 2026-09-27: with the session's cwd in a subfolder of a gated repository, the edit hook
// looked for the gate markers in that subfolder, found none, and allowed every edit as "not a
// gated project". The commit gate always judges from the repository's top level, where git
// runs its hooks, so the two gates disagreed about the same file.
test('the edit gate judges a subfolder cwd by the repository it is in', () => {
  requireGit('finding the repository a subfolder is in');
  const dir = makeProject();
  spawnSync('git', ['init', '-q'], { cwd: dir });
  fs.mkdirSync(path.join(dir, 'src'), { recursive: true });
  const out = editGate(dir, { file_path: 'app.js' }, path.join(dir, 'src'));
  const top = spawnSync('git', ['rev-parse', '--show-toplevel'], { cwd: path.join(dir, 'src'), encoding: 'utf8' });
  assert.equal(out.permissionDecision, 'ask', `code edited from src/ was not judged: ${out.permissionDecisionReason}
    project ${dir}
    git top ${JSON.stringify(top.stdout)} (exit ${top.status}) ${top.stderr}
    native  ${fs.realpathSync.native(dir)}`);
  assert.equal(editGate(dir, { file_path: '../research/MAP.md' }, path.join(dir, 'src')).permissionDecision, 'allow',
    'phase-1 work is still phase-1 work from a subfolder');
  const loose = tempDir();
  assert.equal(editGate(loose, { file_path: 'a.js' }).permissionDecision, 'allow', 'outside any gated project nothing is judged');
});

// Found 2026-09-28 (Arena break test 6, remaining risk 1): an editor process carrying an
// exported GIT_DIR/GIT_WORK_TREE made the subfolder discovery above ask git about THAT
// repository. Its top level is not an ancestor of the cwd, so the hook fell back to src/,
// found no markers and allowed code as "not a gated project" - the gate failing open.
test('a leaked GIT_DIR does not make the edit gate judge another repository', () => {
  requireGit('finding the repository a subfolder is in, under a leaked GIT_DIR');
  const dir = makeProject();
  spawnSync('git', ['init', '-q'], { cwd: dir });
  fs.mkdirSync(path.join(dir, 'src'), { recursive: true });
  const other = tempDir('rk-other-repo-');
  spawnSync('git', ['init', '-q'], { cwd: other });
  const leaked = { GIT_DIR: path.join(other, '.git'), GIT_WORK_TREE: other };
  const out = editGate(dir, { file_path: 'app.js' }, path.join(dir, 'src'), undefined, leaked);
  assert.equal(out.permissionDecision, 'ask', `code edited from src/ was not judged: ${out.permissionDecisionReason}`);
});

test('undeclared code paths fall back to the documented defaults', () => {
  const dir = makeProject();
  assert.deepEqual(loadGateConfig(dir).codePaths, [...DEFAULT_CODE_PATHS]);
  assert.equal(loadGateConfig(dir).declared, false);
});

test('the edit gate has no diff-scope: there are no staged paths to confine', () => {
  const dir = makePassingProject();
  corrupt(dir, PATHS.discovery, (text) => text.replace('CLOSED', 'OPEN'));
  assert.equal(evaluate(dir, { gate: 'edit' }).allow, false);
});

test('splitPathList: null is "could not read", [] is "read, and empty"', () => {
  assert.equal(splitPathList(null), null);
  assert.deepEqual(splitPathList(''), []);
  assert.deepEqual(splitPathList('a\nb\n'), ['a', 'b']);
  assert.deepEqual(splitPathList('a\0b\0'), ['a', 'b'], 'git -z uses NUL separators');
});

test('one verdict, three callers: the same snapshot cannot yield two answers', async () => {
  const dir = makePassingProject();
  const { readCorpus } = await import('../lib/corpus.mjs');
  const { runPreflight } = await import('../lib/preflight.mjs');
  const corpus = readCorpus(dir);

  const direct = runPreflight(dir, { corpus });
  const viaGate = evaluate(dir, { gate: 'commit', stagedPaths: [], corpus });
  assert.equal(direct.pass, viaGate.allow);
  assert.equal(direct.pass, evaluate(dir, { gate: 'edit', corpus }).allow);
});

// Found 2026-09-27: the edit gate said "allow: phase-1 work" to a Write into research/raw/ -
// a capture or the ledger itself. Evidence is fetched, never typed (AGENTS.md), and a
// ledger line forged with a correct hash and chain link passes preflight. research.mjs
// writes these files itself, so no legitimate agent edit goes there.
test('the edit gate denies typing into research/raw/, even on a passing gate', () => {
  const dir = makePassingProject();
  for (const rel of ['research/raw/2026-09-27-a-page-x-12345678.md', 'research/raw/.fetches.jsonl']) {
    const out = editGate(dir, { file_path: path.join(dir, rel), content: 'x' });
    assert.equal(out.permissionDecision, 'deny', `${rel}: ${out.permissionDecision} - ${out.permissionDecisionReason}`);
    assert.match(out.permissionDecisionReason, /research\.mjs/);
  }
  assert.equal(editGate(dir, { file_path: path.join(dir, 'research/EVIDENCE.md') }).permissionDecision, 'allow', 'the rest of research/ is still phase-1 work');

  const off = path.join(tempDir(), 'off.json');
  fs.writeFileSync(off, JSON.stringify({ editGate: { mode: 'off' } }));
  assert.equal(editGate(dir, { file_path: path.join(dir, 'research/raw/.fetches.jsonl') }, dir, off).permissionDecision, 'allow', 'editGate.mode=off turns the whole gate off');
  fs.writeFileSync(path.join(dir, 'research/GATE_OFF'), '');
  assert.equal(editGate(dir, { file_path: path.join(dir, 'research/raw/.fetches.jsonl') }).permissionDecision, 'allow', 'GATE_OFF turns the whole gate off');
});
