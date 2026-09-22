// The mirror finding, tested against the real pair that exposed the hole.
//
// `lira.epac.to` republishes Node's single-executable documentation six major versions
// behind `nodejs.org`. Before this check existed, citing both for one unknown reported
// `independent` - the best grade in the registry - for one witness plus a staleness
// `freshness` cannot see.
//
// These are UNIT tests of a new module, so they could not have been run against the old
// code and no claim is made that they were. The regression - that the same two captures
// used to grade `independent` and now grade `mirror` - is proven at the check level, in
// checks.test.mjs, which is where the old behaviour actually existed.

import { fileURLToPath } from 'node:url';
import { test, describe, assert, fs, path } from './harness.mjs';

import { parseCapture } from '../lib/corpus.mjs';
import {
  sketch, similarity, shingles, documentGroups, isMirror, closestPair,
  MIRROR_THRESHOLD, MIN_SHINGLES,
} from '../lib/similarity.mjs';

describe('similarity');

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '..', '..');
const seaRaw = path.join(repo, 'docs', 'decisions', '2026-09-21-sea-assets', 'research', 'raw');

function body(dir, needle) {
  const name = fs.readdirSync(dir).find((f) => f.includes(needle) && f.endsWith('.md'));
  assert.ok(name, `no capture matching ${needle} in ${dir}`);
  return parseCapture(fs.readFileSync(path.join(dir, name), 'utf8')).body;
}

function exactJaccard(a, b) {
  const x = shingles(a);
  const y = shingles(b);
  let shared = 0;
  const [small, large] = x.size < y.size ? [x, y] : [y, x];
  for (const s of small) if (large.has(s)) shared += 1;
  return shared / (x.size + y.size - shared);
}

test('the real stale mirror is detected as one document', () => {
  const canonical = body(seaRaw, '-nodejs-');
  const mirrored = body(seaRaw, 'epac');

  // The measurement the threshold was chosen from. Pinned so that a change to shingling
  // or normalisation cannot quietly move the corpus across the line without a test saying so.
  const exact = exactJaccard(canonical, mirrored);
  assert.ok(exact > 0.35 && exact < 0.42, `exact jaccard drifted: ${exact}`);
  assert.ok(exact >= MIRROR_THRESHOLD, 'the hard case must sit above the threshold');

  assert.equal(isMirror(sketch(canonical), sketch(mirrored)), true);
});

test('the sketch estimates exact similarity closely enough to decide the finding', () => {
  const canonical = body(seaRaw, '-nodejs-');
  const mirrored = body(seaRaw, 'epac');
  const est = similarity(sketch(canonical), sketch(mirrored));
  const exact = exactJaccard(canonical, mirrored);
  // 128 hashes carry roughly 9% standard error; the gap this must resolve is 14x.
  assert.ok(Math.abs(est - exact) < 0.1, `sketch too far from exact: ${est} vs ${exact}`);
});

test('genuinely different pages on different hosts are not mirrors', () => {
  const nodeDoc = body(seaRaw, '-nodejs-');
  const discussion = body(seaRaw, 'bundling');
  const s = similarity(sketch(nodeDoc), sketch(discussion));
  if (s !== null) assert.ok(s < MIRROR_THRESHOLD, `false positive at ${s}`);
});

test('a document is identical to itself', () => {
  const doc = body(seaRaw, '-nodejs-');
  assert.equal(similarity(sketch(doc), sketch(doc)), 1);
});

test('a document too short to judge returns null, and null never means "different"', () => {
  const tiny = sketch('one two three four five six');
  assert.equal(tiny, null);
  assert.equal(similarity(tiny, sketch(body(seaRaw, '-nodejs-'))), null);
  // The consequence that matters: an unjudgeable pair is NOT reported as a mirror, so a
  // short capture can never be silently folded into another document's group.
  assert.equal(isMirror(tiny, sketch(body(seaRaw, '-nodejs-'))), false);
});

test('MIN_SHINGLES is what makes a short document unjudgeable', () => {
  const words = Array.from({ length: MIN_SHINGLES + 10 }, (_, i) => `w${i}`).join(' ');
  assert.notEqual(sketch(words), null, 'a document above the floor must be judgeable');
});

test('documentGroups collapses a mirrored pair and keeps a third document apart', () => {
  const canonical = sketch(body(seaRaw, '-nodejs-'));
  const mirrored = sketch(body(seaRaw, 'epac'));
  const other = sketch(body(seaRaw, 'bundling'));

  assert.equal(documentGroups([canonical, mirrored]).length, 1);

  const three = documentGroups([canonical, mirrored, other]);
  assert.equal(three.length, 2, 'the unrelated page must survive as its own document');
  const pair = three.find((g) => g.length === 2);
  assert.deepEqual(pair, [0, 1]);
});

test('unjudgeable rows each stand alone rather than merging', () => {
  // Two nulls must not become one group: "I cannot tell" is not "they are the same".
  assert.equal(documentGroups([null, null]).length, 2);
});

// ---------------------------------------------------------------- closestPair

test('closestPair reports the tightest pair, and null when nothing is judgeable', () => {
  const canonical = sketch(body(seaRaw, '-nodejs-'));
  const mirrored = sketch(body(seaRaw, 'epac'));
  const other = sketch(body(seaRaw, 'bundling'));

  // The mirror is the tightest pair present, so it is what gets reported.
  const three = closestPair([canonical, mirrored, other]);
  assert.ok(three > 0.35 && three <= 1, `expected the mirror to dominate, got ${three}`);
  assert.equal(closestPair([canonical, mirrored]), similarity(canonical, mirrored));

  assert.equal(closestPair([]), null, 'nothing to compare is null, not 0');
  assert.equal(closestPair([canonical]), null, 'one document has no pair');
  assert.equal(closestPair([null, null]), null, 'unjudgeable pairs report null, never 0');
});

test('closestPair is REPORTED, not acted on - the verdict does not move with it', () => {
  // The measured reason, recorded so nobody "fixes" this into a blocking rule later:
  // containment - the obvious repair for a size-mismatched mirror - ranks a genuinely
  // different pair (0.506) ABOVE a real mirror (0.380). A check that tried harder would
  // report real second sources as copies, and the remedy a reviewer reaches for is to drop
  // one. So the number informs and the grade is unchanged.
  const canonical = sketch(body(seaRaw, '-nodejs-'));
  const other = sketch(body(seaRaw, 'bundling'));
  const score = closestPair([canonical, other]);
  assert.ok(score !== null);
  assert.ok(score < MIRROR_THRESHOLD, 'this pair must remain below the mirror line');
  // Two distinct documents stay two distinct documents whatever the number says.
  assert.equal(documentGroups([canonical, other]).length, 2);
});
