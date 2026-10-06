# MAP - topic decomposition

## Topic

Does the kit measurably beat a strongly prompted agent with the same tools and budget?

## Subtopics

Statuses are blank on purpose: phase 0 gathers material, it does not judge. Mark each
row COVERED (cite the U-## rows that cover it), DISMISSED (reason required - dismissing
is fine, omitting is not), or GAP, and add topic-specific subtopics where the checklist
is not enough.

| ID | Subtopic | Why it matters | Status | Covered by |
|---|---|---|---|---|
| D-1 | Access model | Public pages, an official API, an auth-walled app, or a paywall - each is a different collection design | COVERED | U-1, U-2, U-3, U-4 |
| D-2 | Auth and credentials | What accounts, keys, or logins the collection and the product need, and who holds them | DISMISSED | reason: rubric sources are public pages needing no account; trial credentials are execution logistics fixed in PROTOCOL.md, not facts a page can close |
| D-3 | Rate limits and quotas | Caps every cadence in the design, and caps the research collection itself | DISMISSED | reason: four to six one-off fetches of public pages, no recurring cadence and no product depending on a quota |
| D-4 | ToS, licensing, legality of the intended use | A prohibition on automated collection, storage, or display ends the design for that source - and sometimes the project | COVERED | U-1, U-2, U-3, U-4 |
| D-5 | Data schema and its stability | How the data is shaped, and how often the source changes the shape without asking | DISMISSED | reason: the deliverable consumes prose definitions from papers, not a machine schema that can change shape |
| D-6 | Freshness and staleness | How fast the data goes stale, and what staleness costs the product that depends on it | COVERED | U-1, U-4 |
| D-7 | Cost at expected volume | The economics at real usage, not the pricing page's first row - this decides viability | COVERED | U-4 |
| D-8 | Runtime and platform limits | Where this actually executes - OS, runtime version, desktop app, cloud - and what those limits forbid | COVERED | U-4 |
| D-9 | Output obtainability | Does the data your stated "done" depends on exist, and can you actually get it? Load-bearing: a project whose output cannot be produced should die in phase 1, not phase 2 | COVERED | U-1, U-2, U-3, U-4 |

## Coverage notes (per dimension)

- **D-1 (COVERED, U-1, U-2, U-3, U-4):** All needed sources are public pages: arXiv abstracts/HTML papers and vendor engineering blogs. No API, login or paywall is involved.
- **D-2 (DISMISSED):** No accounts or keys are needed for the rubric sources (public pages). The evaluation TRIALS will need model/tool credentials, but those are execution logistics fixed in PROTOCOL.md, not facts a page can close.
- **D-3 (DISMISSED):** No cadence: four to six one-off fetches of public pages. Collection stays within the keyless transport's ordinary use; no product depends on a quota.
- **D-4 (COVERED, U-1, U-2, U-3, U-4):** The sources are cited, not redistributed: captures are quoted research evidence, the same use the existing agent-reliability corpus already makes of arXiv and Anthropic pages (its D-4 judgment carries over).
- **D-5 (DISMISSED):** The deliverable consumes prose definitions, not a machine schema. A paper's definition does not change shape under the project.
- **D-6 (COVERED, U-1, U-4):** Evaluation guidance and ablation practice move; the protocol pins the retrieval date and the rubric cites the captured version, so staleness is bounded by the frozen protocol itself.
- **D-7 (COVERED, U-4):** Cost is a measured OUTCOME of the trials (tokens, metered collection, time per PROTOCOL.md), and matched budgets are exactly what U-4 collects design guidance for.
- **D-8 (COVERED, U-4):** The trials run where the kit runs: plain Node on the operator's machines, two machines for the handoff tasks. The platform limit that matters - a sandbox without general egress cannot collect - was observed here and is recorded below.
- **D-9 (COVERED, U-1, U-2, U-3, U-4):** The output is the scored comparison; it is obtainable iff the rubric terms have published operational definitions. That is precisely what U-1..U-4 exist to fetch - if they cannot be closed, the project dies in phase 1 as designed.

Classified 2026-10-06 on a GitHub Actions sandbox (collector role, http-keyless).
Every search and direct fetch failed - this sandbox reaches only GitHub - so the
classification rests on the contract, PROTOCOL.md, and the adjacent
2026-10-05-agent-reliability corpus, and the candidate material below is empty.
Collection itself must run on a machine with egress (the operator's collector PC).

## Candidate material

Gathered 2026-10-06.

_No material gathered - every search failed (below). This map is the bare checklist; re-run once the provider answers._

Search failures - a map drafted from failed searches looks like a map of a quiet topic, so they are listed:

- `Does the kit measurably beat a strongly prompted agent with the same tools and budget?` on http-keyless: fetch failed (getaddrinfo ENOTFOUND lite.duckduckgo.com)
- `Does the kit measurably beat a strongly prompted agent with the same tools and budget? documentation` on http-keyless: fetch failed (getaddrinfo ENOTFOUND lite.duckduckgo.com)
- `Does the kit measurably beat a strongly prompted agent with the same tools and budget? pricing limits` on http-keyless: fetch failed (getaddrinfo ENOTFOUND lite.duckduckgo.com)
- `Does the kit measurably beat a strongly prompted agent with the same tools and budget? terms of service` on http-keyless: fetch failed (getaddrinfo ENOTFOUND lite.duckduckgo.com)

