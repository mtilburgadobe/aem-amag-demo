/* eslint-disable */
/* global WebImporter */

/**
 * Import script for template `storelocator` (AMAG store locator, German:
 * https://www.amag.ch/de/komponenten/storelocator.html → /de/komponenten/storelocator).
 * Orchestrates the block parser in ./parsers and the page transformers in ./transformers.
 * Mirrors the migrated English car-dealers page (content/en/komponenten/car-dealers.plain.html):
 * one Dealer Search block, page metadata Title and Description. Images stay plain <img> (no
 * convertIcons, no DM/Scene7 carrier anchors).
 */

// PARSER IMPORTS
import dealerSearchParser from './parsers/dealer-search.js';

// TRANSFORMER IMPORTS
import amagCleanupTransformer from './transformers/amag-cleanup.js';
import amagSectionsTransformer from './transformers/amag-sections.js';

// PARSER REGISTRY
const parsers = {
  'dealer-search': dealerSearchParser,
};

// PAGE TEMPLATE CONFIGURATION - embedded from page-templates.json
const PAGE_TEMPLATE = {
  "name": "storelocator",
  "description": "AMAG store locator / garage finder (dealer-search)",
  "urls": [
    "https://www.amag.ch/de/komponenten/storelocator.html"
  ],
  "blocks": [
    {
      "name": "dealer-search",
      "instances": [
        ".amag-content > .storelocator.storelocator-component"
      ]
    }
  ],
  "sections": [
    {
      "id": "section-1",
      "name": "Store locator (map + garage finder overlay)",
      "selector": [
        ".amag-content > .storelocator.storelocator-component",
        ".storelocator-component"
      ],
      "style": null,
      "blocks": [
        "dealer-search"
      ],
      "defaultContent": []
    },
    {
      "id": "section-2",
      "name": "Direkt zu floating pill (dealer-search quick-links row)",
      "selector": [
        ".amag-content > .amag-direct-entry",
        ".amag-direct-entry"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": []
    }
  ]
};

// TRANSFORMER REGISTRY - cleanup first, then section breaks / Section Metadata
const transformers = [
  amagCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [amagSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName 'beforeTransform' or 'afterTransform'
 * @param {Element} element the DOM element to transform
 * @param {Object} payload { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document
 * @param {Object} template
 * @returns {Array} block instances in template order
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name, selector, element, section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. Initial cleanup + section break markers
    executeTransformers('beforeTransform', main, payload);

    // 2./3. Find and parse blocks (skip elements already replaced by an earlier parser)
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Final cleanup + Section Metadata
    executeTransformers('afterTransform', main, payload);

    // 5. Built-in rules (no convertIcons: .svg images must stay plain <img>)
    const hr = document.createElement('hr');
    main.appendChild(hr);
    // page metadata as on the English car-dealers page: Title and Description
    const meta = {};
    const title = document.querySelector('title');
    if (title) meta.Title = title.textContent.replace(/[\n\t]/gm, ' ').replace(/\s+/g, ' ').trim();
    const desc = document.querySelector('meta[name="description"]');
    if (desc && desc.content) meta.Description = desc.content.trim();
    main.append(WebImporter.Blocks.getMetadataBlock(document, meta));
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Document path: full localized path without extension (root → /index)
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
