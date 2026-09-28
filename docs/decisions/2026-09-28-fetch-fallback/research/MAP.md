# MAP - topic decomposition

## Topic

Fetch fallback when Firecrawl credits run out: Firecrawl out-of-credits error, Tavily terms of service data training, Tavily search and extract API credits

## Subtopics

Statuses are blank on purpose: phase 0 gathers material, it does not judge. Mark each
row COVERED (cite the U-## rows that cover it), DISMISSED (reason required - dismissing
is fine, omitting is not), or GAP, and add topic-specific subtopics where the checklist
is not enough.

| ID | Subtopic | Why it matters | Status | Covered by |
|---|---|---|---|---|
| D-1 | Access model | Public pages, an official API, an auth-walled app, or a paywall - each is a different collection design | COVERED | U-01, U-03. Firecrawl and Tavily HTTP APIs; the keyless free tier |
| D-2 | Auth and credentials | What accounts, keys, or logins the collection and the product need, and who holds them | COVERED | U-03. Tavily uses a Bearer key; Firecrawl keyless needs none |
| D-3 | Rate limits and quotas | Caps every cadence in the design, and caps the research collection itself | COVERED | U-01, U-03. 402 vs 429; Tavily 100 RPM on a development key |
| D-4 | ToS, licensing, legality of the intended use | A prohibition on automated collection, storage, or display ends the design for that source - and sometimes the project | COVERED | U-02. Tavily terms §6.5/§6.7 and privacy policy |
| D-5 | Data schema and its stability | How the data is shaped, and how often the source changes the shape without asking | COVERED | U-03, U-04. Tavily request/response shape; CLI output is the known unknown |
| D-6 | Freshness and staleness | How fast the data goes stale, and what staleness costs the product that depends on it | COVERED | U-02. Terms re-read 6 days after the last reading; they change "at any time" (§ modification clause) |
| D-7 | Cost at expected volume | The economics at real usage, not the pricing page's first row - this decides viability | COVERED | U-01, U-03. Firecrawl free plan stops at 402; Tavily 1,000 free credits |
| D-8 | Runtime and platform limits | Where this actually executes - OS, runtime version, desktop app, cloud - and what those limits forbid | DISMISSED | the kit runs the same way on every transport; no runtime limit is in question |
| D-9 | Output obtainability | Does the data your stated "done" depends on exist, and can you actually get it? Load-bearing: a project whose output cannot be produced should die in phase 1, not phase 2 | COVERED | U-01. The signal to detect is documented |

## Coverage notes (per dimension)

Phase 0 split the topic into its three questions (ADR-0085) and found the owning pages -
Firecrawl billing, Tavily's terms, privacy policy, credits and FAQ - among noise; the plan
named them and the API reference pages directly.

## Candidate material

Gathered 2026-09-28.

Likely owners of these facts (by how often a search pointed at them):

- `docs.tavily.com` (12)
- `tavily.com` (9)
- `docs.firecrawl.dev` (4)
- `docs.nvidia.com` (4)
- `firecrawl.dev` (2)
- `tidyr.tidyverse.org` (2)

Candidate pages:

- [Outside Magazine](https://www.outsideonline.com/)
- [Third Party Policy](https://learnamp.com/policies/third-party-policy)
- [Extract (2009)](https://www.imdb.com/title/tt1225822/)
- [Billing - Firecrawl Docs](https://docs.firecrawl.dev/billing)
- [Tavily – Platform Terms of Service](https://tavily.com/terms)
- [Credits & Pricing - Tavily Docs](https://docs.tavily.com/documentation/api-credits)
- [OUT Definition & Meaning](https://www.merriam-webster.com/dictionary/out)
- [Privacy Policy](https://www.upstage.ai/privacy-policy/updated-jun-01-2026)
- [extract - Manual](https://www.php.net/manual/en/function.extract.php)
- [Pricing | Firecrawl](https://www.firecrawl.dev/pricing)
- [Tavily Privacy Policy](https://tavily.com/privacy)
- [Find a plan to power your AI Agents - Tavily](https://www.tavily.com/pricing)
- [Out Magazine - Gay & Lesbian Travel, Fashion, Culture ...](https://www.out.com/)
- [Tavily / Nebius: Scaling Deep Research Agents through ...](https://www.zenml.io/llmops-database/scaling-deep-research-agents-through-architecture-optimization-and-context-management)
- [Extract a character column into multiple columns using ...](https://tidyr.tidyverse.org/reference/extract.html)
- [[Bug] firecrawl agent fails with "Refusal: Error: Agent reached max ...](https://github.com/firecrawl/firecrawl/issues/3552)
- [The Rise of Enterprise Learning Sovereignty | Tavily Blog](https://www.tavily.com/blog/the-rise-of-enterprise-learning-sovereignty)
- [Frequently Asked Questions - Tavily Docs](https://docs.tavily.com/faq/faq)
- [Outlook Log In | Microsoft 365](https://www.microsoft.com/en-us/microsoft-365/outlook/log-in)
- [Prepare Data | NeMo Gym](https://docs.nvidia.com/nemo/gym/data)

