# Researcher benchmark: expanded task and calibration packets

**Status:** Reviewable authoring bundle; source values intentionally unpopulated  
**Bundle version:** 1.0.0  
**Governing specification:** `2026-09-16-researcher-benchmark-design.md` v1.0.0  
**Authoring controls:** `2026-09-16-researcher-benchmark-gold-authoring-calibration.md` v1.0.0  
**Task inventory:** `2026-09-16-researcher-benchmark-task-outlines.md` v1.0.0

This bundle expands every outline into a reviewable task packet and a paired calibration packet. It supplies the questions, atomic-unit boundaries, evidence shapes, traps, and expected grading dispositions. It does not supply fixture values, URLs, captures, credentials, candidate outputs, or live-source results. Those are entered only by the task author during the sealed gold-lock process.

## How to use each packet

For each task, the author completes the candidate packet and gold packet in separate access-controlled records. Replace every “author locks” instruction with an exact value, source ID, locator, freshness rule, or fixture object path before review. Never put a required value or gold locator in the candidate-visible prompt.

Each task receives two authored calibration outputs:

* **`TASK-G` conforming:** every listed required unit is present, correctly scoped, supported, and the stated outcome is correct. Expected claim and constraint values are 1; no hard failure is present.
* **`TASK-T` targeted trap:** the packet’s named shortcut is taken. The named unit receives 0 unless the card says partial, the outcome or critical constraint is wrong as specified, and any marked hard failure is recorded. Extra prose never repairs the fixed denominator.

The grader records 0, 0.5, or 1 for each unit, four citation-support components for each material assertion, outcome, hard-failure status, and a short rationale for every 0 or 0.5. The gold author records exact values and locators before graders see either calibration output.

## Shared review fields

Every task record contains these fields, even when a field is “not applicable” with a reason:

| Field | Candidate-visible entry | Grader-only entry |
|---|---|---|
| Identity | Task ID, prompt, output contract, track, cap | Gold version, hashes, reviewers, source manifest |
| Evidence boundary | Allowed source classes and access limits | Exact source IDs, ownership groups, locators, retrieval/freshness rule |
| Required units | Questions the answer must resolve | Atomic claims and constraints with weights 1, 2, or 3 |
| Outcome | Allowed outcome vocabulary | Expected outcome, decisive condition, near-miss, stop/proceed rule |
| Calibration | No calibration content | Conforming and targeted-trap case cards, expected labels, rationale |
| Release controls | Time/cost meter and refusal behavior | Disallowed claims, hard-failure triggers, warm-manifest eligibility |

The task-level acceptance rule is exact: the candidate must satisfy every required run and track-specific condition from the governing specification. A valid failed run remains a failure; an invalid environment is rerun or marked incomplete. Gold lock requires two independent gold reviews and the calibration thresholds in the authoring packet.

## ST-01 — Complete a cursor-paginated export

**Metadata:** frozen; stable technical facts; basic; provisional outcome `answered`.

**Candidate packet**

* Objective: decide whether every record can be retrieved from the documented list API.
* Deliverable: traversal algorithm in prose or structured steps, terminal condition, deduplication rule, and documented ordering caveat.
* Evidence boundary: candidate-visible API reference and response examples only; no unlisted endpoint or inferred snapshot guarantee.
* Output contract: name each response field used, state the stop rule, identify the stable record key, and cite precise locators.

**Gold packet**

* Source shape: API reference, response schema, and pagination example with cursor and page-size fields. Author locks exact paths, ceiling, terminal response, key, and ordering wording.
* Required units: `ST-01-C1` cursor location and next-page interpretation (major); `ST-01-C2` page-size ceiling (major); `ST-01-C3` terminal condition (critical); `ST-01-C4` stable key and deduplication behavior (major); `ST-01-C5` ordering/snapshot boundary (supporting).
* Constraints: `ST-01-K1` no claim of snapshot consistency unless explicitly supported (critical); `ST-01-K2` output must distinguish complete traversal from first-page sampling (major).
* Decisive condition: author locks the exact terminal response and whether the result is complete. Near-miss: a first-page quick-start must not change the conclusion.

**Calibration packet**

* `ST-01-G`: supplies C1–C5, K1–K2, exact locators, and outcome `answered`.
* `ST-01-T`: copies the quick-start and omits C3, asserts snapshot consistency, and stops after one page. Expected C3=0, K1=0, K2=0; hard failure for a critical false assertion; outcome remains `answered` in gold but candidate fails.
* Grader focus: omission of terminal behavior, first-page padding, and unsupported ordering claims.

## ST-02 — Interpret CLI exit and error channels

**Metadata:** frozen; stable technical facts; basic; provisional outcome `answered`.

**Candidate packet**

* Objective: specify how an orchestrator distinguishes success, user refusal, retryable failure, and blocking failure for a documented CLI.
* Deliverable: status matrix covering exit status, stdout, stderr, retry decision, and operator action.
* Evidence boundary: command reference, exit-code table, and one version boundary; no inferred retry policy.
* Output contract: classify every named status and cite the owning reference field.

