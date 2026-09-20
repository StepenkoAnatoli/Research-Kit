// research-run.mjs - many URLs, one run.
//
// The coordinator: plan / query / url fan-out, discovery, candidate selection, budget
// tiers, cache policy. `collectOne` does the writing; this decides what to ask for.
//
// Every scrape spends a credit, so the budget is a first-class input: a tier caps the
// run, a cache hit is never an attempt, and `--dry-run` spends nothing.

import { PATHS, resolve, readJson, readText, today, hostOf, uniq } from './core.mjs';
import { readCorpus, cacheDecision, appendJsonLine } from './corpus.mjs';
import { collectOne, DEFAULT_SOURCE_TYPE } from './collect.mjs';

/** The budget tiers, in credits of scrape. Tuned for a ~1,000-credit free month. */
export const DEPTH_SCRAPES = Object.freeze({
  probe: 2,
  quick: 4,
  normal: 10,
  deep: 25,
});

export const DEPTHS = Object.freeze(Object.keys(DEPTH_SCRAPES));

/**
 * `readPlan(root, file)` - the plan to run, defaulting to the project's own.
 *
 * `file` was missing entirely until 2026-09-20, while `bin/research.mjs --help` had been
 * documenting `--plan <file>` the whole time. The CLI called `readPlan(root)` and threw
 * the filename away, so `--plan probe.json` re-ran the default plan and looked like it
 * had worked. A flag that silently ignores its argument is worse than an absent one: the
 * operator watches a run happen and believes it was theirs.
 */
export function readPlan(root, file = '') {
  const plan = readJson(resolve(root, file || PATHS.plan), null);
  if (!plan) return { topic: '', depth: 'quick', refreshDays: 30, limit: 8, perQuery: 3, maxScrapes: 10, prefer: [], queries: [], urls: [] };
  return {
    topic: plan.topic ?? '',
    depth: DEPTHS.includes(plan.depth) ? plan.depth : 'quick',
    refreshDays: Number.isFinite(plan.refreshDays) ? plan.refreshDays : 30,
    limit: Number.isFinite(plan.limit) ? plan.limit : 8,
    perQuery: Number.isFinite(plan.perQuery) ? plan.perQuery : 3,
    maxScrapes: Number.isFinite(plan.maxScrapes) ? plan.maxScrapes : 10,
    prefer: Array.isArray(plan.prefer) ? plan.prefer : [],
    queries: Array.isArray(plan.queries) ? plan.queries : [],
    urls: Array.isArray(plan.urls) ? plan.urls : [],
  };
}

/**
 * Prefer the page that OWNS the fact. A URL on a preferred domain outranks one that is
 * merely about it, and a docs/pricing/terms path outranks a blog post on the same host.
 */
export function rankCandidate(url, { prefer = [], why = '' } = {}) {
  let value = 0;
  const host = hostOf(url);
  if (prefer.some((domain) => host === domain || host.endsWith(`.${domain}`))) value += 10;
  if (/\b(docs?|developer|api|reference)\b/.test(url)) value += 4;
  if (/\b(pricing|plans|billing|limits|rate-limits|quotas)\b/.test(url)) value += 4;
  if (/\b(terms|tos|legal|licen[cs]e|privacy)\b/.test(url)) value += 3;
  if (/\b(blog|news|medium\.com|reddit\.com|youtube\.com|stackoverflow\.com)\b/.test(url)) value -= 5;
  if (/\b(login|signin|signup|cart|checkout)\b/.test(url)) value -= 8;
  if (why && new RegExp(why.split(/\s+/).slice(0, 2).join('|'), 'i').test(url)) value += 1;
  return value;
}

export function selectCandidates(results, { prefer = [], perQuery = 3, seen = new Set() } = {}) {
  return results
    .map((row) => ({ ...row, score: rankCandidate(row.url, { prefer }) }))
    .filter((row) => row.url && !seen.has(row.url))
    .sort((a, b) => b.score - a.score)
    .slice(0, perQuery);
}

/**
 * Run the plan.
 *
 * `{ transport, budget, attempts, spent, cached, failed, results, discovered }`.
 * Nothing is collected when `dryRun` is set - `attempts` still shows what it would
 * cost, against the same cap - and a cache hit never counts against the budget.
 */
