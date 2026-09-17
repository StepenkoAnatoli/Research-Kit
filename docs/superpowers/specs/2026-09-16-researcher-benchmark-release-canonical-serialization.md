# Researcher benchmark release canonical serialization and hashing

**Status:** normative release-artifact contract; specification only  
**Profile ID:** `researcher-benchmark-c14n-v1`  
**Governing benchmark:** `2026-09-16-researcher-benchmark-design.md` v1.0.0  
**Applies to:** R28–R33 artifacts, benchmark lock packages, qualification evidence, source
manifests/captures, release reports, promotion pointers, and the qualification ledger

This profile defines the exact bytes over which release hashes are computed. It closes the
ambiguity between a logical record, its envelope, a source body, and a package directory.
Implementations must select this profile from the approved schema manifest; they must not
silently substitute a language runtime's default serializer or filesystem traversal order.
No fixture, source value, credential, network call, or paid request is created by this
specification.

The executable cross-language examples and rejection vectors are normative in the companion
[canonicalization conformance vector packet](2026-09-16-researcher-benchmark-canonicalization-conformance-vectors.md).

## 1. Hash vocabulary and domains

All hexadecimal hashes are lowercase SHA-256, exactly 64 ASCII characters. A hash is always
computed over bytes, never over a filename, URL, rendered preview, locale-dependent text, or
language-runtime object representation.

| Name | Bytes hashed | Use |
|---|---|---|
| `contentSha256` | Canonical bytes of one artifact body | Source captures, Markdown, opaque/binary outputs |
| `payloadSha256` | Canonical bytes of the logical `payload` value only; for a Markdown sidecar, the canonical body bytes defined in §4 | JSON/envelope records and Markdown sidecars |
| `recordHash` | Canonical envelope+payload object with `recordHash` omitted | R28–R32 records and ledger records |
| `pointerHash` | Canonical pointer object with `pointerHash` and `signature` omitted | R28–R33 promotion pointers |
| `genesisHash` | Canonical genesis object with `genesisHash` and `signature` omitted | Ledger genesis anchor |
| `predecessorClosureHash` | Canonical ordered hash-list value | Pointer and package predecessor closure |
| `chainHash` | UTF-8 domain string containing `recordHash`, previous chain hash, and decimal sequence | Append-only ledger chain |
| `manifestSha256` | Canonical JSON bytes of a complete artifact manifest | Package/directory inventory and lock manifests |

The hash field being computed is excluded from its own hash domain. All other permitted fields,
including version, profile, path, role, state, and predecessor hashes, remain in the domain.
Changing any included byte creates a new hash and a new immutable record; editing only a stored
hash is invalid.

## 2. Byte and Unicode invariants

These rules apply before any artifact-specific serialization:

1. Encode text as UTF-8 without a BOM. Do not apply Unicode NFC/NFD/NFKC/NFKD normalization;
   the original Unicode scalar sequence is content. A normalization change is a content change.
2. Use LF (`0x0A`) line endings. CRLF, lone CR, and mixed endings are rejected for canonical
   text artifacts; a canonicalizer must not repair them while hashing. A final LF is required
   exactly where the artifact profile below says so.
3. Reject invalid UTF-8, unpaired UTF-16 surrogates, NUL bytes in text, non-finite numbers,
   duplicate JSON object keys, and path names containing `.` or `..` segments.
4. Timestamps are logical data, not filesystem metadata: use UTC ISO-8601 with `Z` and a
   fixed precision declared by the schema. Filesystem mtime, ctime, inode, owner, ACL, and
   discovery order are never hashed.
5. Hash comparisons are constant-format comparisons of the 64-character lowercase string;
   uppercase, shortened, base64, or algorithm-prefixed values are invalid in v1.

## 3. Canonical JSON (`researcher-benchmark-c14n-v1-json`)

JSON is the canonical representation for envelopes, manifests, structured run/grade/report
records, status, pointers, role rosters, and lock records.

