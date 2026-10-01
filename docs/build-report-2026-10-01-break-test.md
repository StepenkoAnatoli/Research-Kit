# Build report — break-test, 2026-10-01 (two passes)

> **How this report is organised.** It was asked for as two runs, and it was run as two runs.
> **Pass 1 was report-only**: every probe ran, every finding was written down, and no product
> file was touched — the working tree ended that pass exactly as it started. **Pass 2** probed
> the ground pass 1 had not reached, then applied the fixes one task at a time, running the
> full suite after each and reverting any change that left it red. Six defects were found; all
> six are fixed; nothing was reverted for cause. The two passes are labelled throughout, so a
> reader can tell a measurement from a remedy.

An adversarial pass over the whole build, looking for realistic ways it fails and applying only
the fixes that leave the suite green. It follows
[the 2026-09-29 break-test](build-report-2026-09-29-break-test.md), and starts where that one
stopped: the same ground was **not** re-probed for its own sake, and where it was re-probed the
result is reported as a confirmation rather than as a finding.

**How the build is run.** One command, offline, no key and no network:

```
node research-kit/bin/selftest.mjs
```

CI adds `preflight`, the release-evidence examples, the Node/Python cross-language conformance
pair, the regeneration of the corpus's derived files, "a validator mutated none of its own
inputs" and "the suite left the working tree clean". All of those were run locally too, before
the first change and after the last.

**Baseline, before anything was touched (pass 1).** `1411 passed, 0 failed, 1 unsupported in
91.9s`. The unsupported test is `NO-BROWSER`: this host has no Chromium, so the one live
browser-guard test cannot run. On such a host a plain `selftest.mjs` exits **1** — an
unsupported test blocks, by design (ADR-0108) — and `RESEARCH_KIT_ALLOW_UNSUP=1` is the
documented local waiver, which CI ignores. Every count in this report is a waived local run
unless it says otherwise; the failure count, which is the one that matters, is 0 in all of them.

**Final state (end of pass 2, on the base commit `427de81`).** `1419 passed, 0 failed,
1 unsupported` — eight new tests, one per defect, two of them pinning a defect from both ends.
`research-kit/README.md` then said `1420 tests, offline`, which is the number the runner itself
checks. Both numbers moved when `main` was merged in after the pull request opened: on the merged
branch the count is **1427**, and this host reports `1425 passed, 0 failed, 2 unsupported`. See
the postscript at the end — the six findings and their fixes are unchanged by it.

---

## Pass 1 — what was probed, and what held

Report-only. Everything in this section was reproduced, and nothing here was changed.

### The suite's own robustness

| Probe | Result |
|---|---|
| **Every test file run alone** (74 files, one process each, no neighbours) | 74/74 green, and the sum of the isolated counts is **1411 — exactly the full run's**. No test depends on another's order, its scratch, or its module state |
| A checkout reached through a **symlink** (`/tmp/repo-link -> the clone`) | 1411 green |
| A checkout whose path holds **`#` and `%`** (`/tmp/p#1%pct/repo`) | 1411 green |
| A **read-only** working tree (`chmod -R a-w` over the whole clone) | 1411 green in 73.6s — the suite writes nothing it is judging |
| A **`git archive` tree** (no `.git`, as one CI leg runs it) | 1411 green, and `preflight` PASSes in it |
| Six full runs across the two passes, no repetition of a failure | no flake observed: the same count every time |

### The machine it runs on

| Probe | Result |
|---|---|
| **No `git` on PATH** | `doctor`: `fail git — git is not on PATH - the commit gate cannot install`, with the fix; `preflight` and `gate` still answer, no stack |
| **No `python3` on PATH** | 11 tests report `PYTHON-NOT-FOUND`, each naming what could not be checked; the run says "NOT a full pass" rather than going quietly green |
| `LC_ALL=C LANG=C`, `TZ=Mars/Olympus`, `HOME=.` (relative), `GIT_CONFIG_GLOBAL` pointing at nothing, `GIT_CONFIG_COUNT/KEY_0/VALUE_0` injection, `GIT_DIR`/`GIT_WORK_TREE` aimed at another repository | green or named; the suite strips leaked git context itself (the harness says so on stderr) |
| A **hostile global gitconfig**: `core.fsmonitor = /bin/false`, `hooks.path = /nonexistent`, `init.templateDir = /nonexistent`, a `safe.directory` naming somewhere else | `doctor`, `preflight`, `gate` and `install-hooks --help` all answer normally |
| `RESEARCH_KIT_RESULT_FILE` = a directory, and = a path in a folder that does not exist | named on stderr ("could not be written: EISDIR / ENOENT"), the run still authoritative, exit 0 |
| `NODE_OPTIONS=--max-old-space-size=32` | green |
| 14 hostile machine-config shapes: `RESEARCH_KIT_HOME` = `/etc/passwd`, relative; `RESEARCH_KIT_CONFIG` = missing, a directory, malformed, an array, `{"__proto__": …}`; `RESEARCH_KIT_INSTALL_STATE` = `/dev/null`, a directory; `RESEARCH_KIT_TRANSPORT`/`_SEARCH_TRANSPORT` = `bogus`; `RESEARCH_KIT_BROWSER` = `/bin/false`, a directory; `RESEARCH_KIT_EDIT_GATE_SETTINGS` = a directory | all named. `doctor` fails a bogus transport by name; `research.mjs` exits 2 listing the transports that exist. **One exception — finding 4** |

