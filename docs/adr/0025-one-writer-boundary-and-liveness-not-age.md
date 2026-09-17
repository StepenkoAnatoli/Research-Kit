# ADR-0025 — One writer boundary for a collection, and liveness rather than age

- **Date:** 2026-09-17
- **Status:** accepted
- **Area:** the collector, the exclusive section
- **Refines:** [ADR-0020](0020-five-trusted-boundaries-that-did-not-hold.md)'s "one lock, one flag" — the `O_EXCL` acquisition stands; its SCOPE and its staleness rule do not

## Context

ADR-0020 put every writer of the fetch chain under one `O_EXCL` lock. That was right, and it
was too small. The 2026-09-16 review found both halves.

**F14 — the lock covered the ledger and nothing else.** `collectOne` wrote a capture,
allocated an `E-##` from an in-memory list, appended to the chain, appended an evidence row
and upserted a source row. Only the chain append was inside the section. Two collectors — an
agent run and an operator run, cron beside interactive, which the kit's own documents call
routine — could choose the same capture filename, allocate the same `E-##`, or lose each
other's row because both read a table before either wrote it. The chain stayed provably
intact while the corpus around it silently lost data. Phase 0 made it worse: `decompose`
called `collectOne` without even the run-level lock `research-run` had.

Worse in cost terms: a run read its capture index once and then collected for minutes, so a
page another collector finished in the meantime was fetched again and **paid for again**.

**F13 — staleness was judged by age.** A lock older than ten minutes was declared stale and
broken, even with its owner still running; `runResearch` legitimately holds the section across
many slow requests, so the eviction hit the correct holder. Conversely a holder the code could
not identify never reached the age check at all, so an abandoned stub timed out instead of
being recovered — wrong in both directions at once.

## Decision

**One boundary around the whole durable operation, and liveness as the staleness test.**

### The boundary

`collectOne` runs inside `withLock` for its entire length: the cache decision, the adapter
call, the capture write, the id allocation, the ledger append and both row updates. The nested
`appendFetch` reuses the section reentrantly, as it already could.

- **The cache is re-read inside the section.** A caller's snapshot may be minutes old by the
  time it reaches the front of the queue; the freshness decision is made from disk, under the
  lock, so a URL somebody else just collected is a hit rather than a second paid fetch.
- **Ids are allocated from the table on disk**, not from the caller's in-memory list.
- **A dry run takes no lock**, because it decides and writes nothing.

### The staleness test

`lockRecoverable(file, holder)` asks whether the holder still **exists**:

| holder | answer |
|---|---|
| same host, pid alive | **never** recoverable, at any age |
| same host, pid gone | recoverable at once |
| another hostname | not recoverable until 15 minutes — we cannot ask, so we wait |
| no pid at all (a stub) | recoverable after 30 seconds |

A run that takes an hour is a long run, not a crash, and `kill(pid, 0)` says so exactly. The
timeout message names which of those four it is, so an operator knows whether to wait or to
delete the file.

**Deliberately not a renewed lease.** A lease with a heartbeat was implemented first and
removed: the collector is synchronous — the adapter is a `spawnSync` — so the event loop is
blocked for exactly the stretch a renewal timer would need to fire. The lease expired
precisely during the slow fetch it existed to protect. A heartbeat that cannot beat when it
matters is worse than no heartbeat, because it looks like a guarantee.

### And the append that could not be recorded

`appendFetch` validates the ledger **before** it writes (the review's F12 remedy): unparsed
lines, or a file that does not end in a newline, are refused with `LEDGER_TORN_TAIL` /
`LEDGER_DAMAGED` and the repair command. Appending a valid entry onto an unfinished line welds
the two together — the combined line then ends in a newline, so `repairLedgerTail` will not
touch it, and the paid-for fetch it recorded is unrecoverable. Never spend before establishing
that the result can be recorded.

## Consequences

- Two collectors on one project serialise, and the losing one waits rather than interleaving.
  The kit's own suite runs two real processes at it to prove it.
- The section is now held across a network call, so a genuinely wedged collector holds it
  until it dies. That is the trade: a held lock is visible, diagnosable and recoverable (the
  file names the pid), while interleaved writes were silent and unrecoverable.
- `LOCK_WAIT_MS` rises to 120s, because waiting is now the normal outcome of contention rather
  than a symptom.
- The kit reads `os.hostname()` for the first time. It is used only to decide whether a pid is
  answerable, and never trusted for anything else.
- A corpus on a shared network filesystem gets the 15-minute bound and a worse experience.
  That is stated rather than designed for: this is a local tool.

## Rejected alternatives

- **Keep the ledger-only lock and add a second lock for the tables.** Two locks in one
  operation is a deadlock waiting for an ordering bug, and it still leaves the window between
  them.
- **Make the operation idempotent instead of exclusive** (content-addressed capture names,
  derived ids). Attractive, and it does not solve the ledger's `seq`/`prev` read-modify-write,
  which is inherently serial. It would also change every capture filename in every existing
  corpus.
- **A shorter lease with a worker-thread heartbeat.** Would work, and it buys a faster
  recovery for a crashed holder at the cost of a thread, a second failure mode, and a
  mechanism whose correctness depends on the collector never blocking. `kill(pid, 0)` is one
  syscall and cannot drift.
- **Advisory `flock`.** Not portable in the way this kit needs (Windows is a first-class host
  here), and `O_EXCL` on a named file is already the kernel's answer.
- **Keep age-based staleness with a longer timeout.** The review's own words: age cannot be
  made correct by tuning, because the race is in the shape and not the number.
