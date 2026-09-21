# research-kit

The research-first kit: a collector that turns a fetch into cached, citable evidence, and a
gate that refuses to let a build start while a blocking fact is unproven.

Plain Node, no dependencies, no `package.json`. It installs with one command and runs
offline for everything except collection itself.

**That claim is about the repository, and collection is the exception in two ways.**
The kit itself pulls nothing from npm and has no lockfile — but the metered route
spawns a Firecrawl CLI that is installed globally and versioned outside this
repository, and the optional `live-collection` workflow installs that CLI from npm
at dispatch time. So the offline suite is reproducible from a clone alone; a live
collection additionally depends on npm being reachable, the package keeping its
name, the CLI staying on a supported major (`cliCompatibility` refuses otherwise,
before spending), and a configured credential.

**Supported on Linux and Windows; macOS is best-effort and untested.** "Supported" means
the full offline suite runs on that platform in CI on every commit — see
[the support policy](../README.md#supported-platforms) for why the distinction is worded
that way and what it has already caught. Needs Node 22+, Git, and Python 3.12+ for the
cross-language conformance runners.

New here? [Your first 30 minutes](../README.md#your-first-30-minutes) is one ordered path
from nothing to a `preflight` verdict, and
[when something fails](../README.md#when-something-fails) lists the failure modes that
actually happen.

## Install

```
node research-kit/bin/install.mjs          # deploy to ~/.agents/research-kit + the skill root(s)
node research-kit/bin/install-hooks.mjs    # the commit gate and the edit-time gate
node research-kit/bin/doctor.mjs           # stop at READY
```

On a machine that builds rather than collects, say so once:

```
node research-kit/bin/install-hooks.mjs --role builder
```

## The sequence

The project is the **current working directory**. The kit takes no project argument.

```
node research-kit/bin/new-project.mjs . --topic "<topic>"   # the canonical shape
node research-kit/bin/decompose.mjs --topic "<topic>"       # phase 0: the map, statuses blank
                                                            # then YOU mark COVERED/DISMISSED/GAP
node research-kit/bin/research.mjs                          # collect (spends credits)
node research-kit/bin/preflight.mjs                         # do not build until PASS
node research-kit/bin/brief.mjs                             # the phase-1 -> phase-2 handoff
node research-kit/bin/audit.mjs --zip                       # one pasteable attachment
```

On a builder machine, the first command is instead:

```
node research-kit/bin/handoff.mjs     # did the corpus arrive whole?
```

## Every command

| Command | What it answers |
|---|---|
| `doctor.mjs` | machine + project + gate + chain health, with the exact fix per problem (`--fix-arity` drops a torn ledger tail) |
| `preflight.mjs` | the verdict (`--checks`, `--check <name>`, `--strict`, `--json`) |
| `gate.mjs` | the verdict for a hook (`--gate commit\|edit`, `--staged-stdin`, `--posture`) |
| `research.mjs` | collect (`--depth`, `--refresh-days`, `--force`, `--dry-run`, `--status`, `--transport`) |
| `decompose.mjs` | phase 0 (`--topic`, `--recipe`, `--recipes`, `--max-scrapes`, `--dry-run`) |
| `handoff.mjs` | the arrival question, with the remedy picked from the cause |
| `brief.mjs` | draft the handoff (`--state`, `--force`) |
| `audit.mjs` | render, `--list`, `--show`, `--zip` |
| `timeline.mjs` | regenerate the chronological review aid |
| `new-project.mjs` | scaffold the shape (`--layout`, `--force`) |
| `install.mjs` | deploy (`--dry-run`, `--into <project>`) |
| `install-hooks.mjs` | the two gates and the machine's role and posture |
| `researcher-release.mjs` | release evidence (`validate`, `conform`, `fi-validate`), read-only |
| `path-authority.mjs` | Git-origin path-authority snapshots (`conform`, `validate`), read-only |
| `ledger-conformance.mjs` + `.py` | qualification-ledger vectors, in two languages |
| `fi-sidecar-conformance.mjs` + `.py` | FI sidecar and manifest vectors, in two languages |
| `property-vector-conformance.mjs` + `.py` | exported property vectors, in two languages |
| `property-replay.mjs` | replay a captured property failure deterministically |
| `evidence-context.mjs` | what one unknown rests on (`--unknown U-5`, `--all`, `--json`), read-only |
| `artifact.mjs` | the portable package: `create` (derives authorization, never takes it) and `validate` (offline, read-only) |
| `selftest.mjs` | the whole suite, offline |

## The portable artifact

One versioned ZIP that an AI agent, a GitHub Actions workflow, a future Windows app and a
person with an unzip tool all read the same way. See
[ADR-0032](../docs/adr/0032-one-artifact-contract-for-every-consumer.md).

```
node research-kit/bin/artifact.mjs create --root . \
  --repository OWNER/REPO --ref main --commit <sha40> \
  --workflow start-research.yml --run-id <workflow_run_id>

node research-kit/bin/artifact.mjs validate --file research-kit-corpus-v1-<ref>.zip --json
```

**The rule the format exists to carry.** An AI or application may build only when:

```
state == "APPROVED_BRIEF"  AND  gate.verdict == "PASS"  AND  buildAuthorized == true
```

`validate` exiting **0 does not mean you may build.** It means the package is internally
consistent: the container is safe, the manifest matches its digest, every declared file is
present with the bytes it claims, and the provenance chain verifies. Permission is a
separate field, `buildAuthorized`, and a valid collected corpus reports `PASS` with
`buildAuthorized: false`.

| Exit | Meaning |
|---|---|
| 0 | the package is valid |
| 1 | the package is invalid |
| 2 | incomplete, or a format major this build does not implement |
| 3 | validation was blocked and reached no verdict |

**Authorization is derived, never requested.** There is no `--build-authorized`, and the
CLI **refuses** it rather than ignoring it:

```
unknown option --build-authorized
Authorization is derived from the project and cannot be supplied.
```

Accepting it silently would be safe and misleading - exit 0 plus a package back is every
reason to believe the option was honoured. `create` runs the real gate over the real
project and reads the real review state; a caller supplies identity (which repository,
which run) and nothing about permission.

**What a consuming agent must do, in order:**

1. Validate the ZIP.
2. Read `manifest.json`.
3. Confirm `clientRef` — or `source.workflowRunId` — matches the job you asked for.
4. Read `README-FIRST.md`.
5. Follow `nextActions` in order.
6. Read `project/AGENTS.md`.
7. **Do not build unless `buildAuthorized` is true.**

A package reading `{"state": "HUMAN_REVIEW_REQUIRED", "buildAuthorized": false}` is a
*successful collection that still forbids building*. Do not describe it as an approved
brief.

**States, and what a UI should call them:**

| `state` | Label for a person |
|---|---|
| `COLLECTION_FAILED` | Collection stopped |
| `HUMAN_REVIEW_REQUIRED` | Your sources are ready to review |
| `REVIEW_IN_PROGRESS` | Review is in progress |
| `PREFLIGHT_BLOCKED` | Research is not ready yet |
| `APPROVED_BRIEF` | Research approved — you may start building |

An application should drive its buttons from `nextActions`, its recovery text from
`gate.blockingFindings`, its warnings from `privacy`, its progress and cost lines from
`collection`, and enable the build action from `buildAuthorized` alone. Raw codes belong
under an "Advanced details" section.

**Two privacy properties, both deliberate.** The topic is in the manifest and **never in
the filename** — an artifact listing is readable by an anonymous caller on a public
repository, so a filename leaks before anybody opens anything. And
`safeForPublicDistribution` is `false` by default: a package with no secrets in it can
still disclose what was being researched.

## Collecting from GitHub Actions

`.github/workflows/collect.yml` is the collector a non-technical operator triggers. It is
**manual only** — ordinary CI can never start a paid run — and it runs on
`ubuntu-latest` or `windows-latest`. See
[ADR-0033](../docs/adr/0033-the-collector-refuses-rather-than-degrades.md).

```
gh api -X POST repos/OWNER/REPO/actions/workflows/collect.yml/dispatches   -H "X-GitHub-Api-Version: 2026-03-10"   -f ref=main -f 'inputs[topic]=...' -f 'inputs[max_pages]=8'
→ 200 {"workflow_run_id": 35548135379, "run_url": "...", "html_url": "..."}
```

That run id is the correlation key, and it is what the artifact's manifest records. Under
the default `2022-11-28` the same call returns `204 No Content` and the caller learns
nothing.

**One-time setup, and the workflow refuses to spend until it exists.** Settings >
Environments > `research-collection`:

| What | Why |
|---|---|
| required reviewers | the only spend gate GitHub enforces before a step runs |
| environment **secret** `FIRECRAWL_API_KEY` | the metered credential |
| environment **variable** `RESEARCH_KIT_COLLECTION_ENV=research-collection` | proves the environment exists |

The variable is not ceremony. A workflow naming an environment that does **not** exist does
not fail — GitHub creates one, with no protection rules and no secrets. A typo in the name
would remove the approval gate silently, so the collector requires a marker only a
configured environment can supply.

**A missing credential refuses; it never degrades.** There is no keyless fallback: that
would return a measurably worse corpus under the same artifact name, and the person who
asked for research would have no way to tell.

**Privacy, stated honestly.** The topic is in neither the run name nor the artifact name,
because an anonymous caller can read both listings on a public repository. But
`workflow_dispatch` inputs *are* visible on the run page to anyone with read access — this
reduces incidental exposure, it does not make a public run private. Sensitive research
belongs in a private repository on a plan that supports environments there; converting a
GitHub Free repository to private makes its protection rules and environment secrets
**ignored** rather than refused.

**Still unproven:** the runner-side `npm install -g firecrawl@<version>` path has never
executed. Closing it needs the environment, the secret, and one real dispatch.

**An artifact is transport, not archival storage.** Workflow artifacts last at most 90
days on a public repository and vanish with the run that produced them. Anything that must
persist gets committed.

## Transports

Two adapters behind one seam, chosen by `--transport`, `RESEARCH_KIT_TRANSPORT`, the machine
config, or a probe:

- **`firecrawl-cli`** — metered, spawned as an argv array with no shell.
- **`http-keyless`** — no key, no credits, grades its own capture completeness honestly.

## What is built

Everything the protocol needs: the corpus, the chain, the twelve checks, the verdict,
both gates, both transports, phase 0, the brief, the audit and its bundle.

And, since 2026-09-20, the **release-evidence validator layer** — which this file said
was "not built, deliberately" until it was. It was deferred by
[ADR-0022](../docs/adr/0022-build-the-protocol-kit-first-defer-the-release-evidence-validators.md)
because the sealed records and fixtures it validates were unavailable; they turned out to
be on this machine, and it was ported module by module under
[ADR-0029](../docs/adr/0029-the-validator-layer-arrives-as-a-source-not-a-donor.md).

| Validator | Answers |
|---|---|
| `release-validator.mjs` | R28–R32 release evidence: envelope, predecessor, role, visibility, promotion, path containment → `PASS` / `INCOMPLETE` / `FAIL` / `REOPEN` |
| `path-authority-validator.mjs` | Git-origin path-authority snapshots: schema, self-excluding envelope hashes, root containment, required origin proof |
| `fi-validator.mjs` | FI bundles: evidence manifest, sign-off sidecars, workbook projection |
| `r29-workbook-linkage-validator.mjs` | the R29 reviewer-workbook register: cross-task links, duplicate identities, pointer readiness |
| `ledger-conformance.mjs` | canonical-JSON, self-excluding, chain-hash and Ed25519 vectors |
| `fi-sidecar-conformance.mjs` | FI sidecar and manifest vectors: valid / malformed / tampered |
| `property-vector-conformance.mjs` | the property suite's findings, exported as fixed vectors |
| `property-replay.mjs` | capture a failing property seed once; replay it deterministically |

Every one of them is **read-only and offline**. No validator opens a socket, spawns a
shell, calls `eval`, or reads an environment variable — so none of them can use a
credential even by accident. The single exception is deliberate and narrow:
`property-replay` writes a captured failure with `flag: 'wx'` (`O_EXCL`), so a second
failure on the same seed cannot overwrite the first.

```
node research-kit/bin/researcher-release.mjs validate --root <records> --package R29 …
node research-kit/bin/researcher-release.mjs conform --root <dir> --schema <schema.json>
node research-kit/bin/researcher-release.mjs fi-validate --root … --workbook … [--report out.json]
node research-kit/bin/path-authority.mjs          conform | validate
node research-kit/bin/ledger-conformance.mjs      --vectors <packet.json> --json
node research-kit/bin/fi-sidecar-conformance.mjs  --vectors <packet.json> --json
node research-kit/bin/property-vector-conformance.mjs --vectors <packet.json> --json
node research-kit/bin/property-replay.mjs         --case <case-id>
```

Status maps to exit code — `PASS` 0, `FAIL`/`REOPEN` 1, `INCOMPLETE` 2, `BLOCKED` 3 — and
`--json` output is byte-deterministic across runs. The only command that writes anything
is `fi-validate --report <file>`, and only when you name the file.

**`validate` checks a package, not a file, so start from the worked example** rather than
from the schemas — the schemas give you the shape of each file but not how they refer to
each other:

```
node research-kit/examples/release-evidence/run-example.mjs
```

[`examples/release-evidence/`](examples/release-evidence/README.md) is six synthetic
packages: the smallest one that passes, four that fail one way each with the error code
named, and one that **passes** in order to show that a record the registry does not list
is never validated at all. All offline, no credential, and a test asserts they still
behave as their README says.

### Two languages, one answer

Three of the conformance runners ship **twice**, in Node and in Python:

```
bin/ledger-conformance.mjs          bin/ledger_conformance.py
bin/fi-sidecar-conformance.mjs      bin/fi_sidecar_conformance.py
bin/property-vector-conformance.mjs bin/property_vector_conformance.py
```

They read the same vector packets and must agree per vector, which the suite asserts.
The Python runners are **standard library only** — `ledger_conformance.py` implements
Ed25519 verification by hand rather than importing a crypto package, which is why it is
298 lines against Node's 140. Two independent implementations agreeing is a stronger
claim than one implementation tested twice.

Report hashes are *not* compared across languages, and deliberately: `reportSha256`
covers `implementation.runtime`, so it is a within-runtime determinism check. Equivalence
is asserted per vector.

### Two files that are deliberately absent

`trap-register.schema.json` and `dashboard-status-vectors.json` exist in the tree this
layer was ported from and are **not here**. Nothing ported references either — no module,
binary, test or fixture names them. Under ADR-0029 rule 4 nothing enters ahead of its
dependents, and a schema no code validates against is a file that will drift silently
until someone trusts it. They come with the code that needs them, or not at all.

## Credentials

**No credentials ship with this repository.** See the root
[README](../README.md#bring-your-own-keys) for where keys go; the summary is that the kit
reads one from the environment or `~/.agents/research-kit.config.json`, never from the
repository, and `--transport http-keyless` runs the whole collector with no key at all.

The validator layer needs none of this. `selftest.mjs`, `preflight.mjs` and every
validator CLI run offline with no credential — which is the point of a conformance suite
that a reviewer has to be able to re-run.

## Tests

```
node research-kit/bin/selftest.mjs            # all of it
node research-kit/bin/selftest.mjs gate hook  # just these files
```

753 tests, offline, no key and no network. The runner **awaits** every test, so `ok` means
the assertions settled (ADR-0021), and each test is raced against a watchdog
(`RESEARCH_KIT_TEST_TIMEOUT`, default 60s).

A prerequisite this host cannot provide - no POSIX shell, no git, no python - is reported
as `UNSUP` with its reason code and **blocks**. It is never a silent skip: a test that
returns early on a missing prerequisite prints `ok` having asserted nothing, which is
the same false green one layer up.

`test/hardening.test.mjs`, `test/index-gate.test.mjs` and `test/concurrency.test.mjs`
pin the defects confirmed in the 2026-09-16 researcher review, each named by its
F-number, so none of them can return unnoticed. The concurrency suite runs two real node
processes at one corpus.
