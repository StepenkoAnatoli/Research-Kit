#!/usr/bin/env node
// bin/research.mjs - the collector's CLI.
//
// Refused on a BUILDER machine (exit 2) before any credential or adapter is consulted:
// a page fetched by hand is not evidence in this kit, and a builder that "re-collects"
// a missing page forges a corpus instead of reporting a gap.
//
// `--dry-run` and `--status` still work there, because they spend nothing.

import { parseFlags, flagList, refuseUnknownFlags, resolve, readText } from '../lib/core.mjs';
import { collectionPolicy, collectionRefusal } from '../lib/machine.mjs';
import { selectTransport, TRANSPORT_NAMES, SEARCH_PROVIDER_NAMES } from '../lib/transport.mjs';
import { runResearch, readPlan, usageSummary, topicMatch, DEPTHS, DEPTH_SCRAPES } from '../lib/research-run.mjs';
import { parseCapture } from '../lib/corpus.mjs';
import { heading } from '../lib/render.mjs';

const { flags } = parseFlags(process.argv.slice(2));
refuseUnknownFlags(flags, ['depth', 'dry-run', 'force', 'help', 'only', 'plan', 'refresh-days', 'search-transport', 'status', 'transport']);
const root = process.cwd();

if (flags.help) {
  process.stdout.write(`research - collect primary evidence into this project's corpus.

  node research-kit/bin/research.mjs [options]

  --plan <file>        plan to run (default research/plan.json)
  --depth <tier>       ${DEPTHS.map((d) => `${d} (${DEPTH_SCRAPES[d]})`).join(', ')}
  --refresh-days <n>   re-collect a capture older than n days
  --only <text>        run only the plan queries containing this text (repeatable)
  --force              ignore the cache
  --dry-run            say what would be collected; spend nothing
  --status             budget and corpus state; spend nothing
  --transport <name>   ${TRANSPORT_NAMES.join(' | ')}
  --search-transport <name>
                       ${SEARCH_PROVIDER_NAMES.join(' | ')} - the SEARCH side only.
                       Default: the fetch transport, unless a SerpAPI key is configured.

Every scrape spends a credit. Plan the queries before collecting.
`);
  process.exit(0);
}

const spends = !flags['dry-run'] && !flags.status;
const policy = collectionPolicy();
if (spends && !policy.mayCollect) {
  process.stderr.write(`${collectionRefusal(policy)}\n`);
  process.exit(2);
}

if (flags.status) {
  const plan = readPlan(root, typeof flags.plan === 'string' ? flags.plan : '');
  const usage = usageSummary(root);
  let transport = null;
  try {
    transport = selectTransport({
      explicit: typeof flags.transport === 'string' ? flags.transport : '',
      explicitSearch: typeof flags['search-transport'] === 'string' ? flags['search-transport'] : '',
    });
  } catch (err) {
    // A misspelled provider is an operator error, not a state to report. The old comment
    // here said "reported below" and nothing below reported it: `--status` printed
    // "unresolved" and exited 0, so `--transport firecrwal` looked like a healthy
    // machine with a detection problem. Found by the first test that ever ran this
    // binary.
    process.stderr.write(`${err.message}\n`);
    process.exit(2);
  }
  process.stdout.write(`${heading('corpus')}
captures on disk   ${usage.captures}
evidence rows      ${usage.evidence}
ledger entries     ${usage.ledgerEntries} (${usage.scrapes} scrape, ${usage.failures} failed)
${heading('plan')}
topic              ${plan.topic || '(unset)'}
depth              ${plan.depth} - up to ${DEPTH_SCRAPES[plan.depth]} scrapes
queries / urls     ${plan.queries.length} / ${plan.urls.length}
refresh-days       ${plan.refreshDays}
${heading('machine')}
role               ${policy.role}${policy.mayCollect ? '' : ' - this machine must NOT collect'}
transport          ${transport.name} (${transport.why})
search transport   ${transport.search.name}${transport.search.sameAsFetch ? ' - same meter as fetch' : ` (${transport.search.why})`}
searches (this box) ${usage.search.lastHour} in the last hour, ${usage.search.thisMonth} this month${usage.search.providers.length ? ` (${usage.search.providers.join(', ')})` : ''}
                   free-tier caps are ${usage.search.perHourCap}/hour and ${usage.search.perMonthCap}/month; ${usage.search.caveat}
`);
  process.exit(0);
}

let chosen;
try {
  chosen = selectTransport({
    explicit: typeof flags.transport === 'string' ? flags.transport : '',
    explicitSearch: typeof flags['search-transport'] === 'string' ? flags['search-transport'] : '',
  });
} catch (err) {
  process.stderr.write(`${err.message}\n`);
  process.exit(2);
}

process.stdout.write(`transport: ${chosen.name} - ${chosen.why}\n`);
if (!chosen.search.sameAsFetch) {
  process.stdout.write(`search:    ${chosen.search.name} - ${chosen.search.why}\n`);
}
const run = runResearch(root, {
  adapter: chosen.adapter,
  searchAdapter: chosen.search.adapter,
  searchAdapters: chosen.search.adapters ?? null,
  plan: typeof flags.plan === 'string' ? readPlan(root, flags.plan) : null,
  depth: typeof flags.depth === 'string' ? flags.depth : '',
  refreshDays: flags['refresh-days'] === undefined ? null : Number(flags['refresh-days']),
  force: Boolean(flags.force),
  dryRun: Boolean(flags['dry-run']),
  only: flagList(flags.only),
  log: (line) => process.stdout.write(`${line}\n`),
});

process.stdout.write(`${heading('run')}
depth      ${run.depth} (budget ${run.budget} scrapes)
collected  ${run.collected}
cached     ${run.cached}
failed     ${run.failed}
spent      ${run.spent} (budget consumed: collected + failed)
`);

// The topic signal, printed at the one moment it helps: the pages are on disk and nobody
// has read them yet. It decides nothing - see `topicMatch` for the two thresholds that were
// measured and rejected - but a low number on a fresh collection is the prompt to check the
// URLs, which is exactly the step that caught a wholly off-topic corpus by hand.
//
// Only what THIS run collected is measured. Judging the whole corpus would blend a bad
// collection into whatever was already there and hide the thing worth seeing.
const freshBodies = run.results
  .filter((r) => r.status === 'collected' && r.entry?.file)
  .map((r) => parseCapture(readText(resolve(root, r.entry.file)) ?? '').body);
const match = topicMatch(readPlan(root, typeof flags.plan === 'string' ? flags.plan : '').topic, freshBodies);
if (match) {
  process.stdout.write(`topic      ${match.best.toFixed(2)} best of ${match.terms} topic terms, ${match.strong} capture(s) >= 0.50`
    + (match.strong === 0 ? ' - NOTHING matched strongly; read the URLs before trusting this' : '')
    + '\n');
}
process.stdout.write('\n');
// The second meter reports separately, and a degradation is never silent: it means the
// run quietly moved spend back onto the fetch budget.
if (run.searchTransport !== run.transport) {
  process.stdout.write(`searches   ${run.searchesUsed} on ${run.searchTransport}\n`);
  if (run.degraded) {
    process.stdout.write(`degraded   ${run.degraded} quer${run.degraded === 1 ? 'y' : 'ies'} fell back to ${run.transport} - those spent FETCH credits\n`);
  }
}
if (run.spent) {
  process.stdout.write('\nNext: rewrite each auto-extracted Finding cell into a real claim, then run\n  node research-kit/bin/preflight.mjs\n');
}
process.exit(0);
