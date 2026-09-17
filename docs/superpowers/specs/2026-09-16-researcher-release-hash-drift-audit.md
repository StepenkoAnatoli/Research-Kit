# Researcher benchmark release-time hash-drift audit

**Status:** normative release-control specification; no implementation or fixture creation  
**Profile:** `researcher-benchmark-c14n-v1`  
**Applies to:** R26-R33 artifacts, manifests, promotion pointers, and qualification-ledger evidence  
**Companions:** [canonical serialization and hashing](2026-09-16-researcher-benchmark-release-canonical-serialization.md), [cross-language vectors](2026-09-16-researcher-benchmark-canonicalization-conformance-vectors.md), and [descendant invalidation and atomic rollback](2026-09-16-researcher-r26-r33-descendant-invalidation-atomic-rollback.md)

The release-time audit is a read-only, deterministic check performed after the release
bundle is assembled and immediately before a promotion pointer can become `ready`. It
compares the sealed expectation with bytes actually present, the approved canonicalizer,
the authenticated manifest paths, and the hash-closed predecessor graph. It must report
all applicable mismatch classes; it must never repair bytes or guess a rollback target.

## 1. Audit inputs and output

The audit consumes one authenticated snapshot containing the current ledger head, registry,
R26/R27 roots, R28-R33 pointers, artifact manifests, role roster, benchmark-spec hash,
canonicalizer/profile ID, and sealed artifact bytes. The snapshot is content-addressed and
held under the global ledger read lock. A changed file during the scan is `BLOCKED`, not a
second sample.

For every artifact or pointer, emit one canonical audit record. The following is a
schema-shaped example, not a fixture:

```json
{
  "auditVersion": "1.0.0",
  "auditId": "<unique audit id>",
  "releaseStream": "<stream>",
  "profile": "researcher-benchmark-c14n-v1",
  "artifactId": "<R29-06 or evidence id>",
  "expected": {
    "contentSha256": "<sealed hash or null>",
    "canonicalSha256": "<sealed hash or null>",
    "path": "<sealed POSIX path or null>",
    "manifestSha256": "<sealed hash or null>",
    "predecessorHashes": [],
    "pointerHash": "<sealed pointer hash or null>"
  },
  "observed": {
    "contentSha256": "<recomputed hash or null>",
    "canonicalSha256": "<reference-canonicalizer hash or null>",
    "path": "<observed path or null>",
    "manifestSha256": "<recomputed hash or null>",
    "predecessorHashes": [],
    "pointerHash": "<recomputed pointer hash or null>"
  },
  "mismatchClasses": [],
  "primaryClass": "none|content|serializer|path|predecessor",
  "disposition": "PASS|REOPEN|FAIL|BLOCKED",
  "rollbackAction": "<controlled action code>",
  "evidenceHashes": [],
  "auditorRole": "<independent release verifier>",
  "createdAt": "<UTC timestamp>"
}
```

`mismatchClasses` is a duplicate-free array in the fixed order `content`, `serializer`,
`path`, `predecessor`. `primaryClass` is the highest-severity applicable class in the
order `predecessor > serializer > path > content`; it is not permission to omit lower
classes. A `rootCauseClass` may be added only when a controlled re-run proves causality;
otherwise it is `unknown` and the highest-severity rollback remains in force.

## 2. Release-time audit procedure

1. **Freeze and authenticate.** Read the ledger head, registry, role roster, benchmark
   specification hash, profile, and current pointers. Verify signatures and the snapshot
   hash. A missing, forked, or changing input is `BLOCKED`.
2. **Validate the canonicalizer.** Run every positive and negative vector in `C14N-GATE-01`
   with the approved implementation and an independent implementation. Any vector failure
   is a `serializer` mismatch for the release and blocks all packages.
3. **Walk artifacts in dependency order.** Audit roots, then R28, R29, R30, R31, R32, and
   R33. For each artifact, read bytes once, compute the declared raw/body hash, canonicalize
   with the reference profile, recompute manifests, and compare the expected fields.
4. **Audit paths and graph edges.** Compare each POSIX path, entry set, mode, byte length,
   and root to the sealed manifest. Compare ordered predecessor lists and the transitive
   closure to authenticated registry data; do not infer edges from filenames.
