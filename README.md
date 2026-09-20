# Deep-Research-Agent

Deep Research Agent — before build: topics / subtopics / scrape, and the
research-first kit that gates the build on evidence (`research-kit/`).

## Supported platforms

**Linux and Windows are supported. macOS is best-effort and untested.**

"Supported" here means one specific thing, and nothing vaguer: **every commit runs the
full offline suite on that platform in CI.** Linux and Windows both do
([`offline-suite.yml`](.github/workflows/offline-suite.yml)). macOS does not, so a macOS
regression will not be caught before you hit it.

| | Linux | Windows | macOS |
|---|---|---|---|
| full suite runs on every commit | ✅ | ✅ | ❌ |
| platform-specific behaviour asserted | executable hook bit | LF checkout, `.cmd` argument guard | — |
| a regression here is caught by CI | yes | yes | **no** |

This is not a guess about where the code works — it is a statement about where it is
*checked*. The distinction earned itself twice in one day:

- `githooks/pre-commit` shipped as mode `100644`. Git **silently skips** a non-executable
  hook, so the gate reported clean commits while doing nothing. The machine it was
  authored on (Windows) has no executable bit and *could not* have detected it; the first
  Linux run found it in minutes.
- The single macOS run we did was not wasted either. It found a real containment bug —
  `audit --zip` refused to package its own files whenever the project sat under a symlink.
  **That one was never macOS-specific:** a symlinked `~/projects`, or `/home` → `/mnt/home`,
  reproduces it on Linux. It is fixed.

macOS is excluded deliberately rather than accidentally. A CI leg nobody intends to fix
teaches people to ignore red, which costs more than the coverage is worth. If that
changes, add `macos-latest` to the matrix in `offline-suite.yml` — there is a comment
there saying so.

**Requirements:** Node 22+ and Git. Python 3.12+ is needed for the cross-language
conformance runners; without it those tests report `UNSUP` and **block** rather than
silently passing.

## Bring your own keys

**No credentials ship with this repository, and none ever will.** If you cloned this,
the keys are yours to supply.

You can run the whole kit with **no key at all**:

```
node research-kit/bin/research.mjs --transport http-keyless
```

That route has no vendor, no credential and no metering. It is slower and its captures
are often graded `partial`, which the corpus records honestly rather than hiding.

For the metered routes, the kit reads a credential from exactly two places — the
environment, or the machine config at `~/.agents/research-kit.config.json`:

| Provider | Used for | How to supply it |
|---|---|---|
| Firecrawl | fetching pages, and searching by default | `firecrawl login` — the CLI stores it. **Never run `firecrawl env` inside a repository**: it writes the key into `.env`. |
| SerpAPI | searching only, entirely optional | `SERPAPI_API_KEY`, or `serpapiKey` in the machine config |

Both have free tiers, and the kit is designed around them: Firecrawl gives 1,000 credits
a month, SerpAPI 250 searches. Adding the SerpAPI key is worth it not because it is
cheaper but because it is a *second meter* — search stops competing with fetching for the
same budget ([ADR-0027](docs/adr/0027-search-and-fetch-are-two-seams.md)).

**The kit never reads a key from the repository, and never writes one into it.** That is
a checked property, not a promise: `doctor` runs a secret scan over every tracked text
file on each invocation, the tests assert the key never reaches a rendered command, a log
line or an error string, and a query that *contains* your key is refused before it is
sent — because it would otherwise be stored as a search term on the vendor's systems.

**Validating needs no credentials at all.** The release-evidence validators, the
conformance runners in both languages, `preflight` and the whole test suite are offline
and read-only — none of them reads an environment variable, so none can use a key even
by accident. A reviewer can re-run every check without asking you for anything.

One disclosure, since it is your data: a search sends your query text to the provider.
SerpAPI retains search data for 31 days. Tavily was evaluated and **deliberately not
wired in**, because its terms permit it and its AI providers to retain queries and
outputs for training — a reasonable thing to opt into knowingly, and not a reasonable
default ([research/BRIEF.md](research/BRIEF.md)).

## Your first 30 minutes

One path, in order. Nothing here needs a credential — steps 1–4 and 7 are entirely
offline, and only step 6 can spend anything.

**1. Check the machine.** This answers "is anything missing" before you spend time on it.

```bash
node research-kit/bin/doctor.mjs
```

**2. Say what this machine is for.** A *collector* holds a key and gathers evidence; a
*builder* has no key and consumes what a collector pushed. The default is collector.

```bash
node research-kit/bin/install-hooks.mjs --role builder   # only on a build machine
```

**3. See a validator actually work, before you own any data.** Six synthetic packages —
one that passes, five that fail one way each:

```bash
node research-kit/examples/release-evidence/run-example.mjs
```

Read [`examples/release-evidence/README.md`](research-kit/examples/release-evidence/README.md)
next. It is the fastest way to learn what a release package *is*, because the schemas
describe each file's shape and say nothing about how they refer to each other.

**4. Prove the whole thing runs here.** Offline, no key, no network:

```bash
node research-kit/bin/selftest.mjs
```

**5. Scaffold a project.** The project is the **current working directory** — the kit
takes no project argument, so `cd` there first.

```bash
node research-kit/bin/new-project.mjs . --topic "<your topic>"
node research-kit/bin/decompose.mjs --topic "<your topic>"
```

Then open `research/MAP.md` and mark each row `COVERED`, `DISMISSED` or `GAP`. **This step
is yours and is not automated** — deciding what counts as answered is the judgement the
rest of the kit protects.

