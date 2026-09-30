# Evidence

One row per fetched page. `Raw` points at the cached page text under `research/raw/`,
which is what makes the claim checkable - a row without raw evidence fails preflight.

The `Finding` cell arrives as an auto-extracted summary. Rewrite it into a real claim:
what the page actually establishes, with the quote or number that proves it.

| ID | Retrieved | Type | URL | Finding | Raw |
|---|---|---|---|---|---|
| E-01 | 2026-09-30 | P | https://archive.org/help/wayback_api.php | The Wayback Availability JSON API is `GET http://archive.org/wayback/available?url=<url>` with an optional `timestamp` (1-14 digits, YYYYMMDDhhmmss); it returns `archived_snapshots.closest` with `available`, `url` (the snapshot's Wayback link), `timestamp` and `status`, the closest snapshot to the timestamp or the most recent one. [quote: If the url is not available (not archived or currently not accessible), the response will be:] - and the body is then `{"archived_snapshots":{}}`. The page is dated September 2013 and warns it changes often. | research/raw/2026-09-30-wayback-machine-apis-internet-archive-archive-533d25d5.md |
| E-02 | 2026-09-30 | P | https://help.archive.org/help/save-pages-in-the-wayback-machine/ | Save Page Now is documented here as a web form and browser extensions, not as an API: a URL put into the form is saved as one page (no outlinks), some sites cannot be saved, and a saved page is public and permanent. [quote: These saved pages can be cited, shared, linked to] [quote: We do not keep your IP address, so your submission is anonymous.] | research/raw/2026-09-30-save-pages-in-the-wayback-machine-intern-archive-489bbdfc.md |
| E-03 | 2026-09-30 | P | https://help.archive.org/help/internet-archive-access-policy/ | The collections, the Wayback Machine's captures among them, are open to everyone, and use of them is governed by the Terms of Use (archive.org/about/terms.php). [quote: The Internet Archive is dedicated to providing free and open access to its collections] | research/raw/2026-09-30-internet-archive-access-policy-internet--archive-f3863631.md |
| E-04 | 2026-09-30 | P | https://archive.org/about/terms | Not the terms: fetched keyless, the Terms of Use URL returned only the site's title (93 characters), because the page is rendered in the browser. This row records that the terms could not be read this way. | research/raw/2026-09-30-internet-archive-digital-library-of-free-archive-679b3bd6.md |
| E-05 | 2026-09-30 | P | https://archive.org/about/terms | Not the terms either: rendered by the kit's headless browser, the page gave only its heading (12 characters). The terms text is outside what the kit's extractor reads, so U-04 stays a known unknown. | research/raw/2026-09-30-terms-of-use-archive-679b3bd6.md |
