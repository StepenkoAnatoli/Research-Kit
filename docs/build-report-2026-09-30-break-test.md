# Build report — break-test, 2026-09-30

An adversarial pass over the whole build: find realistic ways it fails, apply only the fixes
that leave the suite green, and revert anything that does not. It follows
[the 2026-09-29 pass](build-report-2026-09-29-break-test.md), which found six defects in the
transport, the edit hook, scratch cleanup, `install --dry-run`, `collect-remote` and
`makeSlug`. This one starts where that stopped.

## Project and build overview

`research-kit/` is the kit: plain Node, no dependencies and no `package.json`, with a Python
twin for the three cross-language conformance runners. The repository is also its own example
project — `research/` here is a real, passing corpus.

The build is one offline command, plus the CI sequence that surrounds it:

```
node research-kit/bin/selftest.mjs            # 1334 tests, no key, no credits, no network
node research-kit/bin/preflight.mjs           # this repository's own verdict: PASS
node research-kit/examples/release-evidence/run-example.mjs
# Node vs Python per vector: ledger, FI sidecar, property graph
node research-kit/bin/timeline.mjs && node research-kit/bin/export-warc.mjs
git status --porcelain                        # must be empty: the suite is read-only
```

CI runs that on `ubuntu-latest`, `ubuntu-26.04` and `windows-latest` (Node 22), on Node 24
and 26, and from a `git archive` tree with no `.git` (`offline-suite.yml`). Locally this pass
used Node v22.22.3, Python 3.11.2, git 2.39.5, two cores. Baseline before the pass:
**1331 passed, 0 failed in 51.6s**.

## Discovered failures and actions

### 1. A duplicate key in `plan.json` was read by the command that spends

**Repro**

```
mkdir /tmp/probe && cd /tmp/probe
node research-kit/bin/new-project.mjs . --topic "duplicate key probe"
# two "url" keys in one entry - a paste, or two entries merged by hand
cat > research/plan.json <<'JSON'
{ "topic": "probe", "depth": "quick",
  "urls": [ { "url": "https://example.com/one", "why": "U-1", "type": "P" },
            { "url": "https://example.com/two", "why": "U-1", "url": "https://example.com/three", "type": "P" } ] }
JSON
node research-kit/bin/research.mjs --dry-run --transport http-keyless
skipped   https://example.com/three - would collect (first capture)
```

No mention of the duplicate: `JSON.parse` keeps the **last** of two equal keys, so the entry
the operator wrote is not the entry that would be fetched. A real run spends its credits on
`.../three`.

**Root cause.** `bin/research.mjs` parses the plan with `parseJson` and then asks
`planProblems(plan)` — and a parsed object cannot say a key was duplicated. The corpus reader
already had the rule and a private `duplicateKey(text)` behind it, and `preflight` does name
it (`corpus-shape/plan-unparsed  research/plan.json duplicate object key "url" at byte 182 …
JSON keeps only the last value, so the first is silently lost`) — but preflight runs *after*
collection in the documented sequence, so the verdict arrives once the credits are gone.

**Severity: High.** The command that spends was reading the file differently from the gate
that judges it, and the difference is silent.

**Fix.** `duplicateKey` is exported from `lib/corpus.mjs`; `bin/research.mjs` refuses before
anything is planned, in the file's own words:

```
research/plan.json duplicate object key "url" at byte 182 - JSON keeps only the last value,
so the first is silently lost - fix it, then run this again.
```

`--status` still works — it is read-only, and the guard sits on the path that spends.
**Tests:** `cli > research refuses a plan with a duplicate object key before it spends anything`
(the refusal, and a sound plan still passing). **Status: applied.** Suite green.

### 2. `audit.mjs` printed a command that refuses to run

**Repro**

```
node research-kit/bin/audit.mjs         # v0.1 under slug A: "One attachment instead of 13
                                        # pastes: node .../audit.mjs --zip"
# refine the map's topic line - the line phase 0 asks the operator to own
node research-kit/bin/audit.mjs         # writes a SECOND chain under slug B, says nothing
node research-kit/bin/audit.mjs --zip   # several topics hold audits and none was named  (exit 2)
```

Reproduced with a synthetic project (`fixture-topic` → `fixture-topic-refined`) and in this
repository's own project, where the committed audits are held under
`the-research-kits-own-protocol-metered-primary` and a fresh run creates
`the-research-kit-s-own-protocol-metered-primary-source-colle`.

