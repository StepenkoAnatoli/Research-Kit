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
import { readCorpus, cacheDecision, tableRow } from './corpus.mjs';
import { seedRows, UNIVERSAL_DIMENSIONS } from './dimensions.mjs';
import { collectOne, DEFAULT_SOURCE_TYPE } from './collect.mjs';
import { KIT_ROOT } from './scaffold.mjs';

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

function mapBody({ topic, rows, hosts, material, date, recipe }) {
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
  if (!hosts.length && !material.length) {
    lines.push('_No material gathered - run without `--dry-run`, or add URLs to `research/plan.json`._', '');
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
  const failures = [];

  if (!dryRun && adapter) {
    const queries = uniq([
      topic,
      `${topic} documentation`,
      `${topic} pricing limits`,
      `${topic} terms of service`,
    ]);
    const seen = new Set();
    for (const query of queries) {
      const found = adapter.search(query, { limit });
      if (!found.ok) {
        // A failed search is kept, not just printed: a map written after every search
        // failed looks exactly like a map written from a quiet topic.
        failures.push({ query, error: found.error });
        log(`  search failed: ${query} - ${found.error}`);
        continue;
      }
      for (const row of found.results) {
        if (seen.has(row.url)) continue;
        seen.add(row.url);
        material.push(row);
      }
    }
    hosts = docsHosts(material);

    // The budget bounds SCRAPES, not candidates: a cache hit is not an attempt, so a
    // second pass reaches further down the list instead of re-reading the same two.
    for (const row of material) {
      if (spent >= maxScrapes) break;
      const decision = cacheDecision(corpus.captures, row.url, { refreshDays, now });
      if (decision.hit) { log(`  cached    ${row.url}`); continue; }
      const outcome = collectOne(root, row.url, {
        runScrape: (url) => adapter.runScrape(url),
        corpus,
        type: DEFAULT_SOURCE_TYPE,
        usedFor: `phase 0: ${topic}`,
        refreshDays,
        date,
        now,
        transportName: adapter.name,
      });
      if (outcome.status === 'collected' || outcome.status === 'failed') spent += 1;
      log(`  ${outcome.status.padEnd(9)} ${row.url}`);
    }
  }

  writeText(file, mapBody({ topic, rows, hosts, material: material.slice(0, 20), date, recipe: loaded.name || recipe }));
  return {
    written: true,
    // "nothing was found" and "every attempt failed" are different answers.
    gathered: material.length > 0,
    failures,
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
