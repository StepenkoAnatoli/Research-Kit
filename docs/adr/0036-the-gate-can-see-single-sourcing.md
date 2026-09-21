# ADR-0036 — The gate can see single-sourcing, and says so without blocking

- **Date:** 2026-09-21
- **Status:** accepted
- **Area:** contract checks, evidence policy
- **Depends on:** ADR-0004 (the checks are an ordered registry), ADR-0013 (a check that judged reasoning would be wrong)

## Context

Twelve checks asked whether a claim was **backed**: is there a row, is there a capture,
does the chain verify, is the capture whole, is it fresh, is it primary, has it been
superseded. Not one asked whether it was backed **more than once**.

So a corpus in which every unknown rested on a single page passed `preflight` and
`--strict` with nothing to say about it. That is not hypothetical — it is this
repository's own delivery-architecture corpus, on the day it was used to justify ADR-0031
and ADR-0032. Nine rows, all primary, all `full`, all fresh, and eight unknowns each
resting on exactly one of them. Three of those eight carried architecture decisions.

**From inside such a corpus, a single correct source and a single lucky one are
indistinguishable.** Every other check would report green either way.

## Decision

A thirteenth check, `corroboration`, reporting the **shape** of an unknown's support:

| rule | when | severity |
|---|---|---|
| `single-source` | one row | `warn` |
| `one-voice` | several rows, one host | `warn` |
| `independent` | several rows, several hosts | `pass` |

### It never fails a corpus on its own

Single-sourcing is frequently the right answer. A vendor's own API reference *is* the
authority on that API, and demanding a second opinion about it is ceremony. This check
declines to make that judgement — it describes the support and leaves the call to a
reviewer, which is the same line ADR-0013 drew when it refused to let a check grade
reasoning.

`corroboration` joins `transport-provenance` and `capture-completeness` in `POLICY_CHECKS`,
so `evidencePolicy=strict` is where an operator says they want the harder rule. All three
are questions an *evidence policy* should answer rather than the kit: how it was fetched,
how much arrived, how many times it was read.

Every existing corpus stays green. Verified on all three in this repository — the
repository's own, and both nested decision projects — each still `PASS` under the default
policy, now with warnings that say something true.

### The host distinction is the point, not a refinement

Counting rows would have been easier and would have missed the case that matters. Two
pages from one vendor are **one witness read twice**: that catches a misreading, and
cannot catch a vendor being wrong about itself. The remedies differ — one wants another
page, the other wants another party — so the finding names which it found.

## What it immediately said about work finished an hour earlier

The corroboration pass that preceded this ADR added a second source to the three
delivery-architecture unknowns that carry decisions, and the commit called them
*"independent"*. The check disagrees: all three second sources are `docs.github.com`, so
all three report `one-voice` rather than `independent`.

**The check is right and the commit message was loose.** They are independent *pages* —
different URLs, written by different teams, and they did catch facts the originals omitted,
including that an unpinned API client silently moves to a different version on a date. They
are not independent *sources*. The corpus's own contract already said this in prose —
"a second reading of the same vendor" — and the commit summarising it reached for the
stronger word anyway.

That is the argument for the check in miniature: the distinction is easy to state, easy to
believe you have honoured, and invisible unless something counts hosts.

## Alternatives considered

**Fail on single-sourcing.** Would have broken every corpus in this repository and most
that anyone writes, to enforce a rule that is wrong about half the time.

**Count rows and ignore hosts.** Simpler, and it would have graded the delivery corpus as
corroborated when it is not.

**Require a second source only for unknowns marked load-bearing.** No such marking exists,
and inventing one moves the judgement into the contract without making it checkable.

**Leave it to review.** That is what was happening. Review missed it for as long as the
corpus existed, and the corpus was used to make two architecture decisions in the meantime.

## Consequences

- The registry is thirteen checks; the pinned-order test and the inventory move with it.
- One preflight test asserted "every check reports a **pass**" on the fixture project. That
  fixture is single-sourced, so it now carries one warning. The assertion was changed to
  "every check **reports**", with the expected warning named — rather than padding the
  fixture with a second source to preserve the old wording, which would have been tuning
  the world to fit the assertion.
- The policy-membership test stopped inferring "hygiene is not hardened" from a whole
  verdict passing, and now isolates the claim. That proxy only ever worked while nothing
  else in the policy set fired.

## What this ADR does not claim

That two hosts make a claim true. Two vendors can repeat one another, and a specification
and its own tutorial are not independent whatever their hostnames say. `independent` means
*this check found no reason to flag the support*, which is weaker than correct and is the
strongest thing a mechanical check can honestly report.
