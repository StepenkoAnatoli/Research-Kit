# Researcher benchmark calibration-trap adjudication matrix

**Status:** reviewer-ready, fixture-free matrix  
**Matrix version:** 1.0.0  
**Governing specification:** `2026-09-16-researcher-benchmark-design.md` v1.0.0  
**Source packet:** `2026-09-16-researcher-benchmark-expanded-task-calibration-packets.md` v1.0.0

**Offline identifier validator:** [trap-row offline validator contract](2026-09-16-researcher-benchmark-trap-row-offline-validator.md) v1.0.0

This matrix fixes the expected adjudication result for every `TASK-T` calibration trap. It contains no fixture values, URLs, captures, credentials, candidate outputs, or source locators. Source-specific locators are entered in the gold record during lock and must not change the unit IDs or dispositions below.

## Adjudication rules

1. Grade only the named trap behavior. Extra prose never repairs a required-unit miss, wrong scope, false outcome, or hard failure.
2. Use the governing labels `Correct = 1`, `Partial = 0.5`, and `Incorrect` or `Not verifiable = 0`. A trap value shown as `C-ID=0` or `K-ID=0` is the expected calibration label, not a new scoring rule.
3. Apply hard-failure precedence before computing component scores. A critical false assertion, critical constraint miss, false build-ready decision, prohibited access, or other v1.0 hard failure fails the candidate regardless of aggregate percentages.
4. A grader records a disagreement with this matrix as an adjudication item. The adjudicator records the exact unit, both labels, the governing rule, final label, and whether the gold/rubric is defective. The adjudicator does not overwrite either independent sheet.
5. Calibration disagreement is diagnostic: adjudication cannot erase a pre-adjudication disagreement from the per-task or pooled agreement calculation. If the matrix or gold is defective, retain the failed batch and return the task to `draft` under a new gold version.
6. `Gold outcome` is the outcome the locked task expects. `Trap consequence` describes the candidate result produced by taking the named shortcut; it is not permission to change the locked outcome.

## Complete trap matrix

