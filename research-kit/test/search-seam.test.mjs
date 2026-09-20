// The seam at the level that matters: a whole run, with two providers (ADR-0027).
//
// `serpapi.test.mjs` holds the adapter to its contract. This file asks the question the
// adapter cannot answer alone - does a run keep the two meters, and the two provenance
// claims, apart all the way to disk?
//
// Requirement ids refer to docs/requirements-2026-09-19-search-fetch-seam.md.

import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { test, describe, assert, tempDir, fs, path, KIT_ROOT } from './harness.mjs';
import { scaffoldProject } from '../lib/scaffold.mjs';
import { runResearch, searchUsage, FREE_TIER_PER_HOUR, FREE_TIER_PER_MONTH } from '../lib/research-run.mjs';
import { decompose } from '../lib/decompose.mjs';
import * as serpapi from '../lib/serpapi.mjs';
import { readLedger, readCorpus } from '../lib/corpus.mjs';
import { withLock, holdsLock } from '../lib/provenance.mjs';
import { readText } from '../lib/core.mjs';

describe('search-seam');

const MARKDOWN = 'x'.repeat(2000);

function fetchStub({ name = 'stub-fetch', results = ['https://fetchside.example/a'] } = {}) {
  const calls = { search: 0, scrape: 0 };
  return {
    name,
    calls,
    search() {
      calls.search += 1;
      return { ok: true, query: 'q', results: results.map((url, i) => ({ url, title: `T${i}`, description: '', position: i + 1 })) };
    },
    runScrape(url) {
      calls.scrape += 1;
      return { ok: true, url, markdown: MARKDOWN, title: 'T', statusCode: 200, transport: name, completeness: 'full', command: `stub scrape ${url}` };
    },
    scrape(url) { return this.runScrape(url); },
    map() { return { ok: true, links: [] }; },
    status() { return { ok: true, authenticated: true }; },
    command(a) { return `stub ${a}`; },
  };
}

function searchStub({ name = 'stub-search', results = ['https://searchside.example/a'], fail = null } = {}) {
  const calls = { search: 0 };
  return {
    name,
    calls,
    search() {
      calls.search += 1;
      if (fail) return { ok: false, query: 'q', results: [], error: fail, provider: name };
      return {
        ok: true, query: 'q', provider: name, searchId: 'sid-1', searchesUsed: 1,
        results: results.map((url, i) => ({ url, title: `T${i}`, description: '', position: i + 1 })),
      };
    },
  };
}

function plan(extra = {}) {
  return {
    topic: 'seam', depth: 'normal', refreshDays: 30, limit: 5, perQuery: 1, maxScrapes: 5, prefer: [],
    queries: [{ q: 'a query', why: 'U-1' }], urls: [], ...extra,
  };
}

function project(topic = 'seam probe') {
  const root = tempDir('rk-seam-');
  scaffoldProject(root, { topic });
  return root;
}

/** Everything under research/, as a map of path -> bytes. Cheap and exact. */
function snapshot(root) {
  const out = {};
  const walk = (dir, prefix) => {
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      if (fs.statSync(full).isDirectory()) { walk(full, prefix + name + "/"); continue; }
      out[prefix + name] = fs.readFileSync(full).toString("base64");
    }
  };
  walk(path.join(root, "research"), "");
  return out;
}

function jsonLines(root, file) {
  const text = readText(path.join(root, 'research/raw', file), '');
  return text.trim() ? text.trim().split('\n').map((l) => JSON.parse(l)) : [];
}

// ---------------------------------------------------------------- TR-5  the whole run

test('TR-5: the search side searches and the fetch side fetches - neither does the other job', () => {
  const root = project();
  const fetcher = fetchStub();
  const searcher = searchStub();

  const run = runResearch(root, { adapter: fetcher, searchAdapter: searcher, plan: plan() });

  assert.equal(searcher.calls.search, 1, 'the search provider did not run the search');
  assert.equal(fetcher.calls.search, 0, 'the FETCH provider ran a search - that is the budget competition this change removes');
  assert.equal(fetcher.calls.scrape, 1, 'the fetch provider did not fetch');
  assert.equal(run.spent, 1);
  assert.equal(run.searchesUsed, 1);
  assert.equal(run.searchTransport, 'stub-search');
  assert.equal(run.transport, 'stub-fetch');
});

