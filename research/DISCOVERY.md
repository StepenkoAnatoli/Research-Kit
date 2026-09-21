# Discovery Contract - Research-first project bootstrap

Started 2026-09-13. This file is the definition of "enough information to build".
`node research-kit/bin/preflight.mjs` reads it and blocks the build until every unknown
below is either `CLOSED` with evidence or `KNOWN-UNKNOWN` with a verification step.

## Build intent

A research-first kit for this machine: a collector that turns a Firecrawl fetch into
cached, citable evidence, and a gate that refuses to let a build start while a blocking
fact is unproven. "Done" means an agent asked to build something can no longer answer
*insufficient information* and stop — it either produces primary-source evidence, or
names the one fact it could not reach and records the day-one step that would settle it.

The reason this file exists at all: this repository is the kit's own development home, so
it inherits its own gate. A gate that exempts the project it ships with is a gate nobody
should trust, so this contract is real rather than waived.

## Unknowns

A fact belongs here when guessing it wrong changes the design: API limits and pricing,
auth model, data schemas, rate limits, licensing/ToS, platform behavior, current library
versions, competitor pricing, data availability.

Status is exactly one of:
- `CLOSED` - proven by an `E-##` row in `research/EVIDENCE.md` (which must point at cached raw text).
- `KNOWN-UNKNOWN` - unreachable now; the `Evidence` cell names the day-one verification step.

Anything else (`OPEN`, blank, "in progress") fails the gate.

| ID | Unknown | Why it blocks the build | Status | Evidence |
|---|---|---|---|---|
| U-1 | What does the free Firecrawl tier actually allow - per-minute request limits, parallel jobs, and included credits? | Sets the collector's default `--depth` budget, how many sources one run may take, and whether a queue or retry-with-backoff is needed at all | CLOSED | E-19 (re-read 2026-09-20 on a metered, full capture): free plan allows 10 `/scrape` and 10 `/search` requests per minute with 2 concurrent browsers, and a free key includes 1,000 credits |
| U-2 |  Which skill root does Freebuff Desktop auto-discover on this machine - `~/.agents/skills/` or `~/.claude/skills/`? | Decides whether the protocol binds agents at the skill layer or only through each project's `AGENTS.md`; the two are mirrored today precisely because this is unresolved | CLOSED | E-22 (re-read 2026-09-20 on a metered, FULL capture - the earlier one carried 3 chunks of 12): documented - the skills page enumerates the discovery roots: personal `~/.claude/skills/` (all local projects), project `.claude/skills/` from the start directory to the repo root, directories added via `--add-dir` / `/add-dir` (the deliberate exception: `permissions.additionalDirectories` grants file access only, but an added directory DOES load its skills), plugins (`<plugin>/skills/<name>/SKILL.md`, as `/plugin-name:skill-name`), and enterprise managed settings. `~/.agents/skills/` appears nowhere - it is not a documented discovery path. A skill folder holding `.claude-plugin/plugin.json` loads as a plugin named `<name>@skills-dir` and can bundle agents, hooks, and MCP servers. Critical for this machine: Cowork and cloud sessions, including routines, do NOT read `~/.claude/skills/` - a personal-only skill reports skill-not-found in a routine. The `~/.agents` mirror was unnecessary; `AGENTS.md` stays the binding layer for runtimes with no Claude skill loader|
| U-3 |  Does the Claude Code `PreToolUse` hook block an edit on this Windows build, and does exit code 2 stop the session instead of letting the agent adapt? | Decides whether the edit-time gate ships as `permissionDecision: "ask"` (current default) or the harder `hard-block`, which is the stronger guarantee but risks wedging a session mid-task | CLOSED | E-23 (re-read 2026-09-20 on a metered, FULL capture - the earlier one carried 4 chunks of 33): documented - PreToolUse returns `permissionDecision` of allow / deny / ask / defer inside `hookSpecificOutput`; multiple hooks resolve most-restrictive-wins with precedence deny > defer > ask > allow; a hook that exits 2 routes the same as deny with stderr as the denial reason (the session continues and Claude sees the reason - it does not wedge); an `ask` prompt carries a provenance label naming the hook source (`[settings]`, `[plugin:<name>]`, or `[skill]`). The page also records the reported non-enforcement: before v2.1.214, an exit-2 hook whose JSON failed schema validation was treated as a non-blocking error and the action proceeded - which is the open-issue pattern; our hook exits 0 and emits the `hookSpecificOutput` wrapper, the correct side of that fix. `hard-block` stays behind config until verified live|
| U-4 | Is this kit's own collection permitted - automated fetching of public vendor documentation through Firecrawl's service, for personal research on the operator's machine? | If the ToS forbids the intended use, the kit's whole evidence base rests on a prohibited activity and the collection layer needs rework | CLOSED | E-24 (re-read 2026-09-20 on a metered, FULL capture - the earlier one carried 1 chunk of 3 and recorded no transport at all): Section 4 item 01 bounds the permission rather than removing it - "Use the Services for any commercial purposes except as expressly authorized by Firecrawl". One operator researching public vendor documentation on their own machine is not a commercial purpose, and nothing in the full text forbids automated fetching through the service Firecrawl sells to do it |
| U-5 | What does SerpAPI's free tier actually allow - searches per month, rate limits, and whether the plan permits automated use? | Decides whether a second search provider can be a default or only an opt-in, and sets the cache policy: the kit fires 4 searches per phase-0 run plus one per plan query, so a monthly cap is a design constraint, not a footnote | CLOSED | E-07: the free plan is 250 searches per month at 50 throughput per hour, $0, sign-up only. Automated use is the product — the ToS (E-10) restricts purpose, not automation, and forbids nothing this kit does. The cap is softer than it reads, for two reasons E-07 and E-09 state outright: a response counts as one search whatever it returns ("100 results or empty result sets will both count as 1 search"), and a repeat of an identical query inside an hour is served from SerpAPI's own cache free and uncounted ("Cache expires after 1h. Cached searches are free"). At this kit's rate — 4 searches per phase-0 run — 250 a month is roughly 60 runs, which is not the binding constraint. What is binding: E-10 excludes the free plan from the $2M U.S. Legal Shield |
| U-6 | Does SerpAPI's ToS permit STORING search results, which this kit does by writing them into the corpus? | The kit caches what it collects. A provider that forbids retention makes the discovery layer's whole design unusable, exactly as U-4 asked of Firecrawl | CLOSED | E-10: yes, by absence and by implication. Nothing in the Terms of Service or Privacy Policy of 2026-08-27 restricts what the customer does with returned results; the one reproduction ban (Section 2) is scoped to "any portion of the Service, use of the Service, or access to the Service" — reselling access, not keeping data. Section 13 assumes the customer holds it: SerpApi "assumes liability for the lawful collection of public search data … but not for how that data is ultimately used". The 31-day retention in Privacy Policy Section 10 governs SerpApi's copy, not the customer's. Read this as permission-by-silence rather than a grant, and note the limit found alongside it: the $2M Legal Shield that would cover collection is excluded on the free plan |
| U-7 | What does Tavily's free tier allow, and does its ToS permit storing results? | The second candidate provider. Same two questions, because the answer decides which of the two can be a default rather than an opt-in | CLOSED | E-12: 1,000 credits per month free, no card, at 1 credit per basic search — four times SerpAPI's 250 (E-07) and, at 1 credit per 5 successful extractions, five times cheaper per page than Firecrawl (E-21). E-16: storing Output is unprohibited rather than granted — §1.7 excludes Output from the definition of "Services", so the §3.2 copy/derivative/distribute restrictions do not reach it, and §9 never allocates Output to either party; §6.6 does forbid using Output to train a competing model. The fact that decides the default, though, is §6.5: Tavily and its AI providers "may use, process, analyze, and retain Customer Input … and Outputs … for purposes of training", and §6.7 says those providers may not be bound to confidentiality. A provider that trains on the query text cannot be this kit's silent default; it can be an opt-in the operator chooses knowingly |
| U-8 | What does a Firecrawl `search` actually cost and return, on the current version this machine runs? | The baseline the alternatives are judged against. E-21 read 2 credits per 10 results off the billing page, metered, on 2026-09-20, and the September reading of the same page agreed, and E-21 re-read that same page on 2026-09-20 through the metered transport and found it unchanged; whether that still holds, and what the CLI returns, decides whether a second provider is worth the seam at all | CLOSED | E-13 and E-14: it still holds, six days on and from two vendor pages — 2 credits per 10 results, rounded up, so a 5-result search costs 2 and an 11-result search costs 4; scraping the results is billed separately at 1 credit per page. E-13 adds the error rule: a scrape returning nothing is free, but a 403 or 404 page is delivered and charged. What the CLI returns was settled on this machine rather than from a page, and is recorded in `research-kit/test/fixtures/firecrawl-search-1.23.3.json`: `{success, data: {web: [...]}, creditsUsed}` — a keyed object, not the array the adapter first assumed. Budget arithmetic for this kit: one plan query at `perQuery: 2` costs 4 Firecrawl credits, against 1 SerpAPI search or 1 Tavily credit for the search half |

