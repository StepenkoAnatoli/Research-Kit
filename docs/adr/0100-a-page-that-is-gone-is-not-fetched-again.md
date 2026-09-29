# ADR-0100 — A page that answered 404 or 410 is not fetched again within the refresh window

- **Date:** 2026-09-29
- **Status:** accepted
- **Area:** `lib/collect.mjs` (`recentlyGone`), `lib/research-run.mjs` (the budget loop)

## Context

Since 2026-09-28, an error page is a failed fetch: an `op: 'fail'` ledger entry that names
the HTTP status, and no EVIDENCE row. The cache consulted only successful captures, so the
next run fetched the same URL again.

On MoonAliza's secret-masking corpus (2026-09-29):
- A plan URL guessed wrong (a GitLab source path) answered 404.
- It was fetched, and paid for, again ten minutes later, when another query was added to
  the plan.
- In a test of the same shape, the remembered 404 also took the only slot of a
  `maxScrapes: 1` run, and the real page behind it was skipped.

## Decision

- **Gone means 404 or 410:** a URL whose last ledger entry is a failure naming HTTP 404 or
  410, within `refreshDays`, is gone.
- **What happens to a gone URL:**
  - `collectOne` returns `status: 'gone'` with `spent: 0`, and a reason naming the status,
    the date and `--force`.
  - The research loop sets it aside before counting the budget, and logs it `gone`.
- **Transient failures are still retried:** a 5xx, a timeout, a rate limit, a transport
  error.
- **Retrying anyway:** `--force` retries, and so does waiting out the refresh window.

## Rejected alternatives

- **Retry everything, as before.** That pays for the same 404 on every run of a plan that
  still names it. Plans are edited and re-run, so this happens.
- **Remember every failure.** A 503 or a timeout says nothing about tomorrow. Remembering it
  would skip a page that is there.
- **Remove the URL from the plan automatically.** The plan is the operator's. The log line
  says what to do, and the map is not rewritten behind them.
