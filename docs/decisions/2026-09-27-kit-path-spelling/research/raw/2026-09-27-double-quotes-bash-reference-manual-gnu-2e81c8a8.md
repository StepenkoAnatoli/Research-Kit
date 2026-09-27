---
url: https://www.gnu.org/software/bash/manual/html_node/Double-Quotes.html
retrieved: 2026-09-27
command: firecrawl scrape https://www.gnu.org/software/bash/manual/html_node/Double-Quotes.html --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Double Quotes (Bash Reference Manual)
---
Next: [ANSI-C Quoting](https://www.gnu.org/software/bash/manual/html_node/ANSI_002dC-Quoting.html), Previous: [Single Quotes](https://www.gnu.org/software/bash/manual/html_node/Single-Quotes.html), Up: [Quoting](https://www.gnu.org/software/bash/manual/html_node/Quoting.html)   \[ [Contents](https://www.gnu.org/software/bash/manual/html_node/index.html#SEC_Contents "Table of contents")\]\[ [Index](https://www.gnu.org/software/bash/manual/html_node/Indexes.html "Index")\]

* * *

#### 3.1.2.3 Double Quotes [¶](https://www.gnu.org/software/bash/manual/html_node/Double-Quotes.html\#Double-Quotes-1)

Enclosing characters in double quotes (‘ `"`’) preserves the literal value
of all characters within the quotes, with the exception of
‘ `$`’, ‘ `` ` ``’, ‘ `\`’,
and, when history expansion is enabled, ‘ `!`’.
When the shell is in
POSIX mode (see [Bash and POSIX](https://www.gnu.org/software/bash/manual/html_node/Bash-POSIX-Mode.html)),
the ‘ `!`’ has no special meaning
within double quotes, even when history expansion is enabled.
The characters ‘ `$`’ and ‘ `` ` ``’
retain their special meaning within double quotes (see [Shell Expansions](https://www.gnu.org/software/bash/manual/html_node/Shell-Expansions.html)).
The backslash retains its special meaning only when followed by one of
the following characters:
‘ `$`’, ‘ `` ` ``’, ‘ `"`’, ‘ `\`’, or `newline`.
Within double quotes, backslashes that are followed by one of these
characters are removed.
Backslashes preceding characters without a
special meaning are left unmodified.

A double quote may be quoted within double quotes by preceding it with
a backslash.
If enabled, history expansion will be performed unless an
‘ `!`’
appearing in double quotes is escaped using a backslash.
The backslash preceding the ‘ `!`’ is not removed.

The special parameters ‘ `*`’ and ‘ `@`’ have special meaning
when in double quotes (see [Shell Parameter Expansion](https://www.gnu.org/software/bash/manual/html_node/Shell-Parameter-Expansion.html)).
