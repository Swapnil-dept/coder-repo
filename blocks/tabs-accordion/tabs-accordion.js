
    import { loadSVG, moveInstrumentation } from '../../scripts/scripts.js';

    const ICON_MAP = {
      file: 'icon-file',
      link: 'icon-link',
    };

    async function createDocumentItem(itemDiv) {
      itemDiv.classList.add('tabs-accordion-document-item');

      const iconDiv = itemDiv.querySelector('.document-icon');
      if (iconDiv) {
        const iconType = Array.from(iconDiv.classList).find((cls) => cls.startsWith('document-icon-'))?.replace('document-icon-', '');
        if (iconType && ICON_MAP[iconType]) {
          const svg = await loadSVG(ICON_MAP[iconType]);
          if (svg) {
            iconDiv.innerHTML = '';
            iconDiv.append(svg);
          }
        }
      }

      const detailsDiv = itemDiv.querySelector('.document-details');
      if (detailsDiv) {
        detailsDiv.classList.add('tabs-accordion-document-details');
        const title = detailsDiv.querySelector('h3');
        if (title) title.classList.add('tabs-accordion-document-title');
        const description = detailsDiv.querySelector('p');
        if (description) description.classList.add('tabs-accordion-document-description');
      }

      const buttonP = itemDiv.querySelector('p:last-child > a');
      if (buttonP) {
        const button = buttonP.closest('p');
        button.classList.add('tabs-accordion-document-button-wrapper');
        buttonP.classList.add('tabs-accordion-document-button');
      }
    }

    export default async function decorate(block) {
      const children = [...block.children];

      // Extract defaultActiveTab from the first row if it exists
      let defaultActiveTab = 0;
      if (children.length > 0 && children[0].children.length === 1) {
        const defaultTabDiv = children.shift();
        const defaultTabValue = parseInt(defaultTabDiv.textContent.trim(), 10);
        if (!Number.isNaN(defaultTabValue)) {
          defaultActiveTab = defaultTabValue;
        }
      }

      const tabList = document.createElement('div');
      tabList.setAttribute('role', 'tablist');
      tabList.classList.add('tabs-accordion-tablist');

      const tabPanelsContainer = document.createElement('div');
      tabPanelsContainer.classList.add('tabs-accordion-tabpanels-container');

      const tabButtons = [];
      const tabPanels = [];

      children.forEach((row, i) => {
        const [col1, col2] = row.children; // col1: tabTitle, col2: tabContent

        // Create tab button
        const tabButton = document.createElement('button');
        tabButton.setAttribute('role', 'tab');
        tabButton.setAttribute('id', `tab-${i}`);
        tabButton.setAttribute('aria-controls', `panel-${i}`);
        tabButton.setAttribute('aria-selected', 'false');
        tabButton.setAttribute('tabindex', '-1');
        tabButton.classList.add('tabs-accordion-tab-button');
        tabButton.textContent = col1.textContent.trim();
        tabList.append(tabButton);
        tabButtons.push(tabButton);

        // Create tab panel
        const tabPanel = document.createElement('div');
        moveInstrumentation(row, tabPanel); // Migrate instrumentation from original row to new panel
        tabPanel.setAttribute('role', 'tabpanel');
        tabPanel.setAttribute('id', `panel-${i}`);
        tabPanel.setAttribute('aria-labelledby', `tab-${i}`);
        tabPanel.setAttribute('hidden', ''); // Initially hidden
        tabPanel.classList.add('tabs-accordion-tab-panel');

        // Process tab content
        const contentDiv = col2;
        contentDiv.querySelectorAll('h2').forEach((h2) => {
          h2.classList.add('tabs-accordion-section-heading');
        });
        contentDiv.querySelectorAll('.document-item').forEach(createDocumentItem);
        tabPanel.append(...contentDiv.children); // Append all children of col2 to the panel
        tabPanelsContainer.append(tabPanel);
        tabPanels.push(tabPanel);
      });

      block.innerHTML = ''; // Clear the block
      block.append(tabList, tabPanelsContainer);

      // Activate a tab
      const activateTab = (index) => {
        tabButtons.forEach((button, i) => {
          const isActive = i === index;
          button.setAttribute('aria-selected', isActive);
          button.setAttribute('tabindex', isActive ? '0' : '-1');
          button.classList.toggle('active', isActive);
          tabPanels[i].toggleAttribute('hidden', !isActive);
        });
        tabButtons[index].focus();
      };

      // Event listeners for tab buttons
      tabButtons.forEach((button, i) => {
        button.addEventListener('click', () => activateTab(i));
        button.addEventListener('keydown', (e) => {
          let newIndex = i;
          if (e.key === 'ArrowRight') {
            newIndex = (i + 1) % tabButtons.length;
          } else if (e.key === 'ArrowLeft') {
            newIndex = (i - 1 + tabButtons.length) % tabButtons.length;
          } else if (e.key === 'Home') {
            newIndex = 0;
          } else if (e.key === 'End') {
            newIndex = tabButtons.length - 1;
          } else {
            return; // Do not prevent default for other keys
          }
          e.preventDefault();
          activateTab(newIndex);
        });
      });

      // Initial activation
      if (tabButtons.length > 0) {
        activateTab(Math.min(defaultActiveTab, tabButtons.length - 1));
      }

      // Mobile Accordion Logic
      const mediaQuery = window.matchMedia('(max-width: 767px)');

      const setupAccordion = () => {
        tabList.classList.add('tabs-accordion-accordion-list');
        tabButtons.forEach((button, i) => {
          button.setAttribute('role', 'button');
          button.setAttribute('aria-expanded', 'false');
          button.setAttribute('aria-controls', `panel-${i}`);
          button.removeAttribute('aria-selected');
          button.removeAttribute('tabindex');
          button.classList.add('tabs-accordion-accordion-header');
          button.classList.remove('tabs-accordion-tab-button');

          const panel = tabPanels[i];
          panel.classList.add('tabs-accordion-accordion-panel');
          panel.removeAttribute('aria-labelledby');
          panel.setAttribute('role', 'region');

          // Wrap button and panel in a details/summary for native accordion behavior
          const details = document.createElement('details');
          details.classList.add('tabs-accordion-accordion-item');
          const summary = document.createElement('summary');
          summary.classList.add('tabs-accordion-accordion-summary');
          summary.append(button);
          details.append(summary, panel);
          tabPanelsContainer.append(details); // Temporarily append to container to move later

          // Move the details element to replace the original button/panel in the DOM
          // This is tricky because we're iterating and modifying.
          // A better approach is to build a new structure and replace.
          // For now, let's just append to the container and then replace block.children
        });

        // Rebuild the block content for accordion
        block.innerHTML = '';
        tabPanelsContainer.querySelectorAll('.tabs-accordion-accordion-item').forEach((item) => {
          block.append(item);
        });

        // Accordion interaction
        block.querySelectorAll('.tabs-accordion-accordion-item').forEach((item, i) => {
          const summary = item.querySelector('.tabs-accordion-accordion-summary');
          const headerButton = summary.querySelector('.tabs-accordion-accordion-header');
          const panel = item.querySelector('.tabs-accordion-accordion-panel');

          // Set initial state
          if (i === defaultActiveTab) {
            item.setAttribute('open', '');
            headerButton.setAttribute('aria-expanded', 'true');
          } else {
            headerButton.setAttribute('aria-expanded', 'false');
          }

          item.addEventListener('toggle', () => {
            const isOpen = item.open;
            headerButton.setAttribute('aria-expanded', isOpen);
            if (isOpen) {
              // Close other open accordions
              block.querySelectorAll('.tabs-accordion-accordion-item').forEach((otherItem) => {
                if (otherItem !== item && otherItem.open) {
                  otherItem.removeAttribute('open');
                  otherItem.querySelector('.tabs-accordion-accordion-header').setAttribute('aria-expanded', 'false');
                }
              });
            }
          });
        });
      };

      const setupTabs = () => {
        block.innerHTML = '';
        block.append(tabList, tabPanelsContainer);

        tabList.classList.remove('tabs-accordion-accordion-list');
        tabButtons.forEach((button, i) => {
          button.setAttribute('role', 'tab');
          button.setAttribute('aria-selected', 'false');
          button.setAttribute('tabindex', '-1');
          button.removeAttribute('aria-expanded');
          button.classList.remove('tabs-accordion-accordion-header');
          button.classList.add('tabs-accordion-tab-button');

          const panel = tabPanels[i];
          panel.setAttribute('role', 'tabpanel');
          panel.setAttribute('aria-labelledby', `tab-${i}`);
          panel.classList.remove('tabs-accordion-accordion-panel');
        });
        activateTab(Math.min(defaultActiveTab, tabButtons.length - 1));
      };

      const handleMediaQueryChange = (e) => {
        if (e.matches) {
          // Mobile layout
          setupAccordion();
        } else {
          // Desktop layout
          setupTabs();
        }
      };

      // Initial setup based on media query
      handleMediaQueryChange(mediaQuery);
      mediaQuery.addEventListener('change', handleMediaQueryChange);
    }
    