5. **Classify without repair.** Apply Section 3 and record every class, observed/expected
   value, evidence hash, and disposition. A mismatch in a descendant is still reported even
   when an ancestor already failed.
6. **Plan rollback before writing.** Resolve the last sealed, signed, unrevoked, unexpired,
   closure-valid pointer for the affected package. Hash a rollback plan naming old/new
   pointers, descendants, and the class-specific action. An absent or ambiguous target is
   `BLOCKED`.
7. **Commit the decision.** If any record is not `PASS`, append the audit and hash-drift
   event before changing a pointer. Execute the atomic package rollback and descendant
   invalidation contract. Only a clean audit may allow R33-03 promotion.

## 3. Mismatch classification

The auditor uses independent predicates. A single artifact can have more than one class.

| Class | Machine predicate | Typical evidence | Default disposition | Rollback action |
|---|---|---|---|---|
| **content** | The observed sealed-body bytes, byte length, or body/content hash differ from the expected value, while the approved profile, path, and predecessor fields are otherwise valid. | Before/after byte hashes, byte length, and quarantine path; for opaque bodies, a byte-diff summary without copying protected content. | `FAIL`; `REOPEN` only when an authorized new artifact version is explicitly recorded. | `HASH-DRIFT-CONTENT`: quarantine observed bytes; revoke the affected pointer and all descendants; restore the last matching sealed artifact/manifest pointer; rerun every gate that consumes it. |
| **serializer** | The logical value is unchanged but reference canonical bytes/digest differ from the sealed value, the profile/canonicalizer version is not the approved one, or any C14N vector fails. This includes key-order, number, escaping, Unicode-normalization, BOM, and line-ending behavior. | Profile ID/version, vector report, reference-vs-implementation canonical byte hashes, parse/semantic comparison. | `FAIL`; an approved profile migration is `REOPEN` and requires an ADR, new hashes, compatibility matrix, and rollback proof. | `HASH-DRIFT-SERIALIZER`: stop all promotion; pin/restore the approved canonicalizer; do not rewrite sealed artifacts in place; if semantic equivalence cannot be proven, restore the last passing package pointer and requalify its closure. |
| **path** | Body/content hash matches, but a manifest path, root, entry set, mode, byte length, path ordering, or path authority differs; absolute, traversal, duplicate, symlink, drive, or UNC paths are always unsafe. | Expected/observed manifest rows, normalized POSIX path comparison, root-containment proof. | `FAIL` for unsafe or unapproved changes; `REOPEN` for an approved relocation with a new manifest version. | `HASH-DRIFT-PATH`: reject the manifest; quarantine out-of-root or newly named bytes; restore the last path-valid manifest/pointer; revoke descendants and rerun manifest, locator, secrecy, and dependent qualification gates. |
| **predecessor** | Any ordered predecessor hash, target hash, closure member, pointer generation, root, signature, revocation/expiry state, or ledger head differs from the authenticated registry, is missing, or is not eligible. | Expected/observed ordered lists, closure walk, signature and ledger-chain proof, invalidation record. | `FAIL`; `BLOCKED` when the graph or ledger cannot be authenticated; `REOPEN` for an authorized root supersession. | `HASH-DRIFT-PREDECESSOR`: append invalidation; transitively revoke every descendant; restore the last closure-valid pointer. R26/R27 root changes require a new genesis/release stream, never an in-place edit. |

The content predicate concerns the artifact bytes; the serializer predicate concerns the
algorithm and its canonical output. Therefore a whitespace-only change to a structured JSON
source is `content` if the sealed body is byte-addressed, and is additionally `serializer`
only if the approved canonical output or profile changes. A changed hash field alone is not
a new class: it is content or serializer drift according to the bytes that recompute.

## 4. Deterministic multi-mismatch handling

1. Record all predicates that evaluate true, in fixed class order.
2. Select `primaryClass` using `predecessor > serializer > path > content`.
3. Select the rollback plan as the union of all required class actions, executed once under
   the atomic package-rollback transaction. The most restrictive target wins: a target must
   satisfy every class and the complete predecessor closure.
4. If a class cannot be distinguished because bytes, profile, or graph evidence is missing,
   add `BLOCKED` and do not downgrade to a lower class.
5. A descendant may not remain `ready`, `PASS`, or `live-verified` merely because its own
   bytes pass; an ancestor mismatch always propagates through the transitive closure.

