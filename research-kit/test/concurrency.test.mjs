// F14, F13 and F12's residual — the collection critical section, and the lease that
// decides who holds it (ADR-0025).

import { spawnSync } from 'node:child_process';
import os from 'node:os';
import { pathToFileURL } from 'node:url';
import { test, describe, assert, makeProject, makePassingProject, tempDir, fs, path, KIT_ROOT } from './harness.mjs';
import { PATHS, resolve, readText, writeText } from '../lib/core.mjs';
import { readCorpus, readLedger } from '../lib/corpus.mjs';
import { repairLedgerTail } from '../lib/provenance.mjs';
import { withLock, holdsLock, appendFetch, verifyLedger, lockRecoverable } from '../lib/provenance.mjs';
import { collectOne } from '../lib/collect.mjs';

describe('concurrency');

const PAGE = 'A documented limit of 10 requests per minute applies to the free plan. '.repeat(20);
const adapter = (url) => ({ ok: true, url, title: 'T', markdown: PAGE, statusCode: 200, transport: 'stub', completeness: 'full', cmd: 'stub' });

// --- F14: the whole durable operation is inside one boundary -----------------------

test('F14: collectOne holds the exclusive section across the ENTIRE operation', () => {
  const dir = makeProject();
  const corpus = readCorpus(dir);
  let heldDuringFetch = false;

  collectOne(dir, 'https://x.invalid/a', {
    corpus,
    runScrape: (url) => {
      // The adapter call is the slow part. If the section is not held here, another
      // collector can pick the same filename and the same E-## while we are away.
      heldDuringFetch = holdsLock(dir);
      return adapter(url);
    },
  });

  assert.equal(heldDuringFetch, true, 'a ledger-only lock leaves the capture write and the row updates racing');
  assert.equal(holdsLock(dir), false, 'and it is released afterwards');
});

test('F14: the cache is re-read INSIDE the section, so a queued URL is not paid for twice', () => {
  const dir = makeProject();
  // One collector finishes while another holds a corpus snapshot from before it did.
  const first = readCorpus(dir);
  const second = readCorpus(dir);
  collectOne(dir, 'https://x.invalid/a', { corpus: first, runScrape: adapter });

  let fetched = 0;
  const outcome = collectOne(dir, 'https://x.invalid/a', {
    corpus: second, // stale: it was read before the first collection existed
    runScrape: (url) => { fetched += 1; return adapter(url); },
  });

  assert.equal(outcome.status, 'cached', 'the decision must be made from disk, under the lock');
  assert.equal(fetched, 0, 'every re-fetch here is a credit spent on a page already collected');
});

test('F14: ids are allocated from the table on disk, so two collectors cannot collide', () => {
  const dir = makeProject();
  const stale = readCorpus(dir);
  collectOne(dir, 'https://x.invalid/a', { corpus: readCorpus(dir), runScrape: adapter });
  collectOne(dir, 'https://x.invalid/b', { corpus: stale, runScrape: adapter });

  const ids = readCorpus(dir).evidence.map((row) => row.id);
  assert.deepEqual(ids, ['E-01', 'E-02'], 'a duplicated E-## silently changes what every citation to it means');
  assert.equal(new Set(ids).size, ids.length);
});

test('F14: a dry run takes no lock at all - it decides and writes nothing', () => {
  const dir = makeProject();
  const corpus = readCorpus(dir);
  collectOne(dir, 'https://x.invalid/a', { corpus, runScrape: adapter, dryRun: true });
  assert.equal(fs.existsSync(resolve(dir, PATHS.lock)), false);
});

test('F14: two collectors in separate PROCESSES serialise, and neither loses its row', () => {
  const dir = makeProject();
  const child = (url) => `
import { readCorpus } from ${JSON.stringify(pathToFileURL(path.join(KIT_ROOT, 'lib', 'corpus.mjs')).href)};
import { collectOne } from ${JSON.stringify(pathToFileURL(path.join(KIT_ROOT, 'lib', 'collect.mjs')).href)};
const corpus = readCorpus(${JSON.stringify(dir)});
collectOne(${JSON.stringify(dir)}, ${JSON.stringify(url)}, {
  corpus,
  runScrape: (u) => {
    // Hold the section long enough that the other process must actually wait.
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 400);
    return { ok: true, url: u, title: 'T', markdown: ${JSON.stringify(PAGE)}, statusCode: 200, transport: 'stub', completeness: 'full', cmd: 'stub' };
  },
});
`;
  const scratch = tempDir('research-kit-conc-');
  const files = ['a', 'b'].map((name) => {
    const file = path.join(scratch, `${name}.mjs`);
    writeText(file, child(`https://x.invalid/${name}`));
    return file;
  });

  const running = files.map((file) => spawnSync(process.execPath, [file], { encoding: 'utf8', timeout: 60_000 }));
  for (const result of running) assert.equal(result.status, 0, result.stderr);

  const after = readCorpus(dir);
  assert.equal(after.evidence.length, 2, 'both rows survived - neither read-modify-write clobbered the other');
  assert.deepEqual(after.evidence.map((r) => r.id).sort(), ['E-01', 'E-02']);
  assert.equal(after.captures.entries.length, 2);
  assert.equal(verifyLedger(dir).ok, true, 'and the chain still verifies');
});

// --- F13: a lease, not an age -----------------------------------------------------

