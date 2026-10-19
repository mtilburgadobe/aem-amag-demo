/**
 * news-cards-articles — the dated "aktuelles" news list of the German home page (live
 * `.amag-newsTeaser`: a white box of article rows — date, linked title, "Mehr erfahren" link,
 * 1:1 thumbnail on the right — first three shown, "Weitere Beiträge anzeigen" reveals the
 * rest). Forked from news-cards (same section-head reabsorption and "show more" convention);
 * it does not share CSS with the base block.
 *
 * Authoring: ONE ROW PER ARTICLE, cells read by role, never by index:
 *   - <picture>/<img>: the 1:1 thumbnail (optional)
 *   - a short <p> before the title with no link: the date (dd.mm.yyyy → <time datetime>)
 *   - <h2>–<h6>: the title; its link (if any) stays the title link
 *     (no heading: a link-bearing <p> before the CTA is promoted to the title)
 *   - a link-bearing <p> after the title: the "Mehr erfahren" CTA (stays an authored text link)
 *   - any other <p>: an optional excerpt
 * A trailing row with one short <p> and no link/heading/image is the "show more" label; an
 * optional second <p> in that row is the "show less" label (the toggle then collapses again).
 * The section head (eyebrow <p>, <h2>, lede <p>) is DEFAULT CONTENT directly before the block
 * and is reabsorbed into the block head.
 * Defensive: Document Authoring may unwrap single-paragraph cells (bare text is re-wrapped in
 * <p>) and split one formatted link into several adjacent anchors (merged back by href).
 */
import { createOptimizedPicture } from '../../scripts/aem.js';

const VISIBLE = 3;

const PLUS = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" '
  + 'focusable="false" xmlns="http://www.w3.org/2000/svg"><path d="M15.3043 32C14.5363 32 '
  + '13.913 31.3767 13.913 30.6087V18.087H1.3913C0.623304 18.087 0 17.4637 0 16.6957C0 15.9277 '
  + '0.623304 15.3043 1.3913 15.3043H13.913V1.3913C13.913 0.623304 14.5363 0 15.3043 0C16.0723 '
  + '0 16.6957 0.623304 16.6957 1.3913V15.3043H30.6087C31.3767 15.3043 32 15.9277 32 16.6957C32 '
  + '17.4637 31.3767 18.087 30.6087 18.087H16.6957V30.6087C16.6957 31.3767 16.0723 32 15.3043 '
  + '32Z" fill="#fff"/></svg>';

const MINUS = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" '
  + 'focusable="false" xmlns="http://www.w3.org/2000/svg"><path d="M1.3913 18.087C0.6233 18.087 '
  + '0 17.4637 0 16.6957C0 15.9277 0.6233 15.3043 1.3913 15.3043H30.6087C31.3767 15.3043 32 '
  + '15.9277 32 16.6957C32 17.4637 31.3767 18.087 30.6087 18.087H1.3913Z" fill="#fff"/></svg>';

const HEADING = 'h1, h2, h3, h4, h5, h6';
const DATE_RE = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/;

const el = (className, tag = 'div') => {
  const d = document.createElement(tag);
  if (className) d.className = className;
  return d;
};

function wrapNode(node, className, tag = 'div') {
  const w = el(className, tag);
  w.append(node);
  return w;
}

const text = (n) => (n ? n.textContent.replace(/\s+/g, ' ').trim() : '');

/* DA unwraps a cell holding one paragraph: re-wrap loose inline content in <p> */
function normalizeCell(cell) {
  const blockTags = /^(P|H[1-6]|UL|OL|PICTURE|DIV|TABLE|BLOCKQUOTE|PRE)$/;
  let run = null;
  [...cell.childNodes].forEach((node) => {
    const inline = node.nodeType === Node.TEXT_NODE
      || (node.nodeType === Node.ELEMENT_NODE && !blockTags.test(node.tagName));
    if (inline) {
      if (!run) {
        if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
        run = document.createElement('p');
        node.before(run);
      }
      run.append(node);
    } else {
      run = null;
    }
  });
}

