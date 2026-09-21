# ARCHITECTURE — the map of the code

What each module owns, the seams between them, and which ADR governs each decision.
This is a map of the **code**, not of the research: `research/MAP.md` is the topic map —
a different artifact with a different job, judged by a different check.

Rule this map lives by (ADR-0007, generalised by ADR-0008): a commit touching this
project's **declared code paths** — for this repo, `research-kit/lib`, `research-kit/bin`,
`research-kit/hooks`, `research-kit/githooks`, declared in `research/kit.json` — carries
this file's update in the **same commit**. The commit gate refuses such commits without
it. What the rule proves is deliberately modest: the gate checks this file was **staged**
with the code, not that it is current — a whitespace edit satisfies it, which makes a
stale map a deliberate act rather than mere forgetting. A prompt, not a proof.

**This file describes what exists now.** Historical rationale — the defects that motivated
a design, the benchmarks behind a threshold, the alternatives that were rejected — lives in
[`adr/`](adr/), in the dated reports beside it, and in
[`architecture-history/`](architecture-history/README.md), and is linked from here. That
boundary was drawn on 2026-09-20, when this file had grown to 531 lines and a reader asking
*"where does this behaviour live?"* had to walk through several hundred lines of narrative
about defects that were already fixed. Nothing was deleted; it was moved and linked.

## The one picture

```
 git pre-commit (sh) ─┐                   runtime edit-time hook ─┐
                      ▼                                         ▼
                 bin/gate.mjs ──── lib/gate.mjs (evaluate) ─── lib/preflight.mjs
                 (CLI adapter)         │  ADR-0007                    │  the verdict
                                       │                              ▼
                                       │                       lib/checks.mjs
                                       │                 12 named checks, pure
                                       │                              │
                                       ▼                              ▼
                              lib/provenance.mjs ◄──────────── lib/corpus.mjs
                        hash-chained ledger, migrations      one corpus snapshot
                                                                      ▲
   bin/decompose.mjs ── lib/decompose.mjs ── lib/dimensions.mjs       │
        (phase 0 CLI)      (gathers, seeds)     (the checklist)  readCorpus()
                                                                      ▲
   bin/research.mjs ── lib/research-run.mjs ───────── lib/collect.mjs ── lib/finding.mjs
                       (budget, cache, plan)      collectOne, writeRaw     firstFinding:
                                                                      │     the auto-extracted
                                                                      │     Finding cell
                                                                      │ runScrape seam
                                                                      ▼
                                              lib/transport.mjs ──── one reader of the
                                              (which adapter)        operator's choice,
                                                    │                for BOTH sides
                                       fetch ───────┤
                                                    ├── lib/firecrawl.mjs       (the CLI)
                                                    └── lib/http-transport.mjs  (keyless, no deps)
                                      search ───────┤
                                                    ├── (either of the above)
                                                    └── lib/serpapi.mjs         (search only)

   lib/machine.mjs ──── everything outside the project (config, install state, git
   (ADR-0002, 0010,     hooksPath, posture, machine role collector|builder) — the only
    0020)                module that reaches past root. Reads the machine config in
                        THREE states: absent / readable / UNREADABLE

   lib/handoff.mjs ──── the arrival question on a builder: ledger present, every cited
   (ADR-0011, 0020)     capture on disk, chain verifies — a remedy per cause, no repair path
                        ▲ bin/handoff.mjs (the builder's first command)
                        ▲ lib/doctor.mjs (handoff-* findings, fail on role=builder)

   lib/scaffold.mjs ─── project shape: LAYOUT, the four GATE_MARKERS, templates
   lib/brief.mjs ────── research/BRIEF.md: the brief's shape (sections, the
                        judged two, the scaffold/draft/authored state) and the
                        reader lib/audit.mjs consumes — headings written from it
   lib/doctor.mjs ───── diagnostics: aggregates machine + project + gate + chain
   lib/installer.mjs ── installs the hooks, records/restores prior state
```

Release validation is a **separate path** — it shares the canonical primitives and nothing
else, and it never touches the corpus:

```
 bin/researcher-release.mjs ──── validate | conform | fi-validate
              │                  usage error -> exit 2, always
              ▼
   lib/release-validator.mjs ─── the facade: all 21 exports, unchanged
              │                  R28-R32 semantics, ledger anchoring, reduction
              ├── lib/release/json.mjs       duplicate-key-safe parsing
              ├── lib/release/canonical.mjs  canonical JSON, hashing, record shape
              ├── lib/release/schema.mjs     the JSON Schema subset
              └── lib/release/paths.mjs      containment
              │
              ▼
   schemas/ · ledgers · pointers · evidence manifests · FI sidecars
   read-only; CI diffs conformance/ and schemas/ after every run

 Node                                     Python
 bin/ledger-conformance.mjs           ─┬─ bin/ledger_conformance.py            ─┐
 bin/fi-sidecar-conformance.mjs       ─┼─ bin/fi_sidecar_conformance.py        ─┤ agree
 bin/property-vector-conformance.mjs  ─┴─ bin/property_vector_conformance.py   ─┤ PER
                                          bin/conformance_common.py            ─┘ VECTOR
                                          one canonicaliser, one float policy
 Never by report hash: reportSha256 covers implementation.runtime, so it differs
 between languages by design.
```

## Modules — what each one owns

### lib/ (the policy and the machinery)

