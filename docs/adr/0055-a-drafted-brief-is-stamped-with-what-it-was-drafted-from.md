# ADR-0055 — A drafted brief is stamped with what it was drafted from

- **Date:** 2026-09-27
- **Status:** accepted
- **Area:** `lib/brief.mjs`, `lib/checks.mjs` (`hygiene`)
- **Refines:** ADR-0014 (the brief's shape has one owner)

## Context

`research/BRIEF.md` is the one file phase 2 must read. On 2026-09-27 a brief drafted while
the gate was failing still said **"Gate: FAIL (11 blocking findings)"** after the project
passed, and it did not mention the unknown closed since. Preflight passed and handoff
passed. `brief.mjs` refused to redraft without `--force`, although nobody had written a
word in the draft. A builder following the instructions would have read the stale file.

## Decision

Every brief `brief.mjs` writes ends with a comment carrying two short hashes:

- `body`, a hash of the brief's own text. If the text still matches it, the draft is
  untouched, holds nobody's judgement, and is redrafted without `--force` and without a
  backup. Any edit, anywhere, keeps the old refusal.
- `inputs`, a hash of what the brief is drafted from, taken from the parsed corpus: the
  topic, the build intent, each unknown's ID, text, status and evidence cell, and each
  evidence row. `hygiene/brief-stale` warns when it no longer matches, and names the
  command that redrafts (with `--force` if the brief has been edited).

Parsed rows rather than file bytes, so realigning a table or a CRLF checkout is not a change.

## Rejected alternatives

- **Fail the gate on a stale brief.** The gate judges whether the research is proven, and
  the brief is a rendering of it. Failing would block code commits over a document that
  one command regenerates. A preflight warning names the command that fixes it.
- **Treat a draft as untouched when its TODO sections are unanswered.** A person can edit
  the intent or a claim and leave the TODOs, and that edit would be overwritten silently.
  The body hash covers every line.
- **Compare the brief's text with a fresh render.** The render carries today's date and
  the gate verdict, so a correct brief would read as changed the next day.
- **Always redraft and keep a backup.** It leaves `.bak` files beside every run and still
  lets a builder read the stale file until somebody reruns the drafter.

## Consequences

- Briefs written before this ADR have no stamp. They are never called stale and keep the
  old refusal, because the text cannot say whether anybody edited them.
- The stamp is an HTML comment and does not render.
- The verdict line is not hashed: if only captures or the ledger change, the evidence rows
  do not, and the warning stays silent. Collecting always adds evidence rows, so a real
  collection is seen.

## Trigger that would reopen this

A second consumer of the brief (the artifact package, the audit) needing to know
whether it is current. The stamp would then belong in the package manifest.
