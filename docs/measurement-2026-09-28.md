# Measurement — how the kit's citations hold up (2026-09-28)

This is the first measurement of the kit's own corpora, taken with `bin/measure.mjs`
(ADR-0089). The metric definitions come from deep-research benchmarks and are recorded in
`docs/decisions/2026-09-28-kit-measurement/`.

- **What was measured:** everything that needs no judge.
- **What was not:** whether each page *supports* its claim. That is the benchmarks' judged
  Fact Check, or DeepResearch Bench's Citation Accuracy. It is named, and left uncomputed.

## Results

"Link works" means the capture is on disk, in the ledger, unmodified, and not an error page.
The percentages are shares of evidence rows or of cited captures; the closed-unknown
columns are shares of closed unknowns.

| Corpus | Rows | Link works | Quote-anchored rows | Quotes found | Full captures | Closed | on a P row | on ≥2 sites |
|---|---|---|---|---|---|---|---|---|
| root (U-1..U-8) | 27 | 96.3% | 0% | – | 85.2% | 11 | 90.9% | 9.1% |
| 2026-09-21 agent-interface | 11 | 100% | 0% | – | 100% | 8 | 100% | 75% |
| 2026-09-21 delivery-architecture | 19 | 100% | 0% | – | 100% | 8 | 100% | 50% |
| 2026-09-21 public-run-visibility | 4 | 100% | 0% | – | 100% | 4 | 100% | 0% |
| 2026-09-21 sea-assets | 5 | 100% | 0% | – | 100% | 2 | 100% | 100% |
| 2026-09-22 build-sea | 3 | 100% | 0% | – | 100% | 1 | 100% | 0% |
| 2026-09-22 eudr-dates | 8 | 100% | 0% | – | 100% | 3 | 0% | 33.3% |
| 2026-09-22 tavily-privacy | 8 | 100% | 0% | – | 100% | 2 | 0% | 0% |
| 2026-09-22 tavily-terms | 8 | 100% | 0% | – | 100% | 2 | 0% | 0% |
| 2026-09-22 wx-lock | 4 | 100% | 0% | – | 100% | 2 | 100% | 50% |
| 2026-09-26 actions-node24 | 8 | 100% | 0% | – | 100% | 4 | 100% | 0% |
| 2026-09-26 actions-sept-changes | 8 | 100% | 0% | – | 100% | 4 | 100% | 75% |
| 2026-09-27 kit-path-spelling | 13 | 100% | 0% | – | 100% | 4 | 100% | 25% |
| 2026-09-27 mcp-protocol-versions | 6 | 100% | 0% | – | 100% | 5 | 100% | 20% |
| 2026-09-27 node-support | 5 | 100% | 0% | – | 100% | 3 | 100% | 33.3% |
| 2026-09-28 browser-transport | 5 | 80% | 80% | 4/4 | 80% | 2 | 100% | 0% |
| 2026-09-28 collection-cost-model | 9 | 100% | 0% | – | 100% | 5 | 100% | 0% |
| 2026-09-28 fetch-fallback | 11 | 100% | 0% | – | 100% | 4 | 100% | 25% |
| 2026-09-28 kit-measurement | 3 | 100% | 66.7% | 2/2 | 100% | 2 | 100% | 50% |
| 2026-09-28 quote-anchors | 6 | 100% | 83.3% | 5/5 | 100% | 3 | 100% | 100% |
| MoonAliza open-gaps | 13 | 100% | 0% | – | 92.3% | 6 | 100% | 83.3% |
| MoonAliza historical snapshot | 30 | 96.7% | 0% | – | 96.7% | 5 | 100% | 0% |

## What it says

- **Link works is near 100% by construction.** It is the kit's guarantee, and the gate
  enforces it. Every miss is a deliberate, labelled failure record:
  - the root's E-15, a guessed URL that returned 404;
  - the browser project's E-04, a 503;
  - MoonAliza's E-18, a 404.
  The attribution paper found external agents above 94% here too. This dimension does not
  tell good research from bad.
- **Grounding a reviewer can check is new.** Only the three corpora written since quote
  anchors existed carry them (67–83% of rows), and all 11 quotes were found. Every older
  corpus has none, so their support can only be judged by re-reading.
- **Independent corroboration is the weak spot.** Many closed unknowns rest on a single
  site. "Sites" means registrable domains, not hostnames: the first count used hostnames, so
  `docs.firecrawl.dev` beside `www.firecrawl.dev` counted as two witnesses. Fixed the same day. The root corpus is at 9.1%, and several decision corpora at 0%. The corroboration
  check warns about this. The measurement shows how common it is.
- **Three corpora close nothing on a primary row.** `tavily-terms`, `tavily-privacy` and
  `eudr-dates` labelled every row `S`, including Tavily's own terms page, which is primary
  for a question about Tavily's terms. That is a labelling issue in those corpora, and the
  kit's closure check does not catch it.

## Not measured

- **Fact Check / Citation Accuracy:** whether each page supports its claim. It needs a
  judge. Quote anchors are the part of it a reviewer can verify in seconds.
- **Whether the briefs led to better builds.** No corpus records its builder's outcome.
