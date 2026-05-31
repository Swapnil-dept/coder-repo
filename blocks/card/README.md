
# Card Block
A flexible "Cards" component with three distinct visual variants, primarily differing in the presence of icons, the number of columns, and the block-level header.

## Image Analysis
This block presents a flexible "Cards" component with three distinct visual variants, primarily differing in the presence of icons, the number of columns, and the block-level header.

---

## Layout Blueprint
-   **Overall layout pattern**: Grid-based, with items arranged in columns.
-   **Number of visual sections / rows**:
    *   Variant 1 & 2: Single row of cards.
    *   Variant 3: One row for the main heading/subheading, followed by one row of cards.
-   **Alignment, spacing rhythm**:
    *   All content is left-aligned within its card container.
    *   Consistent vertical spacing between elements within a card (icon/title/description/CTA).
    *   Consistent horizontal spacing between cards.
    *   Consistent padding around the block.
-   **Responsive behavior expectations**: Cards should stack vertically on mobile, likely one card per row. On tablet, they might maintain 2 columns or stack depending on the variant and content length.

## Component Identification
-   **Block type**: `cards` (or `feature-grid`)
-   **Sub-components**:
    *   **Icons**: Circular background with a line-art SVG icon (Variant 1).
    *   **Headings**: Main block heading (Variant 3), card titles.
    *   **Body text**: Card descriptions, block subheading (Variant 3).
    *   **Buttons**: Outlined buttons with an integrated right arrow icon (Variant 1 & 2).
    *   **Links**: Inline text links within descriptions (Variant 3).
-   **Number of repeating items**:
    *   Variant 1: 3 cards
    *   Variant 2: 2 cards
    *   Variant 3: 3 cards

## Multiple Screenshots → ONE block with variants

**Shared Block Type**: `cards`

**Shared Field Model (Block-level)**:
-   `heading` (type: text) — authorable — Main heading for the block (optional, used in `support-cards-with-header` variant).
-   `subheading` (type: richtext) — authorable — Subheading/introductory text for the block (optional, used in `support-cards-with-header` variant).

**Shared Field Model (Item-level)**:
-   `item_icon` (type: reference) — authorable — Reference to an image or SVG for the card icon (optional, used in `icon-cards` variant).
-   `item_icon_background_color` (type: text) — authorable — Hex code for the circular background color of the icon (optional, used in `icon-cards` variant).
-   `item_title` (type: text) — authorable — Title of the card.
-   `item_description` (type: richtext) — authorable — Body text/description for the card. Allows for inline links.
-   `item_cta_text` (type: text) — authorable — Text for the Call-to-Action button (optional, not used in `support-cards-with-header` variant).
-   `item_cta_link` (type: reference) — authorable — URL for the Call-to-Action button (optional, not used in `support-cards-with-header` variant).

---

### Variant 1: `icon-cards`

**What differs per variant (CSS delta & optional fields)**:
-   **Layout**: 3 columns.
-   **Components**: Each card includes an icon with a circular background.
-   **Fields used**: `item_icon`, `item_icon_background_color`, `item_title`, `item_description`, `item_cta_text`, `item_cta_link`.
-   **Fields not used**: `heading`, `subheading`.

### Variant 2: `text-cards`

**What differs per variant (CSS delta & optional fields)**:
-   **Layout**: 2 columns.
-   **Components**: No icons.
-   **Fields used**: `item_title`, `item_description`, `item_cta_text`, `item_cta_link`.
-   **Fields not used**: `heading`, `subheading`, `item_icon`, `item_icon_background_color`.

### Variant 3: `support-cards-with-header`

**What differs per variant (CSS delta & optional fields)**:
-   **Layout**: Block-level `heading` and `subheading` above 3 columns of cards.
-   **Components**: No icons. No explicit CTA buttons at the item level; instead, `item_description` contains inline links.
-   **Fields used**: `heading`, `subheading`, `item_title`, `item_description`.
-   **Fields not used**: `item_icon`, `item_icon_background_color`, `item_cta_text`, `item_cta_link`.

---

## Authoring Model (Field Suggestions)

