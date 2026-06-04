import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/** Returns true if a cell contains only media and no visible text */
function isMediaCell(div) {
  if (!div.querySelector('picture, img')) return false;
  const clone = div.cloneNode(true);
  clone.querySelectorAll('picture, img').forEach((el) => el.remove());
  return clone.textContent.trim() === '';
}

/**
 * Each block row = one promo card.
 * Document authoring columns: | text content | image |
 * UE: one field per row — classified by isMediaCell.
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const grid = document.createElement('ul');
  grid.className = 'promo-cards-grid';

  rows.forEach((row) => {
    const li = document.createElement('li');
    li.className = 'promo-card';
    moveInstrumentation(row, li);

    let textCell = null;
    let imageCell = null;

    [...row.children].forEach((cell) => {
      if (isMediaCell(cell)) imageCell = cell;
      else textCell = cell;
    });

    // ── Text panel ──────────────────────────────────────────
    const textPanel = document.createElement('div');
    textPanel.className = 'promo-card-text';

    if (textCell) {
      [...textCell.children].forEach((child) => {
        // Style the CTA button link
        if (child.tagName === 'P') {
          const anchors = [...child.querySelectorAll('a')];
          const nonLinkText = child.textContent
            .replace(anchors.map((a) => a.textContent).join(''), '')
            .trim();
          if (anchors.length && !nonLinkText) {
            anchors.forEach((a) => a.classList.add('promo-card-cta'));
            child.classList.add('promo-card-cta-wrapper');
          }
        }
        textPanel.append(child);
      });
    }

    // ── Image panel ─────────────────────────────────────────
    const imagePanel = document.createElement('div');
    imagePanel.className = 'promo-card-image';

    if (imageCell) {
      const picture = imageCell.querySelector('picture');
      const bareImg = !picture ? imageCell.querySelector('img') : null;
      const img = picture ? picture.querySelector('img') : bareImg;

      if (img && img.src) {
        const optimized = createOptimizedPicture(img.src, img.alt || '', false, [
          { media: '(min-width: 600px)', width: '600' },
          { width: '400' },
        ]);
        moveInstrumentation(img, optimized.querySelector('img'));
        if (picture) picture.replaceWith(optimized);
        else bareImg.replaceWith(optimized);
        imagePanel.append(optimized);
      }

      // T&C note — author as last <p> in image cell or add statically
      const tnc = imageCell.querySelector('p');
      if (tnc && tnc.textContent.trim()) {
        const tncEl = document.createElement('span');
        tncEl.className = 'promo-card-tnc';
        tncEl.textContent = tnc.textContent.trim();
        imagePanel.append(tncEl);
      } else {
        const tncEl = document.createElement('span');
        tncEl.className = 'promo-card-tnc';
        tncEl.textContent = '*T&C Apply';
        imagePanel.append(tncEl);
      }
    }

    li.append(textPanel, imagePanel);
    grid.append(li);
  });

  block.replaceChildren(grid);
}