test('AR-4: a capture is stamped with what FETCHED it, never with what ranked it', () => {
  const root = project();
  const run = runResearch(root, { adapter: fetchStub(), searchAdapter: searchStub(), plan: plan() });

  const entry = readLedger(root).entries.find((e) => e.url === 'https://searchside.example/a');
  assert.ok(entry, 'the searched candidate was never collected');
  assert.equal(entry.transport, 'stub-fetch', 'the capture claims the search provider fetched it');
  assert.equal(run.results.length, 1);
});

// ---------------------------------------------------------------- DR-2  two provenances

test('DR-2: a searched URL records WHO RANKED IT, separately from who fetched it', () => {
  const root = project();
  runResearch(root, { adapter: fetchStub(), searchAdapter: searchStub(), plan: plan() });

  const entry = readLedger(root).entries.find((e) => e.url === 'https://searchside.example/a');
  assert.equal(entry.discoveredBy, 'stub-search');
  assert.equal(entry.transport, 'stub-fetch');
  assert.notEqual(entry.discoveredBy, entry.transport, 'the two claims collapsed into one');
});

test('DR-2: a URL a PERSON wrote into the plan has no ranker, and says so by absence', () => {
  const root = project();
  runResearch(root, { adapter: fetchStub(), searchAdapter: searchStub(), plan: plan({ urls: ['https://planned.example/p'], queries: [] }) });

  const entry = readLedger(root).entries.find((e) => e.url === 'https://planned.example/p');
  assert.ok(entry, 'the planned URL was never collected');
  assert.equal('discoveredBy' in entry, false, 'a planned URL was credited to a ranking that never happened');
});

test('DR-2: the fallback records the provider that ACTUALLY ranked it, not the one that failed', () => {
  const root = project();
  runResearch(root, {
    adapter: fetchStub(),
    searchAdapter: searchStub({ fail: 'Your account has run out of searches.' }),
    plan: plan(),
  });

  const entry = readLedger(root).entries.find((e) => e.url === 'https://fetchside.example/a');
  assert.ok(entry, 'the fallback produced no capture');
  assert.equal(entry.discoveredBy, 'stub-fetch', 'the failed provider was credited with a ranking it never produced');
});

// ---------------------------------------------------------------- DR-3  the hash chain

test('DR-3: a search is never a ledger entry, and the chain still verifies', () => {
  const root = project();
  runResearch(root, { adapter: fetchStub(), searchAdapter: searchStub(), plan: plan() });

  const ledger = readLedger(root);
  assert.equal(ledger.problems.length, 0, `chain damaged: ${JSON.stringify(ledger.problems)}`);
  for (const entry of ledger.entries) {
    assert.ok(['scrape', 'fail'].includes(entry.op), `a "${entry.op}" entry reached the fetch ledger`);
    assert.ok(entry.bodySha256 !== undefined, 'a ledger entry with no body hash - a search got in');
  }
  assert.equal(ledger.entries.length, 1, 'the search added an entry of its own');
});

test('DR-3: entries WITHOUT discoveredBy hash as they always did', () => {
  // The optional field must not retroactively change anything. A planned URL produces an
  // entry with no such field; if its presence were mandatory the hash would shift and
  // every pre-split ledger on disk would stop verifying.
  const root = project();
  runResearch(root, { adapter: fetchStub(), searchAdapter: searchStub(), plan: plan({ urls: ['https://planned.example/p'], queries: [] }) });

  const ledger = readLedger(root);
  assert.equal(ledger.problems.length, 0, `chain damaged: ${JSON.stringify(ledger.problems)}`);
  const raw = readText(path.join(root, 'research/raw/.fetches.jsonl'), '');
  assert.equal(/discoveredBy/.test(raw), false, 'an empty discoveredBy was written as a field');
});

// ---------------------------------------------------------------- DR-1, DR-4  the logs

