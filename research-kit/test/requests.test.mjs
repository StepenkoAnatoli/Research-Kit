// Builder requests and auto-collect (ADR-0148): the builder decides what is collected, the
// collector collects it. Requests are validated as untrusted input; the loop runs only on a
// collector, within its caps, never passes --fallback, and pauses when the credits run out.
// The kit's scripts are stand-ins here - nothing reaches a network - and git is real, so the
// round trip (builder pushes a request, collector pushes the corpus and its ledger back) is.

import { spawnSync } from 'node:child_process';
import { test, describe, assert, assertEqual, tempDir, fs, path, makeProject, requireGit, requireSymlink, fixtureInitArgs } from './harness.mjs';
import { writeText, readText, readJson, HEADERS } from '../lib/core.mjs';
import { parseTable } from '../lib/corpus.mjs';
import {
  requestProblems, urlProblem, applyRequest, listRequests, writeResult, settingsProblem, saveAutoCollect, readAutoCollect, requestPages,
} from '../lib/requests.mjs';
import { createAutoCollect, execFile, spentPages, creditsStopped } from '../lib/auto-collect.mjs';
import { builderInstructions } from '../lib/panel.mjs';

describe('requests');

const GOOD = Object.freeze({ fact: 'What is the burst limit of endpoint X?', blocks: 'the retry design', urls: ['https://docs.example.com/limits'] });

// ---------------------------------------------------------------- validation

test('a well-formed request has no problems', () => {
  assertEqual(requestProblems({ ...GOOD }).length, 0);
  assertEqual(requestProblems({ fact: 'f', blocks: 'b', queries: ['x limits'], prefer: ['docs.example.com'], maxPages: 2 }).length, 0);
});

test('a malformed request is refused, each reason named', () => {
  const cases = [
    [null, /JSON object/],
    [[], /JSON object/],
    [{ ...GOOD, command: 'rm -rf' }, /unknown field "command"/],
    [{ blocks: 'b', urls: GOOD.urls }, /"fact" is required/],
    [{ ...GOOD, fact: 'x'.repeat(301) }, /name one fact/],
    [{ fact: 'f', blocks: 'b' }, /owner page/],
    [{ ...GOOD, urls: ['ftp://example.com/x'] }, /not http or https/],
    [{ ...GOOD, urls: 'https://example.com' }, /must be a list/],
    [{ ...GOOD, queries: [''] }, /queries\[0\]/],
    [{ ...GOOD, prefer: ['not a domain'] }, /prefer\[0\]/],
    [{ ...GOOD, unknown: 'X-1' }, /contract row/],
    [{ ...GOOD, unknown: 'U-1', topic: 'new' }, /new topic has no rows/],
    [{ ...GOOD, maxPages: 0 }, /maxPages/],
    [{ ...GOOD, maxPages: 2.5 }, /maxPages/],
  ];
  for (const [request, pattern] of cases) {
    const problems = requestProblems(request);
    assert(problems.some((p) => pattern.test(p)), `${JSON.stringify(request)} -> ${JSON.stringify(problems)}`);
  }
});

test('a page on this machine or its network is refused - a request cannot aim the collector inward', () => {
  for (const url of ['http://localhost:47123/api/state', 'http://127.0.0.1/', 'http://10.0.0.5/x', 'http://169.254.169.254/latest/meta-data',
    'http://192.168.1.1/', 'http://[::1]/', 'http://app.localhost/', `https://${'user'}:${'pw'}@example.com/`]) {
    assert(urlProblem(url), `${url} was accepted`);
  }
  assertEqual(urlProblem('https://docs.example.com/limits'), '');
});

