// The audit family and its container (ADR-0019). A derived artifact: it reads the
// corpus and never writes back to it, and it renders only when the gate passes.
//
// The archive's format is proved offline - CRC-32 against its published vectors, and
// every entry read back out of the central directory by a reader that stands in for the
// operator's unzip tool.

import zlib from 'node:zlib';
import { test, describe, assert, makePassingProject, corrupt, fs } from './harness.mjs';
import { PATHS, resolve, readText, readJson, writeText } from '../lib/core.mjs';
import { writeAudit, listVersions, resolveVersion, nextVersion, zipAudit, fingerprintOf, readManifest } from '../lib/audit.mjs';
import { crc32, buildZip, entryName } from '../lib/archive.mjs';
import { readCorpus } from '../lib/corpus.mjs';

describe('audit');

// --- the container -----------------------------------------------------------------

test('crc32 matches its published vectors', () => {
  assert.equal(crc32(Buffer.from('')), 0);
  assert.equal(crc32(Buffer.from('123456789')), 0xcbf43926);
  assert.equal(crc32(Buffer.from('The quick brown fox jumps over the lazy dog')), 0x414fa339);
});

test('entryName refuses anything that could unpack outside the folder', () => {
  assert.equal(entryName('a/b.md'), 'a/b.md');
  assert.equal(entryName('a\\b.md'), 'a/b.md');
  assert.throws(() => entryName('/etc/passwd'), /not a relative path/);
  assert.throws(() => entryName('C:/Windows/x'), /not a relative path/);
  assert.throws(() => entryName('../escape.md'), /climbs out/);
  assert.throws(() => entryName(''), /no name/);
});

test('an archive with no entries is refused, not written empty', () => {
  assert.throws(() => buildZip([]), /no entries/);
});

/** A minimal reader, standing in for the operator's unzip tool. */
function readZip(bytes) {
  const end = bytes.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  assert.notEqual(end, -1, 'no end-of-central-directory record');
  const count = bytes.readUInt16LE(end + 10);
  let at = bytes.readUInt32LE(end + 16);
  const out = [];
  for (let i = 0; i < count; i += 1) {
    assert.equal(bytes.readUInt32LE(at), 0x02014b50, 'central directory signature');
    const method = bytes.readUInt16LE(at + 10);
    const sum = bytes.readUInt32LE(at + 16);
    const compressed = bytes.readUInt32LE(at + 20);
    const uncompressed = bytes.readUInt32LE(at + 24);
    const nameLen = bytes.readUInt16LE(at + 28);
    const offset = bytes.readUInt32LE(at + 42);
    const name = bytes.slice(at + 46, at + 46 + nameLen).toString('utf8');

    const localName = bytes.readUInt16LE(offset + 26);
    const localExtra = bytes.readUInt16LE(offset + 28);
    const start = offset + 30 + localName + localExtra;
    const raw = bytes.slice(start, start + compressed);
    const data = method === 8 ? zlib.inflateRawSync(raw) : raw;

    assert.equal(data.length, uncompressed, `${name}: size disagrees with the directory`);
    assert.equal(crc32(data), sum, `${name}: CRC disagrees with the directory`);
    out.push({ name, text: data.toString('utf8'), method });
    at += 46 + nameLen + bytes.readUInt16LE(at + 30) + bytes.readUInt16LE(at + 32);
  }
  return out;
}

test('every entry reads back out of the central directory intact', () => {
  const entries = [
    { name: 'one.md', data: `# One\n${'deflate shrinks markdown by about seventy percent. '.repeat(50)}` },
    { name: 'two.md', data: 'x' },
  ];
  const read = readZip(buildZip(entries));
  assert.deepEqual(read.map((e) => e.name), ['one.md', 'two.md']);
  assert.equal(read[0].text, entries[0].data);
  assert.equal(read[1].text, 'x');
  assert.equal(read[0].method, 8, 'a compressible payload deflates');
  assert.equal(read[1].method, 0, 'a payload deflate would only grow is stored');
});

test('two runs produce byte-identical archives, so re-zipping is free', () => {
  const entries = [{ name: 'a.md', data: 'same bytes every time' }];
  assert.ok(buildZip(entries).equals(buildZip(entries)));
});

// --- the audit ---------------------------------------------------------------------

test('an audit renders only when the gate passes', () => {
  const dir = makePassingProject();
  corrupt(dir, PATHS.discovery, (text) => text.replace('CLOSED', 'OPEN'));
  const refused = writeAudit(dir);
  assert.equal(refused.written, false);
  assert.match(refused.reason, /the gate fails/);
  assert.equal(fs.existsSync(resolve(dir, PATHS.audits)), false);
});

