// The keyless extractor finds tag pairs in linear time, and finds exactly what the regexes found.
//
// Found 2026-09-30 (break-test, PR #176): the lazy pair regexes - `<div\b[^>]*>([\s\S]*?)</div>`
// and a dozen like it - were quadratic on unclosed tags. Each opening tag with no closing tag
// after it scanned to the end of the page and failed, and the next one scanned again: 9.4 s for
// 391 KB of `<div>word`, 13 s for 156 KB of `<script`, in the collecting process, after the
// fetch's own timeout had passed. The scanner that replaced them (tagPairs) must change the
// COST and nothing else, so the old regex extractor is kept as an oracle and both are run over
// thousands of generated pages that lean on the edges: unclosed and stray tags, upper case,
// a '>' inside a quoted attribute, several hrefs in one tag, comments, entities.

import { test, describe, assert } from './harness.mjs';
import * as linear from '../lib/http-transport.mjs';
import * as regex from './fixtures/regex-extract.mjs';

describe('http-linear');

/** A small seeded PRNG: the same pages on every run, on every host. */
function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

const TAGS = ['div', 'DIV', 'main', 'article', 'section', 'p', 'a', 'A', 'b', 'strong', 'em', 'i', 'code', 'li', 'tr', 'td', 'th',
  'h1', 'h2', 'H3', 'h6', 'title', 'script', 'style', 'svg', 'form', 'template', 'span', 'br', 'table', 'ul'];
const WORDS = ['limit', 'quota', 'requests', 'per', 'minute', 'the', 'free', 'plan', '1,000', '&amp;', '&#x41;', '&lt;', 'caveat', 'x>y', "it's", '"q"'];
const ATTRS = ['', ' class="x"', ' href="/docs"', " href='https://a.example/p'", ' href="https://b.example/q" class="result-link"',
  ' class="result-link" href="https://c.example"', ' href="x>y"', ' data-v="a>b" href="/z"', ' href="/1" href="/2"', ' HREF="https://d.example"', ' id=main'];

function page(next) {
  const pick = (list) => list[Math.floor(next() * list.length)];
  const parts = [];
  const n = 5 + Math.floor(next() * 60);
  for (let i = 0; i < n; i += 1) {
    const r = next();
    if (r < 0.30) parts.push(`<${pick(TAGS)}${pick(ATTRS)}>`);
    else if (r < 0.50) parts.push(`</${pick(TAGS)}>`);
    else if (r < 0.53) parts.push('<!--');
    else if (r < 0.56) parts.push('-->');
    else if (r < 0.58) parts.push(`<${pick(TAGS)}`);            // a tag that never reaches its '>'
    else parts.push(` ${Array.from({ length: 1 + Math.floor(next() * 12) }, () => pick(WORDS)).join(' ')} `);
  }
  return parts.join('');
}

test('the linear extractor gives the same capture as the regex one on 3,000 edge-heavy pages', () => {
  const next = rng(20260930);
  const differ = [];
  for (let i = 0; i < 3000 && differ.length < 3; i += 1) {
    const html = page(next);
    const got = linear.mainContent(html);
    const want = regex.mainContent(html);
    const same = JSON.stringify(got) === JSON.stringify(want)
      && linear.htmlToMarkdown(got.html) === regex.htmlToMarkdown(want.html)
      && linear.htmlToMarkdown(html) === regex.htmlToMarkdown(html)
      && linear.titleOf(html) === regex.titleOf(html)
      && JSON.stringify(linear.resultLinks(html).map(({ href, title }) => ({ href, title }))) === JSON.stringify(regex.searchLinks(html));
    if (!same) differ.push(html);
  }
  assert.deepEqual(differ, [], 'the linear extractor captured a page differently from the regexes it replaced');
});

/** The fastest of three timed runs of `work`, in ms: noise only ever adds time. */
function fastestMs(work, { over = Infinity } = {}) {
  const runs = [];
  for (let r = 0; r < 3; r += 1) {
    // A run already over the bound has answered: a quadratic regression would otherwise spend
    // minutes repeating it, where no watchdog reaches synchronous code.
    if (runs.length && runs[0] > over) break;
    const t = performance.now();
    work();
    runs.push(performance.now() - t);
  }
  return Math.min(...runs);
}

/** The whole extraction of one page. */
function extractAll(html) {
  const main = linear.mainContent(html);
  linear.htmlToMarkdown(main.html);
  linear.htmlToMarkdown(html);
  linear.titleOf(html);
  linear.resultLinks(html);
}

// EQUAL WORK, not one page against one bigger page. Eight small pages hold the text of one page
// eight times the size. Linear work takes about as long for both (measured 0.66-1.37x); quadratic
// work takes about eight times as long for the big one (the regex extractor, kept as the oracle:
// 5.4-8.1x on an idle machine, 4.1-8.7x under load). Both sides last ~100 ms, so a loaded machine
// slows them alike.
//
// The design before this timed one ~11 ms page against one page eight times the size. One full run
// read 8.2x of a 9x bound (2026-10-01) and the bound was widened to 24x - and it then read 31-40x on
// CORRECT code with six busy loops on two cores (3 of 12 runs red, break-test 2026-10-01). A short
// run slips through a scheduler slice and a long one is preempted all the way through, so
// contention inflates exactly the ratio under test, by about the oversubscription factor. With
// equal work the same six busy loops read at most 1.37x.
test('extraction time grows linearly with a page of unclosed tags, not quadratically', () => {
  const shapes = {
    'unclosed <div>': (n) => '<div>word '.repeat(n),
    'unclosed <script': (n) => '<script>x '.repeat(n),
    'unclosed <p><b>': (n) => '<p><b>word '.repeat(n),
    'unclosed <!--': (n) => '<!-- x '.repeat(n),
    'unclosed <li>': (n) => '<li>item '.repeat(n),
    'unclosed <a href>': (n) => '<a href="/x">link '.repeat(n),
    'tags with no >': (n) => '<li <a <div '.repeat(n),
  };
  const slow = [];
  for (const [name, make] of Object.entries(shapes)) {
    const small = `<title>t</title>${make(10_000)}`;
    const large = `<title>t</title>${make(80_000)}`;
    // Extraction is synchronous, so the watchdog cannot stop it: a quadratic regression would
    // spend minutes on the large page. A small page this slow has already answered.
    const one = fastestMs(() => extractAll(small));
    if (one > 1500) { slow.push(`${name}: ${one.toFixed(0)} ms for ~100 KB - superlinear, the large page was not tried`); continue; }
    const eight = Math.max(fastestMs(() => { for (let i = 0; i < 8; i += 1) extractAll(small); }), 1);
    const big = fastestMs(() => extractAll(large), { over: 3 * eight });
    const ratio = big / eight;
    if (ratio > 3) slow.push(`${name}: one page with the text of eight took ${ratio.toFixed(1)}x as long (${eight.toFixed(0)} ms -> ${big.toFixed(0)} ms)`);
  }
  assert.deepEqual(slow, [], `extraction is superlinear:\n  ${slow.join('\n  ')}`);
});
