# MAP - topic decomposition

## Topic

Chromium's sandbox on Ubuntu 23.10+: why it fails under AppArmor's unprivileged user namespace restriction, and the supported ways to run headless Chromium there

## Subtopics

Statuses are blank on purpose: phase 0 gathers material, it does not judge. Mark each
row COVERED (cite the U-## rows that cover it), DISMISSED (reason required - dismissing
is fine, omitting is not), or GAP, and add topic-specific subtopics where the checklist
is not enough.

| ID | Subtopic | Why it matters | Status | Covered by |
|---|---|---|---|---|
| D-1 | Access model | Public pages, an official API, an auth-walled app, or a paywall - each is a different collection design | COVERED | U-01. Public docs from both owners |
| D-2 | Auth and credentials | What accounts, keys, or logins the collection and the product need, and who holds them | DISMISSED | no credential involved |
| D-3 | Rate limits and quotas | Caps every cadence in the design, and caps the research collection itself | DISMISSED | no remote service |
| D-4 | ToS, licensing, legality of the intended use | A prohibition on automated collection, storage, or display ends the design for that source - and sometimes the project | DISMISSED | running a browser the user installed; no terms at issue |
| D-5 | Data schema and its stability | How the data is shaped, and how often the source changes the shape without asking | DISMISSED | no data schema |
| D-6 | Freshness and staleness | How fast the data goes stale, and what staleness costs the product that depends on it | COVERED | U-01. The restriction is on by default since 23.10 (E-01), and the runner image shows it today |
| D-7 | Cost at expected volume | The economics at real usage, not the pricing page's first row - this decides viability | DISMISSED | free |
| D-8 | Runtime and platform limits | Where this actually executes - OS, runtime version, desktop app, cloud - and what those limits forbid | COVERED | U-01, U-02. The runtime limit itself |
| D-9 | Output obtainability | Does the data your stated "done" depends on exist, and can you actually get it? Load-bearing: a project whose output cannot be produced should die in phase 1, not phase 2 | COVERED | U-02, U-03. A sandboxed render is obtainable with Chrome stable |

## Coverage notes (per dimension)

_One short paragraph per row once it has a status: what was established, and what the
status rests on._

## Candidate material

Gathered 2026-09-29.

_No material gathered - run without `--dry-run`, or add URLs to `research/plan.json`._

