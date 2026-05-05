/* eslint-disable */
/* global WebImporter */

/**
 * Hero block parser for ageupl.com
 * Extracts hero banner from slick carousel with h5 heading and subtitle paragraph.
 */
export default function parse(element, { document }) {
  const activeItem = element.querySelector('.slick-current .item, .slick-current, .slick-slide.slick-active');
  const item = activeItem || element.querySelector('.item');

  if (!item) return;

  const img = item.querySelector('img');
  const heading = item.querySelector('h5') || item.querySelector('h1, h2, h3, h4');
  const subtitle = item.querySelector('.border-l, .left--border-banner p, p');

  const cells = [['Hero']];
  const contentCell = document.createElement('div');

  if (img) {
    const picture = document.createElement('picture');
    const imgEl = document.createElement('img');
    imgEl.src = img.src;
    imgEl.alt = img.alt || 'Hero banner';
    picture.appendChild(imgEl);
    contentCell.appendChild(picture);
  }

  if (heading) {
    const h1 = document.createElement('h1');
    h1.textContent = heading.textContent.trim();
    contentCell.appendChild(h1);
  }

  if (subtitle && subtitle.textContent.trim()) {
    const p = document.createElement('p');
    p.textContent = subtitle.textContent.trim();
    contentCell.appendChild(p);
  }

  cells.push([contentCell]);

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
