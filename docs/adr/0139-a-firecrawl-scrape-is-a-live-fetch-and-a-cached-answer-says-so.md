# ADR-0139: A Firecrawl scrape is a live fetch, and a cached answer says so

Date: 2026-10-03
Status: accepted. A bug fix under the freeze (ADR-0117): no new command, flag or format;
the adapter's argv and the capture's front matter change. From the gap audit of 2026-10-03
(rank 2), with the vendor's rule collected in
`docs/decisions/2026-10-03-gap-audit-capture` (E-18).

## Context

Firecrawl's scrape endpoint serves a cached copy of a page when it holds one younger than
`maxAge`, which defaults to two days (E-18: "Returns a cached version of the page if it is
younger than this age in milliseconds ... Defaults to 2 days."). The adapter sent
`scrape <url> --only-main-content --json` with no `--max-age`, and discarded the payload's
`metadata.cacheState` and `metadata.cachedAt`. So a capture stamped `retrieved: <today>`
could be the vendor's copy from the day before, and nothing recorded it. Reproduced live on
2026-10-03: a default scrape of a page the kit had fetched the previous day answered
`cacheState: hit, cachedAt: 2026-10-02T16:46Z`, one credit; with `--max-age 0` the answer
carried no cache state, one credit; the kit's own fixture
`test/fixtures/firecrawl-scrape-1.25.3.json` holds `cacheState: hit` as well.

This defeats the kit's own freshness rules. `--refresh-days` and `--force` exist to re-read
a page as it is now, and a re-fetch served from the vendor's cache cannot see a change the
page made yesterday; `cacheDecision`, the stale warning and the supersession rules all judge
by `retrieved`, which overstated the capture's currency by up to two days.

## Decision

1. **Every Firecrawl scrape passes `--max-age 0`.** A scrape is a live fetch of the page as
   it is at that moment. The kit already decides what to re-fetch and when (`cacheDecision`,
   `--refresh-days`, `--force`); the vendor's cache has nothing to add to that decision, and a
   live fetch costs the same credit.
2. **A cached answer is recorded if the vendor sends one anyway.** `normalizeScrape` keeps
   `metadata.cacheState` and `metadata.cachedAt`; `writeRaw` writes them into the capture's
   front matter (`cacheState:`, `cachedAt:`) and `appendFetch` into the ledger entry, only when
   present. `retrieved` stays the day the kit asked; a reader of the capture can see when the
   vendor says the bytes were taken. No gate check reads them yet.

## Rejected

- **`--max-age` set to the kit's refresh window** (`refreshDays` in milliseconds). It would
  let a `--refresh-days 30` run accept a 29-day-old vendor copy for a page the operator asked
  to re-read now, and `--force` would need its own exception. One rule is simpler and costs
  nothing more.
- **Setting `retrieved` to the vendor's `cachedAt` day.** It changes what a date the collector
  wrote means, for a case rule 1 removes; recording the vendor's fields beside the kit's keeps
  both facts.
- **Leaving the default and warning on `cacheState: hit`.** The warning would fire on every
  second fetch of a page, and the capture would still be the stale copy.

## Trigger to revisit

Firecrawl removes `maxAge` from the scrape endpoint, or starts charging for a live fetch what
it does not charge for a cached one.
