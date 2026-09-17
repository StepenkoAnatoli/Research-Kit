# ADR-0016 — The Finding extractor moves to its own module

- **Date:** 2026-09-15
- **Status:** accepted
- **Area:** the collector boundary (`lib/collect.mjs` → `lib/finding.mjs`), architecture-review practice
- **Supersedes:** [ADR-0009](0009-finding-extractor-stays-in-the-collector.md) — its trigger 2 fired. That ADR is left in its own words, unedited, as this directory's convention requires.
- **Recorded by:** the 2026-09-15 architecture review (`docs/architecture-review-2026-09-15.md`, candidate 1)
- **Relates to:** ADR-0003 (one owner per fact), ADR-0007/0008 (the map moves with the code)

## Context

ADR-0009 rejected this split on 2026-09-14 and named the two triggers that would
expire the rejection:

1. **a second consumer of the extractor** — one consumer of one function is
   co-location, two is a seam;
2. **the heuristics outgrowing their file** — "the extractor's mass dominates
   `lib/collect.mjs` to the point that reading the collector means reading a
   different tool".

**Trigger 2 has fired. Trigger 1 has not**, and this ADR says so rather than
quietly borrowing its force: there is still exactly one consumer of
`firstFinding` — the collector, which fills the cell — and the split is
justified by mass and by iteration rate alone, which is what trigger 2 was
written to catch.

**The measurement.** In the 658-line `lib/collect.mjs` this change starts from,
the extractor's block runs from line 26 to line 485: **460 lines — 70% of the
file**. What is left of the collector is 174 lines (`writeRaw`, `collectOne`,
`uniqueRawName`) behind 24 lines of file header and imports. The operator
measured the same file independently and got the same shape: "the extractor
spans roughly lines 34-490, leaving ~166 lines of actual collector in a
658-line file". To reach `collectOne` — the function the file's first line
declares it owns — a reader scrolled past seven regex families, a sentence
splitter, a table reader, two block skippers, a graded scorer and a cell cap.

The second half is the iteration rate ADR-0009 already named: the heuristics
change when a fetched page surprises them (every round recorded in the block's
comments comes from a real capture), and each round churned the collector's diff
and shared a test file with the pipeline.

## Decision

**The extractor moves to `lib/finding.mjs`, and `firstFinding(markdown, fallback)`
is its whole interface.** No behavior change: the 460 lines are the same lines,
the interface keeps its two arguments and its return, and the 17 heuristic tests
move with it to `test/finding.test.mjs`.

- `lib/collect.mjs` **imports** `firstFinding` and **does not re-export it**.
- The collector's own pin — *the evidence row is filled with prose, not the page
  banner* — stays in `test/collect.test.mjs`. It is the one test that proves the
  two modules still join, and it is why the split does not leave the pipeline
  untested at its new seam.
- The four captured-page excerpts that pin feeds on move to
  `test/fixtures.mjs` rather than being copied into both test files.

### The deletion test, re-run in this context — as ADR-0009 instructed

ADR-0009's case against the split was that the deletion test was "only mildly
satisfied: the complexity is already concentrated in one file; the split would
move it to a better address, not concentrate it anywhere new". Re-run now that
the trigger has fired:

- **Concentration: unchanged, and honestly so.** The heuristics were one block
  before and are one module now; nothing is concentrated that was not. This was
  the weak half of the case then and it is still the weak half now — the split
  moves the extractor to a better address, and the address is the point.
- **What changed is the trigger's own condition.** "Reading the collector means
  reading a different tool" has stopped being a figure of speech: 70% of the
  file was a second concept with a second reason to change, so the file did not
  answer its declared question — one URL's journey — until line 486. After the
  move `lib/collect.mjs` is 200 lines that read as one concept, and the
  extractor is 471 lines behind a two-argument interface whose whole surface is
  one function name.

## Consequences

- A heuristic learned from a new fetch shape lands in `lib/finding.mjs` and
  `test/finding.test.mjs` — the collector's diff stops carrying rounds that have
  nothing to do with a URL's journey.
- `lib/finding.mjs` is the kit's only module with no filesystem, no corpus and
  no injected adapter: a pure function from a page to a line of prose, which a
  caller can exercise with a string. It is also one more module
  `docs/ARCHITECTURE.md` has to name.
- A second consumer — trigger 1, still unfired — imports `lib/finding.mjs` and
  changes nothing about the interface. The move did not wait for it and does not
  depend on it arriving.
- The map moves in the same commit (ADR-0007/0008), and the **finding** term in
  `CONTEXT.md` now names where the words in the cell come from.
- `firstFinding` is no longer importable from the collector. Nothing in the kit
  imported it from there except the tests that moved with it, so this breaks no
  caller; it is recorded because a rename of an import path is the kind of thing
  a future review should not have to discover by running the suite.

## Alternatives considered

- **Leave it where ADR-0009 put it.** Rejected: that ADR expired by its own
  terms. Re-litigating it instead of superseding it would leave two ADRs
  disagreeing with no dated reason between them.
- **Re-export `firstFinding` from `lib/collect.mjs`**, so any importer written
  against the old address keeps working. Rejected: there was exactly one such
  importer (the collector's own test file, which moved), and re-exporting would
  give one function two addresses — the ambiguity the split exists to remove. A
  caller that wants the extractor asks for the extractor's module.
- **Split the extractor further** — scanning, scoring and inline cleaning as
  three modules. Rejected: no part of it has a second consumer, three modules of
  one heuristic each would each be shallower than the one, and the loop that
  produced every comment in the block is one loop, not three.
- **Copy the page fixtures into both test files.** Rejected: a fixture with two
  owners drifts, and the drift is silent — each copy would still pass its own
  assertions while the two files judged different pages.

## What would expire this decision

This is a boundary decision rather than a dated rejection, so it carries no
expiry trigger of ADR-0009's kind. It would be revisited if `lib/finding.mjs`
itself outgrew one concept — a second extraction variant (a different cell, a
different width, a different purpose) would be the signal, and the variant
belongs as a second named function beside `firstFinding`, not as a new file — or
if the interface had to grow because the collector stopped being the only
consumer. Either way: a new ADR, superseding this one.
