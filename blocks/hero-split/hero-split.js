/**
 * hero-split — the service article's split hero (prototype `.amag-introService`; schema
 * stardust/eds-schema/de-service-reifen-und-raeder-winterreifen-html.json, section 1):
 * text column (breadcrumb, h1, appointment CTA + service-time note) and a 4:3 image that
 * bleeds into the right gutter ≥ 1200 and leads the column below.
 *
 * Authoring rows (queried by role, never by index — one cell or several):
 *   - <picture>/<img>: the hero image (LCP — eager + high priority)
 *   - <h1> (or h2/h3): the page headline — stays the authored tag
 *   - link-bearing <p> (`<strong><a><img>label</a></strong>`): the CTA; an icon picture
 *     authored in the same paragraph is moved into the link
 *   - any other <p>: the service-time note under the CTA
 * A `breadcrumb` block immediately before this one in the same section is adopted into the
 * text column (decorated whole; EW9).
 * Section shell: this block is full-bleed (wrapper gets `hero-split-bleed-wrapper`) and
 * paints the section's top band (`band`, hidden below 1200 on the page's first section) and
 * the section's bottom padding when it is the last wrapper (`section-end`). Variants:
 * `grey` / `lavender` ground, `band-white` / `band-grey` left band colour.
 * Unit hook: `amag-otvCtaWrapper` on the generated CTA wrapper (replica units.json).
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

export default function decorate(block) {
  const wrapper = block.parentElement;
  const prev = wrapper ? wrapper.previousElementSibling : null;
  const crumbs = prev && prev.classList.contains('breadcrumb-wrapper') ? prev : null;

  const heading = block.querySelector('h1, h2, h3');
  const media = block.querySelector('picture, img');
  const ps = [...block.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img')
    || isCta(p));
  const ctas = ps.filter(isCta);
  const notes = ps.filter((p) => !isCta(p));
  ctas.forEach((p) => {
    const a = p.querySelector('a');
    const icon = p.querySelector('picture, img');
    if (icon && !a.contains(icon)) a.prepend(icon);
  });

  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  const grid = document.createElement('div');
  grid.className = 'grid';
  const col = document.createElement('div');
  col.className = 'text';
  const body = document.createElement('div');
  body.className = 'body';
  if (crumbs) body.append(crumbs);
  if (heading) body.append(wrapNode(heading, 'headline'));
  col.append(body);
  if (ctas.length || notes.length) {
    const cta = document.createElement('div');
    cta.className = 'cta';
    const box = document.createElement('div');
    box.className = 'cta-box';
    if (ctas.length) {
      const actions = document.createElement('div');
      actions.className = 'actions';
      actions.append(...ctas);
      box.append(actions);
    }
    if (notes.length) {
      const note = document.createElement('div');
      note.className = 'note';
      note.append(...notes);
      box.append(note);
    }
    cta.append(box);
    col.append(cta);
  }
  grid.append(col);
  if (media) {
    const img = media.tagName === 'IMG' ? media : media.querySelector('img');
    if (img) {
      img.loading = 'eager';
      img.setAttribute('fetchpriority', 'high');
    }
    const ratio = wrapNode(media, 'ratio');
    grid.append(wrapNode(ratio, 'media'));
  }
  wrap.append(grid);
  block.replaceChildren(wrap);
  shell(block, 'hero-split');
}
