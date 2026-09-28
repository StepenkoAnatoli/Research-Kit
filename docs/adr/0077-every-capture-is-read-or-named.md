# ADR-0077 — Every capture is read or named: a size limit, and no silent skip

- **Date:** 2026-09-28
- **Status:** accepted
- **Area:** `lib/corpus.mjs` (`readCaptures`, `CAPTURE_MAX_BYTES`), `lib/provenance.mjs`
  (`verifyLedger`), `lib/checks.mjs` (corpus-shape)

## Context

Verifying an outside break-test (F-07, 2026-09-28) on `main`:

- A 100 MB file in `research/raw/` crashed every command that reads the corpus. It failed
  after about 56 s with a raw `RangeError: Set maximum size exceeded` from the similarity
  sketch.
- A 600 MB file could not be read as a string at all. `readText` returned `null`,
  `readCaptures` skipped it without a word, and the gate passed.
- An unreadable capture (uid `nobody`, mode 000) was skipped the same way by
  `readCaptures`, and then crashed preflight in `verifyLedger`, which read it with a bare
  `readFileSync`.

The largest real capture across this repository's 136 is 465 KB.

## Decision

- `CAPTURE_MAX_BYTES` is 10 MB. `readCaptures` checks the size with `stat` before reading.
  A larger file becomes `capture-too-large` and is not read.
- A file `readCaptures` cannot read becomes `capture-unreadable` instead of being skipped.
- Both are blocking in corpus-shape, alongside `capture-outside` (ADR-0076).
- `verifyLedger` reports a ledger-named capture it cannot read as `raw-unreadable`
  instead of throwing.

## Rejected alternatives

- **Warn, not block.** A file in `research/raw/` the gate cannot read is not evidence. A
  warning would let a corpus pass with a file nobody checked.
- **Stream or sample large captures.** No page the collector fetches is this size. Reading
  one in part would bless an artifact of unknown origin.
- **The outside break-test's 10 MB check alone.** It stopped the crash, but it left an
  unreadable capture silently skipped by `readCaptures` and crashing `verifyLedger`.

## Trigger that would reopen this

A legitimate capture approaching the limit, such as a large PDF rendered to text.
