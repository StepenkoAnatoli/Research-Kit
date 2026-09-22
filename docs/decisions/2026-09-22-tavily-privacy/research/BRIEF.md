# Brief - what else Tavily says about query data, and what that corrects

- **Date:** 2026-09-22
- **Gate:** PASS - 0 blocking, 0 warnings, 15 passing, and it passes `--strict`
- **Corpus:** 8 captures, 9 ledger entries (the first is the registered prior), chain verifies
- **Collected by:** run `35773989749` (`collect job-0922p`), fetch `firecrawl-cli`

## Why this corpus exists

Not because a new question was asked. Because the same question, asked the same way, got a
different answer once the collector was fixed.

The same topic string was dispatched twice on 2026-09-22:

| run | queries | on `tavily.com` |
|---|---|---|
| `job-0922h` | the topic string, verbatim | **1 of 8** |
| `job-0922p` | two targeted queries, `prefer=tavily.com`, wider candidate pool | **6 of 8** |

The second run collected `tavily.com/privacy`. The first never saw it. **That document
narrows a claim the earlier brief made**, which is what this one is for.

## The correction

The 2026-09-22 Tavily brief says, of the Terms of Service:

> "There is no data opt-out and no tier that carries one."

**The scoped half is right and the general half is not.** Within the Terms that sentence is
accurate - `opt out` appears three times there and all three are arbitration. But it was
written as a statement about the vendor, from one of the vendor's documents, and the privacy
policy contains two routes it did not know about:

- **A GDPR objection.** *"If you are subject to the GDPR, and you object to this processing
  of your personal information to improve our services and believe you have an overriding
  interest, you can submit your objection via email to support@tavily.com."*
- **A deletion request.** Section 3 retains personal information *"until we receive a valid
  request to delete the information, in which case we will delete or anonymize the
  information after receiving the request"*.

Both are narrow - personal information, a claimed overriding interest, by email, at the
vendor's judgement. Neither is a product, a tier, or a setting.

## What did not change

**C-6 stands. The trigger is still unmet.**

The privacy policy confirms the practice rather than limiting it:

> "unless otherwise specified under the contract between you and us, we may use certain
> portions of your query data to improve our responses to future queries"

and adds a disclosure the Terms do not make at all:

> "we may also share your query data with third-party search index providers in limited
> situations where our own search index is unable to retrieve the requested content"

§6.5 and §6.7 of the Terms are unchanged, re-fetched here rather than assumed.

**Retention has no stated period.** Section 3 gives four open-ended conditions - "for as long
as you maintain an account with us" among them - and no number. That is not a short retention
and must not be read as one. It also means the comparison the earlier brief drew with
SerpAPI's 31 days has nothing to compare against on this side.

## What this run says about the kit, and what it does not

**It found the document.** That is the point, and it is a fact about the collector rather
than about Tavily.

**"Six of eight on tavily.com" measures the search fix, not relevance.** `prefer` ranks by
host, and a host is not a subject: four of those six are a partnerships page, two blog posts
and the home page, none of which says anything about query data. The fix put the right
documents in the corpus. It did not make the wrong ones relevant.

**The run cannot attribute its own improvement.** Three things changed at once - the
candidate pool became wider than the page budget so ranking could select at all, `prefer` was
supplied, and the topic string was replaced by two targeted queries. The prior registered
before collection said exactly this, and it remains the honest limit on what this corpus can
be used to argue.

## Known unknowns

- **Single witness, accepted, and unavoidable.** Both unknowns rest on documents published by
  AlphaAI Technologies. Two documents from one publisher is one witness; their agreement is
  internal consistency. No third party can establish that a vendor ships no no-training tier,
  because the absence of a product can only be read off the vendor's own pages.
- **Whether the GDPR objection is honoured in practice.** The document offers a route. What
  happens after the email is not something a document can answer.
- **Whether a negotiated contract changes any of this.** Both documents defer to one -
  "unless otherwise specified under the contract between you and us" - and no public page can
  say what such a contract would contain.

## Decision

**No change to C-6.** Tavily stays out of the search seam, on the reasoning it was excluded
for. One sentence in the 2026-09-22 Tavily brief is narrowed to the document it was true of,
and this corpus is cited beside it.

## Next steps

- None for Tavily. The trigger is re-read, not remembered, so the next occasion is the next
  time somebody proposes it.
- The general lesson is already shipped: a claim about a vendor needs the vendor's documents,
  plural, and the collector now makes finding them possible.
