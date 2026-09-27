# ADR-0059 — The edit gate denies typing into research/raw/

- **Date:** 2026-09-27
- **Status:** accepted
- **Area:** `hooks/edit-gate.mjs`
- **Refines:** ADR-0012 (the edit-time adapter), ADR-0048 (phase-1 work passes the gate)

## Context

The edit gate lets phase-1 work through unjudged: everything under `research/`, plus the
project's scaffolding. On 2026-09-27 that included `research/raw/`, so a Write to a
capture or to `research/raw/.fetches.jsonl` was answered "allow: phase-1 work". AGENTS.md
says evidence is fetched, never typed. Preflight catches a hand-written capture after the
fact, but a ledger line forged with a correct body hash and chain link passes it, so the
edit gate is the only point that can stop the write as it happens.

## Decision

An Edit/Write whose target is inside `research/raw/` is denied, before the phase-1
allowance and whatever the verdict. The reason names `research.mjs` as the only writer
and `research/EVIDENCE.md` as the place for the agent's reading. The two deliberate
off-switches still apply: `editGate.mode=off` and `research/GATE_OFF`.

## Rejected alternatives

- **Ask instead of deny.** Nothing typed into `research/raw/` is ever valid evidence, so a
  prompt would ask the operator to approve something the gate would later reject, or
  worse, would not.
- **Deny only the ledger.** A hand-edited capture breaks its hash and fails preflight
  later. Refusing it at the edit costs nothing and saves the round trip.
- **Honour `hard-block`/`ask` mode for this too.** Those modes describe how to treat code
  while the research is unproven. This rule is about evidence integrity, which does not
  depend on the verdict.

## Consequences

- The collector is unaffected: it writes through Node, not through an agent's Edit tool.
- A shell command can still write the file. The edit gate never covered the shell, and
  preflight's provenance check remains the backstop there.

## Trigger that would reopen this

A legitimate agent-authored file under `research/raw/`, such as an annotation format that
lives beside the captures.
