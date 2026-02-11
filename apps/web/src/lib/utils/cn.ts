/**
 * Utility function to merge Tailwind CSS classes
 * Simple implementation that filters out falsy values and joins classes
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

