---
url: https://trafilatura.readthedocs.io/en/latest/usage-python.html
retrieved: 2026-10-04
command: firecrawl scrape https://trafilatura.readthedocs.io/en/latest/usage-python.html --only-main-content --max-age 0 --format markdown,rawHtml --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Python usage — Trafilatura 2.3.0 documentation
---
[Skip to main content](https://trafilatura.readthedocs.io/en/latest/usage-python.html#main-content)

Back to top`Ctrl` + `K`

- System Settings
- Light
- Dark

- [GitHub](https://github.com/adbar/trafilatura)

Collapse SidebarExpand Sidebar

# Python usage [\#](https://trafilatura.readthedocs.io/en/latest/usage-python.html\#python-usage "Link to this heading")

## The Python programming language [\#](https://trafilatura.readthedocs.io/en/latest/usage-python.html\#the-python-programming-language "Link to this heading")

Python can be easy to pick up whether you’re a first time programmer or you’re experienced with other languages:

- Official [Python Tutorial](https://docs.python.org/3/tutorial/)

- [The Hitchhiker’s Guide to Python](https://docs.python-guide.org/)

- [The Best Python Tutorials (freeCodeCamp)](https://www.freecodecamp.org/news/best-python-tutorial/)


## Step-by-step [\#](https://trafilatura.readthedocs.io/en/latest/usage-python.html\#step-by-step "Link to this heading")

### Quickstart [\#](https://trafilatura.readthedocs.io/en/latest/usage-python.html\#quickstart "Link to this heading")

For the basics see [quickstart documentation page](https://trafilatura.readthedocs.io/en/latest/quickstart.html).

Note

For a hands-on tutorial see also the Python Notebook [Trafilatura Overview](https://github.com/adbar/trafilatura/blob/master/docs/Trafilatura_Overview.ipynb).

### Extraction functions [\#](https://trafilatura.readthedocs.io/en/latest/usage-python.html\#extraction-functions "Link to this heading")

The functions can be imported using `from trafilatura import ...` and used on raw documents (strings) or parsed HTML (LXML elements).

Main text extraction, good balance between precision and recall:

- `extract`: Main extraction function — runs Trafilatura’s own rule-based extractor, then falls back to readability and jusText if the result is too short (see [how extraction works](https://trafilatura.readthedocs.io/en/latest/extraction-overview.html))

- `bare_extraction`: Same cascade as `extract()`, but returns a `Document` object with structured access to text, comments, and metadata

- `extract_with_metadata`: Shorthand for `extract()` with `with_metadata=True`


Simpler alternatives (no cascade, faster):

- `baseline`: Targets text paragraphs and/or JSON metadata only

- `html2txt`: Extracts all text in the document, including navigation and footers


Note

For article lists or category pages, discover URLs with
[Courlan’s link extraction](https://trafilatura.readthedocs.io/en/latest/url-management.html#extracting-links-from-a-page)
or Trafilatura’s [feeds](https://trafilatura.readthedocs.io/en/latest/usage-python.html#feeds), [sitemaps](https://trafilatura.readthedocs.io/en/latest/usage-python.html#sitemaps) and
[web crawler](https://trafilatura.readthedocs.io/en/latest/crawls.html), then extract each article separately.
`include_links=True` only keeps links in the extracted content; it is not
a link discovery function.

### Output [\#](https://trafilatura.readthedocs.io/en/latest/usage-python.html\#output "Link to this heading")

By default, the output is in plain text (TXT) format without metadata. The following additional formats are available:

- CSV

- HTML

- JSON

- Markdown

- XML and XML-TEI (following the guidelines of the Text Encoding Initiative)


To specify the output format, use one of the following strings: `"csv", "json", "html", "markdown", "txt", "xml", "xmltei"`.

The `bare_extraction` function uses the `python` format by default and returns a `Document` object for direct use in Python.

To extract and include metadata in the output, use the `with_metadata=True` argument.

#### Examples [\#](https://trafilatura.readthedocs.io/en/latest/usage-python.html\#examples "Link to this heading")

```
# some formatting preserved in basic XML structure
>>> extract(downloaded, output_format="xml")

# output in JSON format with metadata extracted
>>> extract(downloaded, output_format="json", with_metadata=True)
```

Note that combining TXT and CSV formats with certain structural elements (e.g. formatting or links) triggers output in Markdown format (plain text with additional elements). `include_formatting` has no effect on JSON output.

### Choice of HTML elements [\#](https://trafilatura.readthedocs.io/en/latest/usage-python.html\#choice-of-html-elements "Link to this heading")

Customize the extraction process by including or excluding specific HTML elements:

- Text elements:`include_comments=True`

Include comment sections at the bottom of articles.

`include_tables=True`

Extract text from HTML `<table>` elements.

- Structural elements:`include_formatting=True`

Keep structural elements related to formatting (`<b>`/`<strong>`, `<i>`/`<emph>` etc.)

`include_links=True`

Keep link targets (in `href="..."`)

`include_images=True`

Keep track of images along with their targets (`<img>` attributes: alt, src, title)


To operate on these elements, pass the corresponding parameters to the `extract()` function:

```
# exclude comments from the output
>>> result = extract(downloaded, include_comments=False)

# skip tables and include links in the output
>>> result = extract(downloaded, include_tables=False, include_links=True)

# convert relative links to absolute links where possible
# (pass the same URL used to fetch "downloaded")
>>> extract(downloaded, output_format='xml', include_links=True, url="https://www.example.org")
```

#### Important notes [\#](https://trafilatura.readthedocs.io/en/latest/usage-python.html\#important-notes "Link to this heading")

- `include_comments` and `include_tables` are activated by default.

- Including extra elements works best with conversion to XML formats or using `bare_extraction()`. This allows for direct display and manipulation of the elements.

- Certain elements may not be visible in the output if the chosen format does not allow it.

- Selecting Markdown automatically includes text formatting.


Hint

The heuristics used by the main algorithm change according to the presence of certain elements in the HTML. If the output seems odd, try removing a constraint (e.g. formatting) to improve the result.

### The precision and recall presets [\#](https://trafilatura.readthedocs.io/en/latest/usage-python.html\#the-precision-and-recall-presets "Link to this heading")

The main extraction functions offer two presets to adjust the focus of the extraction process:

```
# less noise, possibly less text
>>> result = extract(downloaded, favor_precision=True)

# more text, possibly more noise
>>> result = extract(downloaded, favor_recall=True)
```

#### Precision [\#](https://trafilatura.readthedocs.io/en/latest/usage-python.html\#precision "Link to this heading")

- Use when your results contain too much boilerplate or irrelevant content.

- Comments are pruned more aggressively, link-heavy sections are discarded, and fallback stages are skipped.

- Additionally, you can use the `prune_xpath` parameter to target specific HTML elements using a list of XPath expressions:


```
# remove elements matching a custom XPath before extraction
>>> extract(downloaded, prune_xpath='//div[@class="ad"]')
```

#### Recall [\#](https://trafilatura.readthedocs.io/en/latest/usage-python.html\#recall "Link to this heading")

- Use when parts of your documents are missing.

- Lists inside discarded sections are kept, text tails are preserved, and link density thresholds are relaxed.

- If content is still missing, try `html2txt()` or refer to the [troubleshooting guide](https://trafilatura.readthedocs.io/en/latest/troubleshooting.html).


For a detailed comparison of what each mode changes, see [how extraction works](https://trafilatura.readthedocs.io/en/latest/extraction-overview.html#extraction-modes).

### Additional functions for text extraction [\#](https://trafilatura.readthedocs.io/en/latest/usage-python.html\#additional-functions-for-text-extraction "Link to this heading")

The `html2txt` and `baseline` functions offer simpler approaches to extracting text from HTML content, prioritizing performance over precision.

#### html2txt() [\#](https://trafilatura.readthedocs.io/en/latest/usage-python.html\#html2txt "Link to this heading")

The `html2txt` function serves as a last resort for extracting text from HTML content. It emulates the behavior of similar functions in other packages and can be used to output all possible text from a given HTML source, maximizing recall. However, it may not always produce accurate or meaningful results, as it does not consider the context of the extracted sections.

```
>>> from trafilatura import html2txt
>>> html2txt(downloaded)
```

#### baseline() [\#](https://trafilatura.readthedocs.io/en/latest/usage-python.html\#baseline "Link to this heading")

For a better balance between precision and recall, as well as improved performance, consider using the `baseline` function instead. This function returns a tuple containing an LXML element with the body, the extracted text as a string, and the length of the text. It uses a set of heuristics to extract text from the HTML content, which generally produces more accurate results than `html2txt`.

```
>>> from trafilatura import baseline
>>> postbody, text, len_text = baseline(downloaded)
```

For more advanced use cases, consider using other functions in the package that provide more control and customization over the text extraction process.

### Guessing if text can be found [\#](https://trafilatura.readthedocs.io/en/latest/usage-python.html\#guessing-if-text-can-be-found "Link to this heading")

The function `is_probably_readerable()` (ported from Mozilla’s Readability.js) provides a way to guess if a page probably has a main text to extract.

```
>>> from trafilatura.readability_lxml import is_probably_readerable
>>> is_probably_readerable(downloaded)  # HTML string or already parsed tree
```

### Language identification [\#](https://trafilatura.readthedocs.io/en/latest/usage-python.html\#language-identification "Link to this heading")

The target language can also be set using 2-letter codes (ISO 639-1), there will be no output if the detected language of the result does not match and no such filtering if the identification component has not been installed (see above [installation instructions](https://trafilatura.readthedocs.io/en/latest/installation.html)) or if the target language is not available.

Note

This feature requires additional components: `pip install trafilatura[all]`.
It currently uses the [py3langid package](https://github.com/adbar/py3langid) and is dependent on language availability and performance of the original model.

```
>>> result = extract(downloaded, target_language="de")
```

### Optimizing for speed [\#](https://trafilatura.readthedocs.io/en/latest/usage-python.html\#optimizing-for-speed "Link to this heading")

Execution speed not only depends on the platform and on supplementary packages (`trafilatura[all]`, `htmldate[speed]`), but also on the extraction strategy.

By default, `extract()` runs a cascade: its own rule-based extractor first, then readability and jusText as fallbacks if the initial result is too short. These fallbacks improve accuracy but are slower. In _fast_ mode they are skipped entirely, making extraction about twice as fast:

```
# skip algorithms used as fallback
>>> result = extract(downloaded, fast=True)
```

The following combination usually leads to shorter processing times:

```
>>> result = extract(downloaded, include_comments=False, include_tables=False, fast=True)
```

## Extraction settings [\#](https://trafilatura.readthedocs.io/en/latest/usage-python.html\#extraction-settings "Link to this heading")

Hint

See also [settings page](https://trafilatura.readthedocs.io/en/latest/settings.html).

### Function parameters [\#](https://trafilatura.readthedocs.io/en/latest/usage-python.html\#function-parameters "Link to this heading")

The `Extractor` class provides a convenient way to define and manage extraction parameters. It is useful when reusing the same settings across multiple extractions or when configuring options not exposed as `extract()` parameters.

Here is how to use the class:

```
# import the Extractor class from the settings module
>>> from trafilatura.settings import Extractor

# set multiple options at once
>>> options = Extractor(output_format="json", with_metadata=True)

# add or adjust settings as needed
>>> options.formatting = True  # same as include_formatting
>>> options.source = "My Source"  # useful for debugging

# use the options in an extraction function
>>> extract(downloaded, options=options)
```

See the `settings.py` file for a full example.

### Metadata extraction [\#](https://trafilatura.readthedocs.io/en/latest/usage-python.html\#metadata-extraction "Link to this heading")

- `with_metadata=True`: extract metadata fields and include them in the output

- `only_with_metadata=True`: only output documents featuring all essential metadata (date, title, url)

- `record_id`: attach a custom ID to the `id` metadata field, useful for tracking documents through a corpus-building pipeline (see [building a training corpus](https://trafilatura.readthedocs.io/en/latest/tutorial-datasets.html))


```
>>> extract(downloaded, record_id="doc-042", output_format="json", with_metadata=True)
```

#### Date [\#](https://trafilatura.readthedocs.io/en/latest/usage-python.html\#date "Link to this heading")

Among metadata extraction, dates are handled by an external module: [htmldate](https://github.com/adbar/htmldate). By default, focus is on original dates and the extraction replicates the _fast_ option.

[Custom parameters](https://htmldate.readthedocs.io/en/latest/corefunctions.html#handling-date-extraction) can be passed through the extraction function or through the `extract_metadata` function in `trafilatura.metadata`, most notably:

- `extensive_search` (boolean), to activate further heuristics (higher recall, lower precision)

- `original_date` (boolean) to look for the original publication date,

- `outputformat` (string), to provide a custom datetime format,

- `max_date` (string), to set the latest acceptable date manually (YYYY-MM-DD format).


```
# import the extract() function, use a previously downloaded document
# pass the new parameters as dict
>>> extract(downloaded, output_format="xml", date_extraction_params={
        "extensive_search": True, "max_date": "2018-07-01"
    })
```

#### URL [\#](https://trafilatura.readthedocs.io/en/latest/usage-python.html\#url "Link to this heading")

Even if the page to process has already been downloaded it can still be useful to pass the URL as an argument. See this [previous bug](https://github.com/adbar/trafilatura/issues/75) for an example:

```
# define a URL and download the example
>>> url = "https://web.archive.org/web/20210613232513/https://www.thecanary.co/feature/2021/05/19/another-by-election-headache-is-incoming-for-keir-starmer/"
>>> downloaded = fetch_url(url)

# content discarded since necessary metadata couldn't be extracted
>>> bare_extraction(downloaded, only_with_metadata=True)
>>>

# date found in URL, extraction successful
>>> bare_extraction(downloaded, only_with_metadata=True, url=url)
```

### Memory use [\#](https://trafilatura.readthedocs.io/en/latest/usage-python.html\#memory-use "Link to this heading")

Trafilatura uses caches to speed up extraction and cleaning processes. This may lead to memory leaks in some cases, particularly in large-scale applications. If that happens you can reset all cached information in order to release RAM:

```
# import the function
>>> from trafilatura.meta import reset_caches

# use it at any given point
>>> reset_caches()
```

## Input/Output types [\#](https://trafilatura.readthedocs.io/en/latest/usage-python.html\#input-output-types "Link to this heading")

### Python objects as output [\#](https://trafilatura.readthedocs.io/en/latest/usage-python.html\#python-objects-as-output "Link to this heading")

The extraction can be customized using a series of parameters, for more see the [core functions](https://trafilatura.readthedocs.io/en/latest/corefunctions.html) page.

The function `bare_extraction` can be used to bypass output conversion. It returns a `Document` object with metadata as string attributes (`.title`, `.author`, `.text`, `.comments`, etc.) and the extracted content as LXML elements (`.body`, `.commentsbody`). Call `.as_dict()` on the result to get a plain dictionary.

```
>>> from trafilatura import bare_extraction
>>> bare_extraction(downloaded)
```

### Raw HTTP response objects [\#](https://trafilatura.readthedocs.io/en/latest/usage-python.html\#raw-http-response-objects "Link to this heading")

The `fetch_response()` function can pass a response object straight to the extraction.

This can be useful to get the final redirection URL with `response.url` and then pass it directly as a URL argument to the extraction function:

```
# necessary components
>>> from trafilatura import fetch_response, bare_extraction

# load an example
>>> response = fetch_response("https://www.example.org")

# perform extract() or bare_extraction() on Trafilatura's response object
>>> bare_extraction(response.data, url=response.url)  # here is the redirection URL
```

### LXML objects [\#](https://trafilatura.readthedocs.io/en/latest/usage-python.html\#lxml-objects "Link to this heading")

The input can consist of a previously parsed tree (i.e. a _lxml.html_ object), which is then handled seamlessly:

```
# define document and load it with LXML
>>> from trafilatura import extract
>>> from lxml import html
>>> my_doc = """<html><body><article><p>
...                 Here is the main text.
...                 </p></article></body></html>"""
>>> mytree = html.fromstring(my_doc)

# extract from the already loaded LXML tree
>>> extract(mytree)
'Here is the main text.'
```

### Interaction with BeautifulSoup [\#](https://trafilatura.readthedocs.io/en/latest/usage-python.html\#interaction-with-beautifulsoup "Link to this heading")

Trafilatura works with LXML trees, not BeautifulSoup objects. If you already have a BS4 parse tree, convert it first:

```
>>> from bs4 import BeautifulSoup
>>> from lxml.html.soupparser import convert_tree
>>> from lxml import etree, html
>>> from trafilatura import extract

>>> soup = BeautifulSoup("<html><body><article><p>The date is Feb 2, 2024.</p></article></body></html>", "lxml")
>>> lxml_tree = convert_tree(soup)[0]
```

Warning

`convert_tree()` returns a tree rooted at `<body>`, not `<html>`. Passing it to `extract()` as-is returns `None` regardless of content, since the extractor expects a document rooted at `<html>`. Re-wrap it first:

```
>>> wrapped = html.fromstring("<html>" + etree.tostring(lxml_tree).decode() + "</html>")
>>> extract(wrapped)
'The date is Feb 2, 2024.'
```

## Navigation [\#](https://trafilatura.readthedocs.io/en/latest/usage-python.html\#navigation "Link to this heading")

Trafilatura can discover URLs to extract from via three strategies:

- **Feeds** (Atom/RSS): mostly for fresh content

- **Sitemaps**: for exhaustivity — all potential pages as listed by the site owners

- **Web crawling**: follow internal links to discover pages


### Feeds [\#](https://trafilatura.readthedocs.io/en/latest/usage-python.html\#feeds "Link to this heading")

The function `find_feed_urls` is a all-in-one utility that attempts to discover the feeds from a webpage if required and/or downloads and parses feeds. It returns the extracted links as list, more precisely as a sorted list of unique links.

```
# import the feeds module
>>> from trafilatura import feeds

# use the homepage to automatically retrieve feeds
>>> mylist = feeds.find_feed_urls('https://www.theguardian.com/')
>>> mylist
['https://www.theguardian.com/international/rss', '...'] # and so on

# use a predetermined feed URL directly
>>> mylist = feeds.find_feed_urls('https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml')
>>> bool(mylist)
True # it's not empty
```

Note

The links are seamlessly filtered for patterns given by the user, e.g. using `https://www.un.org/en/` as argument implies taking all URLs corresponding to this category.

An optional argument `target_lang` makes it possible to filter links according to their expected target language. A series of heuristics are applied on the link path and parameters to try to discard unwanted URLs, thus saving processing time and download bandwidth.

An optional `external` argument controls whether URLs from other domains are included. By default, only URLs matching the input domain are returned (`external=False`).

```
# the feeds module has to be imported
# search for feeds in English
>>> mylist = feeds.find_feed_urls('https://www.un.org/en/rss.xml', target_lang='en')
>>> bool(mylist)
True # links found as expected

# target_lang set to Japanese, the English links are discarded
>>> mylist = feeds.find_feed_urls('https://www.un.org/en/rss.xml', target_lang='ja')
>>> mylist
[]
```

For more information about feeds and web crawling see:

- This blog post: [Using RSS and Atom feeds to collect web pages with Python](https://adrien.barbaresi.eu/blog/using-feeds-text-extraction-python.html)

- This Youtube tutorial: [Extracting links from ATOM and RSS feeds](https://www.youtube.com/watch?v=NW2ISdOx08M&list=PL-pKWbySIRGMgxXQOtGIz1-nbfYLvqrci&index=2&t=136s)


### Sitemaps [\#](https://trafilatura.readthedocs.io/en/latest/usage-python.html\#sitemaps "Link to this heading")

- Youtube tutorial: [Learn how to process XML sitemaps to extract all texts present on a website](https://www.youtube.com/watch?v=uWUyhxciTOs)


```
# load sitemaps module
>>> from trafilatura import sitemaps

# automatically find sitemaps by providing the homepage
>>> mylinks = sitemaps.sitemap_search('https://developer.mozilla.org/')

# the target_lang argument works as explained above
>>> mylinks = sitemaps.sitemap_search('https://developer.mozilla.org/', target_lang='en')
```

The links are also seamlessly filtered for patterns given by the user, e.g. using `https://developer.mozilla.org/en-US/docs/Web/CSS` as argument implies taking all URLs corresponding to the CSS documentation category.

An optional `external` argument controls whether URLs from other domains are included. By default, only URLs matching the input domain are returned (`external=False`).

### Web crawling [\#](https://trafilatura.readthedocs.io/en/latest/usage-python.html\#web-crawling "Link to this heading")

See the [documentation page on web crawling](https://trafilatura.readthedocs.io/en/latest/crawls.html) for more information.

Hint

For more information on how to refine and filter a URL collection, see the underlying [courlan](https://github.com/adbar/courlan) library.

## Deprecations [\#](https://trafilatura.readthedocs.io/en/latest/usage-python.html\#deprecations "Link to this heading")

See the [deprecations and migration](https://trafilatura.readthedocs.io/en/latest/deprecations.html) page for a full list of deprecated functions, arguments, and migration instructions.

See also

[Settings and customization](https://trafilatura.readthedocs.io/en/latest/settings.html), [Command-line usage](https://trafilatura.readthedocs.io/en/latest/usage-cli.html), [Core functions](https://trafilatura.readthedocs.io/en/latest/corefunctions.html)

On this page


[Show Source](https://trafilatura.readthedocs.io/en/latest/_sources/usage-python.rst.txt)

Versions**[latest](https://trafilatura.readthedocs.io/en/latest/usage-python.html)**[stable](https://trafilatura.readthedocs.io/en/stable/usage-python.html)Downloads[PDF](https://trafilatura.readthedocs.io/_/downloads/en/latest/pdf/)On Read the Docs[Project Home](https://app.readthedocs.org/projects/trafilatura/?utm_source=trafilatura&utm_content=flyout)[Builds](https://app.readthedocs.org/projects/trafilatura/builds/?utm_source=trafilatura&utm_content=flyout)Search

* * *

[Addons documentation](https://docs.readthedocs.io/page/addons.html?utm_source=trafilatura&utm_content=flyout) ― Hosted by
[Read the Docs](https://about.readthedocs.com/?utm_source=trafilatura&utm_content=flyout)
