# MAP - topic decomposition

## Topic

Which similar agent-research and evidence-provenance tools on GitHub and Hugging Face do something this kit should take

## Subtopics

Statuses are blank on purpose: phase 0 gathers material, it does not judge. Mark each
row COVERED (cite the U-## rows that cover it), DISMISSED (reason required - dismissing
is fine, omitting is not), or GAP, and add topic-specific subtopics where the checklist
is not enough.

| ID | Subtopic | Why it matters | Status | Covered by |
|---|---|---|---|---|
| D-1 | Access model | Public pages, an official API, an auth-walled app, or a paywall - each is a different collection design | COVERED | U-01, U-02, U-03 |
| D-2 | Auth and credentials | What accounts, keys, or logins the collection and the product need, and who holds them | DISMISSED | public GitHub and Hugging Face pages need no account; the only credential in play is the kit's own Firecrawl key, held on the collector machine |
| D-3 | Rate limits and quotas | Caps every cadence in the design, and caps the research collection itself | DISMISSED | a one-off survey of at most twelve pages; GitHub's and Hugging Face's limits on anonymous page views are orders of magnitude above it, and the kit caps its own retries |
| D-4 | ToS, licensing, legality of the intended use | A prohibition on automated collection, storage, or display ends the design for that source - and sometimes the project | COVERED | U-04 |
| D-5 | Data schema and its stability | How the data is shaped, and how often the source changes the shape without asking | DISMISSED | no data schema is consumed: the output is a decision read by a person, not a pipeline fed by these pages |
| D-6 | Freshness and staleness | How fast the data goes stale, and what staleness costs the product that depends on it | COVERED | U-01, U-02, U-03 |
| D-7 | Cost at expected volume | The economics at real usage, not the pricing page's first row - this decides viability | DISMISSED | about twenty Firecrawl credits once (four searches, up to twelve scrapes); nothing recurs |
| D-8 | Runtime and platform limits | Where this actually executes - OS, runtime version, desktop app, cloud - and what those limits forbid | DISMISSED | nothing executes: a mechanism taken would be rewritten in the kit's own Node ESM with no dependencies, and that rewrite is phase 2's, behind an ADR |
| D-9 | Output obtainability | Does the data your stated "done" depends on exist, and can you actually get it? Load-bearing: a project whose output cannot be produced should die in phase 1, not phase 2 | COVERED | U-05 |

## Coverage notes (per dimension)

- D-1, D-6: every candidate is a public page (a GitHub repository, a Hugging Face blog or
  Space, an arXiv HTML); U-01..U-03 read them, and the retrieval date on each row is the
  freshness - this field moves monthly, so the brief dates the survey.
- D-4: U-04 reads each candidate's licence from its own page.
- D-9: U-05 asks the load-bearing question - is there a mechanism to take at all - and
  "none, leave as is" is an obtainable answer.
- D-2, D-3, D-5, D-7, D-8: dismissed with the reason in the row.

## Candidate material

Gathered 2026-10-02.

Likely owners of these facts (by how often a search pointed at them):

- `reddit.com` (4)
- `huggingface.co/blog` (3)
- `discuss.huggingface.co` (2)
- `github.com/jim-schwoebel` (1)
- `redwoodresearch.org` (1)
- `youtube.com` (1)

Candidate pages:

- [Open-source DeepResearch – Freeing our search agents](https://huggingface.co/blog/open-deep-research)
- [I'm building HuggingFace for AI agents. Tell me what you ... - Reddit](https://www.reddit.com/r/LLMDevs/comments/1fu6pmz/im_building_huggingface_for_ai_agents_tell_me/)
- [Awesome AI Agents: Tools, Resources, and Projects - GitHub](https://github.com/jim-schwoebel/awesome_ai_agents)
- [Source-Aware Verification for MCP Agents - Hugging Face](https://huggingface.co/blog/MultiverseComputingCAI/getting-the-source-right-not-just-the-fact-source)
- [Brief independent investigation of agents' behavior, reasoning and ...](https://www.redwoodresearch.org/research/hugging-face-incident)
- [IntelShed: An Open-Source Platform for OSINT, AI Research, and ...](https://discuss.huggingface.co/t/intelshed-an-open-source-platform-for-osint-ai-research-and-collaborative-intelligence/178410)
- [HuggingFace Smolagents Open Source AI Agent Framework Full ...](https://www.youtube.com/watch?v=WoosiKbOAqU)
- [Introducing Model Provenance Kit: Know Where Your AI ... - Cisco Blogs](https://blogs.cisco.com/ai/model-provenance-kit)
- [BREAKING: I just discovered an open source AI research ... - Facebook](https://www.facebook.com/groups/market.report/posts/1904106930547259/)
- [The best open source frameworks for building AI agents in 2026 - Firecrawl](https://www.firecrawl.dev/blog/best-open-source-agent-frameworks)
- [Do we rely too much on huggingface? Do you think they'll eventually ...](https://www.reddit.com/r/LocalLLaMA/comments/1ozo2v8/do_we_rely_too_much_on_huggingface_do_you_think/)
- [ORCA: A Cognitive Runtime Layer for Agent Systems (paper + open source)](https://discuss.huggingface.co/t/orca-a-cognitive-runtime-layer-for-agent-systems-paper-open-source/175055)
- [AgentHub: A Registry for Discoverable, Verifiable, and Reproducible AI ...](https://arxiv.org/html/2510.03495v2)
- [Security incident disclosure — July 2026 - Hugging Face](https://huggingface.co/blog/security-incident-july-2026)
- [Detailed account of the OpenAI/Huggingface agentic hack](https://www.reddit.com/r/singularity/comments/1vipy0p/detailed_account_of_the_openaihuggingface_agentic/)
- [AI vs AI: How has the Hugging Face breach changed AI security?](https://www.spiceworks.com/ai/ai-vs-ai-how-has-the-hugging-face-breach-changed-ai-security/)
- [[D] Hugging Face, GitHub and more unite to defend open source in EU ...](https://www.reddit.com/r/MachineLearning/comments/15c4qk2/d_hugging_face_github_and_more_unite_to_defend/)
- [Hugging Face's Autonomous AI Agent Breach - Cloud Security Alliance](https://labs.cloudsecurityalliance.org/research/csa-research-note-huggingface-autonomous-agent-breach-202607/)

## Outlines seen in the material

_No outlines - none of these pages is captured yet. `--max-scrapes <n>` captures the first n; their headings appear here._

