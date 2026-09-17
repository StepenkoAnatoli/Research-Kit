# Researcher Benchmark: 24 Task Outlines

**Status:** Draft outlines; no fixtures, gold packages, implementation, or live collection  
**Date:** 2026-09-16  
**Normative basis:** `2026-09-16-researcher-benchmark-design.md`  
**Approval note:** The source specification is an `Approval-ready candidate` at version 1.0.0. These outlines remain provisional until that specification receives human approval.

## Suite balance

| Category | IDs | Track | Basic | Intermediate | Adversarial | Non-affirmative outcomes |
|---|---|---|---:|---:|---:|---:|
| Stable technical facts | ST-01–ST-04 | Frozen | 2 | 2 | 0 | 0 |
| Volatile facts | VO-01–VO-04 | Live | 2 | 2 | 0 | Gold-lock dependent for VO-04 |
| Contradictory sources | CO-01–CO-04 | Frozen | 0 | 2 | 2 | 2 |
| Unavailable evidence | UN-01–UN-04 | Frozen | 1 | 2 | 1 | 4 |
| Critical constraints | CC-01–CC-04 | Frozen | 1 | 2 | 1 | 3 |
| Adversarial evidence | AE-01–AE-04 | Frozen | 0 | 2 | 2 | 2 |
| **Total** | **24** | **20 frozen / 4 live** | **6** | **12** | **6** | **At least 11** |

For live tasks, exact claims, values, and VO-04’s feasibility outcome are set only during the dual-reviewed gold lock. A change that flips the expected outcome is a major task-version change, not a patch refresh.

## Stable technical facts

### ST-01 — Complete a cursor-paginated export

- **Metadata:** frozen; stable; basic; provisional outcome `answered`.
- **Candidate task:** Decide whether a builder can retrieve every record from a documented list API and state the exact termination and deduplication behavior.
- **Gold design:** Official API-reference fixtures define cursor location, page-size ceiling, terminal response, stable record key, and ordering caveat.
- **Critical dimensions:** schema stability and output obtainability.
- **Trap / pass signal:** A quick-start shows only the first page. Pass requires the full traversal contract and must not infer snapshot consistency unless documented.

### ST-02 — Interpret CLI exit and error channels

- **Metadata:** frozen; stable; basic; provisional outcome `answered`.
- **Candidate task:** Specify how an orchestrator distinguishes success, user refusal, retryable failure, and blocking failure for a documented CLI.
- **Gold design:** Command-reference and exit-code fixtures define statuses, stdout/stderr ownership, and one version boundary.
- **Critical dimensions:** runtime/execution limits and access model.
- **Trap / pass signal:** A prose guide says “nonzero means failure,” but the reference distinguishes classes. Pass requires exact classification without inventing retry behavior.

### ST-03 — Verify signed webhook deliveries

- **Metadata:** frozen; stable; intermediate; provisional outcome `answered`.
- **Candidate task:** Give the builder a complete verification contract for incoming webhooks.
- **Gold design:** Official fixtures specify secret acquisition, signature header, raw-body canonicalization, algorithm, timestamp/replay window, and rotation behavior.
- **Critical dimensions:** authentication and schema stability.
- **Trap / pass signal:** A framework example parses JSON before verification. Pass requires raw-byte verification and correct treatment of rotated secrets and stale timestamps.

### ST-04 — Determine bulk-export field parity

- **Metadata:** frozen; stable; intermediate; provisional outcome `answered`.
- **Candidate task:** Decide whether the bulk export contains all fields needed by a downstream migration, and identify any alternate documented route.
- **Gold design:** API schema, export schema, and field-availability table fixtures deliberately differ.
- **Critical dimensions:** access model, schema stability, and output obtainability.
- **Trap / pass signal:** The normal API exposes a required field that the bulk export omits. Pass must scope the conclusion to the export and give the supported route or limitation.

## Volatile facts

### VO-01 — Lock current free-tier quotas

