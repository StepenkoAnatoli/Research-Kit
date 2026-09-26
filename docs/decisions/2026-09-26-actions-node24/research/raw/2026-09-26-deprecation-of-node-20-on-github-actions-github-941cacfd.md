---
url: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/
retrieved: 2026-09-26
command: firecrawl scrape https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/ --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Deprecation of Node 20 on GitHub Actions runners - GitHub Changelog
---
[Back to changelog](https://github.blog/changelog/)

_Editor’s note (August 25, 2026): Updated the Node20 removal date to September 23rd, 2026._

_Editor’s note (February 25, 2026): Updated the migration date to June of 2026._

_Editor’s note (May 19, 2026): Updated the migration date to June 16th, 2026._

Node20 will reach end-of-life (EOL) in April of 2026. As a result we have started the deprecation process of Node20 for GitHub Actions. We plan to migrate all actions to run on Node24 in the fall of 2025.

The newest GitHub runner ( [v2.328.0](https://github.com/actions/runner/releases/tag/v2.328.0)) now supports both Node20 and Node24 and uses Node20 as the default version. If you’d like to test Node24 ahead of time, set `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` as an `env` in your workflow or as an environment variable on your runner machine to force the use of Node24.

Beginning on June 16th, 2026, runners will begin using Node24 by default. To opt out of this and continue using Node20 after this date, set `ACTIONS_ALLOW_USE_UNSECURE_NODE_VERSION=true` as an `env` in your workflow or as an environment variable on your runner machine. This will only work until we upgrade the runner and remove Node20 on September 23rd, 2026.

### [Removal of operating system support with Node24](https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/\#removal-of-operating-system-support-with-node24)

Node24 is incompatible with macOS 13.4 and lower versions.

Node 24 does not have official support for ARM32, so self-hosted runners on ARM32 will no longer be supported after Node 20 deprecation.

To find out more about the OS versions we support and self-hosted runner architectures, please read our documentation.

### [What you need to do](https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/\#what-you-need-to-do)

For Actions maintainers: Update your actions to run on Node24 instead of Node20 ( [Actions configuration settings](https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions#runs-for-javascript-actions))

For Actions users: Update your workflows with latest versions of the actions that run on Node24 ( [Using versions for Actions](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#example-using-versioned-actions))

Join the discussion within [GitHub Community](https://github.com/orgs/community/discussions/categories/announcements).

## Related Posts

### Sep.25Improvement

[Changes to query results in the GitHub Actions API and UI](https://github.blog/changelog/2026-09-25-changes-to-query-results-in-the-github-actions-api-and-ui)

[actions](https://github.blog/changelog/2026/?label=actions)

### Sep.24Improvement

[Expired GitHub Actions artifacts no longer shown in UI and API](https://github.blog/changelog/2026-09-24-expired-github-actions-artifacts-no-longer-shown-in-ui-and-api)

[actions](https://github.blog/changelog/2026/?label=actions)

### Sep.23Retired

[Node 20 is no longer available in GitHub Actions](https://github.blog/changelog/2026-09-23-node-20-is-no-longer-available-in-github-actions)

[actions](https://github.blog/changelog/2026/?label=actions)

### Sep.17Improvement

[Ubuntu 26 generally available and latest migration](https://github.blog/changelog/2026-09-17-ubuntu-26-generally-available-and-latest-migration)

[actions](https://github.blog/changelog/2026/?label=actions)

### Sep.17Release

[Workflow execution protections in GitHub Actions generally available](https://github.blog/changelog/2026-09-17-workflow-execution-protections-in-github-actions-generally-available)

[actions](https://github.blog/changelog/2026/?label=actions) [supply chain security](https://github.blog/changelog/2026/?label=supply-chain-security)...
+1

### Sep.10Improvement

[Control GitHub Actions cache access with cache-mode](https://github.blog/changelog/2026-09-10-control-github-actions-cache-access-with-cache-mode)

[actions](https://github.blog/changelog/2026/?label=actions) [application security](https://github.blog/changelog/2026/?label=application-security) [supply chain security](https://github.blog/changelog/2026/?label=supply-chain-security)...
+2

### Sep.10Improvement

[Xcode 27 runner image now runs on macOS 27](https://github.blog/changelog/2026-09-10-xcode-27-runner-image-now-runs-on-macos-27)

[actions](https://github.blog/changelog/2026/?label=actions)

### Sep.03Improvement

[GitHub Actions: Early September 2026 updates](https://github.blog/changelog/2026-09-03-github-actions-early-september-2026-updates)

[actions](https://github.blog/changelog/2026/?label=actions)

### Aug.27Retired

[Actions retention will cover checks, workflow runs, and statuses](https://github.blog/changelog/2026-08-27-actions-retention-will-cover-checks-workflow-runs-and-statuses)

[actions](https://github.blog/changelog/2026/?label=actions)

## Subscribe to our developer newsletter

Discover tips, technical guides, and best practices in our biweekly newsletter just for devs.

Enter your email\*
Subscribe

By submitting, I agree to let GitHub and its affiliates use my information for personalized communications, targeted advertising, and campaign effectiveness. See the [GitHub Privacy Statement](https://github.com/site/privacy) for more details.

[Back to top](https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/#start-of-content)

×
