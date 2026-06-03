
# Hero

The Hero block displays a prominent heading, body text, a call-to-action button, and a hero image with a decorative SVG, followed by a horizontal list of navigation links.

## Image Analysis
Here's a detailed analysis of the provided UI screenshot for an AEM EDS block:

## Layout Blueprint
-   **Overall layout pattern:** The main hero section uses a two-column layout (text content on the left, image on the right). Below this, there's a full-width section containing a horizontal list of navigation links. The entire hero container has large rounded bottom corners.
-   **Number of visual sections / rows:** 2 main sections:
    1.  Hero content (heading, body, CTA, image)
    2.  Bottom navigation links
-   **Alignment, spacing rhythm:**
    -   Content in the left column is left-aligned.
    -   The image is right-aligned within its column.
    -   Navigation links are horizontally distributed with equal spacing.
    -   Generous vertical and horizontal padding throughout, creating a spacious feel.
-   **Responsive behavior expectations:**
    -   On mobile, the two-column hero section is expected to stack vertically (text content first, then the image).
    -   The horizontal navigation links are expected to stack vertically or become a horizontal scrollable list on mobile.

## Component Identification
-   **Block type:** `hero`
-   **Sub-components:**
    -   `heading` (H1)
    -   `body-text` (P)
    -   `button` (primary style)
    -   `image` (with a decorative SVG overlay/background element)
    -   `navigation-links` (a list of 5 text links, each with a right-arrow icon)
-   **Number of repeating items:** 5 navigation links.

## Multiple Screenshots → ONE block with variants
This analysis is based on a single screenshot. Therefore, it represents one block without variants.
-   **Shared block type:** `hero`
-   **Shared field model:** All fields suggested below.
-   **Variant name:** `default`
-   **Differences:** N/A

## Authoring Model (Field Suggestions)

**Block-level fields:**
-   `background-color` (type: text) — authorable — Hex code or CSS variable name for the hero's main background color.
-   `heading` (type: richtext) — authorable — The main heading of the hero section.
-   `body` (type: richtext) — authorable — The descriptive body text below the heading.
-   `cta-label` (type: text) — authorable — Text displayed on the primary call-to-action button.
-   `cta-link` (type: reference) — authorable — URL for the primary call-to-action button.
-   `image` (type: reference) — authorable — The main hero image (e.g., the man smiling).
-   `image-alt` (type: text) — authorable — Alt text for the hero image for accessibility.
-   `decorative-svg` (type: aem-content) — fixed — The SVG code for the green circular decorative element behind the image. (Could be authorable if different SVGs are needed, but likely fixed for brand consistency).
-   `nav-items` (type: multifield) — authorable — A collection of navigation links at the bottom.

**Item-level fields (for `nav-items` multifield):**
-   `nav-item-label` (type: text) — authorable — The display text for a navigation link.
-   `nav-item-link` (type: reference) — authorable — The URL for a navigation link.

## Column Map
Assuming `nav-items` is a multifield, it would be represented as a JSON string in its column.

Column 0 → `heading` (richtext)
Column 1 → `body` (richtext)
Column 2 → `cta-label` (text)
Column 3 → `cta-link` (reference)
Column 4 → `image` (reference)
Column 5 → `image-alt` (text)
Column 6 → `background-color` (text)
Column 7 → `nav-items` (multifield)

## OCR Content Inventory
-   **Section headings / sub-headings:**
    -   "Why choose NGS Super?"
-   **Card/item titles and body text:**
    -   "Our focus is on strong performance, award-winning service, and competitive fees. Built for what matters."
-   **Button / CTA labels:**
    -   "Join NGS Super"
-   **Navigation links:**
    -   "Service promise"
    -   "Awards and ratings"
    -   "About NGS"
    -   "Careers at NGS"
    -   "Newsroom"

## Visual Design Tokens
-   **Background colors:**
    -   Main hero section: `#F8F4EF` (light beige/cream)
    -   Bottom navigation section: `#003B36` (dark teal/green)
-   **Text colors:**
    -   Heading: `#003B36` (dark teal/green)
    -   Body text: `#4A4A4A` (dark grey)
    -   Button text: `#FFFFFF` (white)
    -   Navigation text: `#FFFFFF` (white)
-   **Accent / CTA colors:**
    -   Button background: `#33804D` (medium green)
    -   Decorative SVG: `#66C27F` (lighter green)
-   **Font sizes (px or rem estimates):**
    -   Heading: ~56px (H1)
    -   Body text: ~20px (P)
    -   Button text: ~18px
    -   Navigation text: ~18px
-   **Font weights:**
    -   Heading: Bold (~700)
    -   Body text: Regular (~400)
    -   Button text: Semibold (~600)
    -   Navigation text: Semibold (~600)
-   **Border radius values:**
    -   Main hero container bottom corners: ~48px
    -   Button: ~4px
