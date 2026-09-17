// test/harness.mjs - the runner, and the project fixture.
//
// A TEST VERDICT IS EARNED, NOT PRINTED (ADR-0021). `runPending` is async and AWAITS
// every test, so `ok` is printed only once the assertions have settled and the returned
// failure count includes async failures.
//
// The old runner was synchronous and caught only a synchronous throw, so an async test
// printed `ok` the instant it returned its promise - before any assertion inside it had
// run - its failure arrived later as an unhandled rejection, and the runner's own
// `process.exit(0)` pre-empted even that.
//
// Each test is raced against a watchdog, because an awaited test that never settles
// would hang the suite printing nothing - the trap the commit gate fell into before it
// got one.

import fs from 'node:fs';
import crypto from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createEmptyProject, scaffoldProject, KIT_ROOT } from '../lib/scaffold.mjs';
import { appendFetch } from '../lib/provenance.mjs';
import { writeRaw } from '../lib/collect.mjs';
import { PATHS, resolve, writeText, appendLine, today } from '../lib/core.mjs';

export const TEST_TIMEOUT = Number(process.env.RESEARCH_KIT_TEST_TIMEOUT ?? 60_000);

const pending = [];
let currentFile = '';

/**
 * A capability this host cannot provide - a missing POSIX shell, an absent git.
 *
 * It is NOT a skip. A test that returns early on a missing prerequisite prints `ok`
 * having asserted nothing, which is the same false green ADR-0021 exists to prevent,
 * one layer up: the suite goes green on a host where the thing under test never ran.
 * An unsupported capability is reported under its own label, with the reason code, and
 * it BLOCKS - `runPending` counts it and the runner exits non-zero.
 */
export class Unsupported extends Error {
  constructor(code, reason) {
    super(`${code}: ${reason}`);
    this.name = 'Unsupported';
    this.code = code;
    this.reason = reason;
  }
}

/** `requireCapability(SH, 'SHELL-NOT-FOUND', 'no POSIX sh on this host')` */
export function requireCapability(value, code, reason) {
  if (value) return value;
  throw new Unsupported(code, reason);
}

export function test(name, fn) {
  pending.push({ name, fn, file: currentFile });
}

export function describe(file) {
  currentFile = file;
}

function watchdog(name, promise) {
  let timer;
  const bound = new Promise((_, reject) => {
    // Deliberately NOT unref'd: a test that never settles leaves the watchdog as the
    // only work in the loop, and an unref'd timer would let node exit 13 ("await never
    // settled") before it fired - a hang reported as a runtime error instead of as the
    // named test that hung. It is cleared in the `finally` below either way.
    timer = setTimeout(() => reject(new Error(`test timed out after ${TEST_TIMEOUT}ms`)), TEST_TIMEOUT);
  });
  return Promise.race([promise, bound]).finally(() => clearTimeout(timer));
}

/** Runs every queued test, awaiting each. Returns the failure count. */
export async function runPending({ log = (line) => process.stdout.write(`${line}\n`) } = {}) {
  let failures = 0;
  let passed = 0;
  const unsupported = [];
  for (const entry of pending.splice(0)) {
    const label = entry.file ? `${entry.file} > ${entry.name}` : entry.name;
    let settled;
    try {
      settled = entry.fn();
      // A timed-out test's promise is swallowed, so its late rejection cannot crash the
      // runner over a test already judged and attributed.
      if (settled && typeof settled.then === 'function') settled.catch(() => {});
      await watchdog(label, Promise.resolve(settled));
      passed += 1;
      log(`ok    ${label}`);
    } catch (err) {
      if (err instanceof Unsupported) {
        // Reported separately from a product assertion failure, and still blocking.
        unsupported.push({ label, code: err.code, reason: err.reason });
        log(`UNSUP ${label}\n        ${err.code}: ${err.reason}`);
        continue;
      }
      failures += 1;
      log(`FAIL  ${label}\n        ${String(err.message).split('\n').join('\n        ')}`);
    }
  }
  return { failures, passed, unsupported, blocking: failures + unsupported.length };
}

