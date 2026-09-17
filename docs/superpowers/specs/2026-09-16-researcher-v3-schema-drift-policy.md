# Future-schema drift policy: v3 detection and migration blocking

**Status:** normative design; documentation only  
**Current supported artifact schema:** v2  
**Current benchmark contract:** v1.0.0  
**Related compatibility packet:** [`2026-09-16-researcher-v2-migration-compatibility.md`](../plans/2026-09-16-researcher-v2-migration-compatibility.md)  
**No execution:** this policy authorizes no migration, fixture, fault test, live request, or credit spend.

This policy treats any v3 or otherwise future artifact as an explicit compatibility event. The system must detect it automatically, block migration before the first destination or pointer write, and remain blocked until an ADR, compatibility-matrix update, and independently reviewed rollback proof are all approved as one versioned change set.

The compact blank reviewer form is [`2026-09-16-researcher-v3-schema-drift-signoff-form.md`](2026-09-16-researcher-v3-schema-drift-signoff-form.md).

## 1. Detection contract

The detector runs before inventory publication, schema conversion, pointer update, ledger append, or source recapture. It evaluates the complete transitive artifact set, including referenced predecessors and manifests.

| Signal | Classification | Required result |
|---|---|---|
| `artifactSchema.major > 2` (including `3`) | `FUTURE_SCHEMA` | Block migration; emit drift evidence |
| Unknown required field, discriminator, enum, or versioned section | `FUTURE_SCHEMA` | Block migration; name the field and artifact |
| `artifactSchema` absent, malformed, or contradictory across envelope/front matter | `INVALID_SCHEMA` | Block migration; do not guess v2 |
| Payload declares v3 while manifest/hash claims v2 | `SCHEMA_HASH_CONFLICT` | Block migration; retain tamper evidence |
| Any predecessor or referenced artifact is v3/future | `TRANSITIVE_FUTURE_SCHEMA` | Block the entire dependency closure, not only the first file |
| `benchmarkSpecVersion` is newer than the approved v1.0.0 contract | `FUTURE_CONTRACT` | Block benchmark reads, grading, and release promotion |
| Unknown optional field explicitly listed in the v2 schema extension registry | `KNOWN_EXTENSION` | Preserve bytes and continue only if the registry says it is semantically inert |
| Unknown optional field not in the registry | `UNREGISTERED_EXTENSION` | Block until reviewed; optional does not mean ignorable |

Detection compares both declared version and observed required-field/discriminator set. A forged `artifactSchema: 2` around v3-only fields is not downgraded; it is `SCHEMA_HASH_CONFLICT` or `INVALID_SCHEMA`.

## 2. Hard-block behavior

On any future or incompatible signal:

- Return `BLOCKED` with a stable reason code, artifact ID/path, observed version, supported version, and dependency path.
- Write no v2 destination, replacement file, current pointer, ledger append, usage record, approval transition, or release promotion.
- Do not auto-downgrade, strip fields, recapture sources, overwrite the manifest, or reinterpret v3 bytes as v2.
- Preserve the original bytes and existing authenticated pointers. A diagnostic may be written only to the dedicated, non-migrated diagnostics area and must contain hashes, not secrets.
- Mark every dependent artifact and release gate as blocked or reopened according to its current state. A clean sibling artifact cannot close the gate while the dependency closure is blocked.
- Require the operator to name the drift report ID in the next review; a command-line override cannot authorize migration.

The only automatic terminal outcomes before approval are `BLOCKED` or `NO-OP` when the complete input is already canonical v2. `MIGRATED` is impossible for v3 input until the approval bundle in Section 4 is complete.

## 3. Drift evidence record

The detector emits a sealed `future-schema-drift.json` outside the migration destination set. It contains:

- `driftId`, UTC detection time, project root, detector version, and supported schema/contract versions;
- each affected artifact ID/path, observed schema, required-field/discriminator diff, and body/front-matter/manifest hashes;
- the transitive predecessor path and dependent release gates;
- detector result (`FUTURE_SCHEMA`, `INVALID_SCHEMA`, `SCHEMA_HASH_CONFLICT`, `TRANSITIVE_FUTURE_SCHEMA`, `FUTURE_CONTRACT`, or `UNREGISTERED_EXTENSION`);
- authenticated snapshot/reference to the unchanged pre-detection state;
- the approval-bundle ID required to clear the block;
- actor and verifier IDs, without credentials or source secrets.

The drift record is evidence of refusal, not permission to proceed. Editing it, deleting it, or changing its hashes leaves the project blocked.

## 4. Approval bundle and migration gates

The approval bundle has one immutable bundle ID and one content hash. Every member names the same drift ID, target v3 schema version, affected artifact set, and predecessor hashes.

