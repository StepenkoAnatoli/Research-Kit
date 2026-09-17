# Offline BM/RB sign-off validator

**Status:** normative validator contract; specification only  
**Applies to:** completed BM-0-BM-6 and RB-1-RB-7 forms, the roll-up worksheet, and their sealed evidence  
**Hash profile:** `researcher-benchmark-c14n-v1`  
**Companions:** [BM/RB blank forms](2026-09-16-researcher-benchmark-bm-rb-evidence-signoff/README.md), [roll-up worksheet](2026-09-16-researcher-bm-rb-rollup-worksheet.md), [migration/rollback gates](2026-09-16-researcher-benchmark-migration-rollback-gates.md), and [canonicalization vectors](2026-09-16-researcher-benchmark-canonicalization-conformance-vectors.md)

This contract defines an offline, read-only validator for completed gate forms. It checks that
the human form, normalized sidecar, roll-up, role roster, ledger, pointers, and evidence
manifest agree. It never fills a blank, repairs a hash, changes a pointer, creates a fixture,
recaptures a source, accesses a credential, or spends a benchmark credit.

## 1. Invocation and boundary

The eventual command is:

```text
researcher-benchmark bm-rb-signoff-validate \
  --forms <completed-form-directory> \
  --rollup <completed-rollup.md> \
  --records <normalized-record-directory> \
  --evidence <evidence-manifest.json> \
  --roles <authenticated-role-roster.json> \
  --ledger <qualification-ledger-root> \
  --root <approved-release-root> \
  --at <UTC-validation-time> \
  --report <report.json>
```

The command reads only supplied paths and manifest-named files. All paths are repository-
relative POSIX paths under `--root`; absolute paths, drive/UNC prefixes, traversal, symlink
escapes, duplicate JSON keys, invalid UTF-8, BOMs, CRLF, unknown profiles, and future schema
versions are rejected before evidence is trusted. Only the explicitly requested report path
may be written.

### Exit contract

| Exit | Result | Meaning |
|---:|---|---|
| 0 | `PASS` | All fourteen forms, roll-up fields, hashes, evidence, roles, dependencies, and status rules pass. |
| 1 | `FAIL` | Present evidence is malformed, contradictory, tampered, unauthorized, or not qualified. |
| 2 | `INCOMPLETE` | A required form field, evidence item, hash, role, signature, or predecessor is absent. |
| 3 | `BLOCKED` | Ledger/graph/recovery state is ambiguous or cannot be authenticated safely. |
| 4 | `USAGE` | Invocation, root, profile, validation-time, or schema arguments are invalid. |

`NOT-READY` is a valid computed release decision but never a validator `PASS`.

## 2. Input bundle

| Input | Required contents | Authority |
|---|---|---|
| Completed BM/RB Markdown forms | One fixed-template form for BM-0-BM-6 and RB-1-RB-7 | Human attestations and row labels |
| Completed roll-up worksheet | Fourteen statuses, hashes, dependencies, blockers, and final decision | Cross-form summary; must project from forms |
| Normalized sidecars | Strict JSON record for each form and the roll-up | Machine projection; no values may exist only here |
| Evidence manifest | Content-addressed evidence files and predecessor evidence IDs | Paths, profiles, byte lengths, and SHA-256 |
| Role roster | Authenticated principal-to-role assignments and validity intervals | Role and independence authority |
| Ledger/pointers | Genesis, segments, head, current/history pointers, recovery receipts | Commit, chain, pointer, and closure authority |

The manifest may include retained failures, quarantine bytes, and superseded records, but an
unreferenced file is reported as `EVIDENCE-UNREFERENCED`; it cannot silently satisfy a blank row.

### 2.1 Strict normalized form record

Each sidecar has the following logical shape (schema-shaped, with no real release values):