### The deployed kit (the "healthy install fails" class)

| Probe | Result |
|---|---|
| `install.mjs` into a fresh `HOME`, then **diff the mirror against the source** | 267 files each way, **no file missing and none extra** |
| All **26 CLIs** from the installed kit, `--help` and no-args | no raw stack, and every exit code inside the documented 0/1/2/3 |
| The same 26 in a **real scaffolded project** (`preflight`, `audit`, `decompose --dry-run`, `timeline`, `export-warc`, `measure`, `handoff`, `brief`, `bundle`, `prior`, `gate`, `evidence-context`, `path-authority`, `property-replay`, `artifact`, `disclosure`) | every one answers; `selftest` refuses by name and points at `doctor`, which is the 2026-09-28 fix holding |
| `export-warc` in a scaffolded project | its output is ignored by the project's own `.gitignore` (line 27) — the derived-file class the CI step exists for |

### The boundary the kit does not own

| Probe | Result |
|---|---|
| **Conformance vector packets**, 9 hostile shapes × 3 runners × 2 languages: missing file, a directory, empty, an array, malformed JSON, no `--vectors` at all | every one a named refusal with a message and exit 1. **No Python traceback in any of them** |
| `PYTHONHASHSEED=random`, `LC_ALL=C` on the Python runners | byte-identical `reportSha256` — the report is not at the mercy of hash order or locale |
| **MCP server**, 18 hostile framings: truncated JSON then EOF, two requests on one line, a batch array, a notification, an unknown method, `id` as an object / null, `method` as a number, `params` as a string, `__proto__` in params, CRLF, a NUL byte inside the line, invalid UTF-8, a **10 MB single line**, **2,000 pipelined requests**, a **200,000-deep** nested string, empty stdin | all answered or ignored, exit 0, no stack. The 2,000 pipelined requests came back as 354 KB of responses |

### The corpus, hostilely edited (23 new states)

A copy of this repository's own PASSing corpus, one mutation at a time, `preflight` after each:

| Mutation | Answer |
|---|---|
| A duplicated evidence ID | `fail hygiene/duplicate-id — E-01 is used twice` |
| A row with an extra cell | named, and the extra cell is not read as a path |
| A row with a **missing** cell | `warn corpus-shape/table-arity — row has 5 cells, header has 6`; **blocking under `--strict`** |
| A raw `|` inside a cell | `fail citations/url-mismatch`, naming both URLs |
| A capture replaced by a symlink to another capture **inside** the project | `fail citations/url-mismatch` |
| A capture replaced by a symlink to **`/etc/passwd`** | `fail citations/raw-missing` — not read |
| Ledger `at` in the future, non-ISO (`"yesterday"`), a duplicated `seq`, a URL that is not the capture's | future/non-ISO: `warn provenance/timestamp-agreement`; duplicated seq: `fail provenance/chain-intact — expected seq 33, found 32`. **The URL: nothing — risk 5** |
| A NUL byte in `EVIDENCE.md` | 29 named failures, no crash |
| A BOM mid-file | parsed |
| `kit.json` malformed / **absent** | malformed: `fail corpus-shape/kit-unparsed`, naming the consequence; absent: PASS, which is documented (`scaffold.mjs` lists it `required: false`) |
| A capture with no front-matter, and one with a duplicated front-matter key | `fail provenance/body-unmodified` / `fail citations/url-mismatch` |
| A discovery status in lowercase (`closed`), and an unknown one (`MAYBE`) | lowercase accepted; `MAYBE` fails by name |
| `research/` itself a symlink to a real folder inside the project | PASS |
| Two captures differing only by case | PASS on Linux; **see risk 7** for what that means on Windows |
| A capture of 100,000 lines | `fail provenance/body-unmodified`, 1.2s |
| 20,000 discovery rows / 20,000 evidence rows | PASS in 1.1s / 2.0s, the second printing all 20,000 warnings |

### The network guards (offline, against a local server)

A server on `127.0.0.1:8099`/`8100` with routes for a redirect to a second internal host, a
redirect to `169.254.169.254`, a redirect to `file:///etc/passwd`, 4 KB of binary, a 40 MB body,
a content-length lie, an 8 KB header, and a route that never answers.

| Probe | Answer |
|---|---|
| Redirect to `file:///etc/passwd` | `a redirect to a file: URL is not followed` |
| 4 KB of `application/pdf` bytes | refused **by content type**, with the two ways forward named |
| A 40 MB body | `the page is larger than 16 MiB - not read (ADR-0082)` |
| A content-length that lies | `terminated (other side closed)` |
| An 8 KB response header | collected normally |
| Internal-address **first hops** — `127.0.0.1`, `localhost`, `[::ffff:127.0.0.1]`, `2130706433`, `127.1`, `0177.0.0.1`, `0.0.0.0`, `169.254.169.254` | **all fetched.** This is ADR-0110's recorded decision, not a defect — but see risk 2, because the metadata endpoint answered this sandbox `HTTP 401`, which means the request was sent |
| A redirect from an allowed internal hop to a **different** internal host | followed with no check — risk 3 |

### The collector's exclusive section

