# Researcher benchmark artifact migration and rollback gates

**Status:** normative review specification; documentation only  
**Governing benchmark:** [`2026-09-16-researcher-benchmark-design.md`](./2026-09-16-researcher-benchmark-design.md), v1.0.0  
**Applies to:** R28 benchmark schema, R29 task/gold/source/calibration manifests, R30–R32 qualification evidence, and R33 release reports/status  
**Machine validation contract:** [`2026-09-16-researcher-r28-r32-machine-validators.md`](./2026-09-16-researcher-r28-r32-machine-validators.md)  
**No execution:** this document authorizes no fixture creation, implementation, live run, or credit spend.

Use the blank [`v2 migration reviewer sign-off form`](./2026-09-16-researcher-v2-migration-reviewer-signoff.md) to record the attestations required by these gates.

The gate-specific blank evidence and sign-off forms are bundled in [`BM/RB evidence and sign-off forms`](./2026-09-16-researcher-benchmark-bm-rb-evidence-signoff/README.md): one form for each BM-0–BM-6 and RB-1–RB-7 gate.

The blank [BM/RB roll-up worksheet](./2026-09-16-researcher-bm-rb-rollup-worksheet.md)
summarizes every form status, evidence hash, dependency, rollback target, and open blocker.

Completed BM/RB forms must satisfy the [offline sign-off validator contract](./2026-09-16-researcher-bm-rb-signoff-validator.md) before BM-6 approval.

The FI-01–FI-30 traceability crosswalk is [`2026-09-16-researcher-v2-fault-traceability-matrix.md`](./2026-09-16-researcher-v2-fault-traceability-matrix.md).

Offline shared-ancestor, cycle, duplicate, and concurrent-rollback qualification is gated by
[`GRAPH-GATE-01`](./2026-09-16-researcher-offline-graph-conformance-tests.md).

Crash-point rollback evidence is captured with the blank [`rollback recovery evidence bundle`](./2026-09-16-researcher-crash-rollback-evidence-bundle-template.md).

The BM-2 gold-lock projection subgate is [`2026-09-16-researcher-benchmark-gold-lock-migration-gate.md`](./2026-09-16-researcher-benchmark-gold-lock-migration-gate.md). It is the normative procedure for projecting all human trap rows and approving Live outcomes before R29-06 promotion.

Use the blank [`release reopen/rollback/requalification log template`](./2026-09-16-researcher-release-reopen-rollback-requalification-log-template.md) for the append-only event rows and reviewer attestations required by RB-1–RB-7.

Future-schema drift and v3 approval are governed by [`2026-09-16-researcher-v3-schema-drift-policy.md`](./2026-09-16-researcher-v3-schema-drift-policy.md).

The release-time content/serializer/path/predecessor audit is defined by [`2026-09-16-researcher-release-hash-drift-audit.md`](./2026-09-16-researcher-release-hash-drift-audit.md) and is a prerequisite to BM-6/R33-03 promotion.

This specification closes the migration and rollback boundary for benchmark artifacts. A gate is closed only when its evidence is sealed, hash-linked, independently reviewed, and reversible without deleting history.

## 1. Artifact domains and custody

| Domain | Canonical records | Mutable object | Immutable history | Primary owner |
|---|---|---|---|---|
| Benchmark schema | R28-01 contract pin, R28-02 schema manifest, R28-03 report schema, R28-04 release manifest | R28 promotion pointer | Pinned specification hash and schema-test records | Contract custodian |
| Gold manifests | R29-01 task-visible package, R29-02 gold, R29-03 source manifest, R29-04 calibration, R29-05 warm manifest, R29-06 gold lock | R29 gold-lock promotion pointer | Task versions, source captures, reviews, grades, adjudications, failed batches | Evidence custodian |
| Frozen qualification | R30-01..05 and R31-01..05 | R30/R31 roll-up pointers | Cold/warm runs, grades, comparisons, failures | Run/evidence custodians |
| Live qualification | R32-01..07 | R32 expiring promotion pointer | Authorization, pre/post captures, repetitions, grades, cost evidence | Live authorization/evidence custodians |
| Release report | R33-01 report, R33-02 status, R33-03 promotion pointer | R33-03 pointer and status | Every generated report, predecessor manifest, invalidation/revocation record | Release owner |

