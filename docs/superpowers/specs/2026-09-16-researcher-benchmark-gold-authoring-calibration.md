# Researcher benchmark gold-authoring and grader-calibration packet

**Status:** Authoring-ready packet; no fixtures or paid collection created  
**Packet version:** 1.0.0  
**Governing specification:** `2026-09-16-researcher-benchmark-design.md` v1.0.0  
**Task inventory:** `2026-09-16-researcher-benchmark-task-outlines.md` v1.0.0
**Materialized blank worksheets:** [`2026-09-16-researcher-benchmark-gold-worksheets-v1.0/`](./2026-09-16-researcher-benchmark-gold-worksheets-v1.0/)
**Expanded task cards:** `2026-09-16-researcher-benchmark-expanded-task-calibration-packets.md` v1.0.0  
**Audience:** gold authors, independent gold reviewers, graders, adjudicators, and release reviewers

**Trap adjudication matrix:** `2026-09-16-researcher-benchmark-calibration-adjudication-matrix.md` v1.0.0 (one expected claim/constraint/hard-failure row for every `TASK-T` calibration trap)
**Gold-lock projection gate:** [`2026-09-16-researcher-benchmark-gold-lock-migration-gate.md`](./2026-09-16-researcher-benchmark-gold-lock-migration-gate.md) (`GL-1`, required before R29-06 promotion)

## 1. Purpose and boundary

This packet is the controlled worksheet for turning the 24 approved task outlines into reviewable gold packages and for calibrating graders before any candidate run. It defines what an author must record, what two independent reviewers must challenge, and what evidence is required before a task is locked.

This is documentation only. It does not implement a runner, fixtures, transport calls, live credentials, source captures, or calibration outputs. It must not invoke the researcher, collect pages, or spend credits. Source-dependent values remain author-owned fields until the fixture or live-source review phase.

The governing benchmark specification wins if this packet appears to conflict with it. This packet adds authoring controls; it does not change task count, scoring, pass thresholds, role separation, or frozen/live policy.

## 2. Package boundaries and role separation

Each task is released as two separately permissioned records with a shared task ID:

| Record | Candidate may see | Grader/reviewer may see | Lock rule |
|---|---|---|---|
| Prompt package | prompt, allowed tools, output contract, time/cost cap, visible track rules | same plus the task ID | immutable after candidate pilot begins |
| Gold package | never | claims, constraints, source manifest, outcome, traps, calibration cards, hashes | two reviewer approvals plus adjudicator if needed |

The author, gold reviewer A, gold reviewer B, grader A, and grader B are five distinct people for a task. A person may not review or grade a package they authored. The adjudicator is distinct from the two graders and resolves only recorded disagreements. An automated grader may calculate arithmetic, but it cannot decide truth, scope, or whether an unknown is honest.

The package owner records the identities and timestamps in an access-controlled ledger. Candidate-visible exports are checked for absence of gold fields before release.

## 3. Gold package schema

Every task gets one gold record with these fields. Blank source-dependent fields are not an approval; the author completes them from the sealed fixture or the approved live-source review, then reviewers sign.

| Field | Required content | Validation |
|---|---|---|
| `task_id` | One of ST-01 through AE-04 | Exact match to the outline |
| `track` | Frozen or live | 20 frozen and 4 live overall |
| `category` | Source tracing, version operations, cost and quota, unknown handling, constraint compliance, or adversarial evidence | Four tasks in each category |
| `difficulty` | Basic, intermediate, or adversarial | Overall 6/12/6 |
| `prompt_hash` | Hash of candidate-visible prompt and output contract | Recomputed at lock and run time |
| `gold_version` | Monotone semantic version | Changes require re-review |
| `expected_outcome` | Answered, contradiction, known-unknown, no-go, or review-required | Must be justified by a decisive condition |
| `required_claims` | Ordered atomic assertions, each with ID, kind, weight, owner group, locator, and acceptance text | Fixed denominator is the sum of required weights |
| `required_constraints` | Output/safety/provenance conditions, with severity and observable test | Critical constraints cannot be waived by extra prose |
| `source_manifest` | Approved source identifiers, authority tier, retrieval window, and locator policy | Every factual claim has a checkable source or an explicit unknown procedure |
| `disallowed_claims` | Predictable unsupported, stale, wrong-scope, or fabricated assertions | Used for hard-failure review, not hidden trick questions |
| `adversarial_elements` | The tempting shortcut and the decisive evidence that defeats it | Must be observable from the task input |
| `cost_cap` and `time_cap` | Numeric cap and measurement unit | Same meter as the governing specification |
| `warm_manifest` | Prior-synthesis fields allowed in warm runs; no new facts | Warm run cannot gain information unavailable in the manifest |
| `review_log` | Author, two reviews, adjudication, changes, dates, and rationale | No unresolved critical disagreement |
| `lock_hashes` | Hashes for prompt, gold, source manifest, and warm manifest | Locked only after all gates pass |

