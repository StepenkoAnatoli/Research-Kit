// Near-duplicate detection between two captured pages.
//
// WHY THIS EXISTS. `corroboration` counts distinct HOSTS, on the reasoning that two pages
// from one vendor are one witness read twice. That heuristic does not merely miss a mirror
// - it INVERTS on one. A republished copy of a document on an unrelated host scores
// `independent`, the check's best grade, while carrying strictly less information than
// either genuine page: one witness, plus a staleness `freshness` cannot see, because that
// check grades when a page was FETCHED and a mirror is fetched today.
//
// Found 2026-09-21: `lira.epac.to` serves Node's single-executable documentation six major
// versions behind `nodejs.org`. Cited together they would have reported `independent`.
//
// WHY THIS IS NOT "GRADING MEANING". ADR-0013 refuses checks that judge whether an agent
// reasoned well. This judges nothing: it asks whether two byte streams are substantially
// the same text, which is arithmetic. It cannot tell a correct page from a wrong one, and
// does not try. A `mirror` finding says "these are one document" - what that is worth is
// still the reviewer's call.

/** Word shingles. Punctuation, case and URLs are noise for this question. */
export function shingles(text, n = SHINGLE_WORDS) {
  const words = String(text ?? '')
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[^a-z0-9\s]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  const out = new Set();
  for (let i = 0; i + n <= words.length; i += 1) out.add(words.slice(i, i + n).join(' '));
  return out;
}

export const SHINGLE_WORDS = 5;

/** How many hashes the sketch keeps. 128 bounds memory and costs ~9% standard error. */
export const SKETCH_SIZE = 128;

/**
 * A document too short to fingerprint honestly. Below this, shingle overlap is dominated
 * by whatever boilerplate the two pages happen to share, and a `mirror` finding would be
 * an artefact of the sample size rather than a fact about the documents.
 */
export const MIN_SHINGLES = 40;

function hash32(str, seed) {
  // FNV-1a, seeded. Deterministic across runs and platforms, which matters because a
  // sketch decides a gate finding: the same corpus must grade the same way everywhere.
  let h = (2166136261 ^ seed) >>> 0;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

/**
 * A MinHash sketch: the smallest hash under each of SKETCH_SIZE independent functions.
 * `null` for a document with too little text to judge - callers must treat that as
 * "unknown", never as "different".
 */
export function sketch(text) {
  const set = shingles(text);
  if (set.size < MIN_SHINGLES) return null;
  const mins = new Uint32Array(SKETCH_SIZE).fill(0xffffffff);
  for (const s of set) {
    for (let k = 0; k < SKETCH_SIZE; k += 1) {
      const h = hash32(s, k);
      if (h < mins[k]) mins[k] = h;
    }
  }
  return mins;
}

/** Estimated Jaccard similarity of two sketches, or `null` if either is unjudgeable. */
export function similarity(a, b) {
  if (!a || !b) return null;
  let same = 0;
  for (let k = 0; k < SKETCH_SIZE; k += 1) if (a[k] === b[k]) same += 1;
  return same / SKETCH_SIZE;
}

/**
 * The line between "the same document" and "two documents".
 *
 * CHOSEN FROM MEASUREMENT, not from taste. Every capture pair in this repository was
 * compared on 2026-09-21 - 47 captures, 1081 pairs:
 *
 *   - the known mirror (nodejs.org x lira.epac.to, six majors apart)  0.3879
 *   - the highest-scoring genuinely different cross-host pair         0.0275
 *   - median cross-host pair                                         0.0000
 *
 * A fourteen-fold gap, so the threshold is not delicate. 0.25 sits about 9x above the
 * strongest false-positive candidate and comfortably below the hardest true positive -
 * and the hard case is the STALE mirror, because a current mirror scores ~0.99. Same-host
 * re-collections of one URL reach 1.0000, which is why this check only speaks about pairs
 * that `corroboration` was about to call independent.
 */
export const MIRROR_THRESHOLD = 0.25;

export function isMirror(a, b) {
  const score = similarity(a, b);
  return score === null ? false : score >= MIRROR_THRESHOLD;
}

/**
 * Group rows into distinct DOCUMENTS. Each group is a set of indices whose sketches are
 * near-duplicates of one another.
 *
 * Single-link clustering: A mirrors B and B mirrors C puts all three together even if A
 * and C fall below the threshold. That is the conservative direction for this check - it
 * errs towards reporting less corroboration than the host count suggests, never more.
 */
export function documentGroups(sketches) {
  const parent = sketches.map((_, i) => i);
  const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  for (let i = 0; i < sketches.length; i += 1) {
    for (let j = i + 1; j < sketches.length; j += 1) {
      if (isMirror(sketches[i], sketches[j])) parent[find(i)] = find(j);
    }
  }
  const groups = new Map();
  for (let i = 0; i < sketches.length; i += 1) {
    const root = find(i);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root).push(i);
  }
  return [...groups.values()];
}
