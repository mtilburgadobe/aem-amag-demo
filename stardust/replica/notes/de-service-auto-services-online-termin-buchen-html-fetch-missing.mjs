// Fetches the page's own unharvested assets (icons inside the hidden wizard panes, never requested by the live page because the
// panes are display:none) straight from www.amag.ch — no browser. Adds them to this slug's media map.
import fs from 'node:fs'; import path from 'node:path';
const SLUG = 'de-service-auto-services-online-termin-buchen-html'; const N = 'stardust/replica/notes/'; const MAP = N + `${SLUG}-media-map.json`;
const map = JSON.parse(fs.readFileSync(MAP, 'utf8'));
const html = fs.readFileSync(`stardust/prototypes/${SLUG}-proposed.html`, 'utf8');
const urls = [...new Set((html.match(/data-missing="([^"]*)"/g) || []).map(m => m.slice(14, -1).replace(/&amp;/g, '&')))];
let ok = 0, bad = 0;
for (const u of urls) {
  const abs = u.startsWith('http') ? u : 'https://www.amag.ch' + u;
  try {
    const r = await fetch(abs, { headers: { 'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128 Safari/537.36', accept: 'image/*,*/*' } });
    if (r.status === 403 || r.status === 429) { console.log('bot_protection:', abs, r.status); process.exit(3); }
    if (!r.ok) { bad++; console.log('miss', r.status, abs); continue; }
    const buf = Buffer.from(await r.arrayBuffer()); const url = new URL(abs); const rel = 'amag' + decodeURIComponent(url.pathname); const file = path.join('stardust/current/assets/media', rel);
    fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, buf); map[abs] = `assets/media/${rel}`; ok++;
  } catch (e) { bad++; console.log('err', abs, e.message); }
}
fs.writeFileSync(MAP, JSON.stringify(map, null, 1));
console.log('fetched', ok, 'failed', bad, 'of', urls.length, '| map', Object.keys(map).length);
