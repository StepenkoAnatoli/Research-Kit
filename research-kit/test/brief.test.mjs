// The brief's shape has one owner (ADR-0014): the renderer writes its headings FROM the
// definition, and the audit reads the judged sections THROUGH it.

import { test, describe, assert, makePassingProject, corrupt, fs } from './harness.mjs';
import { PATHS, resolve, readText, writeText } from '../lib/core.mjs';
import {
  BRIEF_SECTIONS, JUDGED_SECTIONS, BRIEF_FILE_MARKER, TODO_MARK,
  briefState, briefSection, judgedSection, renderBrief,
} from '../lib/brief.mjs';

describe('brief');

test('six sections, two of them judged', () => {
  assert.equal(BRIEF_SECTIONS.length, 6);
  assert.deepEqual(JUDGED_SECTIONS, ['contradictions', 'decision']);
});

test('the scaffold ships the marker, and the marker is what says "still the scaffold"', () => {
  const dir = makePassingProject();
  const text = readText(resolve(dir, PATHS.brief));
  assert.ok(text.includes(BRIEF_FILE_MARKER));
  assert.equal(briefState(text), 'template');
});

test('the marker survives the substitution pass, so no sentence of English is load-bearing', () => {
  const dir = makePassingProject();
  assert.match(readText(resolve(dir, PATHS.brief)), /research-kit:brief=scaffold/);
});

test('a drafted brief with TODOs reads as draft; one with them answered reads as authored', () => {
  const dir = makePassingProject();
  renderBrief(dir);
  const drafted = readText(resolve(dir, PATHS.brief));
  assert.equal(briefState(drafted), 'draft');

  const answered = drafted
    .split(TODO_MARK).join('Resolved:')
    .replace(/Resolved: - what to build first/, 'Build the collector first;');
  writeText(resolve(dir, PATHS.brief), answered);
  assert.equal(briefState(readText(resolve(dir, PATHS.brief))), 'authored');
});

test('a LEGACY brief - the shape without the marker - refuses loudly rather than guessing', () => {
  const dir = makePassingProject();
  writeText(resolve(dir, PATHS.brief), '# Brief - something\n\n## Intent\n\nSomebody wrote this by hand.\n\n## Decision\n\nBuild it.\n');
  assert.equal(briefState(readText(resolve(dir, PATHS.brief))), 'legacy');

  const refused = renderBrief(dir);
  assert.equal(refused.written, false);
  assert.match(refused.reason, /LEGACY/);
  assert.match(readText(resolve(dir, PATHS.brief)), /by hand/, 'the file is untouched');

  assert.equal(renderBrief(dir, { force: true }).written, true, '--force is the deliberate act');
});

test('drafting over a draft refuses without --force, so judgements are preserved', () => {
  const dir = makePassingProject();
  renderBrief(dir);
  writeText(resolve(dir, PATHS.brief), readText(resolve(dir, PATHS.brief)).replace(TODO_MARK, 'My own judgement:'));

  const refused = renderBrief(dir);
  assert.equal(refused.written, false);
  assert.match(readText(resolve(dir, PATHS.brief)), /My own judgement/);
});

test('the renderer writes its headings FROM the section definition', () => {
  const dir = makePassingProject();
  renderBrief(dir);
  const text = readText(resolve(dir, PATHS.brief));
  for (const section of BRIEF_SECTIONS) {
    assert.match(text, new RegExp(`^## ${section.heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'm'), `missing heading: ${section.heading}`);
  }
});

test('the verified table carries the claim, the source and its type', () => {
  const dir = makePassingProject();
  renderBrief(dir);
  const verified = briefSection(readText(resolve(dir, PATHS.brief)), 'verified');
  assert.match(verified, /10 requests per minute/);
  assert.match(verified, /E-01/);
  assert.match(verified, /example\.invalid/);
  assert.match(verified, /\| P \|/);
});

test('a claim resting on a partial capture says so in the brief', () => {
  const dir = makePassingProject();
  corrupt(dir, `research/raw/${fs.readdirSync(resolve(dir, PATHS.raw)).find((n) => n.endsWith('.md'))}`,
    (text) => text.replace('completeness: full', 'completeness: partial\nomitted: chunk 0 of 3'));
  renderBrief(dir, { force: true });
  assert.match(briefSection(readText(resolve(dir, PATHS.brief)), 'verified'), /partial capture/);
});

test('known unknowns are listed with their day-one steps, or the section says none', () => {
  const dir = makePassingProject();
  renderBrief(dir);
  assert.match(briefSection(readText(resolve(dir, PATHS.brief)), 'unknowns'), /None\./);

  corrupt(dir, PATHS.discovery, (text) => text.replace('| CLOSED |', '| KNOWN-UNKNOWN |').replace(/E-01:[^|]*/, 'day one: log in and read the billing page '));
  renderBrief(dir, { force: true });
  const unknowns = briefSection(readText(resolve(dir, PATHS.brief)), 'unknowns');
  assert.match(unknowns, /U-1/);
  assert.match(unknowns, /Day-one verification: day one: log in/);
});

test('judgedSection is the reader the audit consumes instead of a regex of its own', () => {
  const dir = makePassingProject();
  renderBrief(dir);
  const text = readText(resolve(dir, PATHS.brief));
  assert.equal(judgedSection(text, 'decision').answered, false);
  assert.equal(judgedSection(text, 'intent'), null, 'only the judged sections are judged');

  writeText(resolve(dir, PATHS.brief), text.replace(/## Decision\n\n\*\*TODO\*\*[\s\S]*?\n\n## Next steps/, '## Decision\n\nBuild the collector first.\n\n## Next steps'));
  assert.equal(judgedSection(readText(resolve(dir, PATHS.brief)), 'decision').answered, true);
});
