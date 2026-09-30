# Evidence

One row per fetched page. `Raw` points at the cached page text under `research/raw/`,
which is what makes the claim checkable - a row without raw evidence fails preflight.

The `Finding` cell arrives as an auto-extracted summary. Rewrite it into a real claim:
what the page actually establishes, with the quote or number that proves it.

| ID | Retrieved | Type | URL | Finding | Raw |
|---|---|---|---|---|---|
| E-01 | 2026-09-30 | P | https://docs.searxng.org/dev/search_api.html | The Search API is `GET` or `POST` on `/` or `/search`, with `q` required and `categories`, `language`, `pageno`, `time_range`, `format` (json, csv, rss) and `safesearch` optional. A format the instance has not enabled is refused with HTTP 403. [quote: Requesting an unset format will return a 403 Forbidden error.] [quote: Be aware that many public instances have these formats disabled.] | research/raw/2026-09-30-search-api-searxng-documentation-2026-9--searxng-998af772.md |
| E-02 | 2026-09-30 | P | https://docs.searxng.org/admin/settings/settings_search.html | `search.formats` lists the output formats an instance serves, and its default is `html` only, so JSON must be added to `settings.yml` before the API answers it. [quote: Result formats available from web, remove format to deny access] | research/raw/2026-09-30-search-searxng-documentation-2026-9-30-a-searxng-f7dcb3f7.md |
| E-03 | 2026-09-30 | P | https://docs.searxng.org/admin/searx.limiter.html | The limiter is bot protection that is off until `server.limiter: true` is set, and it needs a Valkey database; it exists because SearXNG itself gets blocked by the engines it queries on behalf of bots. [quote: To enable the limiter activate] [quote: the requests from bots to SearXNG must also be blocked, this is the task of the limiter] | research/raw/2026-09-30-limiter-searxng-documentation-2026-9-30--searxng-e75b2380.md |
| E-04 | 2026-09-30 | P | https://docs.searxng.org/dev/result_types/main_result.html | An index of the typed main-result classes; MainResult is the base type of a web result. Not cited: E-06 is the page that defines MainResult. | research/raw/2026-09-30-main-search-results-searxng-documentatio-searxng-9a5ad052.md |
| E-05 | 2026-09-30 | P | https://raw.githubusercontent.com/searxng/searxng/master/searx/webutils.py | `get_json_response` returns an object whose `results` is each ordered result's `as_dict()`, beside `query`, `answers`, `corrections`, `infoboxes`, `suggestions` and `unresponsive_engines`; the CSV writer beside it reads `title`, `url`, `content`, `engine` and `score` from the same results. | research/raw/2026-09-30-webutils-py-githubusercontent-a257c769.md |
| E-06 | 2026-09-30 | P | https://docs.searxng.org/dev/result_types/main/mainresult.html | MainResult carries `title`, `content` (the snippet), `url`, `engine`, `engines`, `score` and `category`, and `url` is typed `str \| None`, so a result can arrive without one. [quote: Extract or description of the result item] | research/raw/2026-09-30-main-results-searxng-documentation-2026--searxng-dc057f53.md |
