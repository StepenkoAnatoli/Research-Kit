# Start here

A **decision project** (ADR-0030). Read `research/BRIEF.md`; everything else is what it
rests on.

**The question:** on a public repository, who can actually read a workflow run - its shape,
its logs, and the artifact it produced?

## Why it exists

ADR-0035 measured an **anonymous** caller and found only the run's shape exposed. It closed
with a section headed "What is NOT measured, and is therefore not claimed": what a
**signed-in** user sees. That gap was load-bearing, because the collector's logs echo the
dispatched topic and the artifact *is* the corpus.

This closes it, and the answer is the less comfortable one: **any signed-in GitHub account
can read the logs and download the artifact.** The `401` and `403` ADR-0035 measured are
refusals of anonymity, not of strangers.

## How it was collected

Dispatched through `bin/collect-remote.mjs` - the agent path, the same one an AI would
use - as run
[35620262684](https://github.com/StepenkoAnatoli/Research-Kit/actions/runs/35620262684),
depth `quick`. Three pages, all `full`, all from `docs.github.com`.

The `corroboration` check reports that as `one-voice` rather than `independent`, and it is
right to: this is GitHub describing its own permission model. Authoritative, and not a
second opinion. The warnings are left standing rather than argued away.

## Verifying it

From **this** directory:

```
cd docs/decisions/2026-09-21-public-run-visibility
node ..\..\..\research-kit\bin\preflight.mjs
node ..\..\..\research-kit\bin\handoff.mjs
```

As of 2026-09-21: `PASS  0 blocking, 4 warning(s), 12 passing` and `handoff OK - 3 ledger
entries, chain verifies`.
