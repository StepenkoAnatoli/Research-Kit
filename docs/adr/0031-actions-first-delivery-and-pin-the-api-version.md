# ADR-0031 — Actions-first delivery, and any client pins the API version

- **Date:** 2026-09-21
- **Status:** accepted
- **Area:** delivery, CI, client integration
- **Evidence basis:** `docs/decisions/2026-09-21-delivery-architecture/research/BRIEF.md` — gate PASS, 8 unknowns closed, 9 cited captures, chain verifies
- **Depends on:** ADR-0030 (decision research lives in a nested project)
- **Supersedes the recommendation in:** `docs/preliminary-2026-09-21-delivery-architecture.md`, which is kept as written

## Context

The kit runs from a terminal. The operator it is for does not use one. Four shapes were
weighed: an **Actions collector** triggered from a web page returning a ZIP; a **local
Windows `.exe`** built with Node's single-executable feature; a **hybrid** collecting
remotely and judging locally; and a **REST/API seam**.

The evidence is in the nested project named above and is not restated here. Three findings
decided it.

## The finding that changed the answer

A preliminary note written earlier the same day recorded that
`POST /actions/workflows/{id}/dispatches` returns **`204 No Content`** — no run ID, no run
URL — and concluded that a caller cannot learn which run it started. It demonstrated a
correlation race between two runs fifteen seconds apart, and recommended designing a
caller-chosen `client_ref` token into the first release.

The collected documentation says the opposite: one status code, `200`, "Response including
the workflow run ID and URLs". Both are true. **The response shape depends on the API
version**, which was settled by running both against this repository:

| request | `X-Github-Api-Version-Selected` | result |
|---|---|---|
| `gh api -X POST .../dispatches -f ref=main -i` | `2022-11-28` (the default) | `204 No Content`, empty body |
| the same, `-H "X-GitHub-Api-Version: 2026-03-10"` | `2026-03-10` | `200 OK`, `{"workflow_run_id":35548135379,...}` |

Run `35548135379` resolved to a real queued `workflow_dispatch` run. The `Deprecation:
Tue, 10 Mar 2026` header on the 204 response is the same signal from the other side: the
version that returns nothing is the deprecated one, and it is the default.

So the correlation race is not a property of the endpoint. It is a property of an unpinned
client.

## Decision

**1. Actions-first.** Build the Actions collector before the desktop `.exe` and before the
hybrid. It works today with no packaging story, and the strongest objection against it —
that a caller cannot follow its own run — turned out to be a version artefact.

**2. Any client that dispatches a workflow pins `X-GitHub-Api-Version` explicitly**, and
reads `workflow_run_id` from the `200` body. Polling `/runs` and correlating by
`created_at` is the fallback path for a client stuck on `2022-11-28`, not the design. This
is the durable rule: the endpoint's contract demonstrably differs between versions, and the
unpinned default is the deprecated one.

**3. The artifact is labelled honestly, inside the package.** The corpus a collector
produces fails its own preflight by design — a freshly scaffolded project has no unknowns
in its contract, so `discovery-contract/no-unknowns` blocks it, verified by running it
(`docs/live-predicate-verification-2026-09-21.md`). The ZIP carries, at its top:

```
COLLECTED CORPUS - HUMAN REVIEW REQUIRED
Evidence has been collected. This is not an approved brief and does not
authorize building. Three steps remain, and none of them is automated:
  1. classify each row in research/MAP.md
  2. rewrite each Finding in research/EVIDENCE.md into a claim you would defend
  3. run preflight, then write and review the brief
```

ADR-0013 and ADR-0017 record that enforcing those three steps was considered and rejected —
a check that judged whether an agent reasoned properly would be wrong. Labelling is what
remains, and it has to be in the package, because the workflow summary does not travel with
the ZIP.

**4. The artifact is delivery, never storage.** 90 days maximum on this public repository,
1–90 configurable, and deleting the run deletes the artifact. Anything that must persist is
committed — as the nested corpus is.

**5. `run-name` interpolates a dispatch input.** One line, and it makes a run identifiable
in the Actions tab by something the caller supplied. Cheap insurance for a client that
cannot pin the version.

**6. The paid run stays behind a required reviewer on the `live-collection` environment,
and the credential stays in that environment's secret.** Creating the environment and the
secret is the repository owner's decision and is not taken here.

## The constraint that comes with it

This repository is public. Measured unauthenticated against it: run metadata, the job
listing with step names, and the artifact listing all return `200` to an anonymous caller;
`/actions/secrets` returns `401` and raw job logs `403`. The credential is protected. The
*shape* of the run is not, and artifact and step names alone disclose a research topic.

Going private is not a simple toggle. On a GitHub Free plan, deployment protection rules
exist only for public repositories, and a Free repository converted to private has its
protection rules and environment secrets **ignored** — not refused. A repository that went
private to protect its research subject would silently lose both the approval gate of
decision 6 and the credential store it depends on.

**Research whose subject is sensitive needs a paid plan, not just a visibility change.**
That should be settled before anything depends on it.

### Corroborated, 2026-09-21 — and the pin turns out to have a deadline

Decision 2 above ("any client pins `X-GitHub-Api-Version`") rested on a single page. A
second, independent one (E-10) confirms the cause and supplies what the first did not.

"Requests without the `X-GitHub-Api-Version` header will default to use the `2022-11-28`
version" — so the 204 was never a broken endpoint, it was a three-year-old version
answering exactly as specified. "Removing or renaming a response field" is listed among
breaking changes, which is why both shapes are correct at once.

The new part: an API version is supported "at least 24 more months" after its successor,
announced by `Deprecation` and then `Sunset` — the two headers this repository already
observed on its own 204 response, dated `Tue, 10 Mar 2026` and `Fri, 10 Mar 2028`. After
retirement, "requests that do not specify an API version default to the **next oldest
supported version**, not the closing down version. If you rely on unversioned requests, you
may observe behavioral changes as older versions are removed from support."

**So an unpinned integration does not keep working — it moves.** Pinning was argued here as
the way to get a run id; it is also the only way to stop the contract changing underneath a
caller on a date nobody chose.

## Alternatives considered

**Local Windows `.exe` first.** Deferred, not rejected. Node's single-executable feature is
Stability 1.1 "Active development"; Windows is supported and the exclusion is macOS x64,
which is out of scope — so it is buildable for this operator today. What defers it is the
part the kit would actually need: reading its own bundled files through `useVfs`, added in
v26.9.0 and carrying a weaker "Stability: 1.0 — Early development". Revisit when that
reaches 1.1, or if artifact download proves too awkward in practice.

**Hybrid first.** The strongest long-term shape and the most work, and it needs the
collector anyway. It is what the collector grows into, not an alternative to building it.

**REST/API seam instead of a collector.** Not a delivery option. It is the interface
whichever collector ships would expose, so it belongs inside that option rather than beside
it.

## Consequences

- The next build step is a `workflow_dispatch` collector that uploads a labelled artifact,
  with the five properties above.
- Two things remain unproven and are recorded as gaps rather than claimed: the runner-side
  `npm install -g firecrawl@<version>` path, which has never executed, and whether artifact
  download is ergonomic for the intended operator, which documentation cannot answer.
- The preliminary note keeps its text. It was right about the behaviour it observed and
  wrong about the cause, and rewriting it would erase the most useful thing in this
  decision: that reading a page and running the call gave different answers, and only
  running both explained why.
