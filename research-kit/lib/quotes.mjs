// lib/quotes.mjs - quote anchors (ADR-0087).
//
// A claim in an EVIDENCE Finding cell may carry `[quote: ...]`, a verbatim passage of the
// row's capture. The gate checks the passage is really there - a question about a string,
// never about prose, which is the only kind of question a gate here may ask. Whether the
// passage SUPPORTS the claim stays the reviewer's judgement.
//
// Research: docs/decisions/2026-09-28-quote-anchors. A real deep-research report carried six
// quotations attached to real citations, and none of the six occurred in the corpus (E-01).

/** A quote shorter than this proves almost nothing: "free plan" occurs on every pricing page. */
export const MIN_QUOTE_WORDS = 3;

const QUOTE_RE = /\[quote:\s*([^\]]*)\]/gi;

/**
 * The quote markers in a Finding cell, each split into fragments on an ellipsis (`...` or
 * `…`), which stands for text the quoter left out. Prose in quotation marks is NOT a marker:
 * over this repository's 17 corpora a naive pairing of quotation marks read the text BETWEEN
 * two quotes as a quote, again and again.
 */
export function quoteAnchors(text) {
  const out = [];
  for (const match of String(text ?? '').matchAll(QUOTE_RE)) {
    const quote = match[1].trim();
    const fragments = quote.split(/\s*(?:\.\.\.|…)\s*/).map((f) => f.trim()).filter(Boolean);
    if (fragments.length) out.push({ quote, fragments });
  }
  return out;
}

/**
 * Text as it is compared, and only compared - never stored (UAX #15: NFKC removes formatting
 * distinctions). It undoes what a capture does to a sentence and nothing more: compatibility
 * forms (the "fi" ligature), curly quotes and long dashes, Markdown link syntax, emphasis,
 * backticks and backslash escapes, runs of whitespace, and case.
 */
export function normalizeForMatch(text) {
  return String(text ?? '')
    .normalize('NFKC')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[‘’‚‛′]/g, "'")
    .replace(/[“”„‟″]/g, '"')
    .replace(/[‐-―−]/g, '-')
    .replace(/[*_`\\]/g, '')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim();
}

/**
 * Whether every fragment occurs in the body, in order. Exact after normalization, with no
 * fuzzy fallback: a 0.92 similarity accepts an invented word inside a real sentence, which
 * is the very failure this exists to catch (the brief's contradiction section).
 */
export function anchorFound(fragments, body) {
  const haystack = normalizeForMatch(body);
  let from = 0;
  for (const fragment of fragments) {
    const needle = normalizeForMatch(fragment);
    if (!needle) continue;
    const at = haystack.indexOf(needle, from);
    if (at < 0) return false;
    from = at + needle.length;
  }
  return true;
}

/** Words in a quote, across its fragments: what MIN_QUOTE_WORDS is measured against. */
export function quoteWords(anchor) {
  return anchor.fragments.join(' ').split(/\s+/).filter(Boolean).length;
}
