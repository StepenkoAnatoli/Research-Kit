# Break-test reliability report — 2026-10-01

## Project & Build Overview

Research-Kit is a dependency-free Node.js ESM toolkit for collecting evidence, maintaining a hash-chained corpus, judging research readiness, and exporting portable artifacts. Python conformance implementations accompany the JavaScript validators. There is no npm compilation/install step. Configuration is split between project `research/kit.json` and machine configuration; collection, review, and build authorization are separate concerns.

The principal offline checks are:

```sh
node research-kit/bin/selftest.mjs
node research-kit/bin/preflight.mjs
node research-kit/examples/release-evidence/run-example.mjs
node research-kit/bin/ledger-conformance.mjs
node research-kit/bin/fi-sidecar-conformance.mjs
node research-kit/bin/property-vector-conformance.mjs
```

CI pins third-party actions by commit, runs platform/Node matrices and an archive-tree test, checks conformance, and checks generated-output cleanliness. The test runner checks the documented test count. Code-path changes require a corresponding architecture-map update.

This session ran on Linux, Node 22.22.3. Baseline: **1361 passed, 0 failed**, preflight **29 passing / no warnings or blockers**, examples **6/6**. Inspection emphasized transport degradation, filesystem boundaries, artifact packaging/downloads, CLI/hook behavior, and CI. This is a targeted reliability pass, not exhaustive verification of every release-validator branch. No paid collection, live workflow dispatch, or destructive disk-exhaustion experiment was performed. Raw captures and their ledger were not modified.

## Discovered Failures & Actions

### F1 — Download filenames can escape the requested directory