## 4. Authoring rules

### 4.1 Atomic claims and fixed scoring

Split a claim whenever its truth, scope, source, criticality, or scoring effect could change independently. A claim that bundles “supports pagination, returns a cursor, and preserves ordering” becomes three claim IDs. Record one of three kinds:

* **Fact:** directly supported by an approved source or fixture.
* **Inference:** a bounded conclusion that cites its premises and labels uncertainty.
* **Decision:** the recommended action or outcome, tied to the governing constraints.

Each required claim has weight 1, 2, or 3. Weight 3 is reserved for a safety, legality, outcome, or decisive contradiction claim. The denominator is fixed at lock as the sum of required claim weights. Extra claims never raise the score and may trigger a hard failure when they contradict a required claim or invent authority. Candidate-only assertions, including a correctly scoped statement that the fact cannot be obtained, have weight 1 unless the gold record explicitly makes the unknown the decisive outcome.

### 4.2 Evidence and locators

Use the smallest locator that another grader can replay: section heading plus table row, stable JSON path, command plus relevant output line, or fixture object path. A URL alone is insufficient. Record authority tier P, S, or L; only P supports a required fact unless the gold package explicitly marks a secondary-source exception and its reason.

For each claim record `source_id`, retrieval date, source tier, locator, scope, and freshness rule. If access is blocked, record the exact blocked condition and the day-one verification step; the claim then supports a known-unknown outcome rather than an invented value. Partial captures cannot close a decisive unknown unless the omitted material is explicitly shown to be irrelevant.

### 4.3 Outcomes

Use **answered** when the required answer is obtainable and all decisive constraints can be satisfied. Use **contradiction** when authoritative sources disagree materially and the conflict itself is the answer. Use **known-unknown** when the fact is required but unavailable for a documented access reason, with a verification plan. Use **no-go** when a constraint or legality/cost condition makes the requested action impermissible or infeasible. Use **review-required** only when the evidence is internally inconsistent, materially drifted, or requires human authority not represented in the task.

The author names the single decisive condition and at least one near-miss that must not change the outcome. “More research” is not a pass criterion.

### 4.4 Constraints and anti-gaming controls

Record output-shape, provenance, safety, cost, freshness, and scope constraints separately. A response fails a critical constraint even when its prose is fluent. Do not reward citations that do not support the adjacent claim, multiple URLs for one publisher as independent corroboration, or a long answer that hides an omission. The grader marks padding, unsupported specificity, source laundering, and scope drift in the disallowed-claims list.

### 4.5 Scoring anchor

The grader uses the governing specification’s arithmetic; this packet does not introduce a second score. Required-claim recall, assertion accuracy, and constraint coverage use unrounded values and the fixed gold weights:

```text
required_claim_recall = sum(gold claim weight × accuracy value) / sum(all gold claim weights)
assertion_accuracy = sum(assertion weight × accuracy value) / sum(all material assertion weights)
answer_correctness = 2 × required_claim_recall × assertion_accuracy / (required_claim_recall + assertion_accuracy)
constraint_coverage = sum(constraint weight × disposition value) / sum(all constraint weights)
quality_index = 0.45 × answer_correctness + 0.30 × citation_support + 0.25 × constraint_coverage
```

