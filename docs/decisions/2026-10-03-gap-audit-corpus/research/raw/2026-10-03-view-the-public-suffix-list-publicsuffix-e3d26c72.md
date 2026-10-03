---
url: https://publicsuffix.org/list/
retrieved: 2026-10-03
command: firecrawl scrape https://publicsuffix.org/list/ --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: partial
omitted: only 1441 characters of main content were returned (below the 1500-character bar)
title: View the Public Suffix List
---
## View the Public Suffix List

The list is kept in source code control on [GitHub](https://github.com/publicsuffix/list). You can read more information on the format the list uses below. **Please note that the list is encoded using UTF-8.**

The copy on publicsuffix.org, linked below, is updated daily from GitHub. If you wish to make your app download an updated list periodically,
**please use this URL and have your app download the list no more than once per day**.
(The list usually changes a few times per week; more frequent downloading is pointless and
hammers our servers.)

[See the list](https://publicsuffix.org/list/public_suffix_list.dat)

To be kept informed of changes to the list, you can subscribe to an [Atom change feed](https://github.com/publicsuffix/list/commits/main.atom) in your favourite feed reader.


## List format

A public suffix is a set of DNS names or wildcards concatenated with dots. It represents the part of a domain name which is **not** under the control of the individual registrant.


### Specification

- Please see the [Public Suffix List Wiki](https://github.com/publicsuffix/list/wiki/) at the following link for information on the formatting and specifications: [Format](https://github.com/publicsuffix/list/wiki/Format#format).


This information was moved by [Jothan Frakes](https://github.com/dnsguru) on February 8, 2022 to the GitHub Public Suffix List for simplification of management.
