# research-kit

The research-first kit: a collector that turns a fetch into cached, citable evidence, and a
gate that refuses to let a build start while a blocking fact is unproven.

Plain Node, no dependencies, no `package.json`. It installs with one command and runs
offline for everything except collection itself.

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
| `selftest.mjs` | the whole suite, offline |

## Transports

Two adapters behind one seam, chosen by `--transport`, `RESEARCH_KIT_TRANSPORT`, the machine
config, or a probe:

- **`firecrawl-cli`** — metered, spawned as an argv array with no shell.
- **`http-keyless`** — no key, no credits, grades its own capture completeness honestly.

## What is built, and what is not

Everything the protocol needs is here and tested: the corpus, the chain, the eleven checks,
the verdict, both gates, both transports, phase 0, the brief, the audit and its bundle.

The **release-evidence validator layer** from `docs/superpowers/specs/2026-09-16-*` —
R28–R33, the qualification ledger, path-authority snapshots, the FI workbook join, property
replay, the conformance vectors — is **not built**, deliberately and with nothing standing
in for it. The reasoning, and the alternatives rejected, are in
[ADR-0022](../docs/adr/0022-build-the-protocol-kit-first-defer-the-release-evidence-validators.md);
what was built and how it was verified is in
[the build report](../docs/build-report-2026-09-17.md), and the defects found and fixed
afterwards are in [the hardening report](../docs/build-report-2026-09-17-hardening.md) and
[the tier-3 report](../docs/build-report-2026-09-17-tier3.md).

## Tests

```
node research-kit/bin/selftest.mjs            # all of it
node research-kit/bin/selftest.mjs gate hook  # just these files
```

326 tests, offline, no key and no network. The runner **awaits** every test, so `ok` means
the assertions settled (ADR-0021), and each test is raced against a watchdog
(`RESEARCH_KIT_TEST_TIMEOUT`, default 60s).

A prerequisite this host cannot provide - no POSIX shell, no git - is reported as
`UNSUP` with its reason code and **blocks**. It is never a silent skip: a test that
returns early on a missing prerequisite prints `ok` having asserted nothing, which is
the same false green one layer up.

`test/hardening.test.mjs`, `test/index-gate.test.mjs` and `test/concurrency.test.mjs`
pin the defects confirmed in the 2026-09-16 researcher review, each named by its
F-number, so none of them can return unnoticed. The concurrency suite runs two real node
processes at one corpus.
