/**
 * news-cards-services — the garage page's "Weitere Services" carousel (live `.amagCh-carousel`
 * of `.amag-serviceBoxWrapper` boxes, /de/garagenuebersicht/garage-buelach.html section 9,
 * tab "AMAG Dienstleistungen"). A services variant of the `news-cards` carousel: previous /
 * next arrows (≥ 1200) + "1 / 7" counter above a strip of grey service boxes (3-up ≥ 768 with
 * the next one peeking, 1-up below, swipeable); the active box is 40 px taller.
 * The carousel head is DEFAULT CONTENT before the block and is reabsorbed (EW8):
 *   - <h4> (or <h5>/<h6>): the carousel headline; a plain <p> after it: the subtext;
 *     a link <p>: the head link (violet, right-aligned ≥ 768)
 *   - an eyebrow <p> + <h2> (if authored there too): the section head (eyebrow | headline)
 *
 * ONE ROW PER BOX; cells read by role, never by index (Document Authoring may unwrap a
 * single-paragraph cell into bare inline content):
 *   - <picture>/<img>: the 40 px service icon
 *   - <h2>/<h3>/<h4> (or a <strong> paragraph before the text): the box title
 *   - link-bearing <p>: the text link ("Zur Autowäsche", dark blue, underlined); split links
 *     with the same href are merged
 *   - any other <p>: the box text
 * EW7: the arrows are text-less <button>s; the counter numerals are derived from state
 * (@ew-exempt derived). Section shell: full-bleed wrapper (`news-cards-services-bleed-wrapper`),
 * `band` on the section's first wrapper, `section-end` on its last.
 * Unit hooks: `amagCh-carousel` on the strip, `amag-serviceBoxWrapper` per box.
 */

const ARROW_PATH = {
  prev: 'M21.2646 0C21.5099 0 21.7432 0.108 21.9032 0.288C22.2112 0.644 22.1779 1.168 21.8366 '
    + '1.468L2.80788 18.667H39.1832C39.6352 18.667 39.9999 19.0317 39.9999 19.4837C39.9999 '
    + '19.9357 39.6352 20.3003 39.1832 20.3003H2.80788L21.8366 37.4997C22.0046 37.6477 22.1046 '
    + '37.8517 22.1192 38.0757C22.1326 38.2997 22.0592 38.5157 21.9112 38.6837C21.7552 38.8637 '
    + '21.5272 38.9677 21.2899 38.9677C21.0872 38.9677 20.8926 38.8943 20.7419 38.7597L1.42655 '
    + '21.5283C0.966548 21.1057 0.823215 20.4017 0.823215 19.4837C0.823215 18.5657 0.966548 '
    + '17.8617 1.42655 17.4383L20.7419 0.207C20.8926 0.0723 21.0859 0 21.2646 0Z',
  next: 'M18.7354 40C18.4901 40 18.2568 39.892 18.0968 39.712C17.7888 39.356 17.8221 38.832 '
    + '18.1634 38.532L37.1921 21.333H0.816798C0.364798 21.333 0.000131687 20.9683 0.000131687 '
    + '20.5163C0.000131687 20.0643 0.364798 19.6997 0.816798 19.6997H37.1921L18.1634 2.50034'
    + 'C17.9954 2.35234 17.8954 2.14834 17.8808 1.92434C17.8674 1.70034 17.9408 1.48434 18.0888 '
    + '1.31634C18.2448 1.13634 18.4728 1.03234 18.7101 1.03234C18.9128 1.03234 19.1074 1.10567 '
    + '19.2581 1.24034L38.5734 18.4717C39.0334 18.8943 39.1768 19.5983 39.1768 20.5163C39.1768 '
    + '21.4343 39.0334 22.1383 38.5734 22.5617L19.2581 39.793C19.1074 39.9277 18.9141 40 18.7354 '
    + '40Z',
};

const arrow = (dir) => '<svg width="40" height="40" viewBox="0 0 40 40" fill="none" '
  + `aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="${ARROW_PATH[dir]}" `
  + 'fill="currentColor"/></svg>';

const el = (className, tag = 'div') => {
  const d = document.createElement(tag);
  if (className) d.className = className;
  return d;
};

const text = (n) => (n ? n.textContent.trim() : '');

function wrapNode(node, className) {
  const w = el(className);
  w.append(node);
  return w;
}

/* Document Authoring may hand a cell over as bare inline content: re-wrap it in a <p>. */
function normaliseCell(cell) {
  const blockish = 'p, h1, h2, h3, h4, h5, h6, ul, ol, div, picture, blockquote';
  let loose = null;
  [...cell.childNodes].forEach((n) => {
    const isBlock = n.nodeType === Node.ELEMENT_NODE && n.matches(blockish);
    if (isBlock) {
      loose = null;
      return;
    }
    if (n.nodeType === Node.TEXT_NODE && !n.textContent.trim()) {
      if (loose) loose.append(n);
      return;
    }
    if (!loose) {
      loose = document.createElement('p');
      n.before(loose);
    }
    loose.append(n);
  });
}

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

const isLinkPar = (p) => {
  const a = p.querySelector('a[href]');
  return !!a && text(a) !== '' && text(p) === text(a);
};

