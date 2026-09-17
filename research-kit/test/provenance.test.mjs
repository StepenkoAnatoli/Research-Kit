// The chain is tamper-EVIDENCE. These tests are the acceptance criteria of the
// hardening design, §8: a hand-typed capture, a post-hoc edit, and a removed line each
// fail the gate, by name.

import { test, describe, assert, makePassingProject, makeProject, corrupt, tempDir, fs, path } from './harness.mjs';
import { PATHS, resolve, sha256, writeText, readText } from '../lib/core.mjs';
import { appendFetch, verifyLedger, repairLedgerTail, rebuildLedger, withLock, entryHash, isLineEndingRewrite, hashText } from '../lib/provenance.mjs';
import { runPreflight } from '../lib/preflight.mjs';
import { readCorpus } from '../lib/corpus.mjs';

describe('provenance');

test('happy path: the chain verifies and preflight passes', () => {
  const dir = makePassingProject();
  const chain = verifyLedger(dir);
  assert.equal(chain.ok, true, chain.problems.map((p) => p.detail).join('; '));
  assert.equal(runPreflight(dir).pass, true);
});

test('a tampered capture fails body-unmodified', () => {
  const dir = makePassingProject();
  const capture = readCorpus(dir).captures.entries[0];
  corrupt(dir, capture.file, (text) => `${text}\nan annotation added after the fetch\n`);

  const chain = verifyLedger(dir);
  const problem = chain.problems.find((p) => p.rule === 'body-unmodified');
  assert.ok(problem, 'expected a body-unmodified problem');
  assert.equal(problem.kind, 'modified');

  const verdict = runPreflight(dir);
  assert.equal(verdict.pass, false);
  assert.ok(verdict.failures.some((finding) => finding.rule === 'body-unmodified'));
});

test('a CRLF rewrite is classified as line-endings, not tampering', () => {
  const dir = makePassingProject();
  const capture = readCorpus(dir).captures.entries[0];
  corrupt(dir, capture.file, (text) => text.replace(/\n/g, '\r\n'));

  const chain = verifyLedger(dir);
  const problem = chain.problems.find((p) => p.rule === 'body-unmodified');
  assert.ok(problem);
  assert.equal(problem.kind, 'line-endings', 'folding CRLF back must reproduce the recorded hash');
  assert.equal(chain.lineEndings.length, 1);
});

test('isLineEndingRewrite proves the rewrite rather than guessing it', () => {
  const lf = 'one\ntwo\nthree\n';
  const recorded = hashText(lf);
  assert.equal(isLineEndingRewrite(Buffer.from(lf.replace(/\n/g, '\r\n'), 'utf8'), recorded), true);
  assert.equal(isLineEndingRewrite(Buffer.from('one\r\ntwo\r\nfour\r\n', 'utf8'), recorded), false,
    'a genuinely different body must NOT be excused as a line-ending rewrite');
});

test('a removed ledger line fails chain-intact, naming the line', () => {
  const dir = makePassingProject();
  appendFetch(dir, { op: 'scrape', url: 'https://example.invalid/two', raw: '', bodySha256: '', transport: 'firecrawl-cli' });
  appendFetch(dir, { op: 'scrape', url: 'https://example.invalid/three', raw: '', bodySha256: '', transport: 'firecrawl-cli' });

  corrupt(dir, PATHS.ledger, (text) => {
    const lines = text.split('\n').filter(Boolean);
    lines.splice(1, 1);
    return `${lines.join('\n')}\n`;
  });

  const chain = verifyLedger(dir);
  const problem = chain.problems.find((p) => p.rule === 'seq' || p.rule === 'prev');
  assert.ok(problem, 'expected a chain problem');
  assert.ok(Number.isInteger(problem.line), 'the problem must name the line');
});

test('a hand-typed raw file with no ledger entry fails fetch-entry-exists', () => {
  const dir = makePassingProject();
  const file = `${PATHS.raw}/2026-01-01-typed-example-deadbeef.md`;
  writeText(resolve(dir, file), `---\nurl: https://example.invalid/typed\nretrieved: 2026-01-01\ncommand: \nstatusCode: 200\n---\n\n${'x'.repeat(400)}\n`);
  corrupt(dir, PATHS.evidence, (text) => `${text}| E-02 | 2026-01-01 | P | https://example.invalid/typed | A claim nobody fetched. | ${file} |\n`);

  const verdict = runPreflight(dir);
  assert.equal(verdict.pass, false);
  assert.ok(verdict.failures.some((finding) => finding.rule === 'fetch-entry-exists'),
    verdict.failures.map((finding) => `${finding.check}/${finding.rule}`).join(', '));
});

