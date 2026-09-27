# ADR-0048 — The commit gate lets a project's own scaffolding through

- **Date:** 2026-09-27
- **Status:** accepted
- **Area:** commit gate
- **Depends on:** ADR-0020 (the corpus's line endings are integrity), ADR-0024 (the commit gate judges the index)

## Context

While the verdict fails, the commit gate refused any staged path outside `research/`. The
scaffold writes five files outside it: `.gitattributes`, `.gitignore`, `AGENTS.md`,
`START_HERE.md` and `docs/ARCHITECTURE.md`. On 2026-09-27 the first commit after `new-project`
was refused on a fresh collector, and so was the first commit of a builder that unpacked a
remote package: `git add -A` staged these five with the corpus. Committing only `research/`
went through.

So for the whole of phase 1, which is when research is being collected and shared, a project
could not commit:

- **`.gitattributes`.** It keeps the capture hashes valid on a Windows checkout
  (`core.autocrlf=true`, ADR-0020). A corpus pushed without it arrives with every body hash
  failing on such a machine. That is exactly the failure the file exists to prevent, and
  `handoff.mjs` has a whole branch for diagnosing it.
- **`AGENTS.md`.** It carries the rules that bind an agent opening the repository. They
  matter most during phase 1, when that agent might otherwise start building.

None of the five is product.

## Decision

While the verdict fails, the commit gate also lets through:

1. **`.gitattributes`, `.gitignore`, `AGENTS.md` and `START_HERE.md`, at the project root.**
   These are how the corpus travels and the rules and notes for whoever opens it. The rule
   holds for any content: these files are not code, and what they say is not what the gate
   judges.
2. **`docs/ARCHITECTURE.md`, only while it is the scaffold's empty map.** That means its
   staged bytes equal the kit's template, line endings aside. The template carries no token,
   so the comparison is exact. The map describes code, and in phase 1 there is none. A map
   with a design in it is phase-2 work and stays blocked.

Everything else outside `research/` stays blocked. Code staged beside these files blocks the
commit as before. A path with the same name deeper in the tree (`src/AGENTS.md`) is not the
project's own.

## Rejected alternatives

- **Let the whole architecture map through.** A design written into it is the work the gate
  exists to hold back until the unknowns are closed.
- **Record hashes of the scaffold's files under `research/` and let matches through.** That is
  a whitelist the gated party can edit, which makes it a silent override. The gate has
  exactly three overrides and all of them are recorded.
- **Stop scaffolding `docs/ARCHITECTURE.md`.** The architecture-map rule needs it at the first
  code commit, and a builder should find it waiting.
- **Document "commit `research/` first".** Every new project's first `git add -A` would still
  be refused, and `.gitattributes` would still not travel.

## Consequences

- The first commit of a new project, with the scaffold and corpus together, goes through. So
  does a builder's commit of a corpus as received. The real hook was measured on both
  machines, and the tests use a real scaffold in a real repository.
- A kit upgrade that changes the template map means an old project's untouched map no longer
  matches. That project commits its map after the gate passes, as before this ADR.

## Trigger that would reopen this

The scaffold writing a new file outside `research/`. Decide then whether it is scaffolding or
product, and add it here or leave it gated.