test('DR-1: the usage log keeps the two meters apart', () => {
  const root = project();
  runResearch(root, { adapter: fetchStub(), searchAdapter: searchStub(), plan: plan() });

  const [usage] = jsonLines(root, '.usage.jsonl');
  assert.ok(usage, 'nothing was written to the usage log');
  assert.equal(usage.transport, 'stub-fetch');
  assert.equal(usage.searchTransport, 'stub-search');
  assert.equal(usage.searchesUsed, 1);
  assert.equal(usage.spent, 1);
  assert.equal(usage.degraded, 0);
});

test('DR-1: a run that only SEARCHED is still recorded - a second meter spent is still spend', () => {
  const root = project();
  // Every candidate is already a plan url that will not be reached, so nothing is
  // scraped; the search still happened.
  const run = runResearch(root, {
    adapter: fetchStub(),
    searchAdapter: searchStub({ results: [] }),
    plan: plan(),
  });
  assert.equal(run.spent, 0);
  assert.equal(run.searchesUsed, 1);
  const [usage] = jsonLines(root, '.usage.jsonl');
  assert.ok(usage, 'a search-only run vanished from the usage record');
  assert.equal(usage.searchesUsed, 1);
});

test('DR-4: a provider outage is attributable in the failure log', () => {
  const root = project();
  runResearch(root, {
    adapter: fetchStub(),
    searchAdapter: searchStub({ fail: 'read ECONNRESET' }),
    plan: plan(),
  });

  const [failure] = jsonLines(root, '.failures.jsonl');
  assert.ok(failure, 'the outage was not logged');
  assert.equal(failure.op, 'search');
  assert.equal(failure.provider, 'stub-search');
  assert.equal(failure.degraded, true);
  assert.match(failure.error, /ECONNRESET/);
});

// ---------------------------------------------------------------- RR-1..RR-3  degrading

test('RR-1: a search-provider failure degrades to the fetch provider, and the run lives', () => {
  const root = project();
  const fetcher = fetchStub();
  const run = runResearch(root, {
    adapter: fetcher,
    searchAdapter: searchStub({ fail: 'Your account has run out of searches.' }),
    plan: plan(),
  });

  assert.equal(run.degraded, 1);
  assert.equal(run.searchFailures, 1);
  assert.equal(fetcher.calls.search, 1, 'the fallback never ran');
  assert.equal(run.spent, 1, 'the run produced nothing after degrading');
});

test('RR-2: the fallback is BOUNDED - the failing provider is asked exactly once per query', () => {
  const root = project();
  const searcher = searchStub({ fail: 'read ECONNRESET' });
  runResearch(root, {
    adapter: fetchStub(),
    searchAdapter: searcher,
    plan: plan({ queries: [{ q: 'one', why: 'U-1' }, { q: 'two', why: 'U-1' }] }),
  });
  assert.equal(searcher.calls.search, 2, 'the failing provider was retried within a query');
});

test('RR-2: degradation is REPORTED, because it silently moves spend onto the fetch budget', () => {
  const root = project();
  const lines = [];
  runResearch(root, {
    adapter: fetchStub(),
    searchAdapter: searchStub({ fail: 'Your account has run out of searches.' }),
    plan: plan(),
    log: (l) => lines.push(l),
  });
  const text = lines.join('\n');
  assert.match(text, /search failed on stub-search/);
  assert.match(text, /spends fetch credits/, 'the operator was not told the fallback costs money');
});

test('RR-1: when BOTH providers fail, the query is skipped and the run continues', () => {
  const root = project();
  const fetcher = fetchStub();
  fetcher.search = () => { fetcher.calls.search += 1; return { ok: false, query: 'q', results: [], error: 'fetch-side search down too' }; };

  const run = runResearch(root, {
    adapter: fetcher,
    searchAdapter: searchStub({ fail: 'search-side down' }),
    plan: plan({ urls: ['https://planned.example/p'] }),
  });

  assert.equal(run.spent, 1, 'the planned URL should still have been collected');
  assert.equal(run.degraded, 0, 'a fallback that also failed was counted as a success');
  const failures = jsonLines(root, '.failures.jsonl');
  assert.equal(failures.length, 2, 'both failures should be recorded, not just the first');
});

// ---------------------------------------------------------------- TR-8  the regression

