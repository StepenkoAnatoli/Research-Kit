# ADR-0013 — Resuming after an interruption is documentation, not a check

- **Date:** 2026-09-14
- **Status:** accepted
- **Area:** the protocol, agent orientation, the kit's boundaries

## Context

A session can die mid-task: the sandbox resets, the turn is cut, the working tree is
lost. Everything committed survives, and the gate verdict is a pure function of
repository state (ADR-0002, ADR-0004) — so the recovery path already existed, was
already correct, and was already cheap:

- `doctor` and preflight answer *where is this project* from disk alone;
- the last commit report and `docs/ARCHITECTURE.md` say *what was happening and why*
  (the report's five named parts exist for exactly this reader);
- `git status` says what is unfinished, and its uncommitted changes *are* the
  interrupted task;
- the corpus is already collected and spent credits are not spent again, so restarting
  pays for both twice.

None of that was written down as the recovery path. It was implicit in the
architecture, which means a fresh agent had to infer it — and the natural inference
from "I do not know what state this is in" is to start over, which is the expensive and
wrong answer. The defect was not a missing mechanism; it was a missing sentence.

## Decision

**`AGENTS.md` and the scaffold template gain a short section — prose, not a procedure —
telling an agent that arrives mid-project to orient from repository state before
touching anything: run `doctor` and preflight, read the last commit report and this
map, read the working tree, resume rather than restart.** `CONTEXT.md` carries the term
**resume**. Nothing is enforced, and nothing may be.

The section is deliberately four sources and one instruction, in the order an arriving
agent can actually use them: the two commands (state), the two documents (intent), the
working tree (the task), then resume. It names no command options and no workflow
because the point is orientation, not procedure — a procedure would be re-litigated by
the next interruption, while "read the repository first" is true of every one.

## Consequences

- The recovery path is now stated where the agent already looks first, and the map and
  the glossary point at it, so the three cannot drift into three different stories.
- It is inherited by every scaffolded project, because the template carries the same
  section — a project that never sees this repository still tells its agents not to
  restart.
- Ignoring it breaks nothing: an agent that restarts loses time and credits, not
  correctness. That asymmetry is why this is prose and not a gate.
- The section will need revisiting if the recovery inputs change (a new state command,
  a report format change) — but not if the *shape* of recovery changes, because
  "orient from repository state" is the invariant, and the tools behind it are the
  details.

## Rejected alternatives

- **A check that an agent oriented first.** The obvious move for a protocol-minded kit:
  require evidence of orientation (a doctor run in the transcript, a marker file, a
  preflight pass before edits). Rejected because it would be a gate that is wrong. It
  cannot see intent — a doctor run is not orientation — so it would pass agents that
  ran a command and fail agents that oriented without one; and it would turn a
  judgement about reading into a rule about tokens, which is the failure mode the
  standing protocol already warns about ("a gate that judges prose is a gate that will
  be wrong"). The kit's enforcement surfaces stay the two that can be decided from
  state: the commit gate and the edit-time gate.
- **A recovery command (`bin/resume.mjs`).** Rejected as a second implementation of the
  same idea: `doctor`, preflight, `git status` and the report already answer the four
  questions, and a wrapper would restate their answers in a fifth place that could
  disagree with them. The sentence is the deliverable; the commands it names already
  exist.
- **Leaving it implicit in `docs/ARCHITECTURE.md` only.** The map is written for
  someone maintaining the code, not for an agent arriving with no context. The recovery
  path has to be in the file an agent is told to read before acting, with the map as
  its reference — which is where it now is.
