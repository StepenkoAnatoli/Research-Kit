# ADR-0135: One search session asks the providers, for both coordinators

Date: 2026-10-03
Status: accepted. Lifts the freeze (ADR-0117) for this one module. Refines ADR-0027 (the
two sides) and ADR-0133 (the exhaustion policy's owner): where the asking lives, not what a
search means.

## Context

Two coordinators ask the search providers: `runResearch` (phase 1, `lib/research-run.mjs`)
and `decompose` (phase 0, `lib/decompose.mjs`). Each carries its own copy of the same
loop - ask each provider under a merge or the one provider otherwise, degrade once to the
fetch provider's own search when that fails, count the searches on the meter that paid,
sum the vendor's credit estimate, keep a failure row per failed ask, log it. `credits.mjs`
(ADR-0133) took the exhaustion half out of `runResearch`; the search half stayed twice.

Three review rounds named it (register G8, H4, J4), and the operator confirmed on
2026-10-03 that every divergence between the copies is oversight, not policy. Read side by
side on that day they had drifted in six places:

- `runResearch` counted a failed first ask's reported usage only when the degraded ask
  succeeded, and never counted the usage of a plain failure; `decompose` counted every
  ask's.
- `runResearch` did not add a plain failure (one that did not degrade) to `searchFailures`,
  only to `searchFailuresOn`; `decompose`'s usage row counted it.
- Under a merge, `runResearch` wrote `searchTransport: "serpapi"` (the paying provider, as
  ADR-0027 and the live test say) and `decompose` wrote `"serpapi+firecrawl-cli"`.
- `runResearch` refused a search provider that reports `notReady` before anything was
  spent; `decompose` did not - only its CLI did, so a library caller could spend.
- `runResearch` logged `searched a N, b M -> K distinct`, `search found N for "q"` and
  `search failed on every provider`; `decompose` logged none of the three.
- `decompose` marked a merge's miss `covered` when another provider answered;
  `runResearch` had no such mark, so the two failure records could not be compared.

Each was found by reading, and each had been fixed once in one copy and not the other
(G4, R3 and R5 are the recorded instances). The next drift would be found the same way.

## Decision

One module, `lib/search-session.mjs`, owns the asking of search providers. `searchSession`
takes the providers (`adapter`, `searchAdapter`, `searchAdapters`), the patience
(`limit`, `maxRateLimitRetries`, `sleep`), the two sinks (`log`, `record`) and, when the
coordinator has one, the credits policy (`credits`, with `askOne` so the policy and the
session share the same patient call). It returns:

- `name` - the search side's paying provider, what the usage row's `searchTransport` says;
  `meter` - the dry run's label, every provider under a merge.
- `providers` - the list asked under a merge.
- `assertReady()` - the refuse-before-spend gate: a `searchAdapter` that reports `notReady`
  throws `SEARCH_PROVIDER_NOT_READY` before any ask.
- `ask(text)` - the loop: every provider under a merge, interleaved by `mergeByRank` and
  attributed; otherwise the one provider, with one degrade to the fetch provider when it
  can search (`canSearch`) and is not the provider that just failed. Returns
  `{ ok, query, results, provider, providers, merged, searchId, degraded }` on an answer and
  `{ ok: false, query, results: [], provider, providers, error }` otherwise.
- `meters()` - `searchesUsed`, `searchesOn`, `searchCreditsEstimate`, `searchFailures`,
  `searchFailuresOn`, `degraded`, read after the loop.

`searchPatiently` and `mergeByRank` move into the module; `research-run.mjs` re-exports
both, so every importer keeps working.

**One accounting rule.** Whatever an adapter reports as `searchesUsed` and
`creditsEstimate` is counted on that provider's meter, for every ask, succeeded or failed:
the vendor charged for it either way. Every failed ask adds one to `searchFailures` and to
`searchFailuresOn[provider]`; a query that failed on the search provider and again on the
fetch provider is two failed asks. `degraded` counts the queries the fetch provider's search
answered after the search provider failed. These two sentences change `runResearch` in the
two places the first bullets above name, deliberately; today's adapters report no usage on
a failure, so the numbers a run prints do not move, but the rule is now one sentence.

**Failure rows are the session's, the sink is the coordinator's.** The session hands
`record` one object per failed ask - `{ query, error, provider }`, with `degraded: true,
fellBackTo` when the fetch provider was asked next and `covered: true` when another
provider of a merge answered the query. `runResearch`'s sink maps it to the failure log's
`op: "search"` row, byte for byte what it wrote before; `decompose`'s sink keeps the object
for the map and `searchSummary`. The row is handed over at once, so the failure log keeps
its chronology beside a `credits-exhausted` row written mid-merge, and gains `covered`
afterwards, once the merge knows.

**Provider-level lines are the session's, result-level lines the coordinator's.** The
session says what it asked and what came back (`waiting`, `search failed on`, `degrading
to`, `searched`, `search found N`, `search failed`, `search failed on every provider`).
What the coordinator makes of a result - `noteOutcome`'s empty and off-topic rows, the
candidate selection, `skipped`/`would search` - stays where the result is read.

What stays the coordinator's, and may differ: the target row it builds from a result
(`runResearch`'s `from: 'search'` under a merge against `from: 'query: ... (via ...)'`
alone), the patience it asks for (`runResearch` retries a rate limit twice, `decompose`
not at all), and whether it has a credits policy.

## Migration

Three commits, each revertable alone:

1. This ADR.
2. `lib/search-session.mjs` with its own tests (two fake providers, no corpus), and
   `runResearch` switched to it. Byte-identical rows and lines, except the two accounting
   sentences above.
3. `decompose` switched to it, with the refusal test it gains (a not-ready provider makes
   `decompose` throw `SEARCH_PROVIDER_NOT_READY`, nothing spent) and the three log lines
   and the `searchTransport` label it now shares.

## Kill criteria

The session is wrong, and this ADR is superseded, if either happens:

- the usage rows, the failure rows or the log lines of the two coordinators drift again -
  then the session did not own the thing that drifted;
- the session's interface grows one option per coordinator difference - then it is two
  loops wearing one function, and the honest shape is two.

## Rejected

- **Extract the meters only.** A `searchMeters()` object both coordinators increment
  leaves the loop - the degrade, the merge, the failure rows - in two copies, which is where
  five of the six drifts were. The meters are the easy half.
- **One discovery module** that also selects candidates, applies the relevance floor and
  builds the targets. `runResearch` selects with `prefer` and `perQuery` against a plan;
  `decompose` keeps every http(s) result as material and applies the floor at scrape time.
  Those are two policies, and a module that held both would take one option per
  difference - the second kill criterion, on day one.
- **Leave two copies and keep reading them side by side.** The record shows what that
  costs: three fixes applied to one copy and later to the other, found by an outside
  reviewer each time.
- **A session that writes the failure log itself.** `decompose` has no failure log; its
  failures go to the map. An injected sink costs one callback and keeps the module free of
  a path.

## Trigger to revisit

A third coordinator that asks the providers, or a provider whose asking does not fit
`ask(text)` - a streaming search, a paged one - reopens the interface. Until then the
session is the one place the asking changes.
