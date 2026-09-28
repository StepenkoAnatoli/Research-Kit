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

// A vector whose value carries an unpaired surrogate.
//
// JSON spells one `\ud800`, both languages parse it, and JavaScript stores it as a single
// UTF-16 code unit - so it reaches canonicalisation alive on both sides. Three separate
// defects met there (found 2026-09-28, break-test):
//
//   1. `conformance_common.py` sorted object keys with `key.encode("utf-16-be")`.
//      CPython refuses to encode a lone surrogate, so the SORT raised UnicodeEncodeError
//      before `json_string` below it could refuse the character the way it refuses the
//      same one in a value. UnicodeEncodeError is a ValueError, not a ConformanceError,
//      so nothing caught it.
//   2. The runners caught only their OWN packet error, which is a SUBCLASS of the shared
//      ConformanceError - so a plain ConformanceError raised from canonicalisation
//      escaped `main` entirely, for a key and a value alike.
//   3. The Node twin canonicalised the same value and reported PASS, so the two languages
//      disagreed about the digest of one document.
//
// Net effect before the fix: the Python runner printed a traceback and no JSON, exited 1,
// and CI's cross-language step died on `JSON.parse` of an empty file - the same `--json`
// contract break as the deep-nesting case above, one layer deeper.
//
// The runners that canonicalise are the two that can hit it; the FI runner validates
// against a schema and never hashes its documents, so it is not in this list.
const CANONICALISING = [
  ['ledger-conformance.mjs', 'ledger_conformance.py', 'VECTOR-PACKET'],
  ['property-vector-conformance.mjs', 'property_vector_conformance.py', 'PROPERTY-VECTOR-PACKET'],
];

/** One valid packet per runner, carrying the surrogate in the place named. */
function surrogatePacket(runner, where) {
  // A lone high surrogate. Built from a code unit, not a literal, so the source file
  // itself stays valid UTF-8 and this test's own repo-hygiene checks are unaffected.
  const lone = String.fromCharCode(0xd800);
  if (runner === 'ledger-conformance.mjs') {
    const value = where === 'key' ? { [lone]: 1, a: 2 } : { a: lone };
    return {
      packetVersion: '1.0.0',
      profile: 'researcher-benchmark-c14n-v1',
      signatureAlgorithm: 'Ed25519',
      signatureEncoding: 'base64url-no-padding',
      vectors: [{ vectorId: 'surrogate', kind: 'canonical-json', value, expectedCanonical: '', expectedSha256: '' }],
    };
  }
  const value = where === 'key' ? { [lone]: 1, a: 2 } : { a: lone };
  return {
    packetVersion: '1.0.0',
    profile: 'researcher-property-vector-v1',
    generatorProfile: 'researcher-property-replay-v1',
    sourceCases: {},
    graphs: {},
    vectors: [{
      vectorId: 'surrogate', kind: 'canonical-hash', value,
      permutedValue: value, reorderedValue: { a: 1 },
      expectedCanonical: '', expectedSha256: '', expectedReorderedSha256: '',
    }],
  };
}

for (const where of ['key', 'value']) {
  test(`a vector carrying an unpaired surrogate in a ${where} is a structured FAIL in Node and Python alike`, () => {
    const python = requirePython(`the Python runners on a surrogate-${where} packet`);
    for (const [nodeRunner, pythonRunner, code] of CANONICALISING) {
      const dir = tempDir(`rk-surrogate-${where}-`);
      const packet = path.join(dir, 'surrogate.json');
      fs.writeFileSync(packet, JSON.stringify(surrogatePacket(nodeRunner, where)));
      const reports = [
        spawnSync(process.execPath, [path.join(BIN, nodeRunner), '--vectors', packet, '--json'], { encoding: 'utf8' }),
        spawnSync(python, [path.join(BIN, pythonRunner), '--vectors', packet, '--json'], { encoding: 'utf8' }),
      ].map((r, i) => {
        const who = i ? pythonRunner : nodeRunner;
        assert.equal(r.status, 1, `${who} exited ${r.status}:\n${(r.stderr || r.stdout).slice(-400)}`);
        assert.doesNotMatch(r.stderr, /Traceback/, `${who} crashed instead of reporting:\n${r.stderr.slice(-400)}`);
        const report = JSON.parse(r.stdout);
        assert.equal(report.status, 'FAIL', who);
        assert.equal(report.errors?.[0]?.code, code, who);
        return report;
      });
      // Both languages must refuse it, and say the same thing - the two used to disagree,
      // with Node reporting PASS for a value the other side calls non-canonical.
      assert.equal(reports[1].errors[0].message, reports[0].errors[0].message,
        `${pythonRunner} and ${nodeRunner} name different reasons`);
    }
  });
}

