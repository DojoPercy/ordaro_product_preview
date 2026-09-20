/**
 * jsdom provides no `CSS` global at all (confirmed: `typeof CSS` is
 * `undefined` under jsdom), so `swatchColour`'s `CSS.supports?.('color', ...)`
 * branch — which resolves plain CSS colour keywords like "black" or the
 * "navy" in "Navy Blue" — is untestable without a stand-in. A real browser
 * (where this code actually runs) has a real `CSS.supports`; this mock covers
 * just the keywords these tests need, not a full CSS colour validator.
 */
const KNOWN_CSS_COLOURS = new Set(["black", "white", "navy", "red", "green", "blue"]);

(globalThis as unknown as { CSS: { supports: (prop: string, value: string) => boolean } }).CSS = {
  supports: (_prop: string, value: string) => KNOWN_CSS_COLOURS.has(value),
};
