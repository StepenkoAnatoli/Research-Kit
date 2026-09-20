// Read-only FI workbook/sidecar/manifest adapter tests.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { test, describe, assert, assertEqual, cleanup } from './harness.mjs';

// Ported 2026-09-20 under ADR-0029.
describe('fi-validator-adapter');
import { createSyntheticFiEvidenceBundle, syntheticFiWorkbookProjection } from './fi-e2e-bundle.mjs';

test('FI adapter validates a complete 30-case sidecar/manifest bundle using actual evidence bytes', async () => {
  const input = createSyntheticFiEvidenceBundle({ workbookMode: 'opaque' });
  try {
    const { validateFiBundle } = await import('../lib/fi-validator.mjs');
    const result = validateFiBundle({ ...input, workbookProjection: syntheticFiWorkbookProjection() });
    assertEqual(result.status, 'PASS', JSON.stringify(result));
    assertEqual(result.cases.length, 30);
  } finally { cleanup(input.root); }
});

test('FI adapter rejects a manifest entry whose declared hash does not match its contained bytes', async () => {
  const input = createSyntheticFiEvidenceBundle({ workbookMode: 'opaque', tamperEvidenceId: 'FI-12-status' });
  try {
    const { validateFiBundle } = await import('../lib/fi-validator.mjs');
    const result = validateFiBundle({ ...input, workbookProjection: syntheticFiWorkbookProjection() });
    assertEqual(result.status, 'FAIL', JSON.stringify(result));
    assert(result.errors.some((error) => error.code === 'EVIDENCE-HASH'), JSON.stringify(result.errors));
  } finally { cleanup(input.root); }
});

test('FI adapter classifies a missing required manifest as INCOMPLETE', async () => {
  const input = createSyntheticFiEvidenceBundle({ workbookMode: 'opaque' });
  try {
    fs.unlinkSync(input.manifest);
    const { validateFiBundle } = await import('../lib/fi-validator.mjs');
    const result = validateFiBundle({ ...input, workbookProjection: syntheticFiWorkbookProjection() });
    assertEqual(result.status, 'INCOMPLETE', JSON.stringify(result));
    assert(result.errors.some((error) => error.code === 'MANIFEST-READ' && error.status === 'INCOMPLETE'), JSON.stringify(result.errors));
  } finally { cleanup(input.root); }
});

test('FI adapter rejects an Index/case disposition disagreement and applies reopen precedence', async () => {
  const input = createSyntheticFiEvidenceBundle({ workbookMode: 'opaque', statuses: { 'FI-03': 'REOPEN' } });
  try {
    const { validateFiBundle } = await import('../lib/fi-validator.mjs');
    const projection = syntheticFiWorkbookProjection({ 'FI-03': 'REOPEN' }); projection.indexStatuses['FI-03'] = 'PASS';
    const result = validateFiBundle({ ...input, workbookProjection: projection });
    assertEqual(result.status, 'REOPEN', JSON.stringify(result));
    assert(result.errors.some((error) => error.code === 'FI-INDEX-MISMATCH'), JSON.stringify(result.errors));
  } finally { cleanup(input.root); }
});

test('researcher-release fi-validate is read-only and emits a deterministic JSON report', () => {
  const input = createSyntheticFiEvidenceBundle({ workbookMode: 'opaque' });
  try {
    const before = fs.readFileSync(input.workbook);
    const run = spawnSync(process.execPath, ['research-kit/bin/researcher-release.mjs', 'fi-validate', '--root', input.root, '--workbook', input.workbook, '--records', input.recordsDir, '--manifest', input.manifest, '--json'], { encoding: 'utf8' });
    assertEqual(run.status, 1, run.stderr || run.stdout);
    const report = JSON.parse(run.stdout);
    assert(report.errors.some((error) => error.code === 'WB-PACKAGE-UNTRUSTED'), JSON.stringify(report));
    assertEqual(Buffer.compare(before, fs.readFileSync(input.workbook)), 0, 'CLI must not mutate the workbook');
  } finally { cleanup(input.root); }
});
