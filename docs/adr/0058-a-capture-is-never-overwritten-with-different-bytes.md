# ADR-0058 — A capture is never overwritten with different bytes

- **Date:** 2026-09-27
- **Status:** accepted
- **Area:** `lib/collect.mjs` (`writeRaw`)
- **Refines:** ADR-0026 (a refresh adds a row and leaves the old one standing)

## Context

A capture's file name is the date, a slug of the title, and a digest of the URL. Two
collections of one URL on the same day, a `research.mjs --force` for example, therefore
wrote to the same file. On 2026-09-27 the page happened not to change, so the bytes and
hashes matched and nothing showed. When the page does change, the second write replaces
the first reading. The earlier evidence row then points at text it was never written
from, and its ledger entry no longer verifies, so an honest refresh fails the gate as if
someone had edited the capture by hand.

## Decision

`writeRaw` never overwrites a capture with different bytes. If the name is taken:

- and the file holds exactly the same text, the file is reused;
- otherwise the new capture is written as `<name>.r2.md`, then `.r3.md`, and so on.

`.r2.md` sorts after `.md`, which is how `readCaptures` treats the later capture of a day
as the latest for its URL. Collection runs under the ledger lock, so the check and the
write cannot interleave.

## Rejected alternatives

- **Put the time in every capture name.** It renames every capture, every committed
  corpus would carry two naming schemes, and it makes same-day refreshes of an unchanged
  page into duplicate files.
- **Refuse `--force` for a URL already captured today.** A page that changed an hour ago
  is exactly the case where a fresh reading is wanted.
- **A `-2` suffix.** `-` sorts before `.`, so the refresh would sort before the original
  and the corpus would hold the older reading as the latest.

## Consequences

- A name ending `.rN.md` is a same-day revision of the capture without the suffix.
- Past nine revisions a day, `.r10.md` sorts before `.r2.md`. A single URL needing ten
  forced collections in one day is not a case this kit plans for.

## Trigger that would reopen this

`readCaptures` choosing the latest capture from the ledger's sequence rather than from
file names, which would make the naming free again.
