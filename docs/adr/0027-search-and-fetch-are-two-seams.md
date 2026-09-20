# ADR-0027 — Search and fetch are two seams, not one adapter

- **Date:** 2026-09-19
- **Status:** accepted
- **Area:** collector, transport selection, provenance
- **Supersedes in part:** ADR-0005 (which remains correct about *where* vendor knowledge lives)
- **Requirements:** `docs/requirements-2026-09-19-search-fetch-seam.md`

## Context

ADR-0005 put all vendor knowledge in one adapter and gave it a seven-function shape:
`name`, `scrape`, `search`, `map`, `command`, `status`, `runScrape`. `selectTransport`
picks exactly one of those adapters and every caller uses it for everything.

That was right when there was one vendor. It has one consequence nobody chose: **a single
free allowance pays for both halves of a run.** At `perQuery: 2` a plan query costs 2
Firecrawl credits to search and 2 to scrape — 4 of 1,000 a month (E-03, E-14). Every
search spent is a page not fetched.

Research (`research/BRIEF.md`, gate PASS at `ad26daf`) established that SerpAPI's free
tier is 250 searches a month, bills **per response rather than per result**, and serves
an identical query from its own cache for an hour free and uncounted (E-07, E-09). The
benefit of adopting it is not a lower unit price. It is that search and fetch stop
drawing on the same meter.

But the shape blocks it. SerpAPI cannot scrape. Selecting it as "the transport" would
leave five of seven functions undefined and would stamp captures — which it never
produced — with its name.

## Decision

**`selectTransport` resolves two providers independently.** A *fetch provider* produces
captures; a *search provider* produces candidate URLs. Each resolves through the existing
precedence ladder (explicit flag → environment → machine config → auto-detect).

Two contracts are declared, as `ADAPTER_SHAPE` is today:

```js
FETCH_SHAPE  = ['name', 'scrape', 'runScrape', 'map', 'status', 'command']
SEARCH_SHAPE = ['name', 'search']
```

An adapter may satisfy both — `firecrawl.mjs` and `http-transport.mjs` do, and remain the
default for both sides. `serpapi.mjs` satisfies `SEARCH_SHAPE` only, declares that, and
answers a request to fetch with an error that names the reason rather than a missing-
function `TypeError` (AR-3).

**The return value is extended, not replaced.** `selectTransport` keeps returning
`{ name, adapter, why }` meaning exactly what they mean today — the fetch provider — and
gains a `search: { name, adapter, why }` alongside. Every existing caller keeps working
unread and unedited (NFR-2). This is the load-bearing choice in the whole ADR: it is what
makes the change additive rather than a rewrite of six call sites.

**Provenance stays split the way the meters are.** A capture is stamped with the **fetch**
provider, because that is what fetched it. `transport-provenance` is not touched (AR-4):
it judges captures, and SerpAPI produces none. What is added is smaller and new — a URL
promoted from a search records which provider ranked it (DR-2), because two providers'
rankings are two different provenance claims and `from: "query: …"` cannot carry both.

**With no SerpAPI credential, nothing changes.** The search provider auto-resolves to the
fetch provider and the run is byte-identical to today's (FR-5, TR-8). An opt-in that
alters the default is not an opt-in.

## Alternatives considered

**1. Add `serpapi` as a third entry in `TRANSPORTS`.**
The smallest diff, and wrong. `TRANSPORTS` is a map of things that satisfy the whole
adapter shape; adding a search-only module makes the shape a claim the map no longer
keeps. An operator who set `--transport serpapi` would get a run that cannot fetch
anything, discovered at the first scrape rather than at selection.

**2. Merge two modules into one composite adapter object.**
`{ ...firecrawl, search: serpapi.search }`. Tempting, and it destroys the thing this kit
exists to protect: `adapter.name` is a single string, and it is what stamps captures. A
merged name is either a lie about who fetched the page or a lie about who ran the search.
The check whose entire job is to say how a capture was obtained would be reading a label
that no longer means one thing.

**3. Choose the provider per query in `plan.json`.**
Rejected on layering. `plan.json` is research intent and lives in the corpus; provider
availability is a property of the machine. Putting a machine capability in a checked-in
research file means a corpus that only runs on the box that wrote it, and it puts a
credential-shaped decision one edit away from a file that gets committed.

