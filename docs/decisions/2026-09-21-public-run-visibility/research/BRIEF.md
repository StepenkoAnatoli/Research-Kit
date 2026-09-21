# Brief - who can view GitHub Actions workflow run logs and download artifacts on a public repository permissions

_Auto-drafted 2026-09-21 by `bin/brief.mjs` from the corpus. Sections marked **TODO**
require human/agent judgement; everything else is assembled from evidence already
in `research/`. While a **TODO** remains, this brief is **not reviewed** and the
handoff is **not approved** - a structurally valid corpus, a reviewed one, and an
approved handoff are three different states._

**This is the phase-1 to phase-2 handoff.** **Gate: PASS.** Every blocking unknown is closed with evidence, and every claim below
traces to a cached page in `research/raw/`.

Whoever you are - another agent, a different model, or a person - read this file
first. You should not need to re-research anything to start work. If something
here is not enough to build from, say which fact is missing rather than guessing
it: that is a phase-1 gap to close, not a phase-2 judgment call.

## Intent

ADR-0035 measured what an **anonymous** caller can read of a workflow run on this public
repository, and closed with a section titled "What is NOT measured, and is therefore not
claimed": what a **signed-in** user sees in the web UI, which is a different surface from
the REST API.

That gap is load-bearing. The collector's logs echo the dispatched topic in an `env:`
group, and the artifact *is* the corpus - every collected page. If a signed-in stranger can
read either, then keeping the topic out of run and artifact names reduces incidental
exposure and nothing more.

"Done" is a rule an operator can apply before dispatching: who can read the shape, who can
read the contents, and what that means for a subject worth protecting.

## What we verified

| Claim | Source | Type |
|---|---|---|
| **The answer ADR-0035 parked, and it is the less comfortable one.** Two sentences settle it. First, the floor: "You must be logged in to a GitHub account to view workflow run information, **including for public repositories**" - which is why an anonymous probe saw so little, and why that measurement was never the whole picture. Second, the ceiling, stated three times on the page, once for each action: viewing logs to diagnose failures, searching logs, and downloading them are each followed by "**Read access to the repository is required to perform these steps.**" And the download sentence bundles both kinds of content together: "You can download the log files from your workflow run. You can also download a workflow's artifacts." **On a public repository, read access is universal.** So any person with a free GitHub account can open the run, read the logs - which echo the dispatched topic in the `env:` group the runner prints - search them, and download the artifact, which is the entire collected corpus. The `401` and `403` that ADR-0035 measured are refusals of ANONYMITY, not of strangers. | E-03 `docs.github.com` | P |
| **The answer ADR-0035 parked, and it is the less comfortable one.** Two sentences settle it. First, the floor: "You must be logged in to a GitHub account to view workflow run information, **including for public repositories**" - which is why an anonymous probe saw so little, and why that measurement was never the whole picture. Second, the ceiling, stated three times on the page, once for each action: viewing logs to diagnose failures, searching logs, and downloading them are each followed by "**Read access to the repository is required to perform these steps.**" And the download sentence bundles both kinds of content together: "You can download the log files from your workflow run. You can also download a workflow's artifacts." **On a public repository, read access is universal.** So any person with a free GitHub account can open the run, read the logs - which echo the dispatched topic in the `env:` group the runner prints - search them, and download the artifact, which is the entire collected corpus. The `401` and `403` that ADR-0035 measured are refusals of ANONYMITY, not of strangers. | E-03 `docs.github.com` | P |
| **The answer ADR-0035 parked, and it is the less comfortable one.** Two sentences settle it. First, the floor: "You must be logged in to a GitHub account to view workflow run information, **including for public repositories**" - which is why an anonymous probe saw so little, and why that measurement was never the whole picture. Second, the ceiling, stated three times on the page, once for each action: viewing logs to diagnose failures, searching logs, and downloading them are each followed by "**Read access to the repository is required to perform these steps.**" And the download sentence bundles both kinds of content together: "You can download the log files from your workflow run. You can also download a workflow's artifacts." **On a public repository, read access is universal.** So any person with a free GitHub account can open the run, read the logs - which echo the dispatched topic in the `env:` group the runner prints - search them, and download the artifact, which is the entire collected corpus. The `401` and `403` that ADR-0035 measured are refusals of ANONYMITY, not of strangers. | E-03 `docs.github.com` | P |
| **The exposure window can be shortened per artifact, and only downward.** `actions/upload-artifact` takes `retention-days`, shown with a five-day example, and "The `retention-days` value cannot exceed the retention limit set by the repository, organization, or enterprise." So a collector can bound how long its corpus stays fetchable without touching repository settings - but it cannot extend it, and it cannot make it zero. Shortening is the only control this page offers over the window; it offers none over who may open it. | E-02 `docs.github.com` | P |

## Contradictions and how they were resolved

**None between the sources - and one with a conclusion this project published earlier the
same day.**

The three pages agree with each other, and with the delivery-architecture corpus on
retention. There is no disagreement between them to resolve.

The disagreement is with ADR-0035. It measured an **anonymous** caller against a real run,
found artifact download refused `401` and job logs refused `403`, and concluded that a
stranger learns the shape of a run and not its subject. It then said, correctly and in a
section of its own, that what a **signed-in** user sees was not measured and was therefore
not claimed.

E-03 answers that. "You must be logged in to a GitHub account to view workflow run
information, including for public repositories" - and viewing, searching and downloading
logs, and downloading artifacts, each require only "read access to the repository".

So the `401` and `403` were refusals of **anonymity**, not of strangers. Resolved in
favour of E-03 with no tension: the measurement was accurate about what it measured, and
the population it measured is not the population that matters.

## Known unknowns

None. Every blocking unknown was closed with primary-source evidence.

## Decision

**Do not research a sensitive subject on a public repository. The naming rules do not
protect it, and nothing else here does either.**

The exposure, precisely:

| who | can read |
|---|---|
| nobody, anonymously | run metadata, step names, timings, artifact *listing* (measured, ADR-0035) |
| **any signed-in GitHub account** | **the logs, which echo the topic, and the artifact, which is the whole corpus** (E-03) |

A free account is the only barrier, and it is not one.

**What follows:**

1. **Keep the naming rules, and scope them honestly.** They still do what they do - they
   protect against listing-scrapers and anyone reading over a shoulder - and they do not
   protect against a reader who opens the run. ADR-0035 promoted them to "the primary
   control"; this demotes them to "the control that covers the anonymous surface".

2. **Set `retention-days` on the artifact upload.** Per E-02 it is settable per artifact
   and cannot exceed the repository limit. It bounds the window and removes nothing, which
   is worth having and worth not overstating. A short default costs only that a corpus must
   be fetched sooner, and the agent path fetches within minutes.

3. **Leave the "stays public" decision standing.** It was made on plan grounds, not privacy
   grounds: on a free plan a private repository has its environment secrets and variables
   ignored, so going private breaks the collector rather than protecting it. That reasoning
   is untouched. What changes is the caveat - from "the exposure is limited to shape" to
   "the exposure is total to anyone with an account, and the remedy is a paid plan rather
   than a toggle".

**Out of scope:** making a public run private. There is no such setting. The choice is the
subject you dispatch, or the plan you are on.

## Next steps

1. Review the **TODO** sections above (Contradictions, Decision) before handing off.
2. Hand this file to the builder (phase 2). Re-running `node bin/brief.mjs`
   after edits will refuse without `--force` so your judgements are preserved.