```json
{
  "recordVersion": "1.0.0",
  "formVersion": "1.0.0",
  "gateId": "BM-0|BM-1|BM-2|BM-3|BM-4|BM-5|BM-6|RB-1|RB-2|RB-3|RB-4|RB-5|RB-6|RB-7",
  "candidateId": "<release candidate>",
  "reviewCwd": "<repository-relative root>",
  "formPath": "<relative Markdown path>",
  "formSha256": "<canonical Markdown SHA-256>",
  "status": "PASS|INCOMPLETE|FAIL|REOPEN|BLOCKED|ROLLED-BACK",
  "triggered": true,
  "ownerPrincipalId": "<authorized owner>",
  "reviewerPrincipalId": "<reviewer>",
  "verifierPrincipalId": "<independent verifier>",
  "evidenceIds": ["<IDs in fixed form-row order>"],
  "evidenceHashes": ["<lowercase SHA-256 values in the same order>"],
  "predecessorEvidenceIds": ["<ordered predecessor IDs>"],
  "rollbackTargetHash": "<hash or null>",
  "blockerIds": [],
  "attestations": {"requiredRowsComplete": true, "hashesRecomputed": true, "rolesChecked": true},
  "signature": {"principalId": "<signer>", "role": "<role>", "signerKeyId": "<key>", "signedAt": "<UTC>", "statementSha256": "<hash>", "signature": "<Ed25519 signature>"}
}
```

The JSON Schema sets `additionalProperties: false` at every object, requires all fields shown,
requires exactly one record for each gate ID, and constrains hashes to lowercase 64-character
SHA-256. `rollbackTargetHash` may be null only with a recorded reason on the form. `triggered`
is mandatory so a rollback gate cannot be silently skipped.

### 2.2 Evidence manifest rules

Each `evidenceId` is unique and maps to exactly one manifest entry containing `gateId`,
`artifactId`, relative `path`, canonicalization `profile`, byte length, SHA-256, and ordered
predecessor evidence IDs. The validator recomputes bytes using the declared profile and rejects
missing files, wrong byte lengths, wrong hashes, profile changes, path escapes, and predecessor
IDs outside the manifest or authenticated external roots.

## 3. Form projection and required evidence

Forms are fixed templates. The parser matches gate IDs, headers, and row labels exactly,
rejects duplicate/unknown rows, and projects cells losslessly into the sidecar. A sidecar value
that is absent from or different from the Markdown form is `FORM-PROJECTION-MISMATCH`.

| Gate | Required evidence families | Additional PASS condition |
|---|---|---|
| BM-0 | Inventory/snapshot, registry, role roster, R26/R27/G3 roots, path/visibility proof | Every artifact family is tracked once and root-contained |
| BM-1 | v1 schema/profile, read-old/write-v1 proof, canonicalization vectors, unknown-version refusal, compatibility report | No field drop, override, future-schema acceptance, or candidate/gold mixing |
| BM-2 | 24 task locks, task-visible/gold/source/warm manifests, calibration, GL-1 projection, Live approvals | Exactly one trap projection per row; four Live tasks have independent same-outcome approvals |
| BM-3 | R30/R31/R32 runs, grades, adjudications, cost/cap/containment reports | Invalid runs and hard failures are retained and not counted as PASS |
| BM-4 | R33 report/status/pointer, predecessor manifest, source/cost/calibration roll-ups | Report regenerates from sealed predecessors and status agrees with pointer |
| BM-5 | Rollback plans, crash-point results, graph test report, before/after pointer hashes, ledger receipts, closure proof | No mixed pointer state; recovery is deterministic and evidence is retained |
| BM-6 | All BM/RB forms, completed roll-up, C14N/GRAPH gates, final lock, R33-03 proof | Zero open blockers and eligible R33-03 are required for PASS |
| RB-1 | R28 schema pointer, prior hash, compatibility evidence, rollback receipt | No descendant promotion while schema rollback is open |
| RB-2 | R29 gold/source/calibration hashes, affected tasks, rollback pointer, descendant records | Changed tasks are versioned/requalified; no candidate gold exposure |
| RB-3 | R30/R31 runs, grades, roll-ups, frozen manifests, rollback pointer | No frozen PASS survives without current R29 closure |
| RB-4 | Authorization, pre/post source captures, repetitions, grades, cost, expiry, rollback pointer | Authorization precedes access and no expired Live claim remains |
| RB-5 | R33 report/status/pointer, report hash, predecessor closure, revoke record | Revoked report cannot be referenced by a current release pointer |
| RB-6 | Registry closure, ordered affected set, promotion-revoke records, tombstones, idempotency proof | Every transitive descendant is revoked/replaced exactly once |
| RB-7 | Crash matrix, durable boundaries, head/segment hashes, recovery receipts, before/after pointers, rerun proof | One known-good state only; ambiguity is BLOCKED and never PASS |