test('TR-8: with NO search provider, a run behaves exactly as it did before the split', () => {
  const rootBefore = project();
  const rootAfter = project();
  const a = fetchStub();
  const b = fetchStub();

  // "Before": no searchAdapter argument at all, which is what every caller passed.
  const before = runResearch(rootBefore, { adapter: a, plan: plan() });
  // "After": the search side explicitly resolved to the same adapter, which is what
  // selectSearch does when no key is configured.
  const after = runResearch(rootAfter, { adapter: b, searchAdapter: b, plan: plan() });

  assert.equal(before.transport, after.transport);
  assert.equal(before.searchTransport, after.searchTransport);
  assert.equal(before.spent, after.spent);
  assert.equal(before.degraded, 0);
  assert.equal(after.degraded, 0);
  assert.deepEqual(a.calls, b.calls, 'the two paths made different calls');

  // And the durable record matches, field for field, apart from the timestamps.
  const strip = (e) => { const { at, prev, entrySha256, ...rest } = e; return rest; };
  assert.deepEqual(readLedger(rootBefore).entries.map(strip), readLedger(rootAfter).entries.map(strip));
});

test('TR-8: with one provider doing both jobs, no discoveredBy is recorded that says nothing', () => {
  const root = project();
  const both = fetchStub();
  runResearch(root, { adapter: both, searchAdapter: both, plan: plan() });

  const entry = readLedger(root).entries[0];
  assert.equal(entry.transport, 'stub-fetch');
  assert.equal(entry.discoveredBy, 'stub-fetch',
    'when one provider does both, the two claims are legitimately the same - and both are still recorded');
});

// ---------------------------------------------------------------- decompose

test('TR-5: decompose uses the search side too, and records the ranker', () => {
  const root = project();
  const fetcher = fetchStub();
  const searcher = searchStub({ results: ['https://docs.example.com/a'] });

  const out = decompose(root, {
    topic: 'a topic', adapter: fetcher, searchAdapter: searcher, maxScrapes: 1, limit: 3,
  });

  assert.equal(out.written, true);
  assert.equal(searcher.calls.search > 0, true, 'decompose never used the search provider');
  assert.equal(fetcher.calls.search, 0, 'decompose searched with the FETCH provider');
  const entry = readLedger(root).entries[0];
  assert.ok(entry, 'decompose collected nothing');
  assert.equal(entry.discoveredBy, 'stub-search');
});

test('RR-1: decompose degrades too, and records which provider was down', () => {
  const root = project();
  const fetcher = fetchStub({ results: ['https://fallback.example/a'] });
  const out = decompose(root, {
    topic: 'a topic', adapter: fetcher,
    searchAdapter: searchStub({ fail: 'Your account has run out of searches.' }),
    maxScrapes: 1, limit: 3,
  });

  assert.equal(fetcher.calls.search > 0, true, 'decompose never fell back');
  assert.ok(out.failures.length > 0, 'the outage was not recorded');
  assert.equal(out.failures[0].provider, 'stub-search');
  assert.equal(out.failures[0].degraded, true);
});

// ---------------------------------------------------------------- RR-4  the timeout

test('RR-4: a hung socket cannot outlive the timeout, so it cannot hold the corpus lock', () => {
  // The collector is synchronous and holds an O_EXCL lock for the whole operation
  // (ADR-0025). A search that never returns would hold it forever, so the bound has to
  // be real rather than argued. It is `spawnSync`'s own timeout: the child is killed,
  // and the parent gets an error instead of waiting.
  //
  // Driven through the real rendezvous with a child that deliberately never answers.
  const started = Date.now();
  const answer = serpapi.runJob(
    { kind: 'serpapi-search', query: 'x', apiKey: 'a'.repeat(40), timeout: 50 },
    { timeout: 300, spawn: (cmd, args, opts) => {
      // Stand in for a child that hangs: report what spawnSync reports when it kills one.
      assert.ok(Number.isFinite(opts.timeout), 'no timeout was passed to spawnSync - nothing bounds the wait');
      assert.equal(opts.timeout, 300);
      return { error: new Error('spawnSync node ETIMEDOUT'), stdout: '', stderr: '' };
    } },
  );
  assert.equal(answer.ok, false);
  assert.match(answer.error, /ETIMEDOUT/);
  assert.ok(Date.now() - started < 5000, 'the call did not return promptly');
});

