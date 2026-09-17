# Adversarial Review of the Researcher Reliability Repair Plan

**Status:** Suggestions only; the repair plan has not been edited or approved by this review  
**Date:** 2026-09-16  
**Reviewed document:** `docs/superpowers/plans/2026-09-16-researcher-reliability-repair.md`

## Verdict

The plan covers all 27 named findings, orders the first safety work correctly, and avoids a premature rewrite. It is not yet execution-ready. Several packages depend on interfaces scheduled later, some acceptance criteria require behavior owned by another package, and R18 compresses release identity, end-to-end qualification, a 24-task benchmark, deployment, documentation, and a live smoke into one non-revertible task.

Before implementation, resolve the six blocking planning defects below. The remaining recommendations improve testability and keep the repair from expanding into unrelated platform work.

## Blocking defects

| ID | Problem | Failure mode | Suggestion |
|---|---|---|---|
| P-01 | R6 says ID allocation occurs while holding the shared writer boundary, but R7 creates that boundary later. | R6 cannot meet its own concurrency acceptance criteria, or R7 must rewrite R6 immediately. | Define the writer transaction interface before both packages. Either merge R6/R7 or make R6 purely validate/allocate within an injected transaction and defer concurrent-writer proof to R7. |
| P-02 | R10 acceptance requires deletion, rename, copy, and type-change fidelity, while R11 owns the status/path protocol needed to provide those cases. | R10 can be “done” only by implementing R11 early, defeating one-task/one-commit isolation. | Implement R11 first, then R10, or merge them into one staged-verdict package with one acceptance matrix. |
| P-03 | R14 requires reviewer-confirmed supporting locators; R17 introduces the durable source/claim review metadata; R15 defines review and approval states. Their schemas and state transitions are unspecified and scheduled in a conflicting order. | Three packages invent overlapping fields and later migrations; handoff approval can disagree with claim completeness. | Approve one claim/evidence/review schema and transition table before Wave 3. Implement extraction/locator capture, supersession/authority, spending, then readiness enforcement against the frozen schema. |
| P-04 | R5 promises that a failure between publishing an audit and its index leaves either the old or new valid state, but two independent renames cannot provide that guarantee without a recovery protocol or indirection. | Crash tests expose an orphan audit or an index pointing at a missing file despite nominal “atomic writes.” | Specify the publication protocol: immutable content-addressed audit, atomic current-pointer/index switch, and deterministic orphan recovery. Test every interruption point. |
| P-05 | R18 refers to an “approved two-track benchmark” but does not cite the benchmark specification, allocate work for 24 task/gold packages, or require task pilot approval and grader calibration. Its thresholds also omit several benchmark gates. | A small bespoke fixture set can satisfy R18 while the approved benchmark remains unimplemented or ungradable. | Make the benchmark specification a normative dependency. Split harness, task authoring/gold review, pilot calibration, frozen release run, and authorized live run into separately reviewable packages. |
| P-06 | There is no artifact-schema migration and compatibility plan for existing discovery, evidence, sources, ledger, audit index, config, and brief files. R3, R5, R8, R14, R15, and R17 all change persisted meaning. | A repair can make current corpora unreadable, silently reinterpret old fields, or report readiness on partially migrated state. | Add a versioned compatibility matrix, read-old/write-new policy, idempotent migration tests, backup/rollback rules, and explicit refusal for unknown future schemas. |

## Missing dependencies and uncovered boundaries

### 1. Partial-write recovery is broader than the ledger lock

R7 names capture, ledger, evidence, and source writes, but it does not define the recoverable states after termination between each step. Publishing the capture last also creates a period where durable metadata may name a file that is not yet visible.

Suggestion: add an operation journal or deterministic recovery table covering every boundary: request completed, temporary capture written, ledger appended, evidence updated, source updated, capture published, usage recorded. For each state, define whether restart completes, rolls back, or refuses before another paid request.

### 2. Network safety and body limits are absent

