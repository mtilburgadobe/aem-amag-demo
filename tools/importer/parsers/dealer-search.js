/* eslint-disable */
/* global WebImporter */

/**
 * Parser: dealer-search (block table "Dealer Search").
 * Source: https://www.amag.ch/de/komponenten/storelocator.html —
 * `.amag-content > .storelocator.storelocator-component` (map, search + filter, garage list,
 * garage detail modals, off-canvas filter panel) plus its SIBLING `.amag-content > .amag-direct-entry`
 * ("Direkt zu" pill), which is folded in as the `quick-links` row and removed from the page.
 *
 * Authoring rows (blocks/dealer-search/dealer-search.js header comment; same row keys, order and
 * cell shapes as content/en/komponenten/car-dealers.plain.html):
 *   map            | <img desktop capture> | <img mobile capture>
 *   title          | <h1>Garage suchen</h1>
 *   search         | <p>PLZ / Name / Ort</p>
 *   filter         | <p>Filter anzeigen</p>
 *   garage ×n      | <p>name</p><p>street</p><p>zip town</p> | <ul><li>brand</li>…</ul> or empty
 *                  | <p><strong><a tel>number</a></strong><em><a tel>Anruf</a></em></p><p><a maps>Route</a></p>
 *   details ×n     | <p>Zurück zur Übersicht</p> | <h3>name</h3><p>street</p><p>zip town</p>
 *                  | <p><strong><a tel>number</a></strong><em><a tel>Anrufen</a></em></p>
 *                    <p><a mailto>Kontakt</a></p><p><a maps>Route</a></p><p><a site>Zur Garagenseite</a></p>
 *                  | <p><a badge-url>badge-url</a></p> | <p><strong><a otv>Termin vereinbaren</a></strong></p>
 *   filters-head   | <h4>Alle Filter</h4> | <p><img trash> Alle Filter löschen</p>
 *   filters-type   | <p>Garagen anzeigen nach</p> | <p>Verkauf</p><p>Service</p> (switch labels)
 *   filters-brands | <p>Markenauswahl</p> | <ul><li><img> VW</li>…</ul> (sales) | <ul>…</ul> (service)
 *   filters-offers | <p>Angebot</p> | <ul><li>Occasions Center</li>…</ul>
 *   filters-footer | <p>Alle</p><p>Garagen anzeigen</p> | <p>Schliessen</p>
 *   quick-links    | <p>Direkt zu</p> | <p><img><a href>label</a></p>… | <p><img>Services</p><p><img>Schliessen</p>
 *
 * Details rows are emitted in garage-list order (the source renders the modals in another order);
 * each modal is paired with its list entry by name + street (fallback: name + tel, name, order).
 * Dropped: every inline/data: icon (the block draws them), the Google Maps canvas (replaced by the
 * published static captures below; the block swaps in a Leaflet map), favourite toggles, the
 * detail modals' sale/service brand chips (the block derives them), the Verkauf/Service switch
 * labels (the block renders the switch buttons itself; the en row has the headline cell only).
 */
const ORIGIN = 'https://www.amag.ch';

// Static map captures (desktop / mobile) already published for /en/komponenten/car-dealers.
const MAP_SITE = 'https://main--aem-amag-demo--mtilburgadobe.aem.live/en/komponenten';
const MAP_CAPTURES = [
  `${MAP_SITE}/media_1dccce4ffaf016c7c5c3f831da115174435fcc7a2.png`, // map-capture-1440.png
  `${MAP_SITE}/media_1b19144909cffb91e680fc2b0f05df94f4066a584.png`, // map-capture-360.png
];

