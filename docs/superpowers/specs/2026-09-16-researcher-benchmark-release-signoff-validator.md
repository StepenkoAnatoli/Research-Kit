# v1.0 release sign-off and evidence-hash validator

**Status:** normative validator contract; documentation only  
**Applies to:** completed v1.0 release sign-off forms, Q0–Q5 evidence, R28–R33 envelopes, and promotion pointers  
**Governing form:** [`2026-09-16-researcher-benchmark-v1-release-signoff-form.md`](./2026-09-16-researcher-benchmark-v1-release-signoff-form.md)  
**Fillable form:** [release sign-off AcroForm PDF](../../../../output/pdf/researcher-benchmark-v1-release-signoff-acroform.pdf)  
**Gate matrix:** [`2026-09-16-researcher-benchmark-v1-release-gate-evidence-matrix.md`](./2026-09-16-researcher-benchmark-v1-release-gate-evidence-matrix.md)  
**Hash profile:** `researcher-benchmark-c14n-v1`  
**Reopen/rollback log:** [`release reopen/rollback/requalification log template`](./2026-09-16-researcher-release-reopen-rollback-requalification-log-template.md)  
**No execution:** the validator is offline and read-only; it creates no fixtures, source captures, credentials, network calls, or paid requests.

This contract defines how a completed human sign-off form becomes a machine-checkable release decision. The Markdown form remains the attestation source. A strict normalized sidecar and an evidence manifest make every form cell, signature, gate status, evidence reference, and hash auditable without trusting filenames or free text.

## 1. Validator boundary and invocation

The eventual command is:

```text
researcher-benchmark signoff-validate \
  --form <completed-release-signoff.md> \
  --record <normalized-signoff.json> \
  --evidence <evidence-manifest.json> \
  --root <approved-release-root> \
  --at <UTC-validation-time> \
  --json <report.json>
```

The command must:

- read only the supplied form, normalized record, evidence manifest, and files named by that manifest;
- reject absolute paths, traversal, symlinks outside the approved root, duplicate JSON keys, invalid UTF-8, and unknown schema versions;
- recompute every declared hash from bytes using the registered serialization profile;
- validate R28–R33 envelopes, predecessor closures, ledger links, and promotion pointers through the existing release validators;
- write only the explicitly requested report path; and
- emit a deterministic report containing all errors and the input hashes.

Exit status is fixed:

| Exit | Status | Meaning |
|---:|---|---|
| 0 | `PASS` | The form, normalized record, evidence hashes, signatures, gates, and pointers are all valid. |
| 1 | `FAIL` | Supplied content is present but malformed, contradictory, tampered, unauthorized, or not release-qualified. |
| 2 | `INCOMPLETE` | A required form field, evidence item, signature, hash, or predecessor is absent. |
| 3 | `USAGE` | Invocation, schema, profile, or validation-time arguments are invalid. |

`FAIL` and `INCOMPLETE` are rejection states. `NOT-READY` is a valid final form decision but never a validator `PASS`.

## 2. Canonical input bundle

The validator consumes three coordinated artifacts:

| Artifact | Purpose | Authority |
|---|---|---|
| Completed Markdown form | Human-readable attestations and gate rows | Source of reviewer statements; fixed labels and row order |
| Normalized sign-off record | Strict machine representation of every form field | Must project losslessly from the form |
| Evidence manifest | Content-addressed files supporting each row | Authority for paths, byte lengths, profiles, and SHA-256 values |

The record and manifest are grader-only. They must not be copied into a candidate-visible export.

### 2.1 Normalized sign-off record

The following is the required logical shape. It is schema-shaped and contains no real release values:

```json
{
  "recordVersion": "1.0.0",
  "formVersion": "1.0.0",
  "candidateId": "<release-candidate-id>",
  "reviewCwd": "<approved repository-relative root>",
  "benchmarkSpecVersion": "1.0.0",
  "benchmarkSpecSha256": "<64 lowercase hex>",
  "formPath": "<relative Markdown path>",
  "formSha256": "<canonical Markdown SHA-256>",
  "evidenceManifestSha256": "<canonical manifest SHA-256>",
  "gates": [
    {
      "gateId": "Q0",
      "status": "PASS",
      "ownerPrincipalId": "<authorized owner>",
      "verifierPrincipalId": "<independent verifier>",
      "evidenceIds": ["<manifest evidence IDs in form order>"],
      "rollbackRecordIds": []
    }
  ],
  "portfolio": {
    "taskLockCount": 24,
    "frozenCount": 20,
    "liveCount": 4,
    "categoryCounts": {"stable": 4, "volatile": 4, "contradiction": 4, "unavailable": 4, "constraints": 4, "adversarial": 4},
    "difficultyCounts": {"basic": 6, "intermediate": 12, "adversarial": 6},
    "evidenceIds": ["<manifest evidence IDs>"]
  },
  "calibration": {
    "criticalAgreement": true,
    "outcomeAgreement": true,
    "componentDeltaPercentagePoints": 5,
    "pooledObservations": 30,
    "pooledTasks": 4,
    "rawLevelCounts": {"0": 2, "0.5": 2, "1": 2},
    "weightedKappa": 0.8,
    "evidenceIds": ["<manifest evidence IDs>"]
  },
  "rollback": {
    "openInvalidations": false,
    "lastPassingManifestEvidenceId": "<manifest evidence ID>",
    "retentionAttested": true,
    "evidenceIds": ["<manifest evidence IDs>"]
  },
  "finalDecision": "PASS",
  "decisionReason": "<required when NOT-READY; concise attestation rationale>",
  "signatures": {
    "reviewer": {"principalId": "<id>", "role": "release-reviewer", "signerKeyId": "<key-id>", "signedAt": "<UTC timestamp>", "statementSha256": "<64 lowercase hex>", "signature": "<Ed25519 signature bytes>"},
    "independentVerifier": {"principalId": "<id>", "role": "independent-release-verifier", "signerKeyId": "<key-id>", "signedAt": "<UTC timestamp>", "statementSha256": "<64 lowercase hex>", "signature": "<Ed25519 signature bytes>"},
    "releaseOwner": {"principalId": "<id>", "role": "release-owner", "signerKeyId": "<key-id>", "signedAt": "<UTC timestamp>", "statementSha256": "<64 lowercase hex>", "signature": "<Ed25519 signature bytes>"}
  }
}
```

The machine schema for this record must set `additionalProperties: false` at the root and every nested object, require all listed keys except `decisionReason` when `finalDecision` is `PASS`, and constrain:

- `recordVersion`, `formVersion`, and `benchmarkSpecVersion` to `1.0.0`;
- `gates` to exactly six unique entries with IDs `Q0` through `Q5` in order;
- gate and final statuses to the form vocabulary (`PASS`, `INCOMPLETE`, `FAIL`, `REOPEN`, and `NOT-READY` only where specified);
- every hash to lowercase hexadecimal SHA-256;
- `taskLockCount`, track/category/difficulty counts, and calibration thresholds to the v1.0 values; and
- every signature role to the role roster, with distinct principals where the governing matrix requires independence.

Each signature is Ed25519 over the canonical attestation statement identified by `statementSha256`; `signerKeyId` must resolve to the principal's currently authorized public key in the role roster. The validator verifies the signature over the statement hash and rejects a signature copied from another form, a key belonging to another principal, or a timestamp outside the assignment interval.

The schema validates shape and enums. The validator performs the byte, cross-artifact, status-precedence, role, and pointer checks below.

### 2.2 Evidence manifest

The manifest is canonical JSON with this strict entry shape:

```json
{
  "manifestVersion": "1.0.0",
  "root": "<approved repository-relative release root>",
  "entries": [
    {
      "evidenceId": "Q1-R29-06",
      "gateId": "Q1",
      "artifactId": "R29-06",
      "path": "<relative path>",
      "profile": "researcher-benchmark-c14n-v1-json|researcher-benchmark-c14n-v1-text|researcher-benchmark-c14n-v1-jsonl|opaque-bytes",
      "byteLength": 0,
      "sha256": "<64 lowercase hex>",
      "predecessorEvidenceIds": []
    }
  ]
}
```

`evidenceId` is unique; `path` is repository-relative POSIX syntax with no traversal, drive/UNC prefix, or symlink. `artifactId` is required for R28–R33 artifacts and must match the envelope. `predecessorEvidenceIds` are ordered and must resolve only to manifest entries or authenticated external roots. An evidence entry with a missing file, wrong byte length, wrong profile, or mismatched SHA-256 is `FAIL`; an absent entry referenced by the form is `INCOMPLETE`.

The manifest must include, at minimum, the evidence named by every non-empty form row, the six gate roll-ups, the portfolio/calibration records, the rollback record, the R33 report/status/pointer, and the complete predecessor closure required by Q0–Q5. It may include retained failures, but an unreferenced extra file is not evidence and is reported as `EVIDENCE-UNREFERENCED`.

## 3. Form-to-record projection

