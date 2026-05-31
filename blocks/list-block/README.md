
# List Block
Displays a list of resources with icons, titles, and action buttons.

## Image Analysis
-   **Overall layout pattern**: Single-column layout for the main content area, with each resource item arranged horizontally within its row.
-   **Number of visual sections / rows**: 1 main section (Resources) containing 2 repeating item rows.
-   **Alignment, spacing rhythm**:
    -   Heading is left-aligned.
    -   Each item row uses a horizontal alignment: icon (left), title (left, next to icon), button (right).
    -   Consistent vertical spacing between the heading and the first item, and between subsequent items, separated by thin horizontal dividers.
    -   Consistent padding around the content within the overall block.
-   **Responsive behavior expectations**: On smaller screens, the items are expected to stack vertically. The button might become full-width or wrap below the title if horizontal space is insufficient.

## Component Identification
-   **Block type**: `doc-listing` (or `resource-list`)
-   **Sub-components**:
    -   **Heading**: "Resources"
    -   **Repeating List Item (2 instances)**:
        -   **Icon Container**: Circular background with an icon.
        -   **Icon**: Custom SVG icons (e.g., chain link, document).
        -   **Item Title**: Text label for the resource.
        -   **Button**: Outline style button.
        -   **Button Icon**: Small icon within the button (e.g., external link, download).
    -   **Divider**: Thin horizontal line separating list items.
-   **Number of repeating items**: 2

## Authoring Model (Field Suggestions)

**Block-level fields**:
-   `heading` (type: text) — authorable — The main title for the list of resources.

**Item-level fields** (repeat for each resource item):
-   `item-icon-name` (type: text) — authorable — A string representing the name of the icon displayed on the left (e.g., "link", "document"). This name would map to a specific SVG icon.
-   `item-title` (type: text) — authorable — The main title or name of the resource (e.g., "Making a claim", "Insurance Guide").
-   `button-label` (type: text) — authorable — The text displayed on the action button (e.g., "Visit page", "Download PDF").
-   `button-link` (type: reference) — authorable — The URL or path the button links to. This can be an internal AEM page reference or an external URL.
-   `button-icon-name` (type: text) — authorable — A string representing the name of the icon displayed inside the button (e.g., "external-link", "download"). This name would map to a specific SVG icon.

## Column Map
-   Column 0 → `item-icon-name` (text)
-   Column 1 → `item-title` (text)
-   Column 2 → `button-label` (text)
-   Column 3 → `button-link` (reference)
-   Column 4 → `button-icon-name` (text)

## OCR Content Inventory
-   **Section headings**: Resources
-   **Card/item titles and body text**: Making a claim, Insurance Guide
-   **Button / CTA labels**: Visit page, Download PDF

## Visual Design Tokens
-   **Background colors**:
    -   Block background: `#FFFFFF` (white)
    -   Icon circle background: `#E0F2E7` (light green)
-   **Text colors**:
    -   Heading: `#1A4747` (dark teal/green)
    -   Item title: `#1A4747` (dark teal/green)
    -   Button text: `#1A4747` (dark teal/green)
-   **Accent / CTA colors**:
    -   Icon color (inside circle): `#1A4747` (dark teal/green)
    -   Button border: `#1A4747` (dark teal/green)
-   **Font sizes (px or rem estimates)**:
    -   Heading: ~24px / 1.5rem
    -   Item title: ~18px / 1.125rem
    -   Button text: ~16px / 1rem
-   **Font weights**:
    -   Heading: Semibold (e.g., 600)
    -   Item title: Semibold (e.g., 600)
    -   Button text: Regular (e.g., 400)
-   **Border radius values**:
    -   Icon circle: 50% (perfect circle, e.g., 40px height/width, 20px radius)
    -   Button: ~20px (pill shape, e.g., 40px height, 20px radius)
-   **Box shadows**: None visible.
-   **Gradients**: None visible.
-   **Spacing / gap values between elements**:
    -   Vertical spacing between heading and first divider: ~24px
    -   Vertical spacing between dividers: ~24px (above and below each item)
    -   Horizontal spacing between icon circle and item title: ~16px
    -   Padding inside icon circle: ~8px (icon size ~24px, circle diameter ~40px)
    -   Padding inside button: ~8px vertical, ~16px horizontal
    -   Divider height: 1px
-   **Icon style**: Outline, custom SVG.

## Interaction Hints
-   **Static layout**: The block itself is static.
-   **Hover states**: Not visible in the screenshot, but buttons typically have a hover state (e.g., background fill, border color change, or text color change).

## Responsive Behavior
-   **Desktop layout**: Single column, each item displays `icon | title | button` horizontally.
-   **Tablet layout (~900px)**: Likely maintains the desktop layout, potentially with reduced horizontal padding. The button and title might adjust spacing but remain on a single line.
-   **Mobile layout (~600px)**:
    -   The heading remains at the top.
    -   Each item will likely stack vertically. The icon and title might remain on one line, and the button could either become full-width below the title or remain right-aligned but allow the title to wrap. Given the design, the button would likely become full-width or stack below the title for optimal touch target size and readability.
    -   Suggested breakpoints: Standard breakpoints (e.g., 768px for tablet, 480px for mobile) would be appropriate for adjusting spacing and element stacking.

## Content
```json
{
  "heading": "Resources",
  "_itemCount": 2,
  "_items": [
    {
      "col1_itemIconName": "link",
      "col2_itemTitle": "Making a claim",
      "col3_buttonLink": "https://example.com/making-a-claim",
      "col3_buttonLinkText": "Visit page",
      "col3_buttonIconName": "external-link"
    },
    {
      "col1_itemIconName": "document",
      "col2_itemTitle": "Insurance Guide",
      "col3_buttonLink": "https://example.com/insurance-guide.pdf",
      "col3_buttonLinkText": "Download PDF",
      "col3_buttonIconName": "download"
    }
  ]
}
```

| list-block |  |  |
| --- | --- | --- |
| Resources |  |  |
| link | Making a claim | [Visit page](https://example.com/making-a-claim) external-link |
| document | Insurance Guide | [Download PDF](https://example.com/insurance-guide.pdf) download |

