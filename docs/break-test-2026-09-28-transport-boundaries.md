# Break test — transport boundaries, 2026-09-28

## Project & Build Overview

- Checkout: `StepenkoAnatoli/Research-Kit`, branch `arena/01a0e833-research-kit`, starting commit `083f76e137e1e3c306b4a15d9604e38a1e9d83c9`. Working tree was clean before changes.
- Dependency-free Node ESM CLI/library, plus Python cross-language conformance runners. No npm install, dependency lockfile, or product compilation step applies to the kit itself. The optional external Firecrawl CLI is a separate runtime prerequisite for that transport.
- Supported floor: Node 22 and Python 3.11; Git is needed by repository operations. Measured here: Linux, Node 22.22.3, Python 3.11.2.
- Full suite: `node research-kit/bin/selftest.mjs`. This custom runner awaits tests, has watchdogs, blocks on missing required capabilities, and checks the README's stated test count. Filters select test filenames, e.g. `node research-kit/bin/selftest.mjs concurrency`.
- CI: `.github/workflows/offline-suite.yml` covers Linux/Windows and a separate supported-Node matrix, with SHA-pinned actions and Python 3.11. Collection workflows are separate and were not dispatched.
- Repository acceptance: `node research-kit/bin/handoff.mjs` and `node research-kit/bin/preflight.mjs`.
- No paid collection, real credentials, external vendor requests, destructive repository probes, new dependencies, or gate overrides were used. Local HTTP stand-ins exercise actual child processes and sockets.

## Discovered Failures & Actions

### F1 — malformed search rows throw instead of returning usable results

**Severity:** Medium. **Status:** Applied.

**Impact:** One malformed vendor row can throw out of the search adapter and discard valid neighboring search results. Non-string URL/title/description fields also escape normalization and violate the expected downstream shape. This is a schema-drift/invalid-payload failure, not an observed vendor outage.

**Exact reproduction** (run from the repository root; no network):

```sh
node --input-type=module - <<'JS'
import { search } from './research-kit/lib/serpapi.mjs';
for (const rows of [
  [null, { link: 'https://example.com', title: 'Valid' }],
  [{ link: { bad: 'url' }, title: 42, snippet: [] }],
]) {
  try {
    console.log(search('probe', {
      key: 'offline-sentinel',
      job: () => ({ ok: true, payload: { organic_results: rows } }),
    }));
  } catch (error) {
    console.log(`${error.name}: ${error.message}`);
  }
}
JS
```

**Before:** The first case prints `TypeError: Cannot read properties of null (reading 'link')`; the second returns an object-valued URL, numeric title, and array description.

**Root cause:** `normalizeSearch()` checked that the outer container was an array but dereferenced each element without checking it. Nullish defaults did not constrain field types.

**Minimal fix:** Ignore null, primitive, and array rows; accept strings for URL/title/description; preserve valid neighboring rows and existing position handling. No provider-selection, billing, or payload-envelope semantics changed.

**Regression:** `TR-3: malformed result rows cannot crash or pollute the valid results` in `research-kit/test/serpapi.test.mjs`.

**Immediate full-suite result:** 1,163 passed, 0 failed, 35.2 seconds. Kept.

### F2 — SerpAPI buffers unbounded HTTP response bodies

**Severity:** High for resource-exhaustion impact; lower likelihood with a healthy vendor. **Status:** Applied.

**Impact:** An oversized vendor/proxy response is held in memory before JSON parsing, potentially exhausting the fetching child's memory and losing a paid search. The output-buffer limit does not bound the input body or allocations made before output. Actual OOM was deliberately not induced.

**Exact reproduction** (run from the repository root; local socket and fake key only):

```sh
node --input-type=module - <<'JS'
import { spawn } from 'node:child_process';
import { search } from './research-kit/lib/serpapi.mjs';
const server = spawn(process.execPath, ['--input-type=module', '-e', `
  import http from 'node:http';
  const body = ' '.repeat(17 * 1024 * 1024) + '{"organic_results":[]}';
  const s = http.createServer((req, res) => {
    res.writeHead(200, {
      'content-type': 'application/json',
      'content-length': Buffer.byteLength(body),
    });
    res.end(body);
  });
  s.listen(0, '127.0.0.1', () => console.log(s.address().port));
