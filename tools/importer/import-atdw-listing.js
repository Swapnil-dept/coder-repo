/* eslint-disable */
/* global WebImporter */

// ── PARSER IMPORTS ──────────────────────────────────────────────────────────
import atdwHeroParser       from './parsers/atdw-hero.js';
import atdwContactParser    from './parsers/atdw-contact.js';
import atdwDescriptionParser from './parsers/atdw-description.js';
import atdwDealCardParser   from './parsers/atdw-deal-card.js';
import atdwRoomsParser      from './parsers/atdw-rooms.js';
import atdwAmenitiesParser  from './parsers/atdw-amenities.js';
import atdwMapParser        from './parsers/atdw-map.js';
import atdwCarouselParser   from './parsers/atdw-carousel.js';

// ── PARSER REGISTRY ──────────────────────────────────────────────────────────
const PARSERS = {
  'atdw-hero':        atdwHeroParser,
  'atdw-contact':     atdwContactParser,
  'atdw-description': atdwDescriptionParser,
  'atdw-deal-card':   atdwDealCardParser,
  'atdw-rooms':       atdwRoomsParser,
  'atdw-amenities':   atdwAmenitiesParser,
  'atdw-map':         atdwMapParser,
  'atdw-carousel':    atdwCarouselParser,
};

// ── BLOCK DEFINITION ─────────────────────────────────────────────────────────
/**
 * Maps EDS block names → CSS selectors on the source page.
 * Selectors target the ATDW React app IDs rendered after JS execution.
 */
const BLOCK_DEFINITIONS = [
  {
    name: 'atdw-hero',
    selectors: ['#atdw-hero-banner'],
    description: 'Full-width image gallery + property title',
  },
  {
    name: 'atdw-contact',
    selectors: ['#atdw-operator-contact'],
    description: 'Get in Touch — Website / Email / Phone / Social links',
  },
  {
    name: 'atdw-description',
    selectors: ['#atdw-description'],
    description: 'Property description (expandable rich text)',
  },
  {
    name: 'atdw-deal-card',
    selectors: ['#atdw-deal-card'],
    description: 'Hot deals — badge, title, conditions, sale date, CTA',
  },
  {
    name: 'atdw-rooms',
    selectors: ['#atdw-room-accommodation'],
    description: 'Rooms — image carousel + name + description',
  },
  {
    name: 'atdw-amenities',
    selectors: ['#atdw-amenities'],
    description: 'Amenities grid — icon + name + description',
  },
  {
    name: 'atdw-map',
    selectors: ['#atdw-address-map'],
    description: 'Location map + address',
  },
  {
    name: 'atdw-carousel',
    selectors: ['#atdw-you-may-also-like-carousel-wrapper'],
    description: '"You May Also Like" horizontal cards carousel',
  },
];

// ── CLEANUP TRANSFORMER ───────────────────────────────────────────────────────
/**
 * Remove unwanted elements that must not appear in the migrated content.
 */
function cleanupPage(document) {
  const REMOVE_SELECTORS = [
    // Site chrome
    'header#header-menu2',
    'footer',
    'nav',
    // Cookie / privacy banners
    '#onetrust-consent-sdk',
    '#onetrust-banner-sdk',
    '#onetrust-pc-sdk',
    // Chat / feedback widgets
    '[class*="chatbot"]',
    '[class*="feedback"]',
    // Third-party scripts & tracking
    'script[src*="googletagmanager"]',
    'script[src*="google-analytics"]',
    'script[src*="onetrust"]',
    'script[src*="facebook"]',
    'script[src*="tiktok"]',
    'script[src*="stackadapt"]',
    'script[src*="pinterest"]',
    // Sticky contact bar at bottom of viewport
    '[class*="sticky"], [class*="Sticky"]',
    // Best-of Queensland badge overlay
    '[class*="boqe"], [class*="recommended"]',
    // Breadcrumb schema scripts
    'script[type="application/ld+json"]',
    // App data / config
    '#appData',
  ];

  REMOVE_SELECTORS.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => el.remove());
  });
}

// ── METADATA ─────────────────────────────────────────────────────────────────
/**
 * Build page metadata from Open Graph / meta tags on the source page.
 */
function buildMetadata(document) {
  const meta = {};

  const title = document.querySelector('meta[property="og:title"]')?.content
    || document.title
    || '';
  const description = document.querySelector('meta[name="description"]')?.content
    || document.querySelector('meta[property="og:description"]')?.content
    || '';
  const image = document.querySelector('meta[property="og:image"]')?.content || '';
  const template = document.querySelector('meta[name="template"]')?.content || 'page-template-atdw';

  meta['title'] = title;
  meta['description'] = description;
  if (image) meta['og:image'] = image;
  meta['template'] = template;

  return meta;
}

// ── MAIN TRANSFORM ────────────────────────────────────────────────────────────
export default {
  /**
   * Transform an ATDW listing page (e.g. queensland.com accommodation detail)
   * into EDS-ready block tables.
   *
   * Each block becomes a separate EDS section separated by <hr>.
   * Parsers return their table directly — the source DOM is not modified.
   *
   * NOTE: The source page is JS-rendered (React SPA). Run this importer
   * AFTER the browser has fully hydrated the page, e.g. via the Helix
   * Importer CLI with `--wait-for-selector "#atdw-template"`.
   */
  transform: ({ document, url, params }) => {
    const report = { url, blocks: [] };

    // 1. Cleanup non-content elements from the source DOM
    cleanupPage(document);

    // 2. Find the ATDW template container
    const atdwRoot = document.getElementById('atdw-template') || document.body;

    // 3. Build a clean output element — one EDS section per block
    const main = document.createElement('div');

    BLOCK_DEFINITIONS.forEach(({ name, selectors, description }) => {
      selectors.forEach((selector) => {
        const element = atdwRoot.querySelector(selector) || document.querySelector(selector);
        if (!element) {
          console.warn(`[import-atdw-listing] Block "${name}" — selector not found: ${selector}`);
          report.blocks.push({ name, selector, status: 'not found' });
          return;
        }

        const parser = PARSERS[name];
        if (!parser) {
          console.warn(`[import-atdw-listing] No parser registered for: ${name}`);
          report.blocks.push({ name, selector, status: 'no parser' });
          return;
        }

        try {
          const table = parser(element, { document, url, params });
          if (table) {
            // Add <hr> section separator before every block (EDS section break)
            if (main.children.length > 0) {
              main.appendChild(document.createElement('hr'));
            }
            main.appendChild(table);
          }
          report.blocks.push({ name, selector, status: 'ok', description });
        } catch (e) {
          console.error(`[import-atdw-listing] Parser "${name}" failed:`, e);
          report.blocks.push({ name, selector, status: 'error', error: e.message });
        }
      });
    });

    // 4. Append metadata block as the last section
    const meta = buildMetadata(document);
    main.appendChild(document.createElement('hr'));
    WebImporter.rules.createMetadata(main, document, meta);

    // 5. Standard EDS image adjustments on the assembled output
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate output path (mirrors source URL path)
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL || url).pathname
        .replace(/\/$/, '')
        .replace(/\.html$/, '')
      || '/index',
    );

    return [{
      element: main,
      path,
      report,
    }];
  },
};
