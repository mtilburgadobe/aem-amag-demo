/**
 * icon-feature-grid — the home "most requested services" boxes (prototype
 * `.amag-serviceContainerWrapper`; schema `stardust/eds-schema/en-html.json` section 3, repeat
 * `.amag-serviceBoxWrapper` ×3). The section head (eyebrow <p>, <h2>, lede <p>) is DEFAULT
 * CONTENT before the block and is reabsorbed (EW8). Rows, read by role:
 *   - a row holding ONLY a <picture>/<img>: the 1440×400 band image behind the boxes (≥ 768)
 *   - box rows: <picture>/<img> (40px icon), <p><strong> (title, the live tag), plain <p> lines,
 *     link-bearing <p> (the underlined "About the service" text link — not a button)
 *   - CTA row: `<p><img><strong><a>label</a></strong></p>` — the primary button; the icon
 *     authored beside it is moved into the link
 * Below 768 the live module is a one-box swipe carousel: box 1 shows with a derived "1/3"
 * counter (@ew-exempt derived: counter numerals). Unit hook: `amag-serviceBoxWrapper` per box.
 */

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
const isCta = (p) => {
  const a = p.querySelector('a');
  return !!a && text(a) !== '' && text(p) === text(a);
};

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
  const order = [...nodes];
  nodes.forEach((n) => {
    if (n === heading) row.append(wrapNode(n, 'headline'));
    else if (n.tagName === 'P' && heading && order.indexOf(n) < order.indexOf(heading)) {
      row.append(wrapNode(n, 'eyebrow'));
    } else if (n.tagName === 'P') head.append(wrapNode(n, 'lede'));
    else row.append(n);
  });
  head.prepend(row);
  return head;
}

function buildBox(row, index) {
  const box = el('box amag-serviceBoxWrapper');
  if (index === 0) box.classList.add('active');
  const inner = el('box-inner');
  const media = row.querySelector('picture, img');
  let heading = row.querySelector('h1, h2, h3, h4');
  const ps = [...row.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img'));
  if (!heading) heading = ps.find((p) => p.querySelector('strong') && !isCta(p)) || null;
  const links = ps.filter(isCta);
  const lines = ps.filter((p) => !isCta(p) && p !== heading);
  const lists = [...row.querySelectorAll('ul, ol')];
  if (media) inner.append(wrapNode(media, 'box-icon'));
  if (heading) inner.append(wrapNode(heading, 'box-title'));
  if (lines.length || lists.length) {
    const t = el('box-text');
    t.append(...lines, ...lists);
    inner.append(t);
  }
  if (links.length) {
    const l = el('box-link link-underline-wrap');
    l.append(...links);
    inner.append(l);
  }
  box.append(inner);
  return box;
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  const wrap = el('wrap');
  const wrapper = block.parentElement;
  const prev = wrapper ? wrapper.previousElementSibling : null;
  if (prev && prev.classList.contains('default-content-wrapper')) {
    wrap.append(buildHead([...prev.children]));
    prev.remove();
  }
  const panel = el('panel amag-serviceContainerWrapper');
  const boxes = el('boxes');
  let boxCount = 0;
  const ctas = el('cta');
  rows.forEach((row) => {
    const media = row.querySelector('picture, img');
    const heading = row.querySelector('h1, h2, h3, h4');
    const ps = [...row.querySelectorAll('p')];
    const cta = ps.find((p) => isCta(p) && p.querySelector('strong, em, a.button'));
    if (cta) {
      const a = cta.querySelector('a');
      const icon = row.querySelector('picture, img');
      if (icon && !a.contains(icon)) a.prepend(icon);
      ctas.append(cta);
      return;
    }
    if (media && !heading && !ps.some((p) => text(p))) {
      panel.append(wrapNode(media, 'band-image'));
      return;
    }
    boxes.append(buildBox(row, boxCount));
    boxCount += 1;
  });
  if (boxCount > 1) {
    const counter = el('counter');
    counter.setAttribute('aria-hidden', 'true');
    counter.textContent = `1/${boxCount}`;
    panel.append(counter);
  }
  panel.append(boxes);
  if (ctas.children.length) panel.append(ctas);
  wrap.append(panel);
  block.replaceChildren(wrap);
  shell(block, 'icon-feature-grid');
}
