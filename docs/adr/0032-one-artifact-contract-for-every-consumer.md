# ADR-0032 — One artifact contract, and authorization is derived rather than asserted

- **Date:** 2026-09-21
- **Status:** accepted
- **Area:** delivery, packaging, authorization, provenance
- **Depends on:** ADR-0019 (one container format, written by hand), ADR-0031 (Actions-first delivery), ADR-0011 (the handoff is checked where the corpus arrives)
- **Evidence basis:** `docs/decisions/2026-09-21-delivery-architecture/research/BRIEF.md`

## Context

ADR-0031 chose an Actions collector that returns a ZIP. That decision leaves one question
open, and it is the dangerous one: **a collected corpus and an approved brief look exactly
alike from the outside.** Both are a `research/` tree with captures and a ledger. The
difference is three human steps that ADR-0013 and ADR-0017 deliberately refuse to enforce,
and the whole point of the gate is that those steps are what make evidence into permission.

A ZIP travels further than any other artifact this kit produces. From a runner to an
artifact store, to somebody's Downloads folder, to an agent's working directory, to a
teammate. At every hop the only thing carrying "this is not approved" is whatever the
package itself says — and by then nobody can ask the project it came from.

Four consumers need the same answer from it: an AI agent, a GitHub Actions workflow, a
future Windows application, and a person with an ordinary unzip tool. Four formats would
drift, and the field that would drift first is the one that matters.

## Decision

**One versioned ZIP contract, with a machine-readable entry point and a human one, and
authorization derived from the project's own gate rather than asserted by whoever packaged
it.**

### The rule the format exists to carry

```
An AI or application may build only when
  state == "APPROVED_BRIEF" && gate.verdict == "PASS" && buildAuthorized == true
```

It has one implementation, `authorizationProblems()` in `lib/artifact-validator.mjs`, and
the schema encodes it a second time through `if`/`then`/`else`. Both run. When the schema
catches a violation first, the authorization rule is still reported **in its own words**,
because `$.buildAuthorized: must equal false` is true, generic, and no use to somebody
deciding whether they have been handed a forged permission.

### Authorization is derived, never requested

`createArtifact` takes no authorization argument and the CLI has no `--build-authorized`.
A caller supplies **identity** — repository, ref, commit, workflow, run id — and nothing
about permission. `state`, `kind`, `buildAuthorized`, `review.*` and `gate.*` all come from
running the real gate over the real project, with `env` defaulting to an **empty object**
so a `GATE_OFF` in the packaging shell cannot become a property of a package that will
outlive that shell.

Two of the three review steps have honest machine answers. The third has a useful negative
one: re-run the extractor over the cached capture, and a `Finding` cell still byte-identical
to what the extractor produces was demonstrably never rewritten. That detects the
unreviewed case without pretending to grade the reviewed one — which is the line ADR-0013
drew and this does not cross.

### Two entry points, and they must agree

`manifest.json` is the contract; `README-FIRST.md` is the human one. The producer renders
the README **from the derived state**, so an approved package cannot ship the
"HUMAN REVIEW REQUIRED" banner and a collected one cannot ship "BUILDING IS AUTHORIZED".
A test asserts they agree. Where they ever disagree, the manifest wins, and both files say
so.

### A content-addressed inventory

`files[]` declares every entry except `manifest.json` and `manifest.sha256`, each with its
byte length and SHA-256. The manifest cannot carry its own digest and stay correct about
it, so the digest is a sibling file, written last, over the exact manifest bytes.
Undeclared entries fail; declared-but-absent entries fail.

### `client_ref` is optional, and the run id is canonical

ADR-0031 established that a caller pinning `X-GitHub-Api-Version: 2026-03-10` gets
`workflow_run_id` back from the dispatch. So `source.workflowRunId` is the canonical
identity, recorded beside the `apiVersion` that produced it — a run id without its API
version is a number whose provenance nobody can reconstruct. `clientRef` remains, nullable,
for display, retries and clients pinned to `2022-11-28`. It is refused rather than
sanitised when malformed: rewriting a caller's correlation token means the caller polls for
something the artifact does not carry, and the mismatch surfaces as a missing package
rather than as a bad argument.

### Artifacts are transport, not archival storage

E-03 of the evidence basis: 90 days maximum on a public repository, and deleting a run
deletes its artifacts. `privacy.safeForPublicDistribution` is `false` by default and the
topic is **never in the filename** — E-08 measured artifact listings as readable by an
anonymous caller on a public repository, so a filename leaks before anybody opens anything.
The topic lives in the manifest, where reading it is a deliberate act.

### The validator is offline, read-only, and refuses before it extracts

No network, no `process.env`, no shell, nothing from the package executed. Every structural
refusal — traversal, absolute paths, drive letters, backslashes, duplicates, case
collisions, entry count, declared size, compression ratio — is decided from the **central
directory**, before a byte is inflated. The central directory is attacker-controlled too,
so `inflateRawSync` runs with `maxOutputLength`: the ceiling is the runtime's to enforce
rather than a number this code compared against a field the attacker wrote.

`PASS` and `buildAuthorized` are **separate fields**, and the CLI prints the second in
words on a valid collected corpus, because exit 0 there is the most misreadable result the
tool produces.

## Alternatives considered

**A signed package.** Strictly better against a tampering attacker, and it needs a key,
a distribution story for that key, and a rotation story. The manifest digest plus the
per-file hashes detect corruption and casual editing, which is the threat a research
artifact actually faces in transit. A signature is the obvious next version and nothing
here forecloses it: `formatVersion` exists for exactly that.

**Trusting the producer's own state fields.** Simplest, and it makes `buildAuthorized` the
easiest field in the system to set and the most expensive one to get wrong.

**Separate formats per consumer.** An agent JSON, a workflow summary, a desktop bundle.
They would drift, and the field that drifts first is the authorization field.

**Checked-in binary fixtures.** Rejected: a reader cannot see what makes
`12-path-traversal` a traversal without unzipping it. Every fixture is generated by a
named mutation, so the diff that introduces one is the sentence describing it.

## Consequences

- `lib/artifact-zip.mjs` is a new module, separate from `lib/archive.mjs` on purpose: a
  writer that also parses hostile input grows a trust boundary in the middle of itself.
  `archive.mjs` stays the trusting writer ADR-0019 describes.
- The test tree gains a ZIP writer with no opinions (`test/artifact-fixtures.mjs`), because
  `archive.mjs` is correct and therefore cannot produce the hostile cases. It lives in the
  test tree so no shipped path can reach it.
- A `COLLECTION_FAILED` package legitimately has no ledger. The ledger is required when the
  package **claims evidence** — a declared `RAW_CAPTURE`, or `collection.captures > 0` —
  not merely when a `project/` directory exists. Found by running the producer against a
  freshly scaffolded project, which the first version refused.
- ZIP64 is not implemented and says so rather than guessing. A research corpus that needs
  it is a research corpus with a different problem.
- The desktop application named in ADR-0031 now has a contract to build against before it
  exists, which was the point of settling this first.

## What this ADR does not claim

That a valid package is a good one. The format proves a package is internally consistent,
unmodified since it was written, and honest about its own authorization state. Whether the
research inside it is any good is what the three human steps are for, and no schema will
ever answer it.
