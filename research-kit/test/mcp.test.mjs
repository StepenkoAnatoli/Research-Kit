// The MCP server, offline.
//
// Every assertion here is traceable to a row in the approved brief at
// `docs/decisions/2026-09-21-agent-interface/research/BRIEF.md`. That is unusual and
// deliberate: this module is the first thing in the repository built from research that
// passed the gate rather than from a plan, so the tests cite the evidence the same way
// the code does. If a claim below is wrong, the cached page that produced it is in the
// repository and can be re-read.

import { PassThrough } from 'node:stream';
import { spawnSync } from 'node:child_process';
import { test, describe, assert, tempDir, cleanup, fs, path, KIT_ROOT } from './harness.mjs';
import {
  handle, versionProblem, validateArgs, resourceLink, createStdioLoop, MAX_LINE,
  TOOLS, ERRORS, SUPPORTED_VERSIONS, SERVER_INFO, MODERN_VERSION, LEGACY_VERSION,
} from '../lib/mcp.mjs';

describe('mcp');

const TOKEN_ENV = { RESEARCH_KIT_GITHUB_TOKEN: `github_pat_${'A1b2C3d4E5'.repeat(4)}` };
const call = (name, args, id = 1) => ({ jsonrpc: '2.0', id, method: 'tools/call', params: { name, arguments: args } });

/** Deps that record what they were asked and answer without a network. */
function deps(overrides = {}) {
  const seen = {};
  return {
    env: TOKEN_ENV,
    dispatch: async (a) => { seen.dispatch = a; return { workflowRunId: 42, runUrl: 'r', htmlUrl: 'h' }; },
    summary: async (a) => { seen.summary = a; return { status: 'completed', conclusion: 'success', htmlUrl: 'h', runId: a.runId }; },
    corpus: async (a) => {
      seen.corpus = a;
      return {
        file: 'C:\\tmp\\research-kit-corpus-v1-job-1.zip',
        validation: { status: 'PASS', buildAuthorized: false, state: 'HUMAN_REVIEW_REQUIRED', packageId: 'RK-X', errors: [] },
      };
    },
    seen,
    ...overrides,
  };
}

// ---------------------------------------------------------------- the protocol

test('server/discover is implemented, because the spec says servers MUST', async () => {
  // E-05: "Servers MUST implement server/discover."
  const r = await handle({ jsonrpc: '2.0', id: 1, method: 'server/discover' }, deps());
  assert.deepEqual(r.result.protocolVersions, [...SUPPORTED_VERSIONS]);
  assert.equal(r.result.serverInfo.name, SERVER_INFO.name);
  assert.ok(r.result.capabilities.tools, 'a server offering tools declares the capability');
});

test('a version this server cannot serve gets -32022 with the supported list', async () => {
  // E-05: the client "SHOULD select a mutually supported version from the `supported`
  // list and retry" - so the list is the payload, not decoration in a message.
  const r = await handle({
    jsonrpc: '2.0', id: 7, method: 'tools/list',
    params: { _meta: { 'io.modelcontextprotocol/protocol-version': '1900-01-01' } },
  }, deps());
  assert.equal(r.error.code, ERRORS.UNSUPPORTED_PROTOCOL_VERSION);
  assert.equal(r.error.code, -32022);
  assert.deepEqual(r.error.data, { supported: [...SUPPORTED_VERSIONS], requested: '1900-01-01' });
});

test('a LEGACY per-request version is accepted, not refused', async () => {
  // Dual-era means both are serveable, so neither is an error when named explicitly.
  const r = await handle({
    jsonrpc: '2.0', id: 8, method: 'tools/list',
    params: { _meta: { 'io.modelcontextprotocol/protocol-version': LEGACY_VERSION } },
  }, deps());
  assert.ok(r.result, 'a version this server serves must not be refused');
});

// ---------------------------------------------------------------- the legacy handshake

