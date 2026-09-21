---
url: https://docs.github.com/en/actions/how-tos/write-workflows/choose-where-workflows-run/choose-the-runner-for-a-job
retrieved: 2026-09-21
command: firecrawl scrape https://docs.github.com/en/actions/how-tos/write-workflows/choose-where-workflows-run/choose-the-runner-for-a-job --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Choosing the runner for a job - GitHub Docs
---
[Skip to main content](https://docs.github.com/en/actions/how-tos/write-workflows/choose-where-workflows-run/choose-the-runner-for-a-job#main-content)

[Skip to content](https://docs.github.com/en/actions/how-tos/write-workflows/choose-where-workflows-run/choose-the-runner-for-a-job#main-content)

Collapse sidebarExpand sidebar

Scroll breadcrumbs left

Scroll breadcrumbs right

In this articleChoosing runners in a group

# Choosing the runner for a job

Define the type of machine that will process a job in your workflow.

Copy markdown

## In this article

## [Overview](https://docs.github.com/en/actions/how-tos/write-workflows/choose-where-workflows-run/choose-the-runner-for-a-job\#overview)

Use `jobs.<job_id>.runs-on` to define the type of machine to run the job on.

- The destination machine can be either a [GitHub-hosted runner](https://docs.github.com/en/actions/how-tos/write-workflows/choose-where-workflows-run/choose-the-runner-for-a-job#choosing-github-hosted-runners), [larger runner](https://docs.github.com/en/actions/how-tos/write-workflows/choose-where-workflows-run/choose-the-runner-for-a-job#choosing-runners-in-a-group), or a [self-hosted runner](https://docs.github.com/en/actions/how-tos/write-workflows/choose-where-workflows-run/choose-the-runner-for-a-job#choosing-self-hosted-runners).

- You can target runners based on the labels assigned to them, or their group membership, or a combination of these.

- You can provide `runs-on` as:
  - A single string
  - A single variable containing a string
  - An array of strings, variables containing strings, or a combination of both
  - A `key: value` pair using the `group` or `labels` keys
- If you specify an array of strings or variables, your workflow will execute on any runner that matches all of the specified `runs-on` values. For example, here the job will only run on a self-hosted runner that has the labels `linux`, `x64`, and `gpu`:


```yaml
runs-on: [self-hosted, linux, x64, gpu]
```


For more information, see [Choosing self-hosted runners](https://docs.github.com/en/actions/how-tos/write-workflows/choose-where-workflows-run/choose-the-runner-for-a-job#choosing-self-hosted-runners).

- You can mix strings and variables in an array. For example:


```yaml
on:
    workflow_dispatch:
      inputs:
        chosen-os:
          required: true
          type: choice
          options:
        - Ubuntu
        - macOS

jobs:
test:
    runs-on: [self-hosted, "${{ inputs.chosen-os }}"]
    steps:
    - run: echo Hello world!
```

- If you would like to run your workflow on multiple machines, use [`jobs.<job_id>.strategy`](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idstrategy).


Note

Quotation marks are not required around simple strings like `self-hosted`, but they are required for expressions like `"${{ inputs.chosen-os }}"`.

## [Choosing GitHub-hosted runners](https://docs.github.com/en/actions/how-tos/write-workflows/choose-where-workflows-run/choose-the-runner-for-a-job\#choosing-github-hosted-runners)

If you use a GitHub-hosted runner, each job runs in a fresh instance of a runner image specified by `runs-on`.

The value for runs-on, when you are using a GitHub-hosted runner, is a workflow label or the name of a runner group. The labels for the standard GitHub-hosted runners are shown in the following tables.

For more information, see [GitHub-hosted runners](https://docs.github.com/en/actions/concepts/runners/github-hosted-runners).

### [Standard GitHub-hosted runners for public repositories](https://docs.github.com/en/actions/how-tos/write-workflows/choose-where-workflows-run/choose-the-runner-for-a-job\#standard-github-hosted-runners-for-public-repositories)

For public repositories, jobs using the workflow labels shown in the table below will run with the associated specifications. With the exception of single-CPU runners, each GitHub-hosted runner is a new virtual machine (VM) hosted by GitHub. Single-CPU runners are hosted in a container on a shared VM—see [GitHub-hosted runners reference](https://docs.github.com/en/actions/reference/runners/github-hosted-runners#single-cpu-runners). Use of the standard GitHub-hosted runners is free and unlimited on public repositories.

| **Virtual machine / container** | **Processor (CPU)** | **Memory (RAM)** | **Storage (SSD)** | **Architecture** | **Workflow label** |
| --- | --- | --- | --- | --- | --- |
| Linux | 1 | 5 GB | 14 GB | x64 | `ubuntu-slim` |
| Linux | 4 | 16 GB | 14 GB | x64 | `ubuntu-latest`,<br> `ubuntu-24.04`,<br> `ubuntu-22.04`,<br> `ubuntu-26.04` |
| Windows | 4 | 16 GB | 14 GB | x64 | `windows-latest`,<br> `windows-2025`,<br> `windows-2025-vs2026`,<br> `windows-2022` |
| Linux | 4 | 16 GB | 14 GB | arm64 | `ubuntu-24.04-arm`,<br> `ubuntu-22.04-arm`,<br> `ubuntu-26.04-arm` |
| Windows | 4 | 16 GB | 14 GB | arm64 | `windows-11-arm`,<br> `windows-11-vs2026-arm` |
| macOS | 4 | 14 GB | 14 GB | Intel | `macos-15-intel`,<br> `macos-26-intel` |
| macOS | 3 (M1) | 7 GB | 14 GB | arm64 | `macos-latest`,<br> `macos-14`,<br> `macos-15`,<br> `macos-26`,<br> `xcode-27` (Public preview) |

### [Standard GitHub-hosted runners for private repositories](https://docs.github.com/en/actions/how-tos/write-workflows/choose-where-workflows-run/choose-the-runner-for-a-job\#standard-github-hosted-runners-for--private-repositories)

For private repositories, jobs using the workflow labels shown in the table below will run on virtual machines with the associated specifications. These runners use your GitHub account's allotment of free minutes, and are then charged at the per minute rates. See [Actions runner pricing](https://docs.github.com/en/billing/reference/actions-runner-pricing).

| **Virtual Machine** | **Processor (CPU)** | **Memory (RAM)** | **Storage (SSD)** | **Architecture** | **Workflow label** |
| --- | --- | --- | --- | --- | --- |
| Linux | 1 | 5 GB | 14 GB | x64 | `ubuntu-slim` |
| Linux | 2 | 8 GB | 14 GB | x64 | `ubuntu-latest`,<br> `ubuntu-24.04`,<br> `ubuntu-22.04`,<br> `ubuntu-26.04` |
| Windows | 2 | 8 GB | 14 GB | x64 | `windows-latest`,<br> `windows-2025`,<br> `windows-2022` |
| Linux | 2 | 8 GB | 14 GB | arm64 | `ubuntu-24.04-arm`,<br> `ubuntu-22.04-arm`,<br> `ubuntu-26.04-arm` |
| Windows | 2 | 8 GB | 14 GB | arm64 | `windows-11-arm`,<br> `windows-11-vs2026-arm` |
| macOS | 4 | 14 GB | 14 GB | Intel | `macos-15-intel`,<br> `macos-26-intel` |
| macOS | 3 (M1) | 7 GB | 14 GB | arm64 | `macos-latest`,<br> `macos-14`,<br> `macos-15`,<br> `macos-26`,<br> `xcode-27` (Public preview) |

In addition to the standard GitHub-hosted runners, GitHub offers customers on GitHub Team and GitHub Enterprise Cloud plans a range of managed virtual machines with advanced features - for example, more cores and disk space, GPU-powered machines, and ARM-powered machines. For more information, see [Larger runners](https://docs.github.com/en/actions/concepts/runners/larger-runners).

Note

The `-latest` runner images are the latest stable images that GitHub provides, and might not be the most recent version of the operating system available from the operating system vendor.

Warning

Beta and Deprecated Images are provided "as-is", "with all faults" and "as available" and are excluded from the service level agreement and warranty. Beta Images may not be covered by customer support.

#### [Example: Specifying an operating system](https://docs.github.com/en/actions/how-tos/write-workflows/choose-where-workflows-run/choose-the-runner-for-a-job\#example-specifying-an-operating-system)

```yaml
runs-on: ubuntu-latest
```

For more information, see [GitHub-hosted runners](https://docs.github.com/en/actions/concepts/runners/github-hosted-runners).

## [Choosing self-hosted runners](https://docs.github.com/en/actions/how-tos/write-workflows/choose-where-workflows-run/choose-the-runner-for-a-job\#choosing-self-hosted-runners)

To specify a self-hosted runner for your job, configure `runs-on` in your workflow file with self-hosted runner labels.

Self-hosted runners may have the `self-hosted` label. When setting up a self-hosted runner, by default we will include the label `self-hosted`. You may pass in the `--no-default-labels` flag to prevent the self-hosted label from being applied. Labels can be used to create targeting options for runners, such as operating system or architecture, we recommend providing an array of labels that begins with `self-hosted` (this must be listed first) and then includes additional labels as needed. When you specify an array of labels, jobs will be queued on runners that have all the labels that you specify.

Note

Actions Runner Controller does not support the `self-hosted` label.

#### [Example: Using labels for runner selection](https://docs.github.com/en/actions/how-tos/write-workflows/choose-where-workflows-run/choose-the-runner-for-a-job\#example-using-labels-for-runner-selection)

```yaml
runs-on: [self-hosted, linux]
```

For more information, see [Self-hosted runners](https://docs.github.com/en/actions/concepts/runners/self-hosted-runners) and [Using self-hosted runners in a workflow](https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/use-in-a-workflow).

## [Choosing runners in a group](https://docs.github.com/en/actions/how-tos/write-workflows/choose-where-workflows-run/choose-the-runner-for-a-job\#choosing-runners-in-a-group)

You can use `runs-on` to target runner groups, so that the job will execute on any runner that is a member of that group. For more granular control, you can also combine runner groups with labels.

Runner groups can only have [larger runners](https://docs.github.com/en/actions/concepts/runners/larger-runners) or [self-hosted runners](https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners) as members.

#### [Example: Using groups to control where jobs are run](https://docs.github.com/en/actions/how-tos/write-workflows/choose-where-workflows-run/choose-the-runner-for-a-job\#example-using-groups-to-control-where-jobs-are-run)

In this example, runners have been added to a group called `build-runners`. The `runs-on` key sends the job to any available runner in the `build-runners` group:

```yaml
name: learn-github-actions
on: [push]
jobs:
check-bats-version:
    runs-on:
      group: build-runners
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v7
        with:
          node-version: '14'
      - run: npm install -g bats
      - run: bats -v
```

#### [Example: Combining groups and labels](https://docs.github.com/en/actions/how-tos/write-workflows/choose-where-workflows-run/choose-the-runner-for-a-job\#example-combining-groups-and-labels)

When you combine groups and labels, the runner must meet both requirements to be eligible to run the job.

In this example, the `runs-on` key combines `group` and `labels` so that the job is routed to any available runner within the group that also has a matching label:

```yaml
name: learn-github-actions
on: [push]
jobs:
check-bats-version:
    runs-on:
      group: ubuntu-runners
      labels: ubuntu-24.04-16core
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v7
        with:
          node-version: '14'
      - run: npm install -g bats
      - run: bats -v
```