- **Metadata:** live; volatile; basic; outcome fixed at gold lock, normally `answered`.
- **Candidate task:** Report current included credits, request-rate limits, and concurrency for a named free plan, with retrieval date and account/team scope.
- **Gold design:** Curators lock the vendor’s pricing and limits pages within seven days; task input names the plan and region.
- **Critical dimensions:** access model, rate limits, freshness, and cost at volume.
- **Trap / pass signal:** Search snippets or older pricing pages contain previous values. Pass cites current owner pages and does not merge per-key and per-team limits.

### VO-02 — Verify current supported runtime versions

- **Metadata:** live; volatile; basic; outcome fixed at gold lock, normally `answered`.
- **Candidate task:** Decide whether the builder’s pinned runtime is currently supported by the vendor SDK and CLI.
- **Gold design:** Current install/reference pages and release metadata identify minimum and supported runtime ranges.
- **Critical dimensions:** freshness and runtime/platform limits.
- **Trap / pass signal:** A stale README names an older minimum. Pass scopes by product version and distinguishes “installs” from “supported.”

### VO-03 — Confirm regional feature availability

- **Metadata:** live; volatile; intermediate; outcome fixed at gold lock.
- **Candidate task:** Determine whether a named feature is available for the specified plan and deployment region on the lock date.
- **Gold design:** Current region matrix, plan matrix, and release-status page are independently locked and reviewed.
- **Critical dimensions:** access model, freshness, and output obtainability.
- **Trap / pass signal:** A global marketing page omits the regional exception. Pass states plan, region, availability state, and date.

### VO-04 — Price a fixed production workload

- **Metadata:** live; volatile; intermediate; outcome `answered` or `no-go` fixed at gold lock from a candidate-visible budget.
- **Candidate task:** Calculate the monthly external cost for a fixed operation mix and decide whether it fits the stated budget.
- **Gold design:** Current official price units, included allowance, overage rules, and tax/currency scope are locked; arithmetic inputs are explicit.
- **Critical dimensions:** freshness and cost at expected volume.
- **Trap / pass signal:** Per-request and per-page units differ, and included credits may not apply to every operation. Pass shows auditable arithmetic and does not hide uncertainty behind a single total.

## Contradictory sources

### CO-01 — Resolve versioned endpoint behavior

- **Metadata:** frozen; contradiction; intermediate; provisional outcome `answered`.
- **Candidate task:** Decide which retry behavior applies to a pinned API version when a current reference conflicts with an older changelog entry.
- **Gold design:** Fixtures contain explicit effective dates and version scopes that resolve the apparent conflict.
- **Critical dimensions:** freshness, schema stability, and runtime behavior.
- **Trap / pass signal:** Pass preserves both claims, selects the applicable one by version/date, and explains why the other is not controlling.

### CO-02 — Reconcile pricing and billing units

- **Metadata:** frozen; contradiction; intermediate; provisional outcome `answered`.
- **Candidate task:** Reconcile a pricing page stated per request with a billing FAQ stated per result unit for a fixed workflow.
- **Gold design:** Same-publisher fixtures use different scopes and an effective-date note.
- **Critical dimensions:** freshness and cost at expected volume.
- **Trap / pass signal:** Averaging the two numbers or treating the pages as independent sources fails. Pass identifies scope and controlling document.

### CO-03 — Terms override a permissive product claim

- **Metadata:** frozen; contradiction; adversarial; provisional outcome `no-go`.
- **Candidate task:** Decide whether collected output may be redistributed in a commercial dataset when marketing copy says “use anywhere” but binding terms restrict resale.
- **Gold design:** Product copy, terms, and license fixtures clearly differ in authority and legal scope.
- **Critical dimensions:** terms/licensing/legality and output obtainability.
- **Trap / pass signal:** Pass gives the no-go, cites the controlling clause, and labels any legal interpretation boundary without treating marketing copy as permission.

### CO-04 — Preserve an unresolved regional conflict

- **Metadata:** frozen; contradiction; adversarial; provisional outcome `contradiction`.
- **Candidate task:** Determine the retention period for a named region when two current official documents give incompatible values with no priority rule.
- **Gold design:** Both fixtures are current, authoritative, and scoped to the same plan/region; no reconciliation evidence exists.
- **Critical dimensions:** freshness, regional scope, and runtime/retention limits.
- **Trap / pass signal:** Pass records both values, refuses to average or choose one, blocks handoff, and names the vendor-confirmation step.

