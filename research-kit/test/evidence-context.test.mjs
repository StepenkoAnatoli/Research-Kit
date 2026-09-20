// evidence-context answers, and must never decide.
//
// The whole protocol rests on a person judging whether evidence closes an unknown. A
// command that gathers that evidence is a convenience; a command that hints at the
// verdict is a way to launder a machine's guess into the corpus. So the tests here are
// split in two: that it gathers the right things, and that it changes nothing and
// concludes nothing.

import { spawnSync } from 'node:child_process';
import { test, describe, assert, assertEqual, fs, path, KIT_ROOT, tempDir, cleanup } from './harness.mjs';
import { readCorpus } from '../lib/corpus.mjs';
import { evidenceContext, renderContext, excerptFor } from '../lib/evidence-context.mjs';

describe('evidence-context');

const REPO = path.resolve(KIT_ROOT, '..');
const CLI = path.join(KIT_ROOT, 'bin', 'evidence-context.mjs');

/** A small synthetic corpus, so these tests do not depend on this repo's own research. */
function fixture() {
  const root = tempDir('research-kit-evidence-context-');
  const raw = path.join(root, 'research', 'raw');
  fs.mkdirSync(raw, { recursive: true });

  fs.writeFileSync(path.join(raw, 'page.md'),
    '---\nurl: https://example.invalid/limits\n---\n\n'
    + '# Acme\n\nTrusted by 10,000 developers. Sign in to get started.\n\n'
    + '## Rate limits\n\nThe free plan allows 10 requests per minute per team. '
    + 'Requests beyond that return HTTP 429.\n', 'utf8');

  fs.writeFileSync(path.join(root, 'research', 'DISCOVERY.md'),
    '# Discovery\n\n## Build intent\n\nA thing.\n\n## Unknowns\n\n'
    + '| ID | Unknown | Why it blocks | Status | Evidence |\n|---|---|---|---|---|\n'
    + '| U-1 | What is the rate limit? | Sets the budget | CLOSED | E-01 |\n'
    + '| U-2 | Something unproven | Blocks a default | OPEN |  |\n', 'utf8');

  fs.writeFileSync(path.join(root, 'research', 'EVIDENCE.md'),
    '# Evidence\n\n| ID | Retrieved | Type | URL | Finding | Raw |\n|---|---|---|---|---|---|\n'
    + '| E-01 | 2026-09-01 | P | https://example.invalid/limits | Free plan: 10 requests per minute per team. | research/raw/page.md |\n',
    'utf8');

  fs.writeFileSync(path.join(root, 'research', 'SOURCES.md'),
    '# Sources\n\n| URL | Type | Title | Retrieved | Used for |\n|---|---|---|---|---|\n'
    + '| https://example.invalid/limits | P | Acme Rate Limits | 2026-09-01 | U-1 |\n', 'utf8');

  return root;
}

test('it gathers the unknown, its rows, the source title and a bounded excerpt', () => {
  const root = fixture();
  try {
    const context = evidenceContext(readCorpus(root), 'U-1');
    assertEqual(context.ok, true, JSON.stringify(context));
    assertEqual(context.unknown.id, 'U-1');
    assertEqual(context.cited.length, 1);

    const row = context.cited[0];
    assertEqual(row.id, 'E-01');
    assertEqual(row.typeLabel, 'Primary', 'a bare P helps nobody reading a report');
    assertEqual(row.title, 'Acme Rate Limits', 'the title comes from SOURCES.md, not the evidence row');
    assertEqual(row.retrieved, '2026-09-01');
    assert(row.excerpt.includes('10 requests per minute'), `excerpt missed the claim: ${row.excerpt}`);
    assert(!row.excerpt.includes('Sign in to get started'), 'the excerpt quoted page chrome');
  } finally { cleanup(root); }
});

test('the excerpt is bounded, so the command cannot print the page', () => {
  const body = `${'padding. '.repeat(200)}\n\nThe free plan allows 10 requests per minute.`;
  const excerpt = excerptFor(body, 'free plan requests per minute', { limit: 120 });
  assert(excerpt.length <= 121, `excerpt is ${excerpt.length} chars, which is not bounded`);
});

test('a lowercase or mistyped id is handled, not thrown', () => {
  const root = fixture();
  try {
    const corpus = readCorpus(root);
    assertEqual(evidenceContext(corpus, 'u-1').ok, true, 'ids should not be case-sensitive to a person');
    const missing = evidenceContext(corpus, 'U-99');
    assertEqual(missing.ok, false);
    assert(missing.known.includes('U-1'), 'a wrong id should say which ids exist');
  } finally { cleanup(root); }
});

