// The gate verdict, the diff-scope rule, the architecture-map rule, and the three
// overrides. Plus the one that matters: it actually blocks.

import { spawnSync } from 'node:child_process';
import { test, describe, assert, makePassingProject, makeProject, corrupt, tempDir, fs, path, KIT_ROOT, requireGit, fixtureInitArgs } from './harness.mjs';
import { PATHS, resolve, writeText, readText, writeJson } from '../lib/core.mjs';
import { evaluate, isGated, splitPathList, architectureMapBreach, loadGateConfig, DEFAULT_CODE_PATHS, suiteBreach, suiteOwed, runSuiteHere, isKitCheckout, SUITE_RULE } from '../lib/gate.mjs';
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

// ADR-0120 (2026-10-01). "A red suite stops work" was a prose rule, and in one afternoon an
// agent committed twice while the suite was red - a chain that read the result through a pipe,
// then one whose `set -e` did not stop. In the kit's own checkout, a commit touching
// research-kit/ now needs a green suite: the gate runs the runner and reads its result file,
// so an unsupported test (no Chromium, ADR-0108) is not red, and a runner that crashed before
// reporting is a block, not a pass. Nothing else: not another project, not a docs-only commit.
test('the suite rule: in the kit\'s checkout a commit touching research-kit/ needs a green suite', () => {
  const dir = makePassingProject();
  writeJson(resolve(dir, PATHS.kit), { architecture: { codePaths: ['research-kit/lib'] } });
  const calls = [];
  const runner = (result) => () => { calls.push(result); return result; };
  // Not the kit's checkout: no runner here is anybody's to run.
  assert.equal(isKitCheckout(dir), false);
  assert.equal(suiteBreach(dir, ['research-kit/lib/x.mjs'], { run: runner({ failures: 3, passed: 1 }) }), null);
  assert.equal(calls.length, 0, 'the suite ran outside the kit\'s checkout');
  for (const rel of ['research-kit/lib/core.mjs', 'research-kit/bin/gate.mjs', 'research-kit/bin/selftest.mjs', 'research-kit/test/.keep']) {
    fs.mkdirSync(path.dirname(resolve(dir, rel)), { recursive: true });
    writeText(resolve(dir, rel), '// stand-in\n');
  }
  assert.equal(isKitCheckout(dir), true);
  assert.equal(suiteBreach(dir, ['docs/ARCHITECTURE.md', 'CHANGELOG.md', 'README.md'], { run: runner({ failures: 3, passed: 1 }) }), null, 'a commit outside research-kit/ owes no suite');
  assert.equal(calls.length, 0, 'the suite ran for a docs-only commit');
  const red = suiteBreach(dir, ['research-kit/README.md'], { run: runner({ failures: 2, passed: 1417, unsupported: 0 }) });
  assert.equal(red.rule, SUITE_RULE);
  assert.match(red.detail, /the suite is red: 2 failed, 1417 passed/);
  assert.match(red.fix, /node research-kit\/bin\/selftest\.mjs/);
  assert.equal(calls.length, 1);
  assert.equal(suiteBreach(dir, ['research-kit/lib/x.mjs'], { run: runner({ failures: 0, passed: 1418, unsupported: 1, exit: 0 }) }), null, 'an unsupported test is not red (ADR-0108)');
  // Green tests and a non-zero exit: the runner's README-count check. Not a pass.
  assert.match(suiteBreach(dir, ['research-kit/lib/x.mjs'], { run: runner({ failures: 0, passed: 1422, unsupported: 0, exit: 1 }) }).detail, /still exited 1/);
  assert.match(suiteBreach(dir, ['research-kit/lib/x.mjs'], { run: runner({ timedOut: true, seconds: 1200 }) }).detail, /did not finish within 1200 s/);
  assert.equal(suiteOwed(dir, ['research-kit/lib/x.mjs']), true);
  assert.equal(suiteOwed(dir, ['docs/ARCHITECTURE.md']), false);
  assert.equal(suiteOwed(dir, null), true);
  assert.match(suiteBreach(dir, ['research-kit/lib/x.mjs'], { run: runner(null) }).detail, /produced no result/, 'a runner that crashed is a block, not a pass');
  assert.equal(suiteBreach(dir, null, { run: runner({ failures: 1, passed: 1 }) })?.rule, SUITE_RULE, 'with the staged list unknown, the suite is run');
  // Through the verdict, on a passing project with the map staged: red blocks, green allows, and the edit gate never runs it.
  const red2 = evaluate(dir, { gate: 'commit', stagedPaths: ['research-kit/lib/x.mjs', PATHS.architecture], runSuite: runner({ failures: 1, passed: 5 }) });
  assert.equal(red2.allow, false);
  assert.equal(red2.breach.rule, SUITE_RULE);
  assert.match(red2.reason, /the suite is red: 1 failed/);
  const green = evaluate(dir, { gate: 'commit', stagedPaths: ['research-kit/lib/x.mjs', PATHS.architecture], runSuite: runner({ failures: 0, passed: 5 }) });
  assert.equal(green.allow, true, green.reason);
  calls.length = 0;
  const edit = evaluate(dir, { gate: 'edit', stagedPaths: ['research-kit/lib/x.mjs'], runSuite: runner({ failures: 9, passed: 0 }) });
  assert.equal(edit.allow, true);
  assert.equal(calls.length, 0, 'the edit gate ran the suite');
});

