// The disclosure probe, offline.
//
// This module exists because a claim about privacy was written down before it was
// measured, and measuring it found the opposite. So the tests here are mostly about the
// probe's honesty rather than its plumbing: that it never authenticates, that it does not
// call "safe" something it did not check, and that it reports a refusal as a refusal
// rather than as an absence of evidence.

import { test, describe, assert } from './harness.mjs';
import { probeRun, summarise, render, exitCode, PROBES } from '../lib/disclosure.mjs';

describe('disclosure');

/** A fetch that records its requests and answers from a table keyed by URL fragment. */
function stub(table) {
  const calls = [];
  const doFetch = async (url, init = {}) => {
    calls.push({ url, init });
    const key = Object.keys(table).find((k) => url.includes(k));
    const entry = table[key] ?? { status: 404, body: '{}' };
    return {
      status: entry.status,
      text: async () => entry.body,
      json: async () => JSON.parse(entry.body),
    };
  };
  doFetch.calls = calls;
  return doFetch;
}

const OPEN = {
  '/actions/runs/1/jobs': { status: 200, body: JSON.stringify({ jobs: [{ id: 9, name: 'collect' }] }) },
  '/actions/runs/1/artifacts': { status: 200, body: JSON.stringify({ artifacts: [{ id: 5, name: 'research-kit-corpus-v1-x' }] }) },
  '/actions/runs/1/timing': { status: 200, body: '{}' },
  '/actions/runs/1': { status: 200, body: JSON.stringify({ id: 1, name: 'collect job-7' }) },
  '/actions/secrets': { status: 401, body: '{"message":"Requires authentication"}' },
  '/actions/artifacts/5/zip': { status: 401, body: '{"message":"Requires authentication"}' },
  '/actions/jobs/9/logs': { status: 403, body: '{"message":"Must have admin rights to Repository."}' },
};

test('no request carries an Authorization header, which is the whole method', async () => {
  // A probe that quietly used the operator's token would answer a different question and
  // look exactly like this one. Asserted against every request, not just the first.
  const doFetch = stub(OPEN);
  await probeRun({ repository: 'o/r', runId: 1, fetch: doFetch });
  assert.ok(doFetch.calls.length >= PROBES.length, 'the probe made no requests');
  for (const { init } of doFetch.calls) {
    const keys = Object.keys(init.headers ?? {}).map((k) => k.toLowerCase());
    assert.ok(!keys.includes('authorization'), 'a probe request carried an Authorization header');
    assert.ok(!keys.includes('cookie'), 'a probe request carried a cookie');
  }
});

test('the real shape: names readable, content refused, subject absent', async () => {
  // The measurement this module was written to make repeatable, as a fixture.
  const doFetch = stub(OPEN);
  const report = await probeRun({ repository: 'o/r', runId: 1, needle: 'layoff plan', fetch: doFetch });
  assert.equal(report.exposedNames, true, 'a public run exposes its shape, and that is expected');
  assert.equal(report.exposedContent, false, 'the artifact and the logs were both refused');
  assert.equal(report.exposedSubject, false, 'the topic appeared in no readable response');
  assert.deepEqual(report.leaked, []);
  assert.equal(doFetch.calls.length, 7, 'each probe plus artifact-download and logs is fetched once, not re-fetched');
});

test('a readable artifact download is reported as content exposure', async () => {
  const report = await probeRun({
    repository: 'o/r', runId: 1, needle: 'layoff plan',
    fetch: stub({ ...OPEN, '/actions/artifacts/5/zip': { status: 200, body: 'PK...binary...' } }),
  });
  assert.equal(report.exposedContent, true);
  assert.ok(report.readable.includes('artifact-download'));
});

test('the subject leaking is found wherever it appears, not only where expected', async () => {
  // The topic turning up in a field nobody thought to check is exactly the case worth
  // catching, so every response body is searched rather than a chosen few.
  const report = await probeRun({
    repository: 'o/r', runId: 1, needle: 'layoff plan',
    fetch: stub({ ...OPEN, '/actions/runs/1/timing': { status: 200, body: '{"note":"collect layoff plan q3"}' } }),
  });
  assert.equal(report.exposedSubject, true);
  assert.deepEqual(report.leaked, ['timing']);
});

test('the search is case-insensitive, because a name is not quoted back verbatim', async () => {
  const report = await probeRun({
    repository: 'o/r', runId: 1, needle: 'LAYOFF Plan',
    fetch: stub({ ...OPEN, '/actions/runs/1': { status: 200, body: '{"name":"collect layoff plan"}' } }),
  });
  assert.equal(report.exposedSubject, true);
});

