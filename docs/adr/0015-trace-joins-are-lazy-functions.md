# ADR-0015 — The trace joins are lazy functions on the corpus reader, not precomputed snapshot data

- **Date:** 2026-09-15
- **Status:** accepted
- **Area:** the corpus reader (`lib/corpus.mjs`), every consumer of an evidence row
- **Recorded by:** the 2026-09-15 architecture review, re-raising the 2026-09-14
  review's deferred candidate 3; shipped in commit `47cd685`
- **Relates to:** ADR-0003 (the corpus has one reader and one writer)

## Context

How an evidence row traces to its evidence is format knowledge, and it has one subtle
clause: an **empty `Raw` cell matches the ledger entry on the URL alone**. Five consumers
re-derived that predicate with their own `find()` — `lib/checks.mjs` twice for the ledger
entry and three times for the capture, `lib/timeline.mjs` once — and the derived-artifact
family added three more copies of a neighbouring convention (which evidence row an unknown
rests on, first cited, falling back to the unknown's own text) plus a retyped `hostOf()`.

The 2026-09-14 review surfaced this and the operator deferred it as "tidiness on working
code". That reason held while every copy sat under the gate, where a wrong join fails the
verdict loudly. The new copies sit in `research/BRIEF.md` and `research/audits/`, where a
wrong join produces a plausible document and no red suite — a test-surface change, which
is why the deferral was re-raised rather than accepted a second time.

The 2026-09-14 review proposed the other shape: **move the joins into the snapshot as
data**, `row.trace = { entry, capture }`, so consumers read instead of searching.

## Decision

**The joins are pure functions on the reader — `traceOf(corpus, row)`,
`captureOf(corpus, row)`, `claimOf(corpus, unknown)` — with one `capturesByFile` index
built in the same read pass as `capturesByUrl`.** Consumers ask; nothing is precomputed
per row.

### Rejected: precomputing `row.trace` on the snapshot

`readCorpus()` is the **edit-time gate's read path** and is documented as the cheap half
of reading: parse only, no hashing, no crypto, paid on every edit. Attaching a trace to
every row means every read — including the many reads that ask nothing about traces —
walks the ledger once per row and holds a second index for a question no check has asked.
The reader stays a reader; a join is a question, and questions are asked by consumers.

**Trigger that expires this decision:** a measurement showing the repeated lookups cost
more than building the join once on the read path that pays it (a large corpus with a
long ledger, or a third consumer of the same trace in one pass). At that point `traceOf`
can memoise or the snapshot can carry the index — the interface does not change, which is
the point of putting the join behind a function now.

### Rejected: leaving the predicate in the consumers, tidied per file

Each consumer is "one `find()`". That is what the five copies each were, and the reason
they drifted apart in the first place: no owner means no place where the empty-`Raw`-cell
clause is stated, so each new consumer re-derives it from the last one it read.

## Consequences

- The acceptance criterion for the change was that **the existing consumer tests pass with
  zero edits** (`test/checks.test.mjs`, `test/timeline.test.mjs`, `test/audit.test.mjs`):
  behaviour preservation is proved by the pins that were already there, not by new ones.
- The new pins test the owner directly: matched on url+raw, the empty-`Raw`-cell clause, a
  dangling capture (entry found, capture null), a refreshed URL where each row keeps its
  own fetch, the by-file index, and `claimOf` with and without a readable cited row.
- `claimOf` reads `corpus.evidenceById`, so it also answers correctly on a **scoped**
  corpus (`lib/audit.mjs`'s `scopeToSubtopic`), which is why the audit's subtopic files keep
  naming the same claims the full audit does.
- The same reasoning applies to `captureEntry`/`rememberCapture` (commit `b57de8f`): the
  capture **index** — which had a reader and no writer — now has one constructor and one
  writer, and callers store the entry the collector returned instead of shaping one. One
  shape, one owner, because a caller that mints its own entry is the same failure in a
  different table.
