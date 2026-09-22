# MAP - topic decomposition

## Topic

Tavily terms of service data retention training on inputs outputs zero retention enterprise tier opt out

## Subtopics

Statuses are blank on purpose: phase 0 gathers material, it does not judge. Mark each
row COVERED (cite the U-## rows that cover it), DISMISSED (reason required - dismissing
is fine, omitting is not), or GAP, and add topic-specific subtopics where the checklist
is not enough.

| ID | Subtopic | Why it matters | Status | Covered by |
|---|---|---|---|---|
| D-1 | Access model | Public pages, an official API, an auth-walled app, or a paywall - each is a different collection design | COVERED | U-1. A public terms page, no auth, fetched at status 200 |
| D-2 | Auth and credentials | What accounts, keys, or logins the collection and the product need, and who holds them | COVERED | U-1 - and it is the subject: the question is what a credential would cost in disclosure |
| D-3 | Rate limits and quotas | Caps every cadence in the design, and caps the research collection itself | DISMISSED | no quota governs reading a terms page |
| D-4 | ToS, licensing, legality of the intended use | A prohibition on automated collection, storage, or display ends the design for that source - and sometimes the project | COVERED | U-1, U-2, load-bearing: this project IS a terms question |
| D-5 | Data schema and its stability | How the data is shaped, and how often the source changes the shape without asking | DISMISSED | no data schema is at stake in a decision not to integrate |
| D-6 | Freshness and staleness | How fast the data goes stale, and what staleness costs the product that depends on it | COVERED | U-2, with a caveat recorded below - the document states no effective date |
| D-7 | Cost at expected volume | The economics at real usage, not the pricing page's first row - this decides viability | DISMISSED | pricing is moot while the terms exclude the vendor |
| D-8 | Runtime and platform limits | Where this actually executes - OS, runtime version, desktop app, cloud - and what those limits forbid | DISMISSED | nothing runs; this is a decision not to add a dependency |
| D-9 | Output obtainability | Does the data your stated "done" depends on exist, and can you actually get it? Load-bearing: a project whose output cannot be produced should die in phase 1, not phase 2 | COVERED | U-1, U-2. The answer exists, is published, and was obtained |
## Coverage notes (per dimension)

- **D-4 - COVERED and load-bearing.** The decision is entirely a terms question, and two
  clauses answer it. Nothing else in the corpus is cited.
- **D-6 - COVERED, and the caveat is the finding.** The terms carry **no effective date and
  no version string**. There is therefore no way to tell from the document whether it changed
  since C-6 read it on 2026-09-19 - only that what it says today is what it said then.
  That is precisely why C-6's trigger has to be a re-read and cannot be a memory.

## Candidate material

Gathered 2026-09-22.

One capture of eight is on topic: E-01, tavily.com/terms. The other 7 are generic
industry writing about zero data retention and are cited by nothing.

That is recorded rather than tidied away. It is a finding about the kit, not about Tavily,
and the brief carries it.

