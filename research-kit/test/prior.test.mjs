// The registered prior: what was expected BEFORE the evidence, and the three ways a
// dishonest one could get in. Each of those three is measured here rather than argued,
// because "the chain makes it impossible" is exactly the kind of claim that turns out to
// have a gap nobody tried.

import { test, describe, assert, makeProject, makePassingProject, corrupt, tempDir, fs } from './harness.mjs';
import { PATHS, resolve, readText, writeText, sha256 } from '../lib/core.mjs';
import { readCorpus, readLedger } from '../lib/corpus.mjs';
import { appendFetch, verifyLedger } from '../lib/provenance.mjs';
import { runCheck } from '../lib/checks.mjs';
import { renderBrief } from '../lib/brief.mjs';
import { registerPrior, readPrior, priorRefusal, priorOf, PRIOR_PATH, PRIOR_OP, MIN_PRIOR } from '../lib/prior.mjs';

describe('prior');

const GOOD = 'I expect the free tier to cap at 10 requests a minute, because that is what the '
  + 'pricing page said in May. I do not know whether the cap is per key or per account.';

function snapshot(dir) {
  const corpus = readCorpus(dir);
  corpus.chain = verifyLedger(dir, { corpus });
  return corpus;
}

const entriesOf = (dir) => readLedger(dir).entries;

test('a registered prior lands at seq 1 and chains the file it names', () => {
  const dir = makeProject();
  const entry = registerPrior(dir, GOOD);

  assert.equal(entry.seq, 1);
  assert.equal(entry.op, PRIOR_OP);
  assert.equal(entry.raw, PRIOR_PATH);
  assert.equal(entry.bodySha256, sha256(fs.readFileSync(resolve(dir, PRIOR_PATH))));
  assert.match(readText(resolve(dir, PRIOR_PATH)), /free tier to cap at 10 requests/);
});

test('a prior is not a capture - it lives outside research/raw and is never counted as one', () => {
  // `readCaptures` walks the raw directory, so a file anywhere else cannot be mistaken for
  // evidence. Pinned because the obvious place to put PRIOR.md would have been beside the
  // captures, where it would have arrived with no url in its front-matter and shown up as
  // a `capture-no-url` problem on every project that registered one.
  const dir = makePassingProject();
  const before = readCorpus(dir).captures.entries.length;
  fs.rmSync(resolve(dir, PATHS.ledger));
  writeText(resolve(dir, PATHS.ledger), '');
  registerPrior(dir, GOOD);

  assert.equal(readCorpus(dir).captures.entries.length, before);
  assert.ok(!PRIOR_PATH.startsWith(PATHS.raw), 'the prior must not live under research/raw');
});

test('editing the prediction after collecting fails the chain', () => {
  // The first of the three dishonest paths, and the one that needs no new code: the prior
  // is chained with its bodySha256, so revising it once the answer is known breaks
  // `body-unmodified` through the machinery a capture already uses.
  const dir = makeProject();
  registerPrior(dir, GOOD);
  writeText(resolve(dir, PRIOR_PATH), 'I always expected whatever the evidence turned out to say.\n');

  const findings = runCheck('provenance', snapshot(dir));
  const hit = findings.find((f) => f.rule === 'body-unmodified');
  assert.equal(hit.severity, 'fail');
  assert.match(hit.detail, /PRIOR\.md does not match the hash recorded at fetch/);
});

test('registerPrior refuses once a page has been collected', () => {
  // The second path, closed by the tool.
  const dir = makePassingProject();
  const refusal = priorRefusal(dir, GOOD, { entries: entriesOf(dir) });
  assert.match(refusal, /already been collected/);
  assert.throws(() => registerPrior(dir, GOOD), /already been collected/);
  assert.ok(!fs.existsSync(resolve(dir, PRIOR_PATH)), 'a refused registration writes nothing');
});

test('a late prior chained BY HAND, with every hash correct, still fails the gate', () => {
  // The third path, and the only one that needed a check. `bin/prior.mjs` can be bypassed -
  // `appendFetch` is a public export and will happily chain a prior at seq 2 - so the gate
  // verifies the ORDER itself rather than trusting that the tool was used. Without this,
  // the other two refusals would be a fence with a gate left open beside it.
  const dir = makePassingProject();
  const body = 'Registered afterwards, with the answer already in hand.\n';
  writeText(resolve(dir, PRIOR_PATH), body);
  appendFetch(dir, {
    op: PRIOR_OP,
    raw: PRIOR_PATH,
    bodySha256: sha256(Buffer.from(body, 'utf8')),
    completeness: 'unspecified',
  });

  const chain = verifyLedger(dir);
  assert.ok(chain.ok, 'the forged chain verifies - which is the point');

  const hit = runCheck('provenance', snapshot(dir)).find((f) => f.rule === 'prior-precedes-collection');
  assert.equal(hit.severity, 'fail');
  assert.match(hit.detail, /after 1 page\(s\) were already collected/);
});