test('initialize exists, because every shipped client opens with it', async () => {
  // The whole reason this file has a legacy half. The first version of this server
  // implemented `2026-07-28` only - correctly, from the specification - and the official
  // SDK at v1.30.0 answered with, in full:
  //
  //     MCP error -32601: unknown method initialize
  //
  // A server nothing can call is not conformant, it is unreachable. E-05 named the shape
  // that fixes it: "a dual-era implementation that supports both".
  const session = { version: null };
  const r = await handle({
    jsonrpc: '2.0', id: 0, method: 'initialize',
    params: { protocolVersion: LEGACY_VERSION, capabilities: {}, clientInfo: { name: 'c', version: '1' } },
  }, { ...deps(), session });

  assert.equal(r.result.protocolVersion, LEGACY_VERSION, 'the reply must echo a version the client can accept');
  assert.equal(r.result.serverInfo.name, SERVER_INFO.name);
  assert.ok(r.result.capabilities.tools, 'a server offering tools declares the capability');
  assert.equal(session.version, LEGACY_VERSION, 'the negotiated version is remembered for the connection');
});

test('initialize echoes the version asked for when it is serveable', async () => {
  // The official client REFUSES a reply carrying a version it does not support -
  // `SUPPORTED_PROTOCOL_VERSIONS.includes(result.protocolVersion)` or it throws. Echoing
  // is what keeps a modern client modern and a legacy client connected.
  for (const asked of [...SUPPORTED_VERSIONS]) {
    const r = await handle({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: asked } },
      { ...deps(), session: { version: null } });
    assert.equal(r.result.protocolVersion, asked, `asked for ${asked} and got ${r.result.protocolVersion}`);
  }
});

// docs/decisions/2026-09-27-mcp-protocol-versions. A client on the official SDK up to 1.24.0
// (published 2025-12-02) asks for 2025-06-18 and does not accept 2025-11-25 (E-04, E-06). On
// 2026-09-27 this server answered such a client 2025-11-25, and it disconnects (E-03). Nothing
// 2025-11-25 changed touches what this server does (E-01), so it serves 2025-06-18, and the
// specification then requires the echo. 2025-03-26 predates structuredContent and resource_link,
// which this server's results carry (E-02), so it is not offered.
test('a 2025-06-18 client is answered 2025-06-18; a 2025-03-26 client is not', async () => {
  const ask = async (asked) => (await handle({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: asked } },
    { ...deps(), session: { version: null } })).result.protocolVersion;
  assert.equal(await ask('2025-06-18'), '2025-06-18', 'a client that does not list 2025-11-25 disconnects on any other answer');
  assert.equal(await ask('2025-03-26'), LEGACY_VERSION, 'this server\'s results use features 2025-03-26 does not have');
  assert.equal(SUPPORTED_VERSIONS.includes('2025-03-26'), false);
});

// docs/decisions/2026-09-27-mcp-protocol-versions, U-5. SEP-1303 (2025-11-25): "input validation
// errors should be returned as Tool Execution Errors rather than Protocol Errors to enable model
// self-correction" (E-01). This server answered them with JSON-RPC -32602, which a client raises
// as an exception the model never reads. An unknown tool stays a protocol error.
test('arguments that fail the schema come back as a tool result the model can read', async () => {
  const call = (name, args) => handle({ jsonrpc: '2.0', id: 7, method: 'tools/call', params: { name, arguments: args } }, deps());
  const bad = await call('collect', { repository: 'o/r', topic: 'x', max_pages: 99 });
  assert.equal(bad.error, undefined, 'invalid arguments were answered as a protocol error');
  assert.equal(bad.result.isError, true);
  assert.match(bad.result.content[0].text, /at most 25/, 'the model must be told what to correct');
  const typo = await call('collect', { repository: 'o/r', topic: 'x', token: 'oops' });
  assert.equal(typo.result?.isError, true);
  assert.match(typo.result.content[0].text, /unknown argument token/);
  const unknown = await call('no_such_tool', {});
  assert.equal(unknown.error?.code, ERRORS.INVALID_PARAMS, 'an unknown tool stays a protocol error');
});

