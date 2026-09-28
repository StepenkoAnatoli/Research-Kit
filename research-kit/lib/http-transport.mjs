// http-transport.mjs - the KEYLESS adapter, and the second one.
//
// A seam with one implementation is a hypothesis. This is what makes the transport seam
// real: the same seven-function shape as the Firecrawl adapter, pinned by test.
//
// Pure Node ESM, no dependencies. Built-in `fetch` is asynchronous and the adapter shape
// is synchronous, so the module re-execs ITSELF with a JSON job on stdin and reads the
// answer back - a child-process rendezvous, not a second protocol.
//
// It never reads an API key, never charges a credit, stamps `transport: 'http-keyless'`,
// and grades its own completeness honestly: `full` only at >= 1500 characters of
// markdown, otherwise `partial` with the reason named.

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { fetchEnv } from './runtime.mjs';

export const name = 'http-keyless';
export const FULL_THRESHOLD = 1500;
const USER_AGENT = 'research-kit/1.0 (+keyless transport; https://example.invalid/research-kit)';

// ---------------------------------------------------------------- the rendezvous

const SELF = fileURLToPath(import.meta.url);

// The child's fetch uses a configured proxy only when told to: fetchEnv (runtime.mjs).
function runJob(job, { timeout = 60_000, spawn = spawnSync, nodePath = process.execPath, env = process.env } = {}) {
  const result = spawn(nodePath, [SELF], {
    input: JSON.stringify(job),
    encoding: 'utf8',
    timeout,
    windowsHide: true,
    env: fetchEnv(env),
  });
  // The page did not answer in time; say that, not "spawnSync ETIMEDOUT" (found 2026-09-27).
  if (result.error?.code === 'ETIMEDOUT') return { ok: false, error: `no answer within ${timeout / 1000}s - the request was abandoned; a retry may succeed` };
  if (result.error) return { ok: false, error: result.error.message };
  const text = String(result.stdout ?? '').trim();
  if (!text) return { ok: false, error: String(result.stderr || 'keyless transport produced no output').trim() };
  try {
    return JSON.parse(text);
  } catch (err) {
    return { ok: false, error: `keyless transport emitted unparseable output: ${err.message}` };
  }
}

// ---------------------------------------------------------------- html -> markdown

const BLOCK_DROP = /<(script|style|noscript|svg|iframe|form|template)\b[\s\S]*?<\/\1>/gi;

/**
 * One numeric character reference. HTML reads 0, a surrogate, and anything past U+10FFFF
 * as U+FFFD: String.fromCodePoint THROWS on the last, so one malformed entity crashed the
 * whole scrape (Arena break test 8, 2026-09-28).
 */
function codePoint(n) {
  return Number.isSafeInteger(n) && n > 0 && n <= 0x10FFFF && (n < 0xD800 || n > 0xDFFF)
    ? String.fromCodePoint(n) : '\uFFFD';
}

export function decodeEntities(text) {
  const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', mdash: '—', ndash: '–', hellip: '…', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”' };
  return String(text)
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => codePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => codePoint(Number(dec)))
    .replace(/&([a-z]+);/gi, (all, key) => named[key.toLowerCase()] ?? all);
}

/**
 * Word density picks the block a reader came for - but a page's critical sentence is
 * often in a SHORTER sibling (a quota exception, a footnote, a caveat box). Discarding
 * those and still calling the result `full` is how a capture loses the one fact a claim
 * rests on while reporting that nothing is missing.
 *
 * So this returns the chosen block AND what it left behind, and the caller grades
 * honestly on both.
 */
const BLOCKS = /<(article|main|section|div)\b[^>]*>([\s\S]*?)<\/\1>/gi;
const SEMANTIC_MIN_WORDS = 100;

/**
 * The block the page itself declares as its content: the largest <main> or <article> with
 * at least SEMANTIC_MIN_WORDS words, or null.
 *
 * Searched on its own, not among the div blocks. That search is lazy and non-overlapping,
 * so when <main> sits inside wrapper divs - as it does on GitHub Docs - the outer div's
 * match ends at the first </div> inside <main>, and <main> is never a candidate. On
 * 2026-09-27 that kept the 262-character summary of a Docs article and dropped the
 * 17,385-character <main> around it; Firecrawl captured the same page whole.
 */
function declaredContent(html) {
  const candidates = [...html.matchAll(/<(main|article)\b[^>]*>([\s\S]*?)<\/\1>/gi)]
    .map((m) => m[2])
    .filter((inner) => wordsOf(inner) >= SEMANTIC_MIN_WORDS);
  if (!candidates.length) return null;
  return candidates.reduce((best, inner) => (wordsOf(inner) > wordsOf(best) ? inner : best));
}

