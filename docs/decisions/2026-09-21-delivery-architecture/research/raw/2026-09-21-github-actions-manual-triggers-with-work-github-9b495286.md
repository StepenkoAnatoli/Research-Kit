---
url: https://github.blog/changelog/2020-07-06-github-actions-manual-triggers-with-workflow_dispatch/
retrieved: 2026-09-21
command: firecrawl scrape https://github.blog/changelog/2020-07-06-github-actions-manual-triggers-with-workflow_dispatch/ --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: GitHub Actions: Manual triggers with workflow_dispatch - GitHub Changelog
---
[Back to changelog](https://github.blog/changelog/)

![Run workflow button for workflow with workflow_dispatch](https://i0.wp.com/user-images.githubusercontent.com/1865328/86147571-2de93700-babf-11ea-8a08-e4beffd3abe9.png?ssl=1)

You can now create workflows that are manually triggered with the new `workflow_dispatch` event.

You will then see a ‘Run workflow’ button on the Actions tab, enabling you to easily trigger a run.

You can choose which branch the workflow is run on.

In addition, you can optionally specify `inputs`, which GitHub will present as form elements in the UI. Workflow dispatch inputs are specified with the same format as [action inputs](https://help.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions#inputs).

For example:

```yaml
on:
  workflow_dispatch:
    inputs:
      logLevel:
        description: 'Log level'
        required: true
        default: 'warning'
      tags:
        description: 'Test scenario tags'
```

The triggered workflow receives the inputs in the [`github.event`](https://help.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#github-context) context.

For example:

```bash
jobs:
  printInputs:
    runs-on: ubuntu-latest
    steps:
    - run: |
        echo "Log level: ${{ github.event.inputs.logLevel }}"
        echo "Tags: ${{ github.event.inputs.tags }}"
```

If you have any questions or thoughts about these changes, we recommend asking in our GitHub Community Forum’s [Actions Board](https://github.community/c/github-actions)!

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

### Jul.30Release

[Reference same-repository actions with self-repository syntax](https://github.blog/changelog/2026-07-30-reference-same-repository-actions-with-self-repository-syntax)

[actions](https://github.blog/changelog/2026/?label=actions)

## Subscribe to our developer newsletter

Discover tips, technical guides, and best practices in our biweekly newsletter just for devs.

Enter your email\*
Subscribe

By submitting, I agree to let GitHub and its affiliates use my information for personalized communications, targeted advertising, and campaign effectiveness. See the [GitHub Privacy Statement](https://github.com/site/privacy) for more details.

[Back to top](https://github.blog/changelog/2020-07-06-github-actions-manual-triggers-with-workflow_dispatch/#start-of-content)

×
