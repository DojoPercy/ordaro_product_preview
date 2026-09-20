/**
 * The minimal shape this package needs from a product/variant — a subset of
 * `ordaro_retail`'s `ProductPublic`/`ProductVariantPublic`, so the real
 * storefront satisfies it for free, and a dashboard's in-progress (unsaved,
 * no real ids yet) draft can be adapted to it with a small mapper rather than
 * needing to fake a full storefront product shape.
 */

export interface PreviewOptionValue {
  id: string;
  value: string;
}

export interface PreviewOption {
  id: string;
  name: string;
  position: number;
  values: PreviewOptionValue[];
}

export interface PreviewSelectedOption {
  optionValueId: string;
  optionValue: { value: string; optionId: string };
}

export interface PreviewVariant {
  id: string;
  name: string;
  optionValues: Record<string, unknown> | null;
  selectedOptions?: PreviewSelectedOption[];
  price: string | number;
  compareAtPrice: string | number | null;
  images: string[];
  availableStock: number;
  isSoldOut: boolean;
}

export interface PreviewProduct {
  id: string;
  name: string;
  brand: string | null;
  productType?: "STANDARD" | "BUNDLE";
  basePrice: string | number;
  compareAtPrice: string | number | null;
  images: string[];
  options?: PreviewOption[];
  variants: PreviewVariant[];
}

export type MediaFit = "cover" | "contain" | "smart";
/** Matches ordaro_retail's StorePreset['cardSignal'] exactly. */
export type CardSignal = "colour" | "size" | "stock";
