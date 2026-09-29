# ADR-0094 — Phase 0 spends its scrape budget on the likely owners first

- **Date:** 2026-09-29
- **Status:** accepted
- **Area:** `lib/decompose.mjs`

## Context

`decompose --max-scrapes n` captures up to n of the pages its searches found. It already
ranks the hosts that look like owners of the facts (`docsHosts`: frequency, weighted towards
`docs.` and `developer.` hosts and API or reference paths), and it prints that ranking in the
map. The scrapes ignored it and followed search rank.

The first real use of the kit on MoonAliza (2026-09-29) showed the cost:

- The map named `docs.ollama.com` the likely owner, scoring 8.
- Both scrapes went to the top two search results instead: a third-party provider spec on
  GitHub and a 2024 forum thread.
- The owning pages had to be named by hand afterwards.

## Decision

- **Scrape order:** `scrapeOrder(material, hosts)` puts pages on the likely-owner hosts first,
  ordered by their host's score, then everything else. Each group keeps search order.
- **Unchanged:**
  - the relevance floor, which still applies to each page;
  - the cache, where a hit is still not an attempt;
  - the budget;
  - the map's candidate list, which keeps search order.

## Rejected alternatives

- **Scrape only owner hosts.** A topic with no documentation host would capture nothing. The
  other pages still come after the owners.
- **Score each page rather than each host** (for example, `/api/` paths first). That is a
  second heuristic on top of one that already weighs paths. Host order was enough to fix the
  observed failure.
- **Re-order the candidate list too.** The list is for a person to read, and search order is
  information in its own right.
