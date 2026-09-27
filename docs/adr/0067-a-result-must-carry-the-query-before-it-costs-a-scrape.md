# ADR-0067 — A search result must carry the query before it costs a scrape

- **Date:** 2026-09-27
- **Status:** superseded in part by ADR-0068 (the threshold: two terms, not half)
- **Area:** `lib/research-run.mjs` (`selectCandidates`, `matchesQuery`, `queryTerms`, `isPreferred`)

## Context

Candidate ranking reads only the URL. On 2026-09-27 SerpAPI answered "postgres
pg_sync_replication_slots function" with eight generic "postgres" pages: the home page,
Reddit, Wikipedia and forums. The home page scored 0 and was the best of them, so the kit
scraped it and added a row of evidence about nothing the query asked. The title and snippet,
which say whether a result is about the query at all, were never read.

## Decision

A query's distinctive terms are its words of four or more characters that are not stopwords.
An identifier is matched as a phrase, with `_` and `-` read as spaces. A result is kept only
if its title, snippet or URL (decoded) carries at least half of those terms, or if it is on a
domain the plan names in `prefer` - the operator has already said that domain carries the
fact. A query with fewer than two distinctive terms is not judged, because overlap cannot tell
its results apart.

When every result of a search misses, nothing is scraped for it. The run says `no result
matched "<query>"`, and `.failures.jsonl` records `op: search-off-topic`.

## Rejected alternatives

- **At least one term.** Every result of the failing search matched "postgres", so it would
  have caught nothing.
- **All terms.** It rejects good pages whose titles are terse. A keyless search carries no
  snippet, so the title and URL are all there is.
- **No exemption for `prefer`.** The existing fixture showed the cost: a pricing page on the
  preferred docs domain, titled only "Pricing", was rejected for a query about rate limits.

## Consequences

- Measured on real searches the same day: the failing SerpAPI query now scrapes nothing and
  says why, and a keyless query for "postgres logical replication failover slots" still
  collects the failover documentation page.
- A good page with a terse title, on a domain the plan does not prefer, can be skipped. The
  skip is reported, and adding the domain to `prefer` or rewording the query brings it back.

## Trigger that would reopen this

A search provider whose results carry no titles, which would leave this rule only the URL
to judge.
