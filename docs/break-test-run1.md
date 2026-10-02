# Break test, Run 1 — probe and report (2026-10-02)

Change nothing; find realistic ways the build fails, prove each one, propose fixes.
Run 2 re-probes, fixes what it can and opens the pull request.

Host: Linux 6.1 x86_64 (2 vCPU, 3.9 GB RAM), Node v22.22.3, Python 3.11.2, git 2.39.5.
All commands run from `/home/user/Research-Kit` unless stated. Windows was not available
(see the coverage ledger).

---

## 1. Project and build overview

`Research-Kit` is a dependency-free Node ESM toolkit (no `package.json`, no lockfile, no
install step) plus three conformance runners duplicated in Python 3.11. The suite runs from
the repository checkout and asserts repository fixtures for its own repository, under
`node research-kit/bin/selftest.mjs`.

CI is `.github/workflows/offline-suite.yml`. Every step it runs:

| Job | Steps |
|---|---|
| `platform` (ubuntu-latest, ubuntu-26.04, windows-latest; Node 22, Python 3.11) | versions; no credentials are present; the commit hook is executable (non-Windows); the checkout is LF (Windows); **selftest**; publish the count; **preflight**; **release evidence examples**; **cross-language conformance** (3 Node/Python pairs, per-vector agreement); validator inputs are unchanged; derived files regenerate to their committed bytes (`timeline.mjs`, `export-warc.mjs`); the suite left the working tree clean |
| `node-lines` (Node 24, 26; Linux) | versions; selftest |
| `archive-tree` (ubuntu-latest, Node 22) | selftest from a `git archive` tree in a folder named `archive tree` (a space, no `.git`) |
| `suite` | the single required check; fails if any leg did |

Other workflows: `collect.yml` (dispatch-only, spends credits), `live-collection.yml`
(PAID tag), `action-pins.yml` (weekly; asks the GitHub API whether four pinned actions still
resolve).

### Baseline (before any probe)

```
$ cd /home/user/Research-Kit && time node research-kit/bin/selftest.mjs
1432 passed, 0 failed, 2 unsupported in 80.6s (watchdog 60000ms/test)

This host could not run:
  NO-BROWSER  browser-guard > LIVE: a real Chromium cannot be led into this machine's network by a script or a meta refresh
    no Chromium or Chrome on this host
  NO-BROWSER  browser-transport > LIVE: a page whose resource never arrives is captured at the deadline, not lost to the kill
    no Chromium or Chrome on this host

To pass a LOCAL run anyway, set RESEARCH_KIT_ALLOW_UNSUP=1; CI still blocks.

A red suite stops work. cwd: /home/user/Research-Kit (started in /home/user/Research-Kit)
real  1m21.695s
exit 1
```

**The baseline is red, with the cwd recorded above, and it is red for one reason**: this host
has no Chromium, so two design-blocking tests report `UNSUP`. `0` tests failed. The repository
documents the local opt-in for exactly this case (ADR-0108): the opt-out run is

```
$ RESEARCH_KIT_ALLOW_UNSUP=1 node research-kit/bin/selftest.mjs
1432 passed, 0 failed, 2 unsupported in 80.4s   exit 0
NOT a full pass: every test that ran passed, and 2 could not run on this host
```

CI never waives `UNSUP`, and CI has Chromium, so the two tests do run there. Probes below use
the opt-in where a green local run is needed; the failure count is quoted separately every time.

The rest of the CI sequence, run locally: `preflight` → `PASS 0 blocking, 0 warning(s), 29 passing`;
release examples → `PASS: 6/6 examples behaved as documented`; cross-language conformance →
`agree:` for all three vector files; `research-kit/conformance` + `research-kit/schemas`
unchanged; `timeline.mjs` → 60 events, `export-warc.mjs` → 55 records (27 captures); working
tree clean after it all. (`action-pins.yml` cannot run here: the sandbox's TLS interception
makes the GitHub API unreachable from `fetch`, the check reports `UNCHECKED` and exits 1,
which is its designed fail-closed behaviour.)

---

## 2. Prior work, and whether it still holds

