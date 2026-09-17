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
| U-1 | What does the free Firecrawl tier actually allow - per-minute request limits, parallel jobs, and included credits? | Sets the collector's default `--depth` budget, how many sources one run may take, and whether a queue or retry-with-backoff is needed at all | OPEN | E-01: free plan allows 10 `/scrape` and 10 `/search` requests per minute with 2 concurrent browsers, and a free key includes 1,000 credits |
| U-2 |  Which skill root does Freebuff Desktop auto-discover on this machine - `~/.agents/skills/` or `~/.claude/skills/`? | Decides whether the protocol binds agents at the skill layer or only through each project's `AGENTS.md`; the two are mirrored today precisely because this is unresolved | OPEN | E-04: documented - the skills page enumerates the discovery roots: personal `~/.claude/skills/` (all local projects), project `.claude/skills/` from the start directory to the repo root, directories added via `--add-dir` / `/add-dir` (the deliberate exception: `permissions.additionalDirectories` grants file access only, but an added directory DOES load its skills), plugins (`<plugin>/skills/<name>/SKILL.md`, as `/plugin-name:skill-name`), and enterprise managed settings. `~/.agents/skills/` appears nowhere - it is not a documented discovery path. A skill folder holding `.claude-plugin/plugin.json` loads as a plugin named `<name>@skills-dir` and can bundle agents, hooks, and MCP servers. Critical for this machine: Cowork and cloud sessions, including routines, do NOT read `~/.claude/skills/` - a personal-only skill reports skill-not-found in a routine. The `~/.agents` mirror was unnecessary; `AGENTS.md` stays the binding layer for runtimes with no Claude skill loader|
| U-3 |  Does the Claude Code `PreToolUse` hook block an edit on this Windows build, and does exit code 2 stop the session instead of letting the agent adapt? | Decides whether the edit-time gate ships as `permissionDecision: "ask"` (current default) or the harder `hard-block`, which is the stronger guarantee but risks wedging a session mid-task | OPEN | E-05: documented - PreToolUse returns `permissionDecision` of allow / deny / ask / defer inside `hookSpecificOutput`; multiple hooks resolve most-restrictive-wins with precedence deny > defer > ask > allow; a hook that exits 2 routes the same as deny with stderr as the denial reason (the session continues and Claude sees the reason - it does not wedge); an `ask` prompt carries a provenance label naming the hook source (`[settings]`, `[plugin:<name>]`, or `[skill]`). The page also records the reported non-enforcement: before v2.1.214, an exit-2 hook whose JSON failed schema validation was treated as a non-blocking error and the action proceeded - which is the open-issue pattern; our hook exits 0 and emits the `hookSpecificOutput` wrapper, the correct side of that fix. `hard-block` stays behind config until verified live|
| U-4 | Is this kit's own collection permitted - automated fetching of public vendor documentation through Firecrawl's service, for personal research on the operator's machine? | If the ToS forbids the intended use, the kit's whole evidence base rests on a prohibited activity and the collection layer needs rework | OPEN | E-06 |

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
