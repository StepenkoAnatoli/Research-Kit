---
url: https://github.github.com/gfm/#tables-extension-
retrieved: 2026-10-03
command: firecrawl scrape https://github.github.com/gfm/#tables-extension- --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: GitHub Flavored Markdown Spec
---
# GitHub Flavored Markdown Spec

Version 0.29-gfm (2019-04-06)

This formal specification is based on the
[CommonMark Spec](http://spec.commonmark.org/) by
[John MacFarlane](http://github.com/jgm) and licensed under
[![Creative Commons BY-SA](https://i.creativecommons.org/l/by-sa/4.0/80x15.png)](http://creativecommons.org/licenses/by-sa/4.0/)

- [1Introduction](https://github.github.com/gfm/#introduction)
  - [1.1What is GitHub Flavored Markdown?](https://github.github.com/gfm/#what-is-github-flavored-markdown-)
  - [1.2What is Markdown?](https://github.github.com/gfm/#what-is-markdown-)
  - [1.3Why is a spec needed?](https://github.github.com/gfm/#why-is-a-spec-needed-)
  - [1.4About this document](https://github.github.com/gfm/#about-this-document)
- [2Preliminaries](https://github.github.com/gfm/#preliminaries)
  - [2.1Characters and lines](https://github.github.com/gfm/#characters-and-lines)
  - [2.2Tabs](https://github.github.com/gfm/#tabs)
  - [2.3Insecure characters](https://github.github.com/gfm/#insecure-characters)
- [3Blocks and inlines](https://github.github.com/gfm/#blocks-and-inlines)
  - [3.1Precedence](https://github.github.com/gfm/#precedence)
  - [3.2Container blocks and leaf blocks](https://github.github.com/gfm/#container-blocks-and-leaf-blocks)
- [4Leaf blocks](https://github.github.com/gfm/#leaf-blocks)
  - [4.1Thematic breaks](https://github.github.com/gfm/#thematic-breaks)
  - [4.2ATX headings](https://github.github.com/gfm/#atx-headings)
  - [4.3Setext headings](https://github.github.com/gfm/#setext-headings)
  - [4.4Indented code blocks](https://github.github.com/gfm/#indented-code-blocks)
  - [4.5Fenced code blocks](https://github.github.com/gfm/#fenced-code-blocks)
  - [4.6HTML blocks](https://github.github.com/gfm/#html-blocks)
  - [4.7Link reference definitions](https://github.github.com/gfm/#link-reference-definitions)
  - [4.8Paragraphs](https://github.github.com/gfm/#paragraphs)
  - [4.9Blank lines](https://github.github.com/gfm/#blank-lines)
  - [4.10Tables (extension)](https://github.github.com/gfm/#tables-extension-)
- [5Container blocks](https://github.github.com/gfm/#container-blocks)
  - [5.1Block quotes](https://github.github.com/gfm/#block-quotes)
  - [5.2List items](https://github.github.com/gfm/#list-items)
  - [5.3Task list items (extension)](https://github.github.com/gfm/#task-list-items-extension-)
  - [5.4Lists](https://github.github.com/gfm/#lists)
- [6Inlines](https://github.github.com/gfm/#inlines)
  - [6.1Backslash escapes](https://github.github.com/gfm/#backslash-escapes)
  - [6.2Entity and numeric character references](https://github.github.com/gfm/#entity-and-numeric-character-references)
  - [6.3Code spans](https://github.github.com/gfm/#code-spans)
  - [6.4Emphasis and strong emphasis](https://github.github.com/gfm/#emphasis-and-strong-emphasis)
  - [6.5Strikethrough (extension)](https://github.github.com/gfm/#strikethrough-extension-)
  - [6.6Links](https://github.github.com/gfm/#links)
  - [6.7Images](https://github.github.com/gfm/#images)
  - [6.8Autolinks](https://github.github.com/gfm/#autolinks)
  - [6.9Autolinks (extension)](https://github.github.com/gfm/#autolinks-extension-)
  - [6.10Raw HTML](https://github.github.com/gfm/#raw-html)
  - [6.11Disallowed Raw HTML (extension)](https://github.github.com/gfm/#disallowed-raw-html-extension-)
  - [6.12Hard line breaks](https://github.github.com/gfm/#hard-line-breaks)
  - [6.13Soft line breaks](https://github.github.com/gfm/#soft-line-breaks)
  - [6.14Textual content](https://github.github.com/gfm/#textual-content)
- [Appendix: A parsing strategy](https://github.github.com/gfm/#appendix-a-parsing-strategy)
  - [Overview](https://github.github.com/gfm/#overview)
  - [Phase 1: block structure](https://github.github.com/gfm/#phase-1-block-structure)
  - [Phase 2: inline structure](https://github.github.com/gfm/#phase-2-inline-structure)

# 1Introduction

## 1.1What is GitHub Flavored Markdown?

GitHub Flavored Markdown, often shortened as GFM, is the dialect of Markdown
that is currently supported for user content on GitHub.com and GitHub
Enterprise.

This formal specification, based on the CommonMark Spec, defines the syntax and
semantics of this dialect.

GFM is a strict superset of CommonMark. All the features which are supported in
GitHub user content and that are not specified on the original CommonMark Spec
are hence known as **extensions**, and highlighted as such.

While GFM supports a wide range of inputs, it’s worth noting that GitHub.com
and GitHub Enterprise perform additional post-processing and sanitization after
GFM is converted to HTML to ensure security and consistency of the website.

## 1.2What is Markdown?

Markdown is a plain text format for writing structured documents,
based on conventions for indicating formatting in email
and usenet posts. It was developed by John Gruber (with
help from Aaron Swartz) and released in 2004 in the form of a
[syntax description](http://daringfireball.net/projects/markdown/syntax)
and a Perl script (`Markdown.pl`) for converting Markdown to
HTML. In the next decade, dozens of implementations were
developed in many languages. Some extended the original
Markdown syntax with conventions for footnotes, tables, and
other document elements. Some allowed Markdown documents to be
rendered in formats other than HTML. Websites like Reddit,
StackOverflow, and GitHub had millions of people using Markdown.
And Markdown started to be used beyond the web, to author books,
articles, slide shows, letters, and lecture notes.

What distinguishes Markdown from many other lightweight markup
syntaxes, which are often easier to write, is its readability.
As Gruber writes:

> The overriding design goal for Markdown’s formatting syntax is
> to make it as readable as possible. The idea is that a
> Markdown-formatted document should be publishable as-is, as
> plain text, without looking like it’s been marked up with tags
> or formatting instructions.
> ( [http://daringfireball.net/projects/markdown/](http://daringfireball.net/projects/markdown/))

The point can be illustrated by comparing a sample of
[AsciiDoc](http://www.methods.co.nz/asciidoc/) with
an equivalent sample of Markdown. Here is a sample of
AsciiDoc from the AsciiDoc manual:

```
1. List item one.
+
List item one continued with a second paragraph followed by an
Indented block.
+
.................
$ ls *.sh
$ mv *.sh ~/tmp
.................
+
List item continued with a third paragraph.

2. List item two continued with an open block.
+
--
This paragraph is part of the preceding list item.

a. This list is nested and does not require explicit item
continuation.
+
This paragraph is part of the preceding list item.

b. List item b.

This paragraph belongs to item two of the outer list.
--
```

And here is the equivalent in Markdown:

```
1.  List item one.

    List item one continued with a second paragraph followed by an
    Indented block.

        $ ls *.sh
        $ mv *.sh ~/tmp

    List item continued with a third paragraph.

2.  List item two continued with an open block.

    This paragraph is part of the preceding list item.

    1. This list is nested and does not require explicit item continuation.

       This paragraph is part of the preceding list item.

    2. List item b.

    This paragraph belongs to item two of the outer list.
```

The AsciiDoc version is, arguably, easier to write. You don’t need
to worry about indentation. But the Markdown version is much easier
to read. The nesting of list items is apparent to the eye in the
source, not just in the processed document.

## 1.3Why is a spec needed?

John Gruber’s [canonical description of Markdown’s\\
syntax](http://daringfireball.net/projects/markdown/syntax)
does not specify the syntax unambiguously. Here are some examples of
questions it does not answer:

01. How much indentation is needed for a sublist? The spec says that
    continuation paragraphs need to be indented four spaces, but is
    not fully explicit about sublists. It is natural to think that
    they, too, must be indented four spaces, but `Markdown.pl` does
    not require that. This is hardly a “corner case,” and divergences
    between implementations on this issue often lead to surprises for
    users in real documents. (See [this comment by John\\
    Gruber](http://article.gmane.org/gmane.text.markdown.general/1997).)

02. Is a blank line needed before a block quote or heading?
    Most implementations do not require the blank line. However,
    this can lead to unexpected results in hard-wrapped text, and
    also to ambiguities in parsing (note that some implementations
    put the heading inside the blockquote, while others do not).
    (John Gruber has also spoken [in favor of requiring the blank\\
    lines](http://article.gmane.org/gmane.text.markdown.general/2146).)

03. Is a blank line needed before an indented code block?
    (`Markdown.pl` requires it, but this is not mentioned in the
    documentation, and some implementations do not require it.)


    ```markdown
    paragraph
        code?
    ```

04. What is the exact rule for determining when list items get
    wrapped in `<p>` tags? Can a list be partially “loose” and partially
    “tight”? What should we do with a list like this?


    ```markdown
1. one

2. two
3. three
```

Or this?

```markdown
1.  one
    - a

    - b
2.  two
```

(There are some relevant comments by John Gruber
[here](http://article.gmane.org/gmane.text.markdown.general/2554).)

05. Can list markers be indented? Can ordered list markers be right-aligned?


    ```markdown
 8. item 1
 9. item 2
10. item 2a
```

06. Is this one list with a thematic break in its second item,
    or two lists separated by a thematic break?


    ```markdown
    * a
    * * * * *
    * b
    ```

07. When list markers change from numbers to bullets, do we have
    two lists or one? (The Markdown syntax description suggests two,
    but the perl scripts and many other implementations produce one.)


    ```markdown
1. fee
2. fie
-  foe
-  fum
```

08. What are the precedence rules for the markers of inline structure?
    For example, is the following a valid link, or does the code span
    take precedence ?


    ```markdown
    [a backtick (`)](/url) and [another backtick (`)](/url).
    ```

09. What are the precedence rules for markers of emphasis and strong
    emphasis? For example, how should the following be parsed?


    ```markdown
    *foo *bar* baz*
    ```

10. What are the precedence rules between block-level and inline-level
    structure? For example, how should the following be parsed?


    ```markdown
- `a long code span can contain a hyphen like this
  - and it can screw things up`
```

11. Can list items include section headings? (`Markdown.pl` does not
    allow this, but does allow blockquotes to include headings.)


    ```markdown
- # Heading
```

12. Can list items be empty?


    ```markdown
    * a
    *
    * b
    ```

13. Can link references be defined inside block quotes or list items?


    ```markdown
    > Blockquote [foo].
    >
    > [foo]: /url
    ```

14. If there are multiple definitions for the same reference, which takes
    precedence?


    ```markdown
    [foo]: /url1
    [foo]: /url2

    [foo][]
    ```


In the absence of a spec, early implementers consulted `Markdown.pl`
to resolve these ambiguities. But `Markdown.pl` was quite buggy, and
gave manifestly bad results in many cases, so it was not a
satisfactory replacement for a spec.

Because there is no unambiguous spec, implementations have diverged
considerably. As a result, users are often surprised to find that
a document that renders one way on one system (say, a GitHub wiki)
renders differently on another (say, converting to docbook using
pandoc). To make matters worse, because nothing in Markdown counts
as a “syntax error,” the divergence often isn’t discovered right away.

## 1.4About this document

This document attempts to specify Markdown syntax unambiguously.
It contains many examples with side-by-side Markdown and
HTML. These are intended to double as conformance tests. An
accompanying script `spec_tests.py` can be used to run the tests
against any Markdown program:

```
python test/spec_tests.py --spec spec.txt --program PROGRAM
```

Since this document describes how Markdown is to be parsed into
an abstract syntax tree, it would have made sense to use an abstract
representation of the syntax tree instead of HTML. But HTML is capable
of representing the structural distinctions we need to make, and the
choice of HTML for the tests makes it possible to run the tests against
an implementation without writing an abstract syntax tree renderer.

This document is generated from a text file, `spec.txt`, written
in Markdown with a small extension for the side-by-side tests.
The script `tools/makespec.py` can be used to convert `spec.txt` into
HTML or CommonMark (which can then be converted into other formats).

In the examples, the `→` character is used to represent tabs.

# 2Preliminaries

## 2.1Characters and lines

Any sequence of [characters](https://github.github.com/gfm/#character) is a valid CommonMark
document.

A [character](https://github.github.com/gfm/#character) is a Unicode code point. Although some
code points (for example, combining accents) do not correspond to
characters in an intuitive sense, all code points count as characters
for purposes of this spec.

This spec does not specify an encoding; it thinks of lines as composed
of [characters](https://github.github.com/gfm/#character) rather than bytes. A conforming parser may be limited
to a certain encoding.

A [line](https://github.github.com/gfm/#line) is a sequence of zero or more [characters](https://github.github.com/gfm/#character)
other than newline (`U+000A`) or carriage return (`U+000D`),
followed by a [line ending](https://github.github.com/gfm/#line-ending) or by the end of file.

A [line ending](https://github.github.com/gfm/#line-ending) is a newline (`U+000A`), a carriage return
(`U+000D`) not followed by a newline, or a carriage return and a
following newline.

A line containing no characters, or a line containing only spaces
(`U+0020`) or tabs (`U+0009`), is called a [blank line](https://github.github.com/gfm/#blank-line).

The following definitions of character classes will be used in this spec:

A [whitespace character](https://github.github.com/gfm/#whitespace-character) is a space
(`U+0020`), tab (`U+0009`), newline (`U+000A`), line tabulation (`U+000B`),
form feed (`U+000C`), or carriage return (`U+000D`).

[Whitespace](https://github.github.com/gfm/#whitespace) is a sequence of one or more [whitespace\\
characters](https://github.github.com/gfm/#whitespace-character).

A [Unicode whitespace character](https://github.github.com/gfm/#unicode-whitespace-character) is
any code point in the Unicode `Zs` general category, or a tab (`U+0009`),
carriage return (`U+000D`), newline (`U+000A`), or form feed
(`U+000C`).

[Unicode whitespace](https://github.github.com/gfm/#unicode-whitespace) is a sequence of one
or more [Unicode whitespace characters](https://github.github.com/gfm/#unicode-whitespace-character).

A [space](https://github.github.com/gfm/#space) is `U+0020`.

A [non-whitespace character](https://github.github.com/gfm/#non-whitespace-character) is any character
that is not a [whitespace character](https://github.github.com/gfm/#whitespace-character).

An [ASCII punctuation character](https://github.github.com/gfm/#ascii-punctuation-character)
is `!`, `"`, `#`, `$`, `%`, `&`, `'`, `(`, `)`,
`*`, `+`, `,`, `-`, `.`, `/` (U+0021–2F),
`:`, `;`, `<`, `=`, `>`, `?`, `@` (U+003A–0040),
`[`, `\`, `]`, `^`, `_`, ````` (U+005B–0060),
`{`, `|`, `}`, or `~` (U+007B–007E).

A [punctuation character](https://github.github.com/gfm/#punctuation-character) is an [ASCII\\
punctuation character](https://github.github.com/gfm/#ascii-punctuation-character) or anything in
the general Unicode categories `Pc`, `Pd`, `Pe`, `Pf`, `Pi`, `Po`, or `Ps`.

## 2.2Tabs

Tabs in lines are not expanded to [spaces](https://github.github.com/gfm/#space). However,
in contexts where whitespace helps to define block structure,
tabs behave as if they were replaced by spaces with a tab stop
of 4 characters.

Thus, for example, a tab can be used instead of four spaces
in an indented code block. (Note, however, that internal
tabs are passed through as literal tabs, not expanded to
spaces.)

[Example 1](https://github.github.com/gfm/#example-1)

```markdown
→foo→baz→→bim
```

```html
<pre><code>foo→baz→→bim
</code></pre>
```

[Example 2](https://github.github.com/gfm/#example-2)

```markdown
  →foo→baz→→bim
```

```html
<pre><code>foo→baz→→bim
</code></pre>
```

[Example 3](https://github.github.com/gfm/#example-3)

```markdown
    a→a
    ὐ→a
```

```html
<pre><code>a→a
ὐ→a
</code></pre>
```

In the following example, a continuation paragraph of a list
item is indented with a tab; this has exactly the same effect
as indentation with four spaces would:

[Example 4](https://github.github.com/gfm/#example-4)

```markdown
  - foo

→bar
```

```html
<ul>
<li>
<p>foo</p>
<p>bar</p>
</li>
</ul>
```

[Example 5](https://github.github.com/gfm/#example-5)

```markdown
- foo

→→bar
```

```html
<ul>
<li>
<p>foo</p>
<pre><code>  bar
</code></pre>
</li>
</ul>
```

Normally the `>` that begins a block quote may be followed
optionally by a space, which is not considered part of the
content. In the following case `>` is followed by a tab,
which is treated as if it were expanded into three spaces.
Since one of these spaces is considered part of the
delimiter, `foo` is considered to be indented six spaces
inside the block quote context, so we get an indented
code block starting with two spaces.

[Example 6](https://github.github.com/gfm/#example-6)

```markdown
>→→foo
```

```html
<blockquote>
<pre><code>  foo
</code></pre>
</blockquote>
```

[Example 7](https://github.github.com/gfm/#example-7)

```markdown
-→→foo
```

```html
<ul>
<li>
<pre><code>  foo
</code></pre>
</li>
</ul>
```

[Example 8](https://github.github.com/gfm/#example-8)

```markdown
    foo
→bar
```

```html
<pre><code>foo
bar
</code></pre>
```

[Example 9](https://github.github.com/gfm/#example-9)

```markdown
 - foo
   - bar
→ - baz
```

```html
<ul>
<li>foo
<ul>
<li>bar
<ul>
<li>baz</li>
</ul>
</li>
</ul>
</li>
</ul>
```

[Example 10](https://github.github.com/gfm/#example-10)

```markdown
#→Foo
```

```html
<h1>Foo</h1>
```

[Example 11](https://github.github.com/gfm/#example-11)

```markdown
*→*→*→
```

```html
<hr />
```

## 2.3Insecure characters

For security reasons, the Unicode character `U+0000` must be replaced
with the REPLACEMENT CHARACTER (`U+FFFD`).

# 3Blocks and inlines

We can think of a document as a sequence of
[blocks](https://github.github.com/gfm/#blocks)—structural elements like paragraphs, block
quotations, lists, headings, rules, and code blocks. Some blocks (like
block quotes and list items) contain other blocks; others (like
headings and paragraphs) contain [inline](https://github.github.com/gfm/#inline) content—text,
links, emphasized text, images, code spans, and so on.

## 3.1Precedence

Indicators of block structure always take precedence over indicators
of inline structure. So, for example, the following is a list with
two items, not a list with one item containing a code span:

[Example 12](https://github.github.com/gfm/#example-12)

```markdown
- `one
- two`
```

```html
<ul>
<li>`one</li>
<li>two`</li>
</ul>
```

This means that parsing can proceed in two steps: first, the block
structure of the document can be discerned; second, text lines inside
paragraphs, headings, and other block constructs can be parsed for inline
structure. The second step requires information about link reference
definitions that will be available only at the end of the first
step. Note that the first step requires processing lines in sequence,
but the second can be parallelized, since the inline parsing of
one block element does not affect the inline parsing of any other.

## 3.2Container blocks and leaf blocks

We can divide blocks into two types:
[container blocks](https://github.github.com/gfm/#container-blocks),
which can contain other blocks, and [leaf blocks](https://github.github.com/gfm/#leaf-blocks),
which cannot.

# 4Leaf blocks

This section describes the different kinds of leaf block that make up a
Markdown document.

## 4.1Thematic breaks

A line consisting of 0-3 spaces of indentation, followed by a sequence
of three or more matching `-`, `_`, or `*` characters, each followed
optionally by any number of spaces or tabs, forms a
[thematic break](https://github.github.com/gfm/#thematic-break).

[Example 13](https://github.github.com/gfm/#example-13)

```markdown
***
---
___
```

```html
<hr />
<hr />
<hr />
```

Wrong characters:

[Example 14](https://github.github.com/gfm/#example-14)

```markdown
+++
```

```html
<p>+++</p>
```

[Example 15](https://github.github.com/gfm/#example-15)

```markdown
===
```

```html
<p>===</p>
```

Not enough characters:

[Example 16](https://github.github.com/gfm/#example-16)

```markdown
--
**
__
```

```html
<p>--
**
__</p>
```

One to three spaces indent are allowed:

[Example 17](https://github.github.com/gfm/#example-17)

```markdown
 ***
  ***
   ***
```

```html
<hr />
<hr />
<hr />
```

Four spaces is too many:

[Example 18](https://github.github.com/gfm/#example-18)

```markdown
    ***
```

```html
<pre><code>***
</code></pre>
```

[Example 19](https://github.github.com/gfm/#example-19)

```markdown
Foo
    ***
```

```html
<p>Foo
***</p>
```

More than three characters may be used:

[Example 20](https://github.github.com/gfm/#example-20)

```markdown
_____________________________________
```

```html
<hr />
```

Spaces are allowed between the characters:

[Example 21](https://github.github.com/gfm/#example-21)

```markdown
 - - -
```

```html
<hr />
```

[Example 22](https://github.github.com/gfm/#example-22)

```markdown
 **  * ** * ** * **
```

```html
<hr />
```

[Example 23](https://github.github.com/gfm/#example-23)

```markdown
-     -      -      -
```

```html
<hr />
```

Spaces are allowed at the end:

[Example 24](https://github.github.com/gfm/#example-24)

```markdown
- - - -
```

```html
<hr />
```

However, no other characters may occur in the line:

[Example 25](https://github.github.com/gfm/#example-25)

```markdown
_ _ _ _ a

a------

---a---
```

```html
<p>_ _ _ _ a</p>
<p>a------</p>
<p>---a---</p>
```

It is required that all of the [non-whitespace characters](https://github.github.com/gfm/#non-whitespace-character) be the same.
So, this is not a thematic break:

[Example 26](https://github.github.com/gfm/#example-26)

```markdown
 *-*
```

```html
<p><em>-</em></p>
```

Thematic breaks do not need blank lines before or after:

[Example 27](https://github.github.com/gfm/#example-27)

```markdown
- foo
***
- bar
```

```html
<ul>
<li>foo</li>
</ul>
<hr />
<ul>
<li>bar</li>
</ul>
```

Thematic breaks can interrupt a paragraph:

[Example 28](https://github.github.com/gfm/#example-28)

```markdown
Foo
***
bar
```

```html
<p>Foo</p>
<hr />
<p>bar</p>
```

If a line of dashes that meets the above conditions for being a
thematic break could also be interpreted as the underline of a [setext\\
heading](https://github.github.com/gfm/#setext-heading), the interpretation as a
[setext heading](https://github.github.com/gfm/#setext-heading) takes precedence. Thus, for example,
this is a setext heading, not a paragraph followed by a thematic break:

[Example 29](https://github.github.com/gfm/#example-29)

```markdown
Foo
---
bar
```

```html
<h2>Foo</h2>
<p>bar</p>
```

When both a thematic break and a list item are possible
interpretations of a line, the thematic break takes precedence:

[Example 30](https://github.github.com/gfm/#example-30)

```markdown
* Foo
* * *
* Bar
```

```html
<ul>
<li>Foo</li>
</ul>
<hr />
<ul>
<li>Bar</li>
</ul>
```

If you want a thematic break in a list item, use a different bullet:

[Example 31](https://github.github.com/gfm/#example-31)

```markdown
- Foo
- * * *
```

```html
<ul>
<li>Foo</li>
<li>
<hr />
</li>
</ul>
```

## 4.2ATX headings

An [ATX heading](https://github.github.com/gfm/#atx-heading)
consists of a string of characters, parsed as inline content, between an
opening sequence of 1–6 unescaped `#` characters and an optional
closing sequence of any number of unescaped `#` characters.
The opening sequence of `#` characters must be followed by a
[space](https://github.github.com/gfm/#space) or by the end of line. The optional closing sequence of `#`s must be
preceded by a [space](https://github.github.com/gfm/#space) and may be followed by spaces only. The opening
`#` character may be indented 0-3 spaces. The raw contents of the
heading are stripped of leading and trailing spaces before being parsed
as inline content. The heading level is equal to the number of `#`
characters in the opening sequence.

Simple headings:

[Example 32](https://github.github.com/gfm/#example-32)

```markdown
# foo
## foo
### foo
#### foo
##### foo
###### foo
```

```html
<h1>foo</h1>
<h2>foo</h2>
<h3>foo</h3>
<h4>foo</h4>
<h5>foo</h5>
<h6>foo</h6>
```

More than six `#` characters is not a heading:

[Example 33](https://github.github.com/gfm/#example-33)

```markdown
####### foo
```

```html
<p>####### foo</p>
```

At least one space is required between the `#` characters and the
heading’s contents, unless the heading is empty. Note that many
implementations currently do not require the space. However, the
space was required by the
[original ATX implementation](http://www.aaronsw.com/2002/atx/atx.py),
and it helps prevent things like the following from being parsed as
headings:

[Example 34](https://github.github.com/gfm/#example-34)

```markdown
#5 bolt

#hashtag
```

```html
<p>#5 bolt</p>
<p>#hashtag</p>
```

This is not a heading, because the first `#` is escaped:

[Example 35](https://github.github.com/gfm/#example-35)

```markdown
\## foo
```

```html
<p>## foo</p>
```

Contents are parsed as inlines:

[Example 36](https://github.github.com/gfm/#example-36)

```markdown
# foo *bar* \*baz\*
```

```html
<h1>foo <em>bar</em> *baz*</h1>
```

Leading and trailing [whitespace](https://github.github.com/gfm/#whitespace) is ignored in parsing inline content:

[Example 37](https://github.github.com/gfm/#example-37)

```markdown
#                  foo
```

```html
<h1>foo</h1>
```

One to three spaces indentation are allowed:

[Example 38](https://github.github.com/gfm/#example-38)

```markdown
 ### foo
  ## foo
   # foo
```

```html
<h3>foo</h3>
<h2>foo</h2>
<h1>foo</h1>
```

Four spaces are too much:

[Example 39](https://github.github.com/gfm/#example-39)

```markdown
    # foo
```

```html
<pre><code># foo
</code></pre>
```

[Example 40](https://github.github.com/gfm/#example-40)

```markdown
foo
    # bar
```

```html
<p>foo
# bar</p>
```

A closing sequence of `#` characters is optional:

[Example 41](https://github.github.com/gfm/#example-41)

```markdown
## foo ##
  ###   bar    ###
```

```html
<h2>foo</h2>
<h3>bar</h3>
```

It need not be the same length as the opening sequence:

[Example 42](https://github.github.com/gfm/#example-42)

```markdown
# foo ##################################
##### foo ##
```

```html
<h1>foo</h1>
<h5>foo</h5>
```

Spaces are allowed after the closing sequence:

[Example 43](https://github.github.com/gfm/#example-43)

```markdown
### foo ###
```

```html
<h3>foo</h3>
```

A sequence of `#` characters with anything but [spaces](https://github.github.com/gfm/#space) following it
is not a closing sequence, but counts as part of the contents of the
heading:

[Example 44](https://github.github.com/gfm/#example-44)

```markdown
### foo ### b
```

```html
<h3>foo ### b</h3>
```

The closing sequence must be preceded by a space:

[Example 45](https://github.github.com/gfm/#example-45)

```markdown
# foo#
```

```html
<h1>foo#</h1>
```

Backslash-escaped `#` characters do not count as part
of the closing sequence:

[Example 46](https://github.github.com/gfm/#example-46)

```markdown
### foo \###
## foo #\##
# foo \#
```

```html
<h3>foo ###</h3>
<h2>foo ###</h2>
<h1>foo #</h1>
```

ATX headings need not be separated from surrounding content by blank
lines, and they can interrupt paragraphs:

[Example 47](https://github.github.com/gfm/#example-47)

```markdown
****
## foo
****
```

```html
<hr />
<h2>foo</h2>
<hr />
```

[Example 48](https://github.github.com/gfm/#example-48)

```markdown
Foo bar
# baz
Bar foo
```

```html
<p>Foo bar</p>
<h1>baz</h1>
<p>Bar foo</p>
```

ATX headings can be empty:

[Example 49](https://github.github.com/gfm/#example-49)

```markdown
##
#
### ###
```

```html
<h2></h2>
<h1></h1>
<h3></h3>
```

## 4.3Setext headings

A [setext heading](https://github.github.com/gfm/#setext-heading) consists of one or more
lines of text, each containing at least one [non-whitespace\\
character](https://github.github.com/gfm/#non-whitespace-character), with no more than 3 spaces indentation, followed by
a [setext heading underline](https://github.github.com/gfm/#setext-heading-underline). The lines of text must be such
that, were they not followed by the setext heading underline,
they would be interpreted as a paragraph: they cannot be
interpretable as a [code fence](https://github.github.com/gfm/#code-fence), [ATX heading](https://github.github.com/gfm/#atx-headings),
[block quote](https://github.github.com/gfm/#block-quotes), [thematic break](https://github.github.com/gfm/#thematic-break),
[list item](https://github.github.com/gfm/#list-items), or [HTML block](https://github.github.com/gfm/#html-blocks).

A [setext heading underline](https://github.github.com/gfm/#setext-heading-underline) is a sequence of
`=` characters or a sequence of `-` characters, with no more than 3
spaces indentation and any number of trailing spaces. If a line
containing a single `-` can be interpreted as an
empty [list items](https://github.github.com/gfm/#list-items), it should be interpreted this way
and not as a [setext heading underline](https://github.github.com/gfm/#setext-heading-underline).

The heading is a level 1 heading if `=` characters are used in
the [setext heading underline](https://github.github.com/gfm/#setext-heading-underline), and a level 2 heading if `-`
characters are used. The contents of the heading are the result
of parsing the preceding lines of text as CommonMark inline
content.

In general, a setext heading need not be preceded or followed by a
blank line. However, it cannot interrupt a paragraph, so when a
setext heading comes after a paragraph, a blank line is needed between
them.

Simple examples:

[Example 50](https://github.github.com/gfm/#example-50)

```markdown
Foo *bar*
=========

Foo *bar*
---------
```

```html
<h1>Foo <em>bar</em></h1>
<h2>Foo <em>bar</em></h2>
```

The content of the header may span more than one line:

[Example 51](https://github.github.com/gfm/#example-51)

```markdown
Foo *bar
baz*
====
```

```html
<h1>Foo <em>bar
baz</em></h1>
```

The contents are the result of parsing the headings’s raw
content as inlines. The heading’s raw content is formed by
concatenating the lines and removing initial and final
[whitespace](https://github.github.com/gfm/#whitespace).

[Example 52](https://github.github.com/gfm/#example-52)

```markdown
  Foo *bar
baz*→
====
```

```html
<h1>Foo <em>bar
baz</em></h1>
```

The underlining can be any length:

[Example 53](https://github.github.com/gfm/#example-53)

```markdown
Foo
-------------------------

Foo
=
```

```html
<h2>Foo</h2>
<h1>Foo</h1>
```

The heading content can be indented up to three spaces, and need
not line up with the underlining:

[Example 54](https://github.github.com/gfm/#example-54)

```markdown
   Foo
---

  Foo
-----

  Foo
  ===
```

```html
<h2>Foo</h2>
<h2>Foo</h2>
<h1>Foo</h1>
```

Four spaces indent is too much:

[Example 55](https://github.github.com/gfm/#example-55)

```markdown
    Foo
    ---

    Foo
---
```

```html
<pre><code>Foo
---

Foo
</code></pre>
<hr />
```

The setext heading underline can be indented up to three spaces, and
may have trailing spaces:

[Example 56](https://github.github.com/gfm/#example-56)

```markdown
Foo
   ----
```

```html
<h2>Foo</h2>
```

Four spaces is too much:

[Example 57](https://github.github.com/gfm/#example-57)

```markdown
Foo
    ---
```

```html
<p>Foo
---</p>
```

The setext heading underline cannot contain internal spaces:

[Example 58](https://github.github.com/gfm/#example-58)

```markdown
Foo
= =

Foo
--- -
```

```html
<p>Foo
= =</p>
<p>Foo</p>
<hr />
```

Trailing spaces in the content line do not cause a line break:

[Example 59](https://github.github.com/gfm/#example-59)

```markdown
Foo
-----
```

```html
<h2>Foo</h2>
```

Nor does a backslash at the end:

[Example 60](https://github.github.com/gfm/#example-60)

```markdown
Foo\
----
```

```html
<h2>Foo\</h2>
```

Since indicators of block structure take precedence over
indicators of inline structure, the following are setext headings:

[Example 61](https://github.github.com/gfm/#example-61)

```markdown
`Foo
----
`

<a title="a lot
---
of dashes"/>
```

```html
<h2>`Foo</h2>
<p>`</p>
<h2>&lt;a title=&quot;a lot</h2>
<p>of dashes&quot;/&gt;</p>
```

The setext heading underline cannot be a [lazy continuation\\
line](https://github.github.com/gfm/#lazy-continuation-line) in a list item or block quote:

[Example 62](https://github.github.com/gfm/#example-62)

```markdown
> Foo
---
```

```html
<blockquote>
<p>Foo</p>
</blockquote>
<hr />
```

[Example 63](https://github.github.com/gfm/#example-63)

```markdown
> foo
bar
===
```

```html
<blockquote>
<p>foo
bar
===</p>
</blockquote>
```

[Example 64](https://github.github.com/gfm/#example-64)

```markdown
- Foo
---
```

```html
<ul>
<li>Foo</li>
</ul>
<hr />
```

A blank line is needed between a paragraph and a following
setext heading, since otherwise the paragraph becomes part
of the heading’s content:

[Example 65](https://github.github.com/gfm/#example-65)

```markdown
Foo
Bar
---
```

```html
<h2>Foo
Bar</h2>
```

But in general a blank line is not required before or after
setext headings:

[Example 66](https://github.github.com/gfm/#example-66)

```markdown
---
Foo
---
Bar
---
Baz
```

```html
<hr />
<h2>Foo</h2>
<h2>Bar</h2>
<p>Baz</p>
```

Setext headings cannot be empty:

[Example 67](https://github.github.com/gfm/#example-67)

```markdown

====
```

```html
<p>====</p>
```

Setext heading text lines must not be interpretable as block
constructs other than paragraphs. So, the line of dashes
in these examples gets interpreted as a thematic break:

[Example 68](https://github.github.com/gfm/#example-68)

```markdown
---
---
```

```html
<hr />
<hr />
```

[Example 69](https://github.github.com/gfm/#example-69)

```markdown
- foo
-----
```

```html
<ul>
<li>foo</li>
</ul>
<hr />
```

[Example 70](https://github.github.com/gfm/#example-70)

```markdown
    foo
---
```

```html
<pre><code>foo
</code></pre>
<hr />
```

[Example 71](https://github.github.com/gfm/#example-71)

```markdown
> foo
-----
```

```html
<blockquote>
<p>foo</p>
</blockquote>
<hr />
```

If you want a heading with `> foo` as its literal text, you can
use backslash escapes:

[Example 72](https://github.github.com/gfm/#example-72)

```markdown
\> foo
------
```

```html
<h2>&gt; foo</h2>
```

**Compatibility note:** Most existing Markdown implementations
do not allow the text of setext headings to span multiple lines.
But there is no consensus about how to interpret

```markdown
Foo
bar
---
baz
```

One can find four different interpretations:

1. paragraph “Foo”, heading “bar”, paragraph “baz”
2. paragraph “Foo bar”, thematic break, paragraph “baz”
3. paragraph “Foo bar — baz”
4. heading “Foo bar”, paragraph “baz”

We find interpretation 4 most natural, and interpretation 4
increases the expressive power of CommonMark, by allowing
multiline headings. Authors who want interpretation 1 can
put a blank line after the first paragraph:

[Example 73](https://github.github.com/gfm/#example-73)

```markdown
Foo

bar
---
baz
```

```html
<p>Foo</p>
<h2>bar</h2>
<p>baz</p>
```

Authors who want interpretation 2 can put blank lines around
the thematic break,

[Example 74](https://github.github.com/gfm/#example-74)

```markdown
Foo
bar

---

baz
```

```html
<p>Foo
bar</p>
<hr />
<p>baz</p>
```

or use a thematic break that cannot count as a [setext heading\\
underline](https://github.github.com/gfm/#setext-heading-underline), such as

[Example 75](https://github.github.com/gfm/#example-75)

```markdown
Foo
bar
* * *
baz
```

```html
<p>Foo
bar</p>
<hr />
<p>baz</p>
```

Authors who want interpretation 3 can use backslash escapes:

[Example 76](https://github.github.com/gfm/#example-76)

```markdown
Foo
bar
\---
baz
```

```html
<p>Foo
bar
---
baz</p>
```

## 4.4Indented code blocks

An [indented code block](https://github.github.com/gfm/#indented-code-block) is composed of one or more
[indented chunks](https://github.github.com/gfm/#indented-chunk) separated by blank lines.
An [indented chunk](https://github.github.com/gfm/#indented-chunk) is a sequence of non-blank lines,
each indented four or more spaces. The contents of the code block are
the literal contents of the lines, including trailing
[line endings](https://github.github.com/gfm/#line-ending), minus four spaces of indentation.
An indented code block has no [info string](https://github.github.com/gfm/#info-string).

An indented code block cannot interrupt a paragraph, so there must be
a blank line between a paragraph and a following indented code block.
(A blank line is not needed, however, between a code block and a following
paragraph.)

[Example 77](https://github.github.com/gfm/#example-77)

```markdown
    a simple
      indented code block
```

```html
<pre><code>a simple
  indented code block
</code></pre>
```

If there is any ambiguity between an interpretation of indentation
as a code block and as indicating that material belongs to a [list\\
item](https://github.github.com/gfm/#list-items), the list item interpretation takes precedence:

[Example 78](https://github.github.com/gfm/#example-78)

```markdown
  - foo

    bar
```

```html
<ul>
<li>
<p>foo</p>
<p>bar</p>
</li>
</ul>
```

[Example 79](https://github.github.com/gfm/#example-79)

```markdown
1.  foo

    - bar
```

```html
<ol>
<li>
<p>foo</p>
<ul>
<li>bar</li>
</ul>
</li>
</ol>
```

The contents of a code block are literal text, and do not get parsed
as Markdown:

[Example 80](https://github.github.com/gfm/#example-80)

```markdown
    <a/>
    *hi*

    - one
```

```html
<pre><code>&lt;a/&gt;
*hi*

- one
</code></pre>
```

Here we have three chunks separated by blank lines:

[Example 81](https://github.github.com/gfm/#example-81)

```markdown
    chunk1

    chunk2



    chunk3
```

```html
<pre><code>chunk1

chunk2

chunk3
</code></pre>
```

Any initial spaces beyond four will be included in the content, even
in interior blank lines:

[Example 82](https://github.github.com/gfm/#example-82)

```markdown
    chunk1

      chunk2
```

```html
<pre><code>chunk1

  chunk2
</code></pre>
```

An indented code block cannot interrupt a paragraph. (This
allows hanging indents and the like.)

[Example 83](https://github.github.com/gfm/#example-83)

```markdown
Foo
    bar
```

```html
<p>Foo
bar</p>
```

However, any non-blank line with fewer than four leading spaces ends
the code block immediately. So a paragraph may occur immediately
after indented code:

[Example 84](https://github.github.com/gfm/#example-84)

```markdown
    foo
bar
```

```html
<pre><code>foo
</code></pre>
<p>bar</p>
```

And indented code can occur immediately before and after other kinds of
blocks:

[Example 85](https://github.github.com/gfm/#example-85)

```markdown
# Heading
    foo
Heading
------
    foo
----
```

```html
<h1>Heading</h1>
<pre><code>foo
</code></pre>
<h2>Heading</h2>
<pre><code>foo
</code></pre>
<hr />
```

The first line can be indented more than four spaces:

[Example 86](https://github.github.com/gfm/#example-86)

```markdown
        foo
    bar
```

```html
<pre><code>    foo
bar
</code></pre>
```

Blank lines preceding or following an indented code block
are not included in it:

[Example 87](https://github.github.com/gfm/#example-87)

```markdown


    foo

```

```html
<pre><code>foo
</code></pre>
```

Trailing spaces are included in the code block’s content:

[Example 88](https://github.github.com/gfm/#example-88)

```markdown
    foo
```

```html
<pre><code>foo
</code></pre>
```

## 4.5Fenced code blocks

A [code fence](https://github.github.com/gfm/#code-fence) is a sequence
of at least three consecutive backtick characters (`````) or
tildes (`~`). (Tildes and backticks cannot be mixed.)
A [fenced code block](https://github.github.com/gfm/#fenced-code-block)
begins with a code fence, indented no more than three spaces.

The line with the opening code fence may optionally contain some text
following the code fence; this is trimmed of leading and trailing
whitespace and called the [info string](https://github.github.com/gfm/#info-string). If the [info string](https://github.github.com/gfm/#info-string) comes
after a backtick fence, it may not contain any backtick
characters. (The reason for this restriction is that otherwise
some inline code would be incorrectly interpreted as the
beginning of a fenced code block.)

The content of the code block consists of all subsequent lines, until
a closing [code fence](https://github.github.com/gfm/#code-fence) of the same type as the code block
began with (backticks or tildes), and with at least as many backticks
or tildes as the opening code fence. If the leading code fence is
indented N spaces, then up to N spaces of indentation are removed from
each line of the content (if present). (If a content line is not
indented, it is preserved unchanged. If it is indented less than N
spaces, all of the indentation is removed.)

The closing code fence may be indented up to three spaces, and may be
followed only by spaces, which are ignored. If the end of the
containing block (or document) is reached and no closing code fence
has been found, the code block contains all of the lines after the
opening code fence until the end of the containing block (or
document). (An alternative spec would require backtracking in the
event that a closing code fence is not found. But this makes parsing
much less efficient, and there seems to be no real down side to the
behavior described here.)

A fenced code block may interrupt a paragraph, and does not require
a blank line either before or after.

The content of a code fence is treated as literal text, not parsed
as inlines. The first word of the [info string](https://github.github.com/gfm/#info-string) is typically used to
specify the language of the code sample, and rendered in the `class`
attribute of the `code` tag. However, this spec does not mandate any
particular treatment of the [info string](https://github.github.com/gfm/#info-string).

Here is a simple example with backticks:

[Example 89](https://github.github.com/gfm/#example-89)

````markdown
```
<
>
```
````

```html
<pre><code>&lt;
 &gt;
</code></pre>
```

With tildes:

[Example 90](https://github.github.com/gfm/#example-90)

```markdown
~~~
<
 >
~~~
```

```html
<pre><code>&lt;
 &gt;
</code></pre>
```

Fewer than three backticks is not enough:

[Example 91](https://github.github.com/gfm/#example-91)

```markdown
``
foo
``
```

```html
<p><code>foo</code></p>
```

The closing code fence must use the same character as the opening
fence:

[Example 92](https://github.github.com/gfm/#example-92)

````markdown
```
aaa
~~~
```
````

```html
<pre><code>aaa
~~~
</code></pre>
```

[Example 93](https://github.github.com/gfm/#example-93)

````markdown
~~~
aaa
```
~~~
````

````html
<pre><code>aaa
```
</code></pre>
````

The closing code fence must be at least as long as the opening fence:

[Example 94](https://github.github.com/gfm/#example-94)

```````markdown
````
aaa
```
``````
```````

````html
<pre><code>aaa
```
</code></pre>
````

[Example 95](https://github.github.com/gfm/#example-95)

```markdown
~~~~
aaa
~~~
~~~~
```

```html
<pre><code>aaa
~~~
</code></pre>
```

Unclosed code blocks are closed by the end of the document
(or the enclosing [block quote](https://github.github.com/gfm/#block-quotes) or [list item](https://github.github.com/gfm/#list-items)):

[Example 96](https://github.github.com/gfm/#example-96)

````markdown
```
````

```html
<pre><code></code></pre>
```

[Example 97](https://github.github.com/gfm/#example-97)

``````markdown
`````

```
aaa
``````

````html
<pre><code>
```
aaa
</code></pre>
````

[Example 98](https://github.github.com/gfm/#example-98)

````markdown
> ```
> aaa

bbb
````

```html
<blockquote>
<pre><code>aaa
</code></pre>
</blockquote>
<p>bbb</p>
```

A code block can have all empty lines as its content:

[Example 99](https://github.github.com/gfm/#example-99)

````markdown
```


```
````

```html
<pre><code>

</code></pre>
```

A code block can be empty:

[Example 100](https://github.github.com/gfm/#example-100)

````markdown
```
```
````

```html
<pre><code></code></pre>
```

Fences can be indented. If the opening fence is indented,
content lines will have equivalent opening indentation removed,
if present:

[Example 101](https://github.github.com/gfm/#example-101)

````markdown
 ```
 aaa
aaa
```
````

```html
<pre><code>aaa
aaa
</code></pre>
```

[Example 102](https://github.github.com/gfm/#example-102)

````markdown
  ```
aaa
  aaa
aaa
  ```
````

```html
<pre><code>aaa
aaa
aaa
</code></pre>
```

[Example 103](https://github.github.com/gfm/#example-103)

````markdown
   ```
   aaa
    aaa
  aaa
   ```
````

```html
<pre><code>aaa
 aaa
aaa
</code></pre>
```

Four spaces indentation produces an indented code block:

[Example 104](https://github.github.com/gfm/#example-104)

````markdown
    ```
    aaa
    ```
````

````html
<pre><code>```
aaa
```
</code></pre>
````

Closing fences may be indented by 0-3 spaces, and their indentation
need not match that of the opening fence:

[Example 105](https://github.github.com/gfm/#example-105)

````markdown
```
aaa
```
````

```html
<pre><code>aaa
</code></pre>
```

[Example 106](https://github.github.com/gfm/#example-106)

````markdown
   ```
aaa
  ```
````

```html
<pre><code>aaa
</code></pre>
```

This is not a closing fence, because it is indented 4 spaces:

[Example 107](https://github.github.com/gfm/#example-107)

````markdown
```
aaa
    ```
````

````html
<pre><code>aaa
    ```
</code></pre>
````

Code fences (opening and closing) cannot contain internal spaces:

[Example 108](https://github.github.com/gfm/#example-108)

````markdown
``` ```
aaa
````

```html
<p><code> </code>
aaa</p>
```

[Example 109](https://github.github.com/gfm/#example-109)

```markdown
~~~~~~
aaa
~~~ ~~
```

```html
<pre><code>aaa
~~~ ~~
</code></pre>
```

Fenced code blocks can interrupt paragraphs, and can be followed
directly by paragraphs, without a blank line between:

[Example 110](https://github.github.com/gfm/#example-110)

````markdown
foo
```
bar
```
baz
````

```html
<p>foo</p>
<pre><code>bar
</code></pre>
<p>baz</p>
```

Other blocks can also occur before and after fenced code blocks
without an intervening blank line:

[Example 111](https://github.github.com/gfm/#example-111)

```markdown
foo
---
~~~
bar
~~~
# baz
```

```html
<h2>foo</h2>
<pre><code>bar
</code></pre>
<h1>baz</h1>
```

An [info string](https://github.github.com/gfm/#info-string) can be provided after the opening code fence.
Although this spec doesn’t mandate any particular treatment of
the info string, the first word is typically used to specify
the language of the code block. In HTML output, the language is
normally indicated by adding a class to the `code` element consisting
of `language-` followed by the language name.

[Example 112](https://github.github.com/gfm/#example-112)

````markdown
```ruby
def foo(x)
return 3
end
```
````

```html
<pre><code class="language-ruby">def foo(x)
  return 3
end
</code></pre>
```

[Example 113](https://github.github.com/gfm/#example-113)

```markdown
~~~~    ruby startline=3 $%@#$
def foo(x)
  return 3
end
~~~~~~~
```

```html
<pre><code class="language-ruby">def foo(x)
  return 3
end
</code></pre>
```

[Example 114](https://github.github.com/gfm/#example-114)

`````markdown
````;
````
`````

```html
<pre><code class="language-;"></code></pre>
```

[Info strings](https://github.github.com/gfm/#info-string) for backtick code blocks cannot contain backticks:

[Example 115](https://github.github.com/gfm/#example-115)

````markdown
``` aa ```
foo
````

```html
<p><code>aa</code>
foo</p>
```

[Info strings](https://github.github.com/gfm/#info-string) for tilde code blocks can contain backticks and tildes:

[Example 116](https://github.github.com/gfm/#example-116)

````markdown
~~~ aa ``` ~~~
foo
~~~
````

```html
<pre><code class="language-aa">foo
</code></pre>
```

Closing code fences cannot have [info strings](https://github.github.com/gfm/#info-string):

[Example 117](https://github.github.com/gfm/#example-117)

````markdown
```
``` aaa
```
````

````html
<pre><code>``` aaa
</code></pre>
````

## 4.6HTML blocks

An [HTML block](https://github.github.com/gfm/#html-block) is a group of lines that is treated
as raw HTML (and will not be escaped in HTML output).

There are seven kinds of [HTML block](https://github.github.com/gfm/#html-block), which can be defined by their
start and end conditions. The block begins with a line that meets a
[start condition](https://github.github.com/gfm/#start-condition) (after up to three spaces optional indentation).
It ends with the first subsequent line that meets a matching [end\\
condition](https://github.github.com/gfm/#end-condition), or the last line of the document, or the last line of
the [container block](https://github.github.com/gfm/#container-blocks) containing the current HTML
block, if no line is encountered that meets the [end condition](https://github.github.com/gfm/#end-condition). If
the first line meets both the [start condition](https://github.github.com/gfm/#start-condition) and the [end\\
condition](https://github.github.com/gfm/#end-condition), the block will contain just that line.

1. **Start condition:** line begins with the string `<script`,
   `<pre`, or `<style` (case-insensitive), followed by whitespace,
   the string `>`, or the end of the line.

   **End condition:** line contains an end tag
   `</script>`, `</pre>`, or `</style>` (case-insensitive; it
   need not match the start tag).

2. **Start condition:** line begins with the string `<!--`.

   **End condition:** line contains the string `-->`.

3. **Start condition:** line begins with the string `<?`.

   **End condition:** line contains the string `?>`.

4. **Start condition:** line begins with the string `<!`
   followed by an uppercase ASCII letter.

   **End condition:** line contains the character `>`.

5. **Start condition:** line begins with the string
   `<![CDATA[`.\
\
   **End condition:** line contains the string `]]>`.

6. **Start condition:** line begins the string `<` or `</`
   followed by one of the strings (case-insensitive) `address`,
   `article`, `aside`, `base`, `basefont`, `blockquote`, `body`,
   `caption`, `center`, `col`, `colgroup`, `dd`, `details`, `dialog`,
   `dir`, `div`, `dl`, `dt`, `fieldset`, `figcaption`, `figure`,
   `footer`, `form`, `frame`, `frameset`,
   `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `head`, `header`, `hr`,
   `html`, `iframe`, `legend`, `li`, `link`, `main`, `menu`, `menuitem`,
   `nav`, `noframes`, `ol`, `optgroup`, `option`, `p`, `param`,
   `section`, `source`, `summary`, `table`, `tbody`, `td`,
   `tfoot`, `th`, `thead`, `title`, `tr`, `track`, `ul`, followed
   by [whitespace](https://github.github.com/gfm/#whitespace), the end of the line, the string `>`, or
   the string `/>`.

   **End condition:** line is followed by a [blank line](https://github.github.com/gfm/#blank-line).

7. **Start condition:** line begins with a complete [open tag](https://github.github.com/gfm/#open-tag)
   (with any [tag name](https://github.github.com/gfm/#tag-name) other than `script`,
   `style`, or `pre`) or a complete [closing tag](https://github.github.com/gfm/#closing-tag),
   followed only by [whitespace](https://github.github.com/gfm/#whitespace) or the end of the line.

   **End condition:** line is followed by a [blank line](https://github.github.com/gfm/#blank-line).


HTML blocks continue until they are closed by their appropriate
[end condition](https://github.github.com/gfm/#end-condition), or the last line of the document or other [container\\
block](https://github.github.com/gfm/#container-blocks). This means any HTML **within an HTML**
**block** that might otherwise be recognised as a start condition will
be ignored by the parser and passed through as-is, without changing
the parser’s state.

For instance, `<pre>` within a HTML block started by `<table>` will not affect
the parser state; as the HTML block was started in by start condition 6, it
will end at any blank line. This can be surprising:

[Example 118](https://github.github.com/gfm/#example-118)

```markdown
<table><tr><td>
<pre>
**Hello**,

_world_.
</pre>
</td></tr></table>
```

```html
<table><tr><td>
<pre>
**Hello**,
<p><em>world</em>.
</pre></p>
</td></tr></table>
```

In this case, the HTML block is terminated by the newline — the `**Hello**`
text remains verbatim — and regular parsing resumes, with a paragraph,
emphasised `world` and inline and block HTML following.

All types of [HTML blocks](https://github.github.com/gfm/#html-blocks) except type 7 may interrupt
a paragraph. Blocks of type 7 may not interrupt a paragraph.
(This restriction is intended to prevent unwanted interpretation
of long tags inside a wrapped paragraph as starting HTML blocks.)

Some simple examples follow. Here are some basic HTML blocks
of type 6:

[Example 119](https://github.github.com/gfm/#example-119)

```markdown
<table>
  <tr>
    <td>
           hi
    </td>
  </tr>
</table>

okay.
```

```html
<table>
  <tr>
    <td>
           hi
    </td>
  </tr>
</table>
<p>okay.</p>
```

[Example 120](https://github.github.com/gfm/#example-120)

```markdown
 <div>
  *hello*
         <foo><a>
```

```html
 <div>
  *hello*
         <foo><a>
```

A block can also start with a closing tag:

[Example 121](https://github.github.com/gfm/#example-121)

```markdown
</div>
*foo*
```

```html
</div>
*foo*
```

Here we have two HTML blocks with a Markdown paragraph between them:

[Example 122](https://github.github.com/gfm/#example-122)

```markdown
<DIV CLASS="foo">

*Markdown*

</DIV>
```

```html
<DIV CLASS="foo">
<p><em>Markdown</em></p>
</DIV>
```

The tag on the first line can be partial, as long
as it is split where there would be whitespace:

[Example 123](https://github.github.com/gfm/#example-123)

```markdown
<div id="foo"
  class="bar">
</div>
```

```html
<div id="foo"
  class="bar">
</div>
```

[Example 124](https://github.github.com/gfm/#example-124)

```markdown
<div id="foo" class="bar
  baz">
</div>
```

```html
<div id="foo" class="bar
  baz">
</div>
```

An open tag need not be closed:

[Example 125](https://github.github.com/gfm/#example-125)

```markdown
<div>
*foo*

*bar*
```

```html
<div>
*foo*
<p><em>bar</em></p>
```

A partial tag need not even be completed (garbage
in, garbage out):

[Example 126](https://github.github.com/gfm/#example-126)

```markdown
<div id="foo"
*hi*
```

```html
<div id="foo"
*hi*
```

[Example 127](https://github.github.com/gfm/#example-127)

```markdown
<div class
foo
```

```html
<div class
foo
```

The initial tag doesn’t even need to be a valid
tag, as long as it starts like one:

[Example 128](https://github.github.com/gfm/#example-128)

```markdown
<div *???-&&&-<---
*foo*
```

```html
<div *???-&&&-<---
*foo*
```

In type 6 blocks, the initial tag need not be on a line by
itself:

[Example 129](https://github.github.com/gfm/#example-129)

```markdown
<div><a href="bar">*foo*</a></div>
```

```html
<div><a href="bar">*foo*</a></div>
```

[Example 130](https://github.github.com/gfm/#example-130)

```markdown
<table><tr><td>
foo
</td></tr></table>
```

```html
<table><tr><td>
foo
</td></tr></table>
```

Everything until the next blank line or end of document
gets included in the HTML block. So, in the following
example, what looks like a Markdown code block
is actually part of the HTML block, which continues until a blank
line or the end of the document is reached:

[Example 131](https://github.github.com/gfm/#example-131)

````markdown
<div></div>
``` c
int x = 33;
```
````

````html
<div></div>
``` c
int x = 33;
```
````

To start an [HTML block](https://github.github.com/gfm/#html-block) with a tag that is _not_ in the
list of block-level tags in (6), you must put the tag by
itself on the first line (and it must be complete):

[Example 132](https://github.github.com/gfm/#example-132)

```markdown
<a href="foo">
*bar*
</a>
```

```html
<a href="foo">
*bar*
</a>
```

In type 7 blocks, the [tag name](https://github.github.com/gfm/#tag-name) can be anything:

[Example 133](https://github.github.com/gfm/#example-133)

```markdown
<Warning>
*bar*
</Warning>
```

```html
<Warning>
*bar*
</Warning>
```

[Example 134](https://github.github.com/gfm/#example-134)

```markdown
<i class="foo">
*bar*
</i>
```

```html
<i class="foo">
*bar*
</i>
```

[Example 135](https://github.github.com/gfm/#example-135)

```markdown
</ins>
*bar*
```

```html
</ins>
*bar*
```

These rules are designed to allow us to work with tags that
can function as either block-level or inline-level tags.
The `<del>` tag is a nice example. We can surround content with
`<del>` tags in three different ways. In this case, we get a raw
HTML block, because the `<del>` tag is on a line by itself:

[Example 136](https://github.github.com/gfm/#example-136)

```markdown
<del>
*foo*
</del>
```

```html
<del>
*foo*
</del>
```

In this case, we get a raw HTML block that just includes
the `<del>` tag (because it ends with the following blank
line). So the contents get interpreted as CommonMark:

[Example 137](https://github.github.com/gfm/#example-137)

```markdown
<del>

*foo*

</del>
```

```html
<del>
<p><em>foo</em></p>
</del>
```

Finally, in this case, the `<del>` tags are interpreted
as [raw HTML](https://github.github.com/gfm/#raw-html) _inside_ the CommonMark paragraph. (Because
the tag is not on a line by itself, we get inline HTML
rather than an [HTML block](https://github.github.com/gfm/#html-block).)

[Example 138](https://github.github.com/gfm/#example-138)

```markdown
<del>*foo*</del>
```

```html
<p><del><em>foo</em></del></p>
```

HTML tags designed to contain literal content
(`script`, `style`, `pre`), comments, processing instructions,
and declarations are treated somewhat differently.
Instead of ending at the first blank line, these blocks
end at the first line containing a corresponding end tag.
As a result, these blocks can contain blank lines:

A pre tag (type 1):

[Example 139](https://github.github.com/gfm/#example-139)

```markdown
<pre language="haskell"><code>
import Text.HTML.TagSoup

main :: IO ()
main = print $ parseTags tags
</code></pre>
okay
```

```html
<pre language="haskell"><code>
import Text.HTML.TagSoup

main :: IO ()
main = print $ parseTags tags
</code></pre>
<p>okay</p>
```

A script tag (type 1):

[Example 140](https://github.github.com/gfm/#example-140)

```markdown
<script type="text/javascript">
// JavaScript example

document.getElementById("demo").innerHTML = "Hello JavaScript!";
</script>
okay
```

```html
<script type="text/javascript">
// JavaScript example

document.getElementById("demo").innerHTML = "Hello JavaScript!";
</script>
<p>okay</p>
```

A style tag (type 1):

[Example 141](https://github.github.com/gfm/#example-141)

```markdown
<style
  type="text/css">
h1 {color:red;}

p {color:blue;}
</style>
okay
```

```html
<style
  type="text/css">
h1 {color:red;}

p {color:blue;}
</style>
<p>okay</p>
```

If there is no matching end tag, the block will end at the
end of the document (or the enclosing [block quote](https://github.github.com/gfm/#block-quotes)
or [list item](https://github.github.com/gfm/#list-items)):

[Example 142](https://github.github.com/gfm/#example-142)

```markdown
<style
  type="text/css">

foo
```

```html
<style
  type="text/css">

foo
```

[Example 143](https://github.github.com/gfm/#example-143)

```markdown
> <div>
> foo

bar
```

```html
<blockquote>
<div>
foo
</blockquote>
<p>bar</p>
```

[Example 144](https://github.github.com/gfm/#example-144)

```markdown
- <div>
- foo
```

```html
<ul>
<li>
<div>
</li>
<li>foo</li>
</ul>
```

The end tag can occur on the same line as the start tag:

[Example 145](https://github.github.com/gfm/#example-145)

```markdown
<style>p{color:red;}</style>
*foo*
```

```html
<style>p{color:red;}</style>
<p><em>foo</em></p>
```

[Example 146](https://github.github.com/gfm/#example-146)

```markdown
<!-- foo -->*bar*
*baz*
```

```html
<!-- foo -->*bar*
<p><em>baz</em></p>
```

Note that anything on the last line after the
end tag will be included in the [HTML block](https://github.github.com/gfm/#html-block):

[Example 147](https://github.github.com/gfm/#example-147)

```markdown
<script>
foo
</script>1. *bar*
```

```html
<script>
foo
</script>1. *bar*
```

A comment (type 2):

[Example 148](https://github.github.com/gfm/#example-148)

```markdown
<!-- Foo

bar
   baz -->
okay
```

```html
<!-- Foo

bar
   baz -->
<p>okay</p>
```

A processing instruction (type 3):

[Example 149](https://github.github.com/gfm/#example-149)

```markdown
<?php

  echo '>';

?>
okay
```

```html
<?php

  echo '>';

?>
<p>okay</p>
```

A declaration (type 4):

[Example 150](https://github.github.com/gfm/#example-150)

```markdown
<!DOCTYPE html>
```

```html
<!DOCTYPE html>
```

CDATA (type 5):

[Example 151](https://github.github.com/gfm/#example-151)

```markdown
<![CDATA[\
function matchwo(a,b)\
{\
  if (a < b && a < 0) then {\
    return 1;\
\
  } else {\
\
    return 0;\
  }\
}\
]]>
okay
```

```html
<![CDATA[\
function matchwo(a,b)\
{\
  if (a < b && a < 0) then {\
    return 1;\
\
  } else {\
\
    return 0;\
  }\
}\
]]>
<p>okay</p>
```

The opening tag can be indented 1-3 spaces, but not 4:

[Example 152](https://github.github.com/gfm/#example-152)

```markdown
  <!-- foo -->

    <!-- foo -->
```

```html
  <!-- foo -->
<pre><code>&lt;!-- foo --&gt;
</code></pre>
```

[Example 153](https://github.github.com/gfm/#example-153)

```markdown
  <div>

    <div>
```

```html
  <div>
<pre><code>&lt;div&gt;
</code></pre>
```

An HTML block of types 1–6 can interrupt a paragraph, and need not be
preceded by a blank line.

[Example 154](https://github.github.com/gfm/#example-154)

```markdown
Foo
<div>
bar
</div>
```

```html
<p>Foo</p>
<div>
bar
</div>
```

However, a following blank line is needed, except at the end of
a document, and except for blocks of types 1–5, [above](https://github.github.com/gfm/#html-block):

[Example 155](https://github.github.com/gfm/#example-155)

```markdown
<div>
bar
</div>
*foo*
```

```html
<div>
bar
</div>
*foo*
```

HTML blocks of type 7 cannot interrupt a paragraph:

[Example 156](https://github.github.com/gfm/#example-156)

```markdown
Foo
<a href="bar">
baz
```

```html
<p>Foo
<a href="bar">
baz</p>
```

This rule differs from John Gruber’s original Markdown syntax
specification, which says:

> The only restrictions are that block-level HTML elements —
> e.g. `<div>`, `<table>`, `<pre>`, `<p>`, etc. — must be separated from
> surrounding content by blank lines, and the start and end tags of the
> block should not be indented with tabs or spaces.

In some ways Gruber’s rule is more restrictive than the one given
here:

- It requires that an HTML block be preceded by a blank line.
- It does not allow the start tag to be indented.
- It requires a matching end tag, which it also does not allow to
  be indented.

Most Markdown implementations (including some of Gruber’s own) do not
respect all of these restrictions.

There is one respect, however, in which Gruber’s rule is more liberal
than the one given here, since it allows blank lines to occur inside
an HTML block. There are two reasons for disallowing them here.
First, it removes the need to parse balanced tags, which is
expensive and can require backtracking from the end of the document
if no matching end tag is found. Second, it provides a very simple
and flexible way of including Markdown content inside HTML tags:
simply separate the Markdown from the HTML using blank lines:

Compare:

[Example 157](https://github.github.com/gfm/#example-157)

```markdown
<div>

*Emphasized* text.

</div>
```

```html
<div>
<p><em>Emphasized</em> text.</p>
</div>
```

[Example 158](https://github.github.com/gfm/#example-158)

```markdown
<div>
*Emphasized* text.
</div>
```

```html
<div>
*Emphasized* text.
</div>
```

Some Markdown implementations have adopted a convention of
interpreting content inside tags as text if the open tag has
the attribute `markdown=1`. The rule given above seems a simpler and
more elegant way of achieving the same expressive power, which is also
much simpler to parse.

The main potential drawback is that one can no longer paste HTML
blocks into Markdown documents with 100% reliability. However,
_in most cases_ this will work fine, because the blank lines in
HTML are usually followed by HTML block tags. For example:

[Example 159](https://github.github.com/gfm/#example-159)

```markdown
<table>

<tr>

<td>
Hi
</td>

</tr>

</table>
```

```html
<table>
<tr>
<td>
Hi
</td>
</tr>
</table>
```

There are problems, however, if the inner tags are indented
_and_ separated by spaces, as then they will be interpreted as
an indented code block:

[Example 160](https://github.github.com/gfm/#example-160)

```markdown
<table>

  <tr>

    <td>
      Hi
    </td>

  </tr>

</table>
```

```html
<table>
  <tr>
<pre><code>&lt;td&gt;
  Hi
&lt;/td&gt;
</code></pre>
  </tr>
</table>
```

Fortunately, blank lines are usually not necessary and can be
deleted. The exception is inside `<pre>` tags, but as described
[above](https://github.github.com/gfm/#html-blocks), raw HTML blocks starting with `<pre>` _can_ contain blank lines.

## 4.7Link reference definitions

A [link reference definition](https://github.github.com/gfm/#link-reference-definition)
consists of a [link label](https://github.github.com/gfm/#link-label), indented up to three spaces, followed
by a colon (`:`), optional [whitespace](https://github.github.com/gfm/#whitespace) (including up to one
[line ending](https://github.github.com/gfm/#line-ending)), a [link destination](https://github.github.com/gfm/#link-destination),
optional [whitespace](https://github.github.com/gfm/#whitespace) (including up to one
[line ending](https://github.github.com/gfm/#line-ending)), and an optional [link\\
title](https://github.github.com/gfm/#link-title), which if it is present must be separated
from the [link destination](https://github.github.com/gfm/#link-destination) by [whitespace](https://github.github.com/gfm/#whitespace).
No further [non-whitespace characters](https://github.github.com/gfm/#non-whitespace-character) may occur on the line.

A [link reference definition](https://github.github.com/gfm/#link-reference-definition)
does not correspond to a structural element of a document. Instead, it
defines a label which can be used in [reference links](https://github.github.com/gfm/#reference-link)
and reference-style [images](https://github.github.com/gfm/#images) elsewhere in the document. [Link\\
reference definitions](https://github.github.com/gfm/#link-reference-definitions) can come either before or after the links that use
them.

[Example 161](https://github.github.com/gfm/#example-161)

```markdown
[foo]: /url "title"

[foo]
```

```html
<p><a href="/url" title="title">foo</a></p>
```

[Example 162](https://github.github.com/gfm/#example-162)

```markdown
   [foo]:
      /url
           'the title'

[foo]
```

```html
<p><a href="/url" title="the title">foo</a></p>
```

[Example 163](https://github.github.com/gfm/#example-163)

```markdown
[Foo*bar\]]:my_(url) 'title (with parens)'

[Foo*bar\]]
```

```html
<p><a href="my_(url)" title="title (with parens)">Foo*bar]</a></p>
```

[Example 164](https://github.github.com/gfm/#example-164)

```markdown
[Foo bar]:
<my url>
'title'

[Foo bar]
```

```html
<p><a href="my%20url" title="title">Foo bar</a></p>
```

The title may extend over multiple lines:

[Example 165](https://github.github.com/gfm/#example-165)

```markdown
[foo]: /url '
title
line1
line2
'

[foo]
```

```html
<p><a href="/url" title="
title
line1
line2
">foo</a></p>
```

However, it may not contain a [blank line](https://github.github.com/gfm/#blank-line):

[Example 166](https://github.github.com/gfm/#example-166)

```markdown
[foo]: /url 'title

with blank line'

[foo]
```

```html
<p>[foo]: /url 'title</p>
<p>with blank line'</p>
<p>[foo]</p>
```

The title may be omitted:

[Example 167](https://github.github.com/gfm/#example-167)

```markdown
[foo]:
/url

[foo]
```

```html
<p><a href="/url">foo</a></p>
```

The link destination may not be omitted:

[Example 168](https://github.github.com/gfm/#example-168)

```markdown
[foo]:

[foo]
```

```html
<p>[foo]:</p>
<p>[foo]</p>
```

However, an empty link destination may be specified using
angle brackets:

[Example 169](https://github.github.com/gfm/#example-169)

```markdown
[foo]: <>

[foo]
```

```html
<p><a href="">foo</a></p>
```

The title must be separated from the link destination by
whitespace:

[Example 170](https://github.github.com/gfm/#example-170)

```markdown
[foo]: <bar>(baz)

[foo]
```

```html
<p>[foo]: <bar>(baz)</p>
<p>[foo]</p>
```

Both title and destination can contain backslash escapes
and literal backslashes:

[Example 171](https://github.github.com/gfm/#example-171)

```markdown
[foo]: /url\bar\*baz "foo\"bar\baz"

[foo]
```

```html
<p><a href="/url%5Cbar*baz" title="foo&quot;bar\baz">foo</a></p>
```

A link can come before its corresponding definition:

[Example 172](https://github.github.com/gfm/#example-172)

```markdown
[foo]

[foo]: url
```

```html
<p><a href="url">foo</a></p>
```

If there are several matching definitions, the first one takes
precedence:

[Example 173](https://github.github.com/gfm/#example-173)

```markdown
[foo]

[foo]: first
[foo]: second
```

```html
<p><a href="first">foo</a></p>
```

As noted in the section on [Links](https://github.github.com/gfm/#links), matching of labels is
case-insensitive (see [matches](https://github.github.com/gfm/#matches)).

[Example 174](https://github.github.com/gfm/#example-174)

```markdown
[FOO]: /url

[Foo]
```

```html
<p><a href="/url">Foo</a></p>
```

[Example 175](https://github.github.com/gfm/#example-175)

```markdown
[ΑΓΩ]: /φου

[αγω]
```

```html
<p><a href="/%CF%86%CE%BF%CF%85">αγω</a></p>
```

Here is a link reference definition with no corresponding link.
It contributes nothing to the document.

[Example 176](https://github.github.com/gfm/#example-176)

```markdown
[foo]: /url
```

```html

```

Here is another one:

[Example 177](https://github.github.com/gfm/#example-177)

```markdown
[\
foo\
]: /url
bar
```

```html
<p>bar</p>
```

This is not a link reference definition, because there are
[non-whitespace characters](https://github.github.com/gfm/#non-whitespace-character) after the title:

[Example 178](https://github.github.com/gfm/#example-178)

```markdown
[foo]: /url "title" ok
```

```html
<p>[foo]: /url &quot;title&quot; ok</p>
```

This is a link reference definition, but it has no title:

[Example 179](https://github.github.com/gfm/#example-179)

```markdown
[foo]: /url
"title" ok
```

```html
<p>&quot;title&quot; ok</p>
```

This is not a link reference definition, because it is indented
four spaces:

[Example 180](https://github.github.com/gfm/#example-180)

```markdown
    [foo]: /url "title"

[foo]
```

```html
<pre><code>[foo]: /url &quot;title&quot;
</code></pre>
<p>[foo]</p>
```

This is not a link reference definition, because it occurs inside
a code block:

[Example 181](https://github.github.com/gfm/#example-181)

````markdown
```
[foo]: /url
```

[foo]
````

```html
<pre><code>[foo]: /url
</code></pre>
<p>[foo]</p>
```

A [link reference definition](https://github.github.com/gfm/#link-reference-definition) cannot interrupt a paragraph.

[Example 182](https://github.github.com/gfm/#example-182)

```markdown
Foo
[bar]: /baz

[bar]
```

```html
<p>Foo
[bar]: /baz</p>
<p>[bar]</p>
```

However, it can directly follow other block elements, such as headings
and thematic breaks, and it need not be followed by a blank line.

[Example 183](https://github.github.com/gfm/#example-183)

```markdown
# [Foo]
[foo]: /url
> bar
```

```html
<h1><a href="/url">Foo</a></h1>
<blockquote>
<p>bar</p>
</blockquote>
```

[Example 184](https://github.github.com/gfm/#example-184)

```markdown
[foo]: /url
bar
===
[foo]
```

```html
<h1>bar</h1>
<p><a href="/url">foo</a></p>
```

[Example 185](https://github.github.com/gfm/#example-185)

```markdown
[foo]: /url
===
[foo]
```

```html
<p>===
<a href="/url">foo</a></p>
```

Several [link reference definitions](https://github.github.com/gfm/#link-reference-definitions)
can occur one after another, without intervening blank lines.

[Example 186](https://github.github.com/gfm/#example-186)

```markdown
[foo]: /foo-url "foo"
[bar]: /bar-url
  "bar"
[baz]: /baz-url

[foo],
[bar],
[baz]
```

```html
<p><a href="/foo-url" title="foo">foo</a>,
<a href="/bar-url" title="bar">bar</a>,
<a href="/baz-url">baz</a></p>
```

[Link reference definitions](https://github.github.com/gfm/#link-reference-definitions) can occur
inside block containers, like lists and block quotations. They
affect the entire document, not just the container in which they
are defined:

[Example 187](https://github.github.com/gfm/#example-187)

```markdown
[foo]

> [foo]: /url
```

```html
<p><a href="/url">foo</a></p>
<blockquote>
</blockquote>
```

Whether something is a [link reference definition](https://github.github.com/gfm/#link-reference-definition) is
independent of whether the link reference it defines is
used in the document. Thus, for example, the following
document contains just a link reference definition, and
no visible content:

[Example 188](https://github.github.com/gfm/#example-188)

```markdown
[foo]: /url
```

```html

```

## 4.8Paragraphs

A sequence of non-blank lines that cannot be interpreted as other
kinds of blocks forms a [paragraph](https://github.github.com/gfm/#paragraph).
The contents of the paragraph are the result of parsing the
paragraph’s raw content as inlines. The paragraph’s raw content
is formed by concatenating the lines and removing initial and final
[whitespace](https://github.github.com/gfm/#whitespace).

A simple example with two paragraphs:

[Example 189](https://github.github.com/gfm/#example-189)

```markdown
aaa

bbb
```

```html
<p>aaa</p>
<p>bbb</p>
```

Paragraphs can contain multiple lines, but no blank lines:

[Example 190](https://github.github.com/gfm/#example-190)

```markdown
aaa
bbb

ccc
ddd
```

```html
<p>aaa
bbb</p>
<p>ccc
ddd</p>
```

Multiple blank lines between paragraph have no effect:

[Example 191](https://github.github.com/gfm/#example-191)

```markdown
aaa

bbb
```

```html
<p>aaa</p>
<p>bbb</p>
```

Leading spaces are skipped:

[Example 192](https://github.github.com/gfm/#example-192)

```markdown
  aaa
 bbb
```

```html
<p>aaa
bbb</p>
```

Lines after the first may be indented any amount, since indented
code blocks cannot interrupt paragraphs.

[Example 193](https://github.github.com/gfm/#example-193)

```markdown
aaa
             bbb
                                       ccc
```

```html
<p>aaa
bbb
ccc</p>
```

However, the first line may be indented at most three spaces,
or an indented code block will be triggered:

[Example 194](https://github.github.com/gfm/#example-194)

```markdown
   aaa
bbb
```

```html
<p>aaa
bbb</p>
```

[Example 195](https://github.github.com/gfm/#example-195)

```markdown
    aaa
bbb
```

```html
<pre><code>aaa
</code></pre>
<p>bbb</p>
```

Final spaces are stripped before inline parsing, so a paragraph
that ends with two or more spaces will not end with a [hard line\\
break](https://github.github.com/gfm/#hard-line-break):

[Example 196](https://github.github.com/gfm/#example-196)

```markdown
aaa
bbb
```

```html
<p>aaa<br />
bbb</p>
```

## 4.9Blank lines

[Blank lines](https://github.github.com/gfm/#blank-line) between block-level elements are ignored,
except for the role they play in determining whether a [list](https://github.github.com/gfm/#list)
is [tight](https://github.github.com/gfm/#tight) or [loose](https://github.github.com/gfm/#loose).

Blank lines at the beginning and end of the document are also ignored.

[Example 197](https://github.github.com/gfm/#example-197)

```markdown


aaa


# aaa


```

```html
<p>aaa</p>
<h1>aaa</h1>
```

## 4.10Tables (extension)

GFM enables the `table` extension, where an additional leaf block type is
available.

A [table](https://github.github.com/gfm/#table) is an arrangement of data with rows and columns, consisting of a
single header row, a [delimiter row](https://github.github.com/gfm/#delimiter-row) separating the header from the data, and
zero or more data rows.

Each row consists of cells containing arbitrary text, in which [inlines](https://github.github.com/gfm/#inlines) are
parsed, separated by pipes (`|`). A leading and trailing pipe is also
recommended for clarity of reading, and if there’s otherwise parsing ambiguity.
Spaces between pipes and cell content are trimmed. Block-level elements cannot
be inserted in a table.

The [delimiter row](https://github.github.com/gfm/#delimiter-row) consists of cells whose only content are hyphens (`-`),
and optionally, a leading or trailing colon (`:`), or both, to indicate left,
right, or center alignment respectively.

[Example 198](https://github.github.com/gfm/#example-198)

```markdown
| foo | bar |
| --- | --- |
| baz | bim |
```

```html
<table>
<thead>
<tr>
<th>foo</th>
<th>bar</th>
</tr>
</thead>
<tbody>
<tr>
<td>baz</td>
<td>bim</td>
</tr>
</tbody>
</table>
```

Cells in one column don’t need to match length, though it’s easier to read if
they are. Likewise, use of leading and trailing pipes may be inconsistent:

[Example 199](https://github.github.com/gfm/#example-199)

```markdown
| abc | defghi |
:-: | -----------:
bar | baz
```

```html
<table>
<thead>
<tr>
<th align="center">abc</th>
<th align="right">defghi</th>
</tr>
</thead>
<tbody>
<tr>
<td align="center">bar</td>
<td align="right">baz</td>
</tr>
</tbody>
</table>
```

Include a pipe in a cell’s content by escaping it, including inside other
inline spans:

[Example 200](https://github.github.com/gfm/#example-200)

```markdown
| f\|oo  |
| ------ |
| b `\|` az |
| b **\|** im |
```

```html
<table>
<thead>
<tr>
<th>f|oo</th>
</tr>
</thead>
<tbody>
<tr>
<td>b <code>|</code> az</td>
</tr>
<tr>
<td>b <strong>|</strong> im</td>
</tr>
</tbody>
</table>
```

The table is broken at the first empty line, or beginning of another
block-level structure:

[Example 201](https://github.github.com/gfm/#example-201)

```markdown
| abc | def |
| --- | --- |
| bar | baz |
> bar
```

```html
<table>
<thead>
<tr>
<th>abc</th>
<th>def</th>
</tr>
</thead>
<tbody>
<tr>
<td>bar</td>
<td>baz</td>
</tr>
</tbody>
</table>
<blockquote>
<p>bar</p>
</blockquote>
```

[Example 202](https://github.github.com/gfm/#example-202)

```markdown
| abc | def |
| --- | --- |
| bar | baz |
bar

bar
```

```html
<table>
<thead>
<tr>
<th>abc</th>
<th>def</th>
</tr>
</thead>
<tbody>
<tr>
<td>bar</td>
<td>baz</td>
</tr>
<tr>
<td>bar</td>
<td></td>
</tr>
</tbody>
</table>
<p>bar</p>
```

The header row must match the [delimiter row](https://github.github.com/gfm/#delimiter-row) in the number of cells. If not,
a table will not be recognized:

[Example 203](https://github.github.com/gfm/#example-203)

```markdown
| abc | def |
| --- |
| bar |
```

```html
<p>| abc | def |
| --- |
| bar |</p>
```

The remainder of the table’s rows may vary in the number of cells. If there
are a number of cells fewer than the number of cells in the header row, empty
cells are inserted. If there are greater, the excess is ignored:

[Example 204](https://github.github.com/gfm/#example-204)

```markdown
| abc | def |
| --- | --- |
| bar |
| bar | baz | boo |
```

```html
<table>
<thead>
<tr>
<th>abc</th>
<th>def</th>
</tr>
</thead>
<tbody>
<tr>
<td>bar</td>
<td></td>
</tr>
<tr>
<td>bar</td>
<td>baz</td>
</tr>
</tbody>
</table>
```

If there are no rows in the body, no `<tbody>` is generated in HTML output:

[Example 205](https://github.github.com/gfm/#example-205)

```markdown
| abc | def |
| --- | --- |
```

```html
<table>
<thead>
<tr>
<th>abc</th>
<th>def</th>
</tr>
</thead>
</table>
```

# 5Container blocks

A [container block](https://github.github.com/gfm/#container-blocks) is a block that has other
blocks as its contents. There are two basic kinds of container blocks:
[block quotes](https://github.github.com/gfm/#block-quotes) and [list items](https://github.github.com/gfm/#list-items).
[Lists](https://github.github.com/gfm/#list) are meta-containers for [list items](https://github.github.com/gfm/#list-items).

We define the syntax for container blocks recursively. The general
form of the definition is:

> If X is a sequence of blocks, then the result of
> transforming X in such-and-such a way is a container of type Y
> with these blocks as its content.

So, we explain what counts as a block quote or list item by explaining
how these can be _generated_ from their contents. This should suffice
to define the syntax, although it does not give a recipe for _parsing_
these constructions. (A recipe is provided below in the section entitled
[A parsing strategy](https://github.github.com/gfm/#appendix-a-parsing-strategy).)

## 5.1Block quotes

A [block quote marker](https://github.github.com/gfm/#block-quote-marker)
consists of 0-3 spaces of initial indent, plus (a) the character `>` together
with a following space, or (b) a single character `>` not followed by a space.

The following rules define [block quotes](https://github.github.com/gfm/#block-quotes):

1. **Basic case.** If a string of lines _Ls_ constitute a sequence
   of blocks _Bs_, then the result of prepending a [block quote\\
   marker](https://github.github.com/gfm/#block-quote-marker) to the beginning of each line in _Ls_
   is a [block quote](https://github.github.com/gfm/#block-quotes) containing _Bs_.

2. **Laziness.** If a string of lines _Ls_ constitute a [block\\
   quote](https://github.github.com/gfm/#block-quotes) with contents _Bs_, then the result of deleting
   the initial [block quote marker](https://github.github.com/gfm/#block-quote-marker) from one or
   more lines in which the next [non-whitespace character](https://github.github.com/gfm/#non-whitespace-character) after the [block\\
   quote marker](https://github.github.com/gfm/#block-quote-marker) is [paragraph continuation\\
   text](https://github.github.com/gfm/#paragraph-continuation-text) is a block quote with _Bs_ as its content.
   [Paragraph continuation text](https://github.github.com/gfm/#paragraph-continuation-text) is text
   that will be parsed as part of the content of a paragraph, but does
   not occur at the beginning of the paragraph.

3. **Consecutiveness.** A document cannot contain two [block\\
   quotes](https://github.github.com/gfm/#block-quotes) in a row unless there is a [blank line](https://github.github.com/gfm/#blank-line) between them.


Nothing else counts as a [block quote](https://github.github.com/gfm/#block-quotes).

Here is a simple example:

[Example 206](https://github.github.com/gfm/#example-206)

```markdown
> # Foo
> bar
> baz
```

```html
<blockquote>
<h1>Foo</h1>
<p>bar
baz</p>
</blockquote>
```

The spaces after the `>` characters can be omitted:

[Example 207](https://github.github.com/gfm/#example-207)

```markdown
># Foo
>bar
> baz
```

```html
<blockquote>
<h1>Foo</h1>
<p>bar
baz</p>
</blockquote>
```

The `>` characters can be indented 1-3 spaces:

[Example 208](https://github.github.com/gfm/#example-208)

```markdown
   > # Foo
   > bar
 > baz
```

```html
<blockquote>
<h1>Foo</h1>
<p>bar
baz</p>
</blockquote>
```

Four spaces gives us a code block:

[Example 209](https://github.github.com/gfm/#example-209)

```markdown
    > # Foo
    > bar
    > baz
```

```html
<pre><code>&gt; # Foo
&gt; bar
&gt; baz
</code></pre>
```

The Laziness clause allows us to omit the `>` before
[paragraph continuation text](https://github.github.com/gfm/#paragraph-continuation-text):

[Example 210](https://github.github.com/gfm/#example-210)

```markdown
> # Foo
> bar
baz
```

```html
<blockquote>
<h1>Foo</h1>
<p>bar
baz</p>
</blockquote>
```

A block quote can contain some lazy and some non-lazy
continuation lines:

[Example 211](https://github.github.com/gfm/#example-211)

```markdown
> bar
baz
> foo
```

```html
<blockquote>
<p>bar
baz
foo</p>
</blockquote>
```

Laziness only applies to lines that would have been continuations of
paragraphs had they been prepended with [block quote markers](https://github.github.com/gfm/#block-quote-marker).
For example, the `>` cannot be omitted in the second line of

```markdown
> foo
> ---
```

without changing the meaning:

[Example 212](https://github.github.com/gfm/#example-212)

```markdown
> foo
---
```

```html
<blockquote>
<p>foo</p>
</blockquote>
<hr />
```

Similarly, if we omit the `>` in the second line of

```markdown
> - foo
> - bar
```

then the block quote ends after the first line:

[Example 213](https://github.github.com/gfm/#example-213)

```markdown
> - foo
- bar
```

```html
<blockquote>
<ul>
<li>foo</li>
</ul>
</blockquote>
<ul>
<li>bar</li>
</ul>
```

For the same reason, we can’t omit the `>` in front of
subsequent lines of an indented or fenced code block:

[Example 214](https://github.github.com/gfm/#example-214)

```markdown
>     foo
    bar
```

```html
<blockquote>
<pre><code>foo
</code></pre>
</blockquote>
<pre><code>bar
</code></pre>
```

[Example 215](https://github.github.com/gfm/#example-215)

````markdown
> ```
foo
```
````

```html
<blockquote>
<pre><code></code></pre>
</blockquote>
<p>foo</p>
<pre><code></code></pre>
```

Note that in the following case, we have a [lazy\\
continuation line](https://github.github.com/gfm/#lazy-continuation-line):

[Example 216](https://github.github.com/gfm/#example-216)

```markdown
> foo
    - bar
```

```html
<blockquote>
<p>foo
- bar</p>
</blockquote>
```

To see why, note that in

```markdown
> foo
>     - bar
```

the `- bar` is indented too far to start a list, and can’t
be an indented code block because indented code blocks cannot
interrupt paragraphs, so it is [paragraph continuation text](https://github.github.com/gfm/#paragraph-continuation-text).

A block quote can be empty:

[Example 217](https://github.github.com/gfm/#example-217)

```markdown
>
```

```html
<blockquote>
</blockquote>
```

[Example 218](https://github.github.com/gfm/#example-218)

```markdown
>
>
>
```

```html
<blockquote>
</blockquote>
```

A block quote can have initial or final blank lines:

[Example 219](https://github.github.com/gfm/#example-219)

```markdown
>
> foo
>
```

```html
<blockquote>
<p>foo</p>
</blockquote>
```

A blank line always separates block quotes:

[Example 220](https://github.github.com/gfm/#example-220)

```markdown
> foo

> bar
```

```html
<blockquote>
<p>foo</p>
</blockquote>
<blockquote>
<p>bar</p>
</blockquote>
```

(Most current Markdown implementations, including John Gruber’s
original `Markdown.pl`, will parse this example as a single block quote
with two paragraphs. But it seems better to allow the author to decide
whether two block quotes or one are wanted.)

Consecutiveness means that if we put these block quotes together,
we get a single block quote:

[Example 221](https://github.github.com/gfm/#example-221)

```markdown
> foo
> bar
```

```html
<blockquote>
<p>foo
bar</p>
</blockquote>
```

To get a block quote with two paragraphs, use:

[Example 222](https://github.github.com/gfm/#example-222)

```markdown
> foo
>
> bar
```

```html
<blockquote>
<p>foo</p>
<p>bar</p>
</blockquote>
```

Block quotes can interrupt paragraphs:

[Example 223](https://github.github.com/gfm/#example-223)

```markdown
foo
> bar
```

```html
<p>foo</p>
<blockquote>
<p>bar</p>
</blockquote>
```

In general, blank lines are not needed before or after block
quotes:

[Example 224](https://github.github.com/gfm/#example-224)

```markdown
> aaa
***
> bbb
```

```html
<blockquote>
<p>aaa</p>
</blockquote>
<hr />
<blockquote>
<p>bbb</p>
</blockquote>
```

However, because of laziness, a blank line is needed between
a block quote and a following paragraph:

[Example 225](https://github.github.com/gfm/#example-225)

```markdown
> bar
baz
```

```html
<blockquote>
<p>bar
baz</p>
</blockquote>
```

[Example 226](https://github.github.com/gfm/#example-226)

```markdown
> bar

baz
```

```html
<blockquote>
<p>bar</p>
</blockquote>
<p>baz</p>
```

[Example 227](https://github.github.com/gfm/#example-227)

```markdown
> bar
>
baz
```

```html
<blockquote>
<p>bar</p>
</blockquote>
<p>baz</p>
```

It is a consequence of the Laziness rule that any number
of initial `>`s may be omitted on a continuation line of a
nested block quote:

[Example 228](https://github.github.com/gfm/#example-228)

```markdown
> > > foo
bar
```

```html
<blockquote>
<blockquote>
<blockquote>
<p>foo
bar</p>
</blockquote>
</blockquote>
</blockquote>
```

[Example 229](https://github.github.com/gfm/#example-229)

```markdown
>>> foo
> bar
>>baz
```

```html
<blockquote>
<blockquote>
<blockquote>
<p>foo
bar
baz</p>
</blockquote>
</blockquote>
</blockquote>
```

When including an indented code block in a block quote,
remember that the [block quote marker](https://github.github.com/gfm/#block-quote-marker) includes
both the `>` and a following space. So _five spaces_ are needed after
the `>`:

[Example 230](https://github.github.com/gfm/#example-230)

```markdown
>     code

>    not code
```

```html
<blockquote>
<pre><code>code
</code></pre>
</blockquote>
<blockquote>
<p>not code</p>
</blockquote>
```

## 5.2List items

A [list marker](https://github.github.com/gfm/#list-marker) is a
[bullet list marker](https://github.github.com/gfm/#bullet-list-marker) or an [ordered list marker](https://github.github.com/gfm/#ordered-list-marker).

A [bullet list marker](https://github.github.com/gfm/#bullet-list-marker)
is a `-`, `+`, or `*` character.

An [ordered list marker](https://github.github.com/gfm/#ordered-list-marker)
is a sequence of 1–9 arabic digits (`0-9`), followed by either a
`.` character or a `)` character. (The reason for the length
limit is that with 10 digits we start seeing integer overflows
in some browsers.)

The following rules define [list items](https://github.github.com/gfm/#list-items):

1. **Basic case.** If a sequence of lines _Ls_ constitute a sequence of
   blocks _Bs_ starting with a [non-whitespace character](https://github.github.com/gfm/#non-whitespace-character), and _M_ is a
   list marker of width _W_ followed by 1 ≤ _N_ ≤ 4 spaces, then the result
   of prepending _M_ and the following spaces to the first line of
   _Ls_, and indenting subsequent lines of _Ls_ by _W + N_ spaces, is a
   list item with _Bs_ as its contents. The type of the list item
   (bullet or ordered) is determined by the type of its list marker.
   If the list item is ordered, then it is also assigned a start
   number, based on the ordered list marker.

   Exceptions:
   1. When the first list item in a [list](https://github.github.com/gfm/#list) interrupts
      a paragraph—that is, when it starts on a line that would
      otherwise count as [paragraph continuation text](https://github.github.com/gfm/#paragraph-continuation-text)—then (a)
      the lines _Ls_ must not begin with a blank line, and (b) if
      the list item is ordered, the start number must be 1.
   2. If any line is a [thematic break](https://github.github.com/gfm/#thematic-break) then
      that line is not a list item.

For example, let _Ls_ be the lines

[Example 231](https://github.github.com/gfm/#example-231)

```markdown
A paragraph
with two lines.

    indented code

> A block quote.
```

```html
<p>A paragraph
with two lines.</p>
<pre><code>indented code
</code></pre>
<blockquote>
<p>A block quote.</p>
</blockquote>
```

And let _M_ be the marker `1.`, and _N_ = 2\. Then rule #1 says
that the following is an ordered list item with start number 1,
and the same contents as _Ls_:

[Example 232](https://github.github.com/gfm/#example-232)

```markdown
1.  A paragraph
    with two lines.

        indented code

    > A block quote.
```

```html
<ol>
<li>
<p>A paragraph
with two lines.</p>
<pre><code>indented code
</code></pre>
<blockquote>
<p>A block quote.</p>
</blockquote>
</li>
</ol>
```

The most important thing to notice is that the position of
the text after the list marker determines how much indentation
is needed in subsequent blocks in the list item. If the list
marker takes up two spaces, and there are three spaces between
the list marker and the next [non-whitespace character](https://github.github.com/gfm/#non-whitespace-character), then blocks
must be indented five spaces in order to fall under the list
item.

Here are some examples showing how far content must be indented to be
put under the list item:

[Example 233](https://github.github.com/gfm/#example-233)

```markdown
- one

 two
```

```html
<ul>
<li>one</li>
</ul>
<p>two</p>
```

[Example 234](https://github.github.com/gfm/#example-234)

```markdown
- one

  two
```

```html
<ul>
<li>
<p>one</p>
<p>two</p>
</li>
</ul>
```

[Example 235](https://github.github.com/gfm/#example-235)

```markdown
 -    one

     two
```

```html
<ul>
<li>one</li>
</ul>
<pre><code> two
</code></pre>
```

[Example 236](https://github.github.com/gfm/#example-236)

```markdown
 -    one

      two
```

```html
<ul>
<li>
<p>one</p>
<p>two</p>
</li>
</ul>
```

It is tempting to think of this in terms of columns: the continuation
blocks must be indented at least to the column of the first
[non-whitespace character](https://github.github.com/gfm/#non-whitespace-character) after the list marker. However, that is not quite right.
The spaces after the list marker determine how much relative indentation
is needed. Which column this indentation reaches will depend on
how the list item is embedded in other constructions, as shown by
this example:

[Example 237](https://github.github.com/gfm/#example-237)

```markdown
   > > 1.  one
>>
>>     two
```

```html
<blockquote>
<blockquote>
<ol>
<li>
<p>one</p>
<p>two</p>
</li>
</ol>
</blockquote>
</blockquote>
```

Here `two` occurs in the same column as the list marker `1.`,
but is actually contained in the list item, because there is
sufficient indentation after the last containing blockquote marker.

The converse is also possible. In the following example, the word `two`
occurs far to the right of the initial text of the list item, `one`, but
it is not considered part of the list item, because it is not indented
far enough past the blockquote marker:

[Example 238](https://github.github.com/gfm/#example-238)

```markdown
>>- one
>>
  >  > two
```

```html
<blockquote>
<blockquote>
<ul>
<li>one</li>
</ul>
<p>two</p>
</blockquote>
</blockquote>
```

Note that at least one space is needed between the list marker and
any following content, so these are not list items:

[Example 239](https://github.github.com/gfm/#example-239)

```markdown
-one

2.two
```

```html
<p>-one</p>
<p>2.two</p>
```

A list item may contain blocks that are separated by more than
one blank line.

[Example 240](https://github.github.com/gfm/#example-240)

```markdown
- foo

  bar
```

```html
<ul>
<li>
<p>foo</p>
<p>bar</p>
</li>
</ul>
```

A list item may contain any kind of block:

[Example 241](https://github.github.com/gfm/#example-241)

````markdown
1.  foo

    ```
    bar
    ```

    baz

    > bam
````

```html
<ol>
<li>
<p>foo</p>
<pre><code>bar
</code></pre>
<p>baz</p>
<blockquote>
<p>bam</p>
</blockquote>
</li>
</ol>
```

A list item that contains an indented code block will preserve
empty lines within the code block verbatim.

[Example 242](https://github.github.com/gfm/#example-242)

```markdown
- Foo

      bar

      baz
```

```html
<ul>
<li>
<p>Foo</p>
<pre><code>bar

baz
</code></pre>
</li>
</ul>
```

Note that ordered list start numbers must be nine digits or less:

[Example 243](https://github.github.com/gfm/#example-243)

```markdown
123456789. ok
```

```html
<ol start="123456789">
<li>ok</li>
</ol>
```

[Example 244](https://github.github.com/gfm/#example-244)

```markdown
1234567890. not ok
```

```html
<p>1234567890. not ok</p>
```

A start number may begin with 0s:

[Example 245](https://github.github.com/gfm/#example-245)

```markdown
0. ok
```

```html
<ol start="0">
<li>ok</li>
</ol>
```

[Example 246](https://github.github.com/gfm/#example-246)

```markdown
003. ok
```

```html
<ol start="3">
<li>ok</li>
</ol>
```

A start number may not be negative:

[Example 247](https://github.github.com/gfm/#example-247)

```markdown
-1. not ok
```

```html
<p>-1. not ok</p>
```

2. **Item starting with indented code.** If a sequence of lines _Ls_
   constitute a sequence of blocks _Bs_ starting with an indented code
   block, and _M_ is a list marker of width _W_ followed by
   one space, then the result of prepending _M_ and the following
   space to the first line of _Ls_, and indenting subsequent lines of
   _Ls_ by _W + 1_ spaces, is a list item with _Bs_ as its contents.
   If a line is empty, then it need not be indented. The type of the
   list item (bullet or ordered) is determined by the type of its list
   marker. If the list item is ordered, then it is also assigned a
   start number, based on the ordered list marker.

An indented code block will have to be indented four spaces beyond
the edge of the region where text will be included in the list item.
In the following case that is 6 spaces:

[Example 248](https://github.github.com/gfm/#example-248)

```markdown
- foo

      bar
```

```html
<ul>
<li>
<p>foo</p>
<pre><code>bar
</code></pre>
</li>
</ul>
```

And in this case it is 11 spaces:

[Example 249](https://github.github.com/gfm/#example-249)

```markdown
  10.  foo

           bar
```

```html
<ol start="10">
<li>
<p>foo</p>
<pre><code>bar
</code></pre>
</li>
</ol>
```

If the _first_ block in the list item is an indented code block,
then by rule #2, the contents must be indented _one_ space after the
list marker:

[Example 250](https://github.github.com/gfm/#example-250)

```markdown
    indented code

paragraph

    more code
```

```html
<pre><code>indented code
</code></pre>
<p>paragraph</p>
<pre><code>more code
</code></pre>
```

[Example 251](https://github.github.com/gfm/#example-251)

```markdown
1.     indented code

   paragraph

       more code
```

```html
<ol>
<li>
<pre><code>indented code
</code></pre>
<p>paragraph</p>
<pre><code>more code
</code></pre>
</li>
</ol>
```

Note that an additional space indent is interpreted as space
inside the code block:

[Example 252](https://github.github.com/gfm/#example-252)

```markdown
1.      indented code

   paragraph

       more code
```

```html
<ol>
<li>
<pre><code> indented code
</code></pre>
<p>paragraph</p>
<pre><code>more code
</code></pre>
</li>
</ol>
```

Note that rules #1 and #2 only apply to two cases: (a) cases
in which the lines to be included in a list item begin with a
[non-whitespace character](https://github.github.com/gfm/#non-whitespace-character), and (b) cases in which
they begin with an indented code
block. In a case like the following, where the first block begins with
a three-space indent, the rules do not allow us to form a list item by
indenting the whole thing and prepending a list marker:

[Example 253](https://github.github.com/gfm/#example-253)

```markdown
   foo

bar
```

```html
<p>foo</p>
<p>bar</p>
```

[Example 254](https://github.github.com/gfm/#example-254)

```markdown
-    foo

  bar
```

```html
<ul>
<li>foo</li>
</ul>
<p>bar</p>
```

This is not a significant restriction, because when a block begins
with 1-3 spaces indent, the indentation can always be removed without
a change in interpretation, allowing rule #1 to be applied. So, in
the above case:

[Example 255](https://github.github.com/gfm/#example-255)

```markdown
-  foo

   bar
```

```html
<ul>
<li>
<p>foo</p>
<p>bar</p>
</li>
</ul>
```

3. **Item starting with a blank line.** If a sequence of lines _Ls_
   starting with a single [blank line](https://github.github.com/gfm/#blank-line) constitute a (possibly empty)
   sequence of blocks _Bs_, not separated from each other by more than
   one blank line, and _M_ is a list marker of width _W_,
   then the result of prepending _M_ to the first line of _Ls_, and
   indenting subsequent lines of _Ls_ by _W + 1_ spaces, is a list
   item with _Bs_ as its contents.
   If a line is empty, then it need not be indented. The type of the
   list item (bullet or ordered) is determined by the type of its list
   marker. If the list item is ordered, then it is also assigned a
   start number, based on the ordered list marker.

Here are some list items that start with a blank line but are not empty:

[Example 256](https://github.github.com/gfm/#example-256)

````markdown
-
  foo
-
  ```
  bar
  ```
-
      baz
````

```html
<ul>
<li>foo</li>
<li>
<pre><code>bar
</code></pre>
</li>
<li>
<pre><code>baz
</code></pre>
</li>
</ul>
```

When the list item starts with a blank line, the number of spaces
following the list marker doesn’t change the required indentation:

[Example 257](https://github.github.com/gfm/#example-257)

```markdown
-
  foo
```

```html
<ul>
<li>foo</li>
</ul>
```

A list item can begin with at most one blank line.
In the following example, `foo` is not part of the list
item:

[Example 258](https://github.github.com/gfm/#example-258)

```markdown
-

  foo
```

```html
<ul>
<li></li>
</ul>
<p>foo</p>
```

Here is an empty bullet list item:

[Example 259](https://github.github.com/gfm/#example-259)

```markdown
- foo
-
- bar
```

```html
<ul>
<li>foo</li>
<li></li>
<li>bar</li>
</ul>
```

It does not matter whether there are spaces following the [list marker](https://github.github.com/gfm/#list-marker):

[Example 260](https://github.github.com/gfm/#example-260)

```markdown
- foo
-
- bar
```

```html
<ul>
<li>foo</li>
<li></li>
<li>bar</li>
</ul>
```

Here is an empty ordered list item:

[Example 261](https://github.github.com/gfm/#example-261)

```markdown
1. foo
2.
3. bar
```

```html
<ol>
<li>foo</li>
<li></li>
<li>bar</li>
</ol>
```

A list may start or end with an empty list item:

[Example 262](https://github.github.com/gfm/#example-262)

```markdown
*
```

```html
<ul>
<li></li>
</ul>
```

However, an empty list item cannot interrupt a paragraph:

[Example 263](https://github.github.com/gfm/#example-263)

```markdown
foo
*

foo
1.
```

```html
<p>foo
*</p>
<p>foo
1.</p>
```

4. **Indentation.** If a sequence of lines _Ls_ constitutes a list item
   according to rule #1, #2, or #3, then the result of indenting each line
   of _Ls_ by 1-3 spaces (the same for each line) also constitutes a
   list item with the same contents and attributes. If a line is
   empty, then it need not be indented.

Indented one space:

[Example 264](https://github.github.com/gfm/#example-264)

```markdown
 1.  A paragraph
     with two lines.

         indented code

     > A block quote.
```

```html
<ol>
<li>
<p>A paragraph
with two lines.</p>
<pre><code>indented code
</code></pre>
<blockquote>
<p>A block quote.</p>
</blockquote>
</li>
</ol>
```

Indented two spaces:

[Example 265](https://github.github.com/gfm/#example-265)

```markdown
  1.  A paragraph
      with two lines.

          indented code

      > A block quote.
```

```html
<ol>
<li>
<p>A paragraph
with two lines.</p>
<pre><code>indented code
</code></pre>
<blockquote>
<p>A block quote.</p>
</blockquote>
</li>
</ol>
```

Indented three spaces:

[Example 266](https://github.github.com/gfm/#example-266)

```markdown
   1.  A paragraph
       with two lines.

           indented code

       > A block quote.
```

```html
<ol>
<li>
<p>A paragraph
with two lines.</p>
<pre><code>indented code
</code></pre>
<blockquote>
<p>A block quote.</p>
</blockquote>
</li>
</ol>
```

Four spaces indent gives a code block:

[Example 267](https://github.github.com/gfm/#example-267)

```markdown
    1.  A paragraph
        with two lines.

            indented code

        > A block quote.
```

```html
<pre><code>1.  A paragraph
    with two lines.

        indented code

    &gt; A block quote.
</code></pre>
```

5. **Laziness.** If a string of lines _Ls_ constitute a [list\\
   item](https://github.github.com/gfm/#list-items) with contents _Bs_, then the result of deleting
   some or all of the indentation from one or more lines in which the
   next [non-whitespace character](https://github.github.com/gfm/#non-whitespace-character) after the indentation is
   [paragraph continuation text](https://github.github.com/gfm/#paragraph-continuation-text) is a
   list item with the same contents and attributes. The unindented
   lines are called
   [lazy continuation line](https://github.github.com/gfm/#lazy-continuation-line) s.

Here is an example with [lazy continuation lines](https://github.github.com/gfm/#lazy-continuation-line):

[Example 268](https://github.github.com/gfm/#example-268)

```markdown
  1.  A paragraph
with two lines.

          indented code

      > A block quote.
```

```html
<ol>
<li>
<p>A paragraph
with two lines.</p>
<pre><code>indented code
</code></pre>
<blockquote>
<p>A block quote.</p>
</blockquote>
</li>
</ol>
```

Indentation can be partially deleted:

[Example 269](https://github.github.com/gfm/#example-269)

```markdown
  1.  A paragraph
    with two lines.
```

```html
<ol>
<li>A paragraph
with two lines.</li>
</ol>
```

These examples show how laziness can work in nested structures:

[Example 270](https://github.github.com/gfm/#example-270)

```markdown
> 1. > Blockquote
continued here.
```

```html
<blockquote>
<ol>
<li>
<blockquote>
<p>Blockquote
continued here.</p>
</blockquote>
</li>
</ol>
</blockquote>
```

[Example 271](https://github.github.com/gfm/#example-271)

```markdown
> 1. > Blockquote
> continued here.
```

```html
<blockquote>
<ol>
<li>
<blockquote>
<p>Blockquote
continued here.</p>
</blockquote>
</li>
</ol>
</blockquote>
```

6. **That’s all.** Nothing that is not counted as a list item by rules
   #1–5 counts as a [list item](https://github.github.com/gfm/#list-items).

The rules for sublists follow from the general rules
[above](https://github.github.com/gfm/#list-items). A sublist must be indented the same number
of spaces a paragraph would need to be in order to be included
in the list item.

So, in this case we need two spaces indent:

[Example 272](https://github.github.com/gfm/#example-272)

```markdown
- foo
  - bar
    - baz
      - boo
```

```html
<ul>
<li>foo
<ul>
<li>bar
<ul>
<li>baz
<ul>
<li>boo</li>
</ul>
</li>
</ul>
</li>
</ul>
</li>
</ul>
```

One is not enough:

[Example 273](https://github.github.com/gfm/#example-273)

```markdown
- foo
 - bar
  - baz
   - boo
```

```html
<ul>
<li>foo</li>
<li>bar</li>
<li>baz</li>
<li>boo</li>
</ul>
```

Here we need four, because the list marker is wider:

[Example 274](https://github.github.com/gfm/#example-274)

```markdown
10) foo
    - bar
```

```html
<ol start="10">
<li>foo
<ul>
<li>bar</li>
</ul>
</li>
</ol>
```

Three is not enough:

[Example 275](https://github.github.com/gfm/#example-275)

```markdown
10) foo
   - bar
```

```html
<ol start="10">
<li>foo</li>
</ol>
<ul>
<li>bar</li>
</ul>
```

A list may be the first block in a list item:

[Example 276](https://github.github.com/gfm/#example-276)

```markdown
- - foo
```

```html
<ul>
<li>
<ul>
<li>foo</li>
</ul>
</li>
</ul>
```

[Example 277](https://github.github.com/gfm/#example-277)

```markdown
1. - 2. foo
```

```html
<ol>
<li>
<ul>
<li>
<ol start="2">
<li>foo</li>
</ol>
</li>
</ul>
</li>
</ol>
```

A list item can contain a heading:

[Example 278](https://github.github.com/gfm/#example-278)

```markdown
- # Foo
- Bar
  ---
  baz
```

```html
<ul>
<li>
<h1>Foo</h1>
</li>
<li>
<h2>Bar</h2>
baz</li>
</ul>
```

### 5.2.1Motivation

John Gruber’s Markdown spec says the following about list items:

1. “List markers typically start at the left margin, but may be indented
   by up to three spaces. List markers must be followed by one or more
   spaces or a tab.”

2. “To make lists look nice, you can wrap items with hanging indents….
   But if you don’t want to, you don’t have to.”

3. “List items may consist of multiple paragraphs. Each subsequent
   paragraph in a list item must be indented by either 4 spaces or one
   tab.”

4. “It looks nice if you indent every line of the subsequent paragraphs,
   but here again, Markdown will allow you to be lazy.”

5. “To put a blockquote within a list item, the blockquote’s `>`
   delimiters need to be indented.”

6. “To put a code block within a list item, the code block needs to be
   indented twice — 8 spaces or two tabs.”


These rules specify that a paragraph under a list item must be indented
four spaces (presumably, from the left margin, rather than the start of
the list marker, but this is not said), and that code under a list item
must be indented eight spaces instead of the usual four. They also say
that a block quote must be indented, but not by how much; however, the
example given has four spaces indentation. Although nothing is said
about other kinds of block-level content, it is certainly reasonable to
infer that _all_ block elements under a list item, including other
lists, must be indented four spaces. This principle has been called the
_four-space rule_.

The four-space rule is clear and principled, and if the reference
implementation `Markdown.pl` had followed it, it probably would have
become the standard. However, `Markdown.pl` allowed paragraphs and
sublists to start with only two spaces indentation, at least on the
outer level. Worse, its behavior was inconsistent: a sublist of an
outer-level list needed two spaces indentation, but a sublist of this
sublist needed three spaces. It is not surprising, then, that different
implementations of Markdown have developed very different rules for
determining what comes under a list item. (Pandoc and python-Markdown,
for example, stuck with Gruber’s syntax description and the four-space
rule, while discount, redcarpet, marked, PHP Markdown, and others
followed `Markdown.pl`’s behavior more closely.)

Unfortunately, given the divergences between implementations, there
is no way to give a spec for list items that will be guaranteed not
to break any existing documents. However, the spec given here should
correctly handle lists formatted with either the four-space rule or
the more forgiving `Markdown.pl` behavior, provided they are laid out
in a way that is natural for a human to read.

The strategy here is to let the width and indentation of the list marker
determine the indentation necessary for blocks to fall under the list
item, rather than having a fixed and arbitrary number. The writer can
think of the body of the list item as a unit which gets indented to the
right enough to fit the list marker (and any indentation on the list
marker). (The laziness rule, #5, then allows continuation lines to be
unindented if needed.)

This rule is superior, we claim, to any rule requiring a fixed level of
indentation from the margin. The four-space rule is clear but
unnatural. It is quite unintuitive that

```markdown
- foo

  bar

  - baz
```

should be parsed as two lists with an intervening paragraph,

```html
<ul>
<li>foo</li>
</ul>
<p>bar</p>
<ul>
<li>baz</li>
</ul>
```

as the four-space rule demands, rather than a single list,

```html
<ul>
<li>
<p>foo</p>
<p>bar</p>
<ul>
<li>baz</li>
</ul>
</li>
</ul>
```

The choice of four spaces is arbitrary. It can be learned, but it is
not likely to be guessed, and it trips up beginners regularly.

Would it help to adopt a two-space rule? The problem is that such
a rule, together with the rule allowing 1–3 spaces indentation of the
initial list marker, allows text that is indented _less than_ the
original list marker to be included in the list item. For example,
`Markdown.pl` parses

```markdown
   - one

  two
```

as a single list item, with `two` a continuation paragraph:

```html
<ul>
<li>
<p>one</p>
<p>two</p>
</li>
</ul>
```

and similarly

```markdown
>   - one
>
>  two
```

as

```html
<blockquote>
<ul>
<li>
<p>one</p>
<p>two</p>
</li>
</ul>
</blockquote>
```

This is extremely unintuitive.

Rather than requiring a fixed indent from the margin, we could require
a fixed indent (say, two spaces, or even one space) from the list marker (which
may itself be indented). This proposal would remove the last anomaly
discussed. Unlike the spec presented above, it would count the following
as a list item with a subparagraph, even though the paragraph `bar`
is not indented as far as the first paragraph `foo`:

```markdown
 10. foo

   bar
```

Arguably this text does read like a list item with `bar` as a subparagraph,
which may count in favor of the proposal. However, on this proposal indented
code would have to be indented six spaces after the list marker. And this
would break a lot of existing Markdown, which has the pattern:

```markdown
1.  foo

        indented code
```

where the code is indented eight spaces. The spec above, by contrast, will
parse this text as expected, since the code block’s indentation is measured
from the beginning of `foo`.

The one case that needs special treatment is a list item that _starts_
with indented code. How much indentation is required in that case, since
we don’t have a “first paragraph” to measure from? Rule #2 simply stipulates
that in such cases, we require one space indentation from the list marker
(and then the normal four spaces for the indented code). This will match the
four-space rule in cases where the list marker plus its initial indentation
takes four spaces (a common case), but diverge in other cases.

## 5.3Task list items (extension)

GFM enables the `tasklist` extension, where an additional processing step is
performed on [list items](https://github.github.com/gfm/#list-items).

A [task list item](https://github.github.com/gfm/#task-list-item) is a [list item](https://github.github.com/gfm/#list-items) where the first block in it
is a paragraph which begins with a [task list item marker](https://github.github.com/gfm/#task-list-item-marker) and at least one
whitespace character before any other content.

A [task list item marker](https://github.github.com/gfm/#task-list-item-marker) consists of an optional number of spaces, a left
bracket (`[`), either a whitespace character or the letter `x` in either\
lowercase or uppercase, and then a right bracket (`]`).

When rendered, the [task list item marker](https://github.github.com/gfm/#task-list-item-marker) is replaced with a semantic checkbox element;
in an HTML output, this would be an `<input type="checkbox">` element.

If the character between the brackets is a whitespace character, the checkbox
is unchecked. Otherwise, the checkbox is checked.

This spec does not define how the checkbox elements are interacted with: in practice,
implementors are free to render the checkboxes as disabled or inmutable elements,
or they may dynamically handle dynamic interactions (i.e. checking, unchecking) in
the final rendered document.

[Example 279](https://github.github.com/gfm/#example-279)

```markdown
- [ ] foo
- [x] bar
```

```html
<ul>
<li><input disabled="" type="checkbox"> foo</li>
<li><input checked="" disabled="" type="checkbox"> bar</li>
</ul>
```

Task lists can be arbitrarily nested:

[Example 280](https://github.github.com/gfm/#example-280)

```markdown
- [x] foo
  - [ ] bar
  - [x] baz
- [ ] bim
```

```html
<ul>
<li><input checked="" disabled="" type="checkbox"> foo
<ul>
<li><input disabled="" type="checkbox"> bar</li>
<li><input checked="" disabled="" type="checkbox"> baz</li>
</ul>
</li>
<li><input disabled="" type="checkbox"> bim</li>
</ul>
```

## 5.4Lists

A [list](https://github.github.com/gfm/#list) is a sequence of one or more
list items [of the same type](https://github.github.com/gfm/#of-the-same-type). The list items
may be separated by any number of blank lines.

Two list items are [of the same type](https://github.github.com/gfm/#of-the-same-type)
if they begin with a [list marker](https://github.github.com/gfm/#list-marker) of the same type.
Two list markers are of the
same type if (a) they are bullet list markers using the same character
(`-`, `+`, or `*`) or (b) they are ordered list numbers with the same
delimiter (either `.` or `)`).

A list is an [ordered list](https://github.github.com/gfm/#ordered-list)
if its constituent list items begin with
[ordered list markers](https://github.github.com/gfm/#ordered-list-marker), and a
[bullet list](https://github.github.com/gfm/#bullet-list) if its constituent list
items begin with [bullet list markers](https://github.github.com/gfm/#bullet-list-marker).

The [start number](https://github.github.com/gfm/#start-number)
of an [ordered list](https://github.github.com/gfm/#ordered-list) is determined by the list number of
its initial list item. The numbers of subsequent list items are
disregarded.

A list is [loose](https://github.github.com/gfm/#loose) if any of its constituent
list items are separated by blank lines, or if any of its constituent
list items directly contain two block-level elements with a blank line
between them. Otherwise a list is [tight](https://github.github.com/gfm/#tight).
(The difference in HTML output is that paragraphs in a loose list are
wrapped in `<p>` tags, while paragraphs in a tight list are not.)

Changing the bullet or ordered list delimiter starts a new list:

[Example 281](https://github.github.com/gfm/#example-281)

```markdown
- foo
- bar
+ baz
```

```html
<ul>
<li>foo</li>
<li>bar</li>
</ul>
<ul>
<li>baz</li>
</ul>
```

[Example 282](https://github.github.com/gfm/#example-282)

```markdown
1. foo
2. bar
3) baz
```

```html
<ol>
<li>foo</li>
<li>bar</li>
</ol>
<ol start="3">
<li>baz</li>
</ol>
```

In CommonMark, a list can interrupt a paragraph. That is,
no blank line is needed to separate a paragraph from a following
list:

[Example 283](https://github.github.com/gfm/#example-283)

```markdown
Foo
- bar
- baz
```

```html
<p>Foo</p>
<ul>
<li>bar</li>
<li>baz</li>
</ul>
```

`Markdown.pl` does not allow this, through fear of triggering a list
via a numeral in a hard-wrapped line:

```markdown
The number of windows in my house is
14.  The number of doors is 6.
```

Oddly, though, `Markdown.pl` _does_ allow a blockquote to
interrupt a paragraph, even though the same considerations might
apply.

In CommonMark, we do allow lists to interrupt paragraphs, for
two reasons. First, it is natural and not uncommon for people
to start lists without blank lines:

```markdown
I need to buy
- new shoes
- a coat
- a plane ticket
```

Second, we are attracted to a

> [principle of uniformity](https://github.github.com/gfm/#principle-of-uniformity):
> if a chunk of text has a certain
> meaning, it will continue to have the same meaning when put into a
> container block (such as a list item or blockquote).

(Indeed, the spec for [list items](https://github.github.com/gfm/#list-items) and [block quotes](https://github.github.com/gfm/#block-quotes) presupposes
this principle.) This principle implies that if

```markdown
  * I need to buy
    - new shoes
    - a coat
    - a plane ticket
```

is a list item containing a paragraph followed by a nested sublist,
as all Markdown implementations agree it is (though the paragraph
may be rendered without `<p>` tags, since the list is “tight”),
then

```markdown
I need to buy
- new shoes
- a coat
- a plane ticket
```

by itself should be a paragraph followed by a nested sublist.

Since it is well established Markdown practice to allow lists to
interrupt paragraphs inside list items, the [principle of\\
uniformity](https://github.github.com/gfm/#principle-of-uniformity) requires us to allow this outside list items as
well. ( [reStructuredText](http://docutils.sourceforge.net/rst.html)
takes a different approach, requiring blank lines before lists
even inside other list items.)

In order to solve of unwanted lists in paragraphs with
hard-wrapped numerals, we allow only lists starting with `1` to
interrupt paragraphs. Thus,

[Example 284](https://github.github.com/gfm/#example-284)

```markdown
The number of windows in my house is
14.  The number of doors is 6.
```

```html
<p>The number of windows in my house is
14.  The number of doors is 6.</p>
```

We may still get an unintended result in cases like

[Example 285](https://github.github.com/gfm/#example-285)

```markdown
The number of windows in my house is
1.  The number of doors is 6.
```

```html
<p>The number of windows in my house is</p>
<ol>
<li>The number of doors is 6.</li>
</ol>
```

but this rule should prevent most spurious list captures.

There can be any number of blank lines between items:

[Example 286](https://github.github.com/gfm/#example-286)

```markdown
- foo

- bar

- baz
```

```html
<ul>
<li>
<p>foo</p>
</li>
<li>
<p>bar</p>
</li>
<li>
<p>baz</p>
</li>
</ul>
```

[Example 287](https://github.github.com/gfm/#example-287)

```markdown
- foo
  - bar
    - baz

      bim
```

```html
<ul>
<li>foo
<ul>
<li>bar
<ul>
<li>
<p>baz</p>
<p>bim</p>
</li>
</ul>
</li>
</ul>
</li>
</ul>
```

To separate consecutive lists of the same type, or to separate a
list from an indented code block that would otherwise be parsed
as a subparagraph of the final list item, you can insert a blank HTML
comment:

[Example 288](https://github.github.com/gfm/#example-288)

```markdown
- foo
- bar

<!-- -->

- baz
- bim
```

```html
<ul>
<li>foo</li>
<li>bar</li>
</ul>
<!-- -->
<ul>
<li>baz</li>
<li>bim</li>
</ul>
```

[Example 289](https://github.github.com/gfm/#example-289)

```markdown
-   foo

    notcode

-   foo

<!-- -->

    code
```

```html
<ul>
<li>
<p>foo</p>
<p>notcode</p>
</li>
<li>
<p>foo</p>
</li>
</ul>
<!-- -->
<pre><code>code
</code></pre>
```

List items need not be indented to the same level. The following
list items will be treated as items at the same list level,
since none is indented enough to belong to the previous list
item:

[Example 290](https://github.github.com/gfm/#example-290)

```markdown
- a
 - b
  - c
   - d
  - e
 - f
- g
```

```html
<ul>
<li>a</li>
<li>b</li>
<li>c</li>
<li>d</li>
<li>e</li>
<li>f</li>
<li>g</li>
</ul>
```

[Example 291](https://github.github.com/gfm/#example-291)

```markdown
1. a

  2. b

   3. c
```

```html
<ol>
<li>
<p>a</p>
</li>
<li>
<p>b</p>
</li>
<li>
<p>c</p>
</li>
</ol>
```

Note, however, that list items may not be indented more than
three spaces. Here `- e` is treated as a paragraph continuation
line, because it is indented more than three spaces:

[Example 292](https://github.github.com/gfm/#example-292)

```markdown
- a
 - b
  - c
   - d
    - e
```

```html
<ul>
<li>a</li>
<li>b</li>
<li>c</li>
<li>d
- e</li>
</ul>
```

And here, `3. c` is treated as in indented code block,
because it is indented four spaces and preceded by a
blank line.

[Example 293](https://github.github.com/gfm/#example-293)

```markdown
1. a

  2. b

    3. c
```

```html
<ol>
<li>
<p>a</p>
</li>
<li>
<p>b</p>
</li>
</ol>
<pre><code>3. c
</code></pre>
```

This is a loose list, because there is a blank line between
two of the list items:

[Example 294](https://github.github.com/gfm/#example-294)

```markdown
- a
- b

- c
```

```html
<ul>
<li>
<p>a</p>
</li>
<li>
<p>b</p>
</li>
<li>
<p>c</p>
</li>
</ul>
```

So is this, with a empty second item:

[Example 295](https://github.github.com/gfm/#example-295)

```markdown
* a
*

* c
```

```html
<ul>
<li>
<p>a</p>
</li>
<li></li>
<li>
<p>c</p>
</li>
</ul>
```

These are loose lists, even though there is no space between the items,
because one of the items directly contains two block-level elements
with a blank line between them:

[Example 296](https://github.github.com/gfm/#example-296)

```markdown
- a
- b

  c
- d
```

```html
<ul>
<li>
<p>a</p>
</li>
<li>
<p>b</p>
<p>c</p>
</li>
<li>
<p>d</p>
</li>
</ul>
```

[Example 297](https://github.github.com/gfm/#example-297)

```markdown
- a
- b

  [ref]: /url
- d
```

```html
<ul>
<li>
<p>a</p>
</li>
<li>
<p>b</p>
</li>
<li>
<p>d</p>
</li>
</ul>
```

This is a tight list, because the blank lines are in a code block:

[Example 298](https://github.github.com/gfm/#example-298)

````markdown
- a
- ```
  b

  ```
- c
````

```html
<ul>
<li>a</li>
<li>
<pre><code>b

</code></pre>
</li>
<li>c</li>
</ul>
```

This is a tight list, because the blank line is between two
paragraphs of a sublist. So the sublist is loose while
the outer list is tight:

[Example 299](https://github.github.com/gfm/#example-299)

```markdown
- a
  - b

    c
- d
```

```html
<ul>
<li>a
<ul>
<li>
<p>b</p>
<p>c</p>
</li>
</ul>
</li>
<li>d</li>
</ul>
```

This is a tight list, because the blank line is inside the
block quote:

[Example 300](https://github.github.com/gfm/#example-300)

```markdown
* a
  > b
  >
* c
```

```html
<ul>
<li>a
<blockquote>
<p>b</p>
</blockquote>
</li>
<li>c</li>
</ul>
```

This list is tight, because the consecutive block elements
are not separated by blank lines:

[Example 301](https://github.github.com/gfm/#example-301)

````markdown
- a
  > b
  ```
  c
  ```
- d
````

```html
<ul>
<li>a
<blockquote>
<p>b</p>
</blockquote>
<pre><code>c
</code></pre>
</li>
<li>d</li>
</ul>
```

A single-paragraph list is tight:

[Example 302](https://github.github.com/gfm/#example-302)

```markdown
- a
```

```html
<ul>
<li>a</li>
</ul>
```

[Example 303](https://github.github.com/gfm/#example-303)

```markdown
- a
  - b
```

```html
<ul>
<li>a
<ul>
<li>b</li>
</ul>
</li>
</ul>
```

This list is loose, because of the blank line between the
two block elements in the list item:

[Example 304](https://github.github.com/gfm/#example-304)

````markdown
1. ```
   foo
   ```

   bar
````

```html
<ol>
<li>
<pre><code>foo
</code></pre>
<p>bar</p>
</li>
</ol>
```

Here the outer list is loose, the inner list tight:

[Example 305](https://github.github.com/gfm/#example-305)

```markdown
* foo
  * bar

  baz
```

```html
<ul>
<li>
<p>foo</p>
<ul>
<li>bar</li>
</ul>
<p>baz</p>
</li>
</ul>
```

[Example 306](https://github.github.com/gfm/#example-306)

```markdown
- a
  - b
  - c

- d
  - e
  - f
```

```html
<ul>
<li>
<p>a</p>
<ul>
<li>b</li>
<li>c</li>
</ul>
</li>
<li>
<p>d</p>
<ul>
<li>e</li>
<li>f</li>
</ul>
</li>
</ul>
```

# 6Inlines

Inlines are parsed sequentially from the beginning of the character
stream to the end (left to right, in left-to-right languages).
Thus, for example, in

[Example 307](https://github.github.com/gfm/#example-307)

```markdown
`hi`lo`
```

```html
<p><code>hi</code>lo`</p>
```

`hi` is parsed as code, leaving the backtick at the end as a literal
backtick.

## 6.1Backslash escapes

Any ASCII punctuation character may be backslash-escaped:

[Example 308](https://github.github.com/gfm/#example-308)

```markdown
\!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\\\]\^\_\`\{\|\}\~
```

```html
<p>!&quot;#$%&amp;'()*+,-./:;&lt;=&gt;?@[\]^_`{|}~</p>
```

Backslashes before other characters are treated as literal
backslashes:

[Example 309](https://github.github.com/gfm/#example-309)

```markdown
\→\A\a\ \3\φ\«
```

```html
<p>\→\A\a\ \3\φ\«</p>
```

Escaped characters are treated as regular characters and do
not have their usual Markdown meanings:

[Example 310](https://github.github.com/gfm/#example-310)

```markdown
\*not emphasized*
\<br/> not a tag
\[not a link](/foo)
\`not code`
1\. not a list
\* not a list
\# not a heading
\[foo]: /url "not a reference"
\&ouml; not a character entity
```

```html
<p>*not emphasized*
&lt;br/&gt; not a tag
[not a link](/foo)
`not code`
1. not a list
* not a list
# not a heading
[foo]: /url &quot;not a reference&quot;
&amp;ouml; not a character entity</p>
```

If a backslash is itself escaped, the following character is not:

[Example 311](https://github.github.com/gfm/#example-311)

```markdown
\\*emphasis*
```

```html
<p>\<em>emphasis</em></p>
```

A backslash at the end of the line is a [hard line break](https://github.github.com/gfm/#hard-line-break):

[Example 312](https://github.github.com/gfm/#example-312)

```markdown
foo\
bar
```

```html
<p>foo<br />
bar</p>
```

Backslash escapes do not work in code blocks, code spans, autolinks, or
raw HTML:

[Example 313](https://github.github.com/gfm/#example-313)

```markdown
`` \[\` ``\
```\
\
```html\
<p><code>\[\`</code></p>\
```\
\
[Example 314](https://github.github.com/gfm/#example-314)\
\
```markdown\
    \[\]\
```\
\
```html\
<pre><code>\[\]\
</code></pre>\
```\
\
[Example 315](https://github.github.com/gfm/#example-315)\
\
```markdown\
~~~\
\[\]\
~~~\
```\
\
```html\
<pre><code>\[\]\
</code></pre>\
```\
\
[Example 316](https://github.github.com/gfm/#example-316)\
\
```markdown\
<http://example.com?find=\*>\
```\
\
```html\
<p><a href="http://example.com?find=%5C*">http://example.com?find=\*</a></p>\
```\
\
[Example 317](https://github.github.com/gfm/#example-317)\
\
```markdown\
<a href="/bar\/)">\
```\
\
```html\
<a href="/bar\/)">\
```\
\
But they work in all other contexts, including URLs and link titles,\
link references, and [info strings](https://github.github.com/gfm/#info-string) in [fenced code blocks](https://github.github.com/gfm/#fenced-code-blocks):\
\
[Example 318](https://github.github.com/gfm/#example-318)\
\
```markdown\
[foo](/bar\* "ti\*tle")\
```\
\
```html\
<p><a href="/bar*" title="ti*tle">foo</a></p>\
```\
\
[Example 319](https://github.github.com/gfm/#example-319)\
\
```markdown\
[foo]\
\
[foo]: /bar\* "ti\*tle"\
```\
\
```html\
<p><a href="/bar*" title="ti*tle">foo</a></p>\
```\
\
[Example 320](https://github.github.com/gfm/#example-320)\
\
````markdown\
``` foo\+bar\
foo\
```\
````\
\
```html\
<pre><code class="language-foo+bar">foo\
</code></pre>\
```\
\
## 6.2Entity and numeric character references\
\
Valid HTML entity references and numeric character references\
can be used in place of the corresponding Unicode character,\
with the following exceptions:\
\
- Entity and character references are not recognized in code\
  blocks and code spans.\
\
- Entity and character references cannot stand in place of\
  special characters that define structural elements in\
  CommonMark. For example, although `&#42;` can be used\
  in place of a literal `*` character, `&#42;` cannot replace\
  `*` in emphasis delimiters, bullet list markers, or thematic\
  breaks.\
\
\
Conforming CommonMark parsers need not store information about\
whether a particular character was represented in the source\
using a Unicode character or an entity reference.\
\
[Entity references](https://github.github.com/gfm/#entity-references) consist of `&` \+ any of the valid\
HTML5 entity names + `;`. The\
document [https://html.spec.whatwg.org/multipage/entities.json](https://html.spec.whatwg.org/multipage/entities.json)\
is used as an authoritative source for the valid entity\
references and their corresponding code points.\
\
[Example 321](https://github.github.com/gfm/#example-321)\
\
```markdown\
&nbsp; &amp; &copy; &AElig; &Dcaron;\
&frac34; &HilbertSpace; &DifferentialD;\
&ClockwiseContourIntegral; &ngE;\
```\
\
```html\
<p>  &amp; © Æ Ď\
¾ ℋ ⅆ\
∲ ≧̸</p>\
```\
\
[Decimal numeric character\\
references](https://github.github.com/gfm/#decimal-numeric-character-references)\
consist of `&#` \+ a string of 1–7 arabic digits + `;`. A\
numeric character reference is parsed as the corresponding\
Unicode character. Invalid Unicode code points will be replaced by\
the REPLACEMENT CHARACTER (`U+FFFD`). For security reasons,\
the code point `U+0000` will also be replaced by `U+FFFD`.\
\
[Example 322](https://github.github.com/gfm/#example-322)\
\
```markdown\
&#35; &#1234; &#992; &#0;\
```\
\
```html\
<p># Ӓ Ϡ �</p>\
```\
\
[Hexadecimal numeric character\\
references](https://github.github.com/gfm/#hexadecimal-numeric-character-references) consist of `&#` +\
either `X` or `x` \+ a string of 1-6 hexadecimal digits + `;`.\
They too are parsed as the corresponding Unicode character (this\
time specified with a hexadecimal numeral instead of decimal).\
\
[Example 323](https://github.github.com/gfm/#example-323)\
\
```markdown\
&#X22; &#XD06; &#xcab;\
```\
\
```html\
<p>&quot; ആ ಫ</p>\
```\
\
Here are some nonentities:\
\
[Example 324](https://github.github.com/gfm/#example-324)\
\
```markdown\
&nbsp &x; &#; &#x;\
&#87654321;\
&#abcdef0;\
&ThisIsNotDefined; &hi?;\
```\
\
```html\
<p>&amp;nbsp &amp;x; &amp;#; &amp;#x;\
&amp;#87654321;\
&amp;#abcdef0;\
&amp;ThisIsNotDefined; &amp;hi?;</p>\
```\
\
Although HTML5 does accept some entity references\
without a trailing semicolon (such as `&copy`), these are not\
recognized here, because it makes the grammar too ambiguous:\
\
[Example 325](https://github.github.com/gfm/#example-325)\
\
```markdown\
&copy\
```\
\
```html\
<p>&amp;copy</p>\
```\
\
Strings that are not on the list of HTML5 named entities are not\
recognized as entity references either:\
\
[Example 326](https://github.github.com/gfm/#example-326)\
\
```markdown\
&MadeUpEntity;\
```\
\
```html\
<p>&amp;MadeUpEntity;</p>\
```\
\
Entity and numeric character references are recognized in any\
context besides code spans or code blocks, including\
URLs, [link titles](https://github.github.com/gfm/#link-title), and [fenced code block](https://github.github.com/gfm/#fenced-code-block) [info strings](https://github.github.com/gfm/#info-string):\
\
[Example 327](https://github.github.com/gfm/#example-327)\
\
```markdown\
<a href="&ouml;&ouml;.html">\
```\
\
```html\
<a href="&ouml;&ouml;.html">\
```\
\
[Example 328](https://github.github.com/gfm/#example-328)\
\
```markdown\
[foo](/f&ouml;&ouml; "f&ouml;&ouml;")\
```\
\
```html\
<p><a href="/f%C3%B6%C3%B6" title="föö">foo</a></p>\
```\
\
[Example 329](https://github.github.com/gfm/#example-329)\
\
```markdown\
[foo]\
\
[foo]: /f&ouml;&ouml; "f&ouml;&ouml;"\
```\
\
```html\
<p><a href="/f%C3%B6%C3%B6" title="föö">foo</a></p>\
```\
\
[Example 330](https://github.github.com/gfm/#example-330)\
\
````markdown\
``` f&ouml;&ouml;\
foo\
```\
````\
\
```html\
<pre><code class="language-föö">foo\
</code></pre>\
```\
\
Entity and numeric character references are treated as literal\
text in code spans and code blocks:\
\
[Example 331](https://github.github.com/gfm/#example-331)\
\
```markdown\
`f&ouml;&ouml;`\
```\
\
```html\
<p><code>f&amp;ouml;&amp;ouml;</code></p>\
```\
\
[Example 332](https://github.github.com/gfm/#example-332)\
\
```markdown\
    f&ouml;f&ouml;\
```\
\
```html\
<pre><code>f&amp;ouml;f&amp;ouml;\
</code></pre>\
```\
\
Entity and numeric character references cannot be used\
in place of symbols indicating structure in CommonMark\
documents.\
\
[Example 333](https://github.github.com/gfm/#example-333)\
\
```markdown\
&#42;foo&#42;\
*foo*\
```\
\
```html\
<p>*foo*\
<em>foo</em></p>\
```\
\
[Example 334](https://github.github.com/gfm/#example-334)\
\
```markdown\
&#42; foo\
\
* foo\
```\
\
```html\
<p>* foo</p>\
<ul>\
<li>foo</li>\
</ul>\
```\
\
[Example 335](https://github.github.com/gfm/#example-335)\
\
```markdown\
foo&#10;&#10;bar\
```\
\
```html\
<p>foo\
\
bar</p>\
```\
\
[Example 336](https://github.github.com/gfm/#example-336)\
\
```markdown\
&#9;foo\
```\
\
```html\
<p>→foo</p>\
```\
\
[Example 337](https://github.github.com/gfm/#example-337)\
\
```markdown\
[a](url &quot;tit&quot;)\
```\
\
```html\
<p>[a](url &quot;tit&quot;)</p>\
```\
\
## 6.3Code spans\
\
A [backtick string](https://github.github.com/gfm/#backtick-string)\
is a string of one or more backtick characters (`````) that is neither\
preceded nor followed by a backtick.\
\
A [code span](https://github.github.com/gfm/#code-span) begins with a backtick string and ends with\
a backtick string of equal length. The contents of the code span are\
the characters between the two backtick strings, normalized in the\
following ways:\
\
- First, [line endings](https://github.github.com/gfm/#line-ending) are converted to [spaces](https://github.github.com/gfm/#space).\
- If the resulting string both begins _and_ ends with a [space](https://github.github.com/gfm/#space)\
  character, but does not consist entirely of [space](https://github.github.com/gfm/#space)\
  characters, a single [space](https://github.github.com/gfm/#space) character is removed from the\
  front and back. This allows you to include code that begins\
  or ends with backtick characters, which must be separated by\
  whitespace from the opening or closing backtick strings.\
\
This is a simple code span:\
\
[Example 338](https://github.github.com/gfm/#example-338)\
\
```markdown\
`foo`\
```\
\
```html\
<p><code>foo</code></p>\
```\
\
Here two backticks are used, because the code contains a backtick.\
This example also illustrates stripping of a single leading and\
trailing space:\
\
[Example 339](https://github.github.com/gfm/#example-339)\
\
```markdown\
`` foo ` bar ``\
```\
\
```html\
<p><code>foo ` bar</code></p>\
```\
\
This example shows the motivation for stripping leading and trailing\
spaces:\
\
[Example 340](https://github.github.com/gfm/#example-340)\
\
```markdown\
` `` `\
```\
\
```html\
<p><code>``</code></p>\
```\
\
Note that only _one_ space is stripped:\
\
[Example 341](https://github.github.com/gfm/#example-341)\
\
```markdown\
`  ``  `\
```\
\
```html\
<p><code> `` </code></p>\
```\
\
The stripping only happens if the space is on both\
sides of the string:\
\
[Example 342](https://github.github.com/gfm/#example-342)\
\
```markdown\
` a`\
```\
\
```html\
<p><code> a</code></p>\
```\
\
Only [spaces](https://github.github.com/gfm/#space), and not [unicode whitespace](https://github.github.com/gfm/#unicode-whitespace) in general, are\
stripped in this way:\
\
[Example 343](https://github.github.com/gfm/#example-343)\
\
```markdown\
` b `\
```\
\
```html\
<p><code> b </code></p>\
```\
\
No stripping occurs if the code span contains only spaces:\
\
[Example 344](https://github.github.com/gfm/#example-344)\
\
```markdown\
` `\
`  `\
```\
\
```html\
<p><code> </code>\
<code>  </code></p>\
```\
\
[Line endings](https://github.github.com/gfm/#line-ending) are treated like spaces:\
\
[Example 345](https://github.github.com/gfm/#example-345)\
\
```markdown\
``\
foo\
bar\
baz\
``\
```\
\
```html\
<p><code>foo bar   baz</code></p>\
```\
\
[Example 346](https://github.github.com/gfm/#example-346)\
\
```markdown\
``\
foo\
``\
```\
\
```html\
<p><code>foo </code></p>\
```\
\
Interior spaces are not collapsed:\
\
[Example 347](https://github.github.com/gfm/#example-347)\
\
```markdown\
`foo   bar\
baz`\
```\
\
```html\
<p><code>foo   bar  baz</code></p>\
```\
\
Note that browsers will typically collapse consecutive spaces\
when rendering `<code>` elements, so it is recommended that\
the following CSS be used:\
\
```\
code{white-space: pre-wrap;}\
```\
\
Note that backslash escapes do not work in code spans. All backslashes\
are treated literally:\
\
[Example 348](https://github.github.com/gfm/#example-348)\
\
```markdown\
`foo\`bar`\
```\
\
```html\
<p><code>foo\</code>bar`</p>\
```\
\
Backslash escapes are never needed, because one can always choose a\
string of _n_ backtick characters as delimiters, where the code does\
not contain any strings of exactly _n_ backtick characters.\
\
[Example 349](https://github.github.com/gfm/#example-349)\
\
```markdown\
``foo`bar``\
```\
\
```html\
<p><code>foo`bar</code></p>\
```\
\
[Example 350](https://github.github.com/gfm/#example-350)\
\
```markdown\
` foo `` bar `\
```\
\
```html\
<p><code>foo `` bar</code></p>\
```\
\
Code span backticks have higher precedence than any other inline\
constructs except HTML tags and autolinks. Thus, for example, this is\
not parsed as emphasized text, since the second `*` is part of a code\
span:\
\
[Example 351](https://github.github.com/gfm/#example-351)\
\
```markdown\
*foo`*`\
```\
\
```html\
<p>*foo<code>*</code></p>\
```\
\
And this is not parsed as a link:\
\
[Example 352](https://github.github.com/gfm/#example-352)\
\
```markdown\
[not a `link](/foo`)\
```\
\
```html\
<p>[not a <code>link](/foo</code>)</p>\
```\
\
Code spans, HTML tags, and autolinks have the same precedence.\
Thus, this is code:\
\
[Example 353](https://github.github.com/gfm/#example-353)\
\
```markdown\
`<a href="`">`\
```\
\
```html\
<p><code>&lt;a href=&quot;</code>&quot;&gt;`</p>\
```\
\
But this is an HTML tag:\
\
[Example 354](https://github.github.com/gfm/#example-354)\
\
```markdown\
<a href="`">`\
```\
\
```html\
<p><a href="`">`</p>\
```\
\
And this is code:\
\
[Example 355](https://github.github.com/gfm/#example-355)\
\
```markdown\
`<http://foo.bar.`baz>`\
```\
\
```html\
<p><code>&lt;http://foo.bar.</code>baz&gt;`</p>\
```\
\
But this is an autolink:\
\
[Example 356](https://github.github.com/gfm/#example-356)\
\
```markdown\
<http://foo.bar.`baz>`\
```\
\
```html\
<p><a href="http://foo.bar.%60baz">http://foo.bar.`baz</a>`</p>\
```\
\
When a backtick string is not closed by a matching backtick string,\
we just have literal backticks:\
\
[Example 357](https://github.github.com/gfm/#example-357)\
\
````markdown\
```foo``\
````\
\
````html\
<p>```foo``</p>\
````\
\
[Example 358](https://github.github.com/gfm/#example-358)\
\
```markdown\
`foo\
```\
\
```html\
<p>`foo</p>\
```\
\
The following case also illustrates the need for opening and\
closing backtick strings to be equal in length:\
\
[Example 359](https://github.github.com/gfm/#example-359)\
\
```markdown\
`foo``bar``\
```\
\
```html\
<p>`foo<code>bar</code></p>\
```\
\
## 6.4Emphasis and strong emphasis\
\
John Gruber’s original [Markdown syntax\\
description](http://daringfireball.net/projects/markdown/syntax#em) says:\
\
> Markdown treats asterisks (`*`) and underscores (`_`) as indicators of\
> emphasis. Text wrapped with one `*` or `_` will be wrapped with an HTML\
> `<em>` tag; double `*`’s or `_`’s will be wrapped with an HTML `<strong>`\
> tag.\
\
This is enough for most users, but these rules leave much undecided,\
especially when it comes to nested emphasis. The original\
`Markdown.pl` test suite makes it clear that triple `***` and\
`___` delimiters can be used for strong emphasis, and most\
implementations have also allowed the following patterns:\
\
```markdown\
***strong emph***\
***strong** in emph*\
***emph* in strong**\
**in strong *emph***\
*in emph **strong***\
```\
\
The following patterns are less widely supported, but the intent\
is clear and they are useful (especially in contexts like bibliography\
entries):\
\
```markdown\
*emph *with emph* in it*\
**strong **with strong** in it**\
```\
\
Many implementations have also restricted intraword emphasis to\
the `*` forms, to avoid unwanted emphasis in words containing\
internal underscores. (It is best practice to put these in code\
spans, but users often do not.)\
\
```markdown\
internal emphasis: foo*bar*baz\
no emphasis: foo_bar_baz\
```\
\
The rules given below capture all of these patterns, while allowing\
for efficient parsing strategies that do not backtrack.\
\
First, some definitions. A [delimiter run](https://github.github.com/gfm/#delimiter-run) is either\
a sequence of one or more `*` characters that is not preceded or\
followed by a non-backslash-escaped `*` character, or a sequence\
of one or more `_` characters that is not preceded or followed by\
a non-backslash-escaped `_` character.\
\
A [left-flanking delimiter run](https://github.github.com/gfm/#left-flanking-delimiter-run) is\
a [delimiter run](https://github.github.com/gfm/#delimiter-run) that is (1) not followed by [Unicode whitespace](https://github.github.com/gfm/#unicode-whitespace),\
and either (2a) not followed by a [punctuation character](https://github.github.com/gfm/#punctuation-character), or\
(2b) followed by a [punctuation character](https://github.github.com/gfm/#punctuation-character) and\
preceded by [Unicode whitespace](https://github.github.com/gfm/#unicode-whitespace) or a [punctuation character](https://github.github.com/gfm/#punctuation-character).\
For purposes of this definition, the beginning and the end of\
the line count as Unicode whitespace.\
\
A [right-flanking delimiter run](https://github.github.com/gfm/#right-flanking-delimiter-run) is\
a [delimiter run](https://github.github.com/gfm/#delimiter-run) that is (1) not preceded by [Unicode whitespace](https://github.github.com/gfm/#unicode-whitespace),\
and either (2a) not preceded by a [punctuation character](https://github.github.com/gfm/#punctuation-character), or\
(2b) preceded by a [punctuation character](https://github.github.com/gfm/#punctuation-character) and\
followed by [Unicode whitespace](https://github.github.com/gfm/#unicode-whitespace) or a [punctuation character](https://github.github.com/gfm/#punctuation-character).\
For purposes of this definition, the beginning and the end of\
the line count as Unicode whitespace.\
\
Here are some examples of delimiter runs.\
\
- left-flanking but not right-flanking:\
\
\
  ```\
  ***abc\
    _abc\
  **"abc"\
   _"abc"\
  ```\
\
- right-flanking but not left-flanking:\
\
\
  ```\
   abc***\
   abc_\
  "abc"**\
  "abc"_\
  ```\
\
- Both left and right-flanking:\
\
\
  ```\
   abc***def\
  "abc"_"def"\
  ```\
\
- Neither left nor right-flanking:\
\
\
  ```\
  abc *** def\
  a _ b\
  ```\
\
\
(The idea of distinguishing left-flanking and right-flanking\
delimiter runs based on the character before and the character\
after comes from Roopesh Chander’s\
[vfmd](http://www.vfmd.org/vfmd-spec/specification/#procedure-for-identifying-emphasis-tags).\
vfmd uses the terminology “emphasis indicator string” instead of “delimiter\
run,” and its rules for distinguishing left- and right-flanking runs\
are a bit more complex than the ones given here.)\
\
The following rules define emphasis and strong emphasis:\
\
01. A single `*` character [can open emphasis](https://github.github.com/gfm/#can-open-emphasis)\
    iff (if and only if) it is part of a [left-flanking delimiter run](https://github.github.com/gfm/#left-flanking-delimiter-run).\
\
02. A single `_` character [can open emphasis](https://github.github.com/gfm/#can-open-emphasis) iff\
    it is part of a [left-flanking delimiter run](https://github.github.com/gfm/#left-flanking-delimiter-run)\
    and either (a) not part of a [right-flanking delimiter run](https://github.github.com/gfm/#right-flanking-delimiter-run)\
    or (b) part of a [right-flanking delimiter run](https://github.github.com/gfm/#right-flanking-delimiter-run)\
    preceded by punctuation.\
\
03. A single `*` character [can close emphasis](https://github.github.com/gfm/#can-close-emphasis)\
    iff it is part of a [right-flanking delimiter run](https://github.github.com/gfm/#right-flanking-delimiter-run).\
\
04. A single `_` character [can close emphasis](https://github.github.com/gfm/#can-close-emphasis) iff\
    it is part of a [right-flanking delimiter run](https://github.github.com/gfm/#right-flanking-delimiter-run)\
    and either (a) not part of a [left-flanking delimiter run](https://github.github.com/gfm/#left-flanking-delimiter-run)\
    or (b) part of a [left-flanking delimiter run](https://github.github.com/gfm/#left-flanking-delimiter-run)\
    followed by punctuation.\
\
05. A double `**` [can open strong emphasis](https://github.github.com/gfm/#can-open-strong-emphasis)\
    iff it is part of a [left-flanking delimiter run](https://github.github.com/gfm/#left-flanking-delimiter-run).\
\
06. A double `__` [can open strong emphasis](https://github.github.com/gfm/#can-open-strong-emphasis) iff\
    it is part of a [left-flanking delimiter run](https://github.github.com/gfm/#left-flanking-delimiter-run)\
    and either (a) not part of a [right-flanking delimiter run](https://github.github.com/gfm/#right-flanking-delimiter-run)\
    or (b) part of a [right-flanking delimiter run](https://github.github.com/gfm/#right-flanking-delimiter-run)\
    preceded by punctuation.\
\
07. A double `**` [can close strong emphasis](https://github.github.com/gfm/#can-close-strong-emphasis)\
    iff it is part of a [right-flanking delimiter run](https://github.github.com/gfm/#right-flanking-delimiter-run).\
\
08. A double `__` [can close strong emphasis](https://github.github.com/gfm/#can-close-strong-emphasis) iff\
    it is part of a [right-flanking delimiter run](https://github.github.com/gfm/#right-flanking-delimiter-run)\
    and either (a) not part of a [left-flanking delimiter run](https://github.github.com/gfm/#left-flanking-delimiter-run)\
    or (b) part of a [left-flanking delimiter run](https://github.github.com/gfm/#left-flanking-delimiter-run)\
    followed by punctuation.\
\
09. Emphasis begins with a delimiter that [can open emphasis](https://github.github.com/gfm/#can-open-emphasis) and ends\
    with a delimiter that [can close emphasis](https://github.github.com/gfm/#can-close-emphasis), and that uses the same\
    character (`_` or `*`) as the opening delimiter. The\
    opening and closing delimiters must belong to separate\
    [delimiter runs](https://github.github.com/gfm/#delimiter-run). If one of the delimiters can both\
    open and close emphasis, then the sum of the lengths of the\
    delimiter runs containing the opening and closing delimiters\
    must not be a multiple of 3 unless both lengths are\
    multiples of 3.\
\
10. Strong emphasis begins with a delimiter that\
    [can open strong emphasis](https://github.github.com/gfm/#can-open-strong-emphasis) and ends with a delimiter that\
    [can close strong emphasis](https://github.github.com/gfm/#can-close-strong-emphasis), and that uses the same character\
    (`_` or `*`) as the opening delimiter. The\
    opening and closing delimiters must belong to separate\
    [delimiter runs](https://github.github.com/gfm/#delimiter-run). If one of the delimiters can both open\
    and close strong emphasis, then the sum of the lengths of\
    the delimiter runs containing the opening and closing\
    delimiters must not be a multiple of 3 unless both lengths\
    are multiples of 3.\
\
11. A literal `*` character cannot occur at the beginning or end of\
    `*`-delimited emphasis or `**`-delimited strong emphasis, unless it\
    is backslash-escaped.\
\
12. A literal `_` character cannot occur at the beginning or end of\
    `_`-delimited emphasis or `__`-delimited strong emphasis, unless it\
    is backslash-escaped.\
\
\
Where rules 1–12 above are compatible with multiple parsings,\
the following principles resolve ambiguity:\
\
13. The number of nestings should be minimized. Thus, for example,\
    an interpretation `<strong>...</strong>` is always preferred to\
    `<em><em>...</em></em>`.\
\
14. An interpretation `<em><strong>...</strong></em>` is always\
    preferred to `<strong><em>...</em></strong>`.\
\
15. When two potential emphasis or strong emphasis spans overlap,\
    so that the second begins before the first ends and ends after\
    the first ends, the first takes precedence. Thus, for example,\
    `*foo _bar* baz_` is parsed as `<em>foo _bar</em> baz_` rather\
    than `*foo <em>bar* baz</em>`.\
\
16. When there are two potential emphasis or strong emphasis spans\
    with the same closing delimiter, the shorter one (the one that\
    opens later) takes precedence. Thus, for example,\
    `**foo **bar baz**` is parsed as `**foo <strong>bar baz</strong>`\
    rather than `<strong>foo **bar baz</strong>`.\
\
17. Inline code spans, links, images, and HTML tags group more tightly\
    than emphasis. So, when there is a choice between an interpretation\
    that contains one of these elements and one that does not, the\
    former always wins. Thus, for example, `*[foo*](bar)` is\
    parsed as `*<a href="bar">foo*</a>` rather than as\
    `<em>[foo</em>](bar)`.\
\
\
These rules can be illustrated through a series of examples.\
\
Rule 1:\
\
[Example 360](https://github.github.com/gfm/#example-360)\
\
```markdown\
*foo bar*\
```\
\
```html\
<p><em>foo bar</em></p>\
```\
\
This is not emphasis, because the opening `*` is followed by\
whitespace, and hence not part of a [left-flanking delimiter run](https://github.github.com/gfm/#left-flanking-delimiter-run):\
\
[Example 361](https://github.github.com/gfm/#example-361)\
\
```markdown\
a * foo bar*\
```\
\
```html\
<p>a * foo bar*</p>\
```\
\
This is not emphasis, because the opening `*` is preceded\
by an alphanumeric and followed by punctuation, and hence\
not part of a [left-flanking delimiter run](https://github.github.com/gfm/#left-flanking-delimiter-run):\
\
[Example 362](https://github.github.com/gfm/#example-362)\
\
```markdown\
a*"foo"*\
```\
\
```html\
<p>a*&quot;foo&quot;*</p>\
```\
\
Unicode nonbreaking spaces count as whitespace, too:\
\
[Example 363](https://github.github.com/gfm/#example-363)\
\
```markdown\
* a *\
```\
\
```html\
<p>* a *</p>\
```\
\
Intraword emphasis with `*` is permitted:\
\
[Example 364](https://github.github.com/gfm/#example-364)\
\
```markdown\
foo*bar*\
```\
\
```html\
<p>foo<em>bar</em></p>\
```\
\
[Example 365](https://github.github.com/gfm/#example-365)\
\
```markdown\
5*6*78\
```\
\
```html\
<p>5<em>6</em>78</p>\
```\
\
Rule 2:\
\
[Example 366](https://github.github.com/gfm/#example-366)\
\
```markdown\
_foo bar_\
```\
\
```html\
<p><em>foo bar</em></p>\
```\
\
This is not emphasis, because the opening `_` is followed by\
whitespace:\
\
[Example 367](https://github.github.com/gfm/#example-367)\
\
```markdown\
_ foo bar_\
```\
\
```html\
<p>_ foo bar_</p>\
```\
\
This is not emphasis, because the opening `_` is preceded\
by an alphanumeric and followed by punctuation:\
\
[Example 368](https://github.github.com/gfm/#example-368)\
\
```markdown\
a_"foo"_\
```\
\
```html\
<p>a_&quot;foo&quot;_</p>\
```\
\
Emphasis with `_` is not allowed inside words:\
\
[Example 369](https://github.github.com/gfm/#example-369)\
\
```markdown\
foo_bar_\
```\
\
```html\
<p>foo_bar_</p>\
```\
\
[Example 370](https://github.github.com/gfm/#example-370)\
\
```markdown\
5_6_78\
```\
\
```html\
<p>5_6_78</p>\
```\
\
[Example 371](https://github.github.com/gfm/#example-371)\
\
```markdown\
пристаням_стремятся_\
```\
\
```html\
<p>пристаням_стремятся_</p>\
```\
\
Here `_` does not generate emphasis, because the first delimiter run\
is right-flanking and the second left-flanking:\
\
[Example 372](https://github.github.com/gfm/#example-372)\
\
```markdown\
aa_"bb"_cc\
```\
\
```html\
<p>aa_&quot;bb&quot;_cc</p>\
```\
\
This is emphasis, even though the opening delimiter is\
both left- and right-flanking, because it is preceded by\
punctuation:\
\
[Example 373](https://github.github.com/gfm/#example-373)\
\
```markdown\
foo-_(bar)_\
```\
\
```html\
<p>foo-<em>(bar)</em></p>\
```\
\
Rule 3:\
\
This is not emphasis, because the closing delimiter does\
not match the opening delimiter:\
\
[Example 374](https://github.github.com/gfm/#example-374)\
\
```markdown\
_foo*\
```\
\
```html\
<p>_foo*</p>\
```\
\
This is not emphasis, because the closing `*` is preceded by\
whitespace:\
\
[Example 375](https://github.github.com/gfm/#example-375)\
\
```markdown\
*foo bar *\
```\
\
```html\
<p>*foo bar *</p>\
```\
\
A newline also counts as whitespace:\
\
[Example 376](https://github.github.com/gfm/#example-376)\
\
```markdown\
*foo bar\
*\
```\
\
```html\
<p>*foo bar\
*</p>\
```\
\
This is not emphasis, because the second `*` is\
preceded by punctuation and followed by an alphanumeric\
(hence it is not part of a [right-flanking delimiter run](https://github.github.com/gfm/#right-flanking-delimiter-run):\
\
[Example 377](https://github.github.com/gfm/#example-377)\
\
```markdown\
*(*foo)\
```\
\
```html\
<p>*(*foo)</p>\
```\
\
The point of this restriction is more easily appreciated\
with this example:\
\
[Example 378](https://github.github.com/gfm/#example-378)\
\
```markdown\
*(*foo*)*\
```\
\
```html\
<p><em>(<em>foo</em>)</em></p>\
```\
\
Intraword emphasis with `*` is allowed:\
\
[Example 379](https://github.github.com/gfm/#example-379)\
\
```markdown\
*foo*bar\
```\
\
```html\
<p><em>foo</em>bar</p>\
```\
\
Rule 4:\
\
This is not emphasis, because the closing `_` is preceded by\
whitespace:\
\
[Example 380](https://github.github.com/gfm/#example-380)\
\
```markdown\
_foo bar _\
```\
\
```html\
<p>_foo bar _</p>\
```\
\
This is not emphasis, because the second `_` is\
preceded by punctuation and followed by an alphanumeric:\
\
[Example 381](https://github.github.com/gfm/#example-381)\
\
```markdown\
_(_foo)\
```\
\
```html\
<p>_(_foo)</p>\
```\
\
This is emphasis within emphasis:\
\
[Example 382](https://github.github.com/gfm/#example-382)\
\
```markdown\
_(_foo_)_\
```\
\
```html\
<p><em>(<em>foo</em>)</em></p>\
```\
\
Intraword emphasis is disallowed for `_`:\
\
[Example 383](https://github.github.com/gfm/#example-383)\
\
```markdown\
_foo_bar\
```\
\
```html\
<p>_foo_bar</p>\
```\
\
[Example 384](https://github.github.com/gfm/#example-384)\
\
```markdown\
_пристаням_стремятся\
```\
\
```html\
<p>_пристаням_стремятся</p>\
```\
\
[Example 385](https://github.github.com/gfm/#example-385)\
\
```markdown\
_foo_bar_baz_\
```\
\
```html\
<p><em>foo_bar_baz</em></p>\
```\
\
This is emphasis, even though the closing delimiter is\
both left- and right-flanking, because it is followed by\
punctuation:\
\
[Example 386](https://github.github.com/gfm/#example-386)\
\
```markdown\
_(bar)_.\
```\
\
```html\
<p><em>(bar)</em>.</p>\
```\
\
Rule 5:\
\
[Example 387](https://github.github.com/gfm/#example-387)\
\
```markdown\
**foo bar**\
```\
\
```html\
<p><strong>foo bar</strong></p>\
```\
\
This is not strong emphasis, because the opening delimiter is\
followed by whitespace:\
\
[Example 388](https://github.github.com/gfm/#example-388)\
\
```markdown\
** foo bar**\
```\
\
```html\
<p>** foo bar**</p>\
```\
\
This is not strong emphasis, because the opening `**` is preceded\
by an alphanumeric and followed by punctuation, and hence\
not part of a [left-flanking delimiter run](https://github.github.com/gfm/#left-flanking-delimiter-run):\
\
[Example 389](https://github.github.com/gfm/#example-389)\
\
```markdown\
a**"foo"**\
```\
\
```html\
<p>a**&quot;foo&quot;**</p>\
```\
\
Intraword strong emphasis with `**` is permitted:\
\
[Example 390](https://github.github.com/gfm/#example-390)\
\
```markdown\
foo**bar**\
```\
\
```html\
<p>foo<strong>bar</strong></p>\
```\
\
Rule 6:\
\
[Example 391](https://github.github.com/gfm/#example-391)\
\
```markdown\
__foo bar__\
```\
\
```html\
<p><strong>foo bar</strong></p>\
```\
\
This is not strong emphasis, because the opening delimiter is\
followed by whitespace:\
\
[Example 392](https://github.github.com/gfm/#example-392)\
\
```markdown\
__ foo bar__\
```\
\
```html\
<p>__ foo bar__</p>\
```\
\
A newline counts as whitespace:\
\
[Example 393](https://github.github.com/gfm/#example-393)\
\
```markdown\
__\
foo bar__\
```\
\
```html\
<p>__\
foo bar__</p>\
```\
\
This is not strong emphasis, because the opening `__` is preceded\
by an alphanumeric and followed by punctuation:\
\
[Example 394](https://github.github.com/gfm/#example-394)\
\
```markdown\
a__"foo"__\
```\
\
```html\
<p>a__&quot;foo&quot;__</p>\
```\
\
Intraword strong emphasis is forbidden with `__`:\
\
[Example 395](https://github.github.com/gfm/#example-395)\
\
```markdown\
foo__bar__\
```\
\
```html\
<p>foo__bar__</p>\
```\
\
[Example 396](https://github.github.com/gfm/#example-396)\
\
```markdown\
5__6__78\
```\
\
```html\
<p>5__6__78</p>\
```\
\
[Example 397](https://github.github.com/gfm/#example-397)\
\
```markdown\
пристаням__стремятся__\
```\
\
```html\
<p>пристаням__стремятся__</p>\
```\
\
[Example 398](https://github.github.com/gfm/#example-398)\
\
```markdown\
__foo, __bar__, baz__\
```\
\
```html\
<p><strong>foo, <strong>bar</strong>, baz</strong></p>\
```\
\
This is strong emphasis, even though the opening delimiter is\
both left- and right-flanking, because it is preceded by\
punctuation:\
\
[Example 399](https://github.github.com/gfm/#example-399)\
\
```markdown\
foo-__(bar)__\
```\
\
```html\
<p>foo-<strong>(bar)</strong></p>\
```\
\
Rule 7:\
\
This is not strong emphasis, because the closing delimiter is preceded\
by whitespace:\
\
[Example 400](https://github.github.com/gfm/#example-400)\
\
```markdown\
**foo bar **\
```\
\
```html\
<p>**foo bar **</p>\
```\
\
(Nor can it be interpreted as an emphasized `*foo bar *`, because of\
Rule 11.)\
\
This is not strong emphasis, because the second `**` is\
preceded by punctuation and followed by an alphanumeric:\
\
[Example 401](https://github.github.com/gfm/#example-401)\
\
```markdown\
**(**foo)\
```\
\
```html\
<p>**(**foo)</p>\
```\
\
The point of this restriction is more easily appreciated\
with these examples:\
\
[Example 402](https://github.github.com/gfm/#example-402)\
\
```markdown\
*(**foo**)*\
```\
\
```html\
<p><em>(<strong>foo</strong>)</em></p>\
```\
\
[Example 403](https://github.github.com/gfm/#example-403)\
\
```markdown\
**Gomphocarpus (*Gomphocarpus physocarpus*, syn.\
*Asclepias physocarpa*)**\
```\
\
```html\
<p><strong>Gomphocarpus (<em>Gomphocarpus physocarpus</em>, syn.\
<em>Asclepias physocarpa</em>)</strong></p>\
```\
\
[Example 404](https://github.github.com/gfm/#example-404)\
\
```markdown\
**foo "*bar*" foo**\
```\
\
```html\
<p><strong>foo &quot;<em>bar</em>&quot; foo</strong></p>\
```\
\
Intraword emphasis:\
\
[Example 405](https://github.github.com/gfm/#example-405)\
\
```markdown\
**foo**bar\
```\
\
```html\
<p><strong>foo</strong>bar</p>\
```\
\
Rule 8:\
\
This is not strong emphasis, because the closing delimiter is\
preceded by whitespace:\
\
[Example 406](https://github.github.com/gfm/#example-406)\
\
```markdown\
__foo bar __\
```\
\
```html\
<p>__foo bar __</p>\
```\
\
This is not strong emphasis, because the second `__` is\
preceded by punctuation and followed by an alphanumeric:\
\
[Example 407](https://github.github.com/gfm/#example-407)\
\
```markdown\
__(__foo)\
```\
\
```html\
<p>__(__foo)</p>\
```\
\
The point of this restriction is more easily appreciated\
with this example:\
\
[Example 408](https://github.github.com/gfm/#example-408)\
\
```markdown\
_(__foo__)_\
```\
\
```html\
<p><em>(<strong>foo</strong>)</em></p>\
```\
\
Intraword strong emphasis is forbidden with `__`:\
\
[Example 409](https://github.github.com/gfm/#example-409)\
\
```markdown\
__foo__bar\
```\
\
```html\
<p>__foo__bar</p>\
```\
\
[Example 410](https://github.github.com/gfm/#example-410)\
\
```markdown\
__пристаням__стремятся\
```\
\
```html\
<p>__пристаням__стремятся</p>\
```\
\
[Example 411](https://github.github.com/gfm/#example-411)\
\
```markdown\
__foo__bar__baz__\
```\
\
```html\
<p><strong>foo__bar__baz</strong></p>\
```\
\
This is strong emphasis, even though the closing delimiter is\
both left- and right-flanking, because it is followed by\
punctuation:\
\
[Example 412](https://github.github.com/gfm/#example-412)\
\
```markdown\
__(bar)__.\
```\
\
```html\
<p><strong>(bar)</strong>.</p>\
```\
\
Rule 9:\
\
Any nonempty sequence of inline elements can be the contents of an\
emphasized span.\
\
[Example 413](https://github.github.com/gfm/#example-413)\
\
```markdown\
*foo [bar](/url)*\
```\
\
```html\
<p><em>foo <a href="/url">bar</a></em></p>\
```\
\
[Example 414](https://github.github.com/gfm/#example-414)\
\
```markdown\
*foo\
bar*\
```\
\
```html\
<p><em>foo\
bar</em></p>\
```\
\
In particular, emphasis and strong emphasis can be nested\
inside emphasis:\
\
[Example 415](https://github.github.com/gfm/#example-415)\
\
```markdown\
_foo __bar__ baz_\
```\
\
```html\
<p><em>foo <strong>bar</strong> baz</em></p>\
```\
\
[Example 416](https://github.github.com/gfm/#example-416)\
\
```markdown\
_foo _bar_ baz_\
```\
\
```html\
<p><em>foo <em>bar</em> baz</em></p>\
```\
\
[Example 417](https://github.github.com/gfm/#example-417)\
\
```markdown\
__foo_ bar_\
```\
\
```html\
<p><em><em>foo</em> bar</em></p>\
```\
\
[Example 418](https://github.github.com/gfm/#example-418)\
\
```markdown\
*foo *bar**\
```\
\
```html\
<p><em>foo <em>bar</em></em></p>\
```\
\
[Example 419](https://github.github.com/gfm/#example-419)\
\
```markdown\
*foo **bar** baz*\
```\
\
```html\
<p><em>foo <strong>bar</strong> baz</em></p>\
```\
\
[Example 420](https://github.github.com/gfm/#example-420)\
\
```markdown\
*foo**bar**baz*\
```\
\
```html\
<p><em>foo<strong>bar</strong>baz</em></p>\
```\
\
Note that in the preceding case, the interpretation\
\
```markdown\
<p><em>foo</em><em>bar<em></em>baz</em></p>\
```\
\
is precluded by the condition that a delimiter that\
can both open and close (like the `*` after `foo`)\
cannot form emphasis if the sum of the lengths of\
the delimiter runs containing the opening and\
closing delimiters is a multiple of 3 unless\
both lengths are multiples of 3.\
\
For the same reason, we don’t get two consecutive\
emphasis sections in this example:\
\
[Example 421](https://github.github.com/gfm/#example-421)\
\
```markdown\
*foo**bar*\
```\
\
```html\
<p><em>foo**bar</em></p>\
```\
\
The same condition ensures that the following\
cases are all strong emphasis nested inside\
emphasis, even when the interior spaces are\
omitted:\
\
[Example 422](https://github.github.com/gfm/#example-422)\
\
```markdown\
***foo** bar*\
```\
\
```html\
<p><em><strong>foo</strong> bar</em></p>\
```\
\
[Example 423](https://github.github.com/gfm/#example-423)\
\
```markdown\
*foo **bar***\
```\
\
```html\
<p><em>foo <strong>bar</strong></em></p>\
```\
\
[Example 424](https://github.github.com/gfm/#example-424)\
\
```markdown\
*foo**bar***\
```\
\
```html\
<p><em>foo<strong>bar</strong></em></p>\
```\
\
When the lengths of the interior closing and opening\
delimiter runs are _both_ multiples of 3, though,\
they can match to create emphasis:\
\
[Example 425](https://github.github.com/gfm/#example-425)\
\
```markdown\
foo***bar***baz\
```\
\
```html\
<p>foo<em><strong>bar</strong></em>baz</p>\
```\
\
[Example 426](https://github.github.com/gfm/#example-426)\
\
```markdown\
foo******bar*********baz\
```\
\
```html\
<p>foo<strong><strong><strong>bar</strong></strong></strong>***baz</p>\
```\
\
Indefinite levels of nesting are possible:\
\
[Example 427](https://github.github.com/gfm/#example-427)\
\
```markdown\
*foo **bar *baz* bim** bop*\
```\
\
```html\
<p><em>foo <strong>bar <em>baz</em> bim</strong> bop</em></p>\
```\
\
[Example 428](https://github.github.com/gfm/#example-428)\
\
```markdown\
*foo [*bar*](/url)*\
```\
\
```html\
<p><em>foo <a href="/url"><em>bar</em></a></em></p>\
```\
\
There can be no empty emphasis or strong emphasis:\
\
[Example 429](https://github.github.com/gfm/#example-429)\
\
```markdown\
** is not an empty emphasis\
```\
\
```html\
<p>** is not an empty emphasis</p>\
```\
\
[Example 430](https://github.github.com/gfm/#example-430)\
\
```markdown\
**** is not an empty strong emphasis\
```\
\
```html\
<p>**** is not an empty strong emphasis</p>\
```\
\
Rule 10:\
\
Any nonempty sequence of inline elements can be the contents of an\
strongly emphasized span.\
\
[Example 431](https://github.github.com/gfm/#example-431)\
\
```markdown\
**foo [bar](/url)**\
```\
\
```html\
<p><strong>foo <a href="/url">bar</a></strong></p>\
```\
\
[Example 432](https://github.github.com/gfm/#example-432)\
\
```markdown\
**foo\
bar**\
```\
\
```html\
<p><strong>foo\
bar</strong></p>\
```\
\
In particular, emphasis and strong emphasis can be nested\
inside strong emphasis:\
\
[Example 433](https://github.github.com/gfm/#example-433)\
\
```markdown\
__foo _bar_ baz__\
```\
\
```html\
<p><strong>foo <em>bar</em> baz</strong></p>\
```\
\
[Example 434](https://github.github.com/gfm/#example-434)\
\
```markdown\
__foo __bar__ baz__\
```\
\
```html\
<p><strong>foo <strong>bar</strong> baz</strong></p>\
```\
\
[Example 435](https://github.github.com/gfm/#example-435)\
\
```markdown\
____foo__ bar__\
```\
\
```html\
<p><strong><strong>foo</strong> bar</strong></p>\
```\
\
[Example 436](https://github.github.com/gfm/#example-436)\
\
```markdown\
**foo **bar****\
```\
\
```html\
<p><strong>foo <strong>bar</strong></strong></p>\
```\
\
[Example 437](https://github.github.com/gfm/#example-437)\
\
```markdown\
**foo *bar* baz**\
```\
\
```html\
<p><strong>foo <em>bar</em> baz</strong></p>\
```\
\
[Example 438](https://github.github.com/gfm/#example-438)\
\
```markdown\
**foo*bar*baz**\
```\
\
```html\
<p><strong>foo<em>bar</em>baz</strong></p>\
```\
\
[Example 439](https://github.github.com/gfm/#example-439)\
\
```markdown\
***foo* bar**\
```\
\
```html\
<p><strong><em>foo</em> bar</strong></p>\
```\
\
[Example 440](https://github.github.com/gfm/#example-440)\
\
```markdown\
**foo *bar***\
```\
\
```html\
<p><strong>foo <em>bar</em></strong></p>\
```\
\
Indefinite levels of nesting are possible:\
\
[Example 441](https://github.github.com/gfm/#example-441)\
\
```markdown\
**foo *bar **baz**\
bim* bop**\
```\
\
```html\
<p><strong>foo <em>bar <strong>baz</strong>\
bim</em> bop</strong></p>\
```\
\
[Example 442](https://github.github.com/gfm/#example-442)\
\
```markdown\
**foo [*bar*](/url)**\
```\
\
```html\
<p><strong>foo <a href="/url"><em>bar</em></a></strong></p>\
```\
\
There can be no empty emphasis or strong emphasis:\
\
[Example 443](https://github.github.com/gfm/#example-443)\
\
```markdown\
__ is not an empty emphasis\
```\
\
```html\
<p>__ is not an empty emphasis</p>\
```\
\
[Example 444](https://github.github.com/gfm/#example-444)\
\
```markdown\
____ is not an empty strong emphasis\
```\
\
```html\
<p>____ is not an empty strong emphasis</p>\
```\
\
Rule 11:\
\
[Example 445](https://github.github.com/gfm/#example-445)\
\
```markdown\
foo ***\
```\
\
```html\
<p>foo ***</p>\
```\
\
[Example 446](https://github.github.com/gfm/#example-446)\
\
```markdown\
foo *\**\
```\
\
```html\
<p>foo <em>*</em></p>\
```\
\
[Example 447](https://github.github.com/gfm/#example-447)\
\
```markdown\
foo *_*\
```\
\
```html\
<p>foo <em>_</em></p>\
```\
\
[Example 448](https://github.github.com/gfm/#example-448)\
\
```markdown\
foo *****\
```\
\
```html\
<p>foo *****</p>\
```\
\
[Example 449](https://github.github.com/gfm/#example-449)\
\
```markdown\
foo **\***\
```\
\
```html\
<p>foo <strong>*</strong></p>\
```\
\
[Example 450](https://github.github.com/gfm/#example-450)\
\
```markdown\
foo **_**\
```\
\
```html\
<p>foo <strong>_</strong></p>\
```\
\
Note that when delimiters do not match evenly, Rule 11 determines\
that the excess literal `*` characters will appear outside of the\
emphasis, rather than inside it:\
\
[Example 451](https://github.github.com/gfm/#example-451)\
\
```markdown\
**foo*\
```\
\
```html\
<p>*<em>foo</em></p>\
```\
\
[Example 452](https://github.github.com/gfm/#example-452)\
\
```markdown\
*foo**\
```\
\
```html\
<p><em>foo</em>*</p>\
```\
\
[Example 453](https://github.github.com/gfm/#example-453)\
\
```markdown\
***foo**\
```\
\
```html\
<p>*<strong>foo</strong></p>\
```\
\
[Example 454](https://github.github.com/gfm/#example-454)\
\
```markdown\
****foo*\
```\
\
```html\
<p>***<em>foo</em></p>\
```\
\
[Example 455](https://github.github.com/gfm/#example-455)\
\
```markdown\
**foo***\
```\
\
```html\
<p><strong>foo</strong>*</p>\
```\
\
[Example 456](https://github.github.com/gfm/#example-456)\
\
```markdown\
*foo****\
```\
\
```html\
<p><em>foo</em>***</p>\
```\
\
Rule 12:\
\
[Example 457](https://github.github.com/gfm/#example-457)\
\
```markdown\
foo ___\
```\
\
```html\
<p>foo ___</p>\
```\
\
[Example 458](https://github.github.com/gfm/#example-458)\
\
```markdown\
foo _\__\
```\
\
```html\
<p>foo <em>_</em></p>\
```\
\
[Example 459](https://github.github.com/gfm/#example-459)\
\
```markdown\
foo _*_\
```\
\
```html\
<p>foo <em>*</em></p>\
```\
\
[Example 460](https://github.github.com/gfm/#example-460)\
\
```markdown\
foo _____\
```\
\
```html\
<p>foo _____</p>\
```\
\
[Example 461](https://github.github.com/gfm/#example-461)\
\
```markdown\
foo __\___\
```\
\
```html\
<p>foo <strong>_</strong></p>\
```\
\
[Example 462](https://github.github.com/gfm/#example-462)\
\
```markdown\
foo __*__\
```\
\
```html\
<p>foo <strong>*</strong></p>\
```\
\
[Example 463](https://github.github.com/gfm/#example-463)\
\
```markdown\
__foo_\
```\
\
```html\
<p>_<em>foo</em></p>\
```\
\
Note that when delimiters do not match evenly, Rule 12 determines\
that the excess literal `_` characters will appear outside of the\
emphasis, rather than inside it:\
\
[Example 464](https://github.github.com/gfm/#example-464)\
\
```markdown\
_foo__\
```\
\
```html\
<p><em>foo</em>_</p>\
```\
\
[Example 465](https://github.github.com/gfm/#example-465)\
\
```markdown\
___foo__\
```\
\
```html\
<p>_<strong>foo</strong></p>\
```\
\
[Example 466](https://github.github.com/gfm/#example-466)\
\
```markdown\
____foo_\
```\
\
```html\
<p>___<em>foo</em></p>\
```\
\
[Example 467](https://github.github.com/gfm/#example-467)\
\
```markdown\
__foo___\
```\
\
```html\
<p><strong>foo</strong>_</p>\
```\
\
[Example 468](https://github.github.com/gfm/#example-468)\
\
```markdown\
_foo____\
```\
\
```html\
<p><em>foo</em>___</p>\
```\
\
Rule 13 implies that if you want emphasis nested directly inside\
emphasis, you must use different delimiters:\
\
[Example 469](https://github.github.com/gfm/#example-469)\
\
```markdown\
**foo**\
```\
\
```html\
<p><strong>foo</strong></p>\
```\
\
[Example 470](https://github.github.com/gfm/#example-470)\
\
```markdown\
*_foo_*\
```\
\
```html\
<p><em><em>foo</em></em></p>\
```\
\
[Example 471](https://github.github.com/gfm/#example-471)\
\
```markdown\
__foo__\
```\
\
```html\
<p><strong>foo</strong></p>\
```\
\
[Example 472](https://github.github.com/gfm/#example-472)\
\
```markdown\
_*foo*_\
```\
\
```html\
<p><em><em>foo</em></em></p>\
```\
\
However, strong emphasis within strong emphasis is possible without\
switching delimiters:\
\
[Example 473](https://github.github.com/gfm/#example-473)\
\
```markdown\
****foo****\
```\
\
```html\
<p><strong><strong>foo</strong></strong></p>\
```\
\
[Example 474](https://github.github.com/gfm/#example-474)\
\
```markdown\
____foo____\
```\
\
```html\
<p><strong><strong>foo</strong></strong></p>\
```\
\
Rule 13 can be applied to arbitrarily long sequences of\
delimiters:\
\
[Example 475](https://github.github.com/gfm/#example-475)\
\
```markdown\
******foo******\
```\
\
```html\
<p><strong><strong><strong>foo</strong></strong></strong></p>\
```\
\
Rule 14:\
\
[Example 476](https://github.github.com/gfm/#example-476)\
\
```markdown\
***foo***\
```\
\
```html\
<p><em><strong>foo</strong></em></p>\
```\
\
[Example 477](https://github.github.com/gfm/#example-477)\
\
```markdown\
_____foo_____\
```\
\
```html\
<p><em><strong><strong>foo</strong></strong></em></p>\
```\
\
Rule 15:\
\
[Example 478](https://github.github.com/gfm/#example-478)\
\
```markdown\
*foo _bar* baz_\
```\
\
```html\
<p><em>foo _bar</em> baz_</p>\
```\
\
[Example 479](https://github.github.com/gfm/#example-479)\
\
```markdown\
*foo __bar *baz bim__ bam*\
```\
\
```html\
<p><em>foo <strong>bar *baz bim</strong> bam</em></p>\
```\
\
Rule 16:\
\
[Example 480](https://github.github.com/gfm/#example-480)\
\
```markdown\
**foo **bar baz**\
```\
\
```html\
<p>**foo <strong>bar baz</strong></p>\
```\
\
[Example 481](https://github.github.com/gfm/#example-481)\
\
```markdown\
*foo *bar baz*\
```\
\
```html\
<p>*foo <em>bar baz</em></p>\
```\
\
Rule 17:\
\
[Example 482](https://github.github.com/gfm/#example-482)\
\
```markdown\
*[bar*](/url)\
```\
\
```html\
<p>*<a href="/url">bar*</a></p>\
```\
\
[Example 483](https://github.github.com/gfm/#example-483)\
\
```markdown\
_foo [bar_](/url)\
```\
\
```html\
<p>_foo <a href="/url">bar_</a></p>\
```\
\
[Example 484](https://github.github.com/gfm/#example-484)\
\
```markdown\
*<img src="foo" title="*"/>\
```\
\
```html\
<p>*<img src="foo" title="*"/></p>\
```\
\
[Example 485](https://github.github.com/gfm/#example-485)\
\
```markdown\
**<a href="**">\
```\
\
```html\
<p>**<a href="**"></p>\
```\
\
[Example 486](https://github.github.com/gfm/#example-486)\
\
```markdown\
__<a href="__">\
```\
\
```html\
<p>__<a href="__"></p>\
```\
\
[Example 487](https://github.github.com/gfm/#example-487)\
\
```markdown\
*a `*`*\
```\
\
```html\
<p><em>a <code>*</code></em></p>\
```\
\
[Example 488](https://github.github.com/gfm/#example-488)\
\
```markdown\
_a `_`_\
```\
\
```html\
<p><em>a <code>_</code></em></p>\
```\
\
[Example 489](https://github.github.com/gfm/#example-489)\
\
```markdown\
**a<http://foo.bar/?q=**>\
```\
\
```html\
<p>**a<a href="http://foo.bar/?q=**">http://foo.bar/?q=**</a></p>\
```\
\
[Example 490](https://github.github.com/gfm/#example-490)\
\
```markdown\
__a<http://foo.bar/?q=__>\
```\
\
```html\
<p>__a<a href="http://foo.bar/?q=__">http://foo.bar/?q=__</a></p>\
```\
\
## 6.5Strikethrough (extension)\
\
GFM enables the `strikethrough` extension, where an additional emphasis type is\
available.\
\
Strikethrough text is any text wrapped in a matching pair of one or two tildes\
(`~`).\
\
[Example 491](https://github.github.com/gfm/#example-491)\
\
```markdown\
~~Hi~~ Hello, ~there~ world!\
```\
\
```html\
<p><del>Hi</del> Hello, <del>there</del> world!</p>\
```\
\
As with regular emphasis delimiters, a new paragraph will cause strikethrough\
parsing to cease:\
\
[Example 492](https://github.github.com/gfm/#example-492)\
\
```markdown\
This ~~has a\
\
new paragraph~~.\
```\
\
```html\
<p>This ~~has a</p>\
<p>new paragraph~~.</p>\
```\
\
Three or more tildes do not create a strikethrough:\
\
[Example 493](https://github.github.com/gfm/#example-493)\
\
```markdown\
This will ~~~not~~~ strike.\
```\
\
```html\
<p>This will ~~~not~~~ strike.</p>\
```\
\
## 6.6Links\
\
A link contains [link text](https://github.github.com/gfm/#link-text) (the visible text), a [link destination](https://github.github.com/gfm/#link-destination)\
(the URI that is the link destination), and optionally a [link title](https://github.github.com/gfm/#link-title).\
There are two basic kinds of links in Markdown. In [inline links](https://github.github.com/gfm/#inline-link) the\
destination and title are given immediately after the link text. In\
[reference links](https://github.github.com/gfm/#reference-link) the destination and title are defined elsewhere in\
the document.\
\
A [link text](https://github.github.com/gfm/#link-text) consists of a sequence of zero or more\
inline elements enclosed by square brackets (`[` and `]`). The\
following rules apply:\
\
- Links may not contain other links, at any level of nesting. If\
  multiple otherwise valid link definitions appear nested inside each\
  other, the inner-most definition is used.\
\
- Brackets are allowed in the [link text](https://github.github.com/gfm/#link-text) only if (a) they\
  are backslash-escaped or (b) they appear as a matched pair of brackets,\
  with an open bracket `[`, a sequence of zero or more inlines, and\
  a close bracket `]`.\
\
- Backtick [code spans](https://github.github.com/gfm/#code-spans), [autolinks](https://github.github.com/gfm/#autolinks), and raw [HTML tags](https://github.github.com/gfm/#html-tag) bind more tightly\
  than the brackets in link text. Thus, for example,\
  ``[foo`]``` could not be a link text, since the second `]`\
  is part of a code span.\
\
- The brackets in link text bind more tightly than markers for\
  [emphasis and strong emphasis](https://github.github.com/gfm/#emphasis-and-strong-emphasis). Thus, for example, `*[foo*](url)` is a link.\
\
\
A [link destination](https://github.github.com/gfm/#link-destination) consists of either\
\
- a sequence of zero or more characters between an opening `<` and a\
  closing `>` that contains no line breaks or unescaped\
  `<` or `>` characters, or\
\
- a nonempty sequence of characters that does not start with\
  `<`, does not include ASCII space or control characters, and\
  includes parentheses only if (a) they are backslash-escaped or\
  (b) they are part of a balanced pair of unescaped parentheses.\
  (Implementations may impose limits on parentheses nesting to\
  avoid performance issues, but at least three levels of nesting\
  should be supported.)\
\
\
A [link title](https://github.github.com/gfm/#link-title) consists of either\
\
- a sequence of zero or more characters between straight double-quote\
  characters (`"`), including a `"` character only if it is\
  backslash-escaped, or\
\
- a sequence of zero or more characters between straight single-quote\
  characters (`'`), including a `'` character only if it is\
  backslash-escaped, or\
\
- a sequence of zero or more characters between matching parentheses\
  (`(...)`), including a `(` or `)` character only if it is\
  backslash-escaped.\
\
\
Although [link titles](https://github.github.com/gfm/#link-title) may span multiple lines, they may not contain\
a [blank line](https://github.github.com/gfm/#blank-line).\
\
An [inline link](https://github.github.com/gfm/#inline-link) consists of a [link text](https://github.github.com/gfm/#link-text) followed immediately\
by a left parenthesis `(`, optional [whitespace](https://github.github.com/gfm/#whitespace), an optional\
[link destination](https://github.github.com/gfm/#link-destination), an optional [link title](https://github.github.com/gfm/#link-title) separated from the link\
destination by [whitespace](https://github.github.com/gfm/#whitespace), optional [whitespace](https://github.github.com/gfm/#whitespace), and a right\
parenthesis `)`. The link’s text consists of the inlines contained\
in the [link text](https://github.github.com/gfm/#link-text) (excluding the enclosing square brackets).\
The link’s URI consists of the link destination, excluding enclosing\
`<...>` if present, with backslash-escapes in effect as described\
above. The link’s title consists of the link title, excluding its\
enclosing delimiters, with backslash-escapes in effect as described\
above.\
\
Here is a simple inline link:\
\
[Example 494](https://github.github.com/gfm/#example-494)\
\
```markdown\
[link](/uri "title")\
```\
\
```html\
<p><a href="/uri" title="title">link</a></p>\
```\
\
The title may be omitted:\
\
[Example 495](https://github.github.com/gfm/#example-495)\
\
```markdown\
[link](/uri)\
```\
\
```html\
<p><a href="/uri">link</a></p>\
```\
\
Both the title and the destination may be omitted:\
\
[Example 496](https://github.github.com/gfm/#example-496)\
\
```markdown\
[link]()\
```\
\
```html\
<p><a href="">link</a></p>\
```\
\
[Example 497](https://github.github.com/gfm/#example-497)\
\
```markdown\
[link](<>)\
```\
\
```html\
<p><a href="">link</a></p>\
```\
\
The destination can only contain spaces if it is\
enclosed in pointy brackets:\
\
[Example 498](https://github.github.com/gfm/#example-498)\
\
```markdown\
[link](/my uri)\
```\
\
```html\
<p>[link](/my uri)</p>\
```\
\
[Example 499](https://github.github.com/gfm/#example-499)\
\
```markdown\
[link](</my uri>)\
```\
\
```html\
<p><a href="/my%20uri">link</a></p>\
```\
\
The destination cannot contain line breaks,\
even if enclosed in pointy brackets:\
\
[Example 500](https://github.github.com/gfm/#example-500)\
\
```markdown\
[link](foo\
bar)\
```\
\
```html\
<p>[link](foo\
bar)</p>\
```\
\
[Example 501](https://github.github.com/gfm/#example-501)\
\
```markdown\
[link](<foo\
bar>)\
```\
\
```html\
<p>[link](<foo\
bar>)</p>\
```\
\
The destination can contain `)` if it is enclosed\
in pointy brackets:\
\
[Example 502](https://github.github.com/gfm/#example-502)\
\
```markdown\
[a](<b)c>)\
```\
\
```html\
<p><a href="b)c">a</a></p>\
```\
\
Pointy brackets that enclose links must be unescaped:\
\
[Example 503](https://github.github.com/gfm/#example-503)\
\
```markdown\
[link](<foo\>)\
```\
\
```html\
<p>[link](&lt;foo&gt;)</p>\
```\
\
These are not links, because the opening pointy bracket\
is not matched properly:\
\
[Example 504](https://github.github.com/gfm/#example-504)\
\
```markdown\
[a](<b)c\
[a](<b)c>\
[a](<b>c)\
```\
\
```html\
<p>[a](&lt;b)c\
[a](&lt;b)c&gt;\
[a](<b>c)</p>\
```\
\
Parentheses inside the link destination may be escaped:\
\
[Example 505](https://github.github.com/gfm/#example-505)\
\
```markdown\
[link](\(foo\))\
```\
\
```html\
<p><a href="(foo)">link</a></p>\
```\
\
Any number of parentheses are allowed without escaping, as long as they are\
balanced:\
\
[Example 506](https://github.github.com/gfm/#example-506)\
\
```markdown\
[link](foo(and(bar)))\
```\
\
```html\
<p><a href="foo(and(bar))">link</a></p>\
```\
\
However, if you have unbalanced parentheses, you need to escape or use the\
`<...>` form:\
\
[Example 507](https://github.github.com/gfm/#example-507)\
\
```markdown\
[link](foo\(and\(bar\))\
```\
\
```html\
<p><a href="foo(and(bar)">link</a></p>\
```\
\
[Example 508](https://github.github.com/gfm/#example-508)\
\
```markdown\
[link](<foo(and(bar)>)\
```\
\
```html\
<p><a href="foo(and(bar)">link</a></p>\
```\
\
Parentheses and other symbols can also be escaped, as usual\
in Markdown:\
\
[Example 509](https://github.github.com/gfm/#example-509)\
\
```markdown\
[link](foo\)\:)\
```\
\
```html\
<p><a href="foo):">link</a></p>\
```\
\
A link can contain fragment identifiers and queries:\
\
[Example 510](https://github.github.com/gfm/#example-510)\
\
```markdown\
[link](#fragment)\
\
[link](http://example.com#fragment)\
\
[link](http://example.com?foo=3#frag)\
```\
\
```html\
<p><a href="#fragment">link</a></p>\
<p><a href="http://example.com#fragment">link</a></p>\
<p><a href="http://example.com?foo=3#frag">link</a></p>\
```\
\
Note that a backslash before a non-escapable character is\
just a backslash:\
\
[Example 511](https://github.github.com/gfm/#example-511)\
\
```markdown\
[link](foo\bar)\
```\
\
```html\
<p><a href="foo%5Cbar">link</a></p>\
```\
\
URL-escaping should be left alone inside the destination, as all\
URL-escaped characters are also valid URL characters. Entity and\
numerical character references in the destination will be parsed\
into the corresponding Unicode code points, as usual. These may\
be optionally URL-escaped when written as HTML, but this spec\
does not enforce any particular policy for rendering URLs in\
HTML or other formats. Renderers may make different decisions\
about how to escape or normalize URLs in the output.\
\
[Example 512](https://github.github.com/gfm/#example-512)\
\
```markdown\
[link](foo%20b&auml;)\
```\
\
```html\
<p><a href="foo%20b%C3%A4">link</a></p>\
```\
\
Note that, because titles can often be parsed as destinations,\
if you try to omit the destination and keep the title, you’ll\
get unexpected results:\
\
[Example 513](https://github.github.com/gfm/#example-513)\
\
```markdown\
[link]("title")\
```\
\
```html\
<p><a href="%22title%22">link</a></p>\
```\
\
Titles may be in single quotes, double quotes, or parentheses:\
\
[Example 514](https://github.github.com/gfm/#example-514)\
\
```markdown\
[link](/url "title")\
[link](/url 'title')\
[link](/url (title))\
```\
\
```html\
<p><a href="/url" title="title">link</a>\
<a href="/url" title="title">link</a>\
<a href="/url" title="title">link</a></p>\
```\
\
Backslash escapes and entity and numeric character references\
may be used in titles:\
\
[Example 515](https://github.github.com/gfm/#example-515)\
\
```markdown\
[link](/url "title \"&quot;")\
```\
\
```html\
<p><a href="/url" title="title &quot;&quot;">link</a></p>\
```\
\
Titles must be separated from the link using a [whitespace](https://github.github.com/gfm/#whitespace).\
Other [Unicode whitespace](https://github.github.com/gfm/#unicode-whitespace) like non-breaking space doesn’t work.\
\
[Example 516](https://github.github.com/gfm/#example-516)\
\
```markdown\
[link](/url "title")\
```\
\
```html\
<p><a href="/url%C2%A0%22title%22">link</a></p>\
```\
\
Nested balanced quotes are not allowed without escaping:\
\
[Example 517](https://github.github.com/gfm/#example-517)\
\
```markdown\
[link](/url "title "and" title")\
```\
\
```html\
<p>[link](/url &quot;title &quot;and&quot; title&quot;)</p>\
```\
\
But it is easy to work around this by using a different quote type:\
\
[Example 518](https://github.github.com/gfm/#example-518)\
\
```markdown\
[link](/url 'title "and" title')\
```\
\
```html\
<p><a href="/url" title="title &quot;and&quot; title">link</a></p>\
```\
\
(Note: `Markdown.pl` did allow double quotes inside a double-quoted\
title, and its test suite included a test demonstrating this.\
But it is hard to see a good rationale for the extra complexity this\
brings, since there are already many ways—backslash escaping,\
entity and numeric character references, or using a different\
quote type for the enclosing title—to write titles containing\
double quotes. `Markdown.pl`’s handling of titles has a number\
of other strange features. For example, it allows single-quoted\
titles in inline links, but not reference links. And, in\
reference links but not inline links, it allows a title to begin\
with `"` and end with `)`. `Markdown.pl` 1.0.1 even allows\
titles with no closing quotation mark, though 1.0.2b8 does not.\
It seems preferable to adopt a simple, rational rule that works\
the same way in inline links and link reference definitions.)\
\
[Whitespace](https://github.github.com/gfm/#whitespace) is allowed around the destination and title:\
\
[Example 519](https://github.github.com/gfm/#example-519)\
\
```markdown\
[link](   /uri\
  "title"  )\
```\
\
```html\
<p><a href="/uri" title="title">link</a></p>\
```\
\
But it is not allowed between the link text and the\
following parenthesis:\
\
[Example 520](https://github.github.com/gfm/#example-520)\
\
```markdown\
[link] (/uri)\
```\
\
```html\
<p>[link] (/uri)</p>\
```\
\
The link text may contain balanced brackets, but not unbalanced ones,\
unless they are escaped:\
\
[Example 521](https://github.github.com/gfm/#example-521)\
\
```markdown\
[link [foo [bar]]](/uri)\
```\
\
```html\
<p><a href="/uri">link [foo [bar]]</a></p>\
```\
\
[Example 522](https://github.github.com/gfm/#example-522)\
\
```markdown\
[link] bar](/uri)
```

```html
<p>[link] bar](/uri)</p>
```

[Example 523](https://github.github.com/gfm/#example-523)

```markdown
[link [bar](/uri)\
```\
\
```html\
<p>[link <a href="/uri">bar</a></p>\
```\
\
[Example 524](https://github.github.com/gfm/#example-524)\
\
```markdown\
[link \[bar](/uri)\
```\
\
```html\
<p><a href="/uri">link [bar</a></p>\
```\
\
The link text may contain inline content:\
\
[Example 525](https://github.github.com/gfm/#example-525)\
\
```markdown\
[link *foo **bar** `#`*](/uri)\
```\
\
```html\
<p><a href="/uri">link <em>foo <strong>bar</strong> <code>#</code></em></a></p>\
```\
\
[Example 526](https://github.github.com/gfm/#example-526)\
\
```markdown\
[![moon](moon.jpg)](/uri)\
```\
\
```html\
<p><a href="/uri"><img src="moon.jpg" alt="moon" /></a></p>\
```\
\
However, links may not contain other links, at any level of nesting.\
\
[Example 527](https://github.github.com/gfm/#example-527)\
\
```markdown\
[foo [bar](/uri)](/uri)\
```\
\
```html\
<p>[foo <a href="/uri">bar</a>](/uri)</p>\
```\
\
[Example 528](https://github.github.com/gfm/#example-528)\
\
```markdown\
[foo *[bar [baz](/uri)](/uri)*](/uri)\
```\
\
```html\
<p>[foo <em>[bar <a href="/uri">baz</a>](/uri)</em>](/uri)</p>\
```\
\
[Example 529](https://github.github.com/gfm/#example-529)\
\
```markdown\
![[[foo](uri1)](uri2)](uri3)\
```\
\
```html\
<p><img src="uri3" alt="[foo](uri2)" /></p>\
```\
\
These cases illustrate the precedence of link text grouping over\
emphasis grouping:\
\
[Example 530](https://github.github.com/gfm/#example-530)\
\
```markdown\
*[foo*](/uri)\
```\
\
```html\
<p>*<a href="/uri">foo*</a></p>\
```\
\
[Example 531](https://github.github.com/gfm/#example-531)\
\
```markdown\
[foo *bar](baz*)\
```\
\
```html\
<p><a href="baz*">foo *bar</a></p>\
```\
\
Note that brackets that _aren’t_ part of links do not take\
precedence:\
\
[Example 532](https://github.github.com/gfm/#example-532)\
\
```markdown\
*foo [bar* baz]\
```\
\
```html\
<p><em>foo [bar</em> baz]</p>\
```\
\
These cases illustrate the precedence of HTML tags, code spans,\
and autolinks over link grouping:\
\
[Example 533](https://github.github.com/gfm/#example-533)\
\
```markdown\
[foo <bar attr="](baz)">\
```\
\
```html\
<p>[foo <bar attr="](baz)"></p>\
```\
\
[Example 534](https://github.github.com/gfm/#example-534)\
\
```markdown\
[foo`](/uri)`\
```\
\
```html\
<p>[foo<code>](/uri)</code></p>\
```\
\
[Example 535](https://github.github.com/gfm/#example-535)\
\
```markdown\
[foo<http://example.com/?search=](uri)>\
```\
\
```html\
<p>[foo<a href="http://example.com/?search=%5D(uri)">http://example.com/?search=](uri)</a></p>\
```\
\
There are three kinds of [reference link](https://github.github.com/gfm/#reference-link) s:\
[full](https://github.github.com/gfm/#full-reference-link), [collapsed](https://github.github.com/gfm/#collapsed-reference-link),\
and [shortcut](https://github.github.com/gfm/#shortcut-reference-link).\
\
A [full reference link](https://github.github.com/gfm/#full-reference-link)\
consists of a [link text](https://github.github.com/gfm/#link-text) immediately followed by a [link label](https://github.github.com/gfm/#link-label)\
that [matches](https://github.github.com/gfm/#matches) a [link reference definition](https://github.github.com/gfm/#link-reference-definition) elsewhere in the document.\
\
A [link label](https://github.github.com/gfm/#link-label) begins with a left bracket (`[`) and ends\
with the first right bracket (`]`) that is not backslash-escaped.\
Between these brackets there must be at least one [non-whitespace character](https://github.github.com/gfm/#non-whitespace-character).\
Unescaped square bracket characters are not allowed inside the\
opening and closing square brackets of [link labels](https://github.github.com/gfm/#link-label). A link\
label can have at most 999 characters inside the square\
brackets.\
\
One label [matches](https://github.github.com/gfm/#matches)\
another just in case their normalized forms are equal. To normalize a\
label, strip off the opening and closing brackets,\
perform the _Unicode case fold_, strip leading and trailing\
[whitespace](https://github.github.com/gfm/#whitespace) and collapse consecutive internal\
[whitespace](https://github.github.com/gfm/#whitespace) to a single space. If there are multiple\
matching reference link definitions, the one that comes first in the\
document is used. (It is desirable in such cases to emit a warning.)\
\
The link’s URI and title are provided by the matching [link\\
reference definition](https://github.github.com/gfm/#link-reference-definition).\
\
Here is a simple example:\
\
[Example 536](https://github.github.com/gfm/#example-536)\
\
```markdown\
[foo][bar]\
\
[bar]: /url "title"\
```\
\
```html\
<p><a href="/url" title="title">foo</a></p>\
```\
\
The rules for the [link text](https://github.github.com/gfm/#link-text) are the same as with\
[inline links](https://github.github.com/gfm/#inline-link). Thus:\
\
The link text may contain balanced brackets, but not unbalanced ones,\
unless they are escaped:\
\
[Example 537](https://github.github.com/gfm/#example-537)\
\
```markdown\
[link [foo [bar]]][ref]\
\
[ref]: /uri\
```\
\
```html\
<p><a href="/uri">link [foo [bar]]</a></p>\
```\
\
[Example 538](https://github.github.com/gfm/#example-538)\
\
```markdown\
[link \[bar][ref]\
\
[ref]: /uri\
```\
\
```html\
<p><a href="/uri">link [bar</a></p>\
```\
\
The link text may contain inline content:\
\
[Example 539](https://github.github.com/gfm/#example-539)\
\
```markdown\
[link *foo **bar** `#`*][ref]\
\
[ref]: /uri\
```\
\
```html\
<p><a href="/uri">link <em>foo <strong>bar</strong> <code>#</code></em></a></p>\
```\
\
[Example 540](https://github.github.com/gfm/#example-540)\
\
```markdown\
[![moon](moon.jpg)][ref]\
\
[ref]: /uri\
```\
\
```html\
<p><a href="/uri"><img src="moon.jpg" alt="moon" /></a></p>\
```\
\
However, links may not contain other links, at any level of nesting.\
\
[Example 541](https://github.github.com/gfm/#example-541)\
\
```markdown\
[foo [bar](/uri)][ref]\
\
[ref]: /uri\
```\
\
```html\
<p>[foo <a href="/uri">bar</a>]<a href="/uri">ref</a></p>\
```\
\
[Example 542](https://github.github.com/gfm/#example-542)\
\
```markdown\
[foo *bar [baz][ref]*][ref]\
\
[ref]: /uri\
```\
\
```html\
<p>[foo <em>bar <a href="/uri">baz</a></em>]<a href="/uri">ref</a></p>\
```\
\
(In the examples above, we have two [shortcut reference links](https://github.github.com/gfm/#shortcut-reference-link)\
instead of one [full reference link](https://github.github.com/gfm/#full-reference-link).)\
\
The following cases illustrate the precedence of link text grouping over\
emphasis grouping:\
\
[Example 543](https://github.github.com/gfm/#example-543)\
\
```markdown\
*[foo*][ref]\
\
[ref]: /uri\
```\
\
```html\
<p>*<a href="/uri">foo*</a></p>\
```\
\
[Example 544](https://github.github.com/gfm/#example-544)\
\
```markdown\
[foo *bar][ref]*\
\
[ref]: /uri\
```\
\
```html\
<p><a href="/uri">foo *bar</a>*</p>\
```\
\
These cases illustrate the precedence of HTML tags, code spans,\
and autolinks over link grouping:\
\
[Example 545](https://github.github.com/gfm/#example-545)\
\
```markdown\
[foo <bar attr="][ref]">\
\
[ref]: /uri\
```\
\
```html\
<p>[foo <bar attr="][ref]"></p>\
```\
\
[Example 546](https://github.github.com/gfm/#example-546)\
\
```markdown\
[foo`][ref]`\
\
[ref]: /uri\
```\
\
```html\
<p>[foo<code>][ref]</code></p>\
```\
\
[Example 547](https://github.github.com/gfm/#example-547)\
\
```markdown\
[foo<http://example.com/?search=][ref]>\
\
[ref]: /uri\
```\
\
```html\
<p>[foo<a href="http://example.com/?search=%5D%5Bref%5D">http://example.com/?search=][ref]</a></p>\
```\
\
Matching is case-insensitive:\
\
[Example 548](https://github.github.com/gfm/#example-548)\
\
```markdown\
[foo][BaR]\
\
[bar]: /url "title"\
```\
\
```html\
<p><a href="/url" title="title">foo</a></p>\
```\
\
Unicode case fold is used:\
\
[Example 549](https://github.github.com/gfm/#example-549)\
\
```markdown\
[ẞ]\
\
[SS]: /url\
```\
\
```html\
<p><a href="/url">ẞ</a></p>\
```\
\
Consecutive internal [whitespace](https://github.github.com/gfm/#whitespace) is treated as one space for\
purposes of determining matching:\
\
[Example 550](https://github.github.com/gfm/#example-550)\
\
```markdown\
[Foo\
  bar]: /url\
\
[Baz][Foo bar]\
```\
\
```html\
<p><a href="/url">Baz</a></p>\
```\
\
No [whitespace](https://github.github.com/gfm/#whitespace) is allowed between the [link text](https://github.github.com/gfm/#link-text) and the\
[link label](https://github.github.com/gfm/#link-label):\
\
[Example 551](https://github.github.com/gfm/#example-551)\
\
```markdown\
[foo] [bar]\
\
[bar]: /url "title"\
```\
\
```html\
<p>[foo] <a href="/url" title="title">bar</a></p>\
```\
\
[Example 552](https://github.github.com/gfm/#example-552)\
\
```markdown\
[foo]\
[bar]\
\
[bar]: /url "title"\
```\
\
```html\
<p>[foo]\
<a href="/url" title="title">bar</a></p>\
```\
\
This is a departure from John Gruber’s original Markdown syntax\
description, which explicitly allows whitespace between the link\
text and the link label. It brings reference links in line with\
[inline links](https://github.github.com/gfm/#inline-link), which (according to both original Markdown and\
this spec) cannot have whitespace after the link text. More\
importantly, it prevents inadvertent capture of consecutive\
[shortcut reference links](https://github.github.com/gfm/#shortcut-reference-link). If whitespace is allowed between the\
link text and the link label, then in the following we will have\
a single reference link, not two shortcut reference links, as\
intended:\
\
```markdown\
[foo]\
[bar]\
\
[foo]: /url1\
[bar]: /url2\
```\
\
(Note that [shortcut reference links](https://github.github.com/gfm/#shortcut-reference-link) were introduced by Gruber\
himself in a beta version of `Markdown.pl`, but never included\
in the official syntax description. Without shortcut reference\
links, it is harmless to allow space between the link text and\
link label; but once shortcut references are introduced, it is\
too dangerous to allow this, as it frequently leads to\
unintended results.)\
\
When there are multiple matching [link reference definitions](https://github.github.com/gfm/#link-reference-definitions),\
the first is used:\
\
[Example 553](https://github.github.com/gfm/#example-553)\
\
```markdown\
[foo]: /url1\
\
[foo]: /url2\
\
[bar][foo]\
```\
\
```html\
<p><a href="/url1">bar</a></p>\
```\
\
Note that matching is performed on normalized strings, not parsed\
inline content. So the following does not match, even though the\
labels define equivalent inline content:\
\
[Example 554](https://github.github.com/gfm/#example-554)\
\
```markdown\
[bar][foo\!]\
\
[foo!]: /url\
```\
\
```html\
<p>[bar][foo!]</p>\
```\
\
[Link labels](https://github.github.com/gfm/#link-label) cannot contain brackets, unless they are\
backslash-escaped:\
\
[Example 555](https://github.github.com/gfm/#example-555)\
\
```markdown\
[foo][ref[]\
\
[ref[]: /uri\
```\
\
```html\
<p>[foo][ref[]</p>\
<p>[ref[]: /uri</p>\
```\
\
[Example 556](https://github.github.com/gfm/#example-556)\
\
```markdown\
[foo][ref[bar]]\
\
[ref[bar]]: /uri\
```\
\
```html\
<p>[foo][ref[bar]]</p>\
<p>[ref[bar]]: /uri</p>\
```\
\
[Example 557](https://github.github.com/gfm/#example-557)\
\
```markdown\
[[[foo]]]\
\
[[[foo]]]: /url\
```\
\
```html\
<p>[[[foo]]]</p>\
<p>[[[foo]]]: /url</p>\
```\
\
[Example 558](https://github.github.com/gfm/#example-558)\
\
```markdown\
[foo][ref\[]\
\
[ref\[]: /uri\
```\
\
```html\
<p><a href="/uri">foo</a></p>\
```\
\
Note that in this example `]` is not backslash-escaped:\
\
[Example 559](https://github.github.com/gfm/#example-559)\
\
```markdown\
[bar\\]: /uri\
\
[bar\\]\
```\
\
```html\
<p><a href="/uri">bar\</a></p>\
```\
\
A [link label](https://github.github.com/gfm/#link-label) must contain at least one [non-whitespace character](https://github.github.com/gfm/#non-whitespace-character):\
\
[Example 560](https://github.github.com/gfm/#example-560)\
\
```markdown\
[]\
\
[]: /uri\
```\
\
```html\
<p>[]</p>\
<p>[]: /uri</p>\
```\
\
[Example 561](https://github.github.com/gfm/#example-561)\
\
```markdown\
[\
 ]\
\
[\
 ]: /uri\
```\
\
```html\
<p>[\
]</p>\
<p>[\
]: /uri</p>\
```\
\
A [collapsed reference link](https://github.github.com/gfm/#collapsed-reference-link)\
consists of a [link label](https://github.github.com/gfm/#link-label) that [matches](https://github.github.com/gfm/#matches) a\
[link reference definition](https://github.github.com/gfm/#link-reference-definition) elsewhere in the\
document, followed by the string `[]`.\
The contents of the first link label are parsed as inlines,\
which are used as the link’s text. The link’s URI and title are\
provided by the matching reference link definition. Thus,\
`[foo][]` is equivalent to `[foo][foo]`.\
\
[Example 562](https://github.github.com/gfm/#example-562)\
\
```markdown\
[foo][]\
\
[foo]: /url "title"\
```\
\
```html\
<p><a href="/url" title="title">foo</a></p>\
```\
\
[Example 563](https://github.github.com/gfm/#example-563)\
\
```markdown\
[*foo* bar][]\
\
[*foo* bar]: /url "title"\
```\
\
```html\
<p><a href="/url" title="title"><em>foo</em> bar</a></p>\
```\
\
The link labels are case-insensitive:\
\
[Example 564](https://github.github.com/gfm/#example-564)\
\
```markdown\
[Foo][]\
\
[foo]: /url "title"\
```\
\
```html\
<p><a href="/url" title="title">Foo</a></p>\
```\
\
As with full reference links, [whitespace](https://github.github.com/gfm/#whitespace) is not\
allowed between the two sets of brackets:\
\
[Example 565](https://github.github.com/gfm/#example-565)\
\
```markdown\
[foo]\
[]\
\
[foo]: /url "title"\
```\
\
```html\
<p><a href="/url" title="title">foo</a>\
[]</p>\
```\
\
A [shortcut reference link](https://github.github.com/gfm/#shortcut-reference-link)\
consists of a [link label](https://github.github.com/gfm/#link-label) that [matches](https://github.github.com/gfm/#matches) a\
[link reference definition](https://github.github.com/gfm/#link-reference-definition) elsewhere in the\
document and is not followed by `[]` or a link label.\
The contents of the first link label are parsed as inlines,\
which are used as the link’s text. The link’s URI and title\
are provided by the matching link reference definition.\
Thus, `[foo]` is equivalent to `[foo][]`.\
\
[Example 566](https://github.github.com/gfm/#example-566)\
\
```markdown\
[foo]\
\
[foo]: /url "title"\
```\
\
```html\
<p><a href="/url" title="title">foo</a></p>\
```\
\
[Example 567](https://github.github.com/gfm/#example-567)\
\
```markdown\
[*foo* bar]\
\
[*foo* bar]: /url "title"\
```\
\
```html\
<p><a href="/url" title="title"><em>foo</em> bar</a></p>\
```\
\
[Example 568](https://github.github.com/gfm/#example-568)\
\
```markdown\
[[*foo* bar]]\
\
[*foo* bar]: /url "title"\
```\
\
```html\
<p>[<a href="/url" title="title"><em>foo</em> bar</a>]</p>\
```\
\
[Example 569](https://github.github.com/gfm/#example-569)\
\
```markdown\
[[bar [foo]\
\
[foo]: /url\
```\
\
```html\
<p>[[bar <a href="/url">foo</a></p>\
```\
\
The link labels are case-insensitive:\
\
[Example 570](https://github.github.com/gfm/#example-570)\
\
```markdown\
[Foo]\
\
[foo]: /url "title"\
```\
\
```html\
<p><a href="/url" title="title">Foo</a></p>\
```\
\
A space after the link text should be preserved:\
\
[Example 571](https://github.github.com/gfm/#example-571)\
\
```markdown\
[foo] bar\
\
[foo]: /url\
```\
\
```html\
<p><a href="/url">foo</a> bar</p>\
```\
\
If you just want bracketed text, you can backslash-escape the\
opening bracket to avoid links:\
\
[Example 572](https://github.github.com/gfm/#example-572)\
\
```markdown\
\[foo]\
\
[foo]: /url "title"\
```\
\
```html\
<p>[foo]</p>\
```\
\
Note that this is a link, because a link label ends with the first\
following closing bracket:\
\
[Example 573](https://github.github.com/gfm/#example-573)\
\
```markdown\
[foo*]: /url\
\
*[foo*]\
```\
\
```html\
<p>*<a href="/url">foo*</a></p>\
```\
\
Full and compact references take precedence over shortcut\
references:\
\
[Example 574](https://github.github.com/gfm/#example-574)\
\
```markdown\
[foo][bar]\
\
[foo]: /url1\
[bar]: /url2\
```\
\
```html\
<p><a href="/url2">foo</a></p>\
```\
\
[Example 575](https://github.github.com/gfm/#example-575)\
\
```markdown\
[foo][]\
\
[foo]: /url1\
```\
\
```html\
<p><a href="/url1">foo</a></p>\
```\
\
Inline links also take precedence:\
\
[Example 576](https://github.github.com/gfm/#example-576)\
\
```markdown\
[foo]()\
\
[foo]: /url1\
```\
\
```html\
<p><a href="">foo</a></p>\
```\
\
[Example 577](https://github.github.com/gfm/#example-577)\
\
```markdown\
[foo](not a link)\
\
[foo]: /url1\
```\
\
```html\
<p><a href="/url1">foo</a>(not a link)</p>\
```\
\
In the following case `[bar][baz]` is parsed as a reference,\
`[foo]` as normal text:\
\
[Example 578](https://github.github.com/gfm/#example-578)\
\
```markdown\
[foo][bar][baz]\
\
[baz]: /url\
```\
\
```html\
<p>[foo]<a href="/url">bar</a></p>\
```\
\
Here, though, `[foo][bar]` is parsed as a reference, since\
`[bar]` is defined:\
\
[Example 579](https://github.github.com/gfm/#example-579)\
\
```markdown\
[foo][bar][baz]\
\
[baz]: /url1\
[bar]: /url2\
```\
\
```html\
<p><a href="/url2">foo</a><a href="/url1">baz</a></p>\
```\
\
Here `[foo]` is not parsed as a shortcut reference, because it\
is followed by a link label (even though `[bar]` is not defined):\
\
[Example 580](https://github.github.com/gfm/#example-580)\
\
```markdown\
[foo][bar][baz]\
\
[baz]: /url1\
[foo]: /url2\
```\
\
```html\
<p>[foo]<a href="/url1">bar</a></p>\
```\
\
## 6.7Images\
\
Syntax for images is like the syntax for links, with one\
difference. Instead of [link text](https://github.github.com/gfm/#link-text), we have an\
[image description](https://github.github.com/gfm/#image-description). The rules for this are the\
same as for [link text](https://github.github.com/gfm/#link-text), except that (a) an\
image description starts with `![` rather than `[`, and\
(b) an image description may contain links.\
An image description has inline elements\
as its contents. When an image is rendered to HTML,\
this is standardly used as the image’s `alt` attribute.\
\
[Example 581](https://github.github.com/gfm/#example-581)\
\
```markdown\
![foo](/url "title")\
```\
\
```html\
<p><img src="/url" alt="foo" title="title" /></p>\
```\
\
[Example 582](https://github.github.com/gfm/#example-582)\
\
```markdown\
![foo *bar*]\
\
[foo *bar*]: train.jpg "train & tracks"\
```\
\
```html\
<p><img src="train.jpg" alt="foo bar" title="train &amp; tracks" /></p>\
```\
\
[Example 583](https://github.github.com/gfm/#example-583)\
\
```markdown\
![foo ![bar](/url)](/url2)\
```\
\
```html\
<p><img src="/url2" alt="foo bar" /></p>\
```\
\
[Example 584](https://github.github.com/gfm/#example-584)\
\
```markdown\
![foo [bar](/url)](/url2)\
```\
\
```html\
<p><img src="/url2" alt="foo bar" /></p>\
```\
\
Though this spec is concerned with parsing, not rendering, it is\
recommended that in rendering to HTML, only the plain string content\
of the [image description](https://github.github.com/gfm/#image-description) be used. Note that in\
the above example, the alt attribute’s value is `foo bar`, not `foo [bar](/url)` or `foo <a href="/url">bar</a>`. Only the plain string\
content is rendered, without formatting.\
\
[Example 585](https://github.github.com/gfm/#example-585)\
\
```markdown\
![foo *bar*][]\
\
[foo *bar*]: train.jpg "train & tracks"\
```\
\
```html\
<p><img src="train.jpg" alt="foo bar" title="train &amp; tracks" /></p>\
```\
\
[Example 586](https://github.github.com/gfm/#example-586)\
\
```markdown\
![foo *bar*][foobar]\
\
[FOOBAR]: train.jpg "train & tracks"\
```\
\
```html\
<p><img src="train.jpg" alt="foo bar" title="train &amp; tracks" /></p>\
```\
\
[Example 587](https://github.github.com/gfm/#example-587)\
\
```markdown\
![foo](train.jpg)\
```\
\
```html\
<p><img src="train.jpg" alt="foo" /></p>\
```\
\
[Example 588](https://github.github.com/gfm/#example-588)\
\
```markdown\
My ![foo bar](/path/to/train.jpg  "title"   )\
```\
\
```html\
<p>My <img src="/path/to/train.jpg" alt="foo bar" title="title" /></p>\
```\
\
[Example 589](https://github.github.com/gfm/#example-589)\
\
```markdown\
![foo](<url>)\
```\
\
```html\
<p><img src="url" alt="foo" /></p>\
```\
\
[Example 590](https://github.github.com/gfm/#example-590)\
\
```markdown\
![](/url)\
```\
\
```html\
<p><img src="/url" alt="" /></p>\
```\
\
Reference-style:\
\
[Example 591](https://github.github.com/gfm/#example-591)\
\
```markdown\
![foo][bar]\
\
[bar]: /url\
```\
\
```html\
<p><img src="/url" alt="foo" /></p>\
```\
\
[Example 592](https://github.github.com/gfm/#example-592)\
\
```markdown\
![foo][bar]\
\
[BAR]: /url\
```\
\
```html\
<p><img src="/url" alt="foo" /></p>\
```\
\
Collapsed:\
\
[Example 593](https://github.github.com/gfm/#example-593)\
\
```markdown\
![foo][]\
\
[foo]: /url "title"\
```\
\
```html\
<p><img src="/url" alt="foo" title="title" /></p>\
```\
\
[Example 594](https://github.github.com/gfm/#example-594)\
\
```markdown\
![*foo* bar][]\
\
[*foo* bar]: /url "title"\
```\
\
```html\
<p><img src="/url" alt="foo bar" title="title" /></p>\
```\
\
The labels are case-insensitive:\
\
[Example 595](https://github.github.com/gfm/#example-595)\
\
```markdown\
![Foo][]\
\
[foo]: /url "title"\
```\
\
```html\
<p><img src="/url" alt="Foo" title="title" /></p>\
```\
\
As with reference links, [whitespace](https://github.github.com/gfm/#whitespace) is not allowed\
between the two sets of brackets:\
\
[Example 596](https://github.github.com/gfm/#example-596)\
\
```markdown\
![foo]\
[]\
\
[foo]: /url "title"\
```\
\
```html\
<p><img src="/url" alt="foo" title="title" />\
[]</p>\
```\
\
Shortcut:\
\
[Example 597](https://github.github.com/gfm/#example-597)\
\
```markdown\
![foo]\
\
[foo]: /url "title"\
```\
\
```html\
<p><img src="/url" alt="foo" title="title" /></p>\
```\
\
[Example 598](https://github.github.com/gfm/#example-598)\
\
```markdown\
![*foo* bar]\
\
[*foo* bar]: /url "title"\
```\
\
```html\
<p><img src="/url" alt="foo bar" title="title" /></p>\
```\
\
Note that link labels cannot contain unescaped brackets:\
\
[Example 599](https://github.github.com/gfm/#example-599)\
\
```markdown\
![[foo]]\
\
[[foo]]: /url "title"\
```\
\
```html\
<p>![[foo]]</p>\
<p>[[foo]]: /url &quot;title&quot;</p>\
```\
\
The link labels are case-insensitive:\
\
[Example 600](https://github.github.com/gfm/#example-600)\
\
```markdown\
![Foo]\
\
[foo]: /url "title"\
```\
\
```html\
<p><img src="/url" alt="Foo" title="title" /></p>\
```\
\
If you just want a literal `!` followed by bracketed text, you can\
backslash-escape the opening `[`:\
\
[Example 601](https://github.github.com/gfm/#example-601)\
\
```markdown\
!\[foo]\
\
[foo]: /url "title"\
```\
\
```html\
<p>![foo]</p>\
```\
\
If you want a link after a literal `!`, backslash-escape the\
`!`:\
\
[Example 602](https://github.github.com/gfm/#example-602)\
\
```markdown\
\![foo]\
\
[foo]: /url "title"\
```\
\
```html\
<p>!<a href="/url" title="title">foo</a></p>\
```\
\
## 6.8Autolinks\
\
[Autolink](https://github.github.com/gfm/#autolink) s are absolute URIs and email addresses inside\
`<` and `>`. They are parsed as links, with the URL or email address\
as the link label.\
\
A [URI autolink](https://github.github.com/gfm/#uri-autolink) consists of `<`, followed by an\
[absolute URI](https://github.github.com/gfm/#absolute-uri) followed by `>`. It is parsed as\
a link to the URI, with the URI as the link’s label.\
\
An [absolute URI](https://github.github.com/gfm/#absolute-uri),\
for these purposes, consists of a [scheme](https://github.github.com/gfm/#scheme) followed by a colon (`:`)\
followed by zero or more characters other than ASCII\
[whitespace](https://github.github.com/gfm/#whitespace) and control characters, `<`, and `>`. If\
the URI includes these characters, they must be percent-encoded\
(e.g. `%20` for a space).\
\
For purposes of this spec, a [scheme](https://github.github.com/gfm/#scheme) is any sequence\
of 2–32 characters beginning with an ASCII letter and followed\
by any combination of ASCII letters, digits, or the symbols plus\
(“+”), period (“.”), or hyphen (“-”).\
\
Here are some valid autolinks:\
\
[Example 603](https://github.github.com/gfm/#example-603)\
\
```markdown\
<http://foo.bar.baz>\
```\
\
```html\
<p><a href="http://foo.bar.baz">http://foo.bar.baz</a></p>\
```\
\
[Example 604](https://github.github.com/gfm/#example-604)\
\
```markdown\
<http://foo.bar.baz/test?q=hello&id=22&boolean>\
```\
\
```html\
<p><a href="http://foo.bar.baz/test?q=hello&amp;id=22&amp;boolean">http://foo.bar.baz/test?q=hello&amp;id=22&amp;boolean</a></p>\
```\
\
[Example 605](https://github.github.com/gfm/#example-605)\
\
```markdown\
<irc://foo.bar:2233/baz>\
```\
\
```html\
<p><a href="irc://foo.bar:2233/baz">irc://foo.bar:2233/baz</a></p>\
```\
\
Uppercase is also fine:\
\
[Example 606](https://github.github.com/gfm/#example-606)\
\
```markdown\
<MAILTO:FOO@BAR.BAZ>\
```\
\
```html\
<p><a href="MAILTO:FOO@BAR.BAZ">MAILTO:FOO@BAR.BAZ</a></p>\
```\
\
Note that many strings that count as [absolute URIs](https://github.github.com/gfm/#absolute-uri) for\
purposes of this spec are not valid URIs, because their\
schemes are not registered or because of other problems\
with their syntax:\
\
[Example 607](https://github.github.com/gfm/#example-607)\
\
```markdown\
<a+b+c:d>\
```\
\
```html\
<p><a href="a+b+c:d">a+b+c:d</a></p>\
```\
\
[Example 608](https://github.github.com/gfm/#example-608)\
\
```markdown\
<made-up-scheme://foo,bar>\
```\
\
```html\
<p><a href="made-up-scheme://foo,bar">made-up-scheme://foo,bar</a></p>\
```\
\
[Example 609](https://github.github.com/gfm/#example-609)\
\
```markdown\
<http://../>\
```\
\
```html\
<p><a href="http://../">http://../</a></p>\
```\
\
[Example 610](https://github.github.com/gfm/#example-610)\
\
```markdown\
<localhost:5001/foo>\
```\
\
```html\
<p><a href="localhost:5001/foo">localhost:5001/foo</a></p>\
```\
\
Spaces are not allowed in autolinks:\
\
[Example 611](https://github.github.com/gfm/#example-611)\
\
```markdown\
<http://foo.bar/baz bim>\
```\
\
```html\
<p>&lt;http://foo.bar/baz bim&gt;</p>\
```\
\
Backslash-escapes do not work inside autolinks:\
\
[Example 612](https://github.github.com/gfm/#example-612)\
\
```markdown\
<http://example.com/\[\>\
```\
\
```html\
<p><a href="http://example.com/%5C%5B%5C">http://example.com/\[\</a></p>\
```\
\
An [email autolink](https://github.github.com/gfm/#email-autolink)\
consists of `<`, followed by an [email address](https://github.github.com/gfm/#email-address),\
followed by `>`. The link’s label is the email address,\
and the URL is `mailto:` followed by the email address.\
\
An [email address](https://github.github.com/gfm/#email-address),\
for these purposes, is anything that matches\
the [non-normative regex from the HTML5\\
spec](https://html.spec.whatwg.org/multipage/forms.html#e-mail-state-(type=email)):\
\
```\
/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\
(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/\
```\
\
Examples of email autolinks:\
\
[Example 613](https://github.github.com/gfm/#example-613)\
\
```markdown\
<foo@bar.example.com>\
```\
\
```html\
<p><a href="mailto:foo@bar.example.com">foo@bar.example.com</a></p>\
```\
\
[Example 614](https://github.github.com/gfm/#example-614)\
\
```markdown\
<foo+special@Bar.baz-bar0.com>\
```\
\
```html\
<p><a href="mailto:foo+special@Bar.baz-bar0.com">foo+special@Bar.baz-bar0.com</a></p>\
```\
\
Backslash-escapes do not work inside email autolinks:\
\
[Example 615](https://github.github.com/gfm/#example-615)\
\
```markdown\
<foo\+@bar.example.com>\
```\
\
```html\
<p>&lt;foo+@bar.example.com&gt;</p>\
```\
\
These are not autolinks:\
\
[Example 616](https://github.github.com/gfm/#example-616)\
\
```markdown\
<>\
```\
\
```html\
<p>&lt;&gt;</p>\
```\
\
[Example 617](https://github.github.com/gfm/#example-617)\
\
```markdown\
< http://foo.bar >\
```\
\
```html\
<p>&lt; http://foo.bar &gt;</p>\
```\
\
[Example 618](https://github.github.com/gfm/#example-618)\
\
```markdown\
<m:abc>\
```\
\
```html\
<p>&lt;m:abc&gt;</p>\
```\
\
[Example 619](https://github.github.com/gfm/#example-619)\
\
```markdown\
<foo.bar.baz>\
```\
\
```html\
<p>&lt;foo.bar.baz&gt;</p>\
```\
\
[Example 620](https://github.github.com/gfm/#example-620)\
\
```markdown\
http://example.com\
```\
\
```html\
<p>http://example.com</p>\
```\
\
[Example 621](https://github.github.com/gfm/#example-621)\
\
```markdown\
foo@bar.example.com\
```\
\
```html\
<p>foo@bar.example.com</p>\
```\
\
## 6.9Autolinks (extension)\
\
GFM enables the `autolink` extension, where autolinks will be recognised in a\
greater number of conditions.\
\
[Autolink](https://github.github.com/gfm/#autolink) s can also be constructed without requiring the use of `<` and to `>`\
to delimit them, although they will be recognized under a smaller set of\
circumstances. All such recognized autolinks can only come at the beginning of\
a line, after whitespace, or any of the delimiting characters `*`, `_`, `~`,\
and `(`.\
\
An [extended www autolink](https://github.github.com/gfm/#extended-www-autolink) will be recognized\
when the text `www.` is found followed by a [valid domain](https://github.github.com/gfm/#valid-domain).\
A [valid domain](https://github.github.com/gfm/#valid-domain) consists of segments\
of alphanumeric characters, underscores (`_`) and hyphens (`-`)\
separated by periods (`.`).\
There must be at least one period,\
and no underscores may be present in the last two segments of the domain.\
\
The scheme `http` will be inserted automatically:\
\
[Example 622](https://github.github.com/gfm/#example-622)\
\
```markdown\
www.commonmark.org\
```\
\
```html\
<p><a href="http://www.commonmark.org">www.commonmark.org</a></p>\
```\
\
After a [valid domain](https://github.github.com/gfm/#valid-domain), zero or more non-space non-`<` characters may follow:\
\
[Example 623](https://github.github.com/gfm/#example-623)\
\
```markdown\
Visit www.commonmark.org/help for more information.\
```\
\
```html\
<p>Visit <a href="http://www.commonmark.org/help">www.commonmark.org/help</a> for more information.</p>\
```\
\
We then apply [extended autolink path validation](https://github.github.com/gfm/#extended-autolink-path-validation) as follows:\
\
Trailing punctuation (specifically, `?`, `!`, `.`, `,`, `:`, `*`, `_`, and `~`)\
will not be considered part of the autolink, though they may be included in the\
interior of the link:\
\
[Example 624](https://github.github.com/gfm/#example-624)\
\
```markdown\
Visit www.commonmark.org.\
\
Visit www.commonmark.org/a.b.\
```\
\
```html\
<p>Visit <a href="http://www.commonmark.org">www.commonmark.org</a>.</p>\
<p>Visit <a href="http://www.commonmark.org/a.b">www.commonmark.org/a.b</a>.</p>\
```\
\
When an autolink ends in `)`, we scan the entire autolink for the total number\
of parentheses. If there is a greater number of closing parentheses than\
opening ones, we don’t consider the unmatched trailing parentheses part of the\
autolink, in order to facilitate including an autolink inside a parenthesis:\
\
[Example 625](https://github.github.com/gfm/#example-625)\
\
```markdown\
www.google.com/search?q=Markup+(business)\
\
www.google.com/search?q=Markup+(business)))\
\
(www.google.com/search?q=Markup+(business))\
\
(www.google.com/search?q=Markup+(business)\
```\
\
```html\
<p><a href="http://www.google.com/search?q=Markup+(business)">www.google.com/search?q=Markup+(business)</a></p>\
<p><a href="http://www.google.com/search?q=Markup+(business)">www.google.com/search?q=Markup+(business)</a>))</p>\
<p>(<a href="http://www.google.com/search?q=Markup+(business)">www.google.com/search?q=Markup+(business)</a>)</p>\
<p>(<a href="http://www.google.com/search?q=Markup+(business)">www.google.com/search?q=Markup+(business)</a></p>\
```\
\
This check is only done when the link ends in a closing parentheses `)`, so if\
the only parentheses are in the interior of the autolink, no special rules are\
applied:\
\
[Example 626](https://github.github.com/gfm/#example-626)\
\
```markdown\
www.google.com/search?q=(business))+ok\
```\
\
```html\
<p><a href="http://www.google.com/search?q=(business))+ok">www.google.com/search?q=(business))+ok</a></p>\
```\
\
If an autolink ends in a semicolon (`;`), we check to see if it appears to\
resemble an [entity reference](https://github.github.com/gfm/#entity-references); if the preceding text is `&`\
followed by one or more alphanumeric characters. If so, it is excluded from\
the autolink:\
\
[Example 627](https://github.github.com/gfm/#example-627)\
\
```markdown\
www.google.com/search?q=commonmark&hl=en\
\
www.google.com/search?q=commonmark&hl;\
```\
\
```html\
<p><a href="http://www.google.com/search?q=commonmark&amp;hl=en">www.google.com/search?q=commonmark&amp;hl=en</a></p>\
<p><a href="http://www.google.com/search?q=commonmark">www.google.com/search?q=commonmark</a>&amp;hl;</p>\
```\
\
`<` immediately ends an autolink.\
\
[Example 628](https://github.github.com/gfm/#example-628)\
\
```markdown\
www.commonmark.org/he<lp\
```\
\
```html\
<p><a href="http://www.commonmark.org/he">www.commonmark.org/he</a>&lt;lp</p>\
```\
\
An [extended url autolink](https://github.github.com/gfm/#extended-url-autolink) will be recognised when one of the schemes\
`http://`, or `https://`, followed by a [valid domain](https://github.github.com/gfm/#valid-domain), then zero or\
more non-space non-`<` characters according to\
[extended autolink path validation](https://github.github.com/gfm/#extended-autolink-path-validation):\
\
[Example 629](https://github.github.com/gfm/#example-629)\
\
```markdown\
http://commonmark.org\
\
(Visit https://encrypted.google.com/search?q=Markup+(business))\
```\
\
```html\
<p><a href="http://commonmark.org">http://commonmark.org</a></p>\
<p>(Visit <a href="https://encrypted.google.com/search?q=Markup+(business)">https://encrypted.google.com/search?q=Markup+(business)</a>)</p>\
```\
\
An [extended email autolink](https://github.github.com/gfm/#extended-email-autolink) will be recognised when an email address is\
recognised within any text node. Email addresses are recognised according to\
the following rules:\
\
- One ore more characters which are alphanumeric, or `.`, `-`, `_`, or `+`.\
- An `@` symbol.\
- One or more characters which are alphanumeric, or `-` or `_`,\
separated by periods (`.`).\
There must be at least one period.\
The last character must not be one of `-` or `_`.\
\
The scheme `mailto:` will automatically be added to the generated link:\
\
[Example 630](https://github.github.com/gfm/#example-630)\
\
```markdown\
foo@bar.baz\
```\
\
```html\
<p><a href="mailto:foo@bar.baz">foo@bar.baz</a></p>\
```\
\
`+` can occur before the `@`, but not after.\
\
[Example 631](https://github.github.com/gfm/#example-631)\
\
```markdown\
hello@mail+xyz.example isn't valid, but hello+xyz@mail.example is.\
```\
\
```html\
<p>hello@mail+xyz.example isn't valid, but <a href="mailto:hello+xyz@mail.example">hello+xyz@mail.example</a> is.</p>\
```\
\
`.`, `-`, and `_` can occur on both sides of the `@`, but only `.` may occur at\
the end of the email address, in which case it will not be considered part of\
the address:\
\
[Example 632](https://github.github.com/gfm/#example-632)\
\
```markdown\
a.b-c_d@a.b\
\
a.b-c_d@a.b.\
\
a.b-c_d@a.b-\
\
a.b-c_d@a.b_\
```\
\
```html\
<p><a href="mailto:a.b-c_d@a.b">a.b-c_d@a.b</a></p>\
<p><a href="mailto:a.b-c_d@a.b">a.b-c_d@a.b</a>.</p>\
<p>a.b-c_d@a.b-</p>\
<p>a.b-c_d@a.b_</p>\
```\
\
An [extended protocol autolink](https://github.github.com/gfm/#extended-protocol-autolink) will be recognised when a protocol is\
recognised within any text node. Valid protocols are:\
\
- `mailto:`\
- `xmpp:`\
\
The scheme of the protocol will automatically be added to the generated link.\
All the rules of email address autolinking apply.\
\
[Example 633](https://github.github.com/gfm/#example-633)\
\
```markdown\
mailto:foo@bar.baz\
\
mailto:a.b-c_d@a.b\
\
mailto:a.b-c_d@a.b.\
\
mailto:a.b-c_d@a.b/\
\
mailto:a.b-c_d@a.b-\
\
mailto:a.b-c_d@a.b_\
\
xmpp:foo@bar.baz\
\
xmpp:foo@bar.baz.\
```\
\
```html\
<p><a href="mailto:foo@bar.baz">mailto:foo@bar.baz</a></p>\
<p><a href="mailto:a.b-c_d@a.b">mailto:a.b-c_d@a.b</a></p>\
<p><a href="mailto:a.b-c_d@a.b">mailto:a.b-c_d@a.b</a>.</p>\
<p><a href="mailto:a.b-c_d@a.b">mailto:a.b-c_d@a.b</a>/</p>\
<p>mailto:a.b-c_d@a.b-</p>\
<p>mailto:a.b-c_d@a.b_</p>\
<p><a href="xmpp:foo@bar.baz">xmpp:foo@bar.baz</a></p>\
<p><a href="xmpp:foo@bar.baz">xmpp:foo@bar.baz</a>.</p>\
```\
\
A described in the [specification](https://datatracker.ietf.org/doc/rfc7622/)`xmpp` offers an optional `/` followed by a resource. The resource can contain\
all alphanumeric characters, as well as `@` and `.`.\
\
[Example 634](https://github.github.com/gfm/#example-634)\
\
```markdown\
xmpp:foo@bar.baz/txt\
\
xmpp:foo@bar.baz/txt@bin\
\
xmpp:foo@bar.baz/txt@bin.com\
```\
\
```html\
<p><a href="xmpp:foo@bar.baz/txt">xmpp:foo@bar.baz/txt</a></p>\
<p><a href="xmpp:foo@bar.baz/txt@bin">xmpp:foo@bar.baz/txt@bin</a></p>\
<p><a href="xmpp:foo@bar.baz/txt@bin.com">xmpp:foo@bar.baz/txt@bin.com</a></p>\
```\
\
Further `/` characters are not considered part of the domain:\
\
[Example 635](https://github.github.com/gfm/#example-635)\
\
```markdown\
xmpp:foo@bar.baz/txt/bin\
```\
\
```html\
<p><a href="xmpp:foo@bar.baz/txt">xmpp:foo@bar.baz/txt</a>/bin</p>\
```\
\
## 6.10Raw HTML\
\
Text between `<` and `>` that looks like an HTML tag is parsed as a\
raw HTML tag and will be rendered in HTML without escaping.\
Tag and attribute names are not limited to current HTML tags,\
so custom tags (and even, say, DocBook tags) may be used.\
\
Here is the grammar for tags:\
\
A [tag name](https://github.github.com/gfm/#tag-name) consists of an ASCII letter\
followed by zero or more ASCII letters, digits, or\
hyphens (`-`).\
\
An [attribute](https://github.github.com/gfm/#attribute) consists of [whitespace](https://github.github.com/gfm/#whitespace),\
an [attribute name](https://github.github.com/gfm/#attribute-name), and an optional\
[attribute value specification](https://github.github.com/gfm/#attribute-value-specification).\
\
An [attribute name](https://github.github.com/gfm/#attribute-name)\
consists of an ASCII letter, `_`, or `:`, followed by zero or more ASCII\
letters, digits, `_`, `.`, `:`, or `-`. (Note: This is the XML\
specification restricted to ASCII. HTML5 is laxer.)\
\
An [attribute value specification](https://github.github.com/gfm/#attribute-value-specification)\
consists of optional [whitespace](https://github.github.com/gfm/#whitespace),\
a `=` character, optional [whitespace](https://github.github.com/gfm/#whitespace), and an [attribute\\
value](https://github.github.com/gfm/#attribute-value).\
\
An [attribute value](https://github.github.com/gfm/#attribute-value)\
consists of an [unquoted attribute value](https://github.github.com/gfm/#unquoted-attribute-value),\
a [single-quoted attribute value](https://github.github.com/gfm/#single-quoted-attribute-value), or a [double-quoted attribute value](https://github.github.com/gfm/#double-quoted-attribute-value).\
\
An [unquoted attribute value](https://github.github.com/gfm/#unquoted-attribute-value)\
is a nonempty string of characters not\
including [whitespace](https://github.github.com/gfm/#whitespace), `"`, `'`, `=`, `<`, `>`, or `````.\
\
A [single-quoted attribute value](https://github.github.com/gfm/#single-quoted-attribute-value)\
consists of `'`, zero or more\
characters not including `'`, and a final `'`.\
\
A [double-quoted attribute value](https://github.github.com/gfm/#double-quoted-attribute-value)\
consists of `"`, zero or more\
characters not including `"`, and a final `"`.\
\
An [open tag](https://github.github.com/gfm/#open-tag) consists of a `<` character, a [tag name](https://github.github.com/gfm/#tag-name),\
zero or more [attributes](https://github.github.com/gfm/#attribute), optional [whitespace](https://github.github.com/gfm/#whitespace), an optional `/`\
character, and a `>` character.\
\
A [closing tag](https://github.github.com/gfm/#closing-tag) consists of the string `</`, a\
[tag name](https://github.github.com/gfm/#tag-name), optional [whitespace](https://github.github.com/gfm/#whitespace), and the character `>`.\
\
An [HTML comment](https://github.github.com/gfm/#html-comment) consists of `<!--` \+ _text_ \+ `-->`,\
where _text_ does not start with `>` or `->`, does not end with `-`,\
and does not contain `--`. (See the\
[HTML5 spec](http://www.w3.org/TR/html5/syntax.html#comments).)\
\
A [processing instruction](https://github.github.com/gfm/#processing-instruction)\
consists of the string `<?`, a string\
of characters not including the string `?>`, and the string\
`?>`.\
\
A [declaration](https://github.github.com/gfm/#declaration) consists of the\
string `<!`, a name consisting of one or more uppercase ASCII letters,\
[whitespace](https://github.github.com/gfm/#whitespace), a string of characters not including the\
character `>`, and the character `>`.\
\
A [CDATA section](https://github.github.com/gfm/#cdata-section) consists of\
the string `<![CDATA[`, a string of characters not including the string\
`]]>`, and the string `]]>`.\
\
An [HTML tag](https://github.github.com/gfm/#html-tag) consists of an [open tag](https://github.github.com/gfm/#open-tag), a [closing tag](https://github.github.com/gfm/#closing-tag),\
an [HTML comment](https://github.github.com/gfm/#html-comment), a [processing instruction](https://github.github.com/gfm/#processing-instruction), a [declaration](https://github.github.com/gfm/#declaration),\
or a [CDATA section](https://github.github.com/gfm/#cdata-section).\
\
Here are some simple open tags:\
\
[Example 636](https://github.github.com/gfm/#example-636)\
\
```markdown\
<a><bab><c2c>\
```\
\
```html\
<p><a><bab><c2c></p>\
```\
\
Empty elements:\
\
[Example 637](https://github.github.com/gfm/#example-637)\
\
```markdown\
<a/><b2/>\
```\
\
```html\
<p><a/><b2/></p>\
```\
\
[Whitespace](https://github.github.com/gfm/#whitespace) is allowed:\
\
[Example 638](https://github.github.com/gfm/#example-638)\
\
```markdown\
<a  /><b2\
data="foo" >\
```\
\
```html\
<p><a  /><b2\
data="foo" ></p>\
```\
\
With attributes:\
\
[Example 639](https://github.github.com/gfm/#example-639)\
\
```markdown\
<a foo="bar" bam = 'baz <em>"</em>'\
_boolean zoop:33=zoop:33 />\
```\
\
```html\
<p><a foo="bar" bam = 'baz <em>"</em>'\
_boolean zoop:33=zoop:33 /></p>\
```\
\
Custom tag names can be used:\
\
[Example 640](https://github.github.com/gfm/#example-640)\
\
```markdown\
Foo <responsive-image src="foo.jpg" />\
```\
\
```html\
<p>Foo <responsive-image src="foo.jpg" /></p>\
```\
\
Illegal tag names, not parsed as HTML:\
\
[Example 641](https://github.github.com/gfm/#example-641)\
\
```markdown\
<33> <__>\
```\
\
```html\
<p>&lt;33&gt; &lt;__&gt;</p>\
```\
\
Illegal attribute names:\
\
[Example 642](https://github.github.com/gfm/#example-642)\
\
```markdown\
<a h*#ref="hi">\
```\
\
```html\
<p>&lt;a h*#ref=&quot;hi&quot;&gt;</p>\
```\
\
Illegal attribute values:\
\
[Example 643](https://github.github.com/gfm/#example-643)\
\
```markdown\
<a href="hi'> <a href=hi'>\
```\
\
```html\
<p>&lt;a href=&quot;hi'&gt; &lt;a href=hi'&gt;</p>\
```\
\
Illegal [whitespace](https://github.github.com/gfm/#whitespace):\
\
[Example 644](https://github.github.com/gfm/#example-644)\
\
```markdown\
< a><\
foo><bar/ >\
<foo bar=baz\
bim!bop />\
```\
\
```html\
<p>&lt; a&gt;&lt;\
foo&gt;&lt;bar/ &gt;\
&lt;foo bar=baz\
bim!bop /&gt;</p>\
```\
\
Missing [whitespace](https://github.github.com/gfm/#whitespace):\
\
[Example 645](https://github.github.com/gfm/#example-645)\
\
```markdown\
<a href='bar'title=title>\
```\
\
```html\
<p>&lt;a href='bar'title=title&gt;</p>\
```\
\
Closing tags:\
\
[Example 646](https://github.github.com/gfm/#example-646)\
\
```markdown\
</a></foo >\
```\
\
```html\
<p></a></foo ></p>\
```\
\
Illegal attributes in closing tag:\
\
[Example 647](https://github.github.com/gfm/#example-647)\
\
```markdown\
</a href="foo">\
```\
\
```html\
<p>&lt;/a href=&quot;foo&quot;&gt;</p>\
```\
\
Comments:\
\
[Example 648](https://github.github.com/gfm/#example-648)\
\
```markdown\
foo <!-- this is a\
comment - with hyphen -->\
```\
\
```html\
<p>foo <!-- this is a\
comment - with hyphen --></p>\
```\
\
[Example 649](https://github.github.com/gfm/#example-649)\
\
```markdown\
foo <!-- not a comment -- two hyphens -->\
```\
\
```html\
<p>foo &lt;!-- not a comment -- two hyphens --&gt;</p>\
```\
\
Not comments:\
\
[Example 650](https://github.github.com/gfm/#example-650)\
\
```markdown\
foo <!--> foo -->\
\
foo <!-- foo--->\
```\
\
```html\
<p>foo &lt;!--&gt; foo --&gt;</p>\
<p>foo &lt;!-- foo---&gt;</p>\
```\
\
Processing instructions:\
\
[Example 651](https://github.github.com/gfm/#example-651)\
\
```markdown\
foo <?php echo $a; ?>\
```\
\
```html\
<p>foo <?php echo $a; ?></p>\
```\
\
Declarations:\
\
[Example 652](https://github.github.com/gfm/#example-652)\
\
```markdown\
foo <!ELEMENT br EMPTY>\
```\
\
```html\
<p>foo <!ELEMENT br EMPTY></p>\
```\
\
CDATA sections:\
\
[Example 653](https://github.github.com/gfm/#example-653)\
\
```markdown\
foo <![CDATA[>&<]]>\
```\
\
```html\
<p>foo <![CDATA[>&<]]></p>\
```\
\
Entity and numeric character references are preserved in HTML\
attributes:\
\
[Example 654](https://github.github.com/gfm/#example-654)\
\
```markdown\
foo <a href="&ouml;">\
```\
\
```html\
<p>foo <a href="&ouml;"></p>\
```\
\
Backslash escapes do not work in HTML attributes:\
\
[Example 655](https://github.github.com/gfm/#example-655)\
\
```markdown\
foo <a href="\*">\
```\
\
```html\
<p>foo <a href="\*"></p>\
```\
\
[Example 656](https://github.github.com/gfm/#example-656)\
\
```markdown\
<a href="\"">\
```\
\
```html\
<p>&lt;a href=&quot;&quot;&quot;&gt;</p>\
```\
\
## 6.11Disallowed Raw HTML (extension)\
\
GFM enables the `tagfilter` extension, where the following HTML tags will be\
filtered when rendering HTML output:\
\
- `<title>`\
- `<textarea>`\
- `<style>`\
- `<xmp>`\
- `<iframe>`\
- `<noembed>`\
- `<noframes>`\
- `<script>`\
- `<plaintext>`\
\
Filtering is done by replacing the leading `<` with the entity `&lt;`. These\
tags are chosen in particular as they change how HTML is interpreted in a way\
unique to them (i.e. nested HTML is interpreted differently), and this is\
usually undesireable in the context of other rendered Markdown content.\
\
All other HTML tags are left untouched.\
\
[Example 657](https://github.github.com/gfm/#example-657)\
\
```markdown\
<strong> <title> <style> <em>\
\
<blockquote>\
  <xmp> is disallowed.  <XMP> is also disallowed.\
</blockquote>\
```\
\
```html\
<p><strong> &lt;title> &lt;style> <em></p>\
<blockquote>\
  &lt;xmp> is disallowed.  &lt;XMP> is also disallowed.\
</blockquote>\
```\
\
## 6.12Hard line breaks\
\
A line break (not in a code span or HTML tag) that is preceded\
by two or more spaces and does not occur at the end of a block\
is parsed as a [hard line break](https://github.github.com/gfm/#hard-line-break) (rendered\
in HTML as a `<br />` tag):\
\
[Example 658](https://github.github.com/gfm/#example-658)\
\
```markdown\
foo\
baz\
```\
\
```html\
<p>foo<br />\
baz</p>\
```\
\
For a more visible alternative, a backslash before the\
[line ending](https://github.github.com/gfm/#line-ending) may be used instead of two spaces:\
\
[Example 659](https://github.github.com/gfm/#example-659)\
\
```markdown\
foo\\
baz\
```\
\
```html\
<p>foo<br />\
baz</p>\
```\
\
More than two spaces can be used:\
\
[Example 660](https://github.github.com/gfm/#example-660)\
\
```markdown\
foo\
baz\
```\
\
```html\
<p>foo<br />\
baz</p>\
```\
\
Leading spaces at the beginning of the next line are ignored:\
\
[Example 661](https://github.github.com/gfm/#example-661)\
\
```markdown\
foo\
     bar\
```\
\
```html\
<p>foo<br />\
bar</p>\
```\
\
[Example 662](https://github.github.com/gfm/#example-662)\
\
```markdown\
foo\\
     bar\
```\
\
```html\
<p>foo<br />\
bar</p>\
```\
\
Line breaks can occur inside emphasis, links, and other constructs\
that allow inline content:\
\
[Example 663](https://github.github.com/gfm/#example-663)\
\
```markdown\
*foo\
bar*\
```\
\
```html\
<p><em>foo<br />\
bar</em></p>\
```\
\
[Example 664](https://github.github.com/gfm/#example-664)\
\
```markdown\
*foo\\
bar*\
```\
\
```html\
<p><em>foo<br />\
bar</em></p>\
```\
\
Line breaks do not occur inside code spans\
\
[Example 665](https://github.github.com/gfm/#example-665)\
\
```markdown\
`code\
span`\
```\
\
```html\
<p><code>code   span</code></p>\
```\
\
[Example 666](https://github.github.com/gfm/#example-666)\
\
```markdown\
`code\\
span`\
```\
\
```html\
<p><code>code\ span</code></p>\
```\
\
or HTML tags:\
\
[Example 667](https://github.github.com/gfm/#example-667)\
\
```markdown\
<a href="foo\
bar">\
```\
\
```html\
<p><a href="foo\
bar"></p>\
```\
\
[Example 668](https://github.github.com/gfm/#example-668)\
\
```markdown\
<a href="foo\\
bar">\
```\
\
```html\
<p><a href="foo\\
bar"></p>\
```\
\
Hard line breaks are for separating inline content within a block.\
Neither syntax for hard line breaks works at the end of a paragraph or\
other block element:\
\
[Example 669](https://github.github.com/gfm/#example-669)\
\
```markdown\
foo\\
```\
\
```html\
<p>foo\</p>\
```\
\
[Example 670](https://github.github.com/gfm/#example-670)\
\
```markdown\
foo\
```\
\
```html\
<p>foo</p>\
```\
\
[Example 671](https://github.github.com/gfm/#example-671)\
\
```markdown\
### foo\\
```\
\
```html\
<h3>foo\</h3>\
```\
\
[Example 672](https://github.github.com/gfm/#example-672)\
\
```markdown\
### foo\
```\
\
```html\
<h3>foo</h3>\
```\
\
## 6.13Soft line breaks\
\
A regular line break (not in a code span or HTML tag) that is not\
preceded by two or more spaces or a backslash is parsed as a\
[softbreak](https://github.github.com/gfm/#softbreak). (A softbreak may be rendered in HTML either as a\
[line ending](https://github.github.com/gfm/#line-ending) or as a space. The result will be the same in\
browsers. In the examples here, a [line ending](https://github.github.com/gfm/#line-ending) will be used.)\
\
[Example 673](https://github.github.com/gfm/#example-673)\
\
```markdown\
foo\
baz\
```\
\
```html\
<p>foo\
baz</p>\
```\
\
Spaces at the end of the line and beginning of the next line are\
removed:\
\
[Example 674](https://github.github.com/gfm/#example-674)\
\
```markdown\
foo\
 baz\
```\
\
```html\
<p>foo\
baz</p>\
```\
\
A conforming parser may render a soft line break in HTML either as a\
line break or as a space.\
\
A renderer may also provide an option to render soft line breaks\
as hard line breaks.\
\
## 6.14Textual content\
\
Any characters not given an interpretation by the above rules will\
be parsed as plain textual content.\
\
[Example 675](https://github.github.com/gfm/#example-675)\
\
```markdown\
hello $.;'there\
```\
\
```html\
<p>hello $.;'there</p>\
```\
\
[Example 676](https://github.github.com/gfm/#example-676)\
\
```markdown\
Foo χρῆν\
```\
\
```html\
<p>Foo χρῆν</p>\
```\
\
Internal spaces are preserved verbatim:\
\
[Example 677](https://github.github.com/gfm/#example-677)\
\
```markdown\
Multiple     spaces\
```\
\
```html\
<p>Multiple     spaces</p>\
```\
\
# Appendix: A parsing strategy\
\
In this appendix we describe some features of the parsing strategy\
used in the CommonMark reference implementations.\
\
## Overview\
\
Parsing has two phases:\
\
1. In the first phase, lines of input are consumed and the block\
   structure of the document—its division into paragraphs, block quotes,\
   list items, and so on—is constructed. Text is assigned to these\
   blocks but not parsed. Link reference definitions are parsed and a\
   map of links is constructed.\
\
2. In the second phase, the raw text contents of paragraphs and headings\
   are parsed into sequences of Markdown inline elements (strings,\
   code spans, links, emphasis, and so on), using the map of link\
   references constructed in phase 1.\
\
\
At each point in processing, the document is represented as a tree of\
**blocks**. The root of the tree is a `document` block. The `document`\
may have any number of other blocks as **children**. These children\
may, in turn, have other blocks as children. The last child of a block\
is normally considered **open**, meaning that subsequent lines of input\
can alter its contents. (Blocks that are not open are **closed**.)\
Here, for example, is a possible document tree, with the open blocks\
marked by arrows:\
\
```tree\
-> document\
  -> block_quote\
       paragraph\
         "Lorem ipsum dolor\nsit amet."\
    -> list (type=bullet tight=true bullet_char=-)\
         list_item\
           paragraph\
             "Qui *quodsi iracundia*"\
      -> list_item\
        -> paragraph\
             "aliquando id"\
```\
\
## Phase 1: block structure\
\
Each line that is processed has an effect on this tree. The line is\
analyzed and, depending on its contents, the document may be altered\
in one or more of the following ways:\
\
1. One or more open blocks may be closed.\
2. One or more new blocks may be created as children of the\
   last open block.\
3. Text may be added to the last (deepest) open block remaining\
   on the tree.\
\
Once a line has been incorporated into the tree in this way,\
it can be discarded, so input can be read in a stream.\
\
For each line, we follow this procedure:\
\
1. First we iterate through the open blocks, starting with the\
   root document, and descending through last children down to the last\
   open block. Each block imposes a condition that the line must satisfy\
   if the block is to remain open. For example, a block quote requires a\
   `>` character. A paragraph requires a non-blank line.\
   In this phase we may match all or just some of the open\
   blocks. But we cannot close unmatched blocks yet, because we may have a\
   [lazy continuation line](https://github.github.com/gfm/#lazy-continuation-line).\
\
2. Next, after consuming the continuation markers for existing\
   blocks, we look for new block starts (e.g. `>` for a block quote).\
   If we encounter a new block start, we close any blocks unmatched\
   in step 1 before creating the new block as a child of the last\
   matched block.\
\
3. Finally, we look at the remainder of the line (after block\
   markers like `>`, list markers, and indentation have been consumed).\
   This is text that can be incorporated into the last open\
   block (a paragraph, code block, heading, or raw HTML).\
\
\
Setext headings are formed when we see a line of a paragraph\
that is a [setext heading underline](https://github.github.com/gfm/#setext-heading-underline).\
\
Reference link definitions are detected when a paragraph is closed;\
the accumulated text lines are parsed to see if they begin with\
one or more reference link definitions. Any remainder becomes a\
normal paragraph.\
\
We can see how this works by considering how the tree above is\
generated by four lines of Markdown:\
\
```markdown\
> Lorem ipsum dolor\
sit amet.\
> - Qui *quodsi iracundia*\
> - aliquando id\
```\
\
At the outset, our document model is just\
\
```tree\
-> document\
```\
\
The first line of our text,\
\
```markdown\
> Lorem ipsum dolor\
```\
\
causes a `block_quote` block to be created as a child of our\
open `document` block, and a `paragraph` block as a child of\
the `block_quote`. Then the text is added to the last open\
block, the `paragraph`:\
\
```tree\
-> document\
  -> block_quote\
    -> paragraph\
         "Lorem ipsum dolor"\
```\
\
The next line,\
\
```markdown\
sit amet.\
```\
\
is a “lazy continuation” of the open `paragraph`, so it gets added\
to the paragraph’s text:\
\
```tree\
-> document\
  -> block_quote\
    -> paragraph\
         "Lorem ipsum dolor\nsit amet."\
```\
\
The third line,\
\
```markdown\
> - Qui *quodsi iracundia*\
```\
\
causes the `paragraph` block to be closed, and a new `list` block\
opened as a child of the `block_quote`. A `list_item` is also\
added as a child of the `list`, and a `paragraph` as a child of\
the `list_item`. The text is then added to the new `paragraph`:\
\
```tree\
-> document\
  -> block_quote\
       paragraph\
         "Lorem ipsum dolor\nsit amet."\
    -> list (type=bullet tight=true bullet_char=-)\
      -> list_item\
        -> paragraph\
             "Qui *quodsi iracundia*"\
```\
\
The fourth line,\
\
```markdown\
> - aliquando id\
```\
\
causes the `list_item` (and its child the `paragraph`) to be closed,\
and a new `list_item` opened up as child of the `list`. A `paragraph`\
is added as a child of the new `list_item`, to contain the text.\
We thus obtain the final tree:\
\
```tree\
-> document\
  -> block_quote\
       paragraph\
         "Lorem ipsum dolor\nsit amet."\
    -> list (type=bullet tight=true bullet_char=-)\
         list_item\
           paragraph\
             "Qui *quodsi iracundia*"\
      -> list_item\
        -> paragraph\
             "aliquando id"\
```\
\
## Phase 2: inline structure\
\
Once all of the input has been parsed, all open blocks are closed.\
\
We then “walk the tree,” visiting every node, and parse raw\
string contents of paragraphs and headings as inlines. At this\
point we have seen all the link reference definitions, so we can\
resolve reference links as we go.\
\
```tree\
document\
  block_quote\
    paragraph\
      str "Lorem ipsum dolor"\
      softbreak\
      str "sit amet."\
    list (type=bullet tight=true bullet_char=-)\
      list_item\
        paragraph\
          str "Qui "\
          emph\
            str "quodsi iracundia"\
      list_item\
        paragraph\
          str "aliquando id"\
```\
\
Notice how the [line ending](https://github.github.com/gfm/#line-ending) in the first paragraph has\
been parsed as a `softbreak`, and the asterisks in the first list item\
have become an `emph`.\
\
### An algorithm for parsing nested emphasis and links\
\
By far the trickiest part of inline parsing is handling emphasis,\
strong emphasis, links, and images. This is done using the following\
algorithm.\
\
When we’re parsing inlines and we hit either\
\
- a run of `*` or `_` characters, or\
- a `[` or `![`\
\
we insert a text node with these symbols as its literal content, and we\
add a pointer to this text node to the [delimiter stack](https://github.github.com/gfm/#delimiter-stack).\
\
The [delimiter stack](https://github.github.com/gfm/#delimiter-stack) is a doubly linked list. Each\
element contains a pointer to a text node, plus information about\
\
- the type of delimiter (`[`, `![`, `*`, `_`)\
- the number of delimiters,\
- whether the delimiter is “active” (all are active to start), and\
- whether the delimiter is a potential opener, a potential closer,\
  or both (which depends on what sort of characters precede\
  and follow the delimiters).\
\
When we hit a `]` character, we call the _look for link or image_\
procedure (see below).\
\
When we hit the end of the input, we call the _process emphasis_\
procedure (see below), with `stack_bottom` = NULL.\
\
#### _look for link or image_\
\
Starting at the top of the delimiter stack, we look backwards\
through the stack for an opening `[` or `![` delimiter.\
\
- If we don’t find one, we return a literal text node `]`.\
\
- If we do find one, but it’s not _active_, we remove the inactive\
  delimiter from the stack, and return a literal text node `]`.\
\
- If we find one and it’s active, then we parse ahead to see if\
  we have an inline link/image, reference link/image, compact reference\
  link/image, or shortcut reference link/image.\
  - If we don’t, then we remove the opening delimiter from the\
    delimiter stack and return a literal text node `]`.\
\
  - If we do, then\
    - We return a link or image node whose children are the inlines\
      after the text node pointed to by the opening delimiter.\
\
    - We run _process emphasis_ on these inlines, with the `[` opener\
      as `stack_bottom`.\
\
    - We remove the opening delimiter.\
\
    - If we have a link (and not an image), we also set all\
      `[` delimiters before the opening delimiter to _inactive_. (This\
      will prevent us from getting links within links.)\
\
#### _process emphasis_\
\
Parameter `stack_bottom` sets a lower bound to how far we\
descend in the [delimiter stack](https://github.github.com/gfm/#delimiter-stack). If it is NULL, we can\
go all the way to the bottom. Otherwise, we stop before\
visiting `stack_bottom`.\
\
Let `current_position` point to the element on the [delimiter stack](https://github.github.com/gfm/#delimiter-stack)\
just above `stack_bottom` (or the first element if `stack_bottom`\
is NULL).\
\
We keep track of the `openers_bottom` for each delimiter\
type (`*`, `_`) and each length of the closing delimiter run\
(modulo 3). Initialize this to `stack_bottom`.\
\
Then we repeat the following until we run out of potential\
closers:\
\
- Move `current_position` forward in the delimiter stack (if needed)\
  until we find the first potential closer with delimiter `*` or `_`.\
  (This will be the potential closer closest\
  to the beginning of the input – the first one in parse order.)\
\
- Now, look back in the stack (staying above `stack_bottom` and\
  the `openers_bottom` for this delimiter type) for the\
  first matching potential opener (“matching” means same delimiter).\
\
- If one is found:\
  - Figure out whether we have emphasis or strong emphasis:\
    if both closer and opener spans have length >= 2, we have\
    strong, otherwise regular.\
\
  - Insert an emph or strong emph node accordingly, after\
    the text node corresponding to the opener.\
\
  - Remove any delimiters between the opener and closer from\
    the delimiter stack.\
\
  - Remove 1 (for regular emph) or 2 (for strong emph) delimiters\
    from the opening and closing text nodes. If they become empty\
    as a result, remove them and remove the corresponding element\
    of the delimiter stack. If the closing node is removed, reset\
    `current_position` to the next element in the stack.\
- If none is found:\
  - Set `openers_bottom` to the element before `current_position`.\
    (We know that there are no openers for this kind of closer up to and\
    including this point, so this puts a lower bound on future searches.)\
\
  - If the closer at `current_position` is not a potential opener,\
    remove it from the delimiter stack (since we know it can’t\
    be a closer either).\
\
  - Advance `current_position` to the next element in the stack.\
\
After we’re done, we remove all delimiters above `stack_bottom` from the\
delimiter stack.
