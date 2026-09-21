// The producer: what it derives, what it refuses, and what it never lets a caller say.
//
// The load-bearing test in this file is `a caller cannot ask for authorization`. Every
// other property here is a correctness property; that one is the security property, and
// it is asserted against the module's whole surface rather than against one function,
// because the way this gets lost is somebody adding a convenient option later.

import { test, describe, assert, fs, path, os, cleanup } from './harness.mjs';
import { sha256, canonicalJson, resolve, readText, writeText } from '../lib/core.mjs';
import {
  createArtifact, deriveState, collectProjectFiles, packageName, checkClientRef,
  findingsReviewState, roleOf, mediaTypeOf, EXCLUDED, GITHUB_API_VERSION,
} from '../lib/artifact.mjs';
import { validateArtifact, MANIFEST_PATH, MANIFEST_DIGEST_PATH } from '../lib/artifact-validator.mjs';
import { openZip } from '../lib/artifact-zip.mjs';
import { readCorpus } from '../lib/corpus.mjs';
import { collectedProject, approvedProject, IDENTITY } from './artifact-fixtures.mjs';

describe('artifact-producer');

const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'rk-producer-'));

function build(root, overrides = {}) {
  return createArtifact({ root, ...IDENTITY, ...overrides });
}

// ---------------------------------------------------------------- authorization is derived

test('a caller cannot ask for authorization: there is no such option', () => {
  const root = collectedProject();
  // Every plausible spelling somebody might reach for. None of them may reach the manifest.
  const built = build(root, {
    buildAuthorized: true,
    state: 'APPROVED_BRIEF',
    kind: 'APPROVED_RESEARCH',
    review: { mapClassified: true, findingsReviewed: true, briefReviewed: true },
    gate: { verdict: 'PASS', buildAuthorized: true, blockingFindings: [] },
  });
  assert.equal(built.manifest.buildAuthorized, false,
    'a caller-supplied buildAuthorized reached the manifest - authorization must be derived from the project, never requested');
  assert.notEqual(built.manifest.state, 'APPROVED_BRIEF');
  assert.equal(built.manifest.gate.buildAuthorized, false);
});

test('the producer ignores an ambient GATE_OFF: the gate it runs is the real one', () => {
  const root = collectedProject();
  // An override in the environment of whatever shell ran the producer must not become a
  // property of a package that will outlive that shell.
  const built = createArtifact({ root, ...IDENTITY, env: { RESEARCH_KIT_GATE: 'off', RESEARCH_GATE_OFF: '1' } });
  assert.equal(built.manifest.buildAuthorized, false);
  assert.ok(['REVIEW_IN_PROGRESS', 'HUMAN_REVIEW_REQUIRED', 'PREFLIGHT_BLOCKED'].includes(built.manifest.state),
    `unexpected state ${built.manifest.state}`);
});

test('a reviewed corpus reaches APPROVED_BRIEF, and every dependent field agrees', () => {
  const built = build(approvedProject());
  const m = built.manifest;
  assert.equal(m.state, 'APPROVED_BRIEF');
  assert.equal(m.kind, 'APPROVED_RESEARCH');
  assert.equal(m.buildAuthorized, true);
  assert.equal(m.gate.verdict, 'PASS');
  assert.equal(m.gate.buildAuthorized, true);
  assert.deepEqual(m.gate.blockingFindings, []);
  assert.deepEqual(m.review, { mapClassified: true, findingsReviewed: true, briefReviewed: true });
});

test('an unreviewed corpus does NOT, and says which step is outstanding', () => {
  const built = build(collectedProject());
  assert.equal(built.manifest.buildAuthorized, false);
  const ids = built.manifest.nextActions.map((a) => a.id);
  assert.ok(ids.includes('REVIEW_FINDINGS'), `expected REVIEW_FINDINGS in ${ids.join(', ')}`);
  assert.ok(ids.includes('REVIEW_BRIEF'), `expected REVIEW_BRIEF in ${ids.join(', ')}`);
  for (const action of built.manifest.nextActions) {
    assert.ok(action.path.startsWith('project/') || action.path.startsWith('reports/'),
      `nextAction ${action.id} points at ${action.path}, which is not in the package`);
  }
});

