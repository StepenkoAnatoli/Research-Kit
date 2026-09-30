# ADR-0107 — The review is the agent's, and the state says REVIEW_REQUIRED

- **Date:** 2026-09-30
- **Status:** accepted
- **Area:** `lib/artifact.mjs`, `lib/artifact-validator.mjs`, `lib/brief.mjs` (`reviewedBy`),
  `lib/mcp.mjs`, `bin/collect-remote.mjs`, `schemas/artifact-manifest.schema.json`,
  `collect.yml`, both AGENTS.md files and both READMEs
- **Supersedes in part:** ADR-0074 (the `human` reviewer, and keeping the state name)

## Context

ADR-0074 found that the three review steps are checked by what they leave behind, never by
who did them, and let the reviewer declare `agent` or `human`. It kept the state name
`HUMAN_REVIEW_REQUIRED` because consumers switch on it.

The operator decided on 2026-09-30 that the review is the agent's alone: there is no human
step in this kit. The declaration `human`, the prose offering the review to "an agent or a
person", and a state named after a human were left describing a workflow the kit no longer has.

## Decision

- **Format 2.0.0.** A collected package that waits for review says `REVIEW_REQUIRED`, and
  `review.by` is `agent` or `undeclared`.
- **1.x packages stay valid.** The validator reads majors 1 and 2. It reports a 1.x
  package's `HUMAN_REVIEW_REQUIRED` as `REVIEW_REQUIRED`, so a consumer switches on one name.
- **Each major keeps its own names.** A 2.x package carrying `HUMAN_REVIEW_REQUIRED` or
  `review.by: "human"`, or a 1.x package carrying `REVIEW_REQUIRED`, is refused by name
  (`MANIFEST-SCHEMA`): no version of this kit produced it.
- **`Reviewed by: human` in a brief reads as `undeclared`.** The drafted brief's placeholder
  names only the agent.
- **Approval does not change.** The same four conditions, checked the same way.
- **Unchanged:** a person may still be the builder in phase 2, and Rule 2's questions about
  intent still go to the operator. Only the review changes hands.
- **Committed corpora are not rewritten.** Their briefs are records of how they were
  reviewed; the old draft wording in them stays.

## Rejected alternatives

- **Keep the state name (ADR-0074's choice).** No format change, but the package would still
  tell every reader a human is required, which is now false.
- **Rename and stop reading 1.x.** Cleaner, and every package collected before would fail
  validation for a rename, not a defect.
- **Keep `human` as an accepted declaration.** It would keep a role the kit no longer has in
  the format, and invite a consumer to wait for a person who is not coming.

## Trigger that would reopen this

A decision to put a person back into the review, or to sign packages (ADR-0032's next
version), which could bind the declaration to an identity.
