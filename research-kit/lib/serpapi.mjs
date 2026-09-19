// serpapi.mjs - a SEARCH-ONLY provider (ADR-0027).
//
// The first module in this kit that satisfies one contract rather than the whole adapter
// shape. It searches. It cannot fetch a page, says so by name when asked, and never
// produces a capture - so nothing here ever reaches the fetch ledger.
//
// Why it exists: search and fetch drew on one free allowance, so every search spent was
// a page not fetched (E-03, E-14). This is a second meter, not a cheaper one.
//
// Three vendor facts shape every decision below, each read off the captured API
// reference rather than assumed:
//   - `api_key` is Required and travels as a QUERY PARAMETER. That is the worst place a
//     secret can live, so it is never rendered, never logged, and scrubbed out of vendor
//     error text before anyone sees it.
//   - There is no documented result-count parameter. Only `start`, for pagination. We
//     send neither and slice locally - a response costs the same whatever it carries
//     ("responses with 100 results or empty result sets will both count as 1 search"),
//     so asking for fewer buys nothing. Three defects in this project have come from
//     assuming a vendor parameter; this is the cheap way not to add a fourth.
//   - `no_cache` defaults to false and a repeated identical query is served from
//     SerpAPI's own cache for an hour, free and uncounted. We never send it.
//
// Pure Node ESM, no dependencies. `fetch` is async and the adapter shape is synchronous,
// so this module re-execs ITSELF with a JSON job on stdin - the same child-process
// rendezvous `http-transport.mjs` uses. The key travels on that pipe rather than in argv
// or the environment, so it never appears in the process table.

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const name = 'serpapi';

/** The contracts this module satisfies. Asked for anything else, it refuses by name. */
export const CONTRACTS = Object.freeze(['search']);

export const ENDPOINT = 'https://serpapi.com/search';
export const KEY_ENV = 'SERPAPI_API_KEY';
export const CONFIG_KEY = 'serpapiKey';
export const DEFAULT_TIMEOUT = 30_000;

const SELF = fileURLToPath(import.meta.url);

// ---------------------------------------------------------------- the credential

/**
 * Where the key may come from, in precedence order: the environment, then the machine
 * config. Never this repository, never a plan, never a capture (SR-1).
 *
 * Returns '' rather than throwing. An absent key is the ordinary case - it is how the
 * kit knows to leave the search side on the fetch provider (FR-5).
 */
export function readKey({ env = process.env, config = null } = {}) {
  const fromEnv = typeof env[KEY_ENV] === 'string' ? env[KEY_ENV].trim() : '';
  if (fromEnv) return fromEnv;
  const fromConfig = config && typeof config[CONFIG_KEY] === 'string' ? config[CONFIG_KEY].trim() : '';
  return fromConfig;
}

/**
 * Remove a secret from text that is about to be shown to somebody.
 *
 * Vendors echo the request URL in error messages, and this vendor's request URL contains
 * the key. Scrubbing at the boundary is the only place that catches every path: the
 * terminal, the failure log, and an exception message nobody planned for.
 *
 * Short keys are refused rather than replaced - a two-character "key" would turn every
 * occurrence of those characters into noise, which hides more than it protects.
 */
export function redact(text, key) {
  const body = String(text ?? '');
  const secret = String(key ?? '');
  if (secret.length < 8) return body;
  return body.split(secret).join('***REDACTED***');
}

// ---------------------------------------------------------------- the rendezvous

export function runJob(job, { timeout = DEFAULT_TIMEOUT, spawn = spawnSync, nodePath = process.execPath } = {}) {
  const result = spawn(nodePath, [SELF], {
    input: JSON.stringify(job),
    encoding: 'utf8',
    timeout,
    windowsHide: true,
  });
  if (result.error) return { ok: false, error: result.error.message };
  const text = String(result.stdout ?? '').trim();
  if (!text) return { ok: false, error: String(result.stderr || 'serpapi transport produced no output').trim() };
  try {
    return JSON.parse(text);
  } catch (err) {
    return { ok: false, error: `serpapi transport emitted unparseable output: ${err.message}` };
  }
}

// ---------------------------------------------------------------- payload

/**
 * `organic_results[]` -> the kit's existing result shape.
 *
 * `link` and `snippet` are this vendor's names for what the kit calls `url` and
 * `description`; the rest already line up. Rows with no link are dropped rather than
 * carried as empty strings - a candidate the collector cannot fetch is not a candidate.
 */