export { assert };

// ---------------------------------------------------------------- fixtures

export function tempDir(prefix = 'research-kit-') {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

/** The fixture and the scaffolder are the same call, which is what stops them drifting. */
export function makeProject(dir = tempDir(), { topic = 'Fixture topic', content = false } = {}) {
  if (content) scaffoldProject(dir, { topic, kit: KIT_ROOT });
  else createEmptyProject(dir);
  return dir;
}

/** A project that passes the gate: one unknown, one row, one capture, one ledger entry. */
export function makePassingProject(dir = tempDir(), { date = today() } = {}) {
  makeProject(dir, { content: true });

  const entry = writeRaw(dir, {
    url: 'https://example.invalid/docs/limits',
    title: 'Limits',
    markdown: `# Limits\n\n${'The free plan allows 10 requests per minute and includes 1,000 credits. '.repeat(30)}`,
    cmd: 'firecrawl scrape https://example.invalid/docs/limits --only-main-content --json',
    statusCode: 200,
    transport: 'firecrawl-cli',
    completeness: 'full',
  }, { date });

  appendFetch(dir, {
    op: 'scrape',
    url: entry.url,
    type: 'P',
    raw: entry.file,
    bodySha256: sha256Of(path.join(dir, ...entry.file.split('/'))),
    transport: 'firecrawl-cli',
    completeness: 'full',
    cmd: entry.command,
    at: `${date}T00:00:00.000Z`,
  });

  writeText(resolve(dir, PATHS.discovery), `# Discovery Contract - Fixture topic

## Build intent

A fixture project that passes its own gate, so a test can prove the gate says PASS for a
corpus that deserves it.

## Unknowns

| ID | Unknown | Why it blocks the build | Status | Evidence |
|---|---|---|---|---|
| U-1 | What does the free tier allow? | Sets the collector's budget | CLOSED | E-01: 10 requests per minute, 1,000 credits |
`);

  writeText(resolve(dir, PATHS.evidence), `# Evidence

| ID | Retrieved | Type | URL | Finding | Raw |
|---|---|---|---|---|---|
| E-01 | ${date} | P | ${entry.url} | The free plan allows 10 requests per minute and includes 1,000 credits. | ${entry.file} |
`);

  writeText(resolve(dir, PATHS.map), `# MAP - topic decomposition

## Topic

Fixture topic

## Subtopics

| ID | Subtopic | Why it matters | Status | Covered by |
|---|---|---|---|---|
| D-1 | Access model | Decides the collection design | COVERED | U-1 |
| D-2 | Auth and credentials | Who holds the key | COVERED | U-1 |
| D-3 | Rate limits and quotas | Caps every cadence | COVERED | U-1 |
| D-4 | ToS, licensing, legality of the intended use | A prohibition ends the design | DISMISSED | public docs, personal research, no redistribution |
| D-5 | Data schema and its stability | Shape drift | DISMISSED | captures are frozen point-in-time; there is no extraction layer |
| D-6 | Freshness and staleness | What staleness costs | DISMISSED | handled structurally by retrieval dates and --refresh-days |
| D-7 | Cost at expected volume | Decides viability | COVERED | U-1 |
| D-8 | Runtime and platform limits | Where this executes | DISMISSED | one runtime, one machine, fixed by the fixture |
| D-9 | Output obtainability | Load-bearing | COVERED | U-1 |
`);

  writeText(resolve(dir, PATHS.sources), `# Sources

| URL | Type | Title | Retrieved | Used for |
|---|---|---|---|---|
| ${entry.url} | P | Limits | ${date} | U-1 |
`);

  return dir;
}

function sha256Of(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

/** Append a line to a project file, for tests that need to break something. */
export function corrupt(dir, rel, transform) {
  const file = resolve(dir, rel);
  const text = fs.readFileSync(file, 'utf8');
  fs.writeFileSync(file, transform(text), 'utf8');
  return file;
}

export function here(url) {
  return path.dirname(fileURLToPath(url));
}

export { fs, path, os, appendLine, KIT_ROOT };