**Block-level fields**:
-   `heading` (type: text) — authorable — Main heading for the block (optional, used in `support-cards-with-header` variant).
-   `subheading` (type: richtext) — authorable — Subheading/introductory text for the block (optional, used in `support-cards-with-header` variant).
-   `variant` (type: text) — fixed — Stores the kebab-case variant name (`icon-cards`, `text-cards`, `support-cards-with-header`).

**Item-level fields (repeats for each card)**:
-   `item_icon` (type: reference) — authorable — Reference to an image or SVG for the card icon (optional, used in `icon-cards` variant).
-   `item_icon_background_color` (type: text) — authorable — Hex code for the circular background color of the icon (optional, used in `icon-cards` variant).
-   `item_title` (type: text) — authorable — Title of the card.
-   `item_description` (type: richtext) — authorable — Body text/description for the card. Allows for inline links.
-   `item_cta_text` (type: text) — authorable — Text for the Call-to-Action button (optional, not used in `support-cards-with-header` variant).
-   `item_cta_link` (type: reference) — authorable — URL for the Call-to-Action button (optional, not used in `support-cards-with-header` variant).

## Column Map
This block would likely be authored using a nested structure or a multi-tab dialog for the block-level fields and then a multifield for the items. If forced into a single table, it would look like this, with many optional columns:

**Block-level (first row of table, or separate dialog)**:
-   Column 0 → `heading` (text)
-   Column 1 → `subheading` (richtext)
-   Column 2 → `variant` (text)

**Item-level (subsequent rows of table)**:
-   Column 0 → `item_icon` (reference)
-   Column 1 → `item_icon_background_color` (text)
-   Column 2 → `item_title` (text)
-   Column 3 → `item_description` (richtext)
-   Column 4 → `item_cta_text` (text)
-   Column 5 → `item_cta_link` (reference)

## OCR Content Inventory

**Variant 1: `icon-cards`**
-   **Card 1**:
    -   Title: PDS and fact sheets
    -   Body: Everything you need to know about NGS and how super works.
    -   Button: Learn more
-   **Card 2**:
    -   Title: Fund information
    -   Body: Access our ABN, SPIN, and USI to help you complete forms and requests, and other key details about us, our policies, and our Board.
    -   Button: Learn more
-   **Card 3**:
    -   Title: FAQ
    -   Body: Super can be complicated, from contributions, tax, fees, insurance and more. Get answers to all your frequently asked NGS Super questions.
    -   Button: Find out more

**Variant 2: `text-cards`**
-   **Card 1**:
    -   Title: Members First, Always
    -   Body: Members are at the heart of everything we do, which is why our service promise is Members First, Always.
    -   Button: Discover our service promise
-   **Card 2**:
    -   Title: About NGS Super
    -   Body: From exploring our history to getting to know our team, learn more about NGS Super.
    -   Button: Learn about NGS

**Variant 3: `support-cards-with-header`**
-   **Block Heading**: We're here to support you
-   **Block Subheading**: No matter what stage you're at with your super, we're here to support you. Contact us, book time with a specialist, or explore our education and resources.
-   **Card 1**:
    -   Title: Give us a call
    -   Body: Call our helpline on 1300 133 177 (Mon to Fri, 8am to 8pm AEST/AEDT) with any questions you might have about your super.
-   **Card 2**:
    -   Title: Book an NGS Advice appointment
    -   Body: Book an appointment with a Super Specialist, Phone Adviser or a Financial Planner.
-   **Card 3**:
    -   Title: Education and tools
    -   Body: Our extensive range of financial education tools and resources are ready when you are.

## Visual Design Tokens

-   **Background colors**:
    *   Block background: `#FFFFFF` (white)
    *   Icon background (Variant 1):
        *   Card 1: `#E0F2F2` (light teal)
        *   Card 2: `#E0F2E8` (light green)
        *   Card 3: `#FCE0E0` (light red/pink)
