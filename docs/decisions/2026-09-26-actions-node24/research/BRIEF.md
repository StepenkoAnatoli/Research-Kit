# Brief - Moving this repository's pinned GitHub Actions off the deprecated Node 20 runtime

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

> Expect: the GitHub changelog says Node 24 became the default runtime for JavaScript actions in 2026 with Node 20 removed later that year, so forcing is temporary and moving is overdue. Expect the latest majors (checkout v7, setup-node v7, setup-python v7, upload-artifact v7) to be safe here: their breaking changes concern pull_request_target, package-manager caching and ESM internals, none of which this repository uses - except setup-node caching, which I expect to be inert with no package.json but worth disabling explicitly. Expect runner minimum v2.327.1, met by hosted runners. Cannot know yet: the exact removal date, and whether upload-artifact v5-v7 changed anything collect.yml relies on (retention-days, include-hidden-files, overwrite, the zip digest).

## Intent

Every workflow run in this repository warns: "Node.js 20 is deprecated. The following actions
target Node.js 20 but are being forced to run on Node.js 24" - naming `actions/checkout`,
`actions/setup-node`, `actions/setup-python` and `actions/upload-artifact`, pinned by commit in
`offline-suite.yml`, `collect.yml` and `live-collection.yml` since 2026-09-21. They work only
because the runner forces a newer runtime; if that stops, CI and both collection workflows stop
together. Which release of each action runs on Node 24 was read from git at each exact commit,
before collecting (`action.yml` `runs.using`), and is recorded in the brief as a measurement.

"Done" is a pin per action - a release on `node24`, as a full commit SHA with its tag - that the
three workflows can move to without behaving differently, and the reason each breaking change
between our pins and those releases does or does not reach this repository.

## What we verified

| Claim | Source | Type |
|---|---|---|
| Node 20 is gone, not deprecated: "This is the final notification that Node 20 is no longer available on GitHub Actions runners. Runners now use Node 24 for JavaScript actions. The temporary `ACTIONS_ALLOW_USE_UNSECURE_NODE_VERSION` opt-out is no longer available." Users: "update to the latest versions of those actions that support Node 24"; "The newest versions of all first-party actions were updated to use Node 24" | E-07 `github.blog` (U-1) | P |
| `actions/checkout` README, per major. v5: "Updated to the node24 runtime", requiring Actions Runner v2.327.1. v6: `persist-credentials` now stores credentials "in a separate file under `$RUNNER_TEMP` instead of directly in `.git/config`" - "No workflow changes required" (authenticated git from a Docker container action needs runner v2.329.0). v7: refuses fork pull-request code by default under `pull_request_target` or `workflow_run` (opt back in with `allow-unsafe-pr-checkout: true`), and migrates to ESM | E-02 `github.com` (U-2, U-4) | P |
| `actions/setup-node` README, per major. V5: "Upgraded action from node20 to node24" (runner v2.327.1+), and "Enabled caching by default with package manager detection if no cache input is provided" - with the vendor's own advice: "For workflows with elevated privileges or access to sensitive information, we recommend disabling automatic caching by setting `package-manager-cache: false`". V6: npm caching is automatic when `package.json` names npm via `packageManager` or `devEngines.packageManager`; `always-auth` input removed. V7: ESM, and the dummy `NODE_AUTH_TOKEN` fallback removed (matters only with `registry-url`) | E-03 `github.com` (U-3) | P |

## Contradictions and how they were resolved

**The dates moved three times, and only the latest counts.** E-01, the September 2025 notice,
carries editor's notes moving the Node 24 default to "June of 2026", then "June 16th, 2026", and
the Node 20 removal to "September 23rd, 2026". E-07, dated 2026-09-23, reports the removal as
done. They do not disagree; E-01 is a document edited in place, and E-07 is the event. Trusted:
E-07, because it is later and it reports an outcome rather than a plan.

**Prose versus code.** Every "which major is node24" claim above comes from maintainers' prose.
It was checked against the code instead of trusted: `runs.using` read from `action.yml` at each
exact commit (below). They agree, including the one trap the prose flags itself - upload-artifact
v5 advertises Node 24 support but its `action.yml` still says `node20`.

## Measured from git, not cited

`git fetch --depth 1` of each action at each ref, then `action.yml` and the object type read
directly. Free, and repeatable by anyone with git.

| Action | Our pin (2026-09-21) | runs.using | First node24 | Target | Target commit (type) | runs.using |
|---|---|---|---|---|---|---|
| checkout | `11d5960a…` "v4" | node20 | v5.0.0 | **v7.0.1** | `3d3c42e5aac5ba805825da76410c181273ba90b1` (commit) | node24 |
| setup-node | `49933ea5…` "v4" | node20 | v5.0.0 | **v7.0.0** | `820762786026740c76f36085b0efc47a31fe5020` (commit) | node24 |
| setup-python | `a26af69b…` "v5" | node20 | v6.0.0 | **v7.0.0** | `5fda3b95a4ea91299a34e894583c3862153e4b97` (commit) | node24 |
| upload-artifact | `ea165f8d…` "v4" | node20 | v6.0.0 (v5.0.0 is still node20) | **v7.0.1** | `043fb46d1a93c77aae656e7c1c64a875d1fc6a0a` (commit) | node24 |

setup-node v7's `action.yml` declares `package-manager-cache` with `default: true`. The hosted
runner that ran live-collection run 36276869434 logged `Current runner version: '2.337.0'`, image
`ubuntu-24.04` - past every minimum above (v2.327.1).

## How the prior held

Right on the shape, wrong on one fact that mattered. Node 20's removal was already done (E-07,
2026-09-23), so "moving is overdue" understated it - these actions have been running on a
runtime they were never released for. The v7 majors are safe here, as predicted; the one thing
the prior could not know resolved harmlessly - upload-artifact v5-v7 changed nothing collect.yml
relies on (`archive` is opt-in; retention, hidden files and overwrite are untouched).

## Known unknowns

None. Every blocking unknown was closed with primary-source evidence.

## Decision

**Pin all four to their latest v7 release, by commit, in all three workflows.** The latest
rather than the first node24 major: every intermediate breaking change was checked against this
repository and none reaches it (U-2), the latest carries the dependency and security fixes, and
two majors of runway beat zero. Rejected: stopping at the first node24 majors (v5/v5/v6/v6) - it
is the same review for less runway and fewer fixes.

**And set `package-manager-cache: false` on setup-node in `collect.yml` and
`live-collection.yml`**, which hold API keys. Inert today (no `package.json`), but the vendor
recommends it for exactly these workflows, and it keeps a manifest added later from turning a
cache on in a job that can read a credential. `offline-suite.yml` holds no secret and is left
at the default.

First build step: replace the four `uses:` lines (eight occurrences) with the target commits
above, keeping the `# vN, resolved <date>` comment convention; add the input; run the offline
suite; then one run of each collection workflow, which is the only thing that exercises
checkout, setup-node and upload-artifact end to end.

Out of scope: `ubuntu-latest` moving to Ubuntu 26.04 between 2026-10-19 and 2026-11-19 (E-08) -
real, found here, and a separate task.

## Next steps

1. Reviewed 2026-09-26; no **TODO** remains.
2. Hand this file to the builder (phase 2). Re-running `node bin/brief.mjs`
   after edits will refuse without `--force` so your judgements are preserved.
