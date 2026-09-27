# ADR-0061 — handoff names an unreviewed brief, and does not fail on it

- **Date:** 2026-09-27
- **Status:** accepted
- **Area:** `lib/handoff.mjs` (`briefReview`), `bin/handoff.mjs`
- **Refines:** ADR-0011 and ADR-0020 (the arrival question)

## Context

`handoff.mjs` is the builder's first command. On 2026-09-27 a builder got "handoff OK"
for a corpus whose brief still had both judged sections (contradictions, decision) marked
TODO: a handoff nobody had reviewed. The brief says so in its own text, but the command
the builder runs first did not.

## Decision

The report carries `brief: { state, todo }`. When the corpus is whole and the brief is a
draft, the CLI still prints "handoff OK", followed by a note naming the sections still TODO
and saying to ask whoever ran phase 1 to answer them. When no brief has been drafted, the
note says there is no handoff to build from yet. The exit code stays 0.

## Rejected alternatives

- **Fail the handoff on a draft brief.** Handoff answers one question: did the corpus
  arrive whole? A builder who reads the corpus while waiting for the review should not be
  told the transfer failed. The artifact validator also calls `verifyHandoff`, and a
  review state is not a transfer failure there either.
- **Say nothing, and rely on the brief's own text.** That text is the thing that was not
  read.

## Trigger that would reopen this

A phase-2 gate that refuses to build from an unreviewed brief. Handoff would then report
that gate's verdict instead of a note.
