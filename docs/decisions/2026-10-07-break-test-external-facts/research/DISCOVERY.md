# Discovery Contract - what the runtime does: Node's certificate store, and the mode a copied file gets

Started 2026-10-07. This file is the definition of "enough information to build".
`node "/home/user/.agents/research-kit/bin/preflight.mjs"` reads it and blocks the build until every unknown
below is either `CLOSED` with evidence or `KNOWN-UNKNOWN` with a verification step.

## Build intent

The external facts the 2026-10-07 break-test of this repository (pass 7) rests on, closed from the
runtime owner's own documentation instead of recalled. Two claims needed them: the cause of the
finding that a deploy from a read-only source tree leaves a deployed kit that cannot be updated
(the mode a copied file gets, and what the copy does to an existing destination), and the
recommendation that the collector name a documented remedy when a TLS-inspecting middlebox
rejects the machine's trust store (`NODE_EXTRA_CA_CERTS`, when it is read). Done means: one `E-##`
row per page whose `Raw` capture holds the quoted sentence, both claims in the report name their
row, and `preflight.mjs` says PASS. The kit's own behaviour - the deploy, the collector's failure
message - is observed by running it and is deliberately not researched here (break-test rule 6).

## Unknowns

A fact belongs here when guessing it wrong changes the design: API limits and pricing,
auth model, data schemas, rate limits, licensing/ToS, platform behavior, current library
versions, competitor pricing, data availability.

Status is exactly one of:
- `CLOSED` - proven by an `E-##` row in `research/EVIDENCE.md` (which must point at cached raw text).
- `KNOWN-UNKNOWN` - unreachable now; the `Evidence` cell names the day-one verification step.

Anything else (`OPEN`, blank, "in progress") fails the gate.

| ID | Unknown | Why it blocks the build | Status | Evidence |
|---|---|---|---|---|
| U-01 | Does Node document the permissions the file a copy produces receives - in particular, is "a read-only source produces a read-only destination" a documented guarantee? | The finding's cause is that the deployed copy carried the source's 0444 mode; whether that is a documented promise decides whether the fix may rely on propagation (it must not) and whether a runtime upgrade could change the failure | CLOSED | E-01, E-02: neither Node's `fs.md` (the `mode` argument, the three `COPYFILE_*` modifiers, the overwrite default) nor libuv's `uv_fs_copyfile` documentation names any permission behaviour for the destination. The propagation is measured on this host (0444 to 0444, 644 to 644, 600 to 600 under umask 0022) and is not promised, so the fix sets the owner-write bit explicitly rather than trusting it. |
| U-02 | What do Node and libuv document about copying onto a destination that already exists - is overwriting the default, and what does `COPYFILE_EXCL` change? | The second deploy's `EACCES` needs this half of the mechanism: the deploy opens its own read-only output for writing, which only happens because the copy overwrites rather than refuses | CLOSED | E-01, E-02: Node - "Asynchronously copies `src` to `dest`. By default, `dest` is overwritten if it already exists", with `COPYFILE_EXCL` as the modifier that makes the operation fail; libuv - "The default behavior is to overwrite the destination if it exists", with `UV_FS_COPYFILE_EXCL` failing `UV_EEXIST`. `lib/installer.mjs` passes no flags, so the overwrite path is the one a second deploy takes, and it opens the 0444 destination for writing. |
| U-03 | What does Node document about `NODE_EXTRA_CA_CERTS` - what it extends, when it is read, what a missing or malformed file does, and when it does not apply? | The remaining-risk recommendation (name the documented remedy for `unable to verify the first certificate`, and state its launch-time limit) rests on this page | CLOSED | E-03: the man page states that the well-known root CAs are extended with the certificates in the PEM file, that a missing or malformed file is a one-time `process.emitWarning()` and otherwise ignored, and that the variable is read only when the process is first launched. That is the remedy the report's remaining risk names, with its limit stated. |

## Questions for the human (maximum 3)

Intent questions only - things no document can answer. Facts never go here; they go in
the table above. If a question's answer is in public documentation, it is a research
task, not a question.

## Already decided

Locked decisions for this project. Do not revisit these without the human.

- The pages are the owner's own files at the tag of the runtime in use here (Node v22.22.3, docs
  tag v22.22.0): `nodejs/node` `doc/api/fs.md`, its `deps/uv/docs/src/fs.rst`, and its `doc/node.1`.
  No mirror, no third-party summary.
- `doc/node.1` carries U-03 because the GitHub viewer truncates the 116 KB `doc/api/cli.md` at
  "[View remainder of file in raw view]" before its environment-variable section; the man page is
  the same owner, the same tag, and renders whole.
- The search lane (DuckDuckGo) is outside this machine's egress; the plan names pages directly.
  That makes the search failure a collection limitation to disclose, not a hole in the facts.
