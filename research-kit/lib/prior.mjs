// prior.mjs - the registered prior: what you expected BEFORE you collected.
//
// The habit this replaces was mine and it was unenforced. Three corpora in this repository
// carry a prediction written before collection, and each one is worth more than the finding
// it precedes: the EUDR prior was a year wrong on both dates, which is the only reason that
// brief can say the corpus supplied something the reviewer could not have. The Tavily prior
// held, which is the only reason that brief can say so without it reading as a boast.
//
// Unenforced, the habit has exactly one failure mode, and it is not forgetting. It is
// writing the prediction afterwards, once the answer is known, and remembering it as
// foresight. Nobody has to be dishonest for that to happen - "I thought that" is a memory,
// and memories reshape themselves around what turned out to be true.
//
// So the guarantee here is ORDERING, and it is cryptographic rather than procedural:
//
//   1. The prior text lives in `research/PRIOR.md`.
//   2. Registering it appends a `op: 'prior'` entry to the hash-chained fetch ledger,
//      carrying the file's sha256 in `bodySha256` and its path in `raw`.
//   3. Because the ledger is chained, that entry's position is not editable. Every later
//      entry's `prev` is the previous entry's `entrySha256`, so moving the prior after a
//      scrape - or inserting one at the front after the fact - rewrites every hash that
//      follows it, and `provenance/chain-intact` says so.
//   4. Because `bodySha256` names the file, EDITING the prediction after collecting breaks
//      `provenance/body-unmodified` through the machinery captures already use. A prior you
//      can revise once you know the answer is not a prior.
//
// `registerPrior` refuses after the first scrape for the same reason, but that refusal is
// only a courtesy: the ordering is what the gate verifies, and the gate does not trust this
// module to have been used.
//
// WHAT IS NOT CHECKED, deliberately (ADR-0013). Nothing here grades the prediction. Not
// whether it was specific, not whether it was reasonable, not whether it turned out right -
// a prior that was wrong is doing its job, and a check that preferred correct predictions
// would quietly teach the opposite of the habit. The one content rule is a length floor,
// and it is a floor rather than a judgement: `MIN_PRIOR` characters is roughly the room
// needed to say what you expect and what you know you do not know, and it stops `"fine"`
// from being a registered prediction. It cannot stop `"fine, and here are ninety more
// characters of nothing"`, and it is not meant to.

import fs from 'node:fs';
import { resolve, exists, readText, writeText, sha256 } from './core.mjs';
import { readLedger } from './corpus.mjs';
import { appendFetch } from './provenance.mjs';

/** The ledger op that marks a registered prior. */
export const PRIOR_OP = 'prior';

/** Where the prediction lives. Outside `research/raw/`, so it is never read as a capture. */
export const PRIOR_PATH = 'research/PRIOR.md';

/**
 * The floor that stops a one-word prediction from counting. Room for what you expect and
 * what you admit you cannot know - not a judgement that you used it well.
 */
export const MIN_PRIOR = 80;

/** The `op: 'prior'` entry, or null. The first one: a second is reported, never preferred. */
export function priorOf(entries = []) {
  return entries.find((entry) => entry?.op === PRIOR_OP) ?? null;
}

/**
 * The registered prior and its standing in the chain. `scrapesBefore` is the whole point:
 * anything above zero means the prediction was registered after evidence was already in.
 */
export function readPrior(root, { entries = null } = {}) {
  const abs = resolve(root, PRIOR_PATH);
  const text = readText(abs, null);
  const list = entries ?? [];
  const entry = priorOf(list);
  const scrapesBefore = entry
    ? list.filter((e) => e.op === 'scrape' && (e.seq ?? 0) < (entry.seq ?? 0)).length
    : 0;
  return {
    present: Boolean(entry),
    onDisk: text !== null,
    text: text ?? '',
    entry,
    scrapesBefore,
    duplicates: list.filter((e) => e?.op === PRIOR_OP).length,
  };
}

/** Why `registerPrior` refused, or null if it would proceed. Exported so the CLI and the tests agree. */
export function priorRefusal(root, text, { entries = [] } = {}) {
  const body = String(text ?? '').trim();
  if (body.length < MIN_PRIOR) {
    return `a prior of ${body.length} character(s) is not a prediction - write at least ${MIN_PRIOR}: `
      + 'what you expect to find, and what you know you cannot know yet. Being wrong later is the point; '
      + 'being unfalsifiable is not';
  }
  if (priorOf(entries)) {
    return 'this corpus already has a registered prior, and a prior you can re-register is a prior you can '
      + `retry until it is right. Read the one on record: node research-kit/bin/prior.mjs`;
  }
  const scrapes = entries.filter((e) => e.op === 'scrape').length;
  if (scrapes) {
    return `${scrapes} page(s) have already been collected here. A prediction registered after the evidence `
      + 'is not a prediction, and the ledger would show the order to anyone who looked. Record what you now '
      + 'believe in the brief instead, where it is honestly labelled';
  }
  if (exists(resolve(root, PRIOR_PATH))) {
    return `${PRIOR_PATH} exists but no ledger entry registers it. Either the file was written by hand - in `
      + 'which case nothing dates it - or a registration was interrupted. Move it aside and register again';
  }
  return null;
}

/**
 * Write the prediction and chain it, in that order: the hash must cover a file that exists.
 * Throws the refusal rather than returning it, because every caller here must stop.
 */
export function registerPrior(root, text, { at = null, entries = null } = {}) {
  const list = entries ?? readLedger(root).entries;
  const refusal = priorRefusal(root, text, { entries: list });
  if (refusal) {
    const err = new Error(refusal);
    err.code = 'PRIOR_REFUSED';
    throw err;
  }
  const body = `${String(text).trim()}\n`;
  const abs = resolve(root, PRIOR_PATH);
  writeText(abs, body);
  try {
    return appendFetch(root, {
      op: PRIOR_OP,
      raw: PRIOR_PATH,
      bodySha256: sha256(Buffer.from(body, 'utf8')),
      completeness: 'unspecified',
      ...(at ? { at } : {}),
    });
  } catch (err) {
    // The file without the entry is the state `priorRefusal` reports as un-registered, and
    // leaving it behind would block a retry on a corpus that never got a prior at all. The
    // ledger refuses for real reasons - a torn tail, a damaged chain - so this has to unwind
    // rather than leave a half-registration that reads like hand-written prose.
    try { fs.rmSync(abs, { force: true }); } catch { /* the thrown refusal is the report */ }
    throw err;
  }
}
