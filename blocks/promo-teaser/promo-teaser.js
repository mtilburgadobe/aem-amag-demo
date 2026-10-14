/**
 * promo-teaser — promotion teaser card(s) (prototype `.amag-image-text-v2` on the article:
 * "CHF 15.– Frühbucherrabatt"; schema section 2). Container shape: ONE ROW PER CARD; each
 * card's cells are read by role, never by index:
 *   - <picture>/<img>: the card image
 *   - <h2>/<h3>: the headline (stays the authored tag)
 *   - link-bearing <p> whose text is the link: the text link ("Jetzt … vereinbaren")
 *   - any other <p>/<ul>: the description
 * Variants (block classes): `image-left` (image column 7/12, text 5/12 ≥ 1200 — the article's
 * look), `lavender` / `grey` ground, `band-white` / `band-grey` top band colour. Without a
 * layout variant the cards stack full width — later templates add their tile variant as a
 * class, never by re-authoring this block.
 * Section shell: full-bleed wrapper (`promo-teaser-bleed-wrapper`), `band` on the section's
 * first wrapper, `section-end` padding on its last.
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

const text = (el) => (el ? el.textContent.trim() : '');
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
  const card = document.createElement('article');
  card.className = 'card';
  const media = row.querySelector('picture, img');
  const heading = row.querySelector('h1, h2, h3, h4');
  const blocks = [...row.querySelectorAll('p, ul, ol')]
    .filter((el) => !el.querySelector('picture, img') && !el.closest('li'));
  const links = blocks.filter((el) => el.tagName === 'P' && isCta(el));
  const copy = blocks.filter((el) => !links.includes(el));
  if (media) {
    const frame = wrapNode(media, 'frame');
    card.append(wrapNode(frame, 'media'));
  }
  const body = document.createElement('div');
  body.className = 'text';
  if (heading) body.append(wrapNode(heading, 'headline'));
  if (copy.length) {
    const d = document.createElement('div');
    d.className = 'description';
    d.append(...copy);
    body.append(d);
  }
  if (links.length) {
    const l = document.createElement('div');
    l.className = 'link';
    l.append(...links);
    body.append(l);
  }
  card.append(body);
  return card;
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  const cards = document.createElement('div');
  cards.className = 'cards';
  rows.forEach((row) => cards.append(buildCard(row)));
  wrap.append(cards);
  block.replaceChildren(wrap);
  shell(block, 'promo-teaser');
}
