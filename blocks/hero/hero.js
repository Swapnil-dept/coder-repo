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

  const contentCell = document.createElement('div');

  if (img) {
    const picture = document.createElement('picture');
    const imgEl = document.createElement('img');
    imgEl.src = img.src;
    imgEl.alt = img.alt || '';
    picture.appendChild(imgEl);
    contentCell.appendChild(picture);
  }

  if (heading) {
    const h1 = document.createElement('h1');
    h1.textContent = heading.textContent.trim();
    contentCell.appendChild(h1);
  }

  if (link) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.textContent.trim();
    p.appendChild(a);
    contentCell.appendChild(p);
  }

  cells.push([contentCell]);

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