The mutable object is the only object a rollback may replace. No rollback edits or deletes an immutable record.

## 2. Version and hash contract

1. Every record carries `benchmarkSpecVersion: 1.0.0` and the exact lowercase SHA-256 of the approved benchmark specification.
2. Every record carries its own lowercase SHA-256 over canonical bytes and an ordered `predecessorHashes` list.
3. Canonical bytes use the declared field ordering, UTF-8, LF line endings, and deterministic serialization. Rendered Markdown is hashed only after its canonical source bytes are fixed.
4. A schema, required claim, constraint, weight, expected outcome, source scope, locator, prompt, or report formula change creates a new version and new hashes; editing a hash without changing the payload is invalid.
5. A superseding benchmark specification, missing predecessor, unknown future schema, or hash mismatch blocks all downstream promotion. Historical records remain readable and are marked superseded or revoked, never rewritten.

## 3. Migration gate sequence

The gates are ordered. A later gate may inspect an earlier sealed record but may not repair or reinterpret it in place.

| Gate | Scope | Required inputs | PASS evidence | Blocking conditions |
|---|---|---|---|---|
| **BM-0 Inventory and snapshot** | All benchmark artifact families | Legacy/current files, package manifest, role roster | Authenticated inventory with path, mode, byte hash, schema, owner, visibility, and snapshot hash | Missing file, ambiguous ownership, out-of-root path, unsealed predecessor, or untracked artifact |
| **BM-1 Schema migration** | R28-01..04 and schema readers | Approved v1.0.0 text plus legacy schema records | Read-old/write-canonical-v1 proof, semantic equivalence report, parser self-tests, unknown-version refusal, idempotent `NO-OP` | Local threshold/outcome override, dropped field, automatic approval, future schema accepted, or candidate/gold mixing |
| **BM-2 Gold-manifest migration and lock** | R29-01..06 for all 24 tasks | BM-1, authoring packets, source captures, review roster, and `GL-1` projection evidence | 24 task records; 20 Frozen/4 Live; 4 tasks per category; 6/12/6 difficulty; source/locator replay; every human trap row projected exactly once into the canonical register; two independent gold approvals; explicit same-outcome Live approvals; calibration thresholds; gold-lock hash | Missing locator/source hash, projection mismatch, role collision, candidate-visible gold, unresolved critical disagreement, missing/conflicting/stale Live approval, or changed required unit without version bump |
| **BM-3 Qualification evidence migration** | R30–R32 run/grade/cost records | BM-1, BM-2, sealed run artifacts | Every run/grade/adjudication is independently sealed, version/hash-linked, and validity-precedence compliant; no dropped failures | Opaque grade, missing adjudication, invalid run counted as pass, warm synthesis access, live authorization after launch, or cost mismatch |
| **BM-4 Release-report migration** | R33-01..03 | BM-1..BM-3, Q0–Q4 promotion manifests | Deterministic report regenerated from sealed predecessors; status and expiry agree with pointers; report hash and predecessor closure recorded | Report contains unsealed evidence, stale/expired live claim, contradictory status, missing predecessor, or hidden failure |
| **BM-5 Rollback rehearsal** | Each domain and one cross-domain chain | A passing checkpoint plus injected failure at every publish boundary | Old pointer restored or promotion revoked; all immutable evidence retained; descendant pointers invalidated; rerun is deterministic | Mixed old/new state, deleted evidence, surviving descendant PASS, or rollback target not authenticated |
| **BM-6 Release approval** | Whole R28–R33 chain | BM-0..BM-5 evidence bundle | Release owner and independent approver sign `R33-03` with zero open blockers | Any `INCOMPLETE`, `FAIL`, `REOPEN`, hash drift, role collision, or unqualified dependency |

BM-5 cannot close until `GRAPH-GATE-01` passes all shared-ancestor, cycle, duplicate-identity,
and concurrent-rollback vectors; its result hash is part of the BM-6 evidence bundle.

### 3.1 Schema migration acceptance (BM-1)

