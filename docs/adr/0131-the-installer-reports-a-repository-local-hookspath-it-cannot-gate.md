# ADR-0131: The installer reports a repository-local hooksPath it cannot gate

Date: 2026-10-03
Status: accepted. Lifts the freeze (ADR-0117) for this one check. Refines the override rule (ADR-0081).

## Context

The commit gate is one machine-wide `core.hooksPath`. A repository that sets its own
`core.hooksPath` - husky, lefthook, simple-git-hooks and pre-commit all do - displaces it in
that repository: git runs one hooks folder, the local one wins, and the kit's hook never
runs there. That is the third override, silent by nature, and `doctor` and preflight detect
it at check time and record it in `research/overrides.log`.

An outside review (2026-10-02) carried the same finding through three rounds: the installer
read and wrote only the global path and said "installed" while the operator stood in a
repository where the gate would not run. The README disclosed it after round two; the
review, rightly, did not accept a paragraph as closure of a check it had asked for in code.

## Decision

- `installCommitGate` probes the working directory it is run from with
  `localHooksPathOverride` and returns `displaced: { cwd, local }` when that repository sets
  a local `core.hooksPath`, `null` otherwise. The dry run carries it too.
- `install-hooks.mjs` says it on stderr, after the install line, naming the local path, the
  tools that set one, and the remedy (`git config --local --unset core.hooksPath`), and
  **exits 0**: the machine-wide gate is installed, and this one repository is where it will
  not run.
- The install still goes through. It is machine state, and every other repository on the
  machine gets the gate.
- The installer does not write `research/overrides.log`. It is not a check; `doctor` records
  the override when it judges that project, as before.

## Rejected

- **Refusing the install.** The gate would then be installed nowhere because one repository
  had husky, which is worse than everywhere but one.
- **Exit 1 on a displacement.** The command did what it was asked; a scripted install would
  fail on a fact about the directory it happened to run in. The project-level verdict is
  doctor's, which already warns there, and the two agree on severity.
- **Walking the operator's disk for repositories with a local hooksPath.** Reading
  directories nobody authorised, for a finding the install cannot act on anyway.
- **Chaining the kit's hook behind the local one.** It would mean editing another tool's
  hook folder, which is theirs, and husky's own install rewrites it.

## Trigger to revisit

A fail-closed posture in gated projects - where a displaced gate blocks the commit instead
of warning - would be a new ADR, not an amendment of this one.
