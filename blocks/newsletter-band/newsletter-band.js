/**
 * newsletter-band — the home image divider bands (prototype `.amag-divider` ×2: "AMAG
 * Newsletter" and "Turn your passion into a profession"; schema
 * `stardust/eds-schema/en-html.json` sections 4 and 6). Template-slotted; cells read by role:
 *   - <picture>/<img> outside the CTA: the 1440×400 band image
 *   - a short <p> BEFORE the heading: the topline (optional)
 *   - <h2>/<h3>: the band headline (stays the authored tag)
 *   - `<p><img><strong|em><a>label</a></strong|em></p>`: the CTA (primary dark blue / secondary
 *     violet via the foundation marks); the icon authored beside it is moved into the link
 *   - any other <p>: the copy
 * The white content box overhangs the image bottom; the band's bottom margin makes room.
 * Unit hook: `amag-divider` on the generated band.
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
  const heading = block.querySelector('h1, h2, h3, h4');
  const ps = [...block.querySelectorAll('p')];
  const ctas = ps.filter(isCta);
  ctas.forEach((p) => {
    const a = p.querySelector('a');
    const icon = p.querySelector('picture, img');
    if (icon && a && !a.contains(icon)) a.prepend(icon);
  });
  const media = [...block.querySelectorAll('picture, img')]
    .find((m) => !m.closest('picture img') && !ctas.some((p) => p.contains(m)));
  const copy = ps.filter((p) => !isCta(p) && !p.querySelector('picture, img'));
  const order = [...block.querySelectorAll('h1, h2, h3, h4, p')];
  const topline = heading && copy[0] && text(copy[0]).length < 60
    && order.indexOf(copy[0]) < order.indexOf(heading) ? copy.shift() : null;

  const band = el('band amag-divider');
  if (media) band.append(wrapNode(media, 'band-media'));
  const layer = el('band-layer');
  const inner = el('band-inner');
  const content = el('band-content');
  const box = el('band-box');
  if (topline) box.append(wrapNode(topline, 'topline'));
  if (heading) box.append(wrapNode(heading, 'headline'));
  if (copy.length) {
    const c = el('copy');
    c.append(...copy);
    box.append(c);
  }
  if (ctas.length) {
    const c = el('cta');
    c.append(...ctas);
    box.append(c);
  }
  content.append(box);
  inner.append(content);
  layer.append(inner);
  band.append(layer);
  block.replaceChildren(band);
  shell(block, 'newsletter-band');
}
