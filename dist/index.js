// src/ProductPreviewCard.tsx
import { useMemo } from "react";

// src/ShoppingBagIcon.tsx
import { jsx, jsxs } from "react/jsx-runtime";
function ShoppingBagIcon(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      ...props,
      children: [
        /* @__PURE__ */ jsx("path", { d: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" }),
        /* @__PURE__ */ jsx("path", { d: "M3 6h18" }),
        /* @__PURE__ */ jsx("path", { d: "M16 10a4 4 0 0 1-8 0" })
      ]
    }
  );
}

// src/cn.ts
import clsx from "clsx";
function cn(...inputs) {
  return clsx(inputs);
}

// src/to-number.ts
function toNumber(value) {
  if (value === null || value === void 0) return 0;
  return typeof value === "number" ? value : parseFloat(value);
}

// src/PreviewMedia.tsx
import { useState } from "react";
import { jsx as jsx2 } from "react/jsx-runtime";
var SMART_TOLERANCE = 0.15;
function DefaultImage({ src, alt, className, style, priority, onLoad }) {
  return (
    // eslint-disable-next-line jsx-a11y/alt-text -- alt is a required prop above
    /* @__PURE__ */ jsx2(
      "img",
      {
        src,
        alt,
        className,
        style,
        loading: priority ? "eager" : "lazy",
        onLoad
      }
    )
  );
}
function PreviewMedia({
  src,
  alt,
  fit = "smart",
  ratio,
  focal,
  sizes,
  priority = false,
  className,
  imageClassName,
  fallback,
  ImageComponent = DefaultImage
}) {
  const [smartFit, setSmartFit] = useState("cover");
  const isSmart = fit === "smart";
  const objectFit = fit === "cover" ? "opp-object-cover" : fit === "contain" ? "opp-object-contain" : smartFit === "contain" ? "opp-object-contain" : "opp-object-cover";
  return /* @__PURE__ */ jsx2(
    "div",
    {
      className: cn("opp-media-frame", className),
      style: ratio ? { aspectRatio: ratio } : void 0,
      children: src ? /* @__PURE__ */ jsx2(
        ImageComponent,
        {
          src,
          alt,
          sizes,
          priority,
          loading: priority ? "eager" : "lazy",
          className: cn(objectFit, imageClassName),
          style: focal && objectFit === "opp-object-cover" ? { objectPosition: focal } : void 0,
          onLoad: isSmart ? (event) => {
            const img = event.currentTarget;
            const frame = img.parentElement;
            if (!frame || !img.naturalWidth || !img.naturalHeight) return;
            const frameRatio = frame.clientWidth / frame.clientHeight;
            const imageRatio = img.naturalWidth / img.naturalHeight;
            if (!frameRatio || !imageRatio) return;
            const drift = Math.abs(imageRatio - frameRatio) / frameRatio;
            setSmartFit(drift > SMART_TOLERANCE ? "contain" : "cover");
          } : void 0
        }
      ) : fallback ?? /* @__PURE__ */ jsx2("span", { className: "opp-media-fallback", children: /* @__PURE__ */ jsx2(ShoppingBagIcon, {}) })
    }
  );
}