test('F13: a LIVE holder is never recoverable, however old its lock is', () => {
  const dir = makeProject();
  const lock = resolve(dir, PATHS.lock);
  const holder = { pid: process.pid, host: os.hostname(), nonce: 'mine', at: new Date().toISOString() };
  writeText(lock, JSON.stringify(holder));

  // Backdate it far past any bound a lease would have used. A run that takes an hour is
  // a long run, not a crash, and evicting it is how two collectors end up interleaved.
  const ancient = new Date(Date.now() - 6 * 60 * 60_000);
  fs.utimesSync(lock, ancient, ancient);

  const verdict = lockRecoverable(lock, holder);
  assert.equal(verdict.recoverable, false, 'the holder still exists - age says nothing about that');
  assert.match(verdict.why, /is alive/);
  fs.rmSync(lock);
});

test('F13: the section is held for the WHOLE of a slow call, with no heartbeat to miss', () => {
  const dir = makeProject();
  const lock = resolve(dir, PATHS.lock);
  withLock(dir, () => {
    // The collector is synchronous, so the event loop is blocked here. A renewal timer
    // could not fire during exactly this stretch - which is why liveness, not renewal,
    // is what decides.
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 300);
    assert.equal(fs.existsSync(lock), true);
    assert.equal(lockRecoverable(lock, JSON.parse(readText(lock))).recoverable, false);
  });
  assert.equal(fs.existsSync(lock), false);
});

test('F13: a holder on another host is waited for, not broken - we cannot ask about it', () => {
  const dir = makeProject();
  const lock = resolve(dir, PATHS.lock);
  const foreign = { pid: 1234, host: 'some-other-box', nonce: 'theirs', at: new Date().toISOString() };
  writeText(lock, JSON.stringify(foreign));

  assert.equal(lockRecoverable(lock, foreign).recoverable, false, 'a pid on another machine means nothing here');

  const old = new Date(Date.now() - 30 * 60_000);
  fs.utimesSync(lock, old, old);
  assert.equal(lockRecoverable(lock, foreign).recoverable, true, 'but it cannot hold the section forever either');
  fs.rmSync(lock);
});

test('F13: a lock whose process is gone is recovered, not waited on', () => {
  const dir = makeProject();
  const lock = resolve(dir, PATHS.lock);
  // A holder that crashed: a plausible file naming a pid that does not exist.
  writeText(lock, JSON.stringify({ pid: 999_999, host: os.hostname(), nonce: 'dead', at: new Date().toISOString() }));

  let entered = false;
  withLock(dir, () => { entered = true; });
  assert.equal(entered, true, 'age alone would have made this wait out the full timeout');
});

test('F13: an UNIDENTIFIABLE holder reaches the staleness test instead of blocking forever', () => {
  const dir = makeProject();
  const lock = resolve(dir, PATHS.lock);
  writeText(lock, ''); // the window between create and write, or a crash that left a stub
  const old = new Date(Date.now() - 60_000);
  fs.utimesSync(lock, old, old);

  let entered = false;
  withLock(dir, () => { entered = true; });
  assert.equal(entered, true, 'the branch that could not read a pid used to skip the age check entirely');
});

test('F13: release removes only this acquisition', () => {
  const dir = makeProject();
  const lock = resolve(dir, PATHS.lock);
  withLock(dir, () => {
    // Somebody else's lock replaced ours mid-section (the pathological case).
    writeText(lock, JSON.stringify({ pid: process.pid, host: 'elsewhere', nonce: 'theirs', at: new Date().toISOString() }));
  });
  assert.equal(fs.existsSync(lock), true, "a release must not delete a lock it does not hold");
  fs.rmSync(lock);
});

// --- F12 residual: never append onto a damaged chain -------------------------------

test('F12: appendFetch REFUSES a torn tail instead of welding a valid entry to it', () => {
  const dir = makePassingProject();
  const file = resolve(dir, PATHS.ledger);
  writeText(file, `${readText(file)}{"seq":2,"at":"2026-01-0`);

  assert.throws(
    () => appendFetch(dir, { op: 'scrape', url: 'https://x.invalid/paid-for' }),
    (err) => err.code === 'LEDGER_TORN_TAIL' || err.code === 'LEDGER_DAMAGED',
    'appending here makes the torn line unrecoverable and loses the fetch it recorded',
  );
  assert.doesNotMatch(readText(file), /paid-for/, 'nothing was written');
});

test('F12: a collection refuses before it spends, when the chain cannot record it', () => {
  const dir = makePassingProject();
  const file = resolve(dir, PATHS.ledger);
  writeText(file, `${readText(file)}not json at all\n`);

  let fetched = 0;
  assert.throws(() => collectOne(dir, 'https://x.invalid/new', {
    corpus: readCorpus(dir),
    runScrape: (url) => { fetched += 1; return adapter(url); },
  }), /damaged chain|never finished/);
  assert.equal(fetched, 1, 'the adapter ran once; the refusal is at the record, which is where it can still be repaired');
});

test('F12: after the documented repair, collection resumes', () => {
  const dir = makePassingProject();
  const file = resolve(dir, PATHS.ledger);
  writeText(file, `${readText(file)}{"seq":2,"at":"2026-01-0`);

  assert.equal(repairLedgerTail(dir).repaired, true);

  const outcome = collectOne(dir, 'https://x.invalid/after', { corpus: readCorpus(dir), runScrape: adapter });
  assert.equal(outcome.status, 'collected');
  assert.equal(verifyLedger(dir).ok, true);
  assert.equal(readLedger(dir).entries.length, 2);
});
