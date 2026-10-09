// One-off layout probe of the prototype (no live hit): overflow culprits, document height, first-pane child boxes.
import { chromium } from 'playwright';
const PROTO = 'http://localhost:8791/de-service-auto-services-online-termin-buchen-html-proposed.html';
const w = +(process.argv[2] || 1440);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: w, height: 900 } });
await p.goto(PROTO, { waitUntil: 'load' }); await p.waitForTimeout(800);
const r = await p.evaluate((w) => {
  const box = (e) => { const r = e.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y + scrollY), Math.round(r.width), Math.round(r.height)].join(','); };
  const sel = (e) => e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).slice(0, 3).join('.') : '');
  const wide = [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return r.right > w + 1 && getComputedStyle(e).display !== 'none'; }).map(e => ({ s: sel(e), b: box(e), pos: getComputedStyle(e).position })).slice(0, 14);
  const pane = document.querySelector('#otv-tab--1-content');
  const kids = pane ? [...pane.querySelector('.d-flex').children].map(e => ({ s: sel(e), b: box(e), d: getComputedStyle(e).display, fw: getComputedStyle(e.parentElement).flexWrap })) : null;
  const html = document.documentElement, body = document.body;
  return { scrollH: html.scrollHeight, scrollW: html.scrollWidth, htmlH: getComputedStyle(html).height, htmlOv: getComputedStyle(html).overflow, bodyH: getComputedStyle(body).height, bodyOv: getComputedStyle(body).overflow, bodyCls: body.className, footers: [...document.querySelectorAll('footer')].map(e => sel(e) + ' ' + box(e)), wide, kids, otv: box(document.querySelector('#amag-otv')), content: box(document.querySelector('div.amag-content')) };
}, w);
console.log(JSON.stringify(r, null, 1));
await b.close();
