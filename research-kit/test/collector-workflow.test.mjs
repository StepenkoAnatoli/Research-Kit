// Properties of the collector workflow, asserted offline.
//
// This file exists because the thing it checks cannot be checked any other way that is
// affordable. `collect.yml` spends real credits, so it is never run in ordinary CI - and
// a workflow nobody runs is a workflow whose regressions nobody sees. Every property
// below is one a reader would have to hold in their head while reviewing the YAML, which
// is exactly the kind of thing that survives one review and dies at the next.
//
// Text, not a parsed document: the kit has no dependencies and therefore no YAML parser,
// and writing one to test a config file would be a larger risk than the file. The same
// approach already guards `live-collection.yml` in architecture-map.test.mjs.
//
// Comments are stripped before every scan. A rule that matched its own explanation would
// be a rule that passes because somebody described the danger, which is how the structural
// guard in this repository first fooled itself.

import { test, describe, assert, fs, path, KIT_ROOT } from './harness.mjs';

describe('collector-workflow');

const REPO = path.resolve(KIT_ROOT, '..');
const WORKFLOWS = path.join(REPO, '.github', 'workflows');
const COLLECTOR = path.join(WORKFLOWS, 'collect.yml');

const yaml = fs.existsSync(COLLECTOR) ? fs.readFileSync(COLLECTOR, 'utf8') : null;

/** The lines that actually execute: comments explain, they do not run. */
function executable(text) {
  return text.split('\n').filter((line) => !line.trim().startsWith('#')).join('\n');
}

const body = yaml === null ? '' : executable(yaml);

/** Index of the first line matching `re`, or -1. Used for ordering assertions. */
function lineOf(text, re) {
  return text.split('\n').findIndex((line) => re.test(line));
}

/**
 * The scope-canary job on its own: everything from `jobs:` up to the `collect:` job.
 *
 * Sliced out rather than searched whole, because the canary's defining property is a
 * NEGATIVE - it must not declare an environment - and a negative asserted against the
 * whole file would pass for the wrong reason the moment any job declared one.
 */
function canaryJob() {
  const jobs = body.slice(body.indexOf('\njobs:'));
  const end = jobs.indexOf('\n  collect:');
  return end === -1 ? jobs : jobs.slice(0, end);
}

test('the collector workflow exists', () => {
  assert.ok(yaml !== null, '.github/workflows/collect.yml is missing; every test below is vacuous without it');
});

// ---------------------------------------------------------------- the spend gate

test('collection is gated on a protected environment', () => {
  assert.ok(/^\s*environment:\s*research-collection\s*$/m.test(body),
    'the job must declare `environment: research-collection` - its protection rules are the '
    + 'only enforcement in the file that does not depend on a step behaving');
});

test('a missing or auto-created environment stops the run BEFORE it spends', () => {
  // GitHub does not fail a workflow that names an environment which does not exist: it
  // CREATES one, with no protection rules and no secrets. So a typo in the environment
  // name, or a deleted environment, silently removes the approval gate. The marker
  // variable is what notices - an auto-created environment has no variables.
  assert.ok(body.includes('vars.RESEARCH_KIT_COLLECTION_ENV'),
    'nothing checks that the environment actually exists, so a typo in its name would '
    + 'produce an UNPROTECTED environment and a run that spends credits without approval');

  const marker = lineOf(body, /vars\.RESEARCH_KIT_COLLECTION_ENV/);
  const spends = lineOf(body, /bin\/research\.mjs/);
  assert.ok(marker !== -1 && spends !== -1 && marker < spends,
    'the environment check must run before the first step that can spend a credit');
});

test('the credential is required, and required before anything is spent', () => {
  assert.ok(body.includes('secrets.FIRECRAWL_API_KEY'), 'the collector needs the metered credential');

  const checked = lineOf(body, /FIRECRAWL_API_KEY:-\}/);
  const spends = lineOf(body, /bin\/research\.mjs/);
  assert.ok(checked !== -1, 'nothing checks the credential is non-empty');
  assert.ok(checked < spends, 'the credential check must run before collection, not alongside it');
});

test('there is no keyless fallback: a missing credential fails rather than degrading', () => {
  // The temptation is a `transport: http-keyless` fallback so the run "still works". It
  // would return a quietly worse corpus under the same artifact name, and the person who
  // asked for research would have no way to tell. A refusal is the honest answer.
  assert.ok(!/http-keyless/.test(body),
    'the collector offers a keyless route; a missing credential must refuse, not silently collect a worse corpus');
  assert.ok(/RESEARCH_KIT_TRANSPORT:\s*firecrawl-cli/.test(body),
    'the collector should pin the metered transport rather than letting a probe choose');
});

