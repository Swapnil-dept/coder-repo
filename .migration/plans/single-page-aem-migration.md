# Single Page Migration to AEM Edge Delivery (xwalk)

## Overview
Migrate a single web page to AEM Edge Delivery Services using the Universal Editor (xwalk) authoring approach. The project already has a configured xwalk setup from the previous nprpl.com homepage migration, including component definitions, models, and existing blocks (hero, cards, columns, fragment, header, footer).

## Prerequisites
- **Page URL**: _Awaiting URL — please provide it in your next message_
- **Project type**: Edge Delivery Services (xwalk / Universal Editor)

## Existing Project Blocks
| Block | Model Fields |
|-------|-------------|
| Hero | image, imageAlt, text (richtext) |
| Cards | card items with image + text |
| Columns | configurable columns/rows |
| Fragment | reference link |
| Header/Footer | navigation components |

Default content components: Text, Title, Image, Button

## Checklist

- [ ] **Receive page URL** from user
- [ ] **Analyze page structure** — scrape the page, identify sections, content blocks, images, and design patterns
- [ ] **Map blocks** — match page sections to existing EDS blocks (hero, cards, columns) or identify new blocks needed
- [ ] **Generate import infrastructure** — create/update block parsers and page transformers for the new page
- [ ] **Execute content import** — run the import pipeline to produce structured HTML content
- [ ] **Add xwalk field hints** — ensure proper Universal Editor field comments in block cells
- [ ] **Apply design/styles** — adapt or extend CSS for any new patterns found on this page
- [ ] **Preview and validate** — render migrated page and compare against original
- [ ] **Iterate on fixes** — address visual discrepancies or content issues

## Approach

1. **Page Analysis**: Scrape the source page, capture screenshots, extract metadata, and download images
2. **Block Mapping**: Match page elements to the existing block library; create new block variants only if needed
3. **Import Infrastructure**: Reuse existing parsers where possible; generate new ones for any new block patterns
4. **Content Import**: Execute the import pipeline to produce EDS-compatible plain HTML
5. **xwalk Hints**: Add `<!-- field:fieldName -->` comments per component-models.json rules
6. **Design Adaptation**: Apply or extend CSS for any visual patterns not already covered
7. **Validation**: Preview in local dev server and compare against original

---

*Please provide the page URL to proceed.*