export function runResearch(root, {
  adapter,
  // The SEARCH side (ADR-0027). Absent means "the fetch adapter", which is what every
  // caller did before the split - so an un-updated caller behaves exactly as before.
  searchAdapter = null,
  plan = null,
  depth = '',
  refreshDays = null,
  force = false,
  dryRun = false,
  only = [],
  date = today(),
  now = new Date(),
  log = () => {},
} = {}) {
  const settings = plan ?? readPlan(root);
  const tier = depth || settings.depth;
  const budget = Math.min(settings.maxScrapes, DEPTH_SCRAPES[tier] ?? DEPTH_SCRAPES.quick);
  const freshness = refreshDays === null ? settings.refreshDays : refreshDays;
  const corpus = readCorpus(root);

  const results = [];
  const discovered = [];
  // `attempts` is what the BUDGET counts - the scrapes a run would make, whether or not
  // it makes them. `spent` is what it actually cost. A dry run has attempts and no
  // spend; conflating the two made a preview ignore the very cap it was previewing.
  let attempts = 0;
  let spent = 0;
  let cached = 0;
  let failed = 0;
  // The search side keeps its OWN counters, because it is a separate meter and a summary
  // that merged them would hide the whole point of the split.
  let searchesUsed = 0;
  let searchFailures = 0;
  let degraded = 0;

  const searcher = searchAdapter ?? adapter;
  const searchName = searcher?.name ?? adapter?.name ?? '';

  const seen = new Set(corpus.captures.entries.map((e) => e.url).filter(Boolean));
  const targets = [];

  for (const entry of settings.urls) {
    const url = typeof entry === 'string' ? entry : entry.url;
    if (!url) continue;
    targets.push({
      url,
      type: (typeof entry === 'object' && entry.type) || 'P',
      usedFor: (typeof entry === 'object' && entry.why) || '',
      from: 'plan.urls',
    });
  }

  for (const query of settings.queries) {
    const text = typeof query === 'string' ? query : query.q;
    if (!text) continue;
    if (only.length && !only.some((needle) => text.toLowerCase().includes(needle.toLowerCase()))) continue;
    const prefer = uniq([...(settings.prefer ?? []), ...((typeof query === 'object' && query.prefer) || [])]);
    if (dryRun) {
      discovered.push({ query: text, results: [], note: 'search not run under --dry-run' });
      continue;
    }
    let found = searcher.search(text, { limit: settings.limit });
    let ranker = searchName;

    // A second meter is a second thing that can be down. One bounded fallback to the
    // fetch provider's own search (RR-1, RR-2): it keeps the run alive, it costs fetch
    // credits, and it is REPORTED rather than absorbed - a silent fallback is a bill the
    // operator did not know they were paying.
    if (!found.ok && searcher !== adapter) {
      const reason = found.error;
      searchFailures += 1;
      appendJsonLine(root, PATHS.failures, {
        at: new Date().toISOString(), op: 'search', query: text, provider: searchName, error: reason, degraded: true,
      });
      log(`  search failed on ${searchName}: ${reason}`);
      log(`  degrading to ${adapter.name} for this query - this spends fetch credits`);
      found = adapter.search(text, { limit: settings.limit });
      ranker = adapter.name;
      if (found.ok) degraded += 1;
    }

    if (!found.ok) {
      log(`  search failed: ${text} - ${found.error}`);
      appendJsonLine(root, PATHS.failures, {
        at: new Date().toISOString(), op: 'search', query: text, provider: ranker, error: found.error,
      });
      continue;
    }
    if (Number.isFinite(found.searchesUsed)) searchesUsed += found.searchesUsed;
    discovered.push({ query: text, results: found.results, provider: ranker, searchId: found.searchId ?? null });
    for (const candidate of selectCandidates(found.results, { prefer, perQuery: settings.perQuery, seen })) {
      targets.push({
        // Discovered by a search, not chosen by a person: context until an agent reads
        // the page and promotes it. Ranking preference is not source authority.
        url: candidate.url,
        type: DEFAULT_SOURCE_TYPE,
        usedFor: (typeof query === 'object' && query.why) || text,
        // WHICH provider ranked it, not just which query found it (DR-2). Two providers'
        // rankings are two different provenance claims, and a bare query string cannot
        // carry both.
        from: `query: ${text} (via ${ranker})`,
        rankedBy: ranker,
      });
    }
  }

  for (const target of targets) {
    if (seen.has(target.url) === false) seen.add(target.url);
    const decision = cacheDecision(corpus.captures, target.url, { refreshDays: freshness, force, now });
    // The budget binds in a DRY RUN too. A preview that ignores it answers a different
    // question from the one execution will answer - it shows work that would never
    // happen, and hides the cap the operator is previewing against.
    if (!decision.hit && attempts >= budget) {
      results.push({ ...target, status: 'skipped', reason: `budget exhausted (${budget} scrapes at depth ${tier})` });
      continue;
    }
    if (!decision.hit) attempts += 1;
    const outcome = collectOne(root, target.url, {
      runScrape: (url) => adapter.runScrape(url),
      corpus,
      type: target.type,
      usedFor: target.usedFor,
      refreshDays: freshness,
      force,
      date,
      now,
      transportName: adapter.name,
      // Empty for a plan URL - nobody's ranking chose it, a person wrote it down.
      discoveredBy: target.rankedBy ?? '',
      dryRun,
    });
    if (outcome.status === 'collected') spent += 1;
    if (outcome.status === 'cached') cached += 1;
    if (outcome.status === 'failed') { failed += 1; spent += 1; }
    results.push({ ...target, ...outcome });
    log(`  ${outcome.status.padEnd(9)} ${target.url}${outcome.reason ? ` - ${outcome.reason}` : ''}`);
  }

  // A run that only searched still spent something - on a different meter. Logging only
  // when `spent` was non-zero would make a search-only run invisible in the usage record
  // (DR-1).
  if (!dryRun && (spent || searchesUsed)) {
    appendJsonLine(root, PATHS.usage, {
      at: new Date().toISOString(), depth: tier, budget, attempts, spent, cached, failed,
      transport: adapter.name,
      searchTransport: searchName,
      searchesUsed,
      searchFailures,
      degraded,
    });
  }

  return {
    transport: adapter.name,
    searchTransport: searchName,
    depth: tier, budget, attempts, spent, cached, failed,
    searchesUsed, searchFailures, degraded,
    results, discovered,
  };
}