## Unavailable evidence

### UN-01 — Login-walled export schema

- **Metadata:** frozen; unavailable; basic; provisional outcome `known-unknown`.
- **Candidate task:** Determine whether a required field exists in an export whose schema is visible only after login; no credentials are provided.
- **Gold design:** Public fixture names the export but not its columns; the protected route returns a controlled authentication response.
- **Critical dimensions:** authentication, schema stability, and output obtainability.
- **Trap / pass signal:** Pass does not infer parity from the public API, records the failed access, explains build impact, and names the exact account-side verification.

### UN-02 — Approval-gated data export

- **Metadata:** frozen; unavailable; intermediate; provisional outcome `no-go`.
- **Candidate task:** Decide whether a day-one build can depend on an export requiring ungranted account approval.
- **Gold design:** Official fixture documents the approval prerequisite and no alternative output route.
- **Critical dimensions:** access model, authentication, and output obtainability.
- **Trap / pass signal:** Pass distinguishes eventual possibility from present obtainability and blocks the dependency until approval is verified.

### UN-03 — Dashboard-only quota with no account

- **Metadata:** frozen; unavailable; intermediate; provisional outcome `known-unknown`.
- **Candidate task:** Establish a quota that the public docs explicitly say is account-specific and displayed only in an admin dashboard.
- **Gold design:** Public authoritative fixture proves variability and dashboard location; fixture supplies no account.
- **Critical dimensions:** authentication, rate limits, and cost at volume.
- **Trap / pass signal:** A forum states a common value. Pass rejects it as gold, records the account-specific unknown, and gives an owner/check/stop condition.

### UN-04 — Total collection failure with tempting snippets

- **Metadata:** frozen; unavailable; adversarial; provisional outcome `known-unknown`.
- **Candidate task:** Answer a design-changing limit when every permitted primary-source capture fails with classified 403/timeout responses.
- **Gold design:** Search-result snippets and secondary summaries offer a plausible number, but no retrievable authoritative passage supports it.
- **Critical dimensions:** access model, freshness, and output obtainability.
- **Trap / pass signal:** Pass reports attempts and refuses a confident answer; a polished brief based on snippets is a false build-ready hard failure.

## Critical constraints

### CC-01 — Scope and rotate a service credential

- **Metadata:** frozen; constraints; basic; provisional outcome `answered`.
- **Candidate task:** Give the builder the minimum credential scope, storage boundary, and rotation/revocation behavior for an integration.
- **Gold design:** Official auth fixtures distinguish user tokens, service tokens, scopes, and rotation effects.
- **Critical dimensions:** authentication and access model.
- **Trap / pass signal:** A quick-start uses a broad personal token. Pass applies least privilege and states the operational consequence of rotation.

### CC-02 — Prove workload feasibility under limits

- **Metadata:** frozen; constraints; intermediate; provisional outcome `no-go`.
- **Candidate task:** Decide whether a fixed daily workload can finish within its time and budget using documented quotas.
- **Gold design:** Fixtures define per-team rate, concurrency, retry cost, and fixed budget such that the target cannot be met.
- **Critical dimensions:** rate limits, cost at volume, and runtime limits.
- **Trap / pass signal:** Pass computes the lower bound and rejects the plan; it cannot assume parallel keys multiply a team-level quota.

### CC-03 — Block prohibited redistribution

- **Metadata:** frozen; constraints; adversarial; provisional outcome `no-go`.
- **Candidate task:** Determine whether an API may supply data for a product that republishes raw records to customers.
- **Gold design:** Technical docs make the endpoint easy to use; binding license/terms prohibit the intended redistribution.
- **Critical dimensions:** terms/licensing/legality and output obtainability.
- **Trap / pass signal:** Technical feasibility cannot offset the legal constraint. Pass applies the restriction to the build decision and names the licensing remedy.

### CC-04 — Detect an impossible full-export SLA

- **Metadata:** frozen; constraints; intermediate; provisional outcome `no-go`.
- **Candidate task:** Decide whether a complete export can be obtained within a specified runtime when the system caps rows and offers no continuation or asynchronous export.
- **Gold design:** Official schema/runtime fixtures prove the cap and absence of another route within allowed access.
- **Critical dimensions:** runtime/platform limits and output obtainability.
- **Trap / pass signal:** Pass does not confuse a partial sample with completion and blocks the SLA-dependent design.

