# ADR-0138: A brief with no draft stamp keeps its approval, and hygiene says so

Date: 2026-10-03
Status: accepted. Lifts the freeze (ADR-0117) for one hygiene rule, `brief-unstamped`.
From the review of the output-reliability audit's G1 fix (2026-10-03).

## Context

ADR-0055 gave every drafted brief a stamp: a hash of its own text, so an untouched draft
can be redrafted without `--force`, and a hash of what it was drafted from, so
`hygiene/brief-stale` can say when the corpus has moved on. The G1 fix made a package's
`buildAuthorized` depend on that second hash: a stamped brief is approved only while its
inputs still match the corpus.

Eleven briefs in this repository - the root's own and ten under `docs/decisions/` - were
drafted before ADR-0055 and carry no stamp. For them the G1 fix had to choose, and it
chose compatibility: an authored brief with no stamp keeps its approval, because its
currency cannot be checked and refusing it would un-approve eleven real briefs for a
mechanism that postdates them. The choice was written in the architecture map and
nowhere the gate reports: a builder reading the package saw `briefReviewed: true` and
nothing about what that did not cover.

The review also found the stamp anchored to the end of the file. A line appended after it
- a reviewer's note, or the `Reviewed by: agent` line AGENTS.md asks for - made the brief
read as unstamped, so a stale brief re-approved the build and `brief-stale` fell silent.
That is a defect, fixed in the same change (the stamp is found wherever it stands, and
text after it is an edit); it is recorded here because it is how the compatibility path
became a bypass.

## Decision

1. **An authored brief with no stamp keeps its approval.** `deriveState` treats "no stamp"
   as "currency unknown", not as "stale". The eleven briefs stay approved as they were.
2. **Hygiene says so.** `brief-unstamped` is a warning on any drafted brief (`draft` or
   `authored`) that carries no stamp: it names ADR-0055, says the brief's currency cannot
   be checked, and gives the remedy - redraft with `--force`, which stamps it and keeps
   the old brief as a backup. A template brief and a hand-written legacy brief are not
   drafts and get no such warning. An approval nothing can check is no longer silent.
3. **The stamp is found wherever it stands**, the last one if there are several, and any
   text after it counts as an edit, as text before it always did.

## Rejected

- **Refusing approval to an unstamped brief.** Honest about currency and wrong about
  the eleven briefs: each was reviewed and answered, and un-approving them would send
  eleven decisions back for a stamp that proves nothing those reviews did not.
- **Stamping the eleven briefs by hand.** A stamp is the drafter's record of what it drafted
  from; one computed after the fact over an edited brief records a draft that never
  happened. The remedy is a redraft, which the warning names.
- **Leaving the compatibility path in the map alone.** That is where the review found it:
  a reader of the gate's output could not tell an approval that was checked from one
  that could not be.

## Trigger to revisit

Every brief in this repository carries a stamp, or the kit gains a way to stamp a brief
without redrafting it. Then rule 1 can become a refusal and rule 2 goes away.
