---
url: https://github.com/orgs/nodejs/discussions/4569
retrieved: 2026-09-22
command: firecrawl scrape https://github.com/orgs/nodejs/discussions/4569 --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Creating multi-platform/arch Single Executable Applications (SEA) · nodejs · Discussion #4569 · GitHub
---
[Skip to content](https://github.com/orgs/nodejs/discussions/4569#start-of-content)

You signed in with another tab or window. [Reload](https://github.com/orgs/nodejs/discussions/4569) to refresh your session.You signed out in another tab or window. [Reload](https://github.com/orgs/nodejs/discussions/4569) to refresh your session.You switched accounts on another tab or window. [Reload](https://github.com/orgs/nodejs/discussions/4569) to refresh your session.Dismiss alert

{{ message }}

# [![@nodejs](https://avatars.githubusercontent.com/u/9950313?s=60&v=4)\  Node.js](https://github.com/nodejs)

# Creating multi-platform/arch Single Executable Applications (SEA)  \#4569

Unanswered

[humphd](https://github.com/humphd)

asked this question in
[Q&A](https://github.com/orgs/nodejs/discussions/categories/q-a)

[Creating multi-platform/arch Single Executable Applications (SEA)](https://github.com/orgs/nodejs/discussions/4569#top)#4569

[![@humphd](https://avatars.githubusercontent.com/u/427398?s=40&v=4)\\
humphd](https://github.com/humphd)

on Mar 28, 2024Mar 28, 2024·
0 comments
·
5 replies


[Return to top](https://github.com/orgs/nodejs/discussions/4569#top)

Discussion options

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/orgs/nodejs/discussions/4569).

# {{title}}

Quote reply

## [![](https://avatars.githubusercontent.com/u/427398?s=64&v=4)\ humphd](https://github.com/humphd) [on Mar 28, 2024Mar 28, 2024](https://github.com/orgs/nodejs/discussions/4569\#discussion-8214507)

|     |
| --- |
| I'm using (and loving!) the new [node single executable applications](https://nodejs.org/api/single-executable-applications.html) feature to make a binary for my node CLI. Such a cool and useful feature, thank you.<br>I now need to create the same binary for multiple platforms/archs and I'm wondering if it's possible to do this all on my Linux machine; that is, can I create a Mac or Windows binary (possibly minus the code signing stuff)?<br>The process _appears_ to be mostly generic:<br>- create the `sea-config.json` file<br>- turn it into a blob with `node --experimental-sea-config sea-config.json` (question: does the `node` I use here have to be the same one I'll later inject into, or can I use my system node? Does this command do anything specific to a platform/arch or is the blob generic?)<br>- copy the node binary to use (I assume I could download a different node binary for another platform/arch here)<br>- remove the signature (not sure how I'd do this cross-platform)<br>- inject the blob into the binary with `npx postject`, with some tweaks per platform. I read the code for this, and `postject` appears to be able to determine the type of binary, so I assume this part can work on any binary type?<br>- sign the binary (again, not sure about this for cross-platform)<br>Thanks for helping me understand what is and isn't possible here. I could spin up multiple CI runners with specific platform/arch, but I'd love to be able to do this all from Linux if I can. |

1You must be logged in to vote

All reactions

## Replies:   0 comments  ·  5 replies

Comment options

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/orgs/nodejs/discussions/4569).

# {{title}}

Quote reply

### [![](https://avatars.githubusercontent.com/u/2276718?s=64&v=4)\ liudonghua123](https://github.com/liudonghua123) [on Mar 29, 2024Mar 29, 2024](https://github.com/orgs/nodejs/discussions/4569\#discussioncomment-8952621)

|     |
| --- |
| I love this feature, I wrote a simple cli app named [`node-sea`](https://github.com/liudonghua123/node-sea/) to simplify the sea package work a few months ago, but it lacks of cross-compilation feature.<br>I also forked [`pkg`](https://github.com/liudonghua123/pkg/) to continue support node 20/21 and later which support the simlar feature. |

1You must be logged in to vote

All reactions

0 replies


Comment options

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/orgs/nodejs/discussions/4569).

# {{title}}

Quote reply

### [![](https://avatars.githubusercontent.com/u/427398?s=64&v=4)\ humphd](https://github.com/humphd) [on Mar 31, 2024Apr 1, 2024](https://github.com/orgs/nodejs/discussions/4569\#discussioncomment-8968106)   Author

|     |
| --- |
| [@liudonghua123](https://github.com/liudonghua123) it's great that you're working on keeping this stuff going. For the code signing bit, I recently found [https://github.com/mtrojnar/osslsigncode](https://github.com/mtrojnar/osslsigncode), which might be promising. |

1You must be logged in to vote

All reactions

0 replies


Comment options

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/orgs/nodejs/discussions/4569).

# {{title}}

Quote reply

### [![](https://avatars.githubusercontent.com/u/427398?s=64&v=4)\ humphd](https://github.com/humphd) [on Mar 31, 2024Apr 1, 2024](https://github.com/orgs/nodejs/discussions/4569\#discussioncomment-8968119)   Author

|     |
| --- |
| [https://github.com/indygreg/apple-platform-rs](https://github.com/indygreg/apple-platform-rs) also looks interesting |

1You must be logged in to vote

All reactions

0 replies


Comment options

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/orgs/nodejs/discussions/4569).

# {{title}}

Quote reply

### [![](https://avatars.githubusercontent.com/u/427398?s=64&v=4)\ humphd](https://github.com/humphd) [on Mar 31, 2024Apr 1, 2024](https://github.com/orgs/nodejs/discussions/4569\#discussioncomment-8968207)   Author

|     |
| --- |
| So it seems like with some combination of [https://gregoryszorc.com/docs/apple-codesign/main/](https://gregoryszorc.com/docs/apple-codesign/main/) and [https://github.com/mtrojnar/osslsigncode](https://github.com/mtrojnar/osslsigncode), it should be possible to do this all from a Linux machine. |

1You must be logged in to vote

All reactions

0 replies


Comment options

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/orgs/nodejs/discussions/4569).

# {{title}}

Quote reply

### [![](https://avatars.githubusercontent.com/u/1565155?s=64&v=4)\ mkhurramali](https://github.com/mkhurramali) [on Mar 15, 2025Mar 15, 2025](https://github.com/orgs/nodejs/discussions/4569\#discussioncomment-12509840)

|     |
| --- |
| I have posted a webpack plugin here: [https://www.npmjs.com/package/sea-webpack-plugin](https://www.npmjs.com/package/sea-webpack-plugin)<br>This does cross-platform builds for the sea applications and has a docker you can use to do code signing. |

1You must be logged in to vote

All reactions

0 replies


[Sign up for free](https://github.com/join?source=comment-repo) **to join this conversation on GitHub**.
Already have an account?
[Sign in to comment](https://github.com/login?return_to=https%3A%2F%2Fgithub.com%2Forgs%2Fnodejs%2Fdiscussions%2F4569)

Category


[🙏\\
\\
Q&A](https://github.com/orgs/nodejs/discussions/categories/q-a)

Labels


None yet


3 participants


[![@humphd](https://avatars.githubusercontent.com/u/427398?s=48&v=4)](https://github.com/humphd)[![@mkhurramali](https://avatars.githubusercontent.com/u/1565155?s=48&v=4)](https://github.com/mkhurramali)[![@liudonghua123](https://avatars.githubusercontent.com/u/2276718?s=48&v=4)](https://github.com/liudonghua123)

Heading

Bold

Italic

Quote

Code

Link

* * *

Numbered list

Unordered list

Task list

* * *

Attach files

Mention

Reference

# Select a reply

Loading

[Create a new saved reply](https://github.com/orgs/nodejs/discussions/4569)

👍1 reacted with thumbs up emoji👎1 reacted with thumbs down emoji😄1 reacted with laugh emoji🎉1 reacted with hooray emoji😕1 reacted with confused emoji❤️1 reacted with heart emoji🚀1 reacted with rocket emoji👀1 reacted with eyes emoji

You can’t perform that action at this time.
