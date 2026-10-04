---
url: https://developers.cloudflare.com/cloudflare-challenges/
retrieved: 2026-10-04
command: firecrawl scrape https://developers.cloudflare.com/cloudflare-challenges/ --only-main-content --max-age 0 --format markdown,rawHtml --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Challenges · Cloudflare challenges docs
---
[Skip to content](https://developers.cloudflare.com/cloudflare-challenges/#main-content)

> Documentation Index
>
> Fetch the complete documentation index at: https://developers.cloudflare.com/cloudflare-challenges/llms.txt
>
> Use this file to discover all available pages before exploring further.

# Challenges

Last updated Apr 15, 2026\|Copy as Markdown\| [View as Markdown](https://developers.cloudflare.com/cloudflare-challenges/index.md) \| [Agent setup](https://developers.cloudflare.com/agent-setup/)

Challenges are security mechanisms used by Cloudflare to verify whether a visitor to your site is a real human and not a bot or automated script.

When a Challenge is issued, Cloudflare asks the browser to perform a series of checks that help confirm the visitor's legitimacy. This process involves evaluating client-side signals (data gathered from the visitor's browser environment) or asking a visitor to take minimal action such as checking a box or selecting a button.

Challenges are designed to protect your application without introducing unnecessary friction. Most visitors will pass Challenges automatically without interaction.

Cloudflare does not use CAPTCHA puzzles or visual tests like selecting objects or typing distorted characters. All challenge types are lightweight, privacy-preserving, and optimized for real-world traffic.

* * *

## Related products

[Turnstile](https://developers.cloudflare.com/turnstile/)

Use Cloudflare's smart CAPTCHA alternative to run less intrusive Challenges.

[Bots](https://developers.cloudflare.com/bots/)

Cloudflare bot solutions identify and mitigate automated traffic to protect
your domain from bad bots.

[WAF](https://developers.cloudflare.com/waf/)

Get automatic protection from vulnerabilities and the flexibility to create
custom rules.

[DDoS Protection](https://developers.cloudflare.com/ddos-protection/)

Detect and mitigate Distributed Denial of Service (DDoS) attacks using
Cloudflare's Autonomous Edge.

Was this helpful?

YesNo

[![](https://developers.cloudflare.com/_astro/logo.te5VL_aD.svg)Docs](https://developers.cloudflare.com/)
