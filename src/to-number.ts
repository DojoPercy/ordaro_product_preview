/** Ported verbatim from ordaro_retail/src/lib/api.ts. */
export function toNumber(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  return typeof value === "number" ? value : parseFloat(value);
}
