# Live predicate, verified over a real network — 2026-09-21

`live-collection` was written to verify a real collection and had never been run. This
records what happened when its success predicate was executed for real, keyless, against
live sites — and the defect that found.

**Status: local live predicate verified on BOTH routes — keyless and metered.** Not
"live-collection verified": the GitHub Actions path has still never run. The distinction
is the point of this file.

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


---

# The metered run — 2026-09-21, later the same day

The keyless run proved the predicate logic. It could not touch the paid route, the
credential path, or `cliCompatibility` against a real installed CLI. This did, with a
real key and real credits.

## The meter is the proof

```
credits before   900 / 1000
credits after    898 / 1000
```

Two pages, two credits. Nothing about this run was simulated.

## Every condition, on the metered route

| condition | result |
|---|---|
| `cliCompatibility()` against the installed CLI | `supported: Firecrawl CLI 1.23.3, the version this adapter is tested against` |
| `research.mjs --dry-run` | exit 0, spent nothing |
| `research.mjs` — 2 pages, `firecrawl-cli` | exit 0, 2 collected, 0 failed |
| ledger exists, parses, records successful fetches | 2 entries, 2 successful |
| `handoff.mjs` | exit 0 — "every cited capture on disk, chain verifies" |
| `provenance` | pass |
| `corpus-shape` | pass |
| `citations` | pass |
| `transport-provenance` | pass |
| `hygiene` | pass |
| repository unchanged | `git status --porcelain` empty |

## Two things the metered route showed that keyless could not

**Completeness grading distinguishes the transports.** The same predicate, different
routes:

```
keyless   docs.github.com     partial
keyless   example.com         partial
metered   docs.firecrawl.dev  FULL
metered   example.com         partial
```

The metered route got a complete capture where the keyless one got a partial. That is the
difference the two adapters exist to express, and it is graded honestly rather than
claimed — `example.com` stayed `partial` on both, because it genuinely is a stub page.

**The credential never reached the ledger.** The ledger's `cmd` field, which is committed
with a corpus, reads:

```
firecrawl scrape https://docs.firecrawl.dev/rate-limits --only-main-content --json
```

No key, in any field, in either entry — checked by scanning the whole serialised ledger
for key-shaped strings. The CLI reads its credential from its own config; the kit never
puts it on a command line it renders.

## What is now established, and what is still not

**Established with a real credential and real spend:** the compatibility gate passes a
real CLI; the metered adapter collects; the ledger records and hashes real bodies; the
chain verifies; all five integrity checks hold on a metered corpus; completeness grading
discriminates between routes; the credential does not leak into recorded evidence; and
collection writes nothing into the repository it runs from.

**Still not established:** the GitHub Actions runner path. `workflow_dispatch` has never
fired, the `live-collection` environment does not exist, and the secret has never been
wired. What remains unproven is the CI plumbing — not the kit.
