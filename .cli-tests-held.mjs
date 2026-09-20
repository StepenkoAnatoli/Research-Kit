test('researcher-release validate emits the contract status and exit code without writing inputs', async () => {
  const root = tempRoot();
  try {
    const records = path.join(root, 'records');
    const pointers = path.join(root, 'pointers');
    const registryPath = path.join(root, 'artifact-registry.json');
    const rolesPath = path.join(root, 'role-roster.json');
    const record = envelope();
    record.payloadSha256 = await sha256(canonical(record.payload));
    writeJson(path.join(records, 'R28-01.json'), record);
    writeJson(registryPath, registryFor());
    writeJson(rolesPath, roster());
    fs.mkdirSync(pointers);
    const before = fs.readFileSync(path.join(records, 'R28-01.json'), 'utf8');
    const run = spawnSync(process.execPath, [
      'research-kit/bin/researcher-release.mjs', 'validate',
      '--root', root, '--package', 'R28', '--registry', registryPath,
      '--roles', rolesPath, '--pointers', pointers, '--json',
    ], { encoding: 'utf8' });
    assertEqual(run.status, 0, run.stderr || run.stdout);
    const result = JSON.parse(run.stdout);
    assertEqual(result.status, 'PASS', run.stdout);
    assertEqual(result.package, 'R28');
    assertEqual(Object.keys(result.promotionTimelines).length, 6);
    assertEqual(JSON.stringify(result.recoveryReceiptIds), '[]');
    assertEqual(fs.readFileSync(path.join(records, 'R28-01.json'), 'utf8'), before, 'validate is read-only');
  } finally {
    cleanup(root);
  }
});

test('researcher-release conform validates explicit files and maps schema failure to exit 1', async () => {
  const root = tempRoot();
  try {
    const schema = path.resolve('research-kit/schemas/r28-r32-envelope.schema.json');
    const file = path.join(root, 'record.json');
    const record = envelope();
    record.payloadSha256 = await sha256(canonical(record.payload));
    writeJson(file, record);
    let run = spawnSync(process.execPath, [
      'research-kit/bin/researcher-release.mjs', 'conform', '--root', root,
      '--schema', schema, '--file', file, '--json',
    ], { encoding: 'utf8' });
    assertEqual(run.status, 0, run.stderr || run.stdout);
    assertEqual(JSON.parse(run.stdout).status, 'PASS');
    record.extra = true;
    writeJson(file, record);
    run = spawnSync(process.execPath, [
      'research-kit/bin/researcher-release.mjs', 'conform', '--schema', schema,
      '--file', file, '--json',
    ], { encoding: 'utf8' });
    assertEqual(run.status, 1, run.stdout || run.stderr);
    const result = JSON.parse(run.stdout);
    assertEqual(result.status, 'FAIL');
    assert(result.errors.some((error) => error.code === 'SCHEMA-ADDITIONAL'), JSON.stringify(result.errors));
  } finally {
    cleanup(root);
  }
});
