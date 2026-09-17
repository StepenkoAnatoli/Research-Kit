# Brief - The research kit's own protocol: metered primary-source collection, provenance, and gate

_Auto-drafted 2026-09-14 by `bin/brief.mjs` from the corpus. Sections marked **TODO**
require human/agent judgement; everything else is assembled from evidence already
in `research/`._

**This is the phase-1 to phase-2 handoff.** Phase 1 (research) is complete: the gate
in `research/DISCOVERY.md` passes, and every claim below traces to a cached page
in `research/raw/`. Phase 2 (build) starts here.

Whoever you are — another agent, a different model, or a person — read this file
first. You should not need to re-research anything to start work. If something
here is not enough to build from, say which fact is missing rather than guessing
it: that is a phase-1 gap to close, not a phase-2 judgment call.

## Intent

A research-first kit for this machine: a collector that turns a Firecrawl fetch into
cached, citable evidence, and a gate that refuses to let a build start while a blocking
fact is unproven. "Done" means an agent asked to build something can no longer answer
*insufficient information* and stop — it either produces primary-source evidence, or
names the one fact it could not reach and records the day-one step that would settle it.

The reason this file exists at all: this repository is the kit's own development home, so
it inherits its own gate. A gate that exempts the project it ships with is a gate nobody
should trust, so this contract is real rather than waived.

## What we verified

| Claim | Source | Type |
|---|---|---|
| Free plan: 10 /scrape and 10 /search requests per minute, 2 concurrent browsers, 50,000 max queued jobs. Rate limits are per team, not per key. Keyless access is capped per IP per day and returns 429 when exceeded; a free API key includes 1,000 credits. | E-01 `docs.firecrawl.dev` | P |
| The /doctor setup checkup stays typable when disableBundledSkills is on, in Claude Code v2.1.205 and later. | E-04 `code.claude.com` | P |
| Exit 2 means a blocking error. | E-05 `code.claude.com` | P |
| By registering and using the Services, you represent and warrant you: (i) have the authority and capacity to enter this Agreement; (ii) are at least 18 years old, or 13 years or older and have the express permission of… | E-06 `firecrawl.dev` | P |

## Contradictions and how they were resolved

**TODO** — review the primary sources above for disagreements (pricing pages vs
billing docs, docs vs issue trackers, version-dependent behaviour). Record both
sides and state which you trust and why. Two independent sources agree unless
noted here.

## Known unknowns

None. Every blocking unknown was closed with primary-source evidence.

## Decision

**TODO** — what to build first, and what is explicitly out of scope. State the
first build step concretely enough that the builder can start from this file
alone.

## Next steps

1. Review the **TODO** sections above (Contradictions, Decision) before handing off.
2. Hand this file to the builder (phase 2). Re-running `node bin/brief.mjs`
   after edits will refuse without `--force` so your judgements are preserved.