The parser treats the printed form as a fixed template, not free-form Markdown. It matches table headers and row labels exactly, rejects duplicate labels, and projects cells without interpretation.

| Form section | Required projection | Blank/contradictory result |
|---|---|---|
| Review identity | `candidateId`, `reviewCwd`, benchmark version/hash, reviewer/verifier/owner IDs | `INCOMPLETE` |
| Gate sign-off | Six ordered `gates[]` entries, status, evidence IDs/hashes, rollback/reopen IDs | Blank status/evidence is `INCOMPLETE` |
| Portfolio roll-up | Counts and evidence IDs | Any mismatch is `FAIL` |
| Calibration thresholds | Numeric results and evidence IDs | Missing result is `INCOMPLETE`; failed threshold is `FAIL` |
| Rollback/exception check | Boolean attestations and record IDs | Unchecked required attestation is `INCOMPLETE`; open invalidation is `FAIL`/`REOPEN` |
| Final decision | Exactly one of `PASS` or `NOT-READY` | Zero or two checks is `FAIL` |
| Signature lines | Structured signature records in the normalized sidecar | Missing/invalid signature is `INCOMPLETE`/`FAIL` |

The parser compares the form's completed bytes to `formSha256` after applying the registered Markdown canonicalization (UTF-8, LF, exactly one final LF). It does not rewrite the form or fill missing cells. A sidecar that contains a value absent from the form fails `FORM-PROJECTION-MISMATCH`.

## 4. Evidence and gate validation

Validation runs in this order and retains every result:

1. **Input and form integrity:** parse strictly, verify canonical form bytes and sidecar/manifest hashes, and reject duplicate rows or unknown labels.
2. **Evidence bytes:** resolve every manifest path under the approved root, recompute byte length and SHA-256 using its declared profile, and reject symlink/path escapes.
3. **Artifact envelopes:** validate R28–R33 schema, benchmark hash, role-roster hash, visibility, sealed state, payload hash, record hash, and ordered predecessor closure.
4. **Ledger linkage:** verify that qualification evidence and promotion events are committed in the append-only ledger; a pointer or report without a committed event is not evidence of `PASS`.
5. **Gate evidence mapping:** require each Q0–Q5 row to cite the artifacts and evidence required by the release-gate matrix; reject a gate that cites a different gate's artifact as a substitute.
6. **Role and signature separation:** verify signatures, signer identity, validity interval, role, and independence constraints against the authenticated roster.
7. **Status precedence:** reduce gate status using `REOPEN > FAIL > INCOMPLETE > PASS`; a final `PASS` is impossible if any gate is not `PASS`.
8. **Semantic thresholds:** verify portfolio counts, GL-1/R29 gold lock, calibration thresholds, frozen/warm/live qualification, source/cost evidence, and R33 report/status consistency.
9. **Rollback and expiry:** reject open rollback/invalidation records, revoked pointers, expired Live approval at validation time, or a descendant pointer whose ancestor is revoked/reopened.
10. **Final decision:** compare the computed result to the form and sidecar decision; a mismatch is a failure, not a reviewer preference.

## 5. Gate-specific pass rules

| Gate | Required machine evidence | Additional pass rule |
|---|---|---|
| Q0 | R28-01..04, exact benchmark hash, parser/schema proof, no override | All R28 artifacts sealed and mutually hash-consistent |
| Q1 | R29-01..06, `GL-1` report/register commit, 24 task locks, calibration evidence, Live approvals | Every human trap row projects exactly once; four Live outcomes have same-outcome, unexpired dual approvals |
| Q2 | R30-01..05, 20 valid frozen cold runs, grades/adjudications, cost/cap/containment records | No invalid run or hard failure counted as a pass |
| Q3 | R31-01..05, 20 warm runs, R29-05 manifest, cold/warm comparisons, zero eligible warm cost | No synthesis access; normalized outputs match cold |
| Q4 | R32-01..07, authorization, source pre/post captures, 12 repetitions, grades/adjudications, cost reconciliation | Authorization precedes access; all four Live tasks have three valid runs; expiry is later than validation time |
| Q5 | R33-01..03, report/status/pointer, complete closure, rollback evidence | R33-03 is the sole `ready` pointer and computed status is benchmark `PASS` |

An evidence hash can prove bytes were not changed; it cannot prove the bytes satisfy the gate. The semantic checks and predecessor/pointer checks are mandatory in addition to hash comparison.

## 6. Stable validator errors