test('an unrewritten Finding is detected by re-running the extractor over the capture', () => {
  const root = collectedProject();
  const before = findingsReviewState(root, readCorpus(root));
  assert.equal(before.reviewed, false, 'the fixture ships the extractor\'s own sentence');
  assert.ok(before.unrewritten.includes('E-01'));

  const evidence = resolve(root, 'research/EVIDENCE.md');
  writeText(evidence, readText(evidence).replace(
    'The free plan allows 10 requests per minute and includes 1,000 credits.',
    'Ten requests a minute is the ceiling this collector must schedule against.',
  ));
  const after = findingsReviewState(root, readCorpus(root));
  assert.equal(after.reviewed, true, 'a rewritten Finding must read as reviewed');
  assert.deepEqual(after.unrewritten, []);
});

// ---------------------------------------------------------------- what travels

test('machine-local state and credentials never travel', () => {
  const root = collectedProject();
  for (const rel of EXCLUDED) {
    fs.mkdirSync(path.dirname(resolve(root, rel)), { recursive: true });
    writeText(resolve(root, rel), 'local-only\n');
  }
  writeText(resolve(root, '.env'), 'FIRECRAWL_API_KEY=fc-should-never-travel\n');
  // Assembled rather than written, like every other credential-shaped fixture here: a
  // literal PEM header in this file would trip the kit's own secret scan, and a scanner
  // that is always red about its own test tree is one nobody reads (hardening F26).
  writeText(resolve(root, 'research/secret.pem'), `${'-'.repeat(5)}BEGIN PRIVATE KEY${'-'.repeat(5)}\n`);

  const names = collectProjectFiles(root);
  for (const rel of EXCLUDED) assert.ok(!names.includes(rel), `${rel} must not be packaged`);
  assert.ok(!names.some((n) => n.endsWith('.env')), '.env must not be packaged');
  assert.ok(!names.some((n) => n.endsWith('.pem')), 'a private key must not be packaged');

  const built = build(root);
  const packed = built.manifest.files.map((f) => f.path);
  assert.ok(!packed.some((p) => p.includes('.usage.jsonl') || p.includes('GATE_OFF') || p.endsWith('.env') || p.endsWith('.pem')),
    `excluded file reached the package: ${packed.join(', ')}`);
});

test('the ledger always travels, dotfile and all', () => {
  const built = build(collectedProject());
  const ledger = built.manifest.files.filter((f) => f.role === 'PROVENANCE_LEDGER');
  assert.equal(ledger.length, 1, 'there is exactly one chain, and it must be in the package');
  assert.equal(ledger[0].path, 'project/research/raw/.fetches.jsonl');
});

test('every ZIP entry except the manifest pair is declared, and the pair never is', () => {
  const built = build(approvedProject());
  const zip = openZip(built.bytes);
  const declared = new Set(built.manifest.files.map((f) => f.path));
  for (const name of zip.names) {
    if (name === MANIFEST_PATH || name === MANIFEST_DIGEST_PATH) {
      assert.ok(!declared.has(name), `${name} must not be listed in files`);
      continue;
    }
    assert.ok(declared.has(name), `${name} is in the package but not declared`);
  }
  assert.equal(declared.size, zip.names.length - 2);
});

test('the manifest and its digest are the last two entries', () => {
  const built = build(collectedProject());
  const names = built.entries.map((e) => e.name);
  assert.equal(names[names.length - 2], MANIFEST_PATH);
  assert.equal(names[names.length - 1], MANIFEST_DIGEST_PATH);
});

test('the digest is taken over the exact manifest bytes', () => {
  const built = build(collectedProject());
  const zip = openZip(built.bytes);
  const bytes = zip.read(MANIFEST_PATH);
  const line = zip.read(MANIFEST_DIGEST_PATH).toString('utf8');
  assert.equal(line, `${sha256(bytes)}  manifest.json\n`);
  assert.ok(!bytes.toString('utf8').includes(sha256(bytes)), 'the manifest must not contain its own digest');
});