**Root cause.** The chain is keyed by `makeSlug(corpus.map.topic)`, so a refined topic text is
a new topic — and the CLI printed a bare `--zip` regardless. The refusal itself is deliberate
and tested (`audit > several topics and none was named`); what was not deliberate is that the
fork was silent and the next step printed by the tool could not work.

**Severity: Medium.** No data is lost — audits are immutable and the old chain stays — but the
operator's "one pasteable file" step breaks, and a second chain appears without a word.

**Fix.** `bin/audit.mjs` reads the topic list *before* the write; when the slug is new while
other topics exist it says so, names them, and appends the flag that makes the printed command
work:

```
This started a NEW topic, `fixture-topic-refined` - the map's topic line decides the
slug, and it does not match the one audits are already held under: fixture-topic.
...
  node .../audit.mjs --zip --topic fixture-topic-refined
```

The chain semantics are unchanged: the fork still happens, and the operator still decides.
**Tests:** `cli > a refined topic line starts a new audit chain, the CLI says so, and its zip
command works` — it runs the printed command and asserts exit 0. **Status: applied.**

### 3. A duplicate `topic` key sent `decompose` to the wrong subject

**Repro**

```
{ "topic": "alpha subject", "topic": "beta subject", "depth": "quick" }
node research-kit/bin/decompose.mjs --dry-run
  would search "beta subject" on http-keyless, keeping up to 8 result(s)
```

Same rule, same silence: the searches `decompose` builds — and pays for — come from the topic,
and the topic is the last duplicate key.

**Root cause.** `resolveTopic` in `lib/decompose.mjs` read `readCorpus(root).plan` and never
looked at the `problems` the corpus reader had already computed for that very file.

**Severity: Medium.** A real run spends its searches on the second topic while the file shows
the first.

**Fix.** `resolveTopic` refuses a plan the corpus reader flagged for a duplicate key, quoting
its own words (`research/plan.json duplicate object key "topic" at byte 35 - …`), and a plan
with one topic still resolves — asserted both ways.
**Tests:** `decompose > a duplicate topic key in plan.json is refused before decompose searches
anything`. **Status: applied.** Suite green.

**One test-side correction.** The first cut of that test called `makeProject('decompose duplicate
topic')` — the first argument is a *directory*, so it created `decompose duplicate topic/` in
the repository root. The working-tree check caught it immediately; the test now uses a temp
directory. The product fix was never wrong.

## What was probed, and held

| Probe | Result |
|---|---|
| The full CI sequence locally, on the fixed tree | selftest 1334/0; preflight PASS (0 blocking, 0 warnings, 29 passing); release-evidence 6/6; all three Node/Python vector pairs agree; `conformance/`+`schemas/` unchanged; timeline (60 events) and export-warc (55 records, 27 captures) regenerate to the committed bytes; tree clean but for the seven intended files |
| The archive-tree leg — the suite from a tree with **no `.git`** | 1334 passed, 0 failed |
| 18 CLIs on a hostile project (BOM plan, torn ledger tail, `kit.json` as an array, a capture that is a directory, a symlink to `/etc/passwd`, half-written tables) | expected exit codes, **zero** stack traces, nothing destroyed |
| JSON purity: does `--json` stdout parse? | yes for `preflight`, `measure`, `evidence-context`, `artifact validate`, `handoff`, `doctor`. Six others exit 2 with empty stdout because they do not define `--json` at all — a refusal, not a defect |
| `new-project` into a folder that already holds `README.md` and `src/` | wrote 13 / kept 0; a second run kept 13 / wrote 0 and left a hand-written `DISCOVERY.md` byte-identical |
| `artifact create` on a corpus with problems (the `problems.json` mapping the suite never exercises) | exit 1; `corpusProblems` and `handoff.findings` render correctly |
| `validateSnapshotEvidence` — never called by the suite | PASS well-formed; SNAPSHOT-HASH / LINK / STALE / DUPLICATE / INVALID / TIME / EVIDENCE-MISSING on each mutation, each named |
| The release-evidence examples are not asleep (4 mutations: payload edited, roster emptied, record deleted, expected-code table flipped) | every one turned it red, 5/6 |
| `--refresh-days` is honoured (capture dated 2026-09-01) | cached at the plan's 30 and at 60; refetched at 0 and at 3 |
| A real end-to-end collection on the keyless transport, against a local HTTP server | capture written with its completeness note, ledger chain verifies, `handoff` OK, `doctor` names only the expected blockers. The blocked-TLS failure path recorded a named `fail` row and exited 0 |
| Environment: `LC_ALL=C`, `init.defaultBranch=trunk`, read-only `HOME`, `GIT_DIR`/`GIT_WORK_TREE` aimed at an unrelated clone | 1334/0 each; the other clone was left untouched |

