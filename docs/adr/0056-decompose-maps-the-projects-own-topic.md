# ADR-0056 — decompose maps the project's own topic

- **Date:** 2026-09-27
- **Status:** accepted
- **Area:** `bin/decompose.mjs`, `lib/decompose.mjs` (`resolveTopic`)
- **Refines:** ADR-0017 (the project is the working directory)

## Context

`new-project --topic` writes the topic into `research/plan.json` and the contract's title.
`decompose` then asked for `--topic` again and took whatever it was given. On 2026-09-27
`decompose --topic x`, run in a project scaffolded for Postgres replication slots,
rewrote the map's topic to "x" without a word. The brief takes its title from the map,
so it came out as "Brief - x", even after a forced redraft. `new-project` already refuses
this when it keeps an existing project's files: "a different topic is a different
project".

## Decision

The project's topic is `research/plan.json`'s `topic`.

- With no `--topic`, `decompose` maps that topic.
- A `--topic` that differs from it is refused with exit 2. The message names both topics
  and says that a different topic belongs in its own project. Spacing and case do not
  count as a difference.
- While the project is still called "Untitled topic" (`UNTITLED_TOPIC`, the scaffold's
  placeholder), any `--topic` is accepted, and omitting it is refused because there is
  nothing to fall back on.

## Rejected alternatives

- **Warn and continue.** The warning scrolls past, the map is rewritten, and the brief
  still carries the wrong title. A mismatch is cheap to fix and expensive to miss.
- **Write the new topic into `plan.json` as well.** The contract's title, its unknowns and
  the evidence were all written for the old topic. Renaming one file does not make the
  project about the new topic.
- **Let `--force` override the mismatch.** `--force` already means "redraft over a map with
  judged rows". Giving it a second meaning would make one flag grant two unrelated
  permissions.

## Consequences

- `collect.yml` scaffolds with the dispatched topic and then passes the same topic to
  `decompose`, so it is unaffected.
- The instruction `decompose.mjs --topic "<what is being researched>"` in AGENTS.md still
  works when the topic matches. A paraphrase is refused with a message that says to
  omit `--topic`.

## Trigger that would reopen this

A project that legitimately maps several topics, which would need the map to carry more
than one topic heading.
