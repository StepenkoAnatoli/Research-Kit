# Research-Kit, as auto-build runs inside it

This file is added by the kit (ADR-0146). The auto-build SKILL.md beside it ships as its
author wrote it; this file says how each stage runs on a machine with Research-Kit
installed. **Where the two differ, this file wins inside a Research-Kit project**, because
the kit's gate enforces it anyway: a run that ignores it is stopped by the gate, not by
this text. Which skill to use at each point is the `skill-router` skill's table.

Commands below assume the kit at `$HOME/.agents/research-kit` (`KIT` for short):

```
KIT="$HOME/.agents/research-kit"
```

## Ask, and stop: the owner decides

This section **replaces the SKILL.md's "Autonomous decision rule" and its standing-mandate
shortcuts** inside a Research-Kit project. The run is secure before it is fast.

**Ask.** Whenever the run needs something only the owner can give - intent, a choice
between approaches, a budget, an account, a credential, permission, what "done" means -
it asks. Questions are collected and sent as one message at the next stop, each with the
options, the recommended one and what each costs, so one reply can answer them all. A fact
a document can answer is never a question: on a collector it is collected, on a builder it
is a `fact-request`.

**Stop and wait for the owner's reply** - not a default, not a timeout, not a standing
mandate - when any of these holds:

| Stop | Why it is the owner's |
|---|---|
| the Mandate is ready (every run, bounded or architectural) | it authorizes everything after it |
| a decision is hard to reverse, changes the task's goal, or picks between approaches with different consequences | the design is the owner's |
| anything would spend money: paid pages, a paid service, a dependency with a licence cost, a budget raise | the account is the owner's |
| a secret, credential, token or personal data would be read, written, sent or logged | security and privacy |
| a change touches authentication, permissions, CI, deploy, the gate or its hooks, branch protection, or another repository | the blast radius is beyond the task |
| anything destructive: deleting data or branches, rewriting history, force-pushing, migrating data | it cannot be undone |
| the kit's gate fails, the suite is red, `handoff` fails, `doctor` is not READY | a red result stops work |
| break-test or an audit reports a Critical or S1 finding | the owner decides if it ships |
| a research claim the design rests on proves wrong, or a fact is missing | the plan changed under the run |
| the merge | always the owner's word, given in this run |

At a stop the run writes `RUN.md` (state, what it found, the question, Next action
"awaiting owner") and **ends its turn**. It does not continue on a guess, and it does not
take "no answer" as consent. A decision it takes alone - reversible, cheap, inside the
approved Mandate and the evidence - is recorded under "Decisions and assumptions" so the
owner can overrule it.

The standing mandate may still pre-answer *preferences* (branch names, merge method, audit
depth, page budget for free transports). It never pre-approves a stop in the table above.

## Stage 0: Orient - start from the router, not from the task

Before anything else, read the state from disk and record it in `RUN.md`:

```
node "$KIT/bin/doctor.mjs"       # verdict and machine role (collector | builder)
node "$KIT/bin/preflight.mjs"    # the gate: PASS, or what is unproven
node "$KIT/bin/handoff.mjs"      # did the corpus arrive whole (exit 0)
test -f research/BRIEF.md        # is there a brief
```

Also record the **kit version** (`doctor` prints it) and the **skill set that ran** (the
names under the skill root), so the run can be compared under ADR-0145.

Then take one path, from the router's "Step 2: route by state":

| Role | State | Path |
|---|---|---|
| collector | gate failing, or no corpus | Stage 1 as below (collector) |
| collector | gate PASS and a brief | Stage 1 is SKIPPED ("the brief answers it"); start at Stage 2 |
| builder | gate PASS, `handoff` exit 0, a brief | Stage 1 as below (builder): no collecting at all; then Stage 2 |
| builder | no brief, or `handoff` fails, or gate failing | **stop.** `RUN.md` Next action: "awaiting collector", with the `handoff` output and any fact requests |

## Stage 1: Research

**On a collector**, Stage 1 runs as the SKILL.md says, through the `research-first` skill,
and the review steps use the kit's skills: `map-classifier` (the map's rows),
`finding-rewriter` (the Findings, with `[quote: ...]`), `source-grader` (P/S/L and
contradictions), `brief-writer` (the brief, `Reviewed by: agent`). The sufficiency gate is
`preflight` exit 0 plus a brief - the gate's verdict, not the lead's impression.

