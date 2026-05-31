
import { moveInstrumentation } from '../../scripts/scripts.js';

// Helper to load SVG
async function loadSVG(name) {
  if (!name) return null;
  const svgPath = `/icons/${name}.svg`;
  try {
    const response = await fetch(svgPath);
    if (!response.ok) {
      console.warn(`SVG not found: ${svgPath}`);
      return null;
    }
    const svgText = await response.text();
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
    const svgElement = svgDoc.querySelector('svg');
    if (svgElement) {
      svgElement.setAttribute('aria-hidden', 'true');
      svgElement.setAttribute('focusable', 'false');
    }
    return svgElement;
  } catch (error) {
    console.error(`Error loading SVG ${svgPath}:`, error);
    return null;
  }
}

export default async function decorate(block) {
  const children = [...block.children];

  // Handle block-level heading
  const headingDiv = children.shift();
  const headingText = headingDiv?.textContent.trim();
  if (headingText) {
    const h2 = document.createElement('h2');
    h2.textContent = headingText;
    moveInstrumentation(headingDiv, h2);
    block.append(h2);
  }
  headingDiv?.remove();

  const listContainer = document.createElement('div');
  listContainer.classList.add('list-block-items');

  // Process each list item
  for (let i = 0; i < children.length; i += 1) {
    const row = children[i]; // This is the instrumented row div for the item
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('list-block-item');
    moveInstrumentation(row, itemDiv); // Migrate instrumentation to the new itemDiv

    const [col1, col2, col3] = row.children;

    // Column 1: Item Icon
    const itemIconName = col1?.textContent.trim();
    if (itemIconName) {
      const iconWrapper = document.createElement('div');
      iconWrapper.classList.add('list-block-icon-wrapper');
      const svg = await loadSVG(itemIconName);
      if (svg) {
        iconWrapper.append(svg);
      }
      itemDiv.append(iconWrapper);
    }

    // Column 2: Item Title
    const itemTitle = col2?.textContent.trim();
    if (itemTitle) {
      const titleElement = document.createElement('p');
      titleElement.classList.add('list-block-item-title');
      titleElement.textContent = itemTitle;
      itemDiv.append(titleElement);
    }

    // Column 3: Button Link and Button Icon
    const buttonLink = col3?.querySelector('a');
    if (buttonLink) {
      buttonLink.classList.add('list-block-button');
      const buttonIconNameDiv = col3.children[1]; // Assuming buttonIconName is the second child div in col3
      const buttonIconName = buttonIconNameDiv?.textContent.trim();
      if (buttonIconName) {
        const svg = await loadSVG(buttonIconName);
        if (svg) {
          buttonLink.prepend(svg);
        }
      }
      itemDiv.append(buttonLink);
    }

    listContainer.append(itemDiv);

    // Add divider after each item except the last one
    if (i < children.length - 1) {
      const divider = document.createElement('div');
      divider.classList.add('list-block-divider');
      listContainer.append(divider);
    }
  }

  block.append(listContainer);

  // Remove original children (rows) as they have been processed and moved
  children.forEach((row) => row.remove());
}
    