---
url: https://raw.githubusercontent.com/StepenkoAnatoli/Research-Kit/c61b17c9709cdf494320e2b5a854161fbfc4e3cc/docs/adr/0116-one-kit-version-stated-once.md
retrieved: 2026-10-06
command: firecrawl scrape https://raw.githubusercontent.com/StepenkoAnatoli/Research-Kit/c61b17c9709cdf494320e2b5a854161fbfc4e3cc/docs/adr/0116-one-kit-version-stated-once.md --only-main-content --max-age 0 --format markdown,rawHtml --json
statusCode: 200
transport: firecrawl-cli
completeness: full
---
# ADR-0116 — One kit version, stated once

- **Date:** 2026-10-01
- **Status:** accepted
- **Area:** `lib/core.mjs` (`KIT_VERSION`), `lib/mcp.mjs`, `bin/doctor.mjs`, `CHANGELOG.md`

## Context

The kit had no version. The MCP server alone announced one, `1.0.0`, in its `serverInfo`,
chosen when the server was written. A first release was to be tagged `v0.9.0`, so the tag and
the server would have disagreed from the start. Agents need to pin a version and to say which
version they ran.

## Decision

- **`KIT_VERSION` in `lib/core.mjs` is the version, and the only place it is stated.**
  - The MCP server announces it.
  - `doctor` reports it, as `kitVersion` in `--json` and on its last line.
  - `CHANGELOG.md` at the repository root has an entry headed `## <version>`.
  - A release is tagged `v<version>`.
- **A test holds these together.** It fails when the MCP server or doctor states another
  version, or when the changelog has no entry for this one.
- **Semantic versioning.** 0.9.0 is the first release: nearly stable, and a softer promise
  than 1.0.

## Rejected alternatives

- **A `package.json` `version` field.** The kit has no `package.json` on purpose: it is not an
  npm package and installs nothing. One file whose only field anyone reads would invite the rest.
- **`git describe` at run time.** A ZIP download and the `archive tree` CI job have no `.git`,
  so the version would be unknowable exactly where a copy travels.
- **A `VERSION` text file read at run time.** It is one more file that must travel, and one more
  read that can fail. A constant cannot be missing.

