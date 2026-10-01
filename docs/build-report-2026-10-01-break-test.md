# Build report — break-test, 2026-10-01

An adversarial pass over the current Research-Kit build. The pass covered compile/runtime
boundaries, offline tests, dependency and vendor output, configuration, environment and
portability assumptions, concurrency, resource limits, network inputs, input validation,
and artifact safety. Only targeted changes that left the authoritative suite green were kept.

## Project & Build Overview

Research-Kit is a dependency-light Node.js ESM kit. The offline authority is:

```text
node research-kit/bin/selftest.mjs
```

The runner discovers the module and integration tests under `research-kit/test/`, uses no
credential and no network, and includes CLI, transport, workflow, artifact, WARC, ledger,
concurrency, hostile-input and portability checks. The focused collection group is:

```text
node research-kit/bin/selftest.mjs collect
```

The final focused run passed **111 tests**. The final authoritative run passed **1369 tests
in 56.1 seconds**, with **0 failures** and exit code 0. The documentation count is 1369.
No dependency was added, and no paid/live collection was enabled.

Existing CI and repository checks were treated as part of the build surface: pinned Actions,
archive-tree execution, regeneration/clean-tree checks, supported Node and Windows paths,
Python conformance, and the live-collection opt-in gate. The break-test did not modify
credentials, external services, or the repository's corpus.

## Discovered Failures & Actions

### 1. Generated capture paths could follow a symlink

**Reproduction.** In a project, create the generated `research/raw/<capture-name>.md` as a
symlink to a file outside the project, then call `writeRaw()` for that URL. The old path
checked whether the destination existed, read it for collision comparison, and eventually
used the normal writer; a link could therefore redirect the capture write outside the
corpus. A linked parent directory had the same class of failure.

**Root cause.** Ordinary project writers intentionally follow symlinks for supported machine
configuration use cases, but the collector's generated capture path is an output boundary.
The path was not distinguished from ordinary project files.

**Severity: High.** A checked-out or otherwise untrusted corpus could cause collected page
bytes to overwrite an arbitrary file writable by the process, while the collector reported
a normal capture.

**Impact.** Data loss or unauthorized modification outside the intended project tree; the
risk was especially relevant to automated collection and artifact generation.

**Action/fix.** Added `assertNoSymlinks()` to walk every existing component with `lstat`, made
`writeRaw()` check before collision reads and use `writeBytes(..., { followSymlinks: false })`,
and added a named `ELOOP` refusal. The existing normal writer behavior remains unchanged for
non-capture paths.

**Test outcome.** Focused collection tests passed, including `writeRaw refuses a symlinked
capture path before reading or writing outside the project`; the final full suite passed.

### 2. Hostile multiline capture metadata could inject front matter

**Reproduction.** A capture title such as:

```text
A title
url: https://attacker.invalid/claimed
retrieved: 1999-01-01
```

was written into the scalar `title:` field without flattening. `parseCapture()` then treated
the injected lines as real front-matter fields, replacing the URL and retrieval date in the
capture index even though the ledger still recorded the original page.

**Root cause.** Adapter/vendor metadata is untrusted text, but front-matter scalars were
interpolated directly into a line-oriented format.

**Severity: High.** The corpus index could point at an attacker-chosen URL/date, desynchronise
from the provenance ledger, and misattribute evidence. The markdown body itself is evidence
and must remain byte/content-verbatim, so it was not globally normalized.

**Impact.** Incorrect citation identity and potentially misleading evidence metadata, without
a parser exception to alert the operator.

**Action/fix.** Flatten carriage returns and newlines in every generated front-matter scalar
(URL, date, command, status, transport, completeness, omitted text, and title). The markdown
page remains unchanged. Added a regression that verifies the original URL/date survive and
all hostile metadata values occupy one line.

**Test outcome.** The initial regression assertion was intentionally narrowed after it
incorrectly rejected correctly sanitized inline text. The corrected focused suite passed,
then the final full suite passed.

### 3. A vendor rate-limit message could request an unbounded sleep

**Reproduction.**

```js
rateLimitWaitMs('Rate limit exceeded; please retry after 999999999999s')
```

previously returned roughly `1e15` milliseconds. `collectOne()` sleeps while holding the
exclusive corpus lock, so one untrusted vendor message could park the collector and every
other concurrent collection for years.

**Root cause.** Digits parsed from vendor error text were converted directly to milliseconds;
the retry count was bounded, but the individual delay was not.

**Severity: High for availability.** A malformed or hostile response could create a practical
denial of service and retain the writer lock indefinitely.

**Impact.** Collection would appear hung, other runs would queue behind the lock, and a paid
workflow could time out without a useful diagnosis.

**Action/fix.** Added the named `MAX_RATE_LIMIT_WAIT_MS` cap of 60 seconds. Stated delays up
to that cap retain their normal behavior; absurd or malformed rate-limit responses now wait
at most one minute, and existing bounded retry counts still apply.

**Test outcome.** Added the 999999999999-second regression assertion. Focused and final full
suites passed.

### 4. Search results could pass non-web schemes to a fetch adapter

**Reproduction.** Before the fix, the pure candidate selector accepted vendor rows such as
`javascript:alert(1)` and `file:///etc/passwd` alongside ordinary search results. These rows
could reach a selected fetch adapter; the browser transport in particular passes the selected
URL to Chromium. Direct plan URLs had validation, but search output had a separate, weaker
boundary.

**Root cause.** Search result normalization checked that a URL-like string existed, while
candidate selection assumed the vendor had supplied an HTTP(S) page. Search results are
untrusted external input and need the same scheme boundary as plan URLs.

