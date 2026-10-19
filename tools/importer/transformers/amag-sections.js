/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AMAG section breaks + Section Metadata (template `garagenuebersicht`).
 *
 * Uses payload.template.sections (page-templates.json); each `selector` is an array tried in
 * order. Selectors were verified in migration-work/cleaned.html.
 *
 * Tab module: sections 2-19 live inside `.amag-introTabModul` (2 = tab bar `ol`, 3-19 = the
 * `section.section` elements in the three `.cmp-tabs__tabpanel`s). An <hr> is inserted directly
 * before each section element, so every panel section becomes its own document section (the
 * wrapping divs are transparent in the markdown conversion). Source order: 1, 2, 3 … 19, (20), 21.
 *
 * Tab metadata: blocks/tabs-garage reads the section metadata key `Tab` (value = tab label).
 * The label is read from the source tab bar (`li.amag-introTabModul__tab` at the index of the
 * enclosing `.cmp-tabs__tabpanel`) in beforeTransform, before the tabs-garage parser replaces the
 * tab bar; TAB_FALLBACK (from migration-work/page-structure.json tabModel) is used if the DOM
 * lookup fails: 3-8 Fahrzeug-Angebote, 9-14 AMAG Dienstleistungen, 15-19 News & Infos.
 *
 * Section 20 (grey "Mehr über AMAG Bülach" band, `.amag-introTabModul .cmp-tabs >
 * .amagCh-section__container`) is left in place for the tabs-garage parser (section 2), which
 * reads it as the block's trailing band row and removes it. This transformer still inserts its
 * break marker in beforeTransform (parsers run later), and in afterTransform drops every section
 * whose content is empty — so when the parser consumed the band, no empty grey section is
 * emitted; if the band survives (no parser), it becomes a `Style: grey` section.
 */
const SECTION_ATTR = 'data-excat-section-id';
const TAB_ATTR = 'data-excat-tab';

const TAB_FALLBACK = {
  3: 'Fahrzeug-Angebote', 4: 'Fahrzeug-Angebote', 5: 'Fahrzeug-Angebote',
  6: 'Fahrzeug-Angebote', 7: 'Fahrzeug-Angebote', 8: 'Fahrzeug-Angebote',
  9: 'AMAG Dienstleistungen', 10: 'AMAG Dienstleistungen', 11: 'AMAG Dienstleistungen',
  12: 'AMAG Dienstleistungen', 13: 'AMAG Dienstleistungen', 14: 'AMAG Dienstleistungen',
  15: 'News & Infos', 16: 'News & Infos', 17: 'News & Infos', 18: 'News & Infos',
  19: 'News & Infos',
};

function querySection(root, selectors) {
  const list = Array.isArray(selectors) ? selectors : [selectors];
  for (const sel of list) {
    if (!sel) continue;
    let el = null;
    try { el = root.querySelector(sel); } catch (e) { el = null; }
    if (el) return el;
  }
  return null;
}

// Tab label of a panel section: index of its .cmp-tabs__tabpanel -> matching tab bar <li>.
function tabLabelFor(sectionEl) {
  const panel = sectionEl.closest('.cmp-tabs__tabpanel');
  if (!panel || !panel.parentElement) return '';
  const tabs = panel.parentElement;
  const panels = [...tabs.children].filter((c) => c.classList.contains('cmp-tabs__tabpanel'));
  const idx = panels.indexOf(panel);
  const items = [...tabs.querySelectorAll(':scope > .amag-introTabModul__tablist > .amag-introTabModul__tab')];
  const li = items[idx];
  return li ? li.textContent.replace(/\s+/g, ' ').trim() : '';
}

// true if the nodes between `start` and `end` (document order) hold no authorable content.
// With no `end`, the range runs to the end of `root`.
function isEmptyBetween(document, root, start, end) {
  const range = document.createRange();
  range.setStartAfter(start);
  if (end) range.setEndBefore(end);
  else range.setEnd(root, root.childNodes.length);
  const frag = range.cloneContents();
  if (frag.querySelector && frag.querySelector('img, picture, table, video, iframe, svg')) return false;
  return !frag.textContent.replace(/\s+/g, '').length;
}

export default function transform(hookName, element, payload) {
  const sections = (payload && payload.template && payload.template.sections) || [];
  if (sections.length < 2) return;

  if (hookName === 'beforeTransform') {
    // Reverse order: inserting relative to a live element never moves unprocessed sections.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (i === 0 && !section.style) continue;
      const sectionEl = querySection(element, section.selector);
      if (!sectionEl) continue;

      const hr = document.createElement('hr');
      hr.setAttribute(SECTION_ATTR, section.id);
      const tab = tabLabelFor(sectionEl) || TAB_FALLBACK[section.id] || '';
      if (tab) hr.setAttribute(TAB_ATTR, tab);
      sectionEl.before(hr);
    }
  }

  if (hookName === 'afterTransform') {
    const markers = [...element.querySelectorAll(`hr[${SECTION_ATTR}]`)];

    // Drop sections a parser emptied (e.g. section 20 consumed by the tabs-garage parser).
    // Walk backwards; markers[i + 1] is always the next break that is kept.
    for (let i = markers.length - 1; i >= 0; i -= 1) {
      if (isEmptyBetween(document, element, markers[i], markers[i + 1] || null)) {
        markers[i].remove();
        markers.splice(i, 1);
      }
    }

    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const marker = element.querySelector(`hr[${SECTION_ATTR}="${section.id}"]`);
      if (!marker) continue;

      const cells = {};
      if (section.style) cells.Style = section.style;
      const tab = marker.getAttribute(TAB_ATTR);
      if (tab) cells.Tab = tab;

      if (Object.keys(cells).length) {
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells,
        });
        marker.after(metadataBlock);
      }

      marker.removeAttribute(SECTION_ATTR);
      marker.removeAttribute(TAB_ATTR);
      if (i === 0) marker.remove(); // first section never gets a leading break
    }
  }
}