test('it reports gaps rather than filling them', () => {
  const root = fixture();
  try {
    // U-2 cites nothing. That is a real state of a real corpus, and the answer is to say
    // so - not to go looking for a row that might fit.
    const context = evidenceContext(readCorpus(root), 'U-2');
    assertEqual(context.ok, true);
    assertEqual(context.cited.length, 0);
    assert(context.gaps.some((g) => /cites no evidence row/.test(g)), JSON.stringify(context.gaps));
  } finally { cleanup(root); }
});

test('it offers no verdict about whether the unknown is closed', () => {
  // The line this guards is the one that matters. Gathering evidence for a human is
  // useful; implying the conclusion is how a machine's guess ends up in the corpus
  // wearing a person's authority.
  const root = fixture();
  try {
    const text = renderContext(evidenceContext(readCorpus(root), 'U-1'));
    const verdicts = [
      /\bthis (unknown )?(is|looks) (closed|answered|sufficient|proven)\b/i,
      /\bevidence (is )?(sufficient|enough|adequate|supports)\b/i,
      /\b(recommend|suggest)s? (closing|marking)\b/i,
      /\bsafe to (close|build|proceed)\b/i,
    ];
    for (const verdict of verdicts) {
      assert(!verdict.test(text), `the rendering draws a conclusion it has no business drawing: ${verdict}`);
    }
    assert(/your call/i.test(text), 'the rendering should say plainly that the judgement is the reader\'s');
  } finally { cleanup(root); }
});

test('an extractor suggestion is labelled a suggestion, and never replaces the row', () => {
  const root = fixture();
  try {
    const before = fs.readFileSync(path.join(root, 'research', 'EVIDENCE.md'), 'utf8');
    const context = evidenceContext(readCorpus(root), 'U-1');
    const text = renderContext(context);
    if (context.cited[0].extractor) {
      assert(/Suggestion only/.test(text), 'an extractor pick was shown without saying it is only a suggestion');
    }
    assertEqual(fs.readFileSync(path.join(root, 'research', 'EVIDENCE.md'), 'utf8'), before,
      'reading an unknown modified the evidence table');
  } finally { cleanup(root); }
});

test('the CLI is read-only and its exit codes distinguish the cases', () => {
  const root = fixture();
  try {
    const before = new Map();
    for (const rel of ['research/DISCOVERY.md', 'research/EVIDENCE.md', 'research/SOURCES.md', 'research/raw/page.md']) {
      before.set(rel, fs.readFileSync(path.join(root, rel), 'utf8'));
    }

    const run = (args) => spawnSync(process.execPath, [CLI, ...args], {
      cwd: root, encoding: 'utf8', timeout: 60_000, windowsHide: true,
    });

    assertEqual(run(['--unknown', 'U-1']).status, 0, 'a known unknown should exit 0');
    assertEqual(run(['--unknown', 'U-99']).status, 1, 'an unknown that is not there should exit 1');
    assertEqual(run([]).status, 2, 'no argument should exit 2, not 0 with empty output');
    assertEqual(run(['--help']).status, 0);

    for (const [rel, content] of before) {
      assertEqual(fs.readFileSync(path.join(root, rel), 'utf8'), content, `${rel} was modified by a read-only command`);
    }
  } finally { cleanup(root); }
});

test('--json is byte-deterministic across runs', () => {
  // The report is meant to be pasteable into a review and diffable between sessions.
  const root = fixture();
  try {
    const run = () => spawnSync(process.execPath, [CLI, 'U-1', '--json'], {
      cwd: root, encoding: 'utf8', timeout: 60_000, windowsHide: true,
    }).stdout;
    assertEqual(run(), run(), 'two runs over one corpus produced different bytes');
  } finally { cleanup(root); }
});

test('it reads no environment variable, so it cannot use a credential', () => {
  // The same property every validator in this kit has. Asserted on the source because a
  // runtime check can only prove the paths it happened to walk.
  for (const file of ['lib/evidence-context.mjs', 'bin/evidence-context.mjs']) {
    const source = fs.readFileSync(path.join(KIT_ROOT, file), 'utf8');
    assert(!/process\.env/.test(source), `${file} reads the environment; it must not be able to see a key`);
    assert(!/fetch\(|https?\.request|spawn/.test(source), `${file} reaches the network or spawns; it is meant to read the corpus`);
  }
});

test('this repository answers for its own unknowns', () => {
  // The fixture proves the shape; this proves it works on a real corpus, which is where
  // the awkward cases live - superseded rows, multi-row unknowns, long findings.
  const corpus = readCorpus(REPO);
  if (!corpus.discovery.present || !corpus.unknowns.length) return;   // a scaffolded copy
  for (const unknown of corpus.unknowns) {
    const context = evidenceContext(corpus, unknown.id);
    assertEqual(context.ok, true, `${unknown.id} could not be explained`);
    assert(typeof renderContext(context) === 'string');
  }
});
