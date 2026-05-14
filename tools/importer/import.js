/* eslint-disable */
/* global WebImporter */

const OONA_EXCLUDED_SECTION_IDS = new Set([
  'car_comprehensive',
  'free-quote',
  'comprehensive-stickybar',
  'footer-container',
  'related-articles',
]);

const OONA_EXCLUDED_ID_PREFIXES = [
  'container-',
  'form-container-',
  'footer-',
  'header-',
  'modal-',
  'newsletter-',
];

const OONA_EXCLUDED_SELECTORS = [
  'header',
  '.header',
  'footer',
  '.footer',
  '.cmp-breadcrumb',
  '.breadcrumb',
  '.message-container',
  '.offer-submit-btn',
  '.coupon-wrapper',
  '.offer-timer',
  'form',
  '.cmp-form',
  '.cmp-navigation',
  '.newsletter',
  '.social-media',
  '.cookie-banner',
  '.sticky-bar',
];

function getBody(document) {
  return document.querySelector('main') || document.body;
}

function isOonaProductPage(params) {
  return new URL(params.originalURL).hostname.endsWith('myoona.ph')
    && new URL(params.originalURL).pathname.startsWith('/all-product/');
}

function isMeaningfulSection(section) {
  const heading = section.querySelector('h1, h2, h3, h4');
  const text = (section.textContent || '').trim();
  const links = section.querySelectorAll('a').length;
  const textLength = text.length;
  const linkDensity = textLength ? links / textLength : 0;

  // Product content sections consistently carry heading structure.
  return Boolean(heading) && textLength > 120 && linkDensity < 0.02;
}

function hasFormControls(section) {
  const controls = section.querySelectorAll('form, input, select, textarea, button');
  return controls.length >= 2;
}

function shouldIncludeOonaSection(section) {
  const { id } = section;
  if (!id) {
    return false;
  }

  if (OONA_EXCLUDED_SECTION_IDS.has(id)) {
    return false;
  }

  if (OONA_EXCLUDED_ID_PREFIXES.some((prefix) => id.startsWith(prefix))) {
    return false;
  }

  if (section.matches('[aria-hidden="true"]')) {
    return false;
  }

  if (hasFormControls(section)) {
    return false;
  }

  return isMeaningfulSection(section);
}

function buildOonaProductMain(document) {
  const mainRoot = document.querySelector('main') || document.body;
  if (!mainRoot) {
    return null;
  }

  const semanticSections = Array.from(mainRoot.querySelectorAll('.cmp-container[id], section[id]'))
    .filter((section) => shouldIncludeOonaSection(section));

  if (!semanticSections.length) {
    return null;
  }

  const main = document.createElement('main');
  semanticSections.forEach((section) => main.append(section));
  return main;
}

function sanitizeDocumentPath(originalURL) {
  const url = new URL(originalURL);
  let path = decodeURIComponent(url.pathname || '/');

  if (path.endsWith('/')) {
    path += 'index';
  }

  return WebImporter.FileUtils.sanitizePath(path.replace(/\.html$/, '')) || '/index';
}

export default {
  transformDOM: ({ document, url, params }) => {
    const main = isOonaProductPage(params) ? buildOonaProductMain(document) || getBody(document) : getBody(document);

    WebImporter.DOMUtils.remove(main, [
      'script',
      'style',
      'noscript',
      'iframe',
      'nav',
      '.nav',
      ...OONA_EXCLUDED_SELECTORS,
    ]);

    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    return main;
  },

  generateDocumentPath: ({ params }) => sanitizeDocumentPath(params.originalURL),
};