// The forty lines nobody was testing: gap 1 of the validation map.
//
// The library under these entrypoints is covered thoroughly. The entrypoints themselves -
// flag parsing, precedence wiring, what actually gets printed - were checked by me
// running them once and reading the output. A future edit to `parseFlags` or to a
// template literal would have broken them silently.
//
// So these tests SPAWN the real binaries and read their real stdout. Nothing here spends
// a credit: every invocation is `--help`, `--status` or `--dry-run`, and the one test
// that resolves a provider does so with a fake key, because selection never touches the
// network.

import { spawnSync } from 'node:child_process';
import { test, describe, assert, tempDir, fs, path, KIT_ROOT } from './harness.mjs';
import { scaffoldProject } from '../lib/scaffold.mjs';

describe('cli');

const FAKE_KEY = ['4', '7', 'c', 'e'].join('') + 'd'.repeat(60);

function project(topic = 'cli probe') {
  const root = tempDir('rk-cli-');
  scaffoldProject(root, { topic });
  return root;
}

/**
 * Run a kit binary in a project and hand back what it said.
 *
 * The environment is built rather than inherited, so a variable that happens to be set
 * on the developer's machine cannot decide the outcome of a test - which is exactly how
 * a precedence test passes for the wrong reason.
 */
function run(bin, args, { root, env = {} } = {}) {
  const result = spawnSync(process.execPath, [path.join(KIT_ROOT, 'bin', bin), ...args], {
    cwd: root,
    encoding: 'utf8',
    timeout: 60_000,
    windowsHide: true,
    env: {
      PATH: process.env.PATH,
      SystemRoot: process.env.SystemRoot,
      HOME: process.env.HOME,
      USERPROFILE: process.env.USERPROFILE,
      APPDATA: process.env.APPDATA,
      // No key, no transport preference, unless a test asks for one.
      ...env,
    },
  });
  return {
    status: result.status,
    out: String(result.stdout ?? ''),
    err: String(result.stderr ?? ''),
    all: `${result.stdout ?? ''}${result.stderr ?? ''}`,
  };
}

// ---------------------------------------------------------------- FR-6  the flag exists

test('FR-6: research --help documents --search-transport and names every provider', () => {
  const r = run('research.mjs', ['--help'], { root: project() });
  assert.equal(r.status, 0, r.err);
  assert.match(r.out, /--search-transport/);
  assert.match(r.out, /serpapi/, 'the help does not name the provider the flag exists for');
  assert.match(r.out, /--transport/, 'the fetch flag went missing');
  assert.match(r.out, /the SEARCH side only/i);
});

test('FR-6: decompose --help documents it too', () => {
  const r = run('decompose.mjs', ['--help'], { root: project() });
  assert.match(r.out, /--search-transport/);
  assert.match(r.out, /serpapi/);
});

test('FR-6: an unknown search provider is refused by the CLI, with exit 2', () => {
  const r = run('research.mjs', ['--status', '--search-transport', 'bing'], { root: project() });
  assert.equal(r.status, 2, `expected a refusal, got status ${r.status}: ${r.all}`);
  assert.match(r.all, /unknown search provider "bing"/);
  assert.match(r.all, /serpapi/, 'the refusal does not name what IS available');
});

test('FR-6: an unknown FETCH transport is still refused - the old path is intact', () => {
  const r = run('research.mjs', ['--status', '--transport', 'nope'], { root: project() });
  assert.equal(r.status, 2);
  assert.match(r.all, /unknown transport "nope"/);
});

// ---------------------------------------------------------------- FR-8  --status

test('FR-8: --status names BOTH providers before anything is spent', () => {
  const r = run('research.mjs', ['--status'], { root: project() });
  assert.equal(r.status, 0, r.err);
  assert.match(r.out, /^transport\s+/m);
  assert.match(r.out, /^search transport\s+/m, 'the search side is not reported');
});

test('FR-5/FR-8: with no key, --status says the two sides share one meter', () => {
  const r = run('research.mjs', ['--status'], { root: project() });
  assert.match(r.out, /search transport.*same meter as fetch/,
    `the default changed without a key being present:\n${r.out}`);
  assert.equal(/serpapi/.test(r.out), false, 'a provider nobody configured was selected');
});

