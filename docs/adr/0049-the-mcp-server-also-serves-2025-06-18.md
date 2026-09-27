# ADR-0049 — The MCP server also serves 2025-06-18

- **Date:** 2026-09-27
- **Status:** accepted
- **Area:** MCP server
- **Extends:** ADR-0034 (the collector speaks MCP over stdio; its echo and fallback rules stand)
- **Evidence:** [`docs/decisions/2026-09-27-mcp-protocol-versions`](../decisions/2026-09-27-mcp-protocol-versions/research/BRIEF.md)

## Context

ADR-0034 made the server dual-era: it serves `2026-07-28` and `2025-11-25`. On `initialize` it
echoes a requested revision it serves and answers anything else with `2025-11-25`. On
2026-09-27 a round trip from a cloud container asked for `2025-06-18` and got `2025-11-25`.

The official TypeScript SDK's client asks for `2025-06-18` and does not accept `2025-11-25` up
to and including 1.24.0, published 2025-12-02 (E-04, E-06). 1.25.0, published 2025-12-15, is
the first to ask for `2025-11-25` (E-05). The specification says a client that does not support
the version in the server's reply SHOULD disconnect (E-03). So every client built on an SDK
release from before mid-December 2025 disconnected from this server.

## Decision

**`SUPPORTED_VERSIONS` becomes `2026-07-28, 2025-11-25, 2025-06-18`.**

- Nothing 2025-11-25 changed touches this server's handshake, tool listing or results (E-01).
  Its additions are optional (icons, an `Implementation` description) or unused here
  (authorization, HTTP, elicitation, sampling, tasks). The server already follows 2025-06-18's
  rules.
- A server that supports the requested version MUST respond with the same version (E-03). The
  echo already in `initialize` does that once the revision is listed.
- **2025-03-26 is not served.** This server's results carry `structuredContent` and
  `resource_link` content, and both first appear in 2025-06-18 (E-02).
- The fallback for an unplaceable version stays `2025-11-25` (ADR-0034), a documented departure
  from the specification's SHOULD-be-latest. Neither SDK release in the corpus lists
  `2026-07-28`.

## Rejected alternatives

- **Serve 2025-03-26 as well.** It would need a second result shape without `structuredContent`
  or resource links. Nobody has asked for it, and both SDK releases in the corpus already ask
  for 2025-06-18 or newer.
- **Fall back to 2025-06-18 instead of 2025-11-25.** A client that asks for a version this
  server cannot place is more likely to be newer than older. 1.25.0 accepts 2025-11-25 (E-05),
  as did 1.30.0 when ADR-0034 was measured. The echo already covers a client that asks for
  2025-06-18 by name.
- **Leave it.** Clients from before December 2025 would keep disconnecting, with nothing in the
  server's log to say why.

## Consequences

- A client on an SDK from before 1.25.0 connects. `server/discover` lists three revisions.
- A 2025-06-18 client is served results shaped by today's rules, which are also 2025-06-18's
  (E-01). SEP-1303, which reports invalid arguments as a tool result, is compatible with both
  revisions (next commit).

## Trigger that would reopen this

A revision after 2026-07-28 changes the handshake or the result shape. Or the tool results
change shape, which would make 2025-06-18 a promise the server no longer keeps.
