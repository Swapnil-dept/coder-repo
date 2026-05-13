/* eslint-disable */
/* global WebImporter */

/**
 * ATDW Description parser
 * Extracts: full rich-text property description
 * Source element: #atdw-description (inside #atdw-information)
 */
export default function parse(element, { document }) {
  // Find styled-text region
  const textRegion = element.querySelector('[data-testid="styled-text"]')
    || element.querySelector('p')
    || element;

  const cells = [['ATDW Description']];

  const contentCell = document.createElement('div');

  // Copy all paragraph text
  const paragraphs = textRegion.querySelectorAll('p');
  if (paragraphs.length > 0) {
    paragraphs.forEach((p) => {
      const para = document.createElement('p');
      para.textContent = p.textContent.trim();
      contentCell.appendChild(para);
    });
  } else {
    const para = document.createElement('p');
    para.textContent = textRegion.textContent.trim();
    contentCell.appendChild(para);
  }

  cells.push([contentCell]);

  return WebImporter.DOMUtils.createTable(cells, document);
}
