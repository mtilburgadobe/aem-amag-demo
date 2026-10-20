/* eslint-disable */
/* global WebImporter */

/**
 * Parser: service-offer (block table "service-offer").
 * Source: https://www.amag.ch/de/service.html — `.amag-serviceOffer` (section 2, grey
 * appointment strip "Termin vereinbaren" -> https://www.amag.ch/de/service/otv.html).
 *
 * Authoring row (blocks/service-offer/service-offer.js, cells read by role) — as on
 * /en/services: ONE row, ONE cell:
 *   <p><a href>headline</a></p><p>sub line</p><img icon>
 * The whole strip is one link on the source (`a.amag-serviceOffer__content`); its href goes on
 * the headline link (the block makes the strip that link again).
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

export default function parse(element, { document }) {
  const link = element.querySelector('a.amag-serviceOffer__content[href]') || element.querySelector('a[href]');
  const headline = txt(element.querySelector('.amag-serviceOffer__text_headline'));
  const sub = txt(element.querySelector('.amag-serviceOffer__text_price'));
  const icon = toImg(element.querySelector('.amag-serviceOffer__icon img') || element.querySelector('img'), document);

  if (!headline && !sub) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cell = [];
  if (headline) {
    if (link) {
      const a = mk(document, 'a', headline);
      a.setAttribute('href', link.getAttribute('href'));
      cell.push(mk(document, 'p', a));
    } else cell.push(mk(document, 'p', headline));
  }
  if (sub) cell.push(mk(document, 'p', sub));
  if (icon) cell.push(icon);

  const block = WebImporter.Blocks.createBlock(document, { name: 'service-offer', cells: [[cell]] });
  element.replaceWith(block);
}
