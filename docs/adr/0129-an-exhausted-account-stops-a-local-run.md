# ADR-0129: An exhausted account stops a local run; the fallback is opt-in

Date: 2026-10-02
Status: accepted. Supersedes the default of ADR-0086; its detection, switch and reporting stand.

## Context

ADR-0086 made a run switch to a free transport the moment Firecrawl reported its credits
exhausted, so a run that hit the wall still ended with pages to read. That was the right
answer for the question it was asked - an unattended run should finish - and it was made
the default for every run.

The operator's rule is different for a run with somebody behind it: when the credits run
out, the person decides whether to top up or to go on with the free transports. A keyless
capture is thinner on a JavaScript-rendered page, a browser capture is slower, and both are
graded accordingly by the gate; whether that trade is acceptable for this project is a
judgement, and the kit was making it on the operator's behalf. The signal that the choice
had been made was one log line in a run the operator may not have been watching.

## Decision

- **Without `--fallback`, a run that detects exhaustion stops.** The refused request stays
  a `fail` entry in the ledger as before, and is not charged or counted as a failed page.
  Every later search is not run and every later page is not attempted: they are reported
  as `uncollected`, with the reason, and never as failures. The result carries `stopped`
  (`reason`, `provider`, `during`, `uncollected`, `skippedSearches`), the failure log one
  `credits-exhausted` row with `action: "stopped"`, and the summary one `stopped` line.
- **The CLI then prints the decision and exits 2:** top up and run the same command, where
  the cache means only what is left is paid for; or run it with `--fallback`, where what is
  left is fetched through the browser or keyless transport, free, with the ledger naming
  the transport of each capture. Exit 2 says "not finished" to an agent that reads only
  the code.
- **`--fallback` opts into the ADR-0086 behaviour unchanged.** The unattended collectors
  (`collect.yml`, `live-collection.yml`) pass it, since nobody is there to decide.
  `--no-fallback` is still accepted and means the default, so a script that spells it does
  not break.
- **Detection no longer depends on a fallback being configured.** ADR-0086 only recognised
  exhaustion when it had somewhere to switch to; without one, every remaining page was
  tried and refused in turn. Now the first refusal is recognised either way.

This lifts the freeze (ADR-0117) for one flag, `--fallback`, because the choice it names
could not be expressed any other way: the former default had no spelling for "stop".

## Rejected

- **Keep the automatic switch as the default and document `--no-fallback`.** A default
  that spends a judgement the operator wanted to make is not fixed by a flag the operator
  has to remember on every run.
- **A machine config key choosing the behaviour.** A second place to look for why a run
  stopped or switched, and the one case that needs the switch - the hosted collector -
  already passes flags explicitly.
- **Stop the hosted collector too.** A dispatched run has no one to ask; stopping it
  turns a paid run into an artifact with nothing to read, which ADR-0033 refuses.
- **Keep trying each remaining page on the exhausted account.** Every attempt is a refused
  call that teaches nothing; the ledger keeps the one refusal that mattered.
