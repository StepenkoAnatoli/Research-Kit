# Evidence

One row per fetched page. `Raw` points at the cached page text under `research/raw/`,
which is what makes the claim checkable - a row without raw evidence fails preflight.

The `Finding` cell arrives as an auto-extracted summary. Rewrite it into a real claim:
what the page actually establishes, with the quote or number that proves it.

| ID | Retrieved | Type | URL | Finding | Raw |
|---|---|---|---|---|---|
| E-01 | 2026-09-29 | P | https://arxiv.org/html/2402.14207v2 | STORM (Shao et al., Stanford): an LLM lists related topics, the tables of contents of their Wikipedia articles are extracted through the Wikipedia API, and an LLM names perspectives from them; a basic-facts writer is always added. Ablation (Table 3, heading soft recall): STORM 86.26 / 92.73 (GPT-3.5 / GPT-4), without perspectives 84.49 / 92.39, without conversation 77.97 / 88.75. [quote: STORM prompts an LLM to generate a list of related topics and subsequently extracts the tables of contents from their corresponding Wikipedia articles] [quote: These tables of contents are concatenated to create a context to prompt the LLM to identify] [quote: indicating reading relevant information is crucial to generating effective questions] | research/raw/2026-09-29-assisting-in-writing-wikipedia-like-arti-arxiv-bca10809.md |
| E-02 | 2026-09-29 | P | https://github.com/stanford-oval/storm | The released STORM (knowledge-storm) states the same method: perspectives are discovered by surveying articles on similar topics, and each pipeline stage is configured with its own language model. [quote: STORM discovers different perspectives by surveying existing articles from similar topics and uses them to control the question-asking process] | research/raw/2026-09-29-github-stanford-oval-storm-an-llm-powere-github-d14c5e41.md |
