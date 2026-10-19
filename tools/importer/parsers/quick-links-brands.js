/* eslint-disable */
/* global WebImporter */

/**
 * Parser: quick-links-brands (block table "Quick Links Brands").
 * Source: https://www.amag.ch/de/garagenuebersicht/garage-buelach.html — `.amag-brandIntroductionWrapper`
 * (section 8 "Alle Fahrzeuge der AMAG Garagen", 7 brand tiles).
 *
 * The section head (eyebrow + <h2>) is outside the instance and stays default content.
 *
 * Authoring rows (blocks/quick-links-brands/quick-links-brands.js) — ONE ROW PER TILE:
 *   <p><img brand logo></p> | <p><a href>Angebote anzeigen</a></p>
 * On the source the logo is wrapped in its own <a> (same href as the text link); the block
 * wants the logo OUTSIDE the link (it stretches the text link over the tile), so the logo is
 * authored as a plain image and the text link is the single tile link.
 *
 * Iteration is keyed on `.amag-brandIntroductionWrapper__colWrapper` (block wrappers), not on
 * the anchors.
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
  if (!src) return null;
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
  let tiles = [...element.querySelectorAll('.amag-brandIntroductionWrapper__colWrapper')];
  if (!tiles.length) tiles = [...element.querySelectorAll('.amag-brandIntroductionWrapper__content')];

  const cells = [];
  tiles.forEach((tile) => {
    const logo = toImg(tile.querySelector('.amag-brandIntroductionWrapper__box img, img'), document);
    const textLink = tile.querySelector('.amag-brandIntroductionWrapper__text a[href]')
      || [...tile.querySelectorAll('a[href]')].find((a) => txt(a));
    if (!logo && !textLink) return;
    const linkCell = [];
    if (textLink && txt(textLink)) {
      const a = mk(document, 'a', txt(textLink));
      a.setAttribute('href', textLink.getAttribute('href'));
      linkCell.push(mk(document, 'p', a));
    }
    cells.push([logo ? mk(document, 'p', logo) : '', linkCell]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Quick Links Brands', cells });
  element.replaceWith(block);
}