| Module | Owns | Governed by |
|---|---|---|
| `core.mjs` | Generic primitives (fs, paths, dates, slugs) and the artifact constants — file paths and table headers. Knows no semantics. `makeSlug(text, fallback, limit)` slices **then** trims, so a cut landing on a separator never leaves one dangling. | — |
| `audit.mjs` | The audit family: immutable single-file snapshots under `research/audits/` (one full-corpus, one per COVERED/GAP subtopic), their versioning (`nextVersion`, fingerprint-driven, never overwritten), the **manifest reader** (`listVersions` → `{ known, topics }` with the one ordering, `resolveVersion` → one version's path or null), and the **bundle** (`zipAudit` → the latest main audit plus every subtopic audit of that version, in one `.zip` named after them). `bin/audit.mjs` prints what those return and does no ordering of its own, so there is exactly one place the ordering is decided. The bundle reads the manifest's `latest` pointers and never a directory listing, renders nothing, bumps nothing, and refuses rather than guesses: no audits / several topics unnamed / a manifest naming a file that is not on disk (ADR-0019). Derived artifact: reads the corpus, never writes back to it. Generated names are **budgeted**: `TOPIC_SLUG` (60) and `SUBTOPIC_SLUG` (28), because Windows MAX_PATH is 260 and the project root counts against it — this repository produced 114-character relative paths under a 157-character root, and `git add` refused until `core.longpaths` was set. The files already written are left as they are: they read, and renaming them would break both the manifest that names them and the history that holds them. **Containment resolves both sides the same way**: the file and the boundary are each realpath'd before comparison, so a project reached through a symlink still bundles its own files, and the plain-path comparison is kept alongside it to catch a manifest naming `../..` when the target does not exist ([history](architecture-history/README.md)). | — |
| `fi-validator.mjs` | Read-only FI (field-integrity) bundle validator: evidence-manifest and sign-off-sidecar schema conformance, the `FI_IDS` set and `FI_STATUS_PRECEDENCE` reduction, and `readFiWorkbookProjection` — which inflates a workbook entry with `zlib.inflateRawSync` to read a projection out of it without unpacking anything to disk. Depends on `release-validator.mjs` for canonical hashing and schema running; nothing else. Writes nothing. | ADR-0029 |
| `ledger-conformance.mjs` | The offline, cross-language qualification-ledger conformance runner: five vector kinds (`canonical-json`, `canonical-float`, `self-excluding-hash`, `chain-hash`, `ed25519`), strict packet loading, and a deterministic report. Reads only; the sole `fs` call is `readFileSync`. `loadLedgerVectors` pins `packetVersion`, `profile`, the signature profile (`Ed25519` / `base64url-no-padding`), a non-empty vector list and unique vector ids — a packet that drifts is refused rather than partly run. Two details carry more weight than their size: `base64urlBytes` rejects a signature that does not survive a canonical base64url round-trip, so an alternative encoding of the same bytes is not quietly accepted; and the packet's own SHA-256 is attached with `enumerable: false`, so it can be reported without entering the canonical JSON that is hashed. **`reportSha256` covers `implementation.runtime`**, i.e. `process.version` — so it is a within-runtime determinism check, and cross-language agreement is asserted per-vector, never by comparing report hashes. | ADR-0029 |
| `fi-sidecar-conformance.mjs` | The second half of the conformance foundation: classifies FI sign-off sidecars and evidence manifests as valid, malformed or tampered, against a vector packet, with a Node and a Python runner that must agree. Read-only — no writes, network, spawn or eval in any of the three files. One of its four tests exists to check the FIXTURE rather than the code: that the vector packet stays synthetic and carries no completed evidence, so a conformance suite cannot quietly become a place real sign-offs are stored. | ADR-0029 |
| `property-replay.mjs` | Captures a failing property seed once, as a self-describing replay envelope, and replays it deterministically afterwards. The **only ported module that writes**, and it writes exactly one way: `fs.writeFileSync(file, …, { flag: 'wx' })` — `O_EXCL`, so write-once is the kernel's decision rather than a check that can race. Three layers guard it: an `existsSync` fast path, the exclusive flag, and an `EEXIST` catch that returns the **existing** envelope with `created: false`. A second failure on the same seed therefore cannot overwrite the first, which is the point — the first failure is the evidence. Identity binds `family`+`seed`+`iteration` three ways at once: the filename, the `caseId`, and `inputSha256`; `validateRegression` re-derives the `caseId` and refuses a mismatch. `regressionSha256` self-excludes before hashing, so tampering with any field is caught. Everything after capture is read-only. | ADR-0029 |
| `property-vector-conformance.mjs` | Exports the property suite's canonical-hash and graph findings as a static vector packet, and re-verifies them — in Node and in Python, against the same file. Read-only in all three files. Its value is that it turns property tests, which generate their own inputs and could drift with the generator, into **fixed vectors a second language can check**: canonical hashing invariant under object insertion order and sensitive to authored array order, predecessor closure across generated chains, and descendant invalidation that is transitive, sorted, duplicate-free and permutation-invariant. Two of its five tests guard the fixture rather than the code — that the exported vectors stay synthetic, and that the exported graph and hash values stay bound to the property seeds that produced them. | ADR-0029 |
| `r29-workbook-linkage-validator.mjs` | Cross-reference validator for the R29 reviewer-workbook linkage register: 24 task ids, six expected reference kinds (task/gold/source/calibration/warm/lock), and a status reduction that takes the worst of `PASS < INCOMPLETE < FAIL < REOPEN`. **Zero imports** — it is 58 lines of pure functions over `{ register, catalog, pointer }` passed in as arguments, so it touches no filesystem, no network and no clock, and the caller owns every input. That is also why it needed no sealed-record fixture: its tests synthesise a register into a temp directory rather than shipping one. A revoked lock pointer reduces to `REOPEN` rather than `FAIL`, which is the distinction the rank order exists for — a withdrawn approval is not the same as a broken link. | ADR-0029 |
| `config.mjs` | A **compatibility shim**, nine lines, re-exporting `machine.mjs`'s config surface so an older import path keeps working. It adds nothing and decides nothing. Listed because it was the one module in `lib/` this map did not mention — found by counting files against rows during the 2026-09-20 reconciliation, which is the only way that kind of omission surfaces. | ADR-0002 |
| `archive.mjs` | **One container format**: `buildZip(entries)` → bytes, `writeZip(file, entries)` → `{ file, bytes, entries }`, `crc32`, `entryName`. ZIP with deflate (store when deflating would only grow the payload), written because the kit has no dependencies and cannot shell out to a `zip` binary that may not exist. Knows the container and nothing else — what goes inside a bundle is `lib/audit.mjs`'s. Refuses entry names that are not plain relative paths (an archive must not unpack outside its folder) and an archive with no entries. See ADR-0019. | ADR-0019 |
| `artifact-zip.mjs` | **Reading a ZIP somebody else wrote** — the opposite job from `archive.mjs`, and a separate file on purpose: a writer that also parses hostile input grows a trust boundary in the middle of itself. `openZip(bytes)` → `{ entries, names, problems, has, read }`, plus `checkEntryName`, `readCentralDirectory`, `inspectEntries`, `readEntry` and the exported `ZIP_LIMITS` (entry count, total and per-entry uncompressed bytes, ratio + floor, name length) so tests drive the refusal paths with small fixtures instead of real bombs. **The order of operations is the security property**: every structural refusal — traversal, absolute, drive letter, backslash, NUL, duplicate, case collision, symlink/special entry, encryption, unknown method, counts, sizes, ratio — is decided from the **central directory before one byte is inflated**. The directory is attacker-controlled too, so it is never the only defence: `inflateRawSync` runs with `maxOutputLength`, making the ceiling the runtime's to enforce rather than a number compared against a field the attacker wrote. Names are judged as raw text, never `path.normalize`'d first — normalising would let `a/../../b` become `../b` and then be judged, when the honest answer is that `..` has no business in a research artifact. Touches no filesystem: entries come back as buffers. ZIP64 is refused rather than half-read. | ADR-0032 |
| `artifact-validator.mjs` | **Is this package valid, and does it authorize a build** — two questions, kept apart. `validateArtifact({ file, expectedClientRef })` → `{ status, buildAuthorized, packageId, clientRef, workflowRunId, state, errors, warnings }`, where `status: 'PASS'` means internally consistent and says *nothing* about permission. Offline and read-only by construction: no transport imported, `process.env` never read, nothing from the package executed, no shell, and the only write is a `fs.mkdtemp` copy of `project/` removed in a `finally` — needed because the chain and handoff checks are the kit's existing code (`readCorpus`, `verifyHandoff`) and reuse beats a second implementation of provenance verification nobody tested. Stable error codes (`ZIP-*`, `MANIFEST-*`, `FILE-*`, `LEDGER-*`, `CAPTURE-*`, `AUTHORIZATION-INCONSISTENT`, `SECRET-DETECTED`, `FORMAT-UNSUPPORTED`, `CLIENT-REF-MISMATCH`) and **never a secret value in an error** — the report names the pattern and the line. `authorizationProblems()` is the one implementation of the build rule; the schema encodes it a second time and when the schema catches it first the rule is still reported in its own words. An unsupported format **major** is `INCOMPLETE`, not invalid. A crash is `BLOCKED`, never `PASS`. | ADR-0032 |
| `artifact.mjs` | **Packaging a project without changing it, and deriving every authorization field.** `createArtifact` → `{ bytes, name, manifest, entries, derived }`; `writeArtifact` writes then **re-validates with the consumer's own validator** before reporting success. There is no `--build-authorized` and no option that reaches an authorization field: `deriveState(root)` runs the real gate with `env` defaulting to `{}` so a packaging shell's override cannot become a property of a package that outlives it. `mapClassified` and `briefReviewed` have honest machine answers; `findingsReviewState` answers the third **negatively** — a `Finding` byte-identical to what `firstFinding` re-extracts from the capture was demonstrably never rewritten, which detects the unreviewed case without grading the reviewed one (ADR-0013's line, uncrossed). `packageName` never carries the topic (an artifact listing is world-readable on a public repository) and falls back to `run-<workflowRunId>`; `checkClientRef` refuses rather than sanitises. Inventory sorted by ZIP path, manifest and digest appended **last**, digest over the exact manifest bytes. | ADR-0032, ADR-0031 |
| `mcp.mjs` | **The collector as a Model Context Protocol server**, and the first module in this repository built from an APPROVED BRIEF rather than from a plan - every design choice cites an E-row in `docs/decisions/2026-09-21-agent-interface/`. `handle(message, deps)` is a pure function of a JSON-RPC message plus injected transport, so the whole surface is tested offline. **stdio, not Streamable HTTP**: semantics are identical on both, so the difference is operational, and remote costs the entire OAuth 2.1 chain. **Two tools, not one** - `collect` returns a run id immediately, `fetch_corpus` returns a link - because a server cannot initiate a request, so the alternative is one call held open for minutes and an agent that loses a paid run when its process dies. **A `resource_link`, never embedded bytes**: the spec defines embedding but states no maximum size, so a link is the defensible option. **No tool takes a token** and a test asserts no parameter is credential-shaped. `PROTOCOL_VERSION` is pinned and a mismatch answers `-32022` with `data.supported`, the same discipline as pinning `X-GitHub-Api-Version`. `createStdioLoop` serialises chunk processing through one promise chain - overlapping `data` events were mutating the buffer concurrently, which a test caught. **DUAL-ERA**: `SUPPORTED_VERSIONS` is `['2026-07-28', '2025-11-25']` and `initialize` is implemented beside `server/discover`, because the specification is ahead of every shipped client - the official SDK at v1.30.0 declares `2025-11-25` as its latest and answered the modern-only first version with `-32601: unknown method initialize`. `initialize` **echoes** a serveable requested version and falls back to **legacy** rather than to this server's preference, because a client throws on a version it does not support. | ADR-0034 |
| `disclosure.mjs` | **What a public run actually exposes, measured rather than asserted.** Written because the opposite claim was documented first: the collector's header said dispatch inputs are visible to anyone with read access, and checking it found the topic in none of the readable responses. `probeRun` sends **unauthenticated** requests - there is no token parameter, and a probe that quietly authenticated would answer a different question while looking like this one. `summarise` separates `exposedNames` (true on any public repo, and the reason the topic is kept out of run and artifact names) from `exposedContent` and `exposedSubject`. `needleChecked` exists so a report can never let "false" read as "no": without a topic to search for, the rendering says **not checked**. An unreachable endpoint is a refusal to conclude, never a clean result. | ADR-0035 |
| `dispatch.mjs` | **Asking the collector to run, from outside GitHub** - the seam an agent or a desktop app uses. `dispatchCollection` (pins `X-GitHub-Api-Version: 2026-03-10` on the REQUEST, not merely in a comment), `waitForRun`, `listArtifacts`, `downloadArtifact`, `unwrapArtifact`, plus `tokenFromEnv` and `redact`. **No token may be passed as an argument** - `tokenFromEnv` is the only way in, because a credential on a command line reaches the shell history, `ps`, and any log that echoes its own command; a test asserts the source contains no token flag. `redact` is PATTERN-based rather than "remove the token we hold", so it also catches a credential the process was never given - one echoed back by a server, a proxy, a redirect. A **204** is a named `NO_RUN_ID` failure explaining that the server served `2022-11-28`, never an empty success: "the run started and I cannot tell which one" is the failure a caller is least able to diagnose from a status code. `waiting` is reported as a status, not a stall - it means a protection rule is holding the job. `unwrapArtifact` opens GitHub's outer ZIP through the same distrustful reader, and passes a hostile or ambiguous container through untouched for the validator to refuse rather than guessing at packaging depth. Every request goes through an injectable `fetch`, so the whole module is tested offline. | ADR-0033, ADR-0032 |
| `brief.mjs` | The phase-1 → phase-2 handoff: renders `research/BRIEF.md` from the corpus, and **owns the brief's shape** — `BRIEF_SECTIONS` (six sections, the two that are judged marked), the markers that distinguish *still the scaffold* from *the drafter wrote this* (`briefState` → `template \| legacy \| draft \| authored`), and the section reader (`briefSection` / `judgedSection`) that `lib/audit.mjs` consumes instead of regexes of its own. The renderer writes headings **from** that definition, so the writer and its readers cannot drift; the scaffold ships `BRIEF_FILE_MARKER`, which the substitution pass leaves alone — the alternative, matching the template's prose, made a sentence of English load-bearing. | — |
| `corpus.mjs` | The research corpus: **one reader** (`readCorpus`, `readCaptures`, `parseTable`, `parseCapture`, `readOverrides`) and **one writer family** (`appendRow`, `upsertRow`, `appendJsonLine`, `writeRaw` lives in collect), plus the **cache decision** over the capture index (`cacheDecision`) — the one freshness predicate the collector, the run, and phase 0 consume. Table machinery: `splitRow`/`escapeCell`/`tableRow`/`repairRowArity`. Malformation is reported, never absorbed. The capture index has one constructor (`captureEntry`, used by `readCaptures` **and** by the collector when it has just written a page) and one writer (`rememberCapture`), so the index a run keeps in memory holds the same shape as the index read from disk — callers store the entry they are handed and shape nothing. The format's **joins** are here too: `traceOf` (evidence row → the fetch that produced it and the capture behind it), `captureOf` (row → capture, via the by-file index the reader builds), and `claimOf` (unknown → the claim it rests on, first cited row, falling back to the unknown's own text). Five consumers re-derived those joins, including the subtle "an empty Raw cell matches on the URL alone" clause; now a format change lands in one place. | ADR-0003 |
| `transport.mjs` | **Adapter selection**, and the one reader of the operator's transport choice — now for **two sides** (ADR-0027). The *fetch* ladder is unchanged: `--transport`, `RESEARCH_KIT_TRANSPORT`, the config's `transport`, then auto-detection (`probeFirecrawl` — authenticated or anonymous CLI wins, otherwise keyless). The *search* ladder mirrors it: `--search-transport`, `RESEARCH_KIT_SEARCH_TRANSPORT`, the config's `searchTransport`, then one auto-detect rule — a SerpAPI key wins, otherwise **the search side IS the fetch provider**, so a machine with no key behaves exactly as before. `selectTransport` returns `{ name, adapter, why }` still meaning the FETCH side, with `search` added alongside; that is what let six call sites stay unedited. Exposes `TRANSPORTS`/`TRANSPORT_NAMES` (whole-shape adapters), `SEARCH_PROVIDERS`/`SEARCH_PROVIDER_NAMES` (a **separate** map — a search-only module in the first would make `ADAPTER_SHAPE` a claim it no longer keeps), `FETCH_SHAPE`, `SEARCH_SHAPE`, `satisfies`, `isSearchOnly`, `selectSearch`. `isSearchOnly` reads a module's declared `CONTRACTS` rather than duck-typing, because a search-only module exports `scrape` on purpose — to refuse by name. | ADR-0005, ADR-0027 |
| `serpapi.mjs` | A **search-only provider**: the first module here that satisfies one contract instead of the whole adapter shape, declared as `CONTRACTS = ['search']`. Produces no capture, so nothing it returns reaches the fetch ledger and `transport-provenance` is untouched. Sends exactly `engine`, `q`, `api_key` — **no result-count parameter**, because none is documented and a response costs the same whatever it carries, so `limit` is applied client-side; `no_cache` and `async` are never sent, which keeps the vendor's free 1-hour cache. The key is read from `SERPAPI_API_KEY` or the config's `serpapiKey`, **never from a repository**, and travels to the child on **stdin** rather than argv so it never enters the process table. The request URL — the one string that contains the key — is built in the child and never returned; `redact()` scrubs it from vendor error text on the way back, and `command()` renders it pre-redacted. **A query that contains the key is refused before transmission**, because `cmd` is written into the hash-chained ledger (a committed file) and because sending it would store the credential as a search term on the vendor's systems for 31 days; redacting the rendering alone would have fixed the smaller half. Async `fetch` behind a synchronous shape via the same self-exec rendezvous `http-transport.mjs` uses. `status()` answers from configuration alone and **declines to report a remaining allowance**, because no endpoint this project has captured reports one. `requestUrl(query, key, endpoint)` is exported so the exact parameter set is testable rather than buried in the child — the guarantee worth pinning is negative, and negative guarantees rot silently. The **endpoint is overridable and guarded**: `allowedEndpoint` permits the vendor's own host over https, or loopback, and nothing else. That exists so the whole path — parent, `spawnSync`, child, real `fetch`, real socket — can be driven against a local stand-in instead of being exercised once by hand and called verified; an overridable endpoint on a request carrying an API key is otherwise an exfiltration route, so **both halves check it**, the parent before spawning and the child before fetching, because the child reads its job off a pipe and does not get to trust it. The one thing no stand-in can prove — that the two meters really are separate — is covered by `test/live-collect.test.mjs`, an **opt-in** test (`RESEARCH_KIT_LIVE=1` plus a key) that drives `bin/research.mjs` through a real collecting run in a temp project and asserts the Firecrawl spend against the pages fetched. Opt-in because running it on every suite would cost every developer credits forever; existing because "it costs money" is a reason to gate a test, not to skip it. | ADR-0027 |
| `http-transport.mjs` | The **keyless adapter**, and the second one - which is what makes the transport seam real rather than hypothetical. Pure Node ESM, no dependencies: built-in `fetch` driven synchronously through a child-process rendezvous (it re-execs itself with a JSON job on stdin), a word-density main-content extractor, HTML→markdown, DuckDuckGo-lite search, same-domain link mapping. Exposes the **same seven-function shape** as the Firecrawl adapter (pinned by test), never reads an API key, never charges a credit, stamps `transport: 'http-keyless'`, and grades its own `completeness` (`full` only ≥1500 chars of markdown, else `partial` — an honest self-assessment the capture-completeness check then judges). | ADR-0005 |
| `collect.mjs` | One URL's journey: `collectOne` (cache, force, fail entries, evidence/source rows) and `writeRaw` (the capture writer, which hands back the corpus's own index entry). Consumes the `runScrape` seam; stamps `transport` and `completeness` from what the adapter declared — invents neither. The Finding cell a row is born with is `lib/finding.mjs`'s: the collector **imports** `firstFinding` and does not re-export it, so the extractor has one address. | ADR-0016 |
| `finding.mjs` | The auto-extracted **Finding** cell: `firstFinding(markdown, fallback)` — page markdown in, one line of prose out — over the heuristics behind it (boilerplate/tracking/nav/campaign regex families, the sentence splitter, the table reader, the tier-hero block skip, the graded score, the 220-character cap). Two arguments over ~460 lines: a deep module that was buried in the middle of another one until ADR-0016. Pure by construction — no filesystem, no corpus, no adapter — the one module a caller can exercise with a string. **`findingWithContext` is the real entry point** and returns `{ finding, excerpt, heading, signals, score }`: the same selection, plus where on the page it came from, the surrounding paragraph bounded to `EXCERPT_CHARS`, and which signals fired. `firstFinding` is a thin wrapper over it, so the sentence the collector writes and the excerpt a reviewer reads cannot be chosen by different code. **Ranking is one declared table, `RULES`** — 21 named rules, each with a weight and the reason for it, and `explainScore` returns the rules that fired alongside the total. Weights used to be two separate runs of `value += n`, one in `score()` and one in the selector, so the priority order could not be stated without executing the code and the number a reviewer saw could differ from the number that chose the sentence; a test now asserts no weight is applied outside `RULES`, and that the reported signals sum to the score. Heading context is an **ancestry stack**, not the last heading seen, so a claim under `#### Capacity` still knows it sits inside `## Pricing`. The policy is evidence-first: a measured quantity or a metering rule (**how** usage is counted, which often carries no digit) is strongest; where a sentence sits counts as much as what it says, so a terms-bearing heading and an FAQ answer both score while blog and careers copy is pushed down; and things that only look concrete — one row of a pricing comparison matrix, a number inside a sign-up prompt — are penalised enough to lose to plain prose. | ADR-0016 (superseding ADR-0009) |
| `evidence-context.mjs` | One unknown, everything it rests on, in one read-only answer: the unknown's wording and why it blocks, every evidence row it cites, each row's source title / URL / type / retrieval date, the Finding, a bounded excerpt of the capture chosen for overlap with that Finding, rows that supersede it, and other rows for the same URLs. **It decides nothing**: it writes no status, offers no verdict, and reports a gap rather than filling it — a test asserts the rendering contains no conclusion and says plainly that the judgement is the reader's, and structural tests assert it imports no verdict machinery and contains no write call at all - the architectural property, which a phrase-based check cannot give. The recorded status is printed LAST and labelled as a recording, because a verdict shown before the evidence anchors the reader. Where the extractor would now pick a different sentence than the row records, that is shown beside it, labelled a suggestion. Reads no environment variable and spawns nothing, so it cannot use a credential. | — |
| `research-run.mjs` | Many URLs, one run: plan/query/url fan-out, discovery, candidate selection, budget tiers (`DEPTH_SCRAPES`), cache policy. The coordinator; collectOne does the writing. Since ADR-0027 it drives **two** providers: `searchAdapter` defaults to the fetch adapter, so an un-updated caller is unaffected, and one bounded fallback covers a search-provider outage — reported, never absorbed, because it moves spend back onto the fetch budget. `searchUsage(root)` counts the search meter from the usage log per hour and per month; it **reports and does not block**, because the count is this machine's only and cannot tell a free cached repeat from a billed search, so a guard built on it would refuse work on a number wrong in the blocking direction. | ADR-0027 |
| `firecrawl.mjs` | **All** vendor knowledge: the CLI transport (`exec` seam, which carries an **argv array** and spawns with `shell: false` — no URL or query is ever concatenated into a shell string), the Windows `.cmd`-shim resolution (`resolveProgramPath`/`resolveInvocation`: full path off PATH+PATHEXT, a real `.exe` spawned directly, a `.cmd`/`.bat` run through cmd.exe as argv and only after every argument passes `cmdSafeArg` — a **denylist** of cmd.exe metacharacters (`CMD_UNSAFE_CHARS`), refused and never re-quoted — a **denylist**, so an ordinary query with a space passes while an interpreter character does not. `unsafeCmdArgs(argv)` is the plural reporting form and the **single owner** of "which arguments would be refused": `resolveInvocation` calls it rather than filtering inline, so the refusal and the message naming the offenders cannot drift apart. Measured against the allowlist the ADR-0029 source tree still uses, the two agree on every character that can break out of cmd quoting — `"` `%` `&` `|` `<` `>` `^` `(` `)` `` ` `` tab newline — and differ on `'` `{` `}` `\` and **any non-ASCII character**, which an allowlist of ASCII punctuation refuses by construction. That is why `é` is a permitted argument here and a hostile one there, and why that tree's hostile-argv corpus could not be ported), payload normalisation (`normalizeSearch`/`normalizeScrape`/`normalizeMap` — `normalizeSearch` reads the CLI's real `{success, data: {web: […]}, creditsUsed}` object, pinned at `test/fixtures/firecrawl-search-1.23.3.json`), status parsing (`--status`, the flag; `firecrawl status` is not a command), `map`/`search`/`scrape` adapters. `command(args)` survives as a **display-only** rendering (dry-run output, the ledger's `cmd` annotation) that nothing executes. Stamps `transport: 'firecrawl-cli'` — narrowed to `firecrawl-cli-anonymous` by `transport.mjs` when the CLI has no credential — and **grades** completeness at the 1500-character bar rather than asserting `full`. | ADR-0005, ADR-0020 |
| `bin/mcp-server.mjs` | The stdio entrypoint an MCP client launches as a subprocess. No flags: a stdio server's configuration is its environment. **stdout carries messages and nothing else** - a stray `console.log` corrupts the stream and surfaces as a malformed response to whatever request was in flight - so every diagnostic goes to stderr, including the one line reporting whether a credential was found. | ADR-0034 |
| `bin/disclosure.mjs` | Probes a run and reports what a stranger can read. Exit codes ARE the finding, so it can gate something later: `0` shape only, `1` content readable, `2` subject leaked, `3` could not measure. An unknown flag matching token/auth/key/secret is refused with the reason - authenticating this probe would answer a different question. | ADR-0035 |
| `bin/collect-remote.mjs` | The one command an agent or a desktop app needs: dispatch the collector on GitHub, learn which run it started, wait, download, unwrap, and validate with the same code a human would run. Prints the run id **before** it waits, so a caller that dies mid-wait can still find its run - and a caller that never sees that line knows the dispatch itself did not land. **No `--token` flag**, and an unknown flag matching token/auth/key/secret/pat is refused with the reason rather than the spelling. Exit codes separate the four things a caller does differently about: `0` valid (still not authorized to build), `1` invalid package, `2` run failed or incomplete, `3` could not start, `4` dispatched and still running with the run id on stdout. | ADR-0033 |
| `bin/researcher-release.mjs` | The release CLI: `validate`, `conform`, `fi-validate`. **A usage error returns 2 from every subcommand**, and a status maps to its own code — `PASS` 0, `FAIL`/`REOPEN` 1, `INCOMPLETE` 2, `BLOCKED` 3. `4` is the unrecognised-status fallback and never a usage error, so a caller can distinguish "did not run" from "ran and produced something unknown". | — |
| `release-validator.mjs` | Read-only R28–R32 release evidence validation: envelope/predecessor/role/visibility/promotion checks, ledger anchoring, and deterministic `PASS`/`INCOMPLETE`/`FAIL`/`REOPEN` reduction. It never rewrites records, pointers, registries, or role rosters. **Also the facade** over the four primitives below: all 21 of its original exports are re-exported unchanged, so the eighteen files importing from it were not touched. 1324 → ~1010 lines. | R28–R32 validator contract |
| `release/json.mjs` | Duplicate-key-safe JSON parsing. `JSON.parse` keeps the *last* duplicate key silently, which for a hashed record is the difference between one payload and a different payload with the same digest; it also refuses a UTF-8 BOM, which `JSON.parse` accepts and hashing does not. | — |
| `release/canonical.mjs` | Canonical JSON, SHA-256, `same` (canonical equality), and the flat-vs-nested record shape (`metaOf`/`payloadOf`/`nestedRecord`) plus the hashes built on it. The most-reused primitive in the kit, and the one place duplication has already cost this repository — three Python runners each carried their own copy of this algorithm, two drifted, and one document hashed to two different digests. | — |
| `release/schema.mjs` | The JSON Schema subset the checked-in schemas actually use. The release contract deliberately has no runtime dependency on Ajv or a package manager, so this implements that vocabulary and nothing more — a keyword left silently unimplemented accepts everything, which is the failure mode that matters in a validator. | — |
| `release/paths.mjs` | Containment (`inside`, `safePath`). Security-sensitive: a registry names its own record paths and can arrive from another machine with a corpus, so without this a manifest could point anywhere. Checked before the read and again against `realpath`. | — |
| `path-authority-validator.mjs` | Read-only Git-origin/path-authority snapshot validator: strict envelope schema conformance, self-excluding canonical envelope hashes, portable root/realpath containment, isolated-environment coverage, required Git-origin proof, artifact-diff classification, and deterministic status reduction. It never writes snapshots, transcripts, profiles, Git config, or release state. | Git-origin/path-authority snapshot validator contract |
| `decompose.mjs` | Phase 0 coordination: recipe parsing, docs-host discovery, material gathering (scrape-budget accounting via the corpus's `cacheDecision` — a cache hit is not an attempt), draft MAP writing. Contains **no judgment** — it seeds the checklist and gathers material; it never writes a status. | — |
| `dimensions.mjs` | The universal, domain-agnostic subtopic checklist and its mechanical presence-matching (`coverageOfUniversals`). Recipes add on top of it; nothing replaces it. | — |
| `provenance.mjs` | The tamper-evident fetch ledger: `appendFetch`, `verifyLedger`, `rebuildLedger` (the one metadata-migration path — guarded, per-entry `migrations` records, chained `op: 'migration'` boundary), and the overrides log writer. Also **the collector's exclusive section** (`withLock`), acquired with `O_EXCL` (`flag: 'wx'`) so the kernel refuses a second creator instead of letting it overwrite; staleness is judged only *after* EEXIST proves someone holds the file, and a fresh lock that names no pid — the window `O_EXCL` leaves between create and write — is waited for, never broken. Reentrant in-process, so `appendFetch` can serialize its own read-modify-write inside a run that already holds the lock, and release removes only the acquisition it made (pid + nonce). Every writer of the chain — append, tail repair, rebuild — goes through that one lock. `verifyLedger` also **classifies** a body hash that does not recompute (`isLineEndingRewrite`, `hashText`): folding CRLF back to LF either restores the recorded hash or it does not, so `body-unmodified` problems carry `kind: 'line-endings' | 'modified'` and the consumer can name the right cause instead of guessing (ADR-0020). | ADR-0003 (corpus-adjacent), ADR-0020 | **Release is ownership-positive (fixed 2026-09-21):** the lock is unlinked only when the nonce POSITIVELY matches. An unreadable lock is left alone — while a collector works its lock can be truncated, recovered as stale by a second collector and replaced by that collector's own, and unlinking then would delete a lock this process does not hold and admit a third writer to the section. Failing to release is recoverable by the staleness path; deleting someone else's is not.
| `checks.mjs` | The **ordered contract-check registry**: discovery-contract, citations, provenance, transport-provenance, gate-integrity, unknown-closure, subtopic-coverage, capture-completeness, **evidence-supersession**, collection-attempts, hygiene, corpus-shape — twelve, in a pinned order. Every check is a pure function of the corpus snapshot + options; none reads the filesystem. **`supersededRows(corpus)`** is the one shared answer to "which rows have been replaced by a fresher capture of the same URL": `evidence-supersession` refuses an unknown still resting on a replaced row, `transport-provenance` goes quiet about a replaced row nothing relies on (but not about one still cited), and `hygiene` stops calling a refresh a duplicate while still catching two rows of one URL fetched the same day. Those last two are ADR-0026-aware: they warn about the state that ADR requires. | ADR-0004, ADR-0026 |
| `preflight.mjs` | **The verdict** and the **verdict context**. Assembles findings from CHECKS into pass/fail; one function, three callers (commit gate, edit gate, CLI) so they cannot disagree. Owns the verdict's input unit: `verdictContext(root)` reads the corpus, the gate state (`readGateState`), and the operator's `evidencePolicy` together — same snapshot, same verdict, by construction. | ADR-0004 |
| `gate.mjs` | Gate policy: `isGated` (the four markers), `evaluate` (commit/edit), the GATE_OFF override recording, and the architecture-map rule (`architectureMapBreach` over `loadGateConfig` — guarded paths are project configuration, `research/kit.json`, defaults `src/lib/bin/scripts/app`). Contains no repo-specific path. **One deliberate exception to "no CLI parsing"**: the commit gate's staged-path list arrives as *data on a pipe* (`stagedPathsFromStdin` / `splitPathList`), because argv was O(n²) to build and bounded besides. It returns **null for "stdin could not be read" and `[]` for "read, and empty"** — conflating them would hand the verdict an empty staged set, which it allows, i.e. a gate that silently stops gating. `stdinIsReadable()` asks `isatty(0)` rather than inferring from the file type, which gets two cases wrong in opposite directions (a socketpair is not a FIFO; `/dev/null` is a character device but reads as immediate EOF). | ADR-0002, ADR-0007, ADR-0008, ADR-0020 | **An unreadable index BLOCKS (fixed 2026-09-21).** The commit gate judges staged bytes (ADR-0024); when `git checkout-index` fails it used to judge the working tree and note that it had. Noting is not enough — the two differ exactly when it matters, so an environmental git failure silently reinstated the defect ADR-0024 exists to prevent. It now blocks with `judged: 'nothing'` and names `--no-verify` as the recorded override. A project that is not a git repository still judges the tree: there is no index to fail to read. Index materialisation is also **chunked** (250 paths per call) rather than spreading every tracked path into one argv, which on Windows hit the ~32k command-line cap for a large corpus and produced exactly that git failure.
| `doctor.mjs` | Read-only diagnostics: machine + project + gate + chain health in one report. Consumes the verdict context (`verdictContext` / `readGateState`) for the chain-verified corpus and the gate-state triple; adds one machine read of its own (the git-resolved `hooksPathEffective`) for report. **Role-aware** (ADR-0010): the Firecrawl findings are informational on a `builder`, and the handoff findings (ADR-0011) are blockers there — the collection entrypoints' refusal is what makes that split honest. The handoff findings come from the owner, not from a second composition: doctor passes the corpus it already read to `verifyHandoff(root, { corpus })`, so the arrival question has one implementation and one set of pins. One deliberate write: the repository-local hooksPath override log (the third override is silent by nature — the bypassed hook cannot report it). `gateHealth` and `runDoctor` accept explicit Git/config/settings paths and a child environment so diagnostics can run against disposable machine fixtures without consulting host state. | ADR-0010, ADR-0011 |
| `machine.mjs` | **Everything outside the project**: machine config (fail-open posture, `editGate` mode and settings path, `evidencePolicy`, `role`), read in **three states** — `absent` (nothing configured; the fail-open default is the answer), `readable`, and **`unreadable`** (the file exists and does not parse), which holds the last config that parsed from a snapshot beside it and, with nothing to hold, **fails closed**. `readMachineConfig()` returns the settings *and* `state`/`source`/`error`, because the settings alone cannot say whether fail-closed was configured or is the fallback this machine adopted (ADR-0020). Install state, git `core.hooksPath` (scope-aware readers), and the **runtime anchors** — `RUNTIME_ANCHORS`, the one place a runtime's paths are named (settings file, personal skill roots, project-relative skill dir), each a default that `runtimePaths()` / `skillLocations()` let the machine config override (ADR-0012); Git readers/writers accept an explicit child environment, preserving production defaults while allowing R1's disposable machine/Git fixture to isolate global/system origins; reads a retired config key's value into the current shape rather than
dropping a setting the operator had tightened, and reports a retired ENVIRONMENT
variable (`CLAUDE_SETTINGS_PATH`) without ever honouring it. Owns the machine role and the collection policy that follows from it (`machineRole`, `collectionPolicy`, `collectionRefusal`) — the single answer to "may this machine collect?". The only module that reaches past the project root. | ADR-0002, ADR-0010, ADR-0012 |
| `handoff.mjs` | The **arrival question**: `verifyHandoff(root)` reports a ledger that is absent or empty, every capture an evidence row names that is not on disk, and a chain that does not verify — each named. Read-only by design: the machine that asks cannot collect the missing bytes. The report also carries `lineEndings`, the captures whose body hash fails *only* because git rewrote CRLF into them on checkout, and **`handoffRemedy(report)` picks the remedy from the cause** rather than printing one text for every way a corpus can look broken (ADR-0020): `HANDOFF_REMEDY` when something did not travel (the collector must push `research/raw/`, dotfiles included), `lineEndingRemedy` when everything travelled and this machine rewrote it (pin with `.gitattributes`, re-check out, touch no collector and spend no credits), both when a report holds both. Consumed by `bin/handoff.mjs` and doctor (blocker on `role=builder`, silent on a collector; doctor passes the snapshot it already read, so the question is composed once for both). | ADR-0011, ADR-0020 |
| `bundle.mjs` | The **archive this project arrived as**, and how far the tree has moved from it. `BUNDLE_INDEX.md` lists 80 SHA-256 digests taken at the 2026-09-17 handover; until ADR-0028 **nothing had ever read them**, which is how ADR-0022 could treat them as a constraint for three days without noticing the constraint was already violated. `verifyBundle(root)` sorts every entry into unchanged / drifted / unexpected / missing, where "drifted" means a file in `EXPECTED_TO_DRIFT` — the corpus, the map, the ADR index, the manifest itself, (from 2026-09-20) `CONTEXT.md` and the root `README.md`, which are documentation ABOUT the code and go stale the moment it moves, and (from 2026-09-21) `AGENTS.md`, which is the file the agent protocol is *written in* — caught drifting by this check when ADR-0030 gave decision research a committed home and the rule that sends an agent there had to be where agents read their rules — each of which moves because one of this project's own rules *requires* it to. The list is deliberately narrow: exempting a planning document would leave the report unable to say anything, and a test asserts none is exempted. Hashes **bytes**, not decoded text. Reports; never fails a build — a changed file is a fact about history, and the only thing that makes it a problem is nobody knowing. | ADR-0028 |
| `git-config.mjs`, `config.mjs` | Compatibility shims → `machine.mjs`. | ADR-0002 |
| `runtime.mjs` | The host prerequisites a command actually needs: `checkNode` (22+), `checkGit`, `checkPython` (3.12+, reading either stream because Python 2 printed its version to stderr, trying `python3` **first** and continuing past an old interpreter rather than stopping at it — `python` is an alias for 2.7 on the most common Linux and older-macOS layout, and stopping there reported "no usable Python" with a good 3.12 one name away), and `requireRuntime({ node, git, python })` which exits **3** — distinct from a product failure — naming the missing piece and how to install it. Deliberately per-command rather than one gate that demands everything: Python is used by the cross-language conformance runners and nothing else, and a command that only reads the corpus has no business refusing to run because a language it never calls is absent. | — |
| `scaffold.mjs` | Project shape: `LAYOUT` (12 entries), the **four** `GATE_MARKERS` (pinned by ADR-0001 and its test), template rendering, placeholder validation, hook executability. `.gitattributes` is a LAYOUT entry but **not** a gate marker: a project without it still gates, it just breaks on a Windows builder (ADR-0020). | ADR-0001, ADR-0020 |
| `installer.mjs` | Installs the git hook (records/restores prior `hooksPath`) and the edit-time gate (backs up, repairs known corruption, refuses unfamiliar states). The hook was renamed (A10.4): the installer recognises a registration left at a retired name, replaces it rather than adding a second, and reports the repair — `retiredRepairNote`. | ADR-0012 |
| `render.mjs` | Terminal table rendering for CLI output. | — |
| `timeline.mjs` | TIMELINE.md generation and the diagnostics-log appender the gate CLI records through. | — |

**Not a module, but part of the map:** `examples/release-evidence/` (added 2026-09-20) is
six synthetic release packages plus `build.mjs` (regenerates them, keeping their hashes
correct) and `run-example.mjs` (validates what is **on disk**, and never calls `build.mjs`).
It exists because `researcher-release validate` checks a *package* — files that refer to
each other — and the schemas describe each file's shape while saying nothing about how
they connect, so the only way in was to assemble something plausible and learn the
relationships from error codes. One of the six **passes on purpose**: a record the registry
does not list is never validated, so `PASS` means "everything declared is intact", not
"nothing unexpected is here". `test/release-examples.test.mjs` asserts the packages still
produce their documented verdicts, that the committed files match what `build.mjs`
generates, and that the README's table names every package that exists and none that does
not.

`research.mjs` (→ research-run, refused on a builder by role), `researcher-release.mjs` (→
read-only R28–R32 validation and schema conformance), `handoff.mjs` (→
verifyHandoff, the builder's first command), `preflight.mjs` (→ the verdict), `gate.mjs`
(→ evaluate; `--staged-stdin` reads the piped path list; `--posture` answers 0 allow /
1 fail-closed / 2 unreadable-and-closed, so no shell has to parse JSON), `doctor.mjs` (`--fix-arity`), `install.mjs` (deploy + `--into` per-project
binding, role-aware next steps), `install-hooks.mjs` (`--fail-closed`, `--role`),
`new-project.mjs`, `decompose.mjs` (phase 0 CLI, refused on a builder by role),
`timeline.mjs`, `audit.mjs` (lists and resolves versions through the manifest's
reader), `brief.mjs` (drafts the handoff and reports the brief's state),
`path-authority.mjs` (offline Git-origin/path-authority snapshot validation and
schema conformance),
`researcher-release.mjs` (ported 2026-09-20, ADR-0029 — three subcommands over the two
validators: `validate` for R28–R32 release evidence, `conform` for schema-only checking,
`fi-validate` for an FI bundle. It **duplicates no validation**: every check comes from
`release-validator.mjs` or `fi-validator.mjs` through their public exports. Reads **no
environment variable at all**, so it cannot depend on a credential or a config. Status
maps to exit code — `PASS` 0, `FAIL`/`REOPEN` 1, `INCOMPLETE` 2, `BLOCKED` 3, unknown 4 —
and a **usage error exits 2 from every subcommand**, printing the usage block to stderr;
`test/support-policy.test.mjs` pins that by running the CLI. It writes exactly one thing,
only when asked: `fi-validate --report <file>`),
`selftest.mjs` (the whole suite, queued by the harness — which **awaits** every test,
so `ok` means the assertions settled; ADR-0021).

### Not lib, not bin — but load-bearing

- `githooks/pre-commit` — POSIX sh commit-gate wrapper. **Tracked as mode 100755**, and
  that is part of its contract, not a detail: git *skips a hook it cannot execute, and
  says nothing*. It was tracked 100644 until 2026-09-20, so every Linux and macOS clone
  of this repository had a commit gate that silently never ran — invisible on Windows,
  where `core.filemode` is off, and found in ten seconds by the first CI run on Ubuntu.
  `hooks/edit-gate.mjs` is deliberately *not* executable: it is invoked as
  `node hooks/edit-gate.mjs`, never directly. See ADR-0001 and `hookExecutability`.
  Fail-open when node or the kit is
  missing, with the one self-contained posture reader pinned to `lib/machine.mjs` by test (ADR-0002).
  The staged-path list is **piped** into the gate (`git diff … | node bin/gate.mjs …
  --staged-stdin`), never accumulated into argv: the old `set -- "$@" --staged "$p"` loop
  re-copied the whole growing list on every iteration, so the hook was O(n²) in staged
  files — 225 seconds of silence on 30,000 paths, which reads as git being broken. It is
  also **watchdogged** (`timeout`/`gtimeout` where coreutils exists, `RESEARCH_KIT_GATE_TIMEOUT`,
  default 120s), and a watchdog kill (124) is an *internal error* — named on stderr, then
  decided by the same fail-open / fail-closed posture as any other broken gate, never a hang
  and never a silent pass (ADR-0020).
- `hooks/edit-gate.mjs` — the edit-time adapter; `permissionDecision` semantics per E-05. The wire keys (`hookEventName: 'PreToolUse'`, `hookSpecificOutput`) are the runtime's protocol, not the kit's vocabulary (ADR-0012).
- `schemas/` — JSON Schema contracts consumed by `release-validator.mjs`; schemas are
  read-only inputs and are never generated or rewritten by the validator.
- `skill/SKILL.md`, `template/`, `recipes/` — the protocol as text. Recipes carry
  machine-readable frontmatter dimensions (specializations of `dimensions.mjs`, never replacements).
- `START_HERE.md` (kit root *and* `template/`) — the operator's twin of `AGENTS.md`:
  where things are, the three lines of starting research, the four-command resume
  block, one line on credits. Table-first, no protocol vocabulary, scaffolded into
  every project and deployed with the kit (ADR-0018). The two copies differ only in
  how the kit path is spelled (`~/.agents/research-kit` vs `{{KIT}}`). Not a
  `LAYOUT` entry: no rule needs it, so a project without it reports nothing.
- `docs/ARCHITECTURE.md` (this file) and `research/kit.json` — the map of the code and the
  declaration of what code it guards. Both travel with the scaffold (ADR-0008); both are
  LAYOUT entries, neither is a gate marker.

## The seams (where modules touch, and why testing stays offline)

### Qualification-ledger verification seam

`release-validator.mjs` exposes the read-only `verifyQualificationLedger` seam. It
checks canonical payload/record/chain hashes, duplicate event IDs, signed Ed25519
promotion pointers, promotion-commit target/closure links, and cached-head consistency.
Ed25519 verification consumes the raw 32-byte SHA-256 digest and requires canonical,
unpadded base64url signature text. `ledger-conformance.mjs`, its Node CLI, and the
standard-library Python runner execute one shared synthetic packet for those hash domains
and signature bytes; no runner holds private key material.
Qlog segments are scanned without mutation; unresolved prepare/intent records, torn
tails, missing commits, invalid signatures, or stale heads are `INCOMPLETE` and cannot
qualify a package. `researcher-release validate` enables it with `--ledger`, `--head`,
`--keys`, and `--genesis-hash`.

The same module exposes pure `computeDescendantInvalidation`, which authenticates
synthetic pointer identities, rejects cycles/missing roots before emitting output,
walks target ancestry with duplicate convergence, and returns package/generation/
record-ordered revocation projections for rollback planning.

### The shared Python conformance boundary

Added 2026-09-20. The Python runners exist to answer the same question a Node runner
answers, about the same packet, and to disagree loudly when the two implementations
differ. That only works if they canonicalise *identically* — and until this change they
did not.

Each of the three runners carried its own copy of the canonicaliser. Two were hand-written
byte-for-byte alike; the third reached for `json.dumps(sort_keys=True)`, which is a
different algorithm. The divergence was real and provable:

```
{"a": 1.0}    Node -> {"a":1}     sha 015abd7f...      Python -> {"a":1.0}   sha c29a44ab...
{"a": -0.0}   Node -> {"a":0}     sha 45b619e9...      Python -> {"a":-0.0}  sha 952b7dc4...
```

Cross-language agreement held only because **no vector in any packet contained a float**.
A suite that compares 28 chosen inputs does not establish that two functions agree; it
establishes that they agree on 28 inputs. The tests were green and the claim was false.

`bin/conformance_common.py` is now the single implementation — standard library only, like
the runners it serves. It holds canonicalisation, ECMAScript number formatting, JSON string
escaping, duplicate-key-rejecting parsing, the shared packet preflight, and report
rendering. Each runner keeps a thin binding and nothing else.

Two decisions in it are load-bearing:

- **`js_number` implements ECMAScript `Number::toString` directly** rather than
  post-processing Python's `repr`. Both languages produce shortest-round-trip digits, so
  the digits were never the problem; everything around them was, and each difference is a
  different SHA-256: `1.0`/`1`, `-0.0`/`0`, `1e-07`/`1e-7`, `1e+17`/`100000000000000000`,
  `1e-05`/`0.00001`. Post-processing `repr` would have caught the first four and missed
  the fifth, because the two languages switch to exponential notation at different
  thresholds — not at different *formats*.
- **`float_policy` is a required, named argument**, because the repository has two
  deliberate policies that were previously indistinguishable from a bug. `reject` refuses
  a float outright: the ledger and property vectors carry hashes and chain positions,
  where a float is meaningless and its presence means the packet is wrong, so refusing
  says more than canonicalising would. `normalize` formats it exactly as JavaScript
  would, for FI vectors describing documents that may legitimately carry one. An
  unrecognised policy raises rather than defaulting.

`ConformanceError` subclasses `ValueError` deliberately. Every runner's domain logic
already catches `ValueError` around a single document, because a malformed document is a
*vector result* — the FI packet carries one with a duplicate `fiId` whose entire purpose
is to be rejected and recorded as `FAIL`. A bare `Exception` escapes those handlers and
turns an expected failure into a crash.

**What the regression vectors can and cannot pin.** `qualification-ledger-vectors.json`
gained thirteen `canonical-float` vectors (`QL-F-01`…`QL-F-13`) covering both exponent
thresholds from both sides, the smallest denormal, the largest finite double, a repeating
fraction, nested floats, and a float beside integers in one array. Each declares
`floatPolicy` explicitly, and only `normalize` is expressible — which is itself worth
recording: **in JavaScript `1.0` *is* `1`**, so a Node runner parsing the packet has no
float left to reject by the time it sees the value. A `reject` vector would pass on the
Node side for a reason unrelated to the policy it claims to test. The reject policy is
therefore a Python-side property, tested directly in
`test/canonical-float-policy.test.mjs`, which hands real Python floats to the module
rather than routing them through JSON. That file also compares the two canonicalisers as
*functions* over inputs nobody put in a packet, and asserts structurally that no runner
has grown a fourth private copy.

1. **Transport seam** — `runScrape`/`search`/`scrape`/`command`/`map` are injected
   adapters (ADR-0005), chosen by `lib/transport.mjs`. Two *fetch* adapters exist — the
   Firecrawl CLI (`lib/firecrawl.mjs`) and the keyless HTTP one (`lib/http-transport.mjs`,
   same seven-function shape, pinned by test) — which is what makes the seam real rather
   than hypothetical. Since ADR-0027 the seam has **two sides**: a fetch provider and a
   search provider, resolved independently, with `lib/serpapi.mjs` satisfying the search
   contract alone. Every collection path is testable with no key, no credits, no
   network; the ledger's `transport` field records which adapter actually **fetched**,
   and `transport-provenance` judges that. A search records its provider separately — in
   the usage log, the failure log, and the ledger's optional `discoveredBy` on any entry
   whose URL a ranking chose — because who *chose* a page and who *fetched* it stopped
   being the same answer once there were two providers. A URL a person wrote into
   `plan.json` carries no `discoveredBy` at all, so its absence means "nobody ranked
   this". A search itself never becomes a ledger entry. A `cmd` string is an annotation
   and proves nothing.
   Inside the Firecrawl adapter there is a **second, narrower seam**: `exec(argv, opts)`.
   It carries an argv array, never a command string (ADR-0020) — the string form was the
   shell-injection vulnerability, because a URL and a query are attacker-controlled data
   in this kit's threat model (a `plan.json` travels through git; a query is pasted back
   from a web result). `spawn` and `platform` are injectable on that seam too, so both
   invocation routes — the shell-free POSIX one and the validated Windows cmd.exe one —
   are pinned by test on any host, and one test spawns a real stub CLI and then checks
   that the file an injected `$(touch …)` would have created does not exist.
2. **Corpus snapshot seam** — checks are pure functions over `readCorpus()` output plus
   options (ADR-0004). New rule = new check = new fixture test; the verdict never changes shape.
   The joins a consumer needs are the snapshot owner's too (`traceOf`, `captureOf`, `claimOf`),
   so "how a row points at its evidence" changes in one module and is proved by one fixture.
3. **Verdict seam** — one `runPreflight`, three consumers, and one owner of the
   verdict's inputs: `verdictContext(root)` in `lib/preflight.mjs` reads the
   corpus, the gate state, and the operator's `evidencePolicy` together. A
   caller that injects a corpus gets its gate state from the snapshot's own
   root (recorded by the reader) — never the process cwd — so the same
   snapshot cannot yield a different verdict. Severity policy (pluralist warns
   / strict fails) is the operator's machine config; the agent does not pick it.
4. **Machine seam** — one module reaches outside the project (ADR-0002); the pre-commit
   hook's inline posture reader is the single deliberate duplication, pinned to the module by
   test. The pin covers **every state, not just the two the readers used to have**
   (ADR-0020): each row of the agreement table now sets *both* files — the config and the
   last-known-good snapshot — so no row inherits state from the row above it, and each
   asserts the message that names which branch decided, because three of them exit 1 for
   three different reasons an operator has to tell apart to repair the right file. The two
   readers share one exit-code vocabulary: 0 allow, 1 a config that parses says
   fail-closed, 2 unreadable and resolved to blocking. The code carries the **resolved**
   posture, not the state — an unreadable config whose held snapshot said fail-open is 0,
   warned loudly — because two readers of one posture that disagree about what a code
   means is the drift the pin exists to catch.
   The machine's **role** (`collector | builder`) is read here too (ADR-0010): the collection
   CLIs ask `collectionPolicy()` before they touch an adapter, and doctor asks it before it
   judges a missing credential.
5. **Handoff seam** — the corpus crosses machines through git, so the arrival question has
   one owner (`lib/handoff.mjs`, ADR-0011) with two consumers and no repair path: doctor
   (a blocker on `role=builder`, silent on a collector, whose `raw-dangling` /
   `ledger-missing` / `ledger-chain` findings already own the same states) and
   `bin/handoff.mjs` (exit 1, every missing path named). One owner also means **one
   remedy per cause** (ADR-0020): the diagnosis lives in `lib/provenance.mjs`, which owns
   the hash comparison and can prove a rewrite by folding; the report carries the verdict
   as `lineEndings`; and both consumers print `handoffRemedy(report)` instead of a
   constant, so neither can drift into telling an operator to re-push a corpus that
   already arrived. The per-entry `detail` stays one line for the same reason the remedy
   is stated once — a paragraph per capture buries the capture names.
6. **Write seam** — captures and rows go through one writer family; the ledger is append-only
   with hash-chained entries; migrations are the one sanctioned rewrite and must leave traces
   (R9) that the provenance check cross-verifies. A write hands back what it wrote: `writeRaw`
   and `collectOne` return the capture's **index entry**, built by `captureEntry`, so a caller
   indexes a fact instead of reconstructing one. The chain's `seq`/`prev` are a
   read-modify-write, so **every** writer of `research/raw/.fetches.jsonl` holds one
   `O_EXCL` lock while it does it (ADR-0020) — an unlocked append is not a smaller version of
   the same operation, it is the operation with the guarantee removed. Two collectors arriving
   at once (an agent run and an operator run, cron plus interactive) is a routine situation,
   and the corruption they used to produce was unrecoverable: `repairLedgerTail` no-ops on a
   chain broken in the middle and `rebuildLedger` refuses it, so the corpus was dead and the
   credits were spent twice.
7. **Phase-0 seam** — decompose gathers, dimensions seed, the agent fills, `subtopic-coverage`
   judges. The tool never writes a status; the check refuses omission but accepts dismissal.

## Current invariants

What holds now. *Why* it holds — the defects, benchmarks and rejected alternatives behind
each line — is in the ADR named beside it and in
[`architecture-history/`](architecture-history/README.md).

| Invariant | Where it is decided |
|---|---|
| Search and fetch providers resolve **independently**; one seam, two sides | [ADR-0027](adr/0027-search-and-fetch-are-two-seams.md) |
| The fetch ledger is **append-only and hash-chained**; the chain is evidence, not truth | ADR-0011 |
| No data reaches a shell: argv arrays, `shell: false`; the one Windows `.cmd` route **refuses** rather than re-quotes | ADR-0020 |
| A path list is **data on a pipe**, not arguments | ADR-0020 |
| Exclusivity is the kernel's: `wx` / `O_EXCL`, never check-then-act | ADR-0020 |
| A test verdict is **awaited**, never printed early; each test is raced against a watchdog | ADR-0021 |
| A machine config is read in **three** states — absent / readable / **unreadable** — and an unreadable one fails closed | ADR-0020 (refines ADR-0002) |
| Line endings are corpus integrity: `.gitattributes` pins LF in the repo *and* in `template/` | ADR-0020 |
| A **builder** machine does not collect; its collection CLIs refuse before reaching an adapter | ADR-0010, ADR-0011 |
| An unsupported prerequisite **blocks**; it is never a silent skip | ADR-0021 |
| Validators are **read-only**; the only writes are `fi-validate --report` and `property-replay`, both explicitly requested | ADR-0029 |
| Validator inputs are not mutated — CI diffs `conformance/` and `schemas/` after every run | ADR-0029 |
| `researcher-release` **usage errors return exit 2** from every subcommand | — |
| An artifact's **authorization is derived, never supplied**: `artifact.mjs` has no `--build-authorized`, **refuses** it (and every near spelling) with the reason rather than ignoring it, and `deriveState` runs the real gate with `env` defaulting to `{}` so a packaging shell's override cannot travel | [ADR-0032](adr/0032-one-artifact-contract-for-every-consumer.md) |
| A package being **valid is not a package being authorized**: `status: PASS` and `buildAuthorized` are separate fields, and the CLI says so in words on a valid collected corpus | ADR-0032 |
| A ZIP's structural faults are refused from the **central directory, before inflation**; the inflation ceiling is `maxOutputLength`, not a field the archive declared about itself | ADR-0032 |
| **No dispatch input reaches a shell**: `${{ inputs.x }}` inside a `run:` block is substitution *before* the shell parses, so inputs arrive through `env:` and then an argv array. Enforced across **every** workflow, not only the newest | [ADR-0033](adr/0033-the-collector-refuses-rather-than-degrades.md), ADR-0020 |
| The collector's spend gate is a **protected environment whose existence is proven**, because GitHub silently creates an *unprotected* one when a workflow names a missing environment; a missing credential **refuses** rather than falling back to a keyless route | ADR-0033 |
| A claim's **support is weighed, not just checked**: `corroboration` reports whether a closed unknown rests on one reading, several readings of one source, or several hosts — it never fails a corpus on its own, because single-sourcing is often the right answer | [ADR-0036](adr/0036-the-gate-can-see-single-sourcing.md) |
| A privacy claim is **measured, not asserted**: `bin/disclosure.mjs` re-runs the probe, and a report never lets an unchecked thing read as a clean one | [ADR-0035](adr/0035-a-privacy-claim-is-measured-not-asserted.md) |
| A credential that resolves in a job declaring **no** environment is **not behind the approval gate**, and fails the run: the scope question GitHub will not answer directly is answered by asking it from a context that can see only one scope | ADR-0033 |
| The vendor **package name** lives in `lib/firecrawl.mjs` (`CLI_PACKAGE`, `cliInstallSpec`), never in a workflow: the CLI is **`firecrawl-cli`**, and the npm package called `firecrawl` is the SDK and ships no binary. Both workflows installed the wrong one for weeks, and only a real dispatch could find it | ADR-0005, ADR-0033 |
| A module **exports only what something else imports** — a test-only seam counts, a promise with no reader does not. Eleven such exports arrived with the artifact and dispatch work and were narrowed back to module scope on 2026-09-21 | — |
| A template token substituted into a **`.json`** file is JSON-escaped; markdown gets it verbatim | ADR-0033 (found by a hostile topic) |
| Supported CI platforms are **Linux and Windows**; macOS is best-effort and untested | [README](../README.md#supported-platforms) |
| The project is the **current working directory**; there is no `--project` | ADR-0017 |
| Enforcement surfaces stay at **two**: the git commit gate and the edit-time hook | ADR-0006 |
| The kit names **no runtime**: anchors are overridable, retired names are kept only to be recognised and repaired | ADR-0012 |
| Two languages answer per vector, never by comparing report hashes | ADR-0029 |

## Current inventory

Counted against the filesystem, not estimated:

| | |
|---|---|
| `lib/` modules | **48** (44, plus the 4 extracted into `lib/release/`) — every one has a row above |
| `bin/` entrypoints | **29**, of which **4 are Python**: 3 conformance runners and the module they share |
| `schemas/` | **12** |
| `conformance/` vector packets | **3** |
| checks in the registry | **13** |
| supported CI platforms | **2** |

The `schemas/` count became 12 on 2026-09-21 when `artifact-manifest.schema.json` arrived
with the portable artifact format (ADR-0032). It is not one of the ported release schemas,
and the sentence below is about those: of the twelve the port could have brought, eleven
did.

**Two artifacts are deliberately absent**, which is why the ported counts are 11 and 3
rather than 12 and 4: `trap-register.schema.json` and `dashboard-status-vectors.json` exist in
the tree this layer was ported from and are referenced by nothing here — no module,
binary, test or fixture names either. A schema no code validates against drifts silently
until somebody trusts it, so they arrive with the code that needs them or not at all
([ADR-0029](adr/0029-the-validator-layer-arrives-as-a-source-not-a-donor.md) rule 4).

**The full-suite test count is reported by `selftest.mjs` and is deliberately not repeated
here.** A manually maintained total went stale twice — the kit README claimed 326 when
there were 565, then 565 when there were 584. `selftest.mjs` now owns that number and
fails the run if the one claim that remains, in `research-kit/README.md`, disagrees with
it.

## Property-regression replay seam

`lib/property-replay.mjs` owns immutable capture and read-only replay of failing seeded
canonical-hashing, predecessor-closure, and descendant-invalidation cases. A capture self-hashes while excluding
`regressionSha256`, binds the generated input hash, and is created once with `wx`; a later
failure for the same family, seed, and iteration cannot replace it. The property suite writes
one only after an assertion failure. `bin/property-replay.mjs` verifies an envelope, recreates
the exact synthetic input, and reports that one case (or a lexically ordered directory) without
rerunning the suite or mutating inputs. Profile, envelope, or generator-input-hash drift fails
closed, so a changed generator cannot claim to reproduce an older failure.

`schemas/r29-workbook-linkage.schema.json` is the strict 24-row R29 workbook-linkage
envelope; `lib/r29-workbook-linkage-validator.mjs` resolves each declared link only against
an explicit sealed-record catalog and current R29 pointer. It rejects cross-task members,
missing/sealed-state/hash/predecessor mismatches, bad calibration traps, the Live/Frozen warm
scope violation, and a non-ready pointer without reading arbitrary record directories or
mutating evidence.

`conformance/property-graph-hash-vectors.json` is the reviewable, static export of two
declared property generator cases: one canonical-hash/record-chain value and one R28–R33
graph. It carries expected closure and rejection outcomes for the base graph, a self-cycle,
and a duplicate pointer. `lib/property-vector-conformance.mjs` and
`bin/property-vector-conformance.mjs` verify it with the release-validator implementation;
`bin/property_vector_conformance.py` reproduces canonical hashing and graph traversal using
only the Python standard library. Both CLIs are read-only, reject malformed or duplicate-key
packets, and normalize their vector rows identically for offline comparison.

## FI completed-workbook validation seam

`lib/fi-validator.mjs` is the read-only join between the completed FI workbook,
the thirty normalized FI sidecars, and the content-addressed evidence manifest.
It validates the shipped strict schemas, hashes the exact workbook and every manifest-named
regular file under the explicit root, resolves evidence ownership and declared hashes, and
reduces case state with `REOPEN > FAIL > BLOCKED > ROLLED-BACK > INCOMPLETE > PASS`.
Its deliberately narrow XLSX reader reads ZIP/XML projection cells only; it never invokes an
office application or changes the source package. `researcher-release fi-validate` exposes the
same seam with explicit paths and writes a report only when `--report` is supplied.
