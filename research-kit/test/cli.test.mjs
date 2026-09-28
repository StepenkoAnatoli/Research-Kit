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
import { pathToFileURL } from 'node:url';
import { test, describe, assert, tempDir, fs, path, KIT_ROOT, makePassingProject } from './harness.mjs';
import { renderBrief } from '../lib/brief.mjs';
import { scaffoldProject } from '../lib/scaffold.mjs';
import { spellCommand, documentCommand } from '../lib/core.mjs';

describe('cli');

const FAKE_KEY = ['4', '7', 'c', 'e'].join('') + 'd'.repeat(60);

function project(topic = 'cli probe') {
  const root = tempDir('rk-cli-');
  scaffoldProject(root, { topic });
  return root;
}

/** A project whose plan names one page and one query, so a dry run has something to plan. */
function planned(topic = 'cli probe') {
  const root = project(topic);
  fs.writeFileSync(path.join(root, 'research', 'plan.json'), JSON.stringify({
    topic, depth: 'probe', maxScrapes: 2, refreshDays: 30, limit: 8, perQuery: 1, prefer: [],
    queries: [{ q: 'a planned query', why: 'U-1' }], urls: [{ url: 'https://x.invalid/page', type: 'P', why: 'U-1' }],
  }));
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
      // And never the network: with a key present, --status reads the search vendor's
      // meter (ADR-0040). Pointed at a dead loopback port, that read fails fast and locally,
      // so no test can spend a real call - or a real key that the machine config holds.
      RESEARCH_KIT_SEARCH_ACCOUNT_ENDPOINT: 'http://127.0.0.1:9/account.json',
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

// Found 2026-09-27: a plan naming five pages with maxScrapes 2 printed two lines and "budget 2",
// and said nothing about the other three - pages the operator wrote down, left unfetched without
// a word. And --status said "up to 10 scrapes" for that plan: the depth's cap, not the run's.
test('pages left out by the budget are named, and --status states the budget the run will use', () => {
  const root = project('budget');
  fs.writeFileSync(path.join(root, 'research', 'plan.json'), JSON.stringify({
    topic: 'budget', depth: 'normal', maxScrapes: 2, refreshDays: 30, limit: 8, perQuery: 3, prefer: [], queries: [],
    urls: [1, 2, 3, 4, 5].map((i) => ({ url: `https://x.invalid/page-${i}`, type: 'P', why: `page ${i}` })),
  }));
  const dry = run('research.mjs', ['--plan', 'research/plan.json', '--dry-run', '--transport', 'http-keyless'], { root });
  for (const i of [3, 4, 5]) {
    assert.match(dry.out, new RegExp(`page-${i}.*budget`), `page-${i} was left out without a word:\n${dry.out}`);
  }
  assert.match(dry.out, /left\s+3 over the budget/, `the summary does not count what was left out:\n${dry.out}`);
  const status = run('research.mjs', ['--status', '--transport', 'http-keyless'], { root });
  assert.match(status.out, /up to 2 scrapes/, `--status overstated the budget:\n${status.out}`);
});

// Found 2026-09-27 following new-project's next steps: step 3, research.mjs, ran on the scaffolded
// plan - no queries, no urls - printed "collected 0" and exited 0. Nothing said the plan was empty,
// so a run that did nothing read as a run that found nothing.
test('research on an empty plan says so and exits 2, spending nothing', () => {
  const root = project('empty plan');
  for (const args of [['--dry-run', '--transport', 'http-keyless'], ['--transport', 'http-keyless']]) {
    const r = run('research.mjs', args, { root });
    assert.equal(r.status, 2, `exit ${r.status} on an empty plan (${args.join(' ')}):\n${r.out}${r.err}`);
    assert.match(r.err, /research\/plan\.json has no queries and no urls/, r.err);
    assert.doesNotMatch(r.out, /collected\s+0/, 'it still printed a run summary');
  }
});

// Found 2026-09-27: a plan with a trailing comma was reported as "has no queries and no urls",
// because the parse error was swallowed - the operator was sent to add queries that were there.
test('a plan that does not parse is named as not parsing, not as empty', () => {
  const root = project('broken plan');
  fs.writeFileSync(path.join(root, 'research', 'plan.json'), '{"topic":"x","queries":[{"q":"a query"}],}');
  const r = run('research.mjs', ['--dry-run', '--transport', 'http-keyless'], { root });
  assert.equal(r.status, 2, r.all);
  assert.match(r.err, /research\/plan\.json does not parse as JSON/, r.err);
  assert.doesNotMatch(r.err, /no queries and no urls/, 'it still said the plan was empty');
  const missing = run('research.mjs', ['--dry-run', '--plan', 'research/nope.json', '--transport', 'http-keyless'], { root });
  assert.equal(missing.status, 2, missing.all);
  assert.match(missing.err, /research\/nope\.json does not exist/, missing.err);
});

test('research reads a plan saved with a byte-order mark', () => {
  const root = planned('bom plan');
  const file = path.join(root, 'research', 'plan.json');
  fs.writeFileSync(file, `\uFEFF${fs.readFileSync(file, 'utf8')}`);
  const r = run('research.mjs', ['--dry-run', '--transport', 'http-keyless'], { root });
  assert.equal(r.status, 0, r.all);
  assert.match(r.out, /would search\s+"a planned query"/, r.out);
});

// Found the same day: --only with text no query contains ran nothing, printed "collected 0" and
// exited 0 - indistinguishable from a search that found nothing.
test('--only that matches no query says so and exits 2', () => {
  const root = planned('only');
  const r = run('research.mjs', ['--dry-run', '--transport', 'http-keyless', '--only', 'nothing like it'], { root });
  assert.equal(r.status, 2, r.all);
  assert.match(r.err, /--only matched none of the plan's 1 quer/, r.err);
  const ok = run('research.mjs', ['--dry-run', '--transport', 'http-keyless', '--only', 'PLANNED'], { root });
  assert.equal(ok.status, 0, `a match, in any case, still runs: ${ok.all}`);
});

// Found 2026-09-27: the README offers --dry-run as "see what it would fetch, and the cost", and a
// plan made of queries dry-ran to nothing - no query named, and "searches 0" at the end.
test('a dry run names every query it would search, and on which provider', () => {
  const root = project('dry queries');
  fs.writeFileSync(path.join(root, 'research', 'plan.json'), JSON.stringify({
    topic: 'dry queries', depth: 'probe', maxScrapes: 2, refreshDays: 30, limit: 8, perQuery: 3, prefer: [],
    queries: [{ q: 'first query text' }, 'second query text'], urls: [],
  }));
  const dry = run('research.mjs', ['--dry-run', '--transport', 'http-keyless'], { root });
  assert.match(dry.out, /would search\s+"first query text" on http-keyless/, dry.out);
  assert.match(dry.out, /would search\s+"second query text"/, dry.out);
});

test('RR-5: --status reports the search meter, with its caveat', () => {
  const r = run('research.mjs', ['--status'], { root: project() });
  assert.match(r.out, /searches \(this project\)/, 'the count is one project on this machine, not the box');
  assert.match(r.out, /in the last hour/);
  assert.match(r.out, /50\/hour and 250\/month/, 'the free-tier caps are not stated');
  assert.match(r.out, /not billed/, 'the over-count caveat is missing from the display');
});

test('RR-5 / U-9 / U-10: with SerpAPI as the meter, --status labels the caps and the month', () => {
  const r = run('research.mjs', ['--status'], { root: project(), env: { SERPAPI_API_KEY: FAKE_KEY } });
  assert.equal(r.status, 0, r.err);
  assert.match(r.out, /documented Free Plan/, 'the caps must be labelled as the documented plan (U-9)');
  assert.match(r.out, /account\.json/, 'the operator must be told where the account\'s own limits are');
  assert.match(r.out, /billing cycle/, 'the month must be named as not the vendor\'s (U-10)');
  assert.equal(r.out.includes(FAKE_KEY), false, 'the CLI printed the key');
});

test('ADR-0040: with a key, --status tries the vendor meter and says plainly when it cannot read it', () => {
  const r = run('research.mjs', ['--status'], { root: project(), env: { SERPAPI_API_KEY: FAKE_KEY } });
  assert.equal(r.status, 0, r.err);
  assert.match(r.out, /vendor meter\s+unavailable from serpapi\.com\/account\.json/);
  assert.equal(r.all.includes(FAKE_KEY), false, 'the CLI printed the key');
});

test('ADR-0040 / FR-5: with no key, --status makes no vendor-meter call and prints no such line', () => {
  const r = run('research.mjs', ['--status'], { root: project() });
  assert.equal(/vendor meter/.test(r.out), false);
});

test('RR-5: a fresh project reports zero searches, not NaN or blank', () => {
  const r = run('research.mjs', ['--status'], { root: project() });
  assert.match(r.out, /searches \(this project\) 0 in the last hour, 0 this month/);
});

// ---------------------------------------------------------------- FR-8  --dry-run

test('FR-8: --dry-run announces both providers and spends nothing', () => {
  const root = planned();
  const r = run('research.mjs', ['--dry-run'], { root, env: { SERPAPI_API_KEY: FAKE_KEY } });
  assert.equal(r.status, 0, r.err);
  assert.match(r.out, /^transport:/m);
  assert.match(r.out, /^search:\s+serpapi/m, 'the second provider was not announced before the run');

  // Nothing was collected, and nothing was logged as spend.
  assert.equal(fs.existsSync(path.join(root, 'research/raw/.usage.jsonl')), false,
    'a dry run wrote to the usage log');
});

test('FR-5: --dry-run with NO key does not mention a second provider at all', () => {
  const r = run('research.mjs', ['--dry-run'], { root: planned() });
  assert.equal(r.status, 0, r.err);
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
  const r = run('decompose.mjs', ['--topic', 'cli probe', '--dry-run'], { root });
  assert.equal(r.status, 0, r.err);
  assert.ok(fs.existsSync(path.join(root, 'research/MAP.md')), 'no map was written');
});

test('decompose refuses an unknown search provider before doing any work', () => {
  const root = project();
  const r = run('decompose.mjs', ['--topic', 'cli probe', '--search-transport', 'bing'], { root });
  assert.equal(r.status, 2, r.all);
  assert.match(r.all, /unknown search provider/);
});

// Found 2026-09-27: `decompose --topic x` in a project scaffolded for another topic wrote
// "x" into the map without a word, and the brief took its title from the map.
test('decompose takes the project\'s topic when --topic is omitted', () => {
  const root = project('replication slots under failover');
  const r = run('decompose.mjs', ['--dry-run'], { root });
  assert.equal(r.status, 0, r.all);
  assert.match(fs.readFileSync(path.join(root, 'research/MAP.md'), 'utf8'), /## Topic\s+replication slots under failover/);
});

test('decompose refuses a --topic that is not the project\'s, naming both', () => {
  const root = project('replication slots under failover');
  const before = fs.readFileSync(path.join(root, 'research/MAP.md'), 'utf8');
  const r = run('decompose.mjs', ['--topic', 'x', '--dry-run'], { root });
  assert.equal(r.status, 2, r.all);
  assert.match(r.all, /replication slots under failover/);
  assert.match(r.all, /"x"/);
  assert.equal(fs.readFileSync(path.join(root, 'research/MAP.md'), 'utf8'), before, 'the map was rewritten');
  // Spacing and case are not a different topic.
  assert.equal(run('decompose.mjs', ['--topic', '  Replication  slots under FAILOVER ', '--dry-run'], { root }).status, 0);
});

test('decompose accepts any --topic while the project is still "Untitled topic"', () => {
  const root = tempDir('rk-cli-');
  scaffoldProject(root);
  const r = run('decompose.mjs', ['--topic', 'a first topic', '--dry-run'], { root });
  assert.equal(r.status, 0, r.all);
  const bare = run('decompose.mjs', ['--dry-run'], { root });
  assert.equal(bare.status, 2, 'an untitled project has no topic to fall back on');
  assert.match(bare.all, /--topic/);
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
  const r = run('research.mjs', ['--dry-run'], { root: planned() });
  assert.equal(r.status, 0, r.err);
  assert.match(r.out, /^collected\s+\d+/m);
  assert.match(r.out, /^failed\s+\d+/m);
  assert.match(r.out, /^spent\s+\d+ \(budget consumed: collected \+ failed\)/m,
    'the cost must be reported separately from what arrived');
});

test('collect-remote refuses a --url that is not http(s), before it asks for a token', () => {
  // Fail fast on the caller's typo: without this, the missing-token refusal would hide it,
  // and with a token the bad line would have been searched as text on the runner.
  const r = run('collect-remote.mjs', ['--repository', 'o/r', '--topic', 't', '--url', 'ftp://x.example/a'], { root: project() });
  assert.equal(r.status, 3, r.all);
  assert.match(r.all, /not an http\(s\) URL/);
  assert.ok(!/token/i.test(r.err.split('\n')[0] ?? ''), 'the URL refusal must come first');
});

test('collect-remote refuses an --out it cannot write, before it asks for a token or dispatches', () => {
  // Found only after the download, this cost a paid run and up to half an hour of waiting.
  const root = project();
  fs.writeFileSync(path.join(root, 'a-file'), 'x');
  const r = run('collect-remote.mjs', ['--repository', 'o/r', '--topic', 't', '--out', path.join(root, 'a-file', 'sub')], { root });
  assert.equal(r.status, 3, r.all);
  assert.match(r.all, /OUT_DIR/);
  assert.match(r.all, /writable folder/);
  assert.ok(!/token/i.test(r.err.split('\n')[0] ?? ''), 'the folder refusal must come first');
});

test('collect-remote documents --url', () => {
  const r = run('collect-remote.mjs', ['--help'], { root: project() });
  assert.match(r.out, /--url/);
});

test('new-project prints next steps that run from the project it just made', () => {
  // Found 2026-09-27 by following the README on a fresh machine: from a project folder,
  // the printed "node research-kit/bin/decompose.mjs" crashes with MODULE_NOT_FOUND - that
  // path exists only at the repository root, which is the one place a project must not be.
  const target = tempDir('rk-next-');
  const r = run('new-project.mjs', [target, '--topic', 'a topic'], { root: project() });
  assert.equal(r.status, 0, r.all);
  // A kit under a folder with a space prints its commands double-quoted (ADR-0050), and a
  // checkout in "C:\Users\Jane Doe\..." is ordinary: an unquoted-only match made this red there.
  const commands = [...r.out.matchAll(/node ("[^"]+\.mjs"|\S+\.mjs)/g)].map((m) => m[1].replace(/^"|"$/g, ''));
  assert.ok(commands.length >= 3, `expected the next steps to name commands: ${r.out}`);
  for (const file of commands) {
    assert.ok(path.isAbsolute(file), `"${file}" is relative, so it only runs from one directory`);
    assert.ok(fs.existsSync(file), `"${file}" does not exist`);
  }
  assert.ok(r.out.includes(target), 'the next steps should say which folder to run them from');
});

// Found 2026-09-27. install.mjs printed next steps naming the kit it RAN FROM - a download the
// operator may delete as soon as the install is done - not the copy it had just installed.
test('install\'s next steps name the kit it installed, not the download it ran from', () => {
  const home = tempDir('rk-install-home-');
  const kit = path.join(home, '.agents', 'research-kit');
  const r = run('install.mjs', [], { root: home, env: { HOME: home, USERPROFILE: home, RESEARCH_KIT_HOME: kit, RESEARCH_KIT_CONFIG: path.join(home, 'absent.json') } });
  assert.equal(r.status, 0, r.all);
  const commands = [...r.out.matchAll(/node ("[^"]+\.mjs"|\S+\.mjs)/g)].map((m) => m[1].replace(/^"|"$/g, ''));
  assert.ok(commands.length >= 2, `no next steps printed:\n${r.out}`);
  for (const file of commands) {
    assert.ok(path.resolve(file).startsWith(path.resolve(kit)), `a next step names ${file}, outside the installed kit ${kit}`);
    assert.ok(fs.existsSync(file), `${file} does not exist`);
  }
});

// ADR-0050: a path with a space is double-quoted as it is, never JSON-escaped. JSON.stringify
// doubled every backslash of a Windows path: "C:\\Users\\John Smith\\...".
test('a printed command quotes a path with a space plainly, on Windows too', () => {
  assert.equal(spellCommand('C:\\Users\\John Smith\\.agents\\research-kit\\bin\\doctor.mjs'),
    'node "C:\\Users\\John Smith\\.agents\\research-kit\\bin\\doctor.mjs"');
  assert.equal(spellCommand('/opt/kit/bin/doctor.mjs', '--help'), 'node /opt/kit/bin/doctor.mjs --help');
});

// A file written into a project travels, so it cannot name this machine's absolute path. When
// the running kit is the standard install it is spelled as ADR-0050 spells a travelling project,
// and anywhere else (a repository checkout) by its real path, which is all this machine has.
test('a command written into a project file spells the standard install from $HOME', () => {
  const home = path.join(tempDir('rk-home-'), 'a home with space');
  fs.mkdirSync(path.join(home, '.agents'), { recursive: true });
  fs.symlinkSync(KIT_ROOT, path.join(home, '.agents', 'research-kit'), 'junction');
  assert.equal(documentCommand('brief.mjs', '--force', { kit: path.join(home, '.agents', 'research-kit'), home }),
    'node "$HOME/.agents/research-kit/bin/brief.mjs" --force');
  assert.equal(documentCommand('brief.mjs', '', { kit: KIT_ROOT, home: tempDir('rk-home-') }), spellCommand(path.join(KIT_ROOT, 'bin', 'brief.mjs')),
    'a kit outside the standard install has only its real path');
});

test('every command the kit tells you to run, runs from where you are', () => {
  // Found 2026-09-27 following the README on a fresh machine: from a project folder, the
  // remedies printed by preflight, doctor and research named "node research-kit/bin/...",
  // which exists only at the repository root. Copy-pasting a fix produced MODULE_NOT_FOUND.
  // Every printed command now names the running kit by its full path (kitCommand).
  // A scratch home: on a machine where the kit is installed, doctor has fewer next steps to
  // print, and the count below read the operator's machine rather than the kit (Arena, F-01).
  const root = planned();
  const home = tempDir('rk-cmd-home-');
  const env = { HOME: home, USERPROFILE: home, APPDATA: home, RESEARCH_KIT_CONFIG: path.join(home, 'c.json') };
  const outputs = [
    run('preflight.mjs', [], { root, env }).all,
    run('doctor.mjs', [], { root, env }).all,
    run('research.mjs', ['--dry-run'], { root, env }).all,
  ].join('\n');
  const commands = [...outputs.matchAll(/node ("[^"]+\.mjs"|\S+\.mjs)/g)].map((m) => m[1].replace(/^"|"$/g, ''));
  assert.ok(commands.length >= 3, `expected the CLIs to print some next steps, found ${commands.length}`);
  for (const file of commands) {
    assert.ok(path.isAbsolute(file) && fs.existsSync(file), `a printed command names "${file}", which does not run from a project folder`);
  }
});

// Found 2026-09-27: five CLIs ignored a flag they did not know. `install-hooks --unistall` would
// INSTALL the gates, and `new-project --topc "My topic"` scaffolded an "Untitled topic". Each CLI
// here gets what it otherwise needs to succeed, so the refusal cannot be another error's.
test('every CLI refuses a flag it does not know, before it does anything', () => {
  const home = tempDir('rk-flag-home-');
  const cases = [
    ['install-hooks.mjs', ['--dry-run']],
    // install copies the kit into place: a typo'd --dryrun deployed for real.
    ['install.mjs', ['--dry-run']],
    ['selftest.mjs', ['no-test-file-has-this-name']],
    ['new-project.mjs', [path.join(tempDir('rk-flag-np-'), 'p'), '--topic', 'x']],
    ['timeline.mjs', []],
    ['decompose.mjs', ['--topic', 'x', '--dry-run']],
    ['evidence-context.mjs', ['--all']],
    ['audit.mjs', []], ['brief.mjs', []], ['doctor.mjs', []], ['gate.mjs', []], ['handoff.mjs', []],
    ['preflight.mjs', []], ['prior.mjs', []], ['research.mjs', ['--dry-run']], ['bundle.mjs', []],
  ];
  for (const [bin, args] of cases) {
    const root = planned('flags');
    const r = run(bin, [...args, '--no-such-flag'], { root, env: { HOME: home, USERPROFILE: home, RESEARCH_KIT_CONFIG: path.join(home, 'c.json') } });
    assert.equal(r.status, 2, `${bin} exited ${r.status} on an unknown flag:\n${r.all.slice(0, 400)}`);
    assert.match(r.err, /unknown option --no-such-flag/, `${bin} did not name the flag:\n${r.all.slice(0, 400)}`);
  }
});

// Found 2026-09-27: a flag given a bad value, or none, was replaced by a default in silence.
// `research --depth thorough` printed "depth thorough" and ran on quick's budget;
// `--refresh-days abc` became NaN; `install-hooks --mode block` saved a mode the edit gate reads
// as "ask"; `new-project --topic` (no value) scaffolded "Untitled topic"; `preflight --only x`
// was accepted and never read. A value flag must carry a value, and a valid one.
test('a flag given a bad value, or none, is refused before anything runs', () => {
  const home = tempDir('rk-value-home-');
  const cases = [
    ['research.mjs', ['--dry-run', '--depth', 'thorough'], /--depth must be one of/],
    ['research.mjs', ['--dry-run', '--refresh-days', 'abc'], /--refresh-days must be a whole number/],
    ['research.mjs', ['--dry-run', '--plan'], /--plan needs a value/],
    ['research.mjs', ['--dry-run', '--only'], /--only needs a value/],
    ['install-hooks.mjs', ['--dry-run', '--mode', 'block'], /--mode must be one of/],
    ['install-hooks.mjs', ['--dry-run', '--role'], /--role needs a value/],
    ['new-project.mjs', [path.join(tempDir('rk-value-np-'), 'p'), '--topic'], /--topic needs a value/],
    ['evidence-context.mjs', ['--all', '--limit', 'abc'], /--limit must be a whole number/],
    ['evidence-context.mjs', ['--unknown'], /--unknown needs a value/],
    ['decompose.mjs', ['--dry-run', '--topic'], /--topic needs a value/],
    ['preflight.mjs', ['--check'], /--check needs a value/],
    ['gate.mjs', ['--gate', 'push'], /--gate must be one of/],
    ['prior.mjs', ['--file'], /--file needs a value/],
    ['audit.mjs', ['--topic'], /--topic needs a value/],
  ];
  for (const [bin, args, want] of cases) {
    const r = run(bin, args, { root: planned('values'), env: { HOME: home, USERPROFILE: home, RESEARCH_KIT_CONFIG: path.join(home, 'c.json') } });
    assert.equal(r.status, 2, `${bin} ${args.join(' ')} exited ${r.status}:\n${r.all.slice(0, 400)}`);
    assert.match(r.err, want, `${bin} ${args.join(' ')}:\n${r.all.slice(0, 400)}`);
  }
  const only = run('preflight.mjs', ['--only', 'citations'], { root: planned('values') });
  assert.equal(only.status, 2, `preflight --only is accepted and never read:\n${only.all.slice(0, 300)}`);
});

// Found 2026-09-27: new-project over an existing project with a different --topic reported
// "wrote 0, kept 13" and printed a fresh project's next steps. The topic asked for was not
// applied, and nothing said so.
test('new-project over an existing project says it kept it, and that --topic was not applied', () => {
  const dir = path.join(tempDir('rk-np-again-'), 'p');
  assert.equal(run('new-project.mjs', [dir, '--topic', 'First topic'], { root: tempDir() }).status, 0);
  const again = run('new-project.mjs', [dir, '--topic', 'Second topic'], { root: tempDir() });
  assert.equal(again.status, 0, again.all);
  assert.match(again.all, /already a project about "First topic"/, again.all);
  assert.match(again.all, /--topic "Second topic" was not applied/, again.all);
  assert.match(again.all, /--force/, 'the way to replace it is not named');
  const same = run('new-project.mjs', [dir, '--topic', 'First topic'], { root: tempDir() });
  assert.doesNotMatch(same.all, /was not applied/, 'the same topic again is not a conflict');
});

// Found 2026-09-27: `audit --version v9` without --show rendered (or declined to render) a new
// audit and never mentioned v9; `--topic` without --zip was dropped the same way. A flag that
// only means something beside another is refused alone.
// Found 2026-09-28: --zip refused a manifest naming a file outside research/audits/, and
// --show printed that same file. A manifest travels with the corpus from another machine,
// so what one reader refuses the other must refuse too - by name, and by symlink.
test('audit --show refuses a manifest file outside research/audits/, as --zip does', () => {
  const root = tempDir('rk-show-outside-');
  const audits = path.join(root, 'research', 'audits');
  fs.mkdirSync(audits, { recursive: true });
  fs.writeFileSync(path.join(root, 'outside.txt'), 'OUTSIDE-THE-AUDITS\n');
  const manifest = (file) => fs.writeFileSync(path.join(audits, 'index.json'),
    JSON.stringify({ topics: { t: { latest: '0.1', versions: { 0.1: { main: file, subtopics: [], date: '2026-09-28' } } } } }));

  manifest('research/audits/../../outside.txt');
  const named = run('audit.mjs', ['--show', 't'], { root });
  assert.equal(named.status, 1, named.all);
  assert.doesNotMatch(named.out, /OUTSIDE-THE-AUDITS/, 'the file outside research/audits/ was printed');
  assert.match(named.err, /resolves outside research\/audits\//);

  if (process.platform !== 'win32') {
    fs.symlinkSync(path.join(root, 'outside.txt'), path.join(audits, 'link.md'));
    manifest('research/audits/link.md');
    const linked = run('audit.mjs', ['--show', 't'], { root });
    assert.equal(linked.status, 1, linked.all);
    assert.doesNotMatch(linked.out, /OUTSIDE-THE-AUDITS/, 'a symlink out of research/audits/ was followed');
  }
});

test('audit refuses --version without --show, and --topic without --zip', () => {
  const root = planned('audit flags');
  const version = run('audit.mjs', ['--version', 'v9'], { root });
  assert.equal(version.status, 2, version.all);
  assert.match(version.err, /--version only works with --show <topic>/, version.all);
  const topic = run('audit.mjs', ['--topic', 'x'], { root });
  assert.equal(topic.status, 2, topic.all);
  assert.match(topic.err, /--topic only works with --zip/, topic.all);
});

// Found 2026-09-27: research.mjs read plan.json and replaced what it could not use with a
// default, in silence: "depth": "thorough" ran as quick, "maxScrapes": "five" as 10; a query
// written {"query": ...} was skipped and the run did nothing; "not a url" and ftp:// were
// queued for fetching. Every problem is named before anything runs.
test('a plan with values it cannot use is refused, naming each one', () => {
  const root = project('bad plan');
  fs.writeFileSync(path.join(root, 'research', 'plan.json'), JSON.stringify({
    topic: 't', depth: 'thorough', maxScrapes: 'five', refreshDays: -1,
    queries: [{ q: 'fine' }, { query: 'wrong key' }, ''],
    urls: ['not a url', 'ftp://x/y', { url: 'https://ok.example/page' }, { href: 'https://x' }],
  }));
  const r = run('research.mjs', ['--dry-run', '--transport', 'http-keyless'], { root });
  assert.equal(r.status, 2, r.all);
  for (const want of [/depth must be one of/, /maxScrapes must be a whole number/, /refreshDays must be a whole number/,
    /queries\[1\] has no "q"/, /queries\[2\] has no "q"/, /urls\[0\] is not an http\(s\) URL: not a url/,
    /urls\[1\] is not an http\(s\) URL: ftp:\/\/x\/y/, /urls\[3\] has no "url"/]) {
    assert.match(r.err, want, r.err);
  }
  assert.doesNotMatch(r.err, /queries\[0\]|urls\[2\]/, 'a valid entry was reported');
  fs.writeFileSync(path.join(root, 'research', 'plan.json'), JSON.stringify({ topic: 't', queries: 'just a string' }));
  const str = run('research.mjs', ['--dry-run', '--transport', 'http-keyless'], { root });
  assert.equal(str.status, 2, str.all);
  assert.match(str.err, /queries must be a list/, str.err);
});

// Found 2026-09-27, running the kit as a new user: new-project was given --topic and then
// told the user to type it again ('decompose.mjs --topic "<topic>"'), which decompose now
// takes from the project anyway (ADR-0056).
test('new-project\'s first next step does not ask for the topic it was just given', () => {
  const dir = path.join(tempDir('rk-np-next-'), 'p');
  const r = run('new-project.mjs', [dir, '--topic', 'replication slots'], { root: tempDir('rk-np-cwd-') });
  assert.equal(r.status, 0, r.all);
  const step = r.out.split('\n').find((l) => /^\s*1\./.test(l)) ?? '';
  assert.match(step, /decompose\.mjs/);
  assert.doesNotMatch(step, /--topic|<topic>/, step);
  const untitled = run('new-project.mjs', [path.join(tempDir('rk-np-next-'), 'p')], { root: tempDir('rk-np-cwd-') });
  assert.match(untitled.out.split('\n').find((l) => /^\s*1\./.test(l)) ?? '', /--topic "</, 'an untitled project must be told to name one');
});

// Found 2026-09-27: on a collector that had collected nothing, handoff said "Something did
// not travel. The remedy lives on the COLLECTOR machine" - which is the machine it ran on.
test('handoff on a collector with nothing collected says so, and names the command that collects', () => {
  const home = tempDir('rk-handoff-home-');
  const config = path.join(home, 'c.json');
  fs.writeFileSync(config, JSON.stringify({ role: 'collector' }));
  const env = { HOME: home, USERPROFILE: home, RESEARCH_KIT_CONFIG: config };
  const r = run('handoff.mjs', [], { root: project(), env });
  assert.equal(r.status, 1, 'there is nothing to hand off');
  assert.doesNotMatch(r.all, /did not travel/, r.all);
  assert.match(r.all, /nothing has been collected/);
  assert.match(r.all, /research\.mjs/);

  fs.writeFileSync(config, JSON.stringify({ role: 'builder' }));
  assert.match(run('handoff.mjs', [], { root: project(), env }).all, /did not travel/, 'a builder keeps the arrival remedy');
});

// Found 2026-09-27: every failing line was a map row (D-1..D-9), and preflight closed with
// "Each failing line names the unknown that is unproven".
test('preflight\'s closing line does not call every failure an unknown', () => {
  const r = run('preflight.mjs', [], { root: project() });
  assert.equal(r.status, 1, r.all);
  assert.doesNotMatch(r.all, /names the unknown that is unproven/);
});

// Found 2026-09-27: five documented commands exited 2 on --help, and `artifact --bogus`
// printed the help without naming the flag it did not know.
test('every documented command exits 0 on --help and prints its usage to stdout', () => {
  for (const bin of ['artifact.mjs', 'fi-sidecar-conformance.mjs', 'ledger-conformance.mjs', 'path-authority.mjs', 'researcher-release.mjs']) {
    const r = run(bin, ['--help'], { root: project() });
    assert.equal(r.status, 0, `${bin} --help exited ${r.status}`);
    assert.match(r.out, /usage|node /i, `${bin} printed its help somewhere other than stdout`);
  }
});

test('artifact with no subcommand names the flag it does not know', () => {
  const r = run('artifact.mjs', ['--bogus-flag'], { root: project() });
  assert.equal(r.status, 2);
  assert.match(r.err, /unknown option --bogus-flag/);
});

// Found 2026-09-27: a builder got "handoff OK" for a brief whose two judged sections were
// still TODO - a handoff nobody had reviewed - and nothing in the output said so.
test('handoff OK names a brief that is still a draft, without failing', () => {
  const root = makePassingProject();
  renderBrief(root);
  const r = run('handoff.mjs', [], { root });
  assert.equal(r.status, 0, r.all);
  assert.match(r.out, /BRIEF\.md is a draft/);
  assert.match(r.out, /contradictions/);
  assert.match(r.out, /decision/);
});

// Found 2026-09-27: `research --status` printed 0 searches beside a balance that had fallen by 9.
test('research --status shows Firecrawl search credits as an estimate', () => {
  const root = planned('status probe');
  fs.writeFileSync(path.join(root, 'research', 'raw', '.usage.jsonl'),
    `${JSON.stringify({ at: new Date().toISOString(), spent: 1, transport: 'firecrawl-cli', searchTransport: 'firecrawl-cli', searchesUsed: 4, searchCreditsEstimate: 8 })}\n`);
  const r = run('research.mjs', ['--status', '--transport', 'http-keyless'], { root });
  assert.equal(r.status, 0, r.all);
  assert.match(r.out, /searches \(this project\) 4 in the last hour/);
  assert.match(r.out, /≈8 credits/);
});

// Found 2026-09-27: the brief records "Gate: FAIL" in its text, and nothing compared that with
// the verdict preflight had just printed.
test('preflight says when the brief was drafted under the other verdict', () => {
  const root = makePassingProject();
  renderBrief(root, { verdict: { pass: false, counts: { fail: 9 } } });
  const r = run('preflight.mjs', [], { root });
  assert.equal(r.status, 0, r.all);
  assert.match(r.out, /BRIEF\.md was drafted when the gate failed/, r.out);
  assert.match(r.out, /brief\.mjs/);
});

// Found 2026-09-27 (break-test): `selftest.mjs` run from any folder but the repository root
// crashed at import - fi-validator-conformance reads `research-kit/schemas/...` relative to
// the cwd - so no test ran and no count was printed. The suite now runs from the repository
// root whatever the caller's cwd, and a relative result file still lands where it was asked.
test('the suite runs from any cwd, and a relative result file lands in the caller\'s folder', () => {
  const root = tempDir('rk-suite-cwd-');
  const r = run('selftest.mjs', ['fi-validator-conformance'], { root, env: { RESEARCH_KIT_RESULT_FILE: 'result.json' } });
  assert.equal(r.status, 0, `the suite failed from another cwd:\n${r.all.slice(0, 600)}`);
  assert.match(r.out, /\d+ passed, 0 failed/);
  const result = JSON.parse(fs.readFileSync(path.join(root, 'result.json'), 'utf8'));
  assert.equal(result.exit, 0);
});

// Found 2026-09-28 (break-test): in a DEPLOYED kit (`install.mjs` into a scratch HOME) the
// suite reported 100+ failing tests - every test that reads repository fixtures a deploy
// does not ship (CI workflows, docs/, AGENTS.md, the collected corpus) was red on a
// healthy install, indistinguishable from a broken one. The suite now refuses there,
// naming the checkout it needs and the check that verifies a deployment.
test('the suite refuses a deployed kit, and names the check that verifies one', () => {
  const home = tempDir('rk-deployed-suite-');
  const kit = path.join(home, '.agents', 'research-kit');
  const env = { HOME: home, USERPROFILE: home, RESEARCH_KIT_HOME: kit, RESEARCH_KIT_CONFIG: path.join(home, 'absent.json') };
  const installed = run('install.mjs', [], { root: home, env });
  assert.equal(installed.status, 0, installed.all);
  const refused = spawnSync(process.execPath, [path.join(kit, 'bin', 'selftest.mjs')], {
    cwd: home, encoding: 'utf8', timeout: 60_000, windowsHide: true,
    env: { PATH: process.env.PATH, SystemRoot: process.env.SystemRoot, ...env },
  });
  const all = `${refused.stdout ?? ''}${refused.stderr ?? ''}`;
  assert.equal(refused.status, 2, `a deployed kit's suite did not refuse:\n${all.slice(0, 600)}`);
  assert.match(all, /repository checkout/);
  assert.match(all, /doctor\.mjs/);
});

// Found 2026-09-28 (gap sweep): run from a folder that is not a research project, brief.mjs
// drafted research/BRIEF.md about nothing and timeline.mjs wrote research/TIMELINE.md, both
// exiting 0. A later new-project in that folder KEPT the stray brief. preflight already says
// "not gated - nothing to judge"; the two writers now refuse there and write nothing.
test('brief and timeline refuse a folder that is not a research project, and write nothing', () => {
  for (const bin of ['brief.mjs', 'timeline.mjs']) {
    const root = tempDir('rk-not-a-project-');
    const r = run(bin, [], { root });
    assert.equal(r.status, 2, `${bin} exited ${r.status} outside a project:\n${r.all.slice(0, 400)}`);
    assert.match(r.err, /not a research project/, `${bin} did not say why:\n${r.all.slice(0, 400)}`);
    assert.match(r.err, /new-project\.mjs/, `${bin} did not name the way to make one`);
    assert.deepEqual(fs.readdirSync(root), [], `${bin} wrote into a folder that is not a project`);
  }
});

// Found 2026-09-28 (gap sweep): with a temp folder the suite cannot write (uid nobody,
// TMPDIR read-only) the run reported 541 failures, every one EACCES, and nothing said the
// cause was one setting. The runner now tries the temp folder once, first, and names it
// and the fix at the top and again under the red summary.
test('an unusable temp folder is named once, with the fix, not left to hundreds of failures', () => {
  const file = path.join(tempDir('rk-tmp-file-'), 'not-a-folder');
  fs.writeFileSync(file, 'a regular file where the temp folder should be\n');
  const r = run('selftest.mjs', ['artifact-cli'], { root: tempDir('rk-tmp-cwd-'), env: { TMPDIR: file, TEMP: file, TMP: file } });
  assert.notEqual(r.status, 0, 'a run that could not create a scratch folder passed');
  const said = r.all.split(file).length - 1;
  assert.ok(said >= 2, `the temp folder was not named at the top and in the summary (${said}x):\n${r.all.slice(0, 600)}`);
  assert.match(r.all, /temp folder/);
  assert.match(r.all, /TMPDIR/);
});

// Found 2026-09-28 (an outside break-test, F-03; confirmed as uid nobody in a read-only
// project): a write the environment refuses reached the top of timeline, brief --force,
// new-project, doctor --fix-arity and install as a raw Node stack trace, exit 1 - which
// reads as a bug in the kit and collides with "a check failed". Each now names the file and
// the reason in words, and exits 2. Triggered portably: a folder where a file belongs (a
// chmod is a no-op on Windows), and an injected ENOSPC for the lock write.
const writeRefused = (r, bin, file) => {
  assert.equal(r.status, 2, `${bin} exited ${r.status}:\n${r.all.slice(0, 500)}`);
  assert.match(r.err, /could not write/, `${bin} did not name the failure:\n${r.all.slice(0, 500)}`);
  assert.ok(r.err.includes(file), `${bin} did not name ${file}:\n${r.err.slice(0, 500)}`);
  assert.doesNotMatch(r.all, /^\s+at .+:\d+:\d+\)?$/m, `${bin} printed a stack trace:\n${r.all.slice(0, 800)}`);
  assert.doesNotMatch(r.all, /node:fs:/, `${bin} printed Node internals`);
};

test('timeline and brief --force name a refused write, exit 2, and print no stack', () => {
  for (const [bin, args, file] of [['timeline.mjs', [], 'TIMELINE.md'], ['brief.mjs', ['--force'], 'BRIEF.md']]) {
    const root = makePassingProject(tempDir('rk-refused-'));
    const target = path.join(root, 'research', file);
    fs.rmSync(target, { force: true, recursive: true });
    fs.mkdirSync(target);
    writeRefused(run(bin, args, { root }), bin, file);
  }
});

test('new-project and install name a refused write, exit 2, and print no stack', () => {
  const blocker = path.join(tempDir('rk-refused-'), 'a-file');
  fs.writeFileSync(blocker, 'a file where a folder is needed\n');
  writeRefused(run('new-project.mjs', [path.join(blocker, 'proj'), '--topic', 'x'], { root: tempDir('rk-np-cwd-') }), 'new-project.mjs', 'a-file');
  const home = tempDir('rk-refused-home-');
  writeRefused(run('install.mjs', [], { root: home, env: { HOME: home, USERPROFILE: home, RESEARCH_KIT_HOME: path.join(blocker, 'kit'), RESEARCH_KIT_CONFIG: path.join(home, 'c.json') } }),
    'install.mjs', 'a-file');
});

test('doctor --fix-arity names a refused lock write, exit 2, and prints no stack', () => {
  const root = makePassingProject(tempDir('rk-refused-'));
  const loader = path.join(tempDir('rk-loader-'), 'enospc.mjs');
  fs.writeFileSync(loader, `import fs from 'node:fs';
const open = fs.openSync;
fs.openSync = (p, ...rest) => {
  if (String(p).endsWith('.fetches.lock')) { const e = new Error('ENOSPC: no space left on device, open'); e.code = 'ENOSPC'; e.path = String(p); throw e; }
  return open(p, ...rest);
};
`);
  const home = tempDir('rk-refused-home-');
  writeRefused(run('doctor.mjs', ['--fix-arity'], { root, env: { NODE_OPTIONS: `--import=${pathToFileURL(loader).href}`, HOME: home, USERPROFILE: home, RESEARCH_KIT_CONFIG: path.join(home, 'c.json') } }),
    'doctor.mjs', '.fetches.lock');
});
