# R26–R33 descendant-pointer invalidation and atomic package rollback

**Status:** normative release-control specification; no implementation, fixture, or credit spend  
**Applies to:** external roots R26/R27 and package projections R28–R33  
**Companion contracts:** [migration and rollback gates](2026-09-16-researcher-benchmark-migration-rollback-gates.md), [qualification ledger](2026-09-16-researcher-benchmark-qualification-ledger.md), and [R28–R32 validators](2026-09-16-researcher-r28-r32-machine-validators.md)

The offline graph conformance suite for shared ancestors, cycles, duplicate descendants, and
concurrent rollback requests is [`2026-09-16-researcher-offline-graph-conformance-tests.md`](2026-09-16-researcher-offline-graph-conformance-tests.md).

Use the blank [`crash-point rollback recovery evidence bundle`](2026-09-16-researcher-crash-rollback-evidence-bundle-template.md)
to record snapshots, pointer hashes, ledger receipts, recovery results, and closure proof.

This specification defines how a revoked, reopened, expired, or hash-inconsistent predecessor
invalidates every dependent promotion pointer and how a package rollback is published as one
recoverable logical transaction. It does not edit immutable evidence, delete failed records, or
silently restore a prior release.

## 1. Objects and mutability

| Object | Role | Mutable? | Rollback treatment |
|---|---|---:|---|
| R26 checkpoint, R27 qualification, and G3 closure roots | Authenticated external predecessors | No | Never edit or replace in place. Select a prior authenticated root or start a new release stream/genesis. |
| R28-04, R29-06, R30-05, R31-03, R32-05, R33-03 current pointers | Package promotion projections | Yes, by protocol only | Replace with a signed replacement or revoked tombstone; retain old bytes in history. |
| Historical pointers and ledger records | Audit history | No | Append revocation/recovery records; never rewrite or remove. |
| Task, source, run, grade, cost, report, and manifest artifacts | Evidence payloads | No after sealing | Reopen/version or revoke derived promotion; retain the payload and its hash. |

The package pointer set is ordered `R28`, `R29`, `R30`, `R31`, `R32`, `R33`. R26/R27 are roots
in the closure but are not replaceable package pointers. A current pointer is the single file
named by the registry for that package; history files are not competing current state.

## 2. Invariants

1. A pointer is `eligible` only when it is signed, sealed, unrevoked, unexpired, and every
   transitive predecessor hash is present, sealed, hash-matching, and eligible at its required
   gate.
2. If a hash is revoked or reopened, no current or historical pointer whose predecessor closure
   contains that hash may remain `ready`, `PASS`, or `live-verified`.
3. Invalidation is monotonic. A revoked pointer is never made current again by copying a file or
   decrementing a generation; repromotion uses a new generation and a fresh ledger event.
4. A rollback changes only mutable pointer projections. It retains old pointer bytes, evidence,
   hashes, signatures, failures, and revocation reasons.
5. A rollback transaction has one authenticated before-state and one authenticated after-state.
   During preparation, partial publication, or recovery, the release status is `INCOMPLETE` and
   no package or descendant can publish `PASS`.
6. Implementation rollback (reverting code or schema) is distinct from promotion rollback
   (revoking a pointer). Neither may leave a later package claiming compatibility with a removed
   schema or revoked predecessor.

## 3. Hash-closed descendant calculation

### 3.1 Graph definition

For every pointer generation `p`, define an edge from `p` to each hash in its ordered
`predecessorHashes` and to its `targetHash`. The registry supplies the authoritative expansion of
selectors such as `ALL(R30-01..04)`; the validator never discovers predecessors by scanning
filenames. External R26/R27/G3 hashes are authenticated roots in that registry.

The transitive closure `closure(p)` is the ordered, duplicate-free depth-first walk of the
pointer's predecessor hashes, visiting each hash once and preserving registry order. A pointer
`d` is a descendant of invalidated hash `h` exactly when `h ∈ closure(d)` or `h` is the target of
a pointer in `closure(d)`. Direct package adjacency is insufficient: an R33 pointer can depend on
an R29 source hash through several intermediate records.

### 3.2 Deterministic invalidation algorithm

Given one or more invalidation roots `H`:

1. Authenticate each root hash and reason (`revoke`, `reopen`, `expiry`, `hash-drift`,
   `role/secrecy`, `gate-failure`, or `external-root-superseded`). An unknown root is `FAIL`.
2. Load all current and historical pointer records from the authenticated registry/ledger.
3. Compute `closure(p)` for every pointer generation and select every current pointer `p` where
   any `h ∈ H` is in its closure or target ancestry.
4. Add descendants transitively until a fixed point; do not stop at the first package boundary.
5. Sort affected current pointers by package rank (`R28`→`R33`), then by generation, then by
   `recordId`. Sort invalidating root hashes lexicographically within each pointer record.
6. Emit one immutable invalidation record per affected pointer, each naming the exact root hash,
   all applicable roots, old pointer hash, previous pointer hash, and the rollback transaction ID.
7. Replace each affected current pointer with a signed `revoked` tombstone or an approved
   rollback target as specified in Section 5. A pointer is not considered invalidated until its
   ledger event and current projection agree.
