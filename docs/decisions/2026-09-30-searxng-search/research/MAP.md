# MAP - topic decomposition

## Topic

SearXNG's search API as a keyless search transport: the JSON output format, its query parameters and response fields, the settings that enable it, and the bot limiter

## Subtopics

Statuses are blank on purpose: phase 0 gathers material, it does not judge. Mark each
row COVERED (cite the U-## rows that cover it), DISMISSED (reason required - dismissing
is fine, omitting is not), or GAP, and add topic-specific subtopics where the checklist
is not enough.

| ID | Subtopic | Why it matters | Status | Covered by |
|---|---|---|---|---|
| D-1 | Access model | Public pages, an official API, an auth-walled app, or a paywall - each is a different collection design | COVERED | U-01. A documented HTTP API on an instance the operator runs |
| D-2 | Auth and credentials | What accounts, keys, or logins the collection and the product need, and who holds them | DISMISSED | no credential: the Search API takes no key (E-01), and the instance is the operator's own |
| D-3 | Rate limits and quotas | Caps every cadence in the design, and caps the research collection itself | COVERED | U-04. The only limit is the instance's own limiter, which is off by default |
| D-4 | ToS, licensing, legality of the intended use | A prohibition on automated collection, storage, or display ends the design for that source - and sometimes the project | DISMISSED | the kit neither ships nor modifies SearXNG; it queries an instance the operator runs, and the upstream engines' terms bind that instance as SerpAPI's bind SerpAPI |
| D-5 | Data schema and its stability | How the data is shaped, and how often the source changes the shape without asking | COVERED | U-02. JSON fields from the docs and the source; url may be null |
| D-6 | Freshness and staleness | How fast the data goes stale, and what staleness costs the product that depends on it | DISMISSED | search results are candidates to fetch, never evidence; a stale ranking costs a worse candidate, not a wrong claim |
| D-7 | Cost at expected volume | The economics at real usage, not the pricing page's first row - this decides viability | DISMISSED | self-hosted: no metered credits, unlike SerpAPI and Firecrawl |
| D-8 | Runtime and platform limits | Where this actually executes - OS, runtime version, desktop app, cloud - and what those limits forbid | COVERED | U-03. Needs an instance with json in search.formats; the kit reports the 403 by name |
| D-9 | Output obtainability | Does the data your stated "done" depends on exist, and can you actually get it? Load-bearing: a project whose output cannot be produced should die in phase 1, not phase 2 | COVERED | U-02, U-03. Results come back as JSON once the format is enabled |

## Coverage notes (per dimension)

_One short paragraph per row once it has a status: what was established, and what the
status rests on._

## Candidate material

Gathered 2026-09-30.

Likely owners of these facts (by how often a search pointed at them):

- `docs.searxng.org` (20)
- `github.com/searxng` (6)
- `docs.litellm.ai` (4)
- `developer.mozilla.org` (4)
- `docs.synaplan.com` (4)
- `github.com/learningcircuit` (2)

Candidate pages:

- [Output Sports | VBT, athlete testing and programming in one ...](https://outputsports.com/)
- [SearXNG Search](https://docs.litellm.ai/docs/search/searxng)
- [local-deep-research/docs/CONFIGURATION.md at main](https://github.com/LearningCircuit/local-deep-research/blob/main/docs/CONFIGURATION.md)
- [Limiter - SearXNG Documentation (2026.9.29+f5035873a)](https://docs.searxng.org/admin/searx.limiter.html)
- [Search API - SearXNG Documentation (2026.9.25+12f8b6515)](https://docs.searxng.org/dev/search_api.html)
- [Frustration with major engines #5651](https://github.com/searxng/searxng/discussions/5651)
- [FAQ | MateClaw](https://claw.mate.vip/docs/en/faq.html)
- [Give Your AI Agent Private Web Search: Self-Host SearXNG](https://blog.elest.io/give-your-ai-agent-private-web-search-self-host-searxng/)
- [Output-Creative tools for musicians, by musicians.](https://output.com/)
- [SearxNG Search API](https://langchain-cn.readthedocs.io/en/latest/modules/agents/tools/examples/searx_search.html)
- [free-search-mcp](https://pypi.org/project/free-search-mcp/0.11.0/)
- [searxng-search/SKILL.md at main · garybbot00/searxng-search](https://github.com/garybbot00/searxng-search/blob/main/SKILL.md)
- [Get results in JSON format? · searxng searxng · Discussion #1789](https://github.com/searxng/searxng/discussions/1789)
- [SearXNG Documentation (2026.9.29+4e2c1ea7f)](https://docs.searxng.org/)
- [Net::Async::WebSearch - IO](https://metacpan.org/pod/Net::Async::WebSearch)
- [Limiter and Valkey Integration | searxng/searxng | DeepWiki](https://deepwiki.com/searxng/searxng/11.2-limiter-and-valkey-integration)
- [<output> HTML output element - MDN Web Docs - Mozilla](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/output)
- [Searxng Search — Free keyless meta-search aggregating 70 ...](https://hermes-agent.nousresearch.com/docs/user-guide/skills/optional/research/research-searxng-search)
- [SearXNG Module — Self-Hosted Web Search](https://docs.synaplan.com/modules/searxng)
- [GitHub - Elmeis/dsh-web-search-searxng: Keyless SearXNG search provider ...](https://github.com/Elmeis/dsh-web-search-searxng)

Search failures - a map drafted from failed searches looks like a map of a quiet topic, so they are listed:

- `SearXNG's search API as a keyless search transport the settings that enable it` on http-keyless: fetch failed - answered by the other provider
- `SearXNG's search API as a keyless search transport the bot limiter` on serpapi: SerpAPI did not answer within 30s - the request was abandoned; a retry may succeed - answered by the other provider

## Outlines seen in the material

_No outlines - none of these pages is captured yet. `--max-scrapes <n>` captures the first n; their headings appear here._

