"use client";

import { cn } from "./cn";
import { toNumber } from "./to-number";

/**
 * Ported from ordaro_retail/src/components/ui/price.tsx. Only real change:
 * `formatPrice` is a required prop instead of a `useFormatPrice()` hook read
 * from the storefront's cart context — this package can't depend on that.
 */

interface Props {
  price: string | number;
  compareAt?: string | number | null;
  /** When set and min !== max, renders "From {min}" instead. */
  range?: { min: number; max: number };
  muted?: boolean;
  size?: "sm" | "md" | "lg";
  /** Shows the saving as a chip beside the price. */
  showDiscount?: boolean;
  className?: string;
  formatPrice: (value: string | number) => string;
}

export function PreviewPrice({
  price,
  compareAt,
  range,
  muted = false,
  size = "sm",
  showDiscount = false,
  className,
  formatPrice,
}: Props) {
  const hasRange = range && range.min !== range.max;

  const shown = hasRange ? range.min : toNumber(price);
  const original = compareAt != null ? toNumber(compareAt) : null;
  const hasCompare = original != null && original > shown;
  const discountPct = hasCompare ? Math.round((1 - shown / original) * 100) : 0;

  return (
    <span className={cn("opp-price", className)}>
      <span className={cn("opp-price-amount", `opp-price-${size}`, muted && "opp-price-muted")}>
        {hasRange ? `From ${formatPrice(range.min)}` : formatPrice(price)}
      </span>

      {hasCompare && (
        <>
          <span className="opp-sr-only">Original price</span>
          <s className="opp-price-compare">{formatPrice(compareAt!)}</s>
        </>
      )}

      {hasCompare && showDiscount && discountPct > 0 && (
        <span className="opp-price-discount-chip">−{discountPct}%</span>
      )}
    </span>
  );
}
