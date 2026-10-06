# The Mandate

The Mandate is the one message in an auto-build run that needs the user, and the one reply that
authorizes everything after it. It is presented after the research is proven and the design is
on disk, because that is the first moment the user can make an informed decision, and before any
code meant to be kept is written, because that is the last moment a wrong decision is cheap.

It replaces three separate asks the delegated skills would otherwise make - brainstorming's
section-by-section approval, lead-orchestrator's merge approval, gap-audit's implementation
phrase - with one, and it does so by carrying each of those decisions explicitly. It does not
replace the asks those skills reserve for the stop-list.

## Contents

1. The message template
2. The reply vocabulary
3. The stop-list (what no Mandate authorizes)
4. The standing mandate section
5. Saving `MANDATE.md`

---

## 1. The message template

Keep each section to what the task needs. A Bounded task fits in a screen; an Architectural one
links to its spec and summarizes. Every blocking question from Stages 1–3 appears here, numbered,
so one reply answers all of them.

```markdown
# Mandate: <task slug>

**Classification:** <spike / bounded / architectural> (brainstorming's test: <one line>). Override if wrong.
**Engagement:** <Light / Full> (lead-orchestrator's table: <the reason>).
**Run ledger:** <path to RUN.md>

## What the research proved
| Topic | Project | Gate | Claims the design rests on |
|-------|---------|------|----------------------------|
| <topic> | <path> | preflight 0 | E-03 (<one-line claim>), E-07 (<claim>); U-2 KNOWN-UNKNOWN: verify on day one by <step> |
Or: "Research SKIPPED: <the sentence from the stage table>."

## Requirements
<path to REQUIREMENTS.md>; <n> rows. The ones that drive the design:
- R-01 <text> (E-03)
- R-04 <text> (engineering judgment: <why>)

## Design
<Bounded: approach, files touched, how it is tested, in a few lines.>
<Architectural: spec at <path>; the approaches compared and the recommendation, with the
strongest case against it; one line per section of the spec.>

**Assumptions I am carrying** (reject any that are wrong):
- A1 <assumption> (assumed)
- A2 <inference> (inferred from <path>)

**Decision records:** <ids and one line each>, or "none expensive to reverse".

## Work breakdown
| Unit | Description | Owns | Depends on | Wave | Pre-mortem |
|------|-------------|------|------------|------|------------|

## Delivery
- Base branch: <name>; working branch: <name>
- Merge method: <repository default / squash / merge / rebase>
- After merge: delete working branch <yes/no>; wait for base CI <yes/no>
- Audit depth: <full / scoped / off (reason)>
- Harden: break-test <standard / with these probes skipped: ...>

## Budgets
- Research pages: <n> collected; <m> more allowed before asking again
- Sub-agent concurrency: <n>
- Longest probe: <minutes>

## Stop-list
Nothing in this Mandate authorizes: scope beyond the task statement; changing an invariant;
deleting data; touching a production system or real external service; force-pushing; bypassing
a gate or a hook; merging a pull request this run did not open; spending beyond the budgets
above. These stop the run and ask.

## Questions that block
1. <question> - my default if unanswered: <default>
2. ...

## Reply
`GO` - build, open the pull request, hold the merge.
`GO MERGE` - build and merge once every check is green and the gate equals the baseline.
Add corrections to either. Anything else, I revise and present again.
```

## 2. The reply vocabulary

| Reply                         | Meaning                                                                           |
|-------------------------------|-----------------------------------------------------------------------------------|
| `GO`                          | Stages 5–9 run; Stage 8 stops at an open pull request with Next action "merge when ready" |
| `GO MERGE`                    | Stages 5–9 run; Stage 8 merges under the merge protocol and verifies the base afterwards |
| `GO` or `GO MERGE` + text     | The text is a correction to apply first. If a correction changes the classification, the engagement, the base branch or a decision record, present the revised Mandate and wait again; otherwise apply it, record it under "Decisions and assumptions", and proceed |
| `STOP AFTER DESIGN`           | Stages 5–9 do not run; the run ends COMPLETE with the research, requirements and design delivered. For a user who wanted the thinking, not the code |
| Anything else                 | Not an approval. Incorporate what it says; present again                           |

Unanswered blocking questions are answered by their stated defaults only when the reply is
`GO` or `GO MERGE` and the default was shown in the message. A default never applies to a
stop-list item.

## 3. The stop-list

