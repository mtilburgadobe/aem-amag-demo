/* eslint-disable */
/* global WebImporter */
import { knownIconSrc } from '../known-icons.js';

/**
 * Parser: pledge-row (block table "Pledge Row").
 * Source: https://www.amag.ch/de/garagenuebersicht/garage-buelach.html — two instances:
 *   1. section 7 (panel 1) `.amag-iconListContainer:has(.amag-iconListItem)` — "Unser AMAG
 *      Versprechen": class `plain-head`; its <h2> sits INSIDE the instance
 *      (`.amag-iconListContainer__headline h2`) and is moved in front of the block as default
 *      content (the block reabsorbs it — EW8).
 *   2. section 19 (panel 3) `.amag-locationFacilitiesWrapper` — "Unsere Ausstattung": no class;
 *      its eyebrow + <h2> are outside the instance and stay default content.
 * Source: https://www.amag.ch/de.html — one instance, section 10 (`#versprechen`)
 *   `.amag-iconListContainer:has(.amag-iconListItem)` — "Unser AMAG Versprechen": same markup as
 *   the garage section-7 list, so the same rule applies (class `plain-head`, inner <h2> moved
 *   before the block). The class is keyed on the instance being an `.amag-iconListContainer`
 *   (or holding its headline), never on the page — `.amag-locationFacilitiesWrapper` stays plain.
 *
 * Authoring rows (blocks/pledge-row/pledge-row.js) — ONE ROW PER PILLAR:
 *   <p><img icon></p> | <p><strong>title</strong></p><ul><li>line</li>…</ul>
 * Icons: section 7 renders inline <svg> (-> published media file via ../known-icons.js, else
 *   <img src="data:image/svg+xml…">), section 19 <img>.
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
  // known icons point at their public file: a data: URI is lost on the DA upload
  const known = knownIconSrc(svg);
  if (known) return known;
  const s = new XMLSerializer().serializeToString(svg);
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(s)))}`;
}
function toImg(node, document, alt) {
  if (!node) return null;
  let src = '';
  let a = alt;
  if (node.localName === 'svg') src = svgDataUri(node);
  else {
    const img = node.localName === 'img' ? node : node.querySelector('img');
    if (img) {
      src = abs(img.getAttribute('src') || img.getAttribute('data-src'));
      if (a == null) a = img.getAttribute('alt') || '';
    } else if (node.querySelector('svg')) src = svgDataUri(node.querySelector('svg'));
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

export default function parse(element, { document }) {
  const isPledgeList = element.classList.contains('amag-iconListContainer')
    || !!element.querySelector('.amag-iconListContainer__headline');

  // Section-7 head (inside the instance) -> default content before the block.
  const head = [];
  const h2 = element.querySelector('.amag-iconListContainer__headline h2, .amag-iconListContainer__headline h3');
  if (h2 && txt(h2)) head.push(mk(document, 'h2', txt(h2)));

  const items = [...element.querySelectorAll('.amag-iconListItem')];
  const cells = [];
  items.forEach((item) => {
    const iconBox = item.querySelector('.amag-iconListItem__iconBox') || item;
    const icon = toImg(iconBox.querySelector('img, svg'), document, '');
    const title = txt(item.querySelector('.amag-iconListItem__title'));
    let lines = [...item.querySelectorAll('.amag-iconListItem__text li')].map(txt).filter(Boolean);
    if (!lines.length) lines = [...item.querySelectorAll('.amag-iconListItem__text p')].map(txt).filter(Boolean);
    if (!title && !lines.length) return;
    const text = [];
    if (title) text.push(mk(document, 'p', mk(document, 'strong', title)));
    if (lines.length) text.push(mk(document, 'ul', lines.map((l) => mk(document, 'li', l))));
    cells.push([icon ? mk(document, 'p', icon) : '', text]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const name = isPledgeList ? 'Pledge Row (plain-head)' : 'Pledge Row';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  head.forEach((n) => element.before(n));
  element.replaceWith(block);
}
