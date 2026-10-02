---
url: https://arxiv.org/html/2605.06635v1
retrieved: 2026-10-02
command: firecrawl scrape https://arxiv.org/html/2605.06635v1 --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents
---
Title:

Content selection saved. Describe the issue below:

Description:

![](https://arxiv.org/static/base/1.0.1/images/icons/smileybones-small.svg)arXiv is now an independent nonprofit! [Learn more](https://info.arxiv.org/about) ×

[License: CC BY 4.0](https://info.arxiv.org/help/license/index.html#licenses-available)

arXiv:2605.06635v1 \[cs.CL\] 07 May 2026

# Cited but Not Verified: Parsing and Evaluating    Source Attribution in LLM Deep Research Agents

Hailey Onweller\*Elias Lumer
Austin Huber
Affiliation: Pia RamchandaniVamse Kumar Subbiah
Corey Feld
Affiliation: Commercial Technology and Innovation Office, PricewaterhouseCoopers, U.S.

###### Abstract

Large language models (LLMs) power deep research agents that synthesize information from hundreds of web sources into cited reports, yet these citations cannot be reliably verified. Current approaches either trust models to self-cite accurately, risking bias, or employ retrieval-augmented generation (RAG) that does not validate source accessibility, relevance, or factual consistency. We introduce the first source attribution evaluation framework that uses a reproducible AST parser to extract and evaluate inline citations from LLM-generated Markdown reports at scale. Unlike methods that verify claims in isolation, our framework closes the loop by retrieving the actual cited content, enabling human or model evaluators to judge each citation against its source. Citations are evaluated along three dimensions. (1) Link Works verifies URL accessibility, (2) Relevant Content measures topical alignment, and (3) Fact Check validates factual accuracy against source content. We benchmark 14 closed-source and open-source LLMs across three evaluation dimensions using rubric-based LLM-as-a-judge evaluators calibrated through human review. Our results reveal that even the strongest frontier models maintain link validity above 94% and relevance above 80%, yet achieve only 39–77% factual accuracy, while fewer than half of open-source models successfully generate cited reports in a one-shot setting. Ablation studies on research depth show that Fact Check accuracy drops by approximately 42% on average across two frontier models as tool calls scale from 2 to 150, demonstrating that more retrieval does not produce more accurate citations. These findings reveal a critical disconnect between surface-level citation quality and factual reliability, and our framework provides the evaluation infrastructure to assess the disconnect.

|     |
| --- |
|  |

## 1 Introduction

Deep research agents powered by Large Language Models (LLMs) now synthesize information from hundreds of web sources into comprehensive reports with inline citations, enabling systems such as Perplexity AI, ChatGPT with web search, and Google Gemini to promise verifiable research at scale ( [Perplexity AI, 2024](https://arxiv.org/html/2605.06635v1#bib.bib1 ""); [OpenAI, 2024](https://arxiv.org/html/2605.06635v1#bib.bib2 "")). However, the citations these agents produce cannot be reliably verified. Current approaches either trust models to self-cite accurately, risking hallucinated or misattributed references ( [Ravichander et al., 2025](https://arxiv.org/html/2605.06635v1#bib.bib6 "")), or employ retrieval-augmented generation (RAG) that does not validate whether cited sources are accessible, topically relevant, or factually consistent with the claims they support ( [Lewis et al., 2020](https://arxiv.org/html/2605.06635v1#bib.bib4 ""); [Lumer et al., 2025a](https://arxiv.org/html/2605.06635v1#bib.bib30 ""); [Gulati et al., 2026b](https://arxiv.org/html/2605.06635v1#bib.bib32 "")). Recent studies have documented citation hallucination rates ranging from 11% to 57% across commercially deployed models ( [Yuan et al., 2026](https://arxiv.org/html/2605.06635v1#bib.bib5 "")), yet no existing framework evaluates citation quality beyond binary attribution verification. This gap between deployment scale and evaluation rigor raises a critical question. How reliable are the citations that millions of users encounter daily in LLM-generated research?

Despite growing recognition of this problem, existing evaluation approaches remain insufficient. Benchmarks such as AttributionBench ( [Li et al., 2024](https://arxiv.org/html/2605.06635v1#bib.bib7 "")), CiteME ( [Press et al., 2024](https://arxiv.org/html/2605.06635v1#bib.bib8 "")), and CiteEval ( [Xu et al., 2025](https://arxiv.org/html/2605.06635v1#bib.bib9 "")) focus on binary attribution classification, citation matching, or paradigm comparison, while CiteAudit ( [Yuan et al., 2026](https://arxiv.org/html/2605.06635v1#bib.bib5 "")) targets fabricated references in scientific writing. Three critical gaps persist. (1) No end-to-end framework combines citation extraction with multi-dimensional quality assessment across URL accessibility, topical relevance, and factual accuracy, (2) no systematic comparison exists across major LLM providers in deep research settings, and (3) the relationship between search depth and citation quality remains unexplored. These gaps motivate the following research questions.

> To what extent do frontier LLMs produce factually accurate citations, and does surface-level citation quality (link validity, topical relevance) mask deeper factual failures? How does increasing search depth affect citation quality across these dimensions?

To address these questions, we introduce a source attribution evaluation framework that extracts and evaluates inline citations from LLM-generated Markdown reports at scale. As illustrated in Figure [1](https://arxiv.org/html/2605.06635v1#S1.F1 "Figure 1 ‣ 1 Introduction ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents"), the framework operates as a three-stage pipeline. First, a Markdown Abstract Syntax Tree (AST) parser structurally extracts citation-claim pairs without requiring LLM inference. Second, each cited URL is retrieved and its content extracted. Third, three complementary evaluators assess citation quality. (1) Link Works verifies URL accessibility, (2) Relevant Content measures topical alignment via LLM-as-a-judge, and (3) Fact Check validates factual accuracy against retrieved source content via LLM-as-a-judge calibrated through human review.

![Refer to caption](https://arxiv.org/html/2605.06635v1/figure1.png)Figure 1: Source attribution evaluation framework. A deep research agent generates Markdown reports with inline citations, which are parsed via a Markdown AST parser to extract citation-claim pairs. Each pair is evaluated on Link Works (URL accessibility), Relevant Content (topical alignment), and Fact Check (factual accuracy).

We benchmark 14 LLMs spanning open-source and closed-source frontier models across diverse research queries. Our evaluation reveals three key findings. First, even the strongest frontier models maintain link validity above 94% and content relevance above 80%, yet achieve only 39–77% factual accuracy, exposing a critical disconnect between surface-level citation quality and factual reliability. Second, fewer than half of open-source models successfully generate cited reports (17–40% task success), compared to 83–100% for frontier models. Third, our ablation study across two models demonstrates that Fact Check accuracy drops approximately 42% on average as search depth scales from 2 to 150 tool calls, while Link Works and Relevant Content remain stable, suggesting that information overload impairs factual synthesis rather than improving it.

We make the following contributions:

- •


We introduce the first end-to-end source attribution evaluation framework that combines deterministic citation extraction with multi-dimensional quality assessment across link accessibility, topical relevance, and factual accuracy.

- •


We benchmark 14 LLMs across three major providers and open-source alternatives, revealing that factual accuracy is the most challenging and differentiating dimension of citation quality.

- •


We demonstrate through ablation studies that increased search depth consistently degrades factual accuracy while surface-level citation metrics remain stable, providing evidence for an information overload effect in LLM research synthesis.


## 2 Related work

### 2.1 Attributed generation and deep research systems

LLMs can generate responses with inline citations through web search integration and retrieval-augmented generation (RAG) ( [Lewis et al., 2020](https://arxiv.org/html/2605.06635v1#bib.bib4 "")). Commercial deep research systems such as Perplexity AI, ChatGPT with web search, and Google Gemini with grounding have made citation-generating LLMs widely accessible ( [Perplexity AI, 2024](https://arxiv.org/html/2605.06635v1#bib.bib1 ""); [OpenAI, 2024](https://arxiv.org/html/2605.06635v1#bib.bib2 ""); [Lumer et al., 2026](https://arxiv.org/html/2605.06635v1#bib.bib28 ""); [Lumer et al., 2025d](https://arxiv.org/html/2605.06635v1#bib.bib25 "")). Model providers have also introduced API-level citation support, such as Anthropic’s Citations API, which returns structured references with character-level provenance to source documents ( [Anthropic, 2025](https://arxiv.org/html/2605.06635v1#bib.bib14 "")). However, these features focus on citation generation rather than citation evaluation. Research on attributed generation has explored both generation-time approaches that produce citations during output ( [Gao et al., 2023b](https://arxiv.org/html/2605.06635v1#bib.bib15 ""); [Slobodkin et al., 2024](https://arxiv.org/html/2605.06635v1#bib.bib16 "")) and post-hoc methods that add citations after text generation ( [Gao et al., 2023a](https://arxiv.org/html/2605.06635v1#bib.bib17 "")). [Wan et al. (2025)](https://arxiv.org/html/2605.06635v1#bib.bib18 "") introduce a modular framework that decomposes attributed generation into executable programs, achieving fine-grained sentence-level attribution. [Wang et al. (2025b)](https://arxiv.org/html/2605.06635v1#bib.bib19 "") propose a unified generation-retrieval model for academic writing that dynamically triggers citation retrieval during text generation. Despite these advances, citation hallucination rates of 11–57% persist across commercially deployed models ( [Yuan et al., 2026](https://arxiv.org/html/2605.06635v1#bib.bib5 "")), and citations may link to inaccessible URLs, reference irrelevant content, or misrepresent source claims ( [Ravichander et al., 2025](https://arxiv.org/html/2605.06635v1#bib.bib6 "")). Unlike these works, which focus on improving citation generation, our work focuses on evaluating the quality of citations already produced by deployed systems.

### 2.2 Attribution evaluation benchmarks

Several benchmarks have been developed for evaluating LLM-generated attributions. AttributionBench ( [Li et al., 2024](https://arxiv.org/html/2605.06635v1#bib.bib7 "")) provides a benchmark for automatic binary attribution classification, finding that even fine-tuned GPT-3.5 achieves only 80% macro-F1. CiteME ( [Press et al., 2024](https://arxiv.org/html/2605.06635v1#bib.bib8 "")) evaluates citation matching in academic contexts, revealing that LLMs achieve only 4–18% accuracy on identifying correct papers to cite. CiteEval ( [Xu et al., 2025](https://arxiv.org/html/2605.06635v1#bib.bib9 "")) goes beyond NLI-based approaches by conducting fine-grained citation assessment across full retrieval contexts. CiteGuard ( [Choi et al., 2025](https://arxiv.org/html/2605.06635v1#bib.bib10 "")) reframes citation evaluation as attribution alignment, achieving 68% accuracy on CiteME through retrieval-aware verification. RefChecker ( [Hu et al., 2024](https://arxiv.org/html/2605.06635v1#bib.bib11 "")) presents a claim-triplet framework for fine-grained hallucination detection, while CiteAudit ( [Yuan et al., 2026](https://arxiv.org/html/2605.06635v1#bib.bib5 "")) addresses fabricated references in scientific writing through multi-agent verification. Most recently, [Saxena et al. (2025)](https://arxiv.org/html/2605.06635v1#bib.bib12 "") compare generation-time versus post-hoc citation paradigms, finding a consistent trade-off between coverage and correctness. [Seo et al. (2025)](https://arxiv.org/html/2605.06635v1#bib.bib20 "") evaluate fact verifiers across 14 benchmarks and find that annotation ambiguity substantially affects model rankings, highlighting the importance of careful benchmark design for evaluation tasks. While these works advance attribution evaluation, they primarily address binary verification, citation matching, or paradigm comparison. Our framework differs by evaluating citations across three complementary quality dimensions simultaneously and by targeting live web citations in deep research contexts rather than controlled document sets.

### 2.3 LLM-as-a-judge for evaluation

The use of LLMs as automated evaluators has gained significant attention as an alternative to costly human annotation ( [Zheng et al., 2023](https://arxiv.org/html/2605.06635v1#bib.bib21 "")). However, research has revealed systematic biases in LLM judges, including position bias, verbosity bias, and self-enhancement effects ( [Wang et al., 2024](https://arxiv.org/html/2605.06635v1#bib.bib22 ""); [Ye et al., 2025](https://arxiv.org/html/2605.06635v1#bib.bib23 "")). [Wang et al. (2025a)](https://arxiv.org/html/2605.06635v1#bib.bib24 "") demonstrate that even Large Reasoning Models remain susceptible to evaluation biases despite advanced reasoning capabilities. These findings are directly relevant to our framework, which relies on LLM-as-a-judge evaluators for the Relevant Content and Fact Check dimensions. To mitigate potential judge biases, we calibrate our evaluators through human review and employ rubric-based scoring that constrains evaluation to specific factual criteria rather than open-ended quality assessment. Our work extends the LLM-as-a-judge paradigm from general text evaluation to the specific task of source attribution verification, where the evaluator must assess whether a claim is supported by retrieved source content rather than judging overall response quality.

## 3 Methodology

### 3.1 Overview

Our framework evaluates source attribution quality in LLM-generated research responses through a three-stage pipeline (Figure [1](https://arxiv.org/html/2605.06635v1#S1.F1 "Figure 1 ‣ 1 Introduction ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents")). First, a deep research agent generates a comprehensive Markdown report with inline citations for a given query. Second, a Markdown Abstract Syntax Tree (AST) parser structurally extracts citation-claim pairs without requiring LLM inference. Third, three complementary evaluators assess each citation along distinct quality dimensions. The pipeline processes attributions independently at the sentence level, enabling fine-grained analysis rather than document-level assessment. This modular design enables evaluation of any LLM capable of generating Markdown responses with citations, requires no modification to the underlying model, and scales to thousands of cited pages. In Algorithm [1](https://arxiv.org/html/2605.06635v1#alg1 "Algorithm 1 ‣ 3.1 Overview ‣ 3 Methodology ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents"), the deep research agent’s Markdown output is parsed into an AttributionDocument of citation-claim pairs, and the evaluation runner then fetches each cited source and scores every pair across the three dimensions.

Algorithm 1 Source Attribution Evaluation Pipeline

1:


Research query qq, deep research agent with web search

2:AttributionDocument𝒟\\mathcal{D} with citations, attributions, evals

3:Phase 0: Report Generation

4:D←DeepResearchAgent​(q)D\\leftarrow\\textsc{DeepResearchAgent}(q)⊳\\triangleright Markdown report with inline citations

5:Phase 1: Markdown AST Parsing

6:D′←Canonicalize​(D)D^{\\prime}\\leftarrow\\textsc{Canonicalize}(D)⊳\\triangleright Normalize whitespace, strip code blocks

7:T←BuildAST​(D′)T\\leftarrow\\textsc{BuildAST}(D^{\\prime})⊳\\triangleright Construct abstract syntax tree

8:𝒞←ExtractCitations​(T)\\mathcal{C}\\leftarrow\\textsc{ExtractCitations}(T)⊳\\triangleright Deduplicated url, raw\_labels

9:𝒮←SentenceSegment​(T)\\mathcal{S}\\leftarrow\\textsc{SentenceSegment}(T)⊳\\triangleright Split into individual claims

10:𝒜←BackwardAttribute​(𝒮,𝒞)\\mathcal{A}\\leftarrow\\textsc{BackwardAttribute}(\\mathcal{S},\\mathcal{C})⊳\\trianglerighttext\_nocite, span, citation\_ids

11:𝒟←AttributionDocument​(citations=𝒞,attributions=𝒜)\\mathcal{D}\\leftarrow\\texttt{AttributionDocument}(\\texttt{citations}{=}\\mathcal{C},\\;\\texttt{attributions}{=}\\mathcal{A})

12:Phase 2: Evaluation Runner

13:for all unique citation c∈𝒞c\\in\\mathcal{C}in paralleldo

14:c.url\_content←Fetch(c.url)c.\\texttt{url\\\_content}\\leftarrow\\textsc{Fetch}(c.\\texttt{url})⊳\\triangleright Web content extraction

15:endfor

16:for all attribution-citation pair (ai,cj)∈𝒟(a\_{i},c\_{j})\\in\\mathcal{D}in paralleldo

17:s1←LinkWorks(cj.url)s\_{1}\\leftarrow\\textsc{LinkWorks}(c\_{j}.\\texttt{url})⊳\\triangleright HTTP accessibility

18:s2←RelevantContent(ai.text\_nocite,cj.url\_content)s\_{2}\\leftarrow\\textsc{RelevantContent}(a\_{i}.\\texttt{text\\\_nocite},\\;c\_{j}.\\texttt{url\\\_content})⊳\\triangleright LLM-as-a-judge

19:s3←FactCheck(ai.text\_nocite,cj.url\_content)s\_{3}\\leftarrow\\textsc{FactCheck}(a\_{i}.\\texttt{text\\\_nocite},\\;c\_{j}.\\texttt{url\\\_content})⊳\\triangleright LLM-as-a-judge

20:𝒟.evals←𝒟.evals∪{(ai.id,cj.id,\[s1,s2,s3\])}\\mathcal{D}.\\texttt{evals}\\leftarrow\\mathcal{D}.\\texttt{evals}\\cup\\{(a\_{i}.\\texttt{id},\\;c\_{j}.\\texttt{id},\\;\[s\_{1},s\_{2},s\_{3}\])\\}

21:endfor

22:return𝒟\\mathcal{D}

### 3.2 Markdown AST parser

The parser transforms raw LLM-generated Markdown into structured citation-claim pairs by constructing an abstract syntax tree and traversing it to extract citation nodes. Given a Markdown document, it produces an AttributionDocument containing a deduplicated list of citations (URLs), a list of attributions (text spans with associated citation references), and placeholder structures for evaluation results.

Parsing proceeds in four stages. Canonicalization normalizes line endings and whitespace. Code block removal strips fenced code sections to prevent false citation matches. AST construction and traversal identifies citation nodes across multiple formats, including numbered references (\[1\], \[2\]), footnote-style references (\[ˆnote\]), inline Markdown links (\[text\](url)), autolinks (<url>), and ranges (\[1-3\] expanding to individual references). Registry building creates a deduplicated citation list with normalized URLs.

The parser performs sentence-level segmentation to split continuous text into individual claims. It implements backward attribution logic. When a citation appears at the end of a passage, it applies to all preceding uncited sentences in that passage. This design reflects common LLM citation practices, where a single reference supports multiple related claims. The final output associates each text span with its citation identifiers, enabling independent evaluation of each claim-citation pair.

### 3.3 Evaluation dimensions

The framework evaluates citations across three complementary dimensions, each capturing a distinct aspect of attribution quality. These dimensions form an increasing hierarchy of verification difficulty.

#### 3.3.1 Link Works

Link Works assesses URL accessibility without LLM inference. For each cited URL, a web content extractor capable of handling JavaScript-rendered pages retrieves the content. The evaluator produces a binary score of 1 if the URL returns accessible content and 0 if the request fails due to HTTP errors (404, 403), timeouts, or blocked access. This dimension identifies broken links, paywalled content, and URLs removed since the research was conducted.

#### 3.3.2 Relevant Content

Relevant Content measures topical alignment between the claim and the cited source using an LLM-as-a-judge approach. Given the attribution text and retrieved source content (truncated to 5,000 characters), the evaluator determines whether the source addresses the same topic as the claim. The evaluator produces a binary score with a natural language explanation. This dimension identifies citations that link to valid URLs but reference content unrelated to the claim’s subject matter.

#### 3.3.3 Fact Check

Fact Check verifies whether specific factual claims are accurately supported by the source content. Using an LLM-as-a-judge approach, the evaluator examines facts, numbers, dates, and assertions in the attribution text against the retrieved source. The evaluator produces a binary score of 1 if the facts are supported or consistent and 0 if they are contradicted, absent, or uncertain. This dimension represents the most stringent evaluation, identifying citations where the source exists and is topically relevant but does not support the specific claims attributed to it. To ensure alignment with human judgment, the Fact Check evaluator was calibrated through manual review of 50–100 LLM judgments.

### 3.4 Experimental setup

Models and queries. We evaluate 14 LLMs spanning three major providers and open-source alternatives on 130 research queries drawn from DeepResearch Bench ( [Du et al., 2025](https://arxiv.org/html/2605.06635v1#bib.bib13 "")) and BrowseComp ( [Wei et al., 2025](https://arxiv.org/html/2605.06635v1#bib.bib3 "")). The models include OpenAI (GPT-5.2, GPT-5.4, GPT-5 Mini, Codex), Anthropic (Claude Sonnet 4.5, Claude Sonnet 4.6, Claude Opus 4.5, Claude Opus 4.6, Claude Haiku 4.5), Google (Gemini 3.1 Pro, Gemini 3 Flash), and three open-source models (OSS-120B, Llama 4 Maverick, Pixtral Large). Queries cover diverse topics requiring multi-source synthesis.

Evaluation protocol. For each query, a deep research agent with web search capabilities generates a Markdown response with inline citations. The agent is configured with a system prompt enforcing citation format requirements and minimum search depth. Evaluation runs asynchronously with concurrency limits (10 concurrent agents, 15 concurrent evaluators) and retry logic (5 retries with 5-second delays) to handle transient failures.

Ablation study. To analyze the relationship between search depth and attribution quality, we vary the maximum number of tool calls across two models (GPT-5.4, Claude Opus 4.6) at seven intervals (2, 10, 30, 50, 70, 100, and 150). This controlled experiment isolates the effect of search depth from model capability differences.

## 4 Evaluation

We report results organized around three key findings that address our research questions. Section [4.1](https://arxiv.org/html/2605.06635v1#S4.SS1 "4.1 Finding 1. Surface-level citation quality masks factual failures ‣ 4 Evaluation ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents") examines the disconnect between surface-level citation metrics and factual accuracy, Section [4.2](https://arxiv.org/html/2605.06635v1#S4.SS2 "4.2 Finding 2. Citation quantity trades off against factual accuracy ‣ 4 Evaluation ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents") analyzes provider-level patterns in citation quantity versus quality, and Section [4.3](https://arxiv.org/html/2605.06635v1#S4.SS3 "4.3 Finding 3. More search degrades factual accuracy ‣ 4 Evaluation ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents") investigates the effect of search depth on attribution quality.

### 4.1 Finding 1. Surface-level citation quality masks factual failures

Table [1](https://arxiv.org/html/2605.06635v1#S4.T1 "Table 1 ‣ 4.1 Finding 1. Surface-level citation quality masks factual failures ‣ 4 Evaluation ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents") presents evaluation results across all 14 models.

Table 1: Source attribution quality across 14 LLMs ordered by Relevant Content. Success Rate indicates percentage of queries producing valid citations. Bold indicates best per metric.

| Model | Success | Link Works | Relevant | Fact Check |
| --- | --- | --- | --- | --- |
| Claude Opus 4.5 | 90.0% | 98.7% | 95.7% | 76.8% |
| GPT-5.4 | 100.0% | 100.0% | 93.7% | 47.7% |
| GPT-5.2 | 100.0% | 98.3% | 92.3% | 58.8% |
| Codex | 100.0% | 96.9% | 91.9% | 54.1% |
| Claude Haiku 4.5 | 83.3% | 98.9% | 91.1% | 68.9% |
| Claude Sonnet 4.6 | 93.3% | 99.2% | 89.8% | 58.7% |
| Claude Sonnet 4.5 | 96.7% | 98.9% | 88.3% | 51.8% |
| GPT-5 Mini | 100.0% | 99.3% | 87.4% | 38.9% |
| Claude Opus 4.6 | 93.3% | 97.2% | 83.9% | 54.2% |
| Gemini 3 Flash | 100.0% | 94.7% | 82.9% | 45.2% |
| Gemini 3.1 Pro | 90.0% | 94.1% | 80.7% | 48.5% |
| OSS-120B | 40.0% | 83.9% | 68.7% | 24.4% |
| Pixtral Large | 16.7% | 100.0% | 64.9% | 51.4% |
| Llama 4 Maverick | 30.0% | 80.8% | 60.6% | 34.3% |

High link validity and relevance coexist with low factual accuracy. Across all models, 12 of 14 exceed 94% on Link Works and all frontier models exceed 80% on Relevant Content. However, Fact Check scores range from 24% (OSS-120B) to 77% (Claude Opus 4.5), a 53% spread that makes factual accuracy the most differentiating dimension. This pattern means that a user encountering a citation in an LLM-generated report will almost always find a working link to a topically relevant page, yet the specific factual claims attributed to that source may be unsupported nearly half the time.

Open-source models struggle with the citation generation task itself. Fewer than half of open-source models successfully generate cited reports. OSS-120B achieves 40% task success, Llama 4 Maverick 30%, and Pixtral Large only 17%, compared to 83–100% for frontier models. These models also make substantially fewer tool calls (7–60 versus 73–211 for frontier models), suggesting that limited search capabilities compound with weaker generation abilities.

### 4.2 Finding 2. Citation quantity trades off against factual accuracy

Providers that generate more citations achieve lower factual accuracy. Performance patterns differ substantially across providers. OpenAI models achieve 100% task success and generate the most citations (GPT-5 Mini, 1,272 total attributions), but their Fact Check accuracy spans only 39–59%. Anthropic models show lower task success (83–97%) but excel in factual accuracy, with Claude Opus 4.5 achieving 77% Fact Check and Claude Haiku 4.5 achieving 69%. Google Gemini models occupy a middle ground (45–49% Fact Check). This inverse relationship between citation quantity and quality suggests that current LLMs face a fundamental trade-off between research thoroughness and factual reliability.

We hypothesize that this trade-off arises from attention dilution during synthesis. Models generating more citations must aggregate information from a larger number of retrieved passages, increasing the likelihood of misattribution or conflation of facts across sources ( [Lumer et al., 2025b](https://arxiv.org/html/2605.06635v1#bib.bib27 "")). Notably, Claude Opus 4.5 achieves the highest Fact Check score despite a lower task success rate than any OpenAI model, suggesting that selective citation may be a more effective strategy than exhaustive citation for maintaining factual accuracy.

### 4.3 Finding 3. More search degrades factual accuracy

To directly test the information overload hypothesis, we conducted an ablation study across two models at seven search depth intervals (2–150 tool calls). Tables [2](https://arxiv.org/html/2605.06635v1#S4.T2 "Table 2 ‣ 4.3 Finding 3. More search degrades factual accuracy ‣ 4 Evaluation ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents")– [3](https://arxiv.org/html/2605.06635v1#S4.T3 "Table 3 ‣ 4.3 Finding 3. More search degrades factual accuracy ‣ 4 Evaluation ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents") and Figure [2](https://arxiv.org/html/2605.06635v1#S4.F2 "Figure 2 ‣ 4.3 Finding 3. More search degrades factual accuracy ‣ 4 Evaluation ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents") present the results.

Table 2: GPT-5.4 attribution quality across search depths. Bold indicates best performance.

| Tool Calls | Link Works | Relevant | Fact Check |
| --- | --- | --- | --- |
| 2 | 100.0% | 100.0% | 78.6% |
| 10 | 100.0% | 99.0% | 45.9% |
| 30 | 98.5% | 97.8% | 43.0% |
| 50 | 98.6% | 96.5% | 38.0% |
| 70 | 100.0% | 99.1% | 35.5% |
| 100 | 97.7% | 95.3% | 37.2% |
| 150 | 99.2% | 99.2% | 16.7% |

Table 3: Claude Opus 4.6 attribution quality across search depths. Bold indicates best performance.

| Tool Calls | Link Works | Relevant | Fact Check |
| --- | --- | --- | --- |
| 2 | 100.0% | 100.0% | 80.0% |
| 10 | 92.3% | 92.3% | 74.4% |
| 30 | 100.0% | 100.0% | 69.2% |
| 50 | 98.0% | 98.0% | 61.2% |
| 70 | 100.0% | 97.9% | 61.7% |
| 100 | 100.0% | 100.0% | 58.7% |
| 150 | 100.0% | 100.0% | 57.9% |

![Refer to caption](https://arxiv.org/html/2605.06635v1/figure2.png)Figure 2: Fact Check accuracy degradation as search depth increases. Both models show declining factual accuracy with increased tool calls, while Link Works and Relevant Content remain stable (above 92%). GPT-5.4 exhibits the steepest decline (79% to 17%).

Factual accuracy generally degrades with search depth while surface metrics remain stable. Across both models, Fact Check accuracy drops approximately 42% on average from minimal (2 calls) to maximal search depth (Figure [2](https://arxiv.org/html/2605.06635v1#S4.F2 "Figure 2 ‣ 4.3 Finding 3. More search degrades factual accuracy ‣ 4 Evaluation ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents")). GPT-5.4 shows the steepest decline, from 79% to 17% (62%). Claude Opus 4.6 demonstrates the greatest resilience, declining from 80% to 58% (22%). Critically, Link Works and Relevant Content remain above 92% at all search depths, indicating that the degradation is specific to factual synthesis rather than source selection.

This asymmetric degradation pattern provides strong evidence for an information overload effect in LLM research synthesis ( [Lumer et al., 2025c](https://arxiv.org/html/2605.06635v1#bib.bib26 "")). Models can consistently identify and cite accessible, topically relevant sources regardless of search depth, but accurately synthesizing factual claims becomes increasingly difficult as the number of sources grows. The sharpest Fact Check decline occurs between 2 and 10 tool calls for GPT-5.4 (79% to 46%, a 33% drop), suggesting that even modest increases in source volume can overwhelm factual synthesis capabilities.

### 4.4 Error analysis

Link Works failures stem from three categories, including HTTP 404 errors (content removed or URL changed), blocked access (paywalls, bot detection), and connection timeouts. GPT-5.4 demonstrated the highest link reliability with only 1 failed link out of 2,159 evaluations, while open-source models showed substantially higher failure rates (Llama 4 Maverick at 19.2%, OSS-120B at 16.1%). Rate limit errors (HTTP 429) had minimal impact across all models, affecting fewer than 0.3% of evaluations with differences of less than 0.5% in adjusted pass rates.

## 5 Limitations

Our framework has several limitations that present opportunities for future work. First, the LLM-as-a-judge approach for Relevant Content and Fact Check evaluations, despite calibration through human review, may retain biases inherent to the judge model, including position bias and self-enhancement effects ( [Wang et al., 2024](https://arxiv.org/html/2605.06635v1#bib.bib22 ""); [Zheng et al., 2023](https://arxiv.org/html/2605.06635v1#bib.bib21 "")). Ensemble judging with multiple LLM evaluators or hybrid approaches combining LLM judges with rule-based verification could mitigate single-model biases.

Second, web citations are temporally unstable. URLs that were accessible during evaluation may become unavailable due to content removal, domain expiration, or access policy changes, and source content itself may change. This temporal instability affects reproducibility and motivates longitudinal studies tracking citation persistence over time ( [Sen et al., 2026](https://arxiv.org/html/2605.06635v1#bib.bib29 "")). Deploying LLM-generated research in high-stakes domains such as healthcare, legal, or financial analysis without robust citation verification could propagate factual errors, underscoring the importance of frameworks like ours as a safeguard.

Finally, the evaluation is limited to models with web search capabilities, excluding enterprise RAG deployments that cite internal document corpora. Extending the framework to evaluate citation quality in private knowledge bases ( [Gulati et al., 2026a](https://arxiv.org/html/2605.06635v1#bib.bib31 "")) would broaden applicability to the growing ecosystem of enterprise AI assistants.

## 6 Conclusion

In this work, we introduce a source attribution evaluation framework that extracts and evaluates inline citations from LLM-generated deep research reports across three dimensions of link accessibility, topical relevance, and factual accuracy. Our evaluation of 14 LLMs reveals a critical disconnect between surface-level citation quality and factual reliability. Models consistently produce working links to relevant pages, yet factual accuracy remains the weakest dimension across all providers. We further demonstrate an information overload effect, where increased search depth degrades factual accuracy while surface metrics remain stable, providing evidence that more retrieval does not produce more accurate citations.

These findings have implications for both system designers and end users of deep research agents. For system designers, our results suggest that citation quality monitoring should be integrated into agent pipelines, and that retrieval strategies should prioritize depth of source understanding over breadth of source coverage. For end users, the high link validity and topical relevance scores may create a false sense of trust that our framework can help calibrate. We hope that future work will extend this evaluation infrastructure to domain-specific research tasks, enterprise RAG deployments, and longitudinal studies of citation persistence, advancing the systematic assessment of attribution quality as LLM-generated research becomes increasingly prevalent.

## Ethics Statement

This work evaluates the factual reliability of citations produced by commercially deployed LLM-based deep research agents. Our findings that surface-level citation quality masks factual failures have direct implications for users who rely on these systems for research, decision-making, and information synthesis. We highlight the risk that high link validity and topical relevance scores may create a false sense of trust in LLM-generated citations, particularly in high-stakes domains such as healthcare, legal, and financial analysis where factual errors can cause tangible harm. Our framework is intended to serve as a safeguard by providing transparent, reproducible evaluation of citation quality, and we encourage system designers to integrate similar evaluation mechanisms into deployed research agents. All models evaluated in this study are publicly accessible, and our evaluation methodology does not involve human subjects, personally identifiable information, or sensitive data.

## References

- Anthropic (2025)AnthropicIntroducing citations on the Anthropic API.
Note: [https://anthropic.com/news/introducing-citations-api](https://anthropic.com/news/introducing-citations-api "") Accessed: 2026Cited by: [§2.1](https://arxiv.org/html/2605.06635v1#S2.SS1.p1.1 "2.1 Attributed generation and deep research systems ‣ 2 Related work ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents").

- Choi et al. (2025)Y. M. Choi, X. Guo, Y. R. Fung, and Q. WangCiteGuard: faithful citation attribution for LLMs via retrieval-augmented validation.
arXiv preprint arXiv:2510.17853.
Cited by: [§2.2](https://arxiv.org/html/2605.06635v1#S2.SS2.p1.1 "2.2 Attribution evaluation benchmarks ‣ 2 Related work ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents").

- Du et al. (2025)M. Du, B. Xu, C. Zhu, X. Wang, and Z. MaoDeepResearch Bench: A comprehensive benchmark for deep research agents.
arXiv preprint arXiv:2506.11763.
Note: ICLR 2026Cited by: [§3.4](https://arxiv.org/html/2605.06635v1#S3.SS4.p1.1 "3.4 Experimental setup ‣ 3 Methodology ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents").

- Gao et al. (2023a)L. Gao, Z. Dai, P. Pasupat, A. Chen, A. T. Chaganty, Y. Fan, V. Zhao, N. Lao, H. Lee, D. Juan, and K. GuuRARR: researching and revising what language models say, using language models.
In Proceedings of the 61st Annual Meeting of the Association for Computational Linguistics,
pp. 16477–16508.
Cited by: [§2.1](https://arxiv.org/html/2605.06635v1#S2.SS1.p1.1 "2.1 Attributed generation and deep research systems ‣ 2 Related work ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents").

- Gao et al. (2023b)T. Gao, H. Yen, J. Yu, and D. ChenEnabling large language models to generate text with citations.
In Proceedings of the 2023 Conference on Empirical Methods in Natural Language Processing,
pp. 6465–6488.
Cited by: [§2.1](https://arxiv.org/html/2605.06635v1#S2.SS1.p1.1 "2.1 Attributed generation and deep research systems ‣ 2 Related work ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents").

- Gulati et al. (2026a)A. Gulati, S. Sen, W. Sarguroh, and K. PaulBeyond rows to reasoning: agentic retrieval for multimodal spreadsheet understanding and editing.
arXiv preprint arXiv:2603.06503.
Cited by: [§5](https://arxiv.org/html/2605.06635v1#S5.p3.1 "5 Limitations ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents").

- Gulati et al. (2026b)A. Gulati, S. Sen, W. Sarguroh, and K. PaulFrom rows to reasoning: a retrieval-augmented multimodal framework for spreadsheet understanding.
arXiv preprint arXiv:2601.08741.
Cited by: [§1](https://arxiv.org/html/2605.06635v1#S1.p1.1 "1 Introduction ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents").

- Hu et al. (2024)X. Hu, D. Ru, L. Qiu, Q. Guo, T. Zhang, Y. Xu, Y. Luo, P. Liu, Y. Zhang, and Z. ZhangRefChecker: reference-based fine-grained hallucination checker and benchmark for large language models.
In Proceedings of the 2024 Conference on Empirical Methods in Natural Language Processing,
Cited by: [§2.2](https://arxiv.org/html/2605.06635v1#S2.SS2.p1.1 "2.2 Attribution evaluation benchmarks ‣ 2 Related work ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents").

- Lewis et al. (2020)P. Lewis, E. Perez, A. Piktus, F. Petroni, V. Karpukhin, N. Goyal, H. Küttler, M. Lewis, W. Yih, T. Rocktäschel, S. Riedel, and D. KielaRetrieval-augmented generation for knowledge-intensive NLP tasks.
In Advances in Neural Information Processing Systems,
Vol. 33, pp. 9459–9474.
Cited by: [§1](https://arxiv.org/html/2605.06635v1#S1.p1.1 "1 Introduction ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents"),
[§2.1](https://arxiv.org/html/2605.06635v1#S2.SS1.p1.1 "2.1 Attributed generation and deep research systems ‣ 2 Related work ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents").

- Li et al. (2024)Y. Li, X. Yue, Z. Liao, and H. SunAttributionBench: how hard is automatic attribution evaluation?.
In Findings of the Association for Computational Linguistics: ACL 2024,
Cited by: [§1](https://arxiv.org/html/2605.06635v1#S1.p2.1 "1 Introduction ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents"),
[§2.2](https://arxiv.org/html/2605.06635v1#S2.SS2.p1.1 "2.2 Attribution evaluation benchmarks ‣ 2 Related work ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents").

- Lumer et al. (2025a)E. Lumer, A. Cardenas, M. Melich, M. Mason, S. Dieter, V. K. Subbiah, P. H. Basavaraju, and R. HernandezComparison of text-based and image-based retrieval in multimodal retrieval augmented generation large language model systems.
arXiv preprint arXiv:2511.16654.
Cited by: [§1](https://arxiv.org/html/2605.06635v1#S1.p1.1 "1 Introduction ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents").

- Lumer et al. (2026)E. Lumer, A. Gulati, F. Nizar, D. Hedroits, A. Mehta, H. Hwangbo, V. K. Subbiah, P. H. Basavaraju, and J. A. BurkeTool and agent selection for large language model agents in production: a survey.
Preprints.
External Links: [Document](https://dx.doi.org/10.20944/preprints202512.1050.v2 ""),
[Link](https://doi.org/10.20944/preprints202512.1050.v2 "")Cited by: [§2.1](https://arxiv.org/html/2605.06635v1#S2.SS1.p1.1 "2.1 Attributed generation and deep research systems ‣ 2 Related work ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents").

- Lumer et al. (2025b)E. Lumer, A. Gulati, V. K. Subbiah, P. H. Basavaraju, and J. A. BurkeMemtool: optimizing short-term memory management for dynamic tool calling in llm agent multi-turn conversations.
arXiv preprint arXiv:2507.21428.
Cited by: [§4.2](https://arxiv.org/html/2605.06635v1#S4.SS2.p2.1 "4.2 Finding 2. Citation quantity trades off against factual accuracy ‣ 4 Evaluation ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents").

- Lumer et al. (2025c)E. Lumer, A. Gulati, V. K. Subbiah, P. H. Basavaraju, and J. A. BurkeScalemcp: dynamic and auto-synchronizing model context protocol tools for llm agents.
In International Joint Conference on Computational Intelligence,
pp. 23–42.
Cited by: [§4.3](https://arxiv.org/html/2605.06635v1#S4.SS3.p3.1 "4.3 Finding 3. More search degrades factual accuracy ‣ 4 Evaluation ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents").

- Lumer et al. (2025d)E. Lumer, F. Nizar, A. Gulati, P. H. Basavaraju, and V. K. SubbiahTool-to-agent retrieval: bridging tools and agents for scalable llm multi-agent systems.
arXiv preprint arXiv:2511.01854.
Cited by: [§2.1](https://arxiv.org/html/2605.06635v1#S2.SS1.p1.1 "2.1 Attributed generation and deep research systems ‣ 2 Related work ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents").

- OpenAI (2024)OpenAIIntroducing ChatGPT search.
Note: [https://openai.com/index/introducing-chatgpt-search](https://openai.com/index/introducing-chatgpt-search "") Accessed: 2026Cited by: [§1](https://arxiv.org/html/2605.06635v1#S1.p1.1 "1 Introduction ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents"),
[§2.1](https://arxiv.org/html/2605.06635v1#S2.SS1.p1.1 "2.1 Attributed generation and deep research systems ‣ 2 Related work ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents").

- Perplexity AI (2024)Perplexity AIPerplexity AI: answer engine.
Note: [https://www.perplexity.ai](https://www.perplexity.ai/ "") Accessed: 2026Cited by: [§1](https://arxiv.org/html/2605.06635v1#S1.p1.1 "1 Introduction ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents"),
[§2.1](https://arxiv.org/html/2605.06635v1#S2.SS1.p1.1 "2.1 Attributed generation and deep research systems ‣ 2 Related work ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents").

- Press et al. (2024)O. Press, A. Hochlehnert, A. Prabhu, V. Udandarao, O. Press, and M. BethgeCiteME: can language models accurately cite scientific claims?.
In Advances in Neural Information Processing Systems,
Vol. 37.
Note: Datasets and Benchmarks TrackCited by: [§1](https://arxiv.org/html/2605.06635v1#S1.p2.1 "1 Introduction ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents"),
[§2.2](https://arxiv.org/html/2605.06635v1#S2.SS2.p1.1 "2.2 Attribution evaluation benchmarks ‣ 2 Related work ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents").

- Ravichander et al. (2025)A. Ravichander, S. Ghela, D. Wadden, and Y. ChoiHALoGEN: fantastic LLM hallucinations and where to find them.
arXiv preprint arXiv:2501.08292.
Note: ACL 2025 Outstanding PaperCited by: [§1](https://arxiv.org/html/2605.06635v1#S1.p1.1 "1 Introduction ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents"),
[§2.1](https://arxiv.org/html/2605.06635v1#S2.SS1.p1.1 "2.1 Attributed generation and deep research systems ‣ 2 Related work ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents").

- Saxena et al. (2025)Y. Saxena, R. Bommireddy, A. Padia, and M. GaurGeneration-time vs. post-hoc citation: A holistic evaluation of LLM attribution.
arXiv preprint arXiv:2509.21557.
Cited by: [§2.2](https://arxiv.org/html/2605.06635v1#S2.SS2.p1.1 "2.2 Attribution evaluation benchmarks ‣ 2 Related work ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents").

- Sen et al. (2026)S. Sen, E. Lumer, A. Gulati, and V. K. SubbiahChronos: temporal-aware conversational agents with structured event retrieval for long-term memory.
arXiv preprint arXiv:2603.16862.
Cited by: [§5](https://arxiv.org/html/2605.06635v1#S5.p2.1 "5 Limitations ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents").

- Seo et al. (2025)W. Seo, S. Han, J. Jung, B. Newman, S. Lim, S. Lee, X. Lu, Y. Choi, and Y. YuVerifying the verifiers: unveiling pitfalls and potentials in fact verifiers.
arXiv preprint arXiv:2506.13342.
Cited by: [§2.2](https://arxiv.org/html/2605.06635v1#S2.SS2.p1.1 "2.2 Attribution evaluation benchmarks ‣ 2 Related work ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents").

- Slobodkin et al. (2024)A. Slobodkin, E. Hirsch, A. Cattan, T. Schuster, and I. DaganAttribute first, then generate: locally-attributable grounded text generation.
In Proceedings of the 62nd Annual Meeting of the Association for Computational Linguistics,
Cited by: [§2.1](https://arxiv.org/html/2605.06635v1#S2.SS1.p1.1 "2.1 Attributed generation and deep research systems ‣ 2 Related work ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents").

- Wan et al. (2025)D. Wan, E. Hirsch, E. Stengel-Eskin, I. Dagan, and M. BansalGenerationPrograms: fine-grained attribution with executable programs.
arXiv preprint arXiv:2506.14580.
Cited by: [§2.1](https://arxiv.org/html/2605.06635v1#S2.SS1.p1.1 "2.1 Attributed generation and deep research systems ‣ 2 Related work ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents").

- Wang et al. (2024)P. Wang, L. Li, L. Chen, Z. Cai, D. Zhu, B. Lin, Y. Cao, Q. Liu, T. Liu, and Z. SuiLarge language models are not fair evaluators.
In Proceedings of the 62nd Annual Meeting of the Association for Computational Linguistics,
Cited by: [§2.3](https://arxiv.org/html/2605.06635v1#S2.SS3.p1.1 "2.3 LLM-as-a-judge for evaluation ‣ 2 Related work ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents"),
[§5](https://arxiv.org/html/2605.06635v1#S5.p1.1 "5 Limitations ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents").

- Wang et al. (2025a)Q. Wang, Z. Lou, Z. Tang, N. Chen, X. Zhao, W. Zhang, D. Song, and B. HeAssessing judging bias in large reasoning models: an empirical study.
arXiv preprint arXiv:2504.09946.
Cited by: [§2.3](https://arxiv.org/html/2605.06635v1#S2.SS3.p1.1 "2.3 LLM-as-a-judge for evaluation ‣ 2 Related work ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents").

- Wang et al. (2025b)Y. Wang, X. Ma, P. Nie, H. Zeng, Z. Lyu, Y. Zhang, B. Schneider, Y. Lu, X. Yue, and W. ChenScholarCopilot: training large language models for academic writing with accurate citations.
arXiv preprint arXiv:2504.00824.
Note: COLM 2025Cited by: [§2.1](https://arxiv.org/html/2605.06635v1#S2.SS1.p1.1 "2.1 Attributed generation and deep research systems ‣ 2 Related work ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents").

- Wei et al. (2025)J. Wei, Z. Sun, S. Papay, S. McKinney, J. Han, I. Fulford, H. W. Chung, A. T. Passos, W. Fedus, and A. GlaeseBrowseComp: a simple yet challenging benchmark for browsing agents.
External Links: 2504.12516,
[Link](https://arxiv.org/abs/2504.12516 "")Cited by: [§3.4](https://arxiv.org/html/2605.06635v1#S3.SS4.p1.1 "3.4 Experimental setup ‣ 3 Methodology ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents").

- Xu et al. (2025)Y. Xu, P. Qi, J. Chen, K. Liu, R. Han, L. Liu, B. Min, V. Castelli, A. Gupta, and Z. WangCiteEval: principle-driven citation evaluation for source attribution.
In Proceedings of the 63rd Annual Meeting of the Association for Computational Linguistics,
Cited by: [§1](https://arxiv.org/html/2605.06635v1#S1.p2.1 "1 Introduction ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents"),
[§2.2](https://arxiv.org/html/2605.06635v1#S2.SS2.p1.1 "2.2 Attribution evaluation benchmarks ‣ 2 Related work ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents").

- Ye et al. (2025)J. Ye, Y. Wang, Y. Huang, D. Chen, Q. Zhang, N. Moniz, T. Gao, W. Geyer, C. Huang, P. Chen, N. V. Chawla, and X. ZhangJustice or prejudice? quantifying biases in LLM-as-a-judge.
In International Conference on Learning Representations,
Cited by: [§2.3](https://arxiv.org/html/2605.06635v1#S2.SS3.p1.1 "2.3 LLM-as-a-judge for evaluation ‣ 2 Related work ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents").

- Yuan et al. (2026)Z. Yuan, K. Shi, Z. Zhang, L. Sun, N. V. Chawla, and Y. YeCiteAudit: you cited it, but did you read it? A benchmark for verifying scientific references in the LLM era.
arXiv preprint arXiv:2602.23452.
Cited by: [§1](https://arxiv.org/html/2605.06635v1#S1.p1.1 "1 Introduction ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents"),
[§1](https://arxiv.org/html/2605.06635v1#S1.p2.1 "1 Introduction ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents"),
[§2.1](https://arxiv.org/html/2605.06635v1#S2.SS1.p1.1 "2.1 Attributed generation and deep research systems ‣ 2 Related work ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents"),
[§2.2](https://arxiv.org/html/2605.06635v1#S2.SS2.p1.1 "2.2 Attribution evaluation benchmarks ‣ 2 Related work ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents").

- Zheng et al. (2023)L. Zheng, W. Chiang, Y. Sheng, S. Zhuang, Z. Wu, Y. Zhuang, Z. Lin, Z. Li, D. Li, E. P. Xing, H. Zhang, J. E. Gonzalez, and I. StoicaJudging LLM-as-a-judge with MT-Bench and Chatbot Arena.
In Advances in Neural Information Processing Systems,
Vol. 36.
Cited by: [§2.3](https://arxiv.org/html/2605.06635v1#S2.SS3.p1.1 "2.3 LLM-as-a-judge for evaluation ‣ 2 Related work ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents"),
[§5](https://arxiv.org/html/2605.06635v1#S5.p1.1 "5 Limitations ‣ Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents").
