# architecture-history

Material that used to live in [`../ARCHITECTURE.md`](../ARCHITECTURE.md) and is kept here
instead.

## What this directory is for

`ARCHITECTURE.md` answers **"where does this behaviour live, and who owns it?"** A reader
with that question should not have to walk through the story of a defect that was fixed
three weeks ago to reach the answer.

But the stories are worth keeping. This project's unusual value is that its decisions are
traceable — a benchmark that set a threshold, a race that forced a redesign, an
alternative that was tried and rejected. Deleting that to shorten a file would trade
something rare for something merely tidy.

So: the map states what holds, and links here for why.

## Retention policy

**Nothing here is edited after it is written.** These are records. If one turns out to be
wrong, the correction goes in the map or in a newer dated note that says what it
supersedes — a record that is quietly revised stops being a record. One file here already
preserves a known error for exactly that reason, flagged at the top of it.

**This is the last resort, not the first.** Most historical material already has a better
home, and belongs there instead:

| Kind of record | Where it goes |
|---|---|
| A decision, and the alternatives rejected | [`../adr/`](../adr/) |
| What a build session did, dated | `../build-report-<date>-*.md` |
| What a verification run found, dated | `../validation-<date>-*.md` |
| A review of the architecture, dated | `../architecture-review-<date>*.md` |
| Narrative with no existing home | here |

Create a file here only when the material fits nowhere above. Two files exist.

## Contents

| File | What it holds |
|---|---|
| [2026-09-20-shape-and-defect-narratives.md](2026-09-20-shape-and-defect-narratives.md) | The *"Current shape, for the record"* section, verbatim: the shell-safety cost, the quadratic staged-path benchmark, the `O_EXCL` race, the async-test false green, the unreadable-posture collapse, the CRLF corpus rewrite, and the extractor split. Contains one preserved error. |
| [2026-09-20-tooling-quirks.md](2026-09-20-tooling-quirks.md) | Observed behaviour of external tools that no check can catch. Currently one entry. |
