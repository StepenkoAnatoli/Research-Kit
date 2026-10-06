# ADR-0143: A passing handoff keeps the gate's cautions

Date: 2026-10-05
Status: accepted. Refines the presentation responsibilities of ADR-0014, ADR-0019 and
ADR-0032. A bug fix and documentation under the freeze (ADR-0117); no new command, check,
configuration key or package format. ADR-0089's semantic boundary remains in force.

## Context

The owner asked that the kit's promise match its behavior. The retained research project
[agent reliability](../decisions/2026-10-05-agent-reliability/research/BRIEF.md) distinguishes
verified artifact structure from correct interpretation and measured downstream outcomes.
Its first builder task is truthful brief certainty and warning preservation.

The brief said every blocking unknown was closed on PASS, although KNOWN-UNKNOWN with a
verification step is allowed. Its empty known-unknown section claimed all unknowns were
closed even on FAIL. The contradictions placeholder asserted independent agreement before
review. Preflight's actual warnings were absent from the brief and package reading guide;
the main audit printed a count alone and subtopic audits omitted the warnings.

These are output defects: policy already reports the uncertainty, but the handoff loses it.
Regression fixtures reproduce the cases with the real preflight evaluation, including a
single-source warning, secondary evidence, an open contract and a disclosed private quota.

During PR preparation, main independently added an identifier-only brief warning list
that filtered brief freshness and gate-integrity findings (PR-253). This decision
supersedes that presentation: those findings also describe limits of the handoff or its
enforcement. They are retained as observations of the supplied evaluation, with the
instruction to rerun after edits. Main's watchdog-budget ADR keeps 0142; this ADR was
renumbered from 0142 to 0143, and the chronological-audit clarification to 0144.

## Decision

- PASS says the configured research checks passed. It makes no assertion of complete
  closure, independent corroboration or factual correctness. The known-unknown section
  reports the declared status; the contradictions section asks the reviewer for a judgment.
- `lib/render.mjs` owns a pure Markdown presentation of an existing verdict's warnings.
  It retains each check/rule, supplied row/unknown target, full reason and suggested remedy. A missing evaluation or
  warning observation is explicitly unavailable; only an observed empty list prints zero.
  No policy is selected and no evaluation runs in this renderer.
- The brief preamble, full and subtopic audits, package README-FIRST and collection summary
  use that presentation. It is labeled as the whole-corpus evaluation at generation time.
  This matters for a warning about a brief that drafting itself may replace: the list is a
  retained observation, and the reader is told to rerun preflight after edits.
- Audit fingerprints include the rendered gate result. A changed freshness warning or
  policy outcome earns a new immutable snapshot even when the corpus text is unchanged.
  Old fingerprints earn their first warning-aware version on the next render; existing
  audit files stay untouched. Identical corpus and evaluation reuse the existing version.
- The MCP approved-package message points the builder to README-FIRST and the brief for
  cautions. The manifest remains the authorization contract; warnings keep their current
  severity and do not independently revoke authorization.
- Public wording describes the provenance and structural checks actually supplied. Error
  reduction across research, coding and writing remains unmeasured until an outcome
  evaluation supports a bounded claim.

## Rejected

- **A seventh brief section.** The preamble carries the cautions while ADR-0014's six
  sections and their readers keep the same shape.
- **One renderer per output.** Duplication caused readers to receive different amounts of
  the same evaluation. Presentation belongs in the existing presentation module.
- **Only the warning count, or only warnings guessed to concern a subtopic.** A count
  loses the reason. Global findings may have no row ID; guessing applicability would
  silently discard cautions, so subtopic files label the warnings as whole-corpus findings.
- **Filtering brief freshness and gate-integrity warnings from the handoff.** The
  observation can matter to a builder's confidence in freshness or enforcement. Labeling
  its evaluation time and rerun step handles the fact that drafting may change the brief;
  filtering would remove the caution entirely. Warning severity and approval stay unchanged.
- **Rewriting historical audits.** It violates their immutability. Version selection fixes
  a current output without changing what an earlier pass recorded.
- **A new structured warning field in packages or MCP results.** That changes a machine
  contract and needs its own frozen-feature decision. This task repairs human-facing
  outputs using an evaluation the producer already holds.
- **A semantic truth judge, or treating every warning as a failure.** Neither follows from
  the defect. Review and empirical outcome evaluation remain necessary, and the existing
  evidence policy remains the operator's choice.

## Trigger to revisit

Revisit the structured-warning alternative if a consumer needs to decide from warning
data without reading the retained documents. Evaluate any proposed contract in a separate
decision project before changing it. Revise the public outcome claim only after a retained,
controlled evaluation measures the effect within its stated tasks and conditions.
