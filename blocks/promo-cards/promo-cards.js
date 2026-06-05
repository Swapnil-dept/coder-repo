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

    const cells = [...row.children];
    for (let i = 0; i < cells.length; i += 1) {
      const cell = cells[i];

      // Skip completely empty cells (UE may inject these for unset fields)
      if (!cell.textContent.trim() && !cell.querySelector('picture, img')) continue;

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
        continue;
      }

      if (isTncCell(cell)) {
        // ── T&C cell ──────────────────────────────────────
        tncText = cell.textContent.trim();
        continue;
      }

      // ── CTA detection: cell contains only anchor(s), no other visible text/media ──
      // Works for both <div><a>...</a></div> and <div><p><a>...</a></p></div> patterns.
      const cellAnchors = [...cell.querySelectorAll('a')];
      const textBesidesLinks = cell.textContent
        .replace(cellAnchors.map((a) => a.textContent).join(''), '')
        .trim();

      if (cellAnchors.length && textBesidesLinks === '' && !cell.querySelector('picture, img')) {
        // Look ahead: next non-empty, non-media, non-link cell holds the button label
        const nextCell = cells[i + 1];
        if (
          nextCell
          && !isMediaCell(nextCell)
          && !isTncCell(nextCell)
          && !nextCell.querySelector('a')
          && nextCell.textContent.trim()
        ) {
          cellAnchors[0].textContent = nextCell.textContent.trim();
          i += 1; // consume the label cell
        }
        cellAnchors.forEach((a) => {
          a.classList.add('promo-card-cta');
          a.classList.remove('button'); // prevent global button gradient override
        });
        const ctaWrapper = document.createElement('p');
        ctaWrapper.className = 'promo-card-cta-wrapper';
        cellAnchors.forEach((a) => ctaWrapper.append(a));
        textPanel.append(ctaWrapper);
        continue;
      }

      // ── Regular text cell ──────────────────────────────────
      if (cell.children.length) {
        // Cell has block children (<p>, <h2>, etc.) — append them directly
        [...cell.children].forEach((child) => textPanel.append(child));
      } else if (cell.textContent.trim()) {
        // Cell has only a text node (no element wrapper) — wrap in <p>
        const p = document.createElement('p');
        p.innerHTML = cell.innerHTML;
        textPanel.append(p);
      }
    }

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
