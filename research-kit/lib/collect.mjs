// collect.mjs - one URL's journey.
//
// `collectOne` (cache, force, fail entries, evidence and source rows) and `writeRaw`
// (the capture writer, which hands back the corpus's own index entry).
//
// It stamps `transport` and `completeness` from what the ADAPTER declared and invents
// neither. The Finding cell a row is born with is lib/finding.mjs's: the collector
// IMPORTS firstFinding and does not re-export it, so the extractor has one address.

import fs from 'node:fs';
import {
  PATHS, HEADERS, resolve, today, sha256, titleFromUrl, hostOf, urlDigest, writeText, readText,
} from './core.mjs';
import {
  captureEntry, cacheDecision, rememberCapture, appendRow, upsertRow, nextId,
  readCaptures, parseTable,
} from './corpus.mjs';
import { appendFetch, withLock } from './provenance.mjs';
import { firstFinding } from './finding.mjs';

/** `research/raw/2026-09-13-rate-limits-firecrawl-552467ff.md` */
export function captureName(url, { date = today(), title = '' } = {}) {
  const slug = title ? String(title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) : titleFromUrl(url);
  const host = hostOf(url).split('.').slice(-2, -1)[0] || 'page';
  return `${date}-${slug || 'page'}-${host}-${urlDigest(url)}.md`;
}

/**
 * Write one capture with its front-matter. Returns the corpus's own index entry, so a
 * caller stores a fact instead of reconstructing one.
 */
export function writeRaw(root, result, { date = today() } = {}) {
  const file = `${PATHS.raw}/${captureName(result.url, { date, title: result.title })}`;
  const front = [
    '---',
    `url: ${result.url}`,
    `retrieved: ${date}`,
    `command: ${result.cmd ?? ''}`,
    `statusCode: ${result.statusCode ?? ''}`,
    `transport: ${result.transport ?? ''}`,
    `completeness: ${result.completeness ?? 'unspecified'}`,
    ...(result.omitted ? [`omitted: ${result.omitted}`] : []),
    ...(result.title ? [`title: ${result.title}`] : []),
    '---',
    '',
  ].join('\n');
  const body = String(result.markdown ?? '');
  writeText(resolve(root, file), `${front}${body}\n`);
  return captureEntry({
    file,
    url: result.url,
    retrieved: date,
    command: result.cmd ?? '',
    statusCode: result.statusCode ?? '',
    transport: result.transport ?? '',
    completeness: result.completeness ?? 'unspecified',
    omitted: result.omitted ?? '',
    bytes: Buffer.byteLength(body, 'utf8'),
  });
}

/** The capture's body hash, taken over the exact bytes on disk. */
export function bodyHashOf(root, file) {
  return sha256(fs.readFileSync(resolve(root, file)));
}

/**
 * Collect one URL: consult the cache, run the adapter through the `runScrape` seam,
 * write the capture, append the ledger entry, and add the evidence and source rows.
 *
 * Returns `{ status, entry, row, reason }` where `status` is
 * `cached` | `collected` | `failed` | `skipped`.
 */
/**
 * The source type a capture is BORN with.
 *
 * Not `P`. `P` is the only kind that carries a design, and "the fetcher reached it"
 * establishes nothing about who owns the fact - a random blog stamped primary is a
 * claim the collector is not entitled to make. A row starts as `S` (context) and the
 * agent promotes it after reading the page; a plan entry may declare `P` up front,
 * because a human wrote that URL down on purpose.
 */
export const DEFAULT_SOURCE_TYPE = 'S';

export function collectOne(root, url, {
  runScrape,
  corpus,
  type = DEFAULT_SOURCE_TYPE,
  usedFor = '',
  refreshDays = 30,
  force = false,
  date = today(),
  now = new Date(),
  transportName = '',
  // Which search provider ranked this URL, when a search is why it is being fetched.
  discoveredBy = '',
  dryRun = false,
} = {}) {
  // A dry run decides and writes nothing, so it needs no exclusive section.
  if (dryRun) {
    const preview = cacheDecision(corpus.captures, url, { refreshDays, force, now });
    if (preview.hit) {
      return { status: 'cached', url, entry: preview.entry, reason: `fresh capture from ${preview.entry.retrieved}`, spent: 0 };
    }
    return { status: 'skipped', url, entry: null, reason: `would collect (${preview.reason})`, spent: 0 };
  }

  // ONE WRITER BOUNDARY for the whole durable operation (ADR-0025).
  //
  // The cache decision, the capture write, the ID allocation, the ledger append and the
  // two row updates are one transaction or they are nothing. Locking only the ledger
  // append made the chain safe and left everything around it racing: two collectors
  // could allocate the same E-## id, choose the same capture filename, or lose each
  // other's row because both had read the table before either wrote it.
  //
  // The cache is re-read INSIDE the section, so a URL another collector finished while
  // we queued is a hit here rather than a second paid fetch.
  return withLock(root, () => {
    const fresh = refreshCaptures(root, corpus);
    const decision = cacheDecision(fresh, url, { refreshDays, force, now });
    if (decision.hit) {
      return { status: 'cached', url, entry: decision.entry, reason: `fresh capture from ${decision.entry.retrieved}`, spent: 0 };
    }

    let result;
    try {
      result = runScrape(url);
    } catch (err) {
      result = { ok: false, url, error: err.message };
    }

    if (!result?.ok) {
      appendFetch(root, {
        op: 'fail', url, raw: '', bodySha256: '',
        transport: result?.transport || transportName,
        discoveredBy,
        cmd: result?.cmd ?? '', error: result?.error ?? 'unknown failure',
      });
      return { status: 'failed', url, entry: null, reason: result?.error ?? 'unknown failure', spent: 1 };
    }

    const entry = writeRaw(root, result, { date });
    const bodySha256 = bodyHashOf(root, entry.file);
    appendFetch(root, {
      op: 'scrape',
      url: entry.url,
      type,
      raw: entry.file,
      bodySha256,
      transport: entry.transport || transportName,
      discoveredBy,
      completeness: entry.completeness,
      omitted: entry.omitted,
      cmd: entry.command,
      at: `${date}T00:00:00.000Z`,
    });
    rememberCapture(corpus.captures, entry);

    // Ids are allocated from the table ON DISK, under the lock - a caller's in-memory
    // list can be stale by the time it gets here, and a duplicated E-## silently changes
    // what every citation to it means.
    const onDisk = parseTable(readText(resolve(root, PATHS.evidence), ''), HEADERS.evidence);
    const id = nextId('E', [...onDisk.rows.map((r) => ({ id: r.ID })), ...corpus.evidence]);
    const finding = firstFinding(result.markdown, result.title || url);
    appendRow(root, PATHS.evidence, HEADERS.evidence, [id, date, type, entry.url, finding, entry.file]);
    corpus.evidence.push({ id, retrieved: date, type, url: entry.url, finding, raw: entry.file, line: 0 });

    upsertRow(root, PATHS.sources, HEADERS.sources, [entry.url, type, result.title || titleFromUrl(entry.url), date, usedFor]);

    return { status: 'collected', url: entry.url, entry, row: { id, finding }, reason: decision.reason, spent: 1 };
  });
}

/**
 * Re-read the capture index from disk and fold it into the caller's snapshot.
 *
 * A run reads its corpus once, then collects for minutes. Deciding freshness from that
 * first read means a page another collector finished in the meantime is fetched again and
 * paid for again.
 */
function refreshCaptures(root, corpus) {
  const current = readCaptures(root);
  for (const entry of current.entries) rememberCapture(corpus.captures, entry);
  return corpus.captures;
}
