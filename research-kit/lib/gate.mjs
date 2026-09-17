// gate.mjs - gate policy (ADR-0002, ADR-0007, ADR-0008, ADR-0020).
//
// `isGated` (the four markers), `evaluate` (commit and edit), the GATE_OFF recording,
// and the architecture-map rule. Contains no repo-specific path.
//
// One deliberate exception to "no CLI parsing": the commit gate's staged-path list
// arrives as DATA ON A PIPE, because argv was O(n^2) to build and bounded besides.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { PATHS, resolve, exists, isDirectory, readJson } from './core.mjs';
import { GATE_MARKERS } from './scaffold.mjs';
import { runPreflight, verdictContext, readGateState, fixCommand } from './preflight.mjs';
import { readCorpus } from './corpus.mjs';
import { isGitRepo } from './machine.mjs';
import { recordOverride } from './provenance.mjs';

export const DEFAULT_CODE_PATHS = Object.freeze(['src', 'lib', 'bin', 'scripts', 'app']);

/** A project is gated when ANY of the four markers exists. */
export function isGated(root) {
  return GATE_MARKERS.some((marker) => {
    const abs = resolve(root, marker);
    return marker.endsWith('/') || marker === PATHS.raw ? isDirectory(abs) : exists(abs);
  });
}

/** Guarded paths are project configuration (ADR-0008). */
export function loadGateConfig(root) {
  const config = readJson(resolve(root, PATHS.kit), null);
  const declared = config?.architecture?.codePaths;
  return {
    codePaths: Array.isArray(declared) && declared.length ? declared : [...DEFAULT_CODE_PATHS],
    declared: Array.isArray(declared) && declared.length > 0,
  };
}