// Offline captures (migration-work) rewrite <img src> to ./images/<hash>.png; map them back to the
// public www.amag.ch originals (migration-work/metadata.json images.mapping). Live DOM is unaffected.
const DAM = `${ORIGIN}/content/dam/amag-ch/gemeinsame-dateien/icons`;
const CAPTURED = {
  a50a2eb7397893289f00fc84d098a6d1: `${DAM}/blau/trash-remove.svg`,
  aff8cb92fde6c6ad96e4e6443634ff9e: `${DAM}/schwarz/Probefahrt.svg`,
  '93c2b5e064839747039c33c5d85fd210': `${DAM}/schwarz/calendar-add-1.svg`,
  '6d7a9fc5f68a4ac2b28119abf5166d5d': `${DAM}/schwarz/car-4.svg`,
  e9f315e1df89d5e120195e0344cf64c3: `${DAM}/elektromobilit%C3%A4t/clean-car-cable.svg`,
  '1121474f0effd1dbf4ee9f9448e164ff': `${DAM}/schwarz/Direkteinstiege.svg`,
};

const txt = (n) => (n ? n.textContent.replace(/\s+/g, ' ').trim() : '');
const abs = (u) => {
  if (!u) return '';
  const s = u.trim();
  if (/^[a-z][a-z0-9+.-]*:/i.test(s)) return s; // https:, tel:, mailto:, data: …
  if (s.startsWith('//')) return `https:${s}`;
  try { return new URL(s, `${ORIGIN}/`).href; } catch (e) { return s; }
};
const imgSrc = (img) => {
  if (!img) return '';
  const cands = [img.getAttribute('src'), img.getAttribute('data-src')].filter(Boolean);
  for (let i = 0; i < cands.length; i += 1) {
    const c = cands[i].trim();
    if (!c || /^(data|blob):/i.test(c)) continue;
    const hit = c.match(/(?:^|\/)images\/([0-9a-f]{32})\.\w+$/i);
    if (hit && CAPTURED[hit[1]]) return CAPTURED[hit[1]];
    if (hit && /^\.?\/?images\//.test(c)) continue; // unknown local capture: no public URL
    return abs(c);
  }
  return '';
};

export default function parse(element, { document }) {
  const doc = element.ownerDocument || document;
  const mk = (tag, ...kids) => {
    const e = document.createElement(tag);
    kids.flat().forEach((k) => { if (k != null && k !== '') e.append(k); });
    return e;
  };
  const p = (...kids) => mk('p', ...kids);
  const link = (href, ...kids) => {
    const a = mk('a', ...kids);
    // hrefs stay as on the source (site-relative /de/… paths), like the other parsers; only
    // image sources are made absolute
    a.setAttribute('href', (href || '').trim());
    return a;
  };
  const image = (src, alt = '') => {
    if (!src) return null;
    const i = document.createElement('img');
    i.setAttribute('src', src);
    i.setAttribute('alt', alt);
    return i;
  };
  const toImg = (img) => image(imgSrc(img), img ? (img.getAttribute('alt') || '').trim() : '');
  const q = (sel, root = element) => root.querySelector(sel);
  const qa = (sel, root = element) => [...root.querySelectorAll(sel)];
  // text of a node without some of its descendants (counters, distance, …)
  const textWithout = (node, skipSel) => {
    if (!node) return '';
    const c = node.cloneNode(true);
    c.querySelectorAll(skipSel).forEach((n) => n.remove());
    return txt(c);
  };
  // tel paragraph: <p><strong><a tel>number</a></strong><em><a tel>label</a></em></p>
  const telP = (a, numSel, labelSel) => {
    if (!a) return null;
    const href = (a.getAttribute('href') || '').trim();
    if (!href) return null;
    const number = txt(q(numSel, a)) || href.replace(/^tel:/, '');
    const label = txt(q(labelSel, a));
    const out = p(mk('strong', link(href, number)));
    if (label) out.append(mk('em', link(href, label)));
    return out;
  };
  const linkP = (a) => {
    if (!a || !a.getAttribute('href')) return null;
    const label = txt(a);
    return label ? p(link(a.getAttribute('href'), label)) : null;
  };
  const cell = (...nodes) => {
    const list = nodes.flat().filter(Boolean);
    return list.length ? list : '';
  };
  const cells = [];
  const row = (key, ...rest) => cells.push([p(key), ...rest]);

  // map — static captures (the block replaces them with the interactive map)
  row('map', image(MAP_CAPTURES[0]), image(MAP_CAPTURES[1]));

  // title / search / filter
  const title = txt(q('.storelocator__searchTitle'));
  row('title', title ? mk('h1', title) : '');
  const field = q('.storelocator__searchField, .storelocator__searchContainer input');
  const placeholder = (field && (field.getAttribute('placeholder') || '').trim()) || 'PLZ / Name / Ort';
  row('search', p(placeholder));
  const filterLabel = textWithout(q('.storelocator__filterButton'), '.storelocator__filterCounter');
  row('filter', filterLabel ? p(filterLabel) : '');

  // garage list
  const norm = (s) => (s || '').toLowerCase().replace(/\s+/g, '');
  const garages = qa('.storelocator__garage').map((g) => {
    const name = textWithout(q('.storelocator__garageName', g), '.storelocator__distance');
    const street = txt(q('.storelocator__garageAddress', g));
    const zip = txt(q('.storelocator__garageZip', g));
    const phone = q('a.storelocator__garagePhone, a[href^="tel:"]', g);
    const route = q('a.storelocator__garageRoute', g);
    // brand chips are attribute-less <span>s, which the importer unwraps before parsing:
    // fall back to the container text, one brand per source line ("VW Nutzfahrzeuge" has a space)
    const brandBox = q('.storelocator__sellingBrands', g);
    let brands = qa('.storelocator__sellingBrands > *', g).map(txt).filter(Boolean);
    if (!brands.length && brandBox) {
      brands = brandBox.textContent.split(/\s*\n\s*/).map((b) => b.trim()).filter(Boolean);
    }
    row(
      'garage',
      cell(name && p(name), street && p(street), zip && p(zip)),
      brands.length ? mk('ul', brands.map((b) => mk('li', b))) : '',
      cell(telP(phone, '.d-lg-inline', '.d-lg-none'), linkP(route)),
    );
    return { name, street, tel: phone ? phone.getAttribute('href') : '' };
  });

  // detail modals, read then paired to the list order
  const modals = qa('.amag-garagenModal').map((m) => {
    const name = txt(q('.amag-garagenModal__title', m));
    const street = txt(q('.amag-garagenModal__street', m));
    const zip = txt(q('.amag-garagenModal__zip', m));
    const call = q('a.amag-garagenModal__callButton', m) || q('a[href^="tel:"]', m);
    const frame = q('.amag-rating__container iframe', m);
    const badge = frame ? abs(frame.getAttribute('src') || frame.getAttribute('data-src') || '') : '';
    const otv = q('a.amag-garagenModal__otvButton', m);
    const otvLabel = txt(otv);
    const cellsOut = [
      cell(txt(q('.amag-garagenModal__closeButton', m)) && p(txt(q('.amag-garagenModal__closeButton', m)))),
      cell(name && mk('h3', name), street && p(street), zip && p(zip)),
      cell(
        telP(call, '.d-md-inline', '.d-md-none'),
        linkP(q('a.amag-garagenModal__emailButton', m)),
        linkP(q('a.amag-garagenModal__routeButton', m)),
        linkP(q('a.amag-garagenModal__garagenDetailLink', m)),
      ),
      badge && !/^(data|about):/i.test(badge) ? p(link(badge, badge)) : '',
      otv && otvLabel && otv.getAttribute('href') ? p(mk('strong', link(otv.getAttribute('href'), otvLabel))) : '',
    ];
    return { name, street, tel: call ? call.getAttribute('href') : '', cells: cellsOut, used: false };
  });
  const take = (pred) => {
    const hit = modals.find((m) => !m.used && pred(m));
    if (hit) hit.used = true;
    return hit;
  };
  const ordered = garages.map((g) => take((m) => norm(m.name) === norm(g.name) && norm(m.street) === norm(g.street))
    || take((m) => norm(m.name) === norm(g.name) && m.tel && m.tel === g.tel)
    || take((m) => norm(m.name) === norm(g.name)));
  garages.forEach((g, i) => { if (!ordered[i]) ordered[i] = take(() => true); });
  ordered.filter(Boolean).concat(modals.filter((m) => !m.used))
    .forEach((m) => { m.used = true; row('details', ...m.cells); });

  // off-canvas filter panel
  const headline = textWithout(q('.amag-filterModal__headline'), '.storelocator__filterCounter');
  const resetBtn = q('.amag-filterModal__resetButton');
  const resetLabel = txt(resetBtn);
  const resetImg = resetBtn ? toImg(q('img', resetBtn)) : null;
  if (headline || resetLabel) {
    row(
      'filters-head',
      headline ? mk('h4', headline) : '',
      resetLabel ? p(resetImg, resetImg ? ` ${resetLabel}` : resetLabel) : '',
    );
  }
  const typeHead = txt(q('.amag-filterModal__selectionHeadline'));
  // sales / service switch labels -> optional second cell (the block fills its two buttons)
  const typeLabels = qa('.amag-filterModal__filter-selection-button').map(txt).filter(Boolean).slice(0, 2);
  if (typeHead) row('filters-type', p(typeHead), ...(typeLabels.length ? [cell(...typeLabels.map((t) => p(t)))] : []));
  const brandList = (sel) => {
    const items = qa(`${sel} li`).map((li) => {
      const label = txt(li);
      if (!label) return null;
      const icon = toImg(q('img', li));
      return mk('li', icon, icon ? ` ${label}` : label);
    }).filter(Boolean);
    return items.length ? mk('ul', items) : '';
  };
  const brandsHead = txt(q('.amag-filterModal__brandsHeadline'));
  const sales = brandList('.amag-filterModal__brandsCheckboxes.sales');
  const service = brandList('.amag-filterModal__brandsCheckboxes.service');
  if (brandsHead || sales || service) row('filters-brands', brandsHead ? p(brandsHead) : '', sales, service);
  const offerHead = txt(q('.amag-filterModal__saleHeadline'));
  const offers = qa('.amag-filterModal__saleListItem').map(txt).filter(Boolean);
  if (offerHead || offers.length) {
    row('filters-offers', offerHead ? p(offerHead) : '', offers.length ? mk('ul', offers.map((o) => mk('li', o))) : '');
  }
  const confirm = q('.off-canvas__confirm-button');
  const counter = txt(q('.amag-filterModal__garagenCounter', confirm || element));
  const confirmLabel = textWithout(confirm, '.amag-filterModal__garagenCounter');
  const cancel = qa('.off-canvas__cancel-button').map(txt).find(Boolean) || '';
  if (counter || confirmLabel || cancel) {
    row('filters-footer', cell(counter && p(counter), confirmLabel && p(confirmLabel)), cancel ? p(cancel) : '');
  }

  // "Direkt zu" pill — a sibling of the component on the page
  const pill = q('.amag-direct-entry') || doc.querySelector('.amag-direct-entry');
  if (pill) {
    const topline = txt(q('.amag-direct-entry__pop-up-topline', pill));
    let entries = qa('a.amag-direct-entry__pop-up-element[href]', pill);
    if (!entries.length) entries = qa('.amag-direct-entry__pop-up a[href]', pill);
    const links = entries.map((a) => {
      const label = txt(q('.amag-direct-entry__link', a) || a);
      if (!label) return null;
      return p(toImg(q('img.amag-direct-entry__pop-up-icon', a) || q('img', a)), link(a.getAttribute('href'), label));
    }).filter(Boolean);
    const faces = ['.amag-direct-entry__button--open', '.amag-direct-entry__button--close'].map((sel) => {
      const face = q(sel, pill);
      const label = txt(face && (q('.amag-direct-entry__label', face) || face));
      return label ? p(toImg(q('img', face)), label) : null;
    });
    if (topline || links.length) row('quick-links', topline ? p(topline) : '', cell(links), cell(faces));
    pill.remove();
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Dealer Search', cells });
  element.replaceWith(block);
}
