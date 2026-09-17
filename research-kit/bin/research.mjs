#!/usr/bin/env node
// bin/research.mjs - the collector's CLI.
//
// Refused on a BUILDER machine (exit 2) before any credential or adapter is consulted:
// a page fetched by hand is not evidence in this kit, and a builder that "re-collects"
// a missing page forges a corpus instead of reporting a gap.
//
// `--dry-run` and `--status` still work there, because they spend nothing.

import { parseFlags, flagList } from '../lib/core.mjs';
import { collectionPolicy, collectionRefusal } from '../lib/machine.mjs';
import { selectTransport, TRANSPORT_NAMES } from '../lib/transport.mjs';
import { runResearch, readPlan, usageSummary, DEPTHS, DEPTH_SCRAPES } from '../lib/research-run.mjs';
import { heading } from '../lib/render.mjs';

const { flags } = parseFlags(process.argv.slice(2));
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
  const plan = readPlan(root);
  const usage = usageSummary(root);
  let transport = null;
  try { transport = selectTransport({ explicit: typeof flags.transport === 'string' ? flags.transport : '' }); } catch { /* reported below */ }
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
transport          ${transport ? `${transport.name} (${transport.why})` : 'unresolved'}
`);
  process.exit(0);
}

let chosen;
try {
  chosen = selectTransport({ explicit: typeof flags.transport === 'string' ? flags.transport : '' });
} catch (err) {
  process.stderr.write(`${err.message}\n`);
  process.exit(2);
}

process.stdout.write(`transport: ${chosen.name} - ${chosen.why}\n`);
const run = runResearch(root, {
  adapter: chosen.adapter,
  plan: typeof flags.plan === 'string' ? readPlan(root) : null,
  depth: typeof flags.depth === 'string' ? flags.depth : '',
  refreshDays: flags['refresh-days'] === undefined ? null : Number(flags['refresh-days']),
  force: Boolean(flags.force),
  dryRun: Boolean(flags['dry-run']),
  only: flagList(flags.only),
  log: (line) => process.stdout.write(`${line}\n`),
});

process.stdout.write(`${heading('run')}
depth      ${run.depth} (budget ${run.budget} scrapes)
collected  ${run.spent}
cached     ${run.cached}
failed     ${run.failed}
`);
if (run.spent) {
  process.stdout.write('\nNext: rewrite each auto-extracted Finding cell into a real claim, then run\n  node research-kit/bin/preflight.mjs\n');
}
process.exit(0);