| Code | Condition | Status |
|---|---|---|
| `FORM-READ` / `FORM-SHAPE` | Form missing, non-canonical, duplicate/unknown row, or malformed table | `INCOMPLETE`/`FAIL` |
| `FORM-HASH` / `FORM-PROJECTION-MISMATCH` | Form bytes or sidecar projection differs | `FAIL` |
| `RECORD-SCHEMA` / `MANIFEST-SCHEMA` | Unknown key, missing required field, wrong enum/type | `FAIL`/`INCOMPLETE` |
| `EVIDENCE-MISSING` / `EVIDENCE-UNREFERENCED` | Referenced evidence absent or extra unowned file | `INCOMPLETE`/`FAIL` |
| `EVIDENCE-PATH` / `EVIDENCE-BYTE-LENGTH` / `EVIDENCE-HASH` | Path escape or byte/hash mismatch | `FAIL` |
| `PREDECESSOR-MISSING` / `PREDECESSOR-MISMATCH` | Evidence/artifact closure absent or ordered hashes differ | `INCOMPLETE`/`FAIL` |
| `LEDGER-UNCOMMITTED` / `LEDGER-CHAIN` | Report/promotion not committed or ledger chain invalid | `INCOMPLETE`/`FAIL` |
| `GATE-MISSING` / `GATE-DUPLICATE` / `GATE-EVIDENCE` | Q0–Q5 row absent, repeated, or cites insufficient evidence | `INCOMPLETE`/`FAIL` |
| `ROLE-UNAUTHORIZED` / `ROLE-COLLISION` / `SIGNATURE-INVALID` | Signer not authorized, independence violated, or signature/hash invalid | `FAIL` |
| `Q1-GL1` / `LIVE-APPROVAL` | Trap projection missing/mismatched or Live outcome approval absent/conflicting/stale | `INCOMPLETE`/`FAIL`/`REOPEN` |
| `THRESHOLD-FAIL` / `STATUS-PRECEDENCE` | Portfolio/calibration threshold fails or status reduction is contradicted | `FAIL` |
| `ROLLBACK-OPEN` / `POINTER-REVOKED` / `LIVE-EXPIRED` | Open invalidation, revoked ancestor, or expired Live qualification | `FAIL`/`REOPEN` |
| `FINAL-DECISION-MISMATCH` | Computed result differs from form/sidecar decision | `FAIL` |

The report emits all applicable errors with a JSON Pointer or form row label, expected value, observed value, and supporting evidence IDs. It never reports `PASS` with warnings for a required check.

## 7. Tamper and rollback rules

- A changed form, normalized record, evidence manifest, artifact, ledger segment, report, or pointer invalidates the corresponding hash and reopens the affected gate.
- A changed Q0/Q1 predecessor, gold value, Live approval, or role roster transitively invalidates Q2–Q5 and revokes descendant pointers. Historical evidence remains retained.
- A failed validation attempt is retained as a report with its input hashes; it is not overwritten by a later pass.
- A pointer swap is valid only when its signed bytes, `previousPointerHash`, `promotionCommitHash`, target hash, and predecessor closure all verify. A filename or mtime never restores a pointer.
- Crash recovery may select only a fully committed ledger event and matching pointer. An uncommitted prepare, torn pointer, or ambiguous head produces `INCOMPLETE` and blocks release.

## 8. Deterministic output and acceptance criteria

The validator report contains `validatorVersion`, validation time, canonical hashes for the form/record/manifest, every evidence hash checked, six gate results, computed final decision, and ordered errors. The report itself is canonical JSON; repeating validation over unchanged bytes produces byte-identical output apart from the explicitly supplied validation-time field.

The contract is accepted when:

- [ ] A completed form with all required evidence and matching hashes computes `PASS` only when Q0–Q5 all pass.
- [ ] Any blank required cell, missing evidence, missing signature, or missing predecessor computes `INCOMPLETE` and blocks promotion.
- [ ] Any byte/hash mismatch, role collision, invalid signature, threshold failure, pointer defect, or contradictory status computes `FAIL` or `REOPEN` as specified.
- [ ] A form/sidecar mismatch, unknown row/property, duplicate gate, or extra manifest file is rejected.
- [ ] Q1 cannot pass without a committed `GL-1` trap-validation `PASS` and complete Live-outcome approvals.
- [ ] Q4 cannot pass with an expired authorization, source window, or Live approval at validation time.
- [ ] Q5 cannot pass with a revoked descendant, open rollback, non-ready R33 pointer, or incomplete predecessor closure.
- [ ] Historical failures, superseded forms, and rollback records remain auditable and are never deleted or averaged away.
- [ ] The validator is offline, read-only, deterministic, and credit-free.
