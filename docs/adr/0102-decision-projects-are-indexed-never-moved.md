# ADR-0102 — Decision projects are indexed, never moved or deleted

- **Date:** 2026-09-30
- **Status:** accepted
- **Area:** `docs/decisions/` (nested research projects, ADR-0030)

## Context

ADR-0030 put research about the repository itself into nested projects under
`docs/decisions/`. On 2026-09-30 there were 22 of them, and an outside review (Grok) asked
for a retention rule before they become noise.

What the folder held that day:
- 18 projects back an accepted ADR, the kit's code, or a workflow.
- 4 back no ADR: `eudr-dates`, `tavily-privacy`, `tavily-terms` and `collection-cost-model`.
  Each is cited by a measurement document or a test instead.
- About 60 references point into these paths: ADRs, code comments, `collect.yml`, tests and
  measurements.

## Decision

- **Nothing in `docs/decisions/` is deleted or moved.**
- **`docs/decisions/README.md` indexes every project:** its question, what it backs, and a
  status.
- **Status is one of three:**
  - **active**: an accepted ADR, code or a workflow rests on it;
  - **superseded**: every ADR it backs was superseded;
  - **reference**: only measurements, tests or reports cite it.
- **When things change:**
  - A new project adds its row in the commit that adds it.
  - A superseding ADR updates the status of the project behind the ADR it replaces.

## Rejected alternatives

- **An `archive/` folder for old projects.** Moving a project breaks the references into
  it, or forces an edit sweep through ADRs and code that changes nothing but paths.
- **Deleting projects nothing cites.** The captures and the ledger are the provenance of
  the claims made from them. AGENTS.md records what deleting a scratch project cost: every
  claim resting on it lost its evidence.
- **No rule.** The folder keeps growing, and nothing tells a reader which projects still
  carry a decision.

## Expires when

- The index itself becomes hard to read (roughly 100 rows), or
- a project must leave the repository for a reason other than age: a licence or privacy
  problem in a capture.
