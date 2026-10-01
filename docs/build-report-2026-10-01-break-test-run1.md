# Break-test Run 1 — probe and report, 2026-10-01

> Run 1 of a two-run break test. **Nothing was changed to produce this report.** The only
> file added is this one. Probes that modify files ran in a throwaway worktree under
> `/home/user/scratch`. Fixes here are **proposed only**; they are applied in
> [Run 2](build-report-2026-10-01-break-test-run2.md).

## 1. Project and build overview

**Stack.** Node.js ESM (`.mjs`) kit under `research-kit/`, no dependencies, no
`package.json` build step. Cross-language conformance runners also ship in Python 3.11.
The product is a research gate: collectors fetch pages, a hash-chained ledger proves it,
and `preflight` refuses to let a build start until the evidence holds.

**Test command.** `node research-kit/bin/selftest.mjs` from the repository root
(`docs/adr/0071-the-suite-runs-from-the-repository-root.md`).

**CI steps.** `.github/workflows/offline-suite.yml` is the source of truth. Jobs and steps:

- `platform` matrix (`ubuntu-latest`, `ubuntu-26.04`, `windows-latest`), Node 22, Python 3.11:
  1. versions
  2. no credentials are present
  3. the commit hook is executable (non-Windows)
  4. the checkout is LF, even on Windows (Windows)
  5. `node research-kit/bin/selftest.mjs` (writes a result file)
  6. publish the count
  7. `node research-kit/bin/preflight.mjs`
  8. `node research-kit/examples/release-evidence/run-example.mjs`
  9. cross-language conformance: 3 pairs of Node/Python runners over the same vectors
  10. validator inputs are unchanged (`git diff --quiet -- research-kit/conformance research-kit/schemas`)
  11. `node research-kit/bin/timeline.mjs` + `node research-kit/bin/export-warc.mjs`
  12. the suite left the working tree clean (`git status --porcelain` empty)
- `node-lines` matrix (Node `24`, `26`, ubuntu): selftest
- `archive-tree`: selftest from `git archive HEAD | tar -x` into a folder whose name has a
  **space** in it, with no `.git`
- `suite`: gates on all of the above
- `.github/workflows/action-pins.yml`: runs `.github/scripts/check-action-pins.mjs`
- `.github/workflows/collect.yml` and `live-collection.yml`: key-holding collector paths,
  not runnable offline (deliberate; not a defect)

## Baseline (untouched)

| | |
|---|---|
| command | `RESEARCH_KIT_ALLOW_UNSUP=1 node research-kit/bin/selftest.mjs` |
| cwd | `/home/user/Research-Kit` |
| exit code | `0` |
| result | `1430 passed, 0 failed, 2 unsupported in 77.2s (watchdog 60000ms/test)` |
| verdict line | `NOT a full pass: every test that ran passed, and 2 could not run on this host (RESEARCH_KIT_ALLOW_UNSUP=1)` |
| wall clock | `1m12.272s` |
| OS | Linux (this sandbox) |
| Node | v22.22.3 |
| Python | 3.11.2 |
| git | 2.39.5 |

The 2 unsupported are `NO-BROWSER` (`browser-guard`, `browser-transport`): no Chromium on
this host. Exit code stays 0 locally; CI blocks on unsupported and GitHub runners ship
Chrome, so those two run there.

**Correction, recorded honestly.** My first baseline run piped the suite into `tail`, and
`echo $?` then reported `tail`'s status. The suite's own exit code is **1** here, and it is
1 because 2 tests are `NO-BROWSER` unsupported on this host and `selftest.mjs:114-115`
blocks on unsupported unless `RESEARCH_KIT_ALLOW_UNSUP=1` (ADR-0108). It is not a failing
test: the count line reads `1430 passed, 0 failed`. CI installs Chrome on its runners, so
those two run there. Every run in this report quotes the suite's own exit code.

