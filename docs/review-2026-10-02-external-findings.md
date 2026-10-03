# External review, 2026-10-02: findings register

One row per finding, with where it stands and the evidence that closes it, so a later pass is
a diff against this table rather than a re-reading of the conversation. The review came in
three rounds on 2026-10-02 and an audit of those rounds on 2026-10-03 (the audit was made on
MiMo 2.6 Pro). The audit's own first finding was that no such register existed: for a kit
whose thesis is an evidence ledger, the review had produced no ledger. This file is the
answer, and the rule for keeping it: a finding's status changes only with a commit named in
its evidence cell.

Status words: **fixed** (code or a decision closes it), **disclosed** (documented, by design
not changed), **open** (nothing landed; the cell says what would).

| # | Finding | Status | Evidence |
|---|---|---|---|
| F1 | The licence contradicted itself: "all rights reserved" beside an invitation to use the kit, and captured third-party pages shipped under the kit's own terms. | fixed | Decision project `docs/decisions/2026-10-02-licence-and-captured-pages` (1f43c32, preflight PASS, U-01..U-07 closed); the owner chose PolyForm Shield 1.0.0 (dc574a5, ADR-0130, PR #221): `LICENSE`, `NOTICE`, `REUSE.toml`, `LICENSES/LicenseRef-Captured-Page.txt`. |
| F2 | The gate fails open, and a repository-local `core.hooksPath` (husky, lefthook, simple-git-hooks, pre-commit) displaces the machine-wide hook silently; the installer never looked, and only `doctor` reported it, after the fact. | fixed | Disclosed on the front page first (d860e70, README "What the gate does not stop"). Install-time detection: `installCommitGate` probes its working directory and `install-hooks.mjs` reports the displacement with the remedy (b9efe05, ADR-0131; test "install-hooks reports a repository-local core.hooksPath that displaces the gate where it is run", `research-kit/test/doctor.test.mjs`). The fail-open default stands by ADR-0002, with `install-hooks.mjs --fail-closed`; a fail-closed posture in gated projects is named in ADR-0131 as a new ADR, not taken. |
| F3 | Suite latency: 1,480 tests, minutes per run, and the kit's own commit gate runs all of them on any change under `research-kit/`. | open | Measured, not changed. Full suite on the review container, fresh clone, Linux: 130-132 s on four runs of 2026-10-02 (1,477-1,480 tests), 189 s on one (1,481). The CI-equivalent gate (suite, preflight, examples, conformance, regeneration) 201 s. The kit repository's commit gate widens its watchdog to 1,500 s for the suite (`research-kit/githooks/pre-commit`); elsewhere the default is 120 s. The reviewer's Windows machine: the `collect` group alone 18.7 s. Tiering (a fast tier for the commit gate, the full suite in CI) changes what "a red suite stops work" means locally, so it is an ADR with a rejected alternative before any code. Not written. |
| F4 | Documentation weight: too many files, no stated order. | fixed | Reading map `docs/README.md` (d860e70), linked from the front page's Documentation section (6b7d3dc). |
| F5 | The fetch ledger is self-attested: a chain recomputed consistently by someone with write access verifies. | disclosed | README threat-model paragraph (d860e70): CI runs preflight on every commit, so a forged chain has to survive review. Anchoring to an external witness exists as the opt-in, lookup-only `--witness` (ADR-0106) and is not the default. |
| F6 | Synchronous collection throughput: pages are fetched one at a time. | open | No throughput number recorded anywhere; the measurement in `docs/measurement-2026-09-28.md` is about citation quality, not speed. The measurement to take before an ADR: one run of N pages through `firecrawl-cli` and one through `http-keyless`, wall time per page, against the vendor's documented rate limit. A concurrent fetcher is a feature under the freeze (ADR-0117). |
| F7 | The suite is red on a Windows machine without Developer Mode: `collect.test.mjs` creates a file symlink unguarded and `EPERM` reads as a failed test, which blocks every commit under `research-kit/` on that box. | fixed | `requireSymlink` in the test harness reports `SYMLINK-NOT-PERMITTED` as UNSUP (ADR-0108's bucket) at six sites in four files; seam `RESEARCH_KIT_TEST_NO_SYMLINK=1` (6b7d3dc, PR #222). That sweep grepped for the explicit `'file'` type and missed a seventh site that relied on the default, `hardening.test.mjs` deployedDrift's dangling link, which an architecture pass on the maintainer's Windows machine found red on 2026-10-03; guarded in the commit after fe528ae. Verified: `RESEARCH_KIT_TEST_NO_SYMLINK=1 node research-kit/bin/selftest.mjs collect` reads 122 passed, 0 failed, 1 unsupported. CI's Windows leg, which has the privilege, passed on the same commit. |
| F8 | `docs/README.md` was reachable only by guessing its path. | fixed | Linked from the README's Documentation section (6b7d3dc). |
| F9 | Break-test report on 05659a5 (external): environment prerequisites only, no source defect; the one accepted risk is the Firecrawl CLI's transitive dependencies. | disclosed | Recorded in the PR #215 thread; nothing to change in the tree. |

## From the audit of 2026-10-03

| # | Finding | Status | Evidence |
|---|---|---|---|
| A1 | No findings register on disk; status lived in the transcript. | fixed | This file. |
| A2 | Verification evidence was not beside the finding it closed. | fixed | The evidence column above names the commit, the test and the command for each row. |
| A3 | The auditor could not run the full suite in its environment, so "suite green" rested on CI. | disclosed | Every commit above passed the full suite twice before merging: once in the kit repository's own commit gate (ADR-0120, which blocks while red) and once in the fresh-clone gate whose timings F3 records, then seven CI jobs (suite, three platforms, two further Node lines, archive tree) on the pushed commit. The fresh-clone logs are on the review container, not in the repository; the CI runs are on GitHub under each PR. |
| A4 | ADR-0129's stop-on-exhaustion path is verified only through stubbed adapters, never against a real exhausted account. | open | True. `research-kit/test/collect.test.mjs` drives it with a stub that answers the vendor's exhaustion text. The day-one check when an account reaches zero: run `research.mjs` without `--fallback`, expect exit 2, the `stopped` summary line, and the uncollected rows in the results; the exhaustion text the stub answers with is the vendor's own, taken from Firecrawl's API and CLI source as captured in `docs/decisions/2026-09-28-fetch-fallback` (E-10, E-11), not from a run against a real exhausted account. |

What this register does not do: it does not re-litigate ADR-0002 (fail-open), ADR-0108
(UNSUP) or ADR-0129 (stop on exhaustion), which the review and the audit both closed as
the right defaults.
