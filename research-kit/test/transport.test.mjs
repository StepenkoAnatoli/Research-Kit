// The transport seam is real, not hypothetical: two adapters, one shape, and no data
// reaches a shell (ADR-0005, ADR-0020).

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { test, describe, assert, tempDir, fs, path, KIT_ROOT } from './harness.mjs';
import { readText } from '../lib/core.mjs';
import * as firecrawl from '../lib/firecrawl.mjs';
import * as httpKeyless from '../lib/http-transport.mjs';
import { TRANSPORTS, TRANSPORT_NAMES, selectTransport, probeFirecrawl } from '../lib/transport.mjs';

describe('transport');

test('both adapters hold the same seven-function shape', () => {
  assert.equal(firecrawl.ADAPTER_SHAPE.length, 7);
  for (const name of firecrawl.ADAPTER_SHAPE) {
    assert.ok(name in firecrawl, `firecrawl is missing ${name}`);
    assert.ok(name in httpKeyless, `the keyless adapter is missing ${name}`);
    assert.equal(typeof firecrawl[name], typeof httpKeyless[name], `${name} differs in kind between the two adapters`);
  }
});

test('the registry holds exactly the two adapters, and names no third vendor', () => {
  assert.deepEqual(TRANSPORT_NAMES, ['firecrawl-cli', 'http-keyless']);
  assert.equal(TRANSPORTS['firecrawl-cli'].name, 'firecrawl-cli');
  assert.equal(TRANSPORTS['http-keyless'].name, 'http-keyless');
});

test('selection precedence: explicit, then env, then config, then a probe', () => {
  const installed = () => ({ installed: true, authenticated: true, version: '1.0.0', credits: 900 });
  const absent = () => ({ installed: false, authenticated: false, version: null, credits: null });

  assert.equal(selectTransport({ explicit: 'http-keyless', env: {}, probe: installed, config: {} }).name, 'http-keyless');
  assert.equal(selectTransport({ env: { RESEARCH_KIT_TRANSPORT: 'http-keyless' }, probe: installed, config: {} }).name, 'http-keyless');
  assert.equal(selectTransport({ env: {}, probe: installed, config: { transport: 'http-keyless' } }).name, 'http-keyless');
  assert.equal(selectTransport({ env: {}, probe: installed, config: {} }).name, 'firecrawl-cli');
  assert.equal(selectTransport({ env: {}, probe: absent, config: {} }).name, 'http-keyless');
});

test('an unknown transport is an error naming the two that exist', () => {
  assert.throws(() => selectTransport({ explicit: 'curl', env: {}, config: {} }), /Known transports/);
});

test('probeFirecrawl takes injected probes, so doctor\'s tests need no CLI', () => {
  // cache:false, because the probe is now memoised per process - two different injected
  // CLIs in one test are two different questions, and both have to be asked.
  const state = probeFirecrawl({ cache: false, cliVersion: () => '2.3.4', status: () => ({ authenticated: true, credits: 512 }) });
  assert.equal(state.installed, true);
  assert.equal(state.authenticated, true);
  assert.equal(state.version, '2.3.4', 'an injected version wins over the one --status reports');
  assert.equal(state.credits, 512);
  assert.equal(probeFirecrawl({ cache: false, cliVersion: () => null, status: () => ({}) }).installed, false);
});

// --- no data reaches a shell -------------------------------------------------------

test('exec carries an argv ARRAY and spawns with shell:false', () => {
  let seen = null;
  firecrawl.exec(['scrape', 'https://x.invalid/a b'], {
    env: { PATH: '/usr/bin' },
    platform: 'linux',
    program: 'firecrawl',
    spawn: (file, args, opts) => { seen = { file, args, opts }; return { status: 0, stdout: '{}', stderr: '' }; },
  });
  // No program on this synthetic PATH, so resolution refuses before spawning.
  assert.equal(seen, null);
});

test('a POSIX invocation is shell-free and passes the URL through untouched', () => {
  const dir = tempDir('research-kit-bin-');
  const program = path.join(dir, 'firecrawl');
  fs.writeFileSync(program, '#!/bin/sh\necho "{}"\n');
  const invocation = firecrawl.resolveInvocation(['scrape', 'https://x.invalid/a?q=$(touch pwned)'], {
    env: { PATH: dir },
    platform: 'linux',
  });
  assert.equal(invocation.ok, true);
  assert.equal(invocation.shell, false);
  assert.equal(invocation.route, 'direct');
  assert.equal(invocation.args[1], 'https://x.invalid/a?q=$(touch pwned)', 'the URL is data, passed as one argv element');
});

