/* eslint-disable */
/* global WebImporter */

/**
 * Parser: news-cards-articles (block table "News Cards Articles").
 * Source: https://www.amag.ch/de.html — `.amag-newsTeaser` (section 6 "Mobil in die Zukunft:
 * News & Aktuelles", the dated article list; every `article.amag-newsTeaser-element` is in the
 * DOM, only the first three are shown before "Weitere Beiträge anzeigen").
 *
 * The section head (eyebrow "aktuelles", <h2>, lede) is OUTSIDE the instance
 * (`.amagCh-section-description`) and stays default content before the block.
 *
 * Authoring rows (blocks/news-cards-articles/news-cards-articles.js) — ONE ROW PER ARTICLE:
 *   <p><img 1:1 thumbnail></p> | <p>dd.mm.yyyy</p><h4><a href>title</a></h4><p><a href>Mehr erfahren</a></p>
 * Trailing row: <p>Weitere Beiträge anzeigen</p> (the "show more" label row).
 * Iteration: `article.amag-newsTeaser-element` (document order, hidden ones included).
 * Dropped: the show-more chevron icons and the "Weniger Beiträge anzeigen" collapse label.
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
const mk = (document, tag, ...kids) => {
  const e = document.createElement(tag);
  kids.flat().forEach((k) => { if (k != null && k !== '') e.append(k); });
  return e;
};
const link = (document, href, label) => {
  const a = mk(document, 'a', label);
  a.setAttribute('href', href);
  return a;
};

export default function parse(element, { document }) {
  const articles = [...element.querySelectorAll('article.amag-newsTeaser-element')];
  const cells = [];
  articles.forEach((art) => {
    const date = txt(art.querySelector('.amag-newsTeaser-element__info-date'));
    const headline = art.querySelector('.amag-newsTeaser-element__info-headline');
    const title = txt(headline);
    const titleHref = (headline && headline.querySelector('a[href]'))
      ? headline.querySelector('a[href]').getAttribute('href') : '';
    const more = art.querySelector('.amag-newsTeaser-element__info-link[href], .amag-newsTeaser-element__info-link-wrapper a[href]');
    if (!title) return;

    const imgSrc = art.querySelector('.amag-newsTeaser-element__image img');
    let image = '';
    if (imgSrc && (imgSrc.getAttribute('src') || imgSrc.getAttribute('data-src'))) {
      const i = document.createElement('img');
      i.setAttribute('src', abs(imgSrc.getAttribute('src') || imgSrc.getAttribute('data-src')));
      i.setAttribute('alt', (imgSrc.getAttribute('alt') || '').trim());
      image = mk(document, 'p', i);
    }

    const text = [];
    if (date) text.push(mk(document, 'p', date));
    const href = titleHref || (more ? more.getAttribute('href') : '');
    text.push(mk(document, 'h4', href ? link(document, href, title) : title));
    if (more && txt(more)) text.push(mk(document, 'p', link(document, more.getAttribute('href'), txt(more))));
    cells.push([image, text]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const showMore = txt(element.querySelector('.amag-newsTeaser__showMore-button--showNews'));
  if (showMore) cells.push([mk(document, 'p', showMore)]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'News Cards Articles', cells });
  element.replaceWith(block);
}
