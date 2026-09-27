# ADR-0062 — The line-ending remedy rewrites the working file

- **Date:** 2026-09-27
- **Status:** accepted
- **Area:** `lib/handoff.mjs` (`lineEndingRemedy`, `handoffRemedy`)
- **Refines:** ADR-0020 (line endings are integrity), and the F27 rule that a diagnostic never prints a destructive command

## Context

When a checkout rewrites captures to CRLF, `handoff.mjs` prints a remedy. On 2026-09-27 it
was run verbatim after a real `core.autocrlf=true` checkout of a project without
`.gitattributes`, and every capture stayed CRLF, so handoff still failed. `git add
--renormalize` corrects the index only. Git will not rewrite a working file it believes
is unchanged: `git checkout -- <file>`, `git checkout-index --force` and `git restore
--worktree` all left the file as it was. The remedy also appended the pin to
`.gitattributes` even when it was already there, and ended with a `git checkout --
.gitattributes` that did nothing useful.

## Decision

For each affected capture the remedy prints:

    git rm --cached --quiet -- <file>   # the index entry only: the file stays on disk
    git checkout HEAD -- <file>

With the index entry gone, the checkout has to write the file, and it writes it through
the pin as LF. The pin lines are printed only when `.gitattributes` does not already hold
`research/raw/* text eol=lf`. The `git status --porcelain research/` check still comes
first. A test runs the printed commands in a real repository after an `autocrlf` checkout
and requires handoff to pass afterwards.

## Rejected alternatives

- **Keep `--renormalize`.** It does not change the bytes handoff reads, which is the whole
  problem.
- **`touch` the file, then check it out.** This works, but `touch` does not exist in cmd
  or PowerShell, and a Windows machine is where this remedy is needed.
- **Delete the file, then check it out.** This works, but a remedy that deletes evidence is
  the F27 failure. `--cached` removes nothing from disk.
- **Have handoff repair it.** Handoff is read-only by design (ADR-0011): the machine that
  diagnoses does not rewrite the corpus.

## Consequences

- F27's test now forbids any `git rm` without `--cached`, instead of forbidding `git rm`
  outright. Its intent is unchanged: no file is ever deleted.
- The remedy test needs git. It is skipped, and reported as skipped, where git is absent.

## Trigger that would reopen this

A git release in which `git checkout-index --force` or `git restore` rewrites a stat-clean
file, which would allow a remedy that does not touch the index.
