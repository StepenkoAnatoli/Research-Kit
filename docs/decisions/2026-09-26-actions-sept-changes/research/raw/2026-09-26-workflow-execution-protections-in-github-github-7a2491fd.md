---
url: https://github.blog/changelog/2026-09-17-workflow-execution-protections-in-github-actions-generally-available
retrieved: 2026-09-26
command: firecrawl scrape https://github.blog/changelog/2026-09-17-workflow-execution-protections-in-github-actions-generally-available --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Workflow execution protections in GitHub Actions generally available - GitHub Changelog
---
[Back to changelog](https://github.blog/changelog/)

Workflow execution protections for GitHub Actions, previously in public preview, are now generally available for GitHub Enterprise, organizations, and repositories.

Execution protections let you define an allowlist that controls who can trigger an Actions workflow and what events can start it. Actor rules cover the who, event rules cover the what, and actions evaluate both before a run.

## [What’s new](https://github.blog/changelog/2026-09-17-workflow-execution-protections-in-github-actions-generally-available/\#whats-new)

Alongside the actor and event rules you’ve used in public preview, general availability adds:

- **Workflow file targeting:** Scope execution protection rules to specific workflow files rather than an entire repository, so a single repository can apply different policies to different workflows. For example, restrict `deploy.yml` to a designated team while leaving CI workflows open to all contributors.
- **Insights:** See how actions evaluate and enforce your rules across your enterprise, organization, and repositories. This enables you to audit policy impact and tune rules both before and after you enforce them.
- **REST API:** Manage execution protections programmatically at the enterprise, organization, and repository level. Create, read, update, and delete rules — including workflow path conditions — so you can manage Actions policy as code, keep rules consistent across hundreds of repositories, and wire enforcement into your existing governance tooling instead of clicking through settings.

Evaluate mode also carries over from the preview, so you can run rules in shadow mode and see which workflow runs would be blocked before you enforce them.

## [New secure defaults](https://github.blog/changelog/2026-09-17-workflow-execution-protections-in-github-actions-generally-available/\#new-secure-defaults)

Vulnerabilities in `pull_request_target` workflows, such as [Pwn Requests](https://securitylab.github.com/resources/github-actions-preventing-pwn-requests/), are one of the most commonly exploited vulnerabilities in action workflows. `pull_request_target` runs with access to your secrets in the context of the base repository, so if code is executed from a fork, that untrusted code could poison your pipeline and exfiltrate secrets. We’re rolling out a default protection rule to limit the execution of `pull_request_target` events.

For public repositories that do not already have an applicable event policy, GitHub is introducing a default rule that disables `pull_request_target`. This default does not apply to private or internal repositories. It initially runs in evaluate mode, so you can see which workflow runs would be affected before enforcement begins.

On November 2, 2026, we’ll automatically enforce the default rule for affected repositories that were using the default `pull_request_target` policy before general availability.

To prepare for the roll out of this rule, you can view the results of the evaluate rule using Insights and see which workflow runs will fail once enforcement begins.

From there you have two options: leave the rule in place to block `pull_request_target`, or explicitly allow `pull_request_target` in an applicable Actions event policy if your workflows still depend on the trigger. Specific workflows can be allow-listed using the new workflow file targeting.

To get started, see [About Actions policies](https://docs.github.com/actions/concepts/about-actions-policies), [Control workflow execution](https://docs.github.com/actions/how-tos/administer/control-workflow-execution), and the [Actions policies REST API reference](https://docs.github.com/rest/actions/policies).

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

### Sep.18Improvement

[Stage-only npm tokens for safer automation](https://github.blog/changelog/2026-09-18-stage-only-npm-tokens-for-safer-automation)

[supply chain security](https://github.blog/changelog/2026/?label=supply-chain-security)

### Sep.17Improvement

[Ubuntu 26 generally available and latest migration](https://github.blog/changelog/2026-09-17-ubuntu-26-generally-available-and-latest-migration)

[actions](https://github.blog/changelog/2026/?label=actions)

### Sep.10Improvement

[Control GitHub Actions cache access with cache-mode](https://github.blog/changelog/2026-09-10-control-github-actions-cache-access-with-cache-mode)

[actions](https://github.blog/changelog/2026/?label=actions) [application security](https://github.blog/changelog/2026/?label=application-security) [supply chain security](https://github.blog/changelog/2026/?label=supply-chain-security)...
+2

### Sep.10Improvement

[Xcode 27 runner image now runs on macOS 27](https://github.blog/changelog/2026-09-10-xcode-27-runner-image-now-runs-on-macos-27)

[actions](https://github.blog/changelog/2026/?label=actions)

### Sep.09Improvement

[npm extends recovery-code security holds to all accounts](https://github.blog/changelog/2026-09-09-npm-extends-recovery-code-security-holds-to-all-accounts)

[supply chain security](https://github.blog/changelog/2026/?label=supply-chain-security)

### Sep.08Improvement

[Automatic Dependabot access to GitHub-hosted registries](https://github.blog/changelog/2026-09-08-automatic-dependabot-access-to-github-hosted-registries)

[supply chain security](https://github.blog/changelog/2026/?label=supply-chain-security)

## Subscribe to our developer newsletter

Discover tips, technical guides, and best practices in our biweekly newsletter just for devs.

Enter your email\*
Subscribe

By submitting, I agree to let GitHub and its affiliates use my information for personalized communications, targeted advertising, and campaign effectiveness. See the [GitHub Privacy Statement](https://github.com/site/privacy) for more details.

[Back to top](https://github.blog/changelog/2026-09-17-workflow-execution-protections-in-github-actions-generally-available/#start-of-content)

×
