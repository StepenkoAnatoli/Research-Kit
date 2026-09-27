// Phase 0 gathers material and seeds the checklist. It contains NO judgment: it hands
// over statuses BLANK, and `subtopic-coverage` is what judges them afterwards.

import { test, describe, assert, makeProject, makePassingProject, fs } from './harness.mjs';
import { PATHS, resolve, readText, listFiles } from '../lib/core.mjs';
import { decompose, parseRecipe, loadRecipe, docsHosts, RECIPE_DIR, searchSummary } from '../lib/decompose.mjs';
import { UNIVERSAL_DIMENSIONS, seedRows, coverageOfUniversals } from '../lib/dimensions.mjs';
import { readCorpus } from '../lib/corpus.mjs';
import { searchUsage } from '../lib/research-run.mjs';
import { runCheck } from '../lib/checks.mjs';

describe('decompose');

const PAGE = `# Limits\n\n${'The free plan allows 10 requests per minute and includes 1,000 credits. '.repeat(25)}`;

function stubAdapter(results = []) {
  return {
    name: 'stub-transport',
    search: (query) => ({ ok: true, query, results }),
    runScrape: (url) => ({ ok: true, url, title: 'Limits', markdown: PAGE, statusCode: 200, transport: 'stub-transport', completeness: 'full', cmd: `stub scrape ${url}` }),
  };
}

test('nine universal dimensions, and output obtainability is one of them', () => {
  assert.equal(UNIVERSAL_DIMENSIONS.length, 9);
  const names = UNIVERSAL_DIMENSIONS.map((d) => d.name);
  assert.ok(names.includes('Output obtainability'), 'the load-bearing one');
  assert.ok(names.some((n) => /ToS/.test(n)), 'legality is never droppable');
});

test('the seeded rows arrive with statuses BLANK - the tool hands over a checklist, not an answer', () => {
  const rows = seedRows();
  assert.equal(rows.length, 9);
  for (const row of rows) {
    assert.equal(row.status, '', `${row.id} arrived with a status`);
    assert.equal(row.coveredBy, '');
  }
});

test('a draft map holds every universal dimension and no status at all', () => {
  const dir = makeProject();
  const result = decompose(dir, { topic: 'Widget pricing', dryRun: true });
  assert.equal(result.written, true);

  const text = readText(resolve(dir, PATHS.map));
  assert.match(text, /Widget pricing/);
  for (const dimension of UNIVERSAL_DIMENSIONS) {
    assert.match(text, new RegExp(`\\| ${dimension.id} \\|`), `${dimension.id} is missing from the draft`);
  }
  assert.doesNotMatch(text, /\|\s*(COVERED|DISMISSED|GAP)\s*\|/, 'phase 0 writes no status');

  // And the gate says so: an unstatused row is a GAP until the agent fills it.
  const corpus = readCorpus(dir);
  const findings = runCheck('subtopic-coverage', corpus);
  assert.ok(findings.some((f) => f.severity === 'fail' && f.rule === 'gap'));
});

test('a recipe ADDS dimensions on top of the universal set and never replaces it', () => {
  const dir = makeProject();
  const result = decompose(dir, { topic: 'Some API', recipe: 'api-integration', dryRun: true });
  assert.equal(result.universal, 9);
  assert.ok(result.added > 0);

  const corpus = readCorpus(dir);
  assert.equal(coverageOfUniversals(corpus.subtopics).missing.length, 0,
    'a recipe that silently dropped legality would be worse than no recipe');
  assert.ok(corpus.subtopics.length > 9);
  assert.ok(corpus.subtopics.some((row) => row.id.startsWith('S-')));
});

test('every shipped recipe keeps the universal set whole', () => {
  const names = listFiles(RECIPE_DIR).filter((n) => n.endsWith('.md')).map((n) => n.replace(/\.md$/, ''));
  assert.equal(names.length, 5);
  for (const name of names) {
    const dir = makeProject();
    decompose(dir, { topic: 'Anything', recipe: name, dryRun: true });
    const missing = coverageOfUniversals(readCorpus(dir).subtopics).missing;
    assert.deepEqual(missing.map((m) => m.dimension.id), [], `${name} dropped a universal dimension`);
  }
});

test('an unknown recipe is an error naming where recipes live', () => {
  assert.throws(() => loadRecipe('no-such-recipe'), /no recipe/);
});

test('parseRecipe reads the machine-readable frontmatter', () => {
  const { name, dimensions } = parseRecipe('---\nname: sample\ndimensions:\n  - First thing | why it matters\n  - Second thing | another reason\n---\n\nprose\n');
  assert.equal(name, 'sample');
  assert.deepEqual(dimensions, [
    { name: 'First thing', why: 'why it matters' },
    { name: 'Second thing', why: 'another reason' },
  ]);
});

