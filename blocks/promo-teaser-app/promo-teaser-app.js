/**
 * promo-teaser-app — the garage page's AMAG App download teaser (live `.amag-app-download`,
 * /de/garagenuebersicht/garage-buelach.html section 10, tab "AMAG Dienstleistungen"). An app
 * variant of `promo-teaser`: the 4:3 image (left, 310 px ≥ 768 / 500 px ≥ 1200) beside a light
 * grey (#e8e8e8) text box — headline, copy, then the store badges and the violet CTA side by
 * side at the foot of the box. Stacked below 768.
 *
 * Cells read by role, never by index (one row; Document Authoring may unwrap a
 * single-paragraph cell into bare inline content):
 *   - <picture>/<img> outside any link: the teaser image
 *   - <h2>/<h3>: the headline (stays the authored tag)
 *   - a <p> holding only image links (`<a><img App Store></a> <a><img Google Play></a>`):
 *     the store badges — each stays its authored link
 *   - a link-bearing <p> whose text is the link (`<em><a>Zur AMAG App</a></em>`, also after
 *     the page's button decoration): the violet CTA; the check-circle glyph is generated
 *     (aria-hidden); split links with the same href are merged
 *   - any other <p>/<ul>: the copy
 * Section shell (as `promo-teaser`): full-bleed wrapper (`promo-teaser-app-bleed-wrapper`),
 * `band` on the section's first wrapper, `section-end` on its last.
 * Unit hook: `amag-app-download` on the generated card.
 */

const CHECK = '<svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true" '
  + 'xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="15" stroke="currentColor" '
  + 'stroke-width="1.5"/><path d="m9.5 16.5 4.5 4.5 8.5-9" stroke="currentColor" '
  + 'stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const el = (className, tag = 'div') => {
  const d = document.createElement(tag);
  if (className) d.className = className;
  return d;
};

const text = (n) => (n ? n.textContent.trim() : '');
const media = (n) => [...n.querySelectorAll('picture, img')]
  .filter((m) => !(m.tagName === 'IMG' && m.closest('picture')));

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

const isBadges = (p) => {
  const links = [...p.querySelectorAll('a[href]')];
  return links.length > 0 && links.every((a) => media(a).length && !text(a)) && !text(p);
};

const isCta = (p) => {
  const a = p.querySelector('a[href]');
  return !!a && text(a) !== '' && text(p) === text(a) && !isBadges(p);
};

function mergeSplitLinks(p) {
  const links = [...p.querySelectorAll('a[href]')];
  for (let i = links.length - 1; i > 0; i -= 1) {
    const a = links[i];
    const before = links[i - 1];
    if (a.getAttribute('href') === before.getAttribute('href') && (text(a) || text(before))) {
      before.append(...a.childNodes);
      a.remove();
    }
  }
}

export default function decorate(block) {
  block.querySelectorAll(':scope > div > div').forEach(normaliseCell);
  const ps = [...block.querySelectorAll('p, ul, ol')].filter((n) => !n.closest('li'));
  ps.filter((p) => p.tagName === 'P').forEach(mergeSplitLinks);

  const badgesPs = ps.filter((p) => p.tagName === 'P' && isBadges(p));
  const ctaPs = ps.filter((p) => p.tagName === 'P' && isCta(p));
  const imageP = ps.find((p) => p.tagName === 'P' && media(p).length && !p.querySelector('a') && !text(p));
  const image = imageP ? media(imageP)[0]
    : [...block.querySelectorAll('picture, img')].find((m) => !m.closest('a')
      && !(m.tagName === 'IMG' && m.closest('picture')));
  const heading = block.querySelector('h1, h2, h3, h4');
  const copy = ps.filter((p) => !badgesPs.includes(p) && !ctaPs.includes(p) && p !== imageP
    && (text(p) || p.tagName !== 'P'));

  const card = el('card amag-app-download');
  if (image) {
    const img = image.tagName === 'IMG' ? image : image.querySelector('img');
    if (img) img.loading = 'lazy';
    card.append(wrapNode(image, 'media'));
  }
  const content = el('content');
  const textBox = el('text');
  if (heading) textBox.append(wrapNode(heading, 'headline'));
  if (copy.length) {
    const d = el('description');
    d.append(...copy);
    textBox.append(d);
  }
  content.append(textBox);

  if (badgesPs.length || ctaPs.length) {
    const links = el('links');
    if (badgesPs.length) {
      const badges = el('badges');
      badgesPs.forEach((p) => p.querySelectorAll('a[href]').forEach((a) => {
        a.className = 'badge';
        const img = a.querySelector('img');
        if (img && !a.getAttribute('aria-label') && img.alt) a.setAttribute('aria-label', img.alt);
        badges.append(a);
      }));
      links.append(badges);
    }
    if (ctaPs.length) {
      const a = ctaPs[0].querySelector('a[href]');
      const cta = el('cta', 'a');
      cta.href = a.getAttribute('href');
      const label = el('cta-label', 'span');
      label.textContent = text(a);
      const glyph = el('cta-glyph', 'span');
      glyph.innerHTML = CHECK;
      cta.append(label, glyph);
      links.append(cta);
    }
    content.append(links);
  }
  card.append(content);

  const wrap = el('wrap');
  wrap.append(card);
  block.replaceChildren(wrap);
  shell(block, 'promo-teaser-app');
}
