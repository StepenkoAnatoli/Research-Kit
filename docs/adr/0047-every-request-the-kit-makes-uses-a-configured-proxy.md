# ADR-0047 — Every request the kit makes uses a configured proxy

- **Date:** 2026-09-27
- **Status:** accepted
- **Area:** transports, remote collection, runtime
- **Depends on:** ADR-0046 (which Node lines can use a proxy at all)
- **Evidence:** [`docs/decisions/2026-09-27-node-support`](../decisions/2026-09-27-node-support/research/BRIEF.md), E-02 (`NODE_USE_ENV_PROXY`, `--use-env-proxy`), E-03 (`http.setGlobalProxyFromEnv()`)

## Context

Node's built-in `fetch` ignores `HTTPS_PROXY` unless it is told to use it. It can be told at
startup, with `NODE_USE_ENV_PROXY=1` or `--use-env-proxy` (from 22.21 and 24.0, E-02). From
24.14 and 25.4 it can also be told in place, with `http.setGlobalProxyFromEnv()` (E-03).

dd7569d told the keyless transport's fetch child. On 2026-09-27, while walking the remote
collection path in a container whose GitHub access goes through its proxy, three more paths
turned out to go around the proxy:

- **The SerpAPI child.** It was started with the parent's environment and no flag. A search
  through a stand-in proxy failed "fetch failed", and the proxy saw nothing.
- **The commands that call GitHub in their own process:** `collect-remote`, `disclosure` and
  the MCP server. A flag set inside a running process is too late, so the fix used for the
  children cannot help them. Through the stand-in, `collect-remote` reported "could not reach
  https://api.github.com: fetch failed", and the proxy saw nothing.

On a network that allows traffic only through a proxy, remote collection could not start. The
error named no proxy.

## Decision

1. **A child that fetches is started with `fetchEnv`.** It is the environment plus
   `NODE_USE_ENV_PROXY=1` when a proxy variable is set. It now lives in `runtime.mjs` and is
   used by both transports' children.
2. **A command that fetches in its own process calls `honourEnvProxy()` before its first
   request.** The helper follows one of four plans:
   - `set`: on 24.14+ and 25.4+, `http.setGlobalProxyFromEnv()` turns the proxy on in place.
   - `reexec`: on 22.21+ and 24.0 to 24.13, only the startup flag exists, so the command
     starts again with it. The new process inherits the same standard streams, so an MCP
     client keeps talking to the same pipes. Stop signals are forwarded, and the parent
     leaves with the child's exit code.
   - `unsupported`: on an older Node, nothing can work. The command writes one line naming
     the variable and the version to move to, then goes on.
   - `none`: no proxy is set, or the operator chose at startup. That covers the variable
     (even set to `0`) and the flag, on the command line or in `NODE_OPTIONS`. The restart
     sets the variable, so it cannot loop.
3. **A test finds these commands by construction.** It flags any command that imports a module
   whose functions default to the global `fetch` (directly or through another module) and does
   not call the helper.
4. **doctor's finding is `proxy`, not `keyless-proxy`,** and it names every path the proxy
   carries: keyless pages, search requests and remote collection. It does not name the search
   vendor, which only the adapter and the registry may do (NFR-3).

## Rejected alternatives

- **Route every GitHub call through a child, as the transports do.** `dispatch.mjs` is
  asynchronous and downloads binary artifacts. A child rendezvous would need a second protocol
  for bytes in order to fix a startup flag.
- **Document `NODE_USE_ENV_PROXY=1` for the operator to set.** Every operator would need to
  know a step whose absence produces an error that names no proxy. An MCP client's config is
  the place least likely to have it.
- **Construct undici's `EnvHttpProxyAgent` directly.** Node does not expose it as a public
  API, and the kit has no dependencies.
- **Always restart, even where `setGlobalProxyFromEnv` exists.** That keeps a second process
  alive for the whole life of an MCP server when an in-place switch is available.
- **Raise the floor to 22.21.** ADR-0046 rejected this: it refuses machines that have no proxy.

## Consequences

- Behind a proxy, remote collection, SerpAPI searches and keyless pages all use it on every
  supported line. The live tests measure this on 22.22.2 (restart), 24.21.0 and 26.10.0 (in
  place), and CI measures it on 22, 24 and 26.
- The live SerpAPI tests talk to a stand-in on loopback, and the child now obeys the machine's
  proxy. So they pass an environment without the proxy variables. Measured: with a proxy set
  and no loopback in `NO_PROXY`, 8 of the 15 failed otherwise.
- The live test uses a port the OS assigns. The first version used port 9, which `fetch`
  refuses outright ("bad port", the Fetch standard's blocked list), and that read as a bypass.
- Where a proxy adds GitHub authentication, as in the container where this was found,
  `disclosure` now measures what the proxy's identity can read, not what an anonymous stranger
  can. It errs toward reporting more exposure, not less. On an ordinary proxy nothing changes.

## Trigger that would reopen this

The kit's floor reaching 24.14 or later. That happens after Node 22 ends (2027-04-30, E-05) if
24.0 to 24.13 are also refused. From then on every supported Node has
`setGlobalProxyFromEnv`, and the restart path can go.
