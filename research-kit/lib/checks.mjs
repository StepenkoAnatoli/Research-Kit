// checks.mjs - the ordered contract-check registry (ADR-0004).
//
// Twelve checks, in reporting order. Every check is a pure function of the corpus
// snapshot plus options; none reads the filesystem beyond `exists()` on a path the
// corpus already resolved.
//
// A check emits findings. It never decides what a finding MEANS for the build - that is
// the verdict's single judgement, in lib/preflight.mjs.

import { hostOf, PATHS, resolve, exists, ageInDays } from './core.mjs';
import { captureOf, traceOf, citedIds } from './corpus.mjs';
import { documentGroups } from './similarity.mjs';
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
  const superseded = supersededRows(corpus);
  for (const row of corpus.evidence) {
    // A row that has been re-collected and is relied on by nothing is HISTORY (ADR-0026).
    // Reporting the provenance of a capture no claim rests on is noise, and worse than
    // noise: it buries the rows that DO carry a claim. Six such warnings stood in this
    // corpus after the 2026-09-20 refresh, all of them about superseded captures.
    if (isReleasedHistory(corpus, row, superseded)) continue;
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

/** A recorded render review must say what was checked; this is the floor that makes it mean something. */
const MIN_RENDER_REVIEW = 30;

/** How many render-failure notices this capture's page printed, or 0. */
function renderFailureMarkers(corpus, capture) {
  return corpus.captures.renderFailures?.get(capture.file) ?? 0;
}

const RENDER_REVIEW_RE = /\[render-reviewed:\s*([^\]]*)\]/i;

/**
 * The reviewer's note that a capture's render-failure notice was checked out, read from
 * the EVIDENCE row that cites the capture - never from the capture itself, which the
 * ledger hashes whole.
 */
