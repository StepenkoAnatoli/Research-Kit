# Review timeline

Derived from `research/EVIDENCE.md`, the fetch ledger, and diagnostic snapshots. It is a review aid, not part of the provenance chain or gate decision.

| When | Event | Detail |
|---|---|---|
| 2026-09-13T17:29:33.085Z | preflight FAIL | 5 blocker(s), 3 warning(s) |
| 2026-09-13T17:38:25.128Z | FETCH #1 | https://docs.firecrawl.dev/rate-limits |
| 2026-09-13T17:38:25.128Z | E-01 P | Free plan: 10 /scrape and 10 /search requests per minute, 2 concurrent browsers, 50,000 max queued jobs. Rate limits are per team, not per key. Keyless access is capped per IP per day and returns 429 when exceeded; a free API key includes 1,000 credits. — https://docs.firecrawl.dev/rate-limits |
| 2026-09-13T17:38:25.141Z | FETCH #2 | https://www.firecrawl.dev/pricing |
| 2026-09-13T17:38:25.141Z | E-02 S | Free plan: 1,000 credits/month, 500 searches or 1,000 pages scraped, 2 concurrent requests, $0. Hobby $16/month: 5,000 credits, 5 concurrent requests, extra credits at 1,000 per $5. Standard $83/month: 100,000 credits, 25 concurrent requests. Prices are per month billed annually. — https://www.firecrawl.dev/pricing |
| 2026-09-13T17:38:25.146Z | FETCH #3 | https://docs.firecrawl.dev/billing |
| 2026-09-13T17:38:25.146Z | E-03 P | Billing is credit-based and the plan allotment resets each billing cycle. Cost per endpoint: Scrape 1 credit/page, Crawl 1 credit/page, Map 1 credit/call, Search 2 credits per 10 results rounded up (11 results = 4 credits), Interact 2-7 credits per browser minute (7 with a prompt, 2 for Playwright code only). Extra scrape options cost more. — https://docs.firecrawl.dev/billing |
