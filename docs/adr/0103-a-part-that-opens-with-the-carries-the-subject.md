# ADR-0103 — A topic part that opens with "the" carries the subject

- **Date:** 2026-09-30
- **Status:** accepted
- **Area:** `lib/decompose.mjs` (`topicQueries`)
- **Extends:** ADR-0085 (compound topics are searched part by part), ADR-0098 (a pronoun part
  carries the subject)

## Context

The topic was "SearXNG's search API as a keyless search transport: the JSON output format,
its query parameters and response fields, the settings that enable it, and the bot limiter".
Decompose searched "the JSON output format" and "the bot limiter" on their own, with no
subject. The map's candidates included audio mastering limiters and JSON formatters.

ADR-0098 already gives the subject to a part that refers back with a pronoun ("its query
parameters", "the settings that enable it"). A part that opens with "the" refers back the
same way: a definite article presupposes something already named, and here that is the
subject.

## Decision

A part whose first word is "the" carries the subject, as a pronoun part does. Only the first
word counts: "how Ollama streams the tool calls" still stands alone.

## Rejected alternatives

- **Give the subject to every part.** ADR-0085 rejected this: a subject is often a private
  name ("MoonAliza") that no search engine knows, and adding it to a self-contained part
  ("how Ollama streams tool calls") makes the search worse.
- **Carry the subject only when a part shares no word with it.** This is a guess about
  vocabulary. "The bot limiter" shares no word with the subject and is about it; "how
  Ollama streams tool calls" shares no word either and is not.