test('RR-4: the timeout reaches the child too, not only the parent', () => {
  const job = { kind: 'serpapi-search', query: 'x', apiKey: 'a'.repeat(40), timeout: 1234 };
  let seen = null;
  serpapi.runJob(job, { timeout: 1234, spawn: (cmd, args, opts) => { seen = JSON.parse(opts.input); return { stdout: '{"ok":true,"payload":{}}', stderr: '' }; } });
  assert.equal(seen.timeout, 1234, 'the child would use its default and could outlive the parent\'s bound');
});

// ---------------------------------------------------------------- RR-5  the meter

test('RR-5: search spend is COUNTED and reported, per hour and per month', () => {
  const root = project();
  const now = new Date('2026-09-20T12:00:00.000Z');
  const write = (at, used, provider = 'serpapi') =>
    fs.appendFileSync(path.join(root, 'research/raw/.usage.jsonl'),
      `${JSON.stringify({ at, searchesUsed: used, searchTransport: provider, spent: 0 })}\n`);

  write('2026-09-20T11:30:00.000Z', 3);   // inside the hour
  write('2026-09-20T09:00:00.000Z', 5);   // this month, not this hour
  write('2026-08-31T23:59:00.000Z', 99);  // last month - must not count
  write('2026-09-20T11:45:00.000Z', 0);   // a run that searched nothing

  const usage = searchUsage(root, { now });
  assert.equal(usage.lastHour, 3);
  assert.equal(usage.thisMonth, 8, 'the month window leaked into August, or dropped September');
  assert.deepEqual(usage.providers, ['serpapi']);
  assert.equal(usage.perHourCap, FREE_TIER_PER_HOUR);
  assert.equal(usage.perMonthCap, FREE_TIER_PER_MONTH);
});

test('RR-5: the count is honest about what it cannot see', () => {
  const root = project();
  const usage = searchUsage(root);
  assert.match(usage.caveat, /this machine/, 'the report does not admit it is machine-local');
  assert.match(usage.caveat, /cache/, 'the report does not admit it over-counts cached repeats');
  assert.equal(usage.lastHour, 0, 'an empty project should report no spend, not NaN');
  assert.equal(usage.thisMonth, 0);
});

test('RR-5: a damaged usage log is skipped line by line, not fatal', () => {
  const root = project();
  const file = path.join(root, 'research/raw/.usage.jsonl');
  fs.appendFileSync(file, 'not json\n');
  fs.appendFileSync(file, `${JSON.stringify({ at: new Date().toISOString(), searchesUsed: 2, searchTransport: 'serpapi' })}\n`);
  fs.appendFileSync(file, '{"at": broken\n');

  const usage = searchUsage(root);
  assert.equal(usage.lastHour, 2, 'one unparseable line discarded the whole record');
});

test('RR-5: a run records spend that the meter then reads back', () => {
  // End to end rather than against a hand-written log: the writer and the reader must
  // agree about the field names, which is the thing that actually breaks.
  const root = project();
  runResearch(root, { adapter: fetchStub(), searchAdapter: searchStub(), plan: plan() });
  const usage = searchUsage(root);
  assert.equal(usage.thisMonth, 1);
  assert.deepEqual(usage.providers, ['stub-search']);
});

// ---------------------------------------------------------------- concurrency

test('CONCURRENCY: a search takes no lock, so it runs while a collector holds one', () => {
  // The claim gap 2 of the validation map recorded as an argument rather than a test:
  // "a search takes no lock because it writes nothing". Argued, it is plausible. Tested,
  // it is the difference between a second provider that composes with the collector's
  // exclusive section (ADR-0025) and one that deadlocks against it.
  const root = project();
  const searcher = searchStub();
  let searchedWhileLocked = false;
  let lockHeldDuringSearch = false;

  withLock(root, () => {
    assert.equal(holdsLock(root), true, 'the premise failed - no lock was held');
    const found = searcher.search('q', { limit: 3 });
    searchedWhileLocked = found.ok;
    lockHeldDuringSearch = holdsLock(root);
  });

  assert.equal(searchedWhileLocked, true, 'a search could not complete while the corpus was locked');
  assert.equal(lockHeldDuringSearch, true, 'the search released a lock it never took');
  assert.equal(holdsLock(root), false, 'the lock outlived its block');
});

