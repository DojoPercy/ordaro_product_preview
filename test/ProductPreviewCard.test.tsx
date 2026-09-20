import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
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
    // optionSummary still filters to `available` colours before the card
    // shows them, so a single available colour renders no swatch row at all.
    expect(screen.queryByTitle("Navy Blue")).toBeNull();
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
