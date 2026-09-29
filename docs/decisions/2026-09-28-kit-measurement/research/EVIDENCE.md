# Evidence

One row per fetched page. `Raw` points at the cached page text under `research/raw/`,
which is what makes the claim checkable - a row without raw evidence fails preflight.

The `Finding` cell arrives as an auto-extracted summary. Rewrite it into a real claim:
what the page actually establishes, with the quote or number that proves it.

| ID | Retrieved | Type | URL | Finding | Raw |
|---|---|---|---|---|---|
| E-01 | 2026-09-28 | P | https://github.com/Ayanami0730/deep_research_bench | DeepResearch Bench (repo): FACT is its citation-trustworthiness framework; its README badges link the Hugging Face dataset muset-ai/DeepResearch-Bench-Dataset and a leaderboard, and the official evaluator uses judge LLMs. | research/raw/2026-09-28-github-ayanami0730-deep-research-bench-d-github-aff5abe8.md |
| E-02 | 2026-09-28 | P | https://arxiv.org/html/2506.11763 | DeepResearch Bench paper: a Judge LLM extracts Statement-URL pairs from a report, deduplicates them, then judges each against the page text as support or not support; Citation Accuracy is the share supported, Effective Citations the supported count per task. [quote: This results in a binary judgment (’support’ or ’not support’) for each pair] | research/raw/2026-09-28-deepresearch-bench-a-comprehensive-bench-arxiv-180d9822.md |
| E-03 | 2026-09-28 | P | https://arxiv.org/html/2605.06635v1 | "Cited but Not Verified": each citation-claim pair is scored on Link Works (URL accessible, judged without an LLM), Relevant Content and Fact Check. [quote: Link Works assesses URL accessibility without LLM inference] | research/raw/2026-09-28-cited-but-not-verified-parsing-and-evalu-arxiv-5e776265.md |