test('a pass renders the main audit plus one file per COVERED/GAP subtopic', () => {
  const dir = makePassingProject();
  const result = writeAudit(dir);
  assert.equal(result.written, true, result.reason);
  assert.equal(result.version, '0.1');

  const covered = readCorpus(dir).subtopics.filter((s) => s.status === 'COVERED' || s.status === 'GAP');
  assert.equal(result.subtopics.length, covered.length);
  assert.equal(result.subtopics.length, 5, 'four COVERED plus no GAP in this fixture');

  const main = readText(resolve(dir, result.main));
  assert.match(main, /## Blocking unknowns/);
  assert.match(main, /## Evidence/);
  assert.match(main, /firecrawl-cli/, 'the transport of each capture is in the snapshot');
  assert.match(main, /Gate:\*\* PASS/);
});

test('the audit is DERIVED: it never writes back into the corpus', () => {
  const dir = makePassingProject();
  const before = {
    discovery: readText(resolve(dir, PATHS.discovery)),
    evidence: readText(resolve(dir, PATHS.evidence)),
    ledger: readText(resolve(dir, PATHS.ledger)),
  };
  writeAudit(dir);
  assert.equal(readText(resolve(dir, PATHS.discovery)), before.discovery);
  assert.equal(readText(resolve(dir, PATHS.evidence)), before.evidence);
  assert.equal(readText(resolve(dir, PATHS.ledger)), before.ledger);
});

test('an unchanged corpus keeps its version; a changed one earns the next', () => {
  const dir = makePassingProject();
  writeAudit(dir);

  const again = writeAudit(dir);
  assert.equal(again.written, false);
  assert.match(again.reason, /unchanged since v0\.1/);

  corrupt(dir, PATHS.evidence, (text) => text.replace('The free plan allows', 'Rewritten: the free plan allows'));
  const bumped = writeAudit(dir);
  assert.equal(bumped.version, '0.2');
});

test('the fingerprint tracks what an audit says, not when it was written', () => {
  const dir = makePassingProject();
  const one = fingerprintOf(readCorpus(dir));
  assert.equal(one, fingerprintOf(readCorpus(dir)));
  corrupt(dir, PATHS.discovery, (text) => text.replace('CLOSED', 'KNOWN-UNKNOWN'));
  assert.notEqual(one, fingerprintOf(readCorpus(dir)));
});

test('listVersions and resolveVersion are THE readers, with one ordering', () => {
  const dir = makePassingProject();
  writeAudit(dir);
  corrupt(dir, PATHS.evidence, (text) => text.replace('The free plan', 'Revised: the free plan'));
  writeAudit(dir);

  const { known, topics } = listVersions(dir);
  assert.deepEqual(known, ['fixture-topic']);
  assert.deepEqual(topics[0].versions, ['0.1', '0.2'], 'versions sort numerically, not lexically');
  assert.equal(topics[0].latest, '0.2');

  assert.equal(resolveVersion(dir, 'fixture-topic').version, '0.2', 'no version named means the latest');
  assert.equal(resolveVersion(dir, 'fixture-topic', '0.1').version, '0.1');
  assert.equal(resolveVersion(dir, 'nope'), null);
});

test('versions sort numerically: v0.10 comes after v0.9', () => {
  const dir = makePassingProject();
  writeAudit(dir);
  const manifest = readManifest(dir);
  const record = manifest.topics['fixture-topic'];
  for (const version of ['0.9', '0.10']) {
    record.versions[version] = { date: '2026-09-17', fingerprint: version, main: `${PATHS.audits}/x-v${version}.md`, subtopics: [] };
  }
  writeText(resolve(dir, `${PATHS.audits}/index.json`), `${JSON.stringify(manifest, null, 2)}\n`);
  assert.deepEqual(listVersions(dir).topics[0].versions, ['0.1', '0.9', '0.10']);
});

// --- the bundle --------------------------------------------------------------------

test('the bundle holds the latest main audit and its subtopics, and is named for them', () => {
  const dir = makePassingProject();
  const rendered = writeAudit(dir);
  const bundle = zipAudit(dir);

  assert.equal(bundle.ok, true, bundle.reason);
  assert.match(bundle.file, /research\/audits\/fixture-topic-v0\.1-\d{4}-\d{2}-\d{2}\.zip$/);
  assert.equal(bundle.count, rendered.subtopics.length + 1);

  const read = readZip(fs.readFileSync(resolve(dir, bundle.file)));
  assert.equal(read.length, rendered.subtopics.length + 1);
  assert.ok(read.some((e) => e.text.includes('## Blocking unknowns')));
});

test('the file list comes from the manifest, never a directory listing', () => {
  const dir = makePassingProject();
  writeAudit(dir);
  corrupt(dir, PATHS.evidence, (text) => text.replace('The free plan', 'Revised: the free plan'));
  const second = writeAudit(dir);

  const bundle = zipAudit(dir);
  assert.equal(bundle.version, '0.2');
  assert.equal(bundle.count, second.subtopics.length + 1,
    'v0.1 is still sitting beside v0.2 on disk and must not be swept in');
});

test('a manifest naming a file that is not on disk is REFUSED, not bundled short', () => {
  const dir = makePassingProject();
  const rendered = writeAudit(dir);
  fs.rmSync(resolve(dir, rendered.subtopics[0]));

  const bundle = zipAudit(dir);
  assert.equal(bundle.ok, false);
  assert.match(bundle.reason, /refusing to bundle short/);
  assert.match(bundle.fix, /bin\/audit\.mjs/);
});

test('no audits at all: refused, with the command that makes one', () => {
  const bundle = zipAudit(makePassingProject());
  assert.equal(bundle.ok, false);
  assert.equal(bundle.exit, 1);
  assert.match(bundle.fix, /bin\/audit\.mjs/);
});

test('several topics and none named: refused, every topic listed, --topic offered', () => {
  const dir = makePassingProject();
  writeAudit(dir);
  const manifest = readManifest(dir);
  manifest.topics['another-topic'] = { topic: 'Another', latest: '0.1', versions: { '0.1': { date: '2026-09-17', fingerprint: 'x', main: 'research/audits/a.md', subtopics: [] } } };
  writeText(resolve(dir, `${PATHS.audits}/index.json`), `${JSON.stringify(manifest, null, 2)}\n`);

  const bundle = zipAudit(dir);
  assert.equal(bundle.ok, false);
  assert.equal(bundle.exit, 2, 'a usage question, not a failure');
  assert.deepEqual(bundle.known.sort(), ['another-topic', 'fixture-topic']);
  assert.match(bundle.fix, /--topic/);
});

test('an exact --topic wins; only a non-exact input falls back to prefix matching', () => {
  const dir = makePassingProject();
  writeAudit(dir);
  const manifest = readManifest(dir);
  manifest.topics['fixture-topic-legacy'] = { topic: 'Legacy', latest: '0.1', versions: { '0.1': { date: '2026-09-17', fingerprint: 'y', main: manifest.topics['fixture-topic'].versions['0.1'].main, subtopics: [] } } };
  writeText(resolve(dir, `${PATHS.audits}/index.json`), `${JSON.stringify(manifest, null, 2)}\n`);

  const exact = zipAudit(dir, { topic: 'fixture-topic' });
  assert.equal(exact.ok, true, 'an exact name must not come back "ambiguous" because a longer slug extends it');
  assert.equal(exact.slug, 'fixture-topic');

  const ambiguous = zipAudit(dir, { topic: 'fixture-' });
  assert.equal(ambiguous.ok, false);
  assert.equal(ambiguous.exit, 2, 'more than one prefix match is a question, not a guess');
});

test('a named topic that does not exist is refused with the known topics listed', () => {
  const dir = makePassingProject();
  writeAudit(dir);
  const bundle = zipAudit(dir, { topic: 'nonexistent' });
  assert.equal(bundle.ok, false);
  assert.equal(bundle.exit, 1);
  assert.deepEqual(bundle.known, ['fixture-topic']);
});

test('the bundle renders nothing and bumps no version', () => {
  const dir = makePassingProject();
  writeAudit(dir);
  const before = readJson(resolve(dir, `${PATHS.audits}/index.json`));
  const markdown = fs.readdirSync(resolve(dir, PATHS.audits)).filter((n) => n.endsWith('.md')).sort();

  zipAudit(dir);

  assert.deepEqual(readJson(resolve(dir, `${PATHS.audits}/index.json`)), before, 'the manifest is not written to');
  assert.deepEqual(fs.readdirSync(resolve(dir, PATHS.audits)).filter((n) => n.endsWith('.md')).sort(), markdown, 'no .md file is created');
});

test('no subtopics is not an error: the archive holds the one main file', () => {
  const dir = makePassingProject();
  corrupt(dir, PATHS.map, (text) => text.replace(/COVERED/g, 'DISMISSED').replace(/\| U-1 \|/g, '| out of scope for this fixture |'));
  const rendered = writeAudit(dir);
  assert.equal(rendered.subtopics.length, 0);

  const bundle = zipAudit(dir);
  assert.equal(bundle.ok, true);
  assert.equal(bundle.count, 1);
});
