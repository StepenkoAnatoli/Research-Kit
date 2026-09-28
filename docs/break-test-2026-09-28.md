# Break test — 2026-09-28

Aggressive hunt for realistic build failures, with fixes applied only where the suite
stayed green. Every fix below was followed by a full `node research-kit/bin/selftest.mjs`
run; anything that went red was reverted, and the two that did are named in *Rejected
fixes*.

**Repository state at the end:** 1185 passed, 0 failed, exit 0. `preflight` PASS.
`handoff` OK. Working tree clean. Branch `arena/01a0e8df-research-kit`.

---

## Project & build overview

| | |
|---|---|
| Shape | Node.js ESM, no `package.json`, no dependencies. Standard library only. |
| Language mix | Node (product) + Python 3.11 (three conformance runners, kept byte-compatible with Node by CI) |
| Test suite | `research-kit/test/*.test.mjs`, 90 files, run by `node research-kit/bin/selftest.mjs` |
| Runner | `test/harness.mjs` — awaits every test, races each against a 60 s watchdog, counts an unmet host capability as blocking (`UNSUP`) rather than a skip |
| CI | `.github/workflows/offline-suite.yml` — matrix `ubuntu-latest` / `ubuntu-26.04` / `windows-latest` × Node 22, plus Node 24 and 26 on Linux. No credentials, no network. |
| Other CI steps | preflight, release-evidence example, **cross-language conformance** (Node vs Python per vector), "validator inputs are unchanged", "the suite left the working tree clean" |

**The test command used throughout:** `node research-kit/bin/selftest.mjs`
(it also fails the run if `research-kit/README.md`'s stated test count drifts, so the
count was corrected with each new test).

**Baseline before any change:** 1178 passed, 0 failed in 48.8 s.

**Hostile conditions probed (all green, no fix needed):** run from a subdirectory;
leaked `GIT_DIR` / `GIT_WORK_TREE` / `GIT_INDEX_FILE`; `TZ` and `LC_ALL=C`; three suites
in parallel; a project path containing spaces, non-ASCII, or 20 levels of nesting; a
project reached through a symlink; a project containing a symlinked directory;
`--help` on all 26 entrypoints; an unknown flag on all 26 entrypoints (found one defect,
below); 20,000 mutated ZIP archives through `openZip`; 60,000 random JSON strings
through the custom parser and both canonicalisers; 8 concurrent OS processes × 25 ledger
appends (201 lines, no duplicate `seq`, chain verifies); `SIGKILL` mid-append at 30/120/400 ms
(stale lock recovered by pid liveness, chain stays intact); 40 MB junk ledger, 60 MB capture,
invalid UTF-8, a capture filename containing a newline, `chmod 000` on `research/raw/`,
`DISCOVERY.md` as a directory, a 200,000-deep `plan.json`.

---

## Discovered failures & actions

### F-1 — A file with no end in `research/raw/` hangs or OOM-kills every entrypoint
**Severity: Critical** (impact) × Low (likelihood) → **High overall**

- **Repro.** `mkfifo research/raw/<capture>.md` (or symlink a capture or the ledger to
  `dev/zero`), then run `node research-kit/bin/handoff.mjs`.
- **Observed.** A fifo: `handoff`, `preflight`, `audit`, `doctor`, `brief` and the commit
  `gate` all block in `open()` until killed — and `git commit` hangs with them. A ledger
  symlinked to `dev/zero`: all of them die inside libstdc++ with `std::bad_alloc`,
  SIGABRT. Neither prints a diagnostic; a hang prints nothing at all.
- **Root cause.** `readText` / `sha256File` / the ledger's body-hash read called
  `fs.readFileSync` on whatever sat at the path, with no file-type check. Depth of nesting
  was already treated as a property of the input (`canonicalJson`); file type was not.
- **Fix.** `isRegularFile(p)` in `lib/core.mjs` (`statSync`, so symlinks to real files are
  still followed). `readText` and `sha256File` refuse anything else without opening it;
  `verifyLedger` reports a non-regular capture as `raw-unreadable` before opening it.
- **Test result.** 1180 passed, 0 failed. **Applied.**

### F-2 — Python canonicalised big integers with digits JavaScript cannot represent
**Severity: High**

- **Repro.** Differential test: 3,926 generated JSON structures canonicalised in Node
  (`lib/release/canonical.mjs`) and in Python (`bin/conformance_common.py`).
- **Observed.** 107 disagreements, every one of them an integer outside ±2⁵³:
  `9007199254740993` → Node `9007199254740992`, Python `9007199254740993`;
  `123456789012345678901234567890` → Node `1.2345678901234568e+29`, Python the digits.
- **Root cause.** `js_number` is only reached by a value Python parsed as a `float`.
  `json.loads` parses an integer literal as an `int`, which is arbitrary precision, so
  `str()` printed the digits the author wrote. The canonical bytes are what get hashed, so
  the two languages disagreed about whether a record verifies — the one property that
  shared module exists to hold. No shipped vector carried such an integer, which is
  exactly why the chosen inputs looked like agreement; this is the 2026-09-20 float
  divergence again, one type over.
