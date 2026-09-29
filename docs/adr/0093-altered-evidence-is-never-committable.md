# ADR-0093 — Altered evidence is never committable, whatever else is staged

- **Date:** 2026-09-29
- **Status:** accepted
- **Area:** `lib/gate.mjs`, the commit gate
- **Amends:** ADR-0048. The phase-1 allowance still holds, now for completeness findings only.

## Context

While the verdict fails, the commit gate lets through a commit confined to `research/` and
the project's scaffolding (ADR-0048). The reasoning is that committing evidence is the
workflow. An open unknown, a gap or a missing brief is the normal state of phase 1.

The allowance did not look at *why* the verdict failed. A break-test on 2026-09-29 (PR #140,
item 1) appended a typed line to a tracked capture:

- Committed alone, the hook allowed it ("confined to research/").
- Committed beside one code file, the hook blocked it on `provenance/body-unmodified`.

So whether altered evidence entered history depended on what else was staged. The kit
promises that evidence is fetched, not typed, and here that promise was a function of an
unrelated file.

## Decision

- **The rule:** before the phase-1 allowance, a commit is blocked when preflight fails with
  an **integrity** finding. That means a provenance rule in `INTEGRITY_RULES`:
  - `body-unmodified`: a capture edited after its fetch;
  - `chain-intact`: seq, prev or entry hash broken;
  - `ledger-unparsed`: a line that does not parse, torn or not;
  - `fetch-entry-exists`: a cited capture with no fetch behind it.
- **The message:** the block says the evidence was altered, and gives the remedy: restore
  from git, or re-collect.
- **Everything else is as before.** Completeness findings stay committable inside
  `research/`, and code stays blocked while the verdict fails.

## Rejected alternatives

- **Block every provenance finding.** `ledger-missing` and `raw-missing` are normal
  mid-collection, or in a part-staged corpus. Holding them would undo ADR-0048's point.
- **Include the prior's order rules** (`prior-single`, `prior-precedes-collection`). They
  judge a claim recorded in an immutable chain, which cannot be repaired. Blocking them
  would lock the project out of committing for good. They stay visible in every verdict.
- **Leave it, because handoff refuses a tampered corpus later.** That is discovery at the
  far end, after the altered bytes are in history and have travelled.
- **Block at the edit-time hook as well.** The edit hook gates the agent's product edits.
  The bytes that matter are the ones committed, and the commit gate judges exactly those
  (ADR-0024).

## Consequences

- A corpus with a real integrity failure cannot be committed without an override
  (`--no-verify`, `GATE_OFF` or a local `hooksPath`), and each of those is recorded.
- A Windows checkout's line-ending smudge does not trigger this. The gate judges the index,
  which holds LF bytes, and that case is diagnosed by handoff (ADR-0020).
