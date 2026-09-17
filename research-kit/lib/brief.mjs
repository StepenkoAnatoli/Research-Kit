// brief.mjs - the phase-1 -> phase-2 handoff, and the owner of the brief's SHAPE (ADR-0014).
//
// Six sections, two of which the corpus cannot fill. The renderer writes its headings
// FROM this definition and lib/audit.mjs reads the judged sections through it, so the
// writer and its readers cannot drift.

import { PATHS, resolve, readText, writeText, today } from './core.mjs';
import { readCorpus, sectionOf, claimOf, captureOf } from './corpus.mjs';

/** `judged: true` marks a section the corpus cannot fill - it needs a person's call. */
export const BRIEF_SECTIONS = Object.freeze([
  { key: 'intent', heading: 'Intent', judged: false },
  { key: 'verified', heading: 'What we verified', judged: false },
  { key: 'contradictions', heading: 'Contradictions and how they were resolved', judged: true },
  { key: 'unknowns', heading: 'Known unknowns', judged: false },
  { key: 'decision', heading: 'Decision', judged: true },
  { key: 'next', heading: 'Next steps', judged: false },
]);

export const JUDGED_SECTIONS = Object.freeze(BRIEF_SECTIONS.filter((s) => s.judged).map((s) => s.key));
export const TODO_MARK = '**TODO**';

/**
 * The marker that says "this is still the scaffold". The substitution pass leaves it
 * alone; the alternative - matching the template's prose - made a sentence of English
 * load-bearing.
 */
export const BRIEF_FILE_MARKER = '<!-- research-kit:brief=scaffold -->';

/**
 * `template | legacy | draft | authored`.
 * Only the first two are safe to draft over, and `legacy` - a scaffold written before
 * the marker shipped, which the text cannot tell from a brief someone wrote in -
 * refuses loudly rather than guessing.
 */
export function briefState(text) {
  const body = String(text ?? '');
  if (!body.trim()) return 'template';
  if (body.includes(BRIEF_FILE_MARKER)) return 'template';
  const drafted = body.includes('_Auto-drafted');
  const todos = JUDGED_SECTIONS.filter((key) => {
    const section = BRIEF_SECTIONS.find((s) => s.key === key);
    return sectionOf(body, section.heading).includes(TODO_MARK);
  });
  if (drafted && todos.length) return 'draft';
  if (drafted) return 'authored';
  const hasHeadings = BRIEF_SECTIONS.some((s) => sectionOf(body, s.heading));
  return hasHeadings ? 'legacy' : 'template';
}

export function briefSection(text, key) {
  const section = BRIEF_SECTIONS.find((s) => s.key === key);
  if (!section) return '';
  return sectionOf(text, section.heading);
}

export function judgedSection(text, key) {
  if (!JUDGED_SECTIONS.includes(key)) return null;
  const body = briefSection(text, key);
  return { key, body, answered: Boolean(body) && !body.includes(TODO_MARK) };
}

// ---------------------------------------------------------------- the renderer

