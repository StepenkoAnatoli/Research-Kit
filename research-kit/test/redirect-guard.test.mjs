// A page on the web cannot redirect the collector into this machine's own network (ADR-0110).
//
// Found 2026-09-30 (break-test, PR #176): the keyless fetch followed every redirect, so a public
// page answering `302 -> http://127.0.0.1:<port>/...` was captured - an internal admin page, or a
// cloud metadata endpoint at 169.254.169.254, became an evidence row with its tokens in it, and
// `research --url` and collect.yml take arbitrary URLs. A redirect hop into an internal address
// is refused now, unless the URL the operator asked for was itself internal.

import { spawn } from 'node:child_process';
import { test, describe, assert, tempDir, fs, path } from './harness.mjs';
import * as httpKeyless from '../lib/http-transport.mjs';

describe('redirect-guard');

// The server runs in its own process: the transport blocks this one in spawnSync.
const SERVER = `
import http from 'node:http';
const server = http.createServer((req, res) => {
  if (req.url === '/hop') { res.writeHead(302, { location: '/secret' }); res.end(); return; }
  if (req.url === '/hop-absolute') { res.writeHead(301, { location: 'http://127.0.0.1:' + server.address().port + '/secret' }); res.end(); return; }
  const body = '<html><head><title>Internal</title></head><body><main><p>' + 'SECRET-TOKEN-4b1d '.repeat(40) + '</p></main></body></html>';
  res.writeHead(200, { 'content-type': 'text/html', 'content-length': Buffer.byteLength(body) });
  res.end(body);
});
server.listen(0, '127.0.0.1', () => process.stdout.write('PORT ' + server.address().port + '\\n'));
`;

async function withServer(fn) {
  const file = path.join(tempDir('rk-redirect-'), 'server.mjs');
  fs.writeFileSync(file, SERVER);
  const proc = spawn(process.execPath, [file], { stdio: ['ignore', 'pipe', 'inherit'] });
  try {
    const port = await new Promise((resolve, reject) => {
      let out = '';
      proc.stdout.on('data', (d) => { out += d; const m = out.match(/PORT (\d+)/); if (m) resolve(Number(m[1])); });
      proc.on('exit', (code) => reject(new Error(`the page server exited ${code}`)));
    });
    return await fn(`http://127.0.0.1:${port}`);
  } finally {
    proc.kill();
  }
}

// Nothing inherited from the machine running the suite: a proxy would not reach loopback.
const env = { PATH: process.env.PATH ?? '', SystemRoot: process.env.SystemRoot ?? '' };

test('a redirect into an internal address is refused, and nothing behind it is captured', async () => {
  await withServer((base) => {
    // `allowInternalRedirects: false` plays the part of a PUBLIC page: the policy a public URL
    // gets, applied to a server this test can run offline.
    for (const route of ['/hop', '/hop-absolute']) {
      const r = httpKeyless.scrape(`${base}${route}`, { env, allowInternalRedirects: false });
      assert.equal(r.ok, false, `${route}: a redirect into 127.0.0.1 was followed and captured`);
      assert.match(r.error, /refused to follow a redirect .*127\.0\.0\.1/, r.error);
      assert.doesNotMatch(JSON.stringify(r), /SECRET-TOKEN/, `${route}: the internal page reached the result`);
      assert.equal(r.url, `${base}${route}`, 'the refusal is recorded against the URL that was asked for');
    }
  });
});

test('an internal address the operator asked for is still fetched, redirects within it too', async () => {
  await withServer((base) => {
    const r = httpKeyless.scrape(`${base}/hop`, { env });
    assert.equal(r.ok, true, r.error);
    assert.equal(r.url, `${base}/secret`, 'the final URL is the one recorded');
    assert.match(r.markdown, /SECRET-TOKEN/);
  });
});

test('RESEARCH_KIT_ALLOW_INTERNAL_REDIRECTS=1 lifts the check, and only that value does', () => {
  const jobs = [];
  const record = (_, __, opts) => { jobs.push(JSON.parse(opts.input)); return { status: 0, stdout: '{"ok":false,"error":"stub"}', stderr: '' }; };
  httpKeyless.scrape('https://example.invalid/p', { spawn: record, env: { RESEARCH_KIT_ALLOW_INTERNAL_REDIRECTS: '1' } });
  httpKeyless.scrape('https://example.invalid/p', { spawn: record, env: { RESEARCH_KIT_ALLOW_INTERNAL_REDIRECTS: 'yes' } });
  httpKeyless.scrape('https://example.invalid/p', { spawn: record, env: {} });
  assert.deepEqual(jobs.map((j) => j.allowInternalRedirects), [true, undefined, undefined]);
});

test('what counts as internal: loopback, private, link-local, metadata, localhost names - not the public web', async () => {
  const internal = ['127.0.0.1', '127.8.9.10', '10.1.2.3', '172.16.0.1', '172.31.255.255', '192.168.1.1', '169.254.169.254',
    '100.64.0.1', '0.0.0.0', '[::1]', '[::]', '[fd00::1]', '[fe80::1]', '[::ffff:7f00:1]', 'localhost', 'LOCALHOST', 'app.localhost', 'localhost.'];
  const external = ['8.8.8.8', '93.184.216.34', '172.32.0.1', '192.169.0.1', '[2606:4700:4700::1111]'];
  for (const host of internal) assert.ok(await httpKeyless.internalTarget(host), `${host} was not recognised as internal`);
  for (const host of external) assert.equal(await httpKeyless.internalTarget(host), null, `${host} was taken for internal`);
});
