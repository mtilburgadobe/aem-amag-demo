// Writes tools/replica/progress.html from stardust/replica/status-model.json + stardust/.labs/run.json.
import fs from 'node:fs';
const run = JSON.parse(fs.readFileSync('stardust/.labs/run.json', 'utf8'));
const m = JSON.parse(fs.readFileSync('stardust/replica/status-model.json', 'utf8'));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const badge = (state) => {
  const cls = { Done: ' spectrum-badge--positive', Ready: ' spectrum-badge--positive', 'In progress': ' spectrum-badge--informative', 'Needs attention': ' spectrum-badge--notice', Yes: ' spectrum-badge--positive', Checking: ' spectrum-badge--informative' }[state] || '';
  return `<span class="spectrum-badge${cls}">${esc(state)}</span>`;
};
const now = new Date();
const stepNames = ['Analyzing your site', 'Capturing brand and design', 'Rebuilding page templates', 'Checking fidelity', 'Migrating your pages'];
const weights = [10, 10, 40, 10, 30];
// m.steps: array of 5 fractions 0..1 (step 3 and 5 are derived from templates/pages if absent)
const templates = m.templates || [];
const pages = m.pages || [];
const steps = m.steps.slice();
if (templates.length && steps[2] == null) steps[2] = templates.reduce((a, t) => a + (t.fraction ?? (t.status === 'Done' ? 1 : t.status === 'In progress' ? 0.5 : 0)), 0) / templates.length;
if (pages.length && steps[4] == null) steps[4] = pages.filter((p) => p.ready).length / pages.length;
const pct = Math.round(steps.reduce((a, f, i) => a + (f || 0) * weights[i], 0));
const stepState = (f) => (f >= 1 ? 'Done' : f > 0 ? 'In progress' : 'Upcoming');
const runningMs = (run.priorRunningMs || 0) + (now - new Date(run.startedAt));
let estimate = 'Estimating…';
if (pct >= 100) estimate = 'Complete';
else if (pct >= 10) {
  const remainMs = runningMs * (100 - pct) / pct;
  const q = 15 * 60 * 1000;
  const lo = Math.max(q, Math.floor(remainMs * 0.8 / q) * q);
  let hi = Math.max(lo + q, Math.ceil(remainMs * 1.25 / q) * q);
  const cap = new Date(run.deadlineAt) - now;
  if (hi > cap) hi = Math.max(lo, Math.floor(cap / q) * q);
  const fmt = (ms) => { const h = Math.floor(ms / 3600000); const mm = Math.round((ms % 3600000) / 60000); return h ? `${h} h${mm ? ` ${mm} min` : ''}` : `${mm} min`; };
  estimate = lo >= hi ? `About ${fmt(hi)} remaining` : `About ${fmt(lo)} to ${fmt(hi)} remaining`;
}
const ready = pages.filter((p) => p.ready);
const overall = m.overall || (pct >= 100 ? 'Ready' : 'In progress');
const ts = now.toISOString().slice(0, 16).replace('T', ' ') + ' UTC';
const previewUrl = run.previewUrl;
const html = `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Migration status</title>
<link rel="stylesheet" href="spectrum.css">
<style>
  body { background-color: var(--spectrum-bg-app); }
  main { max-width: 760px; margin: 0 auto; padding: 40px 24px 64px; }
  header { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
  .meta { color: var(--spectrum-text-subdued); margin: 0 0 24px; }
  .spectrum-panel { margin-bottom: 16px; }
  .spectrum-panel-header { margin: 0; padding: 0 16px; }
  .panel-body { padding: 16px; }
  .panel-body > :last-child { margin-bottom: 0; }
  .bar { height: 8px; border-radius: 9999px; background-color: var(--spectrum-gray-200); overflow: hidden; }
  .bar span { display: block; height: 100%; width: ${pct}%; background-color: var(--spectrum-accent-bg); }
  .estimate { color: var(--spectrum-text-subdued); margin: 8px 0 0; }
  ol.steps { list-style: none; padding: 0; margin: 0; }
  ol.steps li { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 0; }
  ol.steps li + li { border-top: 1px solid var(--spectrum-gray-200); }
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: 8px; text-align: left; border-bottom: 1px solid var(--spectrum-gray-200); }
  th { color: var(--spectrum-text-subdued); font-weight: 700; }
  ul.pages { margin: 8px 0 0; padding-left: 20px; }
</style>
</head>
<body>
<main>
  <header>
    <h1>Migration status</h1>
    ${badge(overall)}
  </header>
  <p class="meta">Source site: <a href="${esc(run.scope.sourceUrl)}">${esc(run.scope.sourceUrl)}</a><br>Preview site: <a href="${esc(previewUrl)}">${esc(previewUrl)}</a><br>Last updated: ${ts}</p>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Journey</h2>
    <div class="panel-body">
      <ol class="steps">
${stepNames.map((n, i) => `        <li>${n}${badge(stepState(steps[i] || 0))}</li>`).join('\n')}
      </ol>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Page templates</h2>
    <div class="panel-body">
      <table>
        <thead><tr><th>Template</th><th>Pages</th><th>Desktop</th><th>Mobile</th><th>Status</th></tr></thead>
        <tbody>
${templates.length ? templates.map((t) => `          <tr><td>${esc(t.name)}</td><td>${t.pages}</td><td>${badge(t.desktop || 'Upcoming')}</td><td>${badge(t.mobile || 'Upcoming')}</td><td>${badge(t.status || 'Upcoming')}</td></tr>`).join('\n') : '          <tr><td colspan="5">We are identifying your page templates.</td></tr>'}
        </tbody>
      </table>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Pages migrated</h2>
    <div class="panel-body">
      <p>${ready.length} of ${pages.length} pages are ready on the preview site.</p>
      <details${pages.length > 12 ? '' : ' open'}>
        <summary>Ready pages</summary>
        <ul class="pages">
${ready.length ? ready.map((p) => `          <li><a href="${esc(previewUrl.replace(/\/$/, '') + p.path)}">${esc(p.title || p.path)}</a></li>`).join('\n') : '          <li>No pages are ready yet.</li>'}
        </ul>
      </details>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Progress</h2>
    <div class="panel-body">
      <p>${pct}% complete</p>
      <div class="bar"><span></span></div>
      <p class="estimate">${esc(estimate)}</p>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">What's happening now</h2>
    <div class="panel-body">
      <p>${esc(m.now)}</p>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">What's next</h2>
    <div class="panel-body">
      <p>${esc(m.next)}</p>
    </div>
  </section>
</main>
</body>
</html>
`;
fs.mkdirSync('tools/replica', { recursive: true });
fs.writeFileSync('tools/replica/progress.html', html);
console.log(`status page: ${pct}% — ${estimate} — ${overall}`);