## Questions for the human (maximum 3)

Intent questions only - things no document can answer. Facts never go here; they go in the table above.

1. Should the machine-wide commit gate be installed, given that it will gate every
   repository on this box - including this one - and that `research/GATE_OFF` is the only
   per-project opt-out besides `git commit --no-verify`?
2. Is the free Firecrawl tier the budget to design against, or is a paid plan expected
   later? The default `--depth` tiers are tuned for roughly 1,000 credits.

## Already decided

Locked decisions for this project. Do not revisit these without the human.

- Evidence must be *fetched*, not typed: every citation resolves through the hash-chained
  `research/raw/.fetches.jsonl`, written only by the collector.
- The gate fails **open** and loudly by default, because a broken gate that blocks every
  commit on the machine is worse than no gate. `--fail-closed` inverts that deliberately.
- Overrides are `git commit --no-verify`, a deliberate `research/GATE_OFF`, and a
  repository-local `core.hooksPath` (silent by nature; detected by `doctor.mjs` and
  preflight), all recorded in `research/overrides.log` and counted by `doctor.mjs`.
  The third was added when the local-override path was found in 2026-09-13's
  hardening pass; it was always possible, it just had no detection.
- The commit gate lives in a machine-wide `core.hooksPath` rather than per-repository
  hooks, so a new project inherits it with no setup step to forget.
- Research supporting a repository-level architectural decision lives in a self-contained
  project at `docs/decisions/<date>-<decision-name>/`, committed with its ledger, and is
  verified with that directory as the working directory. Scratch projects stay legitimate
  for experiments; their findings cannot support a committed decision unless the corpus and
  ledger are preserved. ADR-0030, written after a scratch project holding nine captures was
  deleted as routine cleanup. **This contract does not cover those decisions** — it
  enumerates U-1..U-8 about transports and vendors, and a second topic in it would have
  `unknown-closure` and `subtopic-coverage` judging two unrelated sets of claims together.