- [ ] Legacy records are read through a read-only adapter; only canonical v1 records are written.
- [ ] Every old field is classified `preserved`, `derived`, `quarantined`, or `requires-review`; a `requires-review` field cannot promote a task or report.
- [ ] Run/task/track/release hierarchy, validity precedence, score formulas, caps, outcomes, cold/warm rules, calibration, and cost rules match v1.0.0 exactly.
- [ ] Unknown required fields and future schema revisions refuse before any destination or pointer write.
- [ ] Candidate-visible and grader-only bytes are separated before hashing; no gold value, locator, label, or grader note crosses the boundary.
- [ ] A second migration over canonical bytes is byte-identical `NO-OP` and does not alter timestamps, sequence numbers, usage totals, or approval state.

### 3.2 Gold-manifest migration and lock acceptance (BM-2)

The detailed projection and Live-outcome approval procedure is the [`GL-1 gold-lock migration gate`](./2026-09-16-researcher-benchmark-gold-lock-migration-gate.md). BM-2 cannot close on a human matrix alone.

- [ ] Each task has one mutually exclusive expected outcome and a versioned prompt/output contract.
- [ ] Every required claim/constraint has an atomic ID, weight, criticality, scope, source ID, smallest replayable locator, retrieval date, freshness rule, and source hash.
- [ ] Frozen source packages are byte-immutable within the task version; a byte change reopens the task.
- [ ] Live task gold is refreshed, reviewed by two independent gold reviewers, and locked no earlier than seven calendar days before the live run window.
- [ ] The author, two gold reviewers, two graders, and adjudicator are distinct for each task, with conflicts recorded.
- [ ] Per-task calibration and pooled agreement meet the v1.0.0 thresholds; failed calibration remains history and returns the task to `draft`.
- [ ] R29-05 is immutable. Warm qualification may derive only a per-run eligibility digest from it; it may not regenerate or mutate the manifest.
- [ ] `GL-1` is `PASS`: the canonical register contains exactly one projected row for each human trap row, and every Live task has two independent, same-outcome, unexpired approvals tied to the locked source hashes.

### 3.3 Release-report migration acceptance (BM-4)

- [ ] R33-01 is generated only from sealed R26–R32 predecessor hashes; it never reads mutable working-tree state or unsealed drafts.
- [ ] R33-01 records task/track outcomes, validity, retained failures, score formulas, cost evidence, calibration result, source-drift result, and all predecessor hashes.
- [ ] R33-02 has one canonical status with explicit precedence: `not-ready` > `offline-verified` > unexpired `live-verified-until`; it cannot claim benchmark `PASS` unless Q0–Q4 are closed.
- [ ] An expired `live-verified-until` is not a live PASS; publication after expiry requires a new R32 qualification or an explicitly offline-only report.
- [ ] R33-03 is the sole release promotion pointer. It is atomically published only after R33-01 and R33-02 hashes verify.
- [ ] Regenerating the report from the same sealed predecessor set is byte-identical; a changed predecessor creates a new report version.

## 4. Rollback gates

Rollback has two separate meanings and they must not be conflated:

- **Promotion rollback:** revoke one mutable qualification/status pointer while retaining all sealed evidence.
- **Implementation rollback:** revert the complete package commit (code, schemas, tests, docs, and its promotion adapter) only when the package’s declared compatibility boundary remains readable. It must not leave a later package claiming compatibility with a removed schema.