export function mainContent(html) {
  const cleaned = String(html).replace(BLOCK_DROP, ' ');

  // A page that marks its content, and puts real text in it, is believed. What is dropped
  // is then whatever has words OUTSIDE that block - navigation, sidebars, footers, and any
  // caveat box the page put elsewhere - counted the same way as below, so the grade stays
  // honest about what the capture left out.
  const declared = declaredContent(cleaned);
  if (declared) {
    const outside = cleaned.replace(declared, ' ');
    // Outside the declared content, a block that is mostly link text is navigation -
    // breadcrumbs, sidebars, "skip to content" - not content the capture lost. Counting it
    // graded every keyless docs capture `partial` (20 such blocks on the Docs page above).
    // A block of prose outside <main> is still reported: that is where a caveat box would be.
    const dropped = [...outside.matchAll(BLOCKS)]
      .map((m) => ({ words: wordsOf(m[2]), text: m[2] }))
      .filter((entry) => entry.words >= 5 && linkShare(entry.text) < 0.5);
    return { html: declared, dropped, chosenWords: wordsOf(declared), totalWords: wordsOf(cleaned), basis: 'declared' };
  }

  const blocks = [...cleaned.matchAll(BLOCKS)].map((m) => m[2]);

  // Selection considers only substantial blocks; the DROP analysis considers them all.
  // Filtering short blocks out of both is how a 60-character caveat box - exactly the
  // shape a quota exception takes - disappeared without ever being counted as missing.
  let best = cleaned;
  let bestScore = density(cleaned);
  for (const block of blocks) {
    if (block.length <= 200) continue;
    const value = density(block);
    if (value > bestScore) { best = block; bestScore = value; }
  }

  const dropped = blocks
    .filter((block) => !best.includes(block) && !block.includes(best))
    .map((block) => ({ words: wordsOf(block), text: block }))
    .filter((entry) => entry.words >= 5);

  return { html: best, dropped, chosenWords: wordsOf(best), totalWords: wordsOf(cleaned) };
}

/** The share of a block's words that sit inside links: near 1 for navigation, near 0 for prose. */
function linkShare(html) {
  const total = wordsOf(html);
  if (!total) return 0;
  const linked = [...String(html).matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi)].reduce((sum, m) => sum + wordsOf(m[1]), 0);
  return linked / total;
}

function wordsOf(html) {
  return decodeEntities(String(html).replace(/<[^>]+>/g, ' ')).split(/\s+/).filter(Boolean).length;
}

function density(html) {
  const tags = (html.match(/<[^>]+>/g) ?? []).length + 1;
  const words = decodeEntities(html.replace(/<[^>]+>/g, ' ')).split(/\s+/).filter(Boolean).length;
  return words / tags;
}

export function htmlToMarkdown(html) {
  let text = String(html);
  text = text.replace(BLOCK_DROP, ' ');
  text = text.replace(/<!--[\s\S]*?-->/g, ' ');
  text = text.replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level, body) => `\n\n${'#'.repeat(Number(level))} ${inline(body)}\n\n`);
  text = text.replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (_, body) => `\n- ${inline(body)}`);
  text = text.replace(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi, (_, row) => {
    const cells = [...row.matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((m) => inline(m[1]));
    return cells.length ? `\n| ${cells.join(' | ')} |` : '\n';
  });
  text = text.replace(/<br\s*\/?>/gi, '\n');
  text = text.replace(/<\/(p|div|section|article|tbody|table|ul|ol|blockquote)>/gi, '\n\n');
  text = inline(text);
  return text.replace(/\n{3,}/g, '\n\n').split('\n').map((l) => l.replace(/[ \t]+$/, '')).join('\n').trim();
}

function inline(html) {
  return decodeEntities(
    String(html)
      .replace(/<a\b[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, href, body) => {
        const label = decodeEntities(body.replace(/<[^>]+>/g, '')).trim();
        return label ? `[${label}](${href})` : '';
      })
      .replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, '**$2**')
      .replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, '*$2*')
      .replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, '`$1`')
      .replace(/<[^>]+>/g, ' '),
  ).replace(/[ \t]{2,}/g, ' ').trim();
}

export function titleOf(html) {
  const tag = String(html).match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  if (tag) return decodeEntities(tag[1]).replace(/\s+/g, ' ').trim();
  const h1 = String(html).match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  return h1 ? inline(h1[1]) : '';
}