Earlier passes: `docs/build-report-2026-09-17-hardening.md` (11 defects),
`docs/build-report-2026-09-29-break-test.md` (6 defects), and the fixes recorded in the
CHANGELOG under *Unreleased* dated 2026-10-01 (PR #193, #196, redone on `main`): lock
livelock → `LOCK_STUCK`, torn-tail/damaged-chain presentation, `skillRoots` type check,
`fetchFailure` URL redaction, `\p{Cf}` quote normalisation, the `comparison-row` linear
rewrite, `install-hooks --dry-run` parity, ADR-0120's commit gate, the browser render
timeouts.

Re-verified here, cheaply, from the current `main`:

| Prior finding | Probe | Result |
|---|---|---|
| Firecrawl `normalizeSearch` null row took the whole search | `normalizeSearch('{"data":{"web":[{...},null]}}')` | `rows: 1`, no throw — holds |
| Edit gate crashed on a payload of the wrong shape | `echo '{"cwd":42,"tool_name":"Edit"}' \| hooks/edit-gate.mjs` and `echo 'null'` | `permissionDecision:"allow"`, exit 0 — holds |
| Interrupted run left its scratch | SIGINT/SIGTERM/SIGHUP at 12 s | rc 130/143/129, `0` leftover dirs each — holds |
| `install --dry-run` reported prunes that were not there | fresh `HOME`, `install.mjs --dry-run` | `would prune: (nothing)` — holds |
| `collect-remote --max-pages abc` dispatched a paid run | same command | refused before dispatch, exit 3, names `"abc"` — holds |
| `makeSlug` exceeded its own cap | `makeSlug('', 'fallback', 5)` in `lib/core.mjs` | `"fallb"` — holds |
| Torn ledger tail named, not thrown | torn `.fetches.jsonl`, real run | `refusing to append onto a damaged chain`, exit 2 — holds |
| Lock judged stale and unremovable | `.fetches.lock` a directory, real run | `could not be removed (EISDIR)`, exit 2 after ~30 s — holds |
| Derived files regenerate to committed bytes | `timeline.mjs` + `export-warc.mjs` + `git status` | clean — holds |

---

## 3. Discovered failures

### F-1-1. A hand-edited machine config with a non-string `editGate.settingsPath` kills `install-hooks` with a raw `ERR_INVALID_ARG_TYPE` stack

- Label: **RAN**
- Severity / likelihood: **Medium / Plausible**
- Real trigger: an operator hand-edits `~/.agents/research-kit.config.json` to point the edit
  gate at another agent's settings file — the documented reason the key exists, beside
  `RESEARCH_KIT_EDIT_GATE_SETTINGS` — and leaves a value of the wrong type (`"settingsPath": 42`,
  `{}`, a list). The kit's own `shape()` type-checks every sibling key
  (`skillRoots`, `projectSkillDir`, `maxAgeDays`, `role`, `evidencePolicy`, `transport`, …)
  and `settingsPath` is the one it does not.

- Reproduction:

```
$ printf '%s' '{"editGate":{"settingsPath":42}}' > $HOME/.agents/research-kit.config.json
$ HOME=<scratch home> node .../install-hooks.mjs --edit-only
node:path:1457
    validateString(path, 'path');
    ^
TypeError [ERR_INVALID_ARG_TYPE]: The "path" argument must be of type string. Received type number (42)
    at Object.dirname (node:path:1457:5)
    at installEditGate (file:///home/user/scratch/home/.agents/research-kit/lib/installer.mjs:193:18)
    ...
Node.js v22.22.3
exit 1
```

- Root cause: `research-kit/lib/machine.mjs:117` —
  `settingsPath: raw.editGate?.settingsPath ?? DEFAULTS.editGate.settingsPath` — accepts any
  type. `runtimePaths()` passes it through (`machine.mjs:239`), and
  `installEditGate` reaches `ensureDir(path.dirname(file))` (`installer.mjs:193`) with the raw
  value. The CLI's `catch` calls `writeFailure(err)`, which does not recognise
  `ERR_INVALID_ARG_TYPE`, so it re-throws: a stack trace and Node's version footer, exit 1.
- Impact: the installer — the command that binds the gates — is unusable on that machine, and
  the failure names nothing an operator can act on. `doctor` does not crash on the same config
  but misreports it: `warn gate-edit not registered in 42`, i.e. it renders the bad value as a
  path instead of naming the config problem.
- Fix (proposed, one line plus a test): in `shape()`, take `settingsPath` only when it is a
  non-empty string, as `projectSkillDir` already does; and, in the same spirit as the
  2026-10-01 `skillRoots` fix, make `doctor` say the value is not a path rather than print it
  as one.
- Regression test (to be written in Run 2): `doctor > a settingsPath that is not a path is
  named, not passed to path.dirname` (or its natural home in the install-hooks CLI tests),
  shown red before the fix, green after.
- Suite after fix: to be recorded in Run 2.
- Status: **proposed**.

Sibling sweep: 19 CLIs × 11 hostile configs (all `shape()` keys, wrong-typed) and 19 CLIs ×
15 configs with `--help` → the only stack was this one, twice (`42` and `{}`). Every other key
is handled; `editGate.mode`, `role`, `evidencePolicy`, `transport`, `maxAgeDays`, `failOpen`,
`skillRoots`, `projectSkillDir` were all refused or defaulted without a throw.

### F-1-2. The collector appends to a ledger whose hash chain is already broken, spending budget into a corpus its own gate will reject

- Label: **RAN**
- Severity / likelihood: **Medium / Plausible**
- Real trigger: `research/raw/.fetches.jsonl` travels through git. A merge that interleaves two
  collectors' appends, a hand-edit that "fixes" a URL in the ledger, or a restore of a stale
  copy leaves a file whose lines all parse but whose `prev`/`entrySha256` links do not verify.
  The next collector run does not notice: it fetches, appends another entry to the broken
  chain, and exits 0. Every downstream gate then refuses the corpus.

- Reproduction (scratch project; the page is served from `python3 -m http.server` on
  `127.0.0.1`, so nothing is spent and no vendor is involved):

```
# 1. a genuine first entry
$ node research-kit/bin/research.mjs --plan research/plan.json
  collected http://127.0.0.1:8123/page.html - first capture       exit 0, ledger 1 line

# 2. hand-break the chain with a syntactically valid entry (all lines still parse)
$ python3 -c '... e2 = dict(e1); e2["seq"]=2; e2["prev"]="nonsense-not-a-hash" ...'
ledger now 2 entries; entry 2 prev = nonsense-not-a-hash

# 3. a NEW url, so a real fetch and a real append happen
$ node research-kit/bin/research.mjs --plan research/plan.json
  collected http://127.0.0.1:8123/page3.html - first capture      RUN_RC=0
ledger lines: 3
appended: seq 3 | op scrape | url http://127.0.0.1:8123/page3.html | prev cafebabe

# 4. the gate's verdict on the corpus the run just extended
$ node research-kit/bin/handoff.mjs
handoff FAILED
  handoff-chain-broken  prev: prev does not link to entry 1
  handoff-chain-broken  entry-hash: entrySha256 does not recompute for seq 2
HANDOFF_RC=1
```

- Root cause: `appendFetch` (`research-kit/lib/provenance.mjs:314-340`) validates the ledger
  only for *unparsed* lines (`ledger.problems`, which `readLedger` fills in
  `lib/corpus.mjs:322-340`) and for a missing trailing newline. Chain links are verified by
  `handoff`/`preflight`/`doctor`, never before the collector writes. The pre-append comment
  says the intent — *"Never spend before establishing that the result can be recorded"* — but
  "recordable" here means "the line parses", not "the chain still verifies".
- Impact: credits spent and captures added to a corpus that cannot pass its own gate; the
  operator learns it after the spend, from a different command. The new entry itself links to
  the *stored* (wrong) hash, so the file does not become worse — it simply grows past a point
  that no repair may fix (`doctor --fix-arity` refuses a break before the tail by design:
  `no repair made: chain-broken-before-tail … no repair may invent a link`).
- Fix (proposed, **not applied**): refuse to append when the chain does not verify from the
  genesis entry, with the same named-refusal shape as `LEDGER_DAMAGED`/`LEDGER_TORN_TAIL`
  (`NAMED_RUN_REFUSALS`, `lib/core.mjs:528-531`). Any such refusal is a **new check**, and
  AGENTS.md freezes new checks (ADR-0117) unless an ADR lifts the freeze for that item: it is
  proposed for an ADR, not applied here. A cheap version, if an ADR lifts it: verify the last
  entry's `entrySha256` recomputes before appending (`seq`/`prev` are already derived from the
  same read), which catches the single-edit case this probe used.
