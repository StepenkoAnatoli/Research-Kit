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

## The one picture

```
 git pre-commit (sh) ─┐                   runtime edit-time hook ─┐
                      ▼                                         ▼
                 bin/gate.mjs ──── lib/gate.mjs (evaluate) ─── lib/preflight.mjs
                 (CLI adapter)         │  ADR-0007                    │  the verdict
                                       │                              ▼
                                       │                       lib/checks.mjs
                                       │                 11 named checks, pure
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

## Modules — what each one owns

### lib/ (the policy and the machinery)

| Module | Owns | Governed by |
|---|---|---|
| `core.mjs` | Generic primitives (fs, paths, dates, slugs) and the artifact constants — file paths and table headers. Knows no semantics. `makeSlug(text, fallback, limit)` slices **then** trims, so a cut that lands on a separator never leaves one dangling — it trimmed first until 2026-09-20, which is why every audit file written before then carries a doubled hyphen nobody chose. | — |
| `audit.mjs` | The audit family: immutable single-file snapshots under `research/audits/` (one full-corpus, one per COVERED/GAP subtopic), their versioning (`nextVersion`, fingerprint-driven, never overwritten), the **manifest reader** (`listVersions` → `{ known, topics }` with the one ordering, `resolveVersion` → one version's path or null), and the **bundle** (`zipAudit` → the latest main audit plus every subtopic audit of that version, in one `.zip` named after them). `bin/audit.mjs` prints what those return; it used to walk the raw index itself with a second sort, which made the reader below it dead code and the ordering unsettleable. The bundle reads the manifest's `latest` pointers and never a directory listing, renders nothing, bumps nothing, and refuses rather than guesses: no audits / several topics unnamed / a manifest naming a file that is not on disk (ADR-0019). Derived artifact: reads the corpus, never writes back to it. Generated names are **budgeted**: `TOPIC_SLUG` (60) and `SUBTOPIC_SLUG` (28), because Windows MAX_PATH is 260 and the project root counts against it — this repository produced 114-character relative paths under a 157-character root, and `git add` refused until `core.longpaths` was set. The files already written are left as they are: they read, and renaming them would break both the manifest that names them and the history that holds them. | — |
| `fi-validator.mjs` | **Ported 2026-09-20 (ADR-0029).** Read-only FI (field-integrity) bundle validator: evidence-manifest and sign-off-sidecar schema conformance, the `FI_IDS` set and `FI_STATUS_PRECEDENCE` reduction, and `readFiWorkbookProjection` — which inflates a workbook entry with `zlib.inflateRawSync` to read a projection out of it without unpacking anything to disk. Depends on `release-validator.mjs` for canonical hashing and schema running; nothing else. Writes nothing. | ADR-0029 |
| `ledger-conformance.mjs` | **Ported 2026-09-20 (ADR-0029).** The offline, cross-language qualification-ledger conformance runner: four vector kinds (`canonical-json`, `self-excluding-hash`, `chain-hash`, `ed25519`), strict packet loading, and a deterministic report. Reads only; the sole `fs` call is `readFileSync`. `loadLedgerVectors` pins `packetVersion`, `profile`, the signature profile (`Ed25519` / `base64url-no-padding`), a non-empty vector list and unique vector ids — a packet that drifts is refused rather than partly run. Two details carry more weight than their size: `base64urlBytes` rejects a signature that does not survive a canonical base64url round-trip, so an alternative encoding of the same bytes is not quietly accepted; and the packet's own SHA-256 is attached with `enumerable: false`, so it can be reported without entering the canonical JSON that is hashed. **`reportSha256` covers `implementation.runtime`**, i.e. `process.version` — so it is a within-runtime determinism check, and cross-language agreement is asserted per-vector, never by comparing report hashes. | ADR-0029 |
| `fi-sidecar-conformance.mjs` | **Ported 2026-09-20 (ADR-0029).** The second half of the conformance foundation: classifies FI sign-off sidecars and evidence manifests as valid, malformed or tampered, against a vector packet, with a Node and a Python runner that must agree. Read-only — no writes, network, spawn or eval in any of the three files. One of its four tests exists to check the FIXTURE rather than the code: that the vector packet stays synthetic and carries no completed evidence, so a conformance suite cannot quietly become a place real sign-offs are stored. | ADR-0029 |
| `property-replay.mjs` | **Ported 2026-09-20 (ADR-0029).** Captures a failing property seed once, as a self-describing replay envelope, and replays it deterministically afterwards. The **only ported module that writes**, and it writes exactly one way: `fs.writeFileSync(file, …, { flag: 'wx' })` — `O_EXCL`, so write-once is the kernel's decision rather than a check that can race. Three layers guard it: an `existsSync` fast path, the exclusive flag, and an `EEXIST` catch that returns the **existing** envelope with `created: false`. A second failure on the same seed therefore cannot overwrite the first, which is the point — the first failure is the evidence. Identity binds `family`+`seed`+`iteration` three ways at once: the filename, the `caseId`, and `inputSha256`; `validateRegression` re-derives the `caseId` and refuses a mismatch. `regressionSha256` self-excludes before hashing, so tampering with any field is caught. Everything after capture is read-only. | ADR-0029 |
| `property-vector-conformance.mjs` | **Ported 2026-09-20 (ADR-0029).** Exports the property suite's canonical-hash and graph findings as a static vector packet, and re-verifies them — in Node and in Python, against the same file. Read-only in all three files. Its value is that it turns property tests, which generate their own inputs and could drift with the generator, into **fixed vectors a second language can check**: canonical hashing invariant under object insertion order and sensitive to authored array order, predecessor closure across generated chains, and descendant invalidation that is transitive, sorted, duplicate-free and permutation-invariant. Two of its five tests guard the fixture rather than the code — that the exported vectors stay synthetic, and that the exported graph and hash values stay bound to the property seeds that produced them. | ADR-0029 |
| `r29-workbook-linkage-validator.mjs` | **Ported 2026-09-20 (ADR-0029).** Cross-reference validator for the R29 reviewer-workbook linkage register: 24 task ids, six expected reference kinds (task/gold/source/calibration/warm/lock), and a status reduction that takes the worst of `PASS < INCOMPLETE < FAIL < REOPEN`. **Zero imports** — it is 58 lines of pure functions over `{ register, catalog, pointer }` passed in as arguments, so it touches no filesystem, no network and no clock, and the caller owns every input. That is also why it needed no sealed-record fixture: its tests synthesise a register into a temp directory rather than shipping one. A revoked lock pointer reduces to `REOPEN` rather than `FAIL`, which is the distinction the rank order exists for — a withdrawn approval is not the same as a broken link. | ADR-0029 |
| `archive.mjs` | **One container format**: `buildZip(entries)` → bytes, `writeZip(file, entries)` → `{ file, bytes, entries }`, `crc32`, `entryName`. ZIP with deflate (store when deflating would only grow the payload), written because the kit has no dependencies and cannot shell out to a `zip` binary that may not exist. Knows the container and nothing else — what goes inside a bundle is `lib/audit.mjs`'s. Refuses entry names that are not plain relative paths (an archive must not unpack outside its folder) and an archive with no entries. See ADR-0019. | ADR-0019 |
| `brief.mjs` | The phase-1 → phase-2 handoff: renders `research/BRIEF.md` from the corpus, and **owns the brief's shape** — `BRIEF_SECTIONS` (six sections, the two that are judged marked), the markers that distinguish *still the scaffold* from *the drafter wrote this* (`briefState` → `template \| legacy \| draft \| authored`), and the section reader (`briefSection` / `judgedSection`) that `lib/audit.mjs` consumes instead of regexes of its own. The renderer writes headings **from** that definition, so the writer and its readers cannot drift; the scaffold ships `BRIEF_FILE_MARKER`, which the substitution pass leaves alone — the alternative, matching the template's prose, made a sentence of English load-bearing. | — |
| `corpus.mjs` | The research corpus: **one reader** (`readCorpus`, `readCaptures`, `parseTable`, `parseCapture`, `readOverrides`) and **one writer family** (`appendRow`, `upsertRow`, `appendJsonLine`, `writeRaw` lives in collect), plus the **cache decision** over the capture index (`cacheDecision`) — the one freshness predicate the collector, the run, and phase 0 consume. Table machinery: `splitRow`/`escapeCell`/`tableRow`/`repairRowArity`. Malformation is reported, never absorbed. The capture index has one constructor (`captureEntry`, used by `readCaptures` **and** by the collector when it has just written a page) and one writer (`rememberCapture`), so the index a run keeps in memory holds the same shape as the index read from disk — callers store the entry they are handed and shape nothing. The format's **joins** are here too: `traceOf` (evidence row → the fetch that produced it and the capture behind it), `captureOf` (row → capture, via the by-file index the reader builds), and `claimOf` (unknown → the claim it rests on, first cited row, falling back to the unknown's own text). Five consumers re-derived those joins, including the subtle "an empty Raw cell matches on the URL alone" clause; now a format change lands in one place. | ADR-0003 |
| `transport.mjs` | **Adapter selection**, and the one reader of the operator's transport choice — now for **two sides** (ADR-0027). The *fetch* ladder is unchanged: `--transport`, `RESEARCH_KIT_TRANSPORT`, the config's `transport`, then auto-detection (`probeFirecrawl` — authenticated or anonymous CLI wins, otherwise keyless). The *search* ladder mirrors it: `--search-transport`, `RESEARCH_KIT_SEARCH_TRANSPORT`, the config's `searchTransport`, then one auto-detect rule — a SerpAPI key wins, otherwise **the search side IS the fetch provider**, so a machine with no key behaves exactly as before. `selectTransport` returns `{ name, adapter, why }` still meaning the FETCH side, with `search` added alongside; that is what let six call sites stay unedited. Exposes `TRANSPORTS`/`TRANSPORT_NAMES` (whole-shape adapters), `SEARCH_PROVIDERS`/`SEARCH_PROVIDER_NAMES` (a **separate** map — a search-only module in the first would make `ADAPTER_SHAPE` a claim it no longer keeps), `FETCH_SHAPE`, `SEARCH_SHAPE`, `satisfies`, `isSearchOnly`, `selectSearch`. `isSearchOnly` reads a module's declared `CONTRACTS` rather than duck-typing, because a search-only module exports `scrape` on purpose — to refuse by name. | ADR-0005, ADR-0027 |
| `serpapi.mjs` | A **search-only provider**: the first module here that satisfies one contract instead of the whole adapter shape, declared as `CONTRACTS = ['search']`. Produces no capture, so nothing it returns reaches the fetch ledger and `transport-provenance` is untouched. Sends exactly `engine`, `q`, `api_key` — **no result-count parameter**, because none is documented and a response costs the same whatever it carries, so `limit` is applied client-side; `no_cache` and `async` are never sent, which keeps the vendor's free 1-hour cache. The key is read from `SERPAPI_API_KEY` or the config's `serpapiKey`, **never from a repository**, and travels to the child on **stdin** rather than argv so it never enters the process table. The request URL — the one string that contains the key — is built in the child and never returned; `redact()` scrubs it from vendor error text on the way back, and `command()` renders it pre-redacted. **A query that contains the key is refused before transmission**, because `cmd` is written into the hash-chained ledger (a committed file) and because sending it would store the credential as a search term on the vendor's systems for 31 days; redacting the rendering alone would have fixed the smaller half. Async `fetch` behind a synchronous shape via the same self-exec rendezvous `http-transport.mjs` uses. `status()` answers from configuration alone and **declines to report a remaining allowance**, because no endpoint this project has captured reports one. `requestUrl(query, key, endpoint)` is exported so the exact parameter set is testable rather than buried in the child — the guarantee worth pinning is negative, and negative guarantees rot silently. The **endpoint is overridable and guarded**: `allowedEndpoint` permits the vendor's own host over https, or loopback, and nothing else. That exists so the whole path — parent, `spawnSync`, child, real `fetch`, real socket — can be driven against a local stand-in instead of being exercised once by hand and called verified; an overridable endpoint on a request carrying an API key is otherwise an exfiltration route, so **both halves check it**, the parent before spawning and the child before fetching, because the child reads its job off a pipe and does not get to trust it. The one thing no stand-in can prove — that the two meters really are separate — is covered by `test/live-collect.test.mjs`, an **opt-in** test (`RESEARCH_KIT_LIVE=1` plus a key) that drives `bin/research.mjs` through a real collecting run in a temp project and asserts the Firecrawl spend against the pages fetched. Opt-in because running it on every suite would cost every developer credits forever; existing because "it costs money" is a reason to gate a test, not to skip it. | ADR-0027 |
| `http-transport.mjs` | The **keyless adapter**, and the second one - which is what makes the transport seam real rather than hypothetical. Pure Node ESM, no dependencies: built-in `fetch` driven synchronously through a child-process rendezvous (it re-execs itself with a JSON job on stdin), a word-density main-content extractor, HTML→markdown, DuckDuckGo-lite search, same-domain link mapping. Exposes the **same seven-function shape** as the Firecrawl adapter (pinned by test), never reads an API key, never charges a credit, stamps `transport: 'http-keyless'`, and grades its own `completeness` (`full` only ≥1500 chars of markdown, else `partial` — an honest self-assessment the capture-completeness check then judges). | ADR-0005 |
| `collect.mjs` | One URL's journey: `collectOne` (cache, force, fail entries, evidence/source rows) and `writeRaw` (the capture writer, which hands back the corpus's own index entry). Consumes the `runScrape` seam; stamps `transport` and `completeness` from what the adapter declared — invents neither. The Finding cell a row is born with is `lib/finding.mjs`'s: the collector **imports** `firstFinding` and does not re-export it, so the extractor has one address. | ADR-0016 |
| `finding.mjs` | The auto-extracted **Finding** cell: `firstFinding(markdown, fallback)` — page markdown in, one line of prose out — over the heuristics behind it (boilerplate/tracking/nav/campaign regex families, the sentence splitter, the table reader, the tier-hero block skip, the graded score, the 220-character cap). Two arguments over ~460 lines: a deep module that was buried in the middle of another one until ADR-0016. Pure by construction — no filesystem, no corpus, no adapter — the one module a caller can exercise with a string. | ADR-0016 (superseding ADR-0009) |
| `research-run.mjs` | Many URLs, one run: plan/query/url fan-out, discovery, candidate selection, budget tiers (`DEPTH_SCRAPES`), cache policy. The coordinator; collectOne does the writing. Since ADR-0027 it drives **two** providers: `searchAdapter` defaults to the fetch adapter, so an un-updated caller is unaffected, and one bounded fallback covers a search-provider outage — reported, never absorbed, because it moves spend back onto the fetch budget. `searchUsage(root)` counts the search meter from the usage log per hour and per month; it **reports and does not block**, because the count is this machine's only and cannot tell a free cached repeat from a billed search, so a guard built on it would refuse work on a number wrong in the blocking direction. | ADR-0027 |
| `firecrawl.mjs` | **All** vendor knowledge: the CLI transport (`exec` seam, which carries an **argv array** and spawns with `shell: false` — no URL or query is ever concatenated into a shell string), the Windows `.cmd`-shim resolution (`resolveProgramPath`/`resolveInvocation`: full path off PATH+PATHEXT, a real `.exe` spawned directly, a `.cmd`/`.bat` run through cmd.exe as argv and only after every argument passes `cmdSafeArg` — a **denylist** of cmd.exe metacharacters (`CMD_UNSAFE_CHARS`), refused and never re-quoted; it was an allowlist until 2026-09-19, which refused every search query containing a space. `unsafeCmdArgs(argv)` is the plural reporting form and the **single owner** of "which arguments would be refused": `resolveInvocation` calls it rather than filtering inline, so the refusal and the message naming the offenders cannot drift apart. Measured against the allowlist the ADR-0029 source tree still uses, the two agree on every character that can break out of cmd quoting — `"` `%` `&` `|` `<` `>` `^` `(` `)` `` ` `` tab newline — and differ on `'` `{` `}` `\` and **any non-ASCII character**, which an allowlist of ASCII punctuation refuses by construction. That is why `é` is a permitted argument here and a hostile one there, and why that tree's hostile-argv corpus could not be ported), payload normalisation (`normalizeSearch`/`normalizeScrape`/`normalizeMap` — `normalizeSearch` reads the CLI's real `{success, data: {web: […]}, creditsUsed}` object, pinned at `test/fixtures/firecrawl-search-1.23.3.json`), status parsing (`--status`, the flag; `firecrawl status` is not a command), `map`/`search`/`scrape` adapters. `command(args)` survives as a **display-only** rendering (dry-run output, the ledger's `cmd` annotation) that nothing executes. Stamps `transport: 'firecrawl-cli'` — narrowed to `firecrawl-cli-anonymous` by `transport.mjs` when the CLI has no credential — and **grades** completeness at the 1500-character bar rather than asserting `full`. | ADR-0005, ADR-0020 |
| `release-validator.mjs` | **Ported 2026-09-20 (ADR-0029).** Read-only R28–R32 release evidence validator: duplicate-key-safe JSON loading, canonical recursive JSON serialization and SHA-256 payload hashes, the checked-in JSON-Schema subset runner, envelope/predecessor/role/visibility/promotion checks, path containment, and deterministic `PASS`/`INCOMPLETE`/`FAIL`/`REOPEN` reduction. It never rewrites records, pointers, registries, or role rosters. | R28–R32 validator contract |
| `path-authority-validator.mjs` | **Ported 2026-09-20 (ADR-0029).** Read-only Git-origin/path-authority snapshot validator: strict envelope schema conformance, self-excluding canonical envelope hashes, portable root/realpath containment, isolated-environment coverage, required Git-origin proof, artifact-diff classification, and deterministic status reduction. It never writes snapshots, transcripts, profiles, Git config, or release state. | Git-origin/path-authority snapshot validator contract |
| `decompose.mjs` | Phase 0 coordination: recipe parsing, docs-host discovery, material gathering (scrape-budget accounting via the corpus's `cacheDecision` — a cache hit is not an attempt), draft MAP writing. Contains **no judgment** — it seeds the checklist and gathers material; it never writes a status. | — |
| `dimensions.mjs` | The universal, domain-agnostic subtopic checklist and its mechanical presence-matching (`coverageOfUniversals`). Recipes add on top of it; nothing replaces it. | — |
| `provenance.mjs` | The tamper-evident fetch ledger: `appendFetch`, `verifyLedger`, `rebuildLedger` (the one metadata-migration path — guarded, per-entry `migrations` records, chained `op: 'migration'` boundary), and the overrides log writer. Also **the collector's exclusive section** (`withLock`), acquired with `O_EXCL` (`flag: 'wx'`) so the kernel refuses a second creator instead of letting it overwrite; staleness is judged only *after* EEXIST proves someone holds the file, and a fresh lock that names no pid — the window `O_EXCL` leaves between create and write — is waited for, never broken. Reentrant in-process, so `appendFetch` can serialize its own read-modify-write inside a run that already holds the lock, and release removes only the acquisition it made (pid + nonce). Every writer of the chain — append, tail repair, rebuild — goes through that one lock. `verifyLedger` also **classifies** a body hash that does not recompute (`isLineEndingRewrite`, `hashText`): folding CRLF back to LF either restores the recorded hash or it does not, so `body-unmodified` problems carry `kind: 'line-endings' | 'modified'` and the consumer can name the right cause instead of guessing (ADR-0020). | ADR-0003 (corpus-adjacent), ADR-0020 |
| `checks.mjs` | The **ordered contract-check registry**: discovery-contract, citations, provenance, transport-provenance, gate-integrity, unknown-closure, subtopic-coverage, capture-completeness, **evidence-supersession**, collection-attempts, hygiene, corpus-shape — twelve, in a pinned order. Every check is a pure function of the corpus snapshot + options; none reads the filesystem. **`supersededRows(corpus)`** is the one shared answer to "which rows have been replaced by a fresher capture of the same URL": `evidence-supersession` refuses an unknown still resting on a replaced row, `transport-provenance` goes quiet about a replaced row nothing relies on (but not about one still cited), and `hygiene` stops calling a refresh a duplicate while still catching two rows of one URL fetched the same day. Those last two knew nothing about ADR-0026 until 2026-09-20, when the first real refresh made them warn about the state that ADR requires. | ADR-0004, ADR-0026 |
| `preflight.mjs` | **The verdict** and the **verdict context**. Assembles findings from CHECKS into pass/fail; one function, three callers (commit gate, edit gate, CLI) so they cannot disagree. Owns the verdict's input unit: `verdictContext(root)` reads the corpus, the gate state (`readGateState`), and the operator's `evidencePolicy` together — same snapshot, same verdict, by construction. | ADR-0004 |
| `gate.mjs` | Gate policy: `isGated` (the four markers), `evaluate` (commit/edit), the GATE_OFF override recording, and the architecture-map rule (`architectureMapBreach` over `loadGateConfig` — guarded paths are project configuration, `research/kit.json`, defaults `src/lib/bin/scripts/app`). Contains no repo-specific path. **One deliberate exception to "no CLI parsing"**: the commit gate's staged-path list arrives as *data on a pipe* (`stagedPathsFromStdin` / `splitPathList`), because argv was O(n²) to build and bounded besides. It returns **null for "stdin could not be read" and `[]` for "read, and empty"** — conflating them would hand the verdict an empty staged set, which it allows, i.e. a gate that silently stops gating. `stdinIsReadable()` asks `isatty(0)` rather than inferring from the file type, which gets two cases wrong in opposite directions (a socketpair is not a FIFO; `/dev/null` is a character device but reads as immediate EOF). | ADR-0002, ADR-0007, ADR-0008, ADR-0020 |
| `doctor.mjs` | Read-only diagnostics: machine + project + gate + chain health in one report. Consumes the verdict context (`verdictContext` / `readGateState`) for the chain-verified corpus and the gate-state triple; adds one machine read of its own (the git-resolved `hooksPathEffective`) for report. **Role-aware** (ADR-0010): the Firecrawl findings are informational on a `builder`, and the handoff findings (ADR-0011) are blockers there — the collection entrypoints' refusal is what makes that split honest. The handoff findings come from the owner, not from a second composition: doctor passes the corpus it already read to `verifyHandoff(root, { corpus })`, so the arrival question has one implementation and one set of pins. One deliberate write: the repository-local hooksPath override log (the third override is silent by nature — the bypassed hook cannot report it). `gateHealth` and `runDoctor` accept explicit Git/config/settings paths and a child environment so diagnostics can run against disposable machine fixtures without consulting host state. | ADR-0010, ADR-0011 |
| `machine.mjs` | **Everything outside the project**: machine config (fail-open posture, `editGate` mode and settings path, `evidencePolicy`, `role`), read in **three states** — `absent` (nothing configured; the fail-open default is the answer), `readable`, and **`unreadable`** (the file exists and does not parse), which holds the last config that parsed from a snapshot beside it and, with nothing to hold, **fails closed**. `readMachineConfig()` returns the settings *and* `state`/`source`/`error`, because the settings alone cannot say whether fail-closed was configured or is the fallback this machine adopted (ADR-0020). Install state, git `core.hooksPath` (scope-aware readers), and the **runtime anchors** — `RUNTIME_ANCHORS`, the one place a runtime's paths are named (settings file, personal skill roots, project-relative skill dir), each a default that `runtimePaths()` / `skillLocations()` let the machine config override (ADR-0012); Git readers/writers accept an explicit child environment, preserving production defaults while allowing R1's disposable machine/Git fixture to isolate global/system origins; reads a retired config key's value into the current shape rather than
dropping a setting the operator had tightened, and reports a retired ENVIRONMENT
variable (`CLAUDE_SETTINGS_PATH`) without ever honouring it. Owns the machine role and the collection policy that follows from it (`machineRole`, `collectionPolicy`, `collectionRefusal`) — the single answer to "may this machine collect?". The only module that reaches past the project root. | ADR-0002, ADR-0010, ADR-0012 |
| `handoff.mjs` | The **arrival question**: `verifyHandoff(root)` reports a ledger that is absent or empty, every capture an evidence row names that is not on disk, and a chain that does not verify — each named. Read-only by design: the machine that asks cannot collect the missing bytes. The report also carries `lineEndings`, the captures whose body hash fails *only* because git rewrote CRLF into them on checkout, and **`handoffRemedy(report)` picks the remedy from the cause** rather than printing one text for every way a corpus can look broken (ADR-0020): `HANDOFF_REMEDY` when something did not travel (the collector must push `research/raw/`, dotfiles included), `lineEndingRemedy` when everything travelled and this machine rewrote it (pin with `.gitattributes`, re-check out, touch no collector and spend no credits), both when a report holds both. Consumed by `bin/handoff.mjs` and doctor (blocker on `role=builder`, silent on a collector; doctor passes the snapshot it already read, so the question is composed once for both). | ADR-0011, ADR-0020 |
| `bundle.mjs` | The **archive this project arrived as**, and how far the tree has moved from it. `BUNDLE_INDEX.md` lists 80 SHA-256 digests taken at the 2026-09-17 handover; until ADR-0028 **nothing had ever read them**, which is how ADR-0022 could treat them as a constraint for three days without noticing the constraint was already violated. `verifyBundle(root)` sorts every entry into unchanged / drifted / unexpected / missing, where "drifted" means a file in `EXPECTED_TO_DRIFT` — the corpus, the map, the ADR index, and the manifest itself, each of which moves because one of this project's own rules *requires* it to. The list is deliberately narrow: exempting a planning document would leave the report unable to say anything, and a test asserts none is exempted. Hashes **bytes**, not decoded text. Reports; never fails a build — a changed file is a fact about history, and the only thing that makes it a problem is nobody knowing. | ADR-0028 |
| `git-config.mjs`, `config.mjs` | Compatibility shims → `machine.mjs`. | ADR-0002 |
| `scaffold.mjs` | Project shape: `LAYOUT` (12 entries), the **four** `GATE_MARKERS` (pinned by ADR-0001 and its test), template rendering, placeholder validation, hook executability. `.gitattributes` is a LAYOUT entry but **not** a gate marker: a project without it still gates, it just breaks on a Windows builder (ADR-0020). | ADR-0001, ADR-0020 |
| `installer.mjs` | Installs the git hook (records/restores prior `hooksPath`) and the edit-time gate (backs up, repairs known corruption, refuses unfamiliar states). The hook was renamed (A10.4): the installer recognises a registration left at a retired name, replaces it rather than adding a second, and reports the repair — `retiredRepairNote`. | ADR-0012 |
| `render.mjs` | Terminal table rendering for CLI output. | — |
| `timeline.mjs` | TIMELINE.md generation and the diagnostics-log appender the gate CLI records through. | — |


> **Every row in this table now describes a module that exists.**
>
> `release-validator.mjs` and `path-authority-validator.mjs` were the two that did
> not, from the day this table was written until 2026-09-20. They were the
> release-evidence layer ADR-0022 deferred, and this table listed them with no marker
> of any kind - indistinguishable from the 27 rows that were real. Both are now ported
> under ADR-0029, read and re-tested in this repository.
>
> `fi-validator.mjs` and `bin/property-replay.mjs` are still to come, and are
> deliberately absent from this table until they land. A map earns trust by not
> listing what it does not have.

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
and a usage error prints the usage block to stderr. It writes exactly one thing, only when
asked: `fi-validate --report <file>`. **Known inconsistency:** a usage error exits 2 for
`validate` and `conform` but 4 for `fi-validate`; no test pins either, and it is recorded
rather than changed, because guessing the intended code is how a port becomes a rewrite),
`selftest.mjs` (the whole suite, queued by the harness — which **awaits** every test,
so `ok` means the assertions settled; ADR-0021).

