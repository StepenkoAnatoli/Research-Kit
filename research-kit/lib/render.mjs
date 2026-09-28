// render.mjs - terminal table rendering for CLI output. Knows nothing else.

const SEVERITY_ORDER = { fail: 0, warn: 1, info: 2, pass: 3 };

export function renderTable(rows, columns) {
  if (!rows.length) return '';
  // Deliberately NOT `Math.max(col.header.length, ...rows.map(...))`. The spread passes
  // one ARGUMENT per row, and V8 runs out of stack somewhere past 100,000 of them:
  // measured 2026-09-28, 50,000 rows rendered and 200,000 threw
  // `RangeError: Maximum call stack size exceeded` - a crash with a raw stack trace
  // where a report is supposed to be. A fold has no ceiling and costs nothing.
  const widths = columns.map((col) => rows.reduce(
    (widest, row) => Math.max(widest, String(col.value(row) ?? '').length),
    col.header.length,
  ));
  const line = (cells) => cells.map((cell, i) => String(cell ?? '').padEnd(widths[i])).join('  ').trimEnd();
  const out = [line(columns.map((c) => c.header)), line(widths.map((w) => '-'.repeat(w)))];
  for (const row of rows) out.push(line(columns.map((c) => c.value(row))));
  return out.join('\n');
}

export function renderFindings(findings, { showPass = false } = {}) {
  const rows = findings
    .filter((f) => showPass || f.severity !== 'pass')
    .sort((a, b) => (SEVERITY_ORDER[a.severity] ?? 9) - (SEVERITY_ORDER[b.severity] ?? 9));
  if (!rows.length) return '';
  return renderTable(rows, [
    { header: '', value: (f) => f.severity },
    { header: 'check', value: (f) => (f.rule && f.rule !== f.check ? `${f.check}/${f.rule}` : f.check) },
    { header: 'detail', value: (f) => f.detail },
  ]);
}

export function heading(text) {
  return `\n${text}\n${'-'.repeat(text.length)}`;
}

export function bullet(text, indent = 2) {
  return `${' '.repeat(indent)}- ${text}`;
}
