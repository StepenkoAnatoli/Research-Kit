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
| D-1 | Access model | Public pages, an official API, an auth-walled app, or a paywall - each is a different collection design | COVERED | U-1. Two public pages, no auth, both fetched at 200 |
| D-2 | Auth and credentials | What accounts, keys, or logins the collection and the product need, and who holds them | COVERED | U-1 - and it is the subject: what a credential would cost in disclosure |
| D-3 | Rate limits and quotas | Caps every cadence in the design, and caps the research collection itself | DISMISSED | no quota governs reading two published policies |
| D-4 | ToS, licensing, legality of the intended use | A prohibition on automated collection, storage, or display ends the design for that source - and sometimes the project | COVERED | U-1, U-2, load-bearing: the whole question is what the documents say |
| D-5 | Data schema and its stability | How the data is shaped, and how often the source changes the shape without asking | DISMISSED | no data schema is at stake in a decision not to integrate |
| D-6 | Freshness and staleness | How fast the data goes stale, and what staleness costs the product that depends on it | COVERED | U-2, and the finding is an absence - retention carries no fixed period |
| D-7 | Cost at expected volume | The economics at real usage, not the pricing page's first row - this decides viability | DISMISSED | pricing is moot while the terms exclude the vendor |
| D-8 | Runtime and platform limits | Where this actually executes - OS, runtime version, desktop app, cloud - and what those limits forbid | DISMISSED | nothing runs; this is a decision not to add a dependency |
| D-9 | Output obtainability | Does the data your stated "done" depends on exist, and can you actually get it? Load-bearing: a project whose output cannot be produced should die in phase 1, not phase 2 | COVERED | U-1, U-2. Published, and obtained - on the second attempt |
## Coverage notes (per dimension)

- **D-4 - COVERED and load-bearing.** Two documents answer it, and reading only one of them
  is exactly how the earlier brief overstated its claim.
- **D-6 - COVERED, and the answer is "none stated".** Section 3 gives four open-ended
  conditions and no period. That is not the same as a short retention and must not be
  reported as one.

## Candidate material

Gathered 2026-09-22.

Two captures of eight carry the claims: E-01 and E-02. 6 others are marked off
question, four of them on the vendor domain.

Worth stating because it is the honest reading of this run: **six of eight on tavily.com
measures the search fix, not relevance.** `prefer` ranks by host, and a host is not a
subject. The fix put the right documents in the corpus; it did not make blog posts relevant.

