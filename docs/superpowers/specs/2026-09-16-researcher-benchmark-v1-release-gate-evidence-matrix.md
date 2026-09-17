# Researcher benchmark v1.0 release-gate evidence matrix

**Status:** reviewer-facing reference; specification only  
**Governing specification:** [`2026-09-16-researcher-benchmark-design.md`](./2026-09-16-researcher-benchmark-design.md), v1.0.0  
**Package authority:** [`2026-09-16-researcher-reliability-repair.md`](../plans/2026-09-16-researcher-reliability-repair.md)  
**Companion gates:** [`2026-09-16-researcher-benchmark-migration-rollback-gates.md`](./2026-09-16-researcher-benchmark-migration-rollback-gates.md)
**Machine validation:** [`2026-09-16-researcher-r28-r32-machine-validators.md`](./2026-09-16-researcher-r28-r32-machine-validators.md)
**Qualification ledger:** [`2026-09-16-researcher-benchmark-qualification-ledger.md`](./2026-09-16-researcher-benchmark-qualification-ledger.md)
**Canonical serialization and hashing:** [`2026-09-16-researcher-benchmark-release-canonical-serialization.md`](./2026-09-16-researcher-benchmark-release-canonical-serialization.md), profile `researcher-benchmark-c14n-v1`
**Git/path evidence snapshots:** [`2026-09-16-researcher-git-origin-path-authority-evidence-snapshots.md`](./2026-09-16-researcher-git-origin-path-authority-evidence-snapshots.md)
**Sign-off validation:** [`2026-09-16-researcher-benchmark-release-signoff-validator.md`](./2026-09-16-researcher-benchmark-release-signoff-validator.md)
**Printable gate sheets:** [`Q0–Q5 evidence sign-off packet`](./2026-09-16-researcher-benchmark-q-evidence-signoff/README.md), with one Letter-landscape page per gate

This matrix is the release reviewer’s index for Q0–Q5. A gate is closed only when its evidence is present, hash-linked, sealed, and independently checked. It is not a substitute for the benchmark scoring rules or the artifact-specific checklists.

## Status vocabulary

| Status | Use when | Effect |
|---|---|---|
| `PASS` | Every criterion and evidence item in the row passes. | The gate may close. |
| `INCOMPLETE` | Evidence is missing, an environment is invalid, or a required run has not completed. | Gate remains open; no downstream promotion. |
| `FAIL` | A valid run, artifact, threshold, role rule, or integrity check fails. | Gate remains open; retain failure and block release credit. |
| `REOPEN` | A locked predecessor, source, prompt, gold value, schema, or report input changes or expires. | Revoke the affected promotion and all descendants; requalify from the last passing lock. |

`NOT-READY` is the release-level result whenever any required gate is not `PASS`. `offline-verified` is allowed only as an explicit non-PASS state after Q0–Q3 pass and Q4 is absent or not authorized. It never closes Q5 or produces benchmark `PASS`.

## Q0–Q5 release-gate matrix

