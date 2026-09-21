# ADR-0037 — An empty capture is not mechanically detectable, and here is the measurement

- **Date:** 2026-09-21
- **Status:** accepted
- **Area:** contract checks, capture grading
- **Depends on:** ADR-0013 (a check that judged reasoning would be wrong), ADR-0036 (the gate can see single-sourcing)
- **Evidence basis:** measured over the 60 captures in this repository

## Context

`completeness` grades the **transport**: how much of the HTTP response arrived. It cannot
see a page that arrives whole and says nothing.

That is not hypothetical. `github.com/nodejs/single-executable/discussions/17` was collected
on 2026-09-21, graded `full`, and carried page furniture, a sponsor block, a star count and
the thread title — and none of the discussion, because GitHub builds a Discussion body in
the browser. The corpus recorded a capture that contributed nothing, correctly labelled as
complete.

The obvious fix is a "thin capture" check. It was proposed, and it was **wrong** — not
risky, not fiddly, but wrong about how the data actually behaves.

## The measurements that killed it

Both heuristics were run over all 60 captures in this repository, against the one capture
known to be content-free.

**Word count and link density — fails, inverted.**

| | prose words | links |
|---|---|---|
| the known content-free capture | **2241** | 203 |
| median capture | 1411 | — |
| a genuinely useful changelog page | **90** | 28 |

The empty page is **above the median**, because page furniture is verbose, while the most
useful single page in the delivery corpus has ninety words of prose. Any threshold that
flags the empty one flags most of the corpus, and any threshold that spares the corpus
spares the empty one.

**Boilerplate share against same-host peers — fails, also inverted.**

The idea: text that also appears on other pages from the same host is chrome, so a page
that is *mostly* chrome is mostly empty. Measured as the fraction of a capture's shingles
that appear in any other capture from the same host:

| | boilerplate share |
|---|---|
| the known content-free capture | **0.033** — the lowest in the corpus |
| same-URL re-collections | 1.000 |
| ordinary `docs.github.com` pages | 0.97–0.99 |

The empty capture scores *lowest*, because a Discussion page's furniture differs from a
pull request's and a README's, so it overlaps with nothing. The top of the ranking is
same-URL re-collections, which ADR-0026 requires to exist.

**Two approaches, both failing in the opposite direction from the intuition behind them.**

## Decision

**No thin-capture check.** Emptiness is a question about meaning, and the two mechanical
proxies for it are not merely imprecise — they rank the one known-empty capture at the wrong
end of both scales. A check built on either would have been confidently wrong, which is
worse than the silence it replaced.

**What ships instead is narrower and true: `capture-completeness/partial-render`.** It
matches sentences a page *prints when its own content fails to load* — "There was an error
while loading", "Please reload this page", "enable JavaScript to…". A match is the page
reporting its own failure, which is a fact about the bytes, not a judgement about substance.

### The finding is worded for what was measured, not for what was hoped

Four of sixty captures carry such a marker, and **three of those four were used and cited**:
both Node.js pull requests and the GitHub pricing page. GitHub renders the main content while
some side widget fails.

So the rule does not say a capture is empty. It says *part of this page reported a failure,
confirm the text you cite actually arrived* — which was true in all four cases, including
the three good ones. It is a `warn` and can never block, because a 75% "false positive" rate
against the question *"is this empty?"* is a 0% false positive rate against the question it
actually asks.

## Alternatives considered

**Grade `completeness: partial` when a marker appears.** Rejected. The bytes really did all
arrive; changing the transport grade to describe the content would make `completeness` lie
about the one thing it is authoritative on, and `transport-provenance` reads it.

**Block on the marker.** Rejected by the same measurement that motivated the rule: it would
have refused three captures this repository relies on.

**Compare the capture against its own title or the query.** That is asking whether the text
is *about* something, which is the reasoning-grader ADR-0013 refuses.

## Consequences

- Four warnings appear across this repository's corpora: one in delivery-architecture, three
  in sea-assets. All four are true, and three of them sit on captures that are fine.
- The registry stays at thirteen checks. This is a rule on an existing check, not a
  fourteenth, because it answers the same question `capture-completeness` already asks —
  *how much of this page do we actually have* — from the page's own side.
- **The real defence is unchanged and is procedural**: check that a page carries the text
  you intend to cite before spending a credit on it. That is how the two Node pull requests
  were chosen and how the GitHub Discussion would have been rejected. No check replaces it.

## What this ADR does not claim

That the marker list is complete. It is five patterns observed on real pages, and a site
that fails silently will still produce a capture that grades `full` and says nothing. The
list is a floor, not a guarantee, and adding to it requires seeing a new failure in a real
capture rather than imagining one.
