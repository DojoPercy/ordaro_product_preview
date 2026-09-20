# @ordaro/product-preview

Shared, framework-version-agnostic product card rendering used by both `ordaro_retail` (the
storefront) and `ordaro_dashboard` (the merchant dashboard's live product-edit preview).

This package exists so those two can never visually drift apart: `ordaro_retail`'s real
`ProductCard` wraps `ProductPreviewCard` from here with its interactive chrome (link, wishlist,
quick-add); the dashboard's edit-page preview renders `ProductPreviewCard` directly against the
in-progress draft. One rendering path, two consumers.

## Why plain CSS, not Tailwind

`ordaro_retail` runs Tailwind v4, `ordaro_dashboard` runs Tailwind v3 — a shared package can't ship
either app's utility classes without breaking under the other's JIT compiler. Every visual value
lives in a plain, prefixed stylesheet (`styles.css`) instead, with store-configurable values (card
ratio, radius, brand colour) passed in as CSS custom properties on the root element, the same way
`ordaro_retail` already does today.

## Consuming it

```
npm install github:<org>/ordaro_product_preview#v0.1.0
```

```tsx
import { ProductPreviewCard } from "@ordaro/product-preview";
import "@ordaro/product-preview/styles.css";
```

## Development

```
npm install
npm run test        # vitest, fixtures only — no consuming app needed
npm run build        # tsup -> dist/
npm run typecheck
```

Bumping a version: commit, `git tag vX.Y.Z`, push the tag, then update the `#vX.Y.Z` ref in each
consuming app's `package.json` and reinstall.
