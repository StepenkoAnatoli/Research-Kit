# ADR-0101 — macOS is best-effort, and CI has no macOS leg

- **Date:** 2026-09-29 (recorded; the decision was already stated in the root README's
  "Supported platforms" section)
- **Status:** accepted
- **Area:** `.github/workflows/offline-suite.yml` (the platform matrix), `README.md`

## Context

"Supported" in this kit means one thing: every commit runs the full offline suite on that
platform in CI. Linux and Windows do. macOS does not, so a macOS regression is not caught
before a user hits it.

The decision lived only in README prose and a comment in the workflow. A review
(DeepSeek, 2026-09-29) asked for it as an ADR, and suggested a "lightweight macOS job that
runs only the offline suite".

## Decision

macOS stays best-effort and untested. The matrix in `offline-suite.yml` has no
`macos-latest` leg.

## Alternatives rejected

- **A full macOS leg.** A red leg nobody intends to fix teaches people to ignore red. That
  costs more than the coverage is worth while nobody maintains the kit on macOS.
- **A "lightweight" offline-only macOS leg.** This is the same thing as the full leg:
  the suite CI runs *is* the offline suite (no key, no network). There is no smaller
  meaningful subset to run.

## Evidence it rests on

The one macOS run that was done found a real containment bug: `audit --zip` refused to
package its own files when the project sat under a symlink. The bug was never
macOS-specific. A symlinked `~/projects` reproduces it on Linux, and it is fixed and pinned
there. A regular macOS leg would have found nothing the Linux legs do not also exercise.

## Expires when

- Someone commits to fixing macOS failures, or
- a macOS user reports a regression the Linux and Windows legs could not have caught.

Then add `macos-latest` to the matrix. The workflow comment already says where.
