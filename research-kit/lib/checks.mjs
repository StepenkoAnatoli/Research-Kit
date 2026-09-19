// checks.mjs - the ordered contract-check registry (ADR-0004).
//
// Twelve checks, in reporting order. Every check is a pure function of the corpus
// snapshot plus options; none reads the filesystem beyond `exists()` on a path the
// corpus already resolved.
//
// A check emits findings. It never decides what a finding MEANS for the build - that is
// the verdict's single judgement, in lib/preflight.mjs.

import { PATHS, resolve, exists, ageInDays } from './core.mjs';
import { captureOf, traceOf, citedIds } from './corpus.mjs';
import { coverageOfUniversals } from './dimensions.mjs';
import { verifyLedger } from './provenance.mjs';

const VALID_STATUSES = ['CLOSED', 'KNOWN-UNKNOWN'];
const MIN_CAPTURE_CHARS = 200;

function finding(severity, check, rule, detail, extra = {}) {
  return { severity, check, rule, detail, ...extra };
}

// ---------------------------------------------------------------- 1. discovery-contract

function discoveryContract(corpus) {
  const out = [];
  if (!corpus.discovery.present) {
    return [finding('fail', 'discovery-contract', 'contract-missing',
      `${PATHS.discovery} is missing. A gated project without its contract fails harder, not open.`)];
  }
  if (!corpus.intent.trim()) {
    out.push(finding('fail', 'discovery-contract', 'build-intent',
      '## Build intent is empty - state what is being built, for whom, and what "done" means'));
  }
  if (!corpus.unknowns.length) {
    out.push(finding('fail', 'discovery-contract', 'no-unknowns',
      'the contract enumerates no blocking unknowns - a contract with no unknowns makes no claim'));
  }
  for (const unknown of corpus.unknowns) {
    if (VALID_STATUSES.includes(unknown.status)) continue;
    out.push(finding('fail', 'discovery-contract', 'status',
      `${unknown.id} has status "${unknown.status || '(blank)'}" - must be CLOSED or KNOWN-UNKNOWN`,
      { row: unknown.id, line: unknown.line }));
  }
  if (!out.length) out.push(finding('pass', 'discovery-contract', 'contract', `${corpus.unknowns.length} unknowns, all with a valid status`));
  return out;
}

// ---------------------------------------------------------------- 2. citations

function citations(corpus) {
  const out = [];
  for (const row of corpus.evidence) {
    if (!row.url) {
      out.push(finding('fail', 'citations', 'row-url', `${row.id} has no URL`, { row: row.id, line: row.line }));
    }
    if (!row.finding.trim()) {
      out.push(finding('fail', 'citations', 'row-finding', `${row.id} has an empty Finding cell`, { row: row.id, line: row.line }));
    }
    if (!['P', 'S', 'L'].includes(row.type)) {
      out.push(finding('warn', 'citations', 'row-type', `${row.id} has source type "${row.type || '(blank)'}" - expected P, S, or L`, { row: row.id, line: row.line }));
    }
    const capture = captureOf(corpus, row);
    if (!capture) {
      out.push(finding('fail', 'citations', 'raw-missing',
        `${row.id} cites ${row.raw || row.url} with no cached page behind it - a claim without a capture is not evidence`,
        { row: row.id, line: row.line }));
      continue;
    }
    if (!exists(resolve(corpus.root, capture.file))) {
      out.push(finding('fail', 'citations', 'raw-missing', `${row.id} cites ${capture.file}, which is not on disk`, { row: row.id, line: row.line }));
      continue;
    }
    if (capture.bytes < MIN_CAPTURE_CHARS) {
      out.push(finding('warn', 'citations', 'raw-thin',
        `${row.id}'s capture is ${capture.bytes} bytes - too thin to carry a claim`, { row: row.id, line: row.line }));
    }
  }
  if (!out.some((f) => f.severity !== 'pass')) {
    out.push(finding('pass', 'citations', 'citations', `${corpus.evidence.length} evidence rows, each with a cached page`));
  }
  return out;
}

