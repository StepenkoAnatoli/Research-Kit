#!/usr/bin/env node
// bin/install-hooks.mjs - install, repair, or remove the two gates; declare the role.

import { parseFlags } from '../lib/core.mjs';
import { installCommitGate, installEditGate, uninstall, settingsState, retiredRepairNote } from '../lib/installer.mjs';
import { saveConfig, loadConfig, machineRole, ROLES, EDIT_GATE_MODES, posture } from '../lib/machine.mjs';

const { flags } = parseFlags(process.argv.slice(2));

if (flags.help) {
  process.stdout.write(`install-hooks - the commit gate, the edit-time gate, and this machine's role.

  node research-kit/bin/install-hooks.mjs [options]

  --dry-run            show what would change; write nothing
  --git-only           install the commit gate alone
  --edit-only          install the edit-time gate alone
  --mode <m>           edit-time gate mode: ${EDIT_GATE_MODES.join(' | ')}
  --role <r>           declare this machine: ${ROLES.join(' | ')}
  --fail-closed        invert the fail-open default, deliberately
  --fail-open          restore the default
  --uninstall          restore the machine to its pre-install state

The role is machine state, not project state: the same clone keeps one shape on both
boxes. A builder must not collect, and its collection CLIs refuse before any adapter.
`);
  process.exit(0);
}

if (flags.role !== undefined) {
  const role = String(flags.role);
  if (!ROLES.includes(role)) {
    process.stderr.write(`unknown role "${role}". Known roles: ${ROLES.join(', ')}\n`);
    process.exit(2);
  }
  saveConfig({ role });
  process.stdout.write(`role: ${role}${role === 'builder' ? ' - this machine will refuse to collect' : ' - this machine may collect'}\n`);
}

if (flags['fail-closed']) { saveConfig({ failOpen: false }); process.stdout.write('posture: fail-closed\n'); }
if (flags['fail-open']) { saveConfig({ failOpen: true }); process.stdout.write('posture: fail-open\n'); }

if (flags.uninstall) {
  const result = uninstall();
  process.stdout.write(`commit gate: restored core.hooksPath to ${result.commit.restored ?? '(unset)'}\n`);
  process.stdout.write(`edit gate: removed ${result.edit.removed ?? 0} registration(s)${result.edit.ok ? '' : ` - ${result.edit.reason}`}\n`);
  process.exit(result.edit.ok ? 0 : 1);
}

const dryRun = Boolean(flags['dry-run']);
const wantCommit = !flags['edit-only'];
const wantEdit = !flags['git-only'];
let failed = false;

if (wantCommit) {
  const result = installCommitGate({ dryRun });
  if (result.dryRun) process.stdout.write(`would set core.hooksPath=${result.would} (was ${result.previous ?? 'unset'})\n`);
  else if (!result.ok) { process.stderr.write(`commit gate: ${result.reason}\n`); failed = true; }
  else process.stdout.write(`commit gate: core.hooksPath=${result.hooksPath} (was ${result.previous ?? 'unset'})\n`);
}

if (wantEdit) {
  const before = settingsState();
  const result = installEditGate({ dryRun, mode: typeof flags.mode === 'string' ? flags.mode : '' });
  if (result.dryRun) {
    process.stdout.write(`would register in ${result.file}: ${result.would}\n`);
    if (result.removed?.length) process.stdout.write(`  ${retiredRepairNote(result.removed)}\n`);
  } else if (!result.ok) {
    process.stderr.write(`edit gate: ${result.reason}\n`);
    failed = true;
  } else {
    process.stdout.write(`edit gate: registered in ${result.file}${before === 'retired' ? ' (repaired)' : ''}\n`);
    if (result.note) process.stdout.write(`  ${result.note}\n`);
    if (result.repairedSettings) process.stdout.write('  repaired one known corruption in the settings file; a backup was written beside it\n');
  }
}

const config = loadConfig();
const state = posture();
process.stdout.write(`
role            ${machineRole()}
posture         ${state.failOpen ? 'fail-open' : 'fail-closed'} (config ${state.configState})
edit gate mode  ${config.editGate.mode}
evidencePolicy  ${config.evidencePolicy}
`);
process.exit(failed ? 1 : 0);