**Gold packet**

* Source shape: command reference, exit-code table, stdout/stderr examples, and version note. Author locks exact codes, channels, and version scope.
* Required units: `ST-02-C1` success classification (major); `ST-02-C2` refusal classification (major); `ST-02-C3` retryable classification and permitted retry behavior (critical); `ST-02-C4` blocking-failure classification (critical); `ST-02-C5` stdout/stderr ownership (supporting).
* Constraints: `ST-02-K1` nonzero cannot be treated as one undifferentiated class (major); `ST-02-K2` retry advice must not exceed documented behavior (critical).
* Decisive condition: author locks the version-specific status matrix. Near-miss: a prose guide saying “nonzero means failure” is not controlling.

**Calibration packet**

* `ST-02-G`: complete matrix with version-scoped citations and outcome `answered`.
* `ST-02-T`: maps every nonzero code to retry, ignores stderr, and uses the wrong version note. Expected C3=0, C4=0, C5=0, K1=0, K2=0; critical hard failure; candidate outcome fails.
* Grader focus: wrong scope between observed and documented behavior and invented retry semantics.

## ST-03 — Verify signed webhook deliveries

**Metadata:** frozen; stable technical facts; intermediate; provisional outcome `answered`.

**Candidate packet**

* Objective: provide a complete verification contract for incoming webhooks.
* Deliverable: ordered verification procedure covering secret retrieval, raw bytes, header, algorithm, timestamp/replay, and rotation.
* Evidence boundary: official webhook security reference and framework example; no secret value is requested.
* Output contract: verification must precede parsing, and every security decision needs an exact locator.

**Gold packet**

* Source shape: security reference, header schema, canonicalization example, replay rule, and rotation note. Author locks exact header, algorithm, raw-body rule, timestamp window, and rotation fallback.
* Required units: `ST-03-C1` secret acquisition and storage boundary (critical); `ST-03-C2` raw-body canonicalization (critical); `ST-03-C3` signature header and algorithm (critical); `ST-03-C4` timestamp/replay rule (critical); `ST-03-C5` rotation behavior (major).
* Constraints: `ST-03-K1` parsing before verification is prohibited (critical); `ST-03-K2` secrets must not be exposed in output (critical).
* Decisive condition: author locks the byte-level verification order and stale/replayed behavior. Near-miss: a framework parser that changes bytes must not pass.

**Calibration packet**

* `ST-03-G`: verifies raw bytes before parsing, handles replay and rotation, and returns `answered`.
* `ST-03-T`: parses JSON first, names an unsupported algorithm, and logs a secret. Expected C2=0, C3=0, K1=0, K2=0; critical security hard failure; candidate outcome fails.
* Grader focus: security-critical partial credit is not allowed and unsupported precision is a hard failure.

## ST-04 — Determine bulk-export field parity

**Metadata:** frozen; stable technical facts; intermediate; provisional outcome `answered`.

**Candidate packet**

* Objective: decide whether the bulk export contains every field required by a downstream migration and identify a supported alternate route.
* Deliverable: field-by-field parity result scoped to the bulk export, missing-field impact, and alternate route or limitation.
* Evidence boundary: API schema, export schema, and field-availability table; no inference from the normal API.
* Output contract: distinguish present, omitted, and unknown fields with precise locators.

**Gold packet**

* Source shape: normal API schema, bulk schema, and field-availability table with a deliberate mismatch. Author locks required field, export omission, supported route, and freshness.
* Required units: `ST-04-C1` required downstream fields (major); `ST-04-C2` bulk-export presence/omission (critical); `ST-04-C3` normal-API versus bulk scope (major); `ST-04-C4` supported alternate route or limitation (major).
* Constraints: `ST-04-K1` normal API evidence cannot be presented as bulk-export evidence (critical); `ST-04-K2` missing output must block the dependent migration or name a valid route (critical).
* Decisive condition: author locks the omitted field and supported remedy. Near-miss: broad API parity language must not override the export-specific table.

**Calibration packet**

* `ST-04-G`: identifies the omitted field, scopes it to bulk export, and names the supported route.
* `ST-04-T`: cites only normal API fields and declares bulk parity. Expected C2=0, C3=0, C4=0, K1=0, K2=0; critical hard failure; candidate outcome fails.
* Grader focus: false completeness from one route and scope laundering.

## VO-01 — Lock current free-tier quotas

**Metadata:** live; volatile facts; basic; outcome fixed at gold lock, normally `answered`.

**Candidate packet**

* Objective: report current included credits, request-rate limits, and concurrency for the named free plan.
* Deliverable: values with retrieval date, plan, region, and account/team scope; distinguish per-key from per-team limits.
* Evidence boundary: current owner pricing and limits pages captured within the seven-day window; snippets and older pages are not authority.
* Output contract: show source date and scope beside every value.

**Gold packet**

