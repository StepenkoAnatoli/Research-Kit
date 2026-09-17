# ADR-0019 — Audits bundle into one attachment, and the topic is never guessed

- **Date:** 2026-09-15
- **Status:** accepted
- **Area:** the audit family, operator-facing output, the kit's dependency surface

## Context

An audit is written to be pasted: one self-contained Markdown file per scope, so a reader
— human or AI — can hold the whole research pass without opening the repository. A real
pass produces a main audit plus one file per COVERED/GAP subtopic. This repository's own
pass produced ten. The operator's question was the obvious one: why paste ten files when
one attachment would do?

The bundle is not a new artifact. It is packaging: the files already exist, the manifest
already points at the latest version of each, and the only new thing is the container.

Two properties were non-negotiable from A11, one message earlier: a tool that guesses is
worse than a tool that asks, and a bundle that is quietly incomplete is worse than no
bundle — the operator is about to attach it to a message and cannot see inside it.

## Decision

**`zipAudit(root, { topic })` in `lib/audit.mjs` bundles one topic's latest main audit and
every subtopic audit of that version into `research/audits/<slug>-v<version>-<date>.zip`,
read from `index.json`'s `latest` pointers. `bin/audit.mjs --zip [--topic <slug>]` is its
entrypoint. The container itself — the ZIP bytes — is `lib/archive.mjs`'s.**

- **The file list comes from the manifest, never a directory listing.** A listing would
  sweep in every older version sitting beside the latest (v0.1 next to v0.9) and every
  subtopic file a past run left behind, which is precisely what an operator cannot check
  by eye once the files are inside an archive.
- **Nothing is rendered and no version is bumped.** It packages what exists. The audit's
  own version and date go in the archive's name, so it is self-describing before anyone
  opens it; the manifest is not written to, and no `.md` file is created.
- **Refusals, in the A11 shape — name the options, do not guess.** No audits at all:
  refused with the command that makes one. Several topics and none named: refused, every
  topic listed, `--topic` offered (exit 2 — a usage question, not a failure). A named
  topic that does not exist: refused with the known topics listed (exit 1).
- **A manifest naming a file that is not on disk is refused, not bundled short.** A
  partial bundle looks like a complete one until somebody reads it.
- **No subtopics is not an error.** The archive holds the one main file.
- **`--zip` refuses `--force`, `--list` and `--show`** rather than ignoring them: the
  flags promise a regenerate or a question, and packaging does neither.

`lib/archive.mjs` owns one thing: the container. `crc32`, `buildZip(entries)` (bytes,
pure), `writeZip(file, entries)`, and `entryName` — which refuses any name that is not a
plain relative path, because an archive must not be able to unpack outside the folder it
is opened into, and refuses an archive with no entries, because a valid ZIP holding
nothing is a successful-looking way to lose work.

## Consequences

- One attachment replaces ten pastes, and it is named so the operator can tell which
  topic and version he is sending without opening it.
- The kit gains its first binary output and its first hand-written file format. Both are
  proved offline: CRC-32 against its published vectors, and every entry read back out of
  the central directory by a test reader that stands in for the operator's unzip tool.
- The zip is a derived artifact like the audits themselves — not recorded in the
  manifest, not evidence, never gated. Two runs produce byte-identical archives for the
  same inputs, so re-zipping is free and idempotent.
- The format's reader is not shipped. Nothing in the kit reads an archive back; the
  operator's tool does. If the kit ever needs to inspect a bundle, that is a new ADR and
  a new seam, not a reason to have shipped an unused reader.
- The container is ~150 lines of format knowledge that will never need to change. It is
  isolated precisely so that is true.

## Rejected alternatives

- **Shelling out to `zip` (or `ditto`, or `tar`).** The obvious shortcut. Rejected: the
  kit runs on the operator's PC and in sandboxes, and a dependency on a binary that may
  not be installed is a silent failure on one of the two machines ADR-0010 exists for.
  The kit's one shell seam is the vendor adapter (`lib/firecrawl.mjs`, ADR-0005), and
  that one is injectable and pinned by test; a second one, unversioned and untestable
  offline, would be a worse copy of it.
- **Adding a dependency (`archiver`, `jszip`).** Rejected: the kit is plain Node with no
  `package.json` dependencies, which is why it installs with `node bin/install.mjs` and
  nothing else. A supply chain for ~150 lines of ZIP we can read end to end is a bad
  trade, and the format is frozen — it is not going to grow.
- **Writing the container inside `lib/audit.mjs`.** Rejected for the reason ADR-0016
  moved the finding extractor out of the collector: a second concept in a module that
  declares one. The audit module is 700 lines about *what an audit says*; the ZIP format
  is about *bytes on disk*, and it has a different reason to change (never, ideally).
  `archive.mjs` takes entries and knows nothing about audits; `audit.mjs` decides what
  goes in and what the file is called.
- **Store-only ZIP (no deflate).** Not rejected so much as not chosen: deflate is two
  lines with `node:zlib` and shrinks Markdown by ~70%. Both methods are emitted,
  whichever is smaller, so the branch earns its keep on tiny payloads.
- **Prefix matching for `--topic`, exactly as `--list` and `--show` do.** Rejected for
  this flag: those two are *questions*, where answering with everything that matches is
  informative; a bundle is a *choice*. Under pure prefix matching, naming a topic
  outright comes back "ambiguous" whenever a longer slug happens to extend it
  (`pricing-widget` vs `pricing-widget-legacy`) — which is absurd, and it failed the
  first CLI test I wrote. An exact name wins; only a non-exact input falls back to
  prefix matching, and more than one match is then a question, not a guess.
- **Deriving the topic from the corpus when `--topic` is absent** (what `--list` does
  today, via `makeSlug(corpus.map.topic)`). Rejected: the corpus's topic is the project's
  *current* topic, and a project can hold audits for a topic it no longer names. The
  manifest is the record of what exists to bundle, so it is the only source asked.
- **Bundling what exists when the manifest names a missing file**, with a warning.
  Rejected: the whole point of the bundle is that the operator cannot see inside it. A
  warning he has to read to know the attachment is short is a warning that will be
  missed, and the fix (`node bin/audit.mjs`) is one command.
- **Recording the bundle in `index.json`.** Rejected: the manifest describes audit
  versions, and a `zip` field per version would make a derived artifact look like state
  — something to be kept in step, verified, and reported by doctor. The archive's name is
  deterministic from the manifest, so nothing needs recording.
