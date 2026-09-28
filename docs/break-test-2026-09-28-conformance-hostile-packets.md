# Break test — 2026-09-28 — hostile conformance packets

Scope: find realistic build failures in the Research-Kit repository, apply only fixes that
keep the suite green, revert anything that does not.

Test command (the one CI runs, and the one enforced after every change):

```
node research-kit/bin/selftest.mjs
```

Full gate set reproduced locally, in the order `offline-suite.yml` runs them:

| Gate | Command | Result |
|---|---|---|
| selftest | `node research-kit/bin/selftest.mjs` | 1144 passed, 0 failed |
| preflight | `node research-kit/bin/preflight.mjs` | exit 0 |
| release evidence examples | `node research-kit/examples/release-evidence/run-example.mjs` | exit 0, 6/6 |
| cross-language conformance | node vs python, all three vector packets | agree on every vector |
| hook executable bit | `git ls-files -s research-kit/githooks/pre-commit` | 100755 |
| validator inputs unchanged | `git diff -- research-kit/conformance research-kit/schemas` | clean |
| working tree | `git status --porcelain` | only this session's edits |

Environment: node v22.22.3, python 3.11.2, git 2.39.5, linux. The kit also promises Node
24/26 and Windows; only 22/linux was available here, so those legs are unverified (see
Remaining Risks).

---

## Discovered failures & actions

### F-01 — A hostile vector packet makes the Python runners crash instead of reporting

**Reproduction**

```bash
# a ledger vector whose value carries an unpaired surrogate in a KEY
node -e '...'   # see the regression test: research-kit/test/conformance-hostile.test.mjs
node research-kit/bin/ledger-conformance.mjs --vectors surrogate.json --json   # exit 0, PASS
python3 research-kit/bin/ledger_conformance.py --vectors surrogate.json --json # exit 1, traceback, no JSON
```

`{"a":1,"\ud800":2}` is legal JSON. Both languages parse it. The Node runner canonicalised
it and reported `PASS`. The Python runner printed a `UnicodeEncodeError` traceback and
wrote **nothing** to stdout.

**Root cause** — three faults meeting in one place:

1. `bin/conformance_common.py` sorted object keys with `key.encode("utf-16-be")`. CPython
   refuses to encode a lone surrogate, so the **sort** raised before `json_string` — the
   function whose whole job is to refuse that character — ever ran.
2. `UnicodeEncodeError` is a `ValueError`, not a `ConformanceError`, so nothing caught it.
3. `main()` in `ledger_conformance.py` and `property_vector_conformance.py` caught
   `(OSError, VectorPacketError)` / `(OSError, PacketError)`. `VectorPacketError` is a
   **subclass** of the shared `ConformanceError`, so catching the subclass did not catch
   the base class that `canonical_json` actually raises.

**Severity** High. **Impact** — the `--json` contract is broken: a host comparing the two
languages gets empty stdout and dies on `JSON.parse`. This is the same defect class the
repository already fixed for `RecursionError` and pinned in
`conformance-hostile.test.mjs`, reached by a different route. It also means the two
languages disagree about the digest of one document, which is the failure that has already
cost this repository twice (2026-09-20 float drift; 2026-09-28 deep nesting).

**Fix attempted** — (a) sort with `errors="surrogatepass"`, which is byte-identical for
every key without a lone surrogate and lets a surrogate key reach the documented refusal;
(b) catch `ConformanceError` in both runners' `main`; (c) state the same rule in
`lib/release/canonical.mjs` so the Node twin refuses what the Python twin refuses.

**Test result** — full suite green (see above). New regression tests added; verified they
fail on the unpatched tree (`2 failed` with the source reverted).

**Final status** APPLIED.

---

### F-02 — A packet deep enough to parse but too deep to canonicalise crashes the Python runners

**Reproduction**

```bash
node   research-kit/bin/ledger-conformance.mjs --vectors deep400.json --json  # exit 1, FAIL report
python3 research-kit/bin/ledger_conformance.py  --vectors deep400.json --json # exit 1, traceback, no JSON
```

`deep400.json` is a valid packet whose vector value is `[[[...400 deep...]]]`.

**Root cause** — the existing hostile test nests **200,000** levels, where both sides fail
at *parse* time and never go further. That left a window uncovered. The readers and the
canonicaliser all recurse, and their limits are different numbers on each side:

