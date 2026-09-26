# Search reliability: SerpAPI and Firecrawl on the same queries

**Status: round A recorded; round B scheduled for 2026-09-26 ~20:58 UTC.** No verdict yet.

## The question

On 2026-09-22 a collection logged `search failed on serpapi: spawnSync ... ETIMEDOUT`
(`docs/decisions/2026-09-22-tavily-terms/research/BRIEF.md`). That brief said SerpAPI's
reliability "needs its own evidence - the ETIMEDOUT here is one data point". This folder
is that evidence: identical queries to both providers, every call recorded.

## Method

`measure.mjs` sends each query to both providers in turn, alternating which goes first.

- **SerpAPI** goes through `serpapi.runJob`, the kit's own child-process path and the one
  that timed out. The ceiling is 90 s instead of the kit's 30 s, so the slow tail is
  measured rather than cut off. `overKitTimeout` marks any call the kit would have lost.
  SerpAPI's own `search_metadata.total_time_taken` is recorded next to the wall time, which
  separates time spent at the vendor from time spent on the network.
- **Firecrawl** goes through its HTTP `/v2/search` endpoint with `limit: 8`. The kit's
  Firecrawl search runs through the CLI, and the machine this was measured on has no
  CLI. Same vendor, different client.
- **Where it ran:** a Claude Code cloud container that sends all outbound traffic through a
  proxy. That is not the machine that saw the ETIMEDOUT.
- Keys are read from files named by `SERPAPI_KEY_FILE` and `FIRECRAWL_KEY_FILE`. Before
  appending a row, the harness checks it for both keys and refuses to write it if either
  is present.
- `results.jsonl` holds one row per query and is append-only. `queries-a.txt` and
  `queries-b.txt` are the inputs.

## Round A: 2026-09-26 19:55:30 to 19:56:44 UTC, 15 queries, no pause between them

The nine queries this repository's plans have actually sent, plus six more in the same style.

| | ok | median | max | > 10 s | > 30 s (kit timeout) | results per ok call |
|---|---|---|---|---|---|---|
| SerpAPI | 15/15 | 1244 ms | 14259 ms | 4 | 0 | 9 (13×), 6, 4 |
| Firecrawl | 13/15 | 992 ms | 1417 ms | 0 | 0 | 8 (13×) |

- **SerpAPI's timing splits in two:** eleven calls took about 1 s and four took 11.4 to
  14.3 s. For the slow four, SerpAPI's own `total_time_taken` is 96 to 98 % of the wall
  time, so the delay is on SerpAPI's side, not the network's or the proxy's. The worst was
  under half the kit's 30 s timeout.
- **Firecrawl's two failures were its rate limit, not an outage.** Both were HTTP 429
  (`Consumed (req/min): 11, Remaining (req/min): 0 ... retry after 5s`), which is E-01's
  documented "10 /search requests per minute". The kit waited out this error on fetches
  but not on searches; commit `09b2f93` fixes that (`searchPatiently`, tests RR-6).
- Every successful Firecrawl search cost 2 credits (`creditsUsed`).

**What round A does not show:** anything about a 30 s timeout. Fifteen calls in 74 seconds
from one place say nothing about a different machine, a different hour, or the tail beyond
14 s. Round B, an hour later with new queries and a 7 s pause, is there to test whether the
bimodal SerpAPI latency holds at another time.
