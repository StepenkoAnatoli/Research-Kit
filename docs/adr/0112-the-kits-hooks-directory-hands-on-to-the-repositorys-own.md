# ADR-0112 — The kit's hooks directory hands every hook on to the repository's own

- **Date:** 2026-10-01
- **Status:** accepted
- **Area:** `githooks/` (`pre-commit` and one pass-on file per git hook name)

## Context

The commit gate is installed as the machine-wide `core.hooksPath`, and git runs hooks from
one directory only. Every repository on the machine therefore stopped running its own
`.git/hooks`: its `pre-commit` and `commit-msg`, and Git LFS's `pre-push` hook, which uploads
the large files a push refers to. Nothing reported it. Confirmed 2026-10-01 (break-test PR
#182, and reproduced here: a repository's own `pre-commit`, `commit-msg` and `pre-push` did not
run, and a refusing `pre-commit` did not stop the commit).

## Decision

- **`githooks/` holds a file for every hook name git knows**: 28 names, read from the git 2.43
  binary. Each file except `pre-commit` is the same short sh script. It finds the repository's
  hooks directory with `git rev-parse --git-common-dir` and runs the hook of its own name there
  with the same arguments and stdin, when that hook exists and is executable. Otherwise it
  exits 0.
  - `--git-common-dir`, not `--git-path hooks`: with `core.hooksPath` set, the latter names the
    kit's directory, and a hook would call itself.
  - A repository whose hooks directory is the kit's own has nothing to hand on to, and stops.
- **`pre-commit` judges first, then hands on.** When the gate allows the commit, or fails open,
  the repository's own `pre-commit` runs, and its exit status decides. When the gate blocks,
  the repository's hook is not run.
- **The cost is measured:** about 19 ms per commit on this machine (85 -> 104 ms), from the
  shell git now starts for `reference-transaction`, `post-index-change` and the other
  per-commit names.

## Not covered, and why

- **A global hooks directory the kit replaced.** `install-hooks` records the previous
  `core.hooksPath` and `uninstall` restores it, but while the kit is installed, hooks there do
  not run. Reading the install state from sh needs a JSON reader the hook does not have.
  **Trigger:** a report of a machine-wide hooks directory the operator relies on.
- **A hook name added in a later git.** It has no file here, so a repository's own hook of that
  name does not run. **Trigger:** a git release that adds a hook name; the test pins the list.
- **A tool that writes its hooks into the kit's directory.** A tool that installs hooks wherever
  `core.hooksPath` points would write into the deployed kit, and the next `install` copies the
  kit's own files back over them. Not tested here (no Git LFS on this machine); hooks in a
  repository's own `.git/hooks` are what this ADR hands on to. **Trigger:** a report of a tool
  doing that.

## Rejected alternatives

- **Say it plainly in `install-hooks` and `doctor`, and change nothing.** That tells the
  operator their hooks are off. It does not turn them back on, and an LFS push still loses its
  upload.
- **Install per repository (`core.hooksPath` local, or a copy into each `.git/hooks`).** The
  machine-wide gate covers every repository, including ones created after install. A
  per-repository install misses exactly those.
- **Only the hooks known to matter (`pre-commit`, `commit-msg`, `pre-push`).** Which hooks a
  repository relies on is the repository's business, and a missing name fails silently. That
  silence is the defect.
