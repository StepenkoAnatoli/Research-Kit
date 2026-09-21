# MAP - topic decomposition

## Topic

Node.js single executable application bundling assets getAsset stability without virtual file system

## Subtopics

Statuses are blank on purpose: phase 0 gathers material, it does not judge. Mark each
row COVERED (cite the U-## rows that cover it), DISMISSED (reason required - dismissing
is fine, omitting is not), or GAP, and add topic-specific subtopics where the checklist
is not enough.

| ID | Subtopic | Why it matters | Status | Covered by |
|---|---|---|---|---|
| D-1 | Access model | Public pages, an official API, an auth-walled app, or a paywall - each is a different collection design | COVERED | U-1. Public vendor documentation; no auth, no paywall |
| D-2 | Auth and credentials | What accounts, keys, or logins the collection and the product need, and who holds them | DISMISSED | nothing here needs a credential - bundling assets into a binary involves no account |
| D-3 | Rate limits and quotas | Caps every cadence in the design, and caps the research collection itself | DISMISSED | no quota governs reading a documentation page or building a binary |
| D-4 | ToS, licensing, legality of the intended use | A prohibition on automated collection, storage, or display ends the design for that source - and sometimes the project | DISMISSED | out of scope: Node.js is MIT-licensed and shipping a SEA of your own program engages no term this project must research |
| D-5 | Data schema and its stability | How the data is shaped, and how often the source changes the shape without asking | COVERED | U-1, U-2. The `assets` configuration key and the `sea.getAsset` family ARE the schema, and E-02 shows how fast it moves - a v20 mirror predates the VFS section entirely |
| D-6 | Freshness and staleness | How fast the data goes stale, and what staleness costs the product that depends on it | COVERED | U-2, and E-02 is the cautionary example: a six-major-version-old mirror of the same page reads as current unless the version string is checked |
| D-7 | Cost at expected volume | The economics at real usage, not the pricing page's first row - this decides viability | DISMISSED | no per-use cost; the cost of the .exe route is engineering time, which no page can price |
| D-8 | Runtime and platform limits | Where this actually executes - OS, runtime version, desktop app, cloud - and what those limits forbid | COVERED | U-1, U-2. Windows is supported, macOS x64 is not, and the assets route is 1.1 rather than 1.0 |
| D-9 | Output obtainability | Does the data your stated "done" depends on exist, and can you actually get it? Load-bearing: a project whose output cannot be produced should die in phase 1, not phase 2 | COVERED | U-1, load-bearing: the output is a yes/no about a deferred option, and it is yes. That the kit needs bundled assets at all is not cited here - it is a property of this repository, checked directly and recorded in the contract rather than dressed up as a fetched row |
## Coverage notes (per dimension)

_One short paragraph per row once it has a status: what was established, and what the
status rests on._

## Candidate material

Gathered 2026-09-21.

_No material gathered - run without `--dry-run`, or add URLs to `research/plan.json`._


## Coverage notes

- **D-5 / D-6 - COVERED, and E-02 is why they are not routine.** The same document on two
  hosts, six major versions apart. Freshness here is not "is the fact still true" but "am I
  reading the current edition of the page at all".
- **D-9 - COVERED and load-bearing.** The deferral is liftable: there is a 1.1 route to the
  assets the kit needs.

## Candidate material

Collected 2026-09-21 by `collect.yml` run 35623502540, dispatched through
`bin/collect-remote.mjs`. Three pages, all graded `full`. One is authoritative and current,
one is a stale mirror of it, and one rendered no content at all - which is a fair sample of
what a single search returns and the reason step two of the review exists.
