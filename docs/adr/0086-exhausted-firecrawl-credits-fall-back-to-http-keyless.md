# ADR-0086 — Exhausted Firecrawl credits switch the rest of a run to http-keyless

- **Date:** 2026-09-28
- **Status:** accepted; the default is superseded by ADR-0129 (2026-10-02): a local run stops when credits run out, and this switch is opt-in with `--fallback`, which the unattended collectors pass. Detection, the switch and its reporting stand as written here.
- **Area:** `lib/firecrawl.mjs` (`creditsExhausted`), `lib/research-run.mjs` (`fallbackAdapter`, `fellBack`), `bin/research.mjs` (`--no-fallback`)
- **Evidence:** `docs/decisions/2026-09-28-fetch-fallback/` (U-01..U-04)

## Context

A run chooses its transport once. When Firecrawl's credits ran out partway through, every
remaining search and page failed, and the run ended with a list of failures and nothing to
read. The operator asked for a fallback, suggesting Tavily or another API.

What the research found:

- **What the API sends:** Firecrawl answers exhausted credits with HTTP 402. On the free
  plan that lasts until the monthly reset.
- **What reaches the kit:** the CLI passes on only the error text, "Insufficient credits to
  perform this request...". The 402 status never reaches the kit, so a check for "402"
  would never fire.
- **Tavily:** it is still excluded by C-6. Its terms still reserve training on inputs, and
  in this kit the inputs are the research subject.

## Decision

- **Detection:** an adapter may declare `creditsExhausted(text)`. Firecrawl's matches
  `/insufficient credits/i`.
- **Enabling it:** `research.mjs` passes `http-keyless` as the fallback whenever the chosen
  adapter can make that declaration. `--no-fallback` turns it off. A run already on
  `http-keyless` has nothing to fall back to.
- **The switch:** it happens once, on the first search or fetch whose failure matches.
  Every later search and fetch that would have gone to the exhausted adapter goes to the
  fallback instead. That includes its place in a merged search, and the degraded-search
  path.
- **The page that hit the wall:** it is fetched again through the fallback. The refused
  request stays in the ledger as a `fail` entry, but it is not counted as a failed page,
  because a 402 is not charged.
- **Reporting:** one log line, one `op: "credits-exhausted"` row in `.failures.jsonl`, a
  `fell back` line in the summary, `fellBackTo` in the usage row, and `fellBack` in the
  result. Each capture's ledger entry already names the transport that fetched it.

## Rejected alternatives

- **Tavily as the fallback.** C-6 stands. Terms §6.5 and §6.7 were re-read on 2026-09-28
  and are unchanged. If a no-training tier ships, the adapter is small: U-03 records its
  API and prices.
- **Firecrawl's own keyless tier.** The CLI reads a stored credential, so the kit cannot
  reliably force a keyless call from one process.
- **Match "402".** It never reaches the kit (E-11).
- **Fall back on any failure.** A 500, a 429 or a bad page is a failed page, not an empty
  account. Switching on those would hide real failures, and hand pages to a weaker
  transport for no reason.
- **Leave it silent.** Keyless pages are thinner on JavaScript-rendered sites. The operator
  must be told, and the ledger must show which pages came from where.

## Not covered

`decompose.mjs` (phase 0) does not fall back. It searches and scrapes little, and a map
drafted without material says so. Revisit this if phase 0 ever runs out of credits in
real use.
