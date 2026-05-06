export default function decorate(block) {
  const itemElements = [...block.children];
  if (!itemElements.length) return;

  // Extract section title from block data attribute or use default
  const sectionTitle = block.getAttribute('data-section-title') || 'Project Details';

  // Each child is a detail-item component
  const items = itemElements.map((itemEl) => {
    // Extract field values from data attributes or child elements
    const getFieldValue = (fieldName) => {
      const dataValue = itemEl.getAttribute(`data-${fieldName}`);
      if (dataValue) return dataValue;
      const childEl = itemEl.querySelector(`[data-${fieldName}]`);
      if (childEl) return childEl.textContent.trim() || childEl.getAttribute(`data-${fieldName}`);
      const byClass = itemEl.querySelector(`.${fieldName}`);
      if (byClass) return byClass.textContent.trim();
      return '';
    };
    
    return {
      label: getFieldValue('label'),
      value: getFieldValue('value'),
    };
  }).filter((item) => item.label && item.value);

  block.textContent = '';
  block.classList.add('project-details');

  // Title
  const titleEl = document.createElement('h2');
  titleEl.className = 'project-details-title';
  titleEl.textContent = sectionTitle;
  block.append(titleEl);

  // Grid
  const grid = document.createElement('div');
  grid.className = 'project-details-grid';

  items.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'project-details-card';

    const label = document.createElement('h3');
    label.className = 'project-details-label';
    label.textContent = item.label;

    const value = document.createElement('div');
    value.className = 'project-details-value';
    value.textContent = item.value;

    card.append(label, value);
    grid.append(card);
  });

  block.append(grid);
}