| | parses to | canonicalises to |
|---|---|---|
| node `parseJsonNoDuplicates` | 4,356 | — |
| node `canonicalJson` | — | 2,984 |
| python `json.loads` | ~999 | — |
| python `canonical_json` | — | ~300–500 |

So a document nested between roughly 300 and 999 **parses** and then dies inside
`canonical_json`. `RecursionError` is a `RuntimeError`, not a `ConformanceError`, and the
parse sites catch it while the canonicalisation path did not — so it escaped `main()`.

`fi_sidecar_conformance.py` already caught `RecursionError`; the other two did not.

**Severity** High. **Impact** — identical to F-01: traceback, no JSON, and CI's
cross-language step dies on `JSON.parse` of an empty file. Both limits are interpreter
implementation details that move with the version, so the window is not stable.

**Fix attempted** — name `RecursionError` in both runners' `except` tuple.

**Test result** — full suite green. New regression tests walk depths 64/400/700/900 and
assert the `--json` contract at each; verified they fail on the unpatched tree
(`5 failed`, tracebacks shown).

**Final status** APPLIED.

---

### Verified-clean (probed, no defect found)

| Area | Probe | Result |
|---|---|---|
| environment hostility | `RESEARCH_KIT_TEST_TIMEOUT=not-a-number`, TMPDIR a file, TMPDIR read-only, `RESEARCH_KIT_RESULT_FILE` in a missing dir, run from `/`, deployed-kit layout, HOME unset/empty | all handled with a named diagnostic and the right exit code |
| locale / timezone / umask | `LC_ALL=C`, `TZ=Pacific/Kiritimati`, `TZ=America/Anchorage`, umask 077 and 000 | 1137 passed, 0 failed in every combination |
| flakiness | 3 consecutive full runs, plus `concurrency` ×3 under 8 CPU burners on a 2-core box | 0 failures, no timing sensitivity |
| symlinked project root | full copy of the repo behind a symlink | 1137 passed, 0 failed |
| hostile ZIP container | 30 mutations: truncation, bad EOCD/CD/local signatures, lying sizes and offsets, 6000 entries, 4 MB payloads, and hand-built traversal / absolute / drive-letter / backslash / NUL / newline / 5000-char / empty names | every hostile name yields a coded `ZIP-PATH` problem; no unexplained throw; the validator's catch-all turns any read failure into `BLOCKED`, never `PASS` |
| MCP stdio server | 12 malformed/unknown-method/oversized messages | every stdout line valid JSON, coded errors, no crash |
| Firecrawl status parser | 20 hostile CLI outputs (empty, ANSI-only, binary noise, reversed/huge/float/hex/Infinity credits, unicode digits, malformed versions) | no throw, shape always finite-or-null |
| commit gate | research/-only commit, HOME unset, kit missing, truncated config with and without a last-good snapshot, `failOpen:false` with a BOM, staged paths containing spaces and newlines | every documented fail-open / fail-closed path taken, named on stderr |
| every `bin/*.mjs --help` | all 26 entrypoints | exit 0, no crash |
| deprecated Node APIs | `new Buffer`, `url.parse`, `querystring`, `process.binding`, `util._extend`, CommonJS in `lib/` | none present |

---

## Successfully applied fixes

1. **`bin/conformance_common.py`** — object-key sort uses
   `key.encode("utf-16-be", "surrogatepass")`. Byte-identical ordering for every key
   without a lone surrogate; a surrogate key now reaches `json_string`'s documented
   refusal instead of raising `UnicodeEncodeError`.
2. **`bin/ledger_conformance.py`** — `main` catches
   `(OSError, ConformanceError, RecursionError)` instead of `(OSError, VectorPacketError)`.
3. **`bin/property_vector_conformance.py`** — same change, same reasoning.
4. **`lib/release/canonical.mjs`** — `canonicalJson` refuses an unpaired surrogate in a key
   or a value, with the message the Python twin already used. A well-formed surrogate pair
   is skipped whole, so astral keys and values canonicalise exactly as before.
5. **`test/conformance-hostile.test.mjs`** — 7 new tests: surrogate in a key, surrogate in
   a value, an astral character still canonical, and the `--json` contract at depths
   64/400/700/900.
6. **`research-kit/README.md`** — claimed test count 1137 → 1144 (the runner enforces this
   itself and exits 1 on a stale claim).

No new dependencies. No refactors. The largest change is 37 lines in one function.

---

## Rejected fixes

None. Both confirmed defects were fixed on the first attempt and the suite stayed green.

---

## Remaining prioritised risks