Bare `node research-kit/bin/selftest.mjs` here: `1430 passed, 0 failed, 2 unsupported in
73.2s`, **exit 1** (unsupported-blocking). The canonical local command for this sandbox is
therefore the `RESEARCH_KIT_ALLOW_UNSUP=1` form above; CI ignores that variable and still
blocks.

## 2. Prior work already found and fixed, and whether it still holds

The immediately preceding pass is
[`docs/build-report-2026-09-29-break-test.md`](build-report-2026-09-29-break-test.md)
(PR #154/#155, six fixes), preceded by `build-report-2026-09-17-hardening.md` and the
break-tests recorded in PR #140 and Arena break tests 6–12. Nothing in those reports is
reported again here as new. Their main probes were re-run cheaply:

| Prior probe | Re-run here | Result |
|---|---|---|
| Interrupted run takes its scratch too (prior fix 3) | `RAN` — SIGINT to a live suite, `TMPDIR=/tmp/bt/sp2`, counted **after** the process exited | **holds**: `suite exit code after SIGINT = 130`, `0` scratch dirs left |
| Vendor parsers hardened against a null row (prior fix 1) | `RAN` — 6 normalizers × 35 hostile shapes = 210 calls, with positive controls on the real fixtures and a negative control proving the regex catches the original defect | **holds**: no raw throw; `normalizeSearch` on `firecrawl-search-1.24.6.json` still yields real rows |
| `git archive` tree with no `.git`, folder name with a space (CI `archive-tree`) | `RAN` — `git archive HEAD \| tar -x -C "/tmp/bt/archive tree"` | **holds**: `1430 passed, 0 failed, 2 unsupported in 70.6s` |
| `check-action-pins.mjs` fails closed without network | `RAN` | **holds**: 4 × `UNCHECKED ... request failed`, exit 1 — designed behaviour, not a defect |
| The suite leaves the working tree clean; derived files regenerate | `RAN` — `timeline.mjs`, `export-warc.mjs`, then `git status --porcelain` | **holds**: only this report file is untracked |

Prior fix 4 was `install --dry-run` reporting prunes that were not there. **Its sibling was
never swept** — see F-1-1.

## 3. Discovered failures

### F-1-1. `install-hooks --dry-run` promises gates the real run refuses to install

- Label: **RAN**
- Severity / likelihood: **Medium / Plausible**
- Real trigger: a fresh contributor or a new CI box that follows the README's install
  order but checks first. `install-hooks --dry-run` exits 0 and says both gates would be
  registered; the real `install-hooks` exits 1 and installs neither, because nothing has
  been deployed yet. Anyone scripting `--dry-run` as a preflight — or reading its exit
  code — concludes the machine is armed when it is not, and the gate that is supposed to
  stop an agent editing `src/` is silently absent.
- Reproduction (cwd `/home/user/Research-Kit`; `H` is a fresh `mktemp -d`, so nothing
  outside the repository or scratch is touched):

  ```
  $ HOME="$H" node research-kit/bin/install-hooks.mjs --dry-run ; echo EXIT=$?
  would set core.hooksPath=/tmp/tmp.ioiuNxuXYC/.agents/research-kit/githooks (was unset)
  would register in /tmp/tmp.ioiuNxuXYC/.claude/settings.json: node "/tmp/tmp.ioiuNxuXYC/.agents/research-kit/hooks/edit-gate.mjs"
  EXIT=0

  $ HOME="$H" node research-kit/bin/install-hooks.mjs ; echo EXIT=$?
  commit gate: /tmp/tmp.ioiuNxuXYC/.agents/research-kit/githooks/pre-commit is not deployed - run bin/install.mjs first
  edit gate: /tmp/tmp.ioiuNxuXYC/.agents/research-kit/hooks/edit-gate.mjs is not deployed - run bin/install.mjs first
  EXIT=1
  ```

  The dry run and the real run disagree on **both** gates and on the exit code.
- Root cause: two places, both short-circuiting the dry run past the precondition the real
  path enforces.
  - `research-kit/lib/installer.mjs:35` — `installCommitGate` does
    `if (dryRun) return { dryRun: true, would: dir, previous };` **before** the existence
    check at `installer.mjs:38` (`if (!exists(hook)) return { ok: false, ... }`).
  - `research-kit/lib/installer.mjs:159` — `installEditGate` writes the check as
    `if (!dryRun && !exists(hook))`, explicitly exempting the dry run. The comment
    directly above it (`installer.mjs:155-157`) states the reason the check exists:
    "a registration pointing at a missing file makes every Edit run a hook that crashes
    (found 2026-09-27, kit not deployed). The commit gate refused in that state; this half
    registered anyway." The guard was added and the dry run was left outside it.
  - `research-kit/bin/install-hooks.mjs:63-66` and `:70-73` then print
    `result.dryRun` as a promise, with no way to tell a promise the real run would keep
    from one it would refuse.
- Impact: a dry run is the answer an operator trusts *instead of* running the thing. Here
  it answers the opposite of the question, on the exact machine state — nothing deployed
  yet — where a newcomer is most likely to be. This is the same class the 2026-09-29 pass
  fixed for `install --dry-run` (its finding 4); that fix was not swept to its sibling.
- Fix (proposed): make the dry run answer the question the real run would answer. Check
  the precondition in both halves before the `dryRun` return, and have the CLI print the
  refusal instead of the promise when the precondition fails — keeping exit 1 parity with
  the real run. No new flag, no new config key, so it stays inside the feature freeze
  (AGENTS.md "Feature freeze (from 0.9.0)").
- Regression test: to be written in Run 2 — a dry run on a machine with no deployed kit
  must report the same refusal, and with the same exit code, as the real run.
- Suite after fix: n/a (not applied in Run 1)
- Status: **proposed**

## 4. Coverage ledger

| Area | Status |
|---|---|
| Fresh clone / shallow clone | not probed: prior pass `RAN` it green; no code changed since |
| `git archive` tree, no `.git`, folder name with a space | probed: **green** — `1430 passed, 0 failed, 2 unsupported in 70.6s` |
| Lockfile / manifest sync | not probed: none exists. No `package.json`, no lockfile, zero dependencies — nothing to be out of sync (`ls package.json` → `no root package.json`) |
| Version ranges resolving differently today | not probed: same reason — there are no ranges |
| Runtime versions (oldest/newest supported) | not probed: this host has Node v22.22.3 and Python 3.11.2 only. CI covers 22/24/26 and 3.11; getting another line here needs a network install |
| Pinned CI actions resolving | probed: `UNCHECKED` × 4, exit 1 without network — designed fail-closed |
| `HOME` unset / empty / hostile | probed: **green** (prior pass), re-confirmed indirectly via every scratch-HOME probe below |
| `HOME` with spaces / non-ASCII / nested, full install round trip | probed: **green** — `John Smith`, `Jöhn Ünïcödé`, `ünï/sp ace/s` all install exit 0, no raw stack |
| `HOME` is a file; `HOME` read-only | probed: **green** — `install` exits 2 with a named `EACCES` cause; `install-hooks` exits 1 naming the missing deploy |
| `TMPDIR` variations, ENOSPC | not probed: prior pass `RAN` all five shapes plus a real 1 MiB tmpfs |
| `PATH` without `git`, with `node` still reachable | probed: **green** — `doctor` reports `install git 2.9 or newer` as a fix and exits 1, as designed |
| `PATH` empty / unset | probed: not reachable — the shell cannot start `node` at all (`exit 127`), so there is nothing of the kit's to test |
| `TZ` | not probed: prior pass `RAN` `TZ=Pacific/Kiritimati` green |
| `LANG` / `LC_ALL`, locale-dependent sorting | probed: **green** — `preflight` identical under `C`, `C.UTF-8`, `POSIX`, `tr_TR.UTF-8`, `de_DE.UTF-8`; Node's `Array#sort` is locale-independent, confirmed `I,a,b,i,İ` under both `tr_TR` and `C`. Note only `C`, `C.utf8`, `POSIX` are generated on this host, so the non-C locales were requested but not actually provided by libc |
| Missing / invalid environment variables; stray real-looking keys | probed in part: 6 hostile `RESEARCH_KIT_RESULT_FILE` values (unset, non-existent dir, a directory, `/proc`, a path with spaces, an unwritable dir) — suite completes with the same count line every time, no crash |
| `umask 077`, `ulimit -n`, small heap, full temp volume | not probed: prior pass `RAN` all four |
| Windows realities (CRLF, separators, reserved names, `kill` as terminate) | **not probed: no Windows host in this sandbox.** The prior report records that `kill` of any name there is `TerminateProcess`, so the interrupted-run probe cannot be made honest on that platform. The `core.autocrlf` case is covered by the repo's own `.gitattributes` and CI's Windows-only LF step |
| Two suite runs at once | not probed in Run 1 (budget): prior pass `RAN` `1282 × 2, both green`. Scheduled for Run 2's re-baseline |
| CPU starvation vs test timeouts | not probed in Run 1: prior pass `RAN` 6 burners on 2 cores, green in 142s |
| Interrupting a run (SIGINT/SIGTERM), leftovers | probed: **green** — exit 130, 0 scratch dirs |
| stdout closed early (`\| head`), stdout fd closed (`>&-`) | probed: **green** — `preflight`, `doctor`, `selftest` all behave; no stack trace |
| stdin closed (`/dev/null`, fd 0 closed) on `edit-gate`, `gate --staged-stdin`, `mcp-server` | probed: **green** — no raw stack; `edit-gate` still answers `allow`, `gate` answers `allow`, `mcp-server` prints its banner |
| Races on shared files / ports / caches | not probed in Run 1: prior pass `RAN` 8 CLIs × 6 rounds |
| Flakiness (suite ≥ 3 times) | probed in part: **8 full runs** this session (baseline ×2, archive tree ×2, result-file probe ×6, plus the interrupted ones) all reported exactly `1430 passed, 0 failed, 2 unsupported`; durations 70.6–79.6s. No count varied |
| Third-party CLI / API output: null rows, wrong types, empty bodies | probed: **green** — 210 hostile calls across 6 vendor normalizers, with positive and negative controls |
| Config and data files: truncated, empty, wrong type, deep, very large | probed: **green** — 18 hostile `~/.agents/research-kit.config.json` shapes (empty, truncated, array, `null`, `42`, `"hello"`, wrong-typed `role`/`evidencePolicy`/`maxAgeDays`/`editGate`/`skillRoots`, unknown key, BOM, 2000-level nesting, 8 MB, a directory, `chmod 000`): no raw stack. `doctor` names the corrupt file, resolves `fail-CLOSED`, and sets role `unknown` |
| CLI flags: missing values, wrong types, unknown flags | not probed in Run 1: prior pass `RAN` 36 spellings × 28 CLIs |
| Dry run reports exactly what the real run does | probed: **F-1-1 found.** `decompose --dry-run`, `research --dry-run`, `install --dry-run` all agree with their real runs; `install-hooks --dry-run` does not |
| Generated files regenerate to committed bytes | probed: **green** — `timeline.mjs`, `export-warc.mjs`, `git diff --quiet` over `conformance/` and `schemas/` |
| Suite leaves the working tree clean | probed: **green** — only this report file |
| Cross-language Node/Python conformance | probed: **green** — `agree:` on all three vector files |
| Release-evidence examples | probed: **green** — `PASS: 6/6 examples behaved as documented`, exit 0 |

## 5. Proof of no change

```
$ git status --short
?? docs/build-report-2026-10-01-break-test-run1.md

$ git diff --stat
(no output — no tracked file was modified)
```

Every destructive or file-writing probe ran against a `mktemp -d` HOME or a
`git archive`/`tar` copy under `/tmp/bt`. The only file this run added is this report.
