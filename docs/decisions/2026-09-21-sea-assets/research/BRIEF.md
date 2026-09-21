# Brief - Can Research-Kit ship as a Windows .exe yet?

- **Date:** 2026-09-21
- **Gate:** PASS - 0 blocking, 2 warnings, 12 passing (`evidencePolicy=pluralist`).
  **Under `--strict` this corpus FAILS**, 2 blocking - that flag promotes every warning, and
  the two below are the two warnings. So does every other corpus in this repository; see
  "The `--strict` claim this brief got wrong" at the end.
- **Corpus:** 3 captures, 3 ledger entries, chain verifies
- **Collected by:** `collect.yml` run `35623502540`, dispatched through `bin/collect-remote.mjs`

## The answer

**Yes, and the deferral that said otherwise rested on a false premise.**

ADR-0031 deferred the local Windows `.exe` on this reasoning: *"What defers it is the part
the kit would actually need: reading its own bundled files through `useVfs`, added in
v26.9.0 and carrying a weaker 'Stability: 1.0 — Early development'."*

Two claims are packed into that sentence. The stability reading is correct. The word
**"need"** is not.

Node's single-executable feature has carried an `assets` configuration key and a
`sea.getAsset()` / `getAssetAsBlob()` / `getRawAsset()` / `getAssetKeys()` API since long
before the VFS existed - E-02, a v20.19.2 mirror of the same page, documents the assets API
in full and has no VFS section at all. Assets are bundled at build time and read back by key
inside the executable. `useVfs` does not add the capability; it adds a *convenience*, letting
existing `node:fs` calls keep working unchanged instead of being rewritten to `getAsset()`.

The stability picture follows from that. The page carries **Stability: 1.1 - Active
development** at its head, and the string `1.0 - Early development` appears **exactly once**
in the entire document - under the heading `Virtual file system (VFS) for assets`. The assets
API carries no separate marker, so it sits at the feature's 1.1. So the 1.0 the ADR cited is
real, but it attaches to the route the kit can decline to take.

**A kit willing to branch on `sea.isSea()` and call `getAsset()` reaches its templates,
recipes and schemas at Stability 1.1 throughout.** The documented trigger - "revisit when
that reaches 1.1" - was waiting on something the decision never needed.

## What this does and does not authorise

It does **not** authorise building the `.exe`. It removes the *stated technical* reason not
to, which leaves the question that was never technical: whether a Windows binary is still
wanted now that the agent path exists. The MCP server and `collect-remote.mjs` already reach
the collector without one, and the `.exe` was argued for a person who does not use a
terminal rather than for an agent. That is the single question carried to the human.

The cost is also now visible rather than assumed: taking the 1.1 route means the three
runtime reads in `lib/scaffold.mjs`, `lib/decompose.mjs` and `lib/artifact-validator.mjs`
need an asset-aware branch. That is real work, and it is a different objection from the one
ADR-0031 recorded.

## Two warnings accepted rather than cleared

U-1 and U-2 both rest on E-01 alone, and `corroboration` says so on every run. **They are
accepted deliberately, and the reason is the more interesting half of this cycle.**

A second source was collected. `lira.epac.to` serves the same Node.js document on an
unrelated host - and it documents **v20.19.2**, six major versions behind the v26.9.0 on
nodejs.org, predating the VFS section entirely. Citing it beside E-01 would have cleared both
warnings and reported `independent`: two hosts, apparently two witnesses.

They are one document, one of them stale. So the row is kept in `EVIDENCE.md`, graded S, and
**cited by no unknown**. Clearing a warning by citing a mirror would make the corpus read
stronger while making it weaker, which is the failure the check exists to prevent.

The remaining reason the warning is tolerable is narrower and worth stating rather than
implying: on *what the Node.js project says the stability of its own API is*, the vendor's
current documentation is not one source among several. Any second source can only report it.
A `single-source` warning is the correct standing description of this claim, not a defect to
be engineered away.

## What the third capture contributes

Nothing, and it is recorded anyway. `github.com/nodejs/single-executable/discussions/17`
renders its body by script, so the capture holds page furniture, a sponsor block, a star
count and the thread title - `Bundling of non-binary assets within the binaries` - and none
of the discussion. It is graded S and cited by no unknown.

It stays in the corpus because the fetch happened and the ledger records it. Deleting the row
would leave a hash-chain entry with no evidence row, and a corpus that quietly drops its
failures reports a better hit rate than it earned. **One in three captures returned nothing
usable** - and a one-query collection returning one authoritative page, one stale mirror and
one empty shell is a fair sample of why the three human review steps exist.

## Limits of this corpus

- **Three captures, one query, one collection.** Nothing here was searched for a second time.
- **`completeness: full` on E-03 is honest about bytes and silent about meaning.** The fetch
  returned a whole page; the page contained no content. The grade measures transport, and
  nothing in the kit currently measures whether a capture said anything.
- **The build cost is estimated, not measured.** No prototype was built. The claim that three
  modules need an asset-aware branch comes from reading this repository, not from doing it.

## The `--strict` claim this brief got wrong

The first version of the line at the top said this corpus fails `--strict` *"because the
delivery-architecture corpus passes `--strict` and a reader would otherwise assume parity"*.

**That was false, and it was caught by sweeping for gaps rather than by any check.** Measured
the same day, on `main`:

| corpus | default policy | `--strict` |
|---|---|---|
| repository root | PASS, 7 warnings | **FAIL, 7 blocking** |
| `2026-09-21-delivery-architecture` | PASS, 8 warnings | **FAIL, 8 blocking** |
| `2026-09-21-agent-interface` | PASS, 5 warnings | **FAIL, 5 blocking** |
| `2026-09-21-public-run-visibility` | PASS, 4 warnings | **FAIL, 4 blocking** |
| `2026-09-21-sea-assets` | PASS, 2 warnings | **FAIL, 2 blocking** |

**Nothing in this repository passes `--strict`.** The delivery corpus did before ADR-0036
added `corroboration` to `POLICY_CHECKS`, and the sentence was written from that memory
instead of from a run - the exact failure mode this kit exists to prevent, committed inside a
brief arguing against it.

Two distinct things are also easy to conflate, and the verdict line invites it. `--strict` is
a CLI flag that promotes **every** warning. `evidencePolicy=strict` promotes only the three
`POLICY_CHECKS`. They are not the same setting, and the summary line prints the project's
*declared* policy either way - so a `--strict` run reads `FAIL ... [evidencePolicy=pluralist]`,
which looks like the pluralist policy failed it. It did not; the flag did. That is a reporting
weakness, recorded rather than fixed here.
