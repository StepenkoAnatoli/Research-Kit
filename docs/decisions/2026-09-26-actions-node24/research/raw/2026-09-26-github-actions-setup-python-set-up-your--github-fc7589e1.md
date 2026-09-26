---
url: https://github.com/actions/setup-python
retrieved: 2026-09-26
command: firecrawl scrape https://github.com/actions/setup-python --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: GitHub - actions/setup-python: Set up your GitHub Actions workflow with a specific version of Python · GitHub
---
[Skip to content](https://github.com/actions/setup-python#start-of-content)

You signed in with another tab or window. [Reload](https://github.com/actions/setup-python) to refresh your session.You signed out in another tab or window. [Reload](https://github.com/actions/setup-python) to refresh your session.You switched accounts on another tab or window. [Reload](https://github.com/actions/setup-python) to refresh your session.Dismiss alert

{{ message }}

[actions](https://github.com/actions)/ **[setup-python](https://github.com/actions/setup-python)** Public

- [Notifications](https://github.com/login?return_to=%2Factions%2Fsetup-python) You must be signed in to change notification settings
- [Fork\\
739](https://github.com/login?return_to=%2Factions%2Fsetup-python)
- [Star\\
2.2k](https://github.com/login?return_to=%2Factions%2Fsetup-python)


Use this GitHub action with your project

Add this Action to an existing workflow or create a new one

[View on Marketplace](https://github.com/marketplace/actions/setup-python)

main

[**22** Branches](https://github.com/actions/setup-python/branches) [**65** Tags](https://github.com/actions/setup-python/tags)

[Go to Branches page](https://github.com/actions/setup-python/branches)[Go to Tags page](https://github.com/actions/setup-python/tags)

Go to file

Code

Open more actions menu

## Latest commit

![dependabot[bot]](https://avatars.githubusercontent.com/in/29110?v=4&size=40)![v-HarithaVattikuti](https://avatars.githubusercontent.com/u/73516759?v=4&size=40)

[dependabot\[bot\]](https://github.com/actions/setup-python/commits?author=dependabot%5Bbot%5D)

and

[v-HarithaVattikuti](https://github.com/actions/setup-python/commits?author=v-HarithaVattikuti)

[Bump @vercel/ncc from 0.44.0 to 0.45.0 (](https://github.com/actions/setup-python/commit/06da6279cdbca41027908073e81a4544dc79c06b) [#1357](https://github.com/actions/setup-python/pull/1357) [)](https://github.com/actions/setup-python/commit/06da6279cdbca41027908073e81a4544dc79c06b)

Open commit detailssuccess

2 days agoSep 24, 2026

[06da627](https://github.com/actions/setup-python/commit/06da6279cdbca41027908073e81a4544dc79c06b) · 2 days agoSep 24, 2026

## History

[523 Commits](https://github.com/actions/setup-python/commits/main/)

Open commit details

[View commit history for this file.](https://github.com/actions/setup-python/commits/main/) 523 Commits

## Folders and files

| Name | Name | Last commit message | Last commit date |
| --- | --- | --- | --- |
| [.github](https://github.com/actions/setup-python/tree/main/.github ".github") | [.github](https://github.com/actions/setup-python/tree/main/.github ".github") | [feat: Add `mirror` and `mirror-token` inputs for custom Python distri…](https://github.com/actions/setup-python/commit/337b0725b8770380d7cde73cfef696f1295727eb "feat: Add `mirror` and `mirror-token` inputs for custom Python distribution sources (#1302)  * feat: Add `mirror` and `mirror-token` inputs for custom Python distribution sources  Users who need custom CPython builds (internal mirrors, GHES-hosted forks, special build configurations, compliance builds, air-gapped runners) could not previously point setup-python at anything other than actions/python-versions.  Adds two new inputs: - `mirror`: base URL hosting versions-manifest.json and the Python   distributions it references. Defaults to the existing   https://raw.githubusercontent.com/actions/python-versions/main. - `mirror-token`: optional token used to authenticate requests to the mirror.  If `mirror` is a raw.githubusercontent.com/{owner}/{repo}/{branch} URL, the manifest is fetched via the GitHub REST API (authenticated rate limit applies); otherwise the action falls back to a direct GET of {mirror}/versions-manifest.json.  Token interaction -----------------  `token` is never forwarded to arbitrary hosts. Auth resolution is per-URL:    1. if mirror-token is set, use mirror-token   2. else if token is set AND the target host is github.com,      *.github.com, or *.githubusercontent.com, use token   3. else send no auth  Cases:    Default (no inputs set)     mirror = default raw.githubusercontent.com URL, mirror-token empty,     token = github.token.     → manifest API call and tarball downloads use `token`.     Identical to prior behavior.    Custom raw.githubusercontent.com mirror (e.g. personal fork)     mirror-token empty, token = github.token.     → manifest API call and tarball downloads use `token`       (target hosts are GitHub-owned).    Custom non-GitHub mirror, no mirror-token     mirror-token empty, token = github.token.     → manifest fetched via direct URL (no auth attached),       tarball downloads use no auth.     `token` is NOT forwarded to the custom host — this is the     leak-prevention case.    Custom non-GitHub mirror with mirror-token     mirror-token set, token may be set.     → manifest fetch and tarball downloads use `mirror-token`.    Custom GitHub mirror with both tokens set     mirror-token wins. Used for both the manifest API call and     tarball downloads.  * fix: address mirror review feedback  - scope mirror-token to the mirror host and send it verbatim - route non-repo mirrors straight to the URL fetch instead of throwing - authenticate the manifest fetch - warn on slash branches, and on mirror with PyPy/GraalPy - memoize mirror validation - exercise the direct-URL path in the E2E job  Addresses https://github.com/actions/setup-python/pull/1302#issuecomment-5202618946  Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>  * fix: correct mirror warnings, auth scoping, and integration coverage  - only warn about PyPy/GraalPy mirror when a custom mirror is set; the   action.yml default made the warning fire on every run - accept the refs/heads/{branch} raw URL form so it routes via the REST   API instead of tripping the slash-branch warning - scope mirror-token to the full mirror origin (scheme+host+port) so it   can't leak to a same-host http download_url - make an invalid mirror fatal on the auth path, matching getManifestUrl - fix warning/docs that wrongly claimed the raw fallback is anonymous - force a manifest fetch in the mirror integration job (check-latest) so   it actually contacts the mirror instead of using the preinstalled cache  ---------  Co-authored-by: Claude Opus 4.8 <noreply@anthropic.com>") | 2 weeks agoSep 8, 2026 |
| [.licenses/npm](https://github.com/actions/setup-python/tree/main/.licenses/npm "This path skips through empty directories") | [.licenses/npm](https://github.com/actions/setup-python/tree/main/.licenses/npm "This path skips through empty directories") | [fix: resolve npm audit high severity vulnerabilities (](https://github.com/actions/setup-python/commit/9191ea1a55b1e7028943ee5647bf579e1182b42d "fix: resolve npm audit high severity vulnerabilities (#1350)  Bumps transitive dependencies to patched versions: - brace-expansion 5.0.8 -> 5.0.9 (GHSA-rgw5-rvv9-x895) - js-yaml 3.15.0 -> 3.15.1 (GHSA-5p4m-2wfm-xmqj) - undici 6.27.0 -> 6.28.0 (GHSA-8xcm-r25x-g524, GHSA-m8rv-5g2x-5cg5, GHSA-v3r7-h72x-cjcm)  Refreshes .licenses/ cache for the updated packages and rebuilds dist/.  Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>") [#1350](https://github.com/actions/setup-python/pull/1350) [)](https://github.com/actions/setup-python/commit/9191ea1a55b1e7028943ee5647bf579e1182b42d "fix: resolve npm audit high severity vulnerabilities (#1350)  Bumps transitive dependencies to patched versions: - brace-expansion 5.0.8 -> 5.0.9 (GHSA-rgw5-rvv9-x895) - js-yaml 3.15.0 -> 3.15.1 (GHSA-5p4m-2wfm-xmqj) - undici 6.27.0 -> 6.28.0 (GHSA-8xcm-r25x-g524, GHSA-m8rv-5g2x-5cg5, GHSA-v3r7-h72x-cjcm)  Refreshes .licenses/ cache for the updated packages and rebuilds dist/.  Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>") | last monthAug 18, 2026 |
| [\_\_tests\_\_](https://github.com/actions/setup-python/tree/main/__tests__ "__tests__") | [\_\_tests\_\_](https://github.com/actions/setup-python/tree/main/__tests__ "__tests__") | [Bump browserslist from 4.28.2 to 4.28.9 (](https://github.com/actions/setup-python/commit/ad3497abcd142e169a10aac37abd5175c44f33c4 "Bump browserslist from 4.28.2 to 4.28.9 (#1353)  * Bump browserslist from 4.28.2 to 4.28.9  Bumps [browserslist](https://github.com/browserslist/browserslist) from 4.28.2 to 4.28.9. - [Release notes](https://github.com/browserslist/browserslist/releases) - [Changelog](https://github.com/browserslist/browserslist/blob/main/CHANGELOG.md) - [Commits](https://github.com/browserslist/browserslist/compare/4.28.2...4.28.9)  --- updated-dependencies: - dependency-name: browserslist   dependency-version: 4.28.8   dependency-type: indirect ...  Signed-off-by: dependabot[bot] <support@github.com>  * chore: remove mirror-token test, bump js-yaml  ---------  Signed-off-by: dependabot[bot] <support@github.com> Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> Co-authored-by: priyagupta108 <priyagupta108@github.com>") [#1353](https://github.com/actions/setup-python/pull/1353) [)](https://github.com/actions/setup-python/commit/ad3497abcd142e169a10aac37abd5175c44f33c4 "Bump browserslist from 4.28.2 to 4.28.9 (#1353)  * Bump browserslist from 4.28.2 to 4.28.9  Bumps [browserslist](https://github.com/browserslist/browserslist) from 4.28.2 to 4.28.9. - [Release notes](https://github.com/browserslist/browserslist/releases) - [Changelog](https://github.com/browserslist/browserslist/blob/main/CHANGELOG.md) - [Commits](https://github.com/browserslist/browserslist/compare/4.28.2...4.28.9)  --- updated-dependencies: - dependency-name: browserslist   dependency-version: 4.28.8   dependency-type: indirect ...  Signed-off-by: dependabot[bot] <support@github.com>  * chore: remove mirror-token test, bump js-yaml  ---------  Signed-off-by: dependabot[bot] <support@github.com> Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> Co-authored-by: priyagupta108 <priyagupta108@github.com>") | 2 weeks agoSep 9, 2026 |
| [dist](https://github.com/actions/setup-python/tree/main/dist "dist") | [dist](https://github.com/actions/setup-python/tree/main/dist "dist") | [Bump @vercel/ncc from 0.44.0 to 0.45.0 (](https://github.com/actions/setup-python/commit/06da6279cdbca41027908073e81a4544dc79c06b "Bump @vercel/ncc from 0.44.0 to 0.45.0 (#1357)  * Bump @vercel/ncc from 0.44.0 to 0.45.0  Bumps [@vercel/ncc](https://github.com/vercel/ncc) from 0.44.0 to 0.45.0. - [Release notes](https://github.com/vercel/ncc/releases) - [Commits](https://github.com/vercel/ncc/compare/0.44.0...0.45.0)  --- updated-dependencies: - dependency-name: \"@vercel/ncc\"   dependency-version: 0.45.0   dependency-type: direct:development   update-type: version-update:semver-minor ...  Signed-off-by: dependabot[bot] <support@github.com>  * fix: update asset-relocator-loader for compatibility with webpack runtime  ---------  Signed-off-by: dependabot[bot] <support@github.com> Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> Co-authored-by: HarithaVattikuti <73516759+HarithaVattikuti@users.noreply.github.com>") [#1357](https://github.com/actions/setup-python/pull/1357) [)](https://github.com/actions/setup-python/commit/06da6279cdbca41027908073e81a4544dc79c06b "Bump @vercel/ncc from 0.44.0 to 0.45.0 (#1357)  * Bump @vercel/ncc from 0.44.0 to 0.45.0  Bumps [@vercel/ncc](https://github.com/vercel/ncc) from 0.44.0 to 0.45.0. - [Release notes](https://github.com/vercel/ncc/releases) - [Commits](https://github.com/vercel/ncc/compare/0.44.0...0.45.0)  --- updated-dependencies: - dependency-name: \"@vercel/ncc\"   dependency-version: 0.45.0   dependency-type: direct:development   update-type: version-update:semver-minor ...  Signed-off-by: dependabot[bot] <support@github.com>  * fix: update asset-relocator-loader for compatibility with webpack runtime  ---------  Signed-off-by: dependabot[bot] <support@github.com> Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> Co-authored-by: HarithaVattikuti <73516759+HarithaVattikuti@users.noreply.github.com>") | 2 days agoSep 24, 2026 |
| [docs](https://github.com/actions/setup-python/tree/main/docs "docs") | [docs](https://github.com/actions/setup-python/tree/main/docs "docs") | [feat: Add `mirror` and `mirror-token` inputs for custom Python distri…](https://github.com/actions/setup-python/commit/337b0725b8770380d7cde73cfef696f1295727eb "feat: Add `mirror` and `mirror-token` inputs for custom Python distribution sources (#1302)  * feat: Add `mirror` and `mirror-token` inputs for custom Python distribution sources  Users who need custom CPython builds (internal mirrors, GHES-hosted forks, special build configurations, compliance builds, air-gapped runners) could not previously point setup-python at anything other than actions/python-versions.  Adds two new inputs: - `mirror`: base URL hosting versions-manifest.json and the Python   distributions it references. Defaults to the existing   https://raw.githubusercontent.com/actions/python-versions/main. - `mirror-token`: optional token used to authenticate requests to the mirror.  If `mirror` is a raw.githubusercontent.com/{owner}/{repo}/{branch} URL, the manifest is fetched via the GitHub REST API (authenticated rate limit applies); otherwise the action falls back to a direct GET of {mirror}/versions-manifest.json.  Token interaction -----------------  `token` is never forwarded to arbitrary hosts. Auth resolution is per-URL:    1. if mirror-token is set, use mirror-token   2. else if token is set AND the target host is github.com,      *.github.com, or *.githubusercontent.com, use token   3. else send no auth  Cases:    Default (no inputs set)     mirror = default raw.githubusercontent.com URL, mirror-token empty,     token = github.token.     → manifest API call and tarball downloads use `token`.     Identical to prior behavior.    Custom raw.githubusercontent.com mirror (e.g. personal fork)     mirror-token empty, token = github.token.     → manifest API call and tarball downloads use `token`       (target hosts are GitHub-owned).    Custom non-GitHub mirror, no mirror-token     mirror-token empty, token = github.token.     → manifest fetched via direct URL (no auth attached),       tarball downloads use no auth.     `token` is NOT forwarded to the custom host — this is the     leak-prevention case.    Custom non-GitHub mirror with mirror-token     mirror-token set, token may be set.     → manifest fetch and tarball downloads use `mirror-token`.    Custom GitHub mirror with both tokens set     mirror-token wins. Used for both the manifest API call and     tarball downloads.  * fix: address mirror review feedback  - scope mirror-token to the mirror host and send it verbatim - route non-repo mirrors straight to the URL fetch instead of throwing - authenticate the manifest fetch - warn on slash branches, and on mirror with PyPy/GraalPy - memoize mirror validation - exercise the direct-URL path in the E2E job  Addresses https://github.com/actions/setup-python/pull/1302#issuecomment-5202618946  Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>  * fix: correct mirror warnings, auth scoping, and integration coverage  - only warn about PyPy/GraalPy mirror when a custom mirror is set; the   action.yml default made the warning fire on every run - accept the refs/heads/{branch} raw URL form so it routes via the REST   API instead of tripping the slash-branch warning - scope mirror-token to the full mirror origin (scheme+host+port) so it   can't leak to a same-host http download_url - make an invalid mirror fatal on the auth path, matching getManifestUrl - fix warning/docs that wrongly claimed the raw fallback is anonymous - force a manifest fetch in the mirror integration job (check-latest) so   it actually contacts the mirror instead of using the preinstalled cache  ---------  Co-authored-by: Claude Opus 4.8 <noreply@anthropic.com>") | 2 weeks agoSep 8, 2026 |
| [src](https://github.com/actions/setup-python/tree/main/src "src") | [src](https://github.com/actions/setup-python/tree/main/src "src") | [feat: Add `mirror` and `mirror-token` inputs for custom Python distri…](https://github.com/actions/setup-python/commit/337b0725b8770380d7cde73cfef696f1295727eb "feat: Add `mirror` and `mirror-token` inputs for custom Python distribution sources (#1302)  * feat: Add `mirror` and `mirror-token` inputs for custom Python distribution sources  Users who need custom CPython builds (internal mirrors, GHES-hosted forks, special build configurations, compliance builds, air-gapped runners) could not previously point setup-python at anything other than actions/python-versions.  Adds two new inputs: - `mirror`: base URL hosting versions-manifest.json and the Python   distributions it references. Defaults to the existing   https://raw.githubusercontent.com/actions/python-versions/main. - `mirror-token`: optional token used to authenticate requests to the mirror.  If `mirror` is a raw.githubusercontent.com/{owner}/{repo}/{branch} URL, the manifest is fetched via the GitHub REST API (authenticated rate limit applies); otherwise the action falls back to a direct GET of {mirror}/versions-manifest.json.  Token interaction -----------------  `token` is never forwarded to arbitrary hosts. Auth resolution is per-URL:    1. if mirror-token is set, use mirror-token   2. else if token is set AND the target host is github.com,      *.github.com, or *.githubusercontent.com, use token   3. else send no auth  Cases:    Default (no inputs set)     mirror = default raw.githubusercontent.com URL, mirror-token empty,     token = github.token.     → manifest API call and tarball downloads use `token`.     Identical to prior behavior.    Custom raw.githubusercontent.com mirror (e.g. personal fork)     mirror-token empty, token = github.token.     → manifest API call and tarball downloads use `token`       (target hosts are GitHub-owned).    Custom non-GitHub mirror, no mirror-token     mirror-token empty, token = github.token.     → manifest fetched via direct URL (no auth attached),       tarball downloads use no auth.     `token` is NOT forwarded to the custom host — this is the     leak-prevention case.    Custom non-GitHub mirror with mirror-token     mirror-token set, token may be set.     → manifest fetch and tarball downloads use `mirror-token`.    Custom GitHub mirror with both tokens set     mirror-token wins. Used for both the manifest API call and     tarball downloads.  * fix: address mirror review feedback  - scope mirror-token to the mirror host and send it verbatim - route non-repo mirrors straight to the URL fetch instead of throwing - authenticate the manifest fetch - warn on slash branches, and on mirror with PyPy/GraalPy - memoize mirror validation - exercise the direct-URL path in the E2E job  Addresses https://github.com/actions/setup-python/pull/1302#issuecomment-5202618946  Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>  * fix: correct mirror warnings, auth scoping, and integration coverage  - only warn about PyPy/GraalPy mirror when a custom mirror is set; the   action.yml default made the warning fire on every run - accept the refs/heads/{branch} raw URL form so it routes via the REST   API instead of tripping the slash-branch warning - scope mirror-token to the full mirror origin (scheme+host+port) so it   can't leak to a same-host http download_url - make an invalid mirror fatal on the auth path, matching getManifestUrl - fix warning/docs that wrongly claimed the raw fallback is anonymous - force a manifest fetch in the mirror integration job (check-latest) so   it actually contacts the mirror instead of using the preinstalled cache  ---------  Co-authored-by: Claude Opus 4.8 <noreply@anthropic.com>") | 2 weeks agoSep 8, 2026 |
| [.gitattributes](https://github.com/actions/setup-python/blob/main/.gitattributes ".gitattributes") | [.gitattributes](https://github.com/actions/setup-python/blob/main/.gitattributes ".gitattributes") | [Add](https://github.com/actions/setup-python/commit/b9436a7e860cfa949cd34fe15789378a9b2804ae "Add `Licensed` To Help Verify Prod Licenses (#128)  * Add Licensed Workflow and config  * manual validation of dependencies  * Ignore Generated Files in Git PR's  * update contributing.md")`Licensed` [To Help Verify Prod Licenses (](https://github.com/actions/setup-python/commit/b9436a7e860cfa949cd34fe15789378a9b2804ae "Add `Licensed` To Help Verify Prod Licenses (#128)  * Add Licensed Workflow and config  * manual validation of dependencies  * Ignore Generated Files in Git PR's  * update contributing.md") [#128](https://github.com/actions/setup-python/pull/128) [)](https://github.com/actions/setup-python/commit/b9436a7e860cfa949cd34fe15789378a9b2804ae "Add `Licensed` To Help Verify Prod Licenses (#128)  * Add Licensed Workflow and config  * manual validation of dependencies  * Ignore Generated Files in Git PR's  * update contributing.md") | 6 years agoSep 23, 2020 |
| [.gitignore](https://github.com/actions/setup-python/blob/main/.gitignore ".gitignore") | [.gitignore](https://github.com/actions/setup-python/blob/main/.gitignore ".gitignore") | [Cleanup](https://github.com/actions/setup-python/commit/3d91cc267489348021c1d8fe14116530d68d3f79 "Cleanup") | 7 years agoNov 5, 2019 |
| [.licensed.yml](https://github.com/actions/setup-python/blob/main/.licensed.yml ".licensed.yml") | [.licensed.yml](https://github.com/actions/setup-python/blob/main/.licensed.yml ".licensed.yml") | [Migrate to ESM and upgrade dependencies (](https://github.com/actions/setup-python/commit/f8cf4291c8b8e273ddd26e569454615c7315d932 "Migrate to ESM and upgrade dependencies (#1330)  * Migrate to ESM and upgrade dependencies  * Add ESM migration note to README for V7  * Remove unnecessary devDependencies: ts-node, @types/jest  * npm audit fix  * Upgrade @types/node to version 26.0.0  * Clarify ESM migration details in README for V7  * Update README and dependencies  * Fix lint issue") [#1330](https://github.com/actions/setup-python/pull/1330) [)](https://github.com/actions/setup-python/commit/f8cf4291c8b8e273ddd26e569454615c7315d932 "Migrate to ESM and upgrade dependencies (#1330)  * Migrate to ESM and upgrade dependencies  * Add ESM migration note to README for V7  * Remove unnecessary devDependencies: ts-node, @types/jest  * npm audit fix  * Upgrade @types/node to version 26.0.0  * Clarify ESM migration details in README for V7  * Update README and dependencies  * Fix lint issue") | 2 months agoJul 15, 2026 |
| [.prettierignore](https://github.com/actions/setup-python/blob/main/.prettierignore ".prettierignore") | [.prettierignore](https://github.com/actions/setup-python/blob/main/.prettierignore ".prettierignore") | [Add and configure ESLint and update configuration for Prettier (](https://github.com/actions/setup-python/commit/ec365b4eba6e8fff05c772c50ea738054d9b52ef "Add and configure ESLint and update configuration for Prettier (#617)  * Add ESLint, update Prettier  * Update docs  * Update tests  * Update licenses  * Fix review points") [#617](https://github.com/actions/setup-python/pull/617) [)](https://github.com/actions/setup-python/commit/ec365b4eba6e8fff05c772c50ea738054d9b52ef "Add and configure ESLint and update configuration for Prettier (#617)  * Add ESLint, update Prettier  * Update docs  * Update tests  * Update licenses  * Fix review points") | 3 years agoMar 9, 2023 |
| [.prettierrc.json](https://github.com/actions/setup-python/blob/main/.prettierrc.json ".prettierrc.json") | [.prettierrc.json](https://github.com/actions/setup-python/blob/main/.prettierrc.json ".prettierrc.json") | [Migrate to ESM and upgrade dependencies (](https://github.com/actions/setup-python/commit/f8cf4291c8b8e273ddd26e569454615c7315d932 "Migrate to ESM and upgrade dependencies (#1330)  * Migrate to ESM and upgrade dependencies  * Add ESM migration note to README for V7  * Remove unnecessary devDependencies: ts-node, @types/jest  * npm audit fix  * Upgrade @types/node to version 26.0.0  * Clarify ESM migration details in README for V7  * Update README and dependencies  * Fix lint issue") [#1330](https://github.com/actions/setup-python/pull/1330) [)](https://github.com/actions/setup-python/commit/f8cf4291c8b8e273ddd26e569454615c7315d932 "Migrate to ESM and upgrade dependencies (#1330)  * Migrate to ESM and upgrade dependencies  * Add ESM migration note to README for V7  * Remove unnecessary devDependencies: ts-node, @types/jest  * npm audit fix  * Upgrade @types/node to version 26.0.0  * Clarify ESM migration details in README for V7  * Update README and dependencies  * Fix lint issue") | 2 months agoJul 15, 2026 |
| [CODE\_OF\_CONDUCT.md](https://github.com/actions/setup-python/blob/main/CODE_OF_CONDUCT.md "CODE_OF_CONDUCT.md") | [CODE\_OF\_CONDUCT.md](https://github.com/actions/setup-python/blob/main/CODE_OF_CONDUCT.md "CODE_OF_CONDUCT.md") | [Add CODE\_OF\_CONDUCT](https://github.com/actions/setup-python/commit/4176166af9c0d1a5c7f4af4b6e8fdf10b671c986 "Add CODE_OF_CONDUCT") | 4 years agoApr 18, 2022 |
| [LICENSE](https://github.com/actions/setup-python/blob/main/LICENSE "LICENSE") | [LICENSE](https://github.com/actions/setup-python/blob/main/LICENSE "LICENSE") | [Consume toolkit from npmjs (](https://github.com/actions/setup-python/commit/24b4fa76d2ebe67bab7963e3b18ab1bac1f7ebcc "Consume toolkit from npmjs (#12)") [#12](https://github.com/actions/setup-python/pull/12) [)](https://github.com/actions/setup-python/commit/24b4fa76d2ebe67bab7963e3b18ab1bac1f7ebcc "Consume toolkit from npmjs (#12)") | 7 years agoAug 20, 2019 |
| [README.md](https://github.com/actions/setup-python/blob/main/README.md "README.md") | [README.md](https://github.com/actions/setup-python/blob/main/README.md "README.md") | [Pin SHA commits and update docs with latest versions (](https://github.com/actions/setup-python/commit/5fda3b95a4ea91299a34e894583c3862153e4b97 "Pin SHA commits and update docs with latest versions (#1338)  * Update GitHub Actions to use checkout and setup-python actions version 7  * Fix formatting in publish-immutable-actions.yml") [#1338](https://github.com/actions/setup-python/pull/1338) [)](https://github.com/actions/setup-python/commit/5fda3b95a4ea91299a34e894583c3862153e4b97 "Pin SHA commits and update docs with latest versions (#1338)  * Update GitHub Actions to use checkout and setup-python actions version 7  * Fix formatting in publish-immutable-actions.yml") | 2 months agoJul 20, 2026 |
| [action.yml](https://github.com/actions/setup-python/blob/main/action.yml "action.yml") | [action.yml](https://github.com/actions/setup-python/blob/main/action.yml "action.yml") | [feat: Add `mirror` and `mirror-token` inputs for custom Python distri…](https://github.com/actions/setup-python/commit/337b0725b8770380d7cde73cfef696f1295727eb "feat: Add `mirror` and `mirror-token` inputs for custom Python distribution sources (#1302)  * feat: Add `mirror` and `mirror-token` inputs for custom Python distribution sources  Users who need custom CPython builds (internal mirrors, GHES-hosted forks, special build configurations, compliance builds, air-gapped runners) could not previously point setup-python at anything other than actions/python-versions.  Adds two new inputs: - `mirror`: base URL hosting versions-manifest.json and the Python   distributions it references. Defaults to the existing   https://raw.githubusercontent.com/actions/python-versions/main. - `mirror-token`: optional token used to authenticate requests to the mirror.  If `mirror` is a raw.githubusercontent.com/{owner}/{repo}/{branch} URL, the manifest is fetched via the GitHub REST API (authenticated rate limit applies); otherwise the action falls back to a direct GET of {mirror}/versions-manifest.json.  Token interaction -----------------  `token` is never forwarded to arbitrary hosts. Auth resolution is per-URL:    1. if mirror-token is set, use mirror-token   2. else if token is set AND the target host is github.com,      *.github.com, or *.githubusercontent.com, use token   3. else send no auth  Cases:    Default (no inputs set)     mirror = default raw.githubusercontent.com URL, mirror-token empty,     token = github.token.     → manifest API call and tarball downloads use `token`.     Identical to prior behavior.    Custom raw.githubusercontent.com mirror (e.g. personal fork)     mirror-token empty, token = github.token.     → manifest API call and tarball downloads use `token`       (target hosts are GitHub-owned).    Custom non-GitHub mirror, no mirror-token     mirror-token empty, token = github.token.     → manifest fetched via direct URL (no auth attached),       tarball downloads use no auth.     `token` is NOT forwarded to the custom host — this is the     leak-prevention case.    Custom non-GitHub mirror with mirror-token     mirror-token set, token may be set.     → manifest fetch and tarball downloads use `mirror-token`.    Custom GitHub mirror with both tokens set     mirror-token wins. Used for both the manifest API call and     tarball downloads.  * fix: address mirror review feedback  - scope mirror-token to the mirror host and send it verbatim - route non-repo mirrors straight to the URL fetch instead of throwing - authenticate the manifest fetch - warn on slash branches, and on mirror with PyPy/GraalPy - memoize mirror validation - exercise the direct-URL path in the E2E job  Addresses https://github.com/actions/setup-python/pull/1302#issuecomment-5202618946  Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>  * fix: correct mirror warnings, auth scoping, and integration coverage  - only warn about PyPy/GraalPy mirror when a custom mirror is set; the   action.yml default made the warning fire on every run - accept the refs/heads/{branch} raw URL form so it routes via the REST   API instead of tripping the slash-branch warning - scope mirror-token to the full mirror origin (scheme+host+port) so it   can't leak to a same-host http download_url - make an invalid mirror fatal on the auth path, matching getManifestUrl - fix warning/docs that wrongly claimed the raw fallback is anonymous - force a manifest fetch in the mirror integration job (check-latest) so   it actually contacts the mirror instead of using the preinstalled cache  ---------  Co-authored-by: Claude Opus 4.8 <noreply@anthropic.com>") | 2 weeks agoSep 8, 2026 |
| [eslint.config.mjs](https://github.com/actions/setup-python/blob/main/eslint.config.mjs "eslint.config.mjs") | [eslint.config.mjs](https://github.com/actions/setup-python/blob/main/eslint.config.mjs "eslint.config.mjs") | [Migrate to ESM and upgrade dependencies (](https://github.com/actions/setup-python/commit/f8cf4291c8b8e273ddd26e569454615c7315d932 "Migrate to ESM and upgrade dependencies (#1330)  * Migrate to ESM and upgrade dependencies  * Add ESM migration note to README for V7  * Remove unnecessary devDependencies: ts-node, @types/jest  * npm audit fix  * Upgrade @types/node to version 26.0.0  * Clarify ESM migration details in README for V7  * Update README and dependencies  * Fix lint issue") [#1330](https://github.com/actions/setup-python/pull/1330) [)](https://github.com/actions/setup-python/commit/f8cf4291c8b8e273ddd26e569454615c7315d932 "Migrate to ESM and upgrade dependencies (#1330)  * Migrate to ESM and upgrade dependencies  * Add ESM migration note to README for V7  * Remove unnecessary devDependencies: ts-node, @types/jest  * npm audit fix  * Upgrade @types/node to version 26.0.0  * Clarify ESM migration details in README for V7  * Update README and dependencies  * Fix lint issue") | 2 months agoJul 15, 2026 |
| [jest.config.ts](https://github.com/actions/setup-python/blob/main/jest.config.ts "jest.config.ts") | [jest.config.ts](https://github.com/actions/setup-python/blob/main/jest.config.ts "jest.config.ts") | [Migrate to ESM and upgrade dependencies (](https://github.com/actions/setup-python/commit/f8cf4291c8b8e273ddd26e569454615c7315d932 "Migrate to ESM and upgrade dependencies (#1330)  * Migrate to ESM and upgrade dependencies  * Add ESM migration note to README for V7  * Remove unnecessary devDependencies: ts-node, @types/jest  * npm audit fix  * Upgrade @types/node to version 26.0.0  * Clarify ESM migration details in README for V7  * Update README and dependencies  * Fix lint issue") [#1330](https://github.com/actions/setup-python/pull/1330) [)](https://github.com/actions/setup-python/commit/f8cf4291c8b8e273ddd26e569454615c7315d932 "Migrate to ESM and upgrade dependencies (#1330)  * Migrate to ESM and upgrade dependencies  * Add ESM migration note to README for V7  * Remove unnecessary devDependencies: ts-node, @types/jest  * npm audit fix  * Upgrade @types/node to version 26.0.0  * Clarify ESM migration details in README for V7  * Update README and dependencies  * Fix lint issue") | 2 months agoJul 15, 2026 |
| [package-lock.json](https://github.com/actions/setup-python/blob/main/package-lock.json "package-lock.json") | [package-lock.json](https://github.com/actions/setup-python/blob/main/package-lock.json "package-lock.json") | [Bump @vercel/ncc from 0.44.0 to 0.45.0 (](https://github.com/actions/setup-python/commit/06da6279cdbca41027908073e81a4544dc79c06b "Bump @vercel/ncc from 0.44.0 to 0.45.0 (#1357)  * Bump @vercel/ncc from 0.44.0 to 0.45.0  Bumps [@vercel/ncc](https://github.com/vercel/ncc) from 0.44.0 to 0.45.0. - [Release notes](https://github.com/vercel/ncc/releases) - [Commits](https://github.com/vercel/ncc/compare/0.44.0...0.45.0)  --- updated-dependencies: - dependency-name: \"@vercel/ncc\"   dependency-version: 0.45.0   dependency-type: direct:development   update-type: version-update:semver-minor ...  Signed-off-by: dependabot[bot] <support@github.com>  * fix: update asset-relocator-loader for compatibility with webpack runtime  ---------  Signed-off-by: dependabot[bot] <support@github.com> Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> Co-authored-by: HarithaVattikuti <73516759+HarithaVattikuti@users.noreply.github.com>") [#1357](https://github.com/actions/setup-python/pull/1357) [)](https://github.com/actions/setup-python/commit/06da6279cdbca41027908073e81a4544dc79c06b "Bump @vercel/ncc from 0.44.0 to 0.45.0 (#1357)  * Bump @vercel/ncc from 0.44.0 to 0.45.0  Bumps [@vercel/ncc](https://github.com/vercel/ncc) from 0.44.0 to 0.45.0. - [Release notes](https://github.com/vercel/ncc/releases) - [Commits](https://github.com/vercel/ncc/compare/0.44.0...0.45.0)  --- updated-dependencies: - dependency-name: \"@vercel/ncc\"   dependency-version: 0.45.0   dependency-type: direct:development   update-type: version-update:semver-minor ...  Signed-off-by: dependabot[bot] <support@github.com>  * fix: update asset-relocator-loader for compatibility with webpack runtime  ---------  Signed-off-by: dependabot[bot] <support@github.com> Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> Co-authored-by: HarithaVattikuti <73516759+HarithaVattikuti@users.noreply.github.com>") | 2 days agoSep 24, 2026 |
| [package.json](https://github.com/actions/setup-python/blob/main/package.json "package.json") | [package.json](https://github.com/actions/setup-python/blob/main/package.json "package.json") | [Bump @vercel/ncc from 0.44.0 to 0.45.0 (](https://github.com/actions/setup-python/commit/06da6279cdbca41027908073e81a4544dc79c06b "Bump @vercel/ncc from 0.44.0 to 0.45.0 (#1357)  * Bump @vercel/ncc from 0.44.0 to 0.45.0  Bumps [@vercel/ncc](https://github.com/vercel/ncc) from 0.44.0 to 0.45.0. - [Release notes](https://github.com/vercel/ncc/releases) - [Commits](https://github.com/vercel/ncc/compare/0.44.0...0.45.0)  --- updated-dependencies: - dependency-name: \"@vercel/ncc\"   dependency-version: 0.45.0   dependency-type: direct:development   update-type: version-update:semver-minor ...  Signed-off-by: dependabot[bot] <support@github.com>  * fix: update asset-relocator-loader for compatibility with webpack runtime  ---------  Signed-off-by: dependabot[bot] <support@github.com> Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> Co-authored-by: HarithaVattikuti <73516759+HarithaVattikuti@users.noreply.github.com>") [#1357](https://github.com/actions/setup-python/pull/1357) [)](https://github.com/actions/setup-python/commit/06da6279cdbca41027908073e81a4544dc79c06b "Bump @vercel/ncc from 0.44.0 to 0.45.0 (#1357)  * Bump @vercel/ncc from 0.44.0 to 0.45.0  Bumps [@vercel/ncc](https://github.com/vercel/ncc) from 0.44.0 to 0.45.0. - [Release notes](https://github.com/vercel/ncc/releases) - [Commits](https://github.com/vercel/ncc/compare/0.44.0...0.45.0)  --- updated-dependencies: - dependency-name: \"@vercel/ncc\"   dependency-version: 0.45.0   dependency-type: direct:development   update-type: version-update:semver-minor ...  Signed-off-by: dependabot[bot] <support@github.com>  * fix: update asset-relocator-loader for compatibility with webpack runtime  ---------  Signed-off-by: dependabot[bot] <support@github.com> Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> Co-authored-by: HarithaVattikuti <73516759+HarithaVattikuti@users.noreply.github.com>") | 2 days agoSep 24, 2026 |
| [tsconfig.json](https://github.com/actions/setup-python/blob/main/tsconfig.json "tsconfig.json") | [tsconfig.json](https://github.com/actions/setup-python/blob/main/tsconfig.json "tsconfig.json") | [Migrate to ESM and upgrade dependencies (](https://github.com/actions/setup-python/commit/f8cf4291c8b8e273ddd26e569454615c7315d932 "Migrate to ESM and upgrade dependencies (#1330)  * Migrate to ESM and upgrade dependencies  * Add ESM migration note to README for V7  * Remove unnecessary devDependencies: ts-node, @types/jest  * npm audit fix  * Upgrade @types/node to version 26.0.0  * Clarify ESM migration details in README for V7  * Update README and dependencies  * Fix lint issue") [#1330](https://github.com/actions/setup-python/pull/1330) [)](https://github.com/actions/setup-python/commit/f8cf4291c8b8e273ddd26e569454615c7315d932 "Migrate to ESM and upgrade dependencies (#1330)  * Migrate to ESM and upgrade dependencies  * Add ESM migration note to README for V7  * Remove unnecessary devDependencies: ts-node, @types/jest  * npm audit fix  * Upgrade @types/node to version 26.0.0  * Clarify ESM migration details in README for V7  * Update README and dependencies  * Fix lint issue") | 2 months agoJul 15, 2026 |
| View all files |

## Repository files navigation

# setup-python

[Permalink: setup-python](https://github.com/actions/setup-python#setup-python)

[![Basic validation](https://github.com/actions/setup-python/actions/workflows/basic-validation.yml/badge.svg?branch=main)](https://github.com/actions/setup-python/actions/workflows/basic-validation.yml)[![Validate Python e2e](https://github.com/actions/setup-python/actions/workflows/test-python.yml/badge.svg?branch=main)](https://github.com/actions/setup-python/actions/workflows/test-python.yml)[![Validate PyPy e2e](https://github.com/actions/setup-python/actions/workflows/test-pypy.yml/badge.svg?branch=main)](https://github.com/actions/setup-python/actions/workflows/test-pypy.yml)[![e2e-cache](https://github.com/actions/setup-python/actions/workflows/e2e-cache.yml/badge.svg?branch=main)](https://github.com/actions/setup-python/actions/workflows/e2e-cache.yml)

This action provides the following functionality for GitHub Actions users:

- Installing a version of Python or PyPy and (by default) adding it to the PATH
- Optionally caching dependencies for pip, pipenv and poetry
- Registering problem matchers for error output

## What's new in V7

[Permalink: What's new in V7](https://github.com/actions/setup-python#whats-new-in-v7)

- Migrated action internals to ESM for compatibility with latest `@actions/*` packages. No changes to action inputs, outputs, or behavior.

## Breaking changes in V6

[Permalink: Breaking changes in V6](https://github.com/actions/setup-python#breaking-changes-in-v6)

- Upgraded action from node20 to node24


> Make sure your runner is on version v2.327.1 or later to ensure compatibility with this release. See [Release Notes](https://github.com/actions/runner/releases/tag/v2.327.1)


For more details, see the full release notes on the [releases page](https://github.com/actions/setup-python/releases/tag/v6.0.0)

## Basic usage

[Permalink: Basic usage](https://github.com/actions/setup-python#basic-usage)

See [action.yml](https://github.com/actions/setup-python/blob/main/action.yml)

**Python**

```
steps:
- uses: actions/checkout@v7
- uses: actions/setup-python@v7
  with:
    python-version: '3.13'
- run: python my_script.py
```

**PyPy**

```
steps:
- uses: actions/checkout@v7
- uses: actions/setup-python@v7
  with:
    python-version: 'pypy3.10'
- run: python my_script.py
```

**GraalPy**

```
steps:
- uses: actions/checkout@v7
- uses: actions/setup-python@v7
  with:
    python-version: 'graalpy-24.0'
- run: python my_script.py
```

**Free threaded Python**

```
steps:
- uses: actions/checkout@v7
- uses: actions/setup-python@v7
  with:
    python-version: '3.13t'
- run: python my_script.py
```

The `python-version` input is optional. If not supplied, the action will try to resolve the version from the default `.python-version` file. If the `.python-version` file doesn't exist Python or PyPy version from the PATH will be used. The default version of Python or PyPy in PATH varies between runners and can be changed unexpectedly so we recommend always setting Python version explicitly using the `python-version` or `python-version-file` inputs.

The action will first check the local [tool cache](https://github.com/actions/setup-python/blob/main/docs/advanced-usage.md#hosted-tool-cache) for a [semver](https://github.com/npm/node-semver#versions) match. If unable to find a specific version in the tool cache, the action will attempt to download a version of Python from [GitHub Releases](https://github.com/actions/python-versions/releases) and for PyPy from the official [PyPy's dist](https://downloads.python.org/pypy/).

For information regarding locally cached versions of Python or PyPy on GitHub hosted runners, check out [GitHub Actions Runner Images](https://github.com/actions/runner-images).

## Supported version syntax

[Permalink: Supported version syntax](https://github.com/actions/setup-python#supported-version-syntax)

The `python-version` input supports the [Semantic Versioning Specification](https://semver.org/) and some special version notations (e.g. `semver ranges`, `x.y-dev syntax`, etc.), for detailed examples please refer to the section: [Using python-version input](https://github.com/actions/setup-python/blob/main/docs/advanced-usage.md#using-the-python-version-input) of the [Advanced usage](https://github.com/actions/setup-python/blob/main/docs/advanced-usage.md) guide.

## Supported architectures

[Permalink: Supported architectures](https://github.com/actions/setup-python#supported-architectures)

Using the `architecture` input, it is possible to specify the required Python or PyPy interpreter architecture: `x86`, `x64`, or `arm64`. If the input is not specified, the architecture defaults to the host OS architecture.

## Caching packages dependencies

[Permalink: Caching packages dependencies](https://github.com/actions/setup-python#caching-packages-dependencies)

The action has built-in functionality for caching and restoring dependencies. It uses [toolkit/cache](https://github.com/actions/toolkit/tree/main/packages/cache) under the hood for caching dependencies but requires less configuration settings. Supported package managers are `pip`, `pipenv` and `poetry`. The `cache` input is optional, and caching is turned off by default.

The action defaults to searching for a dependency file (`requirements.txt` or `pyproject.toml` for pip, `Pipfile.lock` for pipenv or `poetry.lock` for poetry) in the repository, and uses its hash as a part of the cache key. Input `cache-dependency-path` is used for cases when multiple dependency files are used, they are located in different subdirectories or different files for the hash that want to be used.

- For `pip`, the action will cache the global cache directory
- For `pipenv`, the action will cache virtualenv directory
- For `poetry`, the action will cache virtualenv directories -- one for each poetry project found

**Caching pip dependencies:**

```
steps:
- uses: actions/checkout@v7
- uses: actions/setup-python@v7
  with:
    python-version: '3.13'
    cache: 'pip' # caching pip dependencies
- run: pip install -r requirements.txt
```

> **Note:** Restored cache will not be used if the requirements.txt file is not updated for a long time and a newer version of the dependency is available which can lead to an increase in total build time.

> The requirements file format allows for specifying dependency versions using logical operators (for example chardet>=3.0.4) or specifying dependencies without any versions. In this case the pip install -r requirements.txt command will always try to install the latest available package version. To be sure that the cache will be used, please stick to a specific dependency version and update it manually if necessary.

> The `setup-python` action does not handle authentication for pip when installing packages from private repositories. For help, refer [pip’s VCS support documentation](https://pip.pypa.io/en/stable/topics/vcs-support/) or visit the [pip repository](https://github.com/pypa/pip).

See examples of using `cache` and `cache-dependency-path` for `pipenv` and `poetry` in the section: [Caching packages](https://github.com/actions/setup-python/blob/main/docs/advanced-usage.md#caching-packages) of the [Advanced usage](https://github.com/actions/setup-python/blob/main/docs/advanced-usage.md) guide.

## Advanced usage

[Permalink: Advanced usage](https://github.com/actions/setup-python#advanced-usage)

- [Using the python-version input](https://github.com/actions/setup-python/blob/main/docs/advanced-usage.md#using-the-python-version-input)
- [Using the python-version-file input](https://github.com/actions/setup-python/blob/main/docs/advanced-usage.md#using-the-python-version-file-input)
- [Check latest version](https://github.com/actions/setup-python/blob/main/docs/advanced-usage.md#check-latest-version)
- [Caching packages](https://github.com/actions/setup-python/blob/main/docs/advanced-usage.md#caching-packages)
- [Outputs and environment variables](https://github.com/actions/setup-python/blob/main/docs/advanced-usage.md#outputs-and-environment-variables)
- [Available versions of Python, PyPy and GraalPy](https://github.com/actions/setup-python/blob/main/docs/advanced-usage.md#available-versions-of-python-pypy-and-graalpy)
- [Hosted tool cache](https://github.com/actions/setup-python/blob/main/docs/advanced-usage.md#hosted-tool-cache)
- [Using `setup-python` with a self-hosted runner](https://github.com/actions/setup-python/blob/main/docs/advanced-usage.md#using-setup-python-with-a-self-hosted-runner)
- [Using `setup-python` on GHES](https://github.com/actions/setup-python/blob/main/docs/advanced-usage.md#using-setup-python-on-ghes)
- [Allow pre-releases](https://github.com/actions/setup-python/blob/main/docs/advanced-usage.md#allow-pre-releases)
- [Using the pip-version input](https://github.com/actions/setup-python/blob/main/docs/advanced-usage.md#using-the-pip-version-input)

## Recommended permissions

[Permalink: Recommended permissions](https://github.com/actions/setup-python#recommended-permissions)

When using the `setup-python` action in your GitHub Actions workflow, it is recommended to set the following permissions to ensure proper functionality:

```
permissions:
  contents: read # access to check out code and install dependencies
```

## License

[Permalink: License](https://github.com/actions/setup-python#license)

The scripts and documentation in this project are released under the [MIT License](https://github.com/actions/setup-python/blob/main/LICENSE).

## Contributions

[Permalink: Contributions](https://github.com/actions/setup-python#contributions)

Contributions are welcome! See our [Contributor's Guide](https://github.com/actions/setup-python/blob/main/docs/contributors.md).

## About

Set up your GitHub Actions workflow with a specific version of Python

### Resources

[Readme](https://github.com/actions/setup-python#readme-ov-file)

[MIT license](https://github.com/actions/setup-python#MIT-1-ov-file)

### Code of conduct

[Code of conduct](https://github.com/actions/setup-python#coc-ov-file)

### Security policy

[Security policy](https://github.com/actions/setup-python#security-ov-file)

[Activity](https://github.com/actions/setup-python/activity)

[Custom properties](https://github.com/actions/setup-python/custom-properties)

### Stars

**2.2k** stars

### Watchers

**47** watching

### Forks

[**739** forks](https://github.com/actions/setup-python/forks)

[Report repository](https://github.com/contact/report-content?content_url=https%3A%2F%2Fgithub.com%2Factions%2Fsetup-python&report=actions+%28user%29)

## Releases

## Packages

## Used by

## Contributors

## Languages

You can’t perform that action at this time.
