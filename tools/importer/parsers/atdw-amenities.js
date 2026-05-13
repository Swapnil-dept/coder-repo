/* eslint-disable */
/* global WebImporter */

/**
 * ATDW Amenities parser
 * Produces one row per amenity with two cells matching model fields:
 *   Row 0: block header
 *   Row 1: heading      (field: heading)
 *   Row 2+: [name, description] per amenity item
 * Source element: #atdw-amenities
 * Returns the generated block table (does NOT modify the source DOM).
 */
export default function parse(element, { document }) {
  const cells = [['ATDW Amenities']];

  // ── Section heading ─────────────────────────────────────────────────────────
  const headingEl = element.querySelector('h2');
  cells.push([headingEl ? headingEl.textContent.trim() : 'Amenities']);

  // ── Amenity items ────────────────────────────────────────────────────────
  // The live page renders amenities as <li> elements (stable HTML element, no class dependency)
  const listItems = [...element.querySelectorAll('li')];

  if (listItems.length > 0) {
    listItems.forEach((li) => {
      const name = li.textContent.trim();
      if (name) cells.push([name, '']); // 2 cells: name | description
    });
  } else {
    // Fallback: look for div > span/p name+description pairs
    const wrappers = [...element.querySelectorAll('div')].filter((div) => {
      const ps = [...div.querySelectorAll(':scope > p, :scope > span')];
      return ps.length >= 2;
    });
    wrappers.forEach((wrapper) => {
      const ps = [...wrapper.querySelectorAll(':scope > p, :scope > span')]
        .map((el) => el.textContent.trim())
        .filter(Boolean);
      if (ps[0]) cells.push([ps[0], ps[1] || '']);
    });
  }

  return WebImporter.DOMUtils.createTable(cells, document);
}
