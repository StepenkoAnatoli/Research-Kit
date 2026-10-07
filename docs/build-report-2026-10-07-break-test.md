# Break-test pass 7 - 2026-10-07

The seventh adversarial pass over the build and the suite, run on `arena/b5352aeb-research-kit`
at `9325f85` (kit 0.9.5). Procedure: the break-test skill, pinned-branch setup - this session is
fixed to one branch, so every probe and fix attempt ran in a throwaway clone under `/tmp/bt/`
and the checkout saw only the verified fix, as its own commit. Focus of this pass: the commit
gate end to end, the first run of a new project, file modes and permissions, and TMPDIR, path,
timezone, locale, git-context and concurrency variation. Three commits carry the pass: the
research corpus `9939ce0`, the fix `4619922`, and this report the commit that adds it. The
operator was asked how to handle the verified fix - report-only first, then, opening the pull
request, to land it as its own commit, which is what the branch holds.

Two notes on the procedure itself. The attached skill file never appeared in the workspace
(`/home/user/uploads/` does not exist and a filesystem search found no copy), so the procedure
used was the kit's shipped `research-kit/skills/break-test/SKILL.md` - the same skill, vendored
in the repository under test. And the nested research project lives at
`docs/decisions/2026-10-07-break-test-external-facts/`, which is this repository's convention
for a decision-grade project, rather than the skill's default `docs/research/`.

## Overview