* Source shape: pricing page, limits page, plan/region matrix, and effective-date metadata. Author locks values, units, scope, and freshness window at gold lock.
* Required units: `VO-01-C1` included credit amount and unit (major); `VO-01-C2` request-rate limit (critical); `VO-01-C3` concurrency limit (critical); `VO-01-C4` plan/region/account scope (critical); `VO-01-C5` retrieval/effective date (major).
* Constraints: `VO-01-K1` current owner source required (major); `VO-01-K2` per-key and per-team limits must not be merged (critical).
* Decisive condition: author locks the current plan-scoped values. Near-miss: a stale value may be discussed only as non-controlling history.

**Calibration packet**

* `VO-01-G`: reports all values with scope and date, outcome `answered`.
* `VO-01-T`: uses an old page and combines per-key with per-team quotas. Expected C2=0, C3=0, C5=0, K1=0, K2=0; critical hard failure for wrong limit.
* Grader focus: stale facts, citation padding, and scope merging.

## VO-02 — Verify current supported runtime versions

**Metadata:** live; volatile facts; basic; outcome fixed at gold lock, normally `answered`.

**Candidate packet**

* Objective: decide whether the builder’s pinned runtime is currently supported by the vendor SDK and CLI.
* Deliverable: product/version-specific support decision, minimum runtime, supported range, and date.
* Evidence boundary: current install/reference pages and release metadata; installation success is not proof of support.
* Output contract: distinguish “installs” from “supported” and scope by product version.

**Gold packet**

* Source shape: install page, reference support matrix, and release metadata with one stale README. Author locks minimum, current range, product scope, and date.
* Required units: `VO-02-C1` pinned runtime value (major); `VO-02-C2` minimum supported runtime (critical); `VO-02-C3` supported range (critical); `VO-02-C4` SDK/CLI product scope (major); `VO-02-C5` current date/version boundary (major).
* Constraints: `VO-02-K1` installability cannot substitute for support (critical); `VO-02-K2` stale documentation must be labeled non-controlling (major).
* Decisive condition: author locks support status for the named product/version. Near-miss: a successful install with an unsupported runtime remains unsupported.

**Calibration packet**

* `VO-02-G`: uses current support metadata and states the scoped decision.
* `VO-02-T`: cites the stale README, equates install success with support, and omits product scope. Expected C2=0, C4=0, C5=0, K1=0, K2=0; critical hard failure if support decision is false.
* Grader focus: version/date scope and install-versus-support distinction.

## VO-03 — Confirm regional feature availability

**Metadata:** live; volatile facts; intermediate; outcome fixed at gold lock.

**Candidate packet**

* Objective: determine whether the named feature is available for the specified plan and deployment region on the lock date.
* Deliverable: availability state, plan, region, date, and any exception or rollout condition.
* Evidence boundary: current region matrix, plan matrix, and release-status page; global marketing copy is insufficient.
* Output contract: state the exact scope and distinguish unavailable, limited, and available.

**Gold packet**

* Source shape: region matrix, plan matrix, release-status page, and a global page omitting the exception. Author locks region, plan, state, and date.
* Required units: `VO-03-C1` named feature (supporting); `VO-03-C2` plan scope (critical); `VO-03-C3` region scope (critical); `VO-03-C4` availability state and exception (critical); `VO-03-C5` lock date (major).
* Constraints: `VO-03-K1` global availability cannot override a regional exception (critical); `VO-03-K2` missing matrix row cannot be treated as support (major).
* Decisive condition: author locks plan-region availability. Near-miss: a global marketing page without the region row.

**Calibration packet**

* `VO-03-G`: states plan, region, state, date, and exception.
* `VO-03-T`: reports globally available, omits plan/region, and treats a missing row as support. Expected C2=0, C3=0, C4=0, K1=0, K2=0; critical hard failure.
* Grader focus: omitted scope and false affirmative from absence of evidence.

## VO-04 — Price a fixed production workload

**Metadata:** live; volatile facts; intermediate; outcome `answered` or `no-go` fixed at gold lock from the candidate-visible budget.

**Candidate packet**

* Objective: calculate monthly external cost for the fixed operation mix and decide whether it fits the stated budget.
* Deliverable: auditable operation-by-operation arithmetic, included allowance/overage treatment, tax/currency scope, uncertainty, and outcome.
* Evidence boundary: current official price units and allowance rules; no hidden account assumptions.
* Output contract: expose units and intermediate calculations, then state `answered` or `no-go`.

**Gold packet**

* Source shape: current price table, included allowance, overage rule, currency/tax note, and explicit workload inputs. Author locks all arithmetic inputs and budget boundary.
* Required units: `VO-04-C1` operation mix and quantities (major); `VO-04-C2` price unit mapping (critical); `VO-04-C3` included allowance and eligibility (critical); `VO-04-C4` overage arithmetic (critical); `VO-04-C5` budget outcome and uncertainty (critical).
* Constraints: `VO-04-K1` no hidden unit conversion (major); `VO-04-K2` budget decision must follow auditable arithmetic (critical).
* Decisive condition: author locks whether the computed cost crosses the visible budget. Near-miss: a rounded total must not conceal a boundary crossing.

**Calibration packet**

