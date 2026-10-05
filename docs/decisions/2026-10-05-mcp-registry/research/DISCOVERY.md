# Discovery Contract - How should Research-Kit be distributed and listed in the official MCP Registry?

Started 2026-10-05. This file is the definition of "enough information to build".
`node "$HOME/.agents/research-kit/bin/preflight.mjs"` reads it and blocks the build until every unknown
below is either `CLOSED` with evidence or `KNOWN-UNKNOWN` with a verification step.

## Build intent

Determine a supported way to list Research-Kit's existing stdio MCP server in the
official MCP Registry (registry.modelcontextprotocol.io), so developers using Claude
Code, Cursor and VS Code can find it. The research deliverable is an evidence-backed
decision and builder handoff covering distribution, Registry publication and client
discoverability, including the server's GitHub-token requirement. This task only
scaffolds that research project; it does not publish a package or a Registry entry,
change the MCP server, or authorize a packaging design.

Starting assumptions supplied by the operator, not collected evidence: the Registry
requires a server.json pointing to a published package; Research-Kit is not published;
`npm view research-kit` returned 404 on 2026-10-05. Verify these against primary sources
during research rather than treating them as closed unknowns or choosing npm upfront.

## Unknowns

A fact belongs here when guessing it wrong changes the design: API limits and pricing,
auth model, data schemas, rate limits, licensing/ToS, platform behavior, current library
versions, competitor pricing, data availability.

Status is exactly one of:
- `CLOSED` - proven by an `E-##` row in `research/EVIDENCE.md` (which must point at cached raw text).
- `KNOWN-UNKNOWN` - unreachable now; the `Evidence` cell names the day-one verification step.

Anything else (`OPEN`, blank, "in progress") fails the gate.

| ID | Unknown | Why it blocks the build | Status | Evidence |
|---|---|---|---|---|

Not yet decomposed or collected. Draft the map first, then enumerate blocking unknowns
from it, including supported distribution routes, publisher authentication and namespace
ownership, package metadata and runtime requirements, token handling, and what Registry
listing actually makes discoverable in each target client. No build is authorized.

## Questions for the human (maximum 3)

Intent questions only - things no document can answer. Facts never go here; they go in
the table above. If a question's answer is in public documentation, it is a research
task, not a question.

## Already decided

Locked decisions for this project. Do not revisit these without the human.

- Keep this decision's contract and eventual corpus in this nested project, separate
  from the repository's root transport/vendor research (ADR-0030).
- ADR-0116 rejected a package.json version field because the kit is not an npm package.
  It remains in force; this scaffold does not supersede it.
- The feature freeze in ADR-0117 remains in force. Any implementation that requires
  lifting it needs an explicit ADR for that item after research, not an implicit
  exception in this scaffold.
- Use the existing MCP server at `research-kit/bin/mcp-server.mjs` as the starting
  point; do not include credentials in committed research or package metadata.
