# Break-test report — 2026-09-30

## Project & Build Overview

- Checkout: `StepenkoAnatoli/Research-Kit`, branch `arena/01a0f37f-research-kit`.
- All root commands below ran from `/home/user/Research-Kit` unless stated otherwise.
- Dependency-free Node ESM source: no npm install, package lock, or compile/bundle step to exercise. Optional external collectors/browser tooling are separate runtime dependencies.
- Local environment: Linux, Node 22.22.3, Python 3.11.2.
- Full test command: `node research-kit/bin/selftest.mjs`. Baseline: **1348 passed, 0 failed**. No unsupported-test waiver was used.
- Other standard checks: `node research-kit/bin/preflight.mjs`, `node research-kit/examples/release-evidence/run-example.mjs`, and the three Node/Python conformance pairs in `.github/workflows/offline-suite.yml`.
- CI declares Linux/Windows platform legs, Node 22/24/26, and an archive-tree check. This session exercised Linux/Node 22 only, not remote CI.

## Discovered Failures & Actions

### 1. WARC exports unverified content after a concurrent replacement

**Severity: High — integrity impact, conditional on concurrent modification.** An exported resource can contain replacement bytes while its metadata still names the original capture hash. A normal refresh or editor write between verification and parsing is sufficient; no malformed ledger is needed.

**Root cause:** `exportWarc` reads and hashes a buffer, then calls `readText(abs)` to obtain the body. The second read is not the verified snapshot.

**Exact reproduction:** run the following from the repository root against the original implementation. It uses a disposable fixture and replaces its capture immediately after the binary verification read. `readCorpus` also reads text earlier, so the probe deliberately waits for the buffer read.

```sh
node --input-type=module <<'JS'
import fs from 'node:fs';
import path from 'node:path';
import { makePassingProject } from './research-kit/test/harness.mjs';
import { readLedger } from './research-kit/lib/corpus.mjs';
import { exportWarc, readWarc } from './research-kit/lib/warc.mjs';
const root = makePassingProject();
const entry = readLedger(root).entries.find(e => e.op === 'scrape');
const target = path.join(root, entry.raw);
const read = fs.readFileSync;
let swapped = false;
fs.readFileSync = function(file, ...args) {
  const data = read.call(this, file, ...args);
  if (file === target && Buffer.isBuffer(data) && !swapped) {
    swapped = true;
    fs.writeFileSync(target, '---\ntitle: replaced\n---\nUNVERIFIED REPLACEMENT\n');
  }
  return data;
};
try {
  const r = exportWarc(root);
  console.log({ swapped, skipped: r.skipped,
    exportedUnverified: readWarc(r.bytes).some(x => x.block.includes('UNVERIFIED REPLACEMENT')) });
} finally {
  fs.readFileSync = read;
  fs.rmSync(root, { recursive: true, force: true });
}
JS
```

Before fix: `swapped: true`, `skipped: []`, `exportedUnverified: true`.

**Fix attempted:** parse `raw.toString('utf8')` from the verified buffer, removing the redundant filesystem read. Added a deterministic test that compares the entire export to the original export despite replacement at this boundary. Updated the README's enforced test count and architecture map.

**Immediate full-suite result:** **1349 passed, 0 failed**, 53.1 seconds.

**Final status: applied.** This closes the second-read content race; it does not claim atomicity for the entire corpus or eliminate every filesystem path-check race.

### 2. SearXNG configuration query/fragment drops the deployment path

**Severity: Medium — availability/configuration impact.** Copying an instance URL with a query or fragment causes a sub-path deployment to receive requests at the wrong endpoint, commonly returning 404 or unrelated HTML.

**Exact reproduction:**

```sh
node --input-type=module <<'JS'
import { requestUrl } from './research-kit/lib/searxng.mjs';
for (const url of ['https://example.test/searx?theme=simple', 'https://example.test/searx#home']) {
  console.log(requestUrl(url, 'query').href);
}
JS
```

Before fix: both produce `https://example.test/search?q=query&format=json` instead of `/searx/search`.

**Root cause:** appending `/` to the serialized `href` appends inside the query or fragment, not to the pathname. Relative URL resolution then replaces the last path segment.

**Fix attempted:** append `/search` to `pathname`, clear query and fragment, then set the request parameters. Existing credentials handling is retained. Extended the existing URL regression test with query, fragment, and trailing-slash combinations; updated the architecture map.

**Immediate full-suite result:** **1348 passed, 0 failed**, 55.2 seconds. This was the first fix applied, before the WARC test was added.

**Final status: applied.**

## Successfully Applied Fixes

1. WARC uses the verified byte snapshot for export; one regression test added.
2. SearXNG preserves deployment paths when instance URLs contain queries/fragments; existing regression coverage extended.

No new dependencies, refactors, corpus edits, configuration overrides, commits, or pushes were needed.

## Rejected Fixes

None. Both individual fixes passed their immediate full-suite run. Per-fix backup restoration was wired into the validation command but was not needed.

