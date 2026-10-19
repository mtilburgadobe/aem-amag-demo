/**
 * image-text-card-text — the garage page's text-only maxi teaser (live `.amag-maxiTeaser`,
 * /de/garagenuebersicht/garage-buelach.html sections 11 "AMAG Fleet & Services" and 18 "Jobs
 * bei AMAG"). A text variant of `image-text-card`: no image; a grey ground that bleeds into the
 * left gutter holds the eyebrow (2/12) beside the headline (6/12) with the text (8/12) below,
 * and the dark-blue "gozilla" arrow button stands at the right edge, full height (≥ 768; it
 * widens on hover). Below 768 the button leads, full width, above the grey text box.
 *
 * Cells read by role, never by index (one row; Document Authoring may unwrap a
 * single-paragraph cell into bare inline content):
 *   - a short <p> BEFORE the heading: the grey uppercase eyebrow ("AMAG Fleet & Services")
 *   - <h2>/<h3>: the headline (stays the authored tag)
 *   - link-bearing <p> whose text is the link (`<strong><a>label</a></strong>`, also after the
 *     page's button decoration): the gozilla button; the arrow glyph is generated
 *     (aria-hidden); split links with the same href are merged
 *   - any other <p>/<ul>: the text
 * A picture authored by mistake is ignored (use `image-text-card` for image cards).
 * Section shell (as `image-text-card`): full-bleed wrapper (`image-text-card-text-bleed-wrapper`),
 * `band` on the section's first wrapper, `section-end` on its last.
 * Unit hook: `amag-maxiTeaser` on the generated card.
 */

const ARROW = '<svg width="34" height="34" viewBox="0 0 34 34" fill="none" '
  + 'xmlns="http://www.w3.org/2000/svg"><path d="M15.9883 33C15.7921 33 15.6054 32.9137 '
  + '15.4773 32.7649C15.2293 32.4769 15.2566 32.0358 15.5386 31.7826L31.2096 17.6957H1.68129C'
  + '1.30522 17.6957 1 17.384 1 17C1 16.616 1.30522 16.3043 1.68129 16.3043H31.2069L15.5373 '
  + '2.21739C15.401 2.09496 15.3193 1.92522 15.307 1.74017C15.2961 1.55513 15.3561 1.37565 '
  + '15.476 1.23652C15.6054 1.08626 15.7921 1 15.9869 1C16.1532 1 16.3126 1.06122 16.4366 '
  + '1.17391L32.3024 15.4362C32.3664 15.4946 32.4277 15.5558 32.485 15.6226C32.782 15.9663 '
  + '32.9537 16.3948 32.9823 16.865C32.9918 16.9012 33 16.9457 33 17C33 17.0362 32.9959 '
  + '17.0668 32.9905 17.0904C32.9905 17.103 32.9905 17.1155 32.9905 17.1294C32.9564 17.6887 '
  + '32.7111 18.1979 32.3024 18.5666L16.4379 32.8275C16.3139 32.9388 16.1532 33 15.9883 33Z" '
  + 'stroke-width="0.5"/></svg>';

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

const isCta = (p) => {
  const a = p.querySelector('a[href]');
  return !!a && text(a) !== '' && text(p) === text(a);
};

function mergeSplitLinks(p) {
  const links = [...p.querySelectorAll('a[href]')];
  for (let i = links.length - 1; i > 0; i -= 1) {
    if (links[i].getAttribute('href') === links[i - 1].getAttribute('href')) {
      links[i - 1].append(...links[i].childNodes);
      links[i].remove();
    }
  }
}

function buildCard(row) {
  row.querySelectorAll(':scope > div').forEach(normaliseCell);
  const nodes = [...row.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol')]
    .filter((n) => !n.closest('li') && !(n.tagName === 'P' && n.closest('ul, ol')));
  nodes.filter((n) => n.tagName === 'P').forEach(mergeSplitLinks);
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const ps = nodes.filter((n) => n !== heading
    && (n.tagName !== 'P' || (text(n) && !n.querySelector('picture, img') && !isCta(n))));
  const ctas = nodes.filter((n) => n.tagName === 'P' && isCta(n));
  const eyebrow = heading && ps[0] && ps[0].tagName === 'P' && text(ps[0]).length < 60
    && nodes.indexOf(ps[0]) < nodes.indexOf(heading) ? ps.shift() : null;

  const card = el('card amag-maxiTeaser');
  const desc = el('description');
  const head = el('head');
  if (eyebrow) head.append(wrapNode(eyebrow, 'eyebrow'));
  if (heading) head.append(wrapNode(heading, 'headline'));
  if (head.children.length) desc.append(head);
  if (ps.length) {
    const body = el('body');
    body.append(...ps);
    desc.append(body);
  }
  card.append(desc);

  if (ctas.length) {
    const a = ctas[0].querySelector('a[href]');
    const btn = el('btn', 'a');
    btn.href = a.getAttribute('href');
    if (a.target) btn.target = a.target;
    const arrow = el('arrow', 'span');
    arrow.setAttribute('aria-hidden', 'true');
    arrow.innerHTML = ARROW;
    const label = el('btn-text', 'span');
    label.textContent = text(a);
    btn.append(arrow, label);
    card.append(btn);
    card.classList.add('has-cta');
  }
  return card;
}

export default function decorate(block) {
  const rows = [...block.children].filter((r) => text(r));
  const wrap = el('wrap');
  rows.forEach((row) => wrap.append(buildCard(row)));
  block.replaceChildren(wrap);
  shell(block, 'image-text-card-text');
}
