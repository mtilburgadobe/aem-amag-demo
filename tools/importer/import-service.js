/* eslint-disable */
/* global WebImporter */

/**
 * Import script for template `service` (AMAG service overview, German:
 * https://www.amag.ch/de/service.html → /de/service).
 * Orchestrates the block parsers in ./parsers and the page transformers in ./transformers.
 * Mirrors the migrated English services page (content/en/services.plain.html):
 * same blocks and variants, page metadata Title and Description. Images stay plain <img> (no
 * convertIcons, no DM/Scene7 carrier anchors).
 */

// PARSER IMPORTS
import breadcrumbParser from './parsers/breadcrumb.js';
import heroSplitParser from './parsers/hero-split.js';
import videoBrandFilmParser from './parsers/video-brand-film.js';
import longFormArticleParser from './parsers/long-form-article.js';
import iconTextBoxParser from './parsers/icon-text-box.js';
import serviceOfferParser from './parsers/service-offer.js';
import imageTextCardParser from './parsers/image-text-card.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import newsCardsParser from './parsers/news-cards.js';
import pledgeRowParser from './parsers/pledge-row.js';
import garageChooserParser from './parsers/garage-chooser.js';
import ctaBandParser from './parsers/cta-band.js';
import newsletterBandParser from './parsers/newsletter-band.js';
import directEntryParser from './parsers/direct-entry.js';

// TRANSFORMER IMPORTS
import amagCleanupTransformer from './transformers/amag-cleanup.js';
import amagSectionsTransformer from './transformers/amag-sections.js';

// PARSER REGISTRY
const parsers = {
  'breadcrumb': breadcrumbParser,
  'hero-split': heroSplitParser,
  'video-brand-film': videoBrandFilmParser,
  'long-form-article': longFormArticleParser,
  'icon-text-box': iconTextBoxParser,
  'service-offer': serviceOfferParser,
  'image-text-card': imageTextCardParser,
  'accordion-faq': accordionFaqParser,
  'news-cards': newsCardsParser,
  'pledge-row': pledgeRowParser,
  'garage-chooser': garageChooserParser,
  'cta-band': ctaBandParser,
  'newsletter-band': newsletterBandParser,
  'direct-entry': directEntryParser,
};

// PAGE TEMPLATE CONFIGURATION - embedded from page-templates.json
const PAGE_TEMPLATE = {
  "name": "service",
  "description": "AMAG service overview (Service landing page)",
  "urls": [
    "https://www.amag.ch/de/service.html"
  ],
  "blocks": [
    {
      "name": "breadcrumb",
      "instances": [
        ".amag-introService__breadcrumbs"
      ]
    },
    {
      "name": "hero-split",
      "instances": [
        ".amag-content > section.section .amag-introService"
      ]
    },
    {
      "name": "video-brand-film",
      "instances": [
        ".amag-videoComp"
      ]
    },
    {
      "name": "long-form-article",
      "instances": [
        ".amag-content > section.section:has(.amag-introService) .rich-text"
      ]
    },
    {
      "name": "icon-text-box",
      "instances": [
        ".amag-iconTextBox"
      ]
    },
    {
      "name": "service-offer",
      "instances": [
        ".amag-serviceOffer"
      ]
    },
    {
      "name": "image-text-card",
      "instances": [
        ".amag-content > section.section:has(.amag-maxiTeaserBild)"
      ]
    },
    {
      "name": "accordion-faq",
      "instances": [
        ".cmp-accordion"
      ]
    },
    {
      "name": "news-cards",
      "instances": [
        ".amag-promotionTeaserBox"
      ]
    },
    {
      "name": "pledge-row",
      "instances": [
        ".amag-iconListContainer:has(.amag-iconListItem)"
      ]
    },
    {
      "name": "garage-chooser",
      "instances": [
        ".amag-kontaktaufnahme .amag-garageElectionOverlay .amag-garageOverlay"
      ]
    },
    {
      "name": "cta-band",
      "instances": [
        ".amag-kontaktaufnahme"
      ]
    },
    {
      "name": "newsletter-band",
      "instances": [
        ".amag-content > .amag-divider"
      ]
    },
    {
      "name": "direct-entry",
      "instances": [
        ".amag-content > .amag-direct-entry"
      ]
    }
  ],
  "sections": [
    {
      "id": "section-1",
      "name": "Intro: breadcrumb, split hero, brand video, intro text",
      "selector": [
        ".amag-content > section.section:has(.amag-introService)"
      ],
      "style": null,
      "blocks": [
        "breadcrumb",
        "hero-split",
        "video-brand-film",
        "long-form-article"
      ],
      "defaultContent": []
    },
    {
      "id": "section-2",
      "name": "Services at a glance + appointment strip + image teasers",
      "selector": [
        ".amag-content > section.section .amag-iconTextBox"
      ],
      "style": null,
      "blocks": [
        "icon-text-box",
        "service-offer",
        "image-text-card"
      ],
      "defaultContent": []
    },
    {
      "id": "section-3",
      "name": "FAQ accordions (4 groups; not on /en/services)",
      "selector": [
        ".amag-content > section.section:has(.cmp-accordion)"
      ],
      "style": null,
      "blocks": [
        "accordion-faq"
      ],
      "defaultContent": []
    },
    {
      "id": "section-4",
      "name": "News and offers",
      "selector": [
        ".amag-content > section.section:has(.amag-promotionTeaserBox)"
      ],
      "style": null,
      "blocks": [
        "news-cards"
      ],
      "defaultContent": [
        ".amag-promotionTeaserBox__topline",
        ".amag-promotionTeaserBox__headline"
      ]
    },
    {
      "id": "section-5",
      "name": "Pledge + contact band",
      "selector": [
        ".amag-content > section.section:has(.amag-iconListContainer)"
      ],
      "style": null,
      "blocks": [
        "pledge-row",
        "cta-band"
      ],
      "defaultContent": [
        ".amag-content > section.section:has(.amag-iconListContainer) .amagCh-section-description__theme",
        ".amag-content > section.section:has(.amag-iconListContainer) .amagCh-section-description__headline"
      ]
    },
    {
      "id": "section-6",
      "name": "Newsletter band",
      "selector": [
        ".amag-content > .amag-divider"
      ],
      "style": null,
      "blocks": [
        "newsletter-band"
      ],
      "defaultContent": []
    },
    {
      "id": "section-7",
      "name": "Overlays: garage chooser + direct entry",
      "selector": [
        ".amag-content > .amag-direct-entry"
      ],
      "style": null,
      "blocks": [
        "garage-chooser",
        "direct-entry"
      ],
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
    // page metadata as on the English services page: Title and Description
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