test('docsHosts ranks the hosts that keep owning the facts', () => {
  const hosts = docsHosts([
    { url: 'https://docs.example.com/a' },
    { url: 'https://docs.example.com/pricing' },
    { url: 'https://blog.other.com/x' },
  ]);
  assert.equal(hosts[0].host, 'docs.example.com');
  assert.ok(hosts[0].score > hosts[1].score);
});

test('a dry run gathers nothing and spends nothing', () => {
  const dir = makeProject();
  let searched = 0;
  decompose(dir, { topic: 'Anything', adapter: { search: () => { searched += 1; return { ok: true, results: [] }; } }, dryRun: true });
  assert.equal(searched, 0);
  assert.equal(readCorpus(dir).captures.entries.length, 0);
});

test('gathering records the candidate material and the likely owners', () => {
  const dir = makeProject();
  const result = decompose(dir, {
    topic: 'Example limits',
    adapter: stubAdapter([
      { url: 'https://docs.example.com/rate-limits', title: 'Rate limits' },
      { url: 'https://blog.other.com/opinion', title: 'Opinion' },
    ]),
  });
  assert.ok(result.material > 0);
  const text = readText(resolve(dir, PATHS.map));
  assert.match(text, /docs\.example\.com/);
  assert.match(text, /\[Rate limits\]\(https:\/\/docs\.example\.com\/rate-limits\)/);
});

test('--max-scrapes bounds what phase 0 may cost, and a cache hit is not an attempt', () => {
  const dir = makeProject();
  const results = [
    { url: 'https://docs.example.com/a', title: 'A' },
    { url: 'https://docs.example.com/b', title: 'B' },
    { url: 'https://docs.example.com/c', title: 'C' },
  ];
  const first = decompose(dir, { topic: 'Example', adapter: stubAdapter(results), maxScrapes: 2, force: true });
  assert.equal(first.spent, 2);

  const second = decompose(dir, { topic: 'Example', adapter: stubAdapter(results), maxScrapes: 2, force: true });
  assert.equal(second.spent, 1, 'the two already collected are cache hits and cost nothing');
});

test('a map that already holds judged rows is not redrafted over without --force', () => {
  const dir = makePassingProject();
  const refused = decompose(dir, { topic: 'Something else', dryRun: true });
  assert.equal(refused.written, false);
  assert.match(refused.reason, /--force/);
  assert.match(readText(resolve(dir, PATHS.map)), /COVERED/, 'the judged map is untouched');

  assert.equal(decompose(dir, { topic: 'Something else', dryRun: true, force: true }).written, true);
});

// ---------------------------------------------------------------- failed searches
//
// Found 2026-09-26: `decompose` kept its failures in the result (F20) and then dropped them
// on the floor. The map said "No material gathered - run without --dry-run" after every
// search had failed on a live run, and the CLI printed the same success paragraph either
// way - so a map drafted from an outage read exactly like a map of a quiet topic.

const failing = (error) => ({ name: 'stub-transport', search: () => ({ ok: false, error }), runScrape: () => ({ ok: false }) });

test('a map drafted after every search failed says so, and names the failure', () => {
  const dir = makeProject();
  decompose(dir, { topic: 'Example', adapter: failing('HTTP 402 Payment Required') });
  const map = readText(resolve(dir, PATHS.map));
  assert.match(map, /every search failed/i, 'the map does not say its searches failed');
  assert.match(map, /HTTP 402 Payment Required/, 'the map does not carry the reason');
  assert.ok(!/run without `--dry-run`/.test(map), 'the map blames a dry run that never happened');
});

test('a quiet topic and a dry run are still told apart from an outage', () => {
  const quiet = makeProject();
  decompose(quiet, { topic: 'Example', adapter: stubAdapter([]) });
  const quietMap = readText(resolve(quiet, PATHS.map));
  assert.ok(!/search failed|every search failed/i.test(quietMap), 'a quiet topic is reported as a failure');
  assert.ok(!/run without `--dry-run`/.test(quietMap), 'a live run that found nothing is told to stop dry-running');

  const dry = makeProject();
  decompose(dry, { topic: 'Example', adapter: stubAdapter([]), dryRun: true });
  assert.match(readText(resolve(dry, PATHS.map)), /run without `--dry-run`/, 'the dry-run hint is gone');
});

test('a query that fell back to the fetch provider is recorded as a degradation', () => {
  const dir = makeProject();
  const searchAdapter = { name: 'stub-search', search: () => ({ ok: false, error: 'rate limited' }) };
  const out = decompose(dir, { topic: 'Example', adapter: stubAdapter([{ url: 'https://docs.example.com/a', title: 'A' }]), searchAdapter });
  assert.equal(out.gathered, true);
  const map = readText(resolve(dir, PATHS.map));
  assert.match(map, /stub-search/, 'the provider that failed is not named');
  assert.match(map, /fell back to stub-transport/, 'the fallback is not recorded');
});

