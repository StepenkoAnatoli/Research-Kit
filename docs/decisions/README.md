# Decision research projects

Each folder here is a nested research project (ADR-0030): its own contract, captured pages
and hash-chained ledger. Together they are the evidence behind a decision about this
repository. The retention rule is **ADR-0102**:
- **Nothing here is deleted or moved.** ADRs, code comments, workflows and measurements
  link to these paths, and the captures are the provenance of a committed claim.
- **Each project has a row below**, added in the same commit that adds the project.
- **Its status changes when what it backs changes:**
  - **active**: an accepted ADR, the kit's code, or a workflow rests on it.
  - **superseded**: every ADR it backs has been superseded. The project stays, as the
    record of why the old decision was made.
  - **reference**: no ADR or code rests on it; a measurement, a test or a report cites it.

| Project | Question | Backs | Status |
|---|---|---|---|
| [2026-09-21-agent-interface](2026-09-21-agent-interface/) | How an MCP server should expose the collector: transports, auth, long-running calls | ADR-0034, ADR-0036 | active |
| [2026-09-21-delivery-architecture](2026-09-21-delivery-architecture/) | How the kit should be delivered to a non-technical user | ADR-0030–0033, ADR-0035, ADR-0036; `collect.yml` | active |
| [2026-09-21-public-run-visibility](2026-09-21-public-run-visibility/) | Who can read Actions run logs and artifacts on a public repository | ADR-0035, ADR-0036; `collect.yml` | active |
| [2026-09-21-sea-assets](2026-09-21-sea-assets/) | Bundling assets into a Node single executable application | ADR-0027, ADR-0031, ADR-0036 | active |
| [2026-09-22-build-sea](2026-09-22-build-sea/) | Node's `--build-sea` without postject | ADR-0027, ADR-0031 | active |
| [2026-09-22-eudr-dates](2026-09-22-eudr-dates/) | EU Deforestation Regulation application dates (the kit on an unfamiliar topic) | `docs/measurement-2026-09-28.md` | reference |
| [2026-09-22-tavily-privacy](2026-09-22-tavily-privacy/) | Tavily data retention and training on inputs | `docs/measurement-2026-09-28.md` | reference |
| [2026-09-22-tavily-terms](2026-09-22-tavily-terms/) | Tavily terms of service, retention and training | `docs/measurement-2026-09-28.md`, `docs/measurements/2026-09-26-search-reliability/` | reference |
| [2026-09-22-wx-lock](2026-09-22-wx-lock/) | `fs.writeFileSync` with `wx` as an exclusive-create lock | `lib/provenance.mjs` | active |
| [2026-09-26-actions-node24](2026-09-26-actions-node24/) | Moving the pinned Actions off the Node 20 runtime | ADR-0041, ADR-0043 | active |
| [2026-09-26-actions-sept-changes](2026-09-26-actions-sept-changes/) | GitHub Actions changes of September 2026 that touch the kit | ADR-0042; `collect.yml` | active |
| [2026-09-27-kit-path-spelling](2026-09-27-kit-path-spelling/) | Spelling a travelling kit command for PowerShell, cmd, bash and zsh | ADR-0050 | active |
| [2026-09-27-mcp-protocol-versions](2026-09-27-mcp-protocol-versions/) | Which MCP protocol revisions the stdio server should serve | ADR-0049 | active |
| [2026-09-27-node-support](2026-09-27-node-support/) | Supported Node versions, and when fetch honours `HTTPS_PROXY` | ADR-0046, ADR-0047 | active |
| [2026-09-28-browser-transport](2026-09-28-browser-transport/) | Headless Chromium as a free transport | ADR-0088 | active |
| [2026-09-28-collection-cost-model](2026-09-28-collection-cost-model/) | What Firecrawl and SerpAPI calls cost, and whether the kit's budget assumptions hold | `docs/measurement-2026-09-28.md`, `test/search-seam.test.mjs` | reference |
| [2026-09-28-fetch-fallback](2026-09-28-fetch-fallback/) | Falling back when Firecrawl credits run out | ADR-0086 | active |
| [2026-09-28-kit-measurement](2026-09-28-kit-measurement/) | Citation-accuracy metrics for measuring the kit | ADR-0089; `lib/measure.mjs` | active |
| [2026-09-28-quote-anchors](2026-09-28-quote-anchors/) | Verifying quotations against cited sources | ADR-0087 | active |
| [2026-09-28-warc-export](2026-09-28-warc-export/) | Exporting a corpus as WARC 1.1 | ADR-0090 | active |
| [2026-09-29-chromium-sandbox-userns](2026-09-29-chromium-sandbox-userns/) | Chromium's sandbox under Ubuntu's user-namespace restriction | ADR-0092 | active |
| [2026-09-29-perspective-discovery](2026-09-29-perspective-discovery/) | STORM-style perspective discovery without a language model | ADR-0091 | active |
| [2026-09-30-searxng-search](2026-09-30-searxng-search/) | SearXNG's JSON Search API as a keyless search transport | the SearXNG search provider (ADR to follow) | active |
