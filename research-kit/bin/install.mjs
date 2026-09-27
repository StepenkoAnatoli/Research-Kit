#!/usr/bin/env node
// bin/install.mjs - deploy the kit and the skill; role-aware next steps.

import path from 'node:path';
import { parseFlags } from '../lib/core.mjs';
import { deploy } from '../lib/installer.mjs';
import { machineRole, KIT_HOME } from '../lib/machine.mjs';
import { KIT_ROOT } from '../lib/scaffold.mjs';
import { heading } from '../lib/render.mjs';

import { spellCommand } from '../lib/core.mjs';
const { flags } = parseFlags(process.argv.slice(2));

if (flags.help) {
  process.stdout.write(`install - copy the kit to ${KIT_HOME} and the skill to the personal skill root(s).

  node research-kit/bin/install.mjs [--dry-run] [--into <project>]

  --into <project>   also bind the skill into that project's skill directory

Overwrites by default: a stale deployed copy silently defeats an update. Files a past
version shipped are pruned, because a copy-over deploy never removes anything.
`);
  process.exit(0);
}

const result = deploy({
  from: KIT_ROOT,
  dryRun: Boolean(flags['dry-run']),
  into: typeof flags.into === 'string' ? path.resolve(flags.into) : '',
});

if (result.dryRun) {
  process.stdout.write(`would deploy ${result.from}\n           -> ${result.to}\nwould prune: ${result.prune.join(', ') || '(nothing)'}\n`);
  process.exit(0);
}

process.stdout.write(`deployed ${result.files} files -> ${result.to}\n`);
if (result.pruned.length) process.stdout.write(`pruned ${result.pruned.length} retired file(s): ${result.pruned.join(', ')}\n`);
for (const location of result.skills) process.stdout.write(`skill -> ${location}\n`);
if (result.bound) process.stdout.write(`bound into project -> ${result.bound}\n`);

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