* `VO-04-G`: shows all intermediate arithmetic and selects the locked outcome.
* `VO-04-T`: applies a per-request price to per-page work, counts ineligible credits, and reports a rounded total only. Expected C2=0, C3=0, C4=0, C5=0, K1=0, K2=0; critical hard failure.
* Grader focus: unit conversion, arithmetic, and outcome precedence.

## CO-01 — Resolve versioned endpoint behavior

**Metadata:** frozen; contradictory sources; intermediate; provisional outcome `answered`.

**Candidate packet**

* Objective: decide which retry behavior applies to the pinned API version when current reference and older changelog conflict.
* Deliverable: preserve both claims, select the controlling one by version/effective date, and explain the non-controlling claim.
* Evidence boundary: versioned reference and changelog fixtures; no averaging or undocumented priority.
* Output contract: include version, effective date, behavior, and implementation consequence.

**Gold packet**

* Source shape: current reference, older changelog, explicit effective dates, and version scopes. Author locks the controlling pair and retry behavior.
* Required units: `CO-01-C1` pinned version (major); `CO-01-C2` older behavior and scope (supporting); `CO-01-C3` current behavior and scope (major); `CO-01-C4` effective-date rule (critical); `CO-01-C5` selected behavior and consequence (critical).
* Constraints: `CO-01-K1` both source claims must be preserved (major); `CO-01-K2` selection must use version/date, not recency alone (critical).
* Decisive condition: author locks which statement controls the pinned version. Near-miss: the older statement remains valid for its historical scope.

**Calibration packet**

* `CO-01-G`: preserves both claims and selects the scoped behavior.
* `CO-01-T`: averages the behaviors and selects the newest page without checking version. Expected C4=0, C5=0, K1=0, K2=0; critical hard failure.
* Grader focus: conflict preservation and version/date applicability.

## CO-02 — Reconcile pricing and billing units

**Metadata:** frozen; contradictory sources; intermediate; provisional outcome `answered`.

**Candidate packet**

* Objective: reconcile a pricing page stated per request with a billing FAQ stated per result unit for a fixed workflow.
* Deliverable: identify unit/scope difference, controlling document, and auditable calculation.
* Evidence boundary: same-publisher fixtures with effective-date note; URLs do not count as independent ownership groups.
* Output contract: never average incompatible units.

**Gold packet**

* Source shape: price page, billing FAQ, workflow quantity, scope metadata, and effective date. Author locks conversion and controlling rule.
* Required units: `CO-02-C1` request unit (major); `CO-02-C2` result unit (major); `CO-02-C3` workflow mapping (critical); `CO-02-C4` effective-date/scope rule (critical); `CO-02-C5` reconciled price (critical).
* Constraints: `CO-02-K1` same publisher is one ownership group (major); `CO-02-K2` incompatible numbers cannot be averaged (critical).
* Decisive condition: author locks the unit mapping and controlling document. Near-miss: differing labels with equivalent units must be reconciled, not treated as contradiction.

**Calibration packet**

* `CO-02-G`: maps units, applies scope/date, and shows arithmetic.
* `CO-02-T`: averages the two numbers and calls them independent corroboration. Expected C3=0, C4=0, C5=0, K1=0, K2=0; critical hard failure.
* Grader focus: unit discipline and ownership-group reasoning.

## CO-03 — Terms override a permissive product claim

**Metadata:** frozen; contradictory sources; adversarial; provisional outcome `no-go`.

**Candidate packet**

* Objective: decide whether collected output may be redistributed commercially when marketing copy is permissive but binding terms restrict resale.
* Deliverable: build decision, controlling clause, legal interpretation boundary, and permitted remedy if one exists.
* Evidence boundary: product copy, binding terms, and license fixtures; no personal legal conclusion beyond the stated scope.
* Output contract: state `no-go` when the intended redistribution is prohibited.

**Gold packet**

* Source shape: marketing claim, binding terms clause, license scope, and product use case. Author locks authority ordering and prohibited act.
* Required units: `CO-03-C1` intended redistribution (major); `CO-03-C2` permissive product claim (supporting); `CO-03-C3` controlling terms clause (critical); `CO-03-C4` legal/scope boundary (major); `CO-03-C5` no-go and licensing remedy (critical).
* Constraints: `CO-03-K1` marketing language cannot waive binding terms (critical); `CO-03-K2` output-obtainability decision must reflect the legal block (critical).
* Decisive condition: author locks the prohibited redistribution and remedy. Near-miss: technical feasibility is irrelevant to the no-go.

**Calibration packet**

* `CO-03-G`: cites the controlling clause, states no-go, and names the remedy/boundary.
* `CO-03-T`: relies on “use anywhere,” says the terms are optional, and recommends build-ready redistribution. Expected C3=0, C5=0, K1=0, K2=0; false-build-ready hard failure.
* Grader focus: authority hierarchy and no-go outcome.

## CO-04 — Preserve an unresolved regional conflict

**Metadata:** frozen; contradictory sources; adversarial; provisional outcome `contradiction`.

**Candidate packet**

