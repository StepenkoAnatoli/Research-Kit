# MAP - topic decomposition

## Topic

When and why GitHub answers 403 to unauthenticated non-browser fetches of github.com pages, and which routes GitHub documents for fetching a README or raw file without a browser session

## Subtopics

Statuses are blank on purpose: phase 0 gathers material, it does not judge. Mark each
row COVERED (cite the U-## rows that cover it), DISMISSED (reason required - dismissing
is fine, omitting is not), or GAP, and add topic-specific subtopics where the checklist
is not enough.

| ID | Subtopic | Why it matters | Status | Covered by |
|---|---|---|---|---|
| D-1 | Access model | Public pages, an official API, an auth-walled app, or a paywall - each is a different collection design | COVERED | U-01, U-02, U-04, U-05 |
| D-2 | Auth and credentials | What accounts, keys, or logins the collection and the product need, and who holds them | COVERED | U-01 |
| D-3 | Rate limits and quotas | Caps every cadence in the design, and caps the research collection itself | COVERED | U-01 |
| D-4 | ToS, licensing, legality of the intended use | A prohibition on automated collection, storage, or display ends the design for that source - and sometimes the project | COVERED | U-03 |
| D-5 | Data schema and its stability | How the data is shaped, and how often the source changes the shape without asking | DISMISSED | nothing consumes a schema: the remedy is a sentence in a failure message, and the REST media types are read once for U-02 |
| D-6 | Freshness and staleness | How fast the data goes stale, and what staleness costs the product that depends on it | COVERED | U-04 |
| D-7 | Cost at expected volume | The economics at real usage, not the pricing page's first row - this decides viability | DISMISSED | every route weighed is free, and the collection is two phase-0 searches and a handful of fetches once |
| D-8 | Runtime and platform limits | Where this actually executes - OS, runtime version, desktop app, cloud - and what those limits forbid | COVERED | U-04 |
| D-9 | Output obtainability | Does the data your stated "done" depends on exist, and can you actually get it? Load-bearing: a project whose output cannot be produced should die in phase 1, not phase 2 | COVERED | U-04, U-05 |

## Coverage notes (per dimension)

- D-1, D-9: three hosts (github.com, api.github.com, raw.githubusercontent.com) and two
  transports (keyless, browser) are measured by this corpus's own ledger; the documented
  routes are U-02.
- D-2, D-3: U-01 - what an address without a token is allowed, and how a refusal is spelled.
- D-4: U-03, GitHub's acceptable use policy on automated access.
- D-6: U-04 is a dated measurement; the block can change without notice, which is why the
  message names a route rather than promising one.
- D-8: the browser transport needs the Chromium the kit already drives (U-04).
- D-5, D-7: dismissed with the reason in the row.

## Candidate material

Gathered 2026-10-02.

Likely owners of these facts (by how often a search pointed at them):

- `github.com/community` (5)
- `docs.github.com` (4)
- `stackoverflow.com` (2)
- `youtube.com` (1)
- `github.com/scross01` (1)
- `forum.sailfishos.org` (1)

Candidate pages:

- [Help and advice · community · Discussion #55516 - GitHub](https://github.com/orgs/community/discussions/55516)
- [How could i get a permanent link for raw file? #22537 - GitHub](https://github.com/orgs/community/discussions/22537)
- [Suddenly started receiving 403 Forbidden when fetching private ...](https://github.com/orgs/community/discussions/29019)
- [How can I test what my readme.md file will look like before committing to ...](https://stackoverflow.com/questions/9331281/how-can-i-test-what-my-readme-md-file-will-look-like-before-committing-to-github)
- [[FIXED] GitHub Error: The Requested URL Returned Error 403 (2026)](https://www.youtube.com/watch?v=M6ABLjKP8b8)
- [scross01/fetch: A command-line tool to fetch web pages and ... - GitHub](https://github.com/scross01/fetch)
- [Custom domain "403 Forbidden" using Github Pages - Stack Overflow](https://stackoverflow.com/questions/55289779/custom-domain-403-forbidden-using-github-pages)
- [Browser - Github not rendering codetree and readme anymore](https://forum.sailfishos.org/t/browser-github-not-rendering-codetree-and-readme-anymore/17776)
- [gh-pages fails to render images from public GitHub repo (403 forbidden)](https://github.com/orgs/community/discussions/137093)
- [About the repository README file - GitHub Docs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes)
- [Completely unable to push local repo to empty GitHub repo (Error 403)](https://www.reddit.com/r/github/comments/1nzwd6v/completely_unable_to_push_local_repo_to_empty/)
- [Chapter 34 Make a GitHub repo browsable](https://happygitwithr.com/workflows-browsability)
- [[Bug] Models settings page returns HTTP 403 when browser sends a ...](https://github.com/deepseek-ai/deepseek-harness/discussions/894)
- [Support for HTML READMEs (README.html) #109580 - GitHub](https://github.com/orgs/community/discussions/109580)
- [Solving the GitHub 403 Error: Why Your Push may be Blocked (and ...](https://thomasthornton.cloud/solving-the-github-403-error-why-your-push-may-be-blocked-and-how-i-fixed-it/)
- [Read files on the web into R - June Choe](https://yjunechoe.github.io/posts/2024-09-22-fetch-files-web/)

## Outlines seen in the material

_No outlines - none of these pages is captured yet. `--max-scrapes <n>` captures the first n; their headings appear here._

