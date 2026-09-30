# Build report — break-test, 2026-09-30

An adversarial pass over the whole build: find realistic ways it fails, apply only the
fixes that leave the suite green, and revert anything that does not. It follows
[the 2026-09-29 break-test](build-report-2026-09-29-break-test.md) and starts where it
stopped — on the risks it left open, and on the two hardening rules it wrote down.

**How the build is run.** One command, offline, no key and no network:

```
node research-kit/bin/selftest.mjs
```

Baseline before this pass: **1344 passed, 0 failed** (51.2s). After: **1348 passed, 0 failed**
(45.4s), with the README's advertised count moved with it — the suite refuses a stale one.

CI's other steps were run locally too, and all pass: `preflight` (PASS, 0 blocking, 29
passing), the release-evidence examples (6/6), the Node/Python conformance pairs (3/3
agree), the corpus's derived files regenerating to their committed bytes, and the suite
from a tree with no `.git` and a space in its path.

---

## What was probed, and what held

The suite is hard to break, and most of the credit belongs to the passes before this one.
These were all reproduced and all **passed**:

| Probe | Result |
|---|---|
| The full CI sequence, run locally (preflight, examples, conformance, derived-file regeneration, clean tree) | all green |
| The suite from a `git archive` tree — no `.git`, a space in the path | 1344 green |
| 24 CLIs × 27 hostile argv spellings (`--`, `-`, `---topic`, `--flag=`, malformed numbers, `/etc/passwd`, `/proc/x`, unicode, doubled flags) | no raw stack trace |
| 14 commands against a `chmod 555` project | every write named in words, exit 2 |
| `install --into /dev/null`, `install-hooks` with an undeployed HOME | named refusal, exit 2 / named remedy, exit 1 |
| Corrupt, empty and directory-shaped `research/kit.json` | normal verdicts, no crash |
| Flag parsing: `--flag=value`, repeated flags, bare `--`, `---topic`, `--topic --force`, 2,000 flags, unicode | all as documented |
| `checkFlagValues`: `1.5`, `0x10`, `+5`, `" 5 "`, `""`, out-of-range | refused, naming the flag |
| Parser fuzz — 21 hostile payload shapes × 9 parser entrypoints | 0 throws |
| `install` → `install-hooks` → `uninstall` → `uninstall` → corrupt-state round trip in an isolated HOME | idempotent, exit 0 |
| `install`, `preflight`, `doctor`, `handoff`, `audit`, `measure`, `disclosure` and ten others with stdout closed early or sent to `/dev/full` | only `install` failed (defect 3) |

---

## Discovered failures, and what was done

### 1. The Firecrawl parsers read a field of the wrong type as if it were the value

**Repro**

```
node -e 'import("./research-kit/lib/firecrawl.mjs").then(m => console.log(
  m.normalizeScrape(JSON.stringify({data:{markdown:"x".repeat(1600),
    metadata:{sourceURL:{href:"https://docs.example.invalid/limits"}, title:{}}}}),
    "https://docs.example.invalid/limits")))'
{ url: { href: 'https://docs.example.invalid/limits' }, title: {}, ... }
```

Fed through the collector, that becomes a capture named
`2026-09-30-object-object-page-b28c94b2.md` whose front matter reads `url: [object Object]`,
and a ledger row whose URL is the stringified object. `normalizeSearch` keeps
`{ url: 42, title: {}, description: [], position: "2" }` as a candidate.

**Root cause.** Every other vendor parser reads a non-string field as empty —
`serpapi.normalizeSearch` was hardened on 2026-09-28, `searxng`'s on 2026-09-29 — and this
one, the same shape from the same kind of untrusted source, was not. `row.url ?? row.link ?? ''`
and `data.metadata?.sourceURL ?? data.url ?? url` carry whatever type arrives. The last
report's own hardening note said a test feeding one hostile shape to *every* vendor parser
would have caught this on the day the first fix landed; there was no such test.

**Severity: High.** The corpus is this kit's evidence. A URL the kit never fetched is
recorded as the page's own, the capture name is keyed on a digest of the object, and nothing
anywhere reports a problem — the run succeeds.

**Fix.** A `text()` helper (`typeof value === 'string' ? value : ''`) and a `scalar()` for
status codes, applied to `url`, `title`, `statusCode` in `normalizeScrape` and to every
field of `normalizeSearch`, plus `Number.isFinite` for `position` — exactly the shape the
two sibling parsers already use. A real payload still prefers the vendor's `sourceURL` and
still keeps `statusCode: 200` and `"503"`, so the error-page rule keeps working.
**Tests:** `transport > every vendor parser reads a field of the wrong type as empty, the
same way` — one hostile shape, all three parsers, so they cannot drift apart again.
**Status: applied.** Suite green.