test('FR-1/FR-8: a key in the ENVIRONMENT moves the search side, and --status says so', () => {
  const r = run('research.mjs', ['--status'], { root: project(), env: { SERPAPI_API_KEY: FAKE_KEY } });
  assert.equal(r.status, 0, r.err);
  assert.match(r.out, /search transport\s+serpapi/);
  assert.match(r.out, /own meter/);
  assert.equal(r.out.includes(FAKE_KEY), false, 'the CLI printed the key');
});

test('SR-2: no CLI output carries the key, on any path', () => {
  const root = project();
  for (const args of [['--status'], ['--dry-run'], ['--help']]) {
    const r = run('research.mjs', args, { root, env: { SERPAPI_API_KEY: FAKE_KEY } });
    assert.equal(r.all.includes(FAKE_KEY), false, `${args.join(' ')} printed the key`);
  }
});

test('FR-6: the flag outranks the environment, end to end through the CLI', () => {
  // The precedence ladder is unit-tested; this proves the CLI actually wires it.
  const r = run('research.mjs', ['--status', '--search-transport', 'http-keyless'], {
    root: project(),
    env: { SERPAPI_API_KEY: FAKE_KEY },
  });
  assert.match(r.out, /search transport\s+http-keyless/,
    `the flag lost to the environment:\n${r.out}`);
});

test('RR-5: --status reports the search meter, with its caveat', () => {
  const r = run('research.mjs', ['--status'], { root: project() });
  assert.match(r.out, /searches \(this box\)/);
  assert.match(r.out, /in the last hour/);
  assert.match(r.out, /50\/hour and 250\/month/, 'the free-tier caps are not stated');
  assert.match(r.out, /not billed/, 'the over-count caveat is missing from the display');
});

test('RR-5: a fresh project reports zero searches, not NaN or blank', () => {
  const r = run('research.mjs', ['--status'], { root: project() });
  assert.match(r.out, /searches \(this box\) 0 in the last hour, 0 this month/);
});

// ---------------------------------------------------------------- FR-8  --dry-run

test('FR-8: --dry-run announces both providers and spends nothing', () => {
  const root = project();
  const r = run('research.mjs', ['--dry-run'], { root, env: { SERPAPI_API_KEY: FAKE_KEY } });
  assert.equal(r.status, 0, r.err);
  assert.match(r.out, /^transport:/m);
  assert.match(r.out, /^search:\s+serpapi/m, 'the second provider was not announced before the run');

  // Nothing was collected, and nothing was logged as spend.
  assert.equal(fs.existsSync(path.join(root, 'research/raw/.usage.jsonl')), false,
    'a dry run wrote to the usage log');
});

test('FR-5: --dry-run with NO key does not mention a second provider at all', () => {
  const r = run('research.mjs', ['--dry-run'], { root: project() });
  assert.equal(/^search:/m.test(r.out), false,
    `a run with one provider announced two:\n${r.out}`);
});

// ---------------------------------------------------------------- doctor

test('FR-7: doctor reports the search provider on its own line', () => {
  const r = run('doctor.mjs', [], { root: project() });
  assert.match(r.all, /search-transport/, 'doctor does not report the search side');
});

test('FR-7: doctor names serpapi when a key is configured', () => {
  const r = run('doctor.mjs', [], { root: project(), env: { SERPAPI_API_KEY: FAKE_KEY } });
  assert.match(r.all, /search-transport\s+serpapi/);
  assert.equal(r.all.includes(FAKE_KEY), false, 'doctor printed the key');
});

test('ADR-0028: doctor reports the bundle, and a project without one stays quiet', () => {
  // A scaffolded project has no BUNDLE_INDEX.md, and must not be nagged about a file it
  // was never handed.
  const r = run('doctor.mjs', [], { root: project() });
  assert.equal(/bundle\s/.test(r.all), false,
    `a project with no archive was told about one:\n${r.all}`);
});