test('a request over the per-request budget is refused, not trimmed', () => {
  const problems = requestProblems({ ...GOOD, maxPages: 10 }, { perRequestPages: 4 });
  assert(problems.some((p) => /over this collector's budget of 4/.test(p)), problems.join('; '));
  assertEqual(requestPages({ ...GOOD, maxPages: 3 }, 4), 3);
  assertEqual(requestPages({ ...GOOD }, 4), 4);
});

test('settings accept only the two modes and a folder inside the repository', () => {
  assertEqual(settingsProblem({ mode: 'auto', perRequestPages: 4, dailyPages: 20, intervalMinutes: 5, topicsFolder: 'projects/new' }), '');
  for (const bad of [{ mode: 'approve' }, { mode: 'always' }, { perRequestPages: 26 }, { dailyPages: -1 }, { intervalMinutes: 0 },
    { topicsFolder: '../outside' }, { topicsFolder: '/abs' }, { topicsFolder: 'C:/x' }, { fallback: true }]) {
    assert(settingsProblem(bad), `${JSON.stringify(bad)} was accepted`);
  }
});

test('listRequests skips the collector\'s own files and ignores a name that is not an id', () => {
  const project = makeProject(undefined, { content: true });
  const dir = path.join(project, 'research', 'requests');
  writeText(path.join(dir, 'burst-limit.json'), JSON.stringify(GOOD));
  writeText(path.join(dir, 'burst-limit.plan.json'), '{}');
  writeText(path.join(dir, 'Bad Name.json'), '{}');
  writeText(path.join(dir, 'broken.json'), '{ nope');
  const listed = listRequests(project);
  assertEqual(listed.map((r) => r.id).join(','), 'Bad Name,broken,burst-limit');
  assert(listed[0].ignored, 'a bad name was read');
  assert(/does not parse/.test(listed[1].parseError), listed[1].parseError);
  assertEqual(listed[2].request.fact, GOOD.fact);
});

// ---------------------------------------------------------------- writing it into the project

test('applying a request adds an OPEN contract row, the plan entries, and a bounded plan for this run', () => {
  const project = makeProject(undefined, { topic: 'Apply topic', content: true });
  const { unknown, planFile } = applyRequest(project, 'burst-limit', { ...GOOD, queries: ['x burst limit'], prefer: ['docs.example.com'] }, 3);
  assertEqual(unknown, 'U-1');
  const rows = parseTable(readText(path.join(project, 'research', 'DISCOVERY.md')), HEADERS.unknowns).rows;
  assertEqual(rows.length, 1);
  assertEqual(rows[0].cells[0], 'U-1');
  assertEqual(rows[0].cells[3], 'OPEN');
  const plan = readJson(path.join(project, 'research', 'plan.json'));
  assertEqual(plan.urls.length, 1);
  assertEqual(plan.queries[0].why, 'U-1');
  const run = readJson(path.join(project, planFile));
  assertEqual(run.topic, 'Apply topic');
  assertEqual(run.maxScrapes, 3);
  assertEqual(run.depth, 'quick');
  // A second request takes the next row, and naming a row that does not exist is refused.
  assertEqual(applyRequest(project, 'second', { ...GOOD, urls: ['https://docs.example.com/other'] }, 1).unknown, 'U-2');
  let threw = '';
  try { applyRequest(project, 'third', { ...GOOD, unknown: 'U-9' }, 1); } catch (err) { threw = err.message; }
  assert(/U-9 is not a row/.test(threw), threw);
});

test('a request or its collector-owned sibling that is a symbolic link is ignored, and never written through', () => {
  const project = makeProject(undefined, { content: true });
  const dir = path.join(project, 'research', 'requests');
  const outside = path.join(tempDir(), 'collector-local.json');
  writeText(outside, '{"keep":true}');
  writeText(path.join(dir, 'plain.json'), JSON.stringify(GOOD));
  requireSymlink(outside, path.join(dir, 'linked.json'), 'a symlinked request');
  writeText(path.join(dir, 'via-plan.json'), JSON.stringify(GOOD));
  requireSymlink(outside, path.join(dir, 'via-plan.plan.json'), 'a symlinked plan');
  writeText(path.join(dir, 'via-result.json'), JSON.stringify(GOOD));
  requireSymlink(path.join(path.dirname(outside), 'dangling.json'), path.join(dir, 'via-result.result.json'), 'a dangling result link');
  const listed = Object.fromEntries(listRequests(project).map((r) => [r.id, r]));
  assert(!listed.plain.ignored && listed.plain.request, 'a plain request was ignored');
  for (const id of ['linked', 'via-plan', 'via-result']) {
    assert(/symbolic link/.test(listed[id].ignored ?? ''), `${id}: ${JSON.stringify(listed[id])}`);
    assertEqual(listed[id].request, undefined);
  }
  let threw = '';
  try { applyRequest(project, 'via-plan', { ...GOOD }, 1); } catch (err) { threw = err.message; }
  assert(/symbolic link/.test(threw), threw);
  assertEqual(parseTable(readText(path.join(project, 'research', 'DISCOVERY.md')), HEADERS.unknowns).rows.length, 0);
  threw = '';
  try { writeResult(project, 'via-result', { status: 'refused' }); } catch (err) { threw = err.message; }
  assert(/symbolic link/.test(threw), threw);
  assertEqual(readText(outside), '{"keep":true}');
  assert(!fs.existsSync(path.join(path.dirname(outside), 'dangling.json')), 'a dangling result link was written through');
});

test('the summary parsers read research.mjs\'s own lines', () => {
  assertEqual(spentPages('collected  2\nspent      3 (budget consumed: collected + failed)\n'), 3);
  assertEqual(creditsStopped('stopped    credits ran out on firecrawl during scrape; 2 page(s)'), 'firecrawl');
  assertEqual(creditsStopped('collected 2'), '');
});

test('the builder instructions say how to file a request', () => {
  const text = builderInstructions({ topic: 'T', brief: true });
  assert(text.includes('research/requests/<id>.json'), text);
  assert(/"fact"/.test(text) && /"blocks"/.test(text), text);
});

// ---------------------------------------------------------------- the loop, with real git

/** Stand-in kit: research.mjs writes one capture and a ledger line, or reports credits gone. */
function standInKit() {
  const root = tempDir('research-kit-auto-kit-');
  writeText(path.join(root, 'bin', 'research.mjs'), `
const fs = require('node:fs');
const path = require('node:path');
fs.appendFileSync(path.join(process.env.STANDIN_LOG, 'calls.log'), JSON.stringify(process.argv.slice(2)) + '\\n');
fs.mkdirSync('research/raw', { recursive: true });
fs.writeFileSync('research/raw/2026-10-07-page.md', 'captured\\n');
fs.appendFileSync('research/raw/.fetches.jsonl', JSON.stringify({ url: 'https://docs.example.com/limits' }) + '\\n');
if (process.env.STANDIN_MODE === 'stopped') {
  console.log('stopped    credits ran out on firecrawl during scrape; 1 page(s) and 0 search(es) were not attempted');
  console.log('spent      1 (budget consumed: collected + failed)');
  process.exit(2);
}
console.log('collected  2');
console.log('spent      2 (budget consumed: collected + failed)');
`.replace(/^\n/, ''));
  writeText(path.join(root, 'bin', 'preflight.mjs'), "console.log('FAIL - 1 unknown OPEN'); process.exit(1);\n");
  for (const name of ['research.mjs', 'preflight.mjs']) fs.renameSync(path.join(root, 'bin', name), path.join(root, 'bin', name.replace('.mjs', '.cjs')));
  // .cjs so the stand-in may use require; the loop runs bin/<name>.mjs, which loads it.
  writeText(path.join(root, 'bin', 'research.mjs'), "import './research.cjs';\n");
  writeText(path.join(root, 'bin', 'preflight.mjs'), "import './preflight.cjs';\n");
  return root;
}

function gitEnv(extra = {}) {
  const dir = tempDir('research-kit-auto-machine-');
  const globalConfig = path.join(dir, 'gitconfig');
  writeText(globalConfig, '[user]\n\tname = Collector\n\temail = collector@example.invalid\n[commit]\n\tgpgsign = false\n[init]\n\tdefaultBranch = main\n');
  const configFile = path.join(dir, 'research-kit.config.json');
  writeText(configFile, JSON.stringify({ role: 'collector' }));
  const env = { ...process.env, RESEARCH_KIT_CONFIG: configFile, GIT_CONFIG_GLOBAL: globalConfig, GIT_CONFIG_NOSYSTEM: '1', STANDIN_LOG: dir, ...extra };
  delete env.SERPAPI_API_KEY;
  return { dir, configFile, env };
}

function git(cwd, env, ...args) {
  const r = spawnSync('git', args, { cwd, env, encoding: 'utf8', windowsHide: true });
  assertEqual(r.status, 0, `git ${args.join(' ')}: ${r.stderr}`);
  return r.stdout;
}

/** A remote, the collector's clone holding a scaffolded project, and a builder's clone. */
function world(extra = {}) {
  requireGit('auto-collect');
  const m = gitEnv(extra);
  const remote = tempDir('research-kit-auto-remote-');
  git(remote, m.env, ...fixtureInitArgs('--bare', '-b', 'main'));
  const collector = tempDir('research-kit-auto-collector-');
  git(collector, m.env, ...fixtureInitArgs('-b', 'main'));
  makeProject(collector, { topic: 'Auto topic', content: true });
  git(collector, m.env, 'add', '-A');
  git(collector, m.env, '-c', 'core.hooksPath=', 'commit', '-q', '--no-verify', '-m', 'scaffold');
  git(collector, m.env, 'remote', 'add', 'origin', remote);
  git(collector, m.env, 'push', '-q', '-u', 'origin', 'main');
  // The loop's own commits run whatever hooks the clone has; the fixture has none.
  git(collector, m.env, 'config', 'core.hooksPath', path.join(m.dir, 'no-hooks'));
  const builder = tempDir('research-kit-auto-builder-');
  git(builder, m.env, 'clone', '-q', remote, '.');
  return { m, remote, collector, builder, kit: standInKit() };
}

function builderPushes(w, id, request) {
  writeText(path.join(w.builder, 'research', 'requests', `${id}.json`), typeof request === 'string' ? request : JSON.stringify(request));
  git(w.builder, w.m.env, 'add', 'research/requests');
  git(w.builder, w.m.env, '-c', 'core.hooksPath=', 'commit', '-q', '--no-verify', '-m', `request ${id}`);
  git(w.builder, w.m.env, 'push', '-q');
}

const loop = (w) => createAutoCollect({ project: () => w.collector, env: w.m.env, kitRoot: w.kit });
const calls = (w) => (readText(path.join(w.m.dir, 'calls.log'), '') ?? '').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));

