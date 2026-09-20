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

const SMART_TOLERANCE = 0.15;

export interface PreviewImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  loading?: "lazy" | "eager";
  onLoad?: (event: { currentTarget: HTMLImageElement }) => void;
}

function DefaultImage({ src, alt, className, style, loading = "lazy", onLoad }: PreviewImageProps) {
  return (
    // eslint-disable-next-line jsx-a11y/alt-text -- alt is a required prop above
    <img src={src} alt={alt} className={className} style={style} loading={loading} onLoad={onLoad} />
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
  priority = false,
  className,
  imageClassName,
  fallback,
  ImageComponent = DefaultImage,
}: PreviewMediaProps) {
  const [smartFit, setSmartFit] = useState<"cover" | "contain">("cover");

  const isSmart = fit === "smart";
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
          loading={priority ? "eager" : "lazy"}
          className={cn(objectFit, imageClassName)}
          style={focal && objectFit === "opp-object-cover" ? { objectPosition: focal } : undefined}
          onLoad={
            isSmart
              ? (event) => {
                  const img = event.currentTarget;
                  const frame = img.parentElement;
                  if (!frame || !img.naturalWidth || !img.naturalHeight) return;
                  const frameRatio = frame.clientWidth / frame.clientHeight;
                  const imageRatio = img.naturalWidth / img.naturalHeight;
                  if (!frameRatio || !imageRatio) return;
                  const drift = Math.abs(imageRatio - frameRatio) / frameRatio;
                  setSmartFit(drift > SMART_TOLERANCE ? "contain" : "cover");
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