`], { stdio: ['ignore', 'pipe', 'inherit'] });
try {
  const port = await new Promise(resolve =>
    server.stdout.once('data', data => resolve(Number(String(data).trim()))));
  console.log(search('probe', {
    key: 'offline-sentinel',
    endpoint: `http://127.0.0.1:${port}/search`,
    env: { PATH: process.env.PATH },
  }));
} finally {
  server.kill();
}
JS
```

**Before:** `ok: true` for a body larger than 17 MiB. **After:** `ok: false` with `the SerpAPI response is larger than 16 MiB`.

**Root cause:** SerpAPI called `response.text()`, unlike the already-bounded keyless adapter. A child stdout cap only applies after downloading and parsing the response; whitespace-heavy JSON demonstrates this particularly clearly.

**Minimal fix:** Move the existing `boundedText()` reader to `runtime.mjs` and reuse it in both adapters. Apply the existing 16 MiB ceiling to SerpAPI search and account responses before parsing. Check both Content-Length and accumulated stream bytes. Preserve the keyless adapter's existing error wording; identify SerpAPI in its new refusal.

**Regression:** `SerpAPI search and account bound declared and chunked bodies before parsing JSON` in `research-kit/test/large-response.test.mjs`. Exercises both public APIs, both body-framing modes, 1 MiB successes, and oversized failures through actual fetching children.

**Immediate full-suite result:** 1,164 passed, 0 failed, 37.4 seconds. Kept.

## Successfully Applied Fixes

1. Defensive SerpAPI result normalization with mixed valid/invalid row regression coverage.
2. Shared bounded body reader covering SerpAPI search/account as well as existing keyless requests.
3. Updated architecture map and README test count to describe the retained implementation accurately.

No large refactor or dependency was required. Moving the existing reader avoids two copies of the same resource guard.

## Rejected Fixes

None. Neither logical fix group failed its immediate full-suite run, so no implementation rollback was necessary. The implementation commands included restoration paths for failure; they were not triggered.

## Verification and Adversarial Coverage

All commands below used `/home/user/Research-Kit` as cwd.

| Check | Outcome |
|---|---|
| Baseline full suite | 1,162 passed, 0 failed, 36.7s |
| Immediately after F1 | 1,163 passed, 0 failed, 35.2s |
| Immediately after F2 | 1,164 passed, 0 failed, 37.4s |
| Full suite with hostile environment below | 1,164 passed, 0 failed, 39.4s |
| `selftest.mjs concurrency`, five consecutive runs | 18 passed each; 90 assertions/test cases across runs, no failure observed |
| `node --check` over all `research-kit/**/*.mjs` | 144 files passed |
| Python `compile()` over all `research-kit/**/*.py` | 4 files passed |
| `handoff.mjs` | 33 ledger entries; cited captures present; chain verifies |
| `preflight.mjs` | PASS: 0 blocking, 0 warnings, 29 passing |
| `git diff --check` | Clean after trimming an extra blank line at EOF |

Hostile-environment full run:

```sh
scratch=$(mktemp -d '/tmp/rk hostile temp.XXXXXX')
TZ=Pacific/Kiritimati LANG=C LC_ALL=C TMPDIR="$scratch" \
  node research-kit/bin/selftest.mjs
