---
url: https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/set_1
retrieved: 2026-09-27
command: firecrawl scrape https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/set_1 --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: set | Microsoft Learn
---
Table of contents Exit editor mode

Ask LearnAsk Learn

Reading modeTable of contents[Read in English](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/set_1)Add to CollectionsAdd to Plans[Edit](https://github.com/MicrosoftDocs/windowsserverdocs/blob/main/WindowsServerDocs/administration/windows-commands/set_1.md)

* * *

Copy MarkdownPrint

* * *

Note

Access to this page requires authorization. You can try [signing in](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/set_1#) or changing directories.


Access to this page requires authorization. You can try changing directories.


# set (environment variable)

- Applies to: ✅ [Windows Server 2025](https://learn.microsoft.com/windows-server/get-started/windows-server-release-info), ✅ [Windows Server 2022](https://learn.microsoft.com/windows-server/get-started/windows-server-release-info), ✅ [Windows Server 2019](https://learn.microsoft.com/windows-server/get-started/windows-server-release-info), ✅ [Windows Server 2016](https://learn.microsoft.com/windows-server/get-started/windows-server-release-info), ✅ [Windows 11](https://learn.microsoft.com/windows/release-health/supported-versions-windows-client), ✅ [Windows 10](https://learn.microsoft.com/windows/release-health/supported-versions-windows-client), ✅ [Azure Local 2311.2 and later](https://learn.microsoft.com/azure/azure-local/release-information-23h2)

Feedback

Summarize this article for me


Displays, sets, or removes cmd.exe environment variables. If used without parameters, **set** displays the current environment variable settings.

Note

This command requires command extensions, which are enabled by default.

The **set** command can also run from the Windows Recovery Console, using different parameters. For more information, see [Windows Recovery Environment (WinRE)](https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/windows-recovery-environment--windows-re--technical-reference).

[Section titled: Syntax](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/set_1#syntax)

## Syntax

Copy

```
set [<variable>=[<string>]]
set [/p] <variable>=[<promptString>]
set /a <variable>=<expression>
```

[Section titled: Parameters](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/set_1#parameters)

### Parameters

Expand table

| Parameter | Description |
| --- | --- |
| `<variable>` | Specifies the environment variable to set or modify. |
| `<string>` | Specifies the string to associate with the specified environment variable. |
| /p | Sets the value of `<variable>` to a line of input entered by the user. |
| `<promptstring>` | Specifies a message to prompt the user for input. This parameter must be used with the **/p** parameter. |
| /a | Sets `<string>` to a numerical expression that is evaluated. |
| `<expression>` | Specifies a numerical expression. |
| /? | Displays help at the command prompt. |

[Section titled: Remarks](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/set_1#remarks)

#### Remarks

- If command extensions are enabled (the default) and you run **set** with a value, it displays all of the variables that begin with that value.

- The characters `<`, `>`, `|`, `&`, and `^` are special command shell characters, and they must be preceded by the escape character (`^`) or enclosed in quotation marks when used in `<string>` (for example, "StringContaining&Symbol"). If you use quotation marks to enclose a string that contains one of the special characters, the quotation marks are set as part of the environment variable value.

- Use environment variables to control the behavior of some batch files and programs and to control the way Windows and the MS-DOS subsystem appears and works. The **set** command is often used in the **Autoexec.nt** file to set environment variables.

- If you use the **set** command without any parameters, the current environment settings are displayed. These settings usually include the **COMSPEC** and **PATH** environment variables, which are used to help find programs on disk. Two other environment variables used by Windows are **PROMPT** and **DIRCMD**.

- If you specify values for `<variable>` and `<string>`, the specified `<variable>` value is added to the environment and `<string>` is associated with that variable. If the variable already exists in the environment, the new string value replaces the old string value.

- If you specify only a variable and an equal sign (without `<string>`) for the **set** command, the `<string>` value associated with the variable is cleared (as if the variable isn't there).

- If you use the **/a** parameter, the following operators are supported, in descending order of precedence:

Expand table




| Operator | Operation performed |
| --- | --- |
| `( )` | Grouping |
| `! ~ -` | Unary |
| `* / %` | Arithmetic |
| `+ -` | Arithmetic |
| `<< >>` | Logical shift |
| `&` | Bitwise AND |
| `^` | Bitwise exclusive OR |
| `= *= /= %= += -= &= ^=` | `= <<= >>=` |
| `,` | Expression separator |

- If you use logical (`&&` or `||`) or modulus ( **%**) operators, enclose the expression string in quotation marks. Any non-numeric strings in the expression are considered environment variable names, and their values are converted to numbers before they're processed. If you specify an environment variable name that isn't defined in the current environment, a value of zero is allotted, which allows you to perform arithmetic with environment variable values without using the % to retrieve a value.

- If you run **set /a** from the command line outside of a command script, it displays the final value of the expression.

- Numeric values are decimal numbers unless prefixed by 0x for hexadecimal numbers or 0 for octal numbers. Therefore, 0x12 is the same as 18, which is the same as 022.

- Delayed environment variable expansion support is disabled by default, but you can enable or disable it by using **cmd /v**.

- When creating batch files, you can use **set** to create variables, and then use them in the same way that you would use the numbered variables **%0** through **%9**. You can also use the variables **%0** through **%9** as input for **set**.

- If you call a variable value from a batch file, enclose the value with percent signs ( **%**). For example, if your batch program creates an environment variable named _BAUD_, you can use the string associated with _BAUD_ as a replaceable parameter by typing **%baud%** at the command prompt.


[Section titled: Examples](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/set_1#examples)

## Examples

To set the value _TEST^1_ for the environment variable named `testVar`, type:

Copy

```
set testVar=TEST^^1
```

The **set** command assigns everything that follows the equal sign (=) to the value of the variable. Therefore, if you type `set testVar=TEST^1`, you'll get the following result, `testVar=TEST1`.

To set the value _TEST&1_ for the environment variable `testVar`, type:

Copy

```
set testVar=TEST^&1
```

To set an environment variable named _include_ so the string _c:\\directory_ is associated with it, type:

Copy

```
set include=c:\directory
```

You can then use the string _c:\\directory_ in batch files by enclosing the name _include_ with percent signs ( **%**). For example, you can use `dir %include%` in a batch file to display the contents of the directory associated with the _include_ environment variable. After this command is processed, the string c:\\directory replaces **%include%**.

To use the **set** command in a batch program to add a new directory to the _path_ environment variable, type:

Copy

```
@echo off
rem ADDPATH.BAT adds a new directory
rem to the path environment variable.
set path=%1;%path%
set
```

To display a list of all of the environment variables that begin with the letter _p_, type:

Copy

```
set p
```

To display a list of all of the environment variables on the current device, type:

Copy

```
set
```

[Section titled: Related links](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/set_1#related-links)

## Related links

- [Command-Line Syntax Key](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/command-line-syntax-key)

Reading mode disabled

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

- Last updated on 09/06/2023

Ask Learn is an AI assistant that can answer questions, clarify concepts, and define terms using trusted Microsoft documentation.

Please sign in to use Ask Learn.

[Sign in](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/set_1#)
