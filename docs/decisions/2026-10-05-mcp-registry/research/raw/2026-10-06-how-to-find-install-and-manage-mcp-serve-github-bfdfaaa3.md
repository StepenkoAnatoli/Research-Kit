---
url: https://github.blog/ai-and-ml/generative-ai/how-to-find-install-and-manage-mcp-servers-with-the-github-mcp-registry/
retrieved: 2026-10-06
command: firecrawl scrape https://github.blog/ai-and-ml/generative-ai/how-to-find-install-and-manage-mcp-servers-with-the-github-mcp-registry/ --only-main-content --max-age 0 --format markdown,rawHtml --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: How to find, install, and manage MCP servers with the GitHub MCP Registry - The GitHub Blog
---
[Andrea Griffiths](https://github.blog/author/andreagriffiths11/ "Posts by Andrea Griffiths")· [@AndreaGriffiths11](https://github.com/AndreaGriffiths11)

October 24, 2025

\|
6 minutes

- Share:
- [Share on X](https://x.com/share?text=How%20to%20find%2C%20install%2C%20and%20manage%20MCP%20servers%20with%20the%20GitHub%20MCP%20Registry&url=https%3A%2F%2Fgithub.blog%2Fai-and-ml%2Fgenerative-ai%2Fhow-to-find-install-and-manage-mcp-servers-with-the-github-mcp-registry%2F)
- [Share on Facebook](https://www.facebook.com/sharer/sharer.php?t=How%20to%20find%2C%20install%2C%20and%20manage%20MCP%20servers%20with%20the%20GitHub%20MCP%20Registry&u=https%3A%2F%2Fgithub.blog%2Fai-and-ml%2Fgenerative-ai%2Fhow-to-find-install-and-manage-mcp-servers-with-the-github-mcp-registry%2F)
- [Share on LinkedIn](https://www.linkedin.com/shareArticle?title=How%20to%20find%2C%20install%2C%20and%20manage%20MCP%20servers%20with%20the%20GitHub%20MCP%20Registry&url=https%3A%2F%2Fgithub.blog%2Fai-and-ml%2Fgenerative-ai%2Fhow-to-find-install-and-manage-mcp-servers-with-the-github-mcp-registry%2F)

Picture this: you walk into a grocery store and nothing makes sense. The cereal is scattered across three aisles. The milk is hiding in some random cooler near self-checkout. And those produce labels? They haven’t been updated in months.

That’s exactly what discovering Model Context Protocol (MCP) servers felt like. Until now.

As a refresher, [MCP is how developers connect tools, APIs, and workflows to their AI systems](https://github.blog/ai-and-ml/llms/what-the-heck-is-mcp-and-why-is-everyone-talking-about-it/). Each MCP server is like an ingredient in your AI stack, whether it’s Playwright for browser automation, Notion for knowledge access, or GitHub’s own MCP server with over a hundred tools.

The new [GitHub MCP Registry](https://github.blog/ai-and-ml/github-copilot/meet-the-github-mcp-registry-the-fastest-way-to-discover-mcp-servers/) changes everything by giving you a single, canonical source for discovering, installing, and managing MCP servers right on GitHub.

Here’s what you need to know about finding the right tools for your AI stack, publishing your own servers, and setting up governance for your team.

In this blog, we’ll walk through how to:

- Install an MCP server
- Publish your own
- Enable governance and team use

We’ll also share a few tips and tricks for power users. Let’s go!

## What’s in the registry today

Currently, the [GitHub MCP Registry](https://github.com/mcp) has **44 MCP servers**, including:

- **Playwright**: Automate and test web apps.
- **GitHub MCP server**: Access 100+ GitHub API tools.
- **Context7**, **MarkItDown** (Microsoft), **Terraform** (HashiCorp).
- Partner servers from **Notion, Unity, Firecrawl, Stripe,** and more.

You can browse by tags, popularity, or GitHub stars to find the tools you need.

## How to install an MCP server

The registry makes installation a one-click experience in **VS Code** or **VS Code Insiders**.

### Example: Installing Playwright

1. Navigate to Playwright MCP server in the GitHub MCP Registry.
2. Click **Install in VS Code**.
3. VS Code launches with a pre-filled configuration.
4. Accept or adjust optional parameters (like storage paths).

That’s it. You’re ready to use Playwright in your agentic workflows.

✅ **Pro tip:** Remote MCP servers (like GitHub’s) use OAuth during install so you don’t need to manually handle tokens or secrets. Just authenticate once and start building.

## How to publish your own MCP server

### 1\. Install the MCP Publisher CLI

- macOS/Linux/WSL (Homebrew, recommended):

```undefined
brew install mcp-publisher
```

- macOS/Linux/WSL (prebuilt binary, latest version):

```bash
"https://github.com/modelcontextprotocol/registry/releases/download/latest/mcp-publisher_$(uname -s | tr '[:upper:]' '[:lower:]')_$(uname -m | sed 's/x86_64/amd64/;s/aarch64/arm64/').tar.gz" | tar xz mcp-publisher && sudo mv mcp-publisher /usr/local/bin/
```

### 2\. Initialize your `server.json` file

Navigate to your server’s source directory and run:

```swift
cd /path/to/your/mcp-server
mcp-publisher init
```

This creates a `server.json` file. Example:

```bash
{
  "$schema": "https://static.modelcontextprotocol.io/schemas/2025-09-29/server.schema.json",
  "name": "io.github.yourname/your-server",
  "title": "Describe Your Server",
  "description": "A description of your MCP server",
  "version": "1.0.0",
  "packages": [\
    {\
      "registryType": "npm",\
      "identifier": "your-package-name",\
      "version": "1.0.0",\
      "transport": { "type": "stdio" }\
    }\
  ]
}
```

### 3\. Prove you own the package

Add the required metadata for your package type.

- **NPM:** Add an `"mcpName"` field to your `package.json`:

```plaintext
{
  "name": "your-npm-package",
  "mcpName": "io.github.username/server-name"
}
```

- **PyPI/NuGet:** Add this to your README:

```plaintext
mcp-name: io.github.username/server-name
```

- **Docker:** Add a label to your Dockerfile:

```plaintext
LABEL io.modelcontextprotocol.server.name="io.github.username/server-name"
```

### 4\. Authentication

- For GitHub-based namespaces (`io.github.*`), run:

```undefined
mcp-publisher login github
```

This will open a browser for OAuth login.

- For custom domains (`com.yourcompany/*`), follow DNS verification steps in the [official docs](https://github.com/modelcontextprotocol/registry/blob/main/docs/guides/publishing/publish-server.md).

### 5\. Publish your server

Once authenticated, publish to the registry:

```undefined
mcp-publisher publish
```

If successful, your server will be discoverable in the MCP registry. You can verify with:

```bash
curl "https://registry.modelcontextprotocol.io/v0/servers?search=io.github.yourname/your-server"
```

> Once you’ve completed the steps above, email [partnerships@github.com](mailto:partnerships@github.com) and request for your server to be included.

✅ **Pro tips:**

- **Namespace:** Use `io.github.username/*` for GitHub auth, or `com.yourcompany/*` for DNS-based verification.
- **Remote endpoints:** Add a `"remotes"` array in your `server.json` for cloud/HTTP endpoints:

```json
"remotes": [\
  {\
    "type": "streamable-http",\
    "url": "https://yourdomain.com/yourserver"\
  }\
]
```

- **Multiple deployment options:** You can list both `"packages"` and `"remotes"` for hybrid deployments.
- **Examples:** See [airtable-mcp-server (npm/docker/MCPB)](https://github.com/domdomegg/airtable-mcp-server), [time-mcp-nuget](https://github.com/domdomegg/time-mcp-nuget), [time-mcp-pypi](https://github.com/domdomegg/time-mcp-pypi).

## Automate publishing with GitHub Actions

You can automate publishing so every tagged release is published to both your package registry and the MCP registry.

Create `.github/workflows/publish-mcp.yml`:

```plaintext
name: Publish to MCP Registry
on:
  push:
    tags: ["v*"]

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      id-token: write  # For OIDC
      contents: read

    steps:
      - uses: actions/checkout@v5

      # (Edit these for your package type)
      - name: Setup Node.js
        uses: actions/setup-node@v5
        with:
          node-version: "lts/*"
      - name: Install dependencies
        run: npm ci
      - name: Build and test
        run: |
          npm run build --if-present
          npm run test --if-present
      - name: Publish to npm
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

      # MCP publishing (works for all package types)
      - name: Download MCP Publisher
        run: |
          curl -L "https://github.com/modelcontextprotocol/registry/releases/download/latest/mcp-publisher_$(uname -s | tr '[:upper:]' '[:lower:]')_$(uname -m | sed 's/x86_64/amd64/;s/aarch64/arm64/').tar.gz" | tar xz mcp-publisher
      - name: Publish to MCP Registry
        run: |
          ./mcp-publisher login github-oidc
          ./mcp-publisher publish

      # Optional: keep server.json version in sync with git tag
      - run: |
          VERSION=${GITHUB_REF#refs/tags/v}
          jq --arg v "$VERSION" '.version = $v' server.json > tmp && mv tmp server.json
```

To trigger the workflow:

```plaintext
git tag v1.0.0
git push origin v1.0.0
```

When you publish, your server shows up in the open source registry and downstream registries (like GitHub’s) automatically pick up updates. No more notifying a dozen different registries every time you ship a new version.

✅ **Pro tips:**

- Host your code in a **public GitHub repository** to show verified ownership.
- Add tags in `server.json` so developers can easily discover your server by category.
- Updates propagate automatically downstream—no manual notifications required

**How to manage MCP servers in the enterprise**

If you’re managing MCP usage across a large organization, governance isn’t optional. You need control over which servers your developers can install—especially when those servers interact with sensitive data.

GitHub now supports **registry allow lists** so admins can control which MCP servers are available to developers.

Here are the steps for admins (which may be you!):

1. Stand up or connect an internal registry that follows the MCP API spec (registry + HTTP endpoint).
2. Add vetted MCP servers (internal + external) to your registry.
3. Point GitHub Enterprise settings to that registry endpoint.
4. MCP-aware surfaces (starting with VS Code) enforce the allow list automatically.

**Example: How the allow list works**

Your internal registry at `https://internal.mybank.com/mcp-registry` returns:

```json
{
  "servers": [\
    {\
      "name": "github.com/github/mcp-server",\
      "version": "1.0.0"\
    },\
    {\
      "name": "github.com/microsoft/markitdown-mcp",\
      "version": "2.1.0"\
    },\
    {\
      "name": "internal.mybank.com/mcp-servers/custom-tools",\
      "version": "1.5.0"\
    }\
  ]
}
```

When developers try to install an MCP server in VS Code, GitHub checks your registry endpoint and only allows installations from your approved list.

This governance model means you can vet partnerships, run security scans, and maintain compliance, all while giving developers access to the tools they need.

✅ **Pro tip:** Use GitHub’s API or your existing security pipeline to vet MCP servers before adding them to your allow list.

## Tips and tricks for power users

Once you’ve got the basics down, here are some shortcuts to get more out of the registry:

- **Sort smarter**: Use GitHub stars and org verification to quickly assess quality and legitimacy. If a server has thousands of stars and comes from a verified org like Microsoft or HashiCorp, that’s a strong signal.
- **Local testing**: Test your MCP server before publishing using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector). This helps you catch issues early without polluting the registry.
- **Agent synergy**: Copilot coding agent comes preloaded with GitHub and Playwright MCP servers. This combo enables auto-generated pull requests with screenshots of web apps, perfect for UI-heavy projects where visual validation matters.
- **Tool overload fix**: VS Code is rolling out semantic tool lookups, so your agent won’t flood contexts with 90+ tools. Instead, only the relevant ones surface based on your prompt. This makes working with large MCP servers like GitHub’s much more manageable.

## What’s next?

The GitHub MCP Registry is just getting started. Here’s a look at what’s on the horizon—from self-publication to enterprise adoption—so you can see where the ecosystem is heading.

- **Self-publication**: Expected in the next couple months. This will unlock community-driven growth and make the registry the canonical source for all public MCP servers.
- **More IDE support**: Other IDEs are coming. The goal is to make MCP server installation seamless regardless of where you write code.
- **Enterprise features**: Governance flows to help unlock MCP usage in regulated industries. Think financial services, healthcare, and other sectors where compliance isn’t negotiable.
- **Agentic workflows**: GitHub MCP server will start bundling tools into use-case-driven flows (e.g., “analyze repository + open pull request”) instead of just exposing raw API endpoints. This will make complex workflows feel like simple commands.

## Get started today

The GitHub MCP Registry has 44 servers today and will continue growing (trust us!).

👉 Explore the [MCP Registry](https://github.com/mcp?utm_source=blog-source&utm_campaign=mcp-registry-server-launch-2025) on GitHub

👉 To nominate your server now, email **partnerships@github.com**.

Soon, this registry will become the single source of truth for MCP servers, giving you one place to discover, install, and govern tools without hopping across outdated registries.

The future of AI-assisted development isn’t about coding faster. It’s about orchestrating tools that amplify your impact. And the GitHub MCP Registry is where that orchestration begins.

* * *

## Tags:

- [MCP](https://github.blog/tag/mcp/)

## Written by

![Andrea Griffiths](https://github.blog/wp-content/uploads/2025/08/Andrea-Griffiths_avatar_1755783168-200x200.jpeg)

Andrea is a Senior Developer Advocate at GitHub with over a decade of experience in developer tools. She combines technical depth with a mission to make advanced technologies more accessible. After transitioning from Army service and construction management to software development, she brings a unique perspective to bridging complex engineering concepts with practical implementation. She lives in Florida with her Welsh partner, two sons, and two dogs, where she continues to drive innovation and support open source through GitHub's global initiatives. Find her online @acolombiadev.

## Related posts

![Geometric blocks featuring the GitHub invertocat logo and a web icon in a decorative background.](https://github.blog/wp-content/uploads/2026/01/generic-invertocat-logo.png?resize=400%2C212)

[AI & ML](https://github.blog/ai-and-ml/)

### [ReviewBench: An open benchmark for AI code review](https://github.blog/ai-and-ml/github-copilot/reviewbench-an-open-benchmark-for-ai-code-review/)

We’re launching ReviewBench, a benchmark for code review agents built on representative GitHub pull requests, multi-source ground truth, calibrated evaluation, and production-aligned metrics.

![Decorative header image with a Copilot logo and the phrase 'Branching Out_'](https://github.blog/wp-content/uploads/2026/03/branchingout.png?resize=400%2C212)

[AI & ML](https://github.blog/ai-and-ml/)

### [AI is changing developer work. Here are three skills to strengthen.](https://github.blog/ai-and-ml/ai-is-rewriting-the-developer-career-ladder-heres-how-to-stand-out/)

Learn to direct AI agents, critically review their output, and keep technical judgment at the center of your workflow.

![GitHub Copilot app for Beginners: Build custom AI surfaces](https://github.blog/wp-content/uploads/2026/09/Screenshot-2026-09-23-at-3.59.20-PM.png?resize=400%2C212)

[AI & ML](https://github.blog/ai-and-ml/)

### [GitHub Copilot app for Beginners: How to build custom workflows with canvases](https://github.blog/ai-and-ml/github-copilot/github-copilot-app-for-beginners-how-to-build-custom-workflows-with-canvases/)

Describe the interface you need in plain English, then let the agent build a live surface you can both use and update—so you spend less time adapting to tools and more time getting work done.

## We do newsletters, too

Discover tips, technical guides, and best practices in our biweekly newsletter just for devs.

Your email address

\*Your email address

Subscribe

Yes please, I’d like GitHub and affiliates to use my information for personalized communications, targeted advertising and campaign effectiveness. See the [GitHub Privacy Statement](https://github.com/site/privacy) for more details.

Subscribe

×