-   **Box shadows:** None visible.
-   **Gradients:** None visible.
-   **Spacing / gap values between elements:**
    -   Large horizontal padding on main hero content: ~120px
    -   Large vertical padding on main hero content: ~100px
    -   Gap between heading and body: ~24px
    -   Gap between body and CTA: ~40px
    -   Padding within button: ~16px vertical, ~32px horizontal
    -   Padding for bottom navigation section: ~32px vertical, ~120px horizontal
    -   Gap between navigation items: ~40px
-   **Icon style:** Outline arrow (`>`) for navigation items, likely an SVG or font icon.

## Interaction Hints
-   **Static layout:** The current screenshot shows a static layout.
-   **Visible hover states or transitions:** No hover states are visible in the static image, but it's expected that the CTA button and navigation links would have hover effects (e.g., background change for button, text color change for links).
-   **Any animation cues:** None visible.

## Responsive Behavior
-   **Desktop layout:** Two columns for the main hero content (text/CTA on the left, image on the right). Navigation links are displayed horizontally in a single row below.
-   **Tablet layout (~900px):**
    -   The main hero section could maintain its two-column structure but with reduced horizontal padding and potentially a smaller image. Alternatively, the image might stack below the text/CTA for narrower tablets.
    -   The navigation links might wrap to two rows or become a horizontally scrollable list to fit the available width.
-   **Mobile layout (~600px):**
    -   The main hero section will stack vertically: heading, body text, CTA button, then the image. All elements will take full width with appropriate padding.
    -   The decorative SVG behind the image should scale down with the image or be hidden if it becomes too dominant or visually distracting on small screens.
    -   The navigation links will stack vertically, each link taking full width, or be presented as a vertical list.
    -   The large border-radius on the main container should adapt to the full width, maintaining its rounded appearance.
-   **Suggested breakpoints:** Standard breakpoints like `768px` (for tablet) and `480px` (for mobile) would be appropriate.

