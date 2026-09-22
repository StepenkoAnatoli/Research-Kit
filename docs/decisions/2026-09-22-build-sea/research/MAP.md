# MAP - topic decomposition

## Topic

Node.js build-sea option single executable application without postject

## Subtopics

Statuses are blank on purpose: phase 0 gathers material, it does not judge. Mark each
row COVERED (cite the U-## rows that cover it), DISMISSED (reason required - dismissing
is fine, omitting is not), or GAP, and add topic-specific subtopics where the checklist
is not enough.

| ID | Subtopic | Why it matters | Status | Covered by |
|---|---|---|---|---|
| D-1 | Access model | Public pages, an official API, an auth-walled app, or a paywall - each is a different collection design | COVERED | U-1. Public vendor documentation, no auth |
| D-2 | Auth and credentials | What accounts, keys, or logins the collection and the product need, and who holds them | DISMISSED | building a binary from your own source engages no account |
| D-3 | Rate limits and quotas | Caps every cadence in the design, and caps the research collection itself | DISMISSED | no quota governs a local build |
| D-4 | ToS, licensing, legality of the intended use | A prohibition on automated collection, storage, or display ends the design for that source - and sometimes the project | DISMISSED | Node.js is MIT-licensed; shipping a SEA of your own program engages no term this project must research |
| D-5 | Data schema and its stability | How the data is shaped, and how often the source changes the shape without asking | COVERED | U-1. The SEA configuration file IS the schema, and `--build-sea` consumes the same `sea-config.json` the postject flow used |
| D-6 | Freshness and staleness | How fast the data goes stale, and what staleness costs the product that depends on it | COVERED | U-1, and freshness is the whole point of this project: ADR-0031 estimated the cost on 2026-09-21 and v25.5.0 had already changed it |
| D-7 | Cost at expected volume | The economics at real usage, not the pricing page's first row - this decides viability | DISMISSED | no per-use cost; the cost is engineering time, which no page prices |
| D-8 | Runtime and platform limits | Where this actually executes - OS, runtime version, desktop app, cloud - and what those limits forbid | COVERED | U-1. Windows is supported; the platform exclusion (macOS x64) is unchanged and out of scope |
| D-9 | Output obtainability | Does the data your stated "done" depends on exist, and can you actually get it? Load-bearing: a project whose output cannot be produced should die in phase 1, not phase 2 | COVERED | U-1, load-bearing: the output is a yes/no about an external dependency, and it is no |
## Coverage notes (per dimension)

_One short paragraph per row once it has a status: what was established, and what the
status rests on._

## Candidate material

Gathered 2026-09-22.

_No material gathered - run without `--dry-run`, or add URLs to `research/plan.json`._


## Coverage notes

- **D-6 Freshness - COVERED and load-bearing.** This project exists because a cost estimate
  written yesterday was already out of date. `--build-sea` landed in v25.5.0, before
  ADR-0031 was written, and nobody had looked.
- **D-9 - COVERED.** One question, one answer, no external injector.

## Candidate material

Collected 2026-09-22 by `collect.yml` run 35689363486, dispatched through
`bin/collect-remote.mjs` with an OPAQUE client_ref (`job-0922a`) - the discipline
`collect.yml` asks for and that an earlier run of this project ignored. Three pages, three
credits. One authoritative, one a second runtime's compatibility docs, one a GitHub
Discussion that rendered nothing.
