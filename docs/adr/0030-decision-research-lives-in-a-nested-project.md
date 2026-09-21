# ADR-0030 — Research for a repository-level decision lives in a nested project

- **Date:** 2026-09-21
- **Status:** accepted
- **Area:** research protocol, project layout, provenance
- **Depends on:** ADR-0003 (the corpus has one reader and one writer), ADR-0017 (the project is the cwd)
- **Worked example:** `docs/decisions/2026-09-21-delivery-architecture/`

## Context

On 2026-09-21 this repository needed to decide how the kit should be delivered to a
non-technical operator. That question has its own unknowns — what the dispatch API returns,
how long an artifact survives, what a public run discloses — and none of them belong to the
contract at `research/DISCOVERY.md`, which enumerates U-1..U-8 about transports and vendors.

The kit offers one place to put a corpus. `readCorpus(root)` reads `research/` relative to
one project root (ADR-0003), a project has exactly one discovery contract, and the project
is the current working directory with no override (ADR-0017). Putting architecture
unknowns into the repository's own contract would mean one corpus asserting two unrelated
sets of claims, with `unknown-closure` and `subtopic-coverage` judging them together.

So the research was collected into a temporary directory outside the repository. The
findings were read, the note was written — and the temporary directory was then removed as
routine cleanup, taking nine captures, the hash-chained ledger, and the provenance for
every claim with it. What remained was a recommendation with nothing underneath it, in a
repository whose entire premise is that a claim without provenance is not evidence.

That was not carelessness about an available alternative. **It was the only shape the kit
offered**, and the cleanup that destroyed the evidence was the ordinary treatment of a
temporary directory. A protocol that makes the careful path unavailable will keep producing
this outcome.

## Decision

**Research supporting a repository-level architectural decision lives in a self-contained
project at `docs/decisions/<date>-<decision-name>/`.**

It is an ordinary project in every respect the kit can see: scaffolded by
`bin/new-project.mjs`, holding its own `AGENTS.md`, `START_HERE.md`, `research/DISCOVERY.md`,
`research/MAP.md`, `research/plan.json`, `research/EVIDENCE.md`, `research/BRIEF.md` and
`research/raw/`, and verified by `cd`-ing into it. The kit needs no change to support this,
because the project is the working directory and always was.

Two rules bind it:

1. **The corpus is committed, ledger included.** `research/raw/.fetches.jsonl` travels with
   the decision. The nested `.gitignore` the scaffold writes already negates it explicitly,
   and its patterns are relative to the nested root, so the byproducts (`.usage.jsonl`,
   `.diagnostics.jsonl`, `.failures.jsonl`, `.fetches.lock`) are excluded there without the
   repository's own rules needing to know the path exists.
2. **Temporary scratch projects may be used for experiments, but their findings cannot
   support a committed decision unless the complete evidence corpus and ledger are
   preserved.** A scratch project remains the right tool for testing whether a predicate is
   satisfiable, or what a transport does. It stops being the right tool the moment its
   output is cited.

And one consequence that has already been violated once, so it is stated rather than
implied: **verification runs with the nested directory as the current working directory.**
The repository's own preflight judges the repository's corpus. Quoting it beside a nested
project's claims asserts something it does not say.

## Alternatives considered

**A second repository per decision.** Clean separation, and each decision gets a real
project. It scatters the reasoning away from the thing it reasons about, multiplies
repositories without bound, and makes the evidence for a decision something you have to
know to go looking for. Rejected on cost, not on correctness.

**One contract, several topics.** The most general fix and the most invasive: it changes
the protocol rather than a directory layout. `unknown-closure`, `subtopic-coverage` and the
brief's shape all assume one topic per corpus, and each would need a topic dimension.
Deferred rather than rejected — if decision projects become frequent enough that the
duplication hurts, this is the thing to build. Nothing here forecloses it.

**Leave it as it was, and be more careful.** The failure this ADR responds to was a
`rm -rf` of a directory whose entire purpose was to be temporary. Asking for more care from
the next person, who will also be looking at a temporary directory, is not a fix.

## Consequences

- `docs/decisions/<date>-<name>/` is a recognised location, and a reader who finds a
  `research/` tree there is looking at a decision project rather than a stray copy.
- A decision can be re-verified years later: the captures are in the repository, the chain
  verifies, and every claim in the brief resolves to a page that was actually fetched.
- The repository now contains more than one `research/` tree. Nothing in the kit is
  confused by this — every command resolves relative to its cwd — but a reader might be,
  which is what the nested `AGENTS.md` and `START_HERE.md` are for.
- The nested project's `docs/ARCHITECTURE.md` is scaffolded and has no code to map. It is
  kept and says so, rather than being deleted and reported missing by `doctor` forever.
- The convention is recorded in the repository's own `AGENTS.md` and in
  `research/DISCOVERY.md` under **Already decided**, so an agent meets it before it needs
  it rather than after.

## What this ADR does not claim

That nested projects are the right home for *all* research. They are for research whose
subject is a decision about this repository. Research about what this kit should be able to
do belongs in the repository's own contract, where it has always been.
