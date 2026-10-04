---
url: https://specs.webrecorder.net/wacz/latest/
retrieved: 2026-10-03
command: firecrawl scrape https://specs.webrecorder.net/wacz/latest/ --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Web Archive Collection Zipped (WACZ)
---
[↑Jump to Table of Contents](https://specs.webrecorder.net/wacz/1.1.1/#toc) [←Collapse Sidebar](https://specs.webrecorder.net/wacz/1.1.1/#toc)

ReSpec

- 🔎 Search Specref…

- 📚 Search definitions…

- ℹ️ About 32.1.2…

- 💾 Export…


![Webrecorder Logo](https://specs.webrecorder.net/assets/images/webrecorder-icon-color.svg)

# Web Archive Collection Zipped (WACZ)

Webrecorder Recommendation03 June 2021

More details about this documentThis version:[https://specs.webrecorder.net/wacz/1.1.1/](https://specs.webrecorder.net/wacz/1.1.1/)Latest published version:[https://specs.webrecorder.net/wacz/latest/](https://specs.webrecorder.net/wacz/latest/)Editors:[Ilya Kreymer](https://www.linkedin.com/in/ilya-kreymer-55110093/) ( [Webrecorder](https://webrecorder.net/))[Ed Summers](https://www.linkedin.com/in/esummers/) ( [Stanford University](https://stanford.edu/))Additional Documents[Use Cases for Decentralized Web Archives](https://specs.webrecorder.net/use-cases/latest/)Previous versions[1.1.0](https://github.com/webrecorder/specs/blob/2ec8e3e8ec8a491c8c2236fdb44a513cfbb2cb17/README.md)[1.0.0](https://github.com/webrecorder/specs/blob/1f511c67b1312ec9215cb8443387340d39c8783b/README.md)Repository[Github](https://github.com/webrecorder/specs)[Issues](https://github.com/webrecorder/specs/issues)[Commits](https://github.com/webrecorder/specs/commits)

[Copyright](https://www.w3.org/Consortium/Legal/ipr-notice#Copyright)
©
2021 [Webrecorder](https://webrecorder.net/) [CC-BY](https://creativecommons.org/licenses/by/4.0/legalcode "Creative Commons Attribution 4.0 International Public License")

* * *

## Abstract

WACZ is a [media type](https://specs.webrecorder.net/wacz/1.1.1/#dfn-mediatype) that allows web archive [collections](https://specs.webrecorder.net/wacz/1.1.1/#dfn-collection) to be
[packaged](https://specs.webrecorder.net/wacz/1.1.1/#dfn-package) and shared on the web as a discrete file. A WACZ file includes
all the data that is needed for the rendering archived content as well as
[contextual information](https://specs.webrecorder.net/wacz/1.1.1/#dfn-context) required for users to interpret it. Rendering
software can obtain this data on demand using HTTP Range requests,
without requiring the entire file to be fully retrieved, or for it to be
otherwise mediated by specialized server side software.

## 1.Conformance

[Permalink for Section 1.](https://specs.webrecorder.net/wacz/1.1.1/#conformance)

As well as sections marked as non-normative, all authoring guidelines, diagrams, examples, and notes in this specification are non-normative. Everything else in this specification is normative.

The key words _MAY_, _MUST_, _MUST NOT_, and _SHOULD_ in this document
are to be interpreted as described in
[BCP 14](https://datatracker.ietf.org/doc/html/bcp14)
\[[RFC2119](https://specs.webrecorder.net/wacz/1.1.1/#bib-rfc2119 "Key words for use in RFCs to Indicate Requirement Levels")\] \[[RFC8174](https://specs.webrecorder.net/wacz/1.1.1/#bib-rfc8174 "Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words")\]
when, and only when, they appear in all capitals, as shown here.


## 2.Status of This Document

[Permalink for Section 2.](https://specs.webrecorder.net/wacz/1.1.1/#status-of-this-document)

This is a stable version of the WACZ standard and is in active use by
the Webrecorder project. Please open [GitHub issues](https://github.com/webrecorder/specs/issues/)
for questions and suggestions.

## 3.Terminology

[Permalink for Section 3.](https://specs.webrecorder.net/wacz/1.1.1/#terminology)

This section defines the terms used in this specification and throughout web
archives infrastructure. A link to these terms is included whenever they appear
in this specification.

CollectionAn arbitrary set of related archived web pages and metadata based on some topic, website domain(s), time period, or other conceptual grouping.ContextDescriptive information about a web archive that helps a person using that web archive understand and interpret what the archive contains. This information can include why the content was selected for the archive, when it was created, who created it, and what tools or applications were used to create it.IIPCThe International Internet Preservation Consortium. An organization of libraries, archives and other organizations established in 2003 to coordinate efforts to preserve web content.Media TypeA two-part identifier for file formats that are transferred on the World Wide Web and the underlying Internet. \[[IANA-MEDIA-TYPES](https://specs.webrecorder.net/wacz/1.1.1/#bib-iana-media-types "Media Types")\].PackageA file format that allows distinct files or bitstreams to be represented within it. Popular examples of packaging formats include ZIP, PDF, MP4, tar and Open Office XML.PageA web document as viewed in a web browser that is viewing a specific URL. Sometimes referred to as a _web page_.WACZWeb Archive Collection Zipped. A file that conforms to this specification which is used to package up [WARC](https://specs.webrecorder.net/wacz/1.1.1/#dfn-warc) data and metadata into a [ZIP](https://specs.webrecorder.net/wacz/1.1.1/#dfn-zip-file) file for distribution and replay on the webWARCA file containing concatenated representations of web resources conforming to the \[[WARC](https://specs.webrecorder.net/wacz/1.1.1/#bib-warc "Information and documentation — WARC file format")\] specification.Wayback MachineA well known web application for replaying archived web pages that was initially developed at the Internet Archive and has been forked as an open soruce application by the [IIPC](https://specs.webrecorder.net/wacz/1.1.1/#dfn-iipc).Web ArchiveA collection of files that preserve representations of web resources in the WARC format. A web archive may also include derivative files such as CDX indexes for accessing records within the archive.ZIP fileA file conforming to the \[[ZIP](https://specs.webrecorder.net/wacz/1.1.1/#bib-zip ".ZIP File Format Specification")\] specification which is used to aggregate, compress, and encrypt files into a single interoperable container. WACZ allows for both ZIP and ZIP64 encodings for larger archives.

## 4.Introduction

[Permalink for Section 4.](https://specs.webrecorder.net/wacz/1.1.1/#introduction)

This specification defines a directory structure and [ZIP](https://specs.webrecorder.net/wacz/1.1.1/#dfn-zip-file) format
specification for sharing and distributing [web archives](https://specs.webrecorder.net/wacz/1.1.1/#dfn-web-archive). [ZIP](https://specs.webrecorder.net/wacz/1.1.1/#dfn-zip-file) files
using this format can be referred to as [WACZ](https://specs.webrecorder.net/wacz/1.1.1/#dfn-wacz) (Web Archive Collection
Zipped).

### 4.1Motivation

[Permalink for Section 4.1](https://specs.webrecorder.net/wacz/1.1.1/#motivation)

The goal of this specification is to provide a portable format for
[web archives](https://specs.webrecorder.net/wacz/1.1.1/#dfn-web-archive) in order to achieve two broad goals for web archives:

1. _Social_: to provide an interoperable way of sharing web archive
   [collections](https://specs.webrecorder.net/wacz/1.1.1/#dfn-collection) that includes the [contextual information](https://specs.webrecorder.net/wacz/1.1.1/#dfn-context) needed
   for users to interpret and meaningfully interact with them.

2. _Technical_: to provide an efficient way to dynamically load
   _small amounts of data_ from a remotely hosted file

   on static storage, without requiring the entire file
   to be downloaded, or for the intervention of specialized
   server side applications.


To use and make sense of a web archive collection, it is necessary to have the
archived web content as well as [contextual information](https://specs.webrecorder.net/wacz/1.1.1/#dfn-context) that describes what the
collection contains as well as when and how it was created. The collection also
requires a set of entry points or [pages](https://specs.webrecorder.net/wacz/1.1.1/#dfn-webpage) to use for browsing the collection.

All of this data needs to be [packaged](https://specs.webrecorder.net/wacz/1.1.1/#dfn-package) together so that the various pieces can be
easily copied and transferred without accidentally separating them. This data
package needs to to be easily transported from one storage system to another,
sent as an attachment in an email, placed on a thumb drive, and hosted by simply
serving it up at a given URL as a static document, possibly from cloud object
storage, or a CDN.

Hosting web archives currently requires complex server infrastructure (e.g. a
[Wayback Machine](https://specs.webrecorder.net/wacz/1.1.1/#dfn-wayback)) to serve [WARC](https://specs.webrecorder.net/wacz/1.1.1/#dfn-warc) data in such a way that can be
viewed in the browser. The [WACZ](https://specs.webrecorder.net/wacz/1.1.1/#dfn-wacz) format provides a storage approach
optimized for efficient random-access to [packaged](https://specs.webrecorder.net/wacz/1.1.1/#dfn-package) up WARC data that allows
the browser to render a page by fetching only what is needed for that
particular page. This is done by leveraging the [ZIP](https://specs.webrecorder.net/wacz/1.1.1/#dfn-zip-file) format's built-in
index to locate the contents of the web archive and its constituent metadata.

WACZ is not designed to replace other web archiving formats. Rather it
establishes a file [packaging](https://specs.webrecorder.net/wacz/1.1.1/#dfn-package) convention for all the data needed by a browser for
efficient rendering of a web archive collection, and its contextualization.

### 4.2Existing Tools

[Permalink for Section 4.2](https://specs.webrecorder.net/wacz/1.1.1/#existing-tools)

The [py-wacz](https://github.com/webrecorder/py-wacz) repository contains a
reference implementation for creating WACZ files from existing WARC files, and
validating them. Parts of the specification are also implemented and in use by
[wabac.js](https://github.com/webrecorder/wabac.js) and
[ReplayWeb.page](https://replayweb.page/).

## 5.WACZ Object

[Permalink for Section 5.](https://specs.webrecorder.net/wacz/1.1.1/#wacz-object)

A WACZ object consists of the following:

1. A `datapackage.json` file for recording technical and descriptive metadata
   specified in \[[FRICTIONLESS-DATA-PACKAGE](https://specs.webrecorder.net/wacz/1.1.1/#bib-frictionless-data-package "Frictionless Data Package")\].

2. An extensible directory and naming convention for [web archive](https://specs.webrecorder.net/wacz/1.1.1/#dfn-web-archive) data.

3. A method for bundling the directory layout in a [ZIP](https://specs.webrecorder.net/wacz/1.1.1/#dfn-zip-file) file.


### 5.1Directory Layout

[Permalink for Section 5.1](https://specs.webrecorder.net/wacz/1.1.1/#directory-layout)

A [WACZ](https://specs.webrecorder.net/wacz/1.1.1/#dfn-wacz) contains a directory structure, that contains web archive
collection data which _MUST_ conform to the \[[FRICTIONLESS-DATA-PACKAGE](https://specs.webrecorder.net/wacz/1.1.1/#bib-frictionless-data-package "Frictionless Data Package")\]
specification. This directory structure looks like:

[Example 1](https://specs.webrecorder.net/wacz/1.1.1/#example-1)

```
├── archive
│   └── data.warc.gz
├── datapackage.json
├── datapackage-digest.json
├── indexes
│   └── index.cdx.gz
└── pages
    └── pages.jsonl
```

### 5.2Directories and Files

[Permalink for Section 5.2](https://specs.webrecorder.net/wacz/1.1.1/#directories-and-files)

#### 5.2.1archive

[Permalink for Section 5.2.1](https://specs.webrecorder.net/wacz/1.1.1/#archive)

The `archive` directory _MUST_ contain one or more files in the \[[WARC](https://specs.webrecorder.net/wacz/1.1.1/#bib-warc "Information and documentation — WARC file format")\] format.
The files _SHOULD_ use the `.warc` file extension unless they are GZIP encoded in
which case they _MUST_ use the `.warc.gz` file extension.

[Example 2](https://specs.webrecorder.net/wacz/1.1.1/#example-2)

```
archive
└── data.warc
```

#### 5.2.2indexes

[Permalink for Section 5.2.2](https://specs.webrecorder.net/wacz/1.1.1/#indexes)

The `indexes` directory _MUST_ include one or more indexes for the WARC data stored
in `archive`. These index files allow clients to efficiently look up a URL to
see if it is contained in the WACZ. Index files _MUST_ contain CDXJ data
and _MAY_ be gzip compressed \[[PYWB-CDXJ](https://specs.webrecorder.net/wacz/1.1.1/#bib-pywb-cdxj "pywb Indexing: CDXJ Format")\].

[Example 3](https://specs.webrecorder.net/wacz/1.1.1/#example-3)

```
indexes
└── index.cdx.gz
```

#### 5.2.3pages.jsonl

[Permalink for Section 5.2.3](https://specs.webrecorder.net/wacz/1.1.1/#pages-jsonl)

The `pages/pages.jsonl` _MUST_ be present and include a list of 'Page' objects as
\[[JSON-Lines](https://specs.webrecorder.net/wacz/1.1.1/#bib-json-lines "JSON Lines: Documentation for the JSON Lines text file format")\] where each line _MUST_ contain at least the following properties:

- `url` \- a URL for the page
- `ts` \- a \[[RFC3339](https://specs.webrecorder.net/wacz/1.1.1/#bib-rfc3339 "Date and Time on the Internet: Timestamps")\] datetime string

Each entry in the \[[JSONL](https://specs.webrecorder.net/wacz/1.1.1/#bib-json-lines "JSON Lines: Documentation for the JSON Lines text file format")\] file _MAY_ contain the following properties to aid in
navigating a web archive collection:

- `title` \- a string describing the resource
- `id` \- an arbitrary identifier for the resource
- `text` \- text extracted from the snapshot
- `size` \- an integer that represents the number of bytes for the page and all its resources

[Example 4](https://specs.webrecorder.net/wacz/1.1.1/#example-4)

```
{"format": "json-pages-1.0", "id": "pages", "title": "All Pages"}
{"id": "1db0ef709a", "url": "https://www.example.com/page", "size": 1256, "ts": "2020-10-07T21:22:36Z", "title": "Example Domain", "text": "Example Domain This domain is for use in illustrative examples in documents. You may use this domain in literature without prior coordination or asking for permission. More information..."}
{"id": "12304e6ba9", "url": "https://www.example.com/another", "size": 1256, "ts": "2020-10-07T21:23:36Z", "title": "Another Page", "text": "Example Domain This domain is for use in illustrative examples in documents. You may use this domain in literature without prior coordination or asking for permission. More information..."}
```

Each entry in the \[[JSONL](https://specs.webrecorder.net/wacz/1.1.1/#bib-json-lines "JSON Lines: Documentation for the JSON Lines text file format")\] file _MAY_ contain additional properties as long as
they do not interfere with the required properties.

Other \[[JSONL](https://specs.webrecorder.net/wacz/1.1.1/#bib-json-lines "JSON Lines: Documentation for the JSON Lines text file format")\] files _MAY_ be added on using the same format in the `pages/`
directory. A common use case is to include only the main pages in the
`pages.jsonl`, while including additional pages, such as those discovered
automatically via a crawl in an another file e.g. `extraPages.jsonl`.

#### 5.2.4datapackage.json

[Permalink for Section 5.2.4](https://specs.webrecorder.net/wacz/1.1.1/#datapackage-json)

The `datapackage.json` file _MUST_ be present at the root of the WACZ which
serves as the manifest for the web archive and is compliant with the
\[[FRICTIONLESS-DATA-PACKAGE](https://specs.webrecorder.net/wacz/1.1.1/#bib-frictionless-data-package "Frictionless Data Package")\] specification. It _MUST_ contain the following
properties:

- `profile`: the string `data-package`
- `resources`: a list of file names, paths, sizes and fixity for all files
   contained in the WACZ.
- `wacz_version`: the version of WACZ used, for example `1.1.1`

[Example 5](https://specs.webrecorder.net/wacz/1.1.1/#example-5)

```
{
  "profile": "data-package",
  "wacz_version": "1.1.1",
  "resources": [\
     {\
       "name": "pages.jsonl",\
       "path": "pages/pages.jsonl",\
       "hash": "sha256:8a7fc0d302700bed02294404a627ddbbf0e35487565b1c6181c729dff8d2fff6",\
       "bytes": 75\
     },\
     {\
       "name": "data.warc",\
       "path": "archive/data.warc",\
       "hash": "sha256:0e7101316ba5d4b66f86a371ee615fbd20f9d3f32d32563ed2c829db062f7714",\
       "bytes": 11469796\
     }\
  ]
}
```

The `datapackage.json` _SHOULD_ include properties that allow rendering
applications to present the user with [contextual information](https://specs.webrecorder.net/wacz/1.1.1/#dfn-context) about the
web archive:

- `title`: a string or one sentence description for the collection
- `description`: a longer description of the archive's contents
   which _MUST_ be Markdown formatted (plain text is valid Markdown)
- `created`: a \[[RFC3339](https://specs.webrecorder.net/wacz/1.1.1/#bib-rfc3339 "Date and Time on the Internet: Timestamps")\] datetime for when the WACZ file was created
- `modified`: a \[[RFC3339](https://specs.webrecorder.net/wacz/1.1.1/#bib-rfc3339 "Date and Time on the Internet: Timestamps")\] datetime for when the WACZ file was last modified
- `software`: A description of what software was used to create the WACZ file
- `mainPageUrl`: An optional URL of the main or starting page in the collection
  to be used for initial replay
- `mainPageDate`: An optional ISO-formatted date of the main or starting page in
  the collection to be used for initial replay

Other properties from the \[[FRICTIONLESS-DATA-PACKAGE](https://specs.webrecorder.net/wacz/1.1.1/#bib-frictionless-data-package "Frictionless Data Package")\] specification such as
`licenses`, `version`, `organization`, `contributors`, `email` _MAY_ be used.
Custom properties that do not interfere with pre-existing properties _MAY_ also
be used.

#### 5.2.5datapackage-digest.json

[Permalink for Section 5.2.5](https://specs.webrecorder.net/wacz/1.1.1/#datapackage-digest-json)

A `datapackage-digest.json` file _SHOULD_ be included in the root of the WACZ to
verify the `datapackage.json` manifest with a hash and thus for the entire
contents of the WACZ. If present the following properties _MUST_ be included:

- `path`: the string "datapackage.json"
- `hash`: a cryptographic hash for the `datapackage.json` file

[Example 6](https://specs.webrecorder.net/wacz/1.1.1/#example-6)

```
{
  "path": "datapackage.json",
  "hash": "sha256:ec1f44ab13e2c94b0ddf66e9673d585ba4a77e6f8c9cc30d8665da434557e885"
}
```

For an approach to recording a cryptographic signature in the
`datapackage-digest.json` in order to assert and prove the authorship of a WACZ
please see [WACZ Signing and Verification](https://specs.webrecorder.net/wacz-auth/latest/).

### 5.3Other files and directories

[Permalink for Section 5.3](https://specs.webrecorder.net/wacz/1.1.1/#other-files-and-directories)

Other files and directories _MAY_ be present in a WACZ as long as they do
not interfere with specified files and directories that are used by WACZ.
Specifically, custom files and directories _MUST NOT_ be added to the existing WACZ directories, `archive`, `indexes` and `pages`. Additional files _MUST_ be listed in the resources section of `datapackage.json` to ensure conformance with \[[FRICTIONLESS-DATA-PACKAGE](https://specs.webrecorder.net/wacz/1.1.1/#bib-frictionless-data-package "Frictionless Data Package")\]

### 5.4Zip Format

[Permalink for Section 5.4](https://specs.webrecorder.net/wacz/1.1.1/#zip-format)

The entire directory structure _MUST_ be stored in a standard \[[ZIP](https://specs.webrecorder.net/wacz/1.1.1/#bib-zip ".ZIP File Format Specification")\] file.

#### 5.4.1Zip Compression

[Permalink for Section 5.4.1](https://specs.webrecorder.net/wacz/1.1.1/#zip-compression)

Already compressed files _MUST NOT_ be compressed again to allow for random access.

- All `archive/` files should be stored in ZIP with 'STORE' mode.
- All `index/*.cdx.gz` files should be stored in ZIP with 'STORE' mode.
- All files (`*.jsonl`, `*.json`, `*.idx`, `*.cdx`, `*.cdxj`) can be stored in
  the ZIP with either 'DEFLATE' or 'STORE' mode.

#### 5.4.2Zip Format File Extension

[Permalink for Section 5.4.2](https://specs.webrecorder.net/wacz/1.1.1/#zip-format-file-extension)

A ZIP file that follows this Web Archive Collection format spec _MUST_ use the extension `.wacz`.

Such a file can be referred to as a WACZ file or a WACZ.

## 6.Processing Model

[Permalink for Section 6.](https://specs.webrecorder.net/wacz/1.1.1/#processing-model)

The \[[ZIP](https://specs.webrecorder.net/wacz/1.1.1/#bib-zip ".ZIP File Format Specification")\] file format provides efficient random access, which means archived
web pages can be retrieved efficiently even from large web archive collections
without requiring the entire WACZ to be transferred. To achieve this WACZ
clients can read portions of the ZIP file on-demand using HTTP RANGE requests
\[[RFC7233](https://specs.webrecorder.net/wacz/1.1.1/#bib-rfc7233 "Hypertext Transfer Protocol (HTTP/1.1): Range Requests")\].

The processing model works as follows. Given a ZIP file, a client can quickly:

1. Read all entries to determine the contents of the ZIP file
2. Load collection metadata from the `datapackage.json`
3. Load a list of pages from `pages.jsonl`, if any

To lookup a given URL the client needs to:

1. Read the full CDX from ZIP
2. Binary search index looking for the URL
3. If a match found, get offset/length/location in WARC
4. Read compressed WARC chunk in ZIP

This approach is being used by [ReplayWeb.page](https://replayweb.page/)

## 7.Publishing

[Permalink for Section 7.](https://specs.webrecorder.net/wacz/1.1.1/#publishing)

Because they are ZIP files WACZ can be hosted on the web as static files. This
allows web archives to be easily maintained over time without relying on complex
server side software, apart from widely available, open source, and well tested
web server applications. If desirable WACZ files can be managed and made
accessibile using HTTP object stores available from cloud hosting providers, and
content deliver networks that geographically position web-archives closer to
their users. However there are certain considerations to make when publishing
WACZ files.

### 7.1Content-Length

[Permalink for Section 7.1](https://specs.webrecorder.net/wacz/1.1.1/#content-length)

WACZ clients need to know how large an entire WACZ file is in order to
download it prior to rendering, or to read it dynamically. To support this HTTP
responses for WACZ files _MUST_ use the `Content-Length` HTTP header.

### 7.2Partial Requests

[Permalink for Section 7.2](https://specs.webrecorder.net/wacz/1.1.1/#partial-requests)

Clients that render WACZ files typically need to be able to fetch content from
the WACZ file on demand. For example when displaying archived content for a
given URL that URL needs to be looked up in the CDXJ index, and the byte offsets
from the index entry are then used to retrieve a portion of a given WARC file
that is enclosed in the WACZ.

In order for clients to be able to perform this dynamic retrieval web servers
that publish WACZ files _MUST_ support HTTP range requests \[[RFC7233](https://specs.webrecorder.net/wacz/1.1.1/#bib-rfc7233 "Hypertext Transfer Protocol (HTTP/1.1): Range Requests")\]. HTTP
responses for WACZ HTTP requests _SHOULD_ server WACZ files using the
`Accept-Ranges` HTTP header.

### 7.3CORS

[Permalink for Section 7.3](https://specs.webrecorder.net/wacz/1.1.1/#cors)

WACZ files and the their clients _MAY_ be served from the same host name. However
it can be useful to view the web archive from a host name that is distinct from
the host name that is publishing the WACZ file. For example this is the
case when publishing WACZ files using a cloud provider's HTTP object storage
(e.g. `s3.amazonaws.com`) and making it viewable at another domain (`e.g. example.org`). It also is the case when WACZ publishers want to allow their web
archives to circulate on the web, and be viewable in multiple locations.

For security reasons browsers restrict access to files hosted on a
different domain than the websites that is trying to load them. In order to
support loading from different domains WACZ files _SHOULD_ be made available using
the `access-control-allow-origin` \[[CORS](https://specs.webrecorder.net/wacz/1.1.1/#bib-cors "Cross-Origin Resource Sharing")\] HTTP header.

### 7.4Media Type

[Permalink for Section 7.4](https://specs.webrecorder.net/wacz/1.1.1/#media-type)

WACZ HTTP responses for WACZ files _SHOULD_ be published with the
`application/wacz` media type.

### 7.5Example Response

[Permalink for Section 7.5](https://specs.webrecorder.net/wacz/1.1.1/#example-response)

Given these requirements a minimal HTTP response for a WACZ could look
like:

[Example 7](https://specs.webrecorder.net/wacz/1.1.1/#example-7)

```
HTTP/2 200
Content-Type: application/wacz
Content-Length: 20961755
Accept-Ranges: bytes
Access-Control-Allow-Origin: *
```

## A.References

[Permalink for Appendix A.](https://specs.webrecorder.net/wacz/1.1.1/#references)

### A.1Normative references

[Permalink for Appendix A.1](https://specs.webrecorder.net/wacz/1.1.1/#normative-references)

\[CORS\][Cross-Origin Resource Sharing](https://www.w3.org/TR/cors/). Anne van Kesteren. W3C. 2 June 2020. W3C Recommendation. URL: [https://www.w3.org/TR/cors/](https://www.w3.org/TR/cors/)\[FRICTIONLESS-DATA-PACKAGE\][Frictionless Data Package](https://specs.frictionlessdata.io/data-package/). Paul Walsh; Rufus Pollock. Open Knowledge Foundation. 2 May 2017. URL: [https://specs.frictionlessdata.io/data-package/](https://specs.frictionlessdata.io/data-package/)\[IANA-MEDIA-TYPES\][Media Types](https://www.iana.org/assignments/media-types/). IANA. URL: [https://www.iana.org/assignments/media-types/](https://www.iana.org/assignments/media-types/)\[JSON-Lines\][JSON Lines: Documentation for the JSON Lines text file format](https://jsonlines.org/). Ian Ward. 2 October 2013. URL: [https://jsonlines.org/](https://jsonlines.org/)\[PYWB-CDXJ\][pywb Indexing: CDXJ Format](https://pywb.readthedocs.io/en/latest/manual/indexing.html#cdxj-index). Webrecorder. URL: [https://pywb.readthedocs.io/en/latest/manual/indexing.html#cdxj-index](https://pywb.readthedocs.io/en/latest/manual/indexing.html#cdxj-index)\[RFC2119\][Key words for use in RFCs to Indicate Requirement Levels](https://www.rfc-editor.org/info/rfc2119/). S. Bradner. IETF. March 1997. Best Current Practice. URL: [https://www.rfc-editor.org/info/rfc2119/](https://www.rfc-editor.org/info/rfc2119/)\[RFC3339\][Date and Time on the Internet: Timestamps](https://www.rfc-editor.org/info/rfc3339/). G. Klyne; C. Newman. IETF. July 2002. Proposed Standard. URL: [https://www.rfc-editor.org/info/rfc3339/](https://www.rfc-editor.org/info/rfc3339/)\[RFC7233\][Hypertext Transfer Protocol (HTTP/1.1): Range Requests](https://httpwg.org/specs/rfc7233.html). R. Fielding, Ed.; Y. Lafon, Ed.; J. Reschke, Ed.. IETF. June 2014. Proposed Standard. URL: [https://httpwg.org/specs/rfc7233.html](https://httpwg.org/specs/rfc7233.html)\[RFC8174\][Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words](https://www.rfc-editor.org/info/rfc8174/). B. Leiba. IETF. May 2017. Best Current Practice. URL: [https://www.rfc-editor.org/info/rfc8174/](https://www.rfc-editor.org/info/rfc8174/)\[WARC\][Information and documentation — WARC file format](https://www.iso.org/standard/68004.html). International Organization for Standardization (ISO). August 2017. Published. URL: [https://www.iso.org/standard/68004.html](https://www.iso.org/standard/68004.html)\[ZIP\][.ZIP File Format Specification](https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT). 15 July 2020. Final. URL: [https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT](https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT)

[↑](https://specs.webrecorder.net/wacz/1.1.1/#title)

[Permalink](https://specs.webrecorder.net/wacz/1.1.1/#dfn-collection)

**Referenced in:**

- [§ Abstract](https://specs.webrecorder.net/wacz/1.1.1/#ref-for-dfn-collection-1 "§ Abstract")
- [§ 4.1 Motivation](https://specs.webrecorder.net/wacz/1.1.1/#ref-for-dfn-collection-2 "§ 4.1 Motivation")

[Permalink](https://specs.webrecorder.net/wacz/1.1.1/#dfn-context)

**Referenced in:**

- [§ Abstract](https://specs.webrecorder.net/wacz/1.1.1/#ref-for-dfn-context-1 "§ Abstract")
- [§ 4.1 Motivation](https://specs.webrecorder.net/wacz/1.1.1/#ref-for-dfn-context-2 "§ 4.1 Motivation") [(2)](https://specs.webrecorder.net/wacz/1.1.1/#ref-for-dfn-context-3 "Reference 2")
- [§ 5.2.4 datapackage.json](https://specs.webrecorder.net/wacz/1.1.1/#ref-for-dfn-context-4 "§ 5.2.4 datapackage.json")

[Permalink](https://specs.webrecorder.net/wacz/1.1.1/#dfn-iipc)

**Referenced in:**

- [§ 3\. Terminology](https://specs.webrecorder.net/wacz/1.1.1/#ref-for-dfn-iipc-1 "§ 3. Terminology")

[Permalink](https://specs.webrecorder.net/wacz/1.1.1/#dfn-mediatype)

**Referenced in:**

- [§ Abstract](https://specs.webrecorder.net/wacz/1.1.1/#ref-for-dfn-mediatype-1 "§ Abstract")

[Permalink](https://specs.webrecorder.net/wacz/1.1.1/#dfn-package)

**Referenced in:**

- [§ Abstract](https://specs.webrecorder.net/wacz/1.1.1/#ref-for-dfn-package-1 "§ Abstract")
- [§ 4.1 Motivation](https://specs.webrecorder.net/wacz/1.1.1/#ref-for-dfn-package-2 "§ 4.1 Motivation") [(2)](https://specs.webrecorder.net/wacz/1.1.1/#ref-for-dfn-package-3 "Reference 2") [(3)](https://specs.webrecorder.net/wacz/1.1.1/#ref-for-dfn-package-4 "Reference 3")

[Permalink](https://specs.webrecorder.net/wacz/1.1.1/#dfn-webpage)

**Referenced in:**

- [§ 4.1 Motivation](https://specs.webrecorder.net/wacz/1.1.1/#ref-for-dfn-webpage-1 "§ 4.1 Motivation")

[Permalink](https://specs.webrecorder.net/wacz/1.1.1/#dfn-wacz)

**Referenced in:**

- [§ 4\. Introduction](https://specs.webrecorder.net/wacz/1.1.1/#ref-for-dfn-wacz-1 "§ 4. Introduction")
- [§ 4.1 Motivation](https://specs.webrecorder.net/wacz/1.1.1/#ref-for-dfn-wacz-2 "§ 4.1 Motivation")
- [§ 5.1 Directory Layout](https://specs.webrecorder.net/wacz/1.1.1/#ref-for-dfn-wacz-3 "§ 5.1 Directory Layout")

[Permalink](https://specs.webrecorder.net/wacz/1.1.1/#dfn-warc)

**Referenced in:**

- [§ 3\. Terminology](https://specs.webrecorder.net/wacz/1.1.1/#ref-for-dfn-warc-1 "§ 3. Terminology")
- [§ 4.1 Motivation](https://specs.webrecorder.net/wacz/1.1.1/#ref-for-dfn-warc-2 "§ 4.1 Motivation")

[Permalink](https://specs.webrecorder.net/wacz/1.1.1/#dfn-wayback)

**Referenced in:**

- [§ 4.1 Motivation](https://specs.webrecorder.net/wacz/1.1.1/#ref-for-dfn-wayback-1 "§ 4.1 Motivation")

[Permalink](https://specs.webrecorder.net/wacz/1.1.1/#dfn-web-archive)

**Referenced in:**

- [§ 4\. Introduction](https://specs.webrecorder.net/wacz/1.1.1/#ref-for-dfn-web-archive-1 "§ 4. Introduction")
- [§ 4.1 Motivation](https://specs.webrecorder.net/wacz/1.1.1/#ref-for-dfn-web-archive-2 "§ 4.1 Motivation")
- [§ 5\. WACZ Object](https://specs.webrecorder.net/wacz/1.1.1/#ref-for-dfn-web-archive-3 "§ 5. WACZ Object")

[Permalink](https://specs.webrecorder.net/wacz/1.1.1/#dfn-zip-file)

**Referenced in:**

- [§ 3\. Terminology](https://specs.webrecorder.net/wacz/1.1.1/#ref-for-dfn-zip-file-1 "§ 3. Terminology")
- [§ 4\. Introduction](https://specs.webrecorder.net/wacz/1.1.1/#ref-for-dfn-zip-file-2 "§ 4. Introduction") [(2)](https://specs.webrecorder.net/wacz/1.1.1/#ref-for-dfn-zip-file-3 "Reference 2")
- [§ 4.1 Motivation](https://specs.webrecorder.net/wacz/1.1.1/#ref-for-dfn-zip-file-4 "§ 4.1 Motivation")
- [§ 5\. WACZ Object](https://specs.webrecorder.net/wacz/1.1.1/#ref-for-dfn-zip-file-5 "§ 5. WACZ Object")
