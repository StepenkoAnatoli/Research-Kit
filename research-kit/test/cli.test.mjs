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

// ---------------------------------------------------------------- the verdict label

test('the verdict names the setting that decided it, so --strict cannot read as pluralist', () => {
  // `--strict` and `evidencePolicy=strict` are different settings: the flag promotes EVERY
  // warning, the policy promotes only the three POLICY_CHECKS. The summary printed the
  // declared policy either way, so a `--strict` run read
  // `FAIL ... [evidencePolicy=pluralist]` - which says the pluralist policy failed it. It
  // did not; the flag did, and the person reading that line is trying to find out why.
  const root = project();

  const plain = run('preflight.mjs', [], { root });
  assert.match(plain.out, /\[evidencePolicy=pluralist\]/);
  assert.doesNotMatch(plain.out, /--strict/, 'a run without the flag must not mention it');

  const strict = run('preflight.mjs', ['--strict'], { root });
  assert.match(strict.out, /\[--strict, over evidencePolicy=pluralist\]/,
    'the flag has to appear, and the declared policy has to stay visible under it');
});

// ---------------------------------------------------------------- unknown flags

test('every entrypoint REFUSES an unknown flag instead of doing its default thing', () => {
  // This cost 26 Firecrawl credits to learn. `research.mjs --totally-made-up-flag` was run
  // to find out whether unknown flags were refused; they were not, so it ignored the flag,
  // fell through to its default behaviour, and started a real collection against this
  // repository's corpus. `audit.mjs` did the same and wrote twelve files.
  //
  // `parseFlags` knows no flag names on purpose, so silence is the default outcome for any
  // entrypoint that does not check. This asserts that none of them skips the check.
  const root = project();
  for (const bin of ['research.mjs', 'audit.mjs', 'handoff.mjs', 'preflight.mjs',
    'doctor.mjs', 'gate.mjs', 'brief.mjs', 'bundle.mjs']) {
    const r = run(bin, ['--totally-made-up-flag'], { root });
    assert.notEqual(r.status, 0, `${bin} accepted an unknown flag`);
    assert.match(r.err, /unknown option --totally-made-up-flag/, `${bin} did not name the flag`);
    assert.match(r.err, /known options:/, `${bin} did not list what it does accept`);
  }
});

test('a real flag is still accepted after the refusal was added', () => {
  // The other half. A check that refuses everything would pass the test above and break
  // every caller, so each entrypoint is driven with a flag it genuinely has.
  const root = project();
  for (const [bin, flag] of [['handoff.mjs', '--json'], ['preflight.mjs', '--json'],
    ['doctor.mjs', '--json'], ['bundle.mjs', '--all'], ['research.mjs', '--status']]) {
    const r = run(bin, [flag], { root });
    assert.doesNotMatch(r.err ?? '', /unknown option/, `${bin} refused its own ${flag}`);
  }
});

test('no workflow passes a flag its entrypoint does not accept', () => {
  // The dead flag this fix surfaced: collect.yml and live-collection.yml both passed
  // `--max-scrapes` to research.mjs, which has no such flag. The page bound people believed
  // that set was really coming from plan.maxScrapes - real in collect.yml, and ABSENT in
  // live-collection.yml, where max_pages was validated and then ignored entirely.
  const workflows = fs.readdirSync(path.join(KIT_ROOT, '..', '.github', 'workflows'))
    .filter((f) => f.endsWith('.yml'));
  const offenders = [];
  for (const file of workflows) {
    const text = fs.readFileSync(path.join(KIT_ROOT, '..', '.github', 'workflows', file), 'utf8');
    // The `"?` is load-bearing: workflows write `node "$KIT/bin/research.mjs" --depth …`,
    // so a closing quote sits between the entrypoint and its first flag. Without it this
    // test matched an empty flag list and passed on a workflow that DID carry the dead
    // flag - confirmed by restoring `--max-scrapes` and watching it stay green.
    for (const m of text.matchAll(/bin\/([a-z-]+)\.mjs"?((?: --[a-z-]+(?: "[^"]*"| [^ -]\S*)?)*)/g)) {
      for (const f of m[2].matchAll(/--([a-z-]+)/g)) {
        if (m[1] === 'research' && f[1] === 'max-scrapes') offenders.push(`${file}: research.mjs --${f[1]}`);
      }
    }
  }
  assert.deepEqual(offenders, [], 'a workflow passes a flag the entrypoint does not have');
});

test('the run summary distinguishes what landed from what it cost', () => {
  // `spent` is collected + failed, because a failed fetch still consumes budget. The
  // summary printed that number under the label "collected", so a run that fetched two
  // pages and lost six to a Firecrawl rate limit reported `collected 8` while its artifact
  // carried two captures. Found 2026-09-22 by comparing a run log against its own ZIP.
  const r = run('research.mjs', ['--dry-run'], { root: project() });
  assert.equal(r.status, 0, r.err);
  assert.match(r.out, /^collected\s+\d+/m);
  assert.match(r.out, /^failed\s+\d+/m);
  assert.match(r.out, /^spent\s+\d+ \(budget consumed: collected \+ failed\)/m,
    'the cost must be reported separately from what arrived');
});
