# Why `8496bf9` and `59c69ce` are still in this history

- **Date:** 2026-09-20
- **Decision:** keep them, unsquashed, and explain them here
- **Related:** ADR-0024 (the gate judges the index), ADR-0026

## What they look like

Two commits, six deep, that appear to be noise:

```
59c69ce restore the contract, add the file the gate refused
8496bf9 wip: reopen the unknowns while re-collecting
```

`8496bf9` has a `wip:` subject. Between them their changes to `research/DISCOVERY.md`
cancel exactly — `git diff 8496bf9~1 59c69ce -- research/DISCOVERY.md` is empty. And
`59c69ce` adds `src/index.js` containing one line, `export const x = 1;`, a file that no
longer exists (removed in `3c92453`).

Every instinct says squash them.

## Why they stay

**They are the proof, not the noise.** This project claims its commit gate blocks a
commit while a blocking unknown is `OPEN`, and allows it once the contract is restored
and the architecture rule is satisfied. That is a claim about a running system. These two
commits are that claim being executed **on the real repository** rather than on a
temporary fixture: `8496bf9` reopened four unknowns and was refused; `59c69ce` restored
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
| `docs/validation-2026-09-20-search-fetch-seam.md` | `9a894bd` → `9686ae4` → `304cc52` |
| `docs/adr/0027-search-and-fetch-are-two-seams.md` | `ad26daf` |
| `docs/requirements-2026-09-19-search-fetch-seam.md` | `ad26daf` |

Rewriting `8496bf9` changes every hash above it. A traceability document whose commit
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

`src/index.js` needed no action — `3c92453` had already removed it.

## The rule this sets

**Do not rewrite history to make a record tidier than the work was.** Rewrite it to fix
something that is wrong. A commit that looks like noise and is actually evidence gets an
explanation, not a rebase.

## Addendum, 2026-09-20 — the history WAS rewritten, for a different reason

Everything above was written before the first push, and the first push was rejected:

```
remote: error: GH007: Your push would publish a private email address.
```

All 23 commits carried the author's personal email, and the account blocks publishing it.
Two ways out: change an account setting, or re-author the commits to the GitHub noreply
address. The second was chosen — it is strictly more private than what was asked for, and
it touches no account setting.

So `git filter-branch --env-filter` rewrote the author and committer email on every
commit, and every SHA in this repository changed. The seven SHAs cited across four
documents were remapped by commit subject and rewritten in place; the table above already
shows the new ones.

**This does not contradict the decision.** The argument against squashing was never "never
rewrite" — it is stated two paragraphs up as *do not rewrite to make the record tidier
than the work was.* This rewrite destroyed nothing: all 23 commits survive, with their
messages, their order, their contents, and their author's name. `8496bf9` and `59c69ce`
are still there, still unsquashed, still evidence.

What it does invalidate is the *practical* half of the argument — "squashing would break
live references". That was true when written and is now moot, because the references have
been repaired once already and the tooling to repair them exists. Anyone re-opening the
squash question should weigh the first two reasons only. They are the ones that were ever
load-bearing.

The timing mattered: this happened before the first push, when the only holder of those
SHAs was this repository and the only referents were four files in it. After a push it
would have been a different and worse decision.