function verifiedTable(corpus) {
  const rows = [];
  for (const unknown of corpus.unknowns) {
    if (unknown.status !== 'CLOSED') continue;
    const claim = claimOf(corpus, unknown);
    const cited = unknown.cites.find((id) => /^E-\d+$/i.test(id)) ?? '';
    const row = corpus.evidence.find((e) => e.id.toUpperCase() === cited.toUpperCase());
    const capture = row ? captureOf(corpus, row) : null;
    rows.push({
      claim: claim.replace(/\|/g, '\\|'),
      source: `${cited}${row ? ` \`${hostOfUrl(row.url)}\`` : ''}`,
      type: row?.type ?? '',
      partial: capture?.completeness === 'partial',
    });
  }
  if (!rows.length) return '_No closed unknowns yet - nothing is verified._';
  return [
    '| Claim | Source | Type |',
    '|---|---|---|',
    ...rows.map((r) => `| ${r.claim}${r.partial ? ' _(partial capture)_' : ''} | ${r.source} | ${r.type} |`),
  ].join('\n');
}

function hostOfUrl(url) {
  try { return new URL(url).host.replace(/^www\./, ''); } catch { return url; }
}

function knownUnknowns(corpus) {
  const rows = corpus.unknowns.filter((u) => u.status === 'KNOWN-UNKNOWN');
  if (!rows.length) return 'None. Every blocking unknown was closed with primary-source evidence.';
  return rows.map((u) => `- **${u.id}** - ${u.text}\n  - Day-one verification: ${u.evidence || '_not stated_'}`).join('\n');
}

/**
 * Render the brief from the corpus. Refuses a `draft` or `authored` brief without
 * `force`, so judgements already written are preserved.
 */
export function renderBrief(root, { force = false, date = today(), corpus = null, verdict = null } = {}) {
  const snapshot = corpus ?? readCorpus(root);
  const file = resolve(root, PATHS.brief);
  const existing = readText(file, '');
  const state = briefState(existing);

  if (!force && (state === 'draft' || state === 'authored')) {
    return { written: false, state, reason: `${PATHS.brief} is ${state} - re-run with --force to overwrite the judgements in it` };
  }
  if (!force && state === 'legacy') {
    return {
      written: false,
      state,
      reason: `${PATHS.brief} is a LEGACY brief: it holds the shape but not the marker, so the text cannot tell a pre-marker scaffold from a brief somebody wrote in. Read it, then re-run with --force if it is safe to replace.`,
    };
  }

  const topic = snapshot.map.topic || snapshot.plan?.topic || 'this project';
  // The drafted brief must not ANNOUNCE a completion it cannot see. It knows two things:
  // whether the gate passes, and whether the sections only a person can fill are filled.
  // Asserting "phase 1 is complete" over unanswered TODOs is the corpus claiming a
  // review that never happened.
  const gatePasses = verdict?.pass ?? null;
  const gateLine = gatePasses === null
    ? `**Gate state: not evaluated in this run.**`
    : (gatePasses
      ? `**Gate: PASS.** Every blocking unknown is closed with evidence, and every claim below
traces to a cached page in \`${PATHS.raw}/\`.`
      : `**Gate: FAIL (${verdict.counts.fail} blocking finding${verdict.counts.fail === 1 ? '' : 's'}).** This brief is a
draft of an incomplete research pass: phase 2 does not start until \`${PATHS.discovery}\`
passes. Run \`node research-kit/bin/preflight.mjs\` to see what is unproven.`);

  const body = `# Brief - ${topic}

_Auto-drafted ${date} by \`bin/brief.mjs\` from the corpus. Sections marked ${TODO_MARK}
require human/agent judgement; everything else is assembled from evidence already
in \`research/\`. While a ${TODO_MARK} remains, this brief is **not reviewed** and the
handoff is **not approved** - a structurally valid corpus, a reviewed one, and an
approved handoff are three different states._

**This is the phase-1 to phase-2 handoff.** ${gateLine}

Whoever you are - another agent, a different model, or a person - read this file
first. You should not need to re-research anything to start work. If something
here is not enough to build from, say which fact is missing rather than guessing
it: that is a phase-1 gap to close, not a phase-2 judgment call.

## ${BRIEF_SECTIONS[0].heading}

${snapshot.intent || '_The contract states no build intent._'}

## ${BRIEF_SECTIONS[1].heading}

${verifiedTable(snapshot)}

## ${BRIEF_SECTIONS[2].heading}

${TODO_MARK} - review the primary sources above for disagreements (pricing pages vs
billing docs, docs vs issue trackers, version-dependent behaviour). Record both
sides and state which you trust and why. Two independent sources agree unless
noted here.

## ${BRIEF_SECTIONS[3].heading}

${knownUnknowns(snapshot)}

## ${BRIEF_SECTIONS[4].heading}

${TODO_MARK} - what to build first, and what is explicitly out of scope. State the
first build step concretely enough that the builder can start from this file
alone.

## ${BRIEF_SECTIONS[5].heading}

1. Review the ${TODO_MARK} sections above (${BRIEF_SECTIONS.filter((s) => s.judged).map((s) => s.heading.split(' ')[0]).join(', ')}) before handing off.
2. Hand this file to the builder (phase 2). Re-running \`node bin/brief.mjs\`
   after edits will refuse without \`--force\` so your judgements are preserved.
`;

  writeText(file, body);
  return { written: true, state: briefState(body), file: PATHS.brief, reason: '' };
}
