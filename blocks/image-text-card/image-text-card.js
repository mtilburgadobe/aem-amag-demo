/**
 * image-text-card — image + text card rows (prototype `.amag-maxiTeaserBild` on the article:
 * Räderhotel / ReifenGarantie; schema section 5). Container shape: ONE ROW PER CARD; cells
 * are read by role:
 *   - <picture>/<img>: the card image (square rendition; covers the 45 % column ≥ 1200)
 *   - <h2>/<h3>: the card title (stays the authored tag)
 *   - a short uppercase <p> BEFORE the title: the violet eyebrow (optional)
 *   - link-bearing <p> (`<strong><a>label</a></strong>`): the "gozilla" arrow button
 *   - any other <p>: the card text
 * The arrow glyph is generated (aria-hidden), never authored. Variants: `grey` / `lavender`
 * ground, `band-white` / `band-grey`; later templates add their tile-grid variant as a class.
 * Section shell: full-bleed wrapper, `band` on the section's first wrapper, `section-end`.
 * Unit hook: `amag-maxiTeaserBild` on each generated card (replica units.json).
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

function buildCard(row) {
  const card = el('card amag-maxiTeaserBild');
  const body = el('card-body');
  const main = el('card-main');
  const media = row.querySelector('picture, img');
  const heading = row.querySelector('h1, h2, h3, h4');
  const ps = [...row.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img'));
  const ctas = ps.filter(isCta);
  const copy = ps.filter((p) => !isCta(p));
  const order = [...row.querySelectorAll('h1, h2, h3, h4, p')];
  const eyebrow = heading && copy[0] && text(copy[0]).length < 60
    && order.indexOf(copy[0]) < order.indexOf(heading)
    ? copy.shift() : null;
  if (media) {
    const frame = wrapNode(media, 'card-frame');
    main.append(wrapNode(frame, 'card-media'));
  }
  const textCol = el('card-text');
  const copyBox = el('card-copy');
  if (eyebrow) copyBox.append(wrapNode(eyebrow, 'eyebrow'));
  if (heading) copyBox.append(wrapNode(heading, 'headline'));
  if (copy.length) {
    const d = el('body');
    d.append(...copy);
    copyBox.append(d);
  }
  textCol.append(copyBox);
  main.append(textCol);
  body.append(main);
  if (ctas.length) {
    const cta = el('card-cta');
    ctas.forEach((p) => {
      const a = p.querySelector('a');
      if (a && !a.querySelector('.arrow')) {
        const arrow = document.createElement('span');
        arrow.className = 'arrow';
        arrow.setAttribute('aria-hidden', 'true');
        arrow.innerHTML = ARROW;
        a.prepend(arrow);
      }
      cta.append(p);
    });
    body.append(cta);
  }
  card.append(body);
  return card;
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  const wrap = el('wrap');
  rows.forEach((row) => wrap.append(buildCard(row)));
  block.replaceChildren(wrap);
  shell(block, 'image-text-card');
}
