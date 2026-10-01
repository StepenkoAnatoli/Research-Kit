# Build report — break-test, 2026-10-01

An adversarial pass over the whole build, run twice as instructed:

- **Run 1 — discovery, report only.** Nothing was changed. Every failure found is reproduced,
  root-caused and sized below.
- **Run 2 — fix, test, revert on red.** A minimal fix for each confirmed finding, applied one
  at a time, each followed by the full suite. Nothing was reverted: every change left the
  suite green.

**Project.** Research-Kit 0.9.0, a zero-dependency Node toolkit (no `package.json`, no
lockfile) with a plain-Node test harness. Linux/Windows supported, Node 22/24/26 in CI.

**How the build is run.** One command, offline, no key and no network:

```
node research-kit/bin/selftest.mjs
```

CI (`.github/workflows/offline-suite.yml`) adds `preflight`, the release-evidence examples, the
Node/Python cross-language conformance pairs, the regeneration of the corpus's derived files,
and "the suite left the working tree clean". Every one of those steps was replayed locally in
both runs.

**Baseline.** `1406 passed, 0 failed, 1 unsupported in 72.5s`. The one unsupported test is the
live-Chromium guard: this host has no Chromium, so a full pass needs
`RESEARCH_KIT_ALLOW_UNSUP=1`, exactly as the suite states.

---

## Run 1 — discovery (report only)

### What was probed, and what held

The suite is unusually hard to break, and most of the credit belongs to the earlier passes.
Everything in this table was reproduced on this checkout and **passed**:

| Probe | Result |
|---|---|
| Full suite from a `git archive` tree (no `.git`, path with a space — the ZIP-user leg) | 1406 passed / 0 failed / 1 unsupported |
| Full suite from a `git worktree` checkout (`.git` is a file) | green; tree clean after |
| Three suites at once | 1406 × 3, all exit 0, 118–121s each |
| `SIGINT` at ~12s into a run | exit 130, **zero** scratch dirs left in `/tmp` (the 2026-09-29 and PR #186 fixes hold) |
| `selftest.mjs \| head -n 1` with the waiver | exit 0, result file written, no exit-13 unsettled await |
| `RESEARCH_KIT_RESULT_FILE` = missing dir / `/dev/full` / `.` / `''` | each named in one line; suite still green |
| Whole CI sequence (preflight, release examples, 3 conformance pairs, derived files, clean tree) | all green, tree clean |
| 32 exported vendor/HTML parsers × 168 hostile payloads (null rows, wrong types, `__proto__`, BOM, 300-deep nesting) | no throw; the only hit was `firecrawl.command(null)`, reachable only by a direct call — internal callers pass arrays |
| 24 CLIs × 8 hostile argv spellings (96 invocations) | 0 stack traces, 0 unexpected exit codes |
| `edit-gate.mjs` stdin: `{"cwd":42}`, `null`, `[1,2]`, 400-deep array | allow, exit 0, no stack (the 2026-09-29 fix holds) |
| 23 hostile JSON-RPC lines through `mcp-server.mjs` | 23 well-formed responses, 0 bad JSON, no stack |
| Gates with no `git` on `PATH` and no `HOME` | fail-closed with a named verdict, no stack |
| Hostile project corpus (bad `plan.json` types, BOM + CRLF `DISCOVERY.md`, non-JSON `EVIDENCE.md`, garbage ledger, broken `kit.json`) × 10 CLIs | no crash; every CLI names its refusal |
| `plan.json` with `file:`, `data:`, `javascript:`, `ftp:`, protocol-relative URLs | refused by name before any fetch |
| SSRF classification: `127.0.0.1`, `0.0.0.0`, `::1`, `::ffff:*`, RFC1918, `169.254.169.254`, `100.100.100.200`, `fc00::`, `fe80::` | refused; numeric/loopback spellings (`127.1`, `0x7f000001`, `2130706433`, `*.nip.io`, `localtest.me`) are caught at connect time by the guarded resolver |
| Locale: `LC_ALL=C / POSIX / en_US.UTF-8 / tr_TR.UTF-8` | ordering tests identical, 2/2 green |
| 7 MB `plan.json` (200k urls) through `decompose --dry-run` | 2.9s, exit 0 |
| 10 MB, 100k-row `EVIDENCE.md` through `handoff`, `measure`, `timeline`, `export-warc`, `bundle` | no crash (see finding 1 for the four that did) |
| Time-warp: clock +180 days propagated to every child via `NODE_OPTIONS=--require` | 3 failures, all traced to the warp's own asymmetry (fixtures written with the warped clock, lock mtimes taken from the real one) — no genuine date bomb |

### Finding 1 — a large corpus killed `preflight`/`doctor`/`brief`/`audit` with a raw `RangeError`

**Severity: Medium** (crash, fail-closed, no data lost) · **Discovered: Run 1** · **Fixed: Run 2**

**Repro**

```bash
mkdir -p /tmp/big && cd /tmp/big
node research-kit/bin/new-project.mjs . --topic T
# EVIDENCE.md: a table of N rows, each citing a raw file that does not exist
node research-kit/bin/preflight.mjs
```

| rows | before the fix |
|---|---|
| 20,000 / 50,000 / 60,000 | normal verdict (exit 1) |
| 63,000 / 64,500 / 65,500 / 100,001 | **`RangeError: Maximum call stack size exceeded`** + V8 stack, exit 1 |

```
file:///home/user/Research-Kit/research-kit/lib/checks.mjs:972
    findings.push(...check.run(corpus, options));
             ^
RangeError: Maximum call stack size exceeded
    at runChecks (…/lib/checks.mjs:972:14)
    at runPreflight (…/lib/preflight.mjs:64:20)
```

On the same 100,000-row corpus: `doctor`, `brief` and `audit` also died with the raw stack
(all reach `runChecks`), while `handoff`, `measure`, `timeline`, `export-warc` and `bundle`
stayed clean. `gate --gate commit --staged-stdin` answered
`gate: internal error - Maximum call stack size exceeded` (exit 2 — fail-closed, but not a
verdict).

**Root cause.** `runChecks` appended each check's result with a spread:
`findings.push(...check.run(corpus, options))`. A spread passes every element as an
*argument*; past the engine's argument limit (measured here between 60,000 and 63,000) it
throws, and V8 reports the argument overflow as a stack error, which is why the message
misleads. Two sibling sites use the same pattern (`checks.mjs:176`,
`doctor.mjs:424`) but receive bounded arrays.

**Why it is realistic.** Findings are not one per row in general: a measured 1,000-row hostile
corpus produced **3,510 findings** (1,000 `row-type`, 1,000 `raw-missing`, 1,000
`raw-dangling`, 500 `duplicate-id`). The crash needs a single check to return ≳62,000
findings, i.e. a corpus of roughly 60,000+ evidence rows or as many dangling captures —
unusual for a hand-written corpus, ordinary for the long-running automated collector this kit
exists to serve.

**Impact.** The gate failed closed, so nothing unsafe could be committed, but the operator
got a V8 stack instead of a verdict, and `doctor` — the command the docs tell a stuck
operator to run — crashed too, so the diagnosis tool was unavailable exactly when the corpus
was large.

### Finding 2 — `makeSlug` passed Windows-reserved device names through

**Severity: Low (latent contract defect)** · **Discovered: Run 1** · **Fixed: Run 2**

```js
makeSlug('CON')  // "con"   — Windows: cannot be created
makeSlug('aux')  // "aux"
makeSlug('LPT9') // "lpt9"
```

**Root cause.** The helper documents "a filename-safe slug", but the transform never checked
the reserved device names (`con`, `prn`, `aux`, `nul`, `com1`–`com9`, `lpt1`–`lpt9`), which
Windows refuses whatever extension follows them.

**Reachability.** Every current call site prefixes something before the filesystem sees the
name (`<date>-<slug>-… .md` for captures, `<slug>-v0.1-<date>.md` for audits), so no observed
failure depends on this. The contract was what was wrong, not a call site — recorded here as a
latent defect rather than a live one, and fixed because the kit supports Windows and the guard
is one line.

### Same-class risks noticed while looking (still open)

- `research-run.mjs:913` — `Math.max(...shares)` takes one argument per capture body; it would
  throw at ≳125,000 fresh captures in one run. Not reachable today.
- `release-validator.mjs:419`, `fi-validator.mjs:90`, `path-authority-validator.mjs:189`,
  `r29-workbook-linkage-validator.mjs:54` — `errors.push(...local)` over supplied records;
  bounded by the input packet, not by a corpus.

---

## Run 2 — fixes, one at a time, each followed by the suite

### Fix 1 — append findings one at a time (`research-kit/lib/checks.mjs`)

```js
// before
findings.push(...check.run(corpus, options));
// after
for (const finding of check.run(corpus, options)) findings.push(finding);
```

**Regression test** (`checks.test.mjs`):
`a check returning more findings than the engine argument limit is appended, not spread` —
a 66,000-row corpus (one finding each), asserting the *count* returned is above the limit as
well as the absence of a throw. Runtime ≈ 3s including the rest of the file.

**Vacuous-proof.** With the spread restored (`git checkout -- lib/checks.mjs`), the test goes
red: `65 passed, 1 failed — FAIL checks > a check returning more findings than the engine
argument limit is appended, not spread`. With the loop, `66 passed, 0 failed`.

**Repro after the fix.** `preflight` on the 63,000-row corpus returns its normal FAIL verdict
(exit 1, no `RangeError`). On the 100,000-row corpus, `preflight`, `doctor`, `brief` and
`audit` all complete with their real verdicts, and the commit gate returns an ordinary
decision instead of `internal error`.

### Fix 2 — prefix Windows-reserved base names (`research-kit/lib/core.mjs`)

`makeSlug` now prefixes a slug or fallback that is exactly a reserved device name
(`con` → `_con`), case-insensitively — the fallback path is not lowercased the way the slug
path is — and still honours the explicit limit (`makeSlug('con', 'topic', 3)` → `_co`).
Normal slugs are byte-for-byte unchanged; nothing in the repository's own corpus or audit
names is affected.

**Regression test** (`audit.test.mjs`): `makeSlug prefixes a name Windows reserves, on the
slug and fallback paths alike` — all nine reserved families, the upper-case fallback, the
limit interaction, and two near-misses (`console`, `com10`) that must *not* be prefixed.

### Fix 3 — the documented test count, which the suite itself polices

Adding the two tests made `research-kit/README.md`'s claim stale, and the suite said so by
name: `README.md claims 1407 tests; this run has 1409. Fix: change "1407 tests, offline" to
"1409 tests, offline"`. Applied exactly as instructed. `CHANGELOG.md` gained two entries in
its existing Unreleased section.

### Suite result after each step

| Step | Result |
|---|---|
| Baseline | 1406 passed, 0 failed, 1 unsupported in 72.5s |
| Fix 1 + its test | 1407 passed, 0 failed, 1 unsupported — exit 1 **only** because the README claim was now stale |
| Fix 2 + its test + README + CHANGELOG | **1408 passed, 0 failed, 1 unsupported in 79.8s, exit 0** |

CI sequence replayed after the fixes: `preflight` **PASS 0 blocking / 0 warnings / 29 passing**;
release examples **6/6**; all three Node/Python conformance pairs **agree**; `timeline` and
`export-warc` regenerate to their committed bytes; `conformance/` and `schemas/` byte-for-byte
unchanged; working tree clean.

### Probe hygiene

The hostile-argv battery ran with the repository root as its working directory, and two CLIs
did what they are designed to do there: `audit.mjs` wrote an audit into `research/audits/` and
appended a topic to `research/audits/index.json`, and `new-project.mjs -` scaffolded a project
into a folder literally named `-`. All of it was my probe's output, not a product defect; the
files were removed, the index restored with `git checkout`, and the tree verified clean
(`git status --porcelain` empty) before any fix was applied.

---

## Successfully applied fixes

1. **`research-kit/lib/checks.mjs`** — `runChecks` appends findings in a loop, not a spread.
   Removes the `RangeError` crash for large corpora across `preflight`, `doctor`, `brief` and
   `audit`, and the gate's `internal error`. Pinned by a 66,000-row regression test.
2. **`research-kit/lib/core.mjs`** — `makeSlug` prefixes Windows-reserved device names.
   Pinned by a test covering both slug paths and the limit.
3. **`research-kit/README.md`** — documented test count corrected to 1409 (checked by the
   suite).
4. **`CHANGELOG.md`** — both fixes recorded under Unreleased (ADR-0117 freeze: bug fixes only).

## Rejected fixes

- **None attempted-and-reverted.** No change made the suite red; each was verified green in the
  same step it was applied.
- **Considered and deliberately not applied: converting the other spread sites**
  (`checks.mjs:176` `priorOrder`, `doctor.mjs:424` `gateHealth`, the validator
  `errors.push(...local)` family, `Math.max(...shares)`). None of them receives an unbounded
  array today, and the smallest change that removes an *observed* failure is the one site that
  had one. They are listed under remaining risks, with the measured threshold at which each
  would become reachable.
- **Considered and not applied: a shared `pushAll` helper** used at every aggregation site.
  It would be a larger change than the defect requires, and this codebase prefers one
  precedent plus a test over a new abstraction (ADR-0004's reasoning).
- **Rejected as a false positive: the three time-warp failures.** They came from the warp's own
  asymmetry — fixtures written by the warped parent process, lock files whose mtimes come from
  the real filesystem, and child processes whose `env` dropped the preload. Not a product
  defect; the probe itself is recorded above so the next pass can repeat it honestly.

## Remaining prioritised risks

1. **Unbounded spreads elsewhere, if a producer ever grows.** The threshold is measured: a
   single array of ≳62,000 items passed as arguments, or ≳125,000 for `Math.max(...shares)`.
   `checks.mjs:176` and `doctor.mjs:424` are structurally safe today only because their
   producers are bounded. Highest-value follow-up: a lint-style test that fails on
   `push(...`/`Math.max(...` applied to a non-literal array.
2. **Very large corpora beyond the fix's comfort.** `runChecks` now returns every finding and
   the verdict renders; memory and time still scale with the corpus (the 100,000-row corpus
   completed in a few seconds). There is no named size ceiling, so a future 10× corpus
   degrades in performance rather than with a diagnosis.
3. **The live browser path is unverified on this host.** The Chromium guard test is the one
   `UNSUP`, so everything about ADR-0118's end-to-end behaviour rests on unit-level guard
   tests here; CI is the only place it actually renders.
4. **Windows is reasoned about, not observed.** Finding 2 is Windows-specific and was fixed on
   reasoning alone; this machine cannot execute the `.cmd` shim, path or MAX_PATH behaviours
   the Windows CI leg covers.
5. **The signed-in disclosure surface (ADR-0035) is unchanged and unfixable here** — dispatch
   inputs are visible in the job log to anyone with a GitHub account.
6. **Single-site corroboration** — measured at 90.9% one-site closure in the root corpus; the
   kit warns, it does not refuse.
7. **`SIGKILL` leaks scratch** (uncatchable), and on Windows a programmatic signal behaves as
   `TerminateProcess`; bounded by the machine's tmp reaper.
8. **Wall-clock/mtime assumptions in lock staleness** — surfaced by the time-warp run: a
   machine whose clock jumps forward can treat a live lock as stale. By design, but worth
   knowing that the two clocks are compared.

## Hardening recommendations

- **"One aggregation, one loop."** The parser class got "one parser, one precedent" after two
  sibling defects; the same rule for array aggregation would have caught this one. A cheap test
  that every `push(...`/`Math.max(...` in `lib/` is applied to a literal, not an array, makes
  the class closed rather than patched.
- **Keep a large-corpus fixture in the suite.** The new 66,000-row test costs ~3s and is the
  only thing that would catch a regression here; the suite already spends 80s, so the trade is
  favourable.
- **When a helper's doc says "safe", fuzz the platform's own denial list** — reserved device
  names, trailing dots/spaces, MAX_PATH lengths. It found Finding 2 in a one-line probe.
- **Let the suite police its own claims** (it does): the stale README count was caught, named
  and given an exact fix by the build itself. Keep deriving documentation claims from the run.
- **Give a corpus a named ceiling if one is ever imposed** (`CORPUS-TOO-LARGE`), rather than
  letting an engine-level error be the first thing an operator sees.

## Summary

Two defects found and fixed, none reverted, plus one documentation claim the suite itself
flagged. Run 1 probed the build from every realistic direction — platform legs, contention,
interruption, hostile argv, hostile payloads, hostile corpora, SSRF classification, locales,
resource exhaustion, a time warp — and the only live failure was the large-corpus
`RangeError`, with a latent Windows-reserved-name contract defect beside it. The build's
resilience is high: 96 hostile CLI invocations with no stack trace, 5,376 parser probes with
no throw, three concurrent suites with no cross-talk, an interrupt that takes its scratch with
it, and every CI leg replaying green locally.

**Final state: `1408 passed, 0 failed, 1 unsupported in 79.8s`, exit 0** (the one unsupported
test is the live-Chromium leg this host cannot run). What remains open is not fragility in the
build but the honesty limits the project already documents — corroboration, disclosure, and
the platforms nobody here can execute.