| Probe | Result |
|---|---|
| A lock whose pid is **dead** | recovered at once, run completes in 1s |
| A lock held by a **live unrelated pid** | waited out `LOCK_WAIT_MS` (120s) and refused with a message that names pid reuse, prints the `ps` command to check it, and says why eviction is not automatic — **but as an uncaught throw: finding 6** |
| A lock file that is a **directory** | **hangs: finding 5** |
| A stale lock in a **read-only `research/raw`** | **hangs: finding 5** |
| Two collectors on one project at once, four pages | both exit 0, 4 ledger entries, seqs 1–4 with no duplicate, **no chain break**, evidence IDs unique |
| A **SIGKILL** mid-collection, then the next run | the lock survives with a dead pid and the next run recovers it and completes — the crash path holds |

---

## Discovered failures, and what was done

Six. Each was found in pass 1 or pass 2 as labelled, and fixed in pass 2.

### 1. One rule in the extractor was quadratic in a captured page's length — pass 1

**Repro**

```
node -e '...' # a markdown table whose row is 400 KB of prose holding the word "tier"
firstFinding(page)   ->  24,147 ms
                       100 KB -> 1,585 ms;  200 KB -> 5,983 ms;  400 KB -> 24,147 ms
```

**Root cause.** `COMPARISON_ROW_TEST` in `lib/finding.mjs` ended with
`\b(plan|tier)\b.*\b(month|year|user)\b.*\d`. On a row that does **not** match, every tier word
starts a scan that runs to the end of the row before it can fail, so the cost is (number of tier
words) × (row length). The rule is asked **twice** per table row — as `comparison-row`, and
negated as `table-row` — and only when the row has fewer than three `": "` pairs, which is a
one- or two-column table: exactly the shape a converter emits for a page that is really a blob.

**Severity: High.** `firstFinding` runs over **every page the collector fetches**
(`lib/collect.mjs`) and over every row the artifact producer re-reads (`lib/artifact.mjs`). The
input is a vendor's page, so its length is nobody's choice here, and this repository's own corpus
already holds a capture with a **single 308,705-character line**
(`docs/decisions/2026-09-27-mcp-protocol-versions/research/raw/2026-09-27-sdk-npmjs-810cfab3.md`)
and table rows to 23,211 characters. Extrapolated, a 1 MB row is ~150 s — past the commit gate's
120 s watchdog, which turns one large page into a killed gate and a fail-open/fail-closed
decision, and into a collection that looks hung.

**Fix.** Three linear scans answering the identical question, per line (`.` never crossed one),
with the `": "` count still short-circuiting first.
**Tests:** `finding > the comparison-row rule is linear in the row, and answers what the regex
answered` — 4,000 deterministically generated rows compared against the old pattern as an
oracle (223 of them positive, so both answers are exercised), plus the 400 KB cost bound.
Measured after: **28 ms** for the same 400 KB row, and 6/9/12/20/28 ms for 10/50/100/200/400 KB
— linear. **Status: applied.** Suite green.

### 2. A quote anchor missed a passage the capture held, over a character nobody can see — pass 1

**Repro, on this repository's own cited corpus**

```
capture: research/raw/2026-09-13-extend-claude-with-skills-claude-code-docs-bbd9e46f.md
line   : "## [\u200B](https://code.claude.com/docs/en/skills#bundled-skills)  Bundled skills"
anchorFound(['## Bundled skills'], capture)  ->  false
```

**Root cause.** `normalizeForMatch` in `lib/quotes.mjs` undoes what a capture does to a sentence
— NFKC, curly quotes, dashes, Markdown link syntax, emphasis, whitespace runs, case — but
Unicode's **format characters** (General_Category=Cf) survive all of it: NFKC keeps them, and
`\s` matches only U+FEFF of them. A zero-width space, a soft hyphen, a word joiner or a
zero-width non-joiner between two visible characters makes an honest quote unfound.

**Severity: Medium-High.** Not a hypothesis about vendor pages: of the **188 captures** in this
repository's corpora, **32 hold 558 zero-width spaces**, plus 3 ZWJ and 8 ZWNJ, and two arXiv
captures put them *inside words* (`A\u200Bc\u200Bct`). The documented consequence of this exact
failure is already in the changelog: an agent whose quotes were refused "concluded quotes were
too strict and removed every one, leaving claims the gate could no longer check". This is that
defect one character class wider, found the same week as the fix for quotation marks.

**Fix.** Drop `\p{Cf}` on both sides before matching. It can only shorten what is searched for,
symmetrically, which is the argument `unwrap` is made on: an invented passage differs in
characters somebody can see.
**Tests:** `quotes > invisible formatting characters are not part of the passage either` — the
real heading-anchor shape, four characters in both directions, three invented-passage negatives,
and an end-to-end leg through `runCheck('citations', …)` on a fixture capture with a zero-width
space in it. Verified red without the fix. **Status: applied.** Suite green.

### 3. A fetch failure's own message carried a whole URL, key and password included — pass 2

**Repro**

```
plan.json: "http://user:<a password>@127.0.0.1:8099/?api_key=<an sk- key>&token=<a ghp_ token>"
research.mjs -> failed  … - Request cannot be constructed from a URL that includes
                          credentials: http://user:<a password>@127.0.0.1:8099/?api_key=…
research/raw/.fetches.jsonl -> 9 copies of the three secrets
```

