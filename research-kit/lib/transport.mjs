// transport.mjs - adapter selection (ADR-0005).
//
// The one reader of the operator's transport choice, in precedence order:
//   1. an explicit --transport
//   2. RESEARCH_KIT_TRANSPORT
//   3. the machine config's `transport` key
//   4. auto-detection: an authenticated or anonymous CLI wins, otherwise keyless
//
// It names no vendor beyond the two adapter keys.

import * as firecrawl from './firecrawl.mjs';
import * as httpKeyless from './http-transport.mjs';
import * as serpapi from './serpapi.mjs';
import { loadConfig } from './machine.mjs';

export const TRANSPORTS = Object.freeze({
  'firecrawl-cli': firecrawl,
  'http-keyless': httpKeyless,
});

export const TRANSPORT_NAMES = Object.freeze(Object.keys(TRANSPORTS));

/**
 * Providers that satisfy the SEARCH contract only (ADR-0027).
 *
 * Deliberately a SECOND map rather than a third entry in `TRANSPORTS`. That map is the
 * set of things which satisfy the whole adapter shape; a search-only module in it makes
 * the shape a claim the map no longer keeps, and `--transport serpapi` would hand an
 * operator a run that cannot fetch - discovered at the first scrape rather than at
 * selection.
 */
export const SEARCH_PROVIDERS = Object.freeze({
  ...TRANSPORTS,
  serpapi,
});

export const SEARCH_PROVIDER_NAMES = Object.freeze(Object.keys(SEARCH_PROVIDERS));

/**
 * The two contracts, declared the way `ADAPTER_SHAPE` already is, so a test can hold a
 * module to one without the other.
 */
export const FETCH_SHAPE = Object.freeze(['name', 'scrape', 'runScrape', 'map', 'status', 'command']);
export const SEARCH_SHAPE = Object.freeze(['name', 'search']);

/** Does this module expose a contract's functions? The shape tests ask this. */
export function satisfies(adapter, shape) {
  if (!adapter) return false;
  return shape.every((fn) => (fn === 'name' ? typeof adapter.name === 'string' : typeof adapter[fn] === 'function'));
}

/**
 * Is this module search-only?
 *
 * A DECLARATION, not a duck-type. `serpapi.mjs` exports `scrape` and `map` on purpose -
 * they throw a named refusal instead of letting a caller hit
 * `TypeError: adapter.scrape is not a function` three frames down (AR-3). That makes
 * "has a scrape function" useless as a capability test, and the first version of this
 * helper got it exactly wrong by asking that question.
 *
 * So: a module that declares `CONTRACTS` is taken at its word. The two that predate the
 * split declare nothing and are duck-typed, which for them is still correct.
 */
export function isSearchOnly(adapter) {
  if (Array.isArray(adapter?.CONTRACTS)) {
    return adapter.CONTRACTS.includes('search') && !adapter.CONTRACTS.includes('fetch');
  }
  return satisfies(adapter, SEARCH_SHAPE) && !satisfies(adapter, FETCH_SHAPE);
}

/**
 * Is the CLI there, and does it answer? Injectable so doctor's tests need no CLI.
 *
 * Two costs were paid here that did not need paying. `cliVersion()` spawned the CLI to
 * learn something a PATH lookup already knows, and every caller probed independently -
 * `doctor` asked once itself and then handed the same probe to `selectTransport`, which
 * asked again. Four spawns, measured at 19.5s on this machine, on a command that reports
 * health. Presence is now a filesystem question and the answer is memoised per process.
 */
let probeCache = null;

export function probeFirecrawl({ cliVersion = null, status = firecrawl.status, resolve = firecrawl.resolveProgramPath, cache = true } = {}) {
  if (cache && probeCache) return probeCache;

  const present = cliVersion ? cliVersion() : resolve();
  if (!present) {
    const absent = { installed: false, authenticated: false, version: null, credits: null };
    if (cache) probeCache = absent;
    return absent;
  }

  const state = status();
  const result = {
    installed: true,
    authenticated: Boolean(state.authenticated),
    // `--status` prints the version, so the separate `--version` spawn bought nothing.
    // When a caller injects `cliVersion` (the tests do), that answer wins.
    version: (cliVersion ? present : null) ?? state.version ?? null,
    credits: state.credits ?? null,
    creditLimit: state.creditLimit ?? null,
    concurrencyLimit: state.concurrencyLimit ?? null,
    path: cliVersion ? null : present,
  };
  if (cache) probeCache = result;
  return result;
}

/** Tests and long-lived processes need to be able to ask again. */
export function forgetProbe() {
  probeCache = null;
}

/**
 * `selectTransport({ explicit, env, probe })` -> `{ name, adapter, why, search }`.
 *
 * `name`, `adapter` and `why` mean exactly what they have always meant: the FETCH
 * provider, the one that produces captures. `search` is additive (ADR-0027, NFR-2) -
 * that is the whole reason six existing call sites did not have to change.
 *
 * An explicit name that is not an adapter is an error naming the ones that are.
 */
