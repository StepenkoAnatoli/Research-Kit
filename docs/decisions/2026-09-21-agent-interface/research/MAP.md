# MAP - topic decomposition

## Topic

Model Context Protocol MCP server transports authentication and long running tool calls

## Subtopics

Judged 2026-09-21 after collection. D-10 and D-11 are topic-specific: the universal
checklist has no row for "can a tool hand back a 70 KB ZIP" or "who decides the protocol
changes", and both are load-bearing here.

| ID | Subtopic | Why it matters | Status | Covered by |
|---|---|---|---|---|
| D-1 | Access model | Public pages, an official API, an auth-walled app, or a paywall - each is a different collection design | COVERED | U-1: two standard bindings, one set of semantics. The access model of the thing being built is "a subprocess the client launches" or "an HTTP endpoint the client POSTs to" |
| D-2 | Auth and credentials | What accounts, keys, or logins the collection and the product need, and who holds them | COVERED | U-3, U-4. The whole decision turns on this row: local needs nothing new, remote needs an authorization server |
| D-3 | Rate limits and quotas | Caps every cadence in the design, and caps the research collection itself | DISMISSED | MCP defines no rate limit; it is a message framing, not a metered service. The cap that binds is the Firecrawl credit and the `max_pages` bound already enforced by `collect.yml`, both settled in the parent corpus. E-01 mentions per-user rate limiting only as a REASON an operator might add authorization, not as a protocol feature |
| D-4 | ToS, licensing, legality of the intended use | A prohibition on automated collection, storage, or display ends the design for that source - and sometimes the project | DISMISSED | out of scope for this decision: implementing an open protocol specification engages no vendor's terms. The terms that govern what this kit fetches are Firecrawl's and are CLOSED in the parent corpus (U-4 there). Nothing about exposing the collector over MCP changes what it fetches or on whose authority |
| D-5 | Data schema and its stability | How the data is shaped, and how often the source changes the shape without asking | COVERED | U-1, U-5, and this is the row that should worry a builder. Messages are JSON-RPC over UTF-8, but the protocol is **versioned and has already changed in a breaking way**: E-03 records that this revision removed the connection-scoped `initialize` session and the server's ability to initiate requests, both of which earlier revisions had. A client and server "detect the counterpart's era and fall back". Anything built here must pin a revision the way the GitHub client pins `X-GitHub-Api-Version` |
| D-6 | Freshness and staleness | How fast the data goes stale, and what staleness costs the product that depends on it | COVERED | U-1, U-5. Both spec pages are dated `2026-07-28` in their own URLs, so the revision is legible from the citation. E-02, the community guide, is undated and already wrong in one place - which is the staleness cost made concrete |
| D-7 | Cost at expected volume | The economics at real usage, not the pricing page's first row - this decides viability | DISMISSED | an MCP server costs nothing to speak. The only money in this design is Firecrawl credits, spent by the collector whether an agent reaches it through MCP or through `collect-remote.mjs`. A hosted remote server would cost hosting, and that is a consequence of choosing remote rather than a fact about the protocol |
| D-8 | Runtime and platform limits | Where this actually executes - OS, runtime version, desktop app, cloud - and what those limits forbid | COVERED | U-1: `stdio` is "a client-launched subprocess", so the client's machine runs it and the kit's existing Node 22 requirement applies unchanged. Streamable HTTP needs something hosted and reachable, which is a different operational commitment |
| D-9 | Output obtainability | Does the data your stated "done" depends on exist, and can you actually get it? Load-bearing: a project whose output cannot be produced should die in phase 1, not phase 2 | COVERED | U-6. Was a GAP, and the gate refused the first brief over it. Closed by collecting the tools specification rather than by downgrading the row: `resource_link` returns a URI, which is exactly right for a corpus ZIP on the client machine |
| D-10 | How a long-running call is modelled | A collection takes minutes. Most tool calls take milliseconds. If the protocol has no answer, the tool cannot be written honestly | COVERED | U-2, U-5. The answer is constrained rather than absent: the server cannot speak first, so the work happens inside one held-open request with `notifications/progress`, or the tool returns a handle and the agent polls |
| D-11 | Who controls the specification, and how a breaking change arrives | A protocol that changes under a shipped product is the same risk as a CLI that changes under an adapter - and the kit already has an ADR about that | COVERED | U-8. Closed 2026-09-22, having been the only explicit GAP left in a committed corpus here. The answer that matters is a number: deprecated features keep working for at least twelve months, so a shipped server gets about a year to react rather than a release |
## Coverage notes (per dimension)

- **D-2 Auth - COVERED, and it is the decision.** Local: the kit's existing
  environment-variable credential is explicitly permitted. Remote: RFC 9728 metadata, an
  authorization server, client registration, browser consent. One is a config change; the
  other is a product.
- **D-5 Schema stability - COVERED, load-bearing.** The protocol has already broken
  compatibility once. Pin the revision.
- **D-9 Output obtainability - GAP, load-bearing.** See above and the brief.
- **D-11 Governance - COVERED (U-8), 2026-09-22.** Reached for, late. The protocol is a Series of LF Projects, LLC rather than one vendor's; decisions run through a published maintainer ladder and written SEPs; and deprecated features carry at least a twelve-month offramp. ADR-0034 dismissed this as moving "the planning horizon, not the architecture" - true of the architecture, and the planning horizon turned out to be a year, which is worth knowing precisely rather than not at all.

## Candidate material

Collected 2026-09-21 by `collect.yml` run 35600656154, `windows-latest`, depth `quick`,
one query. Three pages, all graded `full`: two from `modelcontextprotocol.io` - the
specification and the authorization tutorial - and one community guide on GitHub, kept as
secondary and cited for detail the spec pages omit.
