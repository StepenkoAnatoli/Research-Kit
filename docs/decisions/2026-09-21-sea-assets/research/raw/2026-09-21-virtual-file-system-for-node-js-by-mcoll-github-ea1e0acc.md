---
url: https://github.com/nodejs/node/pull/61478
retrieved: 2026-09-21
command: firecrawl scrape https://github.com/nodejs/node/pull/61478 --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Virtual File System for Node.js by mcollina · Pull Request #61478 · nodejs/node
---
[Skip to content](https://github.com/nodejs/node/pull/61478#start-of-content)

You signed in with another tab or window. [Reload](https://github.com/nodejs/node/pull/61478) to refresh your session.You signed out in another tab or window. [Reload](https://github.com/nodejs/node/pull/61478) to refresh your session.You switched accounts on another tab or window. [Reload](https://github.com/nodejs/node/pull/61478) to refresh your session.Dismiss alert

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

[![@mcollina](https://avatars.githubusercontent.com/u/52195?s=80&v=4)](https://github.com/mcollina)

### ![@mcollina](https://avatars.githubusercontent.com/u/52195?s=48&v=4)**[mcollina](https://github.com/mcollina)**     commented   [on Jan 22Jan 22, 2026](https://github.com/nodejs/node/pull/61478\#issue-3844105706)•   edited      Loading          \#\#\# Uh oh!        There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).


Copy link


Copy Markdown

Member

A first-class virtual file system module (`node:vfs`) with a provider-based architecture that integrates with Node.js's fs module and module loader.

## Key Features

- **Provider Architecture** \- Extensible design with pluggable providers:
  - `MemoryProvider` \- In-memory file system with full read/write support
  - `SEAProvider` \- Read-only access to Single Executable Application assets
  - `VirtualProvider` \- Base class for creating custom providers
- **Standard fs API** \- Uses familiar `writeFileSync`, `readFileSync`, `mkdirSync` instead of custom methods

- **Mount Mode** \- VFS mounts at a specific path prefix (e.g., `/virtual`), clear separation from real filesystem

- **Module Loading** \- `require()` and `import` work seamlessly from virtual files

- **SEA Integration** \- Assets automatically mounted at `/sea` when running as a Single Executable Application

- **Full fs Support** \- readFile, stat, readdir, exists, streams, promises, glob, symlinks


## Example

```
const vfs = require('node:vfs');
const fs = require('node:fs');

// Create a VFS with default MemoryProvider
const myVfs = vfs.create();

// Use standard fs-like API
myVfs.mkdirSync('/app');
myVfs.writeFileSync('/app/config.json', '{"debug": true}');
myVfs.writeFileSync('/app/module.js', 'module.exports = "hello"');

// Mount to make accessible via fs module
myVfs.mount('/virtual');

// Works with standard fs APIs
const config = JSON.parse(fs.readFileSync('/virtual/app/config.json', 'utf8'));
const mod = require('/virtual/app/module.js');

// Cleanup
myVfs.unmount();
```

## SEA Usage

When running as a Single Executable Application, bundled assets are automatically available:

```
const fs = require('node:fs');

// Assets are automatically mounted at /sea - no setup required
const config = fs.readFileSync('/sea/config.json', 'utf8');
const template = fs.readFileSync('/sea/templates/index.html', 'utf8');
```

## Public API

```
const vfs = require('node:vfs');

vfs.create([provider][, options])  // Create a VirtualFileSystem
vfs.VirtualFileSystem              // The main VFS class
vfs.VirtualProvider                // Base class for custom providers
vfs.MemoryProvider                 // In-memory provider
vfs.SEAProvider                    // SEA assets provider (read-only)
```

* * *

Disclaimer: I've used a significant amount of Claude Code tokens to create this PR. I've reviewed all changes myself.

* * *

# F.A.Q.

## Why is this PR massive?

This PR is massive because the goal is to intercept all `fs` and `fs.promises` methods, as well as the module-loading system. This involves 164+ interception points inside existing Node.js functions.

By total churn (additions + deletions) as of 2026/03/23:

- Tests: 11,202 — 51.6%
- Code: 9,234 — 42.5%
- Docs: 1,281 — 5.9%

## Why was a significant portion of code generated by AI?

No one tackled this problem before because of its sheer size. AI made it possible.

Adding 164+ integrations points by hand is extremely laborious.

## Why was this PR not split into multiple chunks?

The key important part is to validate that the integration design is correct. It's extremely hard to separate that from its actual usage and avoid significant rework/integration.

## Should we put it behind a flag?

We could. The high-risk parts (the integration points) will still be exercised, even if they are behind a flag.

_More questions will be added as they pop up_

* * *

# Review Guide

Bottom-up walkthrough of the Virtual File System implementation. If you only care about the interception points, you should read subsections 3, 4, and 6.

## 1\. Data model

**[`provider.js`](https://github.com/mcollina/node/blob/vfs/lib/internal/vfs/provider.js)** —

`VirtualProvider` is the abstract storage backend. Subclasses implement

`open`, `stat`, `readdir`, `mkdir`, `rmdir`, `unlink`, `rename` (sync + async pairs).

Derived operations (`readFile`, `writeFile`, `copyFile`, `access`, `realpath`, …)

are built on top. Three flags control optional features: `readonly`, `supportsSymlinks`, `supportsWatch`.

**[`file_handle.js`](https://github.com/mcollina/node/blob/vfs/lib/internal/vfs/file_handle.js)** —

`VirtualFileHandle` is per-open-file state with `read`/`write`/`stat`/`truncate`/`close`

(sync + async). `MemoryFileHandle` extends it with a `Buffer` backend and geometric

doubling for writes.

**[`providers/memory.js`](https://github.com/mcollina/node/blob/vfs/lib/internal/vfs/providers/memory.js)** —

Default provider. Tree of `MemoryEntry` nodes (file, dir, symlink). Supports hard links,

symlinks with cycle detection, lazy `populate` callbacks, dynamic `contentProvider` functions,

and irreversible `setReadOnly()`.

**[`providers/real.js`](https://github.com/mcollina/node/blob/vfs/lib/internal/vfs/providers/real.js)** —

Wraps a real directory, re-mounted at a different prefix. Prevents traversal outside `rootPath`.

## 2\. VirtualFileSystem

**[`file_system.js`](https://github.com/mcollina/node/blob/vfs/lib/internal/vfs/file_system.js)** —

User-facing class (via [`node:vfs`](https://github.com/mcollina/node/blob/vfs/lib/vfs.js)).

Wraps a provider, adds mount/unmount lifecycle and path translation.

`mount('/prefix')` registers the VFS, triggers handler installation on first mount.

`unmount()` deregisters, clears handlers if last VFS, flushes CJS caches.

Exposes the full `node:fs` surface (sync, callback, promise) with automatic path translation.

## 3\. Injection: setup.js

**[`setup.js`](https://github.com/mcollina/node/blob/vfs/lib/internal/vfs/setup.js)** —

Central wiring. `createVfsHandlers()` returns a frozen object with a method for every

intercepted fs operation. Every method returns `undefined` to fall through to the real fs,

or a value/Promise for VFS-handled paths.

Registration flow: `registerVFS()` → push to `activeVFSList` → first mount calls

`installHooks()` → `createVfsHandlers()` \+ `setVfsHandlers()` \+ module loader overrides.

Deregistration reverses this and clears CJS path caches.

**Design note: per-function hooks** — VFS uses per-function handler objects

rather than a Proxy or dispatch table. This avoids adding overhead to every

`fs` call when no VFS is active (`vfsState.handlers === null` is a single

null-check). New `fs` APIs that should be VFS-aware must add a corresponding

hook in `createVfsHandlers()` (setup.js).

## 4\. fs integration

**[`lib/internal/fs/utils.js`](https://github.com/mcollina/node/blob/vfs/lib/internal/fs/utils.js)** —

Holds `vfsState = { handlers: null }`. Every fs function checks `handlers !== null`.

**[`lib/fs.js`](https://github.com/mcollina/node/blob/vfs/lib/fs.js)** —

Callback/sync functions use `vfsVoid(promise, cb)` and `vfsResult(promise, cb)` to bridge

VFS promises into callbacks. Multi-value callbacks (read/write/readv/writev) use inline

`PromisePrototypeThen`. Sync functions check for `undefined` return from sync handlers.

**[`lib/internal/fs/promises.js`](https://github.com/mcollina/node/blob/vfs/lib/internal/fs/promises.js)** —

Same `undefined`-check pattern inside `async` functions.

Only `glob()`/`globSync()` are not intercepted.

## 5\. Virtual file descriptors

**[`fd.js`](https://github.com/mcollina/node/blob/vfs/lib/internal/vfs/fd.js)** —

VFS FDs start at 10,000 (no collision with OS FDs). `openVirtualFd()` allocates,

`getVirtualFd()` looks up, `closeVirtualFd()` deletes. Every FD-based fs function

calls `getVirtualFd(fd)` — returns `VirtualFD` or `undefined` (fall through).

## 6\. Module loader

**[`lib/internal/modules/helpers.js`](https://github.com/mcollina/node/blob/vfs/lib/internal/modules/helpers.js)** —

Wrapper functions (`loaderStat`, `loaderReadFile`, `loaderRealpath`, `loaderReadPackageJSON`, …)

that check a VFS override before falling through to native C++ bindings. `null` by default

(zero overhead); `setup.js` installs overrides via `setLoaderFsOverrides()` and

`setLoaderPackageOverrides()` on first mount. CJS and ESM loaders both go through these wrappers.

## 7\. Streams and watchers

**[`streams.js`](https://github.com/mcollina/node/blob/vfs/lib/internal/vfs/streams.js)** —

`VirtualReadStream` (Readable) and `VirtualWriteStream` (Writable), same events as real-fs streams.

**[`watcher.js`](https://github.com/mcollina/node/blob/vfs/lib/internal/vfs/watcher.js)** —

Polling-based (no OS notifications for in-memory files). `VFSWatcher` for `fs.watch()`,

`VFSStatWatcher` for `fs.watchFile()`, `VFSWatchAsyncIterable` for `fs.promises.watch()`.

## 8\. SEA integration

**[`src/node_sea.cc`](https://github.com/mcollina/node/blob/vfs/src/node_sea.cc)** —

`"useVfs": true` in SEA config sets `kEnableVfs` flag (bit 5 of `SeaFlags`).

Assets are serialized into the blob; main script auto-included. C++ bindings expose

`isVfsEnabled()`, `getAsset()`, `getAssetKeys()` via `internalBinding('sea')`.

**[`lib/internal/vfs/providers/sea.js`](https://github.com/mcollina/node/blob/vfs/lib/internal/vfs/providers/sea.js)** —

Read-only provider backed by executable memory (zero-copy via `getAsset()`).

Automatically derives directory structure from asset key paths.

**[`lib/internal/main/embedding.js`](https://github.com/mcollina/node/blob/vfs/lib/internal/main/embedding.js)** —

Calls `initSeaVfs()` before running main script. Mounts at `/sea`, rewrites CJS entry

to `/sea/<main>` so `require()` and relative paths work through VFS hooks from the start.

## 9\. Mocking with overlay mode

**[`file_system.js`](https://github.com/mcollina/node/blob/vfs/lib/internal/vfs/file_system.js)** —

`vfs.create({ overlay: true })` enables overlay mode: the VFS only intercepts paths that

exist inside it, everything else falls through to the real filesystem. This turns VFS into

a surgical mocking layer — mount at a real directory, write the files you want to replace,

and leave the rest untouched.

```
const myVfs = vfs.create({ overlay: true });
myVfs.writeFileSync('/config.json', '{"env":"test"}');
myVfs.writeFileSync('/lib/db.js', 'module.exports = { query: () => [] }');
myVfs.mount('/app');

fs.readFileSync('/app/config.json');  // returns VFS content
fs.readFileSync('/app/index.js');     // falls through to real fs
require('/app/lib/db.js');            // loads the mocked module
```

The key mechanism is `shouldHandle()`: in overlay mode it calls `statSync()` on the provider

before claiming the path. Non-overlay mode claims all paths under the mount prefix.

This works across `require()`, `import`, workers (`virtualCwd: true`), and all `node:fs` APIs.

## 10\. `node:test` mock.fs()

**[`lib/internal/test_runner/mock/mock.js`](https://github.com/mcollina/node/blob/vfs/lib/internal/test_runner/mock/mock.js)** —

`t.mock.fs()` is the test-runner integration. It creates an overlay-mode VFS with

`moduleHooks: true`, mounts it, and returns a `MockFSContext` that auto-restores

when the test ends (via `t.mock` cleanup).

```
test('reads config from virtual file', (t) => {
  t.mock.fs({
    prefix: '/app',
    files: {
      '/config.json': '{"env":"test"}',
      '/lib/utils.js': 'module.exports = { sum: (a, b) => a + b }',
    },
  });

  assert.strictEqual(fs.readFileSync('/app/config.json', 'utf8'), '{"env":"test"}');
  assert.strictEqual(require('/app/lib/utils.js').sum(1, 2), 3);
  // auto-unmounts after test
});
```

`MockFSContext` exposes `addFile()`, `addDirectory()`, `existsSync()`, and `restore()`

for dynamic manipulation. The underlying `vfs` property gives direct access to the

`VirtualFileSystem` instance. Multiple `mock.fs()` calls can coexist with different prefixes.

* * *

Fixes [#60021](https://github.com/nodejs/node/issues/60021)

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).

👍90juliangruber, jdaison, JoshuaKGoldberg, derekr, trivikr, franklin-tina, ematipico, mary-ext, Ocean-OS, sxzz, and 80 more reacted with thumbs up emoji👎39mdrews93, clux, lharby, Palleas, Jak2k, zardoz03, sammypanda, wolfskaempf, gurleensethi-docker, leegee, and 29 more reacted with thumbs down emoji😄4gameroman, lc-nyovchev, Treycos, and D-Alessian reacted with laugh emoji🎉39JakobJingleheimer, araujogui, marco-ippolito, darcyrush, lishaduck, JoshuaKGoldberg, FoxxMD, franklin-tina, ematipico, Ocean-OS, and 29 more reacted with hooray emoji❤️42JoshuaKGoldberg, franklin-tina, MarkSFrancis, aewing, tkh44, aaronccasanova, SuperOleg39, fengmk2, metcoder95, ttessarolo, and 32 more reacted with heart emoji🚀40MoLow, Qard, atlowChemi, pmarchini, ronag, lishaduck, JoshuaKGoldberg, derekr, FoxxMD, franklin-tina, and 30 more reacted with rocket emoji👀25juanarbol, Qard, avivkeller, pmarchini, ronag, Tango992, sheremet-va, franklin-tina, ematipico, Ocean-OS, and 15 more reacted with eyes emoji

All reactions

- 👍90 reactions
- 👎39 reactions
- 😄4 reactions
- 🎉39 reactions
- ❤️42 reactions
- 🚀40 reactions
- 👀25 reactions

[![@nodejs-github-bot](https://avatars.githubusercontent.com/u/18269663?s=80&u=2197410af2ccd267740fb3d7f2a275a2ec371fed&v=4)](https://github.com/nodejs-github-bot)

### **[nodejs-github-bot](https://github.com/nodejs-github-bot)**     commented   [on Jan 22Jan 22, 2026](https://github.com/nodejs/node/pull/61478\#issuecomment-3785910141)


Copy link


Copy Markdown

Collaborator

|     |
| --- |
| Review requested:<br>- [ ]  @nodejs/single-executable<br>- [ ]  @nodejs/test\_runner |

All reactions

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).

[![@nodejs-github-bot](https://avatars.githubusercontent.com/u/18269663?s=40&u=2197410af2ccd267740fb3d7f2a275a2ec371fed&v=4)](https://github.com/nodejs-github-bot)[nodejs-github-bot](https://github.com/nodejs-github-bot)

added
[lib / src](https://github.com/nodejs/node/issues?q=state%3Aopen%20label%3A%22lib%20%2F%20src%22) Issues and PRs involving general changes in the lib/ or src/ directories. [needs-ci](https://github.com/nodejs/node/issues?q=state%3Aopen%20label%3Aneeds-ci) PRs that need a full CI run.

labels

[on Jan 22Jan 22, 2026](https://github.com/nodejs/node/pull/61478#event-22223107717)

[![@mcollina](https://avatars.githubusercontent.com/u/52195?s=40&v=4)](https://github.com/mcollina)

[mcollina](https://github.com/mcollina)

requested review from
[Ethan-Arrowood](https://github.com/Ethan-Arrowood),
[RaisinTen](https://github.com/RaisinTen),
[avivkeller](https://github.com/avivkeller) and
[joyeecheung](https://github.com/joyeecheung) [8 months agoJanuary 22, 2026 18:04](https://github.com/nodejs/node/pull/61478#event-22223114799)

[![@avivkeller](https://avatars.githubusercontent.com/u/38299977?s=40&u=88aefc5a0e292a8e7147d1941c70fcc8a4153da6&v=4)](https://github.com/avivkeller)[avivkeller](https://github.com/avivkeller)

added
[fs](https://github.com/nodejs/node/issues?q=state%3Aopen%20label%3Afs) Issues and PRs related to file-system APIs and the fs module. [module](https://github.com/nodejs/node/issues?q=state%3Aopen%20label%3Amodule) Issues and PRs related to the module subsystem. [semver-minor](https://github.com/nodejs/node/issues?q=state%3Aopen%20label%3Asemver-minor) PRs that contain new features and should be released in the next minor version. [notable-change](https://github.com/nodejs/node/issues?q=state%3Aopen%20label%3Anotable-change) PRs with changes that should be highlighted in changelogs. [needs-benchmark-ci](https://github.com/nodejs/node/issues?q=state%3Aopen%20label%3Aneeds-benchmark-ci) PRs that need a benchmark CI run. [test\_runner](https://github.com/nodejs/node/issues?q=state%3Aopen%20label%3Atest_runner) Issues and PRs related to the test runner subsystem.

labels

[on Jan 22Jan 22, 2026](https://github.com/nodejs/node/pull/61478#event-22223269205)

[![@github-actions](https://avatars.githubusercontent.com/in/15368?s=80&v=4)](https://github.com/apps/github-actions)

### **[github-actions](https://github.com/apps/github-actions) Bot**     commented   [on Jan 22Jan 22, 2026](https://github.com/nodejs/node/pull/61478\#issuecomment-3785943353)


Copy link


Copy Markdown

Contributor

|     |
| --- |
| The <br>[notable-change](https://github.com/nodejs/node/labels/notable-change) PRs with changes that should be highlighted in changelogs.<br>label has been added by [@avivkeller](https://github.com/avivkeller).<br>Please suggest a text for the release notes if you'd like to include a more detailed summary, then proceed to update the PR description with the text or a link to the notable change suggested text comment. Otherwise, the commit will be placed in the _Other Notable Changes_ section. |

All reactions

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).

[![@Ethan-Arrowood](https://avatars.githubusercontent.com/u/16144158?s=80&u=efe94d1560f0f6b631024f3bf39415459c0a11a8&v=4)](https://github.com/Ethan-Arrowood)

### **[Ethan-Arrowood](https://github.com/Ethan-Arrowood)**     commented   [on Jan 22Jan 22, 2026](https://github.com/nodejs/node/pull/61478\#issuecomment-3786089744)


Copy link


Copy Markdown

Contributor

|     |
| --- |
| Nice! This is a great addition. Since it's such a large PR, this will take me some time to review. Will try to tackle it over the next week. |

👍8avivkeller, pmarchini, ruyadorno, steida, DryhoppedIPA, JakobJingleheimer, disarticulate, and arikon reacted with thumbs up emoji👎3mdrews93, ochnios, and Hastaroth1 reacted with thumbs down emoji

All reactions

- 👍8 reactions
- 👎3 reactions

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).

[![avivkeller](https://avatars.githubusercontent.com/u/38299977?s=60&v=4)](https://github.com/avivkeller)

**[avivkeller](https://github.com/avivkeller)**

reviewed

[on Jan 22Jan 22, 2026](https://github.com/nodejs/node/pull/61478#pullrequestreview-3693867054)

[View reviewed changes](https://github.com/nodejs/node/pull/61478/files)

Comment thread[lib/internal/test\_runner/mock/mock.js](https://github.com/nodejs/node/pull/61478/files#diff-87fe4fbfd23996c49072c2fb88829aaa0ed1be188b9da9d072471b0a523cd1c8)
Outdated

|     |     |     |
| --- | --- | --- |
|  |  | \*/ |
|  |  | existsSync(path) { |
|  |  | // Prepend prefix to path for VFS lookup |
|  |  | const fullPath = this.#prefix + (StringPrototypeStartsWith(path, '/') ? path : '/' + path); |

### ![@avivkeller](https://avatars.githubusercontent.com/u/38299977?s=48&v=4)**[avivkeller](https://github.com/avivkeller)** [on Jan 22Jan 22, 2026](https://github.com/nodejs/node/pull/61478\#discussion_r2718052427)


Copy link


Copy Markdown

Member

There was a problem hiding this comment.

### Choose a reason for hiding this comment

The reason will be displayed to describe this comment to others. [Learn more](https://docs.github.com/articles/managing-disruptive-comments/#hiding-a-comment).


Choose a reason
SpamAbuseOff TopicOutdatedDuplicateResolvedLow QualityHide comment

Can we use path.join?

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).

All reactions

Comment thread[lib/internal/test\_runner/mock/mock.js](https://github.com/nodejs/node/pull/61478/files#diff-87fe4fbfd23996c49072c2fb88829aaa0ed1be188b9da9d072471b0a523cd1c8)
Outdated
Show resolvedHide resolved

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).

Comment thread[lib/internal/test\_runner/mock/mock.js](https://github.com/nodejs/node/pull/61478/files#diff-87fe4fbfd23996c49072c2fb88829aaa0ed1be188b9da9d072471b0a523cd1c8)
Outdated

|     |     |     |
| --- | --- | --- |
|  |  | validateObject(files, 'options.files'); |
|  |  | } |
|  |  |  |
|  |  | const { VirtualFileSystem } = require('internal/vfs/virtual\_fs'); |

### ![@avivkeller](https://avatars.githubusercontent.com/u/38299977?s=48&v=4)**[avivkeller](https://github.com/avivkeller)** [on Jan 22Jan 22, 2026](https://github.com/nodejs/node/pull/61478\#discussion_r2718060676)


Copy link


Copy Markdown

Member

There was a problem hiding this comment.

### Choose a reason for hiding this comment

The reason will be displayed to describe this comment to others. [Learn more](https://docs.github.com/articles/managing-disruptive-comments/#hiding-a-comment).


Choose a reason
SpamAbuseOff TopicOutdatedDuplicateResolvedLow QualityHide comment

Shouldn't we import this at the top level / lazy load it at the top level?

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).

All reactions

Comment thread[lib/internal/test\_runner/mock/mock.js](https://github.com/nodejs/node/pull/61478/files#diff-87fe4fbfd23996c49072c2fb88829aaa0ed1be188b9da9d072471b0a523cd1c8)
Outdated

|     |     |     |
| --- | --- | --- |
|  |  | ArrayPrototypePush(this.#mocks, { |
|  |  | \_\_proto\_\_: null, |
|  |  | ctx, |
|  |  | restore: restoreFS, |

### ![@avivkeller](https://avatars.githubusercontent.com/u/38299977?s=48&v=4)**[avivkeller](https://github.com/avivkeller)** [on Jan 22Jan 22, 2026](https://github.com/nodejs/node/pull/61478\#discussion_r2718062744)


Copy link


Copy Markdown

Member

There was a problem hiding this comment.

### Choose a reason for hiding this comment

The reason will be displayed to describe this comment to others. [Learn more](https://docs.github.com/articles/managing-disruptive-comments/#hiding-a-comment).


Choose a reason
SpamAbuseOff TopicOutdatedDuplicateResolvedLow QualityHide comment

Suggested change


|     |     |
| --- | --- |
|  | restore: restoreFS, |
|  | restore: ctx.restore, |

nit

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).

All reactions

Comment thread[lib/internal/vfs/entries.js](https://github.com/nodejs/node/pull/61478/files#diff-92ca8ec759f9d692ae4b8dc7aec6826061dca6e8c0a164b8db0d4f9cadee3adb)
Outdated

|     |     |     |
| --- | --- | --- |
|  |  | \\* @param {object} \[options\] Optional configuration |
|  |  | \*/ |
|  |  | addFile(name, content, options) { |
|  |  | const path = this.\_directory.path + '/' + name; |

### ![@avivkeller](https://avatars.githubusercontent.com/u/38299977?s=48&v=4)**[avivkeller](https://github.com/avivkeller)** [on Jan 22Jan 22, 2026](https://github.com/nodejs/node/pull/61478\#discussion_r2718069663)


Copy link


Copy Markdown

Member

There was a problem hiding this comment.

### Choose a reason for hiding this comment

The reason will be displayed to describe this comment to others. [Learn more](https://docs.github.com/articles/managing-disruptive-comments/#hiding-a-comment).


Choose a reason
SpamAbuseOff TopicOutdatedDuplicateResolvedLow QualityHide comment

Can we use `path.join`?

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).

All reactions

30 hidden conversations

Load more…


Comment thread[lib/internal/vfs/virtual\_fs.js](https://github.com/nodejs/node/pull/61478/files#diff-75f73c0639a709ce1f431f4e1e93421906584c444b64d92500ffd14d66aae7d7)
Outdated

|     |     |     |
| --- | --- | --- |
|  |  | let entry = current.getEntry(segment); |
|  |  | if (!entry) { |
|  |  | // Auto-create parent directory |
|  |  | const dirPath = '/' + segments.slice(0, i + 1).join('/'); |

### ![@avivkeller](https://avatars.githubusercontent.com/u/38299977?s=48&v=4)**[avivkeller](https://github.com/avivkeller)** [on Jan 22Jan 22, 2026](https://github.com/nodejs/node/pull/61478\#discussion_r2718145724)


Copy link


Copy Markdown

Member

There was a problem hiding this comment.

### Choose a reason for hiding this comment

The reason will be displayed to describe this comment to others. [Learn more](https://docs.github.com/articles/managing-disruptive-comments/#hiding-a-comment).


Choose a reason
SpamAbuseOff TopicOutdatedDuplicateResolvedLow QualityHide comment

Let's use `path.join`

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).

All reactions

Comment thread[lib/internal/vfs/virtual\_fs.js](https://github.com/nodejs/node/pull/61478/files#diff-75f73c0639a709ce1f431f4e1e93421906584c444b64d92500ffd14d66aae7d7)
Outdated

|     |     |     |
| --- | --- | --- |
|  |  | let entry = current.getEntry(segment); |
|  |  | if (!entry) { |
|  |  | // Auto-create parent directory |
|  |  | const parentPath = '/' + segments.slice(0, i + 1).join('/'); |

### ![@avivkeller](https://avatars.githubusercontent.com/u/38299977?s=48&v=4)**[avivkeller](https://github.com/avivkeller)** [on Jan 22Jan 22, 2026](https://github.com/nodejs/node/pull/61478\#discussion_r2718148075)


Copy link


Copy Markdown

Member

There was a problem hiding this comment.

### Choose a reason for hiding this comment

The reason will be displayed to describe this comment to others. [Learn more](https://docs.github.com/articles/managing-disruptive-comments/#hiding-a-comment).


Choose a reason
SpamAbuseOff TopicOutdatedDuplicateResolvedLow QualityHide comment

`path.join`?

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).

All reactions

Comment thread[lib/internal/vfs/virtual\_fs.js](https://github.com/nodejs/node/pull/61478/files#diff-75f73c0639a709ce1f431f4e1e93421906584c444b64d92500ffd14d66aae7d7)
Outdated

|     |     |     |
| --- | --- | --- |
|  |  | } |
|  |  | } |
|  |  | callback(null, content); |
|  |  | }).catch((err) => { |

### ![@avivkeller](https://avatars.githubusercontent.com/u/38299977?s=48&v=4)**[avivkeller](https://github.com/avivkeller)** [on Jan 22Jan 22, 2026](https://github.com/nodejs/node/pull/61478\#discussion_r2718151542)


Copy link


Copy Markdown

Member

There was a problem hiding this comment.

### Choose a reason for hiding this comment

The reason will be displayed to describe this comment to others. [Learn more](https://docs.github.com/articles/managing-disruptive-comments/#hiding-a-comment).


Choose a reason
SpamAbuseOff TopicOutdatedDuplicateResolvedLow QualityHide comment

Suggested change


|     |     |
| --- | --- |
|  | }).catch((err)=>{ |
|  | },(err)=>{ |

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).

All reactions

Comment thread[lib/internal/vfs/virtual\_fs.js](https://github.com/nodejs/node/pull/61478/files#diff-75f73c0639a709ce1f431f4e1e93421906584c444b64d92500ffd14d66aae7d7)
Outdated

Comment on lines


+676
to
+677


|     |     |     |
| --- | --- | --- |
|  |  | const bytesToRead = Math.min(length, available); |
|  |  | content.copy(buffer, offset, readPos, readPos + bytesToRead); |

### ![@avivkeller](https://avatars.githubusercontent.com/u/38299977?s=48&v=4)**[avivkeller](https://github.com/avivkeller)** [on Jan 22Jan 22, 2026](https://github.com/nodejs/node/pull/61478\#discussion_r2718156256)


Copy link


Copy Markdown

Member

There was a problem hiding this comment.

### Choose a reason for hiding this comment

The reason will be displayed to describe this comment to others. [Learn more](https://docs.github.com/articles/managing-disruptive-comments/#hiding-a-comment).


Choose a reason
SpamAbuseOff TopicOutdatedDuplicateResolvedLow QualityHide comment

Primordials?

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).

All reactions

Comment thread[lib/internal/vfs/virtual\_fs.js](https://github.com/nodejs/node/pull/61478/files#diff-75f73c0639a709ce1f431f4e1e93421906584c444b64d92500ffd14d66aae7d7)
Outdated

|     |     |     |
| --- | --- | --- |
|  |  | } |
|  |  |  |
|  |  | callback(null, bytesToRead, buffer); |
|  |  | }).catch((err) => { |

### ![@avivkeller](https://avatars.githubusercontent.com/u/38299977?s=48&v=4)**[avivkeller](https://github.com/avivkeller)** [on Jan 22Jan 22, 2026](https://github.com/nodejs/node/pull/61478\#discussion_r2718157450)


Copy link


Copy Markdown

Member

There was a problem hiding this comment.

### Choose a reason for hiding this comment

The reason will be displayed to describe this comment to others. [Learn more](https://docs.github.com/articles/managing-disruptive-comments/#hiding-a-comment).


Choose a reason
SpamAbuseOff TopicOutdatedDuplicateResolvedLow QualityHide comment

Suggested change


|     |     |
| --- | --- |
|  | }).catch((err)=>{ |
|  | },(err)=>{ |

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).

All reactions

[![@avivkeller](https://avatars.githubusercontent.com/u/38299977?s=80&u=88aefc5a0e292a8e7147d1941c70fcc8a4153da6&v=4)](https://github.com/avivkeller)

### **[avivkeller](https://github.com/avivkeller)**     commented   [on Jan 22Jan 22, 2026](https://github.com/nodejs/node/pull/61478\#issuecomment-3786109476)


Copy link


Copy Markdown

Member

|     |
| --- |
| Left an initial review, but like [@Ethan-Arrowood](https://github.com/Ethan-Arrowood) said, it'll take time for a more in depth look |

❤️1mcollina reacted with heart emoji

All reactions

- ❤️1 reaction

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).

[![@joyeecheung](https://avatars.githubusercontent.com/u/4299420?s=80&u=d7eb2cf3db5f2a4df73a8f719c2e9e3d648e4e43&v=4)](https://github.com/joyeecheung)

### **[joyeecheung](https://github.com/joyeecheung)**     commented   [on Jan 22Jan 22, 2026](https://github.com/nodejs/node/pull/61478\#issuecomment-3786113623)•   edited      Loading          \#\#\# Uh oh!        There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).


Copy link


Copy Markdown

Member

|     |
| --- |
| It's nice to see some momentum in this area, though from a first glance it seems the design has largely overlooked the feedback from real world use cases collected 4 years ago: [https://github.com/nodejs/single-executable/blob/main/docs/virtual-file-system-requirements.md](https://github.com/nodejs/single-executable/blob/main/docs/virtual-file-system-requirements.md) \- I think it's worth checking that the API satisfies the constraints that users of this feature have provided, to not waste the work that have been done by prior contributors to gather them, or having to reinvent it later (possibly in a breaking manner) to satisfy these requirements from real world use cases. |

❤️18dbjorge, airtonix, pimterry, ruyadorno, TheOneTheOnlyJJ, EricMCornelius, koresar, ovflowd, thegu5, rla, and 8 more reacted with heart emoji👀3MoLow, fox1t, and TheOneTheOnlyJJ reacted with eyes emoji

All reactions

- ❤️18 reactions
- 👀3 reactions

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).

[![@codecov](https://avatars.githubusercontent.com/in/254?s=80&v=4)](https://github.com/apps/codecov)

### **[codecov](https://github.com/apps/codecov) Bot**     commented   [on Jan 22Jan 22, 2026](https://github.com/nodejs/node/pull/61478\#issuecomment-3786272052)•   edited      Loading          \#\#\# Uh oh!        There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).


Copy link


Copy Markdown

| ## [Codecov](https://app.codecov.io/gh/nodejs/node/pull/61478?dropdown=coverage&src=pr&el=h1&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=nodejs) Report

❌ Patch coverage is `92.31874%` with `695 lines` in your changes missing coverage. Please review.

✅ Project coverage is 89.80%. Comparing base ( [`e0928d6`](https://app.codecov.io/gh/nodejs/node/commit/e0928d6cc46adbc02ae15733d6fd62e6a524ffd6?dropdown=coverage&el=desc&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=nodejs)) to head ( [`b8cf57c`](https://app.codecov.io/gh/nodejs/node/commit/b8cf57cc0970a577cd955493c06fecf623bdf48b?dropdown=coverage&el=desc&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=nodejs)).

⚠️ Report is 55 commits behind head on main.

| [Files with missing lines](https://app.codecov.io/gh/nodejs/node/pull/61478?dropdown=coverage&src=pr&el=tree&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=nodejs) | Patch % | Lines |
| --- | --- | --- |
| [lib/internal/vfs/setup.js](https://app.codecov.io/gh/nodejs/node/pull/61478?src=pr&el=tree&filepath=lib%2Finternal%2Fvfs%2Fsetup.js&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=nodejs#diff-bGliL2ludGVybmFsL3Zmcy9zZXR1cC5qcw==) | 84.95% | [169 Missing and 1 partial ⚠️](https://app.codecov.io/gh/nodejs/node/pull/61478?src=pr&el=tree&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=nodejs) |
| [lib/internal/vfs/providers/real.js](https://app.codecov.io/gh/nodejs/node/pull/61478?src=pr&el=tree&filepath=lib%2Finternal%2Fvfs%2Fproviders%2Freal.js&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=nodejs#diff-bGliL2ludGVybmFsL3Zmcy9wcm92aWRlcnMvcmVhbC5qcw==) | 74.79% | [124 Missing ⚠️](https://app.codecov.io/gh/nodejs/node/pull/61478?src=pr&el=tree&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=nodejs) |
| [lib/internal/vfs/providers/memory.js](https://app.codecov.io/gh/nodejs/node/pull/61478?src=pr&el=tree&filepath=lib%2Finternal%2Fvfs%2Fproviders%2Fmemory.js&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=nodejs#diff-bGliL2ludGVybmFsL3Zmcy9wcm92aWRlcnMvbWVtb3J5Lmpz) | 89.94% | [100 Missing and 3 partials ⚠️](https://app.codecov.io/gh/nodejs/node/pull/61478?src=pr&el=tree&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=nodejs) |
| [lib/internal/vfs/watcher.js](https://app.codecov.io/gh/nodejs/node/pull/61478?src=pr&el=tree&filepath=lib%2Finternal%2Fvfs%2Fwatcher.js&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=nodejs#diff-bGliL2ludGVybmFsL3Zmcy93YXRjaGVyLmpz) | 91.69% | [52 Missing and 3 partials ⚠️](https://app.codecov.io/gh/nodejs/node/pull/61478?src=pr&el=tree&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=nodejs) |
| [lib/internal/vfs/file\_system.js](https://app.codecov.io/gh/nodejs/node/pull/61478?src=pr&el=tree&filepath=lib%2Finternal%2Fvfs%2Ffile_system.js&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=nodejs#diff-bGliL2ludGVybmFsL3Zmcy9maWxlX3N5c3RlbS5qcw==) | 96.18% | [54 Missing ⚠️](https://app.codecov.io/gh/nodejs/node/pull/61478?src=pr&el=tree&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=nodejs) |
| [lib/internal/vfs/file\_handle.js](https://app.codecov.io/gh/nodejs/node/pull/61478?src=pr&el=tree&filepath=lib%2Finternal%2Fvfs%2Ffile_handle.js&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=nodejs#diff-bGliL2ludGVybmFsL3Zmcy9maWxlX2hhbmRsZS5qcw==) | 93.30% | [49 Missing ⚠️](https://app.codecov.io/gh/nodejs/node/pull/61478?src=pr&el=tree&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=nodejs) |
| [lib/internal/vfs/streams.js](https://app.codecov.io/gh/nodejs/node/pull/61478?src=pr&el=tree&filepath=lib%2Finternal%2Fvfs%2Fstreams.js&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=nodejs#diff-bGliL2ludGVybmFsL3Zmcy9zdHJlYW1zLmpz) | 91.86% | [27 Missing ⚠️](https://app.codecov.io/gh/nodejs/node/pull/61478?src=pr&el=tree&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=nodejs) |
| [lib/internal/vfs/stats.js](https://app.codecov.io/gh/nodejs/node/pull/61478?src=pr&el=tree&filepath=lib%2Finternal%2Fvfs%2Fstats.js&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=nodejs#diff-bGliL2ludGVybmFsL3Zmcy9zdGF0cy5qcw==) | 91.66% | [21 Missing and 4 partials ⚠️](https://app.codecov.io/gh/nodejs/node/pull/61478?src=pr&el=tree&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=nodejs) |
| [lib/internal/vfs/provider.js](https://app.codecov.io/gh/nodejs/node/pull/61478?src=pr&el=tree&filepath=lib%2Finternal%2Fvfs%2Fprovider.js&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=nodejs#diff-bGliL2ludGVybmFsL3Zmcy9wcm92aWRlci5qcw==) | 96.11% | [20 Missing and 4 partials ⚠️](https://app.codecov.io/gh/nodejs/node/pull/61478?src=pr&el=tree&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=nodejs) |
| [src/node\_sea.cc](https://app.codecov.io/gh/nodejs/node/pull/61478?src=pr&el=tree&filepath=src%2Fnode_sea.cc&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=nodejs#diff-c3JjL25vZGVfc2VhLmNj) | 64.28% | [12 Missing and 8 partials ⚠️](https://app.codecov.io/gh/nodejs/node/pull/61478?src=pr&el=tree&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=nodejs) |
| ... and [10 more](https://app.codecov.io/gh/nodejs/node/pull/61478?src=pr&el=tree-more&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=nodejs) |  |  |

Additional details and impacted files

```
@@            Coverage Diff             @@
##             main   #61478      +/-   ##
==========================================
+ Coverage   89.68%   89.80%   +0.11%
==========================================
  Files         676      692      +16
  Lines      206555   215773    +9218
  Branches    39552    41299    +1747
==========================================
+ Hits       185249   193767    +8518
- Misses      13444    14118     +674
- Partials     7862     7888      +26
```

| [Files with missing lines](https://app.codecov.io/gh/nodejs/node/pull/61478?dropdown=coverage&src=pr&el=tree&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=nodejs) | Coverage Δ |  |
| --- | --- | --- |
| [lib/internal/bootstrap/realm.js](https://app.codecov.io/gh/nodejs/node/pull/61478?src=pr&el=tree&filepath=lib%2Finternal%2Fbootstrap%2Frealm.js&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=nodejs#diff-bGliL2ludGVybmFsL2Jvb3RzdHJhcC9yZWFsbS5qcw==) | `96.21% <100.00%> (+<0.01%)` | ⬆️ |
| [lib/internal/fs/utils.js](https://app.codecov.io/gh/nodejs/node/pull/61478?src=pr&el=tree&filepath=lib%2Finternal%2Ffs%2Futils.js&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=nodejs#diff-bGliL2ludGVybmFsL2ZzL3V0aWxzLmpz) | `99.68% <100.00%> (+<0.01%)` | ⬆️ |
| [lib/internal/modules/cjs/loader.js](https://app.codecov.io/gh/nodejs/node/pull/61478?src=pr&el=tree&filepath=lib%2Finternal%2Fmodules%2Fcjs%2Floader.js&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=nodejs#diff-bGliL2ludGVybmFsL21vZHVsZXMvY2pzL2xvYWRlci5qcw==) | `98.20% <100.00%> (+0.05%)` | ⬆️ |
| [lib/internal/modules/esm/get\_format.js](https://app.codecov.io/gh/nodejs/node/pull/61478?src=pr&el=tree&filepath=lib%2Finternal%2Fmodules%2Fesm%2Fget_format.js&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=nodejs#diff-bGliL2ludGVybmFsL21vZHVsZXMvZXNtL2dldF9mb3JtYXQuanM=) | `94.83% <100.00%> (ø)` |  |
| [lib/internal/modules/esm/load.js](https://app.codecov.io/gh/nodejs/node/pull/61478?src=pr&el=tree&filepath=lib%2Finternal%2Fmodules%2Fesm%2Fload.js&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=nodejs#diff-bGliL2ludGVybmFsL21vZHVsZXMvZXNtL2xvYWQuanM=) | `91.47% <100.00%> (ø)` |  |
| [lib/internal/modules/esm/resolve.js](https://app.codecov.io/gh/nodejs/node/pull/61478?src=pr&el=tree&filepath=lib%2Finternal%2Fmodules%2Fesm%2Fresolve.js&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=nodejs#diff-bGliL2ludGVybmFsL21vZHVsZXMvZXNtL3Jlc29sdmUuanM=) | `99.03% <100.00%> (-0.01%)` | ⬇️ |
| [lib/internal/modules/esm/translators.js](https://app.codecov.io/gh/nodejs/node/pull/61478?src=pr&el=tree&filepath=lib%2Finternal%2Fmodules%2Fesm%2Ftranslators.js&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=nodejs#diff-bGliL2ludGVybmFsL21vZHVsZXMvZXNtL3RyYW5zbGF0b3JzLmpz) | `97.67% <100.00%> (+<0.01%)` | ⬆️ |
| [lib/internal/modules/helpers.js](https://app.codecov.io/gh/nodejs/node/pull/61478?src=pr&el=tree&filepath=lib%2Finternal%2Fmodules%2Fhelpers.js&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=nodejs#diff-bGliL2ludGVybmFsL21vZHVsZXMvaGVscGVycy5qcw==) | `98.73% <100.00%> (+0.01%)` | ⬆️ |
| [lib/internal/modules/package\_json\_reader.js](https://app.codecov.io/gh/nodejs/node/pull/61478?src=pr&el=tree&filepath=lib%2Finternal%2Fmodules%2Fpackage_json_reader.js&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=nodejs#diff-bGliL2ludGVybmFsL21vZHVsZXMvcGFja2FnZV9qc29uX3JlYWRlci5qcw==) | `99.73% <100.00%> (+0.01%)` | ⬆️ |
| [lib/internal/vfs/errors.js](https://app.codecov.io/gh/nodejs/node/pull/61478?src=pr&el=tree&filepath=lib%2Finternal%2Fvfs%2Ferrors.js&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=nodejs#diff-bGliL2ludGVybmFsL3Zmcy9lcnJvcnMuanM=) | `100.00% <100.00%> (ø)` |  |
| ... and [28 more](https://app.codecov.io/gh/nodejs/node/pull/61478?src=pr&el=tree-more&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=nodejs) |  |  |

... and [42 files with indirect coverage changes](https://app.codecov.io/gh/nodejs/node/pull/61478/indirect-changes?src=pr&el=tree-more&utm_medium=referral&utm_source=github&utm_content=comment&utm_campaign=pr+comments&utm_term=nodejs)

🚀 New features to boost your workflow:

- ❄️ [Test Analytics](https://docs.codecov.com/docs/test-analytics): Detect flaky tests, report on failures, and find test suite problems.
- 📦 [JS Bundle Analysis](https://docs.codecov.com/docs/javascript-bundle-analysis): Save yourself from yourself by tracking and limiting bundle sizes in JS merges. |

All reactions

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).

[![@ljharb](https://avatars.githubusercontent.com/u/45469?s=40&v=4)](https://github.com/ljharb)[ljharb](https://github.com/ljharb)

mentioned this pull request
[on Jan 22Jan 22, 2026](https://github.com/nodejs/node/pull/61478#ref-pullrequest-3841322115)

[test\_runner: add experimental `mock.fs` API\\
#61468](https://github.com/nodejs/node/pull/61468)

Closed

[![@jimmywarting](https://avatars.githubusercontent.com/u/1148376?s=80&u=97348b862d4820275f7e7567ad64a72edfec1443&v=4)](https://github.com/jimmywarting)

### **[jimmywarting](https://github.com/jimmywarting)**     commented   [on Jan 22Jan 22, 2026](https://github.com/nodejs/node/pull/61478\#issuecomment-3787251287)•   edited      Loading          \#\#\# Uh oh!        There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).


Copy link


Copy Markdown

|     |
| --- |
| And why not something like OPFS aka whatwg/fs?<br>```<br>const rootHandle = await navigator.storage.getDirectory()<br>await rootHandle.getFileHandle('config.json', { create: true })<br>fs.mount('/app', rootHandle) // to make it work with fs<br>fs.readFileSync('/app/config.json')<br>```<br>OR<br>```<br>const rootHandle = await navigator.storage.getDirectory()<br>await rootHandle.getFileHandle('config.json', { create: true })<br>fs.readFileSync('sandbox:/config.json')<br>```<br>fs.createVirtual seems like something like a competing specification |

👍2WebReflection and xrh0905 reacted with thumbs up emoji

All reactions

- 👍2 reactions

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).

[![@mcollina](https://avatars.githubusercontent.com/u/52195?s=40&v=4)](https://github.com/mcollina)

[mcollina](https://github.com/mcollina) [force-pushed](https://github.com/nodejs/node/compare/5e317de1eb922c00fa8d51bda61a0313d89ddf76..977cc3d448bb2f0f745af9a4e2d424d14dfdaa2f)
the
vfs
branch
3 times, most recently
from
[`5e317de`](https://github.com/nodejs/node/commit/5e317de1eb922c00fa8d51bda61a0313d89ddf76) to
[`977cc3d`](https://github.com/nodejs/node/commit/977cc3d448bb2f0f745af9a4e2d424d14dfdaa2f) [Compare](https://github.com/nodejs/node/compare/5e317de1eb922c00fa8d51bda61a0313d89ddf76..977cc3d448bb2f0f745af9a4e2d424d14dfdaa2f) [8 months agoJanuary 23, 2026 08:15](https://github.com/nodejs/node/pull/61478#event-22236305984)

[![@mcollina](https://avatars.githubusercontent.com/u/52195?s=80&v=4)](https://github.com/mcollina)

### **[mcollina](https://github.com/mcollina)**     commented   [on Jan 23Jan 23, 2026](https://github.com/nodejs/node/pull/61478\#issuecomment-3789123018)


Copy link


Copy Markdown

MemberAuthor

|     |
| --- |
| > And why not something like OPFS aka whatwg/fs?<br>I generally prefer not to interleave with WHATWG specs as much as possible for core functionality (e.g., SEA). In my experience, they tend to perform poorly on our codebase and remove a few degrees of flexibility. (I also don't find much _fun_ in working on them, and I'm way less interested in contributing to that.)<br>On an implementation side, the core functionality of this feature will be _identical_ (technically, it's missing writes that OPFS supports), as we would need to impact all our internal fs methods anyway.<br>If this lands, we can certainly iterate on a WHATWG-compatible API for this, but I would not add this to this PR. |

👍5ljharb, ronag, benjamingr, paulocoghi, and TomasHubelbauer reacted with thumbs up emoji

All reactions

- 👍5 reactions

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).

[![@juliangruber](https://avatars.githubusercontent.com/u/10247?s=80&u=31e5ab15303029314e73615663bee650267bad7e&v=4)](https://github.com/juliangruber)

### **[juliangruber](https://github.com/juliangruber)**     commented   [on Jan 23Jan 23, 2026](https://github.com/nodejs/node/pull/61478\#issuecomment-3789374763)


Copy link


Copy Markdown

Member

|     |
| --- |
| Small prior art: [https://github.com/juliangruber/subfs](https://github.com/juliangruber/subfs) |

❤️3mcollina, bnb, and joesepi reacted with heart emoji

All reactions

- ❤️3 reactions

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).

[![@mcollina](https://avatars.githubusercontent.com/u/52195?s=40&v=4)](https://github.com/mcollina)

[mcollina](https://github.com/mcollina) [force-pushed](https://github.com/nodejs/node/compare/8d711c15f5442a59cf72d407f7925c9a6ca8f1f3..73c18cd1eaceb7c73d589ba49c33fba1eb1b7afa)
the
vfs
branch
2 times, most recently
from
[`8d711c1`](https://github.com/nodejs/node/commit/8d711c15f5442a59cf72d407f7925c9a6ca8f1f3) to
[`73c18cd`](https://github.com/nodejs/node/commit/73c18cd1eaceb7c73d589ba49c33fba1eb1b7afa) [Compare](https://github.com/nodejs/node/compare/8d711c15f5442a59cf72d407f7925c9a6ca8f1f3..73c18cd1eaceb7c73d589ba49c33fba1eb1b7afa) [8 months agoJanuary 23, 2026 13:19](https://github.com/nodejs/node/pull/61478#event-22242570075)

[![@Qard](https://avatars.githubusercontent.com/u/205482?s=80&u=de3265fd6a286e3e51965136cbe7a04bb9ec051a&v=4)](https://github.com/Qard)

### **[Qard](https://github.com/Qard)**     commented   [on Jan 23Jan 23, 2026](https://github.com/nodejs/node/pull/61478\#issuecomment-3791418840)•   edited      Loading          \#\#\# Uh oh!        There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).


Copy link


Copy Markdown

Member

|     |
| --- |
| I also worked on this a bit on the side recently: [Qard@ `73b8fc6`](https://github.com/Qard/node/commit/73b8fc69b685063af68e0bbed0ffd429439d8b50)<br>That is _very much_ in chaotic ideation stage with a bunch of LLM assistance to try some different ideas, but the broader concept I was aiming for was to have a `VirtualFileSystem` type which would actually implement the entire API surface of the fs module, accepting a `Provider` type to delegate the internals of the whole cluster of file system types to a singular class managing the entire cluster of fs-related types such that the fs module could actually just be fully converted to:<br>```<br>module.exports = new VirtualFileSystem(new LocalProvider())<br>```<br>I intended for it to be extensible for a bunch of different interesting scenarios, so there's also an S3 provider and a zip file provider there, mainly just to validate that the model _can_ be applied to other varieties of storage systems effectively.<br>Keep in mind, like I said, the current state is very much just ideation in a branch I pushed up just now to share, but I think there are concepts for extensibility in there that we could consider to enable a whole ecosystem of flexible storage providers. 🙂<br>Personally, I would hope for something which could provide both read and write access through an abstraction with swappable backends of some variety, this way we could pass around these virtualized file systems like objects and let an ecosystem grow around accepting any generalized virtual file system for its storage backing. I think it'd be very nice for a lot of use cases like file uploads or archive management to be able to just treat them like any other readable and writable file system. |

👍2tniessen and climba03003 reacted with thumbs up emoji

All reactions

- 👍2 reactions

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).

[![@jimmywarting](https://avatars.githubusercontent.com/u/1148376?s=80&u=97348b862d4820275f7e7567ad64a72edfec1443&v=4)](https://github.com/jimmywarting)

### **[jimmywarting](https://github.com/jimmywarting)**     commented   [on Jan 23Jan 23, 2026](https://github.com/nodejs/node/pull/61478\#issuecomment-3793060717)•   edited      Loading          \#\#\# Uh oh!        There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).


Copy link


Copy Markdown

|     |
| --- |
| > Personally, I would hope for something which could provide both read and write access through an abstraction with swappable backends of some variety, this way we could pass around these virtualized file systems like objects and let an ecosystem grow around accepting any generalized virtual file system for its storage backing. I think it'd be very nice for a lot of use cases like file uploads or archive management to be able to just treat them like any other readable and writable file system.<br>just a bit off topic... but this reminds me of why i created this feature request:<br>[Blob.from() for creating virtual Blobs with custom backing storage](https://github.com/w3c/FileAPI/issues/209)<br>Would not lie, it would be cool if NodeJS also provided some type of static `Blob.from` function to create virtual lazy blobs. could live on `fs.blobFrom` for now...<br>example that would only work in NodeJS (based on how it works internally)<br>```<br>const size = 26<br>const blobPart = BlobFrom({<br>  size,<br>  stream (start, end) {<br>    // can either be sync or async (that resolves to a ReadableStream)<br>    // return new Response('abcdefghijklmnopqrstuvwxyz'.slice(start, end)).body<br>    // return new Blob(['abcdefghijklmnopqrstuvwxyz'.slice(start, end)]).stream()<br>    <br>    return fetch('https://httpbin.dev/range/' + size, {<br>      headers: {<br>        range: `bytes=${start}-${end - 1}`<br>      }<br>    }).then(r => r.body)<br>  }<br>})<br>blobPart.text().then(text => {<br>  console.log('a-z', text)<br>})<br>blobPart.slice(-3).text().then(text => {<br>  console.log('x-z', text)<br>})<br>const a = blobPart.slice(0, 6)<br>a.text().then(text => {<br>  console.log('a-f', text)<br>})<br>const b = a.slice(2, 4)<br>b.text().then(text => {<br>  console.log('c-d', text)<br>})<br>```<br>```<br>x-z xyz<br>a-z abcdefghijklmnopqrstuvwxyz<br>a-f abcdef<br>c-d cd<br>```<br>## An actual working PoC<br>(I would not rely on this unless it became officially supported by nodejs core - this is a hack)<br>```<br>const blob = new Blob()<br>const symbols = Object.getOwnPropertySymbols(blob)<br>const blobSymbol = symbols.map(s => [s.description, s])<br>const symbolMap = Object.fromEntries(blobSymbol)<br>const {<br>  kHandle,<br>  kLength,<br>} = symbolMap<br>function BlobFrom ({ size, stream }) {<br>  const blob = new Blob()<br>  if (size === 0) return blob<br>  blob[kLength] = size<br>  blob[kHandle] = {<br>    span: [0, size],<br>    getReader () {<br>      const [start, end] = this.span<br>      if (start === end) {<br>        return { pull: cb => cb(0) }<br>      }<br>      let reader<br>      return {<br>        async pull (cb) {<br>          reader ??= (await stream(start, end)).getReader()<br>          const {done, value} = await reader.read()<br>          cb(done ^ 1, value)<br>        }<br>      }<br>    },<br>    slice (start, end) {<br>      const [baseStart] = this.span<br>      return {<br>        span: [baseStart + start, baseStart + end],<br>        getReader: this.getReader,<br>        slice: this.slice,<br>      }<br>    }<br>  }<br>  return blob<br>}<br>```<br>currently problematic to do: `new Blob([a, b])`, `new File([blobPart], 'alphabet.txt', { type: 'text/plain' })`<br>also need to handle properly clone, serialize & deserialize, if this where to be sent of to another worker - then i would transfer a MessageChannel where the worker thread asks main frame to hand back a transferable ReadableStream when it needs to read something.<br>but there are probably better ways to handle this internally in core with piping data directly to and from different destinations without having to touch the js runtime? - if only getReader could return the reader directly instead of needing to read from the ReadableStream using js? |

All reactions

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).

528 hidden items

Load more…


[![@openjs-meetings-bot](https://avatars.githubusercontent.com/in/1969367?s=40&v=4)](https://github.com/apps/openjs-meetings-bot)[openjs-meetings-bot](https://github.com/apps/openjs-meetings-bot) Bot

mentioned this pull request
[on Mar 25Mar 26, 2026](https://github.com/nodejs/node/pull/61478#ref-issue-4139543158)

[Node.js Technical Steering Committee (TSC) Meeting 2026-04-01\\
nodejs/TSC#1845](https://github.com/nodejs/TSC/issues/1845)

Closed

[mcollina](https://github.com/mcollina)


added 2 commits
[6 months agoMarch 28, 2026 10:13](https://github.com/nodejs/node/pull/61478#commits-pushed-5c74f8d)

[![@mcollina](https://avatars.githubusercontent.com/u/52195?s=40&v=4)](https://github.com/mcollina)

`
          vfs: use bitmask for virtual file descriptors
` …

`
          5c74f8d
`

```
VFS file descriptors now use bit 30 (0x40000000) to distinguish them
from real OS file descriptors. This avoids any possibility of collision
with real fds while keeping VFS fds as valid positive integers, which
is required by unix conventions. Inspired by Yarn's MountFS approach.
```

[![@mcollina](https://avatars.githubusercontent.com/u/52195?s=40&v=4)](https://github.com/mcollina)

`
          vfs: update docs to reflect bitmask fd allocation
`

`
          145fe36
`

[![ronag](https://avatars.githubusercontent.com/u/3065230?s=60&v=4)](https://github.com/ronag)

**[ronag](https://github.com/ronag)**

approved these changes

[on Mar 30Mar 30, 2026](https://github.com/nodejs/node/pull/61478#pullrequestreview-4030805244)

[View reviewed changes](https://github.com/nodejs/node/pull/61478/files/145fe36cfd0645457dc4526df76206153862aeb6)

[![@jbedard](https://avatars.githubusercontent.com/u/89246?s=40&v=4)](https://github.com/jbedard)[jbedard](https://github.com/jbedard)

mentioned this pull request
[on Mar 31Mar 31, 2026](https://github.com/nodejs/node/pull/61478#ref-issue-1330168243)

[ESM imports escape the sandbox & runfiles\\
aspect-build/rules\_js#362](https://github.com/aspect-build/rules_js/issues/362)

Open

[![@openjs-meetings-bot](https://avatars.githubusercontent.com/in/1969367?s=40&v=4)](https://github.com/apps/openjs-meetings-bot)[openjs-meetings-bot](https://github.com/apps/openjs-meetings-bot) Bot

mentioned this pull request
[on Apr 1Apr 2, 2026](https://github.com/nodejs/node/pull/61478#ref-issue-4190718316)

[Node.js Technical Steering Committee (TSC) Meeting 2026-04-08\\
nodejs/TSC#1847](https://github.com/nodejs/TSC/issues/1847)

Closed

This was referenced on Apr 7Apr 7, 2026

[feat: enhanced SEA mode with walker integration and VFS\\
yao-pkg/pkg#229](https://github.com/yao-pkg/pkg/pull/229)

Merged

[fix: patch all async fs methods (callback + promises) for VFS interception\\
platformatic/vfs#10](https://github.com/platformatic/vfs/pull/10)

Merged

[NodeJS 22/24 issues/feedbacks tracker\\
yao-pkg/pkg#87](https://github.com/yao-pkg/pkg/issues/87)

Open

[![@clavin](https://avatars.githubusercontent.com/u/9995434?s=40&v=4)](https://github.com/clavin)[clavin](https://github.com/clavin)

mentioned this pull request
[on Apr 8Apr 8, 2026](https://github.com/nodejs/node/pull/61478#ref-pullrequest-4227911547)

[fix: return numeric blksize and blocks from asar fs.stat\\
electron/electron#50825](https://github.com/electron/electron/pull/50825)

Merged

5 tasks

[![@openjs-meetings-bot](https://avatars.githubusercontent.com/in/1969367?s=40&v=4)](https://github.com/apps/openjs-meetings-bot)[openjs-meetings-bot](https://github.com/apps/openjs-meetings-bot) Bot

mentioned this pull request
[on Apr 8Apr 9, 2026](https://github.com/nodejs/node/pull/61478#ref-issue-4228623866)

[Node.js Technical Steering Committee (TSC) Meeting 2026-04-15\\
nodejs/TSC#1849](https://github.com/nodejs/TSC/issues/1849)

Open

[![@robertsLando](https://avatars.githubusercontent.com/u/11502495?s=40&v=4)](https://github.com/robertsLando)[robertsLando](https://github.com/robertsLando)

mentioned this pull request
[on Apr 10Apr 10, 2026](https://github.com/nodejs/node/pull/61478#ref-issue-4237476248)

[Upstream pkg-fetch patches to Node.js core to eliminate custom binaries\\
yao-pkg/pkg#231](https://github.com/yao-pkg/pkg/issues/231)

Open

11 tasks

[![@mcollina](https://avatars.githubusercontent.com/u/52195?s=40&v=4)](https://github.com/mcollina)

`
          sea: suppress VFS warning in SEA
`

`
          ac843f2
`

[![tniessen](https://avatars.githubusercontent.com/u/3109072?s=60&v=4)](https://github.com/tniessen)

**[tniessen](https://github.com/tniessen)**

reviewed

[on Apr 15Apr 15, 2026](https://github.com/nodejs/node/pull/61478#pullrequestreview-4112476653)

[View reviewed changes](https://github.com/nodejs/node/pull/61478/files/ac843f293fa1a068a8b5f8bfed6cd00a60f192e0)

### ![@tniessen](https://avatars.githubusercontent.com/u/3109072?s=48&v=4)**[tniessen](https://github.com/tniessen)**     left a comment


Copy link


Copy Markdown

Member

There was a problem hiding this comment.

### Choose a reason for hiding this comment

The reason will be displayed to describe this comment to others. [Learn more](https://docs.github.com/articles/managing-disruptive-comments/#hiding-a-comment).


Choose a reason
SpamAbuseOff TopicOutdatedDuplicateResolvedLow QualityHide comment

Thanks for the work, Matteo. I am not sure if I understand the point of per-VFS working directories, especially if this mechanism is also going to hook into `process.chdir()`. I think it'd be reasonable to only allow path resolution relative to the virtual root within a VFS. The interaction between this feature and child processes, which inherit the Node.js working directory, also does not seem to have a clear solution.

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).

👍1danielbayley reacted with thumbs up emoji

All reactions

- 👍1 reaction

Comment thread[doc/api/vfs.md](https://github.com/nodejs/node/pull/61478/files/ac843f293fa1a068a8b5f8bfed6cd00a60f192e0#diff-4fb7177cfdc0f3b18b7821959cd01593c6dc2eb04f39c3aececfedebe846933f)

Comment on lines


+138
to
+142


|     |     |     |
| --- | --- | --- |
|  |  | \### Native addons |
|  |  |  |
|  |  | Native addons (\`.node\` files) cannot be loaded from the VFS. Native addons |
|  |  | must exist on the real file system because they are loaded by the operating |
|  |  | system's dynamic linker, which cannot access virtual files. |

### ![@tniessen](https://avatars.githubusercontent.com/u/3109072?s=48&v=4)**[tniessen](https://github.com/tniessen)** [on Apr 15Apr 15, 2026](https://github.com/nodejs/node/pull/61478\#discussion_r3085492777)


Copy link


Copy Markdown

Member

There was a problem hiding this comment.

### Choose a reason for hiding this comment

The reason will be displayed to describe this comment to others. [Learn more](https://docs.github.com/articles/managing-disruptive-comments/#hiding-a-comment).


Choose a reason
SpamAbuseOff TopicOutdatedDuplicateResolvedLow QualityHide comment

This section should probably also mention that native addons, like child processes, also cannot see virtual file systems.

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).

All reactions

Comment thread[doc/api/vfs.md](https://github.com/nodejs/node/pull/61478/files/ac843f293fa1a068a8b5f8bfed6cd00a60f192e0#diff-4fb7177cfdc0f3b18b7821959cd01593c6dc2eb04f39c3aececfedebe846933f)
Outdated
Show resolvedHide resolved

### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).

Comment thread[doc/api/vfs.md](https://github.com/nodejs/node/pull/61478/files/ac843f293fa1a068a8b5f8bfed6cd00a60f192e0#diff-4fb7177cfdc0f3b18b7821959cd01593c6dc2eb04f39c3aececfedebe846933f)

Comment on lines


+451
to
+452


|     |     |     |
| --- | --- | --- |
|  |  | If case-insensitive matching is required, applications should normalize paths |
|  |  | before VFS operations. |

### ![@tniessen](https://avatars.githubusercontent.com/u/3109072?s=48&v=4)**[tniessen](https://github.com/tniessen)** [on Apr 15Apr 15, 2026](https://github.com/nodejs/node/pull/61478\#discussion_r3085558329)


Copy link


Copy Markdown

Member

There was a problem hiding this comment.

### Choose a reason for hiding this comment

The reason will be displayed to describe this comment to others. [Learn more](https://docs.github.com/articles/managing-disruptive-comments/#hiding-a-comment).


Choose a reason
SpamAbuseOff TopicOutdatedDuplicateResolvedLow QualityHide comment

Normalizing paths might not resolve this issue if the application is not responsible for creating the file.

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).

All reactions

### ![@mcollina](https://avatars.githubusercontent.com/u/52195?s=48&v=4)**[mcollina](https://github.com/mcollina)** [on Apr 15Apr 15, 2026](https://github.com/nodejs/node/pull/61478\#discussion_r3087773223)


Copy link


Copy Markdown

MemberAuthor

There was a problem hiding this comment.

### Choose a reason for hiding this comment

The reason will be displayed to describe this comment to others. [Learn more](https://docs.github.com/articles/managing-disruptive-comments/#hiding-a-comment).


Choose a reason
SpamAbuseOff TopicOutdatedDuplicateResolvedLow QualityHide comment

can you make an example?

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).

All reactions

Comment thread[doc/api/vfs.md](https://github.com/nodejs/node/pull/61478/files/ac843f293fa1a068a8b5f8bfed6cd00a60f192e0#diff-4fb7177cfdc0f3b18b7821959cd01593c6dc2eb04f39c3aececfedebe846933f)

Comment on lines


+456
to
+463


|     |     |     |
| --- | --- | --- |
|  |  | \\* \*\*Read operations\*\* (\`readFile\`, \`readdir\`, \`stat\`, \`lstat\`, \`access\`, |
|  |  | \`exists\`, \`realpath\`, \`readlink\`, \`statfs\`, \`opendir\`): Check VFS first. If |
|  |  | the path doesn't exist in VFS, fall through to the real file system. |
|  |  | \\* \*\*Write operations\*\* (\`writeFile\`, \`appendFile\`, \`mkdir\`, \`rename\`, \`unlink\`, |
|  |  | \`rmdir\`, \`symlink\`, \`copyFile\`, \`truncate\`, \`link\`, \`chmod\`, \`chown\`, |
|  |  | \`utimes\`, \`lutimes\`, \`mkdtemp\`, \`rm\`, \`cp\`): Always operate on VFS. New |
|  |  | files are created in VFS, and attempting to modify a real file that doesn't |
|  |  | exist in VFS will create a new VFS file instead. |

### ![@tniessen](https://avatars.githubusercontent.com/u/3109072?s=48&v=4)**[tniessen](https://github.com/tniessen)** [on Apr 15Apr 15, 2026](https://github.com/nodejs/node/pull/61478\#discussion_r3085614796)


Copy link


Copy Markdown

Member

There was a problem hiding this comment.

### Choose a reason for hiding this comment

The reason will be displayed to describe this comment to others. [Learn more](https://docs.github.com/articles/managing-disruptive-comments/#hiding-a-comment).


Choose a reason
SpamAbuseOff TopicOutdatedDuplicateResolvedLow QualityHide comment

Does this mean that the behavior of `open()` depends on the `flags` that are specified? Is the idea that _all_ write operations (even, for example, `O_RDWR` without `O_CREAT`) target the VFS only, so the underlying filesystem should not be modifiable through this?

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).

All reactions

### ![@RafaelGSS](https://avatars.githubusercontent.com/u/26234614?s=48&v=4)**[RafaelGSS](https://github.com/RafaelGSS)** [on Apr 15Apr 15, 2026](https://github.com/nodejs/node/pull/61478\#discussion_r3086651698)


Copy link


Copy Markdown

Member

There was a problem hiding this comment.

### Choose a reason for hiding this comment

The reason will be displayed to describe this comment to others. [Learn more](https://docs.github.com/articles/managing-disruptive-comments/#hiding-a-comment).


Choose a reason
SpamAbuseOff TopicOutdatedDuplicateResolvedLow QualityHide comment

That was my initial thought as well. But it seems that you could mount that to a real file system. According to: [#62328 (comment)](https://github.com/nodejs/node/issues/62328#1-security--permission-model)

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).

👍1mcollina reacted with thumbs up emoji

All reactions

- 👍1 reaction

### ![@mcollina](https://avatars.githubusercontent.com/u/52195?s=48&v=4)**[mcollina](https://github.com/mcollina)** [on Apr 15Apr 15, 2026](https://github.com/nodejs/node/pull/61478\#discussion_r3087771334)


Copy link


Copy Markdown

MemberAuthor

There was a problem hiding this comment.

### Choose a reason for hiding this comment

The reason will be displayed to describe this comment to others. [Learn more](https://docs.github.com/articles/managing-disruptive-comments/#hiding-a-comment).


Choose a reason
SpamAbuseOff TopicOutdatedDuplicateResolvedLow QualityHide comment

> Does this mean that the behavior of open() depends on the flags that are specified? Is the idea that all write operations (even, for example, O\_RDWR without O\_CREAT) target the VFS only, so the underlying filesystem should not be modifiable through this?

A VFS provider can implement those flags as they would please, e.g. S3 operations. In the current codebase, those are passed through the real provider.

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).

All reactions

[![@mcollina](https://avatars.githubusercontent.com/u/52195?s=40&v=4)](https://github.com/mcollina)

`
          vfs: add NODE_DEBUG support
`

`
          f19a248
`

[![@mcollina](https://avatars.githubusercontent.com/u/52195?s=80&v=4)](https://github.com/mcollina)

### **[mcollina](https://github.com/mcollina)**     commented   [on Apr 15Apr 15, 2026](https://github.com/nodejs/node/pull/61478\#issuecomment-4253556265)


Copy link


Copy Markdown

MemberAuthor

|     |
| --- |
| > Thanks for the work, Matteo. I am not sure if I understand the point of per-VFS working directories, especially if this mechanism is also going to hook into process.chdir(). I think it'd be reasonable to only allow path resolution relative to the virtual root within a VFS. The interaction between this feature and child processes, which inherit the Node.js working directory, also does not seem to have a clear solution.<br>I would like to be able to run a Node.js application inside worker threads, and some of them, unfortunately, do chdir() within dependencies. Supporting chdir() will allow us to do it. |

All reactions

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).

[![@mcollina](https://avatars.githubusercontent.com/u/52195?s=40&v=4)](https://github.com/mcollina)[![@tniessen](https://avatars.githubusercontent.com/u/3109072?s=40&v=4)](https://github.com/tniessen)

`
          Update doc/api/vfs.md
` …

Verified

# Verified

This commit was created on GitHub.com and signed with GitHub’s **verified signature**.


GPG key ID: B5690EEEBB952194

Verified
on Apr 15, 2026, 12:01 PM

[Learn about vigilant mode](https://docs.github.com/github/authenticating-to-github/displaying-verification-statuses-for-all-of-your-commits)

`
          52692ba
`

```
Co-authored-by: Tobias Nießen <tniessen@tnie.de>
```

This was referenced on Apr 15Apr 16, 2026

[Node.js Technical Steering Committee (TSC) Meeting 2026-04-22\\
nodejs/TSC#1850](https://github.com/nodejs/TSC/issues/1850)

Open

[Node.js Technical Steering Committee (TSC) Meeting 2026-04-29\\
nodejs/TSC#1851](https://github.com/nodejs/TSC/issues/1851)

Open

[![@brandonbothell](https://avatars.githubusercontent.com/u/35819370?s=40&v=4)](https://github.com/brandonbothell)[brandonbothell](https://github.com/brandonbothell)

mentioned this pull request
[on Apr 24Apr 24, 2026](https://github.com/nodejs/node/pull/61478#ref-issue-4050703346)

[\[Bug?\]: (cross-post) EBADF: bad file descriptor, fstat with latest NodeJS v25 releases\\
yarnpkg/berry#7065](https://github.com/yarnpkg/berry/issues/7065)

Closed

1 task

[![@tniessen](https://avatars.githubusercontent.com/u/3109072?s=80&u=a2f71b4e0a61161b88f81b2ed09682f3379d1d60&v=4)](https://github.com/tniessen)

### **[tniessen](https://github.com/tniessen)**     commented   [on Apr 29Apr 29, 2026](https://github.com/nodejs/node/pull/61478\#issuecomment-4344451401)


Copy link


Copy Markdown

Member

|     |
| --- |
| > I would like to be able to run a Node.js application inside worker threads, and some of them, unfortunately, do chdir() within dependencies. Supporting chdir() will allow us to do it.<br>Thanks Matteo, I understand the motivation now. Personally, I don't feel great about retrofitting `chdir()` to not actually call the `sys_chdir()` syscall in some cases because it will be tricky to get child processes to inherit the property in a POSIX-compliant manner, especially if a child process is launched from a native addon or so. |

All reactions

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).

[![@mcollina](https://avatars.githubusercontent.com/u/52195?s=80&v=4)](https://github.com/mcollina)

### **[mcollina](https://github.com/mcollina)**     commented   [on Apr 29Apr 29, 2026](https://github.com/nodejs/node/pull/61478\#issuecomment-4344791406)


Copy link


Copy Markdown

MemberAuthor

|     |
| --- |
| > Thanks Matteo, I understand the motivation now. Personally, I don't feel great about retrofitting chdir() to not actually call the sys\_chdir() syscall in some cases because it will be tricky to get child processes to inherit the property in a POSIX-compliant manner, especially if a child process is launched from a native addon or so.<br>The same can be said of all the content in the VFS and native addons. Native addons won't be able to "see" inside the vfs. |

All reactions

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).

[![@openjs-meetings-bot](https://avatars.githubusercontent.com/in/1969367?s=40&v=4)](https://github.com/apps/openjs-meetings-bot)[openjs-meetings-bot](https://github.com/apps/openjs-meetings-bot) Bot

mentioned this pull request
[on Apr 29Apr 30, 2026](https://github.com/nodejs/node/pull/61478#ref-issue-4354638694)

[Node.js Technical Steering Committee (TSC) Meeting 2026-05-06\\
nodejs/TSC#1854](https://github.com/nodejs/TSC/issues/1854)

Closed

[![@tniessen](https://avatars.githubusercontent.com/u/3109072?s=80&u=a2f71b4e0a61161b88f81b2ed09682f3379d1d60&v=4)](https://github.com/tniessen)

### **[tniessen](https://github.com/tniessen)**     commented   [on Apr 30Apr 30, 2026](https://github.com/nodejs/node/pull/61478\#issuecomment-4351604749)


Copy link


Copy Markdown

Member

|     |
| --- |
| My concern is not strictly limited to VFS; any `chdir()` implementation that does not actually dispatch the `SYS_chdir` syscall to the kernel could violate POSIX assumptions without extra precautions, regardless of whether the path exists in the real file system or not. |

All reactions

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).

[![@mcollina](https://avatars.githubusercontent.com/u/52195?s=40&v=4)](https://github.com/mcollina)[mcollina](https://github.com/mcollina)

mentioned this pull request
[on May 4May 4, 2026](https://github.com/nodejs/node/pull/61478#ref-pullrequest-4377618861)

[vfs: add minimal node:vfs subsystem\\
#63115](https://github.com/nodejs/node/pull/63115)

Merged

[![@mcollina](https://avatars.githubusercontent.com/u/52195?s=80&v=4)](https://github.com/mcollina)

### **[mcollina](https://github.com/mcollina)**     commented   [on May 6May 6, 2026](https://github.com/nodejs/node/pull/61478\#issuecomment-4386117750)


Copy link


Copy Markdown

MemberAuthor

|     |
| --- |
| I've extracted [#63115](https://github.com/nodejs/node/pull/63115) from this PR. It includes only the addition and no integration points. |

👍3FoxxMD, Qard, and syhily reacted with thumbs up emoji

All reactions

- 👍3 reactions

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).

[![@justinmk](https://avatars.githubusercontent.com/u/1359421?s=40&v=4)](https://github.com/justinmk)[justinmk](https://github.com/justinmk)

mentioned this pull request
[on May 14May 15, 2026](https://github.com/nodejs/node/pull/61478#ref-issue-4450402136)

[VFS filesystem layer\\
neovim/neovim#39795](https://github.com/neovim/neovim/issues/39795)

Open

[![Graphnull](https://avatars.githubusercontent.com/u/29857827?s=60&v=4)](https://github.com/Graphnull)

**[Graphnull](https://github.com/Graphnull)**

reviewed

[on May 21May 21, 2026](https://github.com/nodejs/node/pull/61478#pullrequestreview-4337128075)

[View reviewed changes](https://github.com/nodejs/node/pull/61478/files/52692baa8a60833d41fb1c817cba2e699c69e3b9)

Comment thread[lib/internal/vfs/sea.js](https://github.com/nodejs/node/pull/61478/files/52692baa8a60833d41fb1c817cba2e699c69e3b9#diff-841ac97980fca2830947b91b41813d7cdb96ffb32835c6c99c273e1714fbde89)

|
|

### ![@Graphnull](https://avatars.githubusercontent.com/u/29857827?s=48&v=4)**[Graphnull](https://github.com/Graphnull)** [on May 21May 21, 2026](https://github.com/nodejs/node/pull/61478\#discussion_r3281358061)


Copy link


Copy Markdown

There was a problem hiding this comment.

### Choose a reason for hiding this comment

The reason will be displayed to describe this comment to others. [Learn more](https://docs.github.com/articles/managing-disruptive-comments/#hiding-a-comment).


Choose a reason
SpamAbuseOff TopicOutdatedDuplicateResolvedLow QualityHide comment

Thanks for the explanatory comment

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).

😄1TheOneTheOnlyJJ reacted with laugh emoji

All reactions

- 😄1 reaction

[![@divybot](https://avatars.githubusercontent.com/u/279198639?s=40&v=4)](https://github.com/divybot)[divybot](https://github.com/divybot)

mentioned this pull request
[on Jun 1Jun 1, 2026](https://github.com/nodejs/node/pull/61478#ref-pullrequest-4561846733)

[feat(ext/node): add experimental node:vfs polyfill\\
denoland/deno#34644](https://github.com/denoland/deno/pull/34644)

Closed

5 tasks

[![@mcollina](https://avatars.githubusercontent.com/u/52195?s=80&v=4)](https://github.com/mcollina)

### **[mcollina](https://github.com/mcollina)**     commented   [2 weeks agoSep 4, 2026](https://github.com/nodejs/node/pull/61478\#issuecomment-5538401163)


Copy link


Copy Markdown

MemberAuthor

|     |
| --- |
| Closing this. Most of it has been implemented and it landed in core. |

All reactions

Sorry, something went wrong.


### Uh oh!

There was an error while loading. [Please reload this page](https://github.com/nodejs/node/pull/61478).

This file contains hidden or bidirectional Unicode text that may be interpreted or compiled differently than what appears below. To review, open the file in an editor that reveals hidden Unicode characters.
[Learn more about bidirectional Unicode characters](https://github.co/hiddenchars)

[Show hidden characters](https://github.com/nodejs/node/pull/61478)

[Sign up for free](https://github.com/join?source=comment-repo) **to join this conversation on GitHub**.
Already have an account?
[Sign in to comment](https://github.com/login?return_to=https%3A%2F%2Fgithub.com%2Fnodejs%2Fnode%2Fpull%2F61478)

### Reviewers

[![@Qard](https://avatars.githubusercontent.com/u/205482?s=40&v=4)](https://github.com/Qard)[Qard](https://github.com/Qard)Qard approved these changes

[![@avivkeller](https://avatars.githubusercontent.com/u/38299977?s=40&v=4)](https://github.com/avivkeller)[avivkeller](https://github.com/avivkeller)avivkeller left review comments

[![@RafaelGSS](https://avatars.githubusercontent.com/u/26234614?s=40&v=4)](https://github.com/RafaelGSS)[RafaelGSS](https://github.com/RafaelGSS)RafaelGSS left review comments

[![@aduh95](https://avatars.githubusercontent.com/u/14309773?s=40&v=4)](https://github.com/aduh95)[aduh95](https://github.com/aduh95)aduh95 left review comments

[![@tniessen](https://avatars.githubusercontent.com/u/3109072?s=40&v=4)](https://github.com/tniessen)[tniessen](https://github.com/tniessen)tniessen left review comments

[![@hybrist](https://avatars.githubusercontent.com/u/567540?s=40&v=4)](https://github.com/hybrist)[hybrist](https://github.com/hybrist)hybrist left review comments

[![@bnb](https://avatars.githubusercontent.com/u/502396?s=40&v=4)](https://github.com/bnb)[bnb](https://github.com/bnb)bnb left review comments

[![@jasnell](https://avatars.githubusercontent.com/u/439929?s=40&v=4)](https://github.com/jasnell)[jasnell](https://github.com/jasnell)jasnell approved these changes

[![@joyeecheung](https://avatars.githubusercontent.com/u/4299420?s=40&v=4)](https://github.com/joyeecheung)[joyeecheung](https://github.com/joyeecheung)joyeecheung approved these changes

[![@himself65](https://avatars.githubusercontent.com/u/14026360?s=40&v=4)](https://github.com/himself65)[himself65](https://github.com/himself65)himself65 approved these changes

[![@Ethan-Arrowood](https://avatars.githubusercontent.com/u/16144158?s=40&v=4)](https://github.com/Ethan-Arrowood)[Ethan-Arrowood](https://github.com/Ethan-Arrowood)Ethan-Arrowood approved these changes

[![@ronag](https://avatars.githubusercontent.com/u/3065230?s=40&v=4)](https://github.com/ronag)[ronag](https://github.com/ronag)ronag approved these changes

[![@ShogunPanda](https://avatars.githubusercontent.com/u/201101?s=40&v=4)](https://github.com/ShogunPanda)[ShogunPanda](https://github.com/ShogunPanda)ShogunPanda approved these changes

[![@RaisinTen](https://avatars.githubusercontent.com/u/42526976?s=40&v=4)](https://github.com/RaisinTen)[RaisinTen](https://github.com/RaisinTen)Awaiting requested review from RaisinTen

+7 more reviewers


[![@TheOneTheOnlyJJ](https://avatars.githubusercontent.com/u/63308694?s=40&v=4)](https://github.com/TheOneTheOnlyJJ)[TheOneTheOnlyJJ](https://github.com/TheOneTheOnlyJJ)TheOneTheOnlyJJ left review comments

[![@ThanhDodeurOdoo](https://avatars.githubusercontent.com/u/39259739?s=40&v=4)](https://github.com/ThanhDodeurOdoo)[ThanhDodeurOdoo](https://github.com/ThanhDodeurOdoo)ThanhDodeurOdoo left review comments

[![@Graphnull](https://avatars.githubusercontent.com/u/29857827?s=40&v=4)](https://github.com/Graphnull)[Graphnull](https://github.com/Graphnull)Graphnull left review comments

[![@e-dant](https://avatars.githubusercontent.com/u/19755642?s=40&v=4)](https://github.com/e-dant)[e-dant](https://github.com/e-dant)e-dant left review comments

[![@hilja](https://avatars.githubusercontent.com/u/2558021?s=40&v=4)](https://github.com/hilja)[hilja](https://github.com/hilja)hilja left review comments

[![@arcanis](https://avatars.githubusercontent.com/u/1037931?s=40&v=4)](https://github.com/arcanis)[arcanis](https://github.com/arcanis)arcanis left review comments

[![@aymen94](https://avatars.githubusercontent.com/u/13963132?s=40&v=4)](https://github.com/aymen94)[aymen94](https://github.com/aymen94)aymen94 approved these changes

Reviewers whose approvals may not affect merge requirements

### Assignees

No one assigned

### Labels

[fs](https://github.com/nodejs/node/issues?q=state%3Aopen%20label%3Afs) Issues and PRs related to file-system APIs and the fs module. [lib / src](https://github.com/nodejs/node/issues?q=state%3Aopen%20label%3A%22lib%20%2F%20src%22) Issues and PRs involving general changes in the lib/ or src/ directories. [module](https://github.com/nodejs/node/issues?q=state%3Aopen%20label%3Amodule) Issues and PRs related to the module subsystem. [needs-benchmark-ci](https://github.com/nodejs/node/issues?q=state%3Aopen%20label%3Aneeds-benchmark-ci) PRs that need a benchmark CI run. [needs-ci](https://github.com/nodejs/node/issues?q=state%3Aopen%20label%3Aneeds-ci) PRs that need a full CI run. [notable-change](https://github.com/nodejs/node/issues?q=state%3Aopen%20label%3Anotable-change) PRs with changes that should be highlighted in changelogs. [semver-minor](https://github.com/nodejs/node/issues?q=state%3Aopen%20label%3Asemver-minor) PRs that contain new features and should be released in the next minor version. [test\_runner](https://github.com/nodejs/node/issues?q=state%3Aopen%20label%3Atest_runner) Issues and PRs related to the test runner subsystem.

### Projects

None yet

### Milestone

No milestone

### Development

Successfully merging this pull request may close these issues.

[Implement VFS (Virtual File System) Hooks for Single Executable Applications](https://github.com/nodejs/node/issues/60021)

### 19 participants

[![@mcollina](https://avatars.githubusercontent.com/u/52195?s=52&v=4)](https://github.com/mcollina)[![@nodejs-github-bot](https://avatars.githubusercontent.com/u/18269663?s=52&v=4)](https://github.com/nodejs-github-bot)[![@Ethan-Arrowood](https://avatars.githubusercontent.com/u/16144158?s=52&v=4)](https://github.com/Ethan-Arrowood)[![@avivkeller](https://avatars.githubusercontent.com/u/38299977?s=52&v=4)](https://github.com/avivkeller)[![@joyeecheung](https://avatars.githubusercontent.com/u/4299420?s=52&v=4)](https://github.com/joyeecheung)[![@jimmywarting](https://avatars.githubusercontent.com/u/1148376?s=52&v=4)](https://github.com/jimmywarting)[![@juliangruber](https://avatars.githubusercontent.com/u/10247?s=52&v=4)](https://github.com/juliangruber)[![@Qard](https://avatars.githubusercontent.com/u/205482?s=52&v=4)](https://github.com/Qard)[![@jasnell](https://avatars.githubusercontent.com/u/439929?s=52&v=4)](https://github.com/jasnell)[![@targos](https://avatars.githubusercontent.com/u/2352663?s=52&v=4)](https://github.com/targos)[![@benjamingr](https://avatars.githubusercontent.com/u/1315533?s=52&v=4)](https://github.com/benjamingr)[![@robertsLando](https://avatars.githubusercontent.com/u/11502495?s=52&v=4)](https://github.com/robertsLando)[![@TheOneTheOnlyJJ](https://avatars.githubusercontent.com/u/63308694?s=52&v=4)](https://github.com/TheOneTheOnlyJJ)[![@boneskull](https://avatars.githubusercontent.com/u/924465?s=52&v=4)](https://github.com/boneskull)[![@indutny](https://avatars.githubusercontent.com/u/238531?s=52&v=4)](https://github.com/indutny)[![@rginn](https://avatars.githubusercontent.com/u/4296937?s=52&v=4)](https://github.com/rginn)[![@syrusakbary](https://avatars.githubusercontent.com/u/188257?s=52&v=4)](https://github.com/syrusakbary)[![@philipwhiuk](https://avatars.githubusercontent.com/u/1316415?s=52&v=4)](https://github.com/philipwhiuk)[![@paulshryock](https://avatars.githubusercontent.com/u/7530507?s=52&v=4)](https://github.com/paulshryock)

Add this suggestion to a batch that can be applied as a single commit.This suggestion is invalid because no changes were made to the code.Suggestions cannot be applied while the pull request is closed.Suggestions cannot be applied while viewing a subset of changes.Only one suggestion per line can be applied in a batch.Add this suggestion to a batch that can be applied as a single commit.Applying suggestions on deleted lines is not supported.You must change the existing code in this line in order to create a valid suggestion.Outdated suggestions cannot be applied.This suggestion has been applied or marked resolved.Suggestions cannot be applied from pending reviews.Suggestions cannot be applied on multi-line comments.Suggestions cannot be applied while the pull request is queued to merge.Suggestion cannot be applied right now. Please check back later.

You can’t perform that action at this time.
