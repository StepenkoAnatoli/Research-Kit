// handoff.mjs - the arrival question (ADR-0011, ADR-0020).
//
// The corpus crosses machines through git, so a builder's first command asks: is the
// ledger here and non-empty, is every capture an evidence row names on disk, does the
// chain verify?
//
// Read-only BY DESIGN: the machine that asks cannot collect the missing bytes.
//
// One remedy PER CAUSE. Something that did not travel lives on the collector; a corpus
// that travelled whole and was rewritten on checkout lives here; a ledger emptied beside
// its captures is restored from git or re-collected, never pushed; a capture changed after
// its fetch is restored from the commit, or on the collector when the change was committed.
// One blanket text for all of them is what used to send operators to re-collect a corpus
// already on disk.

import path from 'node:path';
import { PATHS, HEADERS, resolve, exists, readText, kitCommand } from './core.mjs';
import { readCorpus, captureOf, traceOf } from './corpus.mjs';
import { verifyLedger } from './provenance.mjs';
import { briefState, judgedSection, JUDGED_SECTIONS } from './brief.mjs';

/**
 * How the corpus goes into git, as the kit prints it: everything under research/ the ignore
 * rules allow, then the LEDGER forced in by name - a dotfile a global ignore rule can hide.
 *
 * It was `git add -f research/raw/` (and the gate's `git add -f research/`). -f forces every
 * ignored file, so run as printed it committed the machine-local byproducts the repository
 * ignores on purpose - .usage.jsonl, .failures.jsonl, .diagnostics.jsonl, .fetches.lock,
 * overrides.log - and repo-hygiene failed (found 2026-09-28, end-to-end run).
 */
export const CORPUS_ADD = Object.freeze([
  'git add research/',
  `git add -f ${PATHS.ledger}`,
]);

export const HANDOFF_REMEDY = [
  'Something did not travel. The remedy lives on the COLLECTOR machine:',
  '',
  ...CORPUS_ADD.map((line) => `    ${line}`),
  '    git commit && git push',
  '',
  'then pull or re-clone here. research/raw/.fetches.jsonl is the hash-chained ledger,',
  'and it is evidence, not a byproduct - zip tools, sync tools, and some git filters',
  'drop dotfiles.',
].join('\n');

/**
 * The ledger is here, but captures on disk have no entry in it - it is empty, or short:
 * its entries were lost where the captures are. A torn last line that `doctor --fix-arity`
 * dropped leaves exactly this (Arena, 2026-09-28). The push remedy was printed for it, and
 * on the collector that pushes the same ledger. A function, because the collect command
 * names the running kit.
 */
export function ledgerLostRemedy() {
  return [
    'The ledger lost entries: the captures are here, and nothing records that they were fetched.',
    'Pushing sends the same ledger. Restore it from git when a committed copy holds them:',
    '',
    '    git checkout HEAD -- research/raw/.fetches.jsonl',
    '',
    '(git log -- research/raw/.fetches.jsonl finds an earlier one). If no copy holds them, the',
    'captures are unproven: re-collect them on the collector machine, which spends credits:',
    '',
    `    ${kitCommand('research.mjs', '--plan research/plan.json --force')}`,
  ].join('\n');
}

/**
 * A capture whose bytes no longer match the hash recorded at fetch, and not by line endings
 * (`body-unmodified/modified`). Everything travelled; the capture was CHANGED after its
 * fetch - here, uncommitted, or before it was committed. An edited capture is not evidence
 * (ADR-0093), and neither remedy below edits the ledger to agree with one.
 *
 * It got the push remedy until 2026-10-04 (break-test pass 4, F5b): when the change is local
 * to this checkout that sends an operator to another machine for a file whose committed copy
 * is one `git checkout` away, and when the change was committed the push sends the same
 * bytes again. The commands are plain git, one file each (ADR-0070): no folder-wide checkout,
 * because `git status` prints the altered files by definition, and a checkout of the whole
 * folder would discard uncommitted work beside them.
 */
