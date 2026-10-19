/* eslint-disable */
/* global WebImporter */

/**
 * Parser: icon-text-box (block table "Icon Text Box").
 * Source: https://www.amag.ch/de/garagenuebersicht/garage-buelach.html — `.amag-iconListContainer`
 * in panel 2 (section 14) and panel 3 (section 17): 4 icon + label items each, no headline.
 *
 * Authoring rows (blocks/icon-text-box/icon-text-box.js) — ONE ROW PER ITEM:
 *   <p><img icon></p> | <h5>Notdienst 24 h</h5>
 * (a leading heading-only row would be the box headline — the source has none).
 * Iteration: `.amag-iconLabel` items. The source icon alt is the DAM path of the icon
 * (not a description), so a path-like alt is emptied.
 * Dropped: the decorative `hr.amag-iconListContainer__break`.
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
function svgDataUri(svg) {
  const s = new XMLSerializer().serializeToString(svg);
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(s)))}`;
}
function toImg(node, document) {
  if (!node) return null;
  let src = '';
  let alt = '';
  if (node.localName === 'svg') src = svgDataUri(node);
  else {
    src = abs(node.getAttribute('src') || node.getAttribute('data-src'));
    alt = (node.getAttribute('alt') || '').trim();
    if (/^(\/|https?:)/.test(alt) || /\.(svg|png|jpe?g|gif|webp)$/i.test(alt)) alt = '';
  }
  if (!src) return null;
  const out = document.createElement('img');
  out.setAttribute('src', src);
  out.setAttribute('alt', alt);
  return out;
}
const mk = (document, tag, ...kids) => {
  const e = document.createElement(tag);
  kids.flat().forEach((k) => { if (k != null && k !== '') e.append(k); });
  return e;
};

export default function parse(element, { document }) {
  const cells = [];

  // Optional box headline (none on the garage page).
  const headline = element.querySelector('.amag-iconListContainer__headline h2, .amag-iconListContainer__headline h3');
  if (headline && txt(headline)) cells.push([mk(document, 'h2', txt(headline))]);

  let items = [...element.querySelectorAll('.amag-iconLabel')];
  if (!items.length) items = [...element.querySelectorAll('.amag-iconListItem')];
  items.forEach((item) => {
    const icon = toImg(item.querySelector('img.amag-iconLabel__icon, img, svg'), document);
    const label = txt(item.querySelector('.amag-iconLabel__text, .amag-iconListItem__title, p'));
    if (!label && !icon) return;
    const link = item.querySelector('a[href]');
    let title = mk(document, 'h5', label);
    if (link && label) {
      const a = mk(document, 'a', label);
      a.setAttribute('href', link.getAttribute('href'));
      title = mk(document, 'h5', a);
    }
    cells.push([icon ? mk(document, 'p', icon) : '', title]);
  });

  if (!items.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Icon Text Box', cells });
  element.replaceWith(block);
}
