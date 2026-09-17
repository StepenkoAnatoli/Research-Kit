#!/usr/bin/env node
// bin/new-project.mjs - scaffold the canonical project shape (ADR-0001).
//
// Structure is always repaired; content is never clobbered without --force, because
// evidence is irreplaceable.

import path from 'node:path';
import { parseFlags } from '../lib/core.mjs';
import { scaffoldProject, LAYOUT, GATE_MARKERS, validateProject } from '../lib/scaffold.mjs';
import { KIT_HOME } from '../lib/machine.mjs';

const { flags, positional } = parseFlags(process.argv.slice(2));

if (flags.help) {
  process.stdout.write(`new-project - write the canonical project shape into a directory.

  node research-kit/bin/new-project.mjs [dir] --topic "<topic>" [--force]

  --layout   print the ${LAYOUT.length} entries of the canonical shape and exit
  --force    overwrite existing content (structure is always repaired anyway)

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
const result = scaffoldProject(dir, {
  topic: typeof flags.topic === 'string' ? flags.topic : 'Untitled topic',
  kit: KIT_HOME,
  force: Boolean(flags.force),
});

process.stdout.write(`scaffolded ${result.dir}\n  wrote   ${result.written.length}\n  kept    ${result.skipped.length}\n  repaired ${result.repaired.length}\n`);

const shape = validateProject(dir);
for (const finding of shape.findings) process.stdout.write(`  ${finding.severity}  ${finding.detail}\n`);

process.stdout.write(`
Next:
  1. node research-kit/bin/decompose.mjs --topic "<topic>"   draft the map
  2. fill research/DISCOVERY.md's unknowns FROM that map
  3. node research-kit/bin/research.mjs                       collect
  4. node research-kit/bin/preflight.mjs                      do not build until PASS
`);
process.exit(shape.ok ? 0 : 1);
