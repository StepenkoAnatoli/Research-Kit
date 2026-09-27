// One URL's journey, and many URLs in one run. Offline: the adapter is a stub behind
// the runScrape seam, so no key, no credits, no network.

import { test, describe, assert, makeProject, makePassingProject, fs, path, KIT_ROOT } from './harness.mjs';
import { PATHS, resolve, readText, writeJson, today } from '../lib/core.mjs';
import { readCorpus, parseTable } from '../lib/corpus.mjs';
import { HEADERS } from '../lib/core.mjs';
import { collectOne, writeRaw, captureName, bodyHashOf } from '../lib/collect.mjs';
import { rateLimitWaitMs } from '../lib/firecrawl.mjs';
import { topicMatch } from '../lib/research-run.mjs';
import { verifyLedger } from '../lib/provenance.mjs';
import { runResearch, readPlan, rankCandidate, selectCandidates, parsePreference, DEPTH_SCRAPES, usageSummary } from '../lib/research-run.mjs';

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

test('a collected page says WHY it was fetched, in words, not as a cache code', () => {
  // Found 2026-09-26 in a live-collection log: "collected https://docs.firecrawl.dev/... -
  // not-collected". The reason was cacheDecision's internal code for "no capture yet",
  // printed verbatim beside the word "collected" - a line that reads as its own contradiction.
  const dir = makeProject();
  const corpus = readCorpus(dir);
  const first = collectOne(dir, 'https://x.invalid/limits', { runScrape: stubAdapter().runScrape, corpus });
  assert.equal(first.reason, 'first capture');
  const forced = collectOne(dir, 'https://x.invalid/limits', { runScrape: stubAdapter().runScrape, corpus, force: true });
  assert.equal(forced.reason, 'refreshed: --force');
  const stale = collectOne(dir, 'https://x.invalid/limits', {
    runScrape: stubAdapter().runScrape, corpus, refreshDays: 1, now: new Date(Date.now() + 5 * 86400000),
  });
  assert.match(stale.reason, /^refreshed: the last capture was \d+ days old$/);
  const preview = collectOne(dir, 'https://x.invalid/other', { runScrape: stubAdapter().runScrape, corpus, dryRun: true });
  assert.equal(preview.reason, 'would collect (first capture)');
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

// ---------------------------------------------------------------- prefer: a path on a shared host
//
// Found 2026-09-26, collect run 36279879229: dispatched with `prefer: github.com` to collect
// actions/upload-artifact's release notes, it captured an unrelated repository's Actions run
// page. On a host that serves everyone, the host is not the owner - every page on GitHub got
// the owner's bonus. The kit's topic signal caught it; the ranking should not have needed to.

const bonus = (url, prefer) => rankCandidate(url, { prefer }) - rankCandidate(url, { prefer: [] });

test('a preference with a path ranks that repository, not the whole shared host', () => {
  const prefer = ['github.com/actions/upload-artifact'];
  assert.equal(bonus('https://github.com/actions/upload-artifact/releases', prefer), 10);
  assert.equal(bonus('https://github.com/actions/upload-artifact', prefer), 10, 'the repository root is the repository');
  assert.equal(bonus('https://github.com/bitnami/support/actions/runs/24548123711', prefer), 0,
    'another repository on the same host was ranked as the owner');
  assert.equal(bonus('https://github.com/actions/upload-artifact-v2/readme', prefer), 0,
    'a path matches at a segment boundary, not as a string prefix');
  assert.equal(bonus('https://gist.github.com/actions/upload-artifact', prefer), 0,
    'a path belongs to one host; it does not extend to subdomains');
});

test('the incident, replayed: the owner is selected over a stranger on the same host', () => {
  const results = [
    { url: 'https://github.com/bitnami/support/actions/runs/24548123711' },
    { url: 'https://github.com/actions/upload-artifact/releases' },
  ];
  const [picked] = selectCandidates(results, { prefer: ['github.com/actions/upload-artifact'], perQuery: 1, seen: new Set() });
  assert.equal(picked.url, 'https://github.com/actions/upload-artifact/releases');
});

test('a preference is read the way people write it: scheme, www, case and a trailing slash are ignored', () => {
  for (const entry of ['https://github.com/actions/upload-artifact/', 'www.github.com/Actions/Upload-Artifact', 'github.com/actions/upload-artifact#readme']) {
    assert.deepEqual(parsePreference(entry), { host: 'github.com', path: '/actions/upload-artifact' }, entry);
  }
  assert.equal(bonus('https://github.com/Actions/Upload-Artifact/releases', ['github.com/actions/upload-artifact']), 10);
  assert.equal(parsePreference('  '), null, 'an empty entry is no preference, not a match-everything');
  assert.equal(parsePreference('/actions/upload-artifact'), null, 'a path with no host is no preference');
});

test('a bare domain still covers the host and its subdomains, exactly as before', () => {
  assert.deepEqual(parsePreference('tavily.com'), { host: 'tavily.com', path: '' });
  assert.equal(bonus('https://docs.tavily.com/api', ['tavily.com']), 10);
  assert.equal(bonus('https://tavily.com/pricing', ['tavily.com']), 10);
  assert.equal(bonus('https://nottavily.com/pricing', ['tavily.com']), 0, 'a suffix is not a subdomain');
});

test('every place that explains `prefer` offers the path form', () => {
  // The fix is invisible unless the person typing the preference knows a path is allowed:
  // each of these told them "domains" and nothing else, which is how github.com got typed.
  const repo = path.resolve(KIT_ROOT, '..');
  const places = {
    'collect.yml prefer input': fs.readFileSync(path.join(repo, '.github', 'workflows', 'collect.yml'), 'utf8')
      .split('\n').find((line) => /^\s+description: .*OWN the fact/.test(line)) ?? '',
    'collect-remote --help': fs.readFileSync(path.join(KIT_ROOT, 'bin', 'collect-remote.mjs'), 'utf8')
      .split('--prefer <')[1]?.split('--query')[0] ?? '',
    'MCP tool schema': fs.readFileSync(path.join(KIT_ROOT, 'lib', 'mcp.mjs'), 'utf8')
      .split('\n').find((line) => /prefer: \{ type: 'string'/.test(line)) ?? '',
  };
  for (const [where, text] of Object.entries(places)) {
    assert.ok(text, `could not find the prefer description in ${where} - this test is vacuous`);
    assert.match(text, /github\.com\/[a-z-]+\/[a-z-]+/, `${where} does not show a path on a shared host`);
  }
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

// Found 2026-09-27 reading the merge in runResearch: a per-query `prefer` written as a
// string was spread into single characters ("d", "o", "c", ...) and matched nothing, and a
// top-level `prefer` written as a string was dropped by readPlan. Both silently: the run
// looked like it had a preference and ranked as if it had none.

const preferRun = (plan) => {
  const dir = makeProject();
  writeJson(resolve(dir, PATHS.plan), {
    topic: 'Fixture', depth: 'quick', refreshDays: 30, limit: 8, perQuery: 1, maxScrapes: 10, urls: [], ...plan,
  });
  // The competitor outranks the owner on its own (+8 for a docs/pricing path); only a
  // preference that actually works (+10) puts the owner first. The first version used a
  // blog as the competitor, which lost on its own penalty - and the test passed on the
  // broken code.
  const adapter = stubAdapter({
    results: [
      { url: 'https://other.com/docs/pricing', title: 'Other' },
      { url: 'https://owner.example.com/facts', title: 'Facts' },
    ],
  });
  runResearch(dir, { adapter });
  return readCorpus(dir).evidence.map((row) => row.url);
};

test('the prefer fixture is not vacuous: with no preference, the competitor wins', () => {
  assert.deepEqual(preferRun({ queries: [{ q: 'facts', why: 'U-1' }] }), ['https://other.com/docs/pricing']);
});

test('a per-query prefer written as a string is a preference, not a list of letters', () => {
  assert.deepEqual(preferRun({ queries: [{ q: 'facts', why: 'U-1', prefer: 'owner.example.com' }] }),
    ['https://owner.example.com/facts']);
});

test('a top-level prefer written as a string is kept, split the way the workflow input is', () => {
  assert.deepEqual(preferRun({ prefer: 'owner.example.com', queries: [{ q: 'facts', why: 'U-1' }] }),
    ['https://owner.example.com/facts']);
  const dir = makeProject();
  writeJson(resolve(dir, PATHS.plan), { prefer: 'docs.x.com, github.com/actions/upload-artifact  other.org' });
  assert.deepEqual(readPlan(dir).prefer, ['docs.x.com', 'github.com/actions/upload-artifact', 'other.org']);
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

// ---------------------------------------------------------------- rate limits

test('rateLimitWaitMs reads the vendor number, and refuses to invent one', () => {
  // The real error text, verbatim from run 35715485734.
  const real = 'Rate limit exceeded. Consumed (req/min): 11, Remaining (req/min): 0. '
    + 'Upgrade your plan at https://firecrawl.dev/pricing for increased rate limits or '
    + 'please retry after 13s, resets at Tue Sep 22 2026 10:21:38 GMT+0000';
  assert.equal(rateLimitWaitMs(real), 14_000, 'the stated 13s plus a second of margin');

  // A rate limit with no stated delay still waits; one minute clears a per-minute window.
  assert.equal(rateLimitWaitMs('Rate limit exceeded'), 60_000);

  // Everything that is NOT a rate limit must return null, so ordinary failures are not
  // retried. A 404 does not become a 404 if you wait.
  assert.equal(rateLimitWaitMs('404 not found'), null);
  assert.equal(rateLimitWaitMs(''), null);
  assert.equal(rateLimitWaitMs(undefined), null);
});

test('collectOne retries a rate limit and keeps the page it eventually gets', () => {
  // Six of eight fetches were lost this way on 2026-09-22, reported as plain failures.
  const dir = makeProject();
  let calls = 0;
  const outcome = collectOne(dir, 'https://example.invalid/limited', {
    corpus: readCorpus(dir),
    runScrape: () => {
      calls += 1;
      if (calls === 1) {
        return { ok: false, url: 'https://example.invalid/limited', error: 'Rate limit exceeded. please retry after 0s, resets at now' };
      }
      return { ok: true, url: 'https://example.invalid/limited', title: 'Limited', markdown: `# Limited\n\n${'body text here. '.repeat(40)}`, statusCode: 200, transport: 'stub', completeness: 'full' };
    },
  });

  assert.equal(calls, 2, 'the rate limit must be retried, not reported');
  assert.equal(outcome.status, 'collected');
  assert.equal(outcome.waits, 1, 'the wait is counted so a slow run explains itself');
});

test('collectOne does NOT retry an ordinary failure', () => {
  // The other half. Retrying a 404 spends budget to be told the same thing again.
  const dir = makeProject();
  let calls = 0;
  const outcome = collectOne(dir, 'https://example.invalid/gone', {
    corpus: readCorpus(dir),
    runScrape: () => { calls += 1; return { ok: false, url: 'https://example.invalid/gone', error: '404 not found' }; },
  });

  assert.equal(calls, 1, 'a non-rate-limit failure must be reported immediately');
  assert.equal(outcome.status, 'failed');
  assert.equal(outcome.waits, 0);
});

test('collectOne gives up after a bounded number of rate-limit retries', () => {
  // A vendor that keeps refusing is a different problem from a busy minute, and the
  // retry runs inside the collector lock - forever here would be forever for everyone.
  const dir = makeProject();
  let calls = 0;
  const outcome = collectOne(dir, 'https://example.invalid/always', {
    corpus: readCorpus(dir),
    maxRateLimitRetries: 2,
    runScrape: () => { calls += 1; return { ok: false, url: 'https://example.invalid/always', error: 'Rate limit exceeded. please retry after 0s' }; },
  });

  assert.equal(calls, 3, 'the first attempt plus two retries');
  assert.equal(outcome.status, 'failed');
  assert.match(outcome.reason, /Rate limit exceeded/);
});

// ---------------------------------------------------------------- topic match

test('topicMatch separates the off-topic collection from the on-topic one', () => {
  // The real pair, from the same query on 2026-09-22: SerpApi returned eight pages about US
  // financial regulation, Firecrawl returned eight about the EU Deforestation Regulation.
  // The off-topic corpus passed every structural check in this kit.
  const topic = 'EU Deforestation Regulation 2023/1115 application date large operators SMEs current after delay';

  const offTopic = [
    'Regulation D exempt offerings for small businesses. The application date for filing...',
    'Regulation Z truth in lending. Large creditors must apply...',
    'California water efficiency legislation and conservation regulation...',
  ];
  const onTopic = [
    'The EUDR, Regulation (EU) 2023/1115 on deforestation-free products. Application for large operators and SMEs...',
    'EU Deforestation Regulation 2023/1115: application postponed. Large operators and SMEs face a delay...',
  ];

  const off = topicMatch(topic, offTopic);
  const on = topicMatch(topic, onTopic);
  assert.equal(off.strong, 0, 'nothing in the off-topic set should match strongly');
  assert.ok(on.strong > 0, 'the on-topic set must match');
  assert.ok(on.best > off.best, `on-topic must outscore off-topic: ${on.best} vs ${off.best}`);
});

test('topicMatch declines to judge a topic with too few distinctive terms', () => {
  // Refusing is not scoring zero. A two-word topic makes the share 0, 0.5 or 1 and the
  // number means nothing - reporting it would invite a reader to act on noise.
  assert.equal(topicMatch('the EU', ['anything at all']), null);
  assert.equal(topicMatch('', ['x']), null);
  assert.equal(topicMatch('EU Deforestation Regulation dates', []), null, 'no captures, nothing to measure');
});

test('topicMatch REPORTS and never decides - the thresholds that were rejected', () => {
  // Pinned so nobody promotes this into a gate later. Measured 2026-09-22 across every
  // corpus in this repository:
  //
  //   per-capture >= 0.5 flags RFC 9728 in the agent-interface corpus, which never says
  //   "MCP" - and not saying it is what makes it an independent witness.
  //
  //   per-corpus "at least one strong capture" flags delivery-architecture, whose topic is
  //   "How Research-Kit should be delivered to a non-technical user" and whose evidence is
  //   GitHub Actions docs. It scores max 0.25 with zero strong captures - IDENTICAL to the
  //   genuine failure. No threshold separates them.
  //
  // So the shape of the return value is the contract: numbers, no verdict.
  const m = topicMatch('EU Deforestation Regulation 2023/1115 operators', ['deforestation regulation for operators']);
  assert.deepEqual(Object.keys(m).sort(), ['best', 'strong', 'terms']);
  assert.equal(typeof m.best, 'number');
  assert.equal(m.pass, undefined, 'a pass/fail field would make this a gate');
  assert.equal(m.severity, undefined);
});

test('topicMatch scores high on a generic topic even when the corpus is off-topic', () => {
  // The limitation, pinned so the number is never read as a quality score. The first real
  // use after shipping reported 0.92 with eight of eight above threshold, on a corpus where
  // seven of eight captures were generic "zero data retention" marketing from unrelated
  // vendors and only one was the document being researched.
  //
  // The arithmetic was right. Every one of those pages genuinely contains "data",
  // "retention", "training" and "zero" - so a topic built from common words matches
  // anything, and this function cannot tell a distinctive term from a common one.
  const genericTopic = 'terms of service data retention training on inputs outputs zero retention enterprise';
  const unrelated = [
    'Zero data retention explained: how enterprise AI vendors handle training data and service inputs and outputs.',
    'What is zero data retention? A glossary entry about training, retention and enterprise service terms.',
  ];
  const m = topicMatch(genericTopic, unrelated);
  assert.ok(m.best >= 0.5, `a generic topic matches unrelated pages: got ${m.best}`);
  assert.ok(m.strong > 0, 'and they clear the threshold, which is exactly the problem');

  // The contrast: distinctive terms behave the way the signal is useful for.
  const distinctive = 'EU Deforestation Regulation 2023/1115 operators SMEs';
  assert.equal(topicMatch(distinctive, unrelated).strong, 0,
    'a distinctive topic does NOT match unrelated pages');
});
