// handoff.mjs - the arrival question (ADR-0011, ADR-0020).
//
// The corpus crosses machines through git, so a builder's first command asks: is the
// ledger here and non-empty, is every capture an evidence row names on disk, does the
// chain verify?
//
// Read-only BY DESIGN: the machine that asks cannot collect the missing bytes.
//
// One remedy PER CAUSE. Something that did not travel lives on the collector; a corpus
// that travelled whole and was rewritten on checkout lives here. One blanket text for
// both is what used to send operators to re-collect a corpus already on disk.

import path from 'node:path';
import { PATHS, resolve, exists } from './core.mjs';
import { readCorpus, captureOf } from './corpus.mjs';
import { verifyLedger } from './provenance.mjs';

export const HANDOFF_REMEDY = [
  'Something did not travel. The remedy lives on the COLLECTOR machine:',
  '',
  '    git add -f research/raw/          # including its dotfiles',
  '    git commit && git push',
  '',
  'then pull or re-clone here. research/raw/.fetches.jsonl is the hash-chained ledger,',
  'and it is evidence, not a byproduct - zip tools, sync tools, and some git filters',
  'drop dotfiles.',
].join('\n');

/**
 * The remedy is scoped to the files that are actually affected, and it never reaches for
 * a recursive delete.
 *
 * A diagnostic that prints `git rm -r research/` (or anything that re-checks-out the
 * whole directory) is telling an operator to discard uncommitted evidence, notes and
 * decisions to fix a line-ending problem - and in a folder with no git metadata, there
 * is nothing to restore them from. The prerequisites come first, the scope is named,
 * and `--renormalize` does the job without removing anything.
 */
export function lineEndingRemedy(files = [], { isRepo = true } = {}) {
  const named = files.slice(0, 5);
  const more = files.length > named.length ? `, +${files.length - named.length} more` : '';

  if (!isRepo) {
    return [
      'Everything travelled, and THIS machine rewrote it on checkout - core.autocrlf=true,',
      'the default on Windows, smudges every text file leaving the object store, and the',
      'body hashes were taken over LF bytes.',
      '',
      `Affected: ${named.join(', ')}${more}`,
      '',
      'BUT this directory has no git metadata, so there is nothing here to restore the LF',
      'bytes from, and no command below is safe to run: re-fetch or re-copy this corpus',
      'from the machine that has the repository. Do not delete anything first.',
    ].join('\n');
  }

  return [
    'Everything travelled, and THIS machine rewrote it on checkout. core.autocrlf=true -',
    'the default on Windows - smudges every text file leaving the object store, and the',
    'body hashes were taken over LF bytes. The corpus is whole; fix it here.',
    '',
    `Affected: ${named.join(', ')}${more}`,
    '',
    'First, check nothing is about to be lost - uncommitted evidence is irreplaceable:',
    '',
    '    git status --porcelain research/        # expect no unstaged or untracked work',
    '',
    'Then pin the line endings and renormalise ONLY the affected files:',
    '',
    '    printf "research/raw/* text eol=lf\\n*.jsonl text eol=lf\\n" >> .gitattributes',
    '    git add .gitattributes',
    ...named.map((file) => `    git add --renormalize ${file}`),
    ...(files.length > named.length ? ['    git add --renormalize research/raw/   # the rest'] : []),
    '    git checkout -- .gitattributes',
    '',
    'No file is removed and no directory is re-checked-out: `--renormalize` rewrites the',
    'index through the new .gitattributes and leaves untracked work where it is.',
    '',
    'Going to the collector fixes nothing here, and re-collecting spends paid credits to',
    'reproduce a corpus that is already on disk.',
  ].join('\n');
}

/**
 * `verifyHandoff(root, { corpus })` -> the report.
 *
 * Findings are named: handoff-ledger-missing, handoff-ledger-empty,
 * handoff-capture-missing, handoff-chain-broken, plus one handoff-remedy.
 */
export function verifyHandoff(root, { corpus = null } = {}) {
  const snapshot = corpus ?? readCorpus(root);
  const chain = snapshot.chain ?? verifyLedger(root, { corpus: snapshot });
  const findings = [];
  const missingCaptures = [];
  const lineEndings = chain.lineEndings ?? [];

  if (!snapshot.ledger.present) {
    findings.push({
      name: 'handoff-ledger-missing',
      severity: 'fail',
      detail: `${PATHS.ledger} is not in this checkout - the corpus arrived without its ledger`,
    });
  } else if (!snapshot.ledger.entries.length) {
    findings.push({
      name: 'handoff-ledger-empty',
      severity: 'fail',
      detail: `${PATHS.ledger} is present but holds no entries`,
    });
  }

  for (const row of snapshot.evidence) {
    const capture = captureOf(snapshot, row);
    const file = row.raw || capture?.file || '';
    if (file && exists(resolve(root, file))) continue;
    missingCaptures.push({ row: row.id, file: file || row.url });
    findings.push({
      name: 'handoff-capture-missing',
      severity: 'fail',
      detail: `${row.id} names ${file || row.url}, which is not on disk`,
    });
  }

  const structural = chain.problems.filter((p) => p.rule !== 'ledger-missing');
  for (const problem of structural) {
    findings.push({
      name: 'handoff-chain-broken',
      severity: 'fail',
      // One line per capture, for the same reason the remedy is stated once: a
      // paragraph per capture buries the capture names.
      detail: `${problem.rule}${problem.kind ? `/${problem.kind}` : ''}: ${problem.detail}`,
      kind: problem.kind,
    });
  }

  const travelled = findings.filter((f) => f.name !== 'handoff-chain-broken' || f.kind !== 'line-endings');
  const report = {
    root,
    ok: findings.length === 0,
    findings,
    missingCaptures,
    lineEndings,
    // "Something did not travel" is anything that is not purely a line-ending rewrite.
    didNotTravel: travelled.length > 0,
    entries: snapshot.ledger.entries.length,
  };
  const remedy = handoffRemedy(report);
  if (remedy) report.findings.push({ name: 'handoff-remedy', severity: 'info', detail: remedy });
  report.remedy = remedy;
  return report;
}

/** The remedy is picked from the CAUSE, never printed as a constant. */
export function handoffRemedy(report) {
  const parts = [];
  if (report.didNotTravel) parts.push(HANDOFF_REMEDY);
  if (report.lineEndings?.length) {
    // Whether this is a repository at all decides which remedy is even runnable.
    const isRepo = exists(path.join(report.root ?? '.', '.git'));
    parts.push(lineEndingRemedy(report.lineEndings.map((e) => e.file), { isRepo }));
  }
  return parts.join('\n\n');
}
