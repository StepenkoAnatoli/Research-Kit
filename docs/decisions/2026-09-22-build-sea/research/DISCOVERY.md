# Discovery Contract - what would reopening the Windows .exe cost now?

Started 2026-09-22.

## Build intent

ADR-0031 **rejected** the local Windows `.exe` on 2026-09-21 - on scope, not on difficulty.
The operator decided it is not wanted now that the agent path reaches the collector without
a terminal. That decision is not reopened here and this project does not ask for it to be.

What this asks is narrower and is the thing the ADR promised would stay cheap: **if it is
ever reopened, what does it cost?** ADR-0031 records the answer as of yesterday - an
asset-aware branch in three modules, at Stability 1.1. This checks whether the packaging
half of that estimate is still current.

"Done" is a yes or no: is the postject step - an external tool the kit would have to install,
pin and trust - still required to produce a binary?

## Unknowns

| ID | Unknown | Why it blocks the build | Status | Evidence |
|---|---|---|---|---|
| U-1 | Does producing a SEA still require the external `postject` tool? | Every external build-time dependency is something to install, pin, and trust. It is the part of the packaging story ADR-0031 called awkward, and it is the part a supply chain reviewer asks about | CLOSED | E-01: **no, not since v25.5.0** - "Added built-in single executable application generation via the CLI flag `--build-sea`", invoked as `node --build-sea sea-config.json`. The binary that runs the kit can now build the kit's binary [single-witness: the Node.js project documenting its own CLI flag, in its own changelog. No second party can witness what Node added to Node in v25.5.0 - only report it. A second runtime's compatibility docs were collected and are discussed in the brief; they do not carry this claim] |

## Questions for the human (maximum 3)

1. None. The `.exe` stays rejected; this only updates what reopening would cost.

## Already decided

- The `.exe` is rejected (ADR-0031, 2026-09-21). Nothing here revisits that.
- Whatever ships, the artifact contract does not change (ADR-0032).
