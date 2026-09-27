# ADR-0070 — The line-ending remedy runs in Windows shells

- **Date:** 2026-09-27
- **Status:** accepted
- **Area:** `lib/handoff.mjs` (`lineEndingRemedy`, `PIN_LINES`)
- **Refines:** ADR-0062 (the command sequence stands; how it is printed changes)

## Context

The line-ending remedy is for a Windows checkout (`core.autocrlf=true`). Reviewing ADR-0062
the same day, two of its printed lines would not run where they are needed. The pin step
was `printf "..." >> .gitattributes`, and `printf` exists in neither cmd nor PowerShell. The
`git rm --cached ... # the index entry only` lines carried trailing comments, which are
comments in PowerShell and sh but become extra file names in cmd. ADR-0062's test executed
the lines through Node, not a shell, so it could not see either problem.

## Decision

Every indented command line is a plain `git ...` command with no comment. The explanation
moves into the prose around the commands. The pin is given as two lines to add to
`.gitattributes` in any editor (`PIN_LINES`), followed by `git add .gitattributes`. A test
asserts that every printed command starts with `git ` and contains no `#`, and the
execution test applies `PIN_LINES` itself.

## Rejected alternatives

- **`echo ... >> .gitattributes`.** PowerShell 5.1 writes UTF-16 by default, and git would
  not read the pin from a UTF-16 `.gitattributes`.
- **Print three variants, for cmd, PowerShell and sh.** Three blocks of commands for one
  fix is how a reader runs the wrong one. Plain git commands are the same in all three.

## Trigger that would reopen this

A remedy step that git alone cannot express.
