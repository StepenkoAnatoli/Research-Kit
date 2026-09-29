# ADR-0096 — On a shared host, the owner is the account

- **Date:** 2026-09-29
- **Status:** accepted
- **Area:** `lib/decompose.mjs` (`ownerOf`, `docsHosts`, `scrapeOrder`)
- **Amends:** ADR-0094 (phase 0 scrapes likely owners first)

## Context

`docsHosts` ranks the hosts a topic's searches keep pointing at, and since ADR-0094
`decompose --max-scrapes` spends its budget on the top hosts first. It counted by host.

On MoonAliza's context-overflow map (2026-09-29), `github.com` scored 7 across five unrelated
accounts:
- a stranger's router project;
- another tool's issue thread;
- a changelog;
- two issues in other projects.

That made github.com the "likely owner". All three phase-0 scrapes went there. The owner's
documentation host, `docs.ollama.com` (4), got none.

ADR-0044 met the same fact for `prefer`: `prefer: github.com` gave every GitHub page the
owner's bonus. So `prefer` learned to accept a host with a path.

## Decision

- **`ownerOf(url)`:** on a shared host the owner is the host plus the account, the first path
  segment (`github.com/ollama`). Everywhere else it is the host.
  - `orgs/` and `users/` are skipped, so the account is the segment after them.
  - The host's own sections (`topics`, `marketplace`, `features` and similar) belong to the
    host. The same day's secret-masking map had ranked "github.com/orgs" as an owner.
- **The shared hosts (`SHARED_HOSTS`):**
  - code hosts: github.com, gitlab.com, bitbucket.org, codeberg.org,
    raw.githubusercontent.com, gist.github.com;
  - huggingface.co;
  - the two blog platforms seen in real maps, medium.com and dev.to.
- **Who uses it:** `docsHosts` counts by `ownerOf`, `scrapeOrder` looks pages up by it, and
  the map lists owners in that form.
- **Unchanged:** the weights, the relevance floor, the budget, and the candidate list's
  search order.

## Rejected alternatives

- **Drop shared hosts from the ranking.** A project's own repository (github.com/ollama) is
  often the owner of the fact. Excluding the host would lose it along with the strangers.
- **Two path segments (account and repository).** A project's issues, source and releases
  would then split into separate owners. For telling owners apart, the account is the unit.
- **Infer shared hosts from the results** (many first segments on one host). Two results
  cannot tell a shared host from a docs site with sections. A short list, extended when a
  real map shows another, is predictable.
