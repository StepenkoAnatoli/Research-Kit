# ADR-0106 — The Wayback witness is opt-in, lookup-only, and outside the ledger

- **Date:** 2026-09-30
- **Status:** accepted
- **Area:** `lib/witness.mjs`, `lib/research-run.mjs` (`witnessCapture`), `bin/research.mjs` (`--witness`)
- **Research:** `docs/decisions/2026-09-30-wayback-witness/`

## Context

The ledger proves that a capture was not edited after it was fetched. It cannot prove the
page said what the capture holds. A Wayback Machine snapshot of the same URL, taken close to
the capture time, is a copy held by a third party: an independent witness.

The research project found:
- **E-01:** the Availability API, `GET archive.org/wayback/available?url=&timestamp=`,
  answers `archived_snapshots.closest` or `{"archived_snapshots":{}}`. The page is from
  2013 and says it changes.
- **U-02:** no documented programmatic save.
- **U-04:** the terms of use could not be read by the kit.
- **U-05:** no documented rate limit.

## Decision

- **Opt-in.** `research --witness` turns it on. Without the flag, nothing is sent to the
  Internet Archive, and a test pins that. A lookup discloses the URL being researched.
- **Lookup only.** The kit asks for the snapshot closest to the capture time. It never
  asks the archive to save a page (U-02).
- **One lookup per newly collected page.** A cached page, a failed fetch and a dry run get
  none. A refused lookup is not retried (U-05).
- **Recorded outside the corpus's evidence.** Each lookup appends one line to
  `research/witnesses.jsonl`: `at`, `url`, the capture's `raw` path, and
  `witnessed` with `snapshot`/`timestamp`/`status` or a `reason`. The file is outside
  `research/raw/` and the hash-chained ledger, and it is not a dotfile, so it travels with git.
- **It can never fail a capture.** The lookup never throws. A malformed answer, an HTTP
  refusal or a network error is `witnessed: false` with a reason. No gate check reads the file.

## Rejected alternatives

- **On by default.** It would send every researched URL to a third party without being
  asked, and the terms (U-04) are unread.
- **Request a save when there is no snapshot (Save Page Now).** Undocumented as an API
  in the captured pages (U-02), and a save is public and permanent. Revisit when the SPN2
  documentation is captured as an owner page.
- **Record the witness in the ledger or in the capture's front matter.** Either would put
  a third party's answer inside the hashed evidence, so a flaky lookup could alter or
  block a capture.
- **A gate check on witnesses.** A missing snapshot says nothing about the page, and most
  pages have none. Revisit if the kit grows a use for "witnessed" beyond the record.
