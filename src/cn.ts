import clsx, { type ClassValue } from "clsx";

/**
 * No `tailwind-merge` here on purpose — this package ships plain, prefixed CSS
 * (see styles.css), never Tailwind utility classes, so there's nothing for a
 * Tailwind-aware merge to resolve conflicts between.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