test('two registered priors are refused - you predict once, or you pick the one that matched', () => {
  const dir = makeProject();
  registerPrior(dir, GOOD);
  assert.throws(() => registerPrior(dir, `${GOOD} Or possibly the opposite of all of that.`),
    /already has a registered prior/);

  // And if one is chained by hand anyway, the gate says so rather than reading the first.
  const body = 'A second prediction, hedging the first.\n';
  writeText(resolve(dir, 'research/PRIOR-2.md'), body);
  appendFetch(dir, { op: PRIOR_OP, raw: 'research/PRIOR-2.md', bodySha256: sha256(Buffer.from(body, 'utf8')) });
  const hit = runCheck('provenance', snapshot(dir)).find((f) => f.rule === 'prior-single');
  assert.equal(hit.severity, 'fail');
});

test('a prior too short to be falsifiable is refused, and the floor is a floor not a judgement', () => {
  const dir = makeProject();
  assert.throws(() => registerPrior(dir, 'it will be fine'), new RegExp(`at least ${MIN_PRIOR}`));

  // The floor cannot tell a real prediction from padding, and does not claim to. What it
  // stops is a one-word prior that could be called correct afterwards whatever happened.
  assert.equal(priorRefusal(dir, 'x'.repeat(MIN_PRIOR), { entries: [] }), null);
});

test('the gate is SILENT when no prior is registered', () => {
  // A prior is optional. A warning on every project that did not register one is a warning
  // nobody reads, and would turn the habit into a toll - so absence produces no finding at
  // all, not a passing one and not a warning.
  const dir = makePassingProject();
  const findings = runCheck('provenance', snapshot(dir));
  assert.ok(!findings.some((f) => f.rule.startsWith('prior-')), 'no prior means nothing to say');
  assert.ok(findings.every((f) => f.severity === 'pass'));
});

test('a correctly registered prior passes, and the finding quotes it', () => {
  const dir = makeProject();
  registerPrior(dir, GOOD);
  const hit = runCheck('provenance', snapshot(dir)).find((f) => f.rule === 'prior-precedes-collection');
  assert.equal(hit.severity, 'pass');
  assert.match(hit.detail, /before anything was collected/);
  assert.match(hit.detail, /free tier to cap at 10 requests/);
});

test('the drafted brief quotes the prior verbatim, and never scores it', () => {
  // The prior is only worth registering if it is read back NEXT TO the answer. Left in its
  // own file it is a file nobody opens; the brief is the one document phase 2 must read.
  const dir = makeProject();
  registerPrior(dir, GOOD);
  renderBrief(dir, { force: true });
  const brief = readText(resolve(dir, PATHS.brief));

  assert.match(brief, /## The prior, registered before anything was collected/);
  assert.match(brief, /> I expect the free tier to cap at 10 requests a minute/);
  assert.ok(brief.indexOf('## The prior') < brief.indexOf('## Intent'),
    'the prediction is read before the findings, not after them');
  for (const word of ['correct', 'confirmed', 'vindicated', 'score']) {
    assert.ok(!new RegExp(`prior[^#]{0,400}${word}`, 'i').test(brief),
      `the brief must not grade the prior (found "${word}")`);
  }
});

test('a brief drafted without a prior gains no empty section', () => {
  const dir = makeProject();
  renderBrief(dir, { force: true });
  assert.ok(!readText(resolve(dir, PATHS.brief)).includes('## The prior'));
});

test('readPrior reports a late registration rather than hiding it', () => {
  const dir = makePassingProject();
  const body = 'After the fact.\n';
  writeText(resolve(dir, PRIOR_PATH), body);
  appendFetch(dir, { op: PRIOR_OP, raw: PRIOR_PATH, bodySha256: sha256(Buffer.from(body, 'utf8')) });

  const prior = readPrior(dir, { entries: entriesOf(dir) });
  assert.equal(prior.present, true);
  assert.equal(prior.scrapesBefore, 1);
  assert.equal(priorOf(entriesOf(dir)).op, PRIOR_OP);
});
