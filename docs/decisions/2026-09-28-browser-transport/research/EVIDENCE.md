# Evidence

One row per fetched page. `Raw` points at the cached page text under `research/raw/`,
which is what makes the claim checkable - a row without raw evidence fails preflight.

The `Finding` cell arrives as an auto-extracted summary. Rewrite it into a real claim:
what the page actually establishes, with the quote or number that proves it.

| ID | Retrieved | Type | URL | Finding | Raw |
|---|---|---|---|---|---|
| E-01 | 2026-09-28 | P | https://developer.chrome.com/docs/chromium/headless | Chrome headless docs: headless mode is the `--headless` flag on a normal Chrome binary; since Chrome 132 the old headless mode ships only as a separate `chrome-headless-shell` binary. [quote: To use Headless mode, pass the `--headless` command-line flag to a Chrome binary] | research/raw/2026-09-28-chrome-headless-mode-automation-and-test-chrome-5036b47d.md |
| E-02 | 2026-09-28 | P | https://developer.chrome.com/blog/headless-chrome | The headless Chrome article: `--dump-dom` prints the rendered DOM to stdout from the command line, with no driver library. [quote: The `--dump-dom` flag prints `document.body.innerHTML` to stdout] | research/raw/2026-09-28-headless-chrome-shell-automation-and-tes-chrome-3bc6bf41.md |
| E-03 | 2026-09-28 | P | https://www.chromium.org/developers/design-documents/network-settings/ | Chromium network settings: a custom proxy is set with `--proxy-server=<uri>[:<port>]`, which takes precedence over proxy auto-detection. [quote: This tells Chrome to use a custom proxy configuration] | research/raw/2026-09-28-network-settings-chromium-747011c2.md |
| E-04 | 2026-09-28 | P | https://chromium.googlesource.com/chromium/src/+/main/docs/linux/sandboxing.md | A failed lookup: googlesource answered HTTP 503 (Google's error page), so nothing here is evidence about Chromium's sandbox - it is the fetch that exposed the bug fixed in 13ff0ea (error pages were filed as evidence). | research/raw/2026-09-28-error-503-service-unavailable-1-googlesource-9af642d8.md |
| E-05 | 2026-09-28 | S | https://github.com/ArchiveBox/ArchiveBox/wiki/Chromium-Install | ArchiveBox (a web archiver that captures with Chromium) runs it in containers with `--no-sandbox --disable-setuid-sandbox --no-zygote` among its flags, and lets the operator point `CHROME_BINARY` at an installed browser. [quote: --no-sandbox --disable-setuid-sandbox --no-zygote] | research/raw/2026-09-28-chromium-install-archivebox-archivebox-w-github-6d051f3b.md |
