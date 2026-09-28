# ADR-0082 — A page past the size limit is refused, not kept cut short

- **Date:** 2026-09-28
- **Status:** accepted
- **Area:** `lib/runtime.mjs` (`MAX_PAGE_BYTES`, `CHILD_OUTPUT_LIMIT`, `outputOverflow`), `lib/http-transport.mjs`, `lib/firecrawl.mjs`, `lib/serpapi.mjs`

## Context

Every transport runs its request in a child process through `spawnSync`, which buffers the
child's output. No transport set `maxBuffer`, so Node's default of 1 MiB applied. Arena
break test 8 found that a page a little over 1 MiB failed with `spawnSync ... ENOBUFS`,
and many real documentation pages are that size. A Firecrawl scrape that large was paid
for and then lost. The keyless child also called `response.text()`, which read any body
into memory, however large.

## Decision

- **A page limit of 16 MiB** (`MAX_PAGE_BYTES`). The keyless child refuses a body whose
  `Content-Length` exceeds it, and stops reading a body without one as soon as it passes
  the limit. The error names the limit.
- **A child output limit of 128 MiB** (`CHILD_OUTPUT_LIMIT`, eight times the page limit,
  because JSON escaping can grow a body up to sixfold) for the keyless, SerpAPI and
  Firecrawl children. An overflow becomes one sentence naming the limit, and the partial
  output is discarded rather than parsed.

## Rejected alternatives

- **Keep the first 16 MiB and grade it `partial`.** A truncated HTML document is not the
  page: extraction runs over an unclosed tree, and the hash in the ledger would be of a
  fragment that no later fetch reproduces. A refusal is honest about the gap and says why.
  A partial grade would dress a cut-off byte stream up as evidence.
- **Remove the limit (a huge `maxBuffer`).** Then one hostile or broken server decides how
  much memory a collection uses.

## Consequences

- A page over 16 MiB cannot be collected by the keyless transport. The reason is recorded
  as a failed capture, and the fact behind it is then a KNOWN-UNKNOWN or needs another
  source.
- Firecrawl's own output is bounded only by the child limit, because the CLI returns the
  whole answer at once.
