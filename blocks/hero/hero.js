
import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // 1. Extract parent fields row (contains col1 and col2)
  const parentFieldsRow = children.shift();
  const [col1, col2] = parentFieldsRow?.children || [];

  // 2. Extract background color field div
  const backgroundColorDiv = children.shift();
  const bgColor = backgroundColorDiv?.textContent.trim();
  if (bgColor) {
    block.style.setProperty('--hero-background-color', bgColor);
  }
  backgroundColorDiv?.remove(); // Remove the div after reading its value

  // Create main content wrapper
  const heroMain = document.createElement('div');
  heroMain.classList.add('hero-main');

  // Left column: text content and CTA
  const heroText = document.createElement('div');
  heroText.classList.add('hero-text');

  // col1 children: heading, body, cta (collapsed)
  const col1Children = [...col1?.children || []];
  const headingDiv = col1Children.shift(); // First child is heading
  const bodyDiv = col1Children.shift();    // Second child is body
  const ctaDiv = col1Children.shift();     // Third child is CTA (collapsed)

  if (headingDiv) heroText.append(headingDiv);
  if (bodyDiv) heroText.append(bodyDiv);
  if (ctaDiv) {
    const cta = ctaDiv.querySelector('a');
    if (cta) {
      cta.classList.add('button', 'primary');
      heroText.append(cta);
    }
  }
  heroMain.append(heroText);

  // Right column: image and decorative SVG
  const heroImageContainer = document.createElement('div');
  heroImageContainer.classList.add('hero-image-container');

  // col2 children: image (collapsed), decorativeSvg
  const col2Children = [...col2?.children || []];
  const pictureDiv = col2Children.shift(); // First child is picture (collapsed)
  const decorativeSvgDiv = col2Children.shift(); // Second child is decorativeSvg

  if (pictureDiv) {
    // Support both document-authored <picture><img> and UE-authored bare <img>
    const picture = pictureDiv.querySelector('picture');
    const bareImg = !picture ? pictureDiv.querySelector('img') : null;
    const img = picture ? picture.querySelector('img') : bareImg;

    if (img && img.src) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      // Replace whatever source element existed, then append the new optimized picture
      if (picture) {
        picture.replaceWith(optimizedPic);
      } else {
        bareImg.replaceWith(optimizedPic);
      }
      heroImageContainer.append(optimizedPic); // append the NEW picture, not the old one
    }
  }

  if (decorativeSvgDiv) {
    const svgContent = decorativeSvgDiv.textContent.trim();
    if (svgContent) {
      const svgWrapper = document.createElement('div');
      svgWrapper.classList.add('hero-decorative-svg');
      svgWrapper.innerHTML = svgContent;
      heroImageContainer.append(svgWrapper);
    }
  }
  heroMain.append(heroImageContainer);

  // Append the main hero content to the block
  block.append(heroMain);

  // Navigation links (remaining children are hero-nav-item rows)
  if (children.length > 0) {
    const heroNav = document.createElement('div');
    heroNav.classList.add('hero-nav');
    const navList = document.createElement('ul');
    navList.classList.add('hero-nav-list');

    children.forEach((navItemRow) => {
      const li = document.createElement('li');
      moveInstrumentation(navItemRow, li); // Migrate instrumentation from row to li
      li.classList.add('hero-nav-item');

      const [labelDiv, linkDiv] = navItemRow.children;
      const label = labelDiv?.textContent.trim();
      const linkElement = linkDiv?.querySelector('a'); // The link is already an <a> due to aem-content

      if (linkElement && label) {
        linkElement.textContent = label; // Set the label as the link text
        linkElement.classList.add('hero-nav-link');
        // Add arrow icon
        const arrowSpan = document.createElement('span');
        arrowSpan.classList.add('hero-nav-arrow');
        arrowSpan.innerHTML = '&gt;'; // HTML entity for >
        linkElement.append(arrowSpan);
        li.append(linkElement);
      } else if (label) { // Fallback if link is missing but label exists
        const span = document.createElement('span');
        span.textContent = label;
        span.classList.add('hero-nav-link');
        const arrowSpan = document.createElement('span');
        arrowSpan.classList.add('hero-nav-arrow');
        arrowSpan.innerHTML = '&gt;';
        span.append(arrowSpan);
        li.append(span);
      }
      navList.append(li);
      navItemRow.remove(); // Remove the original row
    });
    heroNav.append(navList);
    block.append(heroNav);
  }

  // Remove the original parentFieldsRow after processing
  parentFieldsRow?.remove();
}
    