/* eslint-disable */
/* global WebImporter */

/**
 * Parser: news-cards (block table "News Cards").
 * Source: https://www.amag.ch/de/garagenuebersicht/garage-buelach.html — `.amag-promotionTeaserBox`
 * (section 4 "NEWS und ANGEBOTE", 12 promotion tiles).
 *
 * Section head: the eyebrow <p> ("AMAG NEWS") and <h2> ("NEWS und ANGEBOTE") sit INSIDE the
 * instance on the source; per the block (head = DEFAULT CONTENT before the block, reabsorbed)
 * they are moved in front of the block table.
 *
 * Authoring rows (blocks/news-cards/news-cards.js) — ONE ROW PER TILE, three cells:
 *   <p><img 2:1 image></p>[<p><img AMAG badge></p>] |
 *   <p>topline</p><h3>title</h3><p>copy</p><p><a href>button label</a></p> |
 *   <p>colour word</p>   (green | dark-grey | violet | light-blue | dark-blue | black)
 * Trailing row: <p>Mehr anzeigen</p> — the documented "Show more" label row.
 *
 * Iteration is keyed on the `div.amag-promotionTeaser` column wrappers (NOT the tile <a>,
 * which wraps block content and is a known html2md merge trap); the href is read from the
 * tile anchor inside each wrapper.
 * Colour: the tile ground is an inline `background-color` on `.amag-promotionTeaser__wrapper`;
 * hex values are mapped onto the block's colour words (styles.css tokens). A colour with no
 * block equivalent (e.g. Audi red #e2001a) leaves the cell empty → block default ground.
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

const COLOURS = {
  '#006431': 'green',
  '#222222': 'dark-grey',
  '#801977': 'violet',
  '#009ee0': 'light-blue',
  '#172983': 'dark-blue',
  '#000000': 'black',
};
function toHex(value) {
  if (!value) return '';
  const v = value.trim().toLowerCase();
  let m = v.match(/^#([0-9a-f]{3})$/);
  if (m) return `#${m[1].split('').map((c) => c + c).join('')}`;
  m = v.match(/^#([0-9a-f]{6})$/);
  if (m) return v;
  m = v.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (m) return `#${[m[1], m[2], m[3]].map((n) => (+n).toString(16).padStart(2, '0')).join('')}`;
  return '';
}
function colourOf(card) {
  const ground = card.querySelector('.amag-promotionTeaser__wrapper') || card;
  const raw = (ground.style && ground.style.backgroundColor) || '';
  const fromAttr = ((ground.getAttribute('style') || '').match(/background(?:-color)?\s*:\s*([^;]+)/i) || [])[1];
  return COLOURS[toHex(raw)] || COLOURS[toHex(fromAttr)] || '';
}

export default function parse(element, { document }) {
  // Section head -> default content before the block.
  const head = [];
  const topline = element.querySelector('.amag-promotionTeaserBox__topline');
  const headline = element.querySelector('.amag-promotionTeaserBox__headline');
  if (topline && txt(topline)) head.push(mk(document, 'p', txt(topline)));
  if (headline && txt(headline)) head.push(mk(document, 'h2', txt(headline)));

  // Tiles (validated: div.amag-promotionTeaser inside .amag-promotionTeaserBox__content).
  let cards = [...element.querySelectorAll('.amag-promotionTeaserBox__content > .amag-promotionTeaser')];
  if (!cards.length) cards = [...element.querySelectorAll('div.amag-promotionTeaser')];

  const cells = [];
  cards.forEach((card) => {
    const link = card.querySelector('a[href]');
    const imgCell = [];
    const image = toImg(card.querySelector('.amag-promotionTeaser__image, .amag-promotionTeaser__imageWrapper img'), document);
    if (image) imgCell.push(mk(document, 'p', image));
    const badge = toImg(card.querySelector('.amag-promotionTeaser__amagLogoImage'), document);
    if (badge) imgCell.push(mk(document, 'p', badge));

    const textCell = [];
    const top = txt(card.querySelector('.amag-promotionTeaser__topline'));
    const title = txt(card.querySelector('.amag-promotionTeaser__text, h3'));
    const copy = txt(card.querySelector('.amag-promotionTeaser__copytext'));
    const label = txt(card.querySelector('.amag-promotionTeaser__button'));
    if (top) textCell.push(mk(document, 'p', top));
    if (title) textCell.push(mk(document, 'h3', title));
    if (copy) textCell.push(mk(document, 'p', copy));
    if (link) {
      const a = mk(document, 'a', label || title);
      a.setAttribute('href', link.getAttribute('href'));
      textCell.push(mk(document, 'p', a));
    }
    if (!title && !image) return;

    const colour = colourOf(card);
    cells.push([imgCell.length ? imgCell : '', textCell, colour ? mk(document, 'p', colour) : '']);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Documented trailing "Show more" label row.
  const more = txt(element.querySelector('.amag-promotionTeaserBox__showMoreBtn'));
  if (more) cells.push([mk(document, 'p', more)]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'News Cards', cells });
  head.forEach((n) => element.before(n));
  element.replaceWith(block);
}
