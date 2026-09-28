---
url: https://github.com/vbcdng/claim-grounding
retrieved: 2026-09-28
command: firecrawl scrape https://github.com/vbcdng/claim-grounding --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: GitHub - vbcdng/claim-grounding: Check every citation in a text against its source · GitHub
---
[Skip to content](https://github.com/vbcdng/claim-grounding#start-of-content)

You signed in with another tab or window. [Reload](https://github.com/vbcdng/claim-grounding) to refresh your session.You signed out in another tab or window. [Reload](https://github.com/vbcdng/claim-grounding) to refresh your session.You switched accounts on another tab or window. [Reload](https://github.com/vbcdng/claim-grounding) to refresh your session.Dismiss alert

{{ message }}

[vbcdng](https://github.com/vbcdng)/ **[claim-grounding](https://github.com/vbcdng/claim-grounding)** Public

- [Notifications](https://github.com/login?return_to=%2Fvbcdng%2Fclaim-grounding) You must be signed in to change notification settings
- [Fork\\
1](https://github.com/login?return_to=%2Fvbcdng%2Fclaim-grounding)
- [Star\\
3](https://github.com/login?return_to=%2Fvbcdng%2Fclaim-grounding)


master

[**1** Branch](https://github.com/vbcdng/claim-grounding/branches) [**1** Tag](https://github.com/vbcdng/claim-grounding/tags)

[Go to Branches page](https://github.com/vbcdng/claim-grounding/branches)[Go to Tags page](https://github.com/vbcdng/claim-grounding/tags)

Go to file

Code

Open more actions menu

## Latest commit

[![vbcdng](https://avatars.githubusercontent.com/u/214220625?v=4&size=40)](https://github.com/vbcdng)[vbcdng](https://github.com/vbcdng/claim-grounding/commits?author=vbcdng)

[Six fixes from the known-issues page, the PDF-reading follow-up, and …](https://github.com/vbcdng/claim-grounding/commit/20c2b58c5b387ea30649e4301a5e17f2823909a5)

Open commit details

27 days agoSep 1, 2026

[20c2b58](https://github.com/vbcdng/claim-grounding/commit/20c2b58c5b387ea30649e4301a5e17f2823909a5) · 27 days agoSep 1, 2026

## History

[26 Commits](https://github.com/vbcdng/claim-grounding/commits/master/)

Open commit details

[View commit history for this file.](https://github.com/vbcdng/claim-grounding/commits/master/) 26 Commits

## Folders and files

| Name | Name | Last commit message | Last commit date |
| --- | --- | --- | --- |
| [.claude](https://github.com/vbcdng/claim-grounding/tree/master/.claude ".claude") | [.claude](https://github.com/vbcdng/claim-grounding/tree/master/.claude ".claude") | [Documentation refresh (to 2026-08-31): new README, how-the-check-work…](https://github.com/vbcdng/claim-grounding/commit/11ee655b6ba2003925fc2e32e05992ed8b42c3e1 "Documentation refresh (to 2026-08-31): new README, how-the-check-works page, known issues, writing guides, Claude Code skill  The README is rewritten in plain language and includes the August end-to-end test results of the research-write-check-repair loop. A new page, docs/HOW_THE_CHECK_WORKS.md, walks through one invented worked example from run start to verdict. The known-issues page moves to an undated name, docs/KNOWN_ISSUES.md, with every entry re-verified against the current code; the old dated file now just points to it. The three writing guides ship at the top level (RESEARCH_WRITE_PROMPT.md, CONVERT_MY_TEXT_PROMPT.md, AGENT_LOOP_PROMPT.md), and the whole loop is packaged as a Claude Code skill at .claude/skills/checked-research/SKILL.md — open Claude Code in this folder and type /checked-research followed by a topic.  Files: README.md docs/KNOWN_ISSUES_2026-07-20.md .claude/skills/checked-research/SKILL.md AGENT_LOOP_PROMPT.md CONVERT_MY_TEXT_PROMPT.md RESEARCH_WRITE_PROMPT.md docs/HOW_THE_CHECK_WORKS.md docs/KNOWN_ISSUES.md docs/loop_rounds/round_4/grader_fable_pos.json docs/loop_rounds/round_4/review_Why-Do-Old-Pots-End-Up-on-Fence-Posts-Rot-Prevention-and-the_2026-07-11.json docs/loop_rounds/round_5/review_my_text_2026-07-11.json docs/loop_rounds/round_6/review_forager_work_hours_2026-07-11.json docs/release_assets/WALKTHROUGH_ORIGIN.md docs/release_assets/viewer_screenshot.png  Co-Authored-By: Claude Fable 5 <noreply@anthropic.com> Claude-Session: https://claude.ai/code/session_01Sf7tXHLqwygjBMi6vnGkv4") | last monthAug 30, 2026 |
| [benchmarks](https://github.com/vbcdng/claim-grounding/tree/master/benchmarks "benchmarks") | [benchmarks](https://github.com/vbcdng/claim-grounding/tree/master/benchmarks "benchmarks") | [Six fixes from the known-issues page, the PDF-reading follow-up, and …](https://github.com/vbcdng/claim-grounding/commit/20c2b58c5b387ea30649e4301a5e17f2823909a5 "Six fixes from the known-issues page, the PDF-reading follow-up, and a library update  Three finished pieces of work, all verified before this push:  1. The six tool problems the known-issues page listed as fixed are now    fixed in this repository's code too (the page shipped a day ahead of    the code): marker-typo warnings instead of silent drops, a grey    'could not be checked' state for unreadable sources including a new    gibberish detector for PDFs with damaged fonts, a plain startup    message when the first-run model download is blocked, a correct    browser address on Windows, a one-line message when the claude    program is missing, and visible failure notes in the argument-map    panel. A control benchmark run confirmed these changes alter zero    verdicts across all 129 gate claims.  2. The PDF-reading follow-up: when the tool repairs a badly extracted    PDF, readability of the repaired text now outranks its length, which    fixed the one source file that was still being read as cipher text.    All 221 project sources read cleanly under the new code.  3. The model-calling library (litellm) moves from 1.74.0 to 1.84.0.    Outgoing requests were captured on both versions and are identical    for every worked-around model, and the full test suite passes.  Also included: two rows of the first gate paper's ground truth move to watch status by the author's ruling — one exposed a real judge weakness on quantity words (tracked as future work), one flips without explanation between runs (also tracked).  Files: - verify_my_text.py, requirements.txt - modules/papertrail/: embeddings.py, llm_client.py, matcher.py,   source_decomposer.py, text_decomposer.py, viewer.py, viewer_v2.py,   wizard.py - tests/: test_claude_code_backend.py, test_embeddings_offline.py (new),   test_garble_fallback.py, test_text_decomposer_markers.py,   test_unreadable_sources.py (new), test_viewer_assessment.py,   test_wizard.py - benchmarks/paper1_ground_truth.json  🤖 Generated with [Claude Code](https://claude.com/claude-code)  https://claude.ai/code/session_01Sf7tXHLqwygjBMi6vnGkv4") | 27 days agoSep 1, 2026 |
| [config](https://github.com/vbcdng/claim-grounding/tree/master/config "config") | [config](https://github.com/vbcdng/claim-grounding/tree/master/config "config") | [Documentation and one display-prompt improvement (6 files)](https://github.com/vbcdng/claim-grounding/commit/884d741f6b936e1b28101d2d40c69e932bb9d095 "Documentation and one display-prompt improvement (6 files)  docs/KNOWN_ISSUES.md gains two Fixed entries dated 2026-08-31: the four security findings (see the previous commit) and the six tool problems from the previous version of this page, each described with what changed. FOR_REVIEWERS.md now names the current default judge (gemma-4-31b-it, free, since 2026-08-30) and clarifies that its 58-row count mixes full and partial support. INPUT_FORMAT.md reflects the new PDF reader. The proof-sentence mapping prompt (config/prompts/pt_covering_set_prompt.txt) gains a narrow rule: the writer's own transition and confidence phrasing is not treated as a component needing source proof, while claims about the subject itself still are. The change is display-only — verdicts are untouched — and the exact new wording passed the full six-text quality check with results identical to the standing baseline. The two benchmark-folder touches point readers at the right folders and clarify a banner.  Files: docs/KNOWN_ISSUES.md, FOR_REVIEWERS.md, INPUT_FORMAT.md, config/prompts/pt_covering_set_prompt.txt, benchmarks/wice_anchor/README.md, benchmarks/wice_bench.py  Co-Authored-By: Claude Fable 5 <noreply@anthropic.com> Claude-Session: https://claude.ai/code/session_01Sf7tXHLqwygjBMi6vnGkv4") | last monthAug 31, 2026 |
| [decomp\_bench](https://github.com/vbcdng/claim-grounding/tree/master/decomp_bench "decomp_bench") | [decomp\_bench](https://github.com/vbcdng/claim-grounding/tree/master/decomp_bench "decomp_bench") | [Claim-grounding — public release](https://github.com/vbcdng/claim-grounding/commit/fb3f40efea0246373dc6ff2c47f8940ba66e0d95 "Claim-grounding — public release") | 2 months agoJul 20, 2026 |
| [docs](https://github.com/vbcdng/claim-grounding/tree/master/docs "docs") | [docs](https://github.com/vbcdng/claim-grounding/tree/master/docs "docs") | [Arbiter rescue is now opt-in (--arbiter-rescue), off by default](https://github.com/vbcdng/claim-grounding/commit/f2853bacdb7cb79f3e776405307e797672cee644 "Arbiter rescue is now opt-in (--arbiter-rescue), off by default  The arbiter step that could flip a rejected claim to supported no longer runs by default. A repeat measurement showed the flip did not reproduce: the same rejected claims, re-run three times each with the current arbiter model, sometimes flipped and sometimes did not. A verdict change should not depend on which run you happened to get, so the flip now runs only when a run is started with --arbiter-rescue. The arbiter's other outputs (proof-may-exist notes, warning clearing) are unchanged. The standard regression gate runs with the arbiter off, so the evidence behind this change is the repeat measurement, not a gate result.  Files: - verify_my_text.py — the new --arbiter-rescue flag; --no-arbiter-rescue   stays accepted and is now a no-op - README.md — arbiter section and chip table updated - docs/HOW_THE_CHECK_WORKS.md — step 7 rewritten for the new default - FOR_REVIEWERS.md — step 5 note, and how to reproduce the published   WiCE re-check numbers under today's defaults - benchmarks/run_wice_heldout.sh — pins the published arbiter   configuration (deepseek + --arbiter-rescue) so a re-run matches it  🤖 Generated with [Claude Code](https://claude.com/claude-code)  https://claude.ai/code/session_01Sf7tXHLqwygjBMi6vnGkv4") | 27 days agoSep 1, 2026 |
| [examples](https://github.com/vbcdng/claim-grounding/tree/master/examples "examples") | [examples](https://github.com/vbcdng/claim-grounding/tree/master/examples "examples") | [Bentonite example: note the two intentionally-missing Springer sources](https://github.com/vbcdng/claim-grounding/commit/cf28481af324a7722d4c921a85c4a610dd638779 "Bentonite example: note the two intentionally-missing Springer sources  examples/bentonite ships 7 of 9 sources (two subscription texts may not be redistributed). New examples/bentonite/README.md says the two \"source file missing\" warnings are expected, how to fetch the two DOIs, and points at the complete chimpanzee example; FOR_REVIEWERS' bentonite paragraph now carries the same heads-up.  Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>") | 2 months agoJul 20, 2026 |
| [modules](https://github.com/vbcdng/claim-grounding/tree/master/modules "modules") | [modules](https://github.com/vbcdng/claim-grounding/tree/master/modules "modules") | [Six fixes from the known-issues page, the PDF-reading follow-up, and …](https://github.com/vbcdng/claim-grounding/commit/20c2b58c5b387ea30649e4301a5e17f2823909a5 "Six fixes from the known-issues page, the PDF-reading follow-up, and a library update  Three finished pieces of work, all verified before this push:  1. The six tool problems the known-issues page listed as fixed are now    fixed in this repository's code too (the page shipped a day ahead of    the code): marker-typo warnings instead of silent drops, a grey    'could not be checked' state for unreadable sources including a new    gibberish detector for PDFs with damaged fonts, a plain startup    message when the first-run model download is blocked, a correct    browser address on Windows, a one-line message when the claude    program is missing, and visible failure notes in the argument-map    panel. A control benchmark run confirmed these changes alter zero    verdicts across all 129 gate claims.  2. The PDF-reading follow-up: when the tool repairs a badly extracted    PDF, readability of the repaired text now outranks its length, which    fixed the one source file that was still being read as cipher text.    All 221 project sources read cleanly under the new code.  3. The model-calling library (litellm) moves from 1.74.0 to 1.84.0.    Outgoing requests were captured on both versions and are identical    for every worked-around model, and the full test suite passes.  Also included: two rows of the first gate paper's ground truth move to watch status by the author's ruling — one exposed a real judge weakness on quantity words (tracked as future work), one flips without explanation between runs (also tracked).  Files: - verify_my_text.py, requirements.txt - modules/papertrail/: embeddings.py, llm_client.py, matcher.py,   source_decomposer.py, text_decomposer.py, viewer.py, viewer_v2.py,   wizard.py - tests/: test_claude_code_backend.py, test_embeddings_offline.py (new),   test_garble_fallback.py, test_text_decomposer_markers.py,   test_unreadable_sources.py (new), test_viewer_assessment.py,   test_wizard.py - benchmarks/paper1_ground_truth.json  🤖 Generated with [Claude Code](https://claude.com/claude-code)  https://claude.ai/code/session_01Sf7tXHLqwygjBMi6vnGkv4") | 27 days agoSep 1, 2026 |
| [tests](https://github.com/vbcdng/claim-grounding/tree/master/tests "tests") | [tests](https://github.com/vbcdng/claim-grounding/tree/master/tests "tests") | [Six fixes from the known-issues page, the PDF-reading follow-up, and …](https://github.com/vbcdng/claim-grounding/commit/20c2b58c5b387ea30649e4301a5e17f2823909a5 "Six fixes from the known-issues page, the PDF-reading follow-up, and a library update  Three finished pieces of work, all verified before this push:  1. The six tool problems the known-issues page listed as fixed are now    fixed in this repository's code too (the page shipped a day ahead of    the code): marker-typo warnings instead of silent drops, a grey    'could not be checked' state for unreadable sources including a new    gibberish detector for PDFs with damaged fonts, a plain startup    message when the first-run model download is blocked, a correct    browser address on Windows, a one-line message when the claude    program is missing, and visible failure notes in the argument-map    panel. A control benchmark run confirmed these changes alter zero    verdicts across all 129 gate claims.  2. The PDF-reading follow-up: when the tool repairs a badly extracted    PDF, readability of the repaired text now outranks its length, which    fixed the one source file that was still being read as cipher text.    All 221 project sources read cleanly under the new code.  3. The model-calling library (litellm) moves from 1.74.0 to 1.84.0.    Outgoing requests were captured on both versions and are identical    for every worked-around model, and the full test suite passes.  Also included: two rows of the first gate paper's ground truth move to watch status by the author's ruling — one exposed a real judge weakness on quantity words (tracked as future work), one flips without explanation between runs (also tracked).  Files: - verify_my_text.py, requirements.txt - modules/papertrail/: embeddings.py, llm_client.py, matcher.py,   source_decomposer.py, text_decomposer.py, viewer.py, viewer_v2.py,   wizard.py - tests/: test_claude_code_backend.py, test_embeddings_offline.py (new),   test_garble_fallback.py, test_text_decomposer_markers.py,   test_unreadable_sources.py (new), test_viewer_assessment.py,   test_wizard.py - benchmarks/paper1_ground_truth.json  🤖 Generated with [Claude Code](https://claude.com/claude-code)  https://claude.ai/code/session_01Sf7tXHLqwygjBMi6vnGkv4") | 27 days agoSep 1, 2026 |
| [.gitignore](https://github.com/vbcdng/claim-grounding/blob/master/.gitignore ".gitignore") | [.gitignore](https://github.com/vbcdng/claim-grounding/blob/master/.gitignore ".gitignore") | [Six weeks of tool development (to 2026-08-31): program code, tests an…](https://github.com/vbcdng/claim-grounding/commit/5823dc6f5a17e9b1843e387ab4a6b73c2ad34908 "Six weeks of tool development (to 2026-08-31): program code, tests and configuration  The main changes since the July code release. Every run now records exact versions (fingerprints) of the prompt files it used, and a re-run refuses to silently reuse old results when a prompt changed in between. A run in which some model calls failed can no longer look healthy: failed calls are marked and warned about instead of being stored as ordinary verdicts. Deep-check comments from an earlier run can no longer attach to fresh verdicts. The default judging model is now the free Gemma model (gemma-4-31b-it) and the default arbiter model is gpt-5.6-luna; validation of the new pair continues and is tracked in ROADMAP.md. Free Google model calls can rotate between two accounts' keys, and a money-lock mode (FREE_GOOGLE_ONLY=1) restricts a run to keys that cannot be billed. Helper scripts ship for logged long runs (run_logged.sh, wait_for_run.py) and for calling the surveyed free model services (free_llm.py).  Files: .gitignore deep_check.py modules/papertrail/arbiter.py modules/papertrail/argument_map.py modules/papertrail/citation_scope.py modules/papertrail/claim_fixer.py modules/papertrail/claude_code_backend.py modules/papertrail/crux.py modules/papertrail/dedup.py modules/papertrail/evidence_independence.py modules/papertrail/llm_client.py modules/papertrail/matcher.py modules/papertrail/origin_trace.py modules/papertrail/own_claims.py modules/papertrail/paper_search.py modules/papertrail/rerun.py modules/papertrail/second_opinion.py modules/papertrail/source_decomposer.py modules/papertrail/text_decomposer.py modules/papertrail/viewer.py modules/papertrail/viewer_v2.py tests/test_argument_map.py tests/test_argument_map_variants.py tests/test_component_rescue.py tests/test_crux.py tests/test_dedup.py tests/test_independence.py tests/test_llm_usage.py tests/test_partial_support.py tests/test_preflight.py tests/test_regression_check.py tests/test_review_layer.py tests/test_text_decomposer_markers.py verify_my_text.py config/prompts/pt_arbiter_partial_map_prompt.txt config/prompts/pt_missing_parts_prompt.txt free_llm.py loop_round.py make_release_zip.sh modules/papertrail/checkpoint.py modules/papertrail/deep_check_store.py modules/papertrail/prompt_store.py run_logged.sh tests/test_arbiter_partial.py tests/test_arbiter_replay.py tests/test_call_bookkeeping.py tests/test_checkpoint.py tests/test_ci_batch_ids.py tests/test_ci_blind_readers.py tests/test_ci_review_pages.py tests/test_ci_settlement_row_page.py tests/test_ci_settlement_rows.py tests/test_ci_settlement_triage.py tests/test_citation_integrity_bench.py tests/test_commit_sweep_hook.py tests/test_deep_check_staleness.py tests/test_free_google_only.py tests/test_fulltext_chunk_merge.py tests/test_labeler_panel.py tests/test_llm_client_rate_classification.py tests/test_llm_extra_body.py tests/test_llm_google_direct.py tests/test_missing_parts_followup.py tests/test_prompt_fingerprints.py tests/test_task37_outage_honesty.py wait_for_run.py  Co-Authored-By: Claude Fable 5 <noreply@anthropic.com> Claude-Session: https://claude.ai/code/session_01Sf7tXHLqwygjBMi6vnGkv4") | last monthAug 30, 2026 |
| [AGENT\_LOOP\_PROMPT.md](https://github.com/vbcdng/claim-grounding/blob/master/AGENT_LOOP_PROMPT.md "AGENT_LOOP_PROMPT.md") | [AGENT\_LOOP\_PROMPT.md](https://github.com/vbcdng/claim-grounding/blob/master/AGENT_LOOP_PROMPT.md "AGENT_LOOP_PROMPT.md") | [Documentation refresh (to 2026-08-31): new README, how-the-check-work…](https://github.com/vbcdng/claim-grounding/commit/11ee655b6ba2003925fc2e32e05992ed8b42c3e1 "Documentation refresh (to 2026-08-31): new README, how-the-check-works page, known issues, writing guides, Claude Code skill  The README is rewritten in plain language and includes the August end-to-end test results of the research-write-check-repair loop. A new page, docs/HOW_THE_CHECK_WORKS.md, walks through one invented worked example from run start to verdict. The known-issues page moves to an undated name, docs/KNOWN_ISSUES.md, with every entry re-verified against the current code; the old dated file now just points to it. The three writing guides ship at the top level (RESEARCH_WRITE_PROMPT.md, CONVERT_MY_TEXT_PROMPT.md, AGENT_LOOP_PROMPT.md), and the whole loop is packaged as a Claude Code skill at .claude/skills/checked-research/SKILL.md — open Claude Code in this folder and type /checked-research followed by a topic.  Files: README.md docs/KNOWN_ISSUES_2026-07-20.md .claude/skills/checked-research/SKILL.md AGENT_LOOP_PROMPT.md CONVERT_MY_TEXT_PROMPT.md RESEARCH_WRITE_PROMPT.md docs/HOW_THE_CHECK_WORKS.md docs/KNOWN_ISSUES.md docs/loop_rounds/round_4/grader_fable_pos.json docs/loop_rounds/round_4/review_Why-Do-Old-Pots-End-Up-on-Fence-Posts-Rot-Prevention-and-the_2026-07-11.json docs/loop_rounds/round_5/review_my_text_2026-07-11.json docs/loop_rounds/round_6/review_forager_work_hours_2026-07-11.json docs/release_assets/WALKTHROUGH_ORIGIN.md docs/release_assets/viewer_screenshot.png  Co-Authored-By: Claude Fable 5 <noreply@anthropic.com> Claude-Session: https://claude.ai/code/session_01Sf7tXHLqwygjBMi6vnGkv4") | last monthAug 30, 2026 |
| [CONVERT\_MY\_TEXT\_PROMPT.md](https://github.com/vbcdng/claim-grounding/blob/master/CONVERT_MY_TEXT_PROMPT.md "CONVERT_MY_TEXT_PROMPT.md") | [CONVERT\_MY\_TEXT\_PROMPT.md](https://github.com/vbcdng/claim-grounding/blob/master/CONVERT_MY_TEXT_PROMPT.md "CONVERT_MY_TEXT_PROMPT.md") | [Documentation refresh (to 2026-08-31): new README, how-the-check-work…](https://github.com/vbcdng/claim-grounding/commit/11ee655b6ba2003925fc2e32e05992ed8b42c3e1 "Documentation refresh (to 2026-08-31): new README, how-the-check-works page, known issues, writing guides, Claude Code skill  The README is rewritten in plain language and includes the August end-to-end test results of the research-write-check-repair loop. A new page, docs/HOW_THE_CHECK_WORKS.md, walks through one invented worked example from run start to verdict. The known-issues page moves to an undated name, docs/KNOWN_ISSUES.md, with every entry re-verified against the current code; the old dated file now just points to it. The three writing guides ship at the top level (RESEARCH_WRITE_PROMPT.md, CONVERT_MY_TEXT_PROMPT.md, AGENT_LOOP_PROMPT.md), and the whole loop is packaged as a Claude Code skill at .claude/skills/checked-research/SKILL.md — open Claude Code in this folder and type /checked-research followed by a topic.  Files: README.md docs/KNOWN_ISSUES_2026-07-20.md .claude/skills/checked-research/SKILL.md AGENT_LOOP_PROMPT.md CONVERT_MY_TEXT_PROMPT.md RESEARCH_WRITE_PROMPT.md docs/HOW_THE_CHECK_WORKS.md docs/KNOWN_ISSUES.md docs/loop_rounds/round_4/grader_fable_pos.json docs/loop_rounds/round_4/review_Why-Do-Old-Pots-End-Up-on-Fence-Posts-Rot-Prevention-and-the_2026-07-11.json docs/loop_rounds/round_5/review_my_text_2026-07-11.json docs/loop_rounds/round_6/review_forager_work_hours_2026-07-11.json docs/release_assets/WALKTHROUGH_ORIGIN.md docs/release_assets/viewer_screenshot.png  Co-Authored-By: Claude Fable 5 <noreply@anthropic.com> Claude-Session: https://claude.ai/code/session_01Sf7tXHLqwygjBMi6vnGkv4") | last monthAug 30, 2026 |
| [FOR\_REVIEWERS.md](https://github.com/vbcdng/claim-grounding/blob/master/FOR_REVIEWERS.md "FOR_REVIEWERS.md") | [FOR\_REVIEWERS.md](https://github.com/vbcdng/claim-grounding/blob/master/FOR_REVIEWERS.md "FOR_REVIEWERS.md") | [FOR\_REVIEWERS: date the WiCE numbers — they describe the July 2026 co…](https://github.com/vbcdng/claim-grounding/commit/f5fdc5846fce6834acae753f9d1d55b15087ac00 "FOR_REVIEWERS: date the WiCE numbers — they describe the July 2026 configuration  Both WiCE evaluations ran in July 2026, on the tool as it was then. The defaults have changed since (free Gemma judge on 2026-08-30, a different arbiter model, the verdict-flipping re-check off by default on 2026-09-01). The new note in the WiCE section says this plainly, and that benchmarks/run_wice_heldout.sh pins the July configuration so a re-run reproduces the published numbers. The benchmark has not yet been re-run under today's defaults.  Files: - FOR_REVIEWERS.md  🤖 Generated with [Claude Code](https://claude.com/claude-code)  https://claude.ai/code/session_01Sf7tXHLqwygjBMi6vnGkv4") | 27 days agoSep 1, 2026 |
| [INPUT\_FORMAT.md](https://github.com/vbcdng/claim-grounding/blob/master/INPUT_FORMAT.md "INPUT_FORMAT.md") | [INPUT\_FORMAT.md](https://github.com/vbcdng/claim-grounding/blob/master/INPUT_FORMAT.md "INPUT_FORMAT.md") | [Documentation and one display-prompt improvement (6 files)](https://github.com/vbcdng/claim-grounding/commit/884d741f6b936e1b28101d2d40c69e932bb9d095 "Documentation and one display-prompt improvement (6 files)  docs/KNOWN_ISSUES.md gains two Fixed entries dated 2026-08-31: the four security findings (see the previous commit) and the six tool problems from the previous version of this page, each described with what changed. FOR_REVIEWERS.md now names the current default judge (gemma-4-31b-it, free, since 2026-08-30) and clarifies that its 58-row count mixes full and partial support. INPUT_FORMAT.md reflects the new PDF reader. The proof-sentence mapping prompt (config/prompts/pt_covering_set_prompt.txt) gains a narrow rule: the writer's own transition and confidence phrasing is not treated as a component needing source proof, while claims about the subject itself still are. The change is display-only — verdicts are untouched — and the exact new wording passed the full six-text quality check with results identical to the standing baseline. The two benchmark-folder touches point readers at the right folders and clarify a banner.  Files: docs/KNOWN_ISSUES.md, FOR_REVIEWERS.md, INPUT_FORMAT.md, config/prompts/pt_covering_set_prompt.txt, benchmarks/wice_anchor/README.md, benchmarks/wice_bench.py  Co-Authored-By: Claude Fable 5 <noreply@anthropic.com> Claude-Session: https://claude.ai/code/session_01Sf7tXHLqwygjBMi6vnGkv4") | last monthAug 31, 2026 |
| [LICENSE](https://github.com/vbcdng/claim-grounding/blob/master/LICENSE "LICENSE") | [LICENSE](https://github.com/vbcdng/claim-grounding/blob/master/LICENSE "LICENSE") | [Claim-grounding — public release](https://github.com/vbcdng/claim-grounding/commit/fb3f40efea0246373dc6ff2c47f8940ba66e0d95 "Claim-grounding — public release") | 2 months agoJul 20, 2026 |
| [LOCAL\_MODELS.md](https://github.com/vbcdng/claim-grounding/blob/master/LOCAL_MODELS.md "LOCAL_MODELS.md") | [LOCAL\_MODELS.md](https://github.com/vbcdng/claim-grounding/blob/master/LOCAL_MODELS.md "LOCAL_MODELS.md") | [LOCAL\_MODELS.md: replace 2026-05-29 scratch notes with the 4-step Oll…](https://github.com/vbcdng/claim-grounding/commit/7b63e35c188dfa844035e1c7df0c3939f4c9cd1e "LOCAL_MODELS.md: replace 2026-05-29 scratch notes with the 4-step Ollama guide (friend-B item 7)") | 2 months agoJul 20, 2026 |
| [README.md](https://github.com/vbcdng/claim-grounding/blob/master/README.md "README.md") | [README.md](https://github.com/vbcdng/claim-grounding/blob/master/README.md "README.md") | [Arbiter rescue is now opt-in (--arbiter-rescue), off by default](https://github.com/vbcdng/claim-grounding/commit/f2853bacdb7cb79f3e776405307e797672cee644 "Arbiter rescue is now opt-in (--arbiter-rescue), off by default  The arbiter step that could flip a rejected claim to supported no longer runs by default. A repeat measurement showed the flip did not reproduce: the same rejected claims, re-run three times each with the current arbiter model, sometimes flipped and sometimes did not. A verdict change should not depend on which run you happened to get, so the flip now runs only when a run is started with --arbiter-rescue. The arbiter's other outputs (proof-may-exist notes, warning clearing) are unchanged. The standard regression gate runs with the arbiter off, so the evidence behind this change is the repeat measurement, not a gate result.  Files: - verify_my_text.py — the new --arbiter-rescue flag; --no-arbiter-rescue   stays accepted and is now a no-op - README.md — arbiter section and chip table updated - docs/HOW_THE_CHECK_WORKS.md — step 7 rewritten for the new default - FOR_REVIEWERS.md — step 5 note, and how to reproduce the published   WiCE re-check numbers under today's defaults - benchmarks/run_wice_heldout.sh — pins the published arbiter   configuration (deepseek + --arbiter-rescue) so a re-run matches it  🤖 Generated with [Claude Code](https://claude.com/claude-code)  https://claude.ai/code/session_01Sf7tXHLqwygjBMi6vnGkv4") | 27 days agoSep 1, 2026 |
| [RESEARCH\_WRITE\_PROMPT.md](https://github.com/vbcdng/claim-grounding/blob/master/RESEARCH_WRITE_PROMPT.md "RESEARCH_WRITE_PROMPT.md") | [RESEARCH\_WRITE\_PROMPT.md](https://github.com/vbcdng/claim-grounding/blob/master/RESEARCH_WRITE_PROMPT.md "RESEARCH_WRITE_PROMPT.md") | [Documentation refresh (to 2026-08-31): new README, how-the-check-work…](https://github.com/vbcdng/claim-grounding/commit/11ee655b6ba2003925fc2e32e05992ed8b42c3e1 "Documentation refresh (to 2026-08-31): new README, how-the-check-works page, known issues, writing guides, Claude Code skill  The README is rewritten in plain language and includes the August end-to-end test results of the research-write-check-repair loop. A new page, docs/HOW_THE_CHECK_WORKS.md, walks through one invented worked example from run start to verdict. The known-issues page moves to an undated name, docs/KNOWN_ISSUES.md, with every entry re-verified against the current code; the old dated file now just points to it. The three writing guides ship at the top level (RESEARCH_WRITE_PROMPT.md, CONVERT_MY_TEXT_PROMPT.md, AGENT_LOOP_PROMPT.md), and the whole loop is packaged as a Claude Code skill at .claude/skills/checked-research/SKILL.md — open Claude Code in this folder and type /checked-research followed by a topic.  Files: README.md docs/KNOWN_ISSUES_2026-07-20.md .claude/skills/checked-research/SKILL.md AGENT_LOOP_PROMPT.md CONVERT_MY_TEXT_PROMPT.md RESEARCH_WRITE_PROMPT.md docs/HOW_THE_CHECK_WORKS.md docs/KNOWN_ISSUES.md docs/loop_rounds/round_4/grader_fable_pos.json docs/loop_rounds/round_4/review_Why-Do-Old-Pots-End-Up-on-Fence-Posts-Rot-Prevention-and-the_2026-07-11.json docs/loop_rounds/round_5/review_my_text_2026-07-11.json docs/loop_rounds/round_6/review_forager_work_hours_2026-07-11.json docs/release_assets/WALKTHROUGH_ORIGIN.md docs/release_assets/viewer_screenshot.png  Co-Authored-By: Claude Fable 5 <noreply@anthropic.com> Claude-Session: https://claude.ai/code/session_01Sf7tXHLqwygjBMi6vnGkv4") | last monthAug 30, 2026 |
| [ROADMAP.md](https://github.com/vbcdng/claim-grounding/blob/master/ROADMAP.md "ROADMAP.md") | [ROADMAP.md](https://github.com/vbcdng/claim-grounding/blob/master/ROADMAP.md "ROADMAP.md") | [ROADMAP refresh (2026-08-30): notice at the top that the plan is due …](https://github.com/vbcdng/claim-grounding/commit/36825de612752ac6644c2bf1624b81b7783d8614 "ROADMAP refresh (2026-08-30): notice at the top that the plan is due for a strong revision; item 5's three recording fixes done and the default models updated (free Gemma judge, luna arbiter, validation pending); repair-loop progress; new cost item (how often the arbiter runs); whole file rewritten in plain language under the project's measured style rules. Full change record in the file's own changelog table") | last monthAug 30, 2026 |
| [deep\_check.py](https://github.com/vbcdng/claim-grounding/blob/master/deep_check.py "deep_check.py") | [deep\_check.py](https://github.com/vbcdng/claim-grounding/blob/master/deep_check.py "deep_check.py") | [Six weeks of tool development (to 2026-08-31): program code, tests an…](https://github.com/vbcdng/claim-grounding/commit/5823dc6f5a17e9b1843e387ab4a6b73c2ad34908 "Six weeks of tool development (to 2026-08-31): program code, tests and configuration  The main changes since the July code release. Every run now records exact versions (fingerprints) of the prompt files it used, and a re-run refuses to silently reuse old results when a prompt changed in between. A run in which some model calls failed can no longer look healthy: failed calls are marked and warned about instead of being stored as ordinary verdicts. Deep-check comments from an earlier run can no longer attach to fresh verdicts. The default judging model is now the free Gemma model (gemma-4-31b-it) and the default arbiter model is gpt-5.6-luna; validation of the new pair continues and is tracked in ROADMAP.md. Free Google model calls can rotate between two accounts' keys, and a money-lock mode (FREE_GOOGLE_ONLY=1) restricts a run to keys that cannot be billed. Helper scripts ship for logged long runs (run_logged.sh, wait_for_run.py) and for calling the surveyed free model services (free_llm.py).  Files: .gitignore deep_check.py modules/papertrail/arbiter.py modules/papertrail/argument_map.py modules/papertrail/citation_scope.py modules/papertrail/claim_fixer.py modules/papertrail/claude_code_backend.py modules/papertrail/crux.py modules/papertrail/dedup.py modules/papertrail/evidence_independence.py modules/papertrail/llm_client.py modules/papertrail/matcher.py modules/papertrail/origin_trace.py modules/papertrail/own_claims.py modules/papertrail/paper_search.py modules/papertrail/rerun.py modules/papertrail/second_opinion.py modules/papertrail/source_decomposer.py modules/papertrail/text_decomposer.py modules/papertrail/viewer.py modules/papertrail/viewer_v2.py tests/test_argument_map.py tests/test_argument_map_variants.py tests/test_component_rescue.py tests/test_crux.py tests/test_dedup.py tests/test_independence.py tests/test_llm_usage.py tests/test_partial_support.py tests/test_preflight.py tests/test_regression_check.py tests/test_review_layer.py tests/test_text_decomposer_markers.py verify_my_text.py config/prompts/pt_arbiter_partial_map_prompt.txt config/prompts/pt_missing_parts_prompt.txt free_llm.py loop_round.py make_release_zip.sh modules/papertrail/checkpoint.py modules/papertrail/deep_check_store.py modules/papertrail/prompt_store.py run_logged.sh tests/test_arbiter_partial.py tests/test_arbiter_replay.py tests/test_call_bookkeeping.py tests/test_checkpoint.py tests/test_ci_batch_ids.py tests/test_ci_blind_readers.py tests/test_ci_review_pages.py tests/test_ci_settlement_row_page.py tests/test_ci_settlement_rows.py tests/test_ci_settlement_triage.py tests/test_citation_integrity_bench.py tests/test_commit_sweep_hook.py tests/test_deep_check_staleness.py tests/test_free_google_only.py tests/test_fulltext_chunk_merge.py tests/test_labeler_panel.py tests/test_llm_client_rate_classification.py tests/test_llm_extra_body.py tests/test_llm_google_direct.py tests/test_missing_parts_followup.py tests/test_prompt_fingerprints.py tests/test_task37_outage_honesty.py wait_for_run.py  Co-Authored-By: Claude Fable 5 <noreply@anthropic.com> Claude-Session: https://claude.ai/code/session_01Sf7tXHLqwygjBMi6vnGkv4") | last monthAug 30, 2026 |
| [download\_sources.py](https://github.com/vbcdng/claim-grounding/blob/master/download_sources.py "download_sources.py") | [download\_sources.py](https://github.com/vbcdng/claim-grounding/blob/master/download_sources.py "download_sources.py") | [Security fixes and a safer PDF reader (20 files)](https://github.com/vbcdng/claim-grounding/commit/3a909a124ac5337f2eb662e64e7954cfbd0b5055 "Security fixes and a safer PDF reader (20 files)  A security review of the whole project ran on 2026-08-31 with automated scanners plus model readers. It found four real weaknesses, all fixed here; the new Fixed entry in docs/KNOWN_ISSUES.md describes them in plain words. In short: a citation key from an imported bibliography could steer the source downloader into writing a file outside the sources folder; a DOI printed inside a downloaded file could count as permission to overwrite an existing source; one not-yet-wired report page did not check link addresses; and the setup wizard printed a pasted API key back to the screen. File names and keys are now cleaned in one shared module (modules/papertrail/safe_paths.py, with its own 18 tests) before any write, overwriting requires a key-named file, link addresses are checked, and the wizard prints the key redacted.  The same batch swaps the PDF-reading library to pypdf, guards the text-repair step against losing text, and stops a re-run from reusing verdicts made under a different reader. None of these changes affects how verdicts are decided.  Files: modules/papertrail/safe_paths.py, modules/papertrail/checkpoint.py, modules/papertrail/claude_research_importer.py, modules/papertrail/direct_downloader.py, modules/papertrail/matcher.py, modules/papertrail/paper_importer.py, modules/papertrail/rerun.py, modules/papertrail/snowball_viewer.py, modules/papertrail/source_decomposer.py, modules/papertrail/source_ingestor.py, modules/papertrail/viewer.py, modules/papertrail/wizard.py, tests/test_safe_paths.py, tests/test_audit_fixes.py, tests/test_checkpoint.py, tests/test_garble_fallback.py, tests/test_rerun.py, download_sources.py, verify_my_text.py, requirements.txt  Co-Authored-By: Claude Fable 5 <noreply@anthropic.com> Claude-Session: https://claude.ai/code/session_01Sf7tXHLqwygjBMi6vnGkv4") | last monthAug 31, 2026 |
| [find\_replacement\_sources.py](https://github.com/vbcdng/claim-grounding/blob/master/find_replacement_sources.py "find_replacement_sources.py") | [find\_replacement\_sources.py](https://github.com/vbcdng/claim-grounding/blob/master/find_replacement_sources.py "find_replacement_sources.py") | [Claim-grounding — public release](https://github.com/vbcdng/claim-grounding/commit/fb3f40efea0246373dc6ff2c47f8940ba66e0d95 "Claim-grounding — public release") | 2 months agoJul 20, 2026 |
| [free\_llm.py](https://github.com/vbcdng/claim-grounding/blob/master/free_llm.py "free_llm.py") | [free\_llm.py](https://github.com/vbcdng/claim-grounding/blob/master/free_llm.py "free_llm.py") | [Six weeks of tool development (to 2026-08-31): program code, tests an…](https://github.com/vbcdng/claim-grounding/commit/5823dc6f5a17e9b1843e387ab4a6b73c2ad34908 "Six weeks of tool development (to 2026-08-31): program code, tests and configuration  The main changes since the July code release. Every run now records exact versions (fingerprints) of the prompt files it used, and a re-run refuses to silently reuse old results when a prompt changed in between. A run in which some model calls failed can no longer look healthy: failed calls are marked and warned about instead of being stored as ordinary verdicts. Deep-check comments from an earlier run can no longer attach to fresh verdicts. The default judging model is now the free Gemma model (gemma-4-31b-it) and the default arbiter model is gpt-5.6-luna; validation of the new pair continues and is tracked in ROADMAP.md. Free Google model calls can rotate between two accounts' keys, and a money-lock mode (FREE_GOOGLE_ONLY=1) restricts a run to keys that cannot be billed. Helper scripts ship for logged long runs (run_logged.sh, wait_for_run.py) and for calling the surveyed free model services (free_llm.py).  Files: .gitignore deep_check.py modules/papertrail/arbiter.py modules/papertrail/argument_map.py modules/papertrail/citation_scope.py modules/papertrail/claim_fixer.py modules/papertrail/claude_code_backend.py modules/papertrail/crux.py modules/papertrail/dedup.py modules/papertrail/evidence_independence.py modules/papertrail/llm_client.py modules/papertrail/matcher.py modules/papertrail/origin_trace.py modules/papertrail/own_claims.py modules/papertrail/paper_search.py modules/papertrail/rerun.py modules/papertrail/second_opinion.py modules/papertrail/source_decomposer.py modules/papertrail/text_decomposer.py modules/papertrail/viewer.py modules/papertrail/viewer_v2.py tests/test_argument_map.py tests/test_argument_map_variants.py tests/test_component_rescue.py tests/test_crux.py tests/test_dedup.py tests/test_independence.py tests/test_llm_usage.py tests/test_partial_support.py tests/test_preflight.py tests/test_regression_check.py tests/test_review_layer.py tests/test_text_decomposer_markers.py verify_my_text.py config/prompts/pt_arbiter_partial_map_prompt.txt config/prompts/pt_missing_parts_prompt.txt free_llm.py loop_round.py make_release_zip.sh modules/papertrail/checkpoint.py modules/papertrail/deep_check_store.py modules/papertrail/prompt_store.py run_logged.sh tests/test_arbiter_partial.py tests/test_arbiter_replay.py tests/test_call_bookkeeping.py tests/test_checkpoint.py tests/test_ci_batch_ids.py tests/test_ci_blind_readers.py tests/test_ci_review_pages.py tests/test_ci_settlement_row_page.py tests/test_ci_settlement_rows.py tests/test_ci_settlement_triage.py tests/test_citation_integrity_bench.py tests/test_commit_sweep_hook.py tests/test_deep_check_staleness.py tests/test_free_google_only.py tests/test_fulltext_chunk_merge.py tests/test_labeler_panel.py tests/test_llm_client_rate_classification.py tests/test_llm_extra_body.py tests/test_llm_google_direct.py tests/test_missing_parts_followup.py tests/test_prompt_fingerprints.py tests/test_task37_outage_honesty.py wait_for_run.py  Co-Authored-By: Claude Fable 5 <noreply@anthropic.com> Claude-Session: https://claude.ai/code/session_01Sf7tXHLqwygjBMi6vnGkv4") | last monthAug 30, 2026 |
| [import\_claude\_research.py](https://github.com/vbcdng/claim-grounding/blob/master/import_claude_research.py "import_claude_research.py") | [import\_claude\_research.py](https://github.com/vbcdng/claim-grounding/blob/master/import_claude_research.py "import_claude_research.py") | [Arbiter no-key skip is a one-line info note, matching the README](https://github.com/vbcdng/claim-grounding/commit/dd33f3d950b5f6ff73c5491751eb641e1b2af0ba "Arbiter no-key skip is a one-line info note, matching the README  The missing-DeepSeek-key path printed a WARNING (\"--no-arbiter to silence this warning\") while README promised a one-line note; --help said \"silently skipped with a warning\". All three now agree: an INFO note saying the run works fine without the arbiter. Also ports the same batch's sibling-.bib fallback for import_claude_research and proper deep_check --help text.  Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>") | 2 months agoJul 20, 2026 |
| [import\_paper.py](https://github.com/vbcdng/claim-grounding/blob/master/import_paper.py "import_paper.py") | [import\_paper.py](https://github.com/vbcdng/claim-grounding/blob/master/import_paper.py "import_paper.py") | [Claim-grounding — public release](https://github.com/vbcdng/claim-grounding/commit/fb3f40efea0246373dc6ff2c47f8940ba66e0d95 "Claim-grounding — public release") | 2 months agoJul 20, 2026 |
| [ingest\_downloads.py](https://github.com/vbcdng/claim-grounding/blob/master/ingest_downloads.py "ingest_downloads.py") | [ingest\_downloads.py](https://github.com/vbcdng/claim-grounding/blob/master/ingest_downloads.py "ingest_downloads.py") | [Claim-grounding — public release](https://github.com/vbcdng/claim-grounding/commit/fb3f40efea0246373dc6ff2c47f8940ba66e0d95 "Claim-grounding — public release") | 2 months agoJul 20, 2026 |
| [loop\_round.py](https://github.com/vbcdng/claim-grounding/blob/master/loop_round.py "loop_round.py") | [loop\_round.py](https://github.com/vbcdng/claim-grounding/blob/master/loop_round.py "loop_round.py") | [Six weeks of tool development (to 2026-08-31): program code, tests an…](https://github.com/vbcdng/claim-grounding/commit/5823dc6f5a17e9b1843e387ab4a6b73c2ad34908 "Six weeks of tool development (to 2026-08-31): program code, tests and configuration  The main changes since the July code release. Every run now records exact versions (fingerprints) of the prompt files it used, and a re-run refuses to silently reuse old results when a prompt changed in between. A run in which some model calls failed can no longer look healthy: failed calls are marked and warned about instead of being stored as ordinary verdicts. Deep-check comments from an earlier run can no longer attach to fresh verdicts. The default judging model is now the free Gemma model (gemma-4-31b-it) and the default arbiter model is gpt-5.6-luna; validation of the new pair continues and is tracked in ROADMAP.md. Free Google model calls can rotate between two accounts' keys, and a money-lock mode (FREE_GOOGLE_ONLY=1) restricts a run to keys that cannot be billed. Helper scripts ship for logged long runs (run_logged.sh, wait_for_run.py) and for calling the surveyed free model services (free_llm.py).  Files: .gitignore deep_check.py modules/papertrail/arbiter.py modules/papertrail/argument_map.py modules/papertrail/citation_scope.py modules/papertrail/claim_fixer.py modules/papertrail/claude_code_backend.py modules/papertrail/crux.py modules/papertrail/dedup.py modules/papertrail/evidence_independence.py modules/papertrail/llm_client.py modules/papertrail/matcher.py modules/papertrail/origin_trace.py modules/papertrail/own_claims.py modules/papertrail/paper_search.py modules/papertrail/rerun.py modules/papertrail/second_opinion.py modules/papertrail/source_decomposer.py modules/papertrail/text_decomposer.py modules/papertrail/viewer.py modules/papertrail/viewer_v2.py tests/test_argument_map.py tests/test_argument_map_variants.py tests/test_component_rescue.py tests/test_crux.py tests/test_dedup.py tests/test_independence.py tests/test_llm_usage.py tests/test_partial_support.py tests/test_preflight.py tests/test_regression_check.py tests/test_review_layer.py tests/test_text_decomposer_markers.py verify_my_text.py config/prompts/pt_arbiter_partial_map_prompt.txt config/prompts/pt_missing_parts_prompt.txt free_llm.py loop_round.py make_release_zip.sh modules/papertrail/checkpoint.py modules/papertrail/deep_check_store.py modules/papertrail/prompt_store.py run_logged.sh tests/test_arbiter_partial.py tests/test_arbiter_replay.py tests/test_call_bookkeeping.py tests/test_checkpoint.py tests/test_ci_batch_ids.py tests/test_ci_blind_readers.py tests/test_ci_review_pages.py tests/test_ci_settlement_row_page.py tests/test_ci_settlement_rows.py tests/test_ci_settlement_triage.py tests/test_citation_integrity_bench.py tests/test_commit_sweep_hook.py tests/test_deep_check_staleness.py tests/test_free_google_only.py tests/test_fulltext_chunk_merge.py tests/test_labeler_panel.py tests/test_llm_client_rate_classification.py tests/test_llm_extra_body.py tests/test_llm_google_direct.py tests/test_missing_parts_followup.py tests/test_prompt_fingerprints.py tests/test_task37_outage_honesty.py wait_for_run.py  Co-Authored-By: Claude Fable 5 <noreply@anthropic.com> Claude-Session: https://claude.ai/code/session_01Sf7tXHLqwygjBMi6vnGkv4") | last monthAug 30, 2026 |
| [make\_release\_zip.sh](https://github.com/vbcdng/claim-grounding/blob/master/make_release_zip.sh "make_release_zip.sh") | [make\_release\_zip.sh](https://github.com/vbcdng/claim-grounding/blob/master/make_release_zip.sh "make_release_zip.sh") | [Six weeks of tool development (to 2026-08-31): program code, tests an…](https://github.com/vbcdng/claim-grounding/commit/5823dc6f5a17e9b1843e387ab4a6b73c2ad34908 "Six weeks of tool development (to 2026-08-31): program code, tests and configuration  The main changes since the July code release. Every run now records exact versions (fingerprints) of the prompt files it used, and a re-run refuses to silently reuse old results when a prompt changed in between. A run in which some model calls failed can no longer look healthy: failed calls are marked and warned about instead of being stored as ordinary verdicts. Deep-check comments from an earlier run can no longer attach to fresh verdicts. The default judging model is now the free Gemma model (gemma-4-31b-it) and the default arbiter model is gpt-5.6-luna; validation of the new pair continues and is tracked in ROADMAP.md. Free Google model calls can rotate between two accounts' keys, and a money-lock mode (FREE_GOOGLE_ONLY=1) restricts a run to keys that cannot be billed. Helper scripts ship for logged long runs (run_logged.sh, wait_for_run.py) and for calling the surveyed free model services (free_llm.py).  Files: .gitignore deep_check.py modules/papertrail/arbiter.py modules/papertrail/argument_map.py modules/papertrail/citation_scope.py modules/papertrail/claim_fixer.py modules/papertrail/claude_code_backend.py modules/papertrail/crux.py modules/papertrail/dedup.py modules/papertrail/evidence_independence.py modules/papertrail/llm_client.py modules/papertrail/matcher.py modules/papertrail/origin_trace.py modules/papertrail/own_claims.py modules/papertrail/paper_search.py modules/papertrail/rerun.py modules/papertrail/second_opinion.py modules/papertrail/source_decomposer.py modules/papertrail/text_decomposer.py modules/papertrail/viewer.py modules/papertrail/viewer_v2.py tests/test_argument_map.py tests/test_argument_map_variants.py tests/test_component_rescue.py tests/test_crux.py tests/test_dedup.py tests/test_independence.py tests/test_llm_usage.py tests/test_partial_support.py tests/test_preflight.py tests/test_regression_check.py tests/test_review_layer.py tests/test_text_decomposer_markers.py verify_my_text.py config/prompts/pt_arbiter_partial_map_prompt.txt config/prompts/pt_missing_parts_prompt.txt free_llm.py loop_round.py make_release_zip.sh modules/papertrail/checkpoint.py modules/papertrail/deep_check_store.py modules/papertrail/prompt_store.py run_logged.sh tests/test_arbiter_partial.py tests/test_arbiter_replay.py tests/test_call_bookkeeping.py tests/test_checkpoint.py tests/test_ci_batch_ids.py tests/test_ci_blind_readers.py tests/test_ci_review_pages.py tests/test_ci_settlement_row_page.py tests/test_ci_settlement_rows.py tests/test_ci_settlement_triage.py tests/test_citation_integrity_bench.py tests/test_commit_sweep_hook.py tests/test_deep_check_staleness.py tests/test_free_google_only.py tests/test_fulltext_chunk_merge.py tests/test_labeler_panel.py tests/test_llm_client_rate_classification.py tests/test_llm_extra_body.py tests/test_llm_google_direct.py tests/test_missing_parts_followup.py tests/test_prompt_fingerprints.py tests/test_task37_outage_honesty.py wait_for_run.py  Co-Authored-By: Claude Fable 5 <noreply@anthropic.com> Claude-Session: https://claude.ai/code/session_01Sf7tXHLqwygjBMi6vnGkv4") | last monthAug 30, 2026 |
| [requirements.txt](https://github.com/vbcdng/claim-grounding/blob/master/requirements.txt "requirements.txt") | [requirements.txt](https://github.com/vbcdng/claim-grounding/blob/master/requirements.txt "requirements.txt") | [Six fixes from the known-issues page, the PDF-reading follow-up, and …](https://github.com/vbcdng/claim-grounding/commit/20c2b58c5b387ea30649e4301a5e17f2823909a5 "Six fixes from the known-issues page, the PDF-reading follow-up, and a library update  Three finished pieces of work, all verified before this push:  1. The six tool problems the known-issues page listed as fixed are now    fixed in this repository's code too (the page shipped a day ahead of    the code): marker-typo warnings instead of silent drops, a grey    'could not be checked' state for unreadable sources including a new    gibberish detector for PDFs with damaged fonts, a plain startup    message when the first-run model download is blocked, a correct    browser address on Windows, a one-line message when the claude    program is missing, and visible failure notes in the argument-map    panel. A control benchmark run confirmed these changes alter zero    verdicts across all 129 gate claims.  2. The PDF-reading follow-up: when the tool repairs a badly extracted    PDF, readability of the repaired text now outranks its length, which    fixed the one source file that was still being read as cipher text.    All 221 project sources read cleanly under the new code.  3. The model-calling library (litellm) moves from 1.74.0 to 1.84.0.    Outgoing requests were captured on both versions and are identical    for every worked-around model, and the full test suite passes.  Also included: two rows of the first gate paper's ground truth move to watch status by the author's ruling — one exposed a real judge weakness on quantity words (tracked as future work), one flips without explanation between runs (also tracked).  Files: - verify_my_text.py, requirements.txt - modules/papertrail/: embeddings.py, llm_client.py, matcher.py,   source_decomposer.py, text_decomposer.py, viewer.py, viewer_v2.py,   wizard.py - tests/: test_claude_code_backend.py, test_embeddings_offline.py (new),   test_garble_fallback.py, test_text_decomposer_markers.py,   test_unreadable_sources.py (new), test_viewer_assessment.py,   test_wizard.py - benchmarks/paper1_ground_truth.json  🤖 Generated with [Claude Code](https://claude.com/claude-code)  https://claude.ai/code/session_01Sf7tXHLqwygjBMi6vnGkv4") | 27 days agoSep 1, 2026 |
| [run\_logged.sh](https://github.com/vbcdng/claim-grounding/blob/master/run_logged.sh "run_logged.sh") | [run\_logged.sh](https://github.com/vbcdng/claim-grounding/blob/master/run_logged.sh "run_logged.sh") | [Six weeks of tool development (to 2026-08-31): program code, tests an…](https://github.com/vbcdng/claim-grounding/commit/5823dc6f5a17e9b1843e387ab4a6b73c2ad34908 "Six weeks of tool development (to 2026-08-31): program code, tests and configuration  The main changes since the July code release. Every run now records exact versions (fingerprints) of the prompt files it used, and a re-run refuses to silently reuse old results when a prompt changed in between. A run in which some model calls failed can no longer look healthy: failed calls are marked and warned about instead of being stored as ordinary verdicts. Deep-check comments from an earlier run can no longer attach to fresh verdicts. The default judging model is now the free Gemma model (gemma-4-31b-it) and the default arbiter model is gpt-5.6-luna; validation of the new pair continues and is tracked in ROADMAP.md. Free Google model calls can rotate between two accounts' keys, and a money-lock mode (FREE_GOOGLE_ONLY=1) restricts a run to keys that cannot be billed. Helper scripts ship for logged long runs (run_logged.sh, wait_for_run.py) and for calling the surveyed free model services (free_llm.py).  Files: .gitignore deep_check.py modules/papertrail/arbiter.py modules/papertrail/argument_map.py modules/papertrail/citation_scope.py modules/papertrail/claim_fixer.py modules/papertrail/claude_code_backend.py modules/papertrail/crux.py modules/papertrail/dedup.py modules/papertrail/evidence_independence.py modules/papertrail/llm_client.py modules/papertrail/matcher.py modules/papertrail/origin_trace.py modules/papertrail/own_claims.py modules/papertrail/paper_search.py modules/papertrail/rerun.py modules/papertrail/second_opinion.py modules/papertrail/source_decomposer.py modules/papertrail/text_decomposer.py modules/papertrail/viewer.py modules/papertrail/viewer_v2.py tests/test_argument_map.py tests/test_argument_map_variants.py tests/test_component_rescue.py tests/test_crux.py tests/test_dedup.py tests/test_independence.py tests/test_llm_usage.py tests/test_partial_support.py tests/test_preflight.py tests/test_regression_check.py tests/test_review_layer.py tests/test_text_decomposer_markers.py verify_my_text.py config/prompts/pt_arbiter_partial_map_prompt.txt config/prompts/pt_missing_parts_prompt.txt free_llm.py loop_round.py make_release_zip.sh modules/papertrail/checkpoint.py modules/papertrail/deep_check_store.py modules/papertrail/prompt_store.py run_logged.sh tests/test_arbiter_partial.py tests/test_arbiter_replay.py tests/test_call_bookkeeping.py tests/test_checkpoint.py tests/test_ci_batch_ids.py tests/test_ci_blind_readers.py tests/test_ci_review_pages.py tests/test_ci_settlement_row_page.py tests/test_ci_settlement_rows.py tests/test_ci_settlement_triage.py tests/test_citation_integrity_bench.py tests/test_commit_sweep_hook.py tests/test_deep_check_staleness.py tests/test_free_google_only.py tests/test_fulltext_chunk_merge.py tests/test_labeler_panel.py tests/test_llm_client_rate_classification.py tests/test_llm_extra_body.py tests/test_llm_google_direct.py tests/test_missing_parts_followup.py tests/test_prompt_fingerprints.py tests/test_task37_outage_honesty.py wait_for_run.py  Co-Authored-By: Claude Fable 5 <noreply@anthropic.com> Claude-Session: https://claude.ai/code/session_01Sf7tXHLqwygjBMi6vnGkv4") | last monthAug 30, 2026 |
| [verify\_my\_text.py](https://github.com/vbcdng/claim-grounding/blob/master/verify_my_text.py "verify_my_text.py") | [verify\_my\_text.py](https://github.com/vbcdng/claim-grounding/blob/master/verify_my_text.py "verify_my_text.py") | [Six fixes from the known-issues page, the PDF-reading follow-up, and …](https://github.com/vbcdng/claim-grounding/commit/20c2b58c5b387ea30649e4301a5e17f2823909a5 "Six fixes from the known-issues page, the PDF-reading follow-up, and a library update  Three finished pieces of work, all verified before this push:  1. The six tool problems the known-issues page listed as fixed are now    fixed in this repository's code too (the page shipped a day ahead of    the code): marker-typo warnings instead of silent drops, a grey    'could not be checked' state for unreadable sources including a new    gibberish detector for PDFs with damaged fonts, a plain startup    message when the first-run model download is blocked, a correct    browser address on Windows, a one-line message when the claude    program is missing, and visible failure notes in the argument-map    panel. A control benchmark run confirmed these changes alter zero    verdicts across all 129 gate claims.  2. The PDF-reading follow-up: when the tool repairs a badly extracted    PDF, readability of the repaired text now outranks its length, which    fixed the one source file that was still being read as cipher text.    All 221 project sources read cleanly under the new code.  3. The model-calling library (litellm) moves from 1.74.0 to 1.84.0.    Outgoing requests were captured on both versions and are identical    for every worked-around model, and the full test suite passes.  Also included: two rows of the first gate paper's ground truth move to watch status by the author's ruling — one exposed a real judge weakness on quantity words (tracked as future work), one flips without explanation between runs (also tracked).  Files: - verify_my_text.py, requirements.txt - modules/papertrail/: embeddings.py, llm_client.py, matcher.py,   source_decomposer.py, text_decomposer.py, viewer.py, viewer_v2.py,   wizard.py - tests/: test_claude_code_backend.py, test_embeddings_offline.py (new),   test_garble_fallback.py, test_text_decomposer_markers.py,   test_unreadable_sources.py (new), test_viewer_assessment.py,   test_wizard.py - benchmarks/paper1_ground_truth.json  🤖 Generated with [Claude Code](https://claude.com/claude-code)  https://claude.ai/code/session_01Sf7tXHLqwygjBMi6vnGkv4") | 27 days agoSep 1, 2026 |
| [wait\_for\_run.py](https://github.com/vbcdng/claim-grounding/blob/master/wait_for_run.py "wait_for_run.py") | [wait\_for\_run.py](https://github.com/vbcdng/claim-grounding/blob/master/wait_for_run.py "wait_for_run.py") | [Six weeks of tool development (to 2026-08-31): program code, tests an…](https://github.com/vbcdng/claim-grounding/commit/5823dc6f5a17e9b1843e387ab4a6b73c2ad34908 "Six weeks of tool development (to 2026-08-31): program code, tests and configuration  The main changes since the July code release. Every run now records exact versions (fingerprints) of the prompt files it used, and a re-run refuses to silently reuse old results when a prompt changed in between. A run in which some model calls failed can no longer look healthy: failed calls are marked and warned about instead of being stored as ordinary verdicts. Deep-check comments from an earlier run can no longer attach to fresh verdicts. The default judging model is now the free Gemma model (gemma-4-31b-it) and the default arbiter model is gpt-5.6-luna; validation of the new pair continues and is tracked in ROADMAP.md. Free Google model calls can rotate between two accounts' keys, and a money-lock mode (FREE_GOOGLE_ONLY=1) restricts a run to keys that cannot be billed. Helper scripts ship for logged long runs (run_logged.sh, wait_for_run.py) and for calling the surveyed free model services (free_llm.py).  Files: .gitignore deep_check.py modules/papertrail/arbiter.py modules/papertrail/argument_map.py modules/papertrail/citation_scope.py modules/papertrail/claim_fixer.py modules/papertrail/claude_code_backend.py modules/papertrail/crux.py modules/papertrail/dedup.py modules/papertrail/evidence_independence.py modules/papertrail/llm_client.py modules/papertrail/matcher.py modules/papertrail/origin_trace.py modules/papertrail/own_claims.py modules/papertrail/paper_search.py modules/papertrail/rerun.py modules/papertrail/second_opinion.py modules/papertrail/source_decomposer.py modules/papertrail/text_decomposer.py modules/papertrail/viewer.py modules/papertrail/viewer_v2.py tests/test_argument_map.py tests/test_argument_map_variants.py tests/test_component_rescue.py tests/test_crux.py tests/test_dedup.py tests/test_independence.py tests/test_llm_usage.py tests/test_partial_support.py tests/test_preflight.py tests/test_regression_check.py tests/test_review_layer.py tests/test_text_decomposer_markers.py verify_my_text.py config/prompts/pt_arbiter_partial_map_prompt.txt config/prompts/pt_missing_parts_prompt.txt free_llm.py loop_round.py make_release_zip.sh modules/papertrail/checkpoint.py modules/papertrail/deep_check_store.py modules/papertrail/prompt_store.py run_logged.sh tests/test_arbiter_partial.py tests/test_arbiter_replay.py tests/test_call_bookkeeping.py tests/test_checkpoint.py tests/test_ci_batch_ids.py tests/test_ci_blind_readers.py tests/test_ci_review_pages.py tests/test_ci_settlement_row_page.py tests/test_ci_settlement_rows.py tests/test_ci_settlement_triage.py tests/test_citation_integrity_bench.py tests/test_commit_sweep_hook.py tests/test_deep_check_staleness.py tests/test_free_google_only.py tests/test_fulltext_chunk_merge.py tests/test_labeler_panel.py tests/test_llm_client_rate_classification.py tests/test_llm_extra_body.py tests/test_llm_google_direct.py tests/test_missing_parts_followup.py tests/test_prompt_fingerprints.py tests/test_task37_outage_honesty.py wait_for_run.py  Co-Authored-By: Claude Fable 5 <noreply@anthropic.com> Claude-Session: https://claude.ai/code/session_01Sf7tXHLqwygjBMi6vnGkv4") | last monthAug 30, 2026 |
| View all files |

## Repository files navigation

# Claim grounding — alpha test release

[Permalink: Claim grounding — alpha test release](https://github.com/vbcdng/claim-grounding#claim-grounding--alpha-test-release)

This tool checks cited writing against its sources. It reads your text
and finds every sentence with a citation. It then checks each such
sentence against the actual source PDF or text file, using a language
model. The result is a single file, `viewer.html`, that opens in any
browser. Nothing runs on a server, and there is no account to create.

Every checked sentence gets one of three verdicts:

- **supported** — the source contains the statement. The exact proof
sentences are quoted from the source.
- **unsupported** — no cited source backs the statement. The card says
what is missing or contradicted.
- **your own claim** — your uncited sentences (thesis, framing, opinion).
They are labeled but not checked.

This is an **alpha test release**. It works end to end, and its judging
has been measured against hand-checked papers (see `FOR_REVIEWERS.md`).
Still, expect rough edges. When a verdict looks wrong or something
crashes, please tell us. Reports like that are the reason for an alpha
test.

## 1\. The main use case: check a text an AI wrote for you

[Permalink: 1. The main use case: check a text an AI wrote for you](https://github.com/vbcdng/claim-grounding#1-the-main-use-case-check-a-text-an-ai-wrote-for-you)

AI research tools can write a cited text on any topic in minutes.
Claude's Research feature, ChatGPT's deep research, Elicit, and
Perplexity all do this. The open question is always the same: do the
cited papers really say what the text claims? This tool answers that
question sentence by sentence, with quotes.

Here is the whole loop, exactly as we ran it in August 2026:

1. **Ask the research tool to write the text.** Copy the prompt from
`RESEARCH_WRITE_PROMPT.md` (shipped in this repository), add
your topic, and give it to the research tool. The prompt makes the
tool put one citation marker on each sourced sentence, like this:
`Cities that had a printing press by 1500 were more likely to turn Protestant by 1560. [[rubin2014]]`

2. **Save the output as two files.** The text goes into `my_text.md`.
The reference list goes into `my_text.md.refs.txt`, one line per
source: `rubin2014 = rubin2014.pdf`.

3. **Collect the source files.** Download each reference into a
`sources/` folder, under the file name used in the refs file. The
research tool's reference list gives you the links. For Claude
research exports, `import_claude_research.py` and
`download_sources.py` do steps 2 and 3 for you (section 6).

4. **Run the check:**



```
venv/bin/python verify_my_text.py \
     --text my_text.md \
     --sources sources \
     --references my_text.md.refs.txt \
     --output-dir runs/my_check --open
```

5. **Read the result.**`viewer.html` opens with your text on the left
and one card per claim on the right, each with its verdict and the
quoted proof sentences.


**What this produced in our test.** We gave Claude (the Sonnet model)
the prompt above, eight real research papers, and a topic. The topic
was what researchers have measured about the printing press and the
Reformation. Claude wrote 421 words with 11 cited claims. The tool then
checked the result on the free Claude Code backend. That took 40
minutes and cost nothing.

All 11 cited claims came back **supported**, each with quoted proof
sentences from its source. The one uncited closing sentence was
correctly labeled **your own claim**. On two claims the first pass
could not show proof for every part. The arbiter (also free on this
backend) settled both by fetching the exact missing sentences from the
papers. One claim got a "partial support?" reminder chip to
double-check.

The research tool had followed the prompt's rules, and the check
confirmed it. This is the result the tool exists to give you: a verdict
backed by quotes a human can check in seconds.

The same check catches the failure case just as visibly. When a claim
says more than its source does, the card comes back **unsupported** or
flagged, and names the part that has no proof. Section 7 shows what
those cards look like.

### The easiest way: let an agent tool run the whole loop

[Permalink: The easiest way: let an agent tool run the whole loop](https://github.com/vbcdng/claim-grounding#the-easiest-way-let-an-agent-tool-run-the-whole-loop)

The five steps above assume you move text between tools by hand. An
agent tool — Claude Code, or any equivalent that can both use a model
and run commands — can do the loop for you. Ask it to research and
write the text with the prompt, save the two files, collect the
sources, and run the check. Then ask it to read the verdict cards,
rewrite any sentence that came back unsupported, and run the check
again. An agent also makes fewer format mistakes in step 2. It writes
the two files directly instead of you copying text out of a chat
window.

A ready-made prompt for the agent is in `AGENT_LOOP_PROMPT.md` (shipped
in this repository). It walks the agent through all the steps and their
safety rules. For the text itself it points the agent at the writing
prompt, so the two prompts stay separate.

If your agent tool is Claude Code, there is a shorter way. This
repository ships the loop as a skill. A skill is a saved instruction
sheet that Claude Code loads when you type its name. Open Claude Code
in the repository folder and type `/checked-research` followed by your
topic. The session then runs the whole loop itself: the research, the
two files, the sources, the check, and one repair round.

The research step runs on whatever model your session uses, so pick
the model first. The testing note below applies to the skill as well.

Our own example above was made this way: Claude Code wrote the text,
saved the files, and ran the check with no hand copying. For the
rewrite step it has a ready-made command, `/apply-review` (section 7).

We ran the full loop, including the automatic rewrite, end to end in
August 2026. An agent researched a podcast episode and wrote a
five-entry page of checkable claims. It saved both input files in the
right format on the first try, with no hand-fixing.

The check found three claims that said more than their sources do. The
agent rewrote two of them from the checker's quoted feedback, and the
re-check proved both. The third stayed marked unsupported because its
source sits behind a download block, which is the honest outcome.
Checking cost about 15 cents in model fees and the writing cost
nothing extra.

Two honest notes from that test. The agent first tried a shortcut.
It saved its own summaries as source files instead of the real
documents, which would have made the check worthless. The skill now
forbids exactly that, and the check itself caught the resulting gaps.

And we have only tested the loop with Claude Code so far. Testing
whether other research tools can produce the two files is still open.
This section will get those results.

## 2\. Install (two commands, then a large download)

[Permalink: 2. Install (two commands, then a large download)](https://github.com/vbcdng/claim-grounding#2-install-two-commands-then-a-large-download)

Needs Python 3.10 or newer.

```
cd claim-grounding
python3 -m venv venv
venv/bin/pip install -r requirements.txt
```

Windows: `venv\Scripts\pip install -r requirements.txt`, and use
`venv\Scripts\python` wherever this page says `venv/bin/python`.

The install is large. It pulls **about 1.5 GB of libraries** (the
CPU version of torch and the text-similarity stack). The first run
downloads a **~0.4 GB local text-similarity model** on top. Most of
the install time is the download itself. After that, everything
similarity-related runs locally on your CPU. No GPU is needed.

Optional but recommended on Linux and Mac: the `poppler-utils` package.
It provides `pdftotext`, which recovers text from PDFs that other
extractors read incorrectly.

## 3\. Give it a model (an API key, or a free no-key option)

[Permalink: 3. Give it a model (an API key, or a free no-key option)](https://github.com/vbcdng/claim-grounding#3-give-it-a-model-an-api-key-or-a-free-no-key-option)

The judging model is your choice. Any ONE of these works:

- **The default — Google's free tier ($0):** put a free Google AI
Studio key in `config/google_api_key.txt`. It is picked up
automatically. The default model is **Gemma** (a Google model), and
on the free tier it costs nothing. The trade-off is speed. The free
tier limits how many requests per minute it accepts, so the run
spends much of its time waiting its turn. Leave it running in the
background — do not choose it when you are in a hurry.
- **The same model, paid and fast:** create a key at openrouter.ai,
then `export OPENROUTER_API_KEY=...` and add
`--model openrouter/google/gemma-4-31b-it` to the run command. This
is the same judge without the waiting, and a short essay costs a few
cents.
- **No key at all ($0):** if you have Claude Code installed and logged
in, add `--backend claude-code`. It is free through your Claude
subscription but slow, taking minutes per claim, which is fine for a
short text.
- **Fully local ($0, no internet):** an Ollama model. `LOCAL_MODELS.md`
records what we found: local models run, but none has yet been
validated against the hand-checked accuracy benchmarks our hosted
judge passed. Treat a local run as a rough draft. Do not rely on its
verdicts yet.

On the default free tier a run costs **$0.00**. On a paid model a short
essay costs **a few cents**. Every run starts with one tiny test call
and stops immediately with a clear message if the key does not work. It
prints a cost estimate up front and asks for confirmation before
anything expensive (above about $1). At the end it prints the actual
cost next to that estimate. `--estimate` prints the estimate and exits
without calling any model.

### The arbiter — a second model for the flagged claims (optional)

[Permalink: The arbiter — a second model for the flagged claims (optional)](https://github.com/vbcdng/claim-grounding#the-arbiter--a-second-model-for-the-flagged-claims-optional)

The **arbiter** is a second model that re-reads every claim the run
flagged, together with the cited source. Sources up to 30,000 words are
sent whole. Longer ones send their most relevant section of about
20,000 words. When it finds proof sentences the first pass missed, it
attaches them to the card, word-for-word checked against the source.

The arbiter is on by default but needs its own key:
`OPENROUTER_API_KEY` or
`config/openrouter_api_key.txt`. It adds a few cents per run. Without
a key, the arbiter step is skipped with a one-line note, and the rest
of the run continues normally. On
`--backend claude-code` it runs through your Claude login at no cost,
nothing to set up.

**The cheap mixed setup.** The two choices combine. You can run the
free Gemma judge with your Google key and route only the arbiter
through a Claude subscription. Add `--arbiter claude-code/sonnet` to
the run command. The judging model is still free, the arbiter is a
strong model, and the total API cost is $0.

We measured whether the arbiter is worth using. One demo essay with 54
claims ran with and without it, same text and judging model:

- Without it, the run raised 7 "not proven as written" flags.
- With it, the arbiter re-read 14 flagged claims and cleared 3 of the 7
flags by fetching the exact missing sentences from the sources. All
three were retrieval misses, not real gaps.
- The 4 flags that survived were genuine over-claims that the author
then needed to rewrite.

That demo cost $0.04 with the arbiter model we used at the time
(DeepSeek). With today's default arbiter (OpenAI's gpt-5.6-luna, which
won our model comparison) the same run would cost a few cents more.

The arbiter never decides a verdict by itself. There is one optional
exception, and it works only in the claim's favor. Start the run with
`--arbiter-rescue`, and a falsely rejected claim can flip to
supported. The flip happens only when the arbiter's verified proof
convinces the first judging model on a re-read, and the card says so.

This flip used to be on by default. We turned it off on 2026-09-01
after a measurement. We re-ran the same rejected claims three times
each with the current arbiter model. Some runs flipped a claim and
some did not, and a verdict change should not depend on which run you
happened to get. Without the flag, the arbiter's verified find still
appears on the rejected card as a "proof may exist" note. The verdict
stays what the judge decided.

### How long a run takes

[Permalink: How long a run takes](https://github.com/vbcdng/claim-grounding#how-long-a-run-takes)

For a one-page text (about 8–15 cited claims), first-run times:

| Backend | First run | Cost |
| --- | --- | --- |
| free Google tier (the default) | **slow — plan in hours, not minutes.** The free tier paces requests; our six-document benchmark run took just under four hours, about forty minutes per document | $0 |
| paid key (`openrouter/google/gemma-4-31b-it`) | minutes to tens of minutes — much of it is local processing of the source PDFs, not the model | cents |
| `--backend claude-code` | measured twice: **34.5 min** on a 309-word, 8-claim essay and **40 min** on a 421-word, 11-claim text — expect half an hour to an hour | $0 |
| local Ollama model | depends on your hardware and model size — see `LOCAL_MODELS.md` | $0 |

Longer texts scale with the number of cited claims. Re-runs of the same
text into the same output folder are much faster and nearly free.
Unchanged claims reuse their previous verdicts, and the processed
sources are cached. `--concurrency N` raises the number of parallel
model calls (default 4).

## 4\. Run the bundled example (a few minutes)

[Permalink: 4. Run the bundled example (a few minutes)](https://github.com/vbcdng/claim-grounding#4-run-the-bundled-example-a-few-minutes)

The repository includes a small ready-to-run project:
`examples/chimpanzee_validation/` — a short text about a chimpanzee
behavior study, with its source PDF already included. Nothing to
download:

```
venv/bin/python verify_my_text.py \
  --text examples/chimpanzee_validation/my_text.md \
  --sources examples/chimpanzee_validation/sources \
  --output-dir runs/example --open
```

`--open` launches `viewer.html` when done. A larger example with nine
sources is in `examples/bentonite/`. Two of its sources are
subscription-only papers we may not redistribute. Its README explains
which two files to fetch yourself.

## 5\. Or let the wizard ask you everything

[Permalink: 5. Or let the wizard ask you everything](https://github.com/vbcdng/claim-grounding#5-or-let-the-wizard-ask-you-everything)

Run the verifier with **no arguments** and it asks instead of demanding
flags:

```
venv/bin/python verify_my_text.py
```

Five steps: text → sources → output folder → model and key → run
options. Ground rules for all of them:

- The value in `[brackets]` is the default — **Enter** accepts it.
- **Tab** completes file and folder paths.
- **Ctrl+C** aborts at any point: nothing runs, and nothing is spent.
The wizard
itself never calls a model. The normal cost estimate and confirmation
still come before the actual run.

The wizard also fixes problems as it goes:

- **Text file** — if the file turns out to be a Claude research export,
it offers to convert it on the spot (free, offline). If it has no
citation markers at all, it warns you that nothing would be verified.
- **Sources** — it checks that every cited key has a real file in your
sources folder. Missing ones are listed with title, year and link, and
if a download manifest is found it offers to fetch the open-access
ones right there. Whatever is still missing you can continue without —
those claims are marked "source file missing" on their card. The
tool does not guess a replacement source.
- **Model and key** — a menu of the options from section 3. Project key
files and environment variables are picked up automatically.
- **Run options** — concurrency, an optional second-opinion pass, and
whether to open the viewer when done.

At the end it prints the equivalent one-line command, so you can skip
the wizard next time.

## 6\. Check your own existing text

[Permalink: 6. Check your own existing text](https://github.com/vbcdng/claim-grounding#6-check-your-own-existing-text)

The tool needs three things (full contract: `INPUT_FORMAT.md`):

1. **Your text** with a citation marker ` [[key]]` after each cited
sentence.
2. **A refs file** (`<your text>.refs.txt`) mapping each key to a source
file: `zhong2019 = zhong2019.pdf`, one per line.
3. **A sources folder** with those files (`.pdf` or `.txt` — plain-text
formats such as Markdown are read as text).

The marker format is extra work for now. The goal is that a future
version accepts any normally-cited text as it is. Until then, three
converters cover the common cases:

- **A draft with normal citations** (footnotes, "(Smith 2020)", numbered
references): give `CONVERT_MY_TEXT_PROMPT.md` and the draft to
the LLM that wrote or knows your text. It inserts the markers and
builds the refs file, and its warnings section tells you what to
review by hand. Review its output before running — especially that it
did not invent a citation you never made.

- **A published paper** (PDF, DOI or arXiv link): `import_paper.py`
converts it, citations and reference list included. A paper can then
be checked against its own cited sources. No model calls:



```
venv/bin/python import_paper.py --doi 10.1234/example --output-dir data/that_paper
```

- **A Claude research report** (pandoc `[@key]` export plus `.bib`
bibliography):



```
venv/bin/python import_claude_research.py --input report.md --output-dir data/my_article
```


Both importers also write a `sources_manifest.json`. Then
`download_sources.py` fetches the open-access sources for you. It also
writes `download_report.md`, which lists every source it could not
fetch, each with a link and a "save as" file name:

```
venv/bin/python download_sources.py --manifest data/my_article/sources_manifest.json
```

Paywalled papers you download yourself go into the project's `inbox/`
folder. Then `ingest_downloads.py` files them: it matches each file to
its reference by key, DOI or title, renames it, and updates the refs
file. It never guesses — an ambiguous file is left in place with a note.

Paper metadata and lookups are provided by the [Semantic Scholar Open\\
Data Platform](https://www.semanticscholar.org/) (attribution per their
API license).

### Writing a NEW text with a research tool

[Permalink: Writing a NEW text with a research tool](https://github.com/vbcdng/claim-grounding#writing-a-new-text-with-a-research-tool)

If you do not have a draft yet, this is the main use case — section 1.
The full prompts are in `RESEARCH_WRITE_PROMPT.md`. Variant A is
for Claude's Research feature, which cites natively with `[@key]` plus
a `.bib` export that `import_claude_research.py` converts. Variant B is
for every other tool and asks for `[[key]]` markers directly.

Two rules in those prompts decide whether the result
verifies cleanly. Each sourced sentence gets its own citation, and one
citation must not cover a whole paragraph. And every citation points at
a source that genuinely says that claim.

After the research tool answers, give the markers a two-minute read:
each marker on the one sentence it supports, your own framing left
unmarked. After that check, the output usually verifies cleanly.

## 7\. Reading the results

[Permalink: 7. Reading the results](https://github.com/vbcdng/claim-grounding#7-reading-the-results)

[![The viewer on an example run: your text on the left with each claim highlighted by verdict, one card per claim in document order on the right](https://github.com/vbcdng/claim-grounding/raw/master/docs/release_assets/viewer_screenshot.png)](https://github.com/vbcdng/claim-grounding/blob/master/docs/release_assets/viewer_screenshot.png)

Two columns: your text on the left with every claim highlighted by
verdict, and one card per claim in document order on the right. Each
quoted proof sentence has buttons next to it that open the source at
the right spot. PDFs jump to the page, and text sources open with the
sentence highlighted.

**Start with the "How to read this" panel at the top of the viewer.**
It is the legend for everything on the page, using the exact badges and
chips the cards use. Note the view toggle in the header. The **simple**
**view** shows verdict, claim, proof sentences and confidence — start
there. The **expert view** shows every chip, note and review control on
every card.

The same legend, for reading here:

### Verdict badges

[Permalink: Verdict badges](https://github.com/vbcdng/claim-grounding#verdict-badges)

| Badge | Meaning |
| --- | --- |
| **SUPPORTED** (green) | the cited source contains the statement — not that the source is strong or the claim is true |
| **NOT PROVEN AS WRITTEN** (amber) | judged supported overall, but the shown sentences do not prove every part — the amber line names the unproven part |
| ◦ commonly known (grey) | a part with no shown proof that the tool judged an everyday fact needing no citation — never counted against the claim |
| **UNSUPPORTED** (red) | no cited source backs it (or the source file is missing) |
| **SCOPED CITATION** (indigo) | the passage is the authors' own work, and the citation backs only a method or concept named inside it — not an authoring error |
| **YOUR OWN CLAIM** (indigo) | your uncited claim — thesis, argument, transition. Nothing was checked |
| **UNUSED** | a point one of your sources makes that your text did not cite — material you could still use, not an error |

### Chips — nudges, never a verdict

[Permalink: Chips — nudges, never a verdict](https://github.com/vbcdng/claim-grounding#chips--nudges-never-a-verdict)

| Chip | Meaning |
| --- | --- |
| high / medium / low confidence | how sure the judging model is — derived from votes and method, no extra model call |
| ◐ partly proven | a rejected claim where the arbiter holds word-for-word verified quotes proving some parts — the card lists each proven part with its quote, and each unproven part. The verdict stays unsupported |
| 📎 citation needed? | an uncited passage that asserts a checkable fact — a nudge to cite |
| partial support? | the cited source(s) back only part of the claim — the verdict stays supported |
| over-cited? | one cited source adds nothing the others already cover |
| secondhand evidence? | the supporting sentence itself cites another work — consider citing the original |
| sources may disagree? | a co-cited source's evidence was judged to argue the opposite |
| ⚠ 2nd opinion disagrees | a second model disagreed — lowers confidence, read the evidence yourself |
| 🔷 proof may exist | the arbiter found word-for-word verified sentences the first pass never saw |
| ⚡ conflicting evidence? | the arbiter found a source sentence that may contradict the claim |
| ⛑ arbiter rescue | first judged unsupported, then flipped to supported: the arbiter located proof and the first judging model accepted it on a re-read. Appears only in runs started with `--arbiter-rescue` (off by default since 2026-09-01) |
| ⛑ gap closed by arbiter | an amber flag cleared — the arbiter found word-for-word proof for the gap |
| ⚠ check not run — API failed | the model API stopped responding during this claim's extra checks — their result was dropped instead of guessed. A plain re-run retries exactly these |
| ✎ changed | edited since the last run (incremental re-runs only) |

### When model requests fail

[Permalink: When model requests fail](https://github.com/vbcdng/claim-grounding#when-model-requests-fail)

If model requests failed during a run, the result is clearly marked as
incomplete. The run ends with a warning that lists the affected claims. The viewer
shows a warning banner at the top, and each affected card carries the
"check not run" chip. Re-running the same command retries exactly the
affected claims and nothing else.

### Marking problems and repairing your text

[Permalink: Marking problems and repairing your text](https://github.com/vbcdng/claim-grounding#marking-problems-and-repairing-your-text)

Every card has **triage buttons** — six of them, including wrong
source, rewrite, and verdict wrong, plus a free-text note. Marks live
in your browser only. The viewer exports either a **repair brief**
(self-contained markdown for any LLM) or a **review.json** file.

The review.json is consumed by the **`/apply-review` Claude Code**
**command, which ships in this repository** (`.claude/commands/`). Open
this folder in Claude Code, type `/apply-review`, and it applies your
marked fixes to the text following the guardrails in
`docs/REPAIR_PLAYBOOK.md`. Every edit is logged with its evidence quote,
citation swaps require the quoted passage, and one repair-then-verify
cycle is the limit before a human read-through.

Re-running after edits is **incremental**: unchanged claims keep their
verdicts at zero API cost. The viewer gets a "Changed" filter showing
what each edited claim replaced. Use the same `--output-dir`. `--full`
forces a complete re-run.

One deliberate exception exists. Every run
records fingerprints of the exact judging instructions it used, and if
those instruction files changed since the last run, the re-run re-judges
everything. Old verdicts made under different instructions are never
reused.

Two deeper checks exist for a finished run. `deep_check.py` has a
stronger model re-read every judged claim with source context. It writes
an independent verdict plus commentary onto each card, and never changes
the run's verdicts (`docs/DEEP_CHECK.md`). And before trusting a run on
a **new kind of paper**, do the 15-minute hand-check of 8 sampled
verdicts described in `docs/NEW_PAPER_AUDIT.md`.

## 8\. How accurate is it

[Permalink: 8. How accurate is it](https://github.com/vbcdng/claim-grounding#8-how-accurate-is-it)

`FOR_REVIEWERS.md` explains how the tool decides, what
each benchmark tests, and how to re-run the scoring yourself. The
benchmark run outputs and human labels are checked into `benchmarks/`,
so most of it needs no API key.

We also tested whether small purpose-built claim-checking models can do
this job for free. Eight such models were tested on 286 real and
deliberately corrupted claims. None of them can replace the judging
model. One of them earned a narrow double-checking job. The full
write-up is not yet public.

Known issues, each with its workaround, are listed in
`docs/KNOWN_ISSUES.md`. What happens inside a run, step by step and in
plain language, is described in `docs/HOW_THE_CHECK_WORKS.md`.

## 9\. What changed in August 2026

[Permalink: 9. What changed in August 2026](https://github.com/vbcdng/claim-grounding#9-what-changed-in-august-2026)

For readers of the July release, the user-visible changes:

- **Failed model requests are now visible.** They used to be silently
scored "unsupported". Now they are flagged on the card and in a
banner, and a plain re-run retries exactly those claims.
- **Rejected claims can show their proven parts.** The "◐ partly proven"
chip lists which parts of a rejected claim have word-for-word verified
proof. That tells you whether to delete the sentence or fix one half.
- **Runs record their instructions.** Each run stores fingerprints of
the judging instructions it used, and incremental re-runs refuse to
mix verdicts made under different instructions.
- **Stale deep-check comments are dropped.** A re-run archives the old
deep-check file instead of leaving its comments next to fresh
verdicts.
- **New default models.** The judge now defaults to Gemma on Google's
free tier ($0, slower). The arbiter defaults to OpenAI's gpt-5.6-luna
through OpenRouter. Both won our model comparisons.
- **The run prints its actual cost.** Every run ends by printing what
it really cost next to the up-front estimate.

## 10\. What feedback helps most

[Permalink: 10. What feedback helps most](https://github.com/vbcdng/claim-grounding#10-what-feedback-helps-most)

- A verdict you disagree with — send the claim text, the verdict, and
why.
- A crash or confusing error — the exact command plus the last lines of
output.
- A place where the viewer confused you.
- What it cost versus what the estimate said.

## License

[Permalink: License](https://github.com/vbcdng/claim-grounding#license)

MIT — see `LICENSE`.

## About

Check every citation in a text against its source

### Topics

[citation-checking](https://github.com/topics/citation-checking) [claim-verification](https://github.com/topics/claim-verification) [fact-checking](https://github.com/topics/fact-checking) [llm](https://github.com/topics/llm) [research-tools](https://github.com/topics/research-tools)

### Resources

[Readme](https://github.com/vbcdng/claim-grounding#readme-ov-file)

[MIT license](https://github.com/vbcdng/claim-grounding#MIT-1-ov-file)

[Activity](https://github.com/vbcdng/claim-grounding/activity)

### Stars

**3** stars

### Watchers

**0** watching

### Forks

[**1** fork](https://github.com/vbcdng/claim-grounding/forks)

[Report repository](https://github.com/contact/report-content?content_url=https%3A%2F%2Fgithub.com%2Fvbcdng%2Fclaim-grounding&report=vbcdng+%28user%29)

## [Releases](https://github.com/vbcdng/claim-grounding/releases) 1 (1)

[Demo report — eggs exampleLatest\\
\\
2 months agoJul 19, 2026](https://github.com/vbcdng/claim-grounding/releases/tag/demo-v1)

## [Contributors](https://github.com/vbcdng/claim-grounding/graphs/contributors) 2 (2)

- [![@vbcdng](https://avatars.githubusercontent.com/u/214220625?s=64&v=4)](https://github.com/vbcdng) [**vbcdng**](https://github.com/vbcdng)
- [![@claude](https://avatars.githubusercontent.com/u/81847?s=64&v=4)](https://github.com/claude) [**claude** Claude](https://github.com/claude)

## Languages

- [Python97.5%](https://github.com/vbcdng/claim-grounding/search?l=python)
- [Shell2.5%](https://github.com/vbcdng/claim-grounding/search?l=shell)

You can’t perform that action at this time.
