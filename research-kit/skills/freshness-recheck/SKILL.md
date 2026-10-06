---
name: freshness-recheck
description: Re-collects, on the collector, the pages a Research-Kit brief rests on before a build starts or a release ships, using research.mjs --refresh-days, so a vendor that changed a limit, price or schema is caught in the corpus before it reaches code. Use before a release, when a brief is older than its refreshDays, when a builder reports behaviour that contradicts the brief, or when the user asks whether the research is still current. Collector only.
---

# Freshness recheck

A capture is true of the day it was fetched. Before the code that depends on it ships,
check the day has not moved on.

## Steps (collector only - a builder refuses to collect)

1. `node "$HOME/.agents/research-kit/bin/research.mjs" --status` - the budget, and the
   corpus's age.
2. `node "$HOME/.agents/research-kit/bin/research.mjs" --refresh-days <n> --dry-run` -
   which captures are older than `n` days and would be re-collected. Choose `n` from how
   fast the fact goes stale (the map's D-6 row), not from habit.
3. Run it without `--dry-run`. Every re-collection spends a credit; when the account runs
   out the run stops and asks - never pass `--fallback` on your own initiative.
4. `node "$HOME/.agents/research-kit/bin/preflight.mjs"` - a row superseded by a fresher
   capture **fails the gate** where an unknown still cites it. Re-read the new capture,
   move the citation, and rewrite the finding (`finding-rewriter`).
5. If a fact changed: record it as a contradiction in the brief (old capture vs new),
   redraft the brief, and tell the builder which E-## rows moved - `cite-in-code`
   comments name them.

## Rules

- Never edit an old capture to match the new page. History stays; the new capture
  supersedes it.
