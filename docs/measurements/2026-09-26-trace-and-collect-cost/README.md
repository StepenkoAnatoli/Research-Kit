# Trace and collect cost at scale - ADR-0015's trigger, measured

**Status: complete.** ADR-0015's trigger has **not** fired.

## The question

ADR-0015 made the trace joins lazy functions (`traceOf`, `captureOf`, `claimOf`) and set the
trigger that would expire that decision: "a measurement showing the repeated lookups cost more
than building the join once on the read path that pays it (a large corpus with a long ledger...)".
Nobody had taken that measurement. `traceOf` filters the whole ledger for every row, so its cost
is rows x ledger entries - quadratic in corpus size. The question is whether that matters.

## Method

Synthetic corpora built through the real collector (`collectOne`) with a stub fetcher: no network,
a genuine hash chain, one capture, one ledger entry and one evidence row per page. Measured on a
Claude Code cloud container, Node 22, 2026-09-26.

- `trace-bench.mjs` - `traceOf` over every row, and a full `runPreflight`, at 100 / 500 / 2,000 pages.
  (Its build loop re-reads the corpus before every page, so its build time is not the collector's.)
- `build-bench.mjs` - `collectOne` per page with the corpus read once, as `runResearch` does.

## Results

| Pages | `traceOf` over every row | full `runPreflight` |
|---|---|---|
| 100 | 1 ms | 22 ms |
| 500 | 11 ms | 107 ms |
| 2,000 | 110 ms | 532 ms |

Quadratic, as expected (4x the pages, about 10x the trace time) - and immaterial. The largest real
corpus in this repository has 27 evidence rows; at 2,000, roughly 70 times that, tracing every row
takes a tenth of a second and the whole gate half a second.

| Pages | collector, per page, last 20 pages | total |
|---|---|---|
| 100 | 15-16.5 ms | 1.0-1.2 s |
| 300 | 46.5-51 ms | 7.4-8.0 s |
| 500 | 90 ms | 21-22 s |

Collection is also quadratic: every `collectOne` re-reads and validates the whole ledger under the
lock before appending (`appendFetch` refuses to write onto a damaged chain), and refreshes the
capture index inside the same lock (ADR-0025). Both are deliberate - correctness over speed - and
both are small next to the network: a single search had a median of about 1.1 s across 60 calls
(`docs/measurements/2026-09-26-search-reliability/`), and every page also costs a scrape - a
network round trip that was not timed here. So at 500 pages the ~90 ms of local work per page is a
small fraction of a run, but this file does not put a number on the fraction.

## Verdict

- **ADR-0015 stands.** Its trigger asks for repeated lookups to cost more than building the join
  once; at every size a corpus here plausibly reaches, both are well under a second.
- **Collection cost: recorded, not changed.** It becomes worth optimising only if a single corpus
  approaches thousands of pages - at 2,000, the local work alone is about ten minutes. That is the
  number a future reader should re-measure against, with `build-bench.mjs`.
