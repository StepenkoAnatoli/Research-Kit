# ADR-0039 — A prediction is only a prediction if it was chained first

- **Date:** 2026-09-22
- **Status:** accepted
- **Area:** prior, provenance, brief
- **Depends on:** ADR-0003 (the hash-chained ledger), ADR-0013 (the gate does not grade reasoning)
- **Evidence:** the three corpora named below, and the measurements in this file

## Context

Three corpora in this repository carry a prediction written before collection, and in each
case the prediction is worth more than the finding that follows it.

The **EUDR** prior was a year wrong on both dates. That is the only reason its brief can say
the corpus supplied something the reviewer could not have — without the prior on record, the
brief would have been eight captures agreeing with each other and no evidence that anyone's
belief had moved. The **Tavily** prior held. That is the only reason its brief can say so
without it reading as a boast, because the claim is checkable rather than remembered.

The habit was mine and it was unenforced. It has exactly one failure mode, and it is not
forgetting.

**It is writing the prediction afterwards, once the answer is known, and remembering it as
foresight.** Nobody has to be dishonest for that to happen. "I thought that" is a memory,
and memories reshape themselves around what turned out to be true. An unenforced prior is
therefore not weak evidence of foresight — it is no evidence at all, because the honest
version and the reconstructed version are the same file.

## Decision

A prior is **optional**, and when it exists its ORDER is **cryptographic, not procedural**.

1. The prediction lives in `research/PRIOR.md`, outside `research/raw/` so it is never read
   as a capture.
2. Registering it appends an `op: 'prior'` entry to the hash-chained fetch ledger, carrying
   the file's sha256 in `bodySha256` and its path in `raw`.
3. Two things stop being editable at that moment, and neither needed new machinery:
   - the **text**, because `verifyLedger` already hashes anything a ledger entry names, so
     revising the prediction fails `provenance/body-unmodified`;
   - the **position**, because every later entry's `prev` is the previous entry's
     `entrySha256`, so moving a prior after a scrape rewrites every hash that follows it.
4. `provenance/prior-precedes-collection` fails a prior registered after a scrape.
5. The drafted brief quotes it verbatim, above `## Intent`.

## The three paths, measured

Not reasoned. Each was performed against a real corpus and the result recorded.

| path | what happened |
|---|---|
| Edit `PRIOR.md` after registering | `fail provenance/body-unmodified` — *does not match the hash recorded at fetch* |
| Register after collecting, via `bin/prior.mjs` | refused, exit 2, nothing written |
| Chain a prior at seq 2 **by hand**, every hash correct | chain verifies, and `fail provenance/prior-precedes-collection` |

The third is why the check exists at all. `appendFetch` is a public export and will happily
chain a prior after the evidence with a perfectly valid chain — so the gate verifies the
order itself rather than trusting that the tool was used. Without it, the first two refusals
would be a fence with a gate left open beside it.

## What is deliberately not checked

**Nothing grades the prediction.** Not whether it was specific, not whether it was
reasonable, and above all not whether it turned out right.

This is ADR-0013 applied to the one place where violating it would be most tempting and most
destructive. A gate that preferred correct priors would teach the exact opposite of the
habit: it would reward hedging, vagueness, and predicting the safe thing. **A prior that was
wrong has done its job** — the EUDR one is the most valuable artefact in that corpus
precisely because it was wrong.

The single content rule is a **length floor** of 80 characters, and it is stated as a floor
rather than a judgement. It stops `"fine"` from being a registered prediction. It cannot
stop `"fine, and here are ninety more characters of nothing"`, and it is not meant to.

## Why absence is silent

A project with no prior produces **no finding at all** — not a warning, not a passing one.

A warning that fires on every project that skipped an optional step is a warning nobody
reads, and it would turn the habit into a toll. This repository already learned that from
`partial-render`, which stood permanently on three captures it actively relied on until the
review could be recorded and closed.

The nudge lives where it can still be acted on instead: `bin/research.mjs` prints one line
before a spending run, because after the first page lands there is no second chance.

## Why the brief carries it

A prior left in its own file is a file nobody opens. The brief is the one document phase 2
is required to read, so the drafter emits the prediction there, above the findings.

That placement also removes the quiet edit. An author who has just learned they were wrong
does not have to decide whether to mention it — the text is already on the page, and the
ledger already fixed it. The two cases, confirmed and demolished, look identical to the
renderer, which is what keeps it from becoming a scoreboard.

## Consequences

- One prior per corpus. A prior you can re-register is a prior you can retry until it is
  right. Under ADR-0030 each decision gets its own nested project, so each gets its own
  prediction; a project that opens a genuinely new question after collecting should say so
  in the brief, where it is labelled as hindsight.
- The corpora that already exist have no registered prior and never will — the mechanism
  cannot be applied retroactively, which is the whole point. Their priors stay where they
  are, in prose, and should be read as the weaker thing they are.
- `usageSummary.ledgerEntries` counts the prior, because it is one.