// ---------------------------------------------------------------- 3. provenance

function provenance(corpus) {
  const out = [];
  const chain = corpus.chain ?? verifyLedger(corpus.root, { corpus });

  if (!chain.present) {
    return [finding('fail', 'provenance', 'ledger-missing',
      `${PATHS.ledger} is absent - evidence must be fetched, not typed, and the ledger is what proves it`)];
  }
  for (const problem of chain.problems) {
    const rule = problem.rule === 'body-unmodified' && problem.kind === 'line-endings' ? 'body-unmodified' : problem.rule;
    out.push(finding('fail', 'provenance', rule === 'seq' || rule === 'prev' || rule === 'entry-hash' ? 'chain-intact' : rule,
      problem.detail + (problem.line ? ` (line ${problem.line})` : ''),
      { line: problem.line, file: problem.file, kind: problem.kind }));
  }

  for (const row of corpus.evidence) {
    const trace = traceOf(corpus, row);
    if (!trace.capture) continue; // citations already named it
    if (!trace.fetch) {
      out.push(finding('fail', 'provenance', 'fetch-entry-exists',
        `${row.id} cites ${trace.capture.file} with no entry in the ledger - a hand-written capture is not evidence`,
        { row: row.id, line: row.line }));
      continue;
    }
    const front = trace.capture;
    if (!front.command && !trace.fetch.cmd) {
      out.push(finding('warn', 'provenance', 'capture-command',
        `${row.id}'s capture records no collector command in its front-matter`, { row: row.id, line: row.line }));
    }
    if (front.retrieved && trace.fetch.at && !String(trace.fetch.at).startsWith(String(front.retrieved).slice(0, 10))) {
      out.push(finding('warn', 'provenance', 'timestamp-agreement',
        `${row.id}: capture says retrieved ${front.retrieved}, ledger says ${trace.fetch.at}`, { row: row.id, line: row.line }));
    }
  }
  if (!out.length) out.push(finding('pass', 'provenance', 'chain-intact', `chain of ${chain.entries.length} entries verifies`));
  return out;
}

// ---------------------------------------------------------------- 4. transport-provenance

function transportProvenance(corpus) {
  const out = [];
  for (const row of corpus.evidence) {
    const trace = traceOf(corpus, row);
    if (!trace.fetch) continue;
    const transport = trace.fetch.transport || trace.capture?.transport || '';
    if (!transport) {
      out.push(finding('warn', 'transport-provenance', 'transport-unrecorded',
        `${row.id}'s fetch records no transport - a cmd string is an annotation and proves nothing`,
        { row: row.id, line: row.line }));
      continue;
    }
    if (transport === 'firecrawl-cli-anonymous') {
      out.push(finding('warn', 'transport-provenance', 'transport-not-metered',
        `${row.id} was collected by the Firecrawl CLI with NO credential - keyless access capped per IP, not a metered fetch`,
        { row: row.id, line: row.line, transport }));
    } else if (transport !== 'firecrawl-cli') {
      out.push(finding('warn', 'transport-provenance', 'transport-not-metered',
        `${row.id} was collected by "${transport}", not the metered Firecrawl CLI`,
        { row: row.id, line: row.line, transport }));
    }
  }
  if (!out.length) out.push(finding('pass', 'transport-provenance', 'transport', 'every cited capture names its transport'));
  return out;
}

// ---------------------------------------------------------------- 5. gate-integrity

