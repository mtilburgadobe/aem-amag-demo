/* eslint-disable */
/* global WebImporter */
import { knownIconSrc } from '../known-icons.js';

/**
 * Parser: tabs-garage (block table "Tabs Garage").
 * Source: https://www.amag.ch/de/garagenuebersicht/garage-buelach.html
 * Instance: `.amag-introTabModul__tablist` (ol > li.amag-introTabModul__tab: inline <svg> + label).
 *
 * Authoring rows (blocks/tabs-garage/tabs-garage.js):
 *   - tab rows:  <p><img icon></p> | <p>Fahrzeug-Angebote</p>   (no link, no heading)
 *   - band row (trailing): <h3>Mehr über AMAG Bülach</h3> |
 *       <p><a href="#fahrzeug-angebote">Weiter zu unseren Fahrzeug-Angeboten</a></p> …
 *     The tab id is the label as a class name (toClassName: "News & Infos" -> "news-infos").
 *
 * The band is page section 20 (`.amag-introTabModul .cmp-tabs > .amagCh-section__container`,
 * grey "Mehr über AMAG Bülach"). It is read from the document, added as the trailing row and
 * REMOVED from the DOM; amag-sections.js then drops the emptied section, so no separate grey
 * section is produced. Its source links have no href — the href is the anchor of the tab whose
 * label the link text names (fallback: same position as the tab).
 *
 * Dropped: the band's arrow glyphs (the block generates them, aria-hidden).
 * Tab icons are inline <svg> on the source -> plain <img> with the icon's public file
 * (../known-icons.js), else data:image/svg+xml.
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
// Same rule as aem.js toClassName.
const toClassName = (name) => (typeof name === 'string'
  ? name.toLowerCase().replace(/[^0-9a-z]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
  : '');

export default function parse(element, { document }) {
  // Tabs (validated: li.amag-introTabModul__tab; fallback li.cmp-tabs__tab / any li).
  let tabs = [...element.querySelectorAll(':scope > li.amag-introTabModul__tab')];
  if (!tabs.length) tabs = [...element.querySelectorAll('li.cmp-tabs__tab, li')];
  tabs = tabs.filter((li) => txt(li));

  if (!tabs.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const labels = tabs.map((li) => txt(li));
  const cells = tabs.map((li, i) => {
    const icon = toImg(li.querySelector('img, svg'), document, labels[i]);
    return [icon ? mk(document, 'p', icon) : '', mk(document, 'p', labels[i])];
  });

  // Trailing band row (source section 20).
  const root = element.closest('.cmp-tabs') || element.closest('.amag-introTabModul');
  const band = (root && root.querySelector(':scope > .amagCh-section__container'))
    || document.querySelector('.amag-introTabModul .cmp-tabs > .amagCh-section__container');
  if (band) {
    const headSrc = band.querySelector('.h3, h2, h3, h4, .alc-wrapper > .row > div:first-child');
    const head = txt(headSrc);
    let links = [...band.querySelectorAll('.alc-link')];
    if (!links.length) links = [...band.querySelectorAll('a')];
    const linkPs = links.map((ln, i) => {
      const label = txt(ln.querySelector('.alc-linktext') || ln);
      if (!label) return null;
      const lower = label.toLowerCase();
      // Longest tab label named by the link text; fallback: same position.
      const match = labels
        .map((l, idx) => ({ l, idx }))
        .filter(({ l }) => lower.includes(l.toLowerCase()))
        .sort((x, y) => y.l.length - x.l.length)[0];
      const tab = match ? labels[match.idx] : labels[Math.min(i, labels.length - 1)];
      const a = mk(document, 'a', label);
      a.setAttribute('href', `#${toClassName(tab)}`);
      return mk(document, 'p', a);
    }).filter(Boolean);
    if (head || linkPs.length) {
      cells.push([head ? mk(document, 'h3', head) : '', linkPs]);
    }
    band.remove();
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Tabs Garage', cells });
  element.replaceWith(block);
}
