# ADR-0009 — The Finding extractor stays in the collector (a dated rejection)

- **Date:** 2026-09-14
- **Status:** accepted
- **Area:** collector module boundary (`lib/collect.mjs`), architecture-review practice
- **Recorded by:** the 2026-09-14 architecture review
  (`docs/architecture-review-2026-09-14.md`, candidate 5)

## Context

The 2026-09-14 architecture review surfaced five deepening opportunities.
Candidate 5 proposed splitting `lib/collect.mjs`: the auto-extracted
**Finding** — the boilerplate/tracking/fact-verb/number-unit regex families,
the sentence splitter, the graded score, and the 220-character cap
(≈140 lines) — would move to its own module with
`firstFinding(markdown, fallback)` as its whole interface.

The case for it was real but modest: the heuristics iterate more often than
the pipeline (the in-file history records rounds learned from real fetches),
and every round currently churns the collector's diff and shares its test
file. The deletion test is only mildly satisfied: the complexity is already
concentrated in one file; the split would move it to a better address, not
concentrate it anywhere new.

The case against: a boundary move of ≈140 lines of working heuristics, with
no behavior change, no second consumer, and no interface to deepen — the
risk is real and the gain is aesthetic.

## Decision

**The extractor stays in `lib/collect.mjs`.** Rejected for now.

This is a **dated call, not a permanent one** — recorded in the same shape as
ADR-0006's Cowork gap: a stated answer, accepted, with the trigger for
changing it named rather than implied.

**Triggers that expire this rejection** (either one):

1. **A second consumer of the extractor** — any module besides the collector
   that needs a page → one-line summary (a different cell, a different
   width, a different purpose). One consumer of one function is co-location;
   two is a seam.
2. **The heuristics outgrow their file** — the extractor's mass dominates
   `lib/collect.mjs` to the point that reading the collector means reading a
   different tool, or a second extraction variant becomes necessary.

When either trigger fires, this rejection has **expired**: re-run the
deletion test in that context, where the split answers a real second seam
instead of a better address. Until then, the rejection is recorded here and
in the review, not re-derived.

## Consequences

- A future architecture review reads this ADR before re-suggesting the split
  — the convention this directory sets — and weighs the trigger conditions
  against the current state instead of re-deriving the trade-off from
  scratch.
- The collector keeps its declared ownership — one URL's journey — with the
  placeholder extractor inside it: `firstFinding` keeps its small interface,
  and the heuristics keep iterating in the file that owns the cell they fill.

## Alternatives considered

- **Split now, into `lib/finding.mjs`.** Rejected: risk real (a boundary
  move of working code), gain aesthetic (a better address for code that
  already has an owner). No second consumer exists, and the file does not
  yet outgrow the concept.
- **No ADR — a note in the review document only.** Rejected: a note in a
  dated review is exactly what a future review re-derives from scratch. The
  ADR is the surface the review protocol consults, and a dated rejection
  needs its trigger stated, which a review note would not carry.