```

The full suite also exercised its existing cases for HTTP failures/timeouts, proxy routing, hostile command arguments, failed writes, corrupt ledger tails, stale/live locks, missing prerequisites, and git-index failures. These are existing regression fixtures, not newly discovered defects. Five extra concurrency runs exercise actual competing collectors; they are a smoke test for flakiness, not a statistical guarantee.

## Remaining Prioritized Risks

These are bounded-session residual risks, not claims that every scenario was reproduced.

1. **High impact / environment-dependent likelihood — proxy bypass on older supported Node versions or invalid proxy configuration.** Existing policy intentionally warns and goes direct when automatic proxy routing is unavailable (`runtime.mjs`, ADR-0046/0047). In proxy-only or policy-restricted environments that means failed requests or undesired egress. This session ran Node 22.22.3, not every supported version. Use Node 22.21+ on the 22 line and valid proxy URLs; enforce network policy outside the process where required. No existing ADR was changed.
2. **High impact / unmeasured likelihood — true disk exhaustion, process death during durable writes, and tight memory limits.** Existing failure-injection/ledger tests pass, but this session did not fill the filesystem, kill active real collections, or force OOM. A 16 MiB body limit bounds bytes, not total RSS: decoding, JSON parsing, result objects, and subprocess output can coexist. Run destructive resource tests only in disposable workspaces with explicit quotas and synthetic corpora.
3. **Medium — platform/runtime portability remains CI-dependent.** Windows shell/shim handling, checkout behavior, permissions, and other supported Node lines were inspected through tests/configuration but not executed on their native hosts here. Require the full existing CI matrix before release.
4. **Medium — real vendor and external CLI drift.** Loopback stand-ins cannot establish current vendor schema, authentication, quota semantics, TLS/proxy infrastructure, or Firecrawl installation health. An authorized, budget-capped collector smoke test is still needed before operational release; no key or budget was assumed here.
5. **Medium — malformed search rows are now safe but can reduce recall silently.** The patch preserves the current normalization contract of dropping unusable rows. It does not add schema-change telemetry or change existing handling of a null/top-level malformed payload. Operators could mistake degraded upstream data for sparse search results. Consider explicit diagnostics with compatibility tests in a separate change.
6. **Low — repeated-run coverage is finite.** Five concurrency passes and multiple full-suite passes found no flake, but cannot rule out rare scheduler/filesystem races. Repeat on Windows and constrained CI agents.

## Hardening Recommendations

- Require green Linux/Windows and supported-Node CI legs before merging or releasing these changes.
- Add a scheduled offline stress job for concurrency tests; retain environment/version metadata with failures.
- Measure peak RSS for compressed, near-limit, and object-heavy JSON responses under disposable container quotas. The new size limit should not be advertised as a process-memory ceiling.
- Exercise disk-full and abrupt-termination recovery against synthetic evidence in an isolated volume, never the repository's collected corpus.
- Keep transport diagnostics credential-safe; consider an explicit schema-drift warning when result rows are rejected.
- Use the collector's documented workflow for any live smoke test, with an explicit budget and no changes to existing evidence merely to validate a transport.

## Summary

The baseline was green; targeted probes found two uncovered transport-boundary defects. Both were fixed with small dependency-free changes, both immediately passed the full suite, and the expanded suite passed again under a hostile timezone/locale/temp-path combination. Handoff and preflight remain green. This is improved offline resilience, not an exhaustive guarantee against all build, vendor, platform, or resource failures.

## Change Record

- **what changed:** Hardened SerpAPI row normalization; shared the existing bounded response reader; added two regression tests; updated the README count and architecture map.
- **why:** A null search row threw a TypeError, and a 17 MiB SerpAPI body was accepted without an input-memory bound. Reusing the established reader was the direct remedy rather than adding a dependency or a second size-limit implementation.
- **what it touched:** `lib/serpapi.mjs`, `lib/http-transport.mjs`, `lib/runtime.mjs`, their tests, `research-kit/README.md`, `docs/ARCHITECTURE.md`, and this report. No new domain terminology or research claims were introduced.
- **what you verified:** Full-suite runs after each fix, the hostile-environment full run, repeated concurrency tests, JavaScript/Python syntax, handoff, preflight, and diff whitespace.
- **what you got wrong and fixed:** The initial shell inspection explicitly selected `/home/user` instead of the checkout, so its `git status` reported not-a-repository. All subsequent repository commands used the correct cwd. Diff review also caught and removed an extra EOF blank line; the following full suite passed.