| Gate | Trigger | Required action | PASS condition after rollback |
|---|---|---|---|
| **RB-1 Schema** | R28 schema/hash/parser defect or contract supersession | Revoke R28-04; retain R28-01..03 and mismatch tests; block R29+; use the last compatible reader or mark records `BLOCKED` | No R29–R33 pointer is promotable; old records remain readable; no record is reinterpreted under a new schema |
| **RB-2 Gold** | Gold value, claim, constraint, locator, source, calibration, or task-visible bytes change | Revoke R29-06; retain all task versions, reviews, source captures, calibration sheets, and failed batches; reopen affected tasks | All descendant R30–R33 pointers are invalidated; changed tasks receive new versions/hashes; affected candidates are rerun when required by v1.0.0 |
| **RB-3 Frozen evidence** | R30/R31 run, grade, warm-manifest, or comparison defect | Revoke the affected R30/R31 roll-up; retain sealed runs and grades; do not replace a valid failure for release credit | No frozen PASS survives without a valid cold/warm closure against the current R29 lock |
| **RB-4 Live evidence** | Authorization, source drift, repetition, grade, or cost defect | Revoke R32-03/05 promotion; retain authorization, pre/post captures, repetitions, grades, and cost records | No live claim survives; status is `offline-verified` or `not-ready` until a fresh authorized window passes |
| **RB-5 Report** | R33 report/status/hash/provenance defect | Revoke R33-03 and mark R33-01/02 `revoked`; retain the report bytes and defect record | No release pointer references the revoked report; a regenerated report is hash-distinct and uses a passing predecessor closure |
| **RB-6 Descendant closure** | Any RB-1..RB-5 rollback or `REOPEN` | Transitively revoke every descendant promotion pointer whose predecessor closure includes the affected hash | No descendant pointer remains `ready`, `PASS`, or live-verified while an ancestor is revoked/reopened |
| **RB-7 Crash recovery** | Interruption during snapshot, write, fsync, rename, or pointer swap | Recover from authenticated snapshot or prior pointer; quarantine ambiguous new bytes | Exactly one known-good pointer state; no partial artifact is visible; all attempts are retained |

### 4.1 Descendant invalidation rule

The detailed R26–R33 closure and atomic rollback contract is [`2026-09-16-researcher-r26-r33-descendant-invalidation-atomic-rollback.md`](./2026-09-16-researcher-r26-r33-descendant-invalidation-atomic-rollback.md). The rule below is its release-gate summary.

Promotion validity is a hash-closed graph, not a filename chain. A pointer is promotable only when every transitive predecessor is present, sealed, hash-matching, unrevoked, unexpired, and at its required state. Revoking R28, for example, invalidates R29, R30, R31, R32, and R33 promotion pointers without deleting any of their records. Re-promotion requires a new pointer and a fresh gate check; it never silently resurrects the old pointer.

### 4.2 Rollback evidence record

Every rollback writes an append-only record containing:

- affected package and artifact IDs;
- trigger classification and exact predecessor hash;
- old pointer/hash and replacement pointer/hash (or explicit absence);
- descendant pointers revoked;
- snapshot/rollback-token hash and actor/time;
- evidence retained and any required rerun/version bump;
- final state: `ROLLED-BACK`, `BLOCKED`, `REOPEN`, or `RETIRED`.

The rollback record itself is sealed before any new promotion attempt. A rollback that cannot prove the prior pointer state is `BLOCKED`, not “best effort.”

## 5. Release-review worksheet

The release reviewer records one row per gate and one row per artifact. Empty evidence is `INCOMPLETE`.

| Gate/artifact | Input hash set | Semantic checks | Sealing check | Role check | Rollback rehearsal | Disposition |
|---|---|---|---|---|---|---|
| BM-0 inventory/snapshot |  |  |  |  |  |  |
| BM-1 R28 schema |  |  |  |  |  |  |
| BM-2 R29 gold lock |  |  |  |  |  |  |
| BM-3 R30/R31/R32 evidence |  |  |  |  |  |  |
| BM-4 R33 report/status |  |  |  |  |  |  |
| BM-5 rollback rehearsal |  |  |  |  |  |  |
| BM-6 release approval |  |  |  |  |  |  |

Release `PASS` requires BM-0 through BM-6 `PASS`, 24/24 task locks, Q0–Q4 closed, no descendant pointer left valid after a rollback, and an unexpired status consistent with R33-02. `INCOMPLETE`, `FAIL`, or `REOPEN` at any required row blocks release.

## 6. Evidence retention and non-negotiable prohibitions

- Failed migrations, failed calibrations, invalid runs, source-drift captures, cost discrepancies, revoked reports, and rollback records are retained.
- No operator may edit a sealed payload, replace a failed run for release credit, average away calibration disagreement, or delete a predecessor to make a graph appear closed.
- No gold, hidden locator, grader label, or calibration note may appear in candidate-visible bytes.
- No migration or rollback may recapture a source or spend a paid request; live work remains separately authorized under R32.
