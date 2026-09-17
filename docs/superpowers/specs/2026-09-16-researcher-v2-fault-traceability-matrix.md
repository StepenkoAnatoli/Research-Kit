# Researcher v2 fault-injection traceability matrix

**Source catalogue:** [`2026-09-16-researcher-v2-migration-compatibility.md`](../plans/2026-09-16-researcher-v2-migration-compatibility.md), FI-01–FI-30  
**Release-gate vocabulary:** M1–M4 are migration gates; G4 is the release-qualification wave; Q0–Q5 are its release gates.  
**Status:** review reference only; no fault case is executed by this document.

**Execution/evidence sheets:** [`FI-01–FI-30 execution and evidence sign-off packet`](../specs/2026-09-16-researcher-v2-fi-execution-evidence-signoff/README.md)

This matrix is complete when every FI case has an artifact-row owner, repair package, migration gate, and release-gate consequence. The release-gate index is explicit: Q0, Q1, Q2, Q3, Q4, and Q5. `G4 (transitive)` means the case is a pre-qualification dependency: failure blocks Q0–Q5 even though it is not itself a benchmark-run case.

Artifact ranges are inclusive (for example, A01–A05 covers A01, A02, A03, A04, and A05).

| FI | Fault case (short form) | Artifact row(s) | Repair package | Migration gate | Release gate / consequence |
|---|---|---|---|---|---|
| FI-01 | Future schema or unknown required field | A01–A24 (version envelope) | R6 | M1 | G4 (transitive; Q0–Q5 blocked) |
| FI-02 | Malformed header/JSON/UTF-8 | A01–A05 | R6 | M1 | G4 (transitive; Q0–Q5 blocked) |
| FI-03 | Short/zero-byte temporary write | A01–A05 | R6 | M1 | G4 (transitive; Q0–Q5 blocked) |
| FI-04 | Interruption before rename | A01–A05 | R6 | M1 | G4 (transitive; Q0–Q5 blocked) |
| FI-05 | Rename succeeds, directory fsync fails | A01–A05 | R6 | M1 | G4 (transitive; Q0–Q5 blocked) |
| FI-06 | Crash between pointer write and swap | A11, A20–A24 | R13 / R25 / R28–R33 | M2 | G4; affected Q gate remains open |
| FI-07 | Power loss during audit/index/current publication | A10–A11 | R12–R13 | M2 | G4 (transitive; Q0–Q5 blocked) |
| FI-08 | Snapshot or destination hash tampering | Cross-cutting snapshot/manifest | R6 | M1 | G4 (transitive; Q0–Q5 blocked) |
| FI-09 | CRLF/LF or Unicode drift | A01–A05, A10 | R6 / R10 | M1 | G4 (transitive; Q0–Q5 blocked) |
| FI-10 | Duplicate/sparse/reordered/missing table rows or headers | A02, A15 | R7 | M2 | G4 (transitive; Q0–Q5 blocked) |
| FI-11 | Capture lacks transport/operation/completeness/omission | A07 | R21 | M1, M4 | G4 (transitive; Q0–Q5 blocked) |
| FI-12 | Ledger chain/sequence/body-hash/transport failure | A08 | R11 | M2 | G4 (transitive; Q0–Q5 blocked) |
| FI-13 | Truncated final ledger line | A08 | R11 | M2 | G4 (transitive; Q0–Q5 blocked) |
| FI-14 | Ledger middle-line deletion or edit | A08 | R11 | M2 | G4 (transitive; Q0–Q5 blocked) |
| FI-15 | Duplicate attempt, invalid units, or cap undercount | A09, A21 | R24 | M3 | G4 (transitive; Q0–Q5 blocked) |
| FI-16 | Invalid role or unauthenticated copied config | A12 | R14 | M2 | G4 (transitive; Q0–Q5 blocked) |
| FI-17 | Local hooksPath conflict or hook write failure | A13 | R14 / R18 | M2, G2 | G4 (transitive; Q0–Q5 blocked) |
| FI-18 | Secret/hidden/oversized/skipped scan input | A14 | R15 | M2 | G4 (transitive; Q0–Q5 blocked) |
| FI-19 | Lease race, heartbeat loss, live/unknown PID, age eviction | A16 | R8–R9 | M2 | G4 (transitive; Q0–Q5 blocked) |
| FI-20 | Claim lacks locator/source/date or review actor/time | A17–A18 | R20 | M4 | G4 (transitive; Q0–Q5 blocked) |
| FI-21 | Refresh supersedes evidence with dependent approval | A19 | R23 | M4 | G4 (transitive; Q0–Q5 blocked) |
| FI-22 | Missing brief/plan/disposition or unresolved marker | A20 | R25 | M4 | G4 (transitive; Q0–Q5 blocked) |
| FI-23 | Plan fingerprint changes before execution | A03, A21 | R24 | M3 | G4 (transitive; Q0–Q5 blocked) |
| FI-24 | Benchmark hash mismatch, gold leak, local threshold override | A22–A24 | R28–R29 | — | Q0–Q1 blocked; descendants revoked |
| FI-25 | Author/grader role conflict or calibration-label leak | A23 | R29 | — | Q1 blocked; R30–R33 blocked |
| FI-26 | Invalid candidate/environment/cost result | A24 | R30–R33 | — | Q2–Q5: validity precedence; no roll-up promotion |
| FI-27 | Warm run uses network or incurs eligible cost | A24 (warm) | R31 | — | Q3 blocked; frozen release remains unqualified |
| FI-28 | Rollback target collision, symlink, traversal, or out-of-root path | A01–A24 (rollback target) | R6–R25 / affected package | M1–M4 | G4/Q0–Q5 transitive; rollback `BLOCKED` |
| FI-29 | Interruption at any write/fsync/publish boundary | A01–A24 (write boundary) | R6–R25 / affected package | M1–M4 | G4/Q0–Q5 transitive; recover or remain `BLOCKED` |
| FI-30 | Rerun after migration or rollback drifts | A01–A24 (idempotence) | R6–R33 / affected package | M1–M4 | G4/Q0–Q5 transitive; no promotion until deterministic |

## Reviewer attestation columns

For each FI row, the reviewer records the execution/evidence reference and one result. `PASS` means the injected fault produced the packet’s expected refusal, rollback, invalidation, or `NO-OP`; `INCOMPLETE` means it was not run or evidence is missing; `FAIL` means the system accepted an unsafe state; `REOPEN` means a locked predecessor changed.

| FI range | Evidence IDs | Observed status | Reviewer initials |
|---|---|---|---|
| FI-01–FI-05 |  |  |  |
| FI-06–FI-10 |  |  |  |
| FI-11–FI-15 |  |  |  |
| FI-16–FI-20 |  |  |  |
| FI-21–FI-25 |  |  |  |
| FI-26–FI-30 |  |  |  |

## Coverage checks

- [ ] All 30 FI IDs appear exactly once in the primary matrix.
- [ ] Every artifact row A01–A24 is covered by at least one FI case.
- [ ] Every migration gate M1–M4 has at least one FI case; cross-cutting FI-28–FI-30 cover all gates.
- [ ] Q0–Q5 each has a direct or transitive FI consequence.
- [ ] FI-24–FI-27 are evaluated against benchmark v1.0 validity and release rules, not migration outcomes.
- [ ] No FI case permits deleting evidence, replacing a valid failure, or spending paid credits.
