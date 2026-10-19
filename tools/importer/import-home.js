/* eslint-disable */
/* global WebImporter */

/**
 * Import script for template `home` (AMAG home page, German: https://www.amag.ch/de.html → /de).
 * Orchestrates the block parsers in ./parsers and the page transformers in ./transformers.
 * Mirrors the migrated English home page (content/en.plain.html): page metadata Title,
 * Description and header-style: transparent. Images stay plain <img> (no convertIcons,
 * no DM/Scene7 carrier anchors).
 */

// PARSER IMPORTS
import heroCarouselParser from './parsers/hero-carousel.js';
import quickLinksParser from './parsers/quick-links.js';
import vehicleSearchParser from './parsers/vehicle-search.js';
import newsCardsParser from './parsers/news-cards.js';
import iconFeatureGridParser from './parsers/icon-feature-grid.js';
import newsCardsArticlesParser from './parsers/news-cards-articles.js';
import newsletterBandParser from './parsers/newsletter-band.js';
import videoBrandFilmParser from './parsers/video-brand-film.js';
import testimonialParser from './parsers/testimonial.js';
import pledgeRowParser from './parsers/pledge-row.js';
import accordionFaqParser from './parsers/accordion-faq.js';

// TRANSFORMER IMPORTS
import amagCleanupTransformer from './transformers/amag-cleanup.js';
import amagSectionsTransformer from './transformers/amag-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-carousel': heroCarouselParser,
  'quick-links': quickLinksParser,
  'vehicle-search': vehicleSearchParser,
  'news-cards': newsCardsParser,
  'icon-feature-grid': iconFeatureGridParser,
  'news-cards-articles': newsCardsArticlesParser,
  'newsletter-band': newsletterBandParser,
  'video-brand-film': videoBrandFilmParser,
  'testimonial': testimonialParser,
  'pledge-row': pledgeRowParser,
  'accordion-faq': accordionFaqParser,
};

