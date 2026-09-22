# MAP - topic decomposition

## Topic

Node.js fs.writeFileSync wx flag O_EXCL exclusive create concurrent EEXIST

## Subtopics

Statuses are blank on purpose: phase 0 gathers material, it does not judge. Mark each
row COVERED (cite the U-## rows that cover it), DISMISSED (reason required - dismissing
is fine, omitting is not), or GAP, and add topic-specific subtopics where the checklist
is not enough.

| ID | Subtopic | Why it matters | Status | Covered by |
|---|---|---|---|---|
| D-1 | Access model | Public pages, an official API, an auth-walled app, or a paywall - each is a different collection design | COVERED | U-1. Public vendor documentation, no auth |
| D-2 | Auth and credentials | What accounts, keys, or logins the collection and the product need, and who holds them | DISMISSED | a filesystem call needs no credential |
| D-3 | Rate limits and quotas | Caps every cadence in the design, and caps the research collection itself | DISMISSED | no quota governs open(2) |
| D-4 | ToS, licensing, legality of the intended use | A prohibition on automated collection, storage, or display ends the design for that source - and sometimes the project | DISMISSED | Node is MIT-licensed; using a documented flag engages no term |
| D-5 | Data schema and its stability | How the data is shaped, and how often the source changes the shape without asking | COVERED | U-1. The flag set IS the schema, and it is stable across the two vintages compared here |
| D-6 | Freshness and staleness | How fast the data goes stale, and what staleness costs the product that depends on it | COVERED | U-2, and freshness is the finding: the mirror is an older vintage of the same page, differing in wording rather than substance |
| D-7 | Cost at expected volume | The economics at real usage, not the pricing page's first row - this decides viability | DISMISSED | no per-use cost |
| D-8 | Runtime and platform limits | Where this actually executes - OS, runtime version, desktop app, cloud - and what those limits forbid | COVERED | U-2, load-bearing: the guarantee is platform- and filesystem-conditional, which is exactly a runtime limit |
| D-9 | Output obtainability | Does the data your stated "done" depends on exist, and can you actually get it? Load-bearing: a project whose output cannot be produced should die in phase 1, not phase 2 | COVERED | U-1. Verified by execution, not only by reading - 24 racers, 1 winner, 23 EEXIST |
## Coverage notes (per dimension)

_One short paragraph per row once it has a status: what was established, and what the
status rests on._

## Candidate material

Gathered 2026-09-22.

Likely owners of these facts (by how often a search pointed at them):

- `node.readthedocs.io` (4)
- `docs.deno.com` (4)
- `nodejs.org` (2)
- `stackoverflow.com` (1)
- `github.com` (1)
- `memberstack.com` (1)

Candidate pages:

- [Creating a file only if it doesn't exist in Node.js - Stack Overflow](https://stackoverflow.com/questions/12899061/creating-a-file-only-if-it-doesnt-exist-in-node-js)
- [File system | Node.js v26.9.0 Documentation](https://nodejs.org/api/fs.html)
- [Error: EEXIST, file already exists on fs.openSync(fileName, "wx+") #4159](https://github.com/nodejs/node-v0.x-archive/issues/4159)
- [How to Write Files in Node.js: fs.writeFile, Streams, and More](https://www.memberstack.com/blog/write-files-in-node-js)
- [Using the writeFileSync method in Node.js - LogRocket Blog](https://blog.logrocket.com/using-writefilesync-node-js/)
- [Node js file system, Easier than we think(1). - DEV Community](https://dev.to/abdullahmubin/node-js-file-system-easier-than-you-think1-5ck7)
- [Can you use fs.existsSync to check if file exists before reading ... - Reddit](https://www.reddit.com/r/node/comments/relcj1/can_you_use_fsexistssync_to_check_if_file_exists/)
- [Fs - node - Read the Docs](https://node.readthedocs.io/en/latest/api/fs/)
- [Node.js File System Module - W3Schools](https://www.w3schools.com/nodejs/nodejs_filesystem.asp)
- [fs - Node documentation - Deno Docs](https://docs.deno.com/api/node/fs/)
- [Node.js File Writing Explained: Everything You Need to Know ...](https://blog.openreplay.com/node-js-file-writing-explained-fs-writefilesync/)
- [Fs - node - Read the Docs](https://node.readthedocs.io/en/stable/api/fs/)
- [Node.js fs.writeFileSync() Method - GeeksforGeeks](https://www.geeksforgeeks.org/node-js/node-js-fs-writefilesync-method/)


## Coverage notes

- **D-8 - COVERED and load-bearing.** The answer is not an unconditional yes. The flag is
  exclusive on a local filesystem and the documentation declines to promise it over a network
  one, which is a condition ADR-0020 does not carry.
- **D-9 - COVERED by execution.** 24 concurrent creators, one winner, twenty-three `EEXIST`,
  on win32 / Node v24.20.0. Run BEFORE collection, so the corpus could not shape it.

## Candidate material

The search offered 13 pages. Four were collected: one authoritative, one unofficial mirror
of it, one high-quality community thread, one decade-old upstream issue. The other nine were
SEO tutorials (w3schools, geeksforgeeks, logrocket, openreplay, dev.to, memberstack), a
reddit thread, and a second URL for the same readthedocs mirror.