/** What has been spent, read from the run log the collector keeps. */
export function usageSummary(root) {
  const corpus = readCorpus(root);
  const scrapes = corpus.ledger.entries.filter((e) => e.op === 'scrape').length;
  const failures = corpus.ledger.entries.filter((e) => e.op === 'fail').length;
  return {
    captures: corpus.captures.entries.length,
    scrapes,
    failures,
    evidence: corpus.evidence.length,
    ledgerEntries: corpus.ledger.entries.length,
    search: searchUsage(root),
  };
}

/**
 * What the SEARCH meter has cost lately, read from the usage log this kit already keeps.
 *
 * This is RR-5, narrowed deliberately. The requirement asked for a throttle that keeps
 * the kit under 50 requests an hour. A throttle was the wrong instrument: it would be
 * the kit refusing work on a guess about a counter it cannot see, when the vendor
 * already answers a throttled request with an error that RR-3 handles by degrading. A
 * guard that duplicates the vendor's own answer can only add a way to be wrong.
 *
 * What was genuinely missing is the operator being able to SEE the meter. So this counts
 * rather than blocks, and the caps it names are the free tier's (E-07), stated as
 * context rather than enforced.
 *
 * Counts this kit's own spend. It cannot see searches made from another machine on the
 * same account, and it over-counts a repeat served from the vendor's free 1-hour cache
 * (E-09), which the payload gives no way to detect. Both limits are reported.
 */
export const FREE_TIER_PER_HOUR = 50;
export const FREE_TIER_PER_MONTH = 250;

export function searchUsage(root, { now = new Date(), provider = '' } = {}) {
  const lines = readText(resolve(root, PATHS.usage), '').trim();
  const rows = lines ? lines.split('\n').map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean) : [];

  const hourAgo = now.getTime() - 3600_000;
  const monthStart = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1);
  let lastHour = 0;
  let thisMonth = 0;
  const providers = new Set();

  for (const row of rows) {
    const used = Number(row.searchesUsed);
    if (!Number.isFinite(used) || used <= 0) continue;
    if (provider && row.searchTransport !== provider) continue;
    const at = Date.parse(row.at);
    if (!Number.isFinite(at)) continue;
    if (row.searchTransport) providers.add(row.searchTransport);
    if (at >= hourAgo) lastHour += used;
    if (at >= monthStart) thisMonth += used;
  }

  return {
    lastHour,
    thisMonth,
    providers: [...providers],
    perHourCap: FREE_TIER_PER_HOUR,
    perMonthCap: FREE_TIER_PER_MONTH,
    // Named so nobody reads these numbers as the vendor's.
    caveat: 'counted from this machine\'s own runs; a repeat served from the provider\'s free cache is counted here but not billed',
  };
}
