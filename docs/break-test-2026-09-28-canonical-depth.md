# Break test, 2026-09-28 — input depth ended the builder's first command

Adversarial pass over the build, following the third such session (the earlier two are
cited throughout the source as `found 2026-09-27` and `found 2026-09-28, break-test`).
Everything below was measured in a checkout of `a07c4fe` on Linux, Node v22.22.3,
Python 3.11.2, git 2.39.5. Nothing here is reasoning about what the code probably does.

## Project and build overview

No package manager and no dependencies: the kit is plain `.mjs` run by `node`, plus three
Python conformance runners. There is nothing to resolve, install, lock or upgrade, which
removes the whole dependency-failure class before it starts.

The suite is `node research-kit/bin/selftest.mjs`, a custom harness that **awaits** every
test (ADR-0021) and enforces a watchdog per test. CI (`.github/workflows/offline-suite.yml`)
runs, per platform: `selftest`, `preflight`, the release-evidence examples, the three
Node-vs-Python conformance pairs, then asserts its own inputs are unchanged and that the
working tree is still clean.

Baseline before this session: **1172 passed, 0 failed in 49.2s.**
After: **1175 passed, 0 failed in 43.2s.**

## The defect, and the fix that was kept

### `canonicalJson` recursed, so one ledger line could end the process

**Reproduction.** Take any project with a fetch ledger and append one line whose value is
nested a few thousand levels deep. It is valid JSON, so `readLedger`'s `JSON.parse` accepts
it and nothing upstream can refuse it:

```
{"seq":1,"prev":"000…0","op":"fetch","raw":"research/raw/x.md",
 "nested":{"a":{"a":{"a": … 3,000 levels … }}}
```

then run `node research-kit/bin/handoff.mjs`. Before the fix, in full:

```
file:///…/research-kit/lib/core.mjs:304
export function canonicalJson(value) {
                             ^
RangeError: Maximum call stack size exceeded
    at canonicalJson (file:///…/lib/core.mjs:304:30)
    …
Node.js v22.22.3
```

**Root cause.** `canonicalJson` was `value.map(canonicalJson)` over arrays and a
`keys.map(…canonicalJson…)` over objects. Depth in the input became depth on the JavaScript
stack. `entryHash` calls it for every ledger line, `verifyLedger` calls `entryHash`
unguarded, and `handoff.mjs` calls `verifyLedger`.

The limit was not even stable: in one process, depth 3,000 threw and depth 4,000 did not,
because it depends on what else was on the stack. There was no number to document around.

**Severity: High.** Not because the input is likely, but because of where it landed.
`handoff.mjs` is the first command a builder runs, its exit 1 means *"the corpus did not
arrive"*, and its whole purpose is to name the cause and say which machine owns the remedy.
Instead it printed a V8 stack trace and pointed at the wrong machine. A builder would have
gone back to the collector to re-push — or re-collect, spending credits — a corpus that was
on disk and fine.

**Impact.** One malformed line anywhere in the ledger stops every builder-side command that
verifies the chain, with no diagnosis, and misattributes the cause to the other machine.

**Fix.** `canonicalJson` now walks an explicit stack instead of recursing
(`research-kit/lib/core.mjs`). Depth in the input is now bounded by the heap, not by the
call stack: a 20,000-deep document renders 120,001 characters.

The rendering had to stay byte-identical, because the ledger's entry hash and three
conformance vector files are taken over it. It was verified **differentially against the
recursive implementation before it replaced it** — 31 hand-written corner cases plus 20,000
generated structures, all byte-identical. That check earned its keep: the first rewrite
diverged on an object holding a value `JSON.stringify` cannot encode, because the recursive
form rendered it through a template literal (`"undefined"`) inside an object but through
`Array.prototype.join` (`""`) inside an array. Both spellings are now reproduced rather
than tidied, and the test that ships keeps the old implementation as its oracle.

After the fix the same ledger line reads:

```
handoff FAILED
--------------
  handoff-chain-broken  entry-hash: entrySha256 does not recompute for seq 1
  handoff-chain-broken  raw-missing: capture named by seq 1 is not on disk
```

Both new tests **fail against the recursive form** and pass against the fix — checked by
stashing the fix and re-running, so neither is vacuously green.

