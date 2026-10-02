# Break test, Run 2 — re-probe, fix, and open the pull request (2026-10-02)

Run 1 changed nothing and reported what it found. Run 2 re-proves every Run 1 finding,
fixes what the freeze allows, sweeps the siblings of each defect, probes the rows Run 1 left
`not probed`, and states plainly what could not be tested here.

Host: Linux 6.1 x86_64 (2 vCPU, 3.9 GB RAM), Node v22.22.3, Python 3.11.2, git 2.39.5.
All commands run from `/home/user/Research-Kit` unless stated. Logs quoted below are kept in
`/home/user/scratch/` (the probe scratch directory, outside the repository).

---

## 1. Re-baseline, and what changed since Run 1

Run 1's report was committed unchanged as `9241163 docs: break-test Run 1 report (2 findings,
no code changed)`. Before any Run 2 code change, the suite was re-run on the same checkout:

```
$ RESEARCH_KIT_ALLOW_UNSUP=1 node research-kit/bin/selftest.mjs
1432 passed, 0 failed, 2 unsupported in 77.8s (watchdog 60000ms/test)

NOT a full pass: every test that ran passed, and 2 could not run on this host (RESEARCH_KIT_ALLOW_UNSUP=1)
exit 0
```

(`RAN`; log `scratch/run2-baseline.log`.) The unwaived run stays rc 1 for the same two
`NO-BROWSER` tests, as Run 1 documented — this host has no Chromium.

The Node 24/26 leg Run 1 promised to attempt in Run 2 was attempted and **is not possible in
this sandbox** (`RAN`):

```
$ curl -s https://nodejs.org/dist/index.json            # 0 bytes
$ curl -sv https://nodejs.org/dist/index.json           # after Client hello:
  OpenSSL SSL_connect: SSL_ERROR_SYSCALL in connection to nodejs.org:443
$ curl -sI https://nodejs.org/dist/                     # rc 0, NO output - not a success
$ curl -s -o /dev/null -w '%{http_code}' https://registry.npmjs.org/   # 200
```

The block is the sandbox's egress filter, not the kit. No proxy variables are set. The
`node-lines` CI job remains the only Node 24/26 coverage; it cannot be reproduced here.

---

## 2. Every Run 1 finding, re-probed

| Finding | Run 2 verdict | Why |
|---|---|---|
| F-1-1 — `settingsPath` wrong type kills `install-hooks` | **Reproduced, then fixed** (commit `4793f70`) | Same config, same command, same `ERR_INVALID_ARG_TYPE`; the fix is a type check in `shape()` plus a test that was red first |
| F-1-2 — the collector appends to a broken hash chain | **Reproduced, unchanged** | Real collect of a new URL appended seq 4 to the broken chain and exited 0; `handoff` still refuses the corpus afterwards. A fix is a new refusal on the append path, frozen by ADR-0117 |

### F-1-1 — reproduced, then fixed in this run

Re-verification (`RAN`), on an installed scratch home (`HOME=/home/user/scratch/h2`):

```
$ printf '%s' '{"editGate":{"settingsPath":42}}' > $HOME/.agents/research-kit.config.json
$ HOME=/home/user/scratch/h2 node research-kit/bin/install-hooks.mjs --edit-only
TypeError [ERR_INVALID_ARG_TYPE]: The "path" argument must be of type string. Received type number (42)
    at validateString (node:path:1457:5)