function renderReviewNote(corpus, capture) {
  for (const row of corpus.evidence) {
    if (captureOf(corpus, row)?.file !== capture.file) continue;
    const match = RENDER_REVIEW_RE.exec(String(row.finding ?? ''));
    if (match) return match[1].trim();
  }
  return '';
}


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

  // A page that SAYS it failed to render, in its own words.
  //
  // `completeness` grades the TRANSPORT - how much of the response arrived - and a page
  // whose body is built by script arrives whole and empty. That gap was found the hard way:
  // a GitHub Discussion graded `full` while carrying page furniture and no discussion.
  //
  // This does NOT claim a capture is empty, and the distinction is the whole reason it is
  // worded the way it is. Measured over the 60 captures in this repository, four carry such
  // a marker and THREE OF THOSE WERE USED AND CITED - GitHub renders the main content while
  // some side widget fails. So the honest finding is "part of this page reported a failure,
  // confirm the text you cite actually arrived", which was true in all four cases.
  //
  // Detecting emptiness itself was attempted and abandoned; ADR-0037 records the
  // measurements, because both obvious heuristics fail in opposite directions.
  for (const capture of corpus.captures.entries) {
    const hits = renderFailureMarkers(corpus, capture);
    if (!hits) continue;

    // The finding is a REVIEW INSTRUCTION - "confirm the text you cite is present" - so it
    // has to be closable by having done the review. Same bargain `completeness: partial`
    // strikes with `omitted:`: you may say the shortfall is accounted for, and you must say
    // what you checked. Without it the warning stands forever on three captures this
    // repository actively relies on, and a permanent warning is one nobody reads.
    //
    // THE NOTE LIVES ON THE EVIDENCE ROW, NOT IN THE CAPTURE'S FRONT-MATTER, and the reason
    // is worth keeping: `verifyLedger` hashes the WHOLE capture file, front-matter included.
    // Annotating a capture would break `body-unmodified` and fail the chain. A capture is
    // evidence and stays byte-immutable; a reviewer's judgement about it is corpus prose,
    // and corpus prose is where judgements already live (the unknown's status, the map's
    // DISMISSED reason). The first design put it in front-matter and the ledger refused it.
    const reviewed = renderReviewNote(corpus, capture);
    if (reviewed.length >= MIN_RENDER_REVIEW) {
      out.push(finding('pass', 'capture-completeness', 'partial-render-reviewed',
        `${capture.file} prints ${hits} render-failure notice(s), and the review is recorded: ${reviewed}`,
        { file: capture.file }));
      continue;
    }
    out.push(finding('warn', 'capture-completeness', 'partial-render',
      `${capture.file} contains ${hits} render-failure notice(s) from the page itself - `
      + 'it arrived whole, so `completeness` cannot see this. Confirm the text cited from it is '
      + `present, then record what you checked in a \`renderReview:\` front-matter line of at least ${MIN_RENDER_REVIEW} characters`
      + (reviewed ? ` (the current one gives only "${reviewed}")` : ''),
      { file: capture.file }));
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
/**
 * Which rows have been replaced by a fresher capture of the same URL.
 *
 * Extracted 2026-09-20 because three checks need the same answer and two of them were
 * getting it wrong by not asking. `evidence-supersession` computed it privately, while
 * `transport-provenance` and `hygiene` knew nothing about ADR-0026 and warned about the
 * exact state that ADR REQUIRES: two rows for one URL, the older one kept as history.
 *
 * Returns `Map<upper-cased old id, the row that replaced it>`.
 */
export function supersededRows(corpus) {
  const byUrl = new Map();
  for (const row of corpus.evidence) {
    if (!row.url) continue;
    if (!byUrl.has(row.url)) byUrl.set(row.url, []);
    byUrl.get(row.url).push(row);
  }

  const superseded = new Map();
  for (const rows of byUrl.values()) {
    if (rows.length < 2) continue;
    const ordered = [...rows].sort((a, b) => String(a.retrieved).localeCompare(String(b.retrieved)));
    const current = ordered[ordered.length - 1];
    for (const row of ordered.slice(0, -1)) superseded.set(row.id.toUpperCase(), current);
  }
  return superseded;
}

/** Is this row superseded AND relied on by nothing? Then it is history, and silent. */
function isReleasedHistory(corpus, row, superseded = supersededRows(corpus)) {
  if (!superseded.has(row.id.toUpperCase())) return false;
  return !corpus.unknowns.some((u) => u.cites.some((c) => c.toUpperCase() === row.id.toUpperCase()));
}

function evidenceSupersession(corpus) {
  const out = [];
  const superseded = supersededRows(corpus);
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
  // "One row per fetched page" is right for a duplicate and WRONG for a refresh.
  //
  // ADR-0026 requires a re-collection to add a row and leave the old one standing, so
  // two rows for one URL is the designed state, not a hygiene problem. This check
  // predated that ADR and warned about it anyway - six times, immediately after the
  // refresh the ADR exists to govern. What is still worth warning about is two rows for
  // one URL fetched on the SAME DAY, which no refresh produces and which is the real
  // duplicate this check was written for.
  const superseded = supersededRows(corpus);
  const seenUrl = new Map();
  for (const row of corpus.evidence) {
    if (!row.url) continue;
    const held = seenUrl.get(row.url);
    if (held) {
      const isRefresh = superseded.has(held.id.toUpperCase()) && held.retrieved !== row.retrieved;
      if (!isRefresh) {
        out.push(finding('warn', 'hygiene', 'duplicate-url',
          `${row.id} cites the same URL as ${held.id} on the same day - one row per fetched page`,
          { row: row.id, line: row.line }));
      }
    }
    // The LATEST row for a URL is the one a further duplicate should be compared against.
    if (!held || String(row.retrieved).localeCompare(String(held.retrieved)) >= 0) seenUrl.set(row.url, row);
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


// ---------------------------------------------------------------- 13. corroboration

/**
 * How many independent readings does a closed unknown rest on?
 *
 * WHY THIS EXISTS. Every check before it asks whether a claim is BACKED - is there a row,
 * is there a capture, does the chain verify, is it fresh, is it primary. None of them asks
 * whether it is backed more than once, so a corpus in which every unknown rested on a
 * single page passed preflight and `--strict` with nothing to say about it. From inside
 * such a corpus, a single CORRECT source and a single LUCKY one are indistinguishable.
 *
 * Found in this repository's own delivery-architecture corpus on 2026-09-21: nine rows,
 * all primary, all complete, all fresh - and eight unknowns each resting on exactly one of
 * them. Three of those eight carried architecture decisions.
 *
 * WHY IT IS A WARNING. Single-sourcing is often the right answer: a vendor's own API
 * reference is the authority on that API, and demanding a second opinion about it would be
 * ceremony. This check refuses to make that judgement - it reports the shape of the
 * support so a reviewer can make it. `evidencePolicy=strict` or `--strict` is where an
 * operator says they want the harder rule.
 *
 * WHY THE HOST MATTERS. Two pages from one vendor are not two witnesses. They are one
 * witness read twice, which catches a misreading and cannot catch a vendor being wrong
 * about itself. The finding says which of those it found, because the remedies differ:
 * one wants another page, the other wants another party.
 */
/**
 * A reviewer's recorded judgement that an unknown has ONE witness and cannot have two.
 *
 * WHY THIS EXISTS. `corroboration` reports the shape of support and leaves the judgement
 * to a reviewer (ADR-0036) - but it gave the reviewer nowhere to put the judgement. So a
 * claim that had been considered and correctly left single-sourced looked exactly like one
 * nobody had looked at twice, forever, and `evidencePolicy=strict` was unsatisfiable by
 * any corpus containing an honest one.
 *
 * WHY A REASON IS REQUIRED, and why that is the whole mechanism: this is the same shape
 * `MAP.md` already uses for `DISMISSED` and `completeness: partial` uses for `omitted` -
 * you may overrule the default, and you must say why in writing that survives in the
 * corpus. The check does not grade the reason (ADR-0013); it requires one to exist and
 * shows it in the finding, so the judgement is auditable rather than invisible.
 *
 * MIN_REASON exists because `[single-witness: n/a]` would otherwise be a silent mute.
 */
const SINGLE_WITNESS_RE = /\[single-witness:\s*([^\]]*)\]/i;
const MIN_WITNESS_REASON = 30;

function singleWitnessNote(unknown) {
  const match = SINGLE_WITNESS_RE.exec(String(unknown.evidence ?? ''));
  if (!match) return null;
  return { reason: match[1].trim() };
}

function corroboration(corpus) {
  const out = [];
  const byId = new Map(corpus.evidence.map((row) => [row.id.toUpperCase(), row]));

  for (const unknown of corpus.unknowns) {
    // A KNOWN-UNKNOWN rests on nothing by definition, and unknown-closure already owns
    // the case of a CLOSED one citing no row at all.
    if (unknown.status !== 'CLOSED') continue;

    // DEDUPED BY ID, and that is load-bearing. `citedIds` returns every E-## mention in the
    // cell, so an unknown whose prose names E-10 twice - "E-10 says X … as E-10 also notes"
    // - yields the same row twice. Counting it twice would inflate the support, and once
    // `documentGroups` folds the duplicate it reports a "republished copy" about a row that
    // was only ever mentioned twice. Host-counting masked this: duplicates inflated
    // `rows.length` but collapsed in the host Set, so the finding stayed right by accident.
    // Found 2026-09-21 by running the new grouping over the delivery-architecture corpus.
    const rows = [...new Set(unknown.cites.filter((id) => /^E-\d+$/i.test(id)).map((id) => id.toUpperCase()))]
      .map((id) => byId.get(id))
      .filter(Boolean);
    if (!rows.length) continue;

    // The SHAPE of the support, computed once. Whether that shape is acceptable is a
    // separate question, answered below, because a reviewer may overrule it with a reason.
    let shape;
    if (rows.length === 1) {
      shape = { rule: 'single-source', detail: `rests on ${rows[0].id} alone - one reading, so a correct source and a lucky one look the same` };
    } else {
      const hosts = new Set(rows.map((row) => hostOf(row.url)).filter(Boolean));
      if (hosts.size === 1) {
        shape = { rule: 'one-voice', detail: `cites ${rows.length} rows and all are ${[...hosts][0]} - a second reading of one source, which catches a misreading and not a source that is wrong about itself` };
      } else {
        // Several hosts is where the host heuristic used to stop and say `independent`. A
        // mirror passes that test while carrying LESS than either genuine page, so the rows
        // are grouped into distinct DOCUMENTS before the hosts are counted again.
        const groups = documentGroups(rows.map((row) => corpus.captures.sketches?.get(captureOf(corpus, row)?.file) ?? null));
        if (groups.length === 1) {
          shape = { rule: 'mirror', detail: `cites ${rows.length} rows across ${hosts.size} hosts but they are the same document - a republished copy is one witness, and the copy may be the stale one` };
        } else {
          // Hosts that survive as DISTINCT documents. A three-row unknown where two rows
          // mirror each other still counts the third, so this reports what is independent.
          const distinctHosts = new Set(groups.map((g) => hostOf(rows[g[0]].url)).filter(Boolean));
          if (distinctHosts.size === 1) {
            shape = { rule: 'one-voice', detail: `cites ${rows.length} rows across ${hosts.size} hosts, but after grouping republished copies only ${[...distinctHosts][0]} remains - one voice` };
          } else {
            const mirrored = rows.length - groups.length;
            shape = {
              corroborated: true,
              rule: 'independent',
              detail: `rests on ${groups.length} distinct documents across ${distinctHosts.size} hosts`
                + (mirrored ? ` (${mirrored} of ${rows.length} rows are republished copies and were not counted twice)` : ''),
            };
          }
        }
      }
    }

    const note = singleWitnessNote(unknown);

    // An acknowledgement left on an unknown that has SINCE been corroborated is reported,
    // not silently ignored. It now claims no second witness exists while the corpus holds
    // one - which is a stale claim of exactly the kind this repository keeps finding in its
    // own prose, and the only moment anything can notice is right here.
    if (shape.corroborated) {
      if (note) {
        out.push(finding('warn', 'corroboration', 'single-witness-stale',
          `${unknown.id} ${shape.detail}, but still carries a [single-witness: ...] note claiming it cannot be corroborated - remove the note or the claim is false`,
          { row: unknown.id, line: unknown.line }));
        continue;
      }
      out.push(finding('pass', 'corroboration', shape.rule, `${unknown.id} ${shape.detail}`,
        { row: unknown.id, line: unknown.line }));
      continue;
    }

    if (!note) {
      out.push(finding('warn', 'corroboration', shape.rule, `${unknown.id} ${shape.detail}`,
        { row: unknown.id, line: unknown.line }));
      continue;
    }

    // A note with no real reason is a mute button, and gets its own finding rather than
    // quietly behaving like the default - otherwise the weakest possible acknowledgement
    // and no acknowledgement at all would be indistinguishable.
    if (note.reason.length < MIN_WITNESS_REASON) {
      out.push(finding('warn', 'corroboration', 'single-witness-unreasoned',
        `${unknown.id} ${shape.detail}; its [single-witness: ...] note gives ${note.reason.length ? `only "${note.reason}"` : 'no reason'} - state why no second witness exists, in at least ${MIN_WITNESS_REASON} characters`,
        { row: unknown.id, line: unknown.line }));
      continue;
    }

    out.push(finding('pass', 'corroboration', 'single-witness',
      `${unknown.id} ${shape.detail} - accepted on the record: ${note.reason}`,
      { row: unknown.id, line: unknown.line }));
  }

  if (!out.length) out.push(finding('pass', 'corroboration', 'support', 'no closed unknown to weigh'));
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
  { name: 'corroboration', about: 'how many independent readings a closed unknown rests on', run: corroboration },
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
