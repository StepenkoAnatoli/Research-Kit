# Brief - has Tavily's exclusion expired?

- **Date:** 2026-09-22
- **Gate:** PASS - 0 blocking, 0 warnings, 14 passing, and it passes `--strict`
- **Corpus:** 8 captures, 8 ledger entries, chain verifies
- **Collected by:** run `35742565450` (`collect job-0922h`), fetch `firecrawl-cli`, search merged

## Intent

The search/fetch seam excluded Tavily on 2026-09-19. The constraint is **C-6** in
`docs/requirements-2026-09-19-search-fetch-seam.md:55`, which cites **§6.5 and §6.7** of
Tavily's terms, and the same document wrote the expiry condition at line 136: **"Revisit if
a no-training tier ships."** The operator asked whether Tavily should replace SerpAPI. That
question cannot be answered by preference, because the exclusion was about terms - so the
terms were re-read before any key was wired.

## What we verified

**The trigger is not met. C-6 stands, unchanged.**

Tavily's Platform Terms, fetched today at status 200, still say the thing that caused the
exclusion - **in the same two sections, under the same numbering** C-6 cited three days ago.
§6.5 "Customer Input":

> "Tavily and its third-party artificial intelligence service providers may use, process,
> analyze, and retain Customer Input submitted to the AI Functionality and Outputs generated
> by the AI Functionality **for purposes of training, improving, developing, and enhancing
> artificial intelligence models**"

and §6.7 "Third-Party Service Providers", on who else sees it:

> "certain Third-Party Service Providers **may not be required to maintain the
> confidentiality** of any Customer Input or Output and may retain certain rights to use or
> disclose Customer Input and Output, including to further train their algorithmic models."

> **Narrowed 2026-09-22, later the same day.** What follows is true of the **Terms of
> Service**, and it was written as though it were true of the vendor. It is not.
>
> Tavily's **privacy policy** — which this collection never found, because the topic string
> was used verbatim as the single search query — carries a GDPR objection route for
> query-data processing and a deletion-request route. Neither is a no-training tier, so
> **C-6 stands and the trigger is still unmet**; the privacy policy in fact confirms the
> practice, saying query data may be used *"to improve our responses to future queries"* and
> may be shared with third-party search index providers.
>
> But *"there is no data opt-out"* was a claim about a **vendor**, drawn from one of its
> documents. Corrected in full, with the quotes, in
> [2026-09-22-tavily-privacy](../../2026-09-22-tavily-privacy/research/BRIEF.md).

**No no-training tier exists.** This finding is an absence, so it was counted rather than
skimmed. In the whole document: `opt out` appears **three times and every one is
arbitration** (a 30-day window to leave binding arbitration by written notice to an address
in New York). `enterprise` appears **zero** times. So do `zero data retention` and `no model
training`.

Why this matters more for a search provider than for most vendors: in this kit the query
string **is** the research subject. A provider that trains on inputs learns what is being
researched, before any result comes back.

## The prior, registered before collecting

> "I expect the exclusion to stand - the original reading is three days old. I do not know
> whether a no-training tier or a data opt-out exists; that is the part the corpus decides."

Both parts held. Unlike the EUDR run, the corpus did not overturn the prior - which is worth
saying plainly, because a protocol that only reports its surprises is advertising, not
measurement.

## What this run exposed about the kit

Three things, one of them a bug that is now fixed.

**1. The topic signal reported 0.92 on a corpus that was 1/8 relevant.** The run printed:

```
topic      0.92 best of 13 topic terms, 8 capture(s) >= 0.50
```

Eight of eight scored above the threshold. **One of eight was about Tavily.** The other
seven are generic industry writing about "zero data retention" - OpenAI's forum, an arXiv
paper, a GitHub discussion, three vendor glossaries. The cause is in the topic itself:
*data, retention, training, zero, enterprise, opt, out* are common words, so the search
matched the words and not the subject, and the signal then measured the same common words
back. `topicMatch` now documents this in the code: a high score is worth nothing unless the
topic carried distinctive terms. It remains a signal and decides nothing, which is the only
reason it did no damage here.

**2. A formatting bug, visible in the run log.** The summary ran two lines together:

```
spent      8 (budget consumed: collected + failed)topic      0.92 best of 13 topic terms...
```

A missing newline in `bin/research.mjs`. Fixed.

**3. The render-review instruction told reviewers to break the ledger.** `preflight`
warned that one capture prints 176 render-failure notices, and instructed:

> record what you checked in a `renderReview:` front-matter line

Following that literally was measured on this corpus: it turned a **1-warning PASS into a
blocking `provenance/body-unmodified` failure**, and left the warning standing, because
`verifyLedger` hashes the whole capture file including front-matter. The check's own source
comment said as much - the message contradicted the code above it. The note belongs in the
Finding cell of an EVIDENCE row, as `[render-reviewed: ...]`. The message now says that, says
not to edit the capture, and a test pins the wording.

## What the collection got right, unplanned

**SerpAPI timed out and the merge carried on.** The run log:

```
search:    serpapi - a SerpAPI key is configured - searching on its own meter AND with firecrawl-cli, merged by rank
  search failed on serpapi: spawnSync ... ETIMEDOUT
  searched   firecrawl-cli 8 -> 8 distinct
```

This is the merge seam from #66 taking a real provider failure in production and degrading
to one provider instead of collapsing. It was not the thing being tested.

One reporting wrinkle to note rather than fix: the summary then printed `searches 0 on
serpapi`, which is true but reads like "not used" rather than "attempted and failed". The
failure is visible in the body of the log, so nothing is hidden, but the summary line alone
would mislead.

## Contradictions and how they were resolved

None. Seven captures neither agree nor disagree with the one that matters - they are about a
different subject. They are marked off topic in EVIDENCE rather than deleted, because the
ledger records that the credits were spent.

## Known unknowns

- **The terms carry no effective date and no version string.** The only year anywhere in the
  document is the one this capture stamped on it. There is therefore no way to tell from the
  document whether it changed since 2026-09-19 - only that what it says today is what it
  said then. This is why C-6's trigger has to be a re-read and cannot be a memory.
- **This is the Platform Terms only.** The document explicitly excludes the marketing site
  and says an executed written agreement supersedes it. Whether a negotiated contract could
  carve out training is not something a public page can answer.
- **Single witness, accepted.** Both unknowns rest on tavily.com/terms alone, recorded as
  accepted judgements. A vendor's terms have one author, and the absence of a clause can only
  be established by reading the contract - no third party can testify that something is not
  there.

## Decision

**C-6 stands. Tavily is not wired in, and the question is closed until the terms change.**

This does not settle whether SerpAPI stays; it settles that Tavily is not the alternative.
A provider that trains on inputs is not the remedy for one that timed out.

The contrast is not "one vendor is nicer". It is a difference in kind, already on record in
the main corpus: SerpAPI's Privacy Policy §10 says search data "is retained for 31 days
after the search is completed" and is then deleted (E-10), and its no-training escape hatch
- ZeroTrace - exists but is Enterprise-only and therefore unavailable to us (SR-5). Tavily's
terms describe no deletion and no tier; they describe training. **Retention that expires is
recoverable. Training is not** - once a query is in a model's training set, no later change
of terms takes it back out.

## Next steps

- Leave C-6 as written; add a pointer to this corpus in
  `docs/requirements-2026-09-19-search-fetch-seam.md` as the first re-read of its trigger.
- If SerpAPI's reliability is to be decided, it needs its own evidence - the ETIMEDOUT here
  is one data point, and one run was already enough to produce a wrong conclusion once.