**Severity: High.** Untrusted remote metadata can select a file outside the destination directory; atomic replacement does not prevent replacement at the wrong path. Exploitation requires control over accepted remote metadata (not demonstrated against GitHub's own name restrictions).

**Reproduction:** inject `fetch` into `fetchCorpus` so the artifact listing returns one non-expired artifact with name `research-kit-corpus-v1-/../../../pwned`, and download returns `not a zip`. Choose an output directory `<temporary-root>/sub/out`. Before the fix, the resulting file was `<temporary-root>/pwned.zip`, outside `out`.

**Root cause:** `path.join(dir, remoteName + '.zip')` accepted separators and parent segments without checking the filename. ZIP wrapper entry names also became filesystem paths.

**Fix:** reject unsafe API-derived output filenames with `DispatchError` code `ARTIFACT_NAME`; flatten an inner wrapper entry to its basename. Reject Windows separators, drive separators, and control characters on all hosts. Existing atomic writes are retained.

**Tests/status:** regression exercises POSIX traversal, Windows separators, and nested wrapper entries. Applied with F2: **1363 passed, 0 failed**, preflight **29 passing**.

### F2 — Corrupt compressed ZIP wrapper leaks a low-level exception

**Severity: Medium.** A malformed download bypasses the intended validation-result path and surfaces as a ZIP exception without the intended artifact diagnosis.

**Exact reproduction:**

```js
import { buildZip } from './research-kit/lib/archive.mjs';
import { unwrapArtifact } from './research-kit/lib/dispatch.mjs';
const bytes = buildZip([{ name: 'a.zip', data: 'hello'.repeat(100) }]);
bytes.fill(255, 35, 40);
unwrapArtifact(bytes);
```

Before the fix this threw `ZIP-READ: entry "a.zip" could not be decompressed: invalid block type`.

**Root cause:** the catch covered opening the central directory but not reading/decompressing the inner entry.

**Fix:** catch inner-entry read failures and return the original bytes with `unwrapped: false`, matching existing hostile-container handling. This is not successful validation: the caller still judges the bytes through the artifact validator.

**Tests/status:** corrupt-deflate regression added. Applied and verified with F1 as one download-boundary fix batch: **1363 passed, 0 failed**, preflight green.

### F3 — Artifact inventory follows cycles and accepts blocking special files

**Severity: High for FIFO hangs; Medium for cyclic duplication.** A FIFO can block packaging indefinitely; directory links duplicate content repeatedly and can amplify inventory growth.

**Reproduction:** scaffold a disposable project, then run `mkfifo <project>/research/raw/pipe.md` and call `createArtifact` with root, repository `owner/repo`, ref `refs/heads/main`, commit `a` repeated 40 times, workflow `collect.yml`, and workflowRunId `1`. A two-second watchdog terminated the original call with exit **124**. Separately, create `docs/loop -> .` and call `collectProjectFiles(root)`: the original inventory contained dozens of repeated `docs/loop/.../ARCHITECTURE.md` paths, eventually reaching the OS symlink limit.

**Root cause:** inventory distinguished only directories versus everything else; it neither checked regular-file type nor tracked directory ancestors by real path.

**Fix:** refuse non-regular files and cyclic directory ancestry with `UNPACKAGEABLE_FILE`. Track ancestors, not a global visited set, so non-cyclic internal aliases remain supported. Refuse rather than silently omit evidence.

**Tests/status:** regression covers a directory cycle and, on non-Windows hosts, a real FIFO. Applied: **1364 passed, 0 failed**, preflight **29 passing**. This is an inventory guard, not a claim to eliminate filesystem races or every special-file read in the toolkit.

### F4 — Search degradation invokes `.search()` on fetch-only transports

**Severity: High.** An ordinary provider outage or exhausted credits aborts collection/map drafting instead of producing recorded search failures.

**Reproduction:** in a disposable scaffolded project with a query in its plan, call `runResearch` with `{ adapter: { name: 'browser' }, searchAdapter: { name: 'search-only', search: () => ({ ok: false, error: 'unavailable' }) } }`. Also reproduce with a paid search adapter returning credit exhaustion and a fetch-only browser `fallbackAdapter`. For map drafting, call `decompose` with topic `Example`, a fetch-only browser adapter, and a failing search adapter. The original calls threw `TypeError: provider.search is not a function` or `TypeError: adapter.search is not a function`.

**Root cause:** search selection and fallback assumed every fetch adapter implemented search, despite browser transport being fetch-only.

**Fix:** `searchPatiently` returns an explicit failed-search result for a transport without a search method. Map drafting uses the same capability guard with zero retries, preserving its existing retry behavior. Failure diagnostics remain visible; the fix does not invent a browser search capability or silently turn failures into successful empty results.

**Tests/status:** regressions exercise collection degradation, exhausted-credit fallback, and map drafting with and without a separate search provider. Applied: **1366 passed, 0 failed**, preflight **29 passing**.

## Successfully Applied Fixes

- Contained artifact download filenames and flattened nested wrapper output names.
- Preserved the validation path for corrupt compressed wrapper entries.
- Refused special files and cyclic directory ancestry during package inventory.
- Converted unsupported search capabilities into recorded failures instead of TypeErrors.
- Added five regression tests; updated architecture documentation and the pinned README count.

Each code-fix batch was immediately followed by the full offline suite and preflight. Final additional checks: release examples **6/6**, ledger conformance **23 vectors**, FI-sidecar conformance **13 vectors**, property-vector conformance **5 vectors**, and `git diff --check` all passed.

## Rejected Fixes

None: all attempted code-fix batches passed their immediate full suite; no rollback was required.

Two preliminary hypotheses were corrected rather than patched: nested inner ZIP paths did not throw ENOENT because `writeBytes` creates parents; a simple stored-payload bit flip did not reproduce the presumed ZIP-read exception. The demonstrated corruption case uses an invalid deflate stream. The cycle probe showed repeated traversal until OS limits, not an observed infinite single-link loop.

## Remaining Prioritized Risks

1. **Filesystem time-of-check/time-of-use races.** Files can change after inventory checks and before reads. Ancestor symlinks can also change. These fixes do not make a concurrently hostile local filesystem safe; use isolated, stable project snapshots for packaging.
2. **Special files outside inventory.** Other corpus/configuration readers may run before inventory or outside packaging. Their complete special-file behavior was not verified. Extend non-blocking/type-safe reading to those seams based on reproductions.
3. **Resource exhaustion.** Multiple directory aliases, large source trees, large downloads and archives still deserve explicit byte/count/time budgets. A single-cycle guard is not a general resource budget.
4. **Search availability.** A fetch-only fallback cannot discover pages. The crash is fixed, but successful research still needs a working search transport or explicit URLs. Operators must read recorded failures.
5. **Environment coverage.** Windows, other Node lines, archive-tree execution of this patch, real GitHub API restrictions, and live provider behavior were not re-run locally. Existing CI should exercise its declared matrix before merging.

## Hardening Recommendations

- Add a dedicated adversarial-filesystem test group covering canonical corpus files, directory aliases, and concurrent replacement.
- Keep download destinations flat and treat remote metadata as untrusted even when the upstream service normally restricts names.
- Add explicit search-capability validation to transport selection UX so operators learn limitations before collection starts.
- Apply bounded download/inventory budgets and cancellation where not already enforced; test with local/injected peers, not paid services.
- Keep full-suite execution after each fix, architecture-map coupling, pinned CI actions, and cross-language conformance checks.

## Summary

The offline build remains green and is more resilient at four demonstrated failure boundaries. The final suite is **1366 passed, 0 failed**, up from 1361; preflight reports **zero blockers and zero warnings**. These are scoped, dependency-free changes, not a guarantee against hostile concurrent filesystems or untested platform/provider behavior.
