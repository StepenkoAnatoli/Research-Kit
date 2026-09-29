# ADR-0091 — Decompose shows the outlines of its material, without a model

- **Date:** 2026-09-29
- **Status:** accepted
- **Area:** `lib/decompose.mjs`, `bin/decompose.mjs`
- **Evidence:** `docs/decisions/2026-09-29-perspective-discovery/` (U-01..U-03)

## Context

STORM finds perspectives in three steps (E-01, E-02):

1. It lists related topics.
2. It extracts the tables of contents of their articles.
3. It has an LLM name perspectives from those tables.

Only the second step runs without a model. The paper's own ablation shows perspectives add
little: removing them costs 0.3 to 1.8 points of heading recall. Removing the grounded
conversation, which reads related material, costs 4 to 8 (E-01).

Before this change, the kit's phase-0 map listed the gathered pages by title only. So the
person classifying subtopics saw the universal checklist and a list of links, but not what
those pages cover.

## Decision

- **A new section:** `decompose` writes `## Outlines seen in the material` after the
  candidate material.
- **Its content:** for each gathered page that has a capture on disk, its title and link,
  then its `##` and `###` headings.
  - Those pages are the ones this run scraped under `--max-scrapes`, or ones the corpus
    already held.
  - At most 8 pages and 12 headings per page. The rest is counted.
- **What `outlineOf(body)` drops:**
  - code blocks;
  - links, reduced to their text;
  - zero-width marks (Mintlify docs put one before every heading);
  - repeats;
  - `OUTLINE_FURNITURE`, a list of headings sites print around content (GitHub's chrome and
    error banners, docs furniture). The list was counted from this repository's captures.
- **No fetch and no verdict:**
  - The section reads only what is on disk.
  - It never adds a row. A heading worth a subtopic becomes one by the reviewer's hand, as
    the checklist rows do.
- **When there are no outlines,** the map says why:
  - no page is captured yet (and `--max-scrapes <n>` is the way to get some); or
  - the captured pages have no headings.
- **The CLI** prints how many outlines it showed.

## Rejected alternatives

- **An LLM that names perspectives, or asks questions from them.** It would put judgment
  into a tool that contains none (Rule 1, step 0). By the paper's own numbers, it is also
  the step that adds least.
- **Fetching Wikipedia's tables of contents, as STORM does.** That would mean a new source,
  and new calls. The pages the kit already gathered are the related articles here, and the
  kit's topics (APIs, vendors, standards) mostly have no Wikipedia article.
- **Adding headings as subtopic rows.** A row the tool added would carry a status nobody
  gave it, or dozens of blank rows that `subtopic-coverage` then fails. A list to read
  keeps the classification with the reviewer.
- **Scraping pages only to outline them.** That spends credits for a hint. The section
  uses what `--max-scrapes` already paid for.