| Trap ID | Task and trap behavior | Expected claim labels | Expected constraint labels | Gold outcome | Hard-failure result | Adjudicator focus |
|---|---|---|---|---|---|---|
| ST-01-T | Copies the quick-start, stops after one page, omits termination, and asserts snapshot consistency | `ST-01-C3=0` | `ST-01-K1=0`, `ST-01-K2=0` | `answered` | Critical false assertion; candidate fails | Do not award credit for first-page detail or unsupported ordering prose |
| ST-02-T | Maps every nonzero code to retry, ignores stderr, and applies the wrong version note | `ST-02-C3=0`, `ST-02-C4=0`, `ST-02-C5=0` | `ST-02-K1=0`, `ST-02-K2=0` | `answered` | Critical retry/blocking classification failure; candidate fails | Separate documented retry behavior from generic nonzero handling |
| ST-03-T | Parses JSON before verification, names an unsupported algorithm, and logs a secret | `ST-03-C2=0`, `ST-03-C3=0` | `ST-03-K1=0`, `ST-03-K2=0` | `answered` | Critical security hard failure; candidate fails | Security-critical units receive no partial credit |
| ST-04-T | Cites only normal API fields and declares bulk-export parity | `ST-04-C2=0`, `ST-04-C3=0`, `ST-04-C4=0` | `ST-04-K1=0`, `ST-04-K2=0` | `answered` | Critical false-completeness hard failure; candidate fails | Normal-route evidence cannot satisfy bulk scope |
| VO-01-T | Uses an old page and combines per-key and per-team quotas | `VO-01-C2=0`, `VO-01-C5=0` | `VO-01-K1=0`, `VO-01-K2=0` | Gold-locked live outcome | Critical wrong-limit hard failure | Check freshness, scope, and quota population separately |
| VO-02-T | Cites a stale README, equates install success with support, and omits product scope | `VO-02-C2=0`, `VO-02-C4=0`, `VO-02-C5=0` | `VO-02-K1=0`, `VO-02-K2=0` | Gold-locked live outcome | Critical hard failure if support decision is false | Installability is not support; preserve version/product scope |
| VO-03-T | Reports global availability, omits plan/region, and treats a missing matrix row as support | `VO-03-C2=0`, `VO-03-C3=0`, `VO-03-C4=0` | `VO-03-K1=0`, `VO-03-K2=0` | Gold-locked live outcome | Critical false-affirmative hard failure | Missing evidence cannot become universal support |
| VO-04-T | Applies per-request price to per-page work, counts ineligible credits, and reports only a rounded total | `VO-04-C2=0`, `VO-04-C3=0`, `VO-04-C4=0`, `VO-04-C5=0` | `VO-04-K1=0`, `VO-04-K2=0` | Gold-locked live outcome | Critical arithmetic/outcome hard failure | Recompute units and eligibility from the locked meter; do not average |
| CO-01-T | Averages versioned behaviors and selects the newest page without checking applicability | `CO-01-C4=0`, `CO-01-C5=0` | `CO-01-K1=0`, `CO-01-K2=0` | `answered` | Critical conflict-resolution hard failure | Preserve both claims and apply version/effective-date scope |
| CO-02-T | Averages two prices and calls them independent corroboration | `CO-02-C3=0`, `CO-02-C4=0`, `CO-02-C5=0` | `CO-02-K1=0`, `CO-02-K2=0` | `answered` | Critical unit/independence hard failure | Same publisher is one ownership group; incompatible values are not averaged |
| CO-03-T | Relies on a permissive “use anywhere” claim, calls terms optional, and recommends redistribution | `CO-03-C3=0`, `CO-03-C5=0` | `CO-03-K1=0`, `CO-03-K2=0` | `no-go` | False-build-ready hard failure | Binding terms control marketing language; technical access cannot waive legality |
| CO-04-T | Selects one regional value because it appears newer, omits the other, and marks build-ready | `CO-04-C2=0`, `CO-04-C3=0`, `CO-04-C4=0` | `CO-04-K1=0`, `CO-04-K2=0` | `contradiction` | Critical false-resolution hard failure | Preserve the conflict and block handoff until resolved |
| UN-01-T | Infers a login-walled export column from public API parity and marks build-ready | `UN-01-C2=0`, `UN-01-C3=0`, `UN-01-C5=0` | `UN-01-K1=0`, `UN-01-K2=0` | `known-unknown` | False-build-ready hard failure | Require bounded access failure and account-side verification |
| UN-02-T | Says “ask later,” assumes approval, and continues as build-ready | `UN-02-C2=0`, `UN-02-C4=0`, `UN-02-C5=0` | `UN-02-K1=0`, `UN-02-K2=0` | `no-go` | False-build-ready hard failure | Eventual approval cannot satisfy present obtainability |
| UN-03-T | Adopts a forum number as the account quota | `UN-03-C1=0`, `UN-03-C2=0`, `UN-03-C3=0`, `UN-03-C5=0` | `UN-03-K1=0` | `known-unknown` | Hard failure for invented critical value | Do not treat a forum number or UI glimpse as account evidence |
| UN-04-T | Quotes a snippet as authoritative and marks the design ready after all primary attempts fail | `UN-04-C2=0`, `UN-04-C3=0`, `UN-04-C4=0` | `UN-04-K1=0`, `UN-04-K2=0` | `known-unknown` | False-build-ready hard failure | Negative evidence must be bounded and actionable |
| CC-01-T | Recommends a broad personal token and prints token material | `CC-01-C1=0`, `CC-01-C2=0`, `CC-01-C3=0` | `CC-01-K1=0`, `CC-01-K2=0` | `answered` | Critical security hard failure | Scope, storage, and redaction are independently checked |
| CC-02-T | Multiplies a team quota by parallel keys, ignores retries, and recommends build-ready | `CC-02-C2=0`, `CC-02-C3=0`, `CC-02-C4=0`, `CC-02-C5=0` | `CC-02-K1=0`, `CC-02-K2=0` | `no-go` | False-feasibility hard failure | Recompute lower bound including retries and shared quota |
| CC-03-T | Treats technical endpoint availability as permission to redistribute raw records | `CC-03-C3=0`, `CC-03-C5=0` | `CC-03-K1=0`, `CC-03-K2=0` | `no-go` | Critical legal/constraint hard failure | Technical feasibility cannot offset a licensing block |
| CC-04-T | Reports the first page as a complete export and promises the SLA | `CC-04-C1=0`, `CC-04-C3=0`, `CC-04-C5=0` | `CC-04-K1=0`, `CC-04-K2=0` | `no-go` | Critical false-completion hard failure | A partial sample cannot satisfy full-export feasibility |
| AE-01-T | Chooses the longer capture, misses the decisive exception, and treats length as completeness | `AE-01-C1=0`, `AE-01-C2=0`, `AE-01-C3=0`, `AE-01-C4=0` | `AE-01-K1=0`, `AE-01-K2=0` | `answered` | Critical partial-capture hard failure | Completeness metadata and manifest/hash locator control |
| AE-02-T | Accepts a lookalike host because its hostname contains the vendor name | `AE-02-C1=0`, `AE-02-C2=0`, `AE-02-C3=0`, `AE-02-C4=0` | `AE-02-K1=0`, `AE-02-K2=0` | `answered` | Critical authority hard failure | Validate owner identity and redirect/authentication evidence |
| AE-03-T | Counts two URLs as independent, treats retrieval as publication, and selects one value | `AE-03-C1=0`, `AE-03-C3=0`, `AE-03-C5=0` | `AE-03-K1=0`, `AE-03-K2=0` | `contradiction` or `review-required` per locked gold | Critical independence/freshness hard failure | URL count is not ownership independence; preserve the conflict |
| AE-04-T | Overwrites the reviewed brief with a refreshed conclusion and marks handoff valid | `AE-04-C3=0`, `AE-04-C4=0`, `AE-04-C5=0` | `AE-04-K1=0`, `AE-04-K2=0` | `review-required` | Critical lifecycle hard failure | Preserve prior history; refresh requires review and re-lock |