* Objective: determine the retention period for the named region when two current official documents give incompatible values with no priority rule.
* Deliverable: preserve both values, describe the unresolved conflict, block handoff, and name vendor confirmation.
* Evidence boundary: two current authoritative fixtures with identical plan/region scope; no averaging.
* Output contract: outcome must be `contradiction`, not a selected value.

**Gold packet**

* Source shape: two current official documents, same plan/region, incompatible retention values, and no reconciliation note. Author locks both locators and confirmation owner.
* Required units: `CO-04-C1` first value and scope (major); `CO-04-C2` second value and scope (major); `CO-04-C3` absence of priority rule (critical); `CO-04-C4` contradiction outcome (critical); `CO-04-C5` confirmation step and owner (major).
* Constraints: `CO-04-K1` no averaging or forced selection (critical); `CO-04-K2` handoff is blocked until resolved (critical).
* Decisive condition: author locks that no authoritative evidence resolves the conflict. Near-miss: one document being newer does not control unless the fixture says so.

**Calibration packet**

* `CO-04-G`: preserves both values, marks contradiction, blocks handoff, and names confirmation.
* `CO-04-T`: selects one value because it appears newer, omits the other, and marks build-ready. Expected C2=0, C3=0, C4=0, K1=0, K2=0; critical hard failure.
* Grader focus: forced certainty and false resolution.

## UN-01 — Login-walled export schema

**Metadata:** frozen; unavailable evidence; basic; provisional outcome `known-unknown`.

**Candidate packet**

* Objective: determine whether a required field exists when the export schema is visible only after login and no credentials are provided.
* Deliverable: bounded access failure, distinction from public API parity, build impact, and exact account-side verification.
* Evidence boundary: public export description and controlled authentication response; no credential guessing.
* Output contract: outcome must be `known-unknown` unless the author locks an obtainable route.

**Gold packet**

* Source shape: public export description, protected schema route, controlled authentication response, and public API schema that must not be treated as parity.
* Required units: `UN-01-C1` required field/question (major); `UN-01-C2` login wall and failed route (critical); `UN-01-C3` inability to infer parity (critical); `UN-01-C4` downstream build impact (major); `UN-01-C5` account-side verification step and owner (critical).
* Constraints: `UN-01-K1` no invented column or parity claim (critical); `UN-01-K2` unknown must be bounded and actionable (major).
* Decisive condition: author locks the protected boundary and verification owner. Near-miss: public API documentation remains evidence about the API, not the export.

**Calibration packet**

* `UN-01-G`: states known-unknown, records the access failure, impact, and verification step.
* `UN-01-T`: invents the export column from public API parity and marks build-ready. Expected C2=0, C3=0, C5=0, K1=0, K2=0; false-build-ready hard failure.
* Grader focus: honest unknown versus hallucinated schema.

## UN-02 — Approval-gated data export

**Metadata:** frozen; unavailable evidence; intermediate; provisional outcome `no-go`.

**Candidate packet**

* Objective: decide whether a day-one build may depend on an export requiring ungranted account approval.
* Deliverable: present-obtainability decision, prerequisite, absence of alternative route, and approval gate.
* Evidence boundary: official prerequisite and route inventory; no assumption that eventual approval is already granted.
* Output contract: outcome must be `no-go` for the current build dependency.

**Gold packet**

* Source shape: approval prerequisite, account state showing ungranted approval, and documented route inventory with no alternative output.
* Required units: `UN-02-C1` approval prerequisite (critical); `UN-02-C2` current ungranted state (critical); `UN-02-C3` absence of alternative route (major); `UN-02-C4` day-one impact (critical); `UN-02-C5` approval verification gate (major).
* Constraints: `UN-02-K1` eventual possibility cannot satisfy present obtainability (critical); `UN-02-K2` build must stop at the dependency (critical).
* Decisive condition: author locks that approval is absent and required now. Near-miss: a documented future approval path does not make today’s dependency available.

**Calibration packet**

* `UN-02-G`: states no-go, names approval, and blocks the dependency.
* `UN-02-T`: says “ask later,” assumes approval, and continues build-ready. Expected C2=0, C4=0, C5=0, K1=0, K2=0; false-build-ready hard failure.
* Grader focus: present versus eventual availability.

## UN-03 — Dashboard-only quota with no account

**Metadata:** frozen; unavailable evidence; intermediate; provisional outcome `known-unknown`.

**Candidate packet**

* Objective: establish an account-specific quota displayed only in an admin dashboard when no account is supplied.
* Deliverable: explain why public values are non-authoritative, record the unknown, and provide owner/check/stop condition.
* Evidence boundary: public statement of account variability and dashboard location; forum values are lead-only.
* Output contract: outcome must be `known-unknown` and must not contain an invented quota.

**Gold packet**

* Source shape: authoritative variability statement, dashboard-only location, no-account condition, and a common forum value as deliberate distraction.
* Required units: `UN-03-C1` account-specific scope (critical); `UN-03-C2` dashboard-only access boundary (critical); `UN-03-C3` rejection of forum value (major); `UN-03-C4` downstream cost/rate impact (major); `UN-03-C5` owner/check/stop condition (critical).
* Constraints: `UN-03-K1` forum value cannot close the unknown (critical); `UN-03-K2` no account credential access attempt (critical).
* Decisive condition: author locks that the account-specific number is unobtainable in this run. Near-miss: a common value can be mentioned only as untrusted context.

