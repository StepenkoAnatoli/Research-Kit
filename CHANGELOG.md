# Changelog

Each release of Research-Kit, newest first. The version is `KIT_VERSION` in
`research-kit/lib/core.mjs`; a release is tagged `v<version>` (ADR-0116).

## Unreleased

- `install-hooks.mjs` reports, at install time, a repository-local `core.hooksPath` in the
  directory it is run from - what husky, lefthook, simple-git-hooks and pre-commit set, which
  displaces the machine-wide gate in that repository - on stderr with the remedy, and still
  installs (ADR-0131). The installer had read and written only the global path and said
  "installed" from inside such a repository; the displacement was found at check time, by
  `doctor` or preflight, if at all (outside review, 2026-10-02).
- A test that needs a file symlink reports `UNSUP` where the host refuses to make one,
  instead of going red: on Windows a file symlink needs Developer Mode or an elevated shell,
  and five tests made one unguarded, so the collect group read `FAIL ... EPERM` on such a
  machine while the code under test never ran (outside review, 2026-10-02). The harness's
  `requireSymlink` names the privilege as the reason, like a missing Python (ADR-0108); CI's
  Windows runner has it and still runs the tests. The root README now links the reading
  map, `docs/README.md`, from its Documentation section.
- A plan query whose `why` names unknowns that are all CLOSED is not searched again
  (ADR-0127): a search has no cache, so every run of a finished project paid it - found
  running the kit five times over MoonAliza's seven projects, where one query would have
  cost two credits a run forever. The skip is said on the terminal and in the results, the
  dry run previews it, and `--force` runs it as it re-fetches a page.
- The keyless transport's failure quotes the server's own reason beside the status - a
  JSON `message`, an HTML title or the first line of a text body, one line and bounded -
  so a refusal explains itself in the ledger and on the terminal. A github.com page had
  been recorded as `HTTP 403` alone; the body named the refuser (a sandbox proxy, not
  GitHub), and it took a second tool to learn that
  (`docs/decisions/2026-10-02-github-plain-fetch-refusal`, 2026-10-02).
- The secret scan treats a binary as a binary (ADR-0128): a file with a NUL byte in its
  first 8000 bytes is skipped and counted in the coverage line, in `doctor` and in the
  package validator, instead of having credential patterns matched against an executable's
  string table. `doctor` run on a Windows home folder had reported fourteen committed keys,
  every one the PEM marker OpenSSH and libssh2 parse or random bytes spelling `sk-`
  (2026-10-02). A `.pem` is text and stays caught.
- The front page `README.md` is rewritten as a structured guide: how it works, requirements,
  install, the five-minute try, a real project step by step, working with Claude Code,
  Gemini CLI and other agents (with a MoonAliza example), the builder handoff, keys and
  cost, the GitHub collector, a command reference, the machine configuration, and a
  troubleshooting table. The kit reference (`research-kit/README.md`) is unchanged apart
  from the links into it.
- A local run stops when Firecrawl reports its credits exhausted (ADR-0129, superseding the
  default of ADR-0086): the remaining searches and pages are reported `uncollected`, never
  failed, the summary says what is left, and the CLI prints the decision - top up and run
  the same command, or run it with `--fallback` - and exits 2. `--fallback` keeps the old
  switch to browser or http-keyless; the unattended collectors (`collect.yml`,
  `live-collection.yml`) pass it. `--no-fallback` still means the default. One flag added
  under the freeze, by that ADR.
- `QUICKSTART.md`: the two-minute setup through the MCP server - the kit on the agent's
  machine, one Actions token in the agent's own settings file, the Firecrawl key kept in
  the repository's environment - then one prompt, and the four-step loop the agent runs
  (`collect`, `fetch_corpus`, review, a targeted `collect` for what is missing). Linked
  from the front page.
- A capture is written with LF line endings only, whatever the transport received
  (2026-10-02). The scaffold's `.gitattributes` makes git store every capture as LF, so a
  keyless capture written with the CR bytes a server sent hashed one way on the collector
  and checked out another way on every other machine, failing handoff on a capture nobody
  had touched.
- Licensed (ADR-0130): the code, tests and documentation under the PolyForm Shield License
  1.0.0 - install, run, modify and distribute for any purpose except a competing product -
  replacing "all rights reserved", which the README's own install instruction contradicted.
  The captured pages under every `research/raw/` are excluded by `NOTICE`, `REUSE.toml`
  and a `LicenseRef-Captured-Page` marking: copyright stays with their owners, no licence
  is granted over them, and no fair-use claim is made.

## 0.9.3 — 2026-10-02

Nine bug fixes under the freeze (ADR-0117) and one vendor update, all from the third
break-test and from running the kit on its own decision project the same day. Nothing new
is added.

