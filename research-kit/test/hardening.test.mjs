// The defects the 2026-09-16 researcher review confirmed in the previous implementation,
// each pinned here so it cannot return. One test per finding, named by its F-number, and
// each one FAILS against the behaviour the review described.

import { test, describe, assert, makePassingProject, makeProject, corrupt, tempDir, fs, path } from './harness.mjs';
import { PATHS, HEADERS, resolve, readText, writeText, writeJson } from '../lib/core.mjs';
import { readCorpus, appendRow, upsertRow, alignToHeader } from '../lib/corpus.mjs';
import { writeAudit, zipAudit, readManifest, readManifestState, fingerprintOf } from '../lib/audit.mjs';
import { renderBrief } from '../lib/brief.mjs';
import { runResearch } from '../lib/research-run.mjs';
import { decompose } from '../lib/decompose.mjs';
import { collectOne, DEFAULT_SOURCE_TYPE } from '../lib/collect.mjs';
import { scrape, gradeCompleteness, mainContent } from '../lib/http-transport.mjs';
import { rankCandidate } from '../lib/research-run.mjs';
import { collectionPolicy, machineRole, kitHome, configPath, agentsHome } from '../lib/machine.mjs';
import { scanForSecrets } from '../lib/doctor.mjs';
import { lineEndingRemedy } from '../lib/handoff.mjs';
import { runPreflight } from '../lib/preflight.mjs';
import { runCheck } from '../lib/checks.mjs';

describe('hardening');

const PAGE = 'A claim about limits of 10 per minute and 1,000 credits. '.repeat(20);

function stub({ results = [] } = {}) {
  return {
    name: 'stub-transport',
    search: (query) => ({ ok: true, query, results }),
    runScrape: (url) => ({ ok: true, url, title: 'T', markdown: PAGE, statusCode: 200, transport: 'stub-transport', completeness: 'full', cmd: 'stub' }),
  };
}

// --- F16: an unreadable role config must not enable collection --------------------

test('F16: an unreadable config with nothing to hold refuses metered collection', () => {
  const file = path.join(tempDir('rk-f16-'), 'config.json');
  writeText(file, '{"role": "buil');
  const env = { ...process.env, RESEARCH_KIT_CONFIG: file };

  assert.equal(machineRole(env), 'unknown');
  const policy = collectionPolicy(env);
  assert.equal(policy.mayCollect, false, 'collector is the role that may spend credits - it is not a fallback');
  assert.match(policy.remedy, /--role/);
});

test('F16: a misspelled role is unknown, not a silent default', () => {
  const file = path.join(tempDir('rk-f16b-'), 'config.json');
  writeText(file, JSON.stringify({ role: 'Collector' }));
  assert.equal(collectionPolicy({ ...process.env, RESEARCH_KIT_CONFIG: file }).mayCollect, false);
});

// --- F10: a manifest must not package files outside the project -------------------

test('F10: a manifest entry that climbs out of research/audits/ is refused', () => {
  const dir = makePassingProject();
  writeAudit(dir);
  const outside = path.join(path.dirname(dir), 'private-canary.txt');
  writeText(outside, 'CANARY');

  const manifest = readManifest(dir);
  manifest.topics['fixture-topic'].versions['0.1'].subtopics.push('../../private-canary.txt');
  writeJson(resolve(dir, `${PATHS.audits}/index.json`), manifest);

  const bundle = zipAudit(dir);
  assert.equal(bundle.ok, false, 'a corpus can arrive from another machine with its manifest');
  assert.match(bundle.reason, /outside/);
});

test('F10: an absolute path in the manifest is refused too', () => {
  const dir = makePassingProject();
  writeAudit(dir);
  const manifest = readManifest(dir);
  manifest.topics['fixture-topic'].versions['0.1'].subtopics.push(path.join(tempDir('rk-abs-'), 'x.md'));
  writeJson(resolve(dir, `${PATHS.audits}/index.json`), manifest);
  assert.equal(zipAudit(dir).ok, false);
});

// --- F15: a corrupt index must not destroy immutability ---------------------------

test('F15: absent and corrupt are different manifest states', () => {
  const dir = makePassingProject();
  assert.equal(readManifestState(dir).state, 'absent');
  writeAudit(dir);
  assert.equal(readManifestState(dir).state, 'readable');
  writeText(resolve(dir, `${PATHS.audits}/index.json`), '{ corrupt');
  assert.equal(readManifestState(dir).state, 'corrupt');
});

