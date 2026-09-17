# Researcher Reliability Repair: Effort, Risk, and Safe Parallelism

**Status:** Superseded planning estimate; no implementation authorization  
**Date:** 2026-09-16  
**Basis:** `2026-09-16-researcher-reliability-repair.md`, the 27 confirmed findings in `docs/researcher-review-2026-09-16.md`, and the current Node/Windows architecture  
**Unit:** One engineering day is one focused contributor-day including tests, documentation, and review fixes; it excludes waiting for independent gold review and operator approval

> Package IDs and estimates in this historical document describe the former R1–R18 grouping. The dependency-correct R1–R32 package plan supersedes them; use the revised plan for execution order, migration gates, and current boundaries.

## Executive estimate

The repair is approximately **89–145 engineering days**, plus **12–24 reviewer-days** to author, gold-review, pilot, and adjudicate the initial 24-task benchmark. A single contributor should expect roughly 18–29 working weeks. A three-person team can reduce calendar time to about 11–17 weeks, but only by respecting the shared-file and release-gate boundaries below; the work is not safely divisible into 18 simultaneous streams.

The critical path is R1 → R2 → R3 → R6 → R7 → R14 → R17 → R16 → R15 → R18. The largest schedule uncertainty is not typing code. It is proving crash safety, Windows process behavior, staged-index fidelity, semantic claim review, and benchmark inter-rater agreement.

Risk labels mean:

- **Very high:** can corrupt durable evidence, authorize spending, weaken enforcement, or produce a false release decision; requires adversarial tests and an explicit rollback/migration story.
- **High:** crosses a platform, security, persistence, or schema boundary and is likely to expose hidden compatibility cases.
- **Medium:** locally bounded, but still capable of data loss, misleading output, or test instability.

## Package estimates

| Package | Estimate | Delivery risk | Required predecessors | Safe parallelism | Main uncertainty / proof burden |
|---|---:|---|---|---|---|
| R1 — Contain machine-facing tests | 3–5 d | High | None; first package | Must run alone until the containment sentinel is trusted | Windows home resolution, inherited Git configuration, and proving no real machine path was mutated |
| R2 — Shell-free Windows CLI entry | 4–6 d | High | R1 | None with R3; both edit `firecrawl.mjs` and its tests | npm installation layouts, path/Unicode handling, and hostile argv preservation without a shell |
| R3 — Transport/provenance contract | 3–5 d | High | R1, R2 | None with R2; may overlap only with documentation preparation for Wave 1 | Backward compatibility for existing ledger/capture records and a transport registry that cannot be forged |
| R4 — Non-destructive briefs | 2–3 d | Medium | R1 | Can run beside R6/R7 or R8/R9; sequence before R5 if R5 fingerprints the final brief ownership model | Distinguishing generated from authored bytes and making forced replacement recoverable |
| R5 — Immutable, contained audits | 6–9 d | Very high | R1; preferably R4 | Can run beside R6/R7 and R8/R9; no parallel edits to audit/brief ownership | Atomic publication of an audit plus index, corrupt-index recovery, traversal/symlink containment, and version consistency |
| R6 — Stable IDs and table meaning | 3–5 d | High | R1, R3 | Must precede R7; unsafe in parallel with it because both own allocation and corpus writes | Migration behavior for existing duplicate IDs and preservation of unknown/forward-compatible columns |
| R7 — One durable writer boundary | 8–13 d | Very high | R3, R6 | No concurrent work in provenance/collect/research-run/decompose; unrelated R4/R5 or R8/R9 work is safe | Transaction ordering, crash recovery at every write boundary, lease semantics, idempotent retry, and concurrency stress |
| R8 — Fail closed on unknown authority | 3–4 d | High | R1 | Can run beside R4–R7, but not beside R9 because both change doctor/machine tests | Last-good authenticity, configuration migration, and avoiding accidental collector authorization |
| R9 — Secret protection and scanner claims | 2–4 d | Medium | R1; preferably R8 | Can run beside R4–R7 after doctor ownership is handed off | Bounded scan coverage, redaction, false assurances from skipped files, and template compatibility |
| R10 — Evaluate staged corpus | 5–8 d | Very high | R1, R3; Wave 1 gate | Treat R10 and R11 as one serial lane; R11 should define path input first or both should be merged | Faithful index materialization, filters/line endings, deletions, symlinks, cleanup, and fail-posture behavior |
| R11 — Lossless staged paths | 3–5 d | High | R1; functionally coupled to R10 | Same lane as R10; do not parallelize edits to hook/gate tests | Correct NUL protocol for all Git statuses and linear behavior on very large path sets |
| R12 — Owned hook mutation and repair access | 4–7 d | High | R1, R8; Wave 1 gate | Logic can be designed beside R10/R11, but implementation shares hook tests and needs coordinated file ownership | Preserving unrelated settings, resolving the right project, and handling pathless/unsupported runtime payloads honestly |
| R13 — Preservation-first handoff recovery | 3–5 d | High | R1, R9; Wave 1 gate | Can run beside the R10/R11 lane if doctor edits are complete | Proving backup containment and refusing when tracked/untracked state cannot be preserved |
| R14 — Claim-aware completeness | 6–10 d | High | R3, R7; Wave 2 gate | Start of one serial semantic lane with R16/R17; R15 waits for its interface | HTML/main-content variability, locator semantics, binary/redirect/error handling, and parity without pretending adapters are identical |
| R15 — Readiness states | 5–8 d | High | R4, R5, R14, R17; preferably R16 | No parallel edits to checks/brief/audit/preflight; can overlap only with benchmark fixture authoring after state names freeze | Exact state transitions, reviewer identity/approval evidence, and keeping research repair possible while handoff remains blocked |
| R16 — Pure plans and observable spend | 7–11 d | Very high | R3, R7; Wave 2 gate | Serial with R14/R17 because all edit collection paths; benchmark task prose can be authored separately | Dry-run/execution equivalence under changing cache state, operation pricing, retry accounting, and resumability after partial failure |
| R17 — Freshness, supersession, authority | 7–12 d | Very high | R3, R6, R7, R14 | Serial with R14/R16; must finish before R15 approval semantics | Artifact/schema migration, claim-to-evidence dependency tracking, source-date truth, and safe supersession of legacy citations |
| R18 — Release identity and qualification | 15–25 d engineering + 12–24 reviewer-days | Very high | R1–R17, approved benchmark spec, locked task set | Final integration package; fixture authoring may parallelize by task only after schema/rubric pilot approval | Deployment identity across hooks, offline end-to-end parity, 24-task harness/fixtures, human grading agreement, and bounded live-smoke policy |

