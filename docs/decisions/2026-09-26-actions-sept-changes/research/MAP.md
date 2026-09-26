# MAP - topic decomposition

## Topic

GitHub Actions changes September 2026: workflow run query results, expired artifacts API, workflow execution protections, cache-mode

## Subtopics

Statuses are blank on purpose: phase 0 gathers material, it does not judge. Mark each
row COVERED (cite the U-## rows that cover it), DISMISSED (reason required - dismissing
is fine, omitting is not), or GAP, and add topic-specific subtopics where the checklist
is not enough.

| ID | Subtopic | Why it matters | Status | Covered by |
|---|---|---|---|---|
| D-1 | Access model | Public pages, an official API, an auth-walled app, or a paywall - each is a different collection design | COVERED | U-1..U-4. Public changelog posts and GitHub docs |
| D-2 | Auth and credentials | What accounts, keys, or logins the collection and the product need, and who holds them | COVERED | U-1, U-2, U-3. The kit authenticates with a fine-grained token; any change to who may dispatch or read is an auth question |
| D-3 | Rate limits and quotas | Caps every cadence in the design, and caps the research collection itself | DISMISSED | no rate limit is in question; the kit makes a handful of API calls per collection |
| D-4 | ToS, licensing, legality of the intended use | A prohibition on automated collection, storage, or display ends the design for that source - and sometimes the project | DISMISSED | GitHub's own platform features, used as documented |
| D-5 | Data schema and its stability | How the data is shaped, and how often the source changes the shape without asking | COVERED | U-1, U-2. Response shapes of the run and artifact endpoints are the schema at stake |
| D-6 | Freshness and staleness | How fast the data goes stale, and what staleness costs the product that depends on it | COVERED | U-2. Artifact retention and expiry is the freshness question |
| D-7 | Cost at expected volume | The economics at real usage, not the pricing page's first row - this decides viability | DISMISSED | no cost change is in question |
| D-8 | Runtime and platform limits | Where this actually executes - OS, runtime version, desktop app, cloud - and what those limits forbid | COVERED | U-3, U-4. What the runner allows a job to do |
| D-9 | Output obtainability | Does the data your stated "done" depends on exist, and can you actually get it? Load-bearing: a project whose output cannot be produced should die in phase 1, not phase 2 | COVERED | U-1..U-4. Each change is announced publicly with a dated changelog post |

## Coverage notes (per dimension)

_One short paragraph per row once it has a status: what was established, and what the
status rests on._

## Candidate material

Gathered 2026-09-26.

Likely owners of these facts (by how often a search pointed at them):

- `docs.github.com` (8)
- `github.com` (6)
- `github.blog` (4)
- `docs.automationanywhere.com` (4)
- `docs.citrix.com` (4)
- `docs.trendmicro.com` (4)

Candidate pages:

- [GitHub Actions: Complete 2026 Guide With Quick Tutorial](https://octopus.com/devops/github-actions/)
- [GitHub Actions Explained: From Zero to Production Automation ...](https://www.youtube.com/watch?v=rmTNx6Xe-A0)
- [Synthetic CT‐enabled weekly adaptive radiotherapy for ...](https://pmc.ncbi.nlm.nih.gov/articles/PMC13322649/)
- [fix(r_eval): bounded interruptible execution with safety ...](https://github.com/YuLab-SMU/aisdk/actions/runs/26219661636)
- [MedCTA: A Benchmark for Clinical Tool Agents](https://repository.kaust.edu.sa/bitstreams/6c2e1358-5f5b-4d5d-a171-2ca3b031b697/download)
- [GitHub Actions Tutorial: Build a CI/CD Pipeline (2026)](https://gravitydevops.com/github-actions-tutorial-ci-cd-from-scratch/)
- [[efficiency-improver] Monthly Activity 2026-09 · Issue #11023](https://github.com/microsoft/testfx/issues/11023)
- [Senior Developer Advocate: Role Blueprint, Responsibilities ...](https://www.devopsschool.com/blog/senior-developer-advocate-role-blueprint-responsibilities-skills-kpis-and-career-path/)
- [GitHub availability report: August 2026](https://github.blog/news-insights/company-news/github-availability-report-august-2026/)
- [Is your GitHub pipeline tripping? 😱 Here's the safe cache ...](https://www.instagram.com/p/DdrPlW3CPAV/)
- [SKU Groups - Gen AI Image Models | Google Cloud](https://cloud.google.com/skus/sku-groups/gen-ai-image-models)
- [Who Controls Agentic Payments? Facilitator Concentration ...](https://papers.ssrn.com/sol3/Delivery.cfm/7396241.pdf?abstractid=7396241&mirid=1)
- [Agentic AI for Business Intelligence: What Changes | Cube](https://cube.dev/articles/agentic-ai-for-business-intelligence)
- [azure-devops-docs/release-notes/features-timeline- ...](https://github.com/MicrosoftDocs/azure-devops-docs/blob/main/release-notes/features-timeline-released.md)
- [Blog Archive](https://creatorstoolbox.com/blog/archive)
- [jazz_chord_progression_editor_...](https://github.com/Dicklesworthstone/jazz_chord_progression_editor_html/blob/main/docs/IMPLEMENTATION_TODO.md)
- [Automation 360](https://docs.automationanywhere.com/r/automation-360/ujl1732637516660)
- [The State of AI Agents in 2026: A Practitioner's Guide](https://kingy.ai/news/the-state-of-ai-agents-in-2026-a-practitioners-guide/)
- [draft-das-global-privacy-execution-enforcement-00](https://datatracker.ietf.org/doc/html/draft-das-global-privacy-execution-enforcement-00)
- [Citrix SecurSpaces™](https://docs.citrix.com/en-us/securspaces/citrix-securspaces.pdf)

