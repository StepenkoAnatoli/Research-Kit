// A hostile vector packet gets the same structured FAIL from both languages.
//
// Found 2026-09-28 (Arena break test 4, F-02): a packet nested 200,000 arrays deep made
// all three Python runners print a RecursionError traceback, while their Node twins
// wrote a FAIL report and exited 1. RecursionError is not a JSONDecodeError, so no
// parse site caught it - and the --json contract broke exactly where a host compares
// the two languages.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { test, describe, assert, tempDir, requirePython } from './harness.mjs';

describe('conformance-hostile');

const BIN = path.resolve(fileURLToPath(new URL('../bin', import.meta.url)));
const RUNNERS = [
  ['ledger-conformance.mjs', 'ledger_conformance.py'],
  ['property-vector-conformance.mjs', 'property_vector_conformance.py'],
  ['fi-sidecar-conformance.mjs', 'fi_sidecar_conformance.py'],
];

test('a packet nested too deep to parse is a structured FAIL in Node and Python alike', () => {
  const python = requirePython('the Python runners on a hostile packet');
  const packet = path.join(tempDir('rk-deep-packet-'), 'deep.json');
  fs.writeFileSync(packet, `${'['.repeat(200_000)}${']'.repeat(200_000)}`);
  for (const [nodeRunner, pythonRunner] of RUNNERS) {
    const reports = [
      spawnSync(process.execPath, [path.join(BIN, nodeRunner), '--vectors', packet, '--json'], { encoding: 'utf8' }),
      spawnSync(python, [path.join(BIN, pythonRunner), '--vectors', packet, '--json'], { encoding: 'utf8' }),
    ].map((r, i) => {
      const who = i ? pythonRunner : nodeRunner;
      assert.equal(r.status, 1, `${who} exited ${r.status}:\n${(r.stderr || r.stdout).slice(-400)}`);
      assert.doesNotMatch(r.stderr, /Traceback/, `${who} crashed instead of reporting:\n${r.stderr.slice(-400)}`);
      const report = JSON.parse(r.stdout);
      assert.equal(report.status, 'FAIL', who);
      return report;
    });
    assert.equal(reports[1].errors?.[0]?.code, reports[0].errors?.[0]?.code, `${pythonRunner} and ${nodeRunner} name different codes`);
  }
});