// PAGE TEMPLATE CONFIGURATION - embedded from page-templates.json
const PAGE_TEMPLATE = {
  "name": "home",
  "description": "AMAG home page: stage carousel + quick links, vehicle search, promo tiles, services grid, teaser carousels, news list, newsletter/jobs bands, brand film, testimonial, pledge row, SEO accordion",
  "urls": [
    "https://www.amag.ch/de.html"
  ],
  "blocks": [
    {
      "name": "hero-carousel",
      "instances": [
        ".amag-content > .amagCh-stageCarousel .cmp-carousel"
      ]
    },
    {
      "name": "quick-links",
      "instances": [
        ".amag-content > .amagCh-stageCarousel .amagCh-stageCarousel__buttons--noPadding"
      ]
    },
    {
      "name": "vehicle-search",
      "instances": [
        ".amag-dspSearch"
      ]
    },
    {
      "name": "news-cards",
      "instances": [
        ".amag-promotionTeaserBox",
        ".amag-content > section.section:has(.amag-contentTeaserS) .amagCh-carousel .cmp-carousel"
      ]
    },
    {
      "name": "icon-feature-grid",
      "instances": [
        ".amag-serviceContainerWrapper"
      ]
    },
    {
      "name": "news-cards-articles",
      "instances": [
        ".amag-newsTeaser"
      ]
    },
    {
      "name": "newsletter-band",
      "instances": [
        ".amag-content > .amag-divider"
      ]
    },
    {
      "name": "video-brand-film",
      "instances": [
        ".amag-videoComp"
      ]
    },
    {
      "name": "testimonial",
      "instances": [
        ".amag-quoteModul"
      ]
    },
    {
      "name": "pledge-row",
      "instances": [
        ".amag-iconListContainer:has(.amag-iconListItem)"
      ]
    },
    {
      "name": "accordion-faq",
      "instances": [
        ".cmp-accordion"
      ]
    }
  ],
  "sections": [
    {
      "id": "section-1",
      "name": "Stage carousel + quick links",
      "selector": [
        ".amag-content > .amagCh-stageCarousel"
      ],
      "style": null,
      "blocks": [
        "hero-carousel",
        "quick-links"
      ],
      "defaultContent": []
    },
    {
      "id": "section-2",
      "name": "Vehicle search",
      "selector": [
        ".amag-content > section.section:has(.amag-dspSearch)"
      ],
      "style": null,
      "blocks": [
        "vehicle-search"
      ],
      "defaultContent": []
    },
    {
      "id": "section-3",
      "name": "AMAG NEWS – News und Angebote",
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
      "id": "section-4",
      "name": "Die gefragtesten AMAG Serviceleistungen",
      "selector": [
        ".amag-content > section.section:has(.amag-serviceContainerWrapper)"
      ],
      "style": null,
      "blocks": [
        "icon-feature-grid"
      ],
      "defaultContent": [
        ".amagCh-section-description__theme",
        ".amagCh-section-description__headline",
        ".amagCh-section-description__subtext"
      ]
    },
    {
      "id": "section-5",
      "name": "Willkommen bei der AMAG – content teaser carousels",
      "selector": [
        ".amag-content > section.section:has(.amag-contentTeaserS)"
      ],
      "style": null,
      "blocks": [
        "news-cards"
      ],
      "defaultContent": [
        ".amagCh-section-description__theme",
        ".amagCh-section-description__headline",
        ".amagCh-carousel-description__headline"
      ]
    },
    {
      "id": "section-6",
      "name": "Mobil in die Zukunft: News & Aktuelles",
      "selector": [
        ".amag-content > section.section:has(.amag-newsTeaser)"
      ],
      "style": null,
      "blocks": [
        "news-cards-articles"
      ],
      "defaultContent": [
        ".amagCh-section-description__theme",
        ".amagCh-section-description__headline",
        ".amagCh-section-description__subtext"
      ]
    },
    {
      "id": "section-7",
      "name": "AMAG Newsletter band",
      "selector": [
        ".amag-content > section.section:has(.amag-newsTeaser) + .amag-divider"
      ],
      "style": null,
      "blocks": [
        "newsletter-band"
      ],
      "defaultContent": []
    },
    {
      "id": "section-8",
      "name": "Image video",
      "selector": [
        ".amag-content > section.section:has(.amag-videoComp)"
      ],
      "style": null,
      "blocks": [
        "video-brand-film"
      ],
      "defaultContent": [
        ".amag-videoComp__headline"
      ]
    },
    {
      "id": "section-9",
      "name": "Customer testimonial",
      "selector": [
        ".amag-content > section.section:has(.amag-quoteModul)"
      ],
      "style": null,
      "blocks": [
        "testimonial"
      ],
      "defaultContent": []
    },
    {
      "id": "section-10",
      "name": "Unser AMAG Versprechen",
      "selector": [
        ".amag-content > section.section:has(.amag-iconListContainer)"
      ],
      "style": null,
      "blocks": [
        "pledge-row"
      ],
      "defaultContent": [
        ".amag-iconListContainer__headline h2"
      ]
    },
    {
      "id": "section-11",
      "name": "AMAG – Ihr Autohändler an 90 Standorten",
      "selector": [
        ".amag-content > section.section:has(.cmp-accordion)"
      ],
      "style": null,
      "blocks": [
        "accordion-faq"
      ],
      "defaultContent": [
        ".cmp-accordion__headline",
        ".cmp-accordion__introText"
      ]
    },
    {
      "id": "section-12",
      "name": "Jobs band",
      "selector": [
        ".amag-content > section.section:has(.cmp-accordion) + .amag-divider"
      ],
      "style": null,
      "blocks": [
        "newsletter-band"
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
    // page metadata as on the English home page: Title, Description, header-style: transparent
    const meta = {};
    const title = document.querySelector('title');
    if (title) meta.Title = title.textContent.replace(/[\n\t]/gm, ' ').replace(/\s+/g, ' ').trim();
    const desc = document.querySelector('meta[name="description"]');
    if (desc && desc.content) meta.Description = desc.content.trim();
    meta['header-style'] = 'transparent';
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
