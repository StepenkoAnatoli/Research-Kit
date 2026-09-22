#!/usr/bin/env node
// bin/brief.mjs - draft the phase-1 -> phase-2 handoff, and report the brief's state.

import { parseFlags, PATHS, refuseUnknownFlags } from '../lib/core.mjs';
import { renderBrief, briefState, JUDGED_SECTIONS, judgedSection } from '../lib/brief.mjs';
import { readCorpus } from '../lib/corpus.mjs';
import { runPreflight } from '../lib/preflight.mjs';

const { flags } = parseFlags(process.argv.slice(2));
refuseUnknownFlags(flags, ['force', 'help', 'state']);
const root = process.cwd();
const corpus = readCorpus(root);

if (flags.help) {
  process.stdout.write(`brief - write research/BRIEF.md, the only file phase 2 is required to read.

  node research-kit/bin/brief.mjs [--force] [--state]

  --state   report the brief's state (template | legacy | draft | authored) and exit
  --force   overwrite a draft or authored brief

Writing the brief is part of phase 1 and is not optional: a passing gate with no handoff
means the next agent re-researches everything you just verified.
`);
  process.exit(0);
}

if (flags.state) {
  const state = briefState(corpus.brief.text);
  process.stdout.write(`${PATHS.brief}: ${state}\n`);
  for (const key of JUDGED_SECTIONS) {
    const section = judgedSection(corpus.brief.text, key);
    process.stdout.write(`  ${key.padEnd(16)}${section?.answered ? 'answered' : 'still TODO'}\n`);
  }
  process.exit(0);
}

const verdict = runPreflight(root, { corpus });
if (!verdict.pass && !flags.force) {
  process.stdout.write(`the gate fails (${verdict.counts.fail} blocking finding(s)) - drafting anyway, but phase 2 does not start until it passes.\n\n`);
}

const result = renderBrief(root, { force: Boolean(flags.force), corpus, verdict });
if (!result.written) {
  process.stderr.write(`${result.reason}\n`);
  process.exit(1);
}

process.stdout.write(`wrote ${result.file} (${result.state})\n\nReview the TODO sections - the corpus cannot fill them - then hand this file to the builder.\n`);
