---
url: https://arxiv.org/html/2601.04171v1
retrieved: 2026-10-06
command: firecrawl scrape https://arxiv.org/html/2601.04171v1 --only-main-content --max-age 0 --format markdown,rawHtml --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Agentic Rubrics as Contextual Verifiers for SWE Agents
---
Title:

Content selection saved. Describe the issue below:

Description:

![](https://arxiv.org/static/base/1.0.1/images/icons/smileybones-small.svg)arXiv is now an independent nonprofit! [Learn more](https://info.arxiv.org/about) ×

[License: CC BY 4.0](https://info.arxiv.org/help/license/index.html#licenses-available)

arXiv:2601.04171v1 \[cs.LG\] 07 Jan 2026

# Agentic Rubrics as Contextual Verifiers for SWE Agents

Anisha Gunjal
Affiliation: 1Scale AI
Bing Liu1Affiliation: 1Scale AI
Yunzhong He1Affiliation: 1Scale AI

###### Abstract

Verification is critical for improving agents: it provides the reward signal for Reinforcement Learning and enables inference-time gains through Test-Time Scaling (TTS). Despite its importance, verification in _software engineering (SWE)_ agent settings often relies on code execution, which can be difficult to scale due to environment setup overhead. Scalable alternatives such as patch classifiers and heuristic methods exist, but they are less grounded in codebase context and harder to interpret. To this end, we explore Agentic Rubrics: an expert agent interacts with the repository to create a context-grounded rubric checklist, and candidate patches are then scored against it without requiring test execution. On SWE-Bench Verified under parallel TTS evaluation, Agentic Rubrics achieve a score of 54.2% on Qwen3-Coder-30B-A3B and 40.6% on Qwen3-32B, with at least a +3.5 percentage-point gain over the strongest baseline in our comparison set. We further analyze rubric behavior, showing that rubric scores are consistent with ground-truth tests while also flagging issues that tests do not capture. Our ablations show that agentic context gathering is essential for producing codebase-specific, unambiguous criteria. Together, these results suggest that Agentic Rubrics provide an efficient, scalable, and granular verification signal for SWE agents.

11footnotetext: Equal contribution.

mohit.raghavendra@scale.com [https://scale.com/research/agenticrubrics](https://scale.com/research/agenticrubrics "")

## 1 Introduction

Figure 1: Agentic rubric pipeline. In the rubric-generation phase (left), a rubric agent inspects the codebase and PR description using repository tools, then produces a rubric.yaml organized along four rubric axes (File Change, Spec Alignment, Integrity, Runtime). In the verification phase (right), a SWE agent proposes a patch, which is graded against the rubric to yield an execution-free verifier score.

Large Language Models (LLMs) have rapidly advanced on coding tasks, enabling increasingly capable software engineering (SWE) agents for realistic code editing and bug fixing \[ [28](https://arxiv.org/html/2601.04171v1#bib.bib28 ""), [9](https://arxiv.org/html/2601.04171v1#bib.bib9 ""), [21](https://arxiv.org/html/2601.04171v1#bib.bib21 "")\]. A central bottleneck in training and evaluating such agents is _verification_: determining whether a candidate patch is correct, complete, safe, and aligned with the intended behavior. _Verifier’s Law_ links the ease of training AI systems on a task to the efficiency and reliability of verifying candidate solutions \[ [22](https://arxiv.org/html/2601.04171v1#bib.bib22 "")\]. In SWE agent, strong verification plays a dual role. It provides supervision for post-training with verifiable rewards \[ [13](https://arxiv.org/html/2601.04171v1#bib.bib13 "")\], and it improves inference through test-time scaling by sampling multiple candidates and selecting the best one using a verifier \[ [3](https://arxiv.org/html/2601.04171v1#bib.bib3 "")\].

Current approaches use a range of verifiers, including unit tests (human or LLM-generated), learned patch classifiers, similarity metrics, and LLM judges \[ [12](https://arxiv.org/html/2601.04171v1#bib.bib12 ""), [23](https://arxiv.org/html/2601.04171v1#bib.bib23 ""), [10](https://arxiv.org/html/2601.04171v1#bib.bib10 ""), [24](https://arxiv.org/html/2601.04171v1#bib.bib24 "")\]. Verification via code execution is environment-aware, but can be costly to scale due to per-instance setup (e.g., sandbox initialization), and may yield sparse or brittle signals, including limited distinguishability and test toxicity \[ [6](https://arxiv.org/html/2601.04171v1#bib.bib6 ""), [10](https://arxiv.org/html/2601.04171v1#bib.bib10 "")\]. In contrast, execution-free signals are operationally lightweight, but can be less reliable \[ [4](https://arxiv.org/html/2601.04171v1#bib.bib4 "")\], less interpretable, and prone to shallow cues. As SWE agents expand to more open-ended, goal-driven tasks and long-tail repositories, verifiers must become both scalable and codebase-specific.

To close this gap, we explore Agentic Rubrics. In our setup, illustrated in Figure [1](https://arxiv.org/html/2601.04171v1#S1.F1 "Figure 1 ‣ 1 Introduction ‣ Agentic Rubrics as Contextual Verifiers for SWE Agents"), an expert rubric agent first interacts with a sandboxed repository to synthesize _context-grounded_ rubric criteria; after rubric generation, candidate patches are scored without executing code, enabling scalable verification. We build on rubric-based verification \[ [16](https://arxiv.org/html/2601.04171v1#bib.bib16 ""), [25](https://arxiv.org/html/2601.04171v1#bib.bib25 "")\], which decomposes correctness into interpretable criteria that capture partial progress and surface failure modes. For SWE, rubrics written from the problem statement alone are often under-specified because they lack repository-specific context. Our rubric generation is therefore _agentic_: the verifier actively explores the repository to ground criteria in relevant code paths, interfaces, and project conventions, yielding rubric items that are more specific and consistently gradable. We evaluate Agentic Rubrics via best-of-KK selection under parallel test-time scaling on SWE-Bench Verified, ablate different design decisions and provide detailed analyses of rubric alignment and utility.

Our contributions are:
(1) We study Agentic Rubrics, a repository-grounded rubric generation paradigm with execution-free scoring for patch selection and post-training.
(2) We show that Agentic Rubrics consistently outperform strong test-based and execution-free verifier baselines under parallel test-time scaling on SWE-Bench Verified.
(3) We analyze why Agentic Rubrics work, demonstrating alignment with ground-truth tests and showing that rubrics surface diagnostic concerns (e.g., unnecessary edits or missing edge-case handling) even when tests pass.
(4) We demonstrate that agentic rubric generation can be distilled into smaller open-weight models, enabling scalable deployment.

## 2 Preliminaries

### 2.1 Verification for SWE Agents

We consider a _verifier_ as a procedure that assigns a score to a candidate patch for a given issue, with the goal of selecting or training toward higher-quality solutions. Prior work in SWE Agent settings commonly uses two broad classes of verification signals.
Execution-based methods verify patches by executing code, most often by running unit tests (human-authored ground-truth or LLM-generated) \[ [6](https://arxiv.org/html/2601.04171v1#bib.bib6 "")\]. Execution-free methods assess patch quality without running the repository, by reranking candidates using learned patch classifiers/verifiers, similarity metrics, or LLM judges \[ [23](https://arxiv.org/html/2601.04171v1#bib.bib23 "")\].
These approaches occupy different points in the trade-off space between repository grounding, operational cost, and reliability \[ [10](https://arxiv.org/html/2601.04171v1#bib.bib10 "")\]. Execution-based verification is environment-aware but can require per-instance setup (e.g., sandbox initialization) and may yield sparse or brittle signals (e.g., limited distinguishability or test toxicity). Execution-free verification is operationally lightweight, but can be less reliable \[ [4](https://arxiv.org/html/2601.04171v1#bib.bib4 "")\], less interpretable, and sometimes sensitive to surface-level cues (e.g., stylistic patterns, non-semantic artifacts) rather than functional correctness.

### 2.2 Rubric-based Verification

A _rubric_ verifies a candidate patch by decomposing correctness into a small set of explicit criteria [Arora et al. \[2\]](https://arxiv.org/html/2601.04171v1#bib.bib2 ""). Concretely, a rubric consists of criteria texts (optionally grouped by axes) with per-criterion weights, and a scoring rule that aggregates criterion-level judgments into a single verifier score. Given a problem and a candidate patch, a judge assigns each criterion a score (e.g., binary or graded) and aggregates them to obtain an overall patch score used for selection or learning.

For SWE tasks, a key practical consideration is _grounding_. Criteria written solely from the problem statement can omit repository-specific interfaces, constraints, and conventions, which makes judgments less precise and less consistent across patches. This motivates verifiers whose criteria are grounded in the right task-relevant repository context, while still allowing lightweight scoring once criteria are generated.

## 3 Experimental Design

### 3.1 Agentic Rubrics

##### Rubric Generation.

We implement a rubric-generation agent on top of the SWE Agent scaffold, which provides tools for repository navigation, file inspection/editing, and shell command execution \[ [28](https://arxiv.org/html/2601.04171v1#bib.bib28 ""), [21](https://arxiv.org/html/2601.04171v1#bib.bib21 "")\]. We modify the scaffold’s SYSTEM PROMPT, instructing the agent to explore the repository, gather task-relevant context, and produce a patch that adds a structured rubric file, rubrics.yaml (prompt in Appendix [A.10](https://arxiv.org/html/2601.04171v1#A1.SS10 "A.10 Prompts - Baselines and Agentic Rubrics ‣ Appendix A Appendix ‣ Agentic Rubrics as Contextual Verifiers for SWE Agents")). This workflow mirrors how developers validate fixes when comprehensive tests are unavailable: inspecting surrounding code and contracts, tracing call sites, and reasoning about edge cases.

Each rubric item is a tuple (ti,wi)(t\_{i},w\_{i}) consisting of a short natural-language criterion tit\_{i} and an importance weight wi∈{1,2,3}w\_{i}\\in\\{1,2,3\\} (nice-to-have / important / must-have), and is assigned to one of the following axes:

(i) File Change (4–8 items): edits are minimal, local, and sufficient for the fix;

(ii) Spec Alignment (3–6): the patch satisfies the requirements in the issue description;

(iii) Integrity (3–6): “no-cheating” and hygiene constraints (e.g., no test weakening, broad refactors, mass renames, or dependency churn);

(iv) Runtime (3–6): the changes imply the intended runtime behavior and avoid obvious execution-time issues.

We parse the submitted rubrics.yaml; if parsing fails, we consider the generation attempt invalid.

##### Rubric Grading.

Given a problem and a candidate patch, an LLM judge assigns each rubric item a binary score si∈{0,1}s\_{i}\\in\\{0,1\\} with importance weight wi∈{1,2,3}w\_{i}\\in\\{1,2,3\\}.
We aggregate scores as S=∑iwi​si∑iwiS=\\frac{\\sum\_{i}w\_{i}s\_{i}}{\\sum\_{i}w\_{i}}, yielding a verifier score S∈\[0,1\]S\\in\[0,1\] used for reranking candidates.

### 3.2 Test-time Scaling with Agentic Rubrics

MethodExecutionFreeExpertArtifactQwen332BQwen3CoderOracle Pass@1616––51.465.6Random Pass@1616––22.639.6Non-Agentic VerifiersSelf-Consistency✓–33.247.6Patch Classifier✓–37.150.2Agentic VerifiersAgentic Tests✗Tests33.649.0Agentic Patch Similarity✓Patch35.049.6Agentic Rubrics (ours)✓Rubric40.654.2

Figure 2: (Left) Best@16 resolution (%) with K=16K=16 rollouts for Qwen3-32B and Qwen3-Coder-30B-A3B. Verifier signals are generated with Claude Sonnet-4.5; LLM judging uses GPT-5 (low reasoning). (Right) Best@K scaling curves for Qwen3-32B rollouts under different verifiers, with numbers averaged over 100 trials.

##### Setup

Given a SWE problem statement description DD, a SWE agent produces a rollout trajectory T(j)T^{(j)} and candidate patch P(j)P^{(j)} for j=1,…,K=16j=1,\\ldots,K=16 independent rollouts. The verifier’s goal is to assign a score S(j)∈\[0,1\]S^{(j)}\\in\[0,1\] to each candidate. These are then reranked to select the best candidate patch.

##### Candidate patch generation

We use the SWE-Agent scaffold by [Yang et al. \[28\]](https://arxiv.org/html/2601.04171v1#bib.bib28 "") as the agent harness for the coding model to interact with the repository in a sandboxed environment to generate patch. For each of the 500 SWE-Bench Verified problems \[ [14](https://arxiv.org/html/2601.04171v1#bib.bib14 "")\], we sample 1616 independent rollouts and extract candidate patches, from a fixed generator model. We run experiments with two generators: Qwen3-32B (Instruct version, max 30 turns) and Qwen3-Coder-30B-A3B (max 50 turns), both at temperature 1.01.0\[ [27](https://arxiv.org/html/2601.04171v1#bib.bib27 "")\].

##### Evaluation protocol (Best@K).

A problem is considered _resolved_ if the candidate patch passes the ground-truth Fail-To-Pass and Pass-to-Pass tests.
We score all KK candidates and select the highest-scoring patch for Best@K resolution calculation. In cases where K<16K<16, we repeat sample 100100 trials to make this robust. As reference points, we report Oracle Pass@K (selecting using ground-truth tests; an upper bound) and Random@K (uniform selection).

### 3.3 Baselines

We group baseline verifiers into two categories based on whether they rely on an _externally generated verification artifact_ (e.g., tests, a reference patch, or a rubric) produced via repository interaction. Non-agentic verifiers score candidate patches directly from the problem statement and patch, without generating any additional artifact or inspecting the repository. Agentic verifiers first interact with the repository via an agentic scaffold to produce an artifact that is then used to score and re-rank candidates. Prompts used for all the baselines are provided in Appendix [A.10](https://arxiv.org/html/2601.04171v1#A1.SS10 "A.10 Prompts - Baselines and Agentic Rubrics ‣ Appendix A Appendix ‣ Agentic Rubrics as Contextual Verifiers for SWE Agents").

Non-agentic Verifiers (no artifact).

(i) Self-Consistency\[ [20](https://arxiv.org/html/2601.04171v1#bib.bib20 ""), [23](https://arxiv.org/html/2601.04171v1#bib.bib23 ""), [17](https://arxiv.org/html/2601.04171v1#bib.bib17 "")\]:
select the candidate patch whose diff has the highest average similarity to the remaining K−1K{-}1 candidates.111



We compute similarity using [difflib](https://docs.python.org/3/library/difflib.html "")’s SequenceMatcher.ratio() between unified-diff strings.

(ii) Patch Classifier\[ [15](https://arxiv.org/html/2601.04171v1#bib.bib15 ""), [10](https://arxiv.org/html/2601.04171v1#bib.bib10 "")\]:
an LLM judge predicts patch correctness and outputs a continuous score in \[0,1\]\[0,1\].

Agentic Verifiers (artifact-based).

(i) Agentic Tests\[ [10](https://arxiv.org/html/2601.04171v1#bib.bib10 "")\]:
an expert agent generates a problem-specific test\_issue.py with repository interaction; candidates are scored by executing these testcases.

(ii) Agentic Patch Similarity:
an expert agent generates a context-grounded _proxy reference patch_; candidates are reranked by similarity to this patch (scored by an LLM judge on a 1–5 scale).

(iii) Agentic Rubrics (our method):
an expert agent gathers repository context and synthesizes a structured rubrics.yaml; candidates are graded against rubric criteria to obtain a final verifier score.

##### Implementation details.

For methods that require a verification artifact (tests, proxy patch, or rubrics), we use Claude Sonnet-4.5 as the expert agent (30-turn budget) to generate the artifact via repository interaction; whenever scoring requires an LLM judge (patch classification, similarity scoring, rubric grading), we use GPT-5 (low reasoning). All verifiers run in the SWE-Bench Verified sandbox with the repository reset to a pre-PR snapshot: agents may inspect the codebase and existing tests, but cannot access or execute the hidden ground-truth evaluation tests, reference patches, or git history. If an artifact wasn’t correctly produced (e.g., missing test\_issue.py or invalid rubrics.yaml), we assign a score of 0. Prior work shows that verifier decisions can be unduly influenced by agent’s thinking trace \[ [10](https://arxiv.org/html/2601.04171v1#bib.bib10 "")\]. So to keep evaluation uniform and reduce verifier hacking, scoring for all methods use only on the problem statement, verifier artifact and the final submitted patch, not the full rollout trajectory or tool traces.

## 4 Results

### 4.1 Test Time scaling with Agentic Rubrics

##### Agentic Rubrics improve Best@K selection.

Figure [2](https://arxiv.org/html/2601.04171v1#S3.F2 "Figure 2 ‣ 3.2 Test-time Scaling with Agentic Rubrics ‣ 3 Experimental Design ‣ Agentic Rubrics as Contextual Verifiers for SWE Agents") reports Best@16 for rollouts from two generator models, Qwen3-32B and Qwen3-Coder, grouping verifiers into _non-agentic_ methods that score patches directly (no artifact) and _agentic_ methods that first generate a verification artifact (tests, a proxy patch, or a rubric) via repository interaction. The right panel shows how Best@K scales with KK for Qwen3-32B.

At K=16, Agentic Rubrics is the top-performing verifier in both settings. For Qwen3-32B, Agentic Rubrics achieves 40.6% Best@16, improving over the best performing non-agentic baseline (Patch Classifier, 37.1%) by +3.5 points and over the strongest artifact-based alternative (Agentic Patch Similarity, 35.0%) by +4.6 points. For Qwen3-Coder-30B-A3B, Agentic Rubrics attains 54.2%, improving over the best non-agentic baseline (50.2%) by +4.0 points and over the best agentic baseline (49.6%) by +4.6 points. The scaling curve further shows that rubric-based scoring maintains an advantage as K increases, indicating that the gain is not confined to a single operating point.

##### Rubrics provide most effective agentic signal.

While other agentic baselines also inject repository context, they rely on more brittle intermediate steps. Agentic Tests must generate _runnable_ tests in the sandbox (including setup/compilation) and those tests must cleanly discriminate between candidates. Agentic Patch Similarity scores “closeness” to a proxy reference patch, which can under-rank semantically correct but stylistically different fixes. Rubric artifacts instead use repository interaction to state _what should hold_ (file change, spec alignment, integrity, runtime) and then score candidates execution-free against these criteria, yielding a more robust and interpretable scoring signal.

We provide example problems, rubrics, and their grading of responses in Appendix [A.9](https://arxiv.org/html/2601.04171v1#A1.SS9 "A.9 Rubric Examples and grading ‣ Appendix A Appendix ‣ Agentic Rubrics as Contextual Verifiers for SWE Agents").

### 4.2 Analysis of Agentic Rubrics

We further examine rubric-based verification beyond aggregate Best@K. We first study _score alignment_: whether agentic rubric scores agree with ground-truth tests and patches in § [4.2.1](https://arxiv.org/html/2601.04171v1#S4.SS2.SSS1 "4.2.1 Rubric Score Alignment Analysis ‣ 4.2 Analysis of Agentic Rubrics ‣ 4 Results ‣ Agentic Rubrics as Contextual Verifiers for SWE Agents"). We then audit _utility_ by categorizing judgments into high- vs. low-utility modes, especially when rubrics are stricter than tests, to understand when they add signal beyond the available tests in § [4.2.2](https://arxiv.org/html/2601.04171v1#S4.SS2.SSS2 "4.2.2 Rubric Utility Analysis ‣ 4.2 Analysis of Agentic Rubrics ‣ 4 Results ‣ Agentic Rubrics as Contextual Verifiers for SWE Agents").

Figure 3: Distribution of Weighted Rubric score for Qwen3-32B rollouts on Sonnet-4.5 generated agentic rubrics, for both correct (Ground Truth Tests Pass - Green) and incorrect (Ground-Truth tests Fail - Red). Rubric scores are well aligned with the GT Test correctness signal, awarding lower score for incorrect patches and higher score for correct ones, while providing a denser score distribution.

#### 4.2.1 Rubric Score Alignment Analysis

##### Rubric scores separate passing vs. failing patches.

Figure [3](https://arxiv.org/html/2601.04171v1#S4.F3 "Figure 3 ‣ 4.2 Analysis of Agentic Rubrics ‣ 4 Results ‣ Agentic Rubrics as Contextual Verifiers for SWE Agents") plots Sonnet-4.5’s weighted rubric score distribution on SWE-Bench Verified rollouts by Qwen3-32B, split by whether the candidate patch passes the GT test suite. Rubric scores for GT-Pass rollouts concentrate near high rubric scores (typically 0.85–1.0), while GT-Fail rollouts receive much lower scores on average and spread across a wide range (often around 0.4–0.5). This spread suggests that rubrics can distinguish partial progress from fully-correct solutions, rather than providing only a binary signal like test-suite pass/fail.
Quantitatively, Rubric scores have an ROC-AUC score of 0.886 and PR-AUC of 0.722 against GT test Pass/Fail prediction. High PR-AUC suggests that rubrics prioritize true GT-passing patches in the high-precision regime, consistent with providing a more informative graded signal.

Figure [4](https://arxiv.org/html/2601.04171v1#S4.F4 "Figure 4 ‣ Rubric scores separate passing vs. failing patches. ‣ 4.2.1 Rubric Score Alignment Analysis ‣ 4.2 Analysis of Agentic Rubrics ‣ 4 Results ‣ Agentic Rubrics as Contextual Verifiers for SWE Agents") dissects this across File Change (scope), Spec Alignment, Integrity, and Runtime. GT-Failing patches tend to score lower because they make unnecessary edits (File Change), miss requirements (Spec Alignment), or have runtime issues (Runtime), while often remaining strong on Integrity. For GT-passing patches, Spec Alignment and Integrity are near-saturated, but we still see penalties from over-scoped edits and occasional runtime-check issues.

Figure 4: Category-wise distribution of Sonnet-4.5 rubric scores on Qwen3-32B rollouts. Incorrect patches (GT Test Failed, in red) score lower on File Change (Edit scope) and Spec Alignment (Satisfying prompt requirements) and Runtime issues, but still good preserving codebase integrity and avoid cheating. Patches that pass ground-truth tests (GT Test Passed, in green) have a very high spec-alignment and integrity score but still suffer from edit scope and in some cases, have issues in runtime checks.

##### Ground-Truth Patch Agreement

We also score human-written _Ground-Truth patches_ from the original pull requests, which all pass the SWE-Bench Verified Ground-Truth tests in Appendix [A.1](https://arxiv.org/html/2601.04171v1#A1.SS1 "A.1 Analyzing agentic rubric scores against Ground-Truth patch ‣ Appendix A Appendix ‣ Agentic Rubrics as Contextual Verifiers for SWE Agents"). Table [3](https://arxiv.org/html/2601.04171v1#A1.T3 "Table 3 ‣ A.1 Analyzing agentic rubric scores against Ground-Truth patch ‣ Appendix A Appendix ‣ Agentic Rubrics as Contextual Verifiers for SWE Agents") and Figure [8](https://arxiv.org/html/2601.04171v1#A1.F8 "Figure 8 ‣ A.1 Analyzing agentic rubric scores against Ground-Truth patch ‣ Appendix A Appendix ‣ Agentic Rubrics as Contextual Verifiers for SWE Agents") shows that GT patches receive consistently high rubric scores (mean >0.8>0.8) across axes from frontier models, suggesting that expert-generated rubrics are broadly compatible with high-quality human fixes. One recurring exception is the File Change axis, where rubrics can be more prescriptive about exact edit location/scope than the GT implementation.

(a)High-alignment cases (ground-truth test case reward = 1, rubric reward ≥\\geq 0.7).

(b)Low-alignment cases (ground-truth test case reward = 1, rubric reward <0.7<0.7).

Figure 5: Qualitative breakdown of agentic rubric utility relative to SWE-Bench Verified ground-truth tests. (a) In high-alignment cases, 78% of rubrics are high-utility (core semantics, API/compatibility, structure, edge coverage), with 22% low-utility (low-signal, over-specified, spec- or test-mismatched). (b) When tests pass but rubric scores are low, 54% of rubric failures are high-utility—often flagging missed root causes or missing edge-case coverage—while 46% reflect low-utility modes (over-specification, redundancy, rule mismatches, spec conflicts).

##### Takeaway

_Rubric signals are highly correlated with human written Ground Truth tests and patches. Rubric scores also provide a denser signal than test pass/fail by assigning intermediate credit to partially-correct patches and provides detailed technical feedback across different axes._

#### 4.2.2 Rubric Utility Analysis

Since rubrics are generated synthetically without a canonical correctness check, we further scrutinize them for true utility versus spurious signals. We study _when_ rubric judgments are useful by labeling them as _high-utility_ (spec-consistent, semantically meaningful checks such as core semantics, API/compatibility, structure/scope, edge coverage) or _low-utility_ (redundant, over-prescriptive, or misaligned). For a subset of 100 SWE-Bench Verified instances, we prompt GPT-5 (medium reasoning) to assign each case a High-/Low-Utility tag and a sub-category from Table [5](https://arxiv.org/html/2601.04171v1#A1.T5 "Table 5 ‣ A.6 Categories of rubric utility classification ‣ Appendix A Appendix ‣ Agentic Rubrics as Contextual Verifiers for SWE Agents"), using the problem statement and Ground-Truth tests and patches as the reference spec (refer Appendix [A.12](https://arxiv.org/html/2601.04171v1#A1.SS12 "A.12 Rubric Utility Analysis Prompt ‣ Appendix A Appendix ‣ Agentic Rubrics as Contextual Verifiers for SWE Agents")).

##### When rubrics and tests agree.

Figure [5](https://arxiv.org/html/2601.04171v1#S4.F5 "Figure 5 ‣ Ground-Truth Patch Agreement ‣ 4.2.1 Rubric Score Alignment Analysis ‣ 4.2 Analysis of Agentic Rubrics ‣ 4 Results ‣ Agentic Rubrics as Contextual Verifiers for SWE Agents")(a) aggregates cases where rubric and test outcomes agree (both accept or both reject, using a rubric acceptance threshold of 0.70.7). In this regime, 78% of rubric judgments are high-utility, primarily reflecting _Core Semantics_, _API/Compatibility_, _Structure/Scope_, and _Edge Coverage_. The remaining 22% are low-utility (e.g., low-signal, over-specified, test-mismatched rubrics, etc.)

##### When rubrics are stricter than tests.

Figure [5](https://arxiv.org/html/2601.04171v1#S4.F5 "Figure 5 ‣ Ground-Truth Patch Agreement ‣ 4.2.1 Rubric Score Alignment Analysis ‣ 4.2 Analysis of Agentic Rubrics ‣ 4 Results ‣ Agentic Rubrics as Contextual Verifiers for SWE Agents")(b) considers cases where tests accept a patch but the rubric score is below 0.70.7. Even here, 54% of rubric failures are high-utility, most often flagging _Root Cause Missed_ and _Missing Edges_ \- issues that may not be covered by the available GT tests. The remaining 46% low-utility cases highlight failure modes like over-specified fixes, redundant signals, and rubric–test mismatches, which can be mitigated using human-in-the-loop rubric refinement in future work.

##### Takeaway

Across both regimes, most rubric judgments are _substantive_: when rubrics agree with GT-tests, they do so mainly for core semantic and interface reasons (78% high-utility), & when rubrics disagree by rejecting GT-test passing patches, over half of these rejections (54%) flag plausible under-tested issues (root cause missed or missing edges).

## 5 Ablations

In this section, we ablate key components of the Agentic Rubrics pipeline to isolate the impact of (i) the rubric-agent model, (ii) repository context gathering during rubric construction, and (iii) the judge model used for rubric grading.

### 5.1 Rubric-Agent Model Choice

(a)Comparing models as rubric creation agents

(b)Rubric structure

Figure 6: (a) Test-time scaling using rubrics generated by various frontier and open models on rollouts from Qwen-Coder-30B-A3B. (b) Distribution of rubric counts per instance across rubric-generation models.

We investigate the performance of various frontier and Open-weight models in generating rubrics, by studying their test-time performance on rollouts by a fixed policy model (Qwen3-Coder-30B-A3B) and a fixed judge model (GPT-5 low reasoning). The models use their default reasoning effort when applicable.

Figure [6](https://arxiv.org/html/2601.04171v1#S5.F6 "Figure 6 ‣ 5.1 Rubric-Agent Model Choice ‣ 5 Ablations ‣ Agentic Rubrics as Contextual Verifiers for SWE Agents")(a) shows the BEST@16 resolution rate when using each model’s rubrics on SWE-Bench Verified. We see that the capability of the rubric generation model directly impacts their TTS performance. Frontier coding models (Claude Opus-4.5, Claude Sonnet-4.5 and Gemini-3-Pro) achieve the highest BEST@16 resolution rates of 54%. Open-weight coding models like Qwen3-Coder-30B-A3B and Code World Model are not as effective (4̃5%), and finally, non-coding agentic model like Qwen3-32B rubrics yield around 43%.
Figure [6](https://arxiv.org/html/2601.04171v1#S5.F6 "Figure 6 ‣ 5.1 Rubric-Agent Model Choice ‣ 5 Ablations ‣ Agentic Rubrics as Contextual Verifiers for SWE Agents")(b) provides some insight into this performance gap: more capable models generate sometimes substantially more rubrics per instance. For instance, Sonnet-4.5 averages over 20 rubrics per instance, twice that of Qwen3-32B and CWM, although exceptions like Gemini-3-Pro exist. Increased granularity can enable finer-grained differentiation between candidate solutions, explaining the correlation between model capability and selection performance. In addition, rubrics from expert frontier models rubrics are better aligned with ground-truth reference patches, and we analyze this in Appendix [A.1](https://arxiv.org/html/2601.04171v1#A1.SS1 "A.1 Analyzing agentic rubric scores against Ground-Truth patch ‣ Appendix A Appendix ‣ Agentic Rubrics as Contextual Verifiers for SWE Agents"). We also report the model’s success rate in using the agentic scaffold and producing parseable rubrics in Appendix [A.2](https://arxiv.org/html/2601.04171v1#A1.SS2 "A.2 Agentic abilities of rubric generation models ‣ Appendix A Appendix ‣ Agentic Rubrics as Contextual Verifiers for SWE Agents").

##### Takeaway

Rubric-agent capability matters: stronger frontier models generate more granular rubrics with higher human alignment, which translates into higher Best@16 performance.

#### 5.1.1 Training Open-Weight Rubric Agents

Motivated by this, we study if such rubric generation capability can be distilled from expert frontier models like Sonnet-4.5 into smaller open-models like Qwen3-32B. We fine-tune Qwen3-32B to _generate agentic rubrics_ using the agentic scaffold, and compare against fine-tuning the same model as a _patch classifier_ from the same expert model - a common execution-free verifier used in prior works \[ [10](https://arxiv.org/html/2601.04171v1#bib.bib10 ""), [15](https://arxiv.org/html/2601.04171v1#bib.bib15 "")\].

Figure 7: Finetuning (SFT) open-weight models like Qwen3-32B as Agentic Rubric Generator outperforms finetuning them as Patch Classifier for SWE verification.

##### Training Setup.

Following [Jain et al. \[10\]](https://arxiv.org/html/2601.04171v1#bib.bib10 ""), for the patch classifier, we fine-tune Qwen3-32B to output a YES/NO judgment given a problem statement and candidate patch. We sample 2,000 prompts from R2E-Gym and collect 4,696 test-labeled examples (approximately balanced) drawn from both expert (Sonnet-4.5) and on-policy (Qwen3-32B) rollouts. During verification, we extract the YES/NO token probability as the score for the patch.
For the agentic rubric generator, we fine-tune Qwen3-32B use the agentic harness and emit a rubric file, using 2,000 rubric-generation trajectories produced by Sonnet-4.5 (no on-policy rubric samples).
Similar to [Jain et al. \[10\]](https://arxiv.org/html/2601.04171v1#bib.bib10 ""), we use the AdamW optimization for 2 epochs, a 1.0​e−51.0e-5 learning rate with cosine scheduling and a batch size of 32, over 4 nodes of 8xH100 GPUs.

##### Results.

Figure [7](https://arxiv.org/html/2601.04171v1#S5.F7 "Figure 7 ‣ 5.1.1 Training Open-Weight Rubric Agents ‣ 5.1 Rubric-Agent Model Choice ‣ 5 Ablations ‣ Agentic Rubrics as Contextual Verifiers for SWE Agents") shows that the agentic rubric generator substantially outperforms the patch-classifier verifier, and also the non-finetuned base models. This indicates the ability to produce structured, context-grounded rubrics is trainable, and is a stronger and more robust objective than binary classification for execution-free verification.

### 5.2 Impact of Repository Grounding

|     |     |     |
| --- | --- | --- |
| Non-Agentic Rubric | Agentic Rubric | Tool Calls |
| “Targets code paths handling relational operators in the parser without touching unrelated operators” | “Adds a visit\_Compare method to EvaluateFalseTransformer class” | \- find -path "\*/parsing/\*"<br>\- str\_replace\_editor view<br>\- view --view\_range 1090 1194 |
| “Modifies the kbd role implementation file that contains HTML generation logic” | “Modifies KeyboardTransform class in transforms.py” | \- find -exec grep -l "kbd"<br>\- grep -r "kbd" transforms.py<br>\- str\_replace\_editor view |

Table 1: Comparison of Non-Agentic vs Agentic Rubrics with the agent’s tool calls that gather relevant context

To isolate the value of repository interaction, we compare Agentic Rubrics to Non-Agentic Rubrics generated by the same model from the problem statement alone, without access to the agentic harness or codebase (prompt in Appendix [A.10](https://arxiv.org/html/2601.04171v1#A1.SS10 "A.10 Prompts - Baselines and Agentic Rubrics ‣ Appendix A Appendix ‣ Agentic Rubrics as Contextual Verifiers for SWE Agents")). As shown in Table [1](https://arxiv.org/html/2601.04171v1#S5.T1 "Table 1 ‣ 5.2 Impact of Repository Grounding ‣ 5 Ablations ‣ Agentic Rubrics as Contextual Verifiers for SWE Agents"), agentic rubrics use targeted tool calls (search and file inspection) to ground criteria in concrete repository entities (files, classes, methods), making items more specific and consistently gradable; non-agentic rubrics are often high-level (e.g., “touches the right code path”), which increases ambiguity and can lead to false positives. Empirically, on SWE-Bench Verified, using Sonnet-4.5 for rubric generation without repository access reduces Best@16 by 4.0 points on Qwen3-32B rollouts and 1.4 points on Qwen3-Coder-30B-A3B rollouts, showing that agentic context gathering improves both rubric quality and downstream selection.

### 5.3 Sensitivity to Judge Model Choice

In table [2](https://arxiv.org/html/2601.04171v1#S5.T2 "Table 2 ‣ 5.3 Sensitivity to Judge Model Choice ‣ 5 Ablations ‣ Agentic Rubrics as Contextual Verifiers for SWE Agents"), we analyze how the capability of the judge model affects rubric grading on Sonnet-4.5 rubrics for Qwen3-32B rollouts. We use three increasing reasoning efforts on the GPT-5 model. We find that judge model capability has a small but non-trivial effect on performance. We don’t require high reasoning efforts from our judge models, since rubrics are designed to be self-contained and atomic for easy grading. We also measure the flakiness of rubric grading in [A.4](https://arxiv.org/html/2601.04171v1#A1.SS4 "A.4 Rubric Flakiness Study ‣ Appendix A Appendix ‣ Agentic Rubrics as Contextual Verifiers for SWE Agents").

|     |     |
| --- | --- |
| Judge Model | Best@16 |
| GPT-5-mini | 52.6 ±\\pm 2.20 |
| GPT-5 Low Reasoning | 54.2 ±\\pm 2.22 |
| GPT-5 Medium Reasoning | 54.3 ±\\pm 2.25 |
| GPT-5 High Reasoning | 55.0 ±\\pm 2.21 |

Table 2: Best@16 accuracy for different judge model capabilities for scoring Sonnet-4.5 rubrics on Qwen3-Coder-30B-A3B rollouts.

## 6 Related Work

##### Coding Agents and Test Time Scaling

Real world coding for SWE problems have become a popular domain for applying LLMs. SWE enviornments from open-source GitHub repos provide a good testbed for training \[ [10](https://arxiv.org/html/2601.04171v1#bib.bib10 ""), [11](https://arxiv.org/html/2601.04171v1#bib.bib11 ""), [15](https://arxiv.org/html/2601.04171v1#bib.bib15 ""), [23](https://arxiv.org/html/2601.04171v1#bib.bib23 ""), [12](https://arxiv.org/html/2601.04171v1#bib.bib12 "")\] and evaluation of coding agents \[ [14](https://arxiv.org/html/2601.04171v1#bib.bib14 ""), [5](https://arxiv.org/html/2601.04171v1#bib.bib5 "")\]. Agentic scaffolds like Agentless, SWEAgent, Mini SWEAgent and OpenHands define a standardized interface for using these models on such tasks \[ [26](https://arxiv.org/html/2601.04171v1#bib.bib26 ""), [28](https://arxiv.org/html/2601.04171v1#bib.bib28 ""), [18](https://arxiv.org/html/2601.04171v1#bib.bib18 ""), [21](https://arxiv.org/html/2601.04171v1#bib.bib21 "")\]. Test-Time Scaling (TTS) is a way to leverage inference-time compute to improve performance on verifiable tasks like SWE Agents. \[ [29](https://arxiv.org/html/2601.04171v1#bib.bib29 ""), [20](https://arxiv.org/html/2601.04171v1#bib.bib20 ""), [3](https://arxiv.org/html/2601.04171v1#bib.bib3 ""), [30](https://arxiv.org/html/2601.04171v1#bib.bib30 "")\]. In addition, some works study the use of verifiers for TTS and RL, but they are limited to training a reward/scoring model like a patch classifier or a testing agent \[ [15](https://arxiv.org/html/2601.04171v1#bib.bib15 ""), [10](https://arxiv.org/html/2601.04171v1#bib.bib10 ""), [12](https://arxiv.org/html/2601.04171v1#bib.bib12 ""), [24](https://arxiv.org/html/2601.04171v1#bib.bib24 "")\].

##### Rubrics as verifiers for LLMs

Rubrics have become the predominant way to evaluate LLMs on several key capabilities \[ [2](https://arxiv.org/html/2601.04171v1#bib.bib2 ""), [1](https://arxiv.org/html/2601.04171v1#bib.bib1 "")\]. They have also been used as a reward signal to train LLMs during RL \[ [8](https://arxiv.org/html/2601.04171v1#bib.bib8 ""), [19](https://arxiv.org/html/2601.04171v1#bib.bib19 ""), [7](https://arxiv.org/html/2601.04171v1#bib.bib7 "")\]. In this work, we describe how context-aware rubrics are an effective verifier that can holistically verify candidates for SWE tasks, and demonstrate their value through TTS.

## 7 Conclusion

Automatic, high-quality verification is essential for improving SWE agents. We study Agentic Rubrics, a context-grounded yet execution-free verification signal for SWE patches. Under the standard parallel test-time scaling setting on SWE-Bench Verified, Agentic Rubrics consistently outperform strong non-agentic and agentic baselines. Beyond selection performance, rubrics provide interpretable natural-language feedback and are well-aligned with human-written ground-truth tests and reference patches, while also surfacing failure modes that the available tests may not capture. Finally, our ablations study key design choices in the agentic rubric pipeline, including the role of repository interaction, the rubric agent, and the judge model. We hope these findings motivate future work on improving rubric quality and integrating rubrics as reward signals for scalable post-training of SWE agents.

## 8 Limitations

Agentic Rubrics provide an interpretable, codebase-grounded verification signal that can be applied _without test execution_ once the rubric is produced. In this paper, we study them in the parallel test-time scaling setting, which offers a clean and widely used way to evaluate verifiers by holding the generator fixed and varying only the selection rule. A natural next step is to integrate rubric signals into _post-training_ pipelines, where they could act as rewards for RLVR-style optimization. This introduces additional challenges such as reward hacking, non-stationarity as policies improve, and credit assignment across multi-step agent behavior, which we leave as future work.

Rubric quality is another important axis. While our utility analysis shows that most automatically generated rubric judgments are _high-utility_ and substantively grounded, a subset of rubrics fall into low-utility modes (e.g., over-specification, redundancy, or rubric–test mismatches). This motivates _human-in-the-loop_ refinement as a practical next step: lightweight review/editing, rubric-template reuse, and targeted prompts for common failure modes could further improve rubric fidelity while preserving auditability, and can also generate supervision for stronger rubric-generation models.

## References

- \[1\]
A. F. Akyürek, A. Gosai, C. B. C. Zhang, V. Gupta, J. Jeong, A. Gunjal, T. Rabbani, M. Mazzone, D. Randolph, M. Mahmoudi Meymand, G. Chattha, P. Rodriguez, D. Mares, P. Singh, M. Liu, S. Chawla, P. Cline, L. Ogaz, E. Hernandez, Z. Wang, P. Bhatter, M. Ayestaran, B. Liu, and Y. He.

PRBench: Large-scale expert rubrics for evaluating high-stakes professional reasoning.

_arXiv preprint arXiv:2511.11562_, 2025.

- \[2\]
R. K. Arora, J. Wei, R. Soskin Hicks, P. Bowman, J. Quiñonero-Candela, F. Tsimpourlas, M. Sharman, M. Shah, A. Vallone, A. Beutel, J. Heidecke, and K. Singhal.

Healthbench: Evaluating large language models towards improved human health.

_arXiv preprint arXiv:2505.08775_, 2025.

- \[3\]
B. Brown, J. Juravsky, R. Ehrlich, R. Clark, Q. V. Le, C. Ré, and A. Mirhoseini.

Large language monkeys: Scaling inference compute with repeated sampling, 2024.

URL [https://arxiv.org/abs/2407.21787](https://arxiv.org/abs/2407.21787 "").

- \[4\]
G. Crupi, R. Tufano, A. Velasco, A. Mastropaolo, D. Poshyvanyk, and G. Bavota.

On the effectiveness of llm-as-a-judge for code generation and summarization, 2025.

URL [https://arxiv.org/abs/2507.16587](https://arxiv.org/abs/2507.16587 "").

- \[5\]
X. Deng, J. Da, E. Pan, Y. Y. He, C. Ide, K. Garg, N. Lauffer, A. Park, N. Pasari, C. Rane, K. Sampath, M. Krishnan, S. Kundurthy, S. Hendryx, Z. Wang, C. B. C. Zhang, N. Jacobson, B. Liu, and B. Kenstler.

SWE-Bench Pro: Can AI agents solve long-horizon software engineering tasks?

_arXiv preprint arXiv:2509.16941_, 2025.

- \[6\]
R. Ehrlich, B. Brown, J. Juravsky, R. Clark, C. Ré, and A. Mirhoseini.

Codemonkeys: Scaling test-time compute for software engineering, 2025.

URL [https://arxiv.org/abs/2501.14723](https://arxiv.org/abs/2501.14723 "").

- \[7\]
S. Goel, R. Hazra, D. Jayalath, T. Willi, P. Jain, W. F. Shen, I. Leontiadis, F. Barbieri, Y. Bachrach, J. Geiping, and C. Whitehouse.

Training ai co-scientists using rubric rewards, 2025.

URL [https://arxiv.org/abs/2512.23707](https://arxiv.org/abs/2512.23707 "").

- \[8\]
A. Gunjal, A. Wang, E. Lau, V. Nath, Y. He, B. Liu, and S. Hendryx.

Rubrics as rewards: Reinforcement learning beyond verifiable domains.

_arXiv preprint arXiv:2507.17746_, 2025.

- \[9\]
B. Hui, J. Yang, Z. Cui, J. Yang, D. Liu, L. Zhang, T. Liu, J. Zhang, B. Yu, K. Dang, et al.

Qwen2. 5-coder technical report.

_arXiv preprint arXiv:2409.12186_, 2024.

- \[10\]
N. Jain, J. Singh, M. Shetty, L. Zheng, K. Sen, and I. Stoica.

R2e-gym: Procedural environments and hybrid verifiers for scaling open-weights swe agents.

_arXiv preprint arXiv:2504.07164_, 2025.

- \[11\]
C. E. Jimenez, J. Yang, A. Wettig, S. Yao, K. Pei, O. Press, and K. Narasimhan.

Swe-bench: Can language models resolve real-world github issues?

_arXiv preprint arXiv:2310.06770_, 2023.

- \[12\]
M. Luo, N. Jain, J. Singh, S. Tan, A. Patel, Q. Wu, A. Ariyak, C. Cai, S. Z. T. Venkat, B. Athiwaratkun, et al.

Deepswe: Training a fully open-sourced, state-of-the-art coding agent by scaling rl.

- \[13\]
T. OLMo, P. Walsh, L. Soldaini, D. Groeneveld, K. Lo, S. Arora, A. Bhagia, Y. Gu, S. Huang, M. Jordan, N. Lambert, D. Schwenk, O. Tafjord, T. Anderson, D. Atkinson, F. Brahman, C. Clark, P. Dasigi, N. Dziri, A. Ettinger, M. Guerquin, D. Heineman, H. Ivison, P. W. Koh, J. Liu, S. Malik, W. Merrill, L. J. V. Miranda, J. Morrison, T. Murray, C. Nam, J. Poznanski, V. Pyatkin, A. Rangapur, M. Schmitz, S. Skjonsberg, D. Wadden, C. Wilhelm, M. Wilson, L. Zettlemoyer, A. Farhadi, N. A. Smith, and H. Hajishirzi.

2 olmo 2 furious, 2025.

URL [https://arxiv.org/abs/2501.00656](https://arxiv.org/abs/2501.00656 "").

- \[14\]
OpenAI.

Introducing swe-bench verified.

[https://openai.com/index/introducing-swe-bench-verified/](https://openai.com/index/introducing-swe-bench-verified/ ""), 2024.

OpenAI Blog.

- \[15\]
J. Pan, X. Wang, G. Neubig, N. Jaitly, H. Ji, A. Suhr, and Y. Zhang.

Training software engineering agents and verifiers with SWE-gym.

_arXiv preprint arXiv:2412.21139_, 2024.

- \[16\]
R. Shao, A. Asai, S. Z. Shen, H. Ivison, V. Kishore, J. Zhuo, X. Zhao, M. Park, S. G. Finlayson, D. Sontag, et al.

Dr tulu: Reinforcement learning with evolving rubrics for deep research.

_arXiv preprint arXiv:2511.19399_, 2025.

- \[17\]
N. Singhi, H. Bansal, A. Hosseini, A. Grover, K.-W. Chang, M. Rohrbach, and A. Rohrbach.

When to solve, when to verify: Compute-optimal problem solving and generative verification for llm reasoning.

_arXiv preprint arXiv:2504.01005_, 2025.

- \[18\]
SWE-agent Team.

mini-swe-agent: A 100-line software engineering agent.

[https://github.com/SWE-agent/mini-swe-agent](https://github.com/SWE-agent/mini-swe-agent ""), 2024.

GitHub repository.

- \[19\]
V. Viswanathan, Y. Sun, S. Ma, X. Kong, M. Cao, G. Neubig, and T. Wu.

Checklists are better than reward models for aligning language models.

_arXiv preprint arXiv:2507.18624_, 2025.

- \[20\]
X. Wang, J. Wei, D. Schuurmans, Q. Le, E. Chi, S. Narang, A. Chowdhery, and D. Zhou.

Self-consistency improves chain of thought reasoning in language models.

_Proceedings of the International Conference on Learning Representations (ICLR)_, 2023.

URL [https://arxiv.org/abs/2203.11171](https://arxiv.org/abs/2203.11171 "").

arXiv:2203.11171.

- \[21\]
X. Wang, B. Li, Y. Song, F. F. Xu, X. Tang, M. Zhuge, J. Pan, Y. Song, B. Li, J. Singh, et al.

Openhands: An open platform for ai software developers as generalist agents.

_arXiv preprint arXiv:2407.16741_, 2024.

- \[22\]
J. Wei.

Asymmetry of verification and verifier’s rule, July 2025.

URL [https://www.jasonwei.net/blog/asymmetry-of-verification-and-verifiers-law](https://www.jasonwei.net/blog/asymmetry-of-verification-and-verifiers-law "").

Blog post.

- \[23\]
Y. Wei, O. Duchenne, J. Copet, Q. Carbonneaux, L. Zhang, D. Fried, G. Synnaeve, R. Singh, and S. I. Wang.

SWE-RL: Advancing LLM reasoning via reinforcement learning on open software evolution.

_arXiv preprint arXiv:2502.18449_, 2025a.

- \[24\]
Y. Wei, Z. Sun, E. McMilin, J. Gehring, D. Zhang, G. Synnaeve, D. Fried, L. Zhang, and S. Wang.

Toward training superintelligent software agents through self-play swe-rl, 2025b.

URL [https://arxiv.org/abs/2512.18552](https://arxiv.org/abs/2512.18552 "").

- \[25\]
M. Wu, G. Zhang, S. Min, S. Levine, and A. Kumar.

Rlac: Reinforcement learning with adversarial critic for free-form generation tasks.

_arXiv preprint arXiv:2511.01758_, 2025.

- \[26\]
C. S. Xia, Y. Deng, S. Dunn, and L. Zhang.

Agentless: Demystifying llm-based software engineering agents, 2024.

URL [https://arxiv.org/abs/2407.01489](https://arxiv.org/abs/2407.01489 "").

- \[27\]
A. Yang, A. Li, B. Yang, B. Zhang, B. Hui, B. Zheng, B. Yu, C. Gao, C. Huang, C. Lv, C. Zheng, D. Liu, F. Zhou, F. Huang, F. Hu, H. Ge, H. Wei, H. Lin, J. Tang, J. Yang, J. Tu, J. Zhang, J. Yang, J. Yang, J. Zhou, J. Zhou, J. Lin, K. Dang, K. Bao, K. Yang, L. Yu, L. Deng, M. Li, M. Xue, M. Li, P. Zhang, P. Wang, Q. Zhu, R. Men, R. Gao, S. Liu, S. Luo, T. Li, T. Tang, W. Yin, X. Ren, X. Wang, X. Zhang, X. Ren, Y. Fan, Y. Su, Y. Zhang, Y. Zhang, Y. Wan, Y. Liu, Z. Wang, Z. Cui, Z. Zhang, Z. Zhou, and Z. Qiu.

Qwen3 technical report, 2025.

URL [https://arxiv.org/abs/2505.09388](https://arxiv.org/abs/2505.09388 "").

- \[28\]
J. Yang, C. E. Jimenez, A. Wettig, K. Lieret, S. Yao, K. Narasimhan, and O. Press.

Swe-agent: Agent-computer interfaces enable automated software engineering.

_Advances in Neural Information Processing Systems_, 37:50528–50652, 2024.

- \[29\]
S. Yao, D. Yu, J. Zhao, I. Shafran, T. L. Griffiths, Y. Cao, and K. Narasimhan.

Tree of thoughts: Deliberate problem solving with large language models.

In _Advances in Neural Information Processing Systems_, 2023.

URL [https://arxiv.org/abs/2305.10601](https://arxiv.org/abs/2305.10601 "").

NeurIPS 2023, arXiv:2305.10601.

- \[30\]
K. Zhu, H. Li, S. Wu, T. Xing, D. Ma, X. Tang, M. Liu, J. Yang, J. Liu, Y. E. Jiang, C. Zhang, C. Lin, J. Wang, G. Zhang, and W. Zhou.

Scaling test-time compute for LLM agents.

_arXiv preprint arXiv:2506.12928_, 2025.

URL [https://arxiv.org/abs/2506.12928](https://arxiv.org/abs/2506.12928 "").


## Appendix A Appendix

### A.1 Analyzing agentic rubric scores against Ground-Truth patch

Table 3: Average Weighted Scores by Agentic Rubrics produced by different models on human written Ground-Truth Patches

|     |     |
| --- | --- |
| Model | Avg Weighted Score |
| Opus-4.5 | 0.8658 |
| GPT-5 | 0.8413 |
| Sonnet-4.5 | 0.8233 |
| Gemini-3-Pro | 0.8082 |
| Meta-CWM | 0.8015 |
| Qwen3-Coder-30B-A3B | 0.8037 |
| Qwen3-32B | 0.6729 |

Figure 8: Distribution of rubric scores on reference patches comparing good vs bad models

In table [3](https://arxiv.org/html/2601.04171v1#A1.T3 "Table 3 ‣ A.1 Analyzing agentic rubric scores against Ground-Truth patch ‣ Appendix A Appendix ‣ Agentic Rubrics as Contextual Verifiers for SWE Agents"), we show the average scores by rubrics generated by different models over the Ground-Truth patches for the tasks. We also show the breakdown across different rubric axis for a representative subset in [8](https://arxiv.org/html/2601.04171v1#A1.F8 "Figure 8 ‣ A.1 Analyzing agentic rubric scores against Ground-Truth patch ‣ Appendix A Appendix ‣ Agentic Rubrics as Contextual Verifiers for SWE Agents"). Frontier Coding Models have higher alignment with human-written Ground-Truth patches than open-weight models.

### A.2 Agentic abilities of rubric generation models

Figure 9: Performance of different models in using the Rubric Generation scaffold to create parseable rubric files.

Figure [9](https://arxiv.org/html/2601.04171v1#A1.F9 "Figure 9 ‣ A.2 Agentic abilities of rubric generation models ‣ Appendix A Appendix ‣ Agentic Rubrics as Contextual Verifiers for SWE Agents") shows the percentage of instances where each model successfully produces parseable YAML rubric files. Frontier models demonstrate near-perfect adherence to the structured output format: Sonnet-4.5 and Gemini-3-Pro generate well-formatted rubric files 97.8% and 96.8% respectively, with zero parse errors. In contrast, smaller models exhibit degraded format compliance, due to weaker tool calling and instruction following. Qwen3-32B produces valid rubrics for only 74.6% of instances with an 18.2% parse error rate, while Meta-CWM succeeds on 69.4% of instances but fails to generate rubrics entirely for 29.8% of cases.

(a)Agentic harness use improvement through finetuning

(b)Rubric structure improvement through finetuning

Figure 10: Finetuning Qwen3-32B on Sonnet-4.5 rubric agent trajectories leads to (a) better use of the Agentic harness as demonstrated by reduced errors and (b) improved rubric distribution, matching the original model.

In figure [10](https://arxiv.org/html/2601.04171v1#A1.F10 "Figure 10 ‣ A.2 Agentic abilities of rubric generation models ‣ Appendix A Appendix ‣ Agentic Rubrics as Contextual Verifiers for SWE Agents"), we show how finetuning Qwen3-32B on Sonnet-4.5 rubric agent trajectories leads to better use of the Agentic harness as demonstrated by reduced errors and improved rubric distribution, matching the original teacher model. This demonstrates that we can train rubric generator models, which unlocks their use for creating preference data and reward models.

### A.3 Cost analysis for agentic verification methods

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| Method | Artifact | Grading | API | Qwen3-32B |
| Cost($) | Cost($) | Calls | Best@16 |
| Patch Sim. | 0.640 | 0.006 | 48.5 | 36.6 |
| Tests | 0.499 | 0.001 | 29.2 | 33.6 |
| Rubrics | 0.245 | 0.003 | 22.9 | 40.6 |

Table 4: Cost vs Performance (Qwen3-32B Best@K) comparison of different agentic verifier methods that all use the same underlying model, Sonnet-4.5. Artifact Cost is the average cost in USD ($) for the total input and output tokens in the entire trajectory. Note that agentic patch generation was run with 50 steps as the limit to improve solution patch quality since the reference patches produced with the 30 turn limit was too restrictive to get any comparable result, while the other methods are limited to 30 turns.

In table [4](https://arxiv.org/html/2601.04171v1#A1.T4 "Table 4 ‣ A.3 Cost analysis for agentic verification methods ‣ Appendix A Appendix ‣ Agentic Rubrics as Contextual Verifiers for SWE Agents"), we describe the cost analysis of different agentic methods. Note that the cost of Grading for Tests is spinning up a sandboxed environment for grading and running the test suite after applying the patch. We use Modal to run sandboxed containers. All costs are averaged over the entire dataset. The cost of artifact is once per instance (a fixed cost) while cost of grading per rollout, and will scale with the number of rollouts used. Therefore the average total cost of BEST@16 calculation (Agentic artifact generation + grading 16 rollouts) per instance is $0.736 for Patch Similarity, $0.515 for Test Generation and $0.293 for Rubrics.

We see that rubric generation is very cost efficient, requiring fewer tool calls and tokens while also achieving higher performance.

### A.4 Rubric Flakiness Study

To assess the reliability of LLM-based rubric evaluation, we do a flakiness study measuring grading determinism across repeated trials. We randomly sampled 20 instances for rubric generator models Sonnet-4.5, and Qwen3-32B, selecting 5 rubric items per instance (100 items per model). Each rubric item was then scored 5 independent times using GPT-5 (low reasoning) as the judge, producing binary assessments of whether the candidate patch satisfied the rubric criterion.

A rubric item is considered “flaky” if any of its 5 trial scores differ from the others. Our results demonstrate high scoring determinism, and stronger models write better, less flaky rubrics: Sonnet-4.5 generated rubrics exhibited only 2% flakiness (98% of items scored identically across all trials), while Qwen3-32B had 9% flakiness. We attribute such low levels of flakiness to our instructions that mandate rubrics to be atomic and self-contained, reducing the scope for the Judge’s interpretation for grading.

High consistency rates are important, since they lead to reproducible assessments and lower gaming opportunities. Future work can study this further, to establish best practices for writing strong, deterministic yet non-prescriptive rubrics.

### A.5 Hybrid verifiers using rubrics v/s classifier

Figure 11: Combining Agentic Rubrics with Agentic Tests, to build a Hybrid Verifier.

We also study how agentic rubrics compare against a classifier based approach when combined with generated tests in a hybrid approach similar to R2E-Gym \[ [10](https://arxiv.org/html/2601.04171v1#bib.bib10 "")\]. In figure [11](https://arxiv.org/html/2601.04171v1#A1.F11 "Figure 11 ‣ A.5 Hybrid verifiers using rubrics v/s classifier ‣ Appendix A Appendix ‣ Agentic Rubrics as Contextual Verifiers for SWE Agents"), we see that a hybrid verifier setup where we combine agentic tests and rubrics in a simple aggregation setup can work better than both methods in isolation. This opens up future work in combining these verifiers in more complex pipelines to extract maximum utility from different verfication methods.

### A.6 Categories of rubric utility classification

In table [5](https://arxiv.org/html/2601.04171v1#A1.T5 "Table 5 ‣ A.6 Categories of rubric utility classification ‣ Appendix A Appendix ‣ Agentic Rubrics as Contextual Verifiers for SWE Agents"), we describe the taxonomy used to label rubric utility. This was crafted manually by inspecting the rollouts and failure modes with different rubrics.

|     |     |     |
| --- | --- | --- |
| Tier | Sub-category | Description |
| High-Utility | Rule Break | Violation of an internal contract or assumption that should hold even if tests do not exercise it directly. |
| High-Utility | Band-Aid Fix | Patch makes tests pass but does not actually fix the underlying semantics or root cause of the bug. |
| High-Utility | Wrong Layer | Fix is implemented in the wrong module, class, or layer; the behavior change should live elsewhere in the codebase. |
| High-Utility | Root Cause Missed | Core bug remains present or is only partially addressed; the patch does not truly resolve the reported issue. |
| High-Utility | Missing Edges | Important edge cases or reproducer scenarios implied by the spec are not handled, even though the main path may pass tests. |
| High-Utility | Scope Creep | Patch introduces unrelated or off-scope changes (e.g., extra files, debug code, refactors, binary blobs). |
| High-Utility | Perf Risk | Patch is likely to introduce a non-trivial performance or resource-usage regression that tests do not directly measure. |
| High-Utility | API Break | Patch breaks a public API or its backward-compatible behavior as relied on by existing callers or downstream code. |
| High-Utility | Security Risk | Patch weakens validation, safety, or security properties (e.g., injection, data exposure) beyond what tests explicitly guard. |
| Low-Utility | Test Rules Mismatch | Rubric assumes a different test setup or evaluation protocol than the one actually used (e.g., expects modifying tests or harness behavior). |
| Low-Utility | Over-Specified Fix | Rubric demands a particular implementation strategy or pattern even though multiple correct fixes are allowed by the spec. |
| Low-Utility | API Over-Strict | Rubric penalizes benign API or structural changes even when observable behavior matches the ground-truth spec. |
| Low-Utility | Style Nit | Rubric focuses on purely stylistic or cosmetic issues with no semantic impact on correctness or behavior. |
| Low-Utility | Spec Clash | Rubric contradicts the problem statement, golden patch, or golden test cases (e.g., forbids behavior that the reference explicitly permits). |
| Low-Utility | Ref Patch Conflict | Golden patch itself violates the rubric’s stated constraint, indicating that the rubric is misaligned with the reference solution. |
| Low-Utility | Redundant Signal | Rubric adds no new information beyond other rubrics, effectively double-counting the same issue without additional insight. |
| Low-Utility | Eval Bug | Rubric failure arises from a scoring, matching, or parsing bug rather than an actual violation of the rubric text by the candidate patch. |
| Low-Utility | Irrelevant Rule | Rubric encodes a constraint that is not actually needed or justified for this particular bug or problem context. |

Table 5: Rubric category taxonomy used in utility analysis.

### A.7 SWE Agent Setup

We use the SWE-Agent scaffold [Yang et al. \[28\]](https://arxiv.org/html/2601.04171v1#bib.bib28 "") for all agentic setups. We add a turn reminder every 5 turns about the number of turns left for the agent before autosubmission. In addition, we wanted to study and distill rubric generation capability but many state-of-the-art models completely skip any thinking or assistant tokens and just returns the tool call with the default SWE-Agent setup. So we change the parsing function to explicitly mandate that in each turn, it return a short summary of its thinking. Prompts for all methods can be found in [A.10](https://arxiv.org/html/2601.04171v1#A1.SS10 "A.10 Prompts - Baselines and Agentic Rubrics ‣ Appendix A Appendix ‣ Agentic Rubrics as Contextual Verifiers for SWE Agents").

### A.8 Rubric and their grading - Illustrative Examples

In [A.9](https://arxiv.org/html/2601.04171v1#A1.SS9 "A.9 Rubric Examples and grading ‣ Appendix A Appendix ‣ Agentic Rubrics as Contextual Verifiers for SWE Agents") we show three representative
examples in which the patches pass all the Ground-Truth tests for the problem but still score low on rubrics. In particular, in the first example of matplotlib\_\_matplotlib-26291, users report that creating an inset axis and saving a figure with bbox\_inches="tight" crashes with an
AttributeError. The root cause is that Matplotlib calls a locator object with renderer = None, while downstream code assumes a valid renderer.

The _candidate patch_ from Qwen3-32B guards against this by returning a
dummy zero-size bounding box whenever the renderer is missing or an error
occurs. This is enough to satisfy the ground-truth tests.

However, the _rubrics_ encode a stronger notion of correctness. They require that the fix
(1) preserves the positioning and sizing of inset axes (R4), (2) works for
both absolute and relative size specifications(SA4), and (3) still works in the original failure mode with bbox\_inches=’tight’ (SA5), without
breaking existing user code (R3). These checks treat the inset axis as a real visual element whose layout must remain meaningful. The candidate’s dummy box violates this implicit contract: it causes tight layout to ignore
the inset entirely. The user no longer sees a crash, but also no longer gets
a correctly placed inset in the “tight” saved figure.

### A.9 Rubric Examples and grading

matplotlib\_\_matplotlib-26291Problem. Creating inset axes and saving with
bbox\_inches=’tight’ can raise
AttributeError: ’NoneType’ object has no attribute ’\_get\_renderer’
because the inset locator is called with renderer=None and attempts
to access the figure renderer through a None figure.Candidate patch (core diff)[⬇](data:text/plain;base64,LS0tIGEvbGliL21wbF90b29sa2l0cy9heGVzX2dyaWQxL2luc2V0X2xvY2F0b3IucHkKKysrIGIvbGliL21wbF90b29sa2l0cy9heGVzX2dyaWQxL2luc2V0X2xvY2F0b3IucHkKQEAgLTcwLDcgKzcwLDE4IEBAIGNsYXNzIEFuY2hvcmVkTG9jYXRvckJhc2UoQW5jaG9yZWRPZmZzZXRib3gpOgoKICAgICBkZWYgX19jYWxsX18oc2VsZiwgYXgsIHJlbmRlcmVyKToKICAgICAgICAgc2VsZi5heGVzID0gYXgKLSAgICAgICAgYmJveCA9IHNlbGYuZ2V0X3dpbmRvd19leHRlbnQocmVuZGVyZXIpCisgICAgICAgIGlmIHJlbmRlcmVyIGlzIE5vbmU6CisgICAgICAgICAgICAjIE5vIHJlbmRlcmVyIGF2YWlsYWJsZSwgcmV0dXJuIGEgZHVtbXkgYm91bmRpbmcgYm94IG9mIHplcm8gc2l6ZQorICAgICAgICAgICAgIyB0byBhdm9pZCBlcnJvcnMgZHVyaW5nIHRpZ2h0IGxheW91dC4KKyAgICAgICAgICAgIGR1bW15X2Jib3ggPSBCYm94LmZyb21fYm91bmRzKDAsIDAsIDAsIDApCisgICAgICAgICAgICB0ciA9IGF4LmZpZ3VyZS50cmFuc1N1YmZpZ3VyZS5pbnZlcnRlZCgpCisgICAgICAgICAgICByZXR1cm4gVHJhbnNmb3JtZWRCYm94KGR1bW15X2Jib3gsIHRyKQorICAgICAgICB0cnk6CisgICAgICAgICAgICBiYm94ID0gc2VsZi5nZXRfd2luZG93X2V4dGVudChyZW5kZXJlcikKKyAgICAgICAgZXhjZXB0IChBdHRyaWJ1dGVFcnJvciwgUnVudGltZUVycm9yKSBhcyBlOgorICAgICAgICAgICAgIyBIYW5kbGUgY2FzZXMgd2hlcmUgdGhlIHJlbmRlcmVyIGlzIG5vdCBhdmFpbGFibGUsIHJldHVybmluZworICAgICAgICAgICAgIyBhIGR1bW15IGJib3ggYWdhaW4uCisgICAgICAgICAgICBkdW1teV9iYm94ID0gQmJveC5mcm9tX2JvdW5kcygwLCAwLCAwLCAwKQorICAgICAgICAgICAgdHIgPSBheC5maWd1cmUudHJhbnNTdWJmaWd1cmUuaW52ZXJ0ZWQoKQorICAgICAgICAgICAgcmV0dXJuIFRyYW5zZm9ybWVkQmJveChkdW1teV9iYm94LCB0cikKICAgICAgICAgcHgsIHB5ID0gc2VsZi5nZXRfb2Zmc2V0KGJib3gud2lkdGgsIGJib3guaGVpZ2h0LCAwLCAwLCByZW5kZXJlcikKICAgICAgICAgYmJveF9jYW52YXMgPSBCYm94LmZyb21fYm91bmRzKHB4LCBweSwgYmJveC53aWR0aCwgYmJveC5oZWlnaHQpCiAgICAgICAgIHRyID0gYXguZmlndXJlLnRyYW5zU3ViZmlndXJlLmludmVydGVkKCkKICAgICAgICAgcmV0dXJuIFRyYW5zZm9ybWVkQmJveChiYm94X2NhbnZhcywgdHIp)\-\-\-a/lib/mpl\_toolkits/axes\_grid1/inset\_locator.py+++b/lib/mpl\_toolkits/axes\_grid1/inset\_locator.py@@-70,7+70,18@@classAnchoredLocatorBase(AnchoredOffsetbox):def\_\_call\_\_(self,ax,renderer):self.axes=ax-bbox=self.get\_window\_extent(renderer)+ifrendererisNone:+#Norendereravailable,returnadummyboundingboxofzerosize+#toavoiderrorsduringtightlayout.+dummy\_bbox=Bbox.from\_bounds(0,0,0,0)+tr=ax.figure.transSubfigure.inverted()+returnTransformedBbox(dummy\_bbox,tr)+try:+bbox=self.get\_window\_extent(renderer)+except(AttributeError,RuntimeError)ase:+#Handlecaseswheretherendererisnotavailable,returning+#adummybboxagain.+dummy\_bbox=Bbox.from\_bounds(0,0,0,0)+tr=ax.figure.transSubfigure.inverted()+returnTransformedBbox(dummy\_bbox,tr)px,py=self.get\_offset(bbox.width,bbox.height,0,0,renderer)bbox\_canvas=Bbox.from\_bounds(px,py,bbox.width,bbox.height)tr=ax.figure.transSubfigure.inverted()returnTransformedBbox(bbox\_canvas,tr)Rubrics (FAILED / PASSED for candidate patch)\- FC1: Modifies the AnchoredLocatorBase.\_\_call\_\_ method in lib/mpl\_toolkits/axes\_grid1/inset\_locator.py to set self.figure before calling get\_window\_extent.

\- FC2: Ensures the fix is localized to the \_\_call\_\_ method in AnchoredLocatorBase without modifying unrelated methods or classes.

\- FC3: Sets self.figure from ax.figure in AnchoredLocatorBase.\_\_call\_\_ before the get\_window\_extent call.

\- FC4: Avoids modifying the parent class AnchoredOffsetbox in lib/matplotlib/offsetbox.py or its get\_window\_extent method.

\- FC5: Does not introduce changes to other locator classes like AnchoredSizeLocator or AnchoredZoomLocator beyond what is inherited from AnchoredLocatorBase.

\- FC6: Avoids adding unnecessary imports or dependencies to inset\_locator.py.

\- I1: Does not weaken or skip existing tests in lib/mpl\_toolkits/axes\_grid1/tests/test\_axes\_grid1.py that verify inset\_axes functionality.

\- I2: Maintains the public API signature of inset\_axes without adding or removing parameters.

\- I3: Preserves the existing behavior of AnchoredLocatorBase.\_\_call\_\_ returning a TransformedBbox as before.

\- I4: Does not modify the constructor \_\_init\_\_ of AnchoredLocatorBase or its parent class initialization.

\- I5: Avoids introducing deprecation warnings or changing the inheritance hierarchy of AnchoredLocatorBase.

\- R1: Ensures self.figure is set to a non-NoneFigure instance before get\_window\_extent accesses self.figure.\_get\_renderer().

\- R2: Allows inset\_axes creation to proceed through the full render path, including tight\_bbox.adjust\_bbox, without AttributeError.

\- R3: Maintains backward compatibility so existing code using inset\_axes continues to work without modification.

\- R4: Preserves correct positioning and sizing of inset axes relative to the parent axes after the fix.

\- R5: Ensures the fix handles both cases where renderer is None and where renderer is explicitly passed to get\_window\_extent.

\- R6: Allows the locator to be called multiple times on the same axes without error or state corruption.

\- SA1: Resolves the AttributeError: ’NoneType’ object has no attribute ’\_get\_renderer’ that occurs when calling inset\_axes with the code example from the bug report.

\- SA2: Allows get\_window\_extent to successfully access self.figure.\_get\_renderer() when renderer is None in the offsetbox.py implementation.

\- SA3: Preserves the existing behavior where self.axes is set to the ax parameter in AnchoredLocatorBase.\_\_call\_\_.

\- SA4: Maintains compatibility with both absolute size specifications like width=1.3 and relative specifications like width=’30%’ as shown in the inset\_locator\_demo.py examples.

\- SA5: Ensures the fix works when bbox\_inches=’tight’ is used during figure saving, which triggers the adjust\_bbox path that calls the locator.

matplotlib\_\_matplotlib-25332Problem. After calling fig.align\_labels() or
fig.align\_ylabels(), pickle.dumps(fig) fails with
TypeError: cannot pickle ’weakref.ReferenceType’ object because
Grouper stores weak references that are not directly pickle-safe.Candidate patch (full diff)[⬇](data:text/plain;base64,ZGlmZiAtLWdpdCBhL2xpYi9tYXRwbG90bGliL2Nib29rLnB5IGIvbGliL21hdHBsb3RsaWIvY2Jvb2sucHkKaW5kZXggYzk2OTliMmUyMS4uMWFkZjA1NDg0MyAxMDA2NDQKLS0tIGEvbGliL21hdHBsb3RsaWIvY2Jvb2sucHkKKysrIGIvbGliL21hdHBsb3RsaWIvY2Jvb2sucHkKQEAgLTc1Miw2ICs3NTIsMjQgQEAgZGVmIHByaW50X2N5Y2xlcyhvYmplY3RzLCBvdXRzdHJlYW09c3lzLnN0ZG91dCwgc2hvd19wcm9ncmVzcz1GYWxzZSk6CgoKIGNsYXNzIEdyb3VwZXI6CisgICAgZGVmIF9fZ2V0c3RhdGVfXyhzZWxmKToKKyAgICAgICAgIyBDb252ZXJ0IHdlYWtyZWZzIHRvIHN0cm9uZyByZWZlcmVuY2VzIGZvciBwaWNrbGluZworICAgICAgICBjbGVhbl9tYXBwaW5nID0ge30KKyAgICAgICAgZm9yIGtleSwgdmFsdWUgaW4gc2VsZi5fbWFwcGluZy5pdGVtcygpOgorICAgICAgICAgICAgIyBrZXkgaXMgYSB3ZWFrcmVmLCB2YWx1ZSBpcyBhIGxpc3Qgb2Ygd2Vha3JlZnMKKyAgICAgICAgICAgIHN0cm9uZ19rZXkgPSBrZXkoKQorICAgICAgICAgICAgc3Ryb25nX3ZhbHVlcyA9IFtyZWYoKSBmb3IgcmVmIGluIHZhbHVlXQorICAgICAgICAgICAgY2xlYW5fbWFwcGluZ1tzdHJvbmdfa2V5XSA9IHN0cm9uZ192YWx1ZXMKKyAgICAgICAgcmV0dXJuIGNsZWFuX21hcHBpbmcKKworICAgIGRlZiBfX3NldHN0YXRlX18oc2VsZiwgY2xlYW5fbWFwcGluZyk6CisgICAgICAgICMgUmVjb25zdHJ1Y3QgdGhlIF9tYXBwaW5nIHdpdGggd2Vha3JlZnMgZnJvbSBzdHJvbmcgcmVmZXJlbmNlcworICAgICAgICBzZWxmLl9tYXBwaW5nID0ge30KKyAgICAgICAgZm9yIGtleSwgdmFsdWUgaW4gY2xlYW5fbWFwcGluZy5pdGVtcygpOgorICAgICAgICAgICAgIyBrZXkgaXMgYSBzdHJvbmcgcmVmZXJlbmNlLCB2YWx1ZSBpcyBhIGxpc3Qgb2Ygc3Ryb25nIHJlZmVyZW5jZXMKKyAgICAgICAgICAgIHdlYWtfa2V5ID0gd2Vha3JlZi5yZWYoa2V5KQorICAgICAgICAgICAgd2Vha192YWx1ZXMgPSBbd2Vha3JlZi5yZWYodmFsKSBmb3IgdmFsIGluIHZhbHVlXQorICAgICAgICAgICAgc2VsZi5fbWFwcGluZ1t3ZWFrX2tleV0gPSB3ZWFrX3ZhbHVlcwogICAgICIiIiIiIgogICAgIEEgZGlzam9pbnQtc2V0IGRhdGEgc3RydWN0dXJlLg==)diff--gita/lib/matplotlib/cbook.pyb/lib/matplotlib/cbook.pyindexc9699b2e21..1adf054843100644\-\-\-a/lib/matplotlib/cbook.py+++b/lib/matplotlib/cbook.py@@-752,6+752,24@@defprint\_cycles(objects,outstream=sys.stdout,show\_progress=False):classGrouper:+def\_\_getstate\_\_(self):+#Convertweakrefstostrongreferencesforpickling+clean\_mapping={}+forkey,valueinself.\_mapping.items():+#keyisaweakref,valueisalistofweakrefs+strong\_key=key()+strong\_values=\[ref()forrefinvalue\]+clean\_mapping\[strong\_key\]=strong\_values+returnclean\_mapping++def\_\_setstate\_\_(self,clean\_mapping):+#Reconstructthe\_mappingwithweakrefsfromstrongreferences+self.\_mapping={}+forkey,valueinclean\_mapping.items():+#keyisastrongreference,valueisalistofstrongreferences+weak\_key=weakref.ref(key)+weak\_values=\[weakref.ref(val)forvalinvalue\]+self.\_mapping\[weak\_key\]=weak\_values""""""Adisjoint-setdatastructure.Rubrics (FAILED / PASSED for candidate patch)\- FC1: Modifies lib/matplotlib/figure.py to handle \_align\_label\_groups during pickling in \_\_getstate\_\_ or \_\_setstate\_\_.

\- FC2: Avoids modifying unrelated files beyond lib/matplotlib/figure.py, lib/matplotlib/cbook.py, and lib/matplotlib/tests/test\_pickle.py.

\- FC3: Adds or modifies pickle support methods (\_\_getstate\_\_, \_\_setstate\_\_, \_\_reduce\_\_, or \_\_reduce\_ex\_\_) specifically to handle Grouper weak references.

\- FC4: Preserves existing pickling logic in Figure.\_\_getstate\_\_ for canvas, \_dpi, \_\_mpl\_version\_\_, and \_restore\_to\_pylab.

\- FC5: Implements the solution either by modifying cbook.Grouper class to add pickle support or by handling \_align\_label\_groups specially in Figure’s pickle methods.

\- FC6: Avoids adding unnecessary complexity such as deep copying the entire figure state or serializing canvas data that should remain transient.

\- I1: Adds a test case in lib/matplotlib/tests/test\_pickle.py that reproduces the exact scenario from the bug description with align\_labels() call.

\- I2: Avoids weakening or skipping existing pickle tests in test\_pickle.py.

\- I3: Maintains backward compatibility by not changing the public API of Figure.align\_labels, Figure.align\_xlabels, or Figure.align\_ylabels.

\- I4: Does not break existing functionality where figures without align\_labels() can still be pickled successfully.

\- I5: Preserves the Grouper API if modifying cbook.Grouper class, keeping join(), joined(), get\_siblings(), clean(), and \_\_iter\_\_() methods functional.

\- I6: Avoids removing or commenting out the \_align\_label\_groups attribute initialization in Figure.\_\_init\_\_.

\- R1: Maintains correct label alignment behavior where labels in the same row or column remain visually aligned after pickle round-trip.

\- R2: Ensures the unpickled figure’s \_align\_label\_groups contains valid Grouper objects or equivalent structures that preserve axis grouping relationships.

\- R3: Prevents AttributeError or KeyError when accessing \_align\_label\_groups after unpickling the figure.

\- R4: Ensures that calling align\_labels() again on an unpickled figure does not raise exceptions and properly updates groupings.

\- R5: Preserves memory efficiency by not creating strong references to axes objects where weak references were intentionally used.

\- R6: Handles edge cases where axes are deleted or garbage collected between pickling and unpickling without causing crashes.

\- SA1: Ensures pickle.dumps(fig) succeeds after calling fig.align\_labels() without raising TypeError about weakref.ReferenceType.

\- SA2: Ensures pickle.dumps(fig) succeeds after calling fig.align\_xlabels() independently.

\- SA3: Ensures pickle.dumps(fig) succeeds after calling fig.align\_ylabels() independently.

\- SA4: Preserves label alignment behavior after unpickling so that aligned labels remain properly grouped.

\- SA5: Allows round-trip pickling where pickle.loads(pickle.dumps(fig)) produces a functional figure with preserved alignment state.

django\_\_django-13417Problem. For models with Meta.ordering, annotated querysets
that introduce GROUP BY clauses (e.g., via annotate(Count(’pk’)))
still report qs.ordered as True even though the generated SQL
no longer includes an ORDER BY. This makes the ordered
property inconsistent with the actual ordering behavior.Candidate patch (core diff)[⬇](data:text/plain;base64,ZGlmZiAtLWdpdCBhL2RqYW5nby9kYi9tb2RlbHMvc3FsL3F1ZXJ5LnB5IGIvZGphbmdvL2RiL21vZGVscy9zcWwvcXVlcnkucHkKaW5kZXggNDY0OGRhZjM5NS4uZTE2NzJiMGMxYyAxMDA2NDQKLS0tIGEvZGphbmdvL2RiL21vZGVscy9zcWwvcXVlcnkucHkKKysrIGIvZGphbmdvL2RiL21vZGVscy9zcWwvcXVlcnkucHkKQEAgLTEwMzAsNiArMTAzMCw3IEBAIGNsYXNzIFF1ZXJ5KEJhc2VFeHByZXNzaW9uKToKICAgICAgICAgZWxzZToKICAgICAgICAgICAgIHNlbGYuc2V0X2Fubm90YXRpb25fbWFzayhzZXQoc2VsZi5hbm5vdGF0aW9uX3NlbGVjdCkuZGlmZmVyZW5jZSh7YWxpYXN9KSkKICAgICAgICAgc2VsZi5hbm5vdGF0aW9uc1thbGlhc10gPSBhbm5vdGF0aW9uCisgICAgICAgIHNlbGYuY2xlYXJfb3JkZXJpbmcoVHJ1ZSkKCiAgICAgZGVmIHJlc29sdmVfZXhwcmVzc2lvbihzZWxmLCBxdWVyeSwgKmFyZ3MsICoqa3dhcmdzKToKICAgICAgICAgY2xvbmUgPSBzZWxmLmNsb25lKCkKQEAgLTEwMzgsMTAgKzEwMzksMTMgQEAgY2xhc3MgUXVlcnkoQmFzZUV4cHJlc3Npb24pOgogICAgICAgICBjbG9uZS5zdWJxdWVyeSA9IFRydWUKICAgICAgICAgIyBJdCdzIHNhZmUgdG8gZHJvcCBvcmRlcmluZyBpZiB0aGUgcXVlcnlzZXQgaXNuJ3QgdXNpbmcgc2xpY2luZywKICAgICAgICAgIyBkaXN0aW5jdCgqZmllbGRzKSBvciBzZWxlY3RfZm9yX3VwZGF0ZSgpLgorICAgICAgICAjIENsZWFyIG9yZGVyaW5nIGlmIGFubm90YXRpb24gcmVxdWlyZXMgZ3JvdXBpbmcKKyAgICAgICAgc2VsZi5jbGVhcl9vcmRlcmluZyhUcnVlKQogICAgICAgICBpZiAoc2VsZi5sb3dfbWFyayA9PSAwIGFuZCBzZWxmLmhpZ2hfbWFyayBpcyBOb25lIGFuZAogICAgICAgICAgICAgICAgIG5vdCBzZWxmLmRpc3RpbmN0X2ZpZWxkcyBhbmQKICAgICAgICAgICAgICAgICBub3Qgc2VsZi5zZWxlY3RfZm9yX3VwZGF0ZSk6CiAgICAgICAgICAgICBjbG9uZS5jbGVhcl9vcmRlcmluZyhUcnVlKQorICAgICAgICBzZWxmLmNsZWFyX29yZGVyaW5nKFRydWUpCiAgICAgICAgIGNsb25lLndoZXJlLnJlc29sdmVfZXhwcmVzc2lvbihxdWVyeSwgKmFyZ3MsICoqa3dhcmdzKQogICAgICAgICBmb3Iga2V5LCB2YWx1ZSBpbiBjbG9uZS5hbm5vdGF0aW9ucy5pdGVtcygpOgogICAgICAgICAgICAgcmVzb2x2ZWQgPSB2YWx1ZS5yZXNvbHZlX2V4cHJlc3Npb24ocXVlcnksICphcmdzLCAqKmt3YXJncyk=)diff--gita/django/db/models/sql/query.pyb/django/db/models/sql/query.pyindex4648daf395..e1672b0c1c100644\-\-\-a/django/db/models/sql/query.py+++b/django/db/models/sql/query.py@@-1030,6+1030,7@@classQuery(BaseExpression):else:self.set\_annotation\_mask(set(self.annotation\_select).difference({alias}))self.annotations\[alias\]=annotation+self.clear\_ordering(True)defresolve\_expression(self,query,\*args,\*\*kwargs):clone=self.clone()@@-1038,10+1039,13@@classQuery(BaseExpression):clone.subquery=True#It’ssafetodroporderingifthequerysetisn’tusingslicing,#distinct(\*fields)orselect\_for\_update().+#Clearorderingifannotationrequiresgrouping+self.clear\_ordering(True)if(self.low\_mark==0andself.high\_markisNoneandnotself.distinct\_fieldsandnotself.select\_for\_update):clone.clear\_ordering(True)+self.clear\_ordering(True)clone.where.resolve\_expression(query,\*args,\*\*kwargs)forkey,valueinclone.annotations.items():resolved=value.resolve\_expression(query,\*args,\*\*kwargs)Rubrics (FAILED / PASSED for candidate patch)\- FC1: Modifies the ordered property in django/db/models/query.py to check if query.group\_by is set and if ordering comes only from Meta.ordering.

\- FC2: Avoids modifying django/db/models/sql/compiler.py lines 590–591 where order\_by is set to None when \_meta\_ordering is True and grouping exists.

\- FC3: Preserves the existing logic in QuerySet.ordered for checking self.query.extra\_order\_by, self.query.order\_by, and self.query.default\_ordering.

\- FC4: Adds a check in QuerySet.ordered that returns False when self.query.group\_by is not None and ordering only comes from self.query.get\_meta().ordering.

\- FC5: Does not modify the Query.default\_ordering attribute or Query.set\_group\_by method in django/db/models/sql/query.py.

\- FC6: Limits changes to the ordered property method between lines 1218–1230 in django/db/models/query.py without altering other QuerySet methods.

\- I1: Avoids weakening existing tests by adding pytest.mark.skip or removing assertions from test files.

\- I2: Does not modify the public API of QuerySet class beyond fixing the ordered property behavior.

\- I3: Maintains the EmptyQuerySet check in ordered that returns True for empty querysets.

\- I4: Preserves query.default\_ordering attribute semantics without changing its value based on GROUP BY presence.

\- I5: Does not introduce new QuerySet methods or properties beyond fixing the existing ordered property.

\- R1: Ensures ordered returns False when query execution would produce SQL without ORDER BY clause due to GROUP BY with Meta.ordering.

\- R2: Maintains ordered as deterministic based on query state without database round-trips or SQL compilation.

\- R3: Preserves the ordered contract for first and last methods in django/db/models/query.py.

\- R4: Ensures ordered checks query.group\_by state consistently whether it is None, True, or a tuple of expressions.

\- R5: Avoids race conditions by checking immutable query attributes like group\_by and default\_ordering without modifying them.

\- R6: Returns correct ordered value for chained queryset operations like annotate followed by filter without requiring SQL generation.

\- SA1: Ensures QuerySet.ordered returns False when annotate with Count or similar aggregation creates a GROUP BY clause on models with Meta.ordering.

\- SA2: Maintains QuerySet.ordered returning True when no GROUP BY is present even if the model has Meta.ordering.

\- SA3: Ensures QuerySet.ordered still returns True when explicit order\_by is called even with GROUP BY present.

\- SA4: Aligns ordered behavior with actual SQL generation where compiler.py lines 590–591 clear order\_by when grouping and self.\_meta\_ordering are both present.

\- SA5: Preserves backward compatibility for QuerySet.ordered when query.group\_by is None.

### A.10 Prompts - Baselines and Agentic Rubrics

Agentic Patch Similarity (Rollout Generation)[⬇](data:text/plain;base64,YWdlbnQ6CiAgdGVtcGxhdGVzOgogICAgc3lzdGVtX3RlbXBsYXRlOiB8LQogICAgICBZb3UgYXJlIGEgaGVscGZ1bCBhc3Npc3RhbnQgdGhhdCBjYW4gaW50ZXJhY3Qgd2l0aCBhIGNvbXB1dGVyIHRvIHNvbHZlIHRhc2tzLgogICAgaW5zdGFuY2VfdGVtcGxhdGU6IHwtCiAgICAgIDx1cGxvYWRlZF9maWxlcz4KICAgICAge3t3b3JraW5nX2Rpcn19CiAgICAgIDwvdXBsb2FkZWRfZmlsZXM+CiAgICAgIEkndmUgdXBsb2FkZWQgYSBweXRob24gY29kZSByZXBvc2l0b3J5IGluIHRoZSBkaXJlY3Rvcnkge3t3b3JraW5nX2Rpcn19LiBDb25zaWRlciB0aGUgZm9sbG93aW5nIFBSIGRlc2NyaXB0aW9uOgoKICAgICAgPHByX2Rlc2NyaXB0aW9uPgogICAgICB7e3Byb2JsZW1fc3RhdGVtZW50fX0KICAgICAgPC9wcl9kZXNjcmlwdGlvbj4KCiAgICAgIENhbiB5b3UgaGVscCBtZSBpbXBsZW1lbnQgdGhlIG5lY2Vzc2FyeSBjaGFuZ2VzIHRvIHRoZSByZXBvc2l0b3J5IHNvIHRoYXQgdGhlIHJlcXVpcmVtZW50cyBzcGVjaWZpZWQgaW4gdGhlIDxwcl9kZXNjcmlwdGlvbj4gYXJlIG1ldD8KICAgICAgSSd2ZSBhbHJlYWR5IHRha2VuIGNhcmUgb2YgYWxsIGNoYW5nZXMgdG8gYW55IG9mIHRoZSB0ZXN0IGZpbGVzIGRlc2NyaWJlZCBpbiB0aGUgPHByX2Rlc2NyaXB0aW9uPi4gVGhpcyBtZWFucyB5b3UgRE9OJ1QgaGF2ZSB0byBtb2RpZnkgdGhlIHRlc3RpbmcgbG9naWMgb3IgYW55IG9mIHRoZSB0ZXN0cyBpbiBhbnkgd2F5IQogICAgICBZb3VyIHRhc2sgaXMgdG8gbWFrZSB0aGUgbWluaW1hbCBjaGFuZ2VzIHRvIG5vbi10ZXN0cyBmaWxlcyBpbiB0aGUge3t3b3JraW5nX2Rpcn19IGRpcmVjdG9yeSB0byBlbnN1cmUgdGhlIDxwcl9kZXNjcmlwdGlvbj4gaXMgc2F0aXNmaWVkLgogICAgICBGb2xsb3cgdGhlc2Ugc3RlcHMgdG8gcmVzb2x2ZSB0aGUgaXNzdWU6CiAgICAgIDEuIEFzIGEgZmlyc3Qgc3RlcCwgaXQgbWlnaHQgYmUgYSBnb29kIGlkZWEgdG8gZmluZCBhbmQgcmVhZCBjb2RlIHJlbGV2YW50IHRvIHRoZSA8cHJfZGVzY3JpcHRpb24+CiAgICAgIDIuIENyZWF0ZSBhIHNjcmlwdCB0byByZXByb2R1Y2UgdGhlIGVycm9yIGFuZCBleGVjdXRlIGl0IHdpdGggYHB5dGhvbiA8ZmlsZW5hbWUucHk+YCB1c2luZyB0aGUgYmFzaCB0b29sLCB0byBjb25maXJtIHRoZSBlcnJvcgogICAgICAzLiBFZGl0IHRoZSBzb3VyY2Vjb2RlIG9mIHRoZSByZXBvIHRvIHJlc29sdmUgdGhlIGlzc3VlCiAgICAgIDQuIFJlcnVuIHlvdXIgcmVwcm9kdWNlIHNjcmlwdCBhbmQgY29uZmlybSB0aGF0IHRoZSBlcnJvciBpcyBmaXhlZCEKICAgICAgNS4gVGhpbmsgYWJvdXQgZWRnZWNhc2VzIGFuZCBtYWtlIHN1cmUgeW91ciBmaXggaGFuZGxlcyB0aGVtIGFzIHdlbGwKICAgICAgWW91ciB0aGlua2luZyBzaG91bGQgYmUgdGhvcm91Z2ggYW5kIHNvIGl0J3MgZmluZSBpZiBpdCdzIHZlcnkgbG9uZy4KICAgIG5leHRfc3RlcF90ZW1wbGF0ZTogfC0KICAgICAgT0JTRVJWQVRJT046CiAgICAgIHt7b2JzZXJ2YXRpb259fQogICAgbmV4dF9zdGVwX25vX291dHB1dF90ZW1wbGF0ZTogfC0KICAgICAgWW91ciBjb21tYW5kIHJhbiBzdWNjZXNzZnVsbHkgYW5kIGRpZCBub3QgcHJvZHVjZSBhbnkgb3V0cHV0LgogIHRvb2xzOgogICAgZW52X3ZhcmlhYmxlczoKICAgICAgUEFHRVI6IGNhdAogICAgICBNQU5QQUdFUjogY2F0CiAgICAgIExFU1M6IC1SCiAgICAgIFBJUF9QUk9HUkVTU19CQVI6ICdvZmYnCiAgICAgIFRRRE1fRElTQUJMRTogJzEnCiAgICAgIEdJVF9QQUdFUjogY2F0CiAgICBidW5kbGVzOgogICAgICAtIHBhdGg6IHRvb2xzL3JlZ2lzdHJ5CiAgICAgIC0gcGF0aDogdG9vbHMvZWRpdF9hbnRocm9waWMKICAgICAgLSBwYXRoOiB0b29scy9yZXZpZXdfb25fc3VibWl0X20KICAgIHJlZ2lzdHJ5X3ZhcmlhYmxlczoKICAgICAgVVNFX0ZJTEVNQVA6ICd0cnVlJwogICAgICBTVUJNSVRfUkVWSUVXX01FU1NBR0VTOgogICAgICAgIC0gfAogICAgICAgICAgVGhhbmsgeW91IGZvciB5b3VyIHdvcmsgb24gdGhpcyBpc3N1ZS4gUGxlYXNlIGNhcmVmdWxseSBmb2xsb3cgdGhlIHN0ZXBzIGJlbG93IHRvIGhlbHAgcmV2aWV3IHlvdXIgY2hhbmdlcy4KCiAgICAgICAgICAxLiBJZiB5b3UgbWFkZSBhbnkgY2hhbmdlcyB0byB5b3VyIGNvZGUgYWZ0ZXIgcnVubmluZyB0aGUgcmVwcm9kdWN0aW9uIHNjcmlwdCwgcGxlYXNlIHJ1biB0aGUgcmVwcm9kdWN0aW9uIHNjcmlwdCBhZ2Fpbi4KICAgICAgICAgICAgSWYgdGhlIHJlcHJvZHVjdGlvbiBzY3JpcHQgaXMgZmFpbGluZywgcGxlYXNlIHJldmlzaXQgeW91ciBjaGFuZ2VzIGFuZCBtYWtlIHN1cmUgdGhleSBhcmUgY29ycmVjdC4KICAgICAgICAgICAgSWYgeW91IGhhdmUgYWxyZWFkeSByZW1vdmVkIHlvdXIgcmVwcm9kdWN0aW9uIHNjcmlwdCwgcGxlYXNlIGlnbm9yZSB0aGlzIHN0ZXAuCiAgICAgICAgICAyLiBSZW1vdmUgeW91ciByZXByb2R1Y3Rpb24gc2NyaXB0IChpZiB5b3UgaGF2ZW4ndCBkb25lIHNvIGFscmVhZHkpLgogICAgICAgICAgMy4gSWYgeW91IGhhdmUgbW9kaWZpZWQgYW55IFRFU1QgZmlsZXMsIHBsZWFzZSByZXZlcnQgdGhlbSB0byB0aGUgc3RhdGUgdGhleSBoYWQgYmVmb3JlIHlvdSBzdGFydGVkIGZpeGluZyB0aGUgaXNzdWUuCiAgICAgICAgICAgIFlvdSBjYW4gZG8gdGhpcyB3aXRoIGBnaXQgY2hlY2tvdXQgLS0gL3BhdGgvdG8vdGVzdC9maWxlLnB5YC4gVXNlIGJlbG93IDxkaWZmPiB0byBmaW5kIHRoZSBmaWxlcyB5b3UgbmVlZCB0byByZXZlcnQuCiAgICAgICAgICA0LiBSdW4gdGhlIHN1Ym1pdCBjb21tYW5kIGFnYWluIHRvIGNvbmZpcm0uCgogICAgICAgICAgSGVyZSBpcyBhIGxpc3Qgb2YgYWxsIG9mIHlvdXIgY2hhbmdlczoKCiAgICAgICAgICA8ZGlmZj4KICAgICAgICAgIHt7ZGlmZn19CiAgICAgICAgICA8L2RpZmY+CiAgICBlbmFibGVfYmFzaF90b29sOiB0cnVlCiAgICBkaXNhYmxlX2ltYWdlX3Byb2Nlc3Npbmc6IHRydWUKICAgIHBhcnNlX2Z1bmN0aW9uOgogICAgICB0eXBlOiBmdW5jdGlvbl9jYWxsaW5nCiAgaGlzdG9yeV9wcm9jZXNzb3JzOgogICAgLSB0eXBlOiBjYWNoZV9jb250cm9sCiAgICAgIGxhc3Rfbl9tZXNzYWdlczogMgogIG1vZGVsOgogICAgdGVtcGVyYXR1cmU6IDEuCiAgICByZXRyeToKICAgICAgcmV0cmllczogMw==)agent:templates:system\_template:\|-Youareahelpfulassistantthatcaninteractwithacomputertosolvetasks.instance\_template:\|-<uploaded\_files>{{working\_dir}}</uploaded\_files>I’veuploadedapythoncoderepositoryinthedirectory{{working\_dir}}.ConsiderthefollowingPRdescription:<pr\_description>{{problem\_statement}}</pr\_description>Canyouhelpmeimplementthenecessarychangestotherepositorysothattherequirementsspecifiedinthe<pr\_description>aremet?I’vealreadytakencareofallchangestoanyofthetestfilesdescribedinthe<pr\_description>.ThismeansyouDON’Thavetomodifythetestinglogicoranyofthetestsinanyway!Yourtaskistomaketheminimalchangestonon-testsfilesinthe{{working\_dir}}directorytoensurethe<pr\_description>issatisfied.Followthesestepstoresolvetheissue:1.Asafirststep,itmightbeagoodideatofindandreadcoderelevanttothe<pr\_description>2.Createascripttoreproducetheerrorandexecuteitwith‘python<filename.py>‘usingthebashtool,toconfirmtheerror3.Editthesourcecodeoftherepotoresolvetheissue4.Rerunyourreproducescriptandconfirmthattheerrorisfixed!5.ThinkaboutedgecasesandmakesureyourfixhandlesthemaswellYourthinkingshouldbethoroughandsoit’sfineifit’sverylong.next\_step\_template:\|-OBSERVATION:{{observation}}next\_step\_no\_output\_template:\|-Yourcommandransuccessfullyanddidnotproduceanyoutput.tools:env\_variables:PAGER:catMANPAGER:catLESS:-RPIP\_PROGRESS\_BAR:’off’TQDM\_DISABLE:’1’GIT\_PAGER:catbundles:-path:tools/registry-path:tools/edit\_anthropic-path:tools/review\_on\_submit\_mregistry\_variables:USE\_FILEMAP:’true’SUBMIT\_REVIEW\_MESSAGES:-\|Thankyouforyourworkonthisissue.Pleasecarefullyfollowthestepsbelowtohelpreviewyourchanges.1.Ifyoumadeanychangestoyourcodeafterrunningthereproductionscript,pleaserunthereproductionscriptagain.Ifthereproductionscriptisfailing,pleaserevisityourchangesandmakesuretheyarecorrect.Ifyouhavealreadyremovedyourreproductionscript,pleaseignorethisstep.2.Removeyourreproductionscript(ifyouhaven’tdonesoalready).3.IfyouhavemodifiedanyTESTfiles,pleaserevertthemtothestatetheyhadbeforeyoustartedfixingtheissue.Youcandothiswith‘gitcheckout--/path/to/test/file.py‘.Usebelow<diff>tofindthefilesyouneedtorevert.4.Runthesubmitcommandagaintoconfirm.Hereisalistofallofyourchanges:<diff>{{diff}}</diff>enable\_bash\_tool:truedisable\_image\_processing:trueparse\_function:type:function\_callinghistory\_processors:-type:cache\_controllast\_n\_messages:2model:temperature:1.retry:retries:3

Agentic Patch Similarity (Judge)[⬇](data:text/plain;base64,UkVGRVJFTkNFX0JBU0VMSU5FX1NZU1RFTV9QUk9NUFQgPSAiIiJZb3UgYXJlIGFuIGV4cGVydCBjb2RlIHJldmlld2VyIGV2YWx1YXRpbmcgQUktZ2VuZXJhdGVkIHBhdGNoZXMgZm9yIHNvZnR3YXJlIGVuZ2luZWVyaW5nIHRhc2tzLiBZb3VyIHRhc2sgaXMgdG8gY29tcGFyZSBhIENBTkRJREFURSBQQVRDSCBhZ2FpbnN0IGEgUkVGRVJFTkNFIFBBVENIIChnb2xkZW4gYW5zd2VyKSBhbmQgcmF0ZSB0aGUgY2FuZGlkYXRlIG9uIGEgc2NhbGUgb2YgMS01LgoKU2NvcmluZyBDcml0ZXJpYToKLSA1IChFeGNlbGxlbnQpOiBUaGUgY2FuZGlkYXRlIHBhdGNoIGlzIGZ1bmN0aW9uYWxseSBlcXVpdmFsZW50IHRvIHRoZSByZWZlcmVuY2UuIEl0IGNvcnJlY3RseSBhZGRyZXNzZXMgdGhlIHByb2JsZW0sIGhhbmRsZXMgZWRnZSBjYXNlcywgYW5kIGZvbGxvd3MgYmVzdCBwcmFjdGljZXMuCi0gNCAoR29vZCk6IFRoZSBjYW5kaWRhdGUgcGF0Y2ggYWRkcmVzc2VzIHRoZSBjb3JlIHByb2JsZW0gY29ycmVjdGx5IGJ1dCBtYXkgaGF2ZSBtaW5vciBkaWZmZXJlbmNlcyBpbiBpbXBsZW1lbnRhdGlvbiBhcHByb2FjaCBvciBzdHlsZSBjb21wYXJlZCB0byB0aGUgcmVmZXJlbmNlLgotIDMgKEFjY2VwdGFibGUpOiBUaGUgY2FuZGlkYXRlIHBhdGNoIHBhcnRpYWxseSBhZGRyZXNzZXMgdGhlIHByb2JsZW0uIEl0IG1heSBtaXNzIHNvbWUgZWRnZSBjYXNlcyBvciBoYXZlIGluY29tcGxldGUgZml4ZXMsIGJ1dCBkZW1vbnN0cmF0ZXMgdW5kZXJzdGFuZGluZyBvZiB0aGUgaXNzdWUuCi0gMiAoUG9vcik6IFRoZSBjYW5kaWRhdGUgcGF0Y2ggc2hvd3MgYW4gYXR0ZW1wdCB0byBmaXggdGhlIHByb2JsZW0gYnV0IGhhcyBzaWduaWZpY2FudCBpc3N1ZXMuIEl0IG1heSBpbnRyb2R1Y2UgYnVncywgbWlzcyB0aGUgcm9vdCBjYXVzZSwgb3IgaGF2ZSBpbmNvcnJlY3QgbG9naWMuCi0gMSAoSW5jb3JyZWN0KTogVGhlIGNhbmRpZGF0ZSBwYXRjaCBmYWlscyB0byBhZGRyZXNzIHRoZSBwcm9ibGVtLCBpcyBjb21wbGV0ZWx5IHdyb25nLCBvciBtYWtlcyBjaGFuZ2VzIHVucmVsYXRlZCB0byB0aGUgaXNzdWUuCgpSZXR1cm4geW91ciBldmFsdWF0aW9uIGFzIEpTT04gd2l0aCBhIHNjb3JlIGFuZCBicmllZiByZWFzb25pbmcuCgpKU09OIGZvcm1hdDoKewogICJzY29yZSI6IDxpbnRlZ2VyIDEtNT4sCiAgInJlYXNvbmluZyI6ICI8YnJpZWYgZXhwbGFuYXRpb24+Igp9CiIiIgoKClJFRkVSRU5DRV9CQVNFTElORV9VU0VSX1BST01QVCA9ICIiIlBsZWFzZSBldmFsdWF0ZSB0aGUgQ0FORElEQVRFIFBBVENIIGJ5IGNvbXBhcmluZyBpdCB0byB0aGUgUkVGRVJFTkNFIFBBVENIIChnb2xkZW4gYW5zd2VyKS4KCltQUk9CTEVNIERFU0NSSVBUSU9OXQp7cHJvYmxlbV9zdGF0ZW1lbnR9CgpbUkVGRVJFTkNFIFBBVENIIChHb2xkZW4gQW5zd2VyKV0Ke3JlZmVyZW5jZV9wYXRjaH0KCltDQU5ESURBVEUgUEFUQ0ggKFRvIEV2YWx1YXRlKV0Ke2NhbmRpZGF0ZV9wYXRjaH0KClBsZWFzZSBldmFsdWF0ZSB0aGUgQ0FORElEQVRFIFBBVENIIGFuZCByZXR1cm4gdGhlIHNjb3JlIGluIEpTT04gZm9ybWF0IG9ubHkuCgpFVkFMVUFUSU9OOiIiIgo=)REFERENCE\_BASELINE\_SYSTEM\_PROMPT="""YouareanexpertcodereviewerevaluatingAI-generatedpatchesforsoftwareengineeringtasks.YourtaskistocompareaCANDIDATEPATCHagainstaREFERENCEPATCH(goldenanswer)andratethecandidateonascaleof1-5.ScoringCriteria:-5(Excellent):Thecandidatepatchisfunctionallyequivalenttothereference.Itcorrectlyaddressestheproblem,handlesedgecases,andfollowsbestpractices.-4(Good):Thecandidatepatchaddressesthecoreproblemcorrectlybutmayhaveminordifferencesinimplementationapproachorstylecomparedtothereference.-3(Acceptable):Thecandidatepatchpartiallyaddressestheproblem.Itmaymisssomeedgecasesorhaveincompletefixes,butdemonstratesunderstandingoftheissue.-2(Poor):Thecandidatepatchshowsanattempttofixtheproblembuthassignificantissues.Itmayintroducebugs,misstherootcause,orhaveincorrectlogic.-1(Incorrect):Thecandidatepatchfailstoaddresstheproblem,iscompletelywrong,ormakeschangesunrelatedtotheissue.ReturnyourevaluationasJSONwithascoreandbriefreasoning.JSONformat:{"score":<integer1-5>,"reasoning":"<briefexplanation>"}"""REFERENCE\_BASELINE\_USER\_PROMPT="""PleaseevaluatetheCANDIDATEPATCHbycomparingittotheREFERENCEPATCH(goldenanswer).\[PROBLEMDESCRIPTION\]{problem\_statement}\[REFERENCEPATCH(GoldenAnswer)\]{reference\_patch}\[CANDIDATEPATCH(ToEvaluate)\]{candidate\_patch}PleaseevaluatetheCANDIDATEPATCHandreturnthescoreinJSONformatonly.EVALUATION:"""

Agentic Rubrics[⬇](data:text/plain;base64,YWdlbnQ6CiAgdGVtcGxhdGVzOgogICAgc3lzdGVtX3RlbXBsYXRlOiB8LQogICAgICBZb3UgYXJlIGFuIGV4cGVydCBjb2RlIHJldmlld2VyIHRoYXQgY2FuIHVuZGVyc3RhbmQgaXNzdWVzIGFuZCBhcmUgd2VsbCB2ZXJzZWQgaW4gdGhlIGNvZGViYXNlLiBZb3VyIGpvYiBpcyB0byB3cml0ZSBoaWdoLXF1YWxpdHkgcnVicmljcyB0byBncmFkZSB0aGUgc29sdXRpb24gdG8gYSBnaXZlbiBpc3N1ZS4KCiAgICAgIElNUE9SVEFOVDogSW4gRVZFUlkgdHVybiwgeW91IE1VU1QgQUxXQVlTIGluY2x1ZGU6CiAgICAgIDEuIEEgc3VtbWFyeSBvZiB5b3VyIHRoaW5raW5nIC0gZXhwbGFpbiB3aGF0IHlvdSdyZSBwbGFubmluZyB0byBkbyBhbmQgd2h5LCBhbmQgd2hhdCB0b29sIHlvdSdyZSBnb2luZyB0byB1c2UgaW4gKDQtNSBzZW50ZW5jZXMgbWF4KS4KICAgICAgMi4gQSB0b29sIGNhbGwuIFlvdSBjYW4gb25seSBtYWtlIG9uZSB0b29sIGNhbGwgcGVyIHR1cm4uCiAgICBpbnN0YW5jZV90ZW1wbGF0ZTogfC0KICAgICAgPHVwbG9hZGVkX2ZpbGVzPgogICAgICB7e3dvcmtpbmdfZGlyfX0KICAgICAgPC91cGxvYWRlZF9maWxlcz4KICAgICBJJ3ZlIHVwbG9hZGVkIGEgcHl0aG9uIGNvZGUgcmVwb3NpdG9yeSBpbiB0aGUgZGlyZWN0b3J5IHt7d29ya2luZ19kaXJ9fS4gQ29uc2lkZXIgdGhlIGZvbGxvd2luZyBQUiBkZXNjcmlwdGlvbjoKCiAgICAgIDxwcl9kZXNjcmlwdGlvbj4KICAgICAge3twcm9ibGVtX3N0YXRlbWVudH19CiAgICAgIDwvcHJfZGVzY3JpcHRpb24+CgogICAgICBDYW4geW91IGhlbHAgbWUgd3JpdGUgaGlnaCBxdWFsaXR5IHJ1YnJpY3MgdG8gZ3JhZGUgdGhlIHNvbHV0aW9uIHRvIHRoZSB0YXNrIGRlc2NyaWJlZCBpbiB0aGUgPHByX2Rlc2NyaXB0aW9uPj8KICAgICAgVGhpcyBtZWFucyB5b3UgU0hPVUxETidUIGF0dGVtcHQgdG8gc29sdmUgdGhlIHRhc2sgeW91cnNlbGYsIGJ1dCByYXRoZXIgdW5kZXJzdGFuZCB0aGUgdGFzaywgZ28gdGhyb3VnaCB0aGUgY29kZWJhc2UsIGFuZCB3cml0ZSBydWJyaWNzIG9ubHkuCiAgICAgIEZvbGxvdyB0aGVzZSBzdGVwcyB0byB3cml0ZSB0aGUgcnVicmljczoKICAgICAgMS4gQXMgYSBmaXJzdCBzdGVwLCBpdCBtaWdodCBiZSBhIGdvb2QgaWRlYSB0byBmaW5kIGFuZCByZWFkIGNvZGUgcmVsZXZhbnQgdG8gdGhlIDxwcl9kZXNjcmlwdGlvbj4gYnkgc2VhcmNoaW5nIHRoZSBjb2RlYmFzZSB1c2luZyBzZWFyY2ggdG9vbHMuCiAgICAgIDIuIFRoZW4gdGhpbmsgb2YgdGhlIGFwcHJvYWNoIHRvIHNvbHZlIHRoZSB0YXNrIChmdW5jdGlvbmFsIHJlcXVpcmVtZW50cywgbm9uLWZ1bmN0aW9uYWwgcmVxdWlyZW1lbnRzLCBldGMuKQogICAgICAzLiBBbHNvIHVuZGVyc3RhbmQgaG93IHRoZSBjb2RlYmFzZSBpcyBzdHJ1Y3R1cmVkIGFuZCBob3cgdGhlIGNvZGUgaXMgb3JnYW5pemVkLCBhcyB3ZWxsIGFzIGNvZGluZyBzdHlsZSwgZXRjLgogICAgICA0LiBXcml0ZSBhIGxpc3Qgb2YgcnVicmljcyB0aGF0IGNhbiBiZSB1c2VkIHRvIGdyYWRlIHRoZSBzb2x1dGlvbiB0byB0aGUgdGFzayBkZXNjcmliZWQgaW4gdGhlIDxwcl9kZXNjcmlwdGlvbj4uIFlvdXIgcnVicmljcyBzaG91bGQgYmUgYWxvbmcgdGhlIGF4ZXMgZGVzY3JpYmVkIGJlbG93LgogICAgICA1LiBUaGVuIGZpbmFsbHksIG1ha2UgYSBuZXcgZmlsZSBpbiB0aGUge3t3b3JraW5nX2Rpcn19IGRpcmVjdG9yeSBjYWxsZWQgYHJ1YnJpY3MueWFtbGAgd2l0aCB0aGUgcnVicmljcyB5b3Ugd3JvdGUuIEl0IHNob3VsZCBiZSBhIHZhbGlkIFlBTUwgZmlsZSB3aXRoIHRoZSBzdHJ1Y3R1cmUgZGVzY3JpYmVkIGxhdGVyIGJlbG93CiAgICAgIDYuIEFsc28gdGFrZSBhIHR1cm4gdG8gZW5zdXJlIHRoZSB5YW1sIGZpbGUgaXMgcGFyc2VhYmxlIGJ5IHRoZSB5YW1sLnNhZmVfbG9hZCBmdW5jdGlvbiBvbiB0aGUgZmlsZSBpdHNlbGYuIElmIGl0IHRocm93cyBhbiBlcnJvciwgZml4IHRoZSB5YW1sIGZpbGUgYW5kIHRha2UgYW5vdGhlciB0dXJuIHRvIGVuc3VyZSBpdCBpcyBwYXJzZWFibGUuCiAgICAgIDcuIFRoaXMgc2hvdWxkIGJlIHRoZSBvbmx5IGZpbGUgeW91IGNyZWF0ZSBpbiB0aGUge3t3b3JraW5nX2Rpcn19IGRpcmVjdG9yeS4gRE8gTk9UIGNyZWF0ZS9tb2RpZnkvZGVsZXRlIGFueSBvdGhlciBmaWxlcyBvciBkaXJlY3Rvcmllcy4KICAgICAgOC4gRmluYWxseSwgc3VibWl0IHRoZSB0YXNrLgoKICAgICAgQXRvbWljaXR5OgogICAgICAgIOKAoiBFYWNoIHJ1YnJpYyBjcml0ZXJpb24gc2hvdWxkIGV2YWx1YXRlIGV4YWN0bHkgb25lIGRpc3RpbmN0IGFzcGVjdC4KICAgICAgICDigKIgQXZvaWQgYnVuZGxpbmcgbXVsdGlwbGUgY3JpdGVyaWEgaW50byBhIHNpbmdsZSBydWJyaWMuIE1vc3Qgc3RhY2tlZCBjcml0ZXJpYSB3aXRoIHRoZSB3b3JkICJhbmQiIGNhbiBiZSBicm9rZW4gdXAgaW50byBtdWx0aXBsZSBwaWVjZXMuCgogICAgICBTZWxmLWNvbnRhaW5tZW50ICYgc3BlY2lmaWNpdHkgKHN0cmljdCk6CiAgICAgICAg4oCiIERvIE5PVCB3cml0ZSBnZW5lcmljIGl0ZW1zOyBiaW5kIGVhY2ggaXRlbSB0byBleGFjdCBwYXRocy9zeW1ib2xzL3Rva2VucyBzZWVuIGluIHRoaXMgaW5zdGFuY2UuCiAgICAgICAg4oCiIE5ldmVyIHJlbHkgb24gY3Jvc3MtaXRlbSByZWZlcmVuY2VzOyBlYWNoIGl0ZW0gc3RhbmRzIGFsb25lIHdpdGggaXRzIG93biBpZGVudGlmaWVycyBhbmQgcGF0dGVybnMuCiAgICAgICAg4oCiIFRoZSBqdWRnZSB3aWxsIG9ubHkgaGF2ZSBhY2Nlc3MgdG8gdGhlIHByb2JsZW0gYW5kIHBhdGNoIGFuZCB0aGUgY3VycmVudCBydWJyaWMgdW5kZXIgZXZhbHVhdGlvbiwgc28gbWFrZSBzdXJlIHRoZSBydWJyaWMgY2FuIGJlIGV2YWx1YXRlZCB3aXRob3V0IGFueSBvdGhlciBpbmZvcm1hdGlvbi4KCiAgICAgIE11dHVhbGx5IEV4Y2x1c2l2ZSwgQ29sbGVjdGl2ZWx5IEV4aGF1c3RpdmUgKE1FQ0UpOgogICAgICAgIOKAoiBUaGUgcnVicmljIHNldCBzaG91bGQgYmUgbXV0dWFsbHkgZXhjbHVzaXZlIGFuZCBjb2xsZWN0aXZlbHkgZXhoYXVzdGl2ZS4KCiAgICAgIFN0eWxlIGNvbnN0cmFpbnRzIChzdHJpY3QpOgogICAgICAgIOKAoiBZQU1MIG9ubHktbm8gcHJvc2Ugb3V0c2lkZSBZQU1MLgogICAgICAgIOKAoiBBdm9pZCBiYWNrc2xhc2gtaGVhdnkgcGF0dGVybnM7IGlmIHlvdSBhYnNvbHV0ZWx5IG11c3QgaW5jbHVkZSBvbmUsIGRvdWJsZSBhbnkgYmFja3NsYXNoZXMgc28gdGhlIFlBTUwgc3RheXMgdmFsaWQuCiAgICAgICAg4oCiIEVhY2ggcnVicmljIGRlc2NyaXB0aW9uIHN0YXJ0cyB3aXRoIGEgdGhpcmQtcGVyc29uIHNpbmd1bGFyIHZlcmIgKGUuZy4sIElkZW50aWZpZXMsIEltcGxlbWVudHMsIFZhbGlkYXRlcywgQ29uZmlybXMsIEF2b2lkcywgQ2xlYW5zIHVwLCBQbGFucykuCiAgICAgICAg4oCiIE1ha2UgZGVzY3JpcHRpb25zIGNvbmNyZXRlIHVzaW5nIHRva2VucyBmcm9tIFBBVENIL1BSX0RFU0NSSVBUSU9OLgogICAgICAgIOKAoiBFYWNoIHJ1YnJpYyBpdGVtIGluY2x1ZGVzOiBpZCAoc2hvcnQpLCBkZXNjcmlwdGlvbiAodmVyYi1maXJzdCwgaW5zdGFuY2UtZ3JvdW5kZWQpLCB3ZWlnaHQgKGludDsgMT1uaWNlLCAyPXZhbHVhYmxlLCAzPW11c3QpLgogICAgICAgIOKAoiBBdm9pZCBkb3VibGUtY291bnRpbmc6IGRvIG5vdCByZS1zY29yZSB0aGUgc2FtZSBiZWhhdmlvciB1bmRlciBtdWx0aXBsZSBpdGVtcy4KCiAgICAgIFBhdHRlcm4td3JpdGluZyBndWlkZWxpbmVzIChrZWVwIGxpdGVyYWwgWUFNTC1mcmllbmRseSB0ZXh0OyBubyByZWdleCByZXF1aXJlZCk6CiAgICAgICAg4oCiIFVzZSBwbGFpbiBwYXRoIG1lbnRpb25zIGxpa2UgImRpZmYgLS1naXQgYS9wYXRoL3RvL2ZpbGUucHkiIG9yICIrKysgYi9wYXRoL3RvL2ZpbGUucHkiLgogICAgICAgIOKAoiBSZWZlciB0byBzeW1ib2xzIHdpdGggc3RyYWlnaHRmb3J3YXJkIHBocmFzZXMgc3VjaCBhcyAiZGVmIG15X2Z1bmN0aW9uKCIgaW5zdGVhZCBvZiByZWdleCBjbGFzc2VzLgogICAgICAgIOKAoiBEZXNjcmliZSB2YWx1ZSBwYXR0ZXJucyBpbiB3b3JkcyAoZS5nLiwgInN0cmluZyBjb250YWluaW5nIHRvdGFsIikgaW5zdGVhZCBvZiBjb21wbGV4IGV4cHJlc3Npb25zLgogICAgICAgIOKAoiBJZiB5b3UgbmVlZCB0byBmb3JiaWQgc29tZXRoaW5nLCBqdXN0IG1lbnRpb24gdGhlIGV4YWN0IHN0cmluZyAnQHB5dGVzdC5tYXJrLnNraXAnLCBldGMKCiAgICAgIEF4ZXMgKGV4ZWN1dGlvbi1mcmVlKToKICAgICAgICDigKIgZmlsZV9jaGFuZ2VfcnVicmljcyAoNCAtIDgpOiBTY29wZSwgbG9jYWxpdHksIGFuZCBzdWZmaWNpZW5jeSBvZiBlZGl0cyBpbiBQQVRDSCAoZmlsZXMvc3ltYm9scy9ndWFyZHMvcmVnZXhlcy9mbGFncykuIFBlbmFsaXplIHVucmVsYXRlZCBmaWxlIGNodXJuOyByZXdhcmQgbWluaW1hbCwgcmV2ZXJzaWJsZSBkaWZmcyB0aWVkIHRvIHRoZSBzdGF0ZWQgYnVnLgogICAgICAgIOKAoiBzcGVjX2FsaWdubWVudF9ydWJyaWNzICgzIC0gNik6IEFsaWdubWVudCBvZiBjb2RlIHRvIFBSX0RFU0NSSVBUSU9OLiBVc2UgdGV4dHVhbCBhY2NlcHRhbmNlIGNyaXRlcmlhIChyZXF1aXJlZCB0eXBlcy9jb25kaXRpb25zL2Vycm9yIGhhbmRsaW5nL0FQSSBjb250cmFjdHMpIGFuZCBlbnN1cmUgdGhlIHBhdGNoIHJlZmxlY3RzIHRoZW0uCiAgICAgICAg4oCiIGludGVncml0eV9ydWJyaWNzICgzIC0gNik6IEh5Z2llbmUgYW5kICJuby1jaGVhdGluZyIgc2FmZWd1YXJkcy1hdm9pZCB0ZXN0IHdlYWtlbmluZyAoaWYgdGVzdHMgYXBwZWFyIGluIFBBVENIKSwgbWFzcyByZW5hbWVzLCBvciBkZXBlbmRlbmN5IGNodXJuOyBwcmVzZXJ2ZSBwdWJsaWMgQVBJL3NlbWFudGljcyB1bmxlc3MgUFJfREVTQ1JJUFRJT04gcmVxdWlyZXMgb3RoZXJ3aXNlLgogICAgICAgIOKAoiBydW50aW1lX3J1YnJpY3MgKDMgLSA2KTogTmF0dXJhbC1sYW5ndWFnZSBjcml0ZXJpYSBkZXNjcmliaW5nICoqaW50ZW5kZWQgcnVudGltZSBiZWhhdmlvcioqIChOT1QgY29uY3JldGUgdGVzdHMpLCBzdXBwb3J0ZWQgYnkgZXhlY3V0aW9uLWZyZWUgdGV4dHVhbCBldmlkZW5jZS4KICAgICAgICAgICAgLSAqKkRpc3Rpbmd1aXNoYWJpbGl0eToqKiBFbnN1cmVzIHRoZSBwYXRjaCBpbnRyb2R1Y2VzIG9yIHByZXNlcnZlcyBzaWduYWxzIHRoYXQgZGlmZmVyZW50aWF0ZSBjb3JyZWN0IHZzLiBpbmNvcnJlY3QgYmVoYXZpb3IgdW5kZXIgcGxhdXNpYmxlIGlucHV0cyAoZS5nLiwgc3BlY2lmaWMgZXhjZXB0aW9uIGNsYXNzLCBzZW50aW5lbCByZXR1cm4sIGJvdW5kYXJ5IGd1YXJkKS4KICAgICAgICAgICAgLSAqKlJlZ3Jlc3Npb24gc2FmZXR5OioqIENvbmZpcm1zIGJhY2t3YXJkLWNvbXBhdGliaWxpdHkgY29uc3RyYWludHMgKGUuZy4sIG9yaWdpbmFsIEFQSSBzaWduYXR1cmVzL2ZsYWdzIHJlbWFpbiB2YWxpZCwgZGVwcmVjYXRpb25zIGdhdGVkIHZpYSB3YXJuaW5ncykuCiAgICAgICAgICAgIC0gKipEZXRlcm1pbmlzbSAvIGZsYWtlIHJlc2lzdGFuY2U6KiogQXZvaWRzIG5vbmRldGVybWluaXN0aWMgc291cmNlcyBhdCBydW50aW1lICh1bnNlZWRlZCByYW5kb21uZXNzLCB3YWxsLWNsb2NrIHNsZWVwcywgbmV0d29yayBJL08pIHRoYXQgd291bGQgbWFrZSB0ZXN0cyBmbGFreS4KICAgICAgICAgICAgLSAqKlJlc291cmNlICYgdGltZW91dCBib3VuZHM6KiogUHJldmVudHMgcGF0aG9sb2dpY2FsIGxvb3BzIG9yIGhlYXZ5IGNhbGxzOyByZXNwZWN0cyBleGlzdGluZyB0aW1lb3V0cy9saW1pdHMuCiAgICAgICAgICAgIC0gKipFcnJvci1zdXJmYWNlIGNsYXJpdHk6KiogUHJvZHVjZXMgc3RhYmxlLCBzcGVjaWZpYyBtZXNzYWdlcy9leGNlcHRpb24gdHlwZXMgdGhhdCBhIHRlc3QgY291bGQgYXNzZXJ0IGFnYWluc3QgKG5vdCB2YWd1ZSBzdHJpbmdzKS4KICAgICAgICAgICAgLSAqKkhhcm5lc3MgaW50ZWdyaXR5OioqIERvZXMgbm90IGJ5cGFzcyBvciBkaXNhYmxlIHRoZSBwcm9qZWN0J3MgcnVubmVyL3ZlcmlmaWVyIGhvb2tzIChlLmcuLCBrZWVwcyByZWdyZXNzaW9uIGZpbHRlcnMsIENMSSBleGl0IGNvZGVzKS4KCiAgICAgIFJldHVybiBleGFjdGx5IHRoaXMgWUFNTCBzdHJ1Y3R1cmU6CiAgICAgIG1ldGFkYXRhOgogICAgICAgIHRhc2tfc3VtbWFyeTogIjxvbmUtc2VudGVuY2Ugc3VtbWFyeSBncm91bmRlZCBpbiBQUl9ERVNDUklQVElPTj4iCiAgICAgICAgdW5kZXJseWluZ19idWc6ICI8cHJlY2lzZSBmYWlsdXJlIHRyaWdnZXIgZ3JvdW5kZWQgaW4gUFJfREVTQ1JJUFRJT04+IgogICAgICBheGVzOgogICAgICAgIGZpbGVfY2hhbmdlX3J1YnJpY3M6CiAgICAgICAgICAtIGlkOiAiRkMxIgogICAgICAgICAgICBkZXNjcmlwdGlvbjogIklkZW50aWZpZXMgLi4uIgogICAgICAgICAgICB3ZWlnaHQ6IDMKICAgICAgICAgIC0gaWQ6ICJGQzIiCiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAiSWRlbnRpZmllcyAuLi4iCiAgICAgICAgICAgIHdlaWdodDogMgogICAgICAgIHNwZWNfYWxpZ25tZW50X3J1YnJpY3M6CiAgICAgICAgICAtIGlkOiAiU0ExIgogICAgICAgICAgICBkZXNjcmlwdGlvbjogIlJlY29nbml6ZXMgLi4uIgogICAgICAgICAgICB3ZWlnaHQ6IDIKICAgICAgICBpbnRlZ3JpdHlfcnVicmljczoKICAgICAgICAgIC0gaWQ6ICJJMSIKICAgICAgICAgICAgZGVzY3JpcHRpb246ICJDb25maXJtcyAuLi4iCiAgICAgICAgICAgIHdlaWdodDogMgogICAgICAgIHJ1bnRpbWVfcnVicmljczoKICAgICAgICAgIC0gaWQ6ICJSMSIKICAgICAgICAgICAgZGVzY3JpcHRpb246ICJNYWludGFpbnMgLi4uIgogICAgICAgICAgICB3ZWlnaHQ6IDIKCiAgICBuZXh0X3N0ZXBfdGVtcGxhdGU6IHwtCiAgICAgIE9CU0VSVkFUSU9OOgogICAgICB7e29ic2VydmF0aW9ufX0KICAgIG5leHRfc3RlcF9ub19vdXRwdXRfdGVtcGxhdGU6IHwtCiAgICAgIFlvdXIgY29tbWFuZCByYW4gc3VjY2Vzc2Z1bGx5IGFuZCBkaWQgbm90IHByb2R1Y2UgYW55IG91dHB1dC4KICB0b29sczoKICAgIGVudl92YXJpYWJsZXM6CiAgICAgIFBBR0VSOiBjYXQKICAgICAgTUFOUEFHRVI6IGNhdAogICAgICBMRVNTOiAtUgogICAgICBQSVBfUFJPR1JFU1NfQkFSOiAnb2ZmJwogICAgICBUUURNX0RJU0FCTEU6ICcxJwogICAgICBHSVRfUEFHRVI6IGNhdAogICAgYnVuZGxlczoKICAgICAgLSBwYXRoOiB0b29scy9yZWdpc3RyeQogICAgICAtIHBhdGg6IHRvb2xzL2VkaXRfYW50aHJvcGljCiAgICAgIC0gcGF0aDogdG9vbHMvcmV2aWV3X29uX3N1Ym1pdF9tCiAgICByZWdpc3RyeV92YXJpYWJsZXM6CiAgICAgIFVTRV9GSUxFTUFQOiAndHJ1ZScKICAgICAgU1VCTUlUX1JFVklFV19NRVNTQUdFUzoKICAgICAgICAtIHwKICAgICAgICAgIFRoYW5rIHlvdSBmb3IgeW91ciB3b3JrIG9uIHdyaXRpbmcgdGhlIHJ1YnJpY3MuIFBsZWFzZSBjYXJlZnVsbHkgZm9sbG93IHRoZSBzdGVwcyBiZWxvdyB0byBoZWxwIHJldmlldyB5b3VyIGNoYW5nZXMuCgogICAgICAgICAgMS4gSWYgeW91IG1hZGUgYW55IGNoYW5nZXMgdG8geW91ciBjb2RlIG90aGVyIHRoYW4gdGhlIGBydWJyaWNzLnlhbWxgIGZpbGUgaW4gdGhlIHRlc3RiZWQgZGlyZWN0b3J5LCBwbGVhc2UgcmV2ZXJ0IHRoZW0gdG8gdGhlIHN0YXRlIHRoZXkgaGFkIGJlZm9yZSB5b3Ugc3RhcnRlZCB3cml0aW5nIHRoZSBydWJyaWNzLgogICAgICAgICAgMi4gWW91IGNhbiBkbyB0aGlzIHdpdGggYGdpdCBjaGVja291dCAtLSAvcGF0aC90by9maWxlLnB5YC4gVXNlIGJlbG93IDxkaWZmPiB0byBmaW5kIHRoZSBmaWxlcyB5b3UgbmVlZCB0byByZXZlcnQuIFRoaXMgaGFzIHRvIGJlIGRvbmUsIG90aGVyd2lzZSB3ZSBjYW4ndCBleHRyYWN0IHRoZSBydWJyaWNzLnlhbWwgZmlsZS4gICAgICAgICAgMy4gUnVuIHRoZSBzdWJtaXQgY29tbWFuZCBhZ2FpbiB0byBjb25maXJtLgoKICAgICAgICAgIEhlcmUgaXMgYSBsaXN0IG9mIGFsbCBvZiB5b3VyIGNoYW5nZXM6CgogICAgICAgICAgPGRpZmY+CiAgICAgICAgICB7e2RpZmZ9fQogICAgICAgICAgPC9kaWZmPgogICAgZW5hYmxlX2Jhc2hfdG9vbDogdHJ1ZQogICAgZGlzYWJsZV9pbWFnZV9wcm9jZXNzaW5nOiB0cnVlCiAgICBwYXJzZV9mdW5jdGlvbjoKICAgICAgdHlwZTogZnVuY3Rpb25fY2FsbGluZwogIGhpc3RvcnlfcHJvY2Vzc29yczoKICAgIC0gdHlwZTogY2FjaGVfY29udHJvbAogICAgICBsYXN0X25fbWVzc2FnZXM6IDIKICBtb2RlbDoKICAgIHRlbXBlcmF0dXJlOiAxLjAKICAgIHJldHJ5OgogICAgICByZXRyaWVzOiAz)agent:templates:system\_template:\|-Youareanexpertcodereviewerthatcanunderstandissuesandarewellversedinthecodebase.Yourjobistowritehigh-qualityrubricstogradethesolutiontoagivenissue.IMPORTANT:InEVERYturn,youMUSTALWAYSinclude:1.Asummaryofyourthinking-explainwhatyou’replanningtodoandwhy,andwhattoolyou’regoingtousein(4-5sentencesmax).2.Atoolcall.Youcanonlymakeonetoolcallperturn.instance\_template:\|-<uploaded\_files>{{working\_dir}}</uploaded\_files>I’veuploadedapythoncoderepositoryinthedirectory{{working\_dir}}.ConsiderthefollowingPRdescription:<pr\_description>{{problem\_statement}}</pr\_description>Canyouhelpmewritehighqualityrubricstogradethesolutiontothetaskdescribedinthe<pr\_description>?ThismeansyouSHOULDN’Tattempttosolvethetaskyourself,butratherunderstandthetask,gothroughthecodebase,andwriterubricsonly.Followthesestepstowritetherubrics:1.Asafirststep,itmightbeagoodideatofindandreadcoderelevanttothe<pr\_description>bysearchingthecodebaseusingsearchtools.2.Thenthinkoftheapproachtosolvethetask(functionalrequirements,non-functionalrequirements,etc.)3.Alsounderstandhowthecodebaseisstructuredandhowthecodeisorganized,aswellascodingstyle,etc.4.Writealistofrubricsthatcanbeusedtogradethesolutiontothetaskdescribedinthe<pr\_description>.Yourrubricsshouldbealongtheaxesdescribedbelow.5.Thenfinally,makeanewfileinthe{{working\_dir}}directorycalled‘rubrics.yaml‘withtherubricsyouwrote.ItshouldbeavalidYAMLfilewiththestructuredescribedlaterbelow6.Alsotakeaturntoensuretheyamlfileisparseablebytheyaml.safe\_loadfunctiononthefileitself.Ifitthrowsanerror,fixtheyamlfileandtakeanotherturntoensureitisparseable.7.Thisshouldbetheonlyfileyoucreateinthe{{working\_dir}}directory.DONOTcreate/modify/deleteanyotherfilesordirectories.8.Finally,submitthetask.Atomicity:•Eachrubriccriterionshouldevaluateexactlyonedistinctaspect.•Avoidbundlingmultiplecriteriaintoasinglerubric.Moststackedcriteriawiththeword"and"canbebrokenupintomultiplepieces.Self-containment&specificity(strict):•DoNOTwritegenericitems;bindeachitemtoexactpaths/symbols/tokensseeninthisinstance.•Neverrelyoncross-itemreferences;eachitemstandsalonewithitsownidentifiersandpatterns.•Thejudgewillonlyhaveaccesstotheproblemandpatchandthecurrentrubricunderevaluation,somakesuretherubriccanbeevaluatedwithoutanyotherinformation.MutuallyExclusive,CollectivelyExhaustive(MECE):•Therubricsetshouldbemutuallyexclusiveandcollectivelyexhaustive.Styleconstraints(strict):•YAMLonly-noproseoutsideYAML.•Avoidbackslash-heavypatterns;ifyouabsolutelymustincludeone,doubleanybackslashessotheYAMLstaysvalid.•Eachrubricdescriptionstartswithathird-personsingularverb(e.g.,Identifies,Implements,Validates,Confirms,Avoids,Cleansup,Plans).•MakedescriptionsconcreteusingtokensfromPATCH/PR\_DESCRIPTION.•Eachrubricitemincludes:id(short),description(verb-first,instance-grounded),weight(int;1=nice,2=valuable,3=must).•Avoiddouble-counting:donotre-scorethesamebehaviorundermultipleitems.Pattern-writingguidelines(keepliteralYAML-friendlytext;noregexrequired):•Useplainpathmentionslike"diff--gita/path/to/file.py"or"+++b/path/to/file.py".•Refertosymbolswithstraightforwardphrasessuchas"defmy\_function("insteadofregexclasses.•Describevaluepatternsinwords(e.g.,"stringcontainingtotal")insteadofcomplexexpressions.•Ifyouneedtoforbidsomething,justmentiontheexactstring’@pytest.mark.skip’,etcAxes(execution-free):•file\_change\_rubrics(4-8):Scope,locality,andsufficiencyofeditsinPATCH(files/symbols/guards/regexes/flags).Penalizeunrelatedfilechurn;rewardminimal,reversiblediffstiedtothestatedbug.•spec\_alignment\_rubrics(3-6):AlignmentofcodetoPR\_DESCRIPTION.Usetextualacceptancecriteria(requiredtypes/conditions/errorhandling/APIcontracts)andensurethepatchreflectsthem.•integrity\_rubrics(3-6):Hygieneand"no-cheating"safeguards-avoidtestweakening(iftestsappearinPATCH),massrenames,ordependencychurn;preservepublicAPI/semanticsunlessPR\_DESCRIPTIONrequiresotherwise.•runtime\_rubrics(3-6):Natural-languagecriteriadescribing\*\*intendedruntimebehavior\*\*(NOTconcretetests),supportedbyexecution-freetextualevidence.-\*\*Distinguishability:\*\*Ensuresthepatchintroducesorpreservessignalsthatdifferentiatecorrectvs.incorrectbehaviorunderplausibleinputs(e.g.,specificexceptionclass,sentinelreturn,boundaryguard).-\*\*Regressionsafety:\*\*Confirmsbackward-compatibilityconstraints(e.g.,originalAPIsignatures/flagsremainvalid,deprecationsgatedviawarnings).-\*\*Determinism/flakeresistance:\*\*Avoidsnondeterministicsourcesatruntime(unseededrandomness,wall-clocksleeps,networkI/O)thatwouldmaketestsflaky.-\*\*Resource&timeoutbounds:\*\*Preventspathologicalloopsorheavycalls;respectsexistingtimeouts/limits.-\*\*Error-surfaceclarity:\*\*Producesstable,specificmessages/exceptiontypesthatatestcouldassertagainst(notvaguestrings).-\*\*Harnessintegrity:\*\*Doesnotbypassordisabletheproject’srunner/verifierhooks(e.g.,keepsregressionfilters,CLIexitcodes).ReturnexactlythisYAMLstructure:metadata:task\_summary:"<one-sentencesummarygroundedinPR\_DESCRIPTION>"underlying\_bug:"<precisefailuretriggergroundedinPR\_DESCRIPTION>"axes:file\_change\_rubrics:-id:"FC1"description:"Identifies..."weight:3-id:"FC2"description:"Identifies..."weight:2spec\_alignment\_rubrics:-id:"SA1"description:"Recognizes..."weight:2integrity\_rubrics:-id:"I1"description:"Confirms..."weight:2runtime\_rubrics:-id:"R1"description:"Maintains..."weight:2next\_step\_template:\|-OBSERVATION:{{observation}}next\_step\_no\_output\_template:\|-Yourcommandransuccessfullyanddidnotproduceanyoutput.tools:env\_variables:PAGER:catMANPAGER:catLESS:-RPIP\_PROGRESS\_BAR:’off’TQDM\_DISABLE:’1’GIT\_PAGER:catbundles:-path:tools/registry-path:tools/edit\_anthropic-path:tools/review\_on\_submit\_mregistry\_variables:USE\_FILEMAP:’true’SUBMIT\_REVIEW\_MESSAGES:-\|Thankyouforyourworkonwritingtherubrics.Pleasecarefullyfollowthestepsbelowtohelpreviewyourchanges.1.Ifyoumadeanychangestoyourcodeotherthanthe‘rubrics.yaml‘fileinthetestbeddirectory,pleaserevertthemtothestatetheyhadbeforeyoustartedwritingtherubrics.2.Youcandothiswith‘gitcheckout--/path/to/file.py‘.Usebelow<diff>tofindthefilesyouneedtorevert.Thishastobedone,otherwisewecan’textracttherubrics.yamlfile.3.Runthesubmitcommandagaintoconfirm.Hereisalistofallofyourchanges:<diff>{{diff}}</diff>enable\_bash\_tool:truedisable\_image\_processing:trueparse\_function:type:function\_callinghistory\_processors:-type:cache\_controllast\_n\_messages:2model:temperature:1.0retry:retries:3

Agentic Tests[⬇](data:text/plain;base64,YWdlbnQ6CiAgdGVtcGxhdGVzOgogICAgc3lzdGVtX3RlbXBsYXRlOiB8LQogICAgICBZb3UgYXJlIGEgcHJvZ3JhbW1pbmcgYWdlbnQgd2hvIGlzIHByb3ZpZGVkIGEgZ2l0aHViIGlzc3VlIGFuZCByZXBvc2l0b3J5IGJhc2ggZW52aXJvbm1lbnQgYW5kIGlzIHRhc2tlZCB0byBnZW5lcmF0ZSBhIHN0YW5kYWxvbmUgdGVzdCBzY3JpcHQgdGhhdCBjYW4gcmVwcm9kdWNlIGFuZCB2ZXJpZnkgdGhlIGlzc3VlIHdpdGhvdXQgcmVseWluZyBvbiBhbnkgdGVzdGluZyBmcmFtZXdvcmtzLgogICAgaW5zdGFuY2VfdGVtcGxhdGU6IHwtCiAgICAgIDx1cGxvYWRlZF9maWxlcz4KICAgICAge3t3b3JraW5nX2Rpcn19CiAgICAgIDwvdXBsb2FkZWRfZmlsZXM+CiAgICAgIEkndmUgdXBsb2FkZWQgYSBweXRob24gY29kZSByZXBvc2l0b3J5IGluIHRoZSBkaXJlY3Rvcnkge3t3b3JraW5nX2Rpcn19LiBDb25zaWRlciB0aGUgZm9sbG93aW5nIFBSIGRlc2NyaXB0aW9uOgoKICAgICAgPHByX2Rlc2NyaXB0aW9uPgogICAgICB7e3Byb2JsZW1fc3RhdGVtZW50fX0KICAgICAgPC9wcl9kZXNjcmlwdGlvbj4KCiAgICAgIENhbiB5b3UgaGVscCBtZSB3cml0ZSBhIHN0YW5kYWxvbmUgdGVzdF9pc3N1ZS5weSBmaWxlIHRoYXQgdGVzdHMgYW5kIHJlcHJvZHVjZXMgdGhlIGlzc3VlIGRlc2NyaWJlZCBpbiB0aGUgPHByX2Rlc2NyaXB0aW9uPj8KICAgICAgVGhpcyB0ZXN0IGZpbGUgc2hvdWxkIGJlIGNvbXBsZXRlbHkgc2VsZi1jb250YWluZWQgYW5kIGV4ZWN1dGFibGUgZGlyZWN0bHkgd2l0aCBQeXRob24sIHdpdGhvdXQgcmVxdWlyaW5nIGFueSB0ZXN0aW5nIGZyYW1ld29ya3MgbGlrZSBweXRlc3Qgb3IgdW5pdHRlc3QuCgogICAgICBJTVBPUlRBTlQgR1VJREVMSU5FUzoKICAgICAgMS4gRmlyc3QsIGV4cGxvcmUgdGhlIHJlcG9zaXRvcnkgdG8gdW5kZXJzdGFuZCB3aGF0IHRoZSBpc3N1ZSBpcyBhYm91dCBhbmQgaG93IHRvIHRlc3QgYW5kIHJlcHJvZHVjZSBpdC4gRm9jdXMgb24gdW5kZXJzdGFuZGluZyB0aGUgY29yZSBmdW5jdGlvbmFsaXR5IHJhdGhlciB0aGFuIHRoZSB0ZXN0aW5nIHN0cnVjdHVyZS4KCiAgICAgIDIuIENyZWF0ZSBhIHN0YW5kYWxvbmUgUHl0aG9uIHNjcmlwdCAodGVzdF9pc3N1ZS5weSkgdGhhdDoKICAgICAgICAtIEltcG9ydHMgb25seSB0aGUgbmVjZXNzYXJ5IG1vZHVsZXMgZnJvbSB0aGUgcmVwb3NpdG9yeQogICAgICAgIC0gU2V0cyB1cCB0aGUgbWluaW11bSBlbnZpcm9ubWVudCBuZWVkZWQgdG8gcmVwcm9kdWNlIHRoZSBpc3N1ZQogICAgICAgIC0gQ29udGFpbnMgYWxsIGxvZ2ljIHdpdGhpbiB0aGUgc2NyaXB0IGl0c2VsZiAobm8gZXh0ZXJuYWwgdGVzdCBkZXBlbmRlbmNpZXMpCiAgICAgICAgLSBSdW5zIHF1aWNrbHkgYW5kIHRlcm1pbmF0ZXMgaXRzZWxmIChubyBiYWNrZ3JvdW5kIHNlcnZlcnMgb3IgbG9uZy1ydW5uaW5nIHByb2Nlc3NlcykKICAgICAgICAtIFdyaXRlIGF0IGxlYXN0IHRlbiB0ZXN0IGNhc2VzIHRvIHRlc3QgdGhlIGlzc3VlLgoKICAgICAgMy4gQ1JJVElDQUw6IEZvciBlYWNoIG9mIHRoZSB0ZXN0IGNhc2VzOiB5b3VyIHRlc3Qgc2NyaXB0IE1VU1QgdXNlIHRoZXNlIEVYQUNUIHByaW50IHN0YXRlbWVudHMgdG8gaW5kaWNhdGUgdGVzdCByZXN1bHRzIGZvciBlYWNoIHRlc3QgY2FzZToKICAgICAgICAtIFByaW50ICJGQUlMRUQiIHdoZW4gdGhlIGNvZGUgY29uZmlybXMgdGhlIGJ1ZyBleGlzdHMsIGFuZCBzbyB0aGUgdGVzdCBjYXNlIGZhaWxzLgogICAgICAgIC0gUHJpbnQgIlBBU1NFRCIgd2hlbiB0aGUgY29kZSBydW5zIHdpdGhvdXQgdGhlIGlzc3VlIGFuZCBzbyB0aGUgdGVzdCBjYXNlIHBhc3Nlcy4KICAgICAgICAtIFByaW50ICJPdGhlciBpc3N1ZXMiIHdoZW4gdW5leHBlY3RlZCBwcm9ibGVtcyBvY2N1cgogICAgICAgIElNUE9SVEFOVDogQWdhaW4gaW5jbHVkZSB0aGUgYWJvdmUgcHJpbnQgc3RhdGVtZW50cyBmb3IgZWFjaCBvZiB0aGUgdGVzdCBjYXNlcyBpbiAvdGVzdGJlZC90ZXN0X2lzc3VlLnB5LgoKICAgICAgNC4gSW5jbHVkZSBlcnJvciBoYW5kbGluZyB0byBwcmV2ZW50IHRoZSBzY3JpcHQgZnJvbSBjcmFzaGluZzoKICAgICAgICAtIENhdGNoIGV4Y2VwdGlvbnMgYXBwcm9wcmlhdGVseQogICAgICAgIC0gQWx3YXlzIG91dHB1dCBvbmUgb2YgdGhlIHRocmVlIGV4YWN0IHBocmFzZXMgYWJvdmUKICAgICAgICAtIERPIE5PVCB1c2UgYXNzZXJ0aW9ucyB0aGF0IG1pZ2h0IHRlcm1pbmF0ZSB0aGUgcHJvZ3JhbSAod2l0aG91dCBlcnJvciBoYW5kbGluZykKCiAgICAgIDUuIFRoZSB0ZXN0IHNob3VsZCBmYWlsIChwcmludCAiRkFJTEVEIikgd2hlbiBydW4gYWdhaW5zdCB0aGUgY3VycmVudCByZXBvIHN0YXRlLgoKICAgICAgNi4gWW91ciB0ZXN0IHNjcmlwdCBzaG91bGQgYWxzbyBjaGVjayBmb3IgdGhlIGNvcnJlY3QgYmVoYXZpb3VyIHdoZW4gdGhlIGlzc3VlIGlzIGZpeGVkIChpLmUuIHByaW50ICJQQVNTRUQiKS4gSWYgdGhlIGlzc3VlIGlzIG5vdCBmaXhlZCBhbmQgdGhlIGNvZGUgZXhoaWJpdHMgaW5jb3JyZWN0IGJlaGF2aW9yIGFmdGVyIGFwcGx5aW5nIGEgZml4LCBpdCBzaG91bGQgcHJpbnQgIk90aGVyIGlzc3VlcyIgb3IgIkZBSUxFRCIgYXMgYXBwcm9wcmlhdGUuCgogICAgICA3LiBXcml0ZSB0aGUgZmluYWwgdGVzdCBzY3JpcHQgdG8gL3Rlc3RiZWQvdGVzdF9pc3N1ZS5weS4gRW5zdXJlIHRoYXQgdGhlIHNjcmlwdCBpcyBydW5uYWJsZSB2aWEgYHB5dGhvbiB0ZXN0X2lzc3VlLnB5YC4KCiAgICAgIDguIFRoZSBmaW5hbCBsaW5lIGluIHRoZSB0ZXN0IHNjcmlwdCBzaG91bGQgYmUgYSBjb21tZW50IGFib3V0IGhvdyBtYW55IHRlc3QgY2FzZXMgd2VyZSB3cml0dGVuLiBFeGFtcGxlOiBgIyBUb3RhbCB0ZXN0czogNmAuCgogICAgICA5LiBUaGlzIGlzIGltcG9ydGFudCBlYWNoIHRlc3QgY2FzZSBudW1iZXIgKE91dCBvZiB0aGUgdG90YWwgeW91IHdyb3RlKSwgd2Ugd2lsbCBwYXJzZSB0aGUgb3V0cHV0IG9mIHRlc3Qgc2NyaXB0IG9uZS1ieS1vbmUgYW5kIGNoZWNrIGlmIHRoZSBzb2x1dGlvbiBwYXNzZXMgdGVzdCBjYXNlIGkuIEZvciBleGFtcGxlLCAiIiJ0ZXN0X2Nhc2Vfe2l9IFBBU1NFRCIiIiBvciAiIiJ0ZXN0X2Nhc2Vfe2l9IEZBSUxFRCIiIi4KCiAgICAgIEV4YW1wbGUgZm9ybWF0IGZvciBhIHNpbmdsZSB0ZXN0IGNhc2UgaW4gdGhlIHRlc3Qgc2NyaXB0OgogICAgICBgYGBweXRob24KICAgICAgaW1wb3J0IHN5cwogICAgICBmcm9tIHNvbWVfcGFja2FnZSBpbXBvcnQgcmVsZXZhbnRfbW9kdWxlCgogICAgICBkZWYgdGVzdDEoKToKICAgICAgICAgIHRyeToKICAgICAgICAgICAgICAjIFNldHVwIG1pbmltYWwgdGVzdCBlbnZpcm9ubWVudAogICAgICAgICAgICAgIHRlc3RfaW5wdXQgPSAiZXhhbXBsZSBpbnB1dCB0aGF0IHRyaWdnZXJzIHRoZSBpc3N1ZSIKCiAgICAgICAgICAgICAgIyBBdHRlbXB0IHRoZSBvcGVyYXRpb24gdGhhdCBzaG91bGQgcmVwcm9kdWNlIHRoZSBpc3N1ZQogICAgICAgICAgICAgIHJlc3VsdCA9IHJlbGV2YW50X21vZHVsZS5mdW5jdGlvbl93aXRoX2lzc3VlKHRlc3RfaW5wdXQpCgogICAgICAgICAgICAgICMgY2hlY2sgaWYgdGhlIGlzc3VlIGlzIHJlcHJvZHVjZWQKICAgICAgICAgICAgICBpZiByZXN1bHQgPT0gImV4cGVjdGVkIG91dHB1dCB0aGF0IGluZGljYXRlcyB0aGUgaXNzdWUiOgogICAgICAgICAgICAgICAgICByZXR1cm4gIkZBSUxFRCIKICAgICAgICAgICAgICBlbHNlOgogICAgICAgICAgICAgICAgICAjIGNoZWNrIGlmIHJlc3VsdCBtYXRjaGVzIHRoZSBleHBlY3RlZCBvdXRwdXQgd2hlbiB0aGUgaXNzdWUgaXMgcmVzb2x2ZWQKICAgICAgICAgICAgICAgICAgIyBlbnN1cmUgdG8gcGVyZm9ybSBhbGwgbmVjZXNzYXJ5IGNoZWNrcwogICAgICAgICAgICAgICAgICBhc3NlcnQgcmVzdWx0ID09ICJleHBlY3RlZCBvdXRwdXQgd2hlbiByZXNvbHZlZCIKICAgICAgICAgICAgICAgICAgcmV0dXJuICJQQVNTRUQiCgogICAgICAgICAgZXhjZXB0IEV4Y2VwdGlvbiBhcyBlOgogICAgICAgICAgICAgIHJldHVybiAiT3RoZXIgaXNzdWVzIiAgIyBPcHRpb25hbDogY2FuIGluY2x1ZGUgZXJyb3IgZGV0YWlscyBmb3IgZGVidWdnaW5nCgogICAgICAuLi4KCiAgICAgIGlmIF9fbmFtZV9fID09ICJfX21haW5fXyI6CiAgICAgICAgICBwcmludChmInRlc3RfY2FzZV8xIHt0ZXN0MSgpfSIpCiAgICAgICAgICAuLi4KCiAgICAgICMgVG90YWwgdGVzdHM6IDUKICAgICAgYGBgCgogICAgICBGSU5BTCBDSEVDS1M6CiAgICAgIC0gRG9lcyBlYWNoIG9uZSBvZiB5b3VyIHRlc3QgcnVuIHN0YW5kYWxvbmUgKHdpdGhvdXQgcHl0ZXN0L3VuaXR0ZXN0KT8KICAgICAgLSBEb2VzIGVhY2ggb25lIG9mIHlvdXIgdGVzdCBjb250YWluIEVYQUNUTFkgT05FIG9mIHRoZSB0aHJlZSByZXF1aXJlZCBwcmludCBzdGF0ZW1lbnRzPwogICAgICAtIERvZXMgZWFjaCBvbmUgb2YgeW91ciB0ZXN0IHRlcm1pbmF0ZSBhdXRvbWF0aWNhbGx5IGFmdGVyIHByaW50aW5nIHRoZSByZXN1bHQ/CiAgICAgIC0gRG9lcyBlYWNoIG9uZSBvZiB5b3VyIHRlc3QgcHJvcGVybHkgcmVwcm9kdWNlIHRoZSBpc3N1ZSBkZXNjcmliZWQgaW4gdGhlIHByb2JsZW0gc3RhdGVtZW50PwogICAgICAtIElzIGl0IHNpbXBsZSwgZm9jdXNlZCwgYW5kIGZyZWUgb2YgdW5uZWNlc3NhcnkgY29tcGxleGl0eT8KICAgICAgLSBEb2VzIHRoZSBmaW5hbCBsaW5lIGluIHRoZSB0ZXN0IHNjcmlwdCBjb250YWluIHRoZSBjb3JyZWN0IG51bWJlciBvZiB0ZXN0IGNhc2VzIGFuZCB3aXRoIHRoZSBleGFjdCBmb3JtYXQgYCMgVG90YWwgdGVzdHM6IDxudW1iZXIgb2YgdGVzdCBjYXNlcz5gIChubyBjb21tYXMsIG5vIHNwYWNlcywgbm8gb3RoZXIgdGV4dCk/CgogICAgICBHRU5FUkFMIElOU1RSVUNUSU9OUzoKICAgICAgLSBFYWNoIHJlc3BvbnNlIG11c3QgaW5jbHVkZSBib3RoCiAgICAgICAgLSBuYXR1cmFsIGxhbmd1YWdlIHJlYXNvbmluZyBhYm91dCB5b3VyIGFwcHJvYWNoCiAgICAgICAgLSBhIGZ1bmN0aW9uIGNhbGwgdG8gc29sdmUgdGhlIHRhc2sKICAgICAgLSBZb3UgY2FuIHRha2UgbXVsdGlwbGUgdHVybnMgdG8gc29sdmUgdGhlIHRhc2ssIGJ1dCBvbmx5IGZpbmlzaCBvbmNlIHlvdSdyZSBjb25maWRlbnQgaW4geW91ciBzb2x1dGlvbgogICAgICAtIElmIGEgZmlsZV9lZGl0b3IgZWRpdCBmYWlscywgdmlldyB0aGUgZmlsZSBiZWZvcmUgcmV0cnlpbmcgd2l0aCBhZGp1c3RlZCBjb250ZW50CgogICAgICBHZW5lcmFsIFN0ZXBzOgogICAgICAxLiBVbmRlcnN0YW5kIHRoZSBpc3N1ZSwgY29ycmVzcG9uZGluZyBjb2RlIGFuZCBob3cgdG8gcmVwcm9kdWNlIHRoZSBpc3N1ZS4KICAgICAgMi4gV3JpdGUgYSBzdGFuZGFsb25lIHRlc3Qgc2NyaXB0IHRoYXQgcmVwcm9kdWNlcyB0aGUgaXNzdWUuIE1ha2Ugc3VyZSB0aGF0IHRoZSBvdXRwdXQgaXMgIkZBSUxFRCIgZm9yIGVhY2ggb2YgdGhlIHNpbmdsZSB0ZXN0LgogICAgICAzLiBBZGQgZnVydGhlciB0ZXN0IGNhc2VzIGluY2x1ZGluZyBtb3JlIHRob3JvdWdoIHRlc3RpbmcsIGlucHV0cywgZWRnZSBjYXNlcyB0byBlbnN1cmUgdGhlIGlzc3VlIGlzIGNvcnJlY3RseSBpZGVudGlmaWVkLgogICAgICA0LiBSdW4gdGhlIHRlc3Qgc2NyaXB0IHRvIGVuc3VyZSBvdXRwdXQgaXMgYXMgZXhwZWN0ZWQgKHNlZSBleGFtcGxlIG91dHB1dCBmb3JtYXQgYmVsb3cpLgoKICAgICAgVGhlIGZpbmFsIG91dHB1dCBvZiB0aGUgdGVzdCBzY3JpcHQgc2hvdWxkIHJlc2VtYmxlIHRoZSBmb2xsb3dpbmcgZm9ybWF0IChqdXN0IGFuIGV4YW1wbGUpOgogICAgICA8RVhBTVBMRSBPVVRQVVQgRk9STUFUPgogICAgICB0ZXN0X2Nhc2VfMSBGQUlMRUQKICAgICAgdGVzdF9jYXNlXzIgUEFTU0VECiAgICAgIHRlc3RfY2FzZV8zIEZBSUxFRAogICAgICB0ZXN0X2Nhc2VfNCBQQVNTRUQKICAgICAgdGVzdF9jYXNlXzUgRkFJTEVECiAgICAgIHRlc3RfY2FzZV82IFBBU1NFRAogICAgICB0ZXN0X2Nhc2VfNyBGQUlMRUQKICAgICAgdGVzdF9jYXNlXzggUEFTU0VECiAgICAgIHRlc3RfY2FzZV85IEZBSUxFRAogICAgICA8L0VYQU1QTEUgT1VUUFVUIEZPUk1BVD4KICAgICAgWW91IG11c3QgZm9sbG93IHRoZSBhYm92ZSBmb3JtYXQgZm9yIHRoZSBvdXRwdXQgb2YgdGhlIHRlc3Qgc2NyaXB0LiBPdGhlciBpc3N1ZXMgc2hvdWxkIGJlIG1heCAxLTIgdGVzdCBjYXNlcyAoaW4gd29yc3QgY2FzZSkuCgogICAgICBGaW5hbGx5LCB1c2Ugc3VibWl0IHRvb2wgdG8gc3VibWl0LgoKICAgICAgQ1JJVElDQUw6IERvIG5vdCBzdWJtaXQgdW50aWwgeW91IGhhdmUgYWRkZWQgZGl2ZXJzZSB0ZXN0IGNhc2VzIGFuZCB0aG9yb3VnaGx5IHZlcmlmaWVkIHRoZSBvdXRwdXQgb2YgdGhlIHRlc3Qgc2NyaXB0LgogICAgICBOT1RFOiBmb3IgZGphbmdvIGVudmlyb25tZW50czogeW91IHNob3VsZCB1c2UgdGVzdF9zcWxpdGUgc2V0dGluZ3MgZmlsZSBkdXJpbmcgdGVzdGluZy4KCiAgICBuZXh0X3N0ZXBfdGVtcGxhdGU6IHwtCiAgICAgIE9CU0VSVkFUSU9OOgogICAgICB7e29ic2VydmF0aW9ufX0KICAgIG5leHRfc3RlcF9ub19vdXRwdXRfdGVtcGxhdGU6IHwtCiAgICAgIFlvdXIgY29tbWFuZCByYW4gc3VjY2Vzc2Z1bGx5IGFuZCBkaWQgbm90IHByb2R1Y2UgYW55IG91dHB1dC4KICB0b29sczoKICAgIGVudl92YXJpYWJsZXM6CiAgICAgIFBBR0VSOiBjYXQKICAgICAgTUFOUEFHRVI6IGNhdAogICAgICBMRVNTOiAtUgogICAgICBQSVBfUFJPR1JFU1NfQkFSOiAnb2ZmJwogICAgICBUUURNX0RJU0FCTEU6ICcxJwogICAgICBHSVRfUEFHRVI6IGNhdAogICAgYnVuZGxlczoKICAgICAgLSBwYXRoOiB0b29scy9yZWdpc3RyeQogICAgICAtIHBhdGg6IHRvb2xzL2VkaXRfYW50aHJvcGljCiAgICAgIC0gcGF0aDogdG9vbHMvcmV2aWV3X29uX3N1Ym1pdF9tCiAgICByZWdpc3RyeV92YXJpYWJsZXM6CiAgICAgIFVTRV9GSUxFTUFQOiAndHJ1ZScKICAgICAgU1VCTUlUX1JFVklFV19NRVNTQUdFUzoKICAgICAgICAtIHwKICAgICAgICAgIFRoYW5rIHlvdSBmb3IgeW91ciB3b3JrIG9uIHdyaXRpbmcgdGhlIHRlc3RzLiBQbGVhc2UgY2FyZWZ1bGx5IGZvbGxvdyB0aGUgc3RlcHMgYmVsb3cgdG8gaGVscCByZXZpZXcgeW91ciBjaGFuZ2VzLgoKICAgICAgICAgIDEuIElmIHlvdSBtYWRlIGFueSBjaGFuZ2VzIHRvIHlvdXIgY29kZSBvdGhlciB0aGFuIHRoZSBgdGVzdF9pc3N1ZS5weWAgZmlsZSwgcGxlYXNlIHJldmVydCB0aGVtIHRvIHRoZSBzdGF0ZSB0aGV5IGhhZCBiZWZvcmUgeW91IHN0YXJ0ZWQgd3JpdGluZyB0aGUgdGVzdHMuCiAgICAgICAgICAyLiBZb3UgY2FuIGRvIHRoaXMgd2l0aCBgZ2l0IGNoZWNrb3V0IC0tIC9wYXRoL3RvL2ZpbGUucHlgLiBVc2UgYmVsb3cgPGRpZmY+IHRvIGZpbmQgdGhlIGZpbGVzIHlvdSBuZWVkIHRvIHJldmVydC4KICAgICAgICAgIDMuIFJ1biB0aGUgc3VibWl0IGNvbW1hbmQgYWdhaW4gdG8gY29uZmlybS4KCiAgICAgICAgICBIZXJlIGlzIGEgbGlzdCBvZiBhbGwgb2YgeW91ciBjaGFuZ2VzOgoKICAgICAgICAgIDxkaWZmPgogICAgICAgICAge3tkaWZmfX0KICAgICAgICAgIDwvZGlmZj4KICAgIGVuYWJsZV9iYXNoX3Rvb2w6IHRydWUKICAgIGRpc2FibGVfaW1hZ2VfcHJvY2Vzc2luZzogdHJ1ZQogICAgcGFyc2VfZnVuY3Rpb246CiAgICAgIHR5cGU6IGZ1bmN0aW9uX2NhbGxpbmcKICBoaXN0b3J5X3Byb2Nlc3NvcnM6CiAgICAtIHR5cGU6IGNhY2hlX2NvbnRyb2wKICAgICAgbGFzdF9uX21lc3NhZ2VzOiAyCiAgbW9kZWw6CiAgICB0ZW1wZXJhdHVyZTogMS4KICAgIHJldHJ5OgogICAgICByZXRyaWVzOiAzCg==)agent:templates:system\_template:\|-Youareaprogrammingagentwhoisprovidedagithubissueandrepositorybashenvironmentandistaskedtogenerateastandalonetestscriptthatcanreproduceandverifytheissuewithoutrelyingonanytestingframeworks.instance\_template:\|-<uploaded\_files>{{working\_dir}}</uploaded\_files>I’veuploadedapythoncoderepositoryinthedirectory{{working\_dir}}.ConsiderthefollowingPRdescription:<pr\_description>{{problem\_statement}}</pr\_description>Canyouhelpmewriteastandalonetest\_issue.pyfilethattestsandreproducestheissuedescribedinthe<pr\_description>?Thistestfileshouldbecompletelyself-containedandexecutabledirectlywithPython,withoutrequiringanytestingframeworkslikepytestorunittest.IMPORTANTGUIDELINES:1.First,exploretherepositorytounderstandwhattheissueisaboutandhowtotestandreproduceit.Focusonunderstandingthecorefunctionalityratherthanthetestingstructure.2.CreateastandalonePythonscript(test\_issue.py)that:-Importsonlythenecessarymodulesfromtherepository-Setsuptheminimumenvironmentneededtoreproducetheissue-Containsalllogicwithinthescriptitself(noexternaltestdependencies)-Runsquicklyandterminatesitself(nobackgroundserversorlong-runningprocesses)-Writeatleasttentestcasestotesttheissue.3.CRITICAL:Foreachofthetestcases:yourtestscriptMUSTusetheseEXACTprintstatementstoindicatetestresultsforeachtestcase:-Print"FAILED"whenthecodeconfirmsthebugexists,andsothetestcasefails.-Print"PASSED"whenthecoderunswithouttheissueandsothetestcasepasses.-Print"Otherissues"whenunexpectedproblemsoccurIMPORTANT:Againincludetheaboveprintstatementsforeachofthetestcasesin/testbed/test\_issue.py.4.Includeerrorhandlingtopreventthescriptfromcrashing:-Catchexceptionsappropriately-Alwaysoutputoneofthethreeexactphrasesabove-DONOTuseassertionsthatmightterminatetheprogram(withouterrorhandling)5.Thetestshouldfail(print"FAILED")whenrunagainstthecurrentrepostate.6.Yourtestscriptshouldalsocheckforthecorrectbehaviourwhentheissueisfixed(i.e.print"PASSED").Iftheissueisnotfixedandthecodeexhibitsincorrectbehaviorafterapplyingafix,itshouldprint"Otherissues"or"FAILED"asappropriate.7.Writethefinaltestscriptto/testbed/test\_issue.py.Ensurethatthescriptisrunnablevia‘pythontest\_issue.py‘.8.Thefinallineinthetestscriptshouldbeacommentabouthowmanytestcaseswerewritten.Example:‘#Totaltests:6‘.9.Thisisimportanteachtestcasenumber(Outofthetotalyouwrote),wewillparsetheoutputoftestscriptone-by-oneandcheckifthesolutionpassestestcasei.Forexample,"""test\_case\_{i}PASSED"""or"""test\_case\_{i}FAILED""".Exampleformatforasingletestcaseinthetestscript:‘‘‘pythonimportsysfromsome\_packageimportrelevant\_moduledeftest1():try:#Setupminimaltestenvironmenttest\_input="exampleinputthattriggerstheissue"#Attempttheoperationthatshouldreproducetheissueresult=relevant\_module.function\_with\_issue(test\_input)#checkiftheissueisreproducedifresult=="expectedoutputthatindicatestheissue":return"FAILED"else:#checkifresultmatchestheexpectedoutputwhentheissueisresolved#ensuretoperformallnecessarychecksassertresult=="expectedoutputwhenresolved"return"PASSED"exceptExceptionase:return"Otherissues"#Optional:canincludeerrordetailsfordebugging...if\_\_name\_\_=="\_\_main\_\_":print(f"test\_case\_1{test1()}")...#Totaltests:5‘‘‘FINALCHECKS:-Doeseachoneofyourtestrunstandalone(withoutpytest/unittest)?-DoeseachoneofyourtestcontainEXACTLYONEofthethreerequiredprintstatements?-Doeseachoneofyourtestterminateautomaticallyafterprintingtheresult?-Doeseachoneofyourtestproperlyreproducetheissuedescribedintheproblemstatement?-Isitsimple,focused,andfreeofunnecessarycomplexity?-Doesthefinallineinthetestscriptcontainthecorrectnumberoftestcasesandwiththeexactformat‘#Totaltests:<numberoftestcases>‘(nocommas,nospaces,noothertext)?GENERALINSTRUCTIONS:-Eachresponsemustincludeboth-naturallanguagereasoningaboutyourapproach-afunctioncalltosolvethetask-Youcantakemultipleturnstosolvethetask,butonlyfinishonceyou’reconfidentinyoursolution-Ifafile\_editoreditfails,viewthefilebeforeretryingwithadjustedcontentGeneralSteps:1.Understandtheissue,correspondingcodeandhowtoreproducetheissue.2.Writeastandalonetestscriptthatreproducestheissue.Makesurethattheoutputis"FAILED"foreachofthesingletest.3.Addfurthertestcasesincludingmorethoroughtesting,inputs,edgecasestoensuretheissueiscorrectlyidentified.4.Runthetestscripttoensureoutputisasexpected(seeexampleoutputformatbelow).Thefinaloutputofthetestscriptshouldresemblethefollowingformat(justanexample):<EXAMPLEOUTPUTFORMAT>test\_case\_1FAILEDtest\_case\_2PASSEDtest\_case\_3FAILEDtest\_case\_4PASSEDtest\_case\_5FAILEDtest\_case\_6PASSEDtest\_case\_7FAILEDtest\_case\_8PASSEDtest\_case\_9FAILED</EXAMPLEOUTPUTFORMAT>Youmustfollowtheaboveformatfortheoutputofthetestscript.Otherissuesshouldbemax1-2testcases(inworstcase).Finally,usesubmittooltosubmit.CRITICAL:Donotsubmituntilyouhaveaddeddiversetestcasesandthoroughlyverifiedtheoutputofthetestscript.NOTE:fordjangoenvironments:youshouldusetest\_sqlitesettingsfileduringtesting.next\_step\_template:\|-OBSERVATION:{{observation}}next\_step\_no\_output\_template:\|-Yourcommandransuccessfullyanddidnotproduceanyoutput.tools:env\_variables:PAGER:catMANPAGER:catLESS:-RPIP\_PROGRESS\_BAR:’off’TQDM\_DISABLE:’1’GIT\_PAGER:catbundles:-path:tools/registry-path:tools/edit\_anthropic-path:tools/review\_on\_submit\_mregistry\_variables:USE\_FILEMAP:’true’SUBMIT\_REVIEW\_MESSAGES:-\|Thankyouforyourworkonwritingthetests.Pleasecarefullyfollowthestepsbelowtohelpreviewyourchanges.1.Ifyoumadeanychangestoyourcodeotherthanthe‘test\_issue.py‘file,pleaserevertthemtothestatetheyhadbeforeyoustartedwritingthetests.2.Youcandothiswith‘gitcheckout--/path/to/file.py‘.Usebelow<diff>tofindthefilesyouneedtorevert.3.Runthesubmitcommandagaintoconfirm.Hereisalistofallofyourchanges:<diff>{{diff}}</diff>enable\_bash\_tool:truedisable\_image\_processing:trueparse\_function:type:function\_callinghistory\_processors:-type:cache\_controllast\_n\_messages:2model:temperature:1.retry:retries:3

Patch Classifier[⬇](data:text/plain;base64,U1lTVEVNX1BST01QVCA9ICIiIllvdSBhcmUgYW4gZXhwZXJ0IGp1ZGdlIGV2YWx1YXRpbmcgQUkgYXNzaXN0YW50IGludGVyYWN0aW9ucy4gWW91ciB0YXNrIGlzIHRvIGRldGVybWluZSBpZiB0aGUgYXNzaXN0YW50IHN1Y2Nlc3NmdWxseSByZXNvbHZlZCB0aGUgdXNlcidzIHJlcXVlc3QuCgpLZXkgZXZhbHVhdGlvbiBjcml0ZXJpYToKMS4gRGlkIHRoZSBhc3Npc3RhbnQgY29tcGxldGUgdGhlIG1haW4gdGFzayByZXF1ZXN0ZWQgYnkgdGhlIHVzZXI/CjIuIERpZCB0aGUgYXNzaXN0YW50IGhhbmRsZSBhbGwgZWRnZSBjYXNlcyBhbmQgcmVxdWlyZW1lbnRzIHNwZWNpZmllZD8KMy4gV2VyZSB0aGVyZSBhbnkgZXJyb3JzIG9yIGlzc3VlcyBpbiB0aGUgZmluYWwgc29sdXRpb24/CgpSZXNwb25kIG9ubHkgd2l0aCAiPGp1ZGdlbWVudD5ZRVM8L2p1ZGdlbWVudD4iIG9yICI8anVkZ2VtZW50Pk5PPC9qdWRnZW1lbnQ+IiBiYXNlZCBvbgppZiB0aGUgYXNzaXN0YW50IHN1Y2Nlc3NmdWxseSByZXNvbHZlZCB0aGUgdXNlcidzIHJlcXVlc3QuIiIiCgpVU0VSX1BST01QVF9URU1QTEFURSA9ICIiIlBsZWFzZSBldmFsdWF0ZSB0aGUgZm9sbG93aW5nIHJlcXVlc3QgdG8gc29sdmUgYSBjb2RpbmcgaXNzdWUgYW5kIHRoZSBwcm9wb3NlZCBzb2x1dGlvbjoKCltQUk9NUFRdCgp7cHJvYmxlbV9zdGF0ZW1lbnR9CgpbU09MVVRJT05dCgp7bW9kZWxfcGF0Y2h9IiIiCg==)SYSTEM\_PROMPT="""YouareanexpertjudgeevaluatingAIassistantinteractions.Yourtaskistodetermineiftheassistantsuccessfullyresolvedtheuser’srequest.Keyevaluationcriteria:1.Didtheassistantcompletethemaintaskrequestedbytheuser?2.Didtheassistanthandlealledgecasesandrequirementsspecified?3.Werethereanyerrorsorissuesinthefinalsolution?Respondonlywith"<judgement>YES</judgement>"or"<judgement>NO</judgement>"basedoniftheassistantsuccessfullyresolvedtheuser’srequest."""USER\_PROMPT\_TEMPLATE="""Pleaseevaluatethefollowingrequesttosolveacodingissueandtheproposedsolution:\[PROMPT\]{problem\_statement}\[SOLUTION\]{model\_patch}"""

Non-Agentic Rubrics[⬇](data:text/plain;base64,U1lTVEVNX1BST01QVCA9ICIiIllvdSBhcmUgYW4gZXhwZXJ0IGNvZGUgcmV2aWV3ZXIgdGhhdCBjYW4gdW5kZXJzdGFuZCBpc3N1ZXMgYW5kIGFyZSB3ZWxsIHZlcnNlZCBpbiBjb2RlYmFzZXMuIFlvdXIgam9iIGlzIHRvIHdyaXRlIGhpZ2gtcXVhbGl0eSBydWJyaWNzIHRvIGdyYWRlIHRoZSBzb2x1dGlvbiB0byBhIGdpdmVuIGlzc3VlLgoKQmFzZWQgb24gdGhlIHByb2JsZW0gZGVzY3JpcHRpb24gcHJvdmlkZWQsIHdyaXRlIHJ1YnJpY3MgdGhhdCBjYW4gYmUgdXNlZCB0byBldmFsdWF0ZSBhIHBhdGNoIHRoYXQgYXR0ZW1wdHMgdG8gc29sdmUgdGhlIGlzc3VlLgoKQXRvbWljaXR5OgogIOKAoiBFYWNoIHJ1YnJpYyBjcml0ZXJpb24gc2hvdWxkIGV2YWx1YXRlIGV4YWN0bHkgb25lIGRpc3RpbmN0IGFzcGVjdC4KICDigKIgQXZvaWQgYnVuZGxpbmcgbXVsdGlwbGUgY3JpdGVyaWEgaW50byBhIHNpbmdsZSBydWJyaWMuIE1vc3Qgc3RhY2tlZCBjcml0ZXJpYSB3aXRoIHRoZSB3b3JkICJhbmQiIGNhbiBiZSBicm9rZW4gdXAgaW50byBtdWx0aXBsZSBwaWVjZXMuCgpTZWxmLWNvbnRhaW5tZW50ICYgc3BlY2lmaWNpdHkgKHN0cmljdCk6CiAg4oCiIERvIE5PVCB3cml0ZSBnZW5lcmljIGl0ZW1zOyBiaW5kIGVhY2ggaXRlbSB0byBleGFjdCBwYXRocy9zeW1ib2xzL3Rva2VucyBtZW50aW9uZWQgaW4gdGhlIHByb2JsZW0gZGVzY3JpcHRpb24uCiAg4oCiIE5ldmVyIHJlbHkgb24gY3Jvc3MtaXRlbSByZWZlcmVuY2VzOyBlYWNoIGl0ZW0gc3RhbmRzIGFsb25lIHdpdGggaXRzIG93biBpZGVudGlmaWVycyBhbmQgcGF0dGVybnMuCiAg4oCiIFRoZSBqdWRnZSB3aWxsIG9ubHkgaGF2ZSBhY2Nlc3MgdG8gdGhlIHByb2JsZW0gYW5kIHBhdGNoIGFuZCB0aGUgY3VycmVudCBydWJyaWMgdW5kZXIgZXZhbHVhdGlvbiwgc28gbWFrZSBzdXJlIHRoZSBydWJyaWMgY2FuIGJlIGV2YWx1YXRlZCB3aXRob3V0IGFueSBvdGhlciBpbmZvcm1hdGlvbi4KCk11dHVhbGx5IEV4Y2x1c2l2ZSwgQ29sbGVjdGl2ZWx5IEV4aGF1c3RpdmUgKE1FQ0UpOgogIOKAoiBUaGUgcnVicmljIHNldCBzaG91bGQgYmUgbXV0dWFsbHkgZXhjbHVzaXZlIGFuZCBjb2xsZWN0aXZlbHkgZXhoYXVzdGl2ZS4KClN0eWxlIGNvbnN0cmFpbnRzIChzdHJpY3QpOgogIOKAoiBZQU1MIG9ubHktbm8gcHJvc2Ugb3V0c2lkZSBZQU1MLgogIOKAoiBBdm9pZCBiYWNrc2xhc2gtaGVhdnkgcGF0dGVybnM7IGlmIHlvdSBhYnNvbHV0ZWx5IG11c3QgaW5jbHVkZSBvbmUsIGRvdWJsZSBhbnkgYmFja3NsYXNoZXMgc28gdGhlIFlBTUwgc3RheXMgdmFsaWQuCiAg4oCiIEVhY2ggcnVicmljIGRlc2NyaXB0aW9uIHN0YXJ0cyB3aXRoIGEgdGhpcmQtcGVyc29uIHNpbmd1bGFyIHZlcmIgKGUuZy4sIElkZW50aWZpZXMsIEltcGxlbWVudHMsIFZhbGlkYXRlcywgQ29uZmlybXMsIEF2b2lkcywgQ2xlYW5zIHVwLCBQbGFucykuCiAg4oCiIE1ha2UgZGVzY3JpcHRpb25zIGNvbmNyZXRlIHVzaW5nIHRva2VucyBmcm9tIHRoZSBwcm9ibGVtIGRlc2NyaXB0aW9uLgogIOKAoiBFYWNoIHJ1YnJpYyBpdGVtIGluY2x1ZGVzOiBpZCAoc2hvcnQpLCBkZXNjcmlwdGlvbiAodmVyYi1maXJzdCwgaW5zdGFuY2UtZ3JvdW5kZWQpLCB3ZWlnaHQgKGludDsgMT1uaWNlLCAyPXZhbHVhYmxlLCAzPW11c3QpLgogIOKAoiBBdm9pZCBkb3VibGUtY291bnRpbmc6IGRvIG5vdCByZS1zY29yZSB0aGUgc2FtZSBiZWhhdmlvciB1bmRlciBtdWx0aXBsZSBpdGVtcy4KClBhdHRlcm4td3JpdGluZyBndWlkZWxpbmVzIChrZWVwIGxpdGVyYWwgWUFNTC1mcmllbmRseSB0ZXh0OyBubyByZWdleCByZXF1aXJlZCk6CiAg4oCiIFVzZSBwbGFpbiBwYXRoIG1lbnRpb25zIGxpa2UgImRpZmYgLS1naXQgYS9wYXRoL3RvL2ZpbGUucHkiIG9yICIrKysgYi9wYXRoL3RvL2ZpbGUucHkiLgogIOKAoiBSZWZlciB0byBzeW1ib2xzIHdpdGggc3RyYWlnaHRmb3J3YXJkIHBocmFzZXMgc3VjaCBhcyAiZGVmIG15X2Z1bmN0aW9uKCIgaW5zdGVhZCBvZiByZWdleCBjbGFzc2VzLgogIOKAoiBEZXNjcmliZSB2YWx1ZSBwYXR0ZXJucyBpbiB3b3JkcyAoZS5nLiwgInN0cmluZyBjb250YWluaW5nIHRvdGFsIikgaW5zdGVhZCBvZiBjb21wbGV4IGV4cHJlc3Npb25zLgogIOKAoiBJZiB5b3UgbmVlZCB0byBmb3JiaWQgc29tZXRoaW5nLCBqdXN0IG1lbnRpb24gdGhlIGV4YWN0IHN0cmluZyAnQHB5dGVzdC5tYXJrLnNraXAnLCBldGMKCkF4ZXMgKGV4ZWN1dGlvbi1mcmVlKToKICDigKIgZmlsZV9jaGFuZ2VfcnVicmljcyAoNC04KTogU2NvcGUsIGxvY2FsaXR5LCBhbmQgc3VmZmljaWVuY3kgb2YgZWRpdHMgaW4gUEFUQ0ggKGZpbGVzL3N5bWJvbHMvZ3VhcmRzL3JlZ2V4ZXMvZmxhZ3MpLiBQZW5hbGl6ZSB1bnJlbGF0ZWQgZmlsZSBjaHVybjsgcmV3YXJkIG1pbmltYWwsIHJldmVyc2libGUgZGlmZnMgdGllZCB0byB0aGUgc3RhdGVkIGJ1Zy4KICDigKIgc3BlY19hbGlnbm1lbnRfcnVicmljcyAoMy02KTogQWxpZ25tZW50IG9mIGNvZGUgdG8gdGhlIHByb2JsZW0gZGVzY3JpcHRpb24uIFVzZSB0ZXh0dWFsIGFjY2VwdGFuY2UgY3JpdGVyaWEgKHJlcXVpcmVkIHR5cGVzL2NvbmRpdGlvbnMvZXJyb3IgaGFuZGxpbmcvQVBJIGNvbnRyYWN0cykgYW5kIGVuc3VyZSB0aGUgcGF0Y2ggcmVmbGVjdHMgdGhlbS4KICDigKIgaW50ZWdyaXR5X3J1YnJpY3MgKDMtNik6IEh5Z2llbmUgYW5kICJuby1jaGVhdGluZyIgc2FmZWd1YXJkcy1hdm9pZCB0ZXN0IHdlYWtlbmluZyAoaWYgdGVzdHMgYXBwZWFyIGluIFBBVENIKSwgbWFzcyByZW5hbWVzLCBvciBkZXBlbmRlbmN5IGNodXJuOyBwcmVzZXJ2ZSBwdWJsaWMgQVBJL3NlbWFudGljcyB1bmxlc3MgdGhlIHByb2JsZW0gZGVzY3JpcHRpb24gcmVxdWlyZXMgb3RoZXJ3aXNlLgogIOKAoiBydW50aW1lX3J1YnJpY3MgKDMtNik6IE5hdHVyYWwtbGFuZ3VhZ2UgY3JpdGVyaWEgZGVzY3JpYmluZyAqKmludGVuZGVkIHJ1bnRpbWUgYmVoYXZpb3IqKiAoTk9UIGNvbmNyZXRlIHRlc3RzKSwgc3VwcG9ydGVkIGJ5IGV4ZWN1dGlvbi1mcmVlIHRleHR1YWwgZXZpZGVuY2UuCiAgICAgIC0gKipEaXN0aW5ndWlzaGFiaWxpdHk6KiogRW5zdXJlcyB0aGUgcGF0Y2ggaW50cm9kdWNlcyBvciBwcmVzZXJ2ZXMgc2lnbmFscyB0aGF0IGRpZmZlcmVudGlhdGUgY29ycmVjdCB2cy4gaW5jb3JyZWN0IGJlaGF2aW9yIHVuZGVyIHBsYXVzaWJsZSBpbnB1dHMgKGUuZy4sIHNwZWNpZmljIGV4Y2VwdGlvbiBjbGFzcywgc2VudGluZWwgcmV0dXJuLCBib3VuZGFyeSBndWFyZCkuCiAgICAgIC0gKipSZWdyZXNzaW9uIHNhZmV0eToqKiBDb25maXJtcyBiYWNrd2FyZC1jb21wYXRpYmlsaXR5IGNvbnN0cmFpbnRzIChlLmcuLCBvcmlnaW5hbCBBUEkgc2lnbmF0dXJlcy9mbGFncyByZW1haW4gdmFsaWQsIGRlcHJlY2F0aW9ucyBnYXRlZCB2aWEgd2FybmluZ3MpLgogICAgICAtICoqRGV0ZXJtaW5pc20gLyBmbGFrZSByZXNpc3RhbmNlOioqIEF2b2lkcyBub25kZXRlcm1pbmlzdGljIHNvdXJjZXMgYXQgcnVudGltZSAodW5zZWVkZWQgcmFuZG9tbmVzcywgd2FsbC1jbG9jayBzbGVlcHMsIG5ldHdvcmsgSS9PKSB0aGF0IHdvdWxkIG1ha2UgdGVzdHMgZmxha3kuCiAgICAgIC0gKipSZXNvdXJjZSAmIHRpbWVvdXQgYm91bmRzOioqIFByZXZlbnRzIHBhdGhvbG9naWNhbCBsb29wcyBvciBoZWF2eSBjYWxsczsgcmVzcGVjdHMgZXhpc3RpbmcgdGltZW91dHMvbGltaXRzLgogICAgICAtICoqRXJyb3Itc3VyZmFjZSBjbGFyaXR5OioqIFByb2R1Y2VzIHN0YWJsZSwgc3BlY2lmaWMgbWVzc2FnZXMvZXhjZXB0aW9uIHR5cGVzIHRoYXQgYSB0ZXN0IGNvdWxkIGFzc2VydCBhZ2FpbnN0IChub3QgdmFndWUgc3RyaW5ncykuCiAgICAgIC0gKipIYXJuZXNzIGludGVncml0eToqKiBEb2VzIG5vdCBieXBhc3Mgb3IgZGlzYWJsZSB0aGUgcHJvamVjdCdzIHJ1bm5lci92ZXJpZmllciBob29rcyAoZS5nLiwga2VlcHMgcmVncmVzc2lvbiBmaWx0ZXJzLCBDTEkgZXhpdCBjb2RlcykuCgpSZXR1cm4gZXhhY3RseSB0aGlzIFlBTUwgc3RydWN0dXJlIChhbmQgbm90aGluZyBlbHNlKToKbWV0YWRhdGE6CiAgdGFza19zdW1tYXJ5OiAiPG9uZS1zZW50ZW5jZSBzdW1tYXJ5IGdyb3VuZGVkIGluIHRoZSBwcm9ibGVtIGRlc2NyaXB0aW9uPiIKICB1bmRlcmx5aW5nX2J1ZzogIjxwcmVjaXNlIGZhaWx1cmUgdHJpZ2dlciBncm91bmRlZCBpbiB0aGUgcHJvYmxlbSBkZXNjcmlwdGlvbj4iCmF4ZXM6CiAgZmlsZV9jaGFuZ2VfcnVicmljczoKICAgIC0gaWQ6ICJGQzEiCiAgICAgIGRlc2NyaXB0aW9uOiAiSWRlbnRpZmllcyAuLi4iCiAgICAgIHdlaWdodDogMwogICAgLSBpZDogIkZDMiIKICAgICAgZGVzY3JpcHRpb246ICJJZGVudGlmaWVzIC4uLiIKICAgICAgd2VpZ2h0OiAyCiAgc3BlY19hbGlnbm1lbnRfcnVicmljczoKICAgIC0gaWQ6ICJTQTEiCiAgICAgIGRlc2NyaXB0aW9uOiAiUmVjb2duaXplcyAuLi4iCiAgICAgIHdlaWdodDogMgogIGludGVncml0eV9ydWJyaWNzOgogICAgLSBpZDogIkkxIgogICAgICBkZXNjcmlwdGlvbjogIkNvbmZpcm1zIC4uLiIKICAgICAgd2VpZ2h0OiAyCiAgcnVudGltZV9ydWJyaWNzOgogICAgLSBpZDogIlIxIgogICAgICBkZXNjcmlwdGlvbjogIk1haW50YWlucyAuLi4iCiAgICAgIHdlaWdodDogMgoiIiIKClVTRVJfUFJPTVBUX1RFTVBMQVRFID0gIiIiQ29uc2lkZXIgdGhlIGZvbGxvd2luZyBwcm9ibGVtIGRlc2NyaXB0aW9uOgoKPHByb2JsZW1fZGVzY3JpcHRpb24+Cntwcm9ibGVtX3N0YXRlbWVudH0KPC9wcm9ibGVtX2Rlc2NyaXB0aW9uPgoKV3JpdGUgaGlnaCBxdWFsaXR5IHJ1YnJpY3MgdG8gZ3JhZGUgYSBwYXRjaCB0aGF0IGF0dGVtcHRzIHRvIHNvbHZlIHRoZSB0YXNrIGRlc2NyaWJlZCBpbiB0aGUgPHByb2JsZW1fZGVzY3JpcHRpb24+LgpPdXRwdXQgT05MWSB2YWxpZCBZQU1MIHdpdGggdGhlIHN0cnVjdHVyZSBzcGVjaWZpZWQgaW4gdGhlIHN5c3RlbSBwcm9tcHQuIERvIG5vdCBpbmNsdWRlIGFueSBvdGhlciB0ZXh0IG9yIGV4cGxhbmF0aW9uLgoiIiI=)SYSTEM\_PROMPT="""Youareanexpertcodereviewerthatcanunderstandissuesandarewellversedincodebases.Yourjobistowritehigh-qualityrubricstogradethesolutiontoagivenissue.Basedontheproblemdescriptionprovided,writerubricsthatcanbeusedtoevaluateapatchthatattemptstosolvetheissue.Atomicity:•Eachrubriccriterionshouldevaluateexactlyonedistinctaspect.•Avoidbundlingmultiplecriteriaintoasinglerubric.Moststackedcriteriawiththeword"and"canbebrokenupintomultiplepieces.Self-containment&specificity(strict):•DoNOTwritegenericitems;bindeachitemtoexactpaths/symbols/tokensmentionedintheproblemdescription.•Neverrelyoncross-itemreferences;eachitemstandsalonewithitsownidentifiersandpatterns.•Thejudgewillonlyhaveaccesstotheproblemandpatchandthecurrentrubricunderevaluation,somakesuretherubriccanbeevaluatedwithoutanyotherinformation.MutuallyExclusive,CollectivelyExhaustive(MECE):•Therubricsetshouldbemutuallyexclusiveandcollectivelyexhaustive.Styleconstraints(strict):•YAMLonly-noproseoutsideYAML.•Avoidbackslash-heavypatterns;ifyouabsolutelymustincludeone,doubleanybackslashessotheYAMLstaysvalid.•Eachrubricdescriptionstartswithathird-personsingularverb(e.g.,Identifies,Implements,Validates,Confirms,Avoids,Cleansup,Plans).•Makedescriptionsconcreteusingtokensfromtheproblemdescription.•Eachrubricitemincludes:id(short),description(verb-first,instance-grounded),weight(int;1=nice,2=valuable,3=must).•Avoiddouble-counting:donotre-scorethesamebehaviorundermultipleitems.Pattern-writingguidelines(keepliteralYAML-friendlytext;noregexrequired):•Useplainpathmentionslike"diff--gita/path/to/file.py"or"+++b/path/to/file.py".•Refertosymbolswithstraightforwardphrasessuchas"defmy\_function("insteadofregexclasses.•Describevaluepatternsinwords(e.g.,"stringcontainingtotal")insteadofcomplexexpressions.•Ifyouneedtoforbidsomething,justmentiontheexactstring’@pytest.mark.skip’,etcAxes(execution-free):•file\_change\_rubrics(4-8):Scope,locality,andsufficiencyofeditsinPATCH(files/symbols/guards/regexes/flags).Penalizeunrelatedfilechurn;rewardminimal,reversiblediffstiedtothestatedbug.•spec\_alignment\_rubrics(3-6):Alignmentofcodetotheproblemdescription.Usetextualacceptancecriteria(requiredtypes/conditions/errorhandling/APIcontracts)andensurethepatchreflectsthem.•integrity\_rubrics(3-6):Hygieneand"no-cheating"safeguards-avoidtestweakening(iftestsappearinPATCH),massrenames,ordependencychurn;preservepublicAPI/semanticsunlesstheproblemdescriptionrequiresotherwise.•runtime\_rubrics(3-6):Natural-languagecriteriadescribing\*\*intendedruntimebehavior\*\*(NOTconcretetests),supportedbyexecution-freetextualevidence.-\*\*Distinguishability:\*\*Ensuresthepatchintroducesorpreservessignalsthatdifferentiatecorrectvs.incorrectbehaviorunderplausibleinputs(e.g.,specificexceptionclass,sentinelreturn,boundaryguard).-\*\*Regressionsafety:\*\*Confirmsbackward-compatibilityconstraints(e.g.,originalAPIsignatures/flagsremainvalid,deprecationsgatedviawarnings).-\*\*Determinism/flakeresistance:\*\*Avoidsnondeterministicsourcesatruntime(unseededrandomness,wall-clocksleeps,networkI/O)thatwouldmaketestsflaky.-\*\*Resource&timeoutbounds:\*\*Preventspathologicalloopsorheavycalls;respectsexistingtimeouts/limits.-\*\*Error-surfaceclarity:\*\*Producesstable,specificmessages/exceptiontypesthatatestcouldassertagainst(notvaguestrings).-\*\*Harnessintegrity:\*\*Doesnotbypassordisabletheproject’srunner/verifierhooks(e.g.,keepsregressionfilters,CLIexitcodes).ReturnexactlythisYAMLstructure(andnothingelse):metadata:task\_summary:"<one-sentencesummarygroundedintheproblemdescription>"underlying\_bug:"<precisefailuretriggergroundedintheproblemdescription>"axes:file\_change\_rubrics:-id:"FC1"description:"Identifies..."weight:3-id:"FC2"description:"Identifies..."weight:2spec\_alignment\_rubrics:-id:"SA1"description:"Recognizes..."weight:2integrity\_rubrics:-id:"I1"description:"Confirms..."weight:2runtime\_rubrics:-id:"R1"description:"Maintains..."weight:2"""USER\_PROMPT\_TEMPLATE="""Considerthefollowingproblemdescription:<problem\_description>{problem\_statement}</problem\_description>Writehighqualityrubricstogradeapatchthatattemptstosolvethetaskdescribedinthe<problem\_description>.OutputONLYvalidYAMLwiththestructurespecifiedinthesystemprompt.Donotincludeanyothertextorexplanation."""

### A.11 Rubric Judge Prompt

Rubric Judge Prompt[⬇](data:text/plain;base64,U1lTVEVNX1BST01QVCA9ICIiIgpZb3UgYXJlIGEgcnVicmljIGJhc2VkIGV2YWx1YXRvciBmb3Igc29mdHdhcmUtZW5naW5lZXJpbmcgYWdlbnQncyBnZW5lcmF0ZWQgcGF0Y2guIFVzZSB0aGUgcHJvdmlkZWQgcnVicmljIHRvIGV2YWx1YXRlIHRoZSBnZW5lcmF0ZWQgcGF0Y2guCgpJbnB1dHMgKHByb3ZpZGVkIGxhdGVyKToKCS0gUFJfREVTQ1JJUFRJT046IHByb2JsZW0gKyBleHBlY3RlZCBiZWhhdmlvci4KCS0gUlVCUklDOiBkaWN0aW9uYXJ5IG9mIG4gcnVicmljIGl0ZW1zIGZvciBhbiBpZGVhbCBwYXRjaCB3aXRoIHRoZWlyIGlkcyBhcyBrZXlzIGFuZCBkZXNjcmlwdGlvbnMgYXMgdmFsdWVzLgogIC0gUEFUQ0g6IHRoZSBtb2RlbCdzIHByZWRpY3RlZCBjb2RlIHBhdGNoCgpZb3VyIGpvYjoKCTEuCUFuYWx5emUgdGhlIHJ1YnJpYyBhbmQgdGhlIHBhdGNoIHRvIGV2YWx1YXRlIHRoZSBTV0UtYWdlbnQncyBnZW5lcmF0ZWQgcGF0Y2guCgkyLglFbWl0IGEgc2NvcmUgZm9yIGVhY2ggcnVicmljIGl0ZW0uIFRoZSBzY29yZSBzaG91bGQgYmUgYSBiaW5hcnkgc2NvcmUgb2YgMSBpZiB0aGUgcGF0Y2ggc2F0aXNmaWVzIHRoZSBydWJyaWMgaXRlbSBhbmQgMCBvdGhlcndpc2UuCgpSZXR1cm4gdGhlIHNjb3JlcyBpbiBhIEpTT04gZm9ybWF0LgoKSlNPTiBmb3JtYXQ6CnsKICAiPHJ1YnJpY19pZF8xPiI6IDxzY29yZV8xPiwKICAiPHJ1YnJpY19pZF8yPiI6IDxzY29yZV8yPiwKICAiPHJ1YnJpY19pZF8zPiI6IDxzY29yZV8zPiwKICAiPHJ1YnJpY19pZF80PiI6IDxzY29yZV80PiwKICAuLi4KICAiPHJ1YnJpY19pZF9uPiI6IDxzY29yZV9uPgp9IiIiCgoKVVNFUl9QUk9NUFQgPSAiIiIKUFJfREVTQ1JJUFRJT046Cntwcl9kZXNjcmlwdGlvbn0KClBBVENIOgp7cGF0Y2h9CgpSVUJSSUM6CntydWJyaWN9CgpQbGVhc2UgZXZhbHVhdGUgdGhlIFBBVENIIHVzaW5nIHRoZSBydWJyaWMgYW5kIHJldHVybiB0aGUgc2NvcmVzIGluIEpTT04gZm9ybWF0LgpTQ09SRVM6CiIiIg==)SYSTEM\_PROMPT="""Youarearubricbasedevaluatorforsoftware-engineeringagent’sgeneratedpatch.Usetheprovidedrubrictoevaluatethegeneratedpatch.Inputs(providedlater):-PR\_DESCRIPTION:problem+expectedbehavior.-RUBRIC:dictionaryofnrubricitemsforanidealpatchwiththeiridsaskeysanddescriptionsasvalues.-PATCH:themodel’spredictedcodepatchYourjob:1.AnalyzetherubricandthepatchtoevaluatetheSWE-agent’sgeneratedpatch.2.Emitascoreforeachrubricitem.Thescoreshouldbeabinaryscoreof1ifthepatchsatisfiestherubricitemand0otherwise.ReturnthescoresinaJSONformat.JSONformat:{"<rubric\_id\_1>":<score\_1>,"<rubric\_id\_2>":<score\_2>,"<rubric\_id\_3>":<score\_3>,"<rubric\_id\_4>":<score\_4>,..."<rubric\_id\_n>":<score\_n>}"""USER\_PROMPT="""PR\_DESCRIPTION:{pr\_description}PATCH:{patch}RUBRIC:{rubric}PleaseevaluatethePATCHusingtherubricandreturnthescoresinJSONformat.SCORES:"""

### A.12 Rubric Utility Analysis Prompt

Rubric Utility Analysis Prompt[⬇](data:text/plain;base64,U1lTVEVNX1BST01QVCA9ICIiIgpZb3UgYXJlIGFuIGV4cGVydCBzb2Z0d2FyZSBlbmdpbmVlci4gWW91ciBqb2IgaXMgdG8gYW5hbHl6ZSBob3cgYSBjYW5kaWRhdGUgcGF0Y2gKaXMgZ3JhZGVkIGJ5IHRlc3RzIGFuZCBydWJyaWNzLgoKSW5wdXRzIChwcm92aWRlZCBsYXRlcik6CiAgLSBwcm9ibGVtX3N0YXRlbWVudAogIC0gZ29sZGVuX3BhdGNoICh0aGUgZ3JvdW5kLXRydXRoIGNvZGUgcGF0Y2gpCiAgLSBjYW5kaWRhdGVfcGF0Y2ggKHRoZSBtb2RlbCdzIHByZWRpY3RlZCBjb2RlIHBhdGNoKQogIC0gZ29sZGVuX3Rlc3RfY2FzZXMKICAtIHRlc3RfY2FzZV9yZXdhcmQgKDAgb3IgMSkKICAtIHJ1YnJpY19kZXNjcmlwdGlvbnMgKG1hcDogcnVicmljX2lkIC0+IHRleHQpCiAgLSBydWJyaWNzX3RvX2FuYWx5emUgKGxpc3Qgb2YgcnVicmljIGlkcyB0byBhbmFseXplKQoKVHJlYXQgcHJvYmxlbV9zdGF0ZW1lbnQgKyBnb2xkZW5fcGF0Y2ggKyBnb2xkZW5fdGVzdF9jYXNlcyBhcyB0aGUgZ3JvdW5kLXRydXRoCnNwZWNpZmljYXRpb24gZm9yIGNvcnJlY3QgYmVoYXZpb3IuCgpXZSBmb2N1cyBvbiBISUdILUFMSUdOTUVOVCBjYXNlcyBiZXR3ZWVuIHRlc3RzIGFuZCBydWJyaWNzOgogIC0gSWYgdGVzdF9jYXNlX3Jld2FyZCA9IDAsIHJ1YnJpY3NfdG9fYW5hbHl6ZSBpcyB0aGUgc2V0IG9mIEZBSUxJTkcgcnVicmljcy4KICAgIEhlcmUgd2UgYXNrOiBob3cgd2VsbCBkbyB0aGVzZSBmYWlsaW5nIHJ1YnJpY3MgYWxpZ24gd2l0aCB0aGUgcmVhc29ucyB0aGUKICAgIGdvbGRlbiB0ZXN0cyByZWplY3QgdGhlIGNhbmRpZGF0ZV9wYXRjaD8KICAtIElmIHRlc3RfY2FzZV9yZXdhcmQgPSAxLCBydWJyaWNzX3RvX2FuYWx5emUgaXMgdGhlIHNldCBvZiBBQ0NFUFRFRCBydWJyaWNzLgogICAgSGVyZSB3ZSBhc2s6IGhvdyB3ZWxsIGRvIHRoZXNlIGFjY2VwdGVkIHJ1YnJpY3MgYWxpZ24gd2l0aCB0aGUgcmVhc29ucyB0aGUKICAgIGdvbGRlbiB0ZXN0cyBhY2NlcHQgdGhlIGNhbmRpZGF0ZV9wYXRjaD8KCllvdXIgdGFzazoKICAxLiBGb3IgZWFjaCBydWJyaWMgaW4gcnVicmljc190b19hbmFseXplLCBkZWNpZGUgd2hldGhlciBpdCBpczoKICAgICBhKSBWYWxpZCAgIC0gaXRzIGp1ZGdtZW50IGlzIGNvbnNpc3RlbnQgd2l0aCB0aGUgZ3JvdW5kLXRydXRoIHNwZWMgYW5kIGl0CiAgICAgICAgICAgICAgICAgIHByb3ZpZGVzIGEgY29ycmVjdCwgbWVhbmluZ2Z1bCByZWFzb24gdGhhdCBhZ3JlZXMgd2l0aCB0aGUKICAgICAgICAgICAgICAgICAgdGVzdCBvdXRjb21lLgogICAgIGIpIFNwdXJpb3VzIC0gaXRzIGp1ZGdtZW50IGlzIG5vdCB3ZWxsIHN1cHBvcnRlZCBieSB0aGUgZ3JvdW5kLXRydXRoIHNwZWMKICAgICAgICAgICAgICAgICAgb3IgYWRkcyBub2lzZSAoZS5nLiwgdW5uZWNlc3NhcnkgY29uc3RyYWludHMsIGNvbmZsaWN0cyB3aXRoCiAgICAgICAgICAgICAgICAgIHRoZSBnb2xkZW4gYmVoYXZpb3IsIG9yIG1pc2ludGVycHJldHMgdGhlIHNpdHVhdGlvbiksIGV2ZW4KICAgICAgICAgICAgICAgICAgdGhvdWdoIHRoZSBzaWduIG9mIHRoZSBzY29yZSBhbGlnbnMgd2l0aCB0aGUgdGVzdHMuCiAgMi4gQXNzaWduIGVhY2ggcnVicmljIHRvIGV4YWN0bHkgT05FIHN1Yi1jYXRlZ29yeSB1bmRlciBpdHMgbWFpbiBjYXRlZ29yeQogICAgIChWYWxpZCBvciBTcHVyaW91cykuIElmIG5vIHN1Yi1jYXRlZ29yeSBmaXRzLCBjcmVhdGUgYSBuZXcgb25lIHdpdGggYSBzaG9ydAogICAgIHRpdGxlIGFuZCBhIGJyaWVmIGRlc2NyaXB0aW9uLgoKVkFMSUQgc3ViLWNhdGVnb3JpZXMgKHVzZSB3aGVuIHRoZSBydWJyaWMgYWRkcyByZWFsIHZhbHVlIGFuZCBpcyBjb25zaXN0ZW50CndpdGggdGhlIHNwZWMpOgogIC0gQ29yZSBTZW1hbnRpY3MKICAgICAgQ2hlY2tzIHdoZXRoZXIgdGhlIHBhdGNoIGFjdHVhbGx5IGZpeGVzIG9yIHByZXNlcnZlcyB0aGUgZnVuY3Rpb25hbAogICAgICBiZWhhdmlvciBkZXNjcmliZWQgaW4gdGhlIHByb2JsZW0gKHJvb3QgY2F1c2UsIG91dHB1dHMsIHNlbWFudGljcykuCiAgLSBFZGdlIENvdmVyYWdlCiAgICAgIEVuZm9yY2VzIGhhbmRsaW5nIG9mIGltcG9ydGFudCBlZGdlIGNhc2VzIG9yIHJlcHJvZHVjZXIgc2NlbmFyaW9zIHRoYXQKICAgICAgYXJlIGltcGxpZWQgYnkgdGhlIHNwZWMgYnV0IG5vdCBmdWxseSBjb3ZlcmVkIGJ5IHRlc3RzLgogIC0gQVBJIC8gQ29tcGF0CiAgICAgIEVuc3VyZXMgcHVibGljIEFQSSBzaGFwZSwgdHlwZXMsIGFuZCBiZWhhdmlvciBzdGF5IGNvbXBhdGlibGUgd2l0aAogICAgICBleGlzdGluZyBjYWxsZXJzL3ZlcnNpb25zLCBvciBjaGFuZ2UgZXhhY3RseSBhcyByZXF1aXJlZCBieSB0aGUgc3BlYy4KICAtIFN0cnVjdHVyZSAvIFNjb3BlCiAgICAgIEVuc3VyZXMgdGhlIGNoYW5nZSBpcyBpbiB0aGUgY29ycmVjdCBtb2R1bGUvbGF5ZXIgYW5kIHJlYXNvbmFibHkKICAgICAgbG9jYWxpemVkIChubyB3cm9uZy1sYXllciBmaXgsIG5vIHVucmVsYXRlZCBlZGl0cywgbm8gc2NvcGUgY3JlZXApLgogIC0gUGVyZm9ybWFuY2UgUmlzawogICAgICBGbGFncyBsaWtlbHkgcGVyZm9ybWFuY2Ugb3IgcmVzb3VyY2UgcmVncmVzc2lvbnMgdGhhdCB0ZXN0cyBkbyBub3QKICAgICAgZGlyZWN0bHkgbWVhc3VyZS4KICAtIFNlY3VyaXR5IC8gU2FmZXR5CiAgICAgIEVuZm9yY2VzIHZhbGlkYXRpb24sIHNlY3VyaXR5LCBvciBzYWZldHkgcHJvcGVydGllcyB0aGF0IHNob3VsZCBub3QgYmUKICAgICAgd2Vha2VuZWQgYnkgdGhlIHBhdGNoLgogIC0gW05FVyBWQUxJRF0KICAgICAgSWYgbm9uZSBmaXQsIGNyZWF0ZSBhIG5ldyBWYWxpZCBzdWItY2F0ZWdvcnkgd2l0aCBhIHNob3J0IHRpdGxlIGFuZCBhCiAgICAgIDEtMiBzZW50ZW5jZSBkZXNjcmlwdGlvbi4KClNQVVJJT1VTIHN1Yi1jYXRlZ29yaWVzICh1c2Ugd2hlbiB0aGUgcGF0Y2ggaXMgYWNjZXB0YWJsZSBnaXZlbiB0aGUgc3BlYywgYnV0CnRoZSBydWJyaWMncyBmYWlsdXJlIGlzIG5vdCB3ZWxsIGp1c3RpZmllZCk6CiAgLSBMb3ctU2lnbmFsCiAgICAgIEVuY29kZXMgaXJyZWxldmFudCBvciByZWR1bmRhbnQgY29uc3RyYWludHMgKHN0eWxlLW9ubHksIGh5Z2llbmUtb25seSwKICAgICAgb3Igbm8gbmV3IGluZm9ybWF0aW9uIGJleW9uZCBvdGhlciBjaGVja3MpLgogIC0gT3Zlci1TcGVjaWZpZWQKICAgICAgRGVtYW5kcyBhIHNwZWNpZmljIGltcGxlbWVudGF0aW9uIGV2ZW4gdGhvdWdoIGFsdGVybmF0aXZlIGNvcnJlY3QgZml4ZXMKICAgICAgYXJlIGFsbG93ZWQuCiAgLSBTcGVjIENvbmZsaWN0CiAgICAgIENvbnRyYWRpY3RzIHRoZSBwcm9ibGVtIHN0YXRlbWVudCwgZ29sZGVuX3BhdGNoLCBvciBnb2xkZW5fdGVzdF9jYXNlcwogICAgICAoZm9yYmlkcyBiZWhhdmlvciB0aGUgc3BlYyBhbGxvd3Mgb3IgZGlzYWdyZWVzIHdpdGggdGhlIHJlZmVyZW5jZSkuCiAgLSBUZXN0IE1pc21hdGNoCiAgICAgIEFzc3VtZXMgYSBkaWZmZXJlbnQgdGVzdCBzZXR1cCBvciBldmFsdWF0aW9uIHByb3RvY29sIHRoYW4gdGhlIG9uZQogICAgICBhY3R1YWxseSB1c2VkIChlLmcuLCBleHBlY3RzIHRlc3QgZWRpdHMgdGhhdCBhcmUgbm90IGluIHNjb3BlKS4KICAtIEV2YWwgRXJyb3IKICAgICAgRmFpbHVyZSBpcyBjYXVzZWQgYnkgYSBzY29yaW5nIC8gbWF0Y2hpbmcgLyBwYXJzaW5nIGJ1ZyByYXRoZXIgdGhhbiBhCiAgICAgIHJlYWwgcHJvcGVydHkgb2YgdGhlIGNhbmRpZGF0ZV9wYXRjaC4KICAtIFtORVcgU1BVUklPVVNdCiAgICAgIElmIG5vbmUgZml0LCBjcmVhdGUgYSBuZXcgU3B1cmlvdXMgc3ViLWNhdGVnb3J5IHdpdGggYSBzaG9ydCB0aXRsZSBhbmQgYQogICAgICAxLTIgc2VudGVuY2UgZGVzY3JpcHRpb24uCgpSZWFzb25pbmcgcnVsZXM6CiAgLSBBbHdheXMgdHJlYXQgZ29sZGVuX3BhdGNoICsgZ29sZGVuX3Rlc3RfY2FzZXMgYXMgdGhlIGF1dGhvcml0YXRpdmUgc3BlYy4KICAtIElmIGEgcnVicmljJ3MgZXhwbGFuYXRpb24gY2xlYXJseSBjb25mbGljdHMgd2l0aCB0aGlzIHNwZWMsIGl0IGlzIGFsbW9zdAogICAgY2VydGFpbmx5IFNwdXJpb3VzLgogIC0gTWFyayBhIHJ1YnJpYyBhcyBWYWxpZCBvbmx5IGlmIGl0cyBqdWRnbWVudCBhbmQgcmF0aW9uYWxlIGFyZSBjb25zaXN0ZW50CiAgICB3aXRoIHRoZSBzcGVjIEFORCBtZWFuaW5nZnVsbHkgZXhwbGFpbiB3aHkgdGhlIHRlc3Qgb3V0Y29tZSAoMCBvciAxKSBpcwogICAgY29ycmVjdC4KCk91dHB1dCBmb3JtYXQ6ClJldHVybiBhIEpTT04gYXJyYXksIG9uZSBlbnRyeSBwZXIgcnVicmljIGluIHJ1YnJpY3NfdG9fYW5hbHl6ZToKClsKICB7CiAgICAicnVicmljX2lkIjogIkZDNSIsCiAgICAicnVicmljX2Rlc2NyaXB0aW9uIjogIjxmcm9tIHJ1YnJpY19kZXNjcmlwdGlvbnM+IiwKICAgICJ0aWVyX2NhdGVnb3J5IjogIlZhbGlkIiBvciAiU3B1cmlvdXMiLAogICAgInN1YmNhdGVnb3J5X3RpdGxlIjogIjxvbmUgb2YgdGhlIHRpdGxlcyBhYm92ZSBvciBhIG5ldyBvbmU+IiwKICAgICJzdWJjYXRlZ29yeV9kZXNjcmlwdGlvbiI6ICI8MS0yIHNlbnRlbmNlIGRlZmluaXRpb24+IiwKICAgICJqdXN0aWZpY2F0aW9uIjogIjwyLTQgc2VudGVuY2VzIGNpdGluZyBjYW5kaWRhdGVfcGF0Y2gsIGdvbGRlbl9wYXRjaCwKICAgICAgICAgICAgICAgICAgICAgIGdvbGRlbl90ZXN0X2Nhc2VzLCBhbmQgcmVmZXJyaW5nIHRvIHRlc3RfY2FzZV9yZXdhcmQ+IgogIH0KXQoiIiIKClVTRVJfUFJPTVBUID0gIiIiCnByb2JsZW1fc3RhdGVtZW50Ogp7cHJvYmxlbV9zdGF0ZW1lbnR9Cgpnb2xkZW5fcGF0Y2g6Cntnb2xkZW5fcGF0Y2h9CgpjYW5kaWRhdGVfcGF0Y2g6CntjYW5kaWRhdGVfcGF0Y2h9Cgpnb2xkZW5fdGVzdF9jYXNlczoKe2dvbGRlbl90ZXN0X2Nhc2VzfQoKdGVzdF9jYXNlX3Jld2FyZDoKe3Rlc3RfY2FzZV9yZXdhcmR9CgpydWJyaWNfZGVzY3JpcHRpb25zOgp7cnVicmljX2Rlc2NyaXB0aW9uc30KCnJ1YnJpY3NfdG9fYW5hbHl6ZToKe3J1YnJpY3NfdG9fYW5hbHl6ZX0KClBsZWFzZSBjbGFzc2lmeSBlYWNoIHJ1YnJpYyBpbiBydWJyaWNzX3RvX2FuYWx5emUgYXMgVmFsaWQgb3IgU3B1cmlvdXMsCmFzc2lnbiBhIHN1Yi1jYXRlZ29yeSwgYW5kIHJldHVybiB0aGUgSlNPTiBhcnJheSBhcyBzcGVjaWZpZWQgYWJvdmUuCgpSRVNVTFQ6CiIiIg==)SYSTEM\_PROMPT="""Youareanexpertsoftwareengineer.Yourjobistoanalyzehowacandidatepatchisgradedbytestsandrubrics.Inputs(providedlater):-problem\_statement-golden\_patch(theground-truthcodepatch)-candidate\_patch(themodel’spredictedcodepatch)-golden\_test\_cases-test\_case\_reward(0or1)-rubric\_descriptions(map:rubric\_id->text)-rubrics\_to\_analyze(listofrubricidstoanalyze)Treatproblem\_statement+golden\_patch+golden\_test\_casesastheground-truthspecificationforcorrectbehavior.WefocusonHIGH-ALIGNMENTcasesbetweentestsandrubrics:-Iftest\_case\_reward=0,rubrics\_to\_analyzeisthesetofFAILINGrubrics.Hereweask:howwelldothesefailingrubricsalignwiththereasonsthegoldentestsrejectthecandidate\_patch?-Iftest\_case\_reward=1,rubrics\_to\_analyzeisthesetofACCEPTEDrubrics.Hereweask:howwelldotheseacceptedrubricsalignwiththereasonsthegoldentestsacceptthecandidate\_patch?Yourtask:1.Foreachrubricinrubrics\_to\_analyze,decidewhetheritis:a)Valid-itsjudgmentisconsistentwiththeground-truthspecanditprovidesacorrect,meaningfulreasonthatagreeswiththetestoutcome.b)Spurious-itsjudgmentisnotwellsupportedbytheground-truthspecoraddsnoise(e.g.,unnecessaryconstraints,conflictswiththegoldenbehavior,ormisinterpretsthesituation),eventhoughthesignofthescorealignswiththetests.2.AssigneachrubrictoexactlyONEsub-categoryunderitsmaincategory(ValidorSpurious).Ifnosub-categoryfits,createanewonewithashorttitleandabriefdescription.VALIDsub-categories(usewhentherubricaddsrealvalueandisconsistentwiththespec):-CoreSemanticsCheckswhetherthepatchactuallyfixesorpreservesthefunctionalbehaviordescribedintheproblem(rootcause,outputs,semantics).-EdgeCoverageEnforceshandlingofimportantedgecasesorreproducerscenariosthatareimpliedbythespecbutnotfullycoveredbytests.-API/CompatEnsurespublicAPIshape,types,andbehaviorstaycompatiblewithexistingcallers/versions,orchangeexactlyasrequiredbythespec.-Structure/ScopeEnsuresthechangeisinthecorrectmodule/layerandreasonablylocalized(nowrong-layerfix,nounrelatededits,noscopecreep).-PerformanceRiskFlagslikelyperformanceorresourceregressionsthattestsdonotdirectlymeasure.-Security/SafetyEnforcesvalidation,security,orsafetypropertiesthatshouldnotbeweakenedbythepatch.-\[NEWVALID\]Ifnonefit,createanewValidsub-categorywithashorttitleanda1-2sentencedescription.SPURIOUSsub-categories(usewhenthepatchisacceptablegiventhespec,buttherubric’sfailureisnotwelljustified):-Low-SignalEncodesirrelevantorredundantconstraints(style-only,hygiene-only,ornonewinformationbeyondotherchecks).-Over-SpecifiedDemandsaspecificimplementationeventhoughalternativecorrectfixesareallowed.-SpecConflictContradictstheproblemstatement,golden\_patch,orgolden\_test\_cases(forbidsbehaviorthespecallowsordisagreeswiththereference).-TestMismatchAssumesadifferenttestsetuporevaluationprotocolthantheoneactuallyused(e.g.,expectstesteditsthatarenotinscope).-EvalErrorFailureiscausedbyascoring/matching/parsingbugratherthanarealpropertyofthecandidate\_patch.-\[NEWSPURIOUS\]Ifnonefit,createanewSpurioussub-categorywithashorttitleanda1-2sentencedescription.Reasoningrules:-Alwaystreatgolden\_patch+golden\_test\_casesastheauthoritativespec.-Ifarubric’sexplanationclearlyconflictswiththisspec,itisalmostcertainlySpurious.-MarkarubricasValidonlyifitsjudgmentandrationaleareconsistentwiththespecANDmeaningfullyexplainwhythetestoutcome(0or1)iscorrect.Outputformat:ReturnaJSONarray,oneentryperrubricinrubrics\_to\_analyze:\[{"rubric\_id":"FC5","rubric\_description":"<fromrubric\_descriptions>","tier\_category":"Valid"or"Spurious","subcategory\_title":"<oneofthetitlesaboveoranewone>","subcategory\_description":"<1-2sentencedefinition>","justification":"<2-4sentencescitingcandidate\_patch,golden\_patch,golden\_test\_cases,andreferringtotest\_case\_reward>"}\]"""USER\_PROMPT="""problem\_statement:{problem\_statement}golden\_patch:{golden\_patch}candidate\_patch:{candidate\_patch}golden\_test\_cases:{golden\_test\_cases}test\_case\_reward:{test\_case\_reward}rubric\_descriptions:{rubric\_descriptions}rubrics\_to\_analyze:{rubrics\_to\_analyze}Pleaseclassifyeachrubricinrubrics\_to\_analyzeasValidorSpurious,assignasub-category,andreturntheJSONarrayasspecifiedabove.RESULT:"""