test('the credential is never echoed, written, or put on a command line', () => {
  const lines = body.split('\n').filter((l) => l.includes('FIRECRAWL_API_KEY'));
  for (const line of lines) {
    assert.ok(!/echo\s+["']?\$\{?FIRECRAWL_API_KEY/.test(line), `the credential is echoed: ${line.trim()}`);
    assert.ok(!/>\s*\S*\.env/.test(line), `the credential is written to a file: ${line.trim()}`);
    assert.ok(!/--api-key|--key\b/.test(line), `the credential is put on a command line: ${line.trim()}`);
  }
});

// ---------------------------------------------------------------- injection

test('no workflow interpolates a dispatch input into a shell script', () => {
  // `${{ inputs.topic }}` inside a `run:` block is TEXTUAL SUBSTITUTION performed before
  // the shell sees the script, so a topic containing a backtick or $(...) executes on the
  // runner. Inputs must arrive through `env:` and be read as variables.
  //
  // Checked across every workflow, not only the collector: this is the class of defect,
  // and the next workflow to be added is the one most likely to reintroduce it.
  const offenders = [];
  for (const name of fs.readdirSync(WORKFLOWS)) {
    if (!name.endsWith('.yml') && !name.endsWith('.yaml')) continue;
    const text = executable(fs.readFileSync(path.join(WORKFLOWS, name), 'utf8'));
    let inRun = false;
    let runIndent = 0;
    for (const line of text.split('\n')) {
      const indent = line.length - line.trimStart().length;
      if (/^\s*run:\s*\|?\s*$/.test(line)) { inRun = true; runIndent = indent; continue; }
      if (inRun && line.trim() && indent <= runIndent) inRun = false;
      if (!inRun) continue;
      const m = line.match(/\$\{\{\s*(inputs\.[A-Za-z0-9_]+|github\.event\.inputs\.[A-Za-z0-9_]+)/);
      if (m) offenders.push(`${name}: ${line.trim()}`);
    }
  }
  assert.deepEqual(offenders, [],
    'a dispatch input is substituted into a shell script; pass it through `env:` instead:\n  '
    + offenders.join('\n  '));
});

test('the candidate pool is WIDER than the page budget, or ranking decides nothing', () => {
  // `limit` is how many results the search is asked for; `perQuery` is how many survive
  // selectCandidates' ranked slice. Setting both to max_pages made them equal, so the slice
  // kept everything the search returned and `rankCandidate` - the preferred-domain bonus,
  // the docs/terms bonuses, the blog and forum penalty - could not affect a single
  // collection on the dispatched path.
  //
  // Measured on job-0922h: "searched firecrawl-cli 8 -> 8 distinct", max_pages 8, all 8
  // collected, seven of them off topic. Ranking was inert, and had been since perQuery was
  // raised to max_pages to fix a different bug - a fix that widened breadth and destroyed
  // selection in the same line.
  //
  // Widening costs nothing: a search is billed per search, not per result. Spend stays
  // bounded by maxScrapes and perQuery.
  const limit = body.match(/plan\.limit\s*=\s*([^;]+);/);
  const perQuery = body.match(/plan\.perQuery\s*=\s*([^;]+);/);
  assert.ok(limit && perQuery, 'the workflow no longer writes both plan.limit and plan.perQuery');
  assert.ok(/\*\s*[2-9]|Math\.max\([^)]*\*/.test(limit[1]),
    `plan.limit must be a MULTIPLE of the page budget, or the funnel is flat: ${limit[1].trim()}`);
  assert.ok(!/^\s*Number\(process\.env\.MAX_PAGES\)\s*$/.test(limit[1]),
    'plan.limit equals the page budget, which is the flat funnel this test exists to prevent');
});

test('the dispatcher can supply the real queries, and nothing guesses how to split a topic', () => {
  // A topic is a DESCRIPTION. Used verbatim as the one search string it returns the words
  // rather than the subject when those words are common - three corpora here came back
  // mostly noise that way ("input", "data retention", "regulation").
  //
  // The caller knows the question, so the caller may state it. What must NOT appear is a
  // heuristic that splits a topic into queries by itself: four such heuristics have been
  // measured and rejected in this repository, and a fifth invented here would be the same
  // mistake in a place nobody tests, because this workflow costs money to run.
  assert.match(body, /process\.env\.QUERIES/, 'the workflow ignores dispatched queries');
  assert.match(body, /QUERIES: \$\{\{ inputs\.queries \}\}/, 'and they must arrive through env, like every other input');
  assert.match(body, /plan\.prefer = /, 'preferred domains are the other half - the page that OWNS the fact');

  // Falling back to the topic keeps every dispatch that predates these inputs working.
  assert.match(body, /supplied\.length[\s\S]{0,200}the dispatched topic/,
    'without supplied queries the topic must still be used, or old dispatches break');
});

test('the dispatch input budget is not spent without noticing', () => {
  // `workflow_dispatch` refuses at dispatch above ten inputs - loudly, which is the good
  // case, but the whole workflow fails for every caller the moment it is exceeded. This
  // stands at nine. The next addition should be a decision, not a surprise.
  const inputs = body.slice(body.indexOf('    inputs:'), body.indexOf('run-name:'))
    .split('\n').filter((line) => /^      [a-z_]+:$/.test(line));
  assert.ok(inputs.length <= 9,
    `collect.yml declares ${inputs.length} dispatch inputs and the observed ceiling is 10: `
    + `${inputs.map((l) => l.trim()).join(' ')}`);
});

test('a dispatched prior is registered BEFORE the collect step, or it is worthless', () => {
  // The ordering this whole mechanism rests on, pinned at the one place it could silently
  // invert. `bin/prior.mjs` refuses after the first scrape, so a registration step that
  // drifted below `collect` would not corrupt anything - it would simply stop working, on
  // a workflow nobody runs in CI because it spends real money.
  //
  // This exists because the local mechanism was nearly useless without the remote one: the
  // runner scaffolds its own project with an empty ledger, so a prior registered on the
  // operator's machine cannot reach the corpus that comes back, and every corpus in this
  // repository since the remote collector shipped was collected on this path.
  const register = lineOf(body, /bin\/prior\.mjs/);
  const collect = lineOf(body, /bin\/research\.mjs/);
  assert.ok(register !== -1, 'the collector never registers a dispatched prior');
  assert.ok(collect !== -1, 'the collector never collects');
  assert.ok(register < collect,
    'the prior is registered after collection starts, where bin/prior.mjs refuses it');
  assert.match(body, /if: inputs\.prior != ''/, 'the step must be skipped when no prior was dispatched');
});

test('the prior reaches node through the environment, like the topic', () => {
  // Same class of defect as the topic, and the same remedy - covered generally by the
  // interpolation test above, asserted positively here so the intended shape is pinned
  // rather than merely the absence of the wrong one.
  const step = body.slice(body.indexOf('register the prior'));
  assert.match(step.slice(0, 600), /PRIOR: \$\{\{ inputs\.prior \}\}/);
  assert.match(step.slice(0, 900), /process\.env\.PRIOR/);
});

// ---------------------------------------------------------------- what the names disclose

test('the topic is not in the run name', () => {
  const runName = (body.match(/^run-name:.*$/m) ?? [''])[0];
  assert.ok(runName, 'the workflow should set an explicit run-name rather than inheriting one');
  assert.ok(!/inputs\.topic|event\.inputs\.topic/.test(runName),
    `the run name carries the topic, and a run listing is readable by an anonymous caller on a public repository: ${runName}`);
});

test('the artifact name is derived from the caller reference or the run id, never the topic', () => {
  // The whole STEP, not the one line: the name is assembled from a shell variable set a
  // line earlier, and a single-line assertion would either miss the derivation or pin the
  // exact spelling of it. What matters is that no ingredient is the topic.
  const steps = body.split(/\n      - /);
  const naming = steps.filter((s) => s.includes('ARTIFACT_NAME='));
  assert.equal(naming.length, 1, `expected exactly one step to name the artifact, found ${naming.length}`);
  const step = naming[0];

  assert.ok(!/TOPIC|inputs\.topic/.test(step),
    `the artifact name is built from the topic, and an artifact listing is readable by an anonymous caller on a public repository:\n${step}`);
  assert.ok(/CLIENT_REF/.test(step) && /GITHUB_RUN_ID/.test(step),
    `the artifact name should come from the client reference, falling back to the run id:\n${step}`);
});

test('the step summary reports hosts and counts, never URLs', () => {
  const summary = body.slice(body.indexOf('sanitized summary'));
  assert.ok(summary.includes('hostname'), 'the summary should reduce each URL to its hostname');
  assert.ok(!/r\.url\s*\}/.test(summary) && !summary.includes('${r.url}'),
    'the summary prints a whole URL; a path or query string discloses what was being researched');
});

test('the caller reference is declared PUBLIC where a dispatcher will read it', () => {
  // Everything this workflow does to keep the topic out of the run and artifact names is
  // undone by a caller who puts the subject in the reference - `layoff-plan-q3` fits the
  // permitted shape perfectly. No regex can judge that, so the defence is that nobody can
  // say they were not told, in the place they are actually looking: the dispatch form.
  const input = body.slice(body.indexOf('client_ref:'));
  const description = (input.match(/^\s*description:.*$/m) ?? [''])[0];
  assert.ok(/PUBLIC/.test(description),
    `the client_ref input does not warn that it becomes the public run and artifact name: ${description.trim()}`);

  assert.ok(/::warning::client_ref/.test(body),
    'the run should also warn on the run itself, where the reference was actually used');
});

test('the anonymous disclosure table never appears without the signed-in caveat', () => {
  // The rule ADR-0035's amendment exists to enforce: state the SCOPE of a measurement in
  // the same breath as its result.
  //
  // The anonymous table is true and was honestly obtained - 403 on logs, 401 on artifacts,
  // the topic in none of the readable responses. Printed alone it still misleads, because a
  // list of refusals reads as "the subject is private" and it is not: Actions echoes a
  // step's `env:` block into the job log, every dispatch input arrives through `env:`, and
  // on a public repository anyone with an account can read that log.
  //
  // Neither half is deleted. A correction that erases what it corrected teaches nobody, and
  // this pins that the two travel together wherever the table is repeated.
  const sources = [
    ['collect.yml', yaml ?? ''],
    ['research-kit/README.md', fs.readFileSync(path.join(KIT_ROOT, 'README.md'), 'utf8')],
  ];
  for (const [name, text] of sources) {
    if (!/job \*?\*?logs?\*?\*?[^\n]*403/i.test(text)) continue;
    assert.ok(/signed[- ]in/i.test(text),
      `${name} prints the anonymous refusal table without saying what a signed-in reader sees`);
    assert.ok(/env:/.test(text) && /\blog\b/i.test(text),
      `${name} does not name the mechanism - the job log echoing a step's env: block`);

    // And it must not still call the same thing unknown somewhere else in the file.
    //
    // The first version of this guard asked only whether the caveat appeared ANYWHERE, and
    // it passed a file that carried both: the correction near the top, and thirty lines
    // below it the original "treat that as unknown rather than safe", untouched and reading
    // as current. A reader reaching the second sentence would have believed it.
    //
    // A stale sentence surviving beside its own correction is the defect ADR-0035 names,
    // committed in the act of recording it.
    //
    // The second version was worse: it was VACUOUS. It tried to match "signed-in user" and
    // "unknown rather than safe" in one line-anchored expression, and those sit on separate
    // lines, so `[^\n]*` could never bridge them and nothing could ever fail it. Found by
    // running the red check, which is the only reason this comment is not describing a
    // guard that silently guards nothing.
    //
    // Quoting the superseded claim is allowed and is the house style; asserting it is not.
    // So the phrase may appear only on a line that also marks it as past.
    const stale = text.split('\n').filter((line) => /unknown rather than safe/i.test(line)
      && !/used to|no longer|superseded|this used to say/i.test(line));
    assert.deepEqual(stale, [],
      `${name} still asserts the signed-in surface is unknown, in the same file that measures it:\n  `
      + stale.map((l) => l.trim()).join('\n  '));
  }
});

// ---------------------------------------------------------------- correlation

test('the dispatch API version is pinned, and the documented one', () => {
  assert.ok(body.includes('2026-03-10'),
    'the artifact must record the API version its run id came from - a run id without one '
    + 'is a number whose provenance nobody can reconstruct');
  assert.ok(/--api-version/.test(body), 'the packager should be told the API version explicitly');
});

test('the run id written into the manifest is this run', () => {
  assert.ok(/--run-id/.test(body) && /GITHUB_RUN_ID/.test(body),
    'the manifest must carry github.run_id, which is the same number the pinned dispatch returned to the caller');
});

test('client_ref is optional and validated without rewriting', () => {
  assert.ok(/client_ref:/.test(body), 'the input should exist as optional insurance');
  assert.ok(/required:\s*false/.test(body), 'client_ref must not be required - correlation does not need it');
  assert.ok(/A-Za-z0-9\]\[A-Za-z0-9\._-\]\{0,63\}/.test(body.replace(/\\/g, '')),
    'client_ref should be validated against the same shape the producer enforces');
  assert.ok(/Refused rather than rewritten/i.test(yaml),
    'a sanitised token means the caller polls for a reference the artifact does not carry');
});

// ---------------------------------------------------------------- the artifact

test('the package is produced by the kit, and the workflow cannot assert authorization', () => {
  assert.ok(/bin\/artifact\.mjs["'`\s,]/.test(body) && body.includes('"create"'),
    'the workflow should package with artifact.mjs rather than zipping by hand');
  assert.ok(!/build-authorized|--authorize|--approved/.test(body),
    'the workflow attempts to supply authorization; it is DERIVED by the kit from the corpus (ADR-0032)');
});

test('the package is validated before it is uploaded', () => {
  const validated = lineOf(body, /artifact\.mjs["'`\s,].*validate|"validate"/);
  const uploaded = lineOf(body, /upload-artifact@/);
  assert.ok(validated !== -1, 'nothing validates the package');
  assert.ok(uploaded !== -1, 'nothing uploads the package');
  assert.ok(validated < uploaded, 'the package must be validated before it is handed to anyone');
});

test('the upload fails rather than succeeding with nothing', () => {
  assert.ok(/if-no-files-found:\s*error/.test(body),
    'a green run that uploaded no artifact is the worst possible outcome: it looks like success');
});

test('integrity is required, research sufficiency is not', () => {
  // Same defect the live workflow had, found by running it: `preflight` answers "is the
  // research sufficient to build", and a freshly collected project has no closed unknowns,
  // so it fails `discovery-contract/no-unknowns` however perfectly collection worked.
  const wholeVerdict = body.split('\n').filter((l) => /preflight\.mjs/.test(l) && !/--check/.test(l));
  assert.deepEqual(wholeVerdict, [],
    'the workflow requires the whole preflight verdict from a freshly collected project, '
    + `which can never satisfy it:\n  ${wholeVerdict.join('\n  ')}`);
  for (const check of ['provenance', 'corpus-shape', 'citations', 'transport-provenance', 'hygiene']) {
    assert.ok(body.includes(check), `the integrity predicate no longer names ${check}`);
  }
});

test('no workflow spells the vendor package name itself', () => {
  // The defect this file exists to prevent the next of. Both workflows installed
  // `firecrawl@<version>` for weeks and nobody noticed, because the install had never
  // run. Two different packages are in play:
  //
  //   firecrawl-cli  1.23.3  bin: { firecrawl }  the CLI the adapter drives
  //   firecrawl      4.41.0  no bin at all       the JavaScript SDK
  //
  // The pinned spelling failed loudly with ETARGET. `firecrawl@latest` RESOLVES, to the
  // SDK, so surveillance mode would have reported a clean install and then failed with no
  // binary to run - which reads as a compatibility problem rather than the wrong package.
  //
  // ADR-0005 puts vendor knowledge in the adapter. A workflow spelling the package is a
  // second place for it to be wrong, which is precisely what happened.
  const offenders = [];
  for (const name of fs.readdirSync(WORKFLOWS)) {
    if (!name.endsWith('.yml') && !name.endsWith('.yaml')) continue;
    const text = executable(fs.readFileSync(path.join(WORKFLOWS, name), 'utf8'));
    text.split('\n').forEach((line, i) => {
      if (!/npm (install|i) .*-g/.test(line)) return;
      if (/\$\{?spec\}?/.test(line)) return;               // resolved from the adapter
      offenders.push(`${name}:${i + 1}  ${line.trim()}`);
    });
  }
  assert.deepEqual(offenders, [],
    `a workflow names the package to install instead of asking lib/firecrawl.mjs:\n  ${offenders.join('\n  ')}`);
});

test('the adapter names the package that actually ships the binary', async () => {
  const { CLI_PACKAGE, cliInstallSpec, TESTED_CLI_VERSION } = await import('../lib/firecrawl.mjs');
  assert.equal(CLI_PACKAGE, 'firecrawl-cli',
    'the npm package called `firecrawl` is the SDK and ships no binary; the CLI is `firecrawl-cli`');
  assert.equal(cliInstallSpec(), `firecrawl-cli@${TESTED_CLI_VERSION}`);
  assert.equal(cliInstallSpec('latest'), 'firecrawl-cli@latest',
    'surveillance mode must survey the CLI, not a different package that happens to resolve');
});

// ---------------------------------------------------------------- cost and blast radius

test('ordinary CI never triggers a paid collection', () => {
  const triggers = body.slice(body.indexOf('\non:'), body.indexOf('\nrun-name:'));
  for (const forbidden of ['push:', 'pull_request:', 'schedule:', 'issue_comment:']) {
    assert.ok(!triggers.includes(forbidden),
      `collect.yml triggers on ${forbidden} - every one of those fires without a person deciding to spend`);
  }
  assert.ok(triggers.includes('workflow_dispatch:'), 'the collector must be manual');
});

test('an unbounded run is refused', () => {
  assert.ok(/max_pages/.test(body), 'there is no page bound');
  assert.ok(/-lt 1 \]\s*\|\|\s*\[ "\$MAX_PAGES" -gt \d+/.test(body),
    'max_pages is not bounded at both ends; a dispatch could ask for an arbitrary spend');
});

test('a paid run is never cancelled mid-flight', () => {
  assert.ok(/cancel-in-progress:\s*false/.test(body),
    'cancelling a paid collection wastes the credits already spent and can tear a scratch ledger');
});

test('concurrency is per caller, not global', () => {
  const group = (body.match(/^\s*group:.*$/m) ?? [''])[0];
  assert.ok(/client_ref|run_id/.test(group),
    `two callers researching different things should not queue behind each other: ${group.trim()}`);
});

test('collection writes to a scratch project and the repository is checked afterwards', () => {
  assert.ok(/RUNNER_TEMP/.test(body), 'collection must happen outside the checkout');
  assert.ok(/git status --porcelain/.test(body), 'nothing verifies the repository was left alone');
});

// ---------------------------------------------------------------- platform and supply chain

test('the collector runs on both supported platforms', () => {
  assert.ok(/windows-latest/.test(body) && /ubuntu-latest/.test(body),
    'the support policy is Linux and Windows; the collector must offer both');
  assert.ok(/shell:\s*bash/.test(body),
    'one script for both runners needs bash pinned - windows-latest defaults to PowerShell');
});

test('every third-party action is pinned to a commit SHA', () => {
  const uses = body.split('\n').map((l) => l.trim()).filter((l) => l.startsWith('- uses:') || l.startsWith('uses:'));
  assert.ok(uses.length >= 3, `expected the checkout, setup-node and upload actions, found ${uses.length}`);
  for (const line of uses) {
    assert.ok(/@[0-9a-f]{40}\b/.test(line),
      `a tag is mutable, and whoever can move it runs code in this workflow: ${line}`);
  }
});

test('a credential reachable WITHOUT the environment fails the run', () => {
  // The property that makes "never fall back to repository secrets" enforceable rather
  // than aspirational. A job with no `environment:` can see only repository and
  // organization secrets, so if the key resolves there, it is not behind the approval
  // gate - and the question GitHub refuses to answer directly is answered by asking from
  // a context that can only see one scope.
  assert.ok(canaryJob().includes('scope-check'), 'there is no job proving the credential is scoped');
  assert.ok(!/environment:/.test(canaryJob()),
    'the scope canary declares an environment, which defeats it entirely - it must be able to see ONLY the unscoped secrets');
  assert.ok(/secrets\.FIRECRAWL_API_KEY/.test(canaryJob()), 'the canary does not read the credential it is checking');
  assert.ok(/exit 1/.test(canaryJob()), 'the canary reports but does not fail the run');
});

test('the canary runs before anything is approved or spent', () => {
  assert.ok(/needs:\s*scope-check/.test(body),
    'collection does not depend on the scope check, so a misplaced credential would cost a reviewer\'s time and then credits');
});

test('the canary never prints the credential, only whether it resolved', () => {
  assert.ok(!/echo[^\n]*\$\{?UNSCOPED_KEY/.test(canaryJob()), 'the canary echoes the credential');
  assert.ok(/-n "\$\{UNSCOPED_KEY:-\}"/.test(canaryJob()), 'the canary should test presence, not value');
});

test('the limit that genuinely remains is still stated honestly', () => {
  // Repository versus organization is undecidable from inside a job, and it does not
  // matter: neither is behind the approval gate. Saying so is the difference between a
  // documented boundary and an overstated guarantee.
  assert.ok(/undecidable is repository versus organization/i.test(yaml),
    'the workflow should say which distinction it still cannot make, and why that one does not matter');
});