-   **Text colors**:
    *   Main Heading (Variant 3): `#004F47` (dark teal)
    *   Card Titles: `#004F47` (dark teal)
    *   Body Text / Subheading: `#4A4A4A` (dark grey)
    *   Button Text: `#004F47` (dark teal)
    *   Inline Links (Variant 3): `#004F47` (dark teal), underlined.
    *   Icon stroke (Variant 1):
        *   Card 1: `#008080` (teal)
        *   Card 2: `#008040` (green)
        *   Card 3: `#E04040` (red)
-   **Accent / CTA colors**:
    *   Button border: `#004F47` (dark teal)
    *   Button arrow icon: `#004F47` (dark teal)
-   **Font sizes (estimates)**:
    *   Main Heading (Variant 3): ~40-48px
    *   Card Titles: ~24-28px
    *   Body Text / Subheading: ~16-18px
    *   Button Text: ~16-18px
-   **Font weights**:
    *   Main Heading: Bold (~700)
    *   Card Titles: Semibold (~600)
    *   Body Text / Subheading: Regular (~400)
    *   Button Text: Semibold (~600)
-   **Border radius values**:
    *   Icon background: 50% (perfect circle)
    *   Button: ~4px (slightly rounded rectangle)
-   **Box shadows**: None visible.
-   **Gradients**: None visible.
-   **Spacing / gap values**:
    *   Gap between cards (horizontal): ~30-40px
    *   Gap between icon and title: ~20-24px
    *   Gap between title and description: ~16px
    *   Gap between description and button: ~24-32px
    *   Padding within button: ~12-16px vertical, ~24-32px horizontal
    *   Padding around icon circle: ~16-20px
    *   Overall block padding: Generous vertical and horizontal padding.
-   **Icon style**: Outline, custom SVG.

## Interaction Hints
-   **Static layout or interactive**: Static layout with interactive elements (buttons, inline links).
-   **Visible hover states or transitions**:
    *   **Buttons**: On hover, the button background likely fills with `#004F47` (dark teal), and the text/arrow color changes to `#FFFFFF` (white). The border might disappear or change to white.
    *   **Inline Links**: On hover, links are typically underlined or change color.

## Responsive Behavior
-   **Desktop layout**:
    *   `icon-cards` & `support-cards-with-header`: 3 columns.
    *   `text-cards`: 2 columns.
-   **Tablet layout (~900px)**:
    *   All variants likely reflow to 2 columns.
    *   Card content (text, button) might adjust font sizes or padding slightly.
-   **Mobile layout (~600px)**:
    *   All variants stack to 1 column, with each card taking full width.
    *   Block-level heading and subheading (Variant 3) would also take full width.
    *   Suggested breakpoints: `~1200px` (desktop), `~768px` (tablet), `~480px` (mobile).
-   **Elements that hide/show**: No elements are expected to hide/show based on breakpoints, only reflow and resize.

## Content

```json
{
  "classes": "icon-cards",
  "heading": "",
  "subheading": "",
  "_itemCount": 3,
  "_items": [
    {
      "col1_item_icon": "/icons/icon-pds.svg",
      "col1_item_icon_background_color": "#E0F2F2",
      "col2_item_title": "PDS and fact sheets",
      "col2_item_description": "<p>Everything you need to know about NGS and how super works.</p>",
      "col3_item_cta": "https://example.com/pds",
      "col3_item_ctaText": "Learn more"
    },
    {
      "col1_item_icon": "/icons/icon-fund.svg",
      "col1_item_icon_background_color": "#E0F2E8",
      "col2_item_title": "Fund information",
      "col2_item_description": "<p>Access our ABN, SPIN, and USI to help you complete forms and requests, and other key details about us, our policies, and our Board.</p>",
      "col3_item_cta": "https://example.com/fund-info",
      "col3_item_ctaText": "Learn more"
    },
    {
      "col1_item_icon": "/icons/icon-faq.svg",
      "col1_item_icon_background_color": "#FCE0E0",
      "col2_item_title": "FAQ",
      "col2_item_description": "<p>Super can be complicated, from contributions, tax, fees, insurance and more. Get answers to all your frequently asked NGS Super questions.</p>",
      "col3_item_cta": "https://example.com/faq",
      "col3_item_ctaText": "Find out more"
    }
  ]
}
```

