/**
 * ATDW Deal Card block: displays a single highlighted deal with badge,
 * title, description, conditions, sale end date, and a Book Now CTA.
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  const rows = [...block.children];
  // Expected rows (in order from doc table):
  // 0: Deal Type Badge (e.g. "DISCOUNT")
  // 1: Deal Title
  // 2: Deal Description
  // 3: Conditions
  // 4: Sale End Date
  // 5: CTA Label | CTA URL

  const [badgeRow, titleRow, descRow, condRow, dateRow, ctaRow] = rows;

  const card = document.createElement('div');
  card.className = 'atdw-deal-card-inner';

  if (badgeRow) {
    const badge = document.createElement('span');
    badge.className = 'atdw-deal-card-badge';
    badge.textContent = badgeRow.textContent.trim();
    card.appendChild(badge);
  }

  if (titleRow) {
    const title = document.createElement('h2');
    title.className = 'atdw-deal-card-title';
    title.textContent = titleRow.textContent.trim();
    card.appendChild(title);
  }

  if (descRow) {
    const desc = document.createElement('p');
    desc.className = 'atdw-deal-card-description';
    desc.textContent = descRow.textContent.trim();
    card.appendChild(desc);
  }

  if (condRow) {
    const cond = document.createElement('p');
    cond.className = 'atdw-deal-card-conditions';
    cond.innerHTML = condRow.innerHTML;
    card.appendChild(cond);
  }

  if (dateRow) {
    const date = document.createElement('p');
    date.className = 'atdw-deal-card-date';
    date.textContent = dateRow.textContent.trim();
    card.appendChild(date);
  }

  if (ctaRow) {
    const cells = [...ctaRow.children];
    const ctaLabel = cells[0]?.textContent?.trim() || 'Book Now';
    const ctaUrl = cells[1]?.textContent?.trim() || '#';
    const cta = document.createElement('a');
    cta.className = 'button atdw-deal-card-cta';
    cta.href = ctaUrl;
    cta.textContent = ctaLabel;
    cta.target = '_blank';
    cta.rel = 'noopener noreferrer';
    card.appendChild(cta);
  }

  block.textContent = '';
  block.appendChild(card);
}
