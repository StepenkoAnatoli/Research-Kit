// Offline, read-only validator for the FI-01--FI-30 workbook evidence bundle.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { parseJsonNoDuplicates, validateJsonSchema } from './release-validator.mjs';

export const FI_IDS = Array.from({ length: 30 }, (_, index) => `FI-${String(index + 1).padStart(2, '0')}`);
export const FI_STATUS_PRECEDENCE = ['PASS', 'INCOMPLETE', 'ROLLED-BACK', 'BLOCKED', 'FAIL', 'REOPEN'];
const RANK = Object.fromEntries(FI_STATUS_PRECEDENCE.map((value, index) => [value, index]));
const SCHEMA_DIR = fileURLToPath(new URL('../schemas/', import.meta.url));
const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');

function issue(errors, code, message, status = 'FAIL', fiId = null) { errors.push({ code, message, status, fiId }); }
function reduceStatus(items) { return items.reduce((current, item) => RANK[item.status] > RANK[current] ? item.status : current, 'PASS'); }
function inside(root, candidate) { const relative = path.relative(root, candidate); return relative && !relative.startsWith('..') && !path.isAbsolute(relative); }
function readJson(file, errors, code, status = 'FAIL') {
  try { return parseJsonNoDuplicates(fs.readFileSync(file, 'utf8')); }
  catch (error) { issue(errors, code, error.message, status); return null; }
}
function schema(file, value, errors, prefix) {
  const source = readJson(file, errors, `${prefix}-SCHEMA-READ`);
  if (!source || value === null) return;
  for (const error of validateJsonSchema(value, source, { errors: [] })) issue(errors, `${prefix}-${error.code}`, error.message, 'FAIL');
}
function validEvidencePath(root, manifestRoot, relative) {
  if (typeof relative !== 'string' || relative.includes('\\') || relative.includes('\0')) return null;
  const evidenceRoot = path.resolve(root, manifestRoot);
  const target = path.resolve(root, relative);
  return inside(evidenceRoot, target) ? target : null;
}

