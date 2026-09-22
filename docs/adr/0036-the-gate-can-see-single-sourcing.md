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

## Amendment, 2026-09-21 — this ADR made `strict` unsatisfiable, and only checked the default

The Consequences below verified that "every existing corpus stays green … under the default
policy". That was true, and it was the wrong half to check. Adding `corroboration` to
`POLICY_CHECKS` changes what **`strict`** means, and nothing measured what it now costs.

Measured on `main` after this ADR landed:

| corpus | default | `--strict` |
|---|---|---|
| repository root | PASS, 7 warnings | **FAIL, 7 blocking** |
| `2026-09-21-delivery-architecture` | PASS, 8 warnings | **FAIL, 8 blocking** |
| `2026-09-21-agent-interface` | PASS, 5 warnings | **FAIL, 5 blocking** |
| `2026-09-21-public-run-visibility` | PASS, 4 warnings | **FAIL, 4 blocking** |
| `2026-09-21-sea-assets` | PASS, 2 warnings | **FAIL, 2 blocking** |

And every one of the root corpus's seven warnings is a `corroboration` finding, so
`evidencePolicy=strict` fails it identically — confirmed by running it with a config, not
inferred: `FAIL 7 blocking, 0 warning(s), 18 passing [evidencePolicy=strict]`.

**So the harder policy this ADR pointed operators at is one no corpus in this repository
satisfies.** The delivery corpus passed `--strict` before this change; it does not now.

**This is recorded, not fixed, and the distinction is deliberate.** The check is right on
every one of those findings — the corpora genuinely are single-sourced, and §"What it
immediately said about work finished an hour earlier" is the same admission at smaller scale.
Making `strict` passable would mean either collecting second sources for thirty-odd unknowns,
or softening a check that is telling the truth. Neither is a decision to take inside an
amendment about measurement.

What an operator needs to know now: **`strict` is aspirational in this repository, not a
standard it meets.** Anyone turning it on should expect red, and should read the findings as a
worklist rather than as a regression.

**Fixed 2026-09-21.** The verdict now names the setting that decided it - a `--strict` run prints `[--strict, over evidencePolicy=pluralist]`, keeping the declared policy visible under the flag that overrode it. The paragraph below is what it used to do.

Two settings are also easy to conflate, and the verdict line encourages it: `--strict`
promotes **every** warning, while `evidencePolicy=strict` promotes only the three
`POLICY_CHECKS`. The summary prints the project's *declared* policy regardless, so a
`--strict` run reads `FAIL … [evidencePolicy=pluralist]` — which looks like pluralist failed
it. It did not; the flag did.

## Amendment, 2026-09-21 — a mirror is the case where `independent` is actively worse

The closing section below says `independent` means only "this check found no reason to flag
the support". Hours later a collection found a concrete failure mode sharper than that hedge,
and it deserves naming rather than being covered by a general disclaimer.

Collecting on Node's single-executable API returned `nodejs.org` **and**
`lira.epac.to/DOCS/nodejs/api/single-executable-applications.html`. Two hosts. Cite both for
one unknown and this check reports `independent` — its best grade.

They are **the same document**, and the mirror is six major versions stale: v20.19.2 against
the v26.9.0 nodejs.org serves. It predates the entire section that the current page's only
`Stability: 1.0` marker sits under. A reader corroborating against it would have their
reading of an *older* edition confirmed by an *older* edition, and the gate would call it
independent support.

**So the host heuristic does not merely fail to notice a mirror — it inverts on one.** A
mirror scores better than the honest `one-voice` that two genuine pages from one vendor get,
while carrying strictly less information than either. The failure is not that two hosts can
be one witness; ADR-0036 already said that. It is that two hosts can be one witness *plus a
staleness the freshness check cannot see*, because `freshness` grades when the page was
**fetched** and this one was fetched today.

> **Superseded the same day — the "no code changes" conclusion below was wrong, and is
> now implemented as `lib/similarity.mjs`. See the amendment that follows.**

**No code changes.** Detecting mirrors means comparing document content or parsing version
strings out of vendor pages, and a check that guessed at either would be the reasoning-grader
ADR-0013 refused. What changes is what a reviewer is told to do: **`independent` is a prompt
to check that the sources are different documents, not a certificate that they are.**

Recorded live rather than reasoned about: the corpus that found it
(`docs/decisions/2026-09-21-sea-assets/`) keeps the mirror as an uncited row and accepts two
`single-source` warnings instead — the correct trade, and the one the check's grades
currently push against.

