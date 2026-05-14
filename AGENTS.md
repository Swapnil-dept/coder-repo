# AGENTS.md

## Project
AEM Boilerplate (Edge Delivery Services starter from Adobe).

## Dev Commands
- `npm run lint` — JS + CSS lint
- `npm run lint:fix` — auto-fix lint issues
- `npm run build:json` — generates root `component-models.json`, `component-definition.json`, `component-filters.json` from `models/_*.json`

## Local Dev
- `aem up` — starts AEM proxy (requires `@adobe/aem-cli`: `npm install -g @adobe/aem-cli`)
- Opens `http://localhost:3000`

## Generated Files (do not edit directly)
- `component-models.json` — built from `models/_component-models.json`
- `component-definition.json` — built from `models/_component-definition.json`
- `component-filters.json` — built from `models/_component-filters.json`

## Block Structure
Each block lives in `blocks/<name>/` with three files:
- `<name>.js` — block behavior
- `<name>.css` — block styles
- `_ <name>.json` — block metadata/model

## Architecture
- Styles: `styles/styles.css` (root variables, global CSS)
- No test framework in this repo
- Node 18.3+ required