exit 1
```

The stack, the exit code and the call site are the Run 1 ones; the config was restored to
`{"role":"collector"}` afterwards.

**The fix loop, in the order it ran:**

1. Regression test first: the test `a settingsPath that is not a path falls back to the
   anchor, and install-hooks answers` was added to `research-kit/test/machine.test.mjs`
   (spawning `install-hooks --edit-only` against the hostile config, asserting rc 0 and the
   settings written at the anchor). Red before the fix: `RESEARCH_KIT_ALLOW_UNSUP=1 node
   research-kit/bin/selftest.mjs machine` → `20 passed, 1 failed`, assertion `42 !== ''`.
2. The smallest fix: `shape()` in `research-kit/lib/machine.mjs` now takes
   `editGate.settingsPath` only when it is a non-empty string, and otherwise falls back to
   `DEFAULTS.editGate.settingsPath` (which `runtimePaths()` resolves to the runtime anchor) —
   the same shape as the 2026-10-01 `skillRoots` check. Green after: the machine suite is
   `21 passed, 0 failed in 0.2s`.
3. The original reproduction, re-run (`RAN`):
   `edit gate: registered in /home/user/scratch/fixcheck/home/.claude/settings.json`, rc 0,
   `role collector / posture fail-open / edit gate mode ask / evidencePolicy pluralist`.
4. Full suite: see §5. The first CI-sequence run after the fix exited 1 on
   `research-kit/README.md claims 1434 tests; this run has 1435.` — the new test made the
   suite one test larger than the README's count, which the suite itself checks. The count
   was bumped to 1435 in the same commit; the unwaived run then exits 1 only for the two
   `NO-BROWSER` tests.
5. Commit `4793f70 machine: a settingsPath that is not a path falls back to the anchor`,
   parent `9241163`, in the repository's commit format. Files: `lib/machine.mjs`,
   `test/machine.test.mjs`, `CHANGELOG.md`, `docs/ARCHITECTURE.md` (the machine.mjs row —
   required in the same commit by the declared-code-path rule, `docs/ARCHITECTURE.md:7-12`),
   `research-kit/README.md` (test count). No ADR: ADR-0117 allows a bug fix, and a crash with
   one obvious remedy is a bug fix; the choice is named in the commit message (ADR-0075).

**Sibling sweep after the fix** (`RAN`): 16 hostile machine configs (every key wrong-typed in
turn — `settingsPath` as number/object/list/null/blank, `skillRoots` as a list with `42` and
`null` and as a string, `projectSkillDir`, `maxAgeDays`, `failOpen` as strings and numbers,
`role`/`transport`/`searchTransport`, the root as `[]`/`42`/`null`, and a retired-mode mix)
× 3 config-consuming CLIs (`doctor`, `install-hooks --dry-run --edit-only`,
`install --dry-run`): **0 stacks**. `shape()` (`lib/machine.mjs:112-155`) now type-checks
every key it reads. Status: **fixed**.

### F-1-2 — reproduced, unchanged

The canonical replica is `/home/user/scratch/chainprobe/proj`: a genuine entry, a hand-broken
entry (`prev:"nonsense-not-a-hash"`, `entrySha256:"cafebabe"`), a genuine entry that links to
the stored broken hash, then in Run 1 a fourth capture appended with rc 0. Run 2 re-ran the
append against the same broken chain (`RAN`, log `scratch/f12-rerun.log`):

```
$ node research-kit/bin/research.mjs --plan research/plan.json   # plan now names page2.html
  collected http://127.0.0.1:8123/page2.html - first capture      RUN_RC=0
ledger lines: 3 -> 4, seq 4 prev = cafebabe (the stored, broken hash)

$ node research-kit/bin/handoff.mjs
handoff FAILED
  handoff-chain-broken  prev: prev does not link to entry 1