### Not lib, not bin — but load-bearing

- `githooks/pre-commit` — POSIX sh commit-gate wrapper. Fail-open when node or the kit is
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

## Current shape, for the record

- 11 checks in the registry; the four gate markers; the three overrides (`--no-verify`,
  `GATE_OFF`, repository-local `core.hooksPath`); 9 universal dimensions; recipes ×5;
  LAYOUT 12 entries (kit.json, this file, and `.gitattributes` among them, none gating).
- Two transports behind one seam (ADR-0005): the Firecrawl CLI and the keyless HTTP
  adapter, selected by `lib/transport.mjs` from the operator's choice or a probe.
- **No data reaches a shell** (ADR-0020): the CLI is spawned as an argv array with
  `shell: false`, and the one route that still has an interpreter in it — a Windows
  `.cmd` shim, which Node refuses to spawn shell-less — validates every argument
  against a strict character set and refuses rather than re-quotes. The cost is named,
  not hidden: percent-encoded URLs are refused on Windows under `firecrawl-cli`, with
  `--transport http-keyless` as the interpreter-free escape hatch. POSIX pays nothing.
- **A path list is data, not arguments** (ADR-0020): the commit gate's staged list
  travels on a pipe. Measured on one machine, same git shim — before: 1,000 paths
  0.4s, 3,000 → 2.4s, 10,000 → 24.3s, 30,000 → 225.2s (quadratic, no output);
  after: 30,000 → 0.15s and 100,000 → 0.21s. The structural pin is an argument
  count, not a clock: at 5,000 staged paths the gate received **10,005 arguments
  before and 6 after**.
