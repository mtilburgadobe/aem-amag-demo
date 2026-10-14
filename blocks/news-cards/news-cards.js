/**
 * news-cards — the home teaser card groups (schema `stardust/eds-schema/en-html.json`
 * sections 1 and 2). Reconstructive, ONE ROW PER CARD; the section head (eyebrow <p>, <h2>,
 * optional group <h4>) is authored as DEFAULT CONTENT before the block and reabsorbed (EW8).
 * Default look = the "AMAG NEWS" promotion tiles (prototype `.amag-promotionTeaser` ×9,
 * 2-up, coloured ground, first four shown, the rest behind "Show more"). Cells by role:
 *   - first <picture>/<img>: the 2:1 tile image; a second one is the AMAG badge
 *   - a short <p> BEFORE the heading: the topline; <h3>: the title; other <p>: the copy
 *   - link-bearing <p>: the tile link — the tile is that link (EW6, inner anchor unwrapped)
 *   - a cell holding only a colour word (green | dark-grey | violet | light-blue | dark-blue):
 *     the ground colour (@ew-exempt metadata: variant selector, hidden)
 *   - a trailing row with ONE <p> and no heading/link/image: the "Show more" label — moved into
 *     a text-less toggle row (EW7: the row takes the click, no <button> hosts the text)
 * `carousel` variant = the `.amag-contentTeaserS` strips (3-up, grey cards, previous/next
 * arrows + position counter). @ew-exempt derived: the counter numerals ("1 / 4") are
 * derived from state, never authored.
 * Unit hooks: `amag-promotionTeaser` / `amag-contentTeaserS` on each card.
 */

const COLOURS = {
  green: 'var(--amag-green)',
  'dark-grey': 'var(--amag-dark-grey)',
  violet: 'var(--amag-violet)',
  'light-blue': 'var(--amag-light-blue)',
  'dark-blue': 'var(--amag-dark-blue)',
  black: 'var(--amag-black)',
};

const ICONS = {
  more: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" '
    + 'xmlns="http://www.w3.org/2000/svg"><path d="M15.3043 32C14.5363 32 13.913 31.3767 13.913 '
    + '30.6087V18.087H1.3913C0.623304 18.087 0 17.4637 0 16.6957C0 15.9277 0.623304 15.3043 '
    + '1.3913 15.3043H13.913V1.3913C13.913 0.623304 14.5363 0 15.3043 0C16.0723 0 16.6957 0.623304 '
    + '16.6957 1.3913V15.3043H30.6087C31.3767 15.3043 32 15.9277 32 16.6957C32 17.4637 31.3767 '
    + '18.087 30.6087 18.087H16.6957V30.6087C16.6957 31.3767 16.0723 32 15.3043 32Z" '
    + 'fill="#fff"/></svg>',
  prev: '<svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true" '
    + 'xmlns="http://www.w3.org/2000/svg"><path d="M21.2646 0C21.5099 0 21.7432 0.108 21.9032 '
    + '0.288C22.2112 0.644 22.1779 1.168 21.8366 1.468L2.80788 18.667H39.1832C39.6352 18.667 '
    + '39.9999 19.0317 39.9999 19.4837C39.9999 19.9357 39.6352 20.3003 39.1832 20.3003H2.80788'
    + 'L21.8366 37.4997C22.0046 37.6477 22.1046 37.8517 22.1192 38.0757C22.1326 38.2997 22.0592 '
    + '38.5157 21.9112 38.6837C21.7552 38.8637 21.5272 38.9677 21.2899 38.9677C21.0872 38.9677 '
    + '20.8926 38.8943 20.7419 38.7597L1.42655 21.5283C0.966548 21.1057 0.823215 20.4017 0.823215 '
    + '19.4837C0.823215 18.5657 0.966548 17.8617 1.42655 17.4383L20.7419 0.207C20.8926 0.0723 '
    + '21.0859 0 21.2646 0Z" fill="#000"/></svg>',
  next: '<svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true" '
    + 'xmlns="http://www.w3.org/2000/svg"><path d="M18.7354 40C18.4901 40 18.2568 39.892 '
    + '18.0968 39.712C17.7888 39.356 17.8221 38.832 18.1634 38.532L37.1921 21.333H0.816798'
    + 'C0.364798 21.333 0.000131687 20.9683 0.000131687 20.5163C0.000131687 20.0643 0.364798 '
    + '19.6997 0.816798 19.6997H37.1921L18.1634 2.50034C17.9954 2.35234 17.8954 2.14834 17.8808 '
    + '1.92434C17.8674 1.70034 17.9408 1.48434 18.0888 1.31634C18.2448 1.13634 18.4728 1.03234 '
    + '18.7101 1.03234C18.9128 1.03234 19.1074 1.10567 19.2581 1.24034L38.5734 18.4717C39.0334 '
    + '18.8943 39.1768 19.5983 39.1768 20.5163C39.1768 21.4343 39.0334 22.1383 38.5734 22.5617'
    + 'L19.2581 39.793C19.1074 39.9277 18.9141 40 18.7354 40Z" fill="#000"/></svg>',
};