## Rejected fixes

None of the three was reverted — each kept the suite green on its first full run. Three changes
were considered and **not** made:

- **Matching audit chains by a *similar* topic text.** It would turn a visible fork into an
  invisible merge, and whether a renamed topic is a new research question is the operator's
  call, not a slug function's. The note plus a working command is the smaller change.
- **Extending the duplicate-key guard to the read-only report commands** (`brief`, `measure`,
  `evidence-context`, `export-warc`). They neither spend nor act; the corpus finding names it,
  and `--status` shows it. Guarding them would add refusals without removing a way to lose.
- **Making the Wayback child testable offline.** It needs an injectable endpoint, which is a
  larger change than the risk of that code path; the seam (`lookup`) is tested, the child is not.

## Remaining prioritised risks

1. **The signed-in disclosure surface is real and unfixable here** (ADR-0035): on a public
   repository, anyone with a GitHub account reads every dispatch input in the job log.
2. **Single-site corroboration.** `docs/measurement-2026-09-28.md`: the root corpus closes
   unknowns on one site 90.9% of the time, three decision corpora at 0%. The kit warns; it does
   not refuse.
3. **A vendor response shape change is still a live hazard.** Two parsers are hardened and the
   browser transport's extraction and the keyless adapters carry the same untrusted-input
   assumption; fuzzing has found nothing, but the class does not close by inspection.
4. **A renamed topic still forks the audit chain, by design.** It is now named and the printed
   command works; the operator still chooses which chain is theirs.
5. **`kill -9` cannot be caught**, so a hard-killed run leaks its scratch and leaves its lock
   for a person to judge — correct, documented, and bounded by the machine's tmp reaper.
6. **A tight `RLIMIT_AS` kills the runner before it reports** — a raw stack where a diagnosis
   belongs.
7. **Two of these three fixes were proven on Linux only.** The CLI text and exit codes are
   platform-independent and the topic rule is not OS-specific, but only CI can say so for
   Windows.
8. **Dead exported helpers** (`core.truncate`, `render.bullet`) still have no caller. Harmless,
   and exactly the shape the 2026-09-29 `makeSlug` finding grew out of.

## Hardening recommendations

- **The reading that spends must be the gate's reading.** `parseJson` + `planProblems` cannot
  see a duplicate key, so anything that acts on a hand-edited JSON should pass it through
  `duplicateKey`/`parseJsonNoDuplicates` first. A test that feeds the same hostile plan to every
  spend path — `research`, `decompose`, and whatever is added next — would have found all of
  this pass's first and third defects at once.
- **A printed next step is a claim about a command.** The second defect was found by running the
  command the tool recommended; the new audit test does exactly that, and it is cheap.
- **Keep the failure paths of new features exercised.** The snapshot validator's whole
  reference-checking path had no test; a fifteen-line mutation probe proved it, and a test that
  feeds it one bad reference per phase would keep it proven.

## Summary

Three defects found, three fixed, none rejected, and no test ever left red: the suite is green
at **1334 passed, 0 failed** (from 1331; the three new tests each pin a fix), and the whole CI
sequence passes locally — selftest, preflight, the release-evidence examples, the Node/Python
conformance pairs, the derived-file regeneration and the clean tree.

The pattern worth carrying forward is that the *same* reading asymmetry existed on two spending
paths at once, and neither was visible from the tests the suite already had: every one of them
exercised the gate, and none exercised the command that spends before the gate runs. The build
is otherwise unremarkable in the best sense — 18 adversarial CLI invocations, a hostile corpus,
a folder with no `.git`, a hostile environment and four mutated examples all produced named
answers and no stack traces.

cwd: the repository root. Offline — no key, no credits, no network.
