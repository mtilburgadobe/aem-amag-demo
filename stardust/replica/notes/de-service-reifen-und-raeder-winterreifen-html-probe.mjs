// Local probe of the prototype: which visible elements intersect the right 20px of a 360 viewport (the blue text peeking in on the
// 360 gate crops), plus the box/transform of the mobile-nav drawer and the direct-entry parts. No live hit.
import { chromium } from 'playwright';
const url = process.argv[2] || 'http://localhost:8791/de-service-reifen-und-raeder-winterreifen-html-proposed.html';
const width = +(process.argv[3] || 360);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width, height: 800 } });
await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(800);
await p.evaluate(() => window.scrollTo(0, 6000)); await p.waitForTimeout(600);
const r = await p.evaluate((W) => {
  const out = [];
  for (const e of document.querySelectorAll('body *')) {
    if (e.children.length) continue; const t = (e.textContent || '').trim(); if (!t) continue;
    const bb = e.getBoundingClientRect(); if (bb.width === 0 || bb.height === 0) continue;
    if (bb.right <= W - 20 || bb.left >= W + 400 || bb.bottom < 0 || bb.top > 800) continue;
    const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || cs.opacity === '0') continue;
    let a = e, hiddenAnc = null; while (a && a !== document.body) { const c = getComputedStyle(a); if (c.display === 'none' || c.visibility === 'hidden' || c.opacity === '0') { hiddenAnc = a.className; break; } a = a.parentElement; }
    if (hiddenAnc) continue;
    const anc = []; a = e; for (let i = 0; i < 6 && a && a !== document.body; i++) { anc.push((a.tagName.toLowerCase()) + (a.className && typeof a.className === 'string' ? '.' + a.className.split(/\s+/).slice(0, 2).join('.') : '')); a = a.parentElement; }
    out.push({ t: t.slice(0, 30), x: Math.round(bb.left), y: Math.round(bb.top), w: Math.round(bb.width), color: cs.color, anc: anc.join(' < ') });
  }
  const box = (s) => { const e = document.querySelector(s); if (!e) return null; const bb = e.getBoundingClientRect(); const c = getComputedStyle(e); return { x: Math.round(bb.left), y: Math.round(bb.top), w: Math.round(bb.width), h: Math.round(bb.height), display: c.display, pos: c.position, transform: c.transform, right: c.right, left: c.left, overflow: c.overflow, vis: c.visibility, opacity: c.opacity }; };
  return { out: out.slice(0, 25), drawer: box('.amag-header__overlay') || box('.amag-header__navbar-collapse') || box('.amag-mobile-nav'), header: box('#header'), amagHeader: box('.amag-header'), popup: box('.amag-direct-entry__pop-up'), close: box('.amag-direct-entry__button--close'), html: { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, bodyOverflowX: getComputedStyle(document.body).overflowX, htmlOverflowX: getComputedStyle(document.documentElement).overflowX } };
}, width);
console.log(JSON.stringify(r, null, 1));
await b.close();