const VISIBLE_TILES = 4;

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

const el = (className, tag = 'div') => {
  const d = document.createElement(tag);
  d.className = className;
  return d;
};

const text = (n) => (n ? n.textContent.trim() : '');

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

function buildHead(nodes, carousel) {
  const head = el('head');
  const heading = nodes.find((n) => /^H[1-3]$/.test(n.tagName));
  const group = nodes.find((n) => /^H[4-6]$/.test(n.tagName));
  const section = el(carousel ? 'section-head amagCh-section-description' : 'section-head');
  const row = el('section-head-row');
  nodes.forEach((n) => {
    if (n === group) return;
    if (n === heading) row.append(wrapNode(n, 'headline'));
    else if (n.tagName === 'P') row.append(wrapNode(n, 'eyebrow'));
    else row.append(n);
  });
  if (row.children.length) {
    section.append(row);
    head.append(section);
  }
  if (group) {
    const g = wrapNode(group, 'group-head');
    g.classList.add(carousel ? 'amagCh-carousel-head' : 'group-head-tiles');
    head.append(g);
  }
  return head;
}

function isColourCell(cell) {
  const word = text(cell).toLowerCase();
  return !!COLOURS[word] && !cell.querySelector('a, picture, img, h1, h2, h3, h4');
}

function buildCard(row, carousel) {
  const colourCell = [...row.children].find(isColourCell);
  const link = row.querySelector('a[href]');
  const linkPar = link ? link.closest('p') : null;
  const card = el(carousel ? 'card' : 'card amag-promotionTeaser');
  const body = el(carousel ? 'card-body amag-contentTeaserS' : 'card-body amag-promotionTeaser__wrapper');
  const host = link && !carousel ? el('card-link text-decoration-none', 'a') : el('card-link');
  if (link && !carousel) host.href = link.getAttribute('href');
  if (colourCell) {
    body.style.setProperty('--card-ground', COLOURS[text(colourCell).toLowerCase()]);
    const meta = wrapNode(colourCell.querySelector('p') || colourCell, 'card-meta');
    meta.hidden = true;
    card.append(meta);
  }
  const pictures = [...row.querySelectorAll('picture, img')]
    .filter((m) => !m.closest('picture img') && !m.closest('a'));
  const heading = row.querySelector('h1, h2, h3, h4');
  const ps = [...row.querySelectorAll('p')]
    .filter((p) => !p.querySelector('picture, img') && p !== linkPar
      && !(colourCell && colourCell.contains(p)));
  const order = [...row.querySelectorAll('h1, h2, h3, h4, p')];
  const topline = heading && ps[0] && text(ps[0]).length < 60
    && order.indexOf(ps[0]) < order.indexOf(heading) ? ps.shift() : null;
  if (pictures[0]) host.append(wrapNode(pictures[0], 'card-media'));
  const textBox = el('card-text');
  const top = el('card-top');
  if (topline) top.append(wrapNode(topline, 'topline'));
  if (heading) top.append(wrapNode(heading, 'title'));
  if (ps.length) {
    const copy = el('copy');
    copy.append(...ps);
    top.append(copy);
  }
  textBox.append(top);
  if (linkPar) {
    if (!carousel) link.replaceWith(...link.childNodes);
    textBox.append(wrapNode(linkPar, 'card-cta'));
  }
  host.append(textBox);
  body.append(host);
  if (pictures[1]) body.append(wrapNode(pictures[1], 'card-badge'));
  card.append(body);
  return card;
}

