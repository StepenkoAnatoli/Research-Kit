# ADR-0065 — Firecrawl search spend is counted, and estimated by the documented rule

- **Date:** 2026-09-27
- **Status:** accepted
- **Area:** `lib/firecrawl.mjs` (`search`), `lib/research-run.mjs`, `lib/decompose.mjs`, `bin/research.mjs --status`

## Context

Only the SerpAPI adapter reported `searchesUsed`. On 2026-09-27, four `decompose` searches
took the Firecrawl balance from 409 to 402, and one plan query plus one scrape took it from
402 to 399. The kit recorded `searchesUsed: 0`, and `research --status` said "searches (this
project) 0". On the default provider, a large share of the spend was invisible to the tool
that exists to keep it disciplined (AGENTS.md Rule 5).

## Decision

A successful Firecrawl search reports `searchesUsed: 1` and a `creditsEstimate` of 2 credits
per 10 results, rounded up (E-03, the billing docs; E-14 states the rounding). An empty
result is estimated at 2, because the documented rule does not price it and under-counting
is the defect being fixed. A failed call is not counted.

`runResearch` and `decompose` add the estimate to their usage row as
`searchCreditsEstimate`. The run's summary line and `--status` print it labelled as an
estimate, and point at `doctor` for the account's real balance.

The estimate is vendor-neutral in `research-run.mjs`: it sums whatever `creditsEstimate` an
adapter reports and names no vendor (NFR-3).

## Rejected alternatives

- **Read the balance before and after each search.** That is one more CLI call per search,
  the balance is team-wide (another machine's spend would be attributed here), and it is
  already available from `doctor`.
- **Count searches but not credits.** Firecrawl bills per 10 results, not per search, so a
  count alone would still hide what a wide `limit` costs.
- **Price an empty search at 0.** Nothing in the corpus says that, and the kit would again
  be reporting less than the account paid.

## Consequences

- Measured on the same day: one search plus one scrape took the balance from 398 to 395, and
  the kit recorded 1 scrape plus an estimated 2 search credits.
- Searches through the anonymous (unauthenticated) CLI report the same estimate, though no
  account is charged. The usage row names the transport, so the two can be told apart.

## Trigger that would reopen this

Firecrawl returning the credits a call actually used in its response, which would replace
the estimate with the vendor's own number.