test('roles and media types are assigned, not guessed at read time', () => {
  assert.equal(roleOf('project/research/raw/.fetches.jsonl'), 'PROVENANCE_LEDGER');
  assert.equal(roleOf('project/research/raw/2026-01-01-x.md'), 'RAW_CAPTURE');
  assert.equal(roleOf('project/research/BRIEF.md'), 'RESEARCH_BRIEF');
  assert.equal(roleOf('schemas/artifact-manifest.schema.json'), 'SCHEMA');
  assert.equal(roleOf('project/whatever.txt'), 'OTHER');
  assert.equal(mediaTypeOf('a.jsonl'), 'application/x-ndjson');
  assert.equal(mediaTypeOf('a.json'), 'application/json');
  assert.equal(mediaTypeOf('a.md'), 'text/markdown');
});

// ---------------------------------------------------------------- client_ref and naming

test('an invalid client_ref is refused, never rewritten', () => {
  for (const bad of ['../escape', 'has space', '-leading-dash', 'a'.repeat(65), 'sl/ash']) {
    const check = checkClientRef(bad);
    assert.equal(check.ok, false, `${JSON.stringify(bad)} should be refused`);
    assert.ok(/refusing rather than rewriting/.test(check.detail));
  }
  for (const good of ['auth-research-001', 'A', 'a.b_c-d', '0'.repeat(64)]) {
    assert.equal(checkClientRef(good).ok, true, `${JSON.stringify(good)} should be accepted`);
  }
  assert.deepEqual(checkClientRef(null), { ok: true, value: null }, 'client_ref is optional');
});

test('the package name never carries the topic, and falls back to the run id', () => {
  assert.equal(packageName({ clientRef: 'job-7', workflowRunId: 99 }), 'research-kit-corpus-v1-job-7.zip');
  assert.equal(packageName({ clientRef: null, workflowRunId: 35548135379 }), 'research-kit-corpus-v1-run-35548135379.zip');

  const root = collectedProject();
  // A topic nobody would want in a filename, to prove the filename is not built from it.
  writeText(resolve(root, 'research/MAP.md'),
    readText(resolve(root, 'research/MAP.md')).replace('Fixture topic', 'Whether to make Dana redundant'));
  const built = build(root, { clientRef: 'job-7' });
  assert.equal(built.name, 'research-kit-corpus-v1-job-7.zip');
  assert.ok(built.manifest.topic.includes('Dana'), 'the topic belongs in the manifest, where opening the package is a deliberate act');
  assert.ok(!built.name.includes('Dana'), 'the topic must never be in the filename');
});

test('the run id is required, and the API version is recorded with it', () => {
  const root = collectedProject();
  assert.throws(() => createArtifact({ root, ...IDENTITY, workflowRunId: undefined }), /workflowRunId is required/);
  assert.throws(() => createArtifact({ root, ...IDENTITY, workflowRunId: 0 }), /workflowRunId is required/);

  const built = build(root);
  assert.equal(built.manifest.source.apiVersion, GITHUB_API_VERSION,
    'the run id means nothing without the API version that returned it');
  assert.equal(built.manifest.source.workflowRunId, IDENTITY.workflowRunId);
  assert.ok(built.manifest.source.runUrl.startsWith('https://api.github.com/'));
  assert.ok(built.manifest.source.htmlUrl.startsWith('https://github.com/'));
});

// ---------------------------------------------------------------- determinism

test('identical project bytes and fixed metadata produce identical manifests and digests', () => {
  const root = approvedProject();
  const a = build(root);
  const b = build(root);

  assert.equal(canonicalJson(a.manifest), canonicalJson(b.manifest), 'the manifest must be a function of the inputs');
  assert.deepEqual(a.entries.map((e) => e.name), b.entries.map((e) => e.name), 'entry order must be deterministic');
  for (let i = 0; i < a.entries.length; i += 1) {
    assert.equal(sha256(a.entries[i].data), sha256(b.entries[i].data), `entry ${a.entries[i].name} differs between runs`);
  }
  // The ZIP itself, because `buildZip` pins its timestamp. Asserted rather than assumed:
  // a writer that stamped the clock would break byte-identity without breaking anything above.
  assert.equal(sha256(a.bytes), sha256(b.bytes), 'two runs over identical bytes must produce the identical archive');
});

