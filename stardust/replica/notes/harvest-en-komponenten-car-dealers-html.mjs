// Harvest en-komponenten-car-dealers-html images/icons by intercepting the live page's OWN responses (one page open, 1440 then 360).
// Mirroring convention (as en-html / en-services): www.amag.ch paths under assets/media/amag/<path>, Scene7 as s7-<asset>-<preset>-w<wid>h<hei>.<ext>.
// The Google map is runtime-hydrated: its rendered state (tiles + 100 markers + bundled zoom control) is kept AS CAPTURED as one
// element screenshot per breakpoint (captureState; restoreAtDelivery = Google Maps JS embed), the overlay/pill hidden while shooting.
import { chromium } from 'playwright';
import fs from 'node:fs'; import path from 'node:path';
const LIVE = 'https://www.amag.ch/en/komponenten/car-dealers.html';
const OUT = 'stardust/current/assets/media';
const N = 'stardust/replica/notes/';
const MAP = N + 'en-komponenten-car-dealers-html-media-map.json';
const prior = {};
for (const f of ['en-html-media-map.json', 'en-services-html-media-map.json']) if (fs.existsSync(N + f)) Object.assign(prior, JSON.parse(fs.readFileSync(N + f, 'utf8')));
const map = fs.existsSync(MAP) ? JSON.parse(fs.readFileSync(MAP, 'utf8')) : {};
const extOf = (ct, u) => /svg/.test(ct) ? 'svg' : /png/.test(ct) ? 'png' : /webp/.test(ct) ? 'webp' : /gif/.test(ct) ? 'gif' : /jpe?g/.test(ct) ? 'jpg' : (u.match(/\.(svg|png|jpe?g|webp|gif)(\?|$)/i) || [])[1]?.toLowerCase() || 'bin';
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
let saved = 0, reused = 0;
function save(u, ct, buf) {
  const reuse = prior[u]; const rel = reuse ? reuse.replace(/^assets\/media\//, '') : relName(u, ct);
  const file = path.join(OUT, rel);
  if (!fs.existsSync(file)) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, buf); saved++; } else reused++;
  map[u] = `assets/media/${rel}`;
}
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage();
page.on('response', async (r) => {
  try {
    const u = r.url(); const host = new URL(u).hostname; const ct = (r.headers()['content-type'] || '').toLowerCase();
    if (!/amag\.ch$|amag-group\.ch$/.test(host)) return; // tiles/fonts from Google are not rehosted; the map state is kept as a capture
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
await page.waitForTimeout(6000); // tiles + markers
const geometry = async () => page.evaluate(() => {
  const r = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); const cs = getComputedStyle(e); return { x: Math.round(b.x), y: Math.round(b.y + scrollY), w: Math.round(b.width), h: Math.round(b.height), display: cs.display, position: cs.position, overflowY: cs.overflowY, scrollH: e.scrollHeight }; };
  return { scrollY, docH: document.documentElement.scrollHeight, docW: document.documentElement.scrollWidth,
    storelocator: r('#storelocatorId'), component: r('.storelocator-component'), map: r('#storelocator__map'), overlay: r('.storelocator__garageOverlay'), saf: r('.storelocator__searchAndFilterContainer'), title: r('.storelocator__searchTitle'), search: r('.storelocator__searchContainer'), filter: r('.storelocator__filterContainer'), list: r('.storelocator__garageContainer'), garage1: r('.storelocator__garage'), garage2: r('.storelocator__garage:nth-of-type(3)'), zoom: r('.gm-bundled-control-on-bottom'), pill: r('.amag-direct-entry__button'), canvas: r('.off-canvas__canvas-box'), footer: r('footer .amag-footer'), header: r('#header'),
    pillClass: document.querySelector('.amag-direct-entry__button')?.className, bodyClass: document.body.className, slClass: document.querySelector('.storelocator-component')?.className,
    imgs: [...document.querySelectorAll('div.amag-content img')].filter(i => !i.closest('#storelocator__map')).map(i => ({ src: i.getAttribute('src'), cur: i.currentSrc, cls: i.className, w: Math.round(i.getBoundingClientRect().width), h: Math.round(i.getBoundingClientRect().height) })),
    mapImgs: [...document.querySelectorAll('#storelocator__map img')].map(i => i.currentSrc).filter((v, i, a) => a.indexOf(v) === i).slice(0, 40) };
});
const shootMap = async (w) => {
  await page.evaluate(() => { for (const s of ['.storelocator__garageOverlay', '.amag-direct-entry', '#onetrust-consent-sdk', '#ot-sdk-btn-floating']) document.querySelectorAll(s).forEach(e => e.style.visibility = 'hidden'); });
  await page.waitForTimeout(300);
  const el = await page.$('#storelocator__map');
  fs.mkdirSync(OUT + '/amag/storelocator', { recursive: true });
  await el.screenshot({ path: `${OUT}/amag/storelocator/map-capture-${w}.png` }); // overwritten on every run: the capture state
  await page.evaluate(() => { for (const s of ['.storelocator__garageOverlay', '.amag-direct-entry', '#onetrust-consent-sdk', '#ot-sdk-btn-floating']) document.querySelectorAll(s).forEach(e => e.style.visibility = ''); });
};
const g1440 = await geometry();
await shootMap(1440);
const svgs = await page.evaluate(() => [...document.querySelectorAll('div.amag-content svg')].filter(s => !s.closest('#storelocator__map')).map(s => ({ cls: s.getAttribute('class'), vb: s.getAttribute('viewBox'), parent: s.parentElement.className, ptag: s.parentElement.tagName, html: s.outerHTML })));
const sw = await page.evaluate(() => { const s = new Set(); for (const el of document.querySelectorAll('div.amag-content *')) { if (el.closest('#storelocator__map')) continue; const bg = getComputedStyle(el).backgroundImage; if (bg && bg !== 'none') for (const m of bg.matchAll(/url\(["']?([^"')]+)/g)) s.add(new URL(m[1], location.href).href); } return [...s]; });
await page.setViewportSize({ width: 360, height: 800 });
// the map fits its bounds to the INITIAL viewport (a resize keeps the desktop center/zoom), so the 360 state needs a fresh load at 360 — second and last live hit
await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(2500);
try { await page.click('#onetrust-accept-btn-handler', { timeout: 3000 }); } catch {}
await page.mouse.move(0, 0);
await page.waitForTimeout(6000);
const g360 = await geometry();
await shootMap(360);
const want = new Set([...sw, ...g1440.imgs.map(x => x.cur), ...g360.imgs.map(x => x.cur)].filter(u => u && /^https?:/.test(u) && !map[u] && !u.startsWith('data:') && /amag/.test(new URL(u).hostname)));
for (const u of want) { try { const res = await page.evaluate(async (u) => { const r = await fetch(u, { credentials: 'include' }); if (!r.ok) return null; const ct = r.headers.get('content-type') || ''; const ab = await r.arrayBuffer(); return { ct, b64: btoa(String.fromCharCode(...new Uint8Array(ab))) }; }, u); if (res) save(u, res.ct, Buffer.from(res.b64, 'base64')); } catch {} }
fs.writeFileSync(MAP, JSON.stringify(map, null, 1));
fs.writeFileSync(N + 'en-komponenten-car-dealers-html-live-geometry.json', JSON.stringify({ '1440': g1440, '360': g360, cssUrls: sw }, null, 1));
fs.writeFileSync(N + 'en-komponenten-car-dealers-html-live-svgs.json', JSON.stringify(svgs));
console.log('saved', saved, 'reused', reused, 'map entries', Object.keys(map).length, 'svgs', svgs.length, 'cssUrls', sw.length);
console.log(JSON.stringify({ '1440': g1440, '360': g360 }, (k, v) => k === 'imgs' || k === 'mapImgs' ? undefined : v));
console.log('imgs1440', JSON.stringify(g1440.imgs.slice(0, 30)), 'mapImgs', JSON.stringify(g1440.mapImgs.slice(0, 8)));
await b.close();