The review identified loopback/private-address access, response-body timeout gaps, binary/PDF handling, and unbounded body size in the keyless adapter. No package owns the decision whether private-network access is supported.

Suggestion: add a narrowly scoped transport-hardening package after R3. Decide and test redirect limits, content-type policy, maximum bytes, body-read deadlines, DNS/IP rebinding posture, and private-address policy. Do not bury this in R14’s semantic extraction work.

### 3. Test timeout cleanup remains outside R1

R1 isolates machine paths, but the existing harness can let timed-out asynchronous work continue into later tests. A contained process can still corrupt another fixture or make the suite nondeterministic.

Suggestion: require per-file or per-case subprocess isolation for tests with persistent work, and verify no child processes/listeners survive the suite. This can be a small R1b package rather than a harness rewrite.

### 4. Audit lifecycle edge cases are only partly owned

R5 covers corrupt indexes and path containment but not removed subtopics, slug collisions, concurrent audit writers, or bundle membership after independently advancing scope versions.

Suggestion: extend the audit acceptance matrix or explicitly defer each case in an ADR. “Immutable” should include a deterministic rule for retired scopes and concurrent publishers.

### 5. The `--no-verify` record claim is impossible as currently documented

A hook cannot observe a commit that bypasses it. The plan does not assign ownership for correcting documentation that says all overrides are recorded.

Suggestion: narrow the claim to observable overrides, or introduce a separate repository-side audit mechanism under a new proposal. Do not treat an unobservable bypass as repaired by hook code.

### 6. The benchmark needs a pre-repair baseline policy

The plan adds the benchmark only in R18, after every repair. That prevents an apples-to-apples baseline unless the current broken candidate is preserved and runnable under the future harness.

Suggestion: freeze candidate identity, existing outputs, and representative fixtures now without executing paid tasks. After the harness is approved, score the preserved baseline where execution is safe; mark transport-blocked cases explicitly rather than inventing scores.

## Weak or non-falsifiable acceptance criteria

