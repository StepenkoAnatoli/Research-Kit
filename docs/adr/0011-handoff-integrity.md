# ADR-0011 — The handoff is checked on the builder side, and it blocks there

- **Date:** 2026-09-14
- **Status:** accepted
- **Area:** collection, provenance, the two-machine seam

## Context

A corpus collected on one machine and built on another travels through **git**, and git
is not the collector. The pieces that prove the corpus is real are the least likely to
survive the trip: `research/raw/.fetches.jsonl` is a dotfile, and dotfiles are what
`.gitignore` rules, archive tools, sync clients, and a `git add research/raw` habit
quietly drop.

This repository already lost its ledger exactly that way, and `.gitignore` **predicted
it, in writing, and it happened anyway**:

```
# Deliberately NOT ignored: research/raw/.fetches.jsonl. The fetch ledger is the
# provenance chain - a repository that ships evidence without it cannot pass its own
# gate, which is exactly what happened when this project was uploaded without its
# dotfiles. If you copy this project by hand, copy research/raw/.* too.
```

`doctor` already failed that state on the collector (`ledger-missing`, naming the
remedy). What the two-machine model newly requires is a check that runs **where the
corpus arrives**, because the machine that arrives with a broken corpus is the one
machine that cannot fix it: a builder has no key and no Firecrawl egress, so "re-collect
the missing page" is not available to it. Its only honest options are to report the gap
and wait for the collector, or to produce a non-Firecrawl capture — the five-row defect
of ADR-0010.

## Decision

**`lib/handoff.mjs` owns the arrival question; `bin/handoff.mjs` is the builder's first
command; doctor treats the answer as a blocker on a builder.**

The question, in full, and nothing else:

1. **The ledger is present** (`research/raw/.fetches.jsonl`) and holds entries. A
   committed-but-empty ledger is its own failure: it proves nothing about the rows that
   cite it.
2. **Every capture an evidence row names is on disk.** Each missing path is named
   individually, with the evidence row that cites it — "some raw files are missing" is
   not a report a person can act on.
3. **The chain verifies**, using `lib/provenance.mjs`'s own verification: hashes
   recompute, `prev` links match, body hashes match.

The failure is loud and it names what is missing, and it carries exactly one remedy,
because one remedy exists:

> the collector must push `research/raw/` including its dotfiles — the ledger
> (`research/raw/.fetches.jsonl`) is evidence, not a byproduct. On the collector:
> `git add -f research/raw/` then push, and pull or re-clone here.

Severity is role-scoped (ADR-0010): on a **builder** every one of these problems is a
blocker, because the machine cannot repair it; on a **collector** the same states are
mid-collection work it can still close, and are already reported by name by
`raw-dangling`, `ledger-missing`, and `ledger-chain`. The handoff check therefore
reports nothing on a collector — one question, one reporter — and doctor's collector
output is unchanged by this ADR.

## Consequences

- The seam the two-machine model rests on has one owner, one name (`handoff-integrity`),
  and one remedy, and it is exercised by the machine that depends on it.
- `bin/handoff.mjs` is also the cheapest *pre-push* check on the collector (it is
  read-only and role-independent), so the collector can ask the same question before
  pushing the corpus rather than after a builder trips on it.
- Doctor's severity now differs by machine role for identical project state. That is
  intended and stated in the finding: the state is about whether *this machine* can
  repair it.
- No new contract check, so the preflight verdict's shape (11 checks) and the gate's
  behaviour are untouched: the gate already fails a corpus whose citations have no cached
  page behind them. This check is about the transport between machines, not about the
  research.
- Cost: the builder now has one more blocking condition. Accepted: a corpus that arrived
  incomplete cannot produce a trustworthy build, and failing before the build is the
  whole point of the kit.

## Alternatives considered

- **Trust git (and zips, and sync tools) to carry the dotfiles.** Rejected by the
  repository's own history. The ignore file predicted the failure and the failure still
  happened; a check that cannot fail is not a check.
- **Add it as a twelfth contract check in the registry (`lib/checks.mjs`).** Rejected.
  Registry checks are pure functions of a corpus snapshot (ADR-0004) and judge whether
  the *research* is sufficient to build from; "did this corpus travel intact to this
  machine" is a property of the transport and of the machine, not of the corpus. It would
  also make the verdict's shape depend on the machine, and the same commit would PASS on
  one box and FAIL on another for reasons the gate cannot explain.
- **Have the builder re-collect the missing captures from the URLs in the rows.**
  Rejected: the builder has no key and no egress, so the "re-collection" would be a
  non-Firecrawl capture written into the ledger — forging a corpus rather than reporting
  a gap, and repeating the exact defect this pair of ADRs exists to close.
- **Record a handoff receipt in machine state (entry count + tail hash) and fail when the
  ledger grows past it.** Rejected. It answers a different question ("was anything added
  here after arrival?") with a false-positive on every legitimate `git pull` of a corpus
  the collector grew, and a false negative whenever the receipt is stale or absent. The
  prevention is the CLI refusal (ADR-0010); a receipt would be a detector that mostly
  detects correct behaviour.
- **Copy the corpus out of band (scp/syncthing/a shared volume) instead of git.**
  Rejected as the primary transport: the two machines already share a repository, and a
  second transport adds a second set of failure modes to explain. It survives as a manual
  workaround, and the check now tells you when you need it.
