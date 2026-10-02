# ADR-0128: A binary file is outside the secret scan

Date: 2026-10-02
Status: accepted

## Context

Running `doctor` from a Windows home folder (2026-10-02) printed fourteen critical `secret`
findings. Every one sat inside an OpenSSH executable or a libssh2 DLL under a tool's cache:
the `BEGIN RSA PRIVATE KEY` PEM marker those programs parse, kept in their string tables,
and random bytes that happen to spell `sk-` followed by sixteen word characters. The scan
read each file as UTF-8, matched the patterns, and counted the file among the "text
file(s)" of its own coverage line - a claim that was false by its own words.

The same patterns judge a package in `artifact-validator.mjs`, and `docs/` travels whole,
so one vendored image or DLL carrying that string table would FAIL a package with no
secret in it. Rule 6's scanner exists to be believed; a scanner permanently red about
OpenSSH is one nobody reads, and a project that vendors one such binary never reaches READY.

## Decision

- Content with a NUL byte in its first 8000 bytes is binary: `looksBinary` in `core.mjs`,
  git's own heuristic and window, taking the bytes or the string a UTF-8 read produced.
- `scanForSecrets` skips a binary file and counts it (`skippedBinary`), and its coverage
  line says `N binary file(s) skipped` beside the text files it did read - the scan states
  what it covered, as it always has, rather than implying completeness.
- The validator skips a binary body as it already skips one over 512 KiB.
- A text file keeps every pattern. A `.pem` is text and stays caught; the rule is about
  NUL bytes, not about which pattern fired.

A UTF-16 file reads as binary here, as it does to git without an attribute. A PowerShell
5.1 redirect writes UTF-16LE, so a key written into `.env` that way is not scanned - and
was never caught before either: decoded as UTF-8, its characters are interleaved with NULs
and match no pattern. Nothing is lost; the coverage line now says the file was skipped
instead of counting it as scanned.

## Rejected

- **Scanning binaries as before.** The false positives are certain (every OpenSSH build
  carries the marker) and loud (fourteen criticals, fourteen "rotate it" fixes), and the
  cost of the hole they would close - a plaintext key inside a committed executable,
  archive or database - is rare by comparison.
- **Exempting only the private-key pattern inside binaries.** The `sk-` pattern fired in
  the same DLLs; pattern-level exceptions grow one false positive at a time.
- **Skipping by extension** (`.exe`, `.dll`, `.png`). A list is never complete - a Linux
  executable has no extension - and it would skip a text file somebody named `.dll`. The
  NUL rule judges content.
- **Decoding UTF-16 by its byte-order mark**, so a PowerShell-written `.env` is scanned.
  A new capability under the freeze (ADR-0117), and nothing regresses without it. Trigger
  to lift: a credential found in a UTF-16 file in a project the kit gates.