**What was initially wrong and corrected:** the first WARC probe replaced the file after the earlier `readCorpus` text read. Hash verification correctly rejected that replacement, so that experiment did not demonstrate the suspected race. Moving the injection to immediately after the binary verification read reproduced it. No product change was made until reproduction succeeded.

## Additional Probes & Results

- **Syntax:** `node --check` passed for all **159** `.mjs` files under `research-kit`.
- **Malformed external inputs:** **232** calls combining JSON primitives, arrays, malformed result fields, and simulated child-process errors completed without throwing. Covered SearXNG, SerpAPI, Firecrawl search normalizers, Wayback availability parsing, and SearXNG/Wayback child-job handling (`ETIMEDOUT`, `ENOBUFS`, `EACCES`, invalid/empty/null stdout). This is bounded shape probing, not exhaustive fuzzing or real OS exhaustion.
- **Preflight:** PASS, **29 passing, 0 blocking, 0 warnings**.
- **Release examples:** **6/6** behaved as documented, including expected rejection cases.
- **Cross-language conformance:** Node and Python agreed per vector for `qualification-ledger-vectors.json`, `fi-sidecar-evidence-manifest-vectors.json`, and `property-graph-hash-vectors.json`. Commands are the three `--vectors ... --json` pairs in the offline workflow; report hashes are deliberately not compared.
- **Concurrent suites:** two complete selftest processes ran simultaneously in the checkout; each returned **1349 passed, 0 failed**, in 58.8 and 58.9 seconds. This tests suite isolation, not every possible concurrent collector schedule.
- **Archive/path portability:** copied all tracked working-tree files (including fixes) to a disposable `Research Kit café` directory without `.git`; full suite returned **1349 passed, 0 failed**, 54.4 seconds. The copy was removed afterward. This is a working-tree source-copy test, not a `git archive` of uncommitted changes.
- **Patch hygiene:** `git diff --check` passed; conformance and schema inputs remain unchanged.
- No live vendor calls or paid collection. Existing selftests exercise offline stubs and loopback services.

## Remaining Prioritized Risks

Ranked by impact and plausible exposure; these are bounded residual risks or validation gaps, not newly confirmed failing tests.

1. **High impact / conditional exposure: filesystem check-to-use races.** `projectFile` checks containment and file type before opening. A concurrently replaced symlink or regular file can still invalidate those checks before the read. Hash checking helps protect ledger-backed contents but is not an atomic file-opening guarantee. The applied WARC fix only removes its later re-read window.
2. **Medium: untested platform/runtime legs in this session.** Windows process and filesystem semantics, Node 24/26, and GitHub runner/action availability still require actual CI. Local green results cannot establish those properties.
3. **Medium: real resource exhaustion and abrupt termination.** Actual disk-full, descriptor exhaustion, OOM, and SIGKILL were not induced here. Simulated child errors and existing suite coverage do not prove graceful recovery under host-wide exhaustion. Do not weaken integrity checks merely to keep such a run green.
4. **Medium: live provider and optional dependency drift.** Offline parsers cannot prove current vendor behavior, browser availability, authentication, proxy policy, or external CLI compatibility. No package lock exists to test for dependency-resolution corruption; optional tools remain a separate operational concern.
5. **Low–Medium: in-memory WARC export scales with corpus size.** The exporter holds uncompressed records and compressed members before concatenation. Large corpora could exhaust memory; no measured capacity ceiling was established in this pass.

## Hardening Recommendations

- Run the existing CI matrix before release; require its actual checks rather than extrapolating from Linux.
- Retain verified buffers through parsing/export anywhere integrity is checked. Audit sibling read/verify/read patterns.
- Investigate descriptor-based opening and post-open validation for mutable paths using disposable fixtures on both Linux and Windows; avoid assuming POSIX flags are portable.
- Exercise disk/descriptor/memory limits in an isolated container or quota-backed temporary volume, never by filling the working repository's filesystem.
- Keep live collector smoke tests explicitly budgeted and credential-isolated. Track optional external tool versions separately from the dependency-free core.
- Benchmark WARC memory usage against realistic large corpora before choosing a limit or streaming refactor.

## Standing Protocol Record

- **What changed:** two narrowly scoped runtime fixes, associated regression coverage, the enforced README count, this report, and the architecture map.
- **Why:** reproduced incorrect endpoint routing and export of unverified replacement bytes.
- **What it touched:** `lib/searxng.mjs`, `lib/warc.mjs`, their tests, `research-kit/README.md`, and their `docs/ARCHITECTURE.md` rows. Existing ADR-0104/ADR-0090 contracts are unchanged; no new domain term or design alternative was introduced.
- **What you verified:** immediate full suites after each fix, repeated concurrent/source-copy suites, syntax, preflight, examples, conformance, and malformed-input probes detailed above.
- **What you got wrong and fixed:** the initial race-injection boundary, described under Rejected Fixes.

## Summary

Two confirmed defects fixed; zero fixes rejected or reverted. The latest full suites are green at **1349 passed, 0 failed**, with no unsupported-test waiver. Local resilience improved at the configuration and artifact-integrity boundaries. This is a bounded reliability pass, not proof that every realistic failure mode has been eliminated; platform CI, live services, and real resource limits remain explicit validation gaps.