function buildHead(nodes) {
  const head = el('head');
  const heading = nodes.find((n) => /^H[1-3]$/.test(n.tagName));
  const group = nodes.find((n) => /^H[4-6]$/.test(n.tagName));
  const sectionHead = el('section-head');
  const row = el('section-head-row');
  const groupHead = el('group-head amagCh-carousel-description');
  nodes.forEach((n) => {
    const afterGroup = group && nodes.indexOf(n) > nodes.indexOf(group);
    if (n === group) groupHead.append(wrapNode(n, 'group-title'));
    else if (n === heading) row.append(wrapNode(n, 'headline'));
    else if (n.tagName === 'P' && isLinkPar(n)) {
      const a = n.querySelector('a');
      a.classList.remove('button', 'primary', 'secondary', 'accent');
      a.className = 'group-link';
      groupHead.append(wrapNode(a, 'group-link-wrap'));
    } else if (n.tagName === 'P' && (afterGroup || !heading)) {
      groupHead.append(wrapNode(n, 'group-text'));
    } else if (n.tagName === 'P') row.append(wrapNode(n, 'eyebrow'));
    else row.append(n);
  });
  if (row.children.length) {
    sectionHead.append(row);
    head.append(sectionHead);
  }
  if (groupHead.children.length) head.append(groupHead);
  return head;
}

function buildCard(row) {
  row.querySelectorAll(':scope > div').forEach(normaliseCell);
  const card = el('card cmp-carousel__item');
  const box = el('card-body amag-serviceBoxWrapper');
  const icon = [...row.querySelectorAll('picture, img')]
    .find((m) => !(m.tagName === 'IMG' && m.closest('picture')));
  const ps = [...row.querySelectorAll('p')];
  // merge split links (same href) inside a paragraph
  ps.forEach((p) => {
    const links = [...p.querySelectorAll('a[href]')];
    links.slice(1).forEach((a) => {
      if (a.getAttribute('href') === links[0].getAttribute('href')) {
        links[0].append(...a.childNodes);
        a.remove();
      }
    });
  });
  let heading = row.querySelector('h1, h2, h3, h4, h5, h6');
  const textPs = ps.filter((p) => !p.querySelector('picture, img') && text(p) && !isLinkPar(p));
  if (!heading) {
    const strongP = textPs.find((p) => {
      const b = p.querySelector('strong, b');
      return b && text(b) === text(p);
    });
    if (strongP) {
      heading = strongP;
      textPs.splice(textPs.indexOf(strongP), 1);
    }
  }
  const linkP = ps.find(isLinkPar);

  if (icon) {
    const img = icon.tagName === 'IMG' ? icon : icon.querySelector('img');
    if (img) img.loading = 'lazy';
    box.append(wrapNode(icon, 'card-icon'));
  }
  if (heading) box.append(wrapNode(heading, 'title'));
  if (textPs.length) {
    const copy = el('copy');
    copy.append(...textPs);
    box.append(copy);
  }
  if (linkP) {
    const a = linkP.querySelector('a');
    a.classList.remove('button', 'primary', 'secondary', 'accent');
    linkP.classList.remove('button-wrapper');
    box.append(wrapNode(linkP, 'card-cta'));
  }
  card.append(box);
  return card;
}

function buildActions(strip, cards) {
  const actions = el('actions cmp-carousel__actions');
  const prev = el('action action-previous', 'button');
  prev.type = 'button';
  prev.setAttribute('aria-label', 'Previous');
  prev.innerHTML = arrow('prev');
  const next = el('action action-next', 'button');
  next.type = 'button';
  next.setAttribute('aria-label', 'Next');
  next.innerHTML = arrow('next');
  const counter = el('counter');
  counter.setAttribute('aria-live', 'polite');
  const index = el('counter-index', 'span');
  const slash = el('counter-slash', 'span');
  slash.textContent = ' / ';
  const total = el('counter-total', 'span');
  total.textContent = String(cards.length);
  counter.append(index, slash, total);
  actions.append(prev, next, counter);

  const track = strip.querySelector('.cards');
  let current = 0;
  const place = () => {
    const x = cards[current].offsetLeft - cards[0].offsetLeft;
    track.style.transform = x ? `translateX(${-x}px)` : '';
  };
  const show = (n) => {
    current = Math.max(0, Math.min(cards.length - 1, n));
    cards.forEach((c, k) => {
      c.classList.toggle('active', k === current);
      c.classList.toggle('cmp-carousel__item--active', k === current);
    });
    index.textContent = String(current + 1);
    prev.disabled = current === 0;
    next.disabled = current === cards.length - 1;
    place();
  };
  prev.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  let startX = null;
  strip.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  strip.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    startX = null;
    if (Math.abs(dx) > 40) show(current + (dx < 0 ? 1 : -1));
  });
  window.addEventListener('resize', place);
  show(0);
  if (cards.length < 2) actions.hidden = true;
  return actions;
}

export default function decorate(block) {
  const rows = [...block.children].filter((r) => text(r) || r.querySelector('picture, img'));
  const wrap = el('wrap');
  const wrapper = block.parentElement;
  const prevWrapper = wrapper ? wrapper.previousElementSibling : null;
  if (prevWrapper && prevWrapper.classList.contains('default-content-wrapper')) {
    wrap.append(buildHead([...prevWrapper.children]));
    prevWrapper.remove();
  }
  const cards = rows.map(buildCard);
  if (cards.length) {
    const strip = el('strip amagCh-carousel');
    const track = el('cards cmp-carousel__items');
    track.append(...cards);
    strip.append(track);
    wrap.append(buildActions(strip, cards), strip);
  }
  block.replaceChildren(wrap);
  shell(block, 'news-cards-services');
}
