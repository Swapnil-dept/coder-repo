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

  // Contact items with values displayed
  const CONTACT_ITEMS = [
    { type: 'website', url: websiteUrl, label: 'Website', icon: 'globe', showValue: true },
    { type: 'email', url: email, label: 'Email', icon: 'email', showValue: true },
    { type: 'phone', url: phone, label: 'Phone', icon: 'phone', showValue: true },
  ];

  // Social links (icon only)
  const SOCIAL_ITEMS = [
    { type: 'instagram', url: instagram, label: 'Instagram', icon: 'instagram' },
    { type: 'facebook', url: facebook, label: 'Facebook', icon: 'facebook' },
  ];

  /**
   * Create a contact/social link item
   */
  function createContactItem({ type, url, label, icon, showValue = false }) {
    if (!url) return null;

    const item = document.createElement('a');
    item.className = `atdw-contact-item atdw-contact-${type}`;

    let displayValue = url;

    if (type === 'email') {
      item.href = url.startsWith('mailto:') ? url : `mailto:${url}`;
      displayValue = url.replace('mailto:', '');
    } else if (type === 'phone') {
      item.href = url.startsWith('tel:') ? url : `tel:${url.replace(/\s/g, '')}`;
      displayValue = url.replace('tel:', '');
    } else {
      item.href = url;
      item.target = '_blank';
      item.rel = 'noopener noreferrer';
      // Truncate URL display
      try {
        const urlObj = new URL(url);
        displayValue = urlObj.hostname + urlObj.pathname.slice(0, 10) + (urlObj.pathname.length > 10 ? '...' : '');
      } catch {
        displayValue = url.length > 30 ? `${url.slice(0, 27)}...` : url;
      }
    }

    // Icon element using img tag
    const iconEl = document.createElement('span');
    iconEl.className = `atdw-contact-icon icon-${type}`;
    iconEl.setAttribute('aria-hidden', 'true');

    const iconImg = document.createElement('img');
    iconImg.src = `/icons/${icon}.svg`;
    iconImg.alt = '';
    iconImg.loading = 'lazy';
    iconEl.appendChild(iconImg);

    // Text wrapper
    const textEl = document.createElement('span');
    textEl.className = 'atdw-contact-text';

    const labelEl = document.createElement('span');
    labelEl.className = 'atdw-contact-label';
    labelEl.textContent = label;
    textEl.appendChild(labelEl);

    if (showValue) {
      const valueEl = document.createElement('span');
      valueEl.className = 'atdw-contact-value';
      valueEl.textContent = displayValue;
      textEl.appendChild(valueEl);
    }

    item.appendChild(iconEl);
    item.appendChild(textEl);

    return item;
  }

  // Add contact items
  CONTACT_ITEMS.forEach((itemData) => {
    const item = createContactItem(itemData);
    if (item) linksEl.appendChild(item);
  });

  // Add social links container
  const hasSocial = SOCIAL_ITEMS.some(({ url }) => url);
  if (hasSocial) {
    const socialEl = document.createElement('div');
    socialEl.className = 'atdw-contact-social';

    SOCIAL_ITEMS.forEach((itemData) => {
      const item = createContactItem(itemData);
      if (item) socialEl.appendChild(item);
    });

    linksEl.appendChild(socialEl);
  }

  block.textContent = '';
  block.appendChild(headingEl);
  block.appendChild(linksEl);
}
