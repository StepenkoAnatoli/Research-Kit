# Discovery Contract - is `flag: 'wx'` actually exclusive?

Started 2026-09-22.

## Build intent

`lib/provenance.mjs` takes the collector's lock by creating a file with `flag: 'wx'`, and
ADR-0020 states the reason: "acquired with `O_EXCL` (`flag: 'wx'`) so the kernel refuses a
second creator instead of letting it overwrite". Every guarantee about the ledger not
interleaving rests on that being true.

"Done" is a yes or no a builder can act on, plus any condition under which it stops holding.

## Unknowns

| ID | Unknown | Why it blocks the build | Status | Evidence |
|---|---|---|---|---|
| U-1 | Does `'wx'` guarantee that exactly one of N concurrent creators succeeds? | If two can win, two collectors can hold the section at once and the hash-chained ledger can interleave - the one failure the chain cannot repair | CLOSED | E-01: yes, by construction - the exclusive flag "causes the operation to return an error if the path already exists". Confirmed by execution rather than by reading: 24 concurrent processes creating one path produced **1 winner and 23 `EEXIST`** on win32 / Node v24.20.0 [single-witness: the semantics of a POSIX open(2) flag as surfaced by Node. A second vendor can only restate it, and the claim that matters was settled by running it rather than by reading a second page] |
| U-2 | Is there any condition under which the exclusive flag does NOT hold? | A lock that silently stops being a lock on some filesystems is worse than no lock, because nothing would report it | CLOSED | E-01: **yes, and ADR-0020 does not mention it.** "The exclusive flag might not work with network file systems." E-02 carries the same caveat in older wording - "may or may not work with network file systems" - which is how the two were identified as one document at different vintages. Also POSIX-specific: on a symbolic link `O_EXCL` errors even when the link target does not exist |

## Questions for the human (maximum 3)

1. Does any deployment put a project directory on a network filesystem? The lock is sound
   locally and the documentation declines to promise it over NFS or SMB. Nothing in the kit
   currently detects that it is running on one.

## Already decided

- The lock design itself (ADR-0020). This asks only whether its stated premise holds.
