#!/usr/bin/env node
// bin/prior.mjs - register what you expect to find, before you find it.
//
// With no arguments it prints the prior on record, or says there is none. Registering is
// the only thing it refuses to do twice, and the only thing it refuses to do late.

import { parseFlags, refuseUnknownFlags, readText, resolve } from '../lib/core.mjs';
import { readLedger } from '../lib/corpus.mjs';
import { readPrior, registerPrior, MIN_PRIOR, PRIOR_PATH } from '../lib/prior.mjs';
import { heading } from '../lib/render.mjs';

const { flags, positional } = parseFlags(process.argv.slice(2));
refuseUnknownFlags(flags, ['file', 'help']);
const root = process.cwd();

if (flags.help) {
  process.stdout.write(`prior - register what you expect to find, before you collect.

  node research-kit/bin/prior.mjs                     print the prior on record
  node research-kit/bin/prior.mjs "<text>"            register one
  node research-kit/bin/prior.mjs --file <path>       register one from a file

Write two things: what you expect the evidence to say, and what you know you cannot know
yet. At least ${MIN_PRIOR} characters, which is a floor and not a judgement - nothing here
grades the prediction, and a prior that turns out wrong has done its job.

It is stored in ${PRIOR_PATH} and chained into the fetch ledger, so its position before the
first collected page is not editable afterwards, and neither is its text.

One per corpus, and only before the first page is collected. A prediction registered with
the evidence already in hand is not a prediction; write what you now believe in the brief,
where it is labelled as hindsight.
`);
  process.exit(0);
}

const entries = readLedger(root).entries;
const source = typeof flags.file === 'string'
  ? readText(resolve(root, flags.file), null)
  : (positional.join(' ').trim() || null);

if (source === null) {
  if (typeof flags.file === 'string') {
    process.stderr.write(`cannot read ${flags.file}\n`);
    process.exit(2);
  }
  const prior = readPrior(root, { entries });
  if (!prior.present) {
    process.stdout.write(`no prior is registered for this corpus.\n\n`
      + `That is allowed and it is silent at the gate. It also means nothing here can later\n`
      + `show what you expected before you knew - including to you.\n\n`
      + `  node research-kit/bin/prior.mjs "..."\n`);
    process.exit(0);
  }
  const scrapes = entries.filter((e) => e.op === 'scrape').length;
  process.stdout.write(`${heading('prior')}
registered  seq ${prior.entry.seq} of ${entries.length}, ${prior.scrapesBefore === 0 ? 'before anything was collected' : `AFTER ${prior.scrapesBefore} page(s) were collected`}
collected   ${scrapes} page(s) since
file        ${PRIOR_PATH}

${prior.text.trim()}
`);
  process.exit(prior.scrapesBefore ? 1 : 0);
}

try {
  const entry = registerPrior(root, source, { entries });
  process.stdout.write(`registered at seq ${entry.seq}, before any page was collected.\n`
    + `${PRIOR_PATH} is now chained: its text and its position are both fixed.\n\n`
    + `Collect next. Whatever comes back, this is what you thought first.\n`);
  process.exit(0);
} catch (err) {
  process.stderr.write(`${err.message}\n`);
  process.exit(2);
}