### 2. A filename the filesystem accepts was refused, and as a stack trace

**Repro**

```
cd <any research project>
node research-kit/bin/export-warc.mjs --out "$(python3 -c "print('y'*240)").warc.gz"
# before: Error: ENAMETOOLONG ... open '.yyy….warc.gz.tmp-19700-930ef54b'  (exit 1)
# after:  wrote 1 record (0 captures)                                     (exit 0)

node research-kit/bin/researcher-release.mjs fi-validate … --report "<250 chars>.json"
# before: node:fs:2430 … Error: ENAMETOOLONG … (exit 1)  — a raw stack for a write
```

**Root cause.** Two layers, one accident. The atomic write's scratch file is
`.${basename}.tmp-${pid}-${hex}`, about twenty bytes longer than the file it is about to
replace — so a basename the filesystem accepts (248 bytes is legal on ext4 and tmpfs) made
the *scratch* too long and the write failed where a plain write of the same name succeeded.
And `WRITE_REFUSALS` in `lib/core.mjs` had no `ENAMETOOLONG`, so `writeFailure` returned
null, the entrypoint re-threw, and the operator got Node internals and exit 1 — which is
this kit's code for "a check failed".

**Severity: Medium.** Long descriptive export names are ordinary, and the failure is
indistinguishable from a bug in the kit. The same missing code would turn any genuinely
over-long name into a stack trace rather than a sentence.

**Fix.** The scratch carries at most 100 characters of the target's name (the pid and random
suffix still make it unique), and `ENAMETOOLONG` is named in the refusal table.
**Tests:** `cli > a too-long name is a named refusal, and a legal long name still writes`
(portable table check plus a POSIX-only 240-character write, with a leftover-scratch
assertion) and a POSIX-only case added to `warc > a refused write is named in words`.
**Status: applied.** Both new tests were proved to fail against the unfixed code (2 failed)
before being kept.

### 3. `install` died with an unhandled `'error'` event when its reader went away

**Repro**

```
node research-kit/bin/install.mjs | head -2      # exit 1, node:events:497 throw er; …
node research-kit/bin/install.mjs > /dev/full    # exit 1, the same stack
```

A deploy that **succeeded** — 231 files on disk — reported itself as a failure.

**Root cause.** `tolerateClosedStdout` was installed in `selftest.mjs` (2026-09-28, 99 KB of
output against a 64 KB pipe) and in `mcp-server.mjs` (2026-09-30, a client that leaves), but
not in `install.mjs`, which prints its next steps last and so writes after its reader has
gone. The comment in `hardening.test.mjs` claimed "every other entrypoint was measured under
the buffer" — a true measurement of the wrong property: a reader that closes early is enough,
whatever the size.

**Severity: Medium.** `install | head`, `| less` (quit), `| grep -m1` and CI log capture all
produce this, and the exit code is the one an operator reads.

**Fix.** One `tolerateClosedStdout()` before the first write, exactly as the other two
entrypoints do; a refused stdout is still named ("could not write its output: ENOSPC …") and
exits 2, not 1.
**Tests:** `cli > install survives a stdout the environment refuses, and names it in words`
(POSIX-only, `/dev/full`) and `cli > install installs the stdout guard before it writes its
first line`. Both proved to fail against the unfixed code.
**Status: applied.** Suite green.

---

## Considered and not fixed (with the reason)

- **The `/proc` hang.** `install --into /proc/x`, `export-warc --out /proc/x/y.warc` and any
  other path whose parent is procfs spin at 100% CPU forever: `fs.mkdirSync(…, {recursive:true})`
  reads procfs's ENOENT answer as "a parent is missing" and retries. Measured in isolation —
  bare `mkdirSync('/proc/x', {recursive:true})` hangs, while `/sys/x`, a dangling symlink, a
  symlink loop, a read-only folder and `/dev/null/x` all fail fast. The loop is inside Node, so
  a fix means replacing recursive mkdir everywhere it is called for a path an operator typed.
  Out of proportion to the likelihood; recorded as the top residual risk instead.