HANDOFF_RC=1
```

So the defect is stable, not a one-off. The fix remains a **new refusal** on the append path
(`appendFetch`, `lib/provenance.mjs:314-340` validates only unparsed lines and the trailing
newline); ADR-0117 allows only bug fixes, deferred gaps, docs/tests, and vendor drift without a
new ADR, and ADR-0120 is the precedent for lifting the freeze for one named item. Status:
**proposed (feature-frozen check)**.

---

## 3. New finding

### F-2-1. A present but ill-typed safety key silently takes the laxer default

- Label: **RAN**
- Severity / likelihood: **Medium / Plausible**
- Real trigger: an operator hand-edits `~/.agents/research-kit.config.json` and quotes a
  boolean (`"failOpen": "false"`), or capitalises a policy (`"evidencePolicy": "STRICT"`,
  `"editGate": {"mode": "HARD-BLOCK"}`). The value is *present and meant*; the kit reads it as
  the fallback, and for these three keys the fallback is the **weaker** setting. Nothing —
  not the command, not `doctor` — says the value was ignored.

- Reproduction (`RAN`; `gate.mjs --posture` prints the posture and exits with its code):

```
$ printf '%s' '{"failOpen":false}' ; node research-kit/bin/gate.mjs --posture
fail-closed (config readable)                                    rc 1
$ printf '%s' '{"failOpen":"false"}' ; node research-kit/bin/gate.mjs --posture
fail-open (config readable)                                      rc 0
$ printf '%s' '{"failOpen":0}' ; node research-kit/bin/gate.mjs --posture
fail-open (config readable)                                      rc 0
$ node research-kit/bin/doctor.mjs | grep machine-config
pass  machine-config  readable (.../c3.json); posture: fail-open
```

```
{"evidencePolicy":"STRICT"} -> preflight prints evidencePolicy=pluralist
{"evidencePolicy":"strict"} -> preflight prints evidencePolicy=strict
{"editGate":{"mode":"HARD-BLOCK"}} -> install-hooks --dry-run --edit-only prints "edit gate mode ask"
{"editGate":{"mode":"hard-block"}} -> install-hooks --dry-run --edit-only prints "edit gate mode hard-block"
```

- Root cause (`READ`): `lib/machine.mjs:117-152` — `failOpen` takes only a boolean and
  otherwise falls back to `DEFAULTS.failOpen` which is `true` (`:81`); `evidencePolicy` takes
  only a listed value and otherwise falls back to `pluralist` (`:146`); `editGate.mode` takes
  only a listed value and otherwise stays the `ask` default (`:82`, `:159-162`). The `role`
  key a few lines above states the opposite rule in so many words — a present value that is
  not recognised resolves to the *restrictive* state (`unknown`), because "a machine whose
  operator meant something" must not silently become the default. That reasoning is not
  applied to the three keys where the silent default is the laxer one.
- Impact: a gate the operator tried to close (or a policy they tried to make strict) stays
  open; the only trace is a posture line that reads as normal. It is the same family as
  F-1-1 (a hand-edited config value that is not a valid value), one step quieter.
- Fix (not applied): needs an ADR. Either a present-but-unrecognised safety value resolves in
  the restrictive direction, or `doctor`/`preflight` name the ignored value. The second half
  of the constraint: the hook's kit-less posture reader (`githooks/pre-commit:54,61`) decides
  `failOpen` by grepping for a bare `false`, so it agrees with today's behaviour for the
  string `"false"` — a fix that changes `machine.mjs` must update that reader too, or the two
  readers of one posture drift, which is what the posture-agreement tests exist to catch
  (`test/` `hook > posture agreement (…)`). Both changes are new behaviour/checks and are
  frozen by ADR-0117.
- Regression test (proposed): for each of the three keys, an ill-typed value must not resolve
  to the laxer setting — asserted on `posture().failOpen` / the preflight label / the
  install-hooks dry-run line.
- Status: **proposed** (hardening; needs an ADR).

---

## 4. Coverage added in Run 2

Rows Run 1's ledger left `not probed` or `partially probed`:

| Row | Run 2 result |
|---|---|
| `stdin` a terminal or closed | **probed: green** — `gate.mjs --staged-stdin </dev/null` → `research gate: allow - the gate passes`, rc 0; `edit-gate.mjs </dev/null` → allow JSON, rc 0; `mcp-server.mjs </dev/null` → `research-kit mcp: protocols 2026-07-28, 2025-11-25, 2025-06-18` then `research-kit mcp: research-kit ready`, rc 0; `install-hooks.mjs --dry-run </dev/null` → the full would-do table, rc 0. (An older rc 1 on the last command did not reproduce with the full output captured.) |
| Runtime versions: oldest and newest claimed | **attempted, blocked** — Node 24/26 need `nodejs.org`, which this sandbox fails at TLS; recorded in §1, not fixed or hidden |
| `umask`/`ulimit`/small heap | **probed (heap)**: `doctor` and a real 1-page collect complete under `--max-old-space-size=48` (rc 1 verdict / rc 0 collect); the full 1435-test suite under 64 MB aborts rc 134 with a V8 OOM in `Runtime_StringToUpperCaseIntl` — a Node-level abort, not a kit stack, and not a fair heap for a whole suite |
| Windows realities | **not probed**: no Windows host here; unchanged from Run 1 |
| Pinned CI actions still resolve | **not probed**: the sandbox's TLS interception makes `check-action-pins.mjs` report `UNCHECKED` and exit 1 (its designed fail-closed behaviour); a pass needs real GitHub access |

Probes not in the task's catalogue, run this round (`RAN` unless marked):

1. **13 hostile `research/plan.json` shapes through the real run** (not dry-run): `urls` as a
   string/number/object/array-of-strings, entries that are `null`/`42`/`{}`/`""`, `depth`,
   `refreshDays`, `limit`, `perQuery` wrong-typed, a 10,000-entry plan. Every malformed shape
   is refused by name (`research/plan.json has 1 problem(s) …`), with one exception that is
   not malformed: `depth:"deep"` is a legal value, and the run collected. `stacklines=0`
   everywhere.
2. **A corpus whose `plan.topic` is the number `42`** through `brief`, `bundle`, `timeline`,
   `export-warc`, `handoff`, `preflight`, `evidence-context`, `measure`, `audit`, `doctor`:
   all answer with their normal verdicts, no stacks, no writes outside the capture tree.
3. **`install --into` a project that already owns files** (the ADR-0111 control): rc 0, the
   267-file deploy goes to `$HOME/.agents/research-kit`, the user's `note.txt` is kept, and
   only `foreign/.claude/skills/research-first` is added to the project.
4. **Byte-determinism of the derived files** under a second generation: the sha256 of
   `research/TIMELINE.md` (`f2775e7e…`) and `research-corpus.warc.gz` (`6e337212…`) are
   unchanged after re-running `timeline.mjs` and `export-warc.mjs`, and the tree is clean.

---

## 5. Final verification

Suite, twice, on the final tree (`RAN`):

```
$ node research-kit/bin/selftest.mjs
1433 passed, 0 failed, 2 unsupported in 79.2s (watchdog 60000ms/test)
  NO-BROWSER  browser-guard > LIVE: a real Chromium cannot be led into this machine's network by a script or a meta refresh
  NO-BROWSER  browser-transport > LIVE: a page whose resource never arrives is captured at the deadline, not lost to the kill
