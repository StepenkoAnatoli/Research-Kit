# ADR-0074 — The reviewer may be an agent, and the package says who declared it

- **Date:** 2026-09-27
- **Status:** superseded in part by ADR-0107 (the `human` reviewer is retired, and the state is renamed REVIEW_REQUIRED)
- **Area:** `lib/brief.mjs` (`reviewedBy`), `lib/artifact.mjs`, `lib/artifact-validator.mjs`,
  `lib/mcp.mjs`, `bin/collect-remote.mjs`, `schemas/artifact-manifest.schema.json`
- **Amends:** ADR-0032 (the artifact contract; format 1.0.0 → 1.1.0)

## Context

ADR-0032 approves a package when the gate passes and three review steps are done: the map
is classified, the findings are rewritten, and the brief is authored. It calls them "three
human steps", and the package said so: README-FIRST read "a human reviewed it", the collected
banner read "HUMAN REVIEW REQUIRED", and the MCP server told agents a corpus "requires human
review".

The code never checked that. `deriveState` sees what the steps leave behind, and cannot tell
who did them. AGENTS.md already gives the review to the phase-1 agent. So an agent could
approve a corpus while the package claimed a person had, and an agent reading the package
believed it had to stop and wait for one. An outside review of the kit (2026-09-27) read the
design as "no automated path to an approved brief", which is what the wording said and not
what the code did.

## Decision

- **Approval does not change.** The same four conditions, checked the same way.
- **The reviewer declares who reviewed** with a line `Reviewed by: agent` or
  `Reviewed by: human` in `BRIEF.md`. The drafted brief carries a placeholder, which reads as
  undeclared. `reviewedBy` in `lib/brief.mjs` is the one reader.
- **The manifest carries it** as `review.by`: `agent`, `human` or `undeclared`. It is optional
  in the schema, so 1.0.0 packages still validate. The format moves to 1.1.0. The validator
  reports it as `reviewedBy`, and `fetch_corpus` returns it.
- **The prose says what is known.** README-FIRST names the declared reviewer and calls it a
  declaration, or says none was made. The banner, the MCP description and `collect-remote`
  say review is for an agent or a person. The collection summary lists `reviewed by`.
- **AGENTS.md makes the review the agent's job**, in the repository and in the project
  template.
- **The state `HUMAN_REVIEW_REQUIRED` keeps its name.** Workflows and MCP clients switch on
  it, and renaming it would be a new format major. The README documents that it means
  "review required", by either.

## Rejected alternatives

- **Require `review.by == "human"` for approval.** It would make the declaration a gate
  nobody can verify, and it would re-create the problem: an agent-run pipeline could never
  finish. A consumer that wants a person checks the field itself.
- **Make the declaration an approval condition (`undeclared` blocks).** It adds a fifth
  step that proves nothing, and it would turn every approved 1.0.0-era project into an
  unapproved one on the next re-package.
- **A `--reviewed-by` flag on `artifact create`.** The package is often made by a workflow,
  not by the reviewer, and a flag says nothing that travels with the project. The brief is
  where the review is written, so it is where the declaration belongs.
- **Rename the state to `REVIEW_REQUIRED`.** Correct, and it breaks every consumer that
  switches on the current name. Only worth it with a format major.

## Consequences

- A validator from before 1.1.0 refuses a 1.1.0 package whose manifest carries `review.by`,
  because `review` is `additionalProperties: false`. Producer and validator ship together in
  the kit, so this only affects a consumer pinned to an old kit.
- Nothing here detects a false declaration. That is the same limit ADR-0032 states for the
  review itself: the format proves a package is consistent, not that the research is good.

## Trigger that would reopen this

A signed package (ADR-0032's "obvious next version"), which could bind the declaration to an
identity, or a format major, which could rename the state.
