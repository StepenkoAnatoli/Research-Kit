---
url: https://github.blog/changelog/2026-03-12-rest-api-version-2026-03-10-is-now-available/
retrieved: 2026-09-21
command: firecrawl scrape https://github.blog/changelog/2026-03-12-rest-api-version-2026-03-10-is-now-available/ --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: REST API version 2026-03-10 is now available - GitHub Changelog
---
[Back to changelog](https://github.blog/changelog/)

Previously, we [introduced calendar-based versioning](https://github.blog/developer-skills/github/to-infinity-and-beyond-enabling-the-future-of-githubs-rest-api-with-api-versioning/) for our REST API, giving us a path to evolving our API while giving integrators plenty of time and clear guidance for upgrading.

Now, we’re releasing calendar version **`2026-03-10`**, the newest version of the GitHub REST API. This is the **first calendar version to include breaking changes**.

## [What’s in this release](https://github.blog/changelog/2026-03-12-rest-api-version-2026-03-10-is-now-available/\#whats-in-this-release)

Version `2026-03-10` introduces a set of breaking changes to the REST API. You can find the full list of changes, along with [upgrade guidance](https://docs.github.com/rest/about-the-rest-api/breaking-changes#upgrading-to-a-new-api-version), in our [breaking changes documentation](https://docs.github.com/rest/about-the-rest-api/breaking-changes?apiVersion=2026-03-10).

As a reminder, non-breaking changes (e.g., new endpoints, optional parameters, additional response fields) continue to be available across all supported API versions.

## [What this means for existing integrations](https://github.blog/changelog/2026-03-12-rest-api-version-2026-03-10-is-now-available/\#what-this-means-for-existing-integrations)

Version `2022-11-28` will continue to be fully supported for at least 24 months from today, and requests that don’t include the `X-GitHub-Api-Version` header will continue to default to `2022-11-28`.

When you’re ready to upgrade, it’s straightforward. After reviewing the new version documentation and making any necessary changes to your integration to account for breaking changes, update the `X-GitHub-Api-Version` header to `2026-03-10` and verify that your integration works as expected with the new API version.

Use the version picker in our [API documentation](https://docs.github.com/rest) to view the docs for all available versions.

## [What’s next](https://github.blog/changelog/2026-03-12-rest-api-version-2026-03-10-is-now-available/\#whats-next)

We’ll continue to communicate future API version releases through the GitHub changelog.

We’d love for integrators to adopt `2026-03-10` to take advantage of the latest enhancements and features. While there’s no pressure to upgrade immediately, moving to the new version will help ensure your integration remains compatible and benefits from ongoing improvements as we continue to release new versions over time.

## Related Posts

### Sep.15Retired

[SHA-1 in HTTPS on GitHub sunset](https://github.blog/changelog/2026-09-15-sha-1-in-https-on-github-sunset)

[ecosystem & accessibility](https://github.blog/changelog/2026/?label=ecosystem-and-accessibility)

### Aug.26Release

[GitHub Apps can now access enterprise billing data](https://github.blog/changelog/2026-08-26-github-apps-can-now-access-enterprise-billing-data)

[account management](https://github.blog/changelog/2026/?label=account-management) [ecosystem & accessibility](https://github.blog/changelog/2026/?label=ecosystem-and-accessibility) [enterprise management tools](https://github.blog/changelog/2026/?label=enterprise-management-tools)...
+2

### Aug.07Improvement

[Enterprises can now install third-party GitHub Apps](https://github.blog/changelog/2026-08-07-enterprises-can-now-install-third-party-github-apps)

[ecosystem & accessibility](https://github.blog/changelog/2026/?label=ecosystem-and-accessibility) [enterprise management tools](https://github.blog/changelog/2026/?label=enterprise-management-tools)...
+1

### Aug.04Retired

[Upcoming deprecation of GitHub Spark on github.com](https://github.blog/changelog/2026-08-04-upcoming-deprecation-of-github-spark-on-github-com)

[copilot](https://github.blog/changelog/2026/?label=copilot) [ecosystem & accessibility](https://github.blog/changelog/2026/?label=ecosystem-and-accessibility)...
+1

### Jul.30Retired

[GitHub Models is now retired](https://github.blog/changelog/2026-07-30-github-models-is-now-retired)

[ecosystem & accessibility](https://github.blog/changelog/2026/?label=ecosystem-and-accessibility)

### Jul.01Retired

[GitHub Models is being fully retired on July 30, 2026](https://github.blog/changelog/2026-07-01-github-models-is-being-fully-retired-on-july-30-2026)

[ecosystem & accessibility](https://github.blog/changelog/2026/?label=ecosystem-and-accessibility)

### Jun.16Retired

[GitHub Models is no longer available to new customers](https://github.blog/changelog/2026-06-16-github-models-is-no-longer-available-to-new-customers)

[ecosystem & accessibility](https://github.blog/changelog/2026/?label=ecosystem-and-accessibility)

### May.15Improvement

[GitHub App installation tokens: Per-request override header](https://github.blog/changelog/2026-05-15-github-app-installation-tokens-per-request-override-header)

[ecosystem & accessibility](https://github.blog/changelog/2026/?label=ecosystem-and-accessibility)

### May.13Improvement

[New enterprise installation API now in public preview](https://github.blog/changelog/2026-05-13-new-enterprise-installation-api-now-in-public-preview)

[ecosystem & accessibility](https://github.blog/changelog/2026/?label=ecosystem-and-accessibility)

## Subscribe to our developer newsletter

Discover tips, technical guides, and best practices in our biweekly newsletter just for devs.

Enter your email\*
Subscribe

By submitting, I agree to let GitHub and its affiliates use my information for personalized communications, targeted advertising, and campaign effectiveness. See the [GitHub Privacy Statement](https://github.com/site/privacy) for more details.

[Back to top](https://github.blog/changelog/2026-03-12-rest-api-version-2026-03-10-is-now-available/#start-of-content)

×
