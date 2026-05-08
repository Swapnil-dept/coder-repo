import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const isHorizontal = block.classList.contains('horizontal');
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    if (isHorizontal) {
      const body = li.querySelector('.cards-card-body');
      if (body) {
        body.querySelectorAll('em').forEach((em) => {
          const tag = document.createElement('span');
          tag.className = 'cards-card-tag';
          tag.textContent = em.textContent;
          em.replaceWith(tag);
        });
        const links = body.querySelectorAll('a');
        const lastLink = links[links.length - 1];
        if (lastLink) {
          lastLink.className = 'cards-card-cta';
        }
      }
    }
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.replaceChildren(ul);
}
