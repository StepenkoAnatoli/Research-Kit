// The facade contract, pinned.
//
// On 2026-09-20 four primitives moved out of release-validator.mjs into lib/release/.
// The entire safety argument for that refactor is that the PUBLIC API did not change:
// eighteen files import from release-validator.mjs, and none of them were touched.
//
// An argument is not a test. These assert the thing the argument claims - that the export
// list is exactly what it was, that the re-exports are the same functions and not copies,
// and that no primitive quietly acquired a second implementation on the way out.

import { test, describe, assert, assertEqual, fs, path, KIT_ROOT } from './harness.mjs';
import * as facade from '../lib/release-validator.mjs';
import * as canonical from '../lib/release/canonical.mjs';
import * as json from '../lib/release/json.mjs';
import * as schema from '../lib/release/schema.mjs';
import * as paths from '../lib/release/paths.mjs';

describe('release-facade');

// The 21 exports release-validator.mjs had before the split, recorded here so a
// disappearance is a test failure rather than somebody else's runtime error.
const PUBLIC_API = [
  'DEFAULT_SCHEMA_DIR', 'SNAPSHOT_MAX_AGE_MS', 'VALIDATOR_VERSION',
  'canonicalJson', 'computeDescendantInvalidation', 'listJsonFiles',
  'parseJsonNoDuplicates', 'payloadHash', 'qualificationChainHash',
  'qualificationRecordHash', 'recordHash', 'runSchemaConformance', 'safePath',
  'sha256', 'summarizeLedgerHistory', 'validateEnvelope', 'validateJsonSchema',
  'validateRelease', 'validateSnapshotEvidence', 'verifyLedgerAnchors',
  'verifyQualificationLedger',
];

test('the public API is exactly what it was before the split', () => {
  const actual = Object.keys(facade).sort();
  const removed = PUBLIC_API.filter((name) => !actual.includes(name));
  const added = actual.filter((name) => !PUBLIC_API.includes(name));
  assertEqual(removed.length, 0, `these exports disappeared, breaking every consumer: ${removed.join(', ')}`);
  assertEqual(added.length, 0,
    `these exports are new: ${added.join(', ')}. That may be fine - but the facade's job is `
    + 'to be stable, so add them to PUBLIC_API deliberately rather than by accident.');
});

test('a re-export is the SAME function object, not a copy', () => {
  // If a primitive were ever re-implemented in the facade instead of re-exported, the
  // export list would still look right and the two would drift exactly as the Python
  // canonicalisers did. Identity is what rules that out.
  const pairs = [
    ['canonicalJson', facade.canonicalJson, canonical.canonicalJson],
    ['sha256', facade.sha256, canonical.sha256],
    ['payloadHash', facade.payloadHash, canonical.payloadHash],
    ['recordHash', facade.recordHash, canonical.recordHash],
    ['qualificationRecordHash', facade.qualificationRecordHash, canonical.qualificationRecordHash],
    ['qualificationChainHash', facade.qualificationChainHash, canonical.qualificationChainHash],
    ['parseJsonNoDuplicates', facade.parseJsonNoDuplicates, json.parseJsonNoDuplicates],
    ['validateJsonSchema', facade.validateJsonSchema, schema.validateJsonSchema],
    ['safePath', facade.safePath, paths.safePath],
  ];
  for (const [name, fromFacade, fromModule] of pairs) {
    assert(fromFacade === fromModule, `${name} re-exported from the facade is not the same function as the module's`);
  }
});

test('no extracted primitive was left behind in the file it came from', () => {
  // The failure this catches is a half-finished extraction: the new module exists, the
  // facade re-exports it, and the original definition is still sitting there unused -
  // so a later edit "fixes" the dead copy and nothing changes.
  const source = fs.readFileSync(path.join(KIT_ROOT, 'lib', 'release-validator.mjs'), 'utf8');
  const moved = ['canonicalJson', 'sha256', 'payloadHash', 'parseJsonNoDuplicates',
    'validateJsonSchema', 'safePath', 'recordHash', 'qualificationRecordHash',
    'qualificationChainHash'];
  const leftBehind = moved.filter((name) => new RegExp(`^(export )?function ${name}\\b`, 'm').test(source));
  assertEqual(leftBehind.length, 0,
    `these were extracted but still defined in release-validator.mjs: ${leftBehind.join(', ')}`);
});

test('the primitives still agree with the values the conformance vectors pin', () => {
  // The split must not have changed a single byte of behaviour, and the cheapest proof is
  // a value the repository already treats as authoritative: the canonical-float vectors
  // added when the Python runners were unified.
  const packet = JSON.parse(fs.readFileSync(
    path.join(KIT_ROOT, 'conformance', 'qualification-ledger-vectors.json'), 'utf8'));
  const checked = packet.vectors.filter((v) => v.kind === 'canonical-json' || v.kind === 'canonical-float');
  assert(checked.length >= 10, `expected the ledger packet to still carry canonical vectors, found ${checked.length}`);
  for (const vector of checked) {
    assertEqual(facade.canonicalJson(vector.value), vector.expectedCanonical,
      `${vector.vectorId}: canonicalJson changed during the split`);
    assertEqual(facade.sha256(vector.expectedCanonical), vector.expectedSha256,
      `${vector.vectorId}: sha256 changed during the split`);
  }
});

test('every extracted module is importable on its own', () => {
  // A module that only works when release-validator.mjs has already been loaded is not
  // extracted, it is entangled. Each was imported at the top of this file independently,
  // so reaching here proves it - these assertions pin what each one is FOR.
  assert(typeof canonical.canonicalJson === 'function' && typeof canonical.metaOf === 'function',
    'canonical.mjs should own canonicalisation and the flat-vs-nested record shape');
  assert(typeof json.parseJsonNoDuplicates === 'function', 'json.mjs should own duplicate-key-safe parsing');
  assert(typeof schema.validateJsonSchema === 'function', 'schema.mjs should own the schema subset');
  assert(typeof paths.safePath === 'function' && typeof paths.inside === 'function',
    'paths.mjs should own containment');
});