**Severity: High security/robustness risk.** The browser path could be induced to process a
non-web URL, and different transports could disagree about how to handle it. Even where a
transport refused it, the collector would spend time and produce an opaque adapter error.

**Impact.** Possible local/browser scheme handling, inconsistent fetch behavior, and an
avoidable paid attempt on an invalid candidate.

**Action/fix.** Added an HTTP(S) URL check in `selectCandidates()` before ranking, query
matching, deduplication, or queuing. Both `http:` and `https:` remain supported; other
schemes, malformed values, and missing hostnames are dropped before any fetch adapter sees
them.

**Test outcome.** Added `selectCandidates drops non-http vendor URLs before any fetch adapter
sees them`; focused collection passed 111 tests and the final suite passed 1369 tests.

## Successfully Applied Fixes

- Capture output paths now refuse existing symlinks in any path component and use a
  non-following atomic write mode.
- Generated front-matter scalars are single-line values, while captured page content remains
  verbatim.
- Vendor-supplied rate-limit waits are capped at 60 seconds without removing bounded retry
  handling.
- Search candidates are restricted to host-bearing HTTP(S) URLs before reaching transports.
- Regression coverage was added for each confirmed defect.
- `research-kit/README.md` was corrected to the actual final registry count: 1369 tests.

## Rejected Fixes

- **A 1369-test README update before adding the URL regression was rejected/restored.** The
  metadata and rate-limit changes edited existing tests and the full run still had 1368 tests.
  The authoritative runner deliberately failed on the stale claim (`README.md claimed 1369;
  run had 1368`). The count was returned to 1368, the new URL regression was then added, and
  the final count was updated to 1369 only after the final full run confirmed it.
- **Normalizing the evidence body was rejected.** Flattening or trimming page markdown would
  alter the exact bytes collected and invalidate evidence hashes. Only front-matter scalar
  metadata is sanitized.
- **Adding a dependency or a broad URL/refactor layer was rejected.** The HTTP(S) check is a
  small boundary fix in candidate selection; introducing a URL package or changing every
  transport would increase portability and regression surface without being necessary.
- **Enabling live or paid probes was rejected.** The offline suite and injected seams provide
  deterministic coverage without using credentials or spending vendor credits.

## Remaining Prioritized Risks

1. **Adapter URL provenance is still only partially canonicalized.** Search candidates are
   now scheme-checked, but a malformed string URL returned by a scrape adapter can still
   disagree with the requested URL after front-matter trimming. A future hardening pass should
   define one canonical URL validator/normalizer at the adapter boundary and reject or record
   invalid vendor source URLs rather than rewriting them.
2. **Symlink defense is not a hostile-process race-proof primitive.** The collector checks the
   path before reading and writing, but a separate local process could replace a parent with a
   symlink between the check and the final rename. The corpus lock protects cooperating kit
   processes, not an attacker with local write access; directory-handle or platform-specific
   no-follow APIs would be needed for that threat model.
3. **DNS rebinding remains a network boundary risk.** Redirect destinations are checked against
   resolved internal addresses, but a hostname can theoretically resolve differently between
   the check and the subsequent fetch. A future transport could pin validated addresses or use
   a resolver/fetch path that binds the check to the connection.
4. **The Firecrawl CLI is an external global dependency.** Major-version refusal catches the
   highest-risk contract change, but minor/patch output changes, installation failures, and
   vendor rate-limit wording remain environment-dependent. Exact package pinning and a small
   live canary remain advisable for paid workflows.
5. **Resource exhaustion remains bounded only where the child transport enforces its output
   limit.** Direct library callers can still hand very large in-memory markdown/metadata to
   capture writers. A per-capture byte budget and explicit refusal would make that contract
   uniform for all callers.
6. **Platform-specific behavior needs real CI legs.** Local execution was Linux-only in this
   pass. Windows symlink privileges, CRLF behavior, path length, shell quoting, and browser
   availability remain dependent on the existing Windows CI matrix.

## Hardening Recommendations

- Centralize `canonicalHttpUrl()` and use it for plan URLs, normalized scrape results,
  search rows, ledger entries, front matter, witness records, and artifact citations. Prefer a
  named refusal over silently rewriting a URL.
- Replace path-string symlink checks with descriptor-based no-follow operations where the
  supported Node/platform matrix permits; retain the current named refusal as the fallback.
- Add a bounded capture-size contract before writing/hash calculation, with a regression that
  proves the old file and ledger remain intact after refusal.
- Keep the paid workflow's canary, protected-environment gate, concurrency group,
  `cancel-in-progress: false`, and exact pre-spend input validation. Run the archive-tree and
  clean-tree checks on every release.
- Keep vendor parsers fixture-driven and add one live compatibility canary for each externally
  installed CLI version. Do not log raw vendor error text without redacting credentials and
  untrusted control characters.
- Repeat the break-test matrix under supported Node versions and Windows, especially for
  symlinks, shell-free child processes, atomic writes, path limits, and closed stdout.

## Summary

The break-test confirmed four realistic defects: capture symlink traversal, multiline
front-matter injection, unbounded vendor-requested rate-limit sleeps, and non-HTTP search
candidates reaching fetch transports. Each received the smallest targeted fix with a focused
regression. The only intermediate full-suite failure was the intentional documentation-count
guard after a count was raised before a new test existed; the documentation was corrected and
then updated after the URL regression was added.

Final state: **1369 passed, 0 failed**, authoritative command exit code **0**, no credentials
used, no network or paid collection performed, and no new dependency introduced.
