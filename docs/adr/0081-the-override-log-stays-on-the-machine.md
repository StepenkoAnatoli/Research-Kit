# ADR-0081 — The gate's override log stays on the machine that took the override

- **Date:** 2026-09-28
- **Status:** accepted
- **Area:** `research/overrides.log`, the `.gitignore` files (root, template, nested projects)

## Context

Every use of a gate override (`--no-verify`, `research/GATE_OFF`, a repository-local
`core.hooksPath`) is appended to `research/overrides.log`, and `doctor` reports the counts.
The repository contradicted itself about whether that file belongs in git:

- the root `.gitignore`, the project template's `.gitignore` and every nested decision
  project's copy **un-ignored** it (`!research/overrides.log`), so it would travel;
- `test/repo-hygiene.test.mjs` lists it with the machine-local byproducts that must never
  be tracked, and `lib/artifact-validator.mjs` refuses a package that carries it.

No project had committed one, so nothing was red. The end-to-end run of 2026-09-28 found
it: the corrected corpus command (`git add research/`) would have committed the log
wherever one existed.

## Decision

The log is local. It is ignored in all three `.gitignore` places, AGENTS.md says it is
never committed, and the handoff test runs the printed corpus command with a log present
and asserts it is not tracked.

## Rejected alternative

- **Let it travel as an audit trail**, so a builder sees that the collector bypassed the
  gate. The person who took the override decides whether the log is committed, so its
  absence proves nothing. Logs from two machines would also conflict on every merge.
  What travels as proof is the hash-chained ledger, which records every fetch.

## Consequences

- A builder cannot see the collector's overrides. The commit report protocol (AGENTS.md)
  already requires anyone who takes an override to say so.
- `doctor` on each machine reports only that machine's overrides.

## Trigger that would reopen this

A need to review overrides across machines that does not depend on the overriding party
committing the evidence against themselves.
