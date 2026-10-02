# ADR-0122 — The collector refuses to spend on a broken chain

- **Date:** 2026-10-02
- **Status:** accepted
- **Area:** `lib/provenance.mjs` (`assertAppendable`, `chainProblems`), `lib/research-run.mjs`
  (the refusal before the first fetch), `lib/core.mjs` (`NAMED_RUN_REFUSALS`)
- **Refines:** the F12 residual rule, "never append onto a damaged chain"
- **Lifts the freeze (ADR-0117)** for one item: the `LEDGER_CHAIN_BROKEN` refusal.

## Context

`appendFetch` has refused to write onto a ledger it could not record into since the F12
residual: an unparsed line (`LEDGER_DAMAGED`) or a torn last line (`LEDGER_TORN_TAIL`) is
named with its repair before any entry is added, on the rule stated beside it: *never spend
before establishing that the result can be recorded*.

That rule had a hole the width of the chain itself. A ledger whose every line parses but
whose hashes no longer link - an entry edited after the fact, a line dropped, a `prev` that
points nowhere - passed both checks, so the collector fetched, paid, and appended `seq 4`
onto the break. `handoff` then refused the whole corpus as `handoff-chain-broken`, and
`preflight` failed `chain-intact`: the new fetch was as unusable as the old entries, and it
had cost credits. The arena break-test reproduced it twice (PR #198, F-1-2, 2026-10-02:
append at exit 0, then `handoff-chain-broken` at exit 1).

The refusals also ran at the record, after the first fetch: the F12 test pins "the adapter
ran once". The vendor-CLI and search-provider refusals in `runResearch` run earlier, "before
anything is spent", and that is where a ledger refusal belongs too.

## Decision

- `assertAppendable(root)` is the one function that establishes a ledger can be appended to:
  unparsed lines, a torn tail, and now **a broken chain** - `seq`, `prev` and `entrySha256`
  over the parsed entries, through `chainProblems`, which `verifyLedger` shares. A broken
  chain throws `LEDGER_CHAIN_BROKEN`, naming the first break by line and rule, how many
  more there are, and the remedy.
- `appendFetch` asks it under the lock, as before. `runResearch` asks it **before the first
  fetch**, beside the vendor-CLI and search-provider refusals, in a dry run too: a preview
  that says "this will collect" onto a chain that cannot record it is worse than no preview.
- The remedy is not a repair. The chain is tamper-evidence, and a kit that rewrote hashes to
  make a broken chain verify would be forging the evidence it exists to protect. The
  operator restores the ledger that verified (`git checkout -- research/raw/.fetches.jsonl`)
  or starts the corpus again.
- `LEDGER_CHAIN_BROKEN` joins `NAMED_RUN_REFUSALS`, so `research.mjs` prints it as a
  sentence with exit 2, as it prints the other three.

## Alternatives rejected

- **Leave it to handoff and preflight.** They refuse the corpus after the credits are spent;
  the rule is about spending.
- **Repair the chain** (recompute the hashes from the break onward). That is exactly the
  forgery the chain detects; a ledger the kit can mend is a ledger that proves nothing.
- **Refuse only at the record** (the state before this ADR, extended). The fetch is already
  paid for by then; the F12 test's "the adapter ran once" is the cost this ADR removes for a
  whole run.
- **Verify the captures' bodies before the run too.** `verifyLedger` reads every capture;
  that is preflight's job and its cost, and a body edited after the fact does not stop the
  chain recording a new entry. The chain's own links are what an append depends on.

## Consequences

- A run on a broken chain costs nothing and says why at once, in the same words `handoff`
  would have used later.
- A ledger damaged in any of the three ways is now refused by one function, so a fourth way
  has one place to go.
- The F12 "adapter ran once" test stands: `collectOne` is still refused at the record, which
  is where a caller that bypasses `runResearch` can still be stopped.