1. **Node 24 / 26 and Windows are unverified here.** Only Node 22 on Linux was available.
   CI runs a three-OS matrix and two extra Node lines. The `surrogatepass` and
   `RecursionError` changes are platform-independent, but the depth window in F-02 moves
   with the interpreter, and the `.cmd` route, CRLF handling and the executable-bit check
   are Windows-only and could not be exercised. **Highest residual risk, purely because it
   is unmeasured.**
2. **Two Node canonicalisers, one rule.** `lib/core.mjs` has its own `canonicalJson` (used
   by the fetch ledger and audit fingerprints) which still canonicalises an unpaired
   surrogate and still filters `undefined`-valued keys — both behaviours
   `lib/release/canonical.mjs` refuses. They are already different functions today. Not
   reachable from corpus data (everything on disk is UTF-8), so this is latent rather than
   live, but the rule now lives in one of two places. Recommended: make `core.mjs` delegate
   to `release/canonical.mjs`, or add a structural test pinning the two to the same
   behaviour.
3. **The Python runners' recursion window is version-dependent.** F-02 is fixed at the
   runner, which is the right layer, but a future Python that raises something other than
   `RecursionError` from `canonical_json` (a `MemoryError` on a very large packet, say)
   would escape the same handler. Recommended: catch `Exception` in the runners' `main` and
   map the type to a code, mirroring what `artifact-validator.mjs` already does.
4. **`parseStatus` does not sanity-check ordering.** `Credits: 1,000,000 / 500,000` is read
   as used=1000000, limit=500000. Harmless today — the value is reported, not gated on — but
   a drifted CLI format would produce a plausible-looking wrong number. Low severity, low
   likelihood.
5. **No Python version above 3.11 was available.** `REQUIRED_PYTHON` is 3.11 and the
   runners claim agreement 3.10–3.13; only 3.11.2 was exercised here.

---

## Hardening recommendations

1. **Extend `conformance-hostile.test.mjs` with a differential fuzz.** The two defects both
   lived in canonicalisation, and both were found by comparing the two languages rather
   than by reading either. A seeded generator producing a few hundred random JSON values
   per run — awkward keys (astral, empty, `\u007f`, `\u2028`, BMP and above), every float
   boundary, nested objects and arrays — and asserting Node and Python produce identical
   bytes would have caught F-01 before it shipped. Measured here: 7,200 random cases across
   12 seeds, zero divergence after the fix, 43 divergences without it.
2. **Add a structural guard for the exception hierarchy.** A test asserting that every
   Python runner's `main` catches `ConformanceError` (or `ValueError`) would have caught
   F-01 mechanically. There is already a precedent: `canonical-float-policy.test.mjs`
   guards against a fourth local canonicaliser appearing.
3. **Pin the recursion contract, not the depth.** The new tests assert the `--json`
   contract across a range of depths rather than a boundary, which is the right shape. If
   a specific depth is ever pinned, it will go stale on the next interpreter bump.
4. **Assert the CI workflow's cross-language step cannot pass silently on empty stdout.**
   It currently `JSON.parse`s both files; an empty file throws, which is loud, but the
   message names neither the runner nor the packet. Capturing stderr into the failure would
   make a future regression of this shape self-diagnosing.

---

## Summary

The repository is unusually well hardened: environment hostility, flakiness, symlinks,
hostile ZIP containers, malformed MCP traffic, the commit gate's fail-open/fail-closed
posture and the CLI parsers all behaved exactly as documented under adversarial input, and
the suite itself enforces its own README test count and leaves the tree clean.

Two genuine High-severity defects were found, both in the same place — the Python
conformance runners' handling of a hostile vector packet — and both of the same shape the
repository had already fixed once for `RecursionError` and written a test to pin:

* an unpaired surrogate in a JSON object key crashed the key **sort** before the function
  that exists to refuse it could run;
* a document nested deeply enough to parse but not to canonicalise blew the stack inside
  `canonical_json`, in a window the existing 200,000-deep test could not see.

In both cases the Python runner printed a traceback and no JSON while its Node twin
answered cleanly, breaking the `--json` contract exactly where a host compares the two
languages — and, for the surrogate, making the two disagree about the digest of one
document.

Both are fixed with small, targeted changes (one sort option, two `except` tuples, one
refusal rule, seven regression tests), all verified to fail on the unpatched tree and to
leave the full suite green on the patched one. **The repository is not broken: 1144 tests
pass, and every other CI gate passes.**
