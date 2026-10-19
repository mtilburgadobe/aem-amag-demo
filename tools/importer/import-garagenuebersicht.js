/* eslint-disable */
/* global WebImporter */

/**
 * Import script for template `garagenuebersicht` (AMAG garage detail pages, German).
 * Orchestrates the block parsers in ./parsers and the page transformers in ./transformers.
 * Images stay plain <img> (no convertIcons, no DM/Scene7 carrier anchors).
 */

// PARSER IMPORTS
import breadcrumbParser from './parsers/breadcrumb.js';
import heroSplitGarageParser from './parsers/hero-split-garage.js';
import tabsGarageParser from './parsers/tabs-garage.js';
import vehicleSearchParser from './parsers/vehicle-search.js';
import newsCardsParser from './parsers/news-cards.js';
import newsCardsVehicleParser from './parsers/news-cards-vehicle.js';
import ctaBandContactParser from './parsers/cta-band-contact.js';
import pledgeRowParser from './parsers/pledge-row.js';
import quickLinksBrandsParser from './parsers/quick-links-brands.js';
import iconFeatureGridParser from './parsers/icon-feature-grid.js';
import newsCardsServicesParser from './parsers/news-cards-services.js';
import promoTeaserAppParser from './parsers/promo-teaser-app.js';
import imageTextCardTextParser from './parsers/image-text-card-text.js';
import testimonialParser from './parsers/testimonial.js';
import iconTextBoxParser from './parsers/icon-text-box.js';
import promoTeaserParser from './parsers/promo-teaser.js';
import directEntryParser from './parsers/direct-entry.js';

// TRANSFORMER IMPORTS
import amagCleanupTransformer from './transformers/amag-cleanup.js';
import amagSectionsTransformer from './transformers/amag-sections.js';

// PARSER REGISTRY
const parsers = {
  'breadcrumb': breadcrumbParser,
  'hero-split-garage': heroSplitGarageParser,
  'tabs-garage': tabsGarageParser,
  'vehicle-search': vehicleSearchParser,
  'news-cards': newsCardsParser,
  'news-cards-vehicle': newsCardsVehicleParser,
  'cta-band-contact': ctaBandContactParser,
  'pledge-row': pledgeRowParser,
  'quick-links-brands': quickLinksBrandsParser,
  'icon-feature-grid': iconFeatureGridParser,
  'news-cards-services': newsCardsServicesParser,
  'promo-teaser-app': promoTeaserAppParser,
  'image-text-card-text': imageTextCardTextParser,
  'testimonial': testimonialParser,
  'icon-text-box': iconTextBoxParser,
  'promo-teaser': promoTeaserParser,
  'direct-entry': directEntryParser,
};