function gateIntegrity(corpus, options = {}) {
  const out = [];
  if (corpus.gateOff) {
    out.push(finding('warn', 'gate-integrity', 'gate-off',
      `${PATHS.gateOff} is present - the gate is deliberately off for this repository, and it is recorded`));
  }
  if (options.localHooksPath) {
    out.push(finding('warn', 'gate-integrity', 'local-hooks-path',
      `this repository sets core.hooksPath=${options.localHooksPath}, which displaces the machine-wide commit gate`));
  }
  const recent = corpus.overrides.length;
  if (recent) {
    out.push(finding('warn', 'gate-integrity', 'overrides-recorded',
      `${recent} override${recent === 1 ? '' : 's'} recorded in ${PATHS.overrides}`));
  }
  if (!out.length) out.push(finding('pass', 'gate-integrity', 'gate', 'no override in effect'));
  return out;
}

// ---------------------------------------------------------------- 6. unknown-closure

function unknownClosure(corpus, options = {}) {
  const out = [];
  const maxAgeDays = options.maxAgeDays ?? 180;
  const byId = new Map(corpus.evidence.map((row) => [row.id.toUpperCase(), row]));

  for (const unknown of corpus.unknowns) {
    if (unknown.status === 'KNOWN-UNKNOWN') {
      if (!unknown.evidence.trim()) {
        out.push(finding('fail', 'unknown-closure', 'verification-step',
          `${unknown.id} is KNOWN-UNKNOWN with an empty Evidence cell - name the day-one verification step`,
          { row: unknown.id, line: unknown.line }));
      }
      continue;
    }
    if (unknown.status !== 'CLOSED') continue; // discovery-contract owns a bad status

    const cited = unknown.cites.filter((id) => /^E-\d+$/i.test(id));
    if (!cited.length) {
      out.push(finding('fail', 'unknown-closure', 'no-evidence',
        `${unknown.id} is CLOSED but cites no E-## row`, { row: unknown.id, line: unknown.line }));
      continue;
    }
    for (const id of cited) {
      const row = byId.get(id.toUpperCase());
      if (!row) {
        out.push(finding('fail', 'unknown-closure', 'dangling-citation',
          `${unknown.id} cites ${id}, which is not a row in ${PATHS.evidence}`, { row: unknown.id, line: unknown.line }));
        continue;
      }
      const age = ageInDays(row.retrieved);
      if (age !== null && age > maxAgeDays) {
        // A refresh that has already happened is a different instruction from one that
        // has not: "go and collect" versus "go and read what was collected".
        const fresher = corpus.evidence.find((e) => e.url === row.url && String(e.retrieved) > String(row.retrieved));
        out.push(finding('warn', 'unknown-closure', 'stale-evidence',
          fresher
            ? `${unknown.id} rests on ${id}, retrieved ${age} days ago (limit ${maxAgeDays}) - ${fresher.id} is already a fresher capture of the same URL; re-read it and move the citation`
            : `${unknown.id} rests on ${id}, retrieved ${age} days ago (limit ${maxAgeDays}) - re-collect with --refresh-days`,
          { row: unknown.id, line: unknown.line }));
      }
      if (row.type === 'L') {
        out.push(finding('warn', 'unknown-closure', 'lead-only',
          `${unknown.id} rests on ${id}, which is lead-only (L) - a hint, never proof`,
          { row: unknown.id, line: unknown.line }));
      }
    }
  }
  if (!out.length) {
    const closed = corpus.unknowns.filter((u) => u.status === 'CLOSED').length;
    const known = corpus.unknowns.filter((u) => u.status === 'KNOWN-UNKNOWN').length;
    out.push(finding('pass', 'unknown-closure', 'closure', `${closed} closed, ${known} known-unknown`));
  }
  return out;
}

// ---------------------------------------------------------------- 7. subtopic-coverage

