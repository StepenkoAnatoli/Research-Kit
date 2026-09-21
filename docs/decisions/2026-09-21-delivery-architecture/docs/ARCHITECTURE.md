# ARCHITECTURE - not applicable to this project

The standard scaffold writes this file because most projects it creates go on to hold
code, and `research/kit.json` declares the code paths (`src`, `lib`, `bin`, `scripts`,
`app`) whose commits the gate requires this file to accompany.

**This project holds no code and is not expected to.** It is a decision project: its whole
output is `research/BRIEF.md` and the corpus under `research/` that the brief rests on.
None of the declared code paths exists here, so the rule this file exists to serve never
fires.

The file is kept rather than deleted for one reason: `research/kit.json` and the scaffold's
`LAYOUT` both expect it, and a project missing a shape entry reports a finding in `doctor`
that a reader then has to investigate and dismiss. A file that says "not applicable, and
here is why" costs less than a recurring warning nobody can close.

If a future decision project under `docs/decisions/` does ship code - a spike, a prototype,
a reference implementation - replace this file with a real map of it and the gate resumes
doing its job with no configuration change.

The map of the **kit's** code is `../../../ARCHITECTURE.md`. The map of this project's
**topic** is `../research/MAP.md` - a different artifact with a different job, judged by a
different check.