| Package | Weak criterion | Why it is weak | Suggested replacement |
|---|---|---|---|
| R1 | “No test resolves `os.homedir()` to the real profile.” | Resolution may occur harmlessly; writes and subprocess inheritance are the actual risk, and the listed sentinel covers only known paths. | Deny writes outside the fixture root, log every attempted absolute path, isolate Git/system config, and fail on any non-allowlisted external read/write. |
| R2 | Forbidden command forms are “absent from the data-bearing route.” | Static absence does not prove byte-preserving behavior across installations. | Use a table of npm layouts and hostile argv, assert the exact executable/argv tuple, and prove no shell child or marker process is created. |
| R3 | “Registered transport/operation pair.” | Registry ownership, schema version, and backward compatibility are undefined. | Define a versioned result schema and authoritative registry; reject unknown required fields while preserving explicitly optional annotations. |
| R4 | “Recoverable backup.” | Recovery location, naming, permissions, and overwrite behavior are unspecified. | Require exclusive backup creation, hash equality with the pre-replacement file, a path under an approved backup root, and a tested restore command. |
| R5 | “Old valid state or new valid state.” | Not achievable from the stated two-file algorithm without more design. | Test a named publication protocol at every injected crash point and run recovery before read. |
| R7 | Concurrent collectors preserve all state. | Two happy-path processes do not cover termination, lease loss, duplicated external success, or restart. | Add a deterministic fault-injection matrix and prove at-most-once publication plus no second paid request for a completed operation with a recoverable receipt. |
| R8 | Last-good snapshot permits recovery. | A copied, stale, or attacker-modified snapshot could silently authorize collection. | Define snapshot integrity, binding to config path/schema, age/rotation, and when it may authorize collection. |
| R9 | Scanner detects “supported” files/patterns. | “Supported” can be narrowed until every test passes. | Publish the exact path globs, pattern families, byte/count bounds, exclusions, and resulting assurance level in doctor output. |
| R10 | Index snapshot is exact. | Filters, attributes, submodules, symlinks, and executable bits are unstated. | Define which Git object types are supported and compare materialized bytes/modes with `git cat-file` for the entire fixture matrix. |
| R11 | 30,000 paths are “under the existing watchdog.” | A 120-second ceiling is too loose to detect an accidental quadratic regression. | Record a platform-tolerant absolute ceiling plus a scaling ratio between 3,000 and 30,000 paths. |
| R12 | Preserve unrelated entries “byte-for-byte.” | JSON parsing/serialization commonly changes whitespace/order even when semantics are preserved. | Either use a patching serializer and test byte preservation, or promise semantic preservation and exact preservation of untouched command objects. |
| R13 | Create a backup “outside the replacement target.” | This can still write outside the authorized project or overwrite an older backup. | Use an explicit operator-approved backup root, exclusive creation, manifest/hash verification, and no automatic restore if any file is untracked or modified. |
| R14 | “Full-for-claim.” | No schema, reviewer, or expiry rule defines the label. | Define locator, reviewer, claim ID, evidence version, review timestamp, and invalidation on refresh. |
| R15 | “Answered plan questions” and “reviewed.” | Neither term has an authoritative state owner or signature. | Define mandatory fields, allowed state transitions, actor identity, and which content change invalidates approval. |
| R16 | Dry-run predicts the same operations as execution. | Cache and source state can change between the two runs. | Bind the plan to an input/cache fingerprint; execution must refuse or replan visibly when the fingerprint changes. |
| R17 | “Source authority is reviewed.” | Reviewer identity, rationale granularity, and inheritance across claims are undefined. | Store authority per claim/source pair with reviewer and scope; never inherit it merely from a hostname or source row. |
| R18 | Two green suites and one live smoke imply ready. | Repeat count is too small for races, and live-smoke freshness/expiry is absent. | Apply the approved benchmark gates, define smoke validity duration, and report `offline-verified`, `live-verified-until`, or `not-ready` separately. |

## Unnecessary or over-bundled scope

1. **R5 is at least three revertable tasks:** content fingerprint/version semantics; contained manifest/archive reads; crash-safe publication and corrupt-index recovery.
2. **R7 is at least two tasks:** lease semantics and durable transaction/recovery. Combining them makes failures hard to localize and violates the plan’s own revert test.
3. **R15 combines state-model design with enforcement across brief, audit, checks, preflight, and CLIs.** Freeze and test the state machine first; integrate each consumer in separate commits.
4. **R17 combines hostname correctness, authority review, source dates, upstream cache metadata, evidence supersession, and template migration.** The lookalike-host bug is a small independent fix; the evidence lifecycle is a larger architectural change.
5. **R18 is a program, not a package.** Split release identity/deployment parity, offline end-to-end, benchmark harness, task set, release report, live smoke, and documentation.
6. **R9’s “additional credential types” is broader than F26.** Start with declared credentials the kit can actually encounter and publish coverage. Add unrelated secret families only with a separate threat model.
7. **A blanket ban on dependencies is not itself an acceptance criterion.** Keep the dependency-free preference, but allow a reviewed exception if custom HTML parsing or locking would be less safe than a small pinned library.

## Recommended plan edits before approval

1. Add a persisted-artifact compatibility and migration section.
2. Freeze the Wave 3 claim/evidence/review schema before package implementation.
3. Reorder R11 before R10; merge or explicitly sequence R6/R7.
4. Split R5, R7, R15, R17, and R18 into revertable packages.
5. Add transport safety/body-limit ownership and harness timeout cleanup.
6. Make the benchmark specification and 24 locked tasks normative R18 prerequisites.
7. Replace qualitative acceptance language with fault-injection matrices, immutable fingerprints, and explicit state-transition tables.
8. Define release states and validity windows so a missing or expired live smoke cannot be mistaken for permanent readiness.

No code, configuration, benchmark fixture, task gold, or paid collection is authorized by this review.
