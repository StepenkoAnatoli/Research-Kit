# ADR-0046 — CI tests every supported Node line, and doctor names a Node that cannot use the proxy

- **Date:** 2026-09-27
- **Status:** accepted
- **Area:** CI, runtime support, diagnostics
- **Evidence:** [`docs/decisions/2026-09-27-node-support/research/BRIEF.md`](../decisions/2026-09-27-node-support/research/BRIEF.md)

## Context

The kit promised "Node 22+" and CI ran Node 22 alone. On 2026-09-27 Node supports three lines:
26 (Current), 24 (Active LTS) and 22 (Maintenance LTS) (E-01, E-05). Node's own advice is that
production should run Active LTS, which is 24. So an operator who follows that advice runs a line
nothing had tested.

The keyless transport's proxy support (dd7569d) relies on `NODE_USE_ENV_PROXY`, which exists
from 22.21.0 on the 22 line and from 24.0.0 on the 24 line (E-02, E-04). On an older 22.x the
flag does nothing. The fetch goes around the configured proxy, and the operator gets an error
that names no proxy. Measured: HTTP 403 on 22.20.0 in a container where 24.21.0 succeeds.

## Decision

1. **The offline suite runs on every supported line.** A `node-lines` job runs Node 24 and 26
   on Linux, beside the platform matrix's Node 22 on Linux and Windows. The aggregate `suite`
   check requires both. The README names the tested lines, and a test keeps that list and the
   workflow in step, in both directions.
2. **`doctor` warns when this machine's Node cannot use its configured proxy.** It warns (not
   fails) and names the version to move to (next commit).
3. **`doctor` warns on an odd-numbered line below 27** (23, 25). Up to Node 26 an odd line is
   never LTS and ends after six months (E-01). From 27 every line goes LTS, so the rule stops
   there (next commit).

## Rejected alternatives

- **Raise the floor to 22.21.** That refuses every older 22.x, including machines with no proxy
  that would never meet the problem. A warning names the problem where it exists.
- **Run Node 24 and 26 on Windows too.** The platform-specific checks (line endings, the `.cmd`
  argument guard, the executable bit) are about the OS, not the Node line. Linux catches a Node
  regression at a third of the cost.
- **Keep CI on 22 alone.** That is the state this ADR ends.

## Consequences

- Two more CI jobs per push, each about 30 seconds. On 2026-09-27 both pass 971 of 971,
  measured locally before the job existed, so this is a guard, not a fix.
- When Node's supported lines change, the matrix and the README move together, or a test fails.

## Trigger that would reopen this

Node 22 reaching end of life (2027-04-30): drop it and raise the floor to 24. Node 24 entering
Maintenance (2026-10-20) changes nothing, since it stays supported. Node 27 reaching Current
(2027-04, E-05): add it, and retire the odd-line rule, which no longer holds from 27.
