---
url: https://docs.github.com/en/rest/actions/workflows
retrieved: 2026-09-21
command: firecrawl scrape https://docs.github.com/en/rest/actions/workflows --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: REST API endpoints for workflows - GitHub Docs
---
[Skip to main content](https://docs.github.com/en/rest/actions/workflows?apiVersion=2026-03-10#main-content)

[Skip to content](https://docs.github.com/en/rest/actions/workflows?apiVersion=2026-03-10#main-content)

Collapse sidebarExpand sidebar

Scroll breadcrumbs left

Scroll breadcrumbs right

In this articleCreate a workflow dispatch event

The REST API is now versioned.For more information, see " [About API versioning](https://docs.github.com/rest/overview/api-versions)."

# REST API endpoints for workflows

Use the REST API to interact with workflows in GitHub Actions.

## [About workflows in GitHub Actions](https://docs.github.com/en/rest/actions/workflows?apiVersion=2026-03-10\#about-workflows-in-github-actions)

You can use the REST API to view workflows for a repository in GitHub Actions. Workflows automate your software development life cycle with a wide range of tools and services. For more information, see [Workflows](https://docs.github.com/en/actions/concepts/workflows-and-actions/workflows) in the GitHub Actions documentation.

## [List repository workflows](https://docs.github.com/en/rest/actions/workflows?apiVersion=2026-03-10\#list-repository-workflows)

Lists the workflows in a repository.

Anyone with read access to the repository can use this endpoint.

OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint with a private repository.

### [Fine-grained access tokens for "List repository workflows"](https://docs.github.com/en/rest/actions/workflows?apiVersion=2026-03-10\#list-repository-workflows--fine-grained-access-tokens)

This endpoint works with the following fine-grained token types:

- [GitHub App user access tokens](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app)
- [GitHub App installation access tokens](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app)
- [Fine-grained personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)

The fine-grained token must have the following permission set:

- "Actions" repository permissions (read)

This endpoint can be used without authentication or the aforementioned permissions if only public resources are requested.

### [Parameters for "List repository workflows"](https://docs.github.com/en/rest/actions/workflows?apiVersion=2026-03-10\#list-repository-workflows--parameters)

| Name, Type, Description |
| --- |
| `accept`string<br>Setting to `application/vnd.github+json` is recommended. |

Headers

| Name, Type, Description |
| --- |
| `owner`stringRequired<br>The account owner of the repository. The name is not case sensitive. |
| `repo`stringRequired<br>The name of the repository without the `.git` extension. The name is not case sensitive. |

Path parameters

| Name, Type, Description |
| --- |
| `per_page`integer<br>The number of results per page (max 100). For more information, see " [Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."<br>Default: `30` |
| `page`integer<br>The page number of the results to fetch. For more information, see " [Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."<br>Default: `1` |

Query parameters

### [HTTP response status codes for "List repository workflows"](https://docs.github.com/en/rest/actions/workflows?apiVersion=2026-03-10\#list-repository-workflows--status-codes)

| Status code | Description |
| --- | --- |
| `200` | OK |

### [Code samples for "List repository workflows"](https://docs.github.com/en/rest/actions/workflows?apiVersion=2026-03-10\#list-repository-workflows--code-samples)

#### Request example

get/repos/{owner}/{repo}/actions/workflows

- cURL

- JavaScript

- GitHub CLI


Copy to clipboard curl request example

`curl -L \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer <YOUR-TOKEN>" \
  -H "X-GitHub-Api-Version: 2026-03-10" \
https://api.github.com/repos/OWNER/REPO/actions/workflows`

#### Response

- Example response

- Response schema


`Status: 200`

`{
"total_count": 2,
"workflows": [\
    {\
      "id": 161335,\
      "node_id": "MDg6V29ya2Zsb3cxNjEzMzU=",\
      "name": "CI",\
      "path": ".github/workflows/blank.yaml",\
      "state": "active",\
      "created_at": "2020-01-08T23:48:37.000-08:00",\
      "updated_at": "2020-01-08T23:50:21.000-08:00",\
      "url": "https://api.github.com/repos/octo-org/octo-repo/actions/workflows/161335",\
      "html_url": "https://github.com/octo-org/octo-repo/blob/master/.github/workflows/161335",\
      "badge_url": "https://github.com/octo-org/octo-repo/workflows/CI/badge.svg"\
    },\
    {\
      "id": 269289,\
      "node_id": "MDE4OldvcmtmbG93IFNlY29uZGFyeTI2OTI4OQ==",\
      "name": "Linter",\
      "path": ".github/workflows/linter.yaml",\
      "state": "active",\
      "created_at": "2020-01-08T23:48:37.000-08:00",\
      "updated_at": "2020-01-08T23:50:21.000-08:00",\
      "url": "https://api.github.com/repos/octo-org/octo-repo/actions/workflows/269289",\
      "html_url": "https://github.com/octo-org/octo-repo/blob/master/.github/workflows/269289",\
      "badge_url": "https://github.com/octo-org/octo-repo/workflows/Linter/badge.svg"\
    }\
]
}`

## [Get a workflow](https://docs.github.com/en/rest/actions/workflows?apiVersion=2026-03-10\#get-a-workflow)

Gets a specific workflow. You can replace `workflow_id` with the workflow
file name. For example, you could use `main.yaml`.

Anyone with read access to the repository can use this endpoint.

OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint with a private repository.

### [Fine-grained access tokens for "Get a workflow"](https://docs.github.com/en/rest/actions/workflows?apiVersion=2026-03-10\#get-a-workflow--fine-grained-access-tokens)

This endpoint works with the following fine-grained token types:

- [GitHub App user access tokens](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app)
- [GitHub App installation access tokens](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app)
- [Fine-grained personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)

The fine-grained token must have the following permission set:

- "Actions" repository permissions (read)

This endpoint can be used without authentication or the aforementioned permissions if only public resources are requested.

### [Parameters for "Get a workflow"](https://docs.github.com/en/rest/actions/workflows?apiVersion=2026-03-10\#get-a-workflow--parameters)

| Name, Type, Description |
| --- |
| `accept`string<br>Setting to `application/vnd.github+json` is recommended. |

Headers

| Name, Type, Description |
| --- |
| `owner`stringRequired<br>The account owner of the repository. The name is not case sensitive. |
| `repo`stringRequired<br>The name of the repository without the `.git` extension. The name is not case sensitive. |
| `workflow_id`Required<br>The ID of the workflow. You can also pass the workflow file name as a string. |

Path parameters

### [HTTP response status codes for "Get a workflow"](https://docs.github.com/en/rest/actions/workflows?apiVersion=2026-03-10\#get-a-workflow--status-codes)

| Status code | Description |
| --- | --- |
| `200` | OK |

### [Code samples for "Get a workflow"](https://docs.github.com/en/rest/actions/workflows?apiVersion=2026-03-10\#get-a-workflow--code-samples)

#### Request example

get/repos/{owner}/{repo}/actions/workflows/{workflow\_id}

- cURL

- JavaScript

- GitHub CLI


Copy to clipboard curl request example

`curl -L \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer <YOUR-TOKEN>" \
  -H "X-GitHub-Api-Version: 2026-03-10" \
https://api.github.com/repos/OWNER/REPO/actions/workflows/WORKFLOW_ID`

#### Response

- Example response

- Response schema


`Status: 200`

`{
"id": 161335,
"node_id": "MDg6V29ya2Zsb3cxNjEzMzU=",
"name": "CI",
"path": ".github/workflows/blank.yaml",
"state": "active",
"created_at": "2020-01-08T23:48:37.000-08:00",
"updated_at": "2020-01-08T23:50:21.000-08:00",
"url": "https://api.github.com/repos/octo-org/octo-repo/actions/workflows/161335",
"html_url": "https://github.com/octo-org/octo-repo/blob/master/.github/workflows/161335",
"badge_url": "https://github.com/octo-org/octo-repo/workflows/CI/badge.svg"
}`

## [Disable a workflow](https://docs.github.com/en/rest/actions/workflows?apiVersion=2026-03-10\#disable-a-workflow)

Disables a workflow and sets the `state` of the workflow to `disabled_manually`. You can replace `workflow_id` with the workflow file name. For example, you could use `main.yaml`.

OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.

### [Fine-grained access tokens for "Disable a workflow"](https://docs.github.com/en/rest/actions/workflows?apiVersion=2026-03-10\#disable-a-workflow--fine-grained-access-tokens)

This endpoint works with the following fine-grained token types:

- [GitHub App user access tokens](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app)
- [GitHub App installation access tokens](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app)
- [Fine-grained personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)

The fine-grained token must have the following permission set:

- "Actions" repository permissions (write)

### [Parameters for "Disable a workflow"](https://docs.github.com/en/rest/actions/workflows?apiVersion=2026-03-10\#disable-a-workflow--parameters)

| Name, Type, Description |
| --- |
| `accept`string<br>Setting to `application/vnd.github+json` is recommended. |

Headers

| Name, Type, Description |
| --- |
| `owner`stringRequired<br>The account owner of the repository. The name is not case sensitive. |
| `repo`stringRequired<br>The name of the repository without the `.git` extension. The name is not case sensitive. |
| `workflow_id`Required<br>The ID of the workflow. You can also pass the workflow file name as a string. |

Path parameters

### [HTTP response status codes for "Disable a workflow"](https://docs.github.com/en/rest/actions/workflows?apiVersion=2026-03-10\#disable-a-workflow--status-codes)

| Status code | Description |
| --- | --- |
| `204` | No Content |

### [Code samples for "Disable a workflow"](https://docs.github.com/en/rest/actions/workflows?apiVersion=2026-03-10\#disable-a-workflow--code-samples)

#### Request example

put/repos/{owner}/{repo}/actions/workflows/{workflow\_id}/disable

- cURL

- JavaScript

- GitHub CLI


Copy to clipboard curl request example

`curl -L \
  -X PUT \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer <YOUR-TOKEN>" \
  -H "X-GitHub-Api-Version: 2026-03-10" \
https://api.github.com/repos/OWNER/REPO/actions/workflows/WORKFLOW_ID/disable`

#### Response

`Status: 204`

## [Create a workflow dispatch event](https://docs.github.com/en/rest/actions/workflows?apiVersion=2026-03-10\#create-a-workflow-dispatch-event)

You can use this endpoint to manually trigger a GitHub Actions workflow run. You can replace `workflow_id` with the workflow file name. For example, you could use `main.yaml`.

You must configure your GitHub Actions workflow to run when the [`workflow_dispatch` webhook](https://docs.github.com/developers/webhooks-and-events/webhook-events-and-payloads#workflow_dispatch) event occurs. The `inputs` are configured in the workflow file. For more information about how to configure the `workflow_dispatch` event in the workflow file, see " [Events that trigger workflows](https://docs.github.com/actions/reference/events-that-trigger-workflows#workflow_dispatch)."

OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.

### [Fine-grained access tokens for "Create a workflow dispatch event"](https://docs.github.com/en/rest/actions/workflows?apiVersion=2026-03-10\#create-a-workflow-dispatch-event--fine-grained-access-tokens)

This endpoint works with the following fine-grained token types:

- [GitHub App user access tokens](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app)
- [GitHub App installation access tokens](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app)
- [Fine-grained personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)

The fine-grained token must have the following permission set:

- "Actions" repository permissions (write)

### [Parameters for "Create a workflow dispatch event"](https://docs.github.com/en/rest/actions/workflows?apiVersion=2026-03-10\#create-a-workflow-dispatch-event--parameters)

| Name, Type, Description |
| --- |
| `accept`string<br>Setting to `application/vnd.github+json` is recommended. |

Headers

| Name, Type, Description |
| --- |
| `owner`stringRequired<br>The account owner of the repository. The name is not case sensitive. |
| `repo`stringRequired<br>The name of the repository without the `.git` extension. The name is not case sensitive. |
| `workflow_id`Required<br>The ID of the workflow. You can also pass the workflow file name as a string. |

Path parameters

| Name, Type, Description |
| --- |
| `ref`stringRequired<br>The git reference for the workflow. The reference can be a branch or tag name. |
| `inputs`object<br>Input keys and values configured in the workflow file. The maximum number of properties is 25. Any default properties configured in the workflow file will be used when `inputs` are omitted. |

Body parameters

### [HTTP response status codes for "Create a workflow dispatch event"](https://docs.github.com/en/rest/actions/workflows?apiVersion=2026-03-10\#create-a-workflow-dispatch-event--status-codes)

| Status code | Description |
| --- | --- |
| `200` | Response including the workflow run ID and URLs. |

### [Code samples for "Create a workflow dispatch event"](https://docs.github.com/en/rest/actions/workflows?apiVersion=2026-03-10\#create-a-workflow-dispatch-event--code-samples)

#### Request example

post/repos/{owner}/{repo}/actions/workflows/{workflow\_id}/dispatches

- cURL

- JavaScript

- GitHub CLI


Copy to clipboard curl request example

`curl -L \
  -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer <YOUR-TOKEN>" \
  -H "X-GitHub-Api-Version: 2026-03-10" \
https://api.github.com/repos/OWNER/REPO/actions/workflows/WORKFLOW_ID/dispatches \
  -d '{"ref":"topic-branch","inputs":{"name":"Mona the Octocat","home":"San Francisco, CA"}}'`

#### Response including the workflow run ID and URLs.

- Example response

- Response schema


`Status: 200`

`{
"workflow_run_id": 1,
"run_url": "https://api.github.com/repos/octo-org/octo-repo/actions/runs/1",
"html_url": "https://github.com/octo-org/octo-repo/actions/runs/1"
}`

## [Enable a workflow](https://docs.github.com/en/rest/actions/workflows?apiVersion=2026-03-10\#enable-a-workflow)

Enables a workflow and sets the `state` of the workflow to `active`. You can replace `workflow_id` with the workflow file name. For example, you could use `main.yaml`.

OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.

### [Fine-grained access tokens for "Enable a workflow"](https://docs.github.com/en/rest/actions/workflows?apiVersion=2026-03-10\#enable-a-workflow--fine-grained-access-tokens)

This endpoint works with the following fine-grained token types:

- [GitHub App user access tokens](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app)
- [GitHub App installation access tokens](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app)
- [Fine-grained personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)

The fine-grained token must have the following permission set:

- "Actions" repository permissions (write)

### [Parameters for "Enable a workflow"](https://docs.github.com/en/rest/actions/workflows?apiVersion=2026-03-10\#enable-a-workflow--parameters)

| Name, Type, Description |
| --- |
| `accept`string<br>Setting to `application/vnd.github+json` is recommended. |

Headers

| Name, Type, Description |
| --- |
| `owner`stringRequired<br>The account owner of the repository. The name is not case sensitive. |
| `repo`stringRequired<br>The name of the repository without the `.git` extension. The name is not case sensitive. |
| `workflow_id`Required<br>The ID of the workflow. You can also pass the workflow file name as a string. |

Path parameters

### [HTTP response status codes for "Enable a workflow"](https://docs.github.com/en/rest/actions/workflows?apiVersion=2026-03-10\#enable-a-workflow--status-codes)

| Status code | Description |
| --- | --- |
| `204` | No Content |

### [Code samples for "Enable a workflow"](https://docs.github.com/en/rest/actions/workflows?apiVersion=2026-03-10\#enable-a-workflow--code-samples)

#### Request example

put/repos/{owner}/{repo}/actions/workflows/{workflow\_id}/enable

- cURL

- JavaScript

- GitHub CLI


Copy to clipboard curl request example

`curl -L \
  -X PUT \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer <YOUR-TOKEN>" \
  -H "X-GitHub-Api-Version: 2026-03-10" \
https://api.github.com/repos/OWNER/REPO/actions/workflows/WORKFLOW_ID/enable`

#### Response

`Status: 204`

## [Get workflow usage](https://docs.github.com/en/rest/actions/workflows?apiVersion=2026-03-10\#get-workflow-usage)

Warning

This endpoint is in the process of closing down. Refer to " [Actions Get workflow usage and Get workflow run usage endpoints closing down](https://github.blog/changelog/2025-02-02-actions-get-workflow-usage-and-get-workflow-run-usage-endpoints-closing-down/)" for more information.

Gets the number of billable minutes used by a specific workflow during the current billing cycle. Billable minutes only apply to workflows in private repositories that use GitHub-hosted runners. Usage is listed for each GitHub-hosted runner operating system in milliseconds. Any job re-runs are also included in the usage. The usage does not include the multiplier for macOS and Windows runners and is not rounded up to the nearest whole minute. For more information, see " [Managing billing for GitHub Actions](https://docs.github.com/github/setting-up-and-managing-billing-and-payments-on-github/managing-billing-for-github-actions)".

You can replace `workflow_id` with the workflow file name. For example, you could use `main.yaml`.

Anyone with read access to the repository can use this endpoint.

OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint with a private repository.

### [Fine-grained access tokens for "Get workflow usage"](https://docs.github.com/en/rest/actions/workflows?apiVersion=2026-03-10\#get-workflow-usage--fine-grained-access-tokens)

This endpoint works with the following fine-grained token types:

- [GitHub App user access tokens](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app)
- [GitHub App installation access tokens](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app)
- [Fine-grained personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)

The fine-grained token must have the following permission set:

- "Actions" repository permissions (read)

This endpoint can be used without authentication or the aforementioned permissions if only public resources are requested.

### [Parameters for "Get workflow usage"](https://docs.github.com/en/rest/actions/workflows?apiVersion=2026-03-10\#get-workflow-usage--parameters)

| Name, Type, Description |
| --- |
| `accept`string<br>Setting to `application/vnd.github+json` is recommended. |

Headers

| Name, Type, Description |
| --- |
| `owner`stringRequired<br>The account owner of the repository. The name is not case sensitive. |
| `repo`stringRequired<br>The name of the repository without the `.git` extension. The name is not case sensitive. |
| `workflow_id`Required<br>The ID of the workflow. You can also pass the workflow file name as a string. |

Path parameters

### [HTTP response status codes for "Get workflow usage"](https://docs.github.com/en/rest/actions/workflows?apiVersion=2026-03-10\#get-workflow-usage--status-codes)

| Status code | Description |
| --- | --- |
| `200` | OK |

### [Code samples for "Get workflow usage"](https://docs.github.com/en/rest/actions/workflows?apiVersion=2026-03-10\#get-workflow-usage--code-samples)

#### Request example

get/repos/{owner}/{repo}/actions/workflows/{workflow\_id}/timing

- cURL

- JavaScript

- GitHub CLI


Copy to clipboard curl request example

`curl -L \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer <YOUR-TOKEN>" \
  -H "X-GitHub-Api-Version: 2026-03-10" \
https://api.github.com/repos/OWNER/REPO/actions/workflows/WORKFLOW_ID/timing`

#### Response

- Example response

- Response schema


`Status: 200`

`{
"billable": {
    "UBUNTU": {
      "total_ms": 180000
    },
    "MACOS": {
      "total_ms": 240000
    },
    "WINDOWS": {
      "total_ms": 300000
    }
}
}`

REST API endpoints for workflows - GitHub Docs