**6. Collect.** The only step that spends credits:

```bash
node research-kit/bin/research.mjs --dry-run   # see what it would fetch, and the cost
node research-kit/bin/research.mjs
```

**7. Ask whether you may build yet.**

```bash
node research-kit/bin/preflight.mjs
```

`PASS` means the twelve corpus checks agree the evidence supports starting. Anything else
names what blocks and prints one fix.

### Reading a verdict

Every validating command maps its status to an exit code, so scripts can branch on it:

| Status | Exit | Means |
|---|---:|---|
| `PASS` | 0 | checked, and correct |
| `FAIL` / `REOPEN` | 1 | checked, and wrong |
| `INCOMPLETE` | 2 | **could not be checked** — not the same as wrong |
| `BLOCKED` | 3 | refused to start |

The `INCOMPLETE` row is the one that catches people. A record the registry declares but
which is absent produces no verdict *about that record*, so reporting `FAIL` would claim
more than the validator knows.

## When something fails

The failure modes that actually happen, and what each one looks like:

| Symptom | Cause | Fix |
|---|---|---|
| Tests print `UNSUP  PYTHON-NOT-FOUND` and the suite exits non-zero | No Python; the cross-language conformance runners cannot run | Install Python 3.12+. This **blocks by design** — a green suite with no Python would claim Node and Python agree while testing neither |
| `preflight` fails with `ledger-missing` | `research/raw/.fetches.jsonl` did not travel. Zip tools and some sync tools silently drop dotfiles | On the collector: push `research/raw/` **including its dotfiles** |
| Commits succeed but the gate never seems to run | `githooks/pre-commit` is not executable; git skips a non-executable hook silently | `git update-index --chmod=+x research-kit/githooks/pre-commit` |
| The gate blocks with "…is not staged with them" | You changed a declared code path without updating `docs/ARCHITECTURE.md` | Update the map, or `git commit --no-verify` (recorded) |
| `audit --zip` says a file "resolves outside" its own directory | Fixed 2026-09-20. Older checkouts refuse whenever the project sits under a symlink | Update |
| `researcher-release validate` rejects a package you believe is right | The files refer to each other; one link is wrong | `diff` your package against `examples/release-evidence/01-minimal-pass/` |
| A `PASS` did not notice a file you know is broken | `validate` checks what the **registry declares**, not what the directory contains | See package `03` in the examples — it exists to document exactly this |
| Windows: `git add` refuses with a long-path error | `MAX_PATH`; this repo has produced 114-character paths under a 157-character root | `git config core.longpaths true` |

## Run it from inside the project

The kit takes no project argument — the project is the current working directory. `cd`
into the project first, then run the kit from wherever it is installed:

```
cd ~/projects/my-thing
node ~/.agents/research-kit/bin/preflight.mjs
```

From any other directory it reports on the directory it is standing in.

## Two machines, two roles

The kit runs on two boxes, and a machine declares which half it is (`role` in
`~/.agents/research-kit.config.json`, default `collector` — set it with
`node research-kit/bin/install-hooks.mjs --role builder`):

| | **collector** (the operator's PC) | **builder** (a sandbox, a CI box, a second laptop) |
|---|---|---|
| holds | the Firecrawl key | no key, no Firecrawl egress to firecrawl.dev |
| runs | `decompose.mjs`, `research.mjs` — produces the corpus | `handoff.mjs`, `preflight.mjs` — consumes it, then builds |
| `doctor.mjs` | a missing key is a FAIL | a missing key is informational |
| must | push `research/raw/` including its dotfiles, so the builder can receive the corpus | **not collect** — `research.mjs` and `decompose.mjs` refuse (exit 2) |

The corpus crosses the two through git, so the builder's first command is:

```
node research-kit/bin/handoff.mjs
```

It verifies that `research/raw/.fetches.jsonl` (the ledger) is present and non-empty,
that every capture an evidence row names is on disk, and that the chain verifies. It
exits 1 and names whatever is missing. The remedy always lives on the collector: push
`research/raw/` including its dotfiles. See `docs/adr/0010-machine-roles.md` and
`docs/adr/0011-handoff-integrity.md`.

## Cloning or zipping this repository

**One dotfile under `research/raw/` is evidence. The rest are byproducts, and the
difference matters in both directions.**

`research/raw/.fetches.jsonl` is the hash-chained fetch ledger that proves every cached
page in `research/EVIDENCE.md` was actually fetched. It **must travel**. Zip tools, some
sync tools, and certain git filters silently drop dotfiles — and if it is missing, the
repository cannot pass its own gate (`node research-kit/bin/preflight.mjs` fails with
`ledger-missing`). That has happened to this project once already. When copying by hand,
copy `research/raw/.fetches.jsonl`.

Everything else there is **machine-local state and must not travel**:
`.diagnostics.jsonl` (what the gate decided, each time it ran), `.usage.jsonl` (what a
collection spent), `.failures.jsonl` (what a collection failed to fetch), and
`.fetches.lock`. All four are in `.gitignore`.

The reason this paragraph is worded so carefully: `.diagnostics.jsonl` was tracked
anyway, from the first commit of this repository until 2026-09-20 — added in the same
commit as the `.gitignore` rule that excludes it, which `.gitignore` is powerless to undo
once a file is in the index. The gate writes a line to it on **every** invocation, so
every verification left the working tree dirty, and a read-only check that modifies the
repository is a contradiction. A test now asserts that no ignored file is tracked.
