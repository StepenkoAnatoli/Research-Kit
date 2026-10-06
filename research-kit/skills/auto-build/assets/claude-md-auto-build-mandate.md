<!-- Modified by Research-Kit (ADR-0146): the default-reply line and the ask-once line; the Mandate always waits for a reply. The rest is as received from StepenkoAnatoli/SkillsMDs at 3f2d2fc. -->
## Auto-build mandate
- Default reply offered for bounded tasks: GO MERGE (the run still waits for the reply)
- Architectural tasks: wait
- Base branch: main; working branch pattern: auto/<slug>
- Merge method: repository default; delete branch after merge: yes; wait for base CI: yes
- Check timeout: 60 minutes
- Research page budget per run without asking: 50 (free transports only above that)
- Unanswered questions: take the stated default; if none is safe, take the most reversible option and record it
- Audit depth: scoped at Light, full at Full
- Design-change gaps from the audit: record as open items
- Break-test: standard; never probe against <your live services, or "none">
- Queue: docs/PLAN.md, next unchecked item; one per run
- Stop-list additions: none

### How to work and report
- Label observed / inferred / assumed. Build only on observed.
- "Verified" means you ran it and read the output; otherwise write Untested and say how to test it.
- If something went wrong, lead with it: what, impact, cause, fix, how verified.
- Ask once, in one message: the Mandate and the stop-list. Decide the rest and record it under "Decisions made without asking".
- No reassurance, no praise, no padding. Result, evidence, open items, next step.
