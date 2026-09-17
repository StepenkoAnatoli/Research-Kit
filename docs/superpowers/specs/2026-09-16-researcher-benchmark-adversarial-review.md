# Adversarial Review of the Researcher Benchmark Specification

**Status:** Suggestions only; the benchmark specification has not been modified by this review  
**Date:** 2026-09-16  
**Reviewed document:** `docs/superpowers/specs/2026-09-16-researcher-benchmark-design.md`

## Verdict

The specification is reviewable and substantially complete: it defines task and run templates, separates correctness/support/coverage/cost, protects critical errors with hard failures, and supplies explicit scoring sheets. It should not be approved unchanged. The pass hierarchy permits different interpretations, the live median rule can admit failing repetitions, candidate-caused invalidation can be gamed, and the useful-finding denominator rewards optional claim production.

The following are specification changes to consider, not edits made by this review.

## Must resolve before approval

| ID | Area | Ambiguity or exploit | Consequence | Suggested rule |
|---|---|---|---|---|
| B-01 | Sections 14.1–14.3 | Per-task pass is defined, but the frozen and live release gates do not explicitly require every run/task to pass Section 14.1. | A low-scoring task can be hidden by weighted suite scores while the release still appears to satisfy Section 14.2. | Define `run_pass`, `task_pass`, and `suite_pass`. Require every required run to pass Section 14.1, then apply aggregate thresholds as an additional gate. |
| B-02 | Section 14.3 | Live quality is judged by medians across repetitions, while only hard failures are prohibited per repetition. | One of three repetitions may miss correctness, support, coverage, or outcome classification and still pass. | Require every valid live repetition to meet per-run minima and the correct outcome; retain medians only as aggregate/reporting thresholds. |
| B-03 | Sections 4.3 and 14.2 | A frozen task has cold and warm runs, but Section 14.1 speaks of a singular task result and does not say whether both runs are independently scored. | A warm factual regression or low score can be ignored if only the cold run is treated as the task result. | Score cold and warm as separate runs. Both must pass; the task passes only if both pass and the required equivalence/cache conditions hold. |
| B-04 | Sections 11.3, 13, and 16 | Any frozen network attempt “invalidates” the run, even when the candidate initiated it. Cost-attribution failure is also invalid without assigning responsibility. | A weak candidate can deliberately request network access or obscure metering to convert a likely failure into an unlimited rerun. | Candidate-initiated prohibited access or candidate-caused loss of required accounting is a hard failure. Only operator/fixture exposure or meter failure outside candidate control is invalid. Use observable behavior, not inferred intent. |
| B-05 | Sections 9.3, 10.7, and 10.8 | Accepted extra claims increase useful findings and reduce credits/useful finding without increasing required recall. | A candidate can pad with many easy, supported facts relevant only loosely to the build intent and appear more efficient. | Make the release metric `credits / accepted required units`, where required claims and correctly applied required constraints are fixed before execution. Report extras separately; optionally cap extras at one denominator unit per task. |
| B-06 | Sections 9.3 and 10.3 | The weight of unmatched/extra assertions is not defined. | Graders can assign low weights to wrong extras or high weights to correct extras, changing assertion accuracy and the harmonic mean. | Gold-lock an assertion-weight policy: matched claims inherit gold weight; extra claims receive a fixed weight of 1 unless adjudication classifies a decision-changing extra as 2 or 3 under recorded criteria. |
| B-07 | Sections 9.1 and 9.3 | “Graders atomize compound sentences,” but no deterministic rule handles qualifiers, nested recommendations, tables, or one sentence supported by several sources. | Over-splitting increases error opportunities; under-splitting hides a false subclaim inside a correct statement. | Add atomization examples and a rule: split whenever a clause can independently differ in truth, scope, source, criticality, or downstream effect. Freeze canonical gold units; adjudicate candidate-only units. |
| B-08 | Sections 6, 7, and 12.2 | Per-task weighted Cohen’s kappa is required without a weight matrix, label set, treatment of missing matches, or minimum sample size. Small tasks may yield undefined kappa. | Pilot approval depends on a statistic two reviewers cannot reproduce. | Define the ordinal weights and exact observations included. Calculate kappa over a pooled calibration batch, not a tiny single task; require raw agreement and zero critical disagreement per task. |
| B-09 | Sections 6 and 12.2 | “Two people agree” and “two independent graders” do not settle whether the task author may be one gold reviewer or grader, or whether two gold reviewers are in addition to the author. | Self-authored assumptions can survive as gold and inflate grader agreement. | Require two gold approvals, at least one from a non-author; neither task author nor gold reviewers grade that task’s release output. State the minimum number of distinct people. |
| B-10 | Sections 13 and 14 | Timeout, “unbounded hang,” and “valid bounded refusal” have no numeric task limit or required refusal schema. | Operators can stop identical runs at different times and reach different verdicts. | Put wall-clock, idle-output, process-cleanup, and refusal-artifact limits in each task; define whether timeout includes transport waits and retries. |
| B-11 | Sections 4.2 and 18.1 | The specification says source change during the live window invalidates a run but does not define how change is detected or which bytes/claims matter. | Drift may be noticed selectively after an unfavorable candidate result. | Hash/record the locked source capture and recheck it immediately before and after each run. Predetermine material locators; only a change affecting gold evidence invalidates, with both captures retained. |
| B-12 | Sections 6, 7, 13, and 15 | Required adversarial patterns include refreshed evidence invalidating review and preserving a reviewed handoff, but allowed outcomes lack `review-required` or `invalidated`. | Authors must mislabel a review-state task as `known-unknown`, `contradiction`, or `no-go`. | Add `review-required` as an outcome, or explicitly define its mapping and scoring under the existing four outcomes. Apply the same vocabulary as the researcher readiness model. |
| B-13 | Sections 10.8 and 14.4 | The first accepted release must pass the cost gate, but its accepted baseline is created by that same release. | Baseline acceptance is circular. | For release 1, pass only predeclared task caps and record a provisional observed baseline; freeze it after independent review. Regression ratios apply starting with release 2. |
| B-14 | Sections 4.3 and 14.2 | “Eligible cache hit” and allowed warm-run state are undefined. | A warm run can reuse candidate conclusions, generated briefs, or stale task artifacts rather than only raw eligible captures. | Specify the exact cold artifacts copied into warm state, their age/hash eligibility, and files that must be deleted. Warm execution receives cache/provenance only, never prior synthesis or answer artifacts. |