### 3.1 Data model and object rules

- Parse with duplicate-key detection. A duplicate key is an error even if the values match.
- Object keys are sorted recursively by UTF-16 code-unit lexicographic order, matching the
  existing R28–R32 validator. Arrays retain authored order; they are never sorted or deduplicated.
- Objects use no insignificant whitespace: `{}`, `[]`, `,`, and `:` are emitted without spaces
  or line breaks. JSON member order is the sorted order, not source order.
- Strings preserve code points. Emit printable non-ASCII characters as UTF-8; escape only
  `"`, `\\`, and control characters U+0000–U+001F. Use the short escapes `\\b`, `\\t`, `\\n`,
  `\\f`, and `\\r` where applicable; use lowercase `\\u00xx` for other controls. Do not escape
  `/`, non-ASCII characters, or harmless punctuation.

### 3.2 Number rules

Numbers are parsed as exact decimal values and serialized without loss:

- `0` is the only zero spelling; `-0` is rejected.
- Integers are `0` or `-?[1-9][0-9]*`.
- A decimal has a non-empty integer part, a decimal point, and at least one fractional digit;
  trailing fractional zeroes are removed, and a zero fractional part is removed with its point.
- Exponent notation, `+` signs, leading zeroes, NaN, and Infinity are rejected.
- Schemas that need a large integer or exact decimal use a JSON string with an explicit unit/type
  field rather than relying on a runtime number. The string is then hashed as a string.

The resulting canonical JSON value is encoded as UTF-8 **without a final LF** when used as a
logical hash domain (`payloadSha256`, `recordHash`, `pointerHash`, `genesisHash`, or
`predecessorClosureHash`). A standalone `.json` file appends exactly one LF after those bytes;
the file hash, if recorded, covers the LF as part of the file body.

### 3.3 Canonicalization pseudocode

```text
canonicalJson(value):
  reject duplicate keys, invalid Unicode, non-finite numbers, and unsupported number forms
  null       -> "null"
  boolean    -> "true" or "false"
  number     -> canonical decimal spelling from §3.2
  string     -> canonical JSON string escaping from §3.1
  array      -> "[" + join(",", map(canonicalJson, items in authored order)) + "]"
  object     -> "{" + join(",", for key in UTF16-sort(keys):
                 canonicalString(key) + ":" + canonicalJson(value[key])) + "}"
```

## 4. Canonical Markdown and text (`researcher-benchmark-c14n-v1-text`)

Markdown artifacts include the benchmark specification, task packets, calibration/adjudication
matrix, checklists, completed sign-off evidence, ADRs included in a release, and any R28/R33
report explicitly registered as Markdown.

1. Read the exact authored text as UTF-8, reject a BOM, normalize every line ending to LF only
   as an authoring error check (do not hash the pre-normalized bytes), and require exactly one
   final LF.
2. Preserve all other bytes: whitespace, indentation, table pipes, code fences, heading levels,
   Unicode, and trailing spaces are significant. Do not render to HTML or reflow paragraphs.
3. Do not strip comments, front matter, or blank lines. If a tool needs metadata, put it in a
   registered sidecar rather than an unrecorded comment.
4. `contentSha256` is SHA-256 of the resulting UTF-8 bytes including the one final LF.
5. A Markdown envelope sidecar is canonical JSON under §3. It records the body's relative path,
   record ID, profile ID, visibility, and predecessor hashes. For compatibility with the R28–R32
   envelope contract, the sidecar's `payloadSha256` is SHA-256 of the canonical Markdown body
   bytes (including the one final LF); a manifest may repeat that value as `contentSha256`, but
   the two values must match. The sidecar's `recordHash` covers the sidecar object, not a rendered
   preview.

Rendered PDF/HTML previews are review aids only. They are not release artifacts unless separately
registered as opaque bytes and must never replace the canonical Markdown hash.