The harmonic mean is 0 when both inputs are 0. Citation support is the weighted mean of entailment or reasoning support (50%), claim-specific authority (25%), retrievability and provenance (15%), and locator precision (10%). Retrievability is binary. A required claim is an accepted required unit only when its accuracy is 1.0, support is at least 0.85, and all gold scope, version, date, and region qualifiers are present. A required constraint is accepted only at disposition 1.0 with its applying assertion supported at least 0.85. Candidate-only assertions have weight 1 and never increase the required-unit denominator. If no required unit is accepted, cost per accepted required unit is infinity, even at zero external cost.

For a known-unknown unit, the candidate must attempt every allowed primary route or cite an authoritative limitation, tie each failure to the question, state downstream impact, name a verification step and responsible role, and state whether work stops or may proceed conditionally. A critical assertion or constraint cannot pass with a partial value.

## 5. Author worksheet (one per task)

Copy this worksheet into the gold workspace. It is a template, not a fixture.

### Identity and lock intent

| Field | Entry |
|---|---|
| Task ID and outline revision | Author records before lock |
| Track/category/difficulty | Author records before lock |
| Expected outcome and decisive condition | Author records before lock |
| Near-miss that must not change outcome | Author records before lock |
| Candidate output contract | Author records before lock |
| Time/cost cap and invalid-environment rule | Author records before lock |

### Required claims

| Claim ID | Kind | Atomic acceptance text | Weight | Owner group | Source ID and locator | Critical? |
|---|---|---|---:|---|---|---|
| C-01 | Fact, inference, or decision | Author records before lock | 1, 2, or 3 | Author records before lock | Author records before lock | Yes or no |
| C-02 | Fact, inference, or decision | Author records before lock | 1, 2, or 3 | Author records before lock | Author records before lock | Yes or no |
| C-03 | Fact, inference, or decision | Author records before lock | 1, 2, or 3 | Author records before lock | Author records before lock | Yes or no |

Add rows only when each row remains independently gradable. Lock the denominator after the final row is approved.

### Required constraints

| Constraint ID | Observable requirement | Severity | Failure classification | Test/locator |
|---|---|---|---|---|
| K-01 | Author records before lock | Critical or material | Hard failure or review-required | Author records before lock |
| K-02 | Author records before lock | Critical or material | Hard failure or review-required | Author records before lock |
| K-03 | Author records before lock | Critical or material | Hard failure or review-required | Author records before lock |

### Source, unknown, and adversarial record

| Item | Entry |
|---|---|
| Source manifest and authority rationale | Author records before lock |
| Blocked-access condition and verification step | Author records before lock, or “not applicable” with reason |
| Partial-capture boundary | Author records before lock, or “not applicable” with reason |
| Tempting shortcut | Author records before lock |
| Decisive evidence against shortcut | Author records before lock |
| Disallowed assertions | Author records before lock |

## 6. Independent gold review sheet

Reviewer A and reviewer B complete separate copies before seeing each other’s comments.

| Check | Pass condition | Reviewer result and evidence |
|---|---|---|
| Traceability | Every required claim traces to an approved source/fixture locator | Record claim IDs and locators |
| Atomicity | No row contains independently changing facts or outcomes | Record any split required |
| Denominator | Weights are justified and fixed; extras cannot improve efficiency | Record total and rationale |
| Outcome | Decisive condition and near-miss produce the stated outcome | Record replay result |
| Constraint severity | Critical failures cannot be averaged away | Record each critical constraint |
| Unknown handling | Blocked or omitted evidence is labeled, not guessed | Record the exact verification step |
| Adversarial robustness | Shortcut, stale source, scope trap, or contradiction is observable | Record defeating evidence |
| Candidate secrecy | No gold fact leaks into prompt-visible material | Record export check |
| Cost/time realism | Caps and meters are executable and non-ambiguous | Record units and cap |
| Drift policy | Freshness window and re-lock trigger are stated | Record trigger |

Review result is **approve**, **approve with non-critical edit**, or **reject**. Any disagreement about a critical claim, outcome, source authority, or hard-failure rule goes to adjudication; it is not silently averaged.

## 7. Grader sheet

