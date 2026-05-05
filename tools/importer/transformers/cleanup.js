/* eslint-disable */
/* global WebImporter */

/**
 * Cleanup transformer - removes non-content elements
 */
export default function transform(hookName, element, payload) {
  const { document } = payload;

  if (hookName === 'beforeTransform') {
    // Remove navigation, carousel controls, and duplicate carousel items
    const removeSelectors = [
      'nav',
      '.bootstrape-nav',
      '.bootstrape-dots',
      '.bootstrape-item.cloned',
      'footer',
      '.cookie-banner',
      '#cookie-consent',
    ];

    removeSelectors.forEach((selector) => {
      element.querySelectorAll(selector).forEach((el) => el.remove());
    });
  }

  if (hookName === 'afterTransform') {
    // Remove any remaining empty elements
    element.querySelectorAll('div:empty').forEach((el) => {
      if (!el.closest('table')) {
        el.remove();
      }
    });
  }
}
