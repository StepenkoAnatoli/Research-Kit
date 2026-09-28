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

// Found 2026-09-28 (Arena break test 5): two packets both languages PARSE, that the Python
// runners then crashed on while canonicalising - a traceback and no report, where the Node
// twin reported. An object key holding an unpaired surrogate: the key sort encoded it
// before json_string, whose job is to refuse it, ever ran. And a packet deep enough to
// parse but too deep to canonicalise (a few hundred levels): only the parse sites caught
// RecursionError. Each hostile value goes into the first vector of the runner's own
// shipped packet, so the packet is otherwise valid.
const SHIPPED = {
  'ledger-conformance.mjs': 'qualification-ledger-vectors.json',
  'property-vector-conformance.mjs': 'property-graph-hash-vectors.json',
  'fi-sidecar-conformance.mjs': 'fi-sidecar-evidence-manifest-vectors.json',
};
const CONFORMANCE = path.resolve(fileURLToPath(new URL('../conformance', import.meta.url)));

function hostile(nodeRunner, value) {
  const packet = JSON.parse(fs.readFileSync(path.join(CONFORMANCE, SHIPPED[nodeRunner]), 'utf8'));
  if (packet.documents) packet.documents[Object.keys(packet.documents)[0]].hostile = value;
  else packet.vectors[0].value = value;
  const file = path.join(tempDir('rk-hostile-'), 'packet.json');
  fs.writeFileSync(file, JSON.stringify(packet)); // JSON.stringify writes a lone surrogate as \ud800
  return file;
}

function nested(depth) {
  const root = {};
  let at = root;
  for (let i = 0; i < depth; i += 1) { at.k = {}; at = at.k; }
  return root;
}

for (const [label, value] of [['an unpaired-surrogate key', { a: 1, '\ud800': 2 }], ['a packet nested 600 deep', nested(600)]]) {
  test(`${label} is a report from every Python runner, never a traceback`, () => {
    const python = requirePython(`the Python runners on ${label}`);
    for (const [nodeRunner, pythonRunner] of RUNNERS) {
      const packet = hostile(nodeRunner, value);
      const r = spawnSync(python, [path.join(BIN, pythonRunner), '--vectors', packet, '--json'], { encoding: 'utf8' });
      assert.doesNotMatch(r.stderr, /Traceback/, `${pythonRunner} crashed on ${label}:\n${r.stderr.slice(-400)}`);
      assert.equal(r.status, 1, `${pythonRunner} exited ${r.status} on ${label}`);
      assert.equal(JSON.parse(r.stdout).status, 'FAIL', pythonRunner);
    }
  });
}
