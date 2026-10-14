/**
 * cta-band — the "Haben Sie weitere Fragen?" contact band (prototype `.amag-kontaktaufnahme`
 * + garage election; schema section 7). Cells are read by role (one row or several):
 *   - <h2>/<h3>: the band headline (stays the authored tag)
 *   - <picture>/<img> outside the CTA: the band image (the home page's image variant)
 *   - link-bearing <p> (`<strong><a><img>label</a></strong>`): the single CTA; an icon
 *     picture authored in the same paragraph is moved into the link
 *   - any other <p>: the intro text
 * Variants: `grey` / `lavender` ground, `band-white` / `band-grey` top band colour; later
 * templates add their image-band look as a class.
 * Section shell: full-bleed wrapper, `band` on the section's first wrapper, `section-end`.
 * Unit hook: `amag-garageElectionOverlay` on the generated CTA wrapper (replica units.json).
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
  const copy = ps.filter((p) => !isCta(p) && !p.querySelector('picture, img'));
  const media = [...block.querySelectorAll('picture, img')]
    .find((m) => !ctas.some((p) => p.contains(m)) && !m.closest('picture img'));
  ctas.forEach((p) => {
    const a = p.querySelector('a');
    const icon = p.querySelector('picture, img');
    if (icon && !a.contains(icon)) a.prepend(icon);
  });

  const wrap = el('wrap');
  const band = el('band');
  if (media) band.append(wrapNode(media, 'media'));
  if (heading) band.append(wrapNode(heading, 'headline'));
  if (copy.length) {
    const t = el('text');
    t.append(...copy);
    band.append(t);
  }
  if (ctas.length) {
    const cta = el('cta amag-garageElectionOverlay');
    const box = el('cta-box');
    box.append(...ctas);
    cta.append(box);
    band.append(cta);
  }
  wrap.append(band);
  block.replaceChildren(wrap);
  shell(block, 'cta-band');
}
