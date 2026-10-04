---
url: https://html.spec.whatwg.org/multipage/parsing.html
retrieved: 2026-10-03
command: firecrawl scrape https://html.spec.whatwg.org/multipage/parsing.html --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: HTML Standard
---
1. [13.2 Parsing HTML documents](https://html.spec.whatwg.org/multipage/parsing.html#parsing)
   01. [13.2.1 Overview of the parsing model](https://html.spec.whatwg.org/multipage/parsing.html#overview-of-the-parsing-model)
   02. [13.2.2 Parse errors](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors)
   03. [13.2.3 The input byte stream](https://html.spec.whatwg.org/multipage/parsing.html#the-input-byte-stream)
       1. [13.2.3.1 Parsing with a known character encoding](https://html.spec.whatwg.org/multipage/parsing.html#parsing-with-a-known-character-encoding)
       2. [13.2.3.2 Determining the character encoding](https://html.spec.whatwg.org/multipage/parsing.html#determining-the-character-encoding)
       3. [13.2.3.3 Character encodings](https://html.spec.whatwg.org/multipage/parsing.html#character-encodings)
       4. [13.2.3.4 Changing the encoding while parsing](https://html.spec.whatwg.org/multipage/parsing.html#changing-the-encoding-while-parsing)
       5. [13.2.3.5 Preprocessing the input stream](https://html.spec.whatwg.org/multipage/parsing.html#preprocessing-the-input-stream)
   04. [13.2.4 Parse state](https://html.spec.whatwg.org/multipage/parsing.html#parse-state)
       1. [13.2.4.1 The insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#the-insertion-mode)
       2. [13.2.4.2 The stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#the-stack-of-open-elements)
       3. [13.2.4.3 The list of active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#the-list-of-active-formatting-elements)
       4. [13.2.4.4 The element pointers](https://html.spec.whatwg.org/multipage/parsing.html#the-element-pointers)
       5. [13.2.4.5 Other parsing state flags](https://html.spec.whatwg.org/multipage/parsing.html#other-parsing-state-flags)
   05. [13.2.5 Tokenization](https://html.spec.whatwg.org/multipage/parsing.html#tokenization)
       01. [13.2.5.1 Data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state)
       02. [13.2.5.2 RCDATA state](https://html.spec.whatwg.org/multipage/parsing.html#rcdata-state)
       03. [13.2.5.3 RAWTEXT state](https://html.spec.whatwg.org/multipage/parsing.html#rawtext-state)
       04. [13.2.5.4 Script data state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-state)
       05. [13.2.5.5 PLAINTEXT state](https://html.spec.whatwg.org/multipage/parsing.html#plaintext-state)
       06. [13.2.5.6 Tag open state](https://html.spec.whatwg.org/multipage/parsing.html#tag-open-state)
       07. [13.2.5.7 End tag open state](https://html.spec.whatwg.org/multipage/parsing.html#end-tag-open-state)
       08. [13.2.5.8 Tag name state](https://html.spec.whatwg.org/multipage/parsing.html#tag-name-state)
       09. [13.2.5.9 RCDATA less-than sign state](https://html.spec.whatwg.org/multipage/parsing.html#rcdata-less-than-sign-state)
       10. [13.2.5.10 RCDATA end tag open state](https://html.spec.whatwg.org/multipage/parsing.html#rcdata-end-tag-open-state)
       11. [13.2.5.11 RCDATA end tag name state](https://html.spec.whatwg.org/multipage/parsing.html#rcdata-end-tag-name-state)
       12. [13.2.5.12 RAWTEXT less-than sign state](https://html.spec.whatwg.org/multipage/parsing.html#rawtext-less-than-sign-state)
       13. [13.2.5.13 RAWTEXT end tag open state](https://html.spec.whatwg.org/multipage/parsing.html#rawtext-end-tag-open-state)
       14. [13.2.5.14 RAWTEXT end tag name state](https://html.spec.whatwg.org/multipage/parsing.html#rawtext-end-tag-name-state)
       15. [13.2.5.15 Script data less-than sign state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-less-than-sign-state)
       16. [13.2.5.16 Script data end tag open state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-end-tag-open-state)
       17. [13.2.5.17 Script data end tag name state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-end-tag-name-state)
       18. [13.2.5.18 Script data escape start state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-escape-start-state)
       19. [13.2.5.19 Script data escape start dash state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-escape-start-dash-state)
       20. [13.2.5.20 Script data escaped state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-escaped-state)
       21. [13.2.5.21 Script data escaped dash state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-escaped-dash-state)
       22. [13.2.5.22 Script data escaped dash dash state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-escaped-dash-dash-state)
       23. [13.2.5.23 Script data escaped less-than sign state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-escaped-less-than-sign-state)
       24. [13.2.5.24 Script data escaped end tag open state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-escaped-end-tag-open-state)
       25. [13.2.5.25 Script data escaped end tag name state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-escaped-end-tag-name-state)
       26. [13.2.5.26 Script data double escape start state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-double-escape-start-state)
       27. [13.2.5.27 Script data double escaped state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-double-escaped-state)
       28. [13.2.5.28 Script data double escaped dash state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-double-escaped-dash-state)
       29. [13.2.5.29 Script data double escaped dash dash state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-double-escaped-dash-dash-state)
       30. [13.2.5.30 Script data double escaped less-than sign state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-double-escaped-less-than-sign-state)
       31. [13.2.5.31 Script data double escape end state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-double-escape-end-state)
       32. [13.2.5.32 Before attribute name state](https://html.spec.whatwg.org/multipage/parsing.html#before-attribute-name-state)
       33. [13.2.5.33 Attribute name state](https://html.spec.whatwg.org/multipage/parsing.html#attribute-name-state)
       34. [13.2.5.34 After attribute name state](https://html.spec.whatwg.org/multipage/parsing.html#after-attribute-name-state)
       35. [13.2.5.35 Before attribute value state](https://html.spec.whatwg.org/multipage/parsing.html#before-attribute-value-state)
       36. [13.2.5.36 Attribute value (double-quoted) state](https://html.spec.whatwg.org/multipage/parsing.html#attribute-value-(double-quoted)-state)
       37. [13.2.5.37 Attribute value (single-quoted) state](https://html.spec.whatwg.org/multipage/parsing.html#attribute-value-(single-quoted)-state)
       38. [13.2.5.38 Attribute value (unquoted) state](https://html.spec.whatwg.org/multipage/parsing.html#attribute-value-(unquoted)-state)
       39. [13.2.5.39 After attribute value (quoted) state](https://html.spec.whatwg.org/multipage/parsing.html#after-attribute-value-(quoted)-state)
       40. [13.2.5.40 Self-closing start tag state](https://html.spec.whatwg.org/multipage/parsing.html#self-closing-start-tag-state)
       41. [13.2.5.41 Bogus comment state](https://html.spec.whatwg.org/multipage/parsing.html#bogus-comment-state)
       42. [13.2.5.42 Markup declaration open state](https://html.spec.whatwg.org/multipage/parsing.html#markup-declaration-open-state)
       43. [13.2.5.43 Comment start state](https://html.spec.whatwg.org/multipage/parsing.html#comment-start-state)
       44. [13.2.5.44 Comment start dash state](https://html.spec.whatwg.org/multipage/parsing.html#comment-start-dash-state)
       45. [13.2.5.45 Comment state](https://html.spec.whatwg.org/multipage/parsing.html#comment-state)
       46. [13.2.5.46 Comment less-than sign state](https://html.spec.whatwg.org/multipage/parsing.html#comment-less-than-sign-state)
       47. [13.2.5.47 Comment less-than sign bang state](https://html.spec.whatwg.org/multipage/parsing.html#comment-less-than-sign-bang-state)
       48. [13.2.5.48 Comment less-than sign bang dash state](https://html.spec.whatwg.org/multipage/parsing.html#comment-less-than-sign-bang-dash-state)
       49. [13.2.5.49 Comment less-than sign bang dash dash state](https://html.spec.whatwg.org/multipage/parsing.html#comment-less-than-sign-bang-dash-dash-state)
       50. [13.2.5.50 Comment end dash state](https://html.spec.whatwg.org/multipage/parsing.html#comment-end-dash-state)
       51. [13.2.5.51 Comment end state](https://html.spec.whatwg.org/multipage/parsing.html#comment-end-state)
       52. [13.2.5.52 Comment end bang state](https://html.spec.whatwg.org/multipage/parsing.html#comment-end-bang-state)
       53. [13.2.5.53 DOCTYPE state](https://html.spec.whatwg.org/multipage/parsing.html#doctype-state)
       54. [13.2.5.54 Before DOCTYPE name state](https://html.spec.whatwg.org/multipage/parsing.html#before-doctype-name-state)
       55. [13.2.5.55 DOCTYPE name state](https://html.spec.whatwg.org/multipage/parsing.html#doctype-name-state)
       56. [13.2.5.56 After DOCTYPE name state](https://html.spec.whatwg.org/multipage/parsing.html#after-doctype-name-state)
       57. [13.2.5.57 After DOCTYPE public keyword state](https://html.spec.whatwg.org/multipage/parsing.html#after-doctype-public-keyword-state)
       58. [13.2.5.58 Before DOCTYPE public identifier state](https://html.spec.whatwg.org/multipage/parsing.html#before-doctype-public-identifier-state)
       59. [13.2.5.59 DOCTYPE public identifier (double-quoted) state](https://html.spec.whatwg.org/multipage/parsing.html#doctype-public-identifier-(double-quoted)-state)
       60. [13.2.5.60 DOCTYPE public identifier (single-quoted) state](https://html.spec.whatwg.org/multipage/parsing.html#doctype-public-identifier-(single-quoted)-state)
       61. [13.2.5.61 After DOCTYPE public identifier state](https://html.spec.whatwg.org/multipage/parsing.html#after-doctype-public-identifier-state)
       62. [13.2.5.62 Between DOCTYPE public and system identifiers state](https://html.spec.whatwg.org/multipage/parsing.html#between-doctype-public-and-system-identifiers-state)
       63. [13.2.5.63 After DOCTYPE system keyword state](https://html.spec.whatwg.org/multipage/parsing.html#after-doctype-system-keyword-state)
       64. [13.2.5.64 Before DOCTYPE system identifier state](https://html.spec.whatwg.org/multipage/parsing.html#before-doctype-system-identifier-state)
       65. [13.2.5.65 DOCTYPE system identifier (double-quoted) state](https://html.spec.whatwg.org/multipage/parsing.html#doctype-system-identifier-(double-quoted)-state)
       66. [13.2.5.66 DOCTYPE system identifier (single-quoted) state](https://html.spec.whatwg.org/multipage/parsing.html#doctype-system-identifier-(single-quoted)-state)
       67. [13.2.5.67 After DOCTYPE system identifier state](https://html.spec.whatwg.org/multipage/parsing.html#after-doctype-system-identifier-state)
       68. [13.2.5.68 Bogus DOCTYPE state](https://html.spec.whatwg.org/multipage/parsing.html#bogus-doctype-state)
       69. [13.2.5.69 CDATA section state](https://html.spec.whatwg.org/multipage/parsing.html#cdata-section-state)
       70. [13.2.5.70 CDATA section bracket state](https://html.spec.whatwg.org/multipage/parsing.html#cdata-section-bracket-state)
       71. [13.2.5.71 CDATA section end state](https://html.spec.whatwg.org/multipage/parsing.html#cdata-section-end-state)
       72. [13.2.5.72 Processing instruction open state](https://html.spec.whatwg.org/multipage/parsing.html#processing-instruction-open-state)
       73. [13.2.5.73 Processing instruction target state](https://html.spec.whatwg.org/multipage/parsing.html#processing-instruction-target-state)
       74. [13.2.5.74 After processing instruction target state](https://html.spec.whatwg.org/multipage/parsing.html#after-processing-instruction-target-state)
       75. [13.2.5.75 Processing instruction data state](https://html.spec.whatwg.org/multipage/parsing.html#processing-instruction-data-state)
       76. [13.2.5.76 Processing instruction questionable state](https://html.spec.whatwg.org/multipage/parsing.html#processing-instruction-questionable-state)
       77. [13.2.5.77 Character reference state](https://html.spec.whatwg.org/multipage/parsing.html#character-reference-state)
       78. [13.2.5.78 Named character reference state](https://html.spec.whatwg.org/multipage/parsing.html#named-character-reference-state)
       79. [13.2.5.79 Ambiguous ampersand state](https://html.spec.whatwg.org/multipage/parsing.html#ambiguous-ampersand-state)
       80. [13.2.5.80 Numeric character reference state](https://html.spec.whatwg.org/multipage/parsing.html#numeric-character-reference-state)
       81. [13.2.5.81 Hexadecimal character reference start state](https://html.spec.whatwg.org/multipage/parsing.html#hexadecimal-character-reference-start-state)
       82. [13.2.5.82 Hexadecimal character reference state](https://html.spec.whatwg.org/multipage/parsing.html#hexadecimal-character-reference-state)
       83. [13.2.5.83 Decimal character reference state](https://html.spec.whatwg.org/multipage/parsing.html#decimal-character-reference-state)
       84. [13.2.5.84 Numeric character reference end state](https://html.spec.whatwg.org/multipage/parsing.html#numeric-character-reference-end-state)
   06. [13.2.6 Tree construction](https://html.spec.whatwg.org/multipage/parsing.html#tree-construction)
       1. [13.2.6.1 Creating and inserting nodes](https://html.spec.whatwg.org/multipage/parsing.html#creating-and-inserting-nodes)
       2. [13.2.6.2 Parsing elements that contain only text](https://html.spec.whatwg.org/multipage/parsing.html#parsing-elements-that-contain-only-text)
       3. [13.2.6.3 Closing elements that have implied end tags](https://html.spec.whatwg.org/multipage/parsing.html#closing-elements-that-have-implied-end-tags)
       4. [13.2.6.4 The rules for parsing tokens in HTML content](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inhtml)
          01. [13.2.6.4.1 The "initial" insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#the-initial-insertion-mode)
          02. [13.2.6.4.2 The "before html" insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#the-before-html-insertion-mode)
          03. [13.2.6.4.3 The "before head" insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#the-before-head-insertion-mode)
          04. [13.2.6.4.4 The "in head" insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inhead)
          05. [13.2.6.4.5 The "in head noscript" insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inheadnoscript)
          06. [13.2.6.4.6 The "after head" insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#the-after-head-insertion-mode)
          07. [13.2.6.4.7 The "in body" insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inbody)
          08. [13.2.6.4.8 The "text" insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-incdata)
          09. [13.2.6.4.9 The "in table" insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intable)
          10. [13.2.6.4.10 The "in table text" insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intabletext)
          11. [13.2.6.4.11 The "in caption" insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-incaption)
          12. [13.2.6.4.12 The "in column group" insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-incolgroup)
          13. [13.2.6.4.13 The "in table body" insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intbody)
          14. [13.2.6.4.14 The "in row" insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intr)
          15. [13.2.6.4.15 The "in cell" insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intd)
          16. [13.2.6.4.16 The "in template" insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intemplate)
          17. [13.2.6.4.17 The "after body" insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-afterbody)
          18. [13.2.6.4.18 The "in frameset" insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inframeset)
          19. [13.2.6.4.19 The "after frameset" insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-afterframeset)
          20. [13.2.6.4.20 The "after after body" insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#the-after-after-body-insertion-mode)
          21. [13.2.6.4.21 The "after after frameset" insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#the-after-after-frameset-insertion-mode)
       5. [13.2.6.5 The rules for parsing tokens in foreign content](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inforeign)
   07. [13.2.7 The end](https://html.spec.whatwg.org/multipage/parsing.html#the-end)
   08. [13.2.8 Speculative HTML parsing](https://html.spec.whatwg.org/multipage/parsing.html#speculative-html-parsing)
   09. [13.2.9 Coercing an HTML DOM into an infoset](https://html.spec.whatwg.org/multipage/parsing.html#coercing-an-html-dom-into-an-infoset)
   10. [13.2.10 An introduction to error handling and strange cases in the parser](https://html.spec.whatwg.org/multipage/parsing.html#an-introduction-to-error-handling-and-strange-cases-in-the-parser)
       1. [13.2.10.1 Misnested tags: <b><i></b></i>](https://html.spec.whatwg.org/multipage/parsing.html#misnested-tags:-b-i-/b-/i)
       2. [13.2.10.2 Misnested tags: <b><p></b></p>](https://html.spec.whatwg.org/multipage/parsing.html#misnested-tags:-b-p-/b-/p)
       3. [13.2.10.3 Unexpected markup in tables](https://html.spec.whatwg.org/multipage/parsing.html#unexpected-markup-in-tables)
       4. [13.2.10.4 Scripts that modify the page as it is being parsed](https://html.spec.whatwg.org/multipage/parsing.html#scripts-that-modify-the-page-as-it-is-being-parsed)
       5. [13.2.10.5 The execution of scripts that are moving across multiple documents](https://html.spec.whatwg.org/multipage/parsing.html#the-execution-of-scripts-that-are-moving-across-multiple-documents)
       6. [13.2.10.6 Unclosed formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#unclosed-formatting-elements)
2. [13.3 Serializing HTML fragments](https://html.spec.whatwg.org/multipage/parsing.html#serialising-html-fragments)
3. [13.4 Parsing HTML fragments](https://html.spec.whatwg.org/multipage/parsing.html#parsing-html-fragments)

### 13.2 Parsing HTML documents

_This section only applies to user agents, data mining tools, and conformance_
_checkers._

The rules for parsing XML documents into DOM trees are covered by the next
section, entitled " [The XML syntax](https://html.spec.whatwg.org/multipage/xhtml.html#the-xhtml-syntax)".

User agents must use the parsing rules described in this section to generate the DOM trees from
`text/html` resources. Together, these rules define what is referred to as the
HTML parser.

While the HTML syntax described in this specification bears a close resemblance to SGML and
XML, it is a separate language with its own parsing rules.

Some earlier versions of HTML (in particular from HTML2 to HTML4) were based on SGML and used
SGML parsing rules. However, few (if any) web browsers ever implemented true SGML parsing for
HTML documents; the only user agents to strictly handle HTML as an SGML application have
historically been validators. The resulting confusion — with validators claiming documents
to have one representation while widely deployed web browsers interoperably implemented a
different representation — has wasted decades of productivity. This version of HTML thus
returns to a non-SGML basis.

For the purposes of conformance checkers, if a resource is determined to be in [the HTML\\
syntax](https://html.spec.whatwg.org/multipage/syntax.html#syntax), then it is an [HTML document](https://dom.spec.whatwg.org/#html-document).

As stated [in the terminology section](https://html.spec.whatwg.org/multipage/infrastructure.html#html-elements),
references to [element types](https://html.spec.whatwg.org/multipage/infrastructure.html#element-type) that do not explicitly specify a
namespace always refer to elements in the [HTML namespace](https://infra.spec.whatwg.org/#html-namespace). For example, if the spec
talks about "a `menu` element", then that is an element with the local name "`menu`", the namespace "`http://www.w3.org/1999/xhtml`", and
the interface `HTMLMenuElement`. Where possible, references to such elements are
hyperlinked to their definition.

#### 13.2.1 Overview of the parsing model

![](https://html.spec.whatwg.org/images/parsing-model-overview.svg)

The input to the HTML parsing process consists of a stream of [code\\
points](https://infra.spec.whatwg.org/#code-point), which is passed through a [tokenization](https://html.spec.whatwg.org/multipage/parsing.html#tokenization) stage followed by a [tree\\
construction](https://html.spec.whatwg.org/multipage/parsing.html#tree-construction) stage. The output is a `Document` object.

Implementations that [do not support scripting](https://html.spec.whatwg.org/multipage/infrastructure.html#non-scripted) do not
have to actually create a DOM `Document` object, but the DOM tree in such cases is
still used as the model for the rest of the specification.

In the common case, the data handled by the tokenization stage comes from the network, but
[it can also come from script](https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dynamic-markup-insertion) running in the user
agent, e.g. using the `document.write()` API.

There is only one set of states for the tokenizer stage and the tree
construction stage, but the tree construction stage is reentrant, meaning that while the tree
construction stage is handling one token, the tokenizer might be resumed, causing further tokens
to be emitted and processed before the first token's processing is complete.

In the following example, the tree construction stage will be called upon to handle a "p"
start tag token while handling the "script" end tag token:

```
...
<script>
 document.write('<p>');
</script>
...
```

To handle these cases, parsers have a script nesting level, which must be initially
set to zero, and a parser pause flag, which must be initially set to false.

#### 13.2.2Parse errors

This specification defines the parsing rules for HTML documents, whether they are syntactically
correct or not. Certain points in the parsing algorithm are said to be [parse errors](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). The error handling for parse errors is well-defined (that's the
processing rules described throughout this specification), but user agents, while parsing an HTML
document, may [abort the parser](https://html.spec.whatwg.org/multipage/parsing.html#abort-a-parser) at the first [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors) that they encounter for which they do not wish to apply the rules described in this
specification.

Conformance checkers must report at least one parse error condition to the user if one or more
parse error conditions exist in the document and must not report parse error conditions if none
exist in the document. Conformance checkers may report more than one parse error condition if more
than one parse error condition exists in the document.

Parse errors are only errors with the _syntax_ of HTML. In addition to
checking for parse errors, conformance checkers will also verify that the document obeys all the
other conformance requirements described in this specification.

Some parse errors have dedicated codes outlined in the table below that should be used by
conformance checkers in reports.

_Error descriptions in the table below are non-normative._

| Code | Description |
| --- | --- |
| abrupt-closing-of-empty-comment | This error occurs if the parser encounters an empty [comment](https://html.spec.whatwg.org/multipage/syntax.html#syntax-comments) that is abruptly closed by a U+003E (>) [code\<br>point](https://infra.spec.whatwg.org/#code-point) (i.e., `<!-->` or `<!--->`). The<br>parser behaves as if the comment is closed correctly. |
| abrupt-doctype-public-identifier | This error occurs if the parser encounters a U+003E (>) [code point](https://infra.spec.whatwg.org/#code-point) in the<br>[DOCTYPE](https://html.spec.whatwg.org/multipage/syntax.html#syntax-doctype) public identifier (e.g., `<!DOCTYPE html PUBLIC "foo>`). In such a case, if the DOCTYPE is correctly<br>placed as a document preamble, the parser sets the `Document` to [quirks\<br>mode](https://dom.spec.whatwg.org/#concept-document-quirks). |
| abrupt-doctype-system-identifier | This error occurs if the parser encounters a U+003E (>) [code point](https://infra.spec.whatwg.org/#code-point) in the<br>[DOCTYPE](https://html.spec.whatwg.org/multipage/syntax.html#syntax-doctype) system identifier (e.g., `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "foo>`). In such a case,<br>if the DOCTYPE is correctly placed as a document preamble, the parser sets the<br>`Document` to [quirks mode](https://dom.spec.whatwg.org/#concept-document-quirks). |
| absence-of-digits-in-numeric-character-reference | This error occurs if the parser encounters a numeric [character reference](https://html.spec.whatwg.org/multipage/syntax.html#syntax-charref) that doesn't contain any digits (e.g., `&#qux;`). In this case the parser doesn't resolve the character<br>reference. |
| cdata-in-html-content | This error occurs if the parser encounters a [CDATA\<br>section](https://html.spec.whatwg.org/multipage/syntax.html#syntax-cdata) outside of foreign content (SVG or MathML). The parser treats such CDATA<br>sections (including leading "`[CDATA[`" and trailing "`]]`") as comments. |
| character-reference-outside-unicode-range | This error occurs if the parser encounters a numeric [character reference](https://html.spec.whatwg.org/multipage/syntax.html#syntax-charref) that references a [code point](https://infra.spec.whatwg.org/#code-point)<br>that is greater than the valid Unicode range. The parser resolves such a character reference to<br>a U+FFFD REPLACEMENT CHARACTER. |
| control-character-in-input-stream | This error occurs if the [input stream](https://html.spec.whatwg.org/multipage/parsing.html#input-stream) contains a [control](https://infra.spec.whatwg.org/#control) [code point](https://infra.spec.whatwg.org/#code-point) that is not [ASCII\<br>whitespace](https://infra.spec.whatwg.org/#ascii-whitespace) or U+0000 NULL. Such code points are parsed as-is and usually, where parsing<br>rules don't apply any additional restrictions, make their way into the DOM. |
| control-character-reference | This error occurs if the parser encounters a numeric [character reference](https://html.spec.whatwg.org/multipage/syntax.html#syntax-charref) that references a [control](https://infra.spec.whatwg.org/#control) [code point](https://infra.spec.whatwg.org/#code-point) that is not [ASCII\<br>whitespace](https://infra.spec.whatwg.org/#ascii-whitespace) or is a U+000D CARRIAGE RETURN. The parser resolves such character references<br>as-is except C1 control references that are replaced according to the [numeric character\<br>reference end state](https://html.spec.whatwg.org/multipage/parsing.html#numeric-character-reference-end-state). |
| disallowed-processing-instruction-target | This error occurs if the parser encounters a [processing\<br>instruction target](https://html.spec.whatwg.org/multipage/syntax.html#syntax-pi-target) that is an [ASCII case-insensitive](https://infra.spec.whatwg.org/#ascii-case-insensitive) match for "`xml`" or "`xml-stylesheet`". The preceding U+003F (?) and<br>all content that follows up to a U+003E (>) (if present) or to the end of the [input\<br>stream](https://html.spec.whatwg.org/multipage/parsing.html#input-stream) is treated as a comment. |
| duplicate-attribute | This error occurs if the parser encounters an [attribute](https://html.spec.whatwg.org/multipage/syntax.html#syntax-attributes) in a tag that already has an attribute with the<br>same name. The parser ignores all such duplicate occurrences of the attribute. |
| end-tag-with-attributes | This error occurs if the parser encounters an [end\<br>tag](https://html.spec.whatwg.org/multipage/syntax.html#syntax-end-tag) with [attributes](https://html.spec.whatwg.org/multipage/syntax.html#syntax-attributes). Attributes in end tags are<br>ignored and do not make their way into the DOM. |
| end-tag-with-trailing-solidus | This error occurs if the parser encounters an [end\<br>tag](https://html.spec.whatwg.org/multipage/syntax.html#syntax-end-tag) that has a U+002F (/) [code point](https://infra.spec.whatwg.org/#code-point) right before the closing U+003E (>)<br>code point (e.g., `</div/>`). Such a tag is treated as a regular end<br>tag. |
| eof-before-tag-name | This error occurs if the parser encounters the end of the [input stream](https://html.spec.whatwg.org/multipage/parsing.html#input-stream)<br>where a tag name is expected. In this case the parser treats the beginning of a [start tag](https://html.spec.whatwg.org/multipage/syntax.html#syntax-start-tag) (i.e., `<`) or an [end tag](https://html.spec.whatwg.org/multipage/syntax.html#syntax-end-tag) (i.e., `</`) as text<br>content. |
| eof-in-cdata | This error occurs if the parser encounters the end of the [input stream](https://html.spec.whatwg.org/multipage/parsing.html#input-stream) in a<br>[CDATA section](https://html.spec.whatwg.org/multipage/syntax.html#syntax-cdata). The parser treats such CDATA sections as if<br>they are closed immediately before the end of the input stream. |
| eof-in-comment | This error occurs if the parser encounters the end of the [input stream](https://html.spec.whatwg.org/multipage/parsing.html#input-stream) in a<br>[comment](https://html.spec.whatwg.org/multipage/syntax.html#syntax-comments). The parser treats such comments as if they are<br>closed immediately before the end of the input stream. |
| eof-in-doctype | This error occurs if the parser encounters the end of the input stream in a [DOCTYPE](https://html.spec.whatwg.org/multipage/syntax.html#syntax-doctype). In such a case, if the DOCTYPE is correctly placed as a<br>document preamble, the parser sets the `Document` to [quirks mode](https://dom.spec.whatwg.org/#concept-document-quirks). |
| eof-in-processing-instruction | This error occurs if the parser encounters the end of the [input stream](https://html.spec.whatwg.org/multipage/parsing.html#input-stream) in a<br>[processing instruction](https://html.spec.whatwg.org/multipage/syntax.html#syntax-processing-instruction) (e.g., `<?` or `<?marker name=`). Such processing<br>instructions are ignored. |
| eof-in-script-html-comment-like-text | This error occurs if the parser encounters the end of the [input stream](https://html.spec.whatwg.org/multipage/parsing.html#input-stream) in text<br>that resembles an [HTML comment](https://html.spec.whatwg.org/multipage/syntax.html#syntax-comments) inside<br>`script` element content (e.g., `<script><!-- foo`).<br>Syntactic structures that resemble HTML comments in `script`<br>elements are parsed as text content. They can be a part of a scripting language-specific<br>syntactic structure or be treated as an HTML-like comment, if the scripting language supports<br>them (e.g., parsing rules for HTML-like comments can be found in Annex B of the JavaScript<br>specification). The common reason for this error is a violation of the [restrictions for contents of `script` elements](https://html.spec.whatwg.org/multipage/scripting.html#restrictions-for-contents-of-script-elements). [\[JAVASCRIPT\]](https://html.spec.whatwg.org/multipage/references.html#refsJAVASCRIPT) |
| eof-in-tag | This error occurs if the parser encounters the end of the [input stream](https://html.spec.whatwg.org/multipage/parsing.html#input-stream) in a<br>[start tag](https://html.spec.whatwg.org/multipage/syntax.html#syntax-start-tag) or an [end\<br>tag](https://html.spec.whatwg.org/multipage/syntax.html#syntax-end-tag) (e.g., `<div id=`). Such a tag is ignored. |
| incorrectly-closed-comment | This error occurs if the parser encounters a [comment](https://html.spec.whatwg.org/multipage/syntax.html#syntax-comments) that is closed by the "`--!>`"<br>[code point](https://infra.spec.whatwg.org/#code-point) sequence. The parser treats such comments as if they are correctly<br>closed by the "`-->`" code point sequence. |
| incorrectly-opened-comment | This error occurs if the parser encounters the "`<!`" [code\<br>point](https://infra.spec.whatwg.org/#code-point) sequence that is not immediately followed by two U+002D (-) code points and that<br>is not the start of a [DOCTYPE](https://html.spec.whatwg.org/multipage/syntax.html#syntax-doctype) or a [CDATA section](https://html.spec.whatwg.org/multipage/syntax.html#syntax-cdata). All content that follows the "`<!`" code point sequence up to a U+003E (>) code point (if present) or to<br>the end of the [input stream](https://html.spec.whatwg.org/multipage/parsing.html#input-stream) is treated as a comment.<br>One possible cause of this error is using an XML markup declaration (e.g.,<br>`<!ELEMENT br EMPTY>`) in HTML. |
| invalid-character-sequence-after-doctype-name | This error occurs if the parser encounters any [code point](https://infra.spec.whatwg.org/#code-point) sequence other<br>than "`PUBLIC`" and "`SYSTEM`" keywords after a [DOCTYPE](https://html.spec.whatwg.org/multipage/syntax.html#syntax-doctype) name. In such a case, the parser ignores any following<br>public or system identifiers, and if the DOCTYPE is correctly placed as a document preamble,<br>and if the [parser cannot change the mode flag](https://html.spec.whatwg.org/multipage/parsing.html#parser-cannot-change-the-mode-flag) is false, sets the `Document`<br>to [quirks mode](https://dom.spec.whatwg.org/#concept-document-quirks). |
| invalid-first-character-of-processing-instruction-target | This error occurs if the parser encounters a [code point](https://infra.spec.whatwg.org/#code-point) that is not an<br>[ASCII alpha](https://infra.spec.whatwg.org/#ascii-alpha) or U+005F (\_) where the first code point of a [processing instruction target](https://html.spec.whatwg.org/multipage/syntax.html#syntax-pi-target) is expected. The preceding<br>U+003F (?) and all content that follows up to a U+003E (>) (if present) or to the end of the<br>[input stream](https://html.spec.whatwg.org/multipage/parsing.html#input-stream) is treated as a comment. |
| invalid-first-character-of-tag-name | This error occurs if the parser encounters a [code point](https://infra.spec.whatwg.org/#code-point) that is not an<br>[ASCII alpha](https://infra.spec.whatwg.org/#ascii-alpha) where the first code point of a [start\<br>tag](https://html.spec.whatwg.org/multipage/syntax.html#syntax-start-tag) name or an [end tag](https://html.spec.whatwg.org/multipage/syntax.html#syntax-end-tag) name is expected. If a<br>start tag was expected such code point and a preceding U+003C (<) is treated as text<br>content, and all content that follows is treated as markup. Whereas, if an end tag was<br>expected, such code point and all content that follows up to a U+003E (>) code point (if<br>present) or to the end of the [input stream](https://html.spec.whatwg.org/multipage/parsing.html#input-stream) is treated as a comment.<br>For example, consider the following markup:<br>```<br><42></42><br>```<br>This will be parsed into:<br>- `html`<br>  - `head`<br>  - `body`<br>    - `#text`: <42><br>    - `#comment`: 42<br>While the first code point of a tag name is limited to an [ASCII\<br>alpha](https://infra.spec.whatwg.org/#ascii-alpha), a wide range of code points (including [ASCII digits](https://infra.spec.whatwg.org/#ascii-digit)) is allowed in<br>subsequent positions. |
| invalid-processing-instruction-target | This error occurs if the parser encounters a [code point](https://infra.spec.whatwg.org/#code-point) that is not an<br>[ASCII alphanumeric](https://infra.spec.whatwg.org/#ascii-alphanumeric), U+002D (-), or U+005F (\_) where a [processing instruction target](https://html.spec.whatwg.org/multipage/syntax.html#syntax-pi-target) is expected. The preceding<br>U+003F (?) and all content that follows up to a U+003E (>) (if present) or to the end of the<br>[input stream](https://html.spec.whatwg.org/multipage/parsing.html#input-stream) is treated as a comment. |
| missing-attribute-value | This error occurs if the parser encounters a U+003E (>) [code point](https://infra.spec.whatwg.org/#code-point) where an<br>[attribute](https://html.spec.whatwg.org/multipage/syntax.html#syntax-attributes) value is expected (e.g., `<div id=>`). The parser treats the attribute as having an empty value. |
| missing-doctype-name | This error occurs if the parser encounters a [DOCTYPE](https://html.spec.whatwg.org/multipage/syntax.html#syntax-doctype) that is missing a name (e.g., `<!DOCTYPE>`). In such a case, if the DOCTYPE is correctly placed as a<br>document preamble, the parser sets the `Document` to [quirks mode](https://dom.spec.whatwg.org/#concept-document-quirks). |
| missing-doctype-public-identifier | This error occurs if the parser encounters a U+003E (>) [code point](https://infra.spec.whatwg.org/#code-point) where<br>start of the [DOCTYPE](https://html.spec.whatwg.org/multipage/syntax.html#syntax-doctype) public identifier is expected (e.g.,<br>`<!DOCTYPE html PUBLIC >`). In such a case, if the DOCTYPE is correctly<br>placed as a document preamble, the parser sets the `Document` to [quirks\<br>mode](https://dom.spec.whatwg.org/#concept-document-quirks). |
| missing-doctype-system-identifier | This error occurs if the parser encounters a U+003E (>) [code point](https://infra.spec.whatwg.org/#code-point) where<br>start of the [DOCTYPE](https://html.spec.whatwg.org/multipage/syntax.html#syntax-doctype) system identifier is expected (e.g.,<br>`<!DOCTYPE html SYSTEM >`). In such a case, if the DOCTYPE is correctly<br>placed as a document preamble, the parser sets the `Document` to [quirks\<br>mode](https://dom.spec.whatwg.org/#concept-document-quirks). |
| missing-end-tag-name | This error occurs if the parser encounters a U+003E (>) [code point](https://infra.spec.whatwg.org/#code-point) where an<br>[end tag](https://html.spec.whatwg.org/multipage/syntax.html#syntax-end-tag) name is expected, i.e., `</>`. The parser ignores the whole "`</>`" code<br>point sequence. |
| missing-quote-before-doctype-public-identifier | This error occurs if the parser encounters the [DOCTYPE](https://html.spec.whatwg.org/multipage/syntax.html#syntax-doctype) public identifier that is not preceded by a quote (e.g.,<br>`<!DOCTYPE html PUBLIC -//W3C//DTD HTML 4.01//EN">`). In such a case,<br>the parser ignores the public identifier, and if the DOCTYPE is correctly placed as a document<br>preamble, sets the `Document` to [quirks mode](https://dom.spec.whatwg.org/#concept-document-quirks). |
| missing-quote-before-doctype-system-identifier | This error occurs if the parser encounters the [DOCTYPE](https://html.spec.whatwg.org/multipage/syntax.html#syntax-doctype) system identifier that is not preceded by a quote (e.g.,<br>`<!DOCTYPE html SYSTEM<br>     http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">`). In such a case, the parser<br>ignores the system identifier, and if the DOCTYPE is correctly placed as a document preamble,<br>sets the `Document` to [quirks mode](https://dom.spec.whatwg.org/#concept-document-quirks). |
| missing-semicolon-after-character-reference | This error occurs if the parser encounters a [character\<br>reference](https://html.spec.whatwg.org/multipage/syntax.html#syntax-charref) that is not terminated by a U+003B (;) [code point](https://infra.spec.whatwg.org/#code-point).<br>The parser behaves the same as if the character reference is terminated by the U+003B<br>(;) code point.<br>Most [named character references](https://html.spec.whatwg.org/multipage/named-characters.html#named-character-references) require a terminating U+003B<br>(;) [code point](https://infra.spec.whatwg.org/#code-point). Those that don't might get resolved as a longer named [character reference](https://html.spec.whatwg.org/multipage/syntax.html#syntax-charref) in certain ambiguous scenarios.<br>For example, `&notin` will be parsed as "`¬in`", i.e., the same as if the input were `&not;in`, whereas `&notin;` will be parsed as<br>"`∉`". |
| missing-whitespace-after-doctype-public-keyword | This error occurs if the parser encounters a [DOCTYPE](https://html.spec.whatwg.org/multipage/syntax.html#syntax-doctype) whose "`PUBLIC`" keyword and public<br>identifier are not separated by [ASCII whitespace](https://infra.spec.whatwg.org/#ascii-whitespace). In this case the parser behaves<br>as if ASCII whitespace is present. |
| missing-whitespace-after-doctype-system-keyword | This error occurs if the parser encounters a [DOCTYPE](https://html.spec.whatwg.org/multipage/syntax.html#syntax-doctype) whose "`SYSTEM`" keyword and system<br>identifier are not separated by [ASCII whitespace](https://infra.spec.whatwg.org/#ascii-whitespace). In this case the parser behaves<br>as if ASCII whitespace is present. |
| missing-whitespace-before-doctype-name | This error occurs if the parser encounters a [DOCTYPE](https://html.spec.whatwg.org/multipage/syntax.html#syntax-doctype) whose "`DOCTYPE`" keyword and name<br>are not separated by [ASCII whitespace](https://infra.spec.whatwg.org/#ascii-whitespace). In this case the parser behaves as if ASCII<br>whitespace is present. |
| missing-whitespace-between-attributes | This error occurs if the parser encounters [attributes](https://html.spec.whatwg.org/multipage/syntax.html#syntax-attributes) that are not separated by [ASCII\<br>whitespace](https://infra.spec.whatwg.org/#ascii-whitespace) (e.g., `<div id="foo"class="bar">`). In this case the<br>parser behaves as if ASCII whitespace is present. |
| missing-whitespace-between-doctype-public-and-system-identifiers | This error occurs if the parser encounters a [DOCTYPE](https://html.spec.whatwg.org/multipage/syntax.html#syntax-doctype) whose public and system identifiers are not separated by<br>[ASCII whitespace](https://infra.spec.whatwg.org/#ascii-whitespace). In this case the parser behaves as if ASCII whitespace is<br>present. |
| nested-comment | This error occurs if the parser encounters a nested [comment](https://html.spec.whatwg.org/multipage/syntax.html#syntax-comments) (e.g., `<!-- <!-- nested --><br>     -->`). Such a comment will be closed by the first occurring "`-->`"<br>[code point](https://infra.spec.whatwg.org/#code-point) sequence and everything that follows will be treated as markup. |
| noncharacter-character-reference | This error occurs if the parser encounters a numeric [character reference](https://html.spec.whatwg.org/multipage/syntax.html#syntax-charref) that references a [noncharacter](https://infra.spec.whatwg.org/#noncharacter).<br>The parser resolves such character references as-is. |
| noncharacter-in-input-stream | This error occurs if the [input stream](https://html.spec.whatwg.org/multipage/parsing.html#input-stream) contains a [noncharacter](https://infra.spec.whatwg.org/#noncharacter).<br>Such [code points](https://infra.spec.whatwg.org/#code-point) are parsed as-is and usually, where parsing<br>rules don't apply any additional restrictions, make their way into the DOM. |
| non-void-html-element-start-tag-with-trailing-solidus | This error occurs if the parser encounters a [start\<br>tag](https://html.spec.whatwg.org/multipage/syntax.html#syntax-start-tag) for an element that is not in the list of [void elements](https://html.spec.whatwg.org/multipage/syntax.html#void-elements) or is not a<br>part of foreign content (i.e., not an SVG or MathML element) that has a U+002F (/) [code\<br>point](https://infra.spec.whatwg.org/#code-point) right before the closing U+003E (>) code point. The parser behaves as if the<br>U+002F (/) is not present.<br>For example, consider the following markup:<br>```<br><div/><span></span><span></span><br>```<br>This will be parsed into:<br>- `html`<br>  - `head`<br>  - `body`<br>    - `div`<br>      - `span`<br>      - `span`<br>The trailing U+002F (/) in a start tag name can be used only in foreign<br>content to specify self-closing tags. (Self-closing tags don't exist in HTML.) It is also<br>allowed for void elements, but doesn't have any effect in this case. |
| null-character-reference | This error occurs if the parser encounters a numeric [character reference](https://html.spec.whatwg.org/multipage/syntax.html#syntax-charref) that references a U+0000 NULL [code\<br>point](https://infra.spec.whatwg.org/#code-point). The parser resolves such character references to a U+FFFD REPLACEMENT<br>CHARACTER. |
| surrogate-character-reference | This error occurs if the parser encounters a numeric [character reference](https://html.spec.whatwg.org/multipage/syntax.html#syntax-charref) that references a [surrogate](https://infra.spec.whatwg.org/#surrogate).<br>The parser resolves such character references to a U+FFFD REPLACEMENT CHARACTER. |
| surrogate-in-input-stream | This error occurs if the [input stream](https://html.spec.whatwg.org/multipage/parsing.html#input-stream) contains a [surrogate](https://infra.spec.whatwg.org/#surrogate). Such [code points](https://infra.spec.whatwg.org/#code-point) are<br>parsed as-is and usually, where parsing rules don't apply any additional restrictions, make<br>their way into the DOM.<br>Surrogates can only find their way into the input stream via script APIs such<br>as `document.write()`. |
| unexpected-character-after-doctype-system-identifier | This error occurs if the parser encounters any [code\<br>points](https://infra.spec.whatwg.org/#code-point) other than [ASCII whitespace](https://infra.spec.whatwg.org/#ascii-whitespace) or closing U+003E (>) after the [DOCTYPE](https://html.spec.whatwg.org/multipage/syntax.html#syntax-doctype) system identifier. The parser ignores these code<br>points. |
| unexpected-character-in-attribute-name | This error occurs if the parser encounters a U+0022 ("), U+0027 ('), or U+003C (<)<br>[code point](https://infra.spec.whatwg.org/#code-point) in an [attribute name](https://html.spec.whatwg.org/multipage/syntax.html#syntax-attribute-name). The<br>parser includes such code points in the attribute name.<br>Code points that trigger this error are usually a part of another syntactic<br>construct and can be a sign of a typo around the attribute name.<br>For example, consider the following markup:<br>```<br><div foo<div><br>```<br>Due to a forgotten U+003E (>) code point after `foo` the parser<br>treats this markup as a single `div` element with a "`foo<div`" attribute.<br>As another example of this error, consider the following markup:<br>```<br><div id'bar'><br>```<br>Due to a forgotten U+003D (=) code point between an attribute name and value the parser<br>treats this markup as a `div` element with the attribute "`id'bar'`" that has an empty value. |
| unexpected-character-in-unquoted-attribute-value | This error occurs if the parser encounters a U+0022 ("), U+0027 ('), U+003C (<), U+003D<br>(=), or U+0060 (\`) [code point](https://infra.spec.whatwg.org/#code-point) in an unquoted [attribute value](https://html.spec.whatwg.org/multipage/syntax.html#syntax-attribute-value). The parser includes such code points<br>in the attribute value.<br>Code points that trigger this error are usually a part of another syntactic<br>construct and can be a sign of a typo around the attribute value.<br>U+0060 (\`) is in the list of code points that trigger this error because<br>certain legacy user agents treat it as a quote.<br>For example, consider the following markup:<br>```<br><div foo=b'ar'><br>```<br>Due to a misplaced U+0027 (') code point the parser sets the value of the "`foo`" attribute to "`b'ar'`". |
| unexpected-equals-sign-before-attribute-name | This error occurs if the parser encounters a U+003D (=) [code point](https://infra.spec.whatwg.org/#code-point) before an<br>attribute name. In this case the parser treats U+003D (=) as the first code point of the<br>attribute name.<br>The common reason for this error is a forgotten attribute name.<br>For example, consider the following markup:<br>```<br><div foo="bar" ="baz"><br>```<br>Due to a forgotten attribute name the parser treats this markup as a `div`<br>element with two attributes: a "`foo`" attribute with a "`bar`" value and a "`="baz"`" attribute with an empty<br>value. |
| unexpected-null-character | This error occurs if the parser encounters a U+0000 NULL [code point](https://infra.spec.whatwg.org/#code-point) in the<br>[input stream](https://html.spec.whatwg.org/multipage/parsing.html#input-stream) in certain positions. In general, such code points are either<br>ignored or, for security reasons, replaced with a U+FFFD REPLACEMENT CHARACTER. |
| unexpected-solidus-in-tag | This error occurs if the parser encounters a U+002F (/) [code point](https://infra.spec.whatwg.org/#code-point) that is<br>not a part of a quoted [attribute](https://html.spec.whatwg.org/multipage/syntax.html#syntax-attributes) value and not<br>immediately followed by a U+003E (>) code point in a tag (e.g., `<div /<br>     id="foo">`). In this case the parser behaves as if it encountered [ASCII\<br>whitespace](https://infra.spec.whatwg.org/#ascii-whitespace). |
| unknown-named-character-reference | This error occurs if the parser encounters an [ambiguous ampersand](https://html.spec.whatwg.org/multipage/syntax.html#syntax-ambiguous-ampersand). In this case the parser doesn't<br>resolve the [character reference](https://html.spec.whatwg.org/multipage/syntax.html#syntax-charref). |

#### 13.2.3 The input byte stream

The stream of code points that comprises the input to the tokenization stage will be initially
seen by the user agent as a stream of bytes (typically coming over the network or from the local
file system). The bytes encode the actual characters according to a particular _character_
_encoding_, which the user agent uses to decode the bytes into characters.

For XML documents, the algorithm user agents are required to use to determine the
character encoding is given by XML. This section does not apply to XML documents.
[\[XML\]](https://html.spec.whatwg.org/multipage/references.html#refsXML)

Usually, the [encoding sniffing algorithm](https://html.spec.whatwg.org/multipage/parsing.html#encoding-sniffing-algorithm) defined below is used to determine the
character encoding.

Given a character encoding, the bytes in the [input byte stream](https://html.spec.whatwg.org/multipage/parsing.html#the-input-byte-stream) must be converted
to characters for the tokenizer's [input stream](https://html.spec.whatwg.org/multipage/parsing.html#input-stream), by passing the [input byte\\
stream](https://html.spec.whatwg.org/multipage/parsing.html#the-input-byte-stream) and character encoding to [decode](https://encoding.spec.whatwg.org/#decode).

A leading Byte Order Mark (BOM) causes the character encoding argument to be
ignored and will itself be skipped.

Bytes or sequences of bytes in the original byte stream that did not conform to
the Encoding standard (e.g. invalid UTF-8 byte sequences in a UTF-8 input byte stream) are errors
that conformance checkers are expected to report. [\[ENCODING\]](https://html.spec.whatwg.org/multipage/references.html#refsENCODING)

The decoder algorithms describe how to handle invalid input; for security
reasons, it is imperative that those rules be followed precisely. Differences in how invalid byte
sequences are handled can result in, amongst other problems, script injection vulnerabilities
("XSS").

When the HTML parser is decoding an input byte stream, it uses a character encoding and a confidence. The confidence is either _tentative_,
_certain_, or _irrelevant_. The encoding used, and whether the confidence in that
encoding is _tentative_ or _certain_, is [used\\
during the parsing](https://html.spec.whatwg.org/multipage/parsing.html#meta-charset-during-parse) to determine whether to [change the encoding](https://html.spec.whatwg.org/multipage/parsing.html#change-the-encoding). If no encoding is
necessary, e.g. because the parser is operating on a Unicode stream and doesn't have to use a
character encoding at all, then the [confidence](https://html.spec.whatwg.org/multipage/parsing.html#concept-encoding-confidence) is
_irrelevant_.

Some algorithms feed the parser by directly adding characters to the [input\\
stream](https://html.spec.whatwg.org/multipage/parsing.html#input-stream) rather than adding bytes to the [input byte stream](https://html.spec.whatwg.org/multipage/parsing.html#the-input-byte-stream).

##### 13.2.3.1 Parsing with a known character encoding

When the HTML parser is to operate on an input byte stream that has a known
definite encoding, then the character encoding is that encoding and the [confidence](https://html.spec.whatwg.org/multipage/parsing.html#concept-encoding-confidence) is _certain_.

##### 13.2.3.2 Determining the character encoding

In some cases, it might be impractical to unambiguously determine the encoding before parsing
the document. Because of this, this specification provides for a two-pass mechanism with an
optional pre-scan. Implementations are allowed, as described below, to apply a simplified parsing
algorithm to whatever bytes they have available before beginning to parse the document. Then, the
real parser is started, using a tentative encoding derived from this pre-parse and other
out-of-band metadata. If, while the document is being loaded, the user agent discovers a character
encoding declaration that conflicts with this information, then the parser can get reinvoked to
perform a parse of the document with the real encoding.

User agents must use the following algorithm, called the encoding
sniffing algorithm, to determine the character encoding to use when decoding a document in
the first pass. This algorithm takes as input any out-of-band metadata available to the user agent
(e.g. the [Content-Type metadata](https://html.spec.whatwg.org/multipage/urls-and-fetching.html#content-type) of the document) and all the
bytes available so far, and returns a character encoding and a [confidence](https://html.spec.whatwg.org/multipage/parsing.html#concept-encoding-confidence) that is either _tentative_ or
_certain_.

1. If the result of [BOM sniffing](https://encoding.spec.whatwg.org/#bom-sniff) is an encoding, return that
    encoding with [confidence](https://html.spec.whatwg.org/multipage/parsing.html#concept-encoding-confidence) _certain_.

Although the [decode](https://encoding.spec.whatwg.org/#decode) algorithm will itself change the encoding to
    use based on the presence of a byte order mark, this algorithm sniffs the BOM as well in order
    to set the correct [document's character encoding](https://dom.spec.whatwg.org/#concept-document-encoding) and [confidence](https://html.spec.whatwg.org/multipage/parsing.html#concept-encoding-confidence).

2. If the user has explicitly instructed the user agent to override the document's character
    encoding with a specific encoding, optionally return that encoding with the [confidence](https://html.spec.whatwg.org/multipage/parsing.html#concept-encoding-confidence) _certain_.

Typically, user agents remember such user requests across sessions, and in some
    cases apply them to documents in `iframe`s as well.

3. The user agent may wait for more bytes of the resource to be available, either in this step
    or at any later step in this algorithm. For instance, a user agent might wait 500ms or 1024
    bytes, whichever came first. In general preparsing the source to find the encoding improves
    performance, as it reduces the need to throw away the data structures used when parsing upon
    finding the encoding information. However, if the user agent delays too long to obtain data to
    determine the encoding, then the cost of the delay could outweigh any performance improvements
    from the preparse.

The authoring conformance requirements for character encoding declarations limit
    them to only appearing [in the first 1024 bytes](https://html.spec.whatwg.org/multipage/semantics.html#charset1024). User agents are
    therefore encouraged to use the prescan algorithm below (as invoked by these steps) on the first
    1024 bytes, but not to stall beyond that.

4. If the transport layer specifies a character encoding, and it is supported, return that
    encoding with the [confidence](https://html.spec.whatwg.org/multipage/parsing.html#concept-encoding-confidence) _certain_.

5. Optionally, [prescan the byte\\
    stream to determine its encoding](https://html.spec.whatwg.org/multipage/parsing.html#prescan-a-byte-stream-to-determine-its-encoding), with the _[end\_\
_condition](https://html.spec.whatwg.org/multipage/parsing.html#prescan-end-condition)_ being when the user agent decides that scanning further bytes would not be
    efficient. User agents are encouraged to only prescan the first 1024 bytes. User agents may
    decide that scanning _any_ bytes is not efficient, in which case these substeps are
    entirely skipped.

The aforementioned algorithm returns either a character encoding or failure. If it returns a
    character encoding, then return the same encoding, with [confidence](https://html.spec.whatwg.org/multipage/parsing.html#concept-encoding-confidence) _tentative_.

6. If the [HTML parser](https://html.spec.whatwg.org/multipage/parsing.html#html-parser) for which this algorithm is being run is associated with a
    `Document`d whose [container\\
    document](https://html.spec.whatwg.org/multipage/document-sequences.html#doc-container-document) is non-null:
1. Let parentDocument be d's [container document](https://html.spec.whatwg.org/multipage/document-sequences.html#doc-container-document).

2. If parentDocument's [origin](https://dom.spec.whatwg.org/#concept-document-origin) is
       [same origin](https://html.spec.whatwg.org/multipage/browsers.html#same-origin) with d's [origin](https://dom.spec.whatwg.org/#concept-document-origin) and parentDocument's [character encoding](https://dom.spec.whatwg.org/#concept-document-encoding) is not
       [UTF-16BE/LE](https://encoding.spec.whatwg.org/#utf-16be-le), then return parentDocument's [character encoding](https://dom.spec.whatwg.org/#concept-document-encoding), with the [confidence](https://html.spec.whatwg.org/multipage/parsing.html#concept-encoding-confidence) _tentative_.
7. Otherwise, if the user agent has information on the likely encoding for this page, e.g.
    based on the encoding of the page when it was last visited, then return that encoding, with the
    [confidence](https://html.spec.whatwg.org/multipage/parsing.html#concept-encoding-confidence) _tentative_.

8. The user agent may attempt to autodetect the character encoding from applying frequency
    analysis or other algorithms to the data stream. Such algorithms may use information about the
    resource other than the resource's contents, including the address of the resource. If
    autodetection succeeds in determining a character encoding, and that encoding is a supported
    encoding, then return that encoding, with the [confidence](https://html.spec.whatwg.org/multipage/parsing.html#concept-encoding-confidence) _tentative_.
    [\[UNIVCHARDET\]](https://html.spec.whatwg.org/multipage/references.html#refsUNIVCHARDET)

User agents are generally discouraged from attempting to autodetect encodings
    for resources obtained over the network, since doing so involves inherently non-interoperable
    heuristics. Attempting to detect encodings based on an HTML document's preamble is especially
    tricky since HTML markup typically uses only ASCII characters, and HTML documents tend to begin
    with a lot of markup rather than with text content.

The UTF-8 encoding has a highly detectable bit pattern. Files from the local
    file system that contain bytes with values greater than 0x7F which match the UTF-8 pattern are
    very likely to be UTF-8, while documents with byte sequences that do not match it are very
    likely not. When a user agent can examine the whole file, rather than just the preamble,
    detecting for UTF-8 specifically can be especially effective. [\[PPUTF8\]](https://html.spec.whatwg.org/multipage/references.html#refsPPUTF8) [\[UTF8DET\]](https://html.spec.whatwg.org/multipage/references.html#refsUTF8DET)

9. Otherwise, return an [implementation-defined](https://infra.spec.whatwg.org/#implementation-defined) or user-specified default character
    encoding, with the [confidence](https://html.spec.whatwg.org/multipage/parsing.html#concept-encoding-confidence) _tentative_.

In controlled environments or in environments where the encoding of documents can be
    prescribed (for example, for user agents intended for dedicated use in new networks), the
    comprehensive `UTF-8` encoding is suggested.

In other environments, the default encoding is typically dependent on the user's locale (an
    approximation of the languages, and thus often encodings, of the pages that the user is likely
    to frequent). The following table gives suggested defaults based on the user's locale, for
    compatibility with legacy content. Locales are identified by BCP 47 language tags.
    [\[BCP47\]](https://html.spec.whatwg.org/multipage/references.html#refsBCP47) [\[ENCODING\]](https://html.spec.whatwg.org/multipage/references.html#refsENCODING)



| Locale language | Suggested default encoding |
| --- | --- |
| ar | Arabic | [windows-1256](https://encoding.spec.whatwg.org/#windows-1256) |
| az | Azeri | [windows-1254](https://encoding.spec.whatwg.org/#windows-1254) |
| ba | Bashkir | [windows-1251](https://encoding.spec.whatwg.org/#windows-1251) |
| be | Belarusian | [windows-1251](https://encoding.spec.whatwg.org/#windows-1251) |
| bg | Bulgarian | [windows-1251](https://encoding.spec.whatwg.org/#windows-1251) |
| cs | Czech | [windows-1250](https://encoding.spec.whatwg.org/#windows-1250) |
| el | Greek | [ISO-8859-7](https://encoding.spec.whatwg.org/#iso-8859-7) |
| et | Estonian | [windows-1257](https://encoding.spec.whatwg.org/#windows-1257) |
| fa | Persian | [windows-1256](https://encoding.spec.whatwg.org/#windows-1256) |
| he | Hebrew | [windows-1255](https://encoding.spec.whatwg.org/#windows-1255) |
| hr | Croatian | [windows-1250](https://encoding.spec.whatwg.org/#windows-1250) |
| hu | Hungarian | [ISO-8859-2](https://encoding.spec.whatwg.org/#iso-8859-2) |
| ja | Japanese | [Shift\_JIS](https://encoding.spec.whatwg.org/#shift_jis) |
| kk | Kazakh | [windows-1251](https://encoding.spec.whatwg.org/#windows-1251) |
| ko | Korean | [EUC-KR](https://encoding.spec.whatwg.org/#euc-kr) |
| ku | Kurdish | [windows-1254](https://encoding.spec.whatwg.org/#windows-1254) |
| ky | Kyrgyz | [windows-1251](https://encoding.spec.whatwg.org/#windows-1251) |
| lt | Lithuanian | [windows-1257](https://encoding.spec.whatwg.org/#windows-1257) |
| lv | Latvian | [windows-1257](https://encoding.spec.whatwg.org/#windows-1257) |
| mk | Macedonian | [windows-1251](https://encoding.spec.whatwg.org/#windows-1251) |
| pl | Polish | [ISO-8859-2](https://encoding.spec.whatwg.org/#iso-8859-2) |
| ru | Russian | [windows-1251](https://encoding.spec.whatwg.org/#windows-1251) |
| sah | Yakut | [windows-1251](https://encoding.spec.whatwg.org/#windows-1251) |
| sk | Slovak | [windows-1250](https://encoding.spec.whatwg.org/#windows-1250) |
| sl | Slovenian | [ISO-8859-2](https://encoding.spec.whatwg.org/#iso-8859-2) |
| sr | Serbian | [windows-1251](https://encoding.spec.whatwg.org/#windows-1251) |
| tg | Tajik | [windows-1251](https://encoding.spec.whatwg.org/#windows-1251) |
| th | Thai | [windows-874](https://encoding.spec.whatwg.org/#windows-874) |
| tr | Turkish | [windows-1254](https://encoding.spec.whatwg.org/#windows-1254) |
| tt | Tatar | [windows-1251](https://encoding.spec.whatwg.org/#windows-1251) |
| uk | Ukrainian | [windows-1251](https://encoding.spec.whatwg.org/#windows-1251) |
| vi | Vietnamese | [windows-1258](https://encoding.spec.whatwg.org/#windows-1258) |
| zh-Hans, zh-CN, zh-SG | Chinese, Simplified | [GBK](https://encoding.spec.whatwg.org/#gbk) |
| zh-Hant, zh-HK, zh-MO, zh-TW | Chinese, Traditional | [Big5](https://encoding.spec.whatwg.org/#big5) |
| All other locales | [windows-1252](https://encoding.spec.whatwg.org/#windows-1252) |


The contents of this table are derived from the intersection of
    Windows, Chrome, and Firefox defaults.


The [document's character encoding](https://dom.spec.whatwg.org/#concept-document-encoding) must immediately be set to the value returned
from this algorithm, at the same time as the user agent uses the returned value to select the
decoder to use for the input byte stream.

* * *

When an algorithm requires a user agent to prescan a byte stream to determine its
encoding, given some defined end condition, then it must run the following
steps. If at any point during these steps (including during instances of the [get an attribute](https://html.spec.whatwg.org/multipage/parsing.html#concept-get-attributes-when-sniffing) algorithm invoked by this
one) the user agent either runs out of bytes (meaning the position pointer created in
the first step below goes beyond the end of the byte stream obtained so far) or reaches its
end condition, then abort the [prescan a byte stream to determine its\\
encoding](https://html.spec.whatwg.org/multipage/parsing.html#prescan-a-byte-stream-to-determine-its-encoding) algorithm and return the result [get an XML encoding](https://html.spec.whatwg.org/multipage/parsing.html#concept-get-xml-encoding-when-sniffing) applied to the same
bytes that the [prescan a byte stream to determine its encoding](https://html.spec.whatwg.org/multipage/parsing.html#prescan-a-byte-stream-to-determine-its-encoding) algorithm was applied
to. Otherwise, these steps will return a character encoding.

1. Let position be a pointer to a byte in the input byte stream, initially
    pointing at the first byte.

2. Prescan for UTF-16 XML declarations: If position points to:
A sequence of bytes starting with: 0x3C, 0x0, 0x3F, 0x0, 0x78, 0x0 (case-sensitive UTF-16
    little-endian '<?x')

Return [UTF-16LE](https://encoding.spec.whatwg.org/#utf-16le).

A sequence of bytes starting with: 0x0, 0x3C, 0x0, 0x3F, 0x0, 0x78 (case-sensitive UTF-16
    big-endian '<?x')

Return [UTF-16BE](https://encoding.spec.whatwg.org/#utf-16be).


For historical reasons, the prefix is two bytes longer than in [Appendix F](https://www.w3.org/TR/REC-xml/#sec-guessing) of XML and the
    encoding name is not checked.

3. _Loop_: If position points to:
A sequence of bytes starting with: 0x3C 0x21 0x2D 0x2D (\``<!--`\`)

Advance the position pointer so that it points at the first 0x3E byte
which is preceded by two 0x2D bytes (i.e. at the end of an ASCII '-->' sequence) and comes
after the 0x3C byte that was found. (The two 0x2D bytes can be the same as those in the
'<!--' sequence.)

A sequence of bytes starting with: 0x3C, 0x4D or 0x6D, 0x45 or 0x65, 0x54 or 0x74, 0x41 or 0x61, and one of 0x09, 0x0A, 0x0C, 0x0D, 0x20, 0x2F (case-insensitive ASCII '<meta' followed by a space or slash)

01. Advance the position pointer so that it points at the next 0x09,
        0x0A, 0x0C, 0x0D, 0x20, or 0x2F byte (the one in sequence of characters matched
        above).

02. Let attribute list be an empty list of strings.

03. Let got pragma be false.

04. Let need pragma be null.

05. Let charset be the null value (which, for the purposes of this
        algorithm, is distinct from an unrecognized encoding or the empty string).

06. _Attributes_: [Get an\\
        attribute](https://html.spec.whatwg.org/multipage/parsing.html#concept-get-attributes-when-sniffing) and its value. If no attribute was sniffed, then jump to the
        _processing_ step below.

07. If the attribute's name is already in attribute list, then return
        to the step labeled _attributes_.

08. Add the attribute's name to attribute list.

09. Run the appropriate step from the following list, if one applies:
       If the attribute's name is "`http-equiv`"

       If the attribute's value is "`content-type`", then set got pragma to true.

       If the attribute's name is "`content`"

       Apply the [algorithm for extracting a character encoding from a\\
       `meta` element](https://html.spec.whatwg.org/multipage/urls-and-fetching.html#algorithm-for-extracting-a-character-encoding-from-a-meta-element), giving the attribute's value as the string to parse. If a
       character encoding is returned, and if charset is still set to null,
       let charset be the encoding returned, and set need
       pragma to true.

       If the attribute's name is "`charset`"

       Let charset be the result of [getting an encoding](https://encoding.spec.whatwg.org/#concept-encoding-get)
       from the attribute's value, and set need pragma to false.

10. Return to the step labeled _attributes_.

11. _Processing_: If need pragma is null, then jump to the step
        below labeled _next byte_.

12. If need pragma is true but got pragma is
        false, then jump to the step below labeled _next byte_.

13. If charset is failure, then jump to the step below labeled _next_
       _byte_.

14. If charset is [UTF-16BE/LE](https://encoding.spec.whatwg.org/#utf-16be-le), then set charset to
        [UTF-8](https://encoding.spec.whatwg.org/#utf-8).



15. If charset is [x-user-defined](https://encoding.spec.whatwg.org/#x-user-defined), then set charset to
        [windows-1252](https://encoding.spec.whatwg.org/#windows-1252).

16. Return charset.


A sequence of bytes starting with a 0x3C byte (<), optionally a 0x2F byte (/), and
finally a byte in the range 0x41-0x5A or 0x61-0x7A (A-Z or a-z)

1. Advance the position pointer so that it points at the next 0x09 (HT),
       0x0A (LF), 0x0C (FF), 0x0D (CR), 0x20 (SP), or 0x3E (>) byte.

2. Repeatedly [get an attribute](https://html.spec.whatwg.org/multipage/parsing.html#concept-get-attributes-when-sniffing)
       until no further attributes can be found, then jump to the step below labeled _next_
      _byte_.


A sequence of bytes starting with: 0x3C 0x21 (\``<!`\`)A sequence of bytes starting with: 0x3C 0x2F (\``</`\`)A sequence of bytes starting with: 0x3C 0x3F (\``<?`\`)

Advance the position pointer so that it points at the first 0x3E byte (>) that
comes after the 0x3C byte that was found.

Any other byte

Do nothing with that byte.

4. _Next byte_: Move position so it points at the next byte in the
    input byte stream, and return to the step above labeled _loop_.

When the [prescan a byte stream to determine its encoding](https://html.spec.whatwg.org/multipage/parsing.html#prescan-a-byte-stream-to-determine-its-encoding) algorithm says to get an attribute, it means doing this:

01. If the byte at position is one of 0x09 (HT), 0x0A (LF), 0x0C (FF), 0x0D (CR),
     0x20 (SP), or 0x2F (/), then advance position to the next byte and redo this
     step.

02. If the byte at position is 0x3E (>), then abort the [get an attribute](https://html.spec.whatwg.org/multipage/parsing.html#concept-get-attributes-when-sniffing) algorithm. There isn't
     one.

03. Otherwise, the byte at position is the start of the attribute name.
     Let attribute name and attribute value be the empty
     string.

04. Process the byte at position as follows:
    If it is 0x3D (=), and the attribute name is longer than the empty stringAdvance position to the next byte and jump to the step below labeled
     _value_.If it is 0x09 (HT), 0x0A (LF), 0x0C (FF), 0x0D (CR), or 0x20 (SP)Jump to the step below labeled _spaces_.If it is 0x2F (/) or 0x3E (>)Abort the [get an attribute](https://html.spec.whatwg.org/multipage/parsing.html#concept-get-attributes-when-sniffing)
     algorithm. The attribute's name is the value of attribute name, its value
     is the empty string.If it is in the range 0x41 (A) to 0x5A (Z)Append the code point b+0x20 to attribute name
     (where b is the value of the byte at position). (This converts the input
     to lowercase.)Anything elseAppend the code point with the same value as the byte at position to
     attribute name. (It doesn't actually matter how bytes outside the ASCII range are
     handled here, since only ASCII bytes can contribute to the detection of a character
     encoding.)
05. Advance position to the next byte and return to the previous
     step.

06. _Spaces_: If the byte at position is one of 0x09 (HT), 0x0A (LF), 0x0C
     (FF), 0x0D (CR), or 0x20 (SP), then advance position to the next byte, then, repeat
     this step.

07. If the byte at position is _not_ 0x3D (=), abort the [get an attribute](https://html.spec.whatwg.org/multipage/parsing.html#concept-get-attributes-when-sniffing) algorithm. The attribute's
     name is the value of attribute name, its value is the empty string.

08. Advance position past the 0x3D (=) byte.

09. _Value_: If the byte at position is one of 0x09 (HT), 0x0A (LF), 0x0C
     (FF), 0x0D (CR), or 0x20 (SP), then advance position to the next byte, then, repeat
     this step.

10. Process the byte at position as follows:
    If it is 0x22 (") or 0x27 (')

    1. Let b be the value of the byte at position.
    2. _Quote loop_: Advance position to the next byte.
    3. If the value of the byte at position is the value of b, then advance position to the next byte and abort the
        "get an attribute" algorithm. The attribute's name is the value of attribute
        name, and its value is the value of attribute value.
    4. Otherwise, if the value of the byte at position is in the range 0x41 (A) to
        0x5A (Z), then append a code point to attribute value whose value is 0x20 more
        than the value of the byte at position.
    5. Otherwise, append a code point to attribute value whose value is the same as
        the value of the byte at position.
    6. Return to the step above labeled _quote loop_.

If it is 0x3E (>)Abort the [get an attribute](https://html.spec.whatwg.org/multipage/parsing.html#concept-get-attributes-when-sniffing)
algorithm. The attribute's name is the value of attribute name, its value
is the empty string.If it is in the range 0x41 (A) to 0x5A (Z)Append a code point b+0x20 to attribute value
(where b is the value of the byte at position). Advance
position to the next byte.Anything elseAppend a code point with the same value as the byte at position to
attribute value. Advance position to the next byte.
11. Process the byte at position as
     follows:
    If it is 0x09 (HT), 0x0A (LF), 0x0C (FF), 0x0D (CR), 0x20 (SP), or 0x3E (>)Abort the [get an attribute](https://html.spec.whatwg.org/multipage/parsing.html#concept-get-attributes-when-sniffing)
     algorithm. The attribute's name is the value of attribute name and its
     value is the value of attribute value.If it is in the range 0x41 (A) to 0x5A (Z)Append a code point b+0x20 to attribute value
     (where b is the value of the byte at position).Anything elseAppend a code point with the same value as the byte at position to
     attribute value.
12. Advance position to the next byte and return to the previous
     step.


When the [prescan a byte stream to determine its encoding](https://html.spec.whatwg.org/multipage/parsing.html#prescan-a-byte-stream-to-determine-its-encoding) algorithm is aborted
without returning an encoding, get an XML
encoding means doing this.

Looking for syntax resembling an XML declaration, even in `text/html`,
is necessary for compatibility with existing content.

01. Let encodingPosition be a pointer to the start of the stream.

02. If encodingPosition does not point to the start of a byte sequence 0x3C, 0x3F,
     0x78, 0x6D, 0x6C (\``<?xml`\`), then return failure.

03. Let xmlDeclarationEnd be a pointer to the next byte in the input byte stream
     which is 0x3E (>). If there is no such byte, then return failure.

04. Set encodingPosition to the position of the first occurrence of the subsequence
     of bytes 0x65, 0x6E, 0x63, 0x6F, 0x64, 0x69, 0x6E, 0x67 (\``encoding`\`) at or
     after the current encodingPosition and before xmlDeclarationEnd. If there is
     no such sequence, then return failure.

05. Advance encodingPosition past the 0x67 (g) byte.

06. While the byte at encodingPosition is less than or equal to 0x20 (i.e., it is
     either an ASCII space or control character), advance encodingPosition to the next
     byte.

07. If the byte at encodingPosition is not 0x3D (=), then return failure.

08. Advance encodingPosition to the next byte.

09. While the byte at encodingPosition is less than or equal to 0x20 (i.e., it is
     either an ASCII space or control character), advance encodingPosition to the next
     byte.

10. Let quoteMark be the byte at encodingPosition.

11. If quoteMark is not either 0x22 (") or 0x27 ('), then return failure.

12. Advance encodingPosition to the next byte.

13. Let encodingEndPosition be the position of the next occurrence of
     quoteMark at or after encodingPosition. If quoteMark does not
     occur again, then return failure.

14. Let potentialEncoding be the sequence of the bytes between
     encodingPosition (inclusive) and encodingEndPosition (exclusive).

15. If potentialEncoding contains one or more bytes whose byte value is 0x20 or
     below, then return failure.

16. Let encoding be the result of [getting an encoding](https://encoding.spec.whatwg.org/#concept-encoding-get) given
     potentialEncoding [isomorphic decoded](https://infra.spec.whatwg.org/#isomorphic-decode).

17. If the encoding is [UTF-16BE/LE](https://encoding.spec.whatwg.org/#utf-16be-le), then change it to
     [UTF-8](https://encoding.spec.whatwg.org/#utf-8).

18. Return encoding.


For the sake of interoperability, user agents should not use a pre-scan algorithm that returns
different results than the one described above. (But, if you do, please at least let us know, so
that we can improve this algorithm and benefit everyone...)

##### 13.2.3.3 Character encodings

User agents must support the encodings defined in Encoding, including, but
not limited to,
[UTF-8](https://encoding.spec.whatwg.org/#utf-8),
[ISO-8859-2](https://encoding.spec.whatwg.org/#iso-8859-2),
[ISO-8859-7](https://encoding.spec.whatwg.org/#iso-8859-7),
[ISO-8859-8](https://encoding.spec.whatwg.org/#iso-8859-8),
[windows-874](https://encoding.spec.whatwg.org/#windows-874),
[windows-1250](https://encoding.spec.whatwg.org/#windows-1250),
[windows-1251](https://encoding.spec.whatwg.org/#windows-1251),
[windows-1252](https://encoding.spec.whatwg.org/#windows-1252),
[windows-1254](https://encoding.spec.whatwg.org/#windows-1254),
[windows-1255](https://encoding.spec.whatwg.org/#windows-1255),
[windows-1256](https://encoding.spec.whatwg.org/#windows-1256),
[windows-1257](https://encoding.spec.whatwg.org/#windows-1257),
[windows-1258](https://encoding.spec.whatwg.org/#windows-1258),
[GBK](https://encoding.spec.whatwg.org/#gbk),
[Big5](https://encoding.spec.whatwg.org/#big5),
[ISO-2022-JP](https://encoding.spec.whatwg.org/#iso-2022-jp),
[Shift\_JIS](https://encoding.spec.whatwg.org/#shift_jis),
[EUC-KR](https://encoding.spec.whatwg.org/#euc-kr),
[UTF-16BE](https://encoding.spec.whatwg.org/#utf-16be),
[UTF-16LE](https://encoding.spec.whatwg.org/#utf-16le),
[UTF-16BE/LE](https://encoding.spec.whatwg.org/#utf-16be-le), and
[x-user-defined](https://encoding.spec.whatwg.org/#x-user-defined).
User agents must not support other encodings.

The above prohibits supporting, for example, CESU-8, UTF-7, BOCU-1, SCSU, EBCDIC,
and UTF-32. This specification does not make any attempt to support prohibited encodings in its
algorithms; support and use of prohibited encodings would thus lead to unexpected behavior.
[\[CESU8\]](https://html.spec.whatwg.org/multipage/references.html#refsCESU8) [\[UTF7\]](https://html.spec.whatwg.org/multipage/references.html#refsUTF7) [\[BOCU1\]](https://html.spec.whatwg.org/multipage/references.html#refsBOCU1) [\[SCSU\]](https://html.spec.whatwg.org/multipage/references.html#refsSCSU)

##### 13.2.3.4 Changing the encoding while parsing

When the parser requires the user agent to change the encoding, it must run the
following steps. This might happen if the [encoding sniffing algorithm](https://html.spec.whatwg.org/multipage/parsing.html#encoding-sniffing-algorithm) described above
failed to find a character encoding, or if it found a character encoding that was not the actual
encoding of the file.

1. If the encoding that is already being used to interpret the input stream is
    [UTF-16BE/LE](https://encoding.spec.whatwg.org/#utf-16be-le), then set the [confidence](https://html.spec.whatwg.org/multipage/parsing.html#concept-encoding-confidence) to _certain_ and return. The new
    encoding is ignored; if it was anything but the same encoding, then it would be clearly
    incorrect.

2. If the new encoding is [UTF-16BE/LE](https://encoding.spec.whatwg.org/#utf-16be-le), then change it to
    [UTF-8](https://encoding.spec.whatwg.org/#utf-8).

3. If the new encoding is [x-user-defined](https://encoding.spec.whatwg.org/#x-user-defined), then change it to
    [windows-1252](https://encoding.spec.whatwg.org/#windows-1252).

4. If the new encoding is identical or equivalent to the encoding that is already being used
    to interpret the input stream, then set the [confidence](https://html.spec.whatwg.org/multipage/parsing.html#concept-encoding-confidence) to _certain_ and return.
    This happens when the encoding information found in the file matches what the [encoding\\
    sniffing algorithm](https://html.spec.whatwg.org/multipage/parsing.html#encoding-sniffing-algorithm) determined to be the encoding, and in the second pass through the
    parser if the first pass found that the encoding sniffing algorithm described in the earlier
    section failed to find the right encoding.

5. If all the bytes up to the last byte converted by the current decoder have the same
    Unicode interpretations in both the current encoding and the new encoding, and if the user agent
    supports changing the converter on the fly, then the user agent may change to the new converter
    for the encoding on the fly. Set the [document's character encoding](https://dom.spec.whatwg.org/#concept-document-encoding) and the encoding
    used to convert the input stream to the new encoding, set the [confidence](https://html.spec.whatwg.org/multipage/parsing.html#concept-encoding-confidence) to _certain_, and return.

6. Otherwise, restart the [navigate](https://html.spec.whatwg.org/multipage/browsing-the-web.html#navigate) algorithm, with _[historyHandling](https://html.spec.whatwg.org/multipage/browsing-the-web.html#navigation-hh)_ set to "`replace`" and other inputs kept the same, but
    this time skip the [encoding sniffing algorithm](https://html.spec.whatwg.org/multipage/parsing.html#encoding-sniffing-algorithm) and instead just set the encoding to
    the new encoding and the [confidence](https://html.spec.whatwg.org/multipage/parsing.html#concept-encoding-confidence) to
    _certain_. Whenever possible, this should be done without actually contacting the network
    layer (the bytes should be re-parsed from memory), even if, e.g., the document is marked as not
    being cacheable. If this is not possible and contacting the network layer would involve repeating
    a request that uses a method other than \``GET`\`, then instead set the [confidence](https://html.spec.whatwg.org/multipage/parsing.html#concept-encoding-confidence) to _certain_ and ignore the new
    encoding. The resource will be misinterpreted. User agents may notify the user of the situation,
    to aid in application development.


This algorithm is only invoked when a new encoding is found declared on a
`meta` element.

##### 13.2.3.5 Preprocessing the input stream

The input stream consists of the characters pushed into it as the [input byte\\
stream](https://html.spec.whatwg.org/multipage/parsing.html#the-input-byte-stream) is decoded or from the various APIs that directly manipulate the input stream.

Any occurrences of [surrogates](https://infra.spec.whatwg.org/#surrogate) are [surrogate-in-input-stream](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-surrogate-in-input-stream) [parse errors](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Any occurrences of [noncharacters](https://infra.spec.whatwg.org/#noncharacter) are [noncharacter-in-input-stream](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-noncharacter-in-input-stream) [parse errors](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors) and any occurrences of [controls](https://infra.spec.whatwg.org/#control) other than [ASCII whitespace](https://infra.spec.whatwg.org/#ascii-whitespace) and U+0000 NULL
characters are [control-character-in-input-stream](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-control-character-in-input-stream) [parse errors](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).

The handling of U+0000 NULL characters varies based on where the characters are
found and happens at the later stages of the parsing. They are either ignored or, for security
reasons, replaced with a U+FFFD REPLACEMENT CHARACTER. This handling is, by necessity, spread
across both the tokenization stage and the tree construction stage.

Before the [tokenization](https://html.spec.whatwg.org/multipage/parsing.html#tokenization) stage, the input stream must be preprocessed by [normalizing newlines](https://infra.spec.whatwg.org/#normalize-newlines). Thus, newlines in HTML DOMs are
represented by U+000A LF characters, and there are never any U+000D CR characters in the input to
the [tokenization](https://html.spec.whatwg.org/multipage/parsing.html#tokenization) stage.

The next input character is the first character in the [input stream](https://html.spec.whatwg.org/multipage/parsing.html#input-stream)
that has not yet been consumed or explicitly ignored by the requirements in
this section. Initially, the _[next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character)_ is the
first character in the input. The current input character is the last character to have
been _consumed_.

The insertion point is the position (just before a character or just before the end
of the input stream) where content inserted using `document.write()` is actually inserted. The insertion point is
relative to the position of the character immediately after it, it is not an absolute offset into
the input stream. Initially, the insertion point is undefined.

The "EOF" character in the tables below is a conceptual character representing the end of the
[input stream](https://html.spec.whatwg.org/multipage/parsing.html#input-stream). If the parser is a [script-created parser](https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#script-created-parser), then the end of
the [input stream](https://html.spec.whatwg.org/multipage/parsing.html#input-stream) is reached when an explicit "EOF" character (inserted by
the `document.close()` method) is consumed. Otherwise, the
"EOF" character is not a real character in the stream, but rather the lack of any further
characters.

#### 13.2.4 Parse state

##### 13.2.4.1 The insertion mode

The insertion mode is a state variable that controls the primary operation of the
tree construction stage.

The rules for parsing tokens [in\\
foreign content](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inforeign) are not an [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode). The [tree construction\\
dispatcher](https://html.spec.whatwg.org/multipage/parsing.html#tree-construction-dispatcher) selects them independently of the current [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode), which is
left unchanged while they are in use.

Initially, the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) is " [initial](https://html.spec.whatwg.org/multipage/parsing.html#the-initial-insertion-mode)". It can change to " [before\\
html](https://html.spec.whatwg.org/multipage/parsing.html#the-before-html-insertion-mode)", " [before head](https://html.spec.whatwg.org/multipage/parsing.html#the-before-head-insertion-mode)", " [in head](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inhead)", " [in head noscript](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inheadnoscript)", " [after head](https://html.spec.whatwg.org/multipage/parsing.html#the-after-head-insertion-mode)",
" [in body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inbody)", " [text](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-incdata)", " [in table](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intable)", " [in table text](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intabletext)", " [in caption](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-incaption)", " [in column\\
group](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-incolgroup)", " [in table body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intbody)", " [in row](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intr)", " [in\\
cell](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intd)", " [in template](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intemplate)", " [after body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-afterbody)", " [in frameset](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inframeset)", " [after\\
frameset](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-afterframeset)", " [after after body](https://html.spec.whatwg.org/multipage/parsing.html#the-after-after-body-insertion-mode)", and
" [after after frameset](https://html.spec.whatwg.org/multipage/parsing.html#the-after-after-frameset-insertion-mode)" during the
course of the parsing, as described in the [tree construction](https://html.spec.whatwg.org/multipage/parsing.html#tree-construction) stage. The insertion
mode affects how tokens are processed.

Several of these modes, namely " [in head](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inhead)", " [in body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inbody)", and " [in\\
table](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intable)", are special, in that the other modes defer to them at various times. When the
algorithm below says that the user agent is to do something "using the rules for the
m insertion mode", where m is one of these modes, the user agent must use
the rules described under the m [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode)'s section, but must leave
the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) unchanged unless the rules in m themselves switch the
[insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to a new value.

When the insertion mode is switched to " [text](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-incdata)" or
" [in table text](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intabletext)", the original insertion
mode is also set. This is the insertion mode to which the tree construction stage will
return.

Similarly, to parse nested `template` elements, a stack of template insertion
modes is used. It is initially empty. The current template insertion mode is the
insertion mode that was most recently added to the [stack of template insertion modes](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-template-insertion-modes).
The algorithms in the sections below will _push_ insertion modes onto this stack, meaning
that the specified insertion mode is to be added to the stack, and _pop_ insertion modes from
the stack, which means that the most recently added insertion mode must be removed from the
stack.

* * *

When the steps below require the UA to reset the insertion mode appropriately, it
means the UA must follow these steps:

01. Let last be false.

02. Let node be the last node in the [stack of open\\
     elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).

03. _Loop_: If node is the first node in the stack of open elements, then set
     last to true, and, if the parser's [fragment context element](https://html.spec.whatwg.org/multipage/parsing.html#fragment-context-element) is non-null,
     then set node to that element ( [fragment case](https://html.spec.whatwg.org/multipage/parsing.html#fragment-case)).

04. If node is a `td` or `th` element and last is
     false, then switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in\\
     cell](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intd)" and return.

05. If node is a `tr` element, then switch the [insertion\\
     mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in row](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intr)" and return.

06. If node is a `tbody`, `thead`, or
     `tfoot` element, then switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in table body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intbody)" and return.

07. If node is a `caption` element, then switch the
     [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in caption](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-incaption)" and
     return.

08. If node is a `colgroup` element, then switch the
     [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in column\\
     group](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-incolgroup)" and return.

09. If node is a `table` element, then switch the
     [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in table](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intable)" and
     return.

10. If node is a `template` element, then switch the
     [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to the [current template insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#current-template-insertion-mode) and
     return.

11. If node is a `head` element and last is
     false, then switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in\\
     head](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inhead)" and return.

12. If node is a `body` element, then switch the
     [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inbody)" and
     return.

13. If node is a `frameset` element, then switch the
     [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in frameset](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inframeset)" and
     return. ( [fragment case](https://html.spec.whatwg.org/multipage/parsing.html#fragment-case))

14. If node is an `html` element, run these substeps:
    1. If the [`head` element pointer](https://html.spec.whatwg.org/multipage/parsing.html#head-element-pointer) is null, switch the
        [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [before head](https://html.spec.whatwg.org/multipage/parsing.html#the-before-head-insertion-mode)"
        and return. ( [fragment case](https://html.spec.whatwg.org/multipage/parsing.html#fragment-case))

    2. Otherwise, the [`head` element pointer](https://html.spec.whatwg.org/multipage/parsing.html#head-element-pointer) is not null, switch the
        [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [after head](https://html.spec.whatwg.org/multipage/parsing.html#the-after-head-insertion-mode)" and
        return.
15. If last is true, then switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inbody)" and return. ( [fragment\\
     case](https://html.spec.whatwg.org/multipage/parsing.html#fragment-case))

16. Let node now be the node before node in the
     [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).

17. Return to the step labeled _loop_.


##### 13.2.4.2 The stack of open elements

Initially, the stack of open elements is empty. The stack grows downwards; the
topmost node on the stack is the first one added to the stack, and the bottommost node of the
stack is the most recently added node in the stack (notwithstanding when the stack is manipulated
in a random access fashion as part of [the handling for misnested\\
tags](https://html.spec.whatwg.org/multipage/parsing.html#adoptionAgency)).

The " [before html](https://html.spec.whatwg.org/multipage/parsing.html#the-before-html-insertion-mode)"
[insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) creates the `html` [document element](https://dom.spec.whatwg.org/#document-element), which is
then added to the stack.

In the [fragment case](https://html.spec.whatwg.org/multipage/parsing.html#fragment-case), the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) is
initialized to contain an `html` element that is created as part of [that algorithm](https://html.spec.whatwg.org/multipage/parsing.html#html-fragment-parsing-algorithm). (The [fragment case](https://html.spec.whatwg.org/multipage/parsing.html#fragment-case) skips the
" [before html](https://html.spec.whatwg.org/multipage/parsing.html#the-before-html-insertion-mode)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode).)

The `html` node, however it is created, is the topmost node of the stack. It only
gets popped off the stack when the parser [finishes](https://html.spec.whatwg.org/multipage/parsing.html#stop-parsing).

The current node is the bottommost node in this [stack of open\\
elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).

The adjusted current node is the parser's [fragment context element](https://html.spec.whatwg.org/multipage/parsing.html#fragment-context-element) if
that element is non-null and the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) has only one element in it
( [fragment case](https://html.spec.whatwg.org/multipage/parsing.html#fragment-case)); otherwise, the [adjusted current node](https://html.spec.whatwg.org/multipage/parsing.html#adjusted-current-node) is the
[current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node).

When the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) is removed from the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements),
[process internal resource links](https://html.spec.whatwg.org/multipage/links.html#process-internal-resource-links) given the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node)'s
[node document](https://dom.spec.whatwg.org/#concept-node-document).

Elements in the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) fall into the following categories:

Special

The following elements have varying levels of special parsing rules: HTML's
`address`, `applet`, `area`, `article`,
`aside`, `base`, `basefont`, `bgsound`,
`blockquote`, `body`, `br`, `button`,
`caption`, `center`, `col`, `colgroup`,
`dd`, `details`, `dir`, `div`, `dl`,
`dt`, `embed`, `fieldset`, `figcaption`,
`figure`, `footer`, `form`, `frame`,
`frameset`, `h1`, `h2`, `h3`, `h4`,
`h5`, `h6`, `head`, `header`, `hgroup`,
`hr`, `html`, `iframe`,
`img`, `input`, `keygen`, `li`, `link`,
`listing`, `main`, `marquee`, `menu`,
`meta`, `nav`, `noembed`, `noframes`,
`noscript`, `object`, `ol`, `p`,
`param`, `plaintext`, `pre`, `script`,
`search`, `section`, `select`, `source`,
`style`, `summary`, `table`, `tbody`,
`td`, `template`, `textarea`, `tfoot`,
`th`, `thead`, `title`, `tr`, `track`,
`ul`, `wbr`, `xmp`; [MathML `mi`](https://w3c.github.io/mathml-core/#the-mi-element),
[MathML `mo`](https://w3c.github.io/mathml-core/#operator-fence-separator-or-accent-mo), [MathML `mn`](https://w3c.github.io/mathml-core/#number-mn), [MathML\\
`ms`](https://w3c.github.io/mathml-core/#string-literal-ms), [MathML `mtext`](https://w3c.github.io/mathml-core/#text-mtext), and [MathML\\
`annotation-xml`](https://w3c.github.io/mathml-core/#dfn-annotation-xml); and [SVG `foreignObject`](https://w3c.github.io/svgwg/svg2-draft/embedded.html#elementdef-foreignObject), [SVG\\
`desc`](https://w3c.github.io/svgwg/svg2-draft/struct.html#elementdef-desc), and [SVG `title`](https://w3c.github.io/svgwg/svg2-draft/struct.html#elementdef-title).

An `image` start tag token is handled by the tree builder,
but it is not in this list because it is not an element; it gets turned into an `img`
element.

Formatting

The following HTML elements are those that end up in the [list of active formatting\\
elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements): `a`, `b`, `big`, `code`,
`em`, `font`, `i`, `nobr`, `s`,
`small`, `strike`, `strong`, `tt`, and
`u`.

Ordinary

All other elements found while parsing an HTML document.

Typically, the [special](https://html.spec.whatwg.org/multipage/parsing.html#special) elements have the start and end tag tokens
handled specifically, while [ordinary](https://html.spec.whatwg.org/multipage/parsing.html#ordinary) elements' tokens fall into "any other start tag"
and "any other end tag" clauses, and some parts of the tree builder check if a particular element
in the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) is in the [special](https://html.spec.whatwg.org/multipage/parsing.html#special) category. However, some
elements (e.g., the `option` element) have their start or end tag tokens handled
specifically, but are still not in the [special](https://html.spec.whatwg.org/multipage/parsing.html#special) category, so that they get the
[ordinary](https://html.spec.whatwg.org/multipage/parsing.html#ordinary) handling elsewhere.

The [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) is said to have an element target node in a specific scope consisting of a
list of element types list when the following algorithm terminates in a match
state:

1. Initialize node to be the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) (the bottommost
    node of the stack).

2. If node is target node, terminate in a match state.

3. Otherwise, if node is one of the element types in list, terminate in a failure state.

4. Otherwise, set node to the previous entry in the [stack of open\\
    elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) and return to step 2. (This will never fail, since the loop will always terminate
    in the previous step if the top of the stack — an `html` element — is
    reached.)


The [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) is said to have a
particular element in scope when it [has\\
that element in the specific scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-the-specific-scope) consisting of the following element types:

- `applet`
- `caption`
- `html`
- `table`
- `td`
- `th`
- `marquee`
- `object`
- `select`
- `template`
- [MathML `mi`](https://w3c.github.io/mathml-core/#the-mi-element)
- [MathML `mo`](https://w3c.github.io/mathml-core/#operator-fence-separator-or-accent-mo)
- [MathML `mn`](https://w3c.github.io/mathml-core/#number-mn)
- [MathML `ms`](https://w3c.github.io/mathml-core/#string-literal-ms)
- [MathML `mtext`](https://w3c.github.io/mathml-core/#text-mtext)
- [MathML `annotation-xml`](https://w3c.github.io/mathml-core/#dfn-annotation-xml)
- [SVG `foreignObject`](https://w3c.github.io/svgwg/svg2-draft/embedded.html#elementdef-foreignObject)
- [SVG `desc`](https://w3c.github.io/svgwg/svg2-draft/struct.html#elementdef-desc)
- [SVG `title`](https://w3c.github.io/svgwg/svg2-draft/struct.html#elementdef-title)

The [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) is said to have a particular element in list item scope when it [has that element in the specific scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-the-specific-scope) consisting of the following
element types:

- All the element types listed above for the _[has an element in scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-scope)_ algorithm.
- `ol` in the [HTML namespace](https://infra.spec.whatwg.org/#html-namespace)
- `ul` in the [HTML namespace](https://infra.spec.whatwg.org/#html-namespace)

The [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) is said to have a particular element in button scope when it [has that element in the specific scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-the-specific-scope) consisting of the following element
types:

- All the element types listed above for the _[has an element in scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-scope)_ algorithm.
- `button` in the [HTML namespace](https://infra.spec.whatwg.org/#html-namespace)

The [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) is said to have a particular element in table scope when it [has that element in the specific scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-the-specific-scope) consisting of the following element
types:

- `html` in the [HTML namespace](https://infra.spec.whatwg.org/#html-namespace)
- `table` in the [HTML namespace](https://infra.spec.whatwg.org/#html-namespace)
- `template` in the [HTML namespace](https://infra.spec.whatwg.org/#html-namespace)

Nothing happens if at any time any of the elements in the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements)
are moved to a new location in, or removed from, the `Document` tree. In particular,
the stack is not changed in this situation. This can cause, amongst other strange effects, content
to be appended to nodes that are no longer in the DOM.

In some cases (namely, when [closing misnested formatting\\
elements](https://html.spec.whatwg.org/multipage/parsing.html#adoptionAgency)), the stack is manipulated in a random-access fashion.

##### 13.2.4.3 The list of active formatting elements

Initially, the list of active formatting elements is empty. It is used to handle
mis-nested [formatting element tags](https://html.spec.whatwg.org/multipage/parsing.html#formatting).

The list contains elements in the [formatting](https://html.spec.whatwg.org/multipage/parsing.html#formatting) category, and [markers](https://html.spec.whatwg.org/multipage/parsing.html#concept-parser-marker). The markers are inserted when entering `applet`,
`object`, `marquee`, `template`, `td`,
`th`, and `caption` elements, and are used to prevent formatting from
"leaking" _into_`applet`, `object`, `marquee`,
`template`, `td`, `th`, and `caption` elements.

In addition, each element in the [list of active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements) is associated
with the token for which it was created, so that further elements can be created for that token if
necessary.

When the steps below require the UA to push onto the list of active formatting
elements an element element, the UA must perform the following
steps:

1. If there are already three elements in the [list of active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements)
    after the last [marker](https://html.spec.whatwg.org/multipage/parsing.html#concept-parser-marker), if any, or anywhere in the
    list if there are no [markers](https://html.spec.whatwg.org/multipage/parsing.html#concept-parser-marker), that have the same tag
    name, namespace, and attributes as element, then remove the earliest such
    element from the [list of active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements). For these purposes, the
    attributes must be compared as they were when the elements were created by the parser; two
    elements have the same attributes if all their parsed attributes can be paired such that the two
    attributes in each pair have identical names, namespaces, and values (the order of the attributes
    does not matter).

This is the Noah's Ark clause. But with three per family instead of two.

2. Add element to the [list of active formatting\\
    elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements).


When the steps below require the UA to reconstruct the active formatting elements,
the UA must perform the following steps:

01. If there are no entries in the [list of active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements), then there
     is nothing to reconstruct; stop this algorithm.

02. If the last (most recently added) entry in the [list of active formatting\\
     elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements) is a [marker](https://html.spec.whatwg.org/multipage/parsing.html#concept-parser-marker), or if it is an element
     that is in the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements), then there is nothing to reconstruct; stop
     this algorithm.

03. Let entry be the last (most recently added) element in the [list\\
     of active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements).

04. _Rewind_: If there are no entries before entry in the [list\\
     of active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements), then jump to the step labeled _create_.

05. Let entry be the entry one earlier than entry in
     the [list of active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements).

06. If entry is neither a [marker](https://html.spec.whatwg.org/multipage/parsing.html#concept-parser-marker) nor an element that is also in the [stack of\\
     open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements), go to the step labeled _rewind_.

07. _Advance_: Let entry be the element one later than entry in the [list of active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements).

08. _Create_: [Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token for which the element
     entry was created, to obtain new element.

09. Replace the entry for entry in the list with an entry for new element.

10. If the entry for new element in the [list of active formatting\\
     elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements) is not the last entry in the list, return to the step labeled
     _advance_.


This has the effect of reopening all the formatting elements that were opened in the current
body, cell, or caption (whichever is youngest) that haven't been explicitly closed.

The way this specification is written, the [list of active formatting\\
elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements) always consists of elements in chronological order with the least recently added
element first and the most recently added element last (except for while steps 7 to 10 of the
above algorithm are being executed, of course).

When the steps below require the UA to clear the list of active formatting elements up to
the last marker, the UA must perform the following steps:

1. Let entry be the last (most recently added) entry in the [list of\\
    active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements).

2. Remove entry from the [list of active formatting\\
    elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements).

3. If entry was a [marker](https://html.spec.whatwg.org/multipage/parsing.html#concept-parser-marker),
    then stop the algorithm at this point. The list has been cleared up to the last [marker](https://html.spec.whatwg.org/multipage/parsing.html#concept-parser-marker).

4. Go to step 1.


##### 13.2.4.4 The element pointers

Initially, the `head` element pointer and the `form` element pointer are both null.

Once a `head` element has been parsed (whether implicitly or explicitly) the
[`head` element pointer](https://html.spec.whatwg.org/multipage/parsing.html#head-element-pointer) gets set to point to this node.

The [`form` element pointer](https://html.spec.whatwg.org/multipage/parsing.html#form-element-pointer) points to the last
`form` element that was opened and whose end tag has not yet been seen. It is used to
make form controls associate with forms in the face of dramatically bad markup, for historical
reasons. It is ignored inside `template` elements.

An [HTML parser](https://html.spec.whatwg.org/multipage/parsing.html#html-parser) is parsing template contents if there is a
`template` element on the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements), or the parser's
[fragment context element](https://html.spec.whatwg.org/multipage/parsing.html#fragment-context-element) is a `template` element.

##### 13.2.4.5 Other parsing state flags

The root insertion target, which is null or a `DocumentFragment`
(initially null).

An `Element`-or-null fragment context element, initially null.

A boolean allow declarative shadow roots (initially false).

The scripting mode, which is a [parser scripting mode](https://html.spec.whatwg.org/multipage/parsing.html#parser-scripting-mode). It is initially
set to [Normal](https://html.spec.whatwg.org/multipage/parsing.html#scripting-mode-normal) if [scripting was enabled](https://html.spec.whatwg.org/multipage/webappapis.html#concept-n-script) for the `Document` with which
the parser is associated when the parser was created, and [Disabled](https://html.spec.whatwg.org/multipage/parsing.html#scripting-mode-disabled) otherwise.

A parser scripting mode is one of the following:

NormalScripts are processed when inserted, respecting `async`
 and `defer` attributes and blocking the parser when
 encountering a [classic script](https://html.spec.whatwg.org/multipage/webappapis.html#classic-script).DisabledScripts are disabled, and the `noscript` element can represent fallback
 content.InertScripts are enabled, however they are marked as [already started](https://html.spec.whatwg.org/multipage/scripting.html#already-started), essentially
 preventing them from executing. This is the default mode of the [HTML fragment parsing\\
 algorithm](https://html.spec.whatwg.org/multipage/parsing.html#html-fragment-parsing-algorithm).FragmentScripts are executed as soon as they are inserted into the document as part of a the
 [HTML fragment parsing algorithm](https://html.spec.whatwg.org/multipage/parsing.html#html-fragment-parsing-algorithm), ignoring `async` and `defer`
 attributes. This mode is used by `createContextualFragment()`.

The frameset-ok flag is set to "ok" when the parser is created. It is set to "not
ok" after certain tokens are seen, and back to "ok" when the `body` element is
inserted implicitly.

#### 13.2.5Tokenization

Implementations must act as if they used the following state machine to tokenize HTML. The
state machine must start in the [data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state). Most states consume a single character,
which may have various side-effects, and either switches the state machine to a new state to
[reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character), or switches it to a new state to
consume the [next character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character), or stays in the same state
to consume the next character. Some states have more complicated behavior and can consume several
characters before switching to another state. In some cases, the tokenizer state is also changed
by the tree construction stage.

When a state says to reconsume a matched character in a specified state, that means
to switch to that state, but when it attempts to consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character),
provide it with the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) instead.

The exact behavior of certain states depends on the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) and the
[stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements). Certain states also use a temporary buffer to track progress, and the [character reference\\
state](https://html.spec.whatwg.org/multipage/parsing.html#character-reference-state) uses a return state to return to the
state it was invoked from.

The output of the tokenization step is a series of zero or more of the following tokens:
DOCTYPE, start tag, end tag, comment, character, end-of-file. DOCTYPE tokens have a name, a public
identifier, a system identifier, and a _force-quirks flag_. When a DOCTYPE token
is created, its name, public identifier, and system identifier must be marked as missing (which is
a distinct state from the empty string), and the _[force-quirks flag](https://html.spec.whatwg.org/multipage/parsing.html#force-quirks-flag)_ must be set to
_off_ (its other state is _on_). Start and end tag tokens have a tag name, a self-closing flag, and a list of attributes, each of which has a
name and a value. When a start or end tag token is created, its _[self-closing flag](https://html.spec.whatwg.org/multipage/parsing.html#self-closing-flag)_ must be unset (its other state is that it be set), and its attributes
list must be empty. Comment and character tokens have data.

When a token is emitted, it must immediately be handled by the [tree construction](https://html.spec.whatwg.org/multipage/parsing.html#tree-construction)
stage. The tree construction stage can affect the state of the tokenization stage, and can insert
additional characters into the stream. (For example, the `script` element can result in
scripts executing and using the [dynamic markup insertion](https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dynamic-markup-insertion) APIs to insert characters
into the stream being tokenized.)

Creating a token and emitting it are distinct actions. It is possible for a token
to be created but implicitly abandoned (never emitted), e.g. if the file ends unexpectedly while
processing the characters that are being parsed into a start tag token.

When a start tag token is emitted with its _[self-closing flag](https://html.spec.whatwg.org/multipage/parsing.html#self-closing-flag)_ set, if the flag is not
acknowledged when it is processed by the tree
construction stage, that is a [non-void-html-element-start-tag-with-trailing-solidus](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-non-void-html-element-start-tag-with-trailing-solidus) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).

When an end tag token is emitted with attributes, that is an [end-tag-with-attributes](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-end-tag-with-attributes) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).

When an end tag token is emitted with its _[self-closing flag](https://html.spec.whatwg.org/multipage/parsing.html#self-closing-flag)_
set, that is an [end-tag-with-trailing-solidus](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-end-tag-with-trailing-solidus) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).

An appropriate end tag token is an end tag token whose tag name matches the tag name
of the last start tag to have been emitted from this tokenizer, if any. If no start tag has been
emitted from this tokenizer, then no end tag token is appropriate.

A [character reference](https://html.spec.whatwg.org/multipage/syntax.html#syntax-charref) is said to be consumed as part of an attribute if the [return state](https://html.spec.whatwg.org/multipage/parsing.html#return-state) is either [attribute value (double-quoted) state](https://html.spec.whatwg.org/multipage/parsing.html#attribute-value-(double-quoted)-state),
[attribute value (single-quoted) state](https://html.spec.whatwg.org/multipage/parsing.html#attribute-value-(single-quoted)-state), or [attribute value (unquoted)\\
state](https://html.spec.whatwg.org/multipage/parsing.html#attribute-value-(unquoted)-state).

When a state says to flush code points consumed as a character reference, it means
that for each [code point](https://infra.spec.whatwg.org/#code-point) in the [temporary\\
buffer](https://html.spec.whatwg.org/multipage/parsing.html#temporary-buffer) (in the order they were added to the buffer), the user agent must append the code point
from the buffer to the current attribute's value if the character reference was [consumed as part of an attribute](https://html.spec.whatwg.org/multipage/parsing.html#charref-in-attribute), or emit the code point as a
character token otherwise.

To convert the temporary buffer to a comment, create a comment token whose data is
the concatenation of "`?`" and the [code\\
points](https://infra.spec.whatwg.org/#code-point) in the [temporary buffer](https://html.spec.whatwg.org/multipage/parsing.html#temporary-buffer), in the order they were
added to the buffer.

This is used when a processing instruction is found to have an invalid target and
is instead treated as a bogus comment.

Before each step of the tokenizer, the user agent must first check
the [parser pause flag](https://html.spec.whatwg.org/multipage/parsing.html#parser-pause-flag). If it is true, then the tokenizer must abort the processing of
any nested invocations of the tokenizer, yielding control back to the caller.

The tokenizer state machine consists of the states defined in the following subsections.

##### 13.2.5.1Data state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

U+0026 AMPERSAND (&)Set the [return state](https://html.spec.whatwg.org/multipage/parsing.html#return-state) to the [data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state).
Switch to the [character reference state](https://html.spec.whatwg.org/multipage/parsing.html#character-reference-state).U+003C LESS-THAN SIGN (<)Switch to the [tag open state](https://html.spec.whatwg.org/multipage/parsing.html#tag-open-state).U+0000 NULLThis is an [unexpected-null-character](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-unexpected-null-character) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Emit the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) as a character token.EOFEmit an end-of-file token.Anything elseEmit the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) as a character token.

##### 13.2.5.2RCDATA state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

U+0026 AMPERSAND (&)Set the [return state](https://html.spec.whatwg.org/multipage/parsing.html#return-state) to the [RCDATA state](https://html.spec.whatwg.org/multipage/parsing.html#rcdata-state).
Switch to the [character reference state](https://html.spec.whatwg.org/multipage/parsing.html#character-reference-state).U+003C LESS-THAN SIGN (<)Switch to the [RCDATA less-than sign state](https://html.spec.whatwg.org/multipage/parsing.html#rcdata-less-than-sign-state).U+0000 NULLThis is an [unexpected-null-character](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-unexpected-null-character) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Emit a U+FFFD REPLACEMENT CHARACTER character token.EOFEmit an end-of-file token.Anything elseEmit the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) as a character token.

##### 13.2.5.3RAWTEXT state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

U+003C LESS-THAN SIGN (<)Switch to the [RAWTEXT less-than sign state](https://html.spec.whatwg.org/multipage/parsing.html#rawtext-less-than-sign-state).U+0000 NULLThis is an [unexpected-null-character](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-unexpected-null-character) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Emit a U+FFFD REPLACEMENT CHARACTER character token.EOFEmit an end-of-file token.Anything elseEmit the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) as a character token.

##### 13.2.5.4Script data state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

U+003C LESS-THAN SIGN (<)Switch to the [script data less-than sign state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-less-than-sign-state).U+0000 NULLThis is an [unexpected-null-character](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-unexpected-null-character) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Emit a U+FFFD REPLACEMENT CHARACTER character token.EOFEmit an end-of-file token.Anything elseEmit the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) as a character token.

##### 13.2.5.5PLAINTEXT state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

U+0000 NULLThis is an [unexpected-null-character](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-unexpected-null-character) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Emit a U+FFFD REPLACEMENT CHARACTER character token.EOFEmit an end-of-file token.Anything elseEmit the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) as a character token.

##### 13.2.5.6Tag open state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

U+0021 EXCLAMATION MARK (!)Switch to the [markup declaration open state](https://html.spec.whatwg.org/multipage/parsing.html#markup-declaration-open-state).U+002F SOLIDUS (/)Switch to the [end tag open state](https://html.spec.whatwg.org/multipage/parsing.html#end-tag-open-state).[ASCII alpha](https://infra.spec.whatwg.org/#ascii-alpha)Create a new start tag token, set its tag name to the empty string. [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in
the [tag name state](https://html.spec.whatwg.org/multipage/parsing.html#tag-name-state).

U+003F QUESTION MARK (?)Set the [temporary buffer](https://html.spec.whatwg.org/multipage/parsing.html#temporary-buffer) to the empty string. Switch to
the [processing instruction open state](https://html.spec.whatwg.org/multipage/parsing.html#processing-instruction-open-state).EOFThis is an [eof-before-tag-name](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-before-tag-name) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Emit a U+003C LESS-THAN SIGN character token and an end-of-file
token.Anything elseThis is an [invalid-first-character-of-tag-name](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-invalid-first-character-of-tag-name) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Emit a U+003C LESS-THAN SIGN character token. [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in
the [data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state).

##### 13.2.5.7End tag open state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

[ASCII alpha](https://infra.spec.whatwg.org/#ascii-alpha)Create a new end tag token, set its tag name to the empty string. [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in
the [tag name state](https://html.spec.whatwg.org/multipage/parsing.html#tag-name-state).

U+003E GREATER-THAN SIGN (>)This is a [missing-end-tag-name](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-missing-end-tag-name) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Switch to the [data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state).EOFThis is an [eof-before-tag-name](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-before-tag-name) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Emit a U+003C LESS-THAN SIGN character token, a U+002F SOLIDUS
character token and an end-of-file token.

Anything elseThis is an [invalid-first-character-of-tag-name](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-invalid-first-character-of-tag-name) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Create a comment token whose data is the empty string.
[Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [bogus comment state](https://html.spec.whatwg.org/multipage/parsing.html#bogus-comment-state).

##### 13.2.5.8Tag name state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

U+0009 CHARACTER TABULATION (tab)U+000A LINE FEED (LF)U+000C FORM FEED (FF)U+0020 SPACESwitch to the [before attribute name state](https://html.spec.whatwg.org/multipage/parsing.html#before-attribute-name-state).U+002F SOLIDUS (/)Switch to the [self-closing start tag state](https://html.spec.whatwg.org/multipage/parsing.html#self-closing-start-tag-state).U+003E GREATER-THAN SIGN (>)Switch to the [data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state). Emit the current tag token.[ASCII upper alpha](https://infra.spec.whatwg.org/#ascii-upper-alpha)Append the lowercase version of the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) (add 0x0020 to the
character's code point) to the current tag token's tag name.U+0000 NULLThis is an [unexpected-null-character](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-unexpected-null-character) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Append a U+FFFD REPLACEMENT CHARACTER character to the current tag token's tag
name.EOFThis is an [eof-in-tag](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-tag) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).
Emit an end-of-file token.Anything elseAppend the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) to the current tag token's tag name.

##### 13.2.5.9RCDATA less-than sign state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

U+002F SOLIDUS (/)Set the [temporary buffer](https://html.spec.whatwg.org/multipage/parsing.html#temporary-buffer) to the empty string. Switch to
the [RCDATA end tag open state](https://html.spec.whatwg.org/multipage/parsing.html#rcdata-end-tag-open-state).Anything elseEmit a U+003C LESS-THAN SIGN character token. [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [RCDATA\\
state](https://html.spec.whatwg.org/multipage/parsing.html#rcdata-state).

##### 13.2.5.10RCDATA end tag open state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

[ASCII alpha](https://infra.spec.whatwg.org/#ascii-alpha)Create a new end tag token, set its tag name to the empty string. [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in
the [RCDATA end tag name state](https://html.spec.whatwg.org/multipage/parsing.html#rcdata-end-tag-name-state).

Anything elseEmit a U+003C LESS-THAN SIGN character token and a U+002F SOLIDUS character token.
[Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [RCDATA state](https://html.spec.whatwg.org/multipage/parsing.html#rcdata-state).

##### 13.2.5.11RCDATA end tag name state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

U+0009 CHARACTER TABULATION (tab)U+000A LINE FEED (LF)U+000C FORM FEED (FF)U+0020 SPACEIf the current end tag token is an [appropriate end tag token](https://html.spec.whatwg.org/multipage/parsing.html#appropriate-end-tag-token), then switch to the
[before attribute name state](https://html.spec.whatwg.org/multipage/parsing.html#before-attribute-name-state). Otherwise, treat it as per the "anything else" entry
below.U+002F SOLIDUS (/)If the current end tag token is an [appropriate end tag token](https://html.spec.whatwg.org/multipage/parsing.html#appropriate-end-tag-token), then switch to the
[self-closing start tag state](https://html.spec.whatwg.org/multipage/parsing.html#self-closing-start-tag-state). Otherwise, treat it as per the "anything else" entry
below.U+003E GREATER-THAN SIGN (>)If the current end tag token is an [appropriate end tag token](https://html.spec.whatwg.org/multipage/parsing.html#appropriate-end-tag-token), then switch to the
[data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state) and emit the current tag token. Otherwise, treat it as per the "anything
else" entry below.[ASCII upper alpha](https://infra.spec.whatwg.org/#ascii-upper-alpha)Append the lowercase version of the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) (add 0x0020 to the
character's code point) to the current tag token's tag name. Append the [current input\\
character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) to the [temporary buffer](https://html.spec.whatwg.org/multipage/parsing.html#temporary-buffer).[ASCII lower alpha](https://infra.spec.whatwg.org/#ascii-lower-alpha)Append the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) to the current tag token's tag name. Append
the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) to the [temporary\\
buffer](https://html.spec.whatwg.org/multipage/parsing.html#temporary-buffer).Anything elseEmit a U+003C LESS-THAN SIGN character token, a U+002F SOLIDUS character token, and a
character token for each of the characters in the [temporary\\
buffer](https://html.spec.whatwg.org/multipage/parsing.html#temporary-buffer) (in the order they were added to the buffer). [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the
[RCDATA state](https://html.spec.whatwg.org/multipage/parsing.html#rcdata-state).

##### 13.2.5.12RAWTEXT less-than sign state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

U+002F SOLIDUS (/)Set the [temporary buffer](https://html.spec.whatwg.org/multipage/parsing.html#temporary-buffer) to the empty string. Switch to
the [RAWTEXT end tag open state](https://html.spec.whatwg.org/multipage/parsing.html#rawtext-end-tag-open-state).Anything elseEmit a U+003C LESS-THAN SIGN character token. [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [RAWTEXT\\
state](https://html.spec.whatwg.org/multipage/parsing.html#rawtext-state).

##### 13.2.5.13RAWTEXT end tag open state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

[ASCII alpha](https://infra.spec.whatwg.org/#ascii-alpha)Create a new end tag token, set its tag name to the empty string. [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in
the [RAWTEXT end tag name state](https://html.spec.whatwg.org/multipage/parsing.html#rawtext-end-tag-name-state).

Anything elseEmit a U+003C LESS-THAN SIGN character token and a U+002F SOLIDUS character token.
[Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [RAWTEXT state](https://html.spec.whatwg.org/multipage/parsing.html#rawtext-state).

##### 13.2.5.14RAWTEXT end tag name state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

U+0009 CHARACTER TABULATION (tab)U+000A LINE FEED (LF)U+000C FORM FEED (FF)U+0020 SPACEIf the current end tag token is an [appropriate end tag token](https://html.spec.whatwg.org/multipage/parsing.html#appropriate-end-tag-token), then switch to the
[before attribute name state](https://html.spec.whatwg.org/multipage/parsing.html#before-attribute-name-state). Otherwise, treat it as per the "anything else" entry
below.U+002F SOLIDUS (/)If the current end tag token is an [appropriate end tag token](https://html.spec.whatwg.org/multipage/parsing.html#appropriate-end-tag-token), then switch to the
[self-closing start tag state](https://html.spec.whatwg.org/multipage/parsing.html#self-closing-start-tag-state). Otherwise, treat it as per the "anything else" entry
below.U+003E GREATER-THAN SIGN (>)If the current end tag token is an [appropriate end tag token](https://html.spec.whatwg.org/multipage/parsing.html#appropriate-end-tag-token), then switch to the
[data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state) and emit the current tag token. Otherwise, treat it as per the "anything
else" entry below.[ASCII upper alpha](https://infra.spec.whatwg.org/#ascii-upper-alpha)Append the lowercase version of the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) (add 0x0020 to the
character's code point) to the current tag token's tag name. Append the [current input\\
character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) to the [temporary buffer](https://html.spec.whatwg.org/multipage/parsing.html#temporary-buffer).[ASCII lower alpha](https://infra.spec.whatwg.org/#ascii-lower-alpha)Append the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) to the current tag token's tag name. Append
the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) to the [temporary\\
buffer](https://html.spec.whatwg.org/multipage/parsing.html#temporary-buffer).Anything elseEmit a U+003C LESS-THAN SIGN character token, a U+002F SOLIDUS character token, and a
character token for each of the characters in the [temporary\\
buffer](https://html.spec.whatwg.org/multipage/parsing.html#temporary-buffer) (in the order they were added to the buffer). [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the
[RAWTEXT state](https://html.spec.whatwg.org/multipage/parsing.html#rawtext-state).

##### 13.2.5.15Script data less-than sign state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

U+002F SOLIDUS (/)Set the [temporary buffer](https://html.spec.whatwg.org/multipage/parsing.html#temporary-buffer) to the empty string. Switch to
the [script data end tag open state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-end-tag-open-state).U+0021 EXCLAMATION MARK (!)Switch to the [script data escape start state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-escape-start-state). Emit a U+003C LESS-THAN SIGN
character token and a U+0021 EXCLAMATION MARK character token.Anything elseEmit a U+003C LESS-THAN SIGN character token. [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [script data\\
state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-state).

##### 13.2.5.16Script data end tag open state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

[ASCII alpha](https://infra.spec.whatwg.org/#ascii-alpha)Create a new end tag token, set its tag name to the empty string. [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in
the [script data end tag name state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-end-tag-name-state).

Anything elseEmit a U+003C LESS-THAN SIGN character token and a U+002F SOLIDUS character token.
[Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [script data state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-state).

##### 13.2.5.17Script data end tag name state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

U+0009 CHARACTER TABULATION (tab)U+000A LINE FEED (LF)U+000C FORM FEED (FF)U+0020 SPACEIf the current end tag token is an [appropriate end tag token](https://html.spec.whatwg.org/multipage/parsing.html#appropriate-end-tag-token), then switch to the
[before attribute name state](https://html.spec.whatwg.org/multipage/parsing.html#before-attribute-name-state). Otherwise, treat it as per the "anything else" entry
below.U+002F SOLIDUS (/)If the current end tag token is an [appropriate end tag token](https://html.spec.whatwg.org/multipage/parsing.html#appropriate-end-tag-token), then switch to the
[self-closing start tag state](https://html.spec.whatwg.org/multipage/parsing.html#self-closing-start-tag-state). Otherwise, treat it as per the "anything else" entry
below.U+003E GREATER-THAN SIGN (>)If the current end tag token is an [appropriate end tag token](https://html.spec.whatwg.org/multipage/parsing.html#appropriate-end-tag-token), then switch to the
[data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state) and emit the current tag token. Otherwise, treat it as per the "anything
else" entry below.[ASCII upper alpha](https://infra.spec.whatwg.org/#ascii-upper-alpha)Append the lowercase version of the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) (add 0x0020 to the
character's code point) to the current tag token's tag name. Append the [current input\\
character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) to the [temporary buffer](https://html.spec.whatwg.org/multipage/parsing.html#temporary-buffer).[ASCII lower alpha](https://infra.spec.whatwg.org/#ascii-lower-alpha)Append the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) to the current tag token's tag name. Append
the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) to the [temporary\\
buffer](https://html.spec.whatwg.org/multipage/parsing.html#temporary-buffer).Anything elseEmit a U+003C LESS-THAN SIGN character token, a U+002F SOLIDUS character token, and a
character token for each of the characters in the [temporary\\
buffer](https://html.spec.whatwg.org/multipage/parsing.html#temporary-buffer) (in the order they were added to the buffer). [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the
[script data state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-state).

##### 13.2.5.18Script data escape start state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

U+002D HYPHEN-MINUS (-)Switch to the [script data escape start dash state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-escape-start-dash-state). Emit a U+002D HYPHEN-MINUS
character token.Anything else[Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [script data state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-state).

##### 13.2.5.19Script data escape start dash state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

U+002D HYPHEN-MINUS (-)Switch to the [script data escaped dash dash state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-escaped-dash-dash-state). Emit a U+002D HYPHEN-MINUS
character token.Anything else[Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [script data state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-state).

##### 13.2.5.20Script data escaped state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

U+002D HYPHEN-MINUS (-)Switch to the [script data escaped dash state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-escaped-dash-state). Emit a U+002D HYPHEN-MINUS
character token.U+003C LESS-THAN SIGN (<)Switch to the [script data escaped less-than sign state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-escaped-less-than-sign-state).U+0000 NULLThis is an [unexpected-null-character](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-unexpected-null-character) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Emit a U+FFFD REPLACEMENT CHARACTER character token.EOFThis is an [eof-in-script-html-comment-like-text](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-script-html-comment-like-text) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Emit an end-of-file token.Anything elseEmit the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) as a character token.

##### 13.2.5.21Script data escaped dash state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

U+002D HYPHEN-MINUS (-)Switch to the [script data escaped dash dash state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-escaped-dash-dash-state). Emit a U+002D HYPHEN-MINUS
character token.U+003C LESS-THAN SIGN (<)Switch to the [script data escaped less-than sign state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-escaped-less-than-sign-state).U+0000 NULLThis is an [unexpected-null-character](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-unexpected-null-character) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Switch to the [script data escaped state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-escaped-state). Emit a U+FFFD REPLACEMENT
CHARACTER character token.EOFThis is an [eof-in-script-html-comment-like-text](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-script-html-comment-like-text) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Emit an end-of-file token.Anything elseSwitch to the [script data escaped state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-escaped-state). Emit the [current input\\
character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) as a character token.

##### 13.2.5.22Script data escaped dash dash state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

U+002D HYPHEN-MINUS (-)Emit a U+002D HYPHEN-MINUS character token.U+003C LESS-THAN SIGN (<)Switch to the [script data escaped less-than sign state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-escaped-less-than-sign-state).U+003E GREATER-THAN SIGN (>)Switch to the [script data state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-state). Emit a U+003E GREATER-THAN SIGN character
token.U+0000 NULLThis is an [unexpected-null-character](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-unexpected-null-character) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Switch to the [script data escaped state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-escaped-state). Emit a U+FFFD REPLACEMENT
CHARACTER character token.EOFThis is an [eof-in-script-html-comment-like-text](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-script-html-comment-like-text) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Emit an end-of-file token.Anything elseSwitch to the [script data escaped state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-escaped-state). Emit the [current input\\
character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) as a character token.

##### 13.2.5.23Script data escaped less-than sign state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

U+002F SOLIDUS (/)Set the [temporary buffer](https://html.spec.whatwg.org/multipage/parsing.html#temporary-buffer) to the empty string. Switch to
the [script data escaped end tag open state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-escaped-end-tag-open-state).[ASCII alpha](https://infra.spec.whatwg.org/#ascii-alpha)Set the [temporary buffer](https://html.spec.whatwg.org/multipage/parsing.html#temporary-buffer) to the empty string. Emit a
U+003C LESS-THAN SIGN character token. [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [script data double\\
escape start state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-double-escape-start-state).Anything elseEmit a U+003C LESS-THAN SIGN character token. [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [script data\\
escaped state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-escaped-state).

##### 13.2.5.24Script data escaped end tag open state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

[ASCII alpha](https://infra.spec.whatwg.org/#ascii-alpha)Create a new end tag token, set its tag name to the empty string. [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in
the [script data escaped end tag name state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-escaped-end-tag-name-state).Anything elseEmit a U+003C LESS-THAN SIGN character token and a U+002F SOLIDUS character token.
[Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [script data escaped state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-escaped-state).

##### 13.2.5.25Script data escaped end tag name state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

U+0009 CHARACTER TABULATION (tab)U+000A LINE FEED (LF)U+000C FORM FEED (FF)U+0020 SPACEIf the current end tag token is an [appropriate end tag token](https://html.spec.whatwg.org/multipage/parsing.html#appropriate-end-tag-token), then switch to the
[before attribute name state](https://html.spec.whatwg.org/multipage/parsing.html#before-attribute-name-state). Otherwise, treat it as per the "anything else" entry
below.U+002F SOLIDUS (/)If the current end tag token is an [appropriate end tag token](https://html.spec.whatwg.org/multipage/parsing.html#appropriate-end-tag-token), then switch to the
[self-closing start tag state](https://html.spec.whatwg.org/multipage/parsing.html#self-closing-start-tag-state). Otherwise, treat it as per the "anything else" entry
below.U+003E GREATER-THAN SIGN (>)If the current end tag token is an [appropriate end tag token](https://html.spec.whatwg.org/multipage/parsing.html#appropriate-end-tag-token), then switch to the
[data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state) and emit the current tag token. Otherwise, treat it as per the "anything
else" entry below.[ASCII upper alpha](https://infra.spec.whatwg.org/#ascii-upper-alpha)Append the lowercase version of the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) (add 0x0020 to the
character's code point) to the current tag token's tag name. Append the [current input\\
character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) to the [temporary buffer](https://html.spec.whatwg.org/multipage/parsing.html#temporary-buffer).[ASCII lower alpha](https://infra.spec.whatwg.org/#ascii-lower-alpha)Append the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) to the current tag token's tag name. Append
the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) to the [temporary\\
buffer](https://html.spec.whatwg.org/multipage/parsing.html#temporary-buffer).Anything elseEmit a U+003C LESS-THAN SIGN character token, a U+002F SOLIDUS character token, and a
character token for each of the characters in the [temporary buffer](https://html.spec.whatwg.org/multipage/parsing.html#temporary-buffer) (in the order they were added to the buffer). [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [script\\
data escaped state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-escaped-state).

##### 13.2.5.26Script data double escape start state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

U+0009 CHARACTER TABULATION (tab)U+000A LINE FEED (LF)U+000C FORM FEED (FF)U+0020 SPACEU+002F SOLIDUS (/)U+003E GREATER-THAN SIGN (>)If the [temporary buffer](https://html.spec.whatwg.org/multipage/parsing.html#temporary-buffer) is "`script`", then switch to the [script data double escaped state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-double-escaped-state).
Otherwise, switch to the [script data escaped state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-escaped-state). Emit the [current input\\
character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) as a character token.[ASCII upper alpha](https://infra.spec.whatwg.org/#ascii-upper-alpha)Append the lowercase version of the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) (add 0x0020 to the
character's code point) to the [temporary buffer](https://html.spec.whatwg.org/multipage/parsing.html#temporary-buffer). Emit the
[current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) as a character token.[ASCII lower alpha](https://infra.spec.whatwg.org/#ascii-lower-alpha)Append the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) to the [temporary buffer](https://html.spec.whatwg.org/multipage/parsing.html#temporary-buffer). Emit the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) as a character
token.Anything else[Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [script data escaped state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-escaped-state).

##### 13.2.5.27Script data double escaped state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

U+002D HYPHEN-MINUS (-)Switch to the [script data double escaped dash state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-double-escaped-dash-state). Emit a U+002D HYPHEN-MINUS
character token.U+003C LESS-THAN SIGN (<)Switch to the [script data double escaped less-than sign state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-double-escaped-less-than-sign-state). Emit a U+003C
LESS-THAN SIGN character token.U+0000 NULLThis is an [unexpected-null-character](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-unexpected-null-character) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Emit a U+FFFD REPLACEMENT CHARACTER character token.EOFThis is an [eof-in-script-html-comment-like-text](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-script-html-comment-like-text) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Emit an end-of-file token.Anything elseEmit the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) as a character token.

##### 13.2.5.28Script data double escaped dash state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

U+002D HYPHEN-MINUS (-)Switch to the [script data double escaped dash dash state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-double-escaped-dash-dash-state). Emit a U+002D
HYPHEN-MINUS character token.U+003C LESS-THAN SIGN (<)Switch to the [script data double escaped less-than sign state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-double-escaped-less-than-sign-state). Emit a U+003C
LESS-THAN SIGN character token.U+0000 NULLThis is an [unexpected-null-character](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-unexpected-null-character) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Switch to the [script data double escaped state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-double-escaped-state). Emit a U+FFFD
REPLACEMENT CHARACTER character token.EOFThis is an [eof-in-script-html-comment-like-text](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-script-html-comment-like-text) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Emit an end-of-file token.Anything elseSwitch to the [script data double escaped state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-double-escaped-state). Emit the [current input\\
character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) as a character token.

##### 13.2.5.29Script data double escaped dash dash state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

U+002D HYPHEN-MINUS (-)Emit a U+002D HYPHEN-MINUS character token.U+003C LESS-THAN SIGN (<)Switch to the [script data double escaped less-than sign state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-double-escaped-less-than-sign-state). Emit a U+003C
LESS-THAN SIGN character token.U+003E GREATER-THAN SIGN (>)Switch to the [script data state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-state). Emit a U+003E GREATER-THAN SIGN character
token.U+0000 NULLThis is an [unexpected-null-character](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-unexpected-null-character) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Switch to the [script data double escaped state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-double-escaped-state). Emit a U+FFFD
REPLACEMENT CHARACTER character token.EOFThis is an [eof-in-script-html-comment-like-text](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-script-html-comment-like-text) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Emit an end-of-file token.Anything elseSwitch to the [script data double escaped state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-double-escaped-state). Emit the [current input\\
character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) as a character token.

##### 13.2.5.30Script data double escaped less-than sign state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

U+002F SOLIDUS (/)Set the [temporary buffer](https://html.spec.whatwg.org/multipage/parsing.html#temporary-buffer) to the empty string. Switch to
the [script data double escape end state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-double-escape-end-state). Emit a U+002F SOLIDUS character token.Anything else[Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [script data double escaped state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-double-escaped-state).

##### 13.2.5.31Script data double escape end state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

U+0009 CHARACTER TABULATION (tab)U+000A LINE FEED (LF)U+000C FORM FEED (FF)U+0020 SPACEU+002F SOLIDUS (/)U+003E GREATER-THAN SIGN (>)If the [temporary buffer](https://html.spec.whatwg.org/multipage/parsing.html#temporary-buffer) is "`script`", then switch to the [script data escaped state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-escaped-state). Otherwise,
switch to the [script data double escaped state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-double-escaped-state). Emit the [current input\\
character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) as a character token.[ASCII upper alpha](https://infra.spec.whatwg.org/#ascii-upper-alpha)Append the lowercase version of the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) (add 0x0020 to the
character's code point) to the [temporary buffer](https://html.spec.whatwg.org/multipage/parsing.html#temporary-buffer). Emit the
[current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) as a character token.[ASCII lower alpha](https://infra.spec.whatwg.org/#ascii-lower-alpha)Append the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) to the [temporary buffer](https://html.spec.whatwg.org/multipage/parsing.html#temporary-buffer). Emit the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) as a character
token.Anything else[Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [script data double escaped state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-double-escaped-state).

##### 13.2.5.32Before attribute name state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

U+0009 CHARACTER TABULATION (tab)U+000A LINE FEED (LF)U+000C FORM FEED (FF)U+0020 SPACEIgnore the character.U+002F SOLIDUS (/)U+003E GREATER-THAN SIGN (>)EOF[Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [after attribute name state](https://html.spec.whatwg.org/multipage/parsing.html#after-attribute-name-state).U+003D EQUALS SIGN (=)This is an [unexpected-equals-sign-before-attribute-name](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-unexpected-equals-sign-before-attribute-name) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Start a new attribute in the current tag token. Set that attribute's
name to the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character), and its value to the empty string. Switch to
the [attribute name state](https://html.spec.whatwg.org/multipage/parsing.html#attribute-name-state).Anything elseStart a new attribute in the current tag token. Set that attribute name and value to the
empty string. [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [attribute name state](https://html.spec.whatwg.org/multipage/parsing.html#attribute-name-state).

##### 13.2.5.33Attribute name state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

U+0009 CHARACTER TABULATION (tab)U+000A LINE FEED (LF)U+000C FORM FEED (FF)U+0020 SPACEU+002F SOLIDUS (/)U+003E GREATER-THAN SIGN (>)EOF[Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [after attribute name state](https://html.spec.whatwg.org/multipage/parsing.html#after-attribute-name-state).U+003D EQUALS SIGN (=)Switch to the [before attribute value state](https://html.spec.whatwg.org/multipage/parsing.html#before-attribute-value-state).[ASCII upper alpha](https://infra.spec.whatwg.org/#ascii-upper-alpha)Append the lowercase version of the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) (add 0x0020 to the
character's code point) to the current attribute's name.U+0000 NULLThis is an [unexpected-null-character](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-unexpected-null-character) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Append a U+FFFD REPLACEMENT CHARACTER character to the current attribute's
name.U+0022 QUOTATION MARK (")U+0027 APOSTROPHE (')U+003C LESS-THAN SIGN (<)This is an [unexpected-character-in-attribute-name](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-unexpected-character-in-attribute-name) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Treat it as per the "anything else" entry below.Anything elseAppend the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) to the current attribute's name.

When the user agent leaves the attribute name state (and before emitting the tag token, if
appropriate), the complete attribute's name must be compared to the other attributes on the same
token; if there is already an attribute on the token with the exact same name, then this is a
[duplicate-attribute](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-duplicate-attribute) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors)
and the new attribute must be removed from the token.

If an attribute is so removed from a token, it, and the value that gets associated
with it, if any, are never subsequently used by the parser, and are therefore effectively
discarded. Removing the attribute in this way does not change its status as the "current
attribute" for the purposes of the tokenizer, however.

##### 13.2.5.34After attribute name state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

U+0009 CHARACTER TABULATION (tab)U+000A LINE FEED (LF)U+000C FORM FEED (FF)U+0020 SPACEIgnore the character.U+002F SOLIDUS (/)Switch to the [self-closing start tag state](https://html.spec.whatwg.org/multipage/parsing.html#self-closing-start-tag-state).U+003D EQUALS SIGN (=)Switch to the [before attribute value state](https://html.spec.whatwg.org/multipage/parsing.html#before-attribute-value-state).U+003E GREATER-THAN SIGN (>)Switch to the [data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state). Emit the current tag token.EOFThis is an [eof-in-tag](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-tag) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Emit an end-of-file token.Anything elseStart a new attribute in the current tag token. Set that attribute name and value to the
empty string. [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [attribute name state](https://html.spec.whatwg.org/multipage/parsing.html#attribute-name-state).

##### 13.2.5.35Before attribute value state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

U+0009 CHARACTER TABULATION (tab)U+000A LINE FEED (LF)U+000C FORM FEED (FF)U+0020 SPACEIgnore the character.U+0022 QUOTATION MARK (")Switch to the [attribute value (double-quoted) state](https://html.spec.whatwg.org/multipage/parsing.html#attribute-value-(double-quoted)-state).U+0027 APOSTROPHE (')Switch to the [attribute value (single-quoted) state](https://html.spec.whatwg.org/multipage/parsing.html#attribute-value-(single-quoted)-state).U+003E GREATER-THAN SIGN (>)This is a [missing-attribute-value](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-missing-attribute-value) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Switch to the [data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state). Emit the current tag token.Anything else[Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [attribute value (unquoted) state](https://html.spec.whatwg.org/multipage/parsing.html#attribute-value-(unquoted)-state).

##### 13.2.5.36Attribute value (double-quoted) state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

U+0022 QUOTATION MARK (")Switch to the [after attribute value (quoted) state](https://html.spec.whatwg.org/multipage/parsing.html#after-attribute-value-(quoted)-state).U+0026 AMPERSAND (&)Set the [return state](https://html.spec.whatwg.org/multipage/parsing.html#return-state) to the [attribute value\\
(double-quoted) state](https://html.spec.whatwg.org/multipage/parsing.html#attribute-value-(double-quoted)-state). Switch to the [character reference state](https://html.spec.whatwg.org/multipage/parsing.html#character-reference-state).U+0000 NULLThis is an [unexpected-null-character](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-unexpected-null-character) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Append a U+FFFD REPLACEMENT CHARACTER character to the current attribute's
value.EOFThis is an [eof-in-tag](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-tag) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).
Emit an end-of-file token.Anything elseAppend the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) to the current attribute's value.

##### 13.2.5.37Attribute value (single-quoted) state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

U+0027 APOSTROPHE (')Switch to the [after attribute value (quoted) state](https://html.spec.whatwg.org/multipage/parsing.html#after-attribute-value-(quoted)-state).U+0026 AMPERSAND (&)Set the [return state](https://html.spec.whatwg.org/multipage/parsing.html#return-state) to the [attribute value\\
(single-quoted) state](https://html.spec.whatwg.org/multipage/parsing.html#attribute-value-(single-quoted)-state). Switch to the [character reference state](https://html.spec.whatwg.org/multipage/parsing.html#character-reference-state).U+0000 NULLThis is an [unexpected-null-character](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-unexpected-null-character) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Append a U+FFFD REPLACEMENT CHARACTER character to the current attribute's
value.EOFThis is an [eof-in-tag](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-tag) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).
Emit an end-of-file token.Anything elseAppend the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) to the current attribute's value.

##### 13.2.5.38Attribute value (unquoted) state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

U+0009 CHARACTER TABULATION (tab)U+000A LINE FEED (LF)U+000C FORM FEED (FF)U+0020 SPACESwitch to the [before attribute name state](https://html.spec.whatwg.org/multipage/parsing.html#before-attribute-name-state).U+0026 AMPERSAND (&)Set the [return state](https://html.spec.whatwg.org/multipage/parsing.html#return-state) to the [attribute value\\
(unquoted) state](https://html.spec.whatwg.org/multipage/parsing.html#attribute-value-(unquoted)-state). Switch to the [character reference state](https://html.spec.whatwg.org/multipage/parsing.html#character-reference-state).U+003E GREATER-THAN SIGN (>)Switch to the [data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state). Emit the current tag token.U+0000 NULLThis is an [unexpected-null-character](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-unexpected-null-character) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Append a U+FFFD REPLACEMENT CHARACTER character to the current attribute's
value.U+0022 QUOTATION MARK (")U+0027 APOSTROPHE (')U+003C LESS-THAN SIGN (<)U+003D EQUALS SIGN (=)U+0060 GRAVE ACCENT (\`)This is an [unexpected-character-in-unquoted-attribute-value](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-unexpected-character-in-unquoted-attribute-value) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Treat it as per the "anything else" entry below.EOFThis is an [eof-in-tag](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-tag) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Emit an end-of-file token.Anything elseAppend the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) to the current attribute's value.

##### 13.2.5.39After attribute value (quoted) state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

U+0009 CHARACTER TABULATION (tab)U+000A LINE FEED (LF)U+000C FORM FEED (FF)U+0020 SPACESwitch to the [before attribute name state](https://html.spec.whatwg.org/multipage/parsing.html#before-attribute-name-state).U+002F SOLIDUS (/)Switch to the [self-closing start tag state](https://html.spec.whatwg.org/multipage/parsing.html#self-closing-start-tag-state).U+003E GREATER-THAN SIGN (>)Switch to the [data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state). Emit the current tag token.EOFThis is an [eof-in-tag](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-tag) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).
Emit an end-of-file token.Anything elseThis is a [missing-whitespace-between-attributes](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-missing-whitespace-between-attributes) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [before attribute name state](https://html.spec.whatwg.org/multipage/parsing.html#before-attribute-name-state).


##### 13.2.5.40Self-closing start tag state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

U+003E GREATER-THAN SIGN (>)Set the _[self-closing flag](https://html.spec.whatwg.org/multipage/parsing.html#self-closing-flag)_ of the current tag token. Switch
to the [data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state). Emit the current tag token.EOFThis is an [eof-in-tag](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-tag) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Emit an end-of-file token.Anything elseThis is an [unexpected-solidus-in-tag](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-unexpected-solidus-in-tag) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [before attribute name state](https://html.spec.whatwg.org/multipage/parsing.html#before-attribute-name-state).

##### 13.2.5.41Bogus comment state

Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):

U+003E GREATER-THAN SIGN (>)Switch to the [data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state). Emit the current comment token.EOFEmit the current comment token. Emit an end-of-file token.U+0000 NULLThis is an [unexpected-null-character](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-unexpected-null-character) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Append a U+FFFD REPLACEMENT CHARACTER character to the comment token's data.Anything elseAppend the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) to the comment token's data.

##### 13.2.5.42Markup declaration open state

If the next few characters are:

Two U+002D HYPHEN-MINUS characters (-)Consume those two characters, create a comment token whose data is the empty string, and
switch to the [comment start state](https://html.spec.whatwg.org/multipage/parsing.html#comment-start-state).[ASCII case-insensitive](https://infra.spec.whatwg.org/#ascii-case-insensitive) match for "`DOCTYPE`"Consume those characters and switch to the [DOCTYPE state](https://html.spec.whatwg.org/multipage/parsing.html#doctype-state)."`[CDATA[`"Consume those characters. If there is an [adjusted current node](https://html.spec.whatwg.org/multipage/parsing.html#adjusted-current-node) and it is not\
an element in the [HTML namespace](https://infra.spec.whatwg.org/#html-namespace), then switch to the [CDATA section\\
state](https://html.spec.whatwg.org/multipage/parsing.html#cdata-section-state). Otherwise, this is a [cdata-in-html-content](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-cdata-in-html-content) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Create a comment token whose data is "`[CDATA[`". Switch to\
the [bogus comment state](https://html.spec.whatwg.org/multipage/parsing.html#bogus-comment-state).Anything elseThis is an [incorrectly-opened-comment](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-incorrectly-opened-comment) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Create a comment token whose data is the empty string. Switch to the\
[bogus comment state](https://html.spec.whatwg.org/multipage/parsing.html#bogus-comment-state) (don't consume anything in the current state).\
\
##### 13.2.5.43Comment start state\
\
Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
U+002D HYPHEN-MINUS (-)Switch to the [comment start dash state](https://html.spec.whatwg.org/multipage/parsing.html#comment-start-dash-state).U+003E GREATER-THAN SIGN (>)This is an [abrupt-closing-of-empty-comment](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-abrupt-closing-of-empty-comment) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Switch to the [data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state). Emit the current comment token.Anything else[Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [comment state](https://html.spec.whatwg.org/multipage/parsing.html#comment-state).\
\
##### 13.2.5.44Comment start dash state\
\
Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
U+002D HYPHEN-MINUS (-)Switch to the [comment end state](https://html.spec.whatwg.org/multipage/parsing.html#comment-end-state).U+003E GREATER-THAN SIGN (>)This is an [abrupt-closing-of-empty-comment](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-abrupt-closing-of-empty-comment) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Switch to the [data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state). Emit the current comment token.EOFThis is an [eof-in-comment](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-comment) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Emit the current comment token. Emit an end-of-file token.Anything elseAppend a U+002D HYPHEN-MINUS character (-) to the comment token's data.\
[Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [comment state](https://html.spec.whatwg.org/multipage/parsing.html#comment-state).\
\
##### 13.2.5.45Comment state\
\
Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
U+003C LESS-THAN SIGN (<)Append the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) to the comment token's data. Switch to the\
[comment less-than sign state](https://html.spec.whatwg.org/multipage/parsing.html#comment-less-than-sign-state).U+002D HYPHEN-MINUS (-)Switch to the [comment end dash state](https://html.spec.whatwg.org/multipage/parsing.html#comment-end-dash-state).U+0000 NULLThis is an [unexpected-null-character](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-unexpected-null-character) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Append a U+FFFD REPLACEMENT CHARACTER character to the comment token's data.EOFThis is an [eof-in-comment](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-comment) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Emit the current comment token. Emit an end-of-file token.Anything elseAppend the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) to the comment token's data.\
\
##### 13.2.5.46Comment less-than sign state\
\
Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
U+0021 EXCLAMATION MARK (!)Append the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) to the comment token's data. Switch to the\
[comment less-than sign bang state](https://html.spec.whatwg.org/multipage/parsing.html#comment-less-than-sign-bang-state).U+003C LESS-THAN SIGN (<)Append the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) to the comment token's data.Anything else[Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [comment state](https://html.spec.whatwg.org/multipage/parsing.html#comment-state).\
\
##### 13.2.5.47Comment less-than sign bang state\
\
Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
U+002D HYPHEN-MINUS (-)Switch to the [comment less-than sign bang dash state](https://html.spec.whatwg.org/multipage/parsing.html#comment-less-than-sign-bang-dash-state).Anything else[Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [comment state](https://html.spec.whatwg.org/multipage/parsing.html#comment-state).\
\
##### 13.2.5.48Comment less-than sign bang dash state\
\
Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
U+002D HYPHEN-MINUS (-)Switch to the [comment less-than sign bang dash dash state](https://html.spec.whatwg.org/multipage/parsing.html#comment-less-than-sign-bang-dash-dash-state).Anything else[Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [comment end dash state](https://html.spec.whatwg.org/multipage/parsing.html#comment-end-dash-state).\
\
##### 13.2.5.49Comment less-than sign bang dash dash state\
\
Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
U+003E GREATER-THAN SIGN (>)EOF[Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [comment end state](https://html.spec.whatwg.org/multipage/parsing.html#comment-end-state).Anything elseThis is a [nested-comment](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-nested-comment) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [comment end state](https://html.spec.whatwg.org/multipage/parsing.html#comment-end-state).\
\
##### 13.2.5.50Comment end dash state\
\
Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
U+002D HYPHEN-MINUS (-)Switch to the [comment end state](https://html.spec.whatwg.org/multipage/parsing.html#comment-end-state).EOFThis is an [eof-in-comment](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-comment) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Emit the current comment token. Emit an end-of-file token.Anything elseAppend a U+002D HYPHEN-MINUS character (-) to the comment token's data.\
[Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [comment state](https://html.spec.whatwg.org/multipage/parsing.html#comment-state).\
\
##### 13.2.5.51Comment end state\
\
Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
U+003E GREATER-THAN SIGN (>)Switch to the [data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state). Emit the current comment token.U+0021 EXCLAMATION MARK (!)Switch to the [comment end bang state](https://html.spec.whatwg.org/multipage/parsing.html#comment-end-bang-state).U+002D HYPHEN-MINUS (-)Append a U+002D HYPHEN-MINUS character (-) to the comment token's data.EOFThis is an [eof-in-comment](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-comment) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Emit the current comment token. Emit an end-of-file token.Anything elseAppend two U+002D HYPHEN-MINUS characters (-) to the comment token's data.\
[Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [comment state](https://html.spec.whatwg.org/multipage/parsing.html#comment-state).\
\
##### 13.2.5.52Comment end bang state\
\
Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
U+002D HYPHEN-MINUS (-)Append two U+002D HYPHEN-MINUS characters (-) and a U+0021 EXCLAMATION MARK character (!) to\
the comment token's data. Switch to the [comment end dash state](https://html.spec.whatwg.org/multipage/parsing.html#comment-end-dash-state).U+003E GREATER-THAN SIGN (>)This is an [incorrectly-closed-comment](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-incorrectly-closed-comment) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Switch to the [data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state). Emit the current comment token.EOFThis is an [eof-in-comment](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-comment) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Emit the current comment token. Emit an end-of-file token.Anything elseAppend two U+002D HYPHEN-MINUS characters (-) and a U+0021 EXCLAMATION MARK character (!) to\
the comment token's data. [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [comment state](https://html.spec.whatwg.org/multipage/parsing.html#comment-state).\
\
##### 13.2.5.53DOCTYPE state\
\
Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
U+0009 CHARACTER TABULATION (tab)U+000A LINE FEED (LF)U+000C FORM FEED (FF)U+0020 SPACESwitch to the [before DOCTYPE name state](https://html.spec.whatwg.org/multipage/parsing.html#before-doctype-name-state).U+003E GREATER-THAN SIGN (>)[Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [before DOCTYPE name state](https://html.spec.whatwg.org/multipage/parsing.html#before-doctype-name-state).EOFThis is an [eof-in-doctype](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-doctype) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Create a new DOCTYPE token. Set its _[force-quirks\_\
_flag](https://html.spec.whatwg.org/multipage/parsing.html#force-quirks-flag)_ to _on_. Emit the current token. Emit an end-of-file token.Anything elseThis is a [missing-whitespace-before-doctype-name](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-missing-whitespace-before-doctype-name) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [before DOCTYPE name state](https://html.spec.whatwg.org/multipage/parsing.html#before-doctype-name-state).\
\
\
##### 13.2.5.54Before DOCTYPE name state\
\
Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
U+0009 CHARACTER TABULATION (tab)U+000A LINE FEED (LF)U+000C FORM FEED (FF)U+0020 SPACEIgnore the character.[ASCII upper alpha](https://infra.spec.whatwg.org/#ascii-upper-alpha)Create a new DOCTYPE token. Set the token's name to the lowercase version of the\
[current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) (add 0x0020 to the character's code point). Switch to the\
[DOCTYPE name state](https://html.spec.whatwg.org/multipage/parsing.html#doctype-name-state).U+0000 NULLThis is an [unexpected-null-character](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-unexpected-null-character) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Create a new DOCTYPE token. Set the token's name to a U+FFFD REPLACEMENT CHARACTER\
character. Switch to the [DOCTYPE name state](https://html.spec.whatwg.org/multipage/parsing.html#doctype-name-state).U+003E GREATER-THAN SIGN (>)This is a [missing-doctype-name](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-missing-doctype-name) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Create a new DOCTYPE token. Set its _[force-quirks flag](https://html.spec.whatwg.org/multipage/parsing.html#force-quirks-flag)_ to _on_. Switch to the [data\\
state](https://html.spec.whatwg.org/multipage/parsing.html#data-state). Emit the current token.EOFThis is an [eof-in-doctype](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-doctype) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Create a new DOCTYPE token. Set its _[force-quirks\_\
_flag](https://html.spec.whatwg.org/multipage/parsing.html#force-quirks-flag)_ to _on_. Emit the current token. Emit an end-of-file token.Anything elseCreate a new DOCTYPE token. Set the token's name to the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character).\
Switch to the [DOCTYPE name state](https://html.spec.whatwg.org/multipage/parsing.html#doctype-name-state).\
\
##### 13.2.5.55DOCTYPE name state\
\
Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
U+0009 CHARACTER TABULATION (tab)U+000A LINE FEED (LF)U+000C FORM FEED (FF)U+0020 SPACESwitch to the [after DOCTYPE name state](https://html.spec.whatwg.org/multipage/parsing.html#after-doctype-name-state).U+003E GREATER-THAN SIGN (>)Switch to the [data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state). Emit the current DOCTYPE token.[ASCII upper alpha](https://infra.spec.whatwg.org/#ascii-upper-alpha)Append the lowercase version of the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) (add 0x0020 to the\
character's code point) to the current DOCTYPE token's name.U+0000 NULLThis is an [unexpected-null-character](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-unexpected-null-character) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Append a U+FFFD REPLACEMENT CHARACTER character to the current DOCTYPE token's\
name.EOFThis is an [eof-in-doctype](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-doctype) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Set the current DOCTYPE token's _[force-quirks flag](https://html.spec.whatwg.org/multipage/parsing.html#force-quirks-flag)_ to\
_on_. Emit the current DOCTYPE token. Emit an end-of-file token.Anything elseAppend the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) to the current DOCTYPE token's name.\
\
##### 13.2.5.56After DOCTYPE name state\
\
Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
U+0009 CHARACTER TABULATION (tab)U+000A LINE FEED (LF)U+000C FORM FEED (FF)U+0020 SPACEIgnore the character.U+003E GREATER-THAN SIGN (>)Switch to the [data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state). Emit the current DOCTYPE token.EOFThis is an [eof-in-doctype](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-doctype) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Set the current DOCTYPE token's _[force-quirks flag](https://html.spec.whatwg.org/multipage/parsing.html#force-quirks-flag)_ to\
_on_. Emit the current DOCTYPE token. Emit an end-of-file token.Anything else\
\
If the six characters starting from the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) are an\
[ASCII case-insensitive](https://infra.spec.whatwg.org/#ascii-case-insensitive) match for "`PUBLIC`", then consume\
those characters and switch to the [after DOCTYPE public keyword state](https://html.spec.whatwg.org/multipage/parsing.html#after-doctype-public-keyword-state).\
\
Otherwise, if the six characters starting from the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) are\
an [ASCII case-insensitive](https://infra.spec.whatwg.org/#ascii-case-insensitive) match for "`SYSTEM`", then consume\
those characters and switch to the [after DOCTYPE system keyword state](https://html.spec.whatwg.org/multipage/parsing.html#after-doctype-system-keyword-state).\
\
Otherwise, this is an [invalid-character-sequence-after-doctype-name](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-invalid-character-sequence-after-doctype-name) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Set the current DOCTYPE token's _[force-quirks\_\
_flag](https://html.spec.whatwg.org/multipage/parsing.html#force-quirks-flag)_ to _on_. [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [bogus DOCTYPE state](https://html.spec.whatwg.org/multipage/parsing.html#bogus-doctype-state).\
\
##### 13.2.5.57After DOCTYPE public keyword state\
\
Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
U+0009 CHARACTER TABULATION (tab)U+000A LINE FEED (LF)U+000C FORM FEED (FF)U+0020 SPACESwitch to the [before DOCTYPE public identifier state](https://html.spec.whatwg.org/multipage/parsing.html#before-doctype-public-identifier-state).U+0022 QUOTATION MARK (")This is a [missing-whitespace-after-doctype-public-keyword](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-missing-whitespace-after-doctype-public-keyword) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Set the current DOCTYPE token's public identifier to the empty string (not\
missing), then switch to the [DOCTYPE public identifier (double-quoted) state](https://html.spec.whatwg.org/multipage/parsing.html#doctype-public-identifier-(double-quoted)-state).U+0027 APOSTROPHE (')This is a [missing-whitespace-after-doctype-public-keyword](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-missing-whitespace-after-doctype-public-keyword) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Set the current DOCTYPE token's public identifier to the empty string (not\
missing), then switch to the [DOCTYPE public identifier (single-quoted) state](https://html.spec.whatwg.org/multipage/parsing.html#doctype-public-identifier-(single-quoted)-state).U+003E GREATER-THAN SIGN (>)This is a [missing-doctype-public-identifier](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-missing-doctype-public-identifier) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Set the current DOCTYPE token's _[force-quirks flag](https://html.spec.whatwg.org/multipage/parsing.html#force-quirks-flag)_ to\
_on_. Switch to the [data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state). Emit the current DOCTYPE token.EOFThis is an [eof-in-doctype](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-doctype) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Set the current DOCTYPE token's _[force-quirks flag](https://html.spec.whatwg.org/multipage/parsing.html#force-quirks-flag)_ to\
_on_. Emit the current DOCTYPE token. Emit an end-of-file token.Anything elseThis is a [missing-quote-before-doctype-public-identifier](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-missing-quote-before-doctype-public-identifier) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Set the current DOCTYPE token's _[force-quirks\_\
_flag](https://html.spec.whatwg.org/multipage/parsing.html#force-quirks-flag)_ to _on_. [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [bogus DOCTYPE state](https://html.spec.whatwg.org/multipage/parsing.html#bogus-doctype-state).\
\
##### 13.2.5.58Before DOCTYPE public identifier state\
\
Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
U+0009 CHARACTER TABULATION (tab)U+000A LINE FEED (LF)U+000C FORM FEED (FF)U+0020 SPACEIgnore the character.U+0022 QUOTATION MARK (")Set the current DOCTYPE token's public identifier to the empty string (not missing), then switch to\
the [DOCTYPE public identifier (double-quoted) state](https://html.spec.whatwg.org/multipage/parsing.html#doctype-public-identifier-(double-quoted)-state).U+0027 APOSTROPHE (')Set the current DOCTYPE token's public identifier to the empty string (not missing), then switch to\
the [DOCTYPE public identifier (single-quoted) state](https://html.spec.whatwg.org/multipage/parsing.html#doctype-public-identifier-(single-quoted)-state).U+003E GREATER-THAN SIGN (>)This is a [missing-doctype-public-identifier](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-missing-doctype-public-identifier) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Set the current DOCTYPE token's _[force-quirks\_\
_flag](https://html.spec.whatwg.org/multipage/parsing.html#force-quirks-flag)_ to _on_. Switch to the [data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state). Emit the current DOCTYPE token.EOFThis is an [eof-in-doctype](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-doctype) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Set the current DOCTYPE token's _[force-quirks\_\
_flag](https://html.spec.whatwg.org/multipage/parsing.html#force-quirks-flag)_ to _on_. Emit the current DOCTYPE token. Emit an end-of-file token.Anything elseThis is a [missing-quote-before-doctype-public-identifier](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-missing-quote-before-doctype-public-identifier) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Set the current DOCTYPE token's _[force-quirks\_\
_flag](https://html.spec.whatwg.org/multipage/parsing.html#force-quirks-flag)_ to _on_. [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [bogus DOCTYPE state](https://html.spec.whatwg.org/multipage/parsing.html#bogus-doctype-state).\
\
##### 13.2.5.59DOCTYPE public identifier (double-quoted) state\
\
Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
U+0022 QUOTATION MARK (")Switch to the [after DOCTYPE public identifier state](https://html.spec.whatwg.org/multipage/parsing.html#after-doctype-public-identifier-state).U+0000 NULLThis is an [unexpected-null-character](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-unexpected-null-character) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Append a U+FFFD REPLACEMENT CHARACTER character to the current DOCTYPE token's\
public identifier.U+003E GREATER-THAN SIGN (>)This is an [abrupt-doctype-public-identifier](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-abrupt-doctype-public-identifier) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Set the current DOCTYPE token's _[force-quirks\_\
_flag](https://html.spec.whatwg.org/multipage/parsing.html#force-quirks-flag)_ to _on_. Switch to the [data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state). Emit the current DOCTYPE token.EOFThis is an [eof-in-doctype](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-doctype) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Set the current DOCTYPE token's _[force-quirks flag](https://html.spec.whatwg.org/multipage/parsing.html#force-quirks-flag)_ to\
_on_. Emit the current DOCTYPE token. Emit an end-of-file token.Anything elseAppend the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) to the current DOCTYPE token's public\
identifier.\
\
##### 13.2.5.60DOCTYPE public identifier (single-quoted) state\
\
Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
U+0027 APOSTROPHE (')Switch to the [after DOCTYPE public identifier state](https://html.spec.whatwg.org/multipage/parsing.html#after-doctype-public-identifier-state).U+0000 NULLThis is an [unexpected-null-character](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-unexpected-null-character) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Append a U+FFFD REPLACEMENT CHARACTER character to the current DOCTYPE token's\
public identifier.U+003E GREATER-THAN SIGN (>)This is an [abrupt-doctype-public-identifier](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-abrupt-doctype-public-identifier) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Set the current DOCTYPE token's _[force-quirks\_\
_flag](https://html.spec.whatwg.org/multipage/parsing.html#force-quirks-flag)_ to _on_. Switch to the [data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state). Emit the current DOCTYPE token.EOFThis is an [eof-in-doctype](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-doctype) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Set the current DOCTYPE token's _[force-quirks flag](https://html.spec.whatwg.org/multipage/parsing.html#force-quirks-flag)_ to\
_on_. Emit the current DOCTYPE token. Emit an end-of-file token.Anything elseAppend the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) to the current DOCTYPE token's public\
identifier.\
\
##### 13.2.5.61After DOCTYPE public identifier state\
\
Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
U+0009 CHARACTER TABULATION (tab)U+000A LINE FEED (LF)U+000C FORM FEED (FF)U+0020 SPACESwitch to the [between DOCTYPE public and system identifiers state](https://html.spec.whatwg.org/multipage/parsing.html#between-doctype-public-and-system-identifiers-state).U+003E GREATER-THAN SIGN (>)Switch to the [data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state). Emit the current DOCTYPE token.U+0022 QUOTATION MARK (")This is a [missing-whitespace-between-doctype-public-and-system-identifiers](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-missing-whitespace-between-doctype-public-and-system-identifiers) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Set the current DOCTYPE token's system identifier to the empty string (not\
missing), then switch to the [DOCTYPE system identifier (double-quoted) state](https://html.spec.whatwg.org/multipage/parsing.html#doctype-system-identifier-(double-quoted)-state).U+0027 APOSTROPHE (')This is a [missing-whitespace-between-doctype-public-and-system-identifiers](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-missing-whitespace-between-doctype-public-and-system-identifiers) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Set the current DOCTYPE token's system identifier to the empty string (not\
missing), then switch to the [DOCTYPE system identifier (single-quoted) state](https://html.spec.whatwg.org/multipage/parsing.html#doctype-system-identifier-(single-quoted)-state).EOFThis is an [eof-in-doctype](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-doctype) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Set the current DOCTYPE token's _[force-quirks flag](https://html.spec.whatwg.org/multipage/parsing.html#force-quirks-flag)_ to\
_on_. Emit the current DOCTYPE token. Emit an end-of-file token.Anything elseThis is a [missing-quote-before-doctype-system-identifier](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-missing-quote-before-doctype-system-identifier) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Set the current DOCTYPE token's _[force-quirks\_\
_flag](https://html.spec.whatwg.org/multipage/parsing.html#force-quirks-flag)_ to _on_. [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [bogus DOCTYPE state](https://html.spec.whatwg.org/multipage/parsing.html#bogus-doctype-state).\
\
##### 13.2.5.62Between DOCTYPE public and system identifiers state\
\
Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
U+0009 CHARACTER TABULATION (tab)U+000A LINE FEED (LF)U+000C FORM FEED (FF)U+0020 SPACEIgnore the character.U+003E GREATER-THAN SIGN (>)Switch to the [data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state). Emit the current DOCTYPE token.U+0022 QUOTATION MARK (")Set the current DOCTYPE token's system identifier to the empty string (not missing), then switch to\
the [DOCTYPE system identifier (double-quoted) state](https://html.spec.whatwg.org/multipage/parsing.html#doctype-system-identifier-(double-quoted)-state).U+0027 APOSTROPHE (')Set the current DOCTYPE token's system identifier to the empty string (not missing), then switch to\
the [DOCTYPE system identifier (single-quoted) state](https://html.spec.whatwg.org/multipage/parsing.html#doctype-system-identifier-(single-quoted)-state).EOFThis is an [eof-in-doctype](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-doctype) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Set the current DOCTYPE token's _[force-quirks flag](https://html.spec.whatwg.org/multipage/parsing.html#force-quirks-flag)_ to\
_on_. Emit the current DOCTYPE token. Emit an end-of-file token.Anything elseThis is a [missing-quote-before-doctype-system-identifier](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-missing-quote-before-doctype-system-identifier) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Set the current DOCTYPE token's _[force-quirks\_\
_flag](https://html.spec.whatwg.org/multipage/parsing.html#force-quirks-flag)_ to _on_. [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [bogus DOCTYPE state](https://html.spec.whatwg.org/multipage/parsing.html#bogus-doctype-state).\
\
##### 13.2.5.63After DOCTYPE system keyword state\
\
Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
U+0009 CHARACTER TABULATION (tab)U+000A LINE FEED (LF)U+000C FORM FEED (FF)U+0020 SPACESwitch to the [before DOCTYPE system identifier state](https://html.spec.whatwg.org/multipage/parsing.html#before-doctype-system-identifier-state).U+0022 QUOTATION MARK (")This is a [missing-whitespace-after-doctype-system-keyword](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-missing-whitespace-after-doctype-system-keyword) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Set the current DOCTYPE token's system identifier to the empty string (not\
missing), then switch to the [DOCTYPE system identifier (double-quoted) state](https://html.spec.whatwg.org/multipage/parsing.html#doctype-system-identifier-(double-quoted)-state).U+0027 APOSTROPHE (')This is a [missing-whitespace-after-doctype-system-keyword](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-missing-whitespace-after-doctype-system-keyword) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Set the current DOCTYPE token's system identifier to the empty string (not\
missing), then switch to the [DOCTYPE system identifier (single-quoted) state](https://html.spec.whatwg.org/multipage/parsing.html#doctype-system-identifier-(single-quoted)-state).U+003E GREATER-THAN SIGN (>)This is a [missing-doctype-system-identifier](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-missing-doctype-system-identifier) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Set the current DOCTYPE token's _[force-quirks\_\
_flag](https://html.spec.whatwg.org/multipage/parsing.html#force-quirks-flag)_ to _on_. Switch to the [data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state). Emit the current DOCTYPE token.EOFThis is an [eof-in-doctype](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-doctype) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Set the current DOCTYPE token's _[force-quirks flag](https://html.spec.whatwg.org/multipage/parsing.html#force-quirks-flag)_ to\
_on_. Emit the current DOCTYPE token. Emit an end-of-file token.Anything elseThis is a [missing-quote-before-doctype-system-identifier](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-missing-quote-before-doctype-system-identifier) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Set the current DOCTYPE token's _[force-quirks\_\
_flag](https://html.spec.whatwg.org/multipage/parsing.html#force-quirks-flag)_ to _on_. [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [bogus DOCTYPE state](https://html.spec.whatwg.org/multipage/parsing.html#bogus-doctype-state).\
\
##### 13.2.5.64Before DOCTYPE system identifier state\
\
Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
U+0009 CHARACTER TABULATION (tab)U+000A LINE FEED (LF)U+000C FORM FEED (FF)U+0020 SPACEIgnore the character.U+0022 QUOTATION MARK (")Set the current DOCTYPE token's system identifier to the empty string (not missing), then switch to\
the [DOCTYPE system identifier (double-quoted) state](https://html.spec.whatwg.org/multipage/parsing.html#doctype-system-identifier-(double-quoted)-state).U+0027 APOSTROPHE (')Set the current DOCTYPE token's system identifier to the empty string (not missing), then switch to\
the [DOCTYPE system identifier (single-quoted) state](https://html.spec.whatwg.org/multipage/parsing.html#doctype-system-identifier-(single-quoted)-state).U+003E GREATER-THAN SIGN (>)This is a [missing-doctype-system-identifier](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-missing-doctype-system-identifier) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Set the current DOCTYPE token's _[force-quirks flag](https://html.spec.whatwg.org/multipage/parsing.html#force-quirks-flag)_ to\
_on_. Switch to the [data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state). Emit the current DOCTYPE token.EOFThis is an [eof-in-doctype](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-doctype) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Set the current DOCTYPE token's _[force-quirks flag](https://html.spec.whatwg.org/multipage/parsing.html#force-quirks-flag)_ to\
_on_. Emit the current DOCTYPE token. Emit an end-of-file token.Anything elseThis is a [missing-quote-before-doctype-system-identifier](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-missing-quote-before-doctype-system-identifier) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Set the current DOCTYPE token's _[force-quirks\_\
_flag](https://html.spec.whatwg.org/multipage/parsing.html#force-quirks-flag)_ to _on_. [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [bogus DOCTYPE state](https://html.spec.whatwg.org/multipage/parsing.html#bogus-doctype-state).\
\
##### 13.2.5.65DOCTYPE system identifier (double-quoted) state\
\
Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
U+0022 QUOTATION MARK (")Switch to the [after DOCTYPE system identifier state](https://html.spec.whatwg.org/multipage/parsing.html#after-doctype-system-identifier-state).U+0000 NULLThis is an [unexpected-null-character](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-unexpected-null-character) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Append a U+FFFD REPLACEMENT CHARACTER character to the current DOCTYPE token's\
system identifier.U+003E GREATER-THAN SIGN (>)This is an [abrupt-doctype-system-identifier](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-abrupt-doctype-system-identifier) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Set the current DOCTYPE token's _[force-quirks\_\
_flag](https://html.spec.whatwg.org/multipage/parsing.html#force-quirks-flag)_ to _on_. Switch to the [data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state). Emit the current DOCTYPE token.EOFThis is an [eof-in-doctype](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-doctype) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Set the current DOCTYPE token's _[force-quirks flag](https://html.spec.whatwg.org/multipage/parsing.html#force-quirks-flag)_ to\
_on_. Emit the current DOCTYPE token. Emit an end-of-file token.Anything elseAppend the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) to the current DOCTYPE token's system\
identifier.\
\
##### 13.2.5.66DOCTYPE system identifier (single-quoted) state\
\
Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
U+0027 APOSTROPHE (')Switch to the [after DOCTYPE system identifier state](https://html.spec.whatwg.org/multipage/parsing.html#after-doctype-system-identifier-state).U+0000 NULLThis is an [unexpected-null-character](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-unexpected-null-character) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Append a U+FFFD REPLACEMENT CHARACTER character to the current DOCTYPE token's\
system identifier.U+003E GREATER-THAN SIGN (>)This is an [abrupt-doctype-system-identifier](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-abrupt-doctype-system-identifier) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Set the current DOCTYPE token's _[force-quirks\_\
_flag](https://html.spec.whatwg.org/multipage/parsing.html#force-quirks-flag)_ to _on_. Switch to the [data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state). Emit the current DOCTYPE token.EOFThis is an [eof-in-doctype](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-doctype) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Set the current DOCTYPE token's _[force-quirks flag](https://html.spec.whatwg.org/multipage/parsing.html#force-quirks-flag)_ to\
_on_. Emit the current DOCTYPE token. Emit an end-of-file token.Anything elseAppend the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) to the current DOCTYPE token's system\
identifier.\
\
##### 13.2.5.67After DOCTYPE system identifier state\
\
Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
U+0009 CHARACTER TABULATION (tab)U+000A LINE FEED (LF)U+000C FORM FEED (FF)U+0020 SPACEIgnore the character.U+003E GREATER-THAN SIGN (>)Switch to the [data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state). Emit the current DOCTYPE token.EOFThis is an [eof-in-doctype](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-doctype) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Set the current DOCTYPE token's _[force-quirks flag](https://html.spec.whatwg.org/multipage/parsing.html#force-quirks-flag)_ to\
_on_. Emit the current DOCTYPE token. Emit an end-of-file token.Anything elseThis is an [unexpected-character-after-doctype-system-identifier](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-unexpected-character-after-doctype-system-identifier) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [bogus DOCTYPE state](https://html.spec.whatwg.org/multipage/parsing.html#bogus-doctype-state). (This\
does _not_ set the current DOCTYPE token's _[force-quirks flag](https://html.spec.whatwg.org/multipage/parsing.html#force-quirks-flag)_ to\
_on_.)\
\
##### 13.2.5.68Bogus DOCTYPE state\
\
Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
U+003E GREATER-THAN SIGN (>)Switch to the [data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state). Emit the current DOCTYPE token.U+0000 NULLThis is an [unexpected-null-character](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-unexpected-null-character) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Ignore the character.EOFEmit the current DOCTYPE token. Emit an end-of-file token.Anything elseIgnore the character.\
\
##### 13.2.5.69CDATA section state\
\
Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
U+005D RIGHT SQUARE BRACKET (\])Switch to the [CDATA section bracket state](https://html.spec.whatwg.org/multipage/parsing.html#cdata-section-bracket-state).EOFThis is an [eof-in-cdata](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-cdata) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Emit an end-of-file token.Anything elseEmit the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) as a character token.\
\
U+0000 NULL characters are handled in the tree construction stage, as part of the\
rules for parsing tokens [in foreign\\
content](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inforeign), which is the only place where CDATA sections can appear.\
\
##### 13.2.5.70CDATA section bracket state\
\
Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
U+005D RIGHT SQUARE BRACKET (\])Switch to the [CDATA section end state](https://html.spec.whatwg.org/multipage/parsing.html#cdata-section-end-state).Anything elseEmit a U+005D RIGHT SQUARE BRACKET character token. [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the\
[CDATA section state](https://html.spec.whatwg.org/multipage/parsing.html#cdata-section-state).\
\
##### 13.2.5.71CDATA section end state\
\
Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
U+005D RIGHT SQUARE BRACKET (\])Emit a U+005D RIGHT SQUARE BRACKET character token.U+003E GREATER-THAN SIGN (>)Switch to the [data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state).Anything elseEmit two U+005D RIGHT SQUARE BRACKET character tokens. [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the\
[CDATA section state](https://html.spec.whatwg.org/multipage/parsing.html#cdata-section-state).\
\
##### 13.2.5.72Processing instruction open state\
\
Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
[ASCII alpha](https://infra.spec.whatwg.org/#ascii-alpha)U+005F LOW LINE (\_)[Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [processing instruction target state](https://html.spec.whatwg.org/multipage/parsing.html#processing-instruction-target-state).\
\
EOFThis is an [eof-in-processing-instruction](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-processing-instruction) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Emit an end-of-file token.Anything elseThis is an [invalid-first-character-of-processing-instruction-target](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-invalid-first-character-of-processing-instruction-target) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). [Convert the temporary buffer to a comment](https://html.spec.whatwg.org/multipage/parsing.html#convert-the-temporary-buffer-to-a-comment).\
[Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [bogus comment state](https://html.spec.whatwg.org/multipage/parsing.html#bogus-comment-state).\
\
##### 13.2.5.73Processing instruction target state\
\
Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
U+0009 CHARACTER TABULATION (tab)U+000A LINE FEED (LF)U+000C FORM FEED (FF)U+0020 SPACEU+003F QUESTION MARK (?)U+003E GREATER-THAN SIGN (>)\
\
Let target be the concatenation of the [code\\
points](https://infra.spec.whatwg.org/#code-point) in the [temporary buffer](https://html.spec.whatwg.org/multipage/parsing.html#temporary-buffer), in the order they\
were added to the buffer.\
\
If target is an [ASCII case-insensitive](https://infra.spec.whatwg.org/#ascii-case-insensitive) match for "`xml`" or "`xml-stylesheet`":\
\
1. This is a [disallowed-processing-instruction-target](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-disallowed-processing-instruction-target) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
2. [Convert the temporary buffer to a comment](https://html.spec.whatwg.org/multipage/parsing.html#convert-the-temporary-buffer-to-a-comment).\
\
3. [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [bogus comment state](https://html.spec.whatwg.org/multipage/parsing.html#bogus-comment-state).\
\
\
Otherwise:\
\
1. Create a processing instruction token whose target is target and data is the\
    empty string.\
\
2. [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [after processing instruction target\\
    state](https://html.spec.whatwg.org/multipage/parsing.html#after-processing-instruction-target-state).\
\
\
[ASCII alphanumeric](https://infra.spec.whatwg.org/#ascii-alphanumeric)U+002D HYPHEN-MINUS (-)U+005F LOW LINE (\_)Append the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) to the [temporary buffer](https://html.spec.whatwg.org/multipage/parsing.html#temporary-buffer).EOFThis is an [eof-in-processing-instruction](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-processing-instruction) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Emit an end-of-file token.Anything elseThis is an [invalid-processing-instruction-target](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-invalid-processing-instruction-target) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). [Convert the temporary buffer to a comment](https://html.spec.whatwg.org/multipage/parsing.html#convert-the-temporary-buffer-to-a-comment).\
[Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [bogus comment state](https://html.spec.whatwg.org/multipage/parsing.html#bogus-comment-state).\
\
##### 13.2.5.74After processing instruction target state\
\
Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
U+0009 CHARACTER TABULATION (tab)U+000A LINE FEED (LF)U+000C FORM FEED (FF)U+0020 SPACEIgnore the character.Anything else[Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [processing instruction data state](https://html.spec.whatwg.org/multipage/parsing.html#processing-instruction-data-state).\
\
##### 13.2.5.75Processing instruction data state\
\
Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
U+003F QUESTION MARK (?)Switch to the [processing instruction questionable state](https://html.spec.whatwg.org/multipage/parsing.html#processing-instruction-questionable-state).U+003E GREATER-THAN SIGN (>)Switch to the [data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state). Emit the current processing instruction token.EOFThis is an [eof-in-processing-instruction](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-processing-instruction) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Emit an end-of-file token.Anything elseAppend the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) to the current processing instruction token's data.\
\
##### 13.2.5.76Processing instruction questionable state\
\
Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
U+003E GREATER-THAN SIGN (>)Switch to the [data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state). Emit the current processing instruction token.EOFThis is an [eof-in-processing-instruction](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-processing-instruction) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Emit an end-of-file token.Anything elseAppend U+003F (?) to the current processing instruction token's data. [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume)\
in the [processing instruction data state](https://html.spec.whatwg.org/multipage/parsing.html#processing-instruction-data-state).\
\
##### 13.2.5.77Character reference state\
\
Set the [temporary buffer](https://html.spec.whatwg.org/multipage/parsing.html#temporary-buffer) to the empty string. Append\
a U+0026 AMPERSAND (&) character to the [temporary\\
buffer](https://html.spec.whatwg.org/multipage/parsing.html#temporary-buffer). Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
[ASCII alphanumeric](https://infra.spec.whatwg.org/#ascii-alphanumeric)[Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [named character reference state](https://html.spec.whatwg.org/multipage/parsing.html#named-character-reference-state).U+0023 NUMBER SIGN (#)Append the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) to the\
[temporary buffer](https://html.spec.whatwg.org/multipage/parsing.html#temporary-buffer). Switch to the [numeric character\\
reference state](https://html.spec.whatwg.org/multipage/parsing.html#numeric-character-reference-state).Anything else[Flush code points consumed as a character reference](https://html.spec.whatwg.org/multipage/parsing.html#flush-code-points-consumed-as-a-character-reference). [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in\
the [return state](https://html.spec.whatwg.org/multipage/parsing.html#return-state).\
\
##### 13.2.5.78Named character reference state\
\
Consume the maximum number of characters possible, where the consumed characters are one of the\
identifiers in the first column of the [named character references](https://html.spec.whatwg.org/multipage/named-characters.html#named-character-references) table. Append each\
character to the [temporary buffer](https://html.spec.whatwg.org/multipage/parsing.html#temporary-buffer) when it's consumed.\
\
If there is a match\
\
If the character reference was [consumed as part of an\\
attribute](https://html.spec.whatwg.org/multipage/parsing.html#charref-in-attribute), and the last character matched is not a U+003B SEMICOLON character (;), and\
the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character) is either a U+003D EQUALS SIGN character (=) or an\
[ASCII alphanumeric](https://infra.spec.whatwg.org/#ascii-alphanumeric), then, for historical reasons, [flush code points consumed\\
as a character reference](https://html.spec.whatwg.org/multipage/parsing.html#flush-code-points-consumed-as-a-character-reference) and switch to the [return state](https://html.spec.whatwg.org/multipage/parsing.html#return-state).\
\
\
Otherwise:\
\
1. If the last character matched is not a U+003B SEMICOLON character (;), then this is a\
    [missing-semicolon-after-character-reference](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-missing-semicolon-after-character-reference) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
2. Set the [temporary buffer](https://html.spec.whatwg.org/multipage/parsing.html#temporary-buffer) to the empty string.\
    Append one or two characters corresponding to the character reference name (as given by the\
    second column of the [named character references](https://html.spec.whatwg.org/multipage/named-characters.html#named-character-references) table) to the [temporary buffer](https://html.spec.whatwg.org/multipage/parsing.html#temporary-buffer).\
\
3. [Flush code points consumed as a character reference](https://html.spec.whatwg.org/multipage/parsing.html#flush-code-points-consumed-as-a-character-reference). Switch to the [return state](https://html.spec.whatwg.org/multipage/parsing.html#return-state).\
\
Otherwise[Flush code points consumed as a character reference](https://html.spec.whatwg.org/multipage/parsing.html#flush-code-points-consumed-as-a-character-reference). Switch to the\
[ambiguous ampersand state](https://html.spec.whatwg.org/multipage/parsing.html#ambiguous-ampersand-state).\
\
If the markup contains (not in an attribute) the string `I'm &notit; I\
    tell you`, the character reference is parsed as "not", as in, `I'm ¬it;\
    I tell you` (and this is a parse error). But if the markup was `I'm\
    &notin; I tell you`, the character reference would be parsed as "notin;", resulting\
in `I'm ∉ I tell you` (and no parse error).\
\
However, if the markup contains the string `I'm &notit; I tell you`\
in an attribute, no character reference is parsed and string remains intact (and there is no\
parse error).\
\
##### 13.2.5.79Ambiguous ampersand state\
\
Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
[ASCII alphanumeric](https://infra.spec.whatwg.org/#ascii-alphanumeric)If the character reference was [consumed as part of an\\
attribute](https://html.spec.whatwg.org/multipage/parsing.html#charref-in-attribute), then append the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) to the current\
attribute's value. Otherwise, emit the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) as a character\
token.U+003B SEMICOLON (;)This is an [unknown-named-character-reference](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-unknown-named-character-reference) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [return\\
state](https://html.spec.whatwg.org/multipage/parsing.html#return-state).\
\
Anything else[Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [return state](https://html.spec.whatwg.org/multipage/parsing.html#return-state).\
\
##### 13.2.5.80Numeric character reference state\
\
Set the character reference code to\
zero (0).\
\
Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
U+0078 LATIN SMALL LETTER XU+0058 LATIN CAPITAL LETTER XAppend the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) to the [temporary buffer](https://html.spec.whatwg.org/multipage/parsing.html#temporary-buffer). Switch to the [hexadecimal character reference start\\
state](https://html.spec.whatwg.org/multipage/parsing.html#hexadecimal-character-reference-start-state).[ASCII digit](https://infra.spec.whatwg.org/#ascii-digit)[Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [decimal character reference state](https://html.spec.whatwg.org/multipage/parsing.html#decimal-character-reference-state).Anything elseThis is an [absence-of-digits-in-numeric-character-reference](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-absence-of-digits-in-numeric-character-reference) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). [Flush code points consumed as a character reference](https://html.spec.whatwg.org/multipage/parsing.html#flush-code-points-consumed-as-a-character-reference).\
[Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [return state](https://html.spec.whatwg.org/multipage/parsing.html#return-state).\
\
##### 13.2.5.81Hexadecimal character reference start state\
\
Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
[ASCII hex digit](https://infra.spec.whatwg.org/#ascii-hex-digit)[Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [hexadecimal character reference state](https://html.spec.whatwg.org/multipage/parsing.html#hexadecimal-character-reference-state).Anything elseThis is an [absence-of-digits-in-numeric-character-reference](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-absence-of-digits-in-numeric-character-reference) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). [Flush code points consumed as a character reference](https://html.spec.whatwg.org/multipage/parsing.html#flush-code-points-consumed-as-a-character-reference).\
[Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [return state](https://html.spec.whatwg.org/multipage/parsing.html#return-state).\
\
##### 13.2.5.82Hexadecimal character reference state\
\
Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
[ASCII digit](https://infra.spec.whatwg.org/#ascii-digit)Multiply the [character reference code](https://html.spec.whatwg.org/multipage/parsing.html#character-reference-code) by 16.\
Add a numeric version of the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) (subtract 0x0030 from the\
character's code point) to the [character reference\\
code](https://html.spec.whatwg.org/multipage/parsing.html#character-reference-code).[ASCII upper hex digit](https://infra.spec.whatwg.org/#ascii-upper-hex-digit)Multiply the [character reference code](https://html.spec.whatwg.org/multipage/parsing.html#character-reference-code) by 16.\
Add a numeric version of the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) as a hexadecimal digit\
(subtract 0x0037 from the character's code point) to the [character reference code](https://html.spec.whatwg.org/multipage/parsing.html#character-reference-code).[ASCII lower hex digit](https://infra.spec.whatwg.org/#ascii-lower-hex-digit)Multiply the [character reference code](https://html.spec.whatwg.org/multipage/parsing.html#character-reference-code) by 16.\
Add a numeric version of the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) as a hexadecimal digit\
(subtract 0x0057 from the character's code point) to the [character reference code](https://html.spec.whatwg.org/multipage/parsing.html#character-reference-code).U+003B SEMICOLON (;)Switch to the [numeric character reference end state](https://html.spec.whatwg.org/multipage/parsing.html#numeric-character-reference-end-state).Anything elseThis is a [missing-semicolon-after-character-reference](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-missing-semicolon-after-character-reference) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [numeric character reference end\\
state](https://html.spec.whatwg.org/multipage/parsing.html#numeric-character-reference-end-state).\
\
##### 13.2.5.83Decimal character reference state\
\
Consume the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character):\
\
[ASCII digit](https://infra.spec.whatwg.org/#ascii-digit)Multiply the [character reference code](https://html.spec.whatwg.org/multipage/parsing.html#character-reference-code) by 10.\
Add a numeric version of the [current input character](https://html.spec.whatwg.org/multipage/parsing.html#current-input-character) (subtract 0x0030 from the\
character's code point) to the [character reference\\
code](https://html.spec.whatwg.org/multipage/parsing.html#character-reference-code).U+003B SEMICOLON (;)Switch to the [numeric character reference end state](https://html.spec.whatwg.org/multipage/parsing.html#numeric-character-reference-end-state).Anything elseThis is a [missing-semicolon-after-character-reference](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-missing-semicolon-after-character-reference) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). [Reconsume](https://html.spec.whatwg.org/multipage/parsing.html#reconsume) in the [numeric character reference end\\
state](https://html.spec.whatwg.org/multipage/parsing.html#numeric-character-reference-end-state).\
\
##### 13.2.5.84Numeric character reference end state\
\
Check the [character reference code](https://html.spec.whatwg.org/multipage/parsing.html#character-reference-code):\
\
- If the number is 0x00, then this is a [null-character-reference](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-null-character-reference) [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Set the [character reference code](https://html.spec.whatwg.org/multipage/parsing.html#character-reference-code) to\
0xFFFD.\
\
- If the number is greater than 0x10FFFF, then this is a [character-reference-outside-unicode-range](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-character-reference-outside-unicode-range) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Set the [character reference\\
code](https://html.spec.whatwg.org/multipage/parsing.html#character-reference-code) to 0xFFFD.\
\
- If the number is a [surrogate](https://infra.spec.whatwg.org/#surrogate), then this is a [surrogate-character-reference](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-surrogate-character-reference) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Set the [character reference\\
code](https://html.spec.whatwg.org/multipage/parsing.html#character-reference-code) to 0xFFFD.\
\
- If the number is a [noncharacter](https://infra.spec.whatwg.org/#noncharacter), then this is a\
[noncharacter-character-reference](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-noncharacter-character-reference) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
- If the number is 0x0D, or a\
[control](https://infra.spec.whatwg.org/#control) that's not [ASCII whitespace](https://infra.spec.whatwg.org/#ascii-whitespace), then this is a\
[control-character-reference](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-control-character-reference) [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). If the number is one of the numbers in the first column of the\
following table, then find the row with that number in the first column, and set the [character reference code](https://html.spec.whatwg.org/multipage/parsing.html#character-reference-code) to the number in the second\
column of that row.\
\
\
\
| Number | Code point |\
| --- | --- |\
| 0x80 | 0x20AC | EURO SIGN (€) |\
| 0x82 | 0x201A | SINGLE LOW-9 QUOTATION MARK (‚) |\
| 0x83 | 0x0192 | LATIN SMALL LETTER F WITH HOOK (ƒ) |\
| 0x84 | 0x201E | DOUBLE LOW-9 QUOTATION MARK („) |\
| 0x85 | 0x2026 | HORIZONTAL ELLIPSIS (…) |\
| 0x86 | 0x2020 | DAGGER (†) |\
| 0x87 | 0x2021 | DOUBLE DAGGER (‡) |\
| 0x88 | 0x02C6 | MODIFIER LETTER CIRCUMFLEX ACCENT (ˆ) |\
| 0x89 | 0x2030 | PER MILLE SIGN (‰) |\
| 0x8A | 0x0160 | LATIN CAPITAL LETTER S WITH CARON (Š) |\
| 0x8B | 0x2039 | SINGLE LEFT-POINTING ANGLE QUOTATION MARK (‹) |\
| 0x8C | 0x0152 | LATIN CAPITAL LIGATURE OE (Œ) |\
| 0x8E | 0x017D | LATIN CAPITAL LETTER Z WITH CARON (Ž) |\
| 0x91 | 0x2018 | LEFT SINGLE QUOTATION MARK (‘) |\
| 0x92 | 0x2019 | RIGHT SINGLE QUOTATION MARK (’) |\
| 0x93 | 0x201C | LEFT DOUBLE QUOTATION MARK (“) |\
| 0x94 | 0x201D | RIGHT DOUBLE QUOTATION MARK (”) |\
| 0x95 | 0x2022 | BULLET (•) |\
| 0x96 | 0x2013 | EN DASH (–) |\
| 0x97 | 0x2014 | EM DASH (—) |\
| 0x98 | 0x02DC | SMALL TILDE (˜) |\
| 0x99 | 0x2122 | TRADE MARK SIGN (™) |\
| 0x9A | 0x0161 | LATIN SMALL LETTER S WITH CARON (š) |\
| 0x9B | 0x203A | SINGLE RIGHT-POINTING ANGLE QUOTATION MARK (›) |\
| 0x9C | 0x0153 | LATIN SMALL LIGATURE OE (œ) |\
| 0x9E | 0x017E | LATIN SMALL LETTER Z WITH CARON (ž) |\
| 0x9F | 0x0178 | LATIN CAPITAL LETTER Y WITH DIAERESIS (Ÿ) |\
\
\
Set the [temporary buffer](https://html.spec.whatwg.org/multipage/parsing.html#temporary-buffer) to the empty string. Append a\
code point equal to the [character reference code](https://html.spec.whatwg.org/multipage/parsing.html#character-reference-code) to\
the [temporary buffer](https://html.spec.whatwg.org/multipage/parsing.html#temporary-buffer). [Flush code points consumed as a\\
character reference](https://html.spec.whatwg.org/multipage/parsing.html#flush-code-points-consumed-as-a-character-reference). Switch to the [return state](https://html.spec.whatwg.org/multipage/parsing.html#return-state).\
\
#### 13.2.6Tree construction\
\
The input to the tree construction stage is a sequence of tokens from the\
[tokenization](https://html.spec.whatwg.org/multipage/parsing.html#tokenization) stage. The tree construction stage is associated with a DOM\
`Document` object when a parser is created. The "output" of this stage consists of\
dynamically modifying or extending that document's DOM tree.\
\
This specification does not define when an interactive user agent has to render the\
`Document` so that it is available to the user, or when it has to begin accepting user\
input.\
\
* * *\
\
As each token is emitted from the tokenizer, the user agent must follow the appropriate steps\
from the following list, known as the tree construction dispatcher:\
\
If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) is emptyIf the [adjusted current node](https://html.spec.whatwg.org/multipage/parsing.html#adjusted-current-node) is an element in the [HTML namespace](https://infra.spec.whatwg.org/#html-namespace)If the [adjusted current node](https://html.spec.whatwg.org/multipage/parsing.html#adjusted-current-node) is a [MathML text integration point](https://html.spec.whatwg.org/multipage/parsing.html#mathml-text-integration-point) and the token is a start tag whose tag name is neither "mglyph" nor "malignmark"If the [adjusted current node](https://html.spec.whatwg.org/multipage/parsing.html#adjusted-current-node) is a [MathML text integration point](https://html.spec.whatwg.org/multipage/parsing.html#mathml-text-integration-point) and the token is a character tokenIf the [adjusted current node](https://html.spec.whatwg.org/multipage/parsing.html#adjusted-current-node) is a [MathML `annotation-xml`](https://w3c.github.io/mathml-core/#dfn-annotation-xml) element and the token is a start tag whose tag name is "svg"If the [adjusted current node](https://html.spec.whatwg.org/multipage/parsing.html#adjusted-current-node) is an [HTML integration point](https://html.spec.whatwg.org/multipage/parsing.html#html-integration-point) and the token is a start tagIf the [adjusted current node](https://html.spec.whatwg.org/multipage/parsing.html#adjusted-current-node) is an [HTML integration point](https://html.spec.whatwg.org/multipage/parsing.html#html-integration-point) and the token is a character tokenIf the token is an end-of-file tokenProcess the token according to the rules given in the section corresponding to the current\
[insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) in HTML content.OtherwiseProcess the token according to the rules given in the section for parsing tokens [in foreign content](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inforeign).\
\
The next token is the token that is about to be processed by the [tree\\
construction dispatcher](https://html.spec.whatwg.org/multipage/parsing.html#tree-construction-dispatcher) (even if the token is subsequently just ignored).\
\
A node is a MathML text integration point if it is one of the following\
elements:\
\
- A [MathML `mi`](https://w3c.github.io/mathml-core/#the-mi-element) element\
- A [MathML `mo`](https://w3c.github.io/mathml-core/#operator-fence-separator-or-accent-mo) element\
- A [MathML `mn`](https://w3c.github.io/mathml-core/#number-mn) element\
- A [MathML `ms`](https://w3c.github.io/mathml-core/#string-literal-ms) element\
- A [MathML `mtext`](https://w3c.github.io/mathml-core/#text-mtext) element\
\
A node is an HTML integration point if it is one of the following elements:\
\
- A [MathML `annotation-xml`](https://w3c.github.io/mathml-core/#dfn-annotation-xml) element whose start tag token had an\
attribute with the name "encoding" whose value was an [ASCII case-insensitive](https://infra.spec.whatwg.org/#ascii-case-insensitive) match\
for "`text/html`"\
- A [MathML `annotation-xml`](https://w3c.github.io/mathml-core/#dfn-annotation-xml) element whose start tag token had an\
attribute with the name "encoding" whose value was an [ASCII case-insensitive](https://infra.spec.whatwg.org/#ascii-case-insensitive) match\
for "`application/xhtml+xml`"\
- An [SVG `foreignObject`](https://w3c.github.io/svgwg/svg2-draft/embedded.html#elementdef-foreignObject) element\
- An [SVG `desc`](https://w3c.github.io/svgwg/svg2-draft/struct.html#elementdef-desc) element\
- An [SVG `title`](https://w3c.github.io/svgwg/svg2-draft/struct.html#elementdef-title) element\
\
If the node in question is the parser's [fragment context element](https://html.spec.whatwg.org/multipage/parsing.html#fragment-context-element),\
then the start tag token for that element is the "fake" token created by the [HTML fragment\\
parsing algorithm](https://html.spec.whatwg.org/multipage/parsing.html#html-fragment-parsing-algorithm).\
\
* * *\
\
Not all of the tag names mentioned below are conformant tag names in this\
specification; many are included to handle legacy content. They still form part of the algorithm\
that implementations are required to implement to claim conformance.\
\
The algorithm described below places no limit on the depth of the DOM tree\
generated, or on the length of tag names, attribute names, attribute values, `Text`\
nodes, etc. While implementers are encouraged to [avoid arbitrary limits](https://infra.spec.whatwg.org/#algorithm-limits), it is\
recognized that practical concerns will likely force user agents to impose nesting depth\
constraints.\
\
##### 13.2.6.1 Creating and inserting nodes\
\
An insertion location is a [tuple](https://infra.spec.whatwg.org/#tuple) consisting of a target parent (a `Node`) and a reference child (a `Node` or\
null).\
\
While the parser is processing a token, it can enable or disable foster parenting. This affects the following algorithm.\
\
To find the appropriate place for inserting a node, given an optional\
`Node`overrideTarget (default null), perform the following steps. They\
return an [insertion location](https://html.spec.whatwg.org/multipage/parsing.html#insertion-location).\
\
1. Let targetParent be overrideTarget if it is not null; otherwise the\
    [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node).\
\
2. Let referenceChild be null.\
\
3. If [foster parenting](https://html.spec.whatwg.org/multipage/parsing.html#foster-parent) is enabled and\
    targetParent is a `table`, `tbody`, `tfoot`,\
    `thead`, or `tr` element:\
\
Foster parenting happens when content is misnested in tables.\
\
\
1. Let lastTemplateOrTable be the last `template` or\
       `table` element in the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) if there is one;\
       otherwise null.\
\
2. If lastTemplateOrTable is null, then return (the first element in the\
       [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) (the `html` element), null).\
       ( [fragment case](https://html.spec.whatwg.org/multipage/parsing.html#fragment-case))\
\
3. If lastTemplateOrTable is a `template` element, then set\
       targetParent to lastTemplateOrTable.\
\
4. Otherwise, if lastTemplateOrTable's [parent](https://dom.spec.whatwg.org/#concept-tree-parent) is not null, then set\
       targetParent to lastTemplateOrTable's [parent](https://dom.spec.whatwg.org/#concept-tree-parent) and set\
       referenceChild to lastTemplateOrTable.\
\
5. Otherwise, set targetParent to the element immediately above\
       lastTemplateOrTable in the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
\
These steps are involved in part because it's possible for elements, the\
`table` element in this case in particular, to have been moved by a script around in\
the DOM, or indeed removed from the DOM entirely, after the element was inserted by the\
parser.\
\
4. If targetParent is not a `template` element, then return\
    (targetParent, referenceChild).\
\
5. Let patchInsertionTarget be targetParent's\
    [insertion target](https://html.spec.whatwg.org/multipage/scripting.html#insertion-target).\
\
6. If patchInsertionTarget is null, then return (targetParent's\
    [template contents](https://html.spec.whatwg.org/multipage/scripting.html#template-contents), null).\
\
7. If targetParent's [insertion end marker](https://html.spec.whatwg.org/multipage/scripting.html#insertion-end-marker) is not null and its\
    [parent](https://dom.spec.whatwg.org/#concept-tree-parent) is patchInsertionTarget, then return\
    (patchInsertionTarget, targetParent's\
    [insertion end marker](https://html.spec.whatwg.org/multipage/scripting.html#insertion-end-marker)).\
\
If the end marker has been removed or moved to another node, nodes are\
    instead appended to patchInsertionTarget in the following step.\
\
8. Return (patchInsertionTarget, null).\
\
\
* * *\
\
To create an element for a token, given a\
token token, a string namespace, and a `Node` object\
intendedParent:\
\
01. If the [active speculative HTML parser](https://html.spec.whatwg.org/multipage/parsing.html#active-speculative-html-parser) is not null, then return the result of\
     [creating a speculative mock element](https://html.spec.whatwg.org/multipage/parsing.html#create-a-speculative-mock-element)\
     given namespace, token's tag name, and token's\
     attributes.\
\
02. Otherwise, optionally [create a speculative mock element](https://html.spec.whatwg.org/multipage/parsing.html#create-a-speculative-mock-element) given\
     namespace, token's tag name, and token's attributes.\
\
    The result is not used. This step allows for a [speculative fetch](https://html.spec.whatwg.org/multipage/parsing.html#speculative-fetch) to\
     be initiated from non-speculative parsing. The fetch is still speculative at this point,\
     because, for example, by the time the element is inserted, intendedParent might have\
     been removed from the document.\
\
03. Let document be intendedParent's [node document](https://dom.spec.whatwg.org/#concept-node-document).\
\
04. Let localName be token's tag name.\
\
05. Let is be the value of the "`is`" attribute in\
     token, if such an attribute exists; otherwise null.\
\
06. Let registry be the result of [looking up a custom element registry](https://html.spec.whatwg.org/multipage/custom-elements.html#look-up-a-custom-element-registry) given intendedParent.\
\
07. Let definition be the result of [looking up a custom element definition](https://html.spec.whatwg.org/multipage/custom-elements.html#look-up-a-custom-element-definition) given registry,\
     namespace, localName, and is.\
\
08. Let willExecuteScript be true if definition is non-null and the\
     parser's [fragment context element](https://html.spec.whatwg.org/multipage/parsing.html#fragment-context-element) is null; otherwise false.\
\
09. If willExecuteScript is true:\
    1. Increment document's [throw-on-dynamic-markup-insertion\\
        counter](https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#throw-on-dynamic-markup-insertion-counter).\
\
    2. If the [JavaScript execution context stack](https://tc39.es/ecma262/#execution-context-stack) is empty, then [perform a\\
        microtask checkpoint](https://html.spec.whatwg.org/multipage/webappapis.html#perform-a-microtask-checkpoint).\
\
    3. Push a new [element queue](https://html.spec.whatwg.org/multipage/custom-elements.html#element-queue) onto document's [relevant\\
        agent](https://html.spec.whatwg.org/multipage/webappapis.html#relevant-agent)'s [custom element reactions stack](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-element-reactions-stack).\
10. Let element be the result of [creating an\\
     element](https://dom.spec.whatwg.org/#concept-create-element) given document, localName, namespace, null,\
     is, willExecuteScript, and registry.\
\
    This will cause [custom element\\
     constructors](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-element-constructor) to run, if willExecuteScript is true. However, since we\
     incremented the [throw-on-dynamic-markup-insertion counter](https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#throw-on-dynamic-markup-insertion-counter), this cannot cause [new characters to be inserted into the tokenizer](https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-document-write), or [the document to be blown away](https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-document-open).\
\
11. [Append](https://dom.spec.whatwg.org/#concept-element-attributes-append) each attribute in the given\
     token to element.\
\
    This can [enqueue a custom element callback reaction](https://html.spec.whatwg.org/multipage/custom-elements.html#enqueue-a-custom-element-callback-reaction) for the\
     `attributeChangedCallback`, which might run immediately (in the next\
     step).\
\
    Even though the `is` attribute governs the [creation](https://dom.spec.whatwg.org/#concept-create-element) of a [customized built-in element](https://html.spec.whatwg.org/multipage/custom-elements.html#customized-built-in-element), it is\
     not present during the execution of the relevant [custom element constructor](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-element-constructor); it is\
     appended in this step, along with all other attributes.\
\
12. If willExecuteScript is true:\
    1. Let queue be the result of popping from document's [relevant\\
        agent](https://html.spec.whatwg.org/multipage/webappapis.html#relevant-agent)'s [custom element reactions stack](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-element-reactions-stack). (This will be the same\
        [element queue](https://html.spec.whatwg.org/multipage/custom-elements.html#element-queue) as was pushed above.)\
\
    2. [Invoke custom element reactions](https://html.spec.whatwg.org/multipage/custom-elements.html#invoke-custom-element-reactions) in queue.\
\
    3. Decrement document's [throw-on-dynamic-markup-insertion\\
        counter](https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#throw-on-dynamic-markup-insertion-counter).\
13. If element has an `xmlns` attribute _in the [XMLNS\_\
    _namespace](https://infra.spec.whatwg.org/#xmlns-namespace)_ whose value is not exactly the same as the element's namespace, that is a\
     [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Similarly, if element has an `xmlns:xlink` attribute in the [XMLNS namespace](https://infra.spec.whatwg.org/#xmlns-namespace) whose value is not the\
     [XLink Namespace](https://infra.spec.whatwg.org/#xlink-namespace), that is a [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
14. If element is a [resettable element](https://html.spec.whatwg.org/multipage/forms.html#category-reset) and not\
     a [form-associated custom element](https://html.spec.whatwg.org/multipage/custom-elements.html#form-associated-custom-element), then invoke its [reset algorithm](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#concept-form-reset-control). (This initializes the element's [value](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#concept-fe-value) and [checkedness](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#concept-fe-checked)\
     based on the element's attributes.)\
\
15. If element is a [form-associated element](https://html.spec.whatwg.org/multipage/forms.html#form-associated-element) and not a\
     [form-associated custom element](https://html.spec.whatwg.org/multipage/custom-elements.html#form-associated-custom-element), the\
     [`form` element pointer](https://html.spec.whatwg.org/multipage/parsing.html#form-element-pointer) is not null, the parser is not\
     [parsing template contents](https://html.spec.whatwg.org/multipage/parsing.html#parsing-template-contents), the parser's [fragment context element](https://html.spec.whatwg.org/multipage/parsing.html#fragment-context-element) is\
     null, element is either not [listed](https://html.spec.whatwg.org/multipage/forms.html#category-listed) or doesn't\
     have a `form` attribute, and the intendedParent is\
     in the same [tree](https://dom.spec.whatwg.org/#concept-tree) as the element pointed to by the [`form` element pointer](https://html.spec.whatwg.org/multipage/parsing.html#form-element-pointer), then [associate](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#concept-form-association) element with the `form`\
     element pointed to by the [`form` element pointer](https://html.spec.whatwg.org/multipage/parsing.html#form-element-pointer) and set\
     element's [parser inserted flag](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#parser-inserted-flag).\
\
16. Return element.\
\
\
To compute the adjusted insertion location with an optional [insertion\\
location](https://html.spec.whatwg.org/multipage/parsing.html#insertion-location) insertionLocation (default null):\
\
1. Let overrideTarget be null if insertionLocation is null;\
    otherwise insertionLocation's [target parent](https://html.spec.whatwg.org/multipage/parsing.html#insertion-location-target-parent).\
\
2. Let adjustedInsertionLocation be the [appropriate place for inserting a\\
    node](https://html.spec.whatwg.org/multipage/parsing.html#appropriate-place-for-inserting-a-node) given overrideTarget.\
\
3. If adjustedInsertionLocation's [target parent](https://html.spec.whatwg.org/multipage/parsing.html#insertion-location-target-parent) is the first element in the\
    [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) and the parser's [root insertion target](https://html.spec.whatwg.org/multipage/parsing.html#root-insertion-target) is\
    non-null, then set adjustedInsertionLocation to (the parser's [root insertion\\
    target](https://html.spec.whatwg.org/multipage/parsing.html#root-insertion-target), null).\
\
4. Return adjustedInsertionLocation.\
\
\
* * *\
\
To insert an element at the adjusted insertion location with an element\
element and an optional [insertion location](https://html.spec.whatwg.org/multipage/parsing.html#insertion-location) insertionLocation\
(default null):\
\
1. Let (targetParent, referenceChild) be the [adjusted insertion\\
    location](https://html.spec.whatwg.org/multipage/parsing.html#adjusted-insertion-location) given insertionLocation.\
\
2. If any of the following are true:\
\
\
   - element's [parent](https://dom.spec.whatwg.org/#concept-tree-parent) is non-null;\
   - element is a [host-including inclusive ancestor](https://dom.spec.whatwg.org/#concept-tree-host-including-inclusive-ancestor) of\
      targetParent; or\
   - targetParent is a `Document` node that already has an element\
      child,\
\
then return.\
\
3. [Assert](https://infra.spec.whatwg.org/#assert): [ensure pre-insert validity](https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity) given element,\
    targetParent, referenceChild, and « » does not throw.\
\
4. If the parser's [fragment context element](https://html.spec.whatwg.org/multipage/parsing.html#fragment-context-element) is null, then push a new\
    [element queue](https://html.spec.whatwg.org/multipage/custom-elements.html#element-queue) onto element's [relevant agent](https://html.spec.whatwg.org/multipage/webappapis.html#relevant-agent)'s [custom\\
    element reactions stack](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-element-reactions-stack).\
\
5. [Insert](https://dom.spec.whatwg.org/#concept-node-insert) element into\
    targetParent before referenceChild.\
\
6. If the parser's [fragment context element](https://html.spec.whatwg.org/multipage/parsing.html#fragment-context-element) is null, then pop the [element\\
    queue](https://html.spec.whatwg.org/multipage/custom-elements.html#element-queue) from element's [relevant agent](https://html.spec.whatwg.org/multipage/webappapis.html#relevant-agent)'s [custom element\\
    reactions stack](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-element-reactions-stack), and [invoke custom element reactions](https://html.spec.whatwg.org/multipage/custom-elements.html#invoke-custom-element-reactions) in that queue.\
\
\
To insert a foreign element, given a token token, a string\
namespace, and a boolean onlyAddToElementStack:\
\
1. Let adjustedInsertionLocation be the [appropriate place for inserting a\\
    node](https://html.spec.whatwg.org/multipage/parsing.html#appropriate-place-for-inserting-a-node).\
\
2. Let element be the result of [creating an element for the token](https://html.spec.whatwg.org/multipage/parsing.html#create-an-element-for-the-token) given token, namespace,\
    and adjustedInsertionLocation's [target parent](https://html.spec.whatwg.org/multipage/parsing.html#insertion-location-target-parent).\
\
3. If onlyAddToElementStack is false, then run [insert an element at the\\
    adjusted insertion location](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-element-at-the-adjusted-insertion-location) with element.\
\
4. Push element onto the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) so that it is the new\
    [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node).\
\
5. Return element.\
\
\
To insert an HTML element given a token token: [insert a foreign\\
element](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-foreign-element) given token, the [HTML namespace](https://infra.spec.whatwg.org/#html-namespace), and false.\
\
* * *\
\
When the steps below require the user agent to adjust MathML attributes for a token,\
then, if the token has an attribute named `definitionurl`, change its name to\
`definitionURL` (note the case difference).\
\
When the steps below require the user agent to adjust SVG attributes for a token,\
then, for each attribute on the token whose attribute name is one of the ones in the first column\
of the following table, change the attribute's name to the name given in the corresponding cell in\
the second column. (This fixes the case of SVG attributes that are not all lowercase.)\
\
| Attribute name on token | Attribute name on element |\
| --- | --- |\
| `attributename` | `attributeName` |\
| `attributetype` | `attributeType` |\
| `basefrequency` | `baseFrequency` |\
| `baseprofile` | `baseProfile` |\
| `calcmode` | `calcMode` |\
| `clippathunits` | `clipPathUnits` |\
| `diffuseconstant` | `diffuseConstant` |\
| `edgemode` | `edgeMode` |\
| `filterunits` | `filterUnits` |\
| `glyphref` | `glyphRef` |\
| `gradienttransform` | `gradientTransform` |\
| `gradientunits` | `gradientUnits` |\
| `kernelmatrix` | `kernelMatrix` |\
| `kernelunitlength` | `kernelUnitLength` |\
| `keypoints` | `keyPoints` |\
| `keysplines` | `keySplines` |\
| `keytimes` | `keyTimes` |\
| `lengthadjust` | `lengthAdjust` |\
| `limitingconeangle` | `limitingConeAngle` |\
| `markerheight` | `markerHeight` |\
| `markerunits` | `markerUnits` |\
| `markerwidth` | `markerWidth` |\
| `maskcontentunits` | `maskContentUnits` |\
| `maskunits` | `maskUnits` |\
| `numoctaves` | `numOctaves` |\
| `pathlength` | `pathLength` |\
| `patterncontentunits` | `patternContentUnits` |\
| `patterntransform` | `patternTransform` |\
| `patternunits` | `patternUnits` |\
| `pointsatx` | `pointsAtX` |\
| `pointsaty` | `pointsAtY` |\
| `pointsatz` | `pointsAtZ` |\
| `preservealpha` | `preserveAlpha` |\
| `preserveaspectratio` | `preserveAspectRatio` |\
| `primitiveunits` | `primitiveUnits` |\
| `refx` | `refX` |\
| `refy` | `refY` |\
| `repeatcount` | `repeatCount` |\
| `repeatdur` | `repeatDur` |\
| `requiredextensions` | `requiredExtensions` |\
| `requiredfeatures` | `requiredFeatures` |\
| `specularconstant` | `specularConstant` |\
| `specularexponent` | `specularExponent` |\
| `spreadmethod` | `spreadMethod` |\
| `startoffset` | `startOffset` |\
| `stddeviation` | `stdDeviation` |\
| `stitchtiles` | `stitchTiles` |\
| `surfacescale` | `surfaceScale` |\
| `systemlanguage` | `systemLanguage` |\
| `tablevalues` | `tableValues` |\
| `targetx` | `targetX` |\
| `targety` | `targetY` |\
| `textlength` | `textLength` |\
| `viewbox` | `viewBox` |\
| `viewtarget` | `viewTarget` |\
| `xchannelselector` | `xChannelSelector` |\
| `ychannelselector` | `yChannelSelector` |\
| `zoomandpan` | `zoomAndPan` |\
\
When the steps below require the user agent to adjust foreign attributes for a\
token, then, if any of the attributes on the token match the strings given in the first column of\
the following table, let the attribute be a namespaced attribute, with the prefix being the string\
given in the corresponding cell in the second column, the local name being the string given in the\
corresponding cell in the third column, and the namespace being the namespace given in the\
corresponding cell in the fourth column. (This fixes the use of namespaced attributes, in\
particular [`lang` attributes in the XML\\
namespace](https://www.w3.org/TR/xml/#sec-lang-tag).)\
\
| Attribute name | Prefix | Local name | Namespace |\
| --- | --- | --- | --- |\
| `xlink:actuate` | `xlink` | `actuate` | [XLink namespace](https://infra.spec.whatwg.org/#xlink-namespace) |\
| `xlink:arcrole` | `xlink` | `arcrole` | [XLink namespace](https://infra.spec.whatwg.org/#xlink-namespace) |\
| `xlink:href` | `xlink` | `href` | [XLink namespace](https://infra.spec.whatwg.org/#xlink-namespace) |\
| `xlink:role` | `xlink` | `role` | [XLink namespace](https://infra.spec.whatwg.org/#xlink-namespace) |\
| `xlink:show` | `xlink` | `show` | [XLink namespace](https://infra.spec.whatwg.org/#xlink-namespace) |\
| `xlink:title` | `xlink` | `title` | [XLink namespace](https://infra.spec.whatwg.org/#xlink-namespace) |\
| `xlink:type` | `xlink` | `type` | [XLink namespace](https://infra.spec.whatwg.org/#xlink-namespace) |\
| `xml:lang` | `xml` | `lang` | [XML namespace](https://infra.spec.whatwg.org/#xml-namespace) |\
| `xml:space` | `xml` | `space` | [XML namespace](https://infra.spec.whatwg.org/#xml-namespace) |\
| `xmlns` | (none) | `xmlns` | [XMLNS namespace](https://infra.spec.whatwg.org/#xmlns-namespace) |\
| `xmlns:xlink` | `xmlns` | `xlink` | [XMLNS namespace](https://infra.spec.whatwg.org/#xmlns-namespace) |\
\
* * *\
\
When the steps below require the user agent to insert a character while processing a\
token, the user agent must run the following steps:\
\
1. Let data be the characters passed to the algorithm, or, if no characters were\
    explicitly specified, the character of the character token being processed.\
\
2. Let (targetParent, referenceChild) be the [adjusted insertion\\
    location](https://html.spec.whatwg.org/multipage/parsing.html#adjusted-insertion-location).\
\
3. If targetParent is a `Document` node, then return.\
\
The DOM will not let `Document` nodes have `Text` node\
    children, so they are dropped on the floor.\
\
4. Let previousSibling be referenceChild's [previous\\
    sibling](https://dom.spec.whatwg.org/#concept-tree-previous-sibling) if referenceChild is non-null; otherwise targetParent's\
    [last child](https://dom.spec.whatwg.org/#concept-tree-last-child).\
\
5. If previousSibling is a `Text` node, then append data to\
    previousSibling's [data](https://dom.spec.whatwg.org/#concept-cd-data).\
\
Otherwise, let text be the result of [creating a\\
    text node](https://dom.spec.whatwg.org/#create-a-text-node) given targetParent's [node document](https://dom.spec.whatwg.org/#concept-node-document) and data,\
    and [insert](https://dom.spec.whatwg.org/#concept-node-insert) text into\
    targetParent before referenceChild.\
\
\
Here are some sample inputs to the parser and the corresponding number of `Text`\
nodes that they result in, assuming a user agent that executes scripts.\
\
| Input | Number of `Text` nodes |\
| --- | --- |\
| ```<br>A<script><br>var script = document.getElementsByTagName('script')[0];<br>document.body.removeChild(script);<br></script>B<br>``` | One `Text` node in the document, containing "AB". |\
| ```<br>A<script><br>var text = document.createTextNode('B');<br>document.body.appendChild(text);<br></script>C<br>``` | Three `Text` nodes; "A" before the script, the script's contents, and "BC" after the script (the parser appends to the `Text` node created by the script). |\
| ```<br>A<script><br>var text = document.getElementsByTagName('script')[0].firstChild;<br>text.data = 'B';<br>document.body.appendChild(text);<br></script>C<br>``` | Two adjacent `Text` nodes in the document, containing "A" and "BC". |\
| ```<br>A<table>B<tr>C</tr>D</table><br>``` | One `Text` node before the table, containing "ABCD". (This is caused by [foster parenting](https://html.spec.whatwg.org/multipage/parsing.html#foster-parent).) |\
| ```<br>A<table><tr> B</tr> C</table><br>``` | One `Text` node before the table, containing "A B C" (A-space-B-space-C). (This is caused by [foster parenting](https://html.spec.whatwg.org/multipage/parsing.html#foster-parent).) |\
| ```<br>A<table><tr> B</tr> </em>C</table><br>``` | One `Text` node before the table, containing "A BC" (A-space-B-C), and one `Text` node inside the table (as a child of a `tbody`) with a single space character. (Space characters separated from non-space characters by non-character tokens are not affected by [foster parenting](https://html.spec.whatwg.org/multipage/parsing.html#foster-parent), even if those other tokens then get ignored.) |\
\
* * *\
\
When the steps below require the user agent to insert a comment while processing a\
comment token, with an optional [insertion location](https://html.spec.whatwg.org/multipage/parsing.html#insertion-location) insertionLocation\
(default null), the user agent must run the following steps:\
\
1. Let data be the data given in the comment token being\
    processed.\
\
2. Let (targetParent, referenceChild) be the [adjusted insertion\\
    location](https://html.spec.whatwg.org/multipage/parsing.html#adjusted-insertion-location) given insertionLocation.\
\
3. Let comment be the result of [creating a\\
    comment node](https://dom.spec.whatwg.org/#create-a-comment-node) given targetParent's [node document](https://dom.spec.whatwg.org/#concept-node-document) and\
    data.\
\
4. [Insert](https://dom.spec.whatwg.org/#concept-node-insert) comment into\
    targetParent before referenceChild.\
\
\
When the steps below require the user agent to insert a processing instruction while\
processing a processing instruction token, with an optional [insertion location](https://html.spec.whatwg.org/multipage/parsing.html#insertion-location) insertionLocation (default null), the user agent must run the following steps:\
\
1. Let piTarget be the target given in the processing instruction token being\
    processed.\
\
2. Let data be the data given in the processing instruction token being\
    processed.\
\
3. Let (targetParent, referenceChild) be the [adjusted insertion\\
    location](https://html.spec.whatwg.org/multipage/parsing.html#adjusted-insertion-location) given insertionLocation.\
\
4. Let pi be the result of [creating a processing instruction node](https://dom.spec.whatwg.org/#create-a-processing-instruction-node) given targetParent's [node\\
    document](https://dom.spec.whatwg.org/#concept-node-document), piTarget, and data.\
\
5. [Insert](https://dom.spec.whatwg.org/#concept-node-insert) pi into\
    targetParent before referenceChild.\
\
\
##### 13.2.6.2 Parsing elements that contain only text\
\
The generic raw text element parsing algorithm and the generic RCDATA element\
parsing algorithm consist of the following steps. These algorithms are always invoked in\
response to a start tag token.\
\
1. [Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token.\
\
2. If the algorithm that was invoked is the [generic raw text element parsing\\
    algorithm](https://html.spec.whatwg.org/multipage/parsing.html#generic-raw-text-element-parsing-algorithm), switch the tokenizer to the [RAWTEXT state](https://html.spec.whatwg.org/multipage/parsing.html#rawtext-state); otherwise the algorithm\
    invoked was the [generic RCDATA element parsing algorithm](https://html.spec.whatwg.org/multipage/parsing.html#generic-rcdata-element-parsing-algorithm), switch the tokenizer to\
    the [RCDATA state](https://html.spec.whatwg.org/multipage/parsing.html#rcdata-state).\
\
3. Set the [original insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#original-insertion-mode) to the current [insertion\\
    mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode).\
\
4. Then, switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [text](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-incdata)".\
\
\
##### 13.2.6.3 Closing elements that have implied end tags\
\
When the steps below require the UA to generate implied end tags, then, while the\
[current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) is a `dd` element, a `dt` element, an\
`li` element, an `optgroup` element, an `option` element, a\
`p` element, an `rb` element, an `rp` element, an `rt`\
element, or an `rtc` element, the UA must pop the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) off the\
[stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
If a step requires the UA to generate implied end tags but lists an element to exclude from the\
process, then the UA must perform the above steps as if that element was not in the above\
list.\
\
When the steps below require the UA to generate all implied end tags thoroughly,\
then, while the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) is a `caption` element, a\
`colgroup` element, a `dd` element, a `dt` element, an\
`li` element, an `optgroup` element, an `option` element, a\
`p` element, an `rb` element, an `rp` element, an `rt`\
element, an `rtc` element, a `tbody` element, a `td` element, a\
`tfoot` element, a `th` element, a `thead` element, or a\
`tr` element, the UA must pop the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) off the\
[stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
##### 13.2.6.4 The rules for parsing tokens in HTML content\
\
###### 13.2.6.4.1 The "initial" insertion mode\
\
A `Document` object has an associated parser cannot change the mode flag\
(a boolean). It is initially false.\
\
When the user agent is to apply the rules for the " [initial](https://html.spec.whatwg.org/multipage/parsing.html#the-initial-insertion-mode)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode), the user agent must handle the token as\
follows:\
\
A character token that is one of U+0009 CHARACTER\
TABULATION, U+000A LINE FEED (LF), U+000C FORM FEED (FF),\
U+000D CARRIAGE RETURN (CR), or U+0020 SPACE\
\
Ignore the token.\
\
A comment token\
\
[Insert a comment](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-comment) given (the `Document` object, null).\
\
A processing instruction token\
\
[Insert a processing instruction](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-processing-instruction) given (the `Document` object,\
null).\
\
A DOCTYPE token\
\
If the DOCTYPE token's name is not "`html`", or the token's public\
identifier is not missing, or the token's system identifier is neither missing nor\
"`about:legacy-compat`", then there is a [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
Let doctype be the result of [creating a\\
doctype](https://dom.spec.whatwg.org/#create-a-doctype) given the `Document` node, the name given in the DOCTYPE token (or the\
empty string if the name was missing), the public identifier given in the DOCTYPE token (or the\
empty string if the public identifier was missing), and the system identifier given in the\
DOCTYPE token (or the empty string if the system identifier was missing). Then, if the\
`Document` node has neither a `DocumentType` child nor an element child,\
append doctype to the `Document` node.\
\
This also ensures that the `DocumentType` node is returned as the\
value of the `doctype` attribute of the\
`Document` object.\
\
Then, if the document is _not_ [an `iframe``srcdoc` document](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#an-iframe-srcdoc-document), and the [parser cannot\\
change the mode flag](https://html.spec.whatwg.org/multipage/parsing.html#parser-cannot-change-the-mode-flag) is false, and the DOCTYPE token matches one of the conditions in the\
following list, then set the `Document` to [quirks mode](https://dom.spec.whatwg.org/#concept-document-quirks):\
\
- The _[force-quirks flag](https://html.spec.whatwg.org/multipage/parsing.html#force-quirks-flag)_ is set to _on_.\
- The name is not "`html`".\
- The public identifier is set to: "`-//W3O//DTD W3 HTML Strict 3.0//EN//`"\
- The public identifier is set to: "`-/W3C/DTD HTML 4.0 Transitional/EN`"\
- The public identifier is set to: "`HTML`"\
- The system identifier is set to: "`http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd`"\
- The public identifier starts with: "`+//Silmaril//dtd html Pro v0r11 19970101//`"\
- The public identifier starts with: "`-//AS//DTD HTML 3.0 asWedit + extensions//`"\
- The public identifier starts with: "`-//AdvaSoft Ltd//DTD HTML 3.0 asWedit + extensions//`"\
- The public identifier starts with: "`-//IETF//DTD HTML 2.0 Level 1//`"\
- The public identifier starts with: "`-//IETF//DTD HTML 2.0 Level 2//`"\
- The public identifier starts with: "`-//IETF//DTD HTML 2.0 Strict Level 1//`"\
- The public identifier starts with: "`-//IETF//DTD HTML 2.0 Strict Level 2//`"\
- The public identifier starts with: "`-//IETF//DTD HTML 2.0 Strict//`"\
- The public identifier starts with: "`-//IETF//DTD HTML 2.0//`"\
- The public identifier starts with: "`-//IETF//DTD HTML 2.1E//`"\
- The public identifier starts with: "`-//IETF//DTD HTML 3.0//`"\
- The public identifier starts with: "`-//IETF//DTD HTML 3.2 Final//`"\
- The public identifier starts with: "`-//IETF//DTD HTML 3.2//`"\
- The public identifier starts with: "`-//IETF//DTD HTML 3//`"\
- The public identifier starts with: "`-//IETF//DTD HTML Level 0//`"\
- The public identifier starts with: "`-//IETF//DTD HTML Level 1//`"\
- The public identifier starts with: "`-//IETF//DTD HTML Level 2//`"\
- The public identifier starts with: "`-//IETF//DTD HTML Level 3//`"\
- The public identifier starts with: "`-//IETF//DTD HTML Strict Level 0//`"\
- The public identifier starts with: "`-//IETF//DTD HTML Strict Level 1//`"\
- The public identifier starts with: "`-//IETF//DTD HTML Strict Level 2//`"\
- The public identifier starts with: "`-//IETF//DTD HTML Strict Level 3//`"\
- The public identifier starts with: "`-//IETF//DTD HTML Strict//`"\
- The public identifier starts with: "`-//IETF//DTD HTML//`"\
- The public identifier starts with: "`-//Metrius//DTD Metrius Presentational//`"\
- The public identifier starts with: "`-//Microsoft//DTD Internet Explorer 2.0 HTML Strict//`"\
- The public identifier starts with: "`-//Microsoft//DTD Internet Explorer 2.0 HTML//`"\
- The public identifier starts with: "`-//Microsoft//DTD Internet Explorer 2.0 Tables//`"\
- The public identifier starts with: "`-//Microsoft//DTD Internet Explorer 3.0 HTML Strict//`"\
- The public identifier starts with: "`-//Microsoft//DTD Internet Explorer 3.0 HTML//`"\
- The public identifier starts with: "`-//Microsoft//DTD Internet Explorer 3.0 Tables//`"\
- The public identifier starts with: "`-//Netscape Comm. Corp.//DTD HTML//`"\
- The public identifier starts with: "`-//Netscape Comm. Corp.//DTD Strict HTML//`"\
- The public identifier starts with: "`-//O'Reilly and Associates//DTD HTML 2.0//`"\
- The public identifier starts with: "`-//O'Reilly and Associates//DTD HTML Extended 1.0//`"\
- The public identifier starts with: "`-//O'Reilly and Associates//DTD HTML Extended Relaxed 1.0//`"\
- The public identifier starts with: "`-//SQ//DTD HTML 2.0 HoTMetaL + extensions//`"\
- The public identifier starts with: "`-//SoftQuad Software//DTD HoTMetaL PRO 6.0::19990601::extensions to HTML 4.0//`"\
- The public identifier starts with: "`-//SoftQuad//DTD HoTMetaL PRO 4.0::19971010::extensions to HTML 4.0//`"\
- The public identifier starts with: "`-//Spyglass//DTD HTML 2.0 Extended//`"\
- The public identifier starts with: "`-//Sun Microsystems Corp.//DTD HotJava HTML//`"\
- The public identifier starts with: "`-//Sun Microsystems Corp.//DTD HotJava Strict HTML//`"\
- The public identifier starts with: "`-//W3C//DTD HTML 3 1995-03-24//`"\
- The public identifier starts with: "`-//W3C//DTD HTML 3.2 Draft//`"\
- The public identifier starts with: "`-//W3C//DTD HTML 3.2 Final//`"\
- The public identifier starts with: "`-//W3C//DTD HTML 3.2//`"\
- The public identifier starts with: "`-//W3C//DTD HTML 3.2S Draft//`"\
- The public identifier starts with: "`-//W3C//DTD HTML 4.0 Frameset//`"\
- The public identifier starts with: "`-//W3C//DTD HTML 4.0 Transitional//`"\
- The public identifier starts with: "`-//W3C//DTD HTML Experimental 19960712//`"\
- The public identifier starts with: "`-//W3C//DTD HTML Experimental 970421//`"\
- The public identifier starts with: "`-//W3C//DTD W3 HTML//`"\
- The public identifier starts with: "`-//W3O//DTD W3 HTML 3.0//`"\
- The public identifier starts with: "`-//WebTechs//DTD Mozilla HTML 2.0//`"\
- The public identifier starts with: "`-//WebTechs//DTD Mozilla HTML//`"\
- The system identifier is missing or the empty string, and the public identifier starts with: "`-//W3C//DTD HTML 4.01 Frameset//`"\
- The system identifier is missing or the empty string, and the public identifier starts with: "`-//W3C//DTD HTML 4.01 Transitional//`"\
\
Otherwise, if the document is _not_ [an `iframe``srcdoc` document](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#an-iframe-srcdoc-document), and the [parser cannot change\\
the mode flag](https://html.spec.whatwg.org/multipage/parsing.html#parser-cannot-change-the-mode-flag) is false, and the DOCTYPE token matches one of the conditions in the\
following list, then set the `Document` to [limited-quirks mode](https://dom.spec.whatwg.org/#concept-document-limited-quirks):\
\
- The public identifier starts with: "`-//W3C//DTD XHTML 1.0 Frameset//`"\
- The public identifier starts with: "`-//W3C//DTD XHTML 1.0 Transitional//`"\
- The system identifier is neither missing nor the empty string, and the public identifier starts with: "`-//W3C//DTD HTML 4.01 Frameset//`"\
- The system identifier is neither missing nor the empty string, and the public identifier starts with: "`-//W3C//DTD HTML 4.01 Transitional//`"\
\
The system identifier and public identifier strings must be compared to the values given in\
the lists above in an [ASCII case-insensitive](https://infra.spec.whatwg.org/#ascii-case-insensitive) manner. A system identifier whose\
value is the empty string is not considered missing for the purposes of the conditions\
above.\
\
Then, switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [before html](https://html.spec.whatwg.org/multipage/parsing.html#the-before-html-insertion-mode)".\
\
Anything else\
\
If the document is _not_ [an `iframe``srcdoc` document](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#an-iframe-srcdoc-document), then this is a [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors); if the [parser cannot change the mode flag](https://html.spec.whatwg.org/multipage/parsing.html#parser-cannot-change-the-mode-flag) is false, set the\
`Document` to [quirks mode](https://dom.spec.whatwg.org/#concept-document-quirks).\
\
In any case, switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [before html](https://html.spec.whatwg.org/multipage/parsing.html#the-before-html-insertion-mode)", then reprocess the token.\
\
###### 13.2.6.4.2 The "before html" insertion mode\
\
When the user agent is to apply the rules for the " [before html](https://html.spec.whatwg.org/multipage/parsing.html#the-before-html-insertion-mode)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode), the user agent must handle the token as\
follows:\
\
A DOCTYPE token\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Ignore the token.\
\
A comment token\
\
[Insert a comment](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-comment) given (the `Document` object, null).\
\
A processing instruction token\
\
[Insert a processing instruction](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-processing-instruction) given (the `Document` object,\
null).\
\
A character token that is one of U+0009 CHARACTER TABULATION, U+000A LINE FEED (LF), U+000C\
FORM FEED (FF), U+000D CARRIAGE RETURN (CR), or U+0020 SPACE\
\
Ignore the token.\
\
A start tag whose tag name is "html"\
\
[Create an element for the token](https://html.spec.whatwg.org/multipage/parsing.html#create-an-element-for-the-token) in the [HTML namespace](https://infra.spec.whatwg.org/#html-namespace), with the\
`Document` as the intended parent. [Insert an element at the adjusted insertion\\
location](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-element-at-the-adjusted-insertion-location) with that element and (the `Document`, null). Put this element in the\
[stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [before\\
head](https://html.spec.whatwg.org/multipage/parsing.html#the-before-head-insertion-mode)".\
\
An end tag whose tag name is one of: "head", "body", "html", "br"\
\
Act as described in the "anything else" entry below.\
\
Any other end tag\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Ignore the token.\
\
Anything else\
\
Create an `html` element whose [node document](https://dom.spec.whatwg.org/#concept-node-document) is the `Document` object. Append\
it to the `Document` object. Put this element in the [stack of open\\
elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [before\\
head](https://html.spec.whatwg.org/multipage/parsing.html#the-before-head-insertion-mode)", then reprocess the token.\
\
The [document element](https://dom.spec.whatwg.org/#document-element) can end up being removed from the `Document`\
object, e.g. by scripts; nothing in particular happens in such cases, content continues being\
appended to the nodes as described in the next section.\
\
###### 13.2.6.4.3 The "before head" insertion mode\
\
When the user agent is to apply the rules for the " [before head](https://html.spec.whatwg.org/multipage/parsing.html#the-before-head-insertion-mode)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode), the user agent must handle the token as\
follows:\
\
A character token that is one of U+0009 CHARACTER\
TABULATION, U+000A LINE FEED (LF), U+000C FORM FEED (FF),\
U+000D CARRIAGE RETURN (CR), or U+0020 SPACE\
\
Ignore the token.\
\
A comment token\
\
[Insert a comment](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-comment).\
\
A processing instruction token\
\
[Insert a processing instruction](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-processing-instruction).\
\
A DOCTYPE token\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Ignore the token.\
\
A start tag whose tag name is "html"\
\
Process the token [using the rules for](https://html.spec.whatwg.org/multipage/parsing.html#using-the-rules-for) the " [in body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inbody)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode).\
\
A start tag whose tag name is "head"\
\
[Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token.\
\
Set the [`head` element pointer](https://html.spec.whatwg.org/multipage/parsing.html#head-element-pointer) to the newly created\
`head` element.\
\
Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in\\
head](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inhead)".\
\
An end tag whose tag name is one of: "head", "body", "html", "br"\
\
Act as described in the "anything else" entry below.\
\
Any other end tag\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Ignore the token.\
\
Anything else\
\
[Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for a "head" start tag token with no attributes.\
\
Set the [`head` element pointer](https://html.spec.whatwg.org/multipage/parsing.html#head-element-pointer) to the newly created\
`head` element.\
\
Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in\\
head](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inhead)".\
\
Reprocess the current token.\
\
###### 13.2.6.4.4 The "in head" insertion mode\
\
When the user agent is to apply the rules for the " [in\\
head](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inhead)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode), the user agent must handle the token as follows:\
\
A character token that is one of U+0009 CHARACTER\
TABULATION, U+000A LINE FEED (LF), U+000C FORM FEED (FF),\
U+000D CARRIAGE RETURN (CR), or U+0020 SPACE\
\
[Insert the character](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-character).\
\
A comment token\
\
[Insert a comment](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-comment).\
\
A processing instruction token\
\
[Insert a processing instruction](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-processing-instruction).\
\
A DOCTYPE token\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Ignore the token.\
\
A start tag whose tag name is "html"\
\
Process the token [using the rules for](https://html.spec.whatwg.org/multipage/parsing.html#using-the-rules-for) the " [in body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inbody)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode).\
\
A start tag whose tag name is one of: "base", "basefont",\
"bgsound", "link"\
\
[Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token. Immediately pop the [current\\
node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) off the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
[Acknowledge the token's _self-closing_\\
_flag_](https://html.spec.whatwg.org/multipage/parsing.html#acknowledge-self-closing-flag), if it is set.\
\
A start tag whose tag name is "meta"\
\
[Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token. Immediately pop the [current\\
node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) off the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
[Acknowledge the token's _self-closing_\\
_flag_](https://html.spec.whatwg.org/multipage/parsing.html#acknowledge-self-closing-flag), if it is set.\
\
If the [active speculative HTML parser](https://html.spec.whatwg.org/multipage/parsing.html#active-speculative-html-parser) is null:\
\
1. If the element has a `charset` attribute, and [getting an encoding](https://encoding.spec.whatwg.org/#concept-encoding-get) from\
    its value results in an [encoding](https://encoding.spec.whatwg.org/#encoding), and the\
    [confidence](https://html.spec.whatwg.org/multipage/parsing.html#concept-encoding-confidence) is currently _tentative_,\
    then [change the encoding](https://html.spec.whatwg.org/multipage/parsing.html#change-the-encoding) to the resulting encoding.\
\
2. Otherwise, if the element has an `http-equiv`\
    attribute whose value is an [ASCII case-insensitive](https://infra.spec.whatwg.org/#ascii-case-insensitive) match for "`Content-Type`", and the element has a `content` attribute, and applying the [algorithm for\\
    extracting a character encoding from a `meta` element](https://html.spec.whatwg.org/multipage/urls-and-fetching.html#algorithm-for-extracting-a-character-encoding-from-a-meta-element) to that attribute's\
    value returns an [encoding](https://encoding.spec.whatwg.org/#encoding), and the\
    [confidence](https://html.spec.whatwg.org/multipage/parsing.html#concept-encoding-confidence) is currently _tentative_,\
    then [change the encoding](https://html.spec.whatwg.org/multipage/parsing.html#change-the-encoding) to the extracted encoding.\
\
\
The [speculative HTML parser](https://html.spec.whatwg.org/multipage/parsing.html#speculative-html-parser) doesn't speculatively apply character\
encoding declarations in order to reduce implementation complexity.\
\
A start tag whose tag name is "title"\
\
Follow the [generic RCDATA element parsing algorithm](https://html.spec.whatwg.org/multipage/parsing.html#generic-rcdata-element-parsing-algorithm).\
\
A start tag whose tag name is "noscript", if [scripting mode](https://html.spec.whatwg.org/multipage/parsing.html#scripting-mode) is not [Disabled](https://html.spec.whatwg.org/multipage/parsing.html#scripting-mode-disabled)A start tag whose tag name is one of: "noframes", "style"\
\
Follow the [generic raw text element parsing algorithm](https://html.spec.whatwg.org/multipage/parsing.html#generic-raw-text-element-parsing-algorithm).\
\
A start tag whose tag name is "noscript", if [scripting mode](https://html.spec.whatwg.org/multipage/parsing.html#scripting-mode) is [Disabled](https://html.spec.whatwg.org/multipage/parsing.html#scripting-mode-disabled)\
\
[Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token.\
\
Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in\\
head noscript](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inheadnoscript)".\
\
A start tag whose tag name is "script"\
\
Run these steps:\
\
01. Let adjustedInsertionLocation be the [appropriate place for\\
     inserting a node](https://html.spec.whatwg.org/multipage/parsing.html#appropriate-place-for-inserting-a-node).\
\
02. [Create an element for the token](https://html.spec.whatwg.org/multipage/parsing.html#create-an-element-for-the-token) in the [HTML namespace](https://infra.spec.whatwg.org/#html-namespace), with\
     the intended parent being the node in which the adjustedInsertionLocation finds\
     itself.\
\
03. If the [scripting mode](https://html.spec.whatwg.org/multipage/parsing.html#scripting-mode) is not [Fragment](https://html.spec.whatwg.org/multipage/parsing.html#scripting-mode-fragment), then set the element's\
     [parser document](https://html.spec.whatwg.org/multipage/scripting.html#parser-document) to the `Document`.\
\
    The [Fragment](https://html.spec.whatwg.org/multipage/parsing.html#scripting-mode-fragment) [scripting mode](https://html.spec.whatwg.org/multipage/parsing.html#scripting-mode) treats [parser-inserted](https://html.spec.whatwg.org/multipage/scripting.html#parser-inserted) scripts as if they were not\
     parser-inserted, allowing, for example, executing scripts when applying a fragment created by\
     `createContextualFragment()`.\
\
04. Set the element's [force async](https://html.spec.whatwg.org/multipage/scripting.html#script-force-async) to false.\
\
    This ensures that, if the script is external, any `document.write()` calls in the script will execute in-line,\
     instead of blowing the document away, as would happen in most other cases. It also prevents\
     the script from executing until the end tag is seen.\
\
05. If the parser's [scripting mode](https://html.spec.whatwg.org/multipage/parsing.html#scripting-mode) is [Inert](https://html.spec.whatwg.org/multipage/parsing.html#scripting-mode-inert), then set the `script` element's\
     [already started](https://html.spec.whatwg.org/multipage/scripting.html#already-started) to true. ( [fragment case](https://html.spec.whatwg.org/multipage/parsing.html#fragment-case))\
\
06. If the parser was invoked via the `document.write()` or `document.writeln()` methods, then optionally set the\
     `script` element's [already started](https://html.spec.whatwg.org/multipage/scripting.html#already-started) to true. (For example, the user\
     agent might use this clause to prevent execution of [cross-origin](https://html.spec.whatwg.org/multipage/browsers.html#concept-origin)\
     scripts inserted via `document.write()` under slow\
     network conditions, or when the page has already taken a long time to load.)\
\
07. [Insert an element at the adjusted insertion location](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-element-at-the-adjusted-insertion-location) with the newly created\
     element and adjustedInsertionLocation.\
\
08. Push the element onto the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) so that it is the new\
     [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node).\
\
09. Switch the tokenizer to the [script data state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-state).\
\
10. Set the [original insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#original-insertion-mode) to the current [insertion\\
     mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode).\
\
11. Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [text](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-incdata)".\
\
\
An end tag whose tag name is "head"\
\
Pop the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) (which will be the `head` element) off the\
[stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [after\\
head](https://html.spec.whatwg.org/multipage/parsing.html#the-after-head-insertion-mode)".\
\
An end tag whose tag name is one of: "body", "html", "br"\
\
Act as described in the "anything else" entry below.\
\
A start tag whose tag name is "template"\
\
Run these steps:\
\
1. Let templateStartTag be the start tag.\
\
2. Insert a [marker](https://html.spec.whatwg.org/multipage/parsing.html#concept-parser-marker) at the end of the [list\\
    of active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements).\
\
3. Set the [frameset-ok flag](https://html.spec.whatwg.org/multipage/parsing.html#frameset-ok-flag) to "not ok".\
\
4. Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in\\
    template](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intemplate)".\
\
5. Push " [in template](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intemplate)" onto the\
    [stack of template insertion modes](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-template-insertion-modes) so that it is the new [current template\\
    insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#current-template-insertion-mode).\
\
6. Let adjustedInsertionLocation be the [appropriate place for\\
    inserting a node](https://html.spec.whatwg.org/multipage/parsing.html#appropriate-place-for-inserting-a-node).\
\
7. If templateStartTag's `shadowrootmode` is not in the [None](https://html.spec.whatwg.org/multipage/scripting.html#attr-shadowrootmode-none-state) state:\
01. If the parser's [allow declarative shadow roots](https://html.spec.whatwg.org/multipage/parsing.html#allow-declarative-shadow-roots) is false, or\
        the [adjusted current node](https://html.spec.whatwg.org/multipage/parsing.html#adjusted-current-node) is the topmost element in the [stack of open\\
        elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements), then [insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token and return.\
\
02. Let declarativeShadowHostElement be the [adjusted current\\
        node](https://html.spec.whatwg.org/multipage/parsing.html#adjusted-current-node).\
\
03. Let template be the result of [insert a foreign element](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-foreign-element) for\
        templateStartTag, with [HTML namespace](https://infra.spec.whatwg.org/#html-namespace) and true.\
\
04. Let mode be templateStartTag's `shadowrootmode` attribute's value.\
\
05. Let delegatesFocus be true if templateStartTag has a `shadowrootdelegatesfocus` attribute;\
        otherwise false.\
\
06. Let serializable be true if templateStartTag has a `shadowrootserializable` attribute;\
        otherwise false.\
\
07. Let slotAssignment be "`named`".\
\
08. If templateStartTag's `shadowrootslotassignment` attribute is\
        in the [Manual](https://html.spec.whatwg.org/multipage/scripting.html#attr-shadowrootslotassignment-manual-state) state, then\
        set slotAssignment to "`manual`".\
\
09. Let clonable be true if templateStartTag has a `shadowrootclonable` attribute; otherwise\
        false.\
\
10. If declarativeShadowHostElement is a [shadow host](https://dom.spec.whatwg.org/#element-shadow-host), then\
        [insert an element at the adjusted insertion location](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-element-at-the-adjusted-insertion-location) with\
        template and adjustedInsertionLocation.\
\
11. Otherwise:\
       1. Let registry be null if templateStartTag has a `shadowrootcustomelementregistry`\
           attribute; otherwise declarativeShadowHostElement's [node document](https://dom.spec.whatwg.org/#concept-node-document)'s\
           [custom element registry](https://dom.spec.whatwg.org/#element-custom-element-registry).\
\
       2. [Attach a shadow root](https://dom.spec.whatwg.org/#concept-attach-a-shadow-root) with\
           declarativeShadowHostElement, mode, delegatesFocus,\
           serializable, slotAssignment, clonable, and\
           registry.\
\
          If an exception is thrown, then catch it and:\
          1. [Insert an element at the adjusted insertion location](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-element-at-the-adjusted-insertion-location) with\
              template and adjustedInsertionLocation.\
\
          2. The user agent may report an error to the developer console.\
\
          3. Return.\
       3. Let shadow be declarativeShadowHostElement's [shadow root](https://dom.spec.whatwg.org/#concept-element-shadow-root).\
\
       4. Set shadow's [available to element internals](https://dom.spec.whatwg.org/#shadowroot-available-to-element-internals) to\
           true.\
\
       5. Set shadow's [declarative](https://dom.spec.whatwg.org/#shadowroot-declarative) to true.\
\
       6. Set template's [template contents](https://html.spec.whatwg.org/multipage/scripting.html#template-contents) to\
           shadow.\
\
       7. If templateStartTag has a `shadowrootcustomelementregistry`\
           attribute, then set shadow's [keep custom element registry null](https://dom.spec.whatwg.org/#shadowroot-keep-custom-element-registry-null) to\
           true.\
8. Otherwise, if templateStartTag's `for`\
    attribute is specified:\
1. Let scope be the node that contains the [adjusted insertion\\
       location](https://html.spec.whatwg.org/multipage/parsing.html#adjusted-insertion-location).\
\
      In the [fragment case](https://html.spec.whatwg.org/multipage/parsing.html#fragment-case), scope can be the\
       `DocumentFragment` into which nodes are being inserted.\
\
2. If scope is a `template` element, then set scope to\
       scope's [template contents](https://html.spec.whatwg.org/multipage/scripting.html#template-contents).\
\
      This is to support patching inside plain `template` elements or\
       those using `shadowrootmode`. Nested\
       patching is not supported, since in this case the `template` element's\
       [template contents](https://html.spec.whatwg.org/multipage/scripting.html#template-contents) will have no children and [prepare content\\
       patching](https://html.spec.whatwg.org/multipage/scripting.html#prepare-content-patching) will fail.\
\
3. Otherwise, if scope is [the body element](https://html.spec.whatwg.org/multipage/dom.html#the-body-element-2) of its [node\\
       document](https://dom.spec.whatwg.org/#concept-node-document), then set scope to its [parent](https://dom.spec.whatwg.org/#concept-tree-parent).\
\
      This is to support patching `head` with a `template`\
       inside `body`.\
\
4. Let template be the result of [insert a foreign element](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-foreign-element) for\
       templateStartTag, with [HTML namespace](https://infra.spec.whatwg.org/#html-namespace) and true.\
\
5. Let success be the result of [prepare content patching](https://html.spec.whatwg.org/multipage/scripting.html#prepare-content-patching) given\
       scope and template.\
\
6. If success is false:\
      1. [Assert](https://infra.spec.whatwg.org/#assert): template is the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node).\
\
      2. Pop the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) off the [stack of open\\
          elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
      3. [Insert an element at the adjusted insertion location](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-element-at-the-adjusted-insertion-location) with\
          template.\
\
      4. Push template onto the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
         The above steps undo the effect of the _onlyAddToElementStack_\
          argument from the [insert a foreign element](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-foreign-element) call that created\
          template, inserting it where it would have been inserted otherwise. This is to\
          signal an error.\
9. Otherwise, [insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for templateStartTag.\
\
\
An end tag whose tag name is "template"\
\
If there is no `template` element on the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements), then\
this is a [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors); ignore the token.\
\
Otherwise, run these steps:\
\
1. [Generate all implied end tags thoroughly](https://html.spec.whatwg.org/multipage/parsing.html#generate-all-implied-end-tags-thoroughly).\
\
2. If the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) is not a `template` element, then this is a\
    [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
3. Let template be the last `template` element in the [stack of\\
    open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
This is the `template` element that will be popped from the stack\
    below. It is not necessarily the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node), as the content of a\
    `template` element with a `for` attribute\
    might have left an element open.\
\
4. If template's [insertion target](https://html.spec.whatwg.org/multipage/scripting.html#insertion-target) is not null:\
1. Let start be template's [insertion start\\
       marker](https://html.spec.whatwg.org/multipage/scripting.html#insertion-start-marker).\
\
2. Let end be template's [insertion end\\
       marker](https://html.spec.whatwg.org/multipage/scripting.html#insertion-end-marker).\
\
3. [Assert](https://infra.spec.whatwg.org/#assert): start is not null.\
\
4. If start's [parent](https://dom.spec.whatwg.org/#concept-tree-parent) is not null, then [remove](https://dom.spec.whatwg.org/#concept-node-remove) start.\
\
5. If end is not null and end's [parent](https://dom.spec.whatwg.org/#concept-tree-parent) is not null,\
       then [remove](https://dom.spec.whatwg.org/#concept-node-remove) end.\
\
6. Set template's [insertion target](https://html.spec.whatwg.org/multipage/scripting.html#insertion-target) to null.\
\
7. Set template's [insertion start marker](https://html.spec.whatwg.org/multipage/scripting.html#insertion-start-marker) to null.\
\
8. Set template's [insertion end marker](https://html.spec.whatwg.org/multipage/scripting.html#insertion-end-marker) to null.\
5. Pop elements from the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) until a `template`\
    element has been popped from the stack.\
\
6. [Clear the list of active formatting elements up to the last marker](https://html.spec.whatwg.org/multipage/parsing.html#clear-the-list-of-active-formatting-elements-up-to-the-last-marker).\
7. Pop the [current template insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#current-template-insertion-mode) off the [stack of template\\
    insertion modes](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-template-insertion-modes).\
\
8. [Reset the insertion mode appropriately](https://html.spec.whatwg.org/multipage/parsing.html#reset-the-insertion-mode-appropriately).\
\
\
A start tag whose tag name is "head"Any other end tag\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Ignore the token.\
\
Anything else\
\
Pop the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) (which will be the `head` element) off the\
[stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [after\\
head](https://html.spec.whatwg.org/multipage/parsing.html#the-after-head-insertion-mode)".\
\
Reprocess the token.\
\
###### 13.2.6.4.5 The "in head noscript" insertion mode\
\
When the user agent is to apply the rules for the " [in head noscript](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inheadnoscript)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode), the user agent must handle the\
token as follows:\
\
A DOCTYPE token\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Ignore the token.\
\
A start tag whose tag name is "html"\
\
Process the token [using the rules for](https://html.spec.whatwg.org/multipage/parsing.html#using-the-rules-for) the " [in body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inbody)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode).\
\
An end tag whose tag name is "noscript"\
\
Pop the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) (which will be a `noscript` element) from the\
[stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements); the new [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) will be a\
`head` element.\
\
Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in\\
head](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inhead)".\
\
A character token that is one of U+0009 CHARACTER TABULATION, U+000A LINE FEED (LF), U+000C\
FORM FEED (FF), U+000D CARRIAGE RETURN (CR), or U+0020 SPACEA comment tokenA processing instruction tokenA start tag whose tag name is one of: "basefont", "bgsound", "link", "meta", "noframes",\
"style"\
\
Process the token [using the rules for](https://html.spec.whatwg.org/multipage/parsing.html#using-the-rules-for) the " [in head](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inhead)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode).\
\
An end tag whose tag name is "br"\
\
Act as described in the "anything else" entry below.\
\
A start tag whose tag name is one of: "head", "noscript"Any other end tag\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Ignore the token.\
\
Anything else\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
Pop the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) (which will be a `noscript` element) from the\
[stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements); the new [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) will be a\
`head` element.\
\
Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in\\
head](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inhead)".\
\
Reprocess the token.\
\
###### 13.2.6.4.6 The "after head" insertion mode\
\
When the user agent is to apply the rules for the " [after head](https://html.spec.whatwg.org/multipage/parsing.html#the-after-head-insertion-mode)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode), the user agent must handle the token as\
follows:\
\
A character token that is one of U+0009 CHARACTER\
TABULATION, U+000A LINE FEED (LF), U+000C FORM FEED (FF),\
U+000D CARRIAGE RETURN (CR), or U+0020 SPACE\
\
[Insert the character](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-character).\
\
A comment token\
\
[Insert a comment](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-comment).\
\
A processing instruction token\
\
[Insert a processing instruction](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-processing-instruction).\
\
A DOCTYPE token\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Ignore the token.\
\
A start tag whose tag name is "html"\
\
Process the token [using the rules for](https://html.spec.whatwg.org/multipage/parsing.html#using-the-rules-for) the " [in body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inbody)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode).\
\
A start tag whose tag name is "body"\
\
[Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token.\
\
Set the [frameset-ok flag](https://html.spec.whatwg.org/multipage/parsing.html#frameset-ok-flag) to "not ok".\
\
Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in\\
body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inbody)".\
\
A start tag whose tag name is "frameset"\
\
[Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token.\
\
Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in\\
frameset](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inframeset)".\
\
A start tag whose tag name is one of: "base", "basefont", "bgsound", "link", "meta",\
"noframes", "script", "style", "template", "title"\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
Push the node pointed to by the [`head` element pointer](https://html.spec.whatwg.org/multipage/parsing.html#head-element-pointer) onto\
the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
Process the token [using the rules for](https://html.spec.whatwg.org/multipage/parsing.html#using-the-rules-for) the " [in head](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inhead)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode).\
\
Remove the node pointed to by the [`head` element pointer](https://html.spec.whatwg.org/multipage/parsing.html#head-element-pointer)\
from the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements). (It might not be the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) at\
this point.)\
\
The [`head` element pointer](https://html.spec.whatwg.org/multipage/parsing.html#head-element-pointer) cannot be null at\
this point.\
\
An end tag whose tag name is "template"\
\
Process the token [using the rules for](https://html.spec.whatwg.org/multipage/parsing.html#using-the-rules-for) the " [in head](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inhead)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode).\
\
An end tag whose tag name is one of: "body", "html", "br"\
\
Act as described in the "anything else" entry below.\
\
A start tag whose tag name is "head"Any other end tag\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Ignore the token.\
\
Anything else\
\
[Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for a "body" start tag token with no attributes.\
\
Set the [frameset-ok flag](https://html.spec.whatwg.org/multipage/parsing.html#frameset-ok-flag) to "ok".\
\
Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in\\
body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inbody)".\
\
Reprocess the current token.\
\
###### 13.2.6.4.7 The "in body" insertion mode\
\
When the user agent is to apply the rules for the " [in\\
body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inbody)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode), the user agent must handle the token as follows:\
\
A character token that is U+0000 NULL\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Ignore the token.\
\
A character token that is one of U+0009 CHARACTER TABULATION,\
U+000A LINE FEED (LF), U+000C FORM FEED (FF), U+000D CARRIAGE\
RETURN (CR), or U+0020 SPACE\
\
[Reconstruct the active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#reconstruct-the-active-formatting-elements), if any.\
\
[Insert the token's character](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-character).\
\
Any other character token\
\
[Reconstruct the active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#reconstruct-the-active-formatting-elements), if any.\
\
[Insert the token's character](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-character).\
\
Set the [frameset-ok flag](https://html.spec.whatwg.org/multipage/parsing.html#frameset-ok-flag) to "not ok".\
\
A comment token\
\
[Insert a comment](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-comment).\
\
A processing instruction token\
\
[Insert a processing instruction](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-processing-instruction).\
\
A DOCTYPE token\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Ignore the token.\
\
A start tag whose tag name is "html"\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
If there is a `template` element on the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements), then\
ignore the token.\
\
Otherwise, for each attribute on the token, check to see if the attribute is already present\
on the top element of the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements). If it is not, add the attribute\
and its corresponding value to that element.\
\
A start tag whose tag name is one of: "base", "basefont", "bgsound", "link", "meta",\
"noframes", "script", "style", "template", "title"An end tag whose tag name is "template"\
\
Process the token [using the rules for](https://html.spec.whatwg.org/multipage/parsing.html#using-the-rules-for) the " [in head](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inhead)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode).\
\
A start tag whose tag name is "body"\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) has only one node on it, or if the second element\
on the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) is not a `body` element, or if there is a\
`template` element on the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements), then ignore the token.\
( [fragment case](https://html.spec.whatwg.org/multipage/parsing.html#fragment-case) or there is a `template` element on the stack)\
\
Otherwise, set the [frameset-ok flag](https://html.spec.whatwg.org/multipage/parsing.html#frameset-ok-flag) to "not ok"; then, for each attribute on the\
token, check to see if the attribute is already present on the `body` element (the\
second element) on the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements), and if it is not, add the attribute\
and its corresponding value to that element.\
\
A start tag whose tag name is "frameset"\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) has only one node on it, or if the second element\
on the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) is not a `body` element, then ignore the\
token. ( [fragment case](https://html.spec.whatwg.org/multipage/parsing.html#fragment-case) or there is a `template` element on the\
stack)\
\
If the [frameset-ok flag](https://html.spec.whatwg.org/multipage/parsing.html#frameset-ok-flag) is set to "not ok", ignore the token.\
\
Otherwise, run the following steps:\
\
1. Remove the second element on the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) from its parent\
    node, if it has one.\
\
2. Pop all the nodes from the bottom of the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements), from the\
    [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) up to, but not including, the root `html` element.\
\
3. [Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token.\
\
4. Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in\\
    frameset](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inframeset)".\
\
\
An end-of-file token\
\
If the [stack of template insertion modes](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-template-insertion-modes) is not empty, then process the token\
[using the rules for](https://html.spec.whatwg.org/multipage/parsing.html#using-the-rules-for) the " [in\\
template](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intemplate)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode).\
\
Otherwise, follow these steps:\
\
1. If there is a node in the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) that is not either a\
    `dd` element, a `dt` element, an `li` element, an\
    `optgroup` element, an `option` element, a `p` element, an\
    `rb` element, an `rp` element, an `rt` element, an\
    `rtc` element, a `tbody` element, a `td` element, a\
    `tfoot` element, a `th` element, a `thead` element, a\
    `tr` element, the `body` element, or the `html` element, then\
    this is a [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
2. [Stop parsing](https://html.spec.whatwg.org/multipage/parsing.html#stop-parsing).\
\
\
An end tag whose tag name is "body"\
\
If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) does not [have a `body` element in scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-scope), this is a [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors);\
ignore the token.\
\
Otherwise, if there is a node in the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) that is not either a\
`dd` element, a `dt` element, an `li` element, an\
`optgroup` element, an `option` element, a `p` element, an\
`rb` element, an `rp` element, an `rt` element, an\
`rtc` element, a `tbody` element, a `td` element, a\
`tfoot` element, a `th` element, a `thead` element, a\
`tr` element, the `body` element, or the `html` element, then\
this is a [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [after\\
body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-afterbody)".\
\
An end tag whose tag name is "html"\
\
If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) does not [have a `body` element in scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-scope), this is a [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors);\
ignore the token.\
\
Otherwise, if there is a node in the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) that is not either a\
`dd` element, a `dt` element, an `li` element, an\
`optgroup` element, an `option` element, a `p` element, an\
`rb` element, an `rp` element, an `rt` element, an\
`rtc` element, a `tbody` element, a `td` element, a\
`tfoot` element, a `th` element, a `thead` element, a\
`tr` element, the `body` element, or the `html` element, then\
this is a [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [after\\
body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-afterbody)".\
\
Reprocess the token.\
\
A start tag whose tag name is one of: "address", "article", "aside", "blockquote", "center",\
"details", "dialog", "dir", "div", "dl", "fieldset", "figcaption", "figure", "footer", "header",\
"hgroup", "main", "menu", "nav", "ol", "p", "search", "section", "summary", "ul"\
\
If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) [has a\\
`p` element in button scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-button-scope), then [close a `p`\\
element](https://html.spec.whatwg.org/multipage/parsing.html#close-a-p-element).\
\
[Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token.\
\
A start tag whose tag name is one of: "h1", "h2", "h3", "h4",\
"h5", "h6"\
\
If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) [has a\\
`p` element in button scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-button-scope), then [close a `p`\\
element](https://html.spec.whatwg.org/multipage/parsing.html#close-a-p-element).\
\
If the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) is an [HTML element](https://html.spec.whatwg.org/multipage/infrastructure.html#html-elements) whose\
tag name is one of "h1", "h2", "h3", "h4", "h5", or "h6", then this is a [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors); pop the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) off the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
[Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token.\
\
A start tag whose tag name is one of: "pre", "listing"\
\
If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) [has\\
a `p` element in button scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-button-scope), then [close a `p`\\
element](https://html.spec.whatwg.org/multipage/parsing.html#close-a-p-element).\
\
[Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token.\
\
If the [next token](https://html.spec.whatwg.org/multipage/parsing.html#next-token) is a U+000A LINE FEED (LF) character token, then ignore that\
token and move on to the next one. (Newlines at the start of `pre` blocks are ignored\
as an authoring convenience.)\
\
Set the [frameset-ok flag](https://html.spec.whatwg.org/multipage/parsing.html#frameset-ok-flag) to "not ok".\
\
A start tag whose tag name is "form"\
\
If the [`form` element pointer](https://html.spec.whatwg.org/multipage/parsing.html#form-element-pointer) is not null, and the\
parser is not [parsing template contents](https://html.spec.whatwg.org/multipage/parsing.html#parsing-template-contents), then this is a [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors);\
ignore the token.\
\
Otherwise:\
\
1. If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) [has\\
    a `p` element in button scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-button-scope), then [close a `p`\\
    element](https://html.spec.whatwg.org/multipage/parsing.html#close-a-p-element).\
\
2. [Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token, and, if the parser is not\
    [parsing template contents](https://html.spec.whatwg.org/multipage/parsing.html#parsing-template-contents), set the [`form` element pointer](https://html.spec.whatwg.org/multipage/parsing.html#form-element-pointer) to point to the element created.\
\
\
A start tag whose tag name is "li"\
\
Run these steps:\
\
1. Set the [frameset-ok flag](https://html.spec.whatwg.org/multipage/parsing.html#frameset-ok-flag) to "not ok".\
\
2. Initialize node to be the [current\\
    node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) (the bottommost node of the stack).\
\
3. _Loop_: If node is an `li` element, then run these\
    substeps:\
1. [Generate implied end tags](https://html.spec.whatwg.org/multipage/parsing.html#generate-implied-end-tags), except for `li` elements.\
\
2. If the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) is not an `li` element, then this is a\
       [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
3. Pop elements from the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) until an `li`\
       element has been popped from the stack.\
\
4. Jump to the step labeled _done_ below.\
4. If node is in the [special](https://html.spec.whatwg.org/multipage/parsing.html#special) category, but is not an\
    `address`, `div`, or `p` element, then jump to the step\
    labeled _done_ below.\
\
5. Otherwise, set node to the previous entry in the [stack of open\\
    elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) and return to the step labeled _loop_.\
\
6. _Done_: If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) [has a `p` element in button scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-button-scope), then [close a\\
    `p` element](https://html.spec.whatwg.org/multipage/parsing.html#close-a-p-element).\
\
7. Finally, [insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token.\
\
\
A start tag whose tag name is one of: "dd", "dt"\
\
Run these steps:\
\
1. Set the [frameset-ok flag](https://html.spec.whatwg.org/multipage/parsing.html#frameset-ok-flag) to "not ok".\
\
2. Initialize node to be the [current\\
    node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) (the bottommost node of the stack).\
\
3. _Loop_: If node is a `dd` element, then run these\
    substeps:\
1. [Generate implied end tags](https://html.spec.whatwg.org/multipage/parsing.html#generate-implied-end-tags), except for `dd` elements.\
\
2. If the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) is not a `dd` element, then this is a\
       [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
3. Pop elements from the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) until a `dd`\
       element has been popped from the stack.\
\
4. Jump to the step labeled _done_ below.\
4. If node is a `dt` element, then run these substeps:\
1. [Generate implied end tags](https://html.spec.whatwg.org/multipage/parsing.html#generate-implied-end-tags), except for `dt` elements.\
\
2. If the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) is not a `dt` element, then this is a\
       [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
3. Pop elements from the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) until a `dt`\
       element has been popped from the stack.\
\
4. Jump to the step labeled _done_ below.\
5. If node is in the [special](https://html.spec.whatwg.org/multipage/parsing.html#special) category, but is not an\
    `address`, `div`, or `p` element, then jump to the step\
    labeled _done_ below.\
\
6. Otherwise, set node to the previous entry in the [stack of open\\
    elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) and return to the step labeled _loop_.\
\
7. _Done_: If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) [has a `p` element in button scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-button-scope), then [close a\\
    `p` element](https://html.spec.whatwg.org/multipage/parsing.html#close-a-p-element).\
\
8. Finally, [insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token.\
\
\
A start tag whose tag name is "plaintext"\
\
If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) [has a\\
`p` element in button scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-button-scope), then [close a `p`\\
element](https://html.spec.whatwg.org/multipage/parsing.html#close-a-p-element).\
\
[Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token.\
\
Switch the tokenizer to the [PLAINTEXT state](https://html.spec.whatwg.org/multipage/parsing.html#plaintext-state).\
\
Once a start tag with the tag name "plaintext" has been seen, all remaining\
tokens will be character tokens (and a final end-of-file token) because there is no way to\
switch the tokenizer out of the [PLAINTEXT state](https://html.spec.whatwg.org/multipage/parsing.html#plaintext-state). However, as the tree builder\
remains in its existing insertion mode, it might [reconstruct the active formatting\\
elements](https://html.spec.whatwg.org/multipage/parsing.html#reconstruct-the-active-formatting-elements) while processing those character tokens. This means that the parser can\
insert other elements into the `plaintext` element.\
\
A start tag whose tag name is "button"\
\
1. If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) [has a\\
    `button` element in scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-scope), then run these substeps:\
1. [Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
2. [Generate implied end tags](https://html.spec.whatwg.org/multipage/parsing.html#generate-implied-end-tags).\
\
3. Pop elements from the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) until a `button`\
       element has been popped from the stack.\
2. [Reconstruct the active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#reconstruct-the-active-formatting-elements), if any.\
\
3. [Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token.\
\
4. Set the [frameset-ok flag](https://html.spec.whatwg.org/multipage/parsing.html#frameset-ok-flag) to "not ok".\
\
\
An end tag whose tag name is one of: "address", "article", "aside", "blockquote", "button",\
"center", "details", "dialog", "dir", "div", "dl", "fieldset", "figcaption", "figure", "footer",\
"header", "hgroup", "listing", "main", "menu", "nav", "ol", "pre", "search", "section", "select",\
"summary", "ul"\
\
If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) does not [have an element in scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-scope) that is an [HTML\\
element](https://html.spec.whatwg.org/multipage/infrastructure.html#html-elements) with the same tag name as that of the token, then this is a [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors); ignore the token.\
\
Otherwise, run these steps:\
\
1. [Generate implied end tags](https://html.spec.whatwg.org/multipage/parsing.html#generate-implied-end-tags).\
\
2. If the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) is not an [HTML element](https://html.spec.whatwg.org/multipage/infrastructure.html#html-elements) with\
    the same tag name as that of the token, then this is a\
    [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
3. Pop elements from the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) until an [HTML element](https://html.spec.whatwg.org/multipage/infrastructure.html#html-elements) with the same tag name as the token has been popped from the\
    stack.\
\
\
An end tag whose tag name is "form"\
\
If the parser is not [parsing template contents](https://html.spec.whatwg.org/multipage/parsing.html#parsing-template-contents):\
\
1. Let node be the element that the [`form`\\
    element pointer](https://html.spec.whatwg.org/multipage/parsing.html#form-element-pointer) is set to, or null if it is not set to an element.\
\
2. Set the [`form` element pointer](https://html.spec.whatwg.org/multipage/parsing.html#form-element-pointer) to null.\
\
3. If node is null or if the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) does\
    not [have node in scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-scope), then\
    this is a [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors); return and ignore the token.\
\
4. [Generate implied end tags](https://html.spec.whatwg.org/multipage/parsing.html#generate-implied-end-tags).\
\
5. If the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) is not node, then this is a\
    [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
6. Remove node from the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
\
Otherwise:\
\
1. If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) does not [have a `form` element in scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-scope), then this is a [parse\\
    error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors); return and ignore the token.\
\
2. [Generate implied end tags](https://html.spec.whatwg.org/multipage/parsing.html#generate-implied-end-tags).\
\
3. If the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) is not a `form` element, then this is a\
    [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
4. Pop elements from the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) until a `form`\
    element has been popped from the stack.\
\
\
An end tag whose tag name is "p"\
\
If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) does not [have a `p` element in button scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-button-scope), then this is a [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors); [insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for a "p" start tag token with no\
attributes.\
\
[Close a `p` element](https://html.spec.whatwg.org/multipage/parsing.html#close-a-p-element).\
\
An end tag whose tag name is "li"\
\
If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) does not [have an `li` element in list item scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-list-item-scope), then this is a [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors); ignore the token.\
\
Otherwise, run these steps:\
\
1. [Generate implied end tags](https://html.spec.whatwg.org/multipage/parsing.html#generate-implied-end-tags), except for `li` elements.\
\
2. If the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) is not an `li` element, then this is a\
    [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
3. Pop elements from the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) until an `li`\
    element has been popped from the stack.\
\
\
An end tag whose tag name is one of: "dd", "dt"\
\
If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) does not [have an element in scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-scope) that is an [HTML\\
element](https://html.spec.whatwg.org/multipage/infrastructure.html#html-elements) with the same tag name as that of the token, then this is a [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors); ignore the token.\
\
Otherwise, run these steps:\
\
1. [Generate implied end tags](https://html.spec.whatwg.org/multipage/parsing.html#generate-implied-end-tags), except for [HTML elements](https://html.spec.whatwg.org/multipage/infrastructure.html#html-elements) with the\
    same tag name as the token.\
\
2. If the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) is not an [HTML\\
    element](https://html.spec.whatwg.org/multipage/infrastructure.html#html-elements) with the same tag name as that of the token, then this is a [parse\\
    error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
3. Pop elements from the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) until an [HTML element](https://html.spec.whatwg.org/multipage/infrastructure.html#html-elements) with the same tag name as the token has been popped from the\
    stack.\
\
\
An end tag whose tag name is one of: "h1", "h2", "h3", "h4", "h5", "h6"\
\
If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) does not [have an element in scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-scope) that is an [HTML\\
element](https://html.spec.whatwg.org/multipage/infrastructure.html#html-elements) and whose tag name is one of "h1", "h2", "h3", "h4", "h5", or "h6", then this is\
a [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors); ignore the token.\
\
Otherwise, run these steps:\
\
1. [Generate implied end tags](https://html.spec.whatwg.org/multipage/parsing.html#generate-implied-end-tags).\
\
2. If the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) is not an [HTML\\
    element](https://html.spec.whatwg.org/multipage/infrastructure.html#html-elements) with the same tag name as that of the token, then this is a [parse\\
    error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
3. Pop elements from the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) until an [HTML element](https://html.spec.whatwg.org/multipage/infrastructure.html#html-elements) whose tag name is one of "h1", "h2", "h3", "h4", "h5", or "h6"\
    has been popped from the stack.\
\
\
An end tag whose tag name is "sarcasm"\
\
Take a deep breath, then act as described in the "any other end\
tag" entry below.\
\
A start tag whose tag name is "a"\
\
If the [list of active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements) contains an `a` element\
between the end of the list and the last [marker](https://html.spec.whatwg.org/multipage/parsing.html#concept-parser-marker) on\
the list (or the start of the list if there is no [marker](https://html.spec.whatwg.org/multipage/parsing.html#concept-parser-marker) on the list), then this is a [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors); run the [adoption agency algorithm](https://html.spec.whatwg.org/multipage/parsing.html#adoption-agency-algorithm) for the token, then remove that\
element from the [list of active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements) and the [stack of open\\
elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) if the [adoption agency algorithm](https://html.spec.whatwg.org/multipage/parsing.html#adoption-agency-algorithm) didn't already remove it (it might\
not have if the element is not [in table\\
scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-table-scope)).\
\
In the non-conforming stream\
`<a href="a">a<table><a href="b">b</table>x`, the first\
`a` element would be closed upon seeing the second one, and the "x" character would\
be inside a link to "b", not to "a". This is despite the fact that the outer `a`\
element is not in table scope (meaning that a regular `</a>` end tag at the start\
of the table wouldn't close the outer `a` element). The result is that the two\
`a` elements are indirectly nested inside each other — non-conforming markup\
will often result in non-conforming DOMs when parsed.\
\
[Reconstruct the active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#reconstruct-the-active-formatting-elements), if any.\
\
[Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token. [Push onto the list of active\\
formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#push-onto-the-list-of-active-formatting-elements) that element.\
\
A start tag whose tag name is one of: "b", "big", "code", "em",\
"font", "i", "s", "small", "strike", "strong", "tt", "u"\
\
[Reconstruct the active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#reconstruct-the-active-formatting-elements), if any.\
\
[Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token. [Push onto the list of active\\
formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#push-onto-the-list-of-active-formatting-elements) that element.\
\
A start tag whose tag name is "nobr"\
\
[Reconstruct the active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#reconstruct-the-active-formatting-elements), if any.\
\
If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) [has a\\
`nobr` element in scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-scope), then this is a [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors); run the\
[adoption agency algorithm](https://html.spec.whatwg.org/multipage/parsing.html#adoption-agency-algorithm) for the token, then once again [reconstruct the\\
active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#reconstruct-the-active-formatting-elements), if any.\
\
[Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token. [Push onto the list of active\\
formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#push-onto-the-list-of-active-formatting-elements) that element.\
\
An end tag whose tag name is one of: "a",\
"b", "big", "code", "em", "font", "i", "nobr", "s", "small",\
"strike", "strong", "tt", "u"\
\
Run the [adoption agency algorithm](https://html.spec.whatwg.org/multipage/parsing.html#adoption-agency-algorithm) for the token.\
\
A start tag whose tag name is one of: "applet", "marquee", "object"\
\
[Reconstruct the active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#reconstruct-the-active-formatting-elements), if any.\
\
[Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token.\
\
Insert a [marker](https://html.spec.whatwg.org/multipage/parsing.html#concept-parser-marker) at the end of the [list of\\
active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements).\
\
Set the [frameset-ok flag](https://html.spec.whatwg.org/multipage/parsing.html#frameset-ok-flag) to "not ok".\
\
An end tag token whose tag name is one of: "applet", "marquee", "object"\
\
If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) does not [have an element in scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-scope) that is an [HTML\\
element](https://html.spec.whatwg.org/multipage/infrastructure.html#html-elements) with the same tag name as that of the token, then this is a [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors); ignore the token.\
\
Otherwise, run these steps:\
\
1. [Generate implied end tags](https://html.spec.whatwg.org/multipage/parsing.html#generate-implied-end-tags).\
\
2. If the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) is not an [HTML\\
    element](https://html.spec.whatwg.org/multipage/infrastructure.html#html-elements) with the same tag name as that of the token, then this is a [parse\\
    error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
3. Pop elements from the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) until an [HTML element](https://html.spec.whatwg.org/multipage/infrastructure.html#html-elements) with the same tag name as the token has been popped from the\
    stack.\
\
4. [Clear the list of active formatting elements up to the last marker](https://html.spec.whatwg.org/multipage/parsing.html#clear-the-list-of-active-formatting-elements-up-to-the-last-marker).\
\
A start tag whose tag name is "table"\
\
If the `Document` is _not_ set to [quirks mode](https://dom.spec.whatwg.org/#concept-document-quirks), and the\
[stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) [has a\\
`p` element in button scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-button-scope), then [close a `p`\\
element](https://html.spec.whatwg.org/multipage/parsing.html#close-a-p-element).\
\
[Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token.\
\
Set the [frameset-ok flag](https://html.spec.whatwg.org/multipage/parsing.html#frameset-ok-flag) to "not ok".\
\
Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in\\
table](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intable)".\
\
An end tag whose tag name is "br"\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Drop the attributes from the token, and act as described in the\
next entry; i.e. act as if this was a "br" start tag token with no attributes, rather than the\
end tag token that it actually is.\
\
A start tag whose tag name is one of: "area", "br", "embed",\
"img", "keygen", "wbr"\
\
[Reconstruct the active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#reconstruct-the-active-formatting-elements), if any.\
\
[Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token. Immediately pop the [current\\
node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) off the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
[Acknowledge the token's _self-closing_\\
_flag_](https://html.spec.whatwg.org/multipage/parsing.html#acknowledge-self-closing-flag), if it is set.\
\
Set the [frameset-ok flag](https://html.spec.whatwg.org/multipage/parsing.html#frameset-ok-flag) to "not ok".\
\
A start tag whose tag name is "input"\
\
If the parser's [fragment context element](https://html.spec.whatwg.org/multipage/parsing.html#fragment-context-element) is a `select` element\
( [fragment case](https://html.spec.whatwg.org/multipage/parsing.html#fragment-case)):\
\
1. [Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
2. Ignore the token.\
\
3. Return.\
\
\
If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) [has a\\
`select` element in scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-scope):\
\
1. [Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
2. Pop elements from the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) until a `select`\
    element has been popped from the stack.\
\
\
[Reconstruct the active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#reconstruct-the-active-formatting-elements), if any.\
\
[Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token. Immediately pop the [current\\
node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) off the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
[Acknowledge the token's _self-closing_\\
_flag_](https://html.spec.whatwg.org/multipage/parsing.html#acknowledge-self-closing-flag), if it is set.\
\
If the token does not have an attribute with the name "type", or if it does, but that\
attribute's value is not an [ASCII case-insensitive](https://infra.spec.whatwg.org/#ascii-case-insensitive) match for "`hidden`", then set the [frameset-ok flag](https://html.spec.whatwg.org/multipage/parsing.html#frameset-ok-flag) to "not ok".\
\
A start tag whose tag name is one of: "param", "source", "track"\
\
[Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token. Immediately pop the [current\\
node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) off the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
[Acknowledge the token's _self-closing_\\
_flag_](https://html.spec.whatwg.org/multipage/parsing.html#acknowledge-self-closing-flag), if it is set.\
\
A start tag whose tag name is "hr"\
\
If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) [has a\\
`p` element in button scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-button-scope), then [close a `p`\\
element](https://html.spec.whatwg.org/multipage/parsing.html#close-a-p-element).\
\
If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) [has a\\
`select` element in scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-scope):\
\
1. [Generate implied end tags](https://html.spec.whatwg.org/multipage/parsing.html#generate-implied-end-tags).\
\
2. If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) [has an\\
    `option` element in scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-scope) or [has an\\
    `optgroup` element in scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-scope), then this is a [parse\\
    error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
\
[Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token. Immediately pop the [current\\
node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) off the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
[Acknowledge the token's _self-closing_\\
_flag_](https://html.spec.whatwg.org/multipage/parsing.html#acknowledge-self-closing-flag), if it is set.\
\
Set the [frameset-ok flag](https://html.spec.whatwg.org/multipage/parsing.html#frameset-ok-flag) to "not ok".\
\
A start tag whose tag name is "image"\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Change the token's tag name to "img" and reprocess it. (Don't\
ask.)\
\
A start tag whose tag name is "textarea"\
\
Run these steps:\
\
1. [Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token.\
\
2. If the [next token](https://html.spec.whatwg.org/multipage/parsing.html#next-token) is a U+000A LINE FEED (LF) character token, then ignore\
    that token and move on to the next one. (Newlines at the start of `textarea`\
    elements are ignored as an authoring convenience.)\
\
3. Switch the tokenizer to the [RCDATA state](https://html.spec.whatwg.org/multipage/parsing.html#rcdata-state).\
\
4. Set the [original insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#original-insertion-mode) to the current [insertion\\
    mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode).\
\
5. Set the [frameset-ok flag](https://html.spec.whatwg.org/multipage/parsing.html#frameset-ok-flag) to "not ok".\
\
6. Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [text](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-incdata)".\
\
\
A start tag whose tag name is "xmp"\
\
If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) [has a\\
`p` element in button scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-button-scope), then [close a `p`\\
element](https://html.spec.whatwg.org/multipage/parsing.html#close-a-p-element).\
\
[Reconstruct the active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#reconstruct-the-active-formatting-elements), if any.\
\
Set the [frameset-ok flag](https://html.spec.whatwg.org/multipage/parsing.html#frameset-ok-flag) to "not ok".\
\
Follow the [generic raw text element parsing algorithm](https://html.spec.whatwg.org/multipage/parsing.html#generic-raw-text-element-parsing-algorithm).\
\
A start tag whose tag name is "iframe"\
\
Set the [frameset-ok flag](https://html.spec.whatwg.org/multipage/parsing.html#frameset-ok-flag) to "not ok".\
\
Follow the [generic raw text element parsing algorithm](https://html.spec.whatwg.org/multipage/parsing.html#generic-raw-text-element-parsing-algorithm).\
\
A start tag whose tag name is "noembed"A start tag whose tag name is "noscript", if [scripting mode](https://html.spec.whatwg.org/multipage/parsing.html#scripting-mode) is not [Disabled](https://html.spec.whatwg.org/multipage/parsing.html#scripting-mode-disabled)\
\
Follow the [generic raw text element parsing algorithm](https://html.spec.whatwg.org/multipage/parsing.html#generic-raw-text-element-parsing-algorithm).\
\
A start tag whose tag name is "select"\
\
If the parser's [fragment context element](https://html.spec.whatwg.org/multipage/parsing.html#fragment-context-element) is a `select` element\
( [fragment case](https://html.spec.whatwg.org/multipage/parsing.html#fragment-case)):\
\
1. [Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
2. Ignore the token.\
\
\
Otherwise, if the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) [has a `select` element in scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-scope):\
\
1. [Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
2. Ignore the token.\
\
3. Pop elements from the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) until a `select`\
    element has been popped from the stack.\
\
\
Otherwise:\
\
1. [Reconstruct the active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#reconstruct-the-active-formatting-elements), if any.\
\
2. [Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token.\
\
3. Set the [frameset-ok flag](https://html.spec.whatwg.org/multipage/parsing.html#frameset-ok-flag) to "not ok".\
\
\
A start tag whose tag name is "option"\
\
If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) [has a\\
`select` element in scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-scope):\
\
1. [Generate implied end tags](https://html.spec.whatwg.org/multipage/parsing.html#generate-implied-end-tags) except for `optgroup`\
    elements.\
\
2. If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) [has an\\
    `option` element in scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-scope), then this is a [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
\
Otherwise:\
\
1. If the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) is an `option` element, then pop the\
    [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) off the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
\
[Reconstruct the active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#reconstruct-the-active-formatting-elements), if any.\
\
[Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token.\
\
A start tag whose tag name is "optgroup"\
\
If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) [has a\\
`select` element in scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-scope):\
\
1. [Generate implied end tags](https://html.spec.whatwg.org/multipage/parsing.html#generate-implied-end-tags).\
\
2. If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) [has an\\
    `option` element in scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-scope) or [has an\\
    `optgroup` element in scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-scope), then this is a [parse\\
    error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
\
Otherwise, if the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) is an `option` element, then pop the\
[current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) from the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
[Reconstruct the active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#reconstruct-the-active-formatting-elements), if any.\
\
[Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token.\
\
A start tag whose tag name is one of: "rb", "rtc"\
\
If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) [has a\\
`ruby` element in scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-scope), then [generate implied end tags](https://html.spec.whatwg.org/multipage/parsing.html#generate-implied-end-tags). If the\
[current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) is not now a `ruby` element, this is a\
[parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
[Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token.\
\
A start tag whose tag name is one of: "rp", "rt"\
\
If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) [has a\\
`ruby` element in scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-scope), then [generate implied end tags](https://html.spec.whatwg.org/multipage/parsing.html#generate-implied-end-tags), except\
for `rtc` elements. If the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) is not now a `rtc`\
element or a `ruby` element, this is a [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
[Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token.\
\
A start tag whose tag name is "math"\
\
[Reconstruct the active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#reconstruct-the-active-formatting-elements), if any.\
\
[Adjust MathML attributes](https://html.spec.whatwg.org/multipage/parsing.html#adjust-mathml-attributes) for the token. (This fixes the case of MathML\
attributes that are not all lowercase.)\
\
[Adjust foreign attributes](https://html.spec.whatwg.org/multipage/parsing.html#adjust-foreign-attributes) for the token. (This fixes the use of namespaced\
attributes, in particular XLink.)\
\
[Insert a foreign element](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-foreign-element) for the token, with [MathML namespace](https://infra.spec.whatwg.org/#mathml-namespace)\
and false.\
\
If the token has its _[self-closing flag](https://html.spec.whatwg.org/multipage/parsing.html#self-closing-flag)_ set, pop the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) off the\
[stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) and [acknowledge\\
the token's _self-closing flag_](https://html.spec.whatwg.org/multipage/parsing.html#acknowledge-self-closing-flag).\
\
A start tag whose tag name is "svg"\
\
[Reconstruct the active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#reconstruct-the-active-formatting-elements), if any.\
\
[Adjust SVG attributes](https://html.spec.whatwg.org/multipage/parsing.html#adjust-svg-attributes) for the token. (This fixes the case of SVG attributes that\
are not all lowercase.)\
\
[Adjust foreign attributes](https://html.spec.whatwg.org/multipage/parsing.html#adjust-foreign-attributes) for the token. (This fixes the use of namespaced\
attributes, in particular XLink in SVG.)\
\
[Insert a foreign element](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-foreign-element) for the token, with [SVG namespace](https://infra.spec.whatwg.org/#svg-namespace)\
and false.\
\
If the token has its _[self-closing flag](https://html.spec.whatwg.org/multipage/parsing.html#self-closing-flag)_ set, pop the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) off the\
[stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) and [acknowledge\\
the token's _self-closing flag_](https://html.spec.whatwg.org/multipage/parsing.html#acknowledge-self-closing-flag).\
\
A start tag whose tag name is one of: "caption", "col", "colgroup", "frame",\
"head", "tbody", "td", "tfoot", "th", "thead", "tr"\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Ignore the token.\
\
Any other start tag\
\
[Reconstruct the active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#reconstruct-the-active-formatting-elements), if any.\
\
[Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token.\
\
This element will be an [ordinary](https://html.spec.whatwg.org/multipage/parsing.html#ordinary) element. With one exception: if\
[scripting mode](https://html.spec.whatwg.org/multipage/parsing.html#scripting-mode) is [Disabled](https://html.spec.whatwg.org/multipage/parsing.html#scripting-mode-disabled), it can\
also be a `noscript` element.\
\
Any other end tag\
\
Run these steps:\
\
1. Initialize node to be the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) (the bottommost\
    node of the stack).\
\
2. _Loop_: If node is an [HTML\\
    element](https://html.spec.whatwg.org/multipage/infrastructure.html#html-elements) with the same tag name as the token:\
\
1. [Generate implied end tags](https://html.spec.whatwg.org/multipage/parsing.html#generate-implied-end-tags), except for [HTML elements](https://html.spec.whatwg.org/multipage/infrastructure.html#html-elements) with the\
       same tag name as the token.\
\
2. If node is not the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node), then this is a\
       [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
3. Pop all the nodes from the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) up to node,\
       including node, then stop these steps.\
3. Otherwise, if node is in the [special](https://html.spec.whatwg.org/multipage/parsing.html#special) category, then\
    this is a [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors); ignore the token, and return.\
\
4. Set node to the previous entry in the [stack of open\\
    elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
5. Return to the step labeled _loop_.\
\
\
When the steps above say the user agent is to close a `p` element, it\
means that the user agent must run the following steps:\
\
1. [Generate implied end tags](https://html.spec.whatwg.org/multipage/parsing.html#generate-implied-end-tags), except for `p` elements.\
\
2. If the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) is not a `p` element, then this is a\
    [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
3. Pop elements from the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) until a `p` element\
    has been popped from the stack.\
\
\
The adoption agency algorithm, which takes as its only argument\
a token token for which the algorithm is being run, consists of the following\
steps:\
\
1. Let subject be token's tag name.\
\
2. If the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) is an [HTML element](https://html.spec.whatwg.org/multipage/infrastructure.html#html-elements)\
    whose tag name is subject, and the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) is not in the\
    [list of active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements), then pop the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) off the\
    [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) and return.\
\
3. Let outerLoopCounter be 0.\
\
4. While true:\
01. If outerLoopCounter is greater than or equal to 8, then return.\
\
02. Increment outerLoopCounter by 1.\
\
03. Let formattingElement be the last element in the [list of active\\
        formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements) that:\
\
\
       - is between the end of the list and the last [marker](https://html.spec.whatwg.org/multipage/parsing.html#concept-parser-marker) in the list, if any, or the start of the list\
          otherwise, and\
       - has the tag name subject.\
\
If there is no such element, then act as described in the "any other end tag" entry above\
and return.\
\
04. If formattingElement is not in the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements), then\
        this is a [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors); remove the element from the list, and return.\
\
05. If formattingElement is in the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements), but the\
        element is not [in scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-scope), then this is a\
        [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors); return.\
\
06. If formattingElement is not the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node), this is a\
        [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). (But do not return.)\
\
07. Let furthestBlock be the topmost node in the [stack of open\\
        elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) that is lower in the stack than formattingElement, and is an\
        element in the [special](https://html.spec.whatwg.org/multipage/parsing.html#special) category. There might not be one.\
\
08. If there is no furthestBlock, then the UA must first pop all the nodes from\
        the bottom of the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements), from the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) up to\
        and including formattingElement, then remove formattingElement from the\
        [list of active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements), and finally return.\
\
09. Let commonAncestor be the element immediately above\
        formattingElement in the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
10. Let a bookmark note the position of formattingElement in the [list of\\
        active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements) relative to the elements on either side of it in the\
        list.\
\
11. Let node and lastNode be furthestBlock.\
\
12. Let innerLoopCounter be 0.\
\
13. While true:\
       1. Increment innerLoopCounter by 1.\
\
       2. Let node be the element immediately above node in the\
           [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements), or if node is no longer in the [stack of\\
           open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) (e.g. because it got removed by this algorithm), the element that was immediately above node in\
           the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) before node was removed.\
\
       3. If node is formattingElement, then [break](https://infra.spec.whatwg.org/#iteration-break).\
\
       4. If innerLoopCounter is greater than 3 and node is in the\
           [list of active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements), then remove node from the\
           [list of active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements).\
\
       5. If node is not in the [list of active\\
           formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements), then remove node from the [stack of open\\
           elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) and [continue](https://infra.spec.whatwg.org/#iteration-continue).\
\
       6. [Create an element for the token](https://html.spec.whatwg.org/multipage/parsing.html#create-an-element-for-the-token) for which the element node was\
           created, in the [HTML namespace](https://infra.spec.whatwg.org/#html-namespace), with commonAncestor as the intended\
           parent; replace the entry for node in the [list of active formatting\\
           elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements) with an entry for the new element, replace the entry for node in\
           the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) with an entry for the new element, and let\
           node be the new element.\
\
       7. If lastNode is furthestBlock, then move the aforementioned\
           bookmark to be immediately after the new node in the [list of active\\
           formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements).\
\
       8. [Append](https://dom.spec.whatwg.org/#concept-node-append) lastNode to\
           node.\
\
       9. Set lastNode to node.\
14. Let (target, refNode) be the [adjusted insertion\\
        location](https://html.spec.whatwg.org/multipage/parsing.html#adjusted-insertion-location) given (commonAncestor, null).\
\
15. If lastNode's [parent](https://dom.spec.whatwg.org/#concept-tree-parent) is non-null, then [remove](https://dom.spec.whatwg.org/#concept-node-remove) lastNode.\
\
16. If all of the following are true:\
\
\
       - lastNode's [parent](https://dom.spec.whatwg.org/#concept-tree-parent) is null;\
       - lastNode is not a [host-including inclusive ancestor](https://dom.spec.whatwg.org/#concept-tree-host-including-inclusive-ancestor) of\
          target;\
       - target is not a `Document` node, or it does not have an element\
          child; and\
       - refNode is null or its [parent](https://dom.spec.whatwg.org/#concept-tree-parent) is target,\
\
then:\
       1. [Assert](https://infra.spec.whatwg.org/#assert): [ensure pre-insert validity](https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity) given\
           lastNode, target, refNode, and « » does not throw.\
\
       2. [Insert](https://dom.spec.whatwg.org/#concept-node-insert) lastNode into\
           target before refNode.\
17. [Create an element for the token](https://html.spec.whatwg.org/multipage/parsing.html#create-an-element-for-the-token) for which formattingElement was created,\
        in the [HTML namespace](https://infra.spec.whatwg.org/#html-namespace), with furthestBlock as the intended parent.\
\
18. Take all of the child nodes of furthestBlock and append them to the\
        element created in the last step.\
\
19. Append that new element to furthestBlock.\
\
20. Remove formattingElement from the [list of active formatting\\
        elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements), and insert the new element into the [list of active formatting\\
        elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements) at the position of the aforementioned bookmark.\
\
21. Remove formattingElement from the [stack of open\\
        elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements), and insert the new element into the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements)\
        immediately below the position of furthestBlock in that stack.\
\
This algorithm's name, the "adoption agency algorithm", comes from the way it\
causes elements to change parents, and is in contrast with [other possible algorithms](https://ln.hixie.ch/?start=1037910467&count=1) for dealing\
with misnested content.\
\
###### 13.2.6.4.8 The "text" insertion mode\
\
When the user agent is to apply the rules for the " [text](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-incdata)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode), the user agent must handle the token as\
follows:\
\
A character token\
\
[Insert the token's character](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-character).\
\
This can never be a U+0000 NULL character; the tokenizer converts those to\
U+FFFD REPLACEMENT CHARACTER characters.\
\
An end-of-file token\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
If the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) is a `script` element, then set its [already\\
started](https://html.spec.whatwg.org/multipage/scripting.html#already-started) to true.\
\
Pop the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) off the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to the [original insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#original-insertion-mode) and\
reprocess the token.\
\
An end tag whose tag name is "script"\
\
If the [active speculative HTML parser](https://html.spec.whatwg.org/multipage/parsing.html#active-speculative-html-parser) is null and the [JavaScript execution\\
context stack](https://tc39.es/ecma262/#execution-context-stack) is empty, then [perform a microtask checkpoint](https://html.spec.whatwg.org/multipage/webappapis.html#perform-a-microtask-checkpoint).\
\
Let script be the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) (which will be a\
`script` element).\
\
Pop the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) off the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to the [original insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#original-insertion-mode).\
\
Let the old insertion point have the same value as the current\
[insertion point](https://html.spec.whatwg.org/multipage/parsing.html#insertion-point). Let the [insertion point](https://html.spec.whatwg.org/multipage/parsing.html#insertion-point) be just before the [next\\
input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character).\
\
Increment the parser's [script nesting level](https://html.spec.whatwg.org/multipage/parsing.html#script-nesting-level) by one.\
\
If the [active speculative HTML parser](https://html.spec.whatwg.org/multipage/parsing.html#active-speculative-html-parser) is null, then [prepare the script\\
element](https://html.spec.whatwg.org/multipage/scripting.html#prepare-the-script-element) script. This might cause some script to execute, which might cause\
[new characters to be inserted into the tokenizer](https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-document-write), and\
might cause the tokenizer to output more tokens, resulting in a [reentrant invocation of the parser](https://html.spec.whatwg.org/multipage/parsing.html#nestedParsing).\
\
Decrement the parser's [script nesting level](https://html.spec.whatwg.org/multipage/parsing.html#script-nesting-level) by one. If the parser's [script\\
nesting level](https://html.spec.whatwg.org/multipage/parsing.html#script-nesting-level) is zero, then set the [parser pause flag](https://html.spec.whatwg.org/multipage/parsing.html#parser-pause-flag) to false.\
\
Let the [insertion point](https://html.spec.whatwg.org/multipage/parsing.html#insertion-point) have the value of the old insertion\
point. (In other words, restore the [insertion point](https://html.spec.whatwg.org/multipage/parsing.html#insertion-point) to its previous value.\
This value might be the "undefined" value.)\
\
At this stage, if the [pending parsing-blocking\\
script](https://html.spec.whatwg.org/multipage/scripting.html#pending-parsing-blocking-script) is not null:\
\
If the [script nesting level](https://html.spec.whatwg.org/multipage/parsing.html#script-nesting-level) is not zero:\
\
Set the [parser pause flag](https://html.spec.whatwg.org/multipage/parsing.html#parser-pause-flag) to true, and abort the processing of any nested\
invocations of the tokenizer, yielding control back to the caller. (Tokenization will resume\
when the caller returns to the "outer" tree construction stage.)\
\
The tree construction stage of this particular parser is [being called reentrantly](https://html.spec.whatwg.org/multipage/parsing.html#nestedParsing), say from a call to `document.write()`.\
\
Otherwise:\
\
While the [pending parsing-blocking script](https://html.spec.whatwg.org/multipage/scripting.html#pending-parsing-blocking-script) is not null:\
\
01. Let the script be the [pending parsing-blocking\\
     script](https://html.spec.whatwg.org/multipage/scripting.html#pending-parsing-blocking-script).\
\
02. Set the [pending parsing-blocking script](https://html.spec.whatwg.org/multipage/scripting.html#pending-parsing-blocking-script) to null.\
\
03. [Start the speculative HTML parser](https://html.spec.whatwg.org/multipage/parsing.html#start-the-speculative-html-parser) for this instance of the HTML\
     parser.\
\
04. Block the [tokenizer](https://html.spec.whatwg.org/multipage/parsing.html#tokenization) for this instance of the\
     [HTML parser](https://html.spec.whatwg.org/multipage/parsing.html#html-parser), such that the [event loop](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop) will not run [tasks](https://html.spec.whatwg.org/multipage/webappapis.html#concept-task) that invoke the [tokenizer](https://html.spec.whatwg.org/multipage/parsing.html#tokenization).\
\
05. If the parser's `Document` [has a style sheet that is blocking\\
     scripts](https://html.spec.whatwg.org/multipage/semantics.html#has-a-style-sheet-that-is-blocking-scripts) or the script's [ready to be parser-executed](https://html.spec.whatwg.org/multipage/scripting.html#ready-to-be-parser-executed) is false:\
     [spin the event loop](https://html.spec.whatwg.org/multipage/webappapis.html#spin-the-event-loop) until the parser's `Document` [has no style\\
     sheet that is blocking scripts](https://html.spec.whatwg.org/multipage/semantics.html#has-no-style-sheet-that-is-blocking-scripts) and the script's [ready to be\\
     parser-executed](https://html.spec.whatwg.org/multipage/scripting.html#ready-to-be-parser-executed) becomes true.\
\
06. If this [parser has been aborted](https://html.spec.whatwg.org/multipage/parsing.html#abort-a-parser) in the meantime,\
     return.\
\
    This could happen if, e.g., while the [spin the event loop](https://html.spec.whatwg.org/multipage/webappapis.html#spin-the-event-loop)\
     algorithm is running, the `Document` gets [destroyed](https://html.spec.whatwg.org/multipage/document-lifecycle.html#destroy-a-document), or the `document.open()`\
     method gets invoked on the `Document`.\
\
07. [Stop the speculative HTML parser](https://html.spec.whatwg.org/multipage/parsing.html#stop-the-speculative-html-parser) for this instance of the HTML\
     parser.\
\
08. Unblock the [tokenizer](https://html.spec.whatwg.org/multipage/parsing.html#tokenization) for this instance of the\
     [HTML parser](https://html.spec.whatwg.org/multipage/parsing.html#html-parser), such that [tasks](https://html.spec.whatwg.org/multipage/webappapis.html#concept-task) that invoke the\
     [tokenizer](https://html.spec.whatwg.org/multipage/parsing.html#tokenization) can again be run.\
\
09. Let the [insertion point](https://html.spec.whatwg.org/multipage/parsing.html#insertion-point) be just before the [next input\\
     character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character).\
\
10. Increment the parser's [script nesting level](https://html.spec.whatwg.org/multipage/parsing.html#script-nesting-level) by one (it should be zero\
     before this step, so this sets it to one).\
\
11. [Execute the script element](https://html.spec.whatwg.org/multipage/scripting.html#execute-the-script-element) the script.\
\
12. Decrement the parser's [script nesting level](https://html.spec.whatwg.org/multipage/parsing.html#script-nesting-level) by one. If the parser's\
     [script nesting level](https://html.spec.whatwg.org/multipage/parsing.html#script-nesting-level) is zero (which it always should be at this point), then set\
     the [parser pause flag](https://html.spec.whatwg.org/multipage/parsing.html#parser-pause-flag) to false.\
\
13. Let the [insertion point](https://html.spec.whatwg.org/multipage/parsing.html#insertion-point) be undefined again.\
\
\
Any other end tag\
\
Pop the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) off the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to the [original insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#original-insertion-mode).\
\
###### 13.2.6.4.9 The "in table" insertion mode\
\
When the user agent is to apply the rules for the " [in\\
table](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intable)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode), the user agent must handle the token as follows:\
\
A character token, if the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) is `table`, `tbody`, `template`, `tfoot`, `thead`, or `tr` element\
\
Let the pending table character\
tokens be an empty list of tokens.\
\
Set the [original insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#original-insertion-mode) to the current [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode).\
\
Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in\\
table text](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intabletext)" and reprocess the token.\
\
A comment token\
\
[Insert a comment](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-comment).\
\
A processing instruction token\
\
[Insert a processing instruction](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-processing-instruction).\
\
A DOCTYPE token\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Ignore the token.\
\
A start tag whose tag name is "caption"\
\
[Clear the stack back to a table context](https://html.spec.whatwg.org/multipage/parsing.html#clear-the-stack-back-to-a-table-context). (See below.)\
\
Insert a [marker](https://html.spec.whatwg.org/multipage/parsing.html#concept-parser-marker) at the end of the [list of\\
active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements).\
\
[Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token, then switch the [insertion\\
mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in caption](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-incaption)".\
\
A start tag whose tag name is "colgroup"\
\
[Clear the stack back to a table context](https://html.spec.whatwg.org/multipage/parsing.html#clear-the-stack-back-to-a-table-context). (See below.)\
\
[Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token, then switch the [insertion\\
mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in column group](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-incolgroup)".\
\
A start tag whose tag name is "col"\
\
[Clear the stack back to a table context](https://html.spec.whatwg.org/multipage/parsing.html#clear-the-stack-back-to-a-table-context). (See below.)\
\
[Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for a "colgroup" start tag token with no attributes, then\
switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in\\
column group](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-incolgroup)".\
\
Reprocess the current token.\
\
A start tag whose tag name is one of: "tbody", "tfoot", "thead"\
\
[Clear the stack back to a table context](https://html.spec.whatwg.org/multipage/parsing.html#clear-the-stack-back-to-a-table-context). (See below.)\
\
[Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token, then switch the [insertion\\
mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in table body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intbody)".\
\
A start tag whose tag name is one of: "td", "th", "tr"\
\
[Clear the stack back to a table context](https://html.spec.whatwg.org/multipage/parsing.html#clear-the-stack-back-to-a-table-context). (See below.)\
\
[Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for a "tbody" start tag token with no attributes, then\
switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in table\\
body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intbody)".\
\
Reprocess the current token.\
\
A start tag whose tag name is "table"\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) does not [have a `table` element in table scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-table-scope), ignore the token.\
\
Otherwise:\
\
1. Pop elements from this stack until a `table` element has been popped from the\
    stack.\
\
2. [Reset the insertion mode appropriately](https://html.spec.whatwg.org/multipage/parsing.html#reset-the-insertion-mode-appropriately).\
\
3. Reprocess the token.\
\
\
An end tag whose tag name is "table"\
\
If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) does not [have a `table` element in table scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-table-scope), this is a [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors); ignore the token.\
\
Otherwise:\
\
1. Pop elements from this stack until a `table` element has been popped from the\
    stack.\
\
2. [Reset the insertion mode appropriately](https://html.spec.whatwg.org/multipage/parsing.html#reset-the-insertion-mode-appropriately).\
\
\
An end tag whose tag name is one of: "body", "caption", "col", "colgroup", "html", "tbody",\
"td", "tfoot", "th", "thead", "tr"\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Ignore the token.\
\
A start tag whose tag name is one of: "style", "script", "template"An end tag whose tag name is "template"\
\
Process the token [using the rules for](https://html.spec.whatwg.org/multipage/parsing.html#using-the-rules-for) the " [in head](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inhead)" [insertion\\
mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode).\
\
A start tag whose tag name is "input"\
\
If the token does not have an attribute with the name "type", or if it does, but that\
attribute's value is not an [ASCII case-insensitive](https://infra.spec.whatwg.org/#ascii-case-insensitive) match for "`hidden`", then act as described in the "anything else" entry below.\
\
Otherwise:\
\
1. [Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
2. [Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token.\
\
3. Pop that `input` element off the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
4. [Acknowledge the token's _self-closing_\\
_flag_](https://html.spec.whatwg.org/multipage/parsing.html#acknowledge-self-closing-flag), if it is set.\
\
\
A start tag whose tag name is "form"\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
If the [`form` element pointer](https://html.spec.whatwg.org/multipage/parsing.html#form-element-pointer) is not null, and the\
parser is not [parsing template contents](https://html.spec.whatwg.org/multipage/parsing.html#parsing-template-contents), then ignore the token.\
\
Otherwise:\
\
1. [Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token, and, if the parser is not\
    [parsing template contents](https://html.spec.whatwg.org/multipage/parsing.html#parsing-template-contents), set the [`form` element\\
    pointer](https://html.spec.whatwg.org/multipage/parsing.html#form-element-pointer) to point to the element created.\
\
2. Pop that `form` element off the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
\
An end-of-file token\
\
Process the token [using the rules for](https://html.spec.whatwg.org/multipage/parsing.html#using-the-rules-for) the " [in body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inbody)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode).\
\
Anything else\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Enable [foster parenting](https://html.spec.whatwg.org/multipage/parsing.html#foster-parent), process\
the token [using the rules for](https://html.spec.whatwg.org/multipage/parsing.html#using-the-rules-for) the " [in\\
body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inbody)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode), and then disable [foster\\
parenting](https://html.spec.whatwg.org/multipage/parsing.html#foster-parent).\
\
When the steps above require the UA to clear the stack back to a table context, it\
means that the UA must, while the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) is not a `table`,\
`template`, or `html` element, pop elements from the [stack of open\\
elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
This is the same list of elements as used in the _[has an element in table scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-table-scope)_ steps.\
\
The [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) being an `html` element after this\
process is a [fragment case](https://html.spec.whatwg.org/multipage/parsing.html#fragment-case).\
\
###### 13.2.6.4.10 The "in table text" insertion mode\
\
When the user agent is to apply the rules for the " [in table text](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intabletext)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode), the user agent must handle the token as\
follows:\
\
A character token that is U+0000 NULL\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Ignore the token.\
\
Any other character token\
\
Append the character token to the [pending\\
table character tokens](https://html.spec.whatwg.org/multipage/parsing.html#concept-pending-table-char-tokens) list.\
\
Anything else\
\
If any of the tokens in the [pending table\\
character tokens](https://html.spec.whatwg.org/multipage/parsing.html#concept-pending-table-char-tokens) list are character tokens that are not [ASCII whitespace](https://infra.spec.whatwg.org/#ascii-whitespace),\
then this is a [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors): reprocess the character tokens in the [pending table character tokens](https://html.spec.whatwg.org/multipage/parsing.html#concept-pending-table-char-tokens) list using the\
rules given in the "anything else" entry in the " [in\\
table](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intable)" insertion mode.\
\
Otherwise, [insert the characters](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-character) given by the [pending table character tokens](https://html.spec.whatwg.org/multipage/parsing.html#concept-pending-table-char-tokens) list.\
\
Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to the [original insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#original-insertion-mode) and\
reprocess the token.\
\
###### 13.2.6.4.11 The "in caption" insertion mode\
\
When the user agent is to apply the rules for the " [in\\
caption](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-incaption)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode), the user agent must handle the token as follows:\
\
An end tag whose tag name is "caption"\
\
If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) does not [have a `caption` element in table scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-table-scope), this is a [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors); ignore the token. ( [fragment case](https://html.spec.whatwg.org/multipage/parsing.html#fragment-case))\
\
Otherwise:\
\
1. [Generate implied end tags](https://html.spec.whatwg.org/multipage/parsing.html#generate-implied-end-tags).\
\
2. Now, if the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) is not a `caption` element, then this is a\
    [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
3. Pop elements from this stack until a `caption` element has been popped from the\
    stack.\
\
4. [Clear the list of active formatting elements up to the last marker](https://html.spec.whatwg.org/multipage/parsing.html#clear-the-list-of-active-formatting-elements-up-to-the-last-marker).\
\
5. Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in\\
    table](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intable)".\
\
\
A start tag whose tag name is one of: "caption", "col", "colgroup", "tbody", "td", "tfoot",\
"th", "thead", "tr"An end tag whose tag name is "table"\
\
If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) does not [have a `caption` element in table scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-table-scope), this is a [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors); ignore the token. ( [fragment case](https://html.spec.whatwg.org/multipage/parsing.html#fragment-case))\
\
Otherwise:\
\
1. [Generate implied end tags](https://html.spec.whatwg.org/multipage/parsing.html#generate-implied-end-tags).\
\
2. Now, if the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) is not a `caption` element, then this is a\
    [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
3. Pop elements from this stack until a `caption` element has been popped from the\
    stack.\
\
4. [Clear the list of active formatting elements up to the last marker](https://html.spec.whatwg.org/multipage/parsing.html#clear-the-list-of-active-formatting-elements-up-to-the-last-marker).\
\
5. Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in\\
    table](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intable)".\
\
6. Reprocess the token.\
\
\
An end tag whose tag name is one of: "body", "col", "colgroup", "html", "tbody", "td",\
"tfoot", "th", "thead", "tr"\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Ignore the token.\
\
Anything else\
\
Process the token [using the rules for](https://html.spec.whatwg.org/multipage/parsing.html#using-the-rules-for) the " [in body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inbody)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode).\
\
###### 13.2.6.4.12 The "in column group" insertion mode\
\
When the user agent is to apply the rules for the " [in column group](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-incolgroup)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode), the user agent must handle the token\
as follows:\
\
A character token that is one of U+0009 CHARACTER TABULATION, U+000A LINE FEED (LF), U+000C\
FORM FEED (FF), U+000D CARRIAGE RETURN (CR), or U+0020 SPACE\
\
[Insert the character](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-character).\
\
A comment token\
\
[Insert a comment](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-comment).\
\
A processing instruction token\
\
[Insert a processing instruction](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-processing-instruction).\
\
A DOCTYPE token\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Ignore the token.\
\
A start tag whose tag name is "html"\
\
Process the token [using the rules for](https://html.spec.whatwg.org/multipage/parsing.html#using-the-rules-for) the " [in body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inbody)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode).\
\
A start tag whose tag name is "col"\
\
[Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token. Immediately pop the [current\\
node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) off the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
[Acknowledge the token's _self-closing_\\
_flag_](https://html.spec.whatwg.org/multipage/parsing.html#acknowledge-self-closing-flag), if it is set.\
\
An end tag whose tag name is "colgroup"\
\
If the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) is not a `colgroup` element, then this is a\
[parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors); ignore the token.\
\
Otherwise, pop the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) from the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in\\
table](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intable)".\
\
An end tag whose tag name is "col"\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Ignore the token.\
\
A start tag whose tag name is "template"An end tag whose tag name is "template"\
\
Process the token [using the rules for](https://html.spec.whatwg.org/multipage/parsing.html#using-the-rules-for) the " [in head](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inhead)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode).\
\
An end-of-file token\
\
Process the token [using the rules for](https://html.spec.whatwg.org/multipage/parsing.html#using-the-rules-for) the " [in body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inbody)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode).\
\
Anything else\
\
If the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) is not a `colgroup` element, then this is a\
[parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors); ignore the token.\
\
Otherwise, pop the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) from the [stack of open\\
elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in\\
table](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intable)".\
\
Reprocess the token.\
\
###### 13.2.6.4.13 The "in table body" insertion mode\
\
When the user agent is to apply the rules for the " [in table body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intbody)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode), the user agent must handle the token as\
follows:\
\
A start tag whose tag name is "tr"\
\
[Clear the stack back to a table body context](https://html.spec.whatwg.org/multipage/parsing.html#clear-the-stack-back-to-a-table-body-context). (See below.)\
\
[Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token, then switch the [insertion\\
mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in row](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intr)".\
\
A start tag whose tag name is one of: "th", "td"\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
[Clear the stack back to a table body context](https://html.spec.whatwg.org/multipage/parsing.html#clear-the-stack-back-to-a-table-body-context). (See below.)\
\
[Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for a "tr" start tag token with no attributes, then\
switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in\\
row](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intr)".\
\
Reprocess the current token.\
\
An end tag whose tag name is one of: "tbody", "tfoot",\
"thead"\
\
If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) does not [have an element in table scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-table-scope) that is an [HTML\\
element](https://html.spec.whatwg.org/multipage/infrastructure.html#html-elements) with the same tag name as the token, this is a [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors);\
ignore the token.\
\
Otherwise:\
\
1. [Clear the stack back to a table body context](https://html.spec.whatwg.org/multipage/parsing.html#clear-the-stack-back-to-a-table-body-context). (See below.)\
\
2. Pop the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) from the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements). Switch the\
    [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in table](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intable)".\
\
\
A start tag whose tag name is one of: "caption", "col",\
"colgroup", "tbody", "tfoot", "thead"An end tag whose tag name is "table"\
\
If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) does not [have a `tbody`, `thead`, or `tfoot` element in table\\
scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-table-scope), this is a [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors); ignore the token.\
\
Otherwise:\
\
1. [Clear the stack back to a table body context](https://html.spec.whatwg.org/multipage/parsing.html#clear-the-stack-back-to-a-table-body-context). (See below.)\
\
2. Pop the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) from the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements). Switch the\
    [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in table](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intable)".\
\
3. Reprocess the token.\
\
\
An end tag whose tag name is one of: "body", "caption", "col", "colgroup", "html", "td",\
"th", "tr"\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Ignore the token.\
\
Anything else\
\
Process the token [using the rules for](https://html.spec.whatwg.org/multipage/parsing.html#using-the-rules-for) the " [in table](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intable)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode).\
\
When the steps above require the UA to clear the stack back to a table body context,\
it means that the UA must, while the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) is not a `tbody`,\
`tfoot`, `thead`, `template`, or `html` element, pop\
elements from the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
The [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) being an `html` element after this\
process is a [fragment case](https://html.spec.whatwg.org/multipage/parsing.html#fragment-case).\
\
###### 13.2.6.4.14 The "in row" insertion mode\
\
When the user agent is to apply the rules for the " [in\\
row](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intr)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode), the user agent must handle the token as follows:\
\
A start tag whose tag name is one of: "th", "td"\
\
[Clear the stack back to a table row context](https://html.spec.whatwg.org/multipage/parsing.html#clear-the-stack-back-to-a-table-row-context). (See below.)\
\
[Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token, then switch the [insertion\\
mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in cell](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intd)".\
\
Insert a [marker](https://html.spec.whatwg.org/multipage/parsing.html#concept-parser-marker) at the end of the [list of\\
active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements).\
\
An end tag whose tag name is "tr"\
\
If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) does not [have a `tr` element in table scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-table-scope), this is a [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors);\
ignore the token.\
\
Otherwise:\
\
1. [Clear the stack back to a table row context](https://html.spec.whatwg.org/multipage/parsing.html#clear-the-stack-back-to-a-table-row-context). (See below.)\
\
2. Pop the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) (which will be a `tr` element) from the\
    [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements). Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in table body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intbody)".\
\
\
A start tag whose tag name is one of: "caption", "col", "colgroup", "tbody", "tfoot",\
"thead", "tr"An end tag whose tag name is "table"\
\
If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) does not [have a `tr` element in table scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-table-scope), this is a [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors);\
ignore the token.\
\
Otherwise:\
\
1. [Clear the stack back to a table row context](https://html.spec.whatwg.org/multipage/parsing.html#clear-the-stack-back-to-a-table-row-context). (See below.)\
\
2. Pop the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) (which will be a `tr` element) from the\
    [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements). Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in table body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intbody)".\
\
3. Reprocess the token.\
\
\
An end tag whose tag name is one of: "tbody", "tfoot", "thead"\
\
If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) does not [have an element in table scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-table-scope) that is an [HTML\\
element](https://html.spec.whatwg.org/multipage/infrastructure.html#html-elements) with the same tag name as the token, this is a [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors);\
ignore the token.\
\
If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) does not [have a `tr` element in table scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-table-scope), ignore the token.\
\
Otherwise:\
\
1. [Clear the stack back to a table row context](https://html.spec.whatwg.org/multipage/parsing.html#clear-the-stack-back-to-a-table-row-context). (See below.)\
\
2. Pop the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) (which will be a `tr` element) from the\
    [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements). Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in table body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intbody)".\
\
3. Reprocess the token.\
\
\
An end tag whose tag name is one of: "body", "caption", "col", "colgroup", "html", "td",\
"th"\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Ignore the token.\
\
Anything else\
\
Process the token [using the rules for](https://html.spec.whatwg.org/multipage/parsing.html#using-the-rules-for) the " [in table](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intable)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode).\
\
When the steps above require the UA to clear the stack back to a table row context,\
it means that the UA must, while the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) is not a `tr`,\
`template`, or `html` element, pop elements from the [stack of open\\
elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
The [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) being an `html` element after this\
process is a [fragment case](https://html.spec.whatwg.org/multipage/parsing.html#fragment-case).\
\
###### 13.2.6.4.15 The "in cell" insertion mode\
\
When the user agent is to apply the rules for the " [in cell](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intd)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode), the user agent must handle the token as follows:\
\
An end tag whose tag name is one of: "td", "th"\
\
If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) does not [have an element in table scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-table-scope) that is an [HTML\\
element](https://html.spec.whatwg.org/multipage/infrastructure.html#html-elements) with the same tag name as that of the token, then this is a [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors); ignore the token.\
\
Otherwise:\
\
1. [Generate implied end tags](https://html.spec.whatwg.org/multipage/parsing.html#generate-implied-end-tags).\
\
2. Now, if the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) is not an [HTML\\
    element](https://html.spec.whatwg.org/multipage/infrastructure.html#html-elements) with the same tag name as the token, then this is a [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
3. Pop elements from the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) until an [HTML element](https://html.spec.whatwg.org/multipage/infrastructure.html#html-elements) with the same tag name as the token has been popped from the\
    stack.\
\
4. [Clear the list of active formatting elements up to the last marker](https://html.spec.whatwg.org/multipage/parsing.html#clear-the-list-of-active-formatting-elements-up-to-the-last-marker).\
\
5. Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in\\
    row](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intr)".\
\
\
A start tag whose tag name is one of: "caption", "col",\
"colgroup", "tbody", "td", "tfoot", "th", "thead", "tr"\
\
[Assert](https://infra.spec.whatwg.org/#assert): the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) [has a `td` or `th` element in table scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-table-scope).\
\
[Close the cell](https://html.spec.whatwg.org/multipage/parsing.html#close-the-cell) (see below) and reprocess the token.\
\
An end tag whose tag name is one of: "body", "caption",\
"col", "colgroup", "html"\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Ignore the token.\
\
An end tag whose tag name is one of: "table", "tbody",\
"tfoot", "thead", "tr"\
\
If the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) does not [have an element in table scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-table-scope) that is an [HTML\\
element](https://html.spec.whatwg.org/multipage/infrastructure.html#html-elements) with the same tag name as that of the token, then this is a [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors); ignore the token.\
\
Otherwise, [close the cell](https://html.spec.whatwg.org/multipage/parsing.html#close-the-cell) (see below) and reprocess the token.\
\
Anything else\
\
Process the token [using the rules for](https://html.spec.whatwg.org/multipage/parsing.html#using-the-rules-for) the " [in body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inbody)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode).\
\
Where the steps above say to close the cell, they mean to run the following\
algorithm:\
\
1. [Generate implied end tags](https://html.spec.whatwg.org/multipage/parsing.html#generate-implied-end-tags).\
\
2. If the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) is not now a `td` element or a `th`\
    element, then this is a [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
3. Pop elements from the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) until a `td`\
    element or a `th` element has been popped from the stack.\
\
4. [Clear the list of active formatting elements up to the last marker](https://html.spec.whatwg.org/multipage/parsing.html#clear-the-list-of-active-formatting-elements-up-to-the-last-marker).\
\
5. Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in\\
    row](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intr)".\
\
\
The [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) cannot have both a `td` and a\
`th` element [in table scope](https://html.spec.whatwg.org/multipage/parsing.html#has-an-element-in-table-scope) at the\
same time, nor can it have neither when the [close the cell](https://html.spec.whatwg.org/multipage/parsing.html#close-the-cell) algorithm is invoked.\
\
###### 13.2.6.4.16 The "in template" insertion mode\
\
When the user agent is to apply the rules for the " [in\\
template](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intemplate)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode), the user agent must handle the token as follows:\
\
A character tokenA comment tokenA processing instruction tokenA DOCTYPE token\
\
Process the token [using the rules for](https://html.spec.whatwg.org/multipage/parsing.html#using-the-rules-for) the " [in body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inbody)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode).\
\
A start tag whose tag name is one of: "base", "basefont", "bgsound", "link", "meta", "noframes", "script", "style", "template", "title"An end tag whose tag name is "template"\
\
Process the token [using the rules for](https://html.spec.whatwg.org/multipage/parsing.html#using-the-rules-for) the " [in head](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inhead)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode).\
\
A start tag whose tag name is one of: "caption", "colgroup", "tbody", "tfoot", "thead"\
\
Pop the [current template insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#current-template-insertion-mode) off the [stack of template\\
insertion modes](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-template-insertion-modes).\
\
Push " [in table](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intable)" onto the [stack of\\
template insertion modes](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-template-insertion-modes) so that it is the new [current template insertion\\
mode](https://html.spec.whatwg.org/multipage/parsing.html#current-template-insertion-mode).\
\
Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in\\
table](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intable)", and reprocess the token.\
\
A start tag whose tag name is "col"\
\
Pop the [current template insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#current-template-insertion-mode) off the [stack of template\\
insertion modes](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-template-insertion-modes).\
\
Push " [in column group](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-incolgroup)" onto the\
[stack of template insertion modes](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-template-insertion-modes) so that it is the new [current template\\
insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#current-template-insertion-mode).\
\
Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in\\
column group](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-incolgroup)", and reprocess the token.\
\
A start tag whose tag name is "tr"\
\
Pop the [current template insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#current-template-insertion-mode) off the [stack of template\\
insertion modes](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-template-insertion-modes).\
\
Push " [in table body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intbody)" onto the [stack\\
of template insertion modes](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-template-insertion-modes) so that it is the new [current template insertion\\
mode](https://html.spec.whatwg.org/multipage/parsing.html#current-template-insertion-mode).\
\
Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in\\
table body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intbody)", and reprocess the token.\
\
A start tag whose tag name is one of: "td", "th"\
\
Pop the [current template insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#current-template-insertion-mode) off the [stack of template\\
insertion modes](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-template-insertion-modes).\
\
Push " [in row](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intr)" onto the [stack of template\\
insertion modes](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-template-insertion-modes) so that it is the new [current template insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#current-template-insertion-mode).\
\
Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in\\
row](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intr)", and reprocess the token.\
\
Any other start tag\
\
Pop the [current template insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#current-template-insertion-mode) off the [stack of template\\
insertion modes](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-template-insertion-modes).\
\
Push " [in body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inbody)" onto the [stack of template\\
insertion modes](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-template-insertion-modes) so that it is the new [current template insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#current-template-insertion-mode).\
\
Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in\\
body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inbody)", and reprocess the token.\
\
Any other end tag\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Ignore the token.\
\
An end-of-file token\
\
If there is no `template` element on the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements), then\
[stop parsing](https://html.spec.whatwg.org/multipage/parsing.html#stop-parsing). ( [fragment case](https://html.spec.whatwg.org/multipage/parsing.html#fragment-case))\
\
Otherwise, this is a [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
Pop elements from the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) until a `template`\
element has been popped from the stack.\
\
[Clear the list of active formatting elements up to the last marker](https://html.spec.whatwg.org/multipage/parsing.html#clear-the-list-of-active-formatting-elements-up-to-the-last-marker).\
\
Pop the [current template insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#current-template-insertion-mode) off the [stack of template\\
insertion modes](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-template-insertion-modes).\
\
[Reset the insertion mode appropriately](https://html.spec.whatwg.org/multipage/parsing.html#reset-the-insertion-mode-appropriately).\
\
Reprocess the token.\
\
###### 13.2.6.4.17 The "after body" insertion mode\
\
When the user agent is to apply the rules for the " [after body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-afterbody)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode), the user agent must handle the token as follows:\
\
A character token that is one of U+0009 CHARACTER TABULATION, U+000A LINE FEED (LF), U+000C\
FORM FEED (FF), U+000D CARRIAGE RETURN (CR), or U+0020 SPACE\
\
Process the token [using the rules for](https://html.spec.whatwg.org/multipage/parsing.html#using-the-rules-for) the " [in body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inbody)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode).\
\
A comment token\
\
[Insert a comment](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-comment) given (the first element in the [stack of open\\
elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) (the `html` element), null).\
\
A processing instruction token\
\
[Insert a processing instruction](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-processing-instruction) given (the first element in the [stack of\\
open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) (the `html` element), null).\
\
A DOCTYPE token\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Ignore the token.\
\
A start tag whose tag name is "html"\
\
Process the token [using the rules for](https://html.spec.whatwg.org/multipage/parsing.html#using-the-rules-for) the " [in body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inbody)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode).\
\
An end tag whose tag name is "html"\
\
If the parser's [fragment context element](https://html.spec.whatwg.org/multipage/parsing.html#fragment-context-element) is non-null, this is a [parse\\
error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors); ignore the token. ( [fragment case](https://html.spec.whatwg.org/multipage/parsing.html#fragment-case))\
\
Otherwise, switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [after after body](https://html.spec.whatwg.org/multipage/parsing.html#the-after-after-body-insertion-mode)".\
\
An end-of-file token\
\
[Stop parsing](https://html.spec.whatwg.org/multipage/parsing.html#stop-parsing).\
\
Anything else\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inbody)" and reprocess the token.\
\
###### 13.2.6.4.18 The "in frameset" insertion mode\
\
When the user agent is to apply the rules for the " [in\\
frameset](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inframeset)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode), the user agent must handle the token as follows:\
\
A character token that is one of U+0009 CHARACTER TABULATION, U+000A LINE FEED (LF), U+000C\
FORM FEED (FF), U+000D CARRIAGE RETURN (CR), or U+0020 SPACE\
\
[Insert the character](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-character).\
\
A comment token\
\
[Insert a comment](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-comment).\
\
A processing instruction token\
\
[Insert a processing instruction](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-processing-instruction).\
\
A DOCTYPE token\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Ignore the token.\
\
A start tag whose tag name is "html"\
\
Process the token [using the rules for](https://html.spec.whatwg.org/multipage/parsing.html#using-the-rules-for) the " [in body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inbody)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode).\
\
A start tag whose tag name is "frameset"\
\
[Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token.\
\
An end tag whose tag name is "frameset"\
\
If the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) is the root `html` element, then this is a\
[parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors); ignore the token. ( [fragment case](https://html.spec.whatwg.org/multipage/parsing.html#fragment-case))\
\
Otherwise, pop the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) from the [stack of open\\
elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
If the parser's [fragment context element](https://html.spec.whatwg.org/multipage/parsing.html#fragment-context-element) is null and the [current\\
node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) is no longer a `frameset` element, then switch the [insertion\\
mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [after frameset](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-afterframeset)".\
\
A start tag whose tag name is "frame"\
\
[Insert an HTML element](https://html.spec.whatwg.org/multipage/parsing.html#insert-an-html-element) for the token. Immediately pop the [current\\
node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) off the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
[Acknowledge the token's _self-closing_\\
_flag_](https://html.spec.whatwg.org/multipage/parsing.html#acknowledge-self-closing-flag), if it is set.\
\
A start tag whose tag name is "noframes"\
\
Process the token [using the rules for](https://html.spec.whatwg.org/multipage/parsing.html#using-the-rules-for) the " [in head](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inhead)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode).\
\
An end-of-file token\
\
If the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) is not the root `html` element, then this is a\
[parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
The [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) can only be the root\
`html` element in the [fragment case](https://html.spec.whatwg.org/multipage/parsing.html#fragment-case).\
\
[Stop parsing](https://html.spec.whatwg.org/multipage/parsing.html#stop-parsing).\
\
Anything else\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Ignore the token.\
\
###### 13.2.6.4.19 The "after frameset" insertion mode\
\
When the user agent is to apply the rules for the " [after frameset](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-afterframeset)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode), the user agent must handle the token\
as follows:\
\
A character token that is one of U+0009 CHARACTER TABULATION, U+000A LINE FEED (LF), U+000C\
FORM FEED (FF), U+000D CARRIAGE RETURN (CR), or U+0020 SPACE\
\
[Insert the character](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-character).\
\
A comment token\
\
[Insert a comment](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-comment).\
\
A processing instruction token\
\
[Insert a processing instruction](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-processing-instruction).\
\
A DOCTYPE token\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Ignore the token.\
\
A start tag whose tag name is "html"\
\
Process the token [using the rules for](https://html.spec.whatwg.org/multipage/parsing.html#using-the-rules-for) the " [in body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inbody)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode).\
\
An end tag whose tag name is "html"\
\
Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [after after frameset](https://html.spec.whatwg.org/multipage/parsing.html#the-after-after-frameset-insertion-mode)".\
\
A start tag whose tag name is "noframes"\
\
Process the token [using the rules for](https://html.spec.whatwg.org/multipage/parsing.html#using-the-rules-for) the " [in head](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inhead)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode).\
\
An end-of-file token\
\
[Stop parsing](https://html.spec.whatwg.org/multipage/parsing.html#stop-parsing).\
\
Anything else\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Ignore the token.\
\
###### 13.2.6.4.20 The "after after body" insertion mode\
\
When the user agent is to apply the rules for the " [after after body](https://html.spec.whatwg.org/multipage/parsing.html#the-after-after-body-insertion-mode)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode), the user agent must handle the token\
as follows:\
\
A comment token\
\
[Insert a comment](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-comment) given (the `Document` object, null).\
\
A processing instruction token\
\
[Insert a processing instruction](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-processing-instruction) given (the `Document` object,\
null).\
\
A DOCTYPE tokenA character token that is one of U+0009 CHARACTER TABULATION, U+000A LINE FEED (LF), U+000C\
FORM FEED (FF), U+000D CARRIAGE RETURN (CR), or U+0020 SPACEA start tag whose tag name is "html"\
\
Process the token [using the rules for](https://html.spec.whatwg.org/multipage/parsing.html#using-the-rules-for) the " [in body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inbody)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode).\
\
An end-of-file token\
\
[Stop parsing](https://html.spec.whatwg.org/multipage/parsing.html#stop-parsing).\
\
Anything else\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Switch the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) to " [in body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inbody)" and reprocess the token.\
\
###### 13.2.6.4.21 The "after after frameset" insertion mode\
\
When the user agent is to apply the rules for the " [after after frameset](https://html.spec.whatwg.org/multipage/parsing.html#the-after-after-frameset-insertion-mode)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode), the user agent must handle the\
token as follows:\
\
A comment token\
\
[Insert a comment](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-comment) given (the `Document` object, null).\
\
A processing instruction token\
\
[Insert a processing instruction](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-processing-instruction) given (the `Document` object,\
null).\
\
A DOCTYPE tokenA character token that is one of U+0009 CHARACTER TABULATION, U+000A LINE FEED (LF), U+000C\
FORM FEED (FF), U+000D CARRIAGE RETURN (CR), or U+0020 SPACEA start tag whose tag name is "html"\
\
Process the token [using the rules for](https://html.spec.whatwg.org/multipage/parsing.html#using-the-rules-for) the " [in body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inbody)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode).\
\
An end-of-file token\
\
[Stop parsing](https://html.spec.whatwg.org/multipage/parsing.html#stop-parsing).\
\
A start tag whose tag name is "noframes"\
\
Process the token [using the rules for](https://html.spec.whatwg.org/multipage/parsing.html#using-the-rules-for) the " [in head](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inhead)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode).\
\
Anything else\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Ignore the token.\
\
##### 13.2.6.5 The rules for parsing tokens in foreign content\
\
When the user agent is to apply the rules for parsing tokens in foreign content, the user agent\
must handle the token as follows:\
\
A character token that is U+0000 NULL\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). [Insert a U+FFFD REPLACEMENT\\
CHARACTER character](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-character).\
\
A character token that is one of U+0009 CHARACTER TABULATION, U+000A LINE FEED (LF), U+000C\
FORM FEED (FF), U+000D CARRIAGE RETURN (CR), or U+0020 SPACE\
\
[Insert the token's character](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-character).\
\
Any other character token\
\
[Insert the token's character](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-character).\
\
Set the [frameset-ok flag](https://html.spec.whatwg.org/multipage/parsing.html#frameset-ok-flag) to "not ok".\
\
A comment token\
\
[Insert a comment](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-comment).\
\
A processing instruction token\
\
[Insert a processing instruction](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-processing-instruction).\
\
A DOCTYPE token\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors). Ignore the token.\
\
A start tag whose tag name is one of: "b", "big", "blockquote", "body", "br", "center", "code", "dd", "div", "dl", "dt", "em", "embed", "h1", "h2", "h3", "h4", "h5", "h6", "head", "hr", "i", "img",\
"li", "listing",\
"menu", "meta", "nobr", "ol", "p", "pre", "ruby", "s", "small", "span", "strong", "strike", "sub",\
"sup", "table", "tt", "u", "ul", "var"A start tag whose tag name is "font", if the token has any attributes named "color", "face",\
or "size"An end tag whose tag name is "br", "p"\
\
[Parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
While the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) is not a [MathML text integration point](https://html.spec.whatwg.org/multipage/parsing.html#mathml-text-integration-point), an\
[HTML integration point](https://html.spec.whatwg.org/multipage/parsing.html#html-integration-point), or an element in the [HTML namespace](https://infra.spec.whatwg.org/#html-namespace), pop\
elements from the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
Reprocess the token according to the rules given in the section corresponding to the current\
[insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) in HTML content.\
\
Any other start tag\
\
If the [adjusted current node](https://html.spec.whatwg.org/multipage/parsing.html#adjusted-current-node) is an element in the [MathML namespace](https://infra.spec.whatwg.org/#mathml-namespace),\
[adjust MathML attributes](https://html.spec.whatwg.org/multipage/parsing.html#adjust-mathml-attributes) for the token. (This fixes the case of MathML attributes\
that are not all lowercase.)\
\
If the [adjusted current node](https://html.spec.whatwg.org/multipage/parsing.html#adjusted-current-node) is an element in the [SVG namespace](https://infra.spec.whatwg.org/#svg-namespace), and the\
token's tag name is one of the ones in the first column of the following table, change the tag\
name to the name given in the corresponding cell in the second column. (This fixes the case of\
SVG elements that are not all lowercase.)\
\
| Tag name | Element name |\
| --- | --- |\
| `altglyph` | `altGlyph` |\
| `altglyphdef` | `altGlyphDef` |\
| `altglyphitem` | `altGlyphItem` |\
| `animatecolor` | `animateColor` |\
| `animatemotion` | `animateMotion` |\
| `animatetransform` | `animateTransform` |\
| `clippath` | `clipPath` |\
| `feblend` | `feBlend` |\
| `fecolormatrix` | `feColorMatrix` |\
| `fecomponenttransfer` | `feComponentTransfer` |\
| `fecomposite` | `feComposite` |\
| `feconvolvematrix` | `feConvolveMatrix` |\
| `fediffuselighting` | `feDiffuseLighting` |\
| `fedisplacementmap` | `feDisplacementMap` |\
| `fedistantlight` | `feDistantLight` |\
| `fedropshadow` | `feDropShadow` |\
| `feflood` | `feFlood` |\
| `fefunca` | `feFuncA` |\
| `fefuncb` | `feFuncB` |\
| `fefuncg` | `feFuncG` |\
| `fefuncr` | `feFuncR` |\
| `fegaussianblur` | `feGaussianBlur` |\
| `feimage` | `feImage` |\
| `femerge` | `feMerge` |\
| `femergenode` | `feMergeNode` |\
| `femorphology` | `feMorphology` |\
| `feoffset` | `feOffset` |\
| `fepointlight` | `fePointLight` |\
| `fespecularlighting` | `feSpecularLighting` |\
| `fespotlight` | `feSpotLight` |\
| `fetile` | `feTile` |\
| `feturbulence` | `feTurbulence` |\
| `foreignobject` | `foreignObject` |\
| `glyphref` | `glyphRef` |\
| `lineargradient` | `linearGradient` |\
| `radialgradient` | `radialGradient` |\
| `textpath` | `textPath` |\
\
If the [adjusted current node](https://html.spec.whatwg.org/multipage/parsing.html#adjusted-current-node) is an element in the [SVG namespace](https://infra.spec.whatwg.org/#svg-namespace),\
[adjust SVG attributes](https://html.spec.whatwg.org/multipage/parsing.html#adjust-svg-attributes) for the token. (This fixes the case of SVG attributes that\
are not all lowercase.)\
\
[Adjust foreign attributes](https://html.spec.whatwg.org/multipage/parsing.html#adjust-foreign-attributes) for the token. (This fixes the use of namespaced\
attributes, in particular XLink in SVG.)\
\
[Insert a foreign element](https://html.spec.whatwg.org/multipage/parsing.html#insert-a-foreign-element) for the token, with the [adjusted current\\
node](https://html.spec.whatwg.org/multipage/parsing.html#adjusted-current-node)'s namespace and false.\
\
If the token has its _[self-closing flag](https://html.spec.whatwg.org/multipage/parsing.html#self-closing-flag)_ set, then run the appropriate steps from the\
following list:\
\
If the token's tag name is "script", and the new [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) is in the [SVG namespace](https://infra.spec.whatwg.org/#svg-namespace)\
\
[Acknowledge the token's _self-closing_\\
_flag_](https://html.spec.whatwg.org/multipage/parsing.html#acknowledge-self-closing-flag), and then act as described in the steps for a "script" end tag below.\
\
Otherwise\
\
Pop the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) off the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) and [acknowledge the token's _self-closing_\\
_flag_](https://html.spec.whatwg.org/multipage/parsing.html#acknowledge-self-closing-flag).\
\
An end tag whose tag name is "script", if the [current\\
node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) is an [SVG `script`](https://w3c.github.io/svgwg/svg2-draft/interact.html#elementdef-script) element\
\
Pop the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) off the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
Let the old insertion point have the same value as the current\
[insertion point](https://html.spec.whatwg.org/multipage/parsing.html#insertion-point). Let the [insertion point](https://html.spec.whatwg.org/multipage/parsing.html#insertion-point) be just before the [next\\
input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character).\
\
Increment the parser's [script nesting level](https://html.spec.whatwg.org/multipage/parsing.html#script-nesting-level) by one. Set the [parser pause\\
flag](https://html.spec.whatwg.org/multipage/parsing.html#parser-pause-flag) to true.\
\
If the [active speculative HTML parser](https://html.spec.whatwg.org/multipage/parsing.html#active-speculative-html-parser) is null and the user agent supports SVG,\
then [Process the\\
SVG `script` element](https://www.w3.org/TR/SVGMobile12/script.html#ScriptContentProcessing) according to the SVG rules. [\[SVG\]](https://html.spec.whatwg.org/multipage/references.html#refsSVG)\
\
Even if this causes [new characters to be\\
inserted into the tokenizer](https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-document-write), the parser will not be executed reentrantly, since the\
[parser pause flag](https://html.spec.whatwg.org/multipage/parsing.html#parser-pause-flag) is true.\
\
Decrement the parser's [script nesting level](https://html.spec.whatwg.org/multipage/parsing.html#script-nesting-level) by one. If the parser's [script\\
nesting level](https://html.spec.whatwg.org/multipage/parsing.html#script-nesting-level) is zero, then set the [parser pause flag](https://html.spec.whatwg.org/multipage/parsing.html#parser-pause-flag) to false.\
\
Let the [insertion point](https://html.spec.whatwg.org/multipage/parsing.html#insertion-point) have the value of the old insertion\
point. (In other words, restore the [insertion point](https://html.spec.whatwg.org/multipage/parsing.html#insertion-point) to its previous value.\
This value might be the "undefined" value.)\
\
Any other end tag\
\
Run these steps:\
\
1. Initialize node to be the [current node](https://html.spec.whatwg.org/multipage/parsing.html#current-node) (the bottommost\
    node of the stack).\
\
2. If node's tag name, [converted to ASCII lowercase](https://infra.spec.whatwg.org/#ascii-lowercase), is\
    not the same as the tag name of the token, then this is a [parse error](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors).\
\
3. _Loop_: If node is the topmost element in the [stack of\\
    open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements), then return. ( [fragment case](https://html.spec.whatwg.org/multipage/parsing.html#fragment-case))\
\
4. If node's tag name, [converted to ASCII lowercase](https://infra.spec.whatwg.org/#ascii-lowercase), is\
    the same as the tag name of the token, pop elements from the [stack of open\\
    elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) until node has been popped from the stack, and then return.\
\
5. Set node to the previous entry in the [stack of open\\
    elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
6. If node is not an element in the [HTML namespace](https://infra.spec.whatwg.org/#html-namespace), return\
    to the step labeled _loop_.\
\
7. Otherwise, process the token according to the rules given in the section corresponding\
    to the current [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) in HTML content.\
\
\
#### 13.2.7 The end\
\
**✔** MDN\
\
[Document/DOMContentLoaded\_event](https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event "The DOMContentLoaded event fires when the initial HTML document has been completely loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading.")\
\
Support in all current engines.\
\
Firefox1+Safari3.1+Chrome1+\
\
* * *\
\
Opera9+Edge79+\
\
* * *\
\
Edge (Legacy)12+Internet Explorer9+\
\
* * *\
\
Firefox Android?Safari iOS?Chrome Android?WebView Android?Samsung Internet?Opera Android10.1+\
\
[Window/load\_event](https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event "The load event is fired when the whole page has loaded, including all dependent resources such as stylesheets, scripts, iframes, and images. This is in contrast to DOMContentLoaded, which is fired as soon as the page DOM has been loaded, without waiting for resources to finish loading.")\
\
Support in all current engines.\
\
Firefox1+Safari1.3+Chrome1+\
\
* * *\
\
Opera4+Edge79+\
\
* * *\
\
Edge (Legacy)12+Internet Explorer4+\
\
* * *\
\
Firefox Android?Safari iOS?Chrome Android?WebView Android?Samsung Internet?Opera Android10.1+\
\
Once the user agent stops parsing the document, the user agent\
must run the following steps:\
\
01. If the [active speculative HTML parser](https://html.spec.whatwg.org/multipage/parsing.html#active-speculative-html-parser) is not null, then [stop the\\
     speculative HTML parser](https://html.spec.whatwg.org/multipage/parsing.html#stop-the-speculative-html-parser) and return.\
\
02. Set the [insertion point](https://html.spec.whatwg.org/multipage/parsing.html#insertion-point) to undefined.\
\
03. [Update the current document readiness](https://html.spec.whatwg.org/multipage/dom.html#update-the-current-document-readiness) to "`interactive`".\
\
04. Pop _all_ the nodes off the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
05. While the [list of scripts that will execute when the document has finished\\
     parsing](https://html.spec.whatwg.org/multipage/scripting.html#list-of-scripts-that-will-execute-when-the-document-has-finished-parsing) is not empty:\
\
    1. [Spin the event loop](https://html.spec.whatwg.org/multipage/webappapis.html#spin-the-event-loop) until the first `script` in the [list\\
        of scripts that will execute when the document has finished parsing](https://html.spec.whatwg.org/multipage/scripting.html#list-of-scripts-that-will-execute-when-the-document-has-finished-parsing) has its [ready\\
        to be parser-executed](https://html.spec.whatwg.org/multipage/scripting.html#ready-to-be-parser-executed) set to true _and_ the parser's `Document` [has no style sheet that is blocking scripts](https://html.spec.whatwg.org/multipage/semantics.html#has-no-style-sheet-that-is-blocking-scripts).\
\
    2. [Execute the script element](https://html.spec.whatwg.org/multipage/scripting.html#execute-the-script-element) given by the first `script` in\
        the [list of scripts that will execute when the document has finished\\
        parsing](https://html.spec.whatwg.org/multipage/scripting.html#list-of-scripts-that-will-execute-when-the-document-has-finished-parsing).\
\
    3. Remove the first `script` element from the [list of scripts that will\\
        execute when the document has finished parsing](https://html.spec.whatwg.org/multipage/scripting.html#list-of-scripts-that-will-execute-when-the-document-has-finished-parsing) (i.e. shift out the first entry in the\
        list).\
06. [Queue a global task](https://html.spec.whatwg.org/multipage/webappapis.html#queue-a-global-task) on the [DOM manipulation task source](https://html.spec.whatwg.org/multipage/webappapis.html#dom-manipulation-task-source) given the\
     `Document`'s [relevant global object](https://html.spec.whatwg.org/multipage/webappapis.html#concept-relevant-global) to run the following substeps:\
    1. Set the `Document`'s [load timing info](https://html.spec.whatwg.org/multipage/dom.html#load-timing-info)'s [DOM content loaded\\
        event start time](https://html.spec.whatwg.org/multipage/dom.html#dom-content-loaded-event-start-time) to the [current high resolution time](https://w3c.github.io/hr-time/#dfn-current-high-resolution-time) given the\
        `Document`'s [relevant global object](https://html.spec.whatwg.org/multipage/webappapis.html#concept-relevant-global).\
\
    2. [Fire an event](https://dom.spec.whatwg.org/#concept-event-fire) named `DOMContentLoaded` at the `Document`\
        object, with its `bubbles` attribute initialized to\
        true.\
\
    3. Set the `Document`'s [load timing info](https://html.spec.whatwg.org/multipage/dom.html#load-timing-info)'s [DOM content loaded\\
        event end time](https://html.spec.whatwg.org/multipage/dom.html#dom-content-loaded-event-end-time) to the [current high resolution time](https://w3c.github.io/hr-time/#dfn-current-high-resolution-time) given the\
        `Document`'s [relevant global object](https://html.spec.whatwg.org/multipage/webappapis.html#concept-relevant-global).\
\
    4. Enable the [client message queue](https://w3c.github.io/ServiceWorker/#dfn-client-message-queue) of the\
        `ServiceWorkerContainer` object whose associated [service worker client](https://w3c.github.io/ServiceWorker/#serviceworkercontainer-service-worker-client) is the\
        `Document` object's [relevant settings object](https://html.spec.whatwg.org/multipage/webappapis.html#relevant-settings-object).\
\
    5. Invoke [WebDriver BiDi DOM content loaded](https://w3c.github.io/webdriver-bidi/#webdriver-bidi-dom-content-loaded) with the `Document`'s\
        [browsing context](https://html.spec.whatwg.org/multipage/document-sequences.html#concept-document-bc), and a new [WebDriver BiDi\\
        navigation status](https://w3c.github.io/webdriver-bidi/#webdriver-bidi-navigation-status) whose [id](https://w3c.github.io/webdriver-bidi/#navigation-status-id) is the\
        `Document` object's [during-loading\\
        navigation ID for WebDriver BiDi](https://html.spec.whatwg.org/multipage/dom.html#concept-document-navigation-id), [status](https://w3c.github.io/webdriver-bidi/#navigation-status-status)\
        is "`pending`", and [url](https://w3c.github.io/webdriver-bidi/#navigation-status-url) is the `Document` object's [URL](https://dom.spec.whatwg.org/#concept-document-url).\
07. [Spin the event loop](https://html.spec.whatwg.org/multipage/webappapis.html#spin-the-event-loop) until the [set of scripts that will execute as soon\\
     as possible](https://html.spec.whatwg.org/multipage/scripting.html#set-of-scripts-that-will-execute-as-soon-as-possible) and the [list of scripts that will execute in order as soon as\\
     possible](https://html.spec.whatwg.org/multipage/scripting.html#list-of-scripts-that-will-execute-in-order-as-soon-as-possible) are empty.\
\
08. [Spin the event loop](https://html.spec.whatwg.org/multipage/webappapis.html#spin-the-event-loop) until there is nothing that delays the load event in the `Document`.\
\
09. [Queue a global task](https://html.spec.whatwg.org/multipage/webappapis.html#queue-a-global-task) on the [DOM manipulation task source](https://html.spec.whatwg.org/multipage/webappapis.html#dom-manipulation-task-source) given the\
     `Document`'s [relevant global object](https://html.spec.whatwg.org/multipage/webappapis.html#concept-relevant-global) to run the following steps:\
    01. [Update the current document readiness](https://html.spec.whatwg.org/multipage/dom.html#update-the-current-document-readiness) to "`complete`".\
\
    02. If the `Document` object's [browsing\\
         context](https://html.spec.whatwg.org/multipage/document-sequences.html#concept-document-bc) is null, then abort these steps.\
\
    03. Let window be the `Document`'s [relevant global\\
         object](https://html.spec.whatwg.org/multipage/webappapis.html#concept-relevant-global).\
\
    04. Set the `Document`'s [load timing info](https://html.spec.whatwg.org/multipage/dom.html#load-timing-info)'s [load event start\\
         time](https://html.spec.whatwg.org/multipage/dom.html#load-event-start-time) to the [current high resolution time](https://w3c.github.io/hr-time/#dfn-current-high-resolution-time) given window.\
\
    05. [Fire an event](https://dom.spec.whatwg.org/#concept-event-fire) named `load` at window, with _legacy target override_\
        _flag_ set.\
\
    06. Invoke [WebDriver BiDi load complete](https://w3c.github.io/webdriver-bidi/#webdriver-bidi-load-complete) with the `Document`'s [browsing context](https://html.spec.whatwg.org/multipage/document-sequences.html#concept-document-bc), and a new [WebDriver BiDi\\
         navigation status](https://w3c.github.io/webdriver-bidi/#webdriver-bidi-navigation-status) whose [id](https://w3c.github.io/webdriver-bidi/#navigation-status-id) is the\
         `Document` object's [during-loading\\
         navigation ID for WebDriver BiDi](https://html.spec.whatwg.org/multipage/dom.html#concept-document-navigation-id), [status](https://w3c.github.io/webdriver-bidi/#navigation-status-status)\
         is "`complete`", and [url](https://w3c.github.io/webdriver-bidi/#navigation-status-url) is the `Document` object's [URL](https://dom.spec.whatwg.org/#concept-document-url).\
\
    07. Set the `Document` object's [during-loading navigation ID for WebDriver BiDi](https://html.spec.whatwg.org/multipage/dom.html#concept-document-navigation-id)\
         to null.\
\
    08. Set the `Document`'s [load timing info](https://html.spec.whatwg.org/multipage/dom.html#load-timing-info)'s [load event end\\
         time](https://html.spec.whatwg.org/multipage/dom.html#load-event-end-time) to the [current high resolution time](https://w3c.github.io/hr-time/#dfn-current-high-resolution-time) given window.\
\
    09. [Assert](https://infra.spec.whatwg.org/#assert): `Document`'s [page showing](https://html.spec.whatwg.org/multipage/document-lifecycle.html#page-showing) is\
         false.\
\
    10. Set the `Document`'s [page showing](https://html.spec.whatwg.org/multipage/document-lifecycle.html#page-showing) to true.\
\
    11. [Fire a page transition event](https://html.spec.whatwg.org/multipage/nav-history-apis.html#fire-a-page-transition-event) named `pageshow` at window with false.\
\
    12. [Completely finish loading](https://html.spec.whatwg.org/multipage/document-lifecycle.html#completely-finish-loading) the `Document`.\
\
    13. [Queue the navigation timing entry](https://w3c.github.io/navigation-timing/#dfn-queue-the-navigation-timing-entry) for the `Document`.\
10. If the `Document`'s [print when loaded](https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#print-when-loaded) flag is set, then run the\
     [printing steps](https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#printing-steps).\
\
11. The `Document` is now ready for post-load tasks.\
\
\
When the user agent is to abort a parser, it must run the following steps:\
\
1. Throw away any pending content in the [input stream](https://html.spec.whatwg.org/multipage/parsing.html#input-stream), and discard any future\
    content that would have been added to it.\
\
2. [Stop the speculative HTML parser](https://html.spec.whatwg.org/multipage/parsing.html#stop-the-speculative-html-parser) for this HTML parser.\
\
3. [Update the current document readiness](https://html.spec.whatwg.org/multipage/dom.html#update-the-current-document-readiness) to "`interactive`".\
\
4. Pop _all_ the nodes off the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements).\
\
5. [Update the current document readiness](https://html.spec.whatwg.org/multipage/dom.html#update-the-current-document-readiness) to "`complete`".\
\
\
#### 13.2.8 Speculative HTML parsing\
\
User agents may implement an optimization, as described in this section, to speculatively fetch\
resources that are declared in the HTML markup while the HTML parser is waiting for a\
[pending parsing-blocking script](https://html.spec.whatwg.org/multipage/scripting.html#pending-parsing-blocking-script) to be fetched and executed, or during normal parsing,\
at the time [an element is created for a token](https://html.spec.whatwg.org/multipage/parsing.html#create-an-element-for-the-token).\
While this optimization is not defined in precise detail, there are some rules to consider for\
interoperability.\
\
Each [HTML parser](https://html.spec.whatwg.org/multipage/parsing.html#html-parser) can have an active speculative HTML parser. It\
is initially null.\
\
The speculative HTML parser must act like the normal HTML parser (e.g., the\
tree builder rules apply), with some exceptions:\
\
- The state of the normal HTML parser and the document itself must not be affected.\
\
  For example, the [next input character](https://html.spec.whatwg.org/multipage/parsing.html#next-input-character) or the [stack of open\\
   elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) for the normal HTML parser is not affected by the [speculative HTML\\
   parser](https://html.spec.whatwg.org/multipage/parsing.html#speculative-html-parser).\
\
- Bytes pushed into the HTML parser's [input byte stream](https://html.spec.whatwg.org/multipage/parsing.html#the-input-byte-stream) must also be pushed into\
   the speculative HTML parser's [input byte stream](https://html.spec.whatwg.org/multipage/parsing.html#the-input-byte-stream). Bytes read from the streams must\
   be independent.\
\
- The result of the speculative parsing is primarily a series of [speculative fetches](https://html.spec.whatwg.org/multipage/parsing.html#speculative-fetch). Which kinds of resources to speculatively fetch is\
   [implementation-defined](https://infra.spec.whatwg.org/#implementation-defined), but user agents must not speculatively fetch resources that\
   would not be fetched with the normal HTML parser, under the assumption that the script that is\
   blocking the HTML parser does nothing.\
\
  It is possible that the same markup is seen multiple times from the\
   [speculative HTML parser](https://html.spec.whatwg.org/multipage/parsing.html#speculative-html-parser) and then the normal HTML parser. It is expected that\
   duplicated fetches will be prevented by caching rules, which are not yet fully specified.\
\
\
A speculative fetch for a [speculative mock element](https://html.spec.whatwg.org/multipage/parsing.html#speculative-mock-element) element\
must follow these rules:\
\
Should some of these things be applied to the document "for real", even\
though they are found speculatively?\
\
- If the [speculative HTML parser](https://html.spec.whatwg.org/multipage/parsing.html#speculative-html-parser) encounters one of the following elements, then\
act as if that element is processed for the purpose of its effect of subsequent speculative\
fetches.\
  - A `base` element.\
  - A `meta` element whose `http-equiv`\
     attribute is in the [Content\\
     security policy](https://html.spec.whatwg.org/multipage/semantics.html#attr-meta-http-equiv-content-security-policy) state.\
  - A `meta` element whose `name` attribute is an\
     [ASCII case-insensitive](https://infra.spec.whatwg.org/#ascii-case-insensitive) match for "`referrer`".\
  - A `meta` element whose `name` attribute is an\
     [ASCII case-insensitive](https://infra.spec.whatwg.org/#ascii-case-insensitive) match for "`viewport`". (This can\
     affect whether a media query list [matches the environment](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#matches-the-environment).) [\[CSSDEVICEADAPT\]](https://html.spec.whatwg.org/multipage/references.html#refsCSSDEVICEADAPT)\
- Let url be the [URL](https://url.spec.whatwg.org/#concept-url) that element would fetch if it was\
processed normally. If there is no such [URL](https://url.spec.whatwg.org/#concept-url) or if it is the empty string, then do\
nothing. Otherwise, if url is already in the [list of speculative fetch\\
URLs](https://html.spec.whatwg.org/multipage/parsing.html#list-of-speculative-fetch-urls), then do nothing. Otherwise, fetch url as if the element was processed\
normally, and add url to the [list of speculative fetch URLs](https://html.spec.whatwg.org/multipage/parsing.html#list-of-speculative-fetch-urls).\
\
\
Each `Document` has a list of speculative fetch URLs, which is a\
[list](https://infra.spec.whatwg.org/#list) of [URLs](https://url.spec.whatwg.org/#concept-url), initially empty.\
\
To start the speculative HTML parser for an instance of an HTML parser\
parser:\
\
1. Optionally, return.\
\
This step allows user agents to opt out of speculative HTML parsing.\
\
2. If parser's [active speculative HTML parser](https://html.spec.whatwg.org/multipage/parsing.html#active-speculative-html-parser) is not null, then\
    [stop the speculative HTML parser](https://html.spec.whatwg.org/multipage/parsing.html#stop-the-speculative-html-parser) for parser.\
\
This can happen when `document.write()`\
    writes another parser-blocking script. For simplicity, this specification always restarts\
    speculative parsing, but user agents can implement a more efficient strategy, so long as the end\
    result is equivalent.\
\
3. Let speculativeParser be a new [speculative HTML parser](https://html.spec.whatwg.org/multipage/parsing.html#speculative-html-parser), with the\
    same state as parser.\
\
4. Let speculativeDoc be a new isomorphic representation of parser's\
    `Document`, where all elements are instead [speculative mock elements](https://html.spec.whatwg.org/multipage/parsing.html#speculative-mock-element). Let speculativeParser parse into\
    speculativeDoc.\
\
5. Set parser's [active speculative HTML parser](https://html.spec.whatwg.org/multipage/parsing.html#active-speculative-html-parser) to\
    speculativeParser.\
\
6. [In parallel](https://html.spec.whatwg.org/multipage/infrastructure.html#in-parallel), run speculativeParser until it is stopped or until it\
    reaches the end of its [input stream](https://html.spec.whatwg.org/multipage/parsing.html#input-stream).\
\
\
To stop the speculative HTML parser for an instance of an HTML parser\
parser:\
\
1. Let speculativeParser be parser's [active speculative HTML\\
    parser](https://html.spec.whatwg.org/multipage/parsing.html#active-speculative-html-parser).\
\
2. If speculativeParser is null, then return.\
\
3. Throw away any pending content in speculativeParser's [input\\
    stream](https://html.spec.whatwg.org/multipage/parsing.html#input-stream), and discard any future content that would have been added to it.\
\
4. Set parser's [active speculative HTML parser](https://html.spec.whatwg.org/multipage/parsing.html#active-speculative-html-parser) to null.\
\
\
The [speculative HTML parser](https://html.spec.whatwg.org/multipage/parsing.html#speculative-html-parser) will create [speculative mock elements](https://html.spec.whatwg.org/multipage/parsing.html#speculative-mock-element) instead of normal elements. DOM\
operations that the tree builder normally does on elements are expected to work appropriately on\
speculative mock elements.\
\
A speculative mock element is a [struct](https://infra.spec.whatwg.org/#struct) with the following [items](https://infra.spec.whatwg.org/#struct-item):\
\
- A [string](https://infra.spec.whatwg.org/#string) namespace, corresponding\
   to an element's [namespace](https://dom.spec.whatwg.org/#concept-element-namespace).\
\
- A [string](https://infra.spec.whatwg.org/#string) local name,\
   corresponding to an element's [local\\
   name](https://dom.spec.whatwg.org/#concept-element-local-name).\
\
- A [list](https://infra.spec.whatwg.org/#list) attribute list,\
   corresponding to an element's [attribute list](https://dom.spec.whatwg.org/#concept-element-attribute).\
\
- A [list](https://infra.spec.whatwg.org/#list) children, corresponding to\
   an element's [children](https://dom.spec.whatwg.org/#concept-tree-child).\
\
\
To create a speculative mock element given a namespace,\
tagName, and attributes:\
\
1. Let element be a new [speculative mock element](https://html.spec.whatwg.org/multipage/parsing.html#speculative-mock-element).\
\
2. Set element's [namespace](https://html.spec.whatwg.org/multipage/parsing.html#concept-mock-namespace) to\
    namespace.\
\
3. Set element's [local name](https://html.spec.whatwg.org/multipage/parsing.html#concept-mock-local-name) to\
    tagName.\
\
4. Set element's [attribute list](https://html.spec.whatwg.org/multipage/parsing.html#concept-mock-attribute-list)\
    to attributes.\
\
5. Set element's [children](https://html.spec.whatwg.org/multipage/parsing.html#concept-mock-children) to a new\
    empty [list](https://infra.spec.whatwg.org/#list).\
\
6. Optionally, perform a [speculative fetch](https://html.spec.whatwg.org/multipage/parsing.html#speculative-fetch) for element.\
\
7. Return element.\
\
\
When the tree builder says to insert an element into a `template` element's\
[template contents](https://html.spec.whatwg.org/multipage/scripting.html#template-contents), if that is a [speculative mock element](https://html.spec.whatwg.org/multipage/parsing.html#speculative-mock-element), and the\
`template` element's [template contents](https://html.spec.whatwg.org/multipage/scripting.html#template-contents) is not a\
`ShadowRoot` node, instead do nothing. URLs found speculatively inside\
non-declarative-shadow-root `template` elements might themselves be templates, and must\
not be speculatively fetched.\
\
#### 13.2.9 Coercing an HTML DOM into an infoset\
\
When an application uses an [HTML parser](https://html.spec.whatwg.org/multipage/parsing.html#html-parser) in conjunction with an XML pipeline, it is\
possible that the constructed DOM is not compatible with the XML tool chain in certain subtle\
ways. For example, an XML toolchain might not be able to represent attributes with the name `xmlns`, since they conflict with the Namespaces in XML syntax. There is also some\
data that the [HTML parser](https://html.spec.whatwg.org/multipage/parsing.html#html-parser) generates that isn't included in the DOM itself. This\
section specifies some rules for handling these issues.\
\
If the XML API being used doesn't support DOCTYPEs, the tool may drop DOCTYPEs altogether.\
\
If the XML API doesn't support attributes in no namespace that are named "`xmlns`", attributes whose names start with "`xmlns:`", or\
attributes in the [XMLNS namespace](https://infra.spec.whatwg.org/#xmlns-namespace), then the tool may drop such attributes.\
\
The tool may annotate the output with any namespace declarations required for proper\
operation.\
\
If the XML API being used restricts the allowable characters in the local names of elements and\
attributes, then the tool may map all element and attribute local names that the API wouldn't\
support to a set of names that _are_ allowed, by replacing any character that isn't\
supported with the uppercase letter U and the six digits of the character's code point when\
expressed in hexadecimal, using digits 0-9 and capital letters A-F as the symbols, in increasing\
numeric order.\
\
For example, the element name `foo<bar`, which can be\
output by the [HTML parser](https://html.spec.whatwg.org/multipage/parsing.html#html-parser), though it is neither a legal HTML element name nor a\
well-formed XML element name, would be converted into `fooU00003Cbar`, which\
_is_ a well-formed XML element name (though it's still not legal in HTML by any means).\
\
As another example, consider the attribute `xlink:href`.\
Used on a MathML element, it becomes, after being [adjusted](https://html.spec.whatwg.org/multipage/parsing.html#adjust-foreign-attributes), an attribute with a prefix "`xlink`" and a local\
name "`href`". However, used on an HTML element, it becomes an attribute with\
no prefix and the local name "`xlink:href`", which is not a valid NCName, and\
thus might not be accepted by an XML API. It could thus get converted, becoming "`xlinkU00003Ahref`".\
\
The resulting names from this conversion conveniently can't clash with any\
attribute generated by the [HTML parser](https://html.spec.whatwg.org/multipage/parsing.html#html-parser), since those are all either lowercase or those\
listed in the [adjust foreign attributes](https://html.spec.whatwg.org/multipage/parsing.html#adjust-foreign-attributes) algorithm's table.\
\
If the XML API restricts comments from having two consecutive U+002D HYPHEN-MINUS characters\
(--), the tool may insert a single U+0020 SPACE character between any such offending\
characters.\
\
If the XML API restricts comments from ending in a U+002D HYPHEN-MINUS character (-), the tool\
may insert a single U+0020 SPACE character at the end of such comments.\
\
If the XML API restricts allowed characters in character data, attribute values, or comments,\
the tool may replace any U+000C FORM FEED (FF) character with a U+0020 SPACE character, and any\
other literal non-XML character with a U+FFFD REPLACEMENT CHARACTER.\
\
If the tool has no way to convey out-of-band information, then the tool may drop the following\
information:\
\
- Whether the document is set to _[no-quirks mode](https://dom.spec.whatwg.org/#concept-document-no-quirks)_, _[limited-quirks mode](https://dom.spec.whatwg.org/#concept-document-limited-quirks)_, or\
   _[quirks mode](https://dom.spec.whatwg.org/#concept-document-quirks)_\
- The association between form controls and forms that aren't their nearest `form`\
   element ancestor (use of the [`form` element pointer](https://html.spec.whatwg.org/multipage/parsing.html#form-element-pointer) in the parser)\
- The [template contents](https://html.spec.whatwg.org/multipage/scripting.html#template-contents) of any `template` elements.\
\
The mutations allowed by this section apply _after_ the [HTML\\
parser](https://html.spec.whatwg.org/multipage/parsing.html#html-parser)'s rules have been applied. For example, a `<a::>` start tag\
will be closed by a `</a::>` end tag, and never by a `</aU00003AU00003A>` end tag, even if the user agent is using the rules above to\
then generate an actual element in the DOM with the name `aU00003AU00003A` for\
that start tag.\
\
#### 13.2.10 An introduction to error handling and strange cases in the parser\
\
_This section is non-normative._\
\
This section examines some erroneous markup and discusses how the [HTML parser](https://html.spec.whatwg.org/multipage/parsing.html#html-parser)\
handles these cases.\
\
##### 13.2.10.1 Misnested tags: <b><i></b></i>\
\
_This section is non-normative._\
\
The most-often discussed example of erroneous markup is as follows:\
\
```\
<p>1<b>2<i>3</b>4</i>5</p>\
```\
\
The parsing of this markup is straightforward up to the "3". At this point, the DOM looks like\
this:\
\
- `html`\
  - `head`\
  - `body`\
    - `p`\
      - `#text`: 1\
      - `b`\
        - `#text`: 2\
        - `i`\
          - `#text`: 3\
\
Here, the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) has five elements on it: `html`,\
`body`, `p`, `b`, and `i`. The [list of active\\
formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements) just has two: `b` and `i`. The [insertion\\
mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) is " [in body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inbody)".\
\
Upon receiving the end tag token with the tag name "b", the " [adoption\\
agency algorithm](https://html.spec.whatwg.org/multipage/parsing.html#adoptionAgency)" is invoked. This is a simple case, in that the formattingElement\
is the `b` element, and there is no furthest block.\
Thus, the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) ends up with just three elements: `html`,\
`body`, and `p`, while the [list of active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements)\
has just one: `i`. The DOM tree is unmodified at this point.\
\
The next token is a character ("4"), triggers the [reconstruction of the active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#reconstruct-the-active-formatting-elements), in this case just\
the `i` element. A new `i` element is thus created for the "4"\
`Text` node. After the end tag token for the "i" is also received, and the "5"\
`Text` node is inserted, the DOM looks as follows:\
\
- `html`\
  - `head`\
  - `body`\
    - `p`\
      - `#text`: 1\
      - `b`\
        - `#text`: 2\
        - `i`\
          - `#text`: 3\
      - `i`\
        - `#text`: 4\
      - `#text`: 5\
\
##### 13.2.10.2 Misnested tags: <b><p></b></p>\
\
_This section is non-normative._\
\
A case similar to the previous one is the following:\
\
```\
<b>1<p>2</b>3</p>\
```\
\
Up to the "2" the parsing here is straightforward:\
\
- `html`\
  - `head`\
  - `body`\
    - `b`\
      - `#text`: 1\
      - `p`\
        - `#text`: 2\
\
The interesting part is when the end tag token with the tag name "b" is parsed.\
\
Before that token is seen, the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) has four elements on it:\
`html`, `body`, `b`, and `p`. The [list of active\\
formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements) just has the one: `b`. The [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) is\
" [in body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inbody)".\
\
Upon receiving the end tag token with the tag name "b", the " [adoption\\
agency algorithm](https://html.spec.whatwg.org/multipage/parsing.html#adoptionAgency)" is invoked, as in the previous example. However, in this case, there\
_is_ a furthest block, namely the `p` element. Thus, this\
time the adoption agency algorithm isn't skipped over.\
\
The common ancestor is the `body` element. A conceptual\
"bookmark" marks the position of the `b` in the [list of active formatting\\
elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements), but since that list has only one element in it, the bookmark won't have much\
effect.\
\
As the algorithm progresses, node ends up set to the formatting element\
(`b`), and last node ends up set to the furthest\
block (`p`).\
\
The last node gets appended (moved) to the common\
ancestor, so that the DOM looks like:\
\
- `html`\
  - `head`\
  - `body`\
    - `b`\
      - `#text`: 1\
    - `p`\
      - `#text`: 2\
\
A new `b` element is created, and the children of the `p` element are\
moved to it:\
\
- `html`\
  - `head`\
  - `body`\
    - `b`\
      - `#text`: 1\
    - `p`\
\
- `b`\
  - `#text`: 2\
\
Finally, the new `b` element is appended to the `p` element, so that the\
DOM looks like:\
\
- `html`\
  - `head`\
  - `body`\
    - `b`\
      - `#text`: 1\
    - `p`\
      - `b`\
        - `#text`: 2\
\
The `b` element is removed from the [list of active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements)\
and the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements), so that when the "3" is parsed, it is appended to the\
`p` element:\
\
- `html`\
  - `head`\
  - `body`\
    - `b`\
      - `#text`: 1\
    - `p`\
      - `b`\
        - `#text`: 2\
      - `#text`: 3\
\
##### 13.2.10.3 Unexpected markup in tables\
\
_This section is non-normative._\
\
Error handling in tables is, for historical reasons, especially strange. For example, consider\
the following markup:\
\
```\
<table><b><tr><td>aaa</td></tr>bbb</table>ccc\
```\
\
The highlighted `b` element start tag is not allowed directly inside a table like\
that, and the parser handles this case by placing the element _before_ the table. (This is\
called _[foster parenting](https://html.spec.whatwg.org/multipage/parsing.html#foster-parent)_.) This can be seen by examining the DOM tree\
as it stands just after the `table` element's start tag has been seen:\
\
- `html`\
  - `head`\
  - `body`\
    - `table`\
\
...and then immediately after the `b` element start tag has been seen:\
\
- `html`\
  - `head`\
  - `body`\
    - `b`\
    - `table`\
\
At this point, the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) has on it the elements\
`html`, `body`, `table`, and `b` (in that order,\
despite the resulting DOM tree); the [list of active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements) just has the\
`b` element in it; and the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) is " [in table](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intable)".\
\
The `tr` start tag causes the `b` element to be popped off the stack and\
a `tbody` start tag to be implied; the `tbody` and `tr` elements\
are then handled in a rather straight-forward manner, taking the parser through the " [in table body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intbody)" and " [in row](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intr)" insertion modes, after which the DOM looks as follows:\
\
- `html`\
  - `head`\
  - `body`\
    - `b`\
    - `table`\
      - `tbody`\
        - `tr`\
\
Here, the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) has on it the elements `html`,\
`body`, `table`, `tbody`, and `tr`; the [list of\\
active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements) still has the `b` element in it; and the\
[insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) is " [in row](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intr)".\
\
The `td` element start tag token, after putting a `td` element on the\
tree, puts a [marker](https://html.spec.whatwg.org/multipage/parsing.html#concept-parser-marker) on the [list of active\\
formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements) (it also switches to the " [in\\
cell](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intd)" [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode)).\
\
- `html`\
  - `head`\
  - `body`\
    - `b`\
    - `table`\
      - `tbody`\
        - `tr`\
          - `td`\
\
The [marker](https://html.spec.whatwg.org/multipage/parsing.html#concept-parser-marker) means that when the "aaa" character\
tokens are seen, no `b` element is created to hold the resulting `Text`\
node:\
\
- `html`\
  - `head`\
  - `body`\
    - `b`\
    - `table`\
      - `tbody`\
        - `tr`\
          - `td`\
            - `#text`: aaa\
\
The end tags are handled in a straight-forward manner; after handling them, the [stack of\\
open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) has on it the elements `html`, `body`,\
`table`, and `tbody`; the [list of active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements)\
still has the `b` element in it (the [marker](https://html.spec.whatwg.org/multipage/parsing.html#concept-parser-marker)\
having been removed by the "td" end tag token); and the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) is " [in table body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intbody)".\
\
Thus it is that the "bbb" character tokens are found. These trigger the " [in table text](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intabletext)" insertion mode to be used (with the [original\\
insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#original-insertion-mode) set to " [in table body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intbody)").\
The character tokens are collected, and when the next token (the `table` element end\
tag) is seen, they are processed as a group. Since they are not all spaces, they are handled as\
per the "anything else" rules in the " [in table](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intable)"\
insertion mode, which defer to the " [in body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inbody)"\
insertion mode but with [foster parenting](https://html.spec.whatwg.org/multipage/parsing.html#foster-parent).\
\
When [the active formatting elements\\
are reconstructed](https://html.spec.whatwg.org/multipage/parsing.html#reconstruct-the-active-formatting-elements), a `b` element is created and [foster parented](https://html.spec.whatwg.org/multipage/parsing.html#foster-parent), and then the "bbb" `Text` node is appended to it:\
\
- `html`\
  - `head`\
  - `body`\
    - `b`\
    - `b`\
      - `#text`: bbb\
    - `table`\
      - `tbody`\
        - `tr`\
          - `td`\
            - `#text`: aaa\
\
The [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) has on it the elements `html`,\
`body`, `table`, `tbody`, and the new `b` (again, note\
that this doesn't match the resulting tree!); the [list of active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements)\
has the new `b` element in it; and the [insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode) is still " [in table body](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intbody)".\
\
Had the character tokens been only [ASCII whitespace](https://infra.spec.whatwg.org/#ascii-whitespace) instead of "bbb", then that\
[ASCII whitespace](https://infra.spec.whatwg.org/#ascii-whitespace) would just be appended to the `tbody` element.\
\
Finally, the `table` is closed by a "table" end tag. This pops all the nodes from\
the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) up to and including the `table` element, but it\
doesn't affect the [list of active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements), so the "ccc" character tokens\
after the table result in yet another `b` element being created, this time after the\
table:\
\
- `html`\
  - `head`\
  - `body`\
    - `b`\
    - `b`\
      - `#text`: bbb\
    - `table`\
      - `tbody`\
        - `tr`\
          - `td`\
            - `#text`: aaa\
    - `b`\
      - `#text`: ccc\
\
##### 13.2.10.4 Scripts that modify the page as it is being parsed\
\
_This section is non-normative._\
\
Consider the following markup, which for this example we will assume is the document with\
[URL](https://url.spec.whatwg.org/#concept-url)`https://example.com/inner`, being rendered as the content of\
an `iframe` in another document with the [URL](https://url.spec.whatwg.org/#concept-url)`https://example.com/outer`:\
\
```\
<div id=a>\
 <script>\
  var div = document.getElementById('a');\
  parent.document.body.appendChild(div);\
 </script>\
 <script>\
  alert(document.URL);\
 </script>\
</div>\
<script>\
 alert(document.URL);\
</script>\
```\
\
Up to the first "script" end tag, before the script is parsed, the result is relatively\
straightforward:\
\
- `html`\
  - `head`\
  - `body`\
    - `div``id`="`a`"\
      - `#text`:\
      - `script`\
        - `#text`: var div = document.getElementById('a'); ⏎ parent.document.body.appendChild(div);\
\
After the script is parsed, though, the `div` element and its child\
`script` element are gone:\
\
- `html`\
  - `head`\
  - `body`\
\
They are, at this point, in the `Document` of the aforementioned outer\
[browsing context](https://html.spec.whatwg.org/multipage/document-sequences.html#browsing-context). However, the [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) _still contains_\
_the `div` element_.\
\
Thus, when the second `script` element is parsed, it is inserted _into the outer_\
_`Document` object_.\
\
Those parsed into different `Document`s than the one the parser was created for do\
not execute, so the first alert does not show.\
\
Once the `div` element's end tag is parsed, the `div` element is popped\
off the stack, and so the next `script` element is in the inner\
`Document`:\
\
- `html`\
  - `head`\
  - `body`\
    - `script`\
      - `#text`: alert(document.URL);\
\
This script does execute, resulting in an alert that says "https://example.com/inner".\
\
##### 13.2.10.5 The execution of scripts that are moving across multiple documents\
\
_This section is non-normative._\
\
Elaborating on the example in the previous section, consider the case where the second\
`script` element is an external script (i.e. one with a `src` attribute). Since the element was not in the parser's\
`Document` when it was created, that external script is not even downloaded.\
\
In a case where a `script` element with a `src`\
attribute is parsed normally into its parser's `Document`, but while the external\
script is being downloaded, the element is moved to another document, the script continues to\
download, but does not execute.\
\
In general, moving `script` elements between `Document`s is\
considered a bad practice.\
\
##### 13.2.10.6 Unclosed formatting elements\
\
_This section is non-normative._\
\
The following markup shows how nested formatting elements (such as `b`) get\
collected and continue to be applied even as the elements they are contained in are closed, but\
that excessive duplicates are thrown away.\
\
```\
<!DOCTYPE html>\
<p><b class=x><b class=x><b><b class=x><b class=x><b>X\
<p>X\
<p><b><b class=x><b>X\
<p></b></b></b></b></b></b>X\
```\
\
The resulting DOM tree is as follows:\
\
- DOCTYPE: `html`\
- `html`\
  - `head`\
  - `body`\
    - `p`\
      - `b``class`="`x`"\
        - `b``class`="`x`"\
          - `b`\
            - `b``class`="`x`"\
              - `b``class`="`x`"\
                - `b`\
                  - `#text`: X⏎\
    - `p`\
      - `b``class`="`x`"\
        - `b`\
          - `b``class`="`x`"\
            - `b``class`="`x`"\
              - `b`\
                - `#text`: X⏎\
    - `p`\
      - `b``class`="`x`"\
        - `b`\
          - `b``class`="`x`"\
            - `b``class`="`x`"\
              - `b`\
                - `b`\
                  - `b``class`="`x`"\
                    - `b`\
                      - `#text`: X⏎\
    - `p`\
      - `#text`: X⏎\
\
Note how the second `p` element in the markup has no explicit `b`\
elements, but in the resulting DOM, up to three of each kind of formatting element (in this case\
three `b` elements with the class attribute, and two unadorned `b` elements)\
get reconstructed before the element's "X".\
\
Also note how this means that in the final paragraph only six `b` end tags are\
needed to completely clear the [list of active formatting elements](https://html.spec.whatwg.org/multipage/parsing.html#list-of-active-formatting-elements), even though nine\
`b` start tags have been seen up to this point.\
\
### 13.3 Serializing HTML fragments\
\
For the purposes of the following algorithm, an element serializes as void if its\
element type is one of the [void elements](https://html.spec.whatwg.org/multipage/syntax.html#void-elements), or is `basefont`,\
`bgsound`, `frame`, `keygen`, or `param`.\
\
The following steps form the HTML fragment serialization algorithm. The algorithm takes as input a DOM\
`Element`, `Document`, or `DocumentFragment` referred to as\
the node, a boolean serializableShadowRoots, and a\
`sequence<ShadowRoot>`shadowRoots, and returns a string.\
\
This algorithm serializes the _children_ of the node being serialized, not\
the node itself.\
\
1. If the node [serializes as void](https://html.spec.whatwg.org/multipage/parsing.html#serializes-as-void), then return the empty\
    string.\
\
2. Let s be a string, and initialize it to the empty string.\
\
3. If the node is a `template` element, then let the node instead be the `template` element's [template\\
    contents](https://html.spec.whatwg.org/multipage/scripting.html#template-contents) (a `DocumentFragment` node).\
\
4. If current node is a [shadow host](https://dom.spec.whatwg.org/#element-shadow-host):\
1. Let shadow be current node's\
       [shadow root](https://dom.spec.whatwg.org/#concept-element-shadow-root).\
\
2. If one of the following is true:\
\
\
      - serializableShadowRoots is true and shadow's\
         [serializable](https://dom.spec.whatwg.org/#shadowroot-serializable) is true; or\
\
      - shadowRoots contains shadow,\
\
\
then:\
      01. Append "`<template shadowrootmode="`".\
\
      02. If shadow's [mode](https://dom.spec.whatwg.org/#shadowroot-mode)\
           is "`open`", then append "`open`".\
           Otherwise, append "`closed`".\
\
      03. Append U+0022 (").\
\
      04. If shadow's [delegates focus](https://dom.spec.whatwg.org/#shadowroot-delegates-focus) is set, then append\
           "` shadowrootdelegatesfocus=""`".\
\
      05. If shadow's [serializable](https://dom.spec.whatwg.org/#shadowroot-serializable) is set, then append\
           "` shadowrootserializable=""`".\
\
      06. If shadow's [slot assignment](https://dom.spec.whatwg.org/#shadowroot-slot-assignment) is "`manual`", then append "` shadowrootslotassignment="manual"`".\
\
      07. If shadow's [clonable](https://dom.spec.whatwg.org/#shadowroot-clonable) is set, then append\
           "` shadowrootclonable=""`".\
\
      08. Let shouldAppendRegistryAttribute be the result of running these steps:\
          1. Let documentRegistry be shadow's [node document](https://dom.spec.whatwg.org/#concept-node-document)'s\
              [custom element registry](https://dom.spec.whatwg.org/#document-custom-element-registry).\
\
          2. Let shadowRegistry be shadow's [custom element registry](https://dom.spec.whatwg.org/#shadowroot-custom-element-registry).\
\
          3. If documentRegistry is null and shadowRegistry is null, then\
              return false.\
\
          4. If documentRegistry [is a global custom element registry](https://dom.spec.whatwg.org/#is-a-global-custom-element-registry) and\
              shadowRegistry [is a global custom element registry](https://dom.spec.whatwg.org/#is-a-global-custom-element-registry), then return\
              false.\
\
          5. Return true.\
      09. If shouldAppendRegistryAttribute is true, then append "` shadowrootcustomelementregistry=""`".\
\
      10. Append U+003E (>).\
\
      11. Append the value of running the [HTML fragment serialization algorithm](https://html.spec.whatwg.org/multipage/parsing.html#html-fragment-serialisation-algorithm) with\
           shadow, serializableShadowRoots, and shadowRoots (thus recursing\
           into this algorithm for that element).\
\
      12. Append "`</template>`".\
5. For each child node of the node, in [tree order](https://dom.spec.whatwg.org/#concept-tree-order), run the\
    following steps:\
1. Let current node be the child node being processed.\
\
2. Append the appropriate string from the following list to s:\
      If current node is an `Element`\
\
      If current node is an element in the [HTML namespace](https://infra.spec.whatwg.org/#html-namespace), the\
      [MathML namespace](https://infra.spec.whatwg.org/#mathml-namespace), or the [SVG namespace](https://infra.spec.whatwg.org/#svg-namespace), then let tagname be current node's local name. Otherwise, let tagname be current node's qualified name.\
\
\
\
      Append U+003C (<), followed by tagname.\
\
\
\
      For [HTML elements](https://html.spec.whatwg.org/multipage/infrastructure.html#html-elements) created by the [HTML parser](https://html.spec.whatwg.org/multipage/parsing.html#html-parser) or\
      `createElement()`, tagname will be\
      lowercase.\
\
\
\
      If current node's [`is` value](https://dom.spec.whatwg.org/#concept-element-is-value) is not null, and the element does not have an `is` attribute in its attribute list, then append "` is="`", followed by current node's [`is` value](https://dom.spec.whatwg.org/#concept-element-is-value) [escaped as described below](https://html.spec.whatwg.org/multipage/parsing.html#escapingString) in _attribute mode_,\
      and U+0022 (").\
\
\
\
      For each attribute that the element has, append U+0020 SPACE, the [attribute's serialized name as described below](https://html.spec.whatwg.org/multipage/parsing.html#attribute's-serialised-name),\
      "`="`", the attribute's value,\
      [escaped as described below](https://html.spec.whatwg.org/multipage/parsing.html#escapingString) in _attribute mode_,\
      and U+0022 (").\
\
\
\
      An attribute's serialized name\
      for the purposes of the previous paragraph must be determined as follows:\
\
      If the attribute has no namespace\
\
      The attribute's serialized name is the attribute's local name.\
\
\
\
      For attributes on [HTML elements](https://html.spec.whatwg.org/multipage/infrastructure.html#html-elements) set by the [HTML\\
      parser](https://html.spec.whatwg.org/multipage/parsing.html#html-parser) or by `setAttribute()`, the\
      local name will be lowercase.\
\
      If the attribute is in the [XML namespace](https://infra.spec.whatwg.org/#xml-namespace)\
\
      The attribute's serialized name is "`xml:`" followed by the\
      attribute's local name.\
\
      If the attribute is in the [XMLNS namespace](https://infra.spec.whatwg.org/#xmlns-namespace) and the attribute's local name\
       is `xmlns`\
\
      The attribute's serialized name is "`xmlns`".\
\
      If the attribute is in the [XMLNS namespace](https://infra.spec.whatwg.org/#xmlns-namespace) and the attribute's local name\
       is not `xmlns`\
\
      The attribute's serialized name is "`xmlns:`" followed by the\
      attribute's local name.\
\
      If the attribute is in the [XLink namespace](https://infra.spec.whatwg.org/#xlink-namespace)\
\
      The attribute's serialized name is "`xlink:`" followed by the\
      attribute's local name.\
\
      If the attribute is in some other namespace\
\
      The attribute's serialized name is the attribute's qualified name.\
\
\
\
      While the exact order of attributes is [implementation-defined](https://infra.spec.whatwg.org/#implementation-defined), and may\
      depend on factors such as the order that the attributes were given in the original markup,\
      the sort order must be stable, such that consecutive invocations of this algorithm serialize\
      an element's attributes in the same order.\
\
\
\
      Append U+003E (>).\
\
\
\
      If current node [serializes as void](https://html.spec.whatwg.org/multipage/parsing.html#serializes-as-void), then [continue](https://infra.spec.whatwg.org/#iteration-continue) on to the next\
      child node at this point.\
\
\
\
      Append the value of running the [HTML fragment serialization algorithm](https://html.spec.whatwg.org/multipage/parsing.html#html-fragment-serialisation-algorithm) with\
      current node, serializableShadowRoots, and shadowRoots (thus\
      recursing into this algorithm for that node), followed by "`</`",\
      tagname, and U+003E (>).\
\
      If current node is a `Text` node\
\
      If the parent of current node is a `style`,\
      `script`, `xmp`, `iframe`, `noembed`,\
      `noframes`, or `plaintext` element, or if the parent of current node is a `noscript` element and [scripting is enabled](https://html.spec.whatwg.org/multipage/webappapis.html#concept-n-script) for the node, then append the value of\
      current node's [data](https://dom.spec.whatwg.org/#concept-cd-data) literally.\
\
\
\
      Otherwise, append the value of current node's [data](https://dom.spec.whatwg.org/#concept-cd-data), [escaped as described\\
      below](https://html.spec.whatwg.org/multipage/parsing.html#escapingString).\
\
      If current node is a `Comment`\
\
      Append "`<!--`", followed by the value of current\
      node's [data](https://dom.spec.whatwg.org/#concept-cd-data), and "`-->`".\
\
      If current node is a `ProcessingInstruction`\
\
      Append "`<?`", followed by the value of current\
      node's [target](https://dom.spec.whatwg.org/#concept-pi-target), U+0020 SPACE, the value of\
      current node's [data](https://dom.spec.whatwg.org/#concept-cd-data), and "`?>`".\
\
      If current node is a `DocumentType`\
\
      Append "`<!DOCTYPE`", followed by the value of current\
      node's [name](https://dom.spec.whatwg.org/#concept-doctype-name) and U+003E (>).\
6. Return s.\
\
\
It is possible that the output of this\
algorithm, if parsed with an [HTML parser](https://html.spec.whatwg.org/multipage/parsing.html#html-parser), will not return the original tree\
structure. Tree structures that do not roundtrip a serialize and reparse step can also be produced\
by the [HTML parser](https://html.spec.whatwg.org/multipage/parsing.html#html-parser) itself, although such cases are typically non-conforming.\
\
For instance, if a `textarea` element to which a `Comment`\
node has been appended is serialized and the output is then reparsed, the comment will end up\
being displayed in the text control. Similarly, if, as a result of DOM manipulation, an element\
contains a comment that contains "`-->`", then when the result of\
serializing the element is parsed, the comment will be truncated at that point and the rest of\
the comment will be interpreted as markup. More examples would be making a `script`\
element contain a `Text` node with the text string "`</script>`", or having a `p` element that contains a\
`ul` element (as the `ul` element's [start\\
tag](https://html.spec.whatwg.org/multipage/syntax.html#syntax-start-tag) would imply the end tag for the `p`).\
\
This can enable cross-site scripting attacks. An example of this would be a page that lets the\
user enter some font family names that are then inserted into a CSS `style` block via\
the DOM and which then uses the `innerHTML` IDL\
attribute to get the HTML serialization of that `style` element: if the user enters\
"`</style><script>attack</script>`" as a font family name, `innerHTML` will return markup that, if parsed in a different\
context, would contain a `script` node, even though no `script` node\
existed in the original DOM.\
\
For example, consider the following markup:\
\
```\
<form id="outer"><div></form><form id="inner"><input>\
```\
\
This will be parsed into:\
\
- `html`\
  - `head`\
  - `body`\
    - `form``id`="`outer`"\
      - `div`\
        - `form``id`="`inner`"\
          - `input`\
\
The `input` element will be associated with the inner `form` element.\
Now, if this tree structure is serialized and reparsed, the `<form\
id="inner">` start tag will be ignored, and so the `input` element will be\
associated with the outer `form` element instead.\
\
```\
<html><head></head><body><form id="outer"><div><form id="inner"><input></form></div></form></body></html>\
```\
\
- `html`\
  - `head`\
  - `body`\
    - `form``id`="`outer`"\
      - `div`\
        - `input`\
\
As another example, consider the following markup:\
\
```\
<a><table><a>\
```\
\
This will be parsed into:\
\
- `html`\
  - `head`\
  - `body`\
    - `a`\
      - `a`\
      - `table`\
\
That is, the `a` elements are nested, because the second `a` element is\
[foster parented](https://html.spec.whatwg.org/multipage/parsing.html#foster-parent). After a serialize-reparse roundtrip, the\
`a` elements and the `table` element would all be siblings, because the\
second `<a>` start tag implicitly closes the first `a`\
element.\
\
```\
<html><head></head><body><a><a></a><table></table></a></body></html>\
```\
\
- `html`\
  - `head`\
  - `body`\
    - `a`\
    - `a`\
    - `table`\
\
For historical reasons, this algorithm does not roundtrip an initial U+000A (LF) character in\
`pre`, `textarea`, or `listing` elements, even though (in the\
first two cases) the markup being roundtripped can be conforming. The [HTML parser](https://html.spec.whatwg.org/multipage/parsing.html#html-parser)\
will drop such a character during parsing, but this algorithm does _not_ serialize an extra\
U+000A (LF) character.\
\
For example, consider the following markup:\
\
```\
<pre>\
\
Hello.</pre>\
```\
\
When this document is first parsed, the `pre` element's [child text\\
content](https://dom.spec.whatwg.org/#concept-child-text-content) starts with a single newline character. After a serialize-reparse roundtrip, the\
`pre` element's [child text content](https://dom.spec.whatwg.org/#concept-child-text-content) is simply "`Hello.`".\
\
Because of the special role of the `is` attribute in signaling the creation of [customized built-in elements](https://html.spec.whatwg.org/multipage/custom-elements.html#customized-built-in-element), in that it provides a mechanism for parsed\
HTML to set the element's [`is`\\
value](https://dom.spec.whatwg.org/#concept-element-is-value), we special-case its handling during serialization. This ensures that an element's\
[`is` value](https://dom.spec.whatwg.org/#concept-element-is-value) is preserved\
through serialize-parse roundtrips.\
\
When creating a [customized built-in element](https://html.spec.whatwg.org/multipage/custom-elements.html#customized-built-in-element) via the parser, a developer uses the\
`is` attribute directly; in such cases serialize-parse roundtrips\
work fine.\
\
```\
<script>\
window.SuperP = class extends HTMLParagraphElement {};\
customElements.define("super-p", SuperP, { extends: "p" });\
</script>\
\
<div id="container"><p is="super-p">Superb!</p></div>\
\
<script>\
console.log(container.innerHTML); // <p is="super-p">\
container.innerHTML = container.innerHTML;\
console.log(container.innerHTML); // <p is="super-p">\
console.assert(container.firstChild instanceof SuperP);\
</script>\
```\
\
But when creating a customized built-in element via its [constructor](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-element-constructor) or via `createElement()`, the `is`\
attribute is not added. Instead, the [`is` value](https://dom.spec.whatwg.org/#concept-element-is-value) (which is what the custom elements machinery uses) is set\
without intermediating through an attribute.\
\
```\
<script>\
container.innerHTML = "";\
const p = document.createElement("p", { is: "super-p" });\
container.appendChild(p);\
\
// The is attribute is not present in the DOM:\
console.assert(!p.hasAttribute("is"));\
\
// But the element is still a super-p:\
console.assert(p instanceof SuperP);\
</script>\
```\
\
To ensure that serialize-parse roundtrips still work, the serialization process explicitly\
writes out the element's [`is`\\
value](https://dom.spec.whatwg.org/#concept-element-is-value) as an `is` attribute:\
\
```\
<script>\
console.log(container.innerHTML); // <p is="super-p">\
container.innerHTML = container.innerHTML;\
console.log(container.innerHTML); // <p is="super-p">\
console.assert(container.firstChild instanceof SuperP);\
</script>\
```\
\
Escaping a string (for the purposes of the algorithm above)\
consists of running the following steps:\
\
1. Replace any occurrence of "`&`" character by "`&amp;`".\
\
2. Replace any occurrences of the U+00A0 NO-BREAK SPACE character by "`&nbsp;`".\
\
3. Replace any occurrences of the "`<`" character by\
    "`&lt;`".\
\
4. Replace any occurrences of the "`>`" character by\
    "`&gt;`".\
\
5. If the algorithm was invoked in the _attribute mode_, then replace any occurrences of\
    the "`"`" character by "`&quot;`".\
\
\
### 13.4 Parsing HTML fragments\
\
The HTML fragment parsing algorithm, given an `Element` or\
`DocumentFragment`target, a string input, an optional boolean\
allowDeclarativeShadowRoots (default false), and an optional [parser scripting\\
mode](https://html.spec.whatwg.org/multipage/parsing.html#parser-scripting-mode) scriptingMode (default [Inert](https://html.spec.whatwg.org/multipage/parsing.html#scripting-mode-inert)),\
is the following steps. They return a `DocumentFragment`.\
\
Parts marked fragment case in algorithms in the [HTML\\
parser](https://html.spec.whatwg.org/multipage/parsing.html#html-parser) section are parts that only occur if the parser's [fragment context\\
element](https://html.spec.whatwg.org/multipage/parsing.html#fragment-context-element) is non-null. The algorithms have been annotated with such markings for\
informational purposes only; such markings have no normative weight. If it is possible for a\
condition described as a [fragment case](https://html.spec.whatwg.org/multipage/parsing.html#fragment-case) to occur even when the parser's [fragment\\
context element](https://html.spec.whatwg.org/multipage/parsing.html#fragment-context-element) is null, then that is an error in the specification.\
\
01. [Assert](https://infra.spec.whatwg.org/#assert): scriptingMode is either [Inert](https://html.spec.whatwg.org/multipage/parsing.html#scripting-mode-inert) or [Fragment](https://html.spec.whatwg.org/multipage/parsing.html#scripting-mode-fragment).\
\
\
\
02. Let context be\
     target if target is an `Element`; otherwise\
     target's [host](https://dom.spec.whatwg.org/#concept-documentfragment-host).\
\
03. [Assert](https://infra.spec.whatwg.org/#assert): [context](https://html.spec.whatwg.org/multipage/parsing.html#concept-frag-parse-context) is\
     non-null.\
\
04. Let document be a `Document` node whose [type](https://dom.spec.whatwg.org/#concept-document-type) is "`html`".\
\
05. Let contextDocument be [context](https://html.spec.whatwg.org/multipage/parsing.html#concept-frag-parse-context)'s [node document](https://dom.spec.whatwg.org/#concept-node-document).\
\
06. If contextDocument is in [quirks mode](https://dom.spec.whatwg.org/#concept-document-quirks), then set\
     document's [mode](https://dom.spec.whatwg.org/#concept-document-mode) to "`quirks`".\
\
07. Otherwise, if contextDocument is in [limited-quirks mode](https://dom.spec.whatwg.org/#concept-document-limited-quirks), then set\
     document's [mode](https://dom.spec.whatwg.org/#concept-document-mode) to "`limited-quirks`".\
\
08. Create a new [HTML parser](https://html.spec.whatwg.org/multipage/parsing.html#html-parser) whose [allow declarative shadow roots](https://html.spec.whatwg.org/multipage/parsing.html#allow-declarative-shadow-roots) is\
     allowDeclarativeShadowRoots, and associate it with document.\
\
09. Set the parser's [fragment context element](https://html.spec.whatwg.org/multipage/parsing.html#fragment-context-element) to [context](https://html.spec.whatwg.org/multipage/parsing.html#concept-frag-parse-context).\
\
10. If contextDocument's [scripting is\\
     disabled](https://html.spec.whatwg.org/multipage/webappapis.html#concept-n-script), then set scriptingMode to [Disabled](https://html.spec.whatwg.org/multipage/parsing.html#scripting-mode-disabled).\
\
11. Set the parser's [scripting mode](https://html.spec.whatwg.org/multipage/parsing.html#scripting-mode) to scriptingMode.\
\
12. Set the state of the [HTML parser](https://html.spec.whatwg.org/multipage/parsing.html#html-parser)'s [tokenization](https://html.spec.whatwg.org/multipage/parsing.html#tokenization) stage as\
     follows, switching on [context](https://html.spec.whatwg.org/multipage/parsing.html#concept-frag-parse-context):\
    `title``textarea`Switch the tokenizer to the [RCDATA state](https://html.spec.whatwg.org/multipage/parsing.html#rcdata-state).`style``xmp``iframe``noembed``noframes`Switch the tokenizer to the [RAWTEXT state](https://html.spec.whatwg.org/multipage/parsing.html#rawtext-state).`script`Switch the tokenizer to the [script data state](https://html.spec.whatwg.org/multipage/parsing.html#script-data-state).`noscript`If [scripting mode](https://html.spec.whatwg.org/multipage/parsing.html#scripting-mode) is not [Disabled](https://html.spec.whatwg.org/multipage/parsing.html#scripting-mode-disabled), switch the tokenizer to the [RAWTEXT\\
     state](https://html.spec.whatwg.org/multipage/parsing.html#rawtext-state). Otherwise, leave the tokenizer in the [data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state).`plaintext`Switch the tokenizer to the [PLAINTEXT state](https://html.spec.whatwg.org/multipage/parsing.html#plaintext-state).Any other elementLeave the tokenizer in the [data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state).\
    For performance reasons, an implementation that does not report errors and\
     that uses the actual state machine described in this specification directly could use the\
     PLAINTEXT state instead of the RAWTEXT and script data states where those are mentioned in the\
     list above. Except for rules regarding parse errors, they are equivalent, since there is no\
     [appropriate end tag token](https://html.spec.whatwg.org/multipage/parsing.html#appropriate-end-tag-token) in the fragment case, yet they involve far fewer state\
     transitions.\
\
13. Let root be the result of [creating an\\
     element](https://dom.spec.whatwg.org/#concept-create-element) given document, "`html`", the [HTML\\
     namespace](https://infra.spec.whatwg.org/#html-namespace), null, null, false, and the result of [looking up a custom element registry](https://html.spec.whatwg.org/multipage/custom-elements.html#look-up-a-custom-element-registry) given target.\
\
14. [Append](https://dom.spec.whatwg.org/#concept-node-append) root to\
     document.\
\
15. Set up the [HTML parser](https://html.spec.whatwg.org/multipage/parsing.html#html-parser)'s [stack of open elements](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-open-elements) so that it\
     contains just the single element root.\
\
16. Let fragment be the result of [creating\\
     a document fragment](https://dom.spec.whatwg.org/#create-a-document-fragment) given target's [node\\
     document](https://dom.spec.whatwg.org/#concept-node-document).\
\
17. Set the parser's [root insertion target](https://html.spec.whatwg.org/multipage/parsing.html#root-insertion-target) to fragment.\
\
18. If [context](https://html.spec.whatwg.org/multipage/parsing.html#concept-frag-parse-context) is a `template`\
     element, then push " [in template](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intemplate)" onto the\
     [stack of template insertion modes](https://html.spec.whatwg.org/multipage/parsing.html#stack-of-template-insertion-modes) so that it is the new [current template\\
     insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#current-template-insertion-mode).\
\
19. Create a start tag token whose name is the local name of [context](https://html.spec.whatwg.org/multipage/parsing.html#concept-frag-parse-context) and whose attributes are the attributes of\
     [context](https://html.spec.whatwg.org/multipage/parsing.html#concept-frag-parse-context).\
\
    Let this start tag token be the start tag token of [context](https://html.spec.whatwg.org/multipage/parsing.html#concept-frag-parse-context); e.g. for the purposes of determining if it is\
     an [HTML integration point](https://html.spec.whatwg.org/multipage/parsing.html#html-integration-point).\
\
20. [Reset the parser's insertion mode\\
     appropriately](https://html.spec.whatwg.org/multipage/parsing.html#reset-the-insertion-mode-appropriately).\
\
    The parser will reference its [fragment context element](https://html.spec.whatwg.org/multipage/parsing.html#fragment-context-element) as part of\
     that algorithm.\
\
21. Set the [HTML parser](https://html.spec.whatwg.org/multipage/parsing.html#html-parser)'s [`form` element pointer](https://html.spec.whatwg.org/multipage/parsing.html#form-element-pointer) to the\
     nearest node to [context](https://html.spec.whatwg.org/multipage/parsing.html#concept-frag-parse-context) that is a\
     `form` element (going straight up the ancestor chain, and including the element\
     itself, if it is a `form` element), if any. (If there is no such `form`\
     element, the [`form` element pointer](https://html.spec.whatwg.org/multipage/parsing.html#form-element-pointer) keeps its initial value,\
     null.)\
\
22. Place the input into the [input stream](https://html.spec.whatwg.org/multipage/parsing.html#input-stream) for the [HTML\\
     parser](https://html.spec.whatwg.org/multipage/parsing.html#html-parser) just created. The encoding [confidence](https://html.spec.whatwg.org/multipage/parsing.html#concept-encoding-confidence) is _irrelevant_.\
\
23. Start the [HTML parser](https://html.spec.whatwg.org/multipage/parsing.html#html-parser) and let it run until it has consumed all the characters\
     just inserted into the input stream.\
\
24. Return fragment.
