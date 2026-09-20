import { describe, expect, it } from "vitest";
import { swatchColour } from "../src/colour";

describe("swatchColour", () => {
  it("resolves a known alias", () => {
    expect(swatchColour("Nude")).toBe("#e3bc9a");
  });

  it("resolves a plain CSS colour name", () => {
    expect(swatchColour("Black")).toBe("black");
  });

  it("falls back to the base word of a two-word family name", () => {
    expect(swatchColour("Navy Blue")).toBe("navy");
  });

  it("resolves a compound alias that has no base-word fallback", () => {
    expect(swatchColour("Rose Gold")).toBeTruthy();
  });

  it("returns null for a name it cannot resolve confidently", () => {
    expect(swatchColour("Ankara Print")).toBeNull();
  });
});
