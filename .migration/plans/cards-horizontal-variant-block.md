Let me check the current project structure to understand what's already in place.I see there's already a `cards` block in the project. Let me check its current implementation.# New Block Component Plan: Cards (Horizontal Variant)

## Overview

Create a **horizontal cards** variant of the existing `cards` block. This variant displays cards with the image on the left and text content on the right in a row layout. It includes support for CTA buttons and tags/badges.

## Current State

- A `cards` block already exists at `blocks/cards/` with JS, CSS, and a content model (`_cards.json`)
- The existing block renders a vertical grid of cards with image on top and body below
- Uses `createOptimizedPicture` and `moveInstrumentation` utilities

## Implementation Plan

### Block Variant: `cards (horizontal)`

The variant will be activated by adding the class `horizontal` to the cards block (e.g., authoring the block as "Cards (horizontal)").

### File Changes

| File | Action | Description |
|------|--------|-------------|
| `blocks/cards/cards.js` | Modify | Add decoration logic for horizontal layout, CTA buttons, and tags |
| `blocks/cards/cards.css` | Modify | Add styles for `.cards.horizontal` variant including row layout, button styles, and badge styles |
| `blocks/cards/_cards.json` | Modify | Update model to support button link and tag fields |

### CSS Design (`.cards.horizontal`)

- Each card uses `display: flex; flex-direction: row`
- Image takes ~40% width on the left side
- Body content fills the remaining ~60% on the right
- CTA button styled at the bottom of the card body
- Tags/badges styled as small colored pills above the card title
- Responsive: stacks vertically on mobile (< 600px)

### JavaScript Decoration

- Detect `.horizontal` class on the block
- Restructure DOM for horizontal layout:
  - Wrap image in `.cards-card-image`
  - Wrap text, tags, and CTA in `.cards-card-body`
  - Identify `<a>` elements styled as buttons for CTA treatment (`.cards-card-cta`)
  - Identify `<em>` or specific authored elements as tags (`.cards-card-tag`)

### Content Model Updates

- Add a `link` field (type: `aem-content` or `text`) for the CTA button URL
- Add a `tag` field (type: `text`) for the badge/tag label

### Authoring Structure

Each card row in the authored table:

| Image | Body (includes tag as `<em>`, title as `<h3>`, description as `<p>`, CTA as `<a>`) |
|-------|------|

## Checklist

- [ ] Update `blocks/cards/cards.js` — add horizontal variant decoration logic (detect `.horizontal` class, identify CTA links, identify tag elements)
- [ ] Update `blocks/cards/cards.css` — add `.cards.horizontal` styles (flex row layout, image sizing, body layout, CTA button styles, tag badge styles, mobile responsive breakpoint)
- [ ] Update `blocks/cards/_cards.json` — add `link` and `tag` fields to the card model, add horizontal variant definition
- [ ] Test the block renders correctly in the local preview
- [ ] Verify responsive behavior (stacks vertically on mobile)

## Execution

This plan requires Execute mode to implement the file changes. Switch to Execute mode to proceed with implementation.
