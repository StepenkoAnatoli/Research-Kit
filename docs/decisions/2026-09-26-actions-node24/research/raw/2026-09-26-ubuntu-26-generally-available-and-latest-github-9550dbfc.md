---
url: https://github.blog/changelog/2026-09-17-ubuntu-26-generally-available-and-latest-migration
retrieved: 2026-09-26
command: firecrawl scrape https://github.blog/changelog/2026-09-17-ubuntu-26-generally-available-and-latest-migration --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Ubuntu 26 generally available and latest migration - GitHub Changelog
---
[Back to changelog](https://github.blog/changelog/)

The Ubuntu 26.04 runner image for GitHub Actions is now out of public preview and fully supported for production workflows on both x64 and arm64. As part of this release, the `ubuntu-latest` label will migrate to Ubuntu 26.04, giving you the latest supported Ubuntu release by default.

## [Using Ubuntu 26.04](https://github.blog/changelog/2026-09-17-ubuntu-26-generally-available-and-latest-migration/\#using-ubuntu-26-04)

To run your workflows on the new image, set `runs-on: ubuntu-26.04` or `runs-on: ubuntu-26.04-arm` in your workflow file. Ubuntu 26.04 includes updated, and in some cases removed, tools and tool versions compared to earlier images. These changes can break workflows that depend on specific software versions or preinstalled packages. Review the [full list of changes](https://github.com/actions/runner-images/issues/14747) and test your workflows against Ubuntu 26 before the migration begins.

## [`ubuntu-latest` is migrating to Ubuntu 26.04](https://github.blog/changelog/2026-09-17-ubuntu-26-generally-available-and-latest-migration/\#ubuntu-latest-is-migrating-to-ubuntu-26-04)

The `ubuntu-latest` label will migrate from Ubuntu 24.04 to Ubuntu 26.04. This migration will roll out gradually between October 19 and November 19, 2026. During this window, workflows that use `ubuntu-latest` will automatically move to Ubuntu 26.04.

Because this moves your workflows to a new operating system version, the migration **may break builds** that rely on tools, packages, or versions that changed between Ubuntu 24.04 and 26.04. To prepare:

- Test your workflows against `ubuntu-26.04` before the migration begins.
- If you are not ready to move, pin your workflows to `ubuntu-24.04` to stay on the current image.

## [Learn more](https://github.blog/changelog/2026-09-17-ubuntu-26-generally-available-and-latest-migration/\#learn-more)

To learn more about available images, see the [GitHub-hosted runners documentation](https://docs.github.com/actions/reference/runners/github-hosted-runners). To see the included software list or report issues with the image, head to the [runner-images repository](https://github.com/actions/runner-images).

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

[Back to top](https://github.blog/changelog/2026-09-17-ubuntu-26-generally-available-and-latest-migration/#start-of-content)

×
