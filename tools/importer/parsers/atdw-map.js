/* eslint-disable */
/* global WebImporter */

/**
 * ATDW Map parser
 * Produces one single-cell row per model field, in model order:
 *   Row 0: block header
 *   Row 1: propertyName  (field: propertyName)
 *   Row 2: address       (field: address)
 *   Row 3: latitude      (field: latitude)
 *   Row 4: longitude     (field: longitude)
 *   Row 5: zoom          (field: zoom)
 * Source element: #atdw-address-map
 * Returns the generated block table (does NOT modify the source DOM).
 */
export default function parse(element, { document }) {
  // The map section contains <p> elements in order:
  //   [0] property name  e.g. "Beach Club, Hamilton Island"
  //   [1] address        e.g. "Hamilton Island, Whitsunday Area, Queensland, 4803"
  // Exclude Mapbox attribution paragraphs (contain "Mapbox" or "OpenStreetMap").
  const paras = [...element.querySelectorAll('p')]
    .map((p) => p.textContent.trim())
    .filter((t) => t && !t.includes('Mapbox') && !t.includes('OpenStreetMap')
      && !t.toLowerCase().startsWith('content provided'));

  const propertyName = paras[0] || '';
  const address = paras[1] || '';

  // Coordinates: Mapbox does not expose lat/lng via data attributes on the canvas.
  // Leave empty — authors can fill these in UE or via a data enrichment step.
  const lat = '';
  const lng = '';

  const cells = [
    ['ATDW Map'],    // block header
    [propertyName], // field: propertyName
    [address],      // field: address
    [lat],          // field: latitude
    [lng],          // field: longitude
    ['14'],         // field: zoom (default)
  ];

  return WebImporter.DOMUtils.createTable(cells, document);
}