test('an unknown requested version falls back to LEGACY, not to this server preference', async () => {
  // Answering a client we cannot place with `2026-07-28` would be a correct statement of
  // preference and a guaranteed disconnection: no shipped client lists it. The legacy
  // revision is the one most likely to be in the caller's supported set.
  const r = await handle({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '1999-01-01' } },
    { ...deps(), session: { version: null } });
  assert.equal(r.result.protocolVersion, LEGACY_VERSION);
  assert.notEqual(r.result.protocolVersion, MODERN_VERSION);
});

test('initialize carries instructions that say the corpus is not approved', async () => {
  const r = await handle({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: LEGACY_VERSION } },
    { ...deps(), session: { version: null } });
  assert.match(r.result.instructions, /buildAuthorized/);
  assert.match(r.result.instructions, /not approved research/);
});

test('notifications/initialized is a notification and gets no reply', async () => {
  assert.equal(await handle({ jsonrpc: '2.0', method: 'notifications/initialized' }, deps()), null);
});

test('both eras reach the same tools', async () => {
  // Semantics are identical across bindings and eras (E-03). A legacy client must not get
  // a reduced server.
  const legacy = { version: null };
  await handle({ jsonrpc: '2.0', id: 0, method: 'initialize', params: { protocolVersion: LEGACY_VERSION } }, { ...deps(), session: legacy });
  const viaLegacy = await handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' }, { ...deps(), session: legacy });
  const viaModern = await handle({
    jsonrpc: '2.0', id: 1, method: 'tools/list',
    params: { _meta: { 'io.modelcontextprotocol/protocol-version': MODERN_VERSION } },
  }, deps());
  assert.deepEqual(viaLegacy.result.tools.map((t) => t.name), viaModern.result.tools.map((t) => t.name));
});

test('an absent version is allowed, because the protocol allows it', () => {
  // A client MAY call server/discover first and MAY instead invoke a method inline.
  // Refusing an unstated version would make this server stricter than the spec.
  assert.equal(versionProblem({ method: 'tools/list' }), null);
  for (const v of SUPPORTED_VERSIONS) {
    assert.equal(versionProblem({ params: { _meta: { 'io.modelcontextprotocol/protocol-version': v } } }), null,
      `${v} is served and must not be refused`);
  }
});

test('a notification gets no response at all', async () => {
  // E-03: clients send requests and notifications; a notification has no id and no reply.
  // `notifications/cancelled` is how a stdio client abandons work.
  assert.equal(await handle({ jsonrpc: '2.0', method: 'notifications/cancelled', params: { requestId: 1 } }, deps()), null);
  assert.equal(await handle({ jsonrpc: '2.0', method: 'notifications/initialized' }, deps()), null);
});

test('a malformed message is refused rather than interpreted', async () => {
  for (const bad of [null, {}, { jsonrpc: '1.0', id: 1, method: 'x' }, { jsonrpc: '2.0', id: 1 }]) {
    const r = await handle(bad, deps());
    assert.equal(r.error.code, ERRORS.INVALID_REQUEST, `${JSON.stringify(bad)} should be refused`);
  }
});

test('ping answers, because a client uses it to decide a slow server is alive', async () => {
  const r = await handle({ jsonrpc: '2.0', id: 3, method: 'ping' }, deps());
  assert.deepEqual(r.result, {});
});

test('an unknown method is -32601, not a crash', async () => {
  const r = await handle({ jsonrpc: '2.0', id: 4, method: 'resources/read' }, deps());
  assert.equal(r.error.code, ERRORS.METHOD_NOT_FOUND);
});

// ---------------------------------------------------------------- the tool surface