export function selectTransport({ explicit = '', env = process.env, probe = probeFirecrawl, config = null,
  explicitSearch = '' } = {}) {
  const settings = config ?? loadConfig(env);
  const fetchSide = selectFetch({ explicit, env, probe, config: settings });
  return {
    ...fetchSide,
    search: selectSearch({ explicit: explicitSearch, env, config: settings, fetchSide }),
  };
}

/**
 * The SEARCH side, resolved independently and by the same ladder: explicit flag,
 * environment, machine config, then auto-detect.
 *
 * Auto-detect has exactly one rule, and it is the conservative one (FR-5): a SerpAPI key
 * wins, otherwise the search side IS the fetch provider. With no key configured, nothing
 * about a run changes. An opt-in that alters the default is not an opt-in.
 */
export function selectSearch({ explicit = '', env = process.env, config = null, fetchSide = null,
  probe = probeFirecrawl } = {}) {
  const settings = config ?? loadConfig(env);
  const side = fetchSide ?? selectFetch({ env, probe, config: settings });
  const asked = explicit || env.RESEARCH_KIT_SEARCH_TRANSPORT || settings.searchTransport || '';

  if (asked) {
    const adapter = SEARCH_PROVIDERS[asked];
    if (!adapter) {
      const err = new Error(`unknown search provider "${asked}". Known search providers: ${SEARCH_PROVIDER_NAMES.join(', ')}`);
      err.code = 'UNKNOWN_SEARCH_PROVIDER';
      throw err;
    }
    const why = explicit
      ? '--search-transport'
      : (env.RESEARCH_KIT_SEARCH_TRANSPORT ? 'RESEARCH_KIT_SEARCH_TRANSPORT' : 'machine config');
    return { name: adapter.name ?? asked, adapter, why, searchOnly: isSearchOnly(adapter) };
  }

  if (serpapi.readKey({ env, config: settings })) {
    return {
      name: serpapi.name,
      adapter: serpapi,
      why: 'a SerpAPI key is configured - searching on its own meter, leaving the fetch budget for pages',
      searchOnly: true,
    };
  }

  return {
    name: side.name,
    adapter: side.adapter,
    why: 'no separate search provider configured - searching with the fetch provider, as before',
    searchOnly: false,
    sameAsFetch: true,
  };
}

/** The fetch side: what `selectTransport` has always returned. */
function selectFetch({ explicit = '', env = process.env, probe = probeFirecrawl, config = null } = {}) {
  const asked = explicit || env.RESEARCH_KIT_TRANSPORT || (config ?? loadConfig(env)).transport || '';
  if (asked) {
    const adapter = TRANSPORTS[asked];
    if (!adapter) {
      const err = new Error(`unknown transport "${asked}". Known transports: ${TRANSPORT_NAMES.join(', ')}`);
      err.code = 'UNKNOWN_TRANSPORT';
      throw err;
    }
    const why = explicit ? '--transport' : (env.RESEARCH_KIT_TRANSPORT ? 'RESEARCH_KIT_TRANSPORT' : 'machine config');
    return { name: asked, adapter, why };
  }

  const state = probe();
  if (state.installed) {
    // An ANONYMOUS CLI is not the metered transport, and must not be recorded as one.
    //
    // It scrapes - this machine proved it - but it is keyless access capped per IP
    // (E-01), so it is neither metered nor reliably reproducible. Stamping it
    // `firecrawl-cli` made those rows identical in the ledger to authenticated ones, and
    // `transport-provenance` treats that name as the good case: the one check whose job
    // is to say how a capture was fetched would have said "metered Firecrawl CLI" about a
    // fetch nobody paid for.
    const label = state.authenticated ? firecrawl.name : firecrawl.ANONYMOUS_NAME;
    return {
      name: label,
      adapter: labelled(firecrawl, label),
      why: state.authenticated ? 'the CLI is installed and authenticated' : 'the CLI is installed but NOT authenticated - anonymous, capped per IP',
      probe: state,
    };
  }
  return { name: httpKeyless.name, adapter: httpKeyless, why: 'no CLI on PATH - falling back to the keyless adapter', probe: state };
}

/**
 * Bind an adapter to the transport label that actually applies to this machine.
 *
 * The adapter stamps its own name because it is the thing that ran; the label narrows
 * that to the mode it ran in. Only the two functions that produce captures are bound -
 * search and map record nothing.
 */
function labelled(adapter, label) {
  if (label === adapter.name) return adapter;
  const stamp = (result) => (result && result.ok ? { ...result, transport: label } : result);
  return {
    ...adapter,
    name: label,
    scrape: (url, opts) => stamp(adapter.scrape(url, opts)),
    runScrape: (url, opts) => stamp(adapter.runScrape(url, opts)),
  };
}

export { firecrawl, httpKeyless, serpapi };
