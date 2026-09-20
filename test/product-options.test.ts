import { describe, expect, it } from "vitest";
import { optionSummary, variantOptionValue, COLOUR_PATTERN, SIZE_PATTERN } from "../src/product-options";
import { draftLikeProduct, multiVariantColourProduct } from "./fixtures";

describe("variantOptionValue", () => {
  it("reads a structured option via selectedOptions when option ids exist", () => {
    const variant = multiVariantColourProduct.variants[0]!;
    expect(variantOptionValue(multiVariantColourProduct, variant, COLOUR_PATTERN)).toBe("Navy Blue");
  });

  it("falls back to the plain optionValues name→value map when there are no option ids", () => {
    // This is the shape an unsaved dashboard draft has — no real option/value
    // ids yet, just a name keyed map — and it must resolve with zero
    // special-casing on the caller's side.
    const variant = draftLikeProduct.variants[0]!;
    expect(variantOptionValue(draftLikeProduct, variant, SIZE_PATTERN)).toBe("Small");
    expect(variantOptionValue(draftLikeProduct, variant, COLOUR_PATTERN)).toBe("Red");
  });
});

describe("optionSummary", () => {
  it("flags a value as available only if at least one in-stock variant has it", () => {
    const summary = optionSummary(multiVariantColourProduct, COLOUR_PATTERN);
    const navy = summary.find((s) => s.value === "Navy Blue");
    const wine = summary.find((s) => s.value === "Wine");
    expect(navy?.available).toBe(true);
    expect(wine?.available).toBe(false);
  });

  it("works against the draft-shaped (no option ids) product too", () => {
    const summary = optionSummary(draftLikeProduct, SIZE_PATTERN);
    expect(summary).toEqual([
      { value: "Small", available: true },
      { value: "Large", available: false },
    ]);
  });
});