function subtopicCoverage(corpus) {
  const out = [];
  if (!corpus.map.present || !corpus.subtopics.length) {
    return [finding('warn', 'subtopic-coverage', 'no-coverage-claim',
      `no coverage claim: ${PATHS.map} has no subtopic rows, so the gate cannot tell a thorough contract from a shallow one`)];
  }

  const unknownIds = new Set(corpus.unknowns.map((u) => u.id.toUpperCase()));
  for (const row of corpus.subtopics) {
    if (row.status === 'GAP' || !row.status) {
      out.push(finding('fail', 'subtopic-coverage', 'gap',
        `${row.id} (${row.text}) is ${row.status || 'unstatused'} - a GAP is the shape of a question nobody asked`,
        { row: row.id, line: row.line }));
      continue;
    }
    if (row.status === 'DISMISSED') {
      if (!row.coveredBy.trim()) {
        out.push(finding('fail', 'subtopic-coverage', 'dismissed-without-reason',
          `${row.id} is DISMISSED with no reason - a dismissal without a reason is a silent gap wearing a label`,
          { row: row.id, line: row.line }));
      }
      continue;
    }
    if (row.status === 'COVERED') {
      const cited = row.cites.filter((id) => /^U-\d+$/i.test(id));
      if (!cited.length) {
        out.push(finding('fail', 'subtopic-coverage', 'covered-without-citation',
          `${row.id} is COVERED but cites no U-## unknown`, { row: row.id, line: row.line }));
      }
      for (const id of cited) {
        if (unknownIds.has(id.toUpperCase())) continue;
        out.push(finding('fail', 'subtopic-coverage', 'covered-by-unknown-that-does-not-exist',
          `${row.id} cites ${id}, which is not a row in ${PATHS.discovery}`, { row: row.id, line: row.line }));
      }
      continue;
    }
    out.push(finding('fail', 'subtopic-coverage', 'status',
      `${row.id} has status "${row.status}" - must be COVERED, DISMISSED, or GAP`, { row: row.id, line: row.line }));
  }

  for (const { dimension } of coverageOfUniversals(corpus.subtopics).missing) {
    out.push(finding('fail', 'subtopic-coverage', 'dimension-omitted',
      `the universal dimension "${dimension.name}" (${dimension.id}) appears nowhere in ${PATHS.map} - dismissing is fine, omitting is not`));
  }

  if (!out.length) out.push(finding('pass', 'subtopic-coverage', 'coverage', `${corpus.subtopics.length} subtopics, every universal dimension present`));
  return out;
}

// ---------------------------------------------------------------- 8. capture-completeness

function captureCompleteness(corpus) {
  const out = [];
  for (const unknown of corpus.unknowns) {
    if (unknown.status !== 'CLOSED') continue;
    const rows = unknown.cites
      .map((id) => corpus.evidence.find((e) => e.id.toUpperCase() === id.toUpperCase()))
      .filter(Boolean);
    if (!rows.length) continue;
    const captures = rows.map((row) => captureOf(corpus, row)).filter(Boolean);
    if (!captures.length) continue;
    if (captures.every((c) => c.completeness === 'partial')) {
      const omitted = captures.map((c) => c.omitted).filter(Boolean).join('; ');
      out.push(finding('warn', 'capture-completeness', 'partial-only',
        `${unknown.id} rests solely on partial captures${omitted ? ` (omitted: ${omitted})` : ''}`,
        { row: unknown.id, line: unknown.line }));
    }
  }
  for (const capture of corpus.captures.entries) {
    if (capture.completeness === 'partial' && !capture.omitted) {
      out.push(finding('warn', 'capture-completeness', 'partial-unnamed',
        `${capture.file} is graded partial but does not say what was omitted`, { file: capture.file }));
    }
  }
  if (!out.length) out.push(finding('pass', 'capture-completeness', 'completeness', 'no closed unknown rests on a partial capture alone'));
  return out;
}

// ---------------------------------------------------------------- 9. evidence-supersession

/**
 * A refresh must trigger CLAIM REVIEW, not a silent substitution (ADR-0026).
 *
 * Re-collecting a page adds a new row and leaves the old one standing, still cited. The
 * claim above it was written against bytes that are no longer what the source says, and
 * nothing asked anybody to re-read it - so `--refresh-days` produced a fresher capture
 * and left the citation pointing at the stale one, which is the shape of a claim that
 * quietly stops being true.
 *
 * The old capture is KEPT - it is history, and evidence is irreplaceable. What is refused
 * is a superseded row still carrying an unknown.
 */
