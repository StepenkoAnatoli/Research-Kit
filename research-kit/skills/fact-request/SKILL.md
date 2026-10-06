---
name: fact-request
description: Turns a fact a builder is missing into a structured request the collector can collect, instead of fetching it, guessing it, or stopping with "insufficient info". Use on a builder machine whenever the brief does not answer something a design depends on, when handoff or preflight fails, when a skill's research step would run on a builder, or when the user asks "can you look that up" on a machine that does not collect.
---

# Fact request

A builder does not collect. `research.mjs` and `decompose.mjs` refuse there (exit 2), and
a page fetched by hand, by a browser tool, or from memory is not evidence in this kit
(ADR-0010). The honest move is to name the fact precisely and hand it to the collector.

## The request

Write it in your report, the pull request, or an issue - not into `research/`, which the
collector owns. One request per fact:

```
Fact request - <project path>
Missing:   <the fact, as a question a page can answer>
Blocks:    <the design decision that changes if it is guessed wrong>
Map row:   <the D-n / S-n subtopic it belongs to, or "new subtopic">
Owner:     <the page that owns the fact: official docs, the repo at a tag, the pricing page>
Plan entry (for research/plan.json):
  { "url": "<owner page>", "why": "U-NN <short reason>" }
Contract row (for research/DISCOVERY.md):
  | U-NN | <question> | <why it blocks> | OPEN | |
Meanwhile: <what is being built that does not depend on it, or "stopped">
```

## Rules

- **Name one fact, not a topic.** "What is the burst limit of endpoint X on the free
  tier?" - not "research the API".
- **Name the owner page**, the one that owns the fact, never a write-up about it.
- **Never write the answer you expect into the request as if it were known.** If you
  have a prior, label it as one.
- **Stop the dependent work.** Building on a guessed value and "fixing it later" is the
  failure this kit exists to prevent.
- When handoff or preflight is what failed, the request says which check and quotes its
  output; that is the fact the collector needs.
