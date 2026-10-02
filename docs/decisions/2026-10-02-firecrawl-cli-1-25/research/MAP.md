# MAP - topic decomposition

## Topic

Firecrawl CLI 1.25 against the 1.24.6 pin: what changed in scrape, search and map and their JSON output

## Subtopics

Statuses are blank on purpose: phase 0 gathers material, it does not judge. Mark each
row COVERED (cite the U-## rows that cover it), DISMISSED (reason required - dismissing
is fine, omitting is not), or GAP, and add topic-specific subtopics where the checklist
is not enough.

| ID | Subtopic | Why it matters | Status | Covered by |
|---|---|---|---|---|
| D-1 | Access model | Public pages, an official API, an auth-walled app, or a paywall - each is a different collection design | COVERED | U-02, U-03, U-04 |
| D-2 | Auth and credentials | What accounts, keys, or logins the collection and the product need, and who holds them | COVERED | U-06 |
| D-3 | Rate limits and quotas | Caps every cadence in the design, and caps the research collection itself | DISMISSED | rate limits are the API's, not the CLI's, and the kit caps its own retries (ADR on X3); a CLI version does not change them |
| D-4 | ToS, licensing, legality of the intended use | A prohibition on automated collection, storage, or display ends the design for that source - and sometimes the project | DISMISSED | the vendor's terms govern the API whichever CLI build calls it; the kit already uses this vendor under them |
| D-5 | Data schema and its stability | How the data is shaped, and how often the source changes the shape without asking | COVERED | U-02, U-03, U-04 |
| D-6 | Freshness and staleness | How fast the data goes stale, and what staleness costs the product that depends on it | COVERED | U-01 |
| D-7 | Cost at expected volume | The economics at real usage, not the pricing page's first row - this decides viability | DISMISSED | credits are charged by the API per call, not by the CLI; docs/decisions/2026-09-28-collection-cost-model holds the cost model |
| D-8 | Runtime and platform limits | Where this actually executes - OS, runtime version, desktop app, cloud - and what those limits forbid | COVERED | U-05 |
| D-9 | Output obtainability | Does the data your stated "done" depends on exist, and can you actually get it? Load-bearing: a project whose output cannot be produced should die in phase 1, not phase 2 | COVERED | U-01, U-05 |

## Coverage notes (per dimension)

- **D-1 Access model**: the CLI and its docs are public; U-02 to U-04 read the vendor's reference and release notes.
- **D-2 Auth and credentials**: U-06 - the key from the environment or the login config, and the banner.
- **D-3 Rate limits and quotas**: dismissed - the API's, unchanged by the CLI build.
- **D-4 ToS, licensing, legality**: dismissed - same vendor, same terms.
- **D-5 Data schema and its stability**: the heart of the question; U-02 to U-04 pin the JSON shapes and the `--status` rendering.
- **D-6 Freshness and staleness**: U-01 - what was published since the pin and when.
- **D-7 Cost at expected volume**: dismissed - credits are the API's; the cost-model project holds them.
- **D-8 Runtime and platform limits**: U-05 - the bundled SDK and HTTP client, the Node engine, the proxy behaviour.
- **D-9 Output obtainability**: U-01 and U-05 - the notes and the manifest exist and are public.

## Candidate material

Gathered 2026-10-02.

Likely owners of these facts (by how often a search pointed at them):

- `docs.firecrawl.dev` (4)
- `firecrawl.dev` (3)
- `youtube.com` (2)
- `medlineplus.gov` (1)
- `myhealth.alberta.ca` (1)
- `github.com/firecrawl` (1)

Candidate pages:

- [Scrape: MedlinePlus Medical Encyclopedia](https://medlineplus.gov/ency/article/007212.htm)
- [CLI - Firecrawl Docs](https://docs.firecrawl.dev/sdks/cli)
- [Scrapes (Abrasions): Care Instructions - MyHealth Alberta](https://myhealth.alberta.ca/Health/aftercareinformation/pages/conditions.aspx?hwid=ug5811)
- [CLI and Agent Skill for Firecrawl - Add scrape, search, and ... - GitHub](https://github.com/firecrawl/cli)
- [Hunting Scrape Lines: A Comprehensive Guide - Stealth Cam](https://www.stealthcam.com/hunting-scrape-lines-a-comprehensive-guide/?srsltid=AU7gw4VTOd_rSJYj9PyblX5P9S8dt-KOYjWR_qm734usoWZ7xtv1CxwV)
- [Introducing Firecrawl Skill and CLI: The Complete Web Data Toolkit for ...](https://www.firecrawl.dev/blog/introducing-firecrawl-skill-and-cli)
- [Should You Be Hunting Over Scrapes? - Legendary Whitetails](https://community.legendarywhitetails.com/blog/should-you-be-hunting-over-scrapes/)
- [How to Extend Gemini CLI With Firecrawl Web Search](https://www.firecrawl.dev/blog/gemini-cli-firecrawl)
- [20 Years Of Creating Mock Scrapes | What I've Learned - YouTube](https://www.youtube.com/watch?v=iV4wmNDQZr4)
- [Firecrawl CLI — AI Agent Skill by Firecrawl | AgenticSkills](https://agenticskills.io/skills/firecrawl-cli)
- [Timely Scrape Tactics That Will Ensure Success This Season](https://www.northamericanwhitetail.com/editorial/master-scrape-theory/483629)
- [Changelog | Firecrawl](https://www.firecrawl.dev/changelog)
- [Where And When Not To Hunt Scrapes | Blocker Outdoors](https://www.blockeroutdoors.com/when-and-when-not-to-hunt-scrapes/?srsltid=AU7gw4V6L0q7qSb6Dw4JUklxGRAnDjzHHIYPsIkb11wakJ3zCHnfVz-d)
- [What Is Firecrawl? CLI & Skill Power Explained with Claude Code Setup ...](https://wilico.co.jp/en/blog/what-is-firecrawl-cli-and-how-to-install-it-in-claude-code)
- [The Why and How of Mock Scrapes | National Deer Association](https://deerassociation.com/mock-scrapes/)
- [Firecrawl Full Beginner Course | Let's Scrape EVERYTHING - YouTube](https://www.youtube.com/watch?v=tBtPSV_gU6o)

## Outlines seen in the material

_No outlines - none of these pages is captured yet. `--max-scrapes <n>` captures the first n; their headings appear here._

