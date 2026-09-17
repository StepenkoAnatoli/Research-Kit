---
url: https://code.claude.com/docs/en/hooks
retrieved: 2026-09-13T17:48:07.871Z
date: 2026-09-13
type: P
host: code.claude.com
title: "Hooks reference - Claude Code Docs"
origin: closure: U-2/U-3 (documented, not unknown)
why: "Closes U-3: PreToolUse decision semantics. Requested as https://docs.anthropic.com/en/docs/claude-code/hooks, which redirects here; the redirect is recorded. Fetched via the agent page-fetch transport (no Firecrawl egress in this sandbox; no credits spent) and processed by lib/collect.mjs collectOne. Capture stores the cited sections verbatim (exit codes, decision control, PreToolUse) from the 33-chunk page."
command: firecrawl scrape https://code.claude.com/docs/en/hooks --only-main-content --json # transport: agent page fetch (no Firecrawl egress in this sandbox; no credits spent)
statusCode: 200
completeness: partial
omitted: "29 of 33 chunks not fetched; the capture carries the cited sections verbatim (common exit codes, PreToolUse decision control) - hook configuration, the other hook events, and the remaining reference tables are not in this file"
verification: "2026-09-13 post-collection spot-check: re-fetched chunk 16/33 live (code.claude.com/docs/en/hooks) and matched verbatim - the permissionDecision/updatedInput table, the deny > defer > ask > allow precedence sentence, the exit-2-routes-as-deny sentence, and the [settings]/[plugin:<name>]/[skill] labels (lines 68-73 in this file)."
---
> ## Documentation Index
>
> Fetch the complete documentation index at: [/docs/llms.txt](https://code.claude.com/docs/llms.txt)
>
> Use this file to discover all available pages before exploring further.

[Skip to main content](https://code.claude.com/docs/en/hooks#content-area)

[Capture note: the live page is 33 fetch-chunks long. This capture stores the sections that carry the facts cited by U-3 - the exit-code sections and the PreToolUse decision-control section - verbatim from the fetch. The URL https://docs.anthropic.com/en/docs/claude-code/hooks redirects to this page.]

## [​](https://code.claude.com/docs/en/hooks\#exit-code-2)  Exit code 2

Exit 2 means a blocking error. On [events that can block](https://code.claude.com/docs/en/hooks#exit-code-2-behavior-per-event), exit 2 blocks whether or not you print JSON: even a JSON `permissionDecision` of `"allow"` can't override it. Claude Code still reads any valid [JSON output](https://code.claude.com/docs/en/hooks#json-output) on stdout. On `Elicitation` and `ElicitationResult`, an exit-2 hook's `hookSpecificOutput` is ignored.The blocking message is the reason from your JSON's blocking decision when it makes one, and your stderr text otherwise. What the block does varies by event: `PreToolUse` blocks the tool call, `UserPromptSubmit` rejects the prompt, and so on. [Exit code 2 behavior per event](https://code.claude.com/docs/en/hooks#exit-code-2-behavior-per-event) lists the effect for every event, and each event's section says where the message goes.A hook that exits 2 while printing JSON that fails [JSON output](https://code.claude.com/docs/en/hooks#json-output) schema validation still blocks: Claude Code uses stderr as the blocking reason and records the validation failure in the debug log. Before v2.1.214, Claude Code treated that combination as a non-blocking error and the action proceeded.This script blocks `rm` commands by exiting 2 and leaves every other command to the normal permission flow:

```
#!/bin/bash
# Reads JSON input from stdin, checks the command
input=$(cat)
command=$(jq -r '.tool_input.command' <<<"$input")

if [[ "$command" == rm* ]]; then
  echo "Blocked: rm commands are not allowed" >&2
  exit 2  # Blocking error: tool call is prevented
fi

exit 0  # No decision: the normal permission flow applies
```

#### [​](https://code.claude.com/docs/en/hooks\#exit-code-2-behavior-per-event)  Exit code 2 behavior per event

Exit code 2 is the way a hook signals "stop, don't do this." The effect depends on the event, because some events represent actions that can be blocked (like a tool call that hasn't happened yet) and others represent things that already happened or can't be prevented.

| Hook event | Can block? | What happens on exit 2 |
| --- | --- | --- |
| `PreToolUse` | Yes | Blocks the tool call |
| `PermissionRequest` | No | Exit code 2 isn't honored for this event and the permission flow proceeds unchanged. Deny through the [`decision` object](https://code.claude.com/docs/en/hooks#permissionrequest-decision-control) instead |
| `UserPromptSubmit` | Yes | Blocks prompt processing and erases the prompt |
| `Stop` | Yes | Prevents Claude from stopping, continues the conversation |

#### [​](https://code.claude.com/docs/en/hooks\#decision-control)  Decision control

Not every event supports blocking or controlling behavior through JSON. The events that do each use a different set of fields to express that decision. Use this table as a quick reference before writing a hook:

| Events | Decision pattern | Key fields |
| --- | --- | --- |
| PreToolUse | `hookSpecificOutput` | `permissionDecision` (allow/deny/ask/defer), `permissionDecisionReason` |
| PreModelSwitch | `hookSpecificOutput` or top-level `decision` | `permissionDecision` (allow/deny/ask), `permissionDecisionReason` |
| PermissionRequest | `hookSpecificOutput` | `decision.behavior` (allow/deny) |

#### [​](https://code.claude.com/docs/en/hooks\#pretooluse-decision-control)  PreToolUse decision control

`PreToolUse` hooks can control whether a tool call proceeds. Unlike other hooks that use a top-level `decision` field, PreToolUse returns its decision inside a `hookSpecificOutput` object. This gives it richer control: four outcomes (allow, deny, ask, or defer) plus the ability to modify tool input before execution.

| Field | Description |
| --- | --- |
| `permissionDecision` | `"allow"` skips the permission prompt, except for the [actions no mode auto-approves](https://code.claude.com/docs/en/permission-modes#actions-no-mode-auto-approves) and for `AskUserQuestion` and `ExitPlanMode`, which need [`updatedInput` paired with it](https://code.claude.com/docs/en/hooks#allow-with-updatedinput). `"deny"` prevents the tool call. `"ask"` prompts the user to confirm. `"defer"` exits gracefully so the tool can be resumed later. [Deny and ask rules](https://code.claude.com/docs/en/permissions#manage-permissions) are still evaluated regardless of what the hook returns |
| `permissionDecisionReason` | For `"allow"` and `"ask"`, shown to the user but not Claude. For `"deny"`, shown to Claude. For `"defer"`, ignored |
| `updatedInput` | Modifies the tool's input parameters before execution. Replaces the entire input object, so include unchanged fields alongside modified ones. Claude Code evaluates permission rules and a Bash command's [auto-background eligibility](https://code.claude.com/docs/en/tools-reference#background-commands) against the input your hook returns, not the input Claude sent. Combine with `"allow"` to auto-approve, or `"ask"` to show the modified input to the user. For `"defer"`, ignored |
| `additionalContext` | String added to Claude's context alongside the tool result. Ignored when `permissionDecision` is `"defer"`. See [Add context for Claude](https://code.claude.com/docs/en/hooks#add-context-for-claude) |

When multiple PreToolUse hooks return different decisions, precedence is `deny` > `defer` > `ask` > `allow`.A hook that blocks by exiting 2 routes the same way as `"deny"`: Claude sees the stderr message as the denial reason.When a hook returns `"ask"`, the permission prompt displayed to the user includes a label identifying where the hook came from: `[settings]` for a hook from any settings file or from agent frontmatter, `[plugin:<name>]` for a plugin's hook, or `[skill]` for a hook from skill frontmatter. This helps users understand which configuration source is requesting confirmation.A hook's `"ask"` also forces a permission prompt in [auto mode](https://code.claude.com/docs/en/permission-modes#eliminate-prompts-with-auto-mode): the classifier can still deny the tool call, but it can't approve the call silently. Before v2.1.211, the classifier could approve a Bash command running outside the [sandbox](https://code.claude.com/docs/en/sandboxing) without showing the prompt the hook requested; the classifier still applied its own safety rules to that command, and a hook `"deny"` was always honored.

```
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow",
    "permissionDecisionReason": "My reason here",
    "updatedInput": {
      "field_to_modify": "new value"
    },
    "additionalContext": "Current environment: production. Proceed with caution."
  }
}
```

PreToolUse previously used top-level `decision` and `reason` fields, but these are deprecated for this event. Use `hookSpecificOutput.permissionDecision` and `hookSpecificOutput.permissionDecisionReason` instead. The deprecated values `"approve"` and `"block"` map to `"allow"` and `"deny"` respectively. Other events like PostToolUse and Stop continue to use top-level `decision` and `reason` as their current format.