test('auto-collect round trip: the builder pushes a request, the collector collects it and pushes the corpus with its ledger', async () => {
  const w = world();
  saveAutoCollect({ mode: 'auto', perRequestPages: 4, dailyPages: 20 }, w.m.env);
  builderPushes(w, 'burst-limit', GOOD);

  const status = await loop(w).cycle();
  const row = status.requests.find((r) => r.id === 'burst-limit');
  assertEqual(row.status, 'collected', JSON.stringify(status));
  assertEqual(calls(w).length, 1);
  assertEqual(calls(w)[0].join(' '), '--plan research/requests/burst-limit.plan.json');
  assert(!calls(w)[0].includes('--fallback'), 'auto-collect passed --fallback');
  assertEqual(readAutoCollect(w.m.env).spent.pages, 2);

  // The builder pulls and finds the result, the ledger and the capture.
  git(w.builder, w.m.env, 'pull', '-q', '--ff-only');
  const result = readJson(path.join(w.builder, 'research', 'requests', 'burst-limit.result.json'));
  assertEqual(result.status, 'collected');
  assertEqual(result.unknown, 'U-1');
  assertEqual(result.pages, 2);
  assertEqual(result.preflight.code, 1, 'the preflight verdict is recorded, not hidden');
  assert(/FAIL/.test(result.preflight.verdict), result.preflight.verdict);
  assert(fs.existsSync(path.join(w.builder, 'research', 'raw', '.fetches.jsonl')), 'the ledger did not travel');
  assert(fs.existsSync(path.join(w.builder, 'research', 'raw', '2026-10-07-page.md')), 'the capture did not travel');
  assert(/\| U-1 \|/.test(readText(path.join(w.builder, 'research', 'DISCOVERY.md'))), 'the contract row did not travel');

  // Done is done: a second cycle collects nothing again.
  await loop(w).cycle();
  assertEqual(calls(w).length, 1);
});