test('there are two tools, and neither takes a token', () => {
  // The whole credential design in one assertion. E-01 permits an environment credential
  // for stdio; E-04 warns against putting a token anywhere a header might carry it.
  assert.deepEqual(TOOLS.map((t) => t.name), ['collect', 'fetch_corpus']);
  for (const tool of TOOLS) {
    const props = Object.keys(tool.inputSchema.properties);
    assert.ok(!props.some((p) => /token|auth|secret|key|credential/i.test(p)),
      `${tool.name} exposes a credential parameter: ${props.join(', ')}`);
    assert.equal(tool.inputSchema.type, 'object');
    assert.equal(tool.inputSchema.additionalProperties, false,
      'the spec recommends additionalProperties:false; it is what turns a caller typo into an error');
  }
});

test('every tool description warns that a corpus is not an approved brief', () => {
  // The description is the only text a model reliably reads before calling. If the
  // warning is not there it is nowhere that matters.
  for (const tool of TOOLS) {
    assert.match(tool.description, /not approved|NOT approved|buildAuthorized/,
      `${tool.name} does not say that what comes back is unapproved evidence`);
  }
});

test('an unknown or mistyped argument is refused, not ignored', () => {
  const collect = TOOLS[0];
  assert.match(validateArgs(collect, { repository: 'o/r' }), /missing required argument topic/);
  assert.match(validateArgs(collect, { repository: 'o/r', topic: 'x', token: 'oops' }), /unknown argument token/);
  assert.match(validateArgs(collect, { repository: 'o/r', topic: 'x', max_pages: '8' }), /must be an integer/);
  assert.match(validateArgs(collect, { repository: 'o/r', topic: 'x', max_pages: 99 }), /at most 25/);
  // Found 2026-09-27: an empty topic passed validation and reached GitHub, which answered
  // HTTP 422 "Required input 'topic' not provided" - the one bad argument not refused here.
  assert.match(validateArgs(collect, { repository: 'o/r', topic: '' }) ?? '', /topic must not be empty/);
  assert.match(validateArgs(collect, { repository: 'o/r', topic: '   ' }) ?? '', /topic must not be empty/);
  assert.equal(collect.inputSchema.properties.topic.minLength, 1, 'the schema a client reads does not say so');
  assert.match(validateArgs(collect, { repository: 'o/r', topic: 'x', depth: 'deep' }), /must be one of/);
  assert.equal(validateArgs(collect, { repository: 'o/r', topic: 'x', max_pages: 8, depth: 'quick' }), null);
});

// ---------------------------------------------------------------- collecting

test('collect takes pages to fetch by URL, in the same input as the queries', async () => {
  const d = deps();
  await handle(call('collect', { repository: 'o/r', topic: 'x', queries: ['q'], urls: ['https://a.example/x'] }), d);
  assert.equal(d.seen.dispatch.inputs.queries, 'q\nhttps://a.example/x');
  const bad = deps();
  const r = await handle(call('collect', { repository: 'o/r', topic: 'x', urls: ['file:///etc/passwd'] }), bad);
  assert.equal(r.result.isError, true, 'a non-http URL must be refused, not dispatched');
  assert.equal(bad.seen.dispatch, undefined, 'nothing was dispatched');
});

test('collect returns the run id immediately and says the work is not finished', async () => {
  const d = deps();
  const r = await handle(call('collect', { repository: 'o/r', topic: 'x' }), d);
  assert.equal(r.result.structuredContent.workflowRunId, 42);
  assert.match(r.result.content[0].text, /takes minutes/);
  assert.match(r.result.content[0].text, /evidence, not approved research/);
  assert.equal(d.seen.dispatch.inputs.max_pages, 8, 'a default the caller did not have to know');
  assert.equal(d.seen.dispatch.inputs.depth, 'quick');
});

test('a missing credential is a TOOL error, not a protocol error', async () => {
  // The request was well-formed and understood. -32603 would tell the model nothing it
  // could act on; `isError` with a sentence gives it something to relay.
  const r = await handle(call('collect', { repository: 'o/r', topic: 'x' }), deps({ env: {} }));
  assert.equal(r.error, undefined, 'a missing token is not a malformed request');
  assert.equal(r.result.isError, true);
  assert.match(r.result.content[0].text, /RESEARCH_KIT_GITHUB_TOKEN/);
  assert.match(r.result.content[0].text, /no token parameter/);
});

