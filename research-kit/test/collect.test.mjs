// One URL's journey, and many URLs in one run. Offline: the adapter is a stub behind
// the runScrape seam, so no key, no credits, no network.

import { test, describe, assert, makeProject, makePassingProject, fs } from './harness.mjs';
import { PATHS, resolve, readText, writeJson, today } from '../lib/core.mjs';
import { readCorpus, parseTable } from '../lib/corpus.mjs';
import { HEADERS } from '../lib/core.mjs';
import { collectOne, writeRaw, captureName, bodyHashOf } from '../lib/collect.mjs';
import { verifyLedger } from '../lib/provenance.mjs';
import { runResearch, readPlan, rankCandidate, selectCandidates, DEPTH_SCRAPES, usageSummary } from '../lib/research-run.mjs';

describe('collect');

const PAGE = `# Rate limits\n\n${'The free plan allows 10 scrape requests per minute and includes 1,000 credits. '.repeat(25)}`;

function stubAdapter({ fail = false, results = [] } = {}) {
  return {
    name: 'stub-transport',
    runScrape: (url) => (fail
      ? { ok: false, url, error: 'HTTP 429', transport: 'stub-transport', cmd: `stub scrape ${url}` }
      : {
        ok: true, url, title: 'Rate limits', markdown: PAGE, statusCode: 200,
        transport: 'stub-transport', completeness: 'full', omitted: '',
        cmd: `stub scrape ${url}`,
      }),
    search: (query) => ({ ok: true, query, cmd: `stub search ${query}`, results }),
  };
}

test('captureName is dated, slugged, and keyed by a digest of the URL', () => {
  const name = captureName('https://docs.example.com/rate-limits', { date: '2026-09-13', title: 'Rate limits' });
  assert.match(name, /^2026-09-13-rate-limits-example-[0-9a-f]{8}\.md$/);
  assert.equal(
    captureName('https://a.invalid/x', { date: '2026-01-01' }) === captureName('https://b.invalid/x', { date: '2026-01-01' }),
    false,
    'two URLs never collide on one filename',
  );
});

test('writeRaw hands back the corpus\'s own index entry', () => {
  const dir = makeProject();
  const entry = writeRaw(dir, {
    url: 'https://x.invalid/p', title: 'P', markdown: PAGE, cmd: 'stub scrape', statusCode: 200,
    transport: 'stub-transport', completeness: 'partial', omitted: 'chunk 0 of 3',
  });
  const text = readText(resolve(dir, entry.file));
  assert.match(text, /^---\nurl: https:\/\/x\.invalid\/p/);
  assert.match(text, /completeness: partial/);
  assert.match(text, /omitted: chunk 0 of 3/);
  assert.equal(entry.bytes, Buffer.byteLength(PAGE, 'utf8'));
  assert.equal(readCorpus(dir).captures.byUrl.get('https://x.invalid/p').file, entry.file);
});

test('collectOne writes the capture, the ledger entry, the evidence row and the source row', () => {
  const dir = makeProject();
  const corpus = readCorpus(dir);
  const outcome = collectOne(dir, 'https://x.invalid/limits', {
    runScrape: stubAdapter().runScrape, corpus, usedFor: 'U-1', transportName: 'stub-transport',
  });

  assert.equal(outcome.status, 'collected');
  assert.equal(outcome.spent, 1);

  const after = readCorpus(dir);
  assert.equal(after.captures.entries.length, 1);
  assert.equal(after.evidence.length, 1);
  assert.equal(after.evidence[0].id, 'E-01');
  assert.match(after.evidence[0].finding, /10 scrape requests per minute/, 'the Finding cell arrives auto-extracted');
  assert.equal(after.ledger.entries.length, 1);
  assert.equal(after.ledger.entries[0].transport, 'stub-transport');
  assert.equal(verifyLedger(dir).ok, true);

  const sources = parseTable(readText(resolve(dir, PATHS.sources)), HEADERS.sources).rows;
  assert.equal(sources[0]['Used for'], 'U-1');
});

test('the collector stamps what the ADAPTER declared and invents neither field', () => {
  const dir = makeProject();
  const corpus = readCorpus(dir);
  collectOne(dir, 'https://x.invalid/partial', {
    corpus,
    runScrape: () => ({ ok: true, url: 'https://x.invalid/partial', markdown: PAGE, transport: 'http-keyless', completeness: 'partial', omitted: 'below the bar', cmd: 'x' }),
  });
  const capture = readCorpus(dir).captures.entries[0];
  assert.equal(capture.transport, 'http-keyless');
  assert.equal(capture.completeness, 'partial');
  assert.equal(capture.omitted, 'below the bar');
});

