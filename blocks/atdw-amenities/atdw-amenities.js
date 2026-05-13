/**
 * ATDW Amenities block: grid of amenity items.
 * Model field order:
 *   Row 0: heading
 *   Row 1+: [name] | [description] per item
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  const rows = [...block.children];

  // Row 0 is heading
  const headingRow = rows[0];
  const heading = document.createElement('h2');
  heading.className = 'atdw-amenities-heading';
  heading.textContent = headingRow?.textContent?.trim() || 'Amenities';

  const grid = document.createElement('ul');
  grid.className = 'atdw-amenities-grid';

  rows.slice(1).forEach((row) => {
    const cells = [...row.children];
    const nameText = cells[0]?.textContent?.trim();  // field: name
    const descText = cells[1]?.textContent?.trim();  // field: description

    if (!nameText) return;

    const item = document.createElement('li');
    item.className = 'atdw-amenities-item';

    const label = document.createElement('strong');
    label.className = 'atdw-amenities-name';
    label.textContent = nameText;
    item.appendChild(label);

    if (descText) {
      const desc = document.createElement('span');
      desc.className = 'atdw-amenities-desc';
      desc.textContent = descText;
      item.appendChild(desc);
    }

    grid.appendChild(item);
  });

  block.textContent = '';
  block.appendChild(heading);
  block.appendChild(grid);
}
