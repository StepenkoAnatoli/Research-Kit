# ADR-0099 — A render warning is for captures a closure cites

- **Date:** 2026-09-29
- **Status:** accepted
- **Area:** `lib/checks.mjs` (`capture-completeness`, `partial-render`)
- **Amends:** ADR-0038 (a judgement the gate can read)

## Context

A capture that prints a render failure ("There was an error while loading") gets
`capture-completeness/partial-render`, a warning. It tells the reviewer to confirm that the
text they cite is present, and to record that in a `[render-reviewed: ...]` note on the
row. It applied to every capture with such a marker.

MoonAliza's secret-masking corpus (2026-09-29) kept a phase-0 GitHub Discussion as a
context-only row: "no claim rests on it", cited by no unknown.
- The warning fired on it.
- Its instruction, confirm the text you cite, had no cited text to apply to.
- Every phase-0 map collects such pages. Each would cost the reviewer a note about nothing,
  and a warning that is often noise stops being read.

## Decision

- **The check applies only to a capture that backs an EVIDENCE row some unknown cites,**
  whatever that unknown's status.
- **An uncited capture:** nothing from this check. Hygiene's own check still reports a
  capture that no EVIDENCE row cites at all.
- **Unchanged:** the marker patterns, the warning's severity, and the render-review note that
  closes it.

## Rejected alternatives

- **Keep warning on every capture.** That is the defect: an instruction with nothing to act
  on, repeated on every phase-0 page.
- **Skip rows whose Finding says "context only".** That makes the gate read prose, which
  this repository's gates do not do (`AGENTS.md`, the standing protocol). Whether an unknown
  cites the row is structure the gate already reads.
- **Delete context-only rows.** A capture on disk without a row is hygiene's warning instead.
  Phase 0's material is worth keeping, as ADR-0091 keeps its outlines.
