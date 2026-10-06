# ADR-0145: The kit is measured against a strong prompt before it grows

- **Date:** 2026-10-06
- **Status:** accepted
- **Area:** evaluation only; no command, flag, transport, provider, configuration key,
  file format or check is added or changed. The feature freeze (ADR-0117) is not lifted,
  and ADR-0089's semantic boundary — factual support is named and left uncomputed —
  remains in force.

## Context

The kit has strong evidence handling and documented limits on evidence interpretation:
the agent-reliability project
([`docs/decisions/2026-10-05-agent-reliability/`](../decisions/2026-10-05-agent-reliability/))
verified that replacing a Finding with an unsupported claim leaves preflight passing, and
the README now states that no controlled evaluation has yet measured how much the kit
reduces mistakes. ADR-0143 fixed the handoff's certainty wording; the first builder task
from that project's brief is done. What remains unproven is the kit's central promise:
that an agent using it makes fewer unsupported claims and mistakes than a strongly
prompted agent with the same tools and budget — and whether any benefit justifies the
full process.

A strong prompt can ask an agent to research before deciding, save pages, preserve
uncertainty, run meaningful tests, and report truthfully. The kit's distinct claim is the
reusable machinery around those instructions: the declared contract and its checks, the
cached captures and the tamper-evident ledger, the handoff verification, and the commit
hook. Whether that machinery changes outcomes is an empirical question, and the next
effort goes to answering it rather than expanding the product.

## Decision

Run a matched-arm comparison before any further product growth.

- **Two arms, matched in everything but the workflow.** Arm A uses the kit's full
  workflow. Arm B uses a strong prompt instructing research-first discipline, source
  saving, uncertainty preservation, and truthful reporting, with ordinary files and the
  same browsing, file, and testing tools. Same models, same total budget, several trials
  per arm per task.
- **Twelve realistic tasks, four per domain** (research, coding, writing), including the
  kit's claimed strongholds: consequential external facts, paid collection, an
  interruption mid-task, and a cross-machine handoff to a second agent. None excluded —
  dropping them would structurally favor one arm.
- **Outcomes measured, not document tidiness:** unsupported claims, implementation
  defects, truthful reporting, successful handoffs, review effort, time, and cost —
  scored on actual environment outcomes as well as transcripts, with repeated trials and
  calibrated graders (E-06, the Anthropic agent-evaluation guidance captured in the
  agent-reliability corpus).
- **Protocol frozen before any run.** Expected outcomes and grading rubrics per task are
  written and committed before the first trial, so results cannot bend the criteria.
- **Simplification is pre-registered.** For each mechanism — the collector, the ledger
  integrity checks, the handoff check, the commit hook — the comparison names in advance
  which measured difference would justify keeping it and which would justify dropping or
  reducing it. After the results, each mechanism is kept (demonstrated benefit at
  acceptable cost), simplified, or dropped, recorded as an ADR confirming or superseding
  the relevant prior decisions.
- **The comparison is a nested project** under `docs/decisions/` (ADR-0030), indexed in
  the same commit (ADR-0102), its external facts collected through the normal pipeline
  with their ledger — the evaluation's own claims pass the gate it is judging.
- **The pilot is exploratory.** Results are reported with the status vocabulary
  (verified / untested / expected) and outcome claims stay within what the sample
  supports.

## Rejected alternatives

- **A weakly prompted baseline.** Comparing against a poorly instructed agent would tell
  us little: much of the intended discipline can be expressed as instructions, and the
  kit's benefit — if any — must show over that, not over negligence.
- **Document-tidiness metrics.** Tidier briefs, more captures, or greener protocol
  checks do not establish the original reliability goal; only unsupported claims,
  defects, truthful reporting, and successful handoffs do.
- **Expanding the product before measuring.** More commands and rules must earn their
  place through observed failures or benefits (ADR-0117). Adding a semantic-support
  judge or new checks before the results are in would both violate the freeze and
  contaminate the measurement.
- **Ending the comparison when the first agent finishes.** Handoff, interruption
  recovery, and corpus durability are where the ledger and `handoff.mjs` claim their
  value; a comparison that stops at first completion structurally excludes the kit's
  strongest use cases.

## Trigger to revisit

The comparison's results. If the strong prompt gives equally useful, reviewable results
with less overhead, the kit is reduced to the mechanisms with a demonstrated benefit; if
the kit prevents meaningful evidence losses or mistakes at acceptable cost, those parts
are retained — each outcome as its own ADR.
