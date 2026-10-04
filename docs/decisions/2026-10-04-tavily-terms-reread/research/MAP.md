# MAP - topic decomposition

## Topic

Has Tavily's C-6 trigger been met: a no-training tier in Tavily's Platform Terms, privacy policy, FAQ or pricing, re-read 2026-10-04

## Subtopics

Statuses are blank on purpose: phase 0 gathers material, it does not judge. Mark each
row COVERED (cite the U-## rows that cover it), DISMISSED (reason required - dismissing
is fine, omitting is not), or GAP, and add topic-specific subtopics where the checklist
is not enough.

| ID | Subtopic | Why it matters | Status | Covered by |
|---|---|---|---|---|
| D-1 | Access model | Public pages, an official API, an auth-walled app, or a paywall - each is a different collection design | COVERED | U-01, U-02, U-03. Four public pages, no login, fetched at status 200 or the row says otherwise |
| D-2 | Auth and credentials | What accounts, keys, or logins the collection and the product need, and who holds them | DISMISSED | no credential is needed to read public terms; whether a Tavily key may ever be wired is the decision this project informs, not an input to it |
| D-3 | Rate limits and quotas | Caps every cadence in the design, and caps the research collection itself | DISMISSED | Tavily's rate limits are on record (2026-09-28-fetch-fallback, U-03, E-08) and do not bear on C-6, which is about training, not throughput |
| D-4 | ToS, licensing, legality of the intended use | A prohibition on automated collection, storage, or display ends the design for that source - and sometimes the project | COVERED | U-01, U-02, U-03. The whole question: does any document now permit use without training on inputs |
| D-5 | Data schema and its stability | How the data is shaped, and how often the source changes the shape without asking | DISMISSED | request and response schemas are on record (2026-09-28-fetch-fallback, U-03) and nothing is built from this project |
| D-6 | Freshness and staleness | How fast the data goes stale, and what staleness costs the product that depends on it | COVERED | U-01. The terms carry no effective date, so freshness is the re-read itself; this is the fourth reading in sixteen days |
| D-7 | Cost at expected volume | The economics at real usage, not the pricing page's first row - this decides viability | COVERED | U-03. The pricing page is read for a tier, and with it the price such a tier would carry |
| D-8 | Runtime and platform limits | Where this actually executes - OS, runtime version, desktop app, cloud - and what those limits forbid | DISMISSED | where the kit runs does not change what a vendor's terms say |
| D-9 | Output obtainability | Does the data your stated "done" depends on exist, and can you actually get it? Load-bearing: a project whose output cannot be produced should die in phase 1, not phase 2 | COVERED | U-01, U-02, U-03. The output is a yes or no about public documents; an absence is counted (`opt out`, `training`, `enterprise`, `retention`), never skimmed |

## Coverage notes (per dimension)

- **D-1, D-4, D-9** are the project: four public pages (terms, privacy, pricing, FAQ) read for
  a clause or tier under which Customer Input is not trained on. Absence is established by
  counting the words a tier would use, as the 2026-09-22 reading did.
- **D-6**: Tavily's terms have no effective date or version (2026-09-22-tavily-terms, Known
  unknowns), so the only freshness check is to fetch and compare the two sections word for word
  against the 2026-09-28 capture.
- **D-7**: the pricing page has not been read before; a no-training tier, if sold, would be
  listed there, so its price is read in the same pass.
- **D-2, D-3, D-5, D-8** are dismissed with reasons in the table: credentials, limits and
  schemas are on record from 2026-09-28 and nothing is built here; the runtime does not change a
  vendor's terms.

## Candidate material

Gathered 2026-10-04.

Decompose ran with `--dry-run` (spend nothing): the owning pages are known from three earlier readings and are named directly in `research/plan.json` - the terms, the privacy policy, the FAQ, and the pricing page, which had not been read before.