/* DA can split one formatted link into adjacent anchors with the same href: merge them */
function mergeSplitLinks(root) {
  // <strong><a>x</a></strong> → <a><strong>x</strong></a>, so link fragments become siblings
  root.querySelectorAll('a[href]').forEach((a) => {
    let parent = a.parentElement;
    while (parent && /^(STRONG|EM|B|I|U|SPAN)$/.test(parent.tagName)
      && parent.childNodes.length === 1) {
      const fmt = parent;
      parent = fmt.parentElement;
      fmt.replaceWith(a);
      fmt.append(...a.childNodes);
      a.append(fmt);
    }
  });
  root.querySelectorAll('a[href]').forEach((a) => {
    if (!a.isConnected) return;
    let next = a.nextSibling;
    const gap = [];
    while (next) {
      if (next.nodeType === Node.TEXT_NODE && !next.textContent.trim()) {
        gap.push(next);
        next = next.nextSibling;
      } else if (next.nodeType === Node.ELEMENT_NODE && next.tagName === 'A'
        && next.getAttribute('href') === a.getAttribute('href')) {
        a.append(...gap.splice(0), ...next.childNodes);
        const after = next.nextSibling;
        next.remove();
        next = after;
      } else {
        break;
      }
    }
  });
}

const isLinkPar = (p) => {
  const a = p.querySelector('a[href]');
  return !!a && text(p) !== '' && text(p) === text(a);
};

function optimize(media) {
  const img = media.tagName === 'IMG' ? media : media.querySelector('img');
  if (!img) return media;
  let local = false;
  try {
    const url = new URL(img.getAttribute('src'), window.location.href);
    local = url.origin === window.location.origin;
  } catch { /* keep as authored */ }
  if (!local) {
    img.loading = 'lazy';
    return media;
  }
  return createOptimizedPicture(img.src, img.alt || '', false, [{ width: '330' }]);
}

function buildHead(nodes) {
  const head = el('head');
  const heading = nodes.find((n) => /^H[1-3]$/.test(n.tagName));
  const order = nodes.indexOf(heading);
  const row = el('head-row');
  const rest = [];
  nodes.forEach((n, k) => {
    if (n === heading) row.append(wrapNode(n, 'headline'));
    else if (n.tagName === 'P' && heading && k < order && !n.querySelector('picture, img')) {
      row.append(wrapNode(n, 'eyebrow'));
    } else rest.push(n);
  });
  if (row.children.length) head.append(row);
  if (rest.length) {
    const lede = el('lede');
    lede.append(...rest);
    head.append(lede);
  }
  return head;
}

