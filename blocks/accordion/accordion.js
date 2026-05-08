import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Decorates the accordion block.
 * Each row of the block represents an accordion item with two columns:
 *   1. Title
 *   2. Content (rich text)
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    const details = document.createElement('details');
    details.className = 'accordion-item';
    moveInstrumentation(row, details);

    const cells = [...row.children];
    const titleCell = cells[0];
    const contentCell = cells[1];

    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    if (titleCell) {
      const label = document.createElement('div');
      label.className = 'accordion-item-label-text';
      while (titleCell.firstChild) label.append(titleCell.firstChild);
      summary.append(label);
    }

    const body = document.createElement('div');
    body.className = 'accordion-item-body';
    if (contentCell) {
      while (contentCell.firstChild) body.append(contentCell.firstChild);
    }

    details.append(summary, body);
    row.replaceWith(details);
  });
}
