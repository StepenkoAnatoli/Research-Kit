// Phase 0 gathers material and seeds the checklist. It contains NO judgment: it hands
// over statuses BLANK, and `subtopic-coverage` is what judges them afterwards.

import { test, describe, assert, makeProject, makePassingProject, fs } from './harness.mjs';
import { PATHS, resolve, readText, listFiles } from '../lib/core.mjs';
import { decompose, parseRecipe, loadRecipe, docsHosts, RECIPE_DIR } from '../lib/decompose.mjs';
import { UNIVERSAL_DIMENSIONS, seedRows, coverageOfUniversals } from '../lib/dimensions.mjs';
import { readCorpus } from '../lib/corpus.mjs';
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