## 5. Source captures and opaque bytes

Source captures, command outputs, fixture objects, candidate outputs, archives, images, and any
other non-structured body use the `opaque-bytes` profile:

- Copy bytes exactly as received or produced; no decoding, newline conversion, decompression,
  transcoding, trimming, or character normalization is allowed before hashing.
- `contentSha256` is SHA-256 over the exact byte sequence. `byteLength` is a decimal count of
  bytes, not characters.
- A text capture may have a companion decoded locator index, but the locator index is a separate
  artifact with its own hash; it cannot alter the capture hash.
- A source manifest names the capture hash, media type, retrieval scope, source tier, and smallest
  replayable locator. A URL or path without the body hash is not provenance.

## 6. JSON Lines and append-only ledger segments

`segments/*.qlog`, append-only grade/adjudication families, and any registered `.jsonl` artifact
use `researcher-benchmark-c14n-v1-jsonl`:

1. Each physical line is one canonical JSON value under §3, followed by exactly one LF.
2. No blank line, indentation, BOM, CR, or multi-line JSON value is permitted.
3. Physical order is part of the artifact. Never sort lines after writing.
4. A segment's `contentSha256` covers every line and its final LF. Each ledger line also carries
   its own `recordHash` and `chainHash` as defined in §1 and the qualification-ledger contract.
5. A truncated final line is `INCOMPLETE`, not a recoverable record. Quarantine it without
   deleting it; recovery appends an authenticated receipt/abort record in a later line.

`chainHash` input is the UTF-8 bytes of:

```text
benchmark-ledger-chain-v1\0<recordHash>\0<prevChainHash>\0<physicalSequence-as-decimal>
```

The two hash values are lowercase 64-character strings. For the genesis line,
`prevChainHash` is `genesisHash`.

## 7. Paths, manifests, and package-directory hashes

There is no implicit hash of a directory, ZIP listing, or filesystem walk. A package is hashed
through its canonical artifact manifest:

```json
{
  "profile": "researcher-benchmark-c14n-v1",
  "manifestVersion": "1.0.0",
  "root": "qualification/pointers",
  "entries": [
    {
      "path": "R29.json",
      "type": "file",
      "mode": "0644",
      "byteLength": 1234,
      "contentSha256": "<lowercase sha256>"
    }
  ]
}
```

The example is schema-shaped, not a fixture. Normative rules:

- Paths are repository-relative POSIX paths with `/`, no leading slash, no drive/UNC prefix,
  no traversal, and no symlink entry. Case is preserved and compared exactly.
- `entries` are sorted by UTF-16 path order. Each path appears once. `type`, `mode`,
  `byteLength`, and `contentSha256` are required for files; unsupported metadata is rejected.
- Mode is four octal digits. Only the declared mode bits are hashed; mtime, owner, ACL, and
  inode are excluded. A mode change changes the manifest hash but not the content hash.
- `manifestSha256` is SHA-256 over canonical JSON bytes of the complete manifest (including
  `profile`, `root`, and all entries) with no final LF. If stored as a `.json` file, the file
  representation adds one LF but `manifestSha256` remains the logical JSON hash.
- Lock/release manifests list artifact IDs in registry order, not discovery order. They include
  each artifact's content/payload/record hash, schema/profile, visibility, role, and predecessor
  hashes. A missing, extra, duplicate, or differently ordered entry fails validation.

## 8. Envelopes and self-excluding hashes

R28–R33 records use the existing two-part shape:

```json
{
  "envelope": { "...": "..." },
  "payload": { "...": "..." }
}
```

The profile makes the hash domains explicit:

1. Canonicalize `payload` alone under §3; set `payloadSha256` to its SHA-256.
2. Insert `payloadSha256` into the envelope. Canonicalize the complete record while omitting
   `recordHash`; set `recordHash` to that SHA-256.
