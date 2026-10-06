#!/usr/bin/env node
// bin/install.mjs - deploy the kit, the skill and the skill set; role-aware next steps.

import path from 'node:path';
import { parseFlags, refuseUnknownFlags, checkFlagValues, writeFailure, spellCommand, tolerateClosedStdout } from '../lib/core.mjs';
import { deploy } from '../lib/installer.mjs';
import { machineRole, KIT_HOME } from '../lib/machine.mjs';
import { KIT_ROOT } from '../lib/scaffold.mjs';
import { heading } from '../lib/render.mjs';

// Before the first write: a reader that leaves early - `| head`, a pager quit - made the next
// write an unhandled 'error' event, a stack and exit 1 over a deploy that SUCCEEDED (found
// 2026-09-30, break-test). A refused stdout is named in words, exit 2, as selftest's is.
tolerateClosedStdout();

const { flags } = parseFlags(process.argv.slice(2));
refuseUnknownFlags(flags, ['help', 'dry-run', 'into']);
checkFlagValues(flags, { into: 'value' });

if (flags.help) {
  process.stdout.write(`install - copy the kit to ${KIT_HOME}, and the skill and the skill set to the personal skill root(s).

  node research-kit/bin/install.mjs [--dry-run] [--into <project>]

  --into <project>   also bind the skill and the skill set into that project's skill directory

Overwrites by default: a stale deployed copy silently defeats an update. Files a past
version shipped are pruned, because a copy-over deploy never removes anything. A folder
that holds other files and no kit is refused, and nothing in it is touched (ADR-0111).
`);
  process.exit(0);
}

let result;
try {
  result = deploy({
    from: KIT_ROOT,
    dryRun: Boolean(flags['dry-run']),
    into: typeof flags.into === 'string' ? path.resolve(flags.into) : '',
  });
} catch (err) {
  const why = writeFailure(err);
  if (!why) throw err;
  process.stderr.write(`${why} The deploy stopped part-way; fix that and run this again - it overwrites what is there.\n`);
  process.exit(2);
}

if (result.refused) {
  process.stderr.write(`install: refused - ${result.refused}\n`);
  process.exit(2);
}

if (result.dryRun) {
  process.stdout.write(`would deploy ${result.from}\n           -> ${result.to}\nwould prune: ${result.prune.join(', ') || '(nothing)'}\n`);
  for (const target of result.skillConflicts) process.stderr.write(`would leave ${target} as it is: a skill of the same name that is not the kit's\n`);
  process.exit(0);
}

process.stdout.write(`deployed ${result.files} files -> ${result.to}\n`);
if (result.pruned.length) process.stdout.write(`pruned ${result.pruned.length} retired file(s): ${result.pruned.join(', ')}\n`);
const setNames = new Set(result.skillSet);
for (const location of result.skills.filter((l) => !setNames.has(path.basename(l)))) process.stdout.write(`skill -> ${location}\n`);
const perRoot = new Map();
for (const l of result.skills.filter((s) => setNames.has(path.basename(s)))) perRoot.set(path.dirname(l), (perRoot.get(path.dirname(l)) ?? 0) + 1);
for (const [root, n] of perRoot) process.stdout.write(`skill set (${n} of ${result.skillSet.length}) -> ${root}\n`);
for (const target of result.skillConflicts) {
  process.stderr.write(`left ${target} as it is: a skill of the same name that is not the kit's. `
    + 'Rename or remove it, then run install again, to get the kit\'s.\n');
}
if (result.bound) process.stdout.write(`bound into project -> ${result.bound}${result.boundSet.length ? ` (+ ${result.boundSet.length} set skills beside it)` : ''}\n`);

// The next steps name the copy just installed, never the download this ran from: the operator
// may delete that as soon as this returns (found 2026-09-27).
const installed = (script, args = '') => spellCommand(path.join(result.to, 'bin', script), args);

const role = machineRole();
process.stdout.write(`${heading(`next steps (role=${role})`)}\n`);
if (role === 'builder') {
  process.stdout.write(`  1. ${installed('handoff.mjs')}     did the corpus arrive whole?
  2. read research/BRIEF.md               phase 2 starts there
  3. ${installed('preflight.mjs')}  confirm the gate still passes here

This machine does not collect. If a fact is missing, name it and let it be collected on
the collector machine.
`);
} else {
  process.stdout.write(`  1. ${installed('install-hooks.mjs')}   install the two gates
  2. firecrawl login                          or run with --transport http-keyless
  3. ${installed('doctor.mjs')}          stop at READY
`);
}
