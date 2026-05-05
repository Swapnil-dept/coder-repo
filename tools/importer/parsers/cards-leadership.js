/* eslint-disable */
/* global WebImporter */

/**
 * Cards block parser for leadership section
 * Extracts leader cards with photo, name, designation, and quote.
 */
export default function parse(element, { document }) {
  const leaders = element.querySelectorAll('.left--image-leader1');
  if (leaders.length === 0) return;

  const cells = [['Cards']];

  leaders.forEach((imgDiv) => {
    const img = imgDiv.querySelector('img');
    const dataDiv = imgDiv.nextElementSibling;
    if (!dataDiv) return;

    const name = dataDiv.querySelector('.NameOfTheLeader h2, .name--blue--leader');
    const designation = dataDiv.querySelector('.DesignationOfTheLeader p');
    const description = dataDiv.querySelector('.DesignationOfDescription p');

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
    if (name) {
      const h3 = document.createElement('h3');
      h3.textContent = name.textContent.trim();
      textCell.appendChild(h3);
    }
    if (designation) {
      const p = document.createElement('p');
      const em = document.createElement('em');
      em.textContent = designation.textContent.trim();
      p.appendChild(em);
      textCell.appendChild(p);
    }
    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      textCell.appendChild(p);
    }

    cells.push([imageCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
