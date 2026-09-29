// ADR-0090: the corpus exported as WARC 1.1, a copy for archive tools.
// Research: docs/decisions/2026-09-28-warc-export.

import { test, describe, assert, makePassingProject, tempDir, corrupt } from './harness.mjs';
import { PATHS, sha256 } from '../lib/core.mjs';
import { readLedger } from '../lib/corpus.mjs';
import { exportWarc, readWarc } from '../lib/warc.mjs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

describe('warc');

const MANDATORY = ['WARC-Record-ID', 'Content-Length', 'WARC-Date', 'WARC-Type'];

test('a passing corpus exports warcinfo, then a resource and a metadata record per capture', () => {
  const dir = makePassingProject();
  const { bytes, records, skipped } = exportWarc(dir);
  assert.deepEqual(skipped, []);
  const read = readWarc(bytes);
  assert.deepEqual(read.map((r) => r.headers['WARC-Type']), ['warcinfo', 'resource', 'metadata']);
  for (const r of read) {
    assert.equal(r.version, 'WARC/1.1');
    for (const name of MANDATORY) assert.ok(r.headers[name], `${r.headers['WARC-Type']} lacks ${name}`);
    assert.equal(Number(r.headers['Content-Length']), r.block.length);
    assert.equal(r.headers['WARC-Block-Digest'], `sha256:${sha256(r.block)}`);
    assert.match(r.headers['WARC-Record-ID'], /^<urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-8[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}>$/);
  }

  const scrape = readLedger(dir).entries.find((e) => e.op === 'scrape');
  const [info, resource, meta] = read;
  assert.match(info.block.toString('utf8'), /^software: research-kit\r\n/);
  assert.equal(resource.headers['WARC-Target-URI'], scrape.url);
  assert.equal(resource.headers['WARC-Date'], scrape.at);
  assert.equal(resource.headers['Content-Type'], 'text/markdown; charset=utf-8');
  assert.equal(resource.headers['WARC-Warcinfo-ID'], info.headers['WARC-Record-ID']);
  const capture = fs.readFileSync(path.join(dir, scrape.raw), 'utf8');
  assert.ok(capture.endsWith(resource.block.toString('utf8')), 'the block is the capture after its front matter');
  assert.ok(!resource.block.toString('utf8').startsWith('---'), 'front matter is not in the block');

  assert.equal(meta.headers['WARC-Concurrent-To'], resource.headers['WARC-Record-ID']);
  assert.equal(meta.headers['WARC-Target-URI'], scrape.url);
  assert.equal(meta.headers['Content-Type'], 'application/warc-fields');
  const fields = meta.block.toString('utf8');
  assert.match(fields, new RegExp(`capture-sha256: ${scrape.bodySha256}\\r\\n`));
  assert.match(fields, new RegExp(`ledger-seq: ${scrape.seq}\\r\\n`));
  assert.match(fields, /transport: .+\r\n/);
  assert.match(fields, /completeness: .+\r\n/);

  // Each record is its own GZIP member (E-01): every slice inflates to exactly one record.
  assert.equal(records.length, 3);
  let at = 0;
  for (const rec of records) {
    const one = readWarc(zlib.gunzipSync(bytes.subarray(at, at + rec.compressedLength)));
    assert.equal(one.length, 1);
    assert.equal(one[0].headers['WARC-Record-ID'], rec.id);
    at += rec.compressedLength;
  }
  assert.equal(at, bytes.length);
});

test('the same corpus exports the same WARC', () => {
  const dir = makePassingProject();
  assert.ok(exportWarc(dir).bytes.equals(exportWarc(dir).bytes));
});

test('a capture edited after its fetch is not exported, and is named', () => {
  const dir = makePassingProject();
  const scrape = readLedger(dir).entries.find((e) => e.op === 'scrape');
  corrupt(dir, scrape.raw, (t) => `${t}\nedited after fetch\n`);
  const { bytes, skipped } = exportWarc(dir);
  assert.deepEqual(readWarc(bytes).map((r) => r.headers['WARC-Type']), ['warcinfo']);
  assert.equal(skipped.length, 1);
  assert.equal(skipped[0].file, scrape.raw);
  assert.match(skipped[0].reason, /changed since it was fetched/);
});

test('the CLI writes the file, --out names it, and a non-project is refused', () => {
  const bin = fileURLToPath(new URL('../bin/export-warc.mjs', import.meta.url));
  const dir = makePassingProject();
  let r = spawnSync(process.execPath, [bin], { cwd: dir, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /3 records \(1 capture\)/);
  assert.equal(readWarc(fs.readFileSync(path.join(dir, 'research-corpus.warc.gz'))).length, 3);

  const out = path.join(tempDir(), 'x.warc.gz');
  r = spawnSync(process.execPath, [bin, '--out', out], { cwd: dir, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  assert.ok(fs.existsSync(out));

  r = spawnSync(process.execPath, [bin], { cwd: tempDir(), encoding: 'utf8' });
  assert.equal(r.status, 2);
  assert.match(r.stderr, /not a research project/);
  assert.ok(PATHS.ledger);
});

test('a refused write is named in words, and one record is "1 record"', () => {
  // Found 2026-09-29: --out naming a folder reached the top as a Node stack trace.
  const bin = fileURLToPath(new URL('../bin/export-warc.mjs', import.meta.url));
  const dir = makePassingProject();
  const folder = tempDir();
  let r = spawnSync(process.execPath, [bin, '--out', folder], { cwd: dir, encoding: 'utf8' });
  assert.equal(r.status, 2, r.stderr);
  assert.match(r.stderr, /could not write .*: EISDIR \(a folder is where the file should be\)/);
  assert.doesNotMatch(`${r.stdout}${r.stderr}`, /node:fs|^\s+at /m);

  const empty = tempDir();
  fs.mkdirSync(path.join(empty, 'research'));
  fs.writeFileSync(path.join(empty, 'research', 'DISCOVERY.md'), '# Discovery Contract\n');
  r = spawnSync(process.execPath, [bin], { cwd: empty, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /wrote 1 record \(0 captures\)/);
});
