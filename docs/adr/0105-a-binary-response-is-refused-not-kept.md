# ADR-0105 — The keyless transport refuses a binary response instead of keeping it

- **Date:** 2026-09-30
- **Status:** accepted
- **Area:** `lib/http-transport.mjs` (`scrape`, `bodyKind`)
- **Follows:** ADR-0033 (the collector refuses rather than degrades)

## Context

Since commit 471f69f (2026-09-26) the keyless transport has read a response by its
Content-Type:
- HTML is extracted;
- text is kept verbatim;
- a binary type (PDF, image, archive) was also kept verbatim, graded `partial`, with the
  reason "not a faithful copy".

On 2026-09-30, researching the Wayback witness, a 10-page PDF (a paper on web-archive
evidence) was captured this way:
- The capture was 2.3 MB, and the whole of it was going into a committed corpus.
- `response.text()` had replaced every byte UTF-8 could not hold. The file could not be
  reopened as the PDF.
- The PDF's text sits in compressed streams, so no quote could ever be found in it.

It was a capture in name only: it proved nothing, and it cost the repository its size forever.

## Decision

- **`scrape` refuses a binary response.** It returns `ok: false` with a reason that names
  the content type. The collector then records a failed fetch and writes no file.
- **The reason names the remedy:** `--transport firecrawl-cli`, which converts documents
  such as PDFs to text, or an HTML page that carries the same text.
- **HTML and text responses are unchanged.**

## Rejected alternatives

- **Keep the capture, graded partial (the previous behaviour).** Partial means "the page,
  with something missing". This was not the page in any form, and ADR-0033 already
  prefers a named refusal to a degraded result.
- **Store the bytes as base64.** That keeps the file faithfully, but the gate still could
  not read a quote in it, and the corpus would grow by a third more than the file itself.
- **Extract PDF text in the kit.** That needs a PDF parser, and the kit has no dependencies.
  Firecrawl already does this on the metered route.
