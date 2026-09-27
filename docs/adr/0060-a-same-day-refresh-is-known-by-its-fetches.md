# ADR-0060 — A same-day refresh is known by its fetches

- **Date:** 2026-09-27
- **Status:** accepted
- **Area:** `lib/checks.mjs` (`hygiene/duplicate-url`)
- **Refines:** ADR-0026 (a refresh adds a row and leaves the old one standing)

## Context

`hygiene/duplicate-url` warns about two evidence rows for one URL on the same day, because
a refresh was assumed to land on a later day. `research.mjs --force` refreshes on the same
day. On 2026-09-27 that produced two findings that contradict each other:
`evidence-supersession` said E-02 supersedes E-01, and hygiene called E-02 a duplicate.

## Decision

Two same-day rows for one URL are a refresh when the ledger records at least as many
fetches (`op: scrape`) of that URL on that day as there are rows. Otherwise they are a
duplicate, which is what a pasted row looks like: one fetch, two rows.

## Rejected alternatives

- **Tell them apart by capture file.** Since ADR-0058, a changed page gets its own file
  but an unchanged page reuses the original. A same-day refresh of an unchanged page
  would still be called a duplicate.
- **Drop the same-day warning.** A pasted row is the case the check was written for, and
  it still needs catching.

## Trigger that would reopen this

Evidence rows recording the ledger sequence of their fetch, which would make the pairing
exact rather than a count.