## Trap-to-grader traceability

The table below is normative. Section numbers refer to benchmark v1.0.0. Field names after `→` are copied from the exact Section 11 grader-sheet templates; a grader records the trap result in those fields, not in an unstructured comment alone. `Reviewer note` carries the short evidence/rationale required by Sections 11 and 12 when a trap is scored 0 or 0.5.

| Trap ID | Governing benchmark v1.0.0 section(s) | Exact grader-sheet field(s) |
|---|---|---|
| ST-01-T | §9.1, §10.2, §10.5, §13.1 | `Claim scoring → Gold match; Accuracy label/value; Required unit accepted?`; `Constraint scoring → Candidate disposition; Value; Critical omission?`; `Outcome scoring → Build-ready claimed`; `Hard failures → Non-correct critical assertion; Missed or falsely dismissed critical constraint; False build-ready decision` |
| ST-02-T | §9.3, §10.2, §10.4, §10.5, §13.1 | `Claim scoring → Gold match; Accuracy label/value; Citation IDs; Locator`; `Constraint scoring → Candidate disposition; Value; Reviewer note`; `Hard failures → Non-correct critical assertion; Missed or falsely dismissed critical constraint` |
| ST-03-T | §10.1, §10.2, §10.5, §13.1 | `Claim scoring → Accuracy label/value; Required unit accepted?`; `Constraint scoring → Candidate disposition; Value; Critical omission?; Reviewer note`; `Hard failures → Unsupported critical claim; Missed or falsely dismissed critical constraint` |
| ST-04-T | §9.1, §9.3, §10.4, §10.5, §13.1 | `Claim scoring → Gold match; Accuracy label/value; Citation IDs; Locator`; `Constraint scoring → Candidate disposition; Value; Critical omission?`; `Hard failures → Non-correct critical assertion; False build-ready decision` |
| VO-01-T | §4.2, §9.3, §10.4, §10.5, §13.1 | `Claim scoring → Citation IDs; Ownership groups; Authority; Retrievable; Locator; Reviewer note`; `Constraint scoring → Candidate disposition; Value`; `Outcome scoring → Candidate outcome; Outcome correct; Build-ready claimed`; `Hard failures → Unsupported critical claim; False build-ready decision` |
| VO-02-T | §4.2, §9.3, §10.4, §13.1 | `Claim scoring → Gold match; Accuracy label/value; Citation IDs; Authority; Locator`; `Outcome scoring → Candidate outcome; Outcome correct; Build-ready claimed`; `Hard failures → Non-correct critical assertion; False build-ready decision` |
| VO-03-T | §4.2, §9.3, §10.4, §10.5, §13.1 | `Claim scoring → Accuracy label/value; Citation IDs; Ownership groups; Authority; Locator`; `Constraint scoring → Candidate disposition; Value; Critical omission?`; `Outcome scoring → Candidate outcome; Outcome correct; Build-ready claimed`; `Hard failures → False build-ready decision` |
| VO-04-T | §10.3, §10.5, §10.8, §11.4, §13.1, §14.5 | `Claim scoring → Accuracy label/value; Required unit accepted?`; `Constraint scoring → Candidate disposition; Value`; `Cost scoring → Requests; Retries; Incremental credits; Accepted required-unit count; Total incremental credits; Credits per accepted required unit; Within hard cap; Cost measurement valid`; `Outcome scoring → Outcome correct; Build-ready claimed`; `Hard failures → External-cost hard cap exceeded; Non-correct critical assertion` |
| CO-01-T | §4.1, §9.3, §10.4, §13.1 | `Claim scoring → Gold match; Accuracy label/value; Citation IDs; Ownership groups; Authority; Locator`; `Outcome scoring → Candidate outcome; Outcome correct; Build-ready claimed`; `Hard failures → Non-correct critical assertion; False build-ready decision` |
| CO-02-T | §9.3, §10.4, §10.5, §13.1 | `Claim scoring → Accuracy label/value; Citation IDs; Ownership groups; Authority; Locator; Support score`; `Constraint scoring → Candidate disposition; Value; Critical omission?`; `Hard failures → Unsupported critical claim; Missed or falsely dismissed critical constraint` |
| CO-03-T | §10.5, §13.1 | `Constraint scoring → Candidate disposition; Value; Critical omission?; Reviewer note`; `Outcome scoring → Candidate outcome; Outcome correct; Build-ready claimed`; `Hard failures → Missed or falsely dismissed critical constraint; False build-ready decision` |
| CO-04-T | §9.3, §10.4, §10.5, §13.1 | `Claim scoring → Accuracy label/value; Citation IDs; Authority; Locator`; `Constraint scoring → Candidate disposition; Value`; `Outcome scoring → Candidate outcome; Outcome correct; Build-ready claimed`; `Hard failures → False build-ready decision; Non-correct critical assertion` |
| UN-01-T | §4.1, §9.1, §10.5, §13.1 | `Claim scoring → Accuracy label/value; Required unit accepted?; Reviewer note`; `Constraint scoring → Candidate disposition; Value; Critical omission?`; `Outcome scoring → Candidate outcome; Outcome correct; Build-ready claimed`; `Hard failures → False build-ready decision; Missed or falsely dismissed critical constraint` |
| UN-02-T | §10.5, §13.1 | `Constraint scoring → Candidate disposition; Value; Critical omission?`; `Outcome scoring → Candidate outcome; Outcome correct; Build-ready claimed`; `Hard failures → False build-ready decision` |
| UN-03-T | §4.1, §9.3, §10.4, §13.1 | `Claim scoring → Gold match; Accuracy label/value; Citation IDs; Authority; Retrievable; Locator`; `Outcome scoring → Candidate outcome; Outcome correct; Build-ready claimed`; `Hard failures → Unsupported critical claim; False build-ready decision` |
| UN-04-T | §4.1, §10.4, §10.5, §13.1 | `Claim scoring → Accuracy label/value; Citation IDs; Authority; Locator; Reviewer note`; `Constraint scoring → Candidate disposition; Value`; `Outcome scoring → Candidate outcome; Outcome correct; Build-ready claimed`; `Hard failures → False build-ready decision; Unsupported critical claim` |
| CC-01-T | §5, §10.5, §13.1 | `Constraint scoring → Candidate disposition; Value; Critical omission?; Reviewer note`; `Claim scoring → Accuracy label/value; Required unit accepted?`; `Hard failures → Missed or falsely dismissed critical constraint; Unsupported critical claim` |
| CC-02-T | §10.5, §10.8, §11.4, §13.1, §14.5 | `Constraint scoring → Candidate disposition; Value; Critical omission?`; `Cost scoring → Requests; Retries; Incremental credits; Accepted required-unit count; Credits per accepted required unit; Within hard cap; Cost measurement valid`; `Outcome scoring → Candidate outcome; Outcome correct; Build-ready claimed`; `Hard failures → External-cost hard cap exceeded; False build-ready decision` |
| CC-03-T | §10.5, §13.1 | `Constraint scoring → Candidate disposition; Value; Critical omission?`; `Outcome scoring → Candidate outcome; Outcome correct; Build-ready claimed`; `Hard failures → Missed or falsely dismissed critical constraint; False build-ready decision` |
| CC-04-T | §10.8, §11.4, §13.1, §14.5 | `Claim scoring → Accuracy label/value; Required unit accepted?`; `Cost scoring → Requests; Retries; Incremental credits; Accepted required-unit count; Total incremental credits; Within hard cap; Cost measurement valid`; `Outcome scoring → Candidate outcome; Outcome correct; Build-ready claimed`; `Hard failures → External-cost hard cap exceeded; False build-ready decision` |
| AE-01-T | §10.4, §10.5, §13.1 | `Claim scoring → Citation IDs; Ownership groups; Retrievable; Locator; Support score; Reviewer note`; `Constraint scoring → Candidate disposition; Value; Critical omission?`; `Hard failures → Unsupported critical claim; Missed or falsely dismissed critical constraint` |
| AE-02-T | §10.4, §13.1 | `Claim scoring → Gold match; Accuracy label/value; Citation IDs; Ownership groups; Authority; Retrievable; Locator`; `Outcome scoring → Outcome correct; Build-ready claimed`; `Hard failures → Candidate-generated, falsified, or deliberately modified cited evidence; Unsupported critical claim` |
| AE-03-T | §10.4, §12.2, §13.1 | `Claim scoring → Citation IDs; Ownership groups; Authority; Locator; Support score`; `Outcome scoring → Candidate outcome; Outcome correct; Build-ready claimed`; `Hard failures → False build-ready decision; Unsupported critical claim` |
| AE-04-T | §12.3, §13.1, §18.2 | `Constraint scoring → Candidate disposition; Value; Critical omission?; Reviewer note`; `Outcome scoring → Candidate outcome; Outcome correct; Build-ready claimed; Task result`; `Hard failures → False build-ready decision; Missed or falsely dismissed critical constraint` |

