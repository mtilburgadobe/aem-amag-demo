// Harvest en-html images/icons by intercepting the live page's OWN responses (one page open, 1440 then 360).
import { chromium } from 'playwright';
import fs from 'node:fs'; import path from 'node:path';
const LIVE = 'https://www.amag.ch/en.html';
const OUT = 'stardust/current/assets/media';
const MAP = 'stardust/replica/notes/en-html-media-map.json';
const map = fs.existsSync(MAP) ? JSON.parse(fs.readFileSync(MAP,'utf8')) : {};
const extOf = (ct, u) => /svg/.test(ct) ? 'svg' : /png/.test(ct) ? 'png' : /webp/.test(ct) ? 'webp' : /gif/.test(ct) ? 'gif' : /jpe?g/.test(ct) ? 'jpg' : (u.match(/\.(svg|png|jpe?g|webp|gif)(\?|$)/i)||[])[1]?.toLowerCase().replace('jpeg','jpg') || 'bin';
function stableName(u, ct) {
  const url = new URL(u); const ext = extOf(ct, u);
  if (url.hostname.startsWith('dam.amag-group.ch')) {
    const m = url.pathname.match(/\/is\/image\/amagproduction\/([^:]+)(?::([^/]+))?/);
    const wid = url.searchParams.get('wid') || 'o'; const hei = url.searchParams.get('hei') || 'o';
    return `s7-${(m?.[1]||'img').replace(/[^\w.-]+/g,'_')}-${(m?.[2]||'orig').replace(/[^\w.-]+/g,'_')}-w${wid}h${hei}.${ext}`;
  }
  const p = decodeURIComponent(url.pathname);
  const segs = p.split('/').filter(Boolean);
  const dam = p.match(/\/content\/dam\/(.+?)(?:\/_?jcr:content\/renditions\/original\.transform\/([^/]+)\/img\.\w+)?$/) || p.match(/\/content\/dam\/(.+?)(?:\/_jcr_content\/renditions\/original\.transform\/([^/]+)\/img\.\w+)?$/);
  if (dam) { const base = dam[1].split('/').slice(-2).join('_').replace(/\.\w+$/,''); return `dam-${base}${dam[2]?'-'+dam[2]:''}.${ext}`.replace(/[^\w.-]+/g,'_'); }
  return `lib-${segs.slice(-3).join('_').replace(/\.\w+$/,'')}.${ext}`.replace(/[^\w.-]+/g,'_');
}
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage();
let n = 0;
page.on('response', async (r) => {
  try {
    const u = r.url(); const ct = (r.headers()['content-type']||'').toLowerCase();
    if (!(ct.startsWith('image/') || /\.(svg|png|jpe?g|webp|gif)(\?|$)/i.test(u))) return;
    if (r.status() !== 200) return;
    if (map[u]) return;
    const buf = await r.body(); if (!buf || buf.length < 50) return;
    const name = stableName(u, ct); fs.writeFileSync(path.join(OUT, name), buf); map[u] = `assets/media/${name}`; n++;
  } catch {}
});
await page.goto(LIVE, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(2500);
try { await page.click('#onetrust-accept-btn-handler', { timeout: 3000 }); } catch {}
await page.mouse.move(0,0);
const scrollAll = async () => { const h = await page.evaluate(() => document.documentElement.scrollHeight); for (let y = 0; y < h + 900; y += 400) { await page.evaluate(y => window.scrollTo(0, y), y); await page.waitForTimeout(120); } await page.waitForTimeout(1500); await page.evaluate(() => window.scrollTo(0,0)); await page.waitForTimeout(500); };
const currentSrcs = async () => page.evaluate(() => [...document.querySelectorAll('img')].map(i => ({ src: i.getAttribute('src'), cur: i.currentSrc, w: i.getBoundingClientRect().width, h: i.getBoundingClientRect().height, nat: i.naturalWidth, alt: i.alt })));
await scrollAll();
const cur1440 = await currentSrcs();
// lazy backgrounds / css urls
const cssUrls = await page.evaluate(() => { const s = new Set(); for (const el of document.querySelectorAll('*')) { const bg = getComputedStyle(el).backgroundImage; if (bg && bg !== 'none') for (const m of bg.matchAll(/url\("?([^")]+)"?\)/g)) s.add(m[1]); } return [...s]; });
const svgs = await page.evaluate(() => [...document.querySelectorAll('svg')].map(s => ({ cls: s.getAttribute('class'), vb: s.getAttribute('viewBox'), html: s.outerHTML })));
await page.setViewportSize({ width: 360, height: 800 });
await page.waitForTimeout(1500);
await scrollAll();
const cur360 = await currentSrcs();
await page.waitForTimeout(2000);
// fetch any css url()s or currentSrc not yet captured via the page's own fetch (same-origin credentials)
const want = new Set([...cssUrls, ...cur1440.map(x=>x.cur), ...cur360.map(x=>x.cur)].filter(u => u && /^https?:/.test(u) && !map[u] && !u.startsWith('data:')));
for (const u of want) { try { const res = await page.evaluate(async (u) => { const r = await fetch(u, { credentials: 'include' }); if (!r.ok) return null; const ct = r.headers.get('content-type')||''; const ab = await r.arrayBuffer(); return { ct, b64: btoa(String.fromCharCode(...new Uint8Array(ab))) }; }, u); if (res) { const name = stableName(u, res.ct); fs.writeFileSync(path.join(OUT, name), Buffer.from(res.b64, 'base64')); map[u] = `assets/media/${name}`; n++; } } catch (e) { console.log('fetch-miss', u, e.message); } }
fs.writeFileSync(MAP, JSON.stringify(map, null, 1));
fs.writeFileSync('stardust/replica/notes/en-html-currentsrc.json', JSON.stringify({ '1440': cur1440, '360': cur360, cssUrls }, null, 1));
fs.writeFileSync('stardust/replica/notes/en-html-live-svgs.json', JSON.stringify(svgs));
console.log('harvested', n, 'files; map entries', Object.keys(map).length, 'cssUrls', cssUrls.length, 'svgs', svgs.length);
await b.close();