// PAGE TEMPLATE CONFIGURATION - embedded from page-templates.json
const PAGE_TEMPLATE = {
  "name": "garagenuebersicht",
  "description": "AMAG garage detail page (German): garage intro, three-tab module (vehicle offers / services / news), direct-entry pill",
  "urls": [
    "https://www.amag.ch/de/garagenuebersicht/garage-buelach.html"
  ],
  "blocks": [
    {
      "name": "breadcrumb",
      "instances": [
        ".amag-introGarageWithSlider__breadcrumbs"
      ]
    },
    {
      "name": "hero-split-garage",
      "instances": [
        ".amag-introGarageWithSlider"
      ]
    },
    {
      "name": "tabs-garage",
      "instances": [
        ".amag-introTabModul__tablist"
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
        ".amag-promotionTeaserBox"
      ]
    },
    {
      "name": "news-cards-vehicle",
      "instances": [
        ".amag-angeboteRecoContainer"
      ]
    },
    {
      "name": "cta-band-contact",
      "instances": [
        ".amag-tabsWrapper.aemTabs"
      ]
    },
    {
      "name": "pledge-row",
      "instances": [
        ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(1) > .responsivegrid > .aem-Grid > section.section:has(.amag-iconListContainer) .amag-iconListContainer:has(.amag-iconListItem)",
        ".amag-locationFacilitiesWrapper"
      ]
    },
    {
      "name": "quick-links-brands",
      "instances": [
        ".amag-brandIntroductionWrapper"
      ]
    },
    {
      "name": "icon-feature-grid",
      "instances": [
        ".amag-serviceContainerWrapper"
      ]
    },
    {
      "name": "news-cards-services",
      "instances": [
        ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(2) > .responsivegrid > .aem-Grid > section.section:has(.amag-serviceContainerWrapper) .cmp-carousel"
      ]
    },
    {
      "name": "promo-teaser-app",
      "instances": [
        ".amag-app-download"
      ]
    },
    {
      "name": "image-text-card-text",
      "instances": [
        ".amag-maxiTeaser"
      ]
    },
    {
      "name": "testimonial",
      "instances": [
        ".amag-quoteContainer"
      ]
    },
    {
      "name": "icon-text-box",
      "instances": [
        ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(2) > .responsivegrid > .aem-Grid > section.section:has(.amag-iconListContainer) .amag-iconListContainer",
        ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(3) > .responsivegrid > .aem-Grid > section.section:has(.amag-iconListContainer) .amag-iconListContainer"
      ]
    },
    {
      "name": "promo-teaser",
      "instances": [
        ".amag-image-text-v2"
      ]
    },
    {
      "name": "direct-entry",
      "instances": [
        ".amag-direct-entry"
      ]
    }
  ],
  "sections": [
    {
      "id": "1",
      "name": "Garage intro",
      "selector": [
        ".amag-content > section.section:has(.amag-introGarageWithSlider)"
      ],
      "style": null,
      "blocks": [
        "breadcrumb",
        "hero-split-garage"
      ],
      "defaultContent": []
    },
    {
      "id": "2",
      "name": "Garage tab bar",
      "selector": [
        ".amag-introTabModul__tablist"
      ],
      "style": null,
      "blocks": [
        "tabs-garage"
      ],
      "defaultContent": []
    },
    {
      "id": "3",
      "name": "Vehicle search",
      "selector": [
        ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(1) > .responsivegrid > .aem-Grid > section.section:has(.amag-dspSearch)"
      ],
      "style": null,
      "blocks": [
        "vehicle-search"
      ],
      "defaultContent": []
    },
    {
      "id": "4",
      "name": "News und Angebote",
      "selector": [
        ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(1) > .responsivegrid > .aem-Grid > section.section:has(.amag-promotionTeaserBox)"
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
      "id": "5",
      "name": "Vehicle offers carousel",
      "selector": [
        ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(1) > .responsivegrid > .aem-Grid > section.section:has(.amag-angeboteRecoContainer)"
      ],
      "style": null,
      "blocks": [
        "news-cards-vehicle"
      ],
      "defaultContent": [
        ".amagCh-section-description__theme",
        ".amagCh-section-description__headline",
        ".amag-angeboteRecoContainer__carousel--descriptionHeadline",
        ".amag-angeboteRecoContainer__carousel--descriptionLink a"
      ]
    },
    {
      "id": "6",
      "name": "Sales contact",
      "selector": [
        ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(1) > .responsivegrid > .aem-Grid > section.section:has(.amag-tabsWrapper.aemTabs)"
      ],
      "style": null,
      "blocks": [
        "cta-band-contact"
      ],
      "defaultContent": [
        ".amagCh-section-description__theme",
        ".amagCh-section-description__headline"
      ]
    },
    {
      "id": "7",
      "name": "Unser AMAG Versprechen",
      "selector": [
        ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(1) > .responsivegrid > .aem-Grid > section.section:has(.amag-iconListContainer)"
      ],
      "style": null,
      "blocks": [
        "pledge-row"
      ],
      "defaultContent": [
        ".amag-iconListContainer:has(.amag-iconListItem) .amag-iconListContainer__headline h2"
      ]
    },
    {
      "id": "8",
      "name": "Alle Fahrzeuge der AMAG Garagen",
      "selector": [
        ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(1) > .responsivegrid > .aem-Grid > section.section:has(.amag-brandIntroductionWrapper)"
      ],
      "style": null,
      "blocks": [
        "quick-links-brands"
      ],
      "defaultContent": [
        ".amagCh-section-description__theme",
        ".amagCh-section-description__headline"
      ]
    },
    {
      "id": "9",
      "name": "Auto-Serviceleistungen",
      "selector": [
        ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(2) > .responsivegrid > .aem-Grid > section.section:has(.amag-serviceContainerWrapper)"
      ],
      "style": null,
      "blocks": [
        "icon-feature-grid",
        "news-cards-services"
      ],
      "defaultContent": [
        ".amagCh-section-description__theme",
        ".amagCh-section-description__headline",
        ".amagCh-carousel-description__headline",
        ".amagCh-carousel-description__subtext"
      ]
    },
    {
      "id": "10",
      "name": "AMAG App",
      "selector": [
        ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(2) > .responsivegrid > .aem-Grid > section.section:has(.amag-app-download)"
      ],
      "style": null,
      "blocks": [
        "promo-teaser-app"
      ],
      "defaultContent": []
    },
    {
      "id": "11",
      "name": "AMAG Fleet & Services",
      "selector": [
        ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(2) > .responsivegrid > .aem-Grid > section.section:has(.amag-maxiTeaser)"
      ],
      "style": null,
      "blocks": [
        "image-text-card-text"
      ],
      "defaultContent": []
    },
    {
      "id": "12",
      "name": "Service contact",
      "selector": [
        ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(2) > .responsivegrid > .aem-Grid > section.section:has(.amag-tabsWrapper.aemTabs)"
      ],
      "style": null,
      "blocks": [
        "cta-band-contact"
      ],
      "defaultContent": []
    },
    {
      "id": "13",
      "name": "Customer quote",
      "selector": [
        ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(2) > .responsivegrid > .aem-Grid > section.section:has(.amag-quoteContainer)"
      ],
      "style": null,
      "blocks": [
        "testimonial"
      ],
      "defaultContent": []
    },
    {
      "id": "14",
      "name": "Service icon labels",
      "selector": [
        ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(2) > .responsivegrid > .aem-Grid > section.section:has(.amag-iconListContainer)"
      ],
      "style": null,
      "blocks": [
        "icon-text-box"
      ],
      "defaultContent": []
    },
    {
      "id": "15",
      "name": "Neuigkeiten und Veranstaltungen",
      "selector": [
        ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(3) > .responsivegrid > .aem-Grid > section.section:has(.amag-newsTeaser)"
      ],
      "style": "grey",
      "blocks": [],
      "defaultContent": [
        ".amagCh-section-description__theme",
        ".amagCh-section-description__headline",
        ".amag-newsTeaser-noEntry"
      ]
    },
    {
      "id": "16",
      "name": "Newsletter teaser",
      "selector": [
        ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(3) > .responsivegrid > .aem-Grid > section.section:has(.amag-image-text-v2)"
      ],
      "style": null,
      "blocks": [
        "promo-teaser"
      ],
      "defaultContent": []
    },
    {
      "id": "17",
      "name": "Service icon labels (News tab)",
      "selector": [
        ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(3) > .responsivegrid > .aem-Grid > section.section:has(.amag-iconListContainer)"
      ],
      "style": null,
      "blocks": [
        "icon-text-box"
      ],
      "defaultContent": []
    },
    {
      "id": "18",
      "name": "Jobs bei AMAG",
      "selector": [
        ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(3) > .responsivegrid > .aem-Grid > section.section:has(.amag-maxiTeaser)"
      ],
      "style": null,
      "blocks": [
        "image-text-card-text"
      ],
      "defaultContent": []
    },
    {
      "id": "19",
      "name": "Unsere Ausstattung",
      "selector": [
        ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(3) > .responsivegrid > .aem-Grid > section.section:has(.amag-locationFacilitiesWrapper)"
      ],
      "style": null,
      "blocks": [
        "pledge-row"
      ],
      "defaultContent": [
        ".amagCh-section-description__theme",
        ".amagCh-section-description__headline"
      ]
    },
    {
      "id": "20",
      "name": "Mehr über AMAG Bülach",
      "selector": [
        ".amag-introTabModul .cmp-tabs > .amagCh-section__container"
      ],
      "style": "grey",
      "blocks": [],
      "defaultContent": []
    },
    {
      "id": "21",
      "name": "Direkt zu pill",
      "selector": [
        ".amag-content > .amag-direct-entry"
      ],
      "style": null,
      "blocks": [
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
    WebImporter.rules.createMetadata(main, document);
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
