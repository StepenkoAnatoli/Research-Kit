# ADR-0125: A request before the page's own is the browser's

Date: 2026-10-02
Status: accepted

## Context

ADR-0124 drops the browser's own service traffic by host name. Its LIVE pin - render a
loopback page through the real browser, and nothing beyond loopback may be carried - went
red on every CI leg the first time it ran there: CI's Chrome stable (not the Chromium this
was measured on) opened one connection, `CONNECT www.gstatic.com:443`, 256 ms into the
render, a bare preconnect answered in 15 ms, before the page had been requested.

`www.gstatic.com` cannot go on the list. It is the browser's host when Chrome preconnects
to it at startup, and a page's host when the page loads a reCAPTCHA widget, a chart or a
Google-hosted script from it; a drop list cannot tell those apart, and the next Chrome
release can add another such host.

## Decision

The render's guard takes `pageFirst`: until the host and port the operator asked for has
been requested, every request is dropped - 403, `DROP_MARKER`, logged `dropped`, with the
reason "before the page asked for was requested" - and never judged, carried or counted
as a refusal. The page cannot have asked for anything before it was requested, so what
comes before it is the browser's by construction, whatever its host. From the page's own
request on, the host list (ADR-0124) is the only drop, and everything else is judged as
before.

A guard started without `pageFirst` - the unit tests, which exercise the judge's contract
with no page - judges every request, as it did.

## Rejected

- **Adding `www.gstatic.com` to the list.** Dual-use, above; and a list that grows with
  each Chrome release is red CI on each Chrome release.
- **Tolerating a tunnel that carried no bytes.** A TLS handshake to Google is still an
  unasked-for connection from this machine, and a request that later carries bytes would
  pass the same test.
- **A time window** (drop anything in the first N milliseconds). The browser's startup
  time varied from 4 to 43 s on the CI runners (ADR-0119); the page's own request is the
  only clock that does not drift.

## Consequences

- A startup preconnect, whatever host the browser chooses next year, is dropped without a
  change to the kit. A background request made after the page starts loading still needs
  the host list, and the LIVE pin names that case and the list to extend.
- A page's resources are never affected: they cannot be requested before the page is.