The probe used values shaped like a real vendor key, a real GitHub token and a password, and
this report does not print them: `hardening.test.mjs` F26 runs the kit's own secret scan over the
repository and requires every fixture to be **assembled, not written** — "a scanner that is
always red about itself is one nobody reads". The first draft of this file tripped it on both
patterns, which is the rule working on the report about the rule.

**Root cause.** `fetchFailure` in `lib/runtime.mjs` cut a URL to its host **in the cause only**,
on the reasoning that the URL worth cutting is the one Node keeps on `err.cause`. Node throws
some refusals with no cause and the whole URL in the message — credentials in a URL, a URL that
will not parse — so the message went out verbatim. Its own docstring states the rule it broke:
"A URL in the cause is cut to its host, so a query string - a key - never rides along."

**Severity: Medium-High.** The copy that matters is the one in `research/raw/.fetches.jsonl`:
the ledger is the file `repo-hygiene.test.mjs` *requires* to be tracked and never ignored, it
travels in every bundle, handoff and artifact, and it sits in the one directory `doctor`'s
secret scan excludes by design (captures legitimately contain key-shaped strings). So the plan
copy is caught — `doctor` prints three `critical secret` findings for it — and the ledger copy
is caught by nothing. A signed URL in a plan is exactly what `collect.yml`'s own input
description warns a dispatcher never to send.

**Fix.** Cut a URL to its host wherever it appears, in the message as well as the cause.
**Tests:** `transport > a URL in the failure itself shows only its host, not only a URL in the
cause` — credentials, an unparsable URL, a message *and* a cause both carrying a key, and the
previously pinned cause-only path unchanged. Verified red without the fix.
**Status: applied.** Suite green. Measured after: the ledger's copies fall from **9 to 6**, the
`error` field reading `Request cannot be constructed from a URL that includes credentials:
127.0.0.1:8099`. The remaining six are the `url` and `cmd` fields — see rejected fix A.

### 4. One machine-config key was type-checked as an array and not as a list of paths — pass 1

**Repro**

```
printf '{"skillRoots":[42]}' > config.json
RESEARCH_KIT_CONFIG=config.json node research-kit/bin/doctor.mjs

TypeError [ERR_INVALID_ARG_TYPE]: The "path" argument must be of type string. Received type number (42)
    at Object.join (node:path:1354:7)
    at skillLocations (file://…/lib/machine.mjs:240:16)
    at deployedDrift (file://…/lib/installer.mjs:412:7)
    …
Node.js v22.22.3            exit 1
```

`[null]` and `[{"a":1}]` do the same.

**Root cause.** `shape()` in `lib/machine.mjs` checks the type of every key it reads —
`typeof raw.transport === 'string'`, `Number.isFinite(raw.maxAgeDays)`, `EVIDENCE_POLICIES.includes(…)`
— and this one with `Array.isArray(raw.skillRoots) ? raw.skillRoots.slice() : []`, which
validates the container and passes the contents to `path.join`.

