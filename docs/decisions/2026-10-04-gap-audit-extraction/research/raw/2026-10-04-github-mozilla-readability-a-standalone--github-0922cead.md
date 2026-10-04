---
url: https://github.com/mozilla/readability
retrieved: 2026-10-04
command: firecrawl scrape https://github.com/mozilla/readability --only-main-content --max-age 0 --format markdown,rawHtml --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: GitHub - mozilla/readability: A standalone version of the readability lib · GitHub
---
[Skip to content](https://github.com/mozilla/readability#start-of-content)

You signed in with another tab or window. [Reload](https://github.com/mozilla/readability) to refresh your session.You signed out in another tab or window. [Reload](https://github.com/mozilla/readability) to refresh your session.You switched accounts on another tab or window. [Reload](https://github.com/mozilla/readability) to refresh your session.Dismiss alert

{{ message }}

[mozilla](https://github.com/mozilla)/ **[readability](https://github.com/mozilla/readability)** Public

- [Notifications](https://github.com/login?return_to=%2Fmozilla%2Freadability) You must be signed in to change notification settings
- [Fork\\
735](https://github.com/login?return_to=%2Fmozilla%2Freadability)
- [Star\\
11.5k](https://github.com/login?return_to=%2Fmozilla%2Freadability)


main

[**2** Branches](https://github.com/mozilla/readability/branches) [**8** Tags](https://github.com/mozilla/readability/tags)

[Go to Branches page](https://github.com/mozilla/readability/branches)[Go to Tags page](https://github.com/mozilla/readability/tags)

Go to file

Code

Open more actions menu

## Latest commit

![dependabot[bot]](https://avatars.githubusercontent.com/in/29110?v=4&size=40)![gijsk](https://avatars.githubusercontent.com/u/375983?v=4&size=40)

[dependabot\[bot\]](https://github.com/mozilla/readability/commits?author=dependabot%5Bbot%5D)

and

[gijsk](https://github.com/mozilla/readability/commits?author=gijsk)

[Bump the npm\_and\_yarn group across 1 directory with 11 updates](https://github.com/mozilla/readability/commit/ab4027a8b37669745016869a37a504727992b2ba)

Open commit detailssuccess

3 months agoJul 9, 2026

[ab4027a](https://github.com/mozilla/readability/commit/ab4027a8b37669745016869a37a504727992b2ba) · 3 months agoJul 9, 2026

## History

[540 Commits](https://github.com/mozilla/readability/commits/main/)

Open commit details

[View commit history for this file.](https://github.com/mozilla/readability/commits/main/) 540 Commits

## Folders and files

| Name | Name | Last commit message | Last commit date |
| --- | --- | --- | --- |
| [test](https://github.com/mozilla/readability/tree/main/test "test") | [test](https://github.com/mozilla/readability/tree/main/test "test") | [Improve paragraph wrapping and DOM implementation](https://github.com/mozilla/readability/commit/d7949dc47dd9ed9ee1d3b34ffdcf3bce28cde435 "Improve paragraph wrapping and DOM implementation  This change improves the logic for wrapping phrasing content in paragraphs, fixing two bugs:  1. Trailing whitespace was not always trimmed correctly from phrasing    content at the end of a container &lt;div&gt;. 2. Leading whitespace nodes could be left behind as direct children of    the <div> instead of being discarded.  The logic in Readability.js has been refactored to use a more robust \"collect and transform\" pattern. It now uses a DocumentFragment to gather all consecutive phrasing content, correctly trims leading / trailing whitespace, and then wraps the non-empty result in a <p> tag. This produces cleaner HTML, as reflected in the updated test pages.  To support this, several enhancements were made to the JSDOMParser.js DOM implementation: * Added support for DocumentFragment, including   doc.createDocumentFragment(). * Centralized DOM insertion logic (appendChild(), insertBefore(),   and replaceChild()) into a single, efficient _insertNodesAtIndex()   private helper, ensuring consistency. * Made replaceChild() more robust by simplifying its implementation   and fixing an edge case where replacing a node with itself failed. * Fixed a bug in remove() where it incorrectly modified   element-specific properties on non-element nodes.  The test suite in test-jsdomparser.js was expanded to validate these improvements, with new tests for DocumentFragment handling, node moving, and self-insertion/replacement edge cases.") | last yearSep 29, 2025 |
| [.gitattributes](https://github.com/mozilla/readability/blob/main/.gitattributes ".gitattributes") | [.gitattributes](https://github.com/mozilla/readability/blob/main/.gitattributes ".gitattributes") | [Force LF eol for windows os (](https://github.com/mozilla/readability/commit/3d8baff0b81f4a066eaf572823bfdfd1e7a482f3 "Force LF eol for windows os (#668)  Force LF eol for windows os to ensure eslint passes.  Co-authored-by: ckang <ckang@cohu.com>") [#668](https://github.com/mozilla/readability/pull/668) [)](https://github.com/mozilla/readability/commit/3d8baff0b81f4a066eaf572823bfdfd1e7a482f3 "Force LF eol for windows os (#668)  Force LF eol for windows os to ensure eslint passes.  Co-authored-by: ckang <ckang@cohu.com>") | 5 years agoFeb 2, 2021 |
| [.gitignore](https://github.com/mozilla/readability/blob/main/.gitignore ".gitignore") | [.gitignore](https://github.com/mozilla/readability/blob/main/.gitignore ".gitignore") | [Added basic functional test + travis setup.](https://github.com/mozilla/readability/commit/3bef3e7029b4b0a1c7afd4e968befc7fb219c25a "Added basic functional test + travis setup.") | 11 years agoMar 16, 2015 |
| [.npmignore](https://github.com/mozilla/readability/blob/main/.npmignore ".npmignore") | [.npmignore](https://github.com/mozilla/readability/blob/main/.npmignore ".npmignore") | [Improve contributing documentation and integrate release-it.](https://github.com/mozilla/readability/commit/ee105d9c9ab39d70d11fcbb3be017e699c615324 "Improve contributing documentation and integrate release-it.") | 6 years agoDec 23, 2020 |
| [.prettierrc.js](https://github.com/mozilla/readability/blob/main/.prettierrc.js ".prettierrc.js") | [.prettierrc.js](https://github.com/mozilla/readability/blob/main/.prettierrc.js ".prettierrc.js") | [Eslint/prettier improvements (](https://github.com/mozilla/readability/commit/70c101c25fec846754be4ea7a0643c4f8474b482 "Eslint/prettier improvements (#890)  * Fix up eslint to use flat config and pass.  * Switch to mozilla-recommended plugin, autofix a bunch of issues.  * Run prettier  * Manual lint fixes/refactoring.") [#890](https://github.com/mozilla/readability/pull/890) [)](https://github.com/mozilla/readability/commit/70c101c25fec846754be4ea7a0643c4f8474b482 "Eslint/prettier improvements (#890)  * Fix up eslint to use flat config and pass.  * Switch to mozilla-recommended plugin, autofix a bunch of issues.  * Run prettier  * Manual lint fixes/refactoring.") | 2 years agoJul 2, 2024 |
| [.release-it.json](https://github.com/mozilla/readability/blob/main/.release-it.json ".release-it.json") | [.release-it.json](https://github.com/mozilla/readability/blob/main/.release-it.json ".release-it.json") | [Ensure pushes go to main repo (](https://github.com/mozilla/readability/commit/39a5c5409fb653858b1832141895b882b9092b47 "Ensure pushes go to main repo (#829)  * Fix release-it default push repo and add unreleased header at all times.") [#829](https://github.com/mozilla/readability/pull/829) [)](https://github.com/mozilla/readability/commit/39a5c5409fb653858b1832141895b882b9092b47 "Ensure pushes go to main repo (#829)  * Fix release-it default push repo and add unreleased header at all times.") | 3 years agoDec 19, 2023 |
| [.taskcluster.yml](https://github.com/mozilla/readability/blob/main/.taskcluster.yml ".taskcluster.yml") | [.taskcluster.yml](https://github.com/mozilla/readability/blob/main/.taskcluster.yml ".taskcluster.yml") | [Run tests/linter on pushes too (](https://github.com/mozilla/readability/commit/d88c98cd665cdd2d23743525daac130257a4fbac "Run tests/linter on pushes too (#639)  * Run tests/linter on pushes too  * include a deadline too  * use correct head_rev and repository  * Reduce maxRunTime in .taskcluster.yml  Co-authored-by: Gijs <gijskruitbosch@gmail.com>") [#639](https://github.com/mozilla/readability/pull/639) [)](https://github.com/mozilla/readability/commit/d88c98cd665cdd2d23743525daac130257a4fbac "Run tests/linter on pushes too (#639)  * Run tests/linter on pushes too  * include a deadline too  * use correct head_rev and repository  * Reduce maxRunTime in .taskcluster.yml  Co-authored-by: Gijs <gijskruitbosch@gmail.com>") | 6 years agoNov 4, 2020 |
| [CHANGELOG.md](https://github.com/mozilla/readability/blob/main/CHANGELOG.md "CHANGELOG.md") | [CHANGELOG.md](https://github.com/mozilla/readability/blob/main/CHANGELOG.md "CHANGELOG.md") | [Release 0.6.0](https://github.com/mozilla/readability/commit/04fd32f72b448c12b02ba6c40928b67e510bac49 "Release 0.6.0") | last yearMar 3, 2025 |
| [CODE\_OF\_CONDUCT.md](https://github.com/mozilla/readability/blob/main/CODE_OF_CONDUCT.md "CODE_OF_CONDUCT.md") | [CODE\_OF\_CONDUCT.md](https://github.com/mozilla/readability/blob/main/CODE_OF_CONDUCT.md "CODE_OF_CONDUCT.md") | [Add Mozilla Code of Conduct file](https://github.com/mozilla/readability/commit/26379fe62ebe24a3476a6ce705c3c27c024740dd "Add Mozilla Code of Conduct file  Fixes #537.  _(Message COC002)_") | 7 years agoMar 29, 2019 |
| [CONTRIBUTING.md](https://github.com/mozilla/readability/blob/main/CONTRIBUTING.md "CONTRIBUTING.md") | [CONTRIBUTING.md](https://github.com/mozilla/readability/blob/main/CONTRIBUTING.md "CONTRIBUTING.md") | [Updated instructions for permission errors for the tidy binary](https://github.com/mozilla/readability/commit/117f22084be55d51fd9c5fbffd880bc92127d6c8 "Updated instructions for permission errors for the tidy binary  Changed the mention to also mention linux.") | last yearSep 24, 2025 |
| [JSDOMParser.js](https://github.com/mozilla/readability/blob/main/JSDOMParser.js "JSDOMParser.js") | [JSDOMParser.js](https://github.com/mozilla/readability/blob/main/JSDOMParser.js "JSDOMParser.js") | [Improve paragraph wrapping and DOM implementation](https://github.com/mozilla/readability/commit/d7949dc47dd9ed9ee1d3b34ffdcf3bce28cde435 "Improve paragraph wrapping and DOM implementation  This change improves the logic for wrapping phrasing content in paragraphs, fixing two bugs:  1. Trailing whitespace was not always trimmed correctly from phrasing    content at the end of a container &lt;div&gt;. 2. Leading whitespace nodes could be left behind as direct children of    the <div> instead of being discarded.  The logic in Readability.js has been refactored to use a more robust \"collect and transform\" pattern. It now uses a DocumentFragment to gather all consecutive phrasing content, correctly trims leading / trailing whitespace, and then wraps the non-empty result in a <p> tag. This produces cleaner HTML, as reflected in the updated test pages.  To support this, several enhancements were made to the JSDOMParser.js DOM implementation: * Added support for DocumentFragment, including   doc.createDocumentFragment(). * Centralized DOM insertion logic (appendChild(), insertBefore(),   and replaceChild()) into a single, efficient _insertNodesAtIndex()   private helper, ensuring consistency. * Made replaceChild() more robust by simplifying its implementation   and fixing an edge case where replacing a node with itself failed. * Fixed a bug in remove() where it incorrectly modified   element-specific properties on non-element nodes.  The test suite in test-jsdomparser.js was expanded to validate these improvements, with new tests for DocumentFragment handling, node moving, and self-insertion/replacement edge cases.") | last yearSep 29, 2025 |
| [LICENSE.md](https://github.com/mozilla/readability/blob/main/LICENSE.md "LICENSE.md") | [LICENSE.md](https://github.com/mozilla/readability/blob/main/LICENSE.md "LICENSE.md") | [feat: Add NOTICE file with copyright attributions](https://github.com/mozilla/readability/commit/8e4acb210ddce5cb8f28d1c3b1aa120787df9fa1 "feat: Add NOTICE file with copyright attributions") | 3 months agoJul 9, 2026 |
| [NOTICE](https://github.com/mozilla/readability/blob/main/NOTICE "NOTICE") | [NOTICE](https://github.com/mozilla/readability/blob/main/NOTICE "NOTICE") | [feat: Add NOTICE file with copyright attributions](https://github.com/mozilla/readability/commit/5e397455205644d8693848419a18947b36004229 "feat: Add NOTICE file with copyright attributions") | 3 months agoJul 9, 2026 |
| [README.md](https://github.com/mozilla/readability/blob/main/README.md "README.md") | [README.md](https://github.com/mozilla/readability/blob/main/README.md "README.md") | [Allow link density value to be modified (](https://github.com/mozilla/readability/commit/9cab50fba09e899f041097b892b0b4d9cecbcadc "Allow link density value to be modified (#874)  * Allow link density value to be modified  * Add linkDensityModifier documentation") [#874](https://github.com/mozilla/readability/pull/874) [)](https://github.com/mozilla/readability/commit/9cab50fba09e899f041097b892b0b4d9cecbcadc "Allow link density value to be modified (#874)  * Allow link density value to be modified  * Add linkDensityModifier documentation") | 2 years agoJun 14, 2024 |
| [Readability-readerable.js](https://github.com/mozilla/readability/blob/main/Readability-readerable.js "Readability-readerable.js") | [Readability-readerable.js](https://github.com/mozilla/readability/blob/main/Readability-readerable.js "Readability-readerable.js") | [Preserve MathJax tags (](https://github.com/mozilla/readability/commit/a07e62c8abfc64b06a28b48dfc76f4150796ed63 "Preserve MathJax tags (#958)  * Prevent MathJax nodes from being identified as 'unlikely candidates', and prevent <mjx-math> tags from being removed due to attribute aria-hidden=\"true\"  * Revert changes to _isProbablyVisible() and isNodeVisible()  * Update test case to include the MathJax tags which are produced once client-side rendering is complete. The previous test case only used the static HTML received from the server.  Unfortunately, after htmltidy2 processes the page it is determined to be \"unreaderable\" though the appropriate JSDOM tests run and pass. Alternatively, if htmltidy2 is skipped, JSDOMParser produces a slew of errors.  Perhaps this will do for now...  * Adding support for file:// URLs. This is useful when the test case contains dynamic content as it allows the dev to save a copy of the rendered DOM to disk and use the resulting file as input to generate-testcase. Alternatively one could use JSDOM's {runScripts: \"dangerously\", resources: \"usable\"} options, but in my case these fell short and caused MathJax to crash due to missing localStorage implementation in JSDOM. Perhaps my approach will be useful to others...  * Use url fileURLToPath to handle file urls  ---------  Co-authored-by: Gijs Kruitbosch <gijskruitbosch@gmail.com>") [#958](https://github.com/mozilla/readability/pull/958) [)](https://github.com/mozilla/readability/commit/a07e62c8abfc64b06a28b48dfc76f4150796ed63 "Preserve MathJax tags (#958)  * Prevent MathJax nodes from being identified as 'unlikely candidates', and prevent <mjx-math> tags from being removed due to attribute aria-hidden=\"true\"  * Revert changes to _isProbablyVisible() and isNodeVisible()  * Update test case to include the MathJax tags which are produced once client-side rendering is complete. The previous test case only used the static HTML received from the server.  Unfortunately, after htmltidy2 processes the page it is determined to be \"unreaderable\" though the appropriate JSDOM tests run and pass. Alternatively, if htmltidy2 is skipped, JSDOMParser produces a slew of errors.  Perhaps this will do for now...  * Adding support for file:// URLs. This is useful when the test case contains dynamic content as it allows the dev to save a copy of the rendered DOM to disk and use the resulting file as input to generate-testcase. Alternatively one could use JSDOM's {runScripts: \"dangerously\", resources: \"usable\"} options, but in my case these fell short and caused MathJax to crash due to missing localStorage implementation in JSDOM. Perhaps my approach will be useful to others...  * Use url fileURLToPath to handle file urls  ---------  Co-authored-by: Gijs Kruitbosch <gijskruitbosch@gmail.com>") | last yearMar 25, 2025 |
| [Readability.js](https://github.com/mozilla/readability/blob/main/Readability.js "Readability.js") | [Readability.js](https://github.com/mozilla/readability/blob/main/Readability.js "Readability.js") | [Improve paragraph wrapping and DOM implementation](https://github.com/mozilla/readability/commit/d7949dc47dd9ed9ee1d3b34ffdcf3bce28cde435 "Improve paragraph wrapping and DOM implementation  This change improves the logic for wrapping phrasing content in paragraphs, fixing two bugs:  1. Trailing whitespace was not always trimmed correctly from phrasing    content at the end of a container &lt;div&gt;. 2. Leading whitespace nodes could be left behind as direct children of    the <div> instead of being discarded.  The logic in Readability.js has been refactored to use a more robust \"collect and transform\" pattern. It now uses a DocumentFragment to gather all consecutive phrasing content, correctly trims leading / trailing whitespace, and then wraps the non-empty result in a <p> tag. This produces cleaner HTML, as reflected in the updated test pages.  To support this, several enhancements were made to the JSDOMParser.js DOM implementation: * Added support for DocumentFragment, including   doc.createDocumentFragment(). * Centralized DOM insertion logic (appendChild(), insertBefore(),   and replaceChild()) into a single, efficient _insertNodesAtIndex()   private helper, ensuring consistency. * Made replaceChild() more robust by simplifying its implementation   and fixing an edge case where replacing a node with itself failed. * Fixed a bug in remove() where it incorrectly modified   element-specific properties on non-element nodes.  The test suite in test-jsdomparser.js was expanded to validate these improvements, with new tests for DocumentFragment handling, node moving, and self-insertion/replacement edge cases.") | last yearSep 29, 2025 |
| [SECURITY.md](https://github.com/mozilla/readability/blob/main/SECURITY.md "SECURITY.md") | [SECURITY.md](https://github.com/mozilla/readability/blob/main/SECURITY.md "SECURITY.md") | [Create SECURITY.md (](https://github.com/mozilla/readability/commit/c3be553413498ff2c01b4b0d16149d8221f2ee26 "Create SECURITY.md (#732)  * Create SECURITY.md  Add the security policy for readability") [#732](https://github.com/mozilla/readability/pull/732) [)](https://github.com/mozilla/readability/commit/c3be553413498ff2c01b4b0d16149d8221f2ee26 "Create SECURITY.md (#732)  * Create SECURITY.md  Add the security policy for readability") | 4 years agoFeb 11, 2022 |
| [eslint.config.mjs](https://github.com/mozilla/readability/blob/main/eslint.config.mjs "eslint.config.mjs") | [eslint.config.mjs](https://github.com/mozilla/readability/blob/main/eslint.config.mjs "eslint.config.mjs") | [Eslint/prettier improvements (](https://github.com/mozilla/readability/commit/70c101c25fec846754be4ea7a0643c4f8474b482 "Eslint/prettier improvements (#890)  * Fix up eslint to use flat config and pass.  * Switch to mozilla-recommended plugin, autofix a bunch of issues.  * Run prettier  * Manual lint fixes/refactoring.") [#890](https://github.com/mozilla/readability/pull/890) [)](https://github.com/mozilla/readability/commit/70c101c25fec846754be4ea7a0643c4f8474b482 "Eslint/prettier improvements (#890)  * Fix up eslint to use flat config and pass.  * Switch to mozilla-recommended plugin, autofix a bunch of issues.  * Run prettier  * Manual lint fixes/refactoring.") | 2 years agoJul 2, 2024 |
| [index.d.ts](https://github.com/mozilla/readability/blob/main/index.d.ts "index.d.ts") | [index.d.ts](https://github.com/mozilla/readability/blob/main/index.d.ts "index.d.ts") | [Preserve generic types for ReadabilityOptions.serializer (](https://github.com/mozilla/readability/commit/a9fa21885b4b83c968e07159de6620d8d00303ff "Preserve generic types for ReadabilityOptions.serializer (#974)") [#974](https://github.com/mozilla/readability/pull/974) [)](https://github.com/mozilla/readability/commit/a9fa21885b4b83c968e07159de6620d8d00303ff "Preserve generic types for ReadabilityOptions.serializer (#974)") | last yearJul 1, 2025 |
| [index.js](https://github.com/mozilla/readability/blob/main/index.js "index.js") | [index.js](https://github.com/mozilla/readability/blob/main/index.js "index.js") | [Eslint/prettier improvements (](https://github.com/mozilla/readability/commit/70c101c25fec846754be4ea7a0643c4f8474b482 "Eslint/prettier improvements (#890)  * Fix up eslint to use flat config and pass.  * Switch to mozilla-recommended plugin, autofix a bunch of issues.  * Run prettier  * Manual lint fixes/refactoring.") [#890](https://github.com/mozilla/readability/pull/890) [)](https://github.com/mozilla/readability/commit/70c101c25fec846754be4ea7a0643c4f8474b482 "Eslint/prettier improvements (#890)  * Fix up eslint to use flat config and pass.  * Switch to mozilla-recommended plugin, autofix a bunch of issues.  * Run prettier  * Manual lint fixes/refactoring.") | 2 years agoJul 2, 2024 |
| [package-lock.json](https://github.com/mozilla/readability/blob/main/package-lock.json "package-lock.json") | [package-lock.json](https://github.com/mozilla/readability/blob/main/package-lock.json "package-lock.json") | [Bump the npm\_and\_yarn group across 1 directory with 11 updates](https://github.com/mozilla/readability/commit/ab4027a8b37669745016869a37a504727992b2ba "Bump the npm_and_yarn group across 1 directory with 11 updates  Bumps the npm_and_yarn group with 11 updates in the / directory:  | Package | From | To | | --- | --- | --- | | [@tootallnate/once](https://github.com/TooTallNate/once) | `2.0.0` | `2.0.1` | | [basic-ftp](https://github.com/patrickjuchli/basic-ftp) | `5.0.5` | `5.3.1` | | [defu](https://github.com/unjs/defu) | `6.1.4` | `6.1.7` | | [flatted](https://github.com/WebReflection/flatted) | `3.2.7` | `3.4.2` | | [form-data](https://github.com/form-data/form-data) | `4.0.4` | `4.0.6` | | [ip-address](https://github.com/beaugunderson/ip-address) | `10.0.1` | `10.2.0` | | [js-yaml](https://github.com/nodeca/js-yaml) | `4.1.1` | `4.3.0` | | [lodash](https://github.com/lodash/lodash) | `4.17.23` | `4.18.1` | | [picomatch](https://github.com/micromatch/picomatch) | `4.0.3` | `4.0.5` | | [undici](https://github.com/nodejs/undici) | `6.21.3` | `7.28.0` | | [ws](https://github.com/websockets/ws) | `8.17.1` | `8.21.0` |    Updates `@tootallnate/once` from 2.0.0 to 2.0.1 - [Release notes](https://github.com/TooTallNate/once/releases) - [Changelog](https://github.com/TooTallNate/once/blob/v2.0.1/CHANGELOG.md) - [Commits](https://github.com/TooTallNate/once/compare/2.0.0...v2.0.1)  Updates `basic-ftp` from 5.0.5 to 5.3.1 - [Release notes](https://github.com/patrickjuchli/basic-ftp/releases) - [Changelog](https://github.com/patrickjuchli/basic-ftp/blob/master/CHANGELOG.md) - [Commits](https://github.com/patrickjuchli/basic-ftp/compare/v5.0.5...v5.3.1)  Updates `defu` from 6.1.4 to 6.1.7 - [Release notes](https://github.com/unjs/defu/releases) - [Changelog](https://github.com/unjs/defu/blob/main/CHANGELOG.md) - [Commits](https://github.com/unjs/defu/compare/v6.1.4...v6.1.7)  Updates `flatted` from 3.2.7 to 3.4.2 - [Commits](https://github.com/WebReflection/flatted/compare/v3.2.7...v3.4.2)  Updates `form-data` from 4.0.4 to 4.0.6 - [Changelog](https://github.com/form-data/form-data/blob/master/CHANGELOG.md) - [Commits](https://github.com/form-data/form-data/compare/v4.0.4...v4.0.6)  Updates `ip-address` from 10.0.1 to 10.2.0 - [Commits](https://github.com/beaugunderson/ip-address/compare/v10.0.1...v10.2.0)  Updates `js-yaml` from 4.1.1 to 4.3.0 - [Changelog](https://github.com/nodeca/js-yaml/blob/master/CHANGELOG.md) - [Commits](https://github.com/nodeca/js-yaml/compare/4.1.1...4.3.0)  Updates `lodash` from 4.17.23 to 4.18.1 - [Release notes](https://github.com/lodash/lodash/releases) - [Commits](https://github.com/lodash/lodash/compare/4.17.23...4.18.1)  Updates `picomatch` from 4.0.3 to 4.0.5 - [Release notes](https://github.com/micromatch/picomatch/releases) - [Changelog](https://github.com/micromatch/picomatch/blob/master/CHANGELOG.md) - [Commits](https://github.com/micromatch/picomatch/compare/4.0.3...4.0.5)  Updates `undici` from 6.21.3 to 7.28.0 - [Release notes](https://github.com/nodejs/undici/releases) - [Commits](https://github.com/nodejs/undici/compare/v6.21.3...v7.28.0)  Updates `ws` from 8.17.1 to 8.21.0 - [Release notes](https://github.com/websockets/ws/releases) - [Commits](https://github.com/websockets/ws/compare/8.17.1...8.21.0)  --- updated-dependencies: - dependency-name: \"@tootallnate/once\"   dependency-version: 2.0.1   dependency-type: indirect   dependency-group: npm_and_yarn - dependency-name: basic-ftp   dependency-version: 5.3.1   dependency-type: indirect   dependency-group: npm_and_yarn - dependency-name: defu   dependency-version: 6.1.7   dependency-type: indirect   dependency-group: npm_and_yarn - dependency-name: flatted   dependency-version: 3.4.2   dependency-type: indirect   dependency-group: npm_and_yarn - dependency-name: form-data   dependency-version: 4.0.6   dependency-type: indirect   dependency-group: npm_and_yarn - dependency-name: ip-address   dependency-version: 10.2.0   dependency-type: indirect   dependency-group: npm_and_yarn - dependency-name: js-yaml   dependency-version: 4.3.0   dependency-type: indirect   dependency-group: npm_and_yarn - dependency-name: lodash   dependency-version: 4.18.1   dependency-type: indirect   dependency-group: npm_and_yarn - dependency-name: picomatch   dependency-version: 4.0.5   dependency-type: indirect   dependency-group: npm_and_yarn - dependency-name: undici   dependency-version: 7.28.0   dependency-type: indirect   dependency-group: npm_and_yarn - dependency-name: ws   dependency-version: 8.21.0   dependency-type: indirect   dependency-group: npm_and_yarn ...  Signed-off-by: dependabot[bot] <support@github.com>") | 3 months agoJul 9, 2026 |
| [package.json](https://github.com/mozilla/readability/blob/main/package.json "package.json") | [package.json](https://github.com/mozilla/readability/blob/main/package.json "package.json") | [Bump the npm\_and\_yarn group across 1 directory with 11 updates](https://github.com/mozilla/readability/commit/ab4027a8b37669745016869a37a504727992b2ba "Bump the npm_and_yarn group across 1 directory with 11 updates  Bumps the npm_and_yarn group with 11 updates in the / directory:  | Package | From | To | | --- | --- | --- | | [@tootallnate/once](https://github.com/TooTallNate/once) | `2.0.0` | `2.0.1` | | [basic-ftp](https://github.com/patrickjuchli/basic-ftp) | `5.0.5` | `5.3.1` | | [defu](https://github.com/unjs/defu) | `6.1.4` | `6.1.7` | | [flatted](https://github.com/WebReflection/flatted) | `3.2.7` | `3.4.2` | | [form-data](https://github.com/form-data/form-data) | `4.0.4` | `4.0.6` | | [ip-address](https://github.com/beaugunderson/ip-address) | `10.0.1` | `10.2.0` | | [js-yaml](https://github.com/nodeca/js-yaml) | `4.1.1` | `4.3.0` | | [lodash](https://github.com/lodash/lodash) | `4.17.23` | `4.18.1` | | [picomatch](https://github.com/micromatch/picomatch) | `4.0.3` | `4.0.5` | | [undici](https://github.com/nodejs/undici) | `6.21.3` | `7.28.0` | | [ws](https://github.com/websockets/ws) | `8.17.1` | `8.21.0` |    Updates `@tootallnate/once` from 2.0.0 to 2.0.1 - [Release notes](https://github.com/TooTallNate/once/releases) - [Changelog](https://github.com/TooTallNate/once/blob/v2.0.1/CHANGELOG.md) - [Commits](https://github.com/TooTallNate/once/compare/2.0.0...v2.0.1)  Updates `basic-ftp` from 5.0.5 to 5.3.1 - [Release notes](https://github.com/patrickjuchli/basic-ftp/releases) - [Changelog](https://github.com/patrickjuchli/basic-ftp/blob/master/CHANGELOG.md) - [Commits](https://github.com/patrickjuchli/basic-ftp/compare/v5.0.5...v5.3.1)  Updates `defu` from 6.1.4 to 6.1.7 - [Release notes](https://github.com/unjs/defu/releases) - [Changelog](https://github.com/unjs/defu/blob/main/CHANGELOG.md) - [Commits](https://github.com/unjs/defu/compare/v6.1.4...v6.1.7)  Updates `flatted` from 3.2.7 to 3.4.2 - [Commits](https://github.com/WebReflection/flatted/compare/v3.2.7...v3.4.2)  Updates `form-data` from 4.0.4 to 4.0.6 - [Changelog](https://github.com/form-data/form-data/blob/master/CHANGELOG.md) - [Commits](https://github.com/form-data/form-data/compare/v4.0.4...v4.0.6)  Updates `ip-address` from 10.0.1 to 10.2.0 - [Commits](https://github.com/beaugunderson/ip-address/compare/v10.0.1...v10.2.0)  Updates `js-yaml` from 4.1.1 to 4.3.0 - [Changelog](https://github.com/nodeca/js-yaml/blob/master/CHANGELOG.md) - [Commits](https://github.com/nodeca/js-yaml/compare/4.1.1...4.3.0)  Updates `lodash` from 4.17.23 to 4.18.1 - [Release notes](https://github.com/lodash/lodash/releases) - [Commits](https://github.com/lodash/lodash/compare/4.17.23...4.18.1)  Updates `picomatch` from 4.0.3 to 4.0.5 - [Release notes](https://github.com/micromatch/picomatch/releases) - [Changelog](https://github.com/micromatch/picomatch/blob/master/CHANGELOG.md) - [Commits](https://github.com/micromatch/picomatch/compare/4.0.3...4.0.5)  Updates `undici` from 6.21.3 to 7.28.0 - [Release notes](https://github.com/nodejs/undici/releases) - [Commits](https://github.com/nodejs/undici/compare/v6.21.3...v7.28.0)  Updates `ws` from 8.17.1 to 8.21.0 - [Release notes](https://github.com/websockets/ws/releases) - [Commits](https://github.com/websockets/ws/compare/8.17.1...8.21.0)  --- updated-dependencies: - dependency-name: \"@tootallnate/once\"   dependency-version: 2.0.1   dependency-type: indirect   dependency-group: npm_and_yarn - dependency-name: basic-ftp   dependency-version: 5.3.1   dependency-type: indirect   dependency-group: npm_and_yarn - dependency-name: defu   dependency-version: 6.1.7   dependency-type: indirect   dependency-group: npm_and_yarn - dependency-name: flatted   dependency-version: 3.4.2   dependency-type: indirect   dependency-group: npm_and_yarn - dependency-name: form-data   dependency-version: 4.0.6   dependency-type: indirect   dependency-group: npm_and_yarn - dependency-name: ip-address   dependency-version: 10.2.0   dependency-type: indirect   dependency-group: npm_and_yarn - dependency-name: js-yaml   dependency-version: 4.3.0   dependency-type: indirect   dependency-group: npm_and_yarn - dependency-name: lodash   dependency-version: 4.18.1   dependency-type: indirect   dependency-group: npm_and_yarn - dependency-name: picomatch   dependency-version: 4.0.5   dependency-type: indirect   dependency-group: npm_and_yarn - dependency-name: undici   dependency-version: 7.28.0   dependency-type: indirect   dependency-group: npm_and_yarn - dependency-name: ws   dependency-version: 8.21.0   dependency-type: indirect   dependency-group: npm_and_yarn ...  Signed-off-by: dependabot[bot] <support@github.com>") | 3 months agoJul 9, 2026 |
| View all files |

## Repository files navigation

# Readability.js

[Permalink: Readability.js](https://github.com/mozilla/readability#readabilityjs)

A standalone version of the readability library used for [Firefox Reader View](https://support.mozilla.org/kb/firefox-reader-view-clutter-free-web-pages).

## Installation

[Permalink: Installation](https://github.com/mozilla/readability#installation)

Readability is available on npm:

```
npm install @mozilla/readability
```

You can then `require()` it, or for web-based projects, load the `Readability.js` script from your webpage.

## Basic usage

[Permalink: Basic usage](https://github.com/mozilla/readability#basic-usage)

To parse a document, you must create a new `Readability` object from a DOM document object, and then call the [`parse()`](https://github.com/mozilla/readability#parse) method. Here's an example:

```
var article = new Readability(document).parse();
```

If you use Readability in a web browser, you will likely be able to use a `document` reference from elsewhere (e.g. fetched via XMLHttpRequest, in a same-origin `<iframe>` you have access to, etc.). In Node.js, you can [use an external DOM library](https://github.com/mozilla/readability#nodejs-usage).

## API Reference

[Permalink: API Reference](https://github.com/mozilla/readability#api-reference)

### `new Readability(document, options)`

[Permalink: new Readability(document, options)](https://github.com/mozilla/readability#new-readabilitydocument-options)

The `options` object accepts a number of properties, all optional:

- `debug` (boolean, default `false`): whether to enable logging.
- `maxElemsToParse` (number, default `0` i.e. no limit): the maximum number of elements to parse.
- `nbTopCandidates` (number, default `5`): the number of top candidates to consider when analysing how tight the competition is among candidates.
- `charThreshold` (number, default `500`): the number of characters an article must have in order to return a result.
- `classesToPreserve` (array): a set of classes to preserve on HTML elements when the `keepClasses` options is set to `false`.
- `keepClasses` (boolean, default `false`): whether to preserve all classes on HTML elements. When set to `false` only classes specified in the `classesToPreserve` array are kept.
- `disableJSONLD` (boolean, default `false`): when extracting page metadata, Readability gives precedence to Schema.org fields specified in the JSON-LD format. Set this option to `true` to skip JSON-LD parsing.
- `serializer` (function, default `el => el.innerHTML`) controls how the `content` property returned by the `parse()` method is produced from the root DOM element. It may be useful to specify the `serializer` as the identity function (`el => el`) to obtain a DOM element instead of a string for `content` if you plan to process it further.
- `allowedVideoRegex` (RegExp, default `undefined` ): a regular expression that matches video URLs that should be allowed to be included in the article content. If `undefined`, the [default regex](https://github.com/mozilla/readability/blob/8e8ec27cd2013940bc6f3cc609de10e35a1d9d86/Readability.js#L133) is applied.
- `linkDensityModifier` (number, default `0`): a number that is added to the base link density threshold during the shadiness checks. This can be used to penalize nodes with a high link density or vice versa.

### `parse()`

[Permalink: parse()](https://github.com/mozilla/readability#parse)

Returns an object containing the following properties:

- `title`: article title;
- `content`: HTML string of processed article content;
- `textContent`: text content of the article, with all the HTML tags removed;
- `length`: length of an article, in characters;
- `excerpt`: article description, or short excerpt from the content;
- `byline`: author metadata;
- `dir`: content direction;
- `siteName`: name of the site;
- `lang`: content language;
- `publishedTime`: published time;

The `parse()` method works by modifying the DOM. This removes some elements in the web page, which may be undesirable. You can avoid this by passing the clone of the `document` object to the `Readability` constructor:

```
var documentClone = document.cloneNode(true);
var article = new Readability(documentClone).parse();
```

### `isProbablyReaderable(document, options)`

[Permalink: isProbablyReaderable(document, options)](https://github.com/mozilla/readability#isprobablyreaderabledocument-options)

A quick-and-dirty way of figuring out if it's plausible that the contents of a given document are suitable for processing with Readability. It is likely to produce both false positives and false negatives. The reason it exists is to avoid bogging down a time-sensitive process (like loading and showing the user a webpage) with the complex logic in the core of Readability. Improvements to its logic (while not deteriorating its performance) are very welcome.

The `options` object accepts a number of properties, all optional:

- `minContentLength` (number, default `140`): the minimum node content length used to decide if the document is readerable;
- `minScore` (number, default `20`): the minimum cumulated 'score' used to determine if the document is readerable;
- `visibilityChecker` (function, default `isNodeVisible`): the function used to determine if a node is visible;

The function returns a boolean corresponding to whether or not we suspect `Readability.parse()` will succeed at returning an article object. Here's an example:

```
/*
    Only instantiate Readability  if we suspect
    the `parse()` method will produce a meaningful result.
*/
if (isProbablyReaderable(document)) {
    let article = new Readability(document).parse();
}
```

## Node.js usage

[Permalink: Node.js usage](https://github.com/mozilla/readability#nodejs-usage)

Since Node.js does not come with its own DOM implementation, we rely on external libraries like [jsdom](https://github.com/jsdom/jsdom). Here's an example using `jsdom` to obtain a DOM document object:

```
var { Readability } = require('@mozilla/readability');
var { JSDOM } = require('jsdom');
var doc = new JSDOM("<body>Look at this cat: <img src='./cat.jpg'></body>", {
  url: "https://www.example.com/the-page-i-got-the-source-from"
});
let reader = new Readability(doc.window.document);
let article = reader.parse();
```

Remember to pass the page's URI as the `url` option in the `JSDOM` constructor (as shown in the example above), so that Readability can convert relative URLs for images, hyperlinks, etc. to their absolute counterparts.

`jsdom` has the ability to run the scripts included in the HTML and fetch remote resources. For security reasons these are [disabled by default](https://github.com/jsdom/jsdom#executing-scripts), and we **strongly** recommend you keep them that way.

## Security

[Permalink: Security](https://github.com/mozilla/readability#security)

If you're going to use Readability with untrusted input (whether in HTML or DOM form), we **strongly** recommend you use a sanitizer library like [DOMPurify](https://github.com/cure53/DOMPurify) to avoid script injection when you use
the output of Readability. We would also recommend using [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) to add further defense-in-depth
restrictions to what you allow the resulting content to do. The Firefox integration of
reader mode uses both of these techniques itself. Sanitizing unsafe content out of the input is explicitly not something we aim to do as part of Readability itself - there are other good sanitizer libraries out there, use them!

## Contributing

[Permalink: Contributing](https://github.com/mozilla/readability#contributing)

Please see our [Contributing](https://github.com/mozilla/readability/blob/main/CONTRIBUTING.md) document.

## License

[Permalink: License](https://github.com/mozilla/readability#license)

```
Copyright (c) 2010 Arc90 Inc

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

## About

A standalone version of the readability lib

### Resources

[Readme](https://github.com/mozilla/readability#readme-ov-file)

[Apache-2.0 license](https://github.com/mozilla/readability#Apache-2.0-1-ov-file)

### Code of conduct

[Code of conduct](https://github.com/mozilla/readability#coc-ov-file)

### Contributing

[Contributing](https://github.com/mozilla/readability#contributing-ov-file)

### Security policy

[Security policy](https://github.com/mozilla/readability#security-ov-file)

[Activity](https://github.com/mozilla/readability/activity)

[Custom properties](https://github.com/mozilla/readability/custom-properties)

### Stars

**11.5k** stars

### Watchers

**103** watching

### Forks

[**735** forks](https://github.com/mozilla/readability/forks)

[Report repository](https://github.com/contact/report-content?content_url=https%3A%2F%2Fgithub.com%2Fmozilla%2Freadability&report=mozilla+%28user%29)

## Releases

## Packages

## Used by

## Contributors

## Languages

You can’t perform that action at this time.
