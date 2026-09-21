# Start here

A **decision project** (ADR-0030). Read `research/BRIEF.md`; everything else is what it
rests on.

**The question:** ADR-0031 deferred the local Windows `.exe` with a dated trigger - revisit
when `useVfs` reaches Stability 1.1. Is that trigger the right one?

## Why it exists

It is not. The trigger was checked and the **premise under it turned out to be false**: the
kit does not need `useVfs` to read its own bundled files. The `assets` configuration key and
the `sea.getAsset()` family do that, they predate the VFS by years, and they sit at the
feature's own Stability 1.1. The `1.0 - Early development` marker ADR-0031 cited is real and
attaches only to the VFS section - a convenience the kit can decline.

So the `.exe` was waiting on a condition it never depended on. ADR-0031 carries an amendment
saying so.

## How it was collected

Dispatched through `bin/collect-remote.mjs` - the agent path - as run
[35623502540](https://github.com/StepenkoAnatoli/Research-Kit/actions/runs/35623502540),
depth `quick`. Three pages, all graded `full`. One is authoritative and current, one is a
stale mirror of it, and one rendered no content at all.

**That one-in-three hit rate is the second finding, and it is deliberately not hidden.**
`EVIDENCE.md` keeps all three rows and cites one. The mirror also found a real limitation in
this repository's own `corroboration` check, recorded in ADR-0036.

## Verifying it

From **this** directory:

```
cd docs/decisions/2026-09-21-sea-assets
node ..\..\..\research-kit\bin\preflight.mjs
node ..\..\..\research-kit\bin\handoff.mjs
```

As of 2026-09-21: `PASS  0 blocking, 2 warning(s), 12 passing` and `handoff OK - 3 ledger
entries, chain verifies`.

**Under `--strict` this corpus fails**, 2 blocking, and that is expected. Both warnings are
`corroboration/single-source` on U-1 and U-2, both accepted on the record rather than
cleared - the only available second source was the stale mirror, and citing it would have
made the corpus read stronger while making it weaker. `research/BRIEF.md` argues it.

So does every other corpus here: since ADR-0036 added `corroboration` to `POLICY_CHECKS`,
**nothing in this repository passes `--strict` or `evidencePolicy=strict`**, measured and
tabulated at the end of `research/BRIEF.md`. That is a property of the repository, not of
this corpus.
