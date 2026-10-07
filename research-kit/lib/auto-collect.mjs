// auto-collect.mjs - the collector listening for builder requests (ADR-0148).
//
// One cycle: pull, read `research/requests/`, and for each request without a result either
// refuse it (with the reasons, written beside it) or collect it - the SAME research.mjs an
// operator runs, then preflight - and commit the corpus with its ledger and push. The builder
// pulls and reads the result.
//
// What it never does, because the kit's rules say so:
//   - collect on a machine that may not (collectionPolicy, ADR-0010) - it refuses to start;
//   - pass --fallback. When the credits run out the run stops (ADR-0129), auto-collect pauses,
//     and the operator decides; nothing is retried until he resumes;
//   - spend past the daily page cap or the per-request cap;
//   - commit over somebody's unfinished work: research/ must be clean before a run, because
//     the commit takes everything under it;
//   - write a new topic over an existing project (ADR-0056): a topic request gets a new
//     folder under the one the operator approved, or is refused.
// Every command it runs is a fixed argument list; nothing from a request reaches one except
// through the files it writes.

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { readJson, today, writeJson } from './core.mjs';
import { collectionPolicy } from './machine.mjs';
import {
  REQUESTS_DIR, REQUEST_LIMITS, listRequests, requestProblemsResolved, requestPages, contractIds, applyRequest, writeResult,
  readAutoCollect, recordSpend, setPaused,
} from './requests.mjs';

export const RUN_OUTPUT_BYTES = 64 * 1024;
const LEDGER = 'research/raw/.fetches.jsonl';

