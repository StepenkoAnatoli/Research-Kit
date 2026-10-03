# ADR-0137: A browser capture records the origin's answer, or says that it could not

Date: 2026-10-03
Status: accepted. Lifts the freeze (ADR-0117) for one change inside the browser transport
(ADR-0088, ADR-0118). From the output-reliability audit of 2026-10-03 (G5).

## Context

The browser transport renders a page with Chromium's `--dump-dom` and returns the DOM. That
flag reports no HTTP status and no final URL, so every browser capture carries
`statusCode: ''`. The collector refuses an error page by its numeric status - a 503 from
Google had become an evidence row on 2026-09-28, and since then a status of 400 or more is a
failed fetch on every transport - but an empty status is not a number, so the rule cannot
act. The transport recognises Chromium's own error pages (`chromeErrorOf`); an origin's
error page, a `403 Forbidden` with a long refusal in `<main>`, is rendered like any page
and graded `full`. Reproduced on 2026-10-03 with the render seam: `ok: true`,
`statusCode: ""`, `completeness: "full"`, title "403 Forbidden".

The guard proxy (ADR-0118) sees the status of a plain-HTTP answer but not of one inside a
CONNECT tunnel, which is every HTTPS page; it cannot supply the status.

## Decision

Two rules, in this order.

1. **Chromium reports the status itself, through its net log.** The transport adds
   `--log-net-log=<file>` (a temporary file beside the capture's scratch, deleted after
   the read) with the default capture mode, and after the render reads the log for the
   document request: the `URL_REQUEST` whose first URL is the page asked for, its
   redirects (`HTTP_TRANSACTION_READ_RESPONSE_HEADERS` events carrying the status line),
   and the final URL. The capture then carries the real `statusCode` and the final URL,
   the collector's existing rule refuses an error page as it does on every other
   transport, and a redirect to an internal address is refused as ADR-0115 refuses it.
2. **When the log gives no status - an older Chromium, a log that could not be written or
   parsed, a document request that is not in it - the capture is graded `partial`, with
   `omitted` naming that the origin's status was not observed.** A reader of the ledger and
   the gate then sees that this page may be an error page dressed as content, and
   `capture-completeness` flags an unknown resting solely on such captures.

The transport never guesses a status from the page's text: a title reading "403 Forbidden"
is not a status, and a page about HTTP errors would be refused by its own subject.

## Rejected

- **A title and heading blacklist for error pages.** Cheap and sometimes right; wrong on a
  documentation page about 403s, silent on an error page that titles itself normally, and
  it would make the kit's refusals depend on English words rather than the protocol.
- **Grading every browser capture partial.** Honest, and it would end the transport's
  usefulness: every unknown closed through it would be flagged for a shortcoming the
  transport can remove by reading what Chromium already knows.
- **Chrome DevTools Protocol instrumentation** (what Browsertrix does). The right tool and
  the wrong size: a socket, a protocol library and a session lifecycle for one number the
  net log already writes to a file.
- **Reading the status through the guard.** It sees only plain HTTP; HTTPS is the web.

## Trigger to revisit

Chromium removes or changes the net log's `URL_REQUEST` events for a navigation, or the
kit gains a transport that drives the browser through DevTools for another reason.