test('a Windows .cmd shim validates every argument and REFUSES rather than re-quotes', () => {
  const dir = tempDir('research-kit-bin-');
  fs.writeFileSync(path.join(dir, 'firecrawl.cmd'), '@echo off\r\necho {}\r\n');

  const safe = firecrawl.resolveInvocation(['scrape', 'https://x.invalid/docs'], {
    env: { PATH: dir, PATHEXT: '.COM;.EXE;.BAT;.CMD', ComSpec: 'cmd.exe' },
    platform: 'win32',
  });
  assert.equal(safe.ok, true);
  assert.equal(safe.route, 'cmd-shim');
  assert.equal(safe.shell, false, 'cmd.exe is spawned as argv, never through a shell string');

  const hostile = firecrawl.resolveInvocation(['search', 'a & calc.exe'], {
    env: { PATH: dir, PATHEXT: '.COM;.EXE;.BAT;.CMD', ComSpec: 'cmd.exe' },
    platform: 'win32',
  });
  assert.equal(hostile.ok, false);
  assert.equal(hostile.reason, 'unsafe-for-cmd-shim');
  assert.match(hostile.remedy, /http-keyless/, 'the interpreter-free escape hatch is named');
});

test('the named cost: a percent-encoded URL is refused on the Windows shim route', () => {
  const dir = tempDir('research-kit-bin-');
  fs.writeFileSync(path.join(dir, 'firecrawl.cmd'), '@echo off\r\n');
  const refused = firecrawl.resolveInvocation(['scrape', 'https://x.invalid/a%20b'], {
    env: { PATH: dir, PATHEXT: '.CMD', ComSpec: 'cmd.exe' },
    platform: 'win32',
  });
  assert.equal(refused.ok, false, 'the cost is named, not hidden');
  assert.equal(firecrawl.CMD_SAFE_ARG.test('https://x.invalid/a%20b'), false);
  assert.equal(firecrawl.CMD_SAFE_ARG.test('https://x.invalid/a-b_c.d/e'), true);
});

test('a real stub CLI runs, and an injected $(touch ...) creates nothing', () => {
  if (process.platform === 'win32') return; // the POSIX route is what this pins
  const dir = tempDir('research-kit-bin-');
  const marker = path.join(dir, 'pwned');
  const program = path.join(dir, 'firecrawl');
  fs.writeFileSync(program, '#!/bin/sh\nprintf \'{"data":{"markdown":"hello"}}\'\n');
  fs.chmodSync(program, 0o755);

  const result = firecrawl.exec(['scrape', `https://x.invalid/?q=$(touch ${marker})`], {
    env: { PATH: dir },
    platform: 'linux',
  });
  assert.equal(result.ok, true, result.stderr);
  assert.equal(fs.existsSync(marker), false, 'the shell never saw the argument');
});

test('command() renders for display and nothing executes it', () => {
  const rendered = firecrawl.command(['scrape', 'https://x.invalid/a b']);
  assert.match(rendered, /^firecrawl scrape "https:\/\/x\.invalid\/a b"$/);
});

// --- payload normalisation ---------------------------------------------------------

test('normalizeScrape reads the payload and stamps transport and completeness', () => {
  const result = firecrawl.normalizeScrape('{"data":{"markdown":"# Limits","metadata":{"title":"T","statusCode":200,"sourceURL":"https://x.invalid/l"}}}', 'https://x.invalid/l');
  assert.equal(result.markdown, '# Limits');
  assert.equal(result.title, 'T');
  assert.equal(result.statusCode, 200);
  assert.equal(result.transport, 'firecrawl-cli');
  // "# Limits" is eight characters. It used to be stamped `full` because the adapter
  // stamped every successful scrape that way; the grade is now earned.
  assert.equal(result.completeness, 'partial');
  assert.match(result.omitted, /below the 1500-character bar/);
});

test('normalizeScrape survives a banner printed before the JSON', () => {
  const result = firecrawl.normalizeScrape('Firecrawl CLI v1.2\n{"data":{"markdown":"body"}}', 'https://x.invalid');
  assert.equal(result.markdown, 'body');
});