- Regression test (proposed): a project whose ledger holds a valid genesis entry plus one
  hand-broken entry; a run with a new URL must refuse (exit 2) and append nothing, and the
  same fixture must still let a *clean* ledger collect.
- Suite after fix: not applicable (not applied).
- Status: **proposed** (feature-frozen check).

---

## 4. Coverage ledger

| Catalogue area | Status |
|---|---|
| Fresh clone | probed: green — clone at a path with a space and non-ASCII (`rk main — ünïcode`), `1432 passed, 0 failed, 2 unsupported`, rc 0 |
| Shallow clone `--depth 1` (what `actions/checkout` makes) | probed: green, same counts |
| `git archive` tree instead of a checkout | probed: green — no `.git`, folder named `archive tree` |
| Lockfile missing/stale; version ranges; peer/transitive conflicts; install with no network | not probed, N/A: there is no `package.json` and no dependency tree anywhere (pure Node ESM, no install step) |
| Runtime versions: oldest and newest claimed | partially probed: Node 22.22.3 only — the sandbox has one Node line. Node 24/26 are CI legs; Run 2 attempts a scratch download |
| Pinned CI actions still resolve | not probed: `check-action-pins.mjs` reports `UNCHECKED … unable to verify the first certificate` (sandbox TLS interception) and exits 1, its designed fail-closed behaviour; a pass needs real GitHub access |
| `HOME` unset/empty/hostile | probed: green (`env -u HOME` full run) |
| `TMPDIR` unset/relative/read-only/spaces/non-ASCII | probed: green for spaces+non-ASCII+nonexistent; the read-only and 1 MiB-tmpfs ENOSPC cases were probed by the 2026-09-29 pass and are re-confirmed only by their tests |
| `PATH` unset/empty | not probed: `node` itself is resolved through `PATH`; an unset PATH cannot start the suite at all and would prove nothing about the kit |
| Repository path with spaces/non-ASCII | probed: green |
| `TZ`, `LANG`, `LC_ALL` | probed: green under `LC_ALL=C LANG=C TZ=Pacific/Kiritimati`; another locale is not installed on this host |
| Missing/invalid env vars; stray real-looking keys | probed: green with fake `SERPAPI_API_KEY`/`FIRECRAWL_API_KEY`/`TAVILY_API_KEY` |
| `umask 077`, low `ulimit -n`, small heap, ENOSPC | partially probed: green under `umask 077` and `ulimit -n 64`; small heap and ENOSPC not probed here (no root to mount a small filesystem; the 2026-09-29 pass covered both) |
| Windows realities (CRLF, separators, reserved names, `kill`) | not probed: no Windows host. A `core.autocrlf=true` clone on Linux was probed green, and `git ls-files --eol` shows 0 CRLF files in the worktree |
| Two suites at once | probed: green — both `1432 passed, 0 failed, 2 unsupported` in 86.6 s, 0 leftovers |
| Interrupting a run (SIGINT/SIGTERM/SIGHUP) | probed: green — rc 130/143/129, 0 leftover dirs |
| stdout closed early (`| head -1`) | probed: green — 1 line out, 0 stderr lines, no EPIPE |
| stdin a terminal or closed | not probed end-to-end (tests cover `gate --staged-stdin` and the MCP loop); Run 2 |
| Races on shared files/ports/caches | probed: green — concurrent suites; one lock holder (below) |
| Flaky tests (≥3 runs compared) | probed: 9 full runs today, identical counts each time (80.4–86.6 s) |
| Vendor CLI/API/hook payloads (null rows, wrong types, empty, huge, invalid UTF-8, BOM) | probed: 990 parser/payload combinations + 17 Wayback payloads, 0 throws; plus the prior pass's browser/extractor fuzzing |
| Config/data files: truncated, empty, wrong type, deep, huge | probed: 15 hostile machine-config shapes × 19 CLIs + 11 × 19 real runs → the one stack in F-1-1; hostile ledger entries (`null`, `42`, arrays, wrong-typed fields) → `handoff`/`preflight`/`timeline`/`export-warc`/`doctor` all clean |
| CLI flags: missing values, wrong types, out of range, unknown | probed: 32 invocations, no raw stack; missing `--into`/`--out`/`--plan`/`--mode`/`--role` values all refused by name |
| Dry run == real run | partially probed: `install --dry-run` writes 0 files and reports `(nothing)` to prune; the real deploy writes 267 files + the skill link; `research --dry-run`'s budget line matches the real run's; `decompose`/`install-hooks` dry-run parity was fixed 2026-10-01 and is pinned by tests |
| Generated files regenerate to committed bytes | probed: green (`timeline.mjs`, `export-warc.mjs`, `git status` clean) |
| The suite leaves the working tree clean | probed: green (all 9 runs) |

