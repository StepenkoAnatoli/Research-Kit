#!/usr/bin/env node
// researcher-release - read-only R28–R32 artifact validation and schema conformance.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import {
  DEFAULT_SCHEMA_DIR,
  listJsonFiles,
  parseJsonNoDuplicates,
  runSchemaConformance,
  validateRelease,
} from '../lib/release-validator.mjs';
import { validateFiBundle } from '../lib/fi-validator.mjs';

function usage() {
  return [
    'Usage:',
    '  node bin/researcher-release.mjs validate --root <record-root> --package R28|R29|R30|R31|R32|R33',
    '    --registry <artifact-registry.json> --roles <role-roster.json> --pointers <pointer-directory> [--schemas <dir>] [--ledger <ledger.qlog|ledger-dir>] [--genesis <genesis.json>] [--checkpoints <checkpoint-directory>] [--head <head.json>] [--keys <public-keys.json>] [--genesis-hash <sha256>] [--snapshot-max-age-ms <milliseconds>] [--json]',
    '  node bin/researcher-release.mjs conform --root <directory> --schema <schema.json> [--file <record.json>]... [--json]',
    '  node bin/researcher-release.mjs fi-validate --root <approved-root> --workbook <completed.xlsx> --records <sidecar-directory> --manifest <evidence-manifest.json> [--report <report.json>] [--json]',
  ].join('\n');
}

function argsAfterCommand(argv) {
  const command = argv[0];
  const result = { command, _: [] };
  for (let i = 1; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--json') { result.json = true; continue; }
    if (arg === '--file') { result.files ??= []; result.files.push(argv[++i]); continue; }
    if (arg.startsWith('--')) { result[arg.slice(2).replaceAll('-', '')] = argv[++i]; continue; }
    result._.push(arg);
  }
  return result;
}

function exitFor(status) {
  if (status === 'PASS') return 0;
  if (status === 'FAIL' || status === 'REOPEN') return 1;
  if (status === 'INCOMPLETE') return 2;
  if (status === 'BLOCKED') return 3;
  return 4;
}

function main(argv = process.argv.slice(2)) {
  const parsed = argsAfterCommand(argv);
  let result;
  if (parsed.command === 'validate') {
    if (!parsed.root || !parsed.package || !parsed.registry || !parsed.roles || !parsed.pointers) {
      console.error(usage());
      return 2;
    }
    let publicKeys = {};
    if (parsed.keys) {
      try { publicKeys = parseJsonNoDuplicates(fs.readFileSync(path.resolve(parsed.keys), 'utf8')); }
      catch (error) {
        result = { status: 'INCOMPLETE', errors: [{ code: 'LEDGER-KEYS-READ', message: error.message, path: parsed.keys, status: 'INCOMPLETE' }] };
      }
    }
    if (!result) result = validateRelease({
      root: path.resolve(parsed.root),
      package: parsed.package,
      registryPath: path.resolve(parsed.registry),
      rolesPath: path.resolve(parsed.roles),
      pointersDir: path.resolve(parsed.pointers),
      schemaDir: parsed.schemas ? path.resolve(parsed.schemas) : DEFAULT_SCHEMA_DIR,
      ledgerPath: parsed.ledger ? path.resolve(parsed.ledger) : null,
      genesisPath: parsed.genesis ? path.resolve(parsed.genesis) : null,
      checkpointsDir: parsed.checkpoints ? path.resolve(parsed.checkpoints) : null,
      headPath: parsed.head ? path.resolve(parsed.head) : null,
      genesisHash: parsed.genesishash ?? '0'.repeat(64),
      publicKeys,
      snapshotMaxAgeMs: parsed.snapshotmaxagems === undefined ? undefined : Number(parsed.snapshotmaxagems),
    });
  } else if (parsed.command === 'conform') {
    if (!parsed.schema) { console.error(usage()); return 2; }
    const root = parsed.root ? path.resolve(parsed.root) : process.cwd();
    const files = parsed.files?.length ? parsed.files.map((file) => path.resolve(file)) : listJsonFiles(root);
    result = runSchemaConformance({
      files,
      schemaPath: path.resolve(parsed.schema),
    });
  } else if (parsed.command === 'fi-validate') {
    if (!parsed.root || !parsed.workbook || !parsed.records || !parsed.manifest) { console.error(usage()); return 4; }
    result = validateFiBundle({
      root: path.resolve(parsed.root),
      workbook: path.resolve(parsed.workbook),
      recordsDir: path.resolve(parsed.records),
      manifest: path.resolve(parsed.manifest),
    });
    if (parsed.report) fs.writeFileSync(path.resolve(parsed.report), `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  } else {
    console.error(usage());
    return 2;
  }
  if (parsed.json) console.log(JSON.stringify(result, null, 2));
  else {
    console.log(`${result.status} (${result.errors.length} error(s))`);
    for (const error of result.errors) console.log(`- ${error.code}: ${error.message} [${error.path}]`);
  }
  return exitFor(result.status);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main());

export { main, usage };
