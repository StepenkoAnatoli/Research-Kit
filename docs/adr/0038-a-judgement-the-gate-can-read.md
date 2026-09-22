# ADR-0038 — A judgement the gate can read, and the reason it must be written down

- **Date:** 2026-09-22
- **Status:** accepted
- **Area:** contract checks, evidence policy
- **Depends on:** ADR-0013 (a check that judged reasoning would be wrong), ADR-0036 (the gate can see single-sourcing), ADR-0037 (an empty capture is not mechanically detectable)

## Context

Two checks ended up reporting things that were **true, correct, and permanent**.

`corroboration` says an unknown rests on one witness. `capture-completeness/partial-render`
says a page printed its own load-failure notice. Both were right every time they fired. And
neither could ever be satisfied, because:

- Nobody but Firecrawl can testify to Firecrawl's pricing. Nobody but GitHub can describe
  GitHub's permission model. Nobody but the Node.js project can state the stability of a
  Node.js API. Three of this repository's five corpora contained such claims.
- A page that prints "There was an error while loading" keeps printing it. Three of the four
  captures that do were read, checked and cited successfully.

So `evidencePolicy=strict` was **unsatisfiable by any honest corpus**, and eight warnings
stood as permanent furniture. ADR-0036's amendment recorded that as a limitation and left it.

**The deeper problem is that the corpus had no way to tell "considered and correct" apart
from "nobody looked".** They rendered identically, forever. This repository had already
proved that distinction matters the hard way: the sea-assets brief argued at length that its
single-sourcing was principled, and a second look found primary evidence on another host that
had been there the whole time.

## Decision

**A reviewer may overrule either finding, in writing, in the corpus, with a reason the check
requires but does not grade.**

This is not a new idea here — it is the shape the format already uses twice:

| existing | overrule | required with it |
|---|---|---|
| `MAP.md` subtopic | `DISMISSED` | a reason ("dismissing is fine, omitting is not") |
| capture grade | `completeness: partial` | `omitted:` — what was left out |
| **unknown support** | **`[single-witness: …]`** | **why no second witness can exist** |
| **render-failure notice** | **`[render-reviewed: …]`** | **what was checked and found present** |

Both markers live in corpus prose: `[single-witness: …]` in the unknown's Evidence cell,
`[render-reviewed: …]` in the Finding cell of the row that cites the capture.

### Three properties that keep this from being a mute button

**A reason is required, and a thin one is named rather than obeyed.** Below 30 characters the
finding becomes `single-witness-unreasoned` and still warns. `[single-witness: n/a]` does not
silence anything. The check never grades whether the reason is *good* — ADR-0013 — but it
insists one exists and prints it in the finding, so the judgement is auditable instead of
invisible.

**A stale acknowledgement is reported.** If an unknown carrying `[single-witness: …]` later
acquires a second independent document, the note now claims something false, and
`single-witness-stale` says so. Without this the mechanism would rot exactly the way this
repository keeps catching its own prose rotting: true when written, wrong a day later,
nothing watching.

**The render note lives on the evidence row, never in the capture.** This was discovered by
building it wrong. `verifyLedger` hashes the **whole capture file**, front-matter included —
annotating a capture breaks `body-unmodified` and fails the chain. That refusal is correct
and was left in place: **a capture is evidence and stays byte-immutable; a judgement about a
capture is corpus prose.** A test pins it, so the constraint cannot be undone by tidying.

## Consequences

- **Every corpus in this repository now passes `--strict` with zero warnings**: the
  repository's own and all four decision projects. That is the first time since ADR-0036
  added `corroboration` to `POLICY_CHECKS`.
- **The warning count stopped being a quality score**, and this is the real trade. Eight
  warnings became eight recorded judgements, and a reader who trusts the number without
  reading the reasons now learns less than before. The reasons are the artefact; the zero is
  a side effect.
- **`strict` becomes a meaningful setting** rather than an aspiration. It now asks: is every
  under-supported claim either corroborated or explicitly accounted for? That is answerable,
  where "does every claim have two independent witnesses" was not.

## Alternatives considered

**Leave it.** What ADR-0036 did. It left `strict` unusable and eight true findings as
permanent noise, which is how a gate teaches people to skim past it.

**Let `corroboration` pass silently on known vendor hosts.** A hardcoded allow-list, wrong
the moment a vendor is wrong about itself, and it would have hidden the judgement instead of
recording it.

**Drop `corroboration` from `POLICY_CHECKS`.** Considered and rejected on 2026-09-21 as
weakening a check that tells the truth. This reaches the same verdict without the weakening.

**Require the acknowledgement to name an attempted search.** Closer to what actually happened
in the sea-assets case, and unenforceable — the check cannot tell a real search from a
claimed one, which is ADR-0013 territory again.

## What this ADR does not claim

That an accepted judgement is a correct one. `[single-witness: …]` records that a person
looked and concluded no second witness exists. The sea-assets corpus is the standing
counter-example: that exact conclusion was reached in good faith, written down at length, and
**wrong** — the second witness existed and one more search found it. The mechanism makes the
claim visible and attributable. It does not make it true.
