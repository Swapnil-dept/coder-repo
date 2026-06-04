import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/** Returns true when a cell contains only media and no visible text */
function isMediaCell(div) {
  if (!div.querySelector('picture, img')) return false;
  const clone = div.cloneNode(true);
  clone.querySelectorAll('picture, img').forEach((el) => el.remove());
  return clone.textContent.trim() === '';
}

export default function decorate(block) {
  const rows = [...block.children];
  block.innerHTML = '';

  rows.forEach((row) => {
    const item = document.createElement('div');
    item.className = 'rtb-item';
    moveInstrumentation(row, item);

    const cells = [...row.children];
    cells.forEach((cell) => {
      if (isMediaCell(cell)) {
        // ── Badge image ───────────────────────────────────────
        const badgeWrap = document.createElement('div');
        badgeWrap.className = 'rtb-item-badge';

        const picture = cell.querySelector('picture');
        const bareImg = !picture ? cell.querySelector('img') : null;
        const img = picture ? picture.querySelector('img') : bareImg;

        if (img && img.src) {
          const optimized = createOptimizedPicture(img.src, img.alt || '', false, [
            { width: '160' },
          ]);
          moveInstrumentation(img, optimized.querySelector('img'));
          badgeWrap.append(optimized);
        }

        item.append(badgeWrap);
      } else {
        // ── Descriptive text ──────────────────────────────────
        const textWrap = document.createElement('div');
        textWrap.className = 'rtb-item-text';
        [...cell.children].forEach((child) => textWrap.append(child));
        item.append(textWrap);
      }
    });

    block.append(item);
  });
}
