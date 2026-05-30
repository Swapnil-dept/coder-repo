
import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const ARROW_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor"/>
</svg>`;

export default function decorate(block) {
  const variant = [...block.classList].find((cls) => ['icon-cards', 'text-cards', 'support-cards-with-header', 'member-spotlight-cards'].includes(cls));

  const children = [...block.children];
  const ul = document.createElement('ul');
  ul.classList.add('card-list');

  let blockHeadingElement = null;
  let blockSubheadingElement = null;

  // Handle block-level heading and subheading for 'support-cards-with-header' and 'member-spotlight-cards' variants
  if (variant === 'support-cards-with-header' || variant === 'member-spotlight-cards') {
    const headingDiv = children.shift(); // heading field
    // Only shift subheading if it's 'support-cards-with-header'
    const subheadingDiv = (variant === 'support-cards-with-header') ? children.shift() : null;

    if (headingDiv && headingDiv.textContent.trim()) {
      const h2 = document.createElement('h2');
      h2.classList.add('card-block-heading');
      h2.innerHTML = headingDiv.innerHTML; // Preserve rich text if any
      moveInstrumentation(headingDiv, h2); // Move instrumentation to the new h2
      blockHeadingElement = h2;
    }

    if (subheadingDiv && subheadingDiv.textContent.trim()) {
      const p = document.createElement('p');
      p.classList.add('card-block-subheading');
      p.innerHTML = subheadingDiv.innerHTML; // Preserve rich text
      moveInstrumentation(subheadingDiv, p); // Move instrumentation to the new p
      blockSubheadingElement = p;
    }
  }

  // Process card items
  children.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li); // Migrate instrumentation from original row div to new li
    li.classList.add('card-item');

    const [col1, col2, col3] = row.children;

    // col1: item_icon, item_icon_background_color (for icon-cards)
    // col1: item_icon (for member-spotlight-cards)
    if (col1) {
      if (variant === 'icon-cards') {
        const iconPictureDiv = col1.children[0]; // item_icon is the first child of col1
        const iconBgColorDiv = col1.children[1]; // item_icon_background_color is the second child of col1
        const iconBgColor = iconBgColorDiv?.textContent.trim() || '';

        if (iconPictureDiv) {
          const iconPicture = iconPictureDiv.querySelector('picture');
          if (iconPicture) {
            const iconWrapper = document.createElement('div');
            iconWrapper.classList.add('card-item-icon-wrapper');
            if (iconBgColor) {
              iconWrapper.style.backgroundColor = iconBgColor;
            }

            const img = iconPicture.querySelector('img');
            if (img) {
              const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '64' }]);
              moveInstrumentation(img, optimizedPic.querySelector('img')); // Move instrumentation from original img to the new img
              iconWrapper.append(optimizedPic);
            }
            li.append(iconWrapper);
          }
        }
      } else if (variant === 'member-spotlight-cards') {
        const memberImageDiv = col1.children[0]; // item_icon is the first child of col1
        if (memberImageDiv) {
          const memberPicture = memberImageDiv.querySelector('picture');
          if (memberPicture) {
            const img = memberPicture.querySelector('img');
            if (img) {
              // Optimize for a larger image, e.g., 750px width as per typical card images
              const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
              moveInstrumentation(img, optimizedPic.querySelector('img'));
              li.append(optimizedPic); // Append the optimized picture directly
            }
          }
        }
      }
    }

    // col2: item_title, item_description
    if (col2) {
      const titleDiv = col2.children[0]; // item_title is the first child of col2
      const descriptionDiv = col2.children[1]; // item_description is the second child of col2

      if (titleDiv && titleDiv.textContent.trim()) {
        const h3 = document.createElement('h3');
        h3.classList.add('card-item-title');
        h3.innerHTML = titleDiv.innerHTML; // Preserve rich text
        moveInstrumentation(titleDiv, h3); // Move instrumentation from original titleDiv to new h3
        li.append(h3);
      }

      if (descriptionDiv && descriptionDiv.textContent.trim()) {
        descriptionDiv.classList.add('card-item-description');
        li.append(descriptionDiv); // Append the original instrumented div
      }
    }

    // col3: item_cta, item_ctaText
    // This is used for icon-cards, text-cards, and member-spotlight-cards
    if (col3 && (variant === 'icon-cards' || variant === 'text-cards' || variant === 'member-spotlight-cards')) {
      const cta = col3.querySelector('a'); // Field collapse means cta and ctaText are one <a>
      if (cta) {
        cta.classList.add('card-item-cta');
        cta.innerHTML += ARROW_SVG; // Add arrow SVG
        li.append(cta);
      }
    }

    ul.append(li);
  });

  // Clear the block and re-append elements in the desired order
  block.innerHTML = '';
  if (blockHeadingElement) {
    block.append(blockHeadingElement);
  }
  if (blockSubheadingElement) {
    block.append(blockSubheadingElement);
  }
  block.append(ul);
}
    