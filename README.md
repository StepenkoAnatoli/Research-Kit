# Deep-Research-Agent

**Research first, build second.** This is a research kit that collects evidence from real
sources, keeps a tamper-evident record of where every claim came from, and then *refuses to
let a build start* until a person has reviewed it.

It is for the case where an AI would otherwise guess: API limits, pricing, what a licence
actually permits, whether a platform can do the thing you are planning around.

---

## Start here if this is new to you

Five steps. You need a GitHub account and this repository. You do **not** need to install
anything for steps 1-4.

> **Two ways in, and this is the easier one.** These steps run everything on GitHub, from
> the website. If you would rather install the kit and run it on your own machine, skip to
> [Your first 30 minutes](#your-first-30-minutes) instead - same kit, same gate, more
> control and more setup.

### 1. Get a Firecrawl key

Sign up at [firecrawl.dev](https://www.firecrawl.dev) and copy your API key from the
dashboard. The free tier is 1,000 credits a month, no card, and it stops at zero rather
than billing you.

### 2. Put the key where only the collector can read it

In **your** repository on GitHub:

> **Settings** → **Environments** → **New environment** → name it `research-collection`
>
> → **Add secret**: name `FIRECRAWL_API_KEY`, value = your key
> → **Add variable**: name `RESEARCH_KIT_COLLECTION_ENV`, value `research-collection`

Both are needed. The *variable* is how the collector checks the environment really exists —
GitHub silently creates an unprotected environment if a workflow names a missing one, and
that would leave your key somewhere it should not be.

⚠️ **Do not put the key in Settings → Secrets and variables → Actions.** That makes it
readable by *every* workflow in the repository, including one added in a pull request. The
collector has a check that refuses to run if it finds it there.

### 3. Run a collection from the website

> **Actions** tab → **collect** in the left sidebar → **Run workflow**

Type your topic, leave the rest alone for a first run, press the green button. Start small:
`max_pages: 1` and `depth: probe` costs about 3 credits.

When it finishes, scroll to **Artifacts** at the bottom of the run and download the ZIP.

### 4. Read what came back

Open the ZIP and read **`README-FIRST.md`**. It will say:

> **COLLECTED CORPUS — HUMAN REVIEW REQUIRED**

**That is the correct result, not a problem.** The collector gathers evidence; it does not
decide whether the research is any good. Three steps are yours, and no tool does them:

1. Classify every row in `project/research/MAP.md`
2. Rewrite every Finding in `project/research/EVIDENCE.md` into a claim you would defend
3. Run preflight, then write and review the brief

Until those are done, `manifest.json` says `"buildAuthorized": false` — meaning **do not
start building from this yet**, and any AI reading it should refuse to as well.

### 5. Check the package is intact (optional)

```bash
node research-kit/bin/artifact.mjs validate --file research-kit-corpus-v1-<something>.zip
```

`PASS` means the package is undamaged and its evidence chain verifies. It does **not** mean
you may build — that is the separate `buildAuthorized` line, and the two are kept apart on
purpose.

---

## Letting an AI agent run the collector

An agent can do steps 3–5 for you. It needs a token, and that token should be able to do
**one thing only**.

### Where to get the token

> **[github.com/settings/personal-access-tokens/new](https://github.com/settings/personal-access-tokens/new)**
>
> (or: your avatar → **Settings** → **Developer settings** → **Personal access tokens** →
> **Fine-grained tokens** → **Generate new token**)

| Field | Value |
|---|---|
| Token name | something recognisable, e.g. `research-collector-agent` |
| Expiration | 30 days. Short is good — you can always make another |
| Repository access | **Only select repositories** → pick this one |
| Permissions → Repository → **Actions** | **Read and write** |
| Everything else | leave alone |

**`Actions: Read and write` is the only permission it needs.** With just that, the agent can
start a collection and read the result. It **cannot** read or change your code, read your
secrets, change settings, or reach any other repository. If it misbehaves, revoke the token
— one click, and nothing else breaks.

Copy the token when it is shown. GitHub will not show it again.

### Give it to the agent

Set it in the environment. **Never on a command line** — that ends up in your shell
history, in the process list, and in any log that echoes the command. There is no
`--token` flag, deliberately.

```bash
export RESEARCH_KIT_GITHUB_TOKEN=github_pat_...

node research-kit/bin/collect-remote.mjs \
  --repository OWNER/REPO \
  --topic "What are the rate limits on the Stripe API" \
  --max-pages 5 --json
```

Windows PowerShell:

```powershell
$env:RESEARCH_KIT_GITHUB_TOKEN = "github_pat_..."
node research-kit/bin/collect-remote.mjs --repository OWNER/REPO --topic "..." --json
```

One command: it dispatches the run, prints the run id immediately, waits, downloads the
artifact, unwraps it, and validates it.

| Exit | Meaning |
|---|---|
| 0 | collected and valid — **still does not authorize building** |
| 1 | the package is invalid |
| 2 | the run failed, or the package is incomplete |
| 3 | could not start: no token, bad repository, or no permission |
| 4 | dispatched and still running when the wait ran out; the run id is on stdout |

### Or register it as an MCP tool

If your agent speaks the Model Context Protocol, it can have the collector as a tool
instead of a command:

```json
{
  "mcpServers": {
    "research-kit": {
      "command": "node",
      "args": ["<path>/research-kit/bin/mcp-server.mjs"],
      "env": { "RESEARCH_KIT_GITHUB_TOKEN": "github_pat_..." }
    }
  }
}
```

Two tools: `collect` starts a run and returns its id; `fetch_corpus` takes that id and
returns a link to the validated package. The server speaks **both** protocol eras -
`2026-07-28` and `2025-11-25` - because the specification is ahead of every shipped client
and a server only the spec can talk to is one nothing can call. The same token, the same one permission, and the
same rule at the end - the result carries `buildAuthorized`, and it is `false` for every
freshly collected corpus.

Why it is a local server and not a hosted one, and why it hands back a link rather than the
file: [ADR-0034](docs/adr/0034-the-collector-speaks-mcp-over-stdio.md), which was written
from research that passed the gate first.

### What the agent must not do

Read `buildAuthorized` and stop if it is `false`. **It will be `false` for everything this
command returns**, because a freshly collected corpus has not been reviewed by anyone. An
agent treating exit 0 as permission to build has skipped the only part that needed a person.

---

## Reference

- [`research-kit/README.md`](research-kit/README.md) — every command, the artifact format, the transports
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — what each module owns
- [`docs/adr/`](docs/adr/README.md) — why things are the way they are

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

**The local path**, for running the kit on your own machine rather than on GitHub. If you
just want research back and do not care where it runs,
[Start here](#start-here-if-this-is-new-to-you) is shorter.

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