/**
 * An honest self-assessment. `capture-completeness` then judges it.
 *
 * Length alone is not completeness: an extraction can be long and still have dropped
 * the section a claim needs. A capture is `full` only when it is substantial AND the
 * extractor discarded nothing a reader would have seen.
 */
export function gradeCompleteness(markdown, extraction = null) {
  const length = String(markdown).length;
  const reasons = [];

  if (length < FULL_THRESHOLD) {
    reasons.push(`only ${length} characters of main content were extracted (below the ${FULL_THRESHOLD}-character bar)`);
  }
  const dropped = extraction?.dropped ?? [];
  if (dropped.length) {
    const words = dropped.reduce((sum, entry) => sum + entry.words, 0);
    reasons.push(
      `${dropped.length} sibling section(s) totalling ~${words} words were outside ${extraction?.basis === 'declared' ? "the page's main content" : 'the densest block'} and are not in this capture`,
    );
  }

  if (!reasons.length) return { completeness: 'full', omitted: '' };
  return { completeness: 'partial', omitted: reasons.join('; ') };
}

// ---------------------------------------------------------------- the adapter

export function command(argv) {
  return ['http-keyless', ...argv].map((p) => (/\s/.test(p) ? JSON.stringify(p) : p)).join(' ');
}

/**
 * What a response's Content-Type says about how to keep it.
 *
 * `html` - a page: extract the main content, and grade by what extraction kept (the length
 * bar and the dropped siblings). A response with no Content-Type is treated as html, which
 * is what every response was before the type was read.
 * `text` - JSON, XML, CSV, plain text, Markdown: kept verbatim, and graded on whether the
 * body arrived at all. Nothing was extracted, so nothing can have been dropped. Found
 * 2026-09-26: a complete 748-character GitHub API response was graded `partial` by the
 * HTML length bar.
 * `binary` - PDF, images, archives: `response.text()` is not a faithful copy of these, so
 * the capture is never graded full, and the reason names the type.
 */
export function bodyKind(contentType) {
  const type = String(contentType ?? '').split(';')[0].trim().toLowerCase();
  if (!type || type === 'text/html' || type === 'application/xhtml+xml') return 'html';
  if (type.startsWith('text/')) return 'text';
  if (/^application\/([\w.+-]+\+)?(json|xml|yaml|x-yaml|x-ndjson|csv|javascript)$/.test(type)) return 'text';
  return 'binary';
}

function verbatim(url, job, argv, kind) {
  const body = job.body ?? '';
  const type = String(job.contentType ?? '').split(';')[0].trim();
  const reasons = [];
  if (!body.length) reasons.push('the response body was empty');
  if (kind === 'binary') reasons.push(`the response is ${type}, which is not text; this capture is not a faithful copy of it`);
  return {
    ok: true,
    url: job.url ?? url,
    title: '',
    markdown: body,
    statusCode: job.statusCode ?? '',
    transport: name,
    cmd: command(argv),
    completeness: reasons.length ? 'partial' : 'full',
    omitted: reasons.join('; '),
  };
}

export function scrape(url, opts = {}) {
  const argv = ['scrape', String(url)];
  const job = runJob({ kind: 'fetch', url: String(url) }, opts);
  if (!job.ok) return { ok: false, url, error: job.error, cmd: command(argv), transport: name };
  const kind = bodyKind(job.contentType);
  if (kind !== 'html') return verbatim(url, job, argv, kind);
  const html = job.body ?? '';
  const extraction = mainContent(html);
  const markdown = htmlToMarkdown(extraction.html);
  const grade = gradeCompleteness(markdown, extraction);
  return {
    ok: true,
    url: job.url ?? url,
    title: titleOf(html),
    markdown,
    statusCode: job.statusCode ?? '',
    transport: name,
    cmd: command(argv),
    ...grade,
  };
}