test('an unfinished run is reported, not waited on', async () => {
  // A server cannot announce completion later (E-03), and blocking a tool call for
  // several minutes risks the client timing out on a healthy run.
  const d = deps({ summary: async () => ({ status: 'in_progress', conclusion: null, htmlUrl: 'h', runId: 42 }) });
  const r = await handle(call('fetch_corpus', { repository: 'o/r', workflow_run_id: 42 }), d);
  assert.equal(r.result.structuredContent.ready, false);
  assert.equal(r.result.isError, undefined, 'still running is not a failure');
  assert.match(r.result.content[0].text, /call again shortly/);
});

test('a failed run is an error that names where to look', async () => {
  const d = deps({ summary: async () => ({ status: 'completed', conclusion: 'failure', htmlUrl: 'https://h', runId: 42 }) });
  const r = await handle(call('fetch_corpus', { repository: 'o/r', workflow_run_id: 42 }), d);
  assert.equal(r.result.isError, true);
  assert.match(r.result.content[0].text, /first failing step/);
});

test('an out_dir it cannot write is refused before the run is even read', async () => {
  // The run lookup is a GitHub call; answering it and then failing on the folder spent
  // it for nothing, and surfaced a raw ENOTDIR under code UNKNOWN.
  const dir = tempDir();
  try {
    fs.writeFileSync(path.join(dir, 'a-file'), 'x');
    let asked = 0;
    const d = deps({ summary: async () => { asked += 1; return { status: 'completed', conclusion: 'success', htmlUrl: 'h', runId: 42 }; } });
    const r = await handle(call('fetch_corpus', { repository: 'o/r', workflow_run_id: 42, out_dir: path.join(dir, 'a-file', 'sub') }), d);
    assert.equal(r.result.isError, true);
    assert.equal(r.result.structuredContent.code, 'OUT_DIR');
    assert.match(r.result.content[0].text, /writable folder/);
    assert.equal(asked, 0, 'the run was read before the folder was checked');
  } finally { cleanup(dir); }
});

// ---------------------------------------------------------------- the artifact

