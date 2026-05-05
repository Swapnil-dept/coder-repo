/* eslint-disable */
/* global WebImporter */

/**
 * Cleanup transformer for ageupl.com
 * Removes non-content elements before and after parsing.
 */
export default function transform(hookName, element, payload) {
  const { document } = payload;

  if (hookName === 'beforeTransform') {
    const removeSelectors = [
      'header',
      'footer',
      'nav',
      '.overlay-top',
      '.slick-dots',
      '.slick-arrow',
      '.OGWPrevBtn',
      '.OGWNextBtn',
      '.slick-cloned',
      '.cookie-banner',
      '#cookie-consent',
      '.recaptcha-badge',
      'noscript',
      'iframe',
    ];

    removeSelectors.forEach((selector) => {
      element.querySelectorAll(selector).forEach((el) => el.remove());
    });
  }

  if (hookName === 'afterTransform') {
    element.querySelectorAll('div:empty').forEach((el) => {
      if (!el.closest('table')) {
        el.remove();
      }
    });
  }
}