- **One lock, one flag** (ADR-0020): the collector's exclusive section is acquired with
  `wx` (`O_EXCL`), so exclusivity is the kernel's decision rather than a
  check-then-act the module performs. The ledger's `seq` is derived from the ledger
  as read *under* that lock, and every writer of the chain takes it. Rejected: more
  staleness heuristics on the old `exists()`-then-write, which cannot be made correct
  by adding conditions — the race is in the shape, not in the judgement.
- **A test verdict is earned, not printed** (ADR-0021): `runPending` is async and awaits
  every test, so `ok` is printed only once the test's assertions have actually settled and
  the returned failure count includes async failures. It was synchronous and caught only a
  synchronous throw, so an async test printed `ok` the instant it returned its promise —
  before any assertion inside it had run — its failure arrived later as an unhandled
  rejection, and the runner's own `process.exit(0)` pre-empted even that. Reproduced: a
  fixture holding one failing async test printed `ok`, then `all tests passed`, then
  **exited 0**. Each test is raced against a watchdog (`RESEARCH_KIT_TEST_TIMEOUT`, default
  60s; the whole suite runs in 9s and the slowest single file in 3.2s, so the bound is ~19x
  the slowest file — chosen by measurement, not by guess), because an awaited test that
  never settles would hang the suite printing nothing, which is the trap the commit gate
  fell into before it got a watchdog. A timed-out test's promise is then swallowed, so its
  late rejection cannot crash the runner over a test already judged and attributed.
  `test/harness.test.mjs` pins all of it in child processes, including the old runner
  beside the new one, so the false green cannot return unnoticed.
