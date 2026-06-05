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
 * Returns true if a cell is a T&C-only cell:
 * single short paragraph that starts with * and has no other markup.
 */
function isTncCell(div) {
  const text = div.textContent.trim();
  return text.startsWith('*') && text.length < 100 && !div.querySelector('picture, img, a');
}

/**
 * Each block row = one promo card.
 * Document authoring: | text content | image |
 * UE: each field as a separate cell — all non-media cells accumulated into text panel.
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

    const textPanel = document.createElement('div');
    textPanel.className = 'promo-card-text';

    const imagePanel = document.createElement('div');
    imagePanel.className = 'promo-card-image';

    let tncText = '';

    [...row.children].forEach((cell) => {
      // Skip completely empty cells (UE may inject these for unset fields)
      if (!cell.textContent.trim() && !cell.querySelector('picture, img')) return;

      if (isMediaCell(cell)) {
        // ── Image cell ──────────────────────────────────────
        const picture = cell.querySelector('picture');
        const bareImg = !picture ? cell.querySelector('img') : null;
        const img = picture ? picture.querySelector('img') : bareImg;

        if (img && img.src) {
          const optimized = createOptimizedPicture(img.src, img.alt || '', false, [
            { media: '(min-width: 600px)', width: '600' },
            { width: '400' },
          ]);
          moveInstrumentation(img, optimized.querySelector('img'));
          imagePanel.append(optimized);
        }
      } else if (isTncCell(cell)) {
        // ── T&C cell (short * prefixed line, no links/images) ──
        tncText = cell.textContent.trim();
      } else {
        // ── Text cell — accumulate ALL non-media cells into text panel ──
        [...cell.children].forEach((child) => {
          // Detect CTA: a <p> containing only anchor(s) and no other text
          if (child.tagName === 'P') {
            const anchors = [...child.querySelectorAll('a')];
            if (anchors.length) {
              const nonLinkText = child.textContent
                .replace(anchors.map((a) => a.textContent).join(''), '')
                .trim();
              if (!nonLinkText) {
                anchors.forEach((a) => {
                  a.classList.add('promo-card-cta');
                  a.classList.remove('button'); // prevent global button gradient override
                });
                child.classList.add('promo-card-cta-wrapper');
              }
            }
          }
          textPanel.append(child);
        });
      }
    });

    // ── T&C badge (always rendered on the image panel) ──────
    const tncEl = document.createElement('span');
    tncEl.className = 'promo-card-tnc';
    tncEl.textContent = tncText || '*T&C Apply';
    imagePanel.append(tncEl);

    li.append(textPanel, imagePanel);
    grid.append(li);
  });

  block.replaceChildren(grid);
}
