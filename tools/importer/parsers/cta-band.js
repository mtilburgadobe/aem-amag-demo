/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cta-band (block table "cta-band").
 * Source: https://www.amag.ch/de/service.html — `.amag-kontaktaufnahme` (section 5 contact band
 * "Haben Sie weitere Fragen?").
 *
 * Authoring row (blocks/cta-band/cta-band.js, cells read by role) — as on /en/services: ONE
 * row, ONE cell:
 *   <h2>headline</h2><p>intro</p><p><a href="/de/service#garage-chooser"><img icon></a><strong>label</strong></p>
 * The CTA opens the page's garage chooser on the source (Bootstrap modal); the block opens the
 * Garage Chooser block from any `a[href$="#garage-chooser"]`, so the button href is authored as
 * the page path + that hash (a bare hash is stored as "/" by Document Authoring; icon-only link
 * + label beside it; the block moves the label into the link).
 * The chooser modal itself is the garage-chooser parser's instance (parsed first and moved to
 * section 7); a leftover `.amag-garageOverlay` is ignored here. The cookie variant of the button
 * (`.amag-garageOverlay--cookie`) is removed by amag-cleanup and ignored here as well.
 */
const ORIGIN = 'https://www.amag.ch';
const txt = (n) => (n ? n.textContent.replace(/\s+/g, ' ').trim() : '');
const abs = (u) => {
  if (!u) return '';
  const s = u.trim();
  if (/^(data:|https?:)/i.test(s)) return s;
  if (s.startsWith('//')) return `https:${s}`;
  try { return new URL(s, `${ORIGIN}/`).href; } catch (e) { return s; }
};
function toImg(img, document) {
  if (!img) return null;
  const src = abs(img.getAttribute('src') || img.getAttribute('data-src'));
  if (!src || src.startsWith('data:')) return null;
  const out = document.createElement('img');
  out.setAttribute('src', src);
  out.setAttribute('alt', (img.getAttribute('alt') || '').trim());
  return out;
}
const mk = (document, tag, ...kids) => {
  const e = document.createElement(tag);
  kids.flat().forEach((k) => { if (k != null && k !== '') e.append(k); });
  return e;
};
const outside = (n) => !n.closest('.amag-garageOverlay, .amag-garageOverlay--cookie, table');

// the page's own path + hash: a hash-only href does not survive the Document Authoring upload
// (it is stored as "/"), and the block only checks the `#garage-chooser` ending
function chooserHref(params) {
  try {
    const path = new URL(params.originalURL).pathname.replace(/\.html?$/, '');
    return `${path}#garage-chooser`;
  } catch (e) {
    return '#garage-chooser';
  }
}

export default function parse(element, { document, params = {} }) {
  const cell = [];

  const h = element.querySelector('.amag-kontaktaufnahme__headline h2, .amag-kontaktaufnahme__headline h3')
    || [...element.querySelectorAll('h2, h3')].find(outside);
  if (h && txt(h)) cell.push(mk(document, /^h[23]$/.test(h.localName) ? h.localName : 'h2', txt(h)));

  element.querySelectorAll('.amag-kontaktaufnahme__introText p').forEach((p) => {
    if (txt(p)) cell.push(mk(document, 'p', txt(p)));
  });
  if (!element.querySelector('.amag-kontaktaufnahme__introText p')) {
    const intro = txt(element.querySelector('.amag-kontaktaufnahme__introText'));
    if (intro) cell.push(mk(document, 'p', intro));
  }

  const buttons = [...element.querySelectorAll('.amag-garageElectionOverlay a.amag-ctaWrapper__button, a.amag-ctaWrapper__button')]
    .filter(outside);
  const btn = buttons.find((b) => b.closest('.amag-garageOverlay--noCookie')) || buttons[0];
  if (btn && txt(btn)) {
    const a = mk(document, 'a', toImg(btn.querySelector('img'), document));
    a.setAttribute('href', chooserHref(params));
    cell.push(mk(document, 'p', a, mk(document, 'strong', txt(btn))));
  }

  if (!h && !btn) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cta-band', cells: [[cell]] });
  element.replaceWith(block);
}
