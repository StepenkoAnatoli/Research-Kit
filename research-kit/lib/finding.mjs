// finding.mjs - the auto-extracted Finding cell (ADR-0016, superseding ADR-0009).
//
//   firstFinding(markdown, fallback) -> one line of prose
//
// Two arguments over the heuristics behind them. Pure by construction: no filesystem,
// no corpus, no adapter - the one module a caller can exercise with a string.
//
// What it produces is a DRAFT. The agent must rewrite it into a real claim before the
// gate; this only has to beat a blank cell.

const MAX_CHARS = 220;

// Boilerplate families. A line matching any of these is never a finding.
const BOILERPLATE = [
  /^\s*(home|docs?|documentation|search|menu|navigation|skip to|on this page|table of contents)\s*$/i,
  /^\s*(sign in|sign up|log ?in|log ?out|get started|contact (us|sales)|book a demo|talk to sales)\b/i,
  /^\s*(cookie|we use cookies|accept all|privacy preferences|manage preferences)\b/i,
  /^\s*(copyright|\(c\)|©|all rights reserved)\b/i,
  /^\s*(previous|next|back to top|edit this page|was this (page )?helpful)\b/i,
  /^\s*(follow us|share on|subscribe|newsletter|join our)\b/i,
];

const TRACKING = [
  /utm_[a-z]+=/i,
  /\b(gclid|fbclid|mc_cid|ref=)\b/i,
  /\bgoogle-?analytics\b|\bgtag\(|\bdataLayer\b/i,
];

const CAMPAIGN = [
  /\b(free trial|no credit card|limited time|save \d+%|try it (free|now))\b/i,
  /\b(trusted by|loved by|join \d[\d,]* (developers|teams|companies))\b/i,
];

const NAV_LIKE = /^[\w\s/|·—–-]{0,40}$/;

/** A tier-hero block: a pricing card's stacked fragments, not a sentence about price. */
const TIER_HERO = /^\s*\$?\d[\d,.]*\s*(\/\s*(mo|month|yr|year|user))?\s*$/i;

function stripMarkdown(line) {
  return String(line)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')          // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')        // links keep their text
    .replace(/`{1,3}([^`]*)`{1,3}/g, '$1')          // code spans
    .replace(/[*_~]{1,3}/g, '')                      // emphasis
    .replace(/^\s{0,3}#{1,6}\s*/, '')                // heading marks
    .replace(/^\s{0,3}[-*+]\s+/, '')                 // bullets
    .replace(/^\s{0,3}>\s?/, '')                     // quotes
    .replace(/\s+/g, ' ')
    .trim();
}

function isNoise(line) {
  if (!line) return true;
  if (BOILERPLATE.some((re) => re.test(line))) return true;
  if (TRACKING.some((re) => re.test(line))) return true;
  if (CAMPAIGN.some((re) => re.test(line))) return true;
  if (TIER_HERO.test(line)) return true;
  if (line.length < 25 && NAV_LIKE.test(line)) return true;
  return false;
}

/** Split a paragraph into sentences without breaking on `e.g.`, `v2.1`, or `1,000.` */
export function sentences(text) {
  const out = [];
  let current = '';
  const source = String(text);
  for (let i = 0; i < source.length; i += 1) {
    const ch = source[i];
    current += ch;
    if (ch !== '.' && ch !== '!' && ch !== '?') continue;
    const before = source.slice(Math.max(0, i - 4), i + 1);
    const after = source.slice(i + 1, i + 3);
    if (/\b(e\.g|i\.e|etc|vs|no|fig|approx|inc|ltd)\.$/i.test(before)) continue;
    if (/\d\.$/.test(before) && /^\s*\d/.test(after)) continue; // 1.5, v2.1
    if (!/^\s|^$/.test(after)) continue;                         // mid-token dot
    out.push(current.trim());
    current = '';
  }
  if (current.trim()) out.push(current.trim());
  return out.filter(Boolean);
}

/** A markdown table's first data row, rendered as prose. Pricing pages are tables. */
function fromTable(lines, index) {
  const header = lines[index];
  if (!header.trim().startsWith('|')) return null;
  const sep = lines[index + 1] ?? '';
  if (!/^\|?[\s:|-]+\|/.test(sep) || !sep.includes('-')) return null;
  const cells = (row) => row.trim().replace(/^\||\|$/g, '').split('|').map((c) => stripMarkdown(c));
  const head = cells(header);
  for (let i = index + 2; i < lines.length; i += 1) {
    const row = lines[i];
    if (!row.trim().startsWith('|')) break;
    const values = cells(row);
    if (values.every((v) => !v)) continue;
    const pairs = head
      .map((name, at) => (name && values[at] ? `${name}: ${values[at]}` : ''))
      .filter(Boolean);
    if (pairs.length >= 2) return pairs.join(', ');
  }
  return null;
}

/**
 * Score a candidate. Concrete beats vague: a sentence carrying a number, a limit, a
 * price, or a version says something a design can rest on.
 */
export function score(text) {
  let value = 0;
  const length = text.length;
  if (length >= 60 && length <= MAX_CHARS) value += 3;
  else if (length >= 35) value += 1;
  if (/\d/.test(text)) value += 2;
  if (/\b\d[\d,]*\s*(credits?|requests?|pages?|calls?|tokens?|rpm|per (minute|second|hour|day|month))\b/i.test(text)) value += 4;
  if (/[$€£]\s?\d/.test(text)) value += 3;
  if (/\b(limit|quota|rate|maximum|max|minimum|per team|per key|concurrent)\b/i.test(text)) value += 3;
  if (/\b(must|requires?|supports?|returns?|allows?|prohibit(s|ed)?|permitted|includes?)\b/i.test(text)) value += 2;
  if (/\bv?\d+\.\d+(\.\d+)?\b/.test(text)) value += 2;
  if (/\?$/.test(text)) value -= 3;
  if (/\b(we|our|you'll love|amazing|powerful|simply)\b/i.test(text)) value -= 2;
  if (length > MAX_CHARS) value -= 1;
  return value;
}

/**
 * Page markdown in, one line of prose out.
 * `fallback` is returned verbatim when nothing in the page beats noise.
 */
/**
 * Headings under which a page states its actual terms.
 *
 * A sentence about a rate limit sitting under "Rate limits" is far more likely to BE the
 * rate limit than the same sentence in a feature tour. This is the cheapest signal a
 * page gives about which of its claims are load-bearing, and it costs one regex.
 */
const EVIDENCE_HEADING = /\b(pricing|plans?|limits?|rate limits?|quotas?|usage|api|endpoints?|terms|policy|policies|privacy|retention|billing|credits?|authentication|errors?)\b/i;

/** Headings that mark the parts of a page nobody is citing. */
const CHROME_HEADING = /\b(blog|news|announcements?|careers|about us|community|testimonials?|customers?|get started free|sign ?up|newsletter)\b/i;

/**
 * The extractor, with its reasoning kept.
 *
 * `firstFinding` returns only the sentence, which is what the collector writes into the
 * evidence table. But a one-line finding is exactly the thing a person has to go and
 * verify by hand, so this also returns WHERE it came from: the heading it sat under, the
 * surrounding paragraph, and which signals fired. Same selection, more of the working
 * shown — `firstFinding` is now a thin wrapper over it, so the two cannot disagree.
 */
export function findingWithContext(markdown, fallback = '') {
  const source = String(markdown ?? '');
  const none = { finding: fallback, excerpt: '', heading: '', signals: [], score: 0 };
  if (!source.trim()) return none;

  const lines = source.split(/\r?\n/);
  const candidates = [];
  let inFence = false;
  let heading = '';
  let block = [];

  const flushBlock = () => { const text = block.join(' ').trim(); block = []; return text; };

  for (let i = 0; i < lines.length; i += 1) {
    const raw = lines[i];
    if (/^\s*```/.test(raw)) { inFence = !inFence; continue; }
    if (inFence) continue;

    const head = raw.match(/^\s{0,3}#{1,6}\s+(.*)$/);
    if (head) { heading = stripMarkdown(head[1]); flushBlock(); continue; }
    if (!raw.trim()) { flushBlock(); continue; }

    if (raw.trim().startsWith('|')) {
      const row = fromTable(lines, i);
      // A table row is its own context: the row IS the excerpt.
      if (row && !isNoise(row)) candidates.push({ text: row, bonus: 2, heading, excerpt: row });
      continue;
    }

    const line = stripMarkdown(raw);
    if (line) block.push(line);
    if (isNoise(line)) continue;
    for (const sentence of sentences(line)) {
      const text = sentence.trim();
      if (text.length < 25) continue;
      if (isNoise(text)) continue;
      // The excerpt is resolved after the paragraph closes, so a sentence carries the
      // whole paragraph it came from rather than just itself.
      candidates.push({ text, bonus: 0, heading, at: candidates.length, lineIndex: i });
    }
  }
  flushBlock();

  if (!candidates.length) return none;

  let best = null;
  for (const candidate of candidates) {
    const signals = [];
    let value = score(candidate.text) + candidate.bonus;
    if (candidate.bonus) signals.push('table-row');

    if (candidate.heading && EVIDENCE_HEADING.test(candidate.heading)) { value += 3; signals.push('evidence-heading'); }
    if (candidate.heading && CHROME_HEADING.test(candidate.heading)) { value -= 3; signals.push('chrome-heading'); }
    if (/\b\d+(\.\d+)?\s*%/.test(candidate.text)) { value += 2; signals.push('percentage'); }
    if (/\b(retain(s|ed)?|retention|delete[sd]?|stored? for|for \d+ days?)\b/i.test(candidate.text)) { value += 3; signals.push('retention'); }
    if (/\b\d{4}-\d{2}-\d{2}\b|\b(19|20)\d{2}\b/.test(candidate.text)) { value += 1; signals.push('date'); }
    if (/\b(sign in|sign up|log in|create an account|cookie|consent|subscribe)\b/i.test(candidate.text)) { value -= 4; signals.push('account-or-consent'); }
    if (/\d/.test(candidate.text)) signals.push('number');

    if (!best || value > best.value) best = { ...candidate, value, signals };
  }
  if (!best || best.value <= 0) return none;

  // Recover the paragraph the winner sat in, bounded. A table row already has one.
  let excerpt = best.excerpt ?? '';
  if (!excerpt && best.lineIndex !== undefined) {
    const para = [];
    for (let i = best.lineIndex; i >= 0 && lines[i]?.trim() && !/^\s{0,3}#{1,6}\s/.test(lines[i]); i -= 1) para.unshift(stripMarkdown(lines[i]));
    for (let i = best.lineIndex + 1; i < lines.length && lines[i]?.trim() && !/^\s{0,3}#{1,6}\s/.test(lines[i]); i += 1) para.push(stripMarkdown(lines[i]));
    excerpt = para.filter(Boolean).join(' ').trim();
  }
  if (excerpt.length > EXCERPT_CHARS) excerpt = `${excerpt.slice(0, EXCERPT_CHARS).trimEnd()}…`;

  return { finding: cap(best.text), excerpt, heading: best.heading ?? '', signals: best.signals, score: best.value };
}

/** How much of the surrounding paragraph a reviewer needs to confirm the sentence. */
export const EXCERPT_CHARS = 420;

/**
 * Page markdown in, one line of prose out.
 *
 * A wrapper over `findingWithContext`, so the sentence the collector writes and the
 * excerpt a reviewer reads are chosen by one piece of code and cannot drift apart.
 */
export function firstFinding(markdown, fallback = '') {
  return findingWithContext(markdown, fallback).finding;
}

function cap(text) {
  const one = text.replace(/\s+/g, ' ').trim();
  if (one.length <= MAX_CHARS) return one;
  const cut = one.slice(0, MAX_CHARS - 1);
  const at = cut.lastIndexOf(' ');
  return `${(at > 80 ? cut.slice(0, at) : cut).trimEnd()}…`;
}

export { MAX_CHARS };
