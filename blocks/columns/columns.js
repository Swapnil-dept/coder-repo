/* eslint-disable */
/* global WebImporter */

/**
 * Columns block parser
 * Extracts two-column grid of key-value pairs (h3 + p) from Bootstrap row layout.
 */
export default function parse(element, { document }) {
  const rows = [];
  const cols = [...element.children].filter((el) => el.classList.contains('col-lg-7') || el.classList.contains('col-lg-5'));

  for (let i = 0; i < cols.length; i += 2) {
    const left = cols[i];
    const right = cols[i + 1];

    const leftContent = document.createElement('div');
    const rightContent = document.createElement('div');

    if (left) {
      const h3 = left.querySelector('h3');
      const p = left.querySelector('p');
      if (h3) {
        const heading = document.createElement('h3');
        heading.textContent = h3.textContent.trim();
        leftContent.appendChild(heading);
      }
      if (p && p.textContent.trim()) {
        const para = document.createElement('p');
        para.textContent = p.textContent.trim();
        leftContent.appendChild(para);
      }
    }

    if (right) {
      const h3 = right.querySelector('h3');
      const p = right.querySelector('p');
      if (h3) {
        const heading = document.createElement('h3');
        heading.textContent = h3.textContent.trim();
        rightContent.appendChild(heading);
      }
      if (p && p.textContent.trim()) {
        const para = document.createElement('p');
        para.textContent = p.textContent.trim();
        rightContent.appendChild(para);
      }
    }

    if (leftContent.children.length > 0 || rightContent.children.length > 0) {
      rows.push([leftContent, rightContent]);
    }
  }

  if (rows.length === 0) return;

  const cells = [['Columns'], ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
