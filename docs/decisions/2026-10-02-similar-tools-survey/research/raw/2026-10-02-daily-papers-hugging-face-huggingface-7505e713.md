---
url: https://huggingface.co/papers?q=source%20citations
retrieved: 2026-10-02
command: firecrawl scrape https://huggingface.co/papers?q=source%20citations --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Daily Papers - Hugging Face
---
new

Get trending papers in your email inbox once a day!

Get trending papers in your email inbox!

[Subscribe](https://huggingface.co/login?next=%2Fpapers)

# Daily Papers

## by [![](https://huggingface.co/front/assets/papers-by.png)AK](https://huggingface.co/akhaliq) and the research community

- Daily
- Weekly
- Monthly

[Trending Papers](https://huggingface.co/papers/trending)

Oct 2

[101](https://huggingface.co/login?next=%2Fpapers%2F2606.00683)

### [OCC-RAG: Optimal Cognitive Core for Faithful Question Answering](https://huggingface.co/papers/2606.00683)

[Recent progress in the development of language models has been defined by scale, with each generation absorbing more of the world's knowledge into its weights. However, many practical applications benefit more from robust reasoning than from extensive parametric knowledge. In this setting, task-specialized small language models (SLMs) offer a principled design choice. We introduce Optimal Cognitive Core (OCC), a family of SLMs built around this premise. As a variant of OCC, we present OCC-RAG, optimized for faithful question answering (QA) grounded in the provided context. This task directly aligns with the OCC design approach, requiring multi-hop reasoning over supplied passages while ignoring memorized knowledge. To train OCC-RAG, we implement a novel pipeline for synthesizing multi-context, multi-hop QA data at scale, producing a corpus of over three million examples targeting multi-hop reasoning, strict context faithfulness, and calibrated abstention. We release OCC-RAG-0.6B and OCC-RAG-1.7B, both mid-trained on this corpus. The models produce structured reasoning traces with sourcecitations grounded in literal quotes from the context. Through OCC-RAG, we demonstrate that compact, task-specialized SLMs can match or exceed general-purpose models 2 -- 6x their size across multi-hop reasoning (HotpotQA, MuSiQue, TAT-QA), faithfulness (ConFiQA), and refusal (MuSiQue-Un) benchmarks.](https://huggingface.co/papers/2606.00683)

[![occ-ai](https://cdn-avatars.huggingface.co/v1/production/uploads/661e44cf1d8ffc49b57ba07e/jibWvvUHa3KlYL-tXkek0.png)OCC](https://huggingface.co/occ-ai)

·

May 29[6](https://huggingface.co/papers/2606.00683#community)

[173](https://huggingface.co/login?next=%2Fpapers%2F2609.11115)

### [Benchmark Radar: A Living Database and Search Engine for AI Benchmarks and Evaluation](https://huggingface.co/papers/2609.11115)

[Benchmark researchers and developers of large language models (LLMs) and other AI systems need to find relevant evaluations, locate their benchmark datasets and code, and understand the settings behind reported scores. We present Benchmark Radar, a living database and search engine for retrieval and discovery of AI benchmarks, covering LLM evaluation, agentic and tool-use benchmarks, coding, reasoning, safety, and domain-specific evaluations. The system combines daily discovery of benchmark papers, repositories, datasets, and releases with a searchable benchmark catalog, mentions in model cards and technical reports, and score histories. It retains source identities and citations so readers can inspect candidate benchmarks and their evaluation evidence. Daily discovery draws on 37 sources: 13 direct connectors and 24 first-party research and engineering feeds. The catalog contains 1,283 source records drawn from 4 benchmark catalogs and 12,916 numeric observations on 790 records. We describe collection and retrieval, audit the full catalog, and examine benchmark saturation, adoption trends, and the limits of score comparisons. A worked example walks through a complete prior-art search, showing how to query the catalog and inspect benchmark evidence when designing a new evaluation. We release the web dashboard with a benchmark leaderboard, a Pareto frontier view of score against measured use, saturation and trend views, daily feeds, downloadable evidence, a command-line interface (CLI) for offline queries, and reproducible analysis.](https://huggingface.co/papers/2609.11115)

[![CarnegieMellonU](https://cdn-avatars.huggingface.co/v1/production/uploads/68e396f2b5bb631e9b2fac9a/6I146aJvxxlRCEbYFFAeQ.png)Carnegie Mellon University](https://huggingface.co/CarnegieMellonU)

·

Sep 9[9](https://huggingface.co/papers/2609.11115#community)

[-](https://huggingface.co/login?next=%2Fpapers%2F2502.20581)

### [The Noisy Path from Source to Citation: Measuring How Scholars Engage\  with Past Research](https://huggingface.co/papers/2502.20581)

[Academic citations are widely used for evaluating research and tracing\\
knowledge flows. Such uses typically rely on raw citation counts and neglect\\
variability in citation types. In particular, citations can vary in their\\
fidelity as original knowledge from cited studies may be paraphrased,\\
summarized, or reinterpreted, possibly wrongly, leading to variation in how\\
much information changes from cited to citing paper. In this study, we\\
introduce a computational pipeline to quantify citation fidelity at scale.\\
Using full texts of papers, the pipeline identifies citations in citing papers\\
and the corresponding claims in cited papers, and applies supervised models to\\
measure fidelity at the sentence level. Analyzing a large-scale\\
multi-disciplinary dataset of approximately 13 million citation sentence pairs,\\
we find that citation fidelity is higher when authors cite papers that are 1)\\
more recent and intellectually close, 2) more accessible, and 3) the first\\
author has a lower H-index and the author team is medium-sized. Using a\\
quasi-experiment, we establish the "telephone effect" - when citing papers have\\
low fidelity to the original claim, future papers that cite the citing paper\\
and the original have lower fidelity to the original. Our work reveals\\
systematic differences in citation fidelity, underscoring the limitations of\\
analyses that rely on citation quantity alone and the potential for distortion\\
of evidence.](https://huggingface.co/papers/2502.20581)

[- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/63516acdce7cf1fe8a854cdc/TlOI7iPdG7zJKWyGLoPQN.jpeg)\\
- ![](https://huggingface.co/avatars/1515b197a71d150ddecaf7cd109ac84e.svg)\\
- 3 authors](https://huggingface.co/papers/2502.20581)

·

Feb 27, 2025

[1](https://huggingface.co/login?next=%2Fpapers%2F2605.08583)

### [Source or It Didn't Happen: A Multi-Agent Framework for Citation Hallucination Detection](https://huggingface.co/papers/2605.08583)

[Large language models are increasingly used in scientific writing, yet they can fabricate citation-shaped references that appear plausible but fail bibliographic verification. Existing detectors often reduce verification to binary found/not-found decisions and rely on brittle parsing or incomplete retrieval, offering little field-level signal to auditors. We reframe citation hallucination detection as taxonomy-aligned field-level adjudication and introduce a 12-code taxonomy spanning Real, Potential, and Hallucinated citations. Based on this taxonomy, we build CiteTracer, a cascading multi-agent detector that extracts structured citations from PDF and BibTeX, retrieves evidence through cache lookup, URL fetch, scholar connectors, and web search, applies deterministic field matching, and routes ambiguous cases to class-specialist judgers. We release a benchmark of 2,450 synthetic citations built from real seeds with controlled LLM mutations, paired with 957 real-world fabricated citations drawn from ICLR 2026 and an anonymous conference desk-rejected submissions. CiteTracer reaches 97.1% accuracy on the synthetic benchmark, with class-level F1 scores of 97.0, 95.8, and 98.5 for Real, Potential, and Hallucinated, respectively, and detects 97.1% of fabrications on the real-world set without abstaining. Code: https://github.com/aaFrostnova/CiteTracer.](https://huggingface.co/papers/2605.08583)

[![umass](https://cdn-avatars.huggingface.co/v1/production/uploads/1645662504549-6216cfcd6a99db28e0b3155a.png)University of Massachusetts Amherst](https://huggingface.co/umass)

·

May 8[1](https://huggingface.co/papers/2605.08583#community)

[-](https://huggingface.co/login?next=%2Fpapers%2F2609.00319)

### [Sources of Truth: A Multi-Platform, Multilingual Audit of Citations in AI Mental Health Information Queries](https://huggingface.co/papers/2609.00319)

[Online health information seeking is shifting from keyword search, where users consider a ranked list of links, to conversational systems that compose a single answer and curate its citations. Source evaluation therefore passes from user to platform, yet what these systems surface is poorly characterized. We audited three free consumer products (ChatGPT, Perplexity, Google AI Overview) on twenty English mental health questions under two prompt conditions, with a subset of three also translated into six further languages of varying resource tiers. We recorded 15,942 citations across 1,140 responses and 1,713 unique domains, then classified every citation with a nine-category organizational typology applied by a deterministic classifier validated against human coding. Citations were heavily concentrated: the ten most-cited domains accounted for 43.6% of English citations, and government, commercial health, and academic sources were closely matched at roughly 22% each. Platforms differed little in typical citation volume but sharply in consistency and in the source types they favored. Explicitly requesting sources shifted composition only modestly. Non-English queries surfaced fewer citations and were routed to language-appropriate resources at significantly lower rates. We release the typology, classifier, and annotated corpus as reusable instruments for auditing generative health search.](https://huggingface.co/papers/2609.00319)

[- 10 authors](https://huggingface.co/papers/2609.00319)

·

Aug 30

[-](https://huggingface.co/login?next=%2Fpapers%2F2403.01774)

### [WebCiteS: Attributed Query-Focused Summarization on Chinese Web Search\  Results with Citations](https://huggingface.co/papers/2403.01774)

[Enhancing the attribution in large language models (LLMs) is a crucial task.\\
One feasible approach is to enable LLMs to cite external sources that support\\
their generations. However, existing datasets and evaluation methods in this\\
domain still exhibit notable limitations. In this work, we formulate the task\\
of attributed query-focused summarization (AQFS) and present WebCiteS, a\\
Chinese dataset featuring 7k human-annotated summaries with citations. WebCiteS\\
derives from real-world user queries and web search results, offering a\\
valuable resource for model training and evaluation. Prior works in attribution\\
evaluation do not differentiate between groundedness errors and citation\\
errors. They also fall short in automatically verifying sentences that draw\\
partial support from multiple sources. We tackle these issues by developing\\
detailed metrics and enabling the automatic evaluator to decompose the\\
sentences into sub-claims for fine-grained verification. Our comprehensive\\
evaluation of both open-source and proprietary models on WebCiteS highlights\\
the challenge LLMs face in correctly citing sources, underscoring the necessity\\
for further improvement. The dataset and code will be open-sourced to\\
facilitate further research in this crucial field.](https://huggingface.co/papers/2403.01774)

[- 9 authors](https://huggingface.co/papers/2403.01774)

·

Mar 3, 2024

[-](https://huggingface.co/login?next=%2Fpapers%2F2410.22349)

### [Search Engines in an AI Era: The False Promise of Factual and Verifiable\  Source-Cited Responses](https://huggingface.co/papers/2410.22349)

[Large Language Model (LLM)-based applications are graduating from research\\
prototypes to products serving millions of users, influencing how people write\\
and consume information. A prominent example is the appearance of Answer\\
Engines: LLM-based generative search engines supplanting traditional search\\
engines. Answer engines not only retrieve relevant sources to a user query but\\
synthesize answer summaries that cite the sources. To understand these systems'\\
limitations, we first conducted a study with 21 participants, evaluating\\
interactions with answer vs. traditional search engines and identifying 16\\
answer engine limitations. From these insights, we propose 16 answer engine\\
design recommendations, linked to 8 metrics. An automated evaluation\\
implementing our metrics on three popular engines (You.com, Perplexity.ai,\\
BingChat) quantifies common limitations (e.g., frequent hallucination,\\
inaccurate citation) and unique features (e.g., variation in answer\\
confidence), with results mirroring user study insights. We release our Answer\\
Engine Evaluation benchmark (AEE) to facilitate transparent evaluation of\\
LLM-based applications.](https://huggingface.co/papers/2410.22349)

[- ![](https://huggingface.co/avatars/c40b0b0784345b1cdf0679cd50088958.svg)\\
- ![](https://huggingface.co/avatars/b6e5bba78425e9c28d1b75ee8a7eaac1.svg)\\
- 5 authors](https://huggingface.co/papers/2410.22349)

·

Oct 14, 2024

[-](https://huggingface.co/login?next=%2Fpapers%2F2509.04499)

### [DeepTRACE: Auditing Deep Research AI Systems for Tracking Reliability\  Across Citations and Evidence](https://huggingface.co/papers/2509.04499)

[Generative search engines and deep research LLM agents promise trustworthy,\\
source-grounded synthesis, yet users regularly encounter overconfidence, weak\\
sourcing, and confusing citation practices. We introduce DeepTRACE, a novel\\
sociotechnically grounded audit framework that turns prior community-identified\\
failure cases into eight measurable dimensions spanning answer text, sources,\\
and citations. DeepTRACE uses statement-level analysis (decomposition,\\
confidence scoring) and builds citation and factual-support matrices to audit\\
how systems reason with and attribute evidence end-to-end. Using automated\\
extraction pipelines for popular public models (e.g., GPT-4.5/5, You.com,\\
Perplexity, Copilot/Bing, Gemini) and an LLM-judge with validated agreement to\\
human raters, we evaluate both web-search engines and deep-research\\
configurations. Our findings show that generative search engines and deep\\
research agents frequently produce one-sided, highly confident responses on\\
debate queries and include large fractions of statements unsupported by their\\
own listed sources. Deep-research configurations reduce overconfidence and can\\
attain high citation thoroughness, but they remain highly one-sided on debate\\
queries and still exhibit large fractions of unsupported statements, with\\
citation accuracy ranging from 40--80% across systems.](https://huggingface.co/papers/2509.04499)

[- ![](https://huggingface.co/avatars/5f276e27e3907d3898cdbfcaa7c43516.svg)\\
- 6 authors](https://huggingface.co/papers/2509.04499)

·

Sep 1, 2025

[-](https://huggingface.co/login?next=%2Fpapers%2F2511.12142)

### [MAVIS: A Benchmark for Multimodal Source Attribution in Long-form Visual Question Answering](https://huggingface.co/papers/2511.12142)

[Source attribution aims to enhance the reliability of AI-generated answers by including references for each statement, helping users validate the provided answers. However, existing work has primarily focused on text-only scenario and largely overlooked the role of multimodality. We introduce MAVIS, the first benchmark designed to evaluate multimodal source attribution systems that understand user intent behind visual questions, retrieve multimodal evidence, and generate long-form answers with citations. Our dataset comprises 157K visual QA instances, where each answer is annotated with fact-level citations referring to multimodal documents. We develop fine-grained automatic metrics along three dimensions of informativeness, groundedness, and fluency, and demonstrate their strong correlation with human judgments. Our key findings are threefold: (1) LVLMs with multimodal RAG generate more informative and fluent answers than unimodal RAG, but they exhibit weaker groundedness for image documents than for text documents, a gap amplified in multimodal settings. (2) Given the same multimodal documents, there is a trade-off between informativeness and groundedness across different prompting methods. (3) Our proposed method highlights mitigating contextual bias in interpreting image documents as a crucial direction for future research.](https://huggingface.co/papers/2511.12142)

[- ![](https://huggingface.co/avatars/0ade6e2a86863f6cee4e1423be23dbbd.svg)\\
- 3 authors](https://huggingface.co/papers/2511.12142)

·

Nov 15, 2025

[8](https://huggingface.co/login?next=%2Fpapers%2F2407.17722)

### [Text-Driven Neural Collaborative Filtering Model for Paper Source\  Tracing](https://huggingface.co/papers/2407.17722)

[Identifying significant references within the complex interrelations of a\\
citation knowledge graph is challenging, which encompasses connections through\\
citations, authorship, keywords, and other relational attributes. The Paper\\
Source Tracing (PST) task seeks to automate the identification of pivotal\\
references for given scholarly articles utilizing advanced data mining\\
techniques. In the KDD CUP 2024, we design a recommendation-based framework\\
tailored for the PST task. This framework employs the Neural Collaborative\\
Filtering (NCF) model to generate final predictions. To process the textual\\
attributes of the papers and extract input features for the model, we utilize\\
SciBERT, a pre-trained language model. According to the experimental results,\\
our method achieved a score of 0.37814 on the Mean Average Precision (MAP)\\
metric, outperforming baseline models and ranking 11th among all participating\\
teams. The source code is publicly available at\\
https://github.com/MyLove-XAB/KDDCupFinal.](https://huggingface.co/papers/2407.17722)

[- ![](https://huggingface.co/avatars/77629572bd94f07b2efffa27b1a3a836.svg)\\
- 4 authors](https://huggingface.co/papers/2407.17722)

·

Jul 24, 2024 [2](https://huggingface.co/papers/2407.17722#community)

[-](https://huggingface.co/login?next=%2Fpapers%2F2207.06220)

### [Improving Wikipedia Verifiability with AI](https://huggingface.co/papers/2207.06220)

[Verifiability is a core content policy of Wikipedia: claims that are likely\\
to be challenged need to be backed by citations. There are millions of articles\\
available online and thousands of new articles are released each month. For\\
this reason, finding relevant sources is a difficult task: many claims do not\\
have any references that support them. Furthermore, even existing citations\\
might not support a given claim or become obsolete once the original source is\\
updated or deleted. Hence, maintaining and improving the quality of Wikipedia\\
references is an important challenge and there is a pressing need for better\\
tools to assist humans in this effort. Here, we show that the process of\\
improving references can be tackled with the help of artificial intelligence\\
(AI). We develop a neural network based system, called Side, to identify\\
Wikipedia citations that are unlikely to support their claims, and subsequently\\
recommend better ones from the web. We train this model on existing Wikipedia\\
references, therefore learning from the contributions and combined wisdom of\\
thousands of Wikipedia editors. Using crowd-sourcing, we observe that for the\\
top 10% most likely citations to be tagged as unverifiable by our system,\\
humans prefer our system's suggested alternatives compared to the originally\\
cited reference 70% of the time. To validate the applicability of our system,\\
we built a demo to engage with the English-speaking Wikipedia community and\\
find that Side's first citation recommendation collects over 60% more\\
preferences than existing Wikipedia citations for the same top 10% most likely\\
unverifiable claims according to Side. Our results indicate that an AI-based\\
system could be used, in tandem with humans, to improve the verifiability of\\
Wikipedia. More generally, we hope that our work can be used to assist fact\\
checking efforts and increase the general trustworthiness of information\\
online.](https://huggingface.co/papers/2207.06220)

[- ![](https://huggingface.co/avatars/57296279592ad5f77c39d174f6289420.svg)\\
- 13 authors](https://huggingface.co/papers/2207.06220)

·

Jul 8, 2022

[-](https://huggingface.co/login?next=%2Fpapers%2F2511.16198)

### [SemanticCite: Citation Verification with AI-Powered Full-Text Analysis and Evidence-Based Reasoning](https://huggingface.co/papers/2511.16198)

[Effective scientific communication depends on accurate citations that validate sources and guide readers to supporting evidence. Yet academic literature faces mounting challenges: semantic citation errors that misrepresent sources, AI-generated hallucinated references, and traditional citation formats that point to entire papers without indicating which sections substantiate specific claims. We introduce SemanticCite, an AI-powered system that verifies citation accuracy through full-text source analysis while providing rich contextual information via detailed reasoning and relevant text snippets. Our approach combines multiple retrieval methods with a four-class classification system (Supported, Partially Supported, Unsupported, Uncertain) that captures nuanced claim-source relationships and enables appropriate remedial actions for different error types. Our experiments show that fine-tuned lightweight language models achieve performance comparable to large commercial systems with significantly lower computational requirements, making large-scale citation verification practically feasible. The system provides transparent, evidence-based explanations that support user understanding and trust. We contribute a comprehensive dataset of over 1,000 citations with detailed alignments, functional classifications, semantic annotations, and bibliometric metadata across eight disciplines, alongside fine-tuned models and the complete verification framework as open-source software. SemanticCite addresses critical challenges in research integrity through scalable citation verification, streamlined peer review, and quality control for AI-generated content, providing an open-source foundation for maintaining citation accuracy at scale.](https://huggingface.co/papers/2511.16198)

[- 1 authors](https://huggingface.co/papers/2511.16198)

·

Nov 20, 2025 [1](https://huggingface.co/papers/2511.16198#community)

[3](https://huggingface.co/login?next=%2Fpapers%2F2601.04932)

### [GenProve: Learning to Generate Text with Fine-Grained Provenance](https://huggingface.co/papers/2601.04932)

[Large language models (LLM) often hallucinate, and while adding citations is a common solution, it is frequently insufficient for accountability as users struggle to verify how a cited source supports a generated claim. Existing methods are typically coarse-grained and fail to distinguish between direct quotes and complex reasoning. In this paper, we introduce Generation-time Fine-grained Provenance, a task where models must generate fluent answers while simultaneously producing structured, sentence-level provenance triples. To enable this, we present ReFInE (Relation-aware Fine-grained Interpretability & Evidence), a dataset featuring expert verified annotations that distinguish between Quotation, Compression, and Inference. Building on ReFInE, we propose GenProve, a framework that combines Supervised Fine-Tuning (SFT) with Group Relative Policy Optimization (GRPO). By optimizing a composite reward for answer fidelity and provenance correctness, GenProve significantly outperforms 14 strong LLMs in joint evaluation. Crucially, our analysis uncovers a reasoning gap where models excel at surface-level quotation but struggle significantly with inference-based provenance, suggesting that verifiable reasoning remains a frontier challenge distinct from surface-level citation.](https://huggingface.co/papers/2601.04932)

[- 8 authors](https://huggingface.co/papers/2601.04932)

·

Apr 11 [2](https://huggingface.co/papers/2601.04932#community)

[-](https://huggingface.co/login?next=%2Fpapers%2F2111.08366)

### [Multi-Vector Models with Textual Guidance for Fine-Grained Scientific\  Document Similarity](https://huggingface.co/papers/2111.08366)

[We present a new scientific document similarity model based on matching\\
fine-grained aspects of texts. To train our model, we exploit a\\
naturally-occurring source of supervision: sentences in the full-text of papers\\
that cite multiple papers together (co-citations). Such co-citations not only\\
reflect close paper relatedness, but also provide textual descriptions of how\\
the co-cited papers are related. This novel form of textual supervision is used\\
for learning to match aspects across papers. We develop multi-vector\\
representations where vectors correspond to sentence-level aspects of\\
documents, and present two methods for aspect matching: (1) A fast method that\\
only matches single aspects, and (2) a method that makes sparse multiple\\
matches with an Optimal Transport mechanism that computes an Earth Mover's\\
Distance between aspects. Our approach improves performance on document\\
similarity tasks in four datasets. Further, our fast single-match method\\
achieves competitive results, paving the way for applying fine-grained\\
similarity to large scientific corpora. Code, data, and models available at:\\
https://github.com/allenai/aspire](https://huggingface.co/papers/2111.08366)

[- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/1646747907864-62258434518cb976dadeaabd.jpeg)\\
- 3 authors](https://huggingface.co/papers/2111.08366)

·

Nov 16, 2021

[10](https://huggingface.co/login?next=%2Fpapers%2F2410.02115)

### [L-CiteEval: Do Long-Context Models Truly Leverage Context for\  Responding?](https://huggingface.co/papers/2410.02115)

[Long-context models (LCMs) have made remarkable strides in recent years,\\
offering users great convenience for handling tasks that involve long context,\\
such as document summarization. As the community increasingly prioritizes the\\
faithfulness of generated results, merely ensuring the accuracy of LCM outputs\\
is insufficient, as it is quite challenging for humans to verify the results\\
from the extremely lengthy context. Yet, although some efforts have been made\\
to assess whether LCMs respond truly based on the context, these works either\\
are limited to specific tasks or heavily rely on external evaluation resources\\
like GPT-4.In this work, we introduce L-CiteEval, a comprehensive multi-task\\
benchmark for long-context understanding with citations, aiming to evaluate\\
both the understanding capability and faithfulness of LCMs. L-CiteEval covers\\
11 tasks from diverse domains, spanning context lengths from 8K to 48K, and\\
provides a fully automated evaluation suite. Through testing with 11\\
cutting-edge closed-source and open-source LCMs, we find that although these\\
models show minor differences in their generated results, open-source models\\
substantially trail behind their closed-source counterparts in terms of\\
citation accuracy and recall. This suggests that current open-source LCMs are\\
prone to responding based on their inherent knowledge rather than the given\\
context, posing a significant risk to the user experience in practical\\
applications. We also evaluate the RAG approach and observe that RAG can\\
significantly improve the faithfulness of LCMs, albeit with a slight decrease\\
in the generation quality. Furthermore, we discover a correlation between the\\
attention mechanisms of LCMs and the citation generation process.](https://huggingface.co/papers/2410.02115)

[- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/65731fc31345577b7071d7df/T8qnqIxnycvy1AP8CKAPb.png)\\
- ![](https://huggingface.co/avatars/be3a3990492ef1c5f3ff33cc043ae166.svg)\\
- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/64096ef79e9f790c905b846d/hVzw656lXdzbCxTtnheud.jpeg)\\
- 6 authors](https://huggingface.co/papers/2410.02115)

·

Oct 2, 2024[3](https://huggingface.co/papers/2410.02115#community)

[-](https://huggingface.co/login?next=%2Fpapers%2F2510.15682)

### [SQuAI: Scientific Question-Answering with Multi-Agent\  Retrieval-Augmented Generation](https://huggingface.co/papers/2510.15682)

[We present SQuAI (https://squai.scads.ai/), a scalable and trustworthy\\
multi-agent retrieval-augmented generation (RAG) framework for scientific\\
question answering (QA) with large language models (LLMs). SQuAI addresses key\\
limitations of existing RAG systems in the scholarly domain, where complex,\\
open-domain questions demand accurate answers, explicit claims with citations,\\
and retrieval across millions of scientific documents. Built on over 2.3\\
million full-text papers from arXiv.org, SQuAI employs four collaborative\\
agents to decompose complex questions into sub-questions, retrieve targeted\\
evidence via hybrid sparse-dense retrieval, and adaptively filter documents to\\
improve contextual relevance. To ensure faithfulness and traceability, SQuAI\\
integrates in-line citations for each generated claim and provides supporting\\
sentences from the source documents. Our system improves faithfulness, answer\\
relevance, and contextual relevance by up to +0.088 (12%) over a strong RAG\\
baseline. We further release a benchmark of 1,000 scientific\\
question-answer-evidence triplets to support reproducibility. With transparent\\
reasoning, verifiable citations, and domain-wide scalability, SQuAI\\
demonstrates how multi-agent RAG enables more trustworthy scientific QA with\\
LLMs.](https://huggingface.co/papers/2510.15682)

[- 4 authors](https://huggingface.co/papers/2510.15682)

·

Oct 17, 2025

[3](https://huggingface.co/login?next=%2Fpapers%2F2601.08472)

### [sui-1: Grounded and Verifiable Long-Form Summarization](https://huggingface.co/papers/2601.08472)

[Large language models frequently generate plausible but unfaithful summaries that users cannot verify against source text, a critical limitation in compliance-sensitive domains such as government and legal analysis. We present sui-1, a 24B parameter model that produces abstractive summaries with inline citations, enabling users to trace each claim to its source sentence. Our synthetic data pipeline combines chain-of-thought prompting with multi-stage verification, generating over 22,000 high-quality training examples across five languages from diverse sources including parliamentary documents, web text, and Wikipedia. Evaluation shows sui-1 significantly outperforms all tested open-weight baselines, including models with 3x more parameters. These results demonstrate that task-specific training substantially outperforms scale alone for citation-grounded summarization. Model weights and an interactive demo are publicly available.](https://huggingface.co/papers/2601.08472)

[![ellamind](https://cdn-avatars.huggingface.co/v1/production/uploads/647ef81ce9c81260ff84fdd7/G2Ftt38LatXWWu3CX9izs.png)ellamind](https://huggingface.co/ellamind)

·

Jan 13[2](https://huggingface.co/papers/2601.08472#community)

[70](https://huggingface.co/login?next=%2Fpapers%2F2607.15257)

### [SearchOS-V1: Towards Robust Open-Domain Information-Seeking Agent Collaboration](https://huggingface.co/papers/2607.15257)

[Recent advances in Tool-Integrated Large Language Models have made web search a core capability of information-seeking agents. However, as interaction histories grow, agents increasingly struggle to track task progress. When search attempts fail to yield useful evidence, current single- and multi-agent systems can become trapped in repetitive loops, wasting search budgets and ultimately compromising the quality and completeness of the final output. We introduce SearchOS, a system-level multi-agent framework that turns fragile, implicit search progress into explicit, persistent, and shared state. First, we formulate open-domain information seeking as relational schema completion with grounded citations, where agents discover entities, populate attributes across linked tables, and anchor each value to source evidence. Then we design Search-Oriented Context Management (SOCM), which externalizes the evolving state into Frontier Task, an Evidence Graph, a Coverage Map, and Failure Memory. Built on SOCM, SearchOS applies a pipeline-parallel scheduling mechanism that overlaps the execution of sub-agents and continuously refills freed slots with tasks targeting unresolved coverage gaps to improve utilization and throughput. To schedule and control the execution of search agents, SearchOS introduces a Search Tool Middleware Harness that intercepts model and tool interactions to record grounded evidence and react to stalls or budget exhaustion, and provides a reusable hierarchical skill system comprising strategy and access skills to augment the agents' search process and avoid repeating failed search patterns across runs. On WideSearch and GISA, SearchOS leads all metrics among the evaluated single- and multi-agent baselines, paving the way toward robust information-seeking collaboration.](https://huggingface.co/papers/2607.15257)

[![antgroup](https://cdn-avatars.huggingface.co/v1/production/uploads/662e1f9da266499277937d33/7VcPHdLSGlged3ixK1dys.jpeg)Ant Group](https://huggingface.co/antgroup)

·

Jul 15 [1](https://huggingface.co/papers/2607.15257#community)

[-](https://huggingface.co/login?next=%2Fpapers%2F2508.03828)

### [MegaWika 2: A More Comprehensive Multilingual Collection of Articles and\  their Sources](https://huggingface.co/papers/2508.03828)

[We introduce MegaWika 2, a large, multilingual dataset of Wikipedia articles\\
with their citations and scraped web sources; articles are represented in a\\
rich data structure, and scraped source texts are stored inline with precise\\
character offsets of their citations in the article text. MegaWika 2 is a major\\
upgrade from the original MegaWika, spanning six times as many articles and\\
twice as many fully scraped citations. Both MegaWika and MegaWika 2 support\\
report generation research ; whereas MegaWika also focused on supporting\\
question answering and retrieval applications, MegaWika 2 is designed to\\
support fact checking and analyses across time and language.](https://huggingface.co/papers/2508.03828)

[- 3 authors](https://huggingface.co/papers/2508.03828)

·

Aug 5, 2025

[1](https://huggingface.co/login?next=%2Fpapers%2F2606.13669)

### [Agents-K1: Towards Agent-native Knowledge Orchestration](https://huggingface.co/papers/2606.13669)

[Current LLM-based research agents have advanced through agent orchestration, yet largely overlook scientific knowledge orchestration. Existing works often reduce papers to abstracts, surface mentions, and flat cites edges, omitting key entities, claims, evidence, mechanisms, and method lineages essential for scientific reasoning. To this end, we introduce Agents-K1, an end-to-end knowledge orchestration pipeline that converts raw documents into agent-native scientific knowledge graphs. Agents-K1 integrates three components under a unifying theoretical foundation: a multimodal parser whose five-module schema captures entities, multimodal evidence, citations, and typed inter-entity relations across the full paper rather than abstracts alone; a 4B information-extraction backbone trained with GRPO under a rule-based reward; and a graphanything CLI, a tri-source agent interface that unifies web search, multimodal graph retrieval, and cross-document traversal. On top of this, we process 2.46 million scientific papers across six subjects to produce Scholar-KG, of which we release a one-million-paper subset, and the full Scholar-KG is accessible via the SCP link below. The same pipeline can be extended to general-domain corpora and to schema-conformant data synthesis. Extensive experiments demonstrate that Agents-K1 achieves superior performance in scientific information extraction, knowledge graph construction, and multi-hop scientific reasoning.](https://huggingface.co/papers/2606.13669)

[- ![](https://huggingface.co/avatars/90e1928beb2a685e82e19758e4a6b7ae.svg)\\
- ![](https://huggingface.co/avatars/8fec6340b2543489dba6066e27a6bd6d.svg)\\
- 25 authors](https://huggingface.co/papers/2606.13669)

·

Jun 10

[1](https://huggingface.co/login?next=%2Fpapers%2F2404.01019)

### [Source-Aware Training Enables Knowledge Attribution in Language Models](https://huggingface.co/papers/2404.01019)

[Large language models (LLMs) learn a vast amount of knowledge during\\
pretraining, but they are often oblivious to the source(s) of such knowledge.\\
We investigate the problem of intrinsic source citation, where LLMs are\\
required to cite the pretraining source supporting a generated response.\\
Intrinsic sourcecitation can enhance LLM transparency, interpretability, and\\
verifiability. To give LLMs such ability, we explore source-aware training -- a\\
post pretraining recipe that involves (i) training the LLM to associate unique\\
source document identifiers with the knowledge in each document, followed by\\
(ii) an instruction-tuning to teach the LLM to cite a supporting pretraining\\
source when prompted. Source-aware training can easily be applied to pretrained\\
LLMs off the shelf, and diverges minimally from existing\\
pretraining/fine-tuning frameworks. Through experiments on carefully curated\\
data, we demonstrate that our training recipe can enable faithful attribution\\
to the pretraining data without a substantial impact on the model's quality\\
compared to standard pretraining. Our results also highlight the importance of\\
data augmentation in achieving attribution.](https://huggingface.co/papers/2404.01019)

[- ![](https://huggingface.co/avatars/8aecfdea5202968b1099412800a152e0.svg)\\
- 7 authors](https://huggingface.co/papers/2404.01019)

·

Apr 1, 2024

[1](https://huggingface.co/login?next=%2Fpapers%2F2603.03126)

### [The Science Data Lake: A Unified Open Infrastructure Integrating 293 Million Papers Across Eight Scholarly Sources with Embedding-Based Ontology Alignment](https://huggingface.co/papers/2603.03126)

[Scholarly data are largely fragmented across siloed databases with divergent metadata and missing linkages among them. We present the Science Data Lake, a locally-deployable infrastructure built on DuckDB and simple Parquet files that unifies eight open sources - Semantic Scholar, OpenAlex, SciSciNet, Papers with Code, Retraction Watch, Reliance on Science, a preprint-to-published mapping, and Crossref - via DOI normalization while preserving source-level schemas. The resource comprises approximately 960GB of Parquet files spanning ~293 million uniquely identifiable papers across ~22 schemas and ~153 SQL views. An embedding-based ontology alignment using BGE-large sentence embeddings maps 4,516 OpenAlex topics to 13 scientific ontologies (~1.3 million terms), yielding 16,150 mappings covering 99.8% of topics (geq 0.65 threshold) with F1 = 0.77 at the recommended geq 0.85 operating point, outperforming TF-IDF, BM25, and Jaro-Winkler baselines on a 300-pair gold-standard evaluation. We validate through 10 automated checks, cross-source citation agreement analysis (pairwise Pearson r = 0.76 - 0.87), and stratified manual annotation. Four vignettes demonstrate cross-source analyses infeasible with any single database. The resource is open source, deployable on a single drive or queryable remotely via HuggingFace, and includes structured documentation suitable for large language model (LLM) based research agents.](https://huggingface.co/papers/2603.03126)

[- 1 authors](https://huggingface.co/papers/2603.03126)

·

Mar 3

[-](https://huggingface.co/login?next=%2Fpapers%2F2405.02228)

### [Attribution in Scientific Literature: New Benchmark and Methods](https://huggingface.co/papers/2405.02228)

[Large language models (LLMs) present a promising yet challenging frontier for automated sourcecitation in scientific communication. Previous approaches to citation generation have been limited by citation ambiguity and LLM overgeneralization. We introduce REASONS, a novel dataset with sentence-level annotations across 12 scientific domains from arXiv. Our evaluation framework covers two key citation scenarios: indirect queries (matching sentences to paper titles) and direct queries (author attribution), both enhanced with contextual metadata. We conduct extensive experiments with models such as GPT-O1, GPT-4O, GPT-3.5, DeepSeek, and other smaller models like Perplexity AI (7B). While top-tier LLMs achieve high performance in sentence attribution, they struggle with high hallucination rates, a key metric for scientific reliability. Our metadata-augmented approach reduces hallucination rates across all tasks, offering a promising direction for improvement. Retrieval-augmented generation (RAG) with Mistral improves performance in indirect queries, reducing hallucination rates by 42% and maintaining competitive precision with larger models. However, adversarial testing highlights challenges in linking paper titles to abstracts, revealing fundamental limitations in current LLMs. REASONS provides a challenging benchmark for developing reliable and trustworthy LLMs in scientific applications](https://huggingface.co/papers/2405.02228)

[- ![](https://huggingface.co/avatars/41a961fc7d2e9fc71ab5d545ca7fade8.svg)\\
- 7 authors](https://huggingface.co/papers/2405.02228)

·

May 3, 2024

[-](https://huggingface.co/login?next=%2Fpapers%2F2007.07022)

### [Wikipedia Citations: A comprehensive dataset of citations with identifiers extracted from English Wikipedia](https://huggingface.co/papers/2007.07022)

[Wikipedia's contents are based on reliable and published sources. To this date, relatively little is known about what sources Wikipedia relies on, in part because extracting citations and identifying cited sources is challenging. To close this gap, we release Wikipedia Citations, a comprehensive dataset of citations extracted from Wikipedia. A total of 29.3M citations were extracted from 6.1M English Wikipedia articles as of May 2020, and classified as being to books, journal articles or Web contents. We were thus able to extract 4.0M citations to scholarly publications with known identifiers -- including DOI, PMC, PMID, and ISBN -- and further equip an extra 261K citations with DOIs from Crossref. As a result, we find that 6.7% of Wikipedia articles cite at least one journal article with an associated DOI, and that Wikipedia cites just 2% of all articles with a DOI currently indexed in the Web of Science. We release our code to allow the community to extend upon our work and update the dataset in the future.](https://huggingface.co/papers/2007.07022)

[- 3 authors](https://huggingface.co/papers/2007.07022)

·

Nov 22, 2020

[1](https://huggingface.co/login?next=%2Fpapers%2F2601.14949)

### [What Should I Cite? A RAG Benchmark for Academic Citation Prediction](https://huggingface.co/papers/2601.14949)

[With the rapid growth of Web-based academic publications, more and more papers are being published annually, making it increasingly difficult to find relevant prior work. Citation prediction aims to automatically suggest appropriate references, helping scholars navigate the expanding scientific literature. Here we present CiteRAG, the first comprehensive retrieval-augmented generation (RAG)-integrated benchmark for evaluating large language models on academic citation prediction, featuring a multi-level retrieval strategy, specialized retrievers, and generators. Our benchmark makes four core contributions: (1) We establish two instances of the citation prediction task with different granularity. Task 1 focuses on coarse-grained list-specific citation prediction, while Task 2 targets fine-grained position-specific citation prediction. To enhance these two tasks, we build a dataset containing 7,267 instances for Task 1 and 8,541 instances for Task 2, enabling comprehensive evaluation of both retrieval and generation. (2) We construct a three-level large-scale corpus with 554k papers spanning many major subfields, using an incremental pipeline. (3) We propose a multi-level hybrid RAG approach for citation prediction, fine-tuning embedding models with contrastive learning to capture complex citation relationships, paired with specialized generation models. (4) We conduct extensive experiments across state-of-the-art language models, including closed-source APIs, open-source models, and our fine-tuned generators, demonstrating the effectiveness of our framework. Our open-source toolkit enables reproducible evaluation and focuses on academic literature, providing the first comprehensive evaluation framework for citation prediction and serving as a methodological template for other scientific domains. Our source code and data are released at https://github.com/LQgdwind/CiteRAG.](https://huggingface.co/papers/2601.14949)

[- ![](https://huggingface.co/avatars/97cec177a0eb0a8465e3532b888ef1d4.svg)\\
- ![](https://huggingface.co/avatars/37b3e953c5a0d592e0b776513cca242f.svg)\\
- 16 authors](https://huggingface.co/papers/2601.14949)

·

Jan 25

[-](https://huggingface.co/login?next=%2Fpapers%2F2504.14856)

### [Transparentize the Internal and External Knowledge Utilization in LLMs with Trustworthy Citation](https://huggingface.co/papers/2504.14856)

[While hallucinations of large language models could been alleviated through retrieval-augmented generation and citation generation, how the model utilizes internal knowledge is still opaque, and the trustworthiness of its generated answers remains questionable. In this work, we introduce Context-Prior Augmented Citation Generation task, requiring models to generate citations considering both external and internal knowledge while providing trustworthy references, with 5 evaluation metrics focusing on 3 aspects: answer helpfulness, citation faithfulness, and trustworthiness. We introduce RAEL, the paradigm for our task, and also design INTRALIGN, an integrated method containing customary data generation and an alignment algorithm. Our experimental results show that our method achieves a better cross-scenario performance with regard to other baselines. Our extended experiments further reveal that retrieval quality, question types, and model knowledge have considerable influence on the trustworthiness in citation generation.](https://huggingface.co/papers/2504.14856)

[- ![](https://huggingface.co/avatars/69595da5444217a80e479e6fff5a604b.svg)\\
- 7 authors](https://huggingface.co/papers/2504.14856)

·

Apr 20, 2025

[-](https://huggingface.co/login?next=%2Fpapers%2F2602.16942)

### [SourceBench: Can AI Answers Reference Quality Web Sources?](https://huggingface.co/papers/2602.16942)

[Large language models (LLMs) increasingly answer queries by citing web sources, but existing evaluations emphasize answer correctness rather than evidence quality. We introduce SourceBench, a benchmark for measuring the quality of cited web sources across 100 real-world queries spanning informational, factual, argumentative, social, and shopping intents. SourceBench uses an eight-metric framework covering content quality (content relevance, factual accuracy, objectivity) and page-level signals (e.g., freshness, authority/accountability, clarity), and includes a human-labeled dataset with a calibrated LLM-based evaluator that matches expert judgments closely. We evaluate eight LLMs, Google Search, and three AI search tools over 3996 cited sources using SourceBench and conduct further experiments to understand the evaluation results. Overall, our work reveals four key new insights that can guide future research in the direction of GenAI and web search.](https://huggingface.co/papers/2602.16942)

[- 5 authors](https://huggingface.co/papers/2602.16942)

·

Feb 18

[-](https://huggingface.co/login?next=%2Fpapers%2F2509.21557)

### [Generation-Time vs. Post-hoc Citation: A Holistic Evaluation of LLM Attribution](https://huggingface.co/papers/2509.21557)

[Trustworthy Large Language Models (LLMs) must cite human-verifiable sources in high-stakes domains such as healthcare, law, academia, and finance, where even small errors can have severe consequences. Practitioners and researchers face a choice: let models generate citations during decoding, or let models draft answers first and then attach appropriate citations. To clarify this choice, we introduce two paradigms: Generation-Time Citation (G-Cite), which produces the answer and citations in one pass, and Post-hoc Citation (P-Cite), which adds or verifies citations after drafting. We conduct a comprehensive evaluation from zero-shot to advanced retrieval-augmented methods across four popular attribution datasets and provide evidence-based recommendations that weigh trade-offs across use cases. Our results show a consistent trade-off between coverage and citation correctness, with retrieval as the main driver of attribution quality in both paradigms. P-Cite methods achieve high coverage with competitive correctness and moderate latency, whereas G-Cite methods prioritize precision at the cost of coverage and speed. We recommend a retrieval-centric, P-Cite-first approach for high-stakes applications, reserving G-Cite for precision-critical settings such as strict claim verification. Our codes and human evaluation results are available at https://anonymous.4open.science/r/Citation\_Paradigms-BBB5/](https://huggingface.co/papers/2509.21557)

[- ![](https://huggingface.co/avatars/41a961fc7d2e9fc71ab5d545ca7fade8.svg)\\
- 4 authors](https://huggingface.co/papers/2509.21557)

·

Sep 25, 2025

[-](https://huggingface.co/login?next=%2Fpapers%2F2503.23229)

### [Citegeist: Automated Generation of Related Work Analysis on the arXiv\  Corpus](https://huggingface.co/papers/2503.23229)

[Large Language Models provide significant new opportunities for the\\
generation of high-quality written works. However, their employment in the\\
research community is inhibited by their tendency to hallucinate invalid\\
sources and lack of direct access to a knowledge base of relevant scientific\\
articles. In this work, we present Citegeist: An application pipeline using\\
dynamic Retrieval Augmented Generation (RAG) on the arXiv Corpus to generate a\\
related work section and other citation-backed outputs. For this purpose, we\\
employ a mixture of embedding-based similarity matching, summarization, and\\
multi-stage filtering. To adapt to the continuous growth of the document base,\\
we also present an optimized way of incorporating new and modified papers. To\\
enable easy utilization in the scientific community, we release both, a website\\
(https://citegeist.org), as well as an implementation harness that works with\\
several different LLM implementations.](https://huggingface.co/papers/2503.23229)

[- ![](https://huggingface.co/avatars/6b31bf3e1ff8e01baf5aca211fa26608.svg)\\
- 2 authors](https://huggingface.co/papers/2503.23229)

·

Mar 29, 2025

[-](https://huggingface.co/login?next=%2Fpapers%2F2503.02589)

### [MciteBench: A Benchmark for Multimodal Citation Text Generation in MLLMs](https://huggingface.co/papers/2503.02589)

[Multimodal Large Language Models (MLLMs) have advanced in integrating diverse\\
modalities but frequently suffer from hallucination. A promising solution to\\
mitigate this issue is to generate text with citations, providing a transparent\\
chain for verification. However, existing work primarily focuses on generating\\
citations for text-only content, overlooking the challenges and opportunities\\
of multimodal contexts. To address this gap, we introduce MCiteBench, the first\\
benchmark designed to evaluate and analyze the multimodal citation text\\
generation ability of MLLMs. Our benchmark comprises data derived from academic\\
papers and review-rebuttal interactions, featuring diverse information sources\\
and multimodal content. We comprehensively evaluate models from multiple\\
dimensions, including citation quality, source reliability, and answer\\
accuracy. Through extensive experiments, we observe that MLLMs struggle with\\
multimodal citation text generation. We also conduct deep analyses of models'\\
performance, revealing that the bottleneck lies in attributing the correct\\
sources rather than understanding the multimodal content.](https://huggingface.co/papers/2503.02589)

[- 5 authors](https://huggingface.co/papers/2503.02589)

·

Mar 4, 2025

[-](https://huggingface.co/login?next=%2Fpapers%2F2408.04662)

### [Citekit: A Modular Toolkit for Large Language Model Citation Generation](https://huggingface.co/papers/2408.04662)

[Enabling Large Language Models (LLMs) to generate citations in\\
Question-Answering (QA) tasks is an emerging paradigm aimed at enhancing the\\
verifiability of their responses when LLMs are utilizing external references to\\
generate an answer. However, there is currently no unified framework to\\
standardize and fairly compare different citation generation methods, leading\\
to difficulties in reproducing different methods and a comprehensive\\
assessment. To cope with the problems above, we introduce \\name, an open-source\\
and modular toolkit designed to facilitate the implementation and evaluation of\\
existing citation generation methods, while also fostering the development of\\
new approaches to improve citation quality in LLM outputs. This tool is highly\\
extensible, allowing users to utilize 4 main modules and 14 components to\\
construct a pipeline, evaluating an existing method or innovative designs. Our\\
experiments with two state-of-the-art LLMs and 11 citation generation baselines\\
demonstrate varying strengths of different modules in answer accuracy and\\
citation quality improvement, as well as the challenge of enhancing\\
granularity. Based on our analysis of the effectiveness of components, we\\
propose a new method, self-RAG \\snippet, obtaining a balanced answer accuracy\\
and citation quality. Citekit is released at\\
https://github.com/SjJ1017/Citekit.](https://huggingface.co/papers/2408.04662)

[- ![](https://huggingface.co/avatars/69595da5444217a80e479e6fff5a604b.svg)\\
- 5 authors](https://huggingface.co/papers/2408.04662)

·

Aug 5, 2024

[-](https://huggingface.co/login?next=%2Fpapers%2F2412.17534)

### [CiteBART: Learning to Generate Citations for Local Citation\  Recommendation](https://huggingface.co/papers/2412.17534)

[Citations are essential building blocks in scientific writing. The scientific\\
community is longing for support in their generation. Citation generation\\
involves two complementary subtasks: Determining the citation worthiness of a\\
context and, if it's worth it, proposing the best candidate papers for the\\
citation placeholder. The latter subtask is called local citation\\
recommendation (LCR). This paper proposes CiteBART, a custom BART pre-training\\
based on citation token masking to generate citations to achieve LCR. In the\\
base scheme, we mask the citation token in the local citation context to make\\
the citation prediction. In the global one, we concatenate the citing paper's\\
title and abstract to the local citation context to learn to reconstruct the\\
citation token. CiteBART outperforms state-of-the-art approaches on the\\
citation recommendation benchmarks except for the smallest FullTextPeerRead\\
dataset. The effect is significant in the larger benchmarks, e.g., Refseer and\\
ArXiv. We present a qualitative analysis and an ablation study to provide\\
insights into the workings of CiteBART. Our analyses confirm that its\\
generative nature brings about a zero-shot capability.](https://huggingface.co/papers/2412.17534)

[- 2 authors](https://huggingface.co/papers/2412.17534)

·

Dec 23, 2024

[-](https://huggingface.co/login?next=%2Fpapers%2F2408.04568)

### [Learning Fine-Grained Grounded Citations for Attributed Large Language\  Models](https://huggingface.co/papers/2408.04568)

[Despite the impressive performance on information-seeking tasks, large\\
language models (LLMs) still struggle with hallucinations. Attributed LLMs,\\
which augment generated text with in-line citations, have shown potential in\\
mitigating hallucinations and improving verifiability. However, current\\
approaches suffer from suboptimal citation quality due to their reliance on\\
in-context learning. Furthermore, the practice of citing only coarse document\\
identifiers makes it challenging for users to perform fine-grained\\
verification. In this work, we introduce FRONT, a training framework designed\\
to teach LLMs to generate Fine-Grained Grounded Citations. By grounding model\\
outputs in fine-grained supporting quotes, these quotes guide the generation of\\
grounded and consistent responses, not only improving citation quality but also\\
facilitating fine-grained verification. Experiments on the ALCE benchmark\\
demonstrate the efficacy of FRONT in generating superior grounded responses and\\
highly supportive citations. With LLaMA-2-7B, the framework significantly\\
outperforms all the baselines, achieving an average of 14.21% improvement in\\
citation quality across all datasets, even surpassing ChatGPT.](https://huggingface.co/papers/2408.04568)

[- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/6776ae0c91b4c75dac91249c/uJk3ZnRrzjPCcBNjmrWLI.png)\\
- 11 authors](https://huggingface.co/papers/2408.04568)

·

Aug 8, 2024

[-](https://huggingface.co/login?next=%2Fpapers%2F2305.14627)

### [Enabling Large Language Models to Generate Text with Citations](https://huggingface.co/papers/2305.14627)

[Large language models (LLMs) have emerged as a widely-used tool for\\
information seeking, but their generated outputs are prone to hallucination. In\\
this work, we aim to enable LLMs to generate text with citations, improving\\
their factual correctness and verifiability. Existing work mainly relies on\\
commercial search engines and human evaluation, making it challenging to\\
reproduce and compare with different modeling approaches. We propose ALCE, the\\
first benchmark for Automatic LLMs' Citation Evaluation. ALCE collects a\\
diverse set of questions and retrieval corpora and requires building end-to-end\\
systems to retrieve supporting evidence and generate answers with citations. We\\
build automatic metrics along three dimensions -- fluency, correctness, and\\
citation quality -- and demonstrate their strong correlation with human\\
judgements. Our experiments with state-of-the-art LLMs and novel prompting\\
strategies show that current systems have considerable room for improvements --\\
for example, on the ELI5 dataset, even the best model has 49% of its\\
generations lacking complete citation support. Our extensive analyses further\\
highlight promising future directions, including developing better retrievers,\\
advancing long-context LLMs, and improving the ability to synthesize\\
information from multiple sources.](https://huggingface.co/papers/2305.14627)

[- 4 authors](https://huggingface.co/papers/2305.14627)

·

May 23, 2023

[-](https://huggingface.co/login?next=%2Fpapers%2F2605.27700)

### [CiteCheck: Retrieval-Grounded Detection of LLM Citation Hallucinations in Scientific Text](https://huggingface.co/papers/2605.27700)

[Large language models (LLMs) are increasingly used to generate scientific reports, but they can produce references that appear plausible while containing corrupted metadata or pointing to papers that do not exist. We introduce CiteCheck, a hybrid framework for citation hallucination detection that verifies whether a citation corresponds to a real scholarly work and whether its metadata is faithful to that work. CiteCheck retrieves candidate publications from external scholarly sources, compares the citation against the retrieved candidate using a structured LLM verifier, and maps verifier scores into three labels: Exact, Minor, and Major. We also construct a 982-citation physics benchmark with controlled corruptions that capture both subtle metadata drift and fully fabricated references. On the held-out test set, CiteCheck achieves 88.7 macro-F1 and 88.9% accuracy, outperforming GPT, Claude, and Gemini baselines, including web-search and few-shot variants. These results show that reliable citation verification benefits from combining scholarly retrieval, structured LLM-based comparison, and calibrated decision rules.](https://huggingface.co/papers/2605.27700)

[- 4 authors](https://huggingface.co/papers/2605.27700)

·

May 25

[-](https://huggingface.co/login?next=%2Fpapers%2F2504.15629)

### [CiteFix: Enhancing RAG Accuracy Through Post-Processing Citation Correction](https://huggingface.co/papers/2504.15629)

[Retrieval Augmented Generation (RAG) has emerged as a powerful application of Large Language Models (LLMs), revolutionizing information search and consumption. RAG systems combine traditional search capabilities with LLMs to generate comprehensive answers to user queries, ideally with accurate citations. However, in our experience of developing a RAG product, LLMs often struggle with source attribution, aligning with other industry studies reporting citation accuracy rates of only about 74% for popular generative search engines. To address this, we present efficient post-processing algorithms to improve citation accuracy in LLM-generated responses, with minimal impact on latency and cost. Our approaches cross-check generated citations against retrieved articles using methods including keyword + semantic matching, fine tuned model with BERTScore, and a lightweight LLM-based technique. Our experimental results demonstrate a relative improvement of 15.46% in the overall accuracy metrics of our RAG system. This significant enhancement potentially enables a shift from our current larger language model to a relatively smaller model that is approximately 12x more cost-effective and 3x faster in inference time, while maintaining comparable performance. This research contributes to enhancing the reliability and trustworthiness of AI-generated content in information retrieval and summarization tasks which is critical to gain customer trust especially in commercial products.](https://huggingface.co/papers/2504.15629)

[- 3 authors](https://huggingface.co/papers/2504.15629)

·

Jun 10, 2025

[-](https://huggingface.co/login?next=%2Fpapers%2F2508.15396)

### [Attribution, Citation, and Quotation: A Survey of Evidence-based Text\  Generation with Large Language Models](https://huggingface.co/papers/2508.15396)

[The increasing adoption of large language models (LLMs) has been accompanied\\
by growing concerns regarding their reliability and trustworthiness. As a\\
result, a growing body of research focuses on evidence-based text generation\\
with LLMs, aiming to link model outputs to supporting evidence to ensure\\
traceability and verifiability. However, the field is fragmented due to\\
inconsistent terminology, isolated evaluation practices, and a lack of unified\\
benchmarks. To bridge this gap, we systematically analyze 134 papers, introduce\\
a unified taxonomy of evidence-based text generation with LLMs, and investigate\\
300 evaluation metrics across seven key dimensions. Thereby, we focus on\\
approaches that use citations, attribution, or quotations for evidence-based\\
text generation. Building on this, we examine the distinctive characteristics\\
and representative methods in the field. Finally, we highlight open challenges\\
and outline promising directions for future work.](https://huggingface.co/papers/2508.15396)

[- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/648835155219fbf0bde0c3fa/dzbESVOMpz1NHxGOAfHOe.png)\\
- 3 authors](https://huggingface.co/papers/2508.15396)

·

Aug 21, 2025

[1](https://huggingface.co/login?next=%2Fpapers%2F2406.04405)

### [Streamlining and standardizing software citations with The Software\  Citation Station](https://huggingface.co/papers/2406.04405)

[Software is crucial for the advancement of astronomy especially in the\\
context of rapidly growing datasets that increasingly require algorithm and\\
pipeline development to process the data and produce results. However, software\\
has not always been consistently cited, despite its importance to strengthen\\
support for software development. To encourage, streamline, and standardize the\\
process of citing software in academic work such as publications we introduce\\
'The Software Citation Station': a publicly available website and tool to\\
quickly find or add software citations](https://huggingface.co/papers/2406.04405)

[- 2 authors](https://huggingface.co/papers/2406.04405)

·

Jun 6, 2024 [1](https://huggingface.co/papers/2406.04405#community)

[1](https://huggingface.co/login?next=%2Fpapers%2F2412.14457)

### [VISA: Retrieval Augmented Generation with Visual Source Attribution](https://huggingface.co/papers/2412.14457)

[Generation with source attribution is important for enhancing the\\
verifiability of retrieval-augmented generation (RAG) systems. However,\\
existing approaches in RAG primarily link generated content to document-level\\
references, making it challenging for users to locate evidence among multiple\\
content-rich retrieved documents. To address this challenge, we propose\\
Retrieval-Augmented Generation with Visual Source Attribution (VISA), a novel\\
approach that combines answer generation with visual source attribution.\\
Leveraging large vision-language models (VLMs), VISA identifies the evidence\\
and highlights the exact regions that support the generated answers with\\
bounding boxes in the retrieved document screenshots. To evaluate its\\
effectiveness, we curated two datasets: Wiki-VISA, based on crawled Wikipedia\\
webpage screenshots, and Paper-VISA, derived from PubLayNet and tailored to the\\
medical domain. Experimental results demonstrate the effectiveness of VISA for\\
visual source attribution on documents' original look, as well as highlighting\\
the challenges for improvement. Code, data, and model checkpoints will be\\
released.](https://huggingface.co/papers/2412.14457)

[- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/1624866593786-60d97add9fe99457e2010efe.png)\\
- ![](https://huggingface.co/avatars/45b58d912f7d00cb351947cd79d5eeb4.svg)\\
- 6 authors](https://huggingface.co/papers/2412.14457)

·

Dec 18, 2024

[18](https://huggingface.co/login?next=%2Fpapers%2F2602.23452)

### [CiteAudit: You Cited It, But Did You Read It? A Benchmark for Verifying Scientific References in the LLM Era](https://huggingface.co/papers/2602.23452)

[Scientific research relies on accurate citation for attribution and integrity, yet large language models (LLMs) introduce a new risk: fabricated references that appear plausible but correspond to no real publications. Such hallucinated citations have already been observed in submissions and accepted papers at major machine learning venues, exposing vulnerabilities in peer review. Meanwhile, rapidly growing reference lists make manual verification impractical, and existing automated tools remain fragile to noisy and heterogeneous citation formats and lack standardized evaluation. We present the first comprehensive benchmark and detection framework for hallucinated citations in scientific writing. Our multi-agent verification pipeline decomposes citation checking into claim extraction, evidence retrieval, passage matching, reasoning, and calibrated judgment to assess whether a cited source truly supports its claim. We construct a large-scale human-validated dataset across domains and define unified metrics for citation faithfulness and evidence alignment. Experiments with state-of-the-art LLMs reveal substantial citation errors and show that our framework significantly outperforms prior methods in both accuracy and interpretability. This work provides the first scalable infrastructure for auditing citations in the LLM era and practical tools to improve the trustworthiness of scientific references.](https://huggingface.co/papers/2602.23452)

[![notredame](https://cdn-avatars.huggingface.co/v1/production/uploads/noauth/RJJ94XCJw7R0WkOyrvXIU.png)University of Notre Dame](https://huggingface.co/notredame)

·

Feb 26 [3](https://huggingface.co/papers/2602.23452#community)

[1](https://huggingface.co/login?next=%2Fpapers%2F2407.12861)

### [CiteME: Can Language Models Accurately Cite Scientific Claims?](https://huggingface.co/papers/2407.12861)

[Thousands of new scientific papers are published each month. Such information\\
overload complicates researcher efforts to stay current with the\\
state-of-the-art as well as to verify and correctly attribute claims. We pose\\
the following research question: Given a text excerpt referencing a paper,\\
could an LM act as a research assistant to correctly identify the referenced\\
paper? We advance efforts to answer this question by building a benchmark that\\
evaluates the abilities of LMs in citation attribution. Our benchmark, CiteME,\\
consists of text excerpts from recent machine learning papers, each referencing\\
a single other paper. CiteME use reveals a large gap between frontier LMs and\\
human performance, with LMs achieving only 4.2-18.5% accuracy and humans 69.7%.\\
We close this gap by introducing CiteAgent, an autonomous system built on the\\
GPT-4o LM that can also search and read papers, which achieves an accuracy of\\
35.3\\% on CiteME. Overall, CiteME serves as a challenging testbed for\\
open-ended claim attribution, driving the research community towards a future\\
where any claim made by an LM can be automatically verified and discarded if\\
found to be incorrect.](https://huggingface.co/papers/2407.12861)

[- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/6304da46ce6b12280b1bd575/V96ocKW4HOoysAGxuAH1X.jpeg)\\
- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/6464a0d41683d3c81f51924a/s7yYVwfUB4WOhVFJS6A6T.jpeg)\\
- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/64ff3944f0d65cca9b867ed2/jWnHkF4AUzh51MkC0UT6b.png)\\
- 6 authors](https://huggingface.co/papers/2407.12861)

·

Jul 10, 2024

[-](https://huggingface.co/login?next=%2Fpapers%2F1703.05051)

### [Deep learning with convolutional neural networks for EEG decoding and\  visualization](https://huggingface.co/papers/1703.05051)

[PLEASE READ AND CITE THE REVISED VERSION at Human Brain Mapping:\\
http://onlinelibrary.wiley.com/doi/10.1002/hbm.23730/full\\
Code available here: https://github.com/robintibor/braindecode](https://huggingface.co/papers/1703.05051)

[- 9 authors](https://huggingface.co/papers/1703.05051)

·

Mar 15, 2017

[-](https://huggingface.co/login?next=%2Fpapers%2F2505.02164)

### [Incorporating Legal Structure in Retrieval-Augmented Generation: A Case\  Study on Copyright Fair Use](https://huggingface.co/papers/2505.02164)

[This paper presents a domain-specific implementation of Retrieval-Augmented\\
Generation (RAG) tailored to the Fair Use Doctrine in U.S. copyright law.\\
Motivated by the increasing prevalence of DMCA takedowns and the lack of\\
accessible legal support for content creators, we propose a structured approach\\
that combines semantic search with legal knowledge graphs and court citation\\
networks to improve retrieval quality and reasoning reliability. Our prototype\\
models legal precedents at the statutory factor level (e.g., purpose, nature,\\
amount, market effect) and incorporates citation-weighted graph representations\\
to prioritize doctrinally authoritative sources. We use Chain-of-Thought\\
reasoning and interleaved retrieval steps to better emulate legal reasoning.\\
Preliminary testing suggests this method improves doctrinal relevance in the\\
retrieval process, laying groundwork for future evaluation and deployment of\\
LLM-based legal assistance tools.](https://huggingface.co/papers/2505.02164)

[- 3 authors](https://huggingface.co/papers/2505.02164)

·

May 4, 2025

[-](https://huggingface.co/login?next=%2Fpapers%2F1801.09322)

### [Benchmarking Clinical Decision Support Search](https://huggingface.co/papers/1801.09322)

[Finding relevant literature underpins the practice of evidence-based\\
medicine. From 2014 to 2016, TREC conducted a clinical decision support track,\\
wherein participants were tasked with finding articles relevant to clinical\\
questions posed by physicians. In total, 87 teams have participated over the\\
past three years, generating 395 runs. During this period, each team has\\
trialled a variety of methods. While there was significant overlap in the\\
methods employed by different teams, the results were varied. Due to the\\
diversity of the platforms used, the results arising from the different\\
techniques are not directly comparable, reducing the ability to build on\\
previous work. By using a stable platform, we have been able to compare\\
different document and query processing techniques, allowing us to experiment\\
with different search parameters. We have used our system to reproduce leading\\
teams runs, and compare the results obtained. By benchmarking our indexing and\\
search techniques, we can statistically test a variety of hypotheses, paving\\
the way for further research.](https://huggingface.co/papers/1801.09322)

[- 4 authors](https://huggingface.co/papers/1801.09322)

·

Jan 28, 2018

[36](https://huggingface.co/login?next=%2Fpapers%2F2502.09604)

### [SelfCite: Self-Supervised Alignment for Context Attribution in Large\  Language Models](https://huggingface.co/papers/2502.09604)

[We introduce SelfCite, a novel self-supervised approach that aligns LLMs to\\
generate high-quality, fine-grained, sentence-level citations for the\\
statements in their generated responses. Instead of only relying on costly and\\
labor-intensive annotations, SelfCite leverages a reward signal provided by the\\
LLM itself through context ablation: If a citation is necessary, removing the\\
cited text from the context should prevent the same response; if sufficient,\\
retaining the cited text alone should preserve the same response. This reward\\
can guide the inference-time best-of-N sampling strategy to improve citation\\
quality significantly, as well as be used in preference optimization to\\
directly fine-tune the models for generating better citations. The\\
effectiveness of SelfCite is demonstrated by increasing citation F1 up to 5.3\\
points on the LongBench-Cite benchmark across five long-form question answering\\
tasks.](https://huggingface.co/papers/2502.09604)

[- ![](https://huggingface.co/avatars/860a5011f150537eb923f76d354f1bc5.svg)\\
- ![](https://huggingface.co/avatars/87708c86c1baef548ef556f5d32dca71.svg)\\
- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/1659455519119-613f897ffbfd59f147a88c81.jpeg)\\
- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/639aaf82a4c528850bba2bfe/nn23r8bsNiOJzVUxAPfo7.png)\\
- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/1650651305661-5df84571da6d0311fd3d5407.png)\\
- 9 authors](https://huggingface.co/papers/2502.09604)

·

Feb 13, 2025[2](https://huggingface.co/papers/2502.09604#community)

[-](https://huggingface.co/login?next=%2Fpapers%2F2304.09848)

### [Evaluating Verifiability in Generative Search Engines](https://huggingface.co/papers/2304.09848)

[Generative search engines directly generate responses to user queries, along\\
with in-line citations. A prerequisite trait of a trustworthy generative search\\
engine is verifiability, i.e., systems should cite comprehensively (high\\
citation recall; all statements are fully supported by citations) and\\
accurately (high citation precision; every cite supports its associated\\
statement). We conduct human evaluation to audit four popular generative search\\
engines -- Bing Chat, NeevaAI, perplexity.ai, and YouChat -- across a diverse\\
set of queries from a variety of sources (e.g., historical Google user queries,\\
dynamically-collected open-ended questions on Reddit, etc.). We find that\\
responses from existing generative search engines are fluent and appear\\
informative, but frequently contain unsupported statements and inaccurate\\
citations: on average, a mere 51.5% of generated sentences are fully supported\\
by citations and only 74.5% of citations support their associated sentence. We\\
believe that these results are concerningly low for systems that may serve as a\\
primary tool for information-seeking users, especially given their facade of\\
trustworthiness. We hope that our results further motivate the development of\\
trustworthy generative search engines and help researchers and users better\\
understand the shortcomings of existing commercial systems.](https://huggingface.co/papers/2304.09848)

[- 3 authors](https://huggingface.co/papers/2304.09848)

·

Apr 19, 2023

[7](https://huggingface.co/login?next=%2Fpapers%2F2601.18724)

### [HalluCitation Matters: Revealing the Impact of Hallucinated References with 300 Hallucinated Papers in ACL Conferences](https://huggingface.co/papers/2601.18724)

[Recently, we have often observed hallucinated citations or references that do not correspond to any existing work in papers under review, preprints, or published papers. Such hallucinated citations pose a serious concern to scientific reliability. When they appear in accepted papers, they may also negatively affect the credibility of conferences. In this study, we refer to hallucinated citations as "HalluCitation" and systematically investigate their prevalence and impact. We analyze all papers published at ACL, NAACL, and EMNLP in 2024 and 2025, including main conference, Findings, and workshop papers. Our analysis reveals that nearly 300 papers contain at least one HalluCitation, most of which were published in 2025. Notably, half of these papers were identified at EMNLP 2025, the most recent conference, indicating that this issue is rapidly increasing. Moreover, more than 100 such papers were accepted as main conference and Findings papers at EMNLP 2025, affecting the credibility.](https://huggingface.co/papers/2601.18724)

[- 3 authors](https://huggingface.co/papers/2601.18724)

·

Jan 26 [2](https://huggingface.co/papers/2601.18724#community)

[-](https://huggingface.co/login?next=%2Fpapers%2F2307.16883)

### [HAGRID: A Human-LLM Collaborative Dataset for Generative\  Information-Seeking with Attribution](https://huggingface.co/papers/2307.16883)

[The rise of large language models (LLMs) had a transformative impact on\\
search, ushering in a new era of search engines that are capable of generating\\
search results in natural language text, imbued with citations for supporting\\
sources. Building generative information-seeking models demands openly\\
accessible datasets, which currently remain lacking. In this paper, we\\
introduce a new dataset, HAGRID (Human-in-the-loop Attributable Generative\\
Retrieval for Information-seeking Dataset) for building end-to-end generative\\
information-seeking models that are capable of retrieving candidate quotes and\\
generating attributed explanations. Unlike recent efforts that focus on human\\
evaluation of black-box proprietary search engines, we built our dataset atop\\
the English subset of MIRACL, a publicly available information retrieval\\
dataset. HAGRID is constructed based on human and LLM collaboration. We first\\
automatically collect attributed explanations that follow an in-context\\
citation style using an LLM, i.e. GPT-3.5. Next, we ask human annotators to\\
evaluate the LLM explanations based on two criteria: informativeness and\\
attributability. HAGRID serves as a catalyst for the development of\\
information-seeking models with better attribution capabilities.](https://huggingface.co/papers/2307.16883)

[- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/1612277330660-noauth.jpeg)\\
- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/1665676377085-611fb1cbfa8355ed0309de81.jpeg)\\
- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/no-auth/PgoKCXRhe7yhEzBpvwQf2.png)\\
- 5 authors](https://huggingface.co/papers/2307.16883)

·

Jul 31, 2023

[-](https://huggingface.co/login?next=%2Fpapers%2F2305.18248)

### [Do Language Models Know When They're Hallucinating References?](https://huggingface.co/papers/2305.18248)

[State-of-the-art language models (LMs) are notoriously susceptible to\\
generating hallucinated information. Such inaccurate outputs not only undermine\\
the reliability of these models but also limit their use and raise serious\\
concerns about misinformation and propaganda. In this work, we focus on\\
hallucinated book and article references and present them as the "model\\
organism" of language model hallucination research, due to their frequent and\\
easy-to-discern nature. We posit that if a language model cites a particular\\
reference in its output, then it should ideally possess sufficient information\\
about its authors and content, among other relevant details. Using this basic\\
insight, we illustrate that one can identify hallucinated references without\\
ever consulting any external resources, by asking a set of direct or indirect\\
queries to the language model about the references. These queries can be\\
considered as "consistency checks." Our findings highlight that while LMs,\\
including GPT-4, often produce inconsistent author lists for hallucinated\\
references, they also often accurately recall the authors of real references.\\
In this sense, the LM can be said to "know" when it is hallucinating\\
references. Furthermore, these findings show how hallucinated references can be\\
dissected to shed light on their nature. Replication code and results can be\\
found at https://github.com/microsoft/hallucinated-references.](https://huggingface.co/papers/2305.18248)

[- ![](https://huggingface.co/avatars/692aa11b62ac880833a8a183018bec70.svg)\\
- ![](https://huggingface.co/avatars/3c847a33ea10b630830e5a95b5fd38bc.svg)\\
- ![](https://huggingface.co/avatars/8b54907c6a1ea90a1242f26e03e117af.svg)\\
- 4 authors](https://huggingface.co/papers/2305.18248)

·

May 29, 2023

[-](https://huggingface.co/login?next=%2Fpapers%2F2511.08877)

### [Hierarchical Memorization in Large Language Models: Evidence from Citation Generation](https://huggingface.co/papers/2511.08877)

[Large language models (LLMs) generate fluent text across a wide range of tasks, but the fabrication of non-existent academic citations remains a critical and well-documented failure mode. Building on prior work that frames hallucination and verbatim memorization as outcomes of the same probabilistic process, this study uses citation count as a proxy for training data redundancy and asks how this redundancy is internally structured within a single bibliographic record. Using GPT-4.1, we generated and manually verified 100 citations across twenty computer-science domains, measuring factual fidelity via cosine similarity against authentic metadata. We find that (i) factual accuracy varies substantially across domains and scales log-linearly with citation count, (ii) the model crosses two empirically identifiable thresholds; an inflection around 90 citations and a saturation point near 1,200 citations beyond which records are reproduced nearly verbatim, (iii) memorization is hierarchical, with titles and first authors recalled earliest while venues and numeric fields require far greater redundancy and publication years remain essentially unlearned, and (iv) even highly cited records can be conflated when their titles and authors overlap, an effect interpretable as spurious-attractor interference. Memorization in LLMs is therefore not a binary on/off state but a graduated, hierarchically layered phenomenon shaped by the uneven distribution of knowledge in the pretraining corpus.](https://huggingface.co/papers/2511.08877)

[- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/6628917fd59deb30bb12896d/UsNx0XmCONNnCghxDDLAy.jpeg)\\
- 1 authors](https://huggingface.co/papers/2511.08877)

·

May 4

[9](https://huggingface.co/login?next=%2Fpapers%2F2510.17853)

### [CiteGuard: Faithful Citation Attribution for LLMs via\  Retrieval-Augmented Validation](https://huggingface.co/papers/2510.17853)

[Large Language Models (LLMs) have emerged as promising assistants for\\
scientific writing. However, there have been concerns regarding the quality and\\
reliability of the generated text, one of which is the citation accuracy and\\
faithfulness. While most recent work relies on methods such as LLM-as-a-Judge,\\
the reliability of LLM-as-a-Judge alone is also in doubt. In this work, we\\
reframe citation evaluation as a problem of citation attribution alignment,\\
which is assessing whether LLM-generated citations match those a human author\\
would include for the same text. We propose CiteGuard, a retrieval-aware agent\\
framework designed to provide more faithful grounding for citation validation.\\
CiteGuard improves the prior baseline by 12.3%, and achieves up to 65.4%\\
accuracy on the CiteME benchmark, on par with human-level performance (69.7%).\\
It also enables the identification of alternative but valid citations.](https://huggingface.co/papers/2510.17853)

[![AI4Research](https://cdn-avatars.huggingface.co/v1/production/uploads/628ba530ac304a69264afb75/WyWIlSfjWCtXtKrg6NwvC.png)AI4Research](https://huggingface.co/AI4Research)

·

Oct 14, 2025[3](https://huggingface.co/papers/2510.17853#community)

[-](https://huggingface.co/login?next=%2Fpapers%2F2511.09685)

### [What did Elon change? A comprehensive analysis of Grokipedia](https://huggingface.co/papers/2511.09685)

[Elon Musk released Grokipedia on 27 October 2025 to provide an alternative to Wikipedia, the crowdsourced online encyclopedia. In this paper, we provide the first comprehensive analysis of Grokipedia and compare it to a dump of Wikipedia, with a focus on article similarity and citation practices. Although Grokipedia articles are much longer than their corresponding English Wikipedia articles, we find that much of Grokipedia's content (including both articles with and without Creative Commons licenses) is highly derivative of Wikipedia. Nevertheless, citation practices between the sites differ greatly, with Grokipedia citing many more sources deemed "generally unreliable" or "blacklisted" by the English Wikipedia community and low quality by external scholars, including dozens of citations to sites like Stormfront and Infowars. We then analyze article subsets: one about elected officials, one about controversial topics, and one random subset for which we derive article quality and topic. We find that the elected official and controversial article subsets showed less similarity between their Wikipedia version and Grokipedia version than other pages. The random subset illustrates that Grokipedia focused rewriting the highest quality articles on Wikipedia, with a bias towards biographies, politics, society, and history. Finally, we publicly release our nearly-full scrape of Grokipedia, as well as embeddings of the entire Grokipedia corpus.](https://huggingface.co/papers/2511.09685)

[- 2 authors](https://huggingface.co/papers/2511.09685)

·

Nov 12, 2025

[1](https://huggingface.co/login?next=%2Fpapers%2F2009.11027)

### [KoBE: Knowledge-Based Machine Translation Evaluation](https://huggingface.co/papers/2009.11027)

[We propose a simple and effective method for machine translation evaluation\\
which does not require reference translations. Our approach is based on (1)\\
grounding the entity mentions found in each source sentence and candidate\\
translation against a large-scale multilingual knowledge base, and (2)\\
measuring the recall of the grounded entities found in the candidate vs. those\\
found in the source. Our approach achieves the highest correlation with human\\
judgements on 9 out of the 18 language pairs from the WMT19 benchmark for\\
evaluation without references, which is the largest number of wins for a single\\
evaluation method on this task. On 4 language pairs, we also achieve higher\\
correlation with human judgements than BLEU. To foster further research, we\\
release a dataset containing 1.8 million grounded entity mentions across 18\\
language pairs from the WMT19 metrics track data.](https://huggingface.co/papers/2009.11027)

[- ![](https://huggingface.co/avatars/fa15d117e8ce8c50669455d3e483408b.svg)\\
- 5 authors](https://huggingface.co/papers/2009.11027)

·

Sep 23, 2020

[-](https://huggingface.co/login?next=%2Fpapers%2F2110.06595)

### [Refcat: The Internet Archive Scholar Citation Graph](https://huggingface.co/papers/2110.06595)

[As part of its scholarly data efforts, the Internet Archive (IA) releases a\\
first version of a citation graph dataset, named refcat, derived from scholarly\\
publications and additional data sources. It is composed of data gathered by\\
the fatcat cataloging project (the catalog that underpins IA Scholar), related\\
web-scale crawls targeting primary and secondary scholarly outputs, as well as\\
metadata from the Open Library project and Wikipedia. This first version of the\\
graph consists of over 1.3B citations. We release this dataset under a CC0\\
Public Domain Dedication, accessible through Internet Archive. The source code\\
used for the derivation process, including exact and fuzzy citation matching,\\
is released under an MIT license. The goal of this report is to describe\\
briefly the current contents and the derivation of the dataset.](https://huggingface.co/papers/2110.06595)

[- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/62fa405be8c9c532aa761014/g77sNp9l4mcPEo_RZ2xjF.png)\\
- 3 authors](https://huggingface.co/papers/2110.06595)

·

Oct 13, 2021

[-](https://huggingface.co/login?next=%2Fpapers%2F2305.06311)

### [Automatic Evaluation of Attribution by Large Language Models](https://huggingface.co/papers/2305.06311)

[A recent focus of large language model (LLM) development, as exemplified by\\
generative search engines, is to incorporate external references to generate\\
and support their claims. However, evaluating the attribution, i.e., verifying\\
whether the generated statement is indeed fully supported by the cited\\
reference, remains an open problem. Although human evaluation is common\\
practice, it is costly and time-consuming. In this paper, we investigate the\\
automatic evaluation of attribution by LLMs. We begin by providing a definition\\
of attribution and then explore two approaches for automatic evaluation:\\
prompting LLMs and fine-tuning smaller LMs. The fine-tuning data is repurposed\\
from related tasks, such as question answering, fact-checking, natural language\\
inference, and summarization. To facilitate the evaluation, we manually curate\\
a set of test examples covering 12 domains from a generative search engine, New\\
Bing. Our results on the curated test set and simulated test examples from\\
existing benchmark questions highlight both promising signals as well as\\
remaining challenges for the automatic evaluation of attribution. We hope our\\
testbed, modeling methodology, and insights will help lay the foundation for\\
future studies on this important problem.](https://huggingface.co/papers/2305.06311)

[- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/6477a323dbc2a416f8b852b3/mRKW5kT9GASORT4YnaZz0.jpeg)\\
- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/6494bbbb185ae221545a0ef6/oA6HXlD0KnNfttYf2f_qD.jpeg)\\
- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/63e0a50242591dda0b9dca5c/c7cBPEBWQDFYimfGnO_SI.png)\\
- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/6230d750d93e84e233882dbc/4MGEekLW3oWzqeFWDWvIK.jpeg)\\
- 6 authors](https://huggingface.co/papers/2305.06311)

·

May 10, 2023

[-](https://huggingface.co/login?next=%2Fpapers%2F2402.04315)

### [Training Language Models to Generate Text with Citations via\  Fine-grained Rewards](https://huggingface.co/papers/2402.04315)

[While recent Large Language Models (LLMs) have proven useful in answering\\
user queries, they are prone to hallucination, and their responses often lack\\
credibility due to missing references to reliable sources. An intuitive\\
solution to these issues would be to include in-text citations referring to\\
external documents as evidence. While previous works have directly prompted\\
LLMs to generate in-text citations, their performances are far from\\
satisfactory, especially when it comes to smaller LLMs. In this work, we\\
propose an effective training framework using fine-grained rewards to teach\\
LLMs to generate highly supportive and relevant citations, while ensuring the\\
correctness of their responses. We also conduct a systematic analysis of\\
applying these fine-grained rewards to common LLM training strategies,\\
demonstrating its advantage over conventional practices. We conduct extensive\\
experiments on Question Answering (QA) datasets taken from the ALCE benchmark\\
and validate the model's generalizability using EXPERTQA. On LLaMA-2-7B, the\\
incorporation of fine-grained rewards achieves the best performance among the\\
baselines, even surpassing that of GPT-3.5-turbo.](https://huggingface.co/papers/2402.04315)

[- ![](https://huggingface.co/avatars/d7308899b46232cad4a48a0e876449a8.svg)\\
- ![](https://huggingface.co/avatars/fee73f1e15502ca51f8a7a928f653d31.svg)\\
- 4 authors](https://huggingface.co/papers/2402.04315)

·

Feb 6, 2024

[-](https://huggingface.co/login?next=%2Fpapers%2F2410.23166)

### [SciPIP: An LLM-based Scientific Paper Idea Proposer](https://huggingface.co/papers/2410.23166)

[The exponential growth of knowledge and the increasing complexity of\\
interdisciplinary research pose significant challenges for researchers,\\
including information overload and difficulties in exploring novel ideas. The\\
advancements in large language models (LLMs), such as GPT-4, have shown great\\
potential in enhancing idea proposals, but how to effectively utilize large\\
models for reasonable idea proposal has not been thoroughly explored. This\\
paper proposes a scientific paper idea proposer (SciPIP). Based on a\\
user-provided research background, SciPIP retrieves helpful papers from a\\
literature database while leveraging the capabilities of LLMs to generate more\\
novel and feasible ideas. To this end, 1) we construct a literature retrieval\\
database, extracting lots of papers' multi-dimension information for fast\\
access. Then, a literature retrieval method based on semantics, entity, and\\
citation co-occurrences is proposed to search relevant literature from multiple\\
aspects based on the user-provided background. 2) After literature retrieval,\\
we introduce dual-path idea proposal strategies, where one path infers\\
solutions from the retrieved literature and the other path generates original\\
ideas through model brainstorming. We then combine the two to achieve a good\\
balance between feasibility and originality. Through extensive experiments on\\
the natural language processing (NLP) field, we demonstrate that SciPIP can\\
retrieve citations similar to those of existing top conference papers and\\
generate many ideas consistent with them. Additionally, we evaluate the\\
originality of other ideas generated by SciPIP using large language models,\\
further validating the effectiveness of our proposed method. The code and the\\
database are released at https://github.com/cheerss/SciPIP.](https://huggingface.co/papers/2410.23166)

[- 10 authors](https://huggingface.co/papers/2410.23166)

·

Oct 30, 2024

[-](https://huggingface.co/login?next=%2Fpapers%2F2305.14904)

### [Identifying Informational Sources in News Articles](https://huggingface.co/papers/2305.14904)

[News articles are driven by the informational sources journalists use in\\
reporting. Modeling when, how and why sources get used together in stories can\\
help us better understand the information we consume and even help journalists\\
with the task of producing it. In this work, we take steps toward this goal by\\
constructing the largest and widest-ranging annotated dataset, to date, of\\
informational sources used in news writing. We show that our dataset can be\\
used to train high-performing models for information detection and source\\
attribution. We further introduce a novel task, source prediction, to study the\\
compositionality of sources in news articles. We show good performance on this\\
task, which we argue is an important proof for narrative science exploring the\\
internal structure of news articles and aiding in planning-based language\\
generation, and an important step towards a source-recommendation system to aid\\
journalists.](https://huggingface.co/papers/2305.14904)

[- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/64c13de54cbd12e168f09a58/Aw5BaNzf6uuwqQ333OQ5y.png)\\
- ![](https://huggingface.co/avatars/9ac6db8b8541162ee625a8929a2736ee.svg)\\
- 4 authors](https://huggingface.co/papers/2305.14904)

·

May 24, 2023

[3](https://huggingface.co/login?next=%2Fpapers%2F2608.12571)

### [Is this Citation on Point?](https://huggingface.co/papers/2608.12571)

[In 2023, a New York judge sanctioned two attorneys in Mata v. Avianca for filing a brief with hallucinated citations generated by ChatGPT. Such failures are largely caught by database lookups; the harder problem is detecting citations that point to real cases but do not support the propositions for which they are offered -- a failure mode that existing evaluations of LLMs for legal use cases largely overlook. In this paper, we study proposition-level citation support verification through controlled perturbations of real legal citations obtained from two legal corpora, either replacing the cited case or changing only the pinpoint page within the same case. We evaluate fourteen model configurations on the resulting examples. Models catch 93-100% of wrong-case corruptions. They catch only 37-61% of wrong-pinpoint corruptions on court opinions and 52-83% on legal briefs. When models fail to catch wrong-pinpoint corruptions, they accept the citation based on topical overlap rather than page-level support. Scale and extended reasoning narrow the gap but do not close it: GPT-5.4 with high reasoning effort still misses 40% of pinpoint mismatches on court opinions and 18% on briefs. Prompting the model to verify support at the cited page improves recall, but it also raises the false positive rate. Recognizing the right legal topic and verifying support for the cited proposition are distinct capabilities, and current models conflate them.](https://huggingface.co/papers/2608.12571)

[![bloomberg](https://cdn-avatars.huggingface.co/v1/production/uploads/5dd96eb166059660ed1ee413/LnZPhCgIZ_DrtBlbtxcFD.png)Bloomberg](https://huggingface.co/bloomberg)

·

Aug 11 [2](https://huggingface.co/papers/2608.12571#community)

[-](https://huggingface.co/login?next=%2Fpapers%2F2407.18940)

### [LitSearch: A Retrieval Benchmark for Scientific Literature Search](https://huggingface.co/papers/2407.18940)

[Literature search questions, such as "where can I find research on the\\
evaluation of consistency in generated summaries?" pose significant challenges\\
for modern search engines and retrieval systems. These questions often require\\
a deep understanding of research concepts and the ability to reason over entire\\
articles. In this work, we introduce LitSearch, a retrieval benchmark\\
comprising 597 realistic literature search queries about recent ML and NLP\\
papers. LitSearch is constructed using a combination of (1) questions generated\\
by GPT-4 based on paragraphs containing inline citations from research papers\\
and (2) questions about recently published papers, manually written by their\\
authors. All LitSearch questions were manually examined or edited by experts to\\
ensure high quality. We extensively benchmark state-of-the-art retrieval models\\
and also evaluate two LLM-based reranking pipelines. We find a significant\\
performance gap between BM25 and state-of-the-art dense retrievers, with a\\
24.8% difference in absolute recall@5. The LLM-based reranking strategies\\
further improve the best-performing dense retriever by 4.4%. Additionally,\\
commercial search engines and research tools like Google Search perform poorly\\
on LitSearch, lagging behind the best dense retriever by 32 points. Taken\\
together, these results show that LitSearch is an informative new testbed for\\
retrieval systems while catering to a real-world use case.](https://huggingface.co/papers/2407.18940)

[- 6 authors](https://huggingface.co/papers/2407.18940)

·

Jul 10, 2024

[2](https://huggingface.co/login?next=%2Fpapers%2F2506.00249)

### [MIR: Methodology Inspiration Retrieval for Scientific Research Problems](https://huggingface.co/papers/2506.00249)

[There has been a surge of interest in harnessing the reasoning capabilities\\
of Large Language Models (LLMs) to accelerate scientific discovery. While\\
existing approaches rely on grounding the discovery process within the relevant\\
literature, effectiveness varies significantly with the quality and nature of\\
the retrieved literature. We address the challenge of retrieving prior work\\
whose concepts can inspire solutions for a given research problem, a task we\\
define as Methodology Inspiration Retrieval (MIR). We construct a novel dataset\\
tailored for training and evaluating retrievers on MIR, and establish\\
baselines. To address MIR, we build the Methodology Adjacency Graph (MAG);\\
capturing methodological lineage through citation relationships. We leverage\\
MAG to embed an "intuitive prior" into dense retrievers for identifying\\
patterns of methodological inspiration beyond superficial semantic similarity.\\
This achieves significant gains of +5.4 in Recall@3 and +7.8 in Mean Average\\
Precision (mAP) over strong baselines. Further, we adapt LLM-based re-ranking\\
strategies to MIR, yielding additional improvements of +4.5 in Recall@3 and\\
+4.8 in mAP. Through extensive ablation studies and qualitative analyses, we\\
exhibit the promise of MIR in enhancing automated scientific discovery and\\
outline avenues for advancing inspiration-driven retrieval.](https://huggingface.co/papers/2506.00249)

[- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/no-auth/dn_Rg4NP4Lkl2tPLTtF9K.png)\\
- ![](https://huggingface.co/avatars/8f4f79c2f5fbd69b498cbe03c6c2e9a2.svg)\\
- 6 authors](https://huggingface.co/papers/2506.00249)

·

May 30, 2025

[5](https://huggingface.co/login?next=%2Fpapers%2F2608.03756)

### [LegalPincite: Multi-level Legal Information Retrieval Dataset](https://huggingface.co/papers/2608.03756)

[A common task in legal Information Retrieval (IR) is to find relevant legal sources from case-law collections. While legal practice often requires pinpoint citations (pincites) to specific case paragraphs, most existing public legal IR datasets lack paragraph-level citation annotations. Yet, publicly available datasets with such information contain data leakage in the query text and exclude paragraphs that are neither citing nor cited from the corpora, creating an unrealistic and oversimplified retrieval setting, potentially leading to inflated performance. To address these limitations, we contribute a large-scale legal IR dataset constructed from Court of Justice of the European Union (CJEU) judgments. The dataset contains: (i) masked case/paragraph queries, with removed citation information; (ii) a corpus that includes all paragraphs; and (iii) case- and paragraph-level ground-truth citations, with partial human expert validation. Our dataset supports both the development and rigorous evaluation of legal IR methods, at multiple query-document levels (case-to-case, paragraph-to-case, and paragraph-to-paragraph retrieval). Link to dataset: https://huggingface.co/datasets/theresiavr/legalpincite](https://huggingface.co/papers/2608.03756)

[- ![](https://huggingface.co/avatars/dbbf67f27593a510177dff06b00bf098.svg)\\
- 3 authors](https://huggingface.co/papers/2608.03756)

·

Aug 3[2](https://huggingface.co/papers/2608.03756#community)

[7](https://huggingface.co/login?next=%2Fpapers%2F2406.13663)

### [Model Internals-based Answer Attribution for Trustworthy\  Retrieval-Augmented Generation](https://huggingface.co/papers/2406.13663)

[Ensuring the verifiability of model answers is a fundamental challenge for\\
retrieval-augmented generation (RAG) in the question answering (QA) domain.\\
Recently, self-citation prompting was proposed to make large language models\\
(LLMs) generate citations to supporting documents along with their answers.\\
However, self-citing LLMs often struggle to match the required format, refer to\\
non-existent sources, and fail to faithfully reflect LLMs' context usage\\
throughout the generation. In this work, we present MIRAGE --Model\\
Internals-based RAG Explanations -- a plug-and-play approach using model\\
internals for faithful answer attribution in RAG applications. MIRAGE detects\\
context-sensitive answer tokens and pairs them with retrieved documents\\
contributing to their prediction via saliency methods. We evaluate our proposed\\
approach on a multilingual extractive QA dataset, finding high agreement with\\
human answer attribution. On open-ended QA, MIRAGE achieves citation quality\\
and efficiency comparable to self-citation while also allowing for a\\
finer-grained control of attribution parameters. Our qualitative evaluation\\
highlights the faithfulness of MIRAGE's attributions and underscores the\\
promising application of model internals for RAG answer attribution.](https://huggingface.co/papers/2406.13663)

[- ![](https://huggingface.co/avatars/a6d3d10929fcf99e58391a55b5250bd4.svg)\\
- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/5e7749883d77a72421292d07/M4AmBReZk_otxCIG3o0bL.jpeg)\\
- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/645a415077d040cfd64e036e/dWTaqIaMFP4bUmNISnN8S.jpeg)\\
- 4 authors](https://huggingface.co/papers/2406.13663)

·

Jun 19, 2024[1](https://huggingface.co/papers/2406.13663#community)

[-](https://huggingface.co/login?next=%2Fpapers%2F1902.06006)

### [Contextual Word Representations: A Contextual Introduction](https://huggingface.co/papers/1902.06006)

[This introduction aims to tell the story of how we put words into computers. It is part of the story of the field of natural language processing (NLP), a branch of artificial intelligence. It targets a wide audience with a basic understanding of computer programming, but avoids a detailed mathematical treatment, and it does not present any algorithms. It also does not focus on any particular application of NLP such as translation, question answering, or information extraction. The ideas presented here were developed by many researchers over many decades, so the citations are not exhaustive but rather direct the reader to a handful of papers that are, in the author's view, seminal. After reading this document, you should have a general understanding of word vectors (also known as word embeddings): why they exist, what problems they solve, where they come from, how they have changed over time, and what some of the open questions about them are. Readers already familiar with word vectors are advised to skip to Section 5 for the discussion of the most recent advance, contextual word vectors.](https://huggingface.co/papers/1902.06006)

[- 1 authors](https://huggingface.co/papers/1902.06006)

·

Apr 16, 2020

[-](https://huggingface.co/login?next=%2Fpapers%2F2403.18381)

### [Improving Attributed Text Generation of Large Language Models via\  Preference Learning](https://huggingface.co/papers/2403.18381)

[Large language models have been widely adopted in natural language\\
processing, yet they face the challenge of generating unreliable content.\\
Recent works aim to reduce misinformation and hallucinations by resorting to\\
attribution as a means to provide evidence (i.e., citations). However, current\\
attribution methods usually focus on the retrieval stage and automatic\\
evaluation that neglect mirroring the citation mechanisms in human scholarly\\
writing to bolster credibility. In this paper, we address these challenges by\\
modelling the attribution task as preference learning and introducing an\\
Automatic Preference Optimization (APO) framework. First, we create a curated\\
collection for post-training with 6,330 examples by collecting and filtering\\
from existing datasets. Second, considering the high cost of labelling\\
preference data, we further propose an automatic method to synthesize\\
attribution preference data resulting in 95,263 pairs. Moreover, inspired by\\
the human citation process, we further propose a progressive preference\\
optimization method by leveraging fine-grained information. Extensive\\
experiments on three datasets (i.e., ASQA, StrategyQA, and ELI5) demonstrate\\
that APO achieves state-of-the-art citation F1 with higher answer quality.](https://huggingface.co/papers/2403.18381)

[- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/62de46a83af42b53b1cb6931/jV7xzQFcqy-8-xouXy2FN.jpeg)\\
- ![](https://huggingface.co/avatars/a36b073c1c783102ddb455204fd816bd.svg)\\
- ![](https://huggingface.co/avatars/eee9d7d53f3f9b7a18a21d289abd3c64.svg)\\
- 7 authors](https://huggingface.co/papers/2403.18381)

·

Mar 27, 2024

[-](https://huggingface.co/login?next=%2Fpapers%2F2505.16506)

### [Utilizing citation index and synthetic quality measure to compare\  Wikipedia languages across various topics](https://huggingface.co/papers/2505.16506)

[This study presents a comparative analysis of 55 Wikipedia language editions\\
employing a citation index alongside a synthetic quality measure. Specifically,\\
we identified the most significant Wikipedia articles within distinct topical\\
areas, selecting the top 10, top 25, and top 100 most cited articles in each\\
topic and language version. This index was built on the basis of wikilinks\\
between Wikipedia articles in each language version and in order to do that we\\
processed 6.6 billion page-to-page link records. Next, we used a quality score\\
for each Wikipedia article - a synthetic measure scaled from 0 to 100. This\\
approach enabled quality comparison of Wikipedia articles even between language\\
versions with different quality grading schemes. Our results highlight\\
disparities among Wikipedia language editions, revealing strengths and gaps in\\
content coverage and quality across topics.](https://huggingface.co/papers/2505.16506)

[- 3 authors](https://huggingface.co/papers/2505.16506)

·

May 22, 2025

[49](https://huggingface.co/login?next=%2Fpapers%2F2409.02897)

### [LongCite: Enabling LLMs to Generate Fine-grained Citations in\  Long-context QA](https://huggingface.co/papers/2409.02897)

[Though current long-context large language models (LLMs) have demonstrated\\
impressive capacities in answering user questions based on extensive text, the\\
lack of citations in their responses makes user verification difficult, leading\\
to concerns about their trustworthiness due to their potential hallucinations.\\
In this work, we aim to enable long-context LLMs to generate responses with\\
fine-grained sentence-level citations, improving their faithfulness and\\
verifiability. We first introduce LongBench-Cite, an automated benchmark for\\
assessing current LLMs' performance in Long-Context Question Answering with\\
Citations (LQAC), revealing considerable room for improvement. To this end, we\\
propose CoF (Coarse to Fine), a novel pipeline that utilizes off-the-shelf LLMs\\
to automatically generate long-context QA instances with precise sentence-level\\
citations, and leverage this pipeline to construct LongCite-45k, a large-scale\\
SFT dataset for LQAC. Finally, we train LongCite-8B and LongCite-9B using the\\
LongCite-45k dataset, successfully enabling their generation of accurate\\
responses and fine-grained sentence-level citations in a single output. The\\
evaluation results on LongBench-Cite show that our trained models achieve\\
state-of-the-art citation quality, surpassing advanced proprietary models\\
including GPT-4o.](https://huggingface.co/papers/2409.02897)

[- ![](https://huggingface.co/avatars/bca409d77ec8ff39abb1f6baaa1d0281.svg)\\
- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/632d2e46fadf3a596468a74c/NC_3VOrIxP0oKm_vszP1y.jpeg)\\
- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/648c64829c935db2b527a764/AnTu1dvpac3hUxLQo8A8K.jpeg)\\
- ![](https://huggingface.co/avatars/6d040cbcb4a9b624cbe64c9d01cd5c88.svg)\\
- ![](https://huggingface.co/avatars/14e5794307e4672b1b51d26b31227e0f.svg)\\
- 11 authors](https://huggingface.co/papers/2409.02897)

·

Sep 4, 2024[3](https://huggingface.co/papers/2409.02897#community)

[3](https://huggingface.co/login?next=%2Fpapers%2F2502.14409)

### [Unstructured Evidence Attribution for Long Context Query Focused\  Summarization](https://huggingface.co/papers/2502.14409)

[Large language models (LLMs) are capable of generating coherent summaries\\
from very long contexts given a user query. Extracting and properly citing\\
evidence spans could help improve the transparency and reliability of these\\
summaries. At the same time, LLMs suffer from positional biases in terms of\\
which information they understand and attend to, which could affect evidence\\
citation. Whereas previous work has focused on evidence citation with\\
predefined levels of granularity (e.g. sentence, paragraph, document, etc.), we\\
propose the task of long-context query focused summarization with unstructured\\
evidence citation. We show how existing systems struggle to generate and\\
properly cite unstructured evidence from their context, and that evidence tends\\
to be "lost-in-the-middle". To help mitigate this, we create the Summaries with\\
Unstructured Evidence Text dataset (SUnsET), a synthetic dataset generated\\
using a novel domain-agnostic pipeline which can be used as supervision to\\
adapt LLMs to this task. We demonstrate across 5 LLMs of different sizes and 4\\
datasets with varying document types and lengths that LLMs adapted with SUnsET\\
data generate more relevant and factually consistent evidence than their base\\
models, extract evidence from more diverse locations in their context, and can\\
generate more relevant and consistent summaries.](https://huggingface.co/papers/2502.14409)

[- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/63516acdce7cf1fe8a854cdc/TlOI7iPdG7zJKWyGLoPQN.jpeg)\\
- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/1621507769190-608918b7df398c3b285ce960.jpeg)\\
- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/1669240174964-637e8b1b66ee00bcb2468ed0.jpeg)\\
- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/60a643b9213fe60589b8fdf9/OOXmW3MkSf88r63tAE6-n.jpeg)\\
- 5 authors](https://huggingface.co/papers/2502.14409)

·

Feb 19, 2025[2](https://huggingface.co/papers/2502.14409#community)

[-](https://huggingface.co/login?next=%2Fpapers%2F2601.13222)

### [Incorporating Q&A Nuggets into Retrieval-Augmented Generation](https://huggingface.co/papers/2601.13222)

[RAGE systems integrate ideas from automatic evaluation (E) into Retrieval-augmented Generation (RAG). As one such example, we present Crucible, a Nugget-Augmented Generation System that preserves explicit citation provenance by constructing a bank of Q&A nuggets from retrieved documents and uses them to guide extraction, selection, and report generation. Reasoning on nuggets avoids repeated information through clear and interpretable Q&A semantics - instead of opaque cluster abstractions - while maintaining citation provenance throughout the entire generation process. Evaluated on the TREC NeuCLIR 2024 collection, our Crucible system substantially outperforms Ginger, a recent nugget-based RAG system, in nugget recall, density, and citation grounding.](https://huggingface.co/papers/2601.13222)

[- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/noauth/endQHYuI6SuIWFkhTLjoS.png)\\
- 8 authors](https://huggingface.co/papers/2601.13222)

·

Jan 19

[19](https://huggingface.co/login?next=%2Fpapers%2F2506.05334)

### [Search Arena: Analyzing Search-Augmented LLMs](https://huggingface.co/papers/2506.05334)

[Search-augmented language models combine web search with Large Language\\
Models (LLMs) to improve response groundedness and freshness. However,\\
analyzing these systems remains challenging: existing datasets are limited in\\
scale and narrow in scope, often constrained to static, single-turn,\\
fact-checking questions. In this work, we introduce Search Arena, a\\
crowd-sourced, large-scale, human-preference dataset of over 24,000 paired\\
multi-turn user interactions with search-augmented LLMs. The dataset spans\\
diverse intents and languages, and contains full system traces with around\\
12,000 human preference votes. Our analysis reveals that user preferences are\\
influenced by the number of citations, even when the cited content does not\\
directly support the attributed claims, uncovering a gap between perceived and\\
actual credibility. Furthermore, user preferences vary across cited sources,\\
revealing that community-driven platforms are generally preferred and static\\
encyclopedic sources are not always appropriate and reliable. To assess\\
performance across different settings, we conduct cross-arena analyses by\\
testing search-augmented LLMs in a general-purpose chat environment and\\
conventional LLMs in search-intensive settings. We find that web search does\\
not degrade and may even improve performance in non-search settings; however,\\
the quality in search settings is significantly affected if solely relying on\\
the model's parametric knowledge. We open-sourced the dataset to support future\\
research in this direction. Our dataset and code are available at:\\
https://github.com/lmarena/search-arena.](https://huggingface.co/papers/2506.05334)

[- ![](https://huggingface.co/avatars/d916974ba9d9ddff334c0fa0aa9b6ad5.svg)\\
- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/644a767044b75fd95805d232/vHA2vI_B3CpXapdBEwspB.jpeg)\\
- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/647a99bd61e1252d761ae6ed/fCVY1kFpDvcIY9OZ6R15U.jpeg)\\
- 11 authors](https://huggingface.co/papers/2506.05334)

·

Jun 5, 2025[1](https://huggingface.co/papers/2506.05334#community)

[-](https://huggingface.co/login?next=%2Fpapers%2F2304.12730)

### [CitePrompt: Using Prompts to Identify Citation Intent in Scientific\  Papers](https://huggingface.co/papers/2304.12730)

[Citations in scientific papers not only help us trace the intellectual\\
lineage but also are a useful indicator of the scientific significance of the\\
work. Citation intents prove beneficial as they specify the role of the\\
citation in a given context. In this paper, we present CitePrompt, a framework\\
which uses the hitherto unexplored approach of prompt-based learning for\\
citation intent classification. We argue that with the proper choice of the\\
pretrained language model, the prompt template, and the prompt verbalizer, we\\
can not only get results that are better than or comparable to those obtained\\
with the state-of-the-art methods but also do it with much less exterior\\
information about the scientific document. We report state-of-the-art results\\
on the ACL-ARC dataset, and also show significant improvement on the SciCite\\
dataset over all baseline models except one. As suitably large labelled\\
datasets for citation intent classification can be quite hard to find, in a\\
first, we propose the conversion of this task to the few-shot and zero-shot\\
settings. For the ACL-ARC dataset, we report a 53.86% F1 score for the\\
zero-shot setting, which improves to 63.61% and 66.99% for the 5-shot and\\
10-shot settings, respectively.](https://huggingface.co/papers/2304.12730)

[- ![](https://huggingface.co/avatars/524f5384231f7eab5f9bad3c539db0c2.svg)\\
- 3 authors](https://huggingface.co/papers/2304.12730)

·

Apr 25, 2023

[1](https://huggingface.co/login?next=%2Fpapers%2F2505.16061)

### [Internal and External Impacts of Natural Language Processing Papers](https://huggingface.co/papers/2505.16061)

[We investigate the impacts of NLP research published in top-tier conferences\\
(i.e., ACL, EMNLP, and NAACL) from 1979 to 2024. By analyzing citations from\\
research articles and external sources such as patents, media, and policy\\
documents, we examine how different NLP topics are consumed both within the\\
academic community and by the broader public. Our findings reveal that language\\
modeling has the widest internal and external influence, while linguistic\\
foundations have lower impacts. We also observe that internal and external\\
impacts generally align, but topics like ethics, bias, and fairness show\\
significant attention in policy documents with much fewer academic citations.\\
Additionally, external domains exhibit distinct preferences, with patents\\
focusing on practical NLP applications and media and policy documents engaging\\
more with the societal implications of NLP models.](https://huggingface.co/papers/2505.16061)

[- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/64b78f80b5d293ec95a3f694/3rKg-m2i6ulj_aYhldvU8.png)\\
- 1 authors](https://huggingface.co/papers/2505.16061)

·

May 21, 2025

[-](https://huggingface.co/login?next=%2Fpapers%2F2203.10053)

### [RELIC: Retrieving Evidence for Literary Claims](https://huggingface.co/papers/2203.10053)

[Humanities scholars commonly provide evidence for claims that they make about\\
a work of literature (e.g., a novel) in the form of quotations from the work.\\
We collect a large-scale dataset (RELiC) of 78K literary quotations and\\
surrounding critical analysis and use it to formulate the novel task of\\
literary evidence retrieval, in which models are given an excerpt of literary\\
analysis surrounding a masked quotation and asked to retrieve the quoted\\
passage from the set of all passages in the work. Solving this retrieval task\\
requires a deep understanding of complex literary and linguistic phenomena,\\
which proves challenging to methods that overwhelmingly rely on lexical and\\
semantic similarity matching. We implement a RoBERTa-based dense passage\\
retriever for this task that outperforms existing pretrained information\\
retrieval baselines; however, experiments and analysis by human domain experts\\
indicate that there is substantial room for improvement over our dense\\
retriever.](https://huggingface.co/papers/2203.10053)

[- 4 authors](https://huggingface.co/papers/2203.10053)

·

Mar 18, 2022

[-](https://huggingface.co/login?next=%2Fpapers%2F2609.18697)

### [Tracing individual knowledge trajectories in a changing field: the case of general relativity and gravitation](https://huggingface.co/papers/2609.18697)

[Historians have reconstructed the twentieth-century transformation of general relativity and gravitation (GRG) at the field level and through individual careers, but connecting these scales requires a way to compare researchers with the changing field over time. We develop such a comparison, setting a researcher's publications and references against GRG field literature from the same, earlier, and later two-year periods. Building on Own Vocabulary and Embedding Density Estimation from our earlier two-case study (arXiv:2501.00391), we extend the analysis to the fifty most-published authors in a NASA/ADS corpus of about 180,000 GRG records (1911 to 2000) and add two citation-based measures, Referenced Vocabulary and Citation Identity. The four measures compare an author's written language, cited literature, semantic neighbourhood, and cited-authority configuration with the surrounding field. The earlier cases suggested that closer field-vocabulary alignment accompanies a denser semantic neighbourhood. Across the fifty authors this holds only partially. Written and cited vocabularies tend to move together, usually resembling later GRG literature as the field turned towards astrophysical and cosmological research. Semantic neighbourhoods more often lie where the field's publications were concentrated in earlier periods, while co-citation patterns follow no single temporal direction, and the two citation measures frequently place the same researcher differently despite drawing on identical reference lists. Individual trajectories can thus combine vocabulary tied to later field states with older semantic or citation structures, and these divergent cases mark patterns for closer historical investigation. The approach transfers to other fields with defensible corpus boundaries and adequate coverage of texts, references, and disambiguated author identities.](https://huggingface.co/papers/2609.18697)

[- ![](https://huggingface.co/avatars/4ec9e8436ceaad17ee85ab38be474796.svg)\\
- 2 authors](https://huggingface.co/papers/2609.18697)

·

Sep 15

[-](https://huggingface.co/login?next=%2Fpapers%2F2405.17998)

### [Source Echo Chamber: Exploring the Escalation of Source Bias in User,\  Data, and Recommender System Feedback Loop](https://huggingface.co/papers/2405.17998)

[Recently, researchers have uncovered that neural retrieval models prefer\\
AI-generated content (AIGC), called source bias. Compared to active search\\
behavior, recommendation represents another important means of information\\
acquisition, where users are more prone to source bias. Furthermore, delving\\
into the recommendation scenario, as AIGC becomes integrated within the\\
feedback loop involving users, data, and the recommender system, it\\
progressively contaminates the candidate items, the user interaction history,\\
and ultimately, the data used to train the recommendation models. How and to\\
what extent the source bias affects the neural recommendation models within\\
feedback loop remains unknown. In this study, we extend the investigation of\\
source bias into the realm of recommender systems, specifically examining its\\
impact across different phases of the feedback loop. We conceptualize the\\
progression of AIGC integration into the recommendation content ecosystem in\\
three distinct phases-HGC dominate, HGC-AIGC coexist, and AIGC dominance-each\\
representing past, present, and future states, respectively. Through extensive\\
experiments across three datasets from diverse domains, we demonstrate the\\
prevalence of source bias and reveal a potential digital echo chamber with\\
source bias amplification throughout the feedback loop. This trend risks\\
creating a recommender ecosystem with limited information source, such as AIGC,\\
being disproportionately recommended. To counteract this bias and prevent its\\
escalation in the feedback loop, we introduce a black-box debiasing method that\\
maintains model impartiality towards both HGC and AIGC. Our experimental\\
results validate the effectiveness of the proposed debiasing method, confirming\\
its potential to disrupt the feedback loop.](https://huggingface.co/papers/2405.17998)

[- ![](https://huggingface.co/avatars/4be9e6c06f77d3c8ad2cc6322c11b782.svg)\\
- 7 authors](https://huggingface.co/papers/2405.17998)

·

May 28, 2024

[1](https://huggingface.co/login?next=%2Fpapers%2F2605.10186)

### [LegalCiteBench: Evaluating Citation Reliability in Legal Language Models](https://huggingface.co/papers/2605.10186)

[Large language models (LLMs) are increasingly integrated into legal drafting and research workflows, where incorrect citations or fabricated precedents can cause serious professional harm. Existing legal benchmarks largely emphasize statutory reasoning, contract understanding, or general legal question answering, but they do not directly study a central common-law failure mode: when asked to provide case authorities without external grounding, models may return plausible-looking but incorrect citations or cases. We introduce LegalCiteBench, a benchmark for studying closed-book citation recovery, citation verification, and case matching in legal language models. LegalCiteBench contains approximately 24K evaluation instances constructed from 1,000 real U.S. judicial opinions from the Case Law Access Project. The benchmark covers five citation-centric tasks: citation retrieval, citation completion, citation error detection, case matching, and case verification and correction. Across 21 LLMs, exact citation recovery remains highly challenging in this closed-book setting: even the strongest models score below 7/100 on citation retrieval and completion. Within the evaluated models, scale and legal-domain pretraining provide limited gains and do not resolve this difficulty. Models also frequently provide concrete but incorrect or low-overlap authorities under our evaluation protocol, with Misleading Answer Rates (MAR) exceeding 94% for 20 of 21 evaluated models on retrieval-heavy tasks. A prompt-only abstention experiment shows that explicit uncertainty instructions reduce some confident fabrication but do not improve citation correctness. LegalCiteBench is intended as a diagnostic framework for studying authority generation failures, verification behavior, and abstention when external grounding is absent, incomplete, or bypassed.](https://huggingface.co/papers/2605.10186)

[![PhalaCloud](https://cdn-avatars.huggingface.co/v1/production/uploads/65af3dec5033724f45b9aa1d/KSPUqMeZni0gj8oAC5nQb.png)Phala](https://huggingface.co/PhalaCloud)

·

May 10

[-](https://huggingface.co/login?next=%2Fpapers%2F2108.03366)

### [VitaLITy: Promoting Serendipitous Discovery of Academic Literature with Transformers & Visual Analytics](https://huggingface.co/papers/2108.03366)

[There are a few prominent practices for conducting reviews of academic literature, including searching for specific keywords on Google Scholar or checking citations from some initial seed paper(s). These approaches serve a critical purpose for academic literature reviews, yet there remain challenges in identifying relevant literature when similar work may utilize different terminology (e.g., mixed-initiative visual analytics papers may not use the same terminology as papers on model-steering, yet the two topics are relevant to one another). In this paper, we introduce a system, VitaLITy, intended to complement existing practices. In particular, VitaLITy promotes serendipitous discovery of relevant literature using transformer language models, allowing users to find semantically similar papers in a word embedding space given (1) a list of input paper(s) or (2) a working abstract. VitaLITy visualizes this document-level embedding space in an interactive 2-D scatterplot using dimension reduction. VitaLITy also summarizes meta information about the document corpus or search query, including keywords and co-authors, and allows users to save and export papers for use in a literature review. We present qualitative findings from an evaluation of VitaLITy, suggesting it can be a promising complementary technique for conducting academic literature reviews. Furthermore, we contribute data from 38 popular data visualization publication venues in VitaLITy, and we provide scrapers for the open-source community to continue to grow the list of supported venues.](https://huggingface.co/papers/2108.03366)

[- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/69874103ffe2121b274f104d/i8z0bqi13kPmt6OU0yb1U.png)\\
- 4 authors](https://huggingface.co/papers/2108.03366)

·

Aug 6, 2021

[-](https://huggingface.co/login?next=%2Fpapers%2F2606.24894)

### [RWGBench: Evaluating Scholarly Positioning in Related Work Generation](https://huggingface.co/papers/2606.24894)

[Large language models have shown strong fluency in scientific writing, yet the evaluation of related work generation (RWG) remains limited. Existing RWG evaluations largely inherit summarization-oriented metrics, using lexical or semantic similarity to reference sections as proxies for quality. However, related work writing is fundamentally a citation-level scholarly positioning task: it requires selecting, organizing, and framing prior work to clarify how a target paper relates to, differs from, and contributes beyond existing research.As a result, models may generate coherent and semantically-relevant text while exhibiting academically critical failures, such as inappropriate citation selection or misplaced references, that conventional metrics do not capture.To this end, we introduce RWGBench, a benchmark that evaluates RWG from the perspective of citation decision-making rather than text similarity. RWGBench is constructed from a large-scale collection of 40,108 computer science papers and a retrieval corpus of 1.09 million documents, with a carefully curated test set comprising 100 papers and their corresponding published related work sections.We propose a multi-dimensional evaluation framework that assesses citation selection, contextual appropriateness, organization, and discourse structure.Experiments reveal systematic limitations in current systems that are obscured by standard evaluations, while Oracle studies further disentangle retrieval-level and generation-level bottlenecks. Human evaluation further shows that our citation-centric metrics align substantially better with expert judgment than surface-level text metrics. RWGBench offers a citation-centric testbed for developing and evaluating related work generation systems that are better aligned with scholarly writing practices.](https://huggingface.co/papers/2606.24894)

[- 6 authors](https://huggingface.co/papers/2606.24894)

·

Jul 7

[-](https://huggingface.co/login?next=%2Fpapers%2F2609.18154)

### [PageRecall: Measuring Page Selection in Literature-Grounded Question Answering](https://huggingface.co/papers/2609.18154)

[We describe our system for LitTraceQA (GroundLM @ EMNLP 2026): given a research question, retrieve the relevant papers from a pool of 27,487, cite the page and the table or figure where the answer lives, and answer in a requested format. Our main finding is that evidence grounding is limited by retrieval, not by reading. The page selector put the annotator's page, which we call the gold page, in front of the model that locates evidence only about half the time (52.6% gold-page recall), while that model, given the page, cited the right one in 45 of the 48 locators it emitted (94%). When the page was missing it rarely said so: of 45 such cases it returned nothing 14 times, a wrong page 24 times, and a correct page 7 times, so the pipeline failed quietly almost twice as often as it failed visibly. Since the failure was that the right page was never shown, the fix is to stop choosing: each retrieved paper fits in the model's context, so we show it whole. Page ranking survives only as a fallback inside papers too long to fit, which no test-split paper was, and gold-page recall reaches 100% on the papers we can parse. Separately, questions that identify their target by position rather than content, such as "the first author of the 24th reference", are served by parsing rather than retrieval: we resolve the bibliography into an addressable list, which also supplies identifiers the evidence metric scores. The final system scores 0.762 paper F\_1, 0.441 evidence F\_1 and 0.920 multiple-choice accuracy on the held-out test split. Because the pipeline depends on a closed model without seed control, we release a harness that verifies the paper's central claims against committed artifacts.](https://huggingface.co/papers/2609.18154)

[- 1 authors](https://huggingface.co/papers/2609.18154)

·

Sep 15

[64](https://huggingface.co/login?next=%2Fpapers%2F2605.12882)

### [CiteVQA: Benchmarking Evidence Attribution for Trustworthy Document Intelligence](https://huggingface.co/papers/2605.12882)

[Multimodal Large Language Models (MLLMs) have significantly advanced document understanding, yet current Doc-VQA evaluations score only the final answer and leave the supporting evidence unchecked. This answer-only approach masks a critical failure mode: a model can land on the correct answer while grounding it in the wrong passage -- a critical risk in high-stakes domains like law, finance, and medicine, where every conclusion must be traceable to a specific source region. To address this, we introduce CiteVQA, a benchmark that requires models to return element-level bounding-box citations alongside each answer, evaluating both jointly. CiteVQA comprises 1,897 questions across 711 PDFs spanning seven domains and two languages, averaging 40.6 pages per document. To ensure fidelity and scalability, the ground-truth citations are generated by an automated pipeline-which identifies crucial evidence via masking ablation-and are subsequently validated through expert review. At the core of our evaluation is Strict Attributed Accuracy (SAA), which credits a prediction only when the answer and the cited region are both correct. Auditing 20 MLLMs reveals a pervasive Attribution Hallucination: models frequently produce the right answer while citing the wrong region. The strongest system (Gemini-3.1-Pro-Preview) achieves an SAA of only 76.0, and the strongest open-source MLLM reaches just 22.5. Ultimately, towards trustworthy document intelligence, CiteVQA exposes a reliability gap that answer-only evaluations overlook, providing the instrumentation needed to close it. Our repository is available at https://github.com/opendatalab/CiteVQA.](https://huggingface.co/papers/2605.12882)

[![opendatalab](https://cdn-avatars.huggingface.co/v1/production/uploads/639c3afa7432f2f5d16b7296/yqxxBknyeqkGnYsjoaR4M.png)OpenDataLab](https://huggingface.co/opendatalab)

·

May 12 [3](https://huggingface.co/papers/2605.12882#community)

[-](https://huggingface.co/login?next=%2Fpapers%2F1003.1345)

### [Author Identifiers in Scholarly Repositories](https://huggingface.co/papers/1003.1345)

[Bibliometric and usage-based analyses and tools highlight the value of\\
information about scholarship contained within the network of authors, articles\\
and usage data. Less progress has been made on populating and using the author\\
side of this network than the article side, in part because of the difficulty\\
of unambiguously identifying authors. I briefly review a sample of author\\
identifier schemes, and consider use in scholarly repositories. I then describe\\
preliminary work at arXiv to implement public author identifiers, services\\
based on them, and plans to make this information useful beyond the boundaries\\
of arXiv.](https://huggingface.co/papers/1003.1345)

[- 1 authors](https://huggingface.co/papers/1003.1345)

·

Mar 5, 2010

[2](https://huggingface.co/login?next=%2Fpapers%2F2502.14561)

### [Can LLMs Predict Citation Intent? An Experimental Analysis of In-context\  Learning and Fine-tuning on Open LLMs](https://huggingface.co/papers/2502.14561)

[This work investigates the ability of open Large Language Models (LLMs) to\\
predict citation intent through in-context learning and fine-tuning. Unlike\\
traditional approaches that rely on pre-trained models like SciBERT, which\\
require extensive domain-specific pretraining and specialized architectures, we\\
demonstrate that general-purpose LLMs can be adapted to this task with minimal\\
task-specific data. We evaluate twelve model variations across five prominent\\
open LLM families using zero, one, few, and many-shot prompting to assess\\
performance across scenarios. Our experimental study identifies the\\
top-performing model through extensive experimentation of in-context\\
learning-related parameters, which we fine-tune to further enhance task\\
performance. The results highlight the strengths and limitations of LLMs in\\
recognizing citation intents, providing valuable insights for model selection\\
and prompt engineering. Additionally, we make our end-to-end evaluation\\
framework and models openly available for future use.](https://huggingface.co/papers/2502.14561)

[- ![](https://huggingface.co/avatars/f743f646ba3d5e06490e75f6db9082ff.svg)\\
- 4 authors](https://huggingface.co/papers/2502.14561)

·

Feb 20, 2025

[-](https://huggingface.co/login?next=%2Fpapers%2F2311.02790)

### [CausalCite: A Causal Formulation of Paper Citations](https://huggingface.co/papers/2311.02790)

[Citation count of a paper is a commonly used proxy for evaluating the\\
significance of a paper in the scientific community. Yet citation measures are\\
widely criticized for failing to accurately reflect the true impact of a paper.\\
Thus, we propose CausalCite, a new way to measure the significance of a paper\\
by assessing the causal impact of the paper on its follow-up papers. CausalCite\\
is based on a novel causal inference method, TextMatch, which adapts the\\
traditional matching framework to high-dimensional text embeddings. TextMatch\\
encodes each paper using text embeddings from large language models (LLMs),\\
extracts similar samples by cosine similarity, and synthesizes a counterfactual\\
sample as the weighted average of similar papers according to their similarity\\
values. We demonstrate the effectiveness of CausalCite on various criteria,\\
such as high correlation with paper impact as reported by scientific experts on\\
a previous dataset of 1K papers, (test-of-time) awards for past papers, and its\\
stability across various subfields of AI. We also provide a set of findings\\
that can serve as suggested ways for future researchers to use our metric for a\\
better understanding of the quality of a paper. Our code is available at\\
https://github.com/causalNLP/causal-cite.](https://huggingface.co/papers/2311.02790)

[- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/no-auth/nayXD7VbUr0A1pJU78wAh.png)\\
- 7 authors](https://huggingface.co/papers/2311.02790)

·

Nov 5, 2023

[2](https://huggingface.co/login?next=%2Fpapers%2F2406.17186)

### [CLERC: A Dataset for Legal Case Retrieval and Retrieval-Augmented\  Analysis Generation](https://huggingface.co/papers/2406.17186)

[Legal professionals need to write analyses that rely on citations to relevant\\
precedents, i.e., previous case decisions. Intelligent systems assisting legal\\
professionals in writing such documents provide great benefits but are\\
challenging to design. Such systems need to help locate, summarize, and reason\\
over salient precedents in order to be useful. To enable systems for such\\
tasks, we work with legal professionals to transform a large open-source legal\\
corpus into a dataset supporting two important backbone tasks: information\\
retrieval (IR) and retrieval-augmented generation (RAG). This dataset CLERC\\
(Case Law Evaluation Retrieval Corpus), is constructed for training and\\
evaluating models on their ability to (1) find corresponding citations for a\\
given piece of legal analysis and to (2) compile the text of these citations\\
(as well as previous context) into a cogent analysis that supports a reasoning\\
goal. We benchmark state-of-the-art models on CLERC, showing that current\\
approaches still struggle: GPT-4o generates analyses with the highest ROUGE\\
F-scores but hallucinates the most, while zero-shot IR models only achieve\\
48.3% recall@1000.](https://huggingface.co/papers/2406.17186)

[- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/no-auth/IAItP4FvD6JX9s1jwnQwF.png)\\
- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/6362d9712691058b19de1ba4/Hdqj5aGrFJJbF7oUSzoIh.jpeg)\\
- 8 authors](https://huggingface.co/papers/2406.17186)

·

Jun 24, 2024

[-](https://huggingface.co/login?next=%2Fpapers%2F2301.03403)

### [A comprehensive review of automatic text summarization techniques:\  method, data, evaluation and coding](https://huggingface.co/papers/2301.03403)

[We provide a literature review about Automatic Text Summarization (ATS)\\
systems. We consider a citation-based approach. We start with some popular and\\
well-known papers that we have in hand about each topic we want to cover and we\\
have tracked the "backward citations" (papers that are cited by the set of\\
papers we knew beforehand) and the "forward citations" (newer papers that cite\\
the set of papers we knew beforehand). In order to organize the different\\
methods, we present the diverse approaches to ATS guided by the mechanisms they\\
use to generate a summary. Besides presenting the methods, we also present an\\
extensive review of the datasets available for summarization tasks and the\\
methods used to evaluate the quality of the summaries. Finally, we present an\\
empirical exploration of these methods using the CNN Corpus dataset that\\
provides golden summaries for extractive and abstractive methods.](https://huggingface.co/papers/2301.03403)

[- 7 authors](https://huggingface.co/papers/2301.03403)

·

Jan 4, 2023

[-](https://huggingface.co/login?next=%2Fpapers%2F2601.03746)

### [Whose Facts Win? LLM Source Preferences under Knowledge Conflicts](https://huggingface.co/papers/2601.03746)

[As large language models (LLMs) are more frequently used in retrieval-augmented generation pipelines, it is increasingly relevant to study their behavior under knowledge conflicts. Thus far, the role of the source of the retrieved information has gone unexamined. We address this gap with a novel framework to investigate how source preferences affect LLM resolution of inter-context knowledge conflicts in English, motivated by interdisciplinary research on credibility. With a comprehensive, tightly-controlled evaluation of 13 open-weight LLMs, we find that LLMs prefer institutionally-corroborated information (e.g., government or newspaper sources) over information from people and social media. However, these source preferences can be reversed by simply repeating information from less credible sources. To mitigate repetition effects and maintain consistent preferences, we propose a novel method that reduces repetition bias by up to 99.8%, while also maintaining at least 88.8% of original preferences. We release all data and code to encourage future work on credibility and source preferences in knowledge-intensive NLP.](https://huggingface.co/papers/2601.03746)

[- 3 authors](https://huggingface.co/papers/2601.03746)

·

Jan 6

[9](https://huggingface.co/login?next=%2Fpapers%2F2608.24306)

### [Who is the Agent to Blame? Localizing Faithfulness and Citation Mistakes in Agentic Deep Research](https://huggingface.co/papers/2608.24306)

[Deep research (DR) systems produce long-form cited reports by orchestrating multiple agents that search and synthesize information from the web. Citations are the primary mechanism for evaluating the faithfulness of these reports, yet current DR systems exhibit poor citation recall. Moreover, improving citation recall is challenging because DR systems are complex multi-agent architectures where information passes through agents like a telephone game, and both content and citations can get corrupted along the way. We propose an evaluation method that pinpoints which agent introduced each error by locally testing agent invocations for faithfulness and verifiability relative to their own inputs. Furthermore, we propose a four-type taxonomy to categorize the discovered errors: hallucination, uncited input reliance, uncited output, or insufficient citations. Applying our method to three top-ranked open-source DR systems, we obtain actionable diagnostics. Almost every agent makes a lot of mistakes with the exception being those that summarize a single document. We find that the dominant error type varies systematically across agents, where the orchestrator mistakes are mostly citation-related. We find that 84.7% of final-report errors in AI-Q originate at the orchestrator, roughly 31% of them hallucinations and the rest citation mistakes. Guided by these insights, we demonstrate that two simple interventions raise citation recall by 5% without degrading output quality.](https://huggingface.co/papers/2608.24306)

[- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/1635645820205-noauth.jpeg)\\
- 6 authors](https://huggingface.co/papers/2608.24306)

·

Aug 24

[1](https://huggingface.co/login?next=%2Fpapers%2F2204.10290)

### [Learning to Revise References for Faithful Summarization](https://huggingface.co/papers/2204.10290)

[In real-world scenarios with naturally occurring datasets, reference\\
summaries are noisy and may contain information that cannot be inferred from\\
the source text. On large news corpora, removing low quality samples has been\\
shown to reduce model hallucinations. Yet, for smaller, and/or noisier corpora,\\
filtering is detrimental to performance. To improve reference quality while\\
retaining all data, we propose a new approach: to selectively re-write\\
unsupported reference sentences to better reflect source data. We automatically\\
generate a synthetic dataset of positive and negative revisions by corrupting\\
supported sentences and learn to revise reference sentences with contrastive\\
learning. The intensity of revisions is treated as a controllable attribute so\\
that, at inference, diverse candidates can be over-generated-then-rescored to\\
balance faithfulness and abstraction. To test our methods, we extract noisy\\
references from publicly available MIMIC-III discharge summaries for the task\\
of hospital-course summarization, and vary the data on which models are\\
trained. According to metrics and human evaluation, models trained on revised\\
clinical references are much more faithful, informative, and fluent than models\\
trained on original or filtered data.](https://huggingface.co/papers/2204.10290)

[- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/1628869402886-noauth.jpeg)\\
- 6 authors](https://huggingface.co/papers/2204.10290)

·

Apr 13, 2022

[-](https://huggingface.co/login?next=%2Fpapers%2F2402.01788)

### [LitLLM: A Toolkit for Scientific Literature Review](https://huggingface.co/papers/2402.01788)

[Conducting literature reviews for scientific papers is essential for understanding research, its limitations, and building on existing work. It is a tedious task which makes an automatic literature review generator appealing. Unfortunately, many existing works that generate such reviews using Large Language Models (LLMs) have significant limitations. They tend to hallucinate-generate non-factual information-and ignore the latest research they have not been trained on. To address these limitations, we propose a toolkit that operates on Retrieval Augmented Generation (RAG) principles, specialized prompting and instructing techniques with the help of LLMs. Our system first initiates a web search to retrieve relevant papers by summarizing user-provided abstracts into keywords using an off-the-shelf LLM. Authors can enhance the search by supplementing it with relevant papers or keywords, contributing to a tailored retrieval process. Second, the system re-ranks the retrieved papers based on the user-provided abstract. Finally, the related work section is generated based on the re-ranked results and the abstract. There is a substantial reduction in time and effort for literature review compared to traditional methods, establishing our toolkit as an efficient alternative. Our project page including the demo and toolkit can be accessed here: https://litllm.github.io](https://huggingface.co/papers/2402.01788)

[- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/1652085632597-617bacfb191221bded6ed2c4.jpeg)\\
- 8 authors](https://huggingface.co/papers/2402.01788)

·

Mar 20, 2025

[2](https://huggingface.co/login?next=%2Fpapers%2F2412.15249)

### [LitLLMs, LLMs for Literature Review: Are we there yet?](https://huggingface.co/papers/2412.15249)

[Literature reviews are an essential component of scientific research, but\\
they remain time-intensive and challenging to write, especially due to the\\
recent influx of research papers. This paper explores the zero-shot abilities\\
of recent Large Language Models (LLMs) in assisting with the writing of\\
literature reviews based on an abstract. We decompose the task into two\\
components: 1. Retrieving related works given a query abstract, and 2. Writing\\
a literature review based on the retrieved results. We analyze how effective\\
LLMs are for both components. For retrieval, we introduce a novel two-step\\
search strategy that first uses an LLM to extract meaningful keywords from the\\
abstract of a paper and then retrieves potentially relevant papers by querying\\
an external knowledge base. Additionally, we study a prompting-based re-ranking\\
mechanism with attribution and show that re-ranking doubles the normalized\\
recall compared to naive search methods, while providing insights into the\\
LLM's decision-making process. In the generation phase, we propose a two-step\\
approach that first outlines a plan for the review and then executes steps in\\
the plan to generate the actual review. To evaluate different LLM-based\\
literature review methods, we create test sets from arXiv papers using a\\
protocol designed for rolling use with newly released LLMs to avoid test set\\
contamination in zero-shot evaluations. We release this evaluation protocol to\\
promote additional research and development in this regard. Our empirical\\
results suggest that LLMs show promising potential for writing literature\\
reviews when the task is decomposed into smaller components of retrieval and\\
planning. Our project page including a demonstration system and toolkit can be\\
accessed here: https://litllm.github.io.](https://huggingface.co/papers/2412.15249)

[- ![](https://huggingface.co/avatars/5f8b6d999cf48dd4703bbd70236c38c8.svg)\\
- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/1652085632597-617bacfb191221bded6ed2c4.jpeg)\\
- 8 authors](https://huggingface.co/papers/2412.15249)

·

Dec 14, 2024

[43](https://huggingface.co/login?next=%2Fpapers%2F2504.00824)

### [ScholarCopilot: Training Large Language Models for Academic Writing with\  Accurate Citations](https://huggingface.co/papers/2504.00824)

[Academic writing requires both coherent text generation and precise citation\\
of relevant literature. Although recent Retrieval-Augmented Generation (RAG)\\
systems have significantly improved factual accuracy in general-purpose text\\
generation, their capacity to adequately support professional academic writing\\
remains limited. In this work, we introduce ScholarCopilot, a unified framework\\
designed to enhance existing large language models for generating professional\\
academic articles with accurate and contextually relevant citations.\\
ScholarCopilot dynamically determines when to retrieve scholarly references by\\
generating a retrieval token \[RET\], and then utilizes its representation to\\
look up relevant citations from a database. The retrieved references are fed\\
into the model to augment the generation process. We jointly optimize both the\\
generation and citation tasks within a single framework to increase efficiency.\\
Trained on 500K papers from arXiv, our model achieves a top-1 retrieval\\
accuracy of 40.1% on our evaluation dataset, outperforming baselines such as\\
E5-Mistral-7B-Instruct (15.0%) and BM25 (9.8%). On a dataset of 1,000 academic\\
writing samples, ScholarCopilot scores 16.2/25 in generation quality (measured\\
across relevance, coherence, academic rigor, completeness, and innovation),\\
surpassing models with 10x more parameters such as Qwen-2.5-72B-Instruct\\
(15.8/25). Human studies also confirm ScholarCopilot's superior performance in\\
citation recall, writing efficiency, and overall user experience, confirming\\
the effectiveness of our approach.](https://huggingface.co/papers/2504.00824)

[- ![](https://huggingface.co/avatars/3e80075e92aebdfea712f70b00d5ec7d.svg)\\
- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/6114ea319ae90b69cb29fc92/uw2n4iiXGD5v5iUocmbxE.jpeg)\\
- ![](https://huggingface.co/avatars/9415510b598079973c2b0436ad12db9c.svg)\\
- ![](https://huggingface.co/avatars/45b58d912f7d00cb351947cd79d5eeb4.svg)\\
- ![](https://huggingface.co/avatars/d9c5cf3491243d1f2b1c5df1873ee8e7.svg)\\
- 10 authors](https://huggingface.co/papers/2504.00824)

·

Apr 1, 2025[2](https://huggingface.co/papers/2504.00824#community)

[5](https://huggingface.co/login?next=%2Fpapers%2F2605.27905)

### [AI Research Agents Narrow Scientific Exploration](https://huggingface.co/papers/2605.27905)

[AI research agents can now generate research ideas, design experiments, run code, and draft papers, raising the possibility of large-scale AI-assisted scientific discovery. Many current agent frameworks explicitly encourage the generation of novel and high-impact ideas. Yet it remains unclear whether AI-assisted ideation broadens scientific exploration or mainly concentrates around existing work. We study AI research agents as scientific search systems. Using four AI research-agent frameworks and six large language models, we generate 37,802 scientific ideas from shared seed literature across citation-defined research areas in AI and machine learning. We then compare the resulting AI ideas against human-authored papers from the same research areas, follow-on human research emerging from the same seed literature, and the seed literature itself. Across experiments, four consistent patterns emerge. First, AI-generated ideas are substantially more concentrated than human-authored papers from the same research areas. Second, AI-generated ideas remain much closer to their starting literature than later human follow-on work does. Third, papers most similar to AI-generated ideas tend to receive lower subsequent citations. Fourth, when AI-generated ideas differ from prior work, the differences arise primarily from recombining existing technical methods rather than introducing fundamentally new research questions. Overall, current AI research agents appear better suited to local elaboration than to broadening scientific exploration.](https://huggingface.co/papers/2605.27905)

[- ![](https://huggingface.co/avatars/a95c7df96dc4fb6a96193f6dd5068227.svg)\\
- 2 authors](https://huggingface.co/papers/2605.27905)

·

May 26[2](https://huggingface.co/papers/2605.27905#community)

[1](https://huggingface.co/login?next=%2Fpapers%2F2601.17431)

### [The 17% Gap: Quantifying Epistemic Decay in AI-Assisted Survey Papers](https://huggingface.co/papers/2601.17431)

[The adoption of Large Language Models (LLMs) in scientific writing promises efficiency but risks introducing informational entropy. While "hallucinated papers" are a known artifact, the systematic degradation of valid citation chains remains unquantified. We conducted a forensic audit of 50 recent survey papers in Artificial Intelligence (N=5,514 citations) published between September 2024 and January 2026. We utilized a hybrid verification pipeline combining DOI resolution, Crossref metadata analysis, Semantic Scholar queries, and fuzzy text matching to distinguish between formatting errors ("Sloppiness") and verifiable non-existence ("Phantoms). We detect a persistent 17.0% Phantom Rate -- citations that cannot be resolved to any digital object despite aggressive forensic recovery. Diagnostic categorization reveals three distinct failure modes: pure hallucinations (5.1%), hallucinated identifiers with valid titles (16.4%), and parsing-induced matching failures (78.5%). Longitudinal analysis reveals a flat trend (+0.07 pp/month), suggesting that high-entropy citation practices have stabilized as an endemic feature of the field. The scientific citation graph in AI survey literature exhibits "link rot" at scale. This suggests a mechanism where AI tools act as "lazy research assistants," retrieving correct titles but hallucinating metadata, thereby severing the digital chain of custody required for reproducible science.](https://huggingface.co/papers/2601.17431)

[- 1 authors](https://huggingface.co/papers/2601.17431)

·

Jan 23

[-](https://huggingface.co/login?next=%2Fpapers%2F1911.02782)

### [S2ORC: The Semantic Scholar Open Research Corpus](https://huggingface.co/papers/1911.02782)

[We introduce S2ORC, a large corpus of 81.1M English-language academic papers\\
spanning many academic disciplines. The corpus consists of rich metadata, paper\\
abstracts, resolved bibliographic references, as well as structured full text\\
for 8.1M open access papers. Full text is annotated with automatically-detected\\
inline mentions of citations, figures, and tables, each linked to their\\
corresponding paper objects. In S2ORC, we aggregate papers from hundreds of\\
academic publishers and digital archives into a unified source, and create the\\
largest publicly-available collection of machine-readable academic text to\\
date. We hope this resource will facilitate research and development of tools\\
and tasks for text mining over academic text.](https://huggingface.co/papers/1911.02782)

[- 5 authors](https://huggingface.co/papers/1911.02782)

·

Nov 6, 2019

[-](https://huggingface.co/login?next=%2Fpapers%2F2601.16993)

### [BibAgent: An Agentic Framework for Traceable Miscitation Detection in Scientific Literature](https://huggingface.co/papers/2601.16993)

[Citations are the bedrock of scientific authority, yet their integrity is compromised by widespread miscitations: ranging from nuanced distortions to fabricated references. Systematic citation verification is currently unfeasible; manual review cannot scale to modern publishing volumes, while existing automated tools are restricted by abstract-only analysis or small-scale, domain-specific datasets in part due to the "paywall barrier" of full-text access. We introduce BibAgent, a scalable, end-to-end agentic framework for automated citation verification. BibAgent integrates retrieval, reasoning, and adaptive evidence aggregation, applying distinct strategies for accessible and paywalled sources. For paywalled references, it leverages a novel Evidence Committee mechanism that infers citation validity via downstream citation consensus. To support systematic evaluation, we contribute a 5-category Miscitation Taxonomy and MisciteBench, a massive cross-disciplinary benchmark comprising 6,350 miscitation samples spanning 254 fields. Our results demonstrate that BibAgent outperforms state-of-the-art Large Language Model (LLM) baselines in citation verification accuracy and interpretability, providing scalable, transparent detection of citation misalignments across the scientific literature.](https://huggingface.co/papers/2601.16993)

[- ![](https://huggingface.co/avatars/25b2632d7aa9ce26d5d4924ecb00c4f4.svg)\\
- 9 authors](https://huggingface.co/papers/2601.16993)

·

Jan 12

[-](https://huggingface.co/login?next=%2Fpapers%2F2609.33284)

### [RINI: Seeing the Prior Is Not Enough](https://huggingface.co/papers/2609.33284)

[A research proposal can describe an established mechanism correctly while claiming to introduce it. We study whether providing the earlier paper corrects such contribution claims. Three controlled experiments compare proposals generated with a contribution-bearing prior and a same-topic control. Providing the prior yields no clear aggregate reduction in unsupported novelty. Human analysis of 175 interpretable exposed proposals finds that 137 recognize the prior's relevance, but 61 correctly attribute the established contribution. Of 71 proposed remaining distinctions, 37 are covered by the same prior. We introduce Research Idea Novelty Inspection (RINI), which audits contribution claims against evidence, checks the remaining distinction, and applies local revisions. Five human annotators evaluate 1,080 original-revision pairs across three methods. On the same 240 originals judged to require correction, successful repair is 11.7% for Self-Revision, 39.1% for Retrieve-and-Revise, and 72.2% for RINI, with research tasks weighted equally. The improvement over same-evidence direct revision is 33.0 percentage points. The revised proposals retain their research questions and technical methods. These results motivate explicit contribution attribution when using literature to generate and revise research proposals.](https://huggingface.co/papers/2609.33284)

[- ![](https://huggingface.co/avatars/5ffac40354373ab57193445862263bd4.svg)\\
- ![](https://huggingface.co/avatars/d7e03d3ced053d1d44c15a6dc2cc5c87.svg)\\
- 10 authors](https://huggingface.co/papers/2609.33284)

·

Sep 26

[-](https://huggingface.co/login?next=%2Fpapers%2F2303.14957)

### [unarXive 2022: All arXiv Publications Pre-Processed for NLP, Including\  Structured Full-Text and Citation Network](https://huggingface.co/papers/2303.14957)

[Large-scale data sets on scholarly publications are the basis for a variety\\
of bibliometric analyses and natural language processing (NLP) applications.\\
Especially data sets derived from publication's full-text have recently gained\\
attention. While several such data sets already exist, we see key shortcomings\\
in terms of their domain and time coverage, citation network completeness, and\\
representation of full-text content. To address these points, we propose a new\\
version of the data set unarXive. We base our data processing pipeline and\\
output format on two existing data sets, and improve on each of them. Our\\
resulting data set comprises 1.9 M publications spanning multiple disciplines\\
and 32 years. It furthermore has a more complete citation network than its\\
predecessors and retains a richer representation of document structure as well\\
as non-textual publication content such as mathematical notation. In addition\\
to the data set, we provide ready-to-use training/test data for citation\\
recommendation and IMRaD classification. All data and source code is publicly\\
available at https://github.com/IllDepence/unarXive.](https://huggingface.co/papers/2303.14957)

[- 3 authors](https://huggingface.co/papers/2303.14957)

·

Mar 26, 2023

[-](https://huggingface.co/login?next=%2Fpapers%2F1904.09131)

### [OpenTapioca: Lightweight Entity Linking for Wikidata](https://huggingface.co/papers/1904.09131)

[We propose a simple Named Entity Linking system that can be trained from Wikidata only. This demonstrates the strengths and weaknesses of this data source for this task and provides an easily reproducible baseline to compare other systems against. Our model is lightweight to train, to run and to keep synchronous with Wikidata in real time.](https://huggingface.co/papers/1904.09131)

[- 1 authors](https://huggingface.co/papers/1904.09131)

·

Nov 23, 2020

[-](https://huggingface.co/login?next=%2Fpapers%2F2404.03862)

### [Verifiable by Design: Aligning Language Models to Quote from\  Pre-Training Data](https://huggingface.co/papers/2404.03862)

[For humans to trust the fluent generations of large language models (LLMs),\\
they must be able to verify their correctness against trusted, external\\
sources. Recent efforts aim to increase verifiability through citations of\\
retrieved documents or post-hoc provenance. However, such citations are prone\\
to mistakes that further complicate their verifiability. To address these\\
limitations, we tackle the verifiability goal with a different philosophy: we\\
trivialize the verification process by developing models that quote verbatim\\
statements from trusted sources in pre-training data. We propose Quote-Tuning,\\
which demonstrates the feasibility of aligning LLMs to leverage memorized\\
information and quote from pre-training data. Quote-Tuning quantifies quoting\\
against large corpora with efficient membership inference tools, and uses the\\
amount of quotes as an implicit reward signal to construct a synthetic\\
preference dataset for quoting, without any human annotation. Next, the target\\
model is aligned to quote using preference optimization algorithms.\\
Experimental results show that Quote-Tuning significantly increases the\\
percentage of LLM generation quoted verbatim from high-quality pre-training\\
documents by 55% to 130% relative to untuned models while maintaining response\\
quality. Further experiments demonstrate that Quote-Tuning generalizes quoting\\
to out-of-domain data, is applicable in different tasks, and provides\\
additional benefits to truthfulness. Quote-Tuning not only serves as a\\
hassle-free method to increase quoting but also opens up avenues for improving\\
LLM trustworthiness through better verifiability.](https://huggingface.co/papers/2404.03862)

[- ![](https://huggingface.co/avatars/0280d4df417855965a0964d22766c012.svg)\\
- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/63e410e88083f19a218be964/8gqsYilSTSCt8E3JmajP-.jpeg)\\
- ![](https://huggingface.co/avatars/03ff66a419db8f2bc8e89a3b47aaaeac.svg)\\
- 5 authors](https://huggingface.co/papers/2404.03862)

·

Apr 4, 2024

[2](https://huggingface.co/login?next=%2Fpapers%2F2412.14860)

### [Think&Cite: Improving Attributed Text Generation with Self-Guided Tree\  Search and Progress Reward Modeling](https://huggingface.co/papers/2412.14860)

[Despite their outstanding capabilities, large language models (LLMs) are\\
prone to hallucination and producing factually incorrect information. This\\
challenge has spurred efforts in attributed text generation, which prompts LLMs\\
to generate content with supporting evidence. In this paper, we propose a novel\\
framework, called Think&Cite, and formulate attributed text generation as a\\
multi-step reasoning problem integrated with search. Specifically, we propose\\
Self-Guided Monte Carlo Tree Search (SG-MCTS), which capitalizes on the\\
self-reflection capability of LLMs to reflect on the intermediate states of\\
MCTS for guiding the tree expansion process. To provide reliable and\\
comprehensive feedback, we introduce Progress Reward Models to measure the\\
progress of tree search from the root to the current state from two aspects,\\
i.e., generation and attribution progress. We conduct extensive experiments on\\
three datasets and the results show that our approach significantly outperforms\\
baseline approaches.](https://huggingface.co/papers/2412.14860)

[- 2 authors](https://huggingface.co/papers/2412.14860)

·

Dec 19, 2024

[-](https://huggingface.co/login?next=%2Fpapers%2F2411.13477)

### [PatentEdits: Framing Patent Novelty as Textual Entailment](https://huggingface.co/papers/2411.13477)

[A patent must be deemed novel and non-obvious in order to be granted by the\\
US Patent Office (USPTO). If it is not, a US patent examiner will cite the\\
prior work, or prior art, that invalidates the novelty and issue a non-final\\
rejection. Predicting what claims of the invention should change given the\\
prior art is an essential and crucial step in securing invention rights, yet\\
has not been studied before as a learnable task. In this work we introduce the\\
PatentEdits dataset, which contains 105K examples of successful revisions that\\
overcome objections to novelty. We design algorithms to label edits sentence by\\
sentence, then establish how well these edits can be predicted with large\\
language models (LLMs). We demonstrate that evaluating textual entailment\\
between cited references and draft sentences is especially effective in\\
predicting which inventive claims remained unchanged or are novel in relation\\
to prior art.](https://huggingface.co/papers/2411.13477)

[- ![](https://huggingface.co/avatars/9ac6db8b8541162ee625a8929a2736ee.svg)\\
- 3 authors](https://huggingface.co/papers/2411.13477)

·

Nov 20, 2024

[1](https://huggingface.co/login?next=%2Fpapers%2F2506.21763)

### [THE-Tree: Can Tracing Historical Evolution Enhance Scientific Verification and Reasoning?](https://huggingface.co/papers/2506.21763)

[Large Language Models (LLMs) are accelerating scientific idea generation, but rigorously evaluating these numerous, often superficial, AI-generated propositions for novelty and factual accuracy is a critical bottleneck; manual verification is too slow. Existing validation methods are inadequate: LLMs as standalone verifiers may hallucinate and lack domain knowledge (our findings show 60% unawareness of relevant papers in specific domains), while traditional citation networks lack explicit causality and narrative surveys are unstructured. This underscores a core challenge: the absence of structured, verifiable, and causally-linked historical data of scientific evolution.To address this,we introduce THE-Tree (Technology History Evolution Tree), a computational framework that constructs such domain-specific evolution trees from scientific literature. THE-Tree employs a search algorithm to explore evolutionary paths. During its node expansion, it utilizes a novel "Think-Verbalize-Cite-Verify" process: an LLM proposes potential advancements and cites supporting literature. Critically, each proposed evolutionary link is then validated for logical coherence and evidential support by a recovered natural language inference mechanism that interrogates the cited literature, ensuring that each step is grounded. We construct and validate 88 THE-Trees across diverse domains and release a benchmark dataset including up to 71k fact verifications covering 27k papers to foster further research. Experiments demonstrate that i) in graph completion, our THE-Tree improves hit@1 by 8% to 14% across multiple models compared to traditional citation networks; ii) for predicting future scientific developments, it improves hit@1 metric by nearly 10%; and iii) when combined with other methods, it boosts the performance of evaluating important scientific papers by almost 100%.](https://huggingface.co/papers/2506.21763)

[- 8 authors](https://huggingface.co/papers/2506.21763)

·

Jun 26, 2025

[-](https://huggingface.co/login?next=%2Fpapers%2F2510.24478)

### [Talk2Ref: A Dataset for Reference Prediction from Scientific Talks](https://huggingface.co/papers/2510.24478)

[Scientific talks are a growing medium for disseminating research, and\\
automatically identifying relevant literature that grounds or enriches a talk\\
would be highly valuable for researchers and students alike. We introduce\\
Reference Prediction from Talks (RPT), a new task that maps long, and\\
unstructured scientific presentations to relevant papers. To support research\\
on RPT, we present Talk2Ref, the first large-scale dataset of its kind,\\
containing 6,279 talks and 43,429 cited papers (26 per talk on average), where\\
relevance is approximated by the papers cited in the talk's corresponding\\
source publication. We establish strong baselines by evaluating\\
state-of-the-art text embedding models in zero-shot retrieval scenarios, and\\
propose a dual-encoder architecture trained on Talk2Ref. We further explore\\
strategies for handling long transcripts, as well as training for domain\\
adaptation. Our results show that fine-tuning on Talk2Ref significantly\\
improves citation prediction performance, demonstrating both the challenges of\\
the task and the effectiveness of our dataset for learning semantic\\
representations from spoken scientific content. The dataset and trained models\\
are released under an open license to foster future research on integrating\\
spoken scientific communication into citation recommendation systems.](https://huggingface.co/papers/2510.24478)

[- 3 authors](https://huggingface.co/papers/2510.24478)

·

Oct 28, 2025

[4](https://huggingface.co/login?next=%2Fpapers%2F2602.01031)

### [HalluHard: A Hard Multi-Turn Hallucination Benchmark](https://huggingface.co/papers/2602.01031)

[Large language models (LLMs) still produce plausible-sounding but ungrounded factual claims, a problem that worsens in multi-turn dialogue as context grows and early errors cascade. We introduce HalluHard, a challenging multi-turn hallucination benchmark with 950 seed questions spanning four high-stakes domains: legal cases, research questions, medical guidelines, and coding. We operationalize groundedness by requiring inline citations for factual assertions. To support reliable evaluation in open-ended settings, we propose a judging pipeline that iteratively retrieves evidence via web search. It can fetch, filter, and parse full-text sources (including PDFs) to assess whether cited material actually supports the generated content. Across a diverse set of frontier proprietary and open-weight models, hallucinations remain substantial even with web search (approx 30% for the strongest configuration, Opus-4.5 with web search), with content-grounding errors persisting at high rates. Finally, we show that hallucination behavior is shaped by model capacity, turn position, effective reasoning, and the type of knowledge required.](https://huggingface.co/papers/2602.01031)

[- 4 authors](https://huggingface.co/papers/2602.01031)

·

Jan 31 [3](https://huggingface.co/papers/2602.01031#community)

[-](https://huggingface.co/login?next=%2Fpapers%2F2205.05414)

### [Recommending Research Papers to Chemists: A Specialized Interface for Chemical Entity Exploration](https://huggingface.co/papers/2205.05414)

[Researchers and scientists increasingly rely on specialized information retrieval (IR) or recommendation systems (RS) to support them in their daily research tasks. Paper recommender systems are one such tool scientists use to stay on top of the ever-increasing number of academic publications in their field. Improving research paper recommender systems is an active research field. However, less research has focused on how the interfaces of research paper recommender systems can be tailored to suit the needs of different research domains. For example, in the field of biomedicine and chemistry, researchers are not only interested in textual relevance but may also want to discover or compare the contained chemical entity information found in a paper's full text. Existing recommender systems for academic literature do not support the discovery of this non-textual, but semantically valuable, chemical entity data. We present the first implementation of a specialized chemistry paper recommender system capable of visualizing the contained chemical structures, chemical formulae, and synonyms for chemical compounds within the document's full text. We review existing tools and related research in this field before describing the implementation of our ChemVis system. With the help of chemists, we are expanding the functionality of ChemVis, and will perform an evaluation of recommendation performance and usability in future work.](https://huggingface.co/papers/2205.05414)

[- 4 authors](https://huggingface.co/papers/2205.05414)

·

May 11, 2022

[-](https://huggingface.co/login?next=%2Fpapers%2F2010.06395)

### [Aspect-based Document Similarity for Research Papers](https://huggingface.co/papers/2010.06395)

[Traditional document similarity measures provide a coarse-grained distinction\\
between similar and dissimilar documents. Typically, they do not consider in\\
what aspects two documents are similar. This limits the granularity of\\
applications like recommender systems that rely on document similarity. In this\\
paper, we extend similarity with aspect information by performing a pairwise\\
document classification task. We evaluate our aspect-based document similarity\\
for research papers. Paper citations indicate the aspect-based similarity,\\
i.e., the section title in which a citation occurs acts as a label for the pair\\
of citing and cited paper. We apply a series of Transformer models such as\\
RoBERTa, ELECTRA, XLNet, and BERT variations and compare them to an LSTM\\
baseline. We perform our experiments on two newly constructed datasets of\\
172,073 research paper pairs from the ACL Anthology and CORD-19 corpus. Our\\
results show SciBERT as the best performing system. A qualitative examination\\
validates our quantitative results. Our findings motivate future research of\\
aspect-based document similarity and the development of a recommender system\\
based on the evaluated techniques. We make our datasets, code, and trained\\
models publicly available.](https://huggingface.co/papers/2010.06395)

[- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/5efda656ff69163f6f59e5d2/YJM48t7eddfun1E3k1iNS.jpeg)\\
- 5 authors](https://huggingface.co/papers/2010.06395)

·

Oct 13, 2020

[-](https://huggingface.co/login?next=%2Fpapers%2F2408.08896)

### [LLMJudge: LLMs for Relevance Judgments](https://huggingface.co/papers/2408.08896)

[The LLMJudge challenge is organized as part of the LLM4Eval workshop at SIGIR\\
2024\. Test collections are essential for evaluating information retrieval (IR)\\
systems. The evaluation and tuning of a search system is largely based on\\
relevance labels, which indicate whether a document is useful for a specific\\
search and user. However, collecting relevance judgments on a large scale is\\
costly and resource-intensive. Consequently, typical experiments rely on\\
third-party labelers who may not always produce accurate annotations. The\\
LLMJudge challenge aims to explore an alternative approach by using LLMs to\\
generate relevance judgments. Recent studies have shown that LLMs can generate\\
reliable relevance judgments for search systems. However, it remains unclear\\
which LLMs can match the accuracy of human labelers, which prompts are most\\
effective, how fine-tuned open-source LLMs compare to closed-source LLMs like\\
GPT-4, whether there are biases in synthetically generated data, and if data\\
leakage affects the quality of generated labels. This challenge will\\
investigate these questions, and the collected data will be released as a\\
package to support automatic relevance judgment research in information\\
retrieval and search.](https://huggingface.co/papers/2408.08896)

[- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/64108fc514215c0775e13f5e/pHWr8TlBnYrulo2owIrrv.jpeg)\\
- 9 authors](https://huggingface.co/papers/2408.08896)

·

Aug 9, 2024

[-](https://huggingface.co/login?next=%2Fpapers%2F2404.16764)

### [Dataset of Quotation Attribution in German News Articles](https://huggingface.co/papers/2404.16764)

[Extracting who says what to whom is a crucial part in analyzing human\\
communication in today's abundance of data such as online news articles. Yet,\\
the lack of annotated data for this task in German news articles severely\\
limits the quality and usability of possible systems. To remedy this, we\\
present a new, freely available, creative-commons-licensed dataset for\\
quotation attribution in German news articles based on WIKINEWS. The dataset\\
provides curated, high-quality annotations across 1000 documents (250,000\\
tokens) in a fine-grained annotation schema enabling various downstream uses\\
for the dataset. The annotations not only specify who said what but also how,\\
in which context, to whom and define the type of quotation. We specify our\\
annotation schema, describe the creation of the dataset and provide a\\
quantitative analysis. Further, we describe suitable evaluation metrics, apply\\
two existing systems for quotation attribution, discuss their results to\\
evaluate the utility of our dataset and outline use cases of our dataset in\\
downstream tasks.](https://huggingface.co/papers/2404.16764)

[- 2 authors](https://huggingface.co/papers/2404.16764)

·

Apr 25, 2024

[2](https://huggingface.co/login?next=%2Fpapers%2F2610.02202)

### [ScholarCatalyst: A Benchmark for Retrieving Papers That Inspire New Research](https://huggingface.co/papers/2610.02202)

[What makes great scientists great? Even as AI systems start to make progress on open problems, scientists remain far ahead of them at sensing which prior idea, buried in an ever-growing archive of research, a new problem needs. To study this skill, we draw on researchers who know firsthand which earlier work advanced their completed projects, with papers serving as pointers to the ideas within. Using our automated pipeline that makes author annotation scalable, we build ScholarCatalyst by having 184 lead authors of 207 recent computer science papers label which candidates did or could have advanced their project, each with a detailed rationale. We introduce a retrieval task with author-provided judgments: given an initial research question, retrieve these papers from only the literature available when the project began. Agentic search does no better than embedding retrieval (0.42 vs. 0.48 Recall@20) despite calling that same retriever as a tool. Even an agent built on Claude Fable 5.1, which may have seen the completed papers during training, reaches only 0.51 R@20. These results highlight the need for new training recipes that equip models with expert intuition for searching broad corpora. We envision ScholarCatalyst as a step toward scientific agents that can take a half-formed idea and point to the prior research it needs.](https://huggingface.co/papers/2610.02202)

[- 14 authors](https://huggingface.co/papers/2610.02202)

·

Sep 30 [1](https://huggingface.co/papers/2610.02202#community)

[-](https://huggingface.co/login?next=%2Fpapers%2F2607.12052)

### [Representation and Reference Selection in Training-Free Synthetic Image Attribution](https://huggingface.co/papers/2607.12052)

[Synthetic image attribution aims at identifying the generator responsible for a given AI-generated image. Training-free reference-based attribution methods are easily scalable, since newly emerging generators can be incorporated by adding source-specific references rather than retraining a task-specific classifier. Their performance depends on two coupled factors: the representation space used for comparison and the way source-specific references are constructed. However, the interaction between these two factors remains largely unexplored. In this paper, we provide a controlled analysis of this interaction using references and off-the-shelf pretrained representations. We study representations extracted from different layers of CLIP and DINOv2, along with three reference selection methods with varying semantic constraints: arbitrary, semantically aligned, and resynthesis-based references. Our results show that attribution accuracy consistently peaks at intermediate representation levels, indicating that source-discriminative cues are more accessible before strong semantic abstraction dominates. We further show that intermediate representations are not completely semantically neutral, making reference selection critical: semantically constrained references reduce query-reference mismatch and improve attribution, especially under limited reference budgets. Resynthesis is most useful in low-reference regimes, while semantically aligned references provide a better accuracy-cost trade-off when a moderate-sized reference pool is available. Our findings show that training-free reference-based attribution should be understood as the interaction between where images are compared, how the reference set is constructed, and how many references are available.](https://huggingface.co/papers/2607.12052)

[- 4 authors](https://huggingface.co/papers/2607.12052)

·

Jul 12

[-](https://huggingface.co/login?next=%2Fpapers%2F2402.03003)

### [\[Citation needed\] Data usage and citation practices in medical imaging\  conferences](https://huggingface.co/papers/2402.03003)

[Medical imaging papers often focus on methodology, but the quality of the\\
algorithms and the validity of the conclusions are highly dependent on the\\
datasets used. As creating datasets requires a lot of effort, researchers often\\
use publicly available datasets, there is however no adopted standard for\\
citing the datasets used in scientific papers, leading to difficulty in\\
tracking dataset usage. In this work, we present two open-source tools we\\
created that could help with the detection of dataset usage, a pipeline\\
https://github.com/TheoSourget/Public\_Medical\_Datasets\_References using\\
OpenAlex and full-text analysis, and a PDF annotation software\\
https://github.com/TheoSourget/pdf\_annotator used in our study to\\
manually label the presence of datasets. We applied both tools on a study of\\
the usage of 20 publicly available medical datasets in papers from MICCAI and\\
MIDL. We compute the proportion and the evolution between 2013 and 2023 of 3\\
types of presence in a paper: cited, mentioned in the full text, cited and\\
mentioned. Our findings demonstrate the concentration of the usage of a limited\\
set of datasets. We also highlight different citing practices, making the\\
automation of tracking difficult.](https://huggingface.co/papers/2402.03003)

[- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/639480b689b4c802079883a6/-nRrc-0DmWZZ9SdT9Au8v.jpeg)\\
- 8 authors](https://huggingface.co/papers/2402.03003)

·

Feb 5, 2024

[-](https://huggingface.co/login?next=%2Fpapers%2F2501.13491)

### [RECALL: Library-Like Behavior In Language Models is Enhanced by Self-Referencing Causal Cycles](https://huggingface.co/papers/2501.13491)

[We introduce the concept of the self-referencing causal cycle (abbreviated RECALL) - a mechanism that enables large language models (LLMs) to bypass the limitations of unidirectional causality, which underlies a phenomenon known as the reversal curse. When an LLM is prompted with sequential data, it often fails to recall preceding context. For example, when we ask an LLM to recall the line preceding "O say does that star-spangled banner yet wave" in the U.S. National Anthem, it often fails to correctly return "Gave proof through the night that our flag was still there" - this is due to the reversal curse. It occurs because language models such as ChatGPT and Llama generate text based on preceding tokens, requiring facts to be learned and reproduced in a consistent token order. While the reversal curse is often viewed as a limitation, we offer evidence of an alternative view: it is not always an obstacle in practice. We find that RECALL is driven by what we designate as cycle tokens - sequences that connect different parts of the training data, enabling recall of preceding tokens from succeeding ones. Through rigorous probabilistic formalization and controlled experiments, we demonstrate how the cycles they induce influence a model's ability to reproduce information. To facilitate reproducibility, we provide our code and experimental details at https://anonymous.4open.science/r/remember-B0B8/.](https://huggingface.co/papers/2501.13491)

[- 9 authors](https://huggingface.co/papers/2501.13491)

·

Jan 22, 2025

[5](https://huggingface.co/login?next=%2Fpapers%2F2503.08684)

### [Perplexity Trap: PLM-Based Retrievers Overrate Low Perplexity Documents](https://huggingface.co/papers/2503.08684)

[Previous studies have found that PLM-based retrieval models exhibit a\\
preference for LLM-generated content, assigning higher relevance scores to\\
these documents even when their semantic quality is comparable to human-written\\
ones. This phenomenon, known as source bias, threatens the sustainable\\
development of the information access ecosystem. However, the underlying causes\\
of source bias remain unexplored. In this paper, we explain the process of\\
information retrieval with a causal graph and discover that PLM-based\\
retrievers learn perplexity features for relevance estimation, causing source\\
bias by ranking the documents with low perplexity higher. Theoretical analysis\\
further reveals that the phenomenon stems from the positive correlation between\\
the gradients of the loss functions in language modeling task and retrieval\\
task. Based on the analysis, a causal-inspired inference-time debiasing method\\
is proposed, called Causal Diagnosis and Correction (CDC). CDC first diagnoses\\
the bias effect of the perplexity and then separates the bias effect from the\\
overall estimated relevance score. Experimental results across three domains\\
demonstrate the superior debiasing effectiveness of CDC, emphasizing the\\
validity of our proposed explanatory framework. Source codes are available at\\
https://github.com/WhyDwelledOnAi/Perplexity-Trap.](https://huggingface.co/papers/2503.08684)

[- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/64db88993725f8d9a908c077/JZEGk0kius6mrANlwOWw9.jpeg)\\
- 9 authors](https://huggingface.co/papers/2503.08684)

·

Mar 11, 2025[2](https://huggingface.co/papers/2503.08684#community)

[-](https://huggingface.co/login?next=%2Fpapers%2F2307.12794)

### [BIP! NDR (NoDoiRefs): A Dataset of Citations From Papers Without DOIs in\  Computer Science Conferences and Workshops](https://huggingface.co/papers/2307.12794)

[In the field of Computer Science, conference and workshop papers serve as\\
important contributions, carrying substantial weight in research assessment\\
processes, compared to other disciplines. However, a considerable number of\\
these papers are not assigned a Digital Object Identifier (DOI), hence their\\
citations are not reported in widely used citation datasets like OpenCitations\\
and Crossref, raising limitations to citation analysis. While the Microsoft\\
Academic Graph (MAG) previously addressed this issue by providing substantial\\
coverage, its discontinuation has created a void in available data. BIP! NDR\\
aims to alleviate this issue and enhance the research assessment processes\\
within the field of Computer Science. To accomplish this, it leverages a\\
workflow that identifies and retrieves Open Science papers lacking DOIs from\\
the DBLP Corpus, and by performing text analysis, it extracts citation\\
information directly from their full text. The current version of the dataset\\
contains more than 510K citations made by approximately 60K open access\\
Computer Science conference or workshop papers that, according to DBLP, do not\\
have a DOI.](https://huggingface.co/papers/2307.12794)

[- 4 authors](https://huggingface.co/papers/2307.12794)

·

Jul 24, 2023

[-](https://huggingface.co/login?next=%2Fpapers%2F2608.27394)

### [RATIO: A Benchmark for Retrieval Across Typed Ideation Operations in Scientific Literature](https://huggingface.co/papers/2608.27394)

[Retrieved scientific literature can serve as inspiration for both human and AI scientists. Inspiration can take different forms: prior work may directly suggest how to address a problem, or surface directions at different levels of abstraction - zooming out to a more general view or zooming in to a concrete realization. We introduce RATIO (Retrieval Across Typed Ideation Operations), a large-scale benchmark in which relevance is defined by three operations which we name ideation moves: Address retrieves potential approaches for stated problems, Broaden retrieves more general formulations, and Specify retrieves concrete instantiations. RATIO is constructed from millions of full-text scientific papers across CS literature via a general recipe that extends discourse-marker distant supervision - previously used only for classification - to corpus-scale retrieval, combined with extensive LLM and human vetting. Experiments show that operation-specific fine-tuning substantially boosts retrievers but leaves much room for further improvements. RATIO provides a scalable training and evaluation framework for retrieval components that support literature-grounded ideation, opening up new research avenues on scientific inspiration retrieval.](https://huggingface.co/papers/2608.27394)

[- 2 authors](https://huggingface.co/papers/2608.27394)

·

Aug 31

[14](https://huggingface.co/login?next=%2Fpapers%2F2408.15836)

### [Knowledge Navigator: LLM-guided Browsing Framework for Exploratory\  Search in Scientific Literature](https://huggingface.co/papers/2408.15836)

[The exponential growth of scientific literature necessitates advanced tools\\
for effective knowledge exploration. We present Knowledge Navigator, a system\\
designed to enhance exploratory search abilities by organizing and structuring\\
the retrieved documents from broad topical queries into a navigable, two-level\\
hierarchy of named and descriptive scientific topics and subtopics. This\\
structured organization provides an overall view of the research themes in a\\
domain, while also enabling iterative search and deeper knowledge discovery\\
within specific subtopics by allowing users to refine their focus and retrieve\\
additional relevant documents. Knowledge Navigator combines LLM capabilities\\
with cluster-based methods to enable an effective browsing method. We\\
demonstrate our approach's effectiveness through automatic and manual\\
evaluations on two novel benchmarks, CLUSTREC-COVID and SCITOC. Our code,\\
prompts, and benchmarks are made publicly available.](https://huggingface.co/papers/2408.15836)

[- ![](https://huggingface.co/avatars/a8622e2a189a13c7b5a99177c3a87c37.svg)\\
- ![](https://huggingface.co/avatars/383409ebd912ba90d8e7966e61a3910d.svg)\\
- ![](https://huggingface.co/avatars/22f6463216904fb0ec8306e704432ab7.svg)\\
- 3 authors](https://huggingface.co/papers/2408.15836)

·

Aug 28, 2024[4](https://huggingface.co/papers/2408.15836#community)

[-](https://huggingface.co/login?next=%2Fpapers%2F2603.08450)

### [A Dataset for Probing Translationese Preferences in English-to-Swedish Translation](https://huggingface.co/papers/2603.08450)

[Translations often carry traces of the source language, a phenomenon known as translationese. We introduce the first freely available English-to-Swedish dataset contrasting translationese sentences with idiomatic alternatives, designed to probe intrinsic preferences of language models. It includes error tags and descriptions of the problems in the original translations. In experiments evaluating smaller Swedish and multilingual LLMs with our dataset, we find that they often favor the translationese phrasing. Human alternatives are chosen more often when the English source sentence is omitted, indicating that exposure to the source biases models toward literal translations, although even without context models often prefer the translationese variant. Our dataset and findings provide a resource and benchmark for developing models that produce more natural, idiomatic output in non-English languages.](https://huggingface.co/papers/2603.08450)

[- ![](https://huggingface.co/avatars/313f0edf1c1eaa6c7eeec007c9c2524e.svg)\\
- 3 authors](https://huggingface.co/papers/2603.08450)

·

Mar 9

[-](https://huggingface.co/login?next=%2Fpapers%2F2508.20867)

### [MSRS: Evaluating Multi-Source Retrieval-Augmented Generation](https://huggingface.co/papers/2508.20867)

[Retrieval-augmented systems are typically evaluated in settings where\\
information required to answer the query can be found within a single source or\\
the answer is short-form or factoid-based. However, many real-world\\
applications demand the ability to integrate and summarize information\\
scattered across multiple sources, where no single source is sufficient to\\
respond to the user's question. In such settings, the retrieval component of a\\
RAG pipeline must recognize a variety of relevance signals, and the generation\\
component must connect and synthesize information across multiple sources. We\\
present a scalable framework for constructing evaluation benchmarks that\\
challenge RAG systems to integrate information across distinct sources and\\
generate long-form responses. Using our framework, we build two new benchmarks\\
on Multi-Source Retrieval and Synthesis: MSRS-Story and MSRS-Meet, representing\\
narrative synthesis and summarization tasks, respectively, that require\\
retrieval from large collections. Our extensive experiments with various RAG\\
pipelines -- including sparse and dense retrievers combined with frontier LLMs\\
\-\- reveal that generation quality is highly dependent on retrieval\\
effectiveness, which varies greatly by task. While multi-source synthesis\\
proves challenging even in an oracle retrieval setting, we find that reasoning\\
models significantly outperform standard LLMs at this distinct step.](https://huggingface.co/papers/2508.20867)

[- ![](https://cdn-avatars.huggingface.co/v1/production/uploads/62f662bcc58915315c4eccea/zOAQLONfMP88zr70sxHK-.jpeg)\\
- ![](https://huggingface.co/avatars/ae36c535ced1b05ae82c2412e3a272c7.svg)\\
- 7 authors](https://huggingface.co/papers/2508.20867)

·

Aug 28, 2025

[1](https://huggingface.co/login?next=%2Fpapers%2F2608.18988)

### [DeepWeaver: Bridging the Evidence Synthesis Gap in Open-Ended Question Answering](https://huggingface.co/papers/2608.18988)

[Retrieve-then-generate pipelines are commonly used to produce deep-research answers for open-ended questions, but retrieval alone is insufficient: LLMs must organize noisy and fragmented evidence into comprehensive, well-cited answers. We refer to this process as evidence synthesis. However, direct generation often underuses evidence, misaligns citations, and collapses diverse information into shallow summaries, exposing an evidence synthesis gap between retrieval and generation. Thus, we propose DeepWeaver, a novel framework that weaves noisy retrieved evidence into comprehensive answers by maintaining Thought Block Chains (TBCs), a structured representation that groups claims, salient information, keywords, and supporting evidence. DeepWeaver uses subordinate TBCs to inspect residual evidence, commit TBC revisions, and discover new claims before final generation. We evaluate DeepWeaver on open-ended QA over both knowledge bases and the web, and introduce LoQA, a high-density benchmark for evidence synthesis. Across multiple LLMs, DeepWeaver improves content sufficiency, citation grounding, and detail preservation on LoQA, while achieving deeper insights and higher citation quality on DeepResearch Bench. These results show that evidence weaving is an effective mechanism for bridging retrieval and generation in open-ended QA. Our code is available at https://github.com/KlozeWang/DeepWeaver.](https://huggingface.co/papers/2608.18988)

[- 5 authors](https://huggingface.co/papers/2608.18988)

·

Aug 18

[-](https://huggingface.co/login?next=%2Fpapers%2F2412.06272)

### [Methods for Legal Citation Prediction in the Age of LLMs: An Australian\  Law Case Study](https://huggingface.co/papers/2412.06272)

[In recent years, Large Language Models (LLMs) have shown great potential\\
across a wide range of legal tasks. Despite these advances, mitigating\\
hallucination remains a significant challenge, with state-of-the-art LLMs still\\
frequently generating incorrect legal references. In this paper, we focus on\\
the problem of legal citation prediction within the Australian law context,\\
where correctly identifying and citing relevant legislations or precedents is\\
critical. We compare several approaches: prompting general purpose and\\
law-specialised LLMs, retrieval-only pipelines with both generic and\\
domain-specific embeddings, task-specific instruction-tuning of LLMs, and\\
hybrid strategies that combine LLMs with retrieval augmentation, query\\
expansion, or voting ensembles. Our findings indicate that domain-specific\\
pre-training alone is insufficient for achieving satisfactory citation accuracy\\
even after law-specialised pre-training. In contrast, instruction tuning on our\\
task-specific dataset dramatically boosts performance reaching the best results\\
across all settings. We also highlight that database granularity along with the\\
type of embeddings play a critical role in the performance of retrieval\\
systems. Among retrieval-based approaches, hybrid methods consistently\\
outperform retrieval-only setups, and among these, ensemble voting delivers the\\
best result by combining the predictive quality of instruction-tuned LLMs with\\
the retrieval system.](https://huggingface.co/papers/2412.06272)

[- 3 authors](https://huggingface.co/papers/2412.06272)

·

Dec 8, 2024

[Previous](https://huggingface.co/papers/date/2026-10-01)

Trending Papers ranked by GitHub stars activity