These are the user's decisions in every delegated skill, and the Mandate does not move them:

- expanding scope beyond the task statement recorded in `RUN.md`
- changing a project invariant (lead-orchestrator)
- deleting data, modifying a production system, reaching a real external service in a probe
  (break-test)
- force-pushing a shared branch; `--no-verify`; a gate-off file; an admin override of branch
  protection (lead-orchestrator; Research-Kit; merge protocol)
- merging anything this run did not open (merge protocol)
- spending a metered budget beyond what the Mandate agreed (Research-Kit)
- a gap-audit gap that needs a design change (gap-audit)

With the user present: stop and ask in one message, then continue from the answer. With nobody
present: record the item as BLOCKED or RECORDED with the decision needed, finish everything that
does not depend on it, and leave Next action pointing at it.

## 4. The standing mandate section

A project that runs auto-build often can record the stable decisions in its agent instructions
(`CLAUDE.md`, `AGENTS.md` or equivalent), next to lead-orchestrator's "Orchestrator facts":

```markdown
## Auto-build mandate
- Default reply for bounded tasks: GO MERGE
- Architectural tasks: wait | proceed
- Base branch: main; working branch pattern: auto/<slug>
- Merge method: repository default; delete branch after merge: yes; wait for base CI: yes
- Check timeout: 45 minutes
- Research page budget per run without asking: 30 (free transports only above that)
- Unanswered questions: take the stated default; if none is safe, take the most reversible option and record it | wait
- Audit depth: scoped at Light, full at Full
- Design-change gaps from the audit: record as open items | wait
- Break-test: standard; never probe against <service>
- Queue: <path to a plan file, next unchecked item | issue label | directory> ; continuous | one per run
- Stop-list additions: <project-specific items, or "none">
```

Each line removes one reason to stop, and each trades something:

| Line                          | Stop it removes                                      | What it trades away                                           |
|-------------------------------|------------------------------------------------------|---------------------------------------------------------------|
| Default reply `GO MERGE`      | the Mandate wait for bounded tasks                   | the chance to correct a bounded design before it is built    |
| `Architectural tasks: proceed`| the Mandate wait for architectural tasks             | the one review that catches a wrong architecture before it costs a rebuild; the report says nobody approved |
| `Unanswered questions: ...`   | a stop for a question with no safe default           | the user's answer; the run picks the most reversible reading and names it in "Decisions made without asking" |
| `Design-change gaps: record`  | a stop when gap-audit finds a gap needing a design change | that gap stays open until the next run                   |
| `Queue: ...`                  | the "what next?" question on a bare invocation       | the user's choice of order; the queue's order is used         |
| `Queue: continuous`           | the stop between runs                                | the review of one run's report before the next one starts     |
| A large page budget           | the budget question                                  | metered credits                                               |

With this section present, a task that fits its lines presents the Mandate and proceeds without
waiting, citing the section. Record "proceeded under standing mandate" in the Stage 4 log line
so the report shows the user did not reply, and list every decision the lines made for them
under "Decisions made without asking".

**Stops no standing mandate removes**, so the user knows which ones to expect:

- the stop-list (section 3): scope beyond the task, invariants, data deletion, production,
  real services, force-push, gate bypass, foreign pull requests, budget overrun;
- a required human review or approval on the base branch's protection rules: only a person can
  give it; the run ends BLOCKED naming who. To avoid it, the protection must be satisfiable by
  checks alone;
- Research-Kit not `READY` when the task needs an external fact;
- a research project INCOMPLETE or BLOCKED; a unit that used both retries; a required check that
  cannot run from here; a secret found in the diff.

The section is the user's; auto-build never writes or edits it. Tell the user it exists as an
option when a run had to stop at Stage 4 unattended.

**Working-and-reporting block.** The section may also carry standing instructions on tone and
honesty (for example: label observed / inferred / assumed; "verified" only after running it;
lead with what went wrong; ask once and only for the stop-list; no reassurance or padding).
Auto-build applies them to every message and report of the run; they never loosen a rule in
this skill or a delegated one.

## 5. Saving `MANDATE.md`

Save the message as sent and the reply as received (verbatim, with timestamp) to
`MANDATE.md` in the run folder, and record the path and the reply token in the stage table. For
a run under a standing mandate, the "reply" section quotes the section it relied on. Every later
authorization in the run - a fix brief for a gap, the merge - cites this file.
