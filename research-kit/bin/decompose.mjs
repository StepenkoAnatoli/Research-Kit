#!/usr/bin/env node
// bin/decompose.mjs - phase 0's CLI.
//
// Gathers material with the transport, so a BUILDER machine refuses it (exit 2).
// It writes a checklist with statuses BLANK: the tool contains no judgment.

import { parseFlags } from '../lib/core.mjs';
import { collectionPolicy, collectionRefusal } from '../lib/machine.mjs';
import { selectTransport, TRANSPORT_NAMES, SEARCH_PROVIDER_NAMES } from '../lib/transport.mjs';
import { decompose, RECIPE_DIR } from '../lib/decompose.mjs';
import { UNIVERSAL_DIMENSIONS } from '../lib/dimensions.mjs';
import { listFiles } from '../lib/core.mjs';

const { flags } = parseFlags(process.argv.slice(2));
const root = process.cwd();

if (flags.help || (!flags.topic && !flags.recipes)) {
  process.stdout.write(`decompose - phase 0: draft research/MAP.md, seeded with the universal checklist.

  node research-kit/bin/decompose.mjs --topic "<what is being researched>" [options]

  --topic <text>     required - the topic to decompose
  --recipe <name>    ADD domain dimensions on top of the universal set
  --recipes          list the recipes this kit ships
  --max-scrapes <n>  gather up to n pages while mapping (default 0 - search only)
  --limit <n>        search results per query (default 8)
  --dry-run          write the seeded map with no gathering; spend nothing
  --force            redraft over a map that already holds judged rows
  --transport <name> ${TRANSPORT_NAMES.join(' | ')}
  --search-transport <name>
                     ${SEARCH_PROVIDER_NAMES.join(' | ')} - the SEARCH side only.
                     Default: the fetch transport, unless a SerpAPI key is configured.

The ${UNIVERSAL_DIMENSIONS.length} universal dimensions are always seeded. A recipe adds to them; nothing
replaces them - a recipe that silently dropped legality would be worse than no recipe.
`);
  process.exit(flags.help ? 0 : 2);
}

if (flags.recipes) {
  const names = listFiles(RECIPE_DIR).filter((n) => n.endsWith('.md')).map((n) => n.replace(/\.md$/, ''));
  process.stdout.write(names.length ? `${names.join('\n')}\n` : `no recipes in ${RECIPE_DIR}\n`);
  process.exit(0);
}

// Numeric flags are validated BEFORE a transport is chosen or anything is spent: a
// budget of NaN caps nothing, and finding that out after the first scrape is too late.
const numbers = { limit: flags.limit ?? 8, 'max-scrapes': flags['max-scrapes'] ?? 0 };
for (const [name, raw] of Object.entries(numbers)) {
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 0) {
    process.stderr.write(`--${name} must be a whole number, not "${raw}"\n`);
    process.exit(2);
  }
}

const spends = !flags['dry-run'];
const policy = collectionPolicy();
if (spends && !policy.mayCollect) {
  process.stderr.write(`${collectionRefusal(policy)}\n`);
  process.exit(2);
}

let adapter = null;
let searchAdapter = null;
if (spends) {
  try {
    const chosen = selectTransport({
      explicit: typeof flags.transport === 'string' ? flags.transport : '',
      explicitSearch: typeof flags['search-transport'] === 'string' ? flags['search-transport'] : '',
    });
    adapter = chosen.adapter;
    searchAdapter = chosen.search.adapter;
    process.stdout.write(`transport: ${chosen.name} - ${chosen.why}\n`);
    if (!chosen.search.sameAsFetch) {
      process.stdout.write(`search:    ${chosen.search.name} - ${chosen.search.why}\n`);
    }
  } catch (err) {
    process.stderr.write(`${err.message}\n`);
    process.exit(2);
  }
}

let result;
try {
  result = decompose(root, {
    topic: String(flags.topic),
    adapter,
    searchAdapter,
    recipe: typeof flags.recipe === 'string' ? flags.recipe : '',
    limit: Number(flags.limit ?? 8),
    maxScrapes: Number(flags['max-scrapes'] ?? 0),
    dryRun: Boolean(flags['dry-run']),
    force: Boolean(flags.force),
    log: (line) => process.stdout.write(`${line}\n`),
  });
} catch (err) {
  if (err.code === 'UNKNOWN_RECIPE' || err.code === 'INVALID_BUDGET') {
    process.stderr.write(`${err.message}\n`);
    process.exit(2);
  }
  throw err;
}

if (!result.written) {
  process.stderr.write(`${result.reason}\n`);
  process.exit(1);
}

process.stdout.write(`
wrote ${result.file}: ${result.rows} rows (${result.universal} universal${result.added ? ` + ${result.added} from recipe ${result.recipe}` : ''}), ${result.material} candidate pages.

Next, and this part is yours: mark every row COVERED (cite the U-## rows that cover it),
DISMISSED (reason required - dismissing is fine, omitting is not), or GAP, and add
topic-specific subtopics where the checklist is not enough. Then write the unknowns into
research/DISCOVERY.md, each tracing back to a subtopic.
`);
