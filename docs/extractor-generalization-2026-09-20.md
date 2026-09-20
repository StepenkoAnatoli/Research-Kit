# Extractor generalization probe — 2026-09-20

The ranking rules were written against four vendors that were already in this project's
corpus: Firecrawl, SerpApi, Tavily, and two SERP resellers. Rules written against the
pages you tested them on will always look good on those pages. This is what happens on
ten vendors they have never seen.

**The captures are deliberately NOT in `research/raw/`.** They are not evidence for any
unknown this project holds, and adding them to a hash-chained ledger whose purpose is to
prove the corpus answers *its own* questions would be corpus pollution. They were fetched
to a scratch directory outside the repository and are not committed; this record is the
artifact.

## Method

Ten pricing / limits / terms pages, chosen for **structural** variety rather than more
search APIs — a page that differs only in vendor name tests nothing:

| vendor | what it stresses |
|---|---|
| Exa | search API, docs-site pricing table |
| Brave | marketing page with a plan grid |
| Resend | email API — different domain, per-message metering |
| OpenAI | token metering — a unit the rules have never seen |
| Cloudflare R2 | storage + egress — two-dimensional metering |
| Stripe | percentage-of-transaction, not a count |
| Algolia | quota model with overage |
| Twilio | per-message, region-scoped |
| Deepgram | per-minute-of-audio, an unusual unit |
| GitHub | rate limits in prose, docs site |

All ten fetched at `completeness=full` through the metered transport. Each was run through
`findingWithContext` and the pick graded by hand against the question a researcher would
actually be asking the page.

## Result: 5 good, 2 weak, 3 bad

| vendor | score | verdict | pick |
|---|---:|---|---|
| GitHub | 15 | **good** | "The primary rate limit for unauthenticated requests is 60 requests per hour." |
| Cloudflare | 17 | **good** | the GB-month proration rule — the actual metering formula |
| Exa | 17 | **good** | "Prices are quoted per 1,000 requests, so a $7 / 1k rate is $0.007 per call." |
| Algolia | 14 | **good** | "10,000 requests/mo included then $0.60 per additional 1K requests" |
| Deepgram | 17 | **good** | overage billed at plan rate plus a 10% premium (from an FAQ) |
| OpenAI | 12 | weak | "$0.05 per minute / $0.00083 per second" — a price with no subject |
| Twilio | 15 | weak | a phone-number rental comparison row, not the SMS rate |
| Brave | 7 | **bad** | "Brave's index includes over 30 billion pages…" — a capability boast |
| Resend | 10 | **bad** | "Free: 100, Pro: No limit, Scale: No limit…" — a comparison row |
| Stripe | 8 | **bad** | "Set and manage prices in multiple currencies…" — feature copy |

The three new rules added on 2026-09-20 all earned their place on unseen pages:
`metering-rule` chose Cloudflare's proration formula and Deepgram's overage clause,
`answers-a-question` found the Deepgram FAQ, and `evidence-heading` carried GitHub. The
generalization is real, not an artifact of the corpus they were written against.

## Causes, classified before any weight was touched

The standing rule: **when two rules conflict on the same text, or a pick is wrong,
investigate the model before the weights.** Every failure here turned out to be a
classification or representation defect. None was a tuning problem, and none was fixed by
changing a number.

### A — the comparison-row detector cannot represent a multi-word cell

`COMPARISON_ROW` requires `:\s*\S+[,;]` — a **single token** before the separator. Real
rows carry phrases:

```
detected   Plan: Starter$25 / month, Searches / month: 1,000, Price / month: $25
MISSED     Free: 100, Pro: No limit, Scale: No limit, Enterprise: No limit
MISSED     Phone number type: Long codes A 10-digit number, Twilio leased Cost…: $1.15
```

`No limit` has a space, so the pattern cannot see it. **Two of the three bad picks and one
of the two weak ones come from this one regex being unable to describe the shape it
exists to describe.** Accounts for Resend and Twilio.

### B — the price rule cannot see two of the ways money is written

