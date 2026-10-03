---
url: https://web.hypothes.is/blog/fuzzy-anchoring/
retrieved: 2026-10-03
command: firecrawl scrape https://web.hypothes.is/blog/fuzzy-anchoring/ --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Fuzzy Anchoring : Hypothesis
---
![Revisit consent button](https://web.hypothes.is/wp-content/plugins/cookie-law-info/lite/frontend/images/revisit.svg)

We value your privacy

We use cookies to enhance your browsing experience, serve personalised ads or content, and analyse our traffic. By clicking "Accept All", you consent to our use of cookies.

CustomiseReject AllAccept All

Customise Consent Preferences![](https://web.hypothes.is/wp-content/plugins/cookie-law-info/lite/frontend/images/close.svg)

We use cookies to help you navigate efficiently and perform certain functions. You will find detailed information about all cookies under each consent category below.

The cookies that are categorised as "Necessary" are stored on your browser as they are essential for enabling the basic functionalities of the site. ... Show more

NecessaryAlways Active

Necessary cookies are required to enable the basic features of this site, such as providing secure log-in or adjusting your consent preferences. These cookies do not store any personally identifiable data.

No cookies to display.

Functional

Functional cookies help perform certain functionalities like sharing the content of the website on social media platforms, collecting feedback, and other third-party features.

No cookies to display.

Analytics

Analytical cookies are used to understand how visitors interact with the website. These cookies help provide information on metrics such as the number of visitors, bounce rate, traffic source, etc.

No cookies to display.

Performance

Performance cookies are used to understand and analyse the key performance indexes of the website which helps in delivering a better user experience for the visitors.

No cookies to display.

Advertisement

Advertisement cookies are used to provide visitors with customised advertisements based on the pages you visited previously and to analyse the effectiveness of the ad campaigns.

No cookies to display.

Reject All  Save My Preferences  Accept All

[Skip to main content](https://web.hypothes.is/blog/fuzzy-anchoring/#main)

- [Uncategorized](https://web.hypothes.is/blog/category/uncategorized/)

# Fuzzy Anchoring

![csillag](https://secure.gravatar.com/avatar/945f9014d8f8229e824016a26563577198076236360b5d5ead5f60150014b0ab?s=300&d=mm&r=g)

#### By csillag

22 April, 2013 · 10 min read


### Overview

A large part of the unique potential of annotation comes from its ability to point inside media to specific places. Because of this, we must be able to reliably reference these specific locations in web resources, beginning with text. Hypertext links generally point to the top of documents and other web-connected media, which is not sufficient for our purposes. Document anchors exist, but these usually are established at fixed places by the author of the original document, and because of this, they are not useful for others in pointing to arbitrary locations in documents they do not have write access to.

Therefore we need to design and implement another approach to address the fragments we intend.

A primary challenge is that documents, especially online ones, change frequently. We need an approach (or possibly approaches) to anchoring annotations that is robust to changes in the underlying document. This is known as intra-document anchoring.

A related, but different problem is that often documents exist in multiple formats (HTML, PDF, DOC, TXT, etc), or may be accessible in both paginated and unpaginated versions. It would be helpful if an annotation created in one would also be automatically visible in the other. Also, often the same or nearly the same content (for instance with line numbers in one place, but without in another) may be available in many places (e.g. The Bible, Shakespeare, US constitution, popular song lyrics, news stories, or other examples of widely disseminated information). Should we seek ways of enabling the shared annotation of these type of documents wherever they exist? This class of problems collectively are referred to as inter-document anchoring or also content-based anchoring (aka the content addressable web).

### What we did before

Until now, Hypothes.is has used the anchoring strategy inherited from the [Annotator project](https://github.com/okfn/annotator), which anchors annotations to their targets by saving exact locations in the form of XPath range descriptions to the involved DOM elements and the string offsets inside them. When the anchor needs to be located again, the DOM elements are found by using the same XPath expressions. This method works if the content is stable, but is vulnerable to changes to the structure of the page that render stored XPaths invalid. Also, this approach doesn’t facilitate cross-format annotation.

### A long history

This is an old problem, and over the years there have been a range of suggested solutions. Some are covered on [our wiki page](https://github.com/hypothesis/h/wiki/robust-anchors). We’re very aware that this is something that others have thought about longer than we have, and is a grand challenge that many need solved. Our efforts build on prior work and incorporate new thinking.

### A new approach

To achieve robust reattachment of annotations we combine several approaches. We save the information about each target fragment in three different selectors, and while attempting to re-attach them to the document, we step through four different strategies, determining the appropriate target fragment by combining the available information in different ways.

The end result is that our annotations can now withstand document changes (both structure and content), and are also available for viewing on other formats of the same document. (Assuming that we can determine that we are dealing with the same document – more on that later).

These are the selectors saved:

1. _RangeSelector_: this what we had we had until now: a pair (for start and end) of XPaths pointing to the DOM elements, and the string offsets inside them.
2. [_TextPositionSelector_](http://www.openannotation.org/spec/core/specific.html#TextPositionSelector): this is a pair of string offsets, marking the start and end of the selected text in the character string representing the whole document.
3. [_TextQuoteSelector_](http://www.openannotation.org/spec/core/specific.html#TextQuoteSelector): this selector stores three strings:

1. _exact_: the selected text itself
2. _prefix_: the (32-char long) text immediately before the selected text
3. _suffix_: the (32-char long) text immediately after the selected text

These are the defined selectors.

There are four strategies available for reattaching. They are tried based on the available selectors, in the following order:

1. _From Range Selector_: If there are no changes in the document, this fast and straightforward method will find a match right away. We simply try to apply the _start_ and _end_ XPath expressions stored in the _RangeSelector_ to the current DOM, and create a selection between them. We also verify that the text yielded by this selection is the same as stored in the _TextQuoteSelector_ (if we have one). This strategy fails if the XPath expressions can no longer be applied (this most likely means that the structure or the content of the document has changed), or if the saved text does not match the current one.
2. _From Position Selector_: This strategy handles cases when the structure of the document has changed, but the text content has not. (For example, if a new DIV tag was wrapped around some part of the DOM.) We try to create a selection based on global character offsets, stored in the _PositionSelector_, regardless of the structure of the DOM. Then we verify that the text yielded by this selection is the same as stored in the _TextQuoteSelector_ (if we have one). This strategy fails if the saved text does not match the current one.
3. _Context-first Fuzzy Matching_: This strategy can handle both structure and content changes. First, searching around the expected start position (as stored in the _PositionSelector_, if any), we try to locate the _prefix_ (stored in the _TextQuoteSelector_), with a fuzzy search (more on the details later). Then searching around the expected end position (as determined with the help of the position of the prefix), we try to locate the _suffix_, again, with a fuzzy search. Then we check out the text between the found prefix and suffix, and compare it to the _exact_ text saved. If the difference is within a given acceptance threshold, then we have a match. This strategy fails if the prefix or the suffix can not be found, or if the text found between them differs too much from the saved version.
4. _Selector-only Fuzzy Matching_: The two-phase fuzzy strategy (described above) is our best bet to find a really good match, but sometimes it fails, and then we need to use this last-ditch strategy, in which we simply run a fuzzy text search for the _exact_ text (stored in the _TextQuoteSelector_), and see if we can come up with something similar enough.

For the fuzzy text search and comparison, we are using a modified version of the [google-diff-match-patch](http://code.google.com/p/google-diff-match-patch/) library, which uses the [Bitap matching algorithm](http://neil.fraser.name/software/diff_match_patch/bitap.ps) for text matching, and [Myer’s diff algorithm](http://neil.fraser.name/software/diff_match_patch/myers.pdf) for text comparison.

### Implementation details

By this point, some of our more discerning readers might have noticed that we are talking about the documents as if they were simple character strings, whereas the reality is that they are (mostly) highly structured HTML pages or PDF files. In practice, the elements of the document are organized to a tree – the [DOM tree](http://en.wikipedia.org/wiki/Document_Object_Model#Web_browsers). In browsers, after complex computations, the layout engine renders this tree into an image, and that image is what we see. However, to run text searches (and other string processing operations), we need to access the contents of the page as a simple text string. On the other hand, once we have this string representation, if want to do something with the actual document (for example, select or highlight something), we can’t use this internal string representation; we need to work with the original DOM elements. Working with this “dual nature” of documents (tree vs. string) represents one of the biggest challenges.

Our solution is to create (and maintain) an internal text representation of the document, together with a full, bi-directional mapping between the DOM elements and the string yielded when the document is rendered.

The key facility for doing this is the [DOM Selection API](https://developer.mozilla.org/en-US/docs/DOM/Selection), implemented in all major browsers. This API makes it possible to select any part of the DOM and get a string representation of it. By going through the DOM tree recursively, selecting each of the sub-trees, and asking for a string representation, we can collect enough data to find out “what goes where” in the final string. Contrary to what one may think, this is not a trivial question, since some elements present in the DOM don’t make it into the rendered text (for example, because of CSS settings), and many weird things happen with whitespace.

We build our string representation and its corresponding mapping upon loading a document. This first mapping phase can take a long time (several seconds), especially for longer documents, so we only do this once at loading time. We can then reuse this data for all subsequent operations. However, for this to work, our map needs to stay in sync with changes in the host document. Our current approach supports this, though we’re only updating this data when we are updating the DOM ourselves – for example, when adding highlights for annotations. We don’t yet have [automatic change detection](https://github.com/hypothesis/h/issues/396), but it’s on the roadmap.

The DOM selection APIs in the various browsers have their [fair share](https://github.com/hypothesis/h/issues/280) of [problems](https://github.com/hypothesis/h/issues/398). Whenever possible, we provide workarounds by handling the special cases with custom code, but not all the problems can be solved this way. The ones that remain are minor enough that we’re confident that a quality experience can be maintained. Hopefully over time, the remaining issues will be addressed, or we can contribute fixes that might be incorporated.

### Architecture

We wanted to make the fruits of this effort available for the widest possible audience, so we built most of the involved components as libraries independent of Hypothes.is or even Annotator. Here is what the architecture looks like:

![](https://s3.amazonaws.com/nolme-public/new_no_text.png)Architecture of anchoring sub-systems

The components in detail:

- [dom-text-mapper](https://github.com/hypothesis/dom-text-mapper): This zero-dependency CoffeeScript library analyses the DOM, extracts the text strings, and creates the mappings between the DOM nodes and the resulting string slices. It also answers queries about DOM elements and their text positions. Can project any string slice back to the elements of the DOM.
- [diff-match-patch](https://github.com/hypothesis/dom-text-matcher/tree/master/lib/diff_match_patch): This JS library was forked from here, and is responsible for running fuzzy searches on plain text, comparing text strings, and measuring differences.
- [text-match-engines](https://github.com/hypothesis/dom-text-matcher/blob/master/src/text_match_engines.coffee): this small CoffeeScript module provides exact, regex and (with the help of _diff-match-patch_) fuzzy text matching facilities. Added value: as search results, it returns ranges. (As opposed to positions.) It also supports patterns that are too long for _diff-match-patch_ to support natively.
- [dom-text-matcher](https://github.com/hypothesis/dom-text-matcher): This CoffeeScript library uses _dom-text-mapper_ to extract the text of the document, then uses _text-match-engines_ to run fuzzy searches on it, and then it uses _dom-text-mapper_ to map the search results back to the DOM.
- [Annotator](https://github.com/hypothesis/annotator): Our fork of the [original Annotator project](https://github.com/okfn/annotator) now implements the creation and saving of all the defined selectors, and the defined re-attachment strategies.

### Status of this work

This solution is now present in our development and test installations. All the code ( _dom-text-mapper_, _dom-text-matcher_, _annotator_, _hypothes.is_) is available in our [GitHub repo](https://github.com/hypothesis). One caveat: while the majority of the related changes happened in Annotator’s code, we have been using/developing/testing it only as part of Hypothes.is, and not in standalone mode. Because of this, Annotator’s standalone mode is currently [broken](https://github.com/hypothesis/h/issues/295) in our fork. That means that you can’t just take it at merge it to your other (Annotator-based) project, and expect it to work. This is the main reason why these modifications have not yet been merged into upstream Annotator. We expect to clear this up in the days to come.

### Some final words

We hope this work can be of use to others, both as working code, and as thinking that can help others move forward conceptually from here. In turn we’d like to thank those whose efforts we have borrowed heavily from in the strategies outlined here. Our [suggested reading list](https://hypothes.is/robust-anchoring/) is a great way to do so, though we’re sure we’ve probably omitted some, and if so by no means intentionally!

### Share this article

Highlights visible

- 9

Hypothesis

![Hypothesis](https://hypothes.is/organizations/__default__/logo)Public

Sign up

/

Log in

## Annotations

9 annotations, 1 note

Annotations9Page Notes1

> Fuzzy anchoring

HELLO BOOKS IN BROWSERS

> It would be helpful if an annotation created in one would also be automatically visible in the other.

More

Maybe one approach could be to define one document type as the "source" and have other types of documents created in a way that allows for source-maps (like the source maps used in web development to link back to the original lines in (e.g.) less or coffeescript files) to be used. An annotation could then be mapped back to the original and any processor creating different views of the same "source" would be able to re-use the annotation.

> A primary challenge is that documents, especially online ones, change frequently.

But they don't. They get re-issued ( [https://hypothes.is/a/FWEDwInLEeyhtVeF1gArUw](https://hypothes.is/a/FWEDwInLEeyhtVeF1gArUw)) and their associated identifier (URI) gets re-used for the new version, and the original issues get routinely "disappeared". This is a failure to carry out TBL's original vision for the Web in practice–where every article is given a name that can be systematically (mechanically) resolved, or if not that, then at least used as a handle to unambiguously refer to the thing.

Annotate

Highlight
