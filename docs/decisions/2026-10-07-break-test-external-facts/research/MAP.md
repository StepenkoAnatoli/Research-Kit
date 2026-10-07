# MAP - topic decomposition

## Topic

what the runtime does: Node's certificate store, and the mode a copied file gets

## Subtopics

Drafted by `node "/home/user/.agents/research-kit/bin/decompose.mjs" --topic "what the runtime does: Node's certificate store, and the mode a copied file gets"`, seeded with the
universal checklist and statuses BLANK. Phase 0 gathers material; it does not judge.

Mark every row COVERED (cite the U-## rows that cover it), DISMISSED (reason required -
dismissing is fine, omitting is not), or GAP, and add topic-specific subtopics where the
checklist is not enough.

| ID | Subtopic | Why it matters | Status | Covered by |
|---|---|---|---|---|
| D-1 | Access model | Public pages, an official API, an auth-walled app, or a paywall - each is a different collection design | DISMISSED | The three pages are public files in the runtime's own repository, fetched by the keyless transport without a key or an account; nothing here is auth-walled |
| D-2 | Auth and credentials | What accounts, keys, or logins the collection and the product need, and who holds them | DISMISSED | No credential is involved: the captures were made with the keyless transport (`RESEARCH_KIT_TRANSPORT=http-keyless`), which holds no key by design |
| D-3 | Rate limits and quotas | Caps every cadence in the design, and caps the research collection itself | DISMISSED | Three HTML pages, one fetch each, in one run; no quota is approached and no cadence depends on one |
| D-4 | ToS, licensing, legality of the intended use | A prohibition on automated collection, storage, or display ends the design for that source - and sometimes the project | DISMISSED | The pages are the runtime owner's own documentation, fetched once each and quoted; the kit's automated-fetching question was researched and closed by `../2026-10-02-github-plain-fetch-refusal/` |
| D-5 | Data schema and its stability | How the data is shaped, and how often the source changes the shape without asking | DISMISSED | There is no data product; the "schema" is documentation prose. The pages are pinned to the tag of the runtime in use, so a shape change is a deliberate version decision |
| D-6 | Freshness and staleness | How fast the data goes stale, and what staleness costs the product that depends on it | DISMISSED | Both facts are stable runtime behaviour, pinned to v22.22.0; staleness is bounded by the runtime version the kit supports, which is the kit's own release decision |
| D-7 | Cost at expected volume | The economics at real usage, not the pricing page's first row - this decides viability | DISMISSED | The keyless transport spends nothing: no key, no credits, no metered API |
| D-8 | Runtime and platform limits | Where this actually executes - OS, runtime version, desktop app, cloud - and what those limits forbid | COVERED | U-01, U-02 (what the copy does to modes and to an existing destination), U-03 (the trust store and how an operator extends it) |
| D-9 | Output obtainability | Does the data your stated "done" depends on exist, and can you actually get it? Load-bearing: a project whose output cannot be produced should die in phase 1, not phase 2 | COVERED | U-01, U-02, U-03 - all three pages were obtained and are cached under `research/raw/`; the search lane was NOT obtainable from this machine (see Candidate material) |
| T-1 | The mode a copied file gets, and what an existing destination does | The exact cause of the deployed-kit `EACCES`: `fs.copyFileSync` carried the source's 0444 mode into the deployed home, and the next deploy overwrote - or tried to | COVERED | U-01, U-02 |
| T-2 | Node's trust store and how it is extended | Whether the kit may name a documented remedy when the default store rejects a proxy's CA, and what that remedy's limits are (process launch only) | COVERED | U-03 |
| T-3 | The kit's own behaviour under those two mechanisms | The deploy, the collector's failure message about a rejected certificate | DISMISSED | Not an external fact: observed by running the kit (the probes), which break-test rule 6 keeps out of the research project |

## Coverage notes (per dimension)

- **D-8, runtime and platform limits (COVERED, U-01/U-02/U-03):** the two mechanisms the finding
  and the recommendation rest on are documented at the tag in use - the copy's overwrite default
  and `COPYFILE_EXCL` (Node's `fs.md`, libuv's `fs.rst`), and `NODE_EXTRA_CA_CERTS`'s effect,
  launch-time limit and missing-file behaviour (Node's `node.1`). What is *not* documented is as
  load-bearing as what is: neither page describes the permissions the destination receives.
- **T-1, the copied file's mode (COVERED, U-01/U-02):** the capture of `deps/uv/docs/src/fs.rst`
  documents `uv_fs_copyfile`'s flags and the overwrite default and says nothing about permissions,
  so the 0444-to-0444 propagation measured on this host is undocumented behaviour; the fix
  therefore sets the mode explicitly instead of trusting propagation.
- **T-2, the trust store (COVERED, U-03):** the man page states what the variable extends, that a
  missing or malformed file is a warning and otherwise ignored, and that the value is read only at
  process launch - which bounds the recommendation to "set it before the process starts".

## Candidate material

Gathered 2026-10-07.

No search ran: this machine's egress reaches github.com and its API, codeload and the npm registry,
and nothing else - so the keyless search lane (DuckDuckGo) could not answer, exactly as
`decompose.mjs` recorded below. Phase 0 named the pages directly instead, from the runtime's own
repository at the tag of the runtime in use (v22.22.0):

- `doc/api/fs.md` - `fs.copyFile`/`fsPromises.copyFile`: the overwrite default and the
  `COPYFILE_*` modifiers.
- `deps/uv/docs/src/fs.rst` - `uv_fs_copyfile`, the layer that performs the copy: the same default,
  and silence on permissions.
- `doc/node.1` - the man page, whose `NODE_EXTRA_CA_CERTS` section renders whole where the GitHub
  viewer truncates the 116 KB `doc/api/cli.md` before its environment-variable section.

Search failures - a map drafted from failed searches looks like a map of a quiet topic, so they are listed:

- `Node's certificate store` on http-keyless: fetch failed (Client network socket disconnected before secure TLS connection was established)
- `what the runtime does the mode a copied file gets` on http-keyless: fetch failed (Client network socket disconnected before secure TLS connection was established)
