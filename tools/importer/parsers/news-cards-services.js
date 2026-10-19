/* eslint-disable */
/* global WebImporter */

/**
 * Parser: news-cards-services (block table "News Cards Services").
 * Source: https://www.amag.ch/de/garagenuebersicht/garage-buelach.html — section 9
 * `section.section:has(.amag-serviceContainerWrapper) .cmp-carousel` ("Weitere Services", 7 boxes).
 *
 * Default content: the carousel head sits INSIDE the instance (`.amagCh-carousel-head`):
 * <h4> "Weitere Services bei der Garage AMAG Bülach" + subtext — moved in front of the block
 * as <h4> + <p> (the block reabsorbs them — EW8).
 *
 * Authoring rows (blocks/news-cards-services/news-cards-services.js) — ONE ROW PER BOX:
 *   <p><img icon></p> | <h3>AMAG Carwash</h3><p>text</p><p><a href>Zur Autowäsche</a></p>
 * Iteration: `.cmp-carousel__item` wrappers -> `.amag-serviceBoxWrapper`.
 * Dropped: prev/next arrows, "1 / 7" counter, indicator dots and the hidden indicator labels
 * (`ol.cmp-carousel__indicators.d-none`) — derived/re-created by the block.
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
  // Carousel head -> default content.
  const head = [];
  const h4 = element.querySelector('.amagCh-carousel-description__headline');
  const sub = element.querySelector('.amagCh-carousel-description__subtext');
  if (h4 && txt(h4)) head.push(mk(document, 'h4', txt(h4)));
  if (sub && txt(sub)) head.push(mk(document, 'p', txt(sub)));

  let boxes = [...element.querySelectorAll('.cmp-carousel__item .amag-serviceBoxWrapper')];
  if (!boxes.length) boxes = [...element.querySelectorAll('.amag-serviceBoxWrapper')];

  const cells = [];
  boxes.forEach((box) => {
    const icon = toImg(box.querySelector('.amag-serviceBoxWrapper__content--image, img'), document);
    const title = txt(box.querySelector('.amag-serviceBoxWrapper__content--headline'));
    const lines = [...box.querySelectorAll('.amag-serviceBoxWrapper__content--textarea p')].map(txt).filter(Boolean);
    const linkSrc = box.querySelector('.amag-serviceBoxWrapper__content--link a[href]');
    const text = [];
    if (title) text.push(mk(document, 'h3', title));
    lines.forEach((l) => text.push(mk(document, 'p', l)));
    if (linkSrc && txt(linkSrc)) {
      const a = mk(document, 'a', txt(linkSrc));
      a.setAttribute('href', linkSrc.getAttribute('href'));
      text.push(mk(document, 'p', a));
    }
    if (!text.length) return;
    cells.push([icon ? mk(document, 'p', icon) : '', text]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'News Cards Services', cells });
  head.forEach((n) => element.before(n));
  element.replaceWith(block);
}
