#!/usr/bin/env node
// bin/doctor.mjs - name every problem and print the exact fix.
//
// It describes WHEREVER IT IS RUN. A clean report from the wrong directory is a clean
// report about the wrong project.

import { parseFlags } from '../lib/core.mjs';
import { runDoctor } from '../lib/doctor.mjs';
import { repairLedgerTail } from '../lib/provenance.mjs';
import { renderTable, heading } from '../lib/render.mjs';

const { flags } = parseFlags(process.argv.slice(2));
const root = process.cwd();

if (flags.help) {
  process.stdout.write(`doctor - machine + project + gate + chain health, in one report.

  node research-kit/bin/doctor.mjs [--json] [--fix-arity]

  --fix-arity   drop a trailing partial ledger line, and only that

Run it, fix what it says, run it again. Stop at READY.
`);
  process.exit(0);
}

if (flags['fix-arity']) {
  const repair = repairLedgerTail(root);
  process.stdout.write(repair.repaired
    ? `repaired: dropped the torn tail at line ${repair.line}\n`
    : `no repair made: ${repair.reason}\n`);
  if (!repair.repaired && repair.reason === 'chain-broken-before-tail') {
    process.stderr.write('the chain is broken before its tail - this is not a torn write, and no repair may invent a link\n');
    process.exit(1);
  }
}

const report = runDoctor(root);

if (flags.json) {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  process.exit(report.ok ? 0 : 1);
}

const order = { critical: 0, fail: 1, warn: 2, info: 3, pass: 4 };
const rows = [...report.findings].sort((a, b) => (order[a.severity] ?? 9) - (order[b.severity] ?? 9));

process.stdout.write(`${heading(`doctor - ${root}`)}\n`);
process.stdout.write(`${renderTable(rows, [
  { header: '', value: (r) => r.severity },
  { header: 'check', value: (r) => r.name },
  { header: 'detail', value: (r) => String(r.detail).split('\n')[0] },
])}\n`);

const fixes = rows.filter((r) => r.fix);
if (fixes.length) {
  process.stdout.write(`${heading('fixes')}\n`);
  for (const row of fixes) process.stdout.write(`  ${row.name}\n    ${row.fix}\n`);
}

const remedy = report.findings.find((r) => r.name === 'handoff-remedy');
if (remedy) process.stdout.write(`${heading('handoff')}\n${remedy.detail}\n`);

process.stdout.write(`\n${report.ok ? 'READY' : `${report.blocking.length} blocker(s)`}  [role=${report.role}]\n`);
process.exit(report.ok ? 0 : 1);
