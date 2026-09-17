#!/usr/bin/env node
// bin/timeline.mjs - regenerate research/TIMELINE.md.

import { parseFlags } from '../lib/core.mjs';
import { renderTimeline } from '../lib/timeline.mjs';

const { flags } = parseFlags(process.argv.slice(2));

if (flags.help) {
  process.stdout.write(`timeline - regenerate the chronological review aid.

  node research-kit/bin/timeline.mjs

Derived, and deliberately outside the chain: never part of a gate decision.
`);
  process.exit(0);
}

const result = renderTimeline(process.cwd());
process.stdout.write(`wrote ${result.file} (${result.events} events)\n`);