function isMoreRow(row) {
  const ps = row.querySelectorAll('p');
  return ps.length === 1 && !row.querySelector('a, picture, img, h1, h2, h3, h4, ul, ol')
    && text(row).length < 40;
}

function buildMore(row, cards, hidden) {
  const more = el('show-more');
  more.setAttribute('role', 'button');
  more.tabIndex = 0;
  more.setAttribute('aria-expanded', 'false');
  const glyph = el('glyph', 'span');
  glyph.innerHTML = ICONS.more;
  more.append(glyph, wrapNode(row.querySelector('p'), 'show-more-label'));
  const reveal = () => {
    hidden.forEach((c) => c.classList.remove('is-hidden'));
    more.setAttribute('aria-expanded', 'true');
    more.classList.add('is-done');
  };
  more.addEventListener('click', reveal);
  more.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      reveal();
    }
  });
  return more;
}

function buildActions(strip, cards) {
  const actions = el('actions cmp-carousel__actions');
  const prev = el('action action-previous', 'button');
  prev.type = 'button';
  prev.setAttribute('aria-label', 'Previous');
  prev.innerHTML = ICONS.prev;
  const next = el('action action-next', 'button');
  next.type = 'button';
  next.setAttribute('aria-label', 'Next');
  next.innerHTML = ICONS.next;
  const counter = el('counter');
  counter.setAttribute('aria-live', 'polite');
  const index = el('counter-index', 'span');
  const slash = el('counter-slash', 'span');
  slash.textContent = '/';
  const total = el('counter-total', 'span');
  total.textContent = String(cards.length);
  counter.append(index, slash, total);
  actions.append(prev, next, counter);
  let current = 0;
  const show = (n) => {
    current = Math.max(0, Math.min(cards.length - 1, n));
    cards.forEach((c, k) => {
      c.classList.toggle('active', k === current);
      c.classList.toggle('cmp-carousel__item--active', k === current);
    });
    index.textContent = String(current + 1);
    strip.style.setProperty('--strip-index', String(current));
    prev.disabled = current === 0;
    next.disabled = current === cards.length - 1;
  };
  prev.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  show(0);
  return actions;
}

export default function decorate(block) {
  const carousel = block.classList.contains('carousel');
  const rows = [...block.children];
  if (!rows.length) return;
  const wrap = el('wrap');
  const wrapper = block.parentElement;
  const prev = wrapper ? wrapper.previousElementSibling : null;
  if (prev && prev.classList.contains('default-content-wrapper')) {
    wrap.append(buildHead([...prev.children], carousel));
    prev.remove();
  }
  const moreRow = !carousel && rows.length > 1 && isMoreRow(rows[rows.length - 1])
    ? rows.pop() : null;
  const strip = el(carousel ? 'cards cmp-carousel__items' : 'cards');
  const cards = rows.map((row) => buildCard(row, carousel));
  cards.forEach((card, k) => {
    if (carousel) card.classList.add('cmp-carousel__item');
    else if (k >= VISIBLE_TILES) card.classList.add('is-hidden');
    strip.append(card);
  });
  const hidden = cards.filter((c) => c.classList.contains('is-hidden'));
  if (carousel) {
    const box = el('strip amagCh-carousel');
    box.append(strip);
    wrap.append(buildActions(strip, cards), box);
  } else {
    wrap.append(strip);
    if (moreRow && hidden.length) wrap.append(buildMore(moreRow, cards, hidden));
  }
  block.replaceChildren(wrap);
  shell(block, 'news-cards');
}
