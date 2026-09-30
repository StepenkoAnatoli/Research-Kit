---
url: https://archive.org/help/wayback_api.php
retrieved: 2026-09-30
command: http-keyless scrape https://archive.org/help/wayback_api.php
statusCode: 200
transport: http-keyless
completeness: partial
omitted: 1 sibling section(s) totalling ~14 words were outside the page's main content and are not in this capture
title: Wayback Machine APIs | Internet Archive
---
# Wayback Machine APIs

 The Internet Archive Wayback Machine supports a number of different APIs to make it
 easier for developers to retrieve information about Wayback capture data.

 The following is a listing of currently supported APIs. This page is subject to change frequently,
 please check back for the latest info.

*Updated on September, 24, 2013*

## Wayback Availability JSON API

 This simple API for Wayback is a test to see if a given url is archived
 and currenlty accessible in the Wayback Machine.

This API is useful for providing a 404 or other error handler which checks Wayback
to see if it has an archived copy ready to display.

The API can be used as follows:

**`[http://archive.org/wayback/available?url=example.com](http://archive.org/wayback/available?url=example.com)`**
 which might return:


{
 "archived_snapshots": {
 "closest": {
 "available": true,
 "url": "http://web.archive.org/web/20130919044612/http://example.com/",
 "timestamp": "20130919044612",
 "status": "200"
 }
 }
}


 if the url is available. When available, the **url** is the link to the archived snapshot in the Wayback Machine
At this time, archived_snapshots just returns a single **closest** snapshot,
but additional snapshots may be added in the future.


If the url is not available (not archived or currently not accessible), the response will be:

{"archived_snapshots":{}}


### Other Options

Additional options which may be specified are **`timestamp`** and **`callback`**



- `**timestamp**` is the timestamp to look up in Wayback.
 If not specified, the most recenty available capture in Wayback is returned.
 The format of the timestamp is 1-14 digits (YYYYMMDDhhmmss) ex:

**
`
[http://archive.org/wayback/available?url=example.com&timestamp=20060101](http://archive.org/wayback/available?url=example.com&timestamp=20060101)
`
**

 may result in the following response (note that the snapshot timestamp is now close to 20060101):


{
 "archived_snapshots": {
 "closest": {
 "available": true,
 "url": "http://web.archive.org/web/20060101064348/http://www.example.com:80/",
 "timestamp": "20060101064348",
 "status": "200"
 }
 }
}


- **`callback`** is an optional callback which may be specified to produce a JSONP response.

## Memento API


The Internet Archive Wayback Machine is also fully compliant with the
[Memento Protocol](http://mementoweb.org)
The Memento API provides additional interfaces for querying snapshots (eg 'Mementos') in the Wayback Machine.
The Availability API is partially based on the Memento APIs.


Here are some
[specific examples of Memento support in the Wayback Machine](http://ws-dl.blogspot.fr/2013/07/2013-07-15-wayback-machine-upgrades.html)

## Wayback CDX Server API


The CDX Server is another API which allows for complex querying,
filtering and analysis of Wayback capture data.
If you are looking for more in depth information about Wayback machine data,
please take a look at the CDX server API.


The latest documentation on the CDX server can be found at:
[Wayback CDX Server @ GitHub](https://github.com/internetarchive/wayback/tree/master/wayback-cdx-server)
