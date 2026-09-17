#!/usr/bin/env node
// hooks/edit-gate.mjs - the edit-time adapter (ADR-0012, E-05 semantics).
//
// Reads the runtime's PreToolUse payload on stdin and emits a permissionDecision. The
// wire keys (`hookEventName`, `hookSpecificOutput`, `permissionDecision`) are the
// RUNTIME's protocol, not the kit's vocabulary: the kit does not get to rename them.
//
// It exits 0 and emits the wrapper rather than exiting 2. Exit 2 routes the same as
// deny with stderr as the reason, but a hook whose JSON fails schema validation used to
// be treated as a non-blocking error before v2.1.214 - emitting the wrapper is the
// correct side of that fix. `hard-block` stays behind editGate.mode.

import fs from 'node:fs';
import path from 'node:path';
import { evaluate, isGated } from '../lib/gate.mjs';
import { loadConfig } from '../lib/machine.mjs';

function emit(decision, reason) {
  process.stdout.write(`${JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: decision,
      permissionDecisionReason: reason,
    },
  })}\n`);
  process.exit(0);
}

let payload = {};
try {
  payload = JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
} catch (err) {
  // A payload shape that changes upstream must not block the operator's work.
  process.stderr.write(`edit gate: unparsed payload (${err.message}) - allowing\n`);
  emit('allow', 'the edit gate could not read this payload and did not judge it');
}

const cwd = payload.cwd || payload.project_dir || process.cwd();
const root = path.resolve(cwd);

if (!isGated(root)) emit('allow', 'not a gated project');

let verdict;
try {
  verdict = evaluate(root, { gate: 'edit' });
} catch (err) {
  process.stderr.write(`edit gate: internal error (${err.message}) - allowing\n`);
  emit('allow', 'the edit gate failed and did not judge this call');
}

if (verdict.allow) emit('allow', verdict.reason);

const mode = loadConfig().editGate.mode;
if (mode === 'off') emit('allow', `the edit gate is off (editGate.mode=off); the verdict was: ${verdict.reason}`);

const lines = [
  'Research gate: the build is not ready.',
  '',
  verdict.reason,
  '',
  ...verdict.findings.slice(0, 5).map((f) => `  ${f.check}/${f.rule}: ${f.detail}`),
  '',
  `Close the unknown with fetched evidence, then: ${verdict.fix}`,
];
emit(mode === 'hard-block' ? 'deny' : 'ask', lines.join('\n'));
