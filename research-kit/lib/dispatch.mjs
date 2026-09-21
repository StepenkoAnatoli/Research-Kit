// dispatch.mjs - asking the collector to run, from outside GitHub.
//
// This is the seam an AI agent or a desktop app uses. It does four things: start a run,
// learn which run it started, wait for it, and bring the artifact home. Nothing here
// judges research; the artifact validator does that, and this module hands off to it.
//
// THE TOKEN IS READ FROM THE ENVIRONMENT AND NEVER FROM AN ARGUMENT.
//
// A token on a command line is in the shell history, in `ps` output, in any CI log that
// echoes its own command, and in the crash report of anything that dumps argv. There is
// no flag for it and `tokenFromEnv` is the only way in, so there is no path where a caller
// can put one somewhere it will be recorded. Every error message here goes through
// `redact`, because the most common way a credential escapes is an exception that quoted
// the request that carried it.
//
// THE API VERSION IS PINNED, AND A MISSING RUN ID IS A NAMED FAILURE.
//
// Under `2022-11-28` - still GitHub's default - the dispatch endpoint returns `204 No
// Content` and the caller cannot learn which run it started. Under `2026-03-10` it returns
// `200` with `workflow_run_id`. This module pins the second and treats a 204 as a specific,
// explained error rather than as an empty success, because "the run started and I have no
// idea which one" is the failure a caller is least equipped to diagnose from a status code.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { openZip } from './artifact-zip.mjs';
import { validateArtifact } from './artifact-validator.mjs';

/** The version whose dispatch response carries the run id. Changing this is a decision. */
export const API_VERSION = '2026-03-10';

const GITHUB_API = 'https://api.github.com';

/** Environment names checked, in order. The first non-empty one wins. */
export const TOKEN_VARS = Object.freeze(['RESEARCH_KIT_GITHUB_TOKEN', 'GITHUB_TOKEN']);

export class DispatchError extends Error {
  constructor(code, message, { status = null, remedy = null } = {}) {
    super(message);
    this.code = code;
    this.status = status;
    this.remedy = remedy;
  }
}

/**
 * Replace anything token-shaped with a marker.
 *
 * Deliberately pattern-based rather than "remove the token we happen to hold": an error
 * can carry a DIFFERENT credential - one from a redirect, a proxy, a header echoed by the
 * server - and a redactor that only knows its own would pass that straight through.
 */