/** Read-only semantic validation. `workbookProjection` is injectable for offline tests. */
export function validateFiBundle({ root, workbook, recordsDir, manifest, workbookProjection = null } = {}) {
  const errors = [];
  const cases = [];
  const resolvedRoot = path.resolve(root ?? '.');
  const manifestValue = manifest ? readJson(manifest, errors, 'MANIFEST-READ', 'INCOMPLETE') : null;
  const manifestSchema = path.join(SCHEMA_DIR, 'fi-evidence-manifest.schema.json');
  schema(manifestSchema, manifestValue, errors, 'MANIFEST');
  const entries = new Map();
  for (const entry of manifestValue?.entries ?? []) {
    if (entries.has(entry.evidenceId)) issue(errors, 'EVIDENCE-DUPLICATE', `duplicate evidence ID ${entry.evidenceId}`);
    else entries.set(entry.evidenceId, entry);
    const file = validEvidencePath(resolvedRoot, manifestValue?.root ?? '', entry.path);
    if (!file || !fs.existsSync(file) || !fs.lstatSync(file).isFile()) { issue(errors, 'EVIDENCE-PATH', `evidence path is missing or escapes root: ${entry.path}`, 'FAIL', entry.fiId); continue; }
    const bytes = fs.readFileSync(file);
    if (bytes.length !== entry.byteLength || sha256(bytes) !== entry.sha256) issue(errors, 'EVIDENCE-HASH', `evidence bytes do not match manifest: ${entry.evidenceId}`, 'FAIL', entry.fiId);
  }
  let workbookHash = null;
  try { workbookHash = sha256(fs.readFileSync(workbook)); } catch (error) { issue(errors, 'WORKBOOK-READ', error.message, 'INCOMPLETE'); }
  const records = new Map();
  if (!recordsDir || !fs.existsSync(recordsDir)) issue(errors, 'RECORD-MISSING', 'sidecar directory is absent', 'INCOMPLETE');
  else for (const name of fs.readdirSync(recordsDir).sort()) {
    if (!name.endsWith('.json')) { issue(errors, 'RECORD-EXTRA', `non-JSON record entry ${name}`); continue; }
    const value = readJson(path.join(recordsDir, name), errors, 'RECORD-READ');
    schema(path.join(SCHEMA_DIR, 'fi-signoff-sidecar.schema.json'), value, errors, 'RECORD');
    if (!value?.fiId) continue;
    if (records.has(value.fiId)) issue(errors, 'RECORD-DUPLICATE', `duplicate FI sidecar ${value.fiId}`, 'FAIL', value.fiId);
    else records.set(value.fiId, value);
  }
  const projection = workbookProjection ?? readFiWorkbookProjection(workbook, errors);
  const requiredSheets = ['Index', 'Roll-up', ...FI_IDS];
  if (!Array.isArray(projection?.sheets) || requiredSheets.some((id, index) => projection.sheets[index] !== id) || projection.sheets.length !== requiredSheets.length) issue(errors, 'WB-SHEET-ID', 'workbook must contain Index, Roll-up, and FI-01..FI-30 in order');
  for (const fiId of FI_IDS) {
    const local = [];
    const add = (code, message, status = 'FAIL') => issue(local, code, message, status, fiId);
    const record = records.get(fiId);
    if (!record) add('RECORD-MISSING', `missing sidecar ${fiId}`, 'INCOMPLETE');
    else {
      if (record.workbookSha256 !== workbookHash) add('WORKBOOK-HASH', 'sidecar workbook hash differs from supplied workbook');
      const checkEvidence = (id, declaredHash, label = null) => {
        const entry = entries.get(id);
        if (!entry) return add('EVIDENCE-MISSING', `sidecar reference ${id} has no manifest entry`, 'INCOMPLETE');
        if (entry.fiId !== fiId || (label && entry.fieldLabel !== label)) add('EVIDENCE-OWNER', `evidence ${id} has wrong FI owner or field label`);
        if (declaredHash && entry.sha256 !== declaredHash) add('EVIDENCE-HASH', `sidecar hash differs from manifest for ${id}`);
      };
      for (const field of record.fields ?? []) field.evidenceIds.forEach((id, index) => checkEvidence(id, field.evidenceHashes[index], field.label));
      for (const id of record.containment?.proofEvidenceIds ?? []) checkEvidence(id);
      if (record.status === 'ROLLED-BACK') checkEvidence(record.rollback?.receiptEvidenceId);
      const caseStatus = projection?.caseStatuses?.[fiId] ?? null;
      const indexStatus = projection?.indexStatuses?.[fiId] ?? null;
      const rollupStatus = projection?.rollupStatuses?.[fiId] ?? null;
      if (!caseStatus) add('FI-FIELD-MISSING', 'Case disposition is absent', 'INCOMPLETE');
      else if (caseStatus !== record.status) add('FI-PROJECTION-MISMATCH', 'case disposition differs from sidecar status');
      if (indexStatus !== caseStatus) add('FI-INDEX-MISMATCH', 'Index completion status differs from case disposition', 'REOPEN');
      if (rollupStatus !== caseStatus) add('FI-ROLLUP-MISMATCH', 'Roll-up status differs from case disposition', 'REOPEN');
    }
    cases.push({ fiId, status: reduceStatus(local), errors: local }); errors.push(...local);
  }
  return { validatorVersion: '1.0.0', status: reduceStatus(errors), cases, errors };
}