3. Store the complete record with both hashes. A verifier recomputes steps 1–2 and compares both.
4. `benchmarkSpecSha256`, `roleRosterSha256`, and ordered `predecessorHashes` are ordinary
   included fields; changing them changes `recordHash`.
5. Unknown envelope keys, duplicate keys, missing profile selection in the registry, and a hash
   field present inside the payload when the schema forbids it are errors.

For a pointer, canonicalize the pointer object while omitting `pointerHash` and `signature`,
then hash it. For genesis, omit `genesisHash` and `signature`. The signature is Ed25519 over the
32 raw digest bytes represented by the corresponding hash (not over a rendered JSON document).
The JSON signature encoding is base64url without padding; the signer key ID remains included in
the hash domain. A signature does not make an unsealed, unpredecessored, or revoked record valid.

## 9. Artifact-family profile matrix

Every release artifact must resolve to one row in this matrix or be rejected as unregistered.
`recordHash` means the envelope rule in §8; `contentSha256` means exact body bytes under §4–5.

| Artifact family | Canonical representation | Required primary hash | Additional hash/closure |
|---|---|---|---|
| Approved benchmark specification and schema documents | Markdown/text | `contentSha256` | Contract pin records the approved hash |
| External R26/R27/G3 checkpoints and authenticated role roster | Canonical JSON or registered ledger record | `recordHash`/`manifestSha256` | Supplied as authenticated external roots; never inferred from filenames |
| R28-01..04 contract, schema, report, and release records | JSON envelope | `recordHash` + `payloadSha256` | Ordered predecessors; R28-04 pointer hash |
| R29-01 task-visible packages | Markdown or JSON envelope per registry | Body `contentSha256` or `recordHash` | Candidate-visible manifest hash |
| R29-02 gold, R29-03 source manifest, R29-04 calibration, R29-05 warm manifest | JSON envelope/JSONL family | `recordHash` + `payloadSha256` | Source/content hashes; role and predecessor closure |
| R29-06 gold-lock | JSON envelope | `recordHash` + `payloadSha256` | `manifestSha256`; R29 pointer hash |
| R30-01..05 frozen-cold runs, grades, adjudications, roll-up | JSON envelope/JSONL family | `recordHash` + `payloadSha256` | Candidate artifact manifest hashes; R30 closure |
| R31-01..05 frozen-warm runs, comparisons, grades, adjudications, roll-up | JSON envelope/JSONL family | `recordHash` + `payloadSha256` | Warm manifest and cold-equivalence hashes; R31 closure |
| R32-01..07 live authorization, captures, runs, cost, roll-up, grades, adjudication | JSON envelope/JSONL family plus opaque captures | `recordHash` + `payloadSha256`; captures use `contentSha256` | Pre/post source hashes, cost reconciliation, R32 closure and expiry |
| R33-01 release report and R33-02 canonical status | JSON envelope | `recordHash` + `payloadSha256` | Complete Q0–Q4 predecessor closure |
| R33-03 promotion pointer | Signed JSON pointer | `pointerHash` | Ed25519 signature, previous pointer hash, revocation closure |
| Source bodies/captures | Exact opaque bytes | `contentSha256` | Source-manifest row and locator metadata |
| Task/gold/calibration Markdown sheets and completed sign-off evidence | Canonical Markdown | `contentSha256` | Sidecar envelope and reviewer/lock hashes |
| Artifact, task, run, and final lock manifests | Canonical JSON | `manifestSha256` | Member hashes and ordered predecessor closure |
| Qualification `genesis.json`, `head.json`, checkpoints, recovery receipts | Canonical JSON | `recordHash`/`genesisHash` as applicable | Ledger chain/closure and signature where required |
| Qualification `segments/*.qlog` | Canonical JSON Lines | `contentSha256` | Per-line `recordHash` and `chainHash` |
| Qualification package pointers/history | Signed canonical JSON | `pointerHash` | Prior pointer hash and ledger promotion event |
| Unstructured candidate artifacts or registered archives | Exact opaque bytes | `contentSha256` | Artifact manifest entry; no implicit unpacked hash |

