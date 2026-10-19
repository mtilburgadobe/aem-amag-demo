/* eslint-disable */
/* global WebImporter */

/**
 * Parser: icon-feature-grid (block table "Icon Feature Grid").
 * Source: https://www.amag.ch/de/garagenuebersicht/garage-buelach.html — `.amag-serviceContainerWrapper`
 * (section 9 "Die gefragtesten Auto-Serviceleistungen", 3 service boxes + CTA).
 *
 * The section head (eyebrow, <h2>, lede) is outside the instance and stays default content.
 *
 * Authoring rows (blocks/icon-feature-grid/icon-feature-grid.js, read by role):
 *   - band image row:  <p><img 1440x400></p>
 *   - box rows:        <p><img icon></p> | <p><strong>title</strong></p><p>line</p>…
 *                      <p><a href>Zum Autoservice</a></p>   (underlined text link, not a button)
 *   - CTA row:         <p><strong><a href><img icon>Service-Termin Bülach</a></strong></p>
 *                      (one link, icon inside — the block keeps an icon already in the link)
 * Iteration: `.amag-serviceBoxWrapper` boxes.
 * Dropped: the mobile "1 / 3" counter (derived by the block).
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
  const cells = [];

  // Band image.
  const band = toImg(element.querySelector('.amag-serviceContainerWrapper__image img'), document);
  if (band) cells.push([mk(document, 'p', band)]);

  // Boxes.
  let boxes = [...element.querySelectorAll('.amag-serviceContainerWrapper__serviceBox .amag-serviceBoxWrapper')];
  if (!boxes.length) boxes = [...element.querySelectorAll('.amag-serviceBoxWrapper')];
  boxes.forEach((box) => {
    const icon = toImg(box.querySelector('.amag-serviceBoxWrapper__content--image, img, svg'), document);
    const title = txt(box.querySelector('.amag-serviceBoxWrapper__content--headline'));
    const lines = [...box.querySelectorAll('.amag-serviceBoxWrapper__content--textarea p')].map(txt).filter(Boolean);
    const linkSrc = box.querySelector('.amag-serviceBoxWrapper__content--link a[href]');
    const text = [];
    if (title) text.push(mk(document, 'p', mk(document, 'strong', title)));
    lines.forEach((l) => text.push(mk(document, 'p', l)));
    if (linkSrc && txt(linkSrc)) {
      const a = mk(document, 'a', txt(linkSrc));
      a.setAttribute('href', linkSrc.getAttribute('href'));
      text.push(mk(document, 'p', a));
    }
    if (!text.length) return;
    cells.push([icon ? mk(document, 'p', icon) : '', text]);
  });

  // Primary CTA.
  const ctaSrc = element.querySelector('.amag-serviceContainerWrapper__ctaButton a[href]');
  if (ctaSrc && txt(ctaSrc)) {
    const a = mk(document, 'a', toImg(ctaSrc.querySelector('img, svg'), document, ''), txt(ctaSrc));
    a.setAttribute('href', ctaSrc.getAttribute('href'));
    cells.push([mk(document, 'p', mk(document, 'strong', a))]);
  }

  if (!boxes.length && !band) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Icon Feature Grid', cells });
  element.replaceWith(block);
}
