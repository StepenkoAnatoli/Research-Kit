# Brief - GitHub Actions changes September 2026: workflow run query results, expired artifacts API, workflow execution protections, cache-mode

_Auto-drafted 2026-09-26 by `bin/brief.mjs` from the corpus. Sections marked **TODO**
require human/agent judgement; everything else is assembled from evidence already
in `research/`. While a **TODO** remains, this brief is **not reviewed** and the
handoff is **not approved** - a structurally valid corpus, a reviewed one, and an
approved handoff are three different states._

**This is the phase-1 to phase-2 handoff.** **Gate: PASS.** Every blocking unknown is closed with evidence, and every claim below
traces to a cached page in `research/raw/`.

Whoever you are - another agent, a different model, or a person - read this file
first. You should not need to re-research anything to start work. If something
here is not enough to build from, say which fact is missing rather than guessing
it: that is a phase-1 gap to close, not a phase-2 judgment call.

## The prior, registered before anything was collected

_Ledger seq 1, chained: neither this text nor its place before the evidence
can be changed now. Read it against the findings below - it may well be wrong, and a wrong
prior that was recorded in advance is worth more than a right one remembered afterwards._

> Expect the Sep 25 query-results change to concern listing and filtering workflow runs, which this kit never does (dispatch.mjs takes the run id from the dispatch response), so no effect. Expect the Sep 24 change to make the list-artifacts endpoint omit expired artifacts: dispatch.mjs already filters expired and its message already names both causes, so the kit stays correct but loses the ability to say which cause applied. Expect workflow execution protections to restrict which events or actors may start workflows - possibly a native complement to ADR-0033, not a replacement. Expect cache-mode to let a job declare read, write or none, with write the default - so the two key-holding jobs could say none. Cannot know yet: whether download of an expired artifact still returns 410.

## Intent

GitHub shipped four Actions changes between 2026-09-10 and 2026-09-25 that name surfaces this
kit uses: run query results (Sep 25), expired artifacts in the UI and API (Sep 24), workflow
execution protections (Sep 17) and cache-mode (Sep 10). The kit drives Actions from outside
through `lib/dispatch.mjs` and `bin/collect-remote.mjs` - dispatch with `return_run_details`,
GET one run, list that run's artifacts, download one - and runs two workflows that hold API keys.

"Done" is, for each change, a yes or no on whether it reaches a call or a job in this repository,
and for each yes, the smallest change that keeps the kit correct - or the reason none is needed.

## What we verified

| Claim | Source | Type |
|---|---|---|
| Only LISTING workflow runs changed: "Queries for workflow runs in the GitHub Actions API and UI now return a less precise but more accurate count of records when you search by workflow, event, status, branch, or actor ... if the number of found records exceeds 2,500, we will report '2,500+'". Pagination stays at up to 1,000 items. Nothing is said about getting one run by id | E-01 `github.blog` | P |
| Workflow execution protections are GA: "an allowlist that controls who can trigger an Actions workflow and what events can start it" - actor rules and event rules, now scopable to specific workflow files, with an evaluate (shadow) mode and a REST API. New default for public repositories: a rule disabling `pull_request_target`, enforced from November 2, 2026 for repositories on the default policy | E-03 `github.blog` | P |
| `cache-mode` is GA on all plans: `read` (restore only; the default for low-trust events such as `pull_request_target`), `write` (restore and save; the default for trusted events such as `push`), `write-only`, and `none` ("prevents all cache access"). Job-level overrides workflow-level; enforced by the cache service | E-04 `github.blog` | P |

## Contradictions and how they were resolved

**The changelog and the REST reference disagree about expired artifacts.** E-02 (2026-09-24)
says expired artifacts are "no longer ... returned by the REST API". E-05, the artifacts
reference fetched two days later, still shows an `expired` field in every example and
documents no change - including for "List workflow run artifacts", the endpoint the kit calls.
Trusted: E-02, for the endpoints it names ("list artifacts for a repository", "get an
artifact"), because it announces a change and E-05 shows no sign of having been edited for it
(its examples still carry the field the post says is gone). Neither source settles the per-run list: E-02 does not name it and E-05
documents nothing new. That is U-2, left KNOWN-UNKNOWN with a dated day-one check, and it does
not matter to the kit's correctness either way (below).

**The changelog and the how-to disagree about evaluate mode** (added 2026-09-26). E-03 says
"Evaluate mode also carries over from the preview, so you can run rules in shadow mode", with
no plan named. E-07, GitHub's how-to, qualifies it: "If you select **Evaluate** (GitHub
Enterprise Cloud only)". Trusted: E-07, because it is the more specific statement and the
reference a person follows to set the rule up. This corrected the first version of this brief,
which advised evaluate mode first - a mode this repository cannot select.