test('the suite rule runs the checkout\'s own runner and reads its result file', () => {
  const dir = makePassingProject();
  for (const rel of ['research-kit/lib/core.mjs', 'research-kit/bin/gate.mjs', 'research-kit/test/.keep']) {
    fs.mkdirSync(path.dirname(resolve(dir, rel)), { recursive: true });
    writeText(resolve(dir, rel), '// stand-in\n');
  }
  // A stand-in runner: red while a marker file exists, and it reports through the result file like
  // the real one. It also records the environment it was given.
  writeText(resolve(dir, 'research-kit/bin/selftest.mjs'), `
import fs from 'node:fs';
const red = fs.existsSync(new URL('../../RED', import.meta.url));
fs.writeFileSync(new URL('../../ENV.json', import.meta.url), JSON.stringify(process.env));
fs.writeFileSync(process.env.RESEARCH_KIT_RESULT_FILE, JSON.stringify({ passed: red ? 4 : 5, failures: red ? 1 : 0, unsupported: 0, exit: red ? 1 : 0 }));
process.exit(red ? 1 : 0);
`);
  writeText(resolve(dir, 'RED'), '');
  // The hook's environment: git exports the index being committed to its hooks, and a suite that
  // inherited it would run every scratch repository's git against THIS commit's index.
  const hookEnv = { GIT_DIR: '.git', GIT_INDEX_FILE: path.join(dir, '.git', 'index.lock'), GIT_PREFIX: '' };
  const saved = Object.fromEntries(Object.keys(hookEnv).map((k) => [k, process.env[k]]));
  Object.assign(process.env, hookEnv);
  let red;
  try {
    red = suiteBreach(dir, ['research-kit/lib/x.mjs']);
  } finally {
    for (const [k, v] of Object.entries(saved)) { if (v === undefined) delete process.env[k]; else process.env[k] = v; }
  }
  assert.equal(red?.rule, SUITE_RULE, JSON.stringify(red));
  assert.match(red.detail, /1 failed, 4 passed/);
  const given = JSON.parse(readText(resolve(dir, 'ENV.json')));
  for (const k of Object.keys(hookEnv)) assert.equal(given[k], undefined, `${k} reached the suite`);
  assert.equal(given.RESEARCH_KIT_ALLOW_UNSUP, '1', 'an unsupported test must not make the run exit 1 (ADR-0108)');
  assert.match(given.RESEARCH_KIT_RESULT_FILE, /rk-suite-/);
  assert.equal(fs.existsSync(given.RESEARCH_KIT_RESULT_FILE), false, 'the scratch result file was left behind');
  fs.rmSync(resolve(dir, 'RED'));
  assert.equal(suiteBreach(dir, ['research-kit/lib/x.mjs']), null);
  // A runner that crashes before reporting.
  writeText(resolve(dir, 'research-kit/bin/selftest.mjs'), 'process.exit(70);\n');
  assert.match(suiteBreach(dir, ['research-kit/lib/x.mjs']).detail, /produced no result/);
});