test('a failure is recorded as a fail entry and writes no capture or row', () => {
  const dir = makeProject();
  const corpus = readCorpus(dir);
  const outcome = collectOne(dir, 'https://x.invalid/nope', { runScrape: stubAdapter({ fail: true }).runScrape, corpus });

  assert.equal(outcome.status, 'failed');
  const after = readCorpus(dir);
  assert.equal(after.captures.entries.length, 0);
  assert.equal(after.evidence.length, 0);
  assert.equal(after.ledger.entries[0].op, 'fail');
  assert.equal(after.ledger.entries[0].error, 'HTTP 429');
});

test('an adapter that THROWS becomes a fail entry, not a crashed run', () => {
  const dir = makeProject();
  const corpus = readCorpus(dir);
  const outcome = collectOne(dir, 'https://x.invalid/boom', {
    corpus,
    runScrape: () => { throw new Error('socket hang up'); },
  });
  assert.equal(outcome.status, 'failed');
  assert.match(readCorpus(dir).ledger.entries[0].error, /socket hang up/);
});

test('a cache hit spends nothing and never touches the adapter', () => {
  const dir = makeProject();
  const corpus = readCorpus(dir);
  collectOne(dir, 'https://x.invalid/limits', { runScrape: stubAdapter().runScrape, corpus });

  let called = 0;
  const outcome = collectOne(dir, 'https://x.invalid/limits', {
    corpus,
    runScrape: (url) => { called += 1; return stubAdapter().runScrape(url); },
  });
  assert.equal(outcome.status, 'cached');
  assert.equal(outcome.spent, 0);
  assert.equal(called, 0);
});

test('--force collects again; the cache is a decision, not a law', () => {
  const dir = makeProject();
  const corpus = readCorpus(dir);
  collectOne(dir, 'https://x.invalid/limits', { runScrape: stubAdapter().runScrape, corpus });
  const forced = collectOne(dir, 'https://x.invalid/limits', { runScrape: stubAdapter().runScrape, corpus, force: true, date: '2026-12-01' });
  assert.equal(forced.status, 'collected');
});

test('dry-run says what would happen and writes nothing at all', () => {
  const dir = makeProject();
  const corpus = readCorpus(dir);
  const outcome = collectOne(dir, 'https://x.invalid/limits', { runScrape: stubAdapter().runScrape, corpus, dryRun: true });
  assert.equal(outcome.status, 'skipped');
  assert.equal(readCorpus(dir).captures.entries.length, 0);
  assert.equal(fs.existsSync(resolve(dir, PATHS.ledger)), false);
});

test('bodyHashOf is taken over the exact bytes on disk', () => {
  const dir = makeProject();
  const entry = writeRaw(dir, { url: 'https://x.invalid/p', markdown: PAGE, cmd: '', statusCode: 200 });
  const hash = bodyHashOf(dir, entry.file);
  assert.match(hash, /^[0-9a-f]{64}$/);
  fs.appendFileSync(resolve(dir, entry.file), 'x');
  assert.notEqual(bodyHashOf(dir, entry.file), hash);
});

// --- the run coordinator -----------------------------------------------------------

test('the budget tiers are named and bounded', () => {
  assert.deepEqual(Object.keys(DEPTH_SCRAPES), ['probe', 'quick', 'normal', 'deep']);
  assert.ok(DEPTH_SCRAPES.probe < DEPTH_SCRAPES.quick);
  assert.ok(DEPTH_SCRAPES.normal < DEPTH_SCRAPES.deep);
});

test('readPlan fills every default rather than handing back undefined', () => {
  const dir = makeProject();
  const plan = readPlan(dir);
  assert.equal(plan.depth, 'quick');
  assert.deepEqual(plan.queries, []);
  assert.equal(plan.refreshDays, 30);
});

test('rankCandidate prefers the page that OWNS the fact', () => {
  const prefer = ['docs.example.com'];
  assert.ok(rankCandidate('https://docs.example.com/rate-limits', { prefer }) > rankCandidate('https://blog.other.com/how-to', { prefer }));
  assert.ok(rankCandidate('https://example.com/pricing', { prefer: [] }) > rankCandidate('https://example.com/blog/post', { prefer: [] }));
  assert.ok(rankCandidate('https://example.com/login', { prefer: [] }) < 0);
});

