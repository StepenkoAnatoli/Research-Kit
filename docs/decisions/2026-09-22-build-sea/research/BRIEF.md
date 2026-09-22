# Brief - what would reopening the Windows .exe cost now?

- **Date:** 2026-09-22
- **Gate:** PASS - 0 blocking, 0 warnings, 13 passing, and it passes `--strict`
- **Corpus:** 3 captures, 3 ledger entries, chain verifies
- **Collected by:** `collect.yml` run `35689363486`, via `bin/collect-remote.mjs`, 3 credits

## The answer

**The external `postject` step is gone, as of Node v25.5.0.**

> "Added built-in single executable application generation via the CLI flag `--build-sea`"

Invoked as `node --build-sea sea-config.json`, consuming the same configuration file the
postject flow used. So producing a binary no longer requires installing, pinning and trusting
a separate injector alongside Node — **the binary that runs the kit can now build the kit's
binary.**

## What this does and does not change

**It does not reopen the `.exe`.** ADR-0031 rejected it on 2026-09-21 on *scope* — the
operator decided it is not wanted now that `collect-remote.mjs` and the MCP server reach the
collector without a terminal. Nothing here touches that, and this project deliberately asks a
narrower question.

**It updates the reopening cost**, which ADR-0031 promised would stay cheap. Yesterday's
estimate was "an asset-aware branch in three modules, at Stability 1.1". That still holds, and
the packaging half of it is now smaller than recorded: no external build-time dependency, and
one less thing for a supply-chain reviewer to ask about.

**The uncomfortable detail: this was already true when ADR-0031 was written.** `--build-sea`
landed in v25.5.0, before yesterday. The sea-assets corpus fetched this exact page and read
the stability markers off it correctly — and nobody looked at the changelog entries. A cost
estimate written one day was out of date the same day, and only re-asking found it.

## What the second source actually contributed

`docs.deno.com/api/node/sea/` was collected as an independent witness. Deno implements Node
compatibility and documents the same `node:sea` surface, including `getAssetAsBlob`
("Similar to `sea.getAsset()`, but returns the result in a Blob") — which independently
confirms the assets API the sea-assets corpus turns on.

**It does not mention `--build-sea`, and that is expected rather than contradictory.**
`--build-sea` is a Node CLI flag for producing a Node binary; a compatibility layer documents
the runtime module, not the other runtime's build tooling. So it corroborates a neighbouring
claim and not this one, and U-1 cites `nodejs.org` alone with that stated on the record.

## The gate caught its own author, twice

Both findings were on this brief's work, not on the sources.

**`corroboration/single-witness-stale`.** U-1 carried a `[single-witness: …]` note, and its
Evidence cell *mentioned* E-02 while explaining that E-02 does not support the claim.
`citedIds` counts every `E-##` mention as a citation, so the corpus read as corroborated
across two hosts while the note claimed no second witness could exist. The guard built the
previous day reported the contradiction immediately.

The fix was to stop citing E-02 for U-1 and move the contrast here. **The lesson is the one
this repository keeps relearning: prose in an Evidence cell is not commentary, it is
citation** — the same mechanism behind the deduplication bug found a day earlier, arriving
from the opposite direction.

**`capture-completeness/partial-render`.** The GitHub Discussion capture carries twelve
render-failure notices and 8 KB against the Node page's 42 KB. The rule fired correctly on a
collection it had nothing to do with, which is the first evidence that it generalises beyond
the capture it was built from.

## Limits of this corpus

- **One question, one real source.** U-1 rests on `nodejs.org` alone, accepted on the record
  because no second party can witness what Node added to Node.
- **The version floor is not established.** The page says v25.5.0 added `--build-sea`; this
  corpus did not check what the *oldest* Node that supports it is on Windows specifically, nor
  whether the postject path still works as a fallback. Neither blocks a decision nobody is
  taking.
- **Nothing was built.** The claim that packaging got simpler is read from a changelog entry,
  not from producing a binary. If the `.exe` is ever reopened, that is the first thing to run.
