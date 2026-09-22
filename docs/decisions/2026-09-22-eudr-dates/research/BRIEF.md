# Brief - when does the EUDR actually apply?

- **Date:** 2026-09-22
- **Gate:** PASS - 0 blocking, 0 warnings, 15 passing, and it passes `--strict`
- **Corpus:** 8 captures, 8 ledger entries, chain verifies
- **Collected by:** run `35723908266` via `bin/collect-remote.mjs`, search pinned to `firecrawl-cli`

## The answer

From the European Commission, which sets and publishes these dates:

| operator | applies from |
|---|---|
| large and medium operators | **30 December 2026** |
| micro and small operators | **30 June 2027** |
| micro and small operators **already covered by the EU Timber Regulation** | **30 December 2026** |

Application has been postponed **twice**: from 30 December 2024, then from 30 December 2025.

The third row is the part a summary loses. Being small is not sufficient for the later date
— an operator already inside EUTR scope is on the earlier one. Neither the prior registered
before this collection nor a general web search on the same question surfaced it. Only the
Commission page states it.

## What this exercise was actually testing

Not the EUDR. **Whether the kit produces research a builder could act on, in a domain it
knows nothing about** — chosen because every previous corpus here is about GitHub, Node, MCP
or the kit's own vendors, where the reviewer already knows enough to catch a bad answer.

A prior was registered in writing **before any collection**, so the corpus could contradict
it. It did.

> "30 December 2025 for large and medium operators, and 30 June 2026 for micro and small
> enterprises. Confidence: high."

**That is a year wrong on both dates.** The prior also said, correctly, that a second
postponement decided after May 2026 could not be known from memory. There was one. The
corpus supplied exactly the thing the reviewer could not have.

## The finding that matters more than the dates

**The first collection returned nothing relevant at all**, and the gate could not tell.

Run on the default search path, the same topic produced eight captures: SEC exempt
offerings, two CFPB regulations, federalregister.gov, California water boards, an SEC crypto
press release, regulations.gov, and an EU climate effort-sharing page. **Zero about
deforestation.** The search had matched the word "regulation" and returned US financial
regulators.

That corpus would have passed every structural check in the kit. It had eight captures, a
verifying hash chain, recorded transports, no partial grades. `preflight` had nothing to say
about it, because **no check asks whether the evidence is about the topic.** The only thing
standing between that corpus and a confident wrong brief was a human reading the URLs.

Isolated by re-running the identical query string through the other provider:

| search provider | candidates | on topic |
|---|---|---|
| SerpApi (the default, because a key is present) | 8 | **0** |
| Firecrawl | 17 | **17** |

> **Corrected the same day, and the correction matters.** Re-running the identical query
> hours later with both providers merged, SerpApi returned eight results of which **seven
> were shared with Firecrawl** — including the Commission page and the EY brief that answers
> the question. So the failure described above was a **bad run, not a property of the
> provider**, and this brief should not be read as establishing otherwise.
>
> What it does establish stands: a single provider can return nothing useful on a question
> another answers well. That is why the collector now asks both and interleaves by rank.

Not the query — a general web search on the same string returns the Commission, the European
Parliament press room, and the legislative train. Not the kit's code — both ran the same
path. The provider failed, and the auto-detect rule picks it.

## What the corpus is honest about

- **U-1 and U-3 rest on the Commission alone**, recorded as accepted single-witness
  judgements rather than papered over. On the dates an authority sets, a second party can
  only report.
- **Wikipedia is cited with a warning attached.** Its infobox strikes through both superseded
  dates, which is what establishes two postponements. Its **body text still asserts the old
  pair** — the exact dates the registered prior held. One page, current in its structured
  data and a year stale in its prose. It is cited for the sequence and for nothing else.
- **Five of eight captures are law-firm and vendor commentary.** They agree with the
  Commission and none of them is cited for a claim, because agreement with the authority is
  not independent confirmation of it.

## Limits

- **One collection, one provider, one day.** The dates have moved twice; nothing here
  predicts whether they move again, and the corpus would not know if they did.
- **No legal reading.** This is the date obligations begin, not advice about what they
  require of any particular operator.
- **The EUTR carve-out is quoted, not interpreted.** What counts as "already covered by the
  EU Timber Regulation" is a scope question this corpus did not ask.
