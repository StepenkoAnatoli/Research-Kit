---
url: https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp-in-your-ide/extend-copilot-chat-with-mcp?tool=vscode
retrieved: 2026-10-06
command: firecrawl scrape https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp-in-your-ide/extend-copilot-chat-with-mcp?tool=vscode --only-main-content --max-age 0 --format markdown,rawHtml --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Extending GitHub Copilot Chat with Model Context Protocol (MCP) servers - GitHub Docs
---
[Skip to main content](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/extend-copilot-with-tools-and-context/extend-copilot-chat-with-mcp?tool=vscode#main-content)

[Skip to content](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/extend-copilot-with-tools-and-context/extend-copilot-chat-with-mcp?tool=vscode#main-content)

Collapse sidebarExpand sidebar

Scroll breadcrumbs left

Scroll breadcrumbs right

In this article

# Extending GitHub Copilot Chat with Model Context Protocol (MCP) servers

Connect MCP servers to Copilot Chat to share context from other applications.

Copy markdown

## Tool navigation

## In this article

## [Introduction](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/extend-copilot-with-tools-and-context/extend-copilot-chat-with-mcp?tool=vscode\#introduction)

The Model Context Protocol (MCP) is an open standard that defines how applications share context with large language models (LLMs). For an overview of MCP, see [About Model Context Protocol (MCP)](https://docs.github.com/en/copilot/concepts/context/mcp).

For a curated list of MCP servers from partners and the community, see the [GitHub MCP Registry](https://github.com/mcp).

Enterprises and organizations can choose to enable or disable use of MCP for members of their organization or enterprise with the **MCP servers in Copilot** policy. The policy is disabled by default. See [Managing policies and features for GitHub Copilot in your enterprise](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-enterprise-policies) and [Managing policies and features for GitHub Copilot in your organization](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies). The MCP policy **only** applies to users who have a Copilot Business or Copilot Enterprise subscription from an organization or enterprise that configures the policy. Copilot Free, Copilot Pro, Copilot Pro+, or Copilot Max **do not** have their MCP access governed by this policy.

## [Prerequisites](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/extend-copilot-with-tools-and-context/extend-copilot-chat-with-mcp?tool=vscode\#prerequisites)

- **Access to Copilot**. See [About GitHub Copilot](https://docs.github.com/en/copilot/get-started/about-github-copilot#get-access).
- **Visual Studio Code version 1.99 or later**. For information on installing Visual Studio Code, see the [Visual Studio Code download page](https://code.visualstudio.com/Download?ref_product=copilot&ref_type=engagement&ref_style=text).
- If you are a member of an organization or enterprise with a Copilot Business or Copilot Enterprise plan, the "MCP servers in Copilot" policy must be enabled in order to use MCP with Copilot.

## [Configuring MCP servers in Visual Studio Code](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/extend-copilot-with-tools-and-context/extend-copilot-chat-with-mcp?tool=vscode\#configuring-mcp-servers-in-visual-studio-code)

MCP servers can be configured manually in a configuration file, or through the GitHub MCP Registry. The GitHub MCP Registry provides a curated list of MCP servers that you can easily add to your Visual Studio Code instance.

### [Using the GitHub MCP Registry](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/extend-copilot-with-tools-and-context/extend-copilot-chat-with-mcp?tool=vscode\#using-the-github-mcp-registry)

Note

The GitHub MCP Registry is in public preview and may change.

Only MCP servers listed in the GitHub MCP Registry can be added through the registry. Other servers can be configured manually. See [Configuring MCP servers manually](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/extend-copilot-with-tools-and-context/extend-copilot-chat-with-mcp?tool=vscode#configuring-mcp-servers-manually).

1. In Visual Studio Code, open the extensions panel by clicking the extensions icon in the sidebar or pressing `Ctrl` + `Shift` + `X` (Windows/Linux) / `Command` + `Shift` + `X` (Mac).
2. In the extensions search bar, type `@mcp` followed by the name of the MCP server you want to add. This opens the MCP server gallery and shows matching results.
3. Select the MCP server from the search results. On the MCP server's details page, click **Install**.
4. When prompted, confirm that you trust the server to start it. VS Code discovers the server's tools and makes them available in chat.
5. To verify that the MCP server is configured correctly, open the command palette by pressing `Ctrl` + `Shift` + `P` (Windows/Linux) / `Command` + `Shift` + `P` (Mac).
6. Type and select **MCP: List Servers**. You should see the MCP server listed as a configured server.

### [Configuring MCP servers manually](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/extend-copilot-with-tools-and-context/extend-copilot-chat-with-mcp?tool=vscode\#configuring-mcp-servers-manually)

To configure MCP servers in Visual Studio Code, you need to set up a configuration script that specifies the details of the MCP servers you want to use. You can configure MCP servers for either:

- **A specific repository**. This enables you to share MCP servers with anyone who opens the project in Visual Studio Code. To do this, create a `.vscode/mcp.json` file in the root of your repository.

- **Your personal instance of Visual Studio Code**. You will be the only person who has access to configured MCP servers. To do this, add the configuration to your `settings.json` file in Visual Studio Code. MCP servers configured this way will be available in all workspaces.



Note



We recommend you use only one location per server. Adding the same server to both locations may cause conflicts and unexpected behavior.


The steps below show how to configure the Fetch MCP server in your `.vscode/mcp.json` file. The Fetch MCP server is a simple MCP server that provides web content fetching capabilities. For more information on the Fetch MCP server, see [the Fetch directory](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch) in the MCP Server repository.

You can use the same steps to configure MCP servers in your personal Visual Studio Code settings. Details on how to configure other MCP servers are available in the [MCP servers repository](https://github.com/modelcontextprotocol/servers/tree/main).

For information on configuring the GitHub MCP server, see [Using the GitHub MCP Server in your IDE](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/use-the-github-mcp-server).

1. Add the following configuration to your `.vscode/mcp.json` file:



```json
{
"inputs": [\
     // The "inputs" section defines the inputs required for the MCP server configuration.\
     {\
       "type": "promptString"\
     }\
],
"servers": {
     // The "servers" section defines the MCP servers you want to use.
     "fetch": {
       "command": "uvx",
       "args": ["mcp-server-fetch"]
     }
    }
}
```

2. Save the `.vscode/mcp.json` file.

3. A "Start" button will appear in your `.vscode/mcp.json` file, at the top of the list of servers. Click the "Start" button to start the MCP servers. This will trigger the input dialog and discover the server tools, which are then stored for later sessions.

![Screenshot of MCP server configuration in Visual Studio Code. The "Start" button is outlined in dark orange. ](https://docs.github.com/assets/cb-51859/images/help/copilot/mcp-start-server-button.png)

4. Open Copilot Chat by clicking the chat icon in the title bar of Visual Studio Code.

5. In the Copilot Chat box, select **Agent** from the popup menu.

![Screenshot of the Copilot Chat box in Visual Studio Code. The "Agent" option is outlined in dark orange.](https://docs.github.com/assets/cb-38150/images/help/copilot/copilot-chat-agent-option.png)

6. To view your list of available MCP servers, click the tools icon in the top left corner of the chat box. This will open the MCP server list, where you can see all the MCP servers and associated tools that are currently available in your Visual Studio Code instance.
   - Optionally, you can define toolsets, groups of related tools that you can reference in chat. Toolsets make it easier to group related MCP tools together and quickly enable or disable them. For information on how to define and use a toolset, see the [VS Code docs](https://code.visualstudio.com/docs/copilot/agents/agent-tools#_group-tools-with-tool-sets).

For more information on configuring MCP servers in Visual Studio Code, see [Use MCP servers in Visual Studio Code](https://aka.ms/vscode-add-mcp) in the Visual Studio Code documentation.

## [Using MCP servers in Copilot Chat](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/extend-copilot-with-tools-and-context/extend-copilot-chat-with-mcp?tool=vscode\#using-mcp-servers-in-copilot-chat)

Once you have configured your MCP servers, you can use them in Copilot Chat to access a wide range of tools and services. In the example below, we will use the Fetch MCP server to fetch details about a web page.

1. Open Copilot Chat by clicking the chat icon in the title bar of Visual Studio Code.

2. In the Copilot Chat box, select **Agent** from the agent dropdown menu.

3. In the file with the MCP configuration, check that the MCP server is running. If it is not running, click the "Start" button to start the MCP server.

![Screenshot of the MCP server configuration in Visual Studio Code. The "Running" status is outlined in dark orange.](https://docs.github.com/assets/cb-68101/images/help/copilot/vsc-mcp-server-running.png)

4. Ask Copilot Chat to fetch the details of a URL. For example:

`Fetch https://github.com/github/docs.`

5. If Copilot asks you to confirm that you want to proceed, click **Continue**.

6. Copilot will fetch the details of the URL and display them in the chat box.


Optionally, you can use MCP prompts and resources in VS Code.

- MCP servers can define preconfigured prompts for interacting with their tools. You can access these prompts in chat with slash commands, using the format `/mcp.servername.promptname`.
- MCP servers provide resources, which are any kind of data that the server wants to make available. For example, the GitHub MCP server provides repository content as a resource. To add resources from an MCP server to your chat context, click **Add Context...** in the chat box, then click **MCP Resources**.

For more information on using MCP servers in Visual Studio Code, see [Use MCP servers in Visual Studio Code](https://aka.ms/vscode-add-mcp) in the Visual Studio Code documentation.

## [Using existing MCP configurations](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/extend-copilot-with-tools-and-context/extend-copilot-chat-with-mcp?tool=vscode\#using-existing-mcp-configurations)

If you already have an MCP configuration in Claude Desktop, you can use that configuration in Visual Studio Code to access the same MCP servers. To do this, add the following configuration to your `settings.json` file in Visual Studio Code:

```json
"chat.mcp.discovery.enabled": true
```

Visual Studio Code will automatically find your existing configuration and use it in your Visual Studio Code instance.

## [Prerequisites](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/extend-copilot-with-tools-and-context/extend-copilot-chat-with-mcp?tool=vscode\#prerequisites-1)

- **Access to Copilot**. See [About GitHub Copilot](https://docs.github.com/en/copilot/get-started/about-github-copilot#get-access).
- **Visual Studio version 17.14 or later**. For more information on installing Visual Studio, see the [Visual Studio downloads page](https://visualstudio.microsoft.com/downloads/).
- **Sign in to GitHub from Visual Studio**.
- If you are a member of an organization or enterprise with a Copilot Business or Copilot Enterprise plan, the "MCP servers in Copilot" policy must be enabled in order to use MCP with Copilot.

## [Configuring MCP servers in Visual Studio](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/extend-copilot-with-tools-and-context/extend-copilot-chat-with-mcp?tool=vscode\#configuring-mcp-servers-in-visual-studio)

1. In the Visual Studio menu bar, click **View**, then click **GitHub Copilot Chat**.

2. At the bottom of the chat panel, select **Agent** from the mode dropdown.

3. In the Copilot Chat window, click the tools icon, then click the plus icon in the tool picker window.

4. In the "Configure MCP server" pop-up window, fill out the fields, including server ID, type, and any additional fields required for the specific MCP server configuration.

Visual Studio supports both remote and local servers. Remote servers, defined with a URL and credentials, are hosted externally for easier setup and sharing, while local servers, defined with command-line invocation, run on your local machine and can access local resources. See example configurations below, using the GitHub MCP server as an example.

5. Click **Save**.

6. If you are using a remote server with OAuth authentication, in the `mcp.json` file, click **Auth** from the CodeLens above the server to authenticate to the server. A pop-up or new window will appear, allowing you to authenticate with your account. The server will only be able to access the scopes you approve, and that your organization policies allow.

7. In the Copilot Chat window, click the tools icon. You should now see additional tools from the MCP server that you configured.


### [Remote server configuration example with OAuth](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/extend-copilot-with-tools-and-context/extend-copilot-chat-with-mcp?tool=vscode\#remote-server-configuration-example-with-oauth)

1. For "Server ID", type `github`.

2. For "Type", select "HTTP/SSE" from the dropdown.

3. For "URL", type `https://api.githubcopilot.com/mcp/`.

4. After clicking **Save**, the configuration in the `mcp.json` file should look like this:



```json
       {
         "servers": {
           "github": {
             "url": "https://api.githubcopilot.com/mcp/"
           }
         }
       }
```

5. In the `mcp.json` file, click **Auth** from the CodeLens above the server to authenticate to the server. A pop-up will come up allowing you to authenticate with your GitHub account.


### [Local server configuration example](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/extend-copilot-with-tools-and-context/extend-copilot-chat-with-mcp?tool=vscode\#local-server-configuration-example)

1. For "Server ID", type `github`.

2. For "Type", select "stdio" from the dropdown.

3. For "Command (with optional arguments)", type `docker "run", "-i", "--rm", "-e", "GITHUB_PERSONAL_ACCESS_TOKEN", "ghcr.io/github/github-mcp-server"`

4. Add an environment variable "GITHUB\_PERSONAL\_ACCESS\_TOKEN" set to your personal access token.

5. After clicking **Save**, the configuration in the `mcp.json` file should look like this:



```json
       {
         "servers": {
           "github": {
             "type": "stdio",
             "command": "docker",
             "args": [\
               "run", "-i", "--rm", "-e", "GITHUB_PERSONAL_ACCESS_TOKEN",\
               "ghcr.io/github/github-mcp-server"\
             ],
             "env": {
               "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT"
             }
           }
         }
       }
```


For more information on configuring MCP servers in Visual Studio, see [Use MCP servers in Visual Studio (Preview)](https://learn.microsoft.com/en-us/visualstudio/ide/mcp-servers?view=vs-2022) in the Visual Studio documentation.

## [Prerequisites](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/extend-copilot-with-tools-and-context/extend-copilot-chat-with-mcp?tool=vscode\#prerequisites-2)

- **Access to Copilot**. See [About GitHub Copilot](https://docs.github.com/en/copilot/get-started/about-github-copilot#get-access).

- **A compatible JetBrains IDE**. GitHub Copilot is compatible with the following IDEs:


  - IntelliJ IDEA (Ultimate, Community, Educational)
  - Android Studio
  - CLion
  - Code With Me Guest
  - DataGrip
  - DataSpell
  - GoLand
  - JetBrains Client
  - MPS
  - PhpStorm
  - PyCharm (Professional, Community, Educational)
  - Rider
  - RubyMine
  - RustRover
  - WebStorm

See the [JetBrains IDEs](https://www.jetbrains.com/products/?ref_product=copilot&ref_type=engagement&ref_style=button) tool finder to download.

- If you are a member of an organization or enterprise with a Copilot Business or Copilot Enterprise plan, the "MCP servers in Copilot" policy must be enabled in order to use MCP with Copilot.


## [Configuring MCP servers from your MCP registry](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/extend-copilot-with-tools-and-context/extend-copilot-chat-with-mcp?tool=vscode\#configuring-mcp-servers-from-your-mcp-registry)

1. In your JetBrains IDE, open Copilot Chat.
2. In the Copilot Chat window, click the  MCP icon.
3. In the MCP Registry window, find the MCP server(s) you want to add from the list of available servers.
4. Next to each MCP server you want to add, click **Install**.
5. When you are finished adding MCP servers, click **OK**.
6. In the Copilot Chat window, click the tools icon. You should now see additional tools from the MCP server(s) that you installed.

## [Configuring MCP servers manually](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/extend-copilot-with-tools-and-context/extend-copilot-chat-with-mcp?tool=vscode\#configuring-mcp-servers-manually-1)

1. In the lower right corner, click .
2. From the menu, select "Open Chat", make sure you are in Agent mode, then click the tools icon (called "Configure your MCP server") at the bottom of the chat window.
3. Click **Add MCP Tools**.
4. In the `mcp.json` file, define your MCP servers. JetBrains IDEs support both remote and local servers. Remote servers are hosted externally for easier setup and sharing, while local servers run on your local machine and can access local resources.

You can use the following configurations as examples:

### [Remote server configuration example with PAT](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/extend-copilot-with-tools-and-context/extend-copilot-chat-with-mcp?tool=vscode\#remote-server-configuration-example-with-pat)

```json
{
    "servers": {
        "github": {
            "url": "https://api.githubcopilot.com/mcp/",
            "requestInit": {
                "headers": {
                    "Authorization": "Bearer YOUR_PAT_HERE"
                }
            }
        }
    }
  }
```

### [Local server configuration example](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/extend-copilot-with-tools-and-context/extend-copilot-chat-with-mcp?tool=vscode\#local-server-configuration-example-1)

```json
{
  "servers": {
    "memory": {
      "command": "npx",
      "args": [\
        "-y",\
        "@modelcontextprotocol/server-memory"\
      ]
    }
  }
}
```

## [Prerequisites](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/extend-copilot-with-tools-and-context/extend-copilot-chat-with-mcp?tool=vscode\#prerequisites-3)

- **Access to Copilot**. See [About GitHub Copilot](https://docs.github.com/en/copilot/get-started/about-github-copilot#get-access).
- **GitHub Copilot for Xcode extension**. See [Installing the GitHub Copilot extension in your environment](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/set-up-copilot/install-copilot-extension).
- If you are a member of an organization or enterprise with a Copilot Business or Copilot Enterprise plan, the "MCP servers in Copilot" policy must be enabled in order to use MCP with Copilot.

## [Configuring MCP servers from your MCP registry](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/extend-copilot-with-tools-and-context/extend-copilot-chat-with-mcp?tool=vscode\#configuring-mcp-servers-from-your-mcp-registry-1)

1. In Xcode, open Copilot Chat.
2. In the Copilot Chat window, click the  icon to open settings.
3. In the settings window, select the **Tools** tab.
4. Next to **MCP Registry URL (Optional)**, click **Browse MCP Servers**.
5. In the MCP Registry window, find the MCP server(s) you want to add from the list of available servers.
6. Next to each MCP server you want to add, click **Install**.
7. When you are finished adding MCP servers, close the **MCP Servers Marketplace** window.
8. In the settings window, under **Available MCP Tools**, click the **>** icon to expand the list of available MCP tools. You should now see additional tools from the MCP server(s) that you installed.

## [Configuring MCP servers manually](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/extend-copilot-with-tools-and-context/extend-copilot-chat-with-mcp?tool=vscode\#configuring-mcp-servers-manually-2)

1. Open the GitHub Copilot for Xcode extension and go to "Settings".
   - Alternatively, in an active Xcode workspace, you can find the settings by clicking **Editor** in the menu bar, selecting **GitHub Copilot**, then clicking **Open GitHub Copilot for Xcode Settings**.
2. Select the **MCP** tab, then click **Edit Config**.
3. Define your MCP servers, editing `mcp.json`. Xcode supports both remote and local servers. Remote servers are hosted externally for easier setup and sharing, while local servers run on your local machine and can access local resources.

You can use the following configurations as examples:

### [Remote server configuration example with PAT](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/extend-copilot-with-tools-and-context/extend-copilot-chat-with-mcp?tool=vscode\#remote-server-configuration-example-with-pat-1)

```json
{
    "servers": {
        "github": {
            "url": "https://api.githubcopilot.com/mcp/",
            "requestInit": {
                "headers": {
                    "Authorization": "Bearer YOUR_PAT_HERE"
                }
            }
        }
    }
  }
```

### [Local server configuration example](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/extend-copilot-with-tools-and-context/extend-copilot-chat-with-mcp?tool=vscode\#local-server-configuration-example-2)

```json
{
  "servers": {
    "memory": {
      "command": "npx",
      "args": [\
        "-y",\
        "@modelcontextprotocol/server-memory"\
      ]
    }
  }
}
```

## [Prerequisites](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/extend-copilot-with-tools-and-context/extend-copilot-chat-with-mcp?tool=vscode\#prerequisites-4)

- **Access to Copilot**. See [About GitHub Copilot](https://docs.github.com/en/copilot/get-started/about-github-copilot#get-access).
- **Compatible version of Eclipse**. To use the GitHub Copilot extension, you must have Eclipse version 2024-09 or above. See the [Eclipse download page](https://www.eclipse.org/downloads/packages/).
- If you are a member of an organization or enterprise with a Copilot Business or Copilot Enterprise plan, the "MCP servers in Copilot" policy must be enabled in order to use MCP with Copilot.

## [Configuring MCP servers from your MCP registry](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/extend-copilot-with-tools-and-context/extend-copilot-chat-with-mcp?tool=vscode\#configuring-mcp-servers-from-your-mcp-registry-2)

1. In Eclipse, open Copilot Chat.
2. In the Copilot Chat window, click the  MCP icon.
3. In the MCP Registry window, find the MCP server(s) you want to add from the list of available servers.
4. Next to each MCP server you want to add, click **Install**.
5. When you are finished adding MCP servers, click **Close**.
6. In the Copilot Chat window, click the tools icon. You should now see additional tools from the MCP server(s) that you installed.

## [Configuring MCP servers manually](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/extend-copilot-with-tools-and-context/extend-copilot-chat-with-mcp?tool=vscode\#configuring-mcp-servers-manually-3)

1. Click the Copilot icon () in the status bar at the bottom of Eclipse.
2. From the menu, select **Open Chat** and, in the chat window, click the "Configure Tools..." icon.

   - Alternatively, you can select **Edit preferences**, then in the left pane, expand GitHub Copilot and click **MCP**.
3. Under "Server Configurations", define your MCP servers. Eclipse supports both remote and local servers. Remote servers are hosted externally for easier setup and sharing, while local servers run on your local machine and can access local resources.

You can use the following configurations as examples:

### [Remote server configuration example with PAT](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/extend-copilot-with-tools-and-context/extend-copilot-chat-with-mcp?tool=vscode\#remote-server-configuration-example-with-pat-2)

```json
{
    "servers": {
        "github": {
            "url": "https://api.githubcopilot.com/mcp/",
            "requestInit": {
                "headers": {
                    "Authorization": "Bearer YOUR_PAT_HERE"
                }
            }
        }
    }
  }
```

### [Local server configuration example](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/extend-copilot-with-tools-and-context/extend-copilot-chat-with-mcp?tool=vscode\#local-server-configuration-example-3)

```json
{
  "servers": {
    "memory": {
      "command": "npx",
      "args": [\
        "-y",\
        "@modelcontextprotocol/server-memory"\
      ]
    }
  }
}
```

## [Creating a new MCP server](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/extend-copilot-with-tools-and-context/extend-copilot-chat-with-mcp?tool=vscode\#creating-a-new-mcp-server)

You can create a new MCP server to fulfill your specific needs, and then integrate it with Copilot Chat. For example, you can create an MCP server that connects to a database or a web service, and then use that server in Copilot Chat to perform tasks on that database or web service.

For more information on creating and configuring your own MCP servers, see [the official MCP documentation](https://modelcontextprotocol.io/quickstart/server).

## [Further reading](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/extend-copilot-with-tools-and-context/extend-copilot-chat-with-mcp?tool=vscode\#further-reading)

- [Adding MCP servers for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers)
- [Configure MCP servers for your repository](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/configure-mcp-servers)
- [Using the GitHub MCP Server in your IDE](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/use-the-github-mcp-server)
- [Enhancing GitHub Copilot agent mode with MCP](https://docs.github.com/en/copilot/tutorials/enhance-agent-mode-with-mcp)