Two probes that appear nowhere in the task's catalogue:

1. **A live lock, end to end.** A kit-format lock naming a live pid on this host blocked a real
   run for exactly 120 s and then refused: `the collector's exclusive section is still held
   (pid … is alive) … A live pid is never evicted automatically`, exit 2, ledger and captures
   untouched, lock left for the operator. A directory in place of the lock was refused after
   ~30 s with `could not be removed (EISDIR)` and `rm` instructions.
2. **Every CLI in a directory that is not a project.** 16 commands, no raw stack: rc 2 from the
   project-requiring ones; `bundle`/`preflight`/`prior` answer something and exit 0;
   `handoff`/`doctor` exit 1 with their own tables; `disclosure` refuses missing arguments with 3.
   `new-project.mjs` with no arguments scaffolded the empty directory in place (by design, but
   it means a sweep that runs it stops sweeping a non-project).

---

## 5. Proof of no change

```
$ git status
On branch arena/01a0fae8-research-kit
Untracked files:
  (use "git add <file>..." to include in what will be committed)
	docs/break-test-run1.md

nothing added to commit but untracked files present (use "git add" to track)

$ git diff --stat
(no output)
```

`docs/break-test-run1.md` is this report. Everything else the probes wrote lives under
`/home/user/scratch/`; the two files my own flag sweep left in the repository
(`42/` from a deliberate `install --into 42`, and `research/audits/…v0.1-2026-09-14.zip` from
`audit --zip`) were removed, and `git status` above is the state after their removal. No tracked
file was modified, and no fix has been applied yet.