test('without a topic the report says the subject was NOT CHECKED, never that it is safe', () => {
  // The failure this whole module exists to prevent: an unchecked thing reported as a
  // clean thing. `needleChecked` is what stops "false" from reading as "no".
  const report = summarise([{ id: 'run', readable: true, leaksNeedle: false }], null);
  assert.equal(report.needleChecked, false);
  assert.equal(report.exposedSubject, false, 'nothing leaked, because nothing was looked for');

  const text = render({ repository: 'o/r', runId: 1, findings: [], ...report });
  assert.match(text, /not checked/, 'the rendering must not let "false" pass for "no"');
  assert.ok(!/the subject itself exposed : false/.test(text));
});

test('an unreachable endpoint is a refusal to conclude, not a clean result', async () => {
  const doFetch = async () => { throw new Error('ENOTFOUND'); };
  const report = await probeRun({ repository: 'o/r', runId: 1, needle: 'x', fetch: doFetch });
  assert.equal(report.exposedNames, false);
  assert.equal(report.exposedContent, false);
  for (const f of report.findings) {
    assert.equal(f.readable, false);
    assert.match(f.note ?? '', /unreachable|nothing to try/);
  }
  // Found 2026-09-27: with no network the command exited 0, "only the shape is public" - the
  // clean result this test's name rules out. It had checked the findings and never the verdict.
  assert.equal(report.conclusive, false, 'a probe that never reached GitHub cannot support a clean verdict');
  assert.deepEqual([...report.unmeasured].sort(), PROBES.map((p) => p.id).sort());
  assert.equal(exitCode(report), 3, 'unreachable is "could not measure", exit 3 - not 0');
  const text = render(report);
  assert.match(text, /NOT MEASURED/);
  assert.doesNotMatch(text, /Only the SHAPE/, 'the rendering told the reader only the shape is public');
  assert.doesNotMatch(text, /refused 0/, 'an unreachable probe was reported as a refusal');
  assert.doesNotMatch(text, /refused -/, 'a probe that was never tried was reported as a refusal');
  assert.match(text, /not tried/);
});

// Found 2026-09-30 (outside break-test): an unreachable probe was noted as
// "unreachable: fetch failed" - Node's message - while the reason sat on err.cause.
test('an unreachable probe names the cause of the failed fetch, not the bare "fetch failed"', async () => {
  const doFetch = async () => {
    throw Object.assign(new TypeError('fetch failed'), { cause: Object.assign(new Error('getaddrinfo ENOTFOUND api.github.com'), { code: 'ENOTFOUND' }) });
  };
  const report = await probeRun({ repository: 'o/r', runId: 1, fetch: doFetch });
  const tried = report.findings.filter((f) => /unreachable/.test(f.note ?? ''));
  assert.ok(tried.length, 'no probe was attempted');
  for (const f of tried) assert.match(f.note, /ENOTFOUND api\.github\.com/, f.note);
});

test('an exposure found stands even when another probe could not be made', async () => {
  const table = {
    ...OPEN,
    '/actions/artifacts/5/zip': { status: 200, body: 'PK' },
  };
  const answered = stub(table);
  const doFetch = async (url, init) => {
    if (url.includes('/actions/secrets')) throw new Error('ECONNRESET');
    return answered(url, init);
  };
  const report = await probeRun({ repository: 'o/r', runId: 1, fetch: doFetch });
  assert.equal(report.exposedContent, true, 'the readable artifact is a finding whatever else failed');
  assert.equal(report.conclusive, false);
  assert.deepEqual(report.unmeasured, ['secrets']);
  assert.equal(exitCode(report), 1);
});

test('every probe answered and nothing readable beyond the shape: conclusive, exit 0', async () => {
  const report = await probeRun({ repository: 'o/r', runId: 1, needle: 'layoff plan', fetch: stub(OPEN) });
  assert.equal(report.conclusive, true, 'a refusal is an answer: 401 and 403 were measured');
  assert.deepEqual(report.unmeasured, []);
  assert.equal(exitCode(report), 0);
  assert.match(render(report), /Only the SHAPE/);
});

test('the rendering names the control it is arguing for', async () => {
  const report = await probeRun({ repository: 'o/r', runId: 1, needle: 'layoff plan', fetch: stub(OPEN) });
  const text = render(report);
  assert.match(text, /names are the disclosure surface/,
    'a reader who sees only the shape exposed should be told why that is the design rather than a lapse');
  assert.match(text, /REFUSED|refused/);
});

test('a content leak points at the plan problem, not just at the visibility setting', async () => {
  const report = await probeRun({
    repository: 'o/r', runId: 1, needle: 'x',
    fetch: stub({ ...OPEN, '/actions/jobs/9/logs': { status: 200, body: 'TOPIC: whatever' } }),
  });
  const text = render(report);
  assert.match(text, /environment secrets IGNORED/,
    'telling somebody to go private without saying what that breaks on a free plan is half an answer');
});
