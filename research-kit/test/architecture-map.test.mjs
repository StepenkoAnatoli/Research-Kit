// docs/ARCHITECTURE.md is the CURRENT map. These check that it stays one.
//
// The commit gate already requires the map to be STAGED with a code change, and is
// deliberately modest about it: a whitespace edit satisfies the gate, which makes a stale
// map a deliberate act rather than mere forgetting. That is a prompt, not a proof.
//
// These are the proof, for the parts that can be proved. They check structure and
// coverage - every module has an owner, every count matches the filesystem - and NOT
// prose. A test that greps for a sentence pins the wording instead of the fact, and goes
// red when someone improves a paragraph.
//
// On 2026-09-20 the map was split: what exists now stayed, why it exists moved to
// docs/architecture-history/ and the ADRs. The split is what surfaced the third
// documentation drift in this repository - the map said "11 checks in the registry" on
// one line and "12 named checks" in the diagram twelve lines above it.

import { test, describe, assert, assertEqual, fs, path, KIT_ROOT } from './harness.mjs';
import { CHECKS } from '../lib/checks.mjs';

describe('architecture-map');

const REPO = path.resolve(KIT_ROOT, '..');
const MAP = path.join(REPO, 'docs', 'ARCHITECTURE.md');
const HISTORY = path.join(REPO, 'docs', 'architecture-history');
const map = () => fs.readFileSync(MAP, 'utf8');

/** Every .mjs under lib/, including the extracted release primitives. */
function libModules() {
  const lib = path.join(KIT_ROOT, 'lib');
  const top = fs.readdirSync(lib).filter((name) => name.endsWith('.mjs'));
  const release = fs.readdirSync(path.join(lib, 'release')).filter((name) => name.endsWith('.mjs'));
  return [...top, ...release.map((name) => `release/${name}`)];
}

test('every lib/ module has an ownership entry in the map', () => {
  // Acceptance criterion: the map covers what exists. A module with no row is a module
  // nobody has said who owns - which is how `config.mjs` went unlisted until someone
  // counted files against rows.
  const text = map();
  const missing = libModules().filter((name) => !text.includes(name));
  assertEqual(missing.length, 0,
    `these lib/ modules exist but the map never names them:\n  ${missing.join('\n  ')}`);
});

test('every bin/ entrypoint has an ownership entry in the map', () => {
  const text = map();
  const bin = fs.readdirSync(path.join(KIT_ROOT, 'bin'))
    .filter((name) => name.endsWith('.mjs') || name.endsWith('.py'));
  const missing = bin.filter((name) => !text.includes(name));
  assertEqual(missing.length, 0,
    `these bin/ entrypoints exist but the map never names them:\n  ${missing.join('\n  ')}`);
});

test('the map names no module that does not exist', () => {
  // The mirror, and the one that actually bit: two rows described modules that were never
  // written, unmarked, from the day the table was created until 2026-09-20.
  const text = map();
  const claimed = new Set([...text.matchAll(/`(?:lib\/)?([a-z0-9-]+\.mjs)`/g)].map((m) => m[1]));
  const onDisk = new Set([
    ...fs.readdirSync(path.join(KIT_ROOT, 'lib')),
    ...fs.readdirSync(path.join(KIT_ROOT, 'lib', 'release')),
    ...fs.readdirSync(path.join(KIT_ROOT, 'bin')),
    ...fs.readdirSync(path.join(KIT_ROOT, 'test')),
    ...fs.readdirSync(path.join(KIT_ROOT, 'hooks')),
    // The map legitimately names the example pack's scripts. Omitting this directory
    // made the first run of this test report build.mjs and run-example.mjs as phantoms -
    // the test was wrong, not the map.
    ...fs.readdirSync(path.join(KIT_ROOT, 'examples', 'release-evidence')),
  ]);
  const phantom = [...claimed].filter((name) => !onDisk.has(name));
  assertEqual(phantom.length, 0,
    `the map names these files, and none of them exist:\n  ${phantom.join('\n  ')}`);
});