test('the suite rule stops a suite that does not finish, and says so', () => {
  const dir = makePassingProject();
  for (const rel of ['research-kit/lib/core.mjs', 'research-kit/bin/gate.mjs', 'research-kit/test/.keep']) {
    fs.mkdirSync(path.dirname(resolve(dir, rel)), { recursive: true });
    writeText(resolve(dir, rel), '// stand-in\n');
  }
  // A runner that hangs: it never writes the result file.
  writeText(resolve(dir, 'research-kit/bin/selftest.mjs'), 'setTimeout(() => {}, 30_000);\n');
  const started = Date.now();
  const breach = suiteBreach(dir, ['research-kit/lib/x.mjs'], { run: () => runSuiteHere(dir, { timeout: 1000 }) });
  assert.ok(Date.now() - started < 15_000, 'the hung runner was not stopped');
  assert.equal(breach?.rule, SUITE_RULE, JSON.stringify(breach));
  assert.match(breach.detail, /did not finish within 1 s/);
});

test('bin/gate.mjs says the suite is about to run, and names the suite rule when it blocks', () => {
  requireGit();
  const dir = makePassingProject();
  for (const rel of ['research-kit/lib/core.mjs', 'research-kit/bin/gate.mjs', 'research-kit/test/.keep']) {
    fs.mkdirSync(path.dirname(resolve(dir, rel)), { recursive: true });
    writeText(resolve(dir, rel), '// stand-in\n');
  }
  writeText(resolve(dir, 'research-kit/bin/selftest.mjs'), `
import fs from 'node:fs';
fs.writeFileSync(process.env.RESEARCH_KIT_RESULT_FILE, JSON.stringify({ passed: 7, failures: 2, unsupported: 0, exit: 1 }));
process.exit(1);
`);
  // --staged is repeatable, one path each; it does not split a list.
  const gate = (...staged) => spawnSync(process.execPath, [path.join(KIT_ROOT, 'bin', 'gate.mjs'), '--gate', 'commit', ...staged.flatMap((p) => ['--staged', p])],
    { cwd: dir, encoding: 'utf8', env: { ...process.env, RESEARCH_KIT_GATE: '' } });
  const blocked = gate('research-kit/lib/x.mjs', 'docs/ARCHITECTURE.md');
  assert.equal(blocked.status, 1, blocked.stdout + blocked.stderr);
  assert.match(blocked.stderr, /so the suite runs before the commit is allowed \(ADR-0120\)/, 'nothing said before the silence');
  assert.match(blocked.stderr, /BLOCKED - the suite is red: 2 failed, 7 passed/);
  assert.match(blocked.stderr, /This is the suite rule/);
  assert.doesNotMatch(blocked.stderr, /Phase 1 is not done/);
  const docs = gate('docs/ARCHITECTURE.md', 'CHANGELOG.md');
  assert.equal(docs.status, 0, docs.stdout + docs.stderr);
  assert.doesNotMatch(docs.stderr, /suite runs before/, 'a docs-only commit announced a suite it does not owe');
  // A commit the map rule refuses never pays for the suite, and is not told it is running.
  const map = gate('research-kit/lib/x.mjs', 'src/app.js');
  assert.equal(map.status, 1);
  assert.match(map.stderr, /architecture-map rule/);
  assert.doesNotMatch(map.stderr, /suite runs before/, 'announced a suite the map rule pre-empted');
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
  spawnSync('git', fixtureInitArgs(), { cwd: dir });
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
  spawnSync('git', fixtureInitArgs(), { cwd: dir });
  fs.mkdirSync(path.join(dir, 'src'), { recursive: true });
  const other = tempDir('rk-other-repo-');
  spawnSync('git', fixtureInitArgs(), { cwd: other });
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