/** DuckDuckGo-lite: the keyless route to a result list, parsed from its HTML. */
export function search(query, { limit = 8, ...opts } = {}) {
  const argv = ['search', String(query)];
  const endpoint = `https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(query)}`;
  const job = runJob({ kind: 'fetch', url: endpoint }, opts);
  if (!job.ok) return { ok: false, query, error: job.error, cmd: command(argv), results: [] };
  // DuckDuckGo answers an automated-looking request with a bot check, not an error: HTTP 200,
  // an anomaly modal, no result links. Parsed as a page, that was "no results" and ok: true,
  // so a refused search looked like a quiet topic (found 2026-09-27). It is a failed search,
  // reported with its reason. The user agent stays honest: getting past the check is not
  // this adapter's business.
  if (/anomaly-modal|bots use DuckDuckGo too/i.test(String(job.body ?? '')) && !/class=["']result-link["']/i.test(String(job.body ?? ''))) {
    return {
      ok: false, query, cmd: command(argv), results: [],
      error: 'DuckDuckGo served its bot check instead of results - the keyless search was refused from this network; retry later, or use a keyed search provider',
    };
  }
  const results = [];
  for (const m of String(job.body ?? '').matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*class=["']result-link["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    results.push({ url: unwrapRedirect(hrefOf(m[1])), title: inline(m[2]), description: '' });
  }
  if (!results.length) {
    for (const m of String(job.body ?? '').matchAll(/<a\b[^>]*href=["'](https?:\/\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
      const href = unwrapRedirect(hrefOf(m[1]));
      if (/duckduckgo\.com/.test(href)) continue;
      results.push({ url: href, title: inline(m[2]), description: '' });
    }
  }
  const seen = new Set();
  const unique = results.filter((r) => r.url && !seen.has(r.url) && seen.add(r.url));
  return { ok: true, query, cmd: command(argv), results: unique.slice(0, limit) };
}

/**
 * An href attribute is HTML, so its value is decoded before it is a URL: `?a=1&amp;b=2`
 * means `b=2`. Taken raw, search and map returned URLs whose second parameter was
 * "amp;b" (Arena break test 8, 2026-09-28).
 */
function hrefOf(attribute) {
  return decodeEntities(attribute).trim();
}

function unwrapRedirect(href) {
  const match = String(href).match(/[?&]uddg=([^&]+)/);
  if (match) { try { return decodeURIComponent(match[1]); } catch { /* fall through */ } }
  return String(href);
}

/** Same-domain link mapping from one page. */
export function map(url, { limit = 50, ...opts } = {}) {
  const argv = ['map', String(url)];
  const job = runJob({ kind: 'fetch', url: String(url) }, opts);
  if (!job.ok) return { ok: false, url, error: job.error, cmd: command(argv), links: [] };
  let origin;
  try { origin = new URL(job.url ?? url); } catch { return { ok: false, url, error: 'unparseable url', cmd: command(argv), links: [] }; }
  const links = new Set();
  // The whole attribute, then decoded: the old pattern refused any href holding a '#', so
  // `&#38;` and every link to a section of another page were dropped. A link to a section
  // of THIS page names no new page; any other fragment is dropped from the page it names.
  for (const m of String(job.body ?? '').matchAll(/href=["']([^"']*)["']/gi)) {
    const href = hrefOf(m[1]);
    if (!href || href.startsWith('#')) continue;
    try {
      const resolved = new URL(href, origin);
      resolved.hash = '';
      if (resolved.host !== origin.host) continue;
      if (!/^https?:$/.test(resolved.protocol)) continue;
      links.add(resolved.toString());
    } catch { /* not a link we can use */ }
  }
  return { ok: true, url, cmd: command(argv), links: [...links].slice(0, limit) };
}

/** No key, no credits, nothing to ask about. */
export function status() {
  return { ok: true, transport: name, authenticated: false, credits: null, raw: 'keyless transport: no API key, no credits, no metering' };
}

export function runScrape(url, opts = {}) {
  return scrape(url, opts);
}

export default { name, scrape, search, map, command, status, runScrape };

// ---------------------------------------------------------------- the child half

/**
 * When this file is the process entry point it IS the job runner: read one JSON job on
 * stdin, do the async work, print one JSON line.
 */
async function child() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  let job;
  try {
    job = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
  } catch (err) {
    process.stdout.write(JSON.stringify({ ok: false, error: `unparseable job: ${err.message}` }));
    return;
  }
  if (job.kind !== 'fetch') {
    process.stdout.write(JSON.stringify({ ok: false, error: `unknown job kind "${job.kind}"` }));
    return;
  }
  try {
    const response = await fetch(job.url, {
      redirect: 'follow',
      headers: { 'user-agent': USER_AGENT, accept: 'text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.8' },
      signal: AbortSignal.timeout(job.timeout ?? 45_000),
    });
    const body = await response.text();
    process.stdout.write(JSON.stringify({
      ok: response.ok,
      url: response.url || job.url,
      statusCode: response.status,
      contentType: response.headers.get('content-type') ?? '',
      body,
      error: response.ok ? '' : `HTTP ${response.status}`,
    }));
  } catch (err) {
    process.stdout.write(JSON.stringify({ ok: false, url: job.url, error: err.message }));
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  await child();
}