## Amendment, 2026-09-21 — the mirror IS detectable, and "grading meaning" was a dodge

The amendment above concluded that a mirror could only be caught by "comparing document
content … which would be the reasoning-grader ADR-0013 refused". **The first half named the
solution and the second half talked itself out of it.**

Comparing document content is not grading meaning. It asks whether two byte streams are
substantially the same text, which is arithmetic. It judges nothing, cannot tell a correct
page from a wrong one, and does not try — `lib/similarity.mjs` says so at the top. ADR-0013
refuses checks that grade *how an agent reasoned*; it does not refuse checks that measure.
Reaching for it here was an argument for doing nothing.

### What was built

`corroboration` no longer counts hosts. It groups an unknown's rows into distinct
**documents** first, then counts hosts among those:

| rule | when | severity |
|---|---|---|
| `single-source` | one row | `warn` |
| `one-voice` | several rows, one host after grouping | `warn` |
| `mirror` | several hosts, but all one document | `warn` |
| `independent` | several distinct documents, several hosts | `pass` |

A three-row unknown where two rows mirror each other still counts the third, and the
`independent` detail now states how many rows were folded — so three rows buying two
witnesses is visible rather than absorbed.

### The threshold is measured, not chosen

Every capture pair in this repository was compared — 47 captures, 1081 pairs:

| | Jaccard |
|---|---|
| the known stale mirror (`nodejs.org` × `lira.epac.to`, six majors apart) | **0.3879** |
| highest-scoring genuinely *different* cross-host pair | **0.0275** |
| median cross-host pair | 0.0000 |

A fourteen-fold gap. `MIRROR_THRESHOLD = 0.25` sits ~9× above the strongest false-positive
candidate and below the hardest true positive — and the *stale* mirror is the hard case,
because a current one scores ~0.99. The 128-hash sketch tracks exact Jaccard to within
0.048 across all 1081 pairs, verified rather than assumed.

### Two properties that matter more than the threshold

**`null` never means "different".** A document below `MIN_SHINGLES` is unjudgeable, and two
unjudgeable rows stay two documents rather than merging into an invented mirror. The
conservative direction for a check that can only ever *reduce* apparent corroboration.

**Hashing is seeded FNV-1a, not `Math.random`.** A fingerprint that decides a gate finding
has to grade the same corpus identically on every machine, or a corpus passes on one
developer's laptop and fails in CI for reasons nobody can reproduce.

### What it changed in this repository

Nothing, and that is the finding. All five corpora report identical verdicts — no existing
citation was secretly a mirror. The check was built for a hole found by collection, not for
a defect already in the corpus, and it now stands in front of the corroboration sweep that
will add ~30 second sources, where a mirror slipping in as `independent` is a live risk
rather than a hypothetical one.

One existing assertion moved: `corroboration: two hosts is independent support` matched
`2 rows across 2 hosts` and now matches `2 distinct documents across 2 hosts`. Its two rows
name a capture the fixture does not have, so neither has a sketch — which makes it the
regression test for the `null` rule as well.

## The check met a hard case on purpose, 2026-09-22

The D-11 collection deliberately fetched a page **and its own source file** —
`modelcontextprotocol.io/community/governance` and
`github.com/modelcontextprotocol/modelcontextprotocol/blob/main/GOVERNANCE.md` — expecting a
`mirror` finding, because a rendered docs page and the markdown behind it is the textbook
case.

**It scored 0.156 and was graded as two distinct documents, and that grade is correct.**
Checked rather than assumed: the `.io` page is 11 KB and says "Core Maintainer" twenty-four
times; `GOVERNANCE.md` is 4.7 KB, says it once, and carries the one fact the website does not
— that the project is a Series of LF Projects, LLC whose approval governance changes require.
They cover the same subject and are not the same document. The stub is a real second source.

Worth recording anyway: **0.156 is much closer to the 0.25 line than any genuine pair in the
original measurement**, where the highest scoring truly-different cross-host pair was 0.0275.
A page and a *fuller* rendering of the same text would sit somewhere above this, and chrome
dilution pushes such pairs down. The threshold was chosen from a 14× gap; this case narrows
the observed gap to about 1.6×. That is not a failure and it is not a reason to move the line
on one data point — it is the note that the line is now known to have traffic near it.

## What this ADR does not claim

That two hosts make a claim true. Two vendors can repeat one another, and a specification
and its own tutorial are not independent whatever their hostnames say. `independent` means
*this check found no reason to flag the support*, which is weaker than correct and is the
strongest thing a mechanical check can honestly report.
