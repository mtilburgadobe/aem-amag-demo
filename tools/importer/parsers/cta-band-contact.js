/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cta-band-contact (block table "CTA Band Contact").
 * Source: https://www.amag.ch/de/garagenuebersicht/garage-buelach.html — `.amag-tabsWrapper.aemTabs`
 * (section 6 "Autoverkauf" and section 12 "Autoservice").
 *
 * The section head (eyebrow + <h2>) is outside the instance and stays default content.
 *
 * Authoring rows (blocks/cta-band-contact/cta-band-contact.js) — ONE ROW PER BRAND:
 *   <p><img brand logo></p> | <p><img team photo></p> |
 *   <h3>Ihre Audi Ansprechpartner in Bülach</h3><p><strong>Audi</strong></p><p>Autoverkauf</p>
 *   <p><strong><a href><img icon>Audi Team</a></strong></p>   (one link, icon inside)
 * Brand tab i (li.amag-tabsWrapper__tab) is paired with panel i (.amag-tabsWrapper__tabcontent).
 *
 * The source logo alt is a one-letter brand code ("a"); the block labels its tab by the logo
 * alt, so a code of < 2 characters is replaced by the panel's team name ("Audi").
 * Dropped: the mobile prev/next arrows and "1 / 1" counter (re-created by the block).
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
  let tabs = [...element.querySelectorAll('li.amag-tabsWrapper__tab')];
  if (!tabs.length) tabs = [...element.querySelectorAll('.cmp-tabs__tablist > li')];
  let panels = [...element.querySelectorAll('.amag-tabsWrapper__tabcontent')];
  if (!panels.length) panels = [...element.querySelectorAll('.cmp-tabs__tabpanel')];
  if (!panels.length) panels = [...element.querySelectorAll('.amag-contactPersonWrapper')];

  const cells = [];
  panels.forEach((panel, i) => {
    const person = panel.querySelector('.amag-contactPersonWrapper') || panel;
    const headline = txt(person.querySelector('.amag-contactPersonWrapper__info--headline'));
    const team = txt(person.querySelector('.amag-contactPersonWrapper__info--team'));
    const dept = txt(person.querySelector('.amag-contactPersonWrapper__info--garage'));
    const ctaSrc = person.querySelector('.amag-contactPersonWrapper__info--cta a[href]');

    const tab = tabs[i];
    const logoImg = tab ? tab.querySelector('img') : null;
    const logoAlt = logoImg ? (logoImg.getAttribute('alt') || '').trim() : '';
    const logo = toImg(logoImg, document, logoAlt.length < 2 ? (team || logoAlt) : logoAlt);
    const photo = toImg(person.querySelector('.amag-contactPersonWrapper__image img, picture img'), document);

    const info = [];
    if (headline) info.push(mk(document, 'h3', headline));
    if (team) info.push(mk(document, 'p', mk(document, 'strong', team)));
    if (dept) info.push(mk(document, 'p', dept));
    if (ctaSrc && txt(ctaSrc)) {
      const a = mk(document, 'a', toImg(ctaSrc.querySelector('img, svg'), document, ''), txt(ctaSrc));
      a.setAttribute('href', ctaSrc.getAttribute('href'));
      info.push(mk(document, 'p', mk(document, 'strong', a)));
    }
    if (!info.length && !photo) return;

    const row = [];
    if (logo) row.push(mk(document, 'p', logo));
    if (photo) row.push(mk(document, 'p', photo));
    row.push(info);
    cells.push(row);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'CTA Band Contact', cells });
  element.replaceWith(block);
}
