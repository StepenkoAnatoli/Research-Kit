# ADR-0064 — An existing .gitignore or .gitattributes gets the kit's rules appended

- **Date:** 2026-09-27
- **Status:** accepted
- **Area:** `lib/scaffold.mjs` (`scaffoldProject`, `missingKitLines`, `validateProject`), `bin/new-project.mjs`

## Context

`new-project` never overwrites a file that exists without `--force`. On 2026-09-27 it was run
in a folder that already had its own `.gitignore` and `AGENTS.md`. Both were kept, and the
output said only "kept 1". The kit's `.gitignore` is what keeps `.env`, `*.pem` and `*.key`
out of git (AGENTS.md Rule 6), keeps the Firecrawl CLI's `.firecrawl/` cache out, and
explicitly keeps the ledger in. `git add -A` then staged a `.env`. With the folder's own
`AGENTS.md`, an agent working there never saw the research-first rules.

## Decision

- `.gitignore` and `.gitattributes` (`MERGED_FILES`) are merged, not skipped. The kit's rule
  lines that the file lacks are appended under a marked comment, so the operator's lines
  keep their order and the kit's negations come after any broader rule. Lines are compared
  with whitespace collapsed. A second run finds nothing missing and changes nothing, so
  re-running `new-project` also repairs a project scaffolded before this change.
- `AGENTS.md` is never merged: it is prose, and splicing two sets of agent instructions is
  a judgement for the operator. An `AGENTS.md` without the kit's heading is reported as
  `agents-md-foreign` (warn), naming the kit's copy to add by hand.
- `validateProject`, which both `new-project` and `doctor` print, warns
  `kit-rules-missing` for a merged file that still lacks kit lines.
- `new-project` names what it merged, and names the kept files when there are few of them.

## Rejected alternatives

- **Keep skipping and only warn.** A warning scrolls past, and the `.env` would still be
  staged by the first `git add -A`.
- **Overwrite the operator's file.** It would drop their own rules. `--force` remains the
  deliberate way to do that.
- **Merge AGENTS.md too.** Appending hundreds of lines of instructions to someone's own
  file silently changes what every agent in that folder is told to do.

## Trigger that would reopen this

A kit rule that must come BEFORE the operator's lines to work. Appending cannot express
that, and the merge would need to insert instead.
