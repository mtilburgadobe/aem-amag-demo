/**
 * service-offer — the services overview's grey appointment strip (prototype
 * `.amag-serviceOffer`; schema stardust/eds-schema/en-services-html.json, section 2).
 * Template-slotted; one row, cells read by role:
 *   - link-bearing <p> whose text is the link: the strip headline — the whole strip is that
 *     link (EW6: href read, inner anchor unwrapped)
 *   - any other <p> without an image: the grey sub line (price / scope)
 *   - <picture>/<img>: the 32 px icon on the right
 * The live module is followed by an empty rich-text spacer (two blank paragraphs, 92 px);
 * that spacing is part of the strip's bottom margin here (conversion log).
 * Unit hook: `amag-serviceOffer` on the generated strip.
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

export default function decorate(block) {
  const media = block.querySelector('picture, img');
  const ps = [...block.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img'));
  const headline = ps.find(isCta) || ps[0] || null;
  const link = headline ? headline.querySelector('a[href]') : null;
  const copy = ps.filter((p) => p !== headline);

  const wrap = el('wrap');
  const strip = el('strip amag-serviceOffer');
  const host = link ? el('offer', 'a') : el('offer');
  if (link) {
    host.href = link.getAttribute('href');
    link.replaceWith(...link.childNodes);
  }
  const textBox = el('offer-text');
  if (headline) textBox.append(wrapNode(headline, 'offer-headline'));
  if (copy.length) {
    const c = el('offer-copy');
    c.append(...copy);
    textBox.append(c);
  }
  host.append(textBox);
  if (media) host.append(wrapNode(media, 'offer-icon'));
  strip.append(host);
  wrap.append(strip);
  block.replaceChildren(wrap);
  shell(block, 'service-offer');
}
