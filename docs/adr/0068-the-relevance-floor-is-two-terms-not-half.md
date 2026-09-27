# ADR-0068 — The relevance floor is two terms, not half (supersedes ADR-0067's threshold)

- **Date:** 2026-09-27
- **Status:** accepted
- **Area:** `lib/research-run.mjs` (`matchesQuery`)
- **Supersedes:** ADR-0067's "at least half the query's distinctive terms". The rest of
  ADR-0067 stands: the floor, the `prefer` exemption, the one-term exemption, and the report.

## Context

ADR-0067 was accepted the same day, and it was wrong. The threshold was checked against one
bad query and one good one, not against the corpora this repository already holds. Measured
afterwards on the 38 pages that real searches had found across the root corpus and the
nested decision projects, judging only titles and URLs (the snippets that real results
carry would only raise these numbers):

| Rule | Pages kept | Cited evidence rejected |
|---|---|---|
| half the terms (ADR-0067) | 2 / 38 | nearly all of it |
| at least 1 term | 36 / 38 | none, but it keeps the Postgres home page, the case the floor exists for |
| **at least `min(2, half)`** | 30 / 38 | **none** |

Long queries are where "half" fails, and the CI collector's default query is the whole topic
sentence. The EUDR run's decisive page, "EU Deforestation Regulation application postponed
to 30 December 2026", carries 3 of its topic's 10 terms and would have been rejected.

## Decision

A result is kept when it carries at least `min(2, ceil(n / 2))` of the query's `n`
distinctive terms: two terms, or half of a three-term query. Everything else in ADR-0067
stands.

Of the 8 pages the new rule rejects, 7 are pages no claim ever cited: Tavily's home page,
partnership and blog pages, another company's terms page, a Deno page, an untitled arXiv PDF. The eighth,
serpapi.com/faq, is kept by its query's `prefer: ["serpapi.com"]`. A test now runs the floor
over every cited, search-found page in the repository's corpora and fails if any is
rejected.

## Rejected alternatives

- **At least one term.** It keeps the Postgres home page, which matched only "postgres".
- **Weighting rare terms or identifiers.** That needs a frequency model the kit does not
  have. Two terms already separates the cases measured here.

## Trigger that would reopen this

A cited, search-found page that fails the corpus-wide test, or a new off-topic scrape that
carries two of its query's terms.
