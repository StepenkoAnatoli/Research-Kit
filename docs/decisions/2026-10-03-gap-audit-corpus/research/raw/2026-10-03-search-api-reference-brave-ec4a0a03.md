---
url: https://api-dashboard.search.brave.com/api-reference/web/search/get
retrieved: 2026-10-03
command: firecrawl scrape https://api-dashboard.search.brave.com/api-reference/web/search/get --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Search - API Reference
---
Web Search

Search the web from a large independent index of web pages.

Copy page

Copy pageCopy page as Markdown for LLMs

Copy markdown URLCopy the markdown URL for this page
[View skill file Skill file for Search](https://github.com/brave/brave-search-skills/blob/main/skills/web-search/SKILL.md)

* * *

## [Link to Authorization](https://api-dashboard.search.brave.com/api-reference/web/search/get\#authorization) Authorization

[Link to x-subscription-token](https://api-dashboard.search.brave.com/api-reference/web/search/get#auth-x-subscription-token)

[`x-subscription-token`](https://api-dashboard.search.brave.com/api-reference/web/search/get#auth-x-subscription-token) stringheaderrequired

The subscription token that was generated for the product.

## [Link to Query Parameters](https://api-dashboard.search.brave.com/api-reference/web/search/get\#query-parameters) Query Parameters

[Link to q](https://api-dashboard.search.brave.com/api-reference/web/search/get#parameter-q)

[`q`](https://api-dashboard.search.brave.com/api-reference/web/search/get#parameter-q) stringrequired

The user’s search query term. Query can not be empty. Maximum of 600 characters and 75 words in the query.

[Link to country](https://api-dashboard.search.brave.com/api-reference/web/search/get#parameter-country)

[`country`](https://api-dashboard.search.brave.com/api-reference/web/search/get#parameter-country) enum<string>

The 2 character country code where the search results come from.

Default: `"US"`

Available options:`AR``AU``AT`+35 more

[Link to search_lang](https://api-dashboard.search.brave.com/api-reference/web/search/get#parameter-search_lang)

[`search_lang`](https://api-dashboard.search.brave.com/api-reference/web/search/get#parameter-search_lang) enum<string>

The 2 or more character language code for which the search results are provided.

Default: `"en"`

Available options:`ar``eu``bn`+49 more

[Link to ui_lang](https://api-dashboard.search.brave.com/api-reference/web/search/get#parameter-ui_lang)

[`ui_lang`](https://api-dashboard.search.brave.com/api-reference/web/search/get#parameter-ui_lang) enum<string>

User interface language preferred in response. Usually of the format <language\_code>-<country\_code>. For more, see [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html#name-accept-language).

Default: `"en-US"`

Available options:`es-AR``en-AU``de-AT`+36 more

[Link to count](https://api-dashboard.search.brave.com/api-reference/web/search/get#parameter-count)

[`count`](https://api-dashboard.search.brave.com/api-reference/web/search/get#parameter-count) integer

The number of search results returned in response.
The maximum is 20. The actual number delivered may be less than requested.
Combine this parameter with offset to paginate search results.

**NOTE:** Count only applies to web results.

Min: `1`Max: `20`Default: `20`

[Link to offset](https://api-dashboard.search.brave.com/api-reference/web/search/get#parameter-offset)

[`offset`](https://api-dashboard.search.brave.com/api-reference/web/search/get#parameter-offset) integer

The zero based offset that indicates number of search
result pages (count) to skip before returning the result.
The default is 0 and the maximum is 9.
The actual number delivered may be less than requested.

Use this parameter along with the count parameter to page results.
For example, if your user interface displays 10 search results per page,
set count to 10 and offset to 0 to get the first page of results.
For each subsequent page, increment offset by 1 (for example, 0, 1, 2).
It is possible for multiple pages to include some overlap in results.

Min: `0`Max: `9`Default: `0`

[Link to safesearch](https://api-dashboard.search.brave.com/api-reference/web/search/get#parameter-safesearch)

[`safesearch`](https://api-dashboard.search.brave.com/api-reference/web/search/get#parameter-safesearch) enum<string>

Filters search results for adult content. The following values are supported:

- **off** \- No filtering is done.
- **moderate** \- Filters explicit content, like images and videos, but allows adult domains in the search results.
- **strict** \- Drops all adult content from search results.

Default: `"moderate"`

Available options:`off``moderate``strict`

[Link to spellcheck](https://api-dashboard.search.brave.com/api-reference/web/search/get#parameter-spellcheck)

[`spellcheck`](https://api-dashboard.search.brave.com/api-reference/web/search/get#parameter-spellcheck) boolean

Whether to spell check provided query. If the spell checker is enabled, the modified query is always used for search. The modified query can be found in altered key from the query response model.

Default: `true`

[Link to freshness](https://api-dashboard.search.brave.com/api-reference/web/search/get#parameter-freshness)

[`freshness`](https://api-dashboard.search.brave.com/api-reference/web/search/get#parameter-freshness) stringExamples

- `pm`

- `2022-04-01to2022-07-30`


Filters search results by page age. The age of a page is determined by the most relevant date reported by the content, such as its published or last modified date. The following values are supported:

- **pd** \- Pages aged 24 hours or less.
- **pw** \- Pages aged 7 days or less.
- **pm** \- Pages aged 31 days or less.
- **py** \- Pages aged 365 days or less.
- **YYYY-MM-DDtoYYYY-MM-DD** \- A custom date range is also supported by specifying start and end dates e.g. `2022-04-01to2022-07-30`.

Default: `""`

[Link to text_decorations](https://api-dashboard.search.brave.com/api-reference/web/search/get#parameter-text_decorations)

[`text_decorations`](https://api-dashboard.search.brave.com/api-reference/web/search/get#parameter-text_decorations) boolean

Whether display strings (e.g. result snippets) should include decoration markers (e.g. highlighting characters).

Default: `true`

[Link to result_filter](https://api-dashboard.search.brave.com/api-reference/web/search/get#parameter-result_filter)

[`result_filter`](https://api-dashboard.search.brave.com/api-reference/web/search/get#parameter-result_filter) string\[\]Examples

- `web`

- `videos`

- `web,videos`


A comma delimited string of result types to include in the search response.
Not specifying this parameter will return back all result types in search response where data is available
and the plan has the corresponding option activated. The response always includes query and type to
identify any query modifications and response type respectively.
Available result filter values are: `discussions`, `faq`, `infobox`, `news`, `query`, `summarizer`, `videos`, `web`, `locations`.

**NOTE:** count param only applies to web results.

[Link to units](https://api-dashboard.search.brave.com/api-reference/web/search/get#parameter-units)

[`units`](https://api-dashboard.search.brave.com/api-reference/web/search/get#parameter-units) enum<string>

The measurement units. The following values are supported:

- **metric** \- The standardized measurement system (km, celcius…)
- **imperial** \- The British Imperial system of units (mile, fahrenheit…)

Available options:`imperial``metric`

[Link to goggles_id](https://api-dashboard.search.brave.com/api-reference/web/search/get#parameter-goggles_id)

[`goggles_id`](https://api-dashboard.search.brave.com/api-reference/web/search/get#parameter-goggles_id) stringdeprecatedExamples

- `https://raw.githubusercontent.com/brave/goggles-quickstart/main/goggles/hacker_news.goggle`Prioritizes domains popular with the Hacker News


Goggles act as a custom re-ranking on top of Brave’s search index. For more details, refer to the Goggles repository. This parameter is deprecated. Please use the goggles parameter.

[Link to goggles](https://api-dashboard.search.brave.com/api-reference/web/search/get#parameter-goggles)

[`goggles`](https://api-dashboard.search.brave.com/api-reference/web/search/get#parameter-goggles) string \| string\[\]Examples

- `https://raw.githubusercontent.com/brave/goggles-quickstart/main/goggles/hacker_news.goggle`Prioritizes domains popular with the Hacker News

- `! name: Social Networks
! description: Removes social networks
! public: true
! author: Average Joe
! avatar: #de0320

$discard,site=facebook.com
$discard,site=x.com
$discard,site=instagram.com`Social media blocker


Goggles act as a custom re-ranking on top of Brave’s search index. The parameter supports both a url where the Goggle is hosted or the definition of the Goggle. For more details, see the [Goggles documentation](https://api-dashboard.search.brave.com/documentation/resources/goggles). The parameter can be a single Goggle or a list of up to 3 Goggles.

[Link to extra_snippets](https://api-dashboard.search.brave.com/api-reference/web/search/get#parameter-extra_snippets)

[`extra_snippets`](https://api-dashboard.search.brave.com/api-reference/web/search/get#parameter-extra_snippets) boolean

A snippet is an excerpt from a page you get as a result of the query, and extra\_snippets allow you to get up to 5 additional, alternative excerpts.

[Link to summary](https://api-dashboard.search.brave.com/api-reference/web/search/get#parameter-summary)

[`summary`](https://api-dashboard.search.brave.com/api-reference/web/search/get#parameter-summary) boolean

This parameter enables summary key generation in web search results. This is required for summarizer to be enabled.

[Link to enable_rich_callback](https://api-dashboard.search.brave.com/api-reference/web/search/get#parameter-enable_rich_callback)

[`enable_rich_callback`](https://api-dashboard.search.brave.com/api-reference/web/search/get#parameter-enable_rich_callback) boolean

Enable rich callback.
Allows you to get real time rich results via a callback URL when they are relevant to your query.

**NOTE**: Requires `Search` plan.

Default: `false`

[Link to include_fetch_metadata](https://api-dashboard.search.brave.com/api-reference/web/search/get#parameter-include_fetch_metadata)

[`include_fetch_metadata`](https://api-dashboard.search.brave.com/api-reference/web/search/get#parameter-include_fetch_metadata) boolean

Include fetch metadata.

Default: `false`

[Link to operators](https://api-dashboard.search.brave.com/api-reference/web/search/get#parameter-operators)

[`operators`](https://api-dashboard.search.brave.com/api-reference/web/search/get#parameter-operators) boolean

Whether to apply search operators

Default: `true`

## [Link to Headers](https://api-dashboard.search.brave.com/api-reference/web/search/get\#headers) Headers

[Link to x-loc-lat](https://api-dashboard.search.brave.com/api-reference/web/search/get#header-x-loc-lat)

[`x-loc-lat`](https://api-dashboard.search.brave.com/api-reference/web/search/get#header-x-loc-lat) numberExamples

- `37.787`


The latitude of the client’s geographical location in degrees, to provide relevant local results. The latitude must be greater than or equal to -90.0 degrees and less than or equal to +90.0 degrees.

Min: `-90`Max: `90`

[Link to x-loc-long](https://api-dashboard.search.brave.com/api-reference/web/search/get#header-x-loc-long)

[`x-loc-long`](https://api-dashboard.search.brave.com/api-reference/web/search/get#header-x-loc-long) numberExamples

- `-122.4`


The longitude of the client’s geographical location in degrees, to provide relevant local results. The longitude must be greater than or equal to -180.0 and less than or equal to +180.0 degrees.

Min: `-180`Max: `180`

[Link to x-loc-timezone](https://api-dashboard.search.brave.com/api-reference/web/search/get#header-x-loc-timezone)

[`x-loc-timezone`](https://api-dashboard.search.brave.com/api-reference/web/search/get#header-x-loc-timezone) stringExamples

- `America/San_Francisco`IANA timezone for San Francisco in USA


The IANA timezone for the client’s device. For complete list of IANA timezones and location mappings see [IANA Database](https://www.iana.org/time-zones) and [Geonames Database](https://download.geonames.org/export/dump/).

[Link to x-loc-city](https://api-dashboard.search.brave.com/api-reference/web/search/get#header-x-loc-city)

[`x-loc-city`](https://api-dashboard.search.brave.com/api-reference/web/search/get#header-x-loc-city) stringExamples

- `San Francisco`City in USA


The generic name of the client city.

[Link to x-loc-state](https://api-dashboard.search.brave.com/api-reference/web/search/get#header-x-loc-state)

[`x-loc-state`](https://api-dashboard.search.brave.com/api-reference/web/search/get#header-x-loc-state) stringExamples

- `CA`


A code which could be up to three characters, that represent the client’s state/region. The region is the first-level subdivision (the broadest or least specific) of the [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) code.

[Link to x-loc-state-name](https://api-dashboard.search.brave.com/api-reference/web/search/get#header-x-loc-state-name)

[`x-loc-state-name`](https://api-dashboard.search.brave.com/api-reference/web/search/get#header-x-loc-state-name) stringExamples

- `California`


The name of the client’s state/region. The region is the first-level subdivision (the broadest or least specific) of the [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) code.

[Link to x-loc-country](https://api-dashboard.search.brave.com/api-reference/web/search/get#header-x-loc-country)

[`x-loc-country`](https://api-dashboard.search.brave.com/api-reference/web/search/get#header-x-loc-country) enum<string>

The two letter country code for the client’s country.
For a list of country codes, see [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).

Available options:`AD``AE``AF`+246 more

[Link to x-loc-postal-code](https://api-dashboard.search.brave.com/api-reference/web/search/get#header-x-loc-postal-code)

[`x-loc-postal-code`](https://api-dashboard.search.brave.com/api-reference/web/search/get#header-x-loc-postal-code) stringExamples

- `94105`Postal code in San Francisco, California, US


The client’s postal code.

[Link to api-version](https://api-dashboard.search.brave.com/api-reference/web/search/get#header-api-version)

[`api-version`](https://api-dashboard.search.brave.com/api-reference/web/search/get#header-api-version) string

The API version to use. This is denoted by the format `YYYY-MM-DD`. Default is the latest that is available. Read more about [API versioning](https://api-dashboard.search.brave.com/documentation/guides/versioning).

[Link to accept](https://api-dashboard.search.brave.com/api-reference/web/search/get#header-accept)

[`accept`](https://api-dashboard.search.brave.com/api-reference/web/search/get#header-accept) enum<string>

The default supported media type is application/json.

Default: `"application/json"`

Available options:`application/json``*/*`

[Link to cache-control](https://api-dashboard.search.brave.com/api-reference/web/search/get#header-cache-control)

[`cache-control`](https://api-dashboard.search.brave.com/api-reference/web/search/get#header-cache-control)"no-cache"

Brave Search will return cached content by default. To prevent caching set the Cache-Control header to `no-cache`. This is currently done as best effort.

[Link to user-agent](https://api-dashboard.search.brave.com/api-reference/web/search/get#header-user-agent)

[`user-agent`](https://api-dashboard.search.brave.com/api-reference/web/search/get#header-user-agent) stringExamples

- `Mozilla/5.0 (Linux; Android 12) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.71 Mobile Safari/537.36`Android

- `Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/103.0.5060.63 Mobile/15E148 Safari/604.1`iOS

- `Mozilla/5.0 (Macintosh; Intel Mac OS X 12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36`macOS

- `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36`Windows


The user agent originating the request. Brave search can utilize the user agent to provide a different experience depending on the device as described by the string. The user agent should follow the commonly used browser agent strings on each platform. For more information on curating user agents, see [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html#name-user-agent).

## [Link to Responses](https://api-dashboard.search.brave.com/api-reference/web/search/get\#responses) Responses

[Link to response 200](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200)

[200](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200) Successful Response

[Link to type](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-type)

[`type`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-type)"search"

Default: `"search"`

[Link to query](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query)

[`query`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query) objectnullable

Search query string and its modifications that are used for search.

Show child attributes

[Link to original](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.original)

[`query.original`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.original) stringrequired

The original query that was requested.

[Link to show_strict_warning](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.show_strict_warning)

[`query.show_strict_warning`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.show_strict_warning) booleannullable

Whether to show a warning that strict safesearch filtered results.

[Link to altered](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.altered)

[`query.altered`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.altered) stringnullable

The altered query by the spellchecker.

[Link to cleaned](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.cleaned)

[`query.cleaned`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.cleaned) stringnullable

The cleaned normalized query.

[Link to safesearch](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.safesearch)

[`query.safesearch`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.safesearch) booleannullable

Whether safesearch is active.

[Link to is_navigational](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.is_navigational)

[`query.is_navigational`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.is_navigational) booleannullable

Whether the query is navigational (user wants to go to a specific site).

[Link to is_geolocal](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.is_geolocal)

[`query.is_geolocal`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.is_geolocal) booleannullable

Whether the query has local intent.

[Link to local_decision](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.local_decision)

[`query.local_decision`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.local_decision) stringnullable

The local search decision for the query.

[Link to local_locations_idx](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.local_locations_idx)

[`query.local_locations_idx`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.local_locations_idx) integernullable

Index of the local location result.

[Link to is_trending](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.is_trending)

[`query.is_trending`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.is_trending) booleannullable

Whether the query is a trending topic.

[Link to is_news_breaking](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.is_news_breaking)

[`query.is_news_breaking`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.is_news_breaking) booleannullable

Whether the query is related to breaking news.

[Link to ask_for_location](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.ask_for_location)

[`query.ask_for_location`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.ask_for_location) booleannullable

Whether to prompt the user for their location.

[Link to language](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.language)

[`query.language`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.language) objectnullable

The detected language of the query.

Show child attributes

[Link to main](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.language.main)

[`query.language.main`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.language.main) stringrequired

The main language seen in the string.

[Link to spellcheck_off](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.spellcheck_off)

[`query.spellcheck_off`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.spellcheck_off) booleannullable

Whether spellcheck is disabled for this query.

[Link to country](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.country)

[`query.country`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.country) stringnullable

The country code for the query.

[Link to bad_results](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.bad_results)

[`query.bad_results`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.bad_results) booleannullable

Whether the results are considered low quality.

[Link to should_fallback](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.should_fallback)

[`query.should_fallback`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.should_fallback) booleannullable

Whether to fallback to alternative ranking.

[Link to lat](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.lat)

[`query.lat`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.lat) stringnullable

The latitude for location-based queries.

[Link to long](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.long)

[`query.long`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.long) stringnullable

The longitude for location-based queries.

[Link to postal_code](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.postal_code)

[`query.postal_code`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.postal_code) stringnullable

The postal code for location-based queries.

[Link to city](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.city)

[`query.city`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.city) stringnullable

The city for location-based queries.

[Link to header_country](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.header_country)

[`query.header_country`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.header_country) stringnullable

The country from request headers.

[Link to more_results_available](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.more_results_available)

[`query.more_results_available`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.more_results_available) booleannullable

Whether more results are available for pagination.

[Link to state](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.state)

[`query.state`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.state) stringnullable

The state/region for location-based queries.

[Link to custom_location_label](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.custom_location_label)

[`query.custom_location_label`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.custom_location_label) stringnullable

A custom label for the location.

[Link to reddit_cluster](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.reddit_cluster)

[`query.reddit_cluster`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.reddit_cluster) stringnullable

Reddit cluster identifier for discussion results.

[Link to summary_key](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.summary_key)

[`query.summary_key`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.summary_key) stringnullable

Key to retrieve AI-generated summary for the query.

[Link to search_operators](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.search_operators)

[`query.search_operators`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.search_operators) objectnullable

Search operators that were detected and applied to the query.

Show child attributes

[Link to applied](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.search_operators.applied)

[`query.search_operators.applied`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.search_operators.applied) boolean

Whether search operators were applied to the query.

Default: `false`

[Link to cleaned_query](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.search_operators.cleaned_query)

[`query.search_operators.cleaned_query`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.search_operators.cleaned_query) stringnullable

The query after search operators have been processed.

[Link to sites](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.search_operators.sites)

[`query.search_operators.sites`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.search_operators.sites) string\[\]nullable

List of site domains extracted from site: operators.

[Link to related_queries](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.related_queries)

[`query.related_queries`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-query.related_queries) string\[\]

Related queries for the query.

Default: `[]`

[Link to discussions](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions)

[`discussions`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions) objectnullable

Discussions clusters aggregated from forum posts that are relevant to the query.

Show child attributes

[Link to type](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.type)

[`discussions.type`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.type)"search"

The type identifying a discussion cluster. Currently the value is always `search`.

Default: `"search"`

[Link to results](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results)

[`discussions.results`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results) object\[\]required

A list of discussion results.

Show child attributes

[Link to title](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.title)

[`discussions.results.title`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.title) stringrequired

The title of the web page.

[Link to url](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.url)

[`discussions.results.url`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.url) stringrequired

The URL where the page is served.

[Link to is_source_local](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.is_source_local)

[`discussions.results.is_source_local`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.is_source_local) boolean

Whether the result is from a local source.

Default: `false`

[Link to is_source_both](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.is_source_both)

[`discussions.results.is_source_both`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.is_source_both) boolean

Whether the result is from both local and global sources.

Default: `false`

[Link to description](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.description)

[`discussions.results.description`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.description) stringnullable

A description for the web page.

Default: `""`

[Link to page_age](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.page_age)

[`discussions.results.page_age`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.page_age) stringnullable

The page’s date, based on its published or last modified date.

[Link to page_fetched](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.page_fetched)

[`discussions.results.page_fetched`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.page_fetched) stringnullable

A date representing when the web page was last fetched.

[Link to fetched_content_timestamp](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.fetched_content_timestamp)

[`discussions.results.fetched_content_timestamp`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.fetched_content_timestamp) integernullable

The timestamp when the content was fetched.

[Link to profile](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.profile)

[`discussions.results.profile`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.profile) objectnullable

A profile associated with the web page.

Show child attributes

[Link to language](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.language)

[`discussions.results.language`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.language) string

The main language on the web search result.

Default: `"en"`

[Link to family_friendly](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.family_friendly)

[`discussions.results.family_friendly`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.family_friendly) boolean

Whether the web page is family friendly.

Default: `true`

[Link to type](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.type)

[`discussions.results.type`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.type)"discussion"

The discussion result type identifier. The value is always `discussion`.

Default: `"discussion"`

[Link to subtype](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.subtype)

[`discussions.results.subtype`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.subtype) string

A sub type identifying the web search result type.

Default: `"generic"`

[Link to is_live](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.is_live)

[`discussions.results.is_live`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.is_live) boolean

Whether the web search result is currently live. Default value is `false`.

Default: `false`

[Link to deep_results](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.deep_results)

[`discussions.results.deep_results`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.deep_results) objectnullable

Gathered information on a web search result.

Show child attributes

[Link to schemas](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.schemas)

[`discussions.results.schemas`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.schemas) any\[\]nullable

A list of schemas (structured data) extracted from the page. The schemas try to follow [schema.org](http://schema.org/) and will return anything we can extract from the HTML that can fit into these models.

[Link to meta_url](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.meta_url)

[`discussions.results.meta_url`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.meta_url) objectnullable

Aggregated information on the URL associated with the web search result.

[Link to thumbnail](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.thumbnail)

[`discussions.results.thumbnail`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.thumbnail) objectnullable

The thumbnail of the web search result.

Show child attributes

[Link to age](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.age)

[`discussions.results.age`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.age) stringnullable

A human-readable representation of the web search result’s age. For example, `2 days ago`.

[Link to location](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.location)

[`discussions.results.location`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.location) objectnullable

The location details if the query relates to a restaurant.

Show child attributes

[Link to restaurant](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.restaurant)

[`discussions.results.restaurant`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.restaurant) objectnullable

Deprecated. Use `location` instead.

Show child attributes

[Link to video](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.video)

[`discussions.results.video`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.video) objectnullable

The video associated with the web search result.

Show child attributes

[Link to movie](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.movie)

[`discussions.results.movie`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.movie) objectnullable

The movie associated with the web search result.

Show child attributes

[Link to faq](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.faq)

[`discussions.results.faq`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.faq) objectnullable

Any frequently asked questions associated with the web search result.

Show child attributes

[Link to qa](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.qa)

[`discussions.results.qa`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.qa) objectnullable

Any question answer information associated with the web search result page.

Show child attributes

[Link to book](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.book)

[`discussions.results.book`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.book) objectnullable

Any book information associated with the web search result page.

Show child attributes

[Link to rating](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.rating)

[`discussions.results.rating`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.rating) objectnullable

Rating found for the web search result page.

Show child attributes

[Link to article](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.article)

[`discussions.results.article`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.article) objectnullable

An article found for the web search result page.

Show child attributes

[Link to product](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.product)

[`discussions.results.product`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.product) object \| objectnullable

The main product and a review that is found on the web search result page.

[Link to product_cluster](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.product_cluster)

[`discussions.results.product_cluster`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.product_cluster) object \| object\[\]nullable

A list of products and reviews that are found on the web search result page.

[Link to cluster_type](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.cluster_type)

[`discussions.results.cluster_type`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.cluster_type) stringnullable

A type representing a cluster. The value can be product\_cluster.

[Link to cluster](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.cluster)

[`discussions.results.cluster`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.cluster) object\[\]nullable

A list of web search results.

Show child attributes

[Link to creative_work](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.creative_work)

[`discussions.results.creative_work`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.creative_work) objectnullable

Aggregated information on the creative work found on the web search result.

Show child attributes

[Link to music_recording](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.music_recording)

[`discussions.results.music_recording`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.music_recording) objectnullable

Aggregated information on music recording found on the web search result.

Show child attributes

[Link to review](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.review)

[`discussions.results.review`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.review) objectnullable

Aggregated information on the review found on the web search result.

Show child attributes

[Link to recipe](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.recipe)

[`discussions.results.recipe`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.recipe) objectnullable

Aggregated information on a recipe found on the web search result page.

Show child attributes

[Link to software](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.software)

[`discussions.results.software`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.software) objectnullable

Aggregated information on a software product found on the web search result page.

Show child attributes

[Link to organization](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.organization)

[`discussions.results.organization`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.organization) objectnullable

Aggregated information on a organization found on the web search result page.

Show child attributes

[Link to content_type](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.content_type)

[`discussions.results.content_type`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.content_type) stringnullable

The content type associated with the search result page.

[Link to extra_snippets](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.extra_snippets)

[`discussions.results.extra_snippets`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.extra_snippets) string\[\]nullable

A list of extra alternate snippets for the web search result.

[Link to icons](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.icons)

[`discussions.results.icons`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.icons) object\[\]nullable

Icons associated with the search result.

Show child attributes

[Link to data](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.data)

[`discussions.results.data`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.results.data) objectnullable

The enriched aggregated data for the relevant forum post.

Show child attributes

[Link to mutated_by_goggles](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.mutated_by_goggles)

[`discussions.mutated_by_goggles`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-discussions.mutated_by_goggles) boolean

Whether the discussion results are changed by Goggles. The value is `false` by default.

Default: `false`

[Link to faq](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-faq)

[`faq`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-faq) objectnullable

Frequently asked questions that are relevant to the search query.

Show child attributes

[Link to type](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-faq.type)

[`faq.type`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-faq.type)"faq"

The FAQ result type identifier. The value is always `faq`.

Default: `"faq"`

[Link to results](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-faq.results)

[`faq.results`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-faq.results) object\[\]required

A list of aggregated question answer results relevant to the query.

Show child attributes

[Link to question](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-faq.results.question)

[`faq.results.question`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-faq.results.question) stringrequired

The question being asked.

[Link to answer](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-faq.results.answer)

[`faq.results.answer`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-faq.results.answer) stringrequired

The answer to the question.

[Link to title](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-faq.results.title)

[`faq.results.title`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-faq.results.title) stringrequired

The title of the post.

[Link to url](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-faq.results.url)

[`faq.results.url`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-faq.results.url) stringrequired

The URL pointing to the post.

[Link to meta_url](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-faq.results.meta_url)

[`faq.results.meta_url`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-faq.results.meta_url) objectnullable

Aggregated information about the URL.

Show child attributes

[Link to infobox](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-infobox)

[`infobox`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-infobox) objectnullable

Aggregated information on an entity showable as an infobox.

Show child attributes

[Link to type](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-infobox.type)

[`infobox.type`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-infobox.type)"graph"

The type identifier for infoboxes. The value is always `graph`.

Default: `"graph"`

[Link to results](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-infobox.results)

[`infobox.results`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-infobox.results) object \| object \| object \| object \| object\[\]required

A list of infoboxes associated with the query.

[Link to locations](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations)

[`locations`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations) objectnullable

Places of interest (POIs) relevant to location sensitive queries.

Show child attributes

[Link to type](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.type)

[`locations.type`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.type)"locations"

Location type identifier. The value is always `locations`.

Default: `"locations"`

[Link to results](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results)

[`locations.results`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results) object\[\]required

An aggregated list of location sensitive results.

Show child attributes

[Link to title](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.title)

[`locations.results.title`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.title) stringrequired

The title of the web page.

[Link to url](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.url)

[`locations.results.url`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.url) stringrequired

The URL where the page is served.

[Link to is_source_local](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.is_source_local)

[`locations.results.is_source_local`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.is_source_local) boolean

Whether the result is from a local source.

Default: `false`

[Link to is_source_both](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.is_source_both)

[`locations.results.is_source_both`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.is_source_both) boolean

Whether the result is from both local and global sources.

Default: `false`

[Link to description](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.description)

[`locations.results.description`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.description) stringnullable

A description for the web page.

Default: `""`

[Link to page_age](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.page_age)

[`locations.results.page_age`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.page_age) stringnullable

The page’s date, based on its published or last modified date.

[Link to page_fetched](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.page_fetched)

[`locations.results.page_fetched`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.page_fetched) stringnullable

A date representing when the web page was last fetched.

[Link to fetched_content_timestamp](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.fetched_content_timestamp)

[`locations.results.fetched_content_timestamp`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.fetched_content_timestamp) integernullable

The timestamp when the content was fetched.

[Link to profile](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.profile)

[`locations.results.profile`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.profile) objectnullable

A profile associated with the web page.

Show child attributes

[Link to language](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.language)

[`locations.results.language`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.language) stringnullable

A language classification for the web page.

[Link to family_friendly](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.family_friendly)

[`locations.results.family_friendly`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.family_friendly) boolean

Whether the web page is family friendly.

Default: `true`

[Link to type](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.type)

[`locations.results.type`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.type)"location\_result"

Location result type identifier. The value is always `location_result`.

Default: `"location_result"`

[Link to provider_url](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.provider_url)

[`locations.results.provider_url`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.provider_url) stringrequired

The complete URL of the provider.

[Link to coordinates](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.coordinates)

[`locations.results.coordinates`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.coordinates) any\[\]nullable

A list of coordinates associated with the location. This is a lat long represented as a floating point.

[Link to zoom_level](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.zoom_level)

[`locations.results.zoom_level`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.zoom_level) integer

The zoom level on the map.

Default: `7`

[Link to thumbnail](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.thumbnail)

[`locations.results.thumbnail`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.thumbnail) objectnullable

The thumbnail associated with the location.

Show child attributes

[Link to postal_address](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.postal_address)

[`locations.results.postal_address`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.postal_address) objectnullable

The postal address associated with the location.

Show child attributes

[Link to opening_hours](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.opening_hours)

[`locations.results.opening_hours`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.opening_hours) objectnullable

The opening hours, if it is a business, associated with the location.

Show child attributes

[Link to contact](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.contact)

[`locations.results.contact`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.contact) objectnullable

The contact of the business associated with the location.

Show child attributes

[Link to price_range](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.price_range)

[`locations.results.price_range`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.price_range) stringnullable

A display string used to show the price classification for the business.

[Link to rating](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.rating)

[`locations.results.rating`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.rating) objectnullable

The ratings of the business.

Show child attributes

[Link to distance](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.distance)

[`locations.results.distance`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.distance) objectnullable

The distance of the location from the client.

Show child attributes

[Link to profiles](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.profiles)

[`locations.results.profiles`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.profiles) object\[\]nullable

Profiles associated with the business.

Show child attributes

[Link to reviews](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.reviews)

[`locations.results.reviews`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.reviews) objectnullable

Aggregated reviews from various sources relevant to the business.

Show child attributes

[Link to pictures](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.pictures)

[`locations.results.pictures`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.pictures) objectnullable

A bunch of pictures associated with the business.

Show child attributes

[Link to action](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.action)

[`locations.results.action`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.action) objectnullable

An action to be taken.

Show child attributes

[Link to serves_cuisine](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.serves_cuisine)

[`locations.results.serves_cuisine`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.serves_cuisine) string\[\]nullable

A list of cuisine categories served.

[Link to categories](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.categories)

[`locations.results.categories`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.categories) string\[\]

A list of categories.

Default: `[]`

[Link to icon_category](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.icon_category)

[`locations.results.icon_category`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.icon_category) stringnullable

An icon category.

[Link to timezone](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.timezone)

[`locations.results.timezone`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.timezone) stringnullable

IANA timezone identifier.

[Link to timezone_offset](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.timezone_offset)

[`locations.results.timezone_offset`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.timezone_offset) integernullable

The UTC offset of the timezone.

[Link to id](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.id)

[`locations.results.id`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.id) stringnullable

A temporary id associated with this result, which can be used to retrieve extra information about the location. It remains valid for 8 hours.

[Link to results](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.results)

[`locations.results.results`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.results.results) object\[\]nullable

Web results related to this location.

Show child attributes

[Link to provider](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.provider)

[`locations.provider`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-locations.provider) objectnullable

The provider of the location data.

[Link to mixed](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-mixed)

[`mixed`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-mixed) objectnullable

Preferred ranked order of search results.

Show child attributes

[Link to type](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-mixed.type)

[`mixed.type`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-mixed.type)"mixed"

The type representing the model mixed. The value is always `mixed`.

Default: `"mixed"`

[Link to main](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-mixed.main)

[`mixed.main`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-mixed.main) object\[\]nullable

The ranking order for the main section of the search result page.

Show child attributes

[Link to type](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-mixed.main.type)

[`mixed.main.type`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-mixed.main.type) stringrequired

The type of the result.

[Link to index](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-mixed.main.index)

[`mixed.main.index`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-mixed.main.index) integernullable

The 0th based index where the result should be placed.

[Link to all](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-mixed.main.all)

[`mixed.main.all`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-mixed.main.all) boolean

Whether to put all the results from the type at specific position.

Default: `false`

[Link to top](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-mixed.top)

[`mixed.top`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-mixed.top) object\[\]nullable

The ranking order for the top section of the search result page.

Show child attributes

[Link to type](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-mixed.top.type)

[`mixed.top.type`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-mixed.top.type) stringrequired

The type of the result.

[Link to index](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-mixed.top.index)

[`mixed.top.index`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-mixed.top.index) integernullable

The 0th based index where the result should be placed.

[Link to all](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-mixed.top.all)

[`mixed.top.all`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-mixed.top.all) boolean

Whether to put all the results from the type at specific position.

Default: `false`

[Link to side](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-mixed.side)

[`mixed.side`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-mixed.side) object\[\]nullable

The ranking order for the side section of the search result page.

Show child attributes

[Link to type](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-mixed.side.type)

[`mixed.side.type`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-mixed.side.type) stringrequired

The type of the result.

[Link to index](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-mixed.side.index)

[`mixed.side.index`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-mixed.side.index) integernullable

The 0th based index where the result should be placed.

[Link to all](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-mixed.side.all)

[`mixed.side.all`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-mixed.side.all) boolean

Whether to put all the results from the type at specific position.

Default: `false`

[Link to news](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news)

[`news`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news) objectnullable

News results relevant to the query.

Show child attributes

[Link to type](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.type)

[`news.type`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.type)"news"

The type of API result. The value is always `news`.

Default: `"news"`

[Link to results](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results)

[`news.results`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results) object\[\]required

The list of news results.

Show child attributes

[Link to title](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results.title)

[`news.results.title`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results.title) stringrequired

The title of the web page.

[Link to url](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results.url)

[`news.results.url`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results.url) stringrequired

The URL where the page is served.

[Link to is_source_local](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results.is_source_local)

[`news.results.is_source_local`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results.is_source_local) boolean

Whether the result is from a local source.

Default: `false`

[Link to is_source_both](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results.is_source_both)

[`news.results.is_source_both`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results.is_source_both) boolean

Whether the result is from both local and global sources.

Default: `false`

[Link to description](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results.description)

[`news.results.description`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results.description) stringnullable

A description for the web page.

Default: `""`

[Link to page_age](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results.page_age)

[`news.results.page_age`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results.page_age) stringnullable

The page’s date, based on its published or last modified date.

[Link to page_fetched](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results.page_fetched)

[`news.results.page_fetched`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results.page_fetched) stringnullable

A date representing when the web page was last fetched.

[Link to fetched_content_timestamp](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results.fetched_content_timestamp)

[`news.results.fetched_content_timestamp`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results.fetched_content_timestamp) integernullable

The timestamp when the content was fetched.

[Link to profile](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results.profile)

[`news.results.profile`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results.profile) objectnullable

A profile associated with the web page.

Show child attributes

[Link to language](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results.language)

[`news.results.language`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results.language) stringnullable

A language classification for the web page.

[Link to family_friendly](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results.family_friendly)

[`news.results.family_friendly`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results.family_friendly) boolean

Whether the web page is family friendly.

Default: `true`

[Link to meta_url](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results.meta_url)

[`news.results.meta_url`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results.meta_url) objectnullable

The aggregated information on the URL representing a news result.

[Link to source](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results.source)

[`news.results.source`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results.source) stringnullable

The source of the news.

[Link to breaking](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results.breaking)

[`news.results.breaking`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results.breaking) boolean

Whether the news result is currently a breaking news.

Default: `false`

[Link to is_live](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results.is_live)

[`news.results.is_live`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results.is_live) boolean

Whether the news result is currently live.

Default: `false`

[Link to thumbnail](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results.thumbnail)

[`news.results.thumbnail`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results.thumbnail) objectnullable

The thumbnail associated with the news result.

Show child attributes

[Link to age](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results.age)

[`news.results.age`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results.age) stringnullable

A human-readable representation of the news article’s age. For example, `2 days ago`.

[Link to extra_snippets](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results.extra_snippets)

[`news.results.extra_snippets`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results.extra_snippets) string\[\]nullable

A list of extra alternate snippets for the news search result.

[Link to icons](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results.icons)

[`news.results.icons`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.results.icons) object\[\]nullable

Icons associated with the news result.

Show child attributes

[Link to mutated_by_goggles](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.mutated_by_goggles)

[`news.mutated_by_goggles`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-news.mutated_by_goggles) boolean

Whether the results are mutated by a goggle.

Default: `false`

[Link to videos](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-videos)

[`videos`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-videos) objectnullable

Videos results relevant to the query.

Show child attributes

[Link to type](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-videos.type)

[`videos.type`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-videos.type)"videos"

The type of API result. The value is always `videos`.

Default: `"videos"`

[Link to results](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-videos.results)

[`videos.results`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-videos.results) object\[\]required

The list of video results.

Show child attributes

[Link to type](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-videos.results.type)

[`videos.results.type`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-videos.results.type)"video\_result"

The type of video search API result. The value is always `video_result`.

Default: `"video_result"`

[Link to url](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-videos.results.url)

[`videos.results.url`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-videos.results.url) stringrequired

The source URL of the video.

[Link to title](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-videos.results.title)

[`videos.results.title`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-videos.results.title) stringrequired

The title of the video.

[Link to description](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-videos.results.description)

[`videos.results.description`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-videos.results.description) stringnullable

The description for the video.

[Link to age](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-videos.results.age)

[`videos.results.age`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-videos.results.age) stringnullable

A human-readable representation of the video’s age. For example, `2 days ago`.

[Link to page_age](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-videos.results.page_age)

[`videos.results.page_age`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-videos.results.page_age) stringnullable

The page’s date, based on its published or last modified date.

[Link to page_fetched](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-videos.results.page_fetched)

[`videos.results.page_fetched`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-videos.results.page_fetched) stringnullable

The ISO date time when the page was last fetched. The format is `YYYY-MM-DDTHH:MM:SSZ`.

[Link to fetched_content_timestamp](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-videos.results.fetched_content_timestamp)

[`videos.results.fetched_content_timestamp`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-videos.results.fetched_content_timestamp) integernullable

The timestamp when the content was fetched.

[Link to video](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-videos.results.video)

[`videos.results.video`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-videos.results.video) objectnullable

Metadata for the video.

Show child attributes

[Link to meta_url](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-videos.results.meta_url)

[`videos.results.meta_url`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-videos.results.meta_url) objectnullable

Aggregated information on the URL associated with the video search result.

Show child attributes

[Link to thumbnail](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-videos.results.thumbnail)

[`videos.results.thumbnail`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-videos.results.thumbnail) objectnullable

The thumbnail for the video.

Show child attributes

[Link to mutated_by_goggles](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-videos.mutated_by_goggles)

[`videos.mutated_by_goggles`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-videos.mutated_by_goggles) boolean

Whether the results are mutated by a goggle.

Default: `false`

[Link to web](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web)

[`web`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web) objectnullable

Web results relevant to the query.

Show child attributes

[Link to type](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.type)

[`web.type`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.type)"search"

A type identifying web search results. The value is always `search`.

Default: `"search"`

[Link to results](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results)

[`web.results`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results) object\[\]required

A list of search results.

Show child attributes

[Link to title](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.title)

[`web.results.title`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.title) stringrequired

The title of the web page.

[Link to url](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.url)

[`web.results.url`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.url) stringrequired

The URL where the page is served.

[Link to is_source_local](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.is_source_local)

[`web.results.is_source_local`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.is_source_local) boolean

Whether the result is from a local source.

Default: `false`

[Link to is_source_both](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.is_source_both)

[`web.results.is_source_both`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.is_source_both) boolean

Whether the result is from both local and global sources.

Default: `false`

[Link to description](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.description)

[`web.results.description`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.description) stringnullable

A description for the web page.

Default: `""`

[Link to page_age](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.page_age)

[`web.results.page_age`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.page_age) stringnullable

The page’s date, based on its published or last modified date.

[Link to page_fetched](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.page_fetched)

[`web.results.page_fetched`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.page_fetched) stringnullable

A date representing when the web page was last fetched.

[Link to fetched_content_timestamp](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.fetched_content_timestamp)

[`web.results.fetched_content_timestamp`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.fetched_content_timestamp) integernullable

The timestamp when the content was fetched.

[Link to profile](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.profile)

[`web.results.profile`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.profile) objectnullable

A profile associated with the web page.

Show child attributes

[Link to language](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.language)

[`web.results.language`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.language) string

The main language on the web search result.

Default: `"en"`

[Link to family_friendly](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.family_friendly)

[`web.results.family_friendly`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.family_friendly) boolean

Whether the web page is family friendly.

Default: `true`

[Link to type](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.type)

[`web.results.type`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.type)"search\_result"

A type identifying a web search result. The value is always `search_result`.

Default: `"search_result"`

[Link to subtype](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.subtype)

[`web.results.subtype`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.subtype) string

A sub type identifying the web search result type.

Default: `"generic"`

[Link to is_live](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.is_live)

[`web.results.is_live`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.is_live) boolean

Whether the web search result is currently live. Default value is `false`.

Default: `false`

[Link to deep_results](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.deep_results)

[`web.results.deep_results`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.deep_results) objectnullable

Gathered information on a web search result.

Show child attributes

[Link to schemas](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.schemas)

[`web.results.schemas`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.schemas) any\[\]nullable

A list of schemas (structured data) extracted from the page. The schemas try to follow [schema.org](http://schema.org/) and will return anything we can extract from the HTML that can fit into these models.

[Link to meta_url](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.meta_url)

[`web.results.meta_url`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.meta_url) objectnullable

Aggregated information on the URL associated with the web search result.

[Link to thumbnail](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.thumbnail)

[`web.results.thumbnail`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.thumbnail) objectnullable

The thumbnail of the web search result.

Show child attributes

[Link to age](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.age)

[`web.results.age`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.age) stringnullable

A human-readable representation of the web search result’s age. For example, `2 days ago`.

[Link to location](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.location)

[`web.results.location`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.location) objectnullable

The location details if the query relates to a restaurant.

Show child attributes

[Link to restaurant](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.restaurant)

[`web.results.restaurant`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.restaurant) objectnullable

Deprecated. Use `location` instead.

Show child attributes

[Link to video](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.video)

[`web.results.video`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.video) objectnullable

The video associated with the web search result.

Show child attributes

[Link to movie](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.movie)

[`web.results.movie`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.movie) objectnullable

The movie associated with the web search result.

Show child attributes

[Link to faq](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.faq)

[`web.results.faq`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.faq) objectnullable

Any frequently asked questions associated with the web search result.

Show child attributes

[Link to qa](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.qa)

[`web.results.qa`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.qa) objectnullable

Any question answer information associated with the web search result page.

Show child attributes

[Link to book](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.book)

[`web.results.book`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.book) objectnullable

Any book information associated with the web search result page.

Show child attributes

[Link to rating](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.rating)

[`web.results.rating`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.rating) objectnullable

Rating found for the web search result page.

Show child attributes

[Link to article](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.article)

[`web.results.article`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.article) objectnullable

An article found for the web search result page.

Show child attributes

[Link to product](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.product)

[`web.results.product`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.product) object \| objectnullable

The main product and a review that is found on the web search result page.

[Link to product_cluster](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.product_cluster)

[`web.results.product_cluster`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.product_cluster) object \| object\[\]nullable

A list of products and reviews that are found on the web search result page.

[Link to cluster_type](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.cluster_type)

[`web.results.cluster_type`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.cluster_type) stringnullable

A type representing a cluster. The value can be product\_cluster.

[Link to cluster](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.cluster)

[`web.results.cluster`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.cluster) object\[\]nullable

A list of web search results.

Show child attributes

[Link to creative_work](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.creative_work)

[`web.results.creative_work`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.creative_work) objectnullable

Aggregated information on the creative work found on the web search result.

Show child attributes

[Link to music_recording](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.music_recording)

[`web.results.music_recording`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.music_recording) objectnullable

Aggregated information on music recording found on the web search result.

Show child attributes

[Link to review](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.review)

[`web.results.review`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.review) objectnullable

Aggregated information on the review found on the web search result.

Show child attributes

[Link to recipe](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.recipe)

[`web.results.recipe`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.recipe) objectnullable

Aggregated information on a recipe found on the web search result page.

Show child attributes

[Link to software](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.software)

[`web.results.software`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.software) objectnullable

Aggregated information on a software product found on the web search result page.

Show child attributes

[Link to organization](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.organization)

[`web.results.organization`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.organization) objectnullable

Aggregated information on a organization found on the web search result page.

Show child attributes

[Link to content_type](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.content_type)

[`web.results.content_type`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.content_type) stringnullable

The content type associated with the search result page.

[Link to extra_snippets](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.extra_snippets)

[`web.results.extra_snippets`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.extra_snippets) string\[\]nullable

A list of extra alternate snippets for the web search result.

[Link to icons](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.icons)

[`web.results.icons`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.results.icons) object\[\]nullable

Icons associated with the search result.

Show child attributes

[Link to family_friendly](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.family_friendly)

[`web.family_friendly`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-web.family_friendly) boolean

Whether the results are family friendly.

Default: `true`

[Link to summarizer](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-summarizer)

[`summarizer`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-summarizer) objectnullable

Summary key to get summary results for the query.

Show child attributes

[Link to type](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-summarizer.type)

[`summarizer.type`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-summarizer.type)"summarizer"

The type of result. The value is always `summarizer`.

Default: `"summarizer"`

[Link to key](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-summarizer.key)

[`summarizer.key`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-summarizer.key) stringrequired

The key to retrieve the full summary results.

[Link to rich](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-rich)

[`rich`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-rich) objectnullable

Callback information to retrieve rich results.

Show child attributes

[Link to type](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-rich.type)

[`rich.type`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-rich.type)"rich"

Default: `"rich"`

[Link to hint](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-rich.hint)

[`rich.hint`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-rich.hint) objectnullable

Show child attributes

[Link to vertical](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-rich.hint.vertical)

[`rich.hint.vertical`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-rich.hint.vertical) enum<string>required

The vertical associated with the callback. For the full list of verticals supported see the Rich Vertical list.

Available options:`calculator``cryptocurrency``currency`+8 more

[Link to callback_key](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-rich.hint.callback_key)

[`rich.hint.callback_key`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-200-rich.hint.callback_key) stringrequired

The unique key for the callback.

[Link to response 404](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-404)

[404](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-404) Not Found

[Link to type](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-404-type)

[`type`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-404-type) string

Default: `"ErrorResponse"`

[Link to error](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-404-error)

[`error`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-404-error) objectrequired

Show child attributes

[Link to id](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-404-error.id)

[`error.id`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-404-error.id) stringrequired

A unique identifier for this particular occurrence of the problem.

[Link to status](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-404-error.status)

[`error.status`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-404-error.status) integerrequired

The HTTP status code applicable to this problem, expressed as a string value.

[Link to detail](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-404-error.detail)

[`error.detail`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-404-error.detail) stringnullable

Explanation specific to this occurrence of the problem. Like title, this field’s value can be localized.

[Link to meta](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-404-error.meta)

[`error.meta`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-404-error.meta) objectnullable

A meta object containing non-standard meta-information about the error.

[Link to code](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-404-error.code)

[`error.code`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-404-error.code) enum<string>required

An application-specific error code, expressed as a string value.

Available options:`INTERNAL``QUOTA_LIMITED``RATE_LIMITED`+7 more

[Link to time](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-404-time)

[`time`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-404-time) integer

Default: `0`

[Link to response 422](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-422)

[422](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-422) Unprocessable Entity

[Link to type](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-422-type)

[`type`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-422-type) string

Default: `"ErrorResponse"`

[Link to error](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-422-error)

[`error`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-422-error) objectrequired

Show child attributes

[Link to id](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-422-error.id)

[`error.id`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-422-error.id) stringrequired

A unique identifier for this particular occurrence of the problem.

[Link to status](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-422-error.status)

[`error.status`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-422-error.status) integerrequired

The HTTP status code applicable to this problem, expressed as a string value.

[Link to detail](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-422-error.detail)

[`error.detail`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-422-error.detail) stringnullable

Explanation specific to this occurrence of the problem. Like title, this field’s value can be localized.

[Link to meta](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-422-error.meta)

[`error.meta`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-422-error.meta) objectnullable

A meta object containing non-standard meta-information about the error.

[Link to code](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-422-error.code)

[`error.code`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-422-error.code) enum<string>required

An application-specific error code, expressed as a string value.

Available options:`INTERNAL``QUOTA_LIMITED``RATE_LIMITED`+7 more

[Link to time](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-422-time)

[`time`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-422-time) integer

Default: `0`

[Link to response 429](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-429)

[429](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-429) Too Many Requests

[Link to type](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-429-type)

[`type`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-429-type) string

Default: `"ErrorResponse"`

[Link to error](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-429-error)

[`error`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-429-error) objectrequired

Show child attributes

[Link to id](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-429-error.id)

[`error.id`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-429-error.id) stringrequired

A unique identifier for this particular occurrence of the problem.

[Link to status](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-429-error.status)

[`error.status`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-429-error.status) integerrequired

The HTTP status code applicable to this problem, expressed as a string value.

[Link to detail](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-429-error.detail)

[`error.detail`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-429-error.detail) stringnullable

Explanation specific to this occurrence of the problem. Like title, this field’s value can be localized.

[Link to meta](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-429-error.meta)

[`error.meta`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-429-error.meta) objectnullable

A meta object containing non-standard meta-information about the error.

[Link to code](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-429-error.code)

[`error.code`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-429-error.code) enum<string>required

An application-specific error code, expressed as a string value.

Available options:`INTERNAL``QUOTA_LIMITED``RATE_LIMITED`+7 more

[Link to time](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-429-time)

[`time`](https://api-dashboard.search.brave.com/api-reference/web/search/get#response-429-time) integer

Default: `0`

Ask

Open API AssistantCtrl I