Committed as `00c7ad6`. Files: `lib/core.mjs`, `test/hardening.test.mjs`,
`test/provenance.test.mjs`, `README.md` (the suite's own count gate required the last one).

## A fix that was designed and then rejected

`verifyLedger` calls `entryHash` unguarded, so the obvious companion change was to wrap it
and report a named `entry-hash` problem — matching the convention stated thirty lines below
it, where an unreadable capture is deliberately "a named failure, not a crash".

It was written, and then removed. With `canonicalJson` iterative, nothing reachable from a
ledger line can throw out of `entryHash` any more: the entry came from `JSON.parse`, so it
holds no `BigInt` and no getter, and those were the only other ways. The catch would have
been unreachable, and this repository pins every check it ships — an untestable branch is
the opposite of that. The empirical test settled it: with only the `canonicalJson` fix in
place, the reproduction above already produces a clean named verdict.

## What survived

Each of these was run, not reasoned about.

| Probe | Result |
|---|---|
| 20 hostile corpus mutations — Raw cell climbing out of the project, capture as a symlink to `/etc/passwd`, capture as a directory, mode 000, NUL byte, invalid UTF-8, one 4 MB line, duplicate IDs, RTL override, BOM, CRLF, future and unparseable dates, `kit.json` not JSON and as an array, negative and `1e309` budgets, `EVIDENCE.md` as a directory, empty ledger, non-JSON ledger line | **0 throws.** Every one judged: preflight blocked, with findings |
| MCP stdio server: 60 MB line with no newline, a 60 MB line between two valid requests, invalid UTF-8 mid-stream, no trailing newline, 20,000 requests, 50,000-deep params, bare arrays/scalars/`null` as messages, NUL inside a message | **exit 0 in all eight.** The over-long ones are refused and the stream recovers |
| Every `bin/*.mjs` × 6 hostile argv shapes (`--totally-made-up-flag`, `--=x`, bare `--`, `-- --x`, empty) | **no stack trace from any of them** |
| Machine role: `"emperor"`, `"Builder"`, unparseable config | all resolve to `unknown` with `mayCollect=false`, naming the value it did not recognise (ADR-0023 holds) |
| Clone with `core.autocrlf=true` | `.gitattributes` held: full suite **1175 passed**, `handoff OK` over 33 entries, tree clean |
| Repository reached through a symlink; repository at a path containing a space | both green |
| Two full suites in parallel in one checkout | **1175 passed** twice, both exit 0 |
| `TMPDIR` pointing at a file | named at the top *and* under the red summary, with the remedy |
| Date edges: `0000-01-01`, year 275760, negative years, `not-a-date`, `2026-13-45`, bad offsets | no throw; unparseable reads as `undated`, which is a cache miss — the safe direction |
| `preflight`, release examples (6/6), all three Node/Python conformance pairs, hook mode 100755, validator inputs unchanged | all green |

## Remaining risks, most dangerous first

**1. The release validators still recurse, and say so in V8's words.**
`lib/release/canonical.mjs` and `lib/release/json.mjs` are both recursive, so a deeply
nested record produces `RECORD-READ: Maximum call stack size exceeded` (measured on all
three subcommands: `validate` → INCOMPLETE/2, `conform` → INCOMPLETE/2, `fi-validate` →
FAIL/1). Every caller catches it and names the file, so this is a diagnostics gap, not a
crash — but the message names a runtime limit rather than the fact about the document.
*Remedy:* a depth counter in `JsonReader` that says "nested deeper than N levels at byte K".
Not done here: it adds a refusal code to a validator whose vectors are a contract, for a
failure that already exits non-zero and names its file.

**2. Node and Python agree only as deep as the vectors go.**
Node's strict reader accepted 4,000 levels in this session; CPython's `json` recursion
limit is around 1,000. The suite asserts cross-language agreement per vector, and every
checked-in vector is shallow, so "the two languages agree" is unproven for deep input —
exactly the shape of the defect `canonical-float-policy.test.mjs` exists because of (28
chosen vectors, none containing a float, suite green, claim untrue). *Remedy:* one deep
vector in each packet, or a stated depth bound both sides enforce.

**3. The ZIP writer's limits are the runtime's, and they disagree with the reader's.**
`buildZip` throws `RangeError: The value of "value" is out of range…` above 65,535 entries
or a 65,535-byte entry name (both measured), while the reader refuses at 5,000 entries and
1,024 characters — so the writer can produce a package this kit's own reader rejects.
Measured **unreachable** from the kit's own writers: the audit bundle names entries with
`path.basename`, bounded by the filesystem, and artifact names are slug-plus-digest. Left
alone because the only way to reach it is to hand `buildZip` a name it was never given.
*Remedy if that ever changes:* refuse at the reader's limits, in words, in `entryName`.

**4. Memory pressure ends the suite without a verdict.**
Under `NODE_OPTIONS=--max-old-space-size=24` the run aborts with SIGABRT (exit 134) inside
`large-response.test.mjs` — 745 of 1172 tests in — and writes no result file. That is the
allocation-heavy test doing its job against an absurd ceiling, and CI already distinguishes
it correctly: the missing file reads as *"the runner crashed before reporting"*, which is a
different fact from a red suite. No change.

**5. `handoff OK` is not a safety verdict, and reads like one.**
A capture that is a symlink to `/etc/passwd`, with the target's hash recorded in the
ledger, verifies: `verifyLedger` → ok, `verifyHandoff` → ok. Containment is preflight's
question, and preflight refuses it with `capture-outside` and `raw-outside`. The layering
is right (ADR-0076), but the line a builder reads first says *"every cited capture on disk,
chain verifies"* — true, and not the whole answer. *Remedy:* none proposed; naming it here
so the sentence is not read as clearance.

**6. An unparseable `Retrieved` date draws no finding.**
A future date is caught (`future-date`); `not-a-date` and `0000-01-01` are not, reading as
`undated`. That is a safe direction for cache reuse and may well be intended — the ledger's
`at` field is the authoritative fetch time and the chain does check it. Recorded because it
is an asymmetry in what the gate asserts, not because anything broke.

**7. Node 24 and Node 26 — closed by CI, not locally.**
ADR-0046 and the `node-lines` job promise every supported line passes. `nodejs.org` is
unreachable from the sandbox this session ran in (`SSL_ERROR_SYSCALL`; only the npm
registry proxy answers), so no second runtime could be fetched and every measurement above
is Node 22. That was the one gap in the local evidence, and it mattered most here: the
`canonicalJson` rewrite is the change with runtime-sensitive surface.

It is closed on the pull request rather than in this session. `gh pr checks 129` on the
commit under review returned **pass** for all six checks — `node (24)`, `node (26)`,
`platform (ubuntu-latest)`, `platform (ubuntu-26.04)`, `platform (windows-latest)` and
`suite`. What could *not* be read is the per-platform test count each leg published: the
Actions log archive is served from `results-receiver.actions.githubusercontent.com`, which
this sandbox cannot reach (`EOF`). So the verdicts are measured and the counts are not;
a reviewer with ordinary network access can read them in the job summaries.

## Hardening recommendations

1. Give `JsonReader` a depth bound with a message that names the document, closing risks 1
   and 2 together, and put one deep vector in each conformance packet so the two languages
   are compared at the bound rather than below it.
2. Have `buildZip` refuse at the reader's limits, in words. Cheap now, and it removes the
   only asymmetry left between the container's writer and its reader.
3. Risk 7 is closed by CI on this branch, but only in verdicts. Whoever merges should read
   the job summaries for the per-platform counts — this session could not reach the log
   archive to read them, and a count is the one number in a job summary that a pass/fail
   badge does not carry.

## Summary

The build is unusually hard to break, and the reasons are structural rather than lucky: no
dependency graph to fail, no lockfile to corrupt, no network in the suite, a harness that
awaits its tests so a green `ok` means the assertions settled, and a repository that pins
each defect it has ever found with a test that fails without the fix. Four adversarial
passes over argv, corpus content, stdio input and machine configuration produced **no
crashes at all**.

One real defect was found and fixed. It was not exotic: a recursive function hashing a file
that crosses machines and can be hand-edited. What made it worth fixing was its location —
it turned the builder's first command into a stack trace that blamed the wrong machine, and
exit 1 there already means something specific. The fix is one function, byte-identical to
what it replaced, proven so differentially over 20,031 inputs before it shipped.

The suite is green at 1175 tests locally on Node 22, and all six CI checks pass on the
commit under review — including the Node 24 and Node 26 legs this sandbox could not run.
The working tree is clean.