Grade each independent candidate output without seeing the other grader’s sheet.

### Claim and constraint scoring

| Claim or assertion ID | Gold match | Criticality | Weight | Accuracy label/value | Citation IDs and ownership groups | Entailment | Authority | Retrievable | Locator | Support score | Required unit accepted? | Reviewer evidence |
|---|---|---|---:|---|---|---:|---:|---:|---:|---:|---|---|
| A-01 | G-ID or extra useful | Critical, major, or supporting | Gold weight or 1 for extra | Correct 1, partial 0.5, incorrect/not verifiable 0 | E-IDs and group IDs | 0, 0.5, or 1 | 0, 0.5, or 1 | 0 or 1 | 0, 0.5, or 1 | Formula result | Yes, no, or not applicable | Quote, locator, and short rationale |

Use 0.5 only for a materially partial claim with the correct scope and direction and no missing critical qualifier. A claim with fabricated precision, unsupported authority, or a wrong scope is 0. A contradictory extra assertion is a hard failure when it affects a critical claim or the expected outcome. Record missing citations separately from wrong facts; do not infer correctness from fluent prose. Several URLs from one ownership group count as one group when independent corroboration is required.

### Outcome and hard-failure scoring

| Check | Result | Evidence |
|---|---|---|
| Expected outcome selected | Correct, incorrect, or review-required | Candidate field and gold decisive condition |
| Critical constraint K-ID | Satisfied, violated, or not applicable | Observable output evidence |
| Unsupported or fabricated source | None, present, or uncertain | Source check |
| Scope/freshness violation | None, present, or uncertain | Locator and date check |
| Cost/time cap | Within cap, exceeded, or invalid environment | Meter record |
| Environment validity | Valid run or invalid environment | Runner diagnostic |

Apply the governing specification’s hard-failure precedence before computing the percentage. A valid candidate failure remains a candidate failure; an invalid environment invalidates the run and is never converted into a zero.

## 8. Calibration protocol

Calibration occurs after both gold reviews and before candidate execution. It uses authored calibration cases, not production fixtures or live collection. No case is released until its expected labels and rationale are locked.

### 8.1 Calibration case set

For every task, author at least two cases: one conforming answer and one deliberately incomplete, incorrect, or gaming answer. Across the 24 tasks include all of these archetypes at least twice:

| Archetype | Intended grader distinction |
|---|---|
| Conforming | All required claims, constraints, outcome, and locators satisfy gold |
| Omission | Fluent answer omits one required claim or decisive constraint |
| Wrong scope | Fact is true elsewhere but not for the requested plan, region, version, or date |
| Unsupported specificity | Exact number, limit, or date is asserted without authority |
| Honest unknown | Access block is explicit, bounded, and paired with verification |
| Gaming/padding | Extra citations, repeated claims, or verbosity attempts to improve score |
| Contradiction | Two authoritative sources conflict and the candidate must preserve the conflict |
| Drift | Source freshness or warm-manifest rules change the valid outcome |

These are authored response descriptions and expected labels; they are not implemented fixtures. A calibration case must state the claim IDs it exercises, the expected 0/0.5/1 labels, any hard failure, and the reason a reasonable grader should not choose another label.

### 8.1a Calibration case card

Use one card per authored response description. The response text may be stored in the restricted calibration workspace; this packet does not create it.

| Field | Entry |
|---|---|
| Case ID, task ID, and gold version | Author records before calibration |
| Archetype | Conforming, omission, wrong scope, unsupported specificity, honest unknown, gaming/padding, contradiction, or drift |
| Candidate response summary | Author records the observable behavior without adding hidden facts |
| Exercised claim and constraint IDs | Author records exact IDs |
| Expected accuracy/disposition labels | One 0, 0.5, or 1 value per exercised item |
| Expected outcome and hard-failure result | Author records before graders see the case |
| Decisive evidence and alternate-label rejection | Short rationale with gold locators |
| Candidate-visible versus grader-only fields | Export check result |

If a case is intended to test an unknown, the expected answer includes the bounded access failure and verification step. If it is intended to test gaming, repeated or irrelevant citations are scored as extras or disallowed assertions; they never change the fixed denominator.

