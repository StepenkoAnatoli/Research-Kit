#!/usr/bin/env node
// bin/mcp-server.mjs - the collector, as a Model Context Protocol server over stdio.
//
// Launched as a subprocess by an MCP client, which speaks newline-delimited JSON-RPC on
// this process's standard streams. There are no flags: a stdio server's configuration is
// its environment, and the one thing it needs is a GitHub token.
//
// STDOUT IS THE MESSAGE STREAM AND NOTHING ELSE.
//
// A stray `console.log` here corrupts the protocol - the client reads a line, fails to
// parse it, and the failure looks like a malformed response to whatever request happened
// to be in flight. Every diagnostic below goes to stderr, deliberately.
//
// Register it with a client roughly like this:
//
//   {
//     "mcpServers": {
//       "research-kit": {
//         "command": "node",
//         "args": ["<path>/research-kit/bin/mcp-server.mjs"],
//         "env": { "RESEARCH_KIT_GITHUB_TOKEN": "github_pat_..." }
//       }
//     }
//   }
//
// The token needs exactly one permission - Actions: read and write, on the one repository
// holding the collector workflow. See the front-page README.

import { requireRuntime } from '../lib/runtime.mjs';
import { createStdioLoop, handle, SUPPORTED_VERSIONS, SERVER_INFO, TOOLS } from '../lib/mcp.mjs';
import { tokenFromEnv, TOKEN_VARS, redact } from '../lib/dispatch.mjs';

if (process.argv.includes('--help')) {
  // Printed to stdout ONLY here, where no client is listening: a human ran this by hand.
  process.stdout.write(`mcp-server - the Research-Kit collector, over MCP stdio.

  node research-kit/bin/mcp-server.mjs

Speaks newline-delimited JSON-RPC on stdin/stdout.
Protocol versions: ${SUPPORTED_VERSIONS.join(', ')} - modern and legacy, because every
shipped client still opens with the legacy initialize handshake.
Tools: ${TOOLS.map((t) => t.name).join(', ')}.

The token is read from ${TOKEN_VARS.join(' or ')}. There is no token argument: a stdio
server's credential belongs in its environment, which is what the MCP specification says
for this transport.

A corpus this server returns is EVIDENCE, not approved research. Read buildAuthorized.
`);
  process.exit(0);
}

requireRuntime({ node: true });

// Reported once, on stderr, before the first message. A server that starts happily and
// then fails every call for a missing credential is harder to diagnose than one that says
// so at the top of the log the client already captures.
const { token, from, detail } = tokenFromEnv();
process.stderr.write(token
  ? `research-kit mcp: protocols ${SUPPORTED_VERSIONS.join(", ")}, token from ${from}\n`
  : `research-kit mcp: ${detail}. Tools will refuse until it is set.\n`);

// One connection, one session. A stdio server serves exactly one client, so this object
// is the whole of the session state the legacy handshake establishes.
const session = { version: null };

createStdioLoop({
  input: process.stdin,
  output: process.stdout,
  onMessage: (message) => handle(message, { session }),
  onError: (error) => process.stderr.write(`research-kit mcp: ${redact(error.stack ?? error.message)}\n`),
});

process.stdin.on('end', () => process.exit(0));
process.stderr.write(`research-kit mcp: ${SERVER_INFO.name} ready\n`);
