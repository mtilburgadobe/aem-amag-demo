/* eslint-disable */
/* global WebImporter */

/**
 * Parser: icon-text-box (block table "Icon Text Box").
 * Source: https://www.amag.ch/de/garagenuebersicht/garage-buelach.html — `.amag-iconListContainer`
 * in panel 2 (section 14) and panel 3 (section 17): 4 icon + label items each, no headline.
 * Source: https://www.amag.ch/de/service.html — `.amag-iconTextBox` ("Einige unserer
 * Dienstleistungen im Überblick:", 12 items, 9 linked): `h2.amag-iconTextBox__headline` +
 * `.amag-iconTextBox__item` (<img> + <h5>, wrapped in `a.amag-iconTextBox__link` when linked).
 * Option `band-white` / `band-grey` for this markup only: the ground of the enclosing
 * `.amagCh-section` (`amagCh-section--white` / `--grey`) — the box's top band (as on /en/services).
 *
 * Authoring rows (blocks/icon-text-box/icon-text-box.js) — ONE ROW PER ITEM:
 *   <p><img icon></p> | <h5>Notdienst 24 h</h5>    (<h5><a href>label</a></h5> when linked)
 * (a leading heading-only row is the box headline — the garage source has none).
 * Iteration: `.amag-iconLabel` items (garage) / `.amag-iconTextBox__item` (service). The source
 * icon alt is the DAM path of the icon (not a description), so a path-like alt is emptied.
 * Dropped: the decorative `hr.amag-iconListContainer__break`, the empty item <p>s.
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

// Service-overview markup (`.amag-iconTextBox`) -> block name with the section's band option.
function parseIconTextBox(element, document) {
  const box = element.matches('.amag-iconTextBox') ? element : element.querySelector('.amag-iconTextBox');
  const cells = [];
  const headline = box.querySelector('.amag-iconTextBox__headline, h2, h3');
  if (headline && txt(headline)) cells.push([mk(document, 'h2', txt(headline))]);

  const items = [...box.querySelectorAll('.amag-iconTextBox__item')];
  items.forEach((item) => {
    const icon = toImg(item.querySelector('img'), document);
    const label = txt(item.querySelector('h5, h4, h3, .amag-iconTextBox__text'));
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

  const section = element.closest('.amagCh-section');
  const ground = section && ((section.classList.contains('amagCh-section--grey') && 'grey')
    || (section.classList.contains('amagCh-section--white') && 'white'));
  const name = ground ? `Icon Text Box (band-${ground})` : 'Icon Text Box';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}

export default function parse(element, { document }) {
  if (!element.querySelector('.amag-iconLabel, .amag-iconListItem')
    && (element.matches('.amag-iconTextBox') || element.querySelector('.amag-iconTextBox'))) {
    parseIconTextBox(element, document);
    return;
  }

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
