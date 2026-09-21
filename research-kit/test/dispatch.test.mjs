// The dispatch seam, offline.
//
// Every request goes through an injected `fetch`, so this file reaches no network, holds
// no credential, and can assert things a live test never could: what header was actually
// sent, that a token never appears in an error, that a 204 is diagnosed rather than
// swallowed. The live path is verified separately, by running it.

import { test, describe, assert } from './harness.mjs';
import {
  dispatchCollection, waitForRun, listArtifacts, downloadArtifact, unwrapArtifact,
  tokenFromEnv, redact, DispatchError, API_VERSION, TOKEN_VARS,
} from '../lib/dispatch.mjs';
import { rawZip } from './artifact-fixtures.mjs';

describe('dispatch');

const TOKEN = `github_pat_${'A1b2C3d4E5'.repeat(4)}`;
const REPO = 'example-org/example-project';

/** A fetch that records what it was asked and answers from a script. */
function stubFetch(responses) {
  const calls = [];
  const queue = [...responses];
  const doFetch = async (url, init = {}) => {
    calls.push({ url, init });
    const next = queue.length > 1 ? queue.shift() : queue[0];
    if (typeof next === 'function') return next(url, init);
    return next;
  };
  doFetch.calls = calls;
  return doFetch;
}

function jsonResponse(status, body, extra = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
    arrayBuffer: async () => new TextEncoder().encode(JSON.stringify(body)).buffer,
    ...extra,
  };
}

// ---------------------------------------------------------------- the token

test('the token comes from the environment, in a declared order', () => {
  assert.deepEqual([...TOKEN_VARS], ['RESEARCH_KIT_GITHUB_TOKEN', 'GITHUB_TOKEN']);
  assert.equal(tokenFromEnv({ GITHUB_TOKEN: 'b' }).token, 'b');
  assert.equal(tokenFromEnv({ RESEARCH_KIT_GITHUB_TOKEN: 'a', GITHUB_TOKEN: 'b' }).token, 'a',
    'the kit-specific variable must win, so a general GITHUB_TOKEN cannot silently outrank a deliberate one');
  assert.equal(tokenFromEnv({ RESEARCH_KIT_GITHUB_TOKEN: '   ' }).token, null, 'whitespace is not a token');
  assert.equal(tokenFromEnv({}).token, null);
  assert.match(tokenFromEnv({}).detail, /RESEARCH_KIT_GITHUB_TOKEN/);
});

test('there is no way to pass a token as an argument', () => {
  // Asserted against the SOURCE, because the property is the absence of a feature and an
  // absence cannot be called.
  const source = dispatchCollection.toString();
  assert.ok(!/--token|flags\.token/.test(source), 'dispatchCollection reads a token flag');
});

test('redaction is pattern-based, so it also catches a credential it was never given', () => {
  const mine = `Bearer ${TOKEN}`;
  assert.ok(!redact(mine).includes(TOKEN));
  // A different credential entirely - from a redirect, a proxy, an echoed header.
  assert.ok(!redact('ghp_' + 'z'.repeat(36)).includes('z'.repeat(36)));
  assert.ok(!redact('fc-' + 'a1b2c3d4'.repeat(3)).includes('a1b2c3d4a1b2c3d4'));
  assert.ok(!redact('authorization: abcdefghijklmnop').includes('abcdefghijklmnop'));
  assert.equal(redact('nothing secret here'), 'nothing secret here');
});

// ---------------------------------------------------------------- dispatching

test('the API version is pinned on the request, not merely documented', async () => {
  const doFetch = stubFetch([jsonResponse(200, { workflow_run_id: 7, run_url: 'u', html_url: 'h' })]);
  await dispatchCollection({ repository: REPO, token: TOKEN, fetch: doFetch, inputs: { topic: 'x' } });

  const { url, init } = doFetch.calls[0];
  assert.match(url, /\/repos\/example-org\/example-project\/actions\/workflows\/collect\.yml\/dispatches$/);
  assert.equal(init.headers['X-GitHub-Api-Version'], API_VERSION,
    'without the pinned version the endpoint returns 204 and the caller cannot identify its run');
  assert.equal(init.method, 'POST');
});

