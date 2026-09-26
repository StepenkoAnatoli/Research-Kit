# MAP - topic decomposition

## Topic

Moving this repository's pinned GitHub Actions off the deprecated Node 20 runtime

## Subtopics

Statuses are blank on purpose: phase 0 gathers material, it does not judge. Mark each
row COVERED (cite the U-## rows that cover it), DISMISSED (reason required - dismissing
is fine, omitting is not), or GAP, and add topic-specific subtopics where the checklist
is not enough.

| ID | Subtopic | Why it matters | Status | Covered by |
|---|---|---|---|---|
| D-1 | Access model | Public pages, an official API, an auth-walled app, or a paywall - each is a different collection design | COVERED | U-1, U-2. Public GitHub pages and the actions' own public repositories |
| D-2 | Auth and credentials | What accounts, keys, or logins the collection and the product need, and who holds them | DISMISSED | reading public release notes needs no credential; the workflows' own credentials are U-3's subject |
| D-3 | Rate limits and quotas | Caps every cadence in the design, and caps the research collection itself | DISMISSED | no quota governs reading release notes, and git reads of public repos are free |
| D-4 | ToS, licensing, legality of the intended use | A prohibition on automated collection, storage, or display ends the design for that source - and sometimes the project | DISMISSED | the four actions are GitHub's own, MIT-licensed, and already in use here |
| D-5 | Data schema and its stability | How the data is shaped, and how often the source changes the shape without asking | COVERED | U-2, U-3. The inputs and defaults each action accepts are its schema, and majors change them |
| D-6 | Freshness and staleness | How fast the data goes stale, and what staleness costs the product that depends on it | COVERED | U-1, U-2. The deprecation timeline is the freshness question: pins go stale on GitHub's schedule |
| D-7 | Cost at expected volume | The economics at real usage, not the pricing page's first row - this decides viability | DISMISSED | the actions are free; cost is one CI run per workflow to verify |
| D-8 | Runtime and platform limits | Where this actually executes - OS, runtime version, desktop app, cloud - and what those limits forbid | COVERED | U-1, U-4, load-bearing: this project IS a runtime question |
| D-9 | Output obtainability | Does the data your stated "done" depends on exist, and can you actually get it? Load-bearing: a project whose output cannot be produced should die in phase 1, not phase 2 | COVERED | U-2. The releases and their commits exist and are readable - measured from git before collecting |
| S-1 | Behaviour changes inside each major - defaults that flipped (caching, credential storage, fork handling) | A pin that runs but behaves differently is worse than one that fails: nothing reports it | COVERED | U-2, U-3 |

## Coverage notes (per dimension)

_One short paragraph per row once it has a status: what was established, and what the
status rests on._

## Candidate material

Gathered 2026-09-26.

_No material gathered - run without `--dry-run`, or add URLs to `research/plan.json`._

