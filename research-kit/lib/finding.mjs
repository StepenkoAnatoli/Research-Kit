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
export function firstFinding(markdown, fallback = '') {
  const source = String(markdown ?? '');
  if (!source.trim()) return fallback;

  const lines = source.split(/\r?\n/);
  const candidates = [];
  let inFence = false;

  for (let i = 0; i < lines.length; i += 1) {
    const raw = lines[i];
    if (/^\s*```/.test(raw)) { inFence = !inFence; continue; }
    if (inFence) continue;

    if (raw.trim().startsWith('|')) {
      const row = fromTable(lines, i);
      if (row && !isNoise(row)) candidates.push({ text: row, bonus: 2 });
      continue;
    }

    const line = stripMarkdown(raw);
    if (isNoise(line)) continue;
    for (const sentence of sentences(line)) {
      const text = sentence.trim();
      if (text.length < 25) continue;
      if (isNoise(text)) continue;
      candidates.push({ text, bonus: 0 });
    }
  }

  if (!candidates.length) return fallback;

  let best = null;
  for (const candidate of candidates) {
    const value = score(candidate.text) + candidate.bonus;
    if (!best || value > best.value) best = { ...candidate, value };
  }
  if (!best || best.value <= 0) return fallback;
  return cap(best.text);
}

function cap(text) {
  const one = text.replace(/\s+/g, ' ').trim();
  if (one.length <= MAX_CHARS) return one;
  const cut = one.slice(0, MAX_CHARS - 1);
  const at = cut.lastIndexOf(' ');
  return `${(at > 80 ? cut.slice(0, at) : cut).trimEnd()}…`;
}

export { MAX_CHARS };
