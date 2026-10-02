---
url: https://arxiv.org/html/2510.03495v2
retrieved: 2026-10-02
command: firecrawl scrape https://arxiv.org/html/2510.03495v2 --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: AgentHub: A Registry for Discoverable, Verifiable, and Reproducible AI Agents
---
Title:

Content selection saved. Describe the issue below:

Description:

![](https://arxiv.org/static/base/1.0.1/images/icons/smileybones-small.svg)arXiv is now an independent nonprofit! [Learn more](https://info.arxiv.org/about) ×

[License: CC BY-SA 4.0](https://info.arxiv.org/help/license/index.html#licenses-available)

arXiv:2510.03495v2 \[cs.SE\] 26 Feb 2026

# AgentHub: A Registry for Discoverable, Verifiable, and Reproducible AI Agents

DOI: [XXXXXXX.XXXXXXX](https://doi.org/XXXXXXX.XXXXXXX)Conference: International Conference on Software Engineering; April 12–18, 2026; Rio De Janeiro, BrazilISBN: XXX-X-XXXX-XXXX-X/2025/11

Erik Pautsch
Note: Erik Pautsch and Tanmay Singla contributed equally to this work.
Note: Emails: [epautsch@luc.edu](mailto:epautsch@luc.edu ""), [klaufer@luc.edu](mailto:klaufer@luc.edu ""), [gthiruvathukal@luc.edu](mailto:gthiruvathukal@luc.edu "")Affiliation: Loyola Univ. Chicago, USA, Konstantin Läufer
Affiliation: Loyola Univ. Chicago, USA, George K. Thiruvathukal
Affiliation: Loyola Univ. Chicago, USA, Tanmay Singla
Note: Emails: [singlat@purdue.edu](mailto:singlat@purdue.edu ""), [kumar565@purdue.edu](mailto:kumar565@purdue.edu ""), [peng397@purdue.edu](mailto:peng397@purdue.edu ""), [davisjam@purdue.edu](mailto:davisjam@purdue.edu "")Affiliation: Purdue University, USA, Parv Kumar
Affiliation: Purdue University, USA, Huiyun Peng
Affiliation: Purdue University, USA, James C. Davis
Affiliation: Purdue University, USA, Wenxin Jiang
Note: [wenxin@socket.dev](mailto:wenxin@socket.dev "")Affiliation: Socket Inc., USA and Behnaz Hassanshahi
Note: [behnaz.hassanshahi@oracle.com](mailto:behnaz.hassanshahi@oracle.com "")Affiliation: Oracle Labs, Australia

2025

###### Abstract.

LLM-based agents are rapidly proliferating, yet the infrastructure for discovering, evaluating, and governing them remains fragmented compared to mature ecosystems like software package registries (e.g., npm) and model hubs (e.g., Hugging Face).
Existing efforts typically address naming, distribution, or protocol descriptors, but stop short of providing a registry layer that makes agents discoverable, comparable, and governable under automated reuse.

We present AgentHub, a registry layer and accompanying research agenda for agent sharing that targets discovery and workflow integration, trust and security, openness and governance, ecosystem interoperability, lifecycle transparency, and capability clarity with evidence.
We describe a reference prototype that implements a canonical manifest with publish-time validation, version-bound evidence records linked to auditable artifacts, and an append-only lifecycle event log whose states are respected by default in search and resolution.
We also provide initial discovery results using an LLM-as-judge recommendation pipeline, showing how structured contracts and evidence improve intent-accurate retrieval beyond keyword-driven discovery.
AgentHub aims to provide a common substrate for building reliable, reusable agent ecosystems.

## 1\. Introduction

LLM-based agents are rapidly entering workflows, from scientific discovery ( [1](https://arxiv.org/html/2510.03495v2#bib.bib1 "")) to software engineering ( [2](https://arxiv.org/html/2510.03495v2#bib.bib2 "")).
Unlike static software packages or pretrained models ( [3](https://arxiv.org/html/2510.03495v2#bib.bib3 "")), _agents_ act with autonomy, compose tools dynamically, evolve (self-refine) over time, and can operate at scale ( [4](https://arxiv.org/html/2510.03495v2#bib.bib4 ""), [5](https://arxiv.org/html/2510.03495v2#bib.bib5 "")).
We believe these attributes necessitate a new approach to sharing and composing the associated artifacts.
As agent adoption grows, the lack of suitable infrastructure risks limiting both research progress and real-world impact.

In designing a registry for agent sharing, we can learn from the ecosystems for earlier kinds of software.
Conventional registries such as PyPI, npm, and Maven Central show the value of structured metadata, dependency graphs, and signed provenance ( [6](https://arxiv.org/html/2510.03495v2#bib.bib6 ""), [7](https://arxiv.org/html/2510.03495v2#bib.bib7 "")).
More recently, registries for pre-trained models, e.g., Hugging Face, expose artifacts and informal model cards, but in an effort to keep up with rapid change they omit normalized dependency and capability schemas, hampering reuse ( [3](https://arxiv.org/html/2510.03495v2#bib.bib3 ""), [8](https://arxiv.org/html/2510.03495v2#bib.bib8 ""), [9](https://arxiv.org/html/2510.03495v2#bib.bib9 "")).
Meanwhile, emerging agent protocols, including the Model Context Protocol (MCP) ( [10](https://arxiv.org/html/2510.03495v2#bib.bib10 ""), [11](https://arxiv.org/html/2510.03495v2#bib.bib11 "")) and the Agent Name Service (ANS) ( [12](https://arxiv.org/html/2510.03495v2#bib.bib12 "")),
strengthen connectivity and naming but stop short of delivering a registry layer.
The result is a fragmented landscape lacking features such as capability evidence and lifecycle status.

![Refer to caption](https://arxiv.org/html/2510.03495v2/AH_architecture_final.png)Figure 1. Conceptual view of AgentHub, illustrating how publishers, identities, and agent protocols might interact.

We envision _AgentHub_ as a registry layer that sits between emerging agent protocols (e.g., MCP, A2A, ANS) and the workflows that publish, discover, and reuse agents ( [Figure1](https://arxiv.org/html/2510.03495v2#S1.F1 "In 1. Introduction ‣ AgentHub: A Registry for Discoverable, Verifiable, and Reproducible AI Agents")).
AgentHub shares baseline registry concerns with earlier ecosystems, such as namespaces, versioning, integrity, and governance.
However, agents’ autonomy, dynamic composition, continual evolution, and scale impose requirements that are difficult to treat as documentation problems.
Automatable reuse requires machine-checkable capability schemas and evidence ( [section3.2.6](https://arxiv.org/html/2510.03495v2#S3.SS2.SSS6 "3.2.6. Capability Clarity & Evidence ‣ 3.2. Agent-Specific Considerations ‣ 3. Research Agenda ‣ AgentHub: A Registry for Discoverable, Verifiable, and Reproducible AI Agents")), and continual evolution requires lifecycle visibility and fast revocation ( [section3.2.5](https://arxiv.org/html/2510.03495v2#S3.SS2.SSS5 "3.2.5. Lifecycle Transparency ‣ 3.2. Agent-Specific Considerations ‣ 3. Research Agenda ‣ AgentHub: A Registry for Discoverable, Verifiable, and Reproducible AI Agents")).
Cross-protocol composition requires interoperability across descriptor dialects ( [section3.2.4](https://arxiv.org/html/2510.03495v2#S3.SS2.SSS4 "3.2.4. Ecosystem Interoperability ‣ 3.2. Agent-Specific Considerations ‣ 3. Research Agenda ‣ AgentHub: A Registry for Discoverable, Verifiable, and Reproducible AI Agents")).
Finally, scaling publishers and consumers beyond humans raises governance and security requirements that must be enforceable by default ( [sections3.2.3](https://arxiv.org/html/2510.03495v2#S3.SS2.SSS3 "3.2.3. Openness & Governance ‣ 3.2. Agent-Specific Considerations ‣ 3. Research Agenda ‣ AgentHub: A Registry for Discoverable, Verifiable, and Reproducible AI Agents") and [3.2.2](https://arxiv.org/html/2510.03495v2#S3.SS2.SSS2 "3.2.2. Trust and Security ‣ 3.2. Agent-Specific Considerations ‣ 3. Research Agenda ‣ AgentHub: A Registry for Discoverable, Verifiable, and Reproducible AI Agents")).

This paper contributes an agenda and a substrate for testing it.
We (i) distill lessons from mature software registries and emerging agent directory/protocol efforts into six requirements for agent-sharing infrastructure ( [Figure2](https://arxiv.org/html/2510.03495v2#S3.F2 "In 3. Research Agenda ‣ AgentHub: A Registry for Discoverable, Verifiable, and Reproducible AI Agents"));
(ii) describe an open-source reference implementation that operationalizes these requirements via a canonical manifest, version-bound evidence records, and an append-only lifecycle log, with explicit interfaces for search, resolution, and verification ( [section4](https://arxiv.org/html/2510.03495v2#S4 "4. Prototype ‣ AgentHub: A Registry for Discoverable, Verifiable, and Reproducible AI Agents"));
and (iii) report initial discovery results and outline a broader evaluation program that targets each requirement, including deployability costs such as latency, storage growth, and scalability ( [sections5](https://arxiv.org/html/2510.03495v2#S5 "5. Preliminary Evaluation ‣ AgentHub: A Registry for Discoverable, Verifiable, and Reproducible AI Agents") to [6](https://arxiv.org/html/2510.03495v2#S6 "6. Next Steps and Roadmap ‣ AgentHub: A Registry for Discoverable, Verifiable, and Reproducible AI Agents")).
Our aim is to make the design space for agent sharing infrastructure explicit, testable, and iteratively refinable by the community; we submit this work-in-progress to JAWS to solicit feedback on whether the six requirements and the prototype’s manifest/evidence/lifecycle contract capture the right minimal core for safe, automatable agent reuse.

Table 1.
Aspects of existing software registries, and implications for AgentHub

|     |     |     |
| --- | --- | --- |
| Aspects Required | Examples in Software Registries | Implication For AgentHub |
| Metadata and dependency schema | Package manifests (npm, PyPI, HF cards) encode machine-readable metadata and support versioned dependency graphs with auto-resolution (npm, Maven) ( [13](https://arxiv.org/html/2510.03495v2#bib.bib13 ""), [14](https://arxiv.org/html/2510.03495v2#bib.bib14 ""), [15](https://arxiv.org/html/2510.03495v2#bib.bib15 "")) | Shared ontology (capabilities, I/O, protocols, provenance) with explicit agent–agent/service dependencies for reproducibility |
| Trust and provenance | Signing and provenance (npm ECDSA; PyPI TUF) ( [16](https://arxiv.org/html/2510.03495v2#bib.bib16 ""), [14](https://arxiv.org/html/2510.03495v2#bib.bib14 "")) | Signed manifests and reproducibility attestations |
| Governance and lifecycle management | Open vs. curated submission models (npm, CRAN/app stores) ( [17](https://arxiv.org/html/2510.03495v2#bib.bib17 ""), [18](https://arxiv.org/html/2510.03495v2#bib.bib18 ""), [19](https://arxiv.org/html/2510.03495v2#bib.bib19 "")) and update/revocation mechanisms (PyPI TUF) ( [14](https://arxiv.org/html/2510.03495v2#bib.bib14 "")) | Hybrid governance: open submissions with vetting for high-risk agents, plus explicit lifecycle states (active/deprecated/retired) and emergency removal paths |
| Quality signals | Ratings, downloads, badges | Stats, ratings, benchmarks, audit badges for selection |

## 2\. Background and Related Work

To support our vision, we analyze both
pre-agent software registries
and
recent work on agent directory services.

### 2.1. Lessons from Pre-Agent Software Registries

An agent registry can draw lessons from earlier registries ( [Table1](https://arxiv.org/html/2510.03495v2#S1.T1 "In 1. Introduction ‣ AgentHub: A Registry for Discoverable, Verifiable, and Reproducible AI Agents")).

#### 2.1.1. Metadata

Programming language package registries such as npm, PyPI, Maven Central, and CRAN demonstrate the importance of structured metadata and explicit dependency graphs.
Package manifests (e.g., package.json, POM.xml) encode versioning, licensing, and dependency constraints in machine-readable form, enabling automated resolution and reproducible builds ( [14](https://arxiv.org/html/2510.03495v2#bib.bib14 ""), [13](https://arxiv.org/html/2510.03495v2#bib.bib13 ""), [15](https://arxiv.org/html/2510.03495v2#bib.bib15 "")).
SBOM standards require explicit declaration of components and dependency relationships for provenance and traceability ( [20](https://arxiv.org/html/2510.03495v2#bib.bib20 ""), [21](https://arxiv.org/html/2510.03495v2#bib.bib21 "")); emerging AI/ML BOMs extend the same idea to models, datasets, and configurations ( [22](https://arxiv.org/html/2510.03495v2#bib.bib22 ""), [23](https://arxiv.org/html/2510.03495v2#bib.bib23 "")).
Hugging Face relies primarily on model cards with limited dependency information ( [3](https://arxiv.org/html/2510.03495v2#bib.bib3 "")).
For example, while some cards reference required libraries, pretrained checkpoints, or paired datasets, these links are neither mandatory nor normalized into a dependency graph schema.
This lack of standardized schemas leads to inconsistent naming and hampers automated reproducibility ( [9](https://arxiv.org/html/2510.03495v2#bib.bib9 ""), [24](https://arxiv.org/html/2510.03495v2#bib.bib24 ""), [8](https://arxiv.org/html/2510.03495v2#bib.bib8 "")).
The lesson for AgentHub is that agent metadata must go beyond identifiers to include standardized schemas that capture capabilities, input–output modalities, protocol requirements, and declared dependencies.

#### 2.1.2. Provenance

Trust and provenance mechanisms are central to registry design.
Maven Central requires every artifact to be signed with a PGP key; npm supports registry signatures and “trusted publishing” using OIDC ( [13](https://arxiv.org/html/2510.03495v2#bib.bib13 ""), [16](https://arxiv.org/html/2510.03495v2#bib.bib16 "")); and PyPI is adopting The Update Framework (TUF)
for signed metadata ( [14](https://arxiv.org/html/2510.03495v2#bib.bib14 "")).
For agents, provenance is especially critical because dynamic tool bindings and environment access amplify the risks of impersonation or poisoning.
Accordingly, AgentHub should require signed metadata and reproducibility attestations for all entries.

#### 2.1.3. Governance & Submission Policies

Governance models highlight trade-offs between openness and safety.
Npm and PyPI accept broad participation with light pre-checks, while CRAN and app stores such as Apple’s App Store impose strict manual review  ( [25](https://arxiv.org/html/2510.03495v2#bib.bib25 ""), [17](https://arxiv.org/html/2510.03495v2#bib.bib17 "")).
Ecosystems also implement revocation: app stores can remotely disable malicious apps, and PyPI can yank faulty releases ( [14](https://arxiv.org/html/2510.03495v2#bib.bib14 "")).
Notably, the leftpad incident in npm illustrated the ecosystem-wide disruption that can follow from a poorly governed removal ( [26](https://arxiv.org/html/2510.03495v2#bib.bib26 ""), [27](https://arxiv.org/html/2510.03495v2#bib.bib27 "")).
Governance requires care and is non-obvious with autonomous agents.

#### 2.1.4. Discovery & Quality Signals

Registries, model hubs, and
extension marketplaces provide user ratings, download counts, verification badges, and metadata-rich model cards ( [15](https://arxiv.org/html/2510.03495v2#bib.bib15 ""), [28](https://arxiv.org/html/2510.03495v2#bib.bib28 "")).
These signals allow users to identify reputable contributions at scale.
AgentHub should adopt reputation systems such as usage statistics, audits, or benchmark results to complement technical metadata.

### 2.2. Related Work on Emerging Agentic Systems

Several prior works have targeted a related use case: using agents for the services they provide.
However, these works have not considered the registry use case, where actors can go to identify agents and agent components.
The Agent Name Service (ANS) proposes a DNS-style directory for agents, offering secure, protocol-agnostic naming and discovery ( [12](https://arxiv.org/html/2510.03495v2#bib.bib12 "")).
The Agent Capability Negotiation and Binding Protocol (ACNBP) builds on ANS to enable secure capability negotiation among heterogeneous agents ( [29](https://arxiv.org/html/2510.03495v2#bib.bib29 "")).
The NANDA Index introduces a decentralized, peer-to-peer index of agents with cryptographically verifiable “AgentFacts” attesting to capabilities and permissions ( [30](https://arxiv.org/html/2510.03495v2#bib.bib30 "")).
Similarly, the MCP Registry catalogs MCP servers and their tools ( [10](https://arxiv.org/html/2510.03495v2#bib.bib10 ""), [11](https://arxiv.org/html/2510.03495v2#bib.bib11 "")), improving discoverability within the MCP ecosystem.
Finally, curated marketplaces such as the ChatGPT Plugin Store or Alexa Skills Store show how policy-enforced ecosystems can scale with user trust ( [31](https://arxiv.org/html/2510.03495v2#bib.bib31 ""), [32](https://arxiv.org/html/2510.03495v2#bib.bib32 ""), [33](https://arxiv.org/html/2510.03495v2#bib.bib33 "")).
Vendor SDKs are beginning to support an agent-make-agent pattern; for example, Anthropic’s Claude Agent can also generate orchestrated subagents ( [34](https://arxiv.org/html/2510.03495v2#bib.bib34 ""), [35](https://arxiv.org/html/2510.03495v2#bib.bib35 "")).

In formulating AgentHub, we observe that the emerging set of capabilities provided by prior works are necessary but not sufficient for the registry use case and the agent-make-agent scenario.
Addressing this demand requires new infrastructure, moving beyond technical protocols or metadata-only overlays to ensure transparency, interoperability, and accountability, which we outline subsequently in the research agenda ( [section3](https://arxiv.org/html/2510.03495v2#S3 "3. Research Agenda ‣ AgentHub: A Registry for Discoverable, Verifiable, and Reproducible AI Agents")).

## 3\. Research Agenda

We distinguish challenges
shared by all registries ( [section3.1](https://arxiv.org/html/2510.03495v2#S3.SS1 "3.1. Common Registry Challenges ‣ 3. Research Agenda ‣ AgentHub: A Registry for Discoverable, Verifiable, and Reproducible AI Agents"))
from those unique to agents ( [section3.2](https://arxiv.org/html/2510.03495v2#S3.SS2 "3.2. Agent-Specific Considerations ‣ 3. Research Agenda ‣ AgentHub: A Registry for Discoverable, Verifiable, and Reproducible AI Agents")).
We derived the AgentHub agenda as a scoped synthesis of two evidence streams: mature registry ecosystems for software and models, and emerging infrastructure for LLM-based agents.
First, we reviewed the design and operational practices of widely used package and artifact registries (e.g., namespaces, versioning, provenance, governance, and security controls) alongside the software-engineering literature that analyzes their ecosystem dynamics and failure modes.
In parallel, we examined recent agent directory and protocol efforts (e.g., agent cards and tool descriptors, agent-to-agent interaction protocols, and registry-like services) and extracted recurring friction points that arise when reuse becomes automated and cross-protocol.
We then iteratively grouped these observations into a small set of agent challenges and mapped each challenge to the registry mechanisms required to mitigate it.
The result is the set of six requirements in [section3.2](https://arxiv.org/html/2510.03495v2#S3.SS2 "3.2. Agent-Specific Considerations ‣ 3. Research Agenda ‣ AgentHub: A Registry for Discoverable, Verifiable, and Reproducible AI Agents"), organized in [Figure2](https://arxiv.org/html/2510.03495v2#S3.F2 "In 3. Research Agenda ‣ AgentHub: A Registry for Discoverable, Verifiable, and Reproducible AI Agents") to make the traceability from requirements to challenges and objectives explicit.
This process is intended to be reproducible and extensible, so that as agent ecosystems mature, additional challenges can be incorporated and re-mapped without changing the core principle that registry mechanisms must be enforceable and machine-actionable to support autonomous reuse.

Figure 2.
Research agenda for AgentHub, showing how six requirements (§3.2) encounter specific challenges, motivating research directions toward objectives of reproducibility, portability, resilience, and fair discovery.

### 3.1. Common Registry Challenges

As indicated in [Table1](https://arxiv.org/html/2510.03495v2#S1.T1 "In 1. Introduction ‣ AgentHub: A Registry for Discoverable, Verifiable, and Reproducible AI Agents"),
lessons learned from mature registries set the baseline:
entries must carry structured manifests and dependency graphs for reproducibility;
publishers and artifacts must be authenticated with signed metadata and public transparency logs;
namespaces and lifecycle actions (publish, deprecate, revoke) must be governed;
and
the system must remain open and usable through simple APIs.
Proven machinery such as PURL-style identifiers and existing code and model hubs should be incorporated through integration and adaptation, not re-invention.
Since nearly all mainstream registries are centralized and host both metadata and artifacts, we expect similar centralization to be valuable for agent-related artifact management.
However, running agents requires substantial hardware, so directory services will likely be necessary for that use case ( [section2.2](https://arxiv.org/html/2510.03495v2#S2.SS2 "2.2. Related Work on Emerging Agentic Systems ‣ 2. Background and Related Work ‣ AgentHub: A Registry for Discoverable, Verifiable, and Reproducible AI Agents")).

Next we present our research agenda in [Figure2](https://arxiv.org/html/2510.03495v2#S3.F2 "In 3. Research Agenda ‣ AgentHub: A Registry for Discoverable, Verifiable, and Reproducible AI Agents"):
What changes when a registry’s artifacts, and some of its actors, are Agents?

### 3.2. Agent-Specific Considerations

#### 3.2.1. Discovery and Workflow Integration

In an agent ecosystem, the “users” of the registry are both developers and agents that act autonomously at scale, so discovery must be programmatic, rank by capability-and-evidence fit rather than popularity, and integrate directly into planning, CI/CD, and orchestration loops.

_Challenge: Keyword Search & Popularity Bias._
Agents that recommend or install one another can create feedback loops that instill mediocre or unsafe entries.
Experience from software registries highlights how naive signals mislead: Zerouali et al. show that different popularity metrics in npm yield inconsistent results ( [36](https://arxiv.org/html/2510.03495v2#bib.bib36 "")), underlining how reliance on downloads or stars can mislead users; and Jones et al. observed that model popularity on HuggingFace correlates strongly with documentation quality ( [37](https://arxiv.org/html/2510.03495v2#bib.bib37 "")), suggesting that discovery in AgentHub would similarly benefit from incentives for high-quality documentation.
Agents benefit greatly if those signals are captured as structured metadata and verifiable evidence.
Without workflow integration, agents may fall back to ad-hoc search, undermining adoption and reproducibility.

_Solution:_
AgentHub will improve current practice by combining keyword search with structured metadata and evidence linked to benchmarks, incorporating lifecycle states to avoid unsafe or outdated agents. Evaluation should identify which signals such as metadata and documentation quality ensure reliable discovery. Discovery should match user goals to agents by capabilities and evidence, ensuring that popularity does not overshadow quality. This resembles work on recommendation systems for software libraries like Code Librarian, which uses contextual signals to suggest packages ( [38](https://arxiv.org/html/2510.03495v2#bib.bib38 "")). Research benchmarking discovery is necessary to measure precision, recall, and resilience under ecosystem changes.

#### 3.2.2. Trust and Security

Autonomous composition widens the attack surface: agents can install, call, or even generate other agents, so identity, provenance, and revocation must be machine-enforceable.
Entries should use signed manifests, verified namespace control, and provenance for builds, models, and datasets.
A useful precedent comes from the supply-chain domain: the SLSA v1.1 Verification Summary Attestation (VSA) ( [39](https://arxiv.org/html/2510.03495v2#bib.bib39 "")) standardizes how to publish structured, signed evidence of checks performed on artifacts, and AgentHub could adopt an analogous mechanism to keep validation auditable and portable.
Such evidence must be authenticated (with optional third-party attestations for sensitive cases), and revocation or key rotation must propagate quickly across mirrors.

_Challenge: Privacy & Vulnerability._
In software registries, account hijacks and malicious updates already erode trust ( [6](https://arxiv.org/html/2510.03495v2#bib.bib6 "")).
LLM-based agents add privacy-specific attack surfaces: misconfiguration or weak governance can leak sensitive data or intellectual property ( [40](https://arxiv.org/html/2510.03495v2#bib.bib40 ""), [41](https://arxiv.org/html/2510.03495v2#bib.bib41 "")); training-data exposure can reconstruct confidential content ( [42](https://arxiv.org/html/2510.03495v2#bib.bib42 "")); and real incidents have leaked corporate data ( [43](https://arxiv.org/html/2510.03495v2#bib.bib43 "")).
Multi-agent prompt injection can propagate malicious instructions and compromise collective decision-making ( [44](https://arxiv.org/html/2510.03495v2#bib.bib44 ""), [45](https://arxiv.org/html/2510.03495v2#bib.bib45 "")).
Privilege escalation, guardrail bypasses, weak output validation, and insufficient access control enable unauthorized tool use and code execution ( [46](https://arxiv.org/html/2510.03495v2#bib.bib46 "")).
The attack frontier remains underexplored.

_Solution:_
AgentHub will deploy defenses such as signed manifests, provenance attestations ( [14](https://arxiv.org/html/2510.03495v2#bib.bib14 ""), [13](https://arxiv.org/html/2510.03495v2#bib.bib13 "")), verified namespaces via ANS ( [12](https://arxiv.org/html/2510.03495v2#bib.bib12 "")), and protections against typosquatting and package-confusion attacks ( [6](https://arxiv.org/html/2510.03495v2#bib.bib6 ""), [47](https://arxiv.org/html/2510.03495v2#bib.bib47 "")).
AI-specific risks include deserialization exploits and prompt-injection.
It is crucial to test whether defenses from human-mediated registries hold for autonomous agent systems.
New threats call for zero-trust privilege separation, runtime checks for I/O behavior, and privacy-preserving audit pipelines to verify evidence without leaks ( [48](https://arxiv.org/html/2510.03495v2#bib.bib48 ""), [46](https://arxiv.org/html/2510.03495v2#bib.bib46 ""), [43](https://arxiv.org/html/2510.03495v2#bib.bib43 ""), [40](https://arxiv.org/html/2510.03495v2#bib.bib40 "")).

#### 3.2.3. Openness & Governance

At agent scale, publishers include both humans and automated pipelines, so governance must keep namespaces open and verifiable while preventing automated spam, squatting, and opaque takedowns.
Traditional software registries such as PyPI and npm succeeded not only by providing distribution infrastructure but by embracing openness: anyone could publish, namespaces were transparent, and governance processes were clear.
For AgentHub, these properties are even more critical.
Without mechanisms for open contribution, transparent review, and consistent namespace management, registries risk becoming closed silos controlled by a few vendors as ecosystems evolve.

_Challenge: Workforce & Concentration of Expertise._
Many projects are maintained by a single person, creating bus-factor risk.
Zimmermann et al. emphasize that the issue is less maintainer shortage than concentrated control ( [6](https://arxiv.org/html/2510.03495v2#bib.bib6 "")).
Governance models differ: npm allows instant publication, while curated ecosystems like CRAN impose stricter checks.

Even if agents can take over some maintenance tasks, expertise may still concentrate in a few organizations or key models.
This creates the risk that critical agents depend on too few people.
To avoid such single points of failure, AgentHub governance must balance openness with safeguards: partial vetting for high-impact agents, incentives for broader participation, and clear processes to revoke unsafe agents.

_Solution:_
Future work should investigate governance structures that combine openness with verifiability.
Possible directions include decentralized namespace assignment rooted in ANS, community-driven policy boards for resolving disputes, and auditable logs of publication and revocation decisions.
Comparative studies of centralized versus federated governance models can illuminate trade-offs in consistency, adoption, and resilience.
Open questions include how to embed transparency in decision-making without sacrificing agility, and how to make governance mechanisms both fair across domains and enforceable at internet scale.

#### 3.2.4. Ecosystem Interoperability

Planners and orchestrators compose agents and tools across protocols; cross-protocol operation requires a shared metadata core with protocol-specific extensions so intent-based queries can compare agents without losing meaning.
It also requires portable, signed manifests and SBOM-style dependency graphs so tools, models, datasets, and services remain traceable across registries (e.g., npm, PyPI, model hubs) and agent protocols.
Many model hubs still rely on ad-hoc files (e.g., free-form config.json), hurting portability and automated reuse.

_Challenge: One Schema, Many Dialects._
Descriptors in MCP (tools), A2A (roles/behaviors), and ACP (message schemas/policies) use different primitives and evolve at different speeds.
Without a standardized, signed manifest, semantics may be lost in translation, caches drift across mirrors, and naive popularity metrics dominate cross-protocol rankings while ignoring evidence quality and freshness.
Stable identifiers for referenced artifacts are also missing, making cross-registry links fragile.

_Solution:_
We propose a compact capability ontology and a canonical manifest with required fields (capabilities, I/O modalities, protocol bindings, permissions, SBOM-style dependencies) and optional per-ecosystem extensions.
Declarative adapters can then map descriptors to this core and back, validated via round-trip conformance tests.
Stable cross-registry identifiers (e.g., Purl-style) should be introduced and tested end-to-end with npm, PyPI, and model hubs.
Early benchmarks could measure cross-protocol discovery in terms of precision/recall for intent queries, preservation of evidence link, freshness under churn, and ranking fairness as ecosystems scale.

#### 3.2.5. Lifecycle Transparency

Software registries expose version history and revocations; autonomous agents need richer lifecycle states–active, deprecated, rotated, retired, or revoked–with timestamps and rationales.
Because agents evolve dynamically and can continue acting without human oversight, lifecycle visibility is essential for safe reuse and governance.
Discovery should respect these states so outdated entries do not appear healthy by default, and mirrors should propagate state changes within bounded freshness windows.

_Challenge: Dependency Concentration & Abandonment._
The leftpad incident showed how removing even trivial packages disrupted thousands of projects.
Zimmermann et al. found that a small number of npm maintainer accounts control most packages ( [6](https://arxiv.org/html/2510.03495v2#bib.bib6 "")), while Zerouali et al. note that popularity often masks inactivity ( [36](https://arxiv.org/html/2510.03495v2#bib.bib36 "")).
Agents face parallel risks: if many depend on a single base agent or are generated by one entity, failure or compromise could cascade broadly.
Abandonment may occur not only when humans leave but also when autonomous agents stop updating, leaving stale yet discoverable entries in circulation.

_Solution:_
Future work should define lifecycle metadata standards with clear states, timestamps, and rationales, along with monitoring to detect abandonment or unexpected behavioral drift.
Research must also address how deprecated or revoked agents should appear in discovery, who has authority to mark or revoke them, and how federated mirrors should coordinate state changes.
Comparing agent lifecycles with traditional software lifecycles may reveal where new loops–such as agents participating in design and implementation–demand stronger provenance, transparency, and control.

#### 3.2.6. Capability Clarity & Evidence

Registries for conventional software rely on manifests to make artifacts understandable and reproducible, but agents need a richer contract.
For autonomous agents that compose tools and other agents at runtime, manifests must express runtime permissions, preconditions, environment bindings, and protocol roles. A useful analogy is Android’s permission model ( [49](https://arxiv.org/html/2510.03495v2#bib.bib49 "")), where apps declare capabilities in a manifest that the OS validates during installation and use.
Similarly, AgentHub manifests could expose agent capabilities in machine-readable form, enabling tools to flag over-privileged or under-evidenced agents before adoption.
Engineers and agents should be able to plan for behaviors, not just observe them.

_Challenge: Fragmentation & Duplication._
As npm’s “micro-packages” created brittle dependency chains ( [50](https://arxiv.org/html/2510.03495v2#bib.bib50 ""), [51](https://arxiv.org/html/2510.03495v2#bib.bib51 "")), agent ecosystems may spawn “micro-agents” with overlapping functions.
Because agents can autonomously query registries and compose others, duplication and fragility can spread dynamically, enlarging the attack surface and degrading reliability, especially at scale as agents evolve and reimplement overlapping capabilities.

_Challenge: Equivalence._
Beyond functional duplication, a deeper challenge is determining when two agents are truly equivalent.
At a syntactic level, the same agent may appear across multiple repositories, creating confusion about which copy is authoritative.
At a semantic level, multiple agents may claim the same capabilities but diverge in behavior due to nondeterminism and evolution in models, changes in context, and even hardware selection.
Addressing this requires more than metadata alignment: AgentHub should support persistent identifiers, cross-registry attestations, and re-executable evidence pipelines to assess whether two agents are truly equivalent.

_Challenge: Abuse of Ambiguity._
Ambiguity and missing metadata enable attacks in software registries ( [3](https://arxiv.org/html/2510.03495v2#bib.bib3 "")); agents face the same risk.
Unclear manifests let adversaries mimic popular entries or collaborators, echoing typosquatting and account hijackings in npm ( [6](https://arxiv.org/html/2510.03495v2#bib.bib6 "")).
Agents’ autonomous installation/generation can accelerate such propagation unless strong signing and evidence requirements are enforced.

_Solution:_
AgentHub will
(i) standardize machine-readable capability schemas covering capabilities, modalities, protocol roles, and dependencies enforced at publish time ( [3](https://arxiv.org/html/2510.03495v2#bib.bib3 ""), [9](https://arxiv.org/html/2510.03495v2#bib.bib9 ""));
(ii) support lightweight, re-executable (idempotent) evidence pipelines linking claims to traces or benchmark runs across versions;
and
(iii) add badges or similar checks as digital nudges ( [52](https://arxiv.org/html/2510.03495v2#bib.bib52 "")).

## 4\. Prototype

AgentHub is grounded in a concrete, open-source reference implementation that makes the agenda’s mechanisms directly testable.
The prototype is intentionally not an agent runtime.
Instead, it is a registry layer that supports publishing, discovery, and reuse of agents under machine-checkable contracts, such as standardized capability manifests and evidence, lifecycle transparency, protocol interoperability, and a baseline trust and security model suitable for automated reuse.
The goal of the reference implementation is to provide a minimal but complete substrate that can publish, index, search, resolve, verify, and evolve so that the requirements in [Figure2](https://arxiv.org/html/2510.03495v2#S3.F2 "In 3. Research Agenda ‣ AgentHub: A Registry for Discoverable, Verifiable, and Reproducible AI Agents") can be evaluated empirically and iterated with the community.

### 4.1. Architecture & Scope

The prototype follows a design that stresses mutable metadata and immutable artifacts.
Agent entries are represented as versioned snapshots of a canonical manifest stored immutably by content hash, while the registry maintains mutable metadata (indexes, lifecycle state, and evidence summaries) that can evolve without changing the underlying artifact.
This makes verification straightforward, so clients can recompute the hash of a retrieved manifest and compare it to the registry’s recorded digest, and signatures can be defined over that digest rather than over an ambiguous, mutable document.

At a high level, the system exposes a small set of operations that map directly to the user and agent workflows described in [section3.2.1](https://arxiv.org/html/2510.03495v2#S3.SS2.SSS1 "3.2.1. Discovery and Workflow Integration ‣ 3.2. Agent-Specific Considerations ‣ 3. Research Agenda ‣ AgentHub: A Registry for Discoverable, Verifiable, and Reproducible AI Agents"): (i) publish an agent version, (ii) search and rank candidates, (iii) resolve a stable identifier and version range to a concrete version and endpoint bindings, (iv) verify provenance signals, (v) attach evidence records, and (vi) append lifecycle events that affect discovery and resolution.
Discovery is treated as a first-class interface, because in an agent ecosystem the users of the registry include both humans and agents, and discovery must integrate into planning and orchestration loops rather than requiring manual browsing.

### 4.2. Canonical Manifest, Evidence Records, and Lifecycle Events

A central deliverable of the prototype is a core manifest with publish-time validation.
The manifest provides the minimum required fields that enable automation and reproducibility across heterogeneous ecosystems, including stable identifiers; declared capabilities and I/O modalities; protocol bindings; runtime permissions and preconditions; SBOM-style dependency references; explicit lifecycle state; and an evidence policy that declares what kinds of evidence are expected and how freshness is interpreted.
Optional per-ecosystem extensions allow native descriptors to be carried without forcing premature convergence.
This design follows our "one schema, many dialects" requirement, as we will keep a required core that is stable enough to be validated and indexed, while preserving protocol-specific descriptors in an extension space ( [Figure3](https://arxiv.org/html/2510.03495v2#S4.F3 "In 4.2. Canonical Manifest, Evidence Records, and Lifecycle Events ‣ 4. Prototype ‣ AgentHub: A Registry for Discoverable, Verifiable, and Reproducible AI Agents")).

![Refer to caption](https://arxiv.org/html/2510.03495v2/Manifest.png)Figure 3.
Zoomed excerpt of an example AgentHub manifest illustrating capability declarations (I/O schemas and constraints) and protocol bindings for multiple ecosystems (A2A, MCP). AgentHub validates and indexes these fields to support intent-accurate discovery and cross-protocol resolution.

At publish time, the core manifest is validated under a strict schema, canonicalized deterministically, and stored as an immutable blob keyed by its hash.
The schema is designed to be machine-actionable with capabilities including stable identifiers and, where possible, structured input/output expectations; protocol bindings name the interaction dialect (e.g., MCP vs. A2A) and provide resolvable endpoints; permissions declare resource access explicitly (network, filesystem, tool access, data handling), so that automated selection can incorporate risk constraints rather than relying on prose.

The prototype also defines an evidence record as a separate, version-bound object that links a capability claim (or a broader "fitness claim") to auditable artifacts. Each record binds to a specific agent version and manifest digest, and carries (i) the method/recipe used to produce the evidence (e.g., harness version, container digest/workflow reference), (ii) inputs (config, seeds, environment), (iii) outputs as immutable artifacts with hashes, and (iv) optional attestations.
Evidence is stored immutably and referenced from the registry, enabling third parties to reproduce or independently re-run checks.
This operationalizes our argument that agents benefit when discovery signals are captured as structured metadata and verifiable evidence rather than popularity or documentation alone.

Finally, the prototype treats lifecycle as an append-only event log rather than a single mutable flag.
Agent versions move through explicit states (e.g., active, deprecated, retired, revoked), and each state transition is recorded with a timestamp and rationale. The registry’s default behaviors respect these states.
Resolution must not return revoked/retired versions, and discovery must incorporate lifecycle state into ranking and filtering.
This is essential for lifecycle visibility and fast revocation in ecosystems where reuse is automated and version churn is frequent.

### 4.3. Interoperability and Discovery as Registry Mechanisms

Interoperability in our prototype will be implemented as declaractive adapters that map native protocol descriptors into the core manifest and back. MCP and A2A use different primitives and evolve at different speeds, so a standardized, signed manifest is needed to prevent semantic loss and cache drift across mirrors.
In the prototype, protocol bindings provide a stable, comparable surface (capabilities, modalities, endpoints, auth requirements), while the original descriptor (e.g., an A2A Agent Card or MCP tool descriptor) can be stored in extensions for lossless round-trip translation where possible.
The concrete outcome is testable: adapters are validated through round-trip conformance tests that check preservation of core semantics and the stability of cross-registry identifiers.

Discovery is implemented as a registry concern because it is one of the primary ways automation will consume AgentHub.
Our prototype will provide programmatic search over manifest fields and evidence signals, and a resolution interface that maps stable identifiers and version ranges to an exact version and protocol endpoints.
Ranking is designed to be evidence forward.
Rather than defaulting to popularity proxies, the registry returns candidates with explicit reasons such as relevance from structured metadata, evidence coverage and freshness, lifecycle state, and compatibility constraints. This directly responds to the "keyword search and popularity bias" challenge identified in [Figure2](https://arxiv.org/html/2510.03495v2#S3.F2 "In 3. Research Agenda ‣ AgentHub: A Registry for Discoverable, Verifiable, and Reproducible AI Agents").

## 5\. Preliminary Evaluation

AgentHub’s research agenda ( [Figure2](https://arxiv.org/html/2510.03495v2#S3.F2 "In 3. Research Agenda ‣ AgentHub: A Registry for Discoverable, Verifiable, and Reproducible AI Agents")) frames six requirements that collectively target four objectives: fair, intent-accurate discovery; resilient federated operations; cross-ecosystem portability; and reproducible, auditable reuse.

In addition to early evaluations on discovery (discussed below), we propose a concrete evaluation program that combines (i) controlled benchmarks that isolate mechanisms and quantify trade-offs, (ii) adversarial experiments that test whether defenses remain effective under autonomous reuse, and (iii) longitudinal, deployment-level measurements that capture governance and ecosystem dynamics. These evaluation plans are discussed below.

### 5.1. Evaluating Discovery and Workflow Integration

#### 5.1.1. Method:

We implemented a two-stage recommendation pipeline on top of ANS that recommends A2A agents using their Agent Cards as structured, comparable descriptions. [Figure4](https://arxiv.org/html/2510.03495v2#S5.F4 "In 5.1.1. Method: ‣ 5.1. Evaluating Discovery and Workflow Integration ‣ 5. Preliminary Evaluation ‣ AgentHub: A Registry for Discoverable, Verifiable, and Reproducible AI Agents") summarizes the interaction pattern, where a client submits a query, the recommendation system consults the registry to retrieve and rank candidates, and the selected agent is returned to the client.

Figure 4.
Two-stage discovery workflow used in our initial evaluation.
A client query is handled by a recommendation system that consults the registry for candidate agents, then returns a ranked selection to the client.

In stage one, the recommendation system applies text-based retrieval over A2A agent cards to identify candidate agents relevant to a user query.
We evaluate three retrieval strategies: a lexical approach (BM25), a semantic embedding-based approach, and a hybrid method that combines lexical and semantic signals. ( [53](https://arxiv.org/html/2510.03495v2#bib.bib53 ""), [54](https://arxiv.org/html/2510.03495v2#bib.bib54 ""), [55](https://arxiv.org/html/2510.03495v2#bib.bib55 ""))

This stage is designed to efficiently narrow the candidate set using static, declarative agent descriptions.

In stage two, the highest-ranked candidates from stage one are further evaluated using a structured, interview-based verification process.
This phase engages agents directly to elicit behavioral evidence, allowing the system to assess whether an agent’s actual capabilities align with the inferred intent of the query.
Importantly, this stage is intended to produce explicit evidence of suitability, rather than re-rank candidates based on textual similarity.

The evaluation registers eight A2A-based agents as live servers, meaning each agent is deployed as an independently running service that exposes its A2A interface and responds to real-time queries. The agents are intentionally organized into four pairs with overlapping but distinct capabilities to create controlled ambiguity during discovery (e.g., multiple debugging or performance-related agents with different specializations). We evaluate the system using 24 semi-ambiguous natural-language queries, each designed so that more than one agent could plausibly address the request, but only one agent represents the intended primary capability.
For example, the query “Agent that diagnoses backend crashes occurring only under concurrent load” could be handled by several debugging-related agents, but the “code-debugging-assistant” is designated as the best match because it explicitly targets concurrency-related logic faults. Ground-truth labels for all queries were assigned based on domain expertise and each agent’s intended functional scope. This dataset design reflects realistic discovery scenarios in which advertised capabilities overlap, requiring deeper behavioral validation beyond surface-level descriptions.

The study measures ranking quality and efficiency using Precision@1, Recall@3, and latency, averaged across multiple runs to account for LLM nondeterminism in the interview stage. Precision@1 measures the fraction of queries for which the top-ranked (recommended) agent is the correct one.
Recall@3 measures the fraction of queries for which the correct agent appears within the top three results.
Latency captures the total end-to-end time required to process a query and return a recommendation.
We first compare retrieval-only performance across lexical, semantic, and hybrid methods, and then evaluate the full two-phase pipeline that supplements retrieval with structured interview-based verification.

#### 5.1.2. Results:

Hybrid retrieval achieves the best balance among retrieval-only methods (Precision@1 83.33%, Recall@3 95.83%, latency 0.57s), while the full pipeline maintains high Recall@3 (98.61% ±\\pm 1.97%) at substantially higher latency (101.30s ±\\pm 7.25s), explicitly positioning the interview stage as an evidence-producing mechanism rather than pure ranking booster.
[Table2](https://arxiv.org/html/2510.03495v2#S5.T2 "In 5.1.2. Results: ‣ 5.1. Evaluating Discovery and Workflow Integration ‣ 5. Preliminary Evaluation ‣ AgentHub: A Registry for Discoverable, Verifiable, and Reproducible AI Agents") summarizes the results of different phases and retrieval methods.

Table 2. Phase 1 Retrieval vs. Two-Phase Pipeline

|     |     |     |     |
| --- | --- | --- | --- |
| Method | P@1 | R@3 | Lat (s) |
| Phase 1: Text Retrieval |
| BM25 | 75.00 | 91.67 | 0.01 |
| Semantic | 66.67 | 100.00 | 0.85 |
| Hybrid | 83.33 | 95.83 | 0.57 |
| Phase 2: Hybrid + Interviews |
| Full Pipeline | 73.61 ± 1.97 | 98.61 ± 1.97 | 101.30 ± 7.25 |

## 6\. Next Steps and Roadmap

We treat the results from [section5](https://arxiv.org/html/2510.03495v2#S5 "5. Preliminary Evaluation ‣ AgentHub: A Registry for Discoverable, Verifiable, and Reproducible AI Agents") as an initial benchmark for the "Discovery & Workflow Integration" requirement, and we will expand it in three ways.
First, we will scale beyond a small, curated pool into a seed corpus that includes heterogeneous agent types (tool-using agents, agent-to-agent coordinators, domain-specialized micro agents) and deliberately introduce documentation and metadata variance, reflecting real registry messiness rather than uniform A2A-only artifacts.
Second, we will evaluate discovery not only by ranking metrics but also by downstream task success in workflows (e.g., whether a selected agent completes a CI/CD task under policy constraints), measuring end-to-end correctness and the cost of mis-selection.
Third, we will evaluate robustness and fairness by injecting popularity signals and churn, testing whether intent and evidence can dominate naive "stars/downloads" effects as ecosystems scale, consistent with the paper’s warning that popularity loops can dominate discovery.

### 6.1. Evaluating Trust and Security

AgentHub argues that autonomous composition widens the attack surface and makes provenance, revocation, and enforceable identity central.
The key evaluation question is not whether individual defenses exist, but whether they hold when (a) agents can publish agents, (b) agents can select agents, and (c) reuse is automated at scale.
We therefore will evaluate Trust & Security through an explicit registry red-team suite that attempts to publish and propagate adversarial artifacts, including typosquatting and package-confusion analogs, identity spoofing, over-privileged manifests, malicious updates, and prompt-injection or tool-misuse behaviors embedded in agent workflows.

Evaluation outcomes will include attack success rates under different enforcement policies (e.g., publish-time schema enforcement, signature requirements, namespace verification, evidence-gated promotion), time-to-detection and time-to-containment, and the degree to which security signals can be made machine-actionable without turning governance into opaque central control.
We will also explicitly test for agents that misrepresent capabilities for selection advantage, as this was an observed weakness during our discovery evaluation. We will introduce adversarial capability inflation agents and measure whether evidence requirements and behavioral checks can detect and penalize strategic misrepresentation.

### 6.2. Evaluating Openness and Governance

The paper motivates governance as a balance between openness (low-friction publishing, transparent namespaces) with safeguards against spam, squatting, and opaque takedowns.
We will therefore structure evaluation for this requirement in two phases.
In the prototype phase, we run controlled publishing studies that measure submission friction, correctness of manifests under enforcement, and how often policy checks block legitimate submissions versus adversarial or low-quality ones.
In the deployment phase, we will instrument the registry for longitudinal metrics such as submission volume, acceptance/rejection rates by reason code, median time-to-resolution for disputes, rates of automated publishing versus human publishing, and the concentration of publishing authority across namespaces.

We will also run governance stress tests that simulate realistic failure modes such as coordinated spam attempts, namespace disputes, and emergency revocations.
The goal is to empirically characterize the trade-offs between curated and open models for agents, under the distinct condition that many publishers may themselves be automated pipelines.

### 6.3. Evaluating Ecosystem Interoperability

In AgentHub, we see interoperability as more than just supporting MCP and A2A; it is specifically "one schema, many dialects," with canonical manifests and declarative adapters that will be validated by round-trip conformance tests so that semantics are preserved across protocol translations.
This requirement is well-suited to a rigorous, testable evaluation in which we will define a suite of reference agents expressed natively in different ecosystems (e.g., MCP tool descriptors and A2A agent cards), translate them into the AgentHub core manifest, and translate back, measuring round-trip fidelity at the level of capabilities, modalities, permissions, dependencies, and evidence links.
We will complement this with cross-protocol discovery benchmarks, such as identical intent queries that should retrieve comparable agents regardless of whether the underlying descriptor dialect is MCP- or A2A-native.
Evidence links should also remain resolvable and correctly bound to versions across protocol boundaries.

Interoperability evaluation will also include failure characterization to investigate which fields are lossy under translation, which protocol features cannot be expressed in a shared core without distortion, and what minimal portable contract is sufficient for safe cross-ecosystem reuse.

### 6.4. Evaluating Lifecycle Transparency

Lifecycle transparency becomes meaningful only if lifecycle state changes propagate quickly enough to affect automated reuse.
This paper argues for explicit states (active, deprecated, rotated, retired, revoked) with timestamps and rationales, and for coordination across federated mirrors.
We will evaluate this requirement via churn experiments that simulate realistic ecosystem dynamics including frequent version releases, dependency updates, emergency revocations, and key rotations.
We will measure propagation latency of lifecycle events across mirrors and caches, the degree to which clients honor lifecycle state in discovery and selection, and failure cases where stale mirrors lead to unsafe reuse.

### 6.5. Evaluating Capability Clarity and Evidence

Capability clarity and evidence is the requirement that most sharply differentiates AgentHub from existing directories.
Our near-term priorities include enforcing machine-readable capability schemas at publish time and supporting lightweight, re-executable evidence pipelines that link capability claims to benchmark runs or traces across versions.
We will evaluate this along two axes: whether manifests become sufficiently precise to support automated planning and risk checks, and whether evidence is both (a) discriminative for selection and (b) reproducible and auditable.

On precision, we plan to test whether an enforced manifest schema reduces ambiguity and capability inflation by measuring inter-rater agreement among humans and agents when mapping natural-language intents to manifest claims, and by measuring how often over-privileged or under-specified agents can pass publish-time validations.
On evidence, we will treat evidence records as structured, signed, re-runnable artifacts and quantify (i) reproducibility across environments and repeated runs, (ii) stability under model or dependency updates, and (iii) the relationship between evidence signals and downstream task success.
Interview-based verification can be used as one evidence mechanism for ambiguous intents, and we will assess its value in terms of confidence/correctness trade-offs.

### 6.6. Practical Considerations

Beyond ranking quality, we will report operational costs that determine deployability.
We will measure (i) publish-time overhead for validation, canonicalization, and signature checks, (ii) end-to-end query latency for search, resolution, and verification, and (iii) storage growth for manifests, evidence artifacts, and lifecycle logs.
We will scale the number of registered agents and update churn to report throughput (publishes, queries), tail latency, and the dominant bottlenecks.

### 6.7. Roadmap (Jan–Sep 2026).

We treat this workshop paper as Phase 1 of a longer effort that culminates in a journal-length contribution and a reusable artifact suite.
Over the next eight months we will stabilize the core contract, strengthen interoperability and evidence plumbing, expand evaluation coverage across all six requirements, and release artifacts that others can adopt and extend.
Jan–Mar: freeze the v0.x manifest and evidence schemas; implement publish-time validation and canonicalization; add lifecycle events and signature verification; release a minimal CLI/API.
Apr–May: implement declarative adapters for at least two dialects (MCP and A2A) with round-trip conformance tests; evaluate lifecycle freshness and revocation propagation under churn and caching.
Jun–Aug: scale the seed corpus and intent suite; broaden from discovery metrics to workflow-level outcomes under policy constraints; add a robustness suite (inflation, malicious updates, typosquatting, prompt/tool misuse).
Sep: package schemas, validators, adapters, benchmarks, and harnesses as a reproducible bundle and submit the journal-length manuscript.

## 7\. CONCLUSION

Agent ecosystems are scaling faster than the infrastructure needed to make them discoverable, comparable, and governable under automated reuse.
We advance AgentHub as a registry substrate and research agenda grounded in a reference implementation centered on (i) a canonical, publish-time validated manifest that is indexable yet extensible, (ii) version-bound evidence records that connect capability and fitness claims to auditable artifacts, and (iii) lifecycle states enforced by default in resolution and discovery.
Our discovery benchmark quantifies the value of structured, machine-actionable metadata for retrieval and clarifies when behavioral evidence is needed under ambiguous intents, motivating the broader evaluation program in [section5](https://arxiv.org/html/2510.03495v2#S5 "5. Preliminary Evaluation ‣ AgentHub: A Registry for Discoverable, Verifiable, and Reproducible AI Agents").
Together, AgentHub moves selection and governance signals out of prose and into enforceable, machine-checkable contracts, enabling auditable, comparable, and automatable agent reuse.

Data Availability. The artifact, including manifest.yaml and evidence\_record.yaml, is available at ( [56](https://arxiv.org/html/2510.03495v2#bib.bib56 "")).

## Acknowledgments

Davis acknowledges support from NSF awards #2343596, #2537308, and #2452533.
Thiruvathukal and Läufer acknowledge support from NSF award #2343595. Thiruvathukal acknowledges support from NSF award #2537309.

## References

- (1)
J. Gottweis _et al._, “Towards an AI co-scientist.” \[Online\]. Available: [http://arxiv.org/abs/2502.18864](http://arxiv.org/abs/2502.18864 "")
- (2)
Y. Zhang, H. Ruan, Z. Fan, and A. Roychoudhury, “Autocoderover: Autonomous program improvement,” in _ACM SIGSOFT International Symposium on Software Testing and Analysis (ISSTA)_. ACM, 2024, p. 1592–1604.

- (3)
W. Jiang, N. Synovic, M. Hyatt, T. R. Schorlemmer, R. Sethi, Y.-H. Lu, G. K. Thiruvathukal, and J. C. Davis, “An empirical study of pre-trained model reuse in the Hugging Face deep learning model registry,” in _Proceedings of the 45th International Conference on Software Engineering_. IEEE Press, 2023.

- (4)
Google. (2025) What is an ai agent? Accessed: 2025-09-26. \[Online\]. Available: [https://cloud.google.com/discover/what-are-ai-agents](https://cloud.google.com/discover/what-are-ai-agents "")
- (5)
J. He, C. Treude, and D. Lo, “LLM-based multi-agent systems for software engineering: Literature review, vision, and the road ahead,” _ACM Transactions on Software Engineering and Methodology_, vol. 34, no. 5, pp. 1–30, May 2025. \[Online\]. Available: [https://doi.org/10.1145/3712003](https://doi.org/10.1145/3712003 "")
- (6)
M. Zimmermann, C.-A. Staicu, C. Tenny, and M. Pradel, “Small world with high risks: A study of security threats in the npm ecosystem,” in _28th USENIX Security Symposium (USENIX Security 19)_. Santa Clara, CA: USENIX Association, 2019.

- (7)
T. R. Schorlemmer, K. G. Kalu, L. Chigges, K. M. Ko, E. A.-M. A. Isghair, S. Bagchi, S. Torres-Arias, and J. C. Davis, “Signing in four public software package registries: Quantity, quality, and influencing factors,” in _IEEE Security & Privacy (S&P)_, 2024.

- (8)
W. Jiang, J. Yasmin, J. Jones, N. Synovic, J. Kuo, N. Bielanski, Y. Tian, G. K. Thiruvathukal, and J. C. Davis, “Peatmoss: A dataset and initial analysis of pre-trained models in open-source software,” in _\[MSR’24\] International Conference on Mining Software Repositories_, 2024.

- (9)
W. Jiang, M. Kim, C. Cheung, H. Kim, G. K. Thiruvathukal, and J. C. Davis, “‘I see models being a whole other thing’: an empirical study of pre-trained model naming conventions and a tool for enhancing naming consistency,” _Empirical Software Engineering_, vol. 30, p. 155, 2025.

- (10)
“Model context protocol: MCP registry (GitHub),” [https://github.com/modelcontextprotocol/registry](https://github.com/modelcontextprotocol/registry ""), accessed 2025-09-12.

- (11)
“Introducing the MCP registry (preview),” [https://blog.modelcontextprotocol.io/posts/2025-09-08-mcp-registry-preview/](https://blog.modelcontextprotocol.io/posts/2025-09-08-mcp-registry-preview/ ""), accessed 2025-09-12.

- (12)
K. Huang, V. S. Narajala, I. Habler, and A. Sheriff, “Agent name service (ANS): A universal directory for secure AI agent discovery and interoperability,” 2025. \[Online\]. Available: [https://arxiv.org/abs/2505.10609](https://arxiv.org/abs/2505.10609 "")
- (13)
“Trusted publishing for npm packages,” [https://docs.npmjs.com/trusted-publishers/](https://docs.npmjs.com/trusted-publishers/ ""), accessed 2025-09-12.

- (14)
“PEP 458: Secure PyPI downloads with signed repository metadata,” [https://peps.python.org/pep-0458/](https://peps.python.org/pep-0458/ ""), accessed 2025-09-12.

- (15)
“Hugging Face model cards,” [https://huggingface.co/docs/hub/en/model-cards](https://huggingface.co/docs/hub/en/model-cards ""), accessed 2025-09-12.

- (16)
“About ECDSA registry signatures (npm),” [https://docs.npmjs.com/about-registry-signatures/](https://docs.npmjs.com/about-registry-signatures/ ""), accessed 2025-09-12.

- (17)
“npm trusted publishing GA and account protections,” [https://github.blog/changelog/2025-07-31-npm-trusted-publishing-with-oidc-is-generally-available/](https://github.blog/changelog/2025-07-31-npm-trusted-publishing-with-oidc-is-generally-available/ ""), accessed 2025-09-12.

- (18)
“CRAN repository policy,” [https://cran.r-project.org/web/packages/policies.html](https://cran.r-project.org/web/packages/policies.html ""), accessed 2025-09-12.

- (19)
“Checklist for CRAN submissions,” [https://cran.r-project.org/web/packages/submission\_checklist.html](https://cran.r-project.org/web/packages/submission_checklist.html ""), accessed 2025-09-12.

- (20)
National Telecommunications and Information Administration, “The Minimum Elements for a Software Bill of Materials (SBOM),” U.S. Department of Commerce, Tech. Rep., 2021, accessed: 2025-09-28. \[Online\]. Available: [https://www.ntia.gov/sites/default/files/publications/sbom\_minimum\_elements\_report\_0.pdf](https://www.ntia.gov/sites/default/files/publications/sbom_minimum_elements_report_0.pdf "")
- (21)
——, “Framing Software Component Transparency: Establishing a common software bill of materials (SBOM),” U.S. Department of Commerce, Tech. Rep., 2021, accessed: 2025-09-28. \[Online\]. Available: [https://www.ntia.gov/files/ntia/publications/ntia\_sbom\_framing\_2nd\_edition\_20211021.pdf](https://www.ntia.gov/files/ntia/publications/ntia_sbom_framing_2nd_edition_20211021.pdf "")
- (22)
B. Xia, D. Zhang, Y. Liu, Q. Lu, Z. Xing, and L. Zhu, “Trust in Software Supply Chains: Blockchain-Enabled SBOM and the AIBOM Future,” 2024. \[Online\]. Available: [https://arxiv.org/abs/2307.02088](https://arxiv.org/abs/2307.02088 "")
- (23)
K. Bennet, G. K. Rajbahadur, A. Suriyawongkul, and K. Stewart, “Implementing AI Bill of Materials (AI BOM) with SPDX 3.0: A Comprehensive Guide to Creating AI and Dataset Bill of Materials,” _arXiv preprint arXiv:2504.16743_, 2025.

- (24)
W. Jiang, N. Synovic, R. Sethi, A. Indarapu, M. Hyatt, T. R. Schorlemmer, G. K. Thiruvathukal, and J. C. Davis, “An empirical study of artifacts and security risks in the pre-trained model supply chain,” in _ACM Workshop on Software Supply Chain Offensive Research and Ecosystem Defenses_, 2022, p. 105–114.

- (25)
Apple Inc., “App Store review guidelines,” 2025, accessed: 2025-09-15. \[Online\]. Available: [https://developer.apple.com/app-store/review/guidelines/](https://developer.apple.com/app-store/review/guidelines/ "")
- (26)
npm, Inc., “kik, left-pad, and npm,” [https://blog.npmjs.org/post/141577284765/kik-left-pad-and-npm](https://blog.npmjs.org/post/141577284765/kik-left-pad-and-npm ""), 2016, accessed: 2025-09-28.

- (27)
C. Williams, “How one developer just broke Node, Babel and thousands of projects in 11 lines of JavaScript,” [https://www.theregister.com/2016/03/23/npm\_left\_pad\_chaos/](https://www.theregister.com/2016/03/23/npm_left_pad_chaos/ ""), 2016, accessed: 2025-09-28.

- (28)
P. Kadasi, S. R. Kondam, S. V. Chaturvedula, R. Sen, A. Saha, S. Sikdar, S. Sarkar, S. Mittal, R. Jindal, and M. Singh, “Model hubs and beyond: Analyzing model popularity, performance, and documentation,” 2025. \[Online\]. Available: [https://arxiv.org/abs/2503.15222](https://arxiv.org/abs/2503.15222 "")
- (29)
K. Huang, A. Sheriff, V. S. Narajala, and I. Habler, “Agent capability negotiation and binding protocol (ACNBP),” 2025. \[Online\]. Available: [https://arxiv.org/abs/2506.13590](https://arxiv.org/abs/2506.13590 "")
- (30)
“Unlocking the internet of AI agents via the NANDA index and verified agentfacts,” [https://arxiv.org/abs/2507.14263](https://arxiv.org/abs/2507.14263 ""), 2025, arXiv preprint.

- (31)
OpenAI, “ChatGPT plugins,” 2023, accessed: 2025-09-15. \[Online\]. Available: [https://openai.com/index/chatgpt-plugins/](https://openai.com/index/chatgpt-plugins/ "")
- (32)
Federal Trade Commission, “Hey Alexa, is this skill safe? taking a closer look at the Alexa skill ecosystem,” U.S. Federal Trade Commission, Tech. Rep., 2019, accessed: 2025-09-15. \[Online\]. Available: [https://www.ftc.gov/system/files/documents/public\_events/1582978/hey\_alexa\_is\_this\_skill\_safe\_-\_taking\_a\_closer\_look\_at\_the\_alexa\_skill\_ecosystem.pdf](https://www.ftc.gov/system/files/documents/public_events/1582978/hey_alexa_is_this_skill_safe_-_taking_a_closer_look_at_the_alexa_skill_ecosystem.pdf "")
- (33)
Amazon, “Policy requirements for Alexa skills,” 2025, accessed: 2025-09-15. \[Online\]. Available: [https://developer.amazon.com/en-US/docs/alexa/custom-skills/policy-requirements-for-an-alexa-skill.html](https://developer.amazon.com/en-US/docs/alexa/custom-skills/policy-requirements-for-an-alexa-skill.html "")
- (34)
Anthropic. (2025) Building agents with the Claude Agent SDK. Accessed: 2025-09-29. \[Online\]. Available: [https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk "")
- (35)
——. (2025) Subagents in the Claude Agent SDK. Accessed: 2025-09-29. \[Online\]. Available: [https://docs.anthropic.com/en/docs/agents/claude-agent-sdk/subagents](https://docs.anthropic.com/en/docs/agents/claude-agent-sdk/subagents "")
- (36)
A. Zerouali, T. Mens, G. Robles, and J. M. Gonzalez-Barahona, “On the diversity of software package popularity metrics: An empirical study of npm,” in _19 IEEE Conference on Software Analysis, Evolution and Reengineering (SANER)_, 2019.

- (37)
J. Jones, W. Jiang, N. Synovic, G. K. Thiruvathukal, and J. C. Davis, “What do we know about Hugging Face? A systematic literature review and quantitative validation of qualitative claims,” in _\[ESEM’24\] ACM/IEEE International Symposium on Empirical Software Engineering and Measurement_, 2024.

- (38)
L. Tao, A.-P. Cazan, S. Ibraimoski, and S. Moran, “Code Librarian: A software package recommendation system,” in _International Conference on Software Engineering: Software Engineering in Practice (ICSE-SEIP)_. IEEE, 2023, pp. 196–198.

- (39)
SLSA Authors, “SLSA Verification Summary Attestation (VSA) Specification v1.1,” [https://slsa.dev/spec/v1.1/verification\_summary](https://slsa.dev/spec/v1.1/verification_summary ""), 2024, accessed: 2025-09-29.

- (40)
B. Wang, W. He, S. Zeng, Z. Xiang, Y. Xing, J. Tang, and P. He, “Unveiling privacy risks in LLM agent memory,” in _Proceedings of the 63rd Annual Meeting of the Association for Computational Linguistics (Volume 1: Long Papers)_, 2025.

- (41)
A. Zharmagambetov, C. Guo, I. Evtimov, M. Pavlova, R. Salakhutdinov, and K. Chaudhuri, “AgentDAM: Privacy leakage evaluation for autonomous web agents,” 2025. \[Online\]. Available: [https://arxiv.org/abs/2503.09780](https://arxiv.org/abs/2503.09780 "")
- (42)
N. Carlini, F. Tramer, E. Wallace, M. Jagielski, A. Herbert-Voss, K. Lee, A. Roberts, T. Brown, D. Song, U. Erlingsson, A. Oprea, and C. Raffel, “Extracting training data from large language models,” 2021. \[Online\]. Available: [https://arxiv.org/abs/2012.07805](https://arxiv.org/abs/2012.07805 "")
- (43)
S. Ray. (2023) Samsung bans ChatGPT and other chatbots for employees after sensitive code leak. Accessed: 2025-04-18. \[Online\]. Available: [https://www.forbes.com/sites/siladityaray/2023/05/02/samsung-bans-chatgpt-and-other-chatbots-for-employees-after-sensitive-code-leak/](https://www.forbes.com/sites/siladityaray/2023/05/02/samsung-bans-chatgpt-and-other-chatbots-for-employees-after-sensitive-code-leak/ "")
- (44)
D. Lee and M. Tiwari, “Prompt infection: LLM-to-LLM prompt injection within multi-agent systems,” 2024. \[Online\]. Available: [https://arxiv.org/abs/2410.07283](https://arxiv.org/abs/2410.07283 "")
- (45)
J. Shi, Z. Yuan, G. Tie, P. Zhou, N. Z. Gong, and L. Sun, “Prompt injection attack to tool selection in LLM agents,” 2025. \[Online\]. Available: [https://arxiv.org/abs/2504.19793](https://arxiv.org/abs/2504.19793 "")
- (46)
V. S. Narajala, K. Huang, and I. Habler, “Securing GenAI multi-agent systems against tool squatting: A zero trust registry-based approach,” 2025. \[Online\]. Available: [https://arxiv.org/abs/2504.19951](https://arxiv.org/abs/2504.19951 "")
- (47)
W. Jiang, B. Çakar, M. Lysenko, and J. C. Davis, “Confuguard: Using metadata to detect active and stealthy package confusion attacks accurately and at scale,” 2025. \[Online\]. Available: [https://arxiv.org/abs/2502.20528](https://arxiv.org/abs/2502.20528 "")
- (48)
P. He, Y. Lin, S. Dong, H. Xu, Y. Xing, and H. Liu, “Red-teaming LLM multi-agent systems via communication attacks,” 2025. \[Online\]. Available: [https://arxiv.org/abs/2502.14847](https://arxiv.org/abs/2502.14847 "")
- (49)
“Permissions on Android,” [https://developer.android.com/guide/topics/permissions/overview](https://developer.android.com/guide/topics/permissions/overview ""), 2025, accessed: 2025-09-29.

- (50)
R. G. Kula, A. Ouni, D. M. German, and K. Inoue, “On the impact of micro-packages: An empirical study of the npm JavaScript ecosystem,” 2017. \[Online\]. Available: [https://arxiv.org/abs/1709.04638](https://arxiv.org/abs/1709.04638 "")
- (51)
R. Abdalkareem, O. Nourry, S. Wehaibi, S. Mujahid, and E. Shihab, “Why do developers use trivial packages? An empirical case study on npm,” in _Foundations of Software Engineering_, ser. ESEC/FSE 2017, 2017.

- (52)
C. Brown, “Digital nudges for encouraging developer actions,” in _International Conference on Software Engineering: Companion Proceedings_, 2019, pp. 202–205.

- (53)
A. Ahmad Khan and S. Kumar Malik, “Semantic search revisited,” in _2018 8th International Conference on Cloud Computing, Data Science & Engineering (Confluence)_, 2018, pp. 14–15.

- (54)
X. Han Lù, “BM25S: Fast lexical search implementing bm25 in python,” 2024, accessed Dec. 19, 2025. \[Online\]. Available: [https://github.com/xhluca/bm25s](https://github.com/xhluca/bm25s "")
- (55)
D. Sultania, Z. Lu, T. Naik, F. Dernoncourt, D. S. Yoon, S. Sharma, T. Bui, A. Gupta, T. Vatsa, S. Suresha, I. Verma, V. Belavadi, C. Chen, and M. Friedrich, “Domain-specific question answering with hybrid search,” 2024. \[Online\]. Available: [https://arxiv.org/abs/2412.03736](https://arxiv.org/abs/2412.03736 "")
- (56)
AgentHub Authors, “Agenthub off-paper appendix (artifacts and supplementary material),” [https://drive.google.com/drive/folders/1pTcmbqZGAUMBd0ibJZcS24D\_swSsdr0u?usp=sharing](https://drive.google.com/drive/folders/1pTcmbqZGAUMBd0ibJZcS24D_swSsdr0u?usp=sharing ""), 2026, includes example\_manifest.yaml and evidence\_record.yaml.
