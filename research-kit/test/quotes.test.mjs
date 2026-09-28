// ADR-0087: a claim may carry `[quote: ...]`, and the gate checks the quote is really in the
// row's capture. Research: docs/decisions/2026-09-28-quote-anchors.

import { test, describe, assert, makePassingProject, corrupt } from './harness.mjs';
import { PATHS } from '../lib/core.mjs';
import { readCorpus } from '../lib/corpus.mjs';
import { runCheck } from '../lib/checks.mjs';
import { quoteAnchors, normalizeForMatch, anchorFound } from '../lib/quotes.mjs';

describe('quotes');

test('quote markers are read from a Finding cell, fragments split on an ellipsis', () => {
  assert.deepEqual(quoteAnchors('No marker here, "just prose" in quotes.'), []);
  assert.deepEqual(quoteAnchors('Claim. [quote: the free plan allows 10 requests] and [quote: a ... b c]').map((q) => q.fragments),
    [['the free plan allows 10 requests'], ['a', 'b c']]);
  assert.deepEqual(quoteAnchors('[quote: one … two]')[0].fragments, ['one', 'two']);
});

test('matching survives what a capture does to text, and nothing looser', () => {
  const body = 'The **ﬁrst** plan — see [the docs](https://x.invalid/a) — says \\*“don’t   stop”\\*.';
  assert.equal(normalizeForMatch('The FIRST plan - see the docs - says "don\'t stop".'), normalizeForMatch(body));
  assert.equal(anchorFound(['first plan - see the docs'], body), true, 'ligature, emphasis, dash and link text');
  assert.equal(anchorFound(['says "don\'t stop"'], body), true, 'curly quotes, escapes, runs of spaces');
  assert.equal(anchorFound(['first plan', 'says'], body), true, 'fragments in order');
  assert.equal(anchorFound(['says', 'first plan'], body), false, 'fragments out of order');
  assert.equal(anchorFound(['the second plan'], body), false, 'an invented word is not drift');
});

function quoted(finding) {
  const dir = makePassingProject();
  corrupt(dir, PATHS.evidence, (t) => t.replace(
    '| The free plan allows 10 requests per minute and includes 1,000 credits. |', `| ${finding} |`));
  return runCheck('citations', readCorpus(dir));
}

test('a quote found in its capture passes; a fabricated one blocks; a short one warns', () => {
  const real = quoted('Free tier limits. [quote: The free plan allows 10 requests per minute]');
  assert.ok(!real.some((f) => f.severity !== 'pass'), JSON.stringify(real));
  assert.ok(real.some((f) => /1 quote/.test(f.detail)), 'the pass message counts the anchored quotes');

  const fake = quoted('Free tier limits. [quote: The free plan allows 100 requests per minute]');
  const blocked = fake.find((f) => f.rule === 'quote-not-found');
  assert.equal(blocked?.severity, 'fail', JSON.stringify(fake));
  assert.match(blocked.detail, /E-01.*100 requests per minute/);

  const short = quoted('Free tier limits. [quote: free plan]');
  assert.equal(short.find((f) => f.rule === 'quote-too-short')?.severity, 'warn', JSON.stringify(short));
});

// The same finding, for a corpus collected before error pages were refused: a row that
// cites one is flagged, not blocked - some corpora cite a 404 on purpose, as the record of
// an attempted lookup.
test('a row citing an error-status capture is flagged', async () => {
  const dir = makePassingProject();
  corrupt(dir, (await import('../lib/corpus.mjs')).readCorpus(dir).captures.entries[0].file, (t) => t.replace('statusCode: 200', 'statusCode: 404'));
  const { rebuildLedger } = await import('../lib/provenance.mjs');
  rebuildLedger?.(dir);
  const findings = runCheck('citations', readCorpus(dir));
  assert.equal(findings.find((f) => f.rule === 'raw-error-status')?.severity, 'warn', JSON.stringify(findings));

  // A row that says the page failed, naming the status, has acknowledged it: this
  // repository's E-15 keeps a 404 on purpose as the record of a failed guess.
  corrupt(dir, PATHS.evidence, (t) => t.replace('| The free plan allows', '| The guessed URL answered HTTP 404; kept as the record of a failed lookup. The free plan allows'));
  assert.equal(runCheck('citations', readCorpus(dir)).find((f) => f.rule === 'raw-error-status'), undefined);
});