```json
{
  "classes": "text-cards",
  "heading": "",
  "subheading": "",
  "_itemCount": 2,
  "_items": [
    {
      "col1_item_icon": "",
      "col1_item_icon_background_color": "",
      "col2_item_title": "Members First, Always",
      "col2_item_description": "<p>Members are at the heart of everything we do, which is why our service promise is Members First, Always.</p>",
      "col3_item_cta": "https://example.com/service-promise",
      "col3_item_ctaText": "Discover our service promise"
    },
    {
      "col1_item_icon": "",
      "col1_item_icon_background_color": "",
      "col2_item_title": "About NGS Super",
      "col2_item_description": "<p>From exploring our history to getting to know our team, learn more about NGS Super.</p>",
      "col3_item_cta": "https://example.com/about-ngs",
      "col3_item_ctaText": "Learn about NGS"
    }
  ]
}
```

```json
{
  "classes": "support-cards-with-header",
  "heading": "We're here to support you",
  "subheading": "<p>No matter what stage you're at with your super, we're here to support you. Contact us, book time with a specialist, or explore our education and resources.</p>",
  "_itemCount": 3,
  "_items": [
    {
      "col1_item_icon": "",
      "col1_item_icon_background_color": "",
      "col2_item_title": "Give us a call",
      "col2_item_description": "<p>Call our helpline on 1300 133 177 (Mon to Fri, 8am to 8pm AEST/AEDT) with any questions you might have about your super.</p>",
      "col3_item_cta": "",
      "col3_item_ctaText": ""
    },
    {
      "col1_item_icon": "",
      "col1_item_icon_background_color": "",
      "col2_item_title": "Book an NGS Advice appointment",
      "col2_item_description": "<p>Book an appointment with a Super Specialist, Phone Adviser or a Financial Planner.</p>",
      "col3_item_cta": "",
      "col3_item_ctaText": ""
    },
    {
      "col1_item_icon": "",
      "col1_item_icon_background_color": "",
      "col2_item_title": "Education and tools",
      "col2_item_description": "<p>Our extensive range of financial education tools and resources are ready when you are.</p>",
      "col3_item_cta": "",
      "col3_item_ctaText": ""
    }
  ]
}
```

```json
{
  "classes": "member-spotlight-cards",
  "heading": "Member Spotlight",
  "subheading": "",
  "_itemCount": 2,
  "_items": [
    {
      "col1_item_icon": "https://loremflickr.com/800/450/person",
      "col1_item_icon_background_color": "",
      "col2_item_title": "Frances, NGS Member",
      "col2_item_description": "<p>'When I got off the phone with NGS Financial Planner Maria Maganic, I almost felt like crying with relief. The ease and simplicity of the call made me feel completely reassured.'</p>",
      "col3_item_cta": "https://example.com/frances",
      "col3_item_ctaText": "Read more about Frances"
    },
    {
      "col1_item_icon": "https://loremflickr.com/800/450/woman",
      "col1_item_icon_background_color": "",
      "col2_item_title": "Christine, NGS Member",
      "col2_item_description": "<p>'NGS Super make sure I get the right information and truly understand it. That level of service is invaluable, and it's always been clear that their guidance is in my best interests.' Stock image used to represent Christine.</p>",
      "col3_item_cta": "https://example.com/christine",
      "col3_item_ctaText": "Read more about Christine"
    }
  ]
}
```

| card |  |  |
| --- | --- | --- |
| Heading |  |  |
| Subheading |  |  |
| https://loremflickr.com/800/450/product #E0F2F2 | PDS and fact sheets Everything you need to know about NGS and how super works. | [Learn more](https://example.com/pds) |
| https://loremflickr.com/800/450/product #E0F2E8 | Fund information Access our ABN, SPIN, and USI to help you complete forms and requests, and other key details about us, our policies, and our Board. | [Learn more](https://example.com/fund-info) |
| https://loremflickr.com/800/450/product #FCE0E0 | FAQ Super can be complicated, from contributions, tax, fees, insurance and more. Get answers to all your frequently asked NGS Super questions. | [Find out more](https://example.com/faq) |