| Gate | Scope and prerequisite | Evidence the reviewer must inspect | Accountable owner | Independent verifier | PASS condition | Failure status and release effect |
|---|---|---|---|---|---|---|
| **Q0 — contract pin** | R28; approved benchmark contract before any authoring or qualification | R28-01 `contract-pin.json`; R28-02 `schema-manifest.json`; R28-03 `report-schema.md`; R28-04 `release-manifest.json`; human approval identity/time; exact v1.0.0 SHA-256; parser/self-test hashes; supersession check | Contract custodian | Release reviewer independent of contract author | All R28 artifacts are sealed, mutually hash-consistent, and pin the approved v1.0.0 contract with no local threshold or outcome override | `INCOMPLETE` for missing approval/evidence; `FAIL` for hash/schema/precedence mismatch or gold exposure; `REOPEN` for superseded contract. R29–R33 promotion is blocked and any descendants are revoked. |
| **Q1 — gold/calibration lock** | R29; Q0 `PASS`; BM-2 `GL-1` projection subgate | R29-01..06 for all 24 tasks; `GL-1` input snapshot, projection report, and canonical trap register; source hashes and replayable locators; two gold approvals/task; explicit same-outcome Live approvals; role roster; per-task agreement; pooled calibration batch, raw agreement, weighted κ; gold-lock hash; 20 Frozen/4 Live inventory | Evidence custodian with calibration adjudicator | Independent release reviewer; no author/reviewer/grader role collision | `GL-1` is `PASS`; every human trap row projects exactly once; 24 locked tasks, required balance/dimension coverage, all Live outcomes have two independent unexpired approvals tied to source hashes, all gold/source/calibration/warm hashes equal the Q0 contract hash, and v1.0.0 calibration thresholds pass | `INCOMPLETE` for missing task/review/calibration/projection/Live-approval evidence; `FAIL` for wrong gold, projection or locator/hash defect, role collision, leak, stale/conflicting Live approval, or agreement failure; `REOPEN` for any post-lock task/source/prompt/gold/approval change. Candidate execution is blocked; R30–R33 descendants are revoked. |
| **Q2 — frozen cold** | R30; Q0–Q1 `PASS`, G3 closed | R30-01..05; 20 sealed Frozen cold run records; artifact manifests; independent cold grades; adjudications; retained failures; provisional-cold roll-up; environment, cap, cost, and prohibited-access checks | Run operator and evidence custodian | Independent graders/adjudicator; release reviewer verifies roll-up | Exactly 20 valid cold runs pass v1.0 Sections 14.1 and 14.3 prerequisites; no contract-invalid run, hard failure, prohibited access, or false build-ready result; roll-up remains `provisional-cold` | `INCOMPLETE` for invalid environment, missing run, or lost artifact; `FAIL` for any valid failing run or invalid run counted as pass; `REOPEN` for Q0/Q1 hash or gold changes. R30 roll-up is not promoted and Q3–Q5 are blocked. |
| **Q3 — frozen warm** | R31; sealed R30 records, immutable R29-05 manifests, Q0–Q2 `PASS` | R31-01..05; 20 sealed warm runs; R31-04 independent warm grades; R31-05 adjudications; cold/warm comparisons; R29-05 manifest hashes; zero eligible warm cost; frozen-release roll-up | Comparison steward and evidence custodian | Independent warm graders/adjudicator; release reviewer verifies equivalence | Every warm run independently passes; normalized outcome/claims/constraints/source-locator set matches cold; no synthesis access; eligible warm collection cost is zero; frozen aggregate thresholds pass | `INCOMPLETE` for invalid environment or missing warm evidence; `FAIL` for mismatch, synthesis access, nonzero eligible cost, hard failure, or threshold failure; `REOPEN` for R29-05/R30/predecessor change. Frozen track remains unqualified and Q4/Q5 are blocked. |
| **Q4 — live authorization and canary** | R32; Q0–Q3 `PASS`, current R29 live gold lock, explicit operator approval | R32-01 authorization and expiry; R32-02 pre/post material-source hashes; R32-03 twelve sealed repetitions; R32-06 independent live grades; R32-07 adjudications; R32-04 cost reconciliations; R32-05 live roll-up; seven-day window and three repetitions/task | Live authorization owner and evidence custodian | Independent release reviewer plus cost-meter verifier | Approval precedes access; all four Live tasks run cold three times within seven days; all 12 valid repetitions pass; medians and critical checks meet v1.0.0; source drift and cost attribution are valid; no credentials are recorded; expiry is unexpired at Q5 | `INCOMPLETE` for absent approval, material source drift, meter/containment failure, or missing repetition; `FAIL` for any valid failed repetition, hard failure, cost breach, or dropped run; `REOPEN` for gold/source-window/version change or expiry. Live claim is revoked; status falls to `offline-verified` or `not-ready`; Q5 cannot claim benchmark `PASS`. |
| **Q5 — release publication** | R33; Q0–Q4 and BM-0–BM-6 `PASS` | R33-01 sealed release report; R33-02 canonical status; R33-03 atomic promotion pointer; complete predecessor hash closure; all task/track roll-ups; calibration/cost evidence; rollback/revocation records; final approval signatures | Release owner/evidence custodian | Independent release approver | Report is deterministic from sealed predecessors; status agrees with gate states and live expiry; all 24 tasks and required tracks pass; no open `INCOMPLETE`/`FAIL`/`REOPEN`; R33-03 alone publishes `ready` and benchmark `PASS` | `INCOMPLETE` for missing/stale/invalid predecessor evidence; `FAIL` for any failed gate, hash mismatch, expired live claim, hidden failure, or contradictory status; `REOPEN` for any predecessor/report input change. R33-03 is absent or revoked; no release pointer is published. |

## Evidence-to-owner crosswalk

| Evidence family | Gate(s) | Required owner | Reviewer must confirm |
|---|---|---|---|
| Contract/schema and parser proof | Q0, all later gates | Contract custodian | Exact benchmark hash, schema revision, validity precedence, scoring formulas, caps, and no local override |
| Task-visible and grader-only packages | Q1, Q2–Q4 | Task author / evidence custodian | Candidate/gold separation, immutable versions, no hidden-value leak, and matching task hashes |
| Source manifests and locator replays | Q1, Q3, Q4 | Gold reviewer / source verifier | Ownership group, source/body hash, retrieval scope, freshness, and smallest replayable locator |
| Calibration grades and adjudications | Q1, Q2–Q4 | Calibration adjudicator / graders | Blind independent grades, critical checks, rationales, outcome agreement, and retained disagreements |
| Cold/warm/live run records | Q2–Q4 | Run operator | Sealed environment, caps, validity precedence, artifact manifest, external-mutation check, and cost evidence |
| Roll-ups and comparisons | Q2–Q5 | Evidence custodian / comparison steward | No dropped failures, exact population, deterministic formulas, and predecessor hash closure |
| Status, report, and promotion pointer | Q5 | Release owner / evidence custodian | Status precedence, live expiry, rollback state, signatures, and atomic pointer publication |

## Reviewer procedure

1. Start at Q0 and verify the exact benchmark hash before opening task gold or run results.
2. For each row, check owner and verifier identities against the role roster before evaluating content.
3. Recompute each listed artifact hash and walk `predecessorHashes` transitively to Q0; attach the matching Git-origin/path-authority snapshot for the gate.
4. Record exactly one gate status. Do not turn missing evidence into `FAIL`, or a valid failure into `INCOMPLETE`.
5. On `REOPEN`, revoke descendants using the hash-closed dependency rule and retain the superseded evidence.
6. Approve Q5 only when R33-03 is the sole `ready` pointer and its report/status hashes match the reviewed predecessor set.

## Approval record

| Field | Reviewer entry |
|---|---|
| Benchmark specification/version/hash |  |
| Q0 status and evidence hash |  |
| Q1 status and gold-lock hash |  |
| Q2 status and frozen-cold roll-up hash |  |
| Q3 status and frozen-release roll-up hash |  |
| Q4 status and live-release roll-up/expiry |  |
| Q5 status and R33-03 promotion hash |  |
| Open failure, invalidation, or rollback record IDs |  |
| Independent verifier |  |
| Release owner |  |
| Release approver and timestamp |  |