test('BOTH routes to a run id are requested, not just the pinned version', async () => {
  // The pin makes run details the default; `return_run_details` asks for them outright, and
  // works on 2022-11-28 as well. Measured on 2026-09-21 against this repository: the old
  // version with the parameter returns 200 + workflow_run_id, and the new version accepts
  // the parameter rather than rejecting it as unknown. Sending both means a server that
  // ignores or downgrades the header still answers with a run id.
  //
  // Asserted on the REQUEST BODY because that is the whole change - a stub returning 200
  // would pass whatever we sent, so only the outgoing bytes prove it.
  const doFetch = stubFetch([jsonResponse(200, { workflow_run_id: 7, run_url: 'u', html_url: 'h' })]);
  await dispatchCollection({ repository: REPO, token: TOKEN, fetch: doFetch, inputs: { topic: 'x' } });

  const sent = JSON.parse(doFetch.calls[0].init.body);
  assert.equal(sent.return_run_details, true);
  assert.equal(doFetch.calls[0].init.headers['X-GitHub-Api-Version'], API_VERSION);
  assert.equal(sent.ref, 'main', 'the belt-and-braces parameter must not disturb the rest of the body');
  assert.deepEqual(sent.inputs, { topic: 'x' });
});

test('a 200 with the run id is the whole point', async () => {
  const doFetch = stubFetch([jsonResponse(200, { workflow_run_id: 35590767944, run_url: 'r', html_url: 'h' })]);
  const out = await dispatchCollection({ repository: REPO, token: TOKEN, fetch: doFetch });
  assert.deepEqual(out, { workflowRunId: 35590767944, runUrl: 'r', htmlUrl: 'h' });
});

test('a 204 is a NAMED failure explaining the cause, not an empty success', async () => {
  // The failure a caller is least equipped to diagnose: the run started and they have no
  // idea which one. Returning a partial result here would hand them a useless object.
  const doFetch = stubFetch([{ ok: false, status: 204, text: async () => '', json: async () => null }]);
  await assert.rejects(
    () => dispatchCollection({ repository: REPO, token: TOKEN, fetch: doFetch }),
    (err) => {
      assert.ok(err instanceof DispatchError);
      assert.equal(err.code, 'NO_RUN_ID');
      assert.match(err.message, /cannot be identified/);
      // The remedy named 2022-11-28 while the pinned header was the only route to a run id.
      // There are now two, so a 204 means BOTH were ignored - a narrower and more useful
      // diagnosis, and the assertion follows the explanation rather than the old wording.
      assert.match(err.remedy, /return_run_details/);
      assert.match(err.remedy, /X-GitHub-Api-Version/);
      return true;
    },
  );
});

test('a 200 without a run id is refused too, not returned as undefined', async () => {
  const doFetch = stubFetch([jsonResponse(200, { something_else: true })]);
  await assert.rejects(() => dispatchCollection({ repository: REPO, token: TOKEN, fetch: doFetch }),
    (err) => err.code === 'NO_RUN_ID');
});

test('404 and 403 get remedies that name the real cause', async () => {
  const notFound = stubFetch([jsonResponse(404, { message: 'Not Found' })]);
  await assert.rejects(() => dispatchCollection({ repository: REPO, token: TOKEN, fetch: notFound }),
    (err) => {
      assert.equal(err.code, 'NOT_FOUND');
      // 404 means "absent" OR "you may not see it", so the remedy must cover both.
      assert.match(err.remedy, /DEFAULT branch/);
      assert.match(err.remedy, /Actions: read and write/);
      return true;
    });

  const forbidden = stubFetch([jsonResponse(403, { message: 'Forbidden' })]);
  await assert.rejects(() => dispatchCollection({ repository: REPO, token: TOKEN, fetch: forbidden }),
    (err) => err.code === 'FORBIDDEN' && /Actions/.test(err.remedy));
});

test('no error message ever carries the token, whatever the server said', async () => {
  // The server echoing the credential back is the case a hand-written message forgets.
  const leaky = stubFetch([jsonResponse(500, { message: `bad credentials for ${TOKEN}` })]);
  await assert.rejects(() => dispatchCollection({ repository: REPO, token: TOKEN, fetch: leaky }),
    (err) => {
      assert.ok(!err.message.includes(TOKEN), `the token leaked into an error: ${err.message}`);
      assert.match(err.message, /redacted/);
      return true;
    });
});

test('a network failure is distinguished from a rejection', async () => {
  const doFetch = async () => { throw new Error('getaddrinfo ENOTFOUND'); };
  await assert.rejects(() => dispatchCollection({ repository: REPO, token: TOKEN, fetch: doFetch }),
    (err) => err.code === 'NETWORK' && /safe to repeat/.test(err.remedy));
});

test('a malformed repository is refused before any request is made', async () => {
  const doFetch = stubFetch([jsonResponse(200, { workflow_run_id: 1 })]);
  for (const bad of ['no-slash', '/leading', 'trailing/', 'a/b/c']) {
    await assert.rejects(() => dispatchCollection({ repository: bad, token: TOKEN, fetch: doFetch }),
      (err) => err.code === 'REPOSITORY');
  }
  assert.equal(doFetch.calls.length, 0, 'a bad repository must not produce a request');
});