### 8.2 Agreement batch and thresholds

Each grader independently scores a pooled batch of at least 30 claim/constraint observations spanning at least four tasks. The batch must contain at least two observations of each label 0, 0.5, and 1. Record the categories and include outcome or hard-failure decisions whenever those decisions are exercised by the selected task pilots.

Map accuracy and disposition values to ordinal levels 0, 1, and 2, with incorrect and not verifiable both mapped to 0. Compute weighted Cohen’s kappa with linear disagreement weights `1 - |i-j|/2`. Calibration passes only when:

* weighted kappa is at least 0.80;
* raw four-label accuracy agreement is reported separately;
* there is no disagreement about assertion boundaries that changes a score, critical assertion correctness, critical-constraint application, or expected outcome; and
* the two graders’ component scores differ by no more than 5 percentage points on every calibration task.

If kappa is undefined because the batch lacks label variation, the pilot fails and cases must be added. If any other agreement condition fails, revise the rubric wording or gold record, rerun the full batch, and retain the failed batch with its adjudication. Do not select an easier subset. A third grader may be used for diagnosis, but cannot replace the two required independent graders.

### 8.3 Calibration record

| Field | Entry |
|---|---|
| Batch ID and packet version | Author records before lock |
| Tasks/categories represented | Author records before lock |
| Observation count and label counts | Author records before lock |
| Raw agreement | Computed from all observations |
| Weighted Cohen kappa | Computed with 0/0.5/1 ordering |
| Critical disagreements | List claim/constraint IDs and adjudication |
| Per-task score deltas | Computed before adjudication and after |
| Rubric edits triggered | Exact wording and affected gold IDs |
| Final calibration decision | Pass or fail with reviewer signatures |

## 9. Twenty-four-task gold intake register

The register fixes the authoring focus without inventing source facts. “Gold themes” are the required dimensions to resolve from approved sources; they are not fixture contents.

| ID | Track/category/difficulty | Provisional outcome | Gold themes and critical dimensions | Calibration focus |
|---|---|---|---|---|
| ST-01 | Frozen stable technical facts basic | Answered | Cursor field, page-size behavior, termination, deduplication, ordering caveat, response locator | Omission of termination or unsupported ordering |
| ST-02 | Frozen stable technical facts basic | Answered | Exit-code classes, stdout/stderr contract, retry behavior, runtime/access conditions | Wrong scope between documented and observed behavior |
| ST-03 | Frozen stable technical facts intermediate | Answered | Secret acquisition, raw-body preservation, signature algorithm/header/timestamp, replay and rotation controls | Unsupported specificity and security hard failure |
| ST-04 | Frozen stable technical facts intermediate | Answered | Bulk versus normal fields, alternate route, completeness and freshness boundary | False completeness from one route |
| VO-01 | Live volatile facts basic | Answered | Current credits, rate/concurrency limits, plan or team scope, effective date | Stale limit and citation padding |
| VO-02 | Live volatile facts basic | Answered | Minimum and current supported runtime, install versus execution distinction | Version/date scope error |
| VO-03 | Live volatile facts intermediate | Answered at gold lock | Region and plan support matrix, effective date, exception handling | Treating a missing row as universal support |
| VO-04 | Live volatile facts intermediate | No-go or answered per locked budget case | Price unit, included allowance, overage arithmetic, budget boundary and date | Arithmetic plus outcome precedence |
| CO-01 | Frozen contradictory sources intermediate | Answered | Version/date conflict, retry multiplication, controlling limit | Averaging incompatible versions |
| CO-02 | Frozen contradictory sources intermediate | Answered | Pricing unit, plan scope, included allowance, overage, controlling document | Unit conversion and source authority |
| CO-03 | Frozen contradictory sources adversarial | No-go | Terms or legality override marketing promise, prohibited use, safe alternative | Marketing citation cannot waive no-go |
| CO-04 | Frozen contradictory sources adversarial | Contradiction | Unresolved authoritative regional or plan conflict, conflict-preserving answer | Forced single-value gaming |
| UN-01 | Frozen unavailable evidence basic | Known-unknown | Login-walled schema, observable access block, verification step | Honest unknown versus hallucinated schema |
| UN-02 | Frozen unavailable evidence intermediate | No-go | Approval-gated export, absent permission, legal or operational boundary | “Ask later” cannot satisfy current request |
| UN-03 | Frozen unavailable evidence intermediate | Known-unknown | Dashboard-only quota, unavailable machine-readable field, verification plan | Unsupported number from UI glimpse |
| UN-04 | Frozen unavailable evidence adversarial | Known-unknown | All primary routes fail, bounded negative evidence, next verification step | Overclaiming universal absence |
| CC-01 | Frozen critical constraints basic | Answered | Least privilege, credential storage, rotation, logging and redaction | Security constraint is critical |
| CC-02 | Frozen critical constraints intermediate | No-go | Rate/concurrency/retry cost lower bound, cap, safe refusal condition | Extra work cannot beat infeasible cap |
| CC-03 | Frozen critical constraints adversarial | No-go | Redistribution or licensing prohibition, permitted alternative | Citation laundering and scope drift |
| CC-04 | Frozen critical constraints intermediate | No-go | Full export SLA, route limits, cap, escalation path | Promise versus measurable feasibility |
| AE-01 | Frozen adversarial evidence intermediate | Answered | Long partial capture versus shorter complete capture, decisive exception, completeness label | Length is not completeness |
| AE-02 | Frozen adversarial evidence adversarial | Answered | Lookalike host, ownership validation, redirect and authority checks | Domain similarity is not authority |
| AE-03 | Frozen adversarial evidence intermediate | Contradiction or review-required per review | Same-publisher false independence, stale metadata, contradiction handling | Citation count cannot create independence |
| AE-04 | Frozen adversarial evidence adversarial | Review-required | Refresh invalidates handoff, preserve prior evidence, re-lock trigger and history | Silent mutation of a released gold package |

