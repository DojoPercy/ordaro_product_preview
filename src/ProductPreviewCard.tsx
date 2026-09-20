"use client";

import { useMemo, type ComponentType, type ReactNode } from "react";
import { ShoppingBagIcon } from "./ShoppingBagIcon";
import { cn } from "./cn";
import { toNumber } from "./to-number";
import { PreviewMedia, type PreviewImageProps } from "./PreviewMedia";
import { PreviewPrice } from "./PreviewPrice";
import { optionSummary, SIZE_PATTERN, COLOUR_PATTERN } from "./product-options";
import { swatchColour } from "./colour";
import type { CardSignal, MediaFit, PreviewProduct } from "./types";

/**
 * Ported from ordaro_retail/src/components/storefront/ProductCard.tsx.
 *
 * Renders the photo, badges, name, price and signal line — everything that
 * answers "what will a customer actually see" — with no opinion on
 * navigation, wishlist, or add-to-cart, since a dashboard preview has no use
 * for those. Real storefront interactivity (a stretched link, a wishlist
 * heart, a quick-add button, a hover-image swap) is layered on top through
 * `renderMediaOverlay`/`renderName`, which `ordaro_retail`'s own `ProductCard`
 * supplies — so the composed, real card still renders through this one
 * component, rather than duplicating its layout to add those affordances.
 */

export interface ProductPreviewCardProps {
  product: PreviewProduct;
  formatPrice: (value: string | number) => string;
  mediaFit?: MediaFit;
  cardSignal?: CardSignal;
  /** Forwarded to the image frame — see `PreviewImageProps`. */
  sizes?: string;
  priority?: boolean;
  ImageComponent?: ComponentType<PreviewImageProps>;
  /** Rendered last inside the image frame (which is `position: relative`,
   *  `overflow: hidden`) — a stretched link, wishlist button, quick-add bar,
   *  or a second hover-swap image all belong here. Absent in a plain preview. */
  renderMediaOverlay?: () => ReactNode;
  /** Wraps the product name — e.g. a real `next/link` in the storefront.
   *  Defaults to plain text. */
  renderName?: (name: string) => ReactNode;
  className?: string;
}

export function ProductPreviewCard({
  product,
  formatPrice,
  mediaFit = "smart",
  cardSignal = "stock",
  sizes,
  priority,
  ImageComponent,
  renderMediaOverlay,
  renderName,
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
          sizes={sizes}
          priority={priority}
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

        {renderMediaOverlay?.()}
      </div>

      <div className="opp-card-info">
        {product.brand && <p className="opp-card-brand">{product.brand}</p>}
        {renderName ? renderName(product.name) : <p className="opp-card-name">{product.name}</p>}

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
