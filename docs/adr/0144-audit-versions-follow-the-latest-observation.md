# ADR-0144: Audit versions follow the latest observation

Date: 2026-10-05
Status: accepted. Clarifies ADR-0143's version reuse rule; ADR-0019's immutable snapshots
and manifest-based bundle remain in force. A lifecycle bug fix under ADR-0117, with no
new command, flag, schema, check or authorization rule.

## Context

The pre-merge audit reproduced a warning cycle with a real preflight evaluation:
maxAgeDays 1, then 60, then 1 over the same 30-day-old corpus. The third audit reused
the historical v0.1 fingerprint and returned before updating the manifest's latest
pointer. Default bundling therefore retained v0.2, which omitted the current warning.
The opposite cycle retained a warning that no longer appeared in the current evaluation.

ADR-0143 made warning observations part of the audit fingerprint, exposing the historical
reuse defect. Its statement that identical corpus and evaluation reuse an existing
version did not distinguish a consecutive identical observation from a return to history.

## Decision

Compare the new fingerprint only with the manifest's latest version. A consecutive
identical observation reuses that version without writing. Any different observation,
including a return to a historical state, earns the highest existing version plus one.
A -> B -> A therefore produces v0.1, v0.2, v0.3; another A reuses v0.3.

Version allocation, immutable writes and the manifest update stay under the existing
project lock. Historical entries and bytes remain untouched, and explicit historical
reads remain available. Default show and bundle keep using the manifest's latest pointer.
Audit files and their index do not become review inputs or change build authorization.

## Rejected

- **Repoint latest to a historical fingerprint match.** It would move the default
  observation backward through the version history and make a later evaluation appear
  under an earlier version and date. A new immutable snapshot records the transition.
- **Rewrite the historical matching audit.** It destroys the observation already handed
  to a reader and violates ADR-0019.
- **Select the current warning state while bundling.** Bundles contain retained snapshots;
  re-evaluating there would mix a new observation with an old snapshot rather than repair
  version selection at its owner.

## Verification

Offline regressions exercise both warning-cycle directions through real preflight and
the default ZIP reader, check that historical bytes survive, and check that a consecutive
identical evaluation remains idempotent. This verifies warning retention and lifecycle,
not factual truth or a measured reduction in downstream mistakes.
