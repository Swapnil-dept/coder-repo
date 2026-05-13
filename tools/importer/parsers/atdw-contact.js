/* eslint-disable */
/* global WebImporter */

/**
 * ATDW Contact parser
 * Produces one single-cell row per model field, in model order:
 *   Row 0: block header
 *   Row 1: heading        (field: heading)
 *   Row 2: websiteUrl     (field: websiteUrl)
 *   Row 3: email          (field: email)
 *   Row 4: phone          (field: phone)
 *   Row 5: instagram      (field: instagram)
 *   Row 6: facebook       (field: facebook)
 * Source element: #atdw-operator-contact
 */
export default function parse(element, { document }) {
  const headingEl = element.querySelector('h2');
  const heading = headingEl ? headingEl.textContent.trim() : 'Get in Touch';

  // Build a lookup of type → resolved URL from all anchors
  const anchors = [...element.querySelectorAll('a[href]')];
  const lookup = { websiteUrl: '', email: '', phone: '', instagram: '', facebook: '' };

  anchors.forEach((a) => {
    const href = a.href || '';
    if (href.startsWith('mailto:')) {
      lookup.email = lookup.email || href.replace('mailto:', '').split('?')[0];
    } else if (href.startsWith('tel:')) {
      lookup.phone = lookup.phone || href.replace('tel:', '');
    } else if (href.includes('instagram.com')) {
      lookup.instagram = lookup.instagram || href;
    } else if (href.includes('facebook.com')) {
      lookup.facebook = lookup.facebook || href;
    } else if (
      href.includes('redirect.atdw-online.com.au')
      || href.includes('hamiltonisland.com.au')
    ) {
      if (!lookup.websiteUrl) {
        try {
          const destMatch = href.match(/dest=([^&]+)/);
          lookup.websiteUrl = destMatch ? decodeURIComponent(destMatch[1]) : href;
        } catch (_) {
          lookup.websiteUrl = href;
        }
      }
    }
  });

  // One single-cell row per model field — empty string keeps the column aligned
  const cells = [
    ['ATDW Contact'],       // block header
    [heading],              // field: heading
    [lookup.websiteUrl],    // field: websiteUrl
    [lookup.email],         // field: email
    [lookup.phone],         // field: phone
    [lookup.instagram],     // field: instagram
    [lookup.facebook],      // field: facebook
  ];

  return WebImporter.DOMUtils.createTable(cells, document);
}
