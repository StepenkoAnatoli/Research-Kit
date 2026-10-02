// The guard proxy Chromium renders through (ADR-0118).
//
// ADR-0110 refused a redirect into this machine's network for the keyless fetch and left the
// browser open; ADR-0115 judged the URL asked for, and nothing a page does after it loads.
// Measured 2026-10-01 with Chromium 141 behind a loopback proxy: a page navigating by script
// (`location.href`) and one with `<meta http-equiv="refresh">` both reached the address they
// named, so a proxy that judges every request is the one place all of them pass through.
// Pointing Chromium at it needs `--proxy-bypass-list=<-loopback>`: by default it bypasses a
// proxy for loopback addresses, which is where the guard's own tests live.

import http from 'node:http';
import net from 'node:net';
import { spawn } from 'node:child_process';
import { test, describe, assert, tempDir, fs, path, requireCapability } from './harness.mjs';
import { startGuard, judge, parseUpstream, renderThroughGuard, REFUSAL_MARKER, DROP_MARKER, isBrowserService } from '../lib/browser-guard.mjs';
import browser, { findBrowser, renderGuarded, browserArgs } from '../lib/browser-transport.mjs';

describe('browser-guard');

/** A page server on 127.0.0.1; `routes` maps a path to a body. */
async function site(routes) {
  const server = http.createServer((req, res) => {
    const body = routes[req.url.split('?')[0]];
    if (body === undefined) { res.writeHead(404); res.end('no such page'); return; }
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(typeof body === 'function' ? body() : body);
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return { port: server.address().port, base: `http://127.0.0.1:${server.address().port}`, close: () => new Promise((r) => { server.closeAllConnections?.(); server.close(r); }) };
}

/** One plain request through a proxy, as a browser would send it: an absolute URL. */
function viaProxy(proxyPort, url) {
  return new Promise((resolve, reject) => {
    const target = new URL(url);
    const req = http.request({ host: '127.0.0.1', port: proxyPort, path: url, method: 'GET', headers: { host: target.host } }, (res) => {
      let body = '';
      res.on('data', (d) => { body += d; });
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.end();
  });
}

/** A CONNECT through a proxy; resolves with the proxy's answer line and, when it opened, a socket. */
function connectVia(proxyPort, hostPort) {
  return new Promise((resolve, reject) => {
    const socket = net.connect(proxyPort, '127.0.0.1', () => socket.write(`CONNECT ${hostPort} HTTP/1.1\r\nHost: ${hostPort}\r\n\r\n`));
    let head = '';
    const onData = (d) => {
      head += d;
      const end = head.indexOf('\r\n\r\n');
      if (end < 0) return;
      socket.off('data', onData);
      const line = head.slice(0, head.indexOf('\r\n'));
      const rest = head.slice(end + 4);
      resolve({ line, rest, socket });
    };
    socket.on('data', onData);
    socket.on('error', reject);
  });
}

const fakeLookup = (answers) => (host, opts, cb) => {
  const found = answers[host];
  if (!found) { cb(Object.assign(new Error(`getaddrinfo ENOTFOUND ${host}`), { code: 'ENOTFOUND' })); return; }
  const list = [].concat(found).map((address) => ({ address, family: address.includes(':') ? 6 : 4 }));
  if (opts.all) cb(null, list); else cb(null, list[0].address, list[0].family);
};

test('a plain request to an internal host is refused with the marker, unless it was asked for or allowed', async () => {
  const pages = await site({ '/secret': '<p>SECRET-TOKEN</p>' });
  const guard = await startGuard({ allowInternal: false, exempt: ['asked.example:80'] });
  try {
    const r = await viaProxy(guard.port, `${pages.base}/secret`);
    assert.equal(r.status, 403, `an internal address not asked for was reached: ${r.body}`);
    assert.match(r.body, new RegExp(`^${REFUSAL_MARKER}: 127\\.0\\.0\\.1:${pages.port} - 127\\.0\\.0\\.1 is an internal address`));
    assert.doesNotMatch(r.body, /SECRET-TOKEN/);
    assert.deepEqual(guard.refused.map((x) => x.host), [`127.0.0.1:${pages.port}`], 'the refusal was not recorded');
  } finally { await guard.close(); }

  const asked = await startGuard({ allowInternal: false, exempt: [`127.0.0.1:${pages.port}`] });
  try {
    const r = await viaProxy(asked.port, `${pages.base}/secret`);
    assert.equal(r.status, 200, 'the host:port the operator asked for was refused');
    assert.match(r.body, /SECRET-TOKEN/);
    assert.deepEqual(asked.refused, []);
    const other = await viaProxy(asked.port, `http://127.0.0.1:${pages.port + 1}/x`);
    assert.equal(other.status, 403, 'another port on the host asked for was exempt too: the exemption is host:port');
    assert.deepEqual(asked.refused.map((x) => x.host), [`127.0.0.1:${pages.port + 1}`]);
  } finally { await asked.close(); }

  const allowed = await startGuard({ allowInternal: true });
  try {
    assert.equal((await viaProxy(allowed.port, `${pages.base}/secret`)).status, 200, 'the operator\'s own network was refused');
  } finally { await allowed.close(); await pages.close(); }
});

test('a CONNECT tunnel is judged the same way, and carries bytes both ways when it is allowed', async () => {
  const pages = await site({ '/t': '<p>THROUGH-THE-TUNNEL</p>' });
  const guard = await startGuard({ allowInternal: false });
  try {
    const refused = await connectVia(guard.port, `127.0.0.1:${pages.port}`);
    assert.match(refused.line, /^HTTP\/1\.1 403/, `a tunnel into an internal address was opened: ${refused.line}`);
    assert.match(refused.rest, new RegExp(REFUSAL_MARKER));
    refused.socket.destroy();
    assert.equal(guard.refused.length, 1);
  } finally { await guard.close(); }

  const allowed = await startGuard({ allowInternal: true });
  try {
    const opened = await connectVia(allowed.port, `127.0.0.1:${pages.port}`);
    assert.match(opened.line, /^HTTP\/1\.1 200/, opened.line);
    const answer = await new Promise((resolve) => {
      let got = '';
      opened.socket.on('data', (d) => { got += d; if (/THROUGH-THE-TUNNEL/.test(got)) resolve(got); });
      opened.socket.write(`GET /t HTTP/1.1\r\nHost: 127.0.0.1:${pages.port}\r\nConnection: close\r\n\r\n`);
    });
    assert.match(answer, /HTTP\/1\.1 200/);
    opened.socket.destroy();
  } finally { await allowed.close(); await pages.close(); }
});

test('a name is judged by the addresses it resolves to, and the connection goes to the one judged', async () => {
  const pages = await site({ '/p': '<p>BY-NAME</p>' });
  // The name resolves inward: refused, naming the address. The site is the only thing on that
  // address, so reaching it when allowed proves the connection went to the lookup's answer.
  const lookup = fakeLookup({ 'site.example': '127.0.0.1', 'public.example': '93.184.216.34' });
  const guard = await startGuard({ allowInternal: false, lookup });
  try {
    const r = await viaProxy(guard.port, `http://site.example:${pages.port}/p`);
    assert.equal(r.status, 403);
    assert.match(r.body, /site\.example resolves to 127\.0\.0\.1, an internal address/);
  } finally { await guard.close(); }
  const allowed = await startGuard({ allowInternal: true, lookup });
  try {
    const r = await viaProxy(allowed.port, `http://site.example:${pages.port}/p`);
    assert.equal(r.status, 200, r.body);
    assert.match(r.body, /BY-NAME/);
  } finally { await allowed.close(); await pages.close(); }
  // The pieces, on their own.
  assert.deepEqual(await judge('169.254.169.254', 80, {}), { refused: '169.254.169.254 is an internal address' });
  assert.deepEqual(await judge('localhost', 80, {}), { refused: 'localhost is this machine' });
  assert.deepEqual(await judge('public.example', 443, { lookup }), { address: '93.184.216.34' });
  assert.match((await judge('nowhere.example', 80, { lookup })).refused, /could not be resolved/);
  assert.deepEqual(await judge('nowhere.example', 80, { lookup, upstream: { host: 'proxy.corp', port: 3128 } }), {}, 'behind a proxy an unresolvable name is the proxy\'s to resolve');
});

test('behind a configured proxy every request is forwarded to it, CONNECT included, and the proxy\'s own host is never judged', async () => {
  const seen = [];
  const upstream = http.createServer((req, res) => { seen.push(['http', req.url, req.headers['proxy-authorization'] ?? null]); res.writeHead(200, { 'content-type': 'text/plain' }); res.end('VIA-UPSTREAM'); });
  upstream.on('connect', (req, socket) => { seen.push(['connect', req.url]); socket.end('HTTP/1.1 200 Connection Established\r\n\r\nTUNNEL-UP'); });
  await new Promise((resolve) => upstream.listen(0, '127.0.0.1', resolve));
  const upstreamPort = upstream.address().port;
  const lookup = fakeLookup({});    // nothing resolves here: the proxy resolves
  const guard = await startGuard({ allowInternal: false, lookup, upstream: `http://user:p%40ss@127.0.0.1:${upstreamPort}` });
  try {
    const r = await viaProxy(guard.port, 'http://public.example/page?q=1');
    assert.equal(r.status, 200, `not forwarded: ${r.body}`);
    assert.equal(r.body, 'VIA-UPSTREAM');
    assert.deepEqual(seen[0], ['http', 'http://public.example/page?q=1', `Basic ${Buffer.from('user:p@ss').toString('base64')}`], 'the absolute URL and the credential did not reach the proxy');
    const tunnel = await connectVia(guard.port, 'public.example:443');
    assert.match(tunnel.line, /^HTTP\/1\.1 200/, 'the upstream\'s answer to the CONNECT was not passed back');
    assert.equal(seen[1][0], 'connect');
    tunnel.socket.destroy();
    // An internal address is still refused here, before anything reaches the upstream.
    const inward = await viaProxy(guard.port, 'http://10.0.0.8/admin');
    assert.equal(inward.status, 403);
    assert.equal(seen.length, 2, 'a refused request reached the upstream');
  } finally { await guard.close(); await new Promise((r) => { upstream.closeAllConnections?.(); upstream.close(r); }); }
  assert.deepEqual(parseUpstream('proxy.corp:3128'), { host: 'proxy.corp', port: 3128, auth: null }, 'a bare host:port, as curl reads it');
  assert.equal(parseUpstream(''), null);
});

// Found 2026-10-01 on CI: the suite's first Chromium launch ran to its deadline on three
// Windows runs in a row, and nothing said what it had been waiting for. The guard is the one
// place every request passes through, so it keeps a record: what was asked, and whether it
// was answered. What is still unanswered when the render ends is the diagnosis.
test('the guard records every request it carried, and reports the ones still unanswered', async () => {
  const pages = await site({ '/quick': '<html><body>quick</body></html>' });
  const silent = http.createServer(() => { /* never answers */ });
  await new Promise((resolve) => silent.listen(0, '127.0.0.1', resolve));
  const guard = await startGuard({ allowInternal: true });
  try {
    const quick = await viaProxy(guard.port, `${pages.base}/quick`);
    assert.equal(quick.status, 200);
    const stalled = viaProxy(guard.port, `http://127.0.0.1:${silent.address().port}/never`).catch((err) => ({ error: err.code }));
    await new Promise((r) => setTimeout(r, 150));
    const pending = guard.pending();
    assert.deepEqual(pending.map((e) => [e.kind, e.target]), [['http', `http://127.0.0.1:${silent.address().port}/never`]], JSON.stringify(guard.seen));
    assert.ok(pending[0].ms >= 100, 'how long it has waited is part of the record');
    assert.equal(guard.seen.length, 2, 'the answered request is on the record too');
    assert.equal(guard.seen[0].outcome, '200');
    await guard.close();
    await stalled;
    assert.equal(guard.pending().length, 0, 'closing ends every request');
    assert.equal(guard.seen[1].outcome, 'unanswered');
  } finally { await guard.close(); await pages.close(); await new Promise((r) => { silent.closeAllConnections?.(); silent.close(r); }); }
});

// Found 2026-10-01 on CI (Windows): a hung launch's log tail showed profile creation 43 s
// after the launch and normal progress after it, so the wait was in the first 43 s - which
// the tail, the last 60 lines, could not show. The child keeps the HEAD of the browser's
// stderr as well as the tail, and stamps the launch, so the first lines and the first gap
// are readable against the browser's own timestamps.
test('the child keeps the head and the tail of the browser\'s stderr, and stamps the launch', async () => {
  const noisy = path.join(tempDir('rk-noisy-browser-'), 'browser.mjs');
  fs.writeFileSync(noisy, `
for (let i = 1; i <= 300; i += 1) process.stderr.write('line ' + i + '\\n');
process.stdout.write('<html><body>done</body></html>');
`);
  const before = Date.now();
  const r = await renderThroughGuard({ binary: process.execPath, args: [noisy, '--dump-dom', 'http://127.0.0.1:9/none'], url: 'http://127.0.0.1:9/none', allowInternal: true, timeout: 10_000 });
  const lines = r.stderr.split('\n');
  assert.equal(lines[0], 'line 1', 'the head is gone');
  assert.equal(lines[lines.length - 1], 'line 300', 'the tail is gone');
  assert.ok(lines.includes('line 30') && !lines.includes('line 31'), 'the head keeps 30 lines');
  assert.ok(lines.includes('line 241') && !lines.includes('line 240'), 'the tail keeps 60 lines');
  assert.ok(lines.some((l) => /210 lines omitted/.test(l)), `the omission is said: ${lines.slice(28, 33).join(' | ')}`);
  assert.ok(typeof r.startedAt === 'string' && Date.parse(r.startedAt) >= before - 5 && Date.parse(r.startedAt) <= Date.now(), `startedAt: ${r.startedAt}`);
});

// Found 2026-10-01 on CI: Chromium's process startup on the runners takes anything from 4 s
// to 43 s before the browser makes its first request - the Windows legs, and once an Ubuntu
// one - and that time came out of the render timeout, so the page was killed before it
// could be asked for. The render timeout now starts at the browser's first request through
// the guard; the launch is allowed as long again, and no more (ADR-0119).
test('the render timeout starts at the browser\'s first request, and the launch is allowed as long again', async () => {
  const pages = await site({ '/slow': () => '<html><body>slow but whole</body></html>' });
  // The page answers after 1 s; the browser takes 1.2 s to start. Together past a 2 s timeout, apart inside it.
  const slowSite = http.createServer((req, res) => setTimeout(() => { res.writeHead(200, { 'content-type': 'text/html' }); res.end('<html><body>slow but whole</body></html>'); }, 1000));
  await new Promise((resolve) => slowSite.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${slowSite.address().port}/slow`;
  const sleepy = path.join(tempDir('rk-sleepy-browser-'), 'browser.mjs');
  fs.writeFileSync(sleepy, `
import http from 'node:http';
const args = process.argv.slice(2);
const proxy = Number(args.find((a) => a.startsWith('--proxy-server=')).split(':').pop());
await new Promise((r) => setTimeout(r, 1200));
const url = args.at(-1);
http.request({ host: '127.0.0.1', port: proxy, path: url, headers: { host: new URL(url).host } }, (res) => { let b = ''; res.on('data', (d) => { b += d; }); res.on('end', () => { process.stdout.write(b); }); }).end();
`);
  try {
    const r = await renderThroughGuard({ binary: process.execPath, args: [sleepy, '--dump-dom', url], url, allowInternal: true, timeout: 2_000 });
    assert.equal(r.errorCode, null, `the launch ate the render budget: ${r.errorMessage}`);
    assert.match(r.stdout, /slow but whole/);
    assert.ok(r.startupMs >= 1100 && r.startupMs < 2000, `startupMs ${r.startupMs}`);
    assert.ok(r.elapsedMs > 2000, `elapsed ${r.elapsedMs}: the page cannot have arrived inside 2 s`);
    // A browser that never makes a request has only its launch allowance - one timeout - then the kill.
    const mute = path.join(tempDir('rk-mute-browser-'), 'browser.mjs');
    fs.writeFileSync(mute, 'await new Promise((r) => setTimeout(r, 60_000));');
    const t0 = Date.now();
    const m = await renderThroughGuard({ binary: process.execPath, args: [mute, '--dump-dom', url], url, allowInternal: true, timeout: 700 });
    assert.equal(m.errorCode, 'ETIMEDOUT');
    assert.ok(Date.now() - t0 >= 650 && Date.now() - t0 < 3000, `a mute browser is killed at one timeout, took ${Date.now() - t0} ms`);
    assert.equal(m.startupMs, null, 'no first request, no startup time');
  } finally { await pages.close(); await new Promise((r) => { slowSite.closeAllConnections?.(); slowSite.close(r); }); }
});

/**
 * Two page servers in a process of their own: the transport blocks this one in spawnSync while
 * the guard child renders, so a server here would never answer. `inner` holds the page a page
 * on `outer` leads to. Resolves with both bases; `close` ends the process.
 */
const PAGES = `
import http from 'node:http';
const page = (body) => '<html><head><title>Plain</title></head><body><main><p>' + body + '</p></main></body></html>';
const inner = http.createServer((req, res) => { res.writeHead(200, { 'content-type': 'text/html' }); res.end(page('SECRET-TOKEN')); });
inner.listen(0, '127.0.0.1', () => {
  const to = 'http://127.0.0.1:' + inner.address().port + '/secret';
  const outer = http.createServer((req, res) => {
    res.writeHead(200, { 'content-type': 'text/html' });
    if (req.url === '/jump') res.end('<html><body><script>location.href=\\'' + to + '\\'</script>waiting</body></html>');
    else if (req.url === '/meta') res.end('<html><head><meta http-equiv="refresh" content="0;url=' + to + '"></head><body>waiting</body></html>');
    else res.end(page('A plain page rendered through the guard, with enough words to be graded as content. '.repeat(20)));
  });
  outer.listen(0, '127.0.0.1', () => process.stdout.write('PORTS ' + inner.address().port + ' ' + outer.address().port + '\\n'));
});
`;
async function pagesProcess() {
  const file = path.join(tempDir('rk-guard-pages-'), 'pages.mjs');
  fs.writeFileSync(file, PAGES);
  const proc = spawn(process.execPath, [file], { stdio: ['ignore', 'pipe', 'inherit'] });
  const ports = await new Promise((resolve, reject) => {
    let out = '';
    proc.stdout.on('data', (d) => { out += d; const m = out.match(/PORTS (\d+) (\d+)/); if (m) resolve([Number(m[1]), Number(m[2])]); });
    proc.on('exit', (code) => reject(new Error(`the page server exited ${code}`)));
  });
  return { innerPort: ports[0], inner: `http://127.0.0.1:${ports[0]}`, outer: `http://127.0.0.1:${ports[1]}`, close: () => proc.kill() };
}

/**
 * A stand-in browser: a Node script that takes Chromium's flags, requests the URL through the
 * proxy the flags name, follows one `location.href='...'` the page sets, and prints what it
 * ends on - the child's plumbing and the transport's reading of it, with no Chromium.
 */
function fakeBrowser() {
  const file = path.join(tempDir('rk-fake-browser-'), 'browser.mjs');
  fs.writeFileSync(file, `
import http from 'node:http';
const args = process.argv.slice(2);
const proxy = Number(args.find((a) => a.startsWith('--proxy-server=')).split(':').pop());
if (!args.includes('--proxy-bypass-list=<-loopback>')) { process.stderr.write('FATAL: loopback would bypass the proxy'); process.exit(3); }
const get = (url) => new Promise((resolve) => {
  const req = http.request({ host: '127.0.0.1', port: proxy, path: url, headers: { host: new URL(url).host } }, (res) => { let b = ''; res.on('data', (d) => { b += d; }); res.on('end', () => resolve(b)); });
  req.on('error', (e) => resolve('ERR ' + e.message));
  req.end();
});
let body = await get(args.at(-1));
const jump = /location\\.href='([^']+)'/.exec(body);
if (jump) body = await get(jump[1]);
process.stdout.write(body);
`);
  return file;
}

test('through the child, a page that navigates inward by script lands on the refusal, and the transport says so', async () => {
  const pages = await pagesProcess();
  const fake = fakeBrowser();
  const render = (b, a, o) => renderGuarded(process.execPath, [fake, ...a], o);
  try {
    // The URL asked for is 127.0.0.1 - internal - so the operator's decision is stated: public.
    const jumped = await renderThroughGuard({ binary: process.execPath, args: [fake, ...browserArgs(`${pages.outer}/jump`, { uid: 1000 })], url: `${pages.outer}/jump`, allowInternal: false, timeout: 20_000 });
    assert.equal(jumped.status, 0, jumped.stderr);
    assert.match(jumped.stdout, new RegExp(REFUSAL_MARKER), 'the navigation inward reached the page');
    assert.doesNotMatch(jumped.stdout, /SECRET-TOKEN/);
    assert.deepEqual(jumped.refused.map((r) => r.host), [`127.0.0.1:${pages.innerPort}`]);
    // The child reports the guard's whole record, as a timeline from the launch: what was
    // asked, when, how long it took, and how it ended (2026-10-01: a Windows run stalled 28 s
    // with nothing pending at the guard, so where the time went is the next question).
    assert.deepEqual(jumped.seen.map((e) => [e.kind, e.target, e.outcome]), [
      ['http', `${pages.outer}/jump`, '200'],
      ['http', `${pages.inner}/secret`, 'refused'],
    ], JSON.stringify(jumped.seen));
    for (const e of jumped.seen) { assert.ok(e.startedMs >= 0 && e.ms >= 0, JSON.stringify(e)); }
    assert.ok(jumped.elapsedMs > 0 && jumped.seen[0].startedMs <= jumped.elapsedMs);

    // The same, as the transport reports it: the render goes through the real child process.
    const refused = browser.scrape(`${pages.outer}/jump`, { render, browserPath: process.execPath, env: {}, allowInternalRedirects: false, timeout: 20_000 });
    assert.equal(refused.ok, false, JSON.stringify(refused));
    assert.match(refused.error, new RegExp(`127\\.0\\.0\\.1:${pages.innerPort} - 127\\.0\\.0\\.1 is an internal address`));
    assert.doesNotMatch(JSON.stringify(refused), /SECRET-TOKEN/);

    const plain = browser.scrape(`${pages.outer}/plain`, { render, browserPath: process.execPath, env: {}, allowInternalRedirects: false, timeout: 20_000 });
    assert.equal(plain.ok, true, plain.error);
    assert.equal(plain.title, 'Plain');
  } finally { pages.close(); }
});

test('LIVE: a real Chromium cannot be led into this machine\'s network by a script or a meta refresh', async () => {
  const chromium = findBrowser();
  requireCapability(chromium, 'NO-BROWSER', 'no Chromium or Chrome on this host');
  const pages = await pagesProcess();
  // Nothing inherited from the machine running the suite: a configured proxy would become the guard's upstream.
  const env = { PATH: process.env.PATH ?? '', SystemRoot: process.env.SystemRoot ?? '', HOME: process.env.HOME ?? '', USERPROFILE: process.env.USERPROFILE ?? '' };
  try {
    // A render that ran long is said on stderr, with the guard's whole timeline - what was
    // asked, when, how long, how it ended - and what the transport made of it: that line in a
    // CI log is the diagnosis of a stall nobody can reproduce elsewhere.
    // Chromium's own log, at INFO, rides the launch (2026-10-01: an Ubuntu CI run sat the whole
    // 45 s with the timeline EMPTY - no request ever reached the guard, and Chromium's deadline
    // never fired - so the wait is in startup, before any navigation, and only Chromium's log
    // says where). It is printed only for a render over 20 s, as the last lines before the end.
    let last;
    const render = (b, a, o) => { const args = [...a]; args.splice(-2, 0, '--enable-logging=stderr', '--v=1'); last = renderGuarded(b, args, o); return last; };
    const timeline = () => (last?.seen ?? []).map((e) => `${e.startedMs}ms ${e.kind} ${e.target} -> ${e.outcome ?? 'open'} (${e.ms}ms)`).join('; ');
    // Chromium prints its histograms at a normal exit; a killed one never gets there, so the
    // tail of a hang is its last live lines, and the histogram lines are dropped either way.
    const kept = () => String(last?.stderr ?? '').split('\n').filter((l) => l && !/^Histogram: |^\d+\s+[-.O ]+\(|^\d+\s+\.\.\. $/.test(l)).join('\n    ');
    const timed = (route, run) => { const t0 = Date.now(); const r = run(); const ms = Date.now() - t0; if (ms > 20_000) process.stderr.write(`browser-guard LIVE ${route} took ${ms} ms (browser ${last?.elapsedMs ?? '?'} ms, launched ${last?.startedAt ?? '?'}): ${r.error ?? r.omitted ?? 'no note'} | timeline: ${timeline()}\n  chromium log (head and tail):\n    ${kept()}\n`); return r; };
    for (const route of ['/jump', '/meta']) {
      const r = timed(route, () => browser.scrape(`${pages.outer}${route}`, { render, browserPath: chromium, env, allowInternalRedirects: false, timeout: 45_000 }));
      assert.equal(r.ok, false, `${route}: the browser reached the page it was sent to: ${JSON.stringify(r).slice(0, 300)}`);
      assert.match(r.error, new RegExp(`127\\.0\\.0\\.1:${pages.innerPort} - 127\\.0\\.0\\.1 is an internal address`), `${route}: ${r.error}`);
      assert.doesNotMatch(JSON.stringify(r), /SECRET-TOKEN/, `${route}: the internal page reached the result`);
    }
    const plain = timed('/plain', () => browser.scrape(`${pages.outer}/plain`, { render, browserPath: chromium, env, allowInternalRedirects: false, timeout: 45_000 }));
    assert.equal(plain.ok, true, `the control page failed: ${plain.error}`);
    assert.equal(plain.title, 'Plain');
    assert.match(plain.markdown, /rendered through the guard/);
  } finally { pages.close(); }
});

// ADR-0124: a full Chrome in headless mode runs its browser services whatever the flags.
// Rendering a plain local page, Chromium 141 asked the guard for the component updater's
// clock, the default search engine, accounts.google.com, the Cloud Messaging check-in and
// its push channel - nine connections no page asked for, carried as external. Flags and
// profile preferences were measured and left most of them (break-test, 2026-10-02).
test('the browser\'s own service hosts are known by name, and a page\'s hosts are not among them', () => {
  for (const host of ['clients2.google.com', 'clients.google.com', 'android.clients.google.com', 'mtalk.google.com', 'alt3-mtalk.google.com',
    'accounts.google.com', 'www.google.com', 'update.googleapis.com', 'safebrowsing.googleapis.com', 'redirector.gvt1.com', 'dl.google.com', 'WWW.GOOGLE.COM.']) {
    assert.equal(isBrowserService(host), true, `${host} is the browser's, not a page's`);
  }
  for (const host of ['docs.google.com', 'fonts.googleapis.com', 'maps.googleapis.com', 'developers.google.com', 'example.com', 'google.com', '127.0.0.1']) {
    assert.equal(isBrowserService(host), false, `${host} may be a page's`);
  }
});

test('the browser\'s own service traffic is dropped at the guard: not judged, not carried, not a refusal', async () => {
  // Every name resolves to loopback, so a request that IS judged can be told apart from a
  // dropped one without reaching anything: a judged connect is refused as internal, or - when
  // the host:port is the page asked for, hence exempt - attempted and refused by the port.
  const lookup = fakeLookup({ 'mtalk.google.com': '127.0.0.1', 'clients2.google.com': '127.0.0.1', 'www.google.com': '127.0.0.1' });
  const guard = await startGuard({ lookup, exempt: ['www.google.com:1'] });
  try {
    const push = await connectVia(guard.port, 'mtalk.google.com:5228');
    assert.match(push.line, /403/, `the push channel was carried: ${push.line}`);
    assert.match(push.rest, new RegExp(DROP_MARKER));
    push.socket.destroy();
    const clock = await viaProxy(guard.port, 'http://clients2.google.com/time/1/current?cup2key=not-a-real-key');
    assert.equal(clock.status, 403);
    assert.match(clock.body, new RegExp(`${DROP_MARKER}: clients2.google.com - the browser's own service traffic`));
    assert.deepEqual(guard.refused, [], 'the browser\'s own traffic was counted as a refusal of the page');
    assert.deepEqual(guard.seen.map((e) => e.outcome), ['dropped', 'dropped']);

    // The page the operator asked for is exempt by host and port, as it is from every other
    // judgment: a page on www.google.com is still rendered, not dropped.
    const page = await connectVia(guard.port, 'www.google.com:1');
    assert.doesNotMatch(page.rest, new RegExp(DROP_MARKER), 'the page asked for was dropped as service traffic');
    page.socket.destroy();
    assert.notEqual(guard.seen[2].outcome, 'dropped');
    // The same host on another port is the browser's again.
    const other = await connectVia(guard.port, 'www.google.com:443');
    assert.match(other.rest, new RegExp(DROP_MARKER));
    other.socket.destroy();
  } finally { await guard.close(); }
});

test('LIVE: rendering a plain page, the real Chromium reaches nothing but the page - its own services are dropped', async () => {
  const chromium = findBrowser();
  requireCapability(chromium, 'NO-BROWSER', 'no Chromium or Chrome on this host');
  const pages = await pagesProcess();
  const env = { PATH: process.env.PATH ?? '', SystemRoot: process.env.SystemRoot ?? '', HOME: process.env.HOME ?? '', USERPROFILE: process.env.USERPROFILE ?? '' };
  try {
    const url = `${pages.outer}/plain`;
    const r = renderGuarded(chromium, browserArgs(url, { timeout: 45_000 }), { url, env, timeout: 45_000 });
    assert.equal(r.status, 0, `the control page failed: ${r.error?.message ?? ''} ${String(r.stderr).slice(-300)}`);
    assert.match(r.stdout, /Plain/, 'the page was not rendered');
    const loopback = (target) => /^(https?:\/\/)?(127\.0\.0\.1|\[::1\]|localhost)(:|\/|$)/i.test(target);
    const beyond = (r.seen ?? []).filter((e) => !loopback(e.target));
    const carried = beyond.filter((e) => e.outcome !== 'dropped');
    assert.deepEqual(carried, [], `the browser reached beyond the page: ${JSON.stringify(carried)} - a request before the page's own is dropped by order (ADR-0125); one after it names a host BROWSER_SERVICE_HOSTS in lib/browser-guard.mjs does not, so extend the list`);
    assert.deepEqual(r.refused, [], `the browser's own traffic was counted as a refusal: ${JSON.stringify(r.refused)}`);
  } finally { pages.close(); }
});

// ADR-0125: until the page the operator asked for has been requested, nothing can be the
// page's. CI's Chrome stable opened a bare preconnect to www.gstatic.com 256 ms into a render
// of a loopback page, before the page - a host real pages use too, so no list could settle
// it (2026-10-02). The render passes `pageFirst`; a guard without it judges every request.
test('with pageFirst, a request before the page\'s own is dropped by order, and judged after it', async () => {
  const lookup = fakeLookup({ 'www.gstatic.com': '127.0.0.1', 'cdn.example': '127.0.0.1' });
  const guard = await startGuard({ lookup, exempt: ['127.0.0.1:1'], pageFirst: true });
  try {
    const early = await connectVia(guard.port, 'www.gstatic.com:443');
    assert.match(early.line, /403/);
    assert.match(early.rest, new RegExp(`${DROP_MARKER}: www.gstatic.com:443 - before the page asked for was requested`));
    early.socket.destroy();
    // The page's own request: exempt, and from here on the page is loading.
    const page = await connectVia(guard.port, '127.0.0.1:1');
    assert.doesNotMatch(page.rest, new RegExp(DROP_MARKER));
    page.socket.destroy();
    // A resource of the page's, after it: judged as always - here refused, because the fake
    // address is internal - never dropped.
    const later = await connectVia(guard.port, 'cdn.example:443');
    assert.match(later.rest, new RegExp(`${REFUSAL_MARKER}: cdn.example:443 - cdn.example resolves to 127.0.0.1, an internal address`));
    later.socket.destroy();
    assert.deepEqual(guard.seen.map((e) => e.outcome), ['dropped', 'error ECONNREFUSED', 'refused']);
    assert.equal(guard.refused.length, 1, 'the early request was counted as a refusal');
  } finally { await guard.close(); }
  // Without pageFirst - every unit test of the guard, and the judge's own contract - the
  // same early request is judged, not dropped.
  const plain = await startGuard({ lookup, exempt: ['127.0.0.1:1'] });
  try {
    const judged = await connectVia(plain.port, 'www.gstatic.com:443');
    assert.match(judged.rest, new RegExp(REFUSAL_MARKER));
    judged.socket.destroy();
  } finally { await plain.close(); }
});
