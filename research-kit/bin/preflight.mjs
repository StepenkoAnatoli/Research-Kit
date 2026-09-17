#!/usr/bin/env node
// bin/preflight.mjs - the verdict, for a person.
//
// The project is the CURRENT WORKING DIRECTORY. This CLI takes no project argument and
// never will: the gate resolves one project from where it stands, and a second root is
// a second thing to be wrong about.

import { parseFlags, flagList } from '../lib/core.mjs';
import { runPreflight, fixCommand } from '../lib/preflight.mjs';
import { CHECKS, CHECK_NAMES } from '../lib/checks.mjs';
import { isGated } from '../lib/gate.mjs';
import { renderFindings, heading } from '../lib/render.mjs';

const { flags } = parseFlags(process.argv.slice(2));

if (flags.help) {
  process.stdout.write(`preflight - does this project's evidence support a build?

  node research-kit/bin/preflight.mjs [options]

  --checks           list the check registry and exit
  --check <name>     run one check (repeatable)
  --strict           promote every warning to a failure
  --json             machine-readable verdict
  --quiet            print only the verdict line
  --show-pass        include passing checks in the table

The project is the current working directory.
`);
  process.exit(0);
}

if (flags.checks) {
  for (const check of CHECKS) process.stdout.write(`${check.name.padEnd(22)}${check.about}\n`);
  process.exit(0);
}

const root = process.cwd();
const only = flagList(flags.check);

let verdict;
try {
  verdict = runPreflight(root, { only, strict: Boolean(flags.strict) });
} catch (err) {
  if (err.code === 'UNKNOWN_CHECK') { process.stderr.write(`${err.message}\n`); process.exit(2); }
  throw err;
}

if (flags.json) {
  process.stdout.write(`${JSON.stringify({
    pass: verdict.pass,
    counts: verdict.counts,
    evidencePolicy: verdict.evidencePolicy,
    findings: verdict.findings.map(({ severity, check, rule, detail }) => ({ severity, check, rule, detail })),
  }, null, 2)}\n`);
  process.exit(verdict.pass ? 0 : 1);
}

if (!isGated(root)) {
  process.stdout.write('not gated - this project holds none of the four gate markers, so there is nothing to judge.\n');
  process.exit(0);
}

if (!flags.quiet) {
  const table = renderFindings(verdict.findings, { showPass: Boolean(flags['show-pass']) });
  if (table) process.stdout.write(`${table}\n`);
}

const summary = `${verdict.pass ? 'PASS' : 'FAIL'}  ${verdict.counts.fail} blocking, ${verdict.counts.warn} warning(s), ${verdict.counts.pass} passing  [evidencePolicy=${verdict.evidencePolicy}]`;
process.stdout.write(`${heading('verdict')}\n${summary}\n`);

if (!verdict.pass) {
  process.stdout.write(`\nDo not start building. Each failing line names the unknown that is unproven.\nRe-run after collecting: ${fixCommand()}\n`);
}
process.exit(verdict.pass ? 0 : 1);