test('entry order is sorted by ZIP path, not by walk order', () => {
  const built = build(approvedProject());
  const payload = built.entries.map((e) => e.name).slice(0, -2);
  assert.deepEqual(payload, [...payload].sort(), 'payload entries must be in sorted order');
});

// ---------------------------------------------------------------- end to end

test('the package a producer writes passes the consumer\'s own validator', () => {
  for (const [label, root] of [['collected', collectedProject()], ['approved', approvedProject()]]) {
    const built = build(root, { clientRef: 'end-to-end' });
    const file = path.join(scratch, `${label}.zip`);
    fs.writeFileSync(file, built.bytes);
    const result = validateArtifact({ file, expectedClientRef: 'end-to-end', tempRoot: scratch });
    assert.equal(result.status, 'PASS',
      `${label}: ${result.errors.map((e) => `${e.code} ${e.message}`).join('; ')}`);
    assert.equal(result.buildAuthorized, label === 'approved');
  }
});

test('the producer does not modify the project it packages', () => {
  const root = approvedProject();
  const before = new Map();
  const walk = (dir, rel = '') => {
    for (const name of fs.readdirSync(dir)) {
      const abs = path.join(dir, name);
      const childRel = rel ? `${rel}/${name}` : name;
      if (fs.statSync(abs).isDirectory()) { walk(abs, childRel); continue; }
      before.set(childRel, sha256(fs.readFileSync(abs)));
    }
  };
  walk(root);
  build(root);
  const after = new Map();
  const walkAfter = (dir, rel = '') => {
    for (const name of fs.readdirSync(dir)) {
      const abs = path.join(dir, name);
      const childRel = rel ? `${rel}/${name}` : name;
      if (fs.statSync(abs).isDirectory()) { walkAfter(abs, childRel); continue; }
      after.set(childRel, sha256(fs.readFileSync(abs)));
    }
  };
  walkAfter(root);
  assert.deepEqual([...after.keys()].sort(), [...before.keys()].sort(), 'packaging added or removed a file');
  for (const [rel, hash] of before) assert.equal(after.get(rel), hash, `packaging modified ${rel}`);
});

test('README-FIRST states the same thing the manifest does', () => {
  const collectedBuilt = build(collectedProject());
  const collectedReadme = collectedBuilt.entries.find((e) => e.name === 'README-FIRST.md').data.toString('utf8');
  assert.ok(collectedReadme.includes('HUMAN REVIEW REQUIRED'));
  assert.ok(collectedReadme.includes('not an approved research brief'));
  assert.equal(collectedBuilt.manifest.buildAuthorized, false);

  const approvedBuilt = build(approvedProject());
  const approvedReadme = approvedBuilt.entries.find((e) => e.name === 'README-FIRST.md').data.toString('utf8');
  assert.ok(approvedReadme.includes('BUILDING IS AUTHORIZED'));
  assert.equal(approvedBuilt.manifest.buildAuthorized, true);
  assert.ok(!approvedReadme.includes('HUMAN REVIEW REQUIRED'),
    'the human file must not contradict the manifest it ships beside');
});

test('deriveState runs the gate rather than reading a cached verdict', () => {
  const root = approvedProject();
  const good = deriveState(root);
  assert.equal(good.gate.verdict, 'PASS');

  // Break the corpus and the verdict must follow, without the producer being told.
  writeText(resolve(root, 'research/DISCOVERY.md'),
    readText(resolve(root, 'research/DISCOVERY.md')).replace('CLOSED', 'OPEN'));
  const bad = deriveState(root);
  assert.notEqual(bad.gate.verdict, 'PASS');
  assert.equal(bad.buildAuthorized, false);
  assert.ok(bad.gate.blockingFindings.length > 0, 'a failing gate must name what blocked it');
});

test('the scratch directory is removed', () => {
  cleanup(scratch);
  assert.ok(!fs.existsSync(scratch));
});
