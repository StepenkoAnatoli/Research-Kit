---
url: https://github.blog/changelog/2026-02-19-workflow-dispatch-api-now-returns-run-ids/
retrieved: 2026-09-21
command: firecrawl scrape https://github.blog/changelog/2026-02-19-workflow-dispatch-api-now-returns-run-ids/ --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Workflow dispatch API now returns run IDs - GitHub Changelog
---
[Back to changelog](https://github.blog/changelog/)

When you trigger a workflow using the [GitHub Actions workflow dispatch API endpoint](https://docs.github.com/rest/actions/workflows#create-a-workflow-dispatch-event), you’ll now have the option to receive metadata in the response that helps you map your request to the corresponding workflow run. Previously, this endpoint returned only a `204 No Content` status code. Now, you can pass in a new optional boolean parameter, `return_run_details`, which will return a `200 OK` response containing the workflow ID, API URL, and workflow URL. If you do not pass in this parameter, it will continue to return the current `204 No Content` status code.

This capability is also supported within the GitHub CLI, as of [`v2.87.0`](https://github.com/cli/cli/releases/tag/v2.87.0). If you trigger a workflow dispatch via `gh workflow run`, GitHub CLI will now return the URL for the created run along with the `gh run view` command for viewing that run.

With this update, developers can easily identify which workflow runs originated from their API calls—no more extensive polling or building custom tracking solutions. This new parameter is currently available in the API, and the newest version of the GitHub CLI will also default `return_run_details` to `true`.

Learn more about the workflow dispatch API in the [GitHub Actions documentation](https://docs.github.com/actions/using-workflows/events-that-trigger-workflows#workflow_dispatch).

## Related Posts

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

### Sep.09Improvement

[Enterprise managed permissions for GitHub Copilot agent operations](https://github.blog/changelog/2026-09-09-enterprise-managed-permissions-for-github-copilot-agent-operations)

[client apps](https://github.blog/changelog/2026/?label=client-apps) [copilot](https://github.blog/changelog/2026/?label=copilot) [enterprise management tools](https://github.blog/changelog/2026/?label=enterprise-management-tools)...
+2

### Sep.03Improvement

[GitHub Actions: Early September 2026 updates](https://github.blog/changelog/2026-09-03-github-actions-early-september-2026-updates)

[actions](https://github.blog/changelog/2026/?label=actions)

### Sep.03Retired

[GitHub CLI Linux package signing key expires September 5](https://github.blog/changelog/2026-09-03-github-cli-linux-package-signing-key-expires-september-5)

[client apps](https://github.blog/changelog/2026/?label=client-apps)

### Sep.02Improvement

[Enterprise-managed settings support any default model](https://github.blog/changelog/2026-09-02-enterprise-managed-settings-support-any-default-model)

[client apps](https://github.blog/changelog/2026/?label=client-apps) [copilot](https://github.blog/changelog/2026/?label=copilot) [enterprise management tools](https://github.blog/changelog/2026/?label=enterprise-management-tools)...
+2

### Sep.01Release

[GitHub CLI: Media in issues, pull requests, and comments](https://github.blog/changelog/2026-09-01-github-cli-media-in-issues-pull-requests-and-comments)

[client apps](https://github.blog/changelog/2026/?label=client-apps)

## Subscribe to our developer newsletter

Discover tips, technical guides, and best practices in our biweekly newsletter just for devs.

Enter your email\*
Subscribe

By submitting, I agree to let GitHub and its affiliates use my information for personalized communications, targeted advertising, and campaign effectiveness. See the [GitHub Privacy Statement](https://github.com/site/privacy) for more details.

[Back to top](https://github.blog/changelog/2026-02-19-workflow-dispatch-api-now-returns-run-ids/#start-of-content)

×