test('ADR-0028: bin/bundle.mjs reports this repository honestly', () => {
  const r = run('bundle.mjs', [], { root: path.resolve(KIT_ROOT, '..') });
  assert.equal(r.status, 0, r.err);
  assert.match(r.out, /still byte-identical to the 2026-09-17 archive/);
  assert.equal(/changed UNEXPECTEDLY/.test(r.out), false,
    `a bundled document changed with no rule requiring it:\n${r.out}`);
});

test('ADR-0028: bundle.mjs on a project with no manifest says so and exits 0', () => {
  const r = run('bundle.mjs', [], { root: project() });
  assert.equal(r.status, 0);
  assert.match(r.out, /BUNDLE_INDEX\.md is not in this project/);
});

// ---------------------------------------------------------------- decompose

test('FR-6: decompose --dry-run announces the providers and writes a map', () => {
  const root = project();
  const r = run('decompose.mjs', ['--topic', 'a topic', '--dry-run'], { root });
  assert.equal(r.status, 0, r.err);
  assert.ok(fs.existsSync(path.join(root, 'research/MAP.md')), 'no map was written');
});

test('decompose refuses an unknown search provider before doing any work', () => {
  const root = project();
  const r = run('decompose.mjs', ['--topic', 'a topic', '--search-transport', 'bing'], { root });
  assert.equal(r.status, 2, r.all);
  assert.match(r.all, /unknown search provider/);
});

// ---------------------------------------------------------------- --plan

test('--plan actually reads the file it is given', () => {
  // It did not, for the entire life of the flag. `readPlan(root)` ignored the filename
  // and re-read the default, so `--plan probe.json` ran the project's own plan and
  // looked like it had worked.
  const root = project('default topic');
  fs.writeFileSync(path.join(root, 'research/other-plan.json'), JSON.stringify({
    topic: 'a DIFFERENT plan',
    depth: 'deep',
    refreshDays: 7,
    limit: 2,
    perQuery: 1,
    maxScrapes: 2,
    queries: [{ q: 'one query', why: 'U-1' }],
    urls: ['https://planned.example/a', 'https://planned.example/b'],
  }, null, 2));

  const mine = run('research.mjs', ['--status', '--plan', 'research/other-plan.json'], { root });
  assert.equal(mine.status, 0, mine.err);
  assert.match(mine.out, /topic\s+a DIFFERENT plan/, `--plan was ignored:\n${mine.out}`);
  assert.match(mine.out, /depth\s+deep/);
  assert.match(mine.out, /queries \/ urls\s+1 \/ 2/);
  assert.match(mine.out, /refresh-days\s+7/);

  // And without the flag, the project's own plan is still what runs.
  const theirs = run('research.mjs', ['--status'], { root });
  assert.equal(/a DIFFERENT plan/.test(theirs.out), false,
    `the named plan leaked into a run that did not ask for it:\n${theirs.out}`);
});

test('--plan and the run agree about which plan is in force', () => {
  // --status reporting one plan while the run executes another is the shape of a very
  // expensive surprise: the preview says 2 scrapes, the run spends 10.
  const root = project();
  fs.writeFileSync(path.join(root, 'research/tiny.json'), JSON.stringify({
    topic: 'tiny', depth: 'probe', refreshDays: 30, limit: 1, perQuery: 1, maxScrapes: 1,
    queries: [], urls: ['https://planned.example/only'],
  }, null, 2));

  const status = run('research.mjs', ['--status', '--plan', 'research/tiny.json'], { root });
  assert.match(status.out, /depth\s+probe/);

  const dry = run('research.mjs', ['--dry-run', '--plan', 'research/tiny.json'], { root });
  assert.match(dry.out, /https:\/\/planned\.example\/only/, `the run used a different plan:\n${dry.out}`);
  assert.match(dry.out, /depth\s+probe/);
});

test('--plan naming a file that is not there falls back to an empty plan, not a crash', () => {
  const root = project();
  const r = run('research.mjs', ['--status', '--plan', 'research/does-not-exist.json'], { root });
  assert.equal(r.status, 0, r.err);
  assert.match(r.out, /queries \/ urls\s+0 \/ 0/);
});