test('an astral character is still canonical, so the surrogate rule is not over-broad', () => {
  const python = requirePython('the Python runners on an astral-key packet');
  const dir = tempDir('rk-astral-packet-');
  const packet = path.join(dir, 'astral.json');
  const value = { '\u{1F600}': 1, a: '\u{1F600}' };
  fs.writeFileSync(packet, JSON.stringify({
    packetVersion: '1.0.0',
    profile: 'researcher-benchmark-c14n-v1',
    signatureAlgorithm: 'Ed25519',
    signatureEncoding: 'base64url-no-padding',
    vectors: [{ vectorId: 'astral', kind: 'canonical-json', value, expectedCanonical: '', expectedSha256: '' }],
  }));
  // A wrong expected digest is a per-vector FAIL, which is the honest answer for a value
  // nobody precomputed - and crucially it is a FAIL that BOTH languages reach, rather
  // than a refusal only one of them makes. The point is that neither crashes.
  for (const [nodeRunner, pythonRunner] of CANONICALISING) {
    const runs = [
      spawnSync(process.execPath, [path.join(BIN, nodeRunner), '--vectors', packet, '--json'], { encoding: 'utf8' }),
      spawnSync(python, [path.join(BIN, pythonRunner), '--vectors', packet, '--json'], { encoding: 'utf8' }),
    ].map((r, i) => {
      const who = i ? pythonRunner : nodeRunner;
      assert.doesNotMatch(r.stderr, /Traceback/, `${who} crashed on an astral character:\n${r.stderr.slice(-400)}`);
      return JSON.parse(r.stdout);
    });
    assert.deepEqual(runs[1].vectors, runs[0].vectors,
      `${pythonRunner} and ${nodeRunner} disagree about an astral character`);
  }
});

// A packet deep enough to PARSE but too deep to CANONICALISE.
//
// The deep-nesting test above uses 200,000 levels, where both sides fail at parse time and
// never get any further. That left a window uncovered: the readers and the canonicaliser
// recurse, and their limits are different numbers on each side. Node's hand-written reader
// walks thousands of levels and its canonicaliser a couple of thousand; Python's
// `json.loads` accepts about a thousand and its canonicaliser only a few hundred. So a
// document nested in between PARSES and then dies inside canonicalisation - and
// RecursionError is a RuntimeError, not a ConformanceError, so the runners' packet handler
// did not catch it: traceback, no JSON, exit 1 (found 2026-09-28, break-test).
//
// The exact numbers move with the interpreter version, so this asserts the CONTRACT at
// each depth rather than a boundary: exit 1, no traceback, and JSON on stdout. Both
// limits being implementation details is precisely why the catch has to be at the runner.
for (const depth of [64, 400, 700, 900]) {
  test(`a packet nested ${depth} deep honours the --json contract in Node and Python alike`, () => {
    const python = requirePython('the Python runners on a deep packet');
    const packet = path.join(tempDir(`rk-deep-${depth}-`), 'deep.json');
    fs.writeFileSync(packet, JSON.stringify({
      packetVersion: '1.0.0',
      profile: 'researcher-benchmark-c14n-v1',
      signatureAlgorithm: 'Ed25519',
      signatureEncoding: 'base64url-no-padding',
      // An expected digest nobody computed, so every path through the vector is a FAIL
      // rather than a PASS - the verdict is not what is under test here, the contract is.
      vectors: [{ vectorId: 'deep', kind: 'canonical-json', value: JSON.parse(`${'['.repeat(depth)}${']'.repeat(depth)}`), expectedCanonical: '', expectedSha256: '' }],
    }));
    for (const [nodeRunner, pythonRunner] of CANONICALISING) {
      const reports = [
        spawnSync(process.execPath, [path.join(BIN, nodeRunner), '--vectors', packet, '--json'], { encoding: 'utf8' }),
        spawnSync(python, [path.join(BIN, pythonRunner), '--vectors', packet, '--json'], { encoding: 'utf8' }),
      ].map((r, i) => {
        const who = i ? pythonRunner : nodeRunner;
        assert.equal(r.status, 1, `${who} exited ${r.status}:\n${(r.stderr || r.stdout).slice(-400)}`);
        assert.doesNotMatch(r.stderr, /Traceback/,
          `${who} crashed instead of reporting at depth ${depth}:\n${r.stderr.slice(-400)}`);
        const report = JSON.parse(r.stdout);
        assert.equal(report.status, 'FAIL', who);
        return report;
      });
      // A per-vector FAIL and a whole-packet refusal are both honest answers to a value
      // nobody precomputed; what must never happen is one side answering and the other
      // side answering with a traceback.
      assert.ok(reports[0].vectors?.length || reports[0].errors?.length, nodeRunner);
      assert.ok(reports[1].vectors?.length || reports[1].errors?.length, pythonRunner);
    }
  });
}