- **ENOENT from `open` is still not named.** `writeFailure` names ENOENT only for `mkdir`
  (2026-09-30's fix) and the comment says why: a missing copy *source* must not be blamed on
  the destination. The `/proc`-shaped stack above is the price of that decision, and it is
  the deliberate one.
- **A blanket `tolerateClosedStdout()` for all 34 entrypoints.** Three sweeps (stdout
  destroyed at spawn, `> /dev/full`, `| head -1`) found only `install` vulnerable; the rest
  finished before the error was delivered. Changing every entrypoint for a case not observed
  is not the smallest fix — the recommendation below is what should stop it recurring.
- **`artifact create --output <over-long>`.** It already names the refusal in words
  (`could not package …: ENAMETOOLONG …`) and exits 3, its documented BLOCKED code, because
  `create` catches every packaging error by contract. Left as it is.
- **`install-hooks` writing the GLOBAL `core.hooksPath` in a folder that is not a git
  repository.** Deliberate: the commit gate is one machine-wide setting
  (`lib/installer.mjs:3`). Not a defect — only a reminder that this command is not
  sandboxed by the project folder.
- **A reported help/flag drift** (`brief`, `measure`, `prior`, `timeline`, `preflight`
  apparently documenting flags they refuse) was my extractor misreading
  multi-template-literal help text, not a finding: each of those flags appears in prose, not
  in the option list. No change made.

---

## Remaining prioritised risks

1. **A pseudo-filesystem that answers `mkdir` with ENOENT hangs the process** (procfs; the
   only one measured). A CPU-spinning install with no output and no exit code is the worst
   failure shape this kit has left, and it is reachable through any operator-supplied path.
   Likelihood is low; blast radius is a pegged core and a command that never returns.
2. **The stack-trace class for write errors the refusal table cannot name.** ENAMETOOLONG
   and ENOENT-from-`mkdir` are now named; ENOENT-from-`open` deliberately is not. Every new
   error code an environment can produce starts unnamed, so this closes by use, not by
   inspection.
3. **The vendor-shape class does not close by inspection.** This pass closed the Firecrawl
   gap; `serpapi.normalizeAccount`, the browser transport's extraction and the keyless
   adapters carry the same assumption and were fuzzed without a finding.
4. **Everything out of scope here that the 2026-09-29 pass listed**: the signed-in
   disclosure surface on a public repository; single-site corroboration; `SIGKILL` leaving
   scratch behind; a tight `RLIMIT_AS` killing the runner before it reports; and a Windows
   leg exercised only by CI.
5. **Surface no test names.** A static sweep for exported names never referenced under
   `test/` listed `core.operatorPath`, `core.isInside`, `core.parseJson`, `gate.stagedPathsFromStdin`,
   `corpus.loadCorpus`, `audit.readAuditFile`, `collect.recentlyGone` and others. Several are
   certainly exercised through entrypoints; the list is a place to look, not a defect.

---

## Hardening recommendations

- **One hostile shape, every parser.** The rule the last report wrote down and this one
  needed: a fix to one vendor parser gets a test that feeds the same shape to all of them.
  It is now in place for the three search parsers — keep it as the pattern.
- **Re-measure a claim when you add what it talks about.** "Every other entrypoint was
  measured under the buffer" was true when written and wrong when `install` grew a next-steps
  block. A measured claim in a comment deserves the date it was measured.
- **A refused write is a table entry, not a local catch.** When an environment error reaches
  a caller as a stack, the fix is the code in `WRITE_REFUSALS` (or `writeFailure`'s mkdir
  case), so every writer gets it at once.
- **Derive temp names from user names carefully.** Anything built by adding to a
  user-supplied name can exceed the limit the user's name just fit under; bound the derived
  part by construction.
- **An entrypoint that keeps working after it writes needs the stdout guard.** `install` did
  not have it; a cheaper general rule than a static check is "if the last thing you do is
  print, tolerate a reader that left".

---

## Summary

Three defects found, three fixed, none rejected: the parsers that record evidence, the write
path that names refusals, and the entrypoint that reports a deploy's success. Each fix is
small — a type check mirroring an existing one, a bounded scratch name plus one table entry,
a single call the other two entrypoints already make — and each new test was proved to fail
against the unfixed code before it was kept. The suite is green at **1348 passed, 0 failed**
(from 1344; four tests are new and each pins one property), the README's advertised count
moved with it, and the whole CI sequence passes locally, including the archive-tree leg that
runs with no `.git` and a space in its path.

The build's resilience is unchanged where it was already high: every realistic way to break
the suite has been probed again and holds. What this pass adds is the second step of a
pattern the last one started — the sibling that was missed. Two parser families are now
tested against the same hostile shape; the write path names one more code; the stdout guard
covers one more entrypoint. What remains open is not fragility in the build but three edges
worth knowing: a Node-level hang on a pseudo-filesystem, the error codes the refusal table
does not yet know, and the vendor shapes nobody has seen.

cwd: the repository root. Offline — no key, no credits, no network.
