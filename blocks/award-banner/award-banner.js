import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Returns true when a cell contains only media (picture/img) and no visible text.
 */
function isMediaCell(div) {
  if (!div.querySelector('picture, img')) return false;
  const clone = div.cloneNode(true);
  clone.querySelectorAll('picture, img').forEach((el) => el.remove());
  return clone.textContent.trim() === '';
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const badgePanel = document.createElement('div');
  badgePanel.className = 'award-banner-badge';

  const contentPanel = document.createElement('div');
  contentPanel.className = 'award-banner-content';

  // Iterate all rows/cells — supports both document (2-col row) and UE (one field per row)
  rows.forEach((row) => {
    [...row.children].forEach((cell) => {
      if (isMediaCell(cell)) {
        // ── Badge image ──────────────────────────────────────
        const picture = cell.querySelector('picture');
        const bareImg = !picture ? cell.querySelector('img') : null;
        const img = picture ? picture.querySelector('img') : bareImg;

        if (img && img.src) {
          const optimized = createOptimizedPicture(img.src, img.alt || '', false, [
            { width: '400' },
          ]);
          moveInstrumentation(img, optimized.querySelector('img'));
          if (picture) picture.replaceWith(optimized);
          else bareImg.replaceWith(optimized);
          badgePanel.append(optimized);
        }
      } else {
        // ── Text + CTA cell → content panel ─────────────────
        [...cell.children].forEach((child) => {
          // Style <a> inside a paragraph-only <p> as pill CTA button
          if (child.tagName === 'P') {
            const anchors = [...child.querySelectorAll('a')];
            const nonLinkText = child.textContent
              .replace(anchors.map((a) => a.textContent).join(''), '')
              .trim();
            if (anchors.length && !nonLinkText) {
              anchors.forEach((a) => {
                a.classList.add('award-banner-cta');
                // Append arrow span if not already present
                if (!a.querySelector('.award-banner-arrow')) {
                  const arrow = document.createElement('span');
                  arrow.className = 'award-banner-arrow';
                  arrow.setAttribute('aria-hidden', 'true');
                  arrow.textContent = '→';
                  a.append(arrow);
                }
              });
              child.classList.add('award-banner-cta-wrapper');
            }
          }
          contentPanel.append(child);
        });
      }
    });
  });

  block.replaceChildren(badgePanel, contentPanel);
}