test('the corpus comes back as a LINK, never as embedded bytes', async () => {
  // E-04 defines both, and states no maximum size for an embedded resource - so a link
  // is the defensible option rather than the merely available one.
  const r = await handle(call('fetch_corpus', { repository: 'o/r', workflow_run_id: 42 }), deps());
  const link = r.result.content.find((c) => c.type === 'resource_link');
  assert.ok(link, 'no resource_link in the result');
  assert.ok(!r.result.content.some((c) => c.type === 'resource'), 'the package must not be embedded');
  assert.match(link.uri, /^file:\/\/\//);
  assert.equal(link.mimeType, 'application/zip');
});

test('a Windows path becomes a usable file URI', () => {
  const link = resourceLink('C:\\tmp\\a b\\corpus.zip', { name: 'corpus.zip', description: 'd' });
  assert.equal(link.uri, 'file:///C:/tmp/a b/corpus.zip',
    'backslashes are not path separators in a URI, and a client given one cannot open the file');
});

test('buildAuthorized reaches the caller in structured form and in words', async () => {
  const r = await handle(call('fetch_corpus', { repository: 'o/r', workflow_run_id: 42 }), deps());
  assert.equal(r.result.structuredContent.buildAuthorized, false);
  assert.match(r.result.content[0].text, /COLLECTED CORPUS/);
  assert.match(r.result.content[0].text, /do not build from it/);
});

test('an approved corpus says so instead, and the two texts cannot both appear', async () => {
  const d = deps({ corpus: async () => ({
    file: '/tmp/x.zip',
    validation: { status: 'PASS', buildAuthorized: true, state: 'APPROVED_BRIEF', packageId: 'RK-Y', errors: [] },
  }) });
  const r = await handle(call('fetch_corpus', { repository: 'o/r', workflow_run_id: 42 }), d);
  assert.equal(r.result.structuredContent.buildAuthorized, true);
  assert.match(r.result.content[0].text, /APPROVED brief/);
  assert.ok(!/do not build/i.test(r.result.content[0].text));
});

test('an invalid package is flagged isError even though the call succeeded', async () => {
  const d = deps({ corpus: async () => ({
    file: '/tmp/x.zip',
    validation: { status: 'FAIL', buildAuthorized: false, state: 'HUMAN_REVIEW_REQUIRED', packageId: null, errors: [{ code: 'FILE-HASH-MISMATCH', message: 'x' }] },
  }) });
  const r = await handle(call('fetch_corpus', { repository: 'o/r', workflow_run_id: 42 }), d);
  assert.equal(r.result.isError, true);
  assert.equal(r.result.structuredContent.errors.length, 1);
});

test('a thrown transport failure never leaks the token', async () => {
  const leaked = TOKEN_ENV.RESEARCH_KIT_GITHUB_TOKEN;
  const d = deps({ dispatch: async () => { throw new Error(`bad credentials for ${leaked}`); } });
  const r = await handle(call('collect', { repository: 'o/r', topic: 'x' }), d);
  assert.equal(r.result.isError, true);
  assert.ok(!JSON.stringify(r).includes(leaked), 'the token reached a tool result');
  assert.match(r.result.content[0].text, /redacted/);
});

// ---------------------------------------------------------------- stdio framing

test('the loop reads newline-delimited JSON and writes one line per response', async () => {
  const input = new PassThrough();
  const output = new PassThrough();
  const lines = [];
  output.on('data', (c) => lines.push(...String(c).split('\n').filter(Boolean)));

  createStdioLoop({ input, output, onMessage: (m) => handle(m, deps()) });
  input.write(`${JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'ping' })}\n`);
  input.write('not json at all\n');
  input.write(`${JSON.stringify({ jsonrpc: '2.0', method: 'notifications/cancelled' })}\n`);
  input.write(`${JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/list' })}\n`);
  await new Promise((r) => setTimeout(r, 40));

  const parsed = lines.map((l) => JSON.parse(l));
  assert.equal(parsed.length, 3, `expected ping, parse error and tools/list - got ${lines.length}`);
  assert.deepEqual(parsed[0].result, {});
  assert.equal(parsed[1].error.code, ERRORS.PARSE, 'unparseable input is a parse error, not a crash');
  assert.equal(parsed[2].result.tools.length, 2);
});

// Arena break test 4 (2026-09-28): the loop buffered until a newline, with no bound, so a
// client that never sent one grew the server's memory until it died. A line over the cap
// is refused as soon as it passes the cap - not when its newline finally arrives - its
// bytes are dropped through that newline, and the next message is served.
test('a line over the cap is refused at once, dropped, and the next message is served', async () => {
  const input = new PassThrough();
  const output = new PassThrough();
  const lines = [];
  output.on('data', (c) => lines.push(...String(c).split('\n').filter(Boolean)));

  createStdioLoop({ input, output, onMessage: (m) => handle(m, deps()), maxLine: 1000 });
  for (let i = 0; i < 5; i += 1) input.write('x'.repeat(600));
  await new Promise((r) => setTimeout(r, 20));
  assert.equal(lines.length, 1, 'the over-long line was not refused before its newline arrived');
  assert.equal(JSON.parse(lines[0]).error.code, ERRORS.INVALID_REQUEST);
  assert.match(JSON.parse(lines[0]).error.message, /1000/);

  input.write(`${'x'.repeat(600)}\n${JSON.stringify({ jsonrpc: '2.0', id: 7, method: 'ping' })}\n`);
  await new Promise((r) => setTimeout(r, 40));
  assert.equal(lines.length, 2, `the rest of the long line was read as a message: ${lines.join(' | ')}`);
  assert.equal(JSON.parse(lines[1]).id, 7);

  // A complete line over the cap, arriving in one chunk, is refused the same way.
  input.write(`${'y'.repeat(1500)}\n`);
  await new Promise((r) => setTimeout(r, 20));
  assert.equal(JSON.parse(lines[2]).error.code, ERRORS.INVALID_REQUEST);
});

test('the loop has a default line cap', () => {
  assert.ok(Number.isInteger(MAX_LINE) && MAX_LINE >= 1024 * 1024, `MAX_LINE is ${MAX_LINE}`);
});

test('a message split across chunks is still one message', async () => {
  const input = new PassThrough();
  const output = new PassThrough();
  const lines = [];
  output.on('data', (c) => lines.push(...String(c).split('\n').filter(Boolean)));

  createStdioLoop({ input, output, onMessage: (m) => handle(m, deps()) });
  const message = JSON.stringify({ jsonrpc: '2.0', id: 9, method: 'ping' });
  input.write(message.slice(0, 10));
  await new Promise((r) => setTimeout(r, 10));
  input.write(`${message.slice(10)}\n`);
  await new Promise((r) => setTimeout(r, 40));

  assert.equal(lines.length, 1, 'a stream is not a message boundary; only a newline is');
  assert.equal(JSON.parse(lines[0]).id, 9);
});

// ---------------------------------------------------------------- arguments
//
// Found 2026-09-28 (Arena break test 8). The server took no options and therefore
// CHECKED none: `mcp-server.mjs --zzz-not-a-flag` printed its banner and started
// serving, exit 0. Every other entrypoint in the kit refuses an unknown flag, and the
// reason is not tidiness - it is that a silently ignored option is a command doing its
// default thing while the operator believes otherwise, which cost this project 26
// Firecrawl credits once (see refuseUnknownFlags in lib/core.mjs).
//
// It cannot use refuseUnknownFlags: that helper lists the options an entrypoint DOES
// accept, and this one accepts none, so its list would be empty and it would refuse a
// bare invocation too.
test('the server refuses any argument, because its configuration is its environment', () => {
  const server = path.join(KIT_ROOT, 'bin', 'mcp-server.mjs');
  const run = (args) => spawnSync(process.execPath, [server, ...args], {
    encoding: 'utf8', timeout: 30_000, windowsHide: true,
    // An empty stdin, so that a server which ignores the argument cannot hang waiting
    // for a client that will never speak: it must end the moment stdin ends.
    input: '',
  });

  for (const args of [['--zzz-not-a-flag'], ['--directory', tempDir('rk-mcp-arg-')], ['--token', 'x']]) {
    const r = run(args);
    assert.equal(r.status, 2, `mcp-server.mjs accepted ${args.join(' ')} (exit ${r.status})`);
    assert.match(r.stderr, /unknown option/, `${args.join(' ')} was not named in the refusal`);
    assert.match(r.stderr, /takes no options/, 'the refusal does not say why there is nothing to accept');
  }
});

test('--help still works, and the server still starts with no arguments at all', () => {
  const server = path.join(KIT_ROOT, 'bin', 'mcp-server.mjs');
  const help = spawnSync(process.execPath, [server, '--help'], { encoding: 'utf8', timeout: 30_000, windowsHide: true, input: '' });
  assert.equal(help.status, 0, help.stderr);
  assert.match(help.stdout, /mcp-server - the Research-Kit collector/);

  // A refusal that refuses everything would pass the test above and break every client.
  const bare = spawnSync(process.execPath, [server], { encoding: 'utf8', timeout: 30_000, windowsHide: true, input: '' });
  assert.equal(bare.status, 0, `mcp-server.mjs refused to start with no arguments:\\n${bare.stderr}`);
  assert.doesNotMatch(bare.stderr, /unknown option/);
});
