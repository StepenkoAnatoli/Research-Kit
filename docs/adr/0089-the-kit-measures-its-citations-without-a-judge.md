# ADR-0089 — The kit measures its citations without a judge, and names what needs one

- **Date:** 2026-09-28
- **Status:** accepted
- **Area:** `lib/measure.mjs`, `bin/measure.mjs`, `docs/measurement-2026-09-28.md`
- **Evidence:** `docs/decisions/2026-09-28-kit-measurement/` (U-01, U-02)

## Context

The kit's effectiveness had never been measured. Deep-research benchmarks score citations
in two ways:

- **FACT (DeepResearch Bench):** a judge rules each statement-URL pair supported or not
  (E-02).
- **The attribution paper:** splits citations into Link Works, which needs no judge, and
  Relevant Content and Fact Check, which do (E-03).

## Decision

- **The command:** `bin/measure.mjs` reports, for the current project:
  - **Link works:** the capture is on disk, in the ledger, unmodified, and not an error page.
  - **Quote-anchored rows**, and the share of their quotes found (ADR-0087).
  - **Full versus partial** cited captures.
  - **Closure strength:** closed unknowns resting on a `P` row, and on two or more hosts.
  - **Known unknowns**, and whether the ledger verifies.
- **What it names but does not compute:** Fact Check, whether a page supports its claim. It
  needs a judge.
- **It never gates.** It has `--json` for machines and a table for people.
- **The first run:** over all 22 corpora, recorded in `docs/measurement-2026-09-28.md`.
  - Link works was near 100%. Every miss was a labelled failure record.
  - All 11 anchored quotes were found.
  - Two weak spots showed up: single-host closures, and three corpora that labelled even
    owning pages `S`.

## Rejected alternatives

- **Calling a model to judge support.** It would put a model's verdict, and a second
  vendor, into a kit whose gate refuses to judge prose. It would also spend credits on
  every run. Quote anchors are the checkable part of support.
- **Gating on a threshold.** Every number here already has a check behind it, or is prose
  judgement. A second gate over the same facts would only disagree with the first.
- **Folding everything into one score, as FACT does.** One number would hide the one
  dimension that separates good research from bad (corroboration) behind the one that
  cannot (link works, which the kit guarantees).
