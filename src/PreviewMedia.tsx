"use client";

import { useState, type ComponentType, type CSSProperties, type ReactNode } from "react";
import { ShoppingBagIcon } from "./ShoppingBagIcon";
import { cn } from "./cn";
import type { MediaFit } from "./types";

/**
 * Ported from ordaro_retail/src/components/product/ProductMedia.tsx — same
 * `smart` cover/contain-settling logic, with two deliberate differences so
 * this package has no opinion on either consuming app's stack:
 *
 * 1. No `next/image` — both apps are on different Next major versions, and a
 *    package that hard-codes one would be fragile in the other. Renders a
 *    plain `<img>` by default; a consumer that wants `next/image`'s
 *    optimization (the real storefront does) injects it via `ImageComponent`.
 * 2. `fit` is an explicit prop instead of reading a store-preset context hook
 *    — this package can't depend on either app's context providers.
 */

const SMART_TOLERANCE = 0.45;

export interface PreviewImageProps {
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
  onLoad?: (event: { currentTarget: HTMLImageElement }) => void;
}

function DefaultImage({ src, alt, className, style, priority, onLoad }: PreviewImageProps) {
  return (
    // eslint-disable-next-line jsx-a11y/alt-text -- alt is a required prop above
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading={priority ? "eager" : "lazy"}
      onLoad={onLoad}
    />
  );
}

export interface PreviewMediaProps {
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

export function PreviewMedia({
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
  ImageComponent = DefaultImage,
}: PreviewMediaProps) {
  const [containSrc, setContainSrc] = useState<string | null>(null);

  const isSmart = fit === "smart";
  const smartFit: "cover" | "contain" = src && containSrc === src ? "contain" : "cover";
  const objectFit =
    fit === "cover"
      ? "opp-object-cover"
      : fit === "contain"
        ? "opp-object-contain"
        : smartFit === "contain"
          ? "opp-object-contain"
          : "opp-object-cover";

  return (
    <div
      className={cn("opp-media-frame", className)}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      {src ? (
        <ImageComponent
          src={src}
          alt={alt}
          sizes={sizes}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          className={cn(objectFit, imageClassName)}
          style={
            objectFit === "opp-object-cover"
              ? { objectPosition: focal ?? "50% 22%" }
              : undefined
          }
          onLoad={
            isSmart && src
              ? (event) => {
                  const img = event.currentTarget;
                  const frame = img.parentElement;
                  if (!frame || !img.naturalWidth || !img.naturalHeight) return;
                  const frameRatio = frame.clientWidth / frame.clientHeight;
                  const imageRatio = img.naturalWidth / img.naturalHeight;
                  if (!frameRatio || !imageRatio) return;
                  const drift = Math.abs(imageRatio - frameRatio) / frameRatio;
                  setContainSrc(drift > SMART_TOLERANCE ? src : null);
                }
              : undefined
          }
        />
      ) : (
        (fallback ?? (
          <span className="opp-media-fallback">
            <ShoppingBagIcon />
          </span>
        ))
      )}
    </div>
  );
}