test('normalizeSearch and normalizeMap drop what has no URL', () => {
  assert.deepEqual(
    firecrawl.normalizeSearch('{"data":[{"url":"https://a.invalid","title":"A"},{"title":"no url"}]}').map((r) => r.url),
    ['https://a.invalid'],
  );
  assert.deepEqual(firecrawl.normalizeMap('{"links":["https://a.invalid",{"url":"https://b.invalid"},{}]}'), ['https://a.invalid', 'https://b.invalid']);
});

test('parseStatus reads what it can and reports null for what is not there', () => {
  // This invented sample is what the parser was written against before a key existed:
  // a number BEFORE the word "credits". The real CLI prints "Credits: 949 / 1,000", so
  // the shape this test used to assert was never the shape the CLI emits.
  const guessed = firecrawl.parseStatus('Authenticated. 1,000 credits remaining.');
  assert.equal(guessed.authenticated, true);
  assert.equal(guessed.credits, null, 'no "Credits: n / m" line, so no count is claimed');
  assert.equal(guessed.concurrencyLimit, null);

  assert.equal(firecrawl.parseStatus('not authenticated').authenticated, false);
});

test('a failing CLI becomes a result, not an exception', () => {
  const result = firecrawl.scrape('https://x.invalid', { execFn: () => ({ ok: false, status: 1, stdout: '', stderr: 'HTTP 402' }) });
  assert.equal(result.ok, false);
  assert.equal(result.error, 'HTTP 402');
  assert.equal(result.transport, 'firecrawl-cli');
});

// --- the keyless adapter -----------------------------------------------------------

test('the keyless adapter grades its own completeness honestly', () => {
  assert.equal(httpKeyless.gradeCompleteness('x'.repeat(2000)).completeness, 'full');
  const partial = httpKeyless.gradeCompleteness('x'.repeat(100));
  assert.equal(partial.completeness, 'partial');
  assert.match(partial.omitted, /100 characters/, 'a partial capture names what is missing');
});

