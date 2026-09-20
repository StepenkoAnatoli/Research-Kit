# research-kit

The research-first kit: a collector that turns a fetch into cached, citable evidence, and a
gate that refuses to let a build start while a blocking fact is unproven.

Plain Node, no dependencies, no `package.json`. It installs with one command and runs
offline for everything except collection itself.

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
| `selftest.mjs` | the whole suite, offline |

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

618 tests, offline, no key and no network. The runner **awaits** every test, so `ok` means
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
