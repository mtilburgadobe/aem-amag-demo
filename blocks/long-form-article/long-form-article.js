/**
 * long-form-article — the service article body (prototype section description + rich text +
 * fact boxes + icon text box + text image + CTA; schema sections 3, 4, 6, 8). Container
 * shape: rows are typed by their CONTENT, never by position:
 *   - a cell holding only a <picture>/<img>            → full-width text image
 *   - one cell whose only text is a CTA paragraph       → CTA (`<strong><a><img>label</a>`
 *     + optional service-time <p>); variant `narrow-cta` = the garage-election width
 *   - two cells where one holds a <blockquote>          → fact boxes (quote box light blue,
 *     benefits box dark blue: <h2> + <h3> benefit titles + <p> copies)
 *   - ≥ 2 cells where every cell but the first has an image → icon tiles (first cell = the
 *     tile-box headline when it has no image; each tile = <img> + <h3> + <p>)
 *   - a cell with only <p>/<h2> eyebrow + heading        → section head (when authored inside)
 *   - anything else                                     → rich text (p / ul / strong / a)
 * The section head (eyebrow <p> + <h2>) is authored as DEFAULT CONTENT before the block and
 * reabsorbed into the head slot (EW8: the wrapper's children move, the wrapper goes).
 * Variants: `grey` ground, `band-white` / `band-grey` top band colour, `narrow-cta`.
 * Section shell: full-bleed wrapper, `band` on the section's first wrapper, `section-end`.
 * Unit hooks (replica units.json, never styled): amagCh-section-description, rich-text text >
 * cmp-text, amag-factBox > amag-farbBox, amag-vorteilsModul__subElementHeadline,
 * amag-iconTextBox__item, amag-otvCtaWrapper / amag-garageElectionOverlay.
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

const el = (className) => {
  const d = document.createElement('div');
  d.className = className;
  return d;
};

const text = (n) => (n ? n.textContent.trim() : '');
const isCta = (p) => {
  const a = p.querySelector('a');
  return !!a && text(a) !== '' && text(p) === text(a);
};
const hasMedia = (n) => !!n.querySelector('picture, img');

function shell(block, name) {
  const wrapper = block.parentElement;
  if (!wrapper || !wrapper.classList.contains(`${name}-wrapper`)) return;
  wrapper.classList.add(`${name}-bleed-wrapper`);
  const section = block.closest('.section');
  if (!section) return;
  const sections = [...section.parentElement.children]
    .filter((s) => s.classList.contains('section') && s.children.length);
  if (sections[0] === section) block.classList.add('first-section');
  if (!wrapper.previousElementSibling) block.classList.add('band');
  if (!wrapper.nextElementSibling) block.classList.add('section-end');
}

function buildHead(nodes) {
  const head = el('head amagCh-section-description');
  const row = el('head-row');
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  nodes.forEach((n) => {
    if (n === heading) row.append(wrapNode(n, 'headline'));
    else if (n.tagName === 'P') row.append(wrapNode(n, 'eyebrow'));
    else row.append(n);
  });
  head.append(row);
  return head;
}

function buildText(cell) {
  const outer = el('rich-text text');
  const prose = el('prose cmp-text');
  prose.append(...cell.childNodes);
  outer.append(prose);
  return outer;
}

function buildFacts(cells) {
  const facts = el('facts amag-factBox');
  cells.forEach((cell) => {
    const fact = el('fact amag-farbBox');
    const quote = cell.querySelector('blockquote');
    const box = el(`fact-box ${quote ? 'quote' : 'benefits'}`);
    if (quote) {
      const mod = el('quote-module');
      const parts = [...cell.children];
      const rest = parts.filter((n) => n !== quote);
      mod.append(wrapNode(quote, 'quote-text'));
      if (rest[0]) mod.append(wrapNode(rest[0], 'quote-author'));
      rest.slice(1).forEach((n) => mod.append(wrapNode(n, 'quote-by')));
      box.append(mod);
    } else {
      let seenTitle = false;
      [...cell.children].forEach((n) => {
        if (/^H[1-6]$/.test(n.tagName) && !seenTitle) {
          seenTitle = true;
          box.append(wrapNode(n, 'benefits-title'));
        } else if (/^H[1-6]$/.test(n.tagName)) {
          box.append(wrapNode(n, 'benefit-title amag-vorteilsModul__subElementHeadline'));
        } else {
          box.append(wrapNode(n, 'benefit-copy'));
        }
      });
    }
    fact.append(box);
    facts.append(fact);
  });
  return facts;
}

function buildTiles(cells) {
  const tiles = el('tiles amag-iconTextBox');
  let items = cells;
  if (cells.length && !hasMedia(cells[0])) {
    const heading = cells[0].querySelector('h1, h2, h3, h4');
    if (heading) tiles.append(wrapNode(heading, 'tiles-title'));
    items = cells.slice(1);
  }
  const row = el('tiles-row');
  items.forEach((cell) => {
    const tile = el('tile amag-iconTextBox__item');
    const media = cell.querySelector('picture, img');
    const heading = cell.querySelector('h1, h2, h3, h4, h5, h6');
    // move the whole authored <p> when it only carries the icon (else it stays as an empty p)
    const mediaBox = media && media.parentElement.tagName === 'P'
      && !media.parentElement.textContent.trim() ? media.parentElement : media;
    if (media) tile.append(wrapNode(mediaBox, 'tile-media'));
    if (heading) tile.append(wrapNode(heading, 'tile-title'));
    const copy = [...cell.querySelectorAll('p, ul, ol')].filter((n) => !hasMedia(n));
    if (copy.length) {
      const d = el('tile-copy');
      d.append(...copy);
      tile.append(d);
    }
    row.append(tile);
  });
  tiles.append(row);
  return tiles;
}

function buildCta(cell, narrow) {
  const cta = el(`cta ${narrow ? 'amag-garageElectionOverlay' : 'amag-otvCtaWrapper'}`);
  const box = el('cta-box');
  const ps = [...cell.querySelectorAll('p')];
  const ctas = ps.filter(isCta);
  const notes = ps.filter((p) => !isCta(p) && !hasMedia(p));
  ctas.forEach((p) => {
    const a = p.querySelector('a');
    const icon = p.querySelector('picture, img');
    if (icon && !a.contains(icon)) a.prepend(icon);
  });
  if (ctas.length) {
    const actions = el('actions');
    actions.append(...ctas);
    box.append(actions);
  }
  if (notes.length) {
    const note = el('note');
    note.append(...notes);
    box.append(note);
  }
  cta.append(box);
  return cta;
}

function classify(row) {
  const cells = [...row.children];
  if (!cells.length) return null;
  if (cells.length >= 2 && cells.slice(1).every(hasMedia)) return 'tiles';
  if (cells.length === 2 && cells.some((c) => c.querySelector('blockquote'))) return 'facts';
  const cell = cells[0];
  const ps = [...cell.querySelectorAll('p')];
  if (hasMedia(cell) && text(cell) === '') return 'image';
  if (ps.some(isCta) && ps.every((p) => isCta(p) || !p.querySelector('a'))
    && !cell.querySelector('ul, ol, h1, h2, h3, h4, h5, h6')) return 'cta';
  const heading = cell.querySelector('h1, h2, h3, h4');
  if (heading && [...cell.children].every((n) => n === heading
    || (n.tagName === 'P' && text(n).length < 60 && !n.querySelector('a')))) return 'head';
  return 'text';
}

export default function decorate(block) {
  const narrow = block.classList.contains('narrow-cta');
  const wrap = el('wrap');
  const wrapper = block.parentElement;
  const prev = wrapper ? wrapper.previousElementSibling : null;
  if (prev && prev.classList.contains('default-content-wrapper')) {
    wrap.append(buildHead([...prev.children]));
    prev.remove();
  }
  let lastFacts = null;
  [...block.children].forEach((row) => {
    const kind = classify(row);
    const cells = [...row.children];
    if (kind === 'head') {
      wrap.append(buildHead([...cells[0].children]));
    } else if (kind === 'text') {
      wrap.append(buildText(cells[0]));
    } else if (kind === 'facts') {
      lastFacts = buildFacts(cells);
      wrap.append(lastFacts);
    } else if (kind === 'tiles') {
      const tiles = buildTiles(cells);
      if (lastFacts && lastFacts === wrap.lastElementChild) lastFacts.append(tiles);
      else wrap.append(tiles);
    } else if (kind === 'image') {
      wrap.append(wrapNode(cells[0].querySelector('picture, img'), 'figure amag-textImage'));
    } else if (kind === 'cta') {
      wrap.append(buildCta(cells[0], narrow));
    }
    if (kind !== 'facts') lastFacts = kind === 'tiles' ? lastFacts : null;
  });
  block.replaceChildren(wrap);
  shell(block, 'long-form-article');
}
