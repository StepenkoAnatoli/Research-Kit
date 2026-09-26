---
url: https://github.blog/changelog/2026-09-24-expired-github-actions-artifacts-no-longer-shown-in-ui-and-api
retrieved: 2026-09-26
command: firecrawl scrape https://github.blog/changelog/2026-09-24-expired-github-actions-artifacts-no-longer-shown-in-ui-and-api --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Expired GitHub Actions artifacts no longer shown in UI and API - GitHub Changelog
---
[Back to changelog](https://github.blog/changelog/)

Expired artifacts are no longer displayed in the GitHub Actions run summary or returned by the REST API. Previously, an expired artifact remained visible with an “Expired” pill, even though the underlying files had already been deleted from storage.

That leftover pill left some users unsure whether they were still being billed for storing artifacts that no longer existed. To remove that ambiguity, expired artifacts will not be shown when viewing run data, including:

- The list of artifacts on a workflow run summary page.
- The [list artifacts for a repository](https://docs.github.com/rest/actions/artifacts#list-artifacts-for-a-repository) and [get an artifact](https://docs.github.com/rest/actions/artifacts#get-an-artifact) REST API endpoints.

If you need to know which artifacts a workflow run produced after they’ve expired, you can still find that information in the run’s logs. This change doesn’t affect artifact retention settings or billing—it only changes how expired artifacts are displayed.

## Related Posts

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

### Aug.20Improvement

[Windows 11 arm64 VS2026 image generally available](https://github.blog/changelog/2026-08-20-windows-11-arm64-vs2026-image-generally-available)

[actions](https://github.blog/changelog/2026/?label=actions)

### Aug.20Improvement

[Separate GitHub Actions path for GitHub Code Quality](https://github.blog/changelog/2026-08-20-separate-github-actions-path-for-github-code-quality)

[actions](https://github.blog/changelog/2026/?label=actions) [application security](https://github.blog/changelog/2026/?label=application-security)...
+1

## Subscribe to our developer newsletter

Discover tips, technical guides, and best practices in our biweekly newsletter just for devs.

Enter your email\*
Subscribe

By submitting, I agree to let GitHub and its affiliates use my information for personalized communications, targeted advertising, and campaign effectiveness. See the [GitHub Privacy Statement](https://github.com/site/privacy) for more details.

[Back to top](https://github.blog/changelog/2026-09-24-expired-github-actions-artifacts-no-longer-shown-in-ui-and-api/#start-of-content)

×
