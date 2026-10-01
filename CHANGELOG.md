# Changelog

Each release of Research-Kit, newest first. The version is `KIT_VERSION` in
`research-kit/lib/core.mjs`; a release is tagged `v<version>` (ADR-0116).

## Unreleased

Bug fixes after 0.9.0, under the freeze (ADR-0117).

- `tolerateClosedStdout` answers the callback of every write it drops. The write that
  replaced stdout's after EPIPE returned without calling back, and `exitAfterFlush` waits on
  exactly that callback: `selftest.mjs | head -n 1` finished green, then exited 13 on an
  unsettled top-level await after its result file had recorded 0 (break-test PR #186).
- `runChecks` appends each check's findings one at a time. It used a spread, which passes
  every finding as an argument: a corpus that produced more findings from one check than the
  engine's argument limit (measured between 60,000 and 63,000) made `preflight`, `doctor`,
  `brief` and `audit` print a raw `RangeError: Maximum call stack size exceeded` instead of a
  verdict, and the commit gate answer "internal error" (break-test, 2026-10-01).
- `makeSlug` prefixes a name Windows reserves (`con`, `aux`, `lpt1` …), so the
  "filename-safe slug" it documents is one on every supported platform. No caller passed a
  bare slug to the filesystem, so nothing existing changes (break-test, 2026-10-01).

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
