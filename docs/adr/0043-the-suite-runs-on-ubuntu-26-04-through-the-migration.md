# ADR-0043 — The suite runs on ubuntu-26.04 through the ubuntu-latest migration

- **Date:** 2026-09-26
- **Status:** accepted, temporary (see the trigger)
- **Area:** CI, support policy
- **Evidence:** `docs/decisions/2026-09-26-actions-node24/research/EVIDENCE.md` E-08

## Context

GitHub moves `ubuntu-latest` from Ubuntu 24.04 to 26.04, "gradually between October 19 and
November 19, 2026", and warns it "may break builds that rely on tools, packages, or versions
that changed". Its advice: "Test your workflows against `ubuntu-26.04` before the migration
begins", or pin `ubuntu-24.04` (E-08, found while researching ADR-0041 and left out of that
decision's scope).

Every workflow here runs on `ubuntu-latest`. The offline suite is the one that can be pointed
at the new image for free: it holds no key and spends nothing. It also exercises what is most
likely to move - `setup-python` needs a Python 3.12 build for the new image, and the
conformance runners need that Python.

## Decision

**Add `ubuntu-26.04` to the offline suite's matrix, beside `ubuntu-latest` and
`windows-latest`, for the migration window.** It is a second Linux image, not a third
platform: the support policy (README "Supported platforms") is unchanged, and says so. The
support-policy test pins the three-entry matrix deliberately.

## Rejected alternatives

- **Pin `ubuntu-24.04`.** It postpones the change to whenever 24.04 is retired, and turns a
  warned migration into an unwarned one later.
- **A one-off run on 26.04 and nothing kept.** The 26.04 image is updated weekly through the
  window; one green run in September says little about the image `ubuntu-latest` becomes in
  November.
- **Also add a `runner` choice to `live-collection.yml`.** The paid path is thin - Node, npm,
  and the Firecrawl CLI - and each run spends credits. Not now; if the suite finds a 26.04
  difference in Node or npm, that is the moment.
- **Replace `ubuntu-latest` with `ubuntu-26.04` now.** It would drop 24.04 coverage while
  `ubuntu-latest` still means 24.04 for most runs until 2026-11-19.

## Consequences

- One more job per push while the leg exists. The required check is the aggregating `suite`
  job, not a matrix leg, so branch protection is unaffected.
- A red `platform (ubuntu-26.04)` leg before 2026-10-19 is the early warning this exists for:
  fix it before `ubuntu-latest` makes it everyone's.

## Trigger that would reopen this

**Remove the leg** once `ubuntu-latest` resolves to 26.04 on this repository's runs (a
`platform (ubuntu-latest)` log reading `Image: ubuntu-26.04`), and no later than 2026-11-30.
Then revert the matrix to `[ubuntu-latest, windows-latest]`, the support-policy test with it,
and the README sentence that names this ADR.