/** `node`/`git` as a child: resolves `{ code, output }`, never rejects. */
export function execFile(command, args, { cwd, env, timeout = 30 * 60 * 1000 } = {}) {
  return new Promise((resolve) => {
    let output = '';
    let child;
    try {
      child = spawn(command, args, { cwd, env, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
    } catch (err) {
      resolve({ code: null, output: `could not start ${command}: ${err.message}\n` });
      return;
    }
    const keep = (chunk) => { if (output.length < RUN_OUTPUT_BYTES * 4) output += chunk.toString('utf8'); };
    const timer = setTimeout(() => child.kill(), timeout);
    child.stdout.on('data', keep);
    child.stderr.on('data', keep);
    child.on('error', (err) => { output += `could not start ${command}: ${err.message}\n`; });
    child.on('close', (code) => { clearTimeout(timer); resolve({ code, output }); });
  });
}

const tail = (s, n = RUN_OUTPUT_BYTES) => (s.length > n ? `[...]\n${s.slice(-n)}` : s);
const lastLine = (s) => String(s).trim().split(/\r?\n/).filter(Boolean).pop() ?? '';
const posix = (p) => p.split(path.sep).join('/');

/** The pages a research.mjs run spent, from its own summary line. */
export function spentPages(output) {
  const m = /^spent\s+(\d+)/m.exec(String(output));
  return m ? Number(m[1]) : 0;
}

/** The provider whose credits ran out, from research.mjs's summary, or ''. */
export function creditsStopped(output) {
  return /^stopped\s+credits ran out on (\S+)/m.exec(String(output))?.[1] ?? '';
}

/**
 * Build the listener. `project` is a function, because the panel's project can change;
 * `exec` and `git` are injectable so tests drive it with stand-in scripts.
 */
export function createAutoCollect({
  project,
  env = process.env,
  kitRoot,
  nodePath = process.execPath,
  exec = execFile,
  redact = (s) => s,
  lock = null,
} = {}) {
  // One mutex shared with whatever else touches the project (the panel's command runs and
  // project switch): a cycle mutates the corpus, so nothing else runs beside it.
  let held = '';
  const mutex = lock ?? {
    take(name) { if (held) return false; held = name; return true; },
    release(name) { if (held === name) held = ''; },
  };
  let busy = false;
  let timer = null;
  let lastCheck = '';
  const notes = [];
  const runs = new Map();
  const delivered = new Set();

  const note = (line) => { notes.push(`${new Date().toISOString()} ${redact(line)}`); if (notes.length > 50) notes.shift(); };
  const kit = (script, args, cwd, commandEnv = env) => exec(nodePath, [path.join(kitRoot, 'bin', script), ...args], { cwd, env: commandEnv });
  const git = (args, cwd) => exec('git', args, { cwd, env });

  const cacheKey = (dir, id) => `${canonical(dir)}\0${id}`;

  async function repoTop(dir) {
    const r = await git(['rev-parse', '--show-toplevel'], dir);
    return r.code === 0 ? canonical(r.output.trim()) : '';
  }

  // git reports the top level by its final path; the project may arrive by another spelling
  // of the same folder (a Windows 8.3 short name such as RUNNER~1, a symlinked temp dir), and
  // path.relative between two spellings walks out of the repository.
  function canonical(dir) {
    try { return fs.realpathSync.native(dir); } catch { return path.resolve(dir); }
  }

  /** Stage only this run's paths in a private index, leaving every existing staged file alone. */
  async function commitAndPush(top, paths, report) {
    const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'research-kit-autocollect-index-'));
    const indexEnv = { ...env, GIT_INDEX_FILE: path.join(scratch, 'index') };
    const isolatedGit = (args) => exec('git', args, { cwd: top, env: indexEnv });
    try {
      const initialized = await isolatedGit(['read-tree', 'HEAD']);
      if (initialized.code !== 0) return `could not initialize isolated git index: ${lastLine(initialized.output)}`;
      for (const p of paths) {
        const r = await isolatedGit(['add', '--', p]);
        if (r.code !== 0) return `git add ${p} failed: ${lastLine(r.output)}`;
      }
      for (const p of paths) {
        if (!(p === 'research' || p.endsWith('/research'))) continue;
        const ledger = path.posix.join(p.slice(0, -'research'.length) || '.', LEDGER);
        if (fs.existsSync(path.join(top, ledger))) {
          const r = await isolatedGit(['add', '-f', '--', ledger]);
          if (r.code !== 0) return `git add -f ${ledger} failed: ${lastLine(r.output)}`;
        }
      }
      const staged = await isolatedGit(['diff', '--cached', '--quiet']);
      if (staged.code > 1) return `could not inspect isolated git index: ${lastLine(staged.output)}`;
      const hasChanges = staged.code !== 0;
      if (hasChanges) {
        const c = await isolatedGit(['commit', '-m', report.subject, '-m', report.body]);
        if (c.code !== 0) return `commit refused: ${lastLine(c.output)}`;
        const reset = await git(['reset', '--quiet', 'HEAD', '--', ...paths], top);
        if (reset.code !== 0) return `committed; could not refresh staged paths: ${lastLine(reset.output)}`;
      }
      const upstream = await git(['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}'], top);
      if (upstream.code !== 0) return hasChanges ? 'committed; no upstream to push to' : 'no upstream to push to';
      const pushed = await git(['push'], top);
      if (pushed.code !== 0) return hasChanges ? `committed; push failed: ${lastLine(pushed.output)}` : `push failed: ${lastLine(pushed.output)}`;
      return hasChanges ? 'committed and pushed' : 'pushed';
    } finally {
      fs.rmSync(scratch, { recursive: true, force: true });
    }
  }

  const report = (subject, changed, why, verified, wrong = 'nothing to report') => ({
    subject,
    body: `what changed: ${changed}\nwhy: ${why}\nwhat you verified: verified ${verified}\nwhat you got wrong: ${wrong}`,
  });

  function inside(root, target) {
    const rel = path.relative(root, target);
    return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
  }

  function throughExistingAncestor(target) {
    let current = path.resolve(target);
    const suffix = [];
    for (;;) {
      try {
        fs.lstatSync(current);
        return path.resolve(fs.realpathSync.native(current), ...suffix);
      } catch {
        const parent = path.dirname(current);
        if (parent === current) return path.resolve(current, ...suffix);
        suffix.unshift(path.basename(current));
        current = parent;
      }
    }
  }

  function hasSymlinkComponent(root, target) {
    let current = root;
    for (const part of path.relative(root, target).split(path.sep).filter(Boolean)) {
      current = path.join(current, part);
      try { if (fs.lstatSync(current).isSymbolicLink()) return true; } catch { /* not created yet */ }
    }
    return false;
  }

  async function safeTopicTarget(top, target, topicsFolder) {
    const lexical = path.resolve(target);
    const relative = path.relative(top, lexical);
    if (!inside(top, lexical)) return { problem: 'the folder for new topics is outside the repository' };
    if (relative.split(path.sep).some((part) => part.toLowerCase() === '.git')) {
      return { problem: 'new topics cannot be created in Git metadata' };
    }
    if (hasSymlinkComponent(top, lexical)) return { problem: 'new topics cannot be created through a symbolic link' };
    const physical = throughExistingAncestor(lexical);
    if (!inside(canonical(top), physical)) return { problem: 'the approved topics folder resolves outside the repository' };
    const gitDir = await git(['rev-parse', '--absolute-git-dir'], top);
    if (gitDir.code === 0 && inside(canonical(gitDir.output.trim()), physical)) {
      return { problem: 'new topics cannot be created in Git metadata' };
    }
    if (topicsFolder) {
      const topics = throughExistingAncestor(path.resolve(top, ...topicsFolder.split('/')));
      if (!inside(topics, physical)) return { problem: 'the target resolves outside the approved topics folder' };
    }
    return { target: physical };
  }

  function collectionPaths(top, dir, target) {
    const paths = [path.posix.join(relTo(top, target), 'research')];
    if (target !== dir) paths.unshift(relTo(top, target)), paths.push(path.posix.join(relTo(top, dir), REQUESTS_DIR));
    return paths;
  }

  function relTo(top, abs) {
    const rel = posix(path.relative(top, abs));
    return rel === '' ? '.' : rel;
  }

  async function resumeInfo(top, dir, item, settings) {
    if (item.result?.status !== 'partial') return null;
    const resume = item.result.resume;
    if (!resume || typeof resume.target !== 'string' || typeof resume.unknown !== 'string'
      || !Number.isInteger(resume.remainingPages) || resume.remainingPages < 0 || resume.remainingPages > REQUEST_LIMITS.maxPages
      || !Number.isInteger(resume.pagesSpent) || resume.pagesSpent < 0) {
      throw new Error('partial request has invalid continuation state');
    }
    const target = path.resolve(top, resume.target);
    const relative = path.relative(top, target);
    if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
      throw new Error('partial request target is outside the repository');
    }
    if (item.request.topic) {
      if (!settings.topicsFolder) throw new Error('this collector has no folder approved for new topics');
      const topics = path.resolve(top, ...settings.topicsFolder.split('/'));
      const fromTopics = path.relative(topics, target);
      if (fromTopics === '..' || fromTopics.startsWith(`..${path.sep}`) || path.isAbsolute(fromTopics)
        || !path.basename(target).endsWith(`-${item.id}`)) {
        throw new Error('partial request target is outside the approved topic folder');
      }
      const safe = await safeTopicTarget(top, target, settings.topicsFolder);
      if (safe.problem) throw new Error(safe.problem);
      target = safe.target;
    } else if (target !== path.resolve(dir)) {
      throw new Error('partial request target does not match this project');
    }
    if (!fs.existsSync(path.join(target, `${REQUESTS_DIR}/${item.id}.plan.json`))) {
      throw new Error('partial request plan is missing');
    }
    if (!contractIds(target).includes(resume.unknown)) {
      throw new Error(`${resume.unknown} is not a row of research/DISCOVERY.md`);
    }
    return { ...resume, target };
  }

  async function refuse(top, dir, item, problems) {
    writeResult(dir, item.id, { status: 'refused', problems });
    const committed = await commitAndPush(top, [path.posix.join(relTo(top, dir), REQUESTS_DIR, `${item.id}.result.json`)],
      report(`research: refuse request ${item.id}`, `recorded request ${item.id} as refused`,
        'the request failed collector validation', `request validation named ${problems.length} problem(s)`));
    if (committed === 'committed and pushed' || committed === 'pushed') delivered.add(cacheKey(dir, item.id));
    runs.set(cacheKey(dir, item.id), { status: 'refused', detail: problems.join('; '), git: committed });
    note(`refused ${item.id}: ${problems.join('; ')}`);
  }

  async function collect(top, dir, item, settings, pages, resume) {
    const request = item.request;
    let target = resume?.target ?? dir;
    if (!resume && request.topic) {
      if (!settings.topicsFolder) return refuse(top, dir, item, ['this collector has no folder approved for new topics; the operator sets one in the panel']);
      const candidate = path.join(top, ...settings.topicsFolder.split('/'), `${today()}-${item.id}`);
      const safe = await safeTopicTarget(top, candidate, settings.topicsFolder);
      if (safe.problem) return refuse(top, dir, item, [safe.problem]);
      target = safe.target;
      if (fs.existsSync(target)) return refuse(top, dir, item, [`${relTo(top, target)} already exists; a new topic never goes over an existing project`]);
      const made = await kit('new-project.mjs', [target, `--topic=${request.topic}`], top);
      if (made.code !== 0) return fail(top, dir, item, target, `new-project failed: ${lastLine(made.output)}`, made.output);
      // The map's seeded checklist, searched but no page scraped: classifying it is the
      // builder's review step, and the pages are the request's to name.
      const mapped = await kit('decompose.mjs', ['--max-scrapes', '0'], target);
      if (mapped.code !== 0) return fail(top, dir, item, target, `decompose failed: ${lastLine(mapped.output)}`, mapped.output);
    } else if (!fs.existsSync(path.join(dir, 'research', 'plan.json')) || !fs.existsSync(path.join(dir, 'research', 'DISCOVERY.md'))) {
      return refuse(top, dir, item, ['this project has no research/plan.json and research/DISCOVERY.md to add the fact to']);
    }

    let applied;
    try {
      if (resume) {
        const planFile = `${REQUESTS_DIR}/${item.id}.plan.json`;
        const planPath = path.join(target, planFile);
        const plan = readJson(planPath, null);
        if (!plan || typeof plan !== 'object' || Array.isArray(plan)) throw new Error('partial request plan is invalid');
        plan.maxScrapes = pages;
        writeJson(planPath, plan);
        applied = { unknown: resume.unknown, planFile };
      } else {
        applied = applyRequest(target, item.id, request, pages);
      }
    } catch (err) { return refuse(top, dir, item, [err.message]); }
    runs.set(cacheKey(dir, item.id), { status: 'collecting', detail: `${pages} page(s) for ${applied.unknown}` });
    note(`collecting ${item.id}: up to ${pages} page(s) for ${applied.unknown}`);

    const requestEnv = { ...env, RESEARCH_KIT_ALLOW_INTERNAL_REDIRECTS: '0' };
    const run = await kit('research.mjs', ['--plan', applied.planFile], target, requestEnv);
    const spent = spentPages(run.output);
    recordSpend(spent, env);
    const output = redact(tail(run.output));
    const stoppedOn = creditsStopped(run.output);
    const paths = collectionPaths(top, dir, target);

    if (stoppedOn) {
      // A stopped request keeps its target, contract row and unused allowance for the next cycle.
      setPaused(`credits ran out on ${stoppedOn} during request ${item.id}. Top up and press Resume, `
        + 'or finish it in a terminal - auto-collect never switches to the free transports by itself.', env);
      const totalSpent = (resume?.pagesSpent ?? 0) + spent;
      const remainingPages = Math.max(0, pages - spent);
      const plan = readJson(path.join(target, applied.planFile), {});
      plan.maxScrapes = remainingPages;
      writeJson(path.join(target, applied.planFile), plan);
      writeResult(dir, item.id, {
        status: 'partial',
        detail: `credits ran out on ${stoppedOn}`,
        pages: totalSpent,
        resume: { target: relTo(top, target), unknown: applied.unknown, remainingPages, pagesSpent: totalSpent },
      });
      const committed = await commitAndPush(top, paths, report(
        `research: request ${item.id} partly collected`,
        `recorded partial collection for ${item.id} (${spent} page(s))`,
        'the provider stopped because its credits ran out',
        `research.mjs reported ${spent} page(s) spent and ${remainingPages} page(s) remaining`,
      ));
      runs.set(cacheKey(dir, item.id), { status: 'stopped', detail: `credits ran out on ${stoppedOn}`, pages: totalSpent, output, git: committed });
      note(`paused: credits ran out on ${stoppedOn} during ${item.id}`);
      return;
    }
    if (run.code !== 0) return fail(top, dir, item, target, `research.mjs exited ${run.code}: ${lastLine(run.output)}`, run.output, paths, spent);

    const gate = await kit('preflight.mjs', [], target);
    const preflight = { code: gate.code, verdict: lastLine(gate.output) };
    writeResult(dir, item.id, {
      status: 'collected', unknown: applied.unknown, project: relTo(top, target), pages: (resume?.pagesSpent ?? 0) + spent, preflight,
      next: 'pull; review the new EVIDENCE rows (rewrite each Finding into a claim), then close the unknown and run preflight',
    });
    const committed = await commitAndPush(top, paths, report(
      `research: collect request ${item.id}`,
      `collected ${item.id} for ${applied.unknown} (${spent} page(s))`,
      'the builder requested a verified fact and the collector gathered its evidence',
      `research.mjs exited 0 and preflight exited ${gate.code}`,
    ));
    if (committed === 'committed and pushed' || committed === 'pushed') delivered.add(cacheKey(dir, item.id));
    runs.set(cacheKey(dir, item.id), { status: 'collected', detail: `${applied.unknown}; preflight exit ${gate.code}`, pages: (resume?.pagesSpent ?? 0) + spent, output, git: committed });
    note(`collected ${item.id}: ${spent} page(s); ${committed}`);
  }

  async function fail(top, dir, item, target, detail, output, paths = null, spent = 0) {
    writeResult(dir, item.id, { status: 'failed', detail, project: relTo(top, target), pages: spent });
    const committed = await commitAndPush(top, paths ?? [path.posix.join(relTo(top, dir), REQUESTS_DIR)], report(
      `research: request ${item.id} failed`,
      `recorded request ${item.id} as failed after ${spent} page(s)`,
      detail,
      `research.mjs exited unsuccessfully${spent ? ` after reporting ${spent} page(s)` : ''}`,
    ));
    if (committed === 'committed and pushed' || committed === 'pushed') delivered.add(cacheKey(dir, item.id));
    runs.set(cacheKey(dir, item.id), { status: 'failed', detail, pages: spent, output: redact(tail(String(output ?? ''))), git: committed });
    note(`failed ${item.id}: ${detail}`);
  }

  /** Why auto-collect cannot run here, or ''. */
  function blocked() {
    const policy = collectionPolicy(env);
    return policy.mayCollect ? '' : `${policy.reason} - auto-collect runs only on the collector`;
  }

  /** One pass. `force` runs it while the mode is off (the panel's "Check now"). */
  async function cycle({ force = false } = {}) {
    if (busy) return status();
    const state = readAutoCollect(env);
    if (state.settings.mode === 'off' && !force) return status();
    const why = blocked();
    if (why) { note(why); return status(); }
    if (!mutex.take('auto-collect')) { note('another run holds the project; this check waits for the next one'); return status(); }
    busy = true;
    try {
      lastCheck = new Date().toISOString();
      const dir = canonical(project());
      const top = await repoTop(dir);
      if (!top) { note(`${dir} is not in a git repository; requests travel by git`); return status(); }
      const pulled = await git(['pull', '--ff-only'], top);
      if (pulled.code !== 0) note(`git pull did not run cleanly (${lastLine(pulled.output)}); collection blocked until synchronization succeeds`);
      const requests = pulled.code === 0 ? listRequests(dir) : [];

      for (const item of requests) {
        if (item.ignored) continue;
        if (item.result && item.result.status !== 'partial') {
          const key = cacheKey(dir, item.id);
          if (!delivered.has(key)) {
            const resultPath = path.posix.join(relTo(top, dir), REQUESTS_DIR, `${item.id}.result.json`);
            const delivery = await commitAndPush(top, [resultPath], report(
              `research: deliver request ${item.id}`,
              `delivered the existing result for ${item.id}`,
              'a previous collection or refusal recorded a result that still needs to reach the builder',
              'the result file was staged in an isolated index and pushed when an upstream was available',
            ));
            if (delivery === 'committed and pushed' || delivery === 'pushed') delivered.add(key);
            runs.set(key, { git: delivery });
          }
          continue;
        }
        const current = readAutoCollect(env);
        if (item.parseError) { await refuse(top, dir, item, [item.parseError]); continue; }
        const problems = await requestProblemsResolved(item.request, current.settings);
        if (problems.length) { await refuse(top, dir, item, problems); continue; }
        let resume;
        try { resume = await resumeInfo(top, dir, item, current.settings); } catch (err) {
          await refuse(top, dir, item, [err.message]);
          continue;
        }
        const key = cacheKey(dir, item.id);
        if (item.result?.status === 'partial') {
          const pendingPaths = collectionPaths(top, dir, resume.target);
          const delivery = await commitAndPush(top, pendingPaths, report(
            `research: deliver partial request ${item.id}`,
            `committed or pushed the existing partial state for ${item.id}`,
            'the previous credit-limited run must reach the builder before resuming',
            'delivery was retried before pause, dirty-tree, and spend checks; no pages were fetched',
          ));
          runs.set(key, { status: 'partial', detail: 'retrying delivery before resume', git: delivery });
          if (delivery !== 'committed and pushed' && delivery !== 'pushed') {
            note(`partial delivery for ${item.id} is still pending: ${delivery}`);
            continue;
          }
        }
        if (current.paused) { runs.set(key, { status: 'waiting', detail: 'auto-collect is paused' }); continue; }
        const pages = resume
          ? Math.min(resume.remainingPages, requestPages(item.request, current.settings.perRequestPages))
          : requestPages(item.request, current.settings.perRequestPages);
        if (current.spent.pages + pages > current.settings.dailyPages) {
          runs.set(key, { status: 'waiting', detail: `today's cap: ${current.spent.pages} of ${current.settings.dailyPages} page(s) spent, this needs ${pages}` });
          continue;
        }
        const dirty = await git(['status', '--porcelain', '--', '.'], path.join(dir, 'research'));
        if (dirty.code !== 0 || dirty.output.trim()) {
          runs.set(key, { status: 'waiting', detail: 'research/ has uncommitted changes; commit or discard them - auto-collect commits everything under research/' });
          continue;
        }
        await collect(top, dir, item, current.settings, pages, resume);
      }
    } finally {
      busy = false;
      mutex.release('auto-collect');
    }
    return status();
  }

  function status() {
    const state = readAutoCollect(env);
    const dir = project();
    const requests = listRequests(dir).map((item) => {
      const run = runs.get(cacheKey(dir, item.id)) ?? {};
      const fact = item.request && typeof item.request.fact === 'string' ? item.request.fact.slice(0, 300) : '';
      if (item.ignored) return { id: item.id, status: 'ignored', detail: item.ignored };
      if (item.result) return { id: item.id, fact, status: item.result.status, pages: item.result.pages ?? 0,
        detail: item.result.status === 'refused' ? (item.result.problems ?? []).join('; ') : String(item.result.detail ?? item.result.unknown ?? ''),
        output: run.output ?? '', git: run.git ?? '' };
      return { id: item.id, fact, status: run.status ?? 'queued', detail: run.detail ?? '', pages: run.pages ?? 0, output: run.output ?? '', git: run.git ?? '' };
    });
    return {
      settings: state.settings,
      spent: state.spent,
      paused: state.paused,
      blocked: blocked(),
      busy,
      lastCheck,
      folder: posix(path.join(dir, REQUESTS_DIR)),
      requests,
      notes: [...notes],
    };
  }

  /** (Re)arm the timer from the settings; off clears it. */
  function schedule() {
    if (timer) clearInterval(timer);
    timer = null;
    const { settings } = readAutoCollect(env);
    if (settings.mode === 'off') return;
    timer = setInterval(() => { cycle().catch((err) => note(`cycle failed: ${err.message}`)); }, settings.intervalMinutes * 60 * 1000);
    timer.unref?.();
  }

  function resume() {
    setPaused('', env);
    note('resumed by the operator');
    return status();
  }

  return { cycle, status, schedule, resume, stop() { if (timer) clearInterval(timer); timer = null; } };
}

/** The request file a builder writes, as text - for the panel's builder instructions. */
export function requestExample() {
  return `${JSON.stringify({
    fact: 'What is the burst limit of endpoint X on the free tier?',
    blocks: 'the retry and queue design',
    urls: ['https://docs.example.com/limits'],
    queries: ['example api free tier burst limit'],
    prefer: ['docs.example.com'],
  }, null, 2)}\n`;
}
