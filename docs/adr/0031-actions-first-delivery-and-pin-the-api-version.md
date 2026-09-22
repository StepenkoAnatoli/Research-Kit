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

> **Amendment, 2026-09-21 — the fallback was wrong, and a corroborating source found it.**
> Evidence: E-13/E-14 of the delivery corpus, plus four measured calls in its `BRIEF.md`.
>
> The rule above stands. The **fallback** does not: a caller stuck on `2022-11-28` never
> needed to poll and race. GitHub added an optional `return_run_details` parameter on
> 2026-02-19, and it returns `200` with `workflow_run_id` **on the old version**. Measured,
> not read — `2022-11-28` + `return_run_details=true` → `200`.
>
> The two facts looked contradictory at first. The changelog says that *without* the
> parameter the endpoint "will continue to return the current `204`", which flatly denies
> what this repository had measured. Both are true: the parameter is the opt-in route on the
> old version, and `2026-03-10` makes run details the **default**. Optional parameters are
> non-breaking and reach every version, so making one the default is precisely the kind of
> response-shape change a new calendar version exists to carry.
>
> `lib/dispatch.mjs` now sends **both** the pinned header and the parameter — safe rather
> than merely plausible, because the fourth measured call confirms `2026-03-10` accepts the
> parameter instead of rejecting it as unknown. `NO_RUN_ID` now means both routes were
> ignored.
>
> **Worth being precise about what corroboration bought here: not a corrected error.** E-01
> was right and this decision was right. A second host supplied the *mechanism and its date*,
> and with them a fallback that removes a race from the design — which the corpus could not
> have known while everything it had read came from `docs.github.com`.

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

> **Amendment, 2026-09-21 — the paragraph above rests on a false premise.**
> Evidence: `docs/decisions/2026-09-21-sea-assets/research/BRIEF.md`.
>
> The stability reading is right. The word **"need"** is wrong, and it is the load-bearing
> word. The kit does not require `useVfs` to read its own bundled files: the `assets`
> configuration key bundles them at build time and `sea.getAsset()`, `getAssetAsBlob()`,
> `getRawAsset()` and `getAssetKeys()` read them back. That API predates the VFS — a v20.19.2
> copy of the same page documents it in full with no VFS section at all — and carries **no
> separate stability marker**, so it sits at the feature's own 1.1. On the current page,
> `1.0 - Early development` appears exactly once, under `Virtual file system (VFS) for
> assets`. `useVfs` is a convenience that lets existing `node:fs` calls keep working
> unchanged; it is not the only route to the assets.
>
> **So the trigger was waiting on a condition this decision never depended on.** It is
> withdrawn. What remains is not a stability objection but a scope one, and a cheaper one to
> state honestly: taking the 1.1 route means adding an asset-aware branch to the three
> modules that read non-JavaScript files at runtime (`lib/scaffold.mjs`, `lib/decompose.mjs`,
> `lib/artifact-validator.mjs`), and nobody has yet said the `.exe` is still wanted now that
> `bin/collect-remote.mjs` and the MCP server reach the collector without one.
>
> **How the error happened is the part worth keeping.** The original text was written from
> the delivery-architecture corpus, in which the SEA page was one capture closing one unknown
> about platform limits. It read a stability marker correctly off that page and then inferred
> which API the kit would use — an inference no row in that corpus supported, sitting in a
> sentence that looks like a citation. `corroboration` could not have caught it; the claim
> was not under-sourced, it was unsourced and adjacent to a sourced one.

> **Decision, 2026-09-21 — the `.exe` is REJECTED, not deferred.** Operator's call, taken
> once the stability objection was withdrawn and the question was no longer technical.
>
> The `.exe` was argued for a person who does not use a terminal. That person is now served
> without one: `bin/collect-remote.mjs` dispatches a collection and fetches the corpus, and
> `bin/mcp-server.mjs` exposes the same seam to an agent. Neither needs a packaged binary,
> and both already work.
>
> What rejecting it costs, stated so it is not discovered later — **and stated more narrowly
> than it first was.** The original wording here said "there is still no offline path", which
> was too broad and was corrected on 2026-09-22. The kit runs locally from a terminal against
> a local Firecrawl credential; that *is* an offline-from-GitHub path, and it is the path
> every corpus in this repository was actually collected through.
>
> The real cost is narrower: **a non-terminal operator has no local path.** For that person,
> and only that person, everything routes through a GitHub runner — so no GitHub account
> means no collection. That is the group the `.exe` existed to serve, and rejecting it leaves
> them on the hosted route. Accepted deliberately.
>
> **Cost update, 2026-09-22.** Evidence: `docs/decisions/2026-09-22-build-sea/`. The packaging
> half of the reopening estimate is smaller than recorded here: Node **v25.5.0** added
> `--build-sea`, so producing a binary no longer needs the external `postject` injector
> installed and pinned. The decision is unchanged - the .exe is still rejected on scope - and
> the estimate it promised would stay cheap is now cheaper. Worth noting that this was already
> true when the paragraphs above were written; the sea-assets corpus read the same page and
> nobody looked at its changelog entries.
>
> > This is a decision with a consequence, not an open gap, and it is listed that way. The
> distinction matters because an item that nothing can ever close reads like diligence while
> functioning as noise — the same argument this ADR already makes about the ergonomics
> question a few paragraphs down.
>
> **Reopening is cheap and the research is now done.** The route is an asset-aware branch in
> `lib/scaffold.mjs`, `lib/decompose.mjs` and `lib/artifact-validator.mjs`, at Stability 1.1,
> evidenced in `docs/decisions/2026-09-21-sea-assets/`. If an offline operator ever turns up,
> nothing here has to be re-researched.

**Hybrid first.** The strongest long-term shape and the most work, and it needs the
collector anyway. It is what the collector grows into, not an alternative to building it.

**REST/API seam instead of a collector.** Not a delivery option. It is the interface
whichever collector ships would expose, so it belongs inside that option rather than beside
it.

## Consequences

- The next build step is a `workflow_dispatch` collector that uploads a labelled artifact,
  with the five properties above.
- Two things remained unproven when this was written and were recorded as gaps rather than
  claimed: the runner-side install path, and whether artifact download is ergonomic for the
  intended operator.

  **The first is closed, later the same day.** The install path has executed on a real
  runner and succeeded, in runs `35600022797` and `35608301287` — both reporting `install
  the vendor CLI` and `the CLI is a major this adapter supports` as successful. Getting
  there took a fix no amount of reading would have found: the npm package is
  `firecrawl-cli`, and the one called `firecrawl` is the SDK, which ships no binary.

  The second is still open and always will be by this route — it is a usability question,
  and no vendor page answers it.

  **Closed by decision, 2026-09-21, not by evidence.** With the `.exe` rejected above, the
  question "is artifact download ergonomic enough to justify building a binary instead" no
  longer has a decision hanging on it: there is no alternative left for it to be compared
  against. It stops being a gap and becomes ordinary feedback — if download proves painful
  in use, that is a reason to reopen the `.exe`, and the route is already researched.

  Recording *how* it closed matters as much as that it did. A usability question was never
  going to be answered by collection, and carrying it as an open gap indefinitely would have
  made the gap list less honest, not more: an item nothing could ever close reads like
  diligence while functioning as noise.
- The preliminary note keeps its text. It was right about the behaviour it observed and
  wrong about the cause, and rewriting it would erase the most useful thing in this
  decision: that reading a page and running the call gave different answers, and only
  running both explained why.
