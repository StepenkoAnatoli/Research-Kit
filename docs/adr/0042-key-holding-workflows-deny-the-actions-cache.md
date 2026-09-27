# ADR-0042 — Key-holding workflows deny the Actions cache; execution protections are the operator's

- **Date:** 2026-09-26
- **Status:** accepted
- **Area:** CI, workflows, credentials
- **Depends on:** ADR-0033 (the collector refuses rather than degrades), ADR-0041 (setup-node's cache off)
- **Evidence:** [`docs/decisions/2026-09-26-actions-sept-changes/research/BRIEF.md`](../decisions/2026-09-26-actions-sept-changes/research/BRIEF.md)

## Context

GitHub shipped four Actions changes in September 2026. Two reach this repository's paid
workflows, `collect.yml` and `live-collection.yml`, whose jobs can read an API key:

- **`cache-mode`** (2026-09-10, E-04, E-06). A workflow or job declares `read`, `write`,
  `write-only` or `none`; omitted, the default follows the trigger, and both paid workflows log
  `Cache mode: write`. Neither uses a cache, so a path between runs of a credential-holding job
  is open for nothing.
- **Workflow execution protections** (2026-09-17, E-03). An allowlist of actors and events, now
  scopable per workflow file - a repository setting, with a REST API, not workflow syntax.

The other two - run query counts (E-01) and expired artifacts leaving the API (E-02) - reach
no call the kit makes, or none whose behaviour changes: `dispatch.mjs` never lists runs, and
already drops expired artifacts and maps `410` to EXPIRED.

## Decision

**Both paid workflows declare `cache-mode: none` at the top level**, pinned by an offline test
that also refuses a job-level override re-opening the cache. Top level, so a job added later
inherits it. It costs nothing: a denied cache operation "logs an informational message and
continues", and the job does not fail (E-06).

**Execution protections are recommended to the operator, not encoded here**: a rule scoped to
the two paid workflows, allowing the repository owner as actor and `workflow_dispatch` as
event, set under Settings > Actions > Policies by a repository administrator. `collect-remote`
dispatches as the operator through `workflow_dispatch`, so it passes.

_Corrected 2026-09-26:_ this paragraph first said "in evaluate mode before enforcing". Evaluate
mode is GitHub Enterprise Cloud only (E-07 of the evidence project), so on this repository the
rule is active as soon as it is saved. The recommendation is unchanged; only the way to apply it
was wrong. It also cannot be applied from an agent session: the Actions policies API needs the
Administration permission, and this environment's GitHub proxy refuses `/actions/policies`.

## Rejected alternatives

- **Replace the ADR-0033 marker check with an execution-protection rule.** They answer
  different questions. The rule limits who and what may *start* a run; the marker refuses a
  run whose environment GitHub auto-created, which an actor allowlist cannot see. Both stay.
- **Per-job `cache-mode`.** `collect.yml` has two jobs, and the property that matters - no job
  in this file touches the cache - is a file-level one.
- **Extend it to `offline-suite.yml`.** It holds no credential; the reason for denying the
  cache does not apply there.
- **Change `dispatch.mjs` for expired artifacts.** It is correct whichever way the open
  question (U-2) falls; its empty-list message already names both causes.

## Consequences

- A paid run's log reads `Cache mode: none` instead of `write`.
- Adding a cache to either paid workflow now means removing a line a test guards, and saying
  why - which is the point.

## Trigger that would reopen this

A paid workflow that genuinely needs a cache (then scope it to `read` for that job, with a
reason); GitHub changing what `none` does to a denied step; or execution protections gaining
a condition on the environment, which would make them a candidate to back the marker check.
Day-one check for U-2: on or after 2026-10-04, list the artifacts of run 36276028270.
