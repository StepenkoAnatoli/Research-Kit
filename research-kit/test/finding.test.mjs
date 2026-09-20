// The extractor is the one module a caller can exercise with a string (ADR-0016).
// Page markdown in, one line of prose out.

import { test, describe, assert } from './harness.mjs';
import { firstFinding, findingWithContext, sentences, score, MAX_CHARS, EXCERPT_CHARS } from '../lib/finding.mjs';

describe('finding');

test('it is pure: a string in, a string out, no filesystem and no corpus', () => {
  assert.equal(firstFinding('', 'fallback'), 'fallback');
  assert.equal(firstFinding(null, 'fallback'), 'fallback');
  assert.equal(typeof firstFinding('# Title\n\nA sentence long enough to be a claim about limits.', ''), 'string');
});

test('a concrete sentence beats a vague one', () => {
  const page = `# Plans

We believe in building great software for everyone, everywhere.

The free plan allows 10 scrape requests per minute and includes 1,000 credits per month.
`;
  assert.match(firstFinding(page, 'x'), /10 scrape requests per minute/);
});

test('navigation, cookie banners and campaign copy are never the finding', () => {
  const page = `Home
Docs
Sign in
We use cookies to improve your experience. Accept all.
Trusted by 50,000 developers
Start your free trial - no credit card required

The API returns 429 when the per-minute limit of 10 requests is exceeded.
`;
  const finding = firstFinding(page, 'x');
  assert.match(finding, /429/);
  assert.doesNotMatch(finding, /cookies|free trial|Trusted by/);
});

test('a tracking-laden line is dropped', () => {
  const page = 'Read more at https://x.invalid/a?utm_source=nav&utm_campaign=header for details about things.\n\nRate limits are enforced per team and not per key, at 10 requests per minute.';
  assert.match(firstFinding(page, 'x'), /per team/);
});

test('a pricing table\'s first data row is read as prose', () => {
  const page = `# Pricing

| Plan | Credits | Price |
|---|---|---|
| Free | 1,000 | $0 |
| Hobby | 5,000 | $16 |
`;
  const finding = firstFinding(page, 'x');
  assert.match(finding, /Plan: Free/);
  assert.match(finding, /Credits: 1,000/);
});

test('a bare price fragment from a tier hero block is not a finding', () => {
  const page = '$16\n/month\nHobby\n\nThe Hobby plan includes 5,000 credits per month and 5 concurrent requests.';
  assert.match(firstFinding(page, 'x'), /5,000 credits/);
});

test('fenced code is not prose', () => {
  const page = '```js\nconst limit = 10; // this sentence-like comment is not a claim about anything\n```\n\nThe documented limit is 10 requests per minute on the free plan.';
  const finding = firstFinding(page, 'x');
  assert.match(finding, /documented limit/);
  assert.doesNotMatch(finding, /const limit/);
});

test('links keep their text and lose their target', () => {
  const page = 'See the [rate limits reference](https://docs.x.invalid/rate-limits) for the per-minute caps of 10 requests.';
  const finding = firstFinding(page, 'x');
  assert.match(finding, /rate limits reference/);
  assert.doesNotMatch(finding, /https:/);
});

test('the output is capped, and the cap does not cut a word in half', () => {
  const long = `A documented limit of 10 requests per minute applies, ${'and there is a great deal more detail after it '.repeat(20)}`;
  const finding = firstFinding(long, 'x');
  assert.ok(finding.length <= MAX_CHARS, `${finding.length} > ${MAX_CHARS}`);
  if (finding.endsWith('…')) {
    // It breaks on a space, so the last word it kept is a whole word from the page.
    const lastWord = finding.slice(0, -1).trim().split(/\s+/).pop();
    assert.match(long, new RegExp(`\\b${lastWord}\\b`), 'the cap must not cut a word in half');
  }
});

test('a page with nothing worth saying returns the fallback verbatim', () => {
  assert.equal(firstFinding('Home\nDocs\nSign in\nNext\n', 'the page title'), 'the page title');
});

