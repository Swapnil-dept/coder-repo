/**
 * ATDW Contact block: "Get in Touch" heading with icon links for
 * Website, Email, Phone, Instagram, and Facebook.
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  const rows = [...block.children];

  // Model field order (one single-cell row each):
  // Row 0: heading
  // Row 1: websiteUrl
  // Row 2: email
  // Row 3: phone
  // Row 4: instagram
  // Row 5: facebook
  const getValue = (index) => rows[index]?.firstElementChild?.textContent?.trim()
    || rows[index]?.textContent?.trim()
    || '';

  const heading = getValue(0);
  const websiteUrl = getValue(1);
  const email = getValue(2);
  const phone = getValue(3);
  const instagram = getValue(4);
  const facebook = getValue(5);

  const headingEl = document.createElement('h2');
  headingEl.className = 'atdw-contact-heading';
  headingEl.textContent = heading || 'Get in Touch';

  const linksEl = document.createElement('div');
  linksEl.className = 'atdw-contact-links';

  const CONTACT_ITEMS = [
    { type: 'website',   url: websiteUrl, label: 'Website' },
    { type: 'email',     url: email,      label: 'Email' },
    { type: 'phone',     url: phone,      label: 'Phone' },
    { type: 'instagram', url: instagram,  label: 'Instagram' },
    { type: 'facebook',  url: facebook,   label: 'Facebook' },
  ];

  CONTACT_ITEMS.forEach(({ type, url, label }) => {
    if (!url) return;

    const item = document.createElement('a');
    item.className = `atdw-contact-item atdw-contact-${type}`;

    if (type === 'email') {
      item.href = url.startsWith('mailto:') ? url : `mailto:${url}`;
    } else if (type === 'phone') {
      item.href = url.startsWith('tel:') ? url : `tel:${url.replace(/\s/g, '')}`;
    } else {
      item.href = url;
      item.target = '_blank';
      item.rel = 'noopener noreferrer';
    }

    const icon = document.createElement('span');
    icon.className = `atdw-contact-icon icon-${type}`;
    icon.setAttribute('aria-hidden', 'true');

    const labelEl = document.createElement('span');
    labelEl.className = 'atdw-contact-label';
    labelEl.textContent = label;

    item.appendChild(icon);
    item.appendChild(labelEl);
    linksEl.appendChild(item);
  });

  block.textContent = '';
  block.appendChild(headingEl);
  block.appendChild(linksEl);
}
