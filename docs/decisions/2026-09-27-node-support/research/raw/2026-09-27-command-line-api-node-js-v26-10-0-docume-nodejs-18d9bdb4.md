---
url: https://nodejs.org/api/cli.html
retrieved: 2026-09-27
command: firecrawl scrape https://nodejs.org/api/cli.html --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Command-line API | Node.js v26.10.0 Documentation
---
[Skip to content](https://nodejs.org/api/cli.html#apicontent)

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

- [Command-line API](https://nodejs.org/api/cli.html#command-line-api)
  - [Synopsis](https://nodejs.org/api/cli.html#synopsis)
  - [Program entry point](https://nodejs.org/api/cli.html#program-entry-point)
  - [Options](https://nodejs.org/api/cli.html#options)
    - [`-`](https://nodejs.org/api/cli.html#-)
    - [`--`](https://nodejs.org/api/cli.html#--)
    - [`--abort-on-uncaught-exception`](https://nodejs.org/api/cli.html#--abort-on-uncaught-exception)
    - [`--allow-addons`](https://nodejs.org/api/cli.html#--allow-addons)
    - [`--allow-child-process`](https://nodejs.org/api/cli.html#--allow-child-process)
    - [`--allow-ffi`](https://nodejs.org/api/cli.html#--allow-ffi)
    - [`--allow-fs-read`](https://nodejs.org/api/cli.html#--allow-fs-read)
    - [`--allow-fs-vfs`](https://nodejs.org/api/cli.html#--allow-fs-vfs)
    - [`--allow-fs-write`](https://nodejs.org/api/cli.html#--allow-fs-write)
    - [`--allow-inspector`](https://nodejs.org/api/cli.html#--allow-inspector)
    - [`--allow-net`](https://nodejs.org/api/cli.html#--allow-net)
    - [`--allow-openssl-store`](https://nodejs.org/api/cli.html#--allow-openssl-store)
    - [`--allow-wasi`](https://nodejs.org/api/cli.html#--allow-wasi)
    - [`--allow-worker`](https://nodejs.org/api/cli.html#--allow-worker)
    - [`--bench`](https://nodejs.org/api/cli.html#--bench)
    - [`--bench-isolation=mode`](https://nodejs.org/api/cli.html#--bench-isolationmode)
    - [`--bench-name-pattern=pattern`](https://nodejs.org/api/cli.html#--bench-name-patternpattern)
    - [`--bench-reporter-destination=destination`](https://nodejs.org/api/cli.html#--bench-reporter-destinationdestination)
    - [`--bench-reporter=reporter`](https://nodejs.org/api/cli.html#--bench-reporterreporter)
    - [`--bench-samples=count`](https://nodejs.org/api/cli.html#--bench-samplescount)
    - [`--bench-warmup=count`](https://nodejs.org/api/cli.html#--bench-warmupcount)
    - [`--build-sea=config`](https://nodejs.org/api/cli.html#--build-seaconfig)
    - [`--build-snapshot`](https://nodejs.org/api/cli.html#--build-snapshot)
    - [`--build-snapshot-config`](https://nodejs.org/api/cli.html#--build-snapshot-config)
    - [`-c`, `--check`](https://nodejs.org/api/cli.html#-check)
    - [`--completion-bash`](https://nodejs.org/api/cli.html#--completion-bash)
    - [`-C condition`, `--conditions=condition`](https://nodejs.org/api/cli.html#-conditionscondition)
    - [`--cpu-prof`](https://nodejs.org/api/cli.html#--cpu-prof)
    - [`--cpu-prof-dir`](https://nodejs.org/api/cli.html#--cpu-prof-dir)
    - [`--cpu-prof-interval`](https://nodejs.org/api/cli.html#--cpu-prof-interval)
    - [`--cpu-prof-name`](https://nodejs.org/api/cli.html#--cpu-prof-name)
    - [`--diagnostic-dir=directory`](https://nodejs.org/api/cli.html#--diagnostic-dirdirectory)
    - [`--disable-proto=mode`](https://nodejs.org/api/cli.html#--disable-protomode)
    - [`--disable-sigusr1`](https://nodejs.org/api/cli.html#--disable-sigusr1)
    - [`--disable-warning=code-or-type`](https://nodejs.org/api/cli.html#--disable-warningcode-or-type)
    - [`--disable-wasm-trap-handler`](https://nodejs.org/api/cli.html#--disable-wasm-trap-handler)
    - [`--disallow-code-generation-from-strings`](https://nodejs.org/api/cli.html#--disallow-code-generation-from-strings)
    - [`--dns-result-order=order`](https://nodejs.org/api/cli.html#--dns-result-orderorder)
    - [`--enable-fips`](https://nodejs.org/api/cli.html#--enable-fips)
    - [`--enable-fips-indicator-events`](https://nodejs.org/api/cli.html#--enable-fips-indicator-events)
    - [`--enable-source-maps`](https://nodejs.org/api/cli.html#--enable-source-maps)
    - [`--entry-url`](https://nodejs.org/api/cli.html#--entry-url)
    - [`--env-file-if-exists=file`](https://nodejs.org/api/cli.html#--env-file-if-existsfile)
    - [`--env-file=file`](https://nodejs.org/api/cli.html#--env-filefile)
    - [`-e`, `--eval "script"`](https://nodejs.org/api/cli.html#-eval-script)
    - [`--experimental-addon-modules`](https://nodejs.org/api/cli.html#--experimental-addon-modules)
    - [`--experimental-bench`](https://nodejs.org/api/cli.html#--experimental-bench)
    - [`--experimental-config-file=path`, `--experimental-config-file`](https://nodejs.org/api/cli.html#--experimental-config-filepath---experimental-config-file)
    - [`--experimental-default-config-file`](https://nodejs.org/api/cli.html#--experimental-default-config-file)
    - [`--experimental-dtls`](https://nodejs.org/api/cli.html#--experimental-dtls)
    - [`--experimental-eventsource`](https://nodejs.org/api/cli.html#--experimental-eventsource)
    - [`--experimental-import-meta-resolve`](https://nodejs.org/api/cli.html#--experimental-import-meta-resolve)
    - [`--experimental-import-text`](https://nodejs.org/api/cli.html#--experimental-import-text)
    - [`--experimental-inspector-network-resource`](https://nodejs.org/api/cli.html#--experimental-inspector-network-resource)
    - [`--experimental-loader=module`](https://nodejs.org/api/cli.html#--experimental-loadermodule)
    - [`--experimental-network-inspection`](https://nodejs.org/api/cli.html#--experimental-network-inspection)
    - [`--experimental-package-map=<path>`](https://nodejs.org/api/cli.html#--experimental-package-mappath)
    - [`--experimental-print-required-tla`](https://nodejs.org/api/cli.html#--experimental-print-required-tla)
    - [`--experimental-quic`](https://nodejs.org/api/cli.html#--experimental-quic)
    - [`--experimental-sea-config`](https://nodejs.org/api/cli.html#--experimental-sea-config)
    - [`--experimental-shadow-realm`](https://nodejs.org/api/cli.html#--experimental-shadow-realm)
    - [`--experimental-storage-inspection`](https://nodejs.org/api/cli.html#--experimental-storage-inspection)
    - [`--experimental-stream-iter`](https://nodejs.org/api/cli.html#--experimental-stream-iter)
    - [`--experimental-test-coverage`](https://nodejs.org/api/cli.html#--experimental-test-coverage)
    - [`--experimental-test-module-mocks`](https://nodejs.org/api/cli.html#--experimental-test-module-mocks)
    - [`--experimental-test-tag-filter='<expr>'`](https://nodejs.org/api/cli.html#--experimental-test-tag-filterexpr)
    - [`--experimental-vfs`](https://nodejs.org/api/cli.html#--experimental-vfs)
    - [`--experimental-vm-modules`](https://nodejs.org/api/cli.html#--experimental-vm-modules)
    - [`--experimental-wasi-unstable-preview1`](https://nodejs.org/api/cli.html#--experimental-wasi-unstable-preview1)
    - [`--experimental-web-worker`](https://nodejs.org/api/cli.html#--experimental-web-worker)
    - [`--experimental-worker-inspection`](https://nodejs.org/api/cli.html#--experimental-worker-inspection)
    - [`--force-context-aware`](https://nodejs.org/api/cli.html#--force-context-aware)
    - [`--force-fips[=mode]`](https://nodejs.org/api/cli.html#--force-fipsmode)
    - [`--force-node-api-uncaught-exceptions-policy`](https://nodejs.org/api/cli.html#--force-node-api-uncaught-exceptions-policy)
    - [`--frozen-intrinsics`](https://nodejs.org/api/cli.html#--frozen-intrinsics)
    - [`--heap-prof`](https://nodejs.org/api/cli.html#--heap-prof)
    - [`--heap-prof-dir`](https://nodejs.org/api/cli.html#--heap-prof-dir)
    - [`--heap-prof-interval`](https://nodejs.org/api/cli.html#--heap-prof-interval)
    - [`--heap-prof-name`](https://nodejs.org/api/cli.html#--heap-prof-name)
    - [`--heapsnapshot-near-heap-limit=max_count`](https://nodejs.org/api/cli.html#--heapsnapshot-near-heap-limitmax_count)
    - [`--heapsnapshot-signal=signal`](https://nodejs.org/api/cli.html#--heapsnapshot-signalsignal)
    - [`-h`, `--help`](https://nodejs.org/api/cli.html#-help)
    - [`--icu-data-dir=file`](https://nodejs.org/api/cli.html#--icu-data-dirfile)
    - [`--import=module`](https://nodejs.org/api/cli.html#--importmodule)
    - [`--input-type=type`](https://nodejs.org/api/cli.html#--input-typetype)
    - [`--insecure-http-parser`](https://nodejs.org/api/cli.html#--insecure-http-parser)
    - [`--inspect-brk[=[host:]port]`](https://nodejs.org/api/cli.html#--inspect-brkhostport)
    - [`--inspect-port=[host:]port`](https://nodejs.org/api/cli.html#--inspect-porthostport)
    - [`--inspect-publish-uid=stderr,http`](https://nodejs.org/api/cli.html#--inspect-publish-uidstderrhttp)
    - [`--inspect-wait[=[host:]port]`](https://nodejs.org/api/cli.html#--inspect-waithostport)
    - [`--inspect[=[host:]port]`](https://nodejs.org/api/cli.html#--inspecthostport)
      - [Warning: binding inspector to a public IP:port combination is insecure](https://nodejs.org/api/cli.html#warning-binding-inspector-to-a-public-ipport-combination-is-insecure)
    - [`-i`, `--interactive`](https://nodejs.org/api/cli.html#-interactive)
    - [`--jitless`](https://nodejs.org/api/cli.html#--jitless)
    - [`--localstorage-file=file`](https://nodejs.org/api/cli.html#--localstorage-filefile)
    - [`--max-http-header-size=size`](https://nodejs.org/api/cli.html#--max-http-header-sizesize)
    - [`--max-old-space-size-percentage=percentage`](https://nodejs.org/api/cli.html#--max-old-space-size-percentagepercentage)
    - [`--network-family-autoselection-attempt-timeout`](https://nodejs.org/api/cli.html#--network-family-autoselection-attempt-timeout)
    - [`--no-addons`](https://nodejs.org/api/cli.html#--no-addons)
    - [`--no-async-context-frame`](https://nodejs.org/api/cli.html#--no-async-context-frame)
    - [`--no-deprecation`](https://nodejs.org/api/cli.html#--no-deprecation)
    - [`--no-experimental-detect-module`](https://nodejs.org/api/cli.html#--no-experimental-detect-module)
    - [`--no-experimental-ffi`](https://nodejs.org/api/cli.html#--no-experimental-ffi)
    - [`--no-experimental-global-navigator`](https://nodejs.org/api/cli.html#--no-experimental-global-navigator)
    - [`--no-experimental-repl-await`](https://nodejs.org/api/cli.html#--no-experimental-repl-await)
    - [`--no-experimental-require-module`](https://nodejs.org/api/cli.html#--no-experimental-require-module)
    - [`--no-experimental-sqlite`](https://nodejs.org/api/cli.html#--no-experimental-sqlite)
    - [`--no-experimental-websocket`](https://nodejs.org/api/cli.html#--no-experimental-websocket)
    - [`--no-experimental-webstorage`](https://nodejs.org/api/cli.html#--no-experimental-webstorage)
    - [`--no-extra-info-on-fatal-exception`](https://nodejs.org/api/cli.html#--no-extra-info-on-fatal-exception)
    - [`--no-force-async-hooks-checks`](https://nodejs.org/api/cli.html#--no-force-async-hooks-checks)
    - [`--no-global-search-paths`](https://nodejs.org/api/cli.html#--no-global-search-paths)
    - [`--no-network-family-autoselection`](https://nodejs.org/api/cli.html#--no-network-family-autoselection)
    - [`--no-require-module`](https://nodejs.org/api/cli.html#--no-require-module)
    - [`--no-strip-types`](https://nodejs.org/api/cli.html#--no-strip-types)
    - [`--no-warnings`](https://nodejs.org/api/cli.html#--no-warnings)
    - [`--no-worker-snapshot`](https://nodejs.org/api/cli.html#--no-worker-snapshot)
    - [`--node-memory-debug`](https://nodejs.org/api/cli.html#--node-memory-debug)
    - [`--openssl-config=file`](https://nodejs.org/api/cli.html#--openssl-configfile)
    - [`--openssl-legacy-provider`](https://nodejs.org/api/cli.html#--openssl-legacy-provider)
    - [`--openssl-shared-config`](https://nodejs.org/api/cli.html#--openssl-shared-config)
    - [`--pending-deprecation`](https://nodejs.org/api/cli.html#--pending-deprecation)
    - [`--permission`](https://nodejs.org/api/cli.html#--permission)
    - [`--permission-audit`](https://nodejs.org/api/cli.html#--permission-audit)
    - [`--preserve-symlinks`](https://nodejs.org/api/cli.html#--preserve-symlinks)
    - [`--preserve-symlinks-main`](https://nodejs.org/api/cli.html#--preserve-symlinks-main)
    - [`-p`, `--print "script"`](https://nodejs.org/api/cli.html#-print-script)
    - [`--prof`](https://nodejs.org/api/cli.html#--prof)
    - [`--prof-process`](https://nodejs.org/api/cli.html#--prof-process)
    - [`--redirect-warnings=file`](https://nodejs.org/api/cli.html#--redirect-warningsfile)
    - [`--report-compact`](https://nodejs.org/api/cli.html#--report-compact)
    - [`--report-dir=directory`, `--report-directory=directory`](https://nodejs.org/api/cli.html#--report-dirdirectory---report-directorydirectory)
    - [`--report-exclude-env`](https://nodejs.org/api/cli.html#--report-exclude-env)
    - [`--report-exclude-network`](https://nodejs.org/api/cli.html#--report-exclude-network)
    - [`--report-filename=filename`](https://nodejs.org/api/cli.html#--report-filenamefilename)
    - [`--report-on-fatalerror`](https://nodejs.org/api/cli.html#--report-on-fatalerror)
    - [`--report-on-signal`](https://nodejs.org/api/cli.html#--report-on-signal)
    - [`--report-signal=signal`](https://nodejs.org/api/cli.html#--report-signalsignal)
    - [`--report-uncaught-exception`](https://nodejs.org/api/cli.html#--report-uncaught-exception)
    - [`-r`, `--require module`](https://nodejs.org/api/cli.html#-require-module)
    - [`--run`](https://nodejs.org/api/cli.html#--run)
      - [Intentional limitations](https://nodejs.org/api/cli.html#intentional-limitations)
      - [Environment variables](https://nodejs.org/api/cli.html#environment-variables)
    - [`--secure-heap-min=n`](https://nodejs.org/api/cli.html#--secure-heap-minn)
    - [`--secure-heap=n`](https://nodejs.org/api/cli.html#--secure-heapn)
    - [`--snapshot-blob=path`](https://nodejs.org/api/cli.html#--snapshot-blobpath)
    - [`--test`](https://nodejs.org/api/cli.html#--test)
    - [`--test-concurrency`](https://nodejs.org/api/cli.html#--test-concurrency)
    - [`--test-coverage-branches=threshold`](https://nodejs.org/api/cli.html#--test-coverage-branchesthreshold)
    - [`--test-coverage-exclude`](https://nodejs.org/api/cli.html#--test-coverage-exclude)
    - [`--test-coverage-functions=threshold`](https://nodejs.org/api/cli.html#--test-coverage-functionsthreshold)
    - [`--test-coverage-include`](https://nodejs.org/api/cli.html#--test-coverage-include)
    - [`--test-coverage-include-all`](https://nodejs.org/api/cli.html#--test-coverage-include-all)
    - [`--test-coverage-lines=threshold`](https://nodejs.org/api/cli.html#--test-coverage-linesthreshold)
    - [`--test-force-exit`](https://nodejs.org/api/cli.html#--test-force-exit)
    - [`--test-global-setup=module`](https://nodejs.org/api/cli.html#--test-global-setupmodule)
    - [`--test-isolation=mode`](https://nodejs.org/api/cli.html#--test-isolationmode)
    - [`--test-name-pattern`](https://nodejs.org/api/cli.html#--test-name-pattern)
    - [`--test-only`](https://nodejs.org/api/cli.html#--test-only)
    - [`--test-random-seed`](https://nodejs.org/api/cli.html#--test-random-seed)
    - [`--test-randomize`](https://nodejs.org/api/cli.html#--test-randomize)
    - [`--test-reporter`](https://nodejs.org/api/cli.html#--test-reporter)
    - [`--test-reporter-destination`](https://nodejs.org/api/cli.html#--test-reporter-destination)
    - [`--test-rerun-failures`](https://nodejs.org/api/cli.html#--test-rerun-failures)
    - [`--test-shard`](https://nodejs.org/api/cli.html#--test-shard)
    - [`--test-skip-pattern`](https://nodejs.org/api/cli.html#--test-skip-pattern)
    - [`--test-timeout`](https://nodejs.org/api/cli.html#--test-timeout)
    - [`--test-update-snapshots`](https://nodejs.org/api/cli.html#--test-update-snapshots)
    - [`--throw-deprecation`](https://nodejs.org/api/cli.html#--throw-deprecation)
    - [`--title=title`](https://nodejs.org/api/cli.html#--titletitle)
    - [`--tls-cipher-list=list`](https://nodejs.org/api/cli.html#--tls-cipher-listlist)
    - [`--tls-keylog=file`](https://nodejs.org/api/cli.html#--tls-keylogfile)
    - [`--tls-max-v1.2`](https://nodejs.org/api/cli.html#--tls-max-v12)
    - [`--tls-max-v1.3`](https://nodejs.org/api/cli.html#--tls-max-v13)
    - [`--tls-min-v1.0`](https://nodejs.org/api/cli.html#--tls-min-v10)
    - [`--tls-min-v1.1`](https://nodejs.org/api/cli.html#--tls-min-v11)
    - [`--tls-min-v1.2`](https://nodejs.org/api/cli.html#--tls-min-v12)
    - [`--tls-min-v1.3`](https://nodejs.org/api/cli.html#--tls-min-v13)
    - [`--trace-deprecation`](https://nodejs.org/api/cli.html#--trace-deprecation)
    - [`--trace-env`](https://nodejs.org/api/cli.html#--trace-env)
    - [`--trace-env-js-stack`](https://nodejs.org/api/cli.html#--trace-env-js-stack)
    - [`--trace-env-native-stack`](https://nodejs.org/api/cli.html#--trace-env-native-stack)
    - [`--trace-event-categories`](https://nodejs.org/api/cli.html#--trace-event-categories)
    - [`--trace-event-file-pattern`](https://nodejs.org/api/cli.html#--trace-event-file-pattern)
    - [`--trace-events-enabled`](https://nodejs.org/api/cli.html#--trace-events-enabled)
    - [`--trace-exit`](https://nodejs.org/api/cli.html#--trace-exit)
    - [`--trace-require-module=mode`](https://nodejs.org/api/cli.html#--trace-require-modulemode)
    - [`--trace-sigint`](https://nodejs.org/api/cli.html#--trace-sigint)
    - [`--trace-sync-io`](https://nodejs.org/api/cli.html#--trace-sync-io)
    - [`--trace-tls`](https://nodejs.org/api/cli.html#--trace-tls)
    - [`--trace-uncaught`](https://nodejs.org/api/cli.html#--trace-uncaught)
    - [`--trace-warnings`](https://nodejs.org/api/cli.html#--trace-warnings)
    - [`--track-heap-objects`](https://nodejs.org/api/cli.html#--track-heap-objects)
    - [`--unhandled-rejections=mode`](https://nodejs.org/api/cli.html#--unhandled-rejectionsmode)
    - [`--use-bundled-ca`, `--use-openssl-ca`](https://nodejs.org/api/cli.html#--use-bundled-ca---use-openssl-ca)
    - [`--use-env-proxy`](https://nodejs.org/api/cli.html#--use-env-proxy)
    - [`--use-largepages=mode`](https://nodejs.org/api/cli.html#--use-largepagesmode)
    - [`--use-system-ca`](https://nodejs.org/api/cli.html#--use-system-ca)
    - [`--v8-options`](https://nodejs.org/api/cli.html#--v8-options)
    - [`--v8-pool-size=num`](https://nodejs.org/api/cli.html#--v8-pool-sizenum)
    - [`-v`, `--version`](https://nodejs.org/api/cli.html#-version)
    - [`--vfs-load=source`](https://nodejs.org/api/cli.html#--vfs-loadsource)
    - [`--vfs-mount=source`](https://nodejs.org/api/cli.html#--vfs-mountsource)
    - [`--watch`](https://nodejs.org/api/cli.html#--watch)
    - [`--watch-kill-signal`](https://nodejs.org/api/cli.html#--watch-kill-signal)
    - [`--watch-path`](https://nodejs.org/api/cli.html#--watch-path)
    - [`--watch-preserve-output`](https://nodejs.org/api/cli.html#--watch-preserve-output)
    - [`--zero-fill-buffers`](https://nodejs.org/api/cli.html#--zero-fill-buffers)
  - [Environment variables](https://nodejs.org/api/cli.html#environment-variables-1)
    - [`FORCE_COLOR=[1, 2, 3]`](https://nodejs.org/api/cli.html#force_color1-2-3)
    - [`NODE_COMPILE_CACHE=dir`](https://nodejs.org/api/cli.html#node_compile_cachedir)
    - [`NODE_COMPILE_CACHE_PORTABLE=1`](https://nodejs.org/api/cli.html#node_compile_cache_portable1)
    - [`NODE_COMPILE_CACHE_READONLY=1`](https://nodejs.org/api/cli.html#node_compile_cache_readonly1)
    - [`NODE_DEBUG=module[,…]`](https://nodejs.org/api/cli.html#node_debugmodule)
    - [`NODE_DEBUG_NATIVE=module[,…]`](https://nodejs.org/api/cli.html#node_debug_nativemodule)
    - [`NODE_DISABLE_COLORS=1`](https://nodejs.org/api/cli.html#node_disable_colors1)
    - [`NODE_DISABLE_COMPILE_CACHE=1`](https://nodejs.org/api/cli.html#node_disable_compile_cache1)
    - [`NODE_EXTRA_CA_CERTS=file`](https://nodejs.org/api/cli.html#node_extra_ca_certsfile)
    - [`NODE_ICU_DATA=file`](https://nodejs.org/api/cli.html#node_icu_datafile)
    - [`NODE_NO_WARNINGS=1`](https://nodejs.org/api/cli.html#node_no_warnings1)
    - [`NODE_OPTIONS=options...`](https://nodejs.org/api/cli.html#node_optionsoptions)
    - [`NODE_PATH=path[:…]`](https://nodejs.org/api/cli.html#node_pathpath)
    - [`NODE_PENDING_DEPRECATION=1`](https://nodejs.org/api/cli.html#node_pending_deprecation1)
    - [`NODE_PENDING_PIPE_INSTANCES=instances`](https://nodejs.org/api/cli.html#node_pending_pipe_instancesinstances)
    - [`NODE_PRESERVE_SYMLINKS=1`](https://nodejs.org/api/cli.html#node_preserve_symlinks1)
    - [`NODE_REDIRECT_WARNINGS=file`](https://nodejs.org/api/cli.html#node_redirect_warningsfile)
    - [`NODE_REPL_EXTERNAL_MODULE=file`](https://nodejs.org/api/cli.html#node_repl_external_modulefile)
    - [`NODE_REPL_HISTORY=file`](https://nodejs.org/api/cli.html#node_repl_historyfile)
    - [`NODE_SKIP_PLATFORM_CHECK=value`](https://nodejs.org/api/cli.html#node_skip_platform_checkvalue)
    - [`NODE_TEST_CONTEXT=value`](https://nodejs.org/api/cli.html#node_test_contextvalue)
    - [`NODE_TLS_REJECT_UNAUTHORIZED=value`](https://nodejs.org/api/cli.html#node_tls_reject_unauthorizedvalue)
    - [`NODE_USE_ENV_PROXY=1`](https://nodejs.org/api/cli.html#node_use_env_proxy1)
    - [`NODE_USE_SYSTEM_CA=1`](https://nodejs.org/api/cli.html#node_use_system_ca1)
    - [`NODE_V8_COVERAGE=dir`](https://nodejs.org/api/cli.html#node_v8_coveragedir)
      - [Coverage output](https://nodejs.org/api/cli.html#coverage-output)
      - [Source map cache](https://nodejs.org/api/cli.html#source-map-cache)
    - [`NO_COLOR=<any>`](https://nodejs.org/api/cli.html#no_colorany)
    - [`OPENSSL_CONF=file`](https://nodejs.org/api/cli.html#openssl_conffile)
    - [`SSL_CERT_DIR=dir`](https://nodejs.org/api/cli.html#ssl_cert_dirdir)
    - [`SSL_CERT_FILE=file`](https://nodejs.org/api/cli.html#ssl_cert_filefile)
    - [`TZ`](https://nodejs.org/api/cli.html#tz)
    - [`UV_THREADPOOL_SIZE=size`](https://nodejs.org/api/cli.html#uv_threadpool_sizesize)
  - [Useful V8 options](https://nodejs.org/api/cli.html#useful-v8-options)
    - [`--abort-on-uncaught-exception`](https://nodejs.org/api/cli.html#--abort-on-uncaught-exception-1)
    - [`--disallow-code-generation-from-strings`](https://nodejs.org/api/cli.html#--disallow-code-generation-from-strings-1)
    - [`--enable-etw-stack-walking`](https://nodejs.org/api/cli.html#--enable-etw-stack-walking)
    - [`--expose-gc`](https://nodejs.org/api/cli.html#--expose-gc)
    - [`--harmony-shadow-realm`](https://nodejs.org/api/cli.html#--harmony-shadow-realm)
    - [`--heap-snapshot-on-oom`](https://nodejs.org/api/cli.html#--heap-snapshot-on-oom)
    - [`--interpreted-frames-native-stack`](https://nodejs.org/api/cli.html#--interpreted-frames-native-stack)
    - [`--jitless`](https://nodejs.org/api/cli.html#--jitless-1)
    - [`--max-heap-size`](https://nodejs.org/api/cli.html#--max-heap-size)
    - [`--max-old-space-size=SIZE` (in MiB)](https://nodejs.org/api/cli.html#--max-old-space-sizesize-in-mib)
    - [`--max-semi-space-size=SIZE` (in MiB)](https://nodejs.org/api/cli.html#--max-semi-space-sizesize-in-mib)
    - [`--perf-basic-prof`](https://nodejs.org/api/cli.html#--perf-basic-prof)
    - [`--perf-basic-prof-only-functions`](https://nodejs.org/api/cli.html#--perf-basic-prof-only-functions)
    - [`--perf-prof`](https://nodejs.org/api/cli.html#--perf-prof)
    - [`--perf-prof-unwinding-info`](https://nodejs.org/api/cli.html#--perf-prof-unwinding-info)
    - [`--prof`](https://nodejs.org/api/cli.html#--prof-1)
    - [`--security-revert`](https://nodejs.org/api/cli.html#--security-revert)
    - [`--stack-trace-limit=limit`](https://nodejs.org/api/cli.html#--stack-trace-limitlimit)

## Command-line API[\#](https://nodejs.org/api/cli.html\#command-line-api)

Node.js comes with a variety of CLI options. These options expose built-in
debugging, multiple ways to execute scripts, and other helpful runtime options.

To view this documentation as a manual page in a terminal, run `man node`.

### Synopsis[\#](https://nodejs.org/api/cli.html\#synopsis)

`node [options] [V8 options] [<program-entry-point> | -e "script" | -] [--] [arguments]`

`node inspect [<program-entry-point> | -e "script" | <host>:<port>] …`

`node --v8-options`

Execute without arguments to start the [REPL](https://nodejs.org/api/repl.html).

For more info about `node inspect`, see the [debugger](https://nodejs.org/api/debugger.html) documentation.

### Program entry point[\#](https://nodejs.org/api/cli.html\#program-entry-point)

The program entry point is a specifier-like string. If the string is not an
absolute path, it's resolved as a relative path from the current working
directory. That entry point string is then resolved as if it's been requested
by `require()` from the current working directory. If no corresponding file
is found, an error is thrown.

By default, the resolved path is also loaded as if it's been requested by `require()`,
unless one of the conditions below apply—then it's loaded as if it's been requested
by `import()`:

- The program was started with a command-line flag that forces the entry
point to be loaded with ECMAScript module loader, such as `--import`.
- The file has an `.mjs`, `.mts` or `.wasm` extension.
- The file does not have a `.cjs` extension, and the nearest parent
`package.json` file contains a top-level [`"type"`](https://nodejs.org/api/packages.html#type) field with a value of
`"module"`.

See [module resolution and loading](https://nodejs.org/api/packages.html#module-resolution-and-loading) for more details.

### Options[\#](https://nodejs.org/api/cli.html\#options)

History

| Version | Changes |
| --- | --- |
| v10.12.0 | Underscores instead of dashes are now allowed for Node.js options as well, in addition to V8 options. |

[Stability: 2](https://nodejs.org/api/documentation.html#stability-index) \- Stable

All options, including V8 options, allow words to be separated by both
dashes (`-`) or underscores (`_`). For example, `--pending-deprecation` is
equivalent to `--pending_deprecation`.

If an option that takes a single value (such as `--max-http-header-size`) is
passed more than once, then the last passed value is used. Options from the
command line take precedence over options passed through the [`NODE_OPTIONS`](https://nodejs.org/api/cli.html#node_optionsoptions)
environment variable.

#### `-`[\#](https://nodejs.org/api/cli.html\#-)

Added in: v8.0.0

Alias for stdin. Analogous to the use of `-` in other command-line utilities,
meaning that the script is read from stdin, and the rest of the options
are passed to that script.

#### `--`[\#](https://nodejs.org/api/cli.html\#--)

Added in: v6.11.0

Indicate the end of node options. Pass the rest of the arguments to the script.
If no script filename or eval/print script is supplied prior to this, then
the next argument is used as a script filename.

#### `--abort-on-uncaught-exception`[\#](https://nodejs.org/api/cli.html\#--abort-on-uncaught-exception)

Added in: v0.10.8

Aborting instead of exiting causes a core file to be generated for post-mortem
analysis using a debugger (such as `lldb`, `gdb`, and `mdb`).

If this flag is passed, the behavior can still be set to not abort through
[`process.setUncaughtExceptionCaptureCallback()`](https://nodejs.org/api/process.html#processsetuncaughtexceptioncapturecallbackfn) (and through usage of the
`node:domain` module that uses it).

#### `--allow-addons`[\#](https://nodejs.org/api/cli.html\#--allow-addons)

Added in: v21.6.0, v20.12.0

Stability: 1.1 - Active development

When using the [Permission Model](https://nodejs.org/api/permissions.html#permission-model), the process will not be able to use
native addons by default.
Attempts to do so will throw an `ERR_DLOPEN_DISABLED` unless the
user explicitly passes the `--allow-addons` flag when starting Node.js.

Example:

```cjs
// Attempt to require an native addon
require('nodejs-addon-example');
cjscopy
```

```console
$ node --permission --allow-fs-read=* index.js
node:internal/modules/cjs/loader:1319
  return process.dlopen(module, path.toNamespacedPath(filename));
                 ^

Error: Cannot load native addon because loading addons is disabled.
    at Module._extensions..node (node:internal/modules/cjs/loader:1319:18)
    at Module.load (node:internal/modules/cjs/loader:1091:32)
    at Module._load (node:internal/modules/cjs/loader:938:12)
    at Module.require (node:internal/modules/cjs/loader:1115:19)
    at require (node:internal/modules/helpers:130:18)
    at Object.<anonymous> (/home/index.js:1:15)
    at Module._compile (node:internal/modules/cjs/loader:1233:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1287:10)
    at Module.load (node:internal/modules/cjs/loader:1091:32)
    at Module._load (node:internal/modules/cjs/loader:938:12) {
  code: 'ERR_DLOPEN_DISABLED'
}
consolecopy
```

#### `--allow-child-process`[\#](https://nodejs.org/api/cli.html\#--allow-child-process)

Added in: v20.0.0History

| Version | Changes |
| --- | --- |
| v24.4.0, v22.18.0 | When spawning process with the permission model enabled. The flags are inherit to the child Node.js process through NODE\_OPTIONS environment variable. |

Stability: 1.1 - Active development

When using the [Permission Model](https://nodejs.org/api/permissions.html#permission-model), the process will not be able to spawn any
child process by default.
Attempts to do so will throw an `ERR_ACCESS_DENIED` unless the
user explicitly passes the `--allow-child-process` flag when starting Node.js.

Example:

```js
const childProcess = require('node:child_process');
// Attempt to bypass the permission
childProcess.spawn('node', ['-e', 'require("fs").writeFileSync("/new-file", "example")']);
jscopy
```

```console
$ node --permission --allow-fs-read=* index.js
node:internal/child_process:388
  const err = this._handle.spawn(options);
                           ^
Error: Access to this API has been restricted
    at ChildProcess.spawn (node:internal/child_process:388:28)
    at node:internal/main/run_main_module:17:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'ChildProcess'
}
consolecopy
```

The `child_process.fork()` API inherits the execution arguments from the
parent process. This means that if Node.js is started with the Permission
Model enabled and the `--allow-child-process` flag is set, any child process
created using `child_process.fork()` will automatically receive all relevant
Permission Model flags.

This behavior also applies to `child_process.spawn()`, but in that case, the
flags are propagated via the `NODE_OPTIONS` environment variable rather than
directly through the process arguments.

#### `--allow-ffi`[\#](https://nodejs.org/api/cli.html\#--allow-ffi)

Added in: v26.1.0

Stability: 1.1 - Active development

When using the [Permission Model](https://nodejs.org/api/permissions.html#permission-model), the process will not be able to use FFI
APIs by default. Attempts to use FFI APIs will throw an `ERR_ACCESS_DENIED`
exception unless the user explicitly passes the `--allow-ffi` flag when
starting Node.js. The [`node:ffi`](https://nodejs.org/api/ffi.html) module is only available in builds with
FFI support.

Example:

```js
const { DynamicLibrary, suffix } = require('node:ffi');
const lib = new DynamicLibrary(`./mylib.${suffix}`);
jscopy
```

```console
$ node --permission index.js
Error: Access to this API has been restricted. Use --allow-ffi to manage permissions.
    at node:internal/main/run_main_module:17:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'FFI'
}
consolecopy
```

#### `--allow-fs-read`[\#](https://nodejs.org/api/cli.html\#--allow-fs-read)

Added in: v20.0.0History

| Version | Changes |
| --- | --- |
| v24.2.0, v22.17.0 | Entrypoints of your application are allowed to be read implicitly. |
| v23.5.0, v22.13.0 | Permission Model and --allow-fs flags are stable. |
| v20.7.0 | Paths delimited by comma (`,`) are no longer allowed. |

This flag configures file system read permissions using
the [Permission Model](https://nodejs.org/api/permissions.html#permission-model).

The valid arguments for the `--allow-fs-read` flag are:

- `*` \- To allow all `FileSystemRead` operations.
- Multiple paths can be allowed using multiple `--allow-fs-read` flags.
Example `--allow-fs-read=/folder1/ --allow-fs-read=/folder2/`

Examples can be found in the [File System Permissions](https://nodejs.org/api/permissions.html#file-system-permissions) documentation.

The initializer module and custom `--require` modules has a implicit
read permission.

```console
$ node --permission -r custom-require.js -r custom-require-2.js index.js
consolecopy
```

- The `custom-require.js`, `custom-require-2.js`, and `index.js` will be
by default in the allowed read list.

```js
process.permission.has('fs.read', 'index.js'); // true
process.permission.has('fs.read', 'custom-require.js'); // true
process.permission.has('fs.read', 'custom-require-2.js'); // true
jscopy
```

#### `--allow-fs-vfs`[\#](https://nodejs.org/api/cli.html\#--allow-fs-vfs)

Added in: v26.9.0

Stability: 1.1 - Active development

When using the [Permission Model](https://nodejs.org/api/permissions.html#permission-model), a [virtual file system](https://nodejs.org/api/vfs.html) cannot be
mounted by default: [`vfs.mount()`](https://nodejs.org/api/vfs.html#vfsmount) throws `ERR_INVALID_STATE` unless the
user explicitly passes the `--allow-fs-vfs` flag when starting Node.js.

A mounted VFS serves paths that the file system permissions do not describe,
so mounting one is gated on its own flag rather than on `--allow-fs-read` or
`--allow-fs-write`.

```console
$ node --experimental-vfs --permission --allow-fs-vfs app.js
consolecopy
```

#### `--allow-fs-write`[\#](https://nodejs.org/api/cli.html\#--allow-fs-write)

Added in: v20.0.0History

| Version | Changes |
| --- | --- |
| v23.5.0, v22.13.0 | Permission Model and --allow-fs flags are stable. |
| v20.7.0 | Paths delimited by comma (`,`) are no longer allowed. |

This flag configures file system write permissions using
the [Permission Model](https://nodejs.org/api/permissions.html#permission-model).

The valid arguments for the `--allow-fs-write` flag are:

- `*` \- To allow all `FileSystemWrite` operations.
- Multiple paths can be allowed using multiple `--allow-fs-write` flags.
Example `--allow-fs-write=/folder1/ --allow-fs-write=/folder2/`

Paths delimited by comma (`,`) are no longer allowed.
When passing a single flag with a comma a warning will be displayed.

Examples can be found in the [File System Permissions](https://nodejs.org/api/permissions.html#file-system-permissions) documentation.

#### `--allow-inspector`[\#](https://nodejs.org/api/cli.html\#--allow-inspector)

Added in: v25.0.0, v24.12.0

Stability: 1.0 - Early development

When using the [Permission Model](https://nodejs.org/api/permissions.html#permission-model), the process will not be able to connect
through inspector protocol.

Attempts to do so will throw an `ERR_ACCESS_DENIED` unless the
user explicitly passes the `--allow-inspector` flag when starting Node.js.

Example:

```js
const { Session } = require('node:inspector/promises');

const session = new Session();
session.connect();
jscopy
```

```console
$ node --permission index.js
Error: connect ERR_ACCESS_DENIED Access to this API has been restricted. Use --allow-inspector to manage permissions.
  code: 'ERR_ACCESS_DENIED',
}
consolecopy
```

#### `--allow-net`[\#](https://nodejs.org/api/cli.html\#--allow-net)

Added in: v25.0.0

Stability: 1.1 - Active development

When using the [Permission Model](https://nodejs.org/api/permissions.html#permission-model), the process will not be able to access
network by default.
Attempts to do so will throw an `ERR_ACCESS_DENIED` unless the
user explicitly passes the `--allow-net` flag when starting Node.js.

Example:

```js
const http = require('node:http');
// Attempt to bypass the permission
const req = http.get('http://example.com', () => {});

req.on('error', (err) => {
  console.log('err', err);
});
jscopy
```

```console
$ node --permission index.js
Error: connect ERR_ACCESS_DENIED Access to this API has been restricted. Use --allow-net to manage permissions.
  code: 'ERR_ACCESS_DENIED',
}
consolecopy
```

#### `--allow-openssl-store`[\#](https://nodejs.org/api/cli.html\#--allow-openssl-store)

Added in: v26.7.0

Stability: 1.1 - Active development

When using the [Permission Model](https://nodejs.org/api/permissions.html#permission-model), the process will not be able to use
OpenSSL STORE loaders by default, for example to load a private key from a
[`<URL>`](https://nodejs.org/api/url.html#the-whatwg-url-api) passed to [`crypto.createPrivateKey()`](https://nodejs.org/api/crypto.html#cryptocreateprivatekeykey). Attempts to do so will throw
an `ERR_ACCESS_DENIED` unless the user explicitly passes the
`--allow-openssl-store` flag. This permission can be dropped at runtime via
[`permission.drop()`](https://nodejs.org/api/permissions.html#permissiondropscope-reference).

This flag grants broad authority to configured OpenSSL STORE loaders. A loader
may access files, devices, tokens, or the network. Access performed by a loader
is not constrained by the `fs.read`, `fs.write`, or `net` permission scopes.

#### `--allow-wasi`[\#](https://nodejs.org/api/cli.html\#--allow-wasi)

Added in: v22.3.0, v20.16.0

Stability: 1.1 - Active development

When using the [Permission Model](https://nodejs.org/api/permissions.html#permission-model), the process will not be capable of creating
any WASI instances by default.
For security reasons, the call will throw an `ERR_ACCESS_DENIED` unless the
user explicitly passes the flag `--allow-wasi` in the main Node.js process.

Example:

```js
const { WASI } = require('node:wasi');
// Attempt to bypass the permission
new WASI({
  version: 'preview1',
  // Attempt to mount the whole filesystem
  preopens: {
    '/': '/',
  },
});
jscopy
```

```console
$ node --permission --allow-fs-read=* index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:30:49 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'WASI',
}
consolecopy
```

#### `--allow-worker`[\#](https://nodejs.org/api/cli.html\#--allow-worker)

Added in: v20.0.0

Stability: 1.1 - Active development

When using the [Permission Model](https://nodejs.org/api/permissions.html#permission-model), the process will not be able to create any
worker threads by default.
For security reasons, the call will throw an `ERR_ACCESS_DENIED` unless the
user explicitly pass the flag `--allow-worker` in the main Node.js process.

Example:

```js
const { Worker } = require('node:worker_threads');
// Attempt to bypass the permission
new Worker(__filename);
jscopy
```

```console
$ node --permission --allow-fs-read=* index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:17:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'WorkerThreads'
}
consolecopy
```

#### `--bench`[\#](https://nodejs.org/api/cli.html\#--bench)

Added in: v26.9.0

Stability: 1 - Experimental

Starts the Node.js command-line benchmark runner. At least one explicit file or
glob pattern is required:

```console
node --experimental-bench --bench benchmark.mjs
node --experimental-bench --bench 'benchmarks/**/*.js'
consolecopy
```

The `--experimental-bench` flag is required to use this flag or any other
`--bench-*` option.

Quote glob patterns to prevent expansion by the shell. Matching files are
sorted and executed serially. By default, each file runs in a separate child
process. Benchmark files declare benchmarks using `node:bench`; they must not
call `run()` themselves. See the [benchmark runner](https://nodejs.org/api/bench.html#command-line-runner) documentation for more
details.

This flag cannot be combined with `--test`, `--watch`, `--watch-path`,
`--check`, `--eval`, or `--interactive`.

#### `--bench-isolation=mode`[\#](https://nodejs.org/api/cli.html\#--bench-isolationmode)

Added in: v26.9.0

Stability: 1 - Experimental

Configures benchmark file isolation. When `mode` is `'process'`, each matching
file runs in a separate child process. This is the default. Files are still run
serially so their measured work does not overlap.

When `mode` is `'none'`, all matching files and benchmarks run serially in the
benchmark runner process. This reduces startup overhead but allows module,
heap, and process state to carry between files. User writes to stdout or stderr
also share destinations with benchmark reporters in this mode.

The supported modes are `'process'` and `'none'`.

#### `--bench-name-pattern=pattern`[\#](https://nodejs.org/api/cli.html\#--bench-name-patternpattern)

Added in: v26.9.0

Stability: 1 - Experimental

Only runs benchmarks whose full hierarchical name matches the JavaScript
regular expression `pattern`. Non-matching benchmarks are reported as skipped.

#### `--bench-reporter-destination=destination`[\#](https://nodejs.org/api/cli.html\#--bench-reporter-destinationdestination)

Added in: v26.9.0

Stability: 1 - Experimental

Specifies the destination for the corresponding benchmark reporter. The value
can be `stdout`, `stderr`, or a file path. A single reporter defaults to
`stdout` when no destination is specified.

#### `--bench-reporter=reporter`[\#](https://nodejs.org/api/cli.html\#--bench-reporterreporter)

Added in: v26.9.0

Stability: 1 - Experimental

Specifies a benchmark reporter. The built-in reporters are `spec` and `json`.
The `json` reporter emits newline-delimited JSON. A custom reporter can be
specified using a module specifier resolved from the current working directory.

This option can be repeated. When multiple reporters are specified, each must
have a corresponding `--bench-reporter-destination`. The default reporter is
`spec`.

#### `--bench-samples=count`[\#](https://nodejs.org/api/cli.html\#--bench-samplescount)

Added in: v26.9.0

Stability: 1 - Experimental

Overrides the maximum number of measured callback invocations for every
selected benchmark. A benchmark may finish earlier by calling
`context.done()`. `count` must be an integer between `1` and `4294967295`.

#### `--bench-warmup=count`[\#](https://nodejs.org/api/cli.html\#--bench-warmupcount)

Added in: v26.9.0

Stability: 1 - Experimental

Overrides the number of unreported warmup callback invocations for every
selected benchmark. `count` must be an integer between `0` and `4294967295`.

#### `--build-sea=config`[\#](https://nodejs.org/api/cli.html\#--build-seaconfig)

Added in: v25.5.0

Stability: 1.1 - Active development

Generates a [single executable application](https://nodejs.org/api/single-executable-applications.html) from a JSON
configuration file. The argument must be a path to the configuration file. If
the path is not absolute, it is resolved relative to the current working
directory.

For configuration fields, cross-platform notes, and asset APIs, see
the [single executable application](https://nodejs.org/api/single-executable-applications.html) documentation.

#### `--build-snapshot`[\#](https://nodejs.org/api/cli.html\#--build-snapshot)

Added in: v18.8.0History

| Version | Changes |
| --- | --- |
| v25.4.0, v24.13.1 | The snapshot building process is no longer experimental. |

Generates a snapshot blob when the process exits and writes it to
disk, which can be loaded later with `--snapshot-blob`.

When building the snapshot, if `--snapshot-blob` is not specified,
the generated blob will be written, by default, to `snapshot.blob`
in the current working directory. Otherwise it will be written to
the path specified by `--snapshot-blob`.

```console
$ echo "globalThis.foo = 'I am from the snapshot'" > snapshot.js

# Run snapshot.js to initialize the application and snapshot the
# state of it into snapshot.blob.
$ node --snapshot-blob snapshot.blob --build-snapshot snapshot.js

$ echo "console.log(globalThis.foo)" > index.js

# Load the generated snapshot and start the application from index.js.
$ node --snapshot-blob snapshot.blob index.js
I am from the snapshot
consolecopy
```

The [`v8.startupSnapshot` API](https://nodejs.org/api/v8.html#startup-snapshot-api) can be used to specify an entry point at
snapshot building time, thus avoiding the need of an additional entry
script at deserialization time:

```console
$ echo "require('v8').startupSnapshot.setDeserializeMainFunction(() => console.log('I am from the snapshot'))" > snapshot.js
$ node --snapshot-blob snapshot.blob --build-snapshot snapshot.js
$ node --snapshot-blob snapshot.blob
I am from the snapshot
consolecopy
```

For more information, check out the [`v8.startupSnapshot` API](https://nodejs.org/api/v8.html#startup-snapshot-api) documentation.

The snapshot currently only supports loading a single entrypoint during the
snapshot building process, which can load built-in modules, but not additional user-land modules.
Users can bundle their applications into a single script with their bundler
of choice before building a snapshot.

As it's complicated to ensure the serializablility of all built-in modules,
which are also growing over time, only a subset of the built-in modules are
well tested to be serializable during the snapshot building process.
The Node.js core test suite checks that a few fairly complex applications
can be snapshotted. The list of built-in modules being
[captured by the built-in snapshot of Node.js](https://github.com/nodejs/node/blob/b19525a33cc84033af4addd0f80acd4dc33ce0cf/test/parallel/test-bootstrap-modules.js#L24) is considered supported.
When the snapshot builder encounters a built-in module that cannot be
serialized, it may crash the snapshot building process. In that case a typical
workaround would be to delay loading that module until
runtime, using either [`v8.startupSnapshot.setDeserializeMainFunction()`](https://nodejs.org/api/v8.html#v8startupsnapshotsetdeserializemainfunctioncallback-data) or
[`v8.startupSnapshot.addDeserializeCallback()`](https://nodejs.org/api/v8.html#v8startupsnapshotadddeserializecallbackcallback-data). If serialization for
an additional module during the snapshot building process is needed,
please file a request in the [Node.js issue tracker](https://github.com/nodejs/node/issues) and link to it in the
[tracking issue for user-land snapshots](https://github.com/nodejs/node/issues/44014).

#### `--build-snapshot-config`[\#](https://nodejs.org/api/cli.html\#--build-snapshot-config)

Added in: v21.6.0, v20.12.0History

| Version | Changes |
| --- | --- |
| v25.4.0, v24.13.1 | The snapshot building process is no longer experimental. |

Specifies the path to a JSON configuration file which configures snapshot
creation behavior.

The following options are currently supported:

- `builder` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Required. Provides the name to the script that is executed
before building the snapshot, as if [`--build-snapshot`](https://nodejs.org/api/cli.html#--build-snapshot) had been passed
with `builder` as the main script name.
- `withoutCodeCache` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) Optional. Including the code cache reduces the
time spent on compiling functions included in the snapshot at the expense
of a bigger snapshot size and potentially breaking portability of the
snapshot.

When using this flag, additional script files provided on the command line will
not be executed and instead be interpreted as regular command line arguments.

#### `-c`, `--check`[\#](https://nodejs.org/api/cli.html\#-check)

Added in: v5.0.0, v4.2.0History

| Version | Changes |
| --- | --- |
| v10.0.0 | The `--require` option is now supported when checking a file. |

Syntax check the script without executing.

#### `--completion-bash`[\#](https://nodejs.org/api/cli.html\#--completion-bash)

Added in: v10.12.0

Print source-able bash completion script for Node.js.

```bash
node --completion-bash > node_bash_completion
source node_bash_completion
bashcopy
```

#### `-C condition`, `--conditions=condition`[\#](https://nodejs.org/api/cli.html\#-conditionscondition)

Added in: v14.9.0, v12.19.0History

| Version | Changes |
| --- | --- |
| v22.9.0, v20.18.0 | The flag is no longer experimental. |

Provide custom [conditional exports](https://nodejs.org/api/packages.html#conditional-exports) resolution conditions.

Any number of custom string condition names are permitted.

The default Node.js conditions of `"node"`, `"default"`, `"import"`, and
`"require"` will always apply as defined.

For example, to run a module with "development" resolutions:

```bash
node -C development app.js
bashcopy
```

#### `--cpu-prof`[\#](https://nodejs.org/api/cli.html\#--cpu-prof)

Added in: v12.0.0History

| Version | Changes |
| --- | --- |
| v22.4.0, v20.16.0 | The `--cpu-prof` flags are now stable. |

Starts the V8 CPU profiler on start up, and writes the CPU profile to disk
before exit.

If `--cpu-prof-dir` is not specified, the generated profile is placed
in the current working directory.

If `--cpu-prof-name` is not specified, the generated profile is
named `CPU.${yyyymmdd}.${hhmmss}.${pid}.${tid}.${seq}.cpuprofile`.

```console
$ node --cpu-prof index.js
$ ls *.cpuprofile
CPU.20190409.202950.15293.0.0.cpuprofile
consolecopy
```

If `--cpu-prof-name` is specified, the provided value is used as a template
for the file name. The following placeholder is supported and will be
substituted at runtime:

- `${pid}` — the current process ID

```console
$ node --cpu-prof --cpu-prof-name 'CPU.${pid}.cpuprofile' index.js
$ ls *.cpuprofile
CPU.15293.cpuprofile
consolecopy
```

#### `--cpu-prof-dir`[\#](https://nodejs.org/api/cli.html\#--cpu-prof-dir)

Added in: v12.0.0History

| Version | Changes |
| --- | --- |
| v22.4.0, v20.16.0 | The `--cpu-prof` flags are now stable. |

Specify the directory where the CPU profiles generated by `--cpu-prof` will
be placed.

The default value is controlled by the
[`--diagnostic-dir`](https://nodejs.org/api/cli.html#--diagnostic-dirdirectory) command-line option.

#### `--cpu-prof-interval`[\#](https://nodejs.org/api/cli.html\#--cpu-prof-interval)

Added in: v12.2.0History

| Version | Changes |
| --- | --- |
| v22.4.0, v20.16.0 | The `--cpu-prof` flags are now stable. |

Specify the sampling interval in microseconds for the CPU profiles generated
by `--cpu-prof`. The default is 1000 microseconds.

#### `--cpu-prof-name`[\#](https://nodejs.org/api/cli.html\#--cpu-prof-name)

Added in: v12.0.0History

| Version | Changes |
| --- | --- |
| v22.4.0, v20.16.0 | The `--cpu-prof` flags are now stable. |

Specify the file name of the CPU profile generated by `--cpu-prof`.

#### `--diagnostic-dir=directory`[\#](https://nodejs.org/api/cli.html\#--diagnostic-dirdirectory)

Set the directory to which all diagnostic output files are written.
Defaults to current working directory.

Affects the default output directory of:

- [`--cpu-prof-dir`](https://nodejs.org/api/cli.html#--cpu-prof-dir)
- [`--heap-prof-dir`](https://nodejs.org/api/cli.html#--heap-prof-dir)
- [`--redirect-warnings`](https://nodejs.org/api/cli.html#--redirect-warningsfile)

#### `--disable-proto=mode`[\#](https://nodejs.org/api/cli.html\#--disable-protomode)

Added in: v13.12.0, v12.17.0

Disable the `Object.prototype.__proto__` property. If `mode` is `delete`, the
property is removed entirely. If `mode` is `throw`, accesses to the
property throw an exception with the code `ERR_PROTO_ACCESS`.

#### `--disable-sigusr1`[\#](https://nodejs.org/api/cli.html\#--disable-sigusr1)

Added in: v23.7.0, v22.14.0History

| Version | Changes |
| --- | --- |
| v24.8.0, v22.20.0 | The option is no longer experimental. |

Disable the ability of starting a debugging session by sending a
`SIGUSR1` signal to the process.

#### `--disable-warning=code-or-type`[\#](https://nodejs.org/api/cli.html\#--disable-warningcode-or-type)

Added in: v21.3.0, v20.11.0History

| Version | Changes |
| --- | --- |
| v26.7.0 | The `--disable-warning` flag is now stable. |

Stability: 2 - Stable

Disable specific process warnings by `code` or `type`.

Warnings emitted from [`process.emitWarning()`](https://nodejs.org/api/process.html#processemitwarningwarning-options) may contain a
`code` and a `type`. This option will not-emit warnings that have a matching
`code` or `type`.

List of [deprecation warnings](https://nodejs.org/api/deprecations.html#list-of-deprecated-apis).

The Node.js core warning types are: `DeprecationWarning` and
`ExperimentalWarning`

For example, the following script will not emit
[DEP0025 `require('node:sys')`](https://nodejs.org/api/deprecations.html#dep0025-requirenodesys) when executed with
`node --disable-warning=DEP0025`:

```mjs
import sys from 'node:sys';
const sys = require('node:sys');
javascriptcopy
```

For example, the following script will emit the
[DEP0025 `require('node:sys')`](https://nodejs.org/api/deprecations.html#dep0025-requirenodesys), but not any Experimental
Warnings (such as
[ExperimentalWarning: `vm.measureMemory` is an experimental feature](https://nodejs.org/api/vm.html#vmmeasurememoryoptions)
in <=v21) when executed with `node --disable-warning=ExperimentalWarning`:

```mjs
import sys from 'node:sys';
import vm from 'node:vm';

vm.measureMemory();
const sys = require('node:sys');
const vm = require('node:vm');

vm.measureMemory();
javascriptcopy
```

#### `--disable-wasm-trap-handler`[\#](https://nodejs.org/api/cli.html\#--disable-wasm-trap-handler)

Added in: v22.2.0, v20.15.0History

| Version | Changes |
| --- | --- |
| v26.0.0 | Node.js now automatically disables the trap handler when there is not enough virtual memory available at startup to allocate one cage. |

Node.js enables V8's trap-handler-based WebAssembly bound checks on 64-bit platforms,
which significantly improves WebAssembly performance by eliminating the need for
inline bound checks. This optimization requires allocating a large virtual memory
cage per WebAssembly memory instance (currently typically 8GB for 32-bit WebAssembly memory,
16GB for 64-bit WebAssembly memory) to trap out-of-bound accesses. On most 64-bit
platforms, the virtual memory address space is usually large enough (around 128TB)
to accommodate typical WebAssembly usages, but if the machine has manual limits
on virtual memory (e.g. through `ulimit -v`), WebAssembly memory allocation is
more likely to fail with `WebAssembly.Memory(): could not allocate memory`.

At startup, Node.js automatically checks whether there is enough virtual memory
available to allocate at least one cage, and if not, the trap-handler optimization
is automatically disabled so that WebAssembly can still run using inline
bound checks (with less optimal performance). But if the application needs to create
many WebAssembly memory instances and the machine still configures a relatively high
limit on virtual memory, allocation of WebAssembly memory instances may still fail
more quickly than expected due to the raised virtual memory usage.

`--disable-wasm-trap-handler` fully disables this optimization so that WebAssembly memory
instances always use inline bound checks instead of reserving large virtual memory cages.
This allows more instances to be created when the virtual memory address space available
to the Node.js process is limited.

#### `--disallow-code-generation-from-strings`[\#](https://nodejs.org/api/cli.html\#--disallow-code-generation-from-strings)

Added in: v9.8.0

Make built-in language features like `eval` and `new Function` that generate
code from strings throw an exception instead. This does not affect the Node.js
`node:vm` module.

#### `--dns-result-order=order`[\#](https://nodejs.org/api/cli.html\#--dns-result-orderorder)

Added in: v16.4.0, v14.18.0History

| Version | Changes |
| --- | --- |
| v22.1.0, v20.13.0 | The `ipv6first` is supported now. |
| v17.0.0 | Changed default value to `verbatim`. |

Set the default value of `order` in [`dns.lookup()`](https://nodejs.org/api/dns.html#dnslookuphostname-options-callback) and
[`dnsPromises.lookup()`](https://nodejs.org/api/dns.html#dnspromiseslookuphostname-options). The value could be:

- `ipv4first`: sets default `order` to `ipv4first`.
- `ipv6first`: sets default `order` to `ipv6first`.
- `verbatim`: sets default `order` to `verbatim`.

The default is `verbatim` and [`dns.setDefaultResultOrder()`](https://nodejs.org/api/dns.html#dnssetdefaultresultorderorder) have higher
priority than `--dns-result-order`.

#### `--enable-fips`[\#](https://nodejs.org/api/cli.html\#--enable-fips)

Added in: v6.0.0

Enable [FIPS mode](https://nodejs.org/api/crypto.html#fips-mode) at startup. With OpenSSL 3, a configured provider named
`fips` must be available and initialize successfully. With OpenSSL 1.1.1,
Node.js must be built against a FIPS-capable OpenSSL.

#### `--enable-fips-indicator-events`[\#](https://nodejs.org/api/cli.html\#--enable-fips-indicator-events)

Added in: v26.9.0

Publish OpenSSL FIPS indicator results to the
[`'crypto.fips.indicator'`](https://nodejs.org/api/diagnostics_channel.html#event-cryptofipsindicator) diagnostics channel. This option requires OpenSSL
3.4 or later. It does not enable [FIPS mode](https://nodejs.org/api/crypto.html#fips-mode) or change whether an operation
is permitted.

#### `--enable-source-maps`[\#](https://nodejs.org/api/cli.html\#--enable-source-maps)

Added in: v12.12.0History

| Version | Changes |
| --- | --- |
| v15.11.0, v14.18.0 | This API is no longer experimental. |

Enable [Source Map](https://tc39.es/ecma426/) support for stack traces.

When using a transpiler, such as TypeScript, stack traces thrown by an
application reference the transpiled code, not the original source position.
`--enable-source-maps` enables caching of Source Maps and makes a best
effort to report stack traces relative to the original source file.

Overriding `Error.prepareStackTrace` may prevent `--enable-source-maps` from
modifying the stack trace. Call and return the results of the original
`Error.prepareStackTrace` in the overriding function to modify the stack trace
with source maps.

```js
const originalPrepareStackTrace = Error.prepareStackTrace;
Error.prepareStackTrace = (error, trace) => {
  // Modify error and trace and format stack trace with
  // original Error.prepareStackTrace.
  return originalPrepareStackTrace(error, trace);
};
jscopy
```

Note, enabling source maps can introduce latency to your application
when `Error.stack` is accessed. If you access `Error.stack` frequently
in your application, take into account the performance implications
of `--enable-source-maps`.

#### `--entry-url`[\#](https://nodejs.org/api/cli.html\#--entry-url)

Added in: v23.0.0, v22.10.0

Stability: 1 - Experimental

When present, Node.js will interpret the entry point as a URL, rather than a
path.

Follows [ECMAScript module](https://nodejs.org/api/esm.html#modules-ecmascript-modules) resolution rules.

Any query parameter or hash in the URL will be accessible via [`import.meta.url`](https://nodejs.org/api/esm.html#importmetaurl).

```bash
node --entry-url 'file:///path/to/file.js?queryparams=work#and-hashes-too'
node --entry-url 'file.ts?query#hash'
node --entry-url 'data:text/javascript,console.log("Hello")'
bashcopy
```

#### `--env-file-if-exists=file`[\#](https://nodejs.org/api/cli.html\#--env-file-if-existsfile)

Added in: v22.9.0History

| Version | Changes |
| --- | --- |
| v24.10.0, v22.21.0 | The `--env-file-if-exists` flag is no longer experimental. |

Behavior is the same as [`--env-file`](https://nodejs.org/api/cli.html#--env-filefile), but an error is not thrown if the file
does not exist.

#### `--env-file=file`[\#](https://nodejs.org/api/cli.html\#--env-filefile)

Added in: v20.6.0History

| Version | Changes |
| --- | --- |
| v24.10.0, v22.21.0 | The `--env-file` flag is no longer experimental. |
| v21.7.0, v20.12.0 | Add support to multi-line values. |

Loads environment variables from a file relative to the current directory,
making them available to applications on `process.env`. The [environment\\
variables which configure Node.js](https://nodejs.org/api/cli.html#environment-variables-1), such as `NODE_OPTIONS`,
are parsed and applied. If the same variable is defined in the environment and
in the file, the value from the environment takes precedence.

You can pass multiple `--env-file` arguments. Subsequent files override
pre-existing variables defined in previous files.

An error is thrown if the file does not exist.

```bash
node --env-file=.env --env-file=.development.env index.js
bashcopy
```

The format of the file should be one line per key-value pair of environment
variable name and value separated by `=`:

```text
PORT=3000
textcopy
```

Any text after a `#` is treated as a comment:

```text
# This is a comment
PORT=3000 # This is also a comment
textcopy
```

Values can start and end with the following quotes: `````, `"` or `'`.
They are omitted from the values.

```text
USERNAME="nodejs" # will result in `nodejs` as the value.
textcopy
```

Multi-line values are supported:

```text
MULTI_LINE="THIS IS
A MULTILINE"
# will result in `THIS IS\nA MULTILINE` as the value.
textcopy
```

Export keyword before a key is ignored:

```text
export USERNAME="nodejs" # will result in `nodejs` as the value.
textcopy
```

If you want to load environment variables from a file that may not exist, you
can use the [`--env-file-if-exists`](https://nodejs.org/api/cli.html#--env-file-if-existsfile) flag instead.

#### `-e`, `--eval "script"`[\#](https://nodejs.org/api/cli.html\#-eval-script)

Added in: v0.5.2History

| Version | Changes |
| --- | --- |
| v22.6.0 | Eval now supports experimental type-stripping. |
| v5.11.0 | Built-in libraries are now available as predefined variables. |

Evaluate the following argument as JavaScript. The modules which are
predefined in the REPL can also be used in `script`.

If `script` starts with `-`, pass it using `=` (for example,
`node --print --eval=-42`) so it is parsed as the value of `--eval`.

On Windows, using `cmd.exe` a single quote will not work correctly because it
only recognizes double `"` for quoting. In Powershell or Git bash, both `'`
and `"` are usable.

It is possible to run code containing inline types unless the
[`--no-strip-types`](https://nodejs.org/api/cli.html#--no-strip-types) flag is provided.

#### `--experimental-addon-modules`[\#](https://nodejs.org/api/cli.html\#--experimental-addon-modules)

Added in: v23.6.0, v22.20.0History

| Version | Changes |
| --- | --- |
| v26.5.0 | This is enabled by default. |

Stability: 1.2 - Release candidate

Enable experimental import support for `.node` addons.

#### `--experimental-bench`[\#](https://nodejs.org/api/cli.html\#--experimental-bench)

Added in: v26.9.0

Stability: 1 - Experimental

Enable the experimental `node:bench` module and command-line benchmark runner.

#### `--experimental-config-file=path`, `--experimental-config-file`[\#](https://nodejs.org/api/cli.html\#--experimental-config-filepath---experimental-config-file)

Added in: v23.10.0, v22.16.0History

| Version | Changes |
| --- | --- |
| v26.7.0 | Marked as release candidate. |

Stability: 1.2 - Release candidate

If present, Node.js will look for a configuration file at the specified path.
If the path is not specified, Node.js will look for a `node.config.json` file
in the current working directory.
To specify a custom path, use the `--experimental-config-file=path` form.
The space-separated `--experimental-config-file path` form is not supported.
The alias `--experimental-default-config-file` is equivalent to
`--experimental-config-file` without an argument.
Node.js will read the configuration file and apply the settings. The
configuration file should be a JSON file with the following structure. `vX.Y.Z`
in the `$schema` must be replaced with the version of Node.js you are using or
`latest-vX.x` for the latest version of that major release line.

```json
{
  "$schema": "https://nodejs.org/dist/vX.Y.Z/docs/node-config-schema.json",
  "nodeOptions": {
    "import": [\
      "amaro/strip"\
    ],
    "watch-path": "src",
    "watch-preserve-output": true
  },
  "test": {
    "test-isolation": "process"
  },
  "watch": {
    "watch-preserve-output": true
  }
}
jsoncopy
```

The configuration file supports namespace-specific options:

- The `nodeOptions` field contains CLI flags that are allowed in [`NODE_OPTIONS`](https://nodejs.org/api/cli.html#node_optionsoptions).

- Namespace fields like `test`, `watch`, and `permission` contain configuration specific to that subsystem.


The configuration file can target a specific Node.js major version with
`nodeVersion`:

```json
{
  "nodeVersion": 25,
  "nodeOptions": {
    "watch-path": "src"
  }
}
jsoncopy
```

To keep multiple version-specific configurations in the same file, use the
`configs` array. Node.js will use the first entry whose `nodeVersion` matches
the current Node.js major version:

```json
{
  "$schema": "https://nodejs.org/dist/latest-v26.x/docs/node-config-schema.json",
  "configs": [\
    {\
      "nodeVersion": 25,\
      "config": {\
        "$schema": "https://nodejs.org/dist/latest-v25.x/docs/node-config-schema.json",\
        "nodeOptions": {\
          "watch-path": "src"\
        }\
      }\
    }\
  ]
}
jsoncopy
```

When `configs` is used, the top level may only contain `$schema` and
`configs`. Each `configs` item must define an integer `nodeVersion` and an
object `config`. A single top-level config does not require `nodeVersion`, but
if present it must match the current Node.js major version.

When a namespace is present in the
configuration file, Node.js automatically enables the corresponding flag
(e.g., `--test`, `--watch`, `--permission`). This allows you to configure
subsystem-specific options without explicitly passing the flag on the command line.

For example:

```json
{
  "test": {
    "test-isolation": "process"
  }
}
jsoncopy
```

is equivalent to:

```bash
node --test --test-isolation=process
bashcopy
```

To disable the automatic flag while still using namespace options, you can
explicitly set the flag to `false` within the namespace:

```json
{
  "test": {
    "test": false,
    "test-isolation": "process"
  }
}
jsoncopy
```

No-op flags are not supported.
Not all V8 flags are currently supported.

It is possible to use the [official JSON schema](https://nodejs.org/node-config-schema.json)
to validate the configuration file, which may vary depending on the Node.js version.
Each key in the configuration file corresponds to a flag that can be passed
as a command-line argument. The value of the key is the value that would be
passed to the flag.

For example, the configuration file above is equivalent to
the following command-line arguments:

```bash
node --import amaro/strip --watch-path=src --watch-preserve-output --test-isolation=process
bashcopy
```

The priority in configuration is as follows:

1. NODE\_OPTIONS and command-line options
2. Dotenv NODE\_OPTIONS
3. Configuration file

Values in the configuration file will not override the values in the environment
variables, command-line options, or the `NODE_OPTIONS` env file parsed by the
`--env-file` flag.

Keys cannot be duplicated within the same or different namespaces.

The configuration parser will throw an error if the configuration file contains
unknown keys or keys that cannot be used in a namespace.

Node.js will not sanitize or perform validation on the user-provided configuration,
so **NEVER** use untrusted configuration files.

#### `--experimental-default-config-file`[\#](https://nodejs.org/api/cli.html\#--experimental-default-config-file)

Added in: v23.10.0, v22.16.0

Stability: 1.0 - Early development

This flag is an alias for `--experimental-config-file` without an argument.
If present, Node.js will look for a
`node.config.json` file in the current working directory and load it as a
configuration file.

#### `--experimental-dtls`[\#](https://nodejs.org/api/cli.html\#--experimental-dtls)

Added in: v26.9.0

Stability: 1 - Experimental

Enable experimental support for the DTLS protocol. See the
[dtls documentation](https://nodejs.org/api/dtls.html) for details.

#### `--experimental-eventsource`[\#](https://nodejs.org/api/cli.html\#--experimental-eventsource)

Added in: v22.3.0, v20.18.0

Enable exposition of [EventSource Web API](https://html.spec.whatwg.org/multipage/server-sent-events.html#server-sent-events) on the global scope.

#### `--experimental-import-meta-resolve`[\#](https://nodejs.org/api/cli.html\#--experimental-import-meta-resolve)

Added in: v13.9.0, v12.16.2History

| Version | Changes |
| --- | --- |
| v20.6.0, v18.19.0 | synchronous import.meta.resolve made available by default, with the flag retained for enabling the experimental second argument as previously supported. |

Enable experimental `import.meta.resolve()` parent URL support, which allows
passing a second `parentURL` argument for contextual resolution.

Previously gated the entire `import.meta.resolve` feature.

#### `--experimental-import-text`[\#](https://nodejs.org/api/cli.html\#--experimental-import-text)

Added in: v26.5.0

Stability: 1.0 - Early development

Enable experimental support for importing modules with
`with { type: 'text' }`.

#### `--experimental-inspector-network-resource`[\#](https://nodejs.org/api/cli.html\#--experimental-inspector-network-resource)

Added in: v24.5.0, v22.19.0

Stability: 1.1 - Active Development

Enable experimental support for inspector network resources.

#### `--experimental-loader=module`[\#](https://nodejs.org/api/cli.html\#--experimental-loadermodule)

Added in: v8.8.0History

| Version | Changes |
| --- | --- |
| v23.6.1, v22.13.1, v20.18.2 | Using this feature with the permission model enabled requires passing `--allow-worker`. |
| v12.11.1 | This flag was renamed from `--loader` to `--experimental-loader`. |

> This flag is discouraged and may be removed in a future version of Node.js.
> Please use
> [`--import` with `register()`](https://nodejs.org/api/module.html#registration-of-asynchronous-customization-hooks) instead.

Specify the `module` containing exported [asynchronous module customization hooks](https://nodejs.org/api/module.html#asynchronous-customization-hooks).
`module` may be any string accepted as an [`import` specifier](https://nodejs.org/api/esm.html#import-specifiers).

This feature requires `--allow-worker` if used with the [Permission Model](https://nodejs.org/api/permissions.html#permission-model).

#### `--experimental-network-inspection`[\#](https://nodejs.org/api/cli.html\#--experimental-network-inspection)

Added in: v22.6.0, v20.18.0

Stability: 1 - Experimental

Enable experimental support for the network inspection with Chrome DevTools.

#### `--experimental-package-map=<path>`[\#](https://nodejs.org/api/cli.html\#--experimental-package-mappath)

Added in: v26.4.0

Stability: 1 - Experimental

Enable experimental package map resolution. The `path` argument specifies the
location of a JSON configuration file that defines package resolution mappings.

```bash
node --experimental-package-map=./package-map.json app.js
bashcopy
```

When enabled, bare specifier resolution consults the package map for resolution.
This allows explicit control over which packages can import which dependencies.

See [Package maps](https://nodejs.org/api/packages.html#package-maps) for details on the configuration file format and
resolution algorithm.

#### `--experimental-print-required-tla`[\#](https://nodejs.org/api/cli.html\#--experimental-print-required-tla)

Added in: v22.0.0, v20.17.0History

| Version | Changes |
| --- | --- |
| v26.5.0 | Print the top-level awaits without evaluating the modules. |

If the ES module graph cannot be `require()`'d because it contains any top-level `await`,
this flag allows Node.js to locate and print their locations.

#### `--experimental-quic`[\#](https://nodejs.org/api/cli.html\#--experimental-quic)

Added in: v25.0.0

Stability: 1.1 - Active development

Enable experimental support for the QUIC protocol.

#### `--experimental-sea-config`[\#](https://nodejs.org/api/cli.html\#--experimental-sea-config)

Added in: v20.0.0

Stability: 1 - Experimental

Use this flag to generate a blob that can be injected into the Node.js
binary to produce a [single executable application](https://nodejs.org/api/single-executable-applications.html). See the documentation
about [this configuration](https://nodejs.org/api/single-executable-applications.html#1-generating-single-executable-preparation-blobs) for details.

#### `--experimental-shadow-realm`[\#](https://nodejs.org/api/cli.html\#--experimental-shadow-realm)

Added in: v19.0.0, v18.13.0

Use this flag to enable [ShadowRealm](https://github.com/tc39/proposal-shadowrealm) support.

#### `--experimental-storage-inspection`[\#](https://nodejs.org/api/cli.html\#--experimental-storage-inspection)

Added in: v25.5.0

Stability: 1.1 - Active Development

Enable experimental support for storage inspection

#### `--experimental-stream-iter`[\#](https://nodejs.org/api/cli.html\#--experimental-stream-iter)

Added in: v25.9.0

Stability: 1 - Experimental

Enable the experimental [`node:stream/iter`](https://nodejs.org/api/stream_iter.html) module.

#### `--experimental-test-coverage`[\#](https://nodejs.org/api/cli.html\#--experimental-test-coverage)

Added in: v19.7.0, v18.15.0History

| Version | Changes |
| --- | --- |
| v20.1.0, v18.17.0 | This option can be used with `--test`. |

When used in conjunction with the `node:test` module, a code coverage report is
generated as part of the test runner output. If no tests are run, a coverage
report is not generated. See the documentation on
[collecting code coverage from tests](https://nodejs.org/api/test.html#collecting-code-coverage) for more details.

#### `--experimental-test-module-mocks`[\#](https://nodejs.org/api/cli.html\#--experimental-test-module-mocks)

Added in: v22.3.0, v20.18.0History

| Version | Changes |
| --- | --- |
| v23.6.1, v22.13.1, v20.18.2 | Using this feature with the permission model enabled requires passing `--allow-worker`. |

Stability: 1.0 - Early development

Enable module mocking in the test runner.

This feature requires `--allow-worker` if used with the [Permission Model](https://nodejs.org/api/permissions.html#permission-model).

#### `--experimental-test-tag-filter='<expr>'`[\#](https://nodejs.org/api/cli.html\#--experimental-test-tag-filterexpr)

Added in: v26.2.0

Stability: 1.0 - Early development

Run only tests that match the provided boolean tag-filter expression. Tests
declare tags via the `tags` option on `test()`, `it()`, `suite()`, or
`describe()`. Tags inherit from suites to nested tests by union.

The expression supports boolean operators (`and`/`&&`, `or`/`||`,
`not`/`!`), parentheses for grouping, and `*` wildcards inside identifiers.
Standard precedence applies: `not` binds tighter than `and`, which binds
tighter than `or`. See [Test tags](https://nodejs.org/api/test.html#test-tags) for the full grammar and behavior.

The flag may be specified more than once; multiple expressions are combined
with AND, so a test must satisfy every expression to run.

A malformed expression causes the test runner to exit with a non-zero status
before running any tests.

#### `--experimental-vfs`[\#](https://nodejs.org/api/cli.html\#--experimental-vfs)

Added in: v26.4.0

Stability: 1 - Experimental

Enable the experimental [`node:vfs`](https://nodejs.org/api/vfs.html) module.

#### `--experimental-vm-modules`[\#](https://nodejs.org/api/cli.html\#--experimental-vm-modules)

Added in: v9.6.0

Enable experimental ES Module support in the `node:vm` module.

#### `--experimental-wasi-unstable-preview1`[\#](https://nodejs.org/api/cli.html\#--experimental-wasi-unstable-preview1)

Added in: v13.3.0, v12.16.0History

| Version | Changes |
| --- | --- |
| v20.0.0, v18.17.0 | This option is no longer required as WASI is enabled by default, but can still be passed. |
| v13.6.0 | changed from `--experimental-wasi-unstable-preview0` to `--experimental-wasi-unstable-preview1`. |

Enable experimental WebAssembly System Interface (WASI) support.

#### `--experimental-web-worker`[\#](https://nodejs.org/api/cli.html\#--experimental-web-worker)

Added in: v26.9.0

Enable experimental support for the Web Worker API.

#### `--experimental-worker-inspection`[\#](https://nodejs.org/api/cli.html\#--experimental-worker-inspection)

Added in: v24.1.0, v22.17.0

Stability: 1.1 - Active Development

Enable experimental support for the worker inspection with Chrome DevTools.

#### `--force-context-aware`[\#](https://nodejs.org/api/cli.html\#--force-context-aware)

Added in: v12.12.0

Disable loading native addons that are not [context-aware](https://nodejs.org/api/addons.html#context-aware-addons).

#### `--force-fips[=mode]`[\#](https://nodejs.org/api/cli.html\#--force-fipsmode)

Added in: v6.0.0History

| Version | Changes |
| --- | --- |
| v26.9.0 | Added the optional `provider` and `strict` modes. |

Enable [FIPS mode](https://nodejs.org/api/crypto.html#fips-mode) at startup and prevent it from being disabled from script
code. The same OpenSSL requirements as [`--enable-fips`](https://nodejs.org/api/cli.html#--enable-fips) apply.

An optional mode can be specified using `--force-fips=mode`:

- `provider`: Preserve the OpenSSL FIPS provider's configured handling of
non-approved operations. This is the current default when the mode is
omitted.
- `strict`: Reject non-approved operations reported through the OpenSSL FIPS
indicator callback. This mode requires OpenSSL 3.4 or later.

The `strict` mode only covers operations reported through the callback for
OpenSSL's default library context. It does not cover native addons that use
another `OSSL_LIB_CTX` or another copy of `libcrypto`, nor operation-specific
indicators that do not invoke the callback.

#### `--force-node-api-uncaught-exceptions-policy`[\#](https://nodejs.org/api/cli.html\#--force-node-api-uncaught-exceptions-policy)

Added in: v18.3.0, v16.17.0

Enforces `uncaughtException` event on Node-API asynchronous callbacks.

To prevent from an existing add-on from crashing the process, this flag is not
enabled by default. In the future, this flag will be enabled by default to
enforce the correct behavior.

#### `--frozen-intrinsics`[\#](https://nodejs.org/api/cli.html\#--frozen-intrinsics)

Added in: v11.12.0

Stability: 1 - Experimental

Enable experimental frozen intrinsics like `Array` and `Object`.

Only the root context is supported. There is no guarantee that
`globalThis.Array` is indeed the default intrinsic reference. Code may break
under this flag.

To allow polyfills to be added,
[`--require`](https://nodejs.org/api/cli.html#-r---require-module) and [`--import`](https://nodejs.org/api/cli.html#--importmodule) both run before freezing intrinsics.

#### `--heap-prof`[\#](https://nodejs.org/api/cli.html\#--heap-prof)

Added in: v12.4.0History

| Version | Changes |
| --- | --- |
| v22.4.0, v20.16.0 | The `--heap-prof` flags are now stable. |

Starts the V8 heap profiler on start up, and writes the heap profile to disk
before exit.

If `--heap-prof-dir` is not specified, the generated profile is placed
in the current working directory.

If `--heap-prof-name` is not specified, the generated profile is
named `Heap.${yyyymmdd}.${hhmmss}.${pid}.${tid}.${seq}.heapprofile`.

```console
$ node --heap-prof index.js
$ ls *.heapprofile
Heap.20190409.202950.15293.0.001.heapprofile
consolecopy
```

#### `--heap-prof-dir`[\#](https://nodejs.org/api/cli.html\#--heap-prof-dir)

Added in: v12.4.0History

| Version | Changes |
| --- | --- |
| v22.4.0, v20.16.0 | The `--heap-prof` flags are now stable. |

Specify the directory where the heap profiles generated by `--heap-prof` will
be placed.

The default value is controlled by the
[`--diagnostic-dir`](https://nodejs.org/api/cli.html#--diagnostic-dirdirectory) command-line option.

#### `--heap-prof-interval`[\#](https://nodejs.org/api/cli.html\#--heap-prof-interval)

Added in: v12.4.0History

| Version | Changes |
| --- | --- |
| v22.4.0, v20.16.0 | The `--heap-prof` flags are now stable. |

Specify the average sampling interval in bytes for the heap profiles generated
by `--heap-prof`. The default is 512 \* 1024 bytes.

#### `--heap-prof-name`[\#](https://nodejs.org/api/cli.html\#--heap-prof-name)

Added in: v12.4.0History

| Version | Changes |
| --- | --- |
| v22.4.0, v20.16.0 | The `--heap-prof` flags are now stable. |

Specify the file name of the heap profile generated by `--heap-prof`.

#### `--heapsnapshot-near-heap-limit=max_count`[\#](https://nodejs.org/api/cli.html\#--heapsnapshot-near-heap-limitmax_count)

Added in: v15.1.0, v14.18.0History

| Version | Changes |
| --- | --- |
| v25.4.0, v24.13.1, v22.22.1 | The flag is no longer experimental. |

Writes a V8 heap snapshot to disk when the V8 heap usage is approaching the
heap limit. `count` should be a non-negative integer (in which case
Node.js will write no more than `max_count` snapshots to disk).

When generating snapshots, garbage collection may be triggered and bring
the heap usage down. Therefore multiple snapshots may be written to disk
before the Node.js instance finally runs out of memory. These heap snapshots
can be compared to determine what objects are being allocated during the
time consecutive snapshots are taken. It's not guaranteed that Node.js will
write exactly `max_count` snapshots to disk, but it will try
its best to generate at least one and up to `max_count` snapshots before the
Node.js instance runs out of memory when `max_count` is greater than `0`.

Generating V8 snapshots takes time and memory (both memory managed by the
V8 heap and native memory outside the V8 heap). The bigger the heap is,
the more resources it needs. Node.js will adjust the V8 heap to accommodate
the additional V8 heap memory overhead, and try its best to avoid using up
all the memory available to the process. When the process uses
more memory than the system deems appropriate, the process may be terminated
abruptly by the system, depending on the system configuration.

```console
$ node --max-old-space-size=100 --heapsnapshot-near-heap-limit=3 index.js
Wrote snapshot to Heap.20200430.100036.49580.0.001.heapsnapshot
Wrote snapshot to Heap.20200430.100037.49580.0.002.heapsnapshot
Wrote snapshot to Heap.20200430.100038.49580.0.003.heapsnapshot

<--- Last few GCs --->

[49580:0x110000000]     4826 ms: Mark-sweep 130.6 (147.8) -> 130.5 (147.8) MB, 27.4 / 0.0 ms  (average mu = 0.126, current mu = 0.034) allocation failure scavenge might not succeed
[49580:0x110000000]     4845 ms: Mark-sweep 130.6 (147.8) -> 130.6 (147.8) MB, 18.8 / 0.0 ms  (average mu = 0.088, current mu = 0.031) allocation failure scavenge might not succeed

<--- JS stacktrace --->

FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
....
consolecopy
```

#### `--heapsnapshot-signal=signal`[\#](https://nodejs.org/api/cli.html\#--heapsnapshot-signalsignal)

Added in: v12.0.0

Enables a signal handler that causes the Node.js process to write a heap dump
when the specified signal is received. `signal` must be a valid signal name.
Disabled by default.

```console
$ node --heapsnapshot-signal=SIGUSR2 index.js &
$ ps aux
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
node         1  5.5  6.1 787252 247004 ?       Ssl  16:43   0:02 node --heapsnapshot-signal=SIGUSR2 index.js
$ kill -USR2 1
$ ls
Heap.20190718.133405.15554.0.001.heapsnapshot
consolecopy
```

#### `-h`, `--help`[\#](https://nodejs.org/api/cli.html\#-help)

Added in: v0.1.3

Print node command-line options.
The output of this option is less detailed than this document.

#### `--icu-data-dir=file`[\#](https://nodejs.org/api/cli.html\#--icu-data-dirfile)

Added in: v0.11.15

Specify ICU data load path. (Overrides `NODE_ICU_DATA`.)

#### `--import=module`[\#](https://nodejs.org/api/cli.html\#--importmodule)

Added in: v19.0.0, v18.18.0

Stability: 1 - Experimental

Preload the specified module at startup. If the flag is provided several times,
each module will be executed sequentially in the order they appear, starting
with the ones provided in [`NODE_OPTIONS`](https://nodejs.org/api/cli.html#node_optionsoptions).

Follows [ECMAScript module](https://nodejs.org/api/esm.html#modules-ecmascript-modules) resolution rules.
Use [`--require`](https://nodejs.org/api/cli.html#-r---require-module) to load a [CommonJS module](https://nodejs.org/api/modules.html).
Modules preloaded with `--require` will run before modules preloaded with `--import`.

Modules are preloaded into the main thread as well as any worker threads,
forked processes, or clustered processes.

#### `--input-type=type`[\#](https://nodejs.org/api/cli.html\#--input-typetype)

Added in: v12.0.0History

| Version | Changes |
| --- | --- |
| v23.6.0, v22.18.0 | Add support for `-typescript` values. |
| v22.7.0, v20.19.0 | ESM syntax detection is enabled by default. |

This configures Node.js to interpret `--eval` or `STDIN` input as CommonJS or
as an ES module. Valid values are `"commonjs"`, `"module"`, `"module-typescript"` and `"commonjs-typescript"`.
The `"-typescript"` values are not available with the flag `--no-strip-types`.
The default is no value, or `"commonjs"` if `--no-experimental-detect-module` is passed.

If `--input-type` is not provided,
Node.js will try to detect the syntax with the following steps:

1. Run the input as CommonJS.
2. If step 1 fails, run the input as an ES module.
3. If step 2 fails with a SyntaxError, strip the types.
4. If step 3 fails with an error code [`ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`](https://nodejs.org/api/errors.html#err_unsupported_typescript_syntax)
or [`ERR_INVALID_TYPESCRIPT_SYNTAX`](https://nodejs.org/api/errors.html#err_invalid_typescript_syntax),
throw the error from step 2, including the TypeScript error in the message,
else run as CommonJS.
5. If step 4 fails, run the input as an ES module.

To avoid the delay of multiple syntax detection passes, the `--input-type=type` flag can be used to specify
how the `--eval` input should be interpreted.

The REPL does not support this option. Usage of `--input-type=module` with
[`--print`](https://nodejs.org/api/cli.html#-p---print-script) will throw an error, as `--print` does not support ES module
syntax.

#### `--insecure-http-parser`[\#](https://nodejs.org/api/cli.html\#--insecure-http-parser)

Added in: v13.4.0, v12.15.0, v10.19.0

Enable leniency flags on the HTTP parser. This may allow
interoperability with non-conformant HTTP implementations.

When enabled, the parser will accept the following:

- Invalid HTTP headers values.
- Invalid HTTP versions.
- Allow message containing both `Transfer-Encoding`
and `Content-Length` headers.
- Allow extra data after message when `Connection: close` is present.
- Allow extra transfer encodings after `chunked` has been provided.
- Allow `\n` to be used as token separator instead of `\r\n`.
- Allow `\r\n` not to be provided after a chunk.
- Allow spaces to be present after a chunk size and before `\r\n`.

All the above will expose your application to request smuggling
or poisoning attack. Avoid using this option.

#### `--inspect-brk[=[host:]port]`[\#](https://nodejs.org/api/cli.html\#--inspect-brkhostport)

Added in: v7.6.0

Activate inspector on `host:port` and break at start of user script.
Default `host:port` is `127.0.0.1:9229`. If port `0` is specified,
a random available port will be used.

See [V8 Inspector integration for Node.js](https://nodejs.org/api/debugger.html#v8-inspector-integration-for-nodejs) for further explanation on Node.js debugger.

See the [security warning](https://nodejs.org/api/cli.html#warning-binding-inspector-to-a-public-ipport-combination-is-insecure) below regarding the `host`
parameter usage.

#### `--inspect-port=[host:]port`[\#](https://nodejs.org/api/cli.html\#--inspect-porthostport)

Added in: v7.6.0

Set the `host:port` to be used when the inspector is activated.
Useful when activating the inspector by sending the `SIGUSR1` signal.
Except when [`--disable-sigusr1`](https://nodejs.org/api/cli.html#--disable-sigusr1) is passed.

Default host is `127.0.0.1`. If port `0` is specified,
a random available port will be used.

See the [security warning](https://nodejs.org/api/cli.html#warning-binding-inspector-to-a-public-ipport-combination-is-insecure) below regarding the `host`
parameter usage.

#### `--inspect-publish-uid=stderr,http`[\#](https://nodejs.org/api/cli.html\#--inspect-publish-uidstderrhttp)

Specify ways of the inspector web socket url exposure.

By default inspector websocket url is available in stderr and under `/json/list`
endpoint on `http://host:port/json/list`.

#### `--inspect-wait[=[host:]port]`[\#](https://nodejs.org/api/cli.html\#--inspect-waithostport)

Added in: v22.2.0, v20.15.0

Activate inspector on `host:port` and wait for debugger to be attached.
Default `host:port` is `127.0.0.1:9229`. If port `0` is specified,
a random available port will be used.

See [V8 Inspector integration for Node.js](https://nodejs.org/api/debugger.html#v8-inspector-integration-for-nodejs) for further explanation on Node.js debugger.

See the [security warning](https://nodejs.org/api/cli.html#warning-binding-inspector-to-a-public-ipport-combination-is-insecure) below regarding the `host`
parameter usage.

#### `--inspect[=[host:]port]`[\#](https://nodejs.org/api/cli.html\#--inspecthostport)

Added in: v6.3.0

Activate inspector on `host:port`. Default is `127.0.0.1:9229`. If port `0` is
specified, a random available port will be used.

V8 inspector integration allows tools such as Chrome DevTools and IDEs to debug
and profile Node.js instances. The tools attach to Node.js instances via a
tcp port and communicate using the [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/).
See [V8 Inspector integration for Node.js](https://nodejs.org/api/debugger.html#v8-inspector-integration-for-nodejs) for further explanation on Node.js debugger.

##### Warning: binding inspector to a public IP:port combination is insecure[\#](https://nodejs.org/api/cli.html\#warning-binding-inspector-to-a-public-ipport-combination-is-insecure)

Binding the inspector to a public IP (including `0.0.0.0`) with an open port is
insecure, as it allows external hosts to connect to the inspector and perform
a [remote code execution](https://www.owasp.org/index.php/Code_Injection) attack.

If specifying a host, make sure that either:

- The host is not accessible from public networks.
- A firewall disallows unwanted connections on the port.

**More specifically, `--inspect=0.0.0.0` is insecure if the port (`9229` by**
**default) is not firewall-protected.**

See the [debugging security implications](https://nodejs.org/learn/getting-started/debugging#security-implications) section for more information.

#### `-i`, `--interactive`[\#](https://nodejs.org/api/cli.html\#-interactive)

Added in: v0.7.7

Opens the REPL even if stdin does not appear to be a terminal.

#### `--jitless`[\#](https://nodejs.org/api/cli.html\#--jitless)

Added in: v12.0.0

Stability: 1 - Experimental. This flag is inherited from V8 and is subject to
change upstream.

Disable [runtime allocation of executable memory](https://v8.dev/blog/jitless). This may be
required on some platforms for security reasons. It can also reduce attack
surface on other platforms, but the performance impact may be severe.

#### `--localstorage-file=file`[\#](https://nodejs.org/api/cli.html\#--localstorage-filefile)

Added in: v22.4.0

Stability: 1.2 - Release candidate.

The file used to store `localStorage` data. If the file does not exist, it is
created the first time `localStorage` is accessed. The same file may be shared
between multiple Node.js processes concurrently.

#### `--max-http-header-size=size`[\#](https://nodejs.org/api/cli.html\#--max-http-header-sizesize)

Added in: v11.6.0, v10.15.0History

| Version | Changes |
| --- | --- |
| v13.13.0 | Change maximum default size of HTTP headers from 8 KiB to 16 KiB. |

Specify the maximum size, in bytes, of HTTP headers. Defaults to 16 KiB.

#### `--max-old-space-size-percentage=percentage`[\#](https://nodejs.org/api/cli.html\#--max-old-space-size-percentagepercentage)

Sets the maximum memory size of V8's old memory section as a percentage of available system memory.
This flag takes precedence over `--max-old-space-size` when both are specified.

The `percentage` parameter must be a number greater than 0 and up to 100, representing the percentage
of available system memory to allocate to the V8 heap.

**Note:** This flag utilizes `--max-old-space-size`, which may be unreliable on 32-bit platforms due to
integer overflow issues.

```bash
# Using 50% of available system memory
node --max-old-space-size-percentage=50 index.js

# Using 75% of available system memory
node --max-old-space-size-percentage=75 index.js
bashcopy
```

#### `--network-family-autoselection-attempt-timeout`[\#](https://nodejs.org/api/cli.html\#--network-family-autoselection-attempt-timeout)

Added in: v22.1.0, v20.13.0

Sets the default value for the network family autoselection attempt timeout.
For more information, see [`net.getDefaultAutoSelectFamilyAttemptTimeout()`](https://nodejs.org/api/net.html#netgetdefaultautoselectfamilyattempttimeout).

#### `--no-addons`[\#](https://nodejs.org/api/cli.html\#--no-addons)

Added in: v16.10.0, v14.19.0

Disable the `node-addons` exports condition as well as disable loading
native addons. When `--no-addons` is specified, calling `process.dlopen` or
requiring a native C++ addon will fail and throw an exception.

#### `--no-async-context-frame`[\#](https://nodejs.org/api/cli.html\#--no-async-context-frame)

Added in: v24.0.0

Disables the use of [`AsyncLocalStorage`](https://nodejs.org/api/async_context.html#class-asynclocalstorage) backed by `AsyncContextFrame` and
uses the prior implementation which relied on async\_hooks. The previous model
is retained for compatibility with Electron and for cases where the context
flow may differ. However, if a difference in flow is found please report it.

#### `--no-deprecation`[\#](https://nodejs.org/api/cli.html\#--no-deprecation)

Added in: v0.8.0

Silence deprecation warnings.

#### `--no-experimental-detect-module`[\#](https://nodejs.org/api/cli.html\#--no-experimental-detect-module)

Added in: v21.1.0, v20.10.0History

| Version | Changes |
| --- | --- |
| v22.7.0, v20.19.0 | Syntax detection is enabled by default. |

Disable using [syntax detection](https://nodejs.org/api/packages.html#syntax-detection) to determine module type.

#### `--no-experimental-ffi`[\#](https://nodejs.org/api/cli.html\#--no-experimental-ffi)

Added in: v26.1.0

Stability: 1 - Experimental

Disable the experimental [`node:ffi`](https://nodejs.org/api/ffi.html) module.

This flag is only available in builds with FFI support.

#### `--no-experimental-global-navigator`[\#](https://nodejs.org/api/cli.html\#--no-experimental-global-navigator)

Added in: v21.2.0

Stability: 1 - Experimental

Disable exposition of [Navigator API](https://nodejs.org/api/globals.html#navigator) on the global scope.

#### `--no-experimental-repl-await`[\#](https://nodejs.org/api/cli.html\#--no-experimental-repl-await)

Added in: v16.6.0

Use this flag to disable top-level await in REPL.

#### `--no-experimental-require-module`[\#](https://nodejs.org/api/cli.html\#--no-experimental-require-module)

Added in: v22.0.0, v20.17.0History

| Version | Changes |
| --- | --- |
| v25.4.0 | The flag was renamed from `--no-experimental-require-module` to `--no-require-module`, with the former marked as legacy. |
| v23.0.0, v22.12.0, v20.19.0 | This is now false by default. |

Stability: 3 - Legacy: Use [`--no-require-module`](https://nodejs.org/api/cli.html#--no-require-module) instead.

Legacy alias for [`--no-require-module`](https://nodejs.org/api/cli.html#--no-require-module).

#### `--no-experimental-sqlite`[\#](https://nodejs.org/api/cli.html\#--no-experimental-sqlite)

Added in: v22.5.0History

| Version | Changes |
| --- | --- |
| v23.4.0, v22.13.0 | SQLite is unflagged but still experimental. |

Disable the experimental [`node:sqlite`](https://nodejs.org/api/sqlite.html) module.

#### `--no-experimental-websocket`[\#](https://nodejs.org/api/cli.html\#--no-experimental-websocket)

Added in: v22.0.0

Disable exposition of [`<WebSocket>`](https://developer.mozilla.org/docs/Web/API/WebSocket) on the global scope.

#### `--no-experimental-webstorage`[\#](https://nodejs.org/api/cli.html\#--no-experimental-webstorage)

Added in: v22.4.0History

| Version | Changes |
| --- | --- |
| v25.0.0 | The feature is now enabled by default. |

Stability: 1.2 - Release candidate.

Disable [`Web Storage`](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) support.

#### `--no-extra-info-on-fatal-exception`[\#](https://nodejs.org/api/cli.html\#--no-extra-info-on-fatal-exception)

Added in: v17.0.0

Hide extra information on fatal exception that causes exit.

#### `--no-force-async-hooks-checks`[\#](https://nodejs.org/api/cli.html\#--no-force-async-hooks-checks)

Added in: v9.0.0

Disables runtime checks for `async_hooks`. These will still be enabled
dynamically when `async_hooks` is enabled.

#### `--no-global-search-paths`[\#](https://nodejs.org/api/cli.html\#--no-global-search-paths)

Added in: v16.10.0

Do not search modules from global paths like `$HOME/.node_modules` and
`$NODE_PATH`.

#### `--no-network-family-autoselection`[\#](https://nodejs.org/api/cli.html\#--no-network-family-autoselection)

Added in: v19.4.0History

| Version | Changes |
| --- | --- |
| v20.0.0 | The flag was renamed from `--no-enable-network-family-autoselection` to `--no-network-family-autoselection`. The old name can still work as an alias. |

Disables the family autoselection algorithm unless connection options explicitly
enables it.

#### `--no-require-module`[\#](https://nodejs.org/api/cli.html\#--no-require-module)

Added in: v22.0.0, v20.17.0History

| Version | Changes |
| --- | --- |
| v25.4.0 | This flag is no longer experimental. |
| v25.4.0 | This flag was renamed from `--no-experimental-require-module` to `--no-require-module`. |
| v23.0.0, v22.12.0, v20.19.0 | This is now false by default. |

Disable support for loading a synchronous ES module graph in `require()`.

See [Loading ECMAScript modules using `require()`](https://nodejs.org/api/modules.html#loading-ecmascript-modules-using-require).

#### `--no-strip-types`[\#](https://nodejs.org/api/cli.html\#--no-strip-types)

Added in: v22.6.0History

| Version | Changes |
| --- | --- |
| v25.2.0, v24.12.0 | Type stripping is now stable, the flag was renamed from `--no-experimental-strip-types` to `--no-strip-types`. |
| v23.6.0, v22.18.0 | Type stripping is enabled by default. |

Disable type-stripping for TypeScript files.
For more information, see the [TypeScript type-stripping](https://nodejs.org/api/typescript.html#type-stripping) documentation.

#### `--no-warnings`[\#](https://nodejs.org/api/cli.html\#--no-warnings)

Added in: v6.0.0

Silence all process warnings (including deprecations).

#### `--no-worker-snapshot`[\#](https://nodejs.org/api/cli.html\#--no-worker-snapshot)

Added in: v26.9.0

Stability: 1 - Experimental

Start worker threads by running the internal bootstrap from scratch instead of
deserializing the bootstrapped context from the built-in startup snapshot.

#### `--node-memory-debug`[\#](https://nodejs.org/api/cli.html\#--node-memory-debug)

Added in: v15.0.0, v14.18.0

Enable extra debug checks for memory leaks in Node.js internals. This is
usually only useful for developers debugging Node.js itself.

#### `--openssl-config=file`[\#](https://nodejs.org/api/cli.html\#--openssl-configfile)

Added in: v6.9.0

Load an OpenSSL configuration file on startup. The file can activate an
OpenSSL 3 FIPS provider or configure a FIPS-capable OpenSSL 1.1.1 build. See
[FIPS mode](https://nodejs.org/api/crypto.html#fips-mode).

This option takes precedence over the `OPENSSL_CONF` environment variable.

#### `--openssl-legacy-provider`[\#](https://nodejs.org/api/cli.html\#--openssl-legacy-provider)

Added in: v17.0.0, v16.17.0

Enable OpenSSL 3.0 legacy provider. For more information please see
[OSSL\_PROVIDER-legacy](https://www.openssl.org/docs/man3.0/man7/OSSL_PROVIDER-legacy.html).

#### `--openssl-shared-config`[\#](https://nodejs.org/api/cli.html\#--openssl-shared-config)

Added in: v18.5.0, v16.17.0, v14.21.0

Enable OpenSSL default configuration section, `openssl_conf` to be read from
the OpenSSL configuration file. The default configuration file is named
`openssl.cnf` but this can be changed using the environment variable
`OPENSSL_CONF`, or by using the command line option `--openssl-config`.
The location of the default OpenSSL configuration file depends on how OpenSSL
is being linked to Node.js. Sharing the OpenSSL configuration may have unwanted
implications and it is recommended to use a configuration section specific to
Node.js which is `nodejs_conf` and is default when this option is not used.

#### `--pending-deprecation`[\#](https://nodejs.org/api/cli.html\#--pending-deprecation)

Added in: v8.0.0

Emit pending deprecation warnings.

Pending deprecations are generally identical to a runtime deprecation with the
notable exception that they are turned _off_ by default and will not be emitted
unless either the `--pending-deprecation` command-line flag, or the
`NODE_PENDING_DEPRECATION=1` environment variable, is set. Pending deprecations
are used to provide a kind of selective "early warning" mechanism that
developers may leverage to detect deprecated API usage.

#### `--permission`[\#](https://nodejs.org/api/cli.html\#--permission)

Added in: v20.0.0History

| Version | Changes |
| --- | --- |
| v23.5.0, v22.13.0 | Permission Model is now stable. |

Enable the Permission Model for current process. When enabled, the
following permissions are restricted:

> See also [`--permission-audit`](https://nodejs.org/api/cli.html#--permission-audit) for an audit-only mode
> that logs violations without denying access.

- File System - manageable through
[`--allow-fs-read`](https://nodejs.org/api/cli.html#--allow-fs-read), [`--allow-fs-write`](https://nodejs.org/api/cli.html#--allow-fs-write) flags
- Network - manageable through [`--allow-net`](https://nodejs.org/api/cli.html#--allow-net) flag
- Child Process - manageable through [`--allow-child-process`](https://nodejs.org/api/cli.html#--allow-child-process) flag
- Worker Threads - manageable through [`--allow-worker`](https://nodejs.org/api/cli.html#--allow-worker) flag
- WASI - manageable through [`--allow-wasi`](https://nodejs.org/api/cli.html#--allow-wasi) flag
- Addons - manageable through [`--allow-addons`](https://nodejs.org/api/cli.html#--allow-addons) flag
- FFI - manageable through [`--allow-ffi`](https://nodejs.org/api/cli.html#--allow-ffi) flag
- OpenSSL STORE loaders - manageable through [`--allow-openssl-store`](https://nodejs.org/api/cli.html#--allow-openssl-store) flag

#### `--permission-audit`[\#](https://nodejs.org/api/cli.html\#--permission-audit)

Added in: v25.8.0

Enable audit mode for the permission model. When enabled, permission checks
are performed but access is **not** denied — no `ERR_ACCESS_DENIED` error is
thrown. Instead, each permission violation is published through the
`node:diagnostics_channel` module, and execution continues normally.

This flag does not require [`--permission`](https://nodejs.org/api/cli.html#--permission) to be specified. The
`--allow-*` flags are not needed in audit mode, since no
access is denied.

Audit mode is useful for discovering what permissions your application
requires before deploying with [`--permission`](https://nodejs.org/api/cli.html#--permission). See the
[Permission Model](https://nodejs.org/api/permissions.html#permission-model) documentation for the list of diagnostics channel names
and the message format.

If both [`--permission`](https://nodejs.org/api/cli.html#--permission) and `--permission-audit` are specified,
`--permission` takes precedence and the Permission Model runs in enforce mode.

#### `--preserve-symlinks`[\#](https://nodejs.org/api/cli.html\#--preserve-symlinks)

Added in: v6.3.0

Instructs the module loader to preserve symbolic links when resolving and
caching modules.

By default, when Node.js loads a module from a path that is symbolically linked
to a different on-disk location, Node.js will dereference the link and use the
actual on-disk "real path" of the module as both an identifier and as a root
path to locate other dependency modules. In most cases, this default behavior
is acceptable. However, when using symbolically linked peer dependencies, as
illustrated in the example below, the default behavior causes an exception to
be thrown if `moduleA` attempts to require `moduleB` as a peer dependency:

```text
{appDir}
 ├── app
 │   ├── index.js
 │   └── node_modules
 │       ├── moduleA -> {appDir}/moduleA
 │       └── moduleB
 │           ├── index.js
 │           └── package.json
 └── moduleA
     ├── index.js
     └── package.json
textcopy
```

The `--preserve-symlinks` command-line flag instructs Node.js to use the
symlink path for modules as opposed to the real path, allowing symbolically
linked peer dependencies to be found.

Note, however, that using `--preserve-symlinks` can have other side effects.
Specifically, symbolically linked _native_ modules can fail to load if those
are linked from more than one location in the dependency tree (Node.js would
see those as two separate modules and would attempt to load the module multiple
times, causing an exception to be thrown).

The `--preserve-symlinks` flag does not apply to the main module, which allows
`node --preserve-symlinks node_module/.bin/<foo>` to work. To apply the same
behavior for the main module, also use `--preserve-symlinks-main`.

#### `--preserve-symlinks-main`[\#](https://nodejs.org/api/cli.html\#--preserve-symlinks-main)

Added in: v10.2.0

Instructs the module loader to preserve symbolic links when resolving and
caching the main module (`require.main`).

This flag exists so that the main module can be opted-in to the same behavior
that `--preserve-symlinks` gives to all other imports; they are separate flags,
however, for backward compatibility with older Node.js versions.

`--preserve-symlinks-main` does not imply `--preserve-symlinks`; use
`--preserve-symlinks-main` in addition to
`--preserve-symlinks` when it is not desirable to follow symlinks before
resolving relative paths.

See [`--preserve-symlinks`](https://nodejs.org/api/cli.html#--preserve-symlinks) for more information.

#### `-p`, `--print "script"`[\#](https://nodejs.org/api/cli.html\#-print-script)

Added in: v0.6.4History

| Version | Changes |
| --- | --- |
| v5.11.0 | Built-in libraries are now available as predefined variables. |

Identical to `-e` but prints the result.

#### `--prof`[\#](https://nodejs.org/api/cli.html\#--prof)

Added in: v2.0.0

Generate V8 profiler output.

#### `--prof-process`[\#](https://nodejs.org/api/cli.html\#--prof-process)

Added in: v5.2.0

Process V8 profiler output generated using the V8 option `--prof`.

#### `--redirect-warnings=file`[\#](https://nodejs.org/api/cli.html\#--redirect-warningsfile)

Added in: v8.0.0

Write process warnings to the given file instead of printing to stderr. The
file will be created if it does not exist, and will be appended to if it does.
If an error occurs while attempting to write the warning to the file, the
warning will be written to stderr instead.

The `file` name may be an absolute path. If it is not, the default directory it
will be written to is controlled by the
[`--diagnostic-dir`](https://nodejs.org/api/cli.html#--diagnostic-dirdirectory) command-line option.

#### `--report-compact`[\#](https://nodejs.org/api/cli.html\#--report-compact)

Added in: v13.12.0, v12.17.0

Write reports in a compact format, single-line JSON, more easily consumable
by log processing systems than the default multi-line format designed for
human consumption.

#### `--report-dir=directory`, `--report-directory=directory`[\#](https://nodejs.org/api/cli.html\#--report-dirdirectory---report-directorydirectory)

Added in: v11.8.0History

| Version | Changes |
| --- | --- |
| v13.12.0, v12.17.0 | This option is no longer experimental. |
| v12.0.0 | Changed from `--diagnostic-report-directory` to `--report-directory`. |

Location at which the report will be generated.

#### `--report-exclude-env`[\#](https://nodejs.org/api/cli.html\#--report-exclude-env)

Added in: v23.3.0, v22.13.0

When `--report-exclude-env` is passed the diagnostic report generated will not
contain the `environmentVariables` data.

#### `--report-exclude-network`[\#](https://nodejs.org/api/cli.html\#--report-exclude-network)

Added in: v22.0.0, v20.13.0

Exclude `header.networkInterfaces` from the diagnostic report. By default
this is not set and the network interfaces are included.

#### `--report-filename=filename`[\#](https://nodejs.org/api/cli.html\#--report-filenamefilename)

Added in: v11.8.0History

| Version | Changes |
| --- | --- |
| v13.12.0, v12.17.0 | This option is no longer experimental. |
| v12.0.0 | changed from `--diagnostic-report-filename` to `--report-filename`. |

Name of the file to which the report will be written.

If the filename is set to `'stdout'` or `'stderr'`, the report is written to
the stdout or stderr of the process respectively.

#### `--report-on-fatalerror`[\#](https://nodejs.org/api/cli.html\#--report-on-fatalerror)

Added in: v11.8.0History

| Version | Changes |
| --- | --- |
| v14.0.0, v13.14.0, v12.17.0 | This option is no longer experimental. |
| v12.0.0 | changed from `--diagnostic-report-on-fatalerror` to `--report-on-fatalerror`. |

Enables the report to be triggered on fatal errors (internal errors within
the Node.js runtime such as out of memory) that lead to termination of the
application. Useful to inspect various diagnostic data elements such as heap,
stack, event loop state, resource consumption etc. to reason about the fatal
error.

#### `--report-on-signal`[\#](https://nodejs.org/api/cli.html\#--report-on-signal)

Added in: v11.8.0History

| Version | Changes |
| --- | --- |
| v13.12.0, v12.17.0 | This option is no longer experimental. |
| v12.0.0 | changed from `--diagnostic-report-on-signal` to `--report-on-signal`. |

Enables report to be generated upon receiving the specified (or predefined)
signal to the running Node.js process. The signal to trigger the report is
specified through `--report-signal`.

#### `--report-signal=signal`[\#](https://nodejs.org/api/cli.html\#--report-signalsignal)

Added in: v11.8.0History

| Version | Changes |
| --- | --- |
| v13.12.0, v12.17.0 | This option is no longer experimental. |
| v12.0.0 | changed from `--diagnostic-report-signal` to `--report-signal`. |

Sets or resets the signal for report generation (not supported on Windows).
Default signal is `SIGUSR2`.

#### `--report-uncaught-exception`[\#](https://nodejs.org/api/cli.html\#--report-uncaught-exception)

Added in: v11.8.0History

| Version | Changes |
| --- | --- |
| v18.8.0, v16.18.0 | Report is not generated if the uncaught exception is handled. |
| v13.12.0, v12.17.0 | This option is no longer experimental. |
| v12.0.0 | changed from `--diagnostic-report-uncaught-exception` to `--report-uncaught-exception`. |

Enables report to be generated when the process exits due to an uncaught
exception. Useful when inspecting the JavaScript stack in conjunction with
native stack and other runtime environment data.

#### `-r`, `--require module`[\#](https://nodejs.org/api/cli.html\#-require-module)

Added in: v1.6.0History

| Version | Changes |
| --- | --- |
| v23.0.0, v22.12.0, v20.19.0 | This option also supports ECMAScript module. |

Preload the specified module at startup.

Follows `require()`'s module resolution
rules. `module` may be either a path to a file, or a node module name.

Modules preloaded with `--require` will run before modules preloaded with `--import`.

Modules are preloaded into the main thread as well as any worker threads,
forked processes, or clustered processes.

#### `--run`[\#](https://nodejs.org/api/cli.html\#--run)

Added in: v22.0.0History

| Version | Changes |
| --- | --- |
| v26.9.0 | Passing `--run` without a command lists the available scripts. |
| v22.3.0 | NODE\_RUN\_SCRIPT\_NAME environment variable is added. |
| v22.3.0 | NODE\_RUN\_PACKAGE\_JSON\_PATH environment variable is added. |
| v22.3.0 | Traverses up to the root directory and finds a `package.json` file to run the command from, and updates `PATH` environment variable accordingly. |

This runs a specified command from a package.json's `"scripts"` object.
If a missing `"command"` is provided, it will list the available scripts.

Passing `--run` without a command lists the available scripts and exits
with a non-zero exit code:

```console
$ node --run
Available scripts are:
  test: node --test
consolecopy
```

`--run` will traverse up to the root directory and finds a `package.json`
file to run the command from.

`--run` prepends `./node_modules/.bin` for each ancestor of
the current directory, to the `PATH` in order to execute the binaries from
different folders where multiple `node_modules` directories are present, if
`ancestor-folder/node_modules/.bin` is a directory.

`--run` executes the command in the directory containing the related `package.json`.

For example, the following command will run the `test` script of
the `package.json` in the current folder:

```console
$ node --run test
consolecopy
```

You can also pass arguments to the command. Any argument after `--` will
be appended to the script:

```console
$ node --run test -- --verbose
consolecopy
```

##### Intentional limitations[\#](https://nodejs.org/api/cli.html\#intentional-limitations)

`node --run` is not meant to match the behaviors of `npm run` or of the `run`
commands of other package managers. The Node.js implementation is intentionally
more limited, in order to focus on top performance for the most common use
cases.
Some features of other `run` implementations that are intentionally excluded
are:

- Running `pre` or `post` scripts in addition to the specified script.
- Defining package manager-specific environment variables.

##### Environment variables[\#](https://nodejs.org/api/cli.html\#environment-variables)

The following environment variables are set when running a script with `--run`:

- `NODE_RUN_SCRIPT_NAME`: The name of the script being run. For example, if
`--run` is used to run `test`, the value of this variable will be `test`.
- `NODE_RUN_PACKAGE_JSON_PATH`: The path to the `package.json` that is being
processed.

Environment variables loaded from a file with [`--env-file`](https://nodejs.org/api/cli.html#--env-filefile) are not applied
to the command executed by `--run`.

#### `--secure-heap-min=n`[\#](https://nodejs.org/api/cli.html\#--secure-heap-minn)

Added in: v15.6.0

When using `--secure-heap`, the `--secure-heap-min` flag specifies the
minimum allocation from the secure heap. The minimum value is `2`.
The maximum value is the lesser of `--secure-heap` or `2147483647`.
The value given must be a power of two.

#### `--secure-heap=n`[\#](https://nodejs.org/api/cli.html\#--secure-heapn)

Added in: v15.6.0

Initializes an OpenSSL secure heap of `n` bytes. When initialized, the
secure heap is used for selected types of allocations within OpenSSL
during key generation and other operations. This is useful, for instance,
to prevent sensitive information from leaking due to pointer overruns
or underruns.

The secure heap is a fixed size and cannot be resized at runtime so,
if used, it is important to select a large enough heap to cover all
application uses.

The heap size given must be a power of two. Any value less than 2
will disable the secure heap.

The secure heap is disabled by default.

The secure heap is not available on Windows.

See [`CRYPTO_secure_malloc_init`](https://www.openssl.org/docs/man3.0/man3/CRYPTO_secure_malloc_init.html) for more details.

#### `--snapshot-blob=path`[\#](https://nodejs.org/api/cli.html\#--snapshot-blobpath)

Added in: v18.8.0

Stability: 1 - Experimental

When used with `--build-snapshot`, `--snapshot-blob` specifies the path
where the generated snapshot blob is written to. If not specified, the
generated blob is written to `snapshot.blob` in the current working directory.

When used without `--build-snapshot`, `--snapshot-blob` specifies the
path to the blob that is used to restore the application state.

When loading a snapshot, Node.js checks that:

1. The version, architecture, and platform of the running Node.js binary
are exactly the same as that of the binary that generates the snapshot.
2. The V8 flags and CPU features are compatible with that of the binary
that generates the snapshot.

If they don't match, Node.js refuses to load the snapshot and exits with
status code 1.

#### `--test`[\#](https://nodejs.org/api/cli.html\#--test)

Added in: v18.1.0, v16.17.0History

| Version | Changes |
| --- | --- |
| v20.0.0 | The test runner is now stable. |
| v19.2.0, v18.13.0 | Test runner now supports running in watch mode. |

Starts the Node.js command line test runner. This flag cannot be combined with
`--watch-path`, `--check`, `--eval`, `--interactive`, or the inspector.
See the documentation on [running tests from the command line](https://nodejs.org/api/test.html#running-tests-from-the-command-line)
for more details.

#### `--test-concurrency`[\#](https://nodejs.org/api/cli.html\#--test-concurrency)

Added in: v21.0.0, v20.10.0, v18.19.0

The maximum number of test files that the test runner CLI will execute
concurrently. If `--test-isolation` is set to `'none'`, this flag is ignored and
concurrency is one. Otherwise, concurrency defaults to
`os.availableParallelism() - 1`.

#### `--test-coverage-branches=threshold`[\#](https://nodejs.org/api/cli.html\#--test-coverage-branchesthreshold)

Added in: v22.8.0

Stability: 1 - Experimental

Require a minimum percent of covered branches. If code coverage does not reach
the threshold specified, the process will exit with code `1`.

#### `--test-coverage-exclude`[\#](https://nodejs.org/api/cli.html\#--test-coverage-exclude)

Added in: v22.5.0

Stability: 1 - Experimental

Excludes specific files from code coverage using a glob pattern, which can match
both absolute and relative file paths.

This option may be specified multiple times to exclude multiple glob patterns.

If both `--test-coverage-exclude` and `--test-coverage-include` are provided,
files must meet **both** criteria to be included in the coverage report.

By default all the matching test files are excluded from the coverage report.
Specifying this option will override the default behavior.

#### `--test-coverage-functions=threshold`[\#](https://nodejs.org/api/cli.html\#--test-coverage-functionsthreshold)

Added in: v22.8.0

Stability: 1 - Experimental

Require a minimum percent of covered functions. If code coverage does not reach
the threshold specified, the process will exit with code `1`.

#### `--test-coverage-include`[\#](https://nodejs.org/api/cli.html\#--test-coverage-include)

Added in: v22.5.0

Stability: 1 - Experimental

Includes specific files in code coverage using a glob pattern, which can match
both absolute and relative file paths.

This option may be specified multiple times to include multiple glob patterns.

If both `--test-coverage-exclude` and `--test-coverage-include` are provided,
files must meet **both** criteria to be included in the coverage report.

#### `--test-coverage-include-all`[\#](https://nodejs.org/api/cli.html\#--test-coverage-include-all)

Added in: v26.7.0

Stability: 1 - Experimental

Includes source files that were never loaded by the test run in the coverage
report, where they are reported as having zero coverage.

Candidate files are searched for in the current working directory, and are
subject to the same `--test-coverage-include` and `--test-coverage-exclude`
filtering as the rest of the report.

#### `--test-coverage-lines=threshold`[\#](https://nodejs.org/api/cli.html\#--test-coverage-linesthreshold)

Added in: v22.8.0

Stability: 1 - Experimental

Require a minimum percent of covered lines. If code coverage does not reach
the threshold specified, the process will exit with code `1`.

#### `--test-force-exit`[\#](https://nodejs.org/api/cli.html\#--test-force-exit)

Added in: v22.0.0, v20.14.0

Configures the test runner to exit the process once all known tests have
finished executing even if the event loop would otherwise remain active.

#### `--test-global-setup=module`[\#](https://nodejs.org/api/cli.html\#--test-global-setupmodule)

Added in: v24.0.0

Stability: 1.0 - Early development

Specify a module that will be evaluated before all tests are executed and
can be used to setup global state or fixtures for tests.

See the documentation on [global setup and teardown](https://nodejs.org/api/test.html#global-setup-and-teardown) for more details.

#### `--test-isolation=mode`[\#](https://nodejs.org/api/cli.html\#--test-isolationmode)

Added in: v22.8.0History

| Version | Changes |
| --- | --- |
| v23.6.0 | This flag was renamed from `--experimental-test-isolation` to `--test-isolation`. |

Configures the type of test isolation used in the test runner. When `mode` is
`'process'`, each test file is run in a separate child process. When `mode` is
`'none'`, all test files run in the same process as the test runner. The default
isolation mode is `'process'`. This flag is ignored if the `--test` flag is not
present. See the [test runner execution model](https://nodejs.org/api/test.html#test-runner-execution-model) section for more information.

#### `--test-name-pattern`[\#](https://nodejs.org/api/cli.html\#--test-name-pattern)

Added in: v18.11.0History

| Version | Changes |
| --- | --- |
| v20.0.0 | The test runner is now stable. |

A regular expression that configures the test runner to only execute tests
whose name matches the provided pattern. See the documentation on
[filtering tests by name](https://nodejs.org/api/test.html#filtering-tests-by-name) for more details.

If both `--test-name-pattern` and `--test-skip-pattern` are supplied,
tests must satisfy **both** requirements in order to be executed.

#### `--test-only`[\#](https://nodejs.org/api/cli.html\#--test-only)

Added in: v18.0.0, v16.17.0History

| Version | Changes |
| --- | --- |
| v20.0.0 | The test runner is now stable. |

Configures the test runner to only execute top level tests that have the `only`
option set. This flag is not necessary when test isolation is disabled.

#### `--test-random-seed`[\#](https://nodejs.org/api/cli.html\#--test-random-seed)

Added in: v26.1.0

Set the seed used to randomize test execution order. This applies to both test
file execution order and queued tests within each file. Providing this flag
enables randomization implicitly, even without `--test-randomize`.

The value must be an integer between `0` and `4294967295`.

This flag cannot be used with `--watch` or `--test-rerun-failures`.

#### `--test-randomize`[\#](https://nodejs.org/api/cli.html\#--test-randomize)

Added in: v26.1.0

Randomize test execution order. This applies to both test file execution order
and queued tests within each file. This can help detect tests that rely on
shared state or execution order.

The seed used for randomization is printed in the test summary and can be
reused with `--test-random-seed`.

For detailed behavior and examples, see
[randomizing tests execution order](https://nodejs.org/api/test.html#randomizing-tests-execution-order).

This flag cannot be used with `--watch` or `--test-rerun-failures`.

#### `--test-reporter`[\#](https://nodejs.org/api/cli.html\#--test-reporter)

Added in: v19.6.0, v18.15.0History

| Version | Changes |
| --- | --- |
| v20.0.0 | The test runner is now stable. |

A test reporter to use when running tests. See the documentation on
[test reporters](https://nodejs.org/api/test.html#test-reporters) for more details.

#### `--test-reporter-destination`[\#](https://nodejs.org/api/cli.html\#--test-reporter-destination)

Added in: v19.6.0, v18.15.0History

| Version | Changes |
| --- | --- |
| v20.0.0 | The test runner is now stable. |

The destination for the corresponding test reporter. See the documentation on
[test reporters](https://nodejs.org/api/test.html#test-reporters) for more details.

#### `--test-rerun-failures`[\#](https://nodejs.org/api/cli.html\#--test-rerun-failures)

Added in: v24.7.0

A path to a file allowing the test runner to persist the state of the test
suite between runs. The test runner will use this file to determine which tests
have already succeeded or failed, allowing for re-running of failed tests
without having to re-run the entire test suite. The test runner will create this
file if it does not exist.
See the documentation on [test reruns](https://nodejs.org/api/test.html#rerunning-failed-tests) for more details.

#### `--test-shard`[\#](https://nodejs.org/api/cli.html\#--test-shard)

Added in: v20.5.0, v18.19.0

Test suite shard to execute in a format of `<index>/<total>`, where

- `index` is a positive integer, index of divided parts.
- `total` is a positive integer, total of divided part.

This command will divide all tests files into `total` equal parts,
and will run only those that happen to be in an `index` part.

For example, to split your tests suite into three parts, use this:

```bash
node --test --test-shard=1/3
node --test --test-shard=2/3
node --test --test-shard=3/3
bashcopy
```

#### `--test-skip-pattern`[\#](https://nodejs.org/api/cli.html\#--test-skip-pattern)

Added in: v22.1.0

A regular expression that configures the test runner to skip tests
whose name matches the provided pattern. See the documentation on
[filtering tests by name](https://nodejs.org/api/test.html#filtering-tests-by-name) for more details.

If both `--test-name-pattern` and `--test-skip-pattern` are supplied,
tests must satisfy **both** requirements in order to be executed.

#### `--test-timeout`[\#](https://nodejs.org/api/cli.html\#--test-timeout)

Added in: v21.2.0, v20.11.0

A number of milliseconds the test execution will fail after. If unspecified,
subtests inherit this value from their parent. The default value is `Infinity`.

#### `--test-update-snapshots`[\#](https://nodejs.org/api/cli.html\#--test-update-snapshots)

Added in: v22.3.0History

| Version | Changes |
| --- | --- |
| v23.4.0, v22.13.0 | Snapshot testing is no longer experimental. |

Regenerates the snapshot files used by the test runner for [snapshot testing](https://nodejs.org/api/test.html#snapshot-testing).

#### `--throw-deprecation`[\#](https://nodejs.org/api/cli.html\#--throw-deprecation)

Added in: v0.11.14

Throw errors for deprecations.

#### `--title=title`[\#](https://nodejs.org/api/cli.html\#--titletitle)

Added in: v10.7.0

Set `process.title` on startup.

#### `--tls-cipher-list=list`[\#](https://nodejs.org/api/cli.html\#--tls-cipher-listlist)

Added in: v4.0.0

Specify an alternative default TLS cipher list. Requires Node.js to be built
with crypto support (default).

#### `--tls-keylog=file`[\#](https://nodejs.org/api/cli.html\#--tls-keylogfile)

Added in: v13.2.0, v12.16.0

Log TLS key material to a file. The key material is in NSS `SSLKEYLOGFILE`
format and can be used by software (such as Wireshark) to decrypt the TLS
traffic.

#### `--tls-max-v1.2`[\#](https://nodejs.org/api/cli.html\#--tls-max-v12)

Added in: v12.0.0, v10.20.0

Set [`tls.DEFAULT_MAX_VERSION`](https://nodejs.org/api/tls.html#tlsdefault_max_version) to 'TLSv1.2'. Use to disable support for
TLSv1.3.

#### `--tls-max-v1.3`[\#](https://nodejs.org/api/cli.html\#--tls-max-v13)

Added in: v12.0.0

Set default [`tls.DEFAULT_MAX_VERSION`](https://nodejs.org/api/tls.html#tlsdefault_max_version) to 'TLSv1.3'. Use to enable support
for TLSv1.3.

#### `--tls-min-v1.0`[\#](https://nodejs.org/api/cli.html\#--tls-min-v10)

Added in: v12.0.0, v10.20.0

Set default [`tls.DEFAULT_MIN_VERSION`](https://nodejs.org/api/tls.html#tlsdefault_min_version) to 'TLSv1'. Use for compatibility with
old TLS clients or servers.

#### `--tls-min-v1.1`[\#](https://nodejs.org/api/cli.html\#--tls-min-v11)

Added in: v12.0.0, v10.20.0

Set default [`tls.DEFAULT_MIN_VERSION`](https://nodejs.org/api/tls.html#tlsdefault_min_version) to 'TLSv1.1'. Use for compatibility
with old TLS clients or servers.

#### `--tls-min-v1.2`[\#](https://nodejs.org/api/cli.html\#--tls-min-v12)

Added in: v12.2.0, v10.20.0

Set default [`tls.DEFAULT_MIN_VERSION`](https://nodejs.org/api/tls.html#tlsdefault_min_version) to 'TLSv1.2'. This is the default for
12.x and later, but the option is supported for compatibility with older Node.js
versions.

#### `--tls-min-v1.3`[\#](https://nodejs.org/api/cli.html\#--tls-min-v13)

Added in: v12.0.0

Set default [`tls.DEFAULT_MIN_VERSION`](https://nodejs.org/api/tls.html#tlsdefault_min_version) to 'TLSv1.3'. Use to disable support
for TLSv1.2, which is not as secure as TLSv1.3.

#### `--trace-deprecation`[\#](https://nodejs.org/api/cli.html\#--trace-deprecation)

Added in: v0.8.0

Print stack traces for deprecations.

#### `--trace-env`[\#](https://nodejs.org/api/cli.html\#--trace-env)

Added in: v23.4.0, v22.13.0

Print information about any access to environment variables done in the current Node.js
instance to stderr, including:

- The environment variable reads that Node.js does internally.
- Writes in the form of `process.env.KEY = "SOME VALUE"`.
- Reads in the form of `process.env.KEY`.
- Definitions in the form of `Object.defineProperty(process.env, 'KEY', {...})`.
- Queries in the form of `Object.hasOwn(process.env, 'KEY')`,
`process.env.hasOwnProperty('KEY')` or `'KEY' in process.env`.
- Deletions in the form of `delete process.env.KEY`.
- Enumerations inf the form of `...process.env` or `Object.keys(process.env)`.

Only the names of the environment variables being accessed are printed. The values are not printed.

To print the stack trace of the access, use `--trace-env-js-stack` and/or
`--trace-env-native-stack`.

#### `--trace-env-js-stack`[\#](https://nodejs.org/api/cli.html\#--trace-env-js-stack)

Added in: v23.4.0, v22.13.0

In addition to what `--trace-env` does, this prints the JavaScript stack trace of the access.

#### `--trace-env-native-stack`[\#](https://nodejs.org/api/cli.html\#--trace-env-native-stack)

Added in: v23.4.0, v22.13.0

In addition to what `--trace-env` does, this prints the native stack trace of the access.

#### `--trace-event-categories`[\#](https://nodejs.org/api/cli.html\#--trace-event-categories)

Added in: v7.7.0

A comma separated list of categories that should be traced when trace event
tracing is enabled using `--trace-events-enabled`.

#### `--trace-event-file-pattern`[\#](https://nodejs.org/api/cli.html\#--trace-event-file-pattern)

Added in: v9.8.0

Template string specifying the filepath for the trace event data, it
supports `${rotation}` and `${pid}`.

#### `--trace-events-enabled`[\#](https://nodejs.org/api/cli.html\#--trace-events-enabled)

Added in: v7.7.0

Enables the collection of trace event tracing information.

#### `--trace-exit`[\#](https://nodejs.org/api/cli.html\#--trace-exit)

Added in: v13.5.0, v12.16.0

Prints a stack trace whenever an environment is exited proactively,
i.e. invoking `process.exit()`.

#### `--trace-require-module=mode`[\#](https://nodejs.org/api/cli.html\#--trace-require-modulemode)

Added in: v23.5.0, v22.13.0, v20.19.0

Prints information about usage of [Loading ECMAScript modules using `require()`](https://nodejs.org/api/modules.html#loading-ecmascript-modules-using-require).

When `mode` is `all`, all usage is printed. When `mode` is `no-node-modules`, usage
from the `node_modules` folder is excluded.

#### `--trace-sigint`[\#](https://nodejs.org/api/cli.html\#--trace-sigint)

Added in: v13.9.0, v12.17.0

Prints a stack trace on SIGINT.

#### `--trace-sync-io`[\#](https://nodejs.org/api/cli.html\#--trace-sync-io)

Added in: v2.1.0

Prints a stack trace whenever synchronous I/O is detected after the first turn
of the event loop.

#### `--trace-tls`[\#](https://nodejs.org/api/cli.html\#--trace-tls)

Added in: v12.2.0

Prints TLS packet trace information to `stderr`. This can be used to debug TLS
connection problems.

#### `--trace-uncaught`[\#](https://nodejs.org/api/cli.html\#--trace-uncaught)

Added in: v13.1.0

Print stack traces for uncaught exceptions; usually, the stack trace associated
with the creation of an `Error` is printed, whereas this makes Node.js also
print the stack trace associated with throwing the value (which does not need
to be an `Error` instance).

Enabling this option may affect garbage collection behavior negatively.

#### `--trace-warnings`[\#](https://nodejs.org/api/cli.html\#--trace-warnings)

Added in: v6.0.0

Print stack traces for process warnings (including deprecations).

#### `--track-heap-objects`[\#](https://nodejs.org/api/cli.html\#--track-heap-objects)

Added in: v2.4.0

Track heap object allocations for heap snapshots.

#### `--unhandled-rejections=mode`[\#](https://nodejs.org/api/cli.html\#--unhandled-rejectionsmode)

Added in: v12.0.0, v10.17.0History

| Version | Changes |
| --- | --- |
| v15.0.0 | Changed default mode to `throw`. Previously, a warning was emitted. |

Using this flag allows to change what should happen when an unhandled rejection
occurs. One of the following modes can be chosen:

- `throw`: Emit [`unhandledRejection`](https://nodejs.org/api/process.html#event-unhandledrejection). If this hook is not set, raise the
unhandled rejection as an uncaught exception. This is the default.
- `strict`: Raise the unhandled rejection as an uncaught exception. If the
exception is handled, [`unhandledRejection`](https://nodejs.org/api/process.html#event-unhandledrejection) is emitted.
- `warn`: Always trigger a warning, no matter if the [`unhandledRejection`](https://nodejs.org/api/process.html#event-unhandledrejection)
hook is set or not but do not print the deprecation warning.
- `warn-with-error-code`: Emit [`unhandledRejection`](https://nodejs.org/api/process.html#event-unhandledrejection). If this hook is not
set, trigger a warning, and set the process exit code to 1.
- `none`: Silence all warnings.

If a rejection happens during the command line entry point's ES module static
loading phase, it will always raise it as an uncaught exception.

#### `--use-bundled-ca`, `--use-openssl-ca`[\#](https://nodejs.org/api/cli.html\#--use-bundled-ca---use-openssl-ca)

Added in: v6.11.0

Use bundled Mozilla CA store as supplied by current Node.js version
or use OpenSSL's default CA store. The default store is selectable
at build-time.

The bundled CA store, as supplied by Node.js, is a snapshot of Mozilla CA store
that is fixed at release time. It is identical on all supported platforms.

Using OpenSSL store allows for external modifications of the store. For most
Linux and BSD distributions, this store is maintained by the distribution
maintainers and system administrators. OpenSSL CA store location is dependent on
configuration of the OpenSSL library but this can be altered at runtime using
environment variables.

See `SSL_CERT_DIR` and `SSL_CERT_FILE`.

#### `--use-env-proxy`[\#](https://nodejs.org/api/cli.html\#--use-env-proxy)

Added in: v24.5.0, v22.21.0

Stability: 1.1 - Active Development

When enabled, Node.js parses the `HTTP_PROXY`, `HTTPS_PROXY` and `NO_PROXY`
environment variables during startup, and routes requests through the
specified proxy.

Use this only with proxies that are trusted and authorized for the deployment.
Proxy support is intended for reaching external networks through authorized
proxy servers, for example when a firewall requires one. It is not for hiding
traffic or evading network policy. See [Built-in Proxy Support](https://nodejs.org/api/http.html#built-in-proxy-support).

This is equivalent to setting the [`NODE_USE_ENV_PROXY=1`](https://nodejs.org/api/cli.html#node_use_env_proxy1) environment variable.
When both are set, `--use-env-proxy` takes precedence.

#### `--use-largepages=mode`[\#](https://nodejs.org/api/cli.html\#--use-largepagesmode)

Added in: v13.6.0, v12.17.0History

| Version | Changes |
| --- | --- |
| v26.9.0 | This option is now a no-op. |

This option is no longer supported and a no-op. It used to re-map the Node.js
static code to large memory pages at startup.

It still accepts the following values for compatibility:

- `off`: No mapping will be attempted. This is the default.
- `on`: No mapping will be attempted and a message will be printed to
standard error stating it's no longer supported.
- `silent`: Same as `off`.

#### `--use-system-ca`[\#](https://nodejs.org/api/cli.html\#--use-system-ca)

Added in: v23.8.0History

| Version | Changes |
| --- | --- |
| v23.9.0 | Added support on non-Windows and non-macOS. |

Node.js uses the trusted CA certificates present in the system store along with
the `--use-bundled-ca` option and the `NODE_EXTRA_CA_CERTS` environment variable.
On platforms other than Windows and macOS, this loads certificates from the directory
and file trusted by OpenSSL, similar to `--use-openssl-ca`, with the difference being
that it caches the certificates after first load.

On Windows and macOS, the certificate trust policy is similar to
[Chromium's policy for locally trusted certificates](https://chromium.googlesource.com/chromium/src/+/main/net/data/ssl/chrome_root_store/faq.md#does-the-chrome-certificate-verifier-consider-local-trust-decisions), but with some differences:

On macOS, the following settings are respected:

- Default and System Keychains
  - Trust:
    - Any certificate where the “When using this certificate” flag is set to “Always Trust” or
    - Any certificate where the “Secure Sockets Layer (SSL)” flag is set to “Always Trust”.
  - The certificate must also be valid, with "X.509 Basic Policy" set to “Always Trust”.

On Windows, the following settings are respected:

- Local Machine (accessed via `certlm.msc`)

  - Trust:
    - Trusted Root Certification Authorities
    - Trusted People
    - Enterprise Trust -> Enterprise -> Trusted Root Certification Authorities
    - Enterprise Trust -> Enterprise -> Trusted People
    - Enterprise Trust -> Group Policy -> Trusted Root Certification Authorities
    - Enterprise Trust -> Group Policy -> Trusted People
- Current User (accessed via `certmgr.msc`)

  - Trust:
    - Trusted Root Certification Authorities
    - Enterprise Trust -> Group Policy -> Trusted Root Certification Authorities

On Windows and macOS, Node.js would check that the user settings for the trusted
certificates do not forbid them for TLS server authentication before using them.

Node.js currently does not support distrust/revocation of certificates
from another source based on system settings.

On other systems, Node.js loads certificates from the default certificate file
(typically `/etc/ssl/cert.pem`) and default certificate directory (typically
`/etc/ssl/certs`) that the version of OpenSSL that Node.js links to respects.
This typically works with the convention on major Linux distributions and other
Unix-like systems. If the overriding OpenSSL environment variables
(typically `SSL_CERT_FILE` and `SSL_CERT_DIR`, depending on the configuration
of the OpenSSL that Node.js links to) are set, the specified paths will be used to load
certificates instead. These environment variables can be used as workarounds
if the conventional paths used by the version of OpenSSL Node.js links to are
not consistent with the system configuration that the users have for some reason.

#### `--v8-options`[\#](https://nodejs.org/api/cli.html\#--v8-options)

Added in: v0.1.3

Print V8 command-line options.

#### `--v8-pool-size=num`[\#](https://nodejs.org/api/cli.html\#--v8-pool-sizenum)

Added in: v5.10.0

Set V8's thread pool size which will be used to allocate background jobs.

If set to `0` then Node.js will choose an appropriate size of the thread pool
based on an estimate of the amount of parallelism.

The amount of parallelism refers to the number of computations that can be
carried out simultaneously in a given machine. In general, it's the same as the
amount of CPUs, but it may diverge in environments such as VMs or containers.

#### `-v`, `--version`[\#](https://nodejs.org/api/cli.html\#-version)

Added in: v0.1.3

Print node's version.

#### `--vfs-load=source`[\#](https://nodejs.org/api/cli.html\#--vfs-loadsource)

Added in: v26.10.0

- `source` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) A directory or an archive file to mount and run.

Requires [`--experimental-vfs`](https://nodejs.org/api/cli.html#--experimental-vfs). May be given at most once.

Mounts `source` exactly as [`--vfs-mount`](https://nodejs.org/api/cli.html#--vfs-mountsource) does, and additionally runs the
entry point and all subsequent `require()`/`import` resolution against that
mount rather than the real file system. The entry point is taken from the mount
the same way `node <directory>` takes one: the mount's own `package.json``"main"`, or `index.js`. Any positional command-line argument is the program's
own (available from `process.argv[2]` onward), never an entry-point override.

`process.argv[1]` reports `source` rather than the reserved mount point, since
the mount point is an opaque implementation detail.

Mounting the same source twice mounts it twice, at two separate mount points.
The entry point then comes from the mount `--vfs-load` itself contributed, not
from an earlier `--vfs-mount` of the same source.

In worker threads `--vfs-load` mounts but does not load: a worker inherits the
same mounts, in the same order, and runs its own entry point.

`--vfs-load` is not permitted in [`NODE_OPTIONS`](https://nodejs.org/api/cli.html#node_optionsoptions): which entry point runs is
the command line's decision, and the environment must not be able to redirect
it.

```console
$ node --experimental-vfs --vfs-load=app.zip
$ node --experimental-vfs --vfs-mount=lib.zip --vfs-load=app.zip
consolecopy
```

#### `--vfs-mount=source`[\#](https://nodejs.org/api/cli.html\#--vfs-mountsource)

Added in: v26.10.0

- `source` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) A directory or an archive file to mount.

Requires [`--experimental-vfs`](https://nodejs.org/api/cli.html#--experimental-vfs). May be repeated to mount several sources.

Mounts `source` as a virtual file system ( [`node:vfs`](https://nodejs.org/api/vfs.html)). Each mount is placed
at a reserved mount point assigned by Node.js, so mounts never shadow real
paths and no target can be chosen. Mounting alone does not change the entry
point; use [`--vfs-load`](https://nodejs.org/api/cli.html#--vfs-loadsource) for the source to run from.

`--vfs-mount` and [`--vfs-load`](https://nodejs.org/api/cli.html#--vfs-loadsource) mount in the order they are written, so

```console
$ node --experimental-vfs --vfs-mount=a --vfs-load=b --vfs-mount=c
consolecopy
```

mounts `a`, `b` and `c` in that order and runs `b`. Mounts contributed by
[`NODE_OPTIONS`](https://nodejs.org/api/cli.html#node_optionsoptions) are mounted before the command line's.

The provider backing a source is chosen from the source itself rather than from
its file name:

- A directory is mounted with a [`RealFSProvider`](https://nodejs.org/api/vfs.html#class-realfsprovider) rooted there.
- A file whose bytes are a ZIP archive is mounted with a [`ZipProvider`](https://nodejs.org/api/vfs.html#class-zipprovider), so
an archive can carry any name.

Providers registered with `vfs.registerProvider()` (typically from a module
preloaded with [`--require`](https://nodejs.org/api/cli.html#-r---require-module) or [`--import`](https://nodejs.org/api/cli.html#--importmodule)) are consulted first, in
reverse registration order, and may claim directories as well as files. If no
provider claims the source, Node.js exits with an error.

#### `--watch`[\#](https://nodejs.org/api/cli.html\#--watch)

Added in: v18.11.0, v16.19.0History

| Version | Changes |
| --- | --- |
| v22.0.0, v20.13.0 | Watch mode is now stable. |
| v19.2.0, v18.13.0 | Test runner now supports running in watch mode. |

Starts Node.js in watch mode.
When in watch mode, changes in the watched files cause the Node.js process to
restart.
By default, watch mode will watch the entry point
and any required or imported module.
Use `--watch-path` to specify what paths to watch.

This flag cannot be combined with
`--check`, `--eval`, `--interactive`, or the REPL.

Note: The `--watch` flag requires a file path as an argument and is incompatible
with `--run` or inline script input, as `--run` takes precedence and ignores watch
mode. If no file is provided, Node.js will exit with status code `9`.

```bash
node --watch index.js
bashcopy
```

#### `--watch-kill-signal`[\#](https://nodejs.org/api/cli.html\#--watch-kill-signal)

Added in: v24.4.0, v22.18.0

Stability: 1.1 - Active Development

Customizes the signal sent to the process on watch mode restarts.

```bash
node --watch --watch-kill-signal SIGINT test.js
bashcopy
```

#### `--watch-path`[\#](https://nodejs.org/api/cli.html\#--watch-path)

Added in: v18.11.0, v16.19.0History

| Version | Changes |
| --- | --- |
| v22.0.0, v20.13.0 | Watch mode is now stable. |

Starts Node.js in watch mode and specifies what paths to watch.
When in watch mode, changes in the watched paths cause the Node.js process to
restart.
This will turn off watching of required or imported modules, even when used in
combination with `--watch`.

This flag cannot be combined with
`--check`, `--eval`, `--interactive`, `--test`, or the REPL.

Note: Using `--watch-path` implicitly enables `--watch`, which requires a file path
and is incompatible with `--run`, as `--run` takes precedence and ignores watch mode.

```bash
node --watch-path=./src --watch-path=./tests index.js
bashcopy
```

This option is only supported on macOS and Windows.
An `ERR_FEATURE_UNAVAILABLE_ON_PLATFORM` exception will be thrown
when the option is used on a platform that does not support it.

#### `--watch-preserve-output`[\#](https://nodejs.org/api/cli.html\#--watch-preserve-output)

Added in: v19.3.0, v18.13.0

Disable the clearing of the console when watch mode restarts the process.

```bash
node --watch --watch-preserve-output test.js
bashcopy
```

#### `--zero-fill-buffers`[\#](https://nodejs.org/api/cli.html\#--zero-fill-buffers)

Added in: v6.0.0

Automatically zero-fills all newly allocated [`Buffer`](https://nodejs.org/api/buffer.html#class-buffer) instances.

### Environment variables[\#](https://nodejs.org/api/cli.html\#environment-variables-1)

Stability: 2 - Stable

#### `FORCE_COLOR=[1, 2, 3]`[\#](https://nodejs.org/api/cli.html\#force_color1-2-3)

The `FORCE_COLOR` environment variable is used to
enable ANSI colorized output. The value may be:

- `1`, `true`, or the empty string `''` indicate 16-color support,
- `2` to indicate 256-color support, or
- `3` to indicate 16 million-color support.

When `FORCE_COLOR` is used and set to a supported value, both the `NO_COLOR`,
and `NODE_DISABLE_COLORS` environment variables are ignored.

Any other value will result in colorized output being disabled.

#### `NODE_COMPILE_CACHE=dir`[\#](https://nodejs.org/api/cli.html\#node_compile_cachedir)

Added in: v22.1.0History

| Version | Changes |
| --- | --- |
| v25.4.0 | This feature is no longer experimental. |

Enable the [module compile cache](https://nodejs.org/api/module.html#module-compile-cache) for the Node.js instance. See the documentation of
[module compile cache](https://nodejs.org/api/module.html#module-compile-cache) for details.

#### `NODE_COMPILE_CACHE_PORTABLE=1`[\#](https://nodejs.org/api/cli.html\#node_compile_cache_portable1)

When set to 1, the [module compile cache](https://nodejs.org/api/module.html#module-compile-cache) can be reused across different directory
locations as long as the module layout relative to the cache directory remains the same,
and by any user (the cache subdirectory is not suffixed with the creating user's uid).

#### `NODE_COMPILE_CACHE_READONLY=1`[\#](https://nodejs.org/api/cli.html\#node_compile_cache_readonly1)

Added in: v26.8.0

When set to 1, the [module compile cache](https://nodejs.org/api/module.html#module-compile-cache) only reads existing entries from
its directory: nothing is written to it and it is not created if missing.

#### `NODE_DEBUG=module[,…]`[\#](https://nodejs.org/api/cli.html\#node_debugmodule)

Added in: v0.1.32

`','`-separated list of core modules that should print debug information.

#### `NODE_DEBUG_NATIVE=module[,…]`[\#](https://nodejs.org/api/cli.html\#node_debug_nativemodule)

`','`-separated list of core C++ modules that should print debug information.

#### `NODE_DISABLE_COLORS=1`[\#](https://nodejs.org/api/cli.html\#node_disable_colors1)

Added in: v0.3.0

When set, colors will not be used in the REPL.

#### `NODE_DISABLE_COMPILE_CACHE=1`[\#](https://nodejs.org/api/cli.html\#node_disable_compile_cache1)

Added in: v22.8.0

Stability: 1.1 - Active Development

Disable the [module compile cache](https://nodejs.org/api/module.html#module-compile-cache) for the Node.js instance. See the documentation of
[module compile cache](https://nodejs.org/api/module.html#module-compile-cache) for details.

#### `NODE_EXTRA_CA_CERTS=file`[\#](https://nodejs.org/api/cli.html\#node_extra_ca_certsfile)

Added in: v7.3.0

When set, the well known "root" CAs (like VeriSign) will be extended with the
extra certificates in `file`. The file should consist of one or more trusted
certificates in PEM format. A message will be emitted (once) with
[`process.emitWarning()`](https://nodejs.org/api/process.html#processemitwarningwarning-options) if the file is missing or
malformed, but any errors are otherwise ignored.

Neither the well known nor extra certificates are used when the `ca`
options property is explicitly specified for a TLS or HTTPS client or server.

This environment variable is ignored when `node` runs as setuid root or
has Linux file capabilities set.

The `NODE_EXTRA_CA_CERTS` environment variable is only read when the Node.js
process is first launched. Changing the value at runtime using
`process.env.NODE_EXTRA_CA_CERTS` has no effect on the current process.

#### `NODE_ICU_DATA=file`[\#](https://nodejs.org/api/cli.html\#node_icu_datafile)

Added in: v0.11.15

Data path for ICU (`Intl` object) data. Will extend linked-in data when compiled
with small-icu support.

#### `NODE_NO_WARNINGS=1`[\#](https://nodejs.org/api/cli.html\#node_no_warnings1)

Added in: v6.11.0

When set to `1`, process warnings are silenced.

#### `NODE_OPTIONS=options...`[\#](https://nodejs.org/api/cli.html\#node_optionsoptions)

Added in: v8.0.0

A space-separated list of command-line options. `options...` are interpreted
before command-line options, so command-line options will override or
compound after anything in `options...`. Node.js will exit with an error if
an option that is not allowed in the environment is used, such as `-p` or a
script file.

If an option value contains a space, it can be escaped using double quotes:

```bash
NODE_OPTIONS='--require "./my path/file.js"'
bashcopy
```

A singleton flag passed as a command-line option will override the same flag
passed into `NODE_OPTIONS`:

```bash
# The inspector will be available on port 5555
NODE_OPTIONS='--inspect=localhost:4444' node --inspect=localhost:5555
bashcopy
```

A flag that can be passed multiple times will be treated as if its
`NODE_OPTIONS` instances were passed first, and then its command-line
instances afterwards:

```bash
NODE_OPTIONS='--require "./a.js"' node --require "./b.js"
# is equivalent to:
node --require "./a.js" --require "./b.js"
bashcopy
```

Node.js options that are allowed are in the following list. If an option
supports both --XX and --no-XX variants, they are both supported but only
one is included in the list below.

- `--allow-addons`
- `--allow-child-process`
- `--allow-ffi`
- `--allow-fs-read`
- `--allow-fs-vfs`
- `--allow-fs-write`
- `--allow-inspector`
- `--allow-net`
- `--allow-openssl-store`
- `--allow-wasi`
- `--allow-worker`
- `--bench-isolation`
- `--bench-name-pattern`
- `--bench-reporter-destination`
- `--bench-reporter`
- `--bench-samples`
- `--bench-warmup`
- `--conditions`, `-C`
- `--cpu-prof-dir`
- `--cpu-prof-interval`
- `--cpu-prof-name`
- `--cpu-prof`
- `--diagnostic-dir`
- `--disable-proto`
- `--disable-sigusr1`
- `--disable-warning`
- `--disable-wasm-trap-handler`
- `--dns-result-order`
- `--enable-fips-indicator-events`
- `--enable-fips`
- `--enable-network-family-autoselection`
- `--enable-source-maps`
- `--entry-url`
- `--experimental-abortcontroller`
- `--experimental-addon-modules`
- `--experimental-bench`
- `--experimental-detect-module`
- `--experimental-dtls`
- `--experimental-eventsource`
- `--experimental-import-meta-resolve`
- `--experimental-import-text`
- `--experimental-json-modules`
- `--experimental-loader`
- `--experimental-modules`
- `--experimental-package-map`
- `--experimental-print-required-tla`
- `--experimental-quic`
- `--experimental-require-module`
- `--experimental-shadow-realm`
- `--experimental-specifier-resolution`
- `--experimental-stream-iter`
- `--experimental-test-isolation`
- `--experimental-top-level-await`
- `--experimental-vfs`
- `--experimental-vm-modules`
- `--experimental-wasi-unstable-preview1`
- `--experimental-web-worker`
- `--force-context-aware`
- `--force-fips`
- `--force-node-api-uncaught-exceptions-policy`
- `--frozen-intrinsics`
- `--heap-prof-dir`
- `--heap-prof-interval`
- `--heap-prof-name`
- `--heap-prof`
- `--heapsnapshot-near-heap-limit`
- `--heapsnapshot-signal`
- `--http-parser`
- `--icu-data-dir`
- `--import`
- `--input-type`
- `--insecure-http-parser`
- `--inspect-brk`
- `--inspect-port`, `--debug-port`
- `--inspect-publish-uid`
- `--inspect-wait`
- `--inspect`
- `--localstorage-file`
- `--max-http-header-size`
- `--max-old-space-size-percentage`
- `--network-family-autoselection-attempt-timeout`
- `--no-addons`
- `--no-async-context-frame`
- `--no-deprecation`
- `--no-experimental-ffi`
- `--no-experimental-global-navigator`
- `--no-experimental-repl-await`
- `--no-experimental-sqlite`
- `--no-experimental-strip-types`
- `--no-experimental-websocket`
- `--no-experimental-webstorage`
- `--no-extra-info-on-fatal-exception`
- `--no-force-async-hooks-checks`
- `--no-global-search-paths`
- `--no-network-family-autoselection`
- `--no-strip-types`
- `--no-warnings`
- `--no-webstorage`
- `--no-worker-snapshot`
- `--node-memory-debug`
- `--openssl-config`
- `--openssl-legacy-provider`
- `--openssl-shared-config`
- `--pending-deprecation`
- `--permission-audit`
- `--permission`
- `--preserve-symlinks-main`
- `--preserve-symlinks`
- `--prof-process`
- `--redirect-warnings`
- `--report-compact`
- `--report-dir`, `--report-directory`
- `--report-exclude-env`
- `--report-exclude-network`
- `--report-filename`
- `--report-on-fatalerror`
- `--report-on-signal`
- `--report-signal`
- `--report-uncaught-exception`
- `--require-module`
- `--require`, `-r`
- `--secure-heap-min`
- `--secure-heap`
- `--snapshot-blob`
- `--test-coverage-branches`
- `--test-coverage-exclude`
- `--test-coverage-functions`
- `--test-coverage-include-all`
- `--test-coverage-include`
- `--test-coverage-lines`
- `--test-global-setup`
- `--test-isolation`
- `--test-name-pattern`
- `--test-only`
- `--test-random-seed`
- `--test-randomize`
- `--test-reporter-destination`
- `--test-reporter`
- `--test-rerun-failures`
- `--test-shard`
- `--test-skip-pattern`
- `--throw-deprecation`
- `--title`
- `--tls-cipher-list`
- `--tls-keylog`
- `--tls-max-v1.2`
- `--tls-max-v1.3`
- `--tls-min-v1.0`
- `--tls-min-v1.1`
- `--tls-min-v1.2`
- `--tls-min-v1.3`
- `--trace-deprecation`
- `--trace-env-js-stack`
- `--trace-env-native-stack`
- `--trace-env`
- `--trace-event-categories`
- `--trace-event-file-pattern`
- `--trace-events-enabled`
- `--trace-exit`
- `--trace-require-module`
- `--trace-sigint`
- `--trace-sync-io`
- `--trace-tls`
- `--trace-uncaught`
- `--trace-warnings`
- `--track-heap-objects`
- `--unhandled-rejections`
- `--use-bundled-ca`
- `--use-env-proxy`
- `--use-largepages`
- `--use-openssl-ca`
- `--use-system-ca`
- `--v8-pool-size`
- `--vfs-mount`
- `--watch-kill-signal`
- `--watch-path`
- `--watch-preserve-output`
- `--watch`
- `--zero-fill-buffers`

V8 options that are allowed are:

- `--abort-on-uncaught-exception`
- `--disallow-code-generation-from-strings`
- `--enable-etw-stack-walking`
- `--expose-gc`
- `--interpreted-frames-native-stack`
- `--jitless`
- `--max-heap-size`
- `--max-old-space-size`
- `--max-semi-space-size`
- `--perf-basic-prof-only-functions`
- `--perf-basic-prof`
- `--perf-prof-unwinding-info`
- `--perf-prof`
- `--stack-trace-limit`

`--perf-basic-prof-only-functions`, `--perf-basic-prof`,
`--perf-prof-unwinding-info`, and `--perf-prof` are only available on Linux.

`--enable-etw-stack-walking` is only available on Windows.

#### `NODE_PATH=path[:…]`[\#](https://nodejs.org/api/cli.html\#node_pathpath)

Added in: v0.1.32

`':'`-separated list of directories prefixed to the module search path.

On Windows, this is a `';'`-separated list instead.

#### `NODE_PENDING_DEPRECATION=1`[\#](https://nodejs.org/api/cli.html\#node_pending_deprecation1)

Added in: v8.0.0

When set to `1`, emit pending deprecation warnings.

Pending deprecations are generally identical to a runtime deprecation with the
notable exception that they are turned _off_ by default and will not be emitted
unless either the `--pending-deprecation` command-line flag, or the
`NODE_PENDING_DEPRECATION=1` environment variable, is set. Pending deprecations
are used to provide a kind of selective "early warning" mechanism that
developers may leverage to detect deprecated API usage.

#### `NODE_PENDING_PIPE_INSTANCES=instances`[\#](https://nodejs.org/api/cli.html\#node_pending_pipe_instancesinstances)

Set the number of pending pipe instance handles when the pipe server is waiting
for connections. This setting applies to Windows only.

#### `NODE_PRESERVE_SYMLINKS=1`[\#](https://nodejs.org/api/cli.html\#node_preserve_symlinks1)

Added in: v7.1.0

When set to `1`, instructs the module loader to preserve symbolic links when
resolving and caching modules.

#### `NODE_REDIRECT_WARNINGS=file`[\#](https://nodejs.org/api/cli.html\#node_redirect_warningsfile)

Added in: v8.0.0

When set, process warnings will be emitted to the given file instead of
printing to stderr. The file will be created if it does not exist, and will be
appended to if it does. If an error occurs while attempting to write the
warning to the file, the warning will be written to stderr instead. This is
equivalent to using the `--redirect-warnings=file` command-line flag.

#### `NODE_REPL_EXTERNAL_MODULE=file`[\#](https://nodejs.org/api/cli.html\#node_repl_external_modulefile)

Added in: v13.0.0, v12.16.0History

| Version | Changes |
| --- | --- |
| v22.3.0, v20.16.0 | Remove the possibility to use this env var with kDisableNodeOptionsEnv for embedders. |

Path to a Node.js module which will be loaded in place of the built-in REPL.
Overriding this value to an empty string (`''`) will use the built-in REPL.

#### `NODE_REPL_HISTORY=file`[\#](https://nodejs.org/api/cli.html\#node_repl_historyfile)

Added in: v3.0.0

Path to the file used to store the persistent REPL history. The default path is
`~/.node_repl_history`, which is overridden by this variable. Setting the value
to an empty string (`''` or `' '`) disables persistent REPL history.

#### `NODE_SKIP_PLATFORM_CHECK=value`[\#](https://nodejs.org/api/cli.html\#node_skip_platform_checkvalue)

Added in: v14.5.0

If `value` equals `'1'`, the check for a supported platform is skipped during
Node.js startup. Node.js might not execute correctly. Any issues encountered
on unsupported platforms will not be fixed.

#### `NODE_TEST_CONTEXT=value`[\#](https://nodejs.org/api/cli.html\#node_test_contextvalue)

If `value` equals `'child'`, test reporter options will be overridden and test
output will be sent to stdout in the TAP format. If any other value is provided,
Node.js makes no guarantees about the reporter format used or its stability.

#### `NODE_TLS_REJECT_UNAUTHORIZED=value`[\#](https://nodejs.org/api/cli.html\#node_tls_reject_unauthorizedvalue)

If `value` equals `'0'`, certificate validation is disabled for TLS connections.
This makes TLS, and HTTPS by extension, insecure. The use of this environment
variable is strongly discouraged.

#### `NODE_USE_ENV_PROXY=1`[\#](https://nodejs.org/api/cli.html\#node_use_env_proxy1)

Added in: v24.0.0, v22.21.0

Stability: 1.1 - Active Development

When enabled, Node.js parses the `HTTP_PROXY`, `HTTPS_PROXY` and `NO_PROXY`
environment variables during startup, and routes requests through the
specified proxy.

Use this only with proxies that are trusted and authorized for the deployment.
Proxy support is intended for reaching external networks through authorized
proxy servers, for example when a firewall requires one. It is not for hiding
traffic or evading network policy. See [Built-in Proxy Support](https://nodejs.org/api/http.html#built-in-proxy-support).

This can also be enabled using the [`--use-env-proxy`](https://nodejs.org/api/cli.html#--use-env-proxy) command-line flag.
When both are set, `--use-env-proxy` takes precedence.

#### `NODE_USE_SYSTEM_CA=1`[\#](https://nodejs.org/api/cli.html\#node_use_system_ca1)

Added in: v24.6.0, v22.19.0

Node.js uses the trusted CA certificates present in the system store along with
the `--use-bundled-ca` option and the `NODE_EXTRA_CA_CERTS` environment variable.

This can also be enabled using the [`--use-system-ca`](https://nodejs.org/api/cli.html#--use-system-ca) command-line flag.
When both are set, `--use-system-ca` takes precedence.

#### `NODE_V8_COVERAGE=dir`[\#](https://nodejs.org/api/cli.html\#node_v8_coveragedir)

When set, Node.js will begin outputting [V8 JavaScript code coverage](https://v8project.blogspot.com/2017/12/javascript-code-coverage.html) and
[Source Map](https://tc39.es/ecma426/) data to the directory provided as an argument (coverage
information is written as JSON to files with a `coverage` prefix).

`NODE_V8_COVERAGE` will automatically propagate to subprocesses, making it
easier to instrument applications that call the `child_process.spawn()` family
of functions. `NODE_V8_COVERAGE` can be set to an empty string, to prevent
propagation.

##### Coverage output[\#](https://nodejs.org/api/cli.html\#coverage-output)

Coverage is output as an array of [ScriptCoverage](https://chromedevtools.github.io/devtools-protocol/tot/Profiler#type-ScriptCoverage) objects on the top-level
key `result`:

```json
{
  "result": [\
    {\
      "scriptId": "67",\
      "url": "internal/tty.js",\
      "functions": []\
    }\
  ]
}
jsoncopy
```

##### Source map cache[\#](https://nodejs.org/api/cli.html\#source-map-cache)

Stability: 1 - Experimental

If found, source map data is appended to the top-level key `source-map-cache`
on the JSON coverage object.

`source-map-cache` is an object with keys representing the files source maps
were extracted from, and values which include the raw source-map URL
(in the key `url`), the parsed Source Map v3 information (in the key `data`),
and the line lengths of the source file (in the key `lineLengths`).

```json
{
  "result": [\
    {\
      "scriptId": "68",\
      "url": "file:///absolute/path/to/source.js",\
      "functions": []\
    }\
  ],
  "source-map-cache": {
    "file:///absolute/path/to/source.js": {
      "url": "./path-to-map.json",
      "data": {
        "version": 3,
        "sources": [\
          "file:///absolute/path/to/original.js"\
        ],
        "names": [\
          "Foo",\
          "console",\
          "info"\
        ],
        "mappings": "MAAMA,IACJC,YAAaC",
        "sourceRoot": "./"
      },
      "lineLengths": [\
        13,\
        62,\
        38,\
        27\
      ]
    }
  }
}
jsoncopy
```

#### `NO_COLOR=<any>`[\#](https://nodejs.org/api/cli.html\#no_colorany)

[`NO_COLOR`](https://no-color.org/) is an alias for `NODE_DISABLE_COLORS`. The value of the
environment variable is arbitrary.

#### `OPENSSL_CONF=file`[\#](https://nodejs.org/api/cli.html\#openssl_conffile)

Added in: v6.11.0

Load an OpenSSL configuration file on startup. The file can be used as part of
a [FIPS mode](https://nodejs.org/api/crypto.html#fips-mode) configuration.

If the variable is set to an empty value, Node.js starts without loading any
OpenSSL configuration file. This is a way past a default configuration file
that exists but cannot be read, for example when `/etc/ssl` is not accessible
to the user Node.js runs as, which is otherwise fatal at startup. No
configuration is applied in that case, including any [FIPS mode](https://nodejs.org/api/crypto.html#fips-mode) setup the
file would have performed.

If the [`--openssl-config`](https://nodejs.org/api/cli.html#--openssl-configfile) command-line option is used, the environment
variable is ignored, and an empty value has no effect.

#### `SSL_CERT_DIR=dir`[\#](https://nodejs.org/api/cli.html\#ssl_cert_dirdir)

Added in: v7.7.0

If `--use-openssl-ca` is enabled, or if `--use-system-ca` is enabled on
platforms other than macOS and Windows, this overrides and sets OpenSSL's directory
containing trusted certificates.

Be aware that unless the child environment is explicitly set, this environment
variable will be inherited by any child processes, and if they use OpenSSL, it
may cause them to trust the same CAs as node.

#### `SSL_CERT_FILE=file`[\#](https://nodejs.org/api/cli.html\#ssl_cert_filefile)

Added in: v7.7.0

If `--use-openssl-ca` is enabled, or if `--use-system-ca` is enabled on
platforms other than macOS and Windows, this overrides and sets OpenSSL's file
containing trusted certificates.

Be aware that unless the child environment is explicitly set, this environment
variable will be inherited by any child processes, and if they use OpenSSL, it
may cause them to trust the same CAs as node.

#### `TZ`[\#](https://nodejs.org/api/cli.html\#tz)

Added in: v0.0.1History

| Version | Changes |
| --- | --- |
| v16.2.0 | Changing the TZ variable using process.env.TZ = changes the timezone on Windows as well. |
| v13.0.0 | Changing the TZ variable using process.env.TZ = changes the timezone on POSIX systems. |

The `TZ` environment variable is used to specify the timezone configuration.

While Node.js does not support all of the various [ways that `TZ` is handled in\\
other environments](https://www.gnu.org/software/libc/manual/html_node/TZ-Variable.html), it does support basic [timezone IDs](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) (such as
`'Etc/UTC'`, `'Europe/Paris'`, or `'America/New_York'`).
It may support a few other abbreviations or aliases, but these are strongly
discouraged and not guaranteed.

```console
$ TZ=Europe/Dublin node -pe "new Date().toString()"
Wed May 12 2021 20:30:48 GMT+0100 (Irish Standard Time)
consolecopy
```

#### `UV_THREADPOOL_SIZE=size`[\#](https://nodejs.org/api/cli.html\#uv_threadpool_sizesize)

Set the number of threads used in libuv's threadpool to `size` threads.

Asynchronous system APIs are used by Node.js whenever possible, but where they
do not exist, libuv's threadpool is used to create asynchronous node APIs based
on synchronous system APIs. Node.js APIs that use the threadpool are:

- all `fs` APIs, other than the file watcher APIs and those that are explicitly
synchronous
- asynchronous crypto APIs such as `crypto.pbkdf2()`, `crypto.scrypt()`,
`crypto.randomBytes()`, `crypto.randomFill()`, `crypto.generateKeyPair()`
- `dns.lookup()`
- all `zlib` APIs, other than those that are explicitly synchronous

Because libuv's threadpool has a fixed size, it means that if for whatever
reason any of these APIs takes a long time, other (seemingly unrelated) APIs
that run in libuv's threadpool will experience degraded performance. In order to
mitigate this issue, one potential solution is to increase the size of libuv's
threadpool by setting the `'UV_THREADPOOL_SIZE'` environment variable to a value
greater than `4` (its current default value). However, setting this from inside
the process using `process.env.UV_THREADPOOL_SIZE=size` is not guaranteed to work
as the threadpool would have been created as part of the runtime initialisation
much before user code is run. For more information, see the [libuv threadpool documentation](https://docs.libuv.org/en/latest/threadpool.html).

### Useful V8 options[\#](https://nodejs.org/api/cli.html\#useful-v8-options)

V8 has its own set of CLI options. Any V8 CLI option that is provided to `node`
will be passed on to V8 to handle. V8's options have _no stability guarantee_.
The V8 team themselves don't consider them to be part of their formal API,
and reserve the right to change them at any time. Likewise, they are not
covered by the Node.js stability guarantees. Many of the V8
options are of interest only to V8 developers. Despite this, there is a small
set of V8 options that are widely applicable to Node.js, and they are
documented here:

#### `--abort-on-uncaught-exception`[\#](https://nodejs.org/api/cli.html\#--abort-on-uncaught-exception-1)

#### `--disallow-code-generation-from-strings`[\#](https://nodejs.org/api/cli.html\#--disallow-code-generation-from-strings-1)

#### `--enable-etw-stack-walking`[\#](https://nodejs.org/api/cli.html\#--enable-etw-stack-walking)

#### `--expose-gc`[\#](https://nodejs.org/api/cli.html\#--expose-gc)

#### `--harmony-shadow-realm`[\#](https://nodejs.org/api/cli.html\#--harmony-shadow-realm)

#### `--heap-snapshot-on-oom`[\#](https://nodejs.org/api/cli.html\#--heap-snapshot-on-oom)

#### `--interpreted-frames-native-stack`[\#](https://nodejs.org/api/cli.html\#--interpreted-frames-native-stack)

#### `--jitless`[\#](https://nodejs.org/api/cli.html\#--jitless-1)

#### `--max-heap-size`[\#](https://nodejs.org/api/cli.html\#--max-heap-size)

Specifies the maximum heap size (in megabytes) for the process.

This option is typically used to limit the amount of memory the process can use for its JavaScript heap.

#### `--max-old-space-size=SIZE` (in MiB)[\#](https://nodejs.org/api/cli.html\#--max-old-space-sizesize-in-mib)

Sets the max memory size of V8's old memory section. As memory
consumption approaches the limit, V8 will spend more time on
garbage collection in an effort to free unused memory.

On a machine with 2 GiB of memory, consider setting this to
1536 (1.5 GiB) to leave some memory for other uses and avoid swapping.

```bash
node --max-old-space-size=1536 index.js
bashcopy
```

#### `--max-semi-space-size=SIZE` (in MiB)[\#](https://nodejs.org/api/cli.html\#--max-semi-space-sizesize-in-mib)

Sets the maximum [semi-space](https://v8.dev/blog/trash-talk#minor-gc) size for V8's [scavenge garbage collector](https://v8.dev/blog/orinoco-parallel-scavenger) in
MiB (mebibytes).
Increasing the max size of a semi-space may improve throughput for Node.js at
the cost of more memory consumption.

Since the young generation size of the V8 heap is three times (see
[`YoungGenerationSizeFromSemiSpaceSize`](https://chromium.googlesource.com/v8/v8.git/+/refs/tags/10.3.129/src/heap/heap.cc#328) in V8) the size of the semi-space,
an increase of 1 MiB to semi-space applies to each of the three individual
semi-spaces and causes the heap size to increase by 3 MiB. The throughput
improvement depends on your workload (see [#42511](https://github.com/nodejs/node/issues/42511)).

The default value depends on the memory limit. For example, on 64-bit systems
with a memory limit of 512 MiB, the max size of a semi-space defaults to 1 MiB.
For memory limits up to and including 2GiB, the default max size of a
semi-space will be less than 16 MiB on 64-bit systems.

To get the best configuration for your application, you should try different
max-semi-space-size values when running benchmarks for your application.

For example, benchmark on a 64-bit systems:

```bash
for MiB in 16 32 64 128; do
    node --max-semi-space-size=$MiB index.js
done
bashcopy
```

#### `--perf-basic-prof`[\#](https://nodejs.org/api/cli.html\#--perf-basic-prof)

#### `--perf-basic-prof-only-functions`[\#](https://nodejs.org/api/cli.html\#--perf-basic-prof-only-functions)

#### `--perf-prof`[\#](https://nodejs.org/api/cli.html\#--perf-prof)

#### `--perf-prof-unwinding-info`[\#](https://nodejs.org/api/cli.html\#--perf-prof-unwinding-info)

#### `--prof`[\#](https://nodejs.org/api/cli.html\#--prof-1)

#### `--security-revert`[\#](https://nodejs.org/api/cli.html\#--security-revert)

#### `--stack-trace-limit=limit`[\#](https://nodejs.org/api/cli.html\#--stack-trace-limitlimit)

The maximum number of stack frames to collect in an error's stack trace.
Setting it to 0 disables stack trace collection. The default value is 10.

```bash
node --stack-trace-limit=12 -p -e "Error.stackTraceLimit" # prints 12
bashcopy
```