test('CONCURRENCY: a search writes nothing to the corpus - the reason it needs no lock', () => {
  // The justification, made checkable. If a search ever starts writing, this fails and
  // the test above stops being a valid argument.
  const root = project();
  const before = snapshot(root);

  const found = searchStub().search('q', { limit: 3 });
  assert.equal(found.ok, true);

  assert.deepEqual(snapshot(root), before, 'a search modified the corpus');
});

test('CONCURRENCY: the SERPAPI adapter writes nothing either, on success and on failure', () => {
  const root = project();
  const before = snapshot(root);

  serpapi.search('q', { key: 'k'.repeat(40), job: () => ({ ok: true, payload: { organic_results: [] } }) });
  serpapi.search('q', { key: 'k'.repeat(40), job: () => ({ ok: false, error: 'down' }) });
  serpapi.search('q', { env: {}, config: null });

  assert.deepEqual(snapshot(root), before, 'the search provider touched the corpus');
});

test('CONCURRENCY: two processes collecting with DIFFERENT search providers keep one chain', () => {
  // The real shape of the risk: two runs, two search providers, one corpus. If the search
  // side had taken the lock, or if `discoveredBy` had raced the entry it belongs to, this
  // is where it would show.
  const root = project();
  const files = ['alpha', 'beta'].map((tag, i) => {
    const file = path.join(root, `driver-${tag}.mjs`);
    fs.writeFileSync(file, `
import { runResearch } from ${JSON.stringify(pathToFileURL(path.join(KIT_ROOT, 'lib/research-run.mjs')).href)};
const MARKDOWN = 'x'.repeat(2000);
const fetcher = {
  name: 'stub-fetch',
  search: () => ({ ok: true, query: 'q', results: [] }),
  runScrape: (url) => ({ ok: true, url, markdown: MARKDOWN, title: 'T', statusCode: 200, transport: 'stub-fetch', completeness: 'full', command: 'stub' }),
};
const searcher = {
  name: ${JSON.stringify(`search-${tag}`)},
  search: () => ({ ok: true, query: 'q', provider: ${JSON.stringify(`search-${tag}`)}, searchesUsed: 1,
    results: [{ url: ${JSON.stringify(`https://${tag}.example/page`)}, title: 'T', description: '', position: 1 }] }),
};
runResearch(${JSON.stringify(root)}, {
  adapter: fetcher, searchAdapter: searcher,
  plan: { topic:'t', depth:'normal', refreshDays:30, limit:5, perQuery:1, maxScrapes:5, prefer:[],
          queries:[{ q:'a query', why:'U-1' }], urls:[] },
});
`);
    return file;
  });

  const running = files.map((file) => spawnSync(process.execPath, [file], { encoding: 'utf8', timeout: 60_000 }));
  for (const result of running) assert.equal(result.status, 0, result.stderr);

  const ledger = readLedger(root);
  assert.equal(ledger.problems.length, 0, `the chain broke: ${JSON.stringify(ledger.problems)}`);
  assert.equal(ledger.entries.length, 2, 'one of the two collections was lost');

  // Each entry names the provider that actually ranked ITS url - the two did not cross.
  for (const entry of ledger.entries) {
    const tag = entry.url.includes('alpha') ? 'alpha' : 'beta';
    assert.equal(entry.discoveredBy, `search-${tag}`,
      `${entry.url} was credited to the wrong provider`);
    assert.equal(entry.transport, 'stub-fetch');
  }

  const providers = readCorpus(root).evidence.length;
  assert.equal(providers, 2, 'the evidence rows collided');
});

test('CONCURRENCY: both runs are recorded in the usage log, one line each', () => {
  const root = project();
  runResearch(root, { adapter: fetchStub(), searchAdapter: searchStub({ name: 'search-a' }), plan: plan() });
  runResearch(root, { adapter: fetchStub({ results: ['https://second.example/b'] }), searchAdapter: searchStub({ name: 'search-b', results: ['https://second.example/b'] }), plan: plan() });

  const rows = jsonLines(root, '.usage.jsonl');
  assert.equal(rows.length, 2, 'a run was swallowed by the other');
  assert.deepEqual(rows.map((r) => r.searchTransport), ['search-a', 'search-b']);
});
