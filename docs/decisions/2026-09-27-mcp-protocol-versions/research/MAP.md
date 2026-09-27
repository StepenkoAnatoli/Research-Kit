# MAP - topic decomposition

## Topic

MCP Model Context Protocol specification 2025-11-25 changelog vs 2025-06-18 version negotiation

## Subtopics

Statuses are blank on purpose: phase 0 gathers material, it does not judge. Mark each
row COVERED (cite the U-## rows that cover it), DISMISSED (reason required - dismissing
is fine, omitting is not), or GAP, and add topic-specific subtopics where the checklist
is not enough.

| ID | Subtopic | Why it matters | Status | Covered by |
|---|---|---|---|---|
| D-1 | Access model | Public pages, an official API, an auth-walled app, or a paywall - each is a different collection design | COVERED | U-1, U-2, U-3, U-4. The specification is public on modelcontextprotocol.io; the SDK is a public npm package, read through jsDelivr's mirror of it |
| D-2 | Auth and credentials | What accounts, keys, or logins the collection and the product need, and who holds them | DISMISSED | no account or key is involved: every source is public, and the change needs none |
| D-3 | Rate limits and quotas | Caps every cadence in the design, and caps the research collection itself | DISMISSED | six public pages, fetched once |
| D-4 | ToS, licensing, legality of the intended use | A prohibition on automated collection, storage, or display ends the design for that source - and sometimes the project | DISMISSED | reading a public specification and an MIT-licensed package to decide our own build; the corpus keeps quotes with their source |
| D-5 | Data schema and its stability | How the data is shaped, and how often the source changes the shape without asking | COVERED | U-1, U-2. The protocol revisions are the schema, and the changelogs are where it changed |
| D-6 | Freshness and staleness | How fast the data goes stale, and what staleness costs the product that depends on it | COVERED | U-4. Which revisions clients speak moves with SDK releases; the answer expires when a new revision ships |
| D-7 | Cost at expected volume | The economics at real usage, not the pricing page's first row - this decides viability | DISMISSED | no cost: a constant and its tests |
| D-8 | Runtime and platform limits | Where this actually executes - OS, runtime version, desktop app, cloud - and what those limits forbid | COVERED | U-3, U-4. Which clients can connect at all is this project's runtime question |
| D-9 | Output obtainability | Does the data your stated "done" depends on exist, and can you actually get it? Load-bearing: a project whose output cannot be produced should die in phase 1, not phase 2 | COVERED | U-1, U-2, U-3, U-4. The specification documents the rules and the SDK source states what its client accepts |

## Coverage notes (per dimension)

_One short paragraph per row once it has a status: what was established, and what the
status rests on._

## Candidate material

Gathered 2026-09-27.

Likely owners of these facts (by how often a search pointed at them):

- `docs.rs` (4)
- `github.com` (2)
- `glama.ai` (2)
- `mcptest.io` (2)
- `pub.dev` (1)
- `sequel.sh` (1)

Candidate pages:

- [nyo16/conduit_mcp: Elixir implementation of the Model ...](https://github.com/nyo16/conduit_mcp)
- [MCP (Model Context Protocol) for Dart](https://pub.dev/documentation/mcp_dart/latest/)
- [MCP Sentinel by pasihaka](https://glama.ai/mcp/servers/pasihaka/mcp-sentinel)
- [mcpkit::protocol_version - Rust](https://docs.rs/mcpkit/latest/mcpkit/protocol_version/index.html)
- [What Is MCP (Model Context Protocol)? - Sequel](https://sequel.sh/blog/what-is-mcp)
- [Can MCP Clients Decide What to Do After Failure?A Result ...](https://arxiv.org/html/2609.00072v1)
- [Dart的MCP（模型上下文协议） | MCP Servers](https://lobehub.com/pt-BR/mcp/leehack-mcp_dart)
- [MCP 2026-07-28: 20 Breaking Changes and the Errors They ...](https://www.maximem.ai/blog/mcp-2026-07-28-migration-errors)
- [What Is MCP? Model Context Protocol for Marketers 2026](https://www.sprites.ai/blog/what-is-mcp-for-marketers)
- [build123d-mcp/CHANGELOG.md at main](https://github.com/pzfreo/build123d-mcp/blob/main/CHANGELOG.md)
- [mcp-server](https://www.stackage.org/nightly-2026-09-25/package/mcp-server)
- [Rectus Content Access for MCP](https://da.wordpress.org/plugins/rectus-content-access-for-mcp/)
- [MCP vs RAG vs Agent Skills Explained (2026)](https://computingforgeeks.com/mcp-vs-rag-vs-agent-skills/)
- [pdfnative-mcp by Nizoka](https://glama.ai/mcp/servers/Nizoka/pdfnative-mcp)
- [MCP vs A2A in 2026: Which Agent Protocol to Use | Articles | o-mega](https://o-mega.ai/articles/mcp-vs-a2a-in-2026-which-agent-protocol-to-use)
- [Testing Remote MCP Servers - mcptest.io - MCP Playground](https://mcptest.io/docs/testing-guide)