## 5. Controlled rollback actions

| Action code | Required operation | Release effect |
|---|---|---|
| `HASH-DRIFT-CONTENT` | Quarantine changed bytes; append hash-drift record; restore last content-matching pointer; invalidate descendants. | Affected gate reopens; dependent evidence is not reusable until requalified. |
| `HASH-DRIFT-SERIALIZER` | Freeze promotion; restore approved profile/canonicalizer; retain both reports; version rather than rewrite if a change is intended. | Entire release is `NOT-READY`; no hash is trusted until C14N-GATE-01 and compatibility proof pass. |
| `HASH-DRIFT-PATH` | Reject unsafe path; restore path-valid manifest/pointer; preserve the observed package for review. | Manifest and all locator/secrecy-dependent gates reopen; descendants are revoked. |
| `HASH-DRIFT-PREDECESSOR` | Append descendant invalidations; restore closure-valid target or create new genesis for root change. | No downstream promotion; R33 status is `not-ready` until a new closure is sealed. |

Rollback is pointer-only and append-only: failed bytes, reports, hashes, signatures,
manifests, and audit records remain addressable. Filesystem partial publication follows the
crash-recovery outcomes in the atomic rollback contract; a mixed old/new set is never `PASS`.

## 6. Fault-injection conformance cases

These cases exercise classification without creating benchmark fixtures. The harness may
use disposable synthetic bytes, but must not alter the repository or spend credits.

| Case | Injected condition | Required class | Required action |
|---|---|---|---|
| `HD-01` | Flip one byte in a sealed opaque body | `content` | `HASH-DRIFT-CONTENT` |
| `HD-02` | Keep JSON semantics but use a non-approved key/number serializer | `serializer` | `HASH-DRIFT-SERIALIZER` |
| `HD-03` | Replace LF with CRLF or add a BOM | `serializer` (and `content` when body bytes are sealed) | Serializer stop; content quarantine if applicable |
| `HD-04` | Rename an entry while preserving its body hash | `path` | `HASH-DRIFT-PATH` |
| `HD-05` | Introduce `..`, absolute, duplicate, symlink, drive, or UNC path | `path` | Immediate `FAIL`; no pointer write |
| `HD-06` | Replace one predecessor hash with an existing but ineligible hash | `predecessor` | `HASH-DRIFT-PREDECESSOR`; revoke descendants |
| `HD-07` | Remove a predecessor or truncate the ledger after snapshot | `predecessor` | `BLOCKED`; quarantine and require checkpoint repair |
| `HD-08` | Complete only half of a multi-pointer rollback | `predecessor` plus recovery state | Recover atomically or remain `BLOCKED`; never `PASS` |

## 7. Evidence and release gate

`HASH-AUDIT-GATE-01` is PASS only when every in-scope artifact has a `PASS` audit record,
the C14N vector packet passes in two independent implementations, all manifests and paths
recompute, every predecessor closure is authenticated, and no rollback action is pending.
The evidence bundle contains:

- immutable snapshot hash and ledger-head proof;
- one audit record per artifact/pointer, including expected and observed values;
- canonicalizer/profile and vector report hashes;
- manifest/path containment and byte-length report;
- predecessor closure, signature, revocation, expiry, and chain proofs;
- any rollback plan, invalidation records, recovery receipts, and requalification evidence.

Any unexplained mismatch, missing record, unknown class, mixed pointer state, stale head,
or ambiguous rollback target is a hard release blocker. The audit report is canonicalized,
hashed, and appended to the qualification ledger before R33-03 promotion.

## 8. Reviewer attestations

| Attestation | Reviewer entry |
|---|---|
| Snapshot and ledger head were authenticated and remained stable during the audit |  |
| C14N-GATE-01 passed in two independent implementations |  |
| Content, serializer, path, and predecessor predicates were evaluated independently |  |
| Every mismatch was recorded; no lower-severity label hid a higher-severity one |  |
| Rollback target is sealed, signed, unrevoked, unexpired, and closure-valid |  |
| Descendant invalidation and atomic rollback evidence are present where required |  |
| Failed bytes and audit history were retained; no in-place repair occurred |  |
| Final disposition (`PASS` / `REOPEN` / `FAIL` / `BLOCKED`) |  |
| Independent auditor / identity / UTC timestamp |  |