export function normalizeSearch(payload) {
  const rows = Array.isArray(payload?.organic_results) ? payload.organic_results : [];
  return rows.map((row) => ({
    url: row.link ?? row.url ?? '',
    title: row.title ?? '',
    description: row.snippet ?? row.description ?? '',
    position: Number.isFinite(row.position) ? row.position : null,
  })).filter((row) => row.url);
}

/**
 * The vendor's own handle for a response.
 *
 * Recorded because it is the only way to reconcile this kit's count against SerpAPI's
 * meter. The payload carries no cost field - `search_metadata` is id, status,
 * json_endpoint and total_time_taken - so the count is ours to keep (DR-5, DR-6).
 */
export function searchId(payload) {
  const id = payload?.search_metadata?.id;
  return typeof id === 'string' && id ? id : null;
}

/**
 * What a call cost, by the vendor's stated rule rather than by inspecting the payload.
 *
 * One successful response is one search whatever it returns. The honest limit: a
 * response served from SerpAPI's free 1-hour cache costs nothing and is NOT
 * distinguishable from a fresh one in anything the payload carries, so this over-counts
 * on a repeat. Over-counting a free tier is the safe direction to be wrong in.
 */
export function searchesUsed(payload) {
  return payload && !payload.error ? 1 : 0;
}

/**
 * A display-only rendering. Nothing executes it, and it never carries the key.
 *
 * The shape deliberately mirrors what `command()` produces for the CLI adapters so the
 * ledger's `cmd` annotation and `--dry-run` output read the same whichever provider ran.
 */
export function command(query, key = '') {
  // Defence in depth for the case `search()` refuses outright: if the query itself holds
  // the credential, this string must still not carry it. `cmd` is written into the
  // hash-chained ledger, which is a COMMITTED file - it is the last place a secret may
  // reach, and the hardest to take back once it has.
  const shown = redact(String(query), key);
  return `GET ${ENDPOINT}?engine=google&q=${encodeURIComponent(shown)}&api_key=***REDACTED***`;
}

// ---------------------------------------------------------------- the contract

/**
 * `search(query, opts)` -> `{ ok, query, results[], error, cmd, provider, searchId }`.
 *
 * Every failure path returns rather than throws (IR-6). A search provider that can end a
 * run with an exception is worse than no search provider: the collector holds the corpus
 * lock while it works (ADR-0025).
 */
export function search(query, {
  limit = 8,
  env = process.env,
  config = null,
  key = null,
  timeout = DEFAULT_TIMEOUT,
  job = runJob,
} = {}) {
  const text = String(query);
  const apiKey = key ?? readKey({ env, config });
  const cmd = command(text, apiKey);

  if (!apiKey) {
    return { ok: false, query: text, results: [], cmd, provider: name, searchId: null,
      error: `no SerpAPI key: set ${KEY_ENV} or the machine config's ${CONFIG_KEY}` };
  }

  // A query that CONTAINS the credential is refused before it is transmitted.
  //
  // Found by the Phase C suite, which asked whether any field of any result could carry
  // the key and discovered that one could: `cmd` interpolates the query, and `cmd` is
  // written into the hash-chained ledger - a committed file.
  //
  // Redacting `cmd` alone would have been the small fix and the wrong one. Sending the
  // request is the worse half: the key would become a Google search term, stored on the
  // vendor's systems for 31 days (E-10) and carried through whatever logs sit between.
  // A key pasted into a query box is a mistake that has already happened; the useful
  // thing to do is stop it leaving the machine and say so.
  if (apiKey.length >= 8 && text.includes(apiKey)) {
    return {
      ok: false, query: '[query withheld: it contained your API key]', results: [], cmd,
      provider: name, searchId: null,
      error: 'refusing to search for a string that contains your SerpAPI key. '
        + 'Sending it would store your credential as a search term on the vendor\'s systems. '
        + 'Nothing was transmitted; check what was pasted into the query.',
    };
  }

  const answer = job({ kind: 'serpapi-search', query: text, apiKey, timeout }, { timeout });
  const scrub = (value) => redact(value, apiKey);

  if (!answer.ok) {
    return { ok: false, query: text, results: [], cmd, provider: name, searchId: null,
      error: scrub(answer.error || 'serpapi request failed') };
  }

  const payload = answer.payload;
  // Documented: "If a search has failed, `error` will contain an error message." This is
  // also how an exhausted monthly allowance arrives - a normal outcome, not a crash.
  if (payload && typeof payload.error === 'string' && payload.error) {
    return { ok: false, query: text, results: [], cmd, provider: name, searchId: searchId(payload),
      error: scrub(payload.error) };
  }

  const results = normalizeSearch(payload);
  return {
    ok: true,
    query: text,
    cmd,
    provider: name,
    searchId: searchId(payload),
    searchesUsed: searchesUsed(payload),
    // No result-count parameter is sent (IR-4); the cap is applied here.
    results: limit > 0 ? results.slice(0, limit) : results,
  };
}

