import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children]; // Snapshot initial children

  // 1. Handle background color (first child)
  const backgroundColorDiv = children.shift();
  const bgColor = backgroundColorDiv?.textContent?.trim();
  if (bgColor) {
    block.style.backgroundColor = bgColor;
  }
  backgroundColorDiv?.remove(); // Remove the original div from DOM

  // Now, `block.children` are the remaining elements: image, text, cta
  // Get references to these elements before any further DOM manipulation
  const imageDiv = block.children[0];
  const textDiv = block.children[1];
  const ctaDiv = block.children[2];

  // 2. Process Image
  if (imageDiv) {
    const picture = imageDiv.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        picture.replaceWith(optimizedPic);
      }
    }
    imageDiv.classList.add('hero-image');
  }

  // 3. Create a content wrapper and move text/cta into it
  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('hero-content');

  if (textDiv) {
    // Move instrumentation from textDiv to contentWrapper
    moveInstrumentation(textDiv, contentWrapper);
    contentWrapper.append(...textDiv.children);
    textDiv.remove(); // Remove original textDiv from DOM
  }

  if (ctaDiv) {
    const cta = ctaDiv.querySelector('a');
    if (cta) {
      cta.classList.add('button');
    }
    // Append CTA content to contentWrapper.
    // If ctaDiv itself had instrumentation, we should move it to a new div inside contentWrapper.
    const ctaContentDiv = document.createElement('div');
    moveInstrumentation(ctaDiv, ctaContentDiv);
    ctaContentDiv.append(...ctaDiv.children);
    contentWrapper.append(ctaContentDiv);
    ctaDiv.remove(); // Remove original ctaDiv from DOM
  }

  // 4. Reassemble the block's children based on variants
  // The block now contains `imageDiv` (if present) and `contentWrapper` (if text/cta were present)
  // We need to ensure they are in the correct order.
  // The `imageDiv` and `contentWrapper` are the only two main elements we want as direct children.

  const finalChildren = [];
  if (block.classList.contains('image-left-text-right')) {
    if (imageDiv) finalChildren.push(imageDiv);
    finalChildren.push(contentWrapper);
  } else if (block.classList.contains('image-right-text-left')) {
    finalChildren.push(contentWrapper);
    if (imageDiv) finalChildren.push(imageDiv);
  } else {
    // Default layout
    if (imageDiv) finalChildren.push(imageDiv);
    finalChildren.push(contentWrapper);
  }

  // Ensure all original children are removed before appending the new structure.
  // This is the safest way to reorder without losing instrumentation on the *final* elements.
  // The instrumentation for textDiv and ctaDiv has already been moved to contentWrapper.
  // The instrumentation for imageDiv is still on imageDiv.
  // So, we can safely replace the block's children with our `finalChildren`.
  block.replaceChildren(...finalChildren);
}