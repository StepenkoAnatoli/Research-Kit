# ADR-0140: The page's source text is kept beside the capture

Date: 2026-10-03
Status: accepted. Lifts the freeze (ADR-0117) for one change: a second file beside a capture
(`<capture>.source.html`), two ledger fields (`source`, `sourceSha256`) and the checks that
verify them. From the gap audit of 2026-10-03 (rank 3), with WARC 1.1's record of the HTTP
message collected in `docs/decisions/2026-10-03-gap-audit-capture` (E-08) and Firecrawl's
format pricing in the root corpus (E-02).

## Context

A capture is the page converted to Markdown: Firecrawl's conversion, or the kit's own
(`http-transport.mjs`, the browser transport). The text the server sent is read, converted
and discarded, and the ledger hashes the conversion. So a defect in the conversion is
permanent: G3 (2026-10-03) deleted comparison text from every list item, cell and heading of
every page captured before 6c22c67, and those captures still hold the damaged text, with a
chain that proves the damaged text is what was written. The quote check anchors claims in
that text. Nothing in the corpus can say what the page said instead.

WARC keeps the HTTP message itself (E-08); ADR-0090 chose `resource` records of the kept text
for the export and rejected `response` records, because the kit had no bytes to put in them.
Firecrawl returns the page's HTML as a second format at no extra credit: the pricing page
names only JSON, Question and Highlight as formats that add credits (root E-02), and a live
scrape with `--format markdown,rawHtml` on 2026-10-03 billed one credit. The keyless child
holds the decoded HTML before it converts it, and the browser transport's DOM dump is the
source it converts.

## Decision

1. **Every transport that converts HTML hands back the text it converted, as `source`.**
   Firecrawl's argv adds `--format markdown,rawHtml` and `normalizeScrape` keeps
   `data.rawHtml`; the keyless adapter returns the decoded body of an HTML answer; the browser
   adapter returns the rendered DOM. A verbatim capture (JSON, plain text) has no source apart
   from itself and returns none.
2. **The collector writes the source beside the capture, LF-folded, as `<capture>.source.html`**
   (`writeSource` in `collect.mjs`), and the fetch's ledger entry names it: `source` (the path)
   and `sourceSha256` (its hash). The folding is the one the capture body gets
   (`foldLineEndings`), so the scaffold's `.gitattributes` keeps the hash stable across
   checkouts; the file is the text the converter read, not the wire bytes. A source over
   `CAPTURE_MAX_BYTES` is not written and not named. A sibling already on disk with other
   content is not overwritten (a capture is never rewritten, ADR-0026's rule applied to its
   source); that fetch's entry then names no source. A source that was given and is not kept
   is named on the entry as `sourceOmitted`, with the reason, so a reader can tell "the
   transport gave no source" from "not kept"; a sibling name that cannot be written (a link
   planted there) is one such reason, and never fails the fetch (review, 2026-10-04).
3. **The source is under the ledger's protection.** `verifyLedger` checks a named source as it
   checks the capture: missing is `raw-missing`, a changed one is `body-unmodified`, so the
   commit gate refuses an edited source as it refuses an edited capture (ADR-0093).
4. **The source is not a capture.** `readCaptures` skips `*.source.html`: it is never indexed,
   cited, graded or exported, and `uncited-capture` does not name it; a `*.source.html` that
   no ledger entry names is a `source-unnamed` corpus problem (review, 2026-10-04). The gate reads the
   Markdown, as before. The WARC export is unchanged (ADR-0090 stands); a future ADR may put
   the source into `conversion` or `response` records now that the bytes exist.

## Rejected

- **Keeping the wire bytes untouched** (no folding, binary attribute in `.gitattributes`). The
  scaffolded projects already on disk have no such attribute, and a CRLF page would fail
  `body-unmodified` on every Windows checkout exactly as ADR-0020 describes for captures. The
  purpose is re-conversion, which the folded text serves.
- **Storing the source inside the capture file** (a second section after the Markdown). It
  would change the body every quote check and hash reads, double every capture, and make the
  oldest readers of the format wrong.
- **A per-run opt-out flag.** A new flag under the freeze for a case nobody has: at about ten
  times the Markdown, the 266 captures in this repository would add on the order of tens of
  megabytes, which git handles. Revisit when a corpus proves otherwise.
- **Re-fetching instead of keeping.** It spends credits, and the page may have changed.

## Trigger to revisit

A corpus whose sources exceed what its repository can carry; or the WARC export gaining
`conversion`/`response` records, which this ADR makes possible.
