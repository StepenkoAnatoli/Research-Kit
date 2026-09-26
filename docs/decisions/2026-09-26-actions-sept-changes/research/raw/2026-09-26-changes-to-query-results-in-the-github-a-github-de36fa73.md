---
url: https://github.blog/changelog/2026-09-25-changes-to-query-results-in-the-github-actions-api-and-ui
retrieved: 2026-09-26
command: firecrawl scrape https://github.blog/changelog/2026-09-25-changes-to-query-results-in-the-github-actions-api-and-ui --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Changes to query results in the GitHub Actions API and UI - GitHub Changelog
---
[Back to changelog](https://github.blog/changelog/)

Queries for workflow runs in the [GitHub Actions API](https://docs.github.com/rest/actions/workflow-runs#list-workflow-runs-for-a-repository) and UI now return a less precise but more accurate count of records when you search by workflow, event, status, branch, or actor. We will continue to return paginated results of up to 1,000 items. However, if the number of found records exceeds 2,500, we will report “2,500+” instead of attempting to return the exact number of records. This is because queries that retrieve more than 2,500 records frequently timeout and return the number of records found before the timeout rather than the true count. By implementing this limit, our counts will be more accurate and we will improve performance for customers.

If your integrations or scripts rely on retrieving more than 2,500 matching workflow runs from a single query, narrow your filters (e.g., by adding a date range) to retrieve the specific runs you need. This change is rolling out now on github.com and GitHub Enterprise Cloud.

## Related Posts

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

### Aug.20Improvement

[Windows 11 arm64 VS2026 image generally available](https://github.blog/changelog/2026-08-20-windows-11-arm64-vs2026-image-generally-available)

[actions](https://github.blog/changelog/2026/?label=actions)

## Subscribe to our developer newsletter

Discover tips, technical guides, and best practices in our biweekly newsletter just for devs.

Enter your email\*
Subscribe

By submitting, I agree to let GitHub and its affiliates use my information for personalized communications, targeted advertising, and campaign effectiveness. See the [GitHub Privacy Statement](https://github.com/site/privacy) for more details.

[Back to top](https://github.blog/changelog/2026-09-25-changes-to-query-results-in-the-github-actions-api-and-ui/#start-of-content)

×
