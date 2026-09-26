# ADR-0041 — Pinned actions move to their latest Node 24 major, by commit

- **Date:** 2026-09-26
- **Status:** accepted
- **Area:** CI, workflows, supply chain
- **Evidence:** [`docs/decisions/2026-09-26-actions-node24/research/BRIEF.md`](../decisions/2026-09-26-actions-node24/research/BRIEF.md)

## Context

The four actions these workflows use - `actions/checkout`, `actions/setup-node`,
`actions/setup-python`, `actions/upload-artifact` - were pinned by commit on 2026-09-21 to
releases whose `action.yml` declares `runs.using: node20`. GitHub removed Node 20 from its runners
on 2026-09-23 (E-07); since then every run warns that they are "forced to run on Node.js 24".
They work, as code never released for the runtime it now runs on.

## Decision

**Pin each action to its latest major that runs on Node 24 - v7 for all four - by commit SHA,
with the tag in the comment beside it:** checkout v7.0.1 `3d3c42e5…`, setup-node v7.0.0
`82076278…`, setup-python v7.0.0 `5fda3b95…`, upload-artifact v7.0.1 `043fb46d…`. Every pin
was resolved to a commit (not a tag object) and its `runs.using` read from that commit's
`action.yml`, not from release prose.

**Set `package-manager-cache: false` on setup-node in `collect.yml` and `live-collection.yml`,**
the two workflows that can read an API key. It is inert today - the repository has no
`package.json` - and the vendor recommends it for privileged workflows (E-03). Explicit, so a
manifest added later cannot switch a cache on in a job holding a credential.

## Rejected alternatives

- **Stop at the first Node 24 major** (checkout v5, setup-node v5, setup-python v6,
  upload-artifact v6). The review is the same - every breaking change between our pins and v7
  was checked against this repository and none reaches it (U-2) - and it buys less runway and
  fewer dependency and security fixes. Nothing is saved by stopping early.
- **Pin to tags (`@v7`).** Rejected long ago, and re-stated in `offline-suite.yml`: a tag is
  mutable, and whoever can move it can run code in these workflows.
- **Leave the pins and rely on the runner forcing Node 24.** It works today, and it is exactly
  the state the vendor tells users to leave: "update to the latest versions of those actions
  that support Node 24" (E-07).

## Consequences

- The `punycode` deprecation warning in `collect.yml`'s artifact step goes away
  (upload-artifact v6 fixed it, E-05), and so does the Node 20 warning on every run.
- The re-resolve instruction in `offline-suite.yml` changed with it: the old one
  (`gh api .../git/ref/tags/X --jq .object.sha`) returns the tag object for an annotated tag,
  which cannot be pinned.

## Trigger that would reopen this

A v8 of any of the four, or GitHub announcing the removal of Node 24 from its runners. Re-run
the same check: resolve to a commit, read `runs.using`, and read every breaking change between
the pin and the target against these three workflows.
