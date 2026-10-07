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
import { spawn } from 'node:child_process';
import { today } from './core.mjs';
import { collectionPolicy } from './machine.mjs';
import {
  REQUESTS_DIR, listRequests, requestProblems, requestPages, applyRequest, writeResult,
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
  const kit = (script, args, cwd) => exec(nodePath, [path.join(kitRoot, 'bin', script), ...args], { cwd, env });
  const git = (args, cwd) => exec('git', args, { cwd, env });

  async function repoTop(dir) {
    const r = await git(['rev-parse', '--show-toplevel'], dir);
    return r.code === 0 ? path.resolve(r.output.trim()) : '';
  }

  /** Stage what a run wrote, the ledger by name (a dotfile rule can hide it), commit, push. */
  async function commitAndPush(top, paths, message) {
    for (const p of paths) {
      const r = await git(['add', '--', p], top);
      if (r.code !== 0) return `git add ${p} failed: ${lastLine(r.output)}`;
    }
    for (const p of paths) {
      if (!(p === 'research' || p.endsWith('/research'))) continue;
      const ledger = path.posix.join(p.slice(0, -'research'.length) || '.', LEDGER);
      if (fs.existsSync(path.join(top, ledger))) {
        const r = await git(['add', '-f', '--', ledger], top);
        if (r.code !== 0) return `git add -f ${ledger} failed: ${lastLine(r.output)}`;
      }
    }
    const staged = await git(['diff', '--cached', '--quiet'], top);
    const hasChanges = staged.code !== 0;
    if (hasChanges) {
      const c = await git(['commit', '-m', message], top);
      if (c.code !== 0) return `commit refused: ${lastLine(c.output)}`;
    }
    const upstream = await git(['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}'], top);
    if (upstream.code !== 0) return hasChanges ? 'committed; no upstream to push to' : 'no upstream to push to';
    const p = await git(['push'], top);
    if (p.code !== 0) return hasChanges ? `committed; push failed: ${lastLine(p.output)}` : `push failed: ${lastLine(p.output)}`;
    return hasChanges ? 'committed and pushed' : 'pushed';
  }

  function relTo(top, abs) {
    const rel = posix(path.relative(top, abs));
    return rel === '' ? '.' : rel;
  }

  async function refuse(top, dir, item, problems) {
    writeResult(dir, item.id, { status: 'refused', problems });
    const committed = await commitAndPush(top, [path.posix.join(relTo(top, dir), REQUESTS_DIR, `${item.id}.result.json`)],
      `research: refuse request ${item.id}`);
    if (committed === 'committed and pushed' || committed === 'pushed') delivered.add(item.id);
    runs.set(item.id, { status: 'refused', detail: problems.join('; '), git: committed });
    note(`refused ${item.id}: ${problems.join('; ')}`);
  }

  async function collect(top, dir, item, settings) {
    const request = item.request;
    const pages = requestPages(request, settings.perRequestPages);
    let target = dir;
    if (request.topic) {
      if (!settings.topicsFolder) return refuse(top, dir, item, ['this collector has no folder approved for new topics; the operator sets one in the panel']);
      target = path.join(top, ...settings.topicsFolder.split('/'), `${today()}-${item.id}`);
      if (!target.startsWith(top + path.sep)) return refuse(top, dir, item, ['the folder for new topics is outside the repository']);
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
    try { applied = applyRequest(target, item.id, request, pages); } catch (err) { return refuse(top, dir, item, [err.message]); }
    runs.set(item.id, { status: 'collecting', detail: `${pages} page(s) for ${applied.unknown}` });
    note(`collecting ${item.id}: up to ${pages} page(s) for ${applied.unknown}`);

    const run = await kit('research.mjs', ['--plan', applied.planFile], target);
    const spent = spentPages(run.output);
    recordSpend(spent, env);
    const output = redact(tail(run.output));
    const stoppedOn = creditsStopped(run.output);
    const paths = [path.posix.join(relTo(top, target), 'research')];
    // A new project travels whole - its AGENTS.md and scaffold too - with the request's result.
    if (target !== dir) paths.unshift(relTo(top, target)), paths.push(path.posix.join(relTo(top, dir), REQUESTS_DIR));

    if (stoppedOn) {
      // No result is written: the request is not finished, and runs again once resumed. A
      // page already on disk is not fetched twice, so only what is left is paid for.
      setPaused(`credits ran out on ${stoppedOn} during request ${item.id}. Top up and press Resume, `
        + 'or finish it in a terminal - auto-collect never switches to the free transports by itself.', env);
      const committed = await commitAndPush(top, paths, `research: request ${item.id} partly collected (${spent} page(s)) - credits ran out`);
      runs.set(item.id, { status: 'stopped', detail: `credits ran out on ${stoppedOn}`, pages: spent, output, git: committed });
      note(`paused: credits ran out on ${stoppedOn} during ${item.id}`);
      return;
    }
    if (run.code !== 0) return fail(top, dir, item, target, `research.mjs exited ${run.code}: ${lastLine(run.output)}`, run.output, paths, spent);

    const gate = await kit('preflight.mjs', [], target);
    const preflight = { code: gate.code, verdict: lastLine(gate.output) };
    writeResult(dir, item.id, {
      status: 'collected', unknown: applied.unknown, project: relTo(top, target), pages: spent, preflight,
      next: 'pull; review the new EVIDENCE rows (rewrite each Finding into a claim), then close the unknown and run preflight',
    });
    const committed = await commitAndPush(top, paths, `research: collect request ${item.id} (${spent} page(s), ${applied.unknown})`);
    if (committed === 'committed and pushed' || committed === 'pushed') delivered.add(item.id);
    runs.set(item.id, { status: 'collected', detail: `${applied.unknown}; preflight exit ${gate.code}`, pages: spent, output, git: committed });
    note(`collected ${item.id}: ${spent} page(s); ${committed}`);
  }

  async function fail(top, dir, item, target, detail, output, paths = null, spent = 0) {
    writeResult(dir, item.id, { status: 'failed', detail, project: relTo(top, target), pages: spent });
    const committed = await commitAndPush(top, paths ?? [path.posix.join(relTo(top, dir), REQUESTS_DIR)], `research: request ${item.id} failed`);
    if (committed === 'committed and pushed' || committed === 'pushed') delivered.add(item.id);
    runs.set(item.id, { status: 'failed', detail, pages: spent, output: redact(tail(String(output ?? ''))), git: committed });
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
      const dir = project();
      const top = await repoTop(dir);
      if (!top) { note(`${dir} is not in a git repository; requests travel by git`); return status(); }
      const pulled = await git(['pull', '--ff-only'], top);
      if (pulled.code !== 0) note(`git pull did not run cleanly (${lastLine(pulled.output)}); reading the requests already here`);

      for (const item of listRequests(dir)) {
        if (item.ignored) continue;
        if (item.result) {
          if (!delivered.has(item.id)) {
            const resultPath = path.posix.join(relTo(top, dir), REQUESTS_DIR, `${item.id}.result.json`);
            const delivery = await commitAndPush(top, [resultPath], `research: deliver request ${item.id}`);
            if (delivery === 'committed and pushed' || delivery === 'pushed') delivered.add(item.id);
            runs.set(item.id, { git: delivery });
          }
          continue;
        }
        const current = readAutoCollect(env);
        if (item.parseError) { await refuse(top, dir, item, [item.parseError]); continue; }
        const problems = requestProblems(item.request, current.settings);
        if (problems.length) { await refuse(top, dir, item, problems); continue; }
        if (current.paused) { runs.set(item.id, { status: 'waiting', detail: 'auto-collect is paused' }); continue; }
        const pages = requestPages(item.request, current.settings.perRequestPages);
        if (current.spent.pages + pages > current.settings.dailyPages) {
          runs.set(item.id, { status: 'waiting', detail: `today's cap: ${current.spent.pages} of ${current.settings.dailyPages} page(s) spent, this needs ${pages}` });
          continue;
        }
        const dirty = await git(['status', '--porcelain', '--', '.'], path.join(dir, 'research'));
        if (dirty.code !== 0 || dirty.output.trim()) {
          runs.set(item.id, { status: 'waiting', detail: 'research/ has uncommitted changes; commit or discard them - auto-collect commits everything under research/' });
          continue;
        }
        await collect(top, dir, item, current.settings);
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
      const run = runs.get(item.id) ?? {};
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