Evidence IDs must appear in the exact form-row order. Citing another gate's artifact as a
substitute, citing only a filename, or citing a hash without its manifest entry is a failure.

## 4. Validation pipeline

The validator runs every stage and reports all errors, but later stages cannot turn an earlier
hard failure into a pass:

1. **Input/schema:** validate invocation, profile, UTF-8/LF, strict sidecars, unique gate set,
   and fixed form structure.
2. **Form projection:** recompute Markdown hashes and prove each sidecar/roll-up value is
   present in the corresponding form row.
3. **Evidence bytes:** resolve manifest entries, recompute byte lengths and hashes, verify
   profiles, and enforce root containment.
4. **Artifact integrity:** validate R28-R33 envelopes, canonical hashes, signatures,
   manifests, pointer links, and benchmark/role-roster hashes.
5. **Ledger and graph:** verify genesis, chain/head, prepare/commit or abort pairing,
   promotion records, pointer history, predecessor closure, revocations, expiry, cycles, and
   duplicate descendants.
6. **Role separation:** resolve every owner, reviewer, verifier, signer, author, grader,
   adjudicator, and recovery actor against the authenticated roster and assignment interval.
7. **Gate semantics:** apply the gate-specific evidence and threshold rules in Section 3 and
   verify every dependency is closed before its dependent form claims `PASS`.
8. **Status reduction:** calculate effective statuses and compare them with every form,
   roll-up row, and final decision.
9. **Rollback/recovery:** reject open invalidations, revoked ancestors, stale Live approvals,
   unresolved prepares, mixed pointer states, missing recovery receipts, and unproven targets.
10. **Report:** emit a canonical, hash-addressed report with stable error ordering and the
    complete input hash set.

## 5. Role and signature enforcement

The validator checks both the signed attestation and the assignment relationship:

- `ownerPrincipalId`, `reviewerPrincipalId`, and `verifierPrincipalId` must be authorized for
  the gate and valid at the recorded UTC time.
- Reviewer and independent verifier must be distinct from each other and from the accountable
  owner. A role collision is `ROLE-COLLISION`, even if every signature verifies.
- BM-2 additionally requires gold author, two gold reviewers, two graders, and adjudicator
  separation as required by the benchmark release checklist.
- RB-7 recovery actor cannot be the independent verifier for the same recovery evidence.
- Each signature is Ed25519 over the canonical statement identified by `statementSha256`;
  `signerKeyId` must resolve to that principal's active roster key.
- A signature copied from another form, signed outside its assignment interval, or attached to
  a different form hash is invalid.

## 6. Status precedence and dependency rules

The validator preserves the exact status on each form and computes an effective status from
evidence. Missing required material maps to `INCOMPLETE`; malformed, contradictory, tampered,
unauthorized, or threshold-failing material maps to `FAIL`; a locked-input change maps to
`REOPEN`; an unauthenticated graph or recovery state maps to `BLOCKED`; an executed pointer
rollback maps to `ROLLED-BACK`.

For deterministic roll-up display, the dominant status order is:

`REOPEN > FAIL > BLOCKED > ROLLED-BACK > INCOMPLETE > PASS`.

This display order extends the governing `REOPEN > FAIL > INCOMPLETE > PASS` reduction for the
BM/RB form family; it does not make any non-`PASS` state promotable. The computed release
decision is `PASS` only when all fourteen forms are `PASS`, all dependencies are `PASS`, every
required hash/role/signature/evidence check passes, no blocker is open, and R33-03 is eligible.

Dependency rules:

