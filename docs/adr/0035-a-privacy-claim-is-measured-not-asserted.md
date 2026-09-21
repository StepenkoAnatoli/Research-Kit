# ADR-0035 — A privacy claim is measured, not asserted; and this repository stays public

- **Date:** 2026-09-21
- **Status:** accepted
- **Area:** disclosure, plan, credentials
- **Depends on:** ADR-0031 (Actions-first delivery), ADR-0033 (the collector refuses rather than degrades)
- **Evidence:** `docs/decisions/2026-09-21-delivery-architecture/` E-06 and E-08, plus the measurement below

## Context

Two questions were open and had been answered in prose rather than by checking.

**"Should this repository go private for sensitive research?"** ADR-0031 recorded the
constraint and nothing acted on it. **"What does a public run expose?"** The collector's own
header answered it, confidently and wrongly: *"`workflow_dispatch` inputs are themselves
visible on the run page to anyone with read access."*

That sentence was written by me, from reasoning, and never tested.

## The measurement

Unauthenticated requests against this repository, run `35608301287`, on 2026-09-21. The
topic was `GitHub Actions workflow artifact retention period`, and every response body was
searched for it:

| probe | status | topic present |
|---|---|---|
| run metadata | `200` readable | no |
| jobs and step names | `200` readable | no |
| run timing | `200` readable | no |
| artifact **listing** | `200` readable | no |
| repository secrets | `401` refused | — |
| artifact **download** | `401` refused | — |
| job **logs** | `403` refused | — |

**A stranger learns the shape of a run and not its subject.** That one happened, when, how
long it took, what its steps were called, that an artifact of N bytes exists with a given
name — and nothing about what was researched or what came back.

The claim in the header was wrong in the direction that feels safe, which is still wrong.
An overstated warning is the same defect as an understated one: a reader who finds a
warning false once discounts the next, and the next may be the true one.

## Decision

### 1. This repository stays public

Going private is the reflex answer and it is the wrong one here, for a reason that is
recorded rather than assumed. This account is on the **free** plan — checked, not inferred:
`gh api user --jq .plan.name` returns `free`. Per E-06, converting a GitHub Free repository
from public to private makes its protection rules **and environment secrets** *ignored*
rather than refused.

The collector's credential lives in the `research-collection` environment. Going private
would make it unreadable, the collector would fail its credential check, and the failure
would look like a broken workflow rather than a plan limitation. The next move — adding the
key as a repository secret to "fix" it — is refused by the `scope-check` canary, correctly
and confusingly.

So privacy for sensitive subjects is a **plan change**, not a visibility toggle, and it is
not needed for what is measured above.

### 2. The naming rules are the primary control, not a minor one

The measurement says the names are the disclosure surface. Everything the workflow does to
keep the topic out of `run-name` and the artifact name is therefore the main defence rather
than a nicety, and `client_ref` being public (it becomes both names) is the sharpest edge
in the design.

### 3. The claim becomes executable

`lib/disclosure.mjs` and `bin/disclosure.mjs` make the measurement repeatable by anyone:

```
node research-kit/bin/disclosure.mjs --repository OWNER/REPO --run <id> --topic "..."
```

Unauthenticated by construction — there is no token parameter, and an unknown flag matching
token/auth/key/secret is refused with that reason, because a probe that quietly
authenticated would answer a different question while looking like this one.

Exit codes are the finding: `0` shape only, `1` content readable, `2` subject leaked, `3`
could not measure. A documentation paragraph goes stale silently; a command does not.

### 4. An unchecked thing is never reported as a clean thing

`needleChecked` exists so that "the subject was not exposed" cannot be printed when no
subject was searched for. Without `--topic`, the report says **not checked**. An
unreachable endpoint is likewise a refusal to conclude, not a pass. This is the same
failure the ADR is about, one level down: the probe must not do to its reader what the
header did to me.

## What is NOT measured, and is therefore not claimed

**What a signed-in user sees in the web UI.** That is a different surface from the REST
API, and it could not be tested from here — the browser available to this session cannot
reach github.com. The logs contain the topic (the step prints `TOPIC:` in its `env:`
group), and the API refuses them to a stranger with `403 Must have admin rights to
Repository`. Whether the UI is equally strict for a signed-in reader is **unknown**, and
"unknown" is what the documentation now says rather than "safe".

## Alternatives considered

**Go private anyway, to be safe.** Breaks the collector on this plan, for an exposure the
measurement does not show.

**Reword the warning.** Cheaper, and it would have left the next claim just as unchecked.
The problem was not the wording.

**Refuse to run when the topic looks sensitive.** A judgement about meaning, which a regex
cannot make — the same reason `client_ref` warns rather than refuses.

## Consequences

- `collect.yml`, `README.md` and `research-kit/README.md` now carry the measured table and
  the command, and each states what was not measured.
- Both corrected passages **quote the claim they replaced**. A correction that erases what
  it corrected teaches nobody, and this one is the second time in two days that something
  built from documentation turned out untrue when run.
- `bin/disclosure.mjs` is read-only and unauthenticated, so it is safe to run against a
  repository you do not own — which is also the only way to check somebody else's claim
  about their own exposure.
