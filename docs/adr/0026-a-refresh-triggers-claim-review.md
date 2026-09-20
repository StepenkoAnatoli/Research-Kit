# ADR-0026 — A refresh triggers claim review; it never substitutes silently

- **Date:** 2026-09-17
- **Status:** accepted
- **Area:** the check registry, evidence freshness

## Context

`--refresh-days` and `--force` re-collect a page that is already in the corpus. The
2026-09-16 review (F21) reproduced what that does: a new row `E-02` is appended, the old row
`E-01` stays exactly where it was, and the unknown that cited `E-01` still cites `E-01`.

So the refresh produced a fresher capture and left the citation pointing at the stale one.
The claim above `E-01` was written by reading bytes the source no longer serves, and nothing
asked anybody to re-read it. `unknown-closure` kept warning that the citation was stale — and
the suggested remedy, re-collecting, was the very thing that had just been done and had not
helped.

The failure mode is specific and quiet: a claim that was true when it was written, resting on
a capture that has been superseded, in a corpus that passes its gate.

## Addendum, 2026-09-20 — the first real refresh, and what it found

This ADR was written and tested against fixtures. The first refresh of an actual corpus
happened on 2026-09-20, when six captures that predated a metered transport were
re-collected, and it worked exactly as designed: the gate **blocked** with five
`cites-superseded-row` failures until every claim had been re-read and every citation
moved.

It also showed that two other checks had never been told about this ADR.

- **`transport-provenance`** warned about all six superseded rows, even though nothing
  cited them any more. This ADR says plainly that the old capture is kept as history;
  reporting the provenance of a capture no claim rests on is noise, and worse than noise,
  because it buries the rows that do carry a claim.
- **`hygiene/duplicate-url`** warned "one row per fetched page" about all six pairs —
  which is the state this ADR *requires*. The check predated it and contradicted it.

Net effect: a corpus cleaned from nine warnings to zero produced twelve. Both checks are
now supersession-aware, through one shared `supersededRows(corpus)` helper rather than
three private re-derivations. `duplicate-url` still fires for two rows of the same URL
retrieved on the **same day**, which is the real duplicate it was written for and which
no refresh produces.

The lesson is about the ADR rather than the checks: **a rule that changes what a valid
corpus looks like has to be carried to every check that reads one.** This one was carried
to the check it created and to none of the others, and that went unnoticed for four days
because nobody had performed the operation the ADR governs.

## Decision

**A twelfth check, `evidence-supersession`, placed between `capture-completeness` and
`collection-attempts`.**

- A row is **superseded** when another row cites the same URL with a later retrieval date.
  The corpus already holds everything needed to see this; nothing new is recorded.
- An unknown still citing a superseded row is a **failure**, naming both ids and the
  replacement's date: *re-read it, then move the citation or record why the earlier reading
  still holds.*
- A superseded row that no unknown cites **passes**, reported as kept history.
- **The old capture is never removed.** Evidence is irreplaceable, and the previous reading is
  the record of what the source used to say — which is exactly what a contradiction is made of.
- `unknown-closure`'s stale-evidence warning now distinguishes the two cases: when a fresher
  capture of the same URL already exists it says so, because *"go and collect"* and *"go and
  read what was collected"* are different instructions.

Registry order is part of the interface (ADR-0004), so the placement is deliberate: after the
checks that judge whether a capture is any good, before the ones that judge tidiness.

## Consequences

- A refresh now has a visible next step instead of a silent substitution, and the gate will
  not pass until somebody has actually looked.
- The registry goes from eleven checks to twelve. The pin in `test/checks.test.mjs` and the
  count in `docs/ARCHITECTURE.md`'s "current shape" both move; the first is updated here, the
  second is covered by ADR-0022's byte-preservation exception and recorded in the dated build
  report.
- Re-collecting a page now creates work rather than closing it. That is the point, and it is
  the cost: an operator who re-collects ten pages owes ten re-readings. The alternative is ten
  claims nobody checked.
- Supersession is derived from URL and date, so two rows for the same URL with the **same**
  retrieval date are not ordered and neither supersedes the other. `hygiene`'s `duplicate-url`
  warning already covers that shape.

## Rejected alternatives

- **Mark the old row superseded in `EVIDENCE.md` itself**, e.g. a struck-through id or a
  `Superseded` column. Rejected: it mutates evidence rows to record a fact the corpus can
  already derive, and it changes the table's shape — which the reader, the writers, and every
  existing corpus would have to learn.
- **Move the citation automatically.** The whole defect is a claim nobody re-read. Moving the
  pointer for them produces the same unread claim with a fresher-looking citation, which is
  worse: it would launder the problem instead of surfacing it.
- **Delete or archive the superseded capture.** Rejected on ADR-0003's terms: the corpus keeps
  what it collected. The old page is how a contradiction is proved later.
- **Make it a warning rather than a failure.** Rejected because the review's finding is
  precisely that this state passes today. A warning in a corpus that already emits warnings is
  a state nobody acts on.
- **Distinguish retrieved-at from source-fetched-at** (the review's other half of F21 —
  Firecrawl reports `cacheState`/`cachedAt`, which this kit discards). Not done here, and not
  pretended: it needs the adapter's field verified against a pinned CLI version before
  anything is built on it, which is a collection task on the collector machine. Recorded as
  outstanding rather than half-implemented.
