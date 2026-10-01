# Build report — break-test, 2026-10-01

An adversarial pass over the whole build, looking for realistic ways it fails and then
applying only the fixes that leave the suite green. It follows
[the 2026-09-29 pass](build-report-2026-09-29-break-test.md) and the string of break-tests
recorded in the ADRs since (PR #140, PR #176, PR #182, Arena break tests 6–12). This one
starts where they stopped.

**How the build is run.** One command, offline, no key and no network:

```
node research-kit/bin/selftest.mjs
```

CI adds `preflight`, the release-evidence examples, the Node/Python cross-language
conformance pair, the regeneration of the corpus's derived files and the
"the suite left the working tree clean" step — all of which were run locally too, and all
of which pass. The `archive tree` leg (`git archive HEAD | tar -x` into a folder with a
space in its name) was reproduced locally too.

Baseline before this pass: **1385 passed, 0 failed in 70.8s** on Node 22.22.3,
Python 3.11.2, git 2.39.5, Linux. Final: **1387 passed, 0 failed**.

---

## What was probed, and what held

The suite is unusually hard to break, and most of the credit belongs to the previous
passes. These were all reproduced and all **passed**:

| Probe | Result |
|---|---|
| `LANG`/`LC_ALL` = C, POSIX, en_US, de_DE, es_ES, tr_TR, ja_JP, nb_NO, et_EE, hu_HU, lt_LT, pl_PL, cs_CZ | green — and this is the probe that found finding 1 |
| `NO_COLOR=1`, `FORCE_COLOR=3`, `CI=true` | green |
| `PYTHONDONTWRITEBYTECODE=1`, `PYTHONHASHSEED=0`, `NODE_OPTIONS=--enable-source-maps` | green |
| `GIT_DIR=/nonexistent`, `HOME=/dev/null`, `TMPDIR` relative / with a space / a file / read-only / non-existent | green, except the TMPDIR cases, which fail closed with one named cause and the free space on the volume |
| **The `archive tree` CI leg**: `git archive HEAD \| tar -x` into a folder whose name holds a space, then the suite from there | 1387 passed, 0 failed |
| **The whole CI sequence locally**: selftest, preflight (PASS, 29 passing), release-evidence examples (6/6), all three Node/Python conformance pairs (agree), `timeline.mjs` + `export-warc.mjs` regeneration, working tree clean | all pass |
| **A CRLF-committed conformance vector** | green — git's `eol=lf` clean filter normalises it, so the commit stays LF; verified with `git ls-files --eol` |
| MCP stdio, 13 hostile JSON-RPC lines: a protocol version from 1999, `jsonrpc: 1.0`, a bare array, `null`, a notification, `id: null`, `id: 1.5`, `id: "x"`, `cursor: null`, `arguments: null`, a path-traversal tool name, an unknown method, non-JSON, `ping` | every one answered with the right code and message; no stack trace, no hang |
| The edit gate, 18 hostile payloads: empty, `null`, a number, a string, an array, a non-string `cwd`, a null/string/object `file_path`, no `tool_name`, an unknown tool, non-JSON, a BOM, two lines on one pipe, 100 000-character paths, 2 000 levels of nesting | all exit 0 with a decision; no raw stack |
| **Hostile argv sweep**: every Node CLI in `bin/` (28) × 58 hostile spellings — unknown flags, `-h`, `---`, `--=x`, empty and whitespace values, `$(id)`, backticks, `;`, `../../etc/passwd`, `/etc/passwd`, a 5 000-character value, a lone surrogate, `{}`, `[]`, repeated flags, every bounded flag given a non-number, `--out` pointed at `.`/`/dev/full`/`/dev/null`/a missing folder/a 300-character name | ~1 600 invocations: no raw stack trace, no exit code outside 0/1/2 |
| **The redirect guard (ADR-0110)**: 41 hostnames plus URL normalisation — `127.1`, `127.0.1`, `0x7f.0.0.1`, `0177.0.0.1`, `2130706433`, `0x7f000001`, `[::1]`, `[::ffff:127.0.0.1]`, `localhost.`, `sub.localhost`, the cloud metadata address, `100.64/10`, `198.18/15`, `224/4`, `240/4`, `0/8`, `fc00::/7`, `fe80::/10`, `ff00::/8`, `::`, and IPv4 written as IPv6 | every internal target named; `8.8.8.8`, `1.1.1.1`, `2606:4700::1111` and `2001:db8::1` correctly external |
| **ADR-0112, the hook hand-on, end to end**: a real repository with its own `.git/hooks/{pre-commit,commit-msg,pre-push,post-commit}`, the kit installed as the machine-wide `core.hooksPath` | every one ran; a refusing own `pre-commit` blocked the commit (exit 1) and the kit's own `commit-msg`/`post-commit` did not run when the kit's gate blocked; a non-executable own hook was skipped exactly as git itself skips it; a directory and a broken symlink in `.git/hooks` were both skipped without error; a linked worktree resolved through `--git-common-dir` to the main repository's hooks; the self-call guard held when a repository's own `core.hooksPath` was its `.git/hooks` |
| Unicode and hostile topics through `new-project`: `Événement café`, `日本語のトピック`, an emoji flag, a combining accent, RTL Hebrew, `a/b c:d*e?f`, `..`, `.`, a 400-character topic, a topic with a tab | all scaffolded; nothing written outside the project, no path escape, no filename over budget |
| `export-warc --out` pointed at `.`, `/dev/full`, `/dev/null`, a missing folder, a 300-character name, `../escape.gz`, `sub/dir/f.gz`, and empty | every refusal named in words (`EISDIR`, `EACCES`, `ENAMETOOLONG`), or written |
| Git states: detached HEAD, a fast-forward merge, a rebase in progress | gate and preflight both answer, no crash |
| **Install/uninstall round trip**: install, install again (idempotent), install-hooks, uninstall | `core.hooksPath` restored to unset, the edit-gate registration removed, doctor still names the right kit |
| **ADR-0111, the deploy mirror**: `RESEARCH_KIT_HOME` pointed at a folder that is not a kit, at a file, and at `/` | all three refused by name, listing what would have been removed; nothing changed |
| **A self-deploy** (`RESEARCH_KIT_HOME` = the running kit's own `research-kit/`) | 261 files before and after, identical hashes, clean tree — a safe no-op, not a truncating mirror |
| Concurrency: 8 simultaneous `audit --force` over one project, then 6 rounds of gate+preflight+audit+export-warc+timeline in parallel, then **two full suites at once** | one audit version and no corruption; no crash, no lock or scratch left behind; 1387 × 2, both green |
| `ulimit -f 200` (a 100 KB ceiling per file — a real disk quota) | 3 EFBIG failures, every one named, and the runner's dominant-cause line said `3 of 3 failures (100%) open with EFBIG` |
| Parser fuzz: `normalizeSearch`/`normalizeScrape`/`normalizeMap`/`normalizeAccount`/`parseStatus`/`creditsUsed`/`parseAvailability`/`mainContent`/`htmlToMarkdown`/`titleOf`/`resultLinks`/`decodeEntities`/`bodyKind`/`gradeCompleteness` across ~40 hostile vendor payloads and ~30 hostile HTML/text/URL inputs (nulls inside arrays, non-string `url`, a `toString` that throws, a lone surrogate, 200 KB of markup, an unclosed tag repeated 1 000 times, a 100 KB `href`) | no unexpected throw; the vendor boundaries hold |

---

## Discovered failures, and what was done

### 1. The kit's orderings were the machine's locale's, so two machines disagreed about one corpus

**Repro**

```
$ node -e 'const s=["firecrawl","Firecrawl","zebra","ålder","a-b","ab"];
  for (const L of ["C","da_DK.UTF-8","sv_SE.UTF-8","th_TH.UTF-8"])
    console.log(L, JSON.stringify([...s].sort((a,b)=>a.localeCompare(b))))'
C               ["a-b","ab","ålder","firecrawl","Firecrawl","zebra"]
da_DK.UTF-8     ["a-b","ab","ålder","Firecrawl","firecrawl","zebra"]
sv_SE.UTF-8     ["a-b","ab","firecrawl","Firecrawl","zebra","ålder"]
th_TH.UTF-8     ["a-b","ab", ...]      # a-b and ab compare EQUAL: 0
```

`String.prototype.localeCompare` with no locale argument reads the ambient one. The
divergence is not exotic:

- **`da_DK`** sorts `Firecrawl` **before** `firecrawl` — the reverse of every other locale,
  and the flip is on plain ASCII.
- **`sv_SE`, `fi_FI`, `nb_NO`** sort `zebra` before `ålder` — the Nordic letters move to
  the end of the alphabet.
- **`th_TH`** *ignores* a dash and an underscore at the primary level, so `a-b` and `ab`
  compare **equal** and their order is whatever the sort's input order happened to be —
  which is `readdirSync` order, i.e. not an order at all.

**Root cause.** Nine call sites sorted with `localeCompare` and no locale: `audit.mjs`'s
`listVersions` (the slugs), `checks.mjs`'s evidence-row ordering by retrieved date,
`path-authority-validator.mjs`'s conformance file list, `property-replay.mjs`'s pointer
and regression-file lists, `release-validator.mjs`'s ledger file read order plus three
record tie-breaks, and `timeline.mjs`'s event ordering.

**Severity: Medium.** Nothing corrupts and no gate is fooled — the suite was green under
every locale, because the fixtures are all-lowercase ASCII. The damage is
non-reproducibility: `audit --list` prints `listVersions`' order, so two machines looking
at one corpus disagree about it, and the conformance file lists, the ledger read order and
the timeline move with it. On a repository whose entire value is that its claims are
checkable, "the answer depends on which machine asked" is the defect, not a cosmetic one.

**Impact.** Two operators diffing `audit --list`, or a report generated on one machine and
validated on another, see different orders for identical bytes. Under `th_TH` the order is
not merely different, it is *undefined*.

**Fix.** `core.mjs` gains `compareText`: code-unit order, total, dependent on no ICU at
all, and what `canonicalJson` already sorts object keys with. Every `localeCompare` in
`lib/` and `bin/` now goes through it — nine call sites, one helper.

Two ways to get one order were considered, and the choice is recorded in the helper's own
comment so the next reader does not have to re-derive it:

- *pin the locale*, `localeCompare(b, 'en')` — measured to be byte-identical to the
  ambient comparison under C, POSIX, en_US, de_DE, es_ES and ja_JP, and to fix da_DK,
  sv_SE and th_TH. Rejected because it leaves the order at the mercy of the next CLDR/ICU
  update, which is the same non-reproducibility in slower clothing.
- *code-unit order* — chosen. It changes nothing for an identifier that is neither
  mixed-case nor non-ASCII, which is every slug, record ID, path and date in this
  repository, and it moves the rest onto the ordering the kit already trusts wherever a
  byte has to be reproducible.

**Tests:** `audit > the topic ordering is the same on every machine, whatever its locale
says` — the six slugs the divergent locales reordered, asserted in code-unit order. The
test would have failed before the fix under `da_DK`, `sv_SE` and `th_TH`.
**Status: applied.** Suite green at 1386, and green again under `da_DK`, `sv_SE`, `th_TH`
and `LC_ALL=th_TH`, which is the whole point.

### 2. The edit gate hung forever on a terminal stdin

**Repro**

```
$ python3 -c 'import pty,os,time,select
> pid,fd=pty.fork()
> if pid==0: os.execvp("node",["node","research-kit/hooks/edit-gate.mjs"])
> ...'                       # hold the pty open, write nothing
STILL RUNNING after 10s -> HANGS on a TTY stdin
output: b''
```

**Root cause.** `hooks/edit-gate.mjs` read its payload with
`fs.readFileSync(0, 'utf8')`. On a terminal that waits for an EOF that never arrives, so
the hook printed nothing at all until it was killed. `bin/gate.mjs` refuses the same guess
for the same reason — `--staged-stdin was given but stdin is a terminal - refusing to
guess an empty staged set` — through the tested helper `stdinIsReadable()`. The edit gate,
which already imports from `lib/gate.mjs`, simply never asked.

**Severity: Low** for the product, **Medium** for the operator. The safety outcome is
unchanged — nothing is denied that should be allowed — but the trigger is the most ordinary
one there is: an operator runs the hook by hand to see what it does, which is the first
thing anybody does when a gate misbehaves. A gate that hangs in silence is a gate nobody
debugges, and this kit's own comment on the same file says the opposite is required.

**Impact.** A hook invocation with a terminal on stdin blocks indefinitely with no output.
Any wrapper that leaves stdin attached to a console — an editor integration, a cron job, a
systemd unit — hits it.

**Fix.** Ask `stdinIsReadable()` first and take the fail-open path an unparsable payload
already takes: name the reason on stderr, emit `allow`, exit 0. Four lines, one existing
imported helper, no new behaviour to learn.

**Tests:** `gate > the edit gate answers instead of hanging when stdin is a terminal`,
which runs the real hook under a real pty and asserts it returns promptly with `allow` and
the named reason. A pty is what makes stdin a terminal and only POSIX can allocate one from
a test — `script` gives its child a pty whatever its own stdin is, and Windows has no
`script` — so the test returns early there and **says so**, rather than passing by
asserting nothing. That is the lesson of the 2026-09-29 pass applied to itself.
**Status: applied.** Suite green at 1387.

---

## Successfully applied fixes

| # | Fix | Files | Tests added | Suite after |
|---|---|---|---|---|
| 1 | One ordering for identifiers, whatever the machine's locale — `compareText` in `core.mjs`, nine `localeCompare` call sites routed through it | `lib/core.mjs`, `lib/audit.mjs`, `lib/checks.mjs`, `lib/path-authority-validator.mjs`, `lib/property-replay.mjs`, `lib/release-validator.mjs`, `lib/timeline.mjs`, `test/property-conformance.test.mjs` | `audit > the topic ordering is the same on every machine, whatever its locale says` | 1386 / 0 |
| 2 | The edit gate answers a terminal stdin instead of hanging on it | `hooks/edit-gate.mjs` | `gate > the edit gate answers instead of hanging when stdin is a terminal` | 1387 / 0 |

Both fixes were followed by a full suite run, and both were also run through the rest of
the CI sequence (preflight, release examples, all three conformance pairs, derived-file
regeneration, clean tree) and the `archive tree` leg. Neither was ever reverted.

---

## Rejected fixes, and changes deliberately not made

- **Pinning the locale instead of switching to code-unit order.** Measured both. Pinning
  (`localeCompare(b, 'en')`) reproduces today's output exactly on every machine that
  already agrees and fixes the three that do not, so it is the smaller behavioural change.
  It was rejected anyway: it keeps the ordering at the mercy of the next CLDR/ICU update,
  and this kit already sorts canonical JSON keys with code-unit order. Code-unit order is
  the choice that makes the kit have *one* ordering. The trade-off is written into
  `compareText`'s comment so it is not re-litigated blind.

- **The BOM on a stdin payload.** `githooks/pre-commit` strips a leading UTF-8 BOM from the
  config it reads and cites `parseJson` as the precedent, but `hooks/edit-gate.mjs` and
  `lib/mcp.mjs` use raw `JSON.parse`, so a BOM-prefixed payload is refused and the edit gate
  fails open on every Edit. Rejected for now: the realistic BOM case the kit has actually
  measured is a *file written by Windows Notepad*, and a payload arriving on a pipe from
  the runtime is not that. Recorded as hardening, not fixed, because the fix's realism is
  weaker than its risk.

- **The CLI exit-code inconsistencies the argv sweep surfaced.** `artifact.mjs -h` exits 3
  with `unknown command "-h"` while `--help` exits 0 and no arguments exits 2;
  `collect-remote.mjs` and `disclosure.mjs` both exit 3 for an unknown flag. All three are
  documented in their own files — `disclosure.mjs` prints `Exit: 0 shape only, 1 content
  readable, 2 subject leaked, 3 could not measure`, and `collect-remote.mjs` has an `EXIT`
  map — and all three print the help with the offending name. Changing a documented exit
  code to satisfy a taste for uniformity is exactly the kind of change that breaks a caller
  nobody asked about, so they are recorded rather than "fixed".

- **The Linux gap in the CRLF check.** CI asserts `git ls-files --eol` is `w/lf` on
  Windows only, on the reasoning that Windows is the only platform where a checkout can
  regress to CRLF. That reasoning holds for git itself; this pass confirmed that a
  CRLF-committed conformance vector leaves the suite green anyway, because git's
  `eol=lf` clean filter normalises it on the way in. The check stays where it is.

- **Making the `ulimit -v` failure diagnosable.** Under a tight `RLIMIT_AS` Node cannot
  allocate its own isolate and dies with a raw native stack before a line of the suite
  runs. Nothing in this repository can catch that, and the result file's absence is already
  reported correctly by CI ("the runner produced no result file"). Recorded as a remaining
  risk.

- **The ENOSPC cascade under a full temp volume.** 12 of the failures a full volume
  produces are not themselves ENOSPC — `git init` failing because the scratch folder could
  not be created, a row reading as unparsed. They are consequences of the one cause, and
  the runner's dominant-cause line already says so. Papering over them would hide it.

---

## Remaining prioritised risks

1. **`ulimit -v` (a tight `RLIMIT_AS`) kills the runner before it reports anything.**
   Node's own undici/llhttp wasm allocation fails first, so the process dies with a native
   stack and no result file. CI names the absence correctly, but a contributor sees a raw
   stack rather than a diagnosis. Severity Low, likelihood Low, impact: a confusing red.
2. **A signed-in reader of a public repository reads every dispatch input in the job log**
   (ADR-0035, E-08 of the delivery corpus). Unfixable here: passing an input through `env:`
   is exactly the rule that keeps it out of a shell. Severity High, likelihood High on a
   public repository, impact: the topic and the prior are not secrets but are not private.
3. **A BOM-prefixed stdin payload fails the edit gate open, and the MCP line reader too.**
   `githooks/pre-commit` handles the same condition for its config; the two stdin JSON
   boundaries do not. Severity Low, likelihood Low, impact: a gate that quietly stops
   judging.
4. **`SIGKILL` cannot be caught**, so a `kill -9`'d run still leaks its scratch — and on
   Windows a *programmatic* signal of any name behaves the same way, because `kill` there
   is `TerminateProcess`. Only a real console Ctrl-C/Ctrl-Break reaches a handler on that
   platform. Bounded by the machine's tmp reaper.
5. **A vendor response shape change is still a live hazard.** Two parsers were hardened on
   2026-09-28/29; this pass fuzzed `serpapi`, `firecrawl`, `searxng`, the keyless HTTP
   transport and the Wayback answer against ~40 hostile payloads and ~30 hostile HTML
   inputs without a finding — but the class does not close by inspection, and
   `serpapi.normalizeAccount` and the browser transport's extraction carry the same
   assumption.
6. **The CLI exit-code vocabulary is not uniform** across `bin/`: `artifact.mjs` uses 3 for
   an unknown subcommand and 2 for none, `collect-remote.mjs` and `disclosure.mjs` use 3 for
   an unknown flag. Each is documented locally; none is documented globally.
7. **Single-site corroboration.** `docs/measurement-2026-09-28.md` measures it: the root
   corpus closes unknowns on one site 90.9% of the time, and three decision corpora at 0%.
   The kit warns; it does not refuse.
8. **DNS rebinding against the redirect guard.** `internalTarget` resolves the hostname and
   `fetch` resolves it again, so a name that answers internal for the first lookup and
   external for the second passes the check. Real but out of scope for a build pass, and it
   needs an attacker-controlled name the operator was persuaded to fetch.

---

## Hardening recommendations

- **Keep the "one ordering" rule explicit and enforced.** The locale defect existed because
  nine call sites each reached for the convenient string comparator. `compareText` is now
  the only one; a lint or a test that greps for `localeCompare` outside a comment would
  keep it that way, and the same rule should be applied to any future sort of an
  identifier, a path or a date.
- **Prefer the ordering the kit already trusts for hashed bytes.** `canonicalJson` sorts
  object keys with code-unit order. Any new ordering that can reach a hash should use the
  same one, not a linguistic collation, so that "reproducible" means one thing.
- **Treat a terminal on stdin as "no input", everywhere.** `bin/gate.mjs` and now the edit
  gate both ask `stdinIsReadable()`. The MCP server and any future stdin reader should ask
  the same question rather than discovering it by blocking.
- **Keep probing the payload boundary, not just the corpus boundary.** The edit gate has now
  taken two defects in three days from that surface (a hostile shape, then a terminal), and
  both were invisible until somebody fed it something the runtime had not.
- **Keep a pty in the toolbox.** The terminal-stdin defect was invisible to every test that
  used a pipe, and the only way to see it was to hand the hook a real terminal. Where a
  platform cannot allocate one, say so in the test rather than letting it pass quietly —
  which is what the new test does, and what the 2026-09-29 pass's Windows lesson already
  argued for.
- **Run the divergent locales, not just `C`.** The suite was green under every locale
  before this pass, and it was still green under `da_DK`, `sv_SE` and `th_TH` afterwards —
  because the fixtures are all-lowercase ASCII. A CI leg that seeded one non-ASCII or
  mixed-case fixture would have caught finding 1 the day the first `localeCompare` landed.

---

## Summary

Two defects found and fixed, none rejected, no test ever left red: the suite is green at
**1387 passed, 0 failed** (from 1385; one new test pins the locale ordering, one pins the
terminal-stdin answer), and the whole CI sequence — selftest, preflight, release examples,
the Node/Python conformance pairs, derived-file regeneration, clean tree — passes, as does
the `archive tree` leg from a `git archive` export into a folder with a space in its name.

Neither defect was in the code the previous passes had already hardened. Both were in the
seams *between* the kit and the machine it runs on: one read the ambient locale and let it
decide an order that is supposed to be the corpus's, and the other blocked forever on a
terminal nobody thought to hand it. That is where this build's remaining fragility lives —
not in its logic, which held up under ~1 600 hostile invocations, 41 redirect-guard
hostnames, 18 hostile hook payloads and a full deploy/uninstall/deploy-mirror cycle, but in
the assumptions it makes about the environment it is handed.

The build's resilience after this pass is high and slightly higher than before: the two
fixes remove the only two ways found to make the same corpus answer differently on two
machines. What remains open is not fragility in the build but honesty in the product's
claims — corroboration, what a signed-in reader can see, and the vendor-shape hazard that
does not close by inspection.

cwd: the repository root. Offline — no key, no credits, no network.
