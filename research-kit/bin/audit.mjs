#!/usr/bin/env node
// bin/audit.mjs - render, list, resolve, and bundle audits.
//
// It PRINTS what lib/audit.mjs returns. It used to walk the raw index itself with a
// second sort, which made the reader below it dead code and the ordering unsettleable.

import { parseFlags, refuseUnknownFlags } from '../lib/core.mjs';
import { writeAudit, listVersions, resolveVersion, zipAudit } from '../lib/audit.mjs';
import { readText, resolve } from '../lib/core.mjs';
import { heading } from '../lib/render.mjs';

const { flags } = parseFlags(process.argv.slice(2));
refuseUnknownFlags(flags, ['force', 'help', 'list', 'show', 'topic', 'version', 'zip']);
const root = process.cwd();

if (flags.help) {
  process.stdout.write(`audit - the immutable, pasteable snapshot of one research pass.

  node research-kit/bin/audit.mjs [options]

  (no flags)            render a new version if the corpus changed
  --list                list the topics and versions the manifest holds
  --show <topic>        print one topic's latest audit
  --version <v>         with --show, print that version
  --zip [--topic <s>]   bundle a topic's latest audits into one .zip attachment
  --force               render even when unchanged

An audit renders only when the gate passes: a snapshot of an unproven corpus is a
snapshot of a claim nobody checked.
`);
  process.exit(0);
}

if (flags.zip) {
  // --zip refuses these rather than ignoring them: they promise a regenerate or a
  // question, and packaging does neither.
  for (const flag of ['force', 'list', 'show']) {
    if (flags[flag]) {
      process.stderr.write(`--zip cannot be combined with --${flag}: packaging neither regenerates nor asks\n`);
      process.exit(2);
    }
  }
  const result = zipAudit(root, { topic: typeof flags.topic === 'string' ? flags.topic : '' });
  if (!result.ok) {
    process.stderr.write(`${result.reason}\n`);
    if (result.known?.length) process.stderr.write(`known topics: ${result.known.join(', ')}\n`);
    if (result.fix) process.stderr.write(`${result.fix}\n`);
    process.exit(result.exit);
  }
  process.stdout.write(`${result.file}  (${result.count} file(s), ${result.bytes} bytes)\n`);
  process.exit(0);
}

if (flags.list) {
  const { topics } = listVersions(root);
  if (!topics.length) { process.stdout.write('no audits yet\n'); process.exit(0); }
  for (const topic of topics) {
    process.stdout.write(`${topic.slug}  latest v${topic.latest}  [${topic.versions.map((v) => `v${v}`).join(' ')}]  ${topic.topic}\n`);
  }
  process.exit(0);
}

if (typeof flags.show === 'string') {
  const { known } = listVersions(root);
  const slug = known.includes(flags.show) ? flags.show : known.find((k) => k.startsWith(flags.show));
  if (!slug) {
    process.stderr.write(`no audits for "${flags.show}". Known topics: ${known.join(', ') || '(none)'}\n`);
    process.exit(1);
  }
  const held = resolveVersion(root, slug, typeof flags.version === 'string' ? flags.version : null);
  if (!held) { process.stderr.write(`no such version for "${slug}"\n`); process.exit(1); }
  const text = readText(resolve(root, held.main));
  if (text === null) { process.stderr.write(`the manifest names ${held.main}, which is not on disk\n`); process.exit(1); }
  process.stdout.write(text);
  process.exit(0);
}

const result = writeAudit(root, { force: Boolean(flags.force) });
if (!result.written) {
  process.stdout.write(`${result.reason}\n`);
  process.exit(result.verdict && !result.verdict.pass ? 1 : 0);
}

process.stdout.write(`${heading(`audit v${result.version}`)}\n`);
process.stdout.write(`${result.main}\n`);
for (const file of result.subtopics) process.stdout.write(`${file}\n`);
process.stdout.write(`\nOne attachment instead of ${result.subtopics.length + 1} pastes:\n  node research-kit/bin/audit.mjs --zip\n`);
