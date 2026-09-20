# Tooling quirks — observed, not checkable

Behaviour of external tools that cost this project time once and that **no check can
catch**. Moved out of `ARCHITECTURE.md` on 2026-09-20: a map of this repository's code is
the wrong place to document someone else's CLI.

Each entry is one observation, not a rule. Nothing detects these, and nothing should —
they are written down so the next person does not rediscover them the slow way.

---

## `gh pr edit` can silently drop the edit

`gh pr edit` on this repository exits 0 while a GraphQL deprecation warning
("Projects (classic) is being deprecated") silently drops the mutation: title and body
changes are lost, and nothing in the command's output says so.

Use instead:

```bash
gh api -X PATCH repos/<owner>/<repo>/pulls/<n> -F title=… -F body=@file
```

Found on 2026-09-15 by re-reading the PR state afterwards, not by any signal the tool
gave. The general lesson is the one worth carrying: **exit 0 from a tool that warns is not
confirmation the write happened.** Read the state back.
