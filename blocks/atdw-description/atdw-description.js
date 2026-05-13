/**
 * ATDW Description block: rich text with a "Read More" expand toggle.
 * Truncates to ~4 lines on load; click "Read More" to reveal full text.
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  const content = block.querySelector('div > div');
  if (!content) return;

  content.className = 'atdw-description-text';

  const toggle = document.createElement('button');
  toggle.className = 'atdw-description-toggle';
  toggle.textContent = 'Read More';
  toggle.setAttribute('aria-expanded', 'false');

  let expanded = false;

  toggle.addEventListener('click', () => {
    expanded = !expanded;
    content.classList.toggle('expanded', expanded);
    toggle.textContent = expanded ? 'Read Less' : 'Read More';
    toggle.setAttribute('aria-expanded', String(expanded));
  });

  block.appendChild(toggle);
}
