/* eslint-disable */
/* global WebImporter */

/**
 * Hero block parser
 * Extracts hero banner content: background image, heading, and CTA button
 * from a carousel/banner section.
 */
export default function parse(element, { document }) {
  const activeItem = element.querySelector('.bootstrape-item.active .item')
    || element.querySelector('.bootstrape-item .item')
    || element.querySelector('.item');

  if (!activeItem) return;

  const img = activeItem.querySelector('img');
  const heading = activeItem.querySelector('h1');
  const link = activeItem.querySelector('a');

  const cells = [['Hero']];

  // Row 1 → field: image (reference)
  const imageCell = document.createElement('div');
  if (img) {
    const imgEl = document.createElement('img');
    imgEl.src = img.src;
    imgEl.alt = img.alt || '';
    imageCell.appendChild(imgEl);
  }
  cells.push([imageCell]);

  // Row 2 → field: imageAlt (text)
  cells.push([img ? (img.alt || '') : '']);

  // Row 3 → field: text (richtext)
  const textCell = document.createElement('div');
  if (heading) {
    const h1 = document.createElement('h1');
    h1.textContent = heading.textContent.trim();
    textCell.appendChild(h1);
  }
  if (link) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.textContent.trim();
    p.appendChild(a);
    textCell.appendChild(p);
  }
  cells.push([textCell]);

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