`price` matches `[$€£]\s?\d`. Stripe states its rate as **`2.9% + 30¢ per successful
card charge`** — the page carries `2.9%` three times and `30¢` eight times, and
`per successful` fifteen times. The claim is right there and the model has no symbol for
it: `¢` is not in the currency set, and a percentage-of-transaction fee is a pricing
*form* the rules only know as a bare `percentage`. Accounts for Stripe.

### C — heading context is one string, not a stack

The extractor remembers the **last heading seen**, at any level. Pages nest:

```
## Plans
### Search
#### Capacity        <- the pricing lives here
```

By the time a line under `#### Capacity` is scored, `Plans` — the word that would have
fired `evidence-heading` — has been overwritten twice. A section's context survives
exactly as long as no subheading appears inside it, which on a marketing page is never.
Contributes to Brave and OpenAI.

### D — the heading taxonomy has a neutral middle that is not neutral

Headings are classified as evidence-bearing, chrome, or nothing. "Key features",
"Special features", "Build with the power of the web" fall into *nothing*, so a capability
boast under them competes on equal terms with a rate limit. That middle class is where
marketing copy lives, and treating it as unclassified is a modelling choice that was never
made deliberately. Accounts for Brave, contributes to Stripe.

## After the model fixes: 7 good, 2 weak, 1 bad

Four representation fixes, **no weight changed**:

| defect | fix |
|---|---|
| A — comparison row can't represent phrase cells | count the `name: value` pairs the table reader itself made, rather than matching a repetition pattern that has now been wrong twice |
| B — money only visible as a leading `$` | also `30¢`, `2.9% +`, and `per successful transaction` |
| C — heading is last-seen, not ancestry | keep a stack; the heading rules test the whole path |
| D — marketing headings were unclassified | "Key features", "Why choose", "Build with", "Use cases", "How it works" are chrome |

| vendor | before | after |
|---|---|---|
| Resend | **bad** — a comparison row | **good** — "Resend automatically charges your plan's overage rate for each additional bucket" |
| Twilio | weak — phone-rental row | **good** — "All MMS-enabled Short Codes have a $500 one-time fee charged at time of purchase." |
| Brave | **bad** — "index includes over 30 billion pages" | weak — "+ $5 per million input/output tokens" |
| the other seven | unchanged | unchanged |

### One fix was tried, measured, and reverted the same hour

Defect E — a claim split across two lines. Stripe writes `**2.9% + 30¢**` and then
`per successful transaction for domestic cards` beneath it: the rate is ten characters and
falls under the minimum length, the subject carries no digit, and neither line can win
alone. Joining adjacent lines into a paragraph candidate recovers it.

It made things **worse**, and only measuring showed that. On a marketing page adjacent
lines are list items rather than continuations, so the same join produced collages:

```
Algolia before:  10,000 requests/mo included then $0.60 per additional 1K requests
Algolia after:   NeuralSearch AI Collections Smart Groups Real-time personalization
                 99.99% availability Access to SSO and enhanced SLA
```

A blob of feature bullets scores well on `number`, `percentage` and `full-sentence` and
says nothing. Reverted, with the reasoning kept in the code and a test pinning that
paragraphs are not candidates — so the idea is not re-tried blind.

**The idea is not wrong; the representation is.** Recovering a split claim requires
telling a continuation from a list item, and line adjacency does not carry that
distinction. Stripe is still the one bad pick, and it stays bad rather than being fixed
by something that costs two good ones.

## What this does not say

Seven good picks out of ten unseen vendors is **not** a success rate to be proud of, and it
is not one to panic over either — the output is a suggestion beside a human-written
Finding, and a wrong suggestion costs a line of output. The number worth tracking is not
this one; it is whether reviewers read the suggestion at all, which no amount of offline
probing can answer.

What the probe *does* establish is that the failures are structural and nameable. Four
defects explain all five imperfect picks, every one of them a thing the model cannot
represent rather than a thing it weighs wrongly. That was the hypothesis the standing rule
predicts, and it held.