export function alteredRemedy(files = [], { isRepo = true } = {}) {
  const named = files.slice(0, 5);
  const more = files.length > named.length ? `, +${files.length - named.length} more` : '';
  const head = [
    'Everything travelled, and a capture was changed AFTER its fetch: its bytes no longer',
    'match the hash the ledger recorded, and not by line endings. An edited capture is not',
    'evidence, and the ledger is never edited to agree with one.',
    '',
    `Affected: ${named.join(', ')}${more}`,
    '',
  ];

  if (!isRepo) {
    return [
      ...head,
      'BUT this directory has no git metadata, so nothing here holds the fetched bytes and no',
      'command is safe to print: re-copy this corpus from the machine that has the repository.',
      'Do not edit the capture to match, and do not re-collect it - a new fetch writes a new',
      'capture beside this one, and the ledger still names this one.',
    ].join('\n');
  }

  // Judged by running it (2026-10-04, external review): a dirty `git status` says this
  // checkout changed the file after the commit, NOT that the commit holds the fetched bytes -
  // a capture committed altered and then edited again is dirty too, and restoring HEAD leaves
  // it failing. So the checkout is followed by handoff again, and the committed case is one
  // step further, never a claim. Re-collecting is not offered: a new fetch writes a new
  // capture (`.r2.md`) beside this one, or refuses to overwrite a differing source sibling,
  // and verifyLedger still checks the entry that names this file.
  return [
    ...head,
    'First, whether this checkout changed the file after the commit - this prints the file',
    'when it differs from the committed copy:',
    '',
    ...named.map((file) => `    git status --porcelain -- ${pathspec(file)}`),
    '',
    'If it prints the file, restore the committed copy, which spends nothing and touches no',
    'other file, then run handoff again:',
    '',
    ...named.map((file) => `    git checkout HEAD -- ${pathspec(file)}`),
    ...(files.length > named.length ? ['', 'and the remaining files handoff names above the same way, each by name.'] : []),
    '',
    'If handoff still fails on it, or the status printed nothing, the altered bytes were',
    'committed. Find the last commit that held the fetched bytes - the one before the change:',
    '',
    ...named.map((file) => `    git log --oneline -- ${pathspec(file)}`),
    '',
    'and restore the file from it with `git checkout <that commit> -- <file>`, here or on the',
    'collector, where the ledger was written. If no commit holds them, the capture is unproven',
    'and stays so: the ledger is never edited to agree with it, and re-collecting does not',
    'clear it - a new fetch writes a new capture beside this one, and the ledger still names',
    'this one. Pushing from the collector sends the same bytes.',
  ].join('\n');
}

/**
 * A capture path as a git pathspec: double-quoted when it holds whitespace, as `spellCommand`
 * quotes a kit path (ADR-0050), and as it is otherwise. The collector's own capture names come
 * from `makeSlug` and hold none, but the path printed here is whatever the LEDGER names, and
 * a ledger rewritten by hand can name `research/raw/topic copy.md`: unquoted, cmd, PowerShell
 * and sh all hand git two pathspecs, and `git checkout HEAD --` then restores two unrelated
 * files - discarding their uncommitted work - and leaves the capture alone (found 2026-10-04
 * by an external review). Double quotes are read the same way by all three shells (ADR-0070).
 */
export function pathspec(file) {
  return /\s/.test(file) ? `"${file}"` : file;
}

/** The .gitattributes lines that pin the corpus to LF (ADR-0020). */
export const PIN_LINES = Object.freeze(['research/raw/* text eol=lf', '*.jsonl text eol=lf']);

/**
 * The remedy is scoped to the files that are actually affected, and it never reaches for
 * a recursive delete.
 *
 * A diagnostic that prints `git rm -r research/` (or anything that re-checks-out the
 * whole directory) is telling an operator to discard uncommitted evidence, notes and
 * decisions to fix a line-ending problem - and in a folder with no git metadata, there
 * is nothing to restore them from. The prerequisites come first and the scope is named.
 *
 * Judged by running it (2026-09-27): `git add --renormalize` fixes only the INDEX, and git
 * will not rewrite a working file it believes is unchanged - so the capture handoff reads
 * stayed CRLF. Each affected file is dropped from the index only (`git rm --cached`: the
 * file stays on disk) and checked out from HEAD through the pin, which writes LF bytes.
 * The pin is printed only when `.gitattributes` does not already carry it.
 */
