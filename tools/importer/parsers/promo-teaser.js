/* eslint-disable */
/* global WebImporter */

/**
 * Parser: promo-teaser (block table "Promo Teaser (image-left, band-grey)").
 * Source: https://www.amag.ch/de/garagenuebersicht/garage-buelach.html — `.amag-image-text-v2`
 * (section 16, newsletter teaser; the top band continues the grey of section 15 -> `band-grey`,
 * image column on the left -> `image-left`).
 *
 * Authoring rows (blocks/promo-teaser/promo-teaser.js) — ONE ROW PER CARD, read by role:
 *   <p><img image></p> | <h3>headline</h3><p>description</p><p><a href>text link</a></p>
 * (the headline keeps its authored tag — h3 on the source; the link is the block's text link).
 * Variant classes: `image-left` when the source wrapper is `--imageLeft`, always `band-grey`
 * on this template.
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
  let cards = [...element.querySelectorAll('article.amag-image-text-v2__wrapper')];
  if (!cards.length) cards = [element];

  const cells = [];
  let imageLeft = false;
  cards.forEach((card) => {
    if (/--imageLeft/.test(card.className || '')) imageLeft = true;
    const image = toImg(card.querySelector('.amag-image-text-v2__image-wrapper img, picture img'), document);
    const h = card.querySelector('.amag-image-text-v2__headline, h2, h3');
    const content = [];
    if (h && txt(h)) content.push(mk(document, /^h2$/i.test(h.tagName) ? 'h2' : 'h3', txt(h)));
    const desc = card.querySelector('.amag-image-text-v2__description');
    if (desc) {
      const ps = [...desc.querySelectorAll('p, li')].map(txt).filter(Boolean);
      (ps.length ? ps : [txt(desc)].filter(Boolean)).forEach((p) => content.push(mk(document, 'p', p)));
    }
    const link = card.querySelector('a.amag-image-text-v2__link[href]');
    if (link && txt(link)) {
      const a = mk(document, 'a', txt(link));
      a.setAttribute('href', link.getAttribute('href'));
      content.push(mk(document, 'p', a));
    }
    if (!content.length && !image) return;
    cells.push([image ? mk(document, 'p', image) : '', content]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const variants = [imageLeft ? 'image-left' : '', 'band-grey'].filter(Boolean).join(', ');
  const block = WebImporter.Blocks.createBlock(document, { name: `Promo Teaser (${variants})`, cells });
  element.replaceWith(block);
}
