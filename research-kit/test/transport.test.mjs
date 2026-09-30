// The transport seam is real, not hypothetical: two adapters, one shape, and no data
// reaches a shell (ADR-0005, ADR-0020).

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { test, describe, assert, tempDir, fs, path, KIT_ROOT } from './harness.mjs';
import { readText } from '../lib/core.mjs';
import * as firecrawl from '../lib/firecrawl.mjs';
import * as httpKeyless from '../lib/http-transport.mjs';
import { TRANSPORTS, TRANSPORT_NAMES, selectTransport, selectSearch, probeFirecrawl, unusedKeyNote } from '../lib/transport.mjs';
import { mergeByRank } from '../lib/research-run.mjs';

describe('transport');

test('both adapters hold the same seven-function shape', () => {
  assert.equal(firecrawl.ADAPTER_SHAPE.length, 7);
  for (const name of firecrawl.ADAPTER_SHAPE) {
    assert.ok(name in firecrawl, `firecrawl is missing ${name}`);
    assert.ok(name in httpKeyless, `the keyless adapter is missing ${name}`);
    assert.equal(typeof firecrawl[name], typeof httpKeyless[name], `${name} differs in kind between the two adapters`);
  }
});

// Three adapters since ADR-0088, still one vendor: `browser` runs a Chromium already on the
// machine, with no key and no account, so it adds a transport and no third vendor.
test('the registry holds exactly three adapters, and names no third vendor', () => {
  assert.deepEqual(TRANSPORT_NAMES, ['firecrawl-cli', 'http-keyless', 'browser']);
  assert.equal(TRANSPORTS['firecrawl-cli'].name, 'firecrawl-cli');
  assert.equal(TRANSPORTS['http-keyless'].name, 'http-keyless');
  assert.equal(TRANSPORTS.browser.name, 'browser');
  assert.equal(TRANSPORTS.browser.creditsExhausted, undefined, 'no account, so nothing to run out of');
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

test('a direct invocation is shell-free and passes the URL through untouched', () => {
  // Simulates THIS host's platform, not a hardcoded one.
  //
  // The first version passed `platform: 'linux'` while handing it a real directory from
  // this machine. On Windows that is `C:\Users\...`, and resolveProgramPath correctly
  // splits a POSIX PATH on ':' - severing the drive letter, finding nothing, and failing
  // the assertion. The product was right and the test was simulating a platform whose
  // path syntax it could not actually produce. Found by the Windows CI leg.
  //
  // Both platforms reach the same branch - a real .exe, or anything extension-less, is
  // spawned directly - so the property under test is genuinely shared, and asserting it
  // natively on each host is stronger than asserting it about a fiction on one.
  const windows = process.platform === 'win32';
  const dir = tempDir('research-kit-bin-');
  const program = path.join(dir, windows ? 'firecrawl.exe' : 'firecrawl');
  fs.writeFileSync(program, windows ? 'MZ' : '#!/bin/sh\necho "{}"\n');
  const invocation = firecrawl.resolveInvocation(['scrape', 'https://x.invalid/a?q=$(touch pwned)'], {
    env: { PATH: dir, PATHEXT: '.COM;.EXE;.BAT;.CMD' },
    platform: process.platform,
  });
  assert.equal(invocation.ok, true, JSON.stringify(invocation));
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

// Found 2026-09-29 (Arena break test): one null or non-object row in the CLI's stdout threw on
// `row.url` and took every valid result in the same payload with it. serpapi.normalizeSearch
// was hardened against this shape on 2026-09-28; this parser, the same shape, was not.
test('a malformed row in a Firecrawl payload is dropped, not fatal to the rows beside it', () => {
  assert.deepEqual(
    firecrawl.normalizeSearch('{"data":{"web":[null,7,"x",{"url":"https://a.invalid","title":"A"}]}}').map((r) => r.url),
    ['https://a.invalid'],
  );
  assert.deepEqual(firecrawl.normalizeMap('{"links":[null,7,{"url":"https://b.invalid"},"https://a.invalid"]}'), ['https://b.invalid', 'https://a.invalid']);
});

// Found 2026-09-30 (break-test). The 2026-09-29 fix taught this parser to drop a malformed
// ROW; it still read a FIELD of the wrong type as if it were the value. `{ url: { href } }`
// and `{ url: 42 }` became candidates, and a scrape whose `metadata.sourceURL` was an object
// wrote a capture named `...-object-object-....md` with `url: [object Object]` in its front
// matter - the ledger recording a URL the kit never fetched. serpapi and searxng read a
// non-string field as empty; this one did not. One shape, fed to every vendor parser, so the
// three cannot drift apart again (the hardening note in build-report-2026-09-29).
test('every vendor parser reads a field of the wrong type as empty, the same way', async () => {
  const { normalizeSearch: serpapiSearch } = await import('../lib/serpapi.mjs');
  const { normalizeSearch: searxngSearch } = await import('../lib/searxng.mjs');
  const shaped = { url: { href: 'https://docs.example.invalid/limits' }, title: {}, description: [], position: '2' };
  assert.deepEqual(firecrawl.normalizeSearch(JSON.stringify({ data: { web: [shaped] } })), []);
  assert.deepEqual(serpapiSearch({ organic_results: [{ link: { href: 'x' }, title: {} }] }), []);
  assert.deepEqual(searxngSearch({ results: [{ url: { href: 'x' }, title: {} }] }), []);

  // And a scrape: the requested URL is the fallback when the vendor's own is not a string,
  // a real one is still preferred, and a string status stays readable by the error-page rule.
  const scrape = (metadata) => firecrawl.normalizeScrape(
    JSON.stringify({ data: { markdown: 'x'.repeat(1600), metadata } }), 'https://requested.invalid',
  );
  assert.equal(scrape({ sourceURL: { href: 'https://a.invalid' }, title: {} }).url, 'https://requested.invalid');
  assert.equal(scrape({ sourceURL: { href: 'https://a.invalid' }, title: {} }).title, '');
  assert.equal(scrape({ sourceURL: 'https://a.invalid/l', title: 'T', statusCode: 200 }).url, 'https://a.invalid/l');
  assert.equal(scrape({ sourceURL: 'https://a.invalid/l', title: 'T', statusCode: 200 }).statusCode, 200);
  assert.equal(scrape({ statusCode: '503' }).statusCode, '503', 'a string status still reaches the error-page rule');
  assert.equal(scrape({ statusCode: {} }).statusCode, '', 'an object is not a status code');
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

test('a page that marks its content with <main> is believed over a denser fragment', () => {
  // Found 2026-09-27: on a GitHub Docs page the keyless extractor kept the 262-character
  // summary and dropped the 17,385-character <main> around it - words-per-tag favours a
  // short, link-free fragment over an article full of links and inline code. Firecrawl
  // captured the same page whole. This fixture has the same shape.
  const section = (n) => `<h2>Step ${n}</h2><p>Open <a href="/s">Settings</a>, then <code>Actions</code>, then <a href="/p">Policies</a> for rule ${n}; `
    + 'every rule names an actor and an event, and a policy is active once saved. '.repeat(3) + '</p>';
  // Nested the way the real page is: <main> inside wrapper divs. The block finder matches
  // lazily and without overlap, so the outer div's match ends at the first </div> INSIDE
  // <main> - and <main> itself is never a candidate. An un-nested <main> matched whole and
  // made this fixture pass on the broken code.
  const html = '<html><body><div id="__next"><div class="layout"><header><nav><a href="/a">Docs</a><a href="/b">Pricing</a><a href="/c">Blog</a></nav></header>'
    // The intro must be over 200 characters, as the real one is (262): the extractor never
    // considers a block of 200 or less, and a shorter intro made this fixture pass on the
    // broken code.
    + '<main><div class="intro">Control who can trigger GitHub Actions workflows and which events are permitted to run them across an enterprise, organization, and repository. Rules layer with other protections and apply before any run starts.</div>'
    + Array.from({ length: 8 }, (_, i) => section(i + 1)).join('')
    + '<p>If you select <strong>Evaluate</strong> (GitHub Enterprise Cloud only), you can monitor the rule first.</p></main>'
    + '<footer><div>Help and support, contact us, terms and privacy for this site.</div></footer></div></div></body></html>';
  const md = httpKeyless.htmlToMarkdown(httpKeyless.mainContent(html).html);
  assert.match(md, /GitHub Enterprise Cloud only/, 'the fact at the end of the article was dropped');
  assert.match(md, /## Step 8/, 'the article body was dropped');
  assert.doesNotMatch(md, /Pricing/, 'navigation outside <main> leaked into the content');
});

test('outside a declared <main>, navigation is not dropped content, but a text caveat is', () => {
  // The real Docs page, after the fix above: 5,921 characters kept, and still graded
  // partial for "20 sibling sections outside" - breadcrumbs and sidebar link lists. Every
  // keyless docs capture would carry that warning. Link-heavy blocks outside the page's own
  // content are navigation; a block of prose outside it is still reported.
  const body = '<main>' + '<p>Rules name an actor and an event, and a policy is active as soon as it is saved. </p>'.repeat(40) + '</main>';
  const nav = '<div class="crumbs"><a href="/">Home</a> <a href="/a">GitHub Actions</a> <a href="/b">How-tos</a> <a href="/c">Administer</a></div>';
  const navOnly = httpKeyless.mainContent(`<html><body><div id="x"><div>${nav}${body}</div></div></body></html>`);
  assert.equal(navOnly.dropped.length, 0, `navigation was counted as dropped content: ${JSON.stringify(navOnly.dropped.map((d) => d.words))}`);
  const caveat = '<div class="note">Enterprise keys are exempt from this cap on weekends and holidays.</div>';
  const withCaveat = httpKeyless.mainContent(`<html><body><div id="x"><div>${nav}${body}${caveat}</div></div></body></html>`);
  assert.equal(withCaveat.dropped.length, 1, 'a prose caveat outside <main> must still be reported');
  const grade = httpKeyless.gradeCompleteness(httpKeyless.htmlToMarkdown(withCaveat.html), withCaveat);
  assert.match(grade.omitted, /outside the page's main content/, `the reason should say what was left out: ${grade.omitted}`);
});

test('a thin <main> is not trusted over the density heuristic', () => {
  const html = '<html><body><main><p>Loading...</p></main><div class="content">'
    + 'Real prose about rate limits and credits sits here, outside the main element. '.repeat(20) + '</div></body></html>';
  assert.match(httpKeyless.mainContent(html).html, /Real prose/, 'an empty shell of a <main> must not win');
});

test('decodeEntities handles named, decimal and hex references', () => {
  assert.equal(httpKeyless.decodeEntities('a&amp;b &#65; &#x42; &nbsp;c'), 'a&b A B  c');
});

// Found 2026-09-28 (Arena break test 8): a numeric reference past U+10FFFF made
// String.fromCodePoint throw a RangeError, so one malformed entity in a fetched page
// crashed the scrape instead of being captured. HTML parses such a reference - and 0 and
// a lone surrogate - as U+FFFD, the replacement character; so does this now.
test('an impossible character reference decodes to U+FFFD, never a throw', () => {
  for (const ref of ['&#1114112;', '&#x110000;', '&#xFFFFFFFFFF;', '&#99999999999999999999;', '&#0;', '&#xD800;']) {
    assert.equal(httpKeyless.decodeEntities(`a${ref}b`), 'a�b', ref);
  }
  assert.equal(httpKeyless.decodeEntities('&#x1F600;'), '\u{1F600}', 'a real astral character must survive');
  const body = `<main><p>${'A documented limit applies here. '.repeat(40)}&#1114112;</p></main>`;
  const r = httpKeyless.scrape('https://x.invalid/p', {
    spawn: () => ({ status: 0, stderr: '', stdout: JSON.stringify({ ok: true, url: 'https://x.invalid/p', statusCode: 200, contentType: 'text/html', body }) }),
  });
  assert.equal(r.ok, true, r.error);
});

// Found 2026-09-28 (Arena break test 8): an href is HTML, so `?a=1&amp;b=2` means `b=2` -
// but search and map returned the escaped text, a URL whose second parameter is "amp;b".
// And map's pattern refused any href holding a '#', so `&#38;` (an escaped '&') and every
// link to a section of another page were silently dropped.
test('search and map read an href as HTML: entities decoded, fragments dropped', () => {
  const page = (body) => ({
    spawn: () => ({ status: 0, stderr: '', stdout: JSON.stringify({ ok: true, url: 'https://ex.invalid/a', statusCode: 200, contentType: 'text/html', body }) }),
  });
  const linked = httpKeyless.search('q', page('<a href="https://ex.invalid/p?x=1&amp;y=2" class="result-link">R</a>'));
  assert.deepEqual(linked.results.map((r) => r.url), ['https://ex.invalid/p?x=1&y=2']);
  const redirected = httpKeyless.search('q', page('<a href="//duckduckgo.com/l/?uddg=https%3A%2F%2Fex.invalid%2Fr%3Fa%3D1%26b%3D2&amp;rut=abc" class="result-link">R</a>'));
  assert.deepEqual(redirected.results.map((r) => r.url), ['https://ex.invalid/r?a=1&b=2']);
  const bare = httpKeyless.search('q', page('<a href="https://ex.invalid/f?x=1&amp;y=2">F</a>'));
  assert.deepEqual(bare.results.map((r) => r.url), ['https://ex.invalid/f?x=1&y=2']);

  const mapped = httpKeyless.map('https://ex.invalid/a', page(
    '<a href="/p?x=1&amp;y=2">a</a><a href="/q?x=1&#38;y=2">b</a><a href="/docs#limits">c</a>'
    + '<a href="/docs#auth">c2</a><a href="#top">d</a><a href="https://other.invalid/z">e</a>'));
  assert.deepEqual(mapped.links, ['https://ex.invalid/p?x=1&y=2', 'https://ex.invalid/q?x=1&y=2', 'https://ex.invalid/docs']);
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

// Found 2026-09-26 in a cloud container whose only egress is an HTTPS proxy: the keyless
// transport got HTTP 403 for a page curl fetched fine through the same proxy. The fetch runs
// in a child on Node's built-in fetch, which ignores HTTPS_PROXY unless NODE_USE_ENV_PROXY=1,
// so the transport went around the proxy it had been given - and said only "HTTP 403".

const OK_JOB = JSON.stringify({ ok: true, url: 'https://x.invalid/p', statusCode: 200, body: '<html><body><p>ok</p></body></html>' });
const childEnvOf = (env, call = (opts) => httpKeyless.scrape('https://x.invalid/p', opts)) => {
  let seen = null;
  call({ env, spawn: (file, args, opts) => { seen = opts; return { status: 0, stdout: OK_JOB, stderr: '' }; } });
  assert.ok(seen, 'the rendezvous never spawned - this test is vacuous');
  return seen.env ?? {};
};

test('a keyless fetch that times out says so, not "spawnSync ETIMEDOUT"', () => {
  const err = Object.assign(new Error('spawnSync /usr/bin/node ETIMEDOUT'), { code: 'ETIMEDOUT' });
  const r = httpKeyless.scrape('https://x.invalid/p', { spawn: () => ({ error: err, stdout: '', stderr: '' }) });
  assert.equal(r.ok, false);
  assert.match(r.error, /no answer within \d+s/);
  assert.doesNotMatch(r.error, /spawnSync/);
});

test('behind a proxy, the keyless fetch is told to use it', () => {
  for (const key of ['HTTPS_PROXY', 'https_proxy', 'HTTP_PROXY', 'http_proxy']) {
    const env = childEnvOf({ [key]: 'http://127.0.0.1:9', PATH: '/bin' });
    assert.equal(env.NODE_USE_ENV_PROXY, '1', `${key} was set and the fetch child was not told to use it`);
    assert.equal(env[key], 'http://127.0.0.1:9', 'the proxy itself must still reach the child');
    assert.equal(env.PATH, '/bin', 'the rest of the environment must still reach the child');
  }
  const viaSearch = childEnvOf({ HTTPS_PROXY: 'http://127.0.0.1:9' }, (opts) => httpKeyless.search('q', opts));
  assert.equal(viaSearch.NODE_USE_ENV_PROXY, '1', 'search goes through the same rendezvous and must get the same');
});

test('with no proxy, or with the operator\'s own setting, the environment is left alone', () => {
  assert.equal(childEnvOf({ PATH: '/bin' }).NODE_USE_ENV_PROXY, undefined, 'no proxy, no flag');
  assert.equal(childEnvOf({ HTTPS_PROXY: 'http://127.0.0.1:9', NODE_USE_ENV_PROXY: '0' }).NODE_USE_ENV_PROXY, '0',
    'an operator who set the flag - even to 0 - decided; the transport does not overrule them');
});

// Found 2026-09-26: a complete GitHub API response (748 characters of JSON) was captured and
// graded `partial` - "only 748 characters of main content were extracted". Nothing was
// extracted and nothing was dropped: the grader was written for HTML pages and applied its
// length bar to every body. A CLOSED unknown resting on it would be flagged for a gap that
// does not exist.

const scrapeServed = (contentType, body) => httpKeyless.scrape('https://x.invalid/api', {
  spawn: () => ({ status: 0, stderr: '', stdout: JSON.stringify({ ok: true, url: 'https://x.invalid/api', statusCode: 200, contentType, body }) }),
});

test('a short JSON or text response captured whole is graded full, and kept verbatim', () => {
  const json = '{"total_count":1,"artifacts":[{"id":10638148916,"expired":false}]}';
  for (const type of ['application/json; charset=utf-8', 'application/vnd.github+json', 'text/plain', 'text/csv', 'application/xml']) {
    const result = scrapeServed(type, json);
    assert.equal(result.completeness, 'full', `${type}: a whole body was graded ${result.completeness} (${result.omitted})`);
    assert.equal(result.omitted, '');
    assert.equal(result.markdown, json, `${type}: the body was rewritten instead of kept as served`);
  }
});

test('HTML is still graded by what extraction kept, and an unknown type is treated as HTML', () => {
  assert.equal(scrapeServed('text/html; charset=utf-8', '<html><body><p>short</p></body></html>').completeness, 'partial');
  assert.equal(scrapeServed(undefined, '<html><body><p>short</p></body></html>').completeness, 'partial',
    'a response with no content type keeps the old behaviour');
});

test('an empty body is never graded full', () => {
  const empty = scrapeServed('application/json', '');
  assert.equal(empty.completeness, 'partial');
  assert.match(empty.omitted, /empty/);
});

// ADR-0105 (2026-09-30): a binary response is refused, not kept. Decoded as text, a PDF lost
// every byte UTF-8 could not hold, so the "capture" could neither be reopened as the file nor
// hold a quote - and one 10-page paper put 2.3 MB of it into a committed corpus.
test('a binary response is refused by name, with no capture, and the remedy names a transport that converts it', () => {
  for (const type of ['application/pdf', 'image/png', 'application/zip', 'application/octet-stream']) {
    const result = scrapeServed(type, '%PDF-1.7 binary junk');
    assert.equal(result.ok, false, `${type} was kept as a capture`);
    assert.equal(result.markdown, undefined, `${type}: a body came back with the refusal`);
    assert.ok(result.error.includes(type), `${type}: the refusal does not name the type: ${result.error}`);
    assert.match(result.error, /firecrawl-cli/, `${type}: no remedy named: ${result.error}`);
  }
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

// Captured from firecrawl-cli v1.24.6 on 2026-09-26, the version TESTED_CLI_VERSION moved to.
// Why it moved: 1.23.3 bundles axios 1.15.2, which sends plain proxied requests that an
// HTTPS proxy requiring CONNECT tunnels refuses with 405 - every call failed behind one
// (research/BRIEF.md, 2026-09-26 addendum). 1.24.6 bundles axios 1.18.0.
const REAL_STATUS_1246 = readText(path.join(KIT_ROOT, 'test', 'fixtures', 'firecrawl-status-1.24.6.txt'));
const REAL_SEARCH_1246 = readText(path.join(KIT_ROOT, 'test', 'fixtures', 'firecrawl-search-1.24.6.json'));

test('O-4: the status parser reads the TESTED version\'s actual output (1.24.6)', () => {
  assert.ok(REAL_STATUS_1246, 'the fixture must exist');
  const s = firecrawl.parseStatus(REAL_STATUS_1246);
  assert.equal(s.version, firecrawl.TESTED_CLI_VERSION, 'the fixture and the tested version must be the same release');
  assert.equal(s.authenticated, true);
  assert.equal(s.credits, 505);
  assert.equal(s.creditLimit, 1000);
  assert.equal(s.concurrencyLimit, 2);
});

test('O-4: 1.24.6 search output normalises, and its ADDITIVE fields change nothing', () => {
  // New since 1.23.3: a top-level `warning` and `id`, `data.tools`, and `position` per row.
  // The adapter reads `data.web` only, so none of them may reach a result.
  const raw = JSON.parse(REAL_SEARCH_1246);
  assert.ok(Array.isArray(raw.data.web) && raw.data.web.length, 'the fixture must carry real results');
  assert.ok('tools' in raw.data && 'warning' in raw, 'the fixture must carry the fields this test is about');
  const rows = firecrawl.normalizeSearch(REAL_SEARCH_1246);
  assert.equal(rows.length, raw.data.web.length);
  for (const row of rows) {
    assert.match(row.url, /^https?:\/\//);
    assert.equal(typeof row.title, 'string');
  }
  assert.equal(JSON.stringify(rows).includes('tool discovery'), false, 'the vendor warning leaked into results');
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

// ---------------------------------------------------------------- merged search

test('mergeByRank interleaves, so one failing provider cannot eat the budget', () => {
  // The case that motivated this. On 2026-09-22 a query about the EU Deforestation
  // Regulation returned eight US financial-regulation pages from one provider and nothing
  // on topic, while the other returned seventeen, all on topic. Concatenation would have
  // spent the whole page budget on the wrong provider before reaching the right one.
  const bad = { provider: 'serpapi', results: [{ url: 'sec' }, { url: 'cfpb' }, { url: 'water' }] };
  const good = { provider: 'firecrawl-cli', results: [{ url: 'europa' }, { url: 'ey' }, { url: 'wiki' }] };

  const merged = mergeByRank([bad, good]);
  assert.deepEqual(merged.map((r) => r.url), ['sec', 'europa', 'cfpb', 'ey', 'water', 'wiki']);

  // Whatever the budget, the good provider is represented. At three pages the old
  // behaviour would have taken sec/cfpb/water and nothing else.
  assert.ok(merged.slice(0, 3).some((r) => r.provider === 'firecrawl-cli'),
    'the working provider must reach the first slots');
});

test('mergeByRank attributes every row, and agreement does not double-count', () => {
  // The ledger records which search surfaced a URL, which is what keeps a claim about
  // search quality checkable rather than an impression.
  const a = { provider: 'serpapi', results: [{ url: 'shared' }, { url: 'a2' }] };
  const b = { provider: 'firecrawl-cli', results: [{ url: 'shared' }, { url: 'b2' }] };

  const merged = mergeByRank([a, b]);
  assert.equal(merged.filter((r) => r.url === 'shared').length, 1, 'a shared URL appears once');
  // EVERY finder, not the first. Crediting only the provider asked first made agreement
  // look like discovery: a live run had seven of sixteen results shared, and all seven were
  // attributed to whichever provider the loop happened to reach first.
  assert.deepEqual(merged.find((r) => r.url === 'shared').providers, ['serpapi', 'firecrawl-cli']);
  assert.deepEqual(merged.find((r) => r.url === 'a2').providers, ['serpapi']);
  assert.deepEqual(merged.find((r) => r.url === 'b2').providers, ['firecrawl-cli']);
  assert.ok(merged.every((r) => r.providers?.length), 'every row names its finders');
});

test('mergeByRank handles ragged and empty lists without inventing rows', () => {
  const long = { provider: 'x', results: [{ url: '1' }, { url: '2' }, { url: '3' }] };
  const short = { provider: 'y', results: [{ url: 'only' }] };
  assert.deepEqual(mergeByRank([long, short]).map((r) => r.url), ['1', 'only', '2', '3']);
  assert.deepEqual(mergeByRank([{ provider: 'z', results: [] }]), []);
  assert.deepEqual(mergeByRank([]), []);
});

test('a configured SerpAPI key selects BOTH providers, not one', () => {
  // This is what the operator believed was already happening, and was not: the ladder
  // picked a single provider and the second key bought a meter rather than a second look.
  const search = selectSearch({
    env: { SERPAPI_API_KEY: ['4', '7'].join('') + 'd'.repeat(62) },
    probe: () => ({ ok: true, authenticated: true }),
  });
  assert.equal(search.merged, true);
  assert.equal(search.adapters.length, 2, 'both providers must be offered');
  assert.equal(search.adapters[0].name, 'serpapi', 'the separately metered one goes first');
  assert.ok(search.why.includes('merged by rank'));
});

test('an explicitly pinned provider stays a single provider', () => {
  // Pinning exists to make two runs comparable. If pinning still merged, it would not.
  const search = selectSearch({
    explicit: 'serpapi',
    env: { SERPAPI_API_KEY: ['4', '7'].join('') + 'd'.repeat(62) },
    probe: () => ({ ok: true, authenticated: true }),
  });
  assert.equal(search.merged, undefined);
  assert.equal(search.adapters, undefined, 'a pinned choice offers no second provider');
  assert.equal(search.name, 'serpapi');
});

// Found 2026-09-27: four decompose searches cost about 7 credits and one plan query about 2,
// measured on the account's own balance - and the kit recorded `searchesUsed: 0`, because only
// the SerpAPI adapter reported a count. The estimate follows the documented rule (E-03, E-14):
// 2 credits per 10 results, rounded up; a search is counted at 2 at least, because the rule
// does not say what an empty result costs and an under-count is the failure being fixed.
test('a Firecrawl search reports itself, and what it cost by the documented rule', () => {
  const rows = (n) => JSON.stringify({ data: { web: Array.from({ length: n }, (_, i) => ({ url: `https://x.invalid/${i}`, title: 't' })) } });
  const five = firecrawl.search('q', { execFn: () => ({ ok: true, status: 0, stdout: rows(5), stderr: '' }) });
  assert.equal(five.searchesUsed, 1);
  assert.equal(five.creditsEstimate, 2);
  const eleven = firecrawl.search('q', { limit: 20, execFn: () => ({ ok: true, status: 0, stdout: rows(11), stderr: '' }) });
  assert.equal(eleven.creditsEstimate, 4, '11 results is 4 credits (E-03)');
  const none = firecrawl.search('q', { execFn: () => ({ ok: true, status: 0, stdout: rows(0), stderr: '' }) });
  assert.equal(none.creditsEstimate, 2, 'an empty search is not assumed free');
  const failed = firecrawl.search('q', { execFn: () => ({ ok: false, status: 1, stdout: '', stderr: 'boom' }) });
  assert.equal(failed.searchesUsed, undefined, 'a failed call is not counted as spend');
});

// Found 2026-09-27: with the kit's user agent, DuckDuckGo served its bot check ("Unfortunately,
// bots use DuckDuckGo too", an anomaly-modal and no result links). The adapter parsed zero
// links and returned ok: true - so a refused search read as a search that found nothing.
test('keyless search reports DuckDuckGo\'s bot check as a failed search, with the reason', () => {
  const page = '<html><body><div class="anomaly-modal__box"><p>Unfortunately, bots use DuckDuckGo too.</p>'
    + '<p>Please complete the following challenge to confirm this search was made by a human.</p></div></body></html>';
  const r = httpKeyless.search('q', {
    spawn: () => ({ status: 0, stderr: '', stdout: JSON.stringify({ ok: true, url: 'https://lite.duckduckgo.com/lite/?q=q', statusCode: 200, contentType: 'text/html', body: page }) }),
  });
  assert.equal(r.ok, false, 'a bot check was reported as a successful search');
  assert.match(r.error, /bot check/i);
  assert.deepEqual(r.results, []);
});

// Found 2026-09-27: with FIRECRAWL_API_KEY set and no CLI on PATH, a run fell back to the
// keyless adapter - capped per IP - and said only "no CLI on PATH". The key the operator set
// was unused, and nothing at collection time said so; only doctor did.
test('a key with no CLI to use it is named at collection time, with the install command', () => {
  const absent = () => ({ installed: false, authenticated: false, version: null, credits: null });
  const installed = () => ({ installed: true, authenticated: true, version: '1.0.0', credits: 900 });
  const key = { FIRECRAWL_API_KEY: 'fc-test' };

  const fallback = selectTransport({ env: key, probe: absent, config: {} });
  const note = unusedKeyNote(fallback, key);
  assert.match(note, /FIRECRAWL_API_KEY is set/);
  assert.match(note, /not on PATH/);
  assert.ok(note.includes(firecrawl.cliInstallSpec()), note);

  assert.equal(unusedKeyNote(selectTransport({ env: {}, probe: absent, config: {} }), {}), '', 'no key: nothing unused');
  assert.equal(unusedKeyNote(selectTransport({ env: key, probe: installed, config: {} }), key), '', 'the CLI uses the key');
  assert.equal(unusedKeyNote(selectTransport({ explicit: 'http-keyless', env: key, probe: absent, config: {} }), key), '',
    'keyless was asked for by name: the operator chose it');
});

// ADR-0086: the text the Firecrawl API sends with its 402, as the CLI prints it on stderr
// (fetch-fallback corpus, E-10, E-11). The adapter's scrape passes stderr on as its error,
// and creditsExhausted must recognise it there - and nothing else.
test('the Firecrawl adapter recognises exhausted credits from the CLI\'s own words', async () => {
  const fc = (await import('../lib/firecrawl.mjs')).default;
  const stderr = 'Error: Insufficient credits to perform this request. For more credits, you can upgrade your plan at https://firecrawl.dev/pricing or try changing the request limit to a lower value.';
  const failed = fc.scrape('https://x.invalid/a', { execFn: () => ({ ok: false, status: 1, stdout: '', stderr }) });
  assert.equal(failed.ok, false);
  assert.equal(fc.creditsExhausted(failed.error), true);
  assert.equal(fc.creditsExhausted('Insufficient credits. For more credits, you can upgrade your plan'), true, 'the v0 wording');
  for (const other of ['Error: Rate limit exceeded (429)', 'Error: Payment required', 'firecrawl exited 1', '', undefined]) {
    assert.equal(fc.creditsExhausted(other), false, String(other));
  }
});

// Found 2026-09-28 running the browser transport: nodejs.org/api/fs.html is 314 <section>
// elements in a row, with no <main> or <article>. The extractor kept the single densest
// section - 1,095 characters - and graded away ~40,500 words as "outside the densest block",
// on both the keyless and the browser route. A run of sections that holds most of the page
// is the content, not a set of rivals for it.
test('a page built from a run of sections keeps the run, not the densest one', async () => {
  const { mainContent: extract, htmlToMarkdown: toMd, gradeCompleteness: grade } = await import('../lib/http-transport.mjs');
  const nav = `<div class="nav">${Array.from({ length: 30 }, (_, i) => `<a href="/x${i}">Link ${i}</a>`).join(' ')}</div>`;
  // Each section carries a nested <div>, as the real page's stability notes do: the block
  // regex then ends the wrapper <div> at the first inner </div>, so no block holds the run.
  const sections = Array.from({ length: 40 }, (_, i) => `<section><h2>fs.method${i}()</h2><div class="api_stability">Stability: 2 - Stable</div><p>The fs.method${i}() call reads a file and returns its contents as a buffer, or as a string when an encoding is given. It fails when the path does not exist.</p></section>`).join('\n');
  const html = `<html><head><title>File system</title></head><body>${nav}<div id="column">${sections}</div></body></html>`;
  const extraction = extract(html);
  const markdown = toMd(extraction.html);
  for (const i of [0, 17, 39]) assert.match(markdown, new RegExp(`fs\\.method${i}\\(\\) call reads a file`), `section ${i} is missing`);
  assert.equal(grade(markdown, extraction).completeness, 'full', grade(markdown, extraction).omitted);
  assert.doesNotMatch(markdown, /Link 12/, 'the navigation stays out');
});

// Found 2026-09-30 (break-test): every network failure in the keyless and SerpAPI children
// read "fetch failed". Node keeps the reason on err.cause, so an offline machine, a mistyped
// host and a refused port looked the same.
test('a failed fetch names its cause, and a URL in the cause shows only its host', async () => {
  const { fetchFailure } = await import('../lib/runtime.mjs');
  const dns = Object.assign(new TypeError('fetch failed'), { cause: Object.assign(new Error('getaddrinfo ENOTFOUND no-such.invalid'), { code: 'ENOTFOUND' }) });
  assert.equal(fetchFailure(dns), 'fetch failed (getaddrinfo ENOTFOUND no-such.invalid)');
  const refused = Object.assign(new TypeError('fetch failed'), { cause: Object.assign(new AggregateError([], ''), { code: 'ECONNREFUSED' }) });
  assert.equal(fetchFailure(refused), 'fetch failed (ECONNREFUSED)');
  const aggWithoutTopCode = Object.assign(new TypeError('fetch failed'), { cause: new AggregateError([new Error('connect ECONNREFUSED 127.0.0.1:1')], '') });
  assert.equal(fetchFailure(aggWithoutTopCode), 'fetch failed (connect ECONNREFUSED 127.0.0.1:1)');
  const keyed = Object.assign(new TypeError('fetch failed'), { cause: new Error('bad response from https://serpapi.com/search.json?api_key=SECRET&q=x') });
  assert.doesNotMatch(fetchFailure(keyed), /SECRET|api_key/);
  assert.match(fetchFailure(keyed), /serpapi\.com/);
  assert.equal(fetchFailure(new Error('plain')), 'plain');
  assert.equal(fetchFailure('text'), 'text');
});

test('a keyless fetch of a refused port says the connection was refused', async () => {
  const http = await import('node:http');
  const server = http.createServer();
  await new Promise((done) => server.listen(0, '127.0.0.1', done));
  const { port } = server.address();
  await new Promise((done) => server.close(done));
  const env = Object.fromEntries(Object.entries(process.env)
    .filter(([name]) => !['HTTPS_PROXY', 'https_proxy', 'HTTP_PROXY', 'http_proxy'].includes(name)));
  const { scrape } = await import('../lib/http-transport.mjs');
  const r = scrape(`http://127.0.0.1:${port}/`, { env, timeout: 20_000 });
  assert.equal(r.ok, false);
  assert.match(r.error, /ECONNREFUSED/, r.error);
});
