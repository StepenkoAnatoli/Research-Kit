# MAP - topic decomposition

## Topic

EU Deforestation Regulation 2023/1115 application date large operators SMEs current after delay

## Subtopics

Statuses are blank on purpose: phase 0 gathers material, it does not judge. Mark each
row COVERED (cite the U-## rows that cover it), DISMISSED (reason required - dismissing
is fine, omitting is not), or GAP, and add topic-specific subtopics where the checklist
is not enough.

| ID | Subtopic | Why it matters | Status | Covered by |
|---|---|---|---|---|
| D-1 | Access model | Public pages, an official API, an auth-walled app, or a paywall - each is a different collection design | COVERED | U-1. Public official publication, no auth and no paywall |
| D-2 | Auth and credentials | What accounts, keys, or logins the collection and the product need, and who holds them | DISMISSED | reading a regulation needs no credential; COMPLYING with it does, and that is out of scope |
| D-3 | Rate limits and quotas | Caps every cadence in the design, and caps the research collection itself | DISMISSED | no quota governs reading a Commission page |
| D-4 | ToS, licensing, legality of the intended use | A prohibition on automated collection, storage, or display ends the design for that source - and sometimes the project | COVERED | U-1, U-3 - the subject IS a legal obligation, so the regulation is the scope rather than a constraint on collecting it |
| D-5 | Data schema and its stability | How the data is shaped, and how often the source changes the shape without asking | COVERED | U-2. The schema here is the date set, and it has changed twice - which is the point of U-2 |
| D-6 | Freshness and staleness | How fast the data goes stale, and what staleness costs the product that depends on it | COVERED | U-2, and freshness is the load-bearing dimension of this whole corpus. The registered prior was a year stale, and so is the prose of one cited source |
| D-7 | Cost at expected volume | The economics at real usage, not the pricing page's first row - this decides viability | DISMISSED | no per-use cost to the research; compliance cost is a different question nobody asked here |
| D-8 | Runtime and platform limits | Where this actually executes - OS, runtime version, desktop app, cloud - and what those limits forbid | DISMISSED | no runtime - this is a date, not a system |
| D-9 | Output obtainability | Does the data your stated "done" depends on exist, and can you actually get it? Load-bearing: a project whose output cannot be produced should die in phase 1, not phase 2 | COVERED | U-1, load-bearing: the output is a date a plan is scheduled off, and it was obtained from the authority that sets it |
## Coverage notes (per dimension)

_One short paragraph per row once it has a status: what was established, and what the
status rests on._

## Candidate material

Gathered 2026-09-22.

_No material gathered - run without `--dry-run`, or add URLs to `research/plan.json`._


## Coverage notes

- **D-6 Freshness - COVERED and load-bearing.** Two postponements in two years, and a cited
  source whose prose still carries the superseded pair. This dimension decided the corpus.
- **D-9 - COVERED.** The date exists, is published, and was obtained.

## Candidate material

Collected 2026-09-22 by run 35723908266 via `bin/collect-remote.mjs`, with the search side
**pinned to firecrawl-cli**. That pin is the finding: the same topic on the default path
(SerpApi) returned eight pages about US financial regulation - SEC, CFPB, federalregister -
and nothing about the EUDR at all. Firecrawl returned seventeen candidates, all on topic.