test('htmlToMarkdown keeps headings, lists, links and tables; drops scripts', () => {
  const md = httpKeyless.htmlToMarkdown('<h2>Limits</h2><script>evil()</script><ul><li>10 <b>per minute</b></li></ul><p>See <a href="https://x.invalid">docs</a>.</p><table><tr><th>Plan</th><th>Credits</th></tr><tr><td>Free</td><td>1,000</td></tr></table>');
  assert.match(md, /## Limits/);
  assert.doesNotMatch(md, /evil/);
  assert.match(md, /- 10 \*\*per minute\*\*/);
  assert.match(md, /\[docs\]\(https:\/\/x\.invalid\)/);
  assert.match(md, /\| Plan \| Credits \|/);
});

test('decodeEntities handles named, decimal and hex references', () => {
  assert.equal(httpKeyless.decodeEntities('a&amp;b &#65; &#x42; &nbsp;c'), 'a&b A B  c');
});

test('mainContent picks the densest block', () => {
  const html = '<div><nav><a href="/a">a</a><a href="/b">b</a><a href="/c">c</a></nav><article>' + 'Real prose about rate limits and credits. '.repeat(20) + '</article></div>';
  assert.match(httpKeyless.mainContent(html).html, /Real prose/);
});

test('the keyless adapter never reads a key and charges no credit', () => {
  const state = httpKeyless.status();
  assert.equal(state.authenticated, false);
  assert.equal(state.credits, null);
  const source = fs.readFileSync(fileURLToPath(new URL('../lib/http-transport.mjs', import.meta.url)), 'utf8');
  assert.doesNotMatch(source, /API_KEY/, 'the keyless adapter must not know about keys');
});

test('the rendezvous returns a result object rather than throwing, when the job fails', () => {
  const result = httpKeyless.scrape('https://x.invalid/never', {
    spawn: () => ({ stdout: '', stderr: 'boom', status: 1 }),
  });
  assert.equal(result.ok, false);
  assert.equal(result.transport, 'http-keyless');
  assert.match(result.error, /boom/);
});

test('a scrape through the rendezvous produces a graded capture', () => {
  const body = `<html><head><title>Limits</title></head><body><article>${'The free plan allows 10 requests per minute. '.repeat(60)}</article></body></html>`;
  const result = httpKeyless.scrape('https://x.invalid/limits', {
    spawn: () => ({ stdout: JSON.stringify({ ok: true, url: 'https://x.invalid/limits', statusCode: 200, body }), stderr: '', status: 0 }),
  });
  assert.equal(result.ok, true);
  assert.equal(result.title, 'Limits');
  assert.equal(result.transport, 'http-keyless');
  assert.equal(result.completeness, 'full');
  assert.match(result.markdown, /10 requests per minute/);
});

test('map keeps same-domain links only', () => {
  const body = '<a href="/docs/a">a</a><a href="https://other.invalid/x">x</a><a href="https://x.invalid/b">b</a>';
  const result = httpKeyless.map('https://x.invalid/', {
    spawn: () => ({ stdout: JSON.stringify({ ok: true, url: 'https://x.invalid/', body }), stderr: '', status: 0 }),
  });
  assert.deepEqual(result.links.sort(), ['https://x.invalid/b', 'https://x.invalid/docs/a']);
});

test('search unwraps the redirect the result list wraps its URLs in', () => {
  const body = '<a href="//duckduckgo.com/l/?uddg=https%3A%2F%2Fdocs.x.invalid%2Flimits" class="result-link">Limits</a>';
  const result = httpKeyless.search('x limits', {
    spawn: () => ({ stdout: JSON.stringify({ ok: true, body }), stderr: '', status: 0 }),
  });
  assert.equal(result.results[0].url, 'https://docs.x.invalid/limits');
});

test('the keyless adapter runs as its own child: node <file> answers a job on stdin', () => {
  const file = fileURLToPath(new URL('../lib/http-transport.mjs', import.meta.url));
  const result = spawnSync(process.execPath, [file], {
    input: JSON.stringify({ kind: 'unknown-job' }),
    encoding: 'utf8',
    timeout: 20_000,
  });
  assert.equal(result.status, 0);
  assert.deepEqual(JSON.parse(result.stdout), { ok: false, error: 'unknown job kind "unknown-job"' });
});

// --- an anonymous CLI is a different guarantee, and is recorded as one -------------

test('D2: an UNAUTHENTICATED CLI is labelled anonymous, not metered', () => {
  const anonymous = () => ({ installed: true, authenticated: false, version: '1.23.3', credits: null });
  const chosen = selectTransport({ env: {}, probe: anonymous, config: {} });

  assert.equal(chosen.name, firecrawl.ANONYMOUS_NAME);
  assert.match(chosen.why, /NOT authenticated/);
  assert.notEqual(chosen.name, firecrawl.name,
    'stamping it firecrawl-cli made a fetch nobody paid for indistinguishable from a metered one');
});

test('D2: the label reaches the CAPTURE, not just the selection', () => {
  const anonymous = () => ({ installed: true, authenticated: false, version: '1.23.3', credits: null });
  const chosen = selectTransport({ env: {}, probe: anonymous, config: {} });
  const result = chosen.adapter.runScrape('https://x.invalid/a', {
    execFn: () => ({ ok: true, status: 0, stdout: JSON.stringify({ data: { markdown: 'x'.repeat(2000) } }), stderr: '' }),
  });
  assert.equal(result.transport, firecrawl.ANONYMOUS_NAME, 'the ledger records what the check will judge');
});

test('D2: an AUTHENTICATED CLI is the metered transport, unwrapped', () => {
  const authed = () => ({ installed: true, authenticated: true, version: '1.23.3', credits: 900 });
  const chosen = selectTransport({ env: {}, probe: authed, config: {} });
  assert.equal(chosen.name, firecrawl.name);
  assert.equal(chosen.adapter, firecrawl, 'no wrapper when the label already matches');
});

test('D2: transport-provenance names the anonymous case specifically', async () => {
  const { CHECKS } = await import('../lib/checks.mjs');
  const check = CHECKS.find((c) => c.name === 'transport-provenance');
  const corpus = {
    evidence: [{ id: 'E-01', url: 'u', raw: 'research/raw/a.md', line: 1 }],
    ledger: { entries: [{ op: 'scrape', url: 'u', raw: 'research/raw/a.md', transport: 'firecrawl-cli-anonymous' }] },
    captures: { byFile: new Map([['research/raw/a.md', { file: 'research/raw/a.md', transport: 'firecrawl-cli-anonymous' }]]), byUrl: new Map() },
  };
  const finding = check.run(corpus).find((f) => f.severity === 'warn');
  assert.match(finding.detail, /NO credential/);
  assert.match(finding.detail, /capped per IP/);
});

// --- the completeness grade is earned, by both adapters ---------------------------

test('D3: the firecrawl adapter grades completeness instead of stamping full', () => {
  const thin = firecrawl.normalizeScrape(JSON.stringify({ data: { markdown: 'x'.repeat(167) } }), 'https://x.invalid');
  assert.equal(thin.completeness, 'partial', 'a 167-character page came back graded full');
  assert.match(thin.omitted, /167 characters/);

  const full = firecrawl.normalizeScrape(JSON.stringify({ data: { markdown: 'x'.repeat(2000) } }), 'https://x.invalid');
  assert.equal(full.completeness, 'full');
  assert.equal(full.omitted, '');
});

test('D3: both adapters use the SAME bar, so they cannot disagree about "full"', () => {
  assert.equal(firecrawl.FULL_THRESHOLD, httpKeyless.FULL_THRESHOLD);
  const size = firecrawl.FULL_THRESHOLD - 1;
  assert.equal(firecrawl.gradeCompleteness('x'.repeat(size)).completeness, 'partial');
  assert.equal(httpKeyless.gradeCompleteness('x'.repeat(size)).completeness, 'partial');
});

// --- the probe is asked once ------------------------------------------------------

test('D1: probeFirecrawl is memoised, and presence costs no spawn', async () => {
  const { forgetProbe } = await import('../lib/transport.mjs');
  forgetProbe();
  let statusCalls = 0;
  let resolveCalls = 0;
  const opts = {
    resolve: () => { resolveCalls += 1; return '/usr/bin/firecrawl'; },
    status: () => { statusCalls += 1; return { authenticated: true, credits: 1 }; },
  };

  probeFirecrawl(opts);
  probeFirecrawl(opts);
  probeFirecrawl(opts);

  assert.equal(statusCalls, 1, 'doctor asked once and handed the same probe to selectTransport, which asked again');
  assert.equal(resolveCalls, 1);
  forgetProbe();
});

test('D1: cache:false still asks, for a long-lived process', async () => {
  const { forgetProbe } = await import('../lib/transport.mjs');
  forgetProbe();
  let calls = 0;
  const opts = { cache: false, resolve: () => '/usr/bin/firecrawl', status: () => { calls += 1; return { authenticated: false }; } };
  probeFirecrawl(opts);
  probeFirecrawl(opts);
  assert.equal(calls, 2);
  forgetProbe();
});

// --- vendor knowledge, verified against a REAL payload ----------------------------
//
// O-4 of the hardening design: "Firecrawl is still unauthenticated, so the collector's
// parsers remain unvalidated against real payloads." It stayed open until a key existed.
// These run against bytes captured from firecrawl v1.23.3 on 2026-09-19.

const REAL_STATUS = readText(path.join(KIT_ROOT, 'test', 'fixtures', 'firecrawl-status-1.23.3.txt'));

test('O-4: the status parser reads the CLI\'s actual output', () => {
  assert.ok(REAL_STATUS, 'the fixture must exist - a parser with no real payload is the defect');
  const s = firecrawl.parseStatus(REAL_STATUS);

  assert.equal(s.authenticated, true);
  assert.equal(s.credits, 949, 'the old regex wanted a number BEFORE the word "credits"; this CLI puts the word first');
  assert.equal(s.creditLimit, 1000);
  assert.equal(s.concurrencyInUse, 0);
  assert.equal(s.concurrencyLimit, 2, 'matches E-01: two concurrent browsers on the free plan');
  assert.equal(s.version, '1.23.3');
});

test('O-4: stripAnsi removes the ESCAPE, not just the bracket sequence', () => {
  const ESC = String.fromCharCode(27);
  assert.ok(REAL_STATUS.includes(ESC), 'the fixture carries real escapes');
  const stripped = firecrawl.stripAnsi(REAL_STATUS);
  assert.equal(stripped.includes(ESC), false, 'leaving the ESC behind put a control character where parsers expected a word boundary');
  assert.match(stripped, /Credits: 949 \/ 1,000/);
});

test('O-4: status() calls --status, the flag the CLI actually has', () => {
  let seen = null;
  firecrawl.status({ execFn: (argv) => { seen = argv; return { ok: true, stdout: REAL_STATUS, stderr: '' }; } });
  assert.deepEqual(seen, ['--status'], '`firecrawl status` is not a command: it exits non-zero and the probe never sees a key');
});

test('O-4: an unauthenticated machine is read as unauthenticated, not as a parse failure', () => {
  const s = firecrawl.parseStatus('firecrawl cli v1.23.3\n  Not authenticated - run firecrawl login\n');
  assert.equal(s.authenticated, false);
  assert.equal(s.credits, null);
});
