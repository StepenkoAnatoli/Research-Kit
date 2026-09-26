---
url: https://github.blog/changelog/2026-09-10-control-github-actions-cache-access-with-cache-mode
retrieved: 2026-09-26
command: firecrawl scrape https://github.blog/changelog/2026-09-10-control-github-actions-cache-access-with-cache-mode --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Control GitHub Actions cache access with cache-mode - GitHub Changelog
---
[Back to changelog](https://github.blog/changelog/)

You can now use `cache-mode` to apply least-privilege access to the GitHub Actions cache at the workflow or job level. By granting each workflow or job only the cache access it needs, you can prevent unnecessary restores or saves and help protect trusted workflows from cache poisoning. This capability is now generally available on all plans.

Choose the access each workflow or job needs:

- `read` allows cache restores but prevents cache saves. This is the default for low-trust events such as `pull_request_target`.
- `write` allows cache restores and saves. This is the default for trusted events such as `push`.
- `write-only` allows cache saves but prevents cache restores.
- `none` prevents all cache access.

Job-level settings override workflow-level settings. The selected mode is enforced by the cache service and carries through reusable workflows, where a called workflow cannot receive more cache access than its caller granted.

An explicitly declared `cache-mode` also overrides the read-only cache default for low-trust events such as `pull_request_target`. Declaring `write` or `write-only` for these events can increase the risk of cache poisoning, so GitHub Actions adds a warning annotation when the declared mode grants write access. Workflows that do not set `cache-mode` continue to use the existing secure defaults.

Cache mode is generally available on github.com for all GitHub plans. For configuration details, see the [`cache-mode` workflow syntax documentation](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#cache-mode).

Join the discussion within [GitHub Community](https://github.com/orgs/community/discussions/194493)

## Related Posts

### Sep.25Improvement

[Changes to query results in the GitHub Actions API and UI](https://github.blog/changelog/2026-09-25-changes-to-query-results-in-the-github-actions-api-and-ui)

[actions](https://github.blog/changelog/2026/?label=actions)

### Sep.25Improvement

[Agentic autofix now uses Copilot Memory](https://github.blog/changelog/2026-09-25-agentic-autofix-now-uses-copilot-memory)

[application security](https://github.blog/changelog/2026/?label=application-security) [copilot](https://github.blog/changelog/2026/?label=copilot)...
+1

### Sep.25Improvement

[CodeQL 2.27.1 adds C and C++ query and Kotlin 2.4.20 support](https://github.blog/changelog/2026-09-25-codeql-2-27-1-adds-c-and-c-query-and-kotlin-2-4-20-support)

[application security](https://github.blog/changelog/2026/?label=application-security)

### Sep.24Release

[Require proof of presence for high-impact actions](https://github.blog/changelog/2026-09-24-require-proof-of-presence-for-high-impact-actions)

[account management](https://github.blog/changelog/2026/?label=account-management) [application security](https://github.blog/changelog/2026/?label=application-security) [enterprise management tools](https://github.blog/changelog/2026/?label=enterprise-management-tools)...
+2

### Sep.24Improvement

[Expired GitHub Actions artifacts no longer shown in UI and API](https://github.blog/changelog/2026-09-24-expired-github-actions-artifacts-no-longer-shown-in-ui-and-api)

[actions](https://github.blog/changelog/2026/?label=actions)

### Sep.23Retired

[Node 20 is no longer available in GitHub Actions](https://github.blog/changelog/2026-09-23-node-20-is-no-longer-available-in-github-actions)

[actions](https://github.blog/changelog/2026/?label=actions)

### Sep.22Retired

[Security improvements for SSH](https://github.blog/changelog/2026-09-22-security-improvements-for-ssh)

[account management](https://github.blog/changelog/2026/?label=account-management) [application security](https://github.blog/changelog/2026/?label=application-security)...
+1

### Sep.22Retired

[Deprecation notice: All-platform CodeQL bundle](https://github.blog/changelog/2026-09-22-deprecation-notice-all-platform-codeql-bundle)

[application security](https://github.blog/changelog/2026/?label=application-security)

### Sep.21Release

[GitHub Enterprise adds credential inventory exports](https://github.blog/changelog/2026-09-21-github-enterprise-adds-credential-inventory-exports)

[application security](https://github.blog/changelog/2026/?label=application-security) [enterprise management tools](https://github.blog/changelog/2026/?label=enterprise-management-tools)...
+1

## Subscribe to our developer newsletter

Discover tips, technical guides, and best practices in our biweekly newsletter just for devs.

Enter your email\*
Subscribe

By submitting, I agree to let GitHub and its affiliates use my information for personalized communications, targeted advertising, and campaign effectiveness. See the [GitHub Privacy Statement](https://github.com/site/privacy) for more details.

[Back to top](https://github.blog/changelog/2026-09-10-control-github-actions-cache-access-with-cache-mode/#start-of-content)

×