- **A posture is read in three states** (ADR-0020): `absent` / `readable` /
  **`unreadable`**. The old reader was `try { parse } catch {}` returning the defaults, which
  collapsed "never configured" and "configured, and the file is now corrupt" into one
  answer - so `{"failOpen": false}` truncated to `{"failOpen": fal` came back as the default
  set and a hardened machine started allowing commits again with nothing in any output
  saying the posture had changed. Every other knob reverted with it: a `hard-block` edit
  gate became `ask`, `strict` became `pluralist`, and a `builder` became a `collector` - the
  role that may collect and spend credits. An unreadable config now holds the last one that
  parsed (snapshotted beside it whenever a read succeeds), and with nothing to hold it fails
  **closed**; doctor makes it a blocking `CRITICAL` finding. This **refines ADR-0002**, whose
  "a broken config never blocks work" is right for a config that was never written and wrong
  for one that was; ADR-0002 is left unedited, in its own words, and ADR-0020 records the
  supersession. Only `failOpen` is tightened in the no-snapshot fallback: the other knobs
  have no safe restrictive default, and they cannot be lost anyway - a machine can only have
  set them in a config that parsed, and every parse snapshots it.
- **Line endings are corpus integrity** (ADR-0020): a body hash is over the LF bytes the
  collector fetched, and git's smudge filter rewrites every text file on a default Windows
  checkout (`core.autocrlf=true`), so the whole corpus failed `body-unmodified` on arrival
  with nothing actually wrong with it. Pinned at both ends: `.gitattributes`
  (`research/raw/* text eol=lf`, `*.jsonl text eol=lf`) ships in the repository *and* in
  `research-kit/template/`, so a scaffolded project cannot be born without it. And the
  failure is **classified, not guessed** — `isLineEndingRewrite` folds CRLF back and
  re-hashes, which either reproduces the recorded hash or does not; a genuinely tampered
  capture stays `kind: 'modified'` and still gets the push remedy. Rejected: one blanket
  remedy text, which is what sent operators to the collector (and, in practice, to
  re-collect) for a corpus that was already on disk.