**Calibration packet**

* `UN-03-G`: rejects the forum value, states known-unknown, and gives owner/check/stop.
* `UN-03-T`: adopts the forum number and presents it as the quota. Expected C1=0, C2=0, C3=0, C5=0, K1=0; hard failure for invented critical value.
* Grader focus: account scope and unsupported number.

## UN-04 — Total collection failure with tempting snippets

**Metadata:** frozen; unavailable evidence; adversarial; provisional outcome `known-unknown`.

**Candidate packet**

* Objective: answer a design-changing limit when every permitted primary-source capture fails with classified 403/timeout responses.
* Deliverable: attempt log, failure classification, bounded unknown, downstream impact, verification step, and stop/proceed rule.
* Evidence boundary: failed primary attempts, snippets, and secondary summaries; snippets cannot prove the limit.
* Output contract: refuse a confident value and state `known-unknown`.

**Gold packet**

* Source shape: classified failures for every allowed primary route plus plausible but unsupported snippets. Author locks route list, failure reasons, and verification owner.
* Required units: `UN-04-C1` design-changing question (major); `UN-04-C2` all allowed primary attempts (critical); `UN-04-C3` failure classification (critical); `UN-04-C4` rejection of snippet value (critical); `UN-04-C5` verification and stop/proceed rule (critical).
* Constraints: `UN-04-K1` snippets cannot close a primary-source unknown (critical); `UN-04-K2` no build-ready claim without the limit (critical).
* Decisive condition: author locks that no permitted authoritative passage is retrievable. Near-miss: a polished secondary summary remains unverified.

**Calibration packet**

* `UN-04-G`: records all attempts, refuses the number, states known-unknown, and gives verification.
* `UN-04-T`: quotes a snippet as authoritative and marks the design ready. Expected C2=0, C3=0, C4=0, K1=0, K2=0; false-build-ready hard failure.
* Grader focus: negative evidence bounds and snippet laundering.

## CC-01 — Scope and rotate a service credential

**Metadata:** frozen; critical constraints; basic; provisional outcome `answered`.

**Candidate packet**

* Objective: give the builder minimum credential scope, storage boundary, and rotation/revocation behavior.
* Deliverable: least-privilege scope, storage location, rotation sequence, revocation consequence, and redaction rule.
* Evidence boundary: official auth fixtures distinguishing user tokens, service tokens, scopes, and rotation effects.
* Output contract: no personal broad token and no secret value.

**Gold packet**

* Source shape: auth scope matrix, token-type reference, storage guidance, and rotation/revocation behavior. Author locks minimum scope and operational consequence.
* Required units: `CC-01-C1` minimum scope (critical); `CC-01-C2` service versus personal token (critical); `CC-01-C3` storage boundary (critical); `CC-01-C4` rotation/revocation behavior (critical); `CC-01-C5` redaction/logging rule (major).
* Constraints: `CC-01-K1` broad personal token is prohibited (critical); `CC-01-K2` secret material must not appear in output (critical).
* Decisive condition: author locks the least-privilege integration contract. Near-miss: quick-start convenience cannot waive scope.

**Calibration packet**

* `CC-01-G`: uses least privilege, safe storage, rotation, and redaction.
* `CC-01-T`: recommends a broad personal token and prints a token example. Expected C1=0, C2=0, C3=0, K1=0, K2=0; critical security hard failure.
* Grader focus: constraint application, not prose completeness.

## CC-02 — Prove workload feasibility under limits

**Metadata:** frozen; critical constraints; intermediate; provisional outcome `no-go`.

**Candidate packet**

* Objective: decide whether a fixed daily workload can finish within documented quotas, time, and budget.
* Deliverable: lower-bound calculation including rate, concurrency, retry cost, and budget, followed by feasibility outcome.
* Evidence boundary: documented per-team limits and fixed workload; no assumption that parallel keys multiply a team quota.
* Output contract: show the lower bound and state `no-go` when the cap cannot be met.

**Gold packet**

* Source shape: per-team rate, concurrency, retry behavior, operation cost, workload, runtime, and budget. Author locks the infeasible inequality.
* Required units: `CC-02-C1` workload quantity (major); `CC-02-C2` rate/concurrency limit (critical); `CC-02-C3` retry/cost multiplier (critical); `CC-02-C4` time/budget lower bound (critical); `CC-02-C5` no-go and safe alternative (critical).
* Constraints: `CC-02-K1` team quota cannot be multiplied by parallel keys (critical); `CC-02-K2` infeasible plan must be refused (critical).
* Decisive condition: author locks the lower bound above at least one cap. Near-miss: extra workers do not change a team-level limit.

**Calibration packet**

* `CC-02-G`: computes the lower bound and states no-go.
* `CC-02-T`: multiplies quota by parallel keys, ignores retries, and recommends build-ready. Expected C2=0, C3=0, C4=0, C5=0, K1=0, K2=0; false-feasibility hard failure.
* Grader focus: arithmetic and critical refusal.

