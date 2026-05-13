/* eslint-disable */
/* global WebImporter */

/**
 * ATDW Carousel parser
 * Produces one single-cell row per model field, in model order:
 *   Row 0: block header
 *   Row 1: heading     (field: heading)
 *   Row 2: image       (field: image)
 *   Row 3: category    (field: category)
 *   Row 4: title       (field: title)
 *   Row 5: description (field: description)
 *   Row 6: link        (field: link)
 * Takes the first slide as the featured card; runtime block fetches further
 * items from the ATDW API.
 * Source element: #atdw-you-may-also-like-carousel-wrapper
 * Returns the generated block table (does NOT modify the source DOM).
 */
export default function parse(element, { document }) {
  // ── Section heading ─────────────────────────────────────────────────────────
  const headingEl = element.querySelector('h2');
  const heading = headingEl ? headingEl.textContent.trim() : 'You May Also Like';

  // ── First slide — used as the featured/seed card ─────────────────────────
  const firstSlide = element.querySelector('.swiper-slide[data-sku]');

  // Image
  const img = firstSlide?.querySelector('img');
  const imageCell = document.createElement('div');
  if (img) {
    const imgEl = document.createElement('img');
    imgEl.src = img.src;
    imgEl.alt = img.alt || '';
    imageCell.appendChild(imgEl);
  }

  // Category — first <p> text inside the slide
  const paras = firstSlide
    ? [...firstSlide.querySelectorAll('p')].map((p) => p.textContent.trim()).filter(Boolean)
    : [];
  const category = paras[0] || '';

  // Title
  const titleEl = firstSlide?.querySelector('h2, h3');
  const title = titleEl ? titleEl.textContent.trim() : '';

  // Description — second <p> text
  const description = paras[1] || '';

  // Link — decode ATDW redirect
  const linkEl = firstSlide?.querySelector('a[href]');
  let link = linkEl ? linkEl.href : '';
  try {
    const destMatch = link.match(/dest=([^&]+)/);
    if (destMatch) link = decodeURIComponent(destMatch[1]);
  } catch (_) { /* keep raw URL */ }

  // ── Build table — one single-cell row per model field ───────────────────────
  const cells = [
    ['ATDW Carousel'], // block header
    [heading],         // field: heading
    [imageCell],       // field: image
    [category],        // field: category
    [title],           // field: title
    [description],     // field: description
    [link],            // field: link
  ];

  return WebImporter.DOMUtils.createTable(cells, document);
}
