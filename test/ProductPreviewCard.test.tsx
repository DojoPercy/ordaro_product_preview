import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { PreviewMedia } from "../src/PreviewMedia";
import { ProductPreviewCard } from "../src/ProductPreviewCard";
import {
  bundleProduct,
  formatPrice,
  multiVariantColourProduct,
  singleVariantProduct,
  soldOutProduct,
} from "./fixtures";

describe("ProductPreviewCard", () => {
  it("renders a single-variant product with its price", () => {
    render(<ProductPreviewCard product={singleVariantProduct} formatPrice={formatPrice} />);
    expect(screen.getByText("Ankara Wrap Dress")).toBeTruthy();
    expect(screen.getByText(formatPrice(180))).toBeTruthy();
    expect(screen.queryByText("Sold out")).toBeNull();
  });

  it("renders a price range and colour swatches for a multi-variant product", () => {
    render(
      <ProductPreviewCard
        product={multiVariantColourProduct}
        formatPrice={formatPrice}
        cardSignal="colour"
      />,
    );
    expect(screen.getByText(`From ${formatPrice(250)}`)).toBeTruthy();
    // Only the in-stock variant's colour ("Navy Blue") counts as available;
    // the sold-out colour ("Wine") is filtered out.
    expect(screen.getByTitle("Navy Blue")).toBeTruthy();
    expect(screen.queryByTitle("Wine")).toBeNull();
  });

  it("shows the Sold out badge and mutes the price when every variant is out of stock", () => {
    render(<ProductPreviewCard product={soldOutProduct} formatPrice={formatPrice} />);
    expect(screen.getByText("Sold out")).toBeTruthy();
  });

  it("shows the Combo badge and savings line for a bundle", () => {
    render(<ProductPreviewCard product={bundleProduct} formatPrice={formatPrice} />);
    expect(screen.getByText("Combo")).toBeTruthy();
    expect(screen.getByText(`Save ${formatPrice(100)} vs buying separately`)).toBeTruthy();
  });
});

describe("PreviewMedia smart fit", () => {
  function setDimensions(
    img: HTMLImageElement,
    frame: HTMLElement,
    size: { nw: number; nh: number; cw: number; ch: number },
  ) {
    Object.defineProperty(frame, "clientWidth", { configurable: true, value: size.cw });
    Object.defineProperty(frame, "clientHeight", { configurable: true, value: size.ch });
    Object.defineProperty(img, "naturalWidth", { configurable: true, value: size.nw });
    Object.defineProperty(img, "naturalHeight", { configurable: true, value: size.nh });
  }

  it("keeps 1:1 photos in opp-object-cover inside a 3:4 frame, switches 16:9 panoramic to opp-object-contain, and resets when src changes", () => {
    const { rerender } = render(
      <PreviewMedia src="https://example.com/square.jpg" alt="Square photo" fit="smart" />,
    );
    const img = screen.getByAltText("Square photo") as HTMLImageElement;
    const frame = img.parentElement!;

    // 1:1 image in a 3:4 (300x400) frame -> 33.3% drift <= 45% threshold -> stays cover
    setDimensions(img, frame, { nw: 1000, nh: 1000, cw: 300, ch: 400 });
    fireEvent.load(img);
    expect(img.className).toContain("opp-object-cover");
    expect(img.className).not.toContain("opp-object-contain");

    // 16:9 panoramic image in a 3:4 (300x400) frame -> ~137% drift > 45% -> switches to contain
    rerender(
      <PreviewMedia src="https://example.com/wide.jpg" alt="Square photo" fit="smart" />,
    );
    expect(img.className).toContain("opp-object-cover");
    setDimensions(img, frame, { nw: 1600, nh: 900, cw: 300, ch: 400 });
    fireEvent.load(img);
    expect(img.className).toContain("opp-object-contain");

    // Changing src immediately resets back to cover for the new image
    rerender(
      <PreviewMedia src="https://example.com/next.jpg" alt="Square photo" fit="smart" />,
    );
    expect(img.className).toContain("opp-object-cover");
    expect(img.className).not.toContain("opp-object-contain");
  });
});
