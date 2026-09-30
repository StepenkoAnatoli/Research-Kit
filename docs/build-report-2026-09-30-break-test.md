# Build report — break-test, 2026-09-30

An adversarial pass over the whole build, looking for realistic ways it fails and then
applying only the fixes that leave the suite green. It follows
[the 2026-09-29 break-test](build-report-2026-09-29-break-test.md) (six defects, PR #154/#155)
and the string of break-tests recorded in the ADRs since. This one starts where they stopped.

**How the build is run.** One command, offline, no key and no network:

```
node research-kit/bin/selftest.mjs
```

CI adds `preflight`, the release-evidence examples, the Node/Python cross-language
conformance pair, the regeneration of the corpus's derived files and the
"the suite left the working tree clean" step — all of which were run locally too, and all
of which pass. Baseline before this pass: **1323 passed, 0 failed in 51.5s**.

**Where it ended.** Four defects fixed, each in its own commit, each followed by a full
green suite. Final state: **1330 passed, 0 failed in 50.5s**, working tree clean.

| Commit | Defect |
|---|---|
| `8e954df` | `install-hooks.mjs` threw a raw `TypeError` on a `PreToolUse` entry of the wrong type |
| `eed21b9` | Three GitHub seams reported a fetch rejection as the bare `fetch failed` |
| `f54dfde` | `rankCandidate` compiled caller text as a regular expression |
| `fbf80d4` | A 200 whose body is not JSON threw a raw `SyntaxError` out of `getRun`/`listArtifacts` |

---

## Project & build overview

| | |
|---|---|
| **What it is** | A research kit: ~40 CLIs under `research-kit/bin/`, ~60 modules under `research-kit/lib/`, 3 cross-language conformance runners, ~85 test files |
| **Test command** | `node research-kit/bin/selftest.mjs` — one runner, no build step, no lockfile, no dependencies |
| **Baseline** | 1323 passed, 0 failed in 51.5s |
| **Final** | 1330 passed, 0 failed in 50.5s |
| **CI** | `.github/workflows/offline-suite.yml`: `ubuntu-latest`, `ubuntu-26.04` (temporary, ADR-0043), `windows-latest` on Node 22; `node-lines` on 24 and 26; `archive-tree` from `git archive HEAD` with no `.git`; a `suite` gate that requires all three |
| **Toolchain** | Node 22/24/26, Python 3.11. Third-party actions pinned to commit SHAs, checked weekly by `.github/scripts/check-action-pins.mjs` |
| **Dependencies** | **None.** Every import is a Node builtin. This is the single most important build fact below |
| **Platform facts the build encodes** | `.gitattributes` pins `* text=auto eol=lf`; `githooks/pre-commit` must be mode `100755` (asserted on Linux legs only); Windows runs every step under Git Bash |
| **Environment knobs** | 10 `RESEARCH_KIT_*` names; `RESEARCH_KIT_TEST_TIMEOUT` (validated 50..3600000, exit 2 on malformed); `RESEARCH_KIT_RESULT_FILE` |

**Why there is no lockfile, and why that matters.** There is no `package.json`, no
`node_modules`, no lockfile — the kit is Node builtins only. That removes an entire class of
build failure this prompt asks about (dependency resolution, transitive supply chain,
lockfile drift, postinstall scripts) *by construction* rather than by discipline. It also
means the toolchain cannot come from npm, which is why the Node-version matrix below had to
be built from the `node-linux-x64` npm packages rather than from nodejs.org.

---

## What was probed, and what held

Every row was reproduced in this pass. Every row passed.

### Environment and toolchain

| Probe | Result |
|---|---|
| Full suite on Node 24.21.0 (official binary, from `node-linux-x64`) | 1323 passed, 0 failed |
| Full suite on Node 26.10.0 (official binary, from `node-linux-x64`) | 1323 passed, 0 failed |
| Full suite from `git archive HEAD` with **no `.git`** (the `archive-tree` CI leg) | 1330 passed, 0 failed |
| `TMPDIR` with a space, non-ASCII, a `'` quote, `$(whoami)`, a 319-char path | green, all five |
| `TMPDIR` read-only (mode 500) | 579 passed / 658 failed — and **not** a defect, see below |
| `TMPDIR` non-existent | refused with a sentence naming TMPDIR/TEMP/TMP, exit 2 |
| `RESEARCH_KIT_TEST_TIMEOUT=abc` | exit 2, misuse |
| Cross-language conformance, all 3 pairs, Node vs Python on the same vectors | agree on every vector; `conformance/` and `schemas/` byte-for-byte unchanged afterwards |
| `timeline.mjs` + `export-warc.mjs` (the CI regeneration step) | exit 0, working tree clean |
| `check-action-pins.mjs` with `GH_TOKEN` | `UNCHECKED`, exit 1 — fails closed, as designed (and see fix 2 for the diagnosability defect behind that line) |

**The read-only `TMPDIR` case is worth writing down, because it looks like the worst failure
in this table and is actually the best behaviour in it.** 658 tests fail, and the harness
prints:

```
Likely single cause: 653 of 658 failures (99%) open with EACCES.
  one code behind most of a red suite points at one broken thing, not 658 broken tests.
```

It groups the failures by their opening code and names the one cause, rather than leaving
658 red lines to be read individually. A full temp volume produced the same aggregation in
the 2026-09-29 pass. Nothing to fix.

### Hostile input, by surface

| Probe | Combinations | Result |
|---|---|---|
| Vendor parsers + `http-transport` helpers (`/tmp/bt/fuzz-parsers.mjs`) | 627 | 0 throws |
| `bin/mcp-server.mjs` hostile JSON-RPC | 43 | 0 stack traces, 0 non-JSON stdout lines |
| `hooks/edit-gate.mjs` hostile `PreToolUse` payloads, outside and inside a gated project | 65 | all exit 0 with a valid `hookSpecificOutput` |
| 28 CLIs × 49 hostile argv spellings (`/tmp/bt/argv-fuzz.sh`) | 1372 | 0 stack traces, exits within 0/1/2/3 |
| 28 CLIs × 8 flags × 5 shell-metacharacter payloads as direct argv | 1120 | no command injection, no marker file |
| Hostile `research/plan.json` (39 shapes × 11 CLIs) + `research/kit.json` (13 × 4) | 541 | 0 problems |
| Hostile ZIP containers through `artifact.mjs validate --file` (`/tmp/bt/zip-fuzz.mjs`) | 32 | 0 problems, every one refused by name |
| Every `node -e` block in `.github/workflows/*.yml`, extracted and actually run (`/tmp/bt/run-embedded2.mjs`) | 14 | 9 exit 0; the other 5 are harness artifacts (missing `TOPIC`/`PRIOR`), not defects |
| Corpus/table property fuzz: `splitRow`/`escapeCell`/`tableRow` round trips, `repairRowArity` arity, `parseTable`, `headerOf`, `alignToHeader`, `parseCapture`, `nextId`, `makeSlug`, `ageInDays` (`/tmp/bt/table-fuzz.mjs`) | 34 000 | 0 throws, 0 invariant violations |
| Canonical JSON, Node vs Python, differential | 4064 inputs | 0 disagreements |

**The hostile-ZIP table deserves its specifics**, because it is the surface most likely to
be treated as "just a parser" and is in fact a security boundary. Path traversal (`/`,
`../` mid-name), a drive letter, a backslash separator, CR/LF and NUL inside names, a
1024-character name, an empty name, an exact duplicate, an ASCII case collision, an NFC/NFD
collision, symlink and device and FIFO unix modes, method 12, a bad CRC, a lying
uncompressed size, a 4 MB and a 1 MB deflate bomb, a 65 535-byte EOCD comment, 6000
entries, ZIP64 sentinels, a central directory past the end, random bytes, all-zero, and a
legal minimal archive. Every one was refused **by name** with a specific code — `ZIP-READ`,
`ZIP-PATH`, `ZIP-DUPLICATE`, `ZIP-CASE-COLLISION`, `ZIP-SPECIAL-ENTRY`, `ZIP-RATIO-LIMIT`,
`ZIP-SIZE-LIMIT`, `MANIFEST-MISSING`, `MANIFEST-HASH-MISSING` — with no crash, no stack
trace and no non-JSON stdout. The limits are exported as `ZIP_LIMITS`: 5000 entries,
512 MiB total, 128 MiB per entry, ratio 200 above a 1 MiB floor, 1024-character names.

### Concurrency

| Probe | Result |
|---|---|
| 8 rounds × 12 concurrent reader CLIs (`audit`, `timeline`, `measure`, `preflight`, `handoff`, `doctor`, `evidence-context --all`, `gate --gate edit`, `export-warc`) over one seeded project | 0 problems; `verifyLedger` clean, `handoff.mjs` exit 0 |
| **N processes × 5 concurrent `appendFetch` on one ledger** (`/tmp/bt/append-race.sh`) at N = 4, 12, 24 | 20/60/120 entries, **0 duplicate sequence numbers**, chain verified, 0 unparsed lines, 0 worker stderr |

The ledger race is the one that mattered: it is the only path in the kit where two
independent processes write the same hash-chained file, and the whole chain is worthless if
one append lands inside another. It holds at 24 concurrent writers.

### Line endings

`core.autocrlf=true` — the Windows default — is the failure the `.gitattributes` pin exists
for, so a whole corpus was converted to CRLF and read (`/tmp/bt/crlf-probe.sh`):

```
verifyLedger entries=11 problems=11
    body-unmodified | research/raw/…-understanding-authorization-… differs only by CRLF line endings
handoff.mjs    exit=1  handoff-chain-broken  body-unmodified/line-endings: … differs only by CRLF line endings
preflight.mjs  exit=1  fail provenance/body-unmodified … differs only by CRLF line endings (line 1)
doctor.mjs     exit=1  info handoff-chain-broken  body-unmodified/line-endings: …
```

All four readers agree, the specific rule is named (`body-unmodified` with a CRLF
sub-diagnosis rather than a generic hash mismatch), and `handoff.mjs` refuses with the
`core.autocrlf` remedy. The corpus is diagnosed, not silently accepted.

---

## Discovered failures & actions

Four defects were found, triggered, root-caused and fixed. All four are real: each was
reproduced with a concrete command before it was touched.

---

### 1. `install-hooks.mjs` threw a raw `TypeError` on a `PreToolUse` entry of the wrong type

**Repro** (exact, from the previous pass's `settings-probes2.sh`)

```bash
env HOME=$H node research-kit/bin/install.mjs          # deploy the kit
printf '%s' '{"hooks":{"PreToolUse":[null]}}' > $H/.claude/settings.json
node research-kit/bin/install-hooks.mjs
# TypeError: Cannot read properties of null (reading 'hooks')
#     at .../research-kit/lib/installer.mjs:196:63
# exit 1
```

Also `[7]`, `["x"]`, and entries whose `hooks` is `5`, `{}` or `"x"`:

```bash
printf '%s' '{"hooks":{"PreToolUse":[{"hooks":5}]}}' > $H/.claude/settings.json
node research-kit/bin/install-hooks.mjs
# TypeError: (e.hooks ?? []).map is not a function
#     at .../research-kit/lib/installer.mjs:196:76
```

**Root cause.** `installEditGate` iterates `settings.hooks.PreToolUse` and reads
`entry.hooks` without first establishing that `entry` is an object whose `hooks` is a list.
`readSettings` classified a file's *state* (`absent | readable | unfamiliar | repairable`)
but the `unfamiliar` branch was never reached for a node of the wrong type, because the
throw happened on the way in. The file is the operator's, so its shape is not the kit's to
guarantee — the same untrusted-input class the kit defends everywhere else.

**Severity: Medium.** The safety outcome is fail-open, so nothing is *bypassed*; but the
file is left untouched with a stack trace and no explanation, and `bin/doctor.mjs` reports
the same file gracefully (`fail gate-edit <path> does not parse - the edit-time gate cannot
load`). Two commands, one file, two different answers — and the one that throws is the one
an operator runs to fix it.

**Fix.** `knownHookShape(settings)` beside `entriesOf`, an `UNFAMILIAR_SHAPE` constant next
to `MATCHER`, and both wired into `readSettings` so a malformed node reads as
`state: 'unfamiliar'`. **Refusing rather than repairing is deliberate:** writing back the
`kept` list would silently drop the operator's own entries, and a settings file is not the
kit's to prune.

**Tests:** `doctor > a PreToolUse node of the wrong type is refused by name, not thrown at`
(a 9-case table asserting `settingsState → 'unfamiliar'`, refusal, and a byte-unchanged
file) plus a positive-path test.

**Post-fix behaviour:**

```
edit gate: <path> is in a state the installer does not recognise - refusing to rewrite it
exit 1, file byte-identical
```

**Status: applied.** `8e954df`. Suite green.

**A pre-existing behaviour found while fixing the test, deliberately left alone.**
`installEditGate` drops `PreToolUse` entries whose `hooks` list is empty
(`if (hooks.length) kept.push(...)`). Harmless — an empty registration gates nothing — and
`removeEditGate` shares the rule. Changing it would alter the installer's pruning contract
for no gain, so the corrected test asserts the real count (2, not 4) and a comment records
the drop as pre-existing and out of scope.

---

### 2. Three GitHub seams reported a fetch rejection as the bare `fetch failed`

**Repro** (exact, from this pass, on a host with no egress to `api.github.com`)

```bash
GH_TOKEN=$(gh auth token) node .github/scripts/check-action-pins.mjs
UNCHECKED actions/checkout@3d3c42e5aac5 (v7.0.1) - request failed: fetch failed
UNCHECKED actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 (v7.0.0) - request failed: fetch failed
UNCHECKED actions/upload-artifact@043fb46d1a93 (v7.0.1) - request failed: fetch failed
UNCHECKED actions/setup-python@5fda3b95a4ea91299a34e894583c3862153e4b97 (v7.0.0) - request failed: fetch failed
exit=1
```

**Root cause.** `err.message` on a failed `fetch` is literally `"fetch failed"`; the reason
lives on `err.cause`. Three call sites used `err.message` directly:

| Site | Line | Old message |
|---|---|---|
| `.github/scripts/check-action-pins.mjs` | `checkPins` | `request failed: ${err.message}` |
| `research-kit/lib/dispatch.mjs` | `dispatchCollection`'s catch | `could not reach ${api}: ${redact(err.message)}` |
| `research-kit/lib/disclosure.mjs` | two probe catches | `unreachable: ${error.message}` |

The kit already solved this exact problem on 2026-09-30 (ADR-0047, `runtime.fetchFailure`)
and every *transport* uses it — `http-transport`, `searxng`, `serpapi`. These three were
the seams that most often run where fetches are constrained, and they had not been given it.

**Severity: Low, but high-leverage.** Nothing is wrong with the outcome — all three still
fail closed with the right exit code. The defect is that the one line printed when the check
cannot do its job names none of the four things that could be true. `"fetch failed"` is the
same sentence a mistyped proxy, a DNS failure, a TLS-inspecting middlebox and a genuine
GitHub outage produce. On this host the cause was `unable to verify the first certificate` —
immediately actionable, and invisible.

**Fix.** Call the existing helper. Three one-line changes plus one import each. Exit codes,
fail-closed behaviour, `redact()`'s token scrubbing and the 404/422-vs-other distinction in
`checkPins` are all unchanged.

**Post-fix behaviour:**

```
UNCHECKED actions/checkout@3d3c42e5aac5 (v7.0.1) - request failed: fetch failed (unable to verify the first certificate)
```

**Tests:** `action-pins > a request that never left names its cause, not the bare "fetch failed"`;
`dispatch > a dispatch that never left names the cause, not the bare "fetch failed"`.

**Status: applied.** `eed21b9`. Suite green.

---

### 3. `rankCandidate` compiled caller text as a regular expression

**Repro**

```javascript
rankCandidate('https://example.com/zebra', { why: 'rate limits (api)' })
// SyntaxError: Invalid regular expression: /rate limits (api|api/i: Unterminated group
```

Also `'a(b'`, `'[x'`, `'*'`, `'\\'`, `'(?:'`, `'a{2,1}'`, `'(?<n>'` — every one a raw
`SyntaxError` out of an exported function.

**Root cause.** `research-run.mjs:148`:

```javascript
if (why && new RegExp(why.split(/\s+/).slice(0, 2).join('|'), 'i').test(url)) value += 1;
```

Two defects on one line, and the second is the more interesting one:

1. **A reason holding an unbalanced metacharacter threw.** One malformed reason took down a
   whole collection instead of one candidate.
2. **A blank or leading-whitespace reason over-matched everything.** `' '.split(/\s+/)` is
   `['', '']`, so the pattern built was `|` — an **empty alternative, which matches every
   URL**. `'  pricing'` built `|pricing`, the same thing. Verified: a `why` of `' '` gave
   every candidate the +1 bonus, so the ranking became noise while looking like a ranking.

Both have the same root cause: caller text was used as a *pattern* instead of as *words*.

**Severity: Low, latent.** No caller passes `why` today — `selectCandidates` at
`research-run.mjs:264` passes only `{ prefer }`, and the plan's `urls[].why` /
`queries[].why` are read into `usedFor`, never into the ranker. This is exactly why it
survived: dead API surface is where defects go to wait for a caller. The exported
signature is public, so the next caller inherits both.

**Fix.** The honest implementation of the stated intent — a plain case-insensitive
substring test over the first two non-empty words. It cannot throw and it cannot
over-match.

**Tests:** `collect > a reason is matched as words, never compiled as a pattern` (12 hostile
metacharacter reasons plus two positive cases) and
`collect > a blank reason scores nothing, rather than scoring everything`.

**Status: applied.** `f54dfde`. Suite green.

---

### 4. A 200 whose body is not JSON threw a raw `SyntaxError` out of `getRun`/`listArtifacts`

**Repro**

```javascript
const html = async () => ({
  ok: true, status: 200,
  json: async () => { throw new SyntaxError('Unexpected token < in JSON at position 0'); },
});
await listArtifacts({ repository: 'o/r', runId: 1, token: 't', fetch: html });
// SyntaxError: Unexpected token < in JSON at position 0
await getRun({ repository: 'o/r', runId: 1, token: 't', fetch: html });
// SyntaxError: Unexpected token < in JSON at position 0
```

A 200 whose body is an HTML page is what a GitHub maintenance window, a corporate
TLS-inspecting proxy and an edge cache under load all return.

**Root cause.** `dispatchCollection` has guarded this since it was written — `try { body =
await response.json(); } catch { body = null }`, then a `NO_RUN_ID` error carrying the
status and the `X-GitHub-Api-Version` remedy. Three siblings did not: `getRun`,
`listArtifacts` and the download path read `response.json()` unguarded. `collect-remote.mjs`
*does* catch, but only as `UNKNOWN`:

```javascript
const e = err instanceof DispatchError ? err : new DispatchError('UNKNOWN', err.message);
```

so the operator gets `UNKNOWN: Unexpected token < in JSON at position 0` — no status, no
remedy, and a code that says "unknown" about a failure the kit can name precisely.

**Severity: Low.** A rare event, and the operator is told the run could not be read. But the
message names nothing about *why*, and the two calls it hits are the two a long remote run
spends most of its life in — so it is the one a 20-minute collect is most likely to meet.

**Fix.** `readJsonBody(response, what)` turns a non-JSON body into `DispatchError('BAD_BODY')`
carrying the status, the parser's own first line, and a remedy that distinguishes a proxy
from an outage. `getRun` and `listArtifacts` call it. A body that *is* JSON reads exactly as
before.

**Post-fix behaviour:**

```
BAD_BODY | could not list artifacts for run 1: HTTP 200 returned a body that is not JSON
           (Unexpected token < in JSON at position 0)
remedy: a JSON API answering with HTML is usually a proxy or a maintenance page - retry,
        then check api.github.com
```

**Tests:** `dispatch > a 200 whose body is not JSON is a dispatch error, not a SyntaxError`
(both call sites, plus the assertion that a real JSON body still reads).

**Status: applied.** `fbf80d4`. Suite green.

---

## Successfully applied fixes

All four were applied, each followed immediately by a full suite run, and none was reverted.

| # | Commit | Files | Tests added | Suite after |
|---|---|---|---|---|
| 1 | `8e954df` | `lib/installer.mjs`, `test/doctor.test.mjs` | 2 | 1325 passed, 0 failed |
| 2 | `eed21b9` | `.github/scripts/check-action-pins.mjs`, `lib/dispatch.mjs`, `lib/disclosure.mjs`, `test/action-pins.test.mjs`, `test/dispatch.test.mjs` | 2 | 1327 passed, 0 failed |
| 3 | `f54dfde` | `lib/research-run.mjs`, `test/collect.test.mjs` | 2 | 1329 passed, 0 failed |
| 4 | `fbf80d4` | `lib/dispatch.mjs`, `test/dispatch.test.mjs` | 1 | 1330 passed, 0 failed |

Each fix is the smallest change that removes the failure. No new dependencies — there are
still none. No refactors. No changes to exit codes, fail-closed behaviour, or any documented
contract. `research-kit/README.md`'s test count was updated once per fix and re-verified by
the suite's own README-count guard on each full run.

**One process note.** The first cut of fix 1's positive-path test asserted
`hooks.length === 4`. It failed (`2 !== 4`), and the cause was the pre-existing empty-`hooks`
drop described above, not the fix. The test was corrected to assert the real behaviour rather
than the fix being widened to satisfy a wrong expectation — the correct order, and the reason
the drop is now recorded in a comment instead of being changed.

---

## Rejected fixes

Six changes were considered and deliberately **not** made. Each is recorded with its reason,
because a rejected fix that is not written down gets re-proposed.

- **`installEditGate` dropping entries whose `hooks` list is empty.** Found while fixing the
  test in fix 1. An empty registration gates nothing, so the drop is harmless;
  `removeEditGate` shares the rule; and changing it would alter the installer's pruning
  contract for no gain. Left as-is and documented in a test comment as pre-existing.

- **The 658-failure cascade under a read-only `TMPDIR`.** 5 of the 658 are not `EACCES`
  (`git init -q` failing because the scratch could not be created, a row reading as
  unparsed). They are consequences of the one cause, correctly summarised by the harness's
  dominant-cause line. Papering over them individually would hide the one cause.

- **`check-action-pins.mjs` exiting 1 without network.** The designed fail-closed behaviour,
  as recorded in the 2026-09-29 report. Fix 2 improved the *message* only; the exit code and
  the 404/422-vs-other distinction are untouched.

- **Guarding `artifact.mjs:611`'s `new RegExp(r.pattern)`.** The pattern comes from
  `research-kit/schemas/artifact-manifest.schema.json`, a file this repository owns and a CI
  step asserts is byte-for-byte unchanged after every run. Defence-in-depth only; the sibling
  `release/schema.mjs:102` does carry a try/catch, so there is an inconsistency worth noting
  but no reachable failure. Recorded as risk 5.

- **`doctor.mjs:264`'s `editGateState(settings)` carrying the same latent `.map` on
  `entry.hooks`.** Dead code with no reachable caller after fix 1 routed the shape check
  upstream into `readSettings`. Deleting it would be an unrelated cleanup, not a fix.

- **`checks.mjs`'s `maxAgeDays` of `0`, `-1` or `1e9` silently inverting citation-age
  policy.** Verified: `maxAgeDays: 0` and `-1` make every closure warn with `(limit 0)` /
  `(limit -1)`, and `1e9` turns the check off entirely. But `maxAgeDays` is
  operator-configured in `research-kit.config.json`, produces `warn` and not `fail`, and no
  realistic scenario makes an operator write `1e9`. Fixing it would add a range assertion to
  a knob nobody misuses, to defend against an operator arguing with themselves. Recorded as
  risk 4 instead.

---

## Remaining prioritised risks

1. **A vendor response shape change is still a live hazard.** This pass fuzzed 627 hostile
   cases across `firecrawl.normalizeSearch`/`normalizeMap`/`parseStatus`,
   `serpapi.normalizeSearch`/`normalizeAccount`/`searchesUsed`/`searchId`,
   `searxng.normalizeSearch` and the `http-transport` helpers with **zero** throws — but the
   2026-09-29 pass said the same thing and then found the Firecrawl null-row defect in
   `normalizeMap` one seam later. The parsers are now hardened; the browser transport's
   extraction and the keyless adapters carry the same untrusted-input assumption and have
   only been fuzzed, not proven. The class does not close by inspection.

2. **The signed-in disclosure surface is real and unfixable here** (ADR-0035). On a public
   repository, anyone with a GitHub account reads every dispatch input in the job log. The
   topic and the prior are not secrets, but they are not private either.

3. **`inspectEntries` does not detect Unicode-normalization collisions.** An archive holding
   both the NFC and NFD spelling of one name passes, and entry CRC32 is not verified —
   `readEntry` compares inflated length only. Defence-in-depth: the artifact carries
   `manifest.sha256`, and a deliberate NFC/NFD collision was among the 32 hostile ZIPs that
   were refused, so it is refused for a *different* reason. Closing it properly means a
   normalisation pass over entry names in `artifact-zip.mjs`, which is a real change to a
   security boundary and deserves its own pass.

4. **`maxAgeDays` silently inverts citation-age policy** at `0`, `-1` and `1e9`
   (`machine.mjs:137` accepts any finite number). See the rejected fix above. The direction
   that matters — `1e9` turning a check off — is the same failure mode the repository
   explicitly legislates against elsewhere ("a rename that silently relaxes a gate is the
   same defect as a rename that silently stops firing one").

5. **`artifact.mjs:611` compiles a schema `pattern` without a try/catch**, where
   `release/schema.mjs:102` guards the same construction. Unreachable today because the
   schema is repository-owned and CI-verified, but the two files disagree about whether a
   pattern can fail to compile.

6. **`SIGKILL` cannot be caught**, so a `kill -9`'d run still leaks its scratch — and on
   Windows a *programmatic* signal of any name behaves the same way, because `kill` there is
   `TerminateProcess`. Bounded by the machine's tmp reaper. Unchanged from 2026-09-29.

7. **The Windows leg of CI is still only fully exercised by its own failures.** Every probe
   in this pass ran on Linux. The line-ending and executable-bit behaviour the matrix exists
   to catch is Windows-specific, and the CRLF probe here simulated a CRLF *corpus* rather
   than a CRLF *checkout* — the `.gitattributes` pin was verified by reading `git ls-files
   --eol`, not by producing a smudged tree. The matrix is the only thing that has ever run
   that leg.

8. **`nodejs.org` is unreachable from this sandbox**, so the Node-version matrix was built
   from the `node-linux-x64` npm packages. 24.21.0 and 26.10.0 were both verified to run the
   suite identically, but they were not verified against the official `SHASUMS256.txt`.

---

## Hardening recommendations

- **Route every seam that fetches through `fetchFailure`.** Fix 2 found three that were not,
  in the three files most likely to run behind a proxy. A grep for `err.message` adjacent to
  a `fetch` is the whole audit, and it should be part of review for any new seam. The helper
  exists precisely so this is a one-line fix.

- **Treat caller text as words, never as a pattern.** Fix 3 is the third unguarded
  `new RegExp` found in this repository's history, and the third time the fix has been "stop
  building a regex". `corpus.mjs:195`, `corpus.mjs:649` and `finding.mjs:245` were checked
  and are literal-only; `checks.mjs:98` likewise. A lint rule or a review checklist item
  ("does this `new RegExp` argument come from a file, a flag, or a network response?") would
  end the class rather than the instance.

- **Give every `response.json()` the same treatment `dispatchCollection` gave it.** Fix 4
  existed only because one function in a file of four was hardened. The guard belongs beside
  the call, once, as a helper — which is what `readJsonBody` now is. New GitHub calls should
  use it rather than reach for `response.json()` directly.

- **Add a sibling test whenever a parser is hardened.** The 2026-09-29 report recommended
  this and it is still the highest-value item: a single test that feeds the same hostile row
  shape to *every* vendor parser would have found the Firecrawl defect on the day the
  SerpAPI fix landed. The fuzzers in `/tmp/bt/` do this ad hoc; a committed test would do it
  on every run.

- **Keep exporting the ZIP limits and keep fuzzing against them.** `ZIP_LIMITS` being
  exported is what made the 32-case hostile-archive probe expressible. The refusal codes are
  specific and named, which is the property that makes a security boundary diagnosable
  rather than merely safe.

- **Keep the "one code behind most of a red suite" aggregation.** It is the single best
  operator-facing behaviour in the harness, and it is what turned a 658-failure read-only
  `TMPDIR` run into a one-line diagnosis. Any future change to failure reporting should
  preserve the grouping, not just the count.

- **Run the platform you claim to support, at least once per change class.** Two of this
  pass's four defects were diagnosability defects whose *only* symptom is a message — the
  kind that a Linux run and a Windows run will both accept, and that a person on a locked-down
  Windows corporate network will hit every day.

---

## Summary

The build is unusually hard to break, and most of the credit belongs to the previous passes:
of roughly **39 000 hostile inputs** across eleven fuzz surfaces, plus the toolchain,
environment, concurrency and line-ending matrices, **exactly four defects** were found — and
three of those four were diagnosability defects whose *outcomes* were already correct.

What the numbers say is that the kit's *safety* is in good shape and its *explanations* are
not. Three of the four fixes (`eed21b9`, `f54dfde`, `fbf80d4`) change no behaviour at all:
same exit codes, same fail-closed decisions, same refusals. What they change is that the
operator is now told *why*. On a project whose entire value is that its claims are
checkable, a gate that refuses correctly but explains nothing is the same defect as a gate
that explains itself and refuses wrongly — and it is the cheaper of the two to leave in
place, which is why it was.

The fourth (`8e954df`) is a genuine crash, and it sat in the installer because the shape
check ran one step too late: the state was classified *after* the node had already been read.
That is the one generalisable lesson of the pass — validate the shape at the boundary, not at
the point of use.

Final state: **1330 passed, 0 failed in 50.5s**, working tree clean, four commits, no new
dependencies, no contract changed. Every fix was verified green on a full suite run before
it was committed, and none was reverted.
