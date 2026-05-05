/* eslint-disable */
/* global WebImporter */

/**
 * Cards block parser for group websites carousel
 * Extracts logo cards with image and link for each Adani group website.
 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll('.item.zoomin.slick-slide:not(.slick-cloned)');
  if (items.length === 0) return;

  const cells = [['Cards']];

  items.forEach((item) => {
    const img = item.querySelector('img');
    const link = item.querySelector('a');
    const name = item.querySelector('p a') || item.querySelector('p');

    const imageCell = document.createElement('div');
    if (img) {
      const picture = document.createElement('picture');
      const imgEl = document.createElement('img');
      imgEl.src = img.src;
      imgEl.alt = img.alt || '';
      picture.appendChild(imgEl);
      imageCell.appendChild(picture);
    }

    const textCell = document.createElement('div');
    if (link && name) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = name.textContent.trim();
      p.appendChild(a);
      textCell.appendChild(p);
    }

    cells.push([imageCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
