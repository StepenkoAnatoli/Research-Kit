// disclosure.mjs - what does a public run actually expose?
//
// This module exists because the answer was written down before it was measured. The
// collector's header claimed that `workflow_dispatch` inputs "are visible on the run page
// to anyone with read access", which was asserted rather than checked - and when it was
// finally checked, the topic did not appear in the run object, the job listing, the
// timing, the artifact listing, or the server-rendered HTML.
//
// An overstated warning is not a safe default. It is the same defect as an understated
// one: a reader who finds a warning wrong once discounts the next, and the next one may
// be right. So the claim is executable now instead of prose - run it and see.
//
// UNAUTHENTICATED BY CONSTRUCTION.
//
// Every request here goes out with no Authorization header, because the question is
// precisely "what can somebody with no relationship to this repository see". A probe that
// quietly used the operator's token would answer a different question and look like this
// one. There is no token parameter, and `headers()` is the only place headers are built.

/** Probes, in the order a curious stranger would try them. */
export const PROBES = Object.freeze([
  { id: 'run', label: 'run metadata', path: (r, id) => `/repos/${r}/actions/runs/${id}` },
  { id: 'jobs', label: 'jobs and step names', path: (r, id) => `/repos/${r}/actions/runs/${id}/jobs` },
  { id: 'timing', label: 'run timing', path: (r, id) => `/repos/${r}/actions/runs/${id}/timing` },
  { id: 'artifacts', label: 'artifact listing', path: (r, id) => `/repos/${r}/actions/runs/${id}/artifacts` },
  { id: 'secrets', label: 'repository secrets', path: (r) => `/repos/${r}/actions/secrets` },
]);

const API = 'https://api.github.com';

/** No Authorization header, ever. That absence is the whole method. */
function headers() {
  return { Accept: 'application/vnd.github+json', 'User-Agent': 'research-kit-disclosure' };
}

/**
 * `probeRun({ repository, runId, needle })` -> a structured report.
 *
 * `needle` is the string whose presence would mean the subject leaked - normally the
 * topic. It is searched for in every response body, because a field nobody expected to
 * carry it is exactly where it would be found.
 */
export async function probeRun({ repository, runId, needle = null, fetch: doFetch = globalThis.fetch, api = API } = {}) {
  const findings = [];

  for (const probe of PROBES) {
    const url = `${api}${probe.path(repository, runId)}`;
    let status = 0;
    let body = '';
    try {
      const response = await doFetch(url, { headers: headers() });
      status = response.status;
      body = await response.text();
    } catch (error) {
      findings.push({ id: probe.id, label: probe.label, status: 0, readable: false, leaksNeedle: false, note: `unreachable: ${error.message}` });
      continue;
    }
    findings.push({
      id: probe.id,
      label: probe.label,
      status,
      readable: status >= 200 && status < 300,
      leaksNeedle: Boolean(needle) && body.toLowerCase().includes(String(needle).toLowerCase()),
    });
  }

  // The two that matter most, and the two nobody checks: can a stranger take the evidence
  // home, and can they read the log that echoes every input.
  const artifacts = findings.find((f) => f.id === 'artifacts');
  let artifactId = null;
  let jobId = null;
  try {
    if (artifacts?.readable) {
      const listed = await (await doFetch(`${api}/repos/${repository}/actions/runs/${runId}/artifacts`, { headers: headers() })).json();
      artifactId = listed.artifacts?.[0]?.id ?? null;
    }
    const jobs = await (await doFetch(`${api}/repos/${repository}/actions/runs/${runId}/jobs`, { headers: headers() })).json();
    jobId = jobs.jobs?.[0]?.id ?? null;
  } catch { /* a listing we cannot read is itself an answer, recorded above */ }

  for (const [id, label, url] of [
    ['artifact-download', 'artifact DOWNLOAD', artifactId && `${api}/repos/${repository}/actions/artifacts/${artifactId}/zip`],
    ['logs', 'job LOGS', jobId && `${api}/repos/${repository}/actions/jobs/${jobId}/logs`],
  ]) {
    if (!url) { findings.push({ id, label, status: null, readable: false, leaksNeedle: false, note: 'nothing to try' }); continue; }
    try {
      const response = await doFetch(url, { headers: headers(), redirect: 'follow' });
      const body = response.status < 300 ? await response.text() : '';
      findings.push({
        id,
        label,
        status: response.status,
        readable: response.status >= 200 && response.status < 300,
        leaksNeedle: Boolean(needle) && body.toLowerCase().includes(String(needle).toLowerCase()),
      });
    } catch (error) {
      findings.push({ id, label, status: 0, readable: false, leaksNeedle: false, note: `unreachable: ${error.message}` });
    }
  }

  return { repository, runId, needle, findings, ...summarise(findings, needle) };
}

/**
 * The verdict, in the two terms that matter.
 *
 * `exposedNames` is almost always true on a public repository and is not by itself a
 * problem - it is why the collector keeps the topic out of the run and artifact names.
 * `exposedSubject` is the one that ends an argument: it means somebody with no account
 * can read what was being researched.
 */
export function summarise(findings, needle) {
  const readable = findings.filter((f) => f.readable).map((f) => f.id);
  const leaked = findings.filter((f) => f.leaksNeedle).map((f) => f.id);
  return {
    exposedNames: readable.includes('run') || readable.includes('jobs') || readable.includes('artifacts'),
    exposedContent: readable.includes('artifact-download') || readable.includes('logs'),
    exposedSubject: leaked.length > 0,
    readable,
    leaked,
    needleChecked: Boolean(needle),
  };
}

/** One line per probe, and a verdict that states its own limits. */
export function render(report) {
  const rows = report.findings.map((f) => {
    const verdict = f.readable ? 'READABLE' : `refused ${f.status ?? '-'}`;
    const leak = f.leaksNeedle ? '  <-- SUBJECT VISIBLE' : '';
    return `  ${String(f.status ?? '-').padEnd(4)} ${f.label.padEnd(22)} ${verdict}${leak}${f.note ? `  (${f.note})` : ''}`;
  });

  const lines = [
    `anonymous probe of ${report.repository} run ${report.runId}`,
    '',
    ...rows,
    '',
    `names and metadata exposed : ${report.exposedNames}`,
    `content exposed            : ${report.exposedContent}`,
    report.needleChecked
      ? `the subject itself exposed : ${report.exposedSubject}`
      : 'the subject itself         : not checked - pass --topic to search for it',
    '',
  ];

  if (report.exposedContent || report.exposedSubject) {
    lines.push('This run discloses more than its shape. Research whose subject matters does not',
      'belong here: see docs/adr/0031 for why a visibility toggle alone is not the fix on a',
      'free plan, where converting to private makes environment secrets IGNORED.');
  } else {
    lines.push('Only the SHAPE of the run is public: names, sizes, timings, step titles.',
      'That is why the collector keeps the topic out of the run name and the artifact name -',
      'those names are the disclosure surface, and they are the part it controls.');
  }
  return lines.join('\n');
}
