# Break-test Run 2 — re-probe, fix, PR, 2026-10-01

> Run 2 of a two-run break test. Run 1 is
> [`build-report-2026-10-01-break-test-run1.md`](build-report-2026-10-01-break-test-run1.md)
> and changed nothing. This run re-verified Run 1, probed what Run 1 did not touch, swept
> for siblings, applied one fix, and opened a draft pull request.

## 1. Project and build overview, and what changed since Run 1

Unchanged stack and CI steps — see Run 1 §1. Baseline re-run at the start of Run 2 as
**two suites at once** (which also re-verifies the prior pass's concurrency probe):

```
run A exit=0   1430 passed, 0 failed, 2 unsupported in 82.2s
run B exit=0   1430 passed, 0 failed, 2 unsupported in 82.0s
```

Identical to Run 1's baseline. Since then the tree carries exactly two commits, listed in
§9. Test count moved **1430 → 1431** because one regression test was added; the suite
enforces its own documented count against `research-kit/README.md`, which was updated in
the same commit.

## 2. Run 1 findings re-verified

| id | title | Run 1 status | Run 2 status |
|---|---|---|---|
| F-1-1 | `install-hooks --dry-run` promises gates the real run refuses to install | proposed | **still reproduces, then applied** in `95e63de`. Re-reproduced first on a fresh `mktemp -d` HOME: dry-run exit 0 with two "would ..." lines, real run exit 1 with two "not deployed" lines. Severity unchanged (Medium / Plausible) |

Run 1 recorded exactly one confirmed defect. Nothing was upgraded or downgraded.

Prior-pass findings re-checked in Run 1 and re-checked again here where the fix touched
them: `deploy({ dryRun })` prune parity (`would prune: (nothing)` both before and after a
real install) still holds; the interrupted-run cleanup still holds (SIGINT → exit 130,
`0` scratch dirs counted after the process exited).

## 3. New in Run 2

### Probes from areas Run 1 marked `not probed`

| Probe | Label | Result |
|---|---|---|
| Two suites running at once | RAN | **green** — `1430 passed, 0 failed` ×2, both exit 0, same second |
| Shallow clone `--depth 1` (what `actions/checkout` makes) | RAN | **green** — `1430 passed, 0 failed, 2 unsupported in 76.5s` |
| `umask 077` + `ulimit -n 64` together | RAN | **green** — `142 passed, 0 failed` over doctor/scaffold/gate/handoff |
| `TMPDIR` relative | RAN | **green** — `74 passed, 0 failed` |
| `TMPDIR` naming a folder that does not exist yet | RAN | **green** — `54 passed, 0 failed` |
| `TMPDIR` naming a regular FILE | RAN | **not a defect** — `2 passed, 52 failed`, and that is the designed diagnosis: the run opens with "the temp folder /tmp/bt/afile cannot be used (EEXIST) … Point TMPDIR … at a folder this user can write", and the summary says "Likely single cause: 52 of 52 failures (100%) open with EEXIST … one code behind most of a red suite points at one broken thing, not 52 broken tests." An unusable temp folder is an environment error, named once, with its remedy |

### Two probes from outside the section-2 catalogue

| Probe | Label | Result |
|---|---|---|
| The suite run from a **linked git worktree** (`git worktree add`) | RAN | **green** — `1430 passed, 0 failed, 2 unsupported in 76.8s`. Realistic: a contributor keeping the gate's own repo in a worktree beside their project |
| `GIT_DIR` / `GIT_WORK_TREE` set in the environment (including a bogus `GIT_DIR=/nonexistent/.git`) | RAN | **green** — `preflight` still `PASS 0 blocking, 0 warning(s), 29 passing`, `doctor` unchanged at `1 blocker(s)`. The gate reads the corpus from the cwd, not from git's own pointers |

### Sibling sweep for F-1-1's class (a dry run that skips the real run's precondition)

Every `dryRun` branch in the kit was read:

| Site | Verdict |
|---|---|
| `lib/installer.mjs` `installCommitGate` | **defect** — F-1-1, fixed |
| `lib/installer.mjs` `installEditGate` | **defect** — F-1-1, fixed (`!dryRun && !exists(hook)`) |
| `lib/installer.mjs` `deploy` | **checked, clean** — the `refused` guard at `installer.mjs:478` returns *before* the `dryRun` branch at `:482`, so a dry run reports a refusal. This is the shape the other two should have had |
| `lib/decompose.mjs` | **checked, clean** — `:584` passes `dryRun: dryRun \|\| !adapter` into the map body, which then prints "_No material gathered — run without `--dry-run`_". The dry run says what it did not do |
| `lib/research-run.mjs` | **checked, clean** — a dry run reports `attempts` and `wouldSearch`, and collects nothing |
| `lib/collect.mjs` | **checked, clean** — the `dryRun` branch takes no lock and writes nothing |

CLI-level parity for the other three `--dry-run` commands was re-run end to end:
`decompose --dry-run`, `research --dry-run` and `install --dry-run` each agree with their
real runs.

## 4. Successfully applied fixes

| id | commit | test | suite result |
|---|---|---|---|
| F-1-1 | `95e63de` | `doctor > a dry run reports the refusal the real run would give, not a promise it would break` | `RESEARCH_KIT_ALLOW_UNSUP=1 node research-kit/bin/selftest.mjs` — `1431 passed, 0 failed, 2 unsupported`, exit 0 |

The test **failed before the fix**, which is the proof it reproduces:

```
$ RESEARCH_KIT_ALLOW_UNSUP=1 node research-kit/bin/selftest.mjs doctor   # before
53 passed, 1 failed in 0.5s
FAIL  doctor > a dry run reports the refusal the real run would give, not a promise it would break
        a dry run promised a core.hooksPath the real run refuses to set
        + actual - expected
        + undefined
        - false
```

`actual: undefined` is the defect exactly — the preview return carried no `ok` key at all.

End to end after the fix, both states agree:

```
not deployed:  --dry-run exit 1   real exit 1   (same two "not deployed" lines)
deployed:      --dry-run exit 0   real exit 0   (dry run previews, real installs)
```

**What the fix touched.** `lib/installer.mjs`: both gates check the deployed-hook
precondition *before* answering a dry run, and both previews now carry `ok: true`.
`bin/install-hooks.mjs`: tests `!result.ok` before `result.dryRun` in both halves.
`test/doctor.test.mjs`: one test. `research-kit/README.md`: the enforced count, 1432 →
1433. `docs/ARCHITECTURE.md`: the `installer.mjs` row, staged in the same commit because
`research/kit.json` declares `research-kit/lib` and `research-kit/bin` as code paths
(standing protocol rule 1, ADR-0007).

No new flag, command, configuration key or format, so the feature freeze holds. No ADR is
owed: one defect with one obvious remedy (ADR-0075).

## 5. Rejected fixes

None. The one fix kept the suite green and was not reverted.

One attempt inside that fix **was** wrong and was corrected before the commit, and it is
worth recording because the suite did not catch it: reordering the CLI to test
`!result.ok` first, without giving the preview an `ok` key, made a healthy *deployed*
machine print `commit gate: undefined` / `edit gate: undefined` and exit 1. The end-to-end
positive check caught it. The previews now carry `ok: true`, and the test asserts that
shape, so it cannot return silently. See the hardening recommendation below.

## 6. Remaining prioritised risks

1. **Windows was not tested at all in this session.** No Windows host exists in this
   sandbox. The prior report records that `kill` of any name there is `TerminateProcess`,
   and that a test which was wrong only on Windows passed everywhere it was written and
   only CI caught it. F-1-1's fix is platform-independent (path joins and a branch order),
   but that is reasoning, not evidence. **Severity Medium / likelihood Plausible**, and
   the only way to close it is CI.
2. **No CLI-level test drives `install-hooks` over a deployed kit.** The `undefined`
   regression in §5 passed the whole suite. The new test pins the library shape; nothing
   pins the CLI's branch order end to end. **Severity Medium / likelihood Plausible.**
3. **Single-site corroboration** (carried from the prior report, unchanged): the root
   corpus closes unknowns on one site 90.9% of the time. The kit warns; it does not
   refuse. **Severity Medium / likelihood Likely** — it is the current state, not a
   possibility.
4. **The signed-in disclosure surface** (ADR-0035, carried, unchanged): on a public
   repository anyone with a GitHub account reads every dispatch input in the job log.
   **Severity Medium / likelihood Likely.** Not fixable without routing inputs around the
   `env:` rule that keeps them out of a shell.
5. **A vendor response-shape change remains a live hazard.** 210 hostile calls across 6
   normalizers found nothing this session, with positive and negative controls, but the
   class does not close by inspection. **Severity High / likelihood Rare.**
6. **`SIGKILL` cannot be caught**, so a `kill -9`'d run still leaks its scratch. Bounded
   by the machine's temp reaper. **Severity Low / likelihood Plausible.**
7. **The `ubuntu-26.04` leg is temporary** (ADR-0043) and is due to become a duplicate
   between 2026-10-19 and 2026-11-19. **Severity Low / likelihood Likely** — a stale leg
   is a leg that teaches people to ignore the matrix.

## 7. Hardening recommendations

- **Test the CLI, not only the library, for every branch order a fix changes.** The
  `undefined` regression is the concrete case: a library test that asserts the right
  shape cannot see a caller that reads it in the wrong order. One spawn-level test per
  install/gate command, over both a deployed and an undeployed kit, would have caught it.
- **Make a preview carry the same keys as the real result.** A `{ dryRun: true }` answer
  with no `ok` key invites exactly the `!result.ok` misread that happened here. `deploy`
  already returned `ok` in both directions; the two gates now do too.
- **Sweep a fix to its siblings on the day it lands.** F-1-1 is the second dry-run parity
  defect in this kit, found because the first was fixed and the pattern never swept. The
  prior report made this recommendation for vendor parsers; it applies to any fix whose
  root cause is a shape rather than a line.
- **Run the Windows leg against a change like this even when the reasoning says it cannot
  matter.** Reasoning is not evidence, and this repository has already been wrong once
  about what Windows does.
- **Retire the `ubuntu-26.04` leg on its trigger date**, and let `support-policy.test.mjs`
  be the thing that notices.

## 8. Coverage ledger, updated

Newly probed in Run 2: concurrency (green) · shallow clone (green) · `umask 077` +
`ulimit -n 64` (green) · `TMPDIR` relative, non-existent, and a file (green; the file case
is a named single cause, not a defect) · git worktree (green) · `GIT_DIR`/`GIT_WORK_TREE`
(green) · every `dryRun` branch in the kit, as a sibling sweep (2 defects, 4 clean).

Probed green in Run 1: archive tree · HOME with spaces/non-ASCII/nested · HOME-is-a-file
and read-only HOME · PATH-without-git · locale · 6 hostile `RESEARCH_KIT_RESULT_FILE`
values · SIGINT leftovers · SIGPIPE and closed stdout · closed stdin on 3 commands · 18
hostile machine-config shapes · 210 hostile vendor-parser calls · dry-run parity ·
derived-file regeneration · clean tree · conformance pairs · release examples.

**Still not probed, and why:**

| Area | Reason |
|---|---|
| **Windows in any form** | no Windows host in this sandbox. CRLF checkout, path separators, reserved file names and `kill`-as-terminate are all untested here |
| Node 24 / Node 26 | only v22.22.3 is installed; another line needs a network install. CI covers 24 and 26 on every commit |
| Python other than 3.11 | only 3.11.2 is installed. ADR-0078 sets 3.11 as the floor and CI tests it; a newer Python is untested here |
| CPU starvation vs test timeouts | the prior pass `RAN` 6 burners on 2 cores, green in 142s; not re-run (budget). Concurrency, the sharper half, was re-run here |
| Real ENOSPC on a tmpfs | needs a privileged mount this sandbox does not allow; the prior pass measured it (607/675 with one named cause) |
| Lockfile / manifest drift, version ranges resolving differently today | none exists — no `package.json`, no lockfile, zero dependencies. Nothing to be out of sync |
| Pinned CI actions still resolving upstream | no network egress to `api.github.com` from this sandbox; `check-action-pins.mjs` correctly reports `UNCHECKED` × 4 and exits 1. The weekly scheduled workflow is the thing that answers this |
| Hostile argv across all 28 CLIs; race probes with 8 concurrent CLIs | the prior pass `RAN` both green (36 spellings × 28 CLIs; 8 × 6 rounds); not re-run (budget) |

## 9. Final verification

```
$ RESEARCH_KIT_ALLOW_UNSUP=1 node research-kit/bin/selftest.mjs        # run twice, back to back
1431 passed, 0 failed, 2 unsupported in 75.9s (watchdog 60000ms/test)   # first
1431 passed, 0 failed, 2 unsupported in 75.4s (watchdog 60000ms/test)   # second, rules out a flaky pass
NOT a full pass: every test that ran passed, and 2 could not run on this host
exit 0 (both)

$ node research-kit/bin/preflight.mjs
PASS  0 blocking, 0 warning(s), 29 passing  [evidencePolicy=pluralist]      exit 0

$ node research-kit/examples/release-evidence/run-example.mjs
PASS: 6/6 examples behaved as documented                                    exit 0

$ cross-language conformance
agree: qualification-ledger-vectors.json
agree: fi-sidecar-evidence-manifest-vectors.json
agree: property-graph-hash-vectors.json

$ git diff --quiet -- research-kit/conformance research-kit/schemas
validator inputs unchanged: OK

$ node research-kit/bin/timeline.mjs && node research-kit/bin/export-warc.mjs
exit 0, exit 0

$ git status --porcelain
(empty — the working tree is clean)

$ git log --oneline -3
95e63de fix: a dry run of install-hooks reports the refusal the real run gives
ef7b1c4 docs: break-test run 1 report - probe and report, change nothing
30cc0ff Merge pull request #195 from StepenkoAnatoli/main-axuse3
```

The 2 unsupported are `NO-BROWSER` (`browser-guard`, `browser-transport`): this host has
no Chromium. CI's runners ship Chrome, so both run there; `RESEARCH_KIT_ALLOW_UNSUP` is
ignored in CI by design.

`check-action-pins.mjs` could not be verified: no network egress from this sandbox. It
fails closed, as designed.

## 10. Summary

One confirmed defect, found, reproduced, fixed and pinned by a test that demonstrably
failed first: `install-hooks --dry-run` promised both gates and exited 0 on a machine
where the real run exited 1 and installed neither, which matters because a dry run is the
answer an operator trusts instead of running the thing. Everything else probed held —
concurrent suites, a shallow clone, a linked worktree, hostile `GIT_DIR`, hostile machine
configs in 18 shapes, 210 hostile vendor-parser payloads, closed stdin and stdout, an
interrupted run, and a temp folder that is a file rather than a folder. The suite is green
twice consecutively at `1431 passed, 0 failed`, and every CI step that can run offline
here passes with a clean working tree. What this session could not test is Windows in any
form, Node 24 and 26, a Python other than 3.11, and anything needing network egress or a
privileged mount — so the fix's platform-independence is reasoning, not evidence, and CI
is the only thing that can close it.
