# MAP - topic decomposition

## Topic

Internet Archive Wayback Machine as a witness for captured pages: the Wayback Availability API, Save Page Now requests and their limits, what a saved capture makes public, and the terms of use

## Subtopics

Statuses are blank on purpose: phase 0 gathers material, it does not judge. Mark each
row COVERED (cite the U-## rows that cover it), DISMISSED (reason required - dismissing
is fine, omitting is not), or GAP, and add topic-specific subtopics where the checklist
is not enough.

| ID | Subtopic | Why it matters | Status | Covered by |
|---|---|---|---|---|
| D-1 | Access model | Public pages, an official API, an auth-walled app, or a paywall - each is a different collection design | COVERED | U-01. A documented public JSON API, no account |
| D-2 | Auth and credentials | What accounts, keys, or logins the collection and the product need, and who holds them | DISMISSED | no credential: the Availability API takes none (E-01), and a lookup is anonymous |
| D-3 | Rate limits and quotas | Caps every cadence in the design, and caps the research collection itself | COVERED | U-05, a known unknown: no documented limit; one lookup per capture, never retried |
| D-4 | ToS, licensing, legality of the intended use | A prohibition on automated collection, storage, or display ends the design for that source - and sometimes the project | COVERED | U-04, a known unknown: the terms could not be read by the kit; the flag stays opt-in |
| D-5 | Data schema and its stability | How the data is shaped, and how often the source changes the shape without asking | COVERED | U-01. The response shape; the API page itself warns it changes |
| D-6 | Freshness and staleness | How fast the data goes stale, and what staleness costs the product that depends on it | COVERED | U-01. The witness is the snapshot closest to the capture time, and its timestamp is recorded |
| D-7 | Cost at expected volume | The economics at real usage, not the pricing page's first row - this decides viability | DISMISSED | the Availability API is free; no credits or meter |
| D-8 | Runtime and platform limits | Where this actually executes - OS, runtime version, desktop app, cloud - and what those limits forbid | DISMISSED | one HTTP GET per capture, through the kit's proxy-aware fetch; nothing platform-specific |
| D-9 | Output obtainability | Does the data your stated "done" depends on exist, and can you actually get it? Load-bearing: a project whose output cannot be produced should die in phase 1, not phase 2 | COVERED | U-01, U-02. Lookup is obtainable now; requesting a new save is not documented (U-02) |

## Coverage notes (per dimension)

_One short paragraph per row once it has a status: what was established, and what the
status rests on._

## Candidate material

Gathered 2026-09-30.

Likely owners of these facts (by how often a search pointed at them):

- `help.archive.org` (5)
- `facebook.com` (3)
- `nullhandle.org` (2)
- `archive.org` (2)
- `truescreen.io` (2)
- `doc-tools.readthedocs.io` (2)

Candidate pages:

- [Wayback Machine | TV and Radio Schedules Wikia - Fandom](https://tvradioschedules.fandom.com/wiki/Wayback_Machine)
- [ArchiveBox for OSINT: A Self-Hosted Wayback Machine Guide](https://blog.osintph.info/build-your-own-wayback-self-hosting-archivebox-for-osint-evidence-why-and-how-2/)
- [Echo Cloud – Make a Capture Available to the Public](https://blogs.vcu.edu/nursingeducation/2019/02/04/echo-cloud-make-a-capture-available-to-the-public/)
- [attestation and authentication for web archive evidence](https://nullhandle.org/pdf/2022-08-25_taking_the_witness_stand.pdf)
- [Wayback Machine APIs | Internet Archive](https://archive.org/help/wayback_api.php)
- [Save Pages in the Wayback Machine - Internet Archive Help Center](https://help.archive.org/help/save-pages-in-the-wayback-machine/)
- [Screen Recording Metadata: What's Saved Alongside Your Capture](https://defifreak.com/screen-recording-metadata-what-s-saved-alongside-your-capture)
- [Judge-Permitting, A Way(back) to Find Online Publication Dates](https://ucipclj.org/2025/05/21/judge-permitting-a-wayback-to-find-online-publication-dates/)
- ["Retrieve Cached Pages with Wayback Machine API](https://www.youtube.com/watch?v=XccGN0COOqE)
- [BORROW AND STREAMING INTERNET ARCHIVE](https://oye.odwire.org/textbook/YgHkY39AD286/BorrowAndStreamingInternetArchive)
- [A family had just moved into this home last week when a ...](https://www.facebook.com/snakeremoval/posts/a-family-had-just-moved-into-this-home-last-week-when-a-company-helping-remove-s/1400005828837147/)
- [Is the Wayback Machine Valid Evidence? Legal Limits](https://truescreen.io/articles/wayback-machine-evidence-legal-limits/)
- [Tools and APIs — Internet Archive Developer Portal](https://archive.org/developers/index-apis.html)
- [Wayback machine: reincarnation to vanished online citations](https://www.researchgate.net/publication/277552115_Wayback_machine_Reincarnation_to_vanished_online_citations)
- [Are your saved posts private? Who can actually see what you save](https://stashr.me/blog/are-your-saved-posts-private)
- [Internet Archive Access Policy](https://help.archive.org/help/internet-archive-access-policy/)
- [Internet Archives Wayback Machine](https://testportal2.mertech.com/uOB286abtxL6/Internet_Archives_Wayback-Machine)
- [Using the Wayback Machine - Internet Archive Help Center](https://help.archive.org/help/using-the-wayback-machine/)
- [“Public opinion is a major obstacle to underground CO2 ...](https://www.polytechnique-insights.com/en/columns/industry/public-opinion-is-a-major-obstacle-to-underground-co2-storage/)
- [Old websites seldom die: using the Wayback Machine in litigation](https://www.michbar.org/journal/Details/Old-websites-seldom-die-using-the-Wayback-Machine-in-litigation?ArticleID=4698)

## Outlines seen in the material

_No outlines - none of these pages is captured yet. `--max-scrapes <n>` captures the first n; their headings appear here._

