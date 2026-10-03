---
url: https://web.hypothes.is/blog/showing-orphaned-annotations/
retrieved: 2026-10-03
command: firecrawl scrape https://web.hypothes.is/blog/showing-orphaned-annotations/ --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Showing Orphaned Annotations : Hypothesis
---
![Revisit consent button](https://web.hypothes.is/wp-content/plugins/cookie-law-info/lite/frontend/images/revisit.svg)

We value your privacy

We use cookies to enhance your browsing experience, serve personalised ads or content, and analyse our traffic. By clicking "Accept All", you consent to our use of cookies.

CustomiseReject AllAccept All

Customise Consent Preferences![](https://web.hypothes.is/wp-content/plugins/cookie-law-info/lite/frontend/images/close.svg)

We use cookies to help you navigate efficiently and perform certain functions. You will find detailed information about all cookies under each consent category below.

The cookies that are categorised as "Necessary" are stored on your browser as they are essential for enabling the basic functionalities of the site. ... Show more

NecessaryAlways Active

Necessary cookies are required to enable the basic features of this site, such as providing secure log-in or adjusting your consent preferences. These cookies do not store any personally identifiable data.

No cookies to display.

Functional

Functional cookies help perform certain functionalities like sharing the content of the website on social media platforms, collecting feedback, and other third-party features.

No cookies to display.

Analytics

Analytical cookies are used to understand how visitors interact with the website. These cookies help provide information on metrics such as the number of visitors, bounce rate, traffic source, etc.

No cookies to display.

Performance

Performance cookies are used to understand and analyse the key performance indexes of the website which helps in delivering a better user experience for the visitors.

No cookies to display.

Advertisement

Advertisement cookies are used to provide visitors with customised advertisements based on the pages you visited previously and to analyse the effectiveness of the ad campaigns.

No cookies to display.

Reject All  Save My Preferences  Accept All

[Skip to main content](https://web.hypothes.is/blog/showing-orphaned-annotations/#main)

- [Product Updates](https://web.hypothes.is/blog/category/product-updates/)
- [Technology](https://web.hypothes.is/blog/category/technology/)

# Showing Orphaned Annotations

![arti_walker](https://secure.gravatar.com/avatar/b29e8d650d04edd9ba027f0a9932347b0c1d2140f6e148267c76cd89aca267ae?s=300&d=mm&r=g)

#### By arti\_walker

1 March, 2017 · 3 min read


Reuniting annotations with their targets in real time is core to the recently standardized [web annotation model](https://hypothes.is/blog/annotation-is-now-a-web-standard/). This is fundamental to web annotation’s key benefits: that annotations lay over the web, can enable the collaborative annotation of documents like PDFs, can be searched and discovered across documents and websites, and, importantly, are under users’ control instead of publishers’.

This model has implications though. One of the most frequent questions we’re asked is:

> _“What happens to my annotation if the document changes?”_

Hypothesis already deals with minor changes to a document thanks to our [fuzzy anchoring algorithm](https://hypothes.is/blog/fuzzy-anchoring/), which can cleverly locate the original annotated selection even if it or its surrounding context has changed slightly or been moved around.

But sometimes documents change a lot.

If an annotation is anchored to a sentence in a paragraph and the whole paragraph is deleted, then even the smartest algorithm isn’t going to help—the original text is no longer present and that annotation will fail to anchor.

When annotations fail to anchor, we call them _orphans_ (a name [chosen by popular vote](https://twitter.com/edsu/status/773284353988239360)!).

[![](https://d242fdlp0qlcia.cloudfront.net/uploads/2017/01/19162026/Screen-Shot-2017-01-19-at-10.19.50-AM-300x244.png)](https://d242fdlp0qlcia.cloudfront.net/uploads/2017/01/19162026/Screen-Shot-2017-01-19-at-10.19.50-AM.png)

Before now orphans were not shown in the Hypothesis sidebar, we simply hid them from view. This had a number of consequences. First, that when you returned to the page, it would seem like annotations you had made before were gone, even though they were still discoverable from your profile. Second, a shared [direct link](https://hypothes.is/blog/direct-linking/) to an orphaned annotation would simply not show in the sidebar, even though the annotation still existed.

Back in September of last year, [we announced](https://twitter.com/hypothes_is/status/773257609067376641) the development of a new feature to address this problem.

![](https://d242fdlp0qlcia.cloudfront.net/uploads/2017/01/19214509/Screen-Shot-2017-01-19-at-3.40.30-PM.png)

With the orphans tab now released in version 1.2.0 of the Hypothesis client, if an annotation is created that no longer has an anchor, it will appear in the orphans tab. When orphans are present, this tab will be visible at the top of the sidebar, next to the Annotations and Page Notes tabs.

Most pages aren’t very dynamic, and therefore won’t have any orphans. In these cases, the orphans tab will not appear.

![Screenshot showing how to check the Hypothesis client version under the Help menu.](https://hypothes.is/wp-content/uploads/2017/03/Showing_orphaned_annotations_%E2%80%93_Hypothesis.png)You can check which version of the Hypothesis client you are using under the Help menu. If you are using the Chrome extension and your version is lower than 1.2.0, try restarting Chrome to update automatically.

This new orphans feature gives annotations another level of independence in relation to document changes. This is a core tenet of the Hypothesis mission, and one that we will look to expand upon. For instance, we have been [experimenting with and blogging about ways to archive pages when they’re annotated](https://hypothes.is/blog/fund-on-demand-web-archiving-of-annotated-pages/), so that orphans can be reunited with previous versions of a text.

### Share this article

Highlights visible

- 3

Hypothesis

![Hypothesis](https://hypothes.is/organizations/__default__/logo)Public

Sign up

/

Log in

## Annotations

3 annotations

Annotations3Page Notes

> Hypothesis already deals with minor changes to a document thanks to our fuzzy anchoring algorithm, which can cleverly locate the original annotated selection even if it or its surrounding context has changed slightly or been moved around.

More

Summary: Small changes in the document should be okay.

- [hypothes.is](https://hypothes.is/search?q=tag%3A%22hypothes.is%22 "View annotations with tag: hypothes.is")

- [notable](https://hypothes.is/search?q=tag%3A%22notable%22 "View annotations with tag: notable")

- [summary](https://hypothes.is/search?q=tag%3A%22summary%22 "View annotations with tag: summary")


> of last year

Please use calendar year in blog posts that will be searched far into the future.

> Most pages aren’t very dynamic, and therefore won’t have any orphans. In these cases, the orphans tab will not appear.

More

Question: What about to use archive.org when the page is dramatically changed?

- [question](https://hypothes.is/search?q=tag%3A%22question%22 "View annotations with tag: question")


Annotate

Highlight
