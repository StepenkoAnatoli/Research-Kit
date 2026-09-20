# Deep-Research-Agent

Deep Research Agent — before build: topics / subtopics / scrape, and the
research-first kit that gates the build on evidence (`research-kit/`).

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
