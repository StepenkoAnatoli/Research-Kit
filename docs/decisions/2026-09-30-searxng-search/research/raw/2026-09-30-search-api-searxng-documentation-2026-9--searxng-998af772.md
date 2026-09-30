---
url: https://docs.searxng.org/dev/search_api.html
retrieved: 2026-09-30
command: http-keyless scrape https://docs.searxng.org/dev/search_api.html
statusCode: 200
transport: http-keyless
completeness: full
title: Search API - SearXNG Documentation (2026.9.30+a9d990033)
---
# Search API[¶](#search-api)

 SearXNG supports querying via a simple HTTP API. Two endpoints, ` / ` and
` /search `, are supported for both GET and POST methods. The ` GET ` method
expects parameters as URL query parameters, while the POST method expects
parameters as form data (` application/x-www-form-urlencoded `).

 If you want to consume the results as JSON, CSV, or RSS, you need to set the
` format ` parameter accordingly. Supported formats are defined in
` settings.yml `, under the [search:](../admin/settings/settings_search.html#settings-search) section. Requesting an
unset format will return a 403 Forbidden error. Be aware that many public
instances have these formats disabled.

 Endpoints:

 GET /
 GET / search
 POST /
 POST / search


 example cURL calls:

 curl 'https://searx.example.org/search?q=searxng&format=json'
curl -X POST 'https://searx.example.org/search' -d 'q=searxng&format=csv'
curl -L -X POST -d 'q=searxng&format=json' 'https://searx.example.org/'




## Parameters[¶](#parameters)


 Further reading ..



- [Engine Overview](engines/engine_overview.html#engines-dev)

- [settings.yml](../admin/settings/settings.html#settings-yml)

- [Configured Engines](../user/configured_engines.html#configured-engines)



 ` q ` required The search query. This string is passed to external search services. Thus,
SearXNG supports syntax of each search service. For example, ` site:github.com
 SearXNG ` is a valid query for Google. However, if simply the query above is
passed to any search engine which does not filter its results based on this
syntax, you might not get the results you wanted.

 See more at [Search syntax](../user/search-syntax.html#search-syntax)


 ` categories ` optional Comma separated list, specifies the active search categories (see
[Configured Engines](../user/configured_engines.html#configured-engines))


 ` language ` default from [search:](../admin/settings/settings_search.html#settings-search) Code of the language.


 ` pageno ` default ` 1 ` Search page number.


 ` time_range ` optional [ ` day `, ` month `, ` year ` ] Time range of search for engines which support it. See if an engine supports
time range search in the preferences page of an instance.


 ` format ` optional [ ` json `, ` csv `, ` rss ` ] Output format of results. Format needs to be activated in [search:](../admin/settings/settings_search.html#settings-search).


 ` safesearch ` default from [search:](../admin/settings/settings_search.html#settings-search) [ ` 0 `, ` 1 `, ` 2 ` ] Filter search results of engines which support safe search. See if an engine
supports safe search in the preferences page of an instance.


 ` theme ` default ` simple ` [ ` simple ` ] Theme of instance.

 Please note, available themes depend on an instance. It is possible that an
instance administrator deleted, created or renamed themes on their instance.
See the available options in the preferences page of the instance.
