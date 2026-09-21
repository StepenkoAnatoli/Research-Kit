# ADR-0033 — The collector refuses rather than degrades, and inputs never reach a shell

- **Date:** 2026-09-21
- **Status:** accepted
- **Area:** delivery, CI, credentials, input handling
- **Implements:** ADR-0031 (Actions-first delivery) against ADR-0032 (the artifact contract)
- **Depends on:** ADR-0020 (no data reaches a shell), ADR-0019, ADR-0010
- **Evidence basis:** `docs/decisions/2026-09-21-delivery-architecture/research/BRIEF.md`

## Context

ADR-0031 chose an Actions collector; ADR-0032 settled what it returns. This is the
workflow that connects them, and it is the first thing in this repository that spends a
person's money on their behalf, unattended, from a button.

`live-collection.yml` already exists and is deliberately **not** this. It is a test of the
transport — "does the adapter still work" — and its approvers, its cadence and its failure
meaning are all different from "collect this, for a person, now". One file doing both would
have one approval list for two audiences.

## Decision

### The spend gate is the environment, and the environment is checked for existence

`environment: research-collection` is the only enforcement in the file that does not depend
on a step behaving: GitHub evaluates protection rules — required reviewers, a wait timer —
before the first step runs.

It also has a hole, and the corpus names it. E-06, verbatim: *"Running a workflow that
references an environment that does not exist will create an environment with the
referenced name … the newly created environment will not have any protection rules or
secrets configured."* So a typo in the environment name, or a deleted environment, does not
fail — it silently produces an unprotected one and the job runs straight past the approval
that was supposed to guard it.

So the environment must **prove it exists** before anything is spent:
`vars.RESEARCH_KIT_COLLECTION_ENV` must equal `research-collection`. An auto-created
environment has no variables, so the marker is absent and the run stops.

**The honest limit, stated in the file rather than implied.** GitHub does not tell a
workflow which *scope* a secret or variable came from. `secrets.X` resolves
environment-first and falls back to repository and organization, and no syntax and no API
available to the job distinguishes them. The marker therefore proves the environment was
configured for this purpose; it **cannot** prove a repository-level value did not serve the
request. Setting a repository-level variable of that name would defeat it — which makes
circumvention a deliberate, visible act, and leaves the enforcement that matters where it
belongs: on the environment's protection rules.

### A missing credential refuses; it never degrades

There is no `http-keyless` fallback in this workflow, and a test asserts the string does
not appear. The tempting design is to fall back so the run "still works" — it would return
a measurably worse corpus under the same artifact name, and the person who asked for
research would have no way to tell. A beginner asking for research should get the metered
quality or a clear refusal.

### No dispatch input reaches a shell

`${{ inputs.topic }}` inside a `run:` block is **textual substitution performed before the
shell parses the script**. A topic containing a backtick or `$(…)` executes on the runner.
Every input arrives through `env:` and is read as a variable; where it must reach a
program, it goes through an argv **array**, never a command line. This is ADR-0020's rule —
data is not an argument channel — applied to the one place in this repository where the
data is typed by a stranger.

The test that enforces this scans **every** workflow, not only the collector, and found
that `live-collection.yml` had been interpolating four inputs into shell bodies since it
was written. `max_pages` is free text. That is fixed in the same change.

### Names disclose nothing; the run page still does

Neither `run-name` nor the artifact name carries the topic. E-08 measured the reason: on a
public repository an anonymous caller reads run metadata, the job listing and the artifact
listing (`200`), while secrets are `401` and raw logs `403`. A name leaks before anybody
opens anything.

**This does not make a public run private, and the workflow says so.** `workflow_dispatch`
inputs are visible on the run page to anyone with read access. Keeping the topic out of
names reduces incidental exposure in listings. Research whose *subject* is sensitive
belongs in a private repository on a plan that supports environments there — and per E-06,
converting a GitHub Free repository from public to private makes its protection rules and
environment secrets **ignored** rather than refused, so that is a plan change and not a
visibility toggle.

### Correlation is the run id, under a pinned API version

The manifest records `github.run_id` and `apiVersion: 2026-03-10`. A caller that pins
`X-GitHub-Api-Version: 2026-03-10` receives `workflow_run_id` in the dispatch response and
identifies its own artifact by a number it already holds. `client_ref` is optional
insurance for a caller stuck on `2022-11-28`, validated against the producer's own shape
and **refused rather than rewritten** — a sanitised token means the caller polls for a
reference the artifact does not carry.

### The workflow cannot assert authorization

It packages with `artifact.mjs create`, which derives every authorization field from the
corpus and refuses `--build-authorized` outright (ADR-0032). A freshly collected corpus is
`HUMAN_REVIEW_REQUIRED` with `buildAuthorized: false`, and the ZIP says so at its top. The
workflow's job is to collect and hand over, not to judge.

### Integrity is required; research sufficiency is not

The same predicate correction `live-collection.yml` needed, and for the same reason found
the same way — by running it. `preflight` answers *"is the research sufficient to build"*,
a human-authored question, and a freshly collected project has no closed unknowns, so it
fails `discovery-contract/no-unknowns` however perfectly collection worked. The five
integrity checks are required individually instead.

## A defect this work surfaced outside itself

Feeding the collector a deliberately hostile topic found a bug in `lib/scaffold.mjs` that
had nothing to do with workflows: `template/research/plan.json` holds `"topic": "{{TOPIC}}"`
and the substitution is textual, so a topic containing a double quote wrote a `plan.json`
that does not parse. `research.mjs` then reads an empty plan, collects nothing, and reports
a corpus problem about a file the operator never edited.

Any operator typing `Why "agentic" search costs more` hit this. Tokens are now JSON-escaped
for `.json` templates and left verbatim for markdown — escaping everywhere would put `\"`
into prose. Two regression tests, both confirmed red against the unfixed module before the
fix was restored.

## Alternatives considered

**One workflow for both testing and collecting.** Fewer files, one approval list for two
audiences with different risk. Rejected.

**A keyless fallback when the credential is missing.** Makes a failure look like a success
and ships a worse corpus under the same name.

**Proving the secret came from the environment.** Not available. Documented as a limit
rather than claimed as a property.

**Validating inputs by interpolating them into a shell `case` first.** That is the
vulnerability: the substitution happens before the validation can run.

## Consequences

- The repository owner must create the `research-collection` environment, add required
  reviewers, add `FIRECRAWL_API_KEY` as an **environment** secret, and set
  `RESEARCH_KIT_COLLECTION_ENV=research-collection` as an environment **variable**. The
  workflow refuses to spend until all of that exists. Creating it is the owner's decision
  and is deliberately not automated.
- `collect.yml` is `workflow_dispatch`-only: ordinary CI can never trigger a paid run, and
  a test asserts `push`, `pull_request` and `schedule` do not appear.
- `live-collection.yml` loses four shell interpolations and gains four `env:` blocks.
- The collector runs on `ubuntu-latest` and `windows-latest`, with `shell: bash` pinned so
  one script serves both.
- **The runner path is still unproven.** `npm install -g firecrawl@<version>` on a runner,
  and `cliCompatibility()` against the CLI it installs, have never executed. This change
  makes that the only remaining gap and does not close it — closing it needs the
  environment, the secret, and one real dispatch, all of which are the owner's.

## What this ADR does not claim

That a collected artifact is good research. It is a corpus, honestly labelled, with three
human steps outstanding. The workflow's contribution is that it cannot pretend otherwise.