- Every module under `lib/` is named in this map, and so is every `bin/` entrypoint:
  the two that were missing until the 2026-09-15 review (`audit.mjs`, `brief.mjs`) and
  the two behind the transport seam (`transport.mjs`, `http-transport.mjs`), added
  after it. `finding.mjs` is the 25th file under `lib/` (23 modules plus the two
  compatibility shims), named from the commit that created it (ADR-0016).
  `archive.mjs` is the 26th — a second module for a second concept, the container
  an audit bundle ships in, on the same reasoning as ADR-0016 (ADR-0019).
- The extractor has its own module (ADR-0016): 460 of the collector's 658 lines were
  a different concept with a different reason to change, so `lib/collect.mjs` is now
  200 lines that read as one URL's journey and `lib/finding.mjs` is 472 lines behind
  a two-argument interface. The count is 472, not the 471 ADR-0016 records for the
  same file: the ADR stays in its own words and the map carries the correction
  (`docs/adr-0016-verification-2026-09-15.md`, 2026-09-15).
- Two machine roles (`collector` default, `builder` — ADR-0010), one handoff check with
  four named failures (ADR-0011), and one rule that follows from the split: a
  builder-role machine does not collect, and its collection CLIs refuse before they reach
  an adapter.
- Recovery after an interruption is read from repository state, never inferred:
  `doctor` and preflight answer *where this project is* from disk alone, so a dead
  session costs context and not position, and the last commit report plus this map say
  what was happening. The instructions are prose in `AGENTS.md` and the scaffold
  template (CONTEXT term **resume**); enforcement was rejected on purpose — a check
  that judged whether an agent oriented properly would be wrong (ADR-0013).
