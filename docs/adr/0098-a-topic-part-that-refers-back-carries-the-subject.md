# ADR-0098 — A topic part that refers back carries the subject

- **Date:** 2026-09-29
- **Status:** accepted
- **Area:** `lib/decompose.mjs` (`topicQueries`, `REFERS_BACK`)
- **Amends:** ADR-0085 (a compound topic is searched part by part)

## Context

ADR-0085 reads `subject: part, part` as one search per part.
- A part of one or two words carries the subject ("Stripe pricing").
- A longer part is searched alone, because the subject is often a private name no search
  engine knows ("MoonAliza open gaps").

On MoonAliza's secret-masking map (2026-09-29), the topic was "Masking secrets in streamed
output: how GitHub Actions and GitLab Runner mask a secret split across chunks, and which
encodings they also mask".
- Its second part, "which encodings they also mask", was searched alone.
- "They" points at nothing on its own. The search returned an IDL manual on character
  encoding, and phase 0 spent a scrape on it.

## Decision

- **The rule:** a part that refers back with a pronoun carries the subject too.
- **What counts as referring back (`REFERS_BACK`):** they, them, their, theirs, it, its, this,
  these, those.
- **Unchanged:** a long part without such a word is still searched alone, as ADR-0085
  decided.

## Rejected alternatives

- **Always prefix the subject.** ADR-0085's reason still holds: a private subject makes every
  query worse.
- **Resolve the pronoun to the previous part's noun phrase** ("which encodings GitHub Actions
  and GitLab Runner also mask"). That needs a parser, for a tool that holds no model, and the
  subject gives the search enough to go on.
- **Refuse a topic with a dangling pronoun.** Topics are written by people, and "they" is
  ordinary English. The kit adjusts the search, not the author.