test('auto-collect retries a failed push without collecting the request again', async () => {
  const w = world();
  saveAutoCollect({ mode: 'auto' }, w.m.env);
  builderPushes(w, 'burst-limit', GOOD);
  let failPush = true;
  const auto = createAutoCollect({
    project: () => w.collector,
    env: w.m.env,
    kitRoot: w.kit,
    exec: (command, args, options) => {
      if (command === 'git' && args[0] === 'push' && failPush) {
        failPush = false;
        return Promise.resolve({ code: 1, output: 'temporary push failure\n' });
      }
      return execFile(command, args, options);
    },
  });

  let status = await auto.cycle();
  let row = status.requests.find((r) => r.id === 'burst-limit');
  assertEqual(row.status, 'collected');
  assert(/push failed/.test(row.git), row.git);
  assertEqual(calls(w).length, 1);

  status = await auto.cycle();
  row = status.requests.find((r) => r.id === 'burst-limit');
  assertEqual(row.status, 'collected');
  assertEqual(row.git, 'pushed');
  assertEqual(calls(w).length, 1, 'a failed delivery caused collection to run again');

  git(w.builder, w.m.env, 'pull', '-q', '--ff-only');
  assertEqual(readJson(path.join(w.builder, 'research', 'requests', 'burst-limit.result.json')).status, 'collected');
  assert(fs.existsSync(path.join(w.builder, 'research', 'raw', '.fetches.jsonl')), 'the corpus did not travel with the result');
});