function evidenceSupersession(corpus) {
  const out = [];
  const byUrl = new Map();
  for (const row of corpus.evidence) {
    if (!row.url) continue;
    if (!byUrl.has(row.url)) byUrl.set(row.url, []);
    byUrl.get(row.url).push(row);
  }

  const superseded = new Map(); // row id -> the row that replaced it
  for (const rows of byUrl.values()) {
    if (rows.length < 2) continue;
    const ordered = [...rows].sort((a, b) => String(a.retrieved).localeCompare(String(b.retrieved)));
    const current = ordered[ordered.length - 1];
    for (const row of ordered.slice(0, -1)) superseded.set(row.id.toUpperCase(), current);
  }
  if (!superseded.size) {
    return [finding('pass', 'evidence-supersession', 'supersession', 'no evidence row has been re-collected')];
  }

  for (const unknown of corpus.unknowns) {
    for (const id of unknown.cites) {
      const replacement = superseded.get(id.toUpperCase());
      if (!replacement) continue;
      out.push(finding('fail', 'evidence-supersession', 'cites-superseded-row',
        `${unknown.id} rests on ${id}, which has been superseded by ${replacement.id} - a fresher capture of the same URL `
        + `(${replacement.retrieved}). Re-read it, then move the citation or record why the earlier reading still holds.`,
        { row: unknown.id, line: unknown.line, superseded: id, by: replacement.id }));
    }
  }

  for (const [id, replacement] of superseded) {
    if (corpus.unknowns.some((u) => u.cites.some((c) => c.toUpperCase() === id))) continue;
    out.push(finding('pass', 'evidence-supersession', 'superseded-and-released',
      `${id} was superseded by ${replacement.id} and is cited by nothing - kept as history`));
  }
  return out;
}

// ---------------------------------------------------------------- 10. collection-attempts

function collectionAttempts(corpus) {
  const out = [];
  for (const unknown of corpus.unknowns) {
    if (unknown.status !== 'KNOWN-UNKNOWN') continue;
    // An attempt counts when the ledger holds any entry for a URL the row names.
    const attempted = corpus.ledger.entries.some((entry) => entry.url && unknown.evidence.includes(entry.url));
    if (attempted) continue;
    out.push(finding('warn', 'collection-attempts', 'unknown-attempted',
      `${unknown.id} is KNOWN-UNKNOWN with no recorded fetch attempt - an unreachable fact should have been reached for`,
      { row: unknown.id, line: unknown.line }));
  }
  if (!out.length) out.push(finding('pass', 'collection-attempts', 'attempts', 'every known-unknown was reached for'));
  return out;
}

// ---------------------------------------------------------------- 11. hygiene

function hygiene(corpus) {
  const out = [];
  const seenUrl = new Map();
  for (const row of corpus.evidence) {
    if (!row.url) continue;
    const held = seenUrl.get(row.url);
    if (held) {
      out.push(finding('warn', 'hygiene', 'duplicate-url',
        `${row.id} cites the same URL as ${held} - one row per fetched page`, { row: row.id, line: row.line }));
    } else seenUrl.set(row.url, row.id);
  }

  const ids = new Set();
  for (const row of [...corpus.evidence, ...corpus.unknowns, ...corpus.subtopics]) {
    const key = row.id.toUpperCase();
    if (ids.has(key)) {
      out.push(finding('warn', 'hygiene', 'duplicate-id', `${row.id} is used twice`, { row: row.id, line: row.line }));
    }
    ids.add(key);
  }

  const cited = new Set(corpus.evidence.map((row) => row.raw || captureOf(corpus, row)?.file).filter(Boolean));
  for (const capture of corpus.captures.entries) {
    if (cited.has(capture.file)) continue;
    out.push(finding('warn', 'hygiene', 'uncited-capture',
      `${capture.file} was collected but no evidence row cites it`, { file: capture.file }));
  }

  for (const row of corpus.evidence) {
    if (!row.retrieved || ageInDays(row.retrieved) !== null) continue;
    out.push(finding('warn', 'hygiene', 'unparseable-date',
      `${row.id} has retrieval date "${row.retrieved}", which does not parse`, { row: row.id, line: row.line }));
  }

  if (!out.length) out.push(finding('pass', 'hygiene', 'hygiene', 'no duplicate rows, no uncited captures'));
  return out;
}