8. Recompute R33 status. Any affected Q gate is open; the release status is `not-ready` unless a
   separately authorized offline state is explicitly valid. No descendant `ready` pointer may
   survive the transaction.

The algorithm is idempotent. Re-running with the same root hash and transaction ID returns
`NO-OP` after verifying the existing revocation records. A different root or changed affected
set is a new transaction and cannot overwrite the first one.

### 3.3 Required invalidation record

Each `promotion-revoke` payload contains:

```json
{
  "operation": "descendant-invalidation",
  "transactionId": "<stable rollback transaction ID>",
  "invalidatedPointer": "<pointer record ID>",
  "invalidatedPointerHash": "<old pointerHash>",
  "rootHashes": ["<sorted authenticated root hashes>"],
  "previousPointerHash": "<old current pointer hash or null>",
  "rollbackTargetHash": "<approved target hash or null>",
  "reasonCode": "<revoke|reopen|expiry|hash-drift|role/secrecy|gate-failure|external-root-superseded>",
  "descendantPointerIds": ["<deterministically ordered affected IDs>"],
  "evidenceRetained": true
}
```

This is a schema-shaped example, not a fixture. The payload is canonicalized and hashed under
the qualification-ledger profile. `rollbackTargetHash` is null for a pure revocation tombstone.
No candidate output, credential, source body, or protected gold value is copied into the record.

## 4. Package-specific semantics

| Package | Invalidation source | Permitted rollback target | Required result |
|---|---|---|---|
| R26 | Checkpoint superseded, missing, or hash-invalid | A prior authenticated R26 checkpoint in the same release stream, if one exists | Otherwise block the stream and create a new genesis; never edit the root. |
| R27 | Qualification root revoked, incompatible, or hash-invalid | A prior authenticated R27 qualification compatible with the selected R26/root and contract | If none exists, new release stream/genesis; all R28–R33 descendants revoked. |
| R28 | Contract/schema pin or release-manifest defect | Last sealed R28-04 pointer whose R26/R27 roots and approved v1 contract remain valid | Revoke R29–R33 descendants; no local threshold/outcome override. |
| R29 | Task/gold/source/calibration/warm-manifest change or defect | Last sealed R29-06 pointer with unchanged required units and valid R28 closure | Requalify affected tasks; revoke R30–R33 descendants. |
| R30 | Frozen-cold run/grade/roll-up defect | Last sealed R30-05 `provisional-cold` pointer with valid R29 closure | R31–R33 descendants are invalidated; retained valid failures remain evidence. |
| R31 | Frozen-warm mismatch, synthesis access, or cost defect | Last sealed R31-03 pointer with valid R29/R30 closure | Re-run warm qualification or leave frozen release unqualified; revoke R32/R33. |
| R32 | Live authorization, source drift, repetition, grade, cost, or expiry defect | Last unexpired R32-05 pointer whose R29–R31 closure remains valid | Revoke live verification; status may fall to `offline-verified` or `not-ready`; R33 revoked. |
| R33 | Report/status/pointer/hash/signature defect | Last R33-03 pointer with a complete valid Q0–Q4 closure | Revoke publication only; regenerate a hash-distinct report/pointer after re-review. |

If the proposed target has a revoked, reopened, expired, superseded, or mismatched ancestor, the
target is invalid and the transaction is `BLOCKED`. R26/R27 root replacement always changes the
root closure and therefore requires a new R28–R33 qualification chain; it is not an in-place
rollback.

## 5. Atomic package rollback protocol

Rollback is a logical multi-pointer transaction backed by the append-only ledger. Filesystem
renames are individually atomic; the ledger transaction makes the complete package set appear
atomic to validators.

### Phase A — preflight and snapshot

1. Acquire the global ledger lock, then package locks in ascending order `R28` through `R33`.
   A lock timeout or live conflicting lease is `INCOMPLETE`; locks are never stolen without a
   recovery receipt.
2. Verify the ledger head, current pointers, signatures, registry, benchmark hash, role roster,
   predecessor closures, and the invalidation root(s).
3. Resolve the last authenticated rollback target for every affected package. Capture exact old
   pointer bytes, paths, modes, hashes, and current ledger head into a canonical rollback plan.
4. Hash the plan as `rollbackPlanSha256`. The plan lists the complete affected set, expected old
   hashes, expected replacement/tombstone hashes, root hashes, target hashes, and transaction ID.
   A missing target or ambiguous closure stops before any write.

### Phase B — durable prepare

1. Append a ledger `prepare` event with `operation: "package-rollback"`, the canonical rollback
   plan, old/new hash sets, and expected post-transaction status. Flush and `fsync` the segment.
2. Write replacement pointers/tombstones to same-directory temporary files. Each file must be
   complete, signed where required, canonical, hash-verified, and marked `revoked` or the exact
   approved target generation. Flush and `fsync` each temporary file.
3. Copy every old current pointer to its immutable history path with exclusive-create semantics;
   an existing different byte sequence is `FAIL`. Do not delete the current file yet.

### Phase C — commit and publication