test('a torn tail is repairable; a chain broken in the middle is not', () => {
  const dir = makePassingProject();
  appendFetch(dir, { op: 'scrape', url: 'https://example.invalid/two', raw: '', bodySha256: '', transport: 'firecrawl-cli' });
  corrupt(dir, PATHS.ledger, (text) => `${text}{"seq":3,"at":"2026-01-0`);

  const repair = repairLedgerTail(dir);
  assert.equal(repair.repaired, true, repair.reason);
  assert.equal(verifyLedger(dir).ok, true);

  // Break the middle, then tear the tail. The repair must refuse.
  corrupt(dir, PATHS.ledger, (text) => {
    const lines = text.split('\n').filter(Boolean);
    const entry = JSON.parse(lines[0]);
    entry.url = 'https://example.invalid/rewritten';
    lines[0] = JSON.stringify(entry);
    return `${lines.join('\n')}\n{"seq":9,"at":"2026-0`;
  });
  const refused = repairLedgerTail(dir);
  assert.equal(refused.repaired, false);
  assert.equal(refused.reason, 'chain-broken-before-tail');
});

test('the entry hash omits entrySha256 and is order-independent', () => {
  const a = { seq: 1, at: 'x', op: 'scrape', url: 'u', prev: '0'.repeat(64) };
  const b = { prev: '0'.repeat(64), url: 'u', op: 'scrape', at: 'x', seq: 1 };
  assert.equal(entryHash(a), entryHash(b));
  assert.equal(entryHash({ ...a, entrySha256: 'ignored' }), entryHash(a));
});

test('rebuildLedger records per-entry migrations and a chained boundary', () => {
  const dir = makePassingProject();
  appendFetch(dir, { op: 'scrape', url: 'https://example.invalid/two', raw: '', bodySha256: '', transport: '' });

  const result = rebuildLedger(dir, (entry) => (entry.transport ? {} : { transport: 'agent page fetch' }), { note: 'stamp the transport' });
  assert.equal(result.rebuilt, true);
  assert.equal(result.changed, 1);

  const after = verifyLedger(dir);
  assert.equal(after.ok, true, after.problems.map((p) => p.detail).join('; '));
  const entries = readCorpus(dir).ledger.entries;
  const boundary = entries[entries.length - 1];
  assert.equal(boundary.op, 'migration');
  assert.ok(entries.some((entry) => Array.isArray(entry.migrations) && entry.migrations[0].fields.includes('transport')));
});

test('rebuildLedger refuses a chain broken for any other reason', () => {
  const dir = makePassingProject();
  corrupt(dir, PATHS.ledger, (text) => `${text}not json at all\n`);
  const result = rebuildLedger(dir, () => ({}));
  assert.equal(result.rebuilt, false);
  assert.equal(result.reason, 'chain-broken');
});

test('the exclusive section is reentrant in-process and releases only its own acquisition', () => {
  const dir = makeProject();
  const lock = resolve(dir, PATHS.lock);
  withLock(dir, () => {
    assert.equal(fs.existsSync(lock), true, 'the lock file must exist while it is held');
    withLock(dir, () => {
      assert.equal(fs.existsSync(lock), true, 'a reentrant acquisition must not release the outer one');
    });
    assert.equal(fs.existsSync(lock), true, 'the inner release must not drop the outer lock');
  });
  assert.equal(fs.existsSync(lock), false, 'the outer release removes the lock');
});

test('appendFetch derives seq and prev under the lock', () => {
  const dir = makeProject();
  const first = appendFetch(dir, { op: 'scrape', url: 'https://example.invalid/a' });
  const second = appendFetch(dir, { op: 'scrape', url: 'https://example.invalid/b' });
  assert.equal(first.seq, 1);
  assert.equal(second.seq, 2);
  assert.equal(second.prev, first.entrySha256);
  assert.equal(first.prev, '0'.repeat(64));
});

test('a failure is recorded as op:fail with the error text', () => {
  const dir = makeProject();
  const entry = appendFetch(dir, { op: 'fail', url: 'https://example.invalid/x', error: 'HTTP 429' });
  assert.equal(entry.op, 'fail');
  assert.equal(entry.error, 'HTTP 429');
  assert.equal(verifyLedger(dir).ok, true, 'a fail entry has no capture and must not break the chain');
});

test('the ledger is the collector\'s alone: the gate writes overrides, not chain entries', async () => {
  const dir = makePassingProject();
  const before = readCorpus(dir).ledger.entries.length;
  writeText(resolve(dir, PATHS.gateOff), 'off for this fixture\n');
  const { evaluate } = await import('../lib/gate.mjs');
  evaluate(dir, { gate: 'commit', stagedPaths: ['src/index.js'] });
  assert.equal(readCorpus(dir).ledger.entries.length, before, 'the gate must never append to the chain');
  assert.ok(readText(resolve(dir, PATHS.overrides)).includes('GATE_OFF'));
});