// ---------------------------------------------------------------- 12. corpus-shape

function corpusShape(corpus) {
  const out = [];
  for (const problem of corpus.problems) {
    const blocking = problem.kind === 'raw-dangling' || problem.kind === 'plan-unparsed';
    out.push(finding(blocking ? 'fail' : 'warn', 'corpus-shape', problem.kind,
      `${problem.artifact ?? ''}${problem.line ? `:${problem.line}` : ''} ${problem.detail ?? problem.file ?? ''}`.trim(),
      { line: problem.line, file: problem.file }));
  }
  if (!corpus.rawPresent) {
    out.push(finding('fail', 'corpus-shape', 'raw-missing',
      `${PATHS.raw}/ does not exist - a gated project needs somewhere to keep its captures`));
  }
  if (!out.length) out.push(finding('pass', 'corpus-shape', 'shape', 'the corpus parses cleanly'));
  return out;
}

// ---------------------------------------------------------------- the registry

/** Order is part of the interface: a failure a person must act on precedes a warning. */
export const CHECKS = Object.freeze([
  { name: 'discovery-contract', about: 'the contract exists, states intent, and every unknown has a valid status', run: discoveryContract },
  { name: 'citations', about: 'every evidence row has a URL, a claim, and a cached page behind it', run: citations },
  { name: 'provenance', about: 'the chain verifies and every cited capture was actually fetched', run: provenance },
  { name: 'transport-provenance', about: 'which adapter fetched each cited capture', run: transportProvenance },
  { name: 'gate-integrity', about: 'overrides in effect, and whether this repository displaces the gate', run: gateIntegrity },
  { name: 'unknown-closure', about: 'every CLOSED unknown rests on a real, fresh, primary row', run: unknownClosure },
  { name: 'subtopic-coverage', about: 'the map covers every universal dimension, and states a status for each', run: subtopicCoverage },
  { name: 'capture-completeness', about: 'no closed unknown rests solely on a partial capture', run: captureCompleteness },
  { name: 'evidence-supersession', about: 'no unknown still rests on a row a later capture replaced', run: evidenceSupersession },
  { name: 'collection-attempts', about: 'a known-unknown was reached for before it was declared unreachable', run: collectionAttempts },
  { name: 'hygiene', about: 'duplicate rows, uncited captures, unparseable dates', run: hygiene },
  { name: 'corpus-shape', about: 'the corpus parses and the shape is there', run: corpusShape },
]);

export const CHECK_NAMES = Object.freeze(CHECKS.map((c) => c.name));

export function runCheck(name, corpus, options = {}) {
  const check = CHECKS.find((c) => c.name === name);
  if (!check) {
    const err = new Error(`unknown check "${name}". Known checks: ${CHECK_NAMES.join(', ')}`);
    err.code = 'UNKNOWN_CHECK';
    throw err;
  }
  return check.run(corpus, options);
}

export function runChecks(corpus, options = {}) {
  const only = options.only?.length ? options.only : CHECK_NAMES;
  for (const name of only) {
    if (!CHECK_NAMES.includes(name)) {
      const err = new Error(`unknown check "${name}". Known checks: ${CHECK_NAMES.join(', ')}`);
      err.code = 'UNKNOWN_CHECK';
      throw err;
    }
  }
  const findings = [];
  for (const check of CHECKS) {
    if (!only.includes(check.name)) continue;
    findings.push(...check.run(corpus, options));
  }
  return findings;
}

export { citedIds };
