# ADR-0104 — SearXNG is a search provider, chosen explicitly

- **Date:** 2026-09-30
- **Status:** accepted
- **Area:** `lib/searxng.mjs`, `lib/transport.mjs` (`SEARCH_PROVIDERS`, `selectSearch`),
  `lib/machine.mjs` (`searxngUrl`)
- **Research:** `docs/decisions/2026-09-30-searxng-search` (gate PASS)

## Context

The keyless search route scrapes DuckDuckGo-lite, which answers automated requests with a bot
check. It did so again while this provider was being researched. SerpAPI works, but it is a
metered, keyed vendor.

A SearXNG instance answers `GET /search?q=...&format=json` with no key (E-01). Two facts
shape the design:
- JSON is off by default: `search.formats` lists only `html`, and an unset format gets
  HTTP 403 (E-01, E-02). Many public instances disable it.
- A result's `url` may be null (E-06).

## Decision

- **`searxng` is a search-only provider** beside `serpapi`, with the same contract. It
  searches, cannot fetch, and refuses by name when asked to.
- **Configuration is only a URL:** `SEARXNG_URL`, or `searxngUrl` in the machine config.
  Nothing secret is sent.
- **It is chosen explicitly:** `--search-transport searxng`, or `searchTransport` in the
  machine config. Automatic selection is unchanged.
- **Its failures are named:**
  - no URL, or a URL that is not http(s): refused before any request;
  - HTTP 403: "JSON output is not enabled", naming `search.formats` and `settings.yml`;
  - unreachable instance, non-JSON body, timeout: each reported by name.
- **Rows without a string `url`** are dropped.
- **Searches are not counted** on a search meter: the provider has none.

## Rejected alternatives

- **Choosing SearXNG automatically when a URL is set.** Automatic selection today means
  "SerpAPI if a key exists, merged with the fetch provider's search". Folding a third
  provider into that merge changes what every existing configuration spends and returns.
  An explicit choice changes nothing for anyone who does not make it.
- **Pointing at a public instance by default.** E-01 says many disable JSON, and the kit
  must not lean on someone else's server for its searches.
- **Bundling or starting SearXNG.** It is an AGPL Python service with its own dependencies.
  The kit stays zero-dependency, and the operator runs the instance.

## Expires when

SearXNG changes its Search API or its JSON result shape. The provider's tests pin the
shape, so a change shows up as dropped rows or a named error, not wrong candidates.
