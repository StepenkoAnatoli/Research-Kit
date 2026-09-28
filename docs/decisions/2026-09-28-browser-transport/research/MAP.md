# MAP - topic decomposition

## Topic

Headless Chromium as a free transport: dump-dom rendering, proxy settings, sandbox and timeouts

## Subtopics

Statuses are blank on purpose: phase 0 gathers material, it does not judge. Mark each
row COVERED (cite the U-## rows that cover it), DISMISSED (reason required - dismissing
is fine, omitting is not), or GAP, and add topic-specific subtopics where the checklist
is not enough.

| ID | Subtopic | Why it matters | Status | Covered by |
|---|---|---|---|---|
| D-1 | Access model | Public pages, an official API, an auth-walled app, or a paywall - each is a different collection design | COVERED | U-01. A local binary; any public page |
| D-2 | Auth and credentials | What accounts, keys, or logins the collection and the product need, and who holds them | DISMISSED | no key: the transport is local and free |
| D-3 | Rate limits and quotas | Caps every cadence in the design, and caps the research collection itself | DISMISSED | no vendor quota; the sites' own limits apply as they do to any browser |
| D-4 | ToS, licensing, legality of the intended use | A prohibition on automated collection, storage, or display ends the design for that source - and sometimes the project | DISMISSED | the kit already fetches public pages for research; rendering them locally changes the client, not the use |
| D-5 | Data schema and its stability | How the data is shaped, and how often the source changes the shape without asking | COVERED | U-01. The output is the rendered DOM, converted to text by the kit's existing extractor |
| D-6 | Freshness and staleness | How fast the data goes stale, and what staleness costs the product that depends on it | DISMISSED | pages are captured and hashed at fetch time, as with every transport |
| D-7 | Cost at expected volume | The economics at real usage, not the pricing page's first row - this decides viability | DISMISSED | free |
| D-8 | Runtime and platform limits | Where this actually executes - OS, runtime version, desktop app, cloud - and what those limits forbid | COVERED | U-02, U-03. Proxy flag; sandbox and root |
| D-9 | Output obtainability | Does the data your stated "done" depends on exist, and can you actually get it? Load-bearing: a project whose output cannot be produced should die in phase 1, not phase 2 | COVERED | U-01. Rendered pages are obtainable |

## Coverage notes (per dimension)

Phase 0 ran as a dry run to save credits; the pages were named directly.

## Candidate material

Gathered 2026-09-28.

_No material gathered - run without `--dry-run`, or add URLs to `research/plan.json`._

