# ADR-0083 — JSON nested deeper than 256 levels is refused, in both languages

- **Date:** 2026-09-28
- **Status:** accepted
- **Area:** `lib/release/json.mjs` (`MAX_JSON_DEPTH`), `bin/conformance_common.py` (`MAX_JSON_DEPTH`, `json_depth_exceeds`)

## Context

Arena break test 11 left two findings about deeply nested JSON:

- **Unreadable errors.** The Node JSON reader that every release validator and every
  Node conformance runner uses recursed. So a deep document surfaced as
  `Maximum call stack size exceeded`, which describes the reader, not the document.
- **Node and Python disagreed.** Node parsed and canonicalised thousands of levels.
  CPython's canonicaliser recurses and gave out between 300 and 400 levels (measured on
  2026-09-28). So the same packet was a result in Node and a refusal in Python. These
  runners exist to show that the two languages agree, and no shipped vector was deep
  enough to reveal this.

## Decision

Any JSON document the kit reads through these parsers may be nested at most **256**
levels. Objects and arrays both count, and the whole document counts, not just a
vector's value. Deeper input is refused as `JSON nested deeper than 256 levels`:

- **Node:** by the reader itself, as it descends.
- **Python:** by a flat scan before `json.loads`, which itself recurses.

`test/conformance-hostile.test.mjs` checks, for all three runner pairs, that a packet at
260 levels is refused by both languages with the same code, and that one at 240 levels
gets the same verdict from both.

## Rejected alternatives

- **512 levels**, the first proposal. CPython fails below it, so the two languages would
  still disagree between about 300 and 512 levels.
- **Make the Python canonicaliser iterative, with no limit.** Then the languages agree at
  any depth, but nothing still bounds how deep a document may go, and the release
  validators still recurse through their schemas.
- **Raise Python's recursion limit.** That trades a clean refusal for a possible crash of
  the interpreter's own C stack, which is not a report.

## Consequences

- A legitimate document deeper than 256 levels cannot be validated. None exists here: real
  packets and records are a handful of levels deep.
- The number lives in two files, one per language. The agreement test fails if one side
  changes without the other.
