/* eslint-disable */
/* global WebImporter */

/**
 * Parser: news-cards-vehicle (block table "News Cards Vehicle").
 * Source: https://www.amag.ch/de/garagenuebersicht/garage-buelach.html — `.amag-angeboteRecoContainer`
 * (section 5, vehicle offers carousel; the vehicle list is live stock data).
 *
 * Default content: the section head (eyebrow + <h2>) lies OUTSIDE the instance and stays; the
 * carousel head (<h4> + "Fahrzeuge Bülach" link) lies INSIDE it and is moved in front of the
 * block table as <h4> + <p><a></a></p> (the block reabsorbs both — EW8).
 *
 * Authoring rows (blocks/news-cards-vehicle/news-cards-vehicle.js) — ONE ROW PER CARD:
 *   <p><img photo></p> |
 *   <p>Occasion</p><h3>AUDI A1</h3>
 *   <p><strong>CHF 25'490.-</strong><br>Leasing ab <strong>CHF 312 mtl.</strong></p>
 *   <ul><li>46'541 KM</li><li>150 PS</li><li>Automatik Getriebe</li>…</ul>
 *   <p><a href=detail>AUDI A1</a></p>   (the whole card becomes that link)
 * Closing row: <p><a href="https://auto.amag.ch/de">Mehr Autos</a></p> (link, no picture/heading).
 *
 * Iteration: `.cmp-carousel__item` wrappers (each holds one `.amag-angeboteRecoContainer__reco`
 * or the closing `__reco--last` tile). Dropped: arrows, "1 / 44" counter, indicator dots
 * (derived/re-created by the block).
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

function priceParagraph(container, document) {
  if (!container) return null;
  const p = document.createElement('p');
  const price = txt(container.querySelector('.amag-angeboteRecoContainer__reco--price'));
  if (price) p.append(mk(document, 'strong', price));
  const leasing = container.querySelector('.amag-angeboteRecoContainer__reco--leasingText');
  if (leasing && txt(leasing)) {
    if (p.childNodes.length) p.append(document.createElement('br'));
    const bold = leasing.querySelector('b, strong');
    const boldText = txt(bold);
    const lead = txt(leasing).replace(boldText, '').trim();
    if (lead) p.append(`${lead} `);
    if (boldText) p.append(mk(document, 'strong', boldText));
  }
  if (!p.childNodes.length && txt(container)) p.textContent = txt(container);
  return p.childNodes.length ? p : null;
}

export default function parse(element, { document }) {
  // Carousel head -> default content before the block.
  const head = [];
  const h4 = element.querySelector('.amag-angeboteRecoContainer__carousel--descriptionHeadline');
  if (h4 && txt(h4)) head.push(mk(document, 'h4', txt(h4)));
  const headLink = element.querySelector('.amag-angeboteRecoContainer__carousel--descriptionLink a[href]');
  if (headLink && txt(headLink)) {
    const a = mk(document, 'a', txt(headLink));
    a.setAttribute('href', headLink.getAttribute('href'));
    head.push(mk(document, 'p', a));
  }

  let items = [...element.querySelectorAll('.cmp-carousel__items > .cmp-carousel__item')];
  if (!items.length) items = [...element.querySelectorAll('.cmp-carousel__item')];

  const cells = [];
  items.forEach((item) => {
    const card = item.querySelector('.amag-angeboteRecoContainer__reco');
    const last = item.querySelector('.amag-angeboteRecoContainer__reco--last');
    if (card) {
      const photo = toImg(card.querySelector('.amag-angeboteRecoContainer__reco--image, img'), document);
      const body = [];
      const status = txt(card.querySelector('.amag-angeboteRecoContainer__reco--subtitle'));
      const title = txt(card.querySelector('.amag-angeboteRecoContainer__reco--title'));
      if (status) body.push(mk(document, 'p', status));
      if (title) body.push(mk(document, 'h3', title));
      const price = priceParagraph(card.querySelector('.amag-angeboteRecoContainer__reco--priceContainer'), document);
      if (price) body.push(price);
      const specs = [...card.querySelectorAll('.amag-angeboteRecoContainer__recoDataContainer > div')]
        .map((d) => {
          const value = txt(d.querySelector('.amag-angeboteRecoContainer__recoDataContainerValue'));
          const label = txt(d.querySelector('.amag-angeboteRecoContainer__recoDataContainerText'));
          return [value, label].filter(Boolean).join(' ');
        })
        .filter(Boolean);
      if (specs.length) body.push(mk(document, 'ul', specs.map((s) => mk(document, 'li', s))));
      const detail = card.querySelector(':scope > a[href]') || card.querySelector('a[href]');
      if (detail) {
        const a = mk(document, 'a', title || txt(detail) || detail.getAttribute('href'));
        a.setAttribute('href', detail.getAttribute('href'));
        body.push(mk(document, 'p', a));
      }
      if (!title && !photo) return;
      cells.push([photo ? mk(document, 'p', photo) : '', body]);
    } else if (last) {
      const a = last.querySelector('a[href]') || last.closest('a[href]');
      const label = txt(last);
      if (a && label) {
        const link = mk(document, 'a', label);
        link.setAttribute('href', a.getAttribute('href'));
        cells.push([mk(document, 'p', link)]);
      }
    }
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'News Cards Vehicle', cells });
  head.forEach((n) => element.before(n));
  element.replaceWith(block);
}
