/**
 * breadcrumb — the service pages' crumb trail (prototype `.cmp-breadcrumb`; schema
 * stardust/eds-schema/de-service-reifen-und-raeder-winterreifen-html.json, section 1).
 *
 * Authoring rows (one row, one cell):
 *   1. <ul> — one <li> per crumb; every crumb is a link except the current page (plain text,
 *      last item). The list is one editable unit (EW5: a trail authored as a paragraph could
 *      not be made editable, so the ENCODE side authors a list).
 * Rendering: ≥ 1200 the whole trail with "|" dividers (black links, grey current crumb);
 * below 1200 the violet chevron + the PARENT crumb only (the live clientlib behaviour,
 * replica fix1 — `:nth-last-child(2)`, never the root crumb).
 * A `hero-split` block that follows in the same section adopts this block's wrapper into
 * its text column (the prototype composition); standalone it renders as a plain row.
 * Unit hook: the generated `nav` carries `cmp-breadcrumb`; each <li> gets `cmp-breadcrumb__item`
 * for unit-geometry (replica units.json) — never styled through it.
 */

const CHEVRON = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" '
  + 'xmlns="http://www.w3.org/2000/svg"><path d="M24.5349 32C24.3722 32 24.2149 31.9413 '
  + '24.0936 31.8333L7.32688 16.9973C7.28688 16.9613 7.24955 16.924 7.21488 16.8853C6.72688 '
  + '16.3347 6.77622 15.4893 7.32555 15.0027L24.0922 0.166667C24.2149 0.0586667 24.3722 0 '
  + '24.5349 0C24.7255 0 24.9082 0.0826667 25.0349 0.225333C25.2775 0.5 25.2522 0.922667 '
  + '24.9776 1.16533L8.20955 16L24.9762 30.8333C25.2509 31.0773 25.2776 31.5 25.0336 '
  + '31.7747C24.9069 31.9187 24.7255 32 24.5349 32Z" fill="#801977"/></svg>';

export default function decorate(block) {
  const list = block.querySelector('ul, ol');
  if (!list) return;
  const nav = document.createElement('nav');
  nav.className = 'crumbs cmp-breadcrumb';
  nav.setAttribute('aria-label', 'Breadcrumb');
  const glyph = document.createElement('span');
  glyph.className = 'crumb-glyph';
  glyph.setAttribute('aria-hidden', 'true');
  glyph.innerHTML = CHEVRON;
  [...list.children].forEach((li) => li.classList.add('cmp-breadcrumb__item'));
  nav.append(glyph, list);
  block.replaceChildren(nav);
}