| Gate | Required artifact | Minimum contents | Approval required | Gate result |
|---|---|---|---|---|
| **SD-0 Detect** | `future-schema-drift.json` | Detection classification, hashes, field diff, dependency closure, unchanged-pointer proof | Detector owner + verifier | `PASS` only when drift is reproducibly detected and migration is blocked |
| **SD-1 ADR** | `docs/adr/ADR-<id>-schema-v3.md` | Problem, scope, v3 semantics, compatibility decision, rejected alternatives, version bump, security/ToS impact, expiry/review trigger, rollout and rollback design | Architecture owner + benchmark owner | `PASS` only when ADR is accepted and references the drift hash |
| **SD-2 Matrix update** | Updated compatibility and fault matrices | One row per affected artifact; legacy/v3 input, canonical output, invariants, refusal rules, owner, rollback unit, FI cases, migration/release gates, and matrix hash | Compatibility owner + independent reviewer | `PASS` only when the update is complete, internally consistent, and hash-linked to the ADR |
| **SD-3 Rollback proof** | `v3-rollback-proof.json` plus sealed test evidence | Snapshot hashes, temp-write/fsync/publish interruption results, exact pointer/byte restoration, idempotent rerun, descendant invalidation, retained-history proof, and out-of-root refusal | Recovery owner + independent verifier | `PASS` only when every affected artifact family has a deterministic proof |
| **SD-4 Approval bundle** | `schema-drift-approval.json` | SD-0..SD-3 hashes, role/conflict check, target schema, implementation package, migration window, and expiry | Release approver independent of authors | `PASS` unlocks only the named v3 migration package |
| **SD-5 v3 migration** | Versioned migration manifest | Read-old/write-v3 proof, semantic dispositions, v3 hashes, package checkpoint, rollback token, and post-publish re-read | Migration owner + release reviewer | `PASS` only after SD-4; otherwise `BLOCKED` |

No gate may be satisfied by a prose reference alone. Missing, stale, unsealed, or hash-mismatched members keep SD-4 `BLOCKED`.

### 4.1 ADR minimum fields

The ADR must state whether v3 is a schema-major change or an extension, which v2 readers remain supported, the exact meaning of every changed/added/removed field, whether benchmark task/report versions change, and the trigger that expires the decision. It must not silently alter benchmark v1.0.0 scoring, outcomes, or hard-failure rules; those require a separate approved benchmark version/ADR.

### 4.2 Matrix-update minimum fields

The update must modify every affected row in the v2 compatibility matrix and the FI traceability matrix. It must add any new artifact IDs, owners, migration/release gates, refusal status, rollback unit, and fault cases. The old v2 row remains historical; it is not overwritten to make v3 appear backward-compatible.

### 4.3 Rollback-proof minimum cases

The proof must cover at least: malformed/unknown v3 input; short write; interruption after fsync before publish; pointer-swap crash; post-publish hash mismatch; ledger/prefix protection; destination collision/path escape; and rerun after both successful migration and rollback. Every case records old/new hashes, pointer state, status, and retained evidence.

## 5. Reopen and rollback rules after v3 approval

- Approval is scoped to the exact drift ID, artifact set, target schema, and migration package. A new v3 field, discriminator, predecessor, or benchmark contract creates a new drift event and returns to SD-0.
- Any change to the ADR, matrix, rollback proof, or approval bundle after SD-4 invalidates SD-4 and blocks migration until all affected hashes and approvals are renewed.
- A failed or interrupted v3 migration restores the authenticated v2 snapshot/pointer or remains `BLOCKED`; it never leaves a mixed v2/v3 closure.
- Reverting the v3 migration package revokes only its promotion/current pointer and derived status. It retains v2/v3 source bytes, manifests, review decisions, migration logs, and failed proof cases.
- Revoking or reopening the v3 pointer transitively revokes every descendant benchmark, qualification, and release pointer whose predecessor closure includes the v3 hash.
- A v3 migration cannot be “rolled back” by relabeling v3 bytes as v2. Returning to v2 requires a separately specified, hash-verified reverse migration or restoration of the authenticated v2 snapshot.
- If the rollback proof is unavailable, stale, or cannot authenticate the prior pointer, the only permitted result is `BLOCKED`.

## 6. Status and override policy

| Condition | Status | Allowed next action |
|---|---|---|
| v3 detected, no approval bundle | `BLOCKED` | Author SD-1–SD-4 only; no migration |
| ADR or matrix updated but rollback proof pending | `BLOCKED` | Complete SD-3; no migration |
| Approval bundle stale/changed/expired | `REOPEN` | Re-run affected approval gates |
| SD-4 approved, named package not started | `AUTHORIZED` | Execute only the scoped SD-5 package |
| v3 migration failed or was interrupted | `ROLLED-BACK` or `BLOCKED` | Restore/verify v2; retain evidence; no retry without valid state |
| v3 migration and post-publish proof pass | `MIGRATED` | Downstream gates may inspect the sealed v3 manifest |

`--force`, `--no-verify`, local hooks, deleting the drift report, changing the supported-version constant, or manually editing a pointer cannot clear a future-schema block. Any observable override is recorded and still leaves SD-4 closed only when the approval bundle is valid.

## 7. Reviewer sign-off

| Attestation | Evidence/hash | Reviewer |
|---|---|---|
| v3 detection is reproducible and migration was write-blocked |  |  |
| ADR is accepted and linked to the exact drift |  |  |
| Compatibility and FI matrices are updated without erasing v2 history |  |  |
| Rollback proof covers every affected artifact and interruption boundary |  |  |
| Roles are independent and approval bundle hashes match |  |  |
| Descendant pointers are blocked/revoked before migration |  |  |
| Final disposition: `BLOCKED` / `AUTHORIZED` / `MIGRATED` / `ROLLED-BACK` |  |  |

Migration may begin only after all attestations are signed and SD-4 is `PASS`.