test('the inventory counts match the filesystem', () => {
  // Every number in the inventory is checkable, so it is checked. The test count is
  // deliberately absent from the map - selftest.mjs owns that one, because it is the only
  // thing that can know it.
  const text = map();
  const inventory = text.slice(text.indexOf('## Current inventory'));
  const expect = (label, actual) => {
    const row = inventory.split('\n').find((line) => line.includes(label));
    assert(row, `the inventory has no row for ${label}`);
    const claimed = Number(row.match(/\*\*(\d+)\*\*/)?.[1]);
    assertEqual(claimed, actual, `the inventory says ${claimed} for "${label}"; the filesystem says ${actual}`);
  };
  expect('`lib/` modules', libModules().length);
  expect('`bin/` entrypoints', fs.readdirSync(path.join(KIT_ROOT, 'bin')).filter((n) => /\.(mjs|py)$/.test(n)).length);
  expect('`schemas/`', fs.readdirSync(path.join(KIT_ROOT, 'schemas')).filter((n) => n.endsWith('.json')).length);
  expect('vector packets', fs.readdirSync(path.join(KIT_ROOT, 'conformance')).filter((n) => n.endsWith('.json')).length);
  expect('checks in the registry', CHECKS.length);
});

test('the map does not repeat a test count, because it cannot keep one', () => {
  // A manually maintained total went stale twice: 326 when there were 565, then 565 when
  // there were 584. The map now defers to selftest.mjs, which is the only thing that can
  // know the number, and this stops anyone helpfully adding it back.
  const text = map();
  const counts = [...text.matchAll(/(\d{3,}) tests\b/g)].map((m) => m[0]);
  assertEqual(counts.length, 0,
    `the map states a test count again (${counts.join(', ')}). selftest.mjs owns that `
    + 'number and fails the run when research-kit/README.md disagrees with it; a second '
    + 'copy here is a third place for it to go stale.');
});

test('every declared seam is numbered once and has an owner', () => {
  // A seam with two owners, or none, is the thing the seam was drawn to prevent.
  const text = map();
  const seams = [...text.matchAll(/^(\d+)\. \*\*([A-Za-z0-9 -]+seam)\*\*/gm)];
  assert(seams.length >= 7, `expected the numbered seam list to survive the split, found ${seams.length}`);
  const numbers = seams.map((m) => Number(m[1]));
  assertEqual(JSON.stringify(numbers), JSON.stringify(numbers.map((_, i) => i + 1)),
    `the seam list is not numbered 1..n without gaps: ${numbers.join(', ')}`);
  const names = seams.map((m) => m[2]);
  assertEqual(new Set(names).size, names.length, `a seam is listed twice: ${names.join(', ')}`);
});

test('history was moved and linked, not deleted', () => {
  // The whole split rests on this. If the narratives were dropped rather than relocated,
  // the map got shorter by losing the thing that made this repository worth reading.
  const text = map();
  assert(text.includes('architecture-history'), 'the map does not link to the history directory');

  const index = path.join(HISTORY, 'README.md');
  assert(fs.existsSync(index), 'docs/architecture-history/README.md is missing');

  // Every file the index lists must exist, and every file present must be listed.
  const listed = [...fs.readFileSync(index, 'utf8').matchAll(/\((\d{4}-\d{2}-\d{2}-[a-z-]+\.md)\)/g)].map((m) => m[1]);
  const present = fs.readdirSync(HISTORY).filter((name) => /^\d{4}-\d{2}-\d{2}-/.test(name));
  assertEqual(listed.sort().join(','), present.sort().join(','),
    `the history index and the directory disagree.\n  index: ${listed.join(', ')}\n  disk:  ${present.join(', ')}`);

  // The specific evidence that moved. Losing a benchmark is easy and silent.
  const narratives = fs.readFileSync(path.join(HISTORY, '2026-09-20-shape-and-defect-narratives.md'), 'utf8');
  for (const marker of ['10,005 arguments', 'quadratic, no output', 'O_EXCL', 'core.autocrlf', 'unreadable']) {
    assert(narratives.includes(marker), `the moved history no longer contains "${marker}"`);
  }
});

