# MAP - topic decomposition

## Topic

who can view GitHub Actions workflow run logs and download artifacts on a public repository permissions

## Subtopics

Statuses are blank on purpose: phase 0 gathers material, it does not judge. Mark each
row COVERED (cite the U-## rows that cover it), DISMISSED (reason required - dismissing
is fine, omitting is not), or GAP, and add topic-specific subtopics where the checklist
is not enough.

| ID | Subtopic | Why it matters | Status | Covered by |
|---|---|---|---|---|
| D-1 | Access model | Public pages, an official API, an auth-walled app, or a paywall - each is a different collection design | COVERED | U-1. The access model of a public run is "any signed-in account", which is neither "the open internet" nor "people you invited" |
| D-2 | Auth and credentials | What accounts, keys, or logins the collection and the product need, and who holds them | COVERED | U-1, U-2. An account is the credential, and a free one suffices |
| D-3 | Rate limits and quotas | Caps every cadence in the design, and caps the research collection itself | DISMISSED | no rate limit governs who may read a public run; the question here is permission, not throughput |
| D-4 | ToS, licensing, legality of the intended use | A prohibition on automated collection, storage, or display ends the design for that source - and sometimes the project | DISMISSED | out of scope: reading a repository you were given read access to engages no term this project needs to research |
| D-5 | Data schema and its stability | How the data is shaped, and how often the source changes the shape without asking | DISMISSED | no data schema is at issue - the exposed artefacts are logs and a ZIP whose shape this project owns (ADR-0032) |
| D-6 | Freshness and staleness | How fast the data goes stale, and what staleness costs the product that depends on it | COVERED | U-4. Freshness IS the exposure window here: 90 days by default, 1-90 configurable, and shortenable per artifact |
| D-7 | Cost at expected volume | The economics at real usage, not the pricing page's first row - this decides viability | DISMISSED | reading costs the reader nothing, which is exactly why the exposure is not self-limiting |
| D-8 | Runtime and platform limits | Where this actually executes - OS, runtime version, desktop app, cloud - and what those limits forbid | DISMISSED | not a runtime question; the surface is GitHub web and REST, and both were measured or read |
| D-9 | Output obtainability | Does the data your stated "done" depends on exist, and can you actually get it? Load-bearing: a project whose output cannot be produced should die in phase 1, not phase 2 | COVERED | U-2, U-3, and load-bearing: the output of this research is a rule an operator applies before dispatching, and it exists |
## Coverage notes (per dimension)

_One short paragraph per row once it has a status: what was established, and what the
status rests on._

## Candidate material

Gathered 2026-09-21.

_No material gathered - run without `--dry-run`, or add URLs to `research/plan.json`._


## Coverage notes

- **D-1 / D-9 - COVERED, and the finding inverts a comfort.** ADR-0035 measured an
  anonymous caller and found only the shape of a run exposed. That measurement was correct
  and incomplete: the web surface begins at a signed-in account, so "anonymous cannot read
  the logs" says nothing about the population that can.
- **D-6 - COVERED.** The window is the only dial. It bounds the exposure and cannot remove
  it.

## Candidate material

Collected 2026-09-21 by `collect.yml` run 35620262684, dispatched through
`bin/collect-remote.mjs` - the agent path - depth `quick`, one query. Three pages, all
`full`, all from `docs.github.com`. The `corroboration` check reports that honestly as
one voice rather than independent support, and it is right to: this is GitHub describing
its own permission model, which is authoritative and is not a second opinion.
