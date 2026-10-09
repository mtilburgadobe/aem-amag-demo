// Harvest de-service-auto-services-online-termin-buchen-html: ONE live page open (1440 then 360). Intercepts the page's own image/SVG
// responses (reusing the three earlier media maps so chrome assets are not re-fetched), dumps live geometry + computed styles of the
// visible wizard elements at both widths, and clips the fixed reCAPTCHA badge (third-party iframe → replicated as a captured image).
import { chromium } from 'playwright';
import fs from 'node:fs'; import path from 'node:path';
const SLUG = 'de-service-auto-services-online-termin-buchen-html';
const LIVE = 'https://www.amag.ch/de/service/auto-services-online-termin-buchen.html';
const OUT = 'stardust/current/assets/media'; const N = 'stardust/replica/notes/';
const MAP = N + `${SLUG}-media-map.json`;
const map = fs.existsSync(MAP) ? JSON.parse(fs.readFileSync(MAP, 'utf8')) : {};
const prior = {}; for (const f of ['en-html', 'en-services-html', 'en-komponenten-car-dealers-html']) { const p = N + f + '-media-map.json'; if (fs.existsSync(p)) Object.assign(prior, JSON.parse(fs.readFileSync(p, 'utf8'))); }
const extOf = (ct, u) => /svg/.test(ct) ? 'svg' : /png/.test(ct) ? 'png' : /webp/.test(ct) ? 'webp' : /gif/.test(ct) ? 'gif' : /jpe?g/.test(ct) ? 'jpg' : (u.match(/\.(svg|png|jpe?g|webp|gif)(\?|$)/i) || [])[1]?.toLowerCase().replace('jpeg', 'jpg') || 'bin';
function relName(u, ct) {
  const url = new URL(u); const ext = extOf(ct, u);
  if (url.hostname.startsWith('dam.amag-group.ch')) { const m = url.pathname.match(/\/is\/image\/amagproduction\/([^:]+)(?::([^/]+))?/); const wid = url.searchParams.get('wid') || 'o'; const hei = url.searchParams.get('hei') || 'o'; return `s7-${(m?.[1] || 'img').replace(/[^\w.-]+/g, '_')}-${(m?.[2] || 'orig').replace(/[^\w.-]+/g, '_')}-w${wid}h${hei}.${ext}`; }
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
let status = 0;
page.on('response', async (r) => { try { const u = r.url(); const ct = (r.headers()['content-type'] || '').toLowerCase(); if (!(ct.startsWith('image/') || /\.(svg|png|jpe?g|webp|gif)(\?|$)/i.test(u))) return; if (r.status() !== 200 || map[u]) return; const buf = await r.body(); if (!buf || buf.length < 50) return; save(u, ct, buf); } catch {} });
const resp = await page.goto(LIVE, { waitUntil: 'domcontentloaded', timeout: 60000 }); status = resp?.status();
await page.waitForTimeout(3000);
const title = await page.title();
if (status === 403 || status === 429 || /access denied|bot|challenge/i.test(title)) { console.log('bot_protection:', LIVE, status, title); await b.close(); process.exit(3); }
try { await page.click('#onetrust-accept-btn-handler', { timeout: 3000 }); } catch {}
await page.mouse.move(0, 0);
const SEL = ['#header', '.amag-header', 'div.amag-content', '#amag-otv', '#amag-otv > div', '.tab-header-container', '.sticky-anchor', '.car-selection-container', '.tab-header-navigation-container', '#amag-component-tab_tab-header', '#otv-tab--1-header', '#otv-tab-0-header', '#otv-tab-1-header', '#otv-tab-2-header', '#otv-tab-3-header', '#otv-tab-4-header', '#otv-tab-0-header svg', '.active-tab-border', '.scroll-left', '.scroll-right', '#amag-component-tab_tab-content', '#otv-tab--1-content', '#otv-tab--1-content > .d-flex', '#otv-tab--1-content > .d-flex > .col-12:first-child', '.otv-tab-title', '.otv-text', '#brand', '#brand .generic-dynamic-dropdown-label', '#brand .generic-dynamic-dropdown-button', '#brand .generic-dynamic-dropdown-custom', '#brand .generic-dynamic-dropdown-chevron', '#brand .generic-dynamic-dropdown-spinner', '#model', '#otv-tab--1-content > .d-flex > .col-12.col-lg-6:not(.otv-login-wrapper)', '#otv-tab--1-content > .d-flex > .col-12.col-lg-6 > .amag-ctaWrapper__button', '.otv-login-wrapper', '.otv-login-wrapper > span', '.otv-login-wrapper .amag-ctaWrapper__button', '.otv-login-info-box', '.otv-login-info-box h4', '.otv-login-info-box ul', '.otv-login-info-box li', '.otv-login-info-box li p', '.otv-available-cars', '.preSelection__error-msg', 'footer', '.grecaptcha-badge', '.amag-direct-entry', '.amag-direct-entry__button'];
const PROPS = ['display', 'position', 'top', 'left', 'right', 'bottom', 'width', 'height', 'minHeight', 'maxWidth', 'margin', 'padding', 'backgroundColor', 'color', 'fontFamily', 'fontSize', 'lineHeight', 'fontWeight', 'letterSpacing', 'textAlign', 'border', 'borderBottom', 'borderRadius', 'boxShadow', 'flexDirection', 'alignItems', 'justifyContent', 'gap', 'overflow', 'overflowX', 'zIndex', 'transform', 'listStyle', 'textTransform', 'opacity', 'visibility', 'boxSizing', 'flex'];
const geometry = async () => page.evaluate(([SEL, PROPS]) => {
  const out = {};
  for (const s of SEL) { const e = document.querySelector(s); if (!e) { out[s] = null; continue; } const bb = e.getBoundingClientRect(); const cs = getComputedStyle(e); const o = { x: Math.round(bb.x), y: Math.round(bb.y + scrollY), w: Math.round(bb.width), h: Math.round(bb.height), cls: e.className && e.className.baseVal !== undefined ? e.className.baseVal : e.className, hidden: e.hidden, scrollW: e.scrollWidth }; for (const p of PROPS) o[p] = cs[p]; const bef = getComputedStyle(e, '::before'); const aft = getComputedStyle(e, '::after'); if (bef.content && bef.content !== 'none') o.before = { content: bef.content, w: bef.width, h: bef.height, bg: bef.backgroundColor, border: bef.border, radius: bef.borderRadius, color: bef.color, font: bef.fontFamily, fs: bef.fontSize, lh: bef.lineHeight, display: bef.display, position: bef.position, top: bef.top, left: bef.left, mr: bef.marginRight }; if (aft.content && aft.content !== 'none') o.after = { content: aft.content, w: aft.width, h: aft.height, bg: aft.backgroundColor, border: aft.border, position: aft.position, top: aft.top, left: aft.left, bottom: aft.bottom }; out[s] = o; }
  out.__navItems = [...document.querySelectorAll('#amag-component-tab_tab-header .nav-item')].map(li => { const a = li.querySelector('a'); const bb = a.getBoundingClientRect(); const cs = getComputedStyle(a); const svg = a.querySelector('svg'); const sb = svg ? svg.getBoundingClientRect() : null; return { cls: li.className, acls: a.className, text: a.textContent.trim(), x: Math.round(bb.x), y: Math.round(bb.y + scrollY), w: Math.round(bb.width), h: Math.round(bb.height), color: cs.color, font: cs.fontFamily, fs: cs.fontSize, lh: cs.lineHeight, pad: cs.padding, display: cs.display, flexDir: cs.flexDirection, alignItems: cs.alignItems, svg: sb ? { x: Math.round(sb.x), y: Math.round(sb.y + scrollY), w: Math.round(sb.width), h: Math.round(sb.height), fill: getComputedStyle(svg).fill, cls: svg.getAttribute('class'), mr: getComputedStyle(svg).marginRight } : null, svgHtml: svg ? svg.outerHTML.slice(0, 1200) : null }; });
  out.__docH = document.documentElement.scrollHeight; out.__bodyBg = getComputedStyle(document.body).backgroundColor;
  out.__visibleTexts = [...document.querySelectorAll('div.amag-content *')].filter(e => e.children.length === 0 && e.textContent.trim() && getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().width > 0).map(e => e.textContent.trim().slice(0, 60));
  out.__badge = (() => { const b = document.querySelector('.grecaptcha-badge'); if (!b) return null; const r = b.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), style: b.getAttribute('style') }; })();
  return out;
}, [SEL, PROPS]);
const scrollAll = async () => { const h = await page.evaluate(() => document.documentElement.scrollHeight); for (let y = 0; y < h + 900; y += 400) { await page.evaluate(y => window.scrollTo(0, y), y); await page.waitForTimeout(100); } await page.waitForTimeout(1000); await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(600); };
await scrollAll();
const g1440 = await geometry();
const badgeShot = async (w) => { const bd = g1440.__badge || await page.evaluate(() => { const b = document.querySelector('.grecaptcha-badge'); if (!b) return null; const r = b.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; }); if (!bd) return null; const vw = page.viewportSize(); const x = Math.max(0, bd.x), y = Math.max(0, bd.y); const cw = Math.min(bd.w, vw.width - x), ch = Math.min(bd.h, vw.height - y); const f = `${OUT}/recaptcha-badge-${w}.png`; await page.screenshot({ path: f, clip: { x, y, width: cw, height: ch } }); return { file: `assets/media/recaptcha-badge-${w}.png`, x, y, w: cw, h: ch, viewport: vw }; };
const badge1440 = await badgeShot(1440);
const cssUrls = await page.evaluate(() => { const s = new Set(); for (const el of document.querySelectorAll('*')) { const bg = getComputedStyle(el).backgroundImage; if (bg && bg !== 'none') for (const m of bg.matchAll(/url\("?([^")]+)"?\)/g)) s.add(m[1]); } return [...s]; });
const cur1440 = await page.evaluate(() => [...document.querySelectorAll('img')].map(i => ({ src: i.getAttribute('src'), cur: i.currentSrc, w: Math.round(i.getBoundingClientRect().width), h: Math.round(i.getBoundingClientRect().height), alt: i.alt })));
// sticky behaviour probe at 1440: scroll 600 and read the sticky-anchor classes/position
await page.evaluate(() => window.scrollTo(0, 600)); await page.waitForTimeout(600);
const sticky1440 = await page.evaluate(() => { const e = document.querySelector('.sticky-anchor'); const h = document.querySelector('.amag-header'); return { cls: e?.className, top: e && getComputedStyle(e).top, pos: e && getComputedStyle(e).position, rectY: e && Math.round(e.getBoundingClientRect().y), headerCls: h?.className, headerTop: h && h.style.top }; });
await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(400);
await page.setViewportSize({ width: 360, height: 800 }); await page.waitForTimeout(1500); await scrollAll();
const g360 = await geometry();
const badge360 = await (async () => { const bd = g360.__badge; if (!bd) return null; const vw = page.viewportSize(); const x = Math.max(0, bd.x), y = Math.max(0, bd.y); const cw = Math.min(bd.w, vw.width - x), ch = Math.min(bd.h, vw.height - y); const f = `${OUT}/recaptcha-badge-360.png`; await page.screenshot({ path: f, clip: { x, y, width: cw, height: ch } }); return { file: 'assets/media/recaptcha-badge-360.png', x, y, w: cw, h: ch, viewport: vw }; })();
const cur360 = await page.evaluate(() => [...document.querySelectorAll('img')].map(i => ({ src: i.getAttribute('src'), cur: i.currentSrc, w: Math.round(i.getBoundingClientRect().width), h: Math.round(i.getBoundingClientRect().height), alt: i.alt })));
await page.evaluate(() => window.scrollTo(0, 400)); await page.waitForTimeout(600);
const sticky360 = await page.evaluate(() => { const e = document.querySelector('.sticky-anchor'); return { cls: e?.className, top: e && getComputedStyle(e).top, pos: e && getComputedStyle(e).position, rectY: e && Math.round(e.getBoundingClientRect().y) }; });
await page.waitForTimeout(1500);
const want = new Set([...cssUrls, ...cur1440.map(x => x.cur), ...cur360.map(x => x.cur)].filter(u => u && /^https?:/.test(u) && !map[u] && !u.startsWith('data:')));
for (const u of want) { if (prior[u] && fs.existsSync(path.join('stardust/prototypes', prior[u]))) { map[u] = prior[u]; reused++; continue; } try { const res = await page.evaluate(async (u) => { const r = await fetch(u, { credentials: 'include' }); if (!r.ok) return null; const ct = r.headers.get('content-type') || ''; const ab = await r.arrayBuffer(); return { ct, b64: btoa(String.fromCharCode(...new Uint8Array(ab))) }; }, u); if (res) save(u, res.ct, Buffer.from(res.b64, 'base64')); } catch (e) { console.log('fetch-miss', u, e.message); } }
fs.writeFileSync(MAP, JSON.stringify(map, null, 1));
fs.writeFileSync(N + `${SLUG}-live-geometry.json`, JSON.stringify({ '1440': g1440, '360': g360, sticky1440, sticky360, badge1440, badge360, cssUrls, cur1440, cur360, status, title }, null, 1));
console.log('status', status, 'title', title, '| saved', saved, 'reused', reused, 'map', Object.keys(map).length, '| cssUrls', cssUrls.length, '| docH', g1440.__docH, g360.__docH, '| badge', JSON.stringify(badge1440), JSON.stringify(badge360), '| sticky', JSON.stringify(sticky1440), JSON.stringify(sticky360));
await b.close();
