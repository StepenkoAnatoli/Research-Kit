# Brief - Node.js release schedule and NODE_USE_ENV_PROXY support

_Auto-drafted 2026-09-27 by `bin/brief.mjs` from the corpus. Sections marked **TODO**
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

## The prior, registered before anything was collected

_Ledger seq 1, chained: neither this text nor its place before the evidence
can be changed now. Read it against the findings below - it may well be wrong, and a wrong
prior that was recorded in advance is worth more than a right one remembered afterwards._

> Expect: Node 20 reached end of life on 2026-04-30; Node 22 is Maintenance LTS until 2027-04-30; Node 24 is Active LTS until October 2026, then Maintenance until 2028-04-30; Node 26 is Current since April 2026 and enters LTS in October 2026. Expect NODE_USE_ENV_PROXY was added in Node 24.0.0 for fetch, extended to the http and https modules around 24.5, and backported to 22.21.0 - so Node 22.0 to 22.20 cannot route fetch through HTTPS_PROXY at all. Expect Node to read both upper- and lowercase HTTP_PROXY, HTTPS_PROXY and NO_PROXY, with lowercase winning when both are set, as curl does. Cannot know yet: whether the kit's suite passes on Node 24 and 26 - a measurement, not a document.

## Intent

The kit promises "Node 22+" in both READMEs and in `lib/runtime.mjs`, but CI runs only Node 22
(`node-version: '22'` in all three workflows). An operator's machine runs whatever Node their
installer gave them, and nothing has checked the kit on any other line. Separately, the keyless
transport's proxy support (dd7569d, 2026-09-27) depends on `NODE_USE_ENV_PROXY`, which some
Node releases do not have: on those, the transport goes around a configured proxy and fails with
a bare HTTP 403, as it did in this container before the fix.

"Done" is:

1. the Node lines the kit states and CI tests match the lines supported upstream on 2026-09-27;
2. before anything is collected, the kit tells an operator whose Node cannot route the keyless
   transport through their configured proxy, naming the version to upgrade to;
3. the proxy variables `fetchEnv` looks for are the ones Node actually reads.

## What we verified

| Claim | Source | Type |
|---|---|---|
| The releases page (nodejs.org) lists, on 2026-09-27: v26 "Current" (latest v26.10.0), v24 "Krypton" LTS (v24.21.0), v22 "Jod" LTS (v22.23.3), and v20, v21, v23, v25 "EOL". "Production applications should only use _Active LTS_ or _Maintenance LTS_ releases." A change ahead: "Starting with Node.js 27, the release cycle will be annual and every major version will move to _LTS_ status after its six-month _Current_ phase (and six additional months of _Alpha_ phase)" | E-01 `nodejs.org` (U-1) | P |
| The CLI reference (served as v26.10.0 docs) for `NODE_USE_ENV_PROXY=1`: "Added in: v24.0.0, v22.21.0", Stability 1.1 - Active Development. "When enabled, Node.js parses the `HTTP_PROXY`, `HTTPS_PROXY` and `NO_PROXY` environment variables during startup, and routes requests through the specified proxy." The same is enabled by `--use-env-proxy`; "When both are set, `--use-env-proxy` takes precedence" | E-02 `nodejs.org` (U-2, U-3) | P |

## Contradictions and how they were resolved

**The two sources on proxy support give different "added in" versions, and both are right.**
E-02 (the CLI reference) says `NODE_USE_ENV_PROXY` was added in v24.0.0; E-03 (the HTTP
reference) says built-in proxy support was added in v24.5.0. They describe different things:
in 24.0.0 the flag made `fetch` honour the proxy, and in 24.5.0 it reached the `http`/`https`
modules too. E-04 shows both arriving on the 22 line in one release, 22.21.0. The keyless
transport uses `fetch`, so its minimum is 24.0.0 on the 24 line and 22.21.0 on the 22 line.

