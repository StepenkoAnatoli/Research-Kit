---
url: https://github.com/open-source-legal/opencontracts/pull/2193
retrieved: 2026-09-28
command: firecrawl scrape https://github.com/open-source-legal/opencontracts/pull/2193 --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Verify deep-research quotations against cited source at finalize (#2189) by JSv4 · Pull Request #2193 · Open-Source-Legal/OpenContracts
---
[Skip to content](https://github.com/open-source-legal/opencontracts/pull/2193#start-of-content)

You signed in with another tab or window. [Reload](https://github.com/open-source-legal/opencontracts/pull/2193) to refresh your session.You signed out in another tab or window. [Reload](https://github.com/open-source-legal/opencontracts/pull/2193) to refresh your session.You switched accounts on another tab or window. [Reload](https://github.com/open-source-legal/opencontracts/pull/2193) to refresh your session.Dismiss alert

{{ message }}

[Open-Source-Legal](https://github.com/Open-Source-Legal)/ **[OpenContracts](https://github.com/Open-Source-Legal/OpenContracts)** Public

- [Sponsor](https://github.com/sponsors/JSv4)
- [Notifications](https://github.com/login?return_to=%2FOpen-Source-Legal%2FOpenContracts) You must be signed in to change notification settings
- [Fork\\
190](https://github.com/login?return_to=%2FOpen-Source-Legal%2FOpenContracts)
- [Star\\
1.5k](https://github.com/login?return_to=%2FOpen-Source-Legal%2FOpenContracts)


## Conversation

[![@JSv4](https://avatars.githubusercontent.com/u/5049984?s=80&v=4)](https://github.com/JSv4)

### ![@JSv4](https://avatars.githubusercontent.com/u/5049984?s=48&v=4)**[JSv4](https://github.com/JSv4)**     commented   [on Jul 24Jul 24, 2026](https://github.com/open-source-legal/opencontracts/pull/2193\#issue-4968556925)


Copy link


Copy Markdown

Collaborator

## Problem

Fixes [#2189](https://github.com/Open-Source-Legal/OpenContracts/issues/2189). Steered to quote the passages it cites ("every footnote must anchor the exact passage — quote that passage"), the deep-research agent produced **fabricated quotations**: quotation-marked strings that occur nowhere in the corpus, attached to real (well-placed) annotation anchors. Because the same run otherwise followed the citation rules well, the report _looked_ rigorously cited — which makes the fabricated quotes more dangerous. The finalize path did no verification of quoted text, unlike the enrichment extractors, which already reject hallucinated spans (`verify_and_place`).

## Fix

At `finalize`, verify every quoted passage against the source it is attributed to — the same primitive the enrichment path already uses, adapted to the research report.

**`ResearchReportService.finalize` → new `_verify_quoted_spans`** (`opencontractserver/research/services/research_reports.py`):

- For each `<cite ids="…">claim</cite>` span, extract the double-quoted passages (straight `"…"` and curly `“…”`) from the claim and check each against the `raw_text` of that span's cited annotation(s).
- Match = whitespace-/case-normalized substring, with a `difflib.SequenceMatcher` longest-contiguous-block fuzzy fallback (`RESEARCH_QUOTE_MATCH_THRESHOLD`, `0.92`) that tolerates trivial punctuation/whitespace/single-character drift but rejects an invented tail or reworded clause.
- A quote that does not verify is **demoted to plain paraphrase** — its quotation marks are stripped, the prose and the footnote are preserved (an honest downgrade, mirroring the sibling `_strip_fabricated_links` post-processor). `report.warnings` gets a flag (mirroring the `#2180` weak-citation lint) so the report UI surfaces it.
- Short quoted strings (`< RESEARCH_QUOTE_MIN_WORDS`, i.e. defined terms like `"Confidential Information"`, scare-quotes, single words) are left untouched — they are rarely fabricated passages and are the main source of false positives.
- Runs on both the normal finalize body and the salvage body (both flow through `finalize`).

**Preventative half** — the deep-research system prompt's "Citation discipline" section (`build_deep_research_system_prompt`, `opencontractserver/research/constants.py`) gains a rule: quotation marks are for verbatim copies only; paraphrase otherwise; use `search_exact_text_as_sources` to pull the pinpoint passage when you need exact words — never reconstruct a quote from memory.

Every citeable annotation id is a real DB row with `raw_text` (retrieval only records positive ids into `retrieved_annotation_ids`; synthetic exact-search ids are never appended and are filtered at finalize), so the anchor text is always available to check against.

## Why strip-and-warn rather than reject-and-retry

`finalize` is the terminal action, so a re-search retry isn't possible at that point without re-running the whole job. Stripping the quotation marks removes the false verbatim claim while preserving the (real) citation and the prose — the same honest-downgrade discipline `_strip_fabricated_links` uses for the agent's invented hyperlinks. The prompt rule is the preventative complement.

## Tests

- `test_research_report_service.py`: fabricated quote is stripped + warned; grounded quote (with whitespace/case drift) is preserved verbatim; short quoted terms are skipped; uncited quotes are untouched; a multi-annotation span matches against any one cited source.
- `test_research_memory.py`: the citation-discipline prompt documents the verbatim-quote rule.

All six of the issue's fabricated example quotes are caught by the matcher (validated against their real vs. invented text).

## Verification note

`py_compile` is clean on all changed files, `black`/`flake8` pass, and every new test scenario passes when executed against the real function bodies (only the `Annotation``values_list` ORM call stubbed). The Docker test image could not be built in this sandbox (pip cannot reach PyPI through the environment's egress proxy) — CI will run the full suite.

## Related

`#2180` (header anchors), `#2181` (IBR), `#2182` (forced anchors), `#2183` (duplication) — this is the highest-severity of the deep-research citation issues.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

* * *

_Generated by [Claude Code](https://claude.ai/code/session_01YAUayjx9ikxBih6q9y4iWz)_

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/open-source-legal/opencontracts/pull/2193).

All reactions

[![@claude](https://avatars.githubusercontent.com/u/81847?s=40&v=4)](https://github.com/claude)

`
          Verify deep-research quotations against cited source at finalize (#2189)
` …

Verified

# Verified

This commit was signed with the committer’s **verified signature**.


[![](https://avatars.githubusercontent.com/u/81847?s=64&v=4)](https://github.com/claude)[claude](https://github.com/claude)
Claude


SSH Key Fingerprint: 32dP45eSMmVSt/G/CGvcxl/P+MO3Nwj9xeTh/GSA2wc

Verified
on Jul 24, 2026, 08:48 AM

[Learn about vigilant mode](https://docs.github.com/github/authenticating-to-github/displaying-verification-statuses-for-all-of-your-commits)

Loading

Loading status checks…

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/open-source-legal/opencontracts/pull/2193).

`
          e2ed09e
`

```
Steered to quote the passages it cites, the deep-research agent was
fabricating quotation-marked strings that occur nowhere in the corpus yet
were attached to real annotation anchors — a report that *looks*
rigorously cited but isn't. The finalize path did no verification of
quoted text, unlike the enrichment extractors that already reject
hallucinated spans.

finalize() now runs every quoted passage inside a `<cite>` span through
`_verify_quoted_spans` (opencontractserver/research/services/
research_reports.py): each quote is checked against the raw_text of that
span's cited annotation(s) — whitespace-/case-normalized substring, with a
difflib longest-contiguous-block fuzzy fallback
(RESEARCH_QUOTE_MATCH_THRESHOLD, 0.92) for trivial drift. A quote that
does not match is demoted to plain paraphrase (its quotation marks are
stripped; prose and footnote preserved) and report.warnings gets a flag.
Short quoted strings (< RESEARCH_QUOTE_MIN_WORDS words: defined terms,
scare-quotes) are left untouched. Runs on both the normal and salvage
finalize bodies. Mirrors the sibling _strip_fabricated_links /
weak-citation-lint post-processors.

Every citeable annotation id is a real DB row with raw_text (retrieval
only records positive ids), so the anchor text is always available to
check against.

The deep-research system prompt's "Citation discipline" section
(build_deep_research_system_prompt) gains a rule that quotation marks are
for verbatim copies only. Adds constants, tests, and a changelog fragment.

Closes #2189
```

[![@claude](https://avatars.githubusercontent.com/in/1236702?s=80&v=4)](https://github.com/apps/claude)

### **[claude](https://github.com/apps/claude) Bot**     commented   [on Jul 24Jul 24, 2026](https://github.com/open-source-legal/opencontracts/pull/2193\#issuecomment-5070043172)


Copy link


Copy Markdown

|     |
| --- |
| ## Review: Verify deep-research quotations against cited source at finalize ( [\#2189](https://github.com/Open-Source-Legal/OpenContracts/issues/2189))<br>### Overview<br>Adds a `_verify_quoted_spans` post-processing pass to `ResearchReportService.finalize` that checks every double-quoted passage inside a `<cite ids="...">claim</cite>` span against the `raw_text` of the cited annotation(s), demoting unverified quotes to plain paraphrase (stripping the quote marks, keeping the prose + footnote) and surfacing a `report.warnings` entry. Pairs the runtime guardrail with a prompt-side fix in `build_deep_research_system_prompt` telling the agent to only use quotation marks for verbatim copies. Good root-cause framing: this mirrors the existing `_strip_fabricated_links` honest-downgrade pattern rather than failing the whole job, which makes sense given `finalize` is terminal.<br>### Code quality / style<br>- Nice DRY win: `_CITE_SPAN_RE` is factored out and now shared between `_verify_quoted_spans` and `_render_citations`, replacing what was previously an inline-duplicated pattern in `_render_citations` — exactly the kind of consolidation CLAUDE.md asks for.<br>- `_normalize_for_quote_match` is byte-for-byte identical to `opencontractserver/utils/annotation_anchoring.py::_norm`; the docstring correctly calls this out. Consider importing/reusing `_norm` directly instead of re-implementing it, to guarantee the two stay in lockstep if one is ever tweaked.<br>- The fuzzy-match docstring says it "mirrors the annotation-anchor fuzzy match in `annotation_anchoring.py`" — worth a small correction: `annotation_anchoring.py` uses `SequenceMatcher(...).ratio()` (overall similarity), while this code uses `find_longest_match(...).size / len(quote)` (longest contiguous block). Same library, different aggregation — the wording implies closer equivalence than exists. Minor, but could mislead a future reader trying to keep the two thresholds in sync.<br>- Constants (`RESEARCH_QUOTE_MIN_WORDS`, `RESEARCH_QUOTE_MATCH_THRESHOLD`) are properly centralized in `constants.py` per the "no magic numbers" convention, with good rationale comments.<br>- Bail-out for bodies with no double quotes, and the single batched `Annotation.objects.filter(pk__in=all_ids).values_list(...)` (no N+1), are both good performance-conscious touches.<br>### Potential issue — quotes on annotations with empty/`None` raw\_text bypass verification silently<br>In `_verify_span`, when `candidates` ends up empty (e.g. every cited id for that span has empty/`None``raw_text` — plausible for structural or non-text annotation types), the code takes the `"no hydratable anchor text -> leave as-is"` branch and returns the span **unverified**, quote marks intact. That's a reasonable fallback in isolation, but it means the exact failure mode this PR targets — a fabricated quotation-marked string attached to a real, well-placed annotation anchor — can still slip through untouched if that particular anchor happens to have no `raw_text`. Given the PR's own framing ("this makes the fabricated quotes more dangerous... because the report otherwise looked rigorously cited"), it might be worth at least escalating this case into the warning list (e.g. "N quotes could not be verified — cited annotation has no text") rather than treating it identically to "grounded." Not necessarily a blocker, but worth a conscious decision rather than a silent pass-through.<br>### Minor: curly/straight quote mismatch is a coverage gap<br>`_QUOTED_PASSAGE_RE` only matches `"..."` or `"..."` — a passage opened with a straight quote and closed with a curly one (or vice versa, which happens with LLM output that sometimes "smart-quotes" only one side) won't match either alternative and will be left completely unverified. Probably rare in practice, but if you've seen this in real deep-research output it'd be worth a quick normalization pass (e.g. treat `"`/`"`/`"` interchangeably when locating the span) before applying the strict regex.<br>### Test coverage<br>The five new tests in `test_research_report_service.py` cover the important cases well (fabricated tail stripped + warned, grounded quote with whitespace/case drift preserved, short quoted terms skipped, uncited quotes untouched, multi-annotation span matches any one source). Two gaps worth considering:<br>- No test for the empty/`None``raw_text` bypass case discussed above.<br>- No test exercising the curly-quote (`"..."`) branch of `_QUOTED_PASSAGE_RE`.<br>Neither is a big lift given the existing test scaffolding (`_make_annotation`/`_make_report`).<br>### Security / correctness<br>- No new IDOR surface: `_verify_quoted_spans` only hydrates `raw_text` for ids already intersected with `retrieved_annotation_ids` (i.e., ids the run's own retrieval tools actually surfaced), so it can't be used to read arbitrary annotation text via a crafted `<cite>` tag in the LLM output.<br>- Direct `Annotation.objects.filter(...)` ORM use inside `research_reports.py` is consistent with the existing pattern in the same file (`_render_citations` does the same) — this is a service module, so it's the intended place for that, not a service-layer-bypass violation.<br>- Regex quantifiers are all bounded (`{1,400}`, non-greedy `.*?` already used elsewhere in the file) — no obvious ReDoS risk.<br>### Summary<br>Solid, well-scoped fix that follows the existing honest-downgrade precedent (`_strip_fabricated_links`) and is well tested for the core scenarios. The main thing worth a second look before merge is the silent-bypass behavior when a cited annotation has no `raw_text` — since that's precisely the "looks well-cited but isn't" failure mode the PR is trying to close. |

All reactions

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/open-source-legal/opencontracts/pull/2193).

[![@claude](https://avatars.githubusercontent.com/u/81847?s=40&v=4)](https://github.com/claude)

`
          Harden research quote verification (review feedback, #2189)
` …

Verified

# Verified

This commit was signed with the committer’s **verified signature**.


[![](https://avatars.githubusercontent.com/u/81847?s=64&v=4)](https://github.com/claude)[claude](https://github.com/claude)
Claude


SSH Key Fingerprint: 32dP45eSMmVSt/G/CGvcxl/P+MO3Nwj9xeTh/GSA2wc

Verified
on Jul 24, 2026, 08:59 AM

[Learn about vigilant mode](https://docs.github.com/github/authenticating-to-github/displaying-verification-statuses-for-all-of-your-commits)

Loading

Loading status checks…

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/open-source-legal/opencontracts/pull/2193).

`
          40a35e8
`

```
Address reviewer feedback on the finalize-time quote verifier:

- Demote quotes whose cited anchor yields no usable raw_text. Previously a
  <cite> span whose annotations all had empty/None raw_text (textless
  anchor, since-deleted row, or an id that wasn't retrieved) took a silent
  pass-through branch, leaving quote marks intact — exactly the
  "cited a real anchor but invented the quote" hole this fix targets. Now
  such a span's long quotes are treated as ungrounded and stripped.
- Match curly (“...”) and mismatched-pair quotes. The regex is unified to
  ["“]([^"“”\n]{1,N})["”] so a passage the LLM smart-quotes on only one
  side is still extracted and verified (adjacent quotes still match
  separately; the curly apostrophe U+2019 is not matched).
- Add RESEARCH_QUOTE_MAX_CHARS (2000) constant for the passage-length cap
  (was an inline 400) so a realistic block quote is still verified and the
  bound is documented; the char class is linear, so this is a
  match-bounding guard, not a ReDoS guard.
- Correct the fuzzy-match comment: it is difflib-based like the
  annotation-anchor match but uses longest-contiguous-block coverage, not
  .ratio().

New tests cover the curly/mismatched-quote and textless-anchor paths.
```

[![@JSv4](https://avatars.githubusercontent.com/u/5049984?s=80&u=54321fd2b9ba2ea7a438e69db0a69bce13f61d47&v=4)](https://github.com/JSv4)[![Claude](https://avatars.githubusercontent.com/in/1236702?s=40&u=291fb636c221c87cf9fde2311c643bf8dae98a56&v=4)](https://github.com/apps/claude)

### **[JSv4](https://github.com/JSv4)**     commented   [on Jul 24Jul 24, 2026](https://github.com/open-source-legal/opencontracts/pull/2193\#issuecomment-5070102185)


Copy link


Copy Markdown

CollaboratorAuthor

|     |
| --- |
| Thanks — addressed the substantive points in `40a35e8`:<br>- **Silent bypass on textless anchors** (the main one): `_verify_span` no longer takes a "no candidates → return unchanged" branch. A quote whose cited annotation(s) yield no usable `raw_text` (empty/`None` text, a since-deleted row, or an id that wasn't retrieved) is now treated as ungrounded and demoted like a mismatch — since a passage attributed to a textless anchor can't be a verbatim citation of it. That closes the "cited a real anchor but invented the quote" hole you flagged. New test `test_verify_quoted_spans_demotes_quote_when_anchor_has_no_text`.<br>- **Curly/straight mismatch:**`_QUOTED_PASSAGE_RE` is unified to `["“]([^"“”\n]{1,N})["”]`, so a passage smart-quoted on only one side is still extracted and verified (adjacent quotes still match separately; the curly apostrophe `’` U+2019 is intentionally not matched). New test `test_verify_quoted_spans_handles_curly_and_mismatched_quotes`.<br>- **Fuzzy-match wording:** corrected the `RESEARCH_QUOTE_MATCH_THRESHOLD` comment — it's `difflib`-based like the annotation-anchor match but uses longest-contiguous-block coverage, not `.ratio()`.<br>- **Passage-length cap:** the inline `400` is now `RESEARCH_QUOTE_MAX_CHARS` (2000) so realistic block quotes are still verified; the char class is linear, so it's a match-bounding guard, not ReDoS.<br>On the `_normalize_for_quote_match` ↔ `annotation_anchoring._norm` duplication: kept it local by intent — decoupling means an anchor-specific tweak to `_norm` won't silently shift quote-verification semantics — with the docstring pointer noting they're currently identical. Happy to promote it to a shared util instead if you'd prefer the single source of truth.<br>* * *<br>_Generated by [Claude Code](https://claude.ai/code)_ |

All reactions

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/open-source-legal/opencontracts/pull/2193).

[![@claude](https://avatars.githubusercontent.com/in/1236702?s=80&v=4)](https://github.com/apps/claude)

### **[claude](https://github.com/apps/claude) Bot**     commented   [on Jul 24Jul 24, 2026](https://github.com/open-source-legal/opencontracts/pull/2193\#issuecomment-5070130940)


Copy link


Copy Markdown

|     |
| --- |
| ## Review<br>Reviewed the diff (`opencontractserver/research/services/research_reports.py`, `constants.py`, and the two test files). Overall this is a well-scoped, well-tested fix — nice use of the existing `_strip_fabricated_links` "honest downgrade" pattern, constants pulled into `constants.py` per the no-magic-numbers rule, shared `_CITE_SPAN_RE` refactor with `_render_citations` is a clean dedup, and no N+1s (`Annotation.objects.filter(pk__in=all_ids)` batches the lookup). Order of operations in `finalize` is correct: `cited_ids` is intersected with `retrieved_annotation_ids` _before_`_verify_quoted_spans` runs, so a quote can't be "verified" against an annotation the agent never legitimately retrieved.<br>### Correctness — looks solid<br>- `_QUOTED_PASSAGE_RE` (`["“]([^"“”\n]{1,2000})["”]`) correctly handles straight/curly and mismatched-pair quotes, per the added tests.<br>- `_verify_span`/`_strip_ungrounded_quotes` preserve the `<cite>` tag structure so `_render_citations` still parses correctly downstream.<br>- Textless/deleted/non-retrieved cited annotations correctly fall through to "demote" rather than silently passing (`test_verify_quoted_spans_demotes_quote_when_anchor_has_no_text`), closing the exact hole the PR targets.<br>- `_normalize_for_quote_match` intentionally mirrors `annotation_anchoring._norm` — confirmed identical (`" ".join((s or "").casefold().split())`).<br>- No ReDoS: the extraction regex is a bounded negated-character-class match, no nested quantifiers.<br>### Minor observations (not blocking)<br>1. **Multi-line quotes are silently unverified.**`_QUOTED_PASSAGE_RE`'s inner class excludes `\n`, so a fabricated quote spanning a paragraph break in `markdown_body` (e.g. the agent wraps a long quoted passage across two lines) won't be matched at all and passes through with its quotation marks intact — no demotion, no warning. This is presumably a deliberate scope-reduction (the PR doc doesn't call it out explicitly though), but worth a one-line comment or an explicit test asserting the behavior, since it's a real gap in the "every quoted passage is verified" claim in the docstring/changelog.<br>   <br>2. **Ellipsis-joined quotes will likely false-positive as "fabricated."** The fuzzy fallback uses `find_longest_match().size / len(q)` — a single longest _contiguous_ block. A legitimately grounded quote like `"we take the risk of cost overruns ... due to raw material costs"` (a real, elided quote spanning two non-adjacent passages) would score well under the 0.92 threshold on either half and get demoted even though it's not fabricated. Since the system prompt doesn't tell the agent to avoid ellipsis in quotes, this could produce a stream of false-positive warnings/demotions for otherwise honest citations. Might be worth either (a) special-casing `...`/`…` as a split point and verifying each segment independently, or (b) adding a line to the "Citation discipline" prompt section discouraging elided quotes, so agent behavior and verifier behavior stay aligned.<br>   <br>3. **`executive_summary` is out of scope.**`_verify_quoted_spans` only runs on `markdown_body`; `executive_summary` only goes through `_strip_fabricated_links`. Per the prompt, `<cite>` tags are only supposed to appear in the body, so this is consistent with pre-existing behavior (the summary was never run through `_render_citations` either) — just flagging that if the model ever puts a cited quote in the summary, it bypasses verification entirely (no worse than before this PR, just noting the boundary).<br>   <br>4. **Perf note, not a concern at current scale:**`SequenceMatcher(None, q, cand, ...)` runs once per quote per cited candidate, and `cand` is the full normalized `raw_text` of a cited annotation. If an annotation anchors a very large span (e.g., a full page), this is a real (if bounded, `finalize`-time-only) cost per quote. Given `finalize` is a one-shot terminal action, this is very unlikely to matter in practice — just noting it in case very large annotations become common.<br>   <br>### Test coverage<br>Good breadth: fabricated-quote-stripped, grounded-quote-preserved (with whitespace/case drift), short-quote-skip, uncited-quote-untouched, multi-annotation-any-match, curly/mismatched quotes, and the no-raw-text demotion case. The prompt-documents-quote-discipline test is a reasonable minimal check for the preventative half. I'd consider adding one test for the multi-line-quote gap (item 1) so the current behavior is at least pinned rather than implicit.<br>No security concerns — this is a defense-in-depth text-integrity check on agent-authored content, doesn't touch permissions/auth, and the `Annotation.objects.filter(pk__in=...)` query is properly scoped to already-permission-filtered `retrieved_annotation_ids`. |

All reactions

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/open-source-legal/opencontracts/pull/2193).

Hide detailsView details

[![@JSv4](https://avatars.githubusercontent.com/u/5049984?s=40&u=54321fd2b9ba2ea7a438e69db0a69bce13f61d47&v=4)](https://github.com/JSv4)

[JSv4](https://github.com/JSv4)

merged commit [`6b99c62`](https://github.com/Open-Source-Legal/OpenContracts/commit/6b99c62f751ab0ac038632ffd5b9d087d666b254)
into

main[on Jul 24Jul 24, 2026](https://github.com/Open-Source-Legal/OpenContracts/pull/2193#event-28437242510)

7 checks passed


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/open-source-legal/opencontracts/pull/2193).

[![@JSv4](https://avatars.githubusercontent.com/u/5049984?s=40&u=54321fd2b9ba2ea7a438e69db0a69bce13f61d47&v=4)](https://github.com/JSv4)

[JSv4](https://github.com/JSv4)


deleted the

claude/issue-2189-fix-6by9xn

branch

[2 months agoJuly 24, 2026 13:06](https://github.com/open-source-legal/opencontracts/pull/2193#event-28437244726)

[![@codecov](https://avatars.githubusercontent.com/in/254?s=80&v=4)](https://github.com/apps/codecov)

### **[codecov](https://github.com/apps/codecov) Bot**     commented   [on Jul 24Jul 24, 2026](https://github.com/open-source-legal/opencontracts/pull/2193\#issuecomment-5070473626)


Copy link


Copy Markdown

| ## [Codecov](https://app.codecov.io/gh/Open-Source-Legal/OpenContracts/pull/2193?dropdown=coverage&src=pr&el=h1&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=Open-Source-Legal) Report

❌ Patch coverage is `91.93548%` with `5 lines` in your changes missing coverage. Please review.

| [Files with missing lines](https://app.codecov.io/gh/Open-Source-Legal/OpenContracts/pull/2193?dropdown=coverage&src=pr&el=tree&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=Open-Source-Legal) | Patch % | Lines |
| --- | --- | --- |
| [...ntractserver/research/services/research\_reports.py](https://app.codecov.io/gh/Open-Source-Legal/OpenContracts/pull/2193?src=pr&el=tree&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=Open-Source-Legal#diff-b3BlbmNvbnRyYWN0c2VydmVyL3Jlc2VhcmNoL3NlcnZpY2VzL3Jlc2VhcmNoX3JlcG9ydHMucHk=) | 91.52% | [5 Missing ⚠️](https://app.codecov.io/gh/Open-Source-Legal/OpenContracts/pull/2193?src=pr&el=tree&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=Open-Source-Legal) |

📢 Thoughts on this report? [Let us know!](https://github.com/codecov/feedback/issues/255) |

All reactions

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/open-source-legal/opencontracts/pull/2193).

This was referenced on Jul 24Jul 24, 2026

[Deep research report double-renders and cite spans self-quote (regression from citation fixes)\\
#2200](https://github.com/Open-Source-Legal/OpenContracts/issues/2200)

Closed

[Deep research citations: verify claim support at finalize and add cite handles to retrieval results\\
#2201](https://github.com/Open-Source-Legal/OpenContracts/issues/2201)

Closed

[Fix deep-research double render and verify claim support (closes #2200, #2201)\\
#2203](https://github.com/Open-Source-Legal/OpenContracts/pull/2203)

Merged

[JSv4](https://github.com/JSv4)

added a commit
that referenced
this pull request

[on Jul 25Jul 25, 2026](https://github.com/open-source-legal/opencontracts/pull/2193#ref-commit-d9f1596)

[![@JSv4](https://avatars.githubusercontent.com/u/5049984?s=40&u=54321fd2b9ba2ea7a438e69db0a69bce13f61d47&v=4)](https://github.com/JSv4)[![@claude](https://avatars.githubusercontent.com/u/81847?s=40&u=577eaff0520b33aadc0f9fb6d11f5cdb2dd9486e&v=4)](https://github.com/claude)

`
          Fix deep-research double render and verify claim support (closes #2200,
`…

Verified

# Verified

This commit was created on GitHub.com and signed with GitHub’s **verified signature**.


GPG key ID: B5690EEEBB952194

Verified
on Jul 25, 2026, 08:57 AM

[Learn about vigilant mode](https://docs.github.com/github/authenticating-to-github/displaying-verification-statuses-for-all-of-your-commits)

Loading

Loading status checks…

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/open-source-legal/opencontracts/pull/2193).

`
          d9f1596
`

`````
#2201) (#2203)

* Fix deep-research double render and verify claim support (#2200, #2201)

Two post-#2192/#2193 regressions in the deep-research report pipeline, fixed
in one composition/verification pass rather than two parallel ones.

#2200 — the report rendered twice. finalize() post-processed only
markdown_body, while the agent passed the whole report as executive_summary
too: the summary was emitted with its <cite> spans still raw, followed by the
agent's own stub "## Sources" line, then the same report again in footnote
form. finalize() now composes ONE document (summary + body) and runs the
citation post-processors over it exactly once, so a cite tag anywhere is
rendered instead of leaking. Two guards close the doubling:
_sanitize_agent_markdown strips agent-authored "## Executive Summary" /
"## Sources" scaffolding (the system owns both) plus fabricated links, and
_summary_duplicates_body drops a summary that merely restates the body.

Self-quoting cite spans — the successor of #2183's sentence doubling, where a
span's inner text is a verbatim copy of the sentence it decorates — collapse to
the new self-closing marker form, so the claim renders once with a trailing
footnote. <cite ids="1,2"/> is now a first-class cite form in _CITE_SPAN_RE and
_render_citations, is what the system prompt asks the agent to prefer, and is
what _compose_salvage_body emits.

#2201 — nothing checked that a cited passage SUPPORTS its sentence.
_verify_quoted_spans becomes _verify_cite_spans: one walk over the cite spans
enforcing three guards that share a single annotation query and a single
_contiguous_coverage notion of "is this text a copy of that text" — echo
collapse (#2200), quote verification (#2189, behaviour unchanged), and the new
claim-support check. A cited sentence must share at least
RESEARCH_CLAIM_SUPPORT_MIN_COVERAGE (0.25) of its content words with its
anchors' text or the citation is stripped (prose retained as uncited analysis)
and report.warnings records it. The check is a deterministic lexical floor —
no LLM call or embedding round-trip at finalize — and kills the two anchoring
failures from #2201: a one-word mention span cited for a full sentence, and
prompt-derived background decorated with a loosely-related entity anchor.
Claims under RESEARCH_CLAIM_SUPPORT_MIN_WORDS (12) words are accepted
unchecked; _claim_is_supported is the single seam for an entailment upgrade.
It does not catch a well-anchored sentence carrying an invented tail — the
prompt's "don't extend a cited sentence" rule is the guard there.

#2201 (cost) — the prompt told the agent to pull pinpoint anchors with
search_exact_text_as_sources and cite them, which is impossible: that tool
returns synthetic NEGATIVE annotation ids that record_finding rejects and
finalize drops, so the agent burned a 3M-token run hunting for an id it could
never obtain. The find_citable_passages closure replaces it, backed by
AnnotationService.search_corpus_annotation_text: real corpus annotations
containing a phrase, tightest (most pinpoint) anchor first, each with a
ready-to-paste cite handle, registered in the run's citation accumulator.
Visibility is delegated wholesale to get_corpus_annotations, so it adds no
permission logic of its own. search_exact_text_as_sources is dropped from
DEEP_RESEARCH_READ_ONLY_TOOLS.

Also folds the three hand-rolled singular/plural warning branches into
_pluralize.

Test note: test_prompt_documents_citation_discipline asserted the prompt names
search_exact_text_as_sources. That assertion pinned the broken advice, so it
now asserts find_citable_passages (and its absence). The _verify_quoted_spans
call sites are mechanically renamed to _verify_cite_spans with no change of
expectation.

Closes #2200
Closes #2201

* Fix mypy attr-defined on the new test class; align finalize_report's tool docstring

- test_corpus_annotations_query.py: TestSearchCorpusAnnotationText assigns its
  fixtures in setUpTestData, which mypy cannot infer. Declare them as class-level
  annotations, matching TestCorpusAnnotationsQuery in the same file. Fixes the 47
  attr-defined errors that failed the linter job.

- research_tasks.py: finalize_report's docstring is what pydantic-ai surfaces to
  the model as the tool description, so it is live guidance independent of the
  system prompt — and it still advertised only the wrapping
  <cite ids="a,b">claim</cite> form, contradicting the self-closing marker the
  rest of this PR steers the agent toward. It also said nothing about the
  summary/body split or the system-owned headings. Restate both there.

* Harden claim support across split cite markers; warn on empty finalize

Review follow-ups on #2200/#2201, both edge-case hardening rather than bug fixes:

- _verify_cite_spans resolves a span's claim from the text immediately before
  it, so consecutive markers on one sentence (`… <cite ids="1"/> <cite ids="2"/>`,
  instead of the combined `<cite ids="1,2"/>` the prompt asks for) left the
  later span nothing but the whitespace between the tags — short enough to pass
  the support check unexamined. The claim now carries forward, so a split
  citation cannot slip an unsupported anchor through.

- finalize can be handed vacuous content (a body that was only scaffolding or a
  fabricated link) which _sanitize_agent_markdown reduces to "". The salvage
  path only covers "the agent never called finalize", so that stored a blank
  COMPLETED report with no indication anything was wrong. Record a warning
  instead.

Not acted on, from the same review: the double warning when one span trips both
the quote and support guards (the stored content is correct either way, and
suppressing one would hide a rewrite that did happen), and a pg_trgm index for
search_corpus_annotation_text's raw_text__icontains (not a regression — it
mirrors what search_exact_text_as_sources did — and it needs a migration, so it
belongs with evidence that this is a hot path).

* Cover _citable_passage_rows; document the limit floor and the trigram index

Third review round on #2200/#2201.

- _citable_passage_rows had no direct test, unlike its sibling
  _compose_salvage_body in the same module. The permission/ordering semantics
  are covered on AnnotationService.search_corpus_annotation_text, so the new
  CitablePassageRowsTestCase pins the LLM-facing contract instead: a real
  positive annotation id, the paste-ready <cite ids="N"/> handle that
  _CITE_SPAN_RE consumes, similarity_search-shaped keys so the agent handles
  both retrieval tools identically, and the preview/hit caps that keep a common
  phrase from dumping a corpus back into the context window.

- search_corpus_annotation_text's docstring now states that limit floors at 1
  (limit=0 yields one row, not none) so a future caller meaning "no rows"
  isn't surprised, and records that raw_text__icontains is index-backed by the
  pg_trgm GIN index from annotations migration 0074 — the earlier review round
  raised the ILIKE scan as a perf risk and I deferred it; the index already
  exists, so there was nothing to defer.

* Document why find_citable_passages returns guidance on a miss

Fourth review round on #2200/#2201 — no code change, one comment.

The list[dict] | str return read as a new pattern among the closures. It isn't:
PydanticAIToolWrapper already returns a plain string from any tool on the
operational-error path (issue #820) regardless of the tool's annotation, and
pydantic-ai does not schema-validate tool outputs the way it does inputs. The
miss branch returns actionable guidance because that is the moment the model
can use it; a bare [] says nothing about what to do next. Recorded inline so it
does not get 'fixed' into an empty list later.

* Fix mypy valid-type on the new test fixtures; note the split-marker quote asymmetry

- test_research_report_service.py used `User = get_user_model()`, a *variable*,
  which mypy rejects in the class-level fixture annotations the new
  CitablePassageRowsTestCase needs (valid-type, the red linter job on 031b384).
  Import the concrete model directly, as the sibling test_corpus_annotations_query
  already does; every existing User.objects call site is unaffected.

- _verify_cite_spans docstring records the one asymmetry in the split-marker
  carry-forward: the carried claim feeds the support check but not quote
  verification, because the later marker's preceding text is the blank gap and
  quotes were already verified at the first marker against its anchors alone.
  Verified the direction rather than assuming it — this can only OVER-strip (a
  quote grounded in the second anchor gets demoted to paraphrase), never
  under-strip: a quote in neither anchor is still demoted at the first marker,
  so nothing ungrounded reaches the reader. Unioning candidates across a run of
  adjacent markers would fix the strictness, but that needs a lookahead pre-pass
  for a shape the prompt forbids.

* Catch meaning inversion in the claim-support check; warn on stripped sections

Sixth review round on #2200/#2201. Two of the three points were real blind
spots in the new guard, reproduced against the live functions before fixing.

- Polarity guard. Bag-of-words coverage cannot see negation: "the tenant is NOT
  liable for repairs" and "the tenant is liable for repairs" differ by one
  token and scored identically against the same anchor — a claim asserting the
  opposite of its source, presented with a footnote. In legal text that is the
  highest-stakes misattribution there is. Note the reviewer's first suggestion
  (stop treating negation words as stopwords) does NOT close it: coverage only
  moves from ~1.0 to ~0.86, still far above the 0.25 floor. Parity does. When a
  claim otherwise reads as a near-verbatim restatement
  (RESEARCH_CLAIM_INVERSION_COVERAGE, 0.8) but disagrees with its anchor on
  whether a negation marker is present, the citation is stripped. The high
  coverage gate is what keeps this off honest paraphrase, which in legal text
  often negates lexically ("prohibited", "except") and so shares far fewer
  words with the anchor — covered by a dedicated test.

- Digit-bearing tokens are exempt from RESEARCH_SUPPORT_MIN_TOKEN_CHARS. The
  floor was dropping "10" and "5%" from BOTH sides of the ratio, so a swapped
  figure produced no signal at all. This restores signal; it does not on its own
  catch a fabricated figure (one differing number moves the ratio by 1/N), and
  numeric parity is deliberately not enforced — legal text writes the same
  amount as "30", "thirty (30)", "$5" and "$5,000,000", so it would strip
  correct citations more often than it caught invented ones. Recorded next to
  the existing "what this does not catch" caveat.

- _strip_scaffold_headings now returns a count and finalize warns on it.
  Reversing my earlier decline: I argued a warning would fire on the expected
  case, but the prompt now forbids the agent from authoring these headings, so
  it should be rare — which makes it informative rather than noise, and doubles
  as the signal for whether that prompt rule is landing. Dropping a whole
  section is a bigger blast radius than the executive-summary heading-line case
  and was the one guard with no observability.

* Revert stray migration reformat; pin the no-anchor-text support branch

Seventh review round on #2200/#2201 — mostly confirmatory, two real items.

- 0001_initial.py had a pure black reformat with no behavioural change, which
  I reverted early on but a later `black opencontractserver/research` run
  silently reintroduced. Root cause: .pre-commit-config.yaml excludes
  /migrations/ globally, so CI never reformats them, but a bare `black <dir>`
  ignores that exclusion. Reverted against main, and formatting from here on
  names the touched files explicitly rather than the package directory.

- _claim_is_supported's "no usable anchor text" branch (textless anchor,
  deleted row, or an id retrieval never produced -> unsupported by construction)
  was only covered indirectly through the quote-verification path. Pinned
  directly, including the short-claim short-circuit that runs ahead of it.

- Documented the degenerate empty-claim case inline: a marker with no prose
  before it at all yields an empty claim, which falls under the min-words floor
  and is left alone. That is correct rather than a hole — there is no sentence
  for the anchor to misrepresent, so there is nothing to strip.

* Close the prefix-negation gap in the polarity guard

Eighth review round on #2200/#2201.

_is_negated matched negation tokens exactly, so "non-cancelable" did not read
as negated and a claim asserting "the master agreement is non-cancelable"
against an anchor reading "is cancelable" sailed through the polarity guard —
the exact inversion class that guard was added for two rounds ago. Contracts
negate by prefix at least as often as by particle (non-cancelable,
non-transferable, non-exclusive), so this was a real hole rather than a corner.

Matched as a token prefix, deliberately hyphenated and limited to "non-":
bare "un"/"in" prefixes would fire on "under", "until" and "interest", and an
unhyphenated "non" would catch "none"/"nonetheless". Verified those five stay
non-negated, alongside tests for the inversion itself and for both-prefixed
parity.

* Cover the closed-citation-graph contract end to end (#2201)

Third reviewer to flag that find_citable_passages' accumulator registration —
the specific mechanism #2201's cost fix depends on — had no direct test. Only
_citable_passage_rows (the row shaping) was covered; the closure bound inside
_run_deep_research_async, where deps.retrieved_annotation_ids is actually
written, was not.

New TransactionTestCase drives the real loop with the agent factory stubbed, so
no LLM is involved: the stub's chat replays the three tool calls the contract
spans and the assertions follow one annotation id across every hop —
find_citable_passages returns it with a paste-ready cite handle, it lands in the
accumulator, record_finding accepts it instead of rejecting it as an id no
retrieval produced, and finalize keeps the footnote rather than dropping the
citation. A second case pins the miss branch: guidance string back, nothing
registered.

TransactionTestCase (not TestCase) because the loop dispatches DB work through
sync_to_async, matching AstartDeepResearchTestCase's reasoning in the same
package.

* Make scaffold-section stripping nesting-aware

Tenth review round on #2200/#2201. Two of the three notes were confirmations of
already-documented behaviour; this one was a new, concrete leak path.

_strip_scaffold_headings ended its skip at the next heading of ANY level, so a
subsection nested inside the scaffolding section survived it:

    ## Sources
    (All claims above are cited inline.)   <- stripped
    ### By Document
    - Lease.pdf, annotation 12             <- LEAKED

An orphaned subheading and its list escaping into the report is the same class
of scaffolding escape #2200 exists to close, so 'working as designed' was the
wrong answer here — the design was incomplete for nested input.

The skip now tracks the scaffolding heading's level: a deeper heading is inside
the section and keeps the skip running; one at the same or a shallower level
closes it, exactly as the markdown itself reads. Verified the three neighbouring
behaviours are unchanged — a sibling section after the scaffolding survives, a
deeper scaffolding heading takes only its own subtree, and the
executive-summary heading still drops the line alone while keeping its prose.

* Stop the citation-number abbreviation reading as negation

Eleventh review round on #2200/#2201.

RESEARCH_SUPPORT_NEGATION_TOKENS includes the bare token "no" (for "no
liability", "no obligation"), and _is_negated strips punctuation before
matching — so "Exhibit No. 4" and "Case No. 12-3456" read as negation markers.
Exhibit/item/case numbers are everywhere in the contracts this feature targets,
and a reference number appearing on only one side of an otherwise near-verbatim
restatement was enough to trip the inversion guard and strip a VALID citation.
Reproduced: a claim citing "Exhibit No. 4" against an anchor saying "the
attached exhibit" came back unsupported.

"no" now counts as negation only when a number does not follow it, which keeps
"no liability"/"no obligation" working without reopening the "non-cancelable"
prefix case. Verified genuine negations (particle and prefix) and a real
polarity inversion all still behave.

Also: the token-edge punctuation string was duplicated between _content_words
and _is_negated — extracted to _TOKEN_PUNCTUATION so both agree on where a
token ends, and dropped the duplicate "own" from the stopword source string.

* Key the No.-abbreviation on its period; keep headers out of citable passages

Twelfth review round on #2200/#2201.

1. The No.-abbreviation exemption I added last round only looked ahead for a
   digit, so lettered legal references ("Exhibit No. A-1", "Schedule No. B-2")
   still read as negation and could strip a valid citation. Switched the
   discriminator to the abbreviating period on the token itself: bare "no"
   negates, "no." abbreviates. That covers lettered and bracketed references,
   and it also repairs a false negative the lookahead rule had introduced —
   "there is no 30-day cure period" is a genuine negation that the digit test
   was swallowing. Verified all ten cases.

2. find_citable_passages could hand back a bare section header as a "citable
   passage", which is the #2180 failure this tool exists to make unnecessary.
   Excluded via the new exclude_label_texts argument, passed
   RESEARCH_HEADER_ANCHOR_LABELS from the call site.

   NOT via structural=False, which the review suggested: annotations/constants
   already record why that backfires — the parsing pipeline marks its entire
   layout layer structural=True (body paragraphs, tables, sentence chunks), so
   that filter would drop nearly every citable passage while KEEPING the
   bookmark-derived OC_SECTION headers, which are structural=False. The label
   is the precise signal, as it is for the finalize-time lint.

3. find_citable_passages' docstring is the tool description the model reads, and
   document_id was undocumented — a missed chance to steer the agent toward
   scoping a search to a document it has already identified. Documented, along
   with the header exclusion.

* Suspend heading detection inside fenced code blocks

Thirteenth review round on #2200/#2201.

_strip_scaffold_headings scanned every line for an ATX heading without tracking
code fences, so a "# Sources" COMMENT inside a quoted snippet read as a
scaffolding heading. The consequence was worse than a spurious skip —
reproduced:

    ## Findings
    The filing includes this extract:
    <fence>
    # Sources            <- read as a heading, starts skipping
    revenue = 1_200_000  <- dropped
    <fence>              <- dropped, fence left unterminated
    Further analysis follows here.   <- DROPPED

i.e. silent content loss plus broken markdown. Heading detection is now
suspended between fence delimiters (backtick and tilde forms both). A real
heading after the fence closes still strips normally, and the fenced comment
survives as content.

Same family as the nesting gap fixed two rounds ago: this function reads
markdown structure, and it needs to understand that structure rather than
pattern-match line prefixes.

Not acted on from the same review: the limit=0 floor (raised three times now,
documented, and the reviewer agrees the double clamp is defence-in-depth rather
than a bug) and the pg_trgm ceiling for sub-3-character search terms — the
index is ineffective below its trigram size, but find_citable_passages is
agent-driven with specific phrases, and the reviewer called it acceptable.

* Fix the citation-graph test patching the wrong "agents" object

First full pytest run on the PR: 10428 passed, 2 failed — both of them the
citation-graph test I added in round 9. No regressions anywhere else, so the
production changes are clean; the bug was in my test.

Root cause, from the CI traceback:

    [PydanticAI sync chat] Starting chat with message: 'Execute the research...'
    HTTP Request: POST https://api.openai.com/v1/chat/completions "401"

The stub never ran. `_run_deep_research_async` does
`from opencontractserver.llms import agents`, and `llms/__init__.py:44`
re-exports `llms.api.agents` — the `AgentAPI()` singleton from `api.py:758` —
which SHADOWS the `llms.agents` package of the same name. Patching
"opencontractserver.llms.agents.for_corpus" therefore patched the package
function nobody calls, left the real factory in place, built a real agent, and
sent the run at a live LLM. With no key configured that surfaced as a 401, the
script never executed, and the assertions failed on a missing dict key rather
than on anything meaningful.

Patch `llms_api.agents` (the instance) with patch.object instead.

Added a guard so this class of mistake cannot pass silently again: `_drive`
now asserts the stub actually produced an agent. Without it, patching the wrong
object degrades into a real network call that fails somewhere unrelated — or,
on a machine with credentials, passes for entirely the wrong reason.

This is exactly the failure the "no local backend suite run" caveat was there
to cover: the pure-logic harness cannot see a mis-targeted patch, because the
patch target only matters inside the Django/pydantic-ai wiring the harness
deliberately skips.

* Document the multi-anchor polarity limitation in _claim_is_supported

Fourteenth review round on #2200/#2201. All three notes were non-blocking; one
is a real heuristic gap worth recording, two verified as harmless.

Recorded: the polarity guard treats the cited anchors as a union, matching the
coverage check. Reproduced the consequence —

    single anchor  (the one the claim inverts)  -> rejected  (correct)
    two anchors, one of them unrelated-negated  -> passes    (masked)

because any() sees a negated anchor and parity is satisfied whichever way the
claim reads. Making polarity per-candidate while coverage stays a union would
be the inconsistency rather than the fix; the honest fix is the entailment call
this function is explicitly the seam for. Added to the known-limitations list
alongside the invented tail and the fabricated figure.

Verified and NOT changed:

- _MD_HEADING_RE strips a trailing "#" without requiring a preceding space, so
  "## What is C#" normalises to "what is c" — a deviation from CommonMark. It
  cannot manifest: no scaffold name ends in "#" (checked all seven), the
  comparison is only ever against that set, and the heading line itself is
  preserved verbatim in the output (confirmed). Tightening the regex would
  touch the closing-sequence handling that does matter, for no gain.

- The bare token "non" alongside the "non-" prefix rule is not dead weight:
  PDF text extraction can break a hyphenated "non-cancelable" across a line and
  yield a standalone "non", so the token entry still earns its place.

* Make the header-label exclusion NULL-safe

Fifteenth review round on #2200/#2201 raised the exclusion loop only as a
perf note (N excludes vs one Q-OR), but checking it surfaced a latent
correctness bug I introduced in round 12.

Annotation.annotation_label is null=True. A negated lookup across a nullable FK
drops the NULL rows as well, because SQL is three-valued: NOT (NULL = 'x') is
NULL, not TRUE. So excluding the header labels could silently take every
UNLABELLED annotation with it — quietly shrinking what find_citable_passages
can offer, with no error and no warning.

Now builds one combined Q and re-admits unlabelled rows explicitly:

    qs.filter(~excluded | Q(annotation_label__isnull=True))

which is correct regardless of how Django chooses to compile the negation, and
collapses the chain of excludes into a single condition at the same time —
so the reviewer's perf note is addressed by the same change.

Regression test asserts an annotation with annotation_label=None survives an
exclusion naming three header labels.

Not changed, from the same review: the 400-char probe in
_summary_duplicates_body (documented tradeoff; the observed failure mode is the
agent passing the identical string twice, which the probe catches from its first
sentence) and the "no." sentence-final heuristic in _is_negated (already
documented; failing open there just falls back to coverage-based support
checking rather than passing a claim straight through).

* Keep a legal reference from splitting the claim at the sentence boundary

Sixteenth review round on #2200/#2201 asked for a test pinning
_SENTENCE_BOUNDARY_RE's whitespace requirement. Writing it surfaced a second,
unasked-for case in the same regex.

The whitespace requirement turns out to be load-bearing in the right direction:
it is what stops "the cap is 1.5 million" splitting at the decimal. But nothing
stopped a legal reference splitting:

    "It governs Exhibit No. 4 for the term"  ->  claim seen as "4 for the term"

The claim handed to the support check was truncated at the abbreviation, short
enough to fall under RESEARCH_CLAIM_SUPPORT_MIN_WORDS and skip the check
altogether — the guard silently declining to examine a sentence rather than
examining it. Fails open, but in exactly the reference vocabulary this domain
uses, and _is_negated already encodes the same "No. is not a sentence" insight
one function away.

Added a (?<!\b[Nn][Oo]) lookbehind. Spelled out per-case because this regex,
unlike the negation check, runs on RAW text rather than the casefolded stream —
the case-sensitive first attempt silently did nothing, which the harness caught.
The word boundary keeps it to a standalone "no", so "casino." still ends a
sentence.

Test pins both constraints and the cases that must NOT change: decimal intact,
reference intact (upper and lower case), ordinary sentence ends still split,
and a word merely ending in "no" still splits.

Not changed from the same review: limit=0 flooring to 1 (fourth mention;
documented, no caller reaches it), the polarity guard only firing at >=0.8
coverage (deliberate — the constants explain the gate is what keeps it off
honest paraphrase), and the split-marker asymmetry (reviewer agrees it can only
over-strip). The exclude_label_texts chaining nit is already resolved: it became
a single combined Q in 0813035 last round, which is also where the nullable-FK
NULL-safety bug turned up.

* Pin the abbreviation limitation in _preceding_claim; document limit semantics

Seventeenth review round on #2200/#2201. The review's main concern — that
_SENTENCE_BOUNDARY_RE has no abbreviation guard while _is_negated does — was
already fixed for "No." in 76b179a last round, and it explicitly suggested the
discriminator that fix used. But it raises a broader case that fix did NOT
cover, and that is worth recording rather than quietly extending.

Measured before deciding:

    "Exhibit No. 4 in good repair"        -> intact          (fixed in 76b179a)
    "Karman Holdings Inc. reported ..."   -> "reported ..."  (still truncates)
    "12 U.S.C. 1701 for the term"         -> "1701 for ..."  (still truncates)

Not extending the carve-out to Inc./Corp./U.S.C., because the two errors are
not symmetric:

  - "No." is unambiguous — a reference identifier always follows, so it is
    never a sentence end. Carving it out cannot merge real sentences.
  - "Inc." genuinely ends sentences in filing prose ("...acquired by Karman
    Holdings Inc. The transaction closed..."). Suppressing that boundary MERGES
    two sentences into one claim.

Truncation shortens the claim and fails open — the support check is skipped or
scores higher. Merging pads the claim with unrelated vocabulary and erodes the
coverage margin toward a false strip. Measured that erosion at 1.00 -> 0.40 for
one unrelated preceding sentence; note it stayed above the 0.25 floor, so this
is a margin argument, not a demonstrated false strip. Prefer the failing-open
error until this uses real sentence segmentation.

Both the truncation and the boundary a merge would destroy are now pinned by
test, so the tradeoff is visible to whoever revisits it.

Also documents `limit` semantics in find_citable_passages' docstring — that is
the description pydantic-ai hands the model, and the review is right that an
LLM could pass limit=0 expecting no rows when the floor is 1.

Accepted without change: the echo-collapse short-circuit when a wrapping span's
inner text is a literal substring of the sentence it decorates. It collapses a
fragment-scoping span to a bare marker, losing the scoping the prompt asks for,
but the footnote still lands on the right sentence — cosmetic, not
misattribution.

* Keep the limit floor in one place

Eighteenth review round on #2200/#2201. One actionable nit and it is a real DRY
issue: _citable_passage_rows and search_corpus_annotation_text each floored
limit to 1 independently. They agree today, so nothing is broken — but they are
two numbers that must stay in step with nothing keeping them there, which is
exactly the silent-divergence shape the repo's DRY rule exists to prevent.

Split by ownership instead of duplicating:

  - the CEILING (RESEARCH_CITABLE_PASSAGE_MAX_HITS) is research-specific and
    stays at the research call site;
  - the FLOOR of 1 belongs to search_corpus_annotation_text's contract and is
    already documented in its docstring, so it lives only there.

Verified the composition is unchanged for every input the tool can receive —
None, 0, negative, 1, under-ceiling and over-ceiling all yield the same row
counts as before (1, 1, 1, 1, 7, 10).

The other two notes need no action and are already disclosed in the code: the
polarity guard's union treatment of multiple anchors (documented as an accepted
inconsistency in _claim_is_supported) and the split-marker quote-verification
asymmetry (documented as over-strip-only in _verify_cite_spans).

* Pin both polarity-guard limitations with tests

Nineteenth review round on #2200/#2201. No behavior change — the two open
notes were about disclosure, and one of them turned out to be measurably
wrong about the mechanism, so both are now settled by a test rather than by
prose.

Union polarity (previously documented, untested): coverage is measured over
the union of the cited anchors and the guard follows suit, asking whether ANY
anchor is negated. A span citing two anchors that disagree on polarity thus
satisfies parity either way, and an inversion against one survives — while the
same claim citing that anchor alone is still rejected. The test asserts both
halves so the limitation cannot quietly widen into the control case.

Lexical negation (newly found): the review proposed that a compound claim
("liable for repairs and is not responsible for painting") would trip the
guard against an anchor supporting only the first half. Measured, it does not
— coverage lands at 0.60, well under the 0.80 gate the guard sits behind, so
it never fires. The real over-strip is an anchor that negates lexically:
"obligations excluding painting…" reads as affirmative, so a faithful
restatement using "not" scores 0.86 and looks like an inversion. Pinned.

Both failures are one-directional — an over-strip, never a fabricated
attribution — and both point at entailment rather than a longer lexicon, which
is what the docstring now says.

Also narrows exclude_label_texts from Optional[Any] to Optional[Iterable[str]];
it was only ever iterated for its strings.

* Pin the two-guards-one-span warning; note structural rows have no document

Twentieth review round on #2200/#2201. Two new observations, both verified
against the real code, neither a behavior change.

The guards in _verify_cite_spans are independent, so one badly-anchored span
can trip quote verification AND claim support, and finalize then warns about a
demoted quote and a removed citation for what reads as a single sentence. The
review asked whether that is intended or an artifact of running the guards in
sequence. It is intended, and the reason is visible in the output: BOTH edits
land in the text the reader sees — the quotation marks come off so no
fabricated verbatim survives, and the footnote comes off so the sentence is not
attributed. Warning about only one would leave the other edit unexplained.
Reproduced the case and pinned it, asserting the counters and both edits.

_citable_passage_rows already guards document_id being None, but the docstring
did not say why it can be: a structural annotation is shared across its
structural_set rather than owned by one document. Such a row still carries a
usable cite handle, so it is returned with an empty document_title rather than
dropped. Rare here — the header labels most structural rows carry are excluded
— but the row builder must not assume a document is present, and now says so.

The remaining notes need no action: the union polarity and lexical-negation
limitations were pinned last commit, the double floor-clamp was collapsed two
commits ago, and the removed quote-glyph bail-out is a deliberate consequence
of every span now needing the echo and claim-support checks.

* Report lossy echo collapses; close code fences on their own character

Twenty-first review round on #2200/#2201. Two new findings, both real, both
fixed.

Echo collapse discards the entire inner span once its longest contiguous
overlap with the preceding sentence clears the threshold, so a collapse below
full coverage takes the uncovered remainder with it — and it was the only
strip in this pipeline with no counter and no warning, which is exactly the
inconsistency the review named.

Measuring first changed the shape of the fix. The threshold is a ratio over
the INNER text, so any tail the span adds shrinks it proportionally: on a
typical sentence " as amended" already lands at 0.92 and ", which the parties
renegotiated in 2019" at 0.66, well under the 0.9 gate, so it is left intact.
The band where text is actually lost is a tail of about a word. That is too
narrow to justify raising the threshold (which would let visible near-duplicate
restatements through, the #2200 symptom) or extracting and re-emitting the
remainder (new machinery, and it would emit a mid-sentence fragment).

So the fix is to stop it being silent: count the collapse and warn, gated on
coverage < 1.0 so an exact echo — the observed shape, and 1.0 even when only
punctuation differs — reports nothing and no warning lands on a normal report.
The three-way boundary is pinned by test. Existing tuple unpacks of the
verifier now use *_ so a future signal does not churn them again.

Separately, _strip_scaffold_headings toggled its fence state on ANY fence line.
Per CommonMark a fence closes only on its own character, so a stray ~~~ inside
a backtick block flipped the state twice and left heading detection suspended
for the rest of the document — failing quiet, with scaffolding silently
unstripped. It now tracks the opening character and closes only on a match.

* Skip the echo check when the span is too long to reach the threshold

Twenty-second review round on #2200/#2201. One actionable point, though not
via the mechanism proposed.

The observation is right: a <cite> span's inner text is the one input the
verifier does not bound — _preceding_claim caps its side at 1200 chars and
quote extraction caps its own at 2000, while the inner group is whatever the
agent wrote — and SequenceMatcher costs time linear in it. Measured against a
1200-char preceding: ~8ms per 1000 chars of inner, so 830ms at 100KB and 4.1s
at 500KB, per span.

The proposed fix — bound the inner group in _CITE_SPAN_RE the way
_QUOTED_PASSAGE_RE bounds its own — would be a regression, and the asymmetry it
points at is deliberate. An unmatched quote pattern means "leave this text
alone", which is safe. An unmatched cite span is not verified AND not rendered,
so a raw <cite ...> tag leaks into the stored report: exactly the #2200
symptom this PR exists to remove. Bounding a detection regex is not the same
move as bounding an extraction regex.

The cost is removable without touching behavior at all, because the work is
provably useless past a certain length. Coverage divides the longest matching
block by len(inner), and that block cannot exceed len(preceding), so
coverage <= len(preceding)/len(inner). Once len(inner) * threshold passes
len(preceding), the threshold is arithmetically out of reach. Skipping there is
exact, not heuristic — the result is identical, it is simply not computed.

Verified the bound holds over 3000 randomized preceding/inner pairs (including
echo-shaped ones) with zero violations, confirmed the three echo boundary cases
from the previous commit are unchanged, and measured the 500KB span at 28ms
instead of 4113ms. Pinned with a test whose span starts as a perfect echo, so
only the length can rule it out.

The review's other two notes need no code change. _summary_duplicates_body
being opening-anchored is accurate and already documented as the deliberate
linear-cost choice. The comment-density note cites a CLAUDE.md rule to "default
to no comments" that is not in this repo's CLAUDE.md; what it does say is to
favor explaining why over what, which is what these comments do.

* Let black join the CiteVerification return

The linter job failed on f429735: black reformatted research_reports.py. One
line, and it is mine — adding the echoes_trimmed field, I split the return
across three lines by hand. Joined it is exactly 88 characters, which fits
black's limit, so black collapses it. flake8, isort and mypy all passed; this
was purely the formatter.

Ran the pinned black (26.1.0, per .pre-commit-config.yaml) over every Python
file this PR touches: this was the only diff, and all 11 are clean after it.

* Report the dropped summary; move the search limit default to a constant

Twenty-third review round on #2200/#2201. Two notes, both actionable.

The terse-summary edge is real and reproduces. _summary_duplicates_body
measures contiguous coverage as a ratio over the SUMMARY, so at ~150 characters
a single verbatim body sentence is already most of it: a quote-led summary
scores as a copy and is dropped. A normal-length summary carrying the same
quote is nowhere near the threshold (measured: dropped vs kept on the same
quote, 155 chars vs 346).

Rather than retune the threshold — the observed failure mode is whole-report
duplication, and loosening it lets that back through — the drop now warns.
Losing the executive summary outright is the biggest blast radius of any guard
here, much bigger than the tail cases the others trim, so it should never have
been the one strip that said nothing. The warning names the terse-summary case
so a reader who lost a legitimate summary knows why. Both sides pinned by test,
and the two edges (opening-anchored, ratio-over-summary) are now written down
in the docstring alongside the other guards' known limitations.

The limit default is a genuine magic number, so it moves to
constants/annotations.py per the repo's no-magic-numbers rule. It does NOT get
a comment tying it to RESEARCH_CITABLE_PASSAGE_MAX_HITS, though: they are
independent numbers that coincide at 10 today. The research tool clamps to its
own ceiling before it ever calls in, and that ceiling is research's to choose;
asserting the two must agree would invent a coupling that does not exist. Same
ownership split as the floor/ceiling one, and the new constant says so.

Verified with the pinned black, isort and flake8 (now installed locally after
the last commit's formatter miss) across every Python file this PR touches.

* Cover the scaffolding-heading variants; scope a marker to its own clause

Twenty-fourth review round on #2200/#2201. One finding accepted with a
different fix than proposed, one measured down to something narrower than
reported.

The scaffolding allowlist really does leak. Verified: "Works Cited",
"Reference List", "Sources Cited" and singular "Citation" all sail through
unstripped, and the miss is silent because the warning only fires on a strip —
so #2200 reappears under a different heading. The set now enumerates the names
a report generator reaches for, including the singular forms and endnotes.

But the proposed fix — loosening to token overlap or a substring test — is the
wrong direction for THIS set, and measurably so. Stripping a section deletes
every line up to the next heading, and "Sources of Supply Risk", "References to
Prior Agreements" and "Citations in the Record" are headings a legal research
report legitimately carries; a token rule strips all three. Losing a
substantive section to a fuzzy match is far worse than leaving one scaffolding
heading behind, so matching stays exact and the comment now says why, with the
instruction to extend by name rather than loosen. Both directions are pinned.

The two sets carry different risk and are now treated accordingly: dropping
only a heading line keeps the prose, so a bare "Summary" earns a place in that
set — an agent-written "## Summary" lands directly under the system's
"## Executive Summary", which is the doubled-scaffolding symptom itself.

On the split-marker claim: measurement narrows it. A marker's claim runs back
to the previous span or the sentence boundary, whichever is nearer, so in a
compound sentence each anchor answers for its own clause. That is the right
scope — the alternative judges every anchor against the union of all of them.
The guard is not skipped there: a short clause passes unchecked under the
min-words floor exactly as any short claim does anywhere, while a clause long
enough to check IS checked, and a mis-anchored one loses its citation
(verified: the insurance anchor cited for a remediation clause is dropped while
the taxes anchor beside it survives). Documented and pinned both ways; the
docstring no longer claims the two cite forms are treated identically without
saying what the claim's extent actually is.

* Require a closing fence at least as long as the opening; unpack the changelog

Twenty-fifth review round on #2200/#2201.

The fence gap is real and is not the narrow edge the review took it for. A
closing fence must run at least as long as the opening one, and closing on any
3+ run ended a ```` block at the literal ``` line inside it. The "## Sources"
sitting in that literal content then read as real scaffolding, started a
section skip, and swallowed every remaining line of the document — the same
silent-content-loss class the character fix closed last commit, just from the
other side. Verified before and after: the tail of the document disappears
without the fix and survives with it.

Both fence rules now hold together, and they fail in opposite directions —
ignoring the character leaves heading detection suspended for the rest of the
document, ignoring the length eats the rest of the document — so both are
pinned, along with the plain single-fence case.

The changelog nit is fair and the fix is the repo's own rule 8: docs should be
concise, pointer-based, and pruned as they go. Both fragments had grown into
~4KB single-sentence chains because every round appended one more clause. They
are now a headline plus short sub-points, with the calibration rationale left
where it belongs — in the code — instead of restated a third time in prose.
That also answers the "same rationale in three places" observation directly.

No change for the other two notes. Memoizing _content_words across spans
citing the same annotation is not worth it: measured, a deliberately
pathological report (200 cite spans over three shared 2000-char anchors) runs
the whole verification in 22ms. And the limit clamp keeps its split — the
ceiling at the research call site, the floor in the service contract — which
is deliberate ownership, not indirection.

As before, the comment-density note cites a CLAUDE.md rule to "default to no
comments" that is not in this repo's CLAUDE.md.

* Treat an empty wrapping cite span as the marker it is

Twenty-sixth review round on #2200/#2201. One new observation, filed as a
cosmetic asymmetry worth a comment. It is a hole through the claim-support
guard.

A wrapping span with nothing in it — <cite ids="1"></cite> — asserts nothing,
so it is a marker. But group(2) is "" rather than None, so it took neither
path cleanly: the echo check was skipped (the guard tests truthiness), quote
verification ran against an empty string, and the resulting empty claim fell
through to the carried-over last_claim. The span was therefore judged against
a PREVIOUS sentence, or against nothing at all when it came first.

Measured on one unsupported sentence and one anchor:

  <cite ids="1"/>        -> citation dropped
  <cite ids="1"></cite>  -> citation SURVIVES

Same text, same anchor, opposite outcome — the empty form walks an
unattributable sentence straight past the check #2201 exists to enforce.

Fixed by normalising an empty or whitespace-only inner to None at the top of
the loop, so both spellings run the one code path rather than the divergence
being documented. All three forms now agree in both directions: unsupported is
dropped, supported is kept, and what survives renders as a marker.

The review is right that the prompt asks for the marker form and this is
unlikely from a well-behaved agent — but the whole premise of these guards is
that the agent is stochastic and writes things the prompt forbids, which is how
both #2200 and #2201 happened.

* Warn where the two header-label consumers would diverge

Twenty-seventh review round on #2200/#2201. The actionable item was the PR
description, fixed on GitHub rather than in the tree: it carried an attribution
footer, which Baseline Commit Rule 3 forbids in PR messages. Rewrote it, also
bringing it current — it predated about twenty commits of added guards and no
longer described what the branch does.

The one code-adjacent note is latent, and the comment goes where a future
editor would trip it. RESEARCH_HEADER_ANCHOR_LABELS feeds two consumers that
normalise differently: the warning path folds separators via _normalize_label,
the retrieval filter folds only case via iexact. They agree today purely
because every entry is already in canonical spelling. Add "Section_Header" and
they split — the anchor gets warned about but stays on offer as citable, which
is the #2180 shape the exclusion exists to prevent. Recorded at the set, with
the two ways out.

* Let retrieval, not record_finding, gate what may be cited

Twenty-eighth review round on #2200/#2201, and the sharpest finding on the PR.

finalize derived cited_ids only from finding["citations"], so a <cite ids="X"/>
written straight into the body was honoured only if X had also gone through
record_finding. That gate predates this PR, but this PR is what makes agents
walk into it: find_citable_passages exists to hand back a ready-to-paste cite
handle, and the new prompt bullet says in as many words that the annotation_id
IS the cite handle. The obvious shortcut the tooling now invites was the one
path finalize refused.

The refusal was also quiet, and misleadingly labelled when it wasn't. An id
outside cited_ids hydrates no anchor text, so it cannot support anything: a
claim of twelve words or more was dropped under "not supported by the passage
it cited", which names the wrong cause, and a shorter claim slipped past the
verifier only to be dropped without a word by _render_citations.

cited_ids now seeds from the composed document as well as from findings, via a
shared _cited_ids_in helper that reuses the verifier's own regex and id parser
so "what the document cites" means one thing across the pipeline. The
intersection with retrieved_annotation_ids moves after that union and becomes
the single gate: whichever road an id took, it may be cited only if retrieval
surfaced it this run. The closed citation graph is therefore unchanged, and
since every retrieval tool is permission-filtered, that same intersection is
what keeps a citation inside what the run's creator may read.

Both directions pinned: a retrieved id cited with no finding renders and is
linked as provenance; an id retrieval never surfaced is still refused, renders
no footnote, and links nothing.

* Make limit an ordinary cap in the service, keep the floor in the tool

Twenty-ninth review round on #2200/#2201. The limit floor moves — not because
the earlier DRY call was wrong, but because it put the right rule in the wrong
layer.

search_corpus_annotation_text is a shared AnnotationService method, and a limit
argument that quietly turns 0 into 1 is a footgun for whoever adopts it next:
"at most N" is what limit means everywhere else. It now behaves that way, with
0 yielding no rows and a negative treated as 0 rather than reaching the
queryset, where Django rejects negative slicing.

The floor was never a property of annotation search; it is a UX rule of
find_citable_passages, which never wants to hand a model an empty page for a
phrase that did match, because "no citable passage" is a message it phrases
itself with guidance attached. So it lives at that call site, clamping to
[1, ceiling] in one expression.

This does not reintroduce the duplication 8bb204c removed: the floor still
exists in exactly one place, just the place that owns the rule. Verified the
composition is unchanged for every input the tool can receive — None, 0,
negative, 1, under-ceiling and over-ceiling still yield 1, 1, 1, 1, 7, 10 —
and the service's own contract is now pinned directly.

* Stop a skipped section's fences from steering the rest of the document

Thirtieth review round on #2200/#2201, and the finding is real and severe.

Fence state was tracked unconditionally, including across lines inside a
section being skipped. One unbalanced ``` in that discarded scaffolding left
fence non-None forever, so heading detection stayed suspended, the section
never found its closing heading, and every remaining line of the report was
dropped. Reproduced: a body with prose, a ## Sources section holding an
unclosed fence, then ## Appendix and ## Conclusion with real content, comes
back as the first line alone. No warning — sections_stripped still reads 1, as
though one section went.

That is the failure this function exists to prevent, arriving through the door
it was built to watch: unbalanced fences are malformed LLM markdown, and the
agent writing scaffolding it was told not to write is the premise of #2200.

The fix is to stop tracking fences while skipping. It is sound rather than a
patch: a skip can only start on a detected heading, and headings are only
detected outside a fence, so entering a skip already implies no open fence —
which is exactly what keeps heading detection alive through the skip so the
closing heading is found. A fence opened inside the skipped region belongs to
content that is being discarded and has no bearing on what survives.

Verified the four behaviours already pinned are unchanged — character parity,
run length, nesting, and a fenced heading surviving as content — plus the new
case in both spellings, unbalanced and balanced.

* Record three measured limits where a reader would look for them

Thirty-first review round on #2200/#2201. Three notes, all future-facing, none
needing a behaviour change — but two of them asked questions the docstrings
should already have answered.

_summary_duplicates_body caps the needle at 400 chars and searches the whole
body, so cost is linear in the report. Measured rather than guessed: about 6ms
per KB (30ms at 10KB, 863ms at 200KB, 5.7s at 1MB). At the sizes an agent
actually writes that is tens of milliseconds, against a task that just spent
minutes in the model, so no cap. Worth saying why not: capping the haystack
would blind the check to a summary copying the body's MIDDLE, which it catches
today, and — unlike the echo guard — there is no arithmetic short-circuit
available, because the unbounded side here is the haystack rather than the
ratio's denominator.

The pg_trgm claim in search_corpus_annotation_text was slightly overstated. A
trigram index has nothing to look up for a phrase under three characters and
falls back to a scan. Not worth a length floor — a two-character phrase is a
useless citation anchor and the caller's row cap bounds the result — but a
caller passing model-supplied text should be told.

And _is_negated's period discriminator cannot tell an abbreviation from a
one-word answer, so a bare "No." ending a sentence reads as "No." the
abbreviation. It errs toward not firing the inversion guard, which costs
strictness rather than attribution. The Inc./U.S.C. limitation next door was
written down; this one should be too.

* Make the two header-label paths agree by construction

Thirty-second review round on #2200/#2201. Last round I documented the
normalisation divergence between the two consumers of
RESEARCH_HEADER_ANCHOR_LABELS. The reviewer is right that this is the wrong
remedy: a comment telling the next editor to keep two things in step is a
burden, not a fix, and the failure it guards is silent.

The two really do differ. The warning path folds separators in Python
(_is_header_anchor treats "section_header" as a header — already pinned by
test), while the retrieval filter compares in SQL with iexact, which folds only
case. So a label stored as "Section_Header" was flagged as a header and still
offered as a citable passage: #2180 reintroduced, silently, and only for
whichever parser spells it that way.

Expanding the label set across separator spellings for the SQL side makes them
agree by construction. Eleven OR terms instead of five, no query-shape change,
and no rule for anyone to remember. Verified all four spellings that used to
diverge — Section_Header, Section-Header, OC SECTION, Page_Header — now agree
between the two paths, and pinned the three Section Header spellings against
the retrieval filter directly.

Runs of separators are not expanded; the parsers emit single ones, and that is
written down rather than left to inference.

* Resolve fence spans independently of the section skip

Thirty-third review round on #2200/#2201. The reviewer could not execute in
their sandbox and filed this as plausible rather than confirmed. It reproduces,
and it is a regression 21dc280 introduced two rounds ago.

A heading-SHAPED line inside a fenced block inside the scaffolding — the agent
writing a fenced example within its own ## Sources section — ended the skip
early, so the remaining scaffolding leaked into the report. That is the #2200
symptom reached by the opposite route to the bug 21dc280 fixed, and the two
fixes were mutually exclusive as long as fence state and skip state were
interleaved: track fences during a skip and one unbalanced ``` suspends heading
detection for good, taking the report's tail with it; suspend them and a fenced
heading ends the skip early.

Neither trade is worth making, and neither arises once the two are independent.
Fence spans are now resolved up front over the whole document, with no
reference to what is being skipped, and the loop only asks whether a line index
falls inside one.

That leaves what to do with an opener that never closes. CommonMark says it
runs to end of document, which is precisely the reading that costs the report
its tail. In LLM-authored markdown a lone ``` is far likelier a stray artifact
than an intent to code-block everything after it, so it is ignored and scanning
continues past it — a later balanced pair is still recognised. Departure from
the spec, deliberate, and written down at the function.

Verified all seven behaviours together: the new fenced-heading case, the
unbalanced-fence case, fence-character parity, closing-fence run length,
nesting-aware skip, a balanced fence inside a skip, and a fenced heading
surviving as content outside any skip. Cost of the pre-pass on a pathological
input (500 unmatched openers over 2000 lines) is 0.4ms.

Also repairs a sentence in the 2201 changelog fragment that an earlier edit
spliced into a duplicated clause.

---------

Co-authored-by: Claude <noreply@anthropic.com>
`````

This file contains hidden or bidirectional Unicode text that may be interpreted or compiled differently than what appears below. To review, open the file in an editor that reveals hidden Unicode characters.
[Learn more about bidirectional Unicode characters](https://github.co/hiddenchars)

[Show hidden characters](https://github.com/open-source-legal/opencontracts/pull/2193)

[Sign up for free](https://github.com/join?source=comment-repo) **to join this conversation on GitHub**.
Already have an account?
[Sign in to comment](https://github.com/login?return_to=https%3A%2F%2Fgithub.com%2Fopen-source-legal%2Fopencontracts%2Fpull%2F2193)

### Reviewers

No reviews

### Assignees

No one assigned

### Labels

None yet

### Projects

None yet

### Milestone

No milestone

### Development

Successfully merging this pull request may close these issues.

[Deep research fabricates quotations when steered to quote cited passages](https://github.com/Open-Source-Legal/OpenContracts/issues/2189)

### 2 participants

[![@JSv4](https://avatars.githubusercontent.com/u/5049984?s=52&v=4)](https://github.com/JSv4)[![@claude](https://avatars.githubusercontent.com/u/81847?s=52&v=4)](https://github.com/claude)

Add this suggestion to a batch that can be applied as a single commit.This suggestion is invalid because no changes were made to the code.Suggestions cannot be applied while the pull request is closed.Suggestions cannot be applied while viewing a subset of changes.Only one suggestion per line can be applied in a batch.Add this suggestion to a batch that can be applied as a single commit.Applying suggestions on deleted lines is not supported.You must change the existing code in this line in order to create a valid suggestion.Outdated suggestions cannot be applied.This suggestion has been applied or marked resolved.Suggestions cannot be applied from pending reviews.Suggestions cannot be applied on multi-line comments.Suggestions cannot be applied while the pull request is queued to merge.Suggestion cannot be applied right now. Please check back later.

You can’t perform that action at this time.