function withinAny(pathName, dirs) {
  const normalized = String(pathName).split('\\').join('/').replace(/^\.\//, '');
  return dirs.some((dir) => normalized === dir || normalized.startsWith(`${dir.replace(/\/$/, '')}/`));
}

/**
 * The architecture-map rule: a commit touching a declared code path stages
 * `docs/ARCHITECTURE.md` in the SAME commit. What it proves is deliberately modest -
 * the map was staged, not that it is current. A prompt, not a proof.
 */
export function architectureMapBreach(root, stagedPaths) {
  if (!Array.isArray(stagedPaths) || !stagedPaths.length) return null;
  const { codePaths } = loadGateConfig(root);
  const touched = stagedPaths.filter((p) => withinAny(p, codePaths));
  if (!touched.length) return null;
  if (stagedPaths.some((p) => String(p).split('\\').join('/') === PATHS.architecture)) return null;
  return {
    rule: 'architecture-map-same-commit',
    touched,
    detail: `${touched.length} staged path(s) are inside a declared code path, and ${PATHS.architecture} is not staged with them`,
    fix: `git add ${PATHS.architecture}`,
  };
}

// ---------------------------------------------------------------- staged paths as data

/** null means "stdin could not be read"; [] means "read, and empty". Never conflate them. */
export function splitPathList(text) {
  if (text === null || text === undefined) return null;
  const raw = String(text);
  const parts = raw.includes('\0') ? raw.split('\0') : raw.split(/\r?\n/);
  return parts.map((p) => p.trim()).filter(Boolean);
}

export function stdinIsReadable() {
  try {
    // isatty(0) rather than inferring from the file type: a socketpair is not a FIFO,
    // and /dev/null is a character device that reads as immediate EOF.
    return !process.stdin.isTTY;
  } catch {
    return false;
  }
}

export function stagedPathsFromStdin(readSync) {
  if (!stdinIsReadable()) return null;
  try {
    return splitPathList(readSync());
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------- the index snapshot

/**
 * THE COMMIT GATE JUDGES THE INDEX, NOT THE WORKING TREE (ADR-0024).
 *
 * git hands the hook a list of staged path NAMES and nothing else. Reading the corpus off
 * disk therefore judged different bytes from the ones about to be committed: stage an
 * `OPEN` contract, restore `CLOSED` in the working tree only, and the gate allowed a
 * commit whose `git show :research/DISCOVERY.md` still said OPEN.
 *
 * `git checkout-index` materialises the index's own content into a scratch directory, and
 * the same verdict then runs over that. The working tree is never touched, and the edit
 * gate keeps reading it - an interactive research check is about what you have in front
 * of you, which is exactly the opposite question.
 */
export function materializeIndex(root, { run = gitCapture, tmp = os.tmpdir() } = {}) {
  if (!isGitRepo(root)) {
    return { ok: false, reason: 'not-a-repository', detail: 'no .git here, so there is no index to read' };
  }

  const dir = fs.mkdtempSync(path.join(tmp, 'research-kit-index-'));
  // Only the corpus is materialised. The gate judges research/, and copying a whole
  // checkout to answer a question about one directory is a cost paid on every commit.
  const listed = run(['ls-files', '-z', '--', 'research'], { cwd: root });
  if (listed === null) {
    fs.rmSync(dir, { recursive: true, force: true });
    return { ok: false, reason: 'git-failed', detail: 'could not list the index' };
  }

  const paths = String(listed).split('\0').map((p) => p.trim()).filter(Boolean);
  if (!paths.length) {
    return { ok: true, dir, files: 0, empty: true };
  }

  const written = run(['checkout-index', '--prefix', `${dir.split(path.sep).join('/')}/`, '-f', '--', ...paths], { cwd: root });
  if (written === null) {
    fs.rmSync(dir, { recursive: true, force: true });
    return { ok: false, reason: 'git-failed', detail: 'could not materialise the index' };
  }
  return { ok: true, dir, files: paths.length, empty: false };
}

function gitCapture(args, { cwd }) {
  try {
    return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 });
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------- the verdict

/**
 * `evaluate(root, { gate, stagedPaths })` -> one verdict object.
 *
 * Verdict shapes: `not-gated`, `override` (GATE_OFF), `pass`, `block`.
 * While the verdict fails, the commit gate blocks staged changes OUTSIDE `research/`
 * and allows changes confined to it: committing collected evidence is the workflow, and
 * blocking it would make the gate a nuisance and guarantee its removal.
 */
export function evaluate(root, { gate = 'commit', stagedPaths = null, corpus = null, env = process.env, record = true } = {}) {
  const base = { gate, root, fix: fixCommand() };

  if (!isGated(root)) {
    return { ...base, verdict: 'not-gated', allow: true, reason: 'no gate marker in this project', findings: [] };
  }

  if (exists(resolve(root, PATHS.gateOff))) {
    if (record) { try { recordOverride(root, 'GATE_OFF', `${gate} gate`); } catch { /* read-only checkout */ } }
    return {
      ...base, verdict: 'override', allow: true,
      reason: `${PATHS.gateOff} is present - the gate is off for this repository, and it is recorded`,
      findings: [],
    };
  }

  // The commit gate judges the INDEX; every other caller judges the working tree.
  // A caller that injected its own corpus has already decided what it wants judged.
  let snapshot = corpus;
  let judged = 'working-tree';
  let indexNote = null;
  let scratch = null;

  if (gate === 'commit' && !corpus) {
    const materialised = materializeIndex(root);
    if (materialised.ok && materialised.empty) {
      // The working tree is gated and the index holds no corpus at all: research/ is
      // untracked. Reporting that as "your contract is missing" sends the operator to
      // look for a file that is sitting right there. The real defect is that the
      // evidence is not in the repository, so it cannot travel (ADR-0011).
      return {
        ...base,
        verdict: 'block',
        allow: false,
        judged: 'index',
        reason: 'this project is gated, but no part of research/ is tracked - the evidence is not in the repository and cannot travel',
        fix: 'git add -f research/          # including its dotfiles',
        findings: [],
      };
    }
    if (materialised.ok) {
      scratch = materialised.dir;
      snapshot = readCorpus(materialised.dir);
      judged = 'index';
    } else {
      // Never silently: a gate that quietly changed which bytes it judges is the defect.
      indexNote = `could not read the index (${materialised.reason}) - judging the working tree instead`;
    }
  }

  try {
    return commitVerdict();
  } finally {
    if (scratch) { try { fs.rmSync(scratch, { recursive: true, force: true }); } catch { /* best effort */ } }
  }

  function commitVerdict() {
  // The corpus may come from the scratch index, but the GATE STATE is the machine's and
  // the repository's - GATE_OFF and a repository-local hooksPath are facts about here.
  const context = verdictContext(root, { corpus: snapshot, env });
  context.gate = readGateState(root, env);
  const preflight = runPreflight(root, { context, env });
  base.judged = judged;
  if (indexNote) base.indexNote = indexNote;

  const outsideResearch = Array.isArray(stagedPaths)
    ? stagedPaths.filter((p) => !String(p).split('\\').join('/').startsWith('research/'))
    : null;

  if (preflight.pass) {
    const breach = gate === 'commit' ? architectureMapBreach(root, stagedPaths) : null;
    if (breach) {
      return {
        ...base, verdict: 'block', allow: false, preflight, breach,
        reason: breach.detail, fix: breach.fix, findings: preflight.failures,
      };
    }
    return { ...base, verdict: 'pass', allow: true, preflight, reason: 'the gate passes', findings: [] };
  }

  if (gate === 'commit' && Array.isArray(outsideResearch) && outsideResearch.length === 0) {
    return {
      ...base, verdict: 'pass', allow: true, preflight,
      reason: 'the verdict fails, and this commit is confined to research/ - committing evidence is the workflow',
      findings: preflight.failures,
    };
  }

  return {
    ...base,
    verdict: 'block',
    allow: false,
    preflight,
    reason: `${preflight.failures.length} blocking finding(s): ${preflight.failures.slice(0, 3).map((f) => `${f.check}/${f.rule}`).join(', ')}`,
    findings: preflight.failures,
    staged: outsideResearch,
  };
  }
}

export { GATE_MARKERS, fixCommand };