// A deliberately small XLSX reader: validates ZIP structure, reads visible sheet names and
// status cells, and never writes or invokes an office application.
function zipEntries(file) {
  const bytes = fs.readFileSync(file); const marker = Buffer.from([0x50, 0x4b, 0x05, 0x06]); const end = bytes.lastIndexOf(marker);
  if (end < 0 || end + 22 > bytes.length) throw new Error('XLSX central directory is missing');
  const count = bytes.readUInt16LE(end + 10); let at = bytes.readUInt32LE(end + 16); const entries = new Map();
  for (let index = 0; index < count; index += 1) {
    if (bytes.readUInt32LE(at) !== 0x02014b50) throw new Error('invalid XLSX central directory');
    const method = bytes.readUInt16LE(at + 10), size = bytes.readUInt32LE(at + 20), nameLength = bytes.readUInt16LE(at + 28), extra = bytes.readUInt16LE(at + 30), comment = bytes.readUInt16LE(at + 32), local = bytes.readUInt32LE(at + 42);
    const name = bytes.subarray(at + 46, at + 46 + nameLength).toString('utf8'); if (entries.has(name) || name.includes('..') || name.startsWith('/')) throw new Error('unsafe XLSX entry');
    const localName = bytes.readUInt16LE(local + 26), localExtra = bytes.readUInt16LE(local + 28), start = local + 30 + localName + localExtra; let data = bytes.subarray(start, start + size);
    if (method === 8) data = (awaitableInflate(data)); else if (method !== 0) throw new Error('unsupported XLSX compression'); entries.set(name, data); at += 46 + nameLength + extra + comment;
  } return entries;
}
function awaitableInflate(data) { return zlib.inflateRawSync(data); }
function decode(value) { return String(value ?? '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))); }
function cells(xml, shared) { const out = new Map(); for (const match of xml.matchAll(/<(?:\w+:)?c\s+([^>]*)>([\s\S]*?)<\/(?:\w+:)?c>/g)) { const ref = /\br="([A-Z]+\d+)"/.exec(match[1])?.[1]; if (!ref) continue; const type = /\bt="([^"]+)"/.exec(match[1])?.[1]; const raw = /<(?:\w+:)?v>([\s\S]*?)<\/(?:\w+:)?v>/.exec(match[2])?.[1] ?? /<(?:\w+:)?t[^>]*>([\s\S]*?)<\/(?:\w+:)?t>/.exec(match[2])?.[1] ?? ''; out.set(ref, type === 's' ? shared[Number(raw)] : decode(raw)); } return out; }
export function readFiWorkbookProjection(workbook, errors = []) {
  try {
    const entries = zipEntries(workbook); const text = (name) => entries.get(name)?.toString('utf8') ?? '';
    const shared = [...text('xl/sharedStrings.xml').matchAll(/<(?:\w+:)?si\b[^>]*>([\s\S]*?)<\/(?:\w+:)?si>/g)].map((m) => decode([...m[1].matchAll(/<(?:\w+:)?t[^>]*>([\s\S]*?)<\/(?:\w+:)?t>/g)].map((x) => x[1]).join('')));
    const names = [...text('xl/workbook.xml').matchAll(/<(?:\w+:)?sheet\b[^>]*name="([^"]+)"[^>]*sheetId="(\d+)"[^>]*>/g)].map((m) => ({ name: decode(m[1]), index: Number(m[2]) }));
    const sheetCells = new Map(names.map(({ name, index }) => [name, cells(text(`xl/worksheets/sheet${index}.xml`), shared)]));
    const value = (name, ref) => sheetCells.get(name)?.get(ref) || null; const caseStatuses = {}, indexStatuses = {}, rollupStatuses = {};
    for (let i = 1; i <= 30; i += 1) { const id = `FI-${String(i).padStart(2, '0')}`; const sheet = sheetCells.get(id); let disposition = null; for (const [ref, label] of sheet ?? []) if (label === 'Case disposition') { disposition = value(id, `D${ref.match(/\d+/)[0]}`); break; } caseStatuses[id] = disposition; indexStatuses[id] = value('Index', `H${i + 4}`); rollupStatuses[id] = value('Roll-up', `B${i + 22}`); }
    return { sheets: names.map((row) => row.name), caseStatuses, indexStatuses, rollupStatuses };
  } catch (error) { issue(errors, 'WB-PACKAGE-UNTRUSTED', error.message); return null; }
}
