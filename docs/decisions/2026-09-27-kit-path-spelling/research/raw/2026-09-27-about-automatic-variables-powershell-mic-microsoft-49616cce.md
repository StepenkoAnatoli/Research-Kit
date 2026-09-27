---
url: https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables
retrieved: 2026-09-27
command: firecrawl scrape https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: about_Automatic_Variables - PowerShell | Microsoft Learn
---
Table of contents Exit editor mode

Ask LearnAsk Learn

Reading modeTable of contents[Read in English](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6)Add to CollectionsAdd to Plans[Edit](https://github.com/MicrosoftDocs/PowerShell-Docs/blob/main/reference/7.6/Microsoft.PowerShell.Core/About/about_Automatic_Variables.md)

* * *

Copy MarkdownPrint

* * *

Note

Access to this page requires authorization. You can try [signing in](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#) or changing directories.


Access to this page requires authorization. You can try changing directories.


# about\_Automatic\_Variables

Feedback

Summarize this article for me


[Section titled: Short description](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#short-description)

## Short description

Describes variables that store state information for and are created and
maintained by PowerShell.

[Section titled: Long description](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#long-description)

## Long description

Conceptually, most of these variables are considered to be read-only. Even
though they _can_ be written to, for backward compatibility they _should not_
be written to.

Here is a list of the automatic variables in PowerShell:

- [`$$`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#section)
- [`$?`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#section-1)
- [`$^`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#section-2)
- [`$_`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#_)
- [`$args`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#args)
- [`$ConsoleFileName`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#consolefilename)
- [`$EnabledExperimentalFeatures`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#enabledexperimentalfeatures)
- [`$Error`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#error)
- [`$Event`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#event)
- [`$EventArgs`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#eventargs)
- [`$EventSubscriber`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#eventsubscriber)
- [`$ExecutionContext`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#executioncontext)
- [`$false`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#false)
- [`$foreach`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#foreach)
- [`$HOME`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#home)
- [`$Host`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#host)
- [`$input`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#input)
- [`$IsCoreCLR`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#iscoreclr)
- [`$IsLinux`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#islinux)
- [`$IsMacOS`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#ismacos)
- [`$IsWindows`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#iswindows)
- [`$LASTEXITCODE`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#lastexitcode)
- [`$Matches`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#matches)
- [`$MyInvocation`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#myinvocation)
- [`$NestedPromptLevel`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#nestedpromptlevel)
- [`$null`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#null)
- [`$PID`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#pid)
- [`$PROFILE`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#profile)
- [`$PSBoundParameters`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#psboundparameters)
- [`$PSCmdlet`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#pscmdlet)
- [`$PSCommandPath`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#pscommandpath)
- [`$PSCulture`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#psculture)
- [`$PSDebugContext`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#psdebugcontext)
- [`$PSEdition`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#psedition)
- [`$PSHOME`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#pshome)
- [`$PSItem`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#psitem)
- [`$PSScriptRoot`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#psscriptroot)
- [`$PSSenderInfo`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#pssenderinfo)
- [`$PSUICulture`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#psuiculture)
- [`$PSVersionTable`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#psversiontable)
- [`$PWD`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#pwd)
- [`$Sender`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#sender)
- [`$ShellId`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#shellid)
- [`$StackTrace`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#stacktrace)
- [`$switch`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#switch)
- [`$this`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#this)
- [`$true`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#true)

[Section titled: $](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#section)

### `$$`

Contains the last token in the last line received by the session.

[Section titled: $?](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#section-1)

### `$?`

Contains the execution status of the last command. It contains **True** if the
last command succeeded and **False** if it failed. Parse errors don't result in
execution, so they don't affect the value of `$?`.

For cmdlets and advanced functions that are run at multiple stages in a
pipeline, for example in both `process` and `end` blocks, calling
`this.WriteError()` or `$PSCmdlet.WriteError()` respectively at any point sets
`$?` to **False**, as does `this.ThrowTerminatingError()` and
`$PSCmdlet.ThrowTerminatingError()`.

The `Write-Error` cmdlet always sets `$?` to **False** immediately after it's
executed, but won't set `$?` to **False** for a function calling it:

PowerShell

Copy

```powershell
function Test-WriteError
{
    Write-Error "Bad"
    "The `$? variable is: $?"
}

Test-WriteError
"Now the `$? variable is: $?"
```

Output

Copy

```output
Test-WriteError:
Line |
   7 |  Test-WriteError
     |  ~~~~~~~~~~~~~~~
     | Bad
The $? variable is: False
Now the $? variable is: True
```

For the latter purpose, `$PSCmdlet.WriteError()` should be used instead.

For native commands (executables), `$?` is set to **True** when `$LASTEXITCODE`
is 0, and set to **False** when `$LASTEXITCODE` is any other value.

Note

Until PowerShell 7, wrapping a statement within parentheses `(...)`,
subexpression syntax `$(...)`, or an array expression `@(...)` always reset
`$?` to **True**. For example, `(Write-Error)` shows `$?` as **True**. This
behavior changed in PowerShell 7, so that `$?` always reflects the actual
success of the last command run in these expressions.

[Section titled: $^](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#section-2)

### `$^`

Contains the first token in the last line received by the session.

[Section titled: $_](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#_)

### `$_`

Same as `$PSItem`. Contains the current object in the pipeline object. You can
use this variable in commands that perform an action on every object in a
pipeline.

For more information, see [about\_PSItem](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_psitem?view=powershell-7.6).

[Section titled: $args](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#args)

### `$args`

Contains an array of values for undeclared parameters that are passed to a
function, script, or scriptblock. When you create a function, you can declare
the parameters with the `param` keyword or by adding a comma-separated list of
parameters in parentheses after the function name.

In an event action, the `$args` variable contains objects that represent the
event arguments of the event that's being processed. This variable is populated
only within the `Action` block of an event registration command. The value of
this variable can also be found in the **SourceArgs** property of the
**PSEventArgs** object that `Get-Event` returns.

[Section titled: $ConsoleFileName](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#consolefilename)

### `$ConsoleFileName`

Contains the path of the console file (`.psc1`) that was most recently used in
the session. This variable is populated when you start PowerShell with the
**PSConsoleFile** parameter or when you use the `Export-Console` cmdlet to
export snap-in names to a console file.

When you use the `Export-Console` cmdlet without parameters, it automatically
updates the console file that was most recently used in the session. You can
use this automatic variable to determine the file to update.

[Section titled: $EnabledExperimentalFeatures](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#enabledexperimentalfeatures)

### `$EnabledExperimentalFeatures`

Contains a list of names of the experimental features that are enabled.

[Section titled: $Error](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#error)

### `$Error`

Contains an array of error objects that represent the most recent errors. The
most recent error is the first error object in the array `$Error[0]`.

To prevent a non-terminating error from being added to the `$Error` array, use
the **ErrorAction** common parameter with a value of **Ignore**. For more
information, see [about\_CommonParameters](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_commonparameters?view=powershell-7.6).

[Section titled: $Event](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#event)

### `$Event`

Contains a **PSEventArgs** object that represents the event that's being
processed. This variable is populated only within the `Action` block of an
event registration command, such as `Register-ObjectEvent`. The value of this
variable is the same object that the `Get-Event` cmdlet returns. You can use
the properties of the `Event` variable, such as `$Event.TimeGenerated`, in an
`Action` scriptblock.

[Section titled: $EventArgs](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#eventargs)

### `$EventArgs`

Contains an object that represents the first event argument that derives from
**EventArgs** of the event that's being processed. This variable is populated
only within the `Action` block of an event registration command. The value of
this variable can also be found in the **SourceEventArgs** property of the
**PSEventArgs** object that `Get-Event` returns.

[Section titled: $EventSubscriber](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#eventsubscriber)

### `$EventSubscriber`

Contains a **PSEventSubscriber** object that represents the event subscriber of
the event that's being processed. This variable is populated only within the
`Action` block of an event registration command. The value of this variable is
the same object that the `Get-EventSubscriber` cmdlet returns.

[Section titled: $ExecutionContext](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#executioncontext)

### `$ExecutionContext`

Contains an **EngineIntrinsics** object that represents the execution context
of the PowerShell host. You can use this variable to find the execution objects
that are available to cmdlets.

[Section titled: $false](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#false)

### `$false`

Contains **False**. You can use this variable to represent **False** in
commands and scripts instead of using the string `"false"`. The string can be
interpreted as **True** if it's converted to a non-empty string or to a
non-zero integer.

[Section titled: $foreach](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#foreach)

### `$foreach`

Contains the enumerator (not the resulting values) of a [foreach](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_foreach?view=powershell-7.6) loop. The
`$foreach` variable exists only while the `foreach` loop is running; it's
deleted after the loop is completed.

Enumerators contain properties and methods you can use to retrieve loop values
and change the current loop iteration. For more information, see
[Using Enumerators](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#using-enumerators).

[Section titled: $HOME](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#home)

### `$HOME`

Contains the full path of the user's home directory. On Windows, this variable
uses the value of the `"$Env:USERPROFILE"` Windows environment variable,
typically `C:\Users\<UserName>`. On Unix, this variable uses the value of the
`HOME` environment variable.

Important

Windows can redirect the location of the user's profile. This means that
`$HOME` may not have the same value as `"$Env:HOMEDRIVE$Env:HOMEPATH"`.

[Section titled: $Host](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#host)

### `$Host`

Contains an object that represents the current host application for PowerShell.
You can use this variable to represent the current host in commands or to
display or change the properties of the host, such as `$Host.Version` or
`$Host.CurrentCulture`, or `$Host.UI.RawUI.BackGroundColor = "Red"`.

Note

The color settings in `$Host.PrivateData` have been replaced by the
`$PSStyle` preference variable. For more information, see
[about\_ANSI\_Terminals](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_ansi_terminals?view=powershell-7.6).

[Section titled: $input](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#input)

### `$input`

Contains an enumerator that enumerates all input that's passed to a function.
The `$input` variable is available only to functions, scriptblocks (which
are unnamed functions), and script files (which are saved scriptblocks).

- In a function without a `begin`, `process`, or `end` block, the `$input`
variable enumerates the collection of all input to the function.

- In the `begin` block, the `$input` variable contains no data.

- In the `process` block, the `$input` variable contains the current object in
the pipeline.

- In the `end` block, the `$input` variable enumerates the collection of all
input to the function.



Note



You can't use the `$input` variable inside both the `process` block and the
`end` block in the same function or scriptblock.


Since `$input` is an enumerator, accessing any of its properties causes
`$input` to no longer be available. You can store `$input` in another variable
to reuse the `$input` properties.

Enumerators contain properties and methods you can use to retrieve loop values
and change the current loop iteration. For more information, see
[Using Enumerators](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#using-enumerators).

The `$input` variable is also available to the command specified by the
`-Command` parameter of `pwsh` when invoked from the command line. The
following example is run from the Windows Command shell.

CMD

Copy

```cmd
echo Hello | pwsh -Command """$input World!"""
```

[Section titled: $IsCoreCLR](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#iscoreclr)

### `$IsCoreCLR`

Contains `$true` if the current session is running on the .NET Core Runtime
(CoreCLR). Otherwise contains `$false`.

[Section titled: $IsLinux](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#islinux)

### `$IsLinux`

Contains `$true` if the current session is running on a Linux operating system.
Otherwise contains `$false`.

[Section titled: $IsMacOS](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#ismacos)

### `$IsMacOS`

Contains `$true` if the current session is running on a macOS operating system.
Otherwise contains `$false`.

[Section titled: $IsWindows](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#iswindows)

### `$IsWindows`

Contains `$true` if the current session is running on a Windows operating
system. Otherwise contains `$false`.

[Section titled: $LASTEXITCODE](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#lastexitcode)

### `$LASTEXITCODE`

Contains the exit code of the last native program or PowerShell script that
ran.

For PowerShell scripts, the value of `$LASTEXITCODE` depends on how the script
was called and whether the `exit` keyword was used:

- When a script uses the `exit` keyword:

`$LASTEXITCODE` is set to value the specified by the `exit` keyword. For more
information, see [about\_Language\_Keywords](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_language_keywords?view=powershell-7.6#exit).

- When a script is called directly, like `./Test.ps1`, or with the
[call operator](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_operators?view=powershell-7.6#call-operator-) (`&`) like `& ./Test.ps1`:

The value of `$LASTEXITCODE` isn't changed unless:

  - The script calls another script that uses the `exit` keyword
  - The script calls a native command
  - The script uses the `exit` keyword
- When a script is called with `pwsh` using the **File** parameter,
`$LASTEXITCODE` is set to:

  - `1` if the script terminated due to an exception
  - The value specified by the `exit` keyword, if used in the script
  - `0` if the script completed successfully
- When a script is called with `pwsh` using the **Command** parameter,
`$LASTEXITCODE` is set to:

  - `1` if the script terminated due to an exception or if the result of the
    last command set `$?` to `$false`
  - `0` if the script completed successfully and the result of the last command
    set `$?` to `$true`

For more information on the **File** and **Command** parameters, see
[about\_Pwsh](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_pwsh?view=powershell-7.6).

[Section titled: $Matches](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#matches)

### `$Matches`

The `$Matches` variable works with the `-match` and `-notmatch` operators. When
you submit [scalar](https://learn.microsoft.com/en-us/powershell/scripting/learn/glossary#scalar-value) input to the `-match` or `-notmatch` operator, and
either one detects a match, they return a Boolean value and populate the
`$Matches` automatic variable with a hash table of any string values that were
matched. The `$Matches` hash table can also be populated with captures when you
use regular expressions with the `-match` operator.

For more information about the `-match` operator, see
[about\_Comparison\_Operators](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_comparison_operators?view=powershell-7.6). For more information on regular expressions,
see [about\_Regular\_Expressions](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_regular_expressions?view=powershell-7.6).

The `$Matches` variable also works in a `switch` statement with the `-Regex`
parameter. It's populated the same way as the `-match` and `-notmatch`
operators. For more information about the `switch` statement, see
[about\_Switch](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_switch?view=powershell-7.6).

Note

When `$Matches` is populated in a session, it retains the matched value until
it's overwritten by another match. If `-match` is used again and no match is
found, it doesn't reset `$Matches` to `$null`. The previously matched value
is kept in `$Matches` until another match is found.

[Section titled: $MyInvocation](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#myinvocation)

### `$MyInvocation`

Contains information about the current command, such as the name, parameters,
parameter values, and information about how the command was started, called, or
invoked, such as the name of the script that called the current command.

`$MyInvocation` is populated only for scripts, function, and scriptblocks. You
can use the information in the **System.Management.Automation.InvocationInfo**
object that `$MyInvocation` returns in the current script, such as the name of
a function (`$MyInvocation.MyCommand.Name`) to identify the current command.
This is useful for finding the name of the current script.

Beginning in PowerShell 3.0, `MyInvocation` has the following new properties.

- **PSScriptRoot** \- Contains the full path to the script that invoked the
current command. The value of this property is populated only when the caller
is a script.
- **PSCommandPath** \- Contains the full path and filename of the script that
invoked the current command. The value of this property is populated only
when the caller is a script.

Unlike the `$PSScriptRoot` and `$PSCommandPath` automatic variables, the
**PSScriptRoot** and **PSCommandPath** properties of the `$MyInvocation`
automatic variable contain information about the invoker or calling script, not
the current script.

[Section titled: $NestedPromptLevel](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#nestedpromptlevel)

### `$NestedPromptLevel`

Contains the current prompt level. A value of 0 indicates the original prompt
level. The value is incremented when you enter a nested level and decremented
when you exit it.

For example, PowerShell presents a nested command prompt when you use the
`$Host.EnterNestedPrompt` method. PowerShell also presents a nested command
prompt when you reach a breakpoint in the PowerShell debugger.

When you enter a nested prompt, PowerShell pauses the current command, saves
the execution context, and increments the value of the `$NestedPromptLevel`
variable. To create additional nested command prompts (up to 128 levels) or to
return to the original command prompt, complete the command, or type `exit`.

The `$NestedPromptLevel` variable helps you track the prompt level. You can
create an alternative PowerShell command prompt that includes this value so
that it's always visible.

[Section titled: $null](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#null)

### `$null`

`$null` is an automatic variable that contains a **null** or empty value. You
can use this variable to represent an absent or undefined value in commands and
scripts.

PowerShell treats `$null` as an object with a value, or a placeholder, so you
can use `$null` to represent an empty value in a collection of values.

For example, when `$null` is included in a collection, it's counted as one of
the objects.

PowerShell

Copy

```powershell
$a = "one", $null, "three"
$a.Count
```

Output

Copy

```output
3
```

If you pipe the `$null` variable to the `ForEach-Object` cmdlet, it generates a
value for `$null`, just as it does for the other objects

PowerShell

Copy

```powershell
"one", $null, "three" | ForEach-Object {"Hello " + $_}
```

Output

Copy

```output
Hello one
Hello
Hello three
```

As a result, you can't use `$null` to mean **no parameter value**. A parameter
value of `$null` overrides the default parameter value.

However, because PowerShell treats the `$null` variable as a placeholder, you
can use it in scripts like the following one, which wouldn't work if `$null`
were ignored.

PowerShell

Copy

```powershell
$calendar = @($null, $null, "Meeting", $null, $null, "Team Lunch", $null)
$days = "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday",
        "Friday", "Saturday"
$currentDay = 0
foreach($day in $calendar)
{
    if($day -ne $null)
    {
        "Appointment on $($days[$currentDay]): $day"
    }

    $currentDay++
}
```

Output

Copy

```output
Appointment on Tuesday: Meeting
Appointment on Friday: Team lunch
```

[Section titled: $PID](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#pid)

### `$PID`

Contains the process identifier (PID) of the process that's hosting the
current PowerShell session.

[Section titled: $PROFILE](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#profile)

### `$PROFILE`

Contains the full path of the PowerShell profile for the current user and the
current host application. You can use this variable to represent the profile in
commands. For example, you can use it in a command to determine whether a
profile has been created:

PowerShell

Copy

```powershell
Test-Path $PROFILE
```

Or, you can use it in a command to create a profile:

PowerShell

Copy

```powershell
New-Item -ItemType File -Path $PROFILE -Force
```

You can use it in a command to open the profile in **notepad.exe**:

PowerShell

Copy

```powershell
notepad.exe $PROFILE
```

[Section titled: $PSBoundParameters](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#psboundparameters)

### `$PSBoundParameters`

Contains a dictionary of the parameters that are passed to a script or function
and their current values. This variable has a value only in a scope where
parameters are declared, such as a script or function. You can use it to
display or change the current values of parameters or to pass parameter values
to another script or function.

In this example, the **Test2** function passes the `$PSBoundParameters` to the
**Test1** function. The `$PSBoundParameters` are displayed in the format of
**Key** and **Value**.

PowerShell

Copy

```powershell
function Test1 {
   param($a, $b)

   # Display the parameters in dictionary format.
   $PSBoundParameters
}

function Test2 {
   param($a, $b)

   # Run the Test1 function with $a and $b.
   Test1 @PSBoundParameters
}
```

PowerShell

Copy

```powershell
Test2 -a Power -b Shell
```

Output

Copy

```output
Key   Value
---   -----
a     Power
b     Shell
```

[Section titled: $PSCmdlet](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#pscmdlet)

### `$PSCmdlet`

Contains an object that represents the cmdlet or advanced function that's being
run.

You can use the properties and methods of the object in your cmdlet or function
code to respond to the conditions of use. For example, the **ParameterSetName**
property contains the name of the parameter set that's being used, and the
**ShouldProcess** method adds the **WhatIf** and **Confirm** parameters to the
cmdlet dynamically.

For more information about the `$PSCmdlet` automatic variable, see
[about\_Functions\_CmdletBindingAttribute](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_functions_cmdletbindingattribute?view=powershell-7.6) and
[about\_Functions\_Advanced](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_functions_advanced?view=powershell-7.6).

[Section titled: $PSCommandPath](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#pscommandpath)

### `$PSCommandPath`

Contains the full path and filename of the script that's being run. This
variable is valid in all scripts.

[Section titled: $PSCulture](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#psculture)

### `$PSCulture`

Beginning in PowerShell 7, `$PSCulture` reflects the culture of the current
PowerShell runspace (session). If the culture is changed in a PowerShell
runspace, the `$PSCulture` value for that runspace is updated.

The culture determines the display format of items such as numbers, currency,
and dates, and is stored in a **System.Globalization.CultureInfo** object. Use
`Get-Culture` to display the computer's culture. `$PSCulture` contains the
**Name** property's value.

[Section titled: $PSDebugContext](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#psdebugcontext)

### `$PSDebugContext`

While debugging, this variable contains information about the debugging
environment. Otherwise, it contains a **null** value. As a result, you can use
it to determine whether the debugger has control. When populated, it contains a
**PsDebugContext** object that has **Breakpoints** and **InvocationInfo**
properties. The **InvocationInfo** property has several useful properties,
including the **Location** property. The **Location** property indicates the
path of the script that's being debugged.

[Section titled: $PSEdition](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#psedition)

### `$PSEdition`

Contains the same value in `$PSVersionTable.PSEdition`. This variable is
available for use in module manifest files, whereas `$PSVersionTable` isn't.

[Section titled: $PSHOME](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#pshome)

### `$PSHOME`

Contains the full path of the installation directory for PowerShell, typically,
`C:\Program Files\PowerShell\7` in Windows systems. You can use this variable
in the paths of PowerShell files. For example, the following command searches
the conceptual Help topics for the word **Help**:

PowerShell

Copy

```powershell
Select-String -Pattern Help -Path $PSHOME\en-US\*.txt
```

[Section titled: $PSItem](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#psitem)

### `$PSItem`

Same as `$_`. Contains the current object in the pipeline object. You can use
this variable in commands that perform an action on every object in a pipeline.

For more information, see [about\_PSItem](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_psitem?view=powershell-7.6).

[Section titled: $PSScriptRoot](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#psscriptroot)

### `$PSScriptRoot`

Contains the full path of the executing script's parent directory.

In PowerShell 2.0, this variable is valid only in script modules (`.psm1`).
Beginning in PowerShell 3.0, it's valid in all scripts.

[Section titled: $PSSenderInfo](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#pssenderinfo)

### `$PSSenderInfo`

Contains information about the user who started the PSSession, including the
user identity and the time zone of the originating computer. This variable is
available only in PSSessions.

The `$PSSenderInfo` variable includes a user-configurable property,
**ApplicationArguments**, that by default, contains only the `$PSVersionTable`
from the originating session. To add data to the **ApplicationArguments**
property, use the **ApplicationArguments** parameter of the
`New-PSSessionOption` cmdlet.

Important

Since this property contains data explicitly provided by the client, using
this for security decisions could allow attackers to bypass authorization
controls. Never use this data for trust decisions.
[Validate all user input](https://top10proactive.owasp.org/archive/2024/the-top-10/c3-validate-input-and-handle-exceptions/) when used for other application logic.

[Section titled: $PSUICulture](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#psuiculture)

### `$PSUICulture`

Contains the name of the user interface (UI) culture that's configured in the
operating system. The UI culture determines which text strings are used for
user interface elements, such as menus and messages. This is the value of the
**System.Globalization.CultureInfo.CurrentUICulture.Name** property of the
system. To get the **System.Globalization.CultureInfo** object for the system,
use the `Get-UICulture` cmdlet.

[Section titled: $PSVersionTable](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#psversiontable)

### `$PSVersionTable`

Contains a read-only hash table that displays details about the version of
PowerShell that's running in the current session. The table includes the
following items:

- **PSVersion** \- The PowerShell version number
- **PSEdition** This property has the value of 'Desktop' for PowerShell 4 and
below as well as PowerShell 5.1 on full-featured Windows editions. This
property has the value of `Core` for PowerShell 6 and higher as well as
Windows PowerShell 5.1 on reduced-footprint editions like Windows Nano Server
or Windows IoT.
- **GitCommitId** \- The commit Id of the source files, in GitHub,
- **OS** \- Description of the operating system that PowerShell is running on.
- **Platform** \- Platform that the operating system is running on. The value on
Linux and macOS is **Unix**. See `$IsMacOS` and `$IsLinux`.
- **PSCompatibleVersions** \- Versions of PowerShell that are compatible with
the current version
- **PSRemotingProtocolVersion** \- The version of the PowerShell remote
management protocol.
- **SerializationVersion** \- The version of the serialization method
- **WSManStackVersion** \- The version number of the WS-Management stack

[Section titled: $PWD](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#pwd)

### `$PWD`

Contains a path object that represents the full path of the current directory
location for the current PowerShell runspace.

Note

PowerShell supports multiple runspaces per process. Each runspace has its own
_current directory_. This isn't the same as the current directory of the
process: `[System.Environment]::CurrentDirectory`.

[Section titled: $Sender](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#sender)

### `$Sender`

Contains the object that generated this event. This variable is populated only
within the Action block of an event registration command. The value of this
variable can also be found in the Sender property of the **PSEventArgs** object
that `Get-Event` returns.

[Section titled: $ShellId](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#shellid)

### `$ShellId`

Contains the identifier of the current shell.

[Section titled: $StackTrace](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#stacktrace)

### `$StackTrace`

Contains a stack trace for the most recent error.

[Section titled: $switch](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#switch)

### `$switch`

Contains the enumerator not the resulting values of a `switch` statement. The
`$switch` variable exists only while the `switch` statement is running; it's
deleted when the `switch` statement completes execution. For more information,
see [about\_Switch](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_switch?view=powershell-7.6).

Enumerators contain properties and methods you can use to retrieve loop values
and change the current loop iteration. For more information, see
[Using Enumerators](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#using-enumerators).

[Section titled: $this](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#this)

### `$this`

The `$this` variable is used in scriptblocks that extend classes to refer to
the instance of the class itself.

PowerShell's Extensible Type System (ETS) allows you to add properties to
classes using scriptblocks. In a scriptblock that defines a script property
or script method, the `$this` variable refers to an instance of object of the
class that's being extended. For example, PowerShell uses ETS to add the
**BaseName** property to the **FileInfo** class.

PowerShell

Copy

```powershell
PS> Get-ChildItem .\README.md | Get-Member BaseName | Format-List

TypeName   : System.IO.FileInfo
Name       : BaseName
MemberType : ScriptProperty
Definition : System.Object BaseName {get=if ($this.Extension.Length -gt 0)
             {$this.Name.Remove($this.Name.Length - $this.Extension.Length
             )}else{$this.Name};}
```

For more information, see [about\_Types.ps1xml](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_types.ps1xml?view=powershell-7.6).

In a PowerShell class, the `$this` variable refers to the instance object of
the class itself, allowing access to properties and methods defined in the
class. For more information, see [about\_Classes](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_classes?view=powershell-7.6).

The `$this` variable is also used by .NET event classes that take scriptblocks
as delegates for the event handler. In this scenario, `$this` represents the
object originating the event, known as the event sender.

[Section titled: $true](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#true)

### `$true`

Contains **True**. You can use this variable to represent **True** in commands
and scripts.

[Section titled: Using enumerators](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#using-enumerators)

## Using enumerators

The `$input`, `$foreach`, and `$switch` variables are all enumerators used to
iterate through the values processed by their containing code block.

An enumerator contains properties and methods you can use to advance or reset
iteration, or retrieve iteration values. Directly manipulating enumerators
isn't considered best practice.

- Within loops, flow control keywords [break](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_break?view=powershell-7.6) and [continue](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_continue?view=powershell-7.6) should be
preferred.

- Within functions that accept pipeline input, it's best practice to use
parameters with the **ValueFromPipeline** or
**ValueFromPipelineByPropertyName** attributes.

For more information, see [about\_Functions\_Advanced\_Parameters](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_functions_advanced_parameters?view=powershell-7.6).


[Section titled: MoveNext](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#movenext)

### MoveNext

The [MoveNext](https://learn.microsoft.com/en-us/dotnet/api/system.collections.ienumerator.movenext#system-collections-ienumerator-movenext) method advances the enumerator to the next element of the
collection. **MoveNext** returns `True` if the enumerator was successfully
advanced, `False` if the enumerator has passed the end of the collection.

Note

The **Boolean** value returned by **MoveNext** is sent to the output stream.
You can suppress the output by typecasting it to `[void]` or piping it to
[Out-Null](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/out-null?view=powershell-7.6).

PowerShell

Copy

```powershell
$input.MoveNext() | Out-Null
```

PowerShell

Copy

```powershell
[void]$input.MoveNext()
```

[Section titled: Reset](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#reset)

### Reset

The [Reset](https://learn.microsoft.com/en-us/dotnet/api/system.collections.ienumerator.reset#system-collections-ienumerator-reset) method sets the enumerator to its initial position, which is
**before** the first element in the collection.

[Section titled: Current](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#current)

### Current

The [Current](https://learn.microsoft.com/en-us/dotnet/api/system.collections.ienumerator.current#system-collections-ienumerator-current) property gets the element in the collection, or pipeline, at
the current position of the enumerator.

The **Current** property continues to return the same property until
**MoveNext** is called.

[Section titled: Examples](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#examples)

## Examples

[Section titled: Example 1: Using the $input variable](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#example-1-using-the-input-variable)

### Example 1: Using the $input variable

In the following example, accessing the `$input` variable clears the variable
until the next time the process block executes. Using the **Reset** method
resets the `$input` variable to the current pipeline value.

PowerShell

Copy

```powershell
function Test
{
    begin
    {
        $i = 0
    }

    process
    {
        "Iteration: $i"
        $i++
        "`tInput: $input"
        "`tAccess Again: $input"
        $input.Reset()
        "`tAfter Reset: $input"
    }
}

"one","two" | Test
```

Output

Copy

```output
Iteration: 0
    Input: one
    Access Again:
    After Reset: one
Iteration: 1
    Input: two
    Access Again:
    After Reset: two
```

The process block automatically advances the `$input` variable even if you
don't access it.

PowerShell

Copy

```powershell
$skip = $true
function Skip
{
    begin
    {
        $i = 0
    }

    process
    {
        "Iteration: $i"
        $i++
        if ($skip)
        {
            "`tSkipping"
            $skip = $false
        }
        else
        {
            "`tInput: $input"
        }
    }
}

"one","two" | Skip
```

Output

Copy

```output
Iteration: 0
    Skipping
Iteration: 1
    Input: two
```

[Section titled: Example 2: Using $input outside the process block](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#example-2-using-input-outside-the-process-block)

### Example 2: Using $input outside the process block

Outside of the process block the `$input` variable represents all the values
piped into the function.

- Accessing the `$input` variable clears all values.
- The **Reset** method resets the entire collection.
- The **Current** property is never populated.
- The **MoveNext** method returns false because the collection can't be
advanced.

  - Calling **MoveNext** clears out the `$input` variable.

PowerShell

Copy

```powershell
Function All
{
    "All Values: $input"
    "Access Again: $input"
    $input.Reset()
    "After Reset: $input"
    $input.MoveNext() | Out-Null
    "After MoveNext: $input"
}

"one","two","three" | All
```

Output

Copy

```output
All Values: one two three
Access Again:
After Reset: one two three
After MoveNext:
```

[Section titled: Example 3: Using the $input.Current property](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#example-3-using-the-inputcurrent-property)

### Example 3: Using the $input.Current property

With the **Current** property, the current pipeline value can be accessed
multiple times without using the **Reset** method. The process block doesn't
automatically call the **MoveNext** method.

The **Current** property is never populated unless you explicitly call
**MoveNext**. The **Current** property can be accessed multiple times inside
the process block without clearing its value.

PowerShell

Copy

```powershell
function Current
{
    begin
    {
        $i = 0
    }

    process
    {
        "Iteration: $i"
        $i++
        "`tBefore MoveNext: $($input.Current)"
        $input.MoveNext() | Out-Null
        "`tAfter MoveNext: $($input.Current)"
        "`tAccess Again: $($input.Current)"
    }
}

"one","two" | Current
```

Output

Copy

```output
Iteration: 0
    Before MoveNext:
    After MoveNext: one
    Access Again: one
Iteration: 1
    Before MoveNext:
    After MoveNext: two
    Access Again: two
```

[Section titled: Example 4: Using the $foreach variable](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#example-4-using-the-foreach-variable)

### Example 4: Using the $foreach variable

Unlike the `$input` variable, the `$foreach` variable always represents all
items in the collection when accessed directly. Use the **Current** property to
access the current collection element, and the **Reset** and **MoveNext**
methods to change its value.

Note

Each iteration of the `foreach` loop automatically calls the **MoveNext**
method.

The following loop only executes twice. In the second iteration, the collection
is moved to the third element before the iteration is complete. After the
second iteration, there are now no more values to iterate, and the loop
terminates.

The **MoveNext** property doesn't affect the variable chosen to iterate through
the collection (`$Num`).

PowerShell

Copy

```powershell
$i = 0
foreach ($num in ("one","two","three"))
{
    "Iteration: $i"
    $i++
    "`tNum: $num"
    "`tCurrent: $($foreach.Current)"

    if ($foreach.Current -eq "two")
    {
        "Before MoveNext (Current): $($foreach.Current)"
        $foreach.MoveNext() | Out-Null
        "After MoveNext (Current): $($foreach.Current)"
        "Num hasn't changed: $num"
    }
}
```

Output

Copy

```output
Iteration: 0
        Num: one
        Current: one
Iteration: 1
        Num: two
        Current: two
Before MoveNext (Current): two
After MoveNext (Current): three
Num hasn't changed: two
```

Using the **Reset** method resets the current element in the collection. The
following example loops through the first two elements _twice_ because the
**Reset** method is called. After the first two loops, the `if` statement fails
and the loop iterates through all three elements normally.

Important

This could result in an infinite loop.

PowerShell

Copy

```powershell
$stopLoop = 0
foreach ($num in ("one","two", "three"))
{
    ("`t" * $stopLoop) + "Current: $($foreach.Current)"

    if ($num -eq "two" -and $stopLoop -lt 2)
    {
        $foreach.Reset()
        ("`t" * $stopLoop) + "Reset Loop: $stopLoop"
        $stopLoop++
    }
}
```

Output

Copy

```output
Current: one
Current: two
Reset Loop: 0
        Current: one
        Current: two
        Reset Loop: 1
                Current: one
                Current: two
                Current: three
```

[Section titled: Example 5: Using the $switch variable](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#example-5-using-the-switch-variable)

### Example 5: Using the $switch variable

The `$switch` variable has the exact same rules as the `$foreach` variable. The
following example demonstrates all the enumerator concepts.

Note

Note how the **NotEvaluated** case is never executed, even though there's
no `break` statement after the **MoveNext** method.

PowerShell

Copy

```powershell
$values = "Start", "MoveNext", "NotEvaluated", "Reset", "End"
$stopInfinite = $false
switch ($values)
{
    "MoveNext" {
        "`tMoveNext"
        $switch.MoveNext() | Out-Null
        "`tAfter MoveNext: $($switch.Current)"
    }
    # This case is never evaluated.
    "NotEvaluated" {
        "`tAfterMoveNext: $($switch.Current)"
    }

    "Reset" {
        if (!$stopInfinite)
        {
            "`tReset"
            $switch.Reset()
            $stopInfinite = $true
        }
    }

    default {
        "Default (Current): $($switch.Current)"
    }
}
```

Output

Copy

```output
Default (Current): Start
    MoveNext
    After MoveNext: NotEvaluated
    Reset
Default (Current): Start
    MoveNext
    After MoveNext: NotEvaluated
Default (Current): End
```

[Section titled: See also](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#see-also)

## See also

- [about\_Functions](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_functions?view=powershell-7.6)
- [about\_Functions\_Advanced](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_functions_advanced?view=powershell-7.6)
- [about\_Functions\_Advanced\_Methods](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_functions_advanced_methods?view=powershell-7.6)
- [about\_Functions\_Advanced\_Parameters](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_functions_advanced_parameters?view=powershell-7.6)
- [about\_Functions\_OutputTypeAttribute](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_functions_outputtypeattribute?view=powershell-7.6)
- [about\_Functions\_CmdletBindingAttribute](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_functions_cmdletbindingattribute?view=powershell-7.6)
- [about\_Hash\_Tables](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_hash_tables?view=powershell-7.6)
- [about\_Preference\_Variables](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_preference_variables?view=powershell-7.6)
- [about\_Splatting](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_splatting?view=powershell-7.6)
- [about\_Variables](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_variables?view=powershell-7.6)

Reading mode disabled

Collaborate with us on GitHub


The source for this content can be found on GitHub, where you can also create and review issues and pull requests. For more information, see [our contributor guide](https://learn.microsoft.com/powershell/scripting/community/contributing/powershell-style-guide).


![](https://learn.microsoft.com/media/logos/logo-powershell-core.svg)![](https://learn.microsoft.com/media/logos/logo-powershell-core.svg)

PowerShell
feedback

PowerShell
is an open source project. Select a link to provide feedback:

[Open a documentation issue](https://github.com/MicrosoftDocs/PowerShell-Docs/issues/new?template=04-customer-feedback.yml&pageUrl=https%3A%2F%2Flearn.microsoft.com%2Fen-us%2Fpowershell%2Fmodule%2Fmicrosoft.powershell.core%2Fabout%2Fabout_automatic_variables%3Fview%3Dpowershell-7.6&pageQueryParams=%3Fview%3Dpowershell-7.6&contentSourceUrl=https%3A%2F%2Fgithub.com%2FMicrosoftDocs%2FPowerShell-Docs%2Fblob%2Fmain%2Freference%2F7.6%2FMicrosoft.PowerShell.Core%2FAbout%2Fabout_Automatic_Variables.md&documentVersionIndependentId=14a5f188-a5dd-fb59-1543-e1f03a692e66&platformId=0efa4a4e-8f8d-48fa-22fe-63541a40b78c&feedback=%0A%0A%5BEnter+feedback+here%5D%0A&author=%40sdwheeler&metadata=*+ID%3A+1d4dd190-3038-49dc-6333-15aaf6eb3e92%0A*+PlatformId%3A+0efa4a4e-8f8d-48fa-22fe-63541a40b78c+%0A*+Service%3A+**powershell**&labels=needs-triage) [Provide product feedback](https://github.com/PowerShell/PowerShell/issues/new/choose)

* * *

## Feedback

Was this page helpful?


YesNoNo

Need help with this topic?


Want to try using Ask Learn to clarify or guide you through this topic?


Ask LearnAsk Learn

Suggest a fix?

* * *

## Additional resources

* * *

- Last updated on 04/02/2026

Ask Learn is an AI assistant that can answer questions, clarify concepts, and define terms using trusted Microsoft documentation.

Please sign in to use Ask Learn.

[Sign in](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6#)