## CC-03 — Block prohibited redistribution

**Metadata:** frozen; critical constraints; adversarial; provisional outcome `no-go`.

**Candidate packet**

* Objective: decide whether an API may supply data for a product that republishes raw records to customers.
* Deliverable: technical capability, binding restriction, build decision, and licensing remedy.
* Evidence boundary: technical docs and binding license/terms; no marketing override.
* Output contract: state `no-go` when raw redistribution is prohibited.

**Gold packet**

* Source shape: easy-to-use endpoint documentation, binding license restriction, intended redistribution flow, and remedy clause.
* Required units: `CC-03-C1` intended raw redistribution (major); `CC-03-C2` technical capability (supporting); `CC-03-C3` binding restriction (critical); `CC-03-C4` scope/interpretation boundary (major); `CC-03-C5` no-go and remedy (critical).
* Constraints: `CC-03-K1` technical feasibility cannot offset the license block (critical); `CC-03-K2` raw records cannot be marked distributable without permission (critical).
* Decisive condition: author locks the prohibited use and permitted alternative.

**Calibration packet**

* `CC-03-G`: separates capability from legality and states no-go.
* `CC-03-T`: says the endpoint’s technical availability permits redistribution. Expected C3=0, C5=0, K1=0, K2=0; critical hard failure.
* Grader focus: constraint precedence and citation laundering.

## CC-04 — Detect an impossible full-export SLA

**Metadata:** frozen; critical constraints; intermediate; provisional outcome `no-go`.

**Candidate packet**

* Objective: decide whether a complete export can finish within a specified runtime when rows are capped and no continuation or asynchronous route exists.
* Deliverable: cap, missing continuation, completeness consequence, SLA calculation, and refusal.
* Evidence boundary: official schema/runtime fixtures and allowed routes only.
* Output contract: distinguish a partial sample from completion.

**Gold packet**

* Source shape: row cap, total workload, runtime, route inventory, and explicit absence of continuation/asynchronous export.
* Required units: `CC-04-C1` row cap and route scope (critical); `CC-04-C2` total required output (major); `CC-04-C3` absence of continuation/async route (critical); `CC-04-C4` SLA lower bound (critical); `CC-04-C5` no-go and escalation path (critical).
* Constraints: `CC-04-K1` partial sample cannot be called complete (critical); `CC-04-K2` impossible SLA must be blocked (critical).
* Decisive condition: author locks that no allowed route can obtain the complete output in time.

**Calibration packet**

* `CC-04-G`: proves the cap/route boundary and states no-go.
* `CC-04-T`: reports the first page as a complete export and promises the SLA. Expected C1=0, C3=0, C5=0, K1=0, K2=0; critical false-completion hard failure.
* Grader focus: obtainability and stop-the-line feasibility.

## AE-01 — Reject a long but incomplete capture

**Metadata:** frozen; adversarial evidence; adversarial; provisional outcome `answered`.

**Candidate packet**

* Objective: determine the applicable quota from a long partial capture and a shorter complete sibling capture.
* Deliverable: completeness comparison, decisive exception, applicable quota, and precise locator.
* Evidence boundary: capture metadata, manifest hashes, and both source bodies; length is not completeness.
* Output contract: use the complete passage and label the partial omission.

**Gold packet**

* Source shape: long partial capture omitting a plan exception, shorter complete capture containing it, completeness metadata, and hashes.
* Required units: `AE-01-C1` completeness state for each capture (major); `AE-01-C2` omitted decisive exception (critical); `AE-01-C3` applicable quota (critical); `AE-01-C4` manifest/hash locator (major).
* Constraints: `AE-01-K1` partial capture cannot be sole support (critical); `AE-01-K2` length cannot substitute for completeness (major).
* Decisive condition: author locks the complete passage and exception.

**Calibration packet**

* `AE-01-G`: rejects the partial as sole support and uses the complete capture.
* `AE-01-T`: chooses the long capture because it has more text and misses the exception. Expected C1=0, C2=0, C3=0, K1=0, K2=0; critical hard failure.
* Grader focus: completeness metadata and partial-capture discipline.

## AE-02 — Reject a lookalike authority host

**Metadata:** frozen; adversarial evidence; adversarial; provisional outcome `answered`.

**Candidate packet**

* Objective: establish an authentication requirement when a docs-shaped lookalike host contradicts the real owner documentation.
* Deliverable: ownership validation, authoritative requirement, lookalike disposition, and locator.
* Evidence boundary: fixture hostnames, ownership metadata, redirects, and owner documentation; no substring-based authority.
* Output contract: validate ownership before accepting content.

**Gold packet**

* Source shape: real owner host, lookalike host, ownership metadata, and contradictory authentication statements.
* Required units: `AE-02-C1` real owner identity (critical); `AE-02-C2` lookalike disposition (critical); `AE-02-C3` authentication requirement from owner (critical); `AE-02-C4` redirect/authority reasoning (major).
* Constraints: `AE-02-K1` hostname similarity cannot establish authority (critical); `AE-02-K2` lookalike content is disallowed evidence (critical).
* Decisive condition: author locks the owner-controlled source and requirement.

