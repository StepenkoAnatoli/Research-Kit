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

export const name = 'http-keyless';
export const FULL_THRESHOLD = 1500;
const USER_AGENT = 'research-kit/1.0 (+keyless transport; https://example.invalid/research-kit)';

// ---------------------------------------------------------------- the rendezvous

const SELF = fileURLToPath(import.meta.url);

function runJob(job, { timeout = 60_000, spawn = spawnSync, nodePath = process.execPath } = {}) {
  const result = spawn(nodePath, [SELF], {
    input: JSON.stringify(job),
    encoding: 'utf8',
    timeout,
    windowsHide: true,
  });
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

export function decodeEntities(text) {
  const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', mdash: '—', ndash: '–', hellip: '…', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”' };
  return String(text)
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
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
export function mainContent(html) {
  const cleaned = String(html).replace(BLOCK_DROP, ' ');
  const blocks = [...cleaned.matchAll(/<(article|main|section|div)\b[^>]*>([\s\S]*?)<\/\1>/gi)].map((m) => m[2]);

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
      `${dropped.length} sibling section(s) totalling ~${words} words were outside the densest block and are not in this capture`,
    );
  }

  if (!reasons.length) return { completeness: 'full', omitted: '' };
  return { completeness: 'partial', omitted: reasons.join('; ') };
}

// ---------------------------------------------------------------- the adapter

export function command(argv) {
  return ['http-keyless', ...argv].map((p) => (/\s/.test(p) ? JSON.stringify(p) : p)).join(' ');
}

export function scrape(url, opts = {}) {
  const argv = ['scrape', String(url)];
  const job = runJob({ kind: 'fetch', url: String(url) }, opts);
  if (!job.ok) return { ok: false, url, error: job.error, cmd: command(argv), transport: name };
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
  const results = [];
  for (const m of String(job.body ?? '').matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*class=["']result-link["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    results.push({ url: unwrapRedirect(m[1]), title: inline(m[2]), description: '' });
  }
  if (!results.length) {
    for (const m of String(job.body ?? '').matchAll(/<a\b[^>]*href=["'](https?:\/\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
      const href = unwrapRedirect(m[1]);
      if (/duckduckgo\.com/.test(href)) continue;
      results.push({ url: href, title: inline(m[2]), description: '' });
    }
  }
  const seen = new Set();
  const unique = results.filter((r) => r.url && !seen.has(r.url) && seen.add(r.url));
  return { ok: true, query, cmd: command(argv), results: unique.slice(0, limit) };
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
  for (const m of String(job.body ?? '').matchAll(/href=["']([^"'#]+)["']/gi)) {
    try {
      const resolved = new URL(m[1], origin);
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
