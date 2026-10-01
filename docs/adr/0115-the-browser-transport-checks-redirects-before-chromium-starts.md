# ADR-0115 — The browser transport checks a URL's redirects before Chromium starts

- **Date:** 2026-10-01
- **Status:** accepted; supersedes the "browser transport" bullet of ADR-0110
- **Area:** `lib/browser-transport.mjs` (`scrape`), `lib/http-transport.mjs` (`redirectTarget`)

## Context

ADR-0110 refuses a redirect into this machine's network for the keyless fetch, and left the
browser transport open, with a trigger. Chromium follows redirects inside itself, and
`--dump-dom` prints only the DOM: no status, and no final URL. So a public page answering
`302 -> http://169.254.169.254/...` was rendered and captured. The check first proposed for
this, refusing a capture whose final URL is internal, cannot be built: there is no final URL to
read.

## Decision

- **Before Chromium starts, the URL's server redirects are followed with the keyless fetch**
  (`redirectTarget`). It judges each hop as ADR-0110 and ADR-0114 do, and it stops at the final
  URL without reading the page.
  - A hop into this machine's network refuses the fetch, by name, and Chromium is never started.
  - Redirects the keyless client cannot follow (a refused connection, a 403 to non-browsers) are
    not a refusal. The browser may reach a page this client cannot, and that is the browser
    transport's reason to exist.
- **`redirects` is an option of `scrape`**, so the tests that stub Chromium stub this check too,
  and the suite stays offline.

## Not covered, and why

- **Navigation made by the page itself**: a script setting `location`, a `<meta http-equiv=refresh>`,
  and subresource requests. These happen inside Chromium, after this check.
- **A server that redirects Chromium differently** from the check a moment earlier, or a name
  that resolves differently for Chromium.
- **The full fix** is to run Chromium through a small local proxy that judges every request it
  makes, with the guarded lookup of ADR-0114. Chromium is now run with `spawnSync`, so that proxy
  needs a runner process of its own: a rewrite of the transport. **Trigger:** a report of a page
  reaching an internal address through the browser transport by a route this check does not
  see, or the transport being rewritten for another reason.

## Rejected alternatives

- **Drive Chromium through its DevTools protocol and intercept requests.** That is the most
  complete answer, and needs a WebSocket client written by hand (the kit has no dependencies)
  plus a different way of running the browser. It is out of proportion to a gap the check above
  narrows to page-made navigation.
- **Refuse when the final URL is internal.** There is no final URL: `--dump-dom` does not report
  one.
