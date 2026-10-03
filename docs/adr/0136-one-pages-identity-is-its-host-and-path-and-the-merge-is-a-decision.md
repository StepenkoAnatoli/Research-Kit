# ADR-0136: One page's identity is its host and path, and the merge is a decision

Date: 2026-10-03
Status: accepted. Records the rule `urlKey` has applied since 2026-09-27 and names the
alternative; the output-reliability audit of 2026-10-03 (G6) argued against the rule
without knowing it was one.

## Context

`urlKey` (`lib/core.mjs`) names a page by its host without `www.`, its path without a
trailing slash, and its query - scheme dropped, case of the host folded. The seen set in
`runResearch`, `selectCandidates`, decompose's candidate list and `cacheDecision` all compare
by it, so `https://example.com/api`, `https://example.com/api/`, `http://example.com/api` and
`https://www.example.com/api` are one page: a plan or a search that names two spellings pays
for one fetch, and a cached capture of one spelling is a cache hit for the others.

The rule was adopted on 2026-09-27 after collect run 36283114657 paid twice for
`.../ui-and-api` and `.../ui-and-api/`, and widened on 2026-10-02 to the plan's own URLs
after a plan written in two spellings paid once per spelling.

The audit's G6 reproduces the other edge of the same rule: a synthetic index holding only a
fresh capture of `/api` answers `hit: true` for `/api/` with no redirect observed, so a site
that serves two different resources at the two spellings - RFC 3986 section 6.2.4 says
equivalence under a trailing slash is learned from the protocol, not assumed - has its second
resource substituted by the first, or a planned fetch of it suppressed. Incidence on real
sites was not measured by the audit and is not measured here.

## Decision

The rule stands. A page is its host and path; the kit treats the four spellings as one and
pays once, because the cost it was adopted against - paying for the same page under every
spelling a search returns - is observed on every run, while a site that distinguishes
`/api` from `/api/` is the exception the standard permits and the kit has not met.

Two things are said so the decision stays honest:

- The seen set and the cache are explicit about the identity they use: a `skipped` result
  names the spelling that was fetched, and a cache hit under another spelling carries the
  entry's own URL. A reader can see the merge happened.
- The remedy for a site that does distinguish is not a kit flag: name the second resource
  with a query or a fragment-free distinct path in the plan, or fetch it with `--force`.

## Rejected

- **Keep scheme, host and trailing slash in the identity; learn aliases from observed
  redirects.** Correct by the standard and the audit's recommendation, but it reintroduces
  the double payment on every run for the common case, and the kit records no redirect
  chain today (the Firecrawl CLI reports the final URL only sometimes, the browser never),
  so "observed" would mostly mean "unknown". Revisit when the ledger records a final URL
  for every transport.
- **Keep the merge but ask before reusing a cache entry under another spelling.** A prompt
  in a collector that runs unattended in CI is a refusal; a refusal spends nothing and
  collects nothing.

## Trigger to revisit

A ledger entry that records the final URL of every fetch on every transport, or a measured
corpus where the two spellings of one path carried different content.
