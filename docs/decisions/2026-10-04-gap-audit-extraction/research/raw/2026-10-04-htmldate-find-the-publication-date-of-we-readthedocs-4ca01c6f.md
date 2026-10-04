---
url: https://htmldate.readthedocs.io/en/latest/
retrieved: 2026-10-04
command: firecrawl scrape https://htmldate.readthedocs.io/en/latest/ --only-main-content --max-age 0 --format markdown,rawHtml --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Htmldate: Find the Publication Date of Web Pages — htmldate 1.11.0 documentation
---
# Htmldate: Find the Publication Date of Web Pages [¶](https://htmldate.readthedocs.io/en/latest/\#htmldate-find-the-publication-date-of-web-pages "Link to this heading")

[![Python package](https://img.shields.io/pypi/v/htmldate.svg)](https://pypi.python.org/pypi/htmldate)  [![Python versions](https://img.shields.io/pypi/pyversions/htmldate.svg)](https://pypi.python.org/pypi/htmldate)  [![Code Coverage](https://img.shields.io/codecov/c/github/adbar/htmldate.svg)](https://codecov.io/gh/adbar/htmldate)  [![Downloads](https://static.pepy.tech/badge/htmldate/month)](https://pepy.tech/project/htmldate)  [![JOSS article reference DOI: 10.21105/joss.02439](https://img.shields.io/badge/JOSS-10.21105%2Fjoss.02439-brightgreen)](https://doi.org/10.21105/joss.02439)  [![Ruff](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/astral-sh/ruff/main/assets/badge/v2.json)](https://github.com/astral-sh/ruff)

![Htmldate Logo](https://htmldate.readthedocs.io/en/latest/_images/htmldate-logo.png)

Find **original and updated publication dates** of any web page.
It is often not possible to do it using just the URL or the server response.

**On the command-line or with Python**, all the steps needed from web page
download to HTML parsing, scraping, and text analysis are included.

The package is used in production on millions of documents and integrated into
[thousands of projects](https://github.com/adbar/htmldate/network/dependents).

## In a nutshell [¶](https://htmldate.readthedocs.io/en/latest/\#in-a-nutshell "Link to this heading")

[![Demo as GIF image](https://htmldate.readthedocs.io/en/latest/_images/htmldate-demo.gif)](https://htmldate.readthedocs.org/)

With Python:

```
>>> from htmldate import find_date
>>> find_date('http://blog.python.org/2016/12/python-360-is-now-available.html')
'2016-12-23'
```

On the command-line:

```
$ htmldate -u http://blog.python.org/2016/12/python-360-is-now-available.html
'2016-12-23'
```

## Features [¶](https://htmldate.readthedocs.io/en/latest/\#features "Link to this heading")

- Multilingual, robust and efficient (used in production on millions of documents)

- URLs, HTML files, or HTML trees are given as input (includes batch processing)

- Output as string in any date format (defaults to [ISO 8601 YMD](https://en.wikipedia.org/wiki/ISO_8601))

- Detection of both original and updated dates

- Compatible with Python 3.10 and later


`htmldate` can examine markup and text. It provides the following ways to date an HTML document:

1. **Markup in header**: Common patterns are used to identify relevant elements (e.g. `link` and `meta` elements) including [Open Graph protocol](http://ogp.me/) attributes and a large number of CMS idiosyncrasies

2. **HTML code**: The whole document is then searched for structural markers: `abbr` or `time` elements and a series of attributes (e.g. `postmetadata`)

3. **Bare HTML content**: Heuristics are run on text and markup:


> - in `fast` mode the HTML page is cleaned and precise patterns are targeted
>
> - in `extensive` mode all potential dates are collected and a disambiguation algorithm determines the most probable one

The output is thoroughly verified in terms of plausibility and adequateness. If a valid date has been found the library outputs a date string corresponding to either the last update or the original publishing statement (the default), in the desired format.

Markup-based extraction is multilingual by nature, text-based refinements for better coverage currently support English, French, German, Indonesian and Turkish.

## Installation [¶](https://htmldate.readthedocs.io/en/latest/\#installation "Link to this heading")

### Main package [¶](https://htmldate.readthedocs.io/en/latest/\#main-package "Link to this heading")

This Python package is tested on Linux, macOS and Windows systems; it is compatible with Python 3.10 upwards. It is available on the package repository [PyPI](https://pypi.org/) and can notably be installed with `pip` or `pipenv`:

```
$ pip install htmldate
$ pip install --upgrade htmldate # to make sure you have the latest version
$ pip install git+https://github.com/adbar/htmldate.git # latest available code (see build status above)
```

The last version to support Python 3.6 and 3.7 is `htmldate==1.8.1`; for Python 3.8 and 3.9 use the `1.9.x` series.

### Optional [¶](https://htmldate.readthedocs.io/en/latest/\#optional "Link to this heading")

The additional library `cchardet` (or its fork `faust-cchardet`) can be installed for better execution speed. They may not work on all platforms and have thus been singled out although installation is recommended:

```
$ pip install htmldate[speed] # install with additional functionality
```

You can also install or update the packages separately, _htmldate_ will detect which ones are present on your system and opt for the best available combination.

_For infos on dependency management of Python packages see_ [this discussion thread](https://stackoverflow.com/questions/41573587/what-is-the-difference-between-venv-pyvenv-pyenv-virtualenv-virtualenvwrappe).

## With Python [¶](https://htmldate.readthedocs.io/en/latest/\#with-python "Link to this heading")

### `find_date` [¶](https://htmldate.readthedocs.io/en/latest/\#find-date "Link to this heading")

In case the web page features easily readable metadata in the header, the extraction is straightforward. A more advanced analysis of the document structure is sometimes needed:

```
>>> from htmldate import find_date
>>> find_date('http://blog.python.org/2016/12/python-360-is-now-available.html')
# DEBUG analyzing: <h2 class="date-header"><span>Friday, December 23, 2016</span></h2>
# DEBUG result: 2016-12-23
'2016-12-23'
```

`htmldate` can resort to a guess based on a complete screening of the document (`extensive_search` parameter) which can be deactivated:

```
>>> find_date('https://creativecommons.org/about/')
'2017-08-11' # may change
>>> find_date('https://creativecommons.org/about/', extensive_search=False)
>>>
```

Already parsed HTML (that is a LXML tree object):

```
# simple HTML document as string
>>> htmldoc = '<html><body><span class="entry-date">July 12th, 2016</span></body></html>'
>>> find_date(htmldoc)
'2016-07-12'
# parsed LXML tree
>>> from lxml import html
>>> mytree = html.fromstring('<html><body><span class="entry-date">July 12th, 2016</span></body></html>')
>>> find_date(mytree)
'2016-07-12'
```

### Output format [¶](https://htmldate.readthedocs.io/en/latest/\#output-format "Link to this heading")

Change the output to a format known to Python’s `datetime` module, the default being `%Y-%m-%d`:

```
>>> find_date('https://www.gnu.org/licenses/gpl-3.0.en.html', outputformat='%d %B %Y')
'18 November 2016'  # may change
```

### Original vs. updated dates [¶](https://htmldate.readthedocs.io/en/latest/\#original-vs-updated-dates "Link to this heading")

Although the time delta between original publication and “last modified” info is usually a matter of hours or days, it can be useful to prioritize the **original publication date**:

```
>>> find_date('https://netzpolitik.org/2016/die-cider-connection-abmahnungen-gegen-nutzer-von-creative-commons-bildern/', original_date=True)  # modified behavior
'2016-06-23' # may change
```

For more information see [options page](https://htmldate.readthedocs.io/en/latest/options.html).

## On the command-line [¶](https://htmldate.readthedocs.io/en/latest/\#on-the-command-line "Link to this heading")

A command-line interface is included:

```
$ htmldate -u http://blog.python.org/2016/12/python-360-is-now-available.html
'2016-12-23'
$ wget -qO- "http://blog.python.org/2016/12/python-360-is-now-available.html" | htmldate
'2016-12-23'
```

For usage instructions see `htmldate -h`:

```
$ htmldate --help
htmldate [-h] [-f] [-i INPUTFILE] [--original] [-min MINDATE] [-max MAXDATE] [-u URL] [-v] [--version]
optional arguments:
    -h, --help            show this help message and exit
    -f, --fast            fast mode: disable extensive search
    -i INPUTFILE, --inputfile INPUTFILE
                          name of input file for batch processing (similar to wget -i)
    --original            original date prioritized
    -min MINDATE, --mindate MINDATE
                          earliest acceptable date (ISO 8601 YMD)
    -max MAXDATE, --maxdate MAXDATE
                          latest acceptable date (ISO 8601 YMD)
    -u URL, --URL URL     custom URL download
    -v, --verbose         increase output verbosity
    --version             show version information and exit
```

The batch mode `-i` takes one URL per line as input and returns one result per line in tab-separated format:

```
$ htmldate --fast -i list-of-urls.txt
```

## License [¶](https://htmldate.readthedocs.io/en/latest/\#license "Link to this heading")

This package is distributed under the [Apache 2.0 license](https://www.apache.org/licenses/LICENSE-2.0.html).

Versions prior to v1.8.0 are under GPLv3+ license.

## Context and contributions [¶](https://htmldate.readthedocs.io/en/latest/\#context-and-contributions "Link to this heading")

Initially launched to create text databases for research purposes
at the Berlin-Brandenburg Academy of Sciences (DWDS and ZDL units),
this project continues to be maintained but its future development
depends on community support.

**If you value this software or depend on it for your product, consider**
**sponsoring it and contributing to its codebase**. Your support
[on GitHub](https://github.com/sponsors/adbar) or [ko-fi.com](https://ko-fi.com/adbarbaresi)
will help maintain and enhance this package.
Visit the [Contributing page](https://github.com/adbar/htmldate/blob/master/CONTRIBUTING.md)
for more information.

Reach out via the software repository or the [contact page](https://adrien.barbaresi.eu/) for inquiries, collaborations, or feedback.

[![JOSS article reference DOI: 10.21105/joss.02439](https://img.shields.io/badge/JOSS-10.21105%2Fjoss.02439-brightgreen)](https://doi.org/10.21105/joss.02439) [![Zenodo archive DOI: 10.5281/zenodo.3459599](https://img.shields.io/badge/DOI-10.5281%2Fzenodo.3459599-blue)](https://doi.org/10.5281/zenodo.3459599)

```
@article{barbaresi-2020-htmldate,
  title = {{htmldate: A Python package to extract publication dates from web pages}},
  author = "Barbaresi, Adrien",
  journal = "Journal of Open Source Software",
  volume = 5,
  number = 51,
  pages = 2439,
  url = {https://doi.org/10.21105/joss.02439},
  publisher = {The Open Journal},
  year = 2020,
}
```

- Barbaresi, A. “ [htmldate: A Python package to extract publication dates from web pages](https://doi.org/10.21105/joss.02439)”, Journal of Open Source Software, 5(51), 2439, 2020. DOI: 10.21105/joss.02439

- Barbaresi, A. “ [Generic Web Content Extraction with Open-Source Software](https://hal.archives-ouvertes.fr/hal-02447264/document)”, Proceedings of KONVENS 2019, Kaleidoscope Abstracts, 2019.

- Barbaresi, A. “ [Efficient construction of metadata-enhanced web corpora](https://hal.archives-ouvertes.fr/hal-01371704v2/document)”, Proceedings of the [10th Web as Corpus Workshop (WAC-X)](https://www.sigwac.org.uk/wiki/WAC-X), 2016.


## Going further [¶](https://htmldate.readthedocs.io/en/latest/\#going-further "Link to this heading")

### Known caveats [¶](https://htmldate.readthedocs.io/en/latest/\#known-caveats "Link to this heading")

The granularity may not always match the desired output format. If only information about the year could be found and the chosen date format requires to output a month and a day, the result is ‘padded’ to be located at the middle of the year, in that case the 1st of January.

Besides, there are pages for which no date can be found, ever:

```
>>> r = requests.get('https://example.com')
>>> htmldate.find_date(r.text)
>>>
```

If the date is nowhere to be found, it might be worth considering [carbon dating](https://github.com/oduwsdl/CarbonDate) the web page, however this is computationally expensive. In addition, [datefinder](https://github.com/akoumjian/datefinder) features pattern-based date extraction for texts written in English.

- [Core functions](https://htmldate.readthedocs.io/en/latest/corefunctions.html)
  - [Handling date extraction](https://htmldate.readthedocs.io/en/latest/corefunctions.html#handling-date-extraction)
  - [Useful internal functions](https://htmldate.readthedocs.io/en/latest/corefunctions.html#useful-internal-functions)
  - [Helpers](https://htmldate.readthedocs.io/en/latest/corefunctions.html#helpers)
- [Evaluation](https://htmldate.readthedocs.io/en/latest/evaluation.html)
  - [Alternatives](https://htmldate.readthedocs.io/en/latest/evaluation.html#alternatives)
  - [Description](https://htmldate.readthedocs.io/en/latest/evaluation.html#description)
  - [Results](https://htmldate.readthedocs.io/en/latest/evaluation.html#results)
  - [Older Results](https://htmldate.readthedocs.io/en/latest/evaluation.html#older-results)
- [Options](https://htmldate.readthedocs.io/en/latest/options.html)
  - [Configuration](https://htmldate.readthedocs.io/en/latest/options.html#configuration)
  - [Settings](https://htmldate.readthedocs.io/en/latest/options.html#settings)
  - [Tests](https://htmldate.readthedocs.io/en/latest/options.html#tests)
- [Uses & citations](https://htmldate.readthedocs.io/en/latest/used-by.html)
  - [Notable projects using this software](https://htmldate.readthedocs.io/en/latest/used-by.html#notable-projects-using-this-software)
  - [Citations in papers](https://htmldate.readthedocs.io/en/latest/used-by.html#citations-in-papers)
  - [Publications citing Htmldate](https://htmldate.readthedocs.io/en/latest/used-by.html#publications-citing-htmldate)
  - [Ports](https://htmldate.readthedocs.io/en/latest/used-by.html#ports)
  - [Software ecosystem](https://htmldate.readthedocs.io/en/latest/used-by.html#software-ecosystem)

# Indices and tables [¶](https://htmldate.readthedocs.io/en/latest/\#indices-and-tables "Link to this heading")

- [Index](https://htmldate.readthedocs.io/en/latest/genindex.html)

- [Module Index](https://htmldate.readthedocs.io/en/latest/py-modindex.html)

- [Search Page](https://htmldate.readthedocs.io/en/latest/search.html)


# [htmldate](https://htmldate.readthedocs.io/en/latest/\#)

Star adbar/htmldate on GitHub[Star](https://github.com/adbar/htmldate)

### Navigation

- [Core functions](https://htmldate.readthedocs.io/en/latest/corefunctions.html)
- [Evaluation](https://htmldate.readthedocs.io/en/latest/evaluation.html)
- [Options](https://htmldate.readthedocs.io/en/latest/options.html)
- [Uses & citations](https://htmldate.readthedocs.io/en/latest/used-by.html)

### Related Topics

- [Documentation overview](https://htmldate.readthedocs.io/en/latest/#)
  - Next: [Core functions](https://htmldate.readthedocs.io/en/latest/corefunctions.html "next chapter")

Versions**[latest](https://htmldate.readthedocs.io/en/latest/)**[stable](https://htmldate.readthedocs.io/en/stable/)On Read the Docs[Project Home](https://app.readthedocs.org/projects/htmldate/?utm_source=htmldate&utm_content=flyout)[Builds](https://app.readthedocs.org/projects/htmldate/builds/?utm_source=htmldate&utm_content=flyout)Search

* * *

[Addons documentation](https://docs.readthedocs.io/page/addons.html?utm_source=htmldate&utm_content=flyout) ― Hosted by
[Read the Docs](https://about.readthedocs.com/?utm_source=htmldate&utm_content=flyout)
