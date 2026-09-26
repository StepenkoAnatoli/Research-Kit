# Search reliability: SerpAPI and Firecrawl on the same queries

**Status: complete - two rounds, 30 queries, 60 calls.** Verdict at the end.

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
  but not on searches; commit `09b2f93` (with the README count in `c7d40d3`) fixes that (`searchPatiently`, tests RR-6).
- Every successful Firecrawl search cost 2 credits (`creditsUsed`).

**What round A does not show:** anything about a 30 s timeout. Fifteen calls in 74 seconds
from one place say nothing about a different machine, a different hour, or the tail beyond
14 s. Round B, an hour later with new queries and a 7 s pause, is there to test whether the
bimodal SerpAPI latency holds at another time.

## Round B: 2026-09-26 20:58:35 to 21:00:55 UTC, 15 new queries, 7 s apart

No query was repeated from round A, so none could be served from SerpAPI's 1-hour cache.

| | ok | median | max | > 3 s | > 10 s | > 30 s (kit timeout) | results per ok call |
|---|---|---|---|---|---|---|---|
| SerpAPI | 15/15 | 1093 ms | 5094 ms | 2 | 0 | 0 | 9 (12×), 10 (3×) |
| Firecrawl | 15/15 | 1094 ms | 2679 ms | 0 | 0 | 0 | 8 (15×) |

- **The 11 to 14 s group from round A did not come back.** SerpAPI's two slow calls took
  about 5 s, and its own `total_time_taken` was 4.59 s for both, so the time was again
  spent at the vendor.
- **With queries spaced out, Firecrawl had no failures.** That supports reading round A's
  two 429s as the per-minute limit, not as unreliability.
- On the same two queries (#1, #3), Firecrawl was also at its slowest of the round (2.7 and
  2.4 s). Two points are not a pattern; they are recorded, not interpreted.

## Both rounds together

| | ok | median | max | > 10 s | > 30 s |
|---|---|---|---|---|---|
| SerpAPI | **30/30** | 1196 ms | 14259 ms | 4 | **0** |
| Firecrawl | 28/30 (both misses were 429s in the unpaced round) | 1052 ms | 2679 ms | 0 | 0 |

**The two providers find different pages.** On the 28 queries where both answered, they
shared a median of **1** result host (range 0 to 5) out of roughly 8 to 10 each. That is
the case for the merged search the kit already runs when a SerpAPI key is configured
(`selectSearch`, #66): asking both roughly doubles the candidate pool instead of repeating it.

**Spend:** 30 SerpAPI searches (250/month free plan: 100 left, renews 2026-10-14) and
56 Firecrawl credits (2 per successful search; the 429s were not charged).

## Verdict

- **SerpAPI stays in the merged search.** On 30 of 30 calls it succeeded and none came
  near the kit's 30 s timeout. The worst call (14.3 s) left more than 2x headroom, and
  nearly all of that time was SerpAPI's own processing.
- **The 2026-09-22 ETIMEDOUT is not explained by this and is not ruled out.** It happened
  on a different machine and network, at a different time. What this shows is that it is
  not the normal case, and that the kit already survives it: the merged search carried on
  with Firecrawl alone that day.
- **Reliability was never the issue on the Firecrawl side; its rate limit was.** Ten
  searches a minute (E-01) is reachable by any plan with more than ten queries, and the kit
  now waits that out instead of losing the searches (`searchPatiently`).
- **Not changed:** the kit's 30 s SerpAPI timeout. The data gives no reason to raise it,
  and a single ETIMEDOUT from another machine is not a reason either.

## Addendum, 2026-09-26 22:55 UTC - a second ETIMEDOUT, on this machine

`decompose.mjs` for `docs/decisions/2026-09-26-actions-sept-changes` logged
`search failed on serpapi: spawnSync /opt/node22/bin/node ETIMEDOUT` on one of its four
queries, at 22:55:26 UTC. The other three answered. The failed query degraded to
`firecrawl-cli` as designed, and the map was written with 29 candidate pages.

Seventeen seconds later SerpAPI's own meter (`--status`, ADR-0040) read: 159 searches used
this cycle, 91 left, **6 in the last hour against an hourly limit of 250**. So it was not a
rate limit, and not an exhausted account.

What changes: the round A/B caveat above - "not the machine that saw the ETIMEDOUT" - no
longer holds. This container, behind this proxy, has now seen one too. What does not change:
the verdict. Two timeouts across two machines and one day, each on one query of a run that
carried on, is the rare case the merged search already absorbs. It is still not a reason to
raise the 30 s timeout: the slowest of the 30 measured calls took 14.3 s, and the fallback
worked. **Revisit** if a single
run loses more than one query to it, or a third occurs within a week - then measure again,
from the machine that saw it, with per-call timings.
