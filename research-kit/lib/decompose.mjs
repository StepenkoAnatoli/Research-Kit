// decompose.mjs - phase 0: gather material, seed the checklist, draft the MAP.
//
// It contains NO JUDGMENT. It hands over a checklist with statuses BLANK, never an
// answer: marking a row COVERED / DISMISSED / GAP is the agent's act, and
// `subtopic-coverage` is what judges it afterwards.
//
// A `--recipe` ADDS domain dimensions on top of the universal set. It never replaces
// it - a recipe that silently dropped legality would be worse than no recipe.

import path from 'node:path';
import {
  PATHS, HEADERS, resolve, exists, readText, writeText, today, hostOf, uniq,
} from './core.mjs';
import { readCorpus, cacheDecision, tableRow, appendJsonLine } from './corpus.mjs';
import { seedRows, UNIVERSAL_DIMENSIONS } from './dimensions.mjs';
import { collectOne, DEFAULT_SOURCE_TYPE } from './collect.mjs';
import { urlKey } from './research-run.mjs';
import { KIT_ROOT, UNTITLED_TOPIC } from './scaffold.mjs';

export const RECIPE_DIR = path.join(KIT_ROOT, 'recipes');

/** Front-matter dimensions from a recipe file. Specializations, never replacements. */
export function parseRecipe(text) {
  const match = String(text ?? '').match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const dimensions = [];
  let name = '';
  if (match) {
    let inList = false;
    for (const line of match[1].split(/\r?\n/)) {
      const named = line.match(/^name:\s*(.*)$/);
      if (named) { name = named[1].trim(); continue; }
      if (/^dimensions:\s*$/.test(line)) { inList = true; continue; }
      if (inList) {
        const item = line.match(/^\s*-\s+(.*)$/);
        if (!item) { if (line.trim()) inList = false; continue; }
        const [label, why] = item[1].split(/\s*\|\s*/);
        dimensions.push({ name: label.trim(), why: (why ?? '').trim() });
      }
    }
  }
  return { name, dimensions };
}

export function loadRecipe(nameOrPath) {
  if (!nameOrPath) return { name: '', dimensions: [] };
  const direct = exists(nameOrPath) ? nameOrPath : path.join(RECIPE_DIR, `${nameOrPath}.md`);
  const text = readText(direct);
  if (text === null) {
    const err = new Error(`no recipe "${nameOrPath}" - looked in ${RECIPE_DIR}`);
    err.code = 'UNKNOWN_RECIPE';
    throw err;
  }
  return { ...parseRecipe(text), file: direct };
}

/** Where the facts probably live: the official hosts a search keeps pointing at. */
export function docsHosts(results, { limit = 6 } = {}) {
  const counts = new Map();
  for (const row of results) {
    const host = hostOf(row.url);
    if (!host) continue;
    let weight = 1;
    if (/^docs?\.|^developer\./.test(host)) weight += 2;
    if (/\b(docs?|developer|api|reference|pricing|terms)\b/.test(row.url)) weight += 1;
    counts.set(host, (counts.get(host) ?? 0) + weight);
  }
  return [...counts].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([host, score]) => ({ host, score }));
}

/**
 * One line of vendor error text, safe to commit. MAP.md is checked in, and an error string
 * is whatever the vendor or its CLI printed - which has echoed request URLs, and keys with
 * them. So: the first line only, `api_key=`-style parameters blanked, any credential-shaped
 * run (32+ token characters - a SerpAPI key, an `fc-` key, a GitHub token) replaced, capped.
 * Pattern-based on purpose: the string may carry a credential this process never held.
 */
function scrubError(text) {
  const line = String(text ?? '').split(/\r?\n/).find((l) => l.trim()) ?? '';
  const clean = line
    .replace(/((?:api[_-]?key|key|token|secret)=)[^&\s]+/gi, '$1<redacted>')
    .replace(/[A-Za-z0-9_-]{32,}/g, '<redacted>')
    .trim();
  return clean.length > 160 ? `${clean.slice(0, 157)}...` : clean;
}