test('the sentence splitter does not break on e.g., v2.1, or 1,000.', () => {
  assert.deepEqual(sentences('Use it, e.g. for docs. Version v2.1 ships now. That is 1,000.5 credits.'), [
    'Use it, e.g. for docs.',
    'Version v2.1 ships now.',
    'That is 1,000.5 credits.',
  ]);
});

test('score rewards numbers, limits and prices, and penalises questions and marketing', () => {
  assert.ok(score('The free plan allows 10 requests per minute and 1,000 credits.') > score('It is a great product for teams.'));
  assert.ok(score('Pricing starts at $16 per month for the Hobby plan.') > 0);
  assert.ok(score('What are the rate limits for the free plan on this service?') < score('The rate limit is 10 requests per minute.'));
});

// ---------------------------------------------------------------- evidence-first ranking
//
// Added 2026-09-20. The extractor already preferred concrete sentences; these cover the
// signals it gained - where a sentence sits on the page, and what kind of claim it makes -
// and the excerpt, which is what lets a reviewer confirm a finding without opening the
// capture.

test('a heading that promises terms outranks one that promises news', () => {
  // The cheapest signal a page gives about which of its claims are load-bearing. The
  // announcement below is longer, has a year in it, and would otherwise compete.
  const page = [
    '# Acme',
    '',
    '## Blog',
    '',
    'We announced our Series B in 2024 and processed 5,000,000 requests that quarter.',
    '',
    '## Rate limits',
    '',
    'The free plan allows 10 requests per minute per team.',
  ].join('\n');
  const result = findingWithContext(page, 'x');
  assert.match(result.finding, /10 requests per minute/);
  assert.equal(result.heading, 'Rate limits');
  assert.ok(result.signals.includes('evidence-heading'), JSON.stringify(result.signals));
});

test('a retention period beats a bare number elsewhere on the page', () => {
  const page = [
    '## Features',
    '',
    'Our dashboard shows 12 charts and refreshes every 30 seconds for every account.',
    '',
    '## Data retention',
    '',
    'Search data is retained for 31 days after the search is completed, then deleted.',
  ].join('\n');
  const result = findingWithContext(page, 'x');
  assert.match(result.finding, /31 days/);
  assert.ok(result.signals.includes('retention'), JSON.stringify(result.signals));
});

test('sign-in and consent text is pushed down even when it carries a number', () => {
  const page = [
    '## Limits',
    '',
    'Sign in to unlock 500 requests per minute on your account today.',
    '',
    'The free plan allows 10 requests per minute per team.',
  ].join('\n');
  assert.match(findingWithContext(page, 'x').finding, /10 requests per minute/);
});

test('the excerpt carries the surrounding paragraph, bounded, so a reviewer can confirm it', () => {
  const page = [
    '## Rate limits',
    '',
    'The free plan allows 10 requests per minute per team.',
    'Requests beyond that return HTTP 429 with a Retry-After header.',
  ].join('\n');
  const result = findingWithContext(page, 'x');
  assert.ok(result.excerpt.includes('HTTP 429'), `the excerpt lost the sentence that qualifies the claim: ${result.excerpt}`);
  assert.ok(result.excerpt.length <= EXCERPT_CHARS + 1, `excerpt is ${result.excerpt.length} chars, which is not bounded`);
});

test('firstFinding is exactly findingWithContext.finding, so the two cannot drift', () => {
  // firstFinding is what the collector writes into the evidence table; findingWithContext
  // is what a reviewer reads. If they ever selected differently, the excerpt would be
  // supporting a sentence nobody recorded.
  const pages = [
    '## Pricing\n\nThe Starter plan costs $25 per month for 1,000 searches.',
    '',
    'No headings here, just one sentence about a 10 request per minute limit.',
    '## Blog\n\nWe are excited to announce our new brand and our 2024 results.',
  ];
  for (const page of pages) {
    assert.equal(firstFinding(page, 'fb'), findingWithContext(page, 'fb').finding, JSON.stringify(page));
  }
});

test('a page with nothing concrete still returns the fallback, and says so', () => {
  const page = '## About us\n\nWe are a team that loves building things people want.';
  const result = findingWithContext(page, 'the fallback');
  assert.equal(result.finding, 'the fallback');
  assert.equal(result.excerpt, '', 'a fallback finding must not carry an excerpt that supports something else');
});