- *Where* an agent stands is protocol, not a flag: the project is the current working
  directory, and a cwd that is not the project the operator meant is a question, never
  a filesystem search, an inference from a name, or a remote lookup. Prose in
  `AGENTS.md` and the template (CONTEXT term **wrong project**), inherited by every
  scaffolded project, unenforced for the same reason as **resume** — a gate cannot
  judge whether an agent guessed or was told (ADR-0017). There is no `--project`: the
  gate resolves one root from where it stands, and a second root is a second thing to
  be wrong about.
- Two files face two readers, and both ship: `AGENTS.md` binds the agent (and now
  tells it to ask rather than search when the cwd is not the project — ADR-0017),
  `START_HERE.md` answers the operator, from `template/`, so a project the kit has
  never seen still tells the person standing in it where his files are (ADR-0018).
- Enforcement surfaces stay at two: the git commit gate and the project-level
  edit-time hook. In hosted and cloud sessions neither runs — what binds there is
  the protocol as text (ADR-0006 covers that gap).
- The kit names no runtime (ADR-0012): one anchored, overridable statement of where a
  runtime keeps its settings file and its skill roots (`RUNTIME_ANCHORS`, read through
  `runtimePaths()` / `skillLocations()`), capability names for everything the kit owns
  (`editGate`, `--edit-only`, `hooks/edit-gate.mjs`), and retired names kept only so a
  rename can be recognised and repaired — or, where the kit cannot reach it (an export),
  reported by doctor while it persists.
- One attachment, not ten pasted files: `zipAudit` bundles a topic's latest audits
  into `research/audits/<slug>-v<version>-<date>.zip`, read from the manifest's
  `latest` pointers. The container is written here (`lib/archive.mjs`) because the
  kit has no dependencies and cannot assume a `zip` binary; the refusal shape is
  A11's — name the options, do not guess (ADR-0019).

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

## One working note, not a rule

`gh pr edit` on this repository exits 0 while a GraphQL deprecation warning
("Projects (classic) is being deprecated") silently drops the mutation: title and
body changes are lost, and nothing in the command's output says so. Use
`gh api -X PATCH repos/<owner>/<repo>/pulls/<n> -F title=… -F body=@file`. Found on
2026-09-15 by re-reading PR state, not by any signal the tool gave. This is one
observed quirk of one tool, not a checkable class — nothing detects it, and
nothing should; it is written here so the next PR edit does not repeat it.
