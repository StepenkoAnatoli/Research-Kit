#!/usr/bin/env node
// bin/gate.mjs - the CLI adapter over lib/gate.mjs's verdict.
//
// Exit codes: 0 allow, 1 block, 2 internal error.
// `--posture` answers the machine's posture without making any shell parse JSON:
//   0 allow / 1 a config that parses says fail-closed / 2 unreadable and resolved to blocking.

import fs from 'node:fs';
import { parseFlags, flagList, refuseUnknownFlags } from '../lib/core.mjs';
import { evaluate, splitPathList, stdinIsReadable, isGated } from '../lib/gate.mjs';
import { posture } from '../lib/machine.mjs';
import { recordDiagnostic } from '../lib/timeline.mjs';

const { flags } = parseFlags(process.argv.slice(2));
refuseUnknownFlags(flags, ['gate', 'help', 'json', 'posture', 'quiet', 'staged', 'staged-stdin']);

if (flags.help) {
  process.stdout.write(`gate - the verdict, for a hook.

  node research-kit/bin/gate.mjs [options]

  --gate commit|edit   which gate is asking (default commit)
  --staged-stdin       read the staged path list from stdin, as DATA on a pipe
  --staged <path>      one staged path (repeatable) - for callers with a short list
  --posture            print this machine's posture and exit with its code
  --json               machine-readable verdict
  --quiet              say nothing when the answer is allow

Exit codes: 0 allow, 1 block, 2 internal error.
--posture exits 0 allow / 1 a config that parses says fail-closed / 2 unreadable and
resolved to blocking - so no shell has to parse JSON.
`);
  process.exit(0);
}

if (flags.posture) {
  const state = posture();
  process.stdout.write(`${state.failOpen ? 'fail-open' : 'fail-closed'} (config ${state.configState})\n`);
  process.exit(state.exitCode);
}

const root = process.cwd();
const gate = flags.gate === 'edit' ? 'edit' : 'commit';

// Short-circuit on the gating predicate first: the edit gate pays node's startup on
// every tool call, and an ungated project must cost as little as possible.
if (!isGated(root)) {
  if (flags.json) process.stdout.write(`${JSON.stringify({ verdict: 'not-gated', allow: true })}\n`);
  process.exit(0);
}

let stagedPaths = null;
if (flags['staged-stdin']) {
  if (!stdinIsReadable()) {
    process.stderr.write('gate: --staged-stdin was given but stdin is a terminal - refusing to guess an empty staged set\n');
    process.exit(2);
  }
  let text = null;
  try {
    text = fs.readFileSync(0, 'utf8');
  } catch (err) {
    // "no paths" and "could not read the paths" must not both mean allow.
    process.stderr.write(`gate: could not read the staged path list from stdin (${err.message})\n`);
    process.exit(2);
  }
  stagedPaths = splitPathList(text);
  if (stagedPaths === null) {
    process.stderr.write('gate: the staged path list could not be read\n');
    process.exit(2);
  }
} else if (flags.staged !== undefined) {
  stagedPaths = flagList(flags.staged);
}

let verdict;
try {
  verdict = evaluate(root, { gate, stagedPaths });
} catch (err) {
  process.stderr.write(`gate: internal error - ${err.message}\n`);
  process.exit(2);
}

try {
  recordDiagnostic(root, { gate, verdict: verdict.verdict, staged: stagedPaths?.length ?? null });
} catch { /* a read-only checkout must not break the gate */ }

if (flags.json) {
  process.stdout.write(`${JSON.stringify({
    verdict: verdict.verdict,
    allow: verdict.allow,
    reason: verdict.reason,
    fix: verdict.fix,
    findings: verdict.findings.map(({ severity, check, rule, detail }) => ({ severity, check, rule, detail })),
  }, null, 2)}\n`);
  process.exit(verdict.allow ? 0 : 1);
}

if (verdict.verdict === 'override') {
  process.stdout.write(`research gate: OFF - ${verdict.reason}\n`);
  process.exit(0);
}
if (verdict.allow) {
  if (!flags.quiet) process.stdout.write(`research gate: allow - ${verdict.reason}\n`);
  process.exit(0);
}

process.stderr.write(`
research gate: BLOCKED - ${verdict.reason}

`);
for (const finding of verdict.findings.slice(0, 10)) {
  process.stderr.write(`  ${finding.severity}  ${finding.check}/${finding.rule}  ${finding.detail}\n`);
}
process.stderr.write(`
Fix: ${verdict.fix}

Phase 1 is not done until preflight prints PASS. Overrides, all recorded:
  git commit --no-verify        the native escape hatch
  research/GATE_OFF             turn the gate off for this repository, deliberately
`);
process.exit(1);
