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

test('the honest limit of the environment check is written down, not implied', () => {
  // The one claim this workflow cannot make is that a repository-level secret did not
  // serve the request: GitHub exposes no scope information to a job. Saying so in the file
  // is the difference between a documented boundary and an overstated guarantee.
  assert.ok(/does not tell a workflow which/i.test(yaml) || /HONEST LIMIT/i.test(yaml),
    'the workflow should state that it cannot prove which scope a secret came from, rather than implying it can');
});
