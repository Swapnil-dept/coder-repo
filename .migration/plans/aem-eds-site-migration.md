# Single Page Migration Plan — nprpl.com Homepage

## Overview
Migrate the homepage at **https://www.nprpl.com/** to AEM Edge Delivery Services using the Universal Editor (xwalk) authoring approach. The project already has a well-configured xwalk setup with component definitions, models, and existing blocks.

## Source
- **URL**: https://www.nprpl.com/
- **Project type**: Edge Delivery Services (xwalk / Universal Editor)

## Existing Project Blocks
The project already includes these blocks with xwalk models:
| Block | Model Fields |
|-------|-------------|
| Hero | image, imageAlt, text (richtext) |
| Cards | card items with image + text |
| Columns | configurable columns/rows |
| Fragment | reference link |
| Header/Footer | navigation components |

Default content components: Text, Title, Image, Button

## Checklist

- [ ] **Analyze page structure** — scrape https://www.nprpl.com/, identify sections, content blocks, images, and design patterns
- [ ] **Map blocks** — match page sections to existing EDS blocks (hero, cards, columns) or identify new blocks needed
- [ ] **Extract design tokens** — capture colors, typography, spacing, and layout from the original page
- [ ] **Generate import infrastructure** — create block parsers and page transformers for the homepage content
- [ ] **Execute content import** — run the import pipeline to produce structured HTML content
- [ ] **Convert to JCR XML** — transform content to Universal Editor format with proper component models and field hinting
- [ ] **Apply design/styles** — migrate CSS (colors, fonts, spacing, component styles) to EDS project
- [ ] **Preview and validate** — render migrated page and compare against original
- [ ] **Iterate on fixes** — address visual discrepancies, missing content, or structural issues

## Approach

### Phase 1: Page Analysis
1. Scrape the homepage at https://www.nprpl.com/
2. Identify DOM structure, sections, and content patterns
3. Capture screenshots for visual reference
4. Extract metadata (title, description, OG tags)

### Phase 2: Block Mapping & Content Modeling
1. Map page sections to existing blocks (hero, cards, columns, etc.)
2. Identify any new blocks needed that don't exist in the project
3. Define component models for new blocks (if any)
4. Create block variant definitions with proper xwalk resource types

### Phase 3: Import Infrastructure
1. Generate block parsers to extract content from source HTML
2. Create page transformers (cleanup + sections) for DOM processing
3. Build import script combining parsers and transformers

### Phase 4: Content Import & xwalk Conversion
1. Execute import to produce structured EDS HTML
2. Convert to JCR XML with proper `sling:resourceType` mappings
3. Validate Universal Editor field hints match component-models.json
4. Ensure section structure uses `core/franklin/components/section/v1/section`

### Phase 5: Design Migration
1. Extract global design tokens (CSS custom properties for colors, fonts, spacing)
2. Adapt site-level styles to `styles/styles.css`
3. Create/update block-specific CSS files
4. Ensure responsive behavior is preserved

### Phase 6: Validation & Refinement
1. Preview page in local dev server
2. Compare visual output against original page
3. Fix any CSS discrepancies or content gaps
4. Verify block models render correctly in Universal Editor context

## Technical Notes
- xwalk projects require JCR XML content with `sling:resourceType` properties
- Component models define the Universal Editor authoring interface
- Block filters control which components can be added inside blocks
- The existing `component-definition.json` and `component-models.json` define the current authoring palette

---

*Ready for execution. Switch to Execute mode to begin the migration.*
