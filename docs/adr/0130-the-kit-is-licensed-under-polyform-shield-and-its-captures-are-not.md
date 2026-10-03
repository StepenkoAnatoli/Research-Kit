# ADR-0130: The kit is licensed under PolyForm Shield 1.0.0; its captured pages are not

Date: 2026-10-02
Status: accepted
Evidence: `docs/decisions/2026-10-02-licence-and-captured-pages/` (U-01..U-07)

## Context

LICENSE said all rights reserved and no licence granted, while the README's first
instruction was to clone the kit and install it machine-wide, and the whole design is
agents running it. An outside review (2026-10-02) named the contradiction and asked a
second question: a kit whose thesis is checking what licences permit republishes some 270
cached third-party pages under `research/raw/` directories.

The decision project established, from the owners of the facts: GitHub's terms grant a
visitor of a public repository viewing and forking and nothing else, and with no licence
the default is exclusive copyright (U-01); MIT and Apache-2.0 permit resale, Apache-2.0
with a patent grant (U-02); PolyForm Shield permits every purpose except a competing
product, PolyForm Noncommercial only noncommercial use, Business Source only until a change
date with a licensor-written grant, Elastic 2.0 everything but a managed service (U-03);
GitHub Docs, the npm docs and Google developer docs are CC BY 4.0, nodejs.org MIT,
Wikipedia CC BY-SA 4.0, arXiv per paper (U-04); fair use is a four-factor defence decided
case by case and the 2024 whole-copy archiving precedent went against the archive (U-05);
the Internet Archive and Common Crawl distribute whole pages while granting nothing over
them and placing the duty on the user (U-06); GitHub detects one licence from a plain
LICENSE file and REUSE marks paths individually (U-07).

## Decision

- **The code, tests and documentation are licensed under the PolyForm Shield License
  1.0.0**, the licence text in `LICENSE` with the required notice line. Anyone, person or
  agent, may install, run, modify and distribute the kit for any purpose, commercial use
  included, except providing a product that competes with it. The owner chose it over
  Apache-2.0 on 2026-10-02 because "use it, do not resell it as a competitor" is the
  stated wish, and accepted its cost: it is not an OSI-approved open-source licence.
- **The captured pages are excluded from that grant.** `NOTICE` says what they are, that
  copyright stays with their owners, that no licence is granted over them by this
  repository, which hosts' own licences permit redistribution with attribution, and that
  no fair-use claim is made. `REUSE.toml` marks every `research/raw/` path with
  `LicenseRef-Captured-Page`, whose text is in `LICENSES/`. `LICENSE` keeps a short
  preamble pointing there, because a reader of LICENSE alone must not conclude the
  captures are Shield-licensed.
- Nothing under `docs/decisions/` is removed or rewritten; the corpora stay as evidence.

## Rejected

- **Apache-2.0** (U-02): maximal adoption and a patent grant, but it permits resale, which
  the owner does not want. It remains the alternative if that wish changes; the switch is
  one ADR and one file.
- **MIT**: as Apache-2.0 without the patent grant.
- **PolyForm Noncommercial** (U-03): an agent researching a company's project is
  commercial use; the kit would be unusable for its purpose.
- **Business Source 1.1 and Elastic 2.0** (U-03): machinery for a product company - a
  change date, a licensor-written use grant, a managed-service restriction - none of
  which is the restriction wanted.
- **Keeping all rights reserved and deleting the install instructions**: contradicts what
  the kit is for.
- **Removing the captures from the repository, or claiming fair use for them** (U-05,
  U-06): the captures are the evidence; the archives' practice - distribute for research,
  grant nothing, say so - is what this repository can honestly do.
- **A licence notice in every capture's front matter**: a format change under the freeze
  (ADR-0117), and REUSE.toml says the same thing once for every path.
