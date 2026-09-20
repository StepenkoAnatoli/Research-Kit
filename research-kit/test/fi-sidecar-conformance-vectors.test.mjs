// Cross-language FI sidecar/evidence-manifest schema vectors.
// Every case is embedded synthetic JSON; no workbook, evidence directory, credential,
// network, or benchmark fixture is consulted.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { test, describe, assert, assertEqual } from './harness.mjs';

// Ported 2026-09-20 under ADR-0029.
describe('fi-sidecar-conformance-vectors');

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const VECTOR_FILE = path.join(ROOT, 'conformance', 'fi-sidecar-evidence-manifest-vectors.json');

function runCli() {
  return spawnSync(process.execPath, [
    path.join(ROOT, 'bin', 'fi-sidecar-conformance.mjs'), '--vectors', VECTOR_FILE, '--json',
  ], { encoding: 'utf8' });
}

test('FI sidecar and evidence-manifest vectors classify valid, malformed, and tampered documents consistently', async () => {
  const { loadFiSchemaVectors, runFiSchemaConformance } = await import('../lib/fi-sidecar-conformance.mjs');
  const packet = loadFiSchemaVectors(VECTOR_FILE);
  const report = runFiSchemaConformance(packet);
  assertEqual(report.status, 'PASS', JSON.stringify(report));
  assertEqual(report.profile, 'researcher-fi-schema-conformance-v1');
  assertEqual(report.vectorCount, packet.vectors.length);
  assert(report.vectors.every((row) => row.result === 'PASS'), JSON.stringify(report));
  assert(report.vectors.some((row) => row.expectedCode === 'SCHEMA-ONE-OF'));
  assert(report.vectors.some((row) => row.expectedCode === 'JSON-DUPLICATE-KEY'));
});

test('FI Node CLI is byte-deterministic and agrees with the Node library', async () => {
  const { canonicalReportJson, loadFiSchemaVectors, runFiSchemaConformance } = await import('../lib/fi-sidecar-conformance.mjs');
  const expected = canonicalReportJson(runFiSchemaConformance(loadFiSchemaVectors(VECTOR_FILE)));
  const first = runCli();
  const second = runCli();
  assertEqual(first.status, 0, first.stderr || first.stdout);
  assertEqual(second.status, 0, second.stderr || second.stdout);
  assertEqual(first.stdout, second.stdout, 'CLI report must be byte-identical');
  assertEqual(first.stdout, expected, 'CLI must render the library report exactly');
});

test('FI Python runner agrees with Node on every vector row and expected code', () => {
  const python = spawnSync('python', [
    path.join(ROOT, 'bin', 'fi_sidecar_conformance.py'), '--vectors', VECTOR_FILE, '--json',
  ], { encoding: 'utf8' });
  const node = runCli();
  assertEqual(python.status, 0, python.stderr || python.stdout);
  assertEqual(node.status, 0, node.stderr || node.stdout);
  const pythonReport = JSON.parse(python.stdout);
  const nodeReport = JSON.parse(node.stdout);
  assertEqual(pythonReport.status, 'PASS', python.stdout);
  assertEqual(pythonReport.profile, nodeReport.profile);
  assertEqual(pythonReport.vectorPacketSha256, nodeReport.vectorPacketSha256);
  assertEqual(JSON.stringify(pythonReport.vectors), JSON.stringify(nodeReport.vectors), 'Python and Node rows must agree');
});

test('FI vector packet remains synthetic and does not carry completed evidence', () => {
  const packet = JSON.parse(fs.readFileSync(VECTOR_FILE, 'utf8'));
  const source = JSON.stringify(packet).toLowerCase();
  assert(!source.includes('research/raw'), 'source captures are not conformance data');
  assert(!source.includes('privatekey'), 'private key material is not conformance data');
  assert(!source.includes('completed.xlsx'), 'completed workbook paths are not conformance data');
});
