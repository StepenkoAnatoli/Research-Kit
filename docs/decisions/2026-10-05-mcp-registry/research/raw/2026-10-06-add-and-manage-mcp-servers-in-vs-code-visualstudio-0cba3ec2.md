---
url: https://code.visualstudio.com/docs/agent-customization/mcp-servers
retrieved: 2026-10-06
command: firecrawl scrape https://code.visualstudio.com/docs/agent-customization/mcp-servers --only-main-content --max-age 0 --format markdown,rawHtml --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Add and manage MCP servers in VS Code
---
AI agents: See [llms.txt](https://code.visualstudio.com/llms.txt) for documentation discovery and navigation. Documentation articles are also available as Markdown by appending `.md` to the article URL.


[🎬 Watch The Story of VS Code!](https://aka.ms/the-story-of-vs-code?source=vsc-website-banner)

[VS Code is now on Instagram, follow @vscode.ig for updates, tips, and more.](https://aka.ms/VSCode/IG?source=vsc-website-banner)

[Rewatch GitHub Copilot Day.](https://gh.io/githubcopilotday?source=vsc-website-banner)

Dismiss this update

# Add and manage MCP servers in VS Code

Copy as Markdown

- Copy as Markdown
- [View as Markdown](https://code.visualstudio.com/docs/agent-customization/mcp-servers.md)
- [Ask in VS Code](vscode://GitHub.Copilot-Chat/chat?prompt=Read%20https%3A%2F%2Fcode.visualstudio.com%2Fdocs%2Fagent-customization%2Fmcp-servers%20and%20answer%20questions%20about%20the%20content.&windowId=_blank)
- [Ask in VS Code Insiders](vscode-insiders://GitHub.Copilot-Chat/chat?prompt=Read%20https%3A%2F%2Fcode.visualstudio.com%2Fdocs%2Fagent-customization%2Fmcp-servers%20and%20answer%20questions%20about%20the%20content.&windowId=_blank)

* * *

Add an MCP server when a coding task needs information or actions that your agent's existing tools don't provide. For example, a server can let the agent query a database or update an issue in an external service instead of asking you to perform those steps manually.

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/) is an open standard for connecting AI models to external tools and services. In Visual Studio Code, servers expose these capabilities as [tools](https://code.visualstudio.com/docs/agents/run/tools). MCP servers can also provide [resources, prompts, and interactive apps](https://code.visualstudio.com/docs/agent-customization/mcp-servers#_other-mcp-capabilities).

If the tools already available meet your needs, you don't need an additional server. Adding one means configuring access and deciding whether to [trust the server](https://code.visualstudio.com/docs/agent-customization/mcp-servers#_mcp-server-trust).

For background on how MCP fits into the AI customization framework, see [Customization concepts](https://code.visualstudio.com/docs/agents/concepts/customization) and [Tools concepts](https://code.visualstudio.com/docs/agents/concepts/tools).

This article covers how to add, configure, and manage MCP servers. To learn how agents invoke tools, see [Use tools with agents](https://code.visualstudio.com/docs/agents/run/tools).

Tip


Use the [Agent Customizations editor](https://code.visualstudio.com/docs/agent-customization/overview#_agent-customizations-editor) (Preview) to discover, create, and manage all your agent customizations in one place. Run **Chat: Open Customizations** from the Command Palette.

## [Quickstart: use an MCP server in chat](https://code.visualstudio.com/docs/agent-customization/mcp-servers\#_quickstart-use-an-mcp-server-in-chat)

This walkthrough demonstrates adding an external tool provider with the [Playwright](https://github.com/microsoft/playwright-mcp) MCP server. If your goal is browser interaction rather than learning MCP setup, check the [built-in browser tools](https://code.visualstudio.com/docs/agents/run/browser-tools) first. They don't require an MCP server.

1. Open the Extensions view (Ctrl+Shift+X) and enter `@mcp playwright` in the search field.

2. Select **Install** to install the Playwright MCP server in your user profile.

3. When prompted, confirm that you trust the server to start it. VS Code discovers the server's tools and makes them available in chat.

4. Open the Chat view (Ctrl+Alt+I) and enter a prompt that uses the Playwright tools. For example:





Open in VS Code

   - Stable
   - Insiders

```
Go to code.visualstudio.com, decline the cookie banner, and give me a screenshot of the homepage.
```

VS Code invokes the Playwright tools to open the page in a browser, and take a screenshot. You might be asked to confirm each tool invocation.

Tip


Select the **Configure Tools** button in the chat input to see all available tools for the Playwright MCP server and toggle specific tools on or off.

## [Add an MCP server](https://code.visualstudio.com/docs/agent-customization/mcp-servers\#_add-an-mcp-server)

To install an MCP server from the MCP server gallery:

1. Open the Extensions view (Ctrl+Shift+X) and enter `@mcp` in the search field. This shows the list of available MCP servers in the gallery.

2. You can install an MCP server in your user profile or in your workspace:
   - To install in your user profile, select **Install**.

   - To install in your workspace, right-click the MCP server and select **Install in Workspace**. This updates the `.vscode/mcp.json` file in your workspace.
3. To view the MCP server details, select the MCP server in the list to open the details page.


Caution


Local MCP servers can run arbitrary code on your machine. Only add servers from [trusted sources](https://code.visualstudio.com/docs/agent-customization/mcp-servers#_mcp-server-trust), and review the publisher and server configuration before starting it. Read the [Security documentation](https://code.visualstudio.com/docs/agents/run/security) for using AI in VS Code to understand the implications.

### [Configure the mcp.json file](https://code.visualstudio.com/docs/agent-customization/mcp-servers\#_configure-the-mcpjson-file)

You can manually configure MCP servers in the following locations:

- **Workspace, VS Code format**: create or open `.vscode/mcp.json` in your project. This format defines servers in a top-level `servers` object.
- **Workspace, portable format**: create `.mcp.json` at the root of your project. This format defines servers in a top-level `mcpServers` object and works across compatible tools.
- **User profile**: run the **MCP: Open User Configuration** command to open the `mcp.json` file in your [user profile](https://code.visualstudio.com/docs/configure/profiles) folder. Servers configured here are available across all your workspaces. When you use multiple profiles, each profile can have its own MCP server configuration.
- **User, portable format**: create `$COPILOT_HOME/mcp-config.json`, or `~/.copilot/mcp-config.json` when `COPILOT_HOME` is not set. This format defines servers in a top-level `mcpServers` object and works across compatible Copilot tools.

Include workspace configuration in source control to share MCP servers with your team.

You can also run **MCP: Add Server** in the Command Palette (Ctrl+Shift+P) to add a server through a guided flow. Choose **.mcp.json** to save a portable configuration at the workspace root, or **Copilot Global** to save it in `$COPILOT_HOME/mcp-config.json` with `~/.copilot/mcp-config.json` as the fallback location. The flow also lists the deprecated `.vscode/mcp.json` and VS Code user-profile destinations for compatibility. Prefer the portable destinations for new servers.

For sessions that run on [Agent Host](https://code.visualstudio.com/docs/agents/concepts/agent-host), the Agent Host doesn't read `.vscode/mcp.json` directly. Instead, VS Code forwards your MCP server configuration to the Agent Host, except servers that require interactive input (for example, `${input:...}` variables). For MCP configuration that is portable across the Agent Host and other Copilot tools, use a workspace `.mcp.json` file or a user `~/.copilot/mcp-config.json` file, which the Agent Host reads natively. Learn more about [behavior on the extension host](https://code.visualstudio.com/docs/agents/concepts/agent-host#_behavior-on-the-extension-host).

Important


Avoid hardcoding sensitive information like API keys. Use [input variables](https://code.visualstudio.com/docs/agents/reference/mcp-configuration#_input-variables-for-sensitive-data) or environment files instead.

The following example shows an `mcp.json` file that configures a remote MCP server and a local MCP server:

```
{
  "servers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp"
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@microsoft/mcp-server-playwright"]
    }
  }
}
```

VS Code provides IntelliSense for the configuration file. For the full configuration schema and field reference, see the [MCP configuration reference](https://code.visualstudio.com/docs/agents/reference/mcp-configuration).

Note


MCP servers run wherever they are configured. Servers in your user profile run locally. If you're connected to a [remote](https://code.visualstudio.com/docs/remote/remote-overview) and want a server to run on the remote machine, define it in the workspace settings or remote user settings ( **MCP: Open Remote User Configuration**).

### [Other options to add an MCP server](https://code.visualstudio.com/docs/agent-customization/mcp-servers\#_other-options-to-add-an-mcp-server)

Add an MCP server to a dev container

MCP servers can be configured in Dev Containers through the `devcontainer.json` file. This allows you to include MCP server configurations as part of your containerized development environment.

To configure MCP servers in a Dev Container, add the server configuration to the `customizations.vscode.mcp` section:

```
{
  "image": "mcr.microsoft.com/devcontainers/typescript-node:latest",
  "customizations": {
    "vscode": {
      "mcp": {
        "servers": {
          "playwright": {
            "command": "npx",
            "args": ["-y", "@microsoft/mcp-server-playwright"]
          }
        }
      }
    }
  }
}
```

When the Dev Container is created, VS Code automatically writes the MCP server configurations to the remote `mcp.json` file, making them available in your containerized development environment.

Automatically discover MCP servers

VS Code can automatically detect and reuse MCP server configurations from other applications, such as Claude Desktop.

With the
chat.mcp.discovery.enabled

Open in VS CodeOpen in VS Code Insiders setting, you can select one or more tools from which to discover their MCP server configuration.

Supported sources include Claude Desktop, GitHub Copilot CLI, Cursor, and Windsurf. Learn more about [automatic MCP server discovery](https://code.visualstudio.com/docs/agents/reference/mcp-configuration#_automatic-mcp-server-discovery), including configuration locations and remote behavior.

Install an MCP server from the command line

You can also use the VS Code command-line interface to add an MCP server to your user profile or to a workspace.

To add an MCP server to your user profile, use the `--add-mcp` VS Code command line option, and provide the JSON server configuration in the form `{\"name\":\"server-name\",\"command\":...}`.

```
code --add-mcp "{\"name\":\"my-server\",\"command\": \"uvx\",\"args\": [\"mcp-server-fetch\"]}"
```

## [Other MCP capabilities](https://code.visualstudio.com/docs/agent-customization/mcp-servers\#_other-mcp-capabilities)

Beyond tools, MCP servers can provide other capabilities:

Expand table


| Capability | Description | How to use |
| --- | --- | --- |
| **Resources** | Access data from MCP servers as context in your prompts, such as files, database tables, or API responses. Resources provide read-only context that you attach to a chat request. | In the Chat view, select **Add Context** \> **MCP Resources**. You can also use the **MCP: Browse Resources** command. |
| **Prompts** | Use preconfigured prompt templates from MCP servers to standardize common tasks. Each MCP server can expose its own set of prompts tailored to its capabilities. | Type `/<MCP server>.<prompt>` in the chat input. |
| **MCP Apps** | Get interactive UI components like forms, visualizations, and drag-and-drop lists rendered directly in chat. MCP Apps enable richer interactions beyond text responses. Learn more in the [MCP Apps blog post](https://code.visualstudio.com/blogs/2026/01/26/mcp-apps-support). | MCP Apps appear inline when an MCP server supports them. |

## [Sandbox MCP servers](https://code.visualstudio.com/docs/agent-customization/mcp-servers\#_sandbox-mcp-servers)

On macOS and Linux, you can enable sandboxing for locally-running stdio MCP servers to restrict their access to the file system and network. Sandboxed servers run in an isolated environment and can only access the file paths and network domains that you explicitly permit.

To enable sandboxing for a server, set `"sandboxEnabled": true` in the server configuration in your `mcp.json` file. You can further customize the sandbox restrictions by adding a top-level `sandbox` object with specific file system and network rules.

The following example shows how to enable sandboxing for a local MCP server and restrict its access to only write to files in the workspace and access a specific API domain:

```
{
  "servers": {
    "myServer": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@example/mcp-server"],
      "sandboxEnabled": true
    }
  },
  "sandbox": {
    "filesystem": {
      "allowWrite": ["${workspaceFolder}"]
    },
    "network": {
      "allowedDomains": ["api.example.com"]
    }
  }
}
```

When sandboxing is enabled, tool calls from the server are auto-approved because they run in a controlled environment.

For the full sandbox configuration schema, see the [Sandbox configuration](https://code.visualstudio.com/docs/agents/reference/mcp-configuration#_sandbox-configuration) reference.

Note


Sandboxing is currently not available on Windows.

## [Manage MCP servers](https://code.visualstudio.com/docs/agent-customization/mcp-servers\#_manage-mcp-servers)

VS Code provides several options to manage your MCP servers, such as starting or stopping a server, viewing logs, uninstalling, or clearing cached tools.

Expand table


| Method | Description |  |
| --- | --- | --- |
| **Extensions view** | Right-click a server in the **MCP SERVERS - INSTALLED** section or select the gear icon. | ![Screenshot showing the MCP servers in the Extensions view.](https://code.visualstudio.com/assets/docs/agent-customization/mcp-servers/extensions-view-mcp-servers.png) |
| **`mcp.json` editor** | Open the configuration file and use the inline actions (code lenses). Use **MCP: Open User Configuration** or **MCP: Open Workspace Folder Configuration** to open the file. | ![MCP server configuration with lenses to manage server.](https://code.visualstudio.com/assets/docs/agent-customization/mcp-servers/mcp-server-config-lenses.png) |
| **Command Palette** | Run **MCP: List Servers**, select a server, and choose an action. | ![Screenshot showing the actions for an MCP server in the Command Palette.](https://code.visualstudio.com/assets/docs/agent-customization/mcp-servers/mcp-list-servers-actions.png) |

## [Enable or disable MCP servers](https://code.visualstudio.com/docs/agent-customization/mcp-servers\#_enable-or-disable-mcp-servers)

You can enable or disable an MCP server globally or for a specific workspace. When an MCP server is disabled, it does not start and its tools, prompts, resources, and MCP apps are excluded from chat.

To enable or disable an MCP server:

- Right-click a server in the **MCP SERVERS - INSTALLED** section of the Extensions view and select **Enable** or **Disable**.
- Run **MCP: List Servers** from the Command Palette, select a server, and choose **Enable** or **Disable**.
- Use the [Agent Customizations editor](https://code.visualstudio.com/docs/agent-customization/overview#_agent-customizations-editor) to toggle the server's enabled state.

The enable/disable state is stored separately from the server configuration in `mcp.json`, so it does not affect shared configuration files.

## [Centrally manage access to MCP servers in VS Code](https://code.visualstudio.com/docs/agent-customization/mcp-servers\#_centrally-manage-access-to-mcp-servers-in-vs-code)

Organizations can centrally manage access to MCP servers via GitHub policies. Learn more about [enterprise management of MCP servers](https://code.visualstudio.com/docs/enterprise/manage-ai-settings#_configure-mcp-server-access).

## [Automatically start MCP servers](https://code.visualstudio.com/docs/agent-customization/mcp-servers\#_automatically-start-mcp-servers)

When you submit a chat message, VS Code can automatically start MCP servers so that their tools are available to the chat. Use the
chat.mcp.autostart

Open in VS CodeOpen in VS Code Insiders setting to control which servers VS Code starts during this autostart pass:

- `never`: Don't automatically start MCP servers.
- `onlyNew`: Start servers that have never run.
- `newAndOutdated` (default): Start servers that have never run and servers whose configuration has changed.

Disabled servers and servers in an error state are excluded from the autostart pass.

Important


For [Agent Host](https://code.visualstudio.com/docs/agents/concepts/agent-host) sessions,
chat.mcp.autostart

Open in VS CodeOpen in VS Code Insiders only controls the VS Code MCP autostart pass. The Agent Host and Copilot SDK manage their MCP server processes independently. The Agent Host discovers MCP configuration from workspace `.mcp.json` and user `~/.copilot/mcp-config.json` files. VS Code also forwards eligible server configurations from supported sources, including `.vscode/mcp.json`. As a result, setting
chat.mcp.autostart

Open in VS CodeOpen in VS Code Insiders to `never` doesn't prevent an Agent Host session from starting its configured MCP servers.

## [MCP server trust](https://code.visualstudio.com/docs/agent-customization/mcp-servers\#_mcp-server-trust)

Workspace MCP servers inherit [Workspace Trust](https://code.visualstudio.com/docs/editing/workspaces/workspace-trust). When you trust a workspace, servers in `.vscode/mcp.json` and workspace-root `.mcp.json` can start without a separate MCP server trust prompt, including after their configuration changes. In restricted mode, workspace MCP configuration is blocked and these servers don't start.

Review workspace MCP configuration before you trust a repository because local MCP servers can run code on your machine.

MCP servers from other sources can use a separate trust decision. For these servers, VS Code shows a dialog when a server first starts or its configuration changes. In the dialog, select the link to the MCP server to review its configuration.

![Screenshot showing the MCP server trust prompt.](https://code.visualstudio.com/assets/docs/agent-customization/mcp-servers/mcp-server-trust-dialog.png)

If you don't trust the MCP server, it will not be started, and chat requests will continue without using the tools provided by the server.

To reset separate MCP server trust decisions, run the **MCP: Reset Trust** command from the Command Palette. This command doesn't change Workspace Trust.

## [Synchronize MCP configuration across devices](https://code.visualstudio.com/docs/agent-customization/mcp-servers\#_synchronize-mcp-configuration-across-devices)

With [Settings Sync](https://code.visualstudio.com/docs/configure/settings-sync) enabled, you can synchronize settings and configurations across devices, including MCP server configurations. This enables you to maintain a consistent development environment and access the same MCP servers on all your devices.

To synchronize MCP server configuration with Settings Sync:

1. Run the **Settings Sync: Configure** command from the Command Palette

2. Enable the **MCP Servers** option in the list of synchronized configurations


## [Troubleshoot and debug MCP servers](https://code.visualstudio.com/docs/agent-customization/mcp-servers\#_troubleshoot-and-debug-mcp-servers)

### [MCP output log](https://code.visualstudio.com/docs/agent-customization/mcp-servers\#_mcp-output-log)

When VS Code encounters an issue with an MCP server, it shows an error indicator in the Chat view.

![MCP Server Error](https://code.visualstudio.com/assets/docs/agent-customization/mcp-servers/mcp-error-loading-tool.png)

Select the error notification in the Chat view, and then select the **Show Output** option to view the server logs. Alternatively, run **MCP: List Servers** from the Command Palette, select the server, and then choose **Show Output**.

![MCP Server Error Output](https://code.visualstudio.com/assets/docs/agent-customization/mcp-servers/mcp-server-error-output.png)

## [Frequently asked questions](https://code.visualstudio.com/docs/agent-customization/mcp-servers\#_frequently-asked-questions)

The MCP server is not starting when using Docker

Verify that the command arguments are correct and that the container is not running in detached mode (`-d` option). You can also check the MCP server output for any error messages (see [Troubleshooting](https://code.visualstudio.com/docs/agent-customization/mcp-servers#_troubleshoot-and-debug-mcp-servers)).

## [Related resources](https://code.visualstudio.com/docs/agent-customization/mcp-servers\#_related-resources)

- [MCP configuration reference](https://code.visualstudio.com/docs/agents/reference/mcp-configuration)
- [Use tools with agents](https://code.visualstudio.com/docs/agents/run/tools)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [MCP Apps support in VS Code](https://code.visualstudio.com/blogs/2026/01/26/mcp-apps-support)
- [Discover and manage agent plugins](https://code.visualstudio.com/docs/agent-customization/agent-plugins), including [MCP servers in plugins](https://code.visualstudio.com/docs/agent-customization/agent-plugins#_mcp-servers-in-plugins)

## Help and support

### Still need help?

- [![](https://code.visualstudio.com/assets/community/sidebar/stackoverflow.svg)Ask the community](https://stackoverflow.com/questions/tagged/vscode)
- [![](https://code.visualstudio.com/assets/community/sidebar/github.svg)Request features](https://github.com/microsoft/vscode/issues/new/choose)
- [![](https://code.visualstudio.com/assets/community/sidebar/issue.svg)Report issues](https://www.github.com/Microsoft/vscode/issues)

### Help us improve

Edit this page

9/30/2026

- [![RSS](https://code.visualstudio.com/assets/community/sidebar/rss.svg)RSS Feed](https://code.visualstudio.com/feed.xml)
- [![Stackoverflow](https://code.visualstudio.com/assets/community/sidebar/stackoverflow.svg)Ask questions](https://stackoverflow.com/questions/tagged/vscode)
- [![Twitter](https://code.visualstudio.com/assets/community/sidebar/twitter.svg)Follow @code](https://go.microsoft.com/fwlink/?LinkID=533687)
- [![GitHub](https://code.visualstudio.com/assets/community/sidebar/github.svg)Request features](https://github.com/microsoft/vscode/issues/new/choose)
- [![Issues](https://code.visualstudio.com/assets/community/sidebar/issue.svg)Report issues](https://www.github.com/microsoft/vscode/issues)
- [![YouTube](https://code.visualstudio.com/assets/community/sidebar/youtube.svg)Watch videos](https://www.youtube.com/channel/UCs5Y5_7XK8HLDX0SLNwkd3w)

![Search](https://code.visualstudio.com/assets/icons/search-dark.svg)![Search](https://code.visualstudio.com/assets/icons/search.svg)