1. Atomically rename each verified temporary pointer over its current pointer in deterministic
   package order, then `fsync` each containing directory. The old bytes remain in history.
2. Re-read every current pointer and compare it with the prepared post-hash set. If any differs,
   stop with `BLOCKED`; do not guess which state is authoritative.
3. Append and `fsync` the ledger `commit` event (and the required `promotion-revoke` records)
   naming the exact pointer hashes and `rollbackPlanSha256`.
4. Atomically replace `head.json` with the new authenticated head and `fsync` its directory.
5. Release package locks and then the ledger lock. The transaction is `ROLLED-BACK` only when
   the ledger, head, current pointers, and descendant set all agree.

The transaction may publish replacement pointers and revocation tombstones in one plan, but it
may not publish any replacement as `ready` until all invalidations and predecessor checks close.
The sole R33-03 `ready` pointer is absent or revoked throughout a rollback and is recreated only
by a later release qualification.

## 6. Crash recovery and atomicity outcomes

Recovery runs under the ledger lock before any new append or promotion. It never edits a durable
ledger line.

| Crash point | Recovery action | Externally valid result |
|---|---|---|
| Before prepare is durable | Remove only unreferenced temporary files | Old pointer set; `NO-OP` |
| Prepare durable, no temporary set | Append `abort`/recovery receipt; retain plan | Old pointer set; transaction `INCOMPLETE` history |
| Some temporary pointers durable, no rename | Verify plan; discard/quarantine temps; retain old pointers | Old pointer set; no promotion |
| Some renames complete, commit absent | Restore every old pointer from authenticated history, or quarantine and mark `BLOCKED` if restore is ambiguous; append recovery record | No `PASS`; old set only after exact restore |
| Commit durable, pointer set partial | Use committed post-hash set to finish all renames; if a required byte is absent, freeze and `BLOCKED` | No pointer is eligible until complete; recovery is idempotent |
| Pointers complete, head not replaced | Recompute head from verified ledger suffix and append recovery receipt | Committed rollback survives |
| Head replaced, lock not released | Verify closure and release/reap lease | `NO-OP` |
| Middle-line ledger corruption or fork | Do not truncate or choose a side; quarantine and require external checkpoint repair | `FAIL`; all promotion blocked |

During any nonterminal state, validators reduce status as `REOPEN > FAIL > INCOMPLETE > PASS`.
A mixed old/new pointer set, missing tombstone, uncommitted pointer, stale head, or ambiguous
restore is never interpreted as a successful rollback.

## 7. Validation and release gates

The package rollback validator must reject:

- a descendant pointer whose closure still names any invalidated hash;
- a current `ready`, `PASS`, or live-verified pointer below a revoked/reopened/expired ancestor;
- a rollback target that is not sealed, signed, unrevoked, unexpired, and closure-valid;
- a missing, duplicate, unordered, or extra affected pointer;
- a pointer replacement without a committed ledger event, prior-pointer hash, history copy, or
  rollback-plan hash;
- R26/R27 in-place mutation, root substitution without a new genesis, or a filename-only target;
- a partial multi-pointer publication treated as atomic success;
- a rollback that deletes evidence, failed runs, grades, source captures, or ledger history;
- a later package promoted while an earlier package rollback is pending, blocked, or reopened.

Release review records, for each transaction:

| Evidence | Required contents |
|---|---|
| Rollback plan | Transaction ID, root reason/hash, affected packages/pointers, old/new hashes, target closure, role, timestamp, plan hash |
| Ledger proof | Prepare, commit/revoke, chain/head hashes, and recovery receipt if applicable |
| Pointer proof | Before/after bytes, signatures, previous-pointer links, history paths, and current hashes |
| Descendant proof | Deterministic closure output showing every dependent pointer revoked or replaced |
| Status proof | R28–R33 states, Q-gate reduction, R33-03 absence/revocation, and no surviving `ready` descendant |
| Retention proof | Failed/superseded bytes, evidence, and reason retained and addressable |

## 8. Acceptance criteria

- [ ] R26/R27 are modeled as immutable authenticated roots; root changes require a new genesis or
  an explicitly authenticated prior root, never an in-place edit.
- [ ] Descendants are computed from transitive predecessor hashes, not package names or filenames,
  with deterministic ordering and idempotent repeated invalidation.
- [ ] Every affected R28–R33 pointer receives an immutable revocation/rollback record naming the
  exact invalidating root, old hash, target hash, and transaction.
- [ ] A package rollback has a durable prepare, authenticated snapshot/plan, atomic pointer
  publication, ledger commit, head update, and crash-recovery path.
- [ ] No crash point can yield a mixed pointer set that validators accept as `PASS` or `ready`.
- [ ] Reopening or revoking an ancestor transitively blocks all descendants until new generation
  pointers pass their required gates; old evidence and failed attempts remain retained.
- [ ] R33-03 is never `ready` while any predecessor is invalidated, expired, pending recovery,
  or otherwise not `PASS`.
- [ ] Rollback and invalidation are offline, deterministic, append-only, and do not create
  fixtures, access credentials, recapture sources, or spend benchmark credits.
