#!/usr/bin/env node
// bin/new-project.mjs - scaffold the canonical project shape (ADR-0001).
//
// Structure is always repaired; content is never clobbered without --force, because
// evidence is irreplaceable.

import path from 'node:path';
import { parseFlags, kitCommand, refuseUnknownFlags } from '../lib/core.mjs';
import { scaffoldProject, LAYOUT, GATE_MARKERS, validateProject } from '../lib/scaffold.mjs';
import { KIT_HOME } from '../lib/machine.mjs';

const { flags, positional } = parseFlags(process.argv.slice(2));
refuseUnknownFlags(flags, ['help', 'topic', 'force', 'kit', 'layout']);

if (flags.help) {
  process.stdout.write(`new-project - write the canonical project shape into a directory.

  node research-kit/bin/new-project.mjs [dir] --topic "<topic>" [--force]

  --layout   print the ${LAYOUT.length} entries of the canonical shape and exit
  --force    overwrite existing content (structure is always repaired anyway)
  --kit <p>  how the project should SPELL the kit's location, for a project that will
             be read somewhere else. Default: this machine's deployed kit. Pass
             '$HOME/.agents/research-kit' when the project will travel - single-quoted, so
             the shell you type it in leaves it for the reader's shell to expand.

The four gate markers: ${GATE_MARKERS.join(', ')}
`);
  process.exit(0);
}

if (flags.layout) {
  for (const entry of LAYOUT) {
    process.stdout.write(`${entry.gating ? 'gate ' : '     '}${entry.dir ? 'dir  ' : 'file '}${entry.path}\n`);
  }
  process.exit(0);
}

const dir = path.resolve(positional[0] ?? process.cwd());
// `--kit` exists because a scaffolded project can OUTLIVE THE MACHINE THAT MADE IT.
//
// KIT_HOME is this machine's deployed kit, which is right for a project somebody works in
// locally and wrong for one that travels. The Actions collector scaffolds on a runner, so
// every corpus it returned carried `C:/Users/runneradmin/.agents/research-kit` in its
// AGENTS.md - a path that existed on nothing but that runner, for the ten minutes it
// lived, and that the recipient could only be confused by.
//
// Found by reading a real returned corpus, not by reasoning about the code.
const result = scaffoldProject(dir, {
  topic: typeof flags.topic === 'string' ? flags.topic : 'Untitled topic',
  kit: typeof flags.kit === 'string' && flags.kit.trim() ? flags.kit.trim() : KIT_HOME,
  force: Boolean(flags.force),
});

process.stdout.write(`scaffolded ${result.dir}\n  wrote   ${result.written.length}\n  kept    ${result.skipped.length}\n  repaired ${result.repaired.length}\n`);

const shape = validateProject(dir);
for (const finding of shape.findings) process.stdout.write(`  ${finding.severity}  ${finding.detail}\n`);

// The next steps name THIS kit by its full path, and the folder to run them from. They
// said "node research-kit/bin/decompose.mjs", which exists only at the repository root -
// the one place a project must not be - so from a project folder the first command
// crashed with MODULE_NOT_FOUND (found 2026-09-27, following the README on a fresh machine).
// Not the --kit spelling: that is for a project that travels; this is for the person at
// this terminal, now.
process.stdout.write(`
Next, from ${dir}:
  1. ${kitCommand('decompose.mjs', '--topic "<topic>"')}   draft the map
  2. fill research/DISCOVERY.md's unknowns FROM that map
  3. write the queries and urls that close them into research/plan.json
  4. ${kitCommand('research.mjs')}   collect
  5. ${kitCommand('preflight.mjs')}   do not build until PASS
`);
process.exit(shape.ok ? 0 : 1);
