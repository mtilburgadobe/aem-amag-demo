/* eslint-disable */
/* global WebImporter */

/**
 * Parser: newsletter-band (block table "Newsletter Band").
 * Source: https://www.amag.ch/de.html — `.amag-content > .amag-divider` (two instances:
 * section 7 "AMAG Newsletter" band and section 12 jobs band "Machen Sie Ihre Leidenschaft zum
 * Beruf").
 *
 * Authoring rows (blocks/newsletter-band/newsletter-band.js, cells read by role):
 *   - image row:   <p><img 1440x400 band image></p>
 *   - content row: [<p>topline</p>]<h3>headline</h3><p>copy</p>
 *                  <p><em|strong><a href><img arrow>label</a></em|strong></p>
 * CTA mark: violet button (`.amag-ctaWrapper__button--bgColor-amagViolet` / #801977) -> <em>
 * (secondary), any other colour (dark blue) -> <strong> (primary). The arrow icon is kept INSIDE
 * the one CTA link.
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
function toImg(img, document, alt) {
  if (!img) return null;
  const src = abs(img.getAttribute('src') || img.getAttribute('data-src'));
  if (!src) return null;
  const out = document.createElement('img');
  out.setAttribute('src', src);
  out.setAttribute('alt', (alt != null ? alt : (img.getAttribute('alt') || '')).trim());
  return out;
}
const mk = (document, tag, ...kids) => {
  const e = document.createElement(tag);
  kids.flat().forEach((k) => { if (k != null && k !== '') e.append(k); });
  return e;
};
function isSecondary(btn) {
  const cls = btn.getAttribute('class') || '';
  const colour = `${btn.getAttribute('data-btn-color') || ''} ${btn.getAttribute('style') || ''}`.toLowerCase();
  return /bgColor-amagViolet/i.test(cls) || colour.includes('#801977') || colour.includes('128, 25, 119');
}

export default function parse(element, { document }) {
  const cells = [];

  const band = toImg(element.querySelector('.amag-divider__background img'), document);
  if (band) cells.push([mk(document, 'p', band)]);

  const box = element.querySelector('.amag-divider__contentBox') || element;
  const content = [];
  const topline = txt(box.querySelector('.amag-divider__topline'));
  const headline = txt(box.querySelector('.amag-divider__headline'));
  if (topline) content.push(mk(document, 'p', topline));
  if (headline) content.push(mk(document, 'h3', headline));
  box.querySelectorAll('.amag-divider__copytext').forEach((p) => {
    if (txt(p)) content.push(mk(document, 'p', txt(p)));
  });

  const btn = box.querySelector('.amag-divider__ctaButton a[href]');
  if (btn && txt(btn)) {
    const mark = isSecondary(btn) ? 'em' : 'strong';
    const icon = toImg(btn.querySelector('img'), document, '');
    // Service-overview pages (/de/service: the page has the `.amag-introService` split hero —
    // raw, or already turned into its `hero-split` table by the hero-split parser, which runs
    // first): the arrow icon is authored BESIDE the marked link, `<p><img><em><a>label</a></em></p>`,
    // as on /en/services (the block moves it into the link). Other pages keep the icon inside.
    const servicePage = !!document.querySelector('.amag-introService')
      || [...document.querySelectorAll('table')].some((t) => /^hero[\s-]split(\s*\(|\s*$)/i.test(txt(t.querySelector('tr'))));
    if (servicePage) {
      const a = mk(document, 'a', txt(btn));
      a.setAttribute('href', btn.getAttribute('href'));
      content.push(mk(document, 'p', icon, mk(document, mark, a)));
    } else {
      const a = mk(document, 'a', icon, txt(btn));
      a.setAttribute('href', btn.getAttribute('href'));
      content.push(mk(document, 'p', mk(document, mark, a)));
    }
  }

  if (!headline && !content.length) {
    element.replaceWith(...element.childNodes);
    return;
  }
  cells.push([content]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'Newsletter Band', cells });
  element.replaceWith(block);
}