test('the map does not contradict itself about exit codes', () => {
  // This is the test that should have existed already.
  //
  // The map stated the corrected invariant - "usage errors return 2 from every
  // subcommand" - in one section while a paragraph two hundred lines away still said
  // "a usage error exits 2 for validate and conform but 4 for fi-validate; no test pins
  // either". Both claims were in the current map at once, and the second was doubly
  // false: the code IS 2 everywhere, and a test DOES pin it.
  //
  // Finding it took an external reader. A document is not trustworthy because someone
  // read it carefully once; it is trustworthy when disagreeing with the code is a test
  // failure. So every exit-code claim the map makes is checked against the CLI.
  const text = map();
  const cli = fs.readFileSync(path.join(KIT_ROOT, 'bin', 'researcher-release.mjs'), 'utf8');

  // What the CLI actually does with a usage error, read from its source.
  const usageCodes = new Set(
    cli.split('\n')
      .filter((line) => /console\.error\(usage\(\)\)/.test(line))
      .map((line) => line.match(/return\s+(\d)/)?.[1])
      .filter(Boolean),
  );
  assertEqual(usageCodes.size, 1,
    `the CLI returns more than one code for a usage error (${[...usageCodes].join(', ')}), `
    + 'so no single claim in the map can be true');
  const usage = [...usageCodes][0];

  // Any sentence in the map that talks about a usage error and names a digit must agree.
  //
  // EVERY standalone digit in such a sentence is checked, not only one following an
  // "exits"/"returns" verb. The first version of this test looked only after those verbs
  // and so missed the exact sentence it was written for:
  //
  //   "a usage error exits 2 for validate and conform but 4 for fi-validate"
  //
  // It captured the 2, found it correct, and passed - while the 4 sat two words later. I
  // verified that by reintroducing the sentence and watching the test stay green, which
  // is the only reason I know it was broken.
  // Only the CLAUSE about the usage error is read, not the whole line. A line that
  // mentions a usage error usually also lists the status codes beside it - 0, 1, 2, 3,
  // and 4 for an unrecognised status - and reading the whole line flagged every one of
  // them. That was this test's second false start: too narrow first, then too wide.
  const clauseAbout = (line) => {
    const start = line.search(/usage error/i);
    if (start < 0) return null;
    const rest = line.slice(start);
    const end = rest.search(/[.;]\s|,\s+(?:and|printing)\b/);
    return end < 0 ? rest : rest.slice(0, end);
  };

  const wrong = text.split('\n').filter((line) => {
    const clause = clauseAbout(line);
    if (!clause) return false;
    const claimed = [...clause.matchAll(/(?<![\w.`])`?(\d)`?(?![\w.`])/g)].map((m) => m[1]);
    return claimed.some((code) => code !== usage);
  });
  assertEqual(wrong.length, 0,
    `the map claims a usage-error exit code other than ${usage}, which is what the CLI `
    + `returns:\n  ${wrong.map((l) => l.slice(0, 160)).join('\n  ')}`);
});

test('the module table states ownership, not chronology', () => {
  // "Ported 2026-09-20", "Extracted 2026-09-20", "decomposed the same day" - twelve rows
  // opened with when they were written rather than what they own. That is the adopted
  // policy's boundary: the map says what a module owns NOW, the ADR in the third column
  // says who decided it, and the date belongs to the commit that made it.
  const text = map();
  const rows = text.split('\n').filter((line) => /^\| `/.test(line));
  const dated = rows.filter((line) => /\*\*(Ported|Extracted|Added|Rewritten|Split) \d{4}-\d{2}-\d{2}/.test(line));
  assertEqual(dated.length, 0,
    'these rows open with a date instead of an owner. The governing ADR belongs in the '
    + `third column; the date belongs to git:\n  ${dated.map((l) => l.slice(0, 110)).join('\n  ')}`);
});

test('the scaffold template stays a scaffold', () => {
  // Acceptance criterion: the template is a starting point for somebody else's project.
  // Repository-specific history leaking into it would ship this project's defect stories
  // to every project the kit ever creates.
  const template = path.join(KIT_ROOT, 'template', 'docs', 'ARCHITECTURE.md');
  const text = fs.readFileSync(template, 'utf8');
  assert(text.length < 6000, `the template architecture doc is ${text.length} bytes; it is a scaffold, not a map`);
  const leaked = ['ADR-0029', 'release-validator', 'conformance_common', 'firecrawl', '10,005']
    .filter((term) => text.includes(term));
  assertEqual(leaked.length, 0,
    `this repository's specifics leaked into the scaffold template: ${leaked.join(', ')}`);
});
