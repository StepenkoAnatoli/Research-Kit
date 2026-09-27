# ADR-0063 — Uninstall restores core.hooksPath only while it is still the kit's

- **Date:** 2026-09-27
- **Status:** accepted
- **Area:** `lib/installer.mjs` (`removeCommitGate`), `bin/install-hooks.mjs --uninstall`

## Context

`install-hooks` records the global `core.hooksPath` it replaces, and `--uninstall` puts
that value back. On 2026-09-27 a machine had `core.hooksPath=/opt/myhooks`. The install
refused the commit gate, because the kit was not deployed, and never touched the setting.
`--uninstall` then "restored" it to unset, deleting a setting the kit had never changed.
The same would happen to a value the operator set after installing.

## Decision

`removeCommitGate` restores the recorded value only when the current global
`core.hooksPath` is exactly the folder the kit set. Otherwise it leaves the setting as it
is and says so: "left as /opt/myhooks - the kit did not set it, or it was changed since".
Either way the install state forgets both values, so a later install records a fresh
"previous" value.

## Rejected alternatives

- **Always restore the recorded value.** That is the old behaviour, and it overwrites
  whatever the operator has now.
- **Refuse to uninstall when the value differs.** The edit-gate half of the uninstall is
  still wanted, and nothing about the commit gate needs undoing in that case.

## Trigger that would reopen this

The kit installing a per-repository hooks path, where "the kit's own" would need a
different test.
