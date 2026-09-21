---
url: https://github.com/nodejs/node/pull/50960
retrieved: 2026-09-21
command: firecrawl scrape https://github.com/nodejs/node/pull/50960 --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: sea: support embedding assets by joyeecheung · Pull Request #50960 · nodejs/node
---
[Skip to content](https://github.com/nodejs/node/pull/50960#start-of-content)

You signed in with another tab or window. [Reload](https://github.com/nodejs/node/pull/50960) to refresh your session.You signed out in another tab or window. [Reload](https://github.com/nodejs/node/pull/50960) to refresh your session.You switched accounts on another tab or window. [Reload](https://github.com/nodejs/node/pull/50960) to refresh your session.Dismiss alert

{{ message }}

[nodejs](https://github.com/nodejs)/ **[node](https://github.com/nodejs/node)** Public

- Sponsor







# Sponsor nodejs/node























##### GitHub Sponsors

[Learn more about Sponsors](https://github.com/sponsors)







[![@nodejs](https://avatars.githubusercontent.com/u/9950313?s=80&v=4)](https://github.com/nodejs)



[nodejs](https://github.com/nodejs)



[nodejs](https://github.com/nodejs)



[Sponsor](https://github.com/sponsors/nodejs)









##### External links





![open_collective](https://github.githubassets.com/assets/open_collective-0a706523753d.svg)



[opencollective.com/ **nodejs**](https://opencollective.com/nodejs)









[Learn more about funding links in repositories](https://docs.github.com/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/displaying-a-sponsor-button-in-your-repository).




[Report abuse](https://github.com/contact/report-abuse?report=nodejs%2Fnode+%28Repository+Funding+Links%29)

- [Notifications](https://github.com/login?return_to=%2Fnodejs%2Fnode) You must be signed in to change notification settings
- [Fork\\
37.5k](https://github.com/login?return_to=%2Fnodejs%2Fnode)
- [Star\\
122k](https://github.com/login?return_to=%2Fnodejs%2Fnode)


## Conversation

[![@joyeecheung](https://avatars.githubusercontent.com/u/4299420?s=80&v=4)](https://github.com/joyeecheung)

### ![@joyeecheung](https://avatars.githubusercontent.com/u/4299420?s=48&v=4)**[joyeecheung](https://github.com/joyeecheung)**     commented   [on Nov 28, 2023Nov 29, 2023](https://github.com/nodejs/node/pull/50960\#issue-2015541968)•   edited      Loading          \#\#\# Uh oh!        There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).


Copy link


Copy Markdown

Member

### src: print string content better in BlobDeserializer

When it's a short string, print it inline, otherwise print it

from a separate line. Also add the missing line breaks finally.

### sea: support embedding assets

With this patch:

Users can now include assets by adding a key-path dictionary

to the configuration as the `assets` field. At build time, Node.js

would read the assets from the specified paths and bundle them into

the preparation blob. In the generated executable, users can retrieve

the assets using the `sea.getAsset()` and `sea.getAssetAsBlob()` API.

```
{
  "main": "/path/to/bundled/script.js",
  "output": "/path/to/write/the/generated/blob.blob",
  "assets": {
    "a.jpg": "/path/to/a.jpg",
    "b.txt": "/path/to/b.txt"
  }
}
```

The single-executable application can access the assets as follows:

```
const { getAsset } = require('node:sea');
// Returns a copy of the data in an ArrayBuffer
const image = getAsset('a.jpg');
// Returns a string decoded from the asset as UTF8.
const text = getAsset('b.txt', 'utf8');
// Returns a Blob containing the asset without copying.
const blob = getAssetAsBlob('a.jpg');
```

Drive-by: update the documentation to include a section dedicated

to the injected main script and refer to it as "injected main

script" instead of "injected module" because it's a script, not

a module.

Refs: [nodejs/single-executable#68](https://github.com/nodejs/single-executable/issues/68)

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

🎉1baparham reacted with hooray emoji❤️2mxschmitt and samuelmaddock reacted with heart emoji🚀6bricss, pipobscure, mxschmitt, robertsLando, samuelmaddock, and dorukolcmener reacted with rocket emoji

All reactions

- 🎉1 reaction
- ❤️2 reactions
- 🚀6 reactions

[![@nodejs-github-bot](https://avatars.githubusercontent.com/u/18269663?s=80&u=2197410af2ccd267740fb3d7f2a275a2ec371fed&v=4)](https://github.com/nodejs-github-bot)

### **[nodejs-github-bot](https://github.com/nodejs-github-bot)**     commented   [on Nov 28, 2023Nov 29, 2023](https://github.com/nodejs/node/pull/50960\#issuecomment-1830975560)


Copy link


Copy Markdown

Collaborator

|     |
| --- |
| Review requested:<br>- [ ]  @nodejs/loaders<br>- [ ]  @nodejs/single-executable<br>- [ ]  @nodejs/startup |

All reactions

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

[![@nodejs-github-bot](https://avatars.githubusercontent.com/u/18269663?s=40&u=2197410af2ccd267740fb3d7f2a275a2ec371fed&v=4)](https://github.com/nodejs-github-bot)[nodejs-github-bot](https://github.com/nodejs-github-bot)

added
[c++](https://github.com/nodejs/node/issues?q=state%3Aopen%20label%3Ac%2B%2B) Issues and PRs that require attention from people who are familiar with C++. [lib / src](https://github.com/nodejs/node/issues?q=state%3Aopen%20label%3A%22lib%20%2F%20src%22) Issues and PRs involving general changes in the lib/ or src/ directories. [needs-ci](https://github.com/nodejs/node/issues?q=state%3Aopen%20label%3Aneeds-ci) PRs that need a full CI run.

labels

[on Nov 28, 2023Nov 29, 2023](https://github.com/nodejs/node/pull/50960#event-11090071734)

[![@joyeecheung](https://avatars.githubusercontent.com/u/4299420?s=40&u=d7eb2cf3db5f2a4df73a8f719c2e9e3d648e4e43&v=4)](https://github.com/joyeecheung)

[joyeecheung](https://github.com/joyeecheung) [force-pushed](https://github.com/nodejs/node/compare/9ebcf1cc225aac5a878cc381ac265027d33eda99..b35c59147bb195ecf3dbd9cb52d231e73491c75b)
the
sea-assets
branch
from
[`9ebcf1c`](https://github.com/nodejs/node/commit/9ebcf1cc225aac5a878cc381ac265027d33eda99) to
[`b35c591`](https://github.com/nodejs/node/commit/b35c59147bb195ecf3dbd9cb52d231e73491c75b) [Compare](https://github.com/nodejs/node/compare/9ebcf1cc225aac5a878cc381ac265027d33eda99..b35c59147bb195ecf3dbd9cb52d231e73491c75b) [3 years agoNovember 29, 2023 00:08](https://github.com/nodejs/node/pull/50960#event-11090079949)

[![@joyeecheung](https://avatars.githubusercontent.com/u/4299420?s=40&u=d7eb2cf3db5f2a4df73a8f719c2e9e3d648e4e43&v=4)](https://github.com/joyeecheung)[joyeecheung](https://github.com/joyeecheung)

added
the [request-ci](https://github.com/nodejs/node/issues?q=state%3Aopen%20label%3Arequest-ci) Add this label to start a Jenkins CI on a PR. Only starts once the PR has an approving review.
label

[on Nov 28, 2023Nov 29, 2023](https://github.com/nodejs/node/pull/50960#event-11090106661)

[![@github-actions](https://avatars.githubusercontent.com/in/15368?s=40&v=4)](https://github.com/apps/github-actions)[github-actions](https://github.com/apps/github-actions) Bot

removed
the [request-ci](https://github.com/nodejs/node/issues?q=state%3Aopen%20label%3Arequest-ci) Add this label to start a Jenkins CI on a PR. Only starts once the PR has an approving review.
label

[on Nov 28, 2023Nov 29, 2023](https://github.com/nodejs/node/pull/50960#event-11090163811)

[![@nodejs-github-bot](https://avatars.githubusercontent.com/u/18269663?s=80&u=2197410af2ccd267740fb3d7f2a275a2ec371fed&v=4)](https://github.com/nodejs-github-bot)

### **[nodejs-github-bot](https://github.com/nodejs-github-bot)**     commented   [on Nov 28, 2023Nov 29, 2023](https://github.com/nodejs/node/pull/50960\#issuecomment-1830989636)


Copy link


Copy Markdown

Collaborator

|     |
| --- |
| CI: [https://ci.nodejs.org/job/node-test-pull-request/55991/](https://ci.nodejs.org/job/node-test-pull-request/55991/) |

All reactions

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

[![@joyeecheung](https://avatars.githubusercontent.com/u/4299420?s=40&u=d7eb2cf3db5f2a4df73a8f719c2e9e3d648e4e43&v=4)](https://github.com/joyeecheung)

[joyeecheung](https://github.com/joyeecheung) [force-pushed](https://github.com/nodejs/node/compare/b35c59147bb195ecf3dbd9cb52d231e73491c75b..e3c9f15a1754c2fc8f6a35bbc287642c5f25b062)
the
sea-assets
branch
from
[`b35c591`](https://github.com/nodejs/node/commit/b35c59147bb195ecf3dbd9cb52d231e73491c75b) to
[`e3c9f15`](https://github.com/nodejs/node/commit/e3c9f15a1754c2fc8f6a35bbc287642c5f25b062) [Compare](https://github.com/nodejs/node/compare/b35c59147bb195ecf3dbd9cb52d231e73491c75b..e3c9f15a1754c2fc8f6a35bbc287642c5f25b062) [3 years agoNovember 29, 2023 02:17](https://github.com/nodejs/node/pull/50960#event-11090781236)

[![@joyeecheung](https://avatars.githubusercontent.com/u/4299420?s=40&u=d7eb2cf3db5f2a4df73a8f719c2e9e3d648e4e43&v=4)](https://github.com/joyeecheung)[joyeecheung](https://github.com/joyeecheung)

mentioned this pull request
[on Nov 28, 2023Nov 29, 2023](https://github.com/nodejs/node/pull/50960#ref-pullrequest-2012195783)

[sea: add ability to embed auxiliary data asset for use with sea\\
#50941](https://github.com/nodejs/node/pull/50941)

Closed

[![@joyeecheung](https://avatars.githubusercontent.com/u/4299420?s=40&u=d7eb2cf3db5f2a4df73a8f719c2e9e3d648e4e43&v=4)](https://github.com/joyeecheung)[joyeecheung](https://github.com/joyeecheung)

added
the [request-ci](https://github.com/nodejs/node/issues?q=state%3Aopen%20label%3Arequest-ci) Add this label to start a Jenkins CI on a PR. Only starts once the PR has an approving review.
label

[on Nov 28, 2023Nov 29, 2023](https://github.com/nodejs/node/pull/50960#event-11090793828)

[![@github-actions](https://avatars.githubusercontent.com/in/15368?s=40&v=4)](https://github.com/apps/github-actions)[github-actions](https://github.com/apps/github-actions) Bot

removed
the [request-ci](https://github.com/nodejs/node/issues?q=state%3Aopen%20label%3Arequest-ci) Add this label to start a Jenkins CI on a PR. Only starts once the PR has an approving review.
label

[on Nov 28, 2023Nov 29, 2023](https://github.com/nodejs/node/pull/50960#event-11090864103)

[![@nodejs-github-bot](https://avatars.githubusercontent.com/u/18269663?s=80&u=2197410af2ccd267740fb3d7f2a275a2ec371fed&v=4)](https://github.com/nodejs-github-bot)

### **[nodejs-github-bot](https://github.com/nodejs-github-bot)**     commented   [on Nov 28, 2023Nov 29, 2023](https://github.com/nodejs/node/pull/50960\#issuecomment-1831115837)


Copy link


Copy Markdown

Collaborator

|     |
| --- |
| CI: [https://ci.nodejs.org/job/node-test-pull-request/55994/](https://ci.nodejs.org/job/node-test-pull-request/55994/) |

All reactions

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

[![GeoffreyBooth](https://avatars.githubusercontent.com/u/456802?s=60&v=4)](https://github.com/GeoffreyBooth)

**[GeoffreyBooth](https://github.com/GeoffreyBooth)**

reviewed

[on Nov 28, 2023Nov 29, 2023](https://github.com/nodejs/node/pull/50960#pullrequestreview-1754403395)

[View reviewed changes](https://github.com/nodejs/node/pull/50960/files)

Comment thread[doc/api/errors.md](https://github.com/nodejs/node/pull/50960/files#diff-25028e2a7d2f7b55d8325ef4098b431b59a49ae129b66c33a0108549a37ff0b8)
Outdated
Show resolvedHide resolved

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

Comment thread[doc/api/errors.md](https://github.com/nodejs/node/pull/50960/files#diff-25028e2a7d2f7b55d8325ef4098b431b59a49ae129b66c33a0108549a37ff0b8)
Outdated
Show resolvedHide resolved

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

Comment thread[src/json\_parser.cc](https://github.com/nodejs/node/pull/50960/files#diff-4adea6b0de9fcc11e86285927cf44fdc42c8b48862a42e6fe2abd703a3a2f0c4)
Outdated
Show resolvedHide resolved

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

[![@targos](https://avatars.githubusercontent.com/u/2352663?s=80&u=6d0db159fb863f7648118acf92b7960701228bf9&v=4)](https://github.com/targos)

### **[targos](https://github.com/targos)**     commented   [on Nov 29, 2023Nov 29, 2023](https://github.com/nodejs/node/pull/50960\#issuecomment-1831351489)


Copy link


Copy Markdown

Member

|     |
| --- |
| Should we have a `getAssetNames()` API or something else that allows the user to list the bundled assets? |

All reactions

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

[![targos](https://avatars.githubusercontent.com/u/2352663?s=60&v=4)](https://github.com/targos)

**[targos](https://github.com/targos)**

reviewed

[on Nov 29, 2023Nov 29, 2023](https://github.com/nodejs/node/pull/50960#pullrequestreview-1754600788)

[View reviewed changes](https://github.com/nodejs/node/pull/50960/files)

Comment thread[doc/api/single-executable-applications.md](https://github.com/nodejs/node/pull/50960/files#diff-aba82e1eb560e894626239e266fc0866889052f547508a0725774e4e0683fd6e)
Outdated
Show resolvedHide resolved

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

[![@joyeecheung](https://avatars.githubusercontent.com/u/4299420?s=80&u=d7eb2cf3db5f2a4df73a8f719c2e9e3d648e4e43&v=4)](https://github.com/joyeecheung)

### **[joyeecheung](https://github.com/joyeecheung)**     commented   [on Nov 29, 2023Nov 29, 2023](https://github.com/nodejs/node/pull/50960\#issuecomment-1832038359)


Copy link


Copy Markdown

MemberAuthor

|     |
| --- |
| From [#50941 (comment)](https://github.com/nodejs/node/pull/50941#issuecomment-1831702526)<br>> What is wrong with saying in docs here is an ArrayBuffer, but if you mess with it you’ll crash? Then as a developer I could just adhere to that and live happily ever after.<br>One thing we need to decide: should we expose `getRawAsset()` to allow users reading the asset directly without copying. With a Blob users still have to do some form of copying at the end of the day unless their use case is piping the whole thing. Currently if you get the raw buffer and then wrap it with an ArrayBufferView and then mutate any of the elements, the process would crash due to access protection (probably because the segments postject uses are protected, or I'm not sure if there are unprotected segments we can do this injection with) |

👍1pipobscure reacted with thumbs up emoji

All reactions

- 👍1 reaction

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

[![@joyeecheung](https://avatars.githubusercontent.com/u/4299420?s=40&u=d7eb2cf3db5f2a4df73a8f719c2e9e3d648e4e43&v=4)](https://github.com/joyeecheung)

[joyeecheung](https://github.com/joyeecheung) [force-pushed](https://github.com/nodejs/node/compare/e3c9f15a1754c2fc8f6a35bbc287642c5f25b062..cf7d0a1d8386e89f0c968b5d7c44b2706821b6e0)
the
sea-assets
branch
from
[`e3c9f15`](https://github.com/nodejs/node/commit/e3c9f15a1754c2fc8f6a35bbc287642c5f25b062) to
[`cf7d0a1`](https://github.com/nodejs/node/commit/cf7d0a1d8386e89f0c968b5d7c44b2706821b6e0) [Compare](https://github.com/nodejs/node/compare/e3c9f15a1754c2fc8f6a35bbc287642c5f25b062..cf7d0a1d8386e89f0c968b5d7c44b2706821b6e0) [3 years agoNovember 29, 2023 14:56](https://github.com/nodejs/node/pull/50960#event-11097565319)

[![@pipobscure](https://avatars.githubusercontent.com/u/446127?s=80&u=e6e0c69b84143e6259ee0901f942f0a92a8f1bf4&v=4)](https://github.com/pipobscure)

### **[pipobscure](https://github.com/pipobscure)**     commented   [on Nov 29, 2023Nov 29, 2023](https://github.com/nodejs/node/pull/50960\#issuecomment-1832603074)


Copy link


Copy Markdown

Contributor

|     |
| --- |
| Just a note: I really appreciate this happening. I have previously been using [nexe](https://github.com/nexe/nexe) and [pkg](https://github.com/vercel/pkg) and therefore know a lot of the pain points of trying to keep current with node. So I just want to give [@joyeecheung](https://github.com/joyeecheung) huge thanks and kudos for moving this forward! **THANKS** |

❤️4joyeecheung, robertsLando, ruyadorno, and baparham reacted with heart emoji

All reactions

- ❤️4 reactions

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

[![pluris](https://avatars.githubusercontent.com/u/10344797?s=60&v=4)](https://github.com/pluris)

**[pluris](https://github.com/pluris)**

reviewed

[on Nov 30, 2023Nov 30, 2023](https://github.com/nodejs/node/pull/50960#pullrequestreview-1756730722)

[View reviewed changes](https://github.com/nodejs/node/pull/50960/files)

Comment thread[doc/api/errors.md](https://github.com/nodejs/node/pull/50960/files#diff-25028e2a7d2f7b55d8325ef4098b431b59a49ae129b66c33a0108549a37ff0b8)
Outdated
Show resolvedHide resolved

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

[![aduh95](https://avatars.githubusercontent.com/u/14309773?s=60&v=4)](https://github.com/aduh95)

**[aduh95](https://github.com/aduh95)**

reviewed

[on Dec 1, 2023Dec 1, 2023](https://github.com/nodejs/node/pull/50960#pullrequestreview-1759857136)

[View reviewed changes](https://github.com/nodejs/node/pull/50960/files)

### ![@aduh95](https://avatars.githubusercontent.com/u/14309773?s=48&v=4)**[aduh95](https://github.com/aduh95)**     left a comment


Copy link


Copy Markdown

Contributor

There was a problem hiding this comment.

### Choose a reason for hiding this comment

The reason will be displayed to describe this comment to others. [Learn more](https://docs.github.com/articles/managing-disruptive-comments/#hiding-a-comment).


Choose a reason
SpamAbuseOff TopicOutdatedDuplicateResolvedLow QualityHide comment

A few nits

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

All reactions

Comment thread[doc/api/single-executable-applications.md](https://github.com/nodejs/node/pull/50960/files#diff-aba82e1eb560e894626239e266fc0866889052f547508a0725774e4e0683fd6e)
Outdated
Show resolvedHide resolved

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

Comment thread[lib/sea.js](https://github.com/nodejs/node/pull/50960/files#diff-7c7d0b6326be117fc85da77dd6091311159c06a881502f3db4a9a3bc9cdf0fd8)
Outdated
Show resolvedHide resolved

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

Comment thread[test/fixtures/sea/get-asset.js](https://github.com/nodejs/node/pull/50960/files#diff-b4da33d48987664fcd081a0e08cc4fc1a594dc22cf87879b1472399a43910786)
Outdated
Show resolvedHide resolved

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

Comment thread[test/fixtures/sea/get-asset.js](https://github.com/nodejs/node/pull/50960/files#diff-b4da33d48987664fcd081a0e08cc4fc1a594dc22cf87879b1472399a43910786)
Outdated
Show resolvedHide resolved

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

Comment thread[test/fixtures/sea/get-asset.js](https://github.com/nodejs/node/pull/50960/files#diff-b4da33d48987664fcd081a0e08cc4fc1a594dc22cf87879b1472399a43910786)
Outdated
Show resolvedHide resolved

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

Comment thread[doc/api/errors.md](https://github.com/nodejs/node/pull/50960/files#diff-25028e2a7d2f7b55d8325ef4098b431b59a49ae129b66c33a0108549a37ff0b8)
Outdated
Show resolvedHide resolved

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

Comment thread[doc/api/errors.md](https://github.com/nodejs/node/pull/50960/files#diff-25028e2a7d2f7b55d8325ef4098b431b59a49ae129b66c33a0108549a37ff0b8)
Outdated
Show resolvedHide resolved

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

[![anonrig](https://avatars.githubusercontent.com/u/1935246?s=60&v=4)](https://github.com/anonrig)

**[anonrig](https://github.com/anonrig)**

reviewed

[on Dec 2, 2023Dec 2, 2023](https://github.com/nodejs/node/pull/50960#pullrequestreview-1760965145)

[View reviewed changes](https://github.com/nodejs/node/pull/50960/files)

Comment thread[doc/api/single-executable-applications.md](https://github.com/nodejs/node/pull/50960/files#diff-aba82e1eb560e894626239e266fc0866889052f547508a0725774e4e0683fd6e)
Outdated

|
|

### ![@anonrig](https://avatars.githubusercontent.com/u/1935246?s=48&v=4)**[anonrig](https://github.com/anonrig)** [on Dec 2, 2023Dec 2, 2023](https://github.com/nodejs/node/pull/50960\#discussion_r1412879465)


Copy link


Copy Markdown

Member

There was a problem hiding this comment.

### Choose a reason for hiding this comment

The reason will be displayed to describe this comment to others. [Learn more](https://docs.github.com/articles/managing-disruptive-comments/#hiding-a-comment).


Choose a reason
SpamAbuseOff TopicOutdatedDuplicateResolvedLow QualityHide comment

@nodejs/single-executable I recommend creating a JSON schema and distributing it through nodejs.org, to have better intellisense when this json includes "$schema" parameter. This could help with maintenance and usability.

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

All reactions

### ![@joyeecheung](https://avatars.githubusercontent.com/u/4299420?s=48&v=4)**[joyeecheung](https://github.com/joyeecheung)** [on Dec 7, 2023Dec 7, 2023](https://github.com/nodejs/node/pull/50960\#discussion_r1419299610)


Copy link


Copy Markdown

MemberAuthor

There was a problem hiding this comment.

### Choose a reason for hiding this comment

The reason will be displayed to describe this comment to others. [Learn more](https://docs.github.com/articles/managing-disruptive-comments/#hiding-a-comment).


Choose a reason
SpamAbuseOff TopicOutdatedDuplicateResolvedLow QualityHide comment

Do you want to open an issue in [https://github.com/nodejs/single-executable/issues](https://github.com/nodejs/single-executable/issues) instead?

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

All reactions

Comment thread[doc/api/single-executable-applications.md](https://github.com/nodejs/node/pull/50960/files#diff-aba82e1eb560e894626239e266fc0866889052f547508a0725774e4e0683fd6e)
Outdated
Show resolvedHide resolved

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

Comment thread[doc/api/single-executable-applications.md](https://github.com/nodejs/node/pull/50960/files#diff-aba82e1eb560e894626239e266fc0866889052f547508a0725774e4e0683fd6e)
Outdated
Show resolvedHide resolved

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

Comment thread[lib/sea.js](https://github.com/nodejs/node/pull/50960/files#diff-7c7d0b6326be117fc85da77dd6091311159c06a881502f3db4a9a3bc9cdf0fd8)
Outdated
Show resolvedHide resolved

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

Comment thread[lib/sea.js](https://github.com/nodejs/node/pull/50960/files#diff-7c7d0b6326be117fc85da77dd6091311159c06a881502f3db4a9a3bc9cdf0fd8)
Outdated
Show resolvedHide resolved

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

Comment thread[lib/sea.js](https://github.com/nodejs/node/pull/50960/files#diff-7c7d0b6326be117fc85da77dd6091311159c06a881502f3db4a9a3bc9cdf0fd8)
Outdated
Show resolvedHide resolved

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

Comment thread[src/json\_parser.cc](https://github.com/nodejs/node/pull/50960/files#diff-4adea6b0de9fcc11e86285927cf44fdc42c8b48862a42e6fe2abd703a3a2f0c4)
Outdated
Show resolvedHide resolved

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

Comment thread[src/json\_parser.cc](https://github.com/nodejs/node/pull/50960/files#diff-4adea6b0de9fcc11e86285927cf44fdc42c8b48862a42e6fe2abd703a3a2f0c4)
Outdated
Show resolvedHide resolved

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

[![@targos](https://avatars.githubusercontent.com/u/2352663?s=80&u=6d0db159fb863f7648118acf92b7960701228bf9&v=4)](https://github.com/targos)

### **[targos](https://github.com/targos)**     commented   [on Dec 4, 2023Dec 4, 2023](https://github.com/nodejs/node/pull/50960\#issuecomment-1839211924)


Copy link


Copy Markdown

Member

|     |
| --- |
| Just repeating [#50960 (comment)](https://github.com/nodejs/node/pull/50960#issuecomment-1831351489) in case you missed it:<br>Should we have a `getAssetNames()` API or something else that allows the user to list the bundled assets? |

All reactions

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

[![joyeecheung](https://avatars.githubusercontent.com/u/4299420?s=60&v=4)](https://github.com/joyeecheung)

**[joyeecheung](https://github.com/joyeecheung)**

commented

[on Dec 7, 2023Dec 7, 2023](https://github.com/nodejs/node/pull/50960#pullrequestreview-1770640472)

[View reviewed changes](https://github.com/nodejs/node/pull/50960/files)

Comment thread[doc/api/single-executable-applications.md](https://github.com/nodejs/node/pull/50960/files#diff-aba82e1eb560e894626239e266fc0866889052f547508a0725774e4e0683fd6e)
Outdated
Show resolvedHide resolved

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

[![joyeecheung](https://avatars.githubusercontent.com/u/4299420?s=60&v=4)](https://github.com/joyeecheung)

**[joyeecheung](https://github.com/joyeecheung)**

commented

[on Dec 7, 2023Dec 7, 2023](https://github.com/nodejs/node/pull/50960#pullrequestreview-1770641274)

[View reviewed changes](https://github.com/nodejs/node/pull/50960/files)

Comment thread[doc/api/single-executable-applications.md](https://github.com/nodejs/node/pull/50960/files#diff-aba82e1eb560e894626239e266fc0866889052f547508a0725774e4e0683fd6e)
Outdated
Show resolvedHide resolved

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

[![joyeecheung](https://avatars.githubusercontent.com/u/4299420?s=60&v=4)](https://github.com/joyeecheung)

**[joyeecheung](https://github.com/joyeecheung)**

commented

[on Dec 7, 2023Dec 7, 2023](https://github.com/nodejs/node/pull/50960#pullrequestreview-1770642782)

[View reviewed changes](https://github.com/nodejs/node/pull/50960/files)

Comment thread[src/json\_parser.h](https://github.com/nodejs/node/pull/50960/files#diff-0b96fbe71d5ae4aa3a30eb6c6ef541a7b7991be713dbee14bb8108e0f9123c64)
Outdated
Show resolvedHide resolved

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

[![joyeecheung](https://avatars.githubusercontent.com/u/4299420?s=60&v=4)](https://github.com/joyeecheung)

**[joyeecheung](https://github.com/joyeecheung)**

commented

[on Dec 7, 2023Dec 7, 2023](https://github.com/nodejs/node/pull/50960#pullrequestreview-1770643147)

[View reviewed changes](https://github.com/nodejs/node/pull/50960/files)

Comment thread[src/json\_parser.h](https://github.com/nodejs/node/pull/50960/files#diff-0b96fbe71d5ae4aa3a30eb6c6ef541a7b7991be713dbee14bb8108e0f9123c64)
Outdated
Show resolvedHide resolved

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

[![joyeecheung](https://avatars.githubusercontent.com/u/4299420?s=60&v=4)](https://github.com/joyeecheung)

**[joyeecheung](https://github.com/joyeecheung)**

commented

[on Dec 7, 2023Dec 7, 2023](https://github.com/nodejs/node/pull/50960#pullrequestreview-1770643755)

[View reviewed changes](https://github.com/nodejs/node/pull/50960/files)

Comment thread[src/json\_parser.cc](https://github.com/nodejs/node/pull/50960/files#diff-4adea6b0de9fcc11e86285927cf44fdc42c8b48862a42e6fe2abd703a3a2f0c4)
Outdated
Show resolvedHide resolved

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

[![joyeecheung](https://avatars.githubusercontent.com/u/4299420?s=60&v=4)](https://github.com/joyeecheung)

**[joyeecheung](https://github.com/joyeecheung)**

commented

[on Dec 7, 2023Dec 7, 2023](https://github.com/nodejs/node/pull/50960#pullrequestreview-1770644386)

[View reviewed changes](https://github.com/nodejs/node/pull/50960/files)

Comment thread[src/node\_sea.cc](https://github.com/nodejs/node/pull/50960/files#diff-5afaf7eae42f44a543b411784037654c21ba0dc69870c7a5351bc219f0bfce64)
Outdated
Show resolvedHide resolved

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

[![joyeecheung](https://avatars.githubusercontent.com/u/4299420?s=60&v=4)](https://github.com/joyeecheung)

**[joyeecheung](https://github.com/joyeecheung)**

commented

[on Dec 7, 2023Dec 7, 2023](https://github.com/nodejs/node/pull/50960#pullrequestreview-1770645157)

[View reviewed changes](https://github.com/nodejs/node/pull/50960/files)

Comment thread[src/node\_sea.cc](https://github.com/nodejs/node/pull/50960/files#diff-5afaf7eae42f44a543b411784037654c21ba0dc69870c7a5351bc219f0bfce64)
Outdated
Show resolvedHide resolved

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

171 hidden items

Load more…


[![@marco-ippolito](https://avatars.githubusercontent.com/u/36735501?s=40&u=8e93f809522831771aab98cbb2a67c5e67e673d5&v=4)](https://github.com/marco-ippolito)[marco-ippolito](https://github.com/marco-ippolito)

mentioned this pull request
[on Mar 1, 2024Mar 1, 2024](https://github.com/nodejs/node/pull/50960#ref-pullrequest-2162891978)

[v21.7.0 proposal\\
#51932](https://github.com/nodejs/node/pull/51932)

Merged

[marco-ippolito](https://github.com/marco-ippolito)

added a commit
that referenced
this pull request

[on Mar 1, 2024Mar 1, 2024](https://github.com/nodejs/node/pull/50960#ref-commit-e5353e9)

[![@marco-ippolito](https://avatars.githubusercontent.com/u/36735501?s=40&u=8e93f809522831771aab98cbb2a67c5e67e673d5&v=4)](https://github.com/marco-ippolito)

`
          2024-03-08, Version 21.7.0 (Current)
`…

`
          e5353e9
`

```
Notable changes:

build:
  * (SEMVER-MINOR) build opt to set local location of headers (Michael Dawson) #51525
crypto:
  * (SEMVER-MINOR) implement crypto.hash() (Joyee Cheung) #51044
  * update root certificates to NSS 3.98 (Node.js GitHub Bot) #51794
doc:
  * add zcbenz to collaborators (Cheng Zhao) #51812
  * add lemire to collaborators (Daniel Lemire) #51572
http2:
  * (SEMVER-MINOR) add h2 compat support for appendHeader (Tim Perry) #51412
  * (SEMVER-MINOR) add server handshake utility (snek) #51172
  * (SEMVER-MINOR) receive customsettings (Marten Richter) #51323
lib:
  * (SEMVER-MINOR) move encodingsMap to internal/util (Joyee Cheung) #51044
sea:
  * (SEMVER-MINOR) support sea.getRawAsset() (Joyee Cheung) #50960
  * (SEMVER-MINOR) support embedding assets (Joyee Cheung) #50960
src:
  * (SEMVER-MINOR) print string content better in BlobDeserializer (Joyee Cheung) #50960
  * (SEMVER-MINOR) support multi-line values for .env file (IlyasShabi) #51289
  * (SEMVER-MINOR) add `process.loadEnvFile` and `util.parseEnv` (Yagiz Nizipli) #51476
  * (SEMVER-MINOR) do not coerce dotenv paths (Tobias Nießen) #51425
stream:
  * (SEMVER-MINOR) implement `min` option for `ReadableStreamBYOBReader.read` (Mattias Buelens) #50888
util:
  * (SEMVER-MINOR) add styleText API to text formatting (Rafael Gonzaga) #51850
vm:
  * (SEMVER-MINOR) support using the default loader to handle dynamic import() (Joyee Cheung) #51244

PR-URL: #51932
```

[marco-ippolito](https://github.com/marco-ippolito)

added a commit
that referenced
this pull request

[on Mar 1, 2024Mar 1, 2024](https://github.com/nodejs/node/pull/50960#ref-commit-9571f39)

[![@marco-ippolito](https://avatars.githubusercontent.com/u/36735501?s=40&u=8e93f809522831771aab98cbb2a67c5e67e673d5&v=4)](https://github.com/marco-ippolito)

`
          2024-03-08, Version 21.7.0 (Current)
`…

`
          9571f39
`

```
Notable changes:

build:
  * (SEMVER-MINOR) build opt to set local location of headers (Michael Dawson) #51525
crypto:
  * (SEMVER-MINOR) implement crypto.hash() (Joyee Cheung) #51044
  * update root certificates to NSS 3.98 (Node.js GitHub Bot) #51794
doc:
  * add zcbenz to collaborators (Cheng Zhao) #51812
  * add lemire to collaborators (Daniel Lemire) #51572
http2:
  * (SEMVER-MINOR) add h2 compat support for appendHeader (Tim Perry) #51412
  * (SEMVER-MINOR) add server handshake utility (snek) #51172
  * (SEMVER-MINOR) receive customsettings (Marten Richter) #51323
lib:
  * (SEMVER-MINOR) move encodingsMap to internal/util (Joyee Cheung) #51044
sea:
  * (SEMVER-MINOR) support sea.getRawAsset() (Joyee Cheung) #50960
  * (SEMVER-MINOR) support embedding assets (Joyee Cheung) #50960
src:
  * (SEMVER-MINOR) print string content better in BlobDeserializer (Joyee Cheung) #50960
  * (SEMVER-MINOR) support multi-line values for .env file (IlyasShabi) #51289
  * (SEMVER-MINOR) add `process.loadEnvFile` and `util.parseEnv` (Yagiz Nizipli) #51476
  * (SEMVER-MINOR) do not coerce dotenv paths (Tobias Nießen) #51425
stream:
  * (SEMVER-MINOR) implement `min` option for `ReadableStreamBYOBReader.read` (Mattias Buelens) #50888
util:
  * (SEMVER-MINOR) add styleText API to text formatting (Rafael Gonzaga) #51850
vm:
  * (SEMVER-MINOR) support using the default loader to handle dynamic import() (Joyee Cheung) #51244

PR-URL: #51932
```

[marco-ippolito](https://github.com/marco-ippolito)

added a commit
that referenced
this pull request

[on Mar 1, 2024Mar 1, 2024](https://github.com/nodejs/node/pull/50960#ref-commit-4533c19)

[![@marco-ippolito](https://avatars.githubusercontent.com/u/36735501?s=40&u=8e93f809522831771aab98cbb2a67c5e67e673d5&v=4)](https://github.com/marco-ippolito)

`
          2024-03-06, Version 21.7.0 (Current)
`…

`
          4533c19
`

```
Notable changes:

build:
  * (SEMVER-MINOR) build opt to set local location of headers (Michael Dawson) #51525
crypto:
  * (SEMVER-MINOR) implement crypto.hash() (Joyee Cheung) #51044
  * update root certificates to NSS 3.98 (Node.js GitHub Bot) #51794
doc:
  * add zcbenz to collaborators (Cheng Zhao) #51812
  * add lemire to collaborators (Daniel Lemire) #51572
http2:
  * (SEMVER-MINOR) add h2 compat support for appendHeader (Tim Perry) #51412
  * (SEMVER-MINOR) add server handshake utility (snek) #51172
  * (SEMVER-MINOR) receive customsettings (Marten Richter) #51323
lib:
  * (SEMVER-MINOR) move encodingsMap to internal/util (Joyee Cheung) #51044
sea:
  * (SEMVER-MINOR) support sea.getRawAsset() (Joyee Cheung) #50960
  * (SEMVER-MINOR) support embedding assets (Joyee Cheung) #50960
src:
  * (SEMVER-MINOR) print string content better in BlobDeserializer (Joyee Cheung) #50960
  * (SEMVER-MINOR) support multi-line values for .env file (IlyasShabi) #51289
  * (SEMVER-MINOR) add `process.loadEnvFile` and `util.parseEnv` (Yagiz Nizipli) #51476
  * (SEMVER-MINOR) do not coerce dotenv paths (Tobias Nießen) #51425
stream:
  * (SEMVER-MINOR) implement `min` option for `ReadableStreamBYOBReader.read` (Mattias Buelens) #50888
util:
  * (SEMVER-MINOR) add styleText API to text formatting (Rafael Gonzaga) #51850
vm:
  * (SEMVER-MINOR) support using the default loader to handle dynamic import() (Joyee Cheung) #51244

PR-URL: #51932
```

[marco-ippolito](https://github.com/marco-ippolito)

added a commit
that referenced
this pull request

[on Mar 2, 2024Mar 2, 2024](https://github.com/nodejs/node/pull/50960#ref-commit-bcd4f1a)

[![@marco-ippolito](https://avatars.githubusercontent.com/u/36735501?s=40&u=8e93f809522831771aab98cbb2a67c5e67e673d5&v=4)](https://github.com/marco-ippolito)

`
          2024-03-06, Version 21.7.0 (Current)
`…

`
          bcd4f1a
`

```
Notable changes:

build:
  * (SEMVER-MINOR) build opt to set local location of headers (Michael Dawson) #51525
crypto:
  * (SEMVER-MINOR) implement crypto.hash() (Joyee Cheung) #51044
  * update root certificates to NSS 3.98 (Node.js GitHub Bot) #51794
doc:
  * add zcbenz to collaborators (Cheng Zhao) #51812
  * add lemire to collaborators (Daniel Lemire) #51572
http2:
  * (SEMVER-MINOR) add h2 compat support for appendHeader (Tim Perry) #51412
  * (SEMVER-MINOR) add server handshake utility (snek) #51172
  * (SEMVER-MINOR) receive customsettings (Marten Richter) #51323
lib:
  * (SEMVER-MINOR) move encodingsMap to internal/util (Joyee Cheung) #51044
sea:
  * (SEMVER-MINOR) support sea.getRawAsset() (Joyee Cheung) #50960
  * (SEMVER-MINOR) support embedding assets (Joyee Cheung) #50960
src:
  * (SEMVER-MINOR) print string content better in BlobDeserializer (Joyee Cheung) #50960
  * (SEMVER-MINOR) support multi-line values for .env file (IlyasShabi) #51289
  * (SEMVER-MINOR) add `process.loadEnvFile` and `util.parseEnv` (Yagiz Nizipli) #51476
  * (SEMVER-MINOR) do not coerce dotenv paths (Tobias Nießen) #51425
stream:
  * (SEMVER-MINOR) implement `min` option for `ReadableStreamBYOBReader.read` (Mattias Buelens) #50888
util:
  * (SEMVER-MINOR) add styleText API to text formatting (Rafael Gonzaga) #51850
vm:
  * (SEMVER-MINOR) support using the default loader to handle dynamic import() (Joyee Cheung) #51244

PR-URL: #51932
```

[marco-ippolito](https://github.com/marco-ippolito)

added a commit
that referenced
this pull request

[on Mar 5, 2024Mar 5, 2024](https://github.com/nodejs/node/pull/50960#ref-commit-bd81180)

[![@marco-ippolito](https://avatars.githubusercontent.com/u/36735501?s=40&u=8e93f809522831771aab98cbb2a67c5e67e673d5&v=4)](https://github.com/marco-ippolito)

`
          2024-03-06, Version 21.7.0 (Current)
`…

`
          bd81180
`

```
Notable changes:

build:
  * (SEMVER-MINOR) build opt to set local location of headers (Michael Dawson) #51525
crypto:
  * (SEMVER-MINOR) implement crypto.hash() (Joyee Cheung) #51044
  * update root certificates to NSS 3.98 (Node.js GitHub Bot) #51794
doc:
  * add zcbenz to collaborators (Cheng Zhao) #51812
  * add lemire to collaborators (Daniel Lemire) #51572
http2:
  * (SEMVER-MINOR) add h2 compat support for appendHeader (Tim Perry) #51412
  * (SEMVER-MINOR) add server handshake utility (snek) #51172
  * (SEMVER-MINOR) receive customsettings (Marten Richter) #51323
lib:
  * (SEMVER-MINOR) move encodingsMap to internal/util (Joyee Cheung) #51044
sea:
  * (SEMVER-MINOR) support sea.getRawAsset() (Joyee Cheung) #50960
  * (SEMVER-MINOR) support embedding assets (Joyee Cheung) #50960
src:
  * (SEMVER-MINOR) print string content better in BlobDeserializer (Joyee Cheung) #50960
  * (SEMVER-MINOR) support multi-line values for .env file (IlyasShabi) #51289
  * (SEMVER-MINOR) add `process.loadEnvFile` and `util.parseEnv` (Yagiz Nizipli) #51476
  * (SEMVER-MINOR) do not coerce dotenv paths (Tobias Nießen) #51425
stream:
  * (SEMVER-MINOR) implement `min` option for `ReadableStreamBYOBReader.read` (Mattias Buelens) #50888
util:
  * (SEMVER-MINOR) add styleText API to text formatting (Rafael Gonzaga) #51850
vm:
  * (SEMVER-MINOR) support using the default loader to handle dynamic import() (Joyee Cheung) #51244

PR-URL: #51932
```

[marco-ippolito](https://github.com/marco-ippolito)

added a commit
that referenced
this pull request

[on Mar 5, 2024Mar 5, 2024](https://github.com/nodejs/node/pull/50960#ref-commit-47e6820)

[![@marco-ippolito](https://avatars.githubusercontent.com/u/36735501?s=40&u=8e93f809522831771aab98cbb2a67c5e67e673d5&v=4)](https://github.com/marco-ippolito)

`
          2024-03-06, Version 21.7.0 (Current)
`…

`
          47e6820
`

```
Notable changes:

build:
  * (SEMVER-MINOR) build opt to set local location of headers (Michael Dawson) #51525
crypto:
  * (SEMVER-MINOR) implement crypto.hash() (Joyee Cheung) #51044
  * update root certificates to NSS 3.98 (Node.js GitHub Bot) #51794
doc:
  * add zcbenz to collaborators (Cheng Zhao) #51812
  * add lemire to collaborators (Daniel Lemire) #51572
http2:
  * (SEMVER-MINOR) add h2 compat support for appendHeader (Tim Perry) #51412
  * (SEMVER-MINOR) add server handshake utility (snek) #51172
  * (SEMVER-MINOR) receive customsettings (Marten Richter) #51323
lib:
  * (SEMVER-MINOR) move encodingsMap to internal/util (Joyee Cheung) #51044
sea:
  * (SEMVER-MINOR) support sea.getRawAsset() (Joyee Cheung) #50960
  * (SEMVER-MINOR) support embedding assets (Joyee Cheung) #50960
src:
  * (SEMVER-MINOR) print string content better in BlobDeserializer (Joyee Cheung) #50960
  * (SEMVER-MINOR) support multi-line values for .env file (IlyasShabi) #51289
  * (SEMVER-MINOR) add `process.loadEnvFile` and `util.parseEnv` (Yagiz Nizipli) #51476
  * (SEMVER-MINOR) do not coerce dotenv paths (Tobias Nießen) #51425
stream:
  * (SEMVER-MINOR) implement `min` option for `ReadableStreamBYOBReader.read` (Mattias Buelens) #50888
util:
  * (SEMVER-MINOR) add styleText API to text formatting (Rafael Gonzaga) #51850
vm:
  * (SEMVER-MINOR) support using the default loader to handle dynamic import() (Joyee Cheung) #51244

PR-URL: #51932
```

[RafaelGSS](https://github.com/RafaelGSS)

pushed a commit
that referenced
this pull request

[on Mar 6, 2024Mar 6, 2024](https://github.com/nodejs/node/pull/50960#ref-commit-2246cd9)

[![@marco-ippolito](https://avatars.githubusercontent.com/u/36735501?s=40&u=8e93f809522831771aab98cbb2a67c5e67e673d5&v=4)](https://github.com/marco-ippolito)[![@RafaelGSS](https://avatars.githubusercontent.com/u/26234614?s=40&v=4)](https://github.com/RafaelGSS)

`
          2024-03-06, Version 21.7.0 (Current)
`…

`
          2246cd9
`

```
Notable changes:

build:
  * (SEMVER-MINOR) build opt to set local location of headers (Michael Dawson) #51525
crypto:
  * (SEMVER-MINOR) implement crypto.hash() (Joyee Cheung) #51044
  * update root certificates to NSS 3.98 (Node.js GitHub Bot) #51794
doc:
  * add zcbenz to collaborators (Cheng Zhao) #51812
  * add lemire to collaborators (Daniel Lemire) #51572
http2:
  * (SEMVER-MINOR) add h2 compat support for appendHeader (Tim Perry) #51412
  * (SEMVER-MINOR) add server handshake utility (snek) #51172
  * (SEMVER-MINOR) receive customsettings (Marten Richter) #51323
lib:
  * (SEMVER-MINOR) move encodingsMap to internal/util (Joyee Cheung) #51044
sea:
  * (SEMVER-MINOR) support sea.getRawAsset() (Joyee Cheung) #50960
  * (SEMVER-MINOR) support embedding assets (Joyee Cheung) #50960
src:
  * (SEMVER-MINOR) print string content better in BlobDeserializer (Joyee Cheung) #50960
  * (SEMVER-MINOR) support multi-line values for .env file (IlyasShabi) #51289
  * (SEMVER-MINOR) add `process.loadEnvFile` and `util.parseEnv` (Yagiz Nizipli) #51476
  * (SEMVER-MINOR) do not coerce dotenv paths (Tobias Nießen) #51425
stream:
  * (SEMVER-MINOR) implement `min` option for `ReadableStreamBYOBReader.read` (Mattias Buelens) #50888
util:
  * (SEMVER-MINOR) add styleText API to text formatting (Rafael Gonzaga) #51850
vm:
  * (SEMVER-MINOR) support using the default loader to handle dynamic import() (Joyee Cheung) #51244

PR-URL: #51932
```

[richardlau](https://github.com/richardlau)

pushed a commit
that referenced
this pull request

[on Mar 25, 2024Mar 25, 2024](https://github.com/nodejs/node/pull/50960#ref-commit-a58c98e)

[![@joyeecheung](https://avatars.githubusercontent.com/u/4299420?s=40&u=d7eb2cf3db5f2a4df73a8f719c2e9e3d648e4e43&v=4)](https://github.com/joyeecheung)[![@richardlau](https://avatars.githubusercontent.com/u/5445507?s=40&v=4)](https://github.com/richardlau)

`
          src: print string content better in BlobDeserializer
`…

Verified

# Verified

This commit was signed with the committer’s **verified signature**.


[![](https://avatars.githubusercontent.com/u/5445507?s=64&v=4)](https://github.com/richardlau)[richardlau](https://github.com/richardlau)
Richard Lau


GPG key ID: C43CEC45C17AB93C

Verified
on Nov 6, 2024, 02:29 PM

[Learn about vigilant mode](https://docs.github.com/github/authenticating-to-github/displaying-verification-statuses-for-all-of-your-commits)

`
          a58c98e
`

```
When it's a short string, print it inline, otherwise print it
from a separate line. Also add the missing line breaks finally.

PR-URL: #50960
Refs: nodejs/single-executable#68
Reviewed-By: Antoine du Hamel <duhamelantoine1995@gmail.com>
Reviewed-By: Stephen Belanger <admin@stephenbelanger.com>
```

[richardlau](https://github.com/richardlau)

pushed a commit
that referenced
this pull request

[on Mar 25, 2024Mar 25, 2024](https://github.com/nodejs/node/pull/50960#ref-commit-db0efa3)

[![@joyeecheung](https://avatars.githubusercontent.com/u/4299420?s=40&u=d7eb2cf3db5f2a4df73a8f719c2e9e3d648e4e43&v=4)](https://github.com/joyeecheung)[![@richardlau](https://avatars.githubusercontent.com/u/5445507?s=40&v=4)](https://github.com/richardlau)

`
          sea: support embedding assets
`…

Verified

# Verified

This commit was signed with the committer’s **verified signature**.


[![](https://avatars.githubusercontent.com/u/5445507?s=64&v=4)](https://github.com/richardlau)[richardlau](https://github.com/richardlau)
Richard Lau


GPG key ID: C43CEC45C17AB93C

Verified
on Nov 6, 2024, 02:29 PM

[Learn about vigilant mode](https://docs.github.com/github/authenticating-to-github/displaying-verification-statuses-for-all-of-your-commits)

`
          db0efa3
`

````
With this patch:

Users can now include assets by adding a key-path dictionary
to the configuration as the `assets` field. At build time, Node.js
would read the assets from the specified paths and bundle them into
the preparation blob. In the generated executable, users can retrieve
the assets using the `sea.getAsset()` and `sea.getAssetAsBlob()` API.

```json
{
"main": "/path/to/bundled/script.js",
"output": "/path/to/write/the/generated/blob.blob",
"assets": {
    "a.jpg": "/path/to/a.jpg",
    "b.txt": "/path/to/b.txt"
}
}
```

The single-executable application can access the assets as follows:

```cjs
const { getAsset } = require('node:sea');
// Returns a copy of the data in an ArrayBuffer
const image = getAsset('a.jpg');
// Returns a string decoded from the asset as UTF8.
const text = getAsset('b.txt', 'utf8');
// Returns a Blob containing the asset.
const blob = getAssetAsBlob('a.jpg');
```

Drive-by: update the  documentation to include a section dedicated
to the injected main script and refer to it as "injected main
script" instead of "injected module" because it's a script, not
a module.

PR-URL: #50960
Refs: nodejs/single-executable#68
Reviewed-By: Antoine du Hamel <duhamelantoine1995@gmail.com>
Reviewed-By: Stephen Belanger <admin@stephenbelanger.com>
````

[richardlau](https://github.com/richardlau)

pushed a commit
that referenced
this pull request

[on Mar 25, 2024Mar 25, 2024](https://github.com/nodejs/node/pull/50960#ref-commit-eea0d74)

[![@joyeecheung](https://avatars.githubusercontent.com/u/4299420?s=40&u=d7eb2cf3db5f2a4df73a8f719c2e9e3d648e4e43&v=4)](https://github.com/joyeecheung)[![@richardlau](https://avatars.githubusercontent.com/u/5445507?s=40&v=4)](https://github.com/richardlau)

`
          sea: support sea.getRawAsset()
`…

Verified

# Verified

This commit was signed with the committer’s **verified signature**.


[![](https://avatars.githubusercontent.com/u/5445507?s=64&v=4)](https://github.com/richardlau)[richardlau](https://github.com/richardlau)
Richard Lau


GPG key ID: C43CEC45C17AB93C

Verified
on Nov 6, 2024, 02:29 PM

[Learn about vigilant mode](https://docs.github.com/github/authenticating-to-github/displaying-verification-statuses-for-all-of-your-commits)

`
          eea0d74
`

```
This patch adds support for `sea.getRawAsset()` which is
similar to `sea.getAsset()` but returns the raw asset
in an array buffer without copying. Users should avoid
writing to the returned array buffer. If the injected
section is not marked as writable or not aligned,
writing to the raw asset is likely to result in a crash.

PR-URL: #50960
Refs: nodejs/single-executable#68
Reviewed-By: Antoine du Hamel <duhamelantoine1995@gmail.com>
Reviewed-By: Stephen Belanger <admin@stephenbelanger.com>
```

[richardlau](https://github.com/richardlau)

added a commit
that referenced
this pull request

[on Mar 25, 2024Mar 25, 2024](https://github.com/nodejs/node/pull/50960#ref-commit-94fb854)

[![@richardlau](https://avatars.githubusercontent.com/u/5445507?s=40&u=4dc851f27fdfb6c2e287ccdb528977e722ed7760&v=4)](https://github.com/richardlau)

`
          2024-03-26, Version 20.12.0 'Iron' (LTS)
`…

Verified

# Verified

This commit was signed with the committer’s **verified signature**.


[![](https://avatars.githubusercontent.com/u/5445507?s=64&v=4)](https://github.com/richardlau)[richardlau](https://github.com/richardlau)
Richard Lau


GPG key ID: C43CEC45C17AB93C

Verified
on Nov 6, 2024, 12:17 PM

[Learn about vigilant mode](https://docs.github.com/github/authenticating-to-github/displaying-verification-statuses-for-all-of-your-commits)

`
          94fb854
`

```
Notable changes:

build:
  * (SEMVER-MINOR) build opt to set local location of headers (Michael Dawson) #51525
crypto:
  * (SEMVER-MINOR) implement crypto.hash() (Joyee Cheung) #51044
  * update root certificates to NSS 3.98 (Node.js GitHub Bot) #51794
doc:
  * add lemire to collaborators (Daniel Lemire) #51572
  * add zcbenz to collaborators (Cheng Zhao) #51812
lib:
  * (SEMVER-MINOR) move encodingsMap to internal/util (Joyee Cheung) #51044
sea:
  * (SEMVER-MINOR) support sea.getRawAsset() (Joyee Cheung) #50960
  * (SEMVER-MINOR) support embedding assets (Joyee Cheung) #50960
src:
  * (SEMVER-MINOR) print string content better in BlobDeserializer (Joyee Cheung) #50960
util:
  * (SEMVER-MINOR) add styleText API to text formatting (Rafael Gonzaga) #51850
vm:
  * (SEMVER-MINOR) support using the default loader to handle dynamic import() (Joyee Cheung) #51244

PR-URL: #52212
```

[![@richardlau](https://avatars.githubusercontent.com/u/5445507?s=40&u=4dc851f27fdfb6c2e287ccdb528977e722ed7760&v=4)](https://github.com/richardlau)[richardlau](https://github.com/richardlau)

mentioned this pull request
[on Mar 25, 2024Mar 25, 2024](https://github.com/nodejs/node/pull/50960#ref-pullrequest-2206634908)

[v20.12.0 proposal\\
#52212](https://github.com/nodejs/node/pull/52212)

Merged

[richardlau](https://github.com/richardlau)

added a commit
that referenced
this pull request

[on Mar 26, 2024Mar 26, 2024](https://github.com/nodejs/node/pull/50960#ref-commit-6d2d3f1)

[![@richardlau](https://avatars.githubusercontent.com/u/5445507?s=40&u=4dc851f27fdfb6c2e287ccdb528977e722ed7760&v=4)](https://github.com/richardlau)

`
          2024-03-26, Version 20.12.0 'Iron' (LTS)
`…

Verified

# Verified

This commit was signed with the committer’s **verified signature**.


[![](https://avatars.githubusercontent.com/u/5445507?s=64&v=4)](https://github.com/richardlau)[richardlau](https://github.com/richardlau)
Richard Lau


GPG key ID: C43CEC45C17AB93C

Verified
on Nov 7, 2024, 03:30 AM

[Learn about vigilant mode](https://docs.github.com/github/authenticating-to-github/displaying-verification-statuses-for-all-of-your-commits)

`
          6d2d3f1
`

```
Notable changes:

build:
  * (SEMVER-MINOR) build opt to set local location of headers (Michael Dawson) #51525
crypto:
  * (SEMVER-MINOR) implement crypto.hash() (Joyee Cheung) #51044
  * update root certificates to NSS 3.98 (Node.js GitHub Bot) #51794
doc:
  * add lemire to collaborators (Daniel Lemire) #51572
  * add zcbenz to collaborators (Cheng Zhao) #51812
lib:
  * (SEMVER-MINOR) move encodingsMap to internal/util (Joyee Cheung) #51044
sea:
  * (SEMVER-MINOR) support sea.getRawAsset() (Joyee Cheung) #50960
  * (SEMVER-MINOR) support embedding assets (Joyee Cheung) #50960
src:
  * (SEMVER-MINOR) print string content better in BlobDeserializer (Joyee Cheung) #50960
util:
  * (SEMVER-MINOR) add styleText API to text formatting (Rafael Gonzaga) #51850
vm:
  * (SEMVER-MINOR) support using the default loader to handle dynamic import() (Joyee Cheung) #51244

PR-URL: #52212
```

[![@CMCDragonkai](https://avatars.githubusercontent.com/u/640797?s=80&u=6c7a520f7ea51e48baa24d387b931b10601f6334&v=4)](https://github.com/CMCDragonkai)

### **[CMCDragonkai](https://github.com/CMCDragonkai)**     commented   [on May 17, 2024May 18, 2024](https://github.com/nodejs/node/pull/50960\#issuecomment-2118620076)


Copy link


Copy Markdown

|     |
| --- |
| Can this be used for native so binaries and then pass them somehow into process.dlopen? |

All reactions

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

[![@pipobscure](https://avatars.githubusercontent.com/u/446127?s=80&u=e6e0c69b84143e6259ee0901f942f0a92a8f1bf4&v=4)](https://github.com/pipobscure)

### **[pipobscure](https://github.com/pipobscure)**     commented   [on May 18, 2024May 18, 2024](https://github.com/nodejs/node/pull/50960\#issuecomment-2118730959)   via email


Copy link


Copy Markdown

Contributor

|     |
| --- |
| Yes that's how. Except you'll need to extract onto disk first because<br>dlopen requires a file.<br>[…](https://github.com/nodejs/node/pull/50960#)<br>On Sat, 18 May 2024, 04:26 Roger Qiu, \*\*\*@\*\*\*.\*\*\*> wrote:<br>Can this be used for native so binaries and then pass them somehow into<br>process.dlopen?<br>—<br>Reply to this email directly, view it on GitHub<br>< [#50960 (comment)](https://github.com/nodejs/node/pull/50960#issuecomment-2118620076) >, or<br>unsubscribe<br>< [https://github.com/notifications/unsubscribe-auth/AADM5LZKZPT3S46CQAQHFOTZC3C7BAVCNFSM6AAAAAA76SV46KVHI2DSMVQWIX3LMV43OSLTON2WKQ3PNVWWK3TUHMZDCMJYGYZDAMBXGY](https://github.com/notifications/unsubscribe-auth/AADM5LZKZPT3S46CQAQHFOTZC3C7BAVCNFSM6AAAAAA76SV46KVHI2DSMVQWIX3LMV43OSLTON2WKQ3PNVWWK3TUHMZDCMJYGYZDAMBXGY) ><br>.<br>You are receiving this because you commented.Message ID:<br>\*\*\*@\*\*\*.\*\*\*> |

All reactions

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

[![@CMCDragonkai](https://avatars.githubusercontent.com/u/640797?s=80&u=6c7a520f7ea51e48baa24d387b931b10601f6334&v=4)](https://github.com/CMCDragonkai)

### **[CMCDragonkai](https://github.com/CMCDragonkai)**     commented   [on May 18, 2024May 18, 2024](https://github.com/nodejs/node/pull/50960\#issuecomment-2118766017)


Copy link


Copy Markdown

|     |
| --- |
| What about the VFS idea? |

All reactions

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

[![@pipobscure](https://avatars.githubusercontent.com/u/446127?s=80&u=e6e0c69b84143e6259ee0901f942f0a92a8f1bf4&v=4)](https://github.com/pipobscure)

### **[pipobscure](https://github.com/pipobscure)**     commented   [on May 18, 2024May 18, 2024](https://github.com/nodejs/node/pull/50960\#issuecomment-2118783510)   via email


Copy link


Copy Markdown

Contributor

|     |
| --- |
| That will make it easy for most files, but native addons will still need to<br>be put on disk, because the dlopen os call simply requires it. VFS would<br>work if it's on yhe OS level (think kernel vfs). But that's outside the<br>scope of what node/sea could do.<br>[…](https://github.com/nodejs/node/pull/50960#)<br>On Sat, 18 May 2024, 11:27 Roger Qiu, \*\*\*@\*\*\*.\*\*\*> wrote:<br>What about the VFS idea?<br>—<br>Reply to this email directly, view it on GitHub<br>< [#50960 (comment)](https://github.com/nodejs/node/pull/50960#issuecomment-2118766017) >, or<br>unsubscribe<br>< [https://github.com/notifications/unsubscribe-auth/AADM5L6ZM2F7LABRUKRC65DZC4UJ5AVCNFSM6AAAAAA76SV46KVHI2DSMVQWIX3LMV43OSLTON2WKQ3PNVWWK3TUHMZDCMJYG43DMMBRG4](https://github.com/notifications/unsubscribe-auth/AADM5L6ZM2F7LABRUKRC65DZC4UJ5AVCNFSM6AAAAAA76SV46KVHI2DSMVQWIX3LMV43OSLTON2WKQ3PNVWWK3TUHMZDCMJYG43DMMBRG4) ><br>.<br>You are receiving this because you commented.Message ID:<br>\*\*\*@\*\*\*.\*\*\*> |

All reactions

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

[![@joyeecheung](https://avatars.githubusercontent.com/u/4299420?s=80&u=d7eb2cf3db5f2a4df73a8f719c2e9e3d648e4e43&v=4)](https://github.com/joyeecheung)

### **[joyeecheung](https://github.com/joyeecheung)**     commented   [on May 21, 2024May 21, 2024](https://github.com/nodejs/node/pull/50960\#issuecomment-2123509206)


Copy link


Copy Markdown

MemberAuthor

|     |
| --- |
| VFS would need to built on top of proper fs hooks which is related to SEA, but also there are many other use cases for such hooks, one previous proposal is [nodejs/single-executable#43](https://github.com/nodejs/single-executable/pull/43) (I think there are others, but can't find the links). |

All reactions

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/50960).

This file contains hidden or bidirectional Unicode text that may be interpreted or compiled differently than what appears below. To review, open the file in an editor that reveals hidden Unicode characters.
[Learn more about bidirectional Unicode characters](https://github.co/hiddenchars)

[Show hidden characters](https://github.com/nodejs/node/pull/50960)

[Sign up for free](https://github.com/join?source=comment-repo) **to join this conversation on GitHub**.
Already have an account?
[Sign in to comment](https://github.com/login?return_to=https%3A%2F%2Fgithub.com%2Fnodejs%2Fnode%2Fpull%2F50960)

### Reviewers

[![@GeoffreyBooth](https://avatars.githubusercontent.com/u/456802?s=40&v=4)](https://github.com/GeoffreyBooth)[GeoffreyBooth](https://github.com/GeoffreyBooth)GeoffreyBooth left review comments

[![@anonrig](https://avatars.githubusercontent.com/u/1935246?s=40&v=4)](https://github.com/anonrig)[anonrig](https://github.com/anonrig)anonrig left review comments

[![@Qard](https://avatars.githubusercontent.com/u/205482?s=40&v=4)](https://github.com/Qard)[Qard](https://github.com/Qard)Qard approved these changes

[![@aduh95](https://avatars.githubusercontent.com/u/14309773?s=40&v=4)](https://github.com/aduh95)[aduh95](https://github.com/aduh95)aduh95 approved these changes

+3 more reviewers


[![@pipobscure](https://avatars.githubusercontent.com/u/446127?s=40&v=4)](https://github.com/pipobscure)[pipobscure](https://github.com/pipobscure)pipobscure left review comments

[![@targos](https://avatars.githubusercontent.com/u/2352663?s=40&v=4)](https://github.com/targos)[targos](https://github.com/targos)targos left review comments

[![@pluris](https://avatars.githubusercontent.com/u/10344797?s=40&v=4)](https://github.com/pluris)[pluris](https://github.com/pluris)pluris left review comments

Reviewers whose approvals may not affect merge requirements

### Assignees

No one assigned

### Labels

[c++](https://github.com/nodejs/node/issues?q=state%3Aopen%20label%3Ac%2B%2B) Issues and PRs that require attention from people who are familiar with C++. [lib / src](https://github.com/nodejs/node/issues?q=state%3Aopen%20label%3A%22lib%20%2F%20src%22) Issues and PRs involving general changes in the lib/ or src/ directories. [needs-ci](https://github.com/nodejs/node/issues?q=state%3Aopen%20label%3Aneeds-ci) PRs that need a full CI run. [semver-minor](https://github.com/nodejs/node/issues?q=state%3Aopen%20label%3Asemver-minor) PRs that contain new features and should be released in the next minor version.

### Projects

None yet

### Milestone

No milestone

### Development

Successfully merging this pull request may close these issues.

None yet

### 10 participants

[![@joyeecheung](https://avatars.githubusercontent.com/u/4299420?s=52&v=4)](https://github.com/joyeecheung)[![@nodejs-github-bot](https://avatars.githubusercontent.com/u/18269663?s=52&v=4)](https://github.com/nodejs-github-bot)[![@targos](https://avatars.githubusercontent.com/u/2352663?s=52&v=4)](https://github.com/targos)[![@pipobscure](https://avatars.githubusercontent.com/u/446127?s=52&v=4)](https://github.com/pipobscure)[![@CMCDragonkai](https://avatars.githubusercontent.com/u/640797?s=52&v=4)](https://github.com/CMCDragonkai)[![@Qard](https://avatars.githubusercontent.com/u/205482?s=52&v=4)](https://github.com/Qard)[![@GeoffreyBooth](https://avatars.githubusercontent.com/u/456802?s=52&v=4)](https://github.com/GeoffreyBooth)[![@anonrig](https://avatars.githubusercontent.com/u/1935246?s=52&v=4)](https://github.com/anonrig)[![@pluris](https://avatars.githubusercontent.com/u/10344797?s=52&v=4)](https://github.com/pluris)[![@aduh95](https://avatars.githubusercontent.com/u/14309773?s=52&v=4)](https://github.com/aduh95)

Add this suggestion to a batch that can be applied as a single commit.This suggestion is invalid because no changes were made to the code.Suggestions cannot be applied while the pull request is closed.Suggestions cannot be applied while viewing a subset of changes.Only one suggestion per line can be applied in a batch.Add this suggestion to a batch that can be applied as a single commit.Applying suggestions on deleted lines is not supported.You must change the existing code in this line in order to create a valid suggestion.Outdated suggestions cannot be applied.This suggestion has been applied or marked resolved.Suggestions cannot be applied from pending reviews.Suggestions cannot be applied on multi-line comments.Suggestions cannot be applied while the pull request is queued to merge.Suggestion cannot be applied right now. Please check back later.

You can’t perform that action at this time.