**Severity: Medium.** The casualty is `doctor`, the one command `START_HERE.md` sends everybody
to ("It names every problem and prints the exact fix. Run it, fix what it says, run it again.
Stop at READY."), and the trigger is a hand-edited machine config — the file the front README
tells an operator to hand-edit. A config that does not parse is handled with three states and a
last-good snapshot; a config that parses and holds one wrong type killed the diagnostic instead.
Same class as the 2026-09-29 edit-gate fix: a raw stack where a named refusal belongs.

**Fix.** Filter the list to non-empty strings; with nothing left, the documented defaults are in
charge.
**Tests:** `machine > a skillRoots entry that is not a path is dropped, and doctor still answers`
— five hostile lists, the fallback to `RUNTIME_ANCHORS`, and a real `doctor --json` spawn
asserting no stack on either stream and a report that parses. Verified red without the fix.
**Status: applied.** Suite green.

### 5. A lock the kit judged stale and could not remove spun forever — pass 1

**Repro (two ways in, both measured)**

```
# a stale lock (dead pid) inside a research/raw this process cannot write
withLock(dir, fn)   ->  never returns.  8.0 s wall, 6.1 s user + 1.8 s sys: a whole core.
# .fetches.lock that is a DIRECTORY
research.mjs        ->  killed from outside at 250 s, having printed nothing after "transport:"
```

**Root cause.** In `acquire()` (`lib/provenance.mjs`), the recovery branch was
`try { fs.unlinkSync(file); } catch { /* raced with another recoverer */ } continue;`. The
`continue` is correct when the removal fails with ENOENT — somebody else recovered it a moment
ago — and for **every other** code it skips both the deadline check and the 50 ms sleep below
it, so the loop retries the same failing removal forever: EACCES on a read-only folder, EISDIR
on a directory, EPERM/EBUSY on Windows holding the file.

**Severity: High.** The worst failure shape in this report: no message, no exit code, a whole
core, and **not even diagnosable from outside** — `--report-on-signal` produced no report,
because a synchronous loop never returns to the event loop, which is also why the suite's own
60 s per-test watchdog cannot catch it (proved the hard way: see "what I got wrong"). The commit
gate has a 120 s watchdog; `research.mjs` and `prior.mjs` have none, so the spin ends only when
a person notices and kills it. In CI it ends when the job times out. The triggers are ordinary:
a read-only mounted project (a container volume, a CI cache), a permission mix-up, a sync tool
that materialised the lock path as a folder, and Windows holding a file the kit has judged stale.

**Fix.** A removal that fails with anything but ENOENT is a named refusal — `LOCK_STUCK`, with
the reason it was judged stale, the code the removal failed with, and the command that clears
it. ENOENT still retries.
**Tests:** `concurrency > a stale lock this process cannot remove is named, not spun on forever`
and `concurrency > a .fetches.lock that is a DIRECTORY is named, not a hang`, each running the
attempt in a **child process with its own 20 s deadline**, so a regression is a named failure in
41.6 s rather than a hung suite. Verified red without the fix: both report "the attempt was
still spinning when it was killed at 20s". **Status: applied.** Suite green.

### 6. `research.mjs` re-threw the kit's own refusals as stack traces — pass 2

**Repro**

```
# a ledger whose last line was never finished - what an interrupted collection leaves
node research-kit/bin/research.mjs --transport http-keyless

file:///…/lib/provenance.mjs:305
        throw new Error(
              ^
Error: research/raw/.fetches.jsonl does not end with a newline - its last line was never
finished. Repair it first: node …/doctor.mjs --fix-arity
    at appendFetch (…)  … six frames …
Node.js v22.22.3                                    exit 1
```

A **damaged** chain was worse: the thrown error carries `err.problems`, and Node printed that
array as a JavaScript object literal — `kind: 'ledger-unparsed', line: 1, detail: …` — for an
operator to read. A held lock did the same after its 120 s wait.

**Root cause.** `bin/research.mjs` caught what `runResearch` threw, asked `writeFailure` whether
it was a refused **write**, and re-threw everything else (`if (!why) throw err`). The kit's own
refusals — `LEDGER_DAMAGED`, `LEDGER_TORN_TAIL`, and the two lock codes from finding 5 — carry a
sentence that already names the damage, the reason and the command that repairs it, and that
sentence arrived under a source line, a caret, six frames and Node's version footer, with exit
**1**: which this kit's published vocabulary reserves for *FAIL, checked and wrong*, not for a
run that never started.

**Severity: Medium.** `bin/prior.mjs` has answered the same two ledger refusals with their
message and exit 2 all along, and `doctor --fix-arity` has a pinned test that it names a refused
lock write with "exit 2, and prints no stack" — so `research.mjs` was the outlier among the
three commands that meet these errors. The realistic path is the common one: Ctrl-C or a killed
runner mid-collection, then the next run.

**Fix.** `NAMED_RUN_REFUSALS` in `lib/core.mjs`, beside `writeFailure` which answers the
environment's refusals: the four codes the kit throws with their diagnosis already written.
`bin/research.mjs` prints `research: <message>` and exits 2 — the documented "could not be
checked", and the answer its sibling gives. Anything else still re-throws, so a genuine bug
keeps its stack. `acquire` now codes both of its refusals (`LOCK_HELD`, `LOCK_STUCK`), and
`withLock(root, fn, { waitMs })` is the seam that lets a test reach the 120 s refusal without
waiting it out — the same reasoning as `materializeIndex`'s injectable git.
**Tests:** `cli > research.mjs names the refusals the kit wrote, instead of dumping a stack` (both
legs, through the real binary, offline against a refused loopback port) and `concurrency > a lock
held by a live process names itself when the wait runs out`. Verified red without the fix.
**Status: applied.** Suite green. After:

```
research: research/raw/.fetches.jsonl does not end with a newline - its last line was never
finished. Repair it first: node …/doctor.mjs --fix-arity            exit 2
```

---

## Rejected fixes

None of the six was reverted: every fix kept the suite green on the first full run after it was
applied, and every one was verified **red without it** before being kept, so no test here can
pass vacuously. Five changes were considered and deliberately **not** made:

- **A. Redacting the credential-bearing URL in the ledger's `url` and `cmd` fields.** Finding 3's
  fix removes the *third* copy (the error text); six remain, two fields × three secrets. Redacting
  them would change what the hash chain covers — the ledger's job is to record faithfully what was
  asked for, and `urlKey`, the cache decision and the witness lookup all read that field. Whether
  a recorded URL should be redacted, and what a redaction does to a chain, is a decision with a
  rejected alternative, which means an ADR (protocol rule 3), not a break-test fix.
- **B. Cross-checking a ledger entry's `url` against its capture's front-matter `url`.** A real
  gap (risk 5) and a cheap check — but it is a **new check**, and the kit is feature-frozen
  (ADR-0117): "a new command, flag, transport, provider, configuration key, file format or check
  is not added unless an ADR lifts the freeze for that one item".
- **C. Refusing an internal first hop, or narrowing the redirect exemption.** ADR-0110 decided
  both, with the rejected alternative written down ("Refuse every internal address, the first URL
  included. That breaks intranet research, local test servers and a self-hosted SearXNG"). The
  standing protocol says existing ADRs are never re-litigated; a decision that is genuinely wrong
  is superseded by a new ADR that says so. So this is reported as risks 2 and 3, with the
  measurement, for whoever owns that call.
- **D. De-hyphenating a line-break hyphen in quote matching.** `cred-\nits` does not match
  `credits`, and this corpus holds **463 hyphen+newline** occurrences. Unlike the format
  characters, removing `- ` is **asymmetric**: a capture that says `well known` and a quote that
  says `well- known` would stop matching, trading one false negative for another. It needs a rule
  about which side is authoritative, which is a design choice, not a one-line fix.
- **E. Promoting `corpus-shape/table-arity` to blocking.** A row that lost a cell is repaired,
  warned, and left citing nothing — while `EVIDENCE.md`'s own header says "a row without raw
  evidence fails preflight". The warning names the cause and `--strict` promotes it, which is the
  documented posture; making it blocking by default is a policy change (risk 8 records the
  mismatch instead).

---

## Remaining prioritised risks

Ranked by severity × likelihood × impact, most dangerous first.

1. **A credential-bearing URL still lands in the ledger, which travels** (High × Medium).
   Finding 3 removed the error-text copy. `url` and `cmd` still hold it verbatim, the ledger is
   required to be tracked, is bundled into every handoff and artifact, and sits in the one
   directory `doctor`'s secret scan excludes. `doctor` does name the copy in `plan.json` as
   `critical secret` — three patterns fired on one probe — so the operator who runs `doctor`
   before collecting is told. Needs rejected fix A decided by an ADR.
2. **An internal first hop is fetched, silently** (High × Medium). ADR-0110's decision, and this
   pass measured it rather than assuming it: `127.0.0.1`, `localhost`, `[::ffff:127.0.0.1]`,
   `2130706433`, `127.1`, `0177.0.0.1`, `0.0.0.0` were all collected, and
   `http://169.254.169.254/latest/meta-data/` was **sent** — it answered this sandbox `HTTP 401`,
   which is a real cloud metadata endpoint refusing an unauthenticated request, not a guard
   refusing to send one. On a VM without IMDSv2 the same request returns credentials, into a
   capture, into a corpus, into a commit. The ADR's premise is "a URL the operator typed"; its
   own context section says the opposite about how URLs arrive — "a page chosen from a search
   result is not the operator's choice at all" — and in this product `plan.json` is written by an
   agent. Not a defect to fix here: a premise worth re-reading, in a superseding ADR.
3. **"Redirects that stay inside it" is wider in code than in the ADR's sentence** (Medium ×
   Medium). Once the first hop is internal, `allowInternal` is true for the whole job and
   `const why = allowInternal ? null : await internalTarget(next.hostname)` checks nothing, so a
   redirect from the operator's own `127.0.0.1` dev server to `169.254.169.254` is followed.
   Measured: a redirect from one loopback port to a **different** loopback host was followed with
   no check. The comment says "redirects that stay inside it"; the code says "any internal
   address". A `file:` redirect is still refused, and 20 hops still bound it.
4. **A line-break hyphen defeats a quote anchor** (Medium × High). 463 hyphen+newline
   occurrences across this corpus's 188 captures, and Firecrawl's PDF-to-text route — which the
   keyless transport's own refusal message recommends for documents — is where they come from.
   Rejected fix D says why it is not a one-line change.
5. **A ledger entry's `url` is never compared with the capture it produced** (Medium × Low).
   `provenance/timestamp-agreement` compares the ledger's `at` with the capture's `retrieved`,
   and `citations/url-mismatch` compares the **row's** URL with the **capture's** — but nothing
   compares the ledger's URL with either. A chain whose hashes all verify can say "fetched A"
   over bytes whose front-matter says B. Reachable through a mis-aligned `rebuildLedger`, a
   hand-edited chain, or a re-collection that renamed a capture. Rejected fix B: frozen, needs an
   ADR.
6. **Bulk ledger appends are quadratic in the chain's length** (Low × Low, measured). Each
   `appendFetch` re-reads and re-parses the chain under the lock: **7.23 ms per append at 5,000
   entries** (36.1 s for the 5,000), 17 ms for one more onto the full chain, `verifyLedger` 125
   ms, `preflight` 286 ms, the commit gate 60 ms. Bounded today by the 25-page depth cap — one
   run appends at most 25 entries, so the cost a collector actually pays is ~350 ms at that size.
   Worth knowing before anybody writes a migration that appends in a loop.
7. **This pass ran on Linux only** (Medium × certain). Three of the six fixes touch
   platform-specific behaviour: the removal of a directory lock (EISDIR here, EPERM on Windows),
   a remedy that prints `rm` or `del`, and test stubs chosen over `chmod` precisely because
   directory permission bits do not mean the same thing everywhere. The 2026-09-29 report's own
   lesson applies — "a platform nobody runs is a platform nobody has tested" — and its Windows
   leg is the only evidence any of this has on that platform.
8. **`EVIDENCE.md`'s header overstates what preflight does** (Low × High). It says "a row
   without raw evidence fails preflight"; a row whose `Raw` cell was lost to an arity repair is
   *warned* (`corpus-shape/table-arity`) and passes, unless `--strict`. The warning names the
   cause and the strict posture is documented, so this is a sentence to correct, not a check to
   add.
9. **A tracked file the kit's own tool rewrites** (Low × Medium). Running `audit.mjs` in this
   repository — which pass 1 did, by accident, and reverted — adds `"version": 1` to the tracked
   `research/audits/index.json` and a topic entry beside it. So the committed index is not what
   the current code writes. This is the class `repo-hygiene.test.mjs` exists for ("a read-only
   check that modifies the repository it is checking is a contradiction"), except that `audit` is
   a producer, not a check, and CI never runs it. Nothing is broken; the drift is.
10. **A host without Chromium reports a healthy suite as exit 1** (Low × Medium). Designed
    (ADR-0108) and documented in the run's own output, but a contributor's first local run reads
    red on a machine that is fine, and the waiver is an environment variable rather than a
    sentence in the contributing docs' first command.
11. **The `wx` lock is not promised over NFS or SMB** — recorded in `provenance.mjs` itself, with
    its evidence, and unchanged by this pass. Two collectors on a network share can both append
    validly, which is the one failure the hash chain cannot repair.
12. **Single-site corroboration**, carried forward from 2026-09-29: the kit warns and does not
    refuse.

---

## Hardening recommendations

- **Extend the "one parser, one precedent" rule to error paths.** `test/hardening.test.mjs`
  already requires every `bin/` command that imports a writer to call `writeFailure`. The same
  static test should require every entrypoint that runs a collection to answer
  `NAMED_RUN_REFUSALS` — finding 6 existed because `prior.mjs` and `doctor --fix-arity` had each
  been fixed and `research.mjs` had not, which is precisely how the Firecrawl/SerpAPI parser pair
  went stale in September.
- **Bound what a scoring rule may be asked to read.** The extractor caps its *output* (`cap`,
  `MAX_CHARS`) after scoring; nothing caps the *input* a rule regexes. Either cap the candidate
  before the rule table sees it, or require a rule's `test` to be linear — finding 1 is the second
  quadratic in this codebase's hot paths this month, after the commit hook's O(n²) argv.
- **Keep a real capture as the fixture.** Finding 2 was found by measuring this corpus (558
  zero-width spaces in 32 of 188 captures), not by imagining an adversary, and its test uses the
  real heading-anchor shape. The 188 captures here are a ready-made adversarial input set: a leg
  that runs the extractor and the quote matcher over all of them, with a time bound, would have
  found finding 1 on the day the corpus landed.
- **Fuzz the invisible class in one place.** `normalizeForMatch` is the single comparison point
  for quote anchors; a table-driven test over Cf, Zs, NFD/NFC and the ligatures — with the
  invented-passage negatives beside them — is cheaper than the next round of "one more character
  class".
- **Measure the corpus, then judge the code.** Four of the six findings were found by asking what
  this repository's own captures already contain: the longest line (308,705), the longest table
  row (23,211), the invisible-character census, the hyphen+newline count. Every one of those
  numbers is a claim about realistic input that no imagination needed to supply.
- **Decide the two open questions with ADRs, not with code**: whether a recorded URL is ever
  redacted (risk 1), and whether ADR-0110's first-hop exemption still holds when the plan is
  written by an agent rather than an operator (risk 2).
- **Run the per-file isolation leg occasionally.** 74 processes, 88 s, and it proves something a
  single sequential run cannot: no test depends on another. It was green here, and it is the
  cheapest available evidence that the suite stays that way.

---

## What I got wrong, and fixed

The protocol requires this part, and it is not decoration: two of these nearly became wrong
claims in a report.

- **Probing in the repository root dirtied it.** A CLI sweep ran `audit.mjs` with cwd = the
  checkout, which wrote 13 audit files and modified the tracked `research/audits/index.json`.
  Reverted (`git checkout --`, `rm`) before any fix was applied, and every later probe ran in a
  scratch project under `/tmp`. It is also risk 9, which is the one useful thing that came of it.
- **The first cut of finding 5's tests hung the suite.** They called `withLock` in-process, and
  when the fix was reverted to check that the tests were not asleep, the spin they exist to catch
  spun the *runner*: the 60 s per-test watchdog never fired, because a synchronous loop never
  returns to the event loop, and the run had to be killed from outside at 400 s. Rewritten to run
  each attempt in a child process with its own 20 s deadline — a regression is now a named
  failure in 41.6 s. The defect is worse than the report first said, because the suite cannot
  defend itself against it.
- **The first equivalence harness reported 78 mismatches** for finding 1's rewrite. The harness
  was wrong: it expected the two table rules to differ by −6 where they differ by −4
  (`comparison-row` −4, `table-row` +2, mutually exclusive). Corrected, the rewrite agrees with
  the old pattern on **20,000 of 20,000** generated rows.
- **The first transport test asserted the wrong string** — `'fetch failed (serpapi.com)'` where
  the code answers `'fetch failed (bad response from serpapi.com)'`, because only the URL is cut
  and the cause keeps its words. The expectation was corrected, not the code.
- **This report tripped the kit's own secret scan.** The first draft quoted the credential-bearing
  URL from finding 3's repro verbatim, and `hardening > F26: the kit does not trip its own scan -
  the fixtures are assembled, not written` went red on two patterns (`openai-style-key`,
  `bearer-in-url`) naming this file and line. Caught by a filtered run of five test files, before
  the commit that would have carried it. The repro now describes the shapes instead of spelling
  them, which is what F26 asks of every fixture in this repository: a scanner that is always red
  about itself is one nobody reads.
- **A CPU measurement nearly talked me out of finding 5.** `time` reported 0.003 s of user time
  for a 5 s hang, which reads as a sleep loop rather than a spin; `/proc/<pid>/stat` said 3.86 s
  user in 5 s wall, i.e. a whole core. bash's `time` does not accumulate a grandchild that
  `timeout` kills. The hang is a spin, and the numbers in finding 5 are the `/proc` ones.

---

## Summary

Six defects found, six fixed, none rejected, no test left red: **1411 → 1419 passed, 0 failed**,
with eight new tests each verified to fail without its fix. The whole CI sequence — selftest,
preflight, the release-evidence examples, the Node/Python conformance pair, the derived-file
regeneration, "a validator mutated none of its inputs" and "the suite left the working tree
clean" — passes locally at the end.

The build's resilience is **high against everything the previous passes hardened, and the
remaining weaknesses are of one kind**. What held under this pass's probing was broad and
sometimes surprising: 74 test files in isolation, four hostile checkout shapes including a
read-only tree and an archive tree, a byte-complete deployed mirror whose 26 CLIs all behave, 18
hostile MCP framings, 18 hostile vector packets in two languages, 23 hostile corpus states, a
SIGKILL'd collection that the next run recovers, and two collectors racing on one chain without
breaking it.

What it kept finding instead was **cost and honesty at the edges of untrusted input**: a rule
whose cost grows with a vendor's page (1), a comparison that a vendor's invisible characters
defeat (2), an error path that repeats a secret into the file that travels (3), a config key that
kills the diagnostic instead of being named by it (4), a recovery path that spins instead of
refusing (5), and an entrypoint that buries its own diagnosis under a stack (6). Four of the six
were found by measuring this repository's own corpus and its own code paths rather than by
inventing an adversary — which is the recommendation worth keeping.

Nothing here is structural. The two open questions that are structural — what a recorded URL may
hold, and whether an agent-written plan deserves the trust ADR-0110 gives an operator-typed one —
are decisions, and they are written up as such.

cwd: the repository root. Offline — no key, no credits, and no network beyond two loopback
servers this pass started itself and killed.

---

## Postscript — merged with `main` after the pull request opened (2026-10-01, 19:55 UTC)

Written after the pass above, and about the branch rather than the probing: nothing here changes a
finding, a fix, or a recommendation.

`main` moved from `427de81` to `01d99c0` while this break-test ran. PR #192 landed the browser work
(ADR-0119's render timeout, the guard's record of every request it carried, Chromium's own
deadline, the transport judging a timeout by what Chromium printed) plus two fixes from earlier
break-tests, and it touched three files this branch touches. The pull request therefore opened
**CONFLICTING**, on the two files both sides had edited in the same place:

- **`CHANGELOG.md`** — both sides added bullets to `Unreleased`. Both kept, this branch's first:
  the section is newest-first, and these entries are dated 19:09–19:17 UTC against main's 16:20 UTC.
- **`research-kit/README.md`** — both sides changed the test count, main to `1419`, this branch to
  `1420`. Neither survives a merge, and picking either side would have failed the runner's own
  count check: the answer is main's suite plus this branch's eight tests, **1427**.

No product code needed reconciling — the six fixes and main's browser work touch disjoint modules —
and `docs/ARCHITECTURE.md` auto-merged, so both sides' map rows stand. Merging `main` in rather
than rebasing keeps the six commits that were each verified green alone, byte for byte, in a
separate worktree.

**Verified on the merged tree.** `1425 passed, 0 failed, 2 unsupported` locally (the two are
`NO-BROWSER`, and both are main's new browser tests, which this host cannot run); `preflight`
**PASS**, 0 blocking, 0 warnings, 29 passing; release-evidence examples **6/6**; all three
Node/Python conformance pairs **agree**; `timeline.mjs` and `export-warc.mjs` regenerating to their
committed bytes and leaving the tree as they found it; `conformance/` and `schemas/` byte-unchanged;
working tree clean. The kit was deployed (`bin/install.mjs`) and the commit gate installed
machine-wide first, so the gate ran on the merge commit: `research gate: allow`.

**Then CI ran it on six platforms instead of one.** All seven checks pass on the merge
([run 36917868056](https://github.com/StepenkoAnatoli/Research-Kit/actions/runs/36917868056)):
`platform (ubuntu-latest)`, `platform (ubuntu-26.04)`, `platform (windows-latest)`, `node (24)`,
`node (26)`, `archive tree`, and the required `suite`. That closes part of the limitation this
report names — the pass ran on Linux only, and three of the six fixes touch platform-specific
behaviour. `windows-latest` now runs the whole suite including the eight new tests, so those fixes
hold on Windows as far as tests reach. What is still not reproduced anywhere is the field case
behind finding 5: Windows holding a lock file open, so removing a stale lock fails for a reason
other than `ENOENT`. The fix names that refusal instead of spinning on it, and the test pins the
naming; neither is a witness to the Windows path itself.

**One thing this pass got wrong here, and it is worth keeping.** The pull request was opened from a
sandbox that had been re-cloned shallow between turns: `git rev-parse HEAD` answered the base
commit, not the branch tip, and a list of check runs read against it looked like CI failing *this*
branch. It was main's own history — a `workflow_dispatch` run on `427de81` where `windows-latest`
failed while the same commit's `push` run passed. Two habits would have caught it before it was
believed: read the check runs' `head_sha` and `head_branch` rather than trusting that `HEAD` is the
branch under discussion, and treat `refusing to merge unrelated histories` in a repository with a
single visible root as a shallow clone, not as a fact about the branches. The push had landed, so
nothing was lost; `origin` held the tip, and the working tree proved byte-identical to it before
the branch was fast-forwarded back.
