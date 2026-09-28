# ADR-0079 — A rewrite replaces the file whole, or not at all

- **Date:** 2026-09-28
- **Status:** accepted
- **Area:** `lib/core.mjs` (`writeText`, and so `writeJson`)

## Context

`writeText` called `fs.writeFileSync`, which opens with `'w'` and empties the target before
writing a byte. An outside break-test (2026-09-28) reported that a write cut short destroys
the file it replaces. Reproduced on `main`: a 6,300-byte file rewritten under a 4 KB
file-size limit became 4,096 bytes of the new text, and the original was gone.
`writeText` rewrites `EVIDENCE.md`, `MAP.md`, `plan.json` and the machine config. Several
of these hold review work nobody can regenerate. A full disk, a quota, a killed process or
a cancelled CI job are all enough.

## Decision

The text goes to a scratch file beside the target, and the scratch file is renamed over
the target. On one filesystem, rename replaces the file in a single step.

- The scratch file is a dotfile (`.<name>.tmp-<pid>-<random>`), so a leftover is never
  read as a capture. It is removed on any failure.
- The replaced file's mode is kept, so a `0600` config stays `0600`.
- A symlinked target is resolved, and the write goes to the file the link names. The link
  itself stays in place. A dangling link is written directly, as before.

## Rejected alternatives

- **A dependency such as `write-file-atomic`.** The kit has no dependencies on purpose.
  The mechanism is the same rename.
- **`fsync` the file and its directory before and after the rename.** That protects against
  power loss, not against the failures actually seen. The ledger's torn-tail repair already
  covers a lost last line. It can be added if power loss is ever reported.
- **Keep the in-place write and back up first, as `brief --force` does.** Every caller
  would need its own backup, and a backup written the same way can fail the same way.

## Consequences

- A file's inode changes on every rewrite. That breaks hard links, which nothing here uses.
- On Windows the rename is `MoveFileEx(REPLACE_EXISTING)`. A target another process holds
  open can refuse it, and CI's `windows-latest` job exercises this path.

## Trigger that would reopen this

A reported failure of the rename on Windows, or a power-loss report.
