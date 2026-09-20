import type { PreviewProduct } from "../src/types";

export const formatPrice = (value: string | number) =>
  new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(
    typeof value === "number" ? value : parseFloat(value),
  );

export const singleVariantProduct: PreviewProduct = {
  id: "p1",
  name: "Ankara Wrap Dress",
  brand: null,
  productType: "STANDARD",
  basePrice: 180,
  compareAtPrice: null,
  images: ["https://example.com/dress.jpg"],
  variants: [
    {
      id: "v1",
      name: "Default",
      optionValues: {},
      price: 180,
      compareAtPrice: null,
      images: [],
      availableStock: 12,
      isSoldOut: false,
    },
  ],
};

export const multiVariantColourProduct: PreviewProduct = {
  id: "p2",
  name: "Kente Trim Kaftan",
  brand: "Adwoa Studio",
  productType: "STANDARD",
  basePrice: 250,
  compareAtPrice: 300,
  images: ["https://example.com/kaftan.jpg"],
  options: [
    { id: "o1", name: "Color", position: 0, values: [
      { id: "ov1", value: "Navy Blue" },
      { id: "ov2", value: "Wine" },
    ] },
  ],
  variants: [
    {
      id: "v1",
      name: "Navy Blue",
      optionValues: { Color: "Navy Blue" },
      selectedOptions: [{ optionValueId: "ov1", optionValue: { value: "Navy Blue", optionId: "o1" } }],
      price: 250,
      compareAtPrice: 300,
      images: [],
      availableStock: 4,
      isSoldOut: false,
    },
    {
      id: "v2",
      name: "Wine",
      optionValues: { Color: "Wine" },
      selectedOptions: [{ optionValueId: "ov2", optionValue: { value: "Wine", optionId: "o1" } }],
      price: 275,
      compareAtPrice: 300,
      images: [],
      availableStock: 0,
      isSoldOut: true,
    },
  ],
};

export const soldOutProduct: PreviewProduct = {
  ...singleVariantProduct,
  id: "p3",
  name: "Sold Out Sandals",
  variants: [{ ...singleVariantProduct.variants[0]!, isSoldOut: true, availableStock: 0 }],
};

export const bundleProduct: PreviewProduct = {
  id: "p4",
  name: "Weekend Starter Pack",
  brand: null,
  productType: "BUNDLE",
  basePrice: 400,
  compareAtPrice: 500,
  images: ["https://example.com/bundle.jpg"],
  variants: [
    {
      id: "v1",
      name: "Default",
      optionValues: {},
      price: 400,
      compareAtPrice: 500,
      images: [],
      availableStock: 6,
      isSoldOut: false,
    },
  ],
};

/** No option ids at all — the exact shape an unsaved dashboard draft has. */
export const draftLikeProduct: PreviewProduct = {
  id: "draft-1",
  name: "New Product (unsaved)",
  brand: null,
  productType: "STANDARD",
  basePrice: 50,
  compareAtPrice: null,
  images: [],
  variants: [
    {
      id: "draft-v1",
      name: "Small / Red",
      optionValues: { Size: "Small", Color: "Red" },
      price: 50,
      compareAtPrice: null,
      images: [],
      availableStock: 3,
      isSoldOut: false,
    },
    {
      id: "draft-v2",
      name: "Large / Red",
      optionValues: { Size: "Large", Color: "Red" },
      price: 55,
      compareAtPrice: null,
      images: [],
      availableStock: 0,
      isSoldOut: true,
    },
  ],
};