**E-05 was collected by the keyless transport, on purpose.** It is the Release working group's
schedule as raw JSON, and fetching it through `http-keyless` exercised tonight's proxy and
content-type fixes on a real research run: it came back `full` and verbatim. The gate warns
that it is not a metered Firecrawl capture, and that warning stands: its dates agree with E-01,
which Firecrawl fetched from nodejs.org.

## How the prior held

Right on almost every date and version, wrong on one date and blind to one change. Node 26
started on 2026-05-05, not "April". The prior had the rest right: 22 Maintenance to 2027-04-30,
24 Active LTS until October then Maintenance to 2028-04-30, the flag in 24.0.0 and 22.21.0,
http/https in 24.5, and both cases read, with lowercase winning. What it did not know: from
Node 27 the cycle becomes annual and every major goes LTS (E-01), so "odd lines are never LTS"
stops being true after 26.

## Measured, not cited

Run in this container, 2026-09-27, with binaries from the npm registry:

| Node | Offline suite | Keyless capture of the GitHub API through this proxy |
|---|---|---|
| 22.20.0 (no flag) | not run | **HTTP 403**: the fetch went around the proxy |
| 22.22.2 (the container) | 971 passed, 0 failed | collected |
| 24.21.0 (latest 24) | **971 passed, 0 failed** | collected |
| 26.10.0 (latest 26) | **971 passed, 0 failed** | not run |

The 403 on 22.20.0 is GitHub's own answer to an unauthenticated request: "API rate limit
exceeded" (60 an hour, 0 left, for this container's shared address). This container can reach
GitHub directly, so going around the proxy did not fail at the network. It lost the proxy's
authentication. On a network that only allows traffic through the proxy, the same bypass fails
earlier, at the connection. Either way the operator sees an error that names no proxy.

## Known unknowns

None. Every blocking unknown was closed with primary-source evidence.

## Decision

**1. CI tests every supported Node line.** The offline suite adds a job running on Node 24 and
26 (Linux), beside the existing platform matrix on 22 (Linux and Windows). The aggregate `suite`
check requires both. The README's "Node 22+" then means "22, 24 and 26, each tested on every
commit". Measured tonight: both pass 971 of 971 today, so this adds a guard, not a fix.

**2. `doctor` says when this machine's Node cannot use its proxy.** When `HTTPS_PROXY`,
`HTTP_PROXY` or either lowercase form is set, and Node lacks `NODE_USE_ENV_PROXY` (below 22.21
on the 22 line, and every 23.x; E-02, E-04), doctor warns, naming the version to move to.
It warns rather than fails: the Firecrawl CLI has its own proxy handling, and the keyless
transport is the fallback.

**3. `doctor` warns on an odd-numbered line below 27.** Up to Node 26 an odd line is never LTS
and ends six months after it starts (E-01): 23 and 25 are already end-of-life. From 27 every
line goes LTS, so the rule stops there.

**4. Correct the record.** The `fetchEnv` comment and the architecture map say the 403 came
from "egress that is proxy-only". The measurement above shows GitHub's rate limit behind a
bypassed proxy.

Rejected:
- **Raise the floor to 22.21.** That would refuse every older 22.x, including machines that
  have no proxy and would never meet the problem. A warning names the problem where it exists.
- **Test Node 24 and 26 on Windows too.** Nothing in the kit's platform-specific code (line
  endings, the `.cmd` argument guard, the executable bit) depends on the Node line. Linux
  catches a Node regression at a third of the cost.
- **Keep CI on 22 alone.** E-01 tells production users to run Active LTS, which today is 24,
  so an operator who follows that advice runs a line nothing tested.

First build step: add the `node-lines` job to `offline-suite.yml` and make `suite` depend on it.
Then add the doctor finding with a red test, and correct the comment and the map row.

Out of scope: Node 27 (alpha from 2026-10-28, E-05). Revisit when it reaches Current in April
2027.

## Next steps

1. Reviewed 2026-09-27; no **TODO** remains.
2. Hand this file to the builder (phase 2). Re-running `node bin/brief.mjs`
   after edits will refuse without `--force` so your judgements are preserved.
