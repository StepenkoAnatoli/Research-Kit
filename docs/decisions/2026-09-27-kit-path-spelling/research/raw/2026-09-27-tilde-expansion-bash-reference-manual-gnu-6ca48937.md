---
url: https://www.gnu.org/software/bash/manual/html_node/Tilde-Expansion.html
retrieved: 2026-09-27
command: firecrawl scrape https://www.gnu.org/software/bash/manual/html_node/Tilde-Expansion.html --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Tilde Expansion (Bash Reference Manual)
---
Next: [Shell Parameter Expansion](https://www.gnu.org/software/bash/manual/html_node/Shell-Parameter-Expansion.html), Previous: [Brace Expansion](https://www.gnu.org/software/bash/manual/html_node/Brace-Expansion.html), Up: [Shell Expansions](https://www.gnu.org/software/bash/manual/html_node/Shell-Expansions.html)   \[ [Contents](https://www.gnu.org/software/bash/manual/html_node/index.html#SEC_Contents "Table of contents")\]\[ [Index](https://www.gnu.org/software/bash/manual/html_node/Indexes.html "Index")\]

* * *

#### 3.5.2 Tilde Expansion [¶](https://www.gnu.org/software/bash/manual/html_node/Tilde-Expansion.html\#Tilde-Expansion-1)

If a word begins with an unquoted tilde character (‘ `~`’), all of the
characters up to the first unquoted slash (or all characters,
if there is no unquoted slash) are considered a _tilde-prefix_.
If none of the characters in the tilde-prefix are quoted, the
characters in the tilde-prefix following the tilde are treated as a
possible _login name_.
If this login name is the null string, the tilde is replaced with the
value of the `HOME` shell variable.
If `HOME` is unset, the tilde expands to
the home directory of the user executing the shell instead.
Otherwise, the tilde-prefix is replaced with the home directory
associated with the specified login name.

If the tilde-prefix is ‘ `~+`’, the value of
the shell variable `PWD` replaces the tilde-prefix.
If the tilde-prefix is ‘ `~-`’, the shell substitutes
the value of the shell variable
`OLDPWD`, if it is set.

If the characters following the tilde in the tilde-prefix consist of a
number N, optionally prefixed by a ‘ `+`’ or a ‘ `-`’,
the tilde-prefix is replaced with the
corresponding element from the directory stack, as it would be displayed
by the `dirs` builtin invoked with the characters following tilde
in the tilde-prefix as an argument (see [The Directory Stack](https://www.gnu.org/software/bash/manual/html_node/The-Directory-Stack.html)).
If the tilde-prefix, sans the tilde, consists of a number without a
leading ‘ `+`’ or ‘ `-`’, tilde expansion assumes ‘ `+`’.

The results of tilde expansion are treated as if they were quoted, so
the replacement is not subject to word splitting and filename expansion.

If the login name is invalid, or the tilde expansion fails, the
tilde-prefix is left unchanged.

Bash checks each variable assignment
for unquoted tilde-prefixes immediately
following a ‘ `:`’ or the first ‘ `=`’,
and performs tilde expansion in these cases.
Consequently, one may use filenames with tildes in assignments to
`PATH`, `MAILPATH`, and `CDPATH`,
and the shell assigns the expanded value.

The following table shows how Bash treats unquoted tilde-prefixes:

`~`

The value of `$HOME`.

`~/foo`

`$HOME/foo`

`~fred/foo`

The directory or file `foo` in the home directory of the user
`fred`.

`~+/foo`

`$PWD/foo`

`~-/foo`

`${OLDPWD-'~-'}/foo`

`~N`

The string that would be displayed by ‘ `dirs +N`’.

`~+N`

The string that would be displayed by ‘ `dirs +N`’.

`~-N`

The string that would be displayed by ‘ `dirs -N`’.

Bash also performs tilde expansion on words satisfying the conditions of
variable assignments (see [Shell Parameters](https://www.gnu.org/software/bash/manual/html_node/Shell-Parameters.html))
when they appear as arguments to simple commands.
Bash does not do this, except for the declaration commands listed
above, when in POSIX mode.

* * *

Next: [Shell Parameter Expansion](https://www.gnu.org/software/bash/manual/html_node/Shell-Parameter-Expansion.html), Previous: [Brace Expansion](https://www.gnu.org/software/bash/manual/html_node/Brace-Expansion.html), Up: [Shell Expansions](https://www.gnu.org/software/bash/manual/html_node/Shell-Expansions.html)   \[ [Contents](https://www.gnu.org/software/bash/manual/html_node/index.html#SEC_Contents "Table of contents")\]\[ [Index](https://www.gnu.org/software/bash/manual/html_node/Indexes.html "Index")\]
