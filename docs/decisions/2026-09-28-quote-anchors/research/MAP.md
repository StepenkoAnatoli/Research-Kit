# MAP - topic decomposition

## Topic

Quote-anchored claims: how research tools verify quotations against cited sources, Unicode normalization for matching quoted text

## Subtopics

Statuses are blank on purpose: phase 0 gathers material, it does not judge. Mark each
row COVERED (cite the U-## rows that cover it), DISMISSED (reason required - dismissing
is fine, omitting is not), or GAP, and add topic-specific subtopics where the checklist
is not enough.

| ID | Subtopic | Why it matters | Status | Covered by |
|---|---|---|---|---|
| D-1 | Access model | Public pages, an official API, an auth-walled app, or a paywall - each is a different collection design | COVERED | U-02. Public repositories and papers |
| D-2 | Auth and credentials | What accounts, keys, or logins the collection and the product need, and who holds them | DISMISSED | the check runs offline over the corpus; no credential is involved |
| D-3 | Rate limits and quotas | Caps every cadence in the design, and caps the research collection itself | DISMISSED | no remote call; nothing is rate-limited |
| D-4 | ToS, licensing, legality of the intended use | A prohibition on automated collection, storage, or display ends the design for that source - and sometimes the project | DISMISSED | the kit quotes pages it already stores; quoting a short passage adds nothing new to what is stored |
| D-5 | Data schema and its stability | How the data is shaped, and how often the source changes the shape without asking | COVERED | U-02, U-03. The marker syntax and the normalization |
| D-6 | Freshness and staleness | How fast the data goes stale, and what staleness costs the product that depends on it | DISMISSED | the check compares against the stored capture, which does not change |
| D-7 | Cost at expected volume | The economics at real usage, not the pricing page's first row - this decides viability | DISMISSED | no cost: a string search |
| D-8 | Runtime and platform limits | Where this actually executes - OS, runtime version, desktop app, cloud - and what those limits forbid | COVERED | U-03. String.prototype.normalize is built into Node |
| D-9 | Output obtainability | Does the data your stated "done" depends on exist, and can you actually get it? Load-bearing: a project whose output cannot be produced should die in phase 1, not phase 2 | COVERED | U-01. The failure it catches happens in real reports |

## Coverage notes (per dimension)

Phase 0 ran as a dry run to save credits (296 left); the pages come from the 2026-09-28
survey of similar projects and were named directly.

## Candidate material

Gathered 2026-09-28.

_No material gathered - run without `--dry-run`, or add URLs to `research/plan.json`._

