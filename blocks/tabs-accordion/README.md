
    # Tabs Accordion
    Displays content in a tabbed interface on desktop and transforms into an accordion on mobile.

    ## Image Analysis
    -   **Overall layout pattern:** The block features a horizontal tab navigation at the top, followed by a single-column content area. Within the content area, items are grouped under section headings, and each item is presented in a horizontal layout (icon, text, button).
    -   **Number of visual sections / rows:**
        -   One row for the main tab navigation.
        -   Within the active tab's content, there are multiple logical sections (e.g., "Beneficiary forms", "Benefit payments"), each acting as a sub-heading for a list of items.
        -   Each document list item occupies its own row.
    -   **Alignment, spacing rhythm:** Content is primarily left-aligned. There's a clear vertical spacing rhythm between the tab navigation and the content, between content sections, and between individual list items. Horizontal spacing for tabs is consistent.
    -   **Responsive behavior expectations:** The horizontal tab navigation is expected to transform into a vertical accordion on mobile devices. The content within each tab/accordion panel will remain a single column, with individual document list items adjusting their internal layout (e.g., button stacking below text) to fit narrower screens.

    ## Component Identification
    -   **Block type:** `tabs-accordion` (as requested, implying desktop tabs and mobile accordion behavior).
    -   **Sub-components:**
        -   **Tab Navigation Item:** `Most popular`, `Accumulation account`, etc. (7 visible items). The active tab has a distinct background and text color.
        -   **Section Heading:** `Beneficiary forms - Accumulation account`, `Benefit payments - Accumulation account`. These act as sub-headings within the content of an active tab.
        -   **Document List Item:** A repeating component representing a single downloadable document.
            -   **Icon:** A circular container with an outline SVG icon (e.g., document, link).
            -   **Title:** The main heading for the document.
            -   **Description:** A short explanatory text for the document.
            -   **Button:** An outline button with "Download PDF" text.
    -   **Number of repeating items:**
        -   7 tab navigation items.
        -   Within the active tab, there are 2 visible content sections.
        -   Within these sections, 3 document list items are visible in total.

    ## Multiple Screenshots → ONE block with variants
    Only one screenshot is provided, so no variants are identified for this block.

    ## Authoring Model (Field Suggestions)

    **Block: `tabs-accordion`**

    Block-level fields:
    -   `defaultActiveTab` (type: number) — authorable — The 0-indexed number of the tab that should be active by default when the page loads.

    Item-level fields (repeats for each tab):
    -   `tabTitle` (type: text) — authorable — The title displayed on the tab navigation.
    -   `tabContent` (type: richtext) — authorable — The rich text content for this tab. Authors will use standard heading elements (e.g., H2, H3) for section titles and a specific component or markdown pattern for document list items within this rich text field.

    *Note on `tabContent` structure*: Within the `tabContent` richtext field, authors would structure the content using headings for sections and a specific component or markdown pattern for each document item. For simplicity and flexibility in EDS, `richtext` is chosen, implying the structure within it is handled by styling or sub-components.

    ## Column Map
    For the `tabs-accordion` block:
      Column 0 → `tabTitle` (text)
      Column 1 → `tabContent` (richtext)

    ## OCR Content Inventory
    -   **Tab Navigation:**
        -   Most popular
        -   Accumulation account
        -   Transition to retirement
        -   Income account
        -   Insurance
        -   Adviser related forms
        -   All forms
    -   **Section Headings (within active tab):**
        -   Beneficiary forms - Accumulation account
        -   Benefit payments - Accumulation account
    -   **Document List Items:**
        -   **Title:** Death benefit nomination form
        -   **Description:** Choose who gets your super if you die.
        -   **Button:** Download PDF
        -   **Title:** Departing Australia Superannuation Payment (DASP)
        -   **Description:** Apply for payment if you've worked in Australia on a valid visa and have now left.
        -   **Button:** Download PDF
        -   **Title:** Early release of super benefits on grounds of severe financial hardship
        -   **Button:** Download PDF

    ## Visual Design Tokens
    -   **Background colors:**
        -   Page background: `#FFFFFF` (white)
        -   Active tab background: `#004F47` (dark teal/green)
        -   Icon circle background: `#E6F2F1` (light teal/green)
    -   **Text colors:**
        -   Default tab title: `#333333` (dark grey)
        -   Active tab title: `#FFFFFF` (white)
        -   Section heading: `#004F47` (dark teal/green)
        -   Document title: `#333333` (dark grey)
        -   Document description: `#808080` (medium grey)
        -   Button text: `#004F47` (dark teal/green)
    -   **Accent / CTA colors:**
        -   Active tab background/text: `#004F47` / `#FFFFFF`
        -   Button border/text: `#004F47`
    -   **Font sizes (px or rem estimates):**
        -   Tab titles: ~16px
        -   Section headings: ~20px
        -   Document titles: ~18px
        -   Document descriptions: ~14px
        -   Button text: ~16px
    -   **Font weights:**
        -   Tab titles: Regular/Medium
        -   Active tab title: Semibold/Bold
        -   Section headings: Semibold/Bold
        -   Document titles: Semibold/Bold
        -   Document descriptions: Regular
        -   Button text: Semibold/Bold
    -   **Border radius values:**
        -   Active tab: `8px` (top-left, top-right)
        -   Button: `20px` (fully rounded pill shape)
        -   Icon circle: `50%` (fully rounded)
    -   **Box shadows:** None visible.
    -   **Gradients:** None visible.
    -   **Spacing / gap values between elements (estimates):**
        -   Padding around tab titles: `16px` vertical, `24px` horizontal
        -   Gap between tabs: `8px`
        -   Vertical spacing between tab navigation and first section heading: `40px`
        -   Vertical spacing between section headings: `40px`
        -   Vertical spacing between document list items: `24px`
        -   Padding within document list item (icon to text): `24px`
        -   Padding within document list item (text to button): `24px` (variable, flex-grow)
        -   Padding within button: `12px` vertical, `24px` horizontal
        -   Icon circle size: `48px` diameter
    -   **Icon style:** Outline SVG icons.

    ## Interaction Hints
    -   **Static layout or interactive:** Interactive.
    -   **Specific behavior:**
        -   **Tabs (Desktop):** Clicking a tab title makes it active (changes background to dark teal, text to white) and displays its associated content. Only one tab can be active at a time.
        -   **Accordion (Mobile):** The horizontal tab navigation transforms into a vertical accordion. Each `tabTitle` becomes an accordion header. Clicking an accordion header expands/collapses its content panel. It is likely a single-open accordion (only one panel open at a time).
    -   **Visible hover states or transitions:**
        -   Tab titles (non-active): Expected to have a subtle background or text color change on hover.
        -   Buttons: Expected to have a background fill or border color change on hover.
    -   **Any animation cues:** Smooth transitions for tab content switching and accordion panel expansion/collapse are expected.

    ## Responsive Behavior
    -   **Desktop layout:** Tabs are displayed horizontally in a single row. The content area below tabs is a single column. Document list items are displayed horizontally with icon, title/description, and button.
    -   **Tablet layout (~900px):** Tabs might wrap to multiple rows if there are too many, or become a horizontally scrollable list. Content remains single column. Document list items likely maintain their horizontal layout, possibly with reduced padding or font sizes.
    -   **Mobile layout (~600px):**
        -   The horizontal tab navigation transforms into a vertical accordion. Each tab title becomes an accordion header.
        -   Content within each accordion panel (the document list) remains single column.
        -   Document list items: The icon and text content (title and description) will likely remain side-by-side, while the "Download PDF" button will stack below the text content to ensure readability and tap target size.
        -   Stacking order: Accordion headers first, then their content. Within content, section headings, then document items. Within document items, icon and text, then button below.
    -   **Suggested breakpoints:**
        -   `768px`: Transition point for tabs to accordion.
        -   `1024px`: Adjustments for larger tablet/desktop layouts.

    ## Content
    ```json
    {
      "defaultActiveTab": 1,
      "_itemCount": 7,
      "_items": [
        {
          "tabTitle": "Most popular",
          "tabContent": "<h2>Most Popular Forms</h2><div class=\"document-item\"><div class=\"document-icon document-icon-file\"></div><div class=\"document-details\"><h3>General Enquiry Form</h3><p>Submit a general enquiry or feedback.</p></div><p><a href=\"/forms/general-enquiry.pdf\">Download PDF</a></p></div>"
        },
        {
          "tabTitle": "Accumulation account",
          "tabContent": "<h2>Beneficiary forms - Accumulation account</h2><div class=\"document-item\"><div class=\"document-icon document-icon-file\"></div><div class=\"document-details\"><h3>Death benefit nomination form</h3><p>Choose who gets your super if you die.</p></div><p><a href=\"/forms/death-benefit-nomination.pdf\">Download PDF</a></p></div><h2>Benefit payments - Accumulation account</h2><div class=\"document-item\"><div class=\"document-icon document-icon-link\"></div><div class=\"document-details\"><h3>Departing Australia Superannuation Payment (DASP)</h3><p>Apply for payment if you've worked in Australia on a valid visa and have now left.</p></div><p><a href=\"/forms/dasp.pdf\">Download PDF</a></p></div><div class=\"document-item\"><div class=\"document-icon document-icon-file\"></div><div class=\"document-details\"><h3>Early release of super benefits on grounds of severe financial hardship</h3></div><p><a href=\"/forms/hardship-release.pdf\">Download PDF</a></p></div>"
        },
        {
          "tabTitle": "Transition to retirement",
          "tabContent": "<h2>Transition to Retirement Forms</h2><div class=\"document-item\"><div class=\"document-icon document-icon-file\"></div><div class=\"document-details\"><h3>Transition to Retirement Application</h3><p>Apply to start your transition to retirement income stream.</p></div><p><a href=\"/forms/ttr-application.pdf\">Download PDF</a></p></div>"
        },
        {
          "tabTitle": "Income account",
          "tabContent": "<h2>Income Account Forms</h2><div class=\"document-item\"><div class=\"document-icon document-icon-file\"></div><div class=\"document-details\"><h3>Income Account Application</h3><p>Apply to open an income account.</p></div><p><a href=\"/forms/income-account-application.pdf\">Download PDF</a></p></div>"
        },
        {
          "tabTitle": "Insurance",
          "tabContent": "<h2>Insurance Forms</h2><div class=\"document-item\"><div class=\"document-icon document-icon-file\"></div><div class=\"document-details\"><h3>Insurance Claim Form</h3><p>Submit a claim for your insurance benefits.</p></div><p><a href=\"/forms/insurance-claim.pdf\">Download PDF</a></p></div>"
        },
        {
          "tabTitle": "Adviser related forms",
          "tabContent": "<h2>Adviser Related Forms</h2><div class=\"document-item\"><div class=\"document-icon document-icon-file\"></div><div class=\"document-details\"><h3>Adviser Authority Form</h3><p>Authorize your financial adviser to act on your behalf.</p></div><p><a href=\"/forms/adviser-authority.pdf\">Download PDF</a></p></div>"
        },
        {
          "tabTitle": "All forms",
          "tabContent": "<h2>All Available Forms</h2><div class=\"document-item\"><div class=\"document-icon document-icon-file\"></div><div class=\"document-details\"><h3>Consolidate Super Form</h3><p>Combine your super accounts into one.</p></div><p><a href=\"/forms/consolidate-super.pdf\">Download PDF</a></p></div><div class=\"document-item\"><div class=\"document-icon document-icon-file\"></div><div class=\"document-details\"><h3>Change of Details Form</h3><p>Update your personal information.</p></div><p><a href=\"/forms/change-details.pdf\">Download PDF</a></p></div>"
        }
      ]
    }
    ```
    