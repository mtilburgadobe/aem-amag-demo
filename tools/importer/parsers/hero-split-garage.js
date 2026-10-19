/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-split-garage (block table "Hero Split Garage").
 * Source: https://www.amag.ch/de/garagenuebersicht/garage-buelach.html — `.amag-introGarageWithSlider`.
 *
 * Authoring rows (blocks/hero-split-garage/hero-split-garage.js, read by role):
 *   1. images:  one cell, the slider images in order (each <p><img></p>)
 *   2. text:    <h1> + lead <p>
 *   3. brands:  one cell per brand list — <p>VERKAUF</p><p><img logo></p> | <p>SERVICE</p><p><img></p>
 *   4. links:   <p><img star>Als meine Garage speichern</p>  (no link → inert icon label)
 *               <p><a href=ansprechpartner><img team>Team kontaktieren</a></p>  (icon text link)
 *   5. CTA:     <p><strong><a href=otv><img calendar>Termin online vereinbaren</a></strong></p>
 *
 * The breadcrumb (`.amag-introGarageWithSlider__breadcrumbs`, or the Breadcrumb block table
 * if the breadcrumb parser already ran) sits INSIDE the hero on the source; it is moved in
 * front of this block so the block adopts it (the documented composition).
 *
 * Dropped (block re-creates it / not content): slider arrows, "1 / 6" counter + indicators,
 * the duplicate mobile CTA, the hidden "unfavourite" state label, empty image captions,
 * the Google rating iframe badge and the share button.
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
// <img>/<picture>/<svg> (or a wrapper holding one) -> plain <img> with an absolute src.
function toImg(node, document, alt) {
  if (!node) return null;
  let src = '';
  let a = alt;
  const svg = node.localName === 'svg' ? node : null;
  const img = svg ? null : (node.localName === 'img' ? node : node.querySelector('img'));
  if (svg) src = svgDataUri(svg);
  else if (img) {
    src = abs(img.getAttribute('src') || img.getAttribute('data-src'));
    if (a == null) a = img.getAttribute('alt') || '';
  } else {
    const inner = node.querySelector('svg');
    if (inner) src = svgDataUri(inner);
  }
  if (!src) return null;
  const out = document.createElement('img');
  out.setAttribute('src', src);
  out.setAttribute('alt', (a || '').trim());
  return out;
}
const mk = (document, tag, ...kids) => {
  const e = document.createElement(tag);
  kids.flat().forEach((k) => { if (k != null && k !== '') e.append(k); });
  return e;
};
const iconOf = (n) => (n ? n.querySelector(':scope > img, :scope > svg, img, svg') : null);

export default function parse(element, { document }) {
  // Breadcrumb: raw source or an already-created Breadcrumb block table.
  const crumb = element.querySelector('.amag-introGarageWithSlider__breadcrumbs')
    || element.querySelector('table');
  if (crumb) element.before(crumb);

  const cells = [];

  // 1. Slider images (validated: .cmp-carousel__item img.amag-introGarageWithSliderImage__img).
  let slides = [...element.querySelectorAll('.cmp-carousel__item img.amag-introGarageWithSliderImage__img')];
  if (!slides.length) slides = [...element.querySelectorAll('.amag-introGarageWithSlider__carousel img, .cmp-carousel__item picture img')];
  const slideCell = slides.map((img) => toImg(img, document)).filter(Boolean).map((i) => mk(document, 'p', i));
  if (slideCell.length) cells.push([slideCell]);

  // 2. Headline + lead.
  const h1 = element.querySelector('h1, .amag-introGarageWithSlider__title');
  const lead = [...element.querySelectorAll('.amag-introGarageWithSlider__infoText')];
  const textCell = [];
  if (h1) textCell.push(mk(document, 'h1', txt(h1)));
  lead.forEach((p) => { if (txt(p)) textCell.push(mk(document, 'p', txt(p))); });
  if (textCell.length) cells.push([textCell]);

  // 3. Brand lists — one cell per list.
  let lists = [...element.querySelectorAll('.amag-introGarageWithSlider__brandsSale, .amag-introGarageWithSlider__brandsServices')];
  if (!lists.length) lists = [...element.querySelectorAll('.amag-introGarageWithSlider__brands > div')];
  const brandCells = lists.map((list) => {
    const title = txt(list.querySelector('.amag-introGarageWithSlider__brandListTitle'));
    const logos = [...list.querySelectorAll('img')].map((i) => toImg(i, document)).filter(Boolean);
    if (!title && !logos.length) return null;
    const cell = [];
    if (title) cell.push(mk(document, 'p', title));
    logos.forEach((l) => cell.push(mk(document, 'p', l)));
    return cell;
  }).filter(Boolean);
  if (brandCells.length) cells.push(brandCells);

  // 4. Icon text links: favourite label (visible state only) + team link.
  const linkCell = [];
  const fav = element.querySelector('.amag-garage__favorite')
    || element.querySelector('.amag-introGarageWithSlider__favoriteGarage > span:not(.d-none)');
  if (fav && txt(fav)) linkCell.push(mk(document, 'p', toImg(iconOf(fav), document, ''), txt(fav)));
  element.querySelectorAll('.amag-introGarageWithSlider__linkWrapper a[href]').forEach((a) => {
    const link = mk(document, 'a', toImg(iconOf(a), document, ''), txt(a));
    link.setAttribute('href', a.getAttribute('href'));
    linkCell.push(mk(document, 'p', link));
  });
  if (linkCell.length) cells.push([linkCell]);

  // 5. Appointment CTA — one link, icon inside (desktop + mobile copies are the same CTA).
  const ctaSrc = element.querySelector('.cmp-carousel__actions a.amag-ctaWrapper__button')
    || element.querySelector('a.amag-ctaWrapper__button');
  if (ctaSrc && txt(ctaSrc)) {
    const link = mk(document, 'a', toImg(iconOf(ctaSrc), document, ''), txt(ctaSrc));
    link.setAttribute('href', ctaSrc.getAttribute('href'));
    cells.push([mk(document, 'p', mk(document, 'strong', link))]);
  }

  if (!h1 && !slideCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero Split Garage', cells });
  element.replaceWith(block);
}
