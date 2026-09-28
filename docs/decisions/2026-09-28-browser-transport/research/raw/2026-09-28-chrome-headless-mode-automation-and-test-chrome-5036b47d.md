---
url: https://developer.chrome.com/docs/chromium/headless
retrieved: 2026-09-28
command: firecrawl scrape https://developer.chrome.com/docs/chromium/headless --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Chrome Headless mode  |  Automation and testing  |  Chrome for Developers
---
[Skip to main content](https://developer.chrome.com/docs/automation-and-testing/headless#main-content)

[![Chrome for Developers](https://www.gstatic.com/devrel-devsite/prod/v5be16d8c9f9402e54c2da2ff24cb75c148f5d2bc84c6f8dfc8b9e16ae456160b/chrome/images/lockup.svg)](https://developer.chrome.com/)

`/`

Language

- [English](https://developer.chrome.com/docs/automation-and-testing/headless)
- [Deutsch](https://developer.chrome.com/docs/automation-and-testing/headless?hl=de)
- [Español – América Latina](https://developer.chrome.com/docs/automation-and-testing/headless?hl=es-419)
- [Français](https://developer.chrome.com/docs/automation-and-testing/headless?hl=fr)
- [Indonesia](https://developer.chrome.com/docs/automation-and-testing/headless?hl=id)
- [Italiano](https://developer.chrome.com/docs/automation-and-testing/headless?hl=it)
- [Nederlands](https://developer.chrome.com/docs/automation-and-testing/headless?hl=nl)
- [Polski](https://developer.chrome.com/docs/automation-and-testing/headless?hl=pl)
- [Português – Brasil](https://developer.chrome.com/docs/automation-and-testing/headless?hl=pt-br)
- [Tiếng Việt](https://developer.chrome.com/docs/automation-and-testing/headless?hl=vi)
- [Türkçe](https://developer.chrome.com/docs/automation-and-testing/headless?hl=tr)
- [Русский](https://developer.chrome.com/docs/automation-and-testing/headless?hl=ru)
- [עברית](https://developer.chrome.com/docs/automation-and-testing/headless?hl=he)
- [العربيّة](https://developer.chrome.com/docs/automation-and-testing/headless?hl=ar)
- [فارسی](https://developer.chrome.com/docs/automation-and-testing/headless?hl=fa)
- [हिंदी](https://developer.chrome.com/docs/automation-and-testing/headless?hl=hi)
- [বাংলা](https://developer.chrome.com/docs/automation-and-testing/headless?hl=bn)
- [ภาษาไทย](https://developer.chrome.com/docs/automation-and-testing/headless?hl=th)
- [中文 – 简体](https://developer.chrome.com/docs/automation-and-testing/headless?hl=zh-cn)
- [中文 – 繁體](https://developer.chrome.com/docs/automation-and-testing/headless?hl=zh-tw)
- [日本語](https://developer.chrome.com/docs/automation-and-testing/headless?hl=ja)
- [한국어](https://developer.chrome.com/docs/automation-and-testing/headless?hl=ko)

[Sign in](https://developer.chrome.com/_d/signin?continue=https%3A%2F%2Fdeveloper.chrome.com%2Fdocs%2Fautomation-and-testing%2Fheadless&prompt=select_account)

- [Docs](https://developer.chrome.com/docs)
- [Automation and testing](https://developer.chrome.com/docs/automation-and-testing)

- On this page
- [Use Headless mode](https://developer.chrome.com/docs/automation-and-testing/headless#use_headless_mode)
  - [Use old Headless mode](https://developer.chrome.com/docs/automation-and-testing/headless#use_old_headless_mode)
  - [In Puppeteer](https://developer.chrome.com/docs/automation-and-testing/headless#in_puppeteer)
  - [In Selenium-WebDriver](https://developer.chrome.com/docs/automation-and-testing/headless#in_selenium-webdriver)
- [Feedback](https://developer.chrome.com/docs/automation-and-testing/headless#feedback)

- [Home](https://developer.chrome.com/)
- [Docs](https://developer.chrome.com/docs)
- [Automation and testing](https://developer.chrome.com/docs/automation-and-testing)

Was this helpful?

# Chrome Headless mode    Stay organized with collections      Save and categorize content based on your preferences.

- On this page
- [Use Headless mode](https://developer.chrome.com/docs/automation-and-testing/headless#use_headless_mode)
  - [Use old Headless mode](https://developer.chrome.com/docs/automation-and-testing/headless#use_old_headless_mode)
  - [In Puppeteer](https://developer.chrome.com/docs/automation-and-testing/headless#in_puppeteer)
  - [In Selenium-WebDriver](https://developer.chrome.com/docs/automation-and-testing/headless#in_selenium-webdriver)
- [Feedback](https://developer.chrome.com/docs/automation-and-testing/headless#feedback)

![Mathias Bynens](https://web.dev/images/authors/mathiasbynens.jpg)


Mathias Bynens


[X](https://twitter.com/mathias) [GitHub](https://github.com/mathiasbynens) [Homepage](https://mathiasbynens.be/)

![Peter Kvitek](https://web.dev/images/authors/peterkvitek.jpg)


Peter Kvitek


With Chrome Headless mode, you can run the browser in an unattended environment,
without any visible UI. Essentially, you can run Chrome without chrome.

## Use Headless mode

To use Headless mode, pass the `--headless` command-line flag to a Chrome binary, for example:

[Linux](https://developer.chrome.com/docs/automation-and-testing/headless#linux)[macOS](https://developer.chrome.com/docs/automation-and-testing/headless#macos)[Windows](https://developer.chrome.com/docs/automation-and-testing/headless#windows)More

```
google-chrome --headless
```

```
open -a "Google Chrome" --args --headless
```

```
start chrome --headless
```

### Use old Headless mode

Previously, Headless mode was
[a separate, alternate browser implementation](https://source.chromium.org/chromium/chromium/src/+/main:headless/;drc=c67febd82ae3e18ac8db1397f4ccfa87b0da2ffc)
that happened to be shipped as part of the same Chrome binary. It didn't share
any of the Chrome browser code in
[`//chrome`](https://source.chromium.org/chromium/chromium/src/+/main:chrome/).

Chrome now has unified Headless and headful modes.

![Headless mode shares code with Chrome.](https://developer.chrome.com/static/docs/automation-and-testing/headless/image/the-chrome-headless-is-7ec2038d11f0b.svg)

Since Chrome 132.0.6793.0 the old Headless mode is only available as [a\\
standalone binary named `chrome-headless-shell`](https://developer.chrome.com/blog/chrome-headless-shell) which can be downloaded from [Chrome for Testing dashboard](https://googlechromelabs.github.io/chrome-for-testing/).

### In Puppeteer

To use Headless mode in Puppeteer:

```
import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
  headless: true,  // (default) enables Chrome Headless mode
  // `headless: 'shell'` enables Headless Shell (old headless)
  // `headless: false` enables "headful" mode
});

const page = await browser.newPage();
await page.goto('https://developer.chrome.com/');

// …

await browser.close();
```

For more information on using Headless in Puppeteer, check out [Headless mode](https://pptr.dev/guides/headless-modes).

### In Selenium-WebDriver

To use Headless mode in Selenium-WebDriver:

```
const driver = await env
  .builder()
  .setChromeOptions(options.addArguments('--headless'))
  .build();

await driver.get('https://developer.chrome.com/');

// …

await driver.quit();
```

See the [Selenium team's blog post](https://www.selenium.dev/blog/2023/headless-is-going-away/#what-are-the-two-headless-modes) for more information, including examples using other language bindings.

## Feedback

We look forward to hearing your feedback about Headless mode. If you
encounter any issues, [file a bug](https://goo.gle/headless-bug).

Was this helpful?

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2024-10-21 UTC.




\[\[\["Easy to understand","easyToUnderstand","thumb-up"\],\["Solved my problem","solvedMyProblem","thumb-up"\],\["Other","otherUp","thumb-up"\]\],\[\["Missing the information I need","missingTheInformationINeed","thumb-down"\],\["Too complicated / too many steps","tooComplicatedTooManySteps","thumb-down"\],\["Out of date","outOfDate","thumb-down"\],\["Samples / code issue","samplesCodeIssue","thumb-down"\],\["Other","otherDown","thumb-down"\]\],\["Last updated 2024-10-21 UTC."\],\[\],\[\]\]
