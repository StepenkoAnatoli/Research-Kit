# Discovery Contract - what else does Tavily say about query data?

Started 2026-09-22.

## Build intent

This corpus exists because of how it was collected, not because a new question was asked.

On 2026-09-22 the same topic string was dispatched twice. The first run (`job-0922h`) used
the topic verbatim as its one search query and returned **one relevant capture of eight**.
The second (`job-0922p`) ran after the dispatched path was fixed - a candidate pool wider
than the page budget, so ranking could select at all; `prefer=tavily.com`; and two targeted
queries instead of the topic string - and returned **six of eight on the vendor domain**,
including `tavily.com/privacy`, which the first run never saw.

That document changes a claim the earlier brief made. Closing that is the point of this one.

**Prior, registered before collection** (seq 1 of this ledger): it expected the targeted
queries and `prefer` to raise the on-domain count sharply, and admitted the run could not
separate the three changes made at once. Both parts held, and the second is a real limit on
what this corpus can be used to argue.

## Unknowns

| ID | Unknown | Why it blocks the build | Status | Evidence |
|---|---|---|---|---|
| U-1 | Does any Tavily document offer a route to object to, or stop, the use of query data - as opposed to the arbitration opt-outs found in the Terms? | The 2026-09-22 Tavily brief states flatly that "there is no data opt-out". If that is wrong the brief is wrong, and a claim about a vendor made from one of its documents is a claim about the document | CLOSED | E-02: **two routes exist, neither of them a no-training tier.** (1) A GDPR objection: "If you are subject to the GDPR, and you object to this processing of your personal information to improve our services and believe you have an overriding interest, you can submit your objection via email to support@tavily.com". (2) A deletion request, in section 3: retention runs "until we receive a valid request to delete the information, in which case we will delete or anonymize the information after receiving the request". Both are narrow - personal information, a claimed overriding interest, by email - and neither disturbs the §6.5 training grant [single-witness: a vendor's own privacy policy has one author, and the presence of a clause can only be established by reading it] |
| U-2 | Is C-6's trigger - "revisit if a no-training tier ships" - met after reading the privacy policy as well as the terms? | C-6 excluded Tavily from the search seam. It reopens only on its own stated condition, and that condition must be tested against everything the vendor publishes, not the first document found | CLOSED | E-02, E-01: **no.** The privacy policy confirms the practice rather than limiting it - "unless otherwise specified under the contract between you and us, we may use certain portions of your query data to improve our responses to future queries" - and adds that "we may also share your query data with third-party search index providers". No tier, no product, no setting. Retention carries **no fixed period**: section 3 runs "for as long as you maintain an account with us" and three other open-ended conditions [single-witness: two documents, one publisher - which is one witness, not two. AlphaAI Technologies wrote both the terms and the privacy policy, so their agreement is internal consistency and not corroboration. No third party can establish that a vendor ships no no-training tier: the absence of a product can only be read off the vendor own pages, and a reseller or reviewer saying so would be reporting this same reading back] |

## Questions for the human (maximum 3)

1. None. C-6 stands; the earlier brief needs one sentence narrowed.

## Already decided

- C-6 itself, and the reasoning behind it.
- That the collection fix works. This corpus is evidence of it, not an argument for it - the
  argument is in the PR that measured 1-of-8 against 6-of-8.