**On a builder**, Stage 1 is three steps and never fetches a page:

1. `node "$KIT/bin/handoff.mjs"` exits 0. If not, stop (see Stage 0).
2. `build-from-brief` reads `research/BRIEF.md` and `research/EVIDENCE.md`.
3. Every fact the design needs and the brief does not hold becomes a request written with
   `fact-request`, saved in the run folder as `FACT-REQUESTS.md`.

If any request is blocking, the run goes on to the Mandate only to present it, and stops
there with Next action "awaiting collector" (and the owner). `research.mjs` and `decompose.mjs` refuse on a
builder (exit 2); a page fetched by hand, by browser or by another tool is not evidence and
is never used (ADR-0010).

## Stage 2: Requirements - every line rests on evidence

- Each row of `REQUIREMENTS.md` carries a **Rests on** cell: the evidence row(s) `E-##` it
  depends on, the unknown `U-##` it is waiting on, or `repository` when the code itself
  answers it. A row with none of these is an assumption and is listed as one.
- `day-one-tasks` turns every `KNOWN-UNKNOWN` row's verification step into the first work
  units and smoke tests. They run before anything that depends on them.

## Stage 3 and 4: Design and the Mandate - the evidence is shown

The Mandate gains two things:

- a **Rests on** column on every design decision, naming its `E-##` rows;
- a **Known unknowns** section: each `KNOWN-UNKNOWN`, with its day-one check and the unit
  that runs it.

A design decision with no evidence row is either listed under "Assumptions" with what
breaks if it is wrong, or it **blocks the Mandate** when a wrong guess would change the
design. Open fact requests are listed as blocking questions.

Any decision that set an alternative aside is written as a record with `adr-writer`.

## Stage 5: Build - the code points back at the evidence

- `careful-coding` on every change.
- `cite-in-code`: every constant that came from research (a limit, endpoint, price, schema
  field, quota) carries a comment naming its `E-##` row.
- `contract-tests`: the verified claims and quotes become tests and fixtures.
- **One commit per unit**, each with the five-part report from `commit-report`, the
  got-wrong line included.
- `TRACEABILITY.md` links each requirement to its `E-##` row, then to the code, then to the
  test.

## Stage 8: Deliver and merge - stricter here

`GO MERGE` keeps every condition in `merge-protocol.md`, plus three, all checked on **the
exact head being merged**:

1. the kit's commit gate passed for every commit (no override taken);
2. the project's suite is green - a red suite stops work, it is not a line in the report;
3. `node "$KIT/bin/preflight.mjs"` still exits 0.

And:

- **Never `--no-verify`, never `research/GATE_OFF`, never a local `core.hooksPath` to step
  around the gate.** If the gate fails, the run stops and says why.
- **No merge without the owner's word in this run.** A standing mandate's `GO MERGE` or
  `Merge: allowed` is read as `GO`: Stage 8 stops at an open pull request, sends the owner
  the merge summary (checks, gate, suite, preflight, findings, what was not verified) and
  waits for "merge". This holds on a collector and a builder alike.
- Without `gh`, the run stops at a pushed branch or a patch, as the SKILL.md says.
- An unattended run stops at the Mandate, standing mandate or not.

## Before the merge: freshness

- **On a collector**, `freshness-recheck` re-collects the pages behind the `E-##` rows the
  code depends on (`research.mjs --refresh-days`). If a fact changed, the run returns to
  Stage 1 for that topic and re-plans what depended on it; it does not merge.
- **On a builder**, a fact that may be stale becomes a `fact-request`, and the merge waits
  when the stale fact is one a requirement rests on.

## Resuming: "continue the auto-build"

Start with `resume-from-disk`: `RUN.md`, then `doctor`, `preflight`, `git status`, and the
last commit report. Uncommitted changes are the interrupted unit, unverified. Facts already
collected are reused (`--refresh-days`), never paid for twice.

## What this file does not change

The stages, their order, the Mandate replies, the self-correction rule and the stop
conditions are the SKILL.md's. This file only tightens them where the kit's rules apply.