// src/PreviewPrice.tsx
import { Fragment, jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
function PreviewPrice({
  price,
  compareAt,
  range,
  muted = false,
  size = "sm",
  showDiscount = false,
  className,
  formatPrice
}) {
  const hasRange = range && range.min !== range.max;
  const shown = hasRange ? range.min : toNumber(price);
  const original = compareAt != null ? toNumber(compareAt) : null;
  const hasCompare = original != null && original > shown;
  const discountPct = hasCompare ? Math.round((1 - shown / original) * 100) : 0;
  return /* @__PURE__ */ jsxs2("span", { className: cn("opp-price", className), children: [
    /* @__PURE__ */ jsx3("span", { className: cn("opp-price-amount", `opp-price-${size}`, muted && "opp-price-muted"), children: hasRange ? `From ${formatPrice(range.min)}` : formatPrice(price) }),
    hasCompare && /* @__PURE__ */ jsxs2(Fragment, { children: [
      /* @__PURE__ */ jsx3("span", { className: "opp-sr-only", children: "Original price" }),
      /* @__PURE__ */ jsx3("s", { className: "opp-price-compare", children: formatPrice(compareAt) })
    ] }),
    hasCompare && showDiscount && discountPct > 0 && /* @__PURE__ */ jsxs2("span", { className: "opp-price-discount-chip", children: [
      "\u2212",
      discountPct,
      "%"
    ] })
  ] });
}

// src/product-options.ts
var SIZE_PATTERN = /size|length/i;
var COLOUR_PATTERN = /colou?r|shade/i;
function variantOptionValue(product, variant, pattern) {
  const option = (product.options ?? []).find((o) => pattern.test(o.name));
  if (option) {
    const match = (variant.selectedOptions ?? []).find(
      (so) => so.optionValue?.optionId === option.id
    );
    if (match?.optionValue?.value) return match.optionValue.value;
  }
  for (const [key, value] of Object.entries(variant.optionValues ?? {})) {
    if (pattern.test(key) && typeof value === "string" && value.trim()) return value;
  }
  return null;
}
function optionSummary(product, pattern) {
  const seen = /* @__PURE__ */ new Map();
  for (const variant of product.variants) {
    const value = variantOptionValue(product, variant, pattern);
    if (!value) continue;
    const available = !variant.isSoldOut && variant.availableStock > 0;
    seen.set(value, (seen.get(value) ?? false) || available);
  }
  return [...seen.entries()].map(([value, available]) => ({ value, available }));
}

// src/colour.ts
var COLOUR_ALIASES = {
  nude: "#e3bc9a",
  cream: "#fffdd0",
  wine: "#722f37",
  burgundy: "#800020",
  champagne: "#f7e7ce",
  mustard: "#ffdb58",
  rust: "#b7410e",
  taupe: "#483c32",
  charcoal: "#36454f",
  offwhite: "#faf9f6",
  camel: "#c19a6b",
  emerald: "#50c878",
  royalblue: "#4169e1",
  babyblue: "#89cff0",
  blush: "#de5d83",
  peach: "#ffe5b4",
  mocha: "#967969",
  sand: "#c2b280",
  // Compound names whose base word (baby, rose, army) isn't a colour on its
  // own, so the family-suffix fallback below can't reach them either.
  babypink: "#f4c2c2",
  rosegold: "#b76e79",
  armygreen: "#4b5320",
  dustypink: "#d8a39d"
};
var COLOUR_FAMILY_SUFFIXES = ["blue", "red", "green", "grey", "gray", "gold", "pink", "brown", "yellow"];
function swatchColour(value) {
  const key = value.trim().toLowerCase();
  const compact = key.replace(/\s+/g, "");
  if (COLOUR_ALIASES[key]) return COLOUR_ALIASES[key];
  if (COLOUR_ALIASES[compact]) return COLOUR_ALIASES[compact];
  if (typeof CSS !== "undefined" && CSS.supports?.("color", compact)) return compact;
  const words = key.split(/\s+/);
  if (words.length === 2 && COLOUR_FAMILY_SUFFIXES.includes(words[1])) {
    const base = words[0];
    if (COLOUR_ALIASES[base]) return COLOUR_ALIASES[base];
    if (typeof CSS !== "undefined" && CSS.supports?.("color", base)) return base;
  }
  return null;
}

// src/ProductPreviewCard.tsx
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
function ProductPreviewCard({
  product,
  formatPrice,
  mediaFit = "smart",
  cardSignal = "stock",
  sizes,
  priority,
  ImageComponent,
  renderMediaOverlay,
  renderName,
  className
}) {
  const displayVariants = useMemo(() => {
    const nonDefault = product.variants.filter(
      (v) => !(v.name === "Default" && Object.keys(v.optionValues ?? {}).length === 0)
    );
    return nonDefault.length > 0 ? nonDefault : product.variants;
  }, [product.variants]);
  const firstVariant = displayVariants[0];
  const imageUrl = product.images?.[0] ?? firstVariant?.images?.[0] ?? null;
  const isCombo = product.productType === "BUNDLE";
  const hasOptions = displayVariants.length > 1;
  const price = firstVariant?.price ?? product.basePrice;
  const compareAt = firstVariant?.compareAtPrice ?? product.compareAtPrice;
  const allSoldOut = displayVariants.length > 0 && displayVariants.every((v) => v.isSoldOut);
  const hasDiscount = compareAt != null && toNumber(compareAt) > toNumber(price);
  const variantPrices = displayVariants.map((v) => toNumber(v.price ?? product.basePrice));
  const minPrice = variantPrices.length ? Math.min(...variantPrices) : toNumber(price);
  const maxPrice = variantPrices.length ? Math.max(...variantPrices) : toNumber(price);
  return /* @__PURE__ */ jsxs3("div", { className: cn("opp-card", className), children: [
    /* @__PURE__ */ jsxs3("div", { className: "opp-card-media-wrap", children: [
      /* @__PURE__ */ jsx4(
        PreviewMedia,
        {
          src: imageUrl,
          alt: product.name,
          fit: mediaFit,
          sizes,
          priority,
          className: "opp-card-media",
          imageClassName: allSoldOut ? "opp-image-soldout" : void 0,
          ImageComponent,
          fallback: /* @__PURE__ */ jsx4("span", { className: "opp-media-fallback", children: /* @__PURE__ */ jsx4(ShoppingBagIcon, {}) })
        }
      ),
      /* @__PURE__ */ jsxs3("div", { className: "opp-badges", children: [
        allSoldOut && /* @__PURE__ */ jsx4("span", { className: "opp-badge opp-badge-soldout", children: "Sold out" }),
        !allSoldOut && firstVariant && firstVariant.availableStock <= 3 && /* @__PURE__ */ jsxs3("span", { className: "opp-badge opp-badge-low-stock", children: [
          "Only ",
          firstVariant.availableStock,
          " left"
        ] }),
        isCombo && /* @__PURE__ */ jsx4("span", { className: "opp-badge opp-badge-combo", children: "Combo" })
      ] }),
      renderMediaOverlay?.()
    ] }),
    /* @__PURE__ */ jsxs3("div", { className: "opp-card-info", children: [
      product.brand && /* @__PURE__ */ jsx4("p", { className: "opp-card-brand", children: product.brand }),
      renderName ? renderName(product.name) : /* @__PURE__ */ jsx4("p", { className: "opp-card-name", children: product.name }),
      /* @__PURE__ */ jsx4(
        PreviewPrice,
        {
          price,
          compareAt,
          range: hasOptions ? { min: minPrice, max: maxPrice } : void 0,
          muted: allSoldOut,
          showDiscount: !allSoldOut && !isCombo,
          formatPrice
        }
      ),
      isCombo && hasDiscount && !allSoldOut && /* @__PURE__ */ jsxs3("p", { className: "opp-combo-savings", children: [
        "Save ",
        formatPrice(toNumber(compareAt) - toNumber(price)),
        " vs buying separately"
      ] }),
      /* @__PURE__ */ jsx4(CardSignals, { product, soldOut: allSoldOut, cardSignal })
    ] })
  ] });
}
function CardSignals({
  product,
  soldOut,
  cardSignal
}) {
  if (soldOut) return null;
  if (cardSignal === "colour") {
    const colours = optionSummary(product, COLOUR_PATTERN).filter((c) => c.available);
    if (colours.length < 2) return null;
    return /* @__PURE__ */ jsxs3("div", { className: "opp-signal-row", children: [
      colours.slice(0, 5).map(({ value }) => {
        const colour = swatchColour(value);
        return colour ? /* @__PURE__ */ jsx4("span", { title: value, className: "opp-swatch", style: { background: colour } }, value) : /* @__PURE__ */ jsx4("span", { className: "opp-signal-text", children: value }, value);
      }),
      colours.length > 5 && /* @__PURE__ */ jsxs3("span", { className: "opp-signal-text", children: [
        "+",
        colours.length - 5
      ] }),
      /* @__PURE__ */ jsxs3("span", { className: "opp-sr-only", children: [
        colours.length,
        " colours available: ",
        colours.map((c) => c.value).join(", ")
      ] })
    ] });
  }
  if (cardSignal === "size") {
    const sizes = optionSummary(product, SIZE_PATTERN);
    const inStock = sizes.filter((s) => s.available);
    if (sizes.length < 2) return null;
    return /* @__PURE__ */ jsx4("p", { className: "opp-signal-text", children: inStock.length === 0 ? "No sizes left" : `Sizes ${inStock.slice(0, 4).map((s) => s.value).join(", ")}${inStock.length > 4 ? ` +${inStock.length - 4}` : ""}` });
  }
  const remaining = product.variants.reduce(
    (total, v) => total + (v.isSoldOut ? 0 : v.availableStock),
    0
  );
  if (remaining > 0 && remaining <= 5) {
    return /* @__PURE__ */ jsxs3("p", { className: "opp-signal-low-stock", children: [
      "Only ",
      remaining,
      " left"
    ] });
  }
  return null;
}
export {
  COLOUR_PATTERN,
  PreviewMedia,
  PreviewPrice,
  ProductPreviewCard,
  SIZE_PATTERN,
  optionSummary,
  swatchColour,
  toNumber,
  variantOptionValue
};
//# sourceMappingURL=index.js.map