/**
 * Credential presence, answered WITHOUT a network call.
 *
 * SerpAPI does publish an account endpoint, but it is not in the reference this project
 * captured, and this kit does not call undocumented endpoints. So this reports what it
 * can actually know - whether a key is configured and where it came from - and says
 * nothing about the remaining monthly allowance rather than guessing at it.
 */
export function status({ env = process.env, config = null } = {}) {
  const fromEnv = typeof env[KEY_ENV] === 'string' && env[KEY_ENV].trim() ? KEY_ENV : '';
  const fromConfig = config && typeof config[CONFIG_KEY] === 'string' && config[CONFIG_KEY].trim() ? `config.${CONFIG_KEY}` : '';
  const source = fromEnv || fromConfig || '';
  return {
    ok: true,
    transport: name,
    authenticated: Boolean(source),
    source,
    // Not knowable from any endpoint this project has read. Named rather than left null
    // with no explanation.
    searchesRemaining: null,
    raw: source
      ? `serpapi: key configured via ${source}; remaining monthly allowance is not reported by any captured endpoint`
      : `serpapi: no key (set ${KEY_ENV} or the machine config's ${CONFIG_KEY})`,
  };
}

/**
 * The refusal that makes AR-3 real.
 *
 * Asked to fetch, this module answers with the reason instead of a missing-function
 * TypeError. A `TypeError: adapter.scrape is not a function` three frames deep tells an
 * operator nothing about why; this tells them.
 */
function cannotFetch(op) {
  const err = new Error(
    `${name} is a search-only provider and cannot ${op}. It is selected for the SEARCH side only; `
    + `the fetch side stays on a provider that produces captures (see --transport).`);
  err.code = 'SEARCH_ONLY_PROVIDER';
  throw err;
}

export const scrape = () => cannotFetch('scrape');
export const runScrape = () => cannotFetch('scrape');
export const map = () => cannotFetch('map');

export default { name, search, status, command, CONTRACTS };

// ---------------------------------------------------------------- the child half

/**
 * When this file is the process entry point it IS the job runner: read one JSON job on
 * stdin, do the async work, print one JSON line.
 *
 * The URL - the only string in this system that contains the key - is built HERE, in the
 * child, and never returned. The parent holds the key but never a rendered request, so
 * no display path can leak one by accident.
 */
async function child() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  let job;
  try {
    job = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
  } catch (err) {
    process.stdout.write(JSON.stringify({ ok: false, error: `unparseable job: ${err.message}` }));
    return;
  }
  if (job.kind !== 'serpapi-search') {
    process.stdout.write(JSON.stringify({ ok: false, error: `unknown job kind "${job.kind}"` }));
    return;
  }

  const url = new URL(ENDPOINT);
  url.searchParams.set('engine', 'google');
  url.searchParams.set('q', String(job.query ?? ''));
  url.searchParams.set('api_key', String(job.apiKey ?? ''));
  // `no_cache` and `async` are deliberately not set: the defaults are what we want, and
  // the free 1-hour cache depends on the query and ALL parameters matching exactly.

  try {
    const response = await fetch(url, {
      redirect: 'follow',
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(job.timeout ?? DEFAULT_TIMEOUT),
    });
    const body = await response.text();
    let payload = null;
    try {
      payload = JSON.parse(body);
    } catch {
      process.stdout.write(JSON.stringify({
        ok: false,
        statusCode: response.status,
        error: `serpapi returned HTTP ${response.status} with a non-JSON body (${body.length} bytes)`,
      }));
      return;
    }
    // A non-200 carrying a documented `error` is handed up as a payload so the parent
    // reports the vendor's own words; a non-200 with no error key is an HTTP failure.
    if (!response.ok && !(payload && typeof payload.error === 'string')) {
      process.stdout.write(JSON.stringify({ ok: false, statusCode: response.status, error: `serpapi returned HTTP ${response.status}` }));
      return;
    }
    process.stdout.write(JSON.stringify({ ok: true, statusCode: response.status, payload }));
  } catch (err) {
    // `err.message` can contain the request URL, and the request URL contains the key.
    // The parent redacts on receipt; this keeps the child from being the one that leaks.
    process.stdout.write(JSON.stringify({ ok: false, error: String(err?.message ?? err) }));
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  await child();
}