- **Fix.** In `canonical_json`, an `int` outside ±2⁵³ is routed through
  `js_number(float(value))`. Integers inside the range still go through `str()`, so the
  fix cannot rewrite a small one.
- **Test result.** 1182 passed, 0 failed; differential re-run: **0 disagreements out of
  3,926**; the CI cross-language step re-run by hand for all three vector packets → agree.
  **Applied.**
- **Reverted-check.** Both new tests were run with the patch backed out: they fail with
  `Node produced 9007199254740992, Python produced 9007199254740993`.

### F-3 — `mcp-server.mjs` accepted every argument and read none
**Severity: Medium**

- **Repro.** `node research-kit/bin/mcp-server.mjs --zzz-not-a-flag` → prints its banner
  and starts serving, exit 0. Every other entrypoint exits 2.
- **Root cause.** A stdio server's configuration is its environment, so it declares no
  flags — and therefore checked none. It cannot use `refuseUnknownFlags`, which names the
  options an entrypoint *does* accept; here that list would be empty.
- **Impact.** Two concrete forms: a client configured with `--directory /some/project`
  (the spelling other MCP servers take) collects somewhere else in silence; and
  `--token <secret>` both puts a credential in the process table and is discarded, so every
  tool then refuses with "no token" — a permission error that reads as the kit's fault.
- **Fix.** Refuse any argument with exit 2 and a message naming it, placed after the
  `--help` block and before `requireRuntime` / `honourEnvProxy`. Verified that the proxy
  re-exec (which re-spawns with `argv` preserved) adds nothing to `argv.slice(2)`, so it
  cannot trip the new check.
- **Test result.** 1184 passed, 0 failed. **Applied.**

### F-4 — `renderTable` crashed past ~124,000 rows; a broken `TMPDIR` was reported as "git is not installed"
**Severity: Low** (both)

- **Repro / observed.**
  - `renderTable` built each column width with `Math.max(header, ...rows.map(...))`, which
    passes one **argument** per row. Measured: 50,000 rows render, 200,000 throw
    `RangeError: Maximum call stack size exceeded` — a raw stack trace where a report
    belongs.
  - `test/handoff.test.mjs` probed for git with `cwd: os.tmpdir()`. With `TMPDIR` pointing
    at something unusable the spawn itself fails, so the suite reported
    `no-git: git is not installed` — a false claim about the machine, printed in the one
    place somebody reads to find out why the run is red.
- **Fix.** A fold instead of the spread; `requireGit` instead of the local probe.
- **Test result.** 1185 passed, 0 failed. **Applied.**

---

## Successfully applied fixes

| # | Fix | Files | Test result |
|---|---|---|---|
| 1 | Refuse non-regular files before opening them (`isRegularFile`, `readText`, `sha256File`, `verifyLedger`) | `lib/core.mjs`, `lib/provenance.mjs`, `test/corpus.test.mjs` | 1180 passed, 0 failed |
| 2 | Python renders integers outside ±2⁵³ the way JavaScript parses them | `bin/conformance_common.py`, `test/canonical-float-policy.test.mjs` | 1182 passed, 0 failed |
| 3 | `mcp-server.mjs` refuses any argument | `bin/mcp-server.mjs`, `test/mcp.test.mjs` | 1184 passed, 0 failed |
| 4 | `renderTable` fold instead of spread; honest git capability probe | `lib/render.mjs`, `test/cli.test.mjs`, `test/handoff.test.mjs` | 1185 passed, 0 failed |

Each commit also carries its `docs/ARCHITECTURE.md` row update (standing protocol rule 1)
and the `research-kit/README.md` test count, which `selftest.mjs` enforces.

## Rejected fixes

**None of the four fixes had to be reverted.** Two *candidate* fixes were considered and
deliberately **not applied**:

- **Verify ZIP entry CRC-32 in `lib/artifact-zip.mjs`.** `readEntry` reads the
  `crc32` field from the central directory and never recomputes it. Rejected as
  redundant: `lib/artifact-validator.mjs` requires every archive entry to be declared in
  the manifest and checks each one's SHA-256 against it, and the manifest itself is
  covered by `manifest.sha256`. An attacker who can alter entry bytes can alter the CRC
  with them. Adding it would be a check that cannot fail where the hash check does not
  already fail harder.
- **Refuse unpaired surrogates in `core.mjs`'s `canonicalJson`.** It renders a lone
  surrogate as `"\ud83d"`, while `release/canonical.mjs` refuses one. Rejected: they serve
  different contracts — `core.mjs` hashes the fetch ledger, which the kit writes itself
  and whose entries are URLs, hashes and ISO dates; `release/canonical.mjs` hashes release
  records and **is** the pair CI compares against Python, where both sides refuse. There
  is no cross-language counterpart for the fetch ledger to disagree with, and
  `JSON.stringify`'s well-formed escaping means the output is valid JSON either way.

---

## Remaining prioritized risks

Ranked by severity × likelihood × impact. **None of these is a defect found in a green
run** — they are the things a hostile host or a large corpus could still break.

