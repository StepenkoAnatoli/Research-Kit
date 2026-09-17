#!/usr/bin/env node
// bin/handoff.mjs - the builder's FIRST command.
//
// It asks the arrival question and names whatever is missing. It cannot repair anything:
// the machine that asks cannot collect the missing bytes.

import { parseFlags } from '../lib/core.mjs';
import { verifyHandoff, handoffRemedy } from '../lib/handoff.mjs';
import { machineRole } from '../lib/machine.mjs';
import { heading } from '../lib/render.mjs';

const { flags } = parseFlags(process.argv.slice(2));
const root = process.cwd();

if (flags.help) {
  process.stdout.write(`handoff - did the corpus arrive whole?

  node research-kit/bin/handoff.mjs [--json]

Checks that research/raw/.fetches.jsonl is present and non-empty, that every capture an
evidence row names is on disk, and that the chain verifies. Exit 1 names what is missing,
and the remedy depends on the cause.
`);
  process.exit(0);
}

const report = verifyHandoff(root);

if (flags.json) {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  process.exit(report.ok ? 0 : 1);
}

if (report.ok) {
  process.stdout.write(`handoff OK - ${report.entries} ledger entries, every cited capture on disk, chain verifies.  [role=${machineRole()}]\n`);
  process.exit(0);
}

process.stdout.write(`${heading('handoff FAILED')}\n`);
for (const finding of report.findings.filter((f) => f.name !== 'handoff-remedy')) {
  process.stdout.write(`  ${finding.name}  ${finding.detail}\n`);
}
const remedy = handoffRemedy(report);
if (remedy) process.stdout.write(`\n${remedy}\n`);
process.exit(1);