## Safe execution lanes

The plan’s wave gates remain serial. Inside a passed wave, the following is the maximum safe concurrency without intentionally creating merge-heavy ownership conflicts:

| Stage | Lane A | Lane B | Lane C | Notes |
|---|---|---|---|---|
| Recovery | R1 → R2 → R3 | — | — | Single lane until tests and transport are trustworthy |
| Durable state | R4 → R5 | R6 → R7 | R8 → R9 | Three lanes are safe because they primarily own brief/audit, corpus/writer, and machine/doctor surfaces respectively |
| Enforcement | R11 → R10 | R12 | R13 | R10/R11 are one functional package; R12 shares hook tests, so coordinate test-file ownership or serialize the merge |
| Semantics | R14 → R17 → R16 → R15 | Benchmark task prose only | Documentation/migration review only | Product implementation is effectively one lane because `collect.mjs`, `checks.mjs`, and related tests overlap heavily |
| Release | R18 integration | Independent gold review | Independent grading pilot | Candidate execution begins only after tasks are locked and graders have passed calibration |

Peak safe implementation concurrency is three contributors in Wave 1 and two to three in Wave 2 with explicit file ownership. Wave 3 has only one safe code lane. More contributors can author fixtures, inspect migrations, or review documents, but should not edit the same state-transition or persistence surfaces concurrently.

## Planning assumptions and exclusions

- Estimates assume the current dependency-free architecture is retained. If robust HTML parsing or file locking cannot be achieved safely without a dependency, the architectural decision must be reopened rather than hidden inside the estimate.
- Estimates include regression tests, focused verification, architecture-map updates, and any superseding ADR named by the package.
- Estimates exclude paid Firecrawl runs, production deployment, user acceptance, and remediation of new defects found by the benchmark.
- R18 assumes the full 24-task specification. A smaller smoke suite would reduce effort but would not satisfy the benchmark release contract.
- The snapshot has no `.git` directory. Commit-oriented acceptance can be built and tested in disposable Git fixtures, but final repository integration and one-commit-per-task verification require a real checkout.
