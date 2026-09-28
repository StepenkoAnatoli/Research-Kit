# Evidence

One row per fetched page. `Raw` points at the cached page text under `research/raw/`,
which is what makes the claim checkable - a row without raw evidence fails preflight.

The `Finding` cell arrives as an auto-extracted summary. Rewrite it into a real claim:
what the page actually establishes, with the quote or number that proves it.

| ID | Retrieved | Type | URL | Finding | Raw |
|---|---|---|---|---|---|
| E-01 | 2026-09-28 | S | https://mondayideas.com/ | Off-topic phase-0 capture: a consumer app-ideas page picked up by decompose's gathering, not about Firecrawl or SerpAPI. Cited by no unknown (retrieved 2026-09-28). | research/raw/2026-09-28-monday-ideas-mondayideas-294f1e06.md |
| E-02 | 2026-09-28 | P | https://www.firecrawl.dev/pricing | Firecrawl's Free plan is 1,000 credits a month, "refreshed monthly, no credit card required"; 1 credit = 1 page on a basic scrape; search costs 2 credits per 10 results; JSON/question/highlight formats add 4 credits a page; the Free plan's rate limit for /scrape, /map and /search is 10 requests a minute each; a scrape returning no result is not charged, a 403/404 page costs 1 credit (retrieved 2026-09-28). | research/raw/2026-09-28-pricing-firecrawl-firecrawl-85a67ddb.md |
| E-03 | 2026-09-28 | P | https://docs.firecrawl.dev/billing | Firecrawl's billing doc: Scrape 1 credit/page, Search 2 credits/10 results "rounded up per 10 results (e.g., 11 results = 4 credits)" plus per-page scrape costs for scraped results; the monthly allotment "resets at the start of each billing cycle" (retrieved 2026-09-28). | research/raw/2026-09-28-billing-firecrawl-firecrawl-668238a2.md |
| E-04 | 2026-09-28 | P | https://docs.firecrawl.dev/rate-limits | Firecrawl's rate-limit table for the Free plan: /scrape 10, /map 10, /search 10, /crawl 2, /agent 2 requests a minute, per team; exceeding one returns 429. Keyless use is separately capped per IP per day (retrieved 2026-09-28). | research/raw/2026-09-28-rate-limits-firecrawl-firecrawl-d9bccd8c.md |
| E-05 | 2026-09-28 | P | https://serpapi.com/pricing | SerpAPI's Free plan: 250 searches per month and 50 throughput per hour (retrieved 2026-09-28). | research/raw/2026-09-28-serpapi-plans-and-pricing-serpapi-d0c89b50.md |
| E-06 | 2026-09-28 | P | https://serpapi.com/faq | SerpAPI FAQ: only successful searches count toward the monthly searches - cached, errored and failed searches do not - and a response costs 1 search credit whether it returns 100 results or none (retrieved 2026-09-28). | research/raw/2026-09-28-serpapi-faq-serpapi-7dec5bc6.md |
| E-07 | 2026-09-28 | S | https://docs.firecrawl.dev/features/search | Firecrawl's search doc: a search costs 2 credits per 10 results, rounded up (1-10 results = 2, 11-20 = 4), plus scrape costs per scraped result; only the enterprise end-to-end ZDR option costs 10 credits per 10 results (retrieved 2026-09-28). | research/raw/2026-09-28-search-firecrawl-firecrawl-5d25fdbb.md |
| E-08 | 2026-09-28 | S | https://www.firecrawl.dev/ | Firecrawl's home page advertises starting free with no credit card; it states no per-call price (retrieved 2026-09-28). | research/raw/2026-09-28-firecrawl-the-web-data-api-to-search-scr-firecrawl-20b7ba93.md |
| E-09 | 2026-09-28 | S | https://www.firecrawl.dev/search | Firecrawl's search product page repeats the Free plan as 1,000 credits a month (retrieved 2026-09-28). | research/raw/2026-09-28-web-search-api-live-web-results-for-ai-a-firecrawl-1a979185.md |
