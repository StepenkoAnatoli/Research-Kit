# Changelog

Each release of Research-Kit, newest first. The version is `KIT_VERSION` in
`research-kit/lib/core.mjs`; a release is tagged `v<version>` (ADR-0116).

## Unreleased

Bug fixes after 0.9.0, under the freeze (ADR-0117).

- `editGate.settingsPath` is taken from the machine config only when it is a non-empty string;
  anything else falls back to the runtime anchor, as every other wrong-typed key does. It was
  the one key `shape()` still passed through raw, and `{"editGate":{"settingsPath":42}}` in a
  hand-edited config reached `path.dirname` and killed `install-hooks` - the command whose job
  is to bind the gates - with a raw `ERR_INVALID_ARG_TYPE` stack (arena break-test #198,
  2026-10-02, redone on main; the sibling of the `skillRoots` check).
- `install-hooks --dry-run` reports the refusal the real run would give. On a machine where
  the kit was not deployed it printed "would set core.hooksPath=..." and "would register in
  .../settings.json: ..." and exited 0, while the real run refused both gates and exited 1:
  `installCommitGate` answered the dry run before its deployed-hook check, and
  `installEditGate` exempted the dry run from its own. Both previews now carry `ok: true`,
  and the CLI tests `ok` before `dryRun`, so a refusal prints as a refusal with the real
  run's exit code. The sibling of the 2026-09-29 `install --dry-run` prune fix, never swept
  to (arena break-test #196, 2026-10-01, redone on main).
- `research.mjs` names the refusals the kit wrote instead of re-throwing them. A torn ledger
  tail - what an interrupted collection leaves behind - printed its own remedy under a source
  line, a caret, six frames and Node's version footer, and a damaged chain dumped its internal
  `problems` array as an object literal; both exited 1, which this kit reserves for FAIL,
  checked and wrong. `NAMED_RUN_REFUSALS` in `core.mjs` is the four codes (LEDGER_DAMAGED,
  LEDGER_TORN_TAIL, LOCK_HELD, LOCK_STUCK), answered with their message and exit 2, as
  `prior.mjs` and `doctor --fix-arity` already answered them (break-test 2026-10-01, PR #193,
  redone on main).
- A lock the kit judges stale and cannot remove is a named refusal (`LOCK_STUCK`), not a
  livelock. The failed removal fell through to `continue`, which skipped both the deadline and
  the sleep, so a read-only `research/raw` holding a dead pid's lock - or a `.fetches.lock`
  that is a directory - spun at 100% of a core forever, printing nothing and unreachable even by
  `--report-on-signal`, because a synchronous loop never returns to the event loop. The held
  case is coded `LOCK_HELD` too (break-test 2026-10-01, PR #193, redone on main).
- `skillRoots` is checked as a list of paths, not only as an array. A number or a null left in
  a hand-edited machine config reached `path.join` and killed `doctor` with a raw
  `ERR_INVALID_ARG_TYPE` stack - the one command whose job is to name every problem and print
  its fix. An entry that is not a path is dropped, and with nothing left the documented defaults
  are in charge (break-test 2026-10-01, PR #193, redone on main).
- `fetchFailure` cuts a URL to its host in the failure's own message, not only in its cause.
  Node throws some refusals with no cause and the whole URL in the message - a URL carrying
  credentials, one that will not parse - so a signed URL in a plan was printed to the terminal
  and written into `research/raw/.fetches.jsonl` as that entry's error: the file that must
  travel, in the one directory `doctor`'s secret scan excludes (break-test 2026-10-01, PR #193,
  redone on main).
- A quote anchor no longer misses a passage over a character nobody can see. Unicode's format
  characters - the zero-width space a docs site puts inside a heading's anchor link, a soft
  hyphen from a PDF extractor, a word joiner - survive NFKC and `\s`, so
  `[quote: ## Bundled skills]` was quote-not-found against the heading that displays it, in a
  capture this repository holds. `normalizeForMatch` drops `\p{Cf}` on both sides, which can
  only shorten what is searched for, so an invented passage stays invented (break-test
  2026-10-01, PR #193, redone on main).
- The extractor's `comparison-row` rule is three linear scans, not one backtracking regex.
  `\b(plan|tier)\b.*\b(month|year|user)\b.*\d` was quadratic in a table row's length, and a
  row's length is the captured page's own doing: a 309 KB row, the size of a line this
  repository's corpus already holds, took 15 s in `firstFinding`, which the collector runs over
  every page. The same row now costs milliseconds, and the rewrite is pinned against the old
  pattern over 4,000 generated rows (break-test 2026-10-01, PR #193, redone on main).
- In the kit's own checkout a commit staging anything under `research-kit/` is allowed
  only when the suite is green (ADR-0120, which lifts the freeze for this one check). The
  commit gate runs `bin/selftest.mjs` and reads its result file: an unsupported test is
  not red, a runner that produced no result is a block, and a docs-only commit owes
  nothing. The gate says the suite is about to run, strips git's hook environment from it,
  and stops it after 20 minutes; the hook widens its watchdog to 1500 s there. Found by committing twice on a
  red suite in one afternoon, both times from a chain that misread the exit code.
- The render timeout starts at the browser's first request through the guard, and the
  launch is allowed as long again (ADR-0119). On the CI runners Chromium's process startup
  took 4 to 43 s before any request, out of the render budget, so the page was killed
  before it had been asked for. A timeout now says what the launch cost.
- The guard records every request it carried and reports the ones still unanswered when
  the render ends. A page Chromium printed before every load was answered, or at its
  deadline, is graded partial and names those loads, or says every request had been
  answered and the wait was inside the browser; a refusal's message carries the same note.
- Chromium is given its own deadline (`--timeout`), ten seconds under the transport's kill
  timeout. With the virtual-time budget alone, one resource that never answered froze the
  budget, so headless never dumped and was killed with nothing to show: the intermittent
  "did not finish rendering" on CI, reproduced with a page whose image never arrives. At
  the deadline Chromium dumps the DOM it has, so such a page is captured as it stands.
- The browser transport judges a timeout by what Chromium printed, not by its exit: a whole
  DOM dump after the render timeout is the render, a dump holding the guard's refusal is
  the refusal, and a timeout with no dump names the last thing Chromium said on stderr.
  Found on CI, where the suite's first Chromium launch ran its 45 s out three times in one
  afternoon with the dump and the cause thrown away.
- `makeSlug` never returns a name Windows reserves (`con`, `aux`, `lpt1`, ...): such a
  result is prefixed `name-` inside the slug alphabet, on the fallback path and after a cut
  too. Latent: no caller hands a bare slug to the filesystem (break-test PR #188).
- `runChecks` appends findings one at a time. The spread passed every finding as an
  argument, and a corpus of about 66,000 evidence rows pushed one check past the engine's
  limit: preflight, doctor, brief and audit died with a raw RangeError instead of a verdict,
  and the commit gate answered internal error (break-test PR #188).
- `tolerateClosedStdout` answers the callback of every write it drops. The write that
  replaced stdout's after EPIPE returned without calling back, and `exitAfterFlush` waits on
  exactly that callback: `selftest.mjs | head -n 1` finished green, then exited 13 on an
  unsettled top-level await after its result file had recorded 0 (break-test PR #186).

## 0.9.0 — 2026-10-01

The first tagged release. Research-Kit is feature-frozen from here: changes are bug fixes,
until a new ADR lifts the freeze for a named item (ADR-0117).

**What it is.** A zero-dependency Node toolkit that makes research a blocking phase before
an agent builds anything:
- unknowns are named in a contract (`research/DISCOVERY.md`);
- primary pages are fetched into a hash-chained, append-only ledger;
- claims are tied to quotes the gate finds in the captured pages;
- a commit gate refuses product code until preflight passes;
- the result is handed to the builder as `research/BRIEF.md`.

**Collection.** Firecrawl (metered), a keyless HTTP transport, and a local-Chromium browser
transport, with SerpAPI, SearXNG and DuckDuckGo-lite for search. Remote collection runs on
GitHub Actions (`collect-remote`, with `--run-id` to pick a run up again).

**Hardening in this release.** Dozens of break-test rounds. The latest:
- the commit hook judges a commit even when `git diff` fails;
- every hook git knows hands on to what git would have run without the kit (ADR-0112,
  ADR-0113);
- `install` refuses to mirror into a folder that is not a kit (ADR-0111);
- the keyless fetch judges the address it connects to, closing DNS rebinding (ADR-0114);
- the browser transport renders through a guard proxy the kit runs, so every request Chromium
  makes - redirects, script navigation, meta refreshes, images, frames - is judged before it is
  sent (ADR-0118);
- writes retry a rename Windows holds for a moment.

**Found by a cold end-to-end trial.** A fresh agent with only the docs took a real question to
PASS and a brief. On the way:
- a Firecrawl CLI with no key now fetches while the keyless route searches for it, because
  Firecrawl stopped answering keyless searches;
- quotation marks around a `[quote: ...]` passage no longer make it fail;
- the walkthrough gained the step where findings are rewritten.

**Found by break-test PR #185, redone here.**
- identifiers - slugs, file names, ids, dates - sort by code unit on every machine; they
  sorted by the machine's locale, and two machines listed one corpus in two orders;
- the edit gate answers a terminal stdin at once instead of waiting for input forever.

**Supported.** Linux and Windows, Node 22, 24 and 26, all tested on every commit. macOS is
best-effort with no CI leg (ADR-0101).

**Known limits.**
- The gate proves evidence was fetched and quoted, not that it was read correctly: the
  review is the agent's own declaration (ADR-0107).
- The edit-time gate is a Claude Code hook; other agents meet only the commit gate.

**License.** All rights reserved (`LICENSE`).