- The Firecrawl adapter reads the first complete JSON value in the CLI's stdout, whatever
  is printed around it - a banner with a bracket before it, a credit receipt after it - and
  `scrape` refuses an exit of 0 that printed nothing, no readable JSON, or a page with no
  text, as a named failure. Each of those had become a "collected" capture holding 0
  characters, with a ledger entry and an evidence row behind which there was no page
  (break-test pass 3, 2026-10-02, with a fake CLI on PATH; the 1.25.0 CLI prints credit
  receipts, so the trailing case is one release away).
- A page whose text exceeds the capture size limit (10 MB) is a failed fetch, named with
  its size and the limit, and nothing is written: the collector had accepted a 40 MB
  answer as a capture, a ledger entry and an evidence row that the corpus reader then
  refused as `capture-too-large`, blocking the gate (break-test pass 3, 2026-10-02).
- A Firecrawl CLI of an unsupported major is refused with its sentence and exit 2: the
  refusal carried the code `CLI_INCOMPATIBLE` but the named-refusal set did not know it,
  so `research.mjs` printed it under a stack trace and an object dump with exit 1, which
  reads as checked and wrong (break-test pass 3, 2026-10-02).
- `doctor` judges the installed Firecrawl CLI the way the run does: an unsupported major
  is a fail with the remedy on a collector that needs it (information on a builder or a
  keyless collector), a newer minor passes and names the tested version. It had printed
  `pass 2.0.0` for a CLI the run then refused before spending (break-test pass 3,
  2026-10-02).
- `citations/quote-too-short` warns under three words AND under 40 characters, across the
  fragments (ADR-0126): two rows of the kit's own decision project quoted a 130-character
  dependency map - one whitespace-separated "word" - and were warned as anchoring almost
  nothing, which was false of a quote that anchors one exact line (2026-10-02).
- A page is a cache hit under any spelling of its URL - `www.`, a trailing slash, a
  fragment, http for https - and a plan that names one page in several spellings fetches it
  once, naming the other spellings as skipped. The cache looked a URL up by its exact
  spelling, and the plan's own URLs were never compared with each other, so such a plan
  paid for the page once per spelling, with a ledger entry and a row each (break-test pass
  3, 2026-10-02).
- `doctor` run from the deployed kit itself says the deploy was not measured (`info`, with
  the command that does measure) instead of `pass ... matches this tree`: a tree compared
  with itself always matches, and a line appended to the deployed `lib/core.mjs` passed that
  way. The drift is measured against the home the install state recorded, which the message
  already named (break-test pass 3, 2026-10-02).
- `--force` on a page that comes back byte-identical records the fetch in the ledger and
  lets the row that cites the reused capture stand, saying so in the reason; it had appended
  a second row that superseded the first, so every unknown citing unchanged content failed
  `evidence-supersession` and had to be re-cited for nothing (break-test pass 3, 2026-10-02).
  A changed page is still a second capture with a row of its own.
- The collector's refresh before every fetch reads only the captures its snapshot does not
  hold and sketches none of them (`readCaptures(root, { known, sketches })`), and a capture
  is remembered once: it had re-read, parsed and MinHash-sketched every capture on disk
  inside the lock on every fetch, and pushed every entry into the index again. Per-capture
  cost at 400 rows: 74 ms before, 13 ms after; a 2000-page run had spent 41% of 585 s
  sketching pages it had already indexed (break-test pass 3, 2026-10-02).
- The tested Firecrawl CLI is 1.25.2 (from 1.24.6): its `--status`, search and scrape output
  were captured from the real CLI and read unchanged by the adapter's parsers before the move
  (`research-kit/test/fixtures/*-1.25.2.*`; `docs/decisions/2026-10-02-firecrawl-cli-1-25`).
  The scrape receipt the 1.25.0 changelog introduced goes to stderr, stdout stays one JSON
  value; search's `data.tools` is now populated and reaches no result. `doctor`, the install
  line and the workflows' install spec name 1.25.2.

## 0.9.2 — 2026-10-02

Two bug fixes under the freeze (ADR-0117), found the same day 0.9.1 was cut: one by
running the kit on MoonAliza, one by the second break-test. Nothing new is added.

- A page whose fetch redirected is a cache hit under the URL the plan asked for. The capture
  index (`readCaptures`, `rememberCapture` in `lib/corpus.mjs`) also answers to the asked-for
  URL, read out of the capture's command line; it had known only the URL the bytes came
  from, so every later run fetched the page again, paid for it, and appended it to the ledger
  and `EVIDENCE.md` a second time as a "first capture". Found running the kit on MoonAliza
  (2026-10-02): two docs.github.com pages, every run.
