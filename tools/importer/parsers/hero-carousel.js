/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-carousel (block table "Hero Carousel").
 * Source: https://www.amag.ch/de.html — `.amag-content > .amagCh-stageCarousel .cmp-carousel`
 * (section 1, stage carousel, 8 slides: 4 image stages `.amag-stageTeaserImage`, 4 video stages
 * `.amag-stageTeaserVideo`).
 *
 * Authoring rows (blocks/hero-carousel/hero-carousel.js) — ONE ROW PER SLIDE, four cells:
 *   <p><img 16:9></p> | <p><img 3:4 mobile></p> | <h1|h2>headline</h1|h2><p><a href>link text</a></p> | <p>indicator label</p>
 *   - image stage: cell 1 = the <img> src (Scene7 `:16_9_Large`), cell 2 = the `:3_4` rendition
 *     from the mobile <source srcset> (the `_Large` candidate); either stays empty when absent;
 *   - video stage: cell 1 = the player's 16:9 Vimeo link (`data-vi16_9_url`), cell 2 = the
 *     3:4 mobile cut (`data-vi3_4_url`), as <p><a href>url</a></p>; the block plays them as a
 *     muted background player (empty when the player carries no URL);
 *   - headline: <h1> on the first slide, <h2> on all others (one <h1> per page; the source
 *     renders several <h1>s);
 *   - the slide <a> wraps the whole slide on the source; its href goes on the link-text anchor;
 *   - indicator label: the matching `li.cmp-carousel__indicator` (same index). NOTE: the home
 *     cleanup transformer removes `.amagCh-stageCarousel .cmp-carousel__indicator-container` in
 *     beforeTransform, so in the full import pipeline the label cell stays empty.
 * Dropped: prev/next/pause/play buttons, progress bar, backdrops, cookie-consent banners, the
 * video player containers (only their Vimeo URLs are kept, see video stage).
 */
const txt = (n) => (n ? n.textContent.replace(/\s+/g, ' ').trim() : '');
const ORIGIN = 'https://www.amag.ch';
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
function img(document, src, alt) {
  if (!src) return null;
  const i = document.createElement('img');
  i.setAttribute('src', abs(src));
  i.setAttribute('alt', (alt || '').trim());
  return i;
}
// srcset URLs contain commas (`qlt=82,0`), so candidates are read as "<url> <descriptor>" pairs.
function srcsetUrls(srcset) {
  const out = [];
  const re = /(\S+)\s+\d+(?:\.\d+)?[wx]/g;
  let m;
  while ((m = re.exec(srcset || ''))) out.push(m[1].replace(/^,/, ''));
  if (!out.length && srcset && srcset.trim()) out.push(srcset.trim().split(/\s+/)[0]);
  return out;
}
function mobileSrc(picture) {
  if (!picture) return '';
  const sources = [...picture.querySelectorAll('source')];
  for (const s of sources) {
    const urls = srcsetUrls(s.getAttribute('srcset'));
    const portrait = urls.filter((u) => /:3_4/.test(u));
    if (portrait.length) return portrait.find((u) => /:3_4_Large/.test(u)) || portrait[0];
  }
  return '';
}

export default function parse(element, { document }) {
  const carousel = element.matches('.cmp-carousel') ? element : (element.querySelector('.cmp-carousel') || element);
  let slides = [...carousel.querySelectorAll(':scope > .cmp-carousel__content > .cmp-carousel__item')];
  if (!slides.length) slides = [...carousel.querySelectorAll('.cmp-carousel__item')];
  const labels = [...carousel.querySelectorAll('.cmp-carousel__indicators > .cmp-carousel__indicator, li.cmp-carousel__indicator')]
    .map(txt);

  const cells = [];
  slides.forEach((slide, i) => {
    const link = slide.querySelector('a[href]');
    // Stage-specific classes only: the video slides also hold a `.cookie-video-banner__headline`.
    const headline = txt(slide.querySelector('.amag-stageTeaserImage__headline, .amag-stageTeaserVideo__headline')
      || slide.querySelector('h1, h2, h3'));
    const linkText = txt(slide.querySelector('.amag-stageTeaserImage__linktext, .amag-stageTeaserVideo__linktext'));
    if (!headline && !linkText) return;

    const isVideo = !!slide.querySelector('.amag-stageTeaserVideo');
    let desktop = null;
    let mobile = null;
    if (isVideo) {
      // the player's Vimeo sources: 16:9 cut (cell 1) and 3:4 mobile cut (cell 2)
      const player = slide.querySelector('[data-vi16_9_url], [data-vi3_4_url]');
      const vimeoLink = (u) => {
        if (!u || !/vimeo\.com\//.test(u)) return null;
        const a = mk(document, 'a', u);
        a.setAttribute('href', u);
        return a;
      };
      if (player) {
        desktop = vimeoLink(player.getAttribute('data-vi16_9_url'));
        mobile = vimeoLink(player.getAttribute('data-vi3_4_url'));
      }
    } else {
      const picture = slide.querySelector('picture');
      const main = slide.querySelector('picture img, img.template-dynamic-image, img');
      if (main) desktop = img(document, main.getAttribute('src') || main.getAttribute('data-src'), main.getAttribute('alt'));
      const m = mobileSrc(picture);
      if (m) mobile = img(document, m, main ? main.getAttribute('alt') : '');
    }

    const text = [];
    if (headline) text.push(mk(document, cells.length === 0 ? 'h1' : 'h2', headline));
    if (link && (linkText || headline)) {
      const a = mk(document, 'a', linkText || headline);
      a.setAttribute('href', link.getAttribute('href'));
      text.push(mk(document, 'p', a));
    }
    const label = labels[i] || '';

    cells.push([
      desktop ? mk(document, 'p', desktop) : '',
      mobile ? mk(document, 'p', mobile) : '',
      text,
      label ? mk(document, 'p', label) : '',
    ]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero Carousel', cells });
  element.replaceWith(block);
}
