# ADR-0073 — An unused Firecrawl key is named at collection time, not refused

- **Date:** 2026-09-27
- **Status:** accepted
- **Area:** `lib/transport.mjs` (`unusedKeyNote`), `bin/research.mjs`, `bin/decompose.mjs`

## Context

The kit uses a Firecrawl key only through the Firecrawl CLI. With `FIRECRAWL_API_KEY` set
and no CLI on PATH, auto-detection falls back to the keyless adapter, which is capped per
IP. The run printed only `no CLI on PATH - falling back to the keyless adapter`. Nothing at
collection time said that the key was unused. `doctor.mjs` did say so, as a FAIL, but
nobody has to run doctor before collecting. The ledger stays honest (captures are stamped
`http-keyless`), so the risk is a weaker, capped collection nobody chose, not false
evidence.

## Decision

When the key is set and the fetch transport came from auto-detection with the CLI absent,
`research.mjs` and `decompose.mjs` print one note under the transport line. It says the key
is unused and gives `npm install -g <cliInstallSpec()>`. Which transport runs does not
change. An explicit `--transport http-keyless`, env or config choice gets no note.

## Rejected alternatives

- **Refuse to collect when a key is set but the CLI is missing.** It would stop a run that
  still produces an honest corpus, and it would make the keyless adapter unusable on any
  machine that happens to export the key.
- **Call the Firecrawl HTTP API with the key directly.** It adds a third fetch adapter and
  moves vendor knowledge out of `firecrawl.mjs` (ADR-0005). That is a design change, not a
  diagnostic.

## Trigger that would reopen this

A fetch adapter that uses the key without the CLI.
