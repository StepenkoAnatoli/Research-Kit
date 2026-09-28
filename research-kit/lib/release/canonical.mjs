// Canonical JSON, hashing, and the record shapes built on them.
//
// Extracted from release-validator.mjs on 2026-09-20. This is the primitive every other
// validator reuses - fi-validator, the three conformance libraries, path-authority - and
// the one place duplication has already cost this repository: three Python runners each
// carried their own copy of this algorithm, two drifted, and the same document hashed to
// two different SHA-256s. One implementation is the entire point.
//
// A record may be FLAT or NESTED ({ envelope, payload }). metaOf/payloadOf/nestedRecord
// are the only readers that know which, so nothing above them has to.
import crypto from 'node:crypto';
/** Canonical JSON: recursively sorted object keys, authored array order. */
export function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${canonicalString(key)}:${canonicalJson(value[key])}`).join(',')}}`;
  }
  return canonicalString(value);
}

/**
 * A string JavaScript holds that JSON cannot round-trip: an unpaired surrogate.
 *
 * A JS string is UTF-16 code units, so an astral character is stored as a surrogate PAIR
 * and a lone `\ud800` is stored as one code unit. `JSON.stringify` happily emits the
 * latter as the escape `\ud800`, which is not valid JSON text - a strict parser rejects
 * it, and re-parsing it in another language may not even produce the same string. So this
 * side canonicalised a value the other side refuses, and the two disagreed about the
 * digest of the same document (found 2026-09-28, break-test: a hostile vector packet made
 * the Node runner report PASS and its Python twin a structured FAIL).
 *
 * `conformance_common.py`'s `json_string` has always refused this; this is that rule,
 * stated where the bytes are produced. A well-formed pair is skipped whole, so astral
 * keys and values are unaffected.
 */
function hasUnpairedSurrogate(text) {
  for (let i = 0; i < text.length; i += 1) {
    const unit = text.charCodeAt(i);
    if (unit < 0xd800 || unit > 0xdfff) continue;
    if (unit >= 0xdc00) return true;                 // a low surrogate with no high before it
    const next = i + 1 < text.length ? text.charCodeAt(i + 1) : 0;
    if (next < 0xdc00 || next > 0xdfff) return true; // a high surrogate with no low after it
    i += 1;                                         // a pair: its low half is not a lone one
  }
  return false;
}

/** The canonical spelling of one string, refusing what cannot round-trip. */
function canonicalString(value) {
  if (typeof value === 'string' && hasUnpairedSurrogate(value)) {
    throw new Error('unpaired surrogate is not canonical JSON');
  }
  const encoded = JSON.stringify(value);
  if (encoded === undefined) throw new Error('undefined is not canonical JSON');
  return encoded;
}

/**
 * Canonical equality: two values are the same if their canonical bytes are.
 *
 * Lived in the schema block until 2026-09-20 and is used well outside it - the
 * predecessor check in release-validator.mjs compares hash lists with it. Moving it here
 * is not tidying: leaving it in schema.mjs left that caller referencing a function that
 * no longer existed, which is how the split first went red.
 */
export function same(a, b) { return canonicalJson(a) === canonicalJson(b); }

export function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

export function payloadHash(payload) {
  return sha256(canonicalJson(payload));
}

export function metaOf(record) { return record?.envelope && typeof record.envelope === 'object' ? record.envelope : record; }
export function payloadOf(record) { return record?.payload; }
export function nestedRecord(record) { return Boolean(record?.envelope && typeof record.envelope === 'object'); }
export function recordHash(record) {
  if (nestedRecord(record)) {
    const envelope = { ...record.envelope };
    delete envelope.recordHash;
    return sha256(canonicalJson({ envelope, payload: record.payload }));
  }
  const flat = { ...record };
  delete flat.recordHash;
  return sha256(canonicalJson(flat));
}

// Qualification-ledger hashing deliberately excludes fields that are either
// derived from the hash (chainHash) or contain the signature over it. This is
// the byte-level rule used by the append protocol and keeps verification
// deterministic across runtimes.
export function qualificationRecordHash(record) {
  const unsigned = { ...record };
  delete unsigned.recordHash;
  delete unsigned.chainHash;
  delete unsigned.signature;
  return sha256(canonicalJson(unsigned));
}

export function qualificationChainHash(record) {
  return sha256(`benchmark-ledger-chain-v1\0${record.recordHash}\0${record.prevChainHash}\0${record.physicalSequence}`);
}