test('selectCandidates keeps the best per query and never re-offers what is collected', () => {
  const seen = new Set(['https://docs.example.com/a']);
  const picked = selectCandidates([
    { url: 'https://docs.example.com/a' },
    { url: 'https://docs.example.com/pricing' },
    { url: 'https://blog.other.com/x' },
  ], { prefer: ['docs.example.com'], perQuery: 1, seen });
  assert.deepEqual(picked.map((r) => r.url), ['https://docs.example.com/pricing']);
});

test('a run collects the plan\'s urls and stops at the budget', () => {
  const dir = makeProject();
  writeJson(resolve(dir, PATHS.plan), {
    topic: 'Fixture', depth: 'probe', refreshDays: 30, limit: 8, perQuery: 3, maxScrapes: 10, prefer: [],
    queries: [],
    urls: ['https://x.invalid/a', 'https://x.invalid/b', 'https://x.invalid/c'],
  });

  const run = runResearch(dir, { adapter: stubAdapter() });
  assert.equal(run.budget, DEPTH_SCRAPES.probe);
  assert.equal(run.spent, DEPTH_SCRAPES.probe);
  assert.ok(run.results.some((r) => r.status === 'skipped' && /budget exhausted/.test(r.reason)),
    'the third URL is named, not silently dropped');
});

test('a run fans a query out through the adapter and collects what it selects', () => {
  const dir = makeProject();
  writeJson(resolve(dir, PATHS.plan), {
    topic: 'Fixture', depth: 'quick', refreshDays: 30, limit: 8, perQuery: 2, maxScrapes: 10,
    prefer: ['docs.example.com'],
    queries: [{ q: 'example rate limits', why: 'U-1' }],
    urls: [],
  });
  const adapter = stubAdapter({
    results: [
      { url: 'https://docs.example.com/rate-limits', title: 'Limits' },
      { url: 'https://blog.other.com/opinion', title: 'Opinion' },
      { url: 'https://docs.example.com/pricing', title: 'Pricing' },
    ],
  });

  const run = runResearch(dir, { adapter });
  assert.equal(run.spent, 2, 'perQuery caps what one query may cost');
  const urls = readCorpus(dir).evidence.map((row) => row.url).sort();
  assert.deepEqual(urls, ['https://docs.example.com/pricing', 'https://docs.example.com/rate-limits']);
});

test('a dry run spends nothing and does not even search', () => {
  const dir = makeProject();
  writeJson(resolve(dir, PATHS.plan), {
    topic: 'Fixture', depth: 'quick', refreshDays: 30, limit: 8, perQuery: 2, maxScrapes: 10, prefer: [],
    queries: ['anything'], urls: ['https://x.invalid/a'],
  });
  let searched = 0;
  const adapter = { ...stubAdapter(), search: (q) => { searched += 1; return { ok: true, query: q, results: [] }; } };

  const run = runResearch(dir, { adapter, dryRun: true });
  assert.equal(run.spent, 0);
  assert.equal(searched, 0, 'a search costs credits too');
  assert.equal(readCorpus(dir).captures.entries.length, 0);
});

test('a failed search is logged to the failures file and does not stop the run', () => {
  const dir = makeProject();
  writeJson(resolve(dir, PATHS.plan), {
    topic: 'Fixture', depth: 'quick', refreshDays: 30, limit: 8, perQuery: 2, maxScrapes: 10, prefer: [],
    queries: ['anything'], urls: ['https://x.invalid/a'],
  });
  const adapter = { ...stubAdapter(), search: () => ({ ok: false, error: 'HTTP 402', results: [] }) };

  const run = runResearch(dir, { adapter });
  assert.equal(run.spent, 1, 'the plan URL is still collected');
  assert.match(readText(resolve(dir, PATHS.failures)), /HTTP 402/);
});

test('usage is written after a run that spent, and read back as a summary', () => {
  const dir = makeProject();
  writeJson(resolve(dir, PATHS.plan), { topic: 'x', depth: 'quick', urls: ['https://x.invalid/a'], queries: [] });
  runResearch(dir, { adapter: stubAdapter() });
  assert.match(readText(resolve(dir, PATHS.usage)), /"spent":1/);

  const usage = usageSummary(dir);
  assert.equal(usage.captures, 1);
  assert.equal(usage.scrapes, 1);
  assert.equal(usage.evidence, 1);
});
