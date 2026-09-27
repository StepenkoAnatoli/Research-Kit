# ADR-0045 — The collector fetches pages it is given by URL

- **Date:** 2026-09-27
- **Status:** accepted
- **Area:** remote collection, dispatch inputs
- **Depends on:** ADR-0031 (dispatch returns the run id), ADR-0035 (what a dispatch input discloses)

## Context

`collect.yml` could only search. A caller who already knew the page that owns the fact had
two options: hope a search would surface it, or collect it on a local machine with keys.
Examples are an API response, a changelog post, or GitHub's own reference page. The second
option is exactly what the remote collector exists to avoid. The kit's plans have always
supported `urls`, fetched directly, but no dispatch input reached them.

## Decision

**A line of the `queries` input that is an http(s) URL is a page to fetch, not a search.**

- `collect.yml` routes each line. A line that parses as `http://` or `https://` becomes a
  plan URL; any other line stays a search query.
- **With URLs and no queries, nothing is searched.** Falling back to the topic, as an empty
  input still does, would spend searches and budget on noise nobody asked for.
- Each page counts against `max_pages`; the spend cap is unchanged.
- **A dispatched page is typed `S`,** like any page the collector reached. The reviewer
  promotes it after reading, as with every other capture (DEFAULT_SOURCE_TYPE).
- **The run log prints counts, never URLs.** It is readable by any signed-in user, and a
  URL can name the subject or carry a signed query string.
- `queriesInput` in `lib/dispatch.mjs` builds the input for `collect-remote --url` and the
  MCP `collect` tool's `urls`. It refuses a non-http(s) URL before dispatch, so a typo is
  caught on the caller's machine and never searched as text on the runner.

## Rejected alternatives

- **A separate `urls` dispatch input.** `collect.yml` uses 9 of the 10 inputs GitHub
  allows, and a test says the next one must be a decision. One newline-separated input
  already carries a list, and an http(s) URL cannot be mistaken for a search query.
- **Typing dispatched pages `P`.** Naming a page is not reading it. The collector may not
  claim a page is primary; only the reviewer may, after reading it.
- **Accepting any scheme.** Anything other than http(s) stays text to search, so no line
  can point the runner at a file or another protocol.

## Consequences

- The U-2 kind of check (capture a known API response) can now run on GitHub, not only in
  a local session.
- A caller who wants a URL searched as text cannot do so. That trade-off is
  deliberate: nobody searches for a URL.

## Trigger that would reopen this

GitHub raising the dispatch input limit, which would make a dedicated `urls` input free.
Or a need to fetch something that is not an http(s) page.
