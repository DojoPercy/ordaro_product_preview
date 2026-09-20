import type { PreviewProduct, PreviewVariant } from "./types";

/**
 * Reading size and colour off a product, wherever the merchant put them.
 *
 * Two shapes exist in the wild: structured options with their own ids, and an
 * older name→value map on the variant. Ported verbatim from
 * ordaro_retail/src/lib/product-options.ts — the fallback path (the
 * `Object.entries(variant.optionValues)` loop below) is what lets an
 * in-progress dashboard draft, which has no real option ids yet, satisfy this
 * exact same logic with no special-casing.
 */

export const SIZE_PATTERN = /size|length/i;
export const COLOUR_PATTERN = /colou?r|shade/i;

export function variantOptionValue(
  product: Pick<PreviewProduct, "options">,
  variant: PreviewVariant,
  pattern: RegExp,
): string | null {
  const option = (product.options ?? []).find((o) => pattern.test(o.name));
  if (option) {
    const match = (variant.selectedOptions ?? []).find(
      (so) => so.optionValue?.optionId === option.id,
    );
    if (match?.optionValue?.value) return match.optionValue.value;
  }
  for (const [key, value] of Object.entries(variant.optionValues ?? {})) {
    if (pattern.test(key) && typeof value === "string" && value.trim()) return value;
  }
  return null;
}

/**
 * Distinct values for an option across a product, in the merchant's own order,
 * each flagged with whether anything is still in stock for it.
 */
export function optionSummary(
  product: Pick<PreviewProduct, "options" | "variants">,
  pattern: RegExp,
): Array<{ value: string; available: boolean }> {
  const seen = new Map<string, boolean>();

  for (const variant of product.variants) {
    const value = variantOptionValue(product, variant, pattern);
    if (!value) continue;
    const available = !variant.isSoldOut && variant.availableStock > 0;
    // Any in-stock variant makes the value available.
    seen.set(value, (seen.get(value) ?? false) || available);
  }

  return [...seen.entries()].map(([value, available]) => ({ value, available }));
}