1. **High — an unusable `TMPDIR` produces ~591 red tests with one cause.** The runner
   detects and announces it up front, and repeats it under the red summary, so the
   diagnosis is available; but the count is still 591 failures for one environmental
   fault, and a CI log that long hides the one line that matters. *Hardening:* exit 2 with
   the temp-folder message before running any test, rather than running and failing them.
   (Deliberately not changed here: the current design is explicit — "the run still
   happens, so the count and the result file stay honest" — and changing it changes what
   CI reports for a genuinely broken runner.)

2. **Medium — `bodyHashOf` in `lib/collect.mjs` still calls `fs.readFileSync` directly.**
   F-1's guard was applied at the read funnel (`readText`, `sha256File`) and at the
   verifier, not here. It hashes a file the collector has just written, so a non-regular
   file can only appear if the write path is subverted; the exposure is much smaller, but
   it is the one unguarded read left on the capture path.

3. **Medium — `core.mjs` `canonicalJson` and `release/canonical.mjs` `canonicalJson` are
   two implementations with one name.** They already disagree on unpaired surrogates. Any
   future edit to one is a silent divergence in the other's domain. *Hardening:* rename or
   merge them, or add a test that asserts the domains are disjoint.

4. **Medium — no coverage at all for `lib/git-config.mjs` and `lib/render.mjs`'s
   non-table helpers**, and only one test file each for `installer.mjs`, `config.mjs`,
   `similarity.mjs`, `dimensions.mjs`, `dispatch.mjs`. These are the least-exercised
   surfaces in the kit.

5. **Low — Windows is untested for the fifo case.** The new fifo regression test falls
   back to a directory on Windows because a fifo cannot be made there; the guard is still
   exercised, but the specific "blocks in `open()`" failure is only pinned where POSIX
   runs.

6. **Low — `RESEARCH_KIT_HOME` is not sanity-checked.** `kitHome()` resolves it with no
   floor, so `RESEARCH_KIT_HOME=/` makes the installer's target the filesystem root and
   `agentsHome()`'s parent `/`. A CI job that interpolates an unset variable into it
   produces `/.agents/research-kit` rather than failing.

7. **Low — `research-kit/bin/__pycache__` is written by every conformance run.** Ignored
   by `.gitignore`, so the "working tree clean" CI step passes, but the suite still leaves
   a directory behind in the source tree. `PYTHONDONTWRITEBYTECODE=1` on the Python
   children would remove it entirely.

---

## Hardening recommendations

1. **Make an unusable temp folder a startup refusal (exit 2), not 591 failures.** Keep the
   message identical; it is already the right one.
2. **Route `bodyHashOf` through `sha256File`**, closing the last unguarded read on the
   capture path, and add a fifo case to the collector's tests.
3. **Collapse the two `canonicalJson`s**, or give them distinct names and a test asserting
   their domains never overlap. This is the same duplication that produced the 2026-09-20
   divergence and today's F-2.
4. **Validate `RESEARCH_KIT_HOME`** — refuse a value that resolves to a filesystem root or
   to a path the installer would have to create more than one level of.
5. **Set `PYTHONDONTWRITEBYTECODE=1`** on the Python conformance children so the suite
   leaves nothing behind at all.
6. **Add the fifo/device case to the CI platform matrix explicitly** (a Linux-only step is
   fine) so the "blocks in `open()`" property is asserted on every commit rather than only
   where a break-test remembers to look.
7. **Keep differential testing in CI, not just in break-tests.** F-2 was invisible to 28
   chosen vectors and visible immediately to 3,926 generated ones. A small generator
   (a few thousand structures per run, seeded and deterministic) turned into a permanent
   test would make this class of defect structurally impossible to reintroduce.

---

## Summary

**Overall build resilience: high, and now measurably higher.** The kit was already
hardened against most of what was thrown at it — the ledger's `O_EXCL` lock held under
8 concurrent OS processes and recovered cleanly from `SIGKILL` at three different points
mid-append; the ZIP reader survived 20,000 mutated archives without a single unexpected
error; the MCP stdio loop bounds its line buffer; every entrypoint but one refused an
unknown flag; the suite itself is immune to leaked git context, a foreign cwd, a hostile
locale and parallel runs.

What this session added is four real defects, three of them reachable in ordinary
operation:

- one **silent hang / OOM crash** on the corpus-verification path, which is the path the
  commit gate runs on every commit (F-1);
- one **cross-language hash divergence** in the module whose entire purpose is to prevent
  cross-language hash divergence, found only because 3,926 generated inputs were compared
  instead of 28 chosen ones (F-2);
- one **silently ignored option** on the MCP server, the last entrypoint in the kit that
  had one (F-3);
- one **crash ceiling** in the report renderer and one **false capability diagnosis** in
  the suite (F-4).

The pattern worth naming: all four are cases where the code trusted a property of its
input — that a file has an end, that an integer survives a parse, that an argument is
one it knows, that a row count is small. Each had been fixed once already in a
neighbouring form (recursive canonical JSON, the stdio line buffer, the unknown-flag
refusal, the `O(n²)` staged-path loop), which is a sign the fixes are being made per
instance rather than per class. Recommendation 7 is the one that would change that.