Before lock, authors replace each provisional outcome with the outcome justified by the approved source/fixture review and record the exact decisive condition. If the replacement changes category balance, non-affirmative coverage, or frozen/live count, the packet returns to review rather than silently changing the benchmark.

## 10. Portfolio and release gates

The packet is ready for benchmark execution only when all gates below are recorded:

1. All 24 task IDs have a gold record, two independent reviews, and a lock hash.
2. Portfolio counts remain 20 frozen and 4 live, with category balance 4/4/4/4/4/4 and difficulty balance 6 basic, 12 intermediate, 6 adversarial.
3. At least eight tasks have a non-affirmative expected outcome; the current outline supplies eleven provisional non-affirmatives, which must be re-counted after source review.
4. Every universal dimension in the governing specification has an explicit owner task and locator: access/auth, rate limits, terms/legality, schema stability, freshness, cost at volume, runtime limits, and output obtainability.
5. No task has an unresolved critical gold disagreement, an unbounded unknown, a candidate-visible gold field, or a source-dependent value without a recorded source/fixture locator.
6. The calibration batch passes all thresholds in Section 8.2, and failed batches plus adjudications are retained.
7. Prompt, gold, source, and warm-manifest hashes are immutable for the release candidate. Any change increments the relevant version and reopens review.

The release reviewer signs a single statement: “All packet gates pass for benchmark specification v1.0.0; no fixtures or paid collection were created by this authoring step.”

## 11. Migration and rollback handoff

R29 in the dependency-correct repair plan consumes this packet after R28’s runner schema and role rules are locked. Gold authoring may proceed in task-disjoint lanes only after that gate. A task package is one revertable unit: revert removes its prompt/gold/review/calibration records without changing the runner or another task. Portfolio manifests and release hashes are updated in the same package as the task change. A failed calibration batch blocks R30; it does not justify changing the runner, scoring denominator, or live/frozen policy.

The release-review handoff is [`2026-09-16-researcher-benchmark-release-review-checklist.md`](./2026-09-16-researcher-benchmark-release-review-checklist.md). It is the normative reviewer checklist for promoting the 24 task packages: no task is `LOCKED` until its gold values, replayable locators, canonical hashes, role separation, and calibration agreement checks pass.
