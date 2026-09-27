# ADR-0075 — Lighter records for small changes

- **Date:** 2026-09-27
- **Status:** accepted
- **Area:** `AGENTS.md` and `template/AGENTS.md` (the standing protocol, rules 2 and 3),
  `CONTEXT.md`

## Context

The standing protocol asks every commit for a five-part report, and an ADR for any choice
that set an alternative aside. Both rules earned their place on the kit's code. But they
apply with the same weight to a test fixture, a wording fix or a regex in a test. In the
break-test of 2026-09-27, several test-only commits carried full reports and would, read
literally, each have needed an ADR for choices no future explorer would re-suggest. An
outside review of the kit (the same day) named the process overhead as the main friction
for rapid iteration, and the operator agreed.

## Decision

- **Rule 2, short form.** A commit that touches no declared code path (`research/kit.json`)
  may give the report as one line per part: what changed, why, what you verified, what you
  got wrong. The got-wrong line stays, because the reason for it holds for small commits
  too. A commit under a declared code path uses the full form.
- **Rule 3, design choices only.** An ADR is owed when the set-aside alternative was about
  how the kit behaves, what it stores or what it promises. Test mechanics, wording and a bug
  fix with one obvious remedy do not need one; the commit report's *why* names any
  alternative that was set aside.
- Rules 1, 4 and 5 are unchanged. The template carries the same change, so scaffolded
  projects inherit it.

## Rejected alternatives

- **Drop the got-wrong line from the short form.** It is the one part a quick commit is most
  tempted to skip, and the protocol already explains why its absence cannot be told apart
  from not checking.
- **Scale by diff size instead of by path.** A one-line change to the gate is not small, and
  a large fixture regeneration is. The declared code paths already say what the kit treats
  as code, and the commit gate already reads them.
- **Drop the Node/Python dual conformance as part of this.** It is overhead of a different
  kind: an independent second implementation that checks the hashes. Removing it is a
  trade-off in what the kit can prove, not a lighter record, and was not asked for.

## Trigger that would reopen this

A defect traced to a decision that was recorded only in a short commit report, or only in a
commit's *why* line instead of an ADR.
