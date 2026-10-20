/* eslint-disable */
/* global WebImporter */

/**
 * Parser: accordion-faq (block table "Accordion Faq").
 * Source: https://www.amag.ch/de.html — `.cmp-accordion` (section 11 "AMAG – Ihr Autohändler an
 * 90 Standorten und online", 4 questions).
 *
 * The intro (`.cmp-accordion__headline` <h2> + `.cmp-accordion__introText` <p>) sits INSIDE the
 * instance; it is moved in front of the block as default content (as on /en).
 *
 * Authoring rows (blocks/accordion-faq/accordion-faq.js) — ONE ROW PER QUESTION, two cells:
 *   <h3>question</h3> | answer (<p>/<ul>/<ol>, links and inline marks kept)
 * Iteration: `.cmp-accordion__item` (document order). The source renders the question as an
 * <h2> inside the toggle <button>; it is authored as <h3> (the block's question heading).
 * Dropped: the toggle buttons and chevron icons (re-created by the block).
 */
const txt = (n) => (n ? n.textContent.replace(/\s+/g, ' ').trim() : '');
const mk = (document, tag, ...kids) => {
  const e = document.createElement(tag);
  kids.flat().forEach((k) => { if (k != null && k !== '') e.append(k); });
  return e;
};
const KEEP = new Set(['a', 'strong', 'b', 'em', 'i', 'u', 'br', 'sup', 'sub', 'li', 'ul', 'ol', 'p']);
// Clean copy of rich text: only semantic tags, only href on links.
function clean(node, document) {
  if (node.nodeType === 3) return document.createTextNode(node.textContent);
  if (node.nodeType !== 1) return null;
  const tag = node.localName;
  const kids = [...node.childNodes].map((c) => clean(c, document)).filter(Boolean);
  if (!KEEP.has(tag)) return kids.length ? kids : null;
  const out = document.createElement(tag === 'b' ? 'strong' : (tag === 'i' ? 'em' : tag));
  if (tag === 'a' && node.getAttribute('href')) out.setAttribute('href', node.getAttribute('href'));
  kids.flat().forEach((k) => out.append(k));
  return out;
}

const ORIGIN = 'https://www.amag.ch';
const abs = (u) => {
  if (!u) return '';
  const s = u.trim();
  if (/^(data:|https?:)/i.test(s)) return s;
  if (s.startsWith('//')) return `https:${s}`;
  try { return new URL(s, `${ORIGIN}/`).href; } catch (e) { return s; }
};

export default function parse(element, { document }) {
  const head = [];
  const cells = [];
  const h2 = element.querySelector('.cmp-accordion__intro .cmp-accordion__headline, .cmp-accordion__headline');
  // /de/service (4 groups): the intro carries an icon (`img.cmp-accordion__introIcon`) -> the
  // block's HEAD row (one cell: <p><img></p><h2>), as on /de/service/reifen-und-raeder/winterreifen.
  // Without an intro icon (home) the <h2> stays default content before the block.
  const icon = element.querySelector('.cmp-accordion__intro img.cmp-accordion__introIcon');
  const iconSrc = icon ? abs(icon.getAttribute('src') || icon.getAttribute('data-src')) : '';
  if (iconSrc && h2 && txt(h2)) {
    const img = document.createElement('img');
    img.setAttribute('src', iconSrc);
    img.setAttribute('alt', (icon.getAttribute('alt') || '').trim());
    cells.push([[mk(document, 'p', img), mk(document, 'h2', txt(h2))]]);
  } else if (h2 && txt(h2)) head.push(mk(document, 'h2', txt(h2)));
  element.querySelectorAll('.cmp-accordion__intro .cmp-accordion__introText, :scope > .cmp-accordion__introText').forEach((p) => {
    if (txt(p)) head.push(mk(document, 'p', txt(p)));
  });
  const headRows = cells.length;

  element.querySelectorAll('.cmp-accordion__item').forEach((item) => {
    const q = txt(item.querySelector('.cmp-accordion__title') || item.querySelector('.cmp-accordion__button'));
    const panel = item.querySelector('.cmp-accordion__panel');
    if (!q || !panel) return;
    const source = panel.querySelector('.cmp-teaser__description') || panel;
    const blocks = [...source.querySelectorAll('p, ul, ol')].filter((n) => !n.parentElement.closest('p, ul, ol')
      || !source.contains(n.parentElement.closest('p, ul, ol')));
    const answer = [];
    blocks.forEach((n) => {
      if (!txt(n)) return;
      const c = clean(n, document);
      if (c) answer.push(c);
    });
    if (!answer.length && txt(source)) answer.push(mk(document, 'p', txt(source)));
    cells.push([mk(document, 'h3', q), answer.length ? answer : '']);
  });

  if (cells.length === headRows) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Accordion Faq', cells });
  head.forEach((n) => element.before(n));
  element.replaceWith(block);
}
