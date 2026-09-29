# ADR-0090 — The corpus exports as WARC 1.1 resource records

- **Date:** 2026-09-28
- **Status:** accepted
- **Area:** `lib/warc.mjs`, `bin/export-warc.mjs`
- **Evidence:** `docs/decisions/2026-09-28-warc-export/` (U-01..U-03)

## Context

A corpus could only be read by the kit. Web archives have a standard, WARC. Its 1.1 text
names the mandatory fields and the record types (E-01), and warcio is an independent reader
to check an export against (E-02). The kit keeps each page's extracted text and a ledger
entry. It never keeps the HTTP exchange.

## Decision

- **The command:** `bin/export-warc.mjs [--out <file>]` writes one `.warc.gz`. The default
  is `research-corpus.warc.gz` in the project folder. It is written whole or not at all,
  and only after `readWarc` has split it back into records.
- **The records:**
  - One `warcinfo` record comes first.
  - Then, per ledger `scrape` entry whose capture is on disk and still matches its ledger
    hash, two records:
    - a `resource` record: the capture's text after its front matter, as
      `text/markdown; charset=utf-8`, dated at the fetch;
    - a `metadata` record, joined to it by `WARC-Concurrent-To`. It carries the
      transport, the completeness (and what was omitted), the evidence type, the capture
      file, the ledger's hash and sequence number, and the entry hash.
- **Digests:** every record has `WARC-Block-Digest: sha256:<hex>`.
- **Record IDs:** `urn:uuid` values shaped as RFC 9562 version 8, derived from the ledger
  entry.
- **The date:**
  - The warcinfo date is the latest ledger time, not the clock.
  - Together with the derived IDs, this means one corpus exports the same bytes every time.
- **Compression:** each record is its own gzip member, as the standard recommends.
- **An edited capture** is left out, and named with its ledger sequence number.
- **It never gates:** the corpus and its ledger remain the evidence, and the export is a copy.
- **Validation:** warcio's `check` passed every digest in the exports of the root and all
  nineteen decision corpora.

## Rejected alternatives

- **`response` records.** The kit never stored the HTTP status line and headers. A
  response record would claim an exchange that was not kept.
- **WACZ packaging.** It adds a zip, indexes and a datapackage on top of the WARC. That can
  come later, if someone replays these files. Nobody does yet.
- **Random record IDs, or the clock as the warcinfo date.** Two exports of one corpus
  would then differ, and a diff between them would show noise instead of change.
- **`sha1:` in base32, as the standard's examples use.** The field takes any labelled
  algorithm. The kit already hashes in SHA-256, so a reader can compare against the ledger.
- **Exporting an edited capture anyway.** The archive would then carry a page the ledger
  does not vouch for, under a date when it was not that page.
