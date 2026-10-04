---
url: https://developers.cloudflare.com/cloudflare-challenges/challenge-types/challenge-pages/detect-response/
retrieved: 2026-10-04
command: firecrawl scrape https://developers.cloudflare.com/cloudflare-challenges/challenge-types/challenge-pages/detect-response/ --only-main-content --max-age 0 --format markdown,rawHtml --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Detect a Challenge Page response · Cloudflare challenges docs
---
[Skip to content](https://developers.cloudflare.com/cloudflare-challenges/challenge-types/challenge-pages/detect-response/#main-content)

> Documentation Index
>
> Fetch the complete documentation index at: https://developers.cloudflare.com/cloudflare-challenges/llms.txt
>
> Use this file to discover all available pages before exploring further.

# Detect a Challenge Page response

Last updated May 5, 2026\|Copy as Markdown\| [View as Markdown](https://developers.cloudflare.com/cloudflare-challenges/challenge-types/challenge-pages/detect-response/index.md) \| [Agent setup](https://developers.cloudflare.com/agent-setup/)

When a request encounters a Cloudflare Challenge Page instead of the originally anticipated response, the Challenge Page response (regardless of the Challenge Page type) will have the `cf-mitigated` header present and set to `challenge`. This header can be leveraged to detect if a response was challenged when making fetch/XHR requests. This header provides a reliable way to identify whether a response is a Challenge or not, enabling a web application to take appropriate action based on the result. For example, a front-end application encountering a response from the backend may check the presence of this header value to handle cases where Challenge Pages encountered unexpectedly.

For the `cf-mitigated` header, `challenge` is the only valid value. The header is set for all Challenge Page types.

To illustrate, here is a JavaScript code snippet that demonstrates how to use the `cf-mitigated` header to detect whether a response was challenged:

```
fetch("/my-api-endpoint").then((response) => {
	if (response.headers.get("cf-mitigated") === "challenge") {
		// Handle challenged response
	} else {
		// Process response as usual
	}
});
```

Was this helpful?

YesNo

[![](https://developers.cloudflare.com/_astro/logo.te5VL_aD.svg)Docs](https://developers.cloudflare.com/)
