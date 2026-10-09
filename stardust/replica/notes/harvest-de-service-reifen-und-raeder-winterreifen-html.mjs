// Harvest de-service-reifen-und-raeder-winterreifen-html: ONE live page open (1440 then 360). Intercepts the page's own image/SVG
// responses (reusing the four earlier media maps so chrome assets are not re-fetched), dumps live geometry + computed styles of every
// instance of this page's modules at both widths, inline SVGs of the main content, and the currentSrc each <img> resolves to.
import { chromium } from 'playwright';
import fs from 'node:fs'; import path from 'node:path';
const SLUG = 'de-service-reifen-und-raeder-winterreifen-html';
const LIVE = 'https://www.amag.ch/de/service/reifen-und-raeder/winterreifen.html';
const OUT = 'stardust/current/assets/media'; const N = 'stardust/replica/notes/';
const MAP = N + `${SLUG}-media-map.json`;
const map = fs.existsSync(MAP) ? JSON.parse(fs.readFileSync(MAP, 'utf8')) : {};
const prior = {}; for (const f of ['en-html', 'en-services-html', 'en-komponenten-car-dealers-html', 'de-service-auto-services-online-termin-buchen-html']) { const p = N + f + '-media-map.json'; if (fs.existsSync(p)) Object.assign(prior, JSON.parse(fs.readFileSync(p, 'utf8'))); }
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
const SEL = ['#header', '.amag-header', 'div.amag-content', 'div.amag-content > .section', '.amagCh-section', '.amagCh-section__container', '.amagCh-section__stepswrapper-before', '.amag-introService', '.amag-introService__textWrapper', '.amag-introService__breadcrumbs', '.cmp-breadcrumb', '.amag-introService__title', '.amag-introService__otvCta', '.amag-otvCtaWrapper', '.amag-otvCtaWrapper--cookie', '.amag-otvCtaWrapper--noCookie', '.amag-otvCtaWrapper__button', '.amag-introService__ratioWrapper', '.amag-introService__imgWrapper', '.amag-introService__img', '.amag-maxiTeaserBild', '.amag-maxiTeaserBild__container', '.amag-maxiTeaserBild__imgContainer', '.amag-maxiTeaserBild__img', '.amag-maxiTeaserBild__description', '.amag-maxiTeaserBild__topline', '.amag-maxiTeaserBild__headline', '.amag-maxiTeaserBild__text', '.amag-maxiTeaserBild__btn', '.amagCh-section-description', '.amagCh-section-description__headline', '.amagCh-section-description__theme', '.cmp-text', '.cmp-text p', '.cmp-text ul', '.cmp-text li', '.cmp-text h2', '.amag-ctaWrapper__button', '.amag-marginBottom', '.standardTeaser', '.cmp-teaser', '.amag-standardTeaser', '.amag-standardTeaser__content', '.amag-standardTeaser__description', '.amag-standardTeaser__description p', '.amag-standardTeaser__description h5', '.amag-image-text-v2', '.amag-image-text-v2__wrapper', '.amag-image-text-v2__image-wrapper', '.amag-image-text-v2__image', '.amag-image-text-v2__text-wrapper', '.amag-image-text-v2__headline', '.amag-image-text-v2__description', '.amag-image-text-v2__link', '.amag-factBox', '.amag-farbBox', '.amag-farbBox__colorContainer', '.amag-quoteModul', '.amag-quoteModul__qoute', '.amag-quoteModul__author', '.amag-quoteModul__customerBy', '.amag-vorteilsModul', '.amag-vorteilsModul__content', '.amag-vorteilsModul__headline', '.amag-vorteilsModul__subElementHeadline', '.amag-vorteilsModul__subElementCopy', '.amag-iconTextBox', '.amag-iconTextBox__headline', '.amag-iconTextBox__item', '.amag-iconTextBox__item img', '.amag-iconTextBox__item h5', '.amag-iconTextBox__item p', '.amag-textImage', '.amag-textImage__content', '.amag-textImage__image', '.amag-iconListContainer', '.amag-iconListItem', '.amag-iconListItem__iconBox', '.amag-iconListItem__title', '.amag-iconListItem__text', '.amag-kontaktaufnahme', '.amag-kontaktaufnahme__headline', '.amag-kontaktaufnahme__introText', '.amag-garageElectionOverlay__button', '.accordion', '.cmp-accordion', '.cmp-accordion__intro', '.cmp-accordion__headline', '.cmp-accordion__item', '.cmp-accordion__button', '.cmp-accordion__title', '.cmp-accordion__panel', 'footer', '.amag-footer', '.amag-direct-entry', '.amag-direct-entry__button', '.grecaptcha-badge', '.amag-garageOverlay', '.amag-topline', '.amag-hrBreak'];
const PROPS = ['display', 'position', 'top', 'left', 'right', 'bottom', 'width', 'height', 'minHeight', 'maxWidth', 'margin', 'padding', 'backgroundColor', 'backgroundImage', 'color', 'fontFamily', 'fontSize', 'lineHeight', 'fontWeight', 'letterSpacing', 'textAlign', 'textTransform', 'border', 'borderBottom', 'borderRadius', 'boxShadow', 'flexDirection', 'flexWrap', 'alignItems', 'justifyContent', 'order', 'overflow', 'zIndex', 'objectFit', 'opacity', 'visibility', 'boxSizing', 'flex', 'listStyle'];
const geometry = async () => page.evaluate(([SEL, PROPS]) => {
  const out = {};
  for (const s of SEL) { const els = [...document.querySelectorAll(s)]; if (!els.length) { out[s] = null; continue; } out[s] = els.map(e => { const bb = e.getBoundingClientRect(); const cs = getComputedStyle(e); const o = { x: Math.round(bb.x), y: Math.round(bb.y + scrollY), w: Math.round(bb.width), h: Math.round(bb.height), cls: typeof e.className === 'string' ? e.className : e.className.baseVal, hidden: e.hidden, text: e.children.length === 0 ? e.textContent.trim().slice(0, 60) : undefined }; for (const p of PROPS) o[p] = cs[p]; const bef = getComputedStyle(e, '::before'); const aft = getComputedStyle(e, '::after'); if (bef.content && bef.content !== 'none') o.before = { content: bef.content, w: bef.width, h: bef.height, bg: bef.backgroundColor, bgi: bef.backgroundImage, border: bef.border, radius: bef.borderRadius, color: bef.color, display: bef.display, position: bef.position, top: bef.top, left: bef.left, mr: bef.marginRight, transform: bef.transform }; if (aft.content && aft.content !== 'none') o.after = { content: aft.content, w: aft.width, h: aft.height, bg: aft.backgroundColor, bgi: aft.backgroundImage, border: aft.border, position: aft.position, top: aft.top, left: aft.left, bottom: aft.bottom, right: aft.right, transform: aft.transform }; return o; }); }
  out.__docH = document.documentElement.scrollHeight; out.__bodyBg = getComputedStyle(document.body).backgroundColor;
  out.__visibleTexts = [...document.querySelectorAll('div.amag-content *')].filter(e => e.children.length === 0 && e.textContent.trim() && getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().width > 0).map(e => e.textContent.trim().slice(0, 60));
  out.__badge = (() => { const b = document.querySelector('.grecaptcha-badge'); if (!b) return null; const r = b.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), style: b.getAttribute('style') }; })();
  out.__svgs = [...document.querySelectorAll('div.amag-content svg')].map(s => { const r = s.getBoundingClientRect(); return { cls: s.getAttribute('class'), parent: s.parentElement.className, w: Math.round(r.width), h: Math.round(r.height), html: s.outerHTML.slice(0, 4000) }; });
  return out;
}, [SEL, PROPS]);
const scrollAll = async () => { const h = await page.evaluate(() => document.documentElement.scrollHeight); for (let y = 0; y < h + 900; y += 400) { await page.evaluate(y => window.scrollTo(0, y), y); await page.waitForTimeout(100); } await page.waitForTimeout(1000); await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(600); };
await scrollAll();
const g1440 = await geometry();
const cssUrls = await page.evaluate(() => { const s = new Set(); for (const el of document.querySelectorAll('*')) { const bg = getComputedStyle(el).backgroundImage; if (bg && bg !== 'none') for (const m of bg.matchAll(/url\("?([^")]+)"?\)/g)) s.add(m[1]); } return [...s]; });
const curOf = () => page.evaluate(() => [...document.querySelectorAll('img')].map(i => ({ src: i.getAttribute('src'), cur: i.currentSrc, w: Math.round(i.getBoundingClientRect().width), h: Math.round(i.getBoundingClientRect().height), nw: i.naturalWidth, nh: i.naturalHeight, alt: i.alt, loading: i.getAttribute('loading'), cls: i.className })));
const cur1440 = await curOf();
await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(400);
await page.setViewportSize({ width: 360, height: 800 }); await page.waitForTimeout(1500); await scrollAll();
const g360 = await geometry();
const cur360 = await curOf();
await page.waitForTimeout(1500);
const want = new Set([...cssUrls, ...cur1440.map(x => x.cur), ...cur360.map(x => x.cur)].filter(u => u && /^https?:/.test(u) && !map[u] && !u.startsWith('data:')));
for (const u of want) { if (prior[u] && fs.existsSync(path.join('stardust/prototypes', prior[u]))) { map[u] = prior[u]; reused++; continue; } try { const res = await page.evaluate(async (u) => { const r = await fetch(u, { credentials: 'include' }); if (!r.ok) return null; const ct = r.headers.get('content-type') || ''; const ab = await r.arrayBuffer(); return { ct, b64: btoa(String.fromCharCode(...new Uint8Array(ab))) }; }, u); if (res) save(u, res.ct, Buffer.from(res.b64, 'base64')); } catch (e) { console.log('fetch-miss', u, e.message); } }
fs.writeFileSync(MAP, JSON.stringify(map, null, 1));
fs.writeFileSync(N + `${SLUG}-live-geometry.json`, JSON.stringify({ '1440': g1440, '360': g360, cssUrls, cur1440, cur360, status, title }, null, 1));
console.log('status', status, 'title', title, '| saved', saved, 'reused', reused, 'map', Object.keys(map).length, '| cssUrls', cssUrls.length, '| docH', g1440.__docH, g360.__docH, '| badge', JSON.stringify(g1440.__badge), '| visibleTexts', g1440.__visibleTexts.length, g360.__visibleTexts.length, '| svgs', g1440.__svgs.length);
await b.close();