exit 1 - and these two are the only reason (log scratch/raw-final-1.log)

$ RESEARCH_KIT_ALLOW_UNSUP=1 node research-kit/bin/selftest.mjs        # inside the CI sequence below
1433 passed, 0 failed, 2 unsupported in 78.7s (watchdog 60000ms/test)
exit 0 (log scratch/ci-final2.log)
```

Every locally runnable CI step, run as a sequence over the final tree (`RAN`; a faithful
local mirror of `.github/workflows/offline-suite.yml`'s `platform` leg):

| Step | Exit |
|---|---|
| selftest (local opt-in for unsupported) | 0 |
| preflight | 0 |
| release evidence examples | 0 |
| cross-language conformance — `agree:` for `qualification-ledger-vectors.json`, `fi-sidecar-evidence-manifest-vectors.json`, `property-graph-hash-vectors.json` | 0 |
| validator inputs are unchanged (`research-kit/conformance`, `research-kit/schemas`) | 0 |
| derived files regenerate (`timeline.mjs`) | 0 |
| derived files regenerate (`export-warc.mjs`) | 0 |
| the suite left the working tree clean | 0 |

`OVERALL_EXIT=0`. Not runnable here, unchanged from Run 1: `action-pins.yml` (needs real
GitHub access), the two `LIVE` browser tests (no Chromium), and the `node-lines` job (§1).

Repository state (`RAN`):

```
$ git status --porcelain      # empty
$ git log --oneline -3
4793f70 machine: a settingsPath that is not a path falls back to the anchor
9241163 docs: break-test Run 1 report (2 findings, no code changed)
4e1c258 Merge pull request #197 from StepenkoAnatoli/main-axuse3
```

---

## 6. What remains open

- **F-1-2** — the collector still spends into a corpus whose chain is broken, and the operator
  learns it from `handoff` afterwards. The smallest correct fix is a named refusal before the
  append when the chain does not verify from the genesis entry; it is a new check, so it needs
  an ADR to lift the freeze for that one item (the ADR-0120 lane). Hardening recommendation
  until then: run `handoff` (or `doctor`) after a merge or restore of
  `research/raw/.fetches.jsonl`, before the next paid run.
- **F-2-1** — an ill-typed `failOpen`, `evidencePolicy` or `editGate.mode` silently weakens the
  machine posture. Hardening recommendation until an ADR lands: keep the config a boolean and
  the enumerations lower-case, and read the posture line in `doctor` (`pass machine-config …
  posture: …`) after every hand-edit rather than assuming the value took.

No Run 1 finding was downgraded, and none turned out not to reproduce.

---

## 7. Branch and pull request

- Branch: `arena/01a0fae8-research-kit` (no upstream before Run 2).
- Commits: `9241163` (Run 1 report, no code), `4793f70` (the F-1-1 fix), and the commit that
  adds this report.
- Pull request: opened as a **draft** after the final push; its title names the one fix, and
  its body is the combined Run 1 + Run 2 report. The URL is recorded in the commit that
  follows this one on the same branch; if this paragraph still says "to be recorded", the
  push or the PR creation failed and the error is quoted in that commit instead.
- URL: https://github.com/StepenkoAnatoli/Research-Kit/pull/198 (draft, base `main`, three commits).