function toTime(p) {
  const value = text(p);
  const m = value.match(DATE_RE);
  const time = document.createElement('time');
  if (m) time.dateTime = `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  time.append(...p.childNodes);
  p.append(time);
  return p;
}

function buildArticle(row, titleTag) {
  [...row.children].forEach(normalizeCell);
  mergeSplitLinks(row);
  const item = el('article', 'li');
  const article = el('article-body', 'article');
  const media = [...row.querySelectorAll('picture, img')]
    .find((m) => !m.closest('picture img') && !m.closest('a'));
  let heading = row.querySelector(HEADING);
  const ps = [...row.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img')
    && !(heading && heading.contains(p)) && text(p) !== '');
  const order = [...row.querySelectorAll(`${HEADING}, p`)];
  const linkPars = ps.filter(isLinkPar);
  if (!heading && linkPars.length) {
    // no heading authored: the first link paragraph (when another one follows, or it is
    // longer than a short CTA) is the title
    const candidate = linkPars[0];
    if (linkPars.length > 1 || text(candidate).length > 30) {
      heading = candidate;
      linkPars.shift();
      ps.splice(ps.indexOf(candidate), 1);
    }
  }
  const headIdx = heading ? order.indexOf(heading) : -1;
  const before = (p) => headIdx === -1 || order.indexOf(p) < headIdx;
  const date = ps.find((p) => !isLinkPar(p) && !p.querySelector('a') && before(p)
    && (DATE_RE.test(text(p)) || text(p).length <= 30));
  const cta = linkPars.find((p) => !before(p) || headIdx === -1);
  const copy = ps.filter((p) => p !== date && p !== cta && !linkPars.includes(p));
  const extraLinks = linkPars.filter((p) => p !== cta);

  // decorateButtons may have turned a formatted title/CTA link into a CTA button: undo it
  row.querySelectorAll('a.button').forEach((a) => a.classList.remove('button', 'primary', 'secondary', 'accent'));
  row.querySelectorAll('p.button-wrapper').forEach((p) => p.classList.remove('button-wrapper'));

  const info = el('info');
  if (date) info.append(wrapNode(toTime(date), 'date'));
  if (heading) {
    const title = el('title');
    if (heading.tagName === 'P') {
      const h = document.createElement(titleTag);
      h.append(...heading.childNodes);
      heading = h;
    }
    title.append(heading);
    info.append(title);
  }
  if (copy.length || extraLinks.length) {
    const c = el('copy');
    c.append(...copy, ...extraLinks);
    info.append(c);
  }
  if (cta) {
    const titleLink = heading ? heading.querySelector('a[href]') : null;
    const ctaLink = cta.querySelector('a[href]');
    // a "Mehr erfahren" duplicate of the title link reads the same for screen readers:
    // describe it by the title instead of repeating the generic label
    if (titleLink && ctaLink && titleLink.getAttribute('href') === ctaLink.getAttribute('href')
      && !ctaLink.getAttribute('aria-label')) {
      ctaLink.setAttribute('aria-label', `${text(ctaLink)}: ${text(heading)}`);
      ctaLink.removeAttribute('title');
    }
    info.append(wrapNode(cta, 'cta'));
  }
  article.append(info);
  if (media) article.append(wrapNode(optimize(media), 'media'));
  item.append(article);
  return item;
}

function isMoreRow(row) {
  const ps = [...row.querySelectorAll('p')].filter((p) => text(p) !== '');
  const loose = ps.length === 0 && text(row) !== '' && text(row).length < 60;
  return (loose || (ps.length >= 1 && ps.length <= 2))
    && !row.querySelector(`a, picture, img, ul, ol, ${HEADING}`)
    && ps.every((p) => text(p).length < 60);
}

function buildToggle(row, list, items) {
  [...row.children].forEach(normalizeCell);
  const [moreP, lessP] = [...row.querySelectorAll('p')].filter((p) => text(p) !== '');
  const hidden = items.slice(VISIBLE);
  const toggle = el('show-more');
  toggle.setAttribute('role', 'button');
  toggle.tabIndex = 0;
  toggle.setAttribute('aria-expanded', 'false');
  if (list.id) toggle.setAttribute('aria-controls', list.id);
  const glyph = el('glyph', 'span');
  glyph.innerHTML = PLUS;
  const more = wrapNode(moreP, 'label label-more');
  toggle.append(glyph, more);
  let less = null;
  if (lessP) {
    less = wrapNode(lessP, 'label label-less');
    less.hidden = true;
    toggle.append(less);
  }
  const set = (open) => {
    hidden.forEach((item) => { item.hidden = !open; });
    toggle.setAttribute('aria-expanded', String(open));
    if (less) {
      more.hidden = open;
      less.hidden = !open;
      glyph.innerHTML = open ? MINUS : PLUS;
    }
  };
  const activate = () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    if (!open && !less) return;
    set(open);
    if (open) {
      // move focus to the first revealed article so keyboard users land on new content
      const target = hidden[0] && hidden[0].querySelector('a[href]');
      if (target) target.focus();
      if (!less) toggle.hidden = true;
    }
  };
  toggle.addEventListener('click', activate);
  toggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      activate();
    }
  });
  set(false);
  return toggle;
}

function shell(block, name) {
  const wrapper = block.parentElement;
  if (!wrapper || !wrapper.classList.contains(`${name}-wrapper`)) return;
  wrapper.classList.add(`${name}-bleed-wrapper`);
  if (!wrapper.previousElementSibling) block.classList.add('band');
  if (!wrapper.nextElementSibling) block.classList.add('section-end');
}

let instance = 0;

export default function decorate(block) {
  const rows = [...block.children];
  const wrap = el('wrap');
  const wrapper = block.parentElement;
  const prev = wrapper ? wrapper.previousElementSibling : null;
  if (prev && prev.classList.contains('default-content-wrapper') && prev.children.length) {
    wrap.append(buildHead([...prev.children]));
    prev.remove();
  }
  const moreRow = rows.length > 1 && isMoreRow(rows[rows.length - 1]) ? rows.pop() : null;
  const articleRows = rows.filter((row) => text(row) !== '' || row.querySelector('picture, img'));

  instance += 1;
  const list = el('articles', 'ul');
  list.id = `news-cards-articles-list-${instance}`;
  // a title authored without heading takes the level the other articles use (default h3)
  const authored = block.querySelector('h2, h3, h4, h5, h6');
  const titleTag = authored ? authored.tagName.toLowerCase() : 'h3';
  const items = articleRows.map((row) => buildArticle(row, titleTag));
  list.append(...items);
  const box = wrapNode(list, 'list');
  wrap.append(box);
  if (items.length > VISIBLE) {
    if (moreRow) wrap.append(buildToggle(moreRow, list, items));
    else box.classList.add('show-all');
  }
  block.replaceChildren(wrap);
  shell(block, 'news-cards-articles');
}