1. BM gates must pass in order BM-0 through BM-6.
2. RB-1 through RB-5 may only reference the BM predecessor appropriate to their package;
   RB-6 requires all applicable rollback rows and GRAPH-GATE-01; RB-7 requires BM-5 and RB-6.
3. A dependent form claiming `PASS` while a predecessor is `INCOMPLETE`, `FAIL`, `REOPEN`,
   `BLOCKED`, or `ROLLED-BACK` is `STATUS-PRECEDENCE` failure.
4. An `OPEN` or `MITIGATED` blocker keeps the roll-up `NOT-READY`; `CLOSED` requires a linked
   verification hash and independent reviewer.
5. A rollback target must be sealed, signed, unrevoked, unexpired, and closure-valid. A
   descendant pointer whose closure contains an invalidated hash cannot pass.

## 7. Stable errors and report shape

Errors use stable codes and include `gateId`, form row or JSON Pointer, expected value,
observed value, and supporting evidence IDs. Required codes include:

| Code | Condition | Result |
|---|---|---|
| `FORM-MISSING` / `FORM-SHAPE` / `FORM-HASH` | Missing, non-canonical, duplicate/unknown row, or byte mismatch | `INCOMPLETE`/`FAIL` |
| `FORM-PROJECTION-MISMATCH` | Sidecar or roll-up differs from Markdown form | `FAIL` |
| `RECORD-SCHEMA` / `ROLLUP-SCHEMA` | Unknown property, missing key, wrong type, or duplicate gate | `FAIL`/`INCOMPLETE` |
| `EVIDENCE-MISSING` / `EVIDENCE-UNREFERENCED` | Referenced evidence absent or unowned extra | `INCOMPLETE`/`FAIL` |
| `EVIDENCE-PATH` / `EVIDENCE-LENGTH` / `EVIDENCE-HASH` | Escape, byte-length, profile, or hash mismatch | `FAIL` |
| `ROLE-UNAUTHORIZED` / `ROLE-COLLISION` / `SIGNATURE-INVALID` | Role, independence, interval, or signature defect | `FAIL` |
| `LEDGER-CHAIN` / `LEDGER-UNCOMMITTED` / `POINTER-LINK` | Chain, commit, pointer, history, or head defect | `FAIL`/`BLOCKED` |
| `PREDECESSOR-MISSING` / `PREDECESSOR-MISMATCH` / `GRAPH-CYCLE` | Closure absent, reordered, revoked, or cyclic | `INCOMPLETE`/`FAIL` |
| `GATE-EVIDENCE` / `GATE-DEPENDENCY` | Required evidence family absent or predecessor not PASS | `INCOMPLETE`/`FAIL` |
| `STATUS-PRECEDENCE` / `FINAL-DECISION-MISMATCH` | Form/roll-up status contradicts computed result | `FAIL` |
| `ROLLBACK-OPEN` / `RECOVERY-AMBIGUOUS` / `LIVE-EXPIRED` | Open invalidation, ambiguous recovery, or expired Live claim | `REOPEN`/`BLOCKED` |

The report is canonical JSON and contains validator version, validation time, all input
hashes, fourteen gate results, dominant status, computed decision, ordered errors, and report
hash. Repeating validation over unchanged inputs is byte-identical when the supplied validation
time is unchanged. A failed report is retained and is never overwritten by a later pass.

## 8. Acceptance criteria

- [ ] A complete, hash-consistent, role-valid set of fourteen forms passes only when all gate
  dependencies and semantic requirements pass.
- [ ] Any blank required field/evidence/hash/role/signature is `INCOMPLETE` and blocks release.
- [ ] Any tamper, contradiction, role collision, invalid signature, threshold failure, graph
  defect, or pointer defect is `FAIL` or `BLOCKED` as specified.
- [ ] Form/sidecar/roll-up projection is lossless; unknown rows/properties and duplicate gates
  are rejected.
- [ ] Status precedence is deterministic and a non-`PASS` predecessor cannot be hidden by a
  later form or roll-up value.
- [ ] All rollback and crash-recovery evidence remains retained and addressable.
- [ ] The validator is offline, read-only, deterministic, and credit-free.

