// Harvest en-services-html images/icons by intercepting the live page's OWN responses (one page open, 1440 then 360).
// Mirroring convention (as en-html): www.amag.ch paths under assets/media/amag/<path>, Scene7 (dam.amag-group.ch) as s7-<asset>-<preset>-w<wid>h<hei>.<ext>.
import { chromium } from 'playwright';
import fs from 'node:fs'; import path from 'node:path';
const LIVE = 'https://www.amag.ch/en/services.html';
const OUT = 'stardust/current/assets/media';
const MAP = 'stardust/replica/notes/en-services-html-media-map.json';
const HOME_MAP = 'stardust/replica/notes/en-html-media-map.json';
const map = fs.existsSync(MAP) ? JSON.parse(fs.readFileSync(MAP, 'utf8')) : {};
const homeMap = fs.existsSync(HOME_MAP) ? JSON.parse(fs.readFileSync(HOME_MAP, 'utf8')) : {};
const extOf = (ct, u) => /svg/.test(ct) ? 'svg' : /png/.test(ct) ? 'png' : /webp/.test(ct) ? 'webp' : /gif/.test(ct) ? 'gif' : /jpe?g/.test(ct) ? 'jpg' : (u.match(/\.(svg|png|jpe?g|webp|gif)(\?|$)/i) || [])[1]?.toLowerCase().replace('jpeg', 'jpg') || 'bin';
function relName(u, ct) {
  const url = new URL(u); const ext = extOf(ct, u);
  if (url.hostname.startsWith('dam.amag-group.ch')) {
    const m = url.pathname.match(/\/is\/image\/amagproduction\/([^:]+)(?::([^/]+))?/);
    const wid = url.searchParams.get('wid') || 'o'; const hei = url.searchParams.get('hei') || 'o';
    return `s7-${(m?.[1] || 'img').replace(/[^\w.-]+/g, '_')}-${(m?.[2] || 'orig').replace(/[^\w.-]+/g, '_')}-w${wid}h${hei}.${ext}`;
  }
  if (url.hostname === 'www.amag.ch') return 'amag' + decodeURIComponent(url.pathname);
  return 'ext/' + url.hostname + decodeURIComponent(url.pathname);
}
function save(u, ct, buf) {
  const reuse = homeMap[u]; const rel = reuse ? reuse.replace(/^assets\/media\//, '') : relName(u, ct);
  const file = path.join(OUT, rel);
  if (!fs.existsSync(file)) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, buf); saved++; } else reused++;
  map[u] = `assets/media/${rel}`;
}
let saved = 0, reused = 0;
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage();
page.on('response', async (r) => {
  try {
    const u = r.url(); const ct = (r.headers()['content-type'] || '').toLowerCase();
    if (!(ct.startsWith('image/') || /\.(svg|png|jpe?g|webp|gif)(\?|$)/i.test(u))) return;
    if (r.status() !== 200 || map[u]) return;
    const buf = await r.body(); if (!buf || buf.length < 50) return;
    save(u, ct, buf);
  } catch {}
});
await page.goto(LIVE, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(2500);
try { await page.click('#onetrust-accept-btn-handler', { timeout: 3000 }); } catch {}
await page.mouse.move(0, 0);
const scrollAll = async () => { const h = await page.evaluate(() => document.documentElement.scrollHeight); for (let y = 0; y < h + 900; y += 400) { await page.evaluate(y => window.scrollTo(0, y), y); await page.waitForTimeout(120); } await page.waitForTimeout(1500); await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(500); };
const currentSrcs = async () => page.evaluate(() => [...document.querySelectorAll('img')].map(i => ({ src: i.getAttribute('src'), cur: i.currentSrc, w: i.getBoundingClientRect().width, h: i.getBoundingClientRect().height, nat: i.naturalWidth, alt: i.alt })));
await scrollAll();
const cur1440 = await currentSrcs();
const cssUrls = await page.evaluate(() => { const s = new Set(); for (const el of document.querySelectorAll('*')) { const bg = getComputedStyle(el).backgroundImage; if (bg && bg !== 'none') for (const m of bg.matchAll(/url\("?([^")]+)"?\)/g)) s.add(m[1]); } return [...s]; });
const svgs = await page.evaluate(() => [...document.querySelectorAll('div.amag-content svg')].map(s => ({ cls: s.getAttribute('class'), vb: s.getAttribute('viewBox'), parent: s.parentElement.className, html: s.outerHTML })));
const pictures = await page.evaluate(() => [...document.querySelectorAll('div.amag-content picture')].map(p => p.outerHTML));
const directEntry = await page.evaluate(() => ({ btn: document.querySelector('.amag-direct-entry__button')?.className, popup: document.querySelector('.amag-direct-entry__pop-up')?.className, scrollY: window.scrollY }));
await page.setViewportSize({ width: 360, height: 800 });
await page.waitForTimeout(1500);
await scrollAll();
const cur360 = await currentSrcs();
const directEntry360 = await page.evaluate(() => ({ btn: document.querySelector('.amag-direct-entry__button')?.className }));
await page.waitForTimeout(2000);
const want = new Set([...cssUrls, ...cur1440.map(x => x.cur), ...cur360.map(x => x.cur)].filter(u => u && /^https?:/.test(u) && !map[u] && !u.startsWith('data:')));
for (const u of want) { try { const res = await page.evaluate(async (u) => { const r = await fetch(u, { credentials: 'include' }); if (!r.ok) return null; const ct = r.headers.get('content-type') || ''; const ab = await r.arrayBuffer(); return { ct, b64: btoa(String.fromCharCode(...new Uint8Array(ab))) }; }, u); if (res) save(u, res.ct, Buffer.from(res.b64, 'base64')); } catch (e) { console.log('fetch-miss', u, e.message); } }
fs.writeFileSync(MAP, JSON.stringify(map, null, 1));
fs.writeFileSync('stardust/replica/notes/en-services-html-currentsrc.json', JSON.stringify({ '1440': cur1440, '360': cur360, cssUrls, directEntry, directEntry360 }, null, 1));
fs.writeFileSync('stardust/replica/notes/en-services-html-live-svgs.json', JSON.stringify(svgs));
fs.writeFileSync('stardust/replica/notes/en-services-html-live-pictures.json', JSON.stringify(pictures, null, 1));
console.log('saved', saved, 'reused', reused, 'map entries', Object.keys(map).length, 'cssUrls', cssUrls.length, 'svgs', svgs.length, 'pictures', pictures.length, 'directEntry', JSON.stringify(directEntry), JSON.stringify(directEntry360));
await b.close();
