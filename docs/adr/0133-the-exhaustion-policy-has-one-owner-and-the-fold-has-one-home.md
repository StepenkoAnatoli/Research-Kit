# ADR-0133: The exhaustion policy has one owner, and the line-ending fold has one home

Date: 2026-10-03
Status: accepted. Refines ADR-0086 and ADR-0129 (where the policy lives, not what it does) and
e99d0ad's LF-only captures. ADR-0132 (concurrent fetches, drafted) builds on the first part.

## Context

An architecture pass on the maintainer's machine (2026-10-03, WIP 696f46b on
`architecture-pass`) read the last weeks' changes as a design and found two things owned in
several places:

- What a run does when the paying provider runs dry - ADR-0086's one switch to the fallback,
  ADR-0129's stop - was two closures inside `runResearch`, with `stopped.uncollected += 1`
  written at three loop sites and the `credits-exhausted` failure-log row built twice. The
  decision, its record and its message may not drift apart, and they lived apart.
- The line-ending fold was written four times with two regexes that disagreed: CRLF-or-CR
  in `collect.writeRaw` (e99d0ad), CRLF-only in `provenance.isLineEndingRewrite`,
  `gate.isEmptyArchitectureMap` and `brief.shortHash`. Two folds are two answers to "is
  this the same bytes".

The pass also moved `canSearch` from the coordinator to `transport.mjs`, beside
`isSearchOnly`; that is a move, not a decision, and needs no record beyond its commit.

## Decision

1. **`lib/credits.mjs` owns a run's exhaustion state.** `creditsPolicy({ adapter,
   fallbackAdapter, ask, record, log })` holds `fellBack` and `stopped`, the `uncollected`
   and `skippedSearches` counts, and writes the one failure-log row; `runResearch` builds it
   once, asks it which provider serves each call, and reads the state back for the summary.
   The loop bodies never touch policy state. Behaviour is unchanged.
2. **`core.foldLineEndings` is the fold for the bytes the kit writes and compares** - CRLF
   and a lone CR both become LF - and `collect`, `gate` and `brief` use it. For `gate` and
   `brief` that widens CRLF-only to CRLF-or-CR; the commit says so.
3. **`provenance.isLineEndingRewrite` keeps its own CRLF-only fold.** Its question is
   narrower: did git's autocrlf smudge explain this hash mismatch. Autocrlf turns LF into
   CRLF and nothing else, and a capture written before e99d0ad can hold a lone CR of the
   page's own, hashed as such. Folding that too would turn a true "rewritten on checkout"
   into a false "altered after fetch", which is the accusation the gate must never make
   wrongly.
4. **The release layer keeps its own fold.** `release-validator.mjs` is the hermetic ported
   layer (ADR-0029); coupling it to `core.mjs` for one regex is ceremony.

## Rejected

- **Leave the policy inline and deduplicate the two record blocks only.** The state would
  still be mutated from the loop bodies, which a concurrent fetcher (ADR-0132) cannot have:
  under racing completions the transition must be one guarded call on one object.
- **One fold everywhere, provenance included.** The pass did this; see decision 3 for why
  it was withheld there.
- **A CRLF-only core fold, to change nothing.** `collect` needs the lone CR folded: a
  copyright.gov page with CR line endings hashed one way on the collector and checked out
  another everywhere else (2026-10-02), and that is the fold with the strongest reason.
- **Calling the fold change "behaviour preserved".** Two regexes that disagreed were
  unified, so one side changed; the commit states which and what it costs.

## Trigger to revisit

ADR-0132's fetch pool, when it lands, arbitrates exhaustion across workers through this
policy object; if that needs the policy to hold more than one run's state, this ADR is
superseded, not amended.
