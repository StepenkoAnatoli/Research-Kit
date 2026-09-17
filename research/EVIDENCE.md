# Evidence

One row per fetched page. `Raw` points at the cached page text under `research/raw/`,
which is what makes the claim checkable - a row without raw evidence fails preflight.

The `Finding` cell arrives as an auto-extracted summary. Rewrite it into a real claim:
what the page actually establishes, with the quote or number that proves it.

| ID | Retrieved | Type | URL | Finding | Raw |
|---|---|---|---|---|---|
| E-01 | 2026-09-13 | P | https://docs.firecrawl.dev/rate-limits | Free plan: 10 /scrape and 10 /search requests per minute, 2 concurrent browsers, 50,000 max queued jobs. Rate limits are per team, not per key. Keyless access is capped per IP per day and returns 429 when exceeded; a free API key includes 1,000 credits. | research/raw/2026-09-13-rate-limits-firecrawl-552467ff-2.md |
| E-02 | 2026-09-13 | S | https://www.firecrawl.dev/pricing | Free plan: 1,000 credits/month, 500 searches or 1,000 pages scraped, 2 concurrent requests, $0. Hobby $16/month: 5,000 credits, 5 concurrent requests, extra credits at 1,000 per $5. Standard $83/month: 100,000 credits, 25 concurrent requests. Prices are per month billed annually. | research/raw/2026-09-13-pricing-firecrawl-44e1c6cd-2.md |
| E-03 | 2026-09-13 | P | https://docs.firecrawl.dev/billing | Billing is credit-based and the plan allotment resets each billing cycle. Cost per endpoint: Scrape 1 credit/page, Crawl 1 credit/page, Map 1 credit/call, Search 2 credits per 10 results rounded up (11 results = 4 credits), Interact 2-7 credits per browser minute (7 with a prompt, 2 for Playwright code only). Extra scrape options cost more. | research/raw/2026-09-13-billing-firecrawl-363d9da0-2.md |
| E-04 | 2026-09-13 | P | https://code.claude.com/docs/en/skills | The /doctor setup checkup stays typable when disableBundledSkills is on, in Claude Code v2.1.205 and later. | research/raw/2026-09-13-extend-claude-with-skills-claude-code-docs-bbd9e46f.md |
| E-05 | 2026-09-13 | P | https://code.claude.com/docs/en/hooks | Exit 2 means a blocking error. | research/raw/2026-09-13-hooks-reference-claude-code-docs-4f437b44.md |
| E-06 | 2026-09-13 | P | https://www.firecrawl.dev/terms-of-service | By registering and using the Services, you represent and warrant you: (i) have the authority and capacity to enter this Agreement; (ii) are at least 18 years old, or 13 years or older and have the express permission of… | research/raw/2026-09-13-terms-of-service-firecrawl-172bc71f.md |