test('F15: a corrupt index is refused, and the immutable file survives', () => {
  const dir = makePassingProject();
  const first = writeAudit(dir);
  const before = readText(resolve(dir, first.main));

  writeText(resolve(dir, `${PATHS.audits}/index.json`), '{ corrupt');
  corrupt(dir, PATHS.evidence, (t) => t.replace('The free plan', 'REWRITTEN: the free plan'));

  const second = writeAudit(dir);
  assert.equal(second.written, false, 'treating corrupt as empty restarts the count and overwrites v0.1');
  assert.match(second.reason, /does not parse/);
  assert.equal(readText(resolve(dir, first.main)), before, 'the existing audit is untouched');
});

// --- F06: the fingerprint must cover everything the audit renders -----------------

test('F06: answering the brief\'s judged section bumps the audit', () => {
  const dir = makePassingProject();
  renderBrief(dir);
  writeAudit(dir);

  const brief = resolve(dir, PATHS.brief);
  writeText(brief, readText(brief).replace(/## Decision\n\n\*\*TODO\*\*[\s\S]*?\n\n## Next steps/, '## Decision\n\nBuild the collector first.\n\n## Next steps'));

  const second = writeAudit(dir);
  assert.equal(second.written, true, 'the audit prints the Decision, so the Decision is an input');
  assert.equal(second.version, '0.2');
});

test('F06: rewriting a claim bumps it too', () => {
  const dir = makePassingProject();
  const before = fingerprintOf(readCorpus(dir));
  corrupt(dir, PATHS.evidence, (t) => t.replace('The free plan', 'Revised: the free plan'));
  assert.notEqual(fingerprintOf(readCorpus(dir)), before);
});

// --- F22: writers must map onto the header actually on disk -----------------------

test('F22: a reordered header does not scramble the cells', () => {
  const dir = makeProject();
  writeText(resolve(dir, PATHS.evidence), '# Evidence\n\n| ID | URL | Retrieved | Type | Finding | Raw |\n|---|---|---|---|---|---|\n');
  appendRow(dir, PATHS.evidence, HEADERS.evidence, ['E-01', '2026-09-17', 'P', 'https://x.invalid/a', 'claim', 'research/raw/a.md']);

  const row = readCorpus(dir).evidence[0];
  assert.equal(row.url, 'https://x.invalid/a', 'the URL must land in the URL column, wherever it is');
  assert.equal(row.retrieved, '2026-09-17');
  assert.equal(row.type, 'P');
});

test('F22: upsert matches its key in the column that holds it', () => {
  const dir = makeProject();
  writeText(resolve(dir, PATHS.sources), '# Sources\n\n| Type | URL | Title | Retrieved | Used for |\n|---|---|---|---|---|\n');
  upsertRow(dir, PATHS.sources, HEADERS.sources, ['https://x.invalid', 'P', 'First', '2026-01-01', 'U-1']);
  upsertRow(dir, PATHS.sources, HEADERS.sources, ['https://x.invalid', 'P', 'Second', '2026-02-01', 'U-1']);

  const rows = readCorpus(dir).sources;
  assert.equal(rows.length, 1, 'one row, replaced - not two');
  assert.equal(rows[0].title, 'Second');
  assert.equal(rows[0].url, 'https://x.invalid');
});

test('F22: a header the canonical set does not cover is REFUSED, not guessed at', () => {
  const dir = makeProject();
  writeText(resolve(dir, PATHS.evidence), '# Evidence\n\n| ID | Whatever | Retrieved | Type | Finding | Raw |\n|---|---|---|---|---|---|\n');
  assert.throws(
    () => appendRow(dir, PATHS.evidence, HEADERS.evidence, ['E-01', 'd', 'P', 'u', 'f', 'r']),
    /Whatever/,
  );
});

test('F22: alignToHeader is the mapping, and it is identity when the order matches', () => {
  assert.deepEqual(alignToHeader(['A', 'B'], ['1', '2'], ['A', 'B']), ['1', '2']);
  assert.deepEqual(alignToHeader(['A', 'B'], ['1', '2'], ['B', 'A']), ['2', '1']);
  assert.deepEqual(alignToHeader(['A', 'B'], ['1', '2'], null), ['1', '2']);
});

// --- F19 / F20: budgets must be honest and validated ------------------------------

test('F19: a dry run previews against the SAME budget execution would use', () => {
  const dir = makeProject();
  writeJson(resolve(dir, PATHS.plan), {
    topic: 'x', depth: 'probe', maxScrapes: 1, queries: [],
    urls: ['https://x.invalid/a', 'https://x.invalid/b', 'https://x.invalid/c'],
  });

  const run = runResearch(dir, { adapter: stub(), dryRun: true });
  assert.equal(run.spent, 0, 'a dry run spends nothing');
  assert.equal(run.attempts, 1, 'and shows what it WOULD cost, capped');
  assert.equal(run.results.filter((r) => /budget exhausted/.test(r.reason ?? '')).length, 2);
});

test('F19: the preview and the execution agree on which URLs are in budget', () => {
  const plan = { topic: 'x', depth: 'probe', maxScrapes: 1, queries: [], urls: ['https://x.invalid/a', 'https://x.invalid/b'] };
  const preview = makeProject();
  writeJson(resolve(preview, PATHS.plan), plan);
  const real = makeProject();
  writeJson(resolve(real, PATHS.plan), plan);

  const dry = runResearch(preview, { adapter: stub(), dryRun: true });
  const wet = runResearch(real, { adapter: stub() });
  // In a dry run EVERY row has status `skipped` - nothing was done. What must agree is
  // the budget decision, which is carried by the reason.
  const budgetCall = (run) => run.results.map((r) => `${r.url}:${/budget exhausted/.test(r.reason ?? '') ? 'over-budget' : 'in-budget'}`);
  assert.deepEqual(budgetCall(dry), budgetCall(wet));
  assert.deepEqual(budgetCall(wet), ['https://x.invalid/a:in-budget', 'https://x.invalid/b:over-budget']);
});

test('F20: a budget that is not a number is REFUSED before anything is spent', () => {
  const dir = makeProject();
  let scraped = 0;
  const adapter = { ...stub({ results: [{ url: 'https://a.invalid/1' }] }), runScrape: (u) => { scraped += 1; return stub().runScrape(u); } };
  assert.throws(() => decompose(dir, { topic: 't', adapter, maxScrapes: Number('abc') }), /whole number/);
  assert.equal(scraped, 0, 'NaN removed the cap it looked like it was setting');
});

test('F20: failed searches are kept, not just printed', () => {
  const dir = makeProject();
  const result = decompose(dir, {
    topic: 't',
    adapter: { name: 's', search: () => ({ ok: false, error: 'HTTP 402' }), runScrape: () => ({ ok: false }) },
  });
  assert.equal(result.gathered, false, 'a quiet topic and a failed run must not look the same');
  assert.equal(result.failures.length, 4);
  assert.match(result.failures[0].error, /402/);
});

// --- F04: completeness is not length ----------------------------------------------

test('F04: a dropped sibling section makes a capture partial, and says so', () => {
  const body = `<html><body>
    <article>${'Ordinary prose about the product. '.repeat(90)}</article>
    <article><h2>Quota exception</h2><p>Enterprise keys are exempt from the cap.</p></article>
  </body></html>`;
  const result = scrape('https://x.invalid/p', {
    spawn: () => ({ stdout: JSON.stringify({ ok: true, url: 'https://x.invalid/p', body }), stderr: '', status: 0 }),
  });
  assert.equal(result.completeness, 'partial', 'long is not the same as complete');
  assert.match(result.omitted, /sibling section/);
});

test('F04: a page with one block and nothing dropped is full', () => {
  const body = `<html><body><article>${'One clean article and nothing else at all. '.repeat(90)}</article></body></html>`;
  const result = scrape('https://x.invalid/p', {
    spawn: () => ({ stdout: JSON.stringify({ ok: true, url: 'https://x.invalid/p', body }), stderr: '', status: 0 }),
  });
  assert.equal(result.completeness, 'full');
  assert.equal(result.omitted, '');
});

test('F04: the drop analysis sees short blocks the SELECTION ignores', () => {
  const html = `<div><div class=main>${'long prose here. '.repeat(60)}</div><div class=note>a short but load-bearing caveat</div></div>`;
  const extraction = mainContent(html);
  assert.ok(extraction.dropped.length, 'a 30-character caveat box is exactly what gets lost');
  assert.equal(gradeCompleteness('x'.repeat(5000), extraction).completeness, 'partial');
});

// --- F24: authority is not assigned by the fetcher --------------------------------

test('F24: an auto-collected row is born secondary, not primary', () => {
  const dir = makeProject();
  const corpus = readCorpus(dir);
  collectOne(dir, 'https://random-blog.invalid/opinion', { corpus, runScrape: stub().runScrape });
  assert.equal(DEFAULT_SOURCE_TYPE, 'S');
  assert.equal(readCorpus(dir).evidence[0].type, 'S', 'P carries the design; reaching a page proves nothing about ownership');
});

test('F24: a plan entry may declare P, because a person wrote that URL down', () => {
  const dir = makeProject();
  writeJson(resolve(dir, PATHS.plan), { topic: 'x', depth: 'quick', queries: [], urls: [{ url: 'https://docs.example.com/limits', type: 'P', why: 'U-1' }] });
  runResearch(dir, { adapter: stub() });
  assert.equal(readCorpus(dir).evidence[0].type, 'P');
});

test('F24: a lookalike host does not score as the real one', () => {
  assert.ok(rankCandidate('https://notgithub.com.example.org/fake') < rankCandidate('https://docs.example.com/limits'));
  assert.ok(rankCandidate('https://docs.evil.invalid.example.org/x') < 8);
});

// --- F07: the brief must not claim a review that did not happen -------------------

test('F07: a drafted brief over a FAILING gate says so instead of announcing completion', () => {
  const dir = makePassingProject();
  corrupt(dir, PATHS.discovery, (t) => t.replace('CLOSED', 'OPEN'));
  const verdict = runPreflight(dir);
  renderBrief(dir, { verdict, force: true });

  const text = readText(resolve(dir, PATHS.brief));
  assert.match(text, /Gate: FAIL/);
  assert.doesNotMatch(text, /Phase 1 \(research\) is complete/);
});

test('F07: an unanswered TODO says the handoff is not approved', () => {
  const dir = makePassingProject();
  renderBrief(dir, { verdict: runPreflight(dir) });
  const text = readText(resolve(dir, PATHS.brief));
  assert.match(text, /Gate: PASS/);
  assert.match(text, /\*\*not reviewed\*\*/);
  assert.match(text, /\*\*not approved\*\*/);
  assert.match(text, /three different states/, 'valid, reviewed and approved are not the same claim');
});

// --- F27: a diagnostic must not print a destructive remedy ------------------------

test('F27: the line-ending remedy never deletes, and checks before it changes anything', () => {
  const remedy = lineEndingRemedy(['research/raw/a.md']);
  assert.doesNotMatch(remedy, /git rm/, 'uncommitted evidence is irreplaceable');
  assert.doesNotMatch(remedy, /checkout -- research\//);
  assert.match(remedy, /git status --porcelain/, 'the preservation check comes first');
  assert.match(remedy, /--renormalize research\/raw\/a\.md/, 'and the scope is the affected files');
});

test('F27: with no git metadata, the remedy refuses to suggest a command at all', () => {
  const remedy = lineEndingRemedy(['research/raw/a.md'], { isRepo: false });
  assert.match(remedy, /no git metadata/);
  assert.doesNotMatch(remedy, /git add/);
});

// --- F26: the secret scan, and what it honestly covers ----------------------------

/**
 * Synthetic credentials are ASSEMBLED, never written as literals.
 *
 * A test fixture containing a credential-shaped string is a credential-shaped string in
 * the repository, and `doctor`'s own scan reports it on every run. A scanner that is
 * permanently red about its own tests is one nobody reads - and the alternative, an
 * exclusion for the test directory, is a hole in the scan big enough to hide a real key
 * in. Splitting the string closes both.
 */
const fixtureKey = (prefix, body) => `${prefix}${body}`;

test('F26: a credential in a DOTFILE is found, not skipped', () => {
  const dir = makeProject();
  writeText(resolve(dir, '.env.local'), `FIRECRAWL_API_KEY=${fixtureKey('fc', '-0123456789abcdef0123')}\n`);
  const scan = scanForSecrets(dir);
  assert.equal(scan.hits.length, 1, '.env.local is exactly where a key hides');
  assert.equal(scan.hits[0].pattern, 'firecrawl-key');
});

test('F26: several credential shapes are recognised, and the coverage is stated', () => {
  const dir = makeProject();
  const aws = fixtureKey('AKIA', 'IOSFODNN7EXAMPLE');
  const gh = fixtureKey('ghp', '_0123456789abcdefghij0123456789abcd');
  writeText(resolve(dir, 'notes.md'), `${aws} and ${gh}\n`);
  const scan = scanForSecrets(dir);
  assert.deepEqual(scan.hits.map((h) => h.pattern).sort(), ['aws-access-key-id', 'github-token']);
  assert.match(scan.coverage, /credential patterns over \d+ text file/);
});

test('F26: the kit does not trip its own scan - the fixtures are assembled, not written', () => {
  const scan = scanForSecrets(process.cwd());
  assert.deepEqual(scan.hits, [], `a scanner that is always red about itself is one nobody reads: ${JSON.stringify(scan.hits)}`);
});

test('F26: a clean tree reports what was scanned rather than implying completeness', () => {
  const scan = scanForSecrets(makeProject());
  assert.equal(scan.hits.length, 0);
  assert.match(scan.coverage, /dotfiles included/);
});

// --- path precedence ---------------------------------------------------------------

test('PP: RESEARCH_KIT_HOME outranks the OS profile, in the module as well as the hook', () => {
  const home = path.join(tempDir('rk-home-'), 'research-kit');
  assert.equal(kitHome({ RESEARCH_KIT_HOME: home }), path.resolve(home));
  assert.equal(agentsHome({ RESEARCH_KIT_HOME: home }), path.dirname(path.resolve(home)));
  assert.notEqual(kitHome({ RESEARCH_KIT_HOME: home }), kitHome({}));
});

test('PP: an explicit argument beats the environment variable', () => {
  const explicit = path.join(tempDir('rk-explicit-'), 'c.json');
  assert.equal(configPath({ RESEARCH_KIT_CONFIG: '/from/env.json' }, explicit), path.resolve(explicit));
  assert.equal(configPath({ RESEARCH_KIT_CONFIG: '/from/env.json' }), '/from/env.json');
});

test('PP: with neither, the config sits under the RESEARCH_KIT_HOME agents root', () => {
  const home = path.join(tempDir('rk-home2-'), 'research-kit');
  assert.equal(configPath({ RESEARCH_KIT_HOME: home }), path.join(path.dirname(path.resolve(home)), 'research-kit.config.json'));
});

// --- F21: a refresh triggers claim review, it does not substitute silently ---------

test('F21: an unknown still citing a superseded row FAILS, naming the replacement', () => {
  const dir = makePassingProject();
  // A forced re-collection of the same URL, as `--refresh-days` produces.
  corrupt(dir, PATHS.evidence, (t) => `${t}| E-02 | 2026-12-01 | P | https://example.invalid/docs/limits | The free plan now allows 20 requests per minute. | research/raw/newer.md |\n`);
  writeText(resolve(dir, 'research/raw/newer.md'), '---\nurl: https://example.invalid/docs/limits\nretrieved: 2026-12-01\n---\n\nbody\n');

  const findings = runCheck('evidence-supersession', readCorpus(dir));
  const failed = findings.find((f) => f.severity === 'fail');
  assert.ok(failed, 'U-1 still rests on E-01, whose page has been re-read since');
  assert.equal(failed.superseded, 'E-01');
  assert.equal(failed.by, 'E-02');
  assert.match(failed.detail, /move the citation/);
});

test('F21: once the citation moves, the check passes and the old capture is kept', () => {
  const dir = makePassingProject();
  corrupt(dir, PATHS.evidence, (t) => `${t}| E-02 | 2026-12-01 | P | https://example.invalid/docs/limits | The free plan now allows 20 requests per minute. | research/raw/newer.md |\n`);
  writeText(resolve(dir, 'research/raw/newer.md'), '---\nurl: https://example.invalid/docs/limits\nretrieved: 2026-12-01\n---\n\nbody\n');
  corrupt(dir, PATHS.discovery, (t) => t.replace('E-01:', 'E-02:'));

  const findings = runCheck('evidence-supersession', readCorpus(dir));
  assert.equal(findings.some((f) => f.severity === 'fail'), false);
  assert.ok(findings.some((f) => f.rule === 'superseded-and-released'), 'the old row is history, not garbage');
  assert.ok(readCorpus(dir).evidence.some((r) => r.id === 'E-01'), 'and it is still there - evidence is irreplaceable');
});

test('F21: a corpus where nothing was re-collected says so and passes', () => {
  const findings = runCheck('evidence-supersession', readCorpus(makePassingProject()));
  assert.equal(findings.length, 1);
  assert.equal(findings[0].severity, 'pass');
});

test('F21: the stale warning names the fresher capture when one already exists', () => {
  const dir = makePassingProject(undefined, { date: '2020-01-01' });
  corrupt(dir, PATHS.evidence, (t) => `${t}| E-02 | 2026-12-01 | P | https://example.invalid/docs/limits | Restated. | research/raw/newer.md |\n`);
  writeText(resolve(dir, 'research/raw/newer.md'), '---\nurl: https://example.invalid/docs/limits\nretrieved: 2026-12-01\n---\n\nbody\n');

  const findings = runCheck('unknown-closure', readCorpus(dir), { maxAgeDays: 180 });
  const stale = findings.find((f) => f.rule === 'stale-evidence');
  assert.match(stale.detail, /E-02 is already a fresher capture/, '"go and collect" and "go and read" are different instructions');
});
