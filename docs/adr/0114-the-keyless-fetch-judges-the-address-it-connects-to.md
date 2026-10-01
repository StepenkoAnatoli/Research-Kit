# ADR-0114 — The keyless fetch judges the address it connects to

- **Date:** 2026-10-01
- **Status:** accepted; supersedes the "DNS rebinding" bullet of ADR-0110
- **Area:** `lib/http-transport.mjs` (`guardedLookup`, the fetch child)

## Context

ADR-0110 refuses a redirect into this machine's network, and left DNS rebinding open with a
trigger. The kit resolved a name to judge it, and `fetch` then resolved the name again to
connect. A name server can answer "public" to the first lookup and "internal" to the second, so
the address judged was not the address connected to.

## Decision

- **The fetch child wraps `dns.lookup`.** Node's `fetch` resolves a host name through
  `dns.lookup` when it opens a connection. Measured on Node 22.22: one lookup, with
  `all: true`, and an error from it stops the connection. The test makes a real `fetch` through
  the wrapper, so the Node 24 and 26 CI legs check the same thing there.
  - The wrapper refuses any answer that holds an internal address, with an `EINTERNAL` error
    naming the host and the address. So the addresses judged are the addresses connected to,
    and a second, different answer has nowhere to go.
- **The same exemptions as ADR-0110 hold.**
  - An internal URL the operator asked for is theirs: the wrapper reads that decision at each
    lookup.
  - The proxy's own host is exempt. Behind a proxy the connection goes to the proxy, which can
    sit on an internal network, and the proxy resolves the target.
- **The redirect check of ADR-0110 stays.** It refuses a hop before any request goes out, and
  names both hosts.

## Not covered, and why

- **An address written as an IP literal** is never looked up, by Node or by this wrapper. The
  redirect check judges it, as before.
- **The browser transport** resolves names inside Chromium. That is ADR-0115's subject.

## Rejected alternatives

- **Rewrite the fetch child onto `https.request` with a `lookup` option.** This pins the same
  way, but loses `fetch`'s proxy support (`NODE_USE_ENV_PROXY`), which would then have to be
  rebuilt by hand. The wrapper keeps `fetch`, and its proxy handling, as they are.
- **Connect to the judged IP with a `Host` header.** HTTPS checks the certificate against the
  name it connects to, so this breaks every https page, or else needs certificate checking
  turned off.