- `handoff` refuses a corpus whose `research/EVIDENCE.md` is absent or holds no evidence
  table (`handoff-evidence-missing`, `handoff-evidence-unparsed`), with the "did not travel"
  remedy, and its OK line counts the evidence rows beside the ledger entries. With no rows
  there were no citations, so "every cited capture on disk" held vacuously and handoff
  said OK - over an absent table, a binary one, and one whose header a filter had
  rewritten (break-test, 2026-10-02).

## 0.9.1 — 2026-10-02

Bug fixes under the freeze (ADR-0117), from two break-tests, an arena and real use on
MoonAliza; six decisions recorded as ADR-0120 to ADR-0125. Nothing new is added; what the
kit promised is now true on more machines - a host with a template dir or a posture config,
a tree unpacked under another repository, a Chrome that phones home - and its suite says the
same thing on all of them.

- The browser guard survives a CONNECT the browser resets while the guard answers it: the
  socket had no error listener on the dropped and refused paths, and an ECONNRESET killed the
  guard child mid-render ("the browser exited null" on three CI legs, 2026-10-02).
- The browser guard drops every request made before the page asked for has been requested
  (ADR-0125): CI's Chrome stable preconnected to `www.gstatic.com` before the page, a host real
  pages use too, so the service-host list could not settle it; the order can.
- A `RESEARCH_KIT_RESULT_FILE` that cannot be written makes a green `selftest.mjs` run exit 2, where
  it exited 0 and left CI's summary reading "crashed before reporting" beside a green step.
- `selftest.mjs` refuses below the Node floor before any test runs (exit 2, naming the floor), where
  on Node 20 it ran and reported 28 red tests each saying "this kit needs 22 or newer".
- The drafted finding keeps an underscore inside a word: `return_run_details` had been drafted as
  "returnrundetails", a parameter no page carries, and a quote copied from the draft could never
  be found in the capture (found running the kit on MoonAliza, 2026-10-02).
- The browser guard drops Chromium's own service traffic (ADR-0124). Rendering a plain page,
  Chromium 141 made nine connections no page asked for - the component updater's clock, the
  default-search preconnect, `accounts.google.com`, the Cloud Messaging check-in and push
  channel - and the guard carried them as external; on a no-network host the last of them
  became a LIVE test's verdict. A request to one of `BROWSER_SERVICE_HOSTS` is now answered
  403, logged `dropped`, and never judged, carried or counted as a refusal; the page asked for
  is exempt by host and port. Flags and profile preferences were measured first and left most
  of the traffic.
- `selftest.mjs` describes the kit, not the machine (ADR-0123): the run gets a scratch home and
  loses every `RESEARCH_KIT_*` variable but the ones that describe the host or the run, and
  the vendor keys. The tests that spawn kit commands read the operator's machine config, deployed kit and
  Firecrawl login, so a `strict` posture config turned 18 tests red, `role: builder` 7, and a
  Firecrawl CLI installed and not logged in turned two `cli` tests red that a `transport:
  http-keyless` config had been hiding. Those two now run on a PATH without the CLI. Fixture
  repositories are initialised with an empty `init.templateDir`: a host whose global git config
  names a template with hooks (what `pre-commit init-templatedir` writes) turned 9 hook and
  handoff tests red.
- `selftest.mjs` no longer calls a run with zero failures a red suite. When every blocker is a
  test the host could not run (no Chromium, no Python), it ends "No test failed. N tests could
  not run on this host, and an incomplete run is not a pass (ADR-0108) - this is not a red
  suite", names `RESEARCH_KIT_ALLOW_UNSUP=1` for a local run, and still exits 1. "A red suite
  stops work" is the standing protocol's stop-the-line sentence, and an agent that read it
  over "0 failed, 2 unsupported" stopped a whole break-test at its baseline (2026-10-02).
- The collector refuses to spend on a ledger whose chain is broken (ADR-0122). A ledger that
  parsed but whose hashes no longer linked was appended to without a word, so a run paid for
  fetches that `handoff` and `preflight` then refused with the rest of the chain.
  `assertAppendable` now refuses a broken chain (`LEDGER_CHAIN_BROKEN`) beside an unparsed
  line and a torn tail, `runResearch` asks it before the first fetch - dry runs included -
  and `research.mjs` prints it as a sentence with exit 2. The remedy restores the ledger that
  verified; the kit never rewrites a hash (arena break-test #198, F-1-2).
- A posture key that is present and not of its type resolves to its restrictive state
  (ADR-0121): `"failOpen": "false"` is fail-closed, `"evidencePolicy": "STRICT"` is strict,
  `"editGate": {"mode": "HARD-BLOCK"}` is hard-block, as `role` already resolves to
  `unknown`. `doctor` names the key and the state it resolved to (`config-ill-typed`), and the
  hook's sh posture reader agrees: it looked for the bare word `false`, so a quoted `"false"`
  read as fail-open. Absent keys keep their defaults (arena break-test #198, F-2-1).
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