export function lineEndingRemedy(files = [], { isRepo = true, pinned = false } = {}) {
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
    // Every indented line is a plain git command: it runs as written in cmd, PowerShell and
    // a POSIX shell alike. `printf` exists in none of the first two, and a trailing `# ...`
    // is a comment only in PowerShell and sh - cmd hands it to git as file names (found
    // 2026-09-27). This remedy is for a Windows checkout, so Windows shells are its readers.
    'First, check nothing is about to be lost - uncommitted evidence is irreplaceable.',
    'This should print nothing (no unstaged or untracked work under research/):',
    '',
    '    git status --porcelain research/',
    '',
    ...(pinned ? ['.gitattributes already pins the line endings.'] : [
      'Then pin the line endings: add these two lines to .gitattributes (create the file',
      'if it is not there), in any editor:',
      '',
      ...PIN_LINES.map((line) => `      ${line}`),
      '',
      'and stage it:',
      '',
      '    git add .gitattributes',
    ]),
    '',
    'Rewrite ONLY the affected files through the pin. `git rm --cached` removes the index',
    'entry only - the file stays on disk - so the checkout has to write it again, as LF:',
    '',
    ...named.flatMap((file) => [
      `    git rm --cached --quiet -- ${pathspec(file)}`,
      `    git checkout HEAD -- ${pathspec(file)}`,
    ]),
    ...(files.length > named.length ? [
      '',
      'and the rest of the captures the same way:',
      '',
      '    git rm -r --cached --quiet -- research/raw/',
      '    git checkout HEAD -- research/raw/',
    ] : []),
    '',
    'No file is deleted and nothing outside the affected captures is checked out. The',
    'checkout rewrites each capture from the committed copy as LF - git would not rewrite',
    'a file it believes unchanged, which is why the index entry goes first.',
    '',
    'Going to the collector fixes nothing here, and re-collecting spends paid credits to',
    'reproduce a corpus that is already on disk.',
  ].join('\n');
}

/**
 * `verifyHandoff(root, { corpus })` -> the report.
 *
 * Findings are named: handoff-ledger-missing, handoff-ledger-empty, handoff-evidence-missing,
 * handoff-evidence-unparsed, handoff-capture-missing, handoff-capture-unledgered, handoff-chain-broken,
 * plus one handoff-remedy.
 */
