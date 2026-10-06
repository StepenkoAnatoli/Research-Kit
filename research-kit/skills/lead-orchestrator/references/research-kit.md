# Research-Kit, as lead-orchestrator uses it

This file is added by the kit (ADR-0146). The SKILL.md beside it names
`references/research-kit.md`; the copy of lead-orchestrator the kit vendored did not ship
one, so this file points at the protocol it would describe rather than restating it.

## Readiness

```
node "$HOME/.agents/research-kit/bin/doctor.mjs"
```

Record the verdict (`READY` or the blockers), the kit path, and the **machine role** it
prints. The role decides Phase 1b:

- **collector** - Phase 1b runs as the skill says, following the `research-first` skill
  (deployed beside this one): decompose, contract, prior, collect, rewrite, gate, brief.
- **builder** - Phase 1b does not run here. `research.mjs` and `decompose.mjs` refuse on a
  builder (exit 2), and a page fetched by hand is not evidence. Run
  `node "$HOME/.agents/research-kit/bin/handoff.mjs"` first, build from `research/BRIEF.md`,
  and turn every missing fact into a request with the `fact-request` skill.

Which skill to use at each point is the `skill-router` skill's table.

## Protocol, commands, rules, exit codes

The `research-first` skill and the project's `AGENTS.md`. Exit codes: `PASS` 0,
`FAIL`/`REOPEN` 1, `INCOMPLETE` 2, `BLOCKED` 3 - read the code, not the prose.

## Not shipped

`references/project-facts-template.md` and `references/report-templates.md`, which the
SKILL.md also names, were not in the source either. Until they are supplied: the facts
section follows `AGENTS.md`'s "Orchestrator facts", and the report follows the
`commit-report` skill.
