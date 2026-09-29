# ADR-0092 — The browser transport keeps its sandbox on Ubuntu 23.10+, by choosing the binary Ubuntu allows

- **Date:** 2026-09-29
- **Status:** accepted
- **Area:** `lib/browser-transport.mjs`
- **Evidence:** `docs/decisions/2026-09-29-chromium-sandbox-userns/` (U-01..U-03)

## Context

The first live runs of the browser transport on GitHub's `ubuntu-latest` failed. Chromium
aborted with `No usable sandbox! If you are running on Ubuntu 23.10+ …` (live-collection run
36519301132).

Ubuntu lets a binary use unprivileged user namespaces only if it has an AppArmor profile
with the `userns` rule (E-01). Ubuntu ships such a profile for Chrome stable at
`/opt/google/chrome/chrome` (E-02).

The kit looked for `chromium` before `google-chrome`. So on a machine with both, it chose a
build that AppArmor denies.

## Decision

- **Search order on Linux:** Chrome stable comes first (`/opt/google/chrome/chrome`, then
  the `google-chrome` launchers that exec it), then the Chromium builds.
- **When the sandbox is denied:** a crash whose FATAL line says "No usable sandbox" gets
  the remedies that keep the sandbox:
  - Chrome stable, via `browserPath`;
  - `CHROME_DEVEL_SANDBOX=/opt/google/chrome/chrome-sandbox` for another build. Chromium
    calls this the safest option.
- **`--no-sandbox` stays root-only** (ADR-0088). It is never a fallback and never a
  suggestion.

## Rejected alternatives

- **Retrying with `--no-sandbox`.** Chromium says it "should never be used when browsing
  the open web" (E-02). The open web is all this transport renders.
- **Turning off `kernel.apparmor_restrict_unprivileged_userns` in the live workflow.** That
  disables an OS security feature to make a check pass. The runner would then no longer
  resemble the machines the check speaks for.
- **Setting `CHROME_DEVEL_SANDBOX` on the user's behalf.** It installs no setuid helper
  itself, and it depends on Chrome being installed. Naming it keeps the choice with the
  operator.
