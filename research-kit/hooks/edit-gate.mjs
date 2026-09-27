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
import { execFileSync } from 'node:child_process';
import { evaluate, isGated, isPhaseOneEdit } from '../lib/gate.mjs';
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

const cwd = path.resolve(payload.cwd || payload.project_dir || process.cwd());

// A cwd in a subfolder is judged by the repository it is in: that top level is where git runs
// the commit gate. Looking only at the cwd found no markers in src/ and allowed every edit
// there as "not a gated project" (found 2026-09-27). Not a search: git names the one
// repository this directory belongs to, and outside a repository the cwd is all there is.
function projectRoot(dir) {
  if (isGated(dir)) return dir;
  try {
    const top = execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 5000 }).trim();
    // git names the top level by its real path (macOS: /private/tmp for /tmp). Walk up from
    // the cwd to the same directory instead, so the root keeps the spelling the targets use.
    const real = (p) => { try { return fs.realpathSync(p); } catch { return path.resolve(p); } };
    for (let d = dir; ; d = path.dirname(d)) {
      if (real(d) === real(top)) return isGated(d) ? d : dir;
      if (path.dirname(d) === d) break;
    }
  } catch { /* not a repository, or no git: the cwd is all there is */ }
  return dir;
}
const root = projectRoot(cwd);

if (!isGated(root)) emit('allow', 'not a gated project');

// The file this call edits. Every target must be phase-1 work to pass unjudged; a call that
// names no file is judged as it always was.
const input = payload.tool_input ?? {};
const targets = [input.file_path, input.notebook_path].filter((t) => typeof t === 'string' && t);
if (targets.length && targets.every((t) => isPhaseOneEdit(root, path.resolve(cwd, t)))) {
  emit('allow', 'phase-1 work: research/ and the project\'s own scaffolding are what phase 1 edits');
}

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
