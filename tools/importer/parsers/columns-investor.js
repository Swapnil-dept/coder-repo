/* eslint-disable */
/* global WebImporter */

/**
 * Columns block parser for investor corner section
 * Extracts investor image and links into a two-column layout.
 */
export default function parse(element, { document }) {
  const imgEl = element.querySelector('.image--investor img');
  const linksDiv = element.querySelector('.investor--links');

  if (!imgEl && !linksDiv) return;

  const cells = [['Columns']];

  const leftCell = document.createElement('div');
  if (imgEl) {
    const picture = document.createElement('picture');
    const img = document.createElement('img');
    img.src = imgEl.src;
    img.alt = imgEl.alt || 'Investor Corner';
    picture.appendChild(img);
    leftCell.appendChild(picture);
  }

  const rightCell = document.createElement('div');
  if (linksDiv) {
    const links = linksDiv.querySelectorAll('a');
    links.forEach((link) => {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent.trim();
      p.appendChild(a);
      rightCell.appendChild(p);
    });
  }

  cells.push([leftCell, rightCell]);

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