**4. Do nothing; buy more Firecrawl credits.**
The honest baseline, and it costs money to solve a problem that two free tiers solve for
nothing. Worth stating because it is the alternative that needs no code at all: if this
seam turns out to carry ongoing complexity that the operator does not want, $16/month for
Firecrawl Hobby (E-02) buys 5,000 credits and this ADR can be reverted.

## Trade-offs

**What this costs.** Two providers mean two failure modes, two rate limits, and a
degradation path that has to be written and tested (RR-1, RR-2). `selectTransport` grows
a second resolution it must keep symmetric with the first. `doctor` grows a line. There is
now a credential in the picture that was not there before, with all of SR-1 through SR-5
attached to it.

**What it buys.** Roughly 250 searches *and* 500 scrape-backed queries a month against
today's ~250 combined — on two free tiers, no card on either. Plus the thing that matters
more day to day: SerpAPI's 1-hour free cache means re-running the same plan while
developing costs nothing at all (C-3), where today every re-run burns credits.

**What it does not buy.** Not reliability — one provider down still degrades the run.
Not speed. Not better results; nobody has measured result quality and this ADR does not
claim any.

## Risks

| Risk | Mitigation |
|---|---|
| The key leaks into the repo, a log, or a capture. It travels as a URL query parameter, which is the worst place for a secret to live. | SR-1–SR-4: config/env only, redacted in every human-facing rendering including error text, asserted in tests against a sentinel, and the existing secret scan keeps running with no new exclusion. |
| Free-tier collection has no indemnity — the $2M Legal Shield excludes Free, Starter and Developer plans (E-10). | Stated in the requirements and in the operator docs. Acceptable for a solo operator reading public vendor documentation; not acceptable for redistribution, and that line is written down rather than assumed. |
| The fallback silently spends Firecrawl credits when SerpAPI fails. | RR-2: bounded to one attempt, and reported in the run summary rather than absorbed. |
| Query text goes to a third party that keeps it 31 days, with no `zero_trace` available below Enterprise. | SR-5. This is the same disclosure that disqualified Tavily (E-16); applying it honestly to the provider we *are* adopting is the only consistent position. |
| Undocumented vendor parameters. This project has paid for that twice. | IR-4: send only what the captured reference documents. `num` was specified and removed for exactly this reason. |
| The two selections drift apart as one is edited. | AR-1: one function resolves both, and TR-6 exercises all four precedence positions on the new side. |

## Consequences

- `lib/transport.mjs` gains a second resolution and two shape constants. Its role as the
  single reader of provider choice is unchanged and reinforced.
- `lib/serpapi.mjs` is new: one vendor, search only, no dependencies, injectable network.
- `lib/research-run.mjs` and `lib/decompose.mjs` read `chosen.search.adapter` for searching
  and keep reading `chosen.adapter` for fetching.
- `lib/doctor.mjs` reports both.
- `lib/machine.mjs` gains a `searchTransport` key.
- The usage and failure logs gain a provider field (DR-1, DR-4). The **fetch ledger is
  untouched** (DR-3) — searches are not fetches and must not enter the hash chain.
- `docs/ARCHITECTURE.md` and `LAYOUT` name the new module in the same commit (ADR-0007).

### Added 2026-09-20 — the endpoint seam

`search({ endpoint })` was added so the transport path could be tested rather than
argued: parent → `spawnSync` → child → real `fetch` → real socket, against a local
stand-in server. Before it, everything between "the parent builds a job" and "the parent
gets an answer" was covered only by a human running commands once.

It is **guarded**, because an overridable endpoint on a request that carries an API key
is an exfiltration route. `allowedEndpoint` permits the vendor's own host over https, or
a loopback address — nothing else — and the check runs in both halves: the parent refuses
before spawning, and the child refuses before fetching, because the child is a separate
program reading a job off a pipe and does not get to trust it.

Writing that test found something worth recording about this design: the first version
hosted the stand-in server in the test process and every request timed out. The adapter
shape is synchronous, so the parent reaches the vendor through `spawnSync`, which blocks
its own event loop; a server living in that loop can never accept the connection. The
rendezvous that makes an async `fetch` fit a synchronous contract is also the thing that
makes in-process testing of it impossible. The stand-in runs in its own process.
