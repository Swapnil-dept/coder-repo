import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'news-cards-image';
      } else {
        div.className = 'news-cards-body';
        // Wrap the last <p> containing a link as the CTA area
        const links = div.querySelectorAll('a');
        if (links.length) {
          const lastLink = links[links.length - 1];
          lastLink.classList.add('news-cards-cta');
          const btnContainer = lastLink.closest('p') || lastLink.parentElement;
          if (btnContainer) btnContainer.classList.add('news-cards-cta-wrapper');
        }
      }
    });
    ul.append(li);
  });

  // Optimize images
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimized.querySelector('img'));
    img.closest('picture').replaceWith(optimized);
  });

  block.replaceChildren(ul);
}
