---
url: https://github.com/nodejs/node-v0.x-archive/issues/4159
retrieved: 2026-09-22
command: firecrawl scrape https://github.com/nodejs/node-v0.x-archive/issues/4159 --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: `Error: EEXIST, file already exists` on fs.openSync(fileName, "wx+") · Issue #4159 · nodejs/node-v0.x-archive
---
[Skip to content](https://github.com/nodejs/node-v0.x-archive/issues/4159#start-of-content)

You signed in with another tab or window. [Reload](https://github.com/nodejs/node-v0.x-archive/issues/4159) to refresh your session.You signed out in another tab or window. [Reload](https://github.com/nodejs/node-v0.x-archive/issues/4159) to refresh your session.You switched accounts on another tab or window. [Reload](https://github.com/nodejs/node-v0.x-archive/issues/4159) to refresh your session.Dismiss alert

{{ message }}

This repository was archived by the owner on Apr 22, 2023. It is now read-only.


[nodejs](https://github.com/nodejs)/ **[node-v0.x-archive](https://github.com/nodejs/node-v0.x-archive)** Public archive

- Sponsor







# Sponsor nodejs/node-v0.x-archive























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




[Report abuse](https://github.com/contact/report-abuse?report=nodejs%2Fnode-v0.x-archive+%28Repository+Funding+Links%29)

- [Notifications](https://github.com/login?return_to=%2Fnodejs%2Fnode-v0.x-archive) You must be signed in to change notification settings
- [Fork\\
7.2k](https://github.com/login?return_to=%2Fnodejs%2Fnode-v0.x-archive)
- [Star\\
34.3k](https://github.com/login?return_to=%2Fnodejs%2Fnode-v0.x-archive)


This repository was archived by the owner on Apr 22, 2023. It is now read-only.


# `Error: EEXIST, file already exists` on fs.openSync(fileName, "wx+")\#4159

Copy link

Copy link

Closed

Closed

[`Error: EEXIST, file already exists` on fs.openSync(fileName, "wx+")](https://github.com/nodejs/node-v0.x-archive/issues/4159#top)#4159

Copy link

## Description

[![@pygy](https://avatars.githubusercontent.com/u/54515?u=b3091d8543234ab43ceedae962b178688740b617&v=4&size=48)](https://github.com/pygy)

[pygy](https://github.com/pygy)

opened [on Oct 17, 2012on Oct 17, 2012](https://github.com/nodejs/node-v0.x-archive/issues/4159#issue-7669894)

Issue body actions

[According to the doc](http://nodejs.org/api/fs.html#fs_fs_open_path_flags_mode_callback), fs.openSync used with the "wx" and "wx+" flags should wipe a file if it already exists.

However, I get this error:

> { \[Error: EEXIST, file already exists 'theFile'\] errno: 47, code: 'EEXIST', path: 'theFile', syscall: 'open' }

The "w" and "w+" flags work as expected.

I'm using OS X 10.8.2, the filesystem is HFS+.

## Activity

### bnoordhuis commented on Oct 17, 2012on Oct 17, 2012

[![@bnoordhuis](https://avatars.githubusercontent.com/u/275871?v=4&size=48)](https://github.com/bnoordhuis)

[bnoordhuis](https://github.com/bnoordhuis)

[on Oct 17, 2012on Oct 17, 2012](https://github.com/nodejs/node-v0.x-archive/issues/4159#issuecomment-9545524)

Member

More actions

That's how it's supposed to work and it's documented as such:

```
Exclusive mode (O_EXCL) ensures that path is newly created. fs.open() fails if a file by that name already exists.
```

The documentation seems unambiguous enough to me but I'm open to suggestions.

[![](https://avatars.githubusercontent.com/u/275871?s=64&v=4)bnoordhuis](https://github.com/bnoordhuis)

closed this as [completed](https://github.com/nodejs/node-v0.x-archive/issues?q=is%3Aissue%20state%3Aclosed%20archived%3Afalse%20reason%3Acompleted) [on Oct 17, 2012on Oct 17, 2012](https://github.com/nodejs/node-v0.x-archive/issues/4159#event-27175868)

### pygy commented on Oct 17, 2012on Oct 17, 2012

[![@pygy](https://avatars.githubusercontent.com/u/54515?u=b3091d8543234ab43ceedae962b178688740b617&v=4&size=48)](https://github.com/pygy)

[pygy](https://github.com/pygy)

[on Oct 17, 2012on Oct 17, 2012](https://github.com/nodejs/node-v0.x-archive/issues/4159#issuecomment-9546150)

Author

More actions

I wasn't sure what the O\_EXCL was referring to.

What about this?:

> 'wx+' - Like 'w+' but opens the file in exclusive mode: the file is created if it does not exist, but an error is raised if it already does.

Also, why isn't it possible to open an existing file exclusively?

### bnoordhuis commented on Oct 18, 2012on Oct 18, 2012

[![@bnoordhuis](https://avatars.githubusercontent.com/u/275871?v=4&size=48)](https://github.com/bnoordhuis)

[bnoordhuis](https://github.com/bnoordhuis)

[on Oct 18, 2012on Oct 18, 2012](https://github.com/nodejs/node-v0.x-archive/issues/4159#issuecomment-9559540)

Member

More actions

If you send that as a pull request and fill in the CLA, I'll merge it.

> Also, why isn't it possible to open an existing file exclusively?

That's the point of exclusive mode, it either creates the file or it doesn't. It's to ensure that you're not stamping on the output of a concurrent process.

### rlidwka commented on Oct 21, 2012on Oct 21, 2012

[![@rlidwka](https://avatars.githubusercontent.com/u/999113?v=4&size=48)](https://github.com/rlidwka)

[rlidwka](https://github.com/rlidwka)

[on Oct 21, 2012on Oct 21, 2012](https://github.com/nodejs/node-v0.x-archive/issues/4159#issuecomment-9641571)

More actions

> I wasn't sure what the O\_EXCL was referring to. What about this?:

What _exclusive mode_ means is well-defined below. It is better to explain it in one place than copypaste it whenever _exclusive mode_ comes up, right?

> Also, why isn't it possible to open an existing file exclusively?

It is possible, see flock function from [fs-ext](https://github.com/baudehlo/node-fs-ext).

### pygy commented on Oct 22, 2012on Oct 22, 2012

[![@pygy](https://avatars.githubusercontent.com/u/54515?u=b3091d8543234ab43ceedae962b178688740b617&v=4&size=48)](https://github.com/pygy)

[pygy](https://github.com/pygy)

[on Oct 22, 2012on Oct 22, 2012](https://github.com/nodejs/node-v0.x-archive/issues/4159#issuecomment-9656050)

Author

More actions

> What _exclusive mode_ means is well-defined below. It is better to explain it in one place than copypaste it whenever exclusive mode comes up, right?

I had the following typed, but unposted in a tab somewhere (and thanks for the link...):

> > How about consolidating all exclusive options in one entry? They add clutter in their current form.
> >
> > > > `wx`, `wx+`, `ax`, `ax+` are the exclusive counterparts of the corresponding options without `x`. Exclusive means that the file is created if it does not exist, but an `EEXIST` error is raised if it already does. On POSIX systems, symlinks are not followed. Exclusive mode may or may not work with network file systems.
> > >
> > > That's the point of exclusive mode...
> >
> > I get it now... I had missed the `O_EXCL` explanation... What I'd like to do lock an existing file, though... Is is possible in Node?

### junosuarez commented on Dec 30, 2012on Dec 30, 2012

[![@junosuarez](https://avatars.githubusercontent.com/u/1106489?u=7cbd94ec29412a782379d18b080698aa22b66e0b&v=4&size=48)](https://github.com/junosuarez)

[junosuarez](https://github.com/junosuarez)

[on Dec 30, 2012on Dec 30, 2012](https://github.com/nodejs/node-v0.x-archive/issues/4159#issuecomment-11763177)

More actions

For what it's worth, I just ran into the same issue - didn't understand the intention of the documentation, but this thread cleared it up.

[Sign up for free](https://github.com/signup?return_to=https://github.com/nodejs/node-v0.x-archive/issues/4159)**to join this conversation on GitHub.** Already have an account? [Sign in to comment](https://github.com/login?return_to=https://github.com/nodejs/node-v0.x-archive/issues/4159)

## Metadata

## Metadata

### Assignees

No one assigned

### Labels

No labels

No labels

### Type

No type

### Projects

No projects

### Milestone

No milestone

### Relationships

None yet

### Development

No branches or pull requests

### Participants

[![@pygy](https://avatars.githubusercontent.com/u/54515?s=64&u=b3091d8543234ab43ceedae962b178688740b617&v=4)](https://github.com/pygy)[![@bnoordhuis](https://avatars.githubusercontent.com/u/275871?s=64&v=4)](https://github.com/bnoordhuis)[![@rlidwka](https://avatars.githubusercontent.com/u/999113?s=64&v=4)](https://github.com/rlidwka)[![@junosuarez](https://avatars.githubusercontent.com/u/1106489?s=64&u=7cbd94ec29412a782379d18b080698aa22b66e0b&v=4)](https://github.com/junosuarez)

## Issue actions

- ![](https://github.githubassets.com/assets/github-copilot-app-light-15ad5534265eeacd.svg)Open in GitHub Copilot app

You can’t perform that action at this time.
