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

/** Colour names retail uses that CSS has never heard of. */
const COLOUR_ALIASES: Record<string, string> = {
  nude: '#e3bc9a',
  cream: '#fffdd0',
  wine: '#722f37',
  burgundy: '#800020',
  champagne: '#f7e7ce',
  mustard: '#ffdb58',
  rust: '#b7410e',
  taupe: '#483c32',
  charcoal: '#36454f',
  offwhite: '#faf9f6',
  camel: '#c19a6b',
  emerald: '#50c878',
  royalblue: '#4169e1',
  babyblue: '#89cff0',
  blush: '#de5d83',
  peach: '#ffe5b4',
  mocha: '#967969',
  sand: '#c2b280',
  // Compound names whose base word (baby, rose, army) isn't a colour on its
  // own, so the family-suffix fallback below can't reach them either.
  babypink: '#f4c2c2',
  rosegold: '#b76e79',
  armygreen: '#4b5320',
  dustypink: '#d8a39d',
}

/** Colour-family words merchants tack onto a base name — "Navy BLUE", "Rose
 *  GOLD", "Wine RED". CSS has no compound keyword for most of these (it has
 *  `skyblue` and `hotpink`, coincidentally, but not `navyblue` or `winered`),
 *  so without this a merchant's colour swatches work or don't for reasons
 *  invisible to them — the exact "some colours show, some don't" complaint
 *  this list exists to close. */
const COLOUR_FAMILY_SUFFIXES = ['blue', 'red', 'green', 'grey', 'gray', 'gold', 'pink', 'brown', 'yellow']

/** A CSS colour for this value, or null when we cannot be sure. */
export function swatchColour(value: string): string | null {
  const key = value.trim().toLowerCase()
  const compact = key.replace(/\s+/g, '')
  if (COLOUR_ALIASES[key]) return COLOUR_ALIASES[key]!
  if (COLOUR_ALIASES[compact]) return COLOUR_ALIASES[compact]!
  // CSS knows 148 names — Black, Navy, Beige, Khaki all resolve here. Only
  // available in the browser, which is where swatches are rendered.
  if (typeof CSS !== 'undefined' && CSS.supports?.('color', compact)) return compact

  // "Navy Blue" -> try "navy" alone. Only for a genuine two-word name (not
  // "Blue" by itself, which already resolved above if it were valid) — this
  // is a fallback for the base word, never a guess at an unrelated colour.
  const words = key.split(/\s+/)
  if (words.length === 2 && COLOUR_FAMILY_SUFFIXES.includes(words[1]!)) {
    const base = words[0]!
    if (COLOUR_ALIASES[base]) return COLOUR_ALIASES[base]!
    if (typeof CSS !== 'undefined' && CSS.supports?.('color', base)) return base
  }
  return null
}
