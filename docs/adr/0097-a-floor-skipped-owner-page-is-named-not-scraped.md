# ADR-0097 — A floor-skipped page on the likely owner is named, not scraped

- **Date:** 2026-09-29
- **Status:** accepted
- **Area:** `lib/decompose.mjs` (the `--max-scrapes` loop, `MIN_NAMED_OWNER_SCORE`, the map)

## Context

Before a phase-0 scrape, decompose checks that the page's title, snippet or URL carries two
terms of the query that found it (`matchesQuery`, ADR-0067 and ADR-0068).

On MoonAliza's Ollama `/v1` map (2026-09-29), the map ranked `docs.ollama.com` the likely
owner, with a score of 8. Phase 0 then skipped the page that owned the fact:
- The page was titled "OpenAI compatibility - Ollama documentation".
- A terse title carries one term of a long topic sentence, so it missed the floor.
- Nothing said the page had been skipped except one log line, and the owner page had to be
  found and named by hand.

## Decision

- **The floor holds for every page,** the top owner's included.
- **Skipped owner pages are named:** when it skips a page on the owners that tie for the top
  `docsHosts` score, the map lists it under "Skipped on the likely owner", and says to name
  it in `research/plan.json` `urls` if it is the page that owns the fact. The CLI log names
  it too.
- **The guard:** only an owner that earned the ranking counts. Its score must be at least
  `MIN_NAMED_OWNER_SCORE` (3): one `docs.`/`developer.` host, or three mentions. A flat
  ranking, one result per host, names nothing.
- **It costs nothing:** nothing is fetched, and the budget and the cache are unchanged.

## Rejected alternatives

- **Trust the top owner past the floor, as research trusts a `prefer` domain.** Built first
  and dropped the same day: it failed RR-9, the test the floor exists for. Postgres docs
  live on postgresql.org, so the owner is right, but its home page shares only the product's
  name with the query. A terse docs title and an off-topic home page look the same to the
  floor. Only a reader, or the operator's own `prefer`, can tell them apart.
- **Lower the floor to one term on the owner.** It still passes postgresql.org's home page,
  because "postgres" occurs in "PostgreSQL".
- **Loosen `matchesQuery` itself** (stemming, splitting phrase terms). That changes the floor
  for research too, which ADR-0067 set for identifiers.
