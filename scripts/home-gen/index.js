import { resolveAudience } from './resolver.js';
import { readIntent, recordIntent } from './intent-store.js';
import { buildWhyContract, publishWhy } from './why.js';

const MARKER = /\{\{\s*generate\s*:[^}]*\}\}(?:\s*\{\{\s*default\s*:\s*([^}]*)\}\})?/gi;
const GENERATED_SLOT = '[id^="generate-"]';

/**
 * Replaces authored {{generate: ...}}{{default: ...}} markers with the authored default,
 * so a visitor never sees raw braces when generation did not run.
 * @param {Element} root
 * @returns {number} how many markers were replaced
 */
export function resolveMarkerDefaults(root) {
  if (!root.textContent.includes('{{')) return 0;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) {
    if (walker.currentNode.nodeValue.includes('{{')) nodes.push(walker.currentNode);
  }
  let replaced = 0;
  nodes.forEach((node) => {
    node.nodeValue = node.nodeValue.replace(MARKER, (m, def) => {
      replaced += 1;
      return (def || '').trim();
    });
  });
  root.querySelectorAll(GENERATED_SLOT).forEach((n) => n.removeAttribute('id'));
  return replaced;
}

function countMarkers(root) {
  return (root.textContent.match(MARKER) || []).length;
}

// The edge proxy reports how many slots it filled in the #of1-context island.
function appliedSlots(doc) {
  try {
    const island = JSON.parse(doc.getElementById('of1-context').textContent);
    const applied = Number(island.generative && island.generative.applied);
    return Number.isFinite(applied) ? applied : 0;
  } catch {
    return 0;
  }
}

function blockNames(section) {
  return [...section.querySelectorAll('.block')]
    .map((b) => [...b.classList].find((c) => c !== 'block'))
    .filter(Boolean);
}

function watchIntent(main, storage) {
  const onClick = (event) => {
    const link = event.target.closest && event.target.closest('a[href]');
    if (link && recordIntent(link.getAttribute('href'), storage)) {
      main.removeEventListener('click', onClick);
    }
  };
  main.addEventListener('click', onClick);
}

/**
 * Shows the sections authored for the matched audience, hides the others, and publishes
 * window.of1Why. Sections opt in through an "Audience" row in their section-metadata
 * (rendered as data-audience). No-op on pages without audience sections.
 * @param {Element} main
 * @param {object} [env] test seam: url, referrer, width, stored, storage, generationRan,
 *   generatedSlots
 * @returns {{resolution: object, shown: Element[]}|null}
 */
export function applyAudience(main, env = {}) {
  const sections = [...main.querySelectorAll('.section[data-audience]')];
  if (!sections.length) return null;

  const { storage, generationRan, generatedSlots } = env;
  const applied = appliedSlots(document);
  const markers = countMarkers(main);
  const ran = generationRan !== undefined ? generationRan : markers === 0 && applied > 0;
  if (markers > 0) resolveMarkerDefaults(main);

  const resolution = resolveAudience({
    url: env.url,
    referrer: env.referrer,
    width: env.width,
    stored: env.stored !== undefined ? env.stored : readIntent(storage),
  });
  sections.forEach((section) => {
    section.hidden = section.dataset.audience.toLowerCase() !== resolution.audience;
  });
  document.body.dataset.audience = resolution.audience;

  const shown = [...main.querySelectorAll('.section')].filter((s) => !s.hidden);
  const page = {
    generated: generatedSlots !== undefined ? generatedSlots : applied,
    authoredFallback: !ran,
    sections: shown.flatMap((s) => {
      const kind = ran && s.querySelector(GENERATED_SLOT) ? 'generated' : 'authored';
      return blockNames(s).map((block) => ({ block, kind }));
    }),
  };
  publishWhy(buildWhyContract(resolution, page));
  watchIntent(main, storage);
  return { resolution, shown };
}
