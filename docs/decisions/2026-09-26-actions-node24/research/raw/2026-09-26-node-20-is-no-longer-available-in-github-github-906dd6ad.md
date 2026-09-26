---
url: https://github.blog/changelog/2026-09-23-node-20-is-no-longer-available-in-github-actions
retrieved: 2026-09-26
command: firecrawl scrape https://github.blog/changelog/2026-09-23-node-20-is-no-longer-available-in-github-actions --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Node 20 is no longer available in GitHub Actions - GitHub Changelog
---
[Back to changelog](https://github.blog/changelog/)

This is the final notification that Node 20 is no longer available on GitHub Actions runners. Runners now use Node 24 for JavaScript actions. The temporary `ACTIONS_ALLOW_USE_UNSECURE_NODE_VERSION` opt-out is no longer available.

If you maintain a JavaScript action, update its `runs.using` value to `node24` and publish a new release as soon as possible. For details, see the [metadata syntax for JavaScript actions](https://docs.github.com/actions/creating-actions/metadata-syntax-for-github-actions#runs-for-javascript-actions).

If you use JavaScript actions in your workflows, update to the latest versions of those actions that support Node 24. For details, see [using versions for actions](https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions#example-using-versioned-actions).

The newest versions of all first-party actions were updated to use Node 24 as referenced in our [announcement changelog](https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/).

Node 24 is incompatible with macOS 13.4 and earlier, and it doesn’t officially support ARM32. Self-hosted runners using these operating systems or architectures are no longer supported. This change applies to github.com and GitHub with Data Residency.

## Related Posts

### Sep.25Improvement

[Changes to query results in the GitHub Actions API and UI](https://github.blog/changelog/2026-09-25-changes-to-query-results-in-the-github-actions-api-and-ui)

[actions](https://github.blog/changelog/2026/?label=actions)

### Sep.24Improvement

[Expired GitHub Actions artifacts no longer shown in UI and API](https://github.blog/changelog/2026-09-24-expired-github-actions-artifacts-no-longer-shown-in-ui-and-api)

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

### Aug.20Improvement

[Windows 11 arm64 VS2026 image generally available](https://github.blog/changelog/2026-08-20-windows-11-arm64-vs2026-image-generally-available)

[actions](https://github.blog/changelog/2026/?label=actions)

## Subscribe to our developer newsletter

Discover tips, technical guides, and best practices in our biweekly newsletter just for devs.

Enter your email\*
Subscribe

By submitting, I agree to let GitHub and its affiliates use my information for personalized communications, targeted advertising, and campaign effectiveness. See the [GitHub Privacy Statement](https://github.com/site/privacy) for more details.

[Back to top](https://github.blog/changelog/2026-09-23-node-20-is-no-longer-available-in-github-actions/#start-of-content)

×
