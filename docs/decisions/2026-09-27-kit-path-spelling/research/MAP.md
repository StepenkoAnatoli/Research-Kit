# MAP - topic decomposition

## Topic

PowerShell tilde expansion native commands HOME variable bash tilde expansion quoted cmd USERPROFILE

## Subtopics

Statuses are blank on purpose: phase 0 gathers material, it does not judge. Mark each
row COVERED (cite the U-## rows that cover it), DISMISSED (reason required - dismissing
is fine, omitting is not), or GAP, and add topic-specific subtopics where the checklist
is not enough.

| ID | Subtopic | Why it matters | Status | Covered by |
|---|---|---|---|---|
| D-1 | Access model | Public pages, an official API, an auth-walled app, or a paywall - each is a different collection design | COVERED | U-1, U-2, U-3, U-4. Public documentation: learn.microsoft.com for PowerShell and cmd, gnu.org for bash |
| D-2 | Auth and credentials | What accounts, keys, or logins the collection and the product need, and who holds them | DISMISSED | no account or key is involved: every source is public, and the change needs none |
| D-3 | Rate limits and quotas | Caps every cadence in the design, and caps the research collection itself | DISMISSED | a handful of public pages, fetched once |
| D-4 | ToS, licensing, legality of the intended use | A prohibition on automated collection, storage, or display ends the design for that source - and sometimes the project | DISMISSED | reading public documentation to decide our own build; the corpus keeps quotes with their source |
| D-5 | Data schema and its stability | How the data is shaped, and how often the source changes the shape without asking | COVERED | U-1, U-2, U-3, U-4. Each shell's expansion rules are the schema a command string must fit |
| D-6 | Freshness and staleness | How fast the data goes stale, and what staleness costs the product that depends on it | COVERED | U-1. PowerShell's tilde behaviour moved between versions, so the answer is dated |
| D-7 | Cost at expected volume | The economics at real usage, not the pricing page's first row - this decides viability | DISMISSED | no cost: template text and its tests |
| D-8 | Runtime and platform limits | Where this actually executes - OS, runtime version, desktop app, cloud - and what those limits forbid | COVERED | U-1, U-2, U-3, U-4. Which shell runs the command is this project's runtime question |
| D-9 | Output obtainability | Does the data your stated "done" depends on exist, and can you actually get it? Load-bearing: a project whose output cannot be produced should die in phase 1, not phase 2 | COVERED | U-1, U-2, U-3, U-4. Each shell documents its own expansion; what no document settles is measured and recorded in the brief |

## Coverage notes (per dimension)

_One short paragraph per row once it has a status: what was established, and what the
status rests on._

## Candidate material

Gathered 2026-09-27.

Likely owners of these facts (by how often a search pointed at them):

- `docs.yellowbrick.com` (4)
- `docs.redhat.com` (4)
- `facebook.com` (2)
- `scribd.com` (1)
- `devcrea.com` (1)
- `onepagecode.substack.com` (1)

Candidate pages:

- [Mastering Windows and Linux Basics | PDF](https://www.scribd.com/document/724183054/Operating-Systems-and-You-Becoming-a-Power-User)
- [How to Change Directory in PowerShell: cd, Set-Location & More](https://www.devcrea.com/change-directory-powershell)
- [OpenClaw CLI Commands: The Complete Operator ...](https://onepagecode.substack.com/p/openclaw-cli-commands-the-complete)
- [Git for Windows v2.19.1 Release Notes](https://mdecadp2018.github.io/site-40623130/downloads/Github-2-19-1.html)
- [RubyGems - ukiryu - Versions diffs - 0.1.1 → 0.1.4 - Mend - Supply ...](https://my.diffend.io/gems/ukiryu/0.1.1/0.1.4/page/6)
- [User's Guide](https://documentation.softwareag.com/nop/5.5.3/en/webhelp/nop-webhelp/pdf/ug.pdf)
- [feature/native-comp b064ddd 4/4: Merge remote-tracking ...](https://lists.gnu.org/archive/html/emacs-diffs/2021-04/msg00277.html)
- [Yellowbrick Data Warehouse Version 6.6.0](https://docs.yellowbrick.com/6.6.0/pdf/ybd-product-documentation-6.6.0.pdf)
- [Installation Guide | Red Hat Container Development Kit | 2.0](https://docs.redhat.com/en/documentation/red_hat_container_development_kit/2.0/epub/installation_guide/)
- [SzShell/README.md at main](https://github.com/Szymdows/SzShell/blob/main/README.md)
- [PowerShell Windows Diagnostics Toolkit for Faster System ...](https://www.facebook.com/groups/797077440420513/posts/27510287455339482/)
- [rtk-skill - herramientas en línea](https://tool.lu/index.php/es_ES/skill/s/oI8)
- [Native Deodorant | Clean. Simple. Effective.](https://www.nativecos.com/?srsltid=AU7gw4VeX9VVGxjghFKcp2hJjT6ER5kCU8pdh8Poai4oc3RgRGY1MMgD)
- [Native Magazine](https://native.is/)
- [The Native Howl (@TheNativeHowl)](https://www.facebook.com/TheNativeHowl/)
- [Native Appropriations](https://www.allmyrelationspodcast.com/podcast/episode/46e6ef0d/native-appropriations)
- [Shoes, Boots & Sandals | Official Native Shoes™ Store](https://www.nativeshoes.com/?srsltid=AU7gw4XwYY_Cc63wGoVC7Fr2ITRjtQ7HlDlqjkN7bx1ICwMcvEdUZxYS)
- [NurtureNativeNature | Georgia Native Gardening](https://www.nurturenativenature.com/)
- [A Native American Views the Pledge of Allegiance](https://ksoralhistory.org/resource-educators/native-american-views-american-flag/)
- [Native Son by Richard Wright](https://www.goodreads.com/en/book/show/15622.Native_Son)

