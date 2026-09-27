# ADR-0057 — handoff on an empty collector says nothing was collected

- **Date:** 2026-09-27
- **Status:** accepted
- **Area:** `lib/handoff.mjs` (`nothingCollected`), `bin/handoff.mjs`
- **Refines:** ADR-0011 and ADR-0020 (the arrival question)

## Context

On a collector with nothing collected, `handoff.mjs` printed "Something did not travel.
The remedy lives on the COLLECTOR machine" - the machine it was running on, where there
was nothing to push. `doctor` had already met the same case on 2026-09-26 and reports it
by role: information on a collector, a blocker on a builder.

## Decision

The report gains `nothingCollected`: no ledger entry, no evidence row and no capture.
When it is true on a collector, the CLI says that nothing has been collected in this
project and names `research.mjs`. It exits 1, because there is still nothing to hand off.
On a builder the output is unchanged.

## Rejected alternatives

- **A new finding name, such as `handoff-nothing-collected`.** `doctor` and the artifact
  validator branch on `handoff-ledger-missing`, and the validator maps it to
  `LEDGER-MISSING`. Renaming the finding would change what they report for a case they
  already handle correctly.
- **The same wording on a builder.** On a builder, an empty corpus is still something
  the collector has to produce and push, and the existing remedy says exactly that.
- **Exit 0 on an empty collector.** A script that runs `handoff.mjs` before shipping a
  corpus would treat an empty project as ready.

## Trigger that would reopen this

`handoff.mjs` gaining a use on the collector other than a pre-push check, such as a
`--json` consumer that needs the role in the report.