If an artifact changes representation (for example Markdown to JSON), it receives a new artifact
version and hash. A renderer or conversion tool may emit a derived preview, but the source and
derived artifact are separately registered and never interchangeable.

## 10. Reproducible hash procedure

An independent verifier performs this sequence for every release:

1. Resolve the artifact ID and profile from the authenticated registry; reject filename-only
   discovery or an unregistered extension.
2. Read bytes without a text-mode conversion. Verify path containment, type, byte length, and
   visibility before parsing.
3. Apply the profile's parser and canonicalizer. Reject malformed or non-canonical input rather
   than repairing it during hashing.
4. Compute the primary hash and all declared secondary hashes from the exact domains above.
5. Recompute member hashes and manifests in registry order; compare predecessor lists exactly and
   walk the transitive closure to the approved contract root.
6. For pointers/genesis, verify the digest, Ed25519 signature, signer roster, and committed ledger
   event. A valid signature over a different profile is a mismatch.
7. Emit a deterministic report containing artifact ID, profile, byte length, computed hashes,
   expected hashes, canonicalization result, predecessor result, and disposition. Do not include
   credentials, candidate answers, or protected gold contents.

The same input bytes, registry, profile, and approved roots must produce byte-identical report
content. Verification may run on any OS; it must not depend on locale, default encoding, path
separator, filesystem order, mtime, or process environment.

## 11. Change, rollback, and compatibility rules

- A byte, Unicode scalar, line ending, object-key order, array order, number spelling, path mode,
  source hash, predecessor order, role, visibility, schema, score, outcome, or signature-input
  change produces a new hash. Hash fields are never edited in place.
- A change to required claims, constraints, weights, expected outcome, source scope, locator,
  prompt, report formula, or serialization profile requires the version bump prescribed by the
  benchmark and a new lock/requalification chain.
- A hash mismatch in an otherwise locked artifact is `FAIL`; an intentional locked-input change
  is `REOPEN`. Revert to the last authenticated manifest/pointer, retain the failed bytes and
  evidence, revoke all descendant pointers, and requalify from the affected gate.
- A future or unknown profile/schema is rejected before destination or pointer writes. Supporting
  it requires an ADR, schema/compatibility-matrix update, independent round-trip proof, and
  rollback rehearsal; until then the state is `INCOMPLETE` or `FAIL` according to the validator.
- A second serialization/hash pass over already canonical bytes is byte-identical `NO-OP` and
  must not alter timestamps, sequence numbers, usage totals, approvals, or ledger position.

## 12. Acceptance criteria

- [ ] Every R28–R33 artifact, source capture, manifest, report, pointer, and ledger object resolves
  to exactly one profile row in §9.
- [ ] Independent implementations agree on canonical JSON key order, number/string encoding,
  Markdown final-LF behavior, JSONL framing, path ordering, and all hash domains.
- [ ] `C14N-GATE-01` passes every positive and negative vector in the companion packet with
  byte-for-byte agreement from at least two independent implementations.
- [ ] Self-excluding fields (`payloadSha256`, `recordHash`, `pointerHash`, `genesisHash`) are
  unambiguous and recomputable without circular input.
- [ ] Directory/package hashes are manifest-based and exclude filesystem discovery order and
  mutable metadata.
- [ ] Any CRLF, BOM, duplicate key, non-canonical number, Unicode normalization, reordered array,
  path escape, unknown profile, or changed predecessor is rejected before promotion.
- [ ] Pointer signatures, ledger chain hashes, predecessor closure, role roster, and release
  status all verify against the same canonical bytes and approved benchmark hash.
- [ ] Hash verification is offline, deterministic, read-only, and free of fixture creation,
  network access, credential access, and credit spend.