test('a failure written into the map never carries a credential', () => {
  // MAP.md is committed. An error string is vendor text, and vendor text has echoed keys.
  const dir = makeProject();
  const key = 'a'.repeat(24) + '0123456789abcdef'.repeat(3);
  decompose(dir, { topic: 'Example', adapter: failing(`GET https://x.invalid/search?q=t&api_key=${key} failed\nsecond line ${key}`) });
  const map = readText(resolve(dir, PATHS.map));
  assert.ok(!map.includes(key), 'a credential-shaped string reached the committed map');
  assert.ok(!/second line/.test(map), 'the map carries a multi-line error instead of its first line');
});

test('the CLI summary counts the searches that failed, and says when nothing was gathered', () => {
  assert.equal(searchSummary({ searches: 4, failures: [], gathered: true }), '', 'a clean run needs no line');
  const outage = searchSummary({ searches: 4, gathered: false, failures: [1, 2, 3, 4].map((n) => ({ query: `q${n}`, error: 'x', provider: 's' })) });
  assert.match(outage, /0 of 4 searches answered/);
  assert.match(outage, /NOTHING gathered/);
  const degraded = searchSummary({ searches: 4, gathered: true, failures: [{ query: 'q1', error: 'x', provider: 's', degraded: true }] });
  assert.match(degraded, /4 of 4 searches answered/);
  assert.match(degraded, /1 fell back/);
  assert.match(degraded, /FETCH credits/);
  // Found by running the CLI into a real outage: every fallback failed too, and the line
  // still said those queries "spent FETCH credits".
  const both = searchSummary({ searches: 1, gathered: false, failures: [
    { query: 'q1', error: 'x', provider: 's', degraded: true },
    { query: 'q1', error: 'y', provider: 'f' },
  ] });
  assert.match(both, /0 of 1 searches answered, 1 failed; 1 fell back/);
  assert.ok(!/FETCH credits/.test(both), 'a fallback that failed too is claimed to have spent');
});

// Found 2026-09-27: two decompose runs made 8 SerpAPI searches in an hour - the vendor's own meter
// said "8 this hour" - and research.mjs --status counted 0. decompose wrote no usage row, so the
// one command that does nothing but search was invisible to the local meter. research-run
// records a search-only run for exactly that reason (DR-1).
test('phase 0 records the searches it spent, so the local meter sees them', () => {
  const dir = makeProject();
  const searchAdapter = { name: 'serpapi', search: (query) => ({ ok: true, query, results: [{ url: 'https://docs.example.com/a', title: 'A' }], searchesUsed: 1 }) };
  decompose(dir, { topic: 'Example limits', adapter: stubAdapter([]), searchAdapter });
  const usage = searchUsage(dir);
  assert.equal(usage.thisMonth, 4, `phase 0 searched four times and the meter saw ${usage.thisMonth}`);
  assert.equal(usage.lastHour, 4);
  assert.deepEqual(usage.providers, ['serpapi']);

  const dry = makeProject();
  decompose(dry, { topic: 'Example limits', adapter: stubAdapter([]), searchAdapter, dryRun: true });
  assert.equal(searchUsage(dry).thisMonth, 0, 'a dry run spends nothing, and records nothing');
});

test('phase 0 lists one page once, whatever its spelling', () => {
  // The same identity runResearch uses (urlKey): a trailing slash or www. is not a second
  // candidate, and with a scrape budget would not be a second fetch.
  const dir = makeProject();
  const out = decompose(dir, { topic: 'Example', adapter: stubAdapter([
    { url: 'https://docs.example.com/a', title: 'A' },
    { url: 'https://www.docs.example.com/a/', title: 'A again' },
  ]) });
  assert.equal(out.material, 1, 'two spellings of one page were listed as two candidates');
});

// Found 2026-09-27: a dry run seeded the map and said nothing about the searches a real run
// would make - four on the search meter - so it previewed none of the cost it exists to show.
test('a dry run names every search a real run would make, and on whose meter', () => {
  const dir = makeProject();
  const lines = [];
  let searched = 0;
  const adapter = { name: 'stub-fetch', search: () => { searched += 1; return { ok: true, results: [] }; } };
  decompose(dir, { topic: 'Widget pricing', adapter, searchAdapter: { name: 'stub-search', search: adapter.search }, dryRun: true, log: (l) => lines.push(l) });
  assert.equal(searched, 0, 'a dry run searched');
  for (const q of ['Widget pricing', 'Widget pricing documentation', 'Widget pricing pricing limits', 'Widget pricing terms of service']) {
    assert.ok(lines.some((l) => l.includes(`would search "${q}" on stub-search`)), `not named: ${q}\n${lines.join('\n')}`);
  }
});
