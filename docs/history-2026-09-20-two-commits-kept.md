# Why `58f2c34` and `d0278b2` are still in this history

- **Date:** 2026-09-20
- **Decision:** keep them, unsquashed, and explain them here
- **Related:** ADR-0024 (the gate judges the index), ADR-0026

## What they look like

Two commits, six deep, that appear to be noise:

```
d0278b2 restore the contract, add the file the gate refused
58f2c34 wip: reopen the unknowns while re-collecting
```

`58f2c34` has a `wip:` subject. Between them their changes to `research/DISCOVERY.md`
cancel exactly — `git diff 58f2c34~1 d0278b2 -- research/DISCOVERY.md` is empty. And
`d0278b2` adds `src/index.js` containing one line, `export const x = 1;`, a file that no
longer exists (removed in `86a428e`).

Every instinct says squash them.

## Why they stay

**They are the proof, not the noise.** This project claims its commit gate blocks a
commit while a blocking unknown is `OPEN`, and allows it once the contract is restored
and the architecture rule is satisfied. That is a claim about a running system. These two
commits are that claim being executed **on the real repository** rather than on a
temporary fixture: `58f2c34` reopened four unknowns and was refused; `d0278b2` restored
them and added the file the gate had named, and was allowed. `src/index.js` was the file
the gate demanded — a deliberately trivial one, because the point was the gate's
behaviour, not the file's content.

The kit's own test suite covers the gate thoroughly, in temp projects. What it cannot
cover is the gate installed machine-wide, running against this repository, with its real
corpus. That happened once, and this is the record of it.

**The project already decided this question elsewhere.** `research/EVIDENCE.md` keeps
E-15, a capture of a URL that returned 404 because I guessed the path wrong — with the
row saying so in those words. The reason given there applies unchanged here:

> Deleting the failed capture would have made the corpus look tidier than the research
> was.

A history rewritten to remove the experiment that proved the gate works would make the
development look tidier than it was, for the same false benefit.

**Squashing would break live references.** This is the decisive practical fact. The pair
sits below six descendants, and three documents cite those descendants by SHA:

| Document | Cites |
|---|---|
| `docs/validation-2026-09-20-search-fetch-seam.md` | `5ff0bdd` → `a536ec1` → `8111c66` |
| `docs/adr/0027-search-and-fetch-are-two-seams.md` | `2f9c761` |
| `docs/requirements-2026-09-19-search-fetch-seam.md` | `2f9c761` |

Rewriting `58f2c34` changes every hash above it. A traceability document whose commit
references no longer resolve is worse than no traceability document — it looks
authoritative and points at nothing. The whole purpose of that validation map is that a
reader can check it.

## What was actually wrong, and what was done instead

The real defect was never the commits' existence. It was that `wip: reopen the unknowns
while re-collecting` does not say *why* an agent deliberately broke its own contract, so
a reader six months out would reasonably read it as an accident someone cleaned up.

Git offers no way to annotate a commit without rewriting it. So the annotation lives
here, and this file is linked from the ADR index. That is the honest trade: the history
keeps its integrity and its references, and the explanation is one search away.

`src/index.js` needed no action — `86a428e` had already removed it.

## The rule this sets

**Do not rewrite history to make a record tidier than the work was.** Rewrite it to fix
something that is wrong. A commit that looks like noise and is actually evidence gets an
explanation, not a rebase.