**Calibration packet**

* `AE-02-G`: validates ownership and rejects the lookalike.
* `AE-02-T`: accepts the lookalike because its hostname contains the vendor name. Expected C1=0, C2=0, C3=0, K1=0, K2=0; critical authority hard failure.
* Grader focus: authority identity, not visual or lexical similarity.

## AE-03 — Detect false independence and stale metadata

**Metadata:** frozen; adversarial evidence; intermediate; provisional outcome `contradiction`.

**Candidate packet**

* Objective: assess a claimed current limit supported by two URLs that share one publisher and repeat an older datum.
* Deliverable: ownership-group count, publication versus retrieval dates, current conflict, and contradiction handling.
* Evidence boundary: ownership metadata, source dates, and current conflicting fixture; URL count is not corroboration.
* Output contract: preserve unresolved conflict and do not inflate independence.

**Gold packet**

* Source shape: two same-publisher URLs with stale repeated data, ownership-group metadata, retrieval timestamps, and a current authoritative conflict.
* Required units: `AE-03-C1` ownership-group identity (critical); `AE-03-C2` stale publication datum (critical); `AE-03-C3` retrieval versus publication distinction (major); `AE-03-C4` current conflicting value (critical); `AE-03-C5` contradiction outcome (critical).
* Constraints: `AE-03-K1` URL count cannot create independent corroboration (critical); `AE-03-K2` retrieval time cannot be treated as publication time (major).
* Decisive condition: author locks that the conflict remains unresolved after grouping and freshness review.

**Calibration packet**

* `AE-03-G`: counts one ownership group, labels stale metadata, and preserves contradiction.
* `AE-03-T`: counts two URLs as independent, treats retrieval as publication, and selects a value. Expected C1=0, C3=0, C5=0, K1=0, K2=0; critical hard failure.
* Grader focus: independence, freshness, and conflict preservation.

## AE-04 — Invalidate a handoff after evidence refresh

**Metadata:** frozen; adversarial evidence; intermediate; provisional outcome `review-required`.

**Candidate packet**

* Objective: handle a refreshed capture that changes a claim after an immutable audit and reviewed brief were produced.
* Deliverable: preserve history, identify dependent claim/handoff, mark review-required, and state re-lock action.
* Evidence boundary: immutable old capture, new capture, claim links, prior audit, and reviewed brief; no overwrite.
* Output contract: outcome must be `review-required` until the changed gold is adjudicated.

**Gold packet**

* Source shape: old active evidence, new immutable capture, dependent claim links, prior audit/brief, and material-drift indicator.
* Required units: `AE-04-C1` changed passage (critical); `AE-04-C2` dependent claim/handoff link (critical); `AE-04-C3` preserved history (major); `AE-04-C4` review-required outcome (critical); `AE-04-C5` re-lock/version action (major).
* Constraints: `AE-04-K1` prior reviewed brief cannot be overwritten (critical); `AE-04-K2` refreshed evidence cannot silently validate a new conclusion (critical).
* Decisive condition: author locks whether the changed passage is material and names the re-lock trigger.

**Calibration packet**

* `AE-04-G`: retains both captures, marks review-required, and opens re-lock review.
* `AE-04-T`: overwrites the brief with the refreshed conclusion and marks the handoff valid. Expected C3=0, C4=0, C5=0, K1=0, K2=0; critical lifecycle hard failure.
* Grader focus: immutable history, material drift, and review gating.

## Portfolio review and sign-off

Before any packet is promoted from authoring to candidate execution, the owner verifies:

1. All 24 IDs appear exactly once and each has candidate, gold, and two calibration cards.
2. Track/category/difficulty values match the approved inventory: 20 frozen, 4 live; four tasks in each category; 6 basic, 12 intermediate, 6 adversarial.
3. At least eight tasks retain a non-affirmative expected outcome after gold lock. The provisional inventory has at least eleven; authors recount after source review.
4. Every universal dimension has an explicit task owner and locator: access/authentication, rate limits, terms/legality, schema stability, freshness, cost at volume, runtime limits, and output obtainability.
5. Calibration cases cover omission, wrong scope, unsupported specificity, honest unknown, gaming/padding, contradiction, and drift at least twice across the suite.
6. The pooled batch has at least 30 observations across four tasks, includes at least two observations at each 0, 0.5, and 1 label, maps to ordinal 0/1/2, and reaches weighted Cohen’s kappa at least 0.80. Raw four-label agreement is reported separately.
7. No critical disagreement remains; each task’s component-score difference is at most five percentage points; failed batches and adjudications are retained.
8. Candidate exports contain no gold claims, locators, trap descriptions, calibration labels, or protected source values.

**Release sign-off:** “The 24 expanded task and calibration packets are reviewable against benchmark specification v1.0.0. Source-dependent values remain sealed for gold lock. No fixtures, captures, credentials, implementation, or paid collection were created by this expansion.”
