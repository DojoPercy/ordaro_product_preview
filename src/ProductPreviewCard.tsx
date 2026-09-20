"use client";

import { useMemo } from "react";
import { ShoppingBagIcon } from "./ShoppingBagIcon";
import { cn } from "./cn";
import { toNumber } from "./to-number";
import { PreviewMedia, type PreviewImageProps } from "./PreviewMedia";
import { PreviewPrice } from "./PreviewPrice";
import { optionSummary, SIZE_PATTERN, COLOUR_PATTERN } from "./product-options";
import { swatchColour } from "./colour";
import type { CardSignal, MediaFit, PreviewProduct } from "./types";
import type { ComponentType } from "react";

/**
 * Ported from ordaro_retail/src/components/storefront/ProductCard.tsx.
 *
 * Deliberately NOT the full interactive card: no stretched link, no
 * wishlist heart, no quick-add bar/button, no hover-image swap. Those are
 * real storefront affordances a preview panel has no use for — this keeps
 * exactly the part that answers "what will a customer actually see": the
 * photo, the badges, the name, the price, and the one signal line beneath it.
 * The real `ProductCard` in ordaro_retail wraps THIS component with that
 * interactive chrome, rather than duplicating the rendering logic.
 */

export interface ProductPreviewCardProps {
  product: PreviewProduct;
  formatPrice: (value: string | number) => string;
  mediaFit?: MediaFit;
  cardSignal?: CardSignal;
  ImageComponent?: ComponentType<PreviewImageProps>;
  className?: string;
}

export function ProductPreviewCard({
  product,
  formatPrice,
  mediaFit = "smart",
  cardSignal = "stock",
  ImageComponent,
  className,
}: ProductPreviewCardProps) {
  const displayVariants = useMemo(() => {
    const nonDefault = product.variants.filter(
      (v) => !(v.name === "Default" && Object.keys(v.optionValues ?? {}).length === 0),
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

  return (
    <div className={cn("opp-card", className)}>
      <div className="opp-card-media-wrap">
        <PreviewMedia
          src={imageUrl}
          alt={product.name}
          fit={mediaFit}
          className="opp-card-media"
          imageClassName={allSoldOut ? "opp-image-soldout" : undefined}
          ImageComponent={ImageComponent}
          fallback={
            <span className="opp-media-fallback">
              <ShoppingBagIcon />
            </span>
          }
        />

        <div className="opp-badges">
          {allSoldOut && <span className="opp-badge opp-badge-soldout">Sold out</span>}
          {!allSoldOut && firstVariant && firstVariant.availableStock <= 3 && (
            <span className="opp-badge opp-badge-low-stock">Only {firstVariant.availableStock} left</span>
          )}
          {isCombo && <span className="opp-badge opp-badge-combo">Combo</span>}
        </div>
      </div>

      <div className="opp-card-info">
        {product.brand && <p className="opp-card-brand">{product.brand}</p>}
        <p className="opp-card-name">{product.name}</p>

        <PreviewPrice
          price={price}
          compareAt={compareAt}
          range={hasOptions ? { min: minPrice, max: maxPrice } : undefined}
          muted={allSoldOut}
          showDiscount={!allSoldOut && !isCombo}
          formatPrice={formatPrice}
        />

        {isCombo && hasDiscount && !allSoldOut && (
          <p className="opp-combo-savings">
            Save {formatPrice(toNumber(compareAt!) - toNumber(price))} vs buying separately
          </p>
        )}

        <CardSignals product={product} soldOut={allSoldOut} cardSignal={cardSignal} />
      </div>
    </div>
  );
}

function CardSignals({
  product,
  soldOut,
  cardSignal,
}: {
  product: PreviewProduct;
  soldOut: boolean;
  cardSignal: CardSignal;
}) {
  if (soldOut) return null;

  if (cardSignal === "colour") {
    const colours = optionSummary(product, COLOUR_PATTERN).filter((c) => c.available);
    if (colours.length < 2) return null;
    return (
      <div className="opp-signal-row">
        {colours.slice(0, 5).map(({ value }) => {
          const colour = swatchColour(value);
          return colour ? (
            <span key={value} title={value} className="opp-swatch" style={{ background: colour }} />
          ) : (
            <span key={value} className="opp-signal-text">
              {value}
            </span>
          );
        })}
        {colours.length > 5 && <span className="opp-signal-text">+{colours.length - 5}</span>}
        <span className="opp-sr-only">
          {colours.length} colours available: {colours.map((c) => c.value).join(", ")}
        </span>
      </div>
    );
  }

  if (cardSignal === "size") {
    const sizes = optionSummary(product, SIZE_PATTERN);
    const inStock = sizes.filter((s) => s.available);
    if (sizes.length < 2) return null;
    return (
      <p className="opp-signal-text">
        {inStock.length === 0
          ? "No sizes left"
          : `Sizes ${inStock
              .slice(0, 4)
              .map((s) => s.value)
              .join(", ")}${inStock.length > 4 ? ` +${inStock.length - 4}` : ""}`}
      </p>
    );
  }

  const remaining = product.variants.reduce(
    (total, v) => total + (v.isSoldOut ? 0 : v.availableStock),
    0,
  );
  if (remaining > 0 && remaining <= 5) {
    return <p className="opp-signal-low-stock">Only {remaining} left</p>;
  }
  return null;
}
