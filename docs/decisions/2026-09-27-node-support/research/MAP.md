# MAP - topic decomposition

## Topic

Node.js release schedule and NODE_USE_ENV_PROXY support

## Subtopics

Statuses are blank on purpose: phase 0 gathers material, it does not judge. Mark each
row COVERED (cite the U-## rows that cover it), DISMISSED (reason required - dismissing
is fine, omitting is not), or GAP, and add topic-specific subtopics where the checklist
is not enough.

| ID | Subtopic | Why it matters | Status | Covered by |
|---|---|---|---|---|
| D-1 | Access model | Public pages, an official API, an auth-walled app, or a paywall - each is a different collection design | COVERED | U-1, U-2, U-3. Public documentation on nodejs.org and the Release working group's schedule |
| D-2 | Auth and credentials | What accounts, keys, or logins the collection and the product need, and who holds them | DISMISSED | no account or key is involved: every source is public, and the kit change needs none |
| D-3 | Rate limits and quotas | Caps every cadence in the design, and caps the research collection itself | DISMISSED | a handful of public pages, fetched once |
| D-4 | ToS, licensing, legality of the intended use | A prohibition on automated collection, storage, or display ends the design for that source - and sometimes the project | DISMISSED | reading public documentation to decide our own build; the corpus keeps quotes with their source |
| D-5 | Data schema and its stability | How the data is shaped, and how often the source changes the shape without asking | COVERED | U-2, U-3. The variable names and what they cover are the schema, and they changed across versions |
| D-6 | Freshness and staleness | How fast the data goes stale, and what staleness costs the product that depends on it | COVERED | U-1. Release lines move on a published schedule; the answer expires when Node 26 enters LTS |
| D-7 | Cost at expected volume | The economics at real usage, not the pricing page's first row - this decides viability | DISMISSED | no cost: the build step adds CI minutes on a public repository, which are free |
| D-8 | Runtime and platform limits | Where this actually executes - OS, runtime version, desktop app, cloud - and what those limits forbid | COVERED | U-1, U-2, U-3. This project is the runtime question |
| D-9 | Output obtainability | Does the data your stated "done" depends on exist, and can you actually get it? Load-bearing: a project whose output cannot be produced should die in phase 1, not phase 2 | COVERED | U-1, U-2, U-3. Node documents all three; what it does not document is measured and recorded in the brief |

## Coverage notes (per dimension)

_One short paragraph per row once it has a status: what was established, and what the
status rests on._

## Candidate material

Gathered 2026-09-27.

Likely owners of these facts (by how often a search pointed at them):

- `github.com` (10)
- `docs.rockxy.io` (4)
- `nodejs-api-docs-tooling.vercel.app` (2)
- `apollographql.com` (2)
- `factory.ai` (2)
- `zenmux.ai` (2)

Candidate pages:

- [HTTP | Node.js 26.10.0 Documentation](https://nodejs-api-docs-tooling.vercel.app/http)
- [Document `ProxyAgent` and HTTP/2 support · Issue #682](https://github.com/sindresorhus/ky/issues/682)
- [node - server-side JavaScript runtime](https://manpages.ubuntu.com/manpages/stonking/man1/nodejs.1.html)
- [Proxy Configuration](https://www.apollographql.com/docs/deploy-preview/5e4a01382d82f79661ac2fca/apollo-server/security/proxy-configuration/)
- [Configuration – Node.js wiki](https://factory.ai/open-source-wikis/node?page=reference%2Fconfiguration.md)
- [Node.js](https://docs.rockxy.io/setup-guides/nodejs)
- [Agent Tool Proxy Configuration Guide](https://zenmux.ai/docs/best-practices/network-environments.html)
- [camunda8/cli](https://www.npmjs.com/package/@camunda8/cli?activeTab=dependencies)
- [v1.53.0 | Backstage Software Catalog and Developer Platform](https://backstage.io/docs/releases/v1.53.0/)
- [proxy-from-env/README.md at master · Rob](https://github.com/Rob--W/proxy-from-env/blob/master/README.md)
- [How to Set Up Axios Proxy for Node.js (Yes, Even HTTPS)](https://thunderbit.com/blog/how-to-set-up-axios-proxy-node-js)
- [man page node section 1](https://manpagez.com/man/1/node/node-24.15.0.php)
- [Starting from Node.js 24.0.0, fetch() supports ...](https://www.cnblogs.com/xosg/p/19069844)
- [DEFRA/service-manual-ui](https://github.com/DEFRA/service-manual-ui)
- [inkbox/sdk](https://www.npmjs.com/package/@inkbox/sdk)
- [Git repository for service aice-triage-automation](https://github.com/DEFRA/aice-triage-automation)
- [Secure Deployment — ClaudeCode v0.25.0](https://hexdocs.pm/claude_code/0.25.0/secure-deployment.html)
- [axios/README.md at v1.x](https://github.com/axios/axios/blob/v1.x/README.md)
- [1c-odata (hacker-cb/1c-odata)](https://context7.com/hacker-cb/1c-odata)
- [Claude Opus 5.5 and GPT-6 Sol and Luna land the same day](https://yaw.sh/opus-5-5-gpt-6-sol-luna-same-day/)