test('inputs are stringified, and empty ones are dropped rather than sent blank', async () => {
  const doFetch = stubFetch([jsonResponse(200, { workflow_run_id: 1 })]);
  await dispatchCollection({
    repository: REPO, token: TOKEN, fetch: doFetch,
    inputs: { topic: 'x', max_pages: 8, client_ref: '', runner: undefined },
  });
  const body = JSON.parse(doFetch.calls[0].init.body);
  assert.deepEqual(body.inputs, { topic: 'x', max_pages: '8' },
    'workflow inputs are strings on the wire, and an empty client_ref must not be sent as ""');
});

// ---------------------------------------------------------------- waiting

test('waiting reports "waiting" as a status rather than treating it as a stall', async () => {
  const seen = [];
  const doFetch = stubFetch([
    jsonResponse(200, { status: 'waiting' }),
    jsonResponse(200, { status: 'in_progress' }),
    jsonResponse(200, { status: 'completed', conclusion: 'success' }),
  ]);
  const run = await waitForRun({
    repository: REPO, runId: 1, token: TOKEN, fetch: doFetch,
    intervalMs: 0, sleep: async () => {}, onStatus: (r) => seen.push(r.status),
  });
  assert.equal(run.conclusion, 'success');
  assert.deepEqual(seen, ['waiting', 'in_progress', 'completed'],
    'a protection rule holding a job is a status, not a failure to give up on');
});

test('a timeout says the run is still going, not that it failed', async () => {
  let clock = 0;
  const doFetch = stubFetch([jsonResponse(200, { status: 'in_progress', html_url: 'h' })]);
  await assert.rejects(
    () => waitForRun({
      repository: REPO, runId: 1, token: TOKEN, fetch: doFetch,
      intervalMs: 1, timeoutMs: 10, sleep: async () => { clock += 20; }, now: () => clock,
    }),
    (err) => {
      assert.equal(err.code, 'TIMEOUT');
      assert.match(err.remedy, /still going/);
      return true;
    },
  );
});

// ---------------------------------------------------------------- the artifact

test('an expired artifact is named as expired, with the reason it is gone', async () => {
  const doFetch = stubFetch([{ ok: false, status: 410, text: async () => '', arrayBuffer: async () => new ArrayBuffer(0) }]);
  await assert.rejects(() => downloadArtifact({ repository: REPO, artifactId: 1, token: TOKEN, fetch: doFetch }),
    (err) => {
      assert.equal(err.code, 'EXPIRED');
      assert.match(err.remedy, /transport|persists|retention/);
      return true;
    });
});

test('listArtifacts returns the array, not the envelope', async () => {
  const doFetch = stubFetch([jsonResponse(200, { total_count: 1, artifacts: [{ id: 5, name: 'research-kit-corpus-v1-x' }] })]);
  const out = await listArtifacts({ repository: REPO, runId: 1, token: TOKEN, fetch: doFetch });
  assert.equal(out.length, 1);
  assert.equal(out[0].id, 5);
});

test("GitHub's outer ZIP is unwrapped, and a bare package is left alone", () => {
  const inner = rawZip([{ name: 'manifest.json', data: '{}' }]);
  const outer = rawZip([{ name: 'research-kit-corpus-v1-job-1.zip', data: inner }]);

  const wrapped = unwrapArtifact(outer);
  assert.equal(wrapped.unwrapped, true);
  assert.equal(wrapped.name, 'research-kit-corpus-v1-job-1.zip');
  assert.deepEqual([...wrapped.bytes], [...inner], 'the inner package must come out byte-identical');

  // A package that is not wrapped must pass through untouched rather than being
  // half-opened: the validator judges one format, not a guess about packaging depth.
  const bare = unwrapArtifact(inner);
  assert.equal(bare.unwrapped, false);
  assert.deepEqual([...bare.bytes], [...inner]);
});

test('unwrapping refuses to guess when there is more than one candidate', () => {
  const outer = rawZip([
    { name: 'a.zip', data: rawZip([{ name: 'x', data: '1' }]) },
    { name: 'b.zip', data: rawZip([{ name: 'y', data: '2' }]) },
  ]);
  assert.equal(unwrapArtifact(outer).unwrapped, false, 'two candidates is not a package to unwrap, it is a package to refuse');
});

test('unwrapping a hostile outer archive does not throw', () => {
  // The outer ZIP comes from a transport, so it gets the same distrust as the inner one:
  // a container with structural problems is passed through for the validator to refuse,
  // never opened here.
  const hostile = rawZip([{ name: '../escape.zip', data: rawZip([{ name: 'x', data: '1' }]) }]);
  const out = unwrapArtifact(hostile);
  assert.equal(out.unwrapped, false);
  assert.equal(unwrapArtifact(Buffer.from('not a zip at all')).unwrapped, false);
});
