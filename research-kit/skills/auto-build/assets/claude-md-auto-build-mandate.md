## Auto-build mandate
- Default reply for bounded tasks: GO MERGE
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
- Ask once, in one message, only for the stop-list. Decide the rest and record it under "Decisions made without asking".
- No reassurance, no praise, no padding. Result, evidence, open items, next step.