## Adversarial evidence

### AE-01 — Reject a long but incomplete capture

- **Metadata:** frozen; adversarial; adversarial; provisional outcome `answered`.
- **Candidate task:** Determine the applicable quota from a source package containing a long partial capture and a shorter complete sibling capture.
- **Gold design:** The partial omits a decisive plan exception; completeness metadata and manifest hashes are available.
- **Critical dimensions:** rate limits and output obtainability.
- **Trap / pass signal:** Pass refuses the partial as sole support and uses the complete passage with a precise locator.

### AE-02 — Reject a lookalike authority host

- **Metadata:** frozen; adversarial; adversarial; provisional outcome `answered`.
- **Candidate task:** Establish an authentication requirement when a docs-shaped lookalike host contradicts the real owner documentation.
- **Gold design:** Fixture hostnames and ownership metadata make authority decidable without network access.
- **Critical dimensions:** authentication and source authority.
- **Trap / pass signal:** Pass validates ownership rather than substring/prefix shape and treats the lookalike as disallowed evidence.

### AE-03 — Detect false independence and stale metadata

- **Metadata:** frozen; adversarial; intermediate; provisional outcome `contradiction`.
- **Candidate task:** Assess a claimed current limit supported by two URLs that share one publisher and repeat an older underlying datum.
- **Gold design:** Ownership-group and source-date metadata reveal one source family; another current authoritative fixture conflicts without resolving scope.
- **Critical dimensions:** freshness, source independence, and rate limits.
- **Trap / pass signal:** Pass does not count URL count as corroboration, does not treat retrieval time as publication time, and preserves the unresolved contradiction.

### AE-04 — Invalidate a handoff after evidence refresh

- **Metadata:** frozen; adversarial; intermediate; provisional outcome `review-required`.
- **Candidate task:** Handle a refreshed capture that changes a claim after an immutable audit and reviewed brief were produced.
- **Gold design:** Fixture history contains old active evidence, a new immutable capture, dependent claim links, and the prior audit/brief.
- **Critical dimensions:** freshness, schema/evidence lifecycle, and output obtainability.
- **Trap / pass signal:** Pass preserves history, marks the prior claim/handoff as requiring review, and does not overwrite the reviewed brief or claim the refreshed page automatically validates a new conclusion.

## Universal-dimension coverage

| Dimension | Critical in at least these tasks | Count |
|---|---|---:|
| Access model | ST-02, ST-04, VO-01, VO-03, UN-02, CC-01 | 6 |
| Authentication | ST-03, UN-01, UN-02, UN-03, CC-01, AE-02 | 6 |
| Rate limits and quotas | VO-01, UN-03, CC-02, AE-01, AE-03 | 5 |
| Terms/licensing/legality | CO-03, CC-03 | 2 |
| Schema stability | ST-01, ST-03, ST-04, UN-01, AE-04 | 5 |
| Freshness | VO-01–VO-04, CO-01, CO-02, CO-04, UN-04, AE-03, AE-04 | 10 |
| Cost at expected volume | VO-01, VO-04, UN-03, CC-02 | 4 |
| Runtime/platform limits | ST-02, VO-02, CO-04, CC-02, CC-04 | 5 |
| Output obtainability | ST-01, ST-04, VO-03, CO-03, UN-01, UN-02, UN-04, CC-03, CC-04, AE-01, AE-04 | 11 |

## Authoring gate for the next phase

Before any outline becomes a task package:

1. Record human approval of benchmark specification 1.0.0.
2. Assign an author and two gold reviewers under the approved separation rule.
3. Write candidate-visible and grader-only packages from the specification template.
4. Fix atomic claims, constraints, disallowed claims, authority groups, locators, and cost/time caps before seeing candidate output.
5. Pilot with deliberately good, incomplete, verbose, and gaming outputs; return ambiguous tasks to draft.
6. Lock bytes and hashes only after inter-rater criteria pass.

No live source was opened, no Firecrawl command was run, and no credit was spent to create these outlines.