## How the prior held

Right on all four shapes, short on two details. U-1: listing only, never touched - as
predicted. U-2: the post names the repository-level list and "get an artifact", not the
per-run list the prior assumed it would name; `dispatch.mjs` stays correct either way, as
predicted, and the documented download answer for an expired artifact is still `410 Gone`
(E-05; documented, not measured). U-3: a complement to ADR-0033, not a replacement - as
predicted. U-4: the prior had "write the default"; the default depends on the trigger (`write`
for trusted events, `read` for low-trust ones), and there is a fourth value, `write-only`.

## Known unknowns

- **U-2** - Since 2026-09-24, does listing a run's artifacts omit expired ones, and what does downloading an expired artifact return?
  - Day-one verification: E-02, E-05. Established: the repository-level list and "get an artifact" no longer return expired artifacts, and downloading one is documented as `410 Gone`, which `downloadArtifact` already maps to EXPIRED. NOT established: whether "List workflow run artifacts" - the endpoint `listArtifacts` calls - omits them too; the post does not name it and the reference (E-05) documents no change. Either way the kit stays correct: `dispatch.mjs` already drops `expired` artifacts and its empty-list message names both causes ("the run produced no package, or its artifact has expired"). Day-one verification: on or after 2026-10-04, call `GET /repos/StepenkoAnatoli/Research-Kit/actions/runs/36276028270/artifacts` - that run (collect job-0926cli, 2026-09-26) uploaded artifact 10916742654 with 7-day retention. Absent from the list = the per-run list omits expired artifacts too

## Decision

**Build: declare `cache-mode: none` at the top of `collect.yml` and `live-collection.yml`,**
the two workflows that can read an API key, and pin it with an offline test. Neither uses a
cache (setup-node's has been off since ADR-0041), so it costs nothing; a denied cache
operation "logs an informational message and continues" (E-06), so a cache step added later
cannot fail a paid run; and it closes the cache as a path between runs of a job holding a
credential - which both jobs leave open today (`Cache mode: write`, the trusted-trigger
default). Top level rather than per job: `collect.yml` has two jobs, and a job added later
inherits it. `offline-suite.yml` holds no secret and is out of scope.

**No code change for U-1 or U-2.** The kit never lists runs; it takes the run id from the
dispatch response (ADR-0031). `listArtifacts` already drops `expired` artifacts, its
empty-list message already names both causes, and `downloadArtifact` already maps `410` to
EXPIRED - whichever way U-2 falls.

**For the operator, not the code: a workflow execution protection rule** (U-3), scoped to
`collect.yml` and `live-collection.yml`, allowing the repository owner as actor and
`workflow_dispatch` as event: Settings > Actions > Policies, as a repository administrator
(E-07). It is active as soon as it is saved - evaluate mode is GitHub Enterprise Cloud only,
so this repository has no shadow run to try it in (corrected 2026-09-26; this paragraph first
said "in evaluate mode first"). `collect-remote`
dispatches as the operator through `workflow_dispatch`, so it passes. It is a repository
setting, so it cannot live in this repository, and it complements ADR-0033 rather than
replacing it: the rule limits who and what may START a run; the marker variable refuses a run
whose environment GitHub auto-created. Rejected: dropping the marker check in favour of the
rule - an allowlist says nothing about whether `research-collection` exists.

First build step: add `cache-mode: none` after `permissions:` in both workflows, with a test
that fails when either file loses it; run the offline suite; then one dispatch of
`live-collection.yml`, whose log should read `Cache mode: none`.

## Next steps

1. Reviewed 2026-09-26; no **TODO** remains.
2. Hand this file to the builder (phase 2). Re-running `node bin/brief.mjs`
   after edits will refuse without `--force` so your judgements are preserved.
