---
url: https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/
retrieved: 2026-10-06
command: firecrawl scrape https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/ --only-main-content --max-age 0 --format markdown,rawHtml --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Creating and publishing scoped public packages | npm Docs
---
[Skip to search](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages#search-box-input) [Skip to content](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages#skip-to-content)

# Creating and publishing scoped public packages

Table of contents

To share your code publicly in a user or organization namespace, you can publish public user-scoped or organization-scoped packages to the npm registry.

For more information on scopes, see " [About scopes](https://docs.npmjs.com/about-scopes)".

**Note:** Before you can publish user-scoped npm packages, you must [sign up](https://www.npmjs.com/signup) for an npm user account.

Additionally, to publish organization-scoped packages, you must [create an npm user account](https://www.npmjs.com/signup), then [create an npm organization](https://www.npmjs.com/signup?next=/org/create).

## [Creating a scoped public package](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages\#creating-a-scoped-public-package)

1. If you are using npmrc to [manage accounts on multiple registries](https://docs.npmjs.com/configuring-your-registry-settings-as-an-npm-enterprise-user), on the command line, switch to the appropriate profile:
`npmrc <profile-name>`
2. On the command line, create a directory for your package:
`mkdir my-test-package`
3. Navigate to the root directory of your package:
`cd my-test-package`
4. If you are using git to manage your package code, in the package root directory, run the following commands, replacing `git-remote-url` with the git remote URL for your package:







```bash
git init
git remote add origin git://git-remote-url
```

5. In the package root directory, run the `npm init` command and pass the scope to the `scope` flag:
   - For an organization-scoped package, replace `my-org` with the name of your organization:
     `npm init --scope=@my-org`
   - For a user-scoped package, replace `my-username` with your username:
     `npm init --scope=@my-username`
6. Respond to the prompts to generate a [`package.json`](https://docs.npmjs.com/about-package-json-and-package-lock-json-files) file. For help naming your package, see " [Package name guidelines](https://docs.npmjs.com/package-name-guidelines)".

7. Create a [README file](https://docs.npmjs.com/about-package-readme-files) that explains what your package code is and how to use it.

8. In your preferred text editor, write the code for your package.


## [Reviewing package contents for sensitive or unnecessary information](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages\#reviewing-package-contents-for-sensitive-or-unnecessary-information)

Publishing sensitive information to the registry can harm your users, compromise your development infrastructure, be expensive to fix, and put you at risk of legal action. **We strongly recommend removing sensitive information, such as private keys, passwords, [personally identifiable information](https://en.wikipedia.org/wiki/Personally_identifiable_information) (PII), and credit card data before publishing your package to the registry.**

For less sensitive information, such as testing data, use a `.npmignore` or `.gitignore` file to prevent publishing to the registry. For more information, see [this article](https://docs.npmjs.com/misc/developers#keeping-files-out-of-your-package).

## [Testing your package](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages\#testing-your-package)

To reduce the chances of publishing bugs, we recommend testing your package before publishing it to the npm registry. To test your package, run `npm install` with the full path to your package directory:

`npm install /path/to/my-test-package`

## [Publishing scoped public packages](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages\#publishing-scoped-public-packages)

By default, scoped packages are published with private visibility. To publish a scoped package with public visibility, use `npm publish --access public`.

There are two ways to publish your package to the npm registry:

1. [Direct publishing](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages#direct-publishing)
2. [Staged publishing](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages#staged-publishing)

## [Direct publishing](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages\#direct-publishing)

To publish directly with `npm publish --access public`, you need either:

- Two-factor authentication (2FA) enabled on your account, or
- A granular access token (GAT) with bypass 2FA enabled

For more information, see the npm documentation on [requiring 2FA for package publishing](https://docs.npmjs.com/requiring-2fa-for-package-publishing-and-settings-modification).

1. On the command line, navigate to the root directory of your package.
`cd /path/to/my-test-package`
2. To publish your scoped public package to the npm registry, run:
`npm publish --access public`


**Note:** If you use GitHub Actions to publish your packages, you can generate provenance information for each package you publish. For more information, see " [Generating provenance statements](https://docs.npmjs.com/generating-provenance-statements)."

3. To see your public package page, visit [https://npmjs.com/package/\\\*package-name\](https://npmjs.com/package/%5C*package-name%5C)\*, replacing \*package-name\* with the name of your package. Public packages will say `public` below the package name on the npm website.
![Screenshot of a public npm Teams package](https://docs.npmjs.com/shared/organization-package-public.png)

For more information on the `publish` command, see the [CLI documentation](https://docs.npmjs.com/cli/publish).

## [Staged publishing](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages\#staged-publishing)

Instead of publishing directly, you can stage your package and approve it later. Staging the package does not require 2FA, which allows CI workflows to submit a package to the staging area. Before the package becomes publicly available, a maintainer must review and approve it with 2FA.

If the package does not yet exist, staging it publishes a placeholder version of the package that is publicly available. The staged version and its contents are not publicly available until the staged package is approved.

A GAT with bypass 2FA does not bypass the 2FA check during staged package approval.

1. On the command line, navigate to the root directory of your package.
`cd /path/to/my-test-package`
2. To stage your scoped public package, run:
`npm stage publish`
This submits your package to a staging area.

3. To check that your package has been staged, use either of the following methods:
   - In the CLI, run `npm stage list <package-name>` to find the staged package and its stage ID.
   - On [npmjs.com](https://www.npmjs.com/), open the **Staged Packages** tab to review staged packages.
4. To approve and publish the staged package, use one of the following methods:


   - In the CLI, run the `npm stage approve <stage-id>` command.
   - On [npmjs.com](https://www.npmjs.com/), review the staged package in the **Staged Packages** tab, then click **Approve**.

**Note:** You will be prompted for 2FA verification regardless of whether you approve the package in the CLI or on [npmjs.com](https://www.npmjs.com/). Once approved, the package is published to the live registry.

For the full staged publishing workflow, including reviewing, inspecting, and rejecting staged packages, see [Staged publishing](https://docs.npmjs.com/staged-publishing).

[Edit this page on GitHub](https://github.com/npm/documentation/edit/main/content/packages-and-modules/contributing-packages-to-the-registry/creating-and-publishing-scoped-public-packages.mdx)

9contributors [![shmam](https://github.com/shmam.png?size=40)](https://github.com/shmam) shmam [![karenjli](https://github.com/karenjli.png?size=40)](https://github.com/karenjli) karenjli [![u-m-i](https://github.com/u-m-i.png?size=40)](https://github.com/u-m-i) u-m-i [![dependabot[bot]](https://github.com/dependabot[bot].png?size=40)](https://github.com/dependabot[bot]) dependabot\[bot\] [![lukekarrys](https://github.com/lukekarrys.png?size=40)](https://github.com/lukekarrys) lukekarrys [![milofultz](https://github.com/milofultz.png?size=40)](https://github.com/milofultz) milofultz [![SiaraMist](https://github.com/SiaraMist.png?size=40)](https://github.com/SiaraMist) SiaraMist [![adambrangenberg](https://github.com/adambrangenberg.png?size=40)](https://github.com/adambrangenberg) adambrangenberg [![ethomson](https://github.com/ethomson.png?size=40)](https://github.com/ethomson) ethomson

Last edited by [shmam](https://github.com/shmam) on [September 29, 2026](https://github.com/npm/documentation/commit/dd84163d789162e8817f5d57ac313c64876d07a3)

## Table of contents
