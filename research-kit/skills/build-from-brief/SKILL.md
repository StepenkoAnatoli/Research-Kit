---
name: build-from-brief
description: Starts phase 2 of a Research-Kit project - checks the corpus arrived (handoff), confirms the gate passes, reads research/BRIEF.md, and builds only from what it verified, naming the E-## row behind every design decision and refusing to fill a gap with a guess. Use when the user says "build it", "start building", "implement the brief", "phase 2", or hands over a project with a research/ folder, on either machine once the gate passes.
---

# Build from the brief

Phase 2 starts from `research/BRIEF.md` and nothing else. You should not need to
re-research anything; if you do, phase 1 was incomplete, and that is a `fact-request`,
not a judgement call.

## Before the first edit

1. `node "$HOME/.agents/research-kit/bin/handoff.mjs"` - exit 0, or stop: the corpus did
   not arrive whole, and the command names the cause (not pushed, or line endings
   rewritten here) and the remedy.
2. `node "$HOME/.agents/research-kit/bin/preflight.mjs"` - `PASS`, or stop.
3. `node "$HOME/.agents/research-kit/bin/brief.mjs" --state` - `authored`. A `draft` brief
   is not reviewed and not a handoff.
4. Read the brief whole: intent, what was verified, contradictions, known unknowns, the
   decision and its first build step. PASS reports the configured checks; the gate
   warnings the brief lists still apply.

## While building

- **Every design decision names its evidence.** In the plan, the commit report or the
  pull request: "rate limit 60/min - E-04". A decision with no row behind it is either
  an intent the brief states, or a guess. Guesses are not made.
- **A missing fact stops that piece of work.** Use `fact-request`; build the parts that do
  not depend on it.
- **Known unknowns come first.** `day-one-tasks` turns each into a first task.
- **Constants carry their row.** `cite-in-code`.
- **The brief is tested against.** `contract-tests`.
- **Contradictions stay resolved the brief's way.** If the code needs the other side,
  that is a new fact for the collector, not a choice made here.

## Done

The first build step the brief names is done, each claim in the report carries
verified / untested / expected, and `commit-report`'s five parts are written.