- **Stack and gate.** Node ESM, no dependencies and no `package.json`. Gate:
  `node research-kit/bin/selftest.mjs` (1692 passed, 0 failed, 4 unsupported at the baseline;
  1693 with the fix, the new test; the README declares the four UNSUP counted), `preflight.mjs`
  PASS (0 blocking, 1 warning: `hygiene/brief-unstamped` on the kit's own corpus), `handoff.mjs`
  exit 0 (33 ledger entries, 27 evidence rows, chain verifies), `doctor.mjs` READY (kit 0.9.5)
  when the transport is declared. Source of truth for CI:
  `.github/workflows/offline-suite.yml`, seven jobs, whose aggregate `suite` check is the
  required one: selftest, preflight, the release example, the mjs<->py conformance runners,
  then `timeline.mjs` and `export-warc.mjs` must reproduce the committed bytes with an empty
  `git status --porcelain`.
- **Environment.** Linux container, 2 CPUs, 3939 MB, uid 1001 (not root), Node v22.22.3,
  git 2.39.5, Python 3.11.2, no Chromium or Chrome, only the locales `C`, `C.utf8` and `POSIX`,
  `unshare -n` refused ("Operation not permitted"), fd cap 1024. What this bounds: no
  Windows or macOS; the four browser LIVE tests cannot run (UNSUP, as intended); permission
  bits are enforced (not root); no locale beyond `C` can be exercised; the suite cannot be
  isolated from the network by a namespace.
- **Network.** This sandbox's egress reaches `github.com`, `api.github.com`,
  `codeload.github.com` and the npm registry, and nothing else, and it is TLS-inspected: the
  default store rejects the proxy's CA (`fetch failed (unable to verify the first
  certificate)`), and every network step in this pass needed
  `NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt`. That is why the research project's
  search lane could not run and its pages are named directly in `plan.json`.
- **Isolation.** Throwaway clones under `/tmp/bt/`: `c1` (probe target), `c2` (concurrency),
  `c4`/`c5` (gate), `c6` (repo-local `core.hooksPath`), `c7` (the file-mode control), `c8` (the
  fix). Nothing was installed into the machine: `doctor`, `install.mjs` and
  `install-hooks.mjs` ran with `RESEARCH_KIT_HOME`/`HOME` pointed at the checkout and scratch
  homes, and the pre-commit hook was executed directly instead of being registered.
- **Baseline.** Full suite in the clone and then in the real checkout: 1692 passed, 0 failed,
  4 unsupported (waived), `blocking 0`, exit 0, 124.6-131.4 s across about twenty full runs;
  the failure set is empty and no intermittent failure was seen on this host. The four UNSUP
  are `browser-transport`/`browser-guard` LIVE tests that need Chromium.
- **Fix commits.** On `arena/b5352aeb-research-kit`: the corpus `9939ce0`, F1 `4619922`, this
  report the commit that adds it. The fix commit stages `docs/ARCHITECTURE.md` with the
  `research-kit/` change, as the repository's own gate requires. CI on the pull
  request's first push (run 37621450447): `archive tree`, `node (24)`, `node (26)`,
  `platform (ubuntu-latest)` and `platform (ubuntu-26.04)` passed; `platform (windows-latest)`
  failed in the `selftest` step after 390 s - the defect under *Probe defects*, corrected by
  `8a2c0d3`. The rerun of the workflow at `f27b5e4`, run 37622653086, is green in all seven jobs,
  `platform (windows-latest)` included. The workflow runs again on every push, so for the head
  being read, the pull request's checks are the record rather than this line.
- **External facts.** The nested project `docs/decisions/2026-10-07-break-test-external-facts/`
  (doctor READY first, keyless transport, disclosed): three pages collected, 0 failed,
  `preflight.mjs` PASS (0 blocking, 9 warnings - keyless not metered x3, partial captures x3,
  single-voice corroboration x3), `brief.mjs` drafted and reviewed. Rows: **E-01** Node
  `doc/api/fs.md`, **E-02** libuv `deps/uv/src/fs.c`'s own documentation
  `deps/uv/docs/src/fs.rst`, **E-03** Node `doc/node.1`, each at the tag of the runtime in use
  (v22.22.0). `doc/node.1` carries the certificate-store fact because GitHub's viewer truncates
  the 116 KB `doc/api/cli.md` at "View remainder of file in raw view" before its
  environment-variable section.

## Findings

> **[F1] A deploy from a read-only source tree left a deployed kit that could not be updated:
> the next deploy died `EACCES` on its own output** (Medium, Possible)
> Repro (from the repository root of a clone, a kit source tree whose files are 0444; the unit
> form, which is also the regression test):
> `node research-kit/bin/selftest.mjs skill-set` - before the fix:
> `FAIL  skill-set > a second deploy over its own output survives a read-only source tree`
> `        EACCES: permission denied, copyfile '<from>/README.md' -> '<home>/research-kit/README.md'`
> `13 passed, 1 failed in 1.1s`
> Observed end to end as well: a full suite run from a clone whose tree had been made
> read-only reported `1688 passed, 4 failed`, the four `skill-set` tests named in `failed`;
> the control that made only the file modes read-only (no directory `chmod`) reproduced the
> same four (`9 passed, 4 failed`).
> Cause: `copyTree` deploys with `fs.copyFileSync`, and on POSIX a copied file's destination is
> created with the SOURCE file's mode, so a source tree whose files are 0444 writes 0444 files
> into the kit home; the copy also overwrites an existing destination by default (E-01, E-02),
> so the next deploy opens its own 0444 output for writing and gets `EACCES`. Neither Node's
> `fs.copyFile`/`fsPromises.copyFile` page nor libuv's `uv_fs_copyfile` page documents what
> permissions the destination receives (E-01, E-02): the propagation is measured here
> (0444 -> 0444, 644 -> 644, 600 -> 600 under umask 0022), not promised, so the fix sets the
> mode explicitly instead of relying on it.
> Action: Fixed, commit `4619922`. `research-kit/lib/installer.mjs` (a destination whose source
> file lacks the owner-write bit gets it; a destination an earlier deploy left read-only is made
> writable before the copy opens it; `githooks` keeps `HOOK_MODE`; the source's other bits are
> kept), `research-kit/test/skill-set.test.mjs` (the regression test: first deploy, second
> deploy, and a pre-existing 0444 destination), `research-kit/README.md` (the test count the
> suite itself checks, 1696 -> 1697), `docs/ARCHITECTURE.md` (one clause in the `installer.mjs`
> row, staged with the change as the repository's gate requires). The mode half is POSIX-scoped,
> matching the kit's existing mode handling - `HOOK_MODE` is POSIX-only for the same reason - so
> the Windows read-only attribute is not repaired by it, and is not claimed to be.
> Verification: red before, green after (`14 passed, 0 failed in 1.0s`); the
> pre-existing-destination half was red on its own (`13 passed, 1 failed`) before it was added;
> the full gate in the clone after the fix: `1693 passed, 0 failed, 4 unsupported (waived),
> blocking 0, exit 0, 128.7 s`, and again with the ARCHITECTURE clause `1693 / 0 / 4, exit 0,
> 128.5 s`; the full gate in the real checkout after applying the fix: `1693 passed, 0 failed,
> 4 unsupported (waived), blocking 0, exit 0, 138.9 s`. The failure set is identical to the
> baseline (empty), and the test count matches the README's claim - the suite caught that
> mismatch and named it.

## Applied fixes

| Commit | Finding | Files |
|---|---|---|
| `4619922` | F1 | `research-kit/lib/installer.mjs`, `research-kit/test/skill-set.test.mjs`, `research-kit/README.md`, `docs/ARCHITECTURE.md` |

## Rejected fixes

- The first cut of the F1 fix added the owner-write bit only *after* the copy. It removed the
  failure the probes found but not the state an earlier (unfixed) deploy leaves behind: with a
  0444 file already in the deployed home, the copy dies before the `chmod` can run. The new
  assertion for that state failed against that cut (`13 passed, 1 failed`, the same `EACCES`);
  the fix was extended so the bit is restored before the copy as well, and then passed. No
  check was weakened at any point.

## Remaining risks

1. **The kit never names `NODE_EXTRA_CA_CERTS`** (Low, Possible). On a machine whose egress is
   TLS-inspected - this sandbox is one - the keyless transport reports
   `fetch failed (unable to verify the first certificate)`. The message names the cause (a
   2026-09-30 fix, ADR-0047) but not the remedy, and neither `research-kit/README.md` nor
   `QUICKSTART.md` mentions the variable, which the runtime documents as extending the
   well-known roots and being read only when the process is first launched (E-03). Decision
   needed: add one line naming it where the collector reports the failure, or in the README.
   Not reproduced as a failure - the message is already correct and non-bare - so this is a
   recommendation, and its fact is cited rather than recalled.
2. **`docs/README.md` does not index six dated reports** (Low, Unlikely; hygiene): the three
   `2026-09-17` build reports, `build-report-2026-09-29-break-test.md`,
   `review-2026-10-02-external-findings.md` and `review-2026-10-06-handoff-audit.md` - and now
   this report too. Every link the map carries resolves (`missing links: 0`) and no test
   enforces completeness, so this is hygiene, not a failure. Decision needed: index them, or
   accept the map as partial.
3. **The browser lane is unverified on this host** (Low). Four LIVE tests are UNSUP (no
   Chromium); CI's browser job is their coverage. Pass 6's F2 - the operator's PC failing
   about one full run in three - could not be re-probed here and stays open.

## Probe defects

- **The regression test itself - CI's Windows job found it, this host could not.** The first
  version of the new test ran its two `0444` assertions on every platform while the fix is
  POSIX-scoped: on Windows a deployed file carrying the read-only attribute is not repaired, so
  the assertions failed. `platform (windows-latest)` failed the `selftest` step after 390 s and
  blocked the pull request. Corrected in `8a2c0d3`: both clauses sit behind `posix`, the plain
  deploy-twice half runs everywhere, and the reason is in the test's comment. Worth recording
  rather than tidying away: an unguarded mode assertion passes on the host that wrote it and is
  found by the one platform the change does not cover. The rerun at `f27b5e4` is green in all
  seven jobs, so the guard is verified on the platform that found the defect.
- **`minimal-env` (A).** `env -i` dropped `RESEARCH_KIT_ALLOW_UNSUP=1`, so the run exited 1
  with 0 failures - the suite's documented "every test passed and the runner still exited N"
  case. Read from the result file, not reported as a product failure.
- **`python-absent` / `python-absent-control` (B).** The "control" set the same python-less
  `PATH` as the probe, so both runs were identical (19 passed, 0 failed, 18 unsupported). The
  real control is the same subset on the normal `PATH`: 37 passed, 0 failed in 4.2 s. A
  Python-less machine is UNSUP by design, not red.
- **`epipe` (B).** The full suite piped to `head -5` exited 1 with empty stderr. The probe
  omitted `RESEARCH_KIT_ALLOW_UNSUP=1`; the discriminator (`probes/epipe-disc.meta`, with the
  variable set and a result file) gives `suite_exit=0`, `pipeline_exit=0`, 1692/0/4 waived,
  129 s - a closed stdout is handled (EPIPE tolerance landed 2026-09-28/2026-10-01) and no
  failure was hidden. The first discriminator script also recorded nothing because an
  assignment resets bash's `PIPESTATUS`; the rerun captured it correctly.
- **`readonly-cwd` (A).** The probe's own `chmod -R a-w` made the kit's SOURCE files read-only,
  so its four `skill-set` failures were partly manufactured - but the mechanism is F1. The
  clean control (`c7`: file modes only, no directory `chmod`) reproduces the same four, and the
  regression test reproduces the copy error exactly. The probe's exit 1 is not reported as a
  product failure.
- **`builder-refusal` (D).** The probe set `RESEARCH_KIT_ROLE=builder`, an environment variable
  the kit does not have (the role lives in the machine config, written by
  `install-hooks.mjs --role`). Both its commands exited 0, and a real collect on that machine
  fetched normally. Corrected twice - first the variable, then the config path, since with
  `RESEARCH_KIT_HOME` set the config is looked up beside the kit home, so `RESEARCH_KIT_CONFIG`
  must name the file. The refusal is designed and does fire, exit 2, before any fetch:
  `refused: this machine is declared role=builder, which does not collect.`
- **`gate-edit` (C).** The probe expected a block for a staged path under `research-kit/lib/`.
  The edit gate applies no architecture-map rule by design (`lib/gate.mjs`: the map breach is
  computed only when `gate === 'commit'`); its job is phase-1 edit blocking. A null result,
  not a kit defect.

## Probes run

Commands are from the repository root of a clone unless noted; every full suite carries
`RESEARCH_KIT_RESULT_FILE` and `RESEARCH_KIT_ALLOW_UNSUP=1`.

| # | Probe | Command | Result |
|---|---|---|---|
| 1 | Baseline x2 | `node research-kit/bin/selftest.mjs` (clone, then the real checkout) | 1692/0/4, exit 0, 124.6-131.4 s; failure set empty |
| 2 | Timezone | `TZ=Pacific/Kiritimati` / `TZ=Etc/GMT+12` | 1692/0/4, 130.9 s / 128.4 s |
| 3 | Locale | `LC_ALL=C LANG=C` | 1692/0/4, 131.3 s |
| 4 | Git config contexts | `GIT_CONFIG_GLOBAL=<branch / gpgsign config>`, `GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_SYSTEM=/dev/null` | 1692/0/4 x3, 125.7-128.9 s |
| 5 | Leaked git context | `GIT_DIR=.git GIT_WORK_TREE=. GIT_INDEX_FILE=... GIT_PREFIX=` | 1692/0/4; stderr: `GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, GIT_PREFIX found in the environment and removed for this run.` |
| 6 | File descriptors | `ulimit -n 256` | 1692/0/4, 125.8 s |
| 7 | TMPDIR with a space | `TMPDIR='/tmp/bt/tmp dir'` | 1692/0/4, 131.4 s |
| 8 | Unusable TMPDIR | `TMPDIR=/nonexistent-tmp` | exit 1, 725/871 in 32.4 s, the designed one-cause diagnostic (EACCES) - null |
| 9 | Derived files | `timeline.mjs && export-warc.mjs && git status --porcelain` | `TIMELINE.md (60 events)`, `55 records (27 captures)`, porcelain unchanged |
| 10 | Leftovers | `git status --porcelain --ignored` before/after a full run | 2 before, 2 after, both ignored (`research-corpus.warc.gz`, `research-kit/bin/__pycache__/`) |
| 11 | Path with a space | `cp -a <clone> '/tmp/bt/path with space'`, suite there | 1692/0/4, 131.6 s |
| 12 | Symlinked cwd | `cd /tmp/bt/link1` (symlink to the clone) | 1692/0/4, 130.1 s |
| 13 | Two suites at once | two suites in one clone | `exits 0 0`, 138.9 s / 139.1 s |
| 14 | Kill mid-run | SIGKILL mid-suite, then rerun | leftovers only the ignored `__pycache__`; rerun exit 0 |
| 15 | Unwritable result file | `RESEARCH_KIT_RESULT_FILE=/nonexistent-dir/x.json` | exit 2, the documented warning (the suite result is authoritative) |
| 16 | Python absent | `PATH=<no python> ... selftest.mjs conformance canonical-float` | 19/0/18 waived - UNSUP, not red |
| 17 | Python control | the same subset on the normal `PATH` | 37 passed, 0 failed, 4.2 s |
| 18 | Closed stdout | full suite `\| head -5` | probe defect (missing `ALLOW_UNSUP`); corrected: suite exit 0, 129 s |
| 19 | Gate, docs only | `sh research-kit/githooks/pre-commit` with only `docs/.probe-note` staged | `research gate: allow - the gate passes`, hook exit 0, instant (no suite) |
| 20 | Gate, suite owed | same hook, `research-kit/README.md` staged index-only | stderr announces the suite runs (ADR-0120); 129 s; allow; hook exit 0 |
| 21 | Gate, red control | same hook with a staged failing test | hook exit 1; stderr names the rule and both overrides |
| 22 | Gate posture | `gate.mjs --posture`; `--staged research-kit/README.md --json` | `fail-open (config absent)` exit 0; `verdict pass`, allow true (the suite ran, 136 s) |
| 23 | Edit gate | `gate.mjs --gate edit --staged research-kit/lib/core.mjs` | allow - by design (see probe defects) |
| 24 | Repo-local hooksPath | clone with `core.hooksPath=/tmp/bt/nohooks`, doctor | reported: `gate-local-override ... displaces the machine-wide gate (husky, lefthook, simple-git-hooks and pre-commit all do this)` |
| 25 | Doctor, keyless | `HOME=<scratch with http-keyless>` `doctor.mjs` | `READY [role=collector, kit 0.9.5]`, exit 0 |
| 26 | Doctor, default HOME | `doctor.mjs` | exit 1: the by-design `firecrawl-cli` blocker for a collector that chose nothing |
| 27 | Builder machine | corrected: machine config `{"role":"builder"}` via `RESEARCH_KIT_CONFIG`, then a real collect | `refused: this machine is declared role=builder, which does not collect.` exit 2, no fetch |
| 28 | Install dry run | `install.mjs --dry-run` into a scratch home | `would prune: (nothing)`, exit 0, wrote nothing |
| 29 | First run of a project | `new-project.mjs . && decompose.mjs && preflight.mjs` in a scratch dir | 13 written / 0 kept / 0 repaired; preflight FAIL as designed (no evidence yet) |
| 30 | Docs index | links in `docs/README.md`; dated reports present but unindexed | `missing links: 0`; 6 unindexed (see risk 2) |
| 31 | External facts | the nested project: `research.mjs --dry-run`, `research.mjs`, `preflight.mjs`, `brief.mjs` | 3 collected / 0 failed / 3 spent; PASS 0 blocking, 9 warnings; brief drafted |
| 32 | F1 red-first | `selftest.mjs skill-set` in `c8` before/after | 13 passed/1 failed, then 14 passed/0 failed |
| 33 | F1 full gate | `selftest.mjs` in `c8` after the fix | 1693/0/4 waived, exit 0, 128.7 s and 128.5 s |
| 34 | Final gate | `selftest.mjs` in the real checkout, fix applied, corpus present | 1693/0/4, exit 0, 138.9 s |

## Not probed

- **Windows and macOS.** No host here; CI's `windows-latest` job is the only Windows run. The
  kit's Windows-specific paths (`HOOK_MODE`, `chmod` guards) were exercised only through tests
  that skip on POSIX. F1's analogous
  Windows case - a deploy whose source or destination carries the read-only attribute - was not
  reproduced, and the fix does not cover it; the test's `0444` clauses are POSIX-only for
  exactly that reason.
- **Root-only and container-as-root permission semantics.** uid 1001, so permission bits are
  enforced - good for F1, but a root-running deployment was not covered.
- **Network-off isolation.** `unshare -n true` is refused in this sandbox, so the suite was not
  run with no network; the failures that a network-dependent test would show were not induced
  this way. The egress that *is* available was restricted by policy, not by the probe.
- **Locales other than `C`.** Only `C`, `C.utf8` and `POSIX` exist here; `LC_ALL=C` was the one
  probe possible.
- **The browser LIVE tests.** Four UNSUP (no Chromium); pass 6's F2 cannot be re-probed here.
- **The metered transport (Firecrawl CLI).** No key and no credits in this sandbox, and the
  skill forbids reaching paid services without consent; the collector ran keyless throughout.
  The vendor's failure text is covered by the kit's own tests.
- **A real machine-wide install** (global `core.hooksPath`, `~/.claude/settings.json`). The
  skill forbids modifying the machine, so `install`/`install-hooks` ran with `HOME`,
  `RESEARCH_KIT_HOME` and `RESEARCH_KIT_CONFIG` pointed at scratch paths, and the hook itself
  was executed directly.
- **CRLF-corrected corpora and `core.autocrlf`.** Probed in pass 6 and untouched by anything
  this pass changed; not re-run.
- **Repetition for flakiness beyond the runs recorded here.** Each probe ran one full suite;
  about twenty full runs were executed in total, and none failed or differed, but no dedicated
  N-runs-of-one-test programme was run.

## Summary

The build is green and stable on this host: about twenty full-suite runs across timezone,
locale, git-context, path, symlink, file-descriptor, TMPDIR and concurrency probes all ended
with an empty failure set, and the four UNSUP are the browser LIVE tests that need a browser
this host does not have. One real defect was found and fixed: a deploy from a read-only source
tree left a deployed kit that could not be updated, because the copy carries the source mode
and overwrites by default - neither behaviour is documented (E-01, E-02) - and the fix sets the
mode explicitly rather than trusting that, in `4619922`, with the full gate green in the clone
and in the checkout. The fix is POSIX-scoped, and the one Windows-side regression the pull
request's CI caught - an unguarded assertion in the new test, not the fix itself - is corrected
in `8a2c0d3`. The decisions that remain are small: whether to name
`NODE_EXTRA_CA_CERTS` where the collector reports an unverifiable certificate, and whether to
index the six dated reports the reading map omits. Review: `git show 4619922` and
`docs/decisions/2026-10-07-break-test-external-facts/research/` for the external facts.
