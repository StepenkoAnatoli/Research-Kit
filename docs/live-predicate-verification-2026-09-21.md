# Live predicate, verified over a real network — 2026-09-21

`live-collection` was written to verify a real collection and had never been run. This
records what happened when its success predicate was executed for real, keyless, against
live sites — and the defect that found.

**Status: local keyless live predicate verified.** Not "live-collection verified". The
distinction is the point of this file.

## Method

A scratch project outside the repository, `--transport http-keyless`, two direct URLs and
no search provider, so nothing was spent. Each condition of the workflow's predicate was
run and its exit code read.

## The defect: the predicate asked a question collection cannot answer

The workflow required **`preflight` to exit 0** on the scratch project it collects into.
Preflight exits **1** there, and correctly:

```
fail  discovery-contract/no-unknowns   the contract enumerates no blocking unknowns -
                                       a contract with no unknowns makes no claim
FAIL  1 blocking, 4 warning(s), 8 passing
```

Preflight answers *"is the research sufficient to build?"* — a **human-authored**
question. A freshly scaffolded project has no unknowns in its contract, so it fails that
check however perfectly collection worked. **The workflow would have failed on every run,
always, for a reason having nothing to do with the transport it exists to test.**

Reading the workflow would not have found this. Running it did, on the first attempt, and
it cost nothing because the keyless route is free.

### The correction

The predicate now requires the checks collection *can* answer — the integrity ones, each
required individually:

| check | what it asserts |
|---|---|
| `provenance` | the chain verifies and every cited capture was actually fetched |
| `corpus-shape` | the corpus parses and the shape is there |
| `citations` | every evidence row has a URL, a claim, and a cached page behind it |
| `transport-provenance` | which adapter fetched each cited capture |
| `hygiene` | duplicate rows, uncited captures, unparseable dates |

All five pass on a freshly collected scratch corpus. A test now refuses any executable
line invoking `preflight.mjs` without `--check`.

## What ran, and what it returned

| condition | result |
|---|---|
| scaffold a scratch project | ok |
| `research.mjs --dry-run` | exit 0 |
| `research.mjs` (2 pages, keyless, real network) | exit 0, 2 collected, 0 failed |
| ledger exists, parses, records a successful fetch | 2 entries, 2 successful |
| `handoff.mjs` | exit 0 — "every cited capture on disk, chain verifies" |
| the five integrity checks | all exit 0 |
| repository unchanged | no change under `research/` |

Both captures graded `partial`, which the keyless adapter reports honestly rather than
claiming `full` — itself a small confirmation that the completeness grading survives a
real fetch.

## What this does and does not establish

**Established, over a real network:**

- the predicate logic is satisfiable by a real corpus, not only by fixtures
- real network behaviour reaches the collector, and the ledger records it
- ledger → handoff → integrity-check integration holds outside synthetic tests
- the "repository unchanged" guard is meaningful: collection wrote only to the scratch path

**Still unproven, and not claimed:**

- the Firecrawl CLI install path in the workflow
- `cliCompatibility` against a real installed CLI in CI
- metered credential handling
- the GitHub environment secret wiring
- the Actions runner path itself — `workflow_dispatch` has never fired

The gap is now "the CI wiring and the metered route are untested" rather than "the whole
thing is untested", which is smaller and specific. Closing the rest needs the
`live-collection` environment and one real dispatch.
