// timeline.mjs - the derived chronological review aid, and the diagnostics log.
//
// `research/TIMELINE.md` is deliberately OUTSIDE the chain and never part of a gate
// decision: it exists so a person can read what happened in order.

import { PATHS, resolve, writeText, nowIso, appendLine } from './core.mjs';
import { readCorpus } from './corpus.mjs';

/** The gate records through here, so nothing else has to know where the log lives. */
export function recordDiagnostic(root, event) {
  return appendLine(resolve(root, PATHS.diagnostics), JSON.stringify({ at: nowIso(), ...event }));
}

export function buildTimeline(root, { corpus = null } = {}) {
  const snapshot = corpus ?? readCorpus(root);
  const events = [];

  for (const entry of snapshot.ledger.entries) {
    events.push({
      at: entry.at ?? '',
      kind: entry.op === 'fail' ? 'fetch failed' : entry.op,
      detail: entry.op === 'fail'
        ? `${entry.url} - ${entry.error ?? 'unknown failure'}`
        : `${entry.url} -> ${entry.raw}${entry.transport ? ` (${entry.transport})` : ''}`,
    });
  }
  for (const row of snapshot.evidence) {
    events.push({ at: row.retrieved, kind: 'evidence', detail: `${row.id} ${row.url}` });
  }
  for (const override of snapshot.overrides) {
    events.push({ at: override.at, kind: 'override', detail: `${override.kind} ${override.detail}`.trim() });
  }

  events.sort((a, b) => String(a.at).localeCompare(String(b.at)));
  return events;
}

export function renderTimeline(root, { corpus = null } = {}) {
  const snapshot = corpus ?? readCorpus(root);
  const events = buildTimeline(root, { corpus: snapshot });
  const lines = [
    '# Timeline',
    '',
    'Derived, chronological, and deliberately outside the chain: a review aid, never part',
    'of a gate decision. Regenerate with `node research-kit/bin/timeline.mjs`.',
    '',
    '| When | What | Detail |',
    '|---|---|---|',
    ...events.map((e) => `| ${e.at || '-'} | ${e.kind} | ${String(e.detail).replace(/\|/g, '\\|')} |`),
    '',
  ];
  writeText(resolve(root, PATHS.timeline), `${lines.join('\n')}\n`);
  return { file: PATHS.timeline, events: events.length };
}