test('a malformed request arriving by git is refused with its reasons, and nothing is collected', async () => {
  const w = world();
  saveAutoCollect({ mode: 'auto' }, w.m.env);
  builderPushes(w, 'inward', { ...GOOD, urls: ['http://127.0.0.1:47123/api/state'] });
  builderPushes(w, 'broken', '{ not json');
  builderPushes(w, 'greedy', { ...GOOD, maxPages: 20 });
  await loop(w).cycle();
  assertEqual(calls(w).length, 0, 'a refused request reached research.mjs');
  git(w.builder, w.m.env, 'pull', '-q', '--ff-only');
  for (const [id, pattern] of [['inward', /internal address/], ['broken', /does not parse/], ['greedy', /over this collector's budget/]]) {
    const result = readJson(path.join(w.builder, 'research', 'requests', `${id}.result.json`));
    assertEqual(result.status, 'refused', id);
    assert(result.problems.some((p) => pattern.test(p)), `${id}: ${JSON.stringify(result.problems)}`);
  }
});

test('a builder machine does not collect, whatever the settings say', async () => {
  const w = world();
  writeText(w.m.configFile, JSON.stringify({ role: 'builder' }));
  saveAutoCollect({ mode: 'auto' }, w.m.env);
  builderPushes(w, 'burst-limit', GOOD);
  git(w.collector, w.m.env, 'pull', '-q', '--ff-only');
  const status = await loop(w).cycle({ force: true });
  assert(/role=builder/.test(status.blocked), status.blocked);
  assertEqual(calls(w).length, 0);
  assertEqual(status.requests[0].status, 'queued');
  assert(!fs.existsSync(path.join(w.collector, 'research', 'requests', 'burst-limit.result.json')));
});

test('when the credits run out auto-collect pauses, keeps the request open, and waits for the operator', async () => {
  const w = world({ STANDIN_MODE: 'stopped' });
  saveAutoCollect({ mode: 'auto' }, w.m.env);
  builderPushes(w, 'burst-limit', GOOD);
  builderPushes(w, 'second', { ...GOOD, urls: ['https://docs.example.com/other'] });
  const auto = loop(w);
  let status = await auto.cycle();
  assert(/credits ran out on firecrawl/.test(status.paused), status.paused);
  assertEqual(calls(w).length, 1, 'the run after the stop was attempted');
  assert(!calls(w)[0].includes('--fallback'), 'auto-collect passed --fallback');
  assert(!fs.existsSync(path.join(w.collector, 'research', 'requests', 'burst-limit.result.json')), 'a stopped request was marked finished');
  // What was collected before the stop is committed, ledger included.
  git(w.builder, w.m.env, 'pull', '-q', '--ff-only');
  assert(fs.existsSync(path.join(w.builder, 'research', 'raw', '.fetches.jsonl')), 'the partial corpus did not travel');

  status = await auto.cycle();
  assertEqual(calls(w).length, 1, 'a paused loop collected');
  assertEqual(status.requests.find((r) => r.id === 'second').status, 'waiting');
  status = auto.resume();
  assertEqual(status.paused, '');
});

test('a request over today\'s cap waits for tomorrow instead of being refused', async () => {
  const w = world();
  saveAutoCollect({ mode: 'auto', perRequestPages: 4, dailyPages: 3 }, w.m.env);
  builderPushes(w, 'burst-limit', GOOD);
  const status = await loop(w).cycle();
  assertEqual(calls(w).length, 0);
  const row = status.requests.find((r) => r.id === 'burst-limit');
  assertEqual(row.status, 'waiting');
  assert(/today's cap/.test(row.detail), row.detail);
});

test('a new topic is refused until the operator approves a folder for it', async () => {
  const w = world();
  saveAutoCollect({ mode: 'auto' }, w.m.env);
  builderPushes(w, 'new-topic', { ...GOOD, topic: 'Something else entirely' });
  await loop(w).cycle();
  assertEqual(calls(w).length, 0);
  const result = readJson(path.join(w.collector, 'research', 'requests', 'new-topic.result.json'));
  assertEqual(result.status, 'refused');
  assert(/no folder approved for new topics/.test(result.problems[0]), result.problems[0]);
});

test('mode off does nothing on the timer, and uncommitted work under research/ holds a run back', async () => {
  const w = world();
  builderPushes(w, 'burst-limit', GOOD);
  await loop(w).cycle();
  assertEqual(calls(w).length, 0, 'mode off collected');
  saveAutoCollect({ mode: 'auto' }, w.m.env);
  writeText(path.join(w.collector, 'research', 'EVIDENCE.md'), `${readText(path.join(w.collector, 'research', 'EVIDENCE.md'))}\nunfinished review\n`);
  const status = await loop(w).cycle();
  assertEqual(calls(w).length, 0, 'a run would have committed the operator\'s unfinished work');
  assert(/uncommitted changes/.test(status.requests[0].detail), status.requests[0].detail);
});

test('execFile reports a missing program instead of throwing', async () => {
  const r = await execFile(path.join(tempDir(), 'no-such-program'), []);
  assert(r.code !== 0, 'a missing program succeeded');
});