/**
 * `resolveTopic(root, asked)` -> `{ topic }` to decompose, or `{ error }`.
 *
 * The project's topic is `research/plan.json`'s, which new-project writes. With no
 * `--topic` it is the one decomposed; a different `--topic` is refused, because a map of
 * another topic is another project, and the brief takes its title from the map. Spacing
 * and case are not a difference. A project still called "Untitled topic" has none, so
 * any `--topic` is accepted there.
 */
export function resolveTopic(root, asked) {
  const plan = readCorpus(root).plan;
  const own = typeof plan?.topic === 'string' && plan.topic.trim() && plan.topic.trim() !== UNTITLED_TOPIC
    ? plan.topic.trim() : '';
  const given = typeof asked === 'string' ? asked.trim() : '';
  const same = (a, b) => a.replace(/\s+/g, ' ').toLowerCase() === b.replace(/\s+/g, ' ').toLowerCase();
  if (!given && !own) return { error: 'this project has no topic yet - pass --topic "<what is being researched>"' };
  if (!given) return { topic: own };
  if (own && !same(own, given)) {
    return {
      error: `research/plan.json names this project's topic as "${own}", and --topic says "${given}".\n`
        + '  Omit --topic to map this project\'s topic. A different topic is a different project:\n'
        + '  scaffold it in its own folder with new-project.mjs.',
    };
  }
  return { topic: own || given };
}

function mapBody({ topic, rows, hosts, material, date, recipe, failures = [], dryRun = false }) {
  const lines = [
    '# MAP - topic decomposition',
    '',
    '## Topic',
    '',
    topic,
    '',
    '## Subtopics',
    '',
    'Statuses are blank on purpose: phase 0 gathers material, it does not judge. Mark each',
    'row COVERED (cite the U-## rows that cover it), DISMISSED (reason required - dismissing',
    'is fine, omitting is not), or GAP, and add topic-specific subtopics where the checklist',
    'is not enough.',
    '',
    tableRow(HEADERS.subtopics),
    `|${HEADERS.subtopics.map(() => '---').join('|')}|`,
    ...rows.map((row) => tableRow([row.id, row.text, row.why, row.status, row.coveredBy])),
    '',
    '## Coverage notes (per dimension)',
    '',
    '_One short paragraph per row once it has a status: what was established, and what the',
    'status rests on._',
    '',
    '## Candidate material',
    '',
    `Gathered ${date}${recipe ? ` with recipe \`${recipe}\`` : ''}.`,
    '',
  ];
  if (hosts.length) {
    lines.push('Likely owners of these facts (by how often a search pointed at them):', '');
    for (const { host, score } of hosts) lines.push(`- \`${host}\` (${score})`);
    lines.push('');
  }
  if (material.length) {
    lines.push('Candidate pages:', '');
    for (const row of material) lines.push(`- [${row.title || row.url}](${row.url})`);
    lines.push('');
  }
  // Three different empty maps, and they must not read alike: a dry run gathered nothing on
  // purpose, a quiet topic was searched and answered with nothing, and an outage was never
  // answered at all. Only the first is fixed by running without --dry-run.
  const lost = failures.filter((f) => !f.degraded);
  if (!hosts.length && !material.length) {
    if (dryRun) lines.push('_No material gathered - run without `--dry-run`, or add URLs to `research/plan.json`._', '');
    else if (lost.length) lines.push('_No material gathered - every search failed (below). This map is the bare checklist; re-run once the provider answers._', '');
    else lines.push('_No material gathered - every search answered, and none returned a page. Add URLs to `research/plan.json`._', '');
  }
  if (failures.length) {
    lines.push('Search failures - a map drafted from failed searches looks like a map of a quiet topic, so they are listed:', '');
    for (const f of failures) {
      const fell = f.degraded && f.fellBackTo ? ` - fell back to ${f.fellBackTo}` : '';
      lines.push(`- \`${scrubError(f.query)}\` on ${f.provider}: ${scrubError(f.error)}${fell}`);
    }
    lines.push('');
  }
  return `${lines.join('\n')}\n`;
}

