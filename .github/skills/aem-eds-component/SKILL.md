---
name: aem-eds-component
description: 'Create AEM Edge Delivery Services (EDS) components from design images or descriptions. Use when: building new AEM EDS blocks, designing component models, creating block JS/CSS, authoring field definitions, registering components in component-definition.json, component-models.json, component-filters.json. Covers full block lifecycle: model design, JS decoration, CSS styling, and global registration.'
argument-hint: 'Describe the component or provide an image of the design to replicate'
---

# AEM EDS Component Builder

## When to Use
- Creating a new AEM EDS block from a design image or description
- Designing component model fields for Universal Editor authoring
- Building block JS (decorate function) and CSS
- Registering a new block in the global config files

## Prerequisites
- Workspace must be an AEM EDS project with `blocks/`, `component-definition.json`, `component-models.json`, `component-filters.json`
- Verify existing block patterns before creating new ones

## Procedure

### Step 1: Analyze the Design
1. Study the provided image or description carefully
2. Identify distinct content sections (text, images, links, buttons)
3. Map each visual element to an authorable field type
4. Determine the block layout (single column, two-column, grid)

### Step 2: Design the Component Model
Choose the right field `component` type for each authorable element:

| Visual Element | Field Component | Value Type | Notes |
|---|---|---|---|
| Image from DAM | `reference` | `string` | For AEM asset references |
| Short text / label | `text` | `string` | Single-line text |
| Long text / paragraph | `textarea` | `string` | Multi-line text |
| Rich formatted text | `richtext` | `string` | HTML content |
| Numeric value | `number` | `number` | Zoom levels, counts |
| URL / Link | `text` | `string` | For external URLs |
| AEM page link | `aem-content` | `string` | For internal AEM links |
| Dropdown choice | `select` | `string` | Provide `options` array |
| Multiple choices | `multiselect` | `string` | Provide `options` array |
| Toggle / boolean | `boolean` | `boolean` | On/off switches |

Best practices for model fields:
- Use descriptive `label` values that content authors understand
- Add `description` for fields that need guidance
- Use `multi: true` for repeatable fields
- Order fields in the same visual order as the design (top-to-bottom, left-to-right)
- Prefix field names clearly (`propertyName`, `heroImage`, not `name`, `img`)

### Step 3: Create Block Files
Create the block folder under `blocks/<block-name>/` with three files:

#### 3a. `_<block-name>.json` — Block Definition + Model
```json
{
  "definitions": [{
    "title": "Block Title",
    "id": "block-name",
    "plugins": {
      "xwalk": {
        "page": {
          "resourceType": "core/franklin/components/block/v1/block",
          "template": {
            "name": "Block Title",
            "model": "block-name"
          }
        }
      }
    }
  }],
  "models": [{
    "id": "block-name",
    "fields": [
      // Fields here, one per authorable element
    ]
  }],
  "filters": []
}
```

#### 3b. `<block-name>.js` — Block Decorator
Follow this pattern for the `decorate` function:
1. Extract rows from `block.children` (each model field = one row)
2. Parse field values using DOM APIs
3. Build semantic HTML elements
4. Clear `block.textContent = ''`
5. Append new structured DOM
6. Add event listeners for interactivity

```js
export default function decorate(block) {
  const rows = [...block.children];
  // Row 0 = first model field, Row 1 = second, etc.
  // ... build DOM, clear block, append
}
```

Key JS conventions:
- Always use `export default function decorate(block)`
- Use `block.children` to access model field rows in order
- Use `querySelector('picture')` for image references
- Use `textContent.trim()` for text values
- Use `document.createElement()` for new elements
- Add proper `aria-label` attributes for accessibility
- Use `IntersectionObserver` for lazy loading heavy resources
- Use BEM-like class names: `blockname-element`

#### 3c. `<block-name>.css` — Block Styles
- Use CSS custom properties from the project (`--text-color`, `--spacing-m`, etc.)
- Mobile-first approach with `@media (min-width: 900px)` for desktop
- Use `.block-name` as root selector (matches the block wrapper class)
- Use BEM-like naming: `.block-name-element`

### Step 4: Register in Global Config Files
Add the block to all three root config files:

1. **`component-definition.json`** — Add to the `"blocks"` group `components` array
2. **`component-models.json`** — Add the model object to the root array
3. **`component-filters.json`** — Add the block ID to the `"section"` filter's `components` array

### Step 5: Validate
1. Check JSON syntax in all modified files
2. Verify field order in model matches DOM row order in JS
3. Confirm CSS class names match JS-generated class names
4. Ensure block is registered in all three global config files
5. Run `aem up` and test locally

## Quality Checklist
- [ ] Block folder name matches model ID and definition ID
- [ ] All authorable content uses proper field components
- [ ] JS reads rows in same order as model fields
- [ ] CSS is mobile-first with desktop breakpoint
- [ ] Accessibility: alt texts, aria-labels, semantic HTML
- [ ] Block registered in component-definition.json
- [ ] Block model added to component-models.json
- [ ] Block added to section filter in component-filters.json