export function verifyHandoff(root, { corpus = null } = {}) {
  const snapshot = corpus ?? readCorpus(root);
  const chain = snapshot.chain ?? verifyLedger(root, { corpus: snapshot });
  const findings = [];
  const missingCaptures = [];
  const unledgered = [];
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

  // The table whose rows name the captures is part of what must travel. Absent, or holding
  // no evidence table, it has no rows, so no citations, so nothing to check - and "every
  // cited capture on disk" held vacuously: handoff said OK over a corpus whose EVIDENCE.md a
  // sync tool had dropped or a filter rewritten (found 2026-10-02, break-test).
  if (!snapshot.evidenceFile.present) {
    findings.push({
      name: 'handoff-evidence-missing',
      severity: 'fail',
      detail: `${PATHS.evidence} is not in this checkout - the table whose rows name the captures did not travel`,
    });
  } else if (!snapshot.evidenceFile.found) {
    findings.push({
      name: 'handoff-evidence-unparsed',
      severity: 'fail',
      detail: `${PATHS.evidence} holds no evidence table (a header row of ${HEADERS.evidence.join(' | ')}) - rewritten or damaged in transit; nothing can be checked against it`,
    });
  }

  for (const row of snapshot.evidence) {
    const capture = captureOf(snapshot, row);
    const file = row.raw || capture?.file || '';
    if (file && exists(resolve(root, file))) {
      // On disk, and the ledger holds entries, but none records this capture: preflight
      // fails it (fetch-entry-exists). An empty ledger is named once, above.
      if (snapshot.ledger.entries.length && !traceOf(snapshot, row).fetch) {
        unledgered.push({ row: row.id, file });
        findings.push({
          name: 'handoff-capture-unledgered',
          severity: 'fail',
          detail: `${row.id} cites ${file}, which is on disk but no ledger entry records it`,
        });
      }
      continue;
    }
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

  // Present, empty, and captures on disk: lost here, not left behind.
  // Or entries missing for captures that are here - a torn last line of a longer ledger.
  const ledgerLost = snapshot.ledger.present
    && ((!snapshot.ledger.entries.length && snapshot.captures.entries.length > 0) || unledgered.length > 0);
  // A capture changed after its fetch is here, and so is its ledger entry: nothing failed to
  // travel, the bytes changed (alteredRemedy). A broken chain beside it still did.
  const altered = chain.problems
    .filter((p) => p.rule === 'body-unmodified' && p.kind === 'modified')
    .map((p) => ({ file: p.file, line: p.line }));
  const travelled = findings.filter((f) => (f.name !== 'handoff-chain-broken' || (f.kind !== 'line-endings' && f.kind !== 'modified'))
    && f.name !== 'handoff-capture-unledgered'
    && !(ledgerLost && f.name === 'handoff-ledger-empty'));
  const report = {
    root,
    ok: findings.length === 0,
    findings,
    missingCaptures,
    unledgered,
    lineEndings,
    altered,
    // "Something did not travel" is anything that is not a line-ending rewrite, a capture
    // changed after its fetch, or a ledger that lost entries here.
    didNotTravel: travelled.length > 0,
    ledgerLost,
    entries: snapshot.ledger.entries.length,
    rows: snapshot.evidence.length,
    // Not a finding: the corpus can arrive whole while the brief is unreviewed. The CLI
    // says so, because phase 2 starts from that file.
    brief: briefReview(snapshot),
    // No ledger entry, no evidence row, no capture: nothing was ever collected, so there is
    // nothing that could have failed to travel. The CLI says so on a collector.
    nothingCollected: !snapshot.ledger.entries.length && !snapshot.evidence.length && !snapshot.captures.entries.length,
  };
  const remedy = handoffRemedy(report);
  if (remedy) report.findings.push({ name: 'handoff-remedy', severity: 'info', detail: remedy });
  report.remedy = remedy;
  return report;
}

/**
 * Whether `root` is inside a git repository: a `.git` entry (a folder, or the file a worktree
 * carries) in `root` or any folder above it. It was `root/.git` alone, so a nested decision
 * project (ADR-0030, `docs/decisions/<name>/`), which has none of its own, was told it had
 * "no git metadata" and given no checkout command, although the enclosing repository restores
 * its tracked captures as it does any other (found 2026-10-04 by an external review). Git's
 * pathspecs are relative to the cwd, so the printed commands run unchanged from the project.
 */
export function insideRepository(root) {
  for (let p = path.resolve(root); ; p = path.dirname(p)) {
    if (exists(path.join(p, '.git'))) return true;
    if (path.dirname(p) === p) return false;
  }
}

/** The remedy is picked from the CAUSE, never printed as a constant. */
export function handoffRemedy(report) {
  const parts = [];
  if (report.didNotTravel) parts.push(HANDOFF_REMEDY);
  if (report.ledgerLost) parts.push(ledgerLostRemedy());
  // Whether this is inside a repository at all decides which remedies are even runnable.
  const isRepo = insideRepository(report.root ?? '.');
  if (report.altered?.length) parts.push(alteredRemedy(report.altered.map((e) => e.file), { isRepo }));
  if (report.lineEndings?.length) {
    const attributes = readText(path.join(report.root ?? '.', '.gitattributes')) ?? '';
    const pinned = /^research\/raw\/\*\s+text\s+eol=lf\s*$/m.test(attributes);
    parts.push(lineEndingRemedy(report.lineEndings.map((e) => e.file), { isRepo, pinned }));
  }
  return parts.join('\n\n');
}

/** `{ state, todo }`: the brief's state and the judged sections still carrying a TODO. */
export function briefReview(snapshot) {
  const text = snapshot.brief?.present ? snapshot.brief.text : '';
  const state = briefState(text);
  const todo = state === 'draft' ? JUDGED_SECTIONS.filter((key) => !judgedSection(text, key).answered) : [];
  return { state, todo };
}