/**
 * Draft `research/MAP.md`.
 *
 * Scrape-budget accounting goes through the corpus's own `cacheDecision`, so a cache hit
 * is not an attempt and never spends a credit.
 */
export function decompose(root, {
  topic,
  adapter,
  searchAdapter = null,
  recipe = '',
  limit = 8,
  maxScrapes = 0,
  refreshDays = 30,
  dryRun = false,
  force = false,
  date = today(),
  now = new Date(),
  log = () => {},
} = {}) {
  // A budget that is not a number is a refusal, not a cap of NaN: every comparison
  // against NaN is false, so an unvalidated flag silently removes the cap it looks like
  // it is setting.
  if (!Number.isInteger(maxScrapes) || maxScrapes < 0) {
    const err = new Error(`--max-scrapes must be a whole number of pages, not "${maxScrapes}"`);
    err.code = 'INVALID_BUDGET';
    throw err;
  }
  if (!Number.isInteger(limit) || limit <= 0) {
    const err = new Error(`--limit must be a positive whole number, not "${limit}"`);
    err.code = 'INVALID_BUDGET';
    throw err;
  }

  const file = resolve(root, PATHS.map);
  const existing = readText(file, '');
  if (existing.trim() && !force && !/^\s*$/.test(existing) && existing.includes('| ID |')) {
    const filled = existing.match(/\|\s*(COVERED|DISMISSED|GAP)\s*\|/);
    if (filled) {
      return { written: false, reason: `${PATHS.map} already holds judged rows - re-run with --force to redraft over them` };
    }
  }

  const loaded = recipe ? loadRecipe(recipe) : { name: '', dimensions: [] };
  const rows = seedRows(loaded.dimensions);
  const corpus = readCorpus(root);

  let material = [];
  let hosts = [];
  let spent = 0;
  let searches = 0;
  let searchesUsed = 0;
  let cached = 0;
  let failedScrapes = 0;
  const failures = [];

  const queries = uniq([
    topic,
    `${topic} documentation`,
    `${topic} pricing limits`,
    `${topic} terms of service`,
  ]);
  if (dryRun) {
    // Named, as research's dry run names its queries: the dry run seeded the map and said
    // nothing about the four searches a real run spends (found 2026-09-27).
    const meter = searchAdapter?.name ?? adapter?.name ?? 'the search provider this machine selects';
    for (const query of queries) log(`  would search "${query}" on ${meter}, keeping up to ${limit} result(s)`);
    if (maxScrapes > 0) log(`  and scrape up to ${maxScrapes} of the pages found`);
  }
  if (!dryRun && adapter) {
    searches = queries.length;
    const seen = new Set();
    // The SEARCH side (ADR-0027). Absent means "the fetch adapter" - what this function
    // did before the split, so a caller that has not been updated is unaffected.
    const searcher = searchAdapter ?? adapter;
    for (const query of queries) {
      let found = searcher.search(query, { limit });
      if (Number.isFinite(found?.searchesUsed)) searchesUsed += found.searchesUsed;
      let ranker = searcher.name;
      // One bounded fallback, reported rather than absorbed (RR-1, RR-2).
      if (!found.ok && searcher !== adapter) {
        failures.push({ query, error: found.error, provider: searcher.name, degraded: true, fellBackTo: adapter.name });
        log(`  search failed on ${searcher.name}: ${found.error}`);
        log(`  degrading to ${adapter.name} for this query - this spends fetch credits`);
        found = adapter.search(query, { limit });
        if (Number.isFinite(found?.searchesUsed)) searchesUsed += found.searchesUsed;
        ranker = adapter.name;
      }
      if (!found.ok) {
        // A failed search is kept, not just printed: a map written after every search
        // failed looks exactly like a map written from a quiet topic.
        failures.push({ query, error: found.error, provider: ranker });
        log(`  search failed: ${query} - ${found.error}`);
        continue;
      }
      for (const row of found.results) {
        // One page, one candidate - the identity runResearch uses (urlKey).
        if (seen.has(urlKey(row.url))) continue;
        seen.add(urlKey(row.url));
        material.push({ ...row, rankedBy: ranker });
      }
    }
    hosts = docsHosts(material);

    // The budget bounds SCRAPES, not candidates: a cache hit is not an attempt, so a
    // second pass reaches further down the list instead of re-reading the same two.
    for (const row of material) {
      if (spent >= maxScrapes) break;
      const decision = cacheDecision(corpus.captures, row.url, { refreshDays, now });
      if (decision.hit) { cached += 1; log(`  cached    ${row.url}`); continue; }
      const outcome = collectOne(root, row.url, {
        runScrape: (url) => adapter.runScrape(url),
        corpus,
        type: DEFAULT_SOURCE_TYPE,
        usedFor: `phase 0: ${topic}`,
        refreshDays,
        date,
        now,
        transportName: adapter.name,
        // Every URL here came from a ranking - decompose has no plan file to read from -
        // so unlike `runResearch` this is never empty (DR-2).
        discoveredBy: row.rankedBy ?? '',
      });
      if (outcome.status === 'collected' || outcome.status === 'failed') spent += 1;
      if (outcome.status === 'failed') failedScrapes += 1;
      log(`  ${outcome.status.padEnd(9)} ${row.url}`);
    }

    // Phase 0 is mostly searching, and a search spends on its provider's meter. Found
    // 2026-09-27: two runs made 8 SerpAPI searches - the vendor counted them - and
    // `research.mjs --status` counted 0, because only research-run wrote a usage row. The
    // same row, for the same reason research-run writes one for a search-only run (DR-1).
    if (spent || searchesUsed) {
      appendJsonLine(root, PATHS.usage, {
        at: new Date().toISOString(), command: 'decompose', budget: maxScrapes,
        attempts: spent, spent, cached, failed: failedScrapes,
        transport: adapter.name,
        searchTransport: searcher.name,
        searchesUsed,
        searchFailures: failures.filter((x) => !x.degraded).length,
        degraded: failures.filter((x) => x.degraded).length,
      });
    }
  }

  writeText(file, mapBody({ topic, rows, hosts, material: material.slice(0, 20), date, recipe: loaded.name || recipe, failures, dryRun: dryRun || !adapter }));
  return {
    written: true,
    // "nothing was found" and "every attempt failed" are different answers.
    gathered: material.length > 0,
    failures,
    searches,
    file: PATHS.map,
    rows: rows.length,
    universal: UNIVERSAL_DIMENSIONS.length,
    added: loaded.dimensions.length,
    recipe: loaded.name || recipe,
    material: material.length,
    hosts,
    spent,
  };
}

/**
 * The line the CLI prints about searching, or '' when every search answered first time.
 * A degradation is counted as answered - the query did get results - but never silently:
 * it moved spend onto the fetch budget, as `research.mjs` says of its own fallbacks.
 */
export function searchSummary({ searches = 0, failures = [], gathered = false } = {}) {
  if (!failures.length) return '';
  const lostQueries = new Set(failures.filter((f) => !f.degraded).map((f) => f.query));
  const fellBack = new Set(failures.filter((f) => f.degraded).map((f) => f.query));
  // Only a fallback that ANSWERED is known to have spent: one that failed too is a lost query.
  const rescued = [...fellBack].filter((q) => !lostQueries.has(q)).length;
  const lost = lostQueries.size;
  const lines = [`searches   ${searches - lost} of ${searches} searches answered`
    + (lost ? `, ${lost} failed` : '')
    + (fellBack.size ? `; ${fellBack.size} fell back to the fetch provider` : '')
    + (rescued ? `, ${rescued} answered there - those spent FETCH credits` : '')
    + ' (reasons in research/MAP.md)'];
  if (!gathered && lost) {
    lines.push('NOTHING gathered: every search failed, so the map is the bare checklist. Re-run once the provider answers.');
  }
  return lines.join('\n');
}
