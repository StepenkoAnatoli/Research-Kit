---
url: https://github.com/Ayanami0730/deep_research_bench
retrieved: 2026-09-28
command: firecrawl scrape https://github.com/Ayanami0730/deep_research_bench --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: GitHub - Ayanami0730/deep_research_bench: DeepResearch Bench: A Comprehensive Benchmark for Deep Research Agents · GitHub
---
[Skip to content](https://github.com/Ayanami0730/deep_research_bench#start-of-content)

You signed in with another tab or window. [Reload](https://github.com/Ayanami0730/deep_research_bench) to refresh your session.You signed out in another tab or window. [Reload](https://github.com/Ayanami0730/deep_research_bench) to refresh your session.You switched accounts on another tab or window. [Reload](https://github.com/Ayanami0730/deep_research_bench) to refresh your session.Dismiss alert

{{ message }}

[Ayanami0730](https://github.com/Ayanami0730)/ **[deep\_research\_bench](https://github.com/Ayanami0730/deep_research_bench)** Public

- [Notifications](https://github.com/login?return_to=%2FAyanami0730%2Fdeep_research_bench) You must be signed in to change notification settings
- [Fork\\
86](https://github.com/login?return_to=%2FAyanami0730%2Fdeep_research_bench)
- [Star\\
835](https://github.com/login?return_to=%2FAyanami0730%2Fdeep_research_bench)


main

[**3** Branches](https://github.com/Ayanami0730/deep_research_bench/branches) [**0** Tags](https://github.com/Ayanami0730/deep_research_bench/tags)

[Go to Branches page](https://github.com/Ayanami0730/deep_research_bench/branches)[Go to Tags page](https://github.com/Ayanami0730/deep_research_bench/tags)

Go to file

Code

Open more actions menu

## Latest commit

[![imlrz](https://avatars.githubusercontent.com/u/139892071?v=4&size=40)](https://github.com/imlrz)[imlrz](https://github.com/Ayanami0730/deep_research_bench/commits?author=imlrz)

[docs: mention CLEAN\_Model API surface](https://github.com/Ayanami0730/deep_research_bench/commit/852f4022d1f98fb707222e395405136e8f0e8d52)

last weekSep 22, 2026

[852f402](https://github.com/Ayanami0730/deep_research_bench/commit/852f4022d1f98fb707222e395405136e8f0e8d52) · last weekSep 22, 2026

## History

[46 Commits](https://github.com/Ayanami0730/deep_research_bench/commits/main/)

Open commit details

[View commit history for this file.](https://github.com/Ayanami0730/deep_research_bench/commits/main/) 46 Commits

## Folders and files

| Name | Name | Last commit message | Last commit date |
| --- | --- | --- | --- |
| [data](https://github.com/Ayanami0730/deep_research_bench/tree/main/data "data") | [data](https://github.com/Ayanami0730/deep_research_bench/tree/main/data "data") | [feat: initial release of DeepResearch Bench v1.0](https://github.com/Ayanami0730/deep_research_bench/commit/214741e474a5347ea7f869ab79d27e7c8734ede7 "feat: initial release of DeepResearch Bench v1.0") | last yearJun 13, 2025 |
| [pics](https://github.com/Ayanami0730/deep_research_bench/tree/main/pics "pics") | [pics](https://github.com/Ayanami0730/deep_research_bench/tree/main/pics "pics") | [update pics & readme](https://github.com/Ayanami0730/deep_research_bench/commit/a3d154eba6787e8a83a29b3a24f473c3c348a3b1 "update pics & readme") | last yearAug 3, 2025 |
| [prompt](https://github.com/Ayanami0730/deep_research_bench/tree/main/prompt "prompt") | [prompt](https://github.com/Ayanami0730/deep_research_bench/tree/main/prompt "prompt") | [Switch official evaluator to GPT-5.5 (RACE) / GPT-5.4-mini (FACT)](https://github.com/Ayanami0730/deep_research_bench/commit/899d818a0827224d92dc25a4e36468fb8e2447c0 "Switch official evaluator to GPT-5.5 (RACE) / GPT-5.4-mini (FACT)  - utils/api.py: rewrite as OpenRouter + OpenAI-direct dual backend   (drop google.genai). Keep Model / FACT_Model / AIClient / call_model /   scrape_url surface so downstream code is unchanged. Adds stage-based   reasoning_effort (clean/score/fact -> low/medium/low) and metadata-aware   generate() returning (text, finish_reason) for the new cleaner. - utils/clean_article.py: token-aware pre-chunking (50k tokens, \n\n   boundary split), 25-way global LLM-call concurrency cap, exponential-   backoff retries with recursive-split fallback on output truncation,   task_ids filtering, .clean_failures.jsonl error log. - prompt/clean_prompt.py: chunk-aware cleaning prompts (zh + en),   explicit handling of reference-only fragments. - requirements.txt: drop google-genai. - README: rewrite NEWS — announce evaluator switch, publish judge-vs-human   alignment scores (GPT-5.5 71.82 / Gemini-3.1-Pro 70.58 / Claude-Opus-4-7   70.11, human baseline 68.78), migration plan (dual-acceptance until 31   May, full migration by 1 June), Pipeline v2 note. Rewrite API   Configuration section for OpenRouter + OpenAI backends.  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>") | 4 months agoMay 11, 2026 |
| [results](https://github.com/Ayanami0730/deep_research_bench/tree/main/results "results") | [results](https://github.com/Ayanami0730/deep_research_bench/tree/main/results "results") | [feat: initial release of DeepResearch Bench v1.0](https://github.com/Ayanami0730/deep_research_bench/commit/214741e474a5347ea7f869ab79d27e7c8734ede7 "feat: initial release of DeepResearch Bench v1.0") | last yearJun 13, 2025 |
| [utils](https://github.com/Ayanami0730/deep_research_bench/tree/main/utils "utils") | [utils](https://github.com/Ayanami0730/deep_research_bench/tree/main/utils "utils") | [docs: mention CLEAN\_Model API surface](https://github.com/Ayanami0730/deep_research_bench/commit/852f4022d1f98fb707222e395405136e8f0e8d52 "docs: mention CLEAN_Model API surface") | last weekSep 22, 2026 |
| [.gitignore](https://github.com/Ayanami0730/deep_research_bench/blob/main/.gitignore ".gitignore") | [.gitignore](https://github.com/Ayanami0730/deep_research_bench/blob/main/.gitignore ".gitignore") | [feat: initial release of DeepResearch Bench v1.0](https://github.com/Ayanami0730/deep_research_bench/commit/214741e474a5347ea7f869ab79d27e7c8734ede7 "feat: initial release of DeepResearch Bench v1.0") | last yearJun 13, 2025 |
| [LICENSE](https://github.com/Ayanami0730/deep_research_bench/blob/main/LICENSE "LICENSE") | [LICENSE](https://github.com/Ayanami0730/deep_research_bench/blob/main/LICENSE "LICENSE") | [Initial commit](https://github.com/Ayanami0730/deep_research_bench/commit/0e4bf50fcbbd0896fd208933d881ec53b174a657 "Initial commit") | last yearJun 13, 2025 |
| [README.md](https://github.com/Ayanami0730/deep_research_bench/blob/main/README.md "README.md") | [README.md](https://github.com/Ayanami0730/deep_research_bench/blob/main/README.md "README.md") | [Add GPT-5.6 Luna as cleaning model](https://github.com/Ayanami0730/deep_research_bench/commit/636f8eedba76965551a752b9a824e6177a2ba2bd "Add GPT-5.6 Luna as cleaning model") | 3 weeks agoSep 9, 2026 |
| [deepresearch\_bench\_race.py](https://github.com/Ayanami0730/deep_research_bench/blob/main/deepresearch_bench_race.py "deepresearch_bench_race.py") | [deepresearch\_bench\_race.py](https://github.com/Ayanami0730/deep_research_bench/blob/main/deepresearch_bench_race.py "deepresearch_bench_race.py") | [Add GPT-5.6 Luna as cleaning model](https://github.com/Ayanami0730/deep_research_bench/commit/636f8eedba76965551a752b9a824e6177a2ba2bd "Add GPT-5.6 Luna as cleaning model") | 3 weeks agoSep 9, 2026 |
| [requirements.txt](https://github.com/Ayanami0730/deep_research_bench/blob/main/requirements.txt "requirements.txt") | [requirements.txt](https://github.com/Ayanami0730/deep_research_bench/blob/main/requirements.txt "requirements.txt") | [Switch official evaluator to GPT-5.5 (RACE) / GPT-5.4-mini (FACT)](https://github.com/Ayanami0730/deep_research_bench/commit/899d818a0827224d92dc25a4e36468fb8e2447c0 "Switch official evaluator to GPT-5.5 (RACE) / GPT-5.4-mini (FACT)  - utils/api.py: rewrite as OpenRouter + OpenAI-direct dual backend   (drop google.genai). Keep Model / FACT_Model / AIClient / call_model /   scrape_url surface so downstream code is unchanged. Adds stage-based   reasoning_effort (clean/score/fact -> low/medium/low) and metadata-aware   generate() returning (text, finish_reason) for the new cleaner. - utils/clean_article.py: token-aware pre-chunking (50k tokens, \n\n   boundary split), 25-way global LLM-call concurrency cap, exponential-   backoff retries with recursive-split fallback on output truncation,   task_ids filtering, .clean_failures.jsonl error log. - prompt/clean_prompt.py: chunk-aware cleaning prompts (zh + en),   explicit handling of reference-only fragments. - requirements.txt: drop google-genai. - README: rewrite NEWS — announce evaluator switch, publish judge-vs-human   alignment scores (GPT-5.5 71.82 / Gemini-3.1-Pro 70.58 / Claude-Opus-4-7   70.11, human baseline 68.78), migration plan (dual-acceptance until 31   May, full migration by 1 June), Pipeline v2 note. Rewrite API   Configuration section for OpenRouter + OpenAI backends.  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>") | 4 months agoMay 11, 2026 |
| [run\_benchmark.sh](https://github.com/Ayanami0730/deep_research_bench/blob/main/run_benchmark.sh "run_benchmark.sh") | [run\_benchmark.sh](https://github.com/Ayanami0730/deep_research_bench/blob/main/run_benchmark.sh "run_benchmark.sh") | [feat: initial release of DeepResearch Bench v1.0](https://github.com/Ayanami0730/deep_research_bench/commit/214741e474a5347ea7f869ab79d27e7c8734ede7 "feat: initial release of DeepResearch Bench v1.0") | last yearJun 13, 2025 |
| [setup.py](https://github.com/Ayanami0730/deep_research_bench/blob/main/setup.py "setup.py") | [setup.py](https://github.com/Ayanami0730/deep_research_bench/blob/main/setup.py "setup.py") | [feat: initial release of DeepResearch Bench v1.0](https://github.com/Ayanami0730/deep_research_bench/commit/214741e474a5347ea7f869ab79d27e7c8734ede7 "feat: initial release of DeepResearch Bench v1.0") | last yearJun 13, 2025 |
| View all files |

## Repository files navigation

# DeepResearch Bench: A Comprehensive Benchmark for Deep Research Agents

[Permalink: DeepResearch Bench: A Comprehensive Benchmark for Deep Research Agents](https://github.com/Ayanami0730/deep_research_bench#deepresearch-bench-a-comprehensive-benchmark-for-deep-research-agents)

[![license](https://camo.githubusercontent.com/7e581a87fd708b251c8ba9491b40f0f5bc93390b65860d5183ec7112c9bb0c23/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f436f64655f4c6963656e73652d4d49542d626c7565)](https://github.com/Ayanami0730/deep_research_bench/blob/main/LICENSE)[![website](https://camo.githubusercontent.com/d6c49bd6610134f710c747d5c0b4539dd1fdd399aef51c5fadb7701cbfb4dd5f/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f576562736974652d4465657052657365617263682d677265656e)](https://deepresearch-bench.github.io/)[![Dataset](https://camo.githubusercontent.com/120f84c965c315a2b353999bd0fd38b40238811419c6bcbcd0b0d9e3c96e4a99/68747470733a2f2f696d672e736869656c64732e696f2f62616467652ff09fa497253230446174617365742d6f72616e67653f636f6c6f723d464636463030)](https://huggingface.co/datasets/muset-ai/DeepResearch-Bench-Dataset)[![Leaderboard](https://camo.githubusercontent.com/817d7392b0da327e2be587c213dfcae100c6389f0bbf3fe3734ba1c50bdc9bd9/68747470733a2f2f696d672e736869656c64732e696f2f62616467652ff09f8f862532304c6561646572626f6172642d79656c6c6f773f636f6c6f723d464644373030)](https://huggingface.co/spaces/muset-ai/DeepResearch-Bench-Leaderboard)[![Hugging Face](https://camo.githubusercontent.com/2022e3b54b48ca773f38907eb0dfb1edfe9f74f8edb23180dfd51d375f0ed999/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f25463025394625413425393725323048756767696e67253230466163652d626c75653f636f6c6f723d384132424532)](https://huggingface.co/spaces/Ayanami0730/DeepResearch-Leaderboard)[![](https://camo.githubusercontent.com/cb88abbfdf4341751a3b4790d7e8c07611ba3e0dd90ecd23c697856a6f63fda7/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f61725869762d6235323132662e7376673f6c6f676f3d6172786976)](https://arxiv.org/abs/2506.11763)[![AGI-Eval](https://camo.githubusercontent.com/1ec80b557475a048a5017e54b2848d85cf1fa389eaeb6654d0384951a412db1e/68747470733a2f2f696d672e736869656c64732e696f2f62616467652ff09fa49d2532304147492d2d4576616c2d707572706c653f636f6c6f723d383536396636)](https://agi-eval.cn/evaluation/detail?id=67)

##### If you like our project, please give us a star ⭐ on GitHub for the latest update.

[Permalink:  If you like our project, please give us a star ⭐ on GitHub for the latest update.](https://github.com/Ayanami0730/deep_research_bench#-if-you-like-our-project-please-give-us-a-star--on-github-for-the-latest-update)

# ✨ News

[Permalink: ✨ News](https://github.com/Ayanami0730/deep_research_bench#-news)

- \[11 May 2026\] 🎯 **Official Evaluator Switched to GPT-5.5**: Following Google's announced June 17, 2026 deprecation of Gemini-2.5-Pro, we benchmarked three frontier reasoning models as candidate replacements on the human-annotated subset (50 tasks × 4 target DRAs = 200 articles), measuring each candidate's alignment with human judgments (human inter-annotator agreement baseline = **68.78%**). All three candidates exceed this baseline by 1.3–3 points; **GPT-5.5 wins on Overall, PAR, and FAS**. We are adopting it as the new RACE evaluator (with **GPT-5.4-mini** for the FACT pipeline). Scores:



| Candidate evaluator | Overall ↑ | PAR | OPC | FAP | FAS |
| --- | --- | --- | --- | --- | --- |
| **GPT-5.5** 🥇 | **71.82** | **73.00** | 89.70 | 65.35 | **59.23** |
| Gemini-3.1-Pro | 70.58 | 71.33 | **90.14** | 65.39 | 55.45 |
| Claude-Opus-4-7 | 70.11 | 71.00 | 86.76 | **66.70** | 55.99 |

- \[11 May 2026\] 📢 **Leaderboard Migration Plan**:


> - **Now – 31 May 2026 (dual-acceptance window)**: We accept submissions evaluated under **both** the legacy evaluator (Gemini-2.5-Pro) **and** the new one (GPT-5.5). Results are displayed on **two separate leaderboards** so the rankings remain directly comparable within each evaluator.
>   - **By 1 June 2026 (full migration)**: For the results reported in the original DRB paper, we will re-evaluate them under GPT-5.5 and migrate them to the new leaderboard automatically. For prior community submissions evaluated under Gemini-2.5-Pro, if you would like to keep your entry on the new leaderboard, please contact us per [Submit to Leaderboard](https://github.com/Ayanami0730/deep_research_bench#submit-to-leaderboard) and re-submit following the updated requirements. New submitters: follow the keys / config in [API Configuration](https://github.com/Ayanami0730/deep_research_bench#api-configuration) below. After 1 June, Gemini-2.5-Pro acceptance ends and only the GPT-5.5 leaderboard is maintained going forward.
>   - **GPT-5.5 leaderboard status**: still under construction — expected to launch within a week, alongside the migrated scores.
>   - **Legacy code**: the previous Gemini-2.5-Pro / Gemini-2.5-Flash evaluation code is preserved on the [`Gemini-2.5`](https://github.com/Ayanami0730/deep_research_bench/tree/Gemini-2.5) branch.

- \[11 May 2026\] 🔧 **Evaluation Pipeline v2**: In the new release we have refined the article-cleaning logic, using a chunk-based strategy to better support very long articles.

- \[6 Feb 2026\] 🚀 **DeepResearch Bench II Release**: We have released **DeepResearch Bench II (DRB II)** ( [homepage](https://agentresearchlab.org/benchmarks/deepresearch-bench-ii/index.html#home) ｜ [repo](https://github.com/imlrz/DeepResearch-Bench-II) ｜ [paper](https://arxiv.org/abs/2601.08536)). We welcome you to evaluate and exchange ideas. Note that DRB II, as a follow-up to DRB, has a different evaluation focus from DRB; **DRB will continue to be maintained and updated** after the release of DRB II. For more details, please refer to the [DRB II paper](https://arxiv.org/abs/2601.08536).

- \[6 Feb 2026\] 📚 **New Papers from Our Lab**: We welcome you to check out the new papers from our lab ( [Agent Research Lab](https://agentresearchlab.org/index.html)):


  - **Benchmarks**:

    - [DeepResearch Bench II](https://arxiv.org/abs/2601.08536): Evaluates DRA-generated reports with 9,430 fine-grained binary rubrics (information recall, analysis, presentation) derived from expert-written articles.
    - [Wiki Live Challenge](https://arxiv.org/abs/2602.01590): A live benchmark that uses Wikipedia Good Articles as expert-level references, with fine-grained criteria for writing quality and factual verifiability.
    - [WildGraphBench](https://arxiv.org/abs/2602.02053): Benchmarks GraphRAG on long, heterogeneous documents with 1,100 questions spanning single-fact QA, multi-fact QA, and section-level summarization.
  - **Agents**:

    - [A-RAG](https://arxiv.org/abs/2602.03442): An agentic RAG framework that exposes hierarchical retrieval interfaces (keyword search, semantic search, chunk read) to the model for adaptive multi-granularity retrieval.
    - [FS-Researcher](https://arxiv.org/abs/2602.01566): A file-system-based dual-agent framework (Context Builder + Report Writer) that scales deep research beyond the context window via a persistent knowledge base.

**If you want to evaluate your deep research agent** please see the leaderboard submission requirements below and contact us at [dumingxuan@mail.ustc.edu.cn](mailto:dumingxuan@mail.ustc.edu.cn) and [imlrz@mail.ustc.edu.cn](mailto:imlrz@mail.ustc.edu.cn).

- \[18 July 2025\] 🎉 We have established a partnership with **AGI-Eval** platform. DeepResearch Bench is now available on [**AGI-Eval**](https://agi-eval.cn/evaluation/detail?id=67), providing a more convenient evaluation interface for researchers and practitioners to test their deep research agents.

- \[15 July 2025\] ⚡️⚡️ **Major Update**: Added comprehensive evaluation of **Kimi-Researcher**, **Doubao-DeepResearch**, and **Claude-Researcher**. Upgraded evaluation infrastructure with **Gemini-2.5-Pro** for RACE and **Gemini-2.5-Flash** for FACT evaluation (since superseded — see top of News). All raw research articles and evaluation scores are now available on our [**Hugging Face Leaderboard**](https://huggingface.co/spaces/Ayanami0730/DeepResearch-Leaderboard) for comprehensive analysis and comparison.


For detailed evaluation results and comprehensive comparisons, please refer to the evaluation results table below.

## 📖 Overview

[Permalink: 📖 Overview](https://github.com/Ayanami0730/deep_research_bench#-overview)

DeepResearch Bench addresses the absence of a comprehensive benchmark for systematically evaluating Deep Research Agents (DRAs). Our benchmark consists of **100 PhD-level research tasks**, each meticulously crafted by domain experts across **22 distinct fields**, including:

- 🔬 **Science & Technology**: Physics, chemistry, biology, environmental science, and engineering
- 💼 **Finance & Business**: investments, personal finance, marketing, and human resources
- 💻 **Software**: Topics related to the use of software and the internet
- 🌍 **Others**: Art & Design, Entertainment, History, Industrial, Transportation, Travel, and more

## Benchmark Construction

[Permalink: Benchmark Construction](https://github.com/Ayanami0730/deep_research_bench#benchmark-construction)

### Topic Distribution Analysis

[Permalink: Topic Distribution Analysis](https://github.com/Ayanami0730/deep_research_bench#topic-distribution-analysis)

To ensure DeepResearch Bench reflects real-world research demands, we analyzed **96,147 anonymized user queries** from web search-enabled LLM interactions.These queries were classified into **22 topic domains** based on the WebOrganizer taxonomy, revealing the authentic distribution of human deep research needs across different fields.

### Expert Task Collection

[Permalink: Expert Task Collection](https://github.com/Ayanami0730/deep_research_bench#expert-task-collection)

Guided by real-world demand distribution, we invited **PhD-level experts and senior practitioners** (5+ years experience) to design challenging research tasks within their domains. Each submission underwent rigorous manual screening for:

- **Quality**: High research standards and complexity
- **Clarity**: Clear task definitions and requirements
- **Authenticity**: Grounded in real research scenarios
- **Challenge Level**: Testing upper limits of DRA capabilities

This process yielded **100 high-quality benchmark tasks** (50 Chinese, 50 English) that maintain the same topical balance as observed in real-world usage.

## Evaluation Framework

[Permalink: Evaluation Framework](https://github.com/Ayanami0730/deep_research_bench#evaluation-framework)

[![Framework Overview](https://github.com/Ayanami0730/deep_research_bench/raw/main/pics/framework.png)](https://github.com/Ayanami0730/deep_research_bench/blob/main/pics/framework.png)

DeepResearch Bench introduces two complementary evaluation methodologies designed to comprehensively assess Deep Research Agents:

### 🎯 RACE (Reference-based Adaptive Criteria-driven Evaluation)

[Permalink: 🎯 RACE (Reference-based Adaptive Criteria-driven Evaluation)](https://github.com/Ayanami0730/deep_research_bench#-race-reference-based-adaptive-criteria-driven-evaluation)

RACE evaluates **report generation quality** through a sophisticated multi-step process:

- **Dynamic Criteria Generation**: Automatically generates task-specific evaluation criteria across four key dimensions:
  - 📚 **Comprehensiveness**: Coverage breadth and depth of the research topic
  - 🔍 **Insight/Depth**: Quality of analysis and insight generation
  - 📋 **Instruction-Following**: Adherence to specific task requirements
  - 📖 **Readability**: Clarity, organization, and presentation quality
- **Reference-Based Scoring**: Compares target reports against high-quality reference reports to ensure discriminative evaluation

- **Weighted Assessment**: Uses dynamic weights adapted to each task's specific requirements


### 🔗 FACT (Framework for Factual Abundance and Citation Trustworthiness)

[Permalink: 🔗 FACT (Framework for Factual Abundance and Citation Trustworthiness)](https://github.com/Ayanami0730/deep_research_bench#-fact-framework-for-factual-abundance-and-citation-trustworthiness)

FACT evaluates **information retrieval and grounding capabilities** through:

- **Statement-URL Extraction**: Automatically extracts factual claims and their cited sources from generated reports
- **Deduplication**: Removes redundant statement-URL pairs to focus on unique factual claims
- **Support Verification**: Uses web scraping and LLM judgment to verify whether cited sources actually support the claims
- **Citation Metrics**: Calculates:

  - **Citation Accuracy**: Percentage of correctly supported citations
  - **Effective Citations**: Average number of verifiably supported citations per task

## 📊 Evaluation Results

[Permalink: 📊 Evaluation Results](https://github.com/Ayanami0730/deep_research_bench#-evaluation-results)

### Main Results

[Permalink: Main Results](https://github.com/Ayanami0730/deep_research_bench#main-results)

**View Latest Leaderboard**: Visit our [**DeepResearch Bench Leaderboard**](https://huggingface.co/spaces/muset-ai/DeepResearch-Bench-Leaderboard) for real-time updated evaluation results, detailed comparative analysis, and raw data.

### Submit to Leaderboard

[Permalink: Submit to Leaderboard](https://github.com/Ayanami0730/deep_research_bench#submit-to-leaderboard)

If you would like to obtain an **official leaderboard entry** on DeepResearch Bench, please prepare the following materials and send them by email to:

- `dumingxuan@mail.ustc.edu.cn`
- `imlrz@mail.ustc.edu.cn`

**Required submission materials:**

1. **A temporary key with access to GPT-5.5**
   - This key is used only for verification/evaluation.
   - It should remain valid during the evaluation window.
   - Supported providers:
     - OpenAI (official)
     - OpenRouter
2. **The raw generated articles**
   - Please provide your model outputs in the same format as the benchmark raw data.
   - Reference example:
     - [`data/test_data/raw_data/claude-3-7-sonnet-latest.jsonl`](https://github.com/Ayanami0730/deep_research_bench/blob/main/data/test_data/raw_data/claude-3-7-sonnet-latest.jsonl)
3. **Reproducibility link**
   - If your model/agent is **open-source**, please provide a repository link that allows others to reproduce the results.
   - If your model/agent is **closed-source**, please provide the product page and/or API link used for reproduction and verification.
4. **Model metadata**
   - **Model name**
   - **Model/project link**
   - **Open-source license** (for open-source submissions; if closed-source, please clearly indicate that it is proprietary)

**Recommended additional files:**

- `results/race/<model_name>/race_result.txt`
- `results/fact/<model_name>/fact_result.txt`

Providing these files can help us speed up verification, but the raw generated reports and the temporary evaluation key are the most important requirements.

* * *

## 🛠️ Installation and Usage

[Permalink: 🛠️ Installation and Usage](https://github.com/Ayanami0730/deep_research_bench#%EF%B8%8F-installation-and-usage)

### Prerequisites

[Permalink: Prerequisites](https://github.com/Ayanami0730/deep_research_bench#prerequisites)

- Python 3.9+
- OpenRouter or OpenAI API key (for LLM evaluation)
- Jina API key (for web scraping in FACT evaluation)

### Setup

[Permalink: Setup](https://github.com/Ayanami0730/deep_research_bench#setup)

```
git clone https://github.com/your-username/deep_research_bench.git
cd deep_research_bench
pip install -r requirements.txt
```

### API Configuration

[Permalink: API Configuration](https://github.com/Ayanami0730/deep_research_bench#api-configuration)

Set the required API keys as environment variables:

```
# Pick one backend. OpenRouter is the default.
export LLM_BACKEND="openrouter"               # or "openai"

# OpenRouter (default):
export OPENROUTER_API_KEY="sk-or-v1-xxxxx"

# Or OpenAI direct:
# export LLM_BACKEND="openai"
# export OPENAI_API_KEY="sk-xxxxx"

# Set Jina API key for web scraping (FACT pipeline only)
export JINA_API_KEY="your_jina_api_key_here"
```

Default models per backend (override with `RACE_MODEL`, `CLEAN_MODEL`, and `FACT_MODEL` env vars):

| Backend | RACE judge (`Model`) | RACE cleaner (`CLEAN_Model`) | FACT judge (`FACT_Model`) |
| --- | --- | --- | --- |
| openrouter | `openai/gpt-5.5` | `openai/gpt-5.6-luna` | `openai/gpt-5.4-mini` |
| openai | `gpt-5.5` | `gpt-5.6-luna` | `gpt-5.4-mini` |

## Project Structure

[Permalink: Project Structure](https://github.com/Ayanami0730/deep_research_bench#project-structure)

```
deep_research_bench/
├── data/
│   ├── criteria_data/      # Evaluation criteria data
│   ├── prompt_data/
│   │   └── query.jsonl     # ← 100 benchmark queries for your agent
│   └── test_data/
│       ├── cleaned_data/   # Cleaned article data
│       └── raw_data/       # ← Put your model outputs here (model_name.jsonl)
├── prompt/                 # Prompt templates
├── utils/                  # Utility functions
├── deepresearch_bench_race.py  # RACE evaluation script
├── run_benchmark.sh        # ← Add your model names here, then run
└── requirements.txt        # Dependencies
```

**Quick Start Flow:**

1. Use queries from `data/prompt_data/query.jsonl` → Run your Deep Research Agent
2. Save outputs to `data/test_data/raw_data/<model_name>.jsonl`
3. Add model name to `TARGET_MODELS` in `run_benchmark.sh`
4. Run: `bash run_benchmark.sh`

## Quick Start

[Permalink: Quick Start](https://github.com/Ayanami0730/deep_research_bench#quick-start)

### 1\. Prepare Your Model Data

[Permalink: 1. Prepare Your Model Data](https://github.com/Ayanami0730/deep_research_bench#1-prepare-your-model-data)

Run your Deep Research Agent on the benchmark queries and save outputs in the required format:

**Input**: Use queries from `data/prompt_data/query.jsonl` (100 benchmark tasks)

**Output**: Save results to `data/test_data/raw_data/<model_name>.jsonl`

**Required format** (each line should contain):

```
{
    "id": "task_id",
    "prompt": "original_query_text",
    "article": "generated_research_article_with_citations"
}
```

### 2\. Configure Models to Evaluate

[Permalink: 2. Configure Models to Evaluate](https://github.com/Ayanami0730/deep_research_bench#2-configure-models-to-evaluate)

Edit `run_benchmark.sh` and add your model name:

```
TARGET_MODELS=("your-model-name")
```

### 3\. Run Evaluation

[Permalink: 3. Run Evaluation](https://github.com/Ayanami0730/deep_research_bench#3-run-evaluation)

```
bash run_benchmark.sh
```

Results will be saved to:

- RACE evaluation: `results/race/<model_name>/race_result.txt`
- FACT evaluation: `results/fact/<model_name>/fact_result.txt`

### Custom LLM Integration

[Permalink: Custom LLM Integration](https://github.com/Ayanami0730/deep_research_bench#custom-llm-integration)

If you're not using OpenRouter or the official OpenAI API, or want to use other LLMs for evaluation, modify the `AIClient` class in `utils/api.py` to implement your custom LLM interface.

## Acknowledgements

[Permalink: Acknowledgements](https://github.com/Ayanami0730/deep_research_bench#acknowledgements)

We would like to express our gratitude to the following contributors who helped us collect evaluation data. Since many models and agents do not provide public APIs, manual data collection was necessary, and we deeply appreciate their dedicated efforts:

**Xin Yang**, **Jie Yang**, **Yawen Li**, **Xinyu Ouyang**, **Jiaqi He**, **Gefan Zhang**, **Jinfu Liao**, **Qiuyue Chen**, **Yulin Wang**, and **Lina Wang**.

Their contributions were essential to the comprehensive evaluation presented in this benchmark.

## Citation

[Permalink: Citation](https://github.com/Ayanami0730/deep_research_bench#citation)

If you use DeepResearch Bench in your research, please cite our paper:

```
@article{du2025deepresearch,
  author    = {Mingxuan Du and Benfeng Xu and Chiwei Zhu and Xiaorui Wang and Zhendong Mao},
  title     = {DeepResearch Bench: A Comprehensive Benchmark for Deep Research Agents},
  journal   = {arXiv preprint},
  year      = {2025},
}
```

## About

DeepResearch Bench: A Comprehensive Benchmark for Deep Research Agents

[arxiv.org/pdf/2506.11763](https://arxiv.org/pdf/2506.11763)

### Topics

[agent](https://github.com/topics/agent) [benchmark](https://github.com/topics/benchmark) [deepresearch](https://github.com/topics/deepresearch) [nlp](https://github.com/topics/nlp)

### Resources

[Readme](https://github.com/Ayanami0730/deep_research_bench#readme-ov-file)

[Apache-2.0 license](https://github.com/Ayanami0730/deep_research_bench#Apache-2.0-1-ov-file)

[Activity](https://github.com/Ayanami0730/deep_research_bench/activity)

### Stars

**835** stars

### Watchers

**3** watching

### Forks

[**86** forks](https://github.com/Ayanami0730/deep_research_bench/forks)

[Report repository](https://github.com/contact/report-content?content_url=https%3A%2F%2Fgithub.com%2FAyanami0730%2Fdeep_research_bench&report=Ayanami0730+%28user%29)

## Releases

## Packages

## Contributors

## Languages

You can’t perform that action at this time.
