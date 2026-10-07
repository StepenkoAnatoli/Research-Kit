// The panel's page. Every value from the server is placed with textContent, never as HTML.
'use strict';

const token = new URLSearchParams(location.hash.slice(1)).get('t') || '';
const $ = (id) => document.getElementById(id);

async function call(route, body) {
  const options = { headers: { 'x-panel-token': token } };
  if (body !== undefined) {
    options.method = 'POST';
    options.headers['content-type'] = 'application/json';
    options.body = JSON.stringify(body);
  }
  const res = await fetch(route, options);
  const data = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

function banner(text) {
  $('banner').hidden = !text;
  $('banner').textContent = text || '';
}

function show(title, text) {
  $('output-title').textContent = title;
  $('output').textContent = text;
}

function render(s) {
  $('topic').textContent = s.topic || (s.isProject ? '(this project has no topic yet)' : '(not a research project)');
  $('project').textContent = s.project;
  $('project-path').value = $('project-path').value || s.project;
  const role = $('role');
  role.textContent = s.role;
  role.className = `badge ${s.role}`;
  $('version').textContent = `kit ${s.kitVersion}`;
  $('config-path').textContent = s.configPath;
  const search = s.keys.search;
  $('search-state').textContent = search.set ? `set (${search.source})` : 'not set';
  $('firecrawl-state').textContent = s.keys.firecrawl.environment ? 'FIRECRAWL_API_KEY is set in this environment.' : '';
  $('brief').disabled = !s.brief;
  $('builder-note').textContent = s.role === 'builder'
    ? 'This machine is declared a builder: it builds from the brief and never collects. The steps below are the ones it follows.'
    : (s.brief ? 'Preflight must print PASS before the hand-off.' : 'research/BRIEF.md does not exist yet: finish phase 1 before handing off.');
  $('builder-text').textContent = s.builderInstructions;
  $('update-note').textContent = s.update.sameCopy
    ? `This panel runs from the installed copy (${s.update.to}). To update, get the new kit (git pull or a download), start the panel from it, and press Update.`
    : `Installs ${s.update.from} over ${s.update.to}. Preview first.`;
  $('update').disabled = s.update.sameCopy;
  document.querySelector('[data-run="update-preview"]').disabled = s.update.sameCopy;
}

async function refresh() {
  try { render(await call('/api/state')); banner(''); } catch (err) { banner(err.message); }
}

async function run(command, button) {
  const buttons = document.querySelectorAll('button');
  buttons.forEach((b) => { b.disabled = true; });
  show(command, `running ${command}...`);
  try {
    const result = await call('/api/run', { command });
    show(`${command} - exit ${result.code}`, result.output || '(no output)');
  } catch (err) {
    show(command, err.message);
  } finally {
    buttons.forEach((b) => { b.disabled = false; });
    await refresh();
    if (button) button.focus();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (!token) banner('Open the panel from the address it printed in the terminal; this one has no token.');

  $('connect').addEventListener('click', () => {
    const section = $('builder');
    section.hidden = !section.hidden;
    if (!section.hidden) $('project-path').focus();
  });

  for (const button of document.querySelectorAll('[data-run]')) {
    button.addEventListener('click', () => run(button.dataset.run, button));
  }

  $('project-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    try { render(await call('/api/project', { path: $('project-path').value })); banner(''); } catch (err) { banner(err.message); }
  });

  $('search-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const input = $('search-key');
    try {
      const result = await call('/api/key/search', { key: input.value });
      input.value = '';
      $('search-state').textContent = result.keys.search.set ? `saved (${result.keys.search.source})` : 'cleared';
      banner('');
    } catch (err) { banner(err.message); }
  });

  $('copy-builder').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText($('builder-text').textContent); banner(''); show('Copied', 'The builder instructions are on the clipboard.'); }
    catch { banner('Copy failed: select the text in the builder panel and copy it by hand.'); }
  });

  $('brief').addEventListener('click', async () => {
    try { const brief = await call('/api/brief'); show(brief.path, brief.text); } catch (err) { show('BRIEF.md', err.message); }
  });

  refresh();
});
