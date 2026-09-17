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
import { loadConfig } from './machine.mjs';

export const TRANSPORTS = Object.freeze({
  'firecrawl-cli': firecrawl,
  'http-keyless': httpKeyless,
});

export const TRANSPORT_NAMES = Object.freeze(Object.keys(TRANSPORTS));

/** Is the CLI there, and does it answer? Injectable so doctor's tests need no CLI. */
export function probeFirecrawl({ cliVersion = firecrawl.cliVersion, status = firecrawl.status } = {}) {
  const version = cliVersion();
  if (!version) return { installed: false, authenticated: false, version: null, credits: null };
  const state = status();
  return {
    installed: true,
    authenticated: Boolean(state.authenticated),
    version,
    credits: state.credits ?? null,
  };
}

/**
 * `selectTransport({ explicit, env, probe })` -> `{ name, adapter, why }`.
 * An explicit name that is not an adapter is an error naming the two that are.
 */
export function selectTransport({ explicit = '', env = process.env, probe = probeFirecrawl, config = null } = {}) {
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
    return {
      name: firecrawl.name,
      adapter: firecrawl,
      why: state.authenticated ? 'the CLI is installed and authenticated' : 'the CLI is installed (anonymous)',
      probe: state,
    };
  }
  return { name: httpKeyless.name, adapter: httpKeyless, why: 'no CLI on PATH - falling back to the keyless adapter', probe: state };
}

export { firecrawl, httpKeyless };
