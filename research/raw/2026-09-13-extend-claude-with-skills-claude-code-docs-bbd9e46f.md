---
url: https://code.claude.com/docs/en/skills
retrieved: 2026-09-13T17:48:07.858Z
date: 2026-09-13
type: P
host: code.claude.com
title: "Extend Claude with skills - Claude Code Docs"
origin: closure: U-2/U-3 (documented, not unknown)
why: "Closes U-2: documented skill discovery roots. Fetched via the agent page-fetch transport (no Firecrawl egress in this sandbox; no credits spent) and processed by lib/collect.mjs collectOne. Capture stores chunks 0-2 of 12, which carry the cited facts (skill locations table, parent/add-dir discovery, skill-folder-as-plugin, Cowork/cloud behaviour)."
command: firecrawl scrape https://code.claude.com/docs/en/skills --only-main-content --json # transport: agent page fetch (no Firecrawl egress in this sandbox; no credits spent)
statusCode: 200
completeness: partial
omitted: "chunks 3-11 of 12 were not fetched (frontmatter reference, dynamic context, subagent execution, live-change detection, and the rest of the reference); the capture carries chunks 0-2 verbatim"
verification: "2026-09-13 post-collection spot-check: re-fetched chunk 1/12 live (code.claude.com/docs/en/skills) and matched verbatim - the Personal row ~/.claude/skills/<skill-name>/SKILL.md \"All your projects on this machine, but not Cowork or cloud sessions\" (line 100 in this file) and the skill-folder-as-plugin sentence with the workspace-trust-dialog clause (line 112). ADR-0006 and the T7 binding rest on these lines."
---
> ## Documentation Index
>
> Fetch the complete documentation index at: [/docs/llms.txt](https://code.claude.com/docs/llms.txt)
>
> Use this file to discover all available pages before exploring further.

[Skip to main content](https://code.claude.com/docs/en/skills#content-area)

Skills extend what Claude can do. Create a `SKILL.md` file with instructions, and Claude adds it to its toolkit. Claude uses skills when relevant, or you can invoke one directly with `/skill-name`.Create a skill when you keep pasting the same instructions, checklist, or multi-step procedure into chat, or when a section of CLAUDE.md has grown into a procedure rather than a fact. Unlike CLAUDE.md content, a skill's body loads only when it's used, so long reference material costs almost nothing until you need it.

For built-in commands like `/help` and `/compact`, and bundled skills like `/debug` and `/code-review`, see the [commands reference](https://code.claude.com/docs/en/commands).**Custom commands have been merged into skills.** A file at `.claude/commands/deploy.md` and a skill at `.claude/skills/deploy/SKILL.md` both create `/deploy` and work the same way. Your existing `.claude/commands/` files keep working. Skills add optional features: a directory for supporting files, frontmatter to [control whether you or Claude invokes them](https://code.claude.com/docs/en/skills#control-who-invokes-a-skill), and the ability for Claude to load them automatically when relevant.

Claude Code skills follow the [Agent Skills](https://agentskills.io/) open standard, which works across multiple AI tools. Claude Code extends the standard with additional features like [invocation control](https://code.claude.com/docs/en/skills#control-who-invokes-a-skill), [subagent execution](https://code.claude.com/docs/en/skills#run-skills-in-a-subagent), and [dynamic context injection](https://code.claude.com/docs/en/skills#inject-dynamic-context). See [Using skill frontmatter outside Claude Code](https://code.claude.com/docs/en/skills#using-skill-frontmatter-outside-claude-code) for which frontmatter fields are part of the standard and which are Claude Code extensions.

## [​](https://code.claude.com/docs/en/skills\#bundled-skills)  Bundled skills

Claude Code includes a set of bundled skills, such as `/doctor`, `/code-review`, `/batch`, `/debug`, `/loop`, and `/claude-api`. Bundled skills are prompt-based: they give Claude detailed instructions and let it orchestrate the work using its tools. Most built-in commands instead execute fixed logic directly.You invoke a bundled skill the same way as any other skill, by typing `/` followed by the skill name. Claude invokes some bundled skills automatically when relevant; others, including `/verify`, run only when you invoke them, which keeps you in control of when these longer-running checks spend time and tokens.Most bundled skills are available in every session. A few depend on a specific feature: `/workflow-authoring`, for example, is available only when [dynamic workflows](https://code.claude.com/docs/en/workflows) are enabled.To turn bundled skills off, use the [`disableBundledSkills`](https://code.claude.com/docs/en/settings-reference#disablebundledskills) setting.

The [`/doctor`](https://code.claude.com/docs/en/commands#all-commands) setup checkup stays typable when `disableBundledSkills` is on, in Claude Code v2.1.205 and later. To hide it, set the `DISABLE_DOCTOR_COMMAND` environment variable or a [`skillOverrides`](https://code.claude.com/docs/en/skills#override-skill-visibility-from-settings) entry of `"doctor": "off"`. Before v2.1.205, `/doctor` was a built-in command rather than a bundled skill.

Bundled skills are listed alongside built-in commands in the [commands reference](https://code.claude.com/docs/en/commands), marked **Skill** in the Purpose column.

## [​](https://code.claude.com/docs/en/skills\#getting-started)  Getting started

### [​](https://code.claude.com/docs/en/skills\#create-your-first-skill)  Create your first skill

This example creates a skill that summarizes the uncommitted changes in your git repository and flags anything risky. It pulls the live diff into the prompt before Claude reads it, so the response is grounded in your actual working tree rather than what Claude can guess from open files. Claude loads the skill automatically when you ask about your changes, or you can invoke it directly with `/summarize-changes`.

1

Create the skill directory

Create a directory for the skill in your personal skills folder. Personal skills are available across all your projects.

```
mkdir -p ~/.claude/skills/summarize-changes
```

2

Write SKILL.md

Every skill needs a `SKILL.md` file with two parts: YAML frontmatter between `---` markers that tells Claude when to use the skill, and markdown content with the instructions Claude follows when the skill runs. The directory name becomes the command you type, and the `description` helps Claude decide when to load the skill automatically.Save this to `~/.claude/skills/summarize-changes/SKILL.md`:

```
---
description: Summarizes uncommitted changes and flags anything risky. Use when the user asks what changed, wants a commit message, or asks to review their diff.
---

## Current changes

!`git diff HEAD`

## Instructions

Summarize the changes above in two or three bullet points, then list any risks you notice such as missing error handling, hardcoded values, or tests that need updating. If the diff is empty, say there are no uncommitted changes.
```

The ``!`git diff HEAD``` line uses [dynamic context injection](https://code.claude.com/docs/en/skills#inject-dynamic-context): Claude Code runs the command and replaces the line with its output before Claude sees the skill content, so the instructions arrive with the current diff already inlined.

3

Test the skill

Open a git project, make a small edit to any file, and start Claude Code by running `claude`. You can test the skill two ways.**Let Claude invoke it automatically** by asking something that matches the description:

```
What did I change?
```

**Or invoke it directly** with the skill name:

```
/summarize-changes
```

Either way, Claude should respond with a short summary of your edit and a list of risks.

## [​](https://code.claude.com/docs/en/skills\#where-skills-live)  Choose where skills load

Where you save a skill decides which sessions load it. Save it under your home directory to get it in every project, commit it to a repository to share it with everyone who works there, or distribute it through a plugin or managed settings to reach a whole team.

| Location | Path | Loads in |
| --- | --- | --- |
| Enterprise | `.claude/skills/<skill-name>/SKILL.md` in the [managed settings directory](https://code.claude.com/docs/en/managed-settings#delivery-mechanisms) | All users on machines where your organization deploys it |
| Personal | `~/.claude/skills/<skill-name>/SKILL.md` | All your projects on this machine, but not [Cowork or cloud sessions](https://code.claude.com/docs/en/skills#skills-in-cowork-and-cloud-sessions) |
| Project | `.claude/skills/<skill-name>/SKILL.md` | Sessions in this repository. Commit it so your team gets it too |
| Nested | `<subdir>/.claude/skills/<skill-name>/SKILL.md` | Sessions started in or below `<subdir>`. A session started above it loads the skill once Claude works on files there. See [monorepos and subdirectories](https://code.claude.com/docs/en/skills#discovery-from-parent-and-nested-directories) |
| Additional directory | `.claude/skills/<skill-name>/SKILL.md` in a directory you pass with `--add-dir` | That session. See [directories outside the project](https://code.claude.com/docs/en/skills#skills-from-additional-directories) |
| Plugin | `<plugin>/skills/<skill-name>/SKILL.md` | Wherever the [plugin](https://code.claude.com/docs/en/plugins) is enabled, as `/plugin-name:skill-name` |
| claude.ai account | Skills you enable in your claude.ai settings | Cowork and cloud sessions. See [Skills synced from claude.ai](https://code.claude.com/docs/en/skills#how-synced-skills-behave) for local sessions |

Skill folders also follow these rules:

- **Symlinked folders**: a `<skill-name>` entry in the enterprise, personal, or project location can be a symlink to a directory elsewhere on disk. Claude Code reads `SKILL.md` from the target and loads the skill once even if several locations point at the same target. Plugin skills [handle symlinks differently](https://code.claude.com/docs/en/plugins-reference#share-files-within-a-marketplace-with-symlinks).
- **Reserved name**: don't name a skill folder `synced`, in any capitalization. Claude Code uses `~/.claude/skills/synced/` for [skills downloaded from claude.ai](https://code.claude.com/docs/en/skills#where-synced-skills-load) and skips a skill you author at that name in the enterprise, personal, and project locations.
- **Command files**: a Markdown file in `.claude/commands/` is the older format and still works. It supports the same [frontmatter](https://code.claude.com/docs/en/skills#frontmatter-reference) except `name` and `paths`. To find the name you type to invoke it, see [How a skill gets its command name](https://code.claude.com/docs/en/skills#how-a-skill-gets-its-command-name). Prefer a skill for new work, since skills also support [supporting files](https://code.claude.com/docs/en/skills#add-supporting-files).
- **Skill folder as a plugin**: add a `.claude-plugin/plugin.json` to a skill folder and it loads as a [plugin](https://code.claude.com/docs/en/plugins-reference#skills-directory-plugins) named `<name>@skills-dir`, so it can bundle agents, hooks, and MCP servers. In a project's `.claude/skills/`, this requires accepting the workspace trust dialog first.

### [​](https://code.claude.com/docs/en/skills\#discovery-from-parent-and-nested-directories)  Load skills in monorepos and subdirectories

Claude Code loads project skills from `.claude/skills/` in the directory where you start it and in every parent directory up to the repository root, so starting in `packages/frontend/` still picks up skills defined at the root. When you [move the session with `/cd`](https://code.claude.com/docs/en/permissions#move-the-session-to-another-directory) on v2.1.246 or later, Claude Code adds the new directory's project skills.Skills in a `.claude/skills/` directory below where you started don't load at startup. They load the first time Claude reads or edits a file in that subdirectory and stay available for the rest of the session. Until then they don't appear in the `/` menu and you can't invoke them by name. To load them sooner, run `/add-dir` with the subdirectory's path, which requires Claude Code v2.1.257 or later.When a nested skill shares a name with another skill, both stay available. With a `deploy` skill at the repository root and another in `apps/web/.claude/skills/`:

- `/deploy` runs the root skill. Claude Code also lists the directory-qualified variants for Claude, with an instruction to invoke the one whose directory holds the files it's working on, so the nested skill still applies to work in `apps/web/`.
- `/apps/web:deploy` runs the nested skill on its own. Its description names the directory it applies to.

### [​](https://code.claude.com/docs/en/skills\#skills-from-additional-directories)  Load skills from a directory outside the project

When you add a directory with `--add-dir` or `/add-dir`, Claude Code loads the skills in that directory's `.claude/skills/`, along with its `.claude/commands/` and `.claude/agents/`. Directories the Agent SDK adds through [`additionalDirectories`](https://code.claude.com/docs/en/agent-sdk/typescript#options) in TypeScript or [`add_dirs`](https://code.claude.com/docs/en/agent-sdk/python#claudeagentoptions) in Python load the same way, because the SDK passes them as `--add-dir`. The `permissions.additionalDirectories` setting in `settings.json` grants file access only and loads none of these.Claude Code watches `.claude/skills/` in a directory you pass with `--add-dir` at launch, as [Edit a skill during a session](https://code.claude.com/docs/en/skills#live-change-detection) describes. It doesn't watch the added directory's `.claude/commands/` or `.claude/agents/`, so restart the session after changing a file there.These loads depend on the `project` [setting source](https://code.claude.com/docs/en/agent-sdk/claude-code-features#control-filesystem-settings-with-settingsources), which is on by default. A [`strictPluginOnlyCustomization`](https://code.claude.com/docs/en/settings-reference#strictpluginonlycustomization) policy, [bare mode](https://code.claude.com/docs/en/headless#start-faster-with-bare-mode), and [`--safe-mode`](https://code.claude.com/docs/en/cli-reference#cli-flags) each restrict them further, as those pages describe. See [Additional directories grant file access, not configuration](https://code.claude.com/docs/en/permissions#additional-directories-grant-file-access-not-configuration) for the full table of what an added directory loads, including `CLAUDE.md` and plugin settings.

### [​](https://code.claude.com/docs/en/skills\#skills-in-cowork-and-cloud-sessions)  Use skills in Cowork and cloud sessions

[Cowork](https://claude.com/product/cowork) sessions and [cloud sessions](https://code.claude.com/docs/en/cloud-environments#what-carries-over-from-your-setup), including [routines](https://code.claude.com/docs/en/routines), don't read `~/.claude/skills/` on your machine. Both interactive and scheduled Cowork sessions load the skills enabled for your claude.ai account, synced at session start; manage them from **Customize** in the Desktop app sidebar or from the skills settings on claude.ai. Cloud sessions additionally load project skills committed to the cloned repository's `.claude/skills/`.If a skill exists only in `~/.claude/skills/` on your machine, Claude Code reports that the skill was not found when a [routine](https://code.claude.com/docs/en/routines) invokes it, because each routine run starts as a fresh remote session. To make a personal skill available in these sessions:

- For Cowork and cloud sessions, enable the skill for your claude.ai account.
- For cloud sessions, you can instead commit the skill to the repository's `.claude/skills/`, or ship it in a plugin declared in the repository's `.claude/settings.json`. Repo-declared plugins [install at session start](https://code.claude.com/docs/en/cloud-environments#what-carries-over-from-your-setup); plugins enabled only in your user settings don't transfer.

[Desktop scheduled tasks](https://code.claude.com/docs/en/desktop-scheduled-tasks) run locally on your machine, so they do load `~/.claude/skills/`.
