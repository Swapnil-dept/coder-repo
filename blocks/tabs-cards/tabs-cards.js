export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  const tabsNav = document.createElement('div');
  tabsNav.className = 'tabs-cards-nav';

  const tabsContent = document.createElement('div');
  tabsContent.className = 'tabs-cards-content';

  rows.forEach((row, index) => {
    const cells = [...row.children];
    const tabLabel = cells[0]?.textContent.trim() || `Tab ${index + 1}`;
    const cardsCell = cells[1];

    const tabBtn = document.createElement('button');
    tabBtn.className = 'tabs-cards-tab';
    tabBtn.textContent = tabLabel;
    tabBtn.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    tabBtn.setAttribute('role', 'tab');
    tabBtn.setAttribute('aria-controls', `tabs-cards-panel-${index}`);
    tabBtn.id = `tabs-cards-tab-${index}`;
    if (index === 0) tabBtn.classList.add('active');
    tabsNav.appendChild(tabBtn);

    const panel = document.createElement('div');
    panel.className = 'tabs-cards-panel';
    panel.id = `tabs-cards-panel-${index}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `tabs-cards-tab-${index}`);
    if (index !== 0) panel.hidden = true;

    const cardGrid = document.createElement('ul');
    cardGrid.className = 'tabs-cards-grid';

    if (cardsCell) {
      // Find all card containers — divs that contain a picture element
      const cardDivs = [...cardsCell.querySelectorAll(':scope div')]
        .filter((div) => div.querySelector(':scope > picture') || div.querySelector(':scope > p > picture'));

      // If no nested divs found, try direct children
      const candidates = cardDivs.length > 0
        ? cardDivs
        : [...cardsCell.children].filter((el) => el.querySelector('picture'));

      candidates.forEach((cardDiv) => {
        const card = document.createElement('li');
        card.className = 'tabs-card';

        const pic = cardDiv.querySelector('picture');
        if (pic) {
          const imgWrap = document.createElement('div');
          imgWrap.className = 'tabs-card-image';
          imgWrap.appendChild(pic.cloneNode(true));
          card.appendChild(imgWrap);
        }

        const body = document.createElement('div');
        body.className = 'tabs-card-body';

        const heading = cardDiv.querySelector('h3, h4, h5, h6');
        if (heading) {
          const title = document.createElement('h3');
          title.textContent = heading.textContent.trim();
          body.appendChild(title);
        }

        const paragraphs = cardDiv.querySelectorAll('p');
        paragraphs.forEach((p) => {
          const link = p.querySelector('a');
          if (link) {
            const btnWrap = document.createElement('p');
            btnWrap.className = 'button-container';
            const btn = document.createElement('a');
            btn.href = link.href;
            btn.textContent = link.textContent.trim();
            btn.className = 'button';
            btnWrap.appendChild(btn);
            body.appendChild(btnWrap);
          } else if (p.textContent.trim()) {
            const desc = document.createElement('p');
            desc.textContent = p.textContent.trim();
            body.appendChild(desc);
          }
        });

        card.appendChild(body);
        cardGrid.appendChild(card);
      });
    }

    panel.appendChild(cardGrid);
    tabsContent.appendChild(panel);
  });

  tabsNav.addEventListener('click', (e) => {
    const clickedTab = e.target.closest('.tabs-cards-tab');
    if (!clickedTab) return;

    tabsNav.querySelectorAll('.tabs-cards-tab').forEach((tab) => {
      tab.classList.remove('active');
      tab.setAttribute('aria-selected', 'false');
    });
    clickedTab.classList.add('active');
    clickedTab.setAttribute('aria-selected', 'true');

    tabsContent.querySelectorAll('.tabs-cards-panel').forEach((p) => {
      p.hidden = true;
    });
    const targetPanel = tabsContent.querySelector(`#${clickedTab.getAttribute('aria-controls')}`);
    if (targetPanel) targetPanel.hidden = false;
  });

  block.textContent = '';
  block.appendChild(tabsNav);
  block.appendChild(tabsContent);
}
