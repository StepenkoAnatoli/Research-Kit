// Synthetic property-generated canonical-hash and graph vectors agree across runners.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { test, describe, assert, assertEqual } from './harness.mjs';

// Ported 2026-09-20 under ADR-0029.
describe('property-vector-conformance');

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const VECTOR_FILE = path.join(ROOT, 'conformance', 'property-graph-hash-vectors.json');

function runNodeCli() {
  return spawnSync(process.execPath, [
    path.join(ROOT, 'bin', 'property-vector-conformance.mjs'), '--vectors', VECTOR_FILE, '--json',
  ], { encoding: 'utf8' });
}

test('Node runner verifies every exported canonical-hash and graph vector', async () => {
  const { loadPropertyVectors, runPropertyVectorConformance } = await import('../lib/property-vector-conformance.mjs');
  const packet = loadPropertyVectors(VECTOR_FILE);
  const result = runPropertyVectorConformance(packet);
  assertEqual(result.status, 'PASS', JSON.stringify(result));
  assertEqual(result.profile, 'researcher-property-vector-v1', JSON.stringify(result));
  assertEqual(result.vectorCount, packet.vectors.length, JSON.stringify(result));
  assert(result.vectors.every((row) => row.result === 'PASS'), JSON.stringify(result));
  assert(result.vectors.some((row) => row.kind === 'graph-invalidation' && row.affectedPointers.length > 0), JSON.stringify(result));
  assert(result.vectors.some((row) => row.kind === 'graph-invalidation' && row.status === 'FAIL' && row.primaryReason === 'graph.cycle'), JSON.stringify(result));
});

test('Node CLI produces a byte-identical report for exported property vectors', async () => {
  const { canonicalReportJson, loadPropertyVectors, runPropertyVectorConformance } = await import('../lib/property-vector-conformance.mjs');
  const expected = canonicalReportJson(runPropertyVectorConformance(loadPropertyVectors(VECTOR_FILE)));
  const first = runNodeCli();
  const second = runNodeCli();
  assertEqual(first.status, 0, first.stderr || first.stdout);
  assertEqual(second.status, 0, second.stderr || second.stdout);
  assertEqual(first.stdout, second.stdout, 'CLI report must be byte-deterministic');
  assertEqual(first.stdout, expected, 'CLI and library reports must agree');
});

test('Python independently reproduces exported property vector rows', () => {
  const python = spawnSync('python', [
    path.join(ROOT, 'bin', 'property_vector_conformance.py'), '--vectors', VECTOR_FILE, '--json',
  ], { encoding: 'utf8' });
  const node = runNodeCli();
  assertEqual(python.status, 0, python.stderr || python.stdout);
  assertEqual(node.status, 0, node.stderr || node.stdout);
  const pythonReport = JSON.parse(python.stdout);
  const nodeReport = JSON.parse(node.stdout);
  assertEqual(pythonReport.status, 'PASS', python.stdout);
  assertEqual(JSON.stringify(pythonReport.vectors), JSON.stringify(nodeReport.vectors), 'Python and Node vector rows must agree');
});

test('exported vectors are static synthetic values without release evidence', () => {
  const packet = JSON.parse(fs.readFileSync(VECTOR_FILE, 'utf8'));
  const text = JSON.stringify(packet).toLowerCase();
  assert(!text.includes('privatekey'), 'private key material must not be exported');
  assert(!text.includes('research/raw'), 'research captures must not be exported');
  assert(!text.includes('fixture'), 'benchmark fixtures must not be exported');
});

test('exported graph and hash values remain bound to their declared property seeds', async () => {
  const packet = JSON.parse(fs.readFileSync(VECTOR_FILE, 'utf8'));
  const { propertyInput } = await import('../lib/property-replay.mjs');
  const hashSource = packet.sourceCases['PV-H-01'];
  const graphSource = packet.sourceCases['G-17'];
  const hashInput = propertyInput(hashSource);
  const graphInput = propertyInput(graphSource);
  const hashVector = packet.vectors.find((vector) => vector.vectorId === 'PV-H-01');
  assertEqual(JSON.stringify(hashVector.value), JSON.stringify(hashInput.base), 'canonical vector must be the declared generated hash input');
  assertEqual(JSON.stringify(packet.graphs['G-17']), JSON.stringify(graphInput.pointers), 'graph vector must be the declared generated graph input');
});