## Additional grading ambiguities

| ID | Issue | Suggested clarification |
|---|---|---|
| B-15 | Critical assertions cannot be partially correct, but candidate assertions do not have an explicit criticality assignment process. | Criticality comes from matched gold. Candidate-only claims use a fixed rubric based on whether the claim could reverse feasibility, legality, safety, cost viability, or outcome; both graders must agree or adjudicate. |
| B-16 | A `not verifiable` critical assertion scores zero, but Section 13 says “incorrect critical claim” rather than “non-correct critical claim.” | State that any critical assertion whose accuracy is not 1.0 is a hard failure; unsupported critical claims independently fail on support. |
| B-17 | Citation authority allows 0.5 when primary evidence is unavailable, but “unavailable” and acceptable secondary source classes are not defined. | Require a recorded primary-access attempt or authoritative statement of unavailability, and gold-lock which secondary source types are acceptable for the task. |
| B-18 | Locator precision gives 0.5 for the correct page without defining a precise locator for structured JSON, CLI output, or dynamic pages. | Define media-specific locators: JSON Pointer, command plus output field, table/row label, heading/paragraph, or stable fixture byte/line span. |
| B-19 | Known unknowns may be supported by an attempted-access record “or authoritative limitation.” One arbitrary failed request can be mistaken for proof that evidence is unavailable. | Require attempts against all gold-listed obtainable routes, classified failures tied to the exact question, and a concrete verification step with owner and proceed/stop impact. |
| B-20 | Outcome classification does not say how to score a correct answer paired with the wrong label, or a correct no-go rationale labeled contradiction. | Outcome mismatch fails the run regardless of component scores; graders still score claims to preserve diagnostic value. Add canonical examples for all outcomes. |
| B-21 | Quality index is reported but has no pass threshold. | Label it diagnostic only, or define a threshold. Do not let reviewers infer an unofficial fourth quality gate. |
| B-22 | “Fabricated, modified, or inaccessible evidence” combines candidate misconduct with packaging/environment defects. | Use separate codes: candidate-generated/falsified evidence = fail; operator packaging loss = invalid; ordinary unsupported citation = scored and may hard-fail if critical. |
| B-23 | Exact incremental cost may be unavailable although request-level operation counts are present. | Define the authoritative meter, reconciliation tolerance, attribution window, and behavior when account-level unrelated traffic appears. Run isolation should prevent, not merely report, ambiguity. |
| B-24 | Source independence is discussed but not represented in the scoring sheets. | Add publisher/ownership-group IDs and an independence-required flag to gold claims. Multiple pages in one ownership group count as one source. |
| B-25 | The specification bans benchmark tasks from prompts/tuning data but does not define storage separation or leak detection. | Keep gold outside the candidate checkout/process ACL, publish only candidate-visible packages, rotate leaked tasks, and record benchmark access in the run manifest. |

## Gaming scenarios the pilot must attempt

1. Emit only the easiest required claim and rely on high assertion accuracy.
2. Add twenty correct but low-value facts to reduce credits per useful finding.
3. Split one fact into many near-duplicates with slightly different scope labels.
4. Cite an official page that mentions the subject but does not entail the number or conclusion.
5. Cite two URLs owned by one publisher as independent corroboration.
6. Deliberately attempt forbidden network access on a frozen task to seek `invalid` rather than `fail`.
7. Omit cost logs or crash the meter after producing a strong answer.
8. Use the prior cold brief during the warm run while issuing no collection requests.
9. Label an unsupported answer `inference` or `known-unknown` to avoid factual grading.
10. Produce an extremely hedged answer with every option mentioned but no operative decision.
11. Exploit a live source edit after seeing candidate output to request invalidation.
12. Cite a valid hash and precise locator from a source that is authoritative for a different scope, plan, version, or region.

The benchmark should not enter `locked` until two graders apply the clarified rules to these pilot outputs and reach the required agreement.

## Proposed unambiguous release hierarchy

This is a suggested normalization of the existing intent:

1. **Run validity:** environment and gold are usable. Candidate-caused protocol violations are failures, not invalidations.
2. **Run pass:** no hard failure; all Section 14.1 component, outcome, artifact, and cost requirements pass.
3. **Task pass:** every required condition run passes; frozen cold/warm equivalence or live repetition requirements also pass.
4. **Track pass:** every task passes, then the weighted track thresholds pass.
5. **Cost pass:** quality already passed; absolute caps and applicable post-baseline regression limits pass.
6. **Release pass:** frozen, live, and cost tracks pass. Any unresolved invalid run yields `INCOMPLETE`; any valid failed run yields `FAIL`.

No benchmark implementation, gold creation, live retrieval, or paid run is authorized by this review.

