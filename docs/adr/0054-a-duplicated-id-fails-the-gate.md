# ADR-0054 — A duplicated ID fails the gate

- **Date:** 2026-09-27
- **Status:** accepted
- **Area:** `lib/checks.mjs` (`hygiene`, `corroboration`)
- **Refines:** ADR-0004 (the contract-check registry)

## Context

An ID is how the rest of the corpus refers to a row. A claim cites `E-01`, a map row marked
COVERED cites `U-1`, the brief cites both, and a reviewer cites them in conversation. On
2026-09-27 a contract with two `U-1` rows passed the gate. `hygiene/duplicate-id` warned,
and `corroboration` printed the same "U-1 rests on E-01 alone" warning twice, once per row.
The checks look rows up by ID in a `Map`, which keeps the last row, so a reference to a
duplicated ID resolves to one row silently. A claim can then be judged against a row its
author did not mean.

## Decision

`hygiene/duplicate-id` is a **fail**, and its message says what to do: give the second row
its own ID, or delete it if it is a copy. `corroboration` weighs each unknown ID once, and
leaves the duplicate to hygiene.

No corpus committed to this repository has a duplicated ID, so the change turns nothing red.

## Rejected alternatives

- **Keep it a warning.** A warning lets the gate PASS while a reference means one of two
  rows, which is the ambiguity the gate exists to remove. The fix takes seconds, and no
  legitimate corpus needs two rows under one ID: ADR-0026 has a refresh add a row with a new
  ID and leave the old one standing.
- **Fail only duplicated unknowns, and keep evidence and subtopic duplicates as warnings.**
  Evidence IDs are what claims cite, so a duplicated evidence ID is at least as ambiguous.
  One rule for all three tables is simpler to state and to keep.
- **Drop repeated findings by their text in `corroboration`.** Two rows under one ID can
  carry different cells. Their findings would differ, so both would print, and the reader
  still could not tell which one the rest of the corpus means. Weighing each ID once is
  enough, because the duplicate itself now fails.

## Consequences

- A corpus with a duplicated ID fails preflight, and the commit gate then refuses its code
  commits until the ID is fixed.
- A test duplicates `U-1` in a passing fixture and asserts both parts of the decision: one
  `duplicate-id` fail, and no finding printed twice.

## Trigger that would reopen this

A corpus format in which one ID legitimately spans several rows, such as a claim continued
over two table rows. The check would then need to know that format.
