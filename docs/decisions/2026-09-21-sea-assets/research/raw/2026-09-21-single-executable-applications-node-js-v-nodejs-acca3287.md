---
url: https://nodejs.org/api/single-executable-applications.html
retrieved: 2026-09-21
command: firecrawl scrape https://nodejs.org/api/single-executable-applications.html --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Single executable applications | Node.js v26.9.0 Documentation
---
[Skip to content](https://nodejs.org/api/single-executable-applications.html#apicontent)

[Node.js](https://nodejs.org/ "Go back to the home page")

* * *

- [About this documentation](https://nodejs.org/api/documentation.html)
- [Usage and example](https://nodejs.org/api/synopsis.html)
- [Assertion testing](https://nodejs.org/api/assert.html)
- [Asynchronous context tracking](https://nodejs.org/api/async_context.html)
- [Async hooks](https://nodejs.org/api/async_hooks.html)
- [Benchmark runner](https://nodejs.org/api/bench.html)
- [Buffer](https://nodejs.org/api/buffer.html)
- [C++ addons](https://nodejs.org/api/addons.html)
- [C/C++ addons with Node-API](https://nodejs.org/api/n-api.html)
- [C++ embedder API](https://nodejs.org/api/embedding.html)
- [Child processes](https://nodejs.org/api/child_process.html)
- [Cluster](https://nodejs.org/api/cluster.html)
- [Command-line options](https://nodejs.org/api/cli.html)
- [Console](https://nodejs.org/api/console.html)
- [Crypto](https://nodejs.org/api/crypto.html)
- [Debugger](https://nodejs.org/api/debugger.html)
- [Deprecated APIs](https://nodejs.org/api/deprecations.html)
- [Diagnostics Channel](https://nodejs.org/api/diagnostics_channel.html)
- [DNS](https://nodejs.org/api/dns.html)
- [Domain](https://nodejs.org/api/domain.html)
- [Environment Variables](https://nodejs.org/api/environment_variables.html)
- [Errors](https://nodejs.org/api/errors.html)
- [Events](https://nodejs.org/api/events.html)
- [File system](https://nodejs.org/api/fs.html)
- [FFI](https://nodejs.org/api/ffi.html)
- [Globals](https://nodejs.org/api/globals.html)
- [HTTP](https://nodejs.org/api/http.html)
- [HTTP/2](https://nodejs.org/api/http2.html)
- [HTTPS](https://nodejs.org/api/https.html)
- [Inspector](https://nodejs.org/api/inspector.html)
- [Internationalization](https://nodejs.org/api/intl.html)
- [Iterable Streams API](https://nodejs.org/api/stream_iter.html)
- [Modules: CommonJS modules](https://nodejs.org/api/modules.html)
- [Modules: ECMAScript modules](https://nodejs.org/api/esm.html)
- [Modules: `node:module` API](https://nodejs.org/api/module.html)
- [Modules: Packages](https://nodejs.org/api/packages.html)
- [Modules: TypeScript](https://nodejs.org/api/typescript.html)
- [Net](https://nodejs.org/api/net.html)
- [OS](https://nodejs.org/api/os.html)
- [Path](https://nodejs.org/api/path.html)
- [Performance hooks](https://nodejs.org/api/perf_hooks.html)
- [Permissions](https://nodejs.org/api/permissions.html)
- [Process](https://nodejs.org/api/process.html)
- [Punycode](https://nodejs.org/api/punycode.html)
- [Query strings](https://nodejs.org/api/querystring.html)
- [Readline](https://nodejs.org/api/readline.html)
- [REPL](https://nodejs.org/api/repl.html)
- [Report](https://nodejs.org/api/report.html)
- [Single executable applications](https://nodejs.org/api/single-executable-applications.html)
- [SQLite](https://nodejs.org/api/sqlite.html)
- [Stream](https://nodejs.org/api/stream.html)
- [String decoder](https://nodejs.org/api/string_decoder.html)
- [Test runner](https://nodejs.org/api/test.html)
- [Timers](https://nodejs.org/api/timers.html)
- [TLS/SSL](https://nodejs.org/api/tls.html)
- [Trace events](https://nodejs.org/api/tracing.html)
- [TTY](https://nodejs.org/api/tty.html)
- [UDP/datagram](https://nodejs.org/api/dgram.html)
- [URL](https://nodejs.org/api/url.html)
- [Utilities](https://nodejs.org/api/util.html)
- [V8](https://nodejs.org/api/v8.html)
- [Virtual File System](https://nodejs.org/api/vfs.html)
- [VM](https://nodejs.org/api/vm.html)
- [WASI](https://nodejs.org/api/wasi.html)
- [Web Crypto API](https://nodejs.org/api/webcrypto.html)
- [Web Streams API](https://nodejs.org/api/webstreams.html)
- [Worker threads](https://nodejs.org/api/worker_threads.html)
- [Zlib](https://nodejs.org/api/zlib.html)

* * *

- [Code repository and issue tracker](https://github.com/nodejs/node)

Table of contents

- [Single executable applications](https://nodejs.org/api/single-executable-applications.html#single-executable-applications)
  - [Generating single executable applications with `--build-sea`](https://nodejs.org/api/single-executable-applications.html#-build-sea)
    - [Assets](https://nodejs.org/api/single-executable-applications.html#assets)
    - [Virtual file system (VFS) for assets](https://nodejs.org/api/single-executable-applications.html#virtual-file-system-vfs-for-assets)
      - [Loading modules from the VFS in a SEA](https://nodejs.org/api/single-executable-applications.html#loading-modules-from-the-vfs-in-a-sea)
      - [ESM entry points](https://nodejs.org/api/single-executable-applications.html#esm-entry-points)
      - [Snapshot and code caching limitations](https://nodejs.org/api/single-executable-applications.html#snapshot-and-code-caching-limitations)
      - [Native addon limitations](https://nodejs.org/api/single-executable-applications.html#native-addon-limitations)
    - [Startup snapshot support](https://nodejs.org/api/single-executable-applications.html#startup-snapshot-support)
    - [V8 code cache support](https://nodejs.org/api/single-executable-applications.html#v8-code-cache-support)
    - [Execution arguments](https://nodejs.org/api/single-executable-applications.html#execution-arguments)
    - [Execution argument extension](https://nodejs.org/api/single-executable-applications.html#execution-argument-extension)
  - [Single-executable application API](https://nodejs.org/api/single-executable-applications.html#single-executable-application-api)
    - [`sea.isSea()`](https://nodejs.org/api/single-executable-applications.html#seaissea)
    - [`sea.getAsset(key[, encoding])`](https://nodejs.org/api/single-executable-applications.html#seagetassetkey-encoding)
    - [`sea.getAssetAsBlob(key[, options])`](https://nodejs.org/api/single-executable-applications.html#seagetassetasblobkey-options)
    - [`sea.getRawAsset(key)`](https://nodejs.org/api/single-executable-applications.html#seagetrawassetkey)
    - [`sea.getAssetKeys()`](https://nodejs.org/api/single-executable-applications.html#seagetassetkeys)
  - [In the injected main script](https://nodejs.org/api/single-executable-applications.html#in-the-injected-main-script)
    - [Module format of the injected main script](https://nodejs.org/api/single-executable-applications.html#module-format-of-the-injected-main-script)
    - [Module loading in the injected main script](https://nodejs.org/api/single-executable-applications.html#module-loading-in-the-injected-main-script)
    - [`require()` in the injected main script](https://nodejs.org/api/single-executable-applications.html#require-in-the-injected-main-script)
    - [`__filename` and `module.filename` in the injected main script](https://nodejs.org/api/single-executable-applications.html#__filename-and-modulefilename-in-the-injected-main-script)
    - [`__dirname` in the injected main script](https://nodejs.org/api/single-executable-applications.html#__dirname-in-the-injected-main-script)
    - [`import.meta` in the injected main script](https://nodejs.org/api/single-executable-applications.html#importmeta-in-the-injected-main-script)
    - [`import()` in the injected main script](https://nodejs.org/api/single-executable-applications.html#import-in-the-injected-main-script)
    - [Using native addons in the injected main script](https://nodejs.org/api/single-executable-applications.html#using-native-addons-in-the-injected-main-script)
  - [Notes](https://nodejs.org/api/single-executable-applications.html#notes)
    - [Single executable application creation process](https://nodejs.org/api/single-executable-applications.html#single-executable-application-creation-process)
      - [1\. Generating single executable preparation blobs](https://nodejs.org/api/single-executable-applications.html#1-generating-single-executable-preparation-blobs)
        - [Dumping the preparation blob to disk](https://nodejs.org/api/single-executable-applications.html#dumping-the-preparation-blob-to-disk)
      - [2\. Injecting the preparation blob into the `node` binary](https://nodejs.org/api/single-executable-applications.html#2-injecting-the-preparation-blob-into-the-node-binary)
        - [Injecting the preparation blob manually](https://nodejs.org/api/single-executable-applications.html#injecting-the-preparation-blob-manually)
    - [Platform support](https://nodejs.org/api/single-executable-applications.html#platform-support)

## Single executable applications[\#](https://nodejs.org/api/single-executable-applications.html\#single-executable-applications)

**Source Code:** [src/node\_sea.cc](https://github.com/nodejs/node/blob/main/src/node_sea.cc)Added in: v19.7.0, v18.16.0History

| Version | Changes |
| --- | --- |
| v25.5.0 | Added built-in single executable application generation via the CLI flag `--build-sea`. |
| v20.6.0 | Added support for "useSnapshot". |
| v20.6.0 | Added support for "useCodeCache". |

[Stability: 1.1](https://nodejs.org/api/documentation.html#stability-index) \- Active development

This feature allows the distribution of a Node.js application conveniently to a
system that does not have Node.js installed.

Node.js supports the creation of [single executable applications](https://github.com/nodejs/single-executable) by allowing
the injection of a blob prepared by Node.js, which can contain a bundled script,
into the `node` binary. During start up, the program checks if anything has been
injected. If the blob is found, it executes the script in the blob. Otherwise
Node.js operates as it normally does.

The single executable application feature supports running a
single embedded script using the [CommonJS](https://nodejs.org/api/modules.html#modules-commonjs-modules) or the [ECMAScript Modules](https://nodejs.org/api/esm.html#modules-ecmascript-modules) module system.

Users can create a single executable application from their bundled script
with the `node` binary itself and any tool which can inject resources into the
binary.

1. Create a JavaScript file:


```bash
echo 'console.log(`Hello, ${process.argv[2]}!`);' > hello.js
bashcopy
```

2. Create a configuration file building a blob that can be injected into the
single executable application (see
[Generating single executable preparation blobs](https://nodejs.org/api/single-executable-applications.html#1-generating-single-executable-preparation-blobs) for details):


   - On systems other than Windows:

```bash
echo '{ "main": "hello.js", "output": "sea" }' > sea-config.json
bashcopy
```

   - On Windows:

```bash
echo '{ "main": "hello.js", "output": "sea.exe" }' > sea-config.json
bashcopy
```

The `.exe` extension is necessary.

3. Generate the target executable:


```bash
node --build-sea sea-config.json
bashcopy
```

4. Sign the binary (macOS and Windows only):


   - On macOS:

```bash
codesign --sign - sea
bashcopy
```

   - On Windows (optional):

A certificate needs to be present for this to work. However, the unsigned
binary would still be runnable.

```powershell
signtool sign /fd SHA256 sea.exe
powershellcopy
```

5. Run the binary:


   - On systems other than Windows

```console
$ ./sea world
Hello, world!
consolecopy
```

   - On Windows

```console
$ .\sea.exe world
Hello, world!
consolecopy
```

### Generating single executable applications with `--build-sea`[\#](https://nodejs.org/api/single-executable-applications.html\#-build-sea)

To generate a single executable application directly, the `--build-sea` flag can be
used. It takes a path to a configuration file in JSON format. If the path passed to it
isn't absolute, Node.js will use the path relative to the current working directory.

The configuration currently reads the following top-level fields:

```json
{
  "main": "/path/to/bundled/script.js",
  "mainFormat": "commonjs", // Default: "commonjs", options: "commonjs", "module"
  "executable": "/path/to/node/binary", // Optional, if not specified, uses the current Node.js binary
  "output": "/path/to/write/the/generated/executable",
  "disableExperimentalSEAWarning": true, // Default: false
  "useSnapshot": false,  // Default: false
  "useCodeCache": true, // Default: false
  "useVfs": true, // Default: false
  "execArgv": ["--no-warnings", "--max-old-space-size=4096"], // Optional
  "execArgvExtension": "env", // Default: "env", options: "none", "env", "cli"
  "assets": {  // Optional
    "a.dat": "/path/to/a.dat",
    "b.txt": "/path/to/b.txt"
  }
}
jsoncopy
```

If the paths are not absolute, Node.js will use the path relative to the
current working directory. The version of the Node.js binary used to produce
the blob must be the same as the one to which the blob will be injected.

Note: When generating cross-platform SEAs (e.g., generating a SEA
for `linux-x64` on `darwin-arm64`), `useCodeCache` and `useSnapshot`
must be set to false to avoid generating incompatible executables.
Since code cache and snapshots can only be loaded on the same platform
where they are compiled, the generated executable might crash on startup when
trying to load code cache or snapshots built on a different platform.

#### Assets[\#](https://nodejs.org/api/single-executable-applications.html\#assets)

Users can include assets by adding a key-path dictionary to the configuration
as the `assets` field. At build time, Node.js would read the assets from the
specified paths and bundle them into the preparation blob. In the generated
executable, users can retrieve the assets using the [`sea.getAsset()`](https://nodejs.org/api/single-executable-applications.html#seagetassetkey-encoding) and
[`sea.getAssetAsBlob()`](https://nodejs.org/api/single-executable-applications.html#seagetassetasblobkey-options) APIs.

```json
{
  "main": "/path/to/bundled/script.js",
  "output": "/path/to/write/the/generated/executable",
  "assets": {
    "a.jpg": "/path/to/a.jpg",
    "b.txt": "/path/to/b.txt"
  }
}
jsoncopy
```

The single-executable application can access the assets as follows:

```cjs
const { getAsset, getAssetAsBlob, getRawAsset, getAssetKeys } = require('node:sea');
// Get all asset keys.
const keys = getAssetKeys();
console.log(keys); // ['a.jpg', 'b.txt']
// Returns a copy of the data in an ArrayBuffer.
const image = getAsset('a.jpg');
// Returns a string decoded from the asset as UTF8.
const text = getAsset('b.txt', 'utf8');
// Returns a Blob containing the asset.
const blob = getAssetAsBlob('a.jpg');
// Returns an ArrayBuffer containing the raw asset without copying.
const raw = getRawAsset('a.jpg');
cjscopy
```

See documentation of the [`sea.getAsset()`](https://nodejs.org/api/single-executable-applications.html#seagetassetkey-encoding), [`sea.getAssetAsBlob()`](https://nodejs.org/api/single-executable-applications.html#seagetassetasblobkey-options),
[`sea.getRawAsset()`](https://nodejs.org/api/single-executable-applications.html#seagetrawassetkey) and [`sea.getAssetKeys()`](https://nodejs.org/api/single-executable-applications.html#seagetassetkeys) APIs for more information.

#### Virtual file system (VFS) for assets[\#](https://nodejs.org/api/single-executable-applications.html\#virtual-file-system-vfs-for-assets)

Added in: v26.9.0

Stability: 1.0 - Early development

In addition to using the `node:sea` API to access individual assets, the
bundled assets can be exposed as a read-only [virtual file system](https://nodejs.org/api/vfs.html) and
accessed through standard `node:fs` APIs. To enable this, set
`"useVfs": true` in the SEA configuration.

A virtual file system never shadows the real file system: it is mounted at a
reserved mount point that cannot exist on the real file system, and the mount
point is chosen at runtime rather than being a fixed path. When `useVfs` is
enabled, the injected main script itself is placed at the root of the mount
and executed from there, so `__filename` and `__dirname` point inside the
virtual file system instead of reflecting [`process.execPath`](https://nodejs.org/api/process.html#processexecpath). Bundled
code therefore reaches the assets through `__dirname`-relative paths and
relative [`require()`](https://nodejs.org/api/modules.html#requireid) calls, without having to know the mount point:

```cjs
const fs = require('node:fs');
const path = require('node:path');

// __dirname is the root of the virtual file system holding the assets.
const rawConfig = fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8');
const data = fs.readFileSync(path.join(__dirname, 'data/file.txt'));

// Directory operations work too.
const files = fs.readdirSync(path.join(__dirname, 'assets'));

// Check if a bundled file exists.
if (fs.existsSync(path.join(__dirname, 'optional.json'))) {
  // ...
}
cjscopy
```

The VFS supports the `node:fs` operations for reading files and directories.
Since the SEA VFS is read-only, write operations fail with `EROFS`. See the
[VFS documentation](https://nodejs.org/api/vfs.html) for the full list of supported operations.

##### Loading modules from the VFS in a SEA[\#](https://nodejs.org/api/single-executable-applications.html\#loading-modules-from-the-vfs-in-a-sea)

When `useVfs` is enabled, the main script is executed from inside the
virtual file system, and `require()` uses the [module loader\\
integration](https://nodejs.org/api/vfs.html#module-loader-integration) of the VFS to load modules from the bundled assets. This
supports relative requires (e.g. `require('./helper.js')`) as well as
`node_modules` package lookups, which are confined to the mount:

```cjs
// Require bundled modules using relative paths.
const myModule = require('./lib/mymodule.js');

// Packages bundled under the node_modules asset prefix also resolve.
const dep = require('some-package');
cjscopy
```

##### ESM entry points[\#](https://nodejs.org/api/single-executable-applications.html\#esm-entry-points)

`"useVfs": true` also supports `"mainFormat": "module"`. The ESM main
script is loaded from inside the mount through the ESM loader, so
`import.meta.url`, `import.meta.filename`, and `import.meta.dirname`
reflect the location of the main script in the virtual file system, and
static and dynamic imports resolve against the bundled assets:

```mjs
import fs from 'node:fs';
import path from 'node:path';

// import.meta.dirname is the root of the virtual file system.
const data = fs.readFileSync(
  path.join(import.meta.dirname, 'data/file.txt'));

// Relative and bare specifier imports resolve inside the mount.
import myModule from './lib/mymodule.mjs';
const lazy = await import('./lib/lazy.mjs');
mjscopy
```

Module format detection works the same way as on the real file
system: name bundled ES modules with the `.mjs` extension (or provide the
relevant `package.json` files as assets) so they are interpreted as ESM.

##### Snapshot and code caching limitations[\#](https://nodejs.org/api/single-executable-applications.html\#snapshot-and-code-caching-limitations)

`"useVfs": true` cannot be used together with `"useSnapshot": true` or
`"useCodeCache": true`. The code cache limitation is due to incomplete
implementation, not a technical impossibility. Consider bundling the
application if startup performance matters and do not rely on module loading
from the VFS in that case.

##### Native addon limitations[\#](https://nodejs.org/api/single-executable-applications.html\#native-addon-limitations)

Native addons (`.node` files) cannot be loaded directly from the VFS because
`process.dlopen()` requires files on the real file system. To use native
addons in a SEA with VFS, write the asset to a temporary file first. See
[Using native addons in the injected main script](https://nodejs.org/api/single-executable-applications.html#using-native-addons-in-the-injected-main-script) for an example.

#### Startup snapshot support[\#](https://nodejs.org/api/single-executable-applications.html\#startup-snapshot-support)

The `useSnapshot` field can be used to enable startup snapshot support. In this
case, the `main` script would not be executed when the final executable is launched.
Instead, it would be run when the single executable application preparation
blob is generated on the building machine. The generated preparation blob would
then include a snapshot capturing the states initialized by the `main` script.
The final executable, with the preparation blob injected, would deserialize
the snapshot at run time.

When `useSnapshot` is true, the main script must invoke the
[`v8.startupSnapshot.setDeserializeMainFunction()`](https://nodejs.org/api/v8.html#v8startupsnapshotsetdeserializemainfunctioncallback-data) API to configure code
that needs to be run when the final executable is launched by the users.

The typical pattern for an application to use snapshot in a single executable
application is:

1. At build time, on the building machine, the main script is run to
initialize the heap to a state that's ready to take user input. The script
should also configure a main function with
[`v8.startupSnapshot.setDeserializeMainFunction()`](https://nodejs.org/api/v8.html#v8startupsnapshotsetdeserializemainfunctioncallback-data). This function will be
compiled and serialized into the snapshot, but not invoked at build time.
2. At run time, the main function will be run on top of the deserialized heap
on the user machine to process user input and generate output.

The general constraints of the startup snapshot scripts also apply to the main
script when it's used to build snapshot for the single executable application,
and the main script can use the [`v8.startupSnapshot` API](https://nodejs.org/api/v8.html#startup-snapshot-api) to adapt to
these constraints. See
[documentation about startup snapshot support in Node.js](https://nodejs.org/api/cli.html#--build-snapshot).

#### V8 code cache support[\#](https://nodejs.org/api/single-executable-applications.html\#v8-code-cache-support)

When `useCodeCache` is set to `true` in the configuration, during the generation
of the single executable preparation blob, Node.js will compile the `main`
script to generate the V8 code cache. The generated code cache would be part of
the preparation blob and get injected into the final executable. When the single
executable application is launched, instead of compiling the `main` script from
scratch, Node.js would use the code cache to speed up the compilation, then
execute the script, which would improve the startup performance.

**Note:**`import()` does not work when `useCodeCache` is `true`.

#### Execution arguments[\#](https://nodejs.org/api/single-executable-applications.html\#execution-arguments)

The `execArgv` field can be used to specify Node.js-specific
arguments that will be automatically applied when the single
executable application starts. This allows application developers
to configure Node.js runtime options without requiring end users
to be aware of these flags.

For example, the following configuration:

```json
{
  "main": "/path/to/bundled/script.js",
  "output": "/path/to/write/the/generated/executable",
  "execArgv": ["--no-warnings", "--max-old-space-size=2048"]
}
jsoncopy
```

will instruct the SEA to be launched with the `--no-warnings` and
`--max-old-space-size=2048` flags. In the scripts embedded in the executable, these flags
can be accessed using the `process.execArgv` property:

```js
// If the executable is launched with `sea user-arg1 user-arg2`
console.log(process.execArgv);
// Prints: ['--no-warnings', '--max-old-space-size=2048']
console.log(process.argv);
// Prints ['/path/to/sea', 'path/to/sea', 'user-arg1', 'user-arg2']
jscopy
```

The user-provided arguments are in the `process.argv` array starting from index 2,
similar to what would happen if the application is started with:

```console
node --no-warnings --max-old-space-size=2048 /path/to/bundled/script.js user-arg1 user-arg2
consolecopy
```

#### Execution argument extension[\#](https://nodejs.org/api/single-executable-applications.html\#execution-argument-extension)

The `execArgvExtension` field controls how additional execution arguments can be
provided beyond those specified in the `execArgv` field. It accepts one of three string values:

- `"none"`: No extension is allowed. Only the arguments specified in `execArgv` will be used,
and the `NODE_OPTIONS` environment variable will be ignored.
- `"env"`: _(Default)_ The `NODE_OPTIONS` environment variable can extend the execution arguments.
This is the default behavior to maintain backward compatibility.
- `"cli"`: The executable can be launched with `--node-options="--flag1 --flag2"`, and those flags
will be parsed as execution arguments for Node.js instead of being passed to the user script.
This allows using arguments that are not supported by the `NODE_OPTIONS` environment variable.

For example, with `"execArgvExtension": "cli"`:

```json
{
  "main": "/path/to/bundled/script.js",
  "output": "/path/to/write/the/generated/executable",
  "execArgv": ["--no-warnings"],
  "execArgvExtension": "cli"
}
jsoncopy
```

The executable can be launched as:

```console
./my-sea --node-options="--trace-exit" user-arg1 user-arg2
consolecopy
```

This would be equivalent to running:

```console
node --no-warnings --trace-exit /path/to/bundled/script.js user-arg1 user-arg2
consolecopy
```

### Single-executable application API[\#](https://nodejs.org/api/single-executable-applications.html\#single-executable-application-api)

The `node:sea` builtin allows interaction with the single-executable application
from the JavaScript main script embedded into the executable.

#### `sea.isSea()`[\#](https://nodejs.org/api/single-executable-applications.html\#seaissea)

Added in: v21.7.0, v20.12.0

- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) Whether this script is running inside a single-executable
application.

#### `sea.getAsset(key[, encoding])`[\#](https://nodejs.org/api/single-executable-applications.html\#seagetassetkey-encoding)

Added in: v21.7.0, v20.12.0

This method can be used to retrieve the assets configured to be bundled into the
single-executable application at build time.
An error is thrown when no matching asset can be found.

- `key` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) the key for the asset in the dictionary specified by the `assets` field in the single-executable application configuration.
- `encoding` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) If specified, the asset will be decoded as
a string. Any encoding supported by the `TextDecoder` is accepted.
If unspecified, an `ArrayBuffer` containing a copy of the asset would be
returned instead.
- Returns: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) \| [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

#### `sea.getAssetAsBlob(key[, options])`[\#](https://nodejs.org/api/single-executable-applications.html\#seagetassetasblobkey-options)

Added in: v21.7.0, v20.12.0

Similar to [`sea.getAsset()`](https://nodejs.org/api/single-executable-applications.html#seagetassetkey-encoding), but returns the result in a [`<Blob>`](https://nodejs.org/api/buffer.html#class-blob).
An error is thrown when no matching asset can be found.

- `key` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) the key for the asset in the dictionary specified by the `assets` field in the single-executable application configuration.
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `type` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) An optional mime type for the blob.
- Returns: [`<Blob>`](https://nodejs.org/api/buffer.html#class-blob)

#### `sea.getRawAsset(key)`[\#](https://nodejs.org/api/single-executable-applications.html\#seagetrawassetkey)

Added in: v21.7.0, v20.12.0

This method can be used to retrieve the assets configured to be bundled into the
single-executable application at build time.
An error is thrown when no matching asset can be found.

Unlike `sea.getAsset()` or `sea.getAssetAsBlob()`, this method does not
return a copy. Instead, it returns the raw asset bundled inside the executable.

For now, users should avoid writing to the returned array buffer. If the
injected section is not marked as writable or not aligned properly,
writes to the returned array buffer is likely to result in a crash.

- `key` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) the key for the asset in the dictionary specified by the `assets` field in the single-executable application configuration.
- Returns: [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

#### `sea.getAssetKeys()`[\#](https://nodejs.org/api/single-executable-applications.html\#seagetassetkeys)

Added in: v24.8.0, v22.20.0

- Returns [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)\[\] An array containing all the keys of the assets
embedded in the executable. If no assets are embedded, returns an empty array.

This method can be used to retrieve an array of all the keys of assets
embedded into the single-executable application.
An error is thrown when not running inside a single-executable application.

### In the injected main script[\#](https://nodejs.org/api/single-executable-applications.html\#in-the-injected-main-script)

#### Module format of the injected main script[\#](https://nodejs.org/api/single-executable-applications.html\#module-format-of-the-injected-main-script)

To specify how Node.js should interpret the injected main script, use the
`mainFormat` field in the single-executable application configuration.
The accepted values are:

- `"commonjs"`: The injected main script is treated as a CommonJS module.
- `"module"`: The injected main script is treated as an ECMAScript module.

If the `mainFormat` field is not specified, it defaults to `"commonjs"`.

Currently, `"mainFormat": "module"` cannot be used together with `"useSnapshot"`.

#### Module loading in the injected main script[\#](https://nodejs.org/api/single-executable-applications.html\#module-loading-in-the-injected-main-script)

In the injected main script, module loading does not read from the file system.
By default, both `require()` and `import` statements would only be able to load
the built-in modules. Attempting to load a module that can only be found in the
file system will throw an error.

Users can bundle their application into a standalone JavaScript file to inject
into the executable. This also ensures a more deterministic dependency graph.

To load modules from the file system in the injected main script, users can
create a `require` function that can load from the file system using
`module.createRequire()`. For example, in a CommonJS entry point:

```js
const { createRequire } = require('node:module');
require = createRequire(__filename);
jscopy
```

#### `require()` in the injected main script[\#](https://nodejs.org/api/single-executable-applications.html\#require-in-the-injected-main-script)

`require()` in the injected main script is not the same as the [`require()`](https://nodejs.org/api/modules.html#requireid)
available to modules that are not injected.
Currently, it does not have any of the properties that non-injected
[`require()`](https://nodejs.org/api/modules.html#requireid) has except [`require.main`](https://nodejs.org/api/modules.html#accessing-the-main-module).

#### `__filename` and `module.filename` in the injected main script[\#](https://nodejs.org/api/single-executable-applications.html\#__filename-and-modulefilename-in-the-injected-main-script)

The values of `__filename` and `module.filename` in the injected main script
are equal to [`process.execPath`](https://nodejs.org/api/process.html#processexecpath).

#### `__dirname` in the injected main script[\#](https://nodejs.org/api/single-executable-applications.html\#__dirname-in-the-injected-main-script)

The value of `__dirname` in the injected main script is equal to the directory
name of [`process.execPath`](https://nodejs.org/api/process.html#processexecpath).

#### `import.meta` in the injected main script[\#](https://nodejs.org/api/single-executable-applications.html\#importmeta-in-the-injected-main-script)

When using `"mainFormat": "module"`, `import.meta` is available in the
injected main script with the following properties:

- `import.meta.url`: A `file:` URL corresponding to [`process.execPath`](https://nodejs.org/api/process.html#processexecpath).
- `import.meta.filename`: Equal to [`process.execPath`](https://nodejs.org/api/process.html#processexecpath).
- `import.meta.dirname`: The directory name of [`process.execPath`](https://nodejs.org/api/process.html#processexecpath).
- `import.meta.main`: `true`.

`import.meta.resolve` is currently not supported.

#### `import()` in the injected main script[\#](https://nodejs.org/api/single-executable-applications.html\#import-in-the-injected-main-script)

When using `"mainFormat": "module"`, `import()` can be used to dynamically
load built-in modules. Attempting to use `import()` to load modules from
the file system will throw an error.

#### Using native addons in the injected main script[\#](https://nodejs.org/api/single-executable-applications.html\#using-native-addons-in-the-injected-main-script)

Native addons can be bundled as assets into the single-executable application
by specifying them in the `assets` field of the configuration file used to
generate the single-executable application preparation blob.
The addon can then be loaded in the injected main script by writing the asset
to a temporary file and loading it with `process.dlopen()`.

```json
{
  "main": "/path/to/bundled/script.js",
  "output": "/path/to/write/the/generated/executable",
  "assets": {
    "myaddon.node": "/path/to/myaddon/build/Release/myaddon.node"
  }
}
jsoncopy
```

```js
// script.js
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { getRawAsset } = require('node:sea');
const addonPath = path.join(os.tmpdir(), 'myaddon.node');
fs.writeFileSync(addonPath, new Uint8Array(getRawAsset('myaddon.node')));
const myaddon = { exports: {} };
process.dlopen(myaddon, addonPath);
console.log(myaddon.exports);
fs.rmSync(addonPath);
jscopy
```

Known caveat: if the single-executable application is produced by postject running on a Linux arm64 docker container,
[the produced ELF binary does not have the correct hash table to load the addons](https://github.com/nodejs/postject/issues/105) and
will crash on `process.dlopen()`. Build the single-executable application on other platforms, or at least on
a non-container Linux arm64 environment to work around this issue.

### Notes[\#](https://nodejs.org/api/single-executable-applications.html\#notes)

#### Single executable application creation process[\#](https://nodejs.org/api/single-executable-applications.html\#single-executable-application-creation-process)

The process documented here is subject to change.

##### 1\. Generating single executable preparation blobs[\#](https://nodejs.org/api/single-executable-applications.html\#1-generating-single-executable-preparation-blobs)

To build a single executable application, Node.js would first generate a blob
that contains all the necessary information to run the bundled script.
When using `--build-sea`, this step is done internally along with the injection.

###### Dumping the preparation blob to disk[\#](https://nodejs.org/api/single-executable-applications.html\#dumping-the-preparation-blob-to-disk)

Before `--build-sea` was introduced, an older workflow was introduced to write the
preparation blob to disk for injection by external tools. This can still
be used for verification purposes.

To dump the preparation blob to disk for verification, use `--experimental-sea-config`.
This writes a file that can be injected into a Node.js binary using tools like [postject](https://github.com/nodejs/postject).

The configuration is similar to that of `--build-sea`, except that the
`output` field specifies the path to write the generated blob file instead of
the final executable.

```json
{
  "main": "/path/to/bundled/script.js",
  // Instead of the final executable, this is the path to write the blob.
  "output": "/path/to/write/the/generated/blob.blob"
}
jsoncopy
```

##### 2\. Injecting the preparation blob into the `node` binary[\#](https://nodejs.org/api/single-executable-applications.html\#2-injecting-the-preparation-blob-into-the-node-binary)

To complete the creation of a single executable application, the generated blob
needs to be injected into a copy of the `node` binary, as documented below.

When using `--build-sea`, this step is done internally along with the blob generation.

- If the `node` binary is a [PE](https://en.wikipedia.org/wiki/Portable_Executable) file, the blob should be injected as a resource
named `NODE_SEA_BLOB`.
- If the `node` binary is a [Mach-O](https://en.wikipedia.org/wiki/Mach-O) file, the blob should be injected as a section
named `NODE_SEA_BLOB` in the `NODE_SEA` segment.
- If the `node` binary is an [ELF](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format) file, the blob should be injected as a note
named `NODE_SEA_BLOB`.

Then, the SEA building process searches the binary for the
`NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2:0` [fuse](https://www.electronjs.org/docs/latest/tutorial/fuses) string and flip the
last character to `1` to indicate that a resource has been injected.

###### Injecting the preparation blob manually[\#](https://nodejs.org/api/single-executable-applications.html\#injecting-the-preparation-blob-manually)

Before `--build-sea` was introduced, an older workflow was introduced to allow
external tools to inject the generated blob into a copy of the `node` binary.

For example, with [postject](https://github.com/nodejs/postject):

1. Create a copy of the `node` executable and name it according to your needs:


   - On systems other than Windows:

```bash
cp $(command -v node) hello
bashcopy
```

   - On Windows:

```text
node -e "require('fs').copyFileSync(process.execPath, 'hello.exe')"
textcopy
```

The `.exe` extension is necessary.

2. Remove the signature of the binary (macOS and Windows only):


   - On macOS:

```bash
codesign --remove-signature hello
bashcopy
```

   - On Windows (optional):

[signtool](https://learn.microsoft.com/en-us/windows/win32/seccrypto/signtool) can be used from the installed [Windows SDK](https://developer.microsoft.com/en-us/windows/downloads/windows-sdk/). If this step is
skipped, ignore any signature-related warning from postject.

```powershell
signtool remove /s hello.exe
powershellcopy
```

3. Inject the blob into the copied binary by running `postject` with
the following options:


   - `hello` / `hello.exe` \- The name of the copy of the `node` executable
     created in step 4.
   - `NODE_SEA_BLOB` \- The name of the resource / note / section in the binary
     where the contents of the blob will be stored.
   - `sea-prep.blob` \- The name of the blob created in step 1.
   - `--sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2` \- The
     [fuse](https://www.electronjs.org/docs/latest/tutorial/fuses) used by the Node.js project to detect if a file has been injected.
   - `--macho-segment-name NODE_SEA` (only needed on macOS) - The name of the
     segment in the binary where the contents of the blob will be
     stored.

To summarize, here is the required command for each platform:
   - On Linux:


     ```bash
     npx postject hello NODE_SEA_BLOB sea-prep.blob \
         --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2
     bashcopy
     ```

   - On Windows - PowerShell:


     ```powershell
     npx postject hello.exe NODE_SEA_BLOB sea-prep.blob `
         --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2
     powershellcopy
     ```

   - On Windows - Command Prompt:


     ```text
     npx postject hello.exe NODE_SEA_BLOB sea-prep.blob ^
         --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2
     textcopy
     ```

   - On macOS:


     ```bash
     npx postject hello NODE_SEA_BLOB sea-prep.blob \
         --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 \
         --macho-segment-name NODE_SEA
     bashcopy
     ```

#### Platform support[\#](https://nodejs.org/api/single-executable-applications.html\#platform-support)

Single-executable support is tested regularly on CI only on the following
platforms:

- Windows
- macOS (arm64 only; x64 is not currently supported and is skipped in the
tests)
- Linux (all distributions [supported by Node.js](https://github.com/nodejs/node/blob/main/BUILDING.md#platform-list) except Alpine and all
architectures [supported by Node.js](https://github.com/nodejs/node/blob/main/BUILDING.md#platform-list) except s390x)

This is due to a lack of better tools to generate single-executables that can be
used to test this feature on other platforms.

Suggestions for other resource injection tools/workflows are welcomed. Please
start a discussion at [https://github.com/nodejs/single-executable/discussions](https://github.com/nodejs/single-executable/discussions)
to help us document them.