## Content
```json
{
  "col1_heading": "<h1>Why choose NGS Super?</h1>",
  "col1_body": "<p>Our focus is on strong performance, award-winning service, and competitive fees. Built for what matters.</p>",
  "col1_cta": "#",
  "col1_ctaText": "Join NGS Super",
  "col2_image": "https://www.aem.live/media_1920x1080.jpeg",
  "col2_imageAlt": "Smiling man with a towel over his shoulder",
  "col2_decorativeSvg": "<svg width=\"400\" height=\"400\" viewBox=\"0 0 400 400\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n  <defs>\n    <path id=\"line\" d=\"M200 0 L200 40\"/>\n  </defs>\n  <g transform=\"translate(200 200)\">\n    <use href=\"#line\" stroke=\"#66C27F\" stroke-width=\"4\" transform=\"rotate(0)\"/>\n    <use href=\"#line\" stroke=\"#66C27F\" stroke-width=\"4\" transform=\"rotate(10)\"/>\n    <use href=\"#line\" stroke=\"#66C27F\" stroke-width=\"4\" transform=\"rotate(20)\"/>\n    <use href=\"#line\" stroke=\"#66C27F\" stroke-width=\"4\" transform=\"rotate(30)\"/>\n    <use href=\"#line\" stroke=\"#66C27F\" stroke-width=\"4\" transform=\"rotate(40)\"/>\n    <use href=\"#line\" stroke=\"#66C27F\" stroke-width=\"4\" transform=\"rotate(50)\"/>\n    <use href=\"#line\" stroke=\"#66C27F\" stroke-width=\"4\" transform=\"rotate(60)\"/>\n    <use href=\"#line\" stroke=\"#66C27F\" stroke-width=\"4\" transform=\"rotate(70)\"/>\n    <use href=\"#line\" stroke=\"#66C27F\" stroke-width=\"4\" transform=\"rotate(80)\"/>\n    <use href=\"#line\" stroke=\"#66C27F\" stroke-width=\"4\" transform=\"rotate(90)\"/>\n    <use href=\"#line\" stroke=\"#66C27F\" stroke-width=\"4\" transform=\"rotate(100)\"/>\n    <use href=\"#line\" stroke=\"#66C27F\" stroke-width=\"4\" transform=\"rotate(110)\"/>\n    <use href=\"#line\" stroke=\"#66C27F\" stroke-width=\"4\" transform=\"rotate(120)\"/>\n    <use href=\"#line\" stroke=\"#66C27F\" stroke-width=\"4\" transform=\"rotate(130)\"/>\n    <use href=\"#line\" stroke=\"#66C27F\" stroke-width=\"4\" transform=\"rotate(140)\"/>\n    <use href=\"#line\" stroke=\"#66C27F\" stroke-width=\"4\" transform=\"rotate(150)\"/>\n    <use href=\"#line\" stroke=\"#66C27F\" stroke-width=\"4\" transform=\"rotate(160)\"/>\n    <use href=\"#line\" stroke=\"#66C27F\" stroke-width=\"4\" transform=\"rotate(170)\"/>\n    <use href=\"#line\" stroke=\"#66C27F\" stroke-width=\"4\" transform=\"rotate(180)\"/>\n    <use href=\"#line\" stroke=\"#66C27F\" stroke-width=\"4\" transform=\"rotate(190)\"/>\n    <use href=\"#line\" stroke=\"#66C27F\" stroke-width=\"4\" transform=\"rotate(200)\"/>\n    <use href=\"#line\" stroke=\"#66C27F\" stroke-width=\"4\" transform=\"rotate(210)\"/>\n    <use href=\"#line\" stroke=\"#66C27F\" stroke-width=\"4\" transform=\"rotate(220)\"/>\n    <use href=\"#line\" stroke=\"#66C27F\" stroke-width=\"4\" transform=\"rotate(230)\"/>\n    <use href=\"#line\" stroke=\"#66C27F\" stroke-width=\"4\" transform=\"rotate(240)\"/>\n    <use href=\"#line\" stroke=\"#66C27F\" stroke-width=\"4\" transform=\"rotate(250)\"/>\n    <use href=\"#line\" stroke=\"#66C27F\" stroke-width=\"4\" transform=\"rotate(260)\"/>\n    <use href=\"#line\" stroke=\"#66C27F\" stroke-width=\"4\" transform=\"rotate(270)\"/>\n    <use href=\"#line\" stroke=\"#66C27F\" stroke-width=\"4\" transform=\"rotate(280)\"/>\n    <use href=\"#line\" stroke=\"#66C27F\" stroke-width=\"4\" transform=\"rotate(290)\"/>\n    <use href=\"#line\" stroke=\"#66C27F\" stroke-width=\"4\" transform=\"rotate(300)\"/>\n    <use href=\"#line\" stroke=\"#66C27F\" stroke-width=\"4\" transform=\"rotate(310)\"/>\n    <use href=\"#line\" stroke=\"#66C27F\" stroke-width=\"4\" transform=\"rotate(320)\"/>\n    <use href=\"#line\" stroke=\"#66C27F\" stroke-width=\"4\" transform=\"rotate(330)\"/>\n    <use href=\"#line\" stroke=\"#66C27F\" stroke-width=\"4\" transform=\"rotate(340)\"/>\n    <use href=\"#line\" stroke=\"#66C27F\" stroke-width=\"4\" transform=\"rotate(350)\"/>\n  </g>\n</svg>",
  "backgroundColor": "#F8F4EF",
  "_itemCount": 5,
  "_items": [
    {
      "label": "Service promise",
      "link": "#service-promise"
    },
    {
      "label": "Awards and ratings",
      "link": "#awards-ratings"
    },
    {
      "label": "About NGS",
      "link": "#about-ngs"
    },
    {
      "label": "Careers at NGS",
      "link": "#careers"
    },
    {
      "label": "Newsroom",
      "link": "#newsroom"
    }
  ]
}
```

| hero |  |  |
| --- | --- | --- |
| Why choose NGS Super? Our focus is on strong performance, award-winning service, and competitive fees. Built for what matters. [Join NGS Super](#) | https://www.aem.live/media_1920x1080.jpeg [<svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">   <defs>     <path id="line" d="M200 0 L200 40"/>   </defs>   <g transform="translate(200 200)">     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(0)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(10)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(20)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(30)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(40)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(50)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(60)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(70)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(80)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(90)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(100)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(110)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(120)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(130)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(140)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(150)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(160)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(170)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(180)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(190)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(200)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(210)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(220)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(230)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(240)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(250)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(260)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(270)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(280)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(290)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(300)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(310)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(320)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(330)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(340)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(350)"/>   </g> </svg>](<svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">   <defs>     <path id="line" d="M200 0 L200 40"/>   </defs>   <g transform="translate(200 200)">     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(0)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(10)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(20)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(30)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(40)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(50)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(60)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(70)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(80)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(90)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(100)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(110)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(120)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(130)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(140)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(150)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(160)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(170)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(180)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(190)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(200)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(210)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(220)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(230)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(240)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(250)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(260)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(270)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(280)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(290)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(300)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(310)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(320)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(330)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(340)"/>     <use href="#line" stroke="#66C27F" stroke-width="4" transform="rotate(350)"/>   </g> </svg>) | #F8F4EF |
| Service promise | [#service-promise](#service-promise) |  |
| Awards and ratings | [#awards-ratings](#awards-ratings) |  |
| About NGS | [#about-ngs](#about-ngs) |  |
| Careers at NGS | [#careers](#careers) |  |
| Newsroom | [#newsroom](#newsroom) |  |