export function redact(text) {
  return String(text)
    .replace(/\bgh[pousr]_[A-Za-z0-9]{16,}\b/g, 'gh?_<redacted>')
    .replace(/\bgithub_pat_[A-Za-z0-9_]{20,}\b/g, 'github_pat_<redacted>')
    .replace(/\bfc-[A-Za-z0-9]{16,}\b/g, 'fc-<redacted>')
    .replace(/(authorization|bearer|token)(["'\s:=]+)[A-Za-z0-9._~+/-]{12,}/gi, '$1$2<redacted>');
}

/** The token, from the environment only. Never an argument, never a file. */
export function tokenFromEnv(env = process.env) {
  for (const name of TOKEN_VARS) {
    const value = env[name];
    if (typeof value === 'string' && value.trim() !== '') return { token: value.trim(), from: name };
  }
  return {
    token: null,
    from: null,
    detail: `no GitHub token in the environment. Set one of: ${TOKEN_VARS.join(', ')}`,
  };
}

function headers(token) {
  return {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': API_VERSION,
    Authorization: `Bearer ${token}`,
    'User-Agent': 'research-kit',
  };
}

function splitRepository(repository) {
  const parts = String(repository ?? '').split('/');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new DispatchError('REPOSITORY', `repository must be "owner/name", got ${JSON.stringify(String(repository))}`);
  }
  return parts;
}

async function readError(response) {
  let body = '';
  try { body = (await response.text()).slice(0, 400); } catch { /* a body we cannot read is not a body */ }
  return redact(body);
}

// ---------------------------------------------------------------- dispatch

/**
 * `dispatchCollection(...)` -> `{ workflowRunId, runUrl, htmlUrl }`.
 *
 * Throws a `DispatchError` rather than returning a partial result: a caller that cannot
 * identify the run it started has nothing useful to carry on with.
 */
export async function dispatchCollection({
  repository,
  workflow = 'collect.yml',
  ref = 'main',
  inputs = {},
  token,
  fetch: doFetch = globalThis.fetch,
  api = GITHUB_API,
} = {}) {
  const [owner, name] = splitRepository(repository);
  if (!token) throw new DispatchError('TOKEN', 'no token was supplied', { remedy: `set ${TOKEN_VARS[0]}` });

  const url = `${api}/repos/${owner}/${name}/actions/workflows/${encodeURIComponent(workflow)}/dispatches`;
  let response;
  try {
    response = await doFetch(url, {
      method: 'POST',
      headers: { ...headers(token), 'Content-Type': 'application/json' },
      // BOTH belts. The pinned API version makes run details the default, and
      // `return_run_details` asks for them explicitly - the parameter GitHub added on
      // 2026-02-19 for callers still on 2022-11-28 (E-13 of the delivery corpus).
      //
      // Sending both is measured-safe, not assumed-safe. Four calls against this
      // repository on 2026-09-21, no parameter unless stated:
      //   2022-11-28, no param                    -> 204 No Content
      //   2026-03-10, no param                    -> 200 + workflow_run_id
      //   2022-11-28, return_run_details=true     -> 200 + workflow_run_id
      //   2026-03-10, return_run_details=true     -> 200 + workflow_run_id
      //
      // So a server that ignores or downgrades the pinned header still answers with a run
      // id, and NO_RUN_ID stops being reachable by version drift alone.
      body: JSON.stringify({ ref, inputs: stringifyInputs(inputs), return_run_details: true }),
    });
  } catch (err) {
    throw new DispatchError('NETWORK', `could not reach ${api}: ${redact(err.message)}`,
      { remedy: 'check connectivity, then retry - a dispatch that never left is safe to repeat' });
  }

  if (response.status === 204) {
    // The one failure a caller cannot diagnose from a status code alone.
    throw new DispatchError('NO_RUN_ID',
      'the dispatch succeeded but returned 204 No Content, so the run it started cannot be identified',
      {
        status: 204,
        remedy: `the server ignored BOTH routes to a run id: the pinned `
          + `X-GitHub-Api-Version: ${API_VERSION} and the return_run_details parameter. `
          + 'That is a server old enough to predate 2026-02-19, or a proxy stripping one and '
          + 'rejecting the other. Polling /actions/runs and correlating by created_at is the '
          + 'last resort and races other dispatches.',
      });
  }
  if (response.status === 404) {
    throw new DispatchError('NOT_FOUND', `no workflow ${workflow} on ${repository}@${ref}, or the token cannot see it`, {
      status: 404,
      // 404 is what GitHub returns for "exists but you may not" as well as "does not
      // exist", so the remedy has to name both rather than guess which one happened.
      remedy: 'the workflow file must be on the DEFAULT branch, and the token needs Actions: read and write on this repository',
    });
  }
  if (response.status === 403) {
    throw new DispatchError('FORBIDDEN', 'the token may not dispatch this workflow', {
      status: 403,
      remedy: 'the fine-grained token needs repository permission "Actions" set to read and write',
    });
  }
  if (!response.ok) {
    throw new DispatchError('HTTP', `dispatch failed: HTTP ${response.status}. ${await readError(response)}`, { status: response.status });
  }

  let body;
  try { body = await response.json(); } catch { body = null; }
  const workflowRunId = body?.workflow_run_id;
  if (!Number.isInteger(workflowRunId)) {
    throw new DispatchError('NO_RUN_ID', `the dispatch returned HTTP ${response.status} with no workflow_run_id`, {
      status: response.status,
      remedy: `pin X-GitHub-Api-Version: ${API_VERSION}`,
    });
  }
  return { workflowRunId, runUrl: body.run_url ?? null, htmlUrl: body.html_url ?? null };
}

/** Workflow inputs are strings on the wire; a caller passing a number should not 422. */
function stringifyInputs(inputs) {
  return Object.fromEntries(Object.entries(inputs)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => [k, String(v)]));
}

// ---------------------------------------------------------------- waiting

export async function getRun({ repository, runId, token, fetch: doFetch = globalThis.fetch, api = GITHUB_API }) {
  const [owner, name] = splitRepository(repository);
  const response = await doFetch(`${api}/repos/${owner}/${name}/actions/runs/${runId}`, { headers: headers(token) });
  if (!response.ok) throw new DispatchError('HTTP', `could not read run ${runId}: HTTP ${response.status}`, { status: response.status });
  return response.json();
}

/**
 * Poll until the run finishes. Returns the final run object.
 *
 * `waiting` is a status, not a stall: it means a deployment protection rule is holding the
 * job, and a caller that treated it as failure would give up on a run that is fine. It is
 * reported through `onStatus` so an agent can say so rather than sitting mute.
 */
export async function waitForRun({
  repository, runId, token,
  fetch: doFetch = globalThis.fetch,
  api = GITHUB_API,
  intervalMs = 10_000,
  timeoutMs = 30 * 60_000,
  sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  now = () => Date.now(),
  onStatus = () => {},
} = {}) {
  const deadline = now() + timeoutMs;
  let last = null;
  for (;;) {
    const run = await getRun({ repository, runId, token, fetch: doFetch, api });
    if (run.status !== last) { last = run.status; onStatus(run); }
    if (run.status === 'completed') return run;
    if (now() >= deadline) {
      throw new DispatchError('TIMEOUT', `run ${runId} was still ${run.status} after ${Math.round(timeoutMs / 1000)}s`, {
        // Not a failure of the run: the caller stopped watching, and the run keeps going.
        remedy: `the run is still going; check ${run.html_url ?? `run ${runId}`} or wait again with a longer --timeout`,
      });
    }
    await sleep(intervalMs);
  }
}

// ---------------------------------------------------------------- the artifact

export async function listArtifacts({ repository, runId, token, fetch: doFetch = globalThis.fetch, api = GITHUB_API }) {
  const [owner, name] = splitRepository(repository);
  const response = await doFetch(`${api}/repos/${owner}/${name}/actions/runs/${runId}/artifacts`, { headers: headers(token) });
  if (!response.ok) throw new DispatchError('HTTP', `could not list artifacts for run ${runId}: HTTP ${response.status}`, { status: response.status });
  const body = await response.json();
  return body.artifacts ?? [];
}

export async function downloadArtifact({ repository, artifactId, token, fetch: doFetch = globalThis.fetch, api = GITHUB_API }) {
  const [owner, name] = splitRepository(repository);
  const response = await doFetch(`${api}/repos/${owner}/${name}/actions/artifacts/${artifactId}/zip`, {
    headers: headers(token), redirect: 'follow',
  });
  if (response.status === 410) {
    throw new DispatchError('EXPIRED', `artifact ${artifactId} has expired`, {
      status: 410,
      // Worth saying plainly: an artifact is transport, not storage (ADR-0032).
      remedy: 'workflow artifacts are deleted after their retention period and with their run; re-collect, or keep the corpus somewhere that persists',
    });
  }
  if (!response.ok) throw new DispatchError('HTTP', `could not download artifact ${artifactId}: HTTP ${response.status}`, { status: response.status });
  return Buffer.from(await response.arrayBuffer());
}

/**
 * GitHub wraps every uploaded artifact in a ZIP of its own, so downloading ours yields a
 * ZIP containing a ZIP. Unwrapped here rather than in the validator, which should judge
 * one format and not guess how many layers of packaging a transport added.
 */
export function unwrapArtifact(bytes) {
  let zip;
  try { zip = openZip(bytes); } catch { return { bytes, unwrapped: false }; }
  if (zip.problems.length) return { bytes, unwrapped: false };
  const inner = zip.names.filter((n) => n.endsWith('.zip'));
  if (inner.length !== 1) return { bytes, unwrapped: false };
  return { bytes: zip.read(inner[0]), unwrapped: true, name: inner[0] };
}

// ---------------------------------------------------------------- bringing it home

/** The four fields a caller decides on: is it done, did it work, and where to look. */
export async function getRunSummary({ repository, runId, token, fetch: doFetch = globalThis.fetch, api = GITHUB_API }) {
  const run = await getRun({ repository, runId, token, fetch: doFetch, api });
  return { status: run.status, conclusion: run.conclusion ?? null, htmlUrl: run.html_url ?? null, runId };
}

/**
 * `fetchCorpus(...)` -> `{ file, validation, artifact }`.
 *
 * Download, unwrap GitHub's outer ZIP, write it down, and judge it with the validator a
 * human would run. ONE implementation, called by both `bin/collect-remote.mjs` and the
 * MCP server - the approved brief is explicit that a second copy of this is how the
 * vendor package name came to be wrong in two workflows at once.
 */
export async function fetchCorpus({
  repository, runId, token, outDir = null,
  fetch: doFetch = globalThis.fetch, api = GITHUB_API,
  expectedClientRef = null,
} = {}) {
  const artifacts = await listArtifacts({ repository, runId, token, fetch: doFetch, api });
  const wanted = artifacts.filter((a) => !a.expired && a.name.startsWith('research-kit-corpus-v1-'));
  if (wanted.length !== 1) {
    throw new DispatchError('NO_ARTIFACT', `expected one corpus artifact on run ${runId}, found ${wanted.length}`, {
      remedy: wanted.length === 0
        // Told apart, because the two have different fixes: one is a broken run, the
        // other is a run whose artifact has aged out.
        ? 'the run produced no package, or its artifact has expired; check the upload step, or re-collect'
        : 'more than one corpus artifact on one run is not a shape this format defines',
    });
  }
  const bytes = await downloadArtifact({ repository, artifactId: wanted[0].id, token, fetch: doFetch, api });
  const { bytes: pkg, unwrapped, name } = unwrapArtifact(bytes);

  const dir = outDir ?? os.tmpdir();
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, unwrapped ? name : `${wanted[0].name}.zip`);
  fs.writeFileSync(file, pkg);

  return { file, artifact: wanted[0], validation: validateArtifact({ file, expectedClientRef }) };
}
