---
url: https://github.com/nodejs/single-executable/discussions/17
retrieved: 2026-09-21
command: firecrawl scrape https://github.com/nodejs/single-executable/discussions/17 --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Bundling of non-binary assets within the binaries · nodejs/single-executable · Discussion #17 · GitHub
---
[Skip to content](https://github.com/nodejs/single-executable/discussions/17#start-of-content)

You signed in with another tab or window. [Reload](https://github.com/nodejs/single-executable/discussions/17) to refresh your session.You signed out in another tab or window. [Reload](https://github.com/nodejs/single-executable/discussions/17) to refresh your session.You switched accounts on another tab or window. [Reload](https://github.com/nodejs/single-executable/discussions/17) to refresh your session.Dismiss alert

{{ message }}

[nodejs](https://github.com/nodejs)/ **[single-executable](https://github.com/nodejs/single-executable)** Public

- Sponsor







# Sponsor nodejs/single-executable























### Uh oh!







There was an error while loading. [Please reload this page](https://github.com/nodejs/single-executable/discussions/17).

- [Notifications](https://github.com/login?return_to=%2Fnodejs%2Fsingle-executable) You must be signed in to change notification settings
- [Fork\\
16](https://github.com/login?return_to=%2Fnodejs%2Fsingle-executable)
- [Star\\
395](https://github.com/login?return_to=%2Fnodejs%2Fsingle-executable)


# Bundling of non-binary assets within the binaries  \#17

[ovflowd](https://github.com/ovflowd)

started this conversation in
[General](https://github.com/nodejs/single-executable/discussions/categories/general)

[Bundling of non-binary assets within the binaries](https://github.com/nodejs/single-executable/discussions/17#top)#17

[![@ovflowd](https://avatars.githubusercontent.com/u/12037269?s=40&v=4)\\
ovflowd](https://github.com/ovflowd)

on Aug 18, 2022Aug 18, 2022·
8 comments
·
19 replies


[Return to top](https://github.com/nodejs/single-executable/discussions/17#top)

Discussion options

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/single-executable/discussions/17).

# {{title}}

Quote reply

## [![](https://avatars.githubusercontent.com/u/12037269?s=64&v=4)\ ovflowd](https://github.com/ovflowd) [on Aug 18, 2022Aug 18, 2022](https://github.com/nodejs/single-executable/discussions/17\#discussion-4313997)

|     |
| --- |
| I know this might be a silly discussion, as we're discussing right now of means to effectively bundle JavaScript within the binary (and still be able to sign it), one of the questions that often comes upon my mind is, what about some of the static assets.<br>At least for some Apps, e.g., Electron, I imagine you want to bundle a few assets within the Application manifest (or binary) instead of remote-loading them. (This is a practice even Chrome Extensions are doing since their Manifest v2, which allows bundled assets within the packaged CRX file.<br>For me, it is considered important to be able to attach these files in a reliably way because of scenarios like:<br>```<br>import myJsonFiles from '!binary/asset.json'<br>eval(myJsonFiles) // do something that could be risky<br>```<br>What I mean with this silly example is just about code-injection of non-signed sections of your binary, which could easily lead to CVEs of (For example, CWE-95) code injection.<br>Packaging, distributing and including these assets for me is something worth discussing.<br>What do you folks think about this topic? (What should be allowed to be bundled, and how much?) |

4You must be logged in to vote

All reactions

## Replies:   8 comments  ·  19 replies

Comment options

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/single-executable/discussions/17).

# {{title}}

Quote reply

### [![](https://avatars.githubusercontent.com/u/45469?s=64&v=4)\ ljharb](https://github.com/ljharb) [on Aug 18, 2022Aug 18, 2022](https://github.com/nodejs/single-executable/discussions/17\#discussioncomment-3423884)   Maintainer Sponsor

|     |
| --- |
| I would expect, effectively, that you can run something almost identical to `npm pack` \- respecting the same gitignore/files/npmignore rules - and produce an SEA that includes every file you care about. |

2You must be logged in to vote

❤️1

All reactions

- ❤️1

5 replies


[![@ovflowd](https://avatars.githubusercontent.com/u/12037269?s=60&v=4)](https://github.com/ovflowd)

Comment options

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/single-executable/discussions/17).

# {{title}}

Quote reply

#### [ovflowd](https://github.com/ovflowd) [on Aug 18, 2022Aug 18, 2022](https://github.com/nodejs/single-executable/discussions/17\#discussioncomment-3423898)   Author

|     |
| --- |
| Exactly! That's amazing; that's definitely what I was worried about. Thank you, [@ljharb](https://github.com/ljharb), for clearing that out :) |

All reactions

[![@arcanis](https://avatars.githubusercontent.com/u/1037931?s=60&v=4)](https://github.com/arcanis)

Comment options

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/single-executable/discussions/17).

# {{title}}

Quote reply

#### [arcanis](https://github.com/arcanis) [on Aug 18, 2022Aug 18, 2022](https://github.com/nodejs/single-executable/discussions/17\#discussioncomment-3423922)   Maintainer

|     |
| --- |
| > I would expect, effectively, that you can run something almost identical to `npm pack` \- respecting the same gitignore/files/npmignore rules - and produce an SEA that includes every file you care about.<br>Imo it's not Node's job to respect `files` / `npmignore` / whatever - especially given the various bugs that exist or got fixed in each package manager.<br>Rather, whatever tool is built should just support taking an existing tgz as input. |

All reactions

[![@ljharb](https://avatars.githubusercontent.com/u/45469?s=60&v=4)](https://github.com/ljharb)

Comment options

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/single-executable/discussions/17).

# {{title}}

Quote reply

#### [ljharb](https://github.com/ljharb) [on Aug 18, 2022Aug 18, 2022](https://github.com/nodejs/single-executable/discussions/17\#discussioncomment-3423935)   Maintainer Sponsor

|     |
| --- |
| That is a perfectly viable alternative - that would allow a user to run npm pack, and pass the resulting tarball into this tool. |

👍4

All reactions

- 👍4

[![@ovflowd](https://avatars.githubusercontent.com/u/12037269?s=60&v=4)](https://github.com/ovflowd)

Comment options

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/single-executable/discussions/17).

# {{title}}

Quote reply

#### [ovflowd](https://github.com/ovflowd) [on Aug 18, 2022Aug 18, 2022](https://github.com/nodejs/single-executable/discussions/17\#discussioncomment-3424164)   Author

|     |
| --- |
| Yup also agree; what I was more referring, to is that we're aiming to support assets. |

🚀1

All reactions

- 🚀1

[![@jviotti](https://avatars.githubusercontent.com/u/2192773?s=60&v=4)](https://github.com/jviotti)

Comment options

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/single-executable/discussions/17).

# {{title}}

Quote reply

edited

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/single-executable/discussions/17).

# {{editor}}'s edit

{{actor}} deleted this content
.

# {{editor}}'s edit

#### [jviotti](https://github.com/jviotti) [on Aug 18, 2022Aug 18, 2022](https://github.com/nodejs/single-executable/discussions/17\#discussioncomment-3425600)   Maintainer

|     |
| --- |
| > allow a user to run npm pack, and pass the resulting tarball into this tool.<br>This is a brilliant UX that we didn't consider. You are right, we shouldn't invent the same logic over and over again. This is a pretty cool way of outlining those responsibilities.<br>cc [@dsanders11](https://github.com/dsanders11) [@RaisinTen](https://github.com/RaisinTen) [@robertgzr](https://github.com/robertgzr) |

❤️1

All reactions

- ❤️1

Comment options

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/single-executable/discussions/17).

# {{title}}

Quote reply

### [![](https://avatars.githubusercontent.com/u/2192773?s=64&v=4)\ jviotti](https://github.com/jviotti) [on Aug 18, 2022Aug 18, 2022](https://github.com/nodejs/single-executable/discussions/17\#discussioncomment-3425571)   Maintainer

|     |
| --- |
| Hey [@ovflowd](https://github.com/ovflowd) ,<br>Yeah, this is definitely a feature we are making sure to support from day 1. Both the resource injector and the virtual file system components described in [https://github.com/nodejs/single-executable/blob/main/blog/2022-08-05-an-overview-of-the-current-state.md](https://github.com/nodejs/single-executable/blob/main/blog/2022-08-05-an-overview-of-the-current-state.md) are agnostic to the actual file contents that can be injected, which can definitely be non-JS assets like images too.<br>More precisely, [https://github.com/postmanlabs/postject](https://github.com/postmanlabs/postject) is able to inject arbitrary data as sections to the binary file, independently on what their contents are. Postject won't even attempt to read what is getting injected on it. From its point of view, it's just bytes. The virtual file system is essentially an archive format that also doesn't care about what it goes in it. We are taking Electron's ASAR as the main source of inspiration here, which can include images, JSON files, etc out of the box already.<br>As a matter of fact, one of the key reasons why we need a virtual file system to start with is to support these types of files. For pure JavaScript applications (that do not use any form of dynamic requires), we could bundle all the JS together and inject it without any notion of a VFS. Where as with a VFS, we can preserve arbitrary files and resolve require calls and `fs` invocations to them. |

1You must be logged in to vote

👍2❤️2

All reactions

- 👍2
- ❤️2

5 replies


[![@ovflowd](https://avatars.githubusercontent.com/u/12037269?s=60&v=4)](https://github.com/ovflowd)

Comment options

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/single-executable/discussions/17).

# {{title}}

Quote reply

edited

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/single-executable/discussions/17).

# {{editor}}'s edit

{{actor}} deleted this content
.

# {{editor}}'s edit

#### [ovflowd](https://github.com/ovflowd) [on Aug 18, 2022Aug 18, 2022](https://github.com/nodejs/single-executable/discussions/17\#discussioncomment-3426310)   Author

|     |
| --- |
| > From its point of view, it's just bytes.<br>Why is my head itching with encoding issues here? (Not code-encoding, but actual open-format encodings within the binary, such as PDF, PNGs, or anything that has its "own" encoding. I mean, I bet nothing that some headers that impose where the content of specific asset starts and ends can't solve, but I remember having some issues in the past with how different file-system encodings (weird, yes) would affect the bitwise operations when unpacking data. (I might just be saying bs, but who knows) |

All reactions

[![@jviotti](https://avatars.githubusercontent.com/u/2192773?s=60&v=4)](https://github.com/jviotti)

Comment options

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/single-executable/discussions/17).

# {{title}}

Quote reply

#### [jviotti](https://github.com/jviotti) [on Aug 18, 2022Aug 18, 2022](https://github.com/nodejs/single-executable/discussions/17\#discussioncomment-3427174)   Maintainer

|     |
| --- |
| Yeah, I hear what you are saying. I think those issues are solved by a proper archive format that is truly agnostic on what it is stored on it and doesn't rely on i.e. certain byte sequences not being part of the data, etc. ASARs from Electron match that description (it is essentially Tar + a table of contents for random access) and I have never heard any problems with it on this regard. I guess [@dsanders11](https://github.com/dsanders11) and [@RaisinTen](https://github.com/RaisinTen) can confirm (they are also in Electron's governance) |

👍1

All reactions

- 👍1

[![@cspotcode](https://avatars.githubusercontent.com/u/376504?s=60&v=4)](https://github.com/cspotcode)

Comment options

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/single-executable/discussions/17).

# {{title}}

Quote reply

#### [cspotcode](https://github.com/cspotcode) [on Aug 18, 2022Aug 18, 2022](https://github.com/nodejs/single-executable/discussions/17\#discussioncomment-3427320)

|     |
| --- |
| Pretty sure zip is effectively the same: (optionally) compressed blobs and a table of contents at the end. |

All reactions

[![@jviotti](https://avatars.githubusercontent.com/u/2192773?s=60&v=4)](https://github.com/jviotti)

Comment options

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/single-executable/discussions/17).

# {{title}}

Quote reply

#### [jviotti](https://github.com/jviotti) [on Aug 19, 2022Aug 19, 2022](https://github.com/nodejs/single-executable/discussions/17\#discussioncomment-3431587)   Maintainer

|     |
| --- |
| It is, indeed! [@arcanis](https://github.com/arcanis) has shared ZipFS with ( [https://github.com/nodejs/single-executable/blob/main/docs/existing-solutions.md](https://github.com/nodejs/single-executable/blob/main/docs/existing-solutions.md)), which is used in Yarn for very similar reasons.<br>There are various VFS implementations that are similar in concept but with certain differences, like ASAR and Zip. One of the key areas of work I want to do within this team is exhaustively list all the requirements needed for a VFS across SEA use cases and make sure we select (or create, though we rather select an existing one) solution. |

🚀1

All reactions

- 🚀1

[![@jviotti](https://avatars.githubusercontent.com/u/2192773?s=60&v=4)](https://github.com/jviotti)

Comment options

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/single-executable/discussions/17).

# {{title}}

Quote reply

#### [jviotti](https://github.com/jviotti) [on Aug 19, 2022Aug 19, 2022](https://github.com/nodejs/single-executable/discussions/17\#discussioncomment-3431652)   Maintainer

|     |
| --- |
| Looks like [@RaisinTen](https://github.com/RaisinTen) already kickstarted a discussion for it here: [#21](https://github.com/nodejs/single-executable/discussions/21) |

❤️1

All reactions

- ❤️1

Comment options

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/single-executable/discussions/17).

# {{title}}

Quote reply

### [![](https://avatars.githubusercontent.com/u/2192773?s=64&v=4)\ jviotti](https://github.com/jviotti) [on Aug 18, 2022Aug 18, 2022](https://github.com/nodejs/single-executable/discussions/17\#discussioncomment-3425589)   Maintainer

|     |
| --- |
| > What I mean with this silly example is just about code-injection of non-signed sections of your binary, which could easily lead to CVEs of (For example, CWE-95) code injection.<br>Exactly. This is the whole reason why [https://github.com/postmanlabs/postject](https://github.com/postmanlabs/postject) exists: security. We strongly believe any data injected into the binary must be within the boundaries of the binary and must be protected by code-signatures. This wouldn't be the case if we just appended the data at the tail of binary.<br>> What should be allowed to be bundled, and how much?<br>I don't think we should impose any limits. Even if specific operating systems have size limitations on i.e. binary sections, we can split the payload into N sections and inject them all with Postject still.<br>I guess the size limit is whatever practical upper bound your operating system imposes :D |

1You must be logged in to vote

❤️1

All reactions

- ❤️1

4 replies


[![@ovflowd](https://avatars.githubusercontent.com/u/12037269?s=60&v=4)](https://github.com/ovflowd)

Comment options

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/single-executable/discussions/17).

# {{title}}

Quote reply

#### [ovflowd](https://github.com/ovflowd) [on Aug 18, 2022Aug 18, 2022](https://github.com/nodejs/single-executable/discussions/17\#discussioncomment-3426294)   Author

|     |
| --- |
| > I don't think we should impose any limits. Even if specific operating systems have size limitations on i.e. binary sections, we can split the payload into N sections and inject them all with Postject still.<br>Yes, I was, let's say, worried about this part. I'm not 100% sure, as it's been ages, but afaik, there are some hypothetical limits of how big one binary might be, and how much can be allocated to the memory. But that's the kind of low-level stuff I don't know, but would expect someone from FreeDesktop or MSDN to know the answer. |

👍1

All reactions

- 👍1

[![@ovflowd](https://avatars.githubusercontent.com/u/12037269?s=60&v=4)](https://github.com/ovflowd)

Comment options

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/single-executable/discussions/17).

# {{title}}

Quote reply

#### [ovflowd](https://github.com/ovflowd) [on Aug 18, 2022Aug 18, 2022](https://github.com/nodejs/single-executable/discussions/17\#discussioncomment-3426298)   Author

|     |
| --- |
| > I guess the size limit is whatever practical upper bound your operating system imposes :D<br>I suppose we will validate during build-time that we're not extrapolating those bounds, right? |

All reactions

[![@jviotti](https://avatars.githubusercontent.com/u/2192773?s=60&v=4)](https://github.com/jviotti)

Comment options

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/single-executable/discussions/17).

# {{title}}

Quote reply

edited

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/single-executable/discussions/17).

# {{editor}}'s edit

{{actor}} deleted this content
.

# {{editor}}'s edit

#### [jviotti](https://github.com/jviotti) [on Aug 18, 2022Aug 18, 2022](https://github.com/nodejs/single-executable/discussions/17\#discussioncomment-3427189)   Maintainer

|     |
| --- |
| Maybe! We would have to do some research on this. Can you create a GitHub Issue for tracking this? I think these limits are definitely worth documenting in this repo for future reference, and we could add this item to the agenda for the first SEA team call that [@robertgzr](https://github.com/robertgzr) and [@RaisinTen](https://github.com/RaisinTen) will be kickstarting soon!<br>> I suppose we will validate during build-time that we're not extrapolating those bounds, right?<br>I think the answer to this is based on the results from the research. For example, if the theoretical limit is not fixed and is not of the binary format itself but on the characteristics of the machine executing the binary (i.e. RAM), then it might be better to not validate it. |

👍1

All reactions

- 👍1

[![@jviotti](https://avatars.githubusercontent.com/u/2192773?s=60&v=4)](https://github.com/jviotti)

Comment options

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/single-executable/discussions/17).

# {{title}}

Quote reply

#### [jviotti](https://github.com/jviotti) [on Aug 18, 2022Aug 18, 2022](https://github.com/nodejs/single-executable/discussions/17\#discussioncomment-3427221)   Maintainer

|     |
| --- |
| I wonder if [@dsanders11](https://github.com/dsanders11) already knows about these theoretical limits. I know he went SUPER deep on Mach-O, ELF and PE for Postject already :P |

All reactions

Comment options

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/single-executable/discussions/17).

# {{title}}

Quote reply

### [![](https://avatars.githubusercontent.com/u/90103025?s=64&v=4)\ BehranM](https://github.com/BehranM) [on Jun 15, 2024Jun 15, 2024](https://github.com/nodejs/single-executable/discussions/17\#discussioncomment-9782544)

|     |
| --- |
| I am researching the available sea solutions so that I can deploy my node.js app on my client's computer without the source code. I understand that node.js now supports single executables and I would like to try it. I have been reading the articles, discussions, etc. on node.js-sea but I have questions but I can't find the answers. For example, a web app isn't just the main node.js program, there are also ejs views, css files, mysql script files and so on. So, how do I go about bundling these into the single executable binary file? I keep reading the 'node.js-sea currently only supports running a single embedded script' in node.js-sea documentation, does this mean it doesn't allow bundling assets such as ejs views, etc.? |

2You must be logged in to vote

All reactions

3 replies


[![@RGdevz](https://avatars.githubusercontent.com/u/72873414?s=60&v=4)](https://github.com/RGdevz)

Comment options

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/single-executable/discussions/17).

# {{title}}

Quote reply

#### [RGdevz](https://github.com/RGdevz) [on Aug 11, 2024Aug 11, 2024](https://github.com/nodejs/single-executable/discussions/17\#discussioncomment-10305688)

|     |
| --- |
| i guess the only way to serve static files from inside the exe is to monkey patch the fs module to use the `getAsset` method from `node:sea`, like vercel `pkg` did and it could serve pages from inside the exe |

All reactions

[![@jstewart3802](https://avatars.githubusercontent.com/u/74548828?s=60&v=4)](https://github.com/jstewart3802)

Comment options

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/single-executable/discussions/17).

# {{title}}

Quote reply

#### [jstewart3802](https://github.com/jstewart3802) [on Aug 19, 2024Aug 19, 2024](https://github.com/nodejs/single-executable/discussions/17\#discussioncomment-10385620)

|     |
| --- |
| > i guess the only way to serve static files from inside the exe is to monkey patch the fs module to use the `getAsset` method from `node:sea`, like vercel `pkg` did and it could serve pages from inside the exe<br>Do you know of any easy ways to do this, as we are currently looking at doing this in a project and it seems like a bit of an impossible task without knowing how fs works in detail |

All reactions

[![@RGdevz](https://avatars.githubusercontent.com/u/72873414?s=60&v=4)](https://github.com/RGdevz)

Comment options

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/single-executable/discussions/17).

# {{title}}

Quote reply

#### [RGdevz](https://github.com/RGdevz) [on Aug 19, 2024Aug 19, 2024](https://github.com/nodejs/single-executable/discussions/17\#discussioncomment-10387544)

|     |
| --- |
| imo if you must have that functionality you can still you the `pkg` package from vercel its still working great in my projects, there is also more up to date version at [https://github.com/yao-pkg/pkg](https://github.com/yao-pkg/pkg) |

All reactions

Comment options

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/single-executable/discussions/17).

# {{title}}

Quote reply

### [![](https://avatars.githubusercontent.com/u/90103025?s=64&v=4)\ BehranM](https://github.com/BehranM) [on Aug 20, 2024Aug 20, 2024](https://github.com/nodejs/single-executable/discussions/17\#discussioncomment-10396526)

|     |
| --- |
| My understanding is that Vercel and other bundlers only bundle js code to<br>produce a single executable, correct me if I am wrong as I am not an<br>expert. However, in real life apps, in addition to the js code, there are<br>many non-js code such as node.js, html, jss, ejs, etc. My problem is that<br>since js/node.js is an interpreted language, I cannot compile them to<br>produce a single load module to execute. This forces me to share the source<br>code during deployment/implementation. My question to you is: Does Vercel<br>allow bundling of js code as well as non-js code, to produce a single<br>executable file? If so, that is great and I want to know how it is done.<br>Thanks.<br>Behran<br>[…](https://github.com/nodejs/single-executable/discussions/17#)<br>On Mon, Aug 19, 2024 at 9:44 PM RGdevz \*\*\*@\*\*\*.\*\*\*> wrote:<br>imo if you must have that functionality you can still you the pkg package<br>from vercel its still working great in my projects, there is also more up<br>to date version at [https://github.com/yao-pkg/pkg](https://github.com/yao-pkg/pkg)<br>—<br>Reply to this email directly, view it on GitHub<br>< [#17 (reply in thread)](https://github.com/nodejs/single-executable/discussions/17#discussioncomment-10387544) >,<br>or unsubscribe<br>< [https://github.com/notifications/unsubscribe-auth/AVPNZ4JMJ3LIOPJQUHBSJRDZSI4J3AVCNFSM6AAAAABJLZJOXKVHI2DSMVQWIX3LMV43URDJONRXK43TNFXW4Q3PNVWWK3TUHMYTAMZYG42TINA](https://github.com/notifications/unsubscribe-auth/AVPNZ4JMJ3LIOPJQUHBSJRDZSI4J3AVCNFSM6AAAAABJLZJOXKVHI2DSMVQWIX3LMV43URDJONRXK43TNFXW4Q3PNVWWK3TUHMYTAMZYG42TINA) ><br>.<br>You are receiving this because you commented.Message ID:<br>\*\*\*@\*\*\*.\*\*\*<br>com> |

1You must be logged in to vote

All reactions

1 reply


[![@RGdevz](https://avatars.githubusercontent.com/u/72873414?s=60&v=4)](https://github.com/RGdevz)

Comment options

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/single-executable/discussions/17).

# {{title}}

Quote reply

#### [RGdevz](https://github.com/RGdevz) [on Aug 20, 2024Aug 20, 2024](https://github.com/nodejs/single-executable/discussions/17\#discussioncomment-10400830)

|     |
| --- |
| Both node-sea and pkg let you embed files into single executable, the difference is that pkg patch the fs module so you can read files from the executable like you would read from the filesystem, there is example of express server in pkg repo to see example of how its works. |

All reactions

Comment options

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/single-executable/discussions/17).

# {{title}}

Quote reply

### [![](https://avatars.githubusercontent.com/u/90103025?s=64&v=4)\ BehranM](https://github.com/BehranM) [on Aug 21, 2024Aug 21, 2024](https://github.com/nodejs/single-executable/discussions/17\#discussioncomment-10404629)

|     |
| --- |
| That is great, I have not checked it out yet but I'll definitely do it.<br>Another question: To my knowledge, Vercel is a paid software whereas<br>node-sea is not. If they both do the same thing then does it make more<br>sense to use node-sea because it is free? Unfortunately, because node-sea<br>is new, there is not much information on the Internet regarding how to use<br>it.<br>[…](https://github.com/nodejs/single-executable/discussions/17#)<br>On Wed, Aug 21, 2024 at 1:23 AM RGdevz \*\*\*@\*\*\*.\*\*\*> wrote:<br>Both node-sea and pkg let you embed files into single executable, the<br>difference is that pkg patch the fs module so you can read files from the<br>executable like you would read from the filesystem, there is example of<br>express server in pkg repo to see example of how its works.<br>—<br>Reply to this email directly, view it on GitHub<br>< [#17 (reply in thread)](https://github.com/nodejs/single-executable/discussions/17#discussioncomment-10400830) >,<br>or unsubscribe<br>< [https://github.com/notifications/unsubscribe-auth/AVPNZ4JPKE3COSMZSVPYPQDZSO6WHAVCNFSM6AAAAABJLZJOXKVHI2DSMVQWIX3LMV43URDJONRXK43TNFXW4Q3PNVWWK3TUHMYTANBQGA4DGMA](https://github.com/notifications/unsubscribe-auth/AVPNZ4JPKE3COSMZSVPYPQDZSO6WHAVCNFSM6AAAAABJLZJOXKVHI2DSMVQWIX3LMV43URDJONRXK43TNFXW4Q3PNVWWK3TUHMYTANBQGA4DGMA) ><br>.<br>You are receiving this because you commented.Message ID:<br>\*\*\*@\*\*\*.\*\*\*<br>com> |

1You must be logged in to vote

All reactions

1 reply


[![@GabenGar](https://avatars.githubusercontent.com/u/87906913?s=60&v=4)](https://github.com/GabenGar)

Comment options

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/single-executable/discussions/17).

# {{title}}

Quote reply

#### [GabenGar](https://github.com/GabenGar) [on Aug 21, 2024Aug 21, 2024](https://github.com/nodejs/single-executable/discussions/17\#discussioncomment-10406016)

|     |
| --- |
| Vercel is not a "software", it's a company which sells a bunch of cloud services and `pkg` is just one of their packages. |

All reactions

Comment options

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/single-executable/discussions/17).

# {{title}}

Quote reply

### [![](https://avatars.githubusercontent.com/u/90103025?s=64&v=4)\ BehranM](https://github.com/BehranM) [on Aug 21, 2024Aug 21, 2024](https://github.com/nodejs/single-executable/discussions/17\#discussioncomment-10406188)

|     |
| --- |
| Thanks for the clarification. But it is still a paid service whereas<br>node-sea is free to my knowledge.<br>[…](https://github.com/nodejs/single-executable/discussions/17#)<br>On Wed, Aug 21, 2024 at 1:39 PM GabenGar \*\*\*@\*\*\*.\*\*\*> wrote:<br>Vercel is not a "software", it's a company which sells a bunch of cloud<br>services and pkg is just one of their packages.<br>—<br>Reply to this email directly, view it on GitHub<br>< [#17 (reply in thread)](https://github.com/nodejs/single-executable/discussions/17#discussioncomment-10406016) >,<br>or unsubscribe<br>< [https://github.com/notifications/unsubscribe-auth/AVPNZ4PJE556JKLY6QUQQ23ZSRU47AVCNFSM6AAAAABJLZJOXKVHI2DSMVQWIX3LMV43URDJONRXK43TNFXW4Q3PNVWWK3TUHMYTANBQGYYDCNQ](https://github.com/notifications/unsubscribe-auth/AVPNZ4PJE556JKLY6QUQQ23ZSRU47AVCNFSM6AAAAABJLZJOXKVHI2DSMVQWIX3LMV43URDJONRXK43TNFXW4Q3PNVWWK3TUHMYTANBQGYYDCNQ) ><br>.<br>You are receiving this because you commented.Message ID:<br>\*\*\*@\*\*\*.\*\*\*<br>com> |

1You must be logged in to vote

All reactions

0 replies


Comment options

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/single-executable/discussions/17).

# {{title}}

Quote reply

### [![](https://avatars.githubusercontent.com/u/90103025?s=64&v=4)\ BehranM](https://github.com/BehranM) [on Aug 21, 2024Aug 21, 2024](https://github.com/nodejs/single-executable/discussions/17\#discussioncomment-10408963)

|     |
| --- |
| RGdevz, you say I can use both node-sea and Vercel pkg for what I want to<br>do. I have researched the Internet re node-sea usage but found very little<br>info. Have you used node-sea and if so can you provide some details on how<br>to produce a single executable file from different code such as html, js,<br>node.js, css, ejs, etc. in my app? If not, I guess I will need to pay for<br>the Vercel pkg service and use it. I am a new node.js developer and this<br>will be my first time deploying an app to a hosting company server. So, a<br>detailed list of steps involved on how to do it will help me a great deal.<br>[…](https://github.com/nodejs/single-executable/discussions/17#)<br>On Wed, Aug 21, 2024 at 1:59 PM Behran Meydaner \*\*\*@\*\*\*.\*\*\*> wrote:<br>Thanks for the clarification. But it is still a paid service whereas<br>node-sea is free to my knowledge.<br>On Wed, Aug 21, 2024 at 1:39 PM GabenGar \*\*\*@\*\*\*.\*\*\*> wrote:<br>\> Vercel is not a "software", it's a company which sells a bunch of cloud<br>\> services and pkg is just one of their packages.<br>><br>> —<br>\> Reply to this email directly, view it on GitHub<br>\> < [#17 (reply in thread)](https://github.com/nodejs/single-executable/discussions/17#discussioncomment-10406016) >,<br>\> or unsubscribe<br>\> < [https://github.com/notifications/unsubscribe-auth/AVPNZ4PJE556JKLY6QUQQ23ZSRU47AVCNFSM6AAAAABJLZJOXKVHI2DSMVQWIX3LMV43URDJONRXK43TNFXW4Q3PNVWWK3TUHMYTANBQGYYDCNQ](https://github.com/notifications/unsubscribe-auth/AVPNZ4PJE556JKLY6QUQQ23ZSRU47AVCNFSM6AAAAABJLZJOXKVHI2DSMVQWIX3LMV43URDJONRXK43TNFXW4Q3PNVWWK3TUHMYTANBQGYYDCNQ) ><br>> .<br>\> You are receiving this because you commented.Message ID:<br>> \*\*\*@\*\*\*.\*\*\*<br>\> com><br>> |

1You must be logged in to vote

All reactions

0 replies


[Sign up for free](https://github.com/join?source=comment-repo) **to join this conversation on GitHub**.
Already have an account?
[Sign in to comment](https://github.com/login?return_to=https%3A%2F%2Fgithub.com%2Fnodejs%2Fsingle-executable%2Fdiscussions%2F17)

Category


[💬\\
\\
General](https://github.com/nodejs/single-executable/discussions/categories/general)

Labels


None yet


9 participants


[![@ovflowd](https://avatars.githubusercontent.com/u/12037269?s=48&v=4)](https://github.com/ovflowd)[![@ljharb](https://avatars.githubusercontent.com/u/45469?s=48&v=4)](https://github.com/ljharb)[![@cspotcode](https://avatars.githubusercontent.com/u/376504?s=48&v=4)](https://github.com/cspotcode)[![@arcanis](https://avatars.githubusercontent.com/u/1037931?s=48&v=4)](https://github.com/arcanis)[![@jviotti](https://avatars.githubusercontent.com/u/2192773?s=48&v=4)](https://github.com/jviotti)[![@RGdevz](https://avatars.githubusercontent.com/u/72873414?s=48&v=4)](https://github.com/RGdevz)[![@jstewart3802](https://avatars.githubusercontent.com/u/74548828?s=48&v=4)](https://github.com/jstewart3802)[![@GabenGar](https://avatars.githubusercontent.com/u/87906913?s=48&v=4)](https://github.com/GabenGar)[![@BehranM](https://avatars.githubusercontent.com/u/90103025?s=48&v=4)](https://github.com/BehranM)

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

[Create a new saved reply](https://github.com/nodejs/single-executable/discussions/17)

👍1 reacted with thumbs up emoji👎1 reacted with thumbs down emoji😄1 reacted with laugh emoji🎉1 reacted with hooray emoji😕1 reacted with confused emoji❤️1 reacted with heart emoji🚀1 reacted with rocket emoji👀1 reacted with eyes emoji

You can’t perform that action at this time.
