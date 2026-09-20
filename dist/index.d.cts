import * as react from 'react';
import { CSSProperties, ReactNode, ComponentType } from 'react';

/**
 * The minimal shape this package needs from a product/variant — a subset of
 * `ordaro_retail`'s `ProductPublic`/`ProductVariantPublic`, so the real
 * storefront satisfies it for free, and a dashboard's in-progress (unsaved,
 * no real ids yet) draft can be adapted to it with a small mapper rather than
 * needing to fake a full storefront product shape.
 */
interface PreviewOptionValue {
    id: string;
    value: string;
}
interface PreviewOption {
    id: string;
    name: string;
    position: number;
    values: PreviewOptionValue[];
}
interface PreviewSelectedOption {
    optionValueId: string;
    optionValue: {
        value: string;
        optionId: string;
    };
}
interface PreviewVariant {
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
interface PreviewProduct {
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
type MediaFit = "cover" | "contain" | "smart";
/** Matches ordaro_retail's StorePreset['cardSignal'] exactly. */
type CardSignal = "colour" | "size" | "stock";

interface PreviewImageProps {
    src: string;
    alt: string;
    className?: string;
    style?: CSSProperties;
    loading?: "lazy" | "eager";
    /** Responsive-width hint. Ignored by the default plain-`<img>` renderer;
     *  a `next/image`-based adapter (always rendered in `fill` mode, since this
     *  frame is already the sized, positioned container) uses it directly. */
    sizes?: string;
    /** Above-the-fold hint — an injected `next/image` adapter maps this to its
     *  own `priority` prop; the default renderer maps it to `loading="eager"`. */
    priority?: boolean;
    onLoad?: (event: {
        currentTarget: HTMLImageElement;
    }) => void;
}
interface PreviewMediaProps {
    src?: string | null;
    alt: string;
    fit?: MediaFit;
    /** CSS aspect-ratio for the frame. Omit when the caller sizes the box. */
    ratio?: string;
    /** `object-position` for cover crops — keeps the product centred. */
    focal?: string;
    /** Forwarded to `ImageComponent` — see `PreviewImageProps.sizes`. */
    sizes?: string;
    priority?: boolean;
    className?: string;
    imageClassName?: string;
    fallback?: ReactNode;
    ImageComponent?: ComponentType<PreviewImageProps>;
}
declare function PreviewMedia({ src, alt, fit, ratio, focal, sizes, priority, className, imageClassName, fallback, ImageComponent, }: PreviewMediaProps): react.JSX.Element;

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
interface ProductPreviewCardProps {
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
declare function ProductPreviewCard({ product, formatPrice, mediaFit, cardSignal, sizes, priority, ImageComponent, renderMediaOverlay, renderName, className, }: ProductPreviewCardProps): react.JSX.Element;

/**
 * Ported from ordaro_retail/src/components/ui/price.tsx. Only real change:
 * `formatPrice` is a required prop instead of a `useFormatPrice()` hook read
 * from the storefront's cart context — this package can't depend on that.
 */
interface Props {
    price: string | number;
    compareAt?: string | number | null;
    /** When set and min !== max, renders "From {min}" instead. */
    range?: {
        min: number;
        max: number;
    };
    muted?: boolean;
    size?: "sm" | "md" | "lg";
    /** Shows the saving as a chip beside the price. */
    showDiscount?: boolean;
    className?: string;
    formatPrice: (value: string | number) => string;
}
declare function PreviewPrice({ price, compareAt, range, muted, size, showDiscount, className, formatPrice, }: Props): react.JSX.Element;

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
declare const SIZE_PATTERN: RegExp;
declare const COLOUR_PATTERN: RegExp;
declare function variantOptionValue(product: Pick<PreviewProduct, "options">, variant: PreviewVariant, pattern: RegExp): string | null;
/**
 * Distinct values for an option across a product, in the merchant's own order,
 * each flagged with whether anything is still in stock for it.
 */
declare function optionSummary(product: Pick<PreviewProduct, "options" | "variants">, pattern: RegExp): Array<{
    value: string;
    available: boolean;
}>;

/**
 * Turning a merchant's colour name into a colour we can actually show.
 *
 * Used by the option picker and the product card. A wrong swatch is worse than
 * no swatch — she buys against that square — so anything we cannot resolve
 * confidently stays a written name.
 *
 * Ported verbatim from ordaro_retail/src/lib/colour.ts — this package exists
 * specifically so this logic has one home, not two.
 */
/** A CSS colour for this value, or null when we cannot be sure. */
declare function swatchColour(value: string): string | null;

/** Ported verbatim from ordaro_retail/src/lib/api.ts. */
declare function toNumber(value: string | number | null | undefined): number;

export { COLOUR_PATTERN, type CardSignal, type MediaFit, type PreviewImageProps, PreviewMedia, type PreviewMediaProps, type PreviewOption, type PreviewOptionValue, PreviewPrice, type PreviewProduct, type PreviewSelectedOption, type PreviewVariant, ProductPreviewCard, type ProductPreviewCardProps, SIZE_PATTERN, optionSummary, swatchColour, toNumber, variantOptionValue };
