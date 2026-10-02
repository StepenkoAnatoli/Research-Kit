# ADR-0127: A search for closed unknowns is not run again

Date: 2026-10-02
Status: accepted

## Context

A plan query carries `why`, the unknowns it is meant to close. A page is fetched once and
served from the cache on every later run - "a cached page costs nothing" - but a search has
no cache: it is paid on every run of `research.mjs`, about two Firecrawl credits, and its
results can queue up to `perQuery` new pages nobody asked for.

Running the kit five times over MoonAliza's seven finished projects (2026-10-02), one plan
carried a query whose `why` named U-01 and U-04, both `CLOSED`. Every real run of that
project would have paid the search again. The resume rule says credits already spent are
not spent again; a search for a question the contract has answered is spent again forever.

## Decision

- A query whose `why` names one or more unknowns that are **all** `CLOSED` in
  `research/DISCOVERY.md` is not run. The run says so on the terminal
  (`skipped search "..." - U-01, U-04 are closed ...`) and in its results (`note`), and the
  dry run previews the same skip. A query that names no unknown, or any unknown not yet
  closed, runs as before.
- `--force` runs it: `--force` already means "spend again" for a page, and now means it for
  a search. No new flag.
- This is a bug fix under the freeze (ADR-0117): the behaviour contradicted the kit's own
  cost rule, and the remedy adds no command, flag, file or check.

## Rejected alternatives

- **A search cache file** (results kept under `research/raw/` and served on later runs).
  A new file format under the freeze, and a cached search decays: the results of a query
  are not a page, and serving old ones as if fresh would hide what the vendor would return
  today. The contract already says whether the question is open.
- **Leave it to the operator to delete the query from the plan.** The plan is the record of
  what was asked; deleting a query erases why a page was fetched. And the kit's own advice
  is to run again ("a page already fetched costs nothing"), which was not true of searches.
- **Run it and say what it cost.** Honest, and still two credits a run on every finished
  project.