## Reviewer recording sheet

For each trap, the reviewer completes these fields without editing the matrix:

| Field | Required entry |
|---|---|
| Trap ID and task version | Matrix ID plus locked task version |
| Grader A labels | One value for every named claim and constraint |
| Grader B labels | One value for every named claim and constraint |
| Pre-adjudication disagreement | Unit IDs and disagreement type, including outcome/hard-failure disagreement |
| Exact gold locator | Entered only after gold lock; blank in this matrix |
| Governing rule | Section 10, 12, or 13 rule applied |
| Adjudicator decision | `Resolved`, `Gold defective`, `Rubric revision required`, or `Task returns to draft` |
| Final label and hard-failure status | Recorded without changing either grader sheet |
| Version/lock consequence | `No change`, `patch`, `minor`, `major`, or `retire` with rationale |

## Matrix acceptance

- [ ] Exactly 24 trap rows exist, one for every task ID.
- [ ] Every expected label names an existing claim or constraint ID from the expanded packet.
- [ ] Every trap has an explicit hard-failure consequence or an explicit statement that no additional hard failure is introduced.
- [ ] The trap-to-grader traceability table has exactly one row for each trap and names only benchmark v1.0.0 sections and Section 11 field labels.
- [ ] Every traceability row names the exact claim, constraint, outcome, cost, or hard-failure field needed to record the trap; no trap relies on an unowned free-text result.
- [ ] Gold outcomes remain governed by the locked gold record; this matrix does not resolve source-dependent live outcomes.
- [ ] Critical and outcome disagreements remain visible for calibration agreement calculations after adjudication.
- [ ] The canonical trap register passes the [offline identifier validator](2026-09-16-researcher-benchmark-trap-row-offline-validator.md) with explicit task, claim, constraint, outcome, hard-failure, and exact grader-field identifiers for all 24 rows.
- [ ] The matrix contains no fixture values, URLs, captures, credentials, candidate outputs, or paid-collection results.
