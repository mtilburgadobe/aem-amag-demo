/* eslint-disable */
/* global WebImporter */

/**
 * Parser: long-form-article (block table "long-form-article").
 * Source: https://www.amag.ch/de/service.html —
 * `.amag-content > section.section:has(.amag-introService) .rich-text` (section 1: intro text
 * after the video, "Bei uns ist Ihr Fahrzeug in den besten Händen!").
 *
 * Authoring rows (blocks/long-form-article/long-form-article.js types rows by content) — as on
 * /en/services: ONE row, ONE rich-text cell:
 *   <h4><strong>heading</strong></h4><p>copy</p><p>copy</p>
 * The rich text is copied as clean semantic markup: headings (tag kept), <p>, <ul>/<ol>/<li>,
 * links (href only) and inline marks (<b> -> <strong>, <i> -> <em>); classes, ids and empty
 * paragraphs are dropped.
 */
const txt = (n) => (n ? n.textContent.replace(/\s+/g, ' ').trim() : '');
const BLOCK_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol']);
const KEEP = new Set(['a', 'strong', 'b', 'em', 'i', 'u', 'br', 'sup', 'sub', 'li', 'ul', 'ol', 'p',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

// Clean copy: only semantic tags, only href on links.
function clean(node, document) {
  if (node.nodeType === 3) return document.createTextNode(node.textContent);
  if (node.nodeType !== 1) return null;
  const tag = node.localName;
  const kids = [...node.childNodes].map((c) => clean(c, document)).flat().filter(Boolean);
  if (!KEEP.has(tag)) return kids.length ? kids : null;
  const out = document.createElement(tag === 'b' ? 'strong' : (tag === 'i' ? 'em' : tag));
  if (tag === 'a' && node.getAttribute('href')) out.setAttribute('href', node.getAttribute('href'));
  kids.forEach((k) => out.append(k));
  return out;
}

export default function parse(element, { document }) {
  const source = element.querySelector('.cmp-text') || element;
  // top-level text blocks in document order (a block nested in another one is copied with it)
  const blocks = [...source.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol')]
    .filter((n) => {
      const outer = n.parentElement && n.parentElement.closest('h1, h2, h3, h4, h5, h6, p, ul, ol');
      return !outer || !source.contains(outer);
    });

  const cell = [];
  blocks.forEach((n) => {
    if (!txt(n) || !BLOCK_TAGS.has(n.localName)) return;
    const c = clean(n, document);
    if (c) cell.push(c);
  });
  if (!cell.length && txt(source)) {
    const p = document.createElement('p');
    p.textContent = txt(source);
    cell.push(p);
  }

  if (!cell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'long-form-article', cells: [[cell]] });
  element.replaceWith(block);
}
