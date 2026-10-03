---
url: https://github.com/assafelovic/gpt-researcher
retrieved: 2026-10-03
command: firecrawl scrape https://github.com/assafelovic/gpt-researcher --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: GitHub - assafelovic/gpt-researcher: An autonomous agent that conducts deep research on any data using any LLM providers · GitHub
---
[Skip to content](https://github.com/assafelovic/gpt-researcher#start-of-content)

You signed in with another tab or window. [Reload](https://github.com/assafelovic/gpt-researcher) to refresh your session.You signed out in another tab or window. [Reload](https://github.com/assafelovic/gpt-researcher) to refresh your session.You switched accounts on another tab or window. [Reload](https://github.com/assafelovic/gpt-researcher) to refresh your session.Dismiss alert

{{ message }}

[assafelovic](https://github.com/assafelovic)/ **[gpt-researcher](https://github.com/assafelovic/gpt-researcher)** Public

- [Notifications](https://github.com/login?return_to=%2Fassafelovic%2Fgpt-researcher) You must be signed in to change notification settings
- [Fork\\
4.1k](https://github.com/login?return_to=%2Fassafelovic%2Fgpt-researcher)
- [Star\\
29.9k](https://github.com/login?return_to=%2Fassafelovic%2Fgpt-researcher)


main

[**63** Branches](https://github.com/assafelovic/gpt-researcher/branches) [**74** Tags](https://github.com/assafelovic/gpt-researcher/tags)

[Go to Branches page](https://github.com/assafelovic/gpt-researcher/branches)[Go to Tags page](https://github.com/assafelovic/gpt-researcher/tags)

Go to file

Code

Open more actions menu

## Latest commit

[![assafelovic](https://avatars.githubusercontent.com/u/13554167?v=4&size=40)](https://github.com/assafelovic)[assafelovic](https://github.com/assafelovic/gpt-researcher/commits?author=assafelovic)

[Merge pull request](https://github.com/assafelovic/gpt-researcher/commit/0957c301ed06c2a5857b834358c7227c739041d4) [#2173](https://github.com/assafelovic/gpt-researcher/pull/2173) [from assafelovic/docs/homepage-restore-hero](https://github.com/assafelovic/gpt-researcher/commit/0957c301ed06c2a5857b834358c7227c739041d4)

Open commit detailssuccess

last weekSep 26, 2026

[0957c30](https://github.com/assafelovic/gpt-researcher/commit/0957c301ed06c2a5857b834358c7227c739041d4) · last weekSep 26, 2026

## History

[3,211 Commits](https://github.com/assafelovic/gpt-researcher/commits/main/)

Open commit details

[View commit history for this file.](https://github.com/assafelovic/gpt-researcher/commits/main/) 3,211 Commits

## Folders and files

| Name | Name | Last commit message | Last commit date |
| --- | --- | --- | --- |
| [.claude](https://github.com/assafelovic/gpt-researcher/tree/main/.claude ".claude") | [.claude](https://github.com/assafelovic/gpt-researcher/tree/main/.claude ".claude") | [fix: restore importability and multi-agent graph construction](https://github.com/assafelovic/gpt-researcher/commit/bea0ad07c3ead12517c79e03789da49a270fd249 "fix: restore importability and multi-agent graph construction  Three shipped-blocker fixes, consolidated from community PRs:  - query_processing.py annotated _normalize_sub_queries with Any/List   before importing typing, raising NameError at import on Python <=3.13   (eager annotations). Broke the PyPI wheel, both Dockerfiles and   runtime.txt. Fix from #1943, plus its regression test.   Closes #1981, #2069.  - ChiefEditorAgent._route_fact_check and EditorAgent._route_draft_review   were referenced by add_conditional_edges but never defined, so   init_research_team() raised AttributeError and multi_agents was dead   on arrival. Fix from #2063, plus its regression test. Closes #2060.  - .claude/worktrees/crazy-curie-e43899 was committed as a 160000 gitlink   to an unreachable commit, breaking recursive clones and git-URL Docker   builds. Fix from #2072. Closes #2055.  Co-authored-by: MrSampson <noreply@github.com> Co-authored-by: AmirF194 <noreply@github.com> Co-authored-by: JasmineLCY <noreply@github.com>  Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>") | 2 months agoAug 23, 2026 |
| [.codex-plugin](https://github.com/assafelovic/gpt-researcher/tree/main/.codex-plugin ".codex-plugin") | [.codex-plugin](https://github.com/assafelovic/gpt-researcher/tree/main/.codex-plugin ".codex-plugin") | [Remove CI workflow from plugin manifest](https://github.com/assafelovic/gpt-researcher/commit/ec126e08730022f839a735c29c13433c34e5321c "Remove CI workflow from plugin manifest  Re-signed branch history.  Previous subjects: - Add Codex CLI plugin manifest - Fix: add skills field to plugin manifest - Fix: address code review feedback - Add Codex plugin quality gate CI - Remove CI workflow from plugin PR - Remove CI workflow from plugin manifest") | 6 months agoApr 5, 2026 |
| [.github](https://github.com/assafelovic/gpt-researcher/tree/main/.github ".github") | [.github](https://github.com/assafelovic/gpt-researcher/tree/main/.github ".github") | [ci: drop Python 3.11 from the test matrix](https://github.com/assafelovic/gpt-researcher/commit/585e67d3708f3c403557497daec70e5fa8a85bcb "ci: drop Python 3.11 from the test matrix  039024e2 raised requires-python to >=3.12, so pip install -e . fails on 3.11 and the imports/unit (py3.11) jobs would fail on every PR.  Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>") | last weekSep 26, 2026 |
| [backend](https://github.com/assafelovic/gpt-researcher/tree/main/backend "backend") | [backend](https://github.com/assafelovic/gpt-researcher/tree/main/backend "backend") | [Raise the supported Python floor to 3.12 and release 0.16.0.](https://github.com/assafelovic/gpt-researcher/commit/039024e24e16eba7420a659b9fe0d50090613af6 "Raise the supported Python floor to 3.12 and release 0.16.0.  Install docs, runtime images, and package metadata now match the version being published.  Co-authored-by: Cursor <cursoragent@cursor.com>") | last weekSep 26, 2026 |
| [deep\_agents](https://github.com/assafelovic/gpt-researcher/tree/main/deep_agents "deep_agents") | [deep\_agents](https://github.com/assafelovic/gpt-researcher/tree/main/deep_agents "deep_agents") | [Raise the supported Python floor to 3.12 and release 0.16.0.](https://github.com/assafelovic/gpt-researcher/commit/039024e24e16eba7420a659b9fe0d50090613af6 "Raise the supported Python floor to 3.12 and release 0.16.0.  Install docs, runtime images, and package metadata now match the version being published.  Co-authored-by: Cursor <cursoragent@cursor.com>") | last weekSep 26, 2026 |
| [docs](https://github.com/assafelovic/gpt-researcher/tree/main/docs "docs") | [docs](https://github.com/assafelovic/gpt-researcher/tree/main/docs "docs") | [docs(homepage): restore the two-column hero; keep the stats strip rem…](https://github.com/assafelovic/gpt-researcher/commit/7d888745c96d4324babcf106a4dc89ca08bcb141 "docs(homepage): restore the two-column hero; keep the stats strip removed  #2172 misread the request: only the stats strip was meant to go. Bring back the left/right hero with the code card from #2171, and tighten the gap below it now that the stats strip is gone.  Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>") | last weekSep 26, 2026 |
| [evals](https://github.com/assafelovic/gpt-researcher/tree/main/evals "evals") | [evals](https://github.com/assafelovic/gpt-researcher/tree/main/evals "evals") | [docs: one-line footer on the results graphic](https://github.com/assafelovic/gpt-researcher/commit/4590f526b5114de508978b57d1d85980f0f1eef0 "docs: one-line footer on the results graphic  Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>") | last weekSep 26, 2026 |
| [frontend](https://github.com/assafelovic/gpt-researcher/tree/main/frontend "frontend") | [frontend](https://github.com/assafelovic/gpt-researcher/tree/main/frontend "frontend") | [Raise the supported Python floor to 3.12 and release 0.16.0.](https://github.com/assafelovic/gpt-researcher/commit/039024e24e16eba7420a659b9fe0d50090613af6 "Raise the supported Python floor to 3.12 and release 0.16.0.  Install docs, runtime images, and package metadata now match the version being published.  Co-authored-by: Cursor <cursoragent@cursor.com>") | last weekSep 26, 2026 |
| [gpt\_researcher](https://github.com/assafelovic/gpt-researcher/tree/main/gpt_researcher "gpt_researcher") | [gpt\_researcher](https://github.com/assafelovic/gpt-researcher/tree/main/gpt_researcher "gpt_researcher") | [feat(context): keyword fallback so no filter needs a key or embeddings](https://github.com/assafelovic/gpt-researcher/commit/2906e63275788d1252d59194d6e06dc4aace116e "feat(context): keyword fallback so no filter needs a key or embeddings  #2161 made Jev the default when TYPESAFE_API_KEY is set, but without a key GPT Researcher still fell back to embeddings, so an embeddings provider was still required. Replace that fallback with BM25 keyword ranking: local, no API, no model, no new dependency.  The same benchmark replay picked the configuration. Plain top-10 BM25 loses to embeddings (7-9-12); keeping chunks that score >= 50% of the best, up to 25, beats them (14-8-6) at the same cost ($0.116 vs $0.117), with higher context precision (0.51 vs 0.46) and a 0.02s filter step vs 1.0s. URL frequency across sub-queries was considered but is not observable at this step: URLs are de-duplicated before scraping (0 of 300 pages recurred).  - gpt_researcher/context/select.py: one select_context() for every   caller. auto = jev with a key, else keyword. Jev failures and   unbuildable embedding models degrade to keyword. - Report chat uses select_context over the report instead of its own   embeddings vector store; an injected vector_store is still honoured. - Detailed-report section dedup keeps embeddings when available and   ranks by keywords when they aren't. - README: new \"Smart Context Filtering with Jev\" section with results;   Monocle Tracing section removed. Docs page, .env.example, config   docs and the benchmark write-up updated; results graphic added.  Verified live with no TYPESAFE_API_KEY and an uninstalled EMBEDDING provider: research runs in keyword mode, no embedding model is built, and chat retrieves the relevant part of the report.  Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>") | last weekSep 26, 2026 |
| [mcp-server](https://github.com/assafelovic/gpt-researcher/tree/main/mcp-server "mcp-server") | [mcp-server](https://github.com/assafelovic/gpt-researcher/tree/main/mcp-server "mcp-server") | [moved mcp to dedicated repo](https://github.com/assafelovic/gpt-researcher/commit/d14268a4966a0b2e67aeff2dd4283567250c75cd "moved mcp to dedicated repo") | last yearMay 31, 2025 |
| [multi\_agents](https://github.com/assafelovic/gpt-researcher/tree/main/multi_agents "multi_agents") | [multi\_agents](https://github.com/assafelovic/gpt-researcher/tree/main/multi_agents "multi_agents") | [Raise the supported Python floor to 3.12 and release 0.16.0.](https://github.com/assafelovic/gpt-researcher/commit/039024e24e16eba7420a659b9fe0d50090613af6 "Raise the supported Python floor to 3.12 and release 0.16.0.  Install docs, runtime images, and package metadata now match the version being published.  Co-authored-by: Cursor <cursoragent@cursor.com>") | last weekSep 26, 2026 |
| [skills/gpt-researcher](https://github.com/assafelovic/gpt-researcher/tree/main/skills/gpt-researcher "This path skips through empty directories") | [skills/gpt-researcher](https://github.com/assafelovic/gpt-researcher/tree/main/skills/gpt-researcher "This path skips through empty directories") | [Remove CI workflow from plugin manifest](https://github.com/assafelovic/gpt-researcher/commit/ec126e08730022f839a735c29c13433c34e5321c "Remove CI workflow from plugin manifest  Re-signed branch history.  Previous subjects: - Add Codex CLI plugin manifest - Fix: add skills field to plugin manifest - Fix: address code review feedback - Add Codex plugin quality gate CI - Remove CI workflow from plugin PR - Remove CI workflow from plugin manifest") | 6 months agoApr 5, 2026 |
| [terraform](https://github.com/assafelovic/gpt-researcher/tree/main/terraform "terraform") | [terraform](https://github.com/assafelovic/gpt-researcher/tree/main/terraform "terraform") | [refactor: Implement ECR and GitHub Actions Terraform setup with neces…](https://github.com/assafelovic/gpt-researcher/commit/db7f17eee3dc6ea752a30cc2c4bd976185a2d577 "refactor: Implement ECR and GitHub Actions Terraform setup with necessary configurations and outputs") | 9 months agoJan 9, 2026 |
| [tests](https://github.com/assafelovic/gpt-researcher/tree/main/tests "tests") | [tests](https://github.com/assafelovic/gpt-researcher/tree/main/tests "tests") | [feat(context): keyword fallback so no filter needs a key or embeddings](https://github.com/assafelovic/gpt-researcher/commit/2906e63275788d1252d59194d6e06dc4aace116e "feat(context): keyword fallback so no filter needs a key or embeddings  #2161 made Jev the default when TYPESAFE_API_KEY is set, but without a key GPT Researcher still fell back to embeddings, so an embeddings provider was still required. Replace that fallback with BM25 keyword ranking: local, no API, no model, no new dependency.  The same benchmark replay picked the configuration. Plain top-10 BM25 loses to embeddings (7-9-12); keeping chunks that score >= 50% of the best, up to 25, beats them (14-8-6) at the same cost ($0.116 vs $0.117), with higher context precision (0.51 vs 0.46) and a 0.02s filter step vs 1.0s. URL frequency across sub-queries was considered but is not observable at this step: URLs are de-duplicated before scraping (0 of 300 pages recurred).  - gpt_researcher/context/select.py: one select_context() for every   caller. auto = jev with a key, else keyword. Jev failures and   unbuildable embedding models degrade to keyword. - Report chat uses select_context over the report instead of its own   embeddings vector store; an injected vector_store is still honoured. - Detailed-report section dedup keeps embeddings when available and   ranks by keywords when they aren't. - README: new \"Smart Context Filtering with Jev\" section with results;   Monocle Tracing section removed. Docs page, .env.example, config   docs and the benchmark write-up updated; results graphic added.  Verified live with no TYPESAFE_API_KEY and an uninstalled EMBEDDING provider: research runs in keyword mode, no embedding model is built, and chat retrieves the relevant part of the report.  Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>") | last weekSep 26, 2026 |
| [.cursorignore](https://github.com/assafelovic/gpt-researcher/blob/main/.cursorignore ".cursorignore") | [.cursorignore](https://github.com/assafelovic/gpt-researcher/blob/main/.cursorignore ".cursorignore") | [feat: Add support for custom OpenAI base URL](https://github.com/assafelovic/gpt-researcher/commit/058cd9021b82b11ff7a709de895cbcf774d292b6 "feat: Add support for custom OpenAI base URL  - Add OPENAI_BASE_URL environment variable support for OpenAI-compatible APIs - Update LLM provider to inject custom base URL when OPENAI_BASE_URL is set - Update embedding provider to support custom base URLs for OpenAI provider - Add OPENAI_BASE_URL to backend server configuration and API models - Update Docker Compose configuration to include OPENAI_BASE_URL - Update documentation with examples for custom base URL usage - Maintain backward compatibility - OPENAI_BASE_URL is optional  This allows users to easily integrate with local models, self-hosted services, and other OpenAI-compatible API providers by simply setting the OPENAI_BASE_URL environment variable.") | last yearSep 13, 2025 |
| [.cursorrules](https://github.com/assafelovic/gpt-researcher/blob/main/.cursorrules ".cursorrules") | [.cursorrules](https://github.com/assafelovic/gpt-researcher/blob/main/.cursorrules ".cursorrules") | [Update to Cursor Rules - gitignore and fastapi](https://github.com/assafelovic/gpt-researcher/commit/fd9ccd5f3df20b357b13b4b71868b79fde389e85 "Update to Cursor Rules - gitignore and fastapi  Added cursor rules files (actual and reader friendly versions, both) Updated cursor rules to include fastapi and python deployment rules") | last yearJan 9, 2025 |
| [.dockerignore](https://github.com/assafelovic/gpt-researcher/blob/main/.dockerignore ".dockerignore") | [.dockerignore](https://github.com/assafelovic/gpt-researcher/blob/main/.dockerignore ".dockerignore") | [add support markdown download](https://github.com/assafelovic/gpt-researcher/commit/3e860fc30b0a0d473608839afacd2901ea60cd72 "add support markdown download") | 2 years agoJul 19, 2024 |
| [.env.example](https://github.com/assafelovic/gpt-researcher/blob/main/.env.example ".env.example") | [.env.example](https://github.com/assafelovic/gpt-researcher/blob/main/.env.example ".env.example") | [feat(context): keyword fallback so no filter needs a key or embeddings](https://github.com/assafelovic/gpt-researcher/commit/2906e63275788d1252d59194d6e06dc4aace116e "feat(context): keyword fallback so no filter needs a key or embeddings  #2161 made Jev the default when TYPESAFE_API_KEY is set, but without a key GPT Researcher still fell back to embeddings, so an embeddings provider was still required. Replace that fallback with BM25 keyword ranking: local, no API, no model, no new dependency.  The same benchmark replay picked the configuration. Plain top-10 BM25 loses to embeddings (7-9-12); keeping chunks that score >= 50% of the best, up to 25, beats them (14-8-6) at the same cost ($0.116 vs $0.117), with higher context precision (0.51 vs 0.46) and a 0.02s filter step vs 1.0s. URL frequency across sub-queries was considered but is not observable at this step: URLs are de-duplicated before scraping (0 of 300 pages recurred).  - gpt_researcher/context/select.py: one select_context() for every   caller. auto = jev with a key, else keyword. Jev failures and   unbuildable embedding models degrade to keyword. - Report chat uses select_context over the report instead of its own   embeddings vector store; an injected vector_store is still honoured. - Detailed-report section dedup keeps embeddings when available and   ranks by keywords when they aren't. - README: new \"Smart Context Filtering with Jev\" section with results;   Monocle Tracing section removed. Docs page, .env.example, config   docs and the benchmark write-up updated; results graphic added.  Verified live with no TYPESAFE_API_KEY and an uninstalled EMBEDDING provider: research runs in keyword mode, no embedding model is built, and chat retrieves the relevant part of the report.  Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>") | last weekSep 26, 2026 |
| [.gitignore](https://github.com/assafelovic/gpt-researcher/blob/main/.gitignore ".gitignore") | [.gitignore](https://github.com/assafelovic/gpt-researcher/blob/main/.gitignore ".gitignore") | [feat(context): filter scraped content with Jev; embeddings become opt…](https://github.com/assafelovic/gpt-researcher/commit/a0a7449980471de27a857899aa0fa95fd8a420f4 "feat(context): filter scraped content with Jev; embeddings become optional  Every scraped page reaches a report through one step: chunks are kept or dropped by embedding cosine similarity. Similarity measures topical closeness, not whether a chunk helps answer the question.  Add CONTEXT_FILTER with four modes: - jev: TypeSafe's Jev scores each chunk on a 0-3 usefulness rubric and   the best chunks scoring >= 1.5 are kept. Plain httpx, no new   dependency; bounded concurrency, retries on 429/529, and any failure   falls back to embeddings. - embeddings: today's behaviour. - none: no filtering; every page goes to the writer. - auto (default): jev when TYPESAFE_API_KEY is set, else embeddings,   so nothing changes for existing users.  The embedding model is now built on first use rather than in GPTResearcher.__init__, so a standard run with jev or none never needs an embeddings provider. Verified live with EMBEDDING pointing at an uninstalled provider: the jev run completes, the embeddings path fails.  evals/context_filter replays 28 recorded research runs (20 SimpleQA, 8 open-ended) through each filter with the same pages and writer: - Jev keeps relevant chunks 73% of the time vs 46% for embeddings,   and its reports win 15-3 head-to-head (p ~ 0.008), at the same cost. - No filter gives the best open-ended reports but costs 65-83% more   and sends up to 108k tokens on a standard report.  Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>") | last weekSep 26, 2026 |
| [.mcp.json](https://github.com/assafelovic/gpt-researcher/blob/main/.mcp.json ".mcp.json") | [.mcp.json](https://github.com/assafelovic/gpt-researcher/blob/main/.mcp.json ".mcp.json") | [Remove CI workflow from plugin manifest](https://github.com/assafelovic/gpt-researcher/commit/ec126e08730022f839a735c29c13433c34e5321c "Remove CI workflow from plugin manifest  Re-signed branch history.  Previous subjects: - Add Codex CLI plugin manifest - Fix: add skills field to plugin manifest - Fix: address code review feedback - Add Codex plugin quality gate CI - Remove CI workflow from plugin PR - Remove CI workflow from plugin manifest") | 6 months agoApr 5, 2026 |
| [.python-version](https://github.com/assafelovic/gpt-researcher/blob/main/.python-version ".python-version") | [.python-version](https://github.com/assafelovic/gpt-researcher/blob/main/.python-version ".python-version") | [Raise the supported Python floor to 3.12 and release 0.16.0.](https://github.com/assafelovic/gpt-researcher/commit/039024e24e16eba7420a659b9fe0d50090613af6 "Raise the supported Python floor to 3.12 and release 0.16.0.  Install docs, runtime images, and package metadata now match the version being published.  Co-authored-by: Cursor <cursoragent@cursor.com>") | last weekSep 26, 2026 |
| [CODE\_OF\_CONDUCT.md](https://github.com/assafelovic/gpt-researcher/blob/main/CODE_OF_CONDUCT.md "CODE_OF_CONDUCT.md") | [CODE\_OF\_CONDUCT.md](https://github.com/assafelovic/gpt-researcher/blob/main/CODE_OF_CONDUCT.md "CODE_OF_CONDUCT.md") | [Updates Code of Conduct and removes all the grammatical errors](https://github.com/assafelovic/gpt-researcher/commit/d7e718fe4d7c586b6687056f55ab68ce9d7c1732 "Updates Code of Conduct and removes all the grammatical errors") | 2 years agoOct 27, 2024 |
| [CONTRIBUTING.md](https://github.com/assafelovic/gpt-researcher/blob/main/CONTRIBUTING.md "CONTRIBUTING.md") | [CONTRIBUTING.md](https://github.com/assafelovic/gpt-researcher/blob/main/CONTRIBUTING.md "CONTRIBUTING.md") | [feat(retrievers): load third-party retrievers from entry points](https://github.com/assafelovic/gpt-researcher/commit/c4b5957d792aa3c6057d2bbefbdc11832706287d "feat(retrievers): load third-party retrievers from entry points  Search providers keep arriving as PRs that add another built-in retriever (23 ship today, 8 more were open). Let a package register a retriever under the `gpt_researcher.retrievers` entry-point group instead; users install it and set RETRIEVER=<name>.  - get_retriever() falls back to installed plugins for unknown names.   Built-in names always win, so a plugin cannot shadow `tavily`. - A plugin that fails to import logs a warning and resolves to None,   so get_retrievers() keeps its existing fall-back-to-default path. - Config.parse_retrievers() validated names against the built-in   folders only and silently swapped any other name for Tavily; plugin   names are now accepted there too. Found by installing a real plugin   package, which the mocked unit tests did not exercise. - Docs page with the contract and a complete example package. - CONTRIBUTING: branch from `main` (it still said `master`, which is   why PRs kept targeting the retired branch) and route new search   providers to the plugin path.  Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>") | last weekSep 26, 2026 |
| [CURSOR\_RULES.md](https://github.com/assafelovic/gpt-researcher/blob/main/CURSOR_RULES.md "CURSOR_RULES.md") | [CURSOR\_RULES.md](https://github.com/assafelovic/gpt-researcher/blob/main/CURSOR_RULES.md "CURSOR_RULES.md") | [Update to Cursor Rules - gitignore and fastapi](https://github.com/assafelovic/gpt-researcher/commit/fd9ccd5f3df20b357b13b4b71868b79fde389e85 "Update to Cursor Rules - gitignore and fastapi  Added cursor rules files (actual and reader friendly versions, both) Updated cursor rules to include fastapi and python deployment rules") | last yearJan 9, 2025 |
| [Dockerfile](https://github.com/assafelovic/gpt-researcher/blob/main/Dockerfile "Dockerfile") | [Dockerfile](https://github.com/assafelovic/gpt-researcher/blob/main/Dockerfile "Dockerfile") | [Bump python from 3.12-slim-bookworm to 3.14-slim-bookworm](https://github.com/assafelovic/gpt-researcher/commit/1eb0f148921f2ce7ba80e24c0058da4473940d75 "Bump python from 3.12-slim-bookworm to 3.14-slim-bookworm  Bumps python from 3.12-slim-bookworm to 3.14-slim-bookworm.  --- updated-dependencies: - dependency-name: python   dependency-version: 3.14-slim-bookworm   dependency-type: direct:production ...  Signed-off-by: dependabot[bot] <support@github.com>") | 9 months agoJan 31, 2026 |
| [Dockerfile.fullstack](https://github.com/assafelovic/gpt-researcher/blob/main/Dockerfile.fullstack "Dockerfile.fullstack") | [Dockerfile.fullstack](https://github.com/assafelovic/gpt-researcher/blob/main/Dockerfile.fullstack "Dockerfile.fullstack") | [Bump python from 3.12-slim-bookworm to 3.14-slim-bookworm](https://github.com/assafelovic/gpt-researcher/commit/1eb0f148921f2ce7ba80e24c0058da4473940d75 "Bump python from 3.12-slim-bookworm to 3.14-slim-bookworm  Bumps python from 3.12-slim-bookworm to 3.14-slim-bookworm.  --- updated-dependencies: - dependency-name: python   dependency-version: 3.14-slim-bookworm   dependency-type: direct:production ...  Signed-off-by: dependabot[bot] <support@github.com>") | 9 months agoJan 31, 2026 |
| [LICENSE](https://github.com/assafelovic/gpt-researcher/blob/main/LICENSE "LICENSE") | [LICENSE](https://github.com/assafelovic/gpt-researcher/blob/main/LICENSE "LICENSE") | [Update LICENSE](https://github.com/assafelovic/gpt-researcher/commit/40b905d18703e61d30165ccec101f0480aeb4163 "Update LICENSE") | 2 years agoAug 18, 2024 |
| [Procfile](https://github.com/assafelovic/gpt-researcher/blob/main/Procfile "Procfile") | [Procfile](https://github.com/assafelovic/gpt-researcher/blob/main/Procfile "Procfile") | [fix: repair deploy entrypoint, backend import, and test collection](https://github.com/assafelovic/gpt-researcher/commit/98cef874520d5ceca0d7729b7b5255f82b299b0e "fix: repair deploy entrypoint, backend import, and test collection  Found while auditing the queue; none of these are covered by an open PR.  - Procfile launched backend.server.server:app, but that module does not   exist (only backend/server/app.py does), so Procfile-based deploys   failed at boot.  - backend/server/server_utils.py did a bare 'from utils import ...',   which only resolved because backend/server/app.py prepends backend/ to   sys.path first. Importing backend.server.server_utils directly always   failed. Try backend.utils first, fall back to the shimmed name, since   the module is loaded under both package names.  - 'pytest tests/' could not run at all: tests/test_security_fix.py   imports secure_filename/validate_file_path, removed in 08fd99ba, and a   single collection error aborts the entire run. Skipped with an   explanation rather than deleted, so the lost coverage stays visible.  - tests/test_multi_agents_route_bindings.py stubbed multi_agents into   sys.modules to route around the query_processing import bug; those   stubs leaked and broke collection of tests/test_new_agents.py. The   import bug is fixed in the previous commit, so the test now imports   both modules for real.  pytest tests/ now collects 212 tests with no errors.  Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>") | 2 months agoAug 23, 2026 |
| [README-ja\_JP.md](https://github.com/assafelovic/gpt-researcher/blob/main/README-ja_JP.md "README-ja_JP.md") | [README-ja\_JP.md](https://github.com/assafelovic/gpt-researcher/blob/main/README-ja_JP.md "README-ja_JP.md") | [Raise the supported Python floor to 3.12 and release 0.16.0.](https://github.com/assafelovic/gpt-researcher/commit/039024e24e16eba7420a659b9fe0d50090613af6 "Raise the supported Python floor to 3.12 and release 0.16.0.  Install docs, runtime images, and package metadata now match the version being published.  Co-authored-by: Cursor <cursoragent@cursor.com>") | last weekSep 26, 2026 |
| [README-ko\_KR.md](https://github.com/assafelovic/gpt-researcher/blob/main/README-ko_KR.md "README-ko_KR.md") | [README-ko\_KR.md](https://github.com/assafelovic/gpt-researcher/blob/main/README-ko_KR.md "README-ko_KR.md") | [Raise the supported Python floor to 3.12 and release 0.16.0.](https://github.com/assafelovic/gpt-researcher/commit/039024e24e16eba7420a659b9fe0d50090613af6 "Raise the supported Python floor to 3.12 and release 0.16.0.  Install docs, runtime images, and package metadata now match the version being published.  Co-authored-by: Cursor <cursoragent@cursor.com>") | last weekSep 26, 2026 |
| [README-ru\_RU.md](https://github.com/assafelovic/gpt-researcher/blob/main/README-ru_RU.md "README-ru_RU.md") | [README-ru\_RU.md](https://github.com/assafelovic/gpt-researcher/blob/main/README-ru_RU.md "README-ru_RU.md") | [Raise the supported Python floor to 3.12 and release 0.16.0.](https://github.com/assafelovic/gpt-researcher/commit/039024e24e16eba7420a659b9fe0d50090613af6 "Raise the supported Python floor to 3.12 and release 0.16.0.  Install docs, runtime images, and package metadata now match the version being published.  Co-authored-by: Cursor <cursoragent@cursor.com>") | last weekSep 26, 2026 |
| [README-zh\_CN.md](https://github.com/assafelovic/gpt-researcher/blob/main/README-zh_CN.md "README-zh_CN.md") | [README-zh\_CN.md](https://github.com/assafelovic/gpt-researcher/blob/main/README-zh_CN.md "README-zh_CN.md") | [Raise the supported Python floor to 3.12 and release 0.16.0.](https://github.com/assafelovic/gpt-researcher/commit/039024e24e16eba7420a659b9fe0d50090613af6 "Raise the supported Python floor to 3.12 and release 0.16.0.  Install docs, runtime images, and package metadata now match the version being published.  Co-authored-by: Cursor <cursoragent@cursor.com>") | last weekSep 26, 2026 |
| [README.md](https://github.com/assafelovic/gpt-researcher/blob/main/README.md "README.md") | [README.md](https://github.com/assafelovic/gpt-researcher/blob/main/README.md "README.md") | [docs: current model leaderboard; fix the docs build on fresh installs](https://github.com/assafelovic/gpt-researcher/commit/6cbfc867a48a1e25afb8b836b915e190db3d55ba "docs: current model leaderboard; fix the docs build on fresh installs  - Configuration page: replace the November 2023 leaderboard image   (GPT-4, Claude 2, PaLM 2) and the \"OpenAI still stands as the   superior LLM\" paragraph with a markdown table from Vectara's   Hallucination Leaderboard (updated 2026-09-22, HHEM-2.3): 22 models   GPT Researcher can use, across nine providers, with what the   benchmark does and doesn't measure. The unused image is removed. - README: drop \"Report chat uses the same filter.\" - Docs build: a fresh `npm install` failed. With no lockfile it pulled   webpack 5.111, whose ProgressPlugin rejects options Docusaurus 3.7   passes, and @easyops-cn/docusaurus-search-local pulled a second,   3.10.2 copy of the Docusaurus packages, which broke Mermaid pages   during SSG (ReactContextError in useColorMode). Upgrade Docusaurus   to 3.10.2, the version the search plugin already resolves, so the   tree has one copy. Verified with a clean install and a full build.  Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>") | last weekSep 26, 2026 |
| [SECURITY.md](https://github.com/assafelovic/gpt-researcher/blob/main/SECURITY.md "SECURITY.md") | [SECURITY.md](https://github.com/assafelovic/gpt-researcher/blob/main/SECURITY.md "SECURITY.md") | [security: sanitize untrusted content, add SECURITY.md, pin brotli](https://github.com/assafelovic/gpt-researcher/commit/3080b0c4abb71d9a1f85b3dc26c75eb730634280 "security: sanitize untrusted content, add SECURITY.md, pin brotli  Hardens against content-level issues that affect users running GPT-Researcher as intended (independent of who can reach the server):  - Add SECURITY.md documenting the threat model (the backend is operator-run and   ships without built-in auth by design) and a private vulnerability-reporting   channel. - Sanitize report/agent HTML before inserting it into the DOM in both frontends,   since report content is derived from untrusted sources (scraped web pages and   LLM output):   - vanilla frontend: route report and agent output through DOMPurify     (loaded via CDN with SRI) before assigning to innerHTML.   - NextJS frontend: sanitize remark-html output with isomorphic-dompurify     (remark-html v16 ignores the old `sanitize` option, so output was raw). - Pin brotli>=1.2.0 in pyproject.toml and requirements.txt; earlier versions   have no decompression size limit (CVE-2025-6176 decompression-bomb DoS).  Closes #1719 Closes #1659 Closes #1819 Closes #1103  Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>") | 4 months agoJun 28, 2026 |
| [citation.cff](https://github.com/assafelovic/gpt-researcher/blob/main/citation.cff "citation.cff") | [citation.cff](https://github.com/assafelovic/gpt-researcher/blob/main/citation.cff "citation.cff") | [added citation](https://github.com/assafelovic/gpt-researcher/commit/7c1c0369cf9b03bbee869324f3b82083751c1e07 "added citation") | 2 years agoMay 25, 2024 |
| [cli.py](https://github.com/assafelovic/gpt-researcher/blob/main/cli.py "cli.py") | [cli.py](https://github.com/assafelovic/gpt-researcher/blob/main/cli.py "cli.py") | [feat(cli): generate filename from LLM and add YAML frontmatter for re…](https://github.com/assafelovic/gpt-researcher/commit/f5a9d2e394052e87b9e17ca26ce0a6efa09232d5 "feat(cli): generate filename from LLM and add YAML frontmatter for reports") | 6 months agoApr 18, 2026 |
| [docker-compose.yml](https://github.com/assafelovic/gpt-researcher/blob/main/docker-compose.yml "docker-compose.yml") | [docker-compose.yml](https://github.com/assafelovic/gpt-researcher/blob/main/docker-compose.yml "docker-compose.yml") | [added image generation with nano banana](https://github.com/assafelovic/gpt-researcher/commit/433857ac01313d88114a9c7939023e3a21b30162 "added image generation with nano banana") | 9 months agoJan 29, 2026 |
| [json\_schema\_generator.py](https://github.com/assafelovic/gpt-researcher/blob/main/json_schema_generator.py "json_schema_generator.py") | [json\_schema\_generator.py](https://github.com/assafelovic/gpt-researcher/blob/main/json_schema_generator.py "json_schema_generator.py") | [fix: Changed agent selection to use FAST\_LLM instead of SMART\_LLM](https://github.com/assafelovic/gpt-researcher/commit/3641862882d73314b120480cd40ce8069c8e3277 "fix: Changed agent selection to use FAST_LLM instead of SMART_LLM  - Modified choose_agent function in agent_creator.py to use FAST_LLM for agent selection - Updated llm_provider to use fast_llm_provider - This change resolves compatibility issues with O3 model when used for agent selection") | last yearJun 12, 2025 |
| [langgraph.json](https://github.com/assafelovic/gpt-researcher/blob/main/langgraph.json "langgraph.json") | [langgraph.json](https://github.com/assafelovic/gpt-researcher/blob/main/langgraph.json "langgraph.json") | [Raise the supported Python floor to 3.12 and release 0.16.0.](https://github.com/assafelovic/gpt-researcher/commit/039024e24e16eba7420a659b9fe0d50090613af6 "Raise the supported Python floor to 3.12 and release 0.16.0.  Install docs, runtime images, and package metadata now match the version being published.  Co-authored-by: Cursor <cursoragent@cursor.com>") | last weekSep 26, 2026 |
| [main.py](https://github.com/assafelovic/gpt-researcher/blob/main/main.py "main.py") | [main.py](https://github.com/assafelovic/gpt-researcher/blob/main/main.py "main.py") | [fixed run issue](https://github.com/assafelovic/gpt-researcher/commit/f40238cdf872d9e24815d20c2cb526bfdff9ca7f "fixed run issue") | last yearSep 21, 2025 |
| [poetry.toml](https://github.com/assafelovic/gpt-researcher/blob/main/poetry.toml "poetry.toml") | [poetry.toml](https://github.com/assafelovic/gpt-researcher/blob/main/poetry.toml "poetry.toml") | [Virtual Environ and Poetry Setup](https://github.com/assafelovic/gpt-researcher/commit/fae95f5d83d6f2d3943cd58383ac25b3e6587696 "Virtual Environ and Poetry Setup") | 3 years agoJan 3, 2024 |
| [pyproject.toml](https://github.com/assafelovic/gpt-researcher/blob/main/pyproject.toml "pyproject.toml") | [pyproject.toml](https://github.com/assafelovic/gpt-researcher/blob/main/pyproject.toml "pyproject.toml") | [Raise the supported Python floor to 3.12 and release 0.16.0.](https://github.com/assafelovic/gpt-researcher/commit/039024e24e16eba7420a659b9fe0d50090613af6 "Raise the supported Python floor to 3.12 and release 0.16.0.  Install docs, runtime images, and package metadata now match the version being published.  Co-authored-by: Cursor <cursoragent@cursor.com>") | last weekSep 26, 2026 |
| [requirements.txt](https://github.com/assafelovic/gpt-researcher/blob/main/requirements.txt "requirements.txt") | [requirements.txt](https://github.com/assafelovic/gpt-researcher/blob/main/requirements.txt "requirements.txt") | [chore(deps): update numpy requirement](https://github.com/assafelovic/gpt-researcher/commit/7b13f247f60218cf33268322aadd0aefd6ccac27 "chore(deps): update numpy requirement  Updates the requirements on [numpy](https://github.com/numpy/numpy) to permit the latest version. - [Release notes](https://github.com/numpy/numpy/releases) - [Changelog](https://github.com/numpy/numpy/blob/main/doc/RELEASE_WALKTHROUGH.rst) - [Commits](https://github.com/numpy/numpy/compare/v2.0.0...v2.4.6)  --- updated-dependencies: - dependency-name: numpy   dependency-version: 2.4.6   dependency-type: direct:production ...  Signed-off-by: dependabot[bot] <support@github.com>") | last weekSep 26, 2026 |
| [setup.py](https://github.com/assafelovic/gpt-researcher/blob/main/setup.py "setup.py") | [setup.py](https://github.com/assafelovic/gpt-researcher/blob/main/setup.py "setup.py") | [Raise the supported Python floor to 3.12 and release 0.16.0.](https://github.com/assafelovic/gpt-researcher/commit/039024e24e16eba7420a659b9fe0d50090613af6 "Raise the supported Python floor to 3.12 and release 0.16.0.  Install docs, runtime images, and package metadata now match the version being published.  Co-authored-by: Cursor <cursoragent@cursor.com>") | last weekSep 26, 2026 |
| View all files |

## Repository files navigation

![Logo](https://private-user-images.githubusercontent.com/13554167/336050918-20af8286-b386-44a5-9a83-3be1365139c3.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3OTA5ODI0OTIsIm5iZiI6MTc5MDk4MjE5MiwicGF0aCI6Ii8xMzU1NDE2Ny8zMzYwNTA5MTgtMjBhZjgyODYtYjM4Ni00NGE1LTlhODMtM2JlMTM2NTEzOWMzLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNjEwMDIlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjYxMDAyVDIzMDMxMlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTA3NzE3ZjgzNDE5OWZjZTNjNTAxNjA2NjI0NmJlODBmNDQ1ZWY1MTBiZDk1YjExN2UyYTViY2QzMGFkYmE2ZDImWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnJlc3BvbnNlLWNvbnRlbnQtdHlwZT1pbWFnZSUyRnBuZyJ9.57j0XbOI1D858c1lPITQp1y7ZuZY5PDxO0omjx8q0uM)

[![Website](https://camo.githubusercontent.com/25d9fc81a57d5ff84960f921e36d12caa49b1f05a6aa017cb7c15bf72a02d5ac/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4f6666696369616c253230576562736974652d677074722e6465762d7465616c3f7374796c653d666f722d7468652d6261646765266c6f676f3d776f726c64266c6f676f436f6c6f723d776869746526636f6c6f723d303839316232)](https://gptr.dev/)[![Documentation](https://camo.githubusercontent.com/898778d379c58e370e25e7adacd55f6d04c5411cfc4b35b8b5969d3fad747106/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f446f63756d656e746174696f6e2d444f43532d6634373262363f6c6f676f3d676f6f676c65646f6373266c6f676f436f6c6f723d7768697465267374796c653d666f722d7468652d6261646765)](https://docs.gptr.dev/)[![Discord](https://camo.githubusercontent.com/b73232764bdf779da7bd1be97ed3ffc6a2e1b641eea5ae2aeedbe1f14f10765c/68747470733a2f2f696d672e736869656c64732e696f2f646973636f72642f313132373835313737393031313339313534383f6c6f676f3d646973636f7264266c6f676f436f6c6f723d7768697465266c6162656c3d446973636f726426636f6c6f723d333462373661267374796c653d666f722d7468652d6261646765)](https://discord.gg/QgZXvJAccX)

[![PyPI version](https://camo.githubusercontent.com/7494bef41a438acec7631ef033605f2326fdf95043513cf1ddd6c68fb302a295/68747470733a2f2f696d672e736869656c64732e696f2f707970692f762f6770742d726573656172636865723f6c6f676f3d70797069266c6f676f436f6c6f723d7768697465267374796c653d666c6174)](https://badge.fury.io/py/gpt-researcher)![GitHub Release](https://camo.githubusercontent.com/9df9fd0d692876221ad25ba154f412381ba45d2312c23c015664cf0582a65928/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f762f72656c656173652f6173736166656c6f7669632f6770742d726573656172636865723f7374796c653d666c6174266c6f676f3d676974687562)[![Open In Colab](https://camo.githubusercontent.com/9692e5ee3176c766f934925d755efdff55624c3ed18dd75f32d42f5d3a51ab49/68747470733a2f2f696d672e736869656c64732e696f2f7374617469632f76313f6d6573736167653d4f70656e253230696e253230436f6c6162266c6f676f3d676f6f676c65636f6c6162266c6162656c436f6c6f723d6772657926636f6c6f723d79656c6c6f77266c6162656c3d253230267374796c653d666c6174266c6f676f53697a653d3430)](https://colab.research.google.com/github/assafelovic/gpt-researcher/blob/master/docs/docs/examples/pip-run.ipynb)[![Docker Image Version](https://camo.githubusercontent.com/5948d95055dfeef1f0e303125c58bd844f0fe85a3ce6e68889af2045c8f4976f/68747470733a2f2f696d672e736869656c64732e696f2f646f636b65722f762f656c657374696f2f6770742d726573656172636865722f6c61746573743f617263683d616d643634267374796c653d666c6174266c6f676f3d646f636b6572266c6f676f436f6c6f723d776869746526636f6c6f723d314436334544)](https://hub.docker.com/r/gptresearcher/gpt-researcher)[![Skill](https://camo.githubusercontent.com/b1f6e52d92dbd520e037e8618095cc6391c747d6c4d09fbe28786a71c4a2bc10/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f436c61756465253230536b696c6c2d736b696c6c732e73682d626c756576696f6c65743f7374796c653d666c6174266c6f676f3d616e7468726f706963266c6f676f436f6c6f723d7768697465)](https://skills.sh/assafelovic/gpt-researcher/gpt-researcher)[![Twitter Follow](https://camo.githubusercontent.com/14c92b327b9a2e8f011b4f6bfe76e1c48b9ba750888dadf0a442bdefef2b23bb/68747470733a2f2f696d672e736869656c64732e696f2f747769747465722f666f6c6c6f772f61737361665f656c6f7669633f7374796c653d736f6369616c)](https://twitter.com/assaf_elovic)

[English](https://github.com/assafelovic/gpt-researcher/blob/main/README.md) \| [中文](https://github.com/assafelovic/gpt-researcher/blob/main/README-zh_CN.md) \| [日本語](https://github.com/assafelovic/gpt-researcher/blob/main/README-ja_JP.md) \| [한국어](https://github.com/assafelovic/gpt-researcher/blob/main/README-ko_KR.md) \| [Русский](https://github.com/assafelovic/gpt-researcher/blob/main/README-ru_RU.md)

# 🔎 GPT Researcher

[Permalink: 🔎 GPT Researcher](https://github.com/assafelovic/gpt-researcher#-gpt-researcher)

**GPT Researcher the first open deep research agent designed for both web and local research on any given task.**

The agent produces detailed, factual, and unbiased research reports with citations. GPT Researcher provides a full suite of customization options to create tailor made and domain specific research agents. Inspired by the recent [Plan-and-Solve](https://arxiv.org/abs/2305.04091) and [RAG](https://arxiv.org/abs/2005.11401) papers, GPT Researcher addresses misinformation, speed, determinism, and reliability by offering stable performance and increased speed through parallelized agent work.

**Our mission is to empower individuals and organizations with accurate, unbiased, and factual information through AI.**

## Why GPT Researcher?

[Permalink: Why GPT Researcher?](https://github.com/assafelovic/gpt-researcher#why-gpt-researcher)

- Objective conclusions for manual research can take weeks, requiring vast resources and time.
- LLMs trained on outdated information can hallucinate, becoming irrelevant for current research tasks.
- Current LLMs have token limitations, insufficient for generating long research reports.
- Limited web sources in existing services lead to misinformation and shallow results.
- Selective web sources can introduce bias into research tasks.

## Demo

[Permalink: Demo](https://github.com/assafelovic/gpt-researcher#demo)

[![Demo video](https://private-user-images.githubusercontent.com/13554167/492684296-ac2ec55f-b487-4b3f-ae6f-b8743ad296e4.webp?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3OTA5ODI0OTIsIm5iZiI6MTc5MDk4MjE5MiwicGF0aCI6Ii8xMzU1NDE2Ny80OTI2ODQyOTYtYWMyZWM1NWYtYjQ4Ny00YjNmLWFlNmYtYjg3NDNhZDI5NmU0LndlYnA_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYxMDAyJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MTAwMlQyMzAzMTJaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT0zZjk3NWNjZGNjYjQ5NTEwNWZhYmZhOGNiNzViMzlmOWE0NjljZWI5M2RjMTgxMjllZTBlZDUzNjJhZWIxNTYxJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZyZXNwb25zZS1jb250ZW50LXR5cGU9aW1hZ2UlMkZ3ZWJwIn0.jIQLn6Dzy5LtcDYuoBYi8DMGYBecVN7ACQvCncvJ2No)](https://www.youtube.com/watch?v=f60rlc_QCxE)

## Install as Claude Skill

[Permalink: Install as Claude Skill](https://github.com/assafelovic/gpt-researcher#install-as-claude-skill)

Extend Claude's deep research capabilities by installing GPT Researcher as a [Claude Skill](https://skills.sh/assafelovic/gpt-researcher/gpt-researcher):

```
npx skills add assafelovic/gpt-researcher
```

Once installed, Claude can leverage GPT Researcher's deep research capabilities directly within your conversations.

## Architecture

[Permalink: Architecture](https://github.com/assafelovic/gpt-researcher#architecture)

The core idea is to utilize 'planner' and 'execution' agents. The planner generates research questions, while the execution agents gather relevant information. The publisher then aggregates all findings into a comprehensive report.

![](https://private-user-images.githubusercontent.com/13554167/333804350-4ac896fd-63ab-4b77-9688-ff62aafcc527.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3OTA5ODI0OTIsIm5iZiI6MTc5MDk4MjE5MiwicGF0aCI6Ii8xMzU1NDE2Ny8zMzM4MDQzNTAtNGFjODk2ZmQtNjNhYi00Yjc3LTk2ODgtZmY2MmFhZmNjNTI3LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNjEwMDIlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjYxMDAyVDIzMDMxMlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTliOTk3YjQ5MWEyYzA2MDUyNTBmNDhhMjI4ZmEzOWM5YzY0MDMzZDg4MjAxYzM3Y2Q1MjIwNWRiYmY1OGUzNWUmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnJlc3BvbnNlLWNvbnRlbnQtdHlwZT1pbWFnZSUyRnBuZyJ9.m0M8JaeOLxG4d9hoABLfLA5wA8qWTl2Kay3xzAC5idM)

Steps:

- Create a task-specific agent based on a research query.
- Generate questions that collectively form an objective opinion on the task.
- Use a crawler agent for gathering information for each question.
- Summarize and source-track each resource.
- Filter and aggregate summaries into a final research report.

## Tutorials

[Permalink: Tutorials](https://github.com/assafelovic/gpt-researcher#tutorials)

- [How it Works](https://docs.gptr.dev/blog/building-gpt-researcher)
- [How to Install](https://www.loom.com/share/04ebffb6ed2a4520a27c3e3addcdde20?sid=da1848e8-b1f1-42d1-93c3-5b0b9c3b24ea)
- [Live Demo](https://www.loom.com/share/6a3385db4e8747a1913dd85a7834846f?sid=a740fd5b-2aa3-457e-8fb7-86976f59f9b8)

## Features

[Permalink: Features](https://github.com/assafelovic/gpt-researcher#features)

- 📝 Generate detailed research reports using web and local documents.
- 🖼️ Smart image scraping and filtering for reports.
- 🍌 **AI-generated inline images** using Google Gemini (Nano Banana) for visual illustrations.
- 📜 Generate detailed reports exceeding 2,000 words.
- 🌐 Aggregate over 20 sources for objective conclusions.
- 🎯 Smart context filtering with [Jev](https://github.com/assafelovic/gpt-researcher#-smart-context-filtering-with-jev), with no API key or embeddings required by default.
- 🖥️ Frontend available in lightweight (HTML/CSS/JS) and production-ready (NextJS + Tailwind) versions.
- 🔍 JavaScript-enabled web scraping.
- 📂 Maintains memory and context throughout research.
- 📄 Export reports to PDF, Word, and other formats.

## 📖 Documentation

[Permalink: 📖 Documentation](https://github.com/assafelovic/gpt-researcher#-documentation)

See the [Documentation](https://docs.gptr.dev/docs/gpt-researcher/getting-started) for:

- Installation and setup guides
- Configuration and customization options
- How-To examples
- Full API references

## ⚙️ Getting Started

[Permalink: ⚙️ Getting Started](https://github.com/assafelovic/gpt-researcher#%EF%B8%8F-getting-started)

### Installation

[Permalink: Installation](https://github.com/assafelovic/gpt-researcher#installation)

1. Install Python 3.12 or later. [Guide](https://www.tutorialsteacher.com/python/install-python).

2. Clone the project and navigate to the directory:



```
git clone https://github.com/assafelovic/gpt-researcher.git
cd gpt-researcher
```

3. Set up API keys by exporting them or storing them in a `.env` file.



```
export OPENAI_API_KEY={Your OpenAI API Key here}
export TAVILY_API_KEY={Your Tavily API Key here}
```







(Optional) For enhanced tracing and observability, you can also set:



```
# export LANGCHAIN_TRACING_V2=true
# export LANGCHAIN_API_KEY={Your LangChain API Key here}
```







For custom OpenAI-compatible APIs (e.g., local models, other providers), you can also set:



```
export OPENAI_BASE_URL={Your custom API base URL here}
```

4. Install dependencies and start the server:



```
pip install -r requirements.txt
python -m uvicorn main:app --reload
```


Visit [http://localhost:8000](http://localhost:8000/) to start.

For other setups (e.g., Poetry or virtual environments), check the [Getting Started page](https://docs.gptr.dev/docs/gpt-researcher/getting-started).

## Run as PIP package

[Permalink: Run as PIP package](https://github.com/assafelovic/gpt-researcher#run-as-pip-package)

```
pip install gpt-researcher
```

### Example Usage:

[Permalink: Example Usage:](https://github.com/assafelovic/gpt-researcher#example-usage)

```
...
from gpt_researcher import GPTResearcher

query = "why is Nvidia stock going up?"
researcher = GPTResearcher(query=query)
# Conduct research on the given query
research_result = await researcher.conduct_research()
# Write the report
report = await researcher.write_report()
...
```

**For more examples and configurations, please refer to the [PIP documentation](https://docs.gptr.dev/docs/gpt-researcher/gptr/pip-package) page.**

### 🔧 MCP Client

[Permalink: 🔧 MCP Client](https://github.com/assafelovic/gpt-researcher#-mcp-client)

GPT Researcher supports MCP integration to connect with specialized data sources like GitHub repositories, databases, and custom APIs. This enables research from data sources alongside web search.

```
export RETRIEVER=tavily,mcp  # Enable hybrid web + MCP research
```

```
from gpt_researcher import GPTResearcher
import asyncio
import os

async def mcp_research_example():
    # Enable MCP with web search
    os.environ["RETRIEVER"] = "tavily,mcp"

    researcher = GPTResearcher(
        query="What are the top open source web research agents?",
        mcp_configs=[\
            {\
                "name": "github",\
                "command": "npx",\
                "args": ["-y", "@modelcontextprotocol/server-github"],\
                "env": {"GITHUB_TOKEN": os.getenv("GITHUB_TOKEN")}\
            }\
        ]
    )

    research_result = await researcher.conduct_research()
    report = await researcher.write_report()
    return report
```

> For comprehensive MCP documentation and advanced examples, visit the [MCP Integration Guide](https://docs.gptr.dev/docs/gpt-researcher/retrievers/mcp-configs).

## 🍌 Inline Image Generation

[Permalink: 🍌 Inline Image Generation](https://github.com/assafelovic/gpt-researcher#-inline-image-generation)

GPT Researcher can automatically generate and embed AI-created illustrations in your research reports using Google's Gemini models (Nano Banana).

```
# Enable in your .env file
IMAGE_GENERATION_ENABLED=true
GOOGLE_API_KEY=your_google_api_key
IMAGE_GENERATION_MODEL=models/gemini-2.5-flash-image
```

When enabled, the system will:

1. Analyze your research context to identify visualization opportunities
2. Pre-generate 2-3 relevant images during the research phase
3. Embed them inline as the report is written

Images are generated with dark-mode styling that matches the GPT Researcher UI, featuring professional infographic aesthetics with teal accents.

[Learn more about Image Generation](https://docs.gptr.dev/docs/gpt-researcher/gptr/image_generation) in our documentation.

## ✨ Deep Research

[Permalink: ✨ Deep Research](https://github.com/assafelovic/gpt-researcher#-deep-research)

GPT Researcher now includes Deep Research - an advanced recursive research workflow that explores topics with agentic depth and breadth. This feature employs a tree-like exploration pattern, diving deeper into subtopics while maintaining a comprehensive view of the research subject.

- 🌳 Tree-like exploration with configurable depth and breadth
- ⚡️ Concurrent processing for faster results
- 🤝 Smart context management across research branches
- ⏱️ Takes ~5 minutes per deep research
- 💰 Costs ~$0.4 per research (using `o3-mini` on "high" reasoning effort)

[Learn more about Deep Research](https://docs.gptr.dev/docs/gpt-researcher/gptr/deep_research) in our documentation.

## 🎯 Smart Context Filtering with Jev

[Permalink: 🎯 Smart Context Filtering with Jev](https://github.com/assafelovic/gpt-researcher#-smart-context-filtering-with-jev)

Every research run scrapes dozens of pages, and only some of each page helps answer the question. Before anything reaches the LLM, GPT Researcher decides which passages to keep. By default it uses **[Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev)** by TypeSafe, a model that scores how useful each passage is for the question, rather than how similar its words or embedding are.

**Jev's context is 59% more relevant than embeddings, at the same cost** (73% of kept passages relevant vs 46%). We benchmarked every option on 28 research tasks, replaying the same scraped sources so that only the filter changed:

| Context filter | Relevant passages kept | Head-to-head vs embeddings | Filter time | Cost per report | Needs |
| --- | --- | --- | --- | --- | --- |
| **Jev** (default) | **73%** | **15 wins · 10 ties · 3 losses** | 1.7s | $0.115 | `TYPESAFE_API_KEY` |
| Keyword (fallback) | 51% | 14 wins · 8 ties · 6 losses | 0.02s | $0.116 | nothing |
| Embeddings | 46% | — | 1.0s | $0.117 | an embedding provider |
| No filter | — | 13 wins · 11 ties · 4 losses | — | $0.192 | nothing |

Writing the report takes ~45s whichever filter you use, so a run's total time moves only by the filter step. Passing every page unfiltered writes the broadest reports on open-ended questions, but costs 65% more.

**Nothing is required.** With a `TYPESAFE_API_KEY`, Jev is used. Without one, or if a Jev call fails, GPT Researcher falls back to keyword (BM25) ranking, which runs locally with no API key, model or embeddings. Embeddings remain available as an option.

```
export TYPESAFE_API_KEY=...   # use Jev (the default when a key is set)
export CONTEXT_FILTER=auto    # auto | jev | keyword | embeddings | none
```

See the [Context Filter docs](https://docs.gptr.dev/docs/gpt-researcher/gptr/context-filter) and the [full benchmark](https://github.com/assafelovic/gpt-researcher/blob/main/evals/context_filter) for method, caveats and how to reproduce it.

## Run with Docker

[Permalink: Run with Docker](https://github.com/assafelovic/gpt-researcher#run-with-docker)

> **Step 1** \- [Install Docker](https://docs.gptr.dev/docs/gpt-researcher/getting-started/getting-started-with-docker)

> **Step 2** \- Clone the '.env.example' file, add your API Keys to the cloned file and save the file as '.env'

> **Step 3** \- Within the docker-compose file comment out services that you don't want to run with Docker.

```
docker-compose up --build
```

If that doesn't work, try running it without the dash:

```
docker compose up --build
```

> **Step 4** \- By default, if you haven't uncommented anything in your docker-compose file, this flow will start 2 processes:

- the Python server running on localhost:8000

- the React app running on localhost:3000


Visit localhost:3000 on any browser and enjoy researching!

## 📄 Research on Local Documents

[Permalink: 📄 Research on Local Documents](https://github.com/assafelovic/gpt-researcher#-research-on-local-documents)

You can instruct the GPT Researcher to run research tasks based on your local documents. Currently supported file formats are: PDF, plain text, CSV, Excel, Markdown, PowerPoint, and Word documents.

Step 1: Add the env variable `DOC_PATH` pointing to the folder where your documents are located.

```
export DOC_PATH="./my-docs"
```

Step 2:

- If you're running the frontend app on localhost:8000, simply select "My Documents" from the "Report Source" Dropdown Options.
- If you're running GPT Researcher with the [PIP package](https://docs.tavily.com/guides/gpt-researcher/gpt-researcher#pip-package), pass the `report_source` argument as "local" when you instantiate the `GPTResearcher` class [code sample here](https://docs.gptr.dev/docs/gpt-researcher/context/tailored-research).

## 🤖 MCP Server

[Permalink: 🤖 MCP Server](https://github.com/assafelovic/gpt-researcher#-mcp-server)

We've moved our MCP server to a dedicated repository: [gptr-mcp](https://github.com/assafelovic/gptr-mcp).

The GPT Researcher MCP Server enables AI applications like Claude to conduct deep research. While LLM apps can access web search tools with MCP, GPT Researcher MCP delivers deeper, more reliable research results.

Features:

- Deep research capabilities for AI assistants
- Higher quality information with optimized context usage
- Comprehensive results with better reasoning for LLMs
- Claude Desktop integration

For detailed installation and usage instructions, please visit the [official repository](https://github.com/assafelovic/gptr-mcp).

## 👪 Multi-Agent Assistant

[Permalink: 👪 Multi-Agent Assistant](https://github.com/assafelovic/gpt-researcher#-multi-agent-assistant)

As AI evolves from prompt engineering and RAG to multi-agent systems, we're excited to introduce multi-agent assistants built with [LangGraph](https://python.langchain.com/v0.1/docs/langgraph/) and [AG2](https://github.com/ag2ai/ag2).

By using multi-agent frameworks, the research process can be significantly improved in depth and quality by leveraging multiple agents with specialized skills. Inspired by the recent [STORM](https://arxiv.org/abs/2402.14207) paper, this project showcases how a team of AI agents can work together to conduct research on a given topic, from planning to publication.

An average run generates a 5-6 page research report in multiple formats such as PDF, Docx and Markdown.

Check it out [here](https://github.com/assafelovic/gpt-researcher/tree/master/multi_agents) or head over to our documentation for [LangGraph](https://docs.gptr.dev/docs/gpt-researcher/multi_agents/langgraph) and [AG2](https://docs.gptr.dev/docs/gpt-researcher/multi_agents/ag2) for more information.

## 🔍 Observability

[Permalink: 🔍 Observability](https://github.com/assafelovic/gpt-researcher#-observability)

GPT Researcher supports **LangSmith** for enhanced tracing and observability, making it easier to debug and optimize complex multi-agent workflows.

To enable tracing:

1. Set the following environment variables:



```
export LANGCHAIN_TRACING_V2=true
export LANGCHAIN_API_KEY=your_api_key
export LANGCHAIN_PROJECT="gpt-researcher"
```

2. Run your research tasks as usual. All LangGraph-based agent interactions will be automatically traced and visualized in your LangSmith dashboard.

## 🖥️ Frontend Applications

[Permalink: 🖥️ Frontend Applications](https://github.com/assafelovic/gpt-researcher#%EF%B8%8F-frontend-applications)

GPT-Researcher now features an enhanced frontend to improve the user experience and streamline the research process. The frontend offers:

- An intuitive interface for inputting research queries
- Real-time progress tracking of research tasks
- Interactive display of research findings
- Customizable settings for tailored research experiences

Two deployment options are available:

1. A lightweight static frontend served by FastAPI
2. A feature-rich NextJS application for advanced functionality

For detailed setup instructions and more information about the frontend features, please visit our [documentation page](https://docs.gptr.dev/docs/gpt-researcher/frontend/introduction).

## 🚀 Contributing

[Permalink: 🚀 Contributing](https://github.com/assafelovic/gpt-researcher#-contributing)

We highly welcome contributions! Please check out [contributing](https://github.com/assafelovic/gpt-researcher/blob/master/CONTRIBUTING.md) if you're interested.

Please check out our [roadmap](https://trello.com/b/3O7KBePw/gpt-researcher-roadmap) page and reach out to us via our [Discord community](https://discord.gg/QgZXvJAccX) if you're interested in joining our mission.
[![](https://camo.githubusercontent.com/4a0f2d4ca5fb2ede09c05f08c288a75f33ccccd2e28b5e782b7d8dc74db60852/68747470733a2f2f636f6e747269622e726f636b732f696d6167653f7265706f3d6173736166656c6f7669632f6770742d72657365617263686572266d61783d31303030)](https://github.com/assafelovic/gpt-researcher/graphs/contributors)

## ✉️ Support / Contact us

[Permalink: ✉️ Support / Contact us](https://github.com/assafelovic/gpt-researcher#%EF%B8%8F-support--contact-us)

- [Community Discord](https://discord.gg/spBgZmm3Xe)
- Author Email: [assaf.elovic@gmail.com](mailto:assaf.elovic@gmail.com)

## 🛡 Disclaimer

[Permalink: 🛡 Disclaimer](https://github.com/assafelovic/gpt-researcher#-disclaimer)

This project, GPT Researcher, is an experimental application and is provided "as-is" without any warranty, express or implied. We are sharing codes for academic purposes under the Apache 2 license. Nothing herein is academic advice, and NOT a recommendation to use in academic or research papers.

Our view on unbiased research claims:

1. The main goal of GPT Researcher is to reduce incorrect and biased facts. How? We assume that the more sites we scrape the less chances of incorrect data. By scraping multiple sites per research, and choosing the most frequent information, the chances that they are all wrong is extremely low.
2. We do not aim to eliminate biases; we aim to reduce it as much as possible. **We are here as a community to figure out the most effective human/llm interactions.**
3. In research, people also tend towards biases as most have already opinions on the topics they research about. This tool scrapes many opinions and will evenly explain diverse views that a biased person would never have read.

* * *

[![Star History Chart](https://camo.githubusercontent.com/2b274bff719d7bbfaff79bf185bb5fdb4ce5188b12e8110530ac35627247c4a7/68747470733a2f2f737461722d686973746f72792e646572612e706167652f7376673f7265706f733d6173736166656c6f7669632f6770742d7265736561726368657226747970653d44617465)](https://star-history.dera.page/#assafelovic/gpt-researcher)

[⬆️ Back to Top](https://github.com/assafelovic/gpt-researcher#top)

## About

An autonomous agent that conducts deep research on any data using any LLM providers

[gptr.dev](https://gptr.dev/)

### Topics

[agent](https://github.com/topics/agent) [ai](https://github.com/topics/ai) [automation](https://github.com/topics/automation) [deepresearch](https://github.com/topics/deepresearch) [llms](https://github.com/topics/llms) [mcp](https://github.com/topics/mcp) [mcp-server](https://github.com/topics/mcp-server) [python](https://github.com/topics/python) [research](https://github.com/topics/research) [search](https://github.com/topics/search) [webscraping](https://github.com/topics/webscraping)

### Resources

[Readme](https://github.com/assafelovic/gpt-researcher#readme-ov-file)

[Apache-2.0 license](https://github.com/assafelovic/gpt-researcher#Apache-2.0-1-ov-file)

### Code of conduct

[Code of conduct](https://github.com/assafelovic/gpt-researcher#coc-ov-file)

### Contributing

[Contributing](https://github.com/assafelovic/gpt-researcher#contributing-ov-file)

### Security policy

[Security policy](https://github.com/assafelovic/gpt-researcher#security-ov-file)

Cite this repository

[Activity](https://github.com/assafelovic/gpt-researcher/activity)

### Stars

**29.9k** stars

### Watchers

**176** watching

### Forks

[**4.1k** forks](https://github.com/assafelovic/gpt-researcher/forks)

[Report repository](https://github.com/contact/report-content?content_url=https%3A%2F%2Fgithub.com%2Fassafelovic%2Fgpt-researcher&report=assafelovic+%28user%29)

## [Releases](https://github.com/assafelovic/gpt-researcher/releases) 74 (74)

[Jev update and many bug fixes and improvementsLatest\\
\\
last weekSep 26, 2026](https://github.com/assafelovic/gpt-researcher/releases/tag/v3.7.0)

[\+ 73 releases](https://github.com/assafelovic/gpt-researcher/releases)

## [Used by](https://github.com/assafelovic/gpt-researcher/network/dependents) 270 (270)

[![@LinkupPlatform](https://avatars.githubusercontent.com/u/175112039?s=64&v=4)![@keenableai](https://avatars.githubusercontent.com/u/236486265?s=64&v=4)![@0ofta](https://avatars.githubusercontent.com/u/8416661?s=64&v=4)![@chidionyema](https://avatars.githubusercontent.com/u/377396?s=64&v=4)![@sk-surya](https://avatars.githubusercontent.com/u/45133775?s=64&v=4)\\
\+ 264](https://github.com/assafelovic/gpt-researcher/network/dependents)

## [Contributors](https://github.com/assafelovic/gpt-researcher/graphs/contributors) 259 (259)

- [![@assafelovic](https://avatars.githubusercontent.com/u/13554167?s=64&v=4)](https://github.com/assafelovic)
- [![@ElishaKay](https://avatars.githubusercontent.com/u/16700452?s=64&v=4)](https://github.com/ElishaKay)
- [![@rotemweiss57](https://avatars.githubusercontent.com/u/91344214?s=64&v=4)](https://github.com/rotemweiss57)
- [![@ewgdg](https://avatars.githubusercontent.com/u/15310401?s=64&v=4)](https://github.com/ewgdg)
- [![@claude](https://avatars.githubusercontent.com/u/81847?s=64&v=4)](https://github.com/claude)
- [![@Bartok9](https://avatars.githubusercontent.com/u/259807879?s=64&v=4)](https://github.com/Bartok9)
- [![@kga245](https://avatars.githubusercontent.com/u/74297?s=64&v=4)](https://github.com/kga245)
- [![@dependabot[bot]](https://avatars.githubusercontent.com/in/29110?s=64&v=4)](https://github.com/dependabot[bot])
- [![@proy9714](https://avatars.githubusercontent.com/u/37247296?s=64&v=4)](https://github.com/proy9714)
- [![@gregdrizz](https://avatars.githubusercontent.com/u/52860985?s=64&v=4)](https://github.com/gregdrizz)
- [![@kesamet](https://avatars.githubusercontent.com/u/8352701?s=64&v=4)](https://github.com/kesamet)
- [![@0x11c11e](https://avatars.githubusercontent.com/u/95732859?s=64&v=4)](https://github.com/0x11c11e)
- [![@hslee16](https://avatars.githubusercontent.com/u/3871876?s=64&v=4)](https://github.com/hslee16)

[\+ 245 contributors](https://github.com/assafelovic/gpt-researcher/graphs/contributors)

## Languages

- [Python70.4%](https://github.com/assafelovic/gpt-researcher/search?l=python)
- [TypeScript18.2%](https://github.com/assafelovic/gpt-researcher/search?l=typescript)
- [JavaScript4.7%](https://github.com/assafelovic/gpt-researcher/search?l=javascript)
- [CSS4.1%](https://github.com/assafelovic/gpt-researcher/search?l=css)
- [HCL1.2%](https://github.com/assafelovic/gpt-researcher/search?l=hcl)
- [HTML1.2%](https://github.com/assafelovic/gpt-researcher/search?l=html)
- [Other0.2%](https://github.com/assafelovic/gpt-researcher/search?l=Other)

You can’t perform that action at this